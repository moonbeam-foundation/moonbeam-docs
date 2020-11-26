const ethers = require('ethers');
const { abi } = require('./compile');

// Initialization
const privKey =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342'; // Genesis private key
const contractAddress = '0xC2Bf5F29a4384b1aB0C063e1c666f02121B6084a';
const _value = 3;
const providerURL = 'http://localhost:9933';
// Define Provider
let provider = new ethers.providers.JsonRpcProvider(providerURL);
// Create Wallet
let wallet = new ethers.Wallet(privKey, provider);

// Contract Tx
const incrementer = new ethers.Contract(contractAddress, abi, wallet);
const increment = async () => {
   console.log(
      `Calling the increment by ${_value} function in contract at address ${contractAddress}`
   );

   const createReceipt = await incrementer.increment([_value]);

   console.log(`Tx successfull with hash: ${createReceipt.hash}`);
};

increment();
