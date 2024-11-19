import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { BN } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

const main = async () => {
  // Setup provider and API
  const wsProvider = new WsProvider('wss://wss.api.moonbase.moonbeam.network');
  const api = await ApiPromise.create({ provider: wsProvider });

  // Setup account with ethereum format
  const keyring = new Keyring({ type: 'ethereum' });
  const account = keyring.addFromUri('INSERT_PRIVATE_KEY');

  // Convert the SS58 address to raw bytes
  const beneficiaryRaw = decodeAddress('INSERT_DESTINATION_ADDRESS');

  try {
    // Create the transaction
    const tx = api.tx.polkadotXcm.limitedReserveTransferAssets(
      // dest
      {
        V3: {
          parents: 1,
          interior: 'Here',
        },
      },
      // beneficiary
      {
        V3: {
          parents: 0,
          interior: {
            X1: {
              AccountId32: {
                id: Array.from(beneficiaryRaw),
                network: null,
              },
            },
          },
        },
      },
      // assets
      {
        V3: [
          {
            id: {
              Concrete: {
                parents: 1,
                interior: 'Here',
              },
            },
            fun: {
              Fungible: '1000000000000',
            },
          },
        ],
      },
      0, // feeAssetItem
      'Unlimited' // weightLimit
    );

    // Sign and send the transaction, displaying the transaction hash
    const unsub = await tx.signAndSend(account, ({ status, events }) => {
      if (status.isInBlock) {
        console.log(`Transaction included in blockHash ${status.asInBlock}`);
      } else if (status.isFinalized) {
        console.log(`Transaction finalized in blockHash ${status.asFinalized}`);
        unsub();
        process.exit(0);
      }
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

main().catch(console.error);