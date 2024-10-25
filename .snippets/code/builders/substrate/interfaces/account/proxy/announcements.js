import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  try {
    // Initialize connection to the network
    const api = await ApiPromise.create({
      provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
    });

    // The proxy address to query
    const proxyAddress = 'INSERT_PROXY_ACCOUNT';

    // Query announcements
    const announcements = await api.query.proxy.announcements(proxyAddress);
    
    // Log the results
    console.log('Querying announcements for proxy:', proxyAddress);
    console.log('\nAnnouncements:', JSON.stringify(announcements.toHuman(), null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});