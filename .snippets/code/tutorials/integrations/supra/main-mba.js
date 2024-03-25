const PullServiceClient = require('./pullServiceClient');
const oracleProofABI = require('./resources/oracleProof.json');
const signedCoherentClusterABI = require('./resources/signedCoherentCluster.json');
const { Web3 } = require('web3');
const oracleClientABI = require('./resources/oracleClient.json');
const feedClientABI = require('./resources/feedClient.json'); 

const web3 = new Web3('https://rpc.api.moonbase.moonbeam.network');
const pairIndex = 1;

// Function that fetches proof data from the gRPC server using the specified parameters
const getProofs = () => {
  const address = 'testnet-dora.supraoracles.com';
  const client = new PullServiceClient(address);

  const request = {
    pair_indexes: [pairIndex], // ETH_USDT
    chain_type: 'evm',
  };

  return new Promise((resolve, reject) => {
    client.getProof(request, (err, response) => {
      if (err) {
        console.error('Error:', err.details);
        return;
      }
      resolve(response);
    });
  });
};

// Function to convert the proof data to human-readable price data
const deserializeProofBytes = (proofHex) => {
  const proof_data = web3.eth.abi.decodeParameters(oracleProofABI, proofHex);
  // Fatching the raw bytes of the signed pair cluster data
  const clusters = proof_data[0].clustersRaw;
  // Fetching which pair IDs have been requested
  const pairMask = proof_data[0].pairMask;

  // Helps in iterating the vector of pair masking
  let pair = 0;
  // Lists of all the pair IDs, prices, decimals, and timestamps requested
  const pairId = [];
  const pairPrice = [];
  const pairDecimal = [];
  const pairTimestamp = [];

  for (let i = 0; i < clusters.length; ++i) {
    // Deserialize the raw bytes of the signed pair cluster data
    const scc = web3.eth.abi.decodeParameters(
      signedCoherentClusterABI,
      clusters[i]
    );

    for (let j = 0; j < scc[0].cc.pair.length; ++j) {
      pair += 1;
      // Verify whether the pair is requested or not
      if (!pairMask[pair - 1]) {
        continue;
      }
      // Pushing the pair IDs, prices, decimals, and timestamps requested in the output vector
      pairId.push(scc[0].cc.pair[j].toString(10));
      pairPrice.push(scc[0].cc.prices[j].toString(10));
      pairDecimal.push(scc[0].cc.decimals[j].toString(10));
      pairTimestamp.push(scc[0].cc.timestamp[j].toString(10));
    }
  }

  console.log('----- Deserialized Data ------');
  console.log('Pair index : ', pairId);
  console.log('Pair Price : ', pairPrice);
  console.log('Pair Decimal : ', pairDecimal);
  console.log('Pair Timestamp : ', pairTimestamp);
  console.log('------------------------------');
};

// Function to call the Oracle client to verify and publish the latest price data
const callContract = async (proofHex) => {
  const contractAddress = 'INSERT_CONTRACT_ADDRESS';
  const contract = new web3.eth.Contract(oracleClientABI, contractAddress);

  // Create the transaction object using the hex-formatted proof and the index of the
  // data pair you requested price data for
  const txData = contract.methods.GetPairPrice(proofHex, pairIndex).encodeABI();
  const gasEstimate = await contract.methods
    .GetPairPrice(proofHex, pairIndex)
    .estimateGas();
  const transactionObject = {
    from: 'INSERT_ADDRESS',
    to: contractAddress,
    data: txData,
    gas: gasEstimate,
    gasPrice: await web3.eth.getGasPrice(),
  };

  // Sign the transaction with the private key
  const signedTransaction = await web3.eth.accounts.signTransaction(
    transactionObject,
    'INSERT_PRIVATE_KEY'
  );

  // Send the signed transaction
  return await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
};

// Function to get the most recently published on-chain price data
const getPriceData = async (index) => {
  const contractAddress = 'INSERT_CONTRACT_ADDRESS';
  const contract = new web3.eth.Contract(feedClientABI, contractAddress);

  // Get the price data and log it to the console
  const priceData = await contract.methods.getPrice(index).call();
  console.log('----- On-Chain Price Data ------');
  console.log('Round : ', priceData[0]);
  console.log('Decimals : ', priceData[1]);
  console.log('Timestamp : ', priceData[2]);
  console.log('Price : ', priceData[3]);
};

const main = async () => {
  const proofs = await getProofs();

  // Convert oracle proof bytes to hex
  const hex = web3.utils.bytesToHex(proofs.evm.proof_bytes);
  deserializeProofBytes(hex);

  // Verify and write the latest price data on-chain
  const receipt = await callContract(hex);
  console.log('Transaction receipt:', receipt);

  // Get the latest price data
  await getPriceData(pairIndex);
};

main();
