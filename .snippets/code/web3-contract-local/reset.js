const Web3 = require('web3');
const { abi } = require('./compile');

const providerRPC = {
  development: 'http://localhost:9944',
  moonbase: 'https://rpc.api.moonbase.moonbeam.network',
};
const web3 = new Web3(providerRPC.development); // Change to correct network

const accountFrom = {
  privateKey: 'INSERT_YOUR_PRIVATE_KEY',
};
const contractAddress = 'INSERT_CONTRACT_ADDRESS';

const incrementer = new web3.eth.Contract(abi, contractAddress);
const resetTx = incrementer.methods.reset();

const reset = async () => {
  console.log(`Calling the reset function in contract at address: ${contractAddress}`);

  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      to: contractAddress,
      data: resetTx.encodeABI(),
      gas: await resetTx.estimateGas(),
    },
    accountFrom.privateKey
  );

  const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
  console.log(`Tx successful with hash: ${createReceipt.transactionHash}`);
};

reset();