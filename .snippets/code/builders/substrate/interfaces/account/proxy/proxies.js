import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  try {
    // Initialize connection to the network
    const api = await ApiPromise.create({
      provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
    });

    // The account address to query proxies for
    const accountAddress = 'INSERT_REAL_ACCOUNT';

    // Query proxies
    const [proxies, deposit] = await api.query.proxy.proxies(accountAddress);
    
    // Log the results with formatted JSON
    console.log('Querying proxies for account:', accountAddress);
    console.log('\nProxies:', JSON.stringify(proxies.toHuman(), null, 2));
    console.log('Required deposit:', deposit.toHuman());

    // Display in a more readable format
    console.log('\nProxy Details:');
    proxies.forEach((proxy, index) => {
      console.log(`\nProxy #${index + 1}:`);
      console.log('  Delegate:', proxy.delegate.toString());
      console.log('  Proxy Type:', proxy.proxyType.toString());
      console.log('  Delay:', proxy.delay.toString());
    });

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