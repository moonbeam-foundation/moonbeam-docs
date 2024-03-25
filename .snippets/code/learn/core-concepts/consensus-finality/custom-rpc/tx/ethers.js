import { ethers } from 'ethers';

// Define the transaction hash to check finality
const txHash = 'INSERT_TRANSACTION_HASH';

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
  // Check if the transaction has been finalized
  const isFinalized = await customWeb3Request(
    web3Provider,
    'moon_isTxFinalized',
    [txHash]
  );
  console.log(`Transaction is finalized? ${isFinalized}`);
};

main();