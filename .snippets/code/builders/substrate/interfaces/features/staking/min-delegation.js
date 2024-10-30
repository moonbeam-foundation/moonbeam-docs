import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Get the minimum delegation amount
    const minDelegation = await api.consts.parachainStaking.minDelegation;
    
    console.log('Minimum Delegation Amount:', minDelegation.toString(), 'Wei');
    console.log('Minimum Delegation Amount in DEV:', (BigInt(minDelegation) / BigInt(10 ** 18)).toString());

    process.exit(0);
  } catch (error) {
    console.error('Error querying min delegation amount:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});