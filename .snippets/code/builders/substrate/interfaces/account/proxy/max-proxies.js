import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  // Query max proxies allowed
  const maxProxies = await api.consts.proxy.maxProxies;

  console.log('Maximum Proxies per Account:', maxProxies.toHuman());

  process.exit(0);
};

main().catch(console.error);
