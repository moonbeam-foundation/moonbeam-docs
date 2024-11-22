import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // The account to query multisigs for
    const account = 'INSERT_ACCOUNT';

    // Get all storage keys and values for this account's multisigs
    const entries = await api.query.multisig.multisigs.entries(account);

    if (entries.length === 0) {
      console.log('No multisigs found for this account');
    } else {
      console.log(`Found ${entries.length} multisig(s):`);

      entries.forEach(([key, value]) => {
        // The key contains the call hash in its final 32 bytes
        const callHash = key.args[1].toHex();
        console.log('\nCall Hash:', callHash);
        console.log('Details:', value.unwrap().toHuman());
      });
    }
  } catch (error) {
    console.error('Error querying multisigs:', error);
  } finally {
    await api.disconnect();
  }
};

main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
