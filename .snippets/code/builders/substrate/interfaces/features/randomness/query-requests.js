import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // First get the current request count
    const requestCount = await api.query.randomness.requestCount();
    console.log('Total Request Count:', requestCount.toString());

    // Query most recent request as an example
    if (requestCount > 0) {
      const latestRequestId = requestCount - 1;
      const specificRequest =
        await api.query.randomness.requests(latestRequestId);

      console.log('\nLatest Request (ID:', latestRequestId.toString(), '):');
      if (specificRequest.isSome) {
        console.log(specificRequest.unwrap().toHuman());
      } else {
        console.log('Request has been fulfilled or purged');
      }
    }

    // Query all available requests
    console.log('\nAll Pending Requests:');
    const allRequests = await api.query.randomness.requests.entries();

    if (allRequests.length === 0) {
      console.log('No pending requests found');
    } else {
      allRequests.forEach(([key, value]) => {
        const requestId = key.args[0].toString();
        console.log('\nRequest ID:', requestId);
        if (value.isSome) {
          const request = value.unwrap();
          console.log('Request Details:', request.toHuman());
        }
      });

      // Show some statistics
      console.log('\nRequest Statistics:');
      console.log('Total Pending Requests:', allRequests.length);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error querying randomness requests:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
