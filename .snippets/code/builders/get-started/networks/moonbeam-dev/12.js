import { ethers } from 'ethers';

const produceBlock = async () => {
  // Connect to the Ethereum node (if applicable, replace the URL with your node's address)
  const provider = new ethers.JsonRpcProvider(
    '{{ networks.development.rpc_url }}'
  );

  // Set the custom JSON-RPC method and parameters
  const method = 'engine_createBlock';
  const params = [true, true, null];

  try {
    // Send the custom JSON-RPC call
    const result = await provider.send(method, params);
  } catch (error) {
    // Handle any errors that may occur
    console.error('Error:', error.message);
  }
};

produceBlock();
