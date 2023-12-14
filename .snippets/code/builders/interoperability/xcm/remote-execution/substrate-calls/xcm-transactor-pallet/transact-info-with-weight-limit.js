import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 9.13.6

const providerWsURL = 'wss://wss.api.moonbase.moonbeam.network';

const location = { parents: 1, interior: { X1: { Parachain: 888 } } };

const main = async () => {
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  const transactInfoWithWeightLimit = await api.query.xcmTransactor.transactInfoWithWeightLimit(location);

  if (transactInfoWithWeightLimit.isSome) {
    const data = transactInfoWithWeightLimit.unwrap();
    const transactExtraWeightSigned =
      data.toJSON().transactExtraWeightSigned.refTime;
    console.log(transactExtraWeightSigned);
  }
};

main();