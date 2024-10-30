import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Get marking offline status with the correct method name
    const isEnabled = await api.query.parachainStaking.enableMarkingOffline();
    
    console.log('Marking Offline Feature Status:', isEnabled.toHuman());

    process.exit(0);
  } catch (error) {
    console.error('Error querying marking offline status:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});