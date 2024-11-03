import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Get the maximum block delay constant
    const maxBlockDelay = await api.consts.randomness.maxBlockDelay;
    
    console.log('Maximum Block Delay:', maxBlockDelay.toString(), 'blocks');

    process.exit(0);
  } catch (error) {
    console.error('Error querying max block delay:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});