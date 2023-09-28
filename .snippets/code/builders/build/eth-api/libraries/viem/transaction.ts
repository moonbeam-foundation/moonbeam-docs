// 1. Imports
import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { moonbaseAlpha } from 'viem/chains';

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

// 4. Create to address variable
const addressTo = 'INSERT_ADDRESS';

// 5. Create send function
const send = async () => {
  console.log(
    `Attempting to send transaction from ${account.address} to ${addressTo}`
  );

  // 6. Sign and send tx
  const hash = await walletClient.sendTransaction({
    to: addressTo,
    value: parseEther('1'),
  });

  // 7. Wait for the transaction receipt
  await publicClient.waitForTransactionReceipt({
    hash,
  });

  console.log(`Transaction successful with hash: ${hash}`);
};

// 8. Call the send function
send();
