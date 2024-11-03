import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // Get the minimum number of selected candidates
    const minSelectedCandidates =
      await api.consts.parachainStaking.minSelectedCandidates;

    console.log(
      'Minimum Selected Candidates:',
      minSelectedCandidates.toString()
    );

    process.exit(0);
  } catch (error) {
    console.error('Error querying min selected candidates:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
