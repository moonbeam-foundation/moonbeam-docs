import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 10.13.1

// 1. Input Data
const providerWsURL =
  'wss://fro-moon-rpc-1-moonbase-relay-rpc-1.moonbase.ol-infra.network';
const amountToWithdraw = BigInt(1 * 10 ** 16); // 0.01 DEV
const devMultiLocation = {
  parents: 0,
  interior: { X1: [{ PalletInstance: 3 }] },
};
const weightTransact = 40000000000n; // 25000 * Gas limit of EVM call
const multiLocAccount = '0x61cd3e07fe7d7f6d4680e3e322986b7877f108dd';
const transactBytes =
  '0x2600019b40090000000000000000000000000000000000000000000000000000000000008a1932d6e26433f3037bd6c3a40c816222a6ccd40000c16ff286230000000000000000000000000000000000000000000000000091037ff36ab50000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000061cd3e07fe7d7f6d4680e3e322986b7877f108dd00000000000000000000000000000000000000000000000000000000a036b1b90000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d909178cc99d318e4d46e7e66a972955859670e10000000000000000000000001fc56b105c4f0a1a8038c2b429932b122f6b631f00';

// 2. XCM Destination (Moonbase Alpha Parachain ID 1000)
const dest = { V4: { parents: 0, interior: { X1: [{ Parachain: 1000 }] } } };

// 3. XCM Instruction 1
const instr1 = {
  WithdrawAsset: [
    {
      id: devMultiLocation,
      fun: { Fungible: amountToWithdraw },
    },
  ],
};

// 4. XCM Instruction 2
const instr2 = {
  BuyExecution: {
    fees: {
      id: devMultiLocation,
      fun: { Fungible: amountToWithdraw },
    },
    weightLimit: { Unlimited: null },
  },
};

// 5. XCM Instruction 3
const instr3 = {
  Transact: {
    originKind: 'SovereignAccount',
    requireWeightAtMost: { refTime: weightTransact, proofSize: 700000n },
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
