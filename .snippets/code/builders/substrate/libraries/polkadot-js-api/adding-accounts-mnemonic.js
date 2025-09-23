// Import required packages
import Keyring from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';
import { mnemonicToLegacySeed, hdEthereum, cryptoWaitReady } from '@polkadot/util-crypto';

(async function main() {
  await cryptoWaitReady();

  // Define the mnemonic and derivation path
  const mnemonic = 'INSERT_MNEMONIC';
  const index = 0;
  const ethDerPath = `m/44'/60'/0'/0/${index}`;

  // Derive Ethereum account from mnemonic using createFromUri
  const keyring = new Keyring({ type: 'ethereum' });
  const uri = `${mnemonic}/${ethDerPath}`;
  const pair = keyring.createFromUri(uri, undefined, 'ethereum', undefined, 2048);

  console.log(`Mnemonic: ${mnemonic}`);
  console.log(`Ethereum Derivation Path: ${ethDerPath}`);
  console.log(`Derived Address: ${pair.address}`);

  // Derive private key explicitly with hdEthereum
  const seed = mnemonicToLegacySeed(mnemonic, '', false, 64);
  const hd = hdEthereum(seed, ethDerPath);
  // Ethereum private keys are 32 bytes (256 bits), which is 64 hexadecimal characters.
  // We use .slice(-64) to ensure we get exactly the 64 hex characters representing the private key.
  const privateKeyHex = `0x${u8aToHex(hd.secretKey).slice(-64)}`;
  console.log(`Derived Private Key: ${privateKeyHex}`);
})();