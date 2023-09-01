const Web3 = require('web3');
const contractFile = require('./compile');

const providerRPC = {
  development: 'http://localhost:9944',
  moonbase: 'https://rpc.api.moonbase.moonbeam.network',
};
const web3 = new Web3(providerRPC.development); // Change to correct network

const accountFrom = {
  privateKey: 'INSERT_YOUR_PRIVATE_KEY',
  address: 'INSERT_PUBLIC_ADDRESS_OF_PK',
};
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

const deploy = async () => {
  console.log(`Attempting to deploy from account ${accountFrom.address}`);

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
    accountFrom.privateKey
  );

  const createReceipt = await web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction
  );
  console.log(`Contract deployed at address: ${createReceipt.contractAddress}`);
};

deploy();
