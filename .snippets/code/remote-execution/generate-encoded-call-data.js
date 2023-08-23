import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 9.13.6

// 1. Input data
const providerWsURL = 'wss://wss.api.moonbase.moonbeam.network';
const xcmTransaction = {
  V2: {
    gasLimit: 155000,
    action: { Call: '0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8' },
    value: 0,
    input: '0xd09de08a',
  },
};

const getEncodedCallData = async () => {
  // 2. Create Substrate API Provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 3. Create the extrinsic
  const tx = api.tx.ethereumXcm.transact(xcmTransaction);

  // 4. Get the encoded call data
  const encodedCall = tx.method.toHex();
  console.log(`Encoded Calldata: ${encodedCall}`);

  api.disconnect();
};

getEncodedCallData();