import { ApiPromise, WsProvider } from '@polkadot/api';

const asOrigin = { System: 'Root' };
const call = 'INSERT_ENCODED_CALL_DATA';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const tx = api.tx.utility.dispatchAs(asOrigin, call);
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

  api.disconnect();
};

main();
