import { ApiPromise, WsProvider } from '@polkadot/api';

const account = INSERT_ADDRESS;

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const classLocksFor = await api.query.convictionVoting.classLocksFor(account);
};

main();