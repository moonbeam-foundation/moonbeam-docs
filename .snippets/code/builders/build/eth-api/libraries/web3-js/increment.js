// 1. Import Web3js and the contract abi

const Web3 = require('web3');
const { abi } = require('./compile');

// 2. Add the Web3 provider logic here:
const providerRPC = {
  development: 'http://localhost:9944',
  moonbase: 'https://rpc.api.moonbase.moonbeam.network',
};
const web3 = new Web3(providerRPC.moonbase); //Change to correct network

// 3. Create variables
const accountFrom = {
  privateKey: 'INSERT_YOUR_PRIVATE_KEY',
  address: 'INSERT_PUBLIC_ADDRESS_OF_PK',
};
const contractAddress = 'INSERT_CONTRACT_ADDRESS';
const _value = 3;

// 4. Create contract instance
const incrementer = new web3.eth.Contract(abi, contractAddress);

// 5. Build increment tx
const incrementTx = incrementer.methods.increment(_value);

// 6. Create increment function
const increment = async () => {
  console.log(
    `Calling the increment by ${_value} function in contract at address: ${contractAddress}`
  );

  // 7. Prepare and Sign Tx with PK
  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      to: contractAddress,
      data: incrementTx.encodeABI(),
      gas: await incrementTx.estimateGas(),
      gasPrice: await web3.eth.getGasPrice(),
      nonce: await web3.eth.getTransactionCount(accountFrom.address),
    },
    accountFrom.privateKey
  );

  // 8. Send Tx and Wait for Receipt
  const createReceipt = await web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction
  );
  console.log(`Tx successful with hash: ${createReceipt.transactionHash}`);
};

// 9. Call increment function
increment();
