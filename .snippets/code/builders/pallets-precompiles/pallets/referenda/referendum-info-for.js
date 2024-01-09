import { ApiPromise, WsProvider } from '@polkadot/api';

const index = INSERT_REFERENDUM_INDEX;

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const referendumInfoFor = await api.query.referenda.referendumInfoFor(index);
};

main();
