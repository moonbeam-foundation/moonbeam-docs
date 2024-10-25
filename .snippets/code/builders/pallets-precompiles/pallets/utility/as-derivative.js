import { ApiPromise, WsProvider } from '@polkadot/api';

const index = INSERT_INDEX;
const call = 'INSERT_ENCODED_CALL_DATA';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const tx = api.tx.utility.asDerivative(index, call);
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

  api.disconnect();
};

main();
