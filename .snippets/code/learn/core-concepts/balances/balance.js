import { ApiPromise, WsProvider } from '@polkadot/api';

const wsProvider = new WsProvider('wss://wss.api.moonbase.moonbeam.network');

const main = async () => {
  const polkadotApi = await ApiPromise.create({
    provider: wsProvider,
  });

  const balances = await polkadotApi.query.system.account('INSERT_ADDRESS');
  console.log(balances.toHuman());
};

main();
