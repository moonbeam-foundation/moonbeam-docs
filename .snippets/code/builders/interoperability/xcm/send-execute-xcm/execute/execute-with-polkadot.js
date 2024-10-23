import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'; // Version 10.13.1
import { cryptoWaitReady } from '@polkadot/util-crypto';

// 1. Provide input data
const providerWsURL = 'wss://wss.api.moonbase.moonbeam.network';
const privateKey = 'INSERT_PRIVATE_KEY';
const instr1 = {
  WithdrawAsset: [
    {
      id: { parents: 0, interior: { X1: [{ PalletInstance: 3 }] } },
      fun: { Fungible: 100000000000000000n }, // 0.1 DEV
    },
  ],
};
const instr2 = {
  DepositAsset: {
    assets: {
      Wild: {
        AllCounted: 1,
      },
    },
    beneficiary: {
      parents: 0,
      interior: {
        X1: [
          {
            AccountKey20: {
              key: '0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0',
            },
          },
        ],
      },
    },
  },
};
const message = { V4: [instr1, instr2] };
const maxWeight = { refTime: 7250000000n, proofSize: 19374n };

const executeXcmMessage = async () => {
  // 2. Create Keyring instance
  await cryptoWaitReady();
  const keyring = new Keyring({ type: 'ethereum' });
  const alice = keyring.addFromUri(privateKey);

  // 3. Create Substrate API provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 4. Craft the extrinsic
  const tx = api.tx.polkadotXcm.execute(message, maxWeight);

  // 5. Send the transaction
  const txHash = await tx.signAndSend(alice);
  console.log(`Submitted with hash ${txHash}`);

  api.disconnect();
};

executeXcmMessage();