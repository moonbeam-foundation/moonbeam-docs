// Query the locationToAccountApi using convertLocation method
const result =
  await api.call.locationToAccountApi.convertLocation(multilocation);
console.log('Conversion result:', result.toHuman());
