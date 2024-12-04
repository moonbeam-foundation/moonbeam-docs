import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://wss.api.moonbase.moonbeam.network'),
  });
  const palletVersion = await api.query.polkadotXcm.palletVersion();
  console.log("The pallet version is " + palletVersion);
};

main();