import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 10.13.1

// 1. Provide input data
const moonbeamAccount = 'INSERT_ADDRESS';
const providerWsURL = 'wss://wss.api.moonbase.moonbeam.network';
const instr1 = {
  WithdrawAsset: [
    {
      id: { parents: 0, interior: { X1: [{ PalletInstance: 3 }] } },
      fun: { Fungible: 100000000000000000n },
    },
  ],
};
const instr2 = {
  DepositAsset: {
    assets: { Wild: { AllCounted: 1 } },
    beneficiary: {
      parents: 0,
      interior: {
        X1: [
          {
            AccountKey20: {
              key: moonbeamAccount,
            },
          },
        ],
      },
    },
  },
};
const message = { V4: [instr1, instr2] };
const maxWeight = { refTime: 7250000000n, proofSize: 19374n };

const getEncodedXcmMessage = async () => {
  // 2. Create Substrate API provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 3. Craft the extrinsic
  const tx = api.tx.polkadotXcm.execute(message, maxWeight);

  // 4. Get the encoded XCM message
  // By using index 0, you'll get just the encoded XCM message.
  // If you wanted to get the maxWeight, you could use index 1
  const encodedXcmMessage = tx.args[0].toHex();
  console.log(`Encoded Calldata for XCM Message: ${encodedXcmMessage}`);

  api.disconnect();
};

getEncodedXcmMessage();
