import { ApiPromise, WsProvider } from '@polkadot/api';

const xcmTransaction = {
  V2: {
    gasLimit: INSERT_GAS_LIMIT,
    action: { Call: 'INSERT_CONTRACT_ADDRESS_TO_CALL' },
    value: INSERT_VALUE,
    input: 'INSERT_CONTRACT_CALL_DATA',
  },
};

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });
  const tx = api.tx.ethereumXcm.transact(xcmTransaction);
};

main();      