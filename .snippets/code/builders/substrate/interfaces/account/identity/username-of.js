import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Connect to Moonbase
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-rpc.dwellir.com'),
  });

  // Replace with any AccountId20 you wish to inspect
  const account = 'INSERT_ACCOUNT';

  // Query the storage item
  const usernameOpt = await api.query.identity.usernameOf(account);

  if (usernameOpt.isSome) {
    // Convert Bytes → UTF-8 for readability
    const username = usernameOpt.unwrap().toUtf8();
    console.log(`Primary username for ${account}: ${username}`);
  } else {
    console.log(`Account ${account} has no primary username set.`);
  }

  await api.disconnect();
};

main().catch(console.error);