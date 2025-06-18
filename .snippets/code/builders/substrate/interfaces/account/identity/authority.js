import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Connect to Moonbase
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-rpc.dwellir.com'),
  });

  // --- OPTION 1: Check a single account ----------------------
  // const account = '0x1234...';  // AccountId20 as hex
  // const infoOpt = await api.query.identity.authorityOf(account);
  // console.log(infoOpt.isSome ? infoOpt.unwrap().toHuman() : 'Not an authority');

  // --- OPTION 2: List *all* registered authorities -----------
  const entries = await api.query.identity.authorityOf.entries();

  if (entries.length === 0) {
    console.log('No authority accounts are registered.');
  } else {
    console.log(`Found ${entries.length} authority account(s):\n`);
    for (const [storageKey, optProps] of entries) {
      if (optProps.isSome) {
        const account = storageKey.args[0].toString();
        const { allowAutoClaim, deposit, provider } = optProps.unwrap();

        console.log(`• ${account}`);
        console.log(`    allowAutoClaim : ${allowAutoClaim.toString()}`);
        console.log(`    deposit        : ${deposit.toString()}`);
        console.log(`    provider       : ${provider.toString()}\n`);
      }
    }
  }

  await api.disconnect();
};

main().catch(console.error);