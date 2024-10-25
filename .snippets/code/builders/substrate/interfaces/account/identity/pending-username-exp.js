import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // Query the pendingUsernameExpiration constant from identity pallet
    const pendingExpiration = api.consts.identity.pendingUsernameExpiration;
    console.log('Pending Username Expiration:', pendingExpiration.toHuman());
  } catch (error) {
    console.error('Error querying pending username expiration:', error);
  } finally {
    await api.disconnect();
  }
};

main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
