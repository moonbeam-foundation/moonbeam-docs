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

// Create ethers provider
const provider = new ethers.JsonRpcProvider(providerRPC.moonbase.rpc, {
  chainId: providerRPC.moonbase.chainId,
  name: providerRPC.moonbase.name,
}); // Change to correct network

// Create variables
const accountFrom = {
  privateKey: 'INSERT_YOUR_PRIVATE_KEY',
};
const contractAddress = 'INSERT_CONTRACT_ADDRESS';

// Create wallet
let wallet = new ethers.Wallet(accountFrom.privateKey, provider);

// Create contract instance with signer
const incrementer = new ethers.Contract(contractAddress, abi, wallet);

// Create reset function
const reset = async () => {
  console.log(
    `Calling the reset function in contract at address: ${contractAddress}`
  );

  // Sign and send tx and wait for receipt
  const createReceipt = await incrementer.reset();
  await createReceipt.wait();

  console.log(`Tx successful with hash: ${createReceipt.hash}`);
};

// Call the reset function
reset();
