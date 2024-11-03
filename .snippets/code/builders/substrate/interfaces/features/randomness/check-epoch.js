import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Get the relay epoch
    const relayEpoch = await api.query.randomness.relayEpoch();
    
    console.log('Current Relay Epoch:', relayEpoch.toString());

    process.exit(0);
  } catch (error) {
    console.error('Error querying relay epoch:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});