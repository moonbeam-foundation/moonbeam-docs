// Import the required packages
import Keyring from '@polkadot/keyring';
import { ethers } from 'ethers';

// Import Ethereum account from mnemonic
const keyringECDSA = new Keyring({ type: 'ethereum' });
const mnemonic = 'INSERT_MNEMONIC';

// Define index of the derivation path and the derivation path
const index = 0;
const ethDerPath = `m/44'/60'/0'/0/${index}`;
console.log(`Mnemonic: ${mnemonic}`);
console.log(`--------------------------\n`);

// Extract Ethereum address and private key from mnemonic using ethers
const wallet = ethers.Wallet.fromPhrase(mnemonic, ethDerPath);
const derivedAddress = wallet.address;
const privateKey = wallet.privateKey; // 0x-prefixed

console.log(`Ethereum Derivation Path: ${ethDerPath}`);
console.log(`Derived Ethereum Address from Mnemonic: ${derivedAddress}`);
console.log(`Derived Private Key from Mnemonic: ${privateKey}`);

// Optional: Also show how to add to Polkadot keyring for compatibility
const alice = keyringECDSA.addFromUri(privateKey);
console.log(`--------------------------\n`);
console.log(`Address added to Polkadot keyring: ${alice.address}`);
