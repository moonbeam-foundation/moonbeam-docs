import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Get the revoke delegation delay
    const revokeDelegationDelay = await api.consts.parachainStaking.revokeDelegationDelay;
    
    console.log('Revoke Delegation Delay:', revokeDelegationDelay.toString(), 'rounds');

    process.exit(0);
  } catch (error) {
    console.error('Error querying revoke delegation delay:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});