import { ApiPromise, WsProvider } from '@polkadot/api';

const calls = ['INSERT_ENCODED_CALL_DATA'];

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const tx = api.tx.utility.batchAll(calls);
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

  api.disconnect();
};

main();
