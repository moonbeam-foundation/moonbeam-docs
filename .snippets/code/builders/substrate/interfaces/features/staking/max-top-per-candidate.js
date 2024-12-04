import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // Get the maximum number of top delegations per candidate
    const maxTopDelegations =
      await api.consts.parachainStaking.maxTopDelegationsPerCandidate;

    console.log(
      'Maximum Top Delegations Per Candidate:',
      maxTopDelegations.toString()
    );

    process.exit(0);
  } catch (error) {
    console.error('Error querying max top delegations per candidate:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
