import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // Get the leaveDelegatorsDelay constant from the parachainStaking module
    const leaveDelegatorsDelay =
      await api.consts.parachainStaking.leaveDelegatorsDelay;

    console.log(
      'Leave Delegators Delay:',
      leaveDelegatorsDelay.toString(),
      'rounds'
    );

    process.exit(0);
  } catch (error) {
    console.error('Error querying leave delegators delay:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
