import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const tx = api.tx.identity.clearIdentity();
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

  api.disconnect();
};

main();
