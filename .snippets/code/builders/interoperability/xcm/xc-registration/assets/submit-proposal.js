import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';

async function submitReferendum() {
    // Wait for the crypto libraries to be ready
    await cryptoWaitReady();

    // Connect to Moonbase Alpha
    const provider = new WsProvider('wss://moonbase-alpha.public.blastapi.io');
    const api = await ApiPromise.create({ provider });

    // Initialize keyring and add account
    const keyring = new Keyring({ type: 'ethereum' });
    
    // IMPORTANT: Replace with your private key
    const PRIVATE_KEY = 'INSERT-PRIVATE-KEY';
    const account = keyring.addFromUri(PRIVATE_KEY);

    console.log('Account address:', account.address);

    try {
        // Get current block number for enactment calculation
        const currentBlock = await api.query.system.number();
        const enactmentBlock = currentBlock.toNumber() + 100;

        // The preimage data and hash
        const preimageHash = '0x2ac24641cebeff3827ba10eb264d2db2990607c89a3fa2c8b2fef6b1e37e35e3';
        
        // Length of the original batch call data
        // This should match the length of your original encoded call data
        const preimageLength = 73; // This is the length of your batch call encoded data

        // Parameters for the referendum
        const origin = { Origins: 'FastGeneralAdmin' };
        const proposal = {
            Lookup: {
                hash: preimageHash,
                len: preimageLength
            }
        };
        const enactment = { After: 100 };

        // Create the referendum submission call
        const referendumCall = api.tx.referenda.submit(
            origin,
            proposal,
            enactment
        );

        // Get the encoded call data
        const encodedCall = referendumCall.method.toHex();
        console.log('\nReferendum submission details:');
        console.log('Encoded Call:', encodedCall);
        console.log('Current Block:', currentBlock.toString());
        console.log('Enactment Block:', enactmentBlock);
        console.log('Preimage Hash:', preimageHash);
        console.log('Preimage Length:', preimageLength);

        // Get the account's current nonce
        const nonce = await api.rpc.system.accountNextIndex(account.address);

        // Submit and wait for transaction
        const txHash = await new Promise((resolve, reject) => {
            referendumCall.signAndSend(account, { nonce }, ({ status, dispatchError, events }) => {
                if (dispatchError) {
                    if (dispatchError.isModule) {
                        const decoded = api.registry.findMetaError(dispatchError.asModule);
                        const { docs, name, section } = decoded;
                        reject(new Error(`${section}.${name}: ${docs.join(' ')}`));
                    } else {
                        reject(new Error(dispatchError.toString()));
                    }
                }

                if (status.isInBlock) {
                    console.log(`Transaction included in blockHash ${status.asInBlock}`);
                    // Try to find the referendum index from events
                    events.forEach(({ event }) => {
                        if (event.section === 'referenda' && event.method === 'Submitted') {
                            const [referendumIndex] = event.data;
                            console.log(`Referendum submitted with index: ${referendumIndex}`);
                        }
                    });
                } else if (status.isFinalized) {
                    console.log(`Transaction finalized in blockHash ${status.asFinalized}`);
                    resolve(status.asFinalized);
                }
            }).catch(reject);
        });

        console.log('Transaction successful! Hash:', txHash.toHex());

        await api.disconnect();
        return {
            transactionHash: txHash.toHex()
        };
    } catch (error) {
        console.error('Error details:', error);
        await api.disconnect();
        throw error;
    }
}

// Execute the function
submitReferendum()
    .catch(console.error)
    .finally(() => process.exit());