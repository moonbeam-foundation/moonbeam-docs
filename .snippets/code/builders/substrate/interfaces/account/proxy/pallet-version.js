import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  try {
    // Initialize connection to the network
    const api = await ApiPromise.create({
      provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
    });

    // Query pallet version
    const version = await api.query.proxy.palletVersion();

    // Log the result
    console.log('Proxy Pallet Version:', version.toHuman());

    process.exit(0);
  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
