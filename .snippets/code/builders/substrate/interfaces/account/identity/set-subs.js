import { ApiPromise, WsProvider } from '@polkadot/api';

const subs = [
  [INSERT_ACCOUNT, { Raw: 'INSERT_SUB_ACCOUNT_NAME' }],
  [INSERT_ACCOUNT, { None: null }],
];

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const tx = api.tx.identity.setSubs(subs);
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

  api.disconnect();
};

main();
