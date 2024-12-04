import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // Get total number of collators that can be selected
    const totalSelected = await api.query.parachainStaking.totalSelected();

    console.log(
      'Maximum Number of Collators that can be Selected:',
      totalSelected.toString()
    );

    process.exit(0);
  } catch (error) {
    console.error('Error querying total selected:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
