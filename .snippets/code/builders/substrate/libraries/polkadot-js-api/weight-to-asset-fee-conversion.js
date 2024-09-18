import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Construct API provider
  const wsProvider = new WsProvider('INSERT_WSS_ENDPOINT');
  const api = await ApiPromise.create({ provider: wsProvider });

  const fee = await api.call.xcmPaymentApi.queryWeightToAssetFee(
    {
      refTime: 10_000_000_000n,
      proofSize: 0n,
    },
    {
      V3: {
        Concrete: { parents: 1, interior: 'Here' },
      },
    }
  );

  console.log(fee);

  // Disconnect the API
  await api.disconnect();
};

main();
