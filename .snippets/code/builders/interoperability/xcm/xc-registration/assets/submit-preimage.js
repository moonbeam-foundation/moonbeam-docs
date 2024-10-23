import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';

async function submitPreimage() {
  // Wait for the crypto libraries to be ready
  await cryptoWaitReady();

  // Connect to Moonbase Alpha
  const provider = new WsProvider('wss://moonbase-alpha.public.blastapi.io');
  const api = await ApiPromise.create({ provider });

  // Initialize keyring and add account
  const keyring = new Keyring({ type: 'ethereum' }); // Use ethereum type for Moonbeam

  // IMPORTANT: Replace with your private key
  const PRIVATE_KEY = 'INSERT-PRIVATE-KEY'; // e.g., '0x1234...'
  const account = keyring.addFromUri(PRIVATE_KEY);

  console.log('Account address:', account.address);

  // The encoded call data to be submitted as preimage
  const encodedCallData =
    '0x0100083800ffffffffffffffffffffffffffffffff010100e10d121478634d4641404d7920466f726569676e2041737365743a00010100e10d88130000000000000000000000000000';

  try {
    // Create the notePreimage call
    const preimageCall = api.tx.preimage.notePreimage(encodedCallData);

    // Calculate the hash of the preimage
    const preimageHash = await api.registry.hash(encodedCallData);

    console.log('Submitting preimage for encoded call data:');
    console.log('Original Call Data:', encodedCallData);
    console.log('Note Preimage Encoded Call:', preimageCall.method.toHex());
    console.log('Preimage Hash:', preimageHash.toHex());

    // Get the account's current nonce
    const nonce = await api.rpc.system.accountNextIndex(account.address);

    // Submit and wait for transaction
    const txHash = await new Promise((resolve, reject) => {
      preimageCall
        .signAndSend(
          account,
          { nonce },
          ({ status, dispatchError, events }) => {
            if (dispatchError) {
              if (dispatchError.isModule) {
                // Handle module error
                const decoded = api.registry.findMetaError(
                  dispatchError.asModule
                );
                const { docs, name, section } = decoded;
                reject(new Error(`${section}.${name}: ${docs.join(' ')}`));
              } else {
                // Handle other errors
                reject(new Error(dispatchError.toString()));
              }
            }

            if (status.isInBlock) {
              console.log(
                `Transaction included in blockHash ${status.asInBlock}`
              );
            } else if (status.isFinalized) {
              console.log(
                `Transaction finalized in blockHash ${status.asFinalized}`
              );
              resolve(status.asFinalized);
            }
          }
        )
        .catch(reject);
    });

    console.log('Transaction successful! Hash:', txHash.toHex());
    console.log(
      'Preimage hash (save this for reference):',
      preimageHash.toHex()
    );

    await api.disconnect();
    return {
      transactionHash: txHash.toHex(),
      preimageHash: preimageHash.toHex(),
    };
  } catch (error) {
    console.error('Error details:', error);
    await api.disconnect();
    throw error;
  }
}

// Execute the function
submitPreimage()
  .catch(console.error)
  .finally(() => process.exit());
