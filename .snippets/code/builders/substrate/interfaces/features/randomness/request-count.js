import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Get the request count
    const requestCount = await api.query.randomness.requestCount();
    
    console.log('Total Randomness Requests:', requestCount.toString());
    console.log('Next Request UID will be:', (Number(requestCount) + 1).toString());

    process.exit(0);
  } catch (error) {
    console.error('Error querying request count:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});