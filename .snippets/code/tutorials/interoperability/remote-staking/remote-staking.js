import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';

const privateKey = 'INSERT_PRIVATE_KEY_OR_MNEMONIC';

// 1. Define the dest and message arguments
const dest = { V3: { parents: 0, interior: { X1: { Parachain: 1000 } } } };
const message = {
  V3: [
    {
      WithdrawAsset: [
        {
          id: {
            Concrete: { parents: 0, interior: { X1: { PalletInstance: 3 } } },
          },
          fun: { Fungible: 100000000000000000n },
        },
      ],
    },
    {
      BuyExecution: [
        {
          id: {
            Concrete: { parents: 0, interior: { X1: { PalletInstance: 3 } } },
          },
          fun: { Fungible: 100000000000000000n },
        },
        { Unlimited: null },
      ],
    },
    {
      Transact: {
        originKind: 'SovereignAccount',
        requireWeightAtMost: { refTime: 40000000000n, proofSize: 900000n },
        call: {
          encoded:
            '0x0c123a7d3048f3cb0391bb44b518e5729f07bcc7a45d000064a7b3b6e00d000000000000000064430000000600000000000000',
        },
      },
    },
  ],
};

const performRemoteDelegation = async () => {
  // 2. Construct API provider
  const wsProvider = new WsProvider(
    'wss://fro-moon-rpc-1-moonbase-relay-rpc-1.moonbase.ol-infra.network'
  );
  const api = await ApiPromise.create({ provider: wsProvider });

  // 3. Initialize wallet key pairs
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
