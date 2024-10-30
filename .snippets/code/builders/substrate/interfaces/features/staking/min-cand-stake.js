import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Get the minimum candidate stake required
    const minCandidateStake = await api.consts.parachainStaking.minCandidateStk;
    
    console.log('Minimum Candidate Stake:', minCandidateStake.toString(), 'Wei');
    console.log('Minimum Candidate Stake in DEV:', (BigInt(minCandidateStake) / BigInt(10 ** 18)).toString());

    process.exit(0);
  } catch (error) {
    console.error('Error querying min candidate stake:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});