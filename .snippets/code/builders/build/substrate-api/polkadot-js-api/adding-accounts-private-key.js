// Import the required packages
import Keyring from '@polkadot/keyring';

// Import Ethereum account from mnemonic
const keyringECDSA = new Keyring({ type: 'ethereum' });
const privateKeyInput = 'INSERT_PK';

// Extract address from private key
const alice = keyringECDSA.addFromUri(privateKeyInput);
console.log(`Derived Address from provided Private Key: ${alice.address}`);
