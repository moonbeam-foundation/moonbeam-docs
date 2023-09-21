import { createPublicClient, http, formatEther } from 'viem';
import { moonbaseAlpha } from 'viem/chains';

// Create a public client for reading chain data
const client = createPublicClient({
  chain: moonbaseAlpha,
  transport: http('https://rpc.api.moonbase.moonbeam.network'),
});

// Create address variables
const addressFrom = 'INSERT_FROM_ADDRESS';
const addressTo = 'INSERT_TO_ADDRESS';

// Create balances function
const balances = async () => {
  // Fetch balances
  const balanceFrom = formatEther(
    await client.getBalance({ address: addressFrom })
  );
  const balanceTo = formatEther(
    await client.getBalance({ address: addressTo })
  );

  console.log(`The balance of ${addressFrom} is: ${balanceFrom} DEV`);
  console.log(`The balance of ${addressTo} is: ${balanceTo} DEV`);
};

// Call the balances function
balances();
