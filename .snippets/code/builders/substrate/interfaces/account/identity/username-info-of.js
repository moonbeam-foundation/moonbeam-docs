import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Connect to Moonbase-Alpha
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-rpc.dwellir.com'),
  });

  // Username to query (ASCII automatically wrapped as Bytes)
  const username = api.registry.createType('Bytes', 'alice');

  // Fetch username information
  const infoOpt = await api.query.identity.usernameInfoOf(username);

  if (infoOpt.isSome) {
    const { owner, provider } = infoOpt.unwrap();

    console.log(`Username          : ${username.toUtf8()}`);
    console.log(`  Owner account   : ${owner.toString()}`);
    console.log(`  Issued by       : ${provider.toString()}`);
  } else {
    console.log('Username is not registered.');
  }

  await api.disconnect();
};

main().catch(console.error);