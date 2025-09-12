// Import the required packages
import { ethers } from 'ethers';
import Keyring from '@polkadot/keyring';

// Define the private key (with 0x prefix)
const privateKey = 'INSERT_PRIVATE_KEY'; // e.g., '0x...'

// Option 1: Get address using ethers (recommended for verification)
const wallet = new ethers.Wallet(privateKey);
console.log(`Address from ethers: ${wallet.address}`);

// Option 2: Create keyring pair for transaction signing
const keyring = new Keyring({ type: 'ethereum' });
const keyringPair = keyring.addFromUri(privateKey);
console.log(`Address from keyring: ${keyringPair.address}`);

// Verify addresses match
console.log(`Addresses match: ${wallet.address === keyringPair.address}`);
