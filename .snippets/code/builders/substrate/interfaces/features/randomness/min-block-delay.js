import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Get the minimum block delay constant
    const minBlockDelay = await api.consts.randomness.minBlockDelay;
    
    console.log('Minimum Block Delay:', minBlockDelay.toString(), 'blocks');

    process.exit(0);
  } catch (error) {
    console.error('Error querying min block delay:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});