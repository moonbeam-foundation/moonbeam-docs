import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Construct API provider
  const wsProvider = new WsProvider('INSERT_WSS_ENDPOINT');
  const api = await ApiPromise.create({ provider: wsProvider });

  const allowedAssets =
    await api.call.xcmPaymentApi.queryAcceptablePaymentAssets(4);
  console.log(allowedAssets);

  // Disconnect the API
  await api.disconnect();
};

main();
