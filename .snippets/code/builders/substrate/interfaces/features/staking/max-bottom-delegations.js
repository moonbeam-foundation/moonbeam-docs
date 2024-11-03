import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // Get the maxBottomDelegationsPerCandidate constant from the parachainStaking module
    const maxBottomDelegationsPerCandidate =
      await api.consts.parachainStaking.maxBottomDelegationsPerCandidate;

    console.log(
      'Max Bottom Delegations Per Candidate:',
      maxBottomDelegationsPerCandidate.toString()
    );

    process.exit(0);
  } catch (error) {
    console.error(
      'Error querying max bottom delegations per candidate:',
      error
    );
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
