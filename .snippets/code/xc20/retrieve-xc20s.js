import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 9.13.6

const getXc20s = async () => {
  // 1. Create API provider
  const substrateProvider = new WsProvider(
    'wss://wss.api.moonbase.moonbeam.network'
  );
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 2. Query the assets pallet for all assets
  const assets = await api.query.assets.asset.entries();
  
  // 3. Get metadata for each asset using the ID
  assets.forEach(
    async ([
      {
        args: [id],
      },
    ]) => {
      const metadata = await api.query.assets.metadata(id);
      console.log(`Asset ID: ${id}`);
      console.log(`Metadata: ${metadata}`);
      console.log('-----');
    }
  );

  api.disconnect();
};

getXc20s();