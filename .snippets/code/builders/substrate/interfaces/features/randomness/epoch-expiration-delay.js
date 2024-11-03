import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Get the epoch expiration delay constant
    const epochExpirationDelay = await api.consts.randomness.epochExpirationDelay;
    
    console.log('Epoch Expiration Delay:', epochExpirationDelay.toString(), 'epochs');

    process.exit(0);
  } catch (error) {
    console.error('Error querying epoch expiration delay:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});