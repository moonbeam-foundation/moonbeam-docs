import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Get the maximum number of delegations per delegator
    const maxDelegations = await api.consts.parachainStaking.maxDelegationsPerDelegator;
    
    console.log('Maximum Delegations Per Delegator:', maxDelegations.toString());

    process.exit(0);
  } catch (error) {
    console.error('Error querying max delegations per delegator:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});