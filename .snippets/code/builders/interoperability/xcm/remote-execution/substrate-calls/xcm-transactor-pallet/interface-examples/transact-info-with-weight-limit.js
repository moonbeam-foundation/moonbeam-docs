import { ApiPromise, WsProvider } from '@polkadot/api';

const location = {
  parents: INSERT_PARENTS,
  interior: INSERT_INTERIOR,
};

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });
  const transactInfoWithWeightLimit =
    await api.query.xcmTransactor.transactInfoWithWeightLimit(location);

  if (transactInfoWithWeightLimit.isSome) {
    const data = transactInfoWithWeightLimit.unwrap();
    console.log(data.toJSON());
  }
};

main();