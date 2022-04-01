---
title: Polkadot.js API
description: Follow this tutorial to learn the basic of how to use the polkadot.js API library to interact with Moonbeam networks.
---
# Polkadot.js API Library

![Intro diagram](/images/builders/build/substrate-api/polkadot-js-api/polkadot-js-api-banner.png)

## Introduction {: #introduction }

[Polkadot.js API](https://polkadot.js.org/docs/api/){target=_blank} library allows application developers to query a Moonbeam node and interact with the node's Polkadot or Substrate interfaces using JavaScript. Here you will find an overview of the available functionalities and some commonly used code examples to get you started on interacting with Moonbeam networks using polkadot.js API library. 

## Checking Prerequisites {: #checking-prerequisites }

Installing and using polkadot.js API library requires node.js to be installed. 

--8<-- 'text/common/install-nodejs.md'

--8<-- 'text/common/endpoint-examples.md'

### Installing Polkadot.js API library {: #installing-polkadot.js-api-library } 

First, you need to install polkadot.js API library for your project through a package manager such as `yarn`. Install it in your project directory with the following command:

```
yarn add @polkadot/api
```

### Installing Moonbeam Types Bundle {: #moonbeam-types-bundle }

For decoding Moonbeam custom events and types, you will need to include the [Moonbeam Types Bundle](https://www.npmjs.com/package/moonbeam-types-bundle){target=_blank} into your project by adding the following package information to your `package.json`:

```json
"@polkadot/api": "^{{ networks.moonbase.moonbeam_types_bundle.stable_version }}",
"moonbeam-types-bundle": "^{{ networks.moonbase.moonbeam_types_bundle.polkadot_js_dependency_version }}",
"typescript": "{{ networks.moonbase.moonbeam_types_bundle.typescript_dependency_version }}"
```

And add this import statement to the start of your project file:

```javascript
import { typesBundlePre900 } from "moonbeam-types-bundle"
```

## Creating an API Provider Instance {: #creating-an-API-provider-instance }

Similar to ETH API libraries, you must first instantiate an API instance of polkadot.js API. Create the `WsProvider` using the websocket endpoint of the Moonbeam network you wish to interact with. 

--8<-- 'text/common/endpoint-examples.md'

=== "Moonbeam"
    ```javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    // Construct API provider
    const wsProvider = new WsProvider('{{ networks.moonbeam.wss_url }}');
    const api = await ApiPromise.create({ provider: wsProvider });
    ```

=== "Moonriver"
    ```javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    // Construct API provider
    const wsProvider = new WsProvider('{{ networks.moonriver.wss_url }}');
    const api = await ApiPromise.create({ provider: wsProvider });
    ```

=== "Moonbase Alpha"
    ```javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    // Construct API provider
    const wsProvider = new WsProvider('{{ networks.moonbase.wss_url }}');
    const api = await ApiPromise.create({ provider: wsProvider });
    ```

=== "Moonbeam Dev Node"
    ```javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    // Construct API provider
    const wsProvider = new WsProvider('{{ networks.development.wss_url }}');
    const api = await ApiPromise.create({ provider: wsProvider });
    ```

### Metadata and Dynamic API Decoration {: #metadata-and-dynamic-api-decoration }

Before diving into the details of performing different tasks via polkadot.js API library, it's useful to understand some basic workings of the library. 

When the polkadot.js API connects to a node, one of the first things it does is to retrieve the metadata and decorate the API based on the metadata information. The metadata effectively provides data in the form of `api.<type>.<module>.<section>` that fits into one of the following `<type>` categories: `consts`, `query` and `tx`. 

And therefore, none of the information contained in the `api.{consts, query, tx}.<module>.<method>` endpoints are hard coded in the API. This allows parachains like Moonbeam to have custom endpoints through its pallets that can be directly accessed via polkadot.js API library.

## Querying for Information {: #querying-for-information }

In this section, you will learn how to query for on-chain information using polkadot.js API library. 

### State Queries {: #state-queries }

This category of queries retrieves information related to the current state of the chain. These endpoints are generally of the form, `api.query.<module>.<method>`, where the module and method decorations are generated through metadata. You can see a list of all available endpoints by examining the `api.query` object, via `console.log(api.query)` or otherwise. 

Here is a code sample for retrieving basic account information given its address:

```javascript
// Initialize the API provider as in the previous section
...

// Define wallet address
const addr = 'MOONBEAM-WALLET-ADDRESS-HERE';

// Retrieve the last timestamp
const now = await api.query.timestamp.now();

// Retrieve the account balance & current nonce via the system module
const { nonce, data: balance } = await api.query.system.account(addr);

// Retrieve the given account's next index/nonce, taking txs in the pool into account
const nextNonce = await api.rpc.system.accountNextIndex(addr);

console.log(`${now}: balance of ${balance.free} and a current nonce of ${nonce} and next nonce of ${nextNonce}`);
```

You can view the [complete script on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/substrate-api/state-queries.js){target=_blank}.

### RPC Queries {: #rpc-queries }

The RPC calls provide the backbone for the transmission of data to and from the node. This means that all API endpoints such as `api.query`, `api.tx` or `api.derive` just wrap RPC calls, providing information in the encoded format as expected by the node.

The `api.rpc` interface follows the a similar format to `api.query`, for instance:

```javascript
// Initialize the API provider as in the previous section
...

// Retrieve the chain name
const chain = await api.rpc.system.chain();

// Retrieve the latest header
const lastHeader = await api.rpc.chain.getHeader();

// Log the information
console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);
```

You can view the [complete script on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/substrate-api/rpc-queries.js){target=_blank}.

### Query Subscriptions {: #query-subscriptions }

The RPCs lend themselves to using subscriptions. We can adapt the previous example to start using subscriptions to listen to new blocks.

```javascript
// Initialize the API provider as in the previous section
...

// Retrieve the chain name
const chain = await api.rpc.system.chain();

// Subscribe to the new headers
await api.rpc.chain.subscribeNewHeads((lastHeader) => {
  console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);
});
```

The general pattern for `api.rpc.subscribe*` functions is to pass a callback into the subscription function, and this will be triggered on each new entry as they are imported. 

Other calls under `api.query.*` can be modifed in a similar fashion to use subscription, including calls that have parameters. Here is an example to subscribe to balance changes in an account:

```javascript
// Initialize the API provider as in the previous section
...

// Define wallet address
const addr = 'MOONBEAM-WALLET-ADDRESS-HERE';

// Subscribe to balance changes for a specified account
await api.query.system.account(addr, ({ nonce, data: balance }) => {
  console.log(`free balance is ${balance.free} with ${balance.reserved} reserved and a nonce of ${nonce}`);
});
```

You can view the [complete script on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/substrate-api/query-subscriptions.js){target=_blank}.

## Keyrings {: #keyrings }

The Keyring object is used for maintaining key pairs, and the signing of any data, whether it's a transfer, a message, or a contract interaction.  

### Creating a Keyring Instance {: #creating-a-keyring-instance }

You can create an instance by just creating an instance of the Keyring class, and specifying the default type of wallet address used. For Moonbeam networks, the default wallet type should be `ethereum`.

```javascript
// Import the keyring as required
import { Keyring } from '@polkadot/api';

// Create a keyring instance
const keyring = new Keyring({ type: 'ethereum' });
```

### Adding Accounts {: #adding-accounts }

There are a number of ways to add an account to the keyring instance, including from the mnemonic phrase, and from the shortform private key. The following sample code will provide some examples:

```javascript
// Import the required packages
import Keyring from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';
import { mnemonicToLegacySeed, hdEthereum} from '@polkadot/util-crypto';

// Import Ethereum account from mnemonic
const keyringECDSA = new Keyring({ type: 'ethereum' });
const mnemonic = 'MNEMONIC-HERE';

// Define index of the derivation path and the derivation path
const index = 0;
const ethDerPath = "m/44'/60'/0'/0/" + index;
const subsDerPath = '//hard/soft';
console.log(`Mnemonic: ${mnemonic}`);
console.log(`--------------------------\n`);

// Extract Ethereum address from mnemonic
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
```

## Transactions {: #transactions }

Transaction endpoints are exposed, as determined by the metadata, on the `api.tx` endpoint. These allow you to submit transactions for inclusion in blocks, be it transfers, deploying contracts, interacting with pallets, or anything else Moonbeam supports.

### Sending Basic Transactions {: #sending-basic-transactions }

Here is an example of sending a basic transaction from Alice to Bob:

```javascript
// Initialize the API provider as in the previous section
...

// Initialize the keyring instance as in the previous section
...

// Initialize wallet key pairs
const alice = keyring.addFromUri('ALICE-ACCOUNT-PRIVATE-KEY');
const bob = 'BOB-ACCOUNT-PUBLIC-KEY';

// Sign and send a transfer from Alice to Bob
const txHash = await api.tx.balances
  .transfer(bob, 12345)
  .signAndSend(alice);

// Show the hash
console.log(`Submitted with hash ${txHash}`);
```

You can view the [complete script on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/substrate-api/basic-transactions.js){target=_blank}.

Note that the `signAndSend` function can also accept optional parameters, such as the `nonce`. For example, `signAndSend(alice, { nonce: aliceNonce })`. You can use the [sample code from the State Queries](/builders/build/substrate-api/polkadot-js-api/#state-queries){target=_blank} section to retrieve the correct nonce, including transactions in the mempool.

### Transaction Events {: #transaction-events }

Any transaction will emit events, as a bare minimum this will always be either a `system.ExtrinsicSuccess` or `system.ExtrinsicFailed` event for the specific transaction. These provide the overall execution result for the transaction, i.e. execution has succeeded or failed.

Depending on the transaction sent, some other events may however be emitted, for instance for a balance transfer event, this could include one or more `balance.Transfer` events.

The Transfer API page includes an [example code snippet](/builders/get-started/eth-compare/transfers-api/#monitor-all-balance-transfers-with-the-substrate-api){target=_blank} for subscribing to new finalized block headers, and retrieving all `balance.Transfer` events. 

### Batching Transactions {: #batching-transactions }

Polkadot.js API allows transactions to be batch processed via the `api.tx.utility.batch` method. The batched transactions are processed sequentially from a single sender. The transaction fee can be estimated using the `paymentInfo` helper method. The following example makes a couple of transfers and also uses the `api.tx.parachainStaking` module to schedule a request to decrease the bond of a specific collator candidate:

```javascript
// Initialize the API provider as in the previous section
...

// Initialize the keyring instance as in the previous section
...

// Initialize wallet key pairs as in the previous section
...

// Construct a list of transactions we want to batch
const collator = 'COLLATOR-ACCOUNT-PUBLIC-KEY';
const txs = [
  api.tx.balances.transfer(bob, 12345),
  api.tx.balances.transfer(charlie, 12345),
  api.tx.parachainStaking.scheduleDelegatorBondLess(collator, 12345)
];

// Estimate the fees as RuntimeDispatchInfo, using the signer (either
// address or locked/unlocked keypair) 
const info = await api.tx.utility
  .batch(txs)
  .paymentInfo(alice);

console.log(`estimated fees: ${info}`);

// Construct the batch and send the transactions
api.tx.utility
  .batch(txs)
  .signAndSend(alice, ({ status }) => {
    if (status.isInBlock) {
      console.log(`included in ${status.asInBlock}`);
    }
  });
```

You can view the [complete script on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/substrate-api/batch-transactions.js){target=_blank}.

!!! note
    You can check out all of the available functions for the `parachainStaking` module by adding `console.log(api.tx.parachainStaking);` to your code.

## Custom RPC Requests {: #custom-rpc-requests }

RPCs are exposed as a method on a specific module. This means that once available, you can call any rpc via `api.rpc.<module>.<method>(...params[])`. This also works for accessing Ethereum RPCs using polkadot.js API, in the form of `polkadotApi.rpc.eth.*`.

You can check for a list of exposed RPC endpoints by calling `api.rpc.rpc.methods()`, which is the list of known RPCs the node exposes. 

The [Consensus and Finality page](/builders/get-started/eth-compare/consensus-finality/#) has examples for using the custom RPC calls to check the finality of a given transaction. 

--8<-- 'text/disclaimers/third-party-content.md'
