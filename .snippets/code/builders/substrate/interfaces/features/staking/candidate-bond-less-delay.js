import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // Get the bond less delay constant
    const delay = await api.consts.parachainStaking.candidateBondLessDelay;

    console.log('Candidate Bond Less Delay:', delay.toString(), 'rounds');

    process.exit(0);
  } catch (error) {
    console.error('Error querying candidate bond less delay:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
