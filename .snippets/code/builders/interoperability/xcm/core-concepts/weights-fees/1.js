const allowedAssets =
  await api.call.xcmPaymentApi.queryAcceptablePaymentAssets(3);
console.log(allowedAssets);
