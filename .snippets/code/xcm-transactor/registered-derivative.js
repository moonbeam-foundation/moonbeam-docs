import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 9.13.6

const getRegisteredDerivatives = async () => {
  // 1. Create API provider
  const substrateProvider = new WsProvider(
    'wss://wss.api.moonbase.moonbeam.network'
  );
  const api = await ApiPromise.create({ provider: substrateProvider });
  // 2. Query the xcmTransactor pallet to get all addresses and their indexes
  const registeredAddresses = await api.query.xcmTransactor.indexToAccount.entries();
  
  // 3. Iterate over each registered index and grab the associated address
  registeredAddresses.forEach(
    async ([
      {
        args: [id],
      },
    ]) => {
      const address = await api.query.xcmTransactor.indexToAccount(id);
      console.log(`Index: ${id}`);
      console.log(`Address: ${address}`);
      console.log('-----');
    }
  );
};

getRegisteredDerivatives();