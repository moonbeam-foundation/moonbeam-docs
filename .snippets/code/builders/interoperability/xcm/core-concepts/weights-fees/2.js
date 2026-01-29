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
