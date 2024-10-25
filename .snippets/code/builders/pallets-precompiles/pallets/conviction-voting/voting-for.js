import { ApiPromise, WsProvider } from '@polkadot/api';

const account = INSERT_ADDRESS;
const classIndex = INSERT_TRACK_INDEX;

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const votingFor = await api.query.convictionVoting.votingFor(
    account,
    classIndex
  );
};

main();
