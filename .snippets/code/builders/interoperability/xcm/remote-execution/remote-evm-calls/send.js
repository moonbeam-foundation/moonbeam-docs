import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'; // Version 10.13.1
import { cryptoWaitReady } from '@polkadot/util-crypto';

// 1. Input data
const providerWsURL =
  'wss://fro-moon-rpc-1-moonbase-relay-rpc-1.moonbase.ol-infra.network';
const privateKey = 'INSERT_PRIVATE_KEY';
const dest = { V4: { parents: 0, interior: { X1: [{ Parachain: 1000 }] } } };
const instr1 = {
  WithdrawAsset: [
    {
      id: { parents: 0, interior: { X1: [{ PalletInstance: 3 }] } },
      fun: { Fungible: 10000000000000000n }, // 0.01 DEV
    },
  ],
};
const instr2 = {
  BuyExecution: [
    {
      id: { parents: 0, interior: { X1: [{ PalletInstance: 3 }] } },
      fun: { Fungible: 10000000000000000n }, // 0.01 DEV
    },
    { Unlimited: null },
  ],
};
const instr3 = {
  Transact: {
    originKind: 'SovereignAccount',
    requireWeightAtMost: { refTime: 3900000000n, proofSize: 9687n },
    call: {
      encoded:
        '0x260001785d02000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00',
    },
  },
};
const message = { V4: [instr1, instr2, instr3] };

const sendXcmMessage = async () => {
  // 2. Create Keyring instance
  await cryptoWaitReady();
  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri(privateKey);
  
  // 3. Create Substrate API Provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 4. Create the extrinsic
  const tx = api.tx.xcmPallet.send(dest, message);

  // 5. Send the transaction
  const txHash = await tx.signAndSend(alice);
  console.log(`Submitted with hash ${txHash}`);

  api.disconnect();
};

sendXcmMessage();
