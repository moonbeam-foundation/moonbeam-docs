import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 10.13.1

const providerWsURL = 'wss://wss.api.moonbase.moonbeam.network';

const location = {
  parents: 1,
  interior: { X2: [{ Parachain: 888 }, { PalletInstance: 3 }] },
};

const main = async () => {
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  const destinationAssetFeePerSecond =
    await api.query.xcmTransactor.destinationAssetFeePerSecond(location);

  if (destinationAssetFeePerSecond.isSome) {
    const data = destinationAssetFeePerSecond.unwrap();
    const unitsPerSecond = data.toString();
    console.log(unitsPerSecond);
  }

  api.disconnect();
};

main();