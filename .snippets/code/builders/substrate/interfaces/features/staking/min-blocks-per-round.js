import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // Get the minimum number of blocks per round
    const minBlocksPerRound =
      await api.consts.parachainStaking.minBlocksPerRound;

    console.log('Minimum Blocks Per Round:', minBlocksPerRound.toString());

    process.exit(0);
  } catch (error) {
    console.error('Error querying min blocks per round:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
