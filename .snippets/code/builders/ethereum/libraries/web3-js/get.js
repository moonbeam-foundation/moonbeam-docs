// 1. Import Web3js and the contract ABI
const { Web3 } = require('web3');
const { abi } = require('./compile');

// 2. Add the Web3 provider logic
const providerRPC = {
  development: 'http://localhost:9944',
  moonbase: 'https://rpc.api.moonbase.moonbeam.network',
};
const web3 = new Web3(providerRPC.moonbase); // Change to correct network

// 3. Create address variables
const contractAddress = 'INSERT_CONTRACT_ADDRESS';

// 4. Create contract instance
const incrementer = new web3.eth.Contract(abi, contractAddress);

// 5. Create get function
const get = async () => {
  console.log(`Making a call to contract at address: ${contractAddress}`);

  // 6. Call contract
  const data = await incrementer.methods.number().call();

  console.log(`The current number stored is: ${data}`);
};

// 7. Call get function
get();