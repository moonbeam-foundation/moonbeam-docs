// Import ethers and compile
const ethers = require('ethers');
const contractFile = require('./compile');

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

// Define accounts and wallet
const accountFrom = {
  privateKey: 'INSERT_YOUR_PRIVATE_KEY',
};
let wallet = new ethers.Wallet(accountFrom.privateKey, provider);

// Load contract info
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

// Create contract instance with signer
const incrementer = new ethers.ContractFactory(abi, bytecode, wallet);

// Create deploy function
const deploy = async () => {
  console.log(`Attempting to deploy from account: ${wallet.address}`);

  // Send tx (initial value set to 5) and wait for receipt
  const contract = await incrementer.deploy(5);
  const txReceipt = await contract.deploymentTransaction().wait();

  console.log(`Contract deployed at address: ${txReceipt.contractAddress}`);
};

// Call the deploy function
deploy();
