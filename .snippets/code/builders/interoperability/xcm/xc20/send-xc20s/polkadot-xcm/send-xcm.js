import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
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
    // Create the transaction (XCM v4)
    const tx = api.tx.polkadotXcm.transferAssets(
      // Destination (V4)
      {
        V4: {
          parents: 1,
          interior: {
            Here: null
          }
        }
      },
      // Beneficiary (V4)
      {
        V4: {
          parents: 1,
          interior: {
            X1: [
              {
                AccountId32: {
                  network: null,
                  id: beneficiaryRaw
                }
              }
            ]
          }
        }
      },
      // Assets (V4)
      {
        V4: [
          {
            fun: {
              Fungible: 1000000000000n
            },
            id: {
              parents: 1,
              interior: {
                Here: null
              }
            }
          }
        ]
      },
      0,           // feeAssetItem
      'Unlimited'  // weightLimit
    );

    // Sign and send the transaction
    const unsub = await tx.signAndSend(account, ({ status }) => {
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