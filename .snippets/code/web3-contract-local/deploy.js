const Web3 = require('web3');
const contractFile = require('./compile');

const providerRPC = {
  development: 'http://localhost:9933',
  moonbase: 'https://rpc.api.moonbase.moonbeam.network',
};
const web3 = new Web3(providerRPC.development); // Change to correct network

const account_from = {
  privateKey: 'YOUR-PRIVATE-KEY-HERE',
  address: 'PUBLIC-ADDRESS-OF-PK-HERE',
};
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

const deploy = async () => {
  console.log(`Attempting to deploy from account ${account_from.address}`);

  const incrementer = new web3.eth.Contract(abi);

  const incrementerTx = incrementer.deploy({
    data: bytecode,
    arguments: [5],
  });

  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      data: incrementerTx.encodeABI(),
      gas: await incrementerTx.estimateGas(),
    },
    account_from.privateKey
  );

  const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
  console.log(`Contract deployed at address: ${createReceipt.contractAddress}`);
};

deploy();