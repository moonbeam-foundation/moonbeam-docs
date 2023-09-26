// 1. Update imports
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { moonbaseAlpha } from 'viem/chains';
import contractFile from './compile';

// 2. Create a wallet client for writing chain data
const account = privateKeyToAccount('INSERT_PRIVATE_KEY');
const rpcUrl = 'https://rpc.api.moonbase.moonbeam.network';
const walletClient = createWalletClient({
  account,
  chain: moonbaseAlpha,
  transport: http(rpcUrl),
});

// 3. Create a public client for reading chain data
const publicClient = createPublicClient({
  chain: moonbaseAlpha,
  transport: http(rpcUrl),
});

// 4. Create contract variables
const contractAddress = 'INSERT_CONTRACT_ADDRESS';
const abi = contractFile.abi;
const _value = 3;

// 5. Create increment function
const increment = async () => {
  console.log(
    `Calling the increment by ${_value} function in contract at address: ${contractAddress}`
  );
  // 6. Call contract
  const hash = await walletClient.writeContract({
    abi,
    functionName: 'increment',
    address: contractAddress,
    args: [_value],
  });

  // 7. Wait for the transaction receipt
  await publicClient.waitForTransactionReceipt({
    hash,
  });

  console.log(`Tx successful with hash: ${hash}`);
};

// 8. Call increment function
increment();
