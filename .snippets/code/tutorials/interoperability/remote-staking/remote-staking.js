import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';

const privateKey = 'INSERT_PRIVATE_KEY_OR_MNEMONIC';

// 1. Define the dest and message arguments
const dest = { V4: { parents: 0, interior: { X1: [{ Parachain: 1000 }] } } };
const instr1 = {
  WithdrawAsset: [
    {
      id: {
        parents: 0,
        interior: { X1: [{ PalletInstance: 3 }] },
      },
      fun: { Fungible: 100000000000000000n },
    },
  ],
};
const instr2 = {
  BuyExecution: [
    {
      id: {
        parents: 0,
        interior: { X1: [{ PalletInstance: 3 }] },
      },
      fun: { Fungible: 100000000000000000n },
    },
    { Unlimited: null },
  ],
};
const instr3 = {
  Transact: {
    originKind: 'SovereignAccount',
    requireWeightAtMost: { refTime: 40000000000n, proofSize: 900000n },
    call: {
      encoded:
        '0x0c1212e7bcca9b1b15f33585b5fc898b967149bdb9a5000064a7b3b6e00d000000000000000064070000000700000002000000',
    },
  },
};
const message = { V4: [instr1, instr2, instr3] };

const performRemoteDelegation = async () => {
  // 2. Construct API provider
  const wsProvider = new WsProvider(
    'wss://fro-moon-rpc-1-moonbase-relay-rpc-1.moonbase.ol-infra.network'
  );
  const api = await ApiPromise.create({ provider: wsProvider });

  // 3. Initialize wallet key pairs
  await cryptoWaitReady();
  const keyring = new Keyring({ type: 'sr25519' });
  // For demo purposes only. Never store your private key or mnemonic in a JavaScript file
  const otherPair = keyring.addFromUri(privateKey);
  console.log(`Derived Address from Private Key: ${otherPair.address}`);

  // 4. Define the transaction using the send method of the xcm pallet
  const tx = api.tx.xcmPallet.send(dest, message);

  // 5. Sign and send the transaction
  const txHash = await tx.signAndSend(otherPair);
  console.log(`Submitted with hash ${txHash}`);

  api.disconnect();
};

performRemoteDelegation();
