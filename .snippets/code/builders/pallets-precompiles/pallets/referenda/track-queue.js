import { ApiPromise, WsProvider } from '@polkadot/api';

const index = INSERT_TRACK_INDEX;

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const trackQueue = await api.query.referenda.trackQueue(index);
};

main();