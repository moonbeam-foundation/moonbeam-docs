import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Construct API provider
  const wsProvider = new WsProvider('INSERT_WSS_ENDPOINT');
  const api = await ApiPromise.create({ provider: wsProvider });

  // Define the multilocation parameter
  const multilocation = {
    V4: {
      parents: 1,
      interior: 'Here',
    },
  };

  // Query the locationToAccountApi using convertLocation method
  const result =
    await api.call.locationToAccountApi.convertLocation(multilocation);
  console.log('Conversion result:', result.toHuman());

  // Disconnect the API
  await api.disconnect();
};

main().catch(console.error);
