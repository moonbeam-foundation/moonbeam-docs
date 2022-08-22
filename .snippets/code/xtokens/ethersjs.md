```javascript
import abi from './xtokensABI.js'; // Import the xTokens ABI
import { ethers } from 'ethers'; // Import ethers library

// Create ethers wallet & contract instance
const PRIVATE_KEY = 'YOUR_PRIVATE_KEY';
const provider = new ethers.providers.JsonRpcProvider('https://rpc.api.moonbase.moonbeam.network');
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const xTokens = new ethers.Contract('0x0000000000000000000000000000000000000804', abi, signer);

// Multilocation targeting the relay chain or its asset from a parachain
const RELAY_CHAIN_ASSET = [1, []];

// xcUNIT address in Moonbase Alpha
const xcUNIT_ADDRESS = '0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080';

// Sends 1 xcUNIT to the relay chain using the transfer function
async function transferToAlice() {
    const transaction = await xTokens.transfer(
        xcUNIT_ADDRESS,         // Asset
        '1000000000000',        // Amount
        ALICE_RELAY_ACC,        // Destination
        '1000000000'            // Weight
    );
    console.log(transaction);
}

// Multilocation targeting Alice's account on the Relay Chain from Moonbase Alpha
const ALICE_RELAY_ACC = [1, ['0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300']];

// Sends 1 xcUNIT to the relay chain using the transferMultiasset function
async function transferMultiassetToAlice() {
    const transaction = await xTokens.transferMultiasset(
        RELAY_CHAIN_ASSET,      // Asset
        '1000000000000',        // Amount
        ALICE_RELAY_ACC,        // Destination
        '1000000000'            // Weight
    );
    console.log(transaction);
}

const LOCAL_ASSET = [1, []];

const ACC_ON_PARACHAIN = [1, []];

async function transferLocalAssetToParachain() {
    const transaction = await xTokens.transferMultiasset(
        LOCAL_ASSET,
        '1000000',
        ACC_ON_PARACHAIN,
        '1000000000'
    );
    console.log(transaction);
}

transferToAlice();
transferMultiassetToAlice();
```