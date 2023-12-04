import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 10.9.1

const providerWsURL = 'wss://wss.api.moonbeam.network';

const getUnitsPerSecond = async () => {
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  const xcDOTAssetId = 42259045809535163221576417993425387648n;
  const assetType = (
    await api.query.assetManager.assetIdType(xcDOTAssetId)
  ).toJSON();

  const unitsPerSecond = await api.query.assetManager.assetTypeUnitsPerSecond(
    assetType
  );
  console.log(`The UnitsPerSecond for xcDOT is ${unitsPerSecond.toHuman()}`);
};

getUnitsPerSecond();
