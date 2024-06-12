// 1. Update imports
import { createPublicClient, http } from 'viem';
import { moonbaseAlpha } from 'viem/chains';
import contractFile from './compile';

// 2. Create a public client for reading chain data
const rpcUrl = 'https://rpc.api.moonbase.moonbeam.network';
const client = createPublicClient({
  chain: moonbaseAlpha,
  transport: http(rpcUrl),
});

// 3. Create contract variables
const contractAddress = 'INSERT_CONTRACT_ADDRESS';
const abi = contractFile.abi;

// 4. Create get function
const get = async () => {
  console.log(`Making a call to contract at address: ${contractAddress}`);

  // 5. Call contract
  const data = await client.readContract({
    abi,
    functionName: 'number',
    address: contractAddress,
    args: [],
  });

  console.log(`The current number stored is: ${data}`);
};

// 6. Call get function
get();
