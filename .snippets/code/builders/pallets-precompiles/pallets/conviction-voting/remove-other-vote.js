import { ApiPromise, WsProvider } from '@polkadot/api';

const target = INSERT_ADDRESS;
const classIndex = INSERT_TRACK_INDEX;
const index = INSERT_REFERENDUM_INDEX;

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const tx = api.tx.convictionVoting.removeOtherVote(target, classIndex, index);
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

  api.disconnect();
};

main();
