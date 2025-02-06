import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Replace with the appropriate WebSocket endpoint
  const provider = new WsProvider('INSERT_WSS_ENDPOINT');
  const api = await ApiPromise.create({ provider });

  // Define the parameter key
  const paramKey = {
    RuntimeConfig: 'FeesTreasuryProportion',
  };

  // Query the storage
  const currentValue = await api.query.parameters.parameters(paramKey);

  if (currentValue.isSome) {
    const unwrapped = currentValue.unwrap();

    // Log entire structure for debugging
    console.log('Unwrapped value (toHuman):', unwrapped.toHuman());
    console.log('Unwrapped value (toJSON):', unwrapped.toJSON());
  } else {
    console.log('None. No value stored for the given key.');
  }

  // Disconnect once done
  await api.disconnect();
};

main();
