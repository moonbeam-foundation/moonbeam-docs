// Imports
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/api';
import { u8aToHex } from '@polkadot/util';
import { mnemonicToLegacySeed, hdEthereum} from '@polkadot/util-crypto';

// Construct API Provider
const wsProvider = new WsProvider('{{ networks.development.wss_url }}');
const api = await ApiPromise.create({ provider: wsProvider });

// Create a keyring instance
const keyring = new Keyring({ type: 'ethereum' });

// Define wallet address
const addr = 'INSERT-MOONBEAM-WALLET-ADDRESS';

// Initialize wallet key pairs
const alice = keyring.addFromUri('ALICE-ACCOUNT-PRIVATE-KEY');
const bob = keyring.addFromUri('BOB-ACCOUNT-PRIVATE-KEY');
const charlie = keyring.addFromUri('CHARLIE-ACCOUNT-PRIVATE-KEY');

// **Queries**

// Retrieve the last timestamp
const now = await api.query.timestamp.now();

// Retrieve the account balance & current nonce via the system module
const { nonce, data: balance } = await api.query.system.account(addr);

// retrieve the given account's next index/nonce, taking txs in the pool into account
const nextNonce = await api.rpc.system.accountNextIndex(addr);

console.log(`${now}: balance of ${balance.free} and a current nonce of ${nonce} and next nonce of ${nextNonce}`);

// Retrieve the chain name
const chain = await api.rpc.system.chain();

// Retrieve the latest header
const lastHeader = await api.rpc.chain.getHeader();

// Log the information
console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);

// **Subscriptions**

// Subscribe to the new headers
await api.rpc.chain.subscribeNewHeads((lastHeader) => {
    console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);
  });

// Subscribe to balance changes for a specified account
const unsub = await api.query.system.account(addr, ({ nonce, data: balance }) => {
    console.log(`free balance is ${balance.free} with ${balance.reserved} reserved and a nonce of ${nonce}`);
  });

// **Keyring Operations**

// Import Ethereum Account from Mnemonic
const keyringECDSA = new Keyring({ type: 'ethereum' });
const mnemonic = 'INSERT-MNEMONIC';

// Define index of the derivation path and the derivation path
const index = 0;
const ethDerPath = "m/44'/60'/0'/0/" + index;
const subsDerPath = '//hard/soft';
console.log(`Mnemonic: ${mnemonic}`);
console.log(`--------------------------\n`);

// Extract Eth address from mnemonic
const newPairEth = keyringECDSA.addFromUri(`${mnemonic}/${ethDerPath}`);
console.log(`Ethereum Derivation Path: ${ethDerPath}`);
console.log(`Derived Ethereum Address from Mnemonic: ${newPairEth.address}`);

// Extract private key from mnemonic
const privateKey = u8aToHex(
  hdEthereum(mnemonicToLegacySeed(mnemonic, '', false, 64), ethDerPath).secretKey
);
console.log(`Derived Private Key from Mnemonic: ${privateKey}`);
console.log(`--------------------------\n`);

// Extract address from private key
const otherPair = await keyringESDSA.addFromUri(privateKey);
console.log(`Derived Address from Private Key: ${otherPair.address}`);

// **Transactions**

// Sign and send a transfer from Alice to Bob
const txHash = await api.tx.balances
  .transfer(bob, 12345)
  .signAndSend(alice);

// Show the hash
console.log(`Submitted with hash ${txHash}`);

// construct a list of transactions we want to batch
const txs = [
    api.tx.balances.transfer(bob, 12345),
    api.tx.balances.transfer(charlie, 12345),
    api.tx.staking.unbond(12345)
  ];
  
// estimate the fees as RuntimeDispatchInfo, using the signer (either
// address or locked/unlocked keypair) 
const info = await api.tx.utility
  .batch(txs)
  .paymentInfo(alice);

// construct the batch and send the transactions
api.tx.utility
  .batch(txs)
  .signAndSend(alice, ({ status }) => {
    if (status.isInBlock) {
      console.log(`included in ${status.asInBlock}`);
    }
  });