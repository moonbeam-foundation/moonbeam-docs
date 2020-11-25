const Web3 = require('web3');
const { abi } = require('./compile');

// Initialization
const web3 = new Web3('http://localhost:9933');
const contractAddress = '0xC2Bf5F29a4384b1aB0C063e1c666f02121B6084a';

// Contract Call
const incrementer = new web3.eth.Contract(abi, contractAddress);
const get = async () => {
   console.log(`Making a call to contract at address ${contractAddress}`);
   const data = await incrementer.methods.number().call();
   console.log(`The current number stored is: ${data}`);
};

get();
