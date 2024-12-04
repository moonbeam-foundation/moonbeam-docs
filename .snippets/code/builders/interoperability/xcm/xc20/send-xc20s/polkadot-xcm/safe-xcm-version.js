import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://wss.api.moonbeam.network'),
  });

  const safeVersion = await api.query.polkadotXcm.safeXcmVersion();

  console.log('Safe XCM Version:', safeVersion.toHuman());
};

main();
