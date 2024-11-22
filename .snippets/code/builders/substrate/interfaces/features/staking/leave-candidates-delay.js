import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // Get the leaveCandidatesDelay constant from the parachainStaking module
    const leaveCandidatesDelay =
      await api.consts.parachainStaking.leaveCandidatesDelay;

    console.log(
      'Leave Candidates Delay:',
      leaveCandidatesDelay.toString(),
      'rounds'
    );

    process.exit(0);
  } catch (error) {
    console.error('Error querying leave candidates delay:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
