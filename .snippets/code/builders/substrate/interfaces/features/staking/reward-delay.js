import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Get the reward payment delay
    const rewardPaymentDelay = await api.consts.parachainStaking.rewardPaymentDelay;
    
    console.log('Reward Payment Delay:', rewardPaymentDelay.toString(), 'rounds');

    process.exit(0);
  } catch (error) {
    console.error('Error querying reward payment delay:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});