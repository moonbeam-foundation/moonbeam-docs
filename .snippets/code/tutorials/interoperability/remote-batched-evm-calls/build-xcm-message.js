import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 10.13.1

// 1. Input Data
const providerWsURL =
  'wss://fro-moon-rpc-1-moonbase-relay-rpc-1.moonbase.ol-infra.network';
const amountToWithdraw = BigInt(1 * 10 ** 16); // 0.01 DEV
const devMultiLocation = {
  parents: 0,
  interior: { X1: { PalletInstance: 3 } },
};
const weightTransact = 43500000000n; // 25000 * Gas limit of EVM call
const multiLocAccount = '0xf0615483cbe76f5b2aa80a8ce2b2e9a8206deb65'; // REPLACE with your Computed Origin account
const transactBytes =
  '0x260001f0490200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008080000000000000000000000000000000000000000000000000000000000000000110896e292b8000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000000020000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f000000000000000000000000ed13b028697febd70f34cf9a9e280a8f1e98fd29000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000042004ffd90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000042004ffd900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';

// 2. XCM Destination (Moonbase Alpha Parachain ID 1000)
const dest = { V4: { parents: 0, interior: { X1: [{ Parachain: 1000 }] } } };

// 3. XCM Instruction 1
const instr1 = {
  WithdrawAsset: [
    {
      id: { Concrete: devMultiLocation },
      fun: { Fungible: amountToWithdraw },
    },
  ],
};

// 4. XCM Instruction 2
const instr2 = {
  BuyExecution: {
    fees: {
      id: { Concrete: devMultiLocation },
      fun: { Fungible: amountToWithdraw },
    },
    weightLimit: { Unlimited: null },
  },
};

// 5. XCM Instruction 3
const instr3 = {
  Transact: {
    originKind: 'SovereignAccount',
    requireWeightAtMost: { refTime: weightTransact, proofSize: 200000n },
    call: {
      encoded: transactBytes,
    },
  },
};

// 6. XCM Instruction 4
const instr4 = {
  DepositAsset: {
    assets: { Wild: 'All' },
    beneficiary: {
      parents: 0,
      interior: { X1: [{ AccountKey20: { key: multiLocAccount } }] },
    },
  },
};

// 7. Build XCM Message
const message = { V4: [instr1, instr2, instr3, instr4] };

const generateCallData = async () => {
  // 8. Create Substrate API Provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 9. Create the Extrinsic
  const tx = api.tx.xcmPallet.send(dest, message);

  // 10. Get SCALE Encoded Calldata
  const encodedCall = tx.toHex();
  console.log(`Encoded Calldata: ${encodedCall}`);

  api.disconnect();
};

generateCallData();
