import { ApiPromise, WsProvider } from '@polkadot/api';

const location = {
  parents: INSERT_PARENTS,
  interior: INSERT_INTERIOR,
};

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });
  const feePerSecond =
    await api.query.xcmTransactor.destinationAssetFeePerSecond(location);

  if (feePerSecond.isSome) {
    const data = feePerSecond.unwrap();
    console.log(data.toJSON());
  }
};

main();