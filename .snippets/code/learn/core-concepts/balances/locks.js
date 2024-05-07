import { ApiPromise, WsProvider } from '@polkadot/api';

const wsProvider = new WsProvider('wss://wss.api.moonbase.moonbeam.network');

const main = async () => {
  const polkadotApi = await ApiPromise.create({
    provider: wsProvider,
  });

  const locks = await polkadotApi.query.balances.locks('INSERT_ADDRESS');
  console.log(locks.toHuman());
};

main();
