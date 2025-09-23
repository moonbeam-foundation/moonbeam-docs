// Import the required packages
import Keyring from '@polkadot/keyring';

// Import Ethereum account from mnemonic
const keyringECDSA = new Keyring({ type: 'ethereum' });

// Ensure private key is prefixed with 0x 
const privateKeyInput = 'INSERT_PRIVATE_KEY';

// Extract address from private key
const alice = keyringECDSA.addFromUri(privateKeyInput);
console.log(`Derived Address from provided Private Key: ${alice.address}`);