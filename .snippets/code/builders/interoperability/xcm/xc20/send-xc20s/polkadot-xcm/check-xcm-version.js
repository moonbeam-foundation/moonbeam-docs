import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://wss.api.moonbase.moonbeam.network'),
  });

  const testLocation = {
    V4: {
      parents: 1,
      interior: 'Here'
    }
  };

  const supportedVersion = await api.query.polkadotXcm.supportedVersion(
    4,  // Testing XCM v4
    testLocation
  );
  
  console.log('Location:', JSON.stringify(testLocation, null, 2));
  console.log('Supported Version:', supportedVersion.toHuman());
};

main();