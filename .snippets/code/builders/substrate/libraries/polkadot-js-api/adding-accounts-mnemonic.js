// Import the required packages
import Keyring from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';
import { hdEthereum } from '@polkadot/util-crypto';
import { mnemonicToSeedSync } from 'bip39';

// Import Ethereum account from mnemonic
const mnemonic = 'INSERT_MNEMONIC';

// Use the exact EVM derivation path
const ethDerPath = "m/44'/60'/0'/0/0";
console.log(`Mnemonic: ${mnemonic}`);
console.log(`--------------------------\n`);

// Extract Ethereum address from mnemonic
const keyring = new Keyring();
const pair = keyring.createFromUri(
  `${mnemonic}/${ethDerPath}`,
  undefined,
  'ethereum',
  undefined,
  2048
);
console.log(`Ethereum Derivation Path: ${ethDerPath}`);
console.log(`Derived Ethereum Address from Mnemonic: ${pair.address}`);

// Extract private key from mnemonic
const seed = mnemonicToSeedSync(mnemonic, '');   // Buffer
const node = hdEthereum(seed, ethDerPath);       // "m/44'/60'/0'/0/0"
const privateKey = u8aToHex(node.secretKey);
console.log(`Derived Private Key from Mnemonic: ${privateKey}`);
