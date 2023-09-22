// Import the required packages
import Keyring from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';
import { mnemonicToLegacySeed, hdEthereum } from '@polkadot/util-crypto';

// Import Ethereum account from mnemonic
const keyringECDSA = new Keyring({ type: 'ethereum' });
const mnemonic = 'INSERT_MNEMONIC';
const privateKeyInput = 'INSERT_PK';

// Define index of the derivation path and the derivation path
const index = 0;
const ethDerPath = "m/44'/60'/0'/0/" + index;
console.log(`Mnemonic: ${mnemonic}`);
console.log(`--------------------------\n`);

// Extract Ethereum address from mnemonic
const newPairEth = keyringECDSA.addFromUri(`${mnemonic}/${ethDerPath}`);
console.log(`Ethereum Derivation Path: ${ethDerPath}`);
console.log(`Derived Ethereum Address from Mnemonic: ${newPairEth.address}`);

// Extract private key from mnemonic
const privateKey = u8aToHex(
  hdEthereum(mnemonicToLegacySeed(mnemonic, '', false, 64), ethDerPath)
    .secretKey
);
console.log(`Derived Private Key from Mnemonic: ${privateKey}`);
console.log(`--------------------------\n`);

// Extract address from private key
const otherPair = keyringECDSA.addFromUri(privateKeyInput);
console.log(`Derived Address from provided Private Key: ${otherPair.address}`);
