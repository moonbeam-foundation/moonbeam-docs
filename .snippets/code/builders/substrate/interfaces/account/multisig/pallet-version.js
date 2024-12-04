import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Create the API instance
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  // Query the identity pallet version
  const version = await api.query.multisig.palletVersion();

  // Log the version to console
  console.log('Identity Pallet Version:', version.toString());

  // Disconnect from the API
  await api.disconnect();
};

main().catch(console.error);
