import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 9.13.6

// 1. Input data
const providerWsURL = 'wss://wss.api.moonbase.moonbeam.network';
// Set parents to 1 and interior to here to target the relay chain
const relayChainMultilocation = { parents: 1, interior: null } 
const amount = BigInt(1 * 10 ** 12); // 1 UNIT
const bob = '0x0c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d67';

// 2. XCM instruction 1: WithdrawAsset
const instr1 = {
  WithdrawAsset: [
    {
      id: { Concrete: relayChainMultilocation },
      fun: { Fungible: amount },
    },
  ],
};

// 3. XCM instruction 2: BuyExecution
const instr2 = {
  BuyExecution: {
    fees: {
      id: { Concrete: relayChainMultilocation },
      fun: { Fungible: amount },
      weightLimit: 'Unlimited'
    }
  }
};

// 4. XCM instruction 3: DepositAsset
const instr3 = {
  DepositAsset: {
    assets: { Wild: 'All' },
    max_assets: 1,
    beneficiary: {
      parents: 0,
      interior: { X1: { AccountId32: { network: 'Any', id: bob } } },
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
  let tx = api.tx.polkadotXcm.execute(xcmMessage, '0');

  // 8. Get SCALE Encoded Calldata
  let encodedCall = tx.method.toHex();
  console.log(`Encoded Calldata: ${encodedCall}`);
};

generateCallData();