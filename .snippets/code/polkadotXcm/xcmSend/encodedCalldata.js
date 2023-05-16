import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 9.13.6
import { decodeAddress } from '@polkadot/util-crypto';

// 1. Input data
const providerWsURL = 'wss://wss.api.moonbase.moonbeam.network';
// Set parents to 1 and interior to here to target the relay chain
const relayChainMultilocation = { parents: 1, interior: null };
const amount = BigInt(1 * 10 ** 12); // 1 UNIT
// You can use the decodeAddress function to ensure that your address is properly
// decoded. If it isn't decoded, it will decode it and if it is, it will ignore it
const bob = decodeAddress('5CLik8E9AFqjykkRDzyvujDNCeM1zFX9Pg7Y5grvoaH6oWUY');

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
      weightLimit: 'Unlimited',
    },
  },
};

// 4. XCM instruction 3: DepositAsset
const instr3 = {
  DepositAsset: {
    assets: { Wild: 'All' },
    max_assets: 1,
    beneficiary: {
      parents: 1,
      interior: { X1: { AccountId32: { network: 'Any', id: bob } } },
    },
  },
};

// 5. Build versioned XCM message
const message = { V2: [instr1, instr2, instr3] };

const generateCallData = async () => {
  // 6. Create Substrate API Provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 7. Create the extrinsic
  const tx = api.tx.polkadotXcm.execute(message, '0');

  // 8. Get SCALE Encoded Calldata
  const encodedCall = tx.method.toHex();
  console.log(`Encoded Calldata: ${encodedCall}`);
};

generateCallData();
