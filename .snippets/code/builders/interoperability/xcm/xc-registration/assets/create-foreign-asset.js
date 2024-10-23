import { ApiPromise, WsProvider } from '@polkadot/api';
import { encodeAddress } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';

async function getEncodedCallData() {
    // Connect to Moonbase Alpha
    const provider = new WsProvider('wss://moonbase-alpha.public.blastapi.io');
    const api = await ApiPromise.create({ provider });

    // Example parameters with correct types
    const assetId = '340282366920938463463374607431768211455'; 
    
    // XCM V4 Multilocation structured according to Moonbeam's format
    const xcmLocation = {
        parents: 1,
        interior: {
            X1: [
                { Parachain: 888 }  // Replace with actual parachain ID
            ]
        }
    };

    // Convert strings to Uint8Array for Bytes type
    const assetName = Array.from(Buffer.from('My Foreign Asset'));
    const assetSymbol = Array.from(Buffer.from('xcMFA'));
    
    // Decimals as a number (not string)
    const decimals = 18;

    try {
        // Create the call
        const call = api.tx.evmForeignAssets.createForeignAsset(
            assetId,
            xcmLocation,
            decimals,
            assetSymbol,
            assetName
        );

        // Get the encoded call data
        const encodedData = call.method.toHex();
        console.log('Encoded Call Data:', encodedData);

        await api.disconnect();
        return encodedData;
    } catch (error) {
        console.error('Error details:', error);
        await api.disconnect();
        throw error;
    }
}

// Execute the function
getEncodedCallData()
    .catch(console.error)
    .finally(() => process.exit());