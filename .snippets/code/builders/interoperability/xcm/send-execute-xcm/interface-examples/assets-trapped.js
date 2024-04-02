import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });
  const trappedAssets = await api.query.polkadotXcm.assetTraps.entries();
  trappedAssets.forEach(
    ([
      {
        args: [hash],
      },
      count
    ]) => {
      console.log(
        `Asset with hash ${hash.toJSON()} has been trapped ${count.toJSON()} times`
      );
    }
  );
};

main();