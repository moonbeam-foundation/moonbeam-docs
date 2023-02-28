import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 9.13.6

// 1. Input data
const providerWsURL = 'wss://wss.api.moonbase.moonbeam.network';
const devMultiLocation = { parents: 0, interior: { X1: { PalletInstance: 3 } } };
const amountToWithdraw = BigInt(1 * 10 ** 17); // 0.1 DEV
const maxWeight = '1000000000';
const bob = '0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0';

// 2. XCM instruction 1: WithdrawAsset
const instr1 = {
  WithdrawAsset: [
    {
      id: { Concrete: devMultiLocation },
      fun: { Fungible: amountToWithdraw },
    },
  ],
};

// 3. XCM instruction 2: BuyExecution
const instr2 = {
  BuyExecution: {
    fees: {
      id: { Concrete: devMultiLocation },
      fun: { Fungible: amountToWithdraw },
    },
    weightLimit: 'Unlimited',
  },
};

// 4. XCM instruction 3: DepositAsset
const instr3 = {
  DepositAsset: {
    assets: { Wild: 'All' },
    max_assets: 1,
    beneficiary: {
      parents: 0,
      interior: { X1: { AccountKey20: { network: 'Any', key: bob } } },
    },
  },
};

// 5. Build versioned XCM message
const xcmMessage = { V2: [instr1, instr2, instr3] };

const generateCallData = async () => {
  // 6. Create Substrate API Provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 7. Create the extrinsic
  let tx = api.tx.polkadotXcm.execute(xcmMessage, maxWeight);

  // 8. Get SCALE Encoded Calldata
  let encodedCall = tx.method.toHex();
  console.log(`Encoded Calldata: ${encodedCall}`);
};

generateCallData();