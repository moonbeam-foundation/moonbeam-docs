const ethers = require('ethers');
const contractFile = require('./compile');

// Initialization
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;
const privKey =
   '0x99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342'; // Genesis private key
const providerURL = 'http://localhost:9933';
// Define Provider
let provider = new ethers.providers.JsonRpcProvider(providerURL);
// Create Wallet
let wallet = new ethers.Wallet(privKey, provider);

// Deploy contract
const incrementer = new ethers.ContractFactory(abi, bytecode, wallet);
const deploy = async () => {
   console.log(`Attempting to deploy from account: ${wallet.address}`);

   // Deploy contract with initialNumber set to 5
   const contract = await incrementer.deploy([5]);
   await contract.deployed();

   console.log(`Contract deployed at address ${contract.address}`);
};

deploy();
