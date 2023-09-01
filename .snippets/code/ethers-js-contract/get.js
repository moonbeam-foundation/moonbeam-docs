// Import ethers and compile
const ethers = require('ethers');
const { abi } = require('./compile');

// Define network configurations
const providerRPC = {
  development: {
    name: 'moonbeam-development',
    rpc: 'http://localhost:9944',
    chainId: 1281,
  },
  moonbase: {
    name: 'moonbase-alpha',
    rpc: 'https://rpc.api.moonbase.moonbeam.network',
    chainId: 1287,
  },
};

const provider = new ethers.JsonRpcProvider(providerRPC.moonbase.rpc, {
  chainId: providerRPC.moonbase.chainId,
  name: providerRPC.moonbase.name,
}); // Change to correct network

// Contract address variable
const contractAddress = 'INSERT_CONTRACT_ADDRESS';

// Create contract instance
const incrementer = new ethers.Contract(contractAddress, abi, provider);

// Create get function
const get = async () => {
  console.log(`Making a call to contract at address: ${contractAddress}`);

  // Call contract
  const data = await incrementer.number();

  console.log(`The current number stored is: ${data}`);
};

// Call get function
get();
