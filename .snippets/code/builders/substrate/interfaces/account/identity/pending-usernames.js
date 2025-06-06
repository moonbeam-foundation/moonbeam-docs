import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Connect to a Moonbase RPC endpoint
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-rpc.dwellir.com'),
  });

  // Fetch *all* [StorageKey, Option<(AccountId20, u32, PalletIdentityProvider)>] pairs
  const entries = await api.query.identity.pendingUsernames.entries();

  if (entries.length === 0) {
    console.log('There are no pending usernames right now.');
  } else {
    console.log(`Found ${entries.length} pending username(s):\n`);
    for (const [storageKey, optValue] of entries) {
      if (optValue.isSome) {
        const [account, deadline, provider] = optValue.unwrap();

        // The username itself is part of the storage key after the 32-byte hash prefix
        // api.registry.createType('Bytes', rawBytes) makes it human-readable
        const raw = storageKey.args[0];               // Bytes
        const username = api.registry.createType('Bytes', raw).toUtf8();

        console.log(`• ${username}`);
        console.log(`    owner   : ${account.toString()}`);
        console.log(`    expires : block ${deadline.toNumber()}`);
        console.log(`    provider: ${provider.toString()}\n`);
      }
    }
  }

  await api.disconnect();
};

main().catch(console.error);