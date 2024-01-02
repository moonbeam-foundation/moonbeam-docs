import { ApiPromise, WsProvider } from '@polkadot/api';

const track = INSERT_TRACK_INDEX;

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const statusFor = await api.query.referenda.decidingCount(track);
};

main();