import { ApiPromise, WsProvider } from '@polkadot/api';

const sub = 'INSERT_SUB_ACCOUNT';
const data = { INSERT_DATA_TYPE: 'INSERT_DATA' };
/* 
        For None, use the following format:
        const data = { 'None': null };

        For all other data types, use the name of the data type
        and the value formatted in that specific type. For example:
        const data = { 'Raw': 'Alice' };
        */

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const tx = api.tx.identity.addSub(sub, data);
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

  api.disconnect();
};

main();
