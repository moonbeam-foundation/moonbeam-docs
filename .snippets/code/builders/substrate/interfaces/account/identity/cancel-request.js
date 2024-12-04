import { ApiPromise, WsProvider } from '@polkadot/api';

const regIndex = 'INSERT_INDEX_OF_REGISTRAR';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const tx = api.tx.identity.cancelRequest(regIndex);
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

  api.disconnect();
};

main();
