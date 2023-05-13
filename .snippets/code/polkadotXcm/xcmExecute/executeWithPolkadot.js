import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'; // Version 9.13.6

// 1. Provide input data
const providerWsURL = 'wss://wss.api.moonbase.moonbeam.network';
const instr1 = {
  WithdrawAsset: [
    {
      id: { Concrete: { parents: 0, interior: { X1: { PalletInstance: 3 } } } },
      fun: { Fungible: 100000000000000000n },
    },
  ],
};
const instr2 = {
  DepositAsset: {
    assets: { Wild: 'All' },
    beneficiary: {
      parents: 0,
      interior: {
        X1: {
          AccountKey20: {
            key: MOONBEAM_ACCOUNT,
          },
        },
      },
    },
  },
};
const message = { V3: [instr1, instr2] };
const maxWeight =  { refTime: 100000000000n, proofSize: 0 };

// 2. Create Keyring instance
const keyring = new Keyring({ type: 'ethereum' });
const alice = keyring.addFromUri(PRIVATE_KEY);

const executeXcmMessage = async () => {
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