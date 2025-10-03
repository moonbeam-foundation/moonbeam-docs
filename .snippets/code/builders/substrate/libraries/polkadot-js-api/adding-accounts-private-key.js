// Import the required packages
import Keyring from '@polkadot/keyring';

// Import Ethereum account from private key
const privateKeyInput = 'INSERT_PK';

// Extract address from private key
const keyring = new Keyring();
const pairFromPk = keyring.createFromUri(
  privateKeyInput,
  undefined,
  'ethereum'
);
console.log(`Derived Address from provided Private Key: ${pairFromPk.address}`);
