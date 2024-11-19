import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://wss.api.moonbeam.network'),
  });

  const queryIndex = await api.query.polkadotXcm.queryCounter();

  console.log('Query Index:', queryIndex.toNumber());
};

main();
