import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Get the block expiration delay constant
    const blockExpirationDelay = await api.consts.randomness.blockExpirationDelay;
    
    console.log('Block Expiration Delay:', blockExpirationDelay.toString(), 'blocks');

    process.exit(0);
  } catch (error) {
    console.error('Error querying block expiration delay:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});