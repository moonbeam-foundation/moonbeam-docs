import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  // Query the base deposit for proxy creation
  const baseDeposit = await api.consts.proxy.proxyDepositBase;

  console.log('Proxy Base Deposit:', baseDeposit.toHuman());

  process.exit(0);
};

main().catch(console.error);
