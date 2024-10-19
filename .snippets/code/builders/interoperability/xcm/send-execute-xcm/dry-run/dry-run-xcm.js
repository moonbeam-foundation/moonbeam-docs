import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  try {
    // Construct API provider
    const wsProvider = new WsProvider('INSERT_WSS_ENDPOINT');
    const api = await ApiPromise.create({ provider: wsProvider });
    console.log('Connected to the API. Preparing dry run XCM call...');

    // Define the origin
    const origin = { V4: { parents: 1, interior: 'Here' } };

    const assetMultiLocation = {
      parents: 0,
      interior: { X1: { PalletInstance: 3 } },
    }; // The asset's location (adjust PalletInstance as needed)

    const amountToSend = 1000000000000; // Adjust this value as needed

    const message = {
      V4: [
        {
          WithdrawAsset: [
            {
              id: { parents: 1, interior: 'Here' },
              fun: { Fungible: amountToSend },
            },
          ],
        },
        {
          BuyExecution: {
            fees: {
              id: { parents: 1, interior: 'Here' },
              fun: { Fungible: amountToSend },
            },
            weightLimit: { Unlimited: null },
          },
        },
        {
          ClearOrigin: null,
        },
      ],
    };

    // Perform the dry run XCM call
    const result = await api.call.dryRunApi.dryRunXcm(origin, message);

    // Use JSON.stringify for better output formatting
    console.log(
      'Dry run XCM result:',
      JSON.stringify(result.toJSON(), null, 2)
    );

    // Disconnect the API
    await api.disconnect();
    console.log('Disconnected from the API.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

main().catch(console.error);
