// 1. Import web3 and the contract file
const { Web3 } = require('web3');
const contractFile = require('./compile');

// 2. Add the Web3 provider logic
const providerRPC = {
  development: 'http://localhost:9944',
  moonbase: 'https://rpc.api.moonbase.moonbeam.network',
};
const web3 = new Web3(providerRPC.moonbase); // Change to correct network

// 3. Create address variables
const accountFrom = {
  privateKey: 'INSERT_YOUR_PRIVATE_KEY',
  address: 'INSERT_PUBLIC_ADDRESS_OF_PK',
};

// 4. Get the bytecode and API
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

// 5. Create deploy function
const deploy = async () => {
  console.log(`Attempting to deploy from account ${accountFrom.address}`);

  // 6. Create contract instance
  const incrementer = new web3.eth.Contract(abi);

  // 7. Create constructor transaction
  const incrementerTx = incrementer.deploy({
    data: bytecode,
    arguments: [5],
  });

  // 8. Sign transaction with PK
  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      data: incrementerTx.encodeABI(),
      gas: await incrementerTx.estimateGas(),
      gasPrice: await web3.eth.getGasPrice(),
      nonce: await web3.eth.getTransactionCount(accountFrom.address),
    },
    accountFrom.privateKey
  );

  // 9. Send transaction and wait for receipt
  const createReceipt = await web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction
  );
  console.log(`Contract deployed at address: ${createReceipt.contractAddress}`);
};

// 10. Call deploy function
deploy();
