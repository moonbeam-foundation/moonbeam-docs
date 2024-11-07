import { ApiPromise, WsProvider } from '@polkadot/api';

const getXc20s = async () => {
  try {
    const substrateProvider = new WsProvider('INSERT_WSS_ENDPOINT');
    const api = await ApiPromise.create({ provider: substrateProvider });

    const assets = await api.query.assets.asset.entries();

    await Promise.all(
      assets.map(async ([{ args: [id] }]) => {
        try {
          const metadata = await api.query.assets.metadata(id);
          const humanMetadata = metadata.toHuman();
          
          console.log(`\nAsset ID: ${id}`);
          console.log('Metadata:');
          console.log('  Name:', humanMetadata.name);
          console.log('  Symbol:', humanMetadata.symbol);
          console.log('  Decimals:', humanMetadata.decimals);
          console.log('  Deposit:', humanMetadata.deposit);
          console.log('  IsFrozen:', humanMetadata.isFrozen);
          console.log('-----');
        } catch (error) {
          console.error(`Error fetching metadata for asset ${id}:`, error);
        }
      })
    );

    await api.disconnect();
  } catch (error) {
    console.error('Error in getXc20s:', error);
  }
};

getXc20s().catch(console.error);