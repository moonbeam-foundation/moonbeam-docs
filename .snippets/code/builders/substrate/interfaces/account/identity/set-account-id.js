import { ApiPromise, WsProvider } from '@polkadot/api';

const index = INSERT_REGISTRAR_INDEX;
const newAccount = 'INSERT_NEW_ACCOUNT';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const tx = api.tx.identity.setAccountId(index, newAccount);
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

  api.disconnect();
};

main();
