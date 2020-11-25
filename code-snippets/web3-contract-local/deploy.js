const Web3 = require('web3');
const contractFile = require('./compile');

// Initialization
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;
const privKey =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342'; // Genesis private key
const address = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
const web3 = new Web3('http://localhost:9933');

// Deploy contract
const deploy = async () => {
   console.log(`Attempting to deploy from account: ${address}`);

   const incrementer = new web3.eth.Contract(abi);

   const incrementerTx = incrementer.deploy({
      data: bytecode,
      arguments: [5],
   });

   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         from: address,
         data: incrementerTx.encodeABI(),
         gas: await incrementerTx.estimateGas(),
      },
      privKey
   );

   const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
   );
   console.log(`Contract deployed at address ${createReceipt.contractAddress}`);
};

deploy();
