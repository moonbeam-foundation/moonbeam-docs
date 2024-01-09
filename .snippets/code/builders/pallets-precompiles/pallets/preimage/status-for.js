import { ApiPromise, WsProvider } from '@polkadot/api';

const hash = INSERT_PREIMAGE_HASH;

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const statusFor = await api.query.preimage.statusFor(hash);
};

main();
