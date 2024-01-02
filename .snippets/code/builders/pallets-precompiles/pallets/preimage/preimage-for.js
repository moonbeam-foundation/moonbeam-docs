import { ApiPromise, WsProvider } from '@polkadot/api';

const preimageInfo = [INSERT_PREIMAGE_HASH, INSERT_PREIMAGE_LENGTH];

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const preimageFor = await api.query.preimage.preimageFor(preimageInfo);
};

main();