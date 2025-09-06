// Import the required packages
import Keyring from '@polkadot/keyring';
import { HDNodeWallet } from 'ethers';

// Import Ethereum account from mnemonic
const keyringECDSA = new Keyring({ type: 'ethereum' });
const mnemonic = 'INSERT_MNEMONIC';

// Define index of the derivation path and the derivation path
const index = 0;
const ethDerPath = `m/44'/60'/0'/0/${index}`;

console.log(`Mnemonic: ${mnemonic}`);
console.log(`--------------------------\n`);

// Derive using BIP-39 + BIP-44 via ethers v6 (HDNodeWallet)
const wallet = HDNodeWallet.fromPhrase(mnemonic, undefined, ethDerPath);
const derivedAddress = wallet.address;
const privateKey = wallet.privateKey; // 0x-prefixed

console.log(`Ethereum Derivation Path: ${ethDerPath}`);
console.log(`Derived Ethereum Address from Mnemonic: ${derivedAddress}`);
console.log(`Derived Private Key from Mnemonic: ${privateKey}`);

// Optional: Also show how to add to Polkadot keyring for compatibility
const alice = keyringECDSA.addFromUri(privateKey);
console.log(`--------------------------\n`);
console.log(`Address added to Polkadot keyring: ${alice.address}`);
