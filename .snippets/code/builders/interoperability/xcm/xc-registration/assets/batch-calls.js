import { ApiPromise, WsProvider } from '@polkadot/api';
import { encodeAddress } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';

async function getEncodedBatchCallData() {
    // Connect to Moonbase Alpha
    const provider = new WsProvider('wss://moonbase-alpha.public.blastapi.io');
    const api = await ApiPromise.create({ provider });

    try {
        // Parameters for createForeignAsset
        const assetId = '340282366920938463463374607431768211455';
        const xcmLocation = {
            parents: 1,
            interior: {
                X1: [
                    { Parachain: 888 }
                ]
            }
        };
        const assetName = Array.from(Buffer.from('My Foreign Asset'));
        const assetSymbol = Array.from(Buffer.from('xcMFA'));
        const decimals = 18;

        // Parameters for xcmWeightTrader.addAsset
        const relativePrice = '5000';

        // Create individual calls
        const createAssetCall = api.tx.evmForeignAssets.createForeignAsset(
            assetId,
            xcmLocation,
            decimals,
            assetSymbol,
            assetName
        );

        const addAssetCall = api.tx.xcmWeightTrader.addAsset(
            xcmLocation,
            relativePrice
        );

        // Combine calls into a batch
        const batchCall = api.tx.utility.batch([
            createAssetCall,
            addAssetCall
        ]);

        // Get the encoded call data for the batch
        const encodedBatchData = batchCall.method.toHex();
        
        console.log('Individual Calls:');
        console.log('Create Asset Call:', createAssetCall.method.toHex());
        console.log('Add Asset Call:', addAssetCall.method.toHex());
        console.log('\nBatch Call:');
        console.log('Encoded Batch Call Data:', encodedBatchData);

        await api.disconnect();
        return encodedBatchData;
    } catch (error) {
        console.error('Error details:', error);
        await api.disconnect();
        throw error;
    }
}

// Execute the function
getEncodedBatchCallData()
    .catch(console.error)
    .finally(() => process.exit());