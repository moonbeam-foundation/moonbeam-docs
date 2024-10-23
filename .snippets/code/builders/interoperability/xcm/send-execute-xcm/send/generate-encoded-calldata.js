import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 10.13.1
import { decodeAddress } from '@polkadot/util-crypto';

// 1. Input data
const providerWsURL = 'wss://wss.api.moonbase.moonbeam.network';
// You can use the decodeAddress function to ensure that your address is properly
// decoded. If it isn't decoded, it will decode it and if it is, it will ignore it
const relayAccount = decodeAddress('INSERT_ADDRESS');
const dest = { V4: { parents: 1, interior: null } };
const instr1 = {
  WithdrawAsset: [
    {
      id: { parents: 1, interior: null },
      fun: { Fungible: 1000000000000n }, // 1 UNIT
    },
  ],
};
const instr2 = {
  BuyExecution: [
    {
      id: { parents: 1, interior: null },
      fun: { Fungible: 1000000000000n }, // 1 UNIT
    },
    { Unlimited: null },
  ],
};
const instr3 = {
  DepositAsset: {
    assets: { Wild: 'All' },
    beneficiary: {
      parents: 1,
      interior: {
        X1: [
          {
            AccountId32: {
              id: relayAccount,
            },
          },
        ],
      },
    },
  },
};
const message = { V4: [instr1, instr2, instr3] };

const generateEncodedXcmMessage = async () => {
  // 2. Create Substrate API Provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 3. Create the extrinsic
  const tx = api.tx.polkadotXcm.send(dest, message);

  // 4. Get the encoded XCM message
  // By using index 1, you'll get just the encoded XCM message.
  // If you wanted to get the dest, you could use index 0
  const encodedXcmMessage = tx.args[1].toHex();
  console.log(`Encoded Calldata for XCM Message: ${encodedXcmMessage}`);

  api.disconnect();
};

generateEncodedXcmMessage();
