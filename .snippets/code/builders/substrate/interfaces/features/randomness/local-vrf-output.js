import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // Get the local VRF output from randomness pallet
    const localVrf = await api.query.randomness.localVrfOutput();

    console.log('Local VRF Output:', localVrf.toString());

    process.exit(0);
  } catch (error) {
    console.error('Error querying local VRF output:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
