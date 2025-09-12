// Import the required packages
import { HDNodeWallet } from 'ethers';
import Keyring from '@polkadot/keyring';

// Define the mnemonic and derivation path
const mnemonic = 'INSERT_MNEMONIC';
const index = 0;
const ethDerPath = "m/44'/60'/0'/0/" + index;

// Derive using BIP-39 + BIP-44 via ethers (recommended for Ethereum compatibility)
const wallet = HDNodeWallet.fromPhrase(mnemonic, undefined, ethDerPath);
console.log(`Mnemonic: ${mnemonic}`);
console.log(`Ethereum Derivation Path: ${ethDerPath}`);
console.log(`Derived Address: ${wallet.address}`);
console.log(`Derived Private Key: ${wallet.privateKey}`);

// Create keyring and add the derived private key for transaction signing
const keyring = new Keyring({ type: 'ethereum' });
const keyringPair = keyring.addFromUri(wallet.privateKey);
console.log(`Keyring Address: ${keyringPair.address}`);

// Verify addresses match
console.log(`Addresses match: ${wallet.address === keyringPair.address}`);
