import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Connect to Moonbase
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-rpc.dwellir.com'),
  });

  // Fetch every (StorageKey, Option<u32>) pair
  const entries = await api.query.identity.unbindingUsernames.entries();

  if (entries.length === 0) {
    console.log('There are no usernames in the unbinding process.');
  } else {
    console.log(`Found ${entries.length} unbinding username(s):\n`);
    for (const [storageKey, optBlock] of entries) {
      if (optBlock.isSome) {
        // The username itself is the single argument encoded in the storage key
        const rawUsername = storageKey.args[0];
        const username = api.registry.createType('Bytes', rawUsername).toUtf8();

        const releaseBlock = optBlock.unwrap().toNumber();
        console.log(`${username} → releases at block ${releaseBlock}`);
      }
    }
  }

  await api.disconnect();
};

main().catch(console.error);
