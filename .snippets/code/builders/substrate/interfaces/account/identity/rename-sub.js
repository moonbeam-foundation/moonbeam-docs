import { ApiPromise, WsProvider } from '@polkadot/api';

const sub = 'INSERT_ACCOUNT';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const tx = api.tx.identity.rename(sub);
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

  api.disconnect();
};
