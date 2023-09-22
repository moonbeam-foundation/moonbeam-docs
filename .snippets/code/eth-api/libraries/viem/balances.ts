// 1. Imports
import { createPublicClient, http, formatEther } from 'viem';
import { moonbaseAlpha } from 'viem/chains';

// 2. Create a public client for reading chain data
const rpcUrl = 'https://rpc.api.moonbase.moonbeam.network';
const publicClient = createPublicClient({
  chain: moonbaseAlpha,
  transport: http(rpcUrl),
});

// 3. Create address variables
const addressFrom = 'INSERT_FROM_ADDRESS';
const addressTo = 'INSERT_TO_ADDRESS';

// 4. Create balances function
const balances = async () => {
  // 5. Fetch balances
  const balanceFrom = formatEther(
    await publicClient.getBalance({ address: addressFrom })
  );
  const balanceTo = formatEther(
    await publicClient.getBalance({ address: addressTo })
  );

  console.log(`The balance of ${addressFrom} is: ${balanceFrom} DEV`);
  console.log(`The balance of ${addressTo} is: ${balanceTo} DEV`);
};

// 6. Call the balances function
balances();
