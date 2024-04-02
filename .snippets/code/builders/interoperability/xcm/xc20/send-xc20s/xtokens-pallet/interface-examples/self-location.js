import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const selfLocation = api.consts.xTokens.selfLocation;
  console.log(selfLocation.toJSON());
};

main();