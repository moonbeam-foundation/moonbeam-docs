const ethers = require('ethers');
const { abi } = require('./compile');

// Initialization
const contractAddress = '0xC2Bf5F29a4384b1aB0C063e1c666f02121B6084a';
const providerURL = 'http://localhost:9933';
// Define Provider
let provider = new ethers.providers.JsonRpcProvider(providerURL);

// Contract Call
const incrementer = new ethers.Contract(contractAddress, abi, provider);
const get = async () => {
   console.log(`Making a call to contract at address ${contractAddress}`);
   const data = await incrementer.number();
   console.log(`The current number stored is: ${data}`);
};

get();
