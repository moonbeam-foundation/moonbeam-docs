// Import ethers
const ethers = require('ethers');

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
const addressTo = 'INSERT_TO_ADDRESS';
const wallet = new ethers.Wallet(accountFrom.privateKey, provider);

// Create send function
const send = async () => {
  console.log(
    `Attempting to send transaction from ${wallet.address} to ${addressTo}`
  );

  // Create transaction
  const tx = {
    to: addressTo,
    value: ethers.parseEther('1'),
  };

  // Send transaction and get hash
  const createReceipt = await wallet.sendTransaction(tx);
  await createReceipt.wait();
  console.log(`Transaction successful with hash: ${createReceipt.hash}`);
};

// Call the send function
send();
