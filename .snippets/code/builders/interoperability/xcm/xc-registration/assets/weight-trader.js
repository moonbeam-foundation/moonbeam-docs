import { ApiPromise, WsProvider } from '@polkadot/api';
import { encodeAddress } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';

async function getEncodedCallData() {
    // Connect to Moonbase Alpha
    const provider = new WsProvider('wss://moonbase-alpha.public.blastapi.io');
    const api = await ApiPromise.create({ provider });

    // Corrected XCM V4 Multilocation structure
    const xcmLocation = {
        parents: 1,
        interior: {
            X1: [
                { Parachain: 888 }
            ]
        }
    };

    // Relative price as u128
    const relativePrice = '5000';

    try {
        // Create the call
        const call = api.tx.xcmWeightTrader.addAsset(
            xcmLocation,
            relativePrice
        );

        // Get the encoded call data
        const encodedData = call.method.toHex();
        console.log('Encoded Call Data:', encodedData);

        await api.disconnect();
        return encodedData;
    } catch (error) {
        console.error('Error details:', error);
        console.error('Attempted XCM Location:', JSON.stringify(xcmLocation, null, 2));
        await api.disconnect();
        throw error;
    }
}

// Execute the function
getEncodedCallData()
    .catch(console.error)
    .finally(() => process.exit());