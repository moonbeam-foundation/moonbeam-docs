import { createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { moonbaseAlpha } from 'viem/chains';

// Create a wallet client for writing chain data
const account = privateKeyToAccount('INSERT_PRIVATE_KEY');
const client = createWalletClient({
  account,
  chain: moonbaseAlpha,
  transport: http('https://rpc.api.moonbase.moonbeam.network'),
});

// 3. Create address to variable
const addressTo = 'INSERT_ADDRESS';

// Create send function
const send = async () => {
  console.log(
    `Attempting to send transaction from ${account.address} to ${addressTo}`
  );

  // Sign and send tx
  const hash = await client.sendTransaction({
    to: addressTo,
    value: parseEther('1'),
  });
  console.log(`Transaction successful with hash: ${hash}`);
};

// Call the send function
send();
