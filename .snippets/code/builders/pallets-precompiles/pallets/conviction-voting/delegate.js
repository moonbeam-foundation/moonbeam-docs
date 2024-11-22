import { ApiPromise, WsProvider } from '@polkadot/api';

const classIndex = INSERT_TRACK_INDEX;
const to = INSERT_DELEGATE_ACCOUNT;
const conviction = INSERT_CONVICTION;
const balance = INSERT_BALANCE_TO_DELEGATE;

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const tx = api.tx.convictionVoting.delegate(
    classIndex,
    to,
    conviction,
    balance
  );
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

  api.disconnect();
};

main();
