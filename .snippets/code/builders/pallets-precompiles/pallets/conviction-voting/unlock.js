import { ApiPromise, WsProvider } from '@polkadot/api';

const classIndex = INSERT_TRACK_INDEX;
const target = INSERT_ADDRESS;

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const tx = api.tx.convictionVoting.unlock(classIndex, target);
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

  api.disconnect();
};

main();
