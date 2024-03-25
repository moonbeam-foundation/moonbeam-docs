import { ethers } from 'ethers';

// Define the block hash to check finality
const blockHash = 'INSERT_BLOCK_HASH';

// Define the RPC of the provider for Moonbeam
// This can be adapted for Moonriver or Moonbase Alpha
const providerRPC = {
  moonbeam: {
    name: 'moonbeam',
    rpc: 'INSERT_RPC_API_ENDPOINT',
    chainId: 1284,
  },
};

// Define the Web3 provider
const web3Provider = new ethers.JsonRpcProvider(providerRPC.moonbeam.rpc, {
  chainId: providerRPC.moonbeam.chainId,
  name: providerRPC.moonbeam.name,
});

// Define the function for the custom web3 request
const customWeb3Request = async (web3Provider, method, params) => {
  try {
    return await web3Provider.send(method, params);
  } catch (error) {
    throw new Error(error.body);
  }
};

const main = async () => {
  // Check if the block has been finalized
  const isFinalized = await customWeb3Request(
    web3Provider,
    'moon_isBlockFinalized',
    [blockHash]
  );
  console.log(`Block is finalized? ${isFinalized}`);
};

main();
