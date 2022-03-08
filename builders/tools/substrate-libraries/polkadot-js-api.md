---
title: Polkadot.js API Library
description: Follow this tutorial to learn the basic of how to use the polkadot.js API library to interact with Moonbeam networks.
---
# Polkadot.js API Library

![Intro diagram](/images/builders/tools/eth-libraries/ethersjs-banner.png)

## Introduction {: #introduction }

Polkadot.js API library allows application developers to query a Moonbeam node and interact with the node's Polkadot or Substrate interfaces using Javascript. Here you will find an overview of the available functionalities and some commonly used code examples to get you started on interacting with Moonbeam networks using polkadot.js API library. 

## Install Polkadot.js API library {: #install-polkadot.js-api-library } 

First, you need to install polkadot.js API library for your project through a package manager such as `yarn`. 

### Checking Prerequisites {: #checking-prerequisites }

Installing and using polkadot.js API library requires node.js to be installed. 

--8<-- 'text/common/install-nodejs.md'

#### Installing Polkadot.js API library {: #installing-polkadot.js-api-library } 

To get started with the polkadot.js library, install it in your project directory using the following command:

```
yarn add @polkadot/api
```

## Creating an API Provider Instance {: #creating-an-API-provider-instance }

Similar to ETH API libraries, you must first instantiate an API instance of polkadot.js API. Create the WsProvider using the websocket endpoint of the Moonbeam network you wish to interact with. 

=== "Moonbeam"
    ```javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    // Construct
    const wsProvider = new WsProvider('{{ networks.moonbeam.wss_url }}');
    const api = await ApiPromise.create({ provider: wsProvider });

    // Do something
    console.log(api.genesisHash.toHex());
    ```

=== "Moonriver"
    ```javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    // Construct
    const wsProvider = new WsProvider('{{ networks.moonriver.wss_url }}');
    const api = await ApiPromise.create({ provider: wsProvider });

    // Do something
    console.log(api.genesisHash.toHex());
    ```

=== "Moonbase Alpha"
    ```javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    // Construct
    const wsProvider = new WsProvider('{{ networks.moonbase.wss_url }}');
    const api = await ApiPromise.create({ provider: wsProvider });

    // Do something
    console.log(api.genesisHash.toHex());
    ```

=== "Moonbeam Dev Node"
    ```javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    // Construct
    const wsProvider = new WsProvider('{{ networks.development.wss_url }}');
    const api = await ApiPromise.create({ provider: wsProvider });

    // Do something
    console.log(api.genesisHash.toHex());
    ```

## Querying for Information {: #querying-for-information }

In this section, you will learn how to query for on-chain information using polkadot.js API library. 

### Metadata and Dynamic API Decoration {: #metadata-and-dynamic-api-decoration }

Before diving into the details of running different types of queries via polkadot.js API library, it's useful to understand some basic workings of the library. 

When the polkadot.js API connects to a node, one of the first things it does is to retrieve the metadata and decorate the API based on the metadata information. The metadata effectively provides data in the form of `api.<type>.<module>.<section>` that fits into one of the following categories: `consts`, `query` and `tx`. 

And therefore, none of the information contained in the `api.{consts, query, tx}.<module>.<method>` endpoints are hard coded in the API. This allows parachains like Moonbeam to have custom endpoints through its pallets that can be directly accessed via polkadot.js API library.

### State Queries {: #state-queries }

This category of queries retrieves information related to the current state of the chain. These endpoints are generally of the form, `api.query.<module>.<method>`, where the module and method decorations are generated through metadata. 

Here is a code sample for retrieving basic account information given its address:

```javascript
// Initialize the API as in previous sections
...

// Define wallet address
const ADDR = 'insert-moonbeam-network-wallet-address';

// Retrieve the last timestamp
const now = await api.query.timestamp.now();

// Retrieve the account balance & nonce via the system module
const { nonce, data: balance } = await api.query.system.account(ADDR);

console.log(`${now}: balance of ${balance.free} and a nonce of ${nonce}`);
```

### RPC Queries {: #rpc-queries }

The RPC calls provide the backbone for the transmission of data to and from the node. This means that all API endpoints such as `api.query`, `api.tx` or `api.derive` just wrap RPC calls, providing information in the encoded format as expected by the node.

The `api.rpc` interface follows the a similar format to `api.query`, for instance:

```javascript
// Retrieve the chain name
const chain = await api.rpc.system.chain();

// Retrieve the latest header
const lastHeader = await api.rpc.chain.getHeader();

// Log the information
console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);
```

### Query Subscriptions {: #query-subscriptions }

The RPCs lend themselves to using subscriptions. We can adapt the previous example to start using subscriptions to listen to new blocks.

```javascript
// Subscribe to the new headers
await api.rpc.chain.subscribeNewHeads((lastHeader) => {
  console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);
});
```

The general pattern for `api.rpc.subscribe*` functions is to pass a callback into the subscription function, and this will be triggered on each new entry as they are imported. 

Other calls under `api.query.*` can be modifed in a similar fashion to use subscription, including calls that have parameters. Here is an example to subscribe to balance changes in an account:

```javascript
// Subscribe to balance changes for our account
const unsub = await api.query.system.account(ADDR, ({ nonce, data: balance }) => {
  console.log(`free balance is ${balance.free} with ${balance.reserved} reserved and a nonce of ${nonce}`);
});
```

## Keyrings and Transactions {: #keyrings-and-transactions }

### Keyrings {: #keyrings }

The Keyring object is used for maintaining key pairs, and the signing of any data, whether it's a transfer, a message or a contract interaction.  

#### Creating a Keyring Instance {: #creating-a-keyring-instance }

You can create an instance by just creating an instance of the Keyring class, and specifying the default type of wallet address used. For Moonbeam networks, the recommended default wallet type is `edsca`.

```javascript
// Import the keyring as required
import { Keyring } from '@polkadot/api';

// Create a keyring instance
const keyring = new Keyring({ type: 'sr25519' });
```

#### Adding Accounts {: #adding-accounts }

There are a number of ways to add an account to the keyring instance, including from the mnemonic phase, and from the shortform private key. The following sample code will provide some examples:

```javascript
// Some mnemonic phrase
const PHRASE = 'entire material egg meadow latin bargain dutch coral blood melt acoustic thought';

// Add an account, straight mnemonic
const newPair = keyring.addFromUri(PHRASE);

// (Advanced) add an account with a derivation path (hard & soft)
const newDeri = keyring.addFromUri(`${PHRASE}//hard-derived/soft-derived`);

// (Advanced, development-only) add with an implied dev seed and hard derivation
const alice = keyring.addFromUri('//Alice', { name: 'Alice default' });

// add a hex seed, 32-characters in length
const hexPair = keyring.addFromUri('0x1234567890123456789012345678901234567890123456789012345678901234');

// add a string seed, internally this is padded with ' ' to 32-bytes in length
const strPair = keyring.addFromUri('Janice');
```

### Transactions {: #transactions }

Transaction endpoints are exposed, as determined by the metadata, on the `api.tx` endpoint. These allow you to submit transactions for inclusion in blocks, be it transfers, deploying contracts, interacting with pallets, or anything else Moonbeam supports.

#### Sending Basic Transactions {: #sending-basic-transactions }

Here is an example of sending a basic transaction from Alice to Bob:

```javascript
// Sign and send a transfer from Alice to Bob
const txHash = await api.tx.balances
  .transfer(BOB, 12345)
  .signAndSend(alice);

// Show the hash
console.log(`Submitted with hash ${txHash}`);
```

Note that the `signAndSend` can also accept optional parameters, such as `nonce`. For example: `signAndSend(alice, { nonce: aliceNonce })`.  

#### Sending Raw Transactions {: #sending-raw-transactions }

#### Transaction Events {: #transaction-events }

Any transaction will emit events, as a bare minimum this will always be either a system.ExtrinsicSuccess or system.ExtrinsicFailed event for the specific transaction. These provide the overall execution result for the transaction, i.e. execution has succeeded or failed.

Depending on the transaction sent, some other events may however be emitted, for instance for a balances.transfer this could include one or more of Transfer, NewAccount or ReapedAccount, as defined in the substrate balances event defaults.

To following code sample subscribes to the events emitted by a transaction and displays each event in the console:

```javascript
// Make a transfer from Alice to BOB, waiting for inclusion
const unsub = await api.tx.balances
  .transfer(BOB, 12345)
  .signAndSend(alice, ({ events = [], status }) => {
    console.log(`Current status is ${status.type}`);

    if (status.isFinalized) {
      console.log(`Transaction included at blockHash ${status.asFinalized}`);

      // Loop through Vec<EventRecord> to display all events
      events.forEach(({ phase, event: { data, method, section } }) => {
        console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
      });

      unsub();
    }
  });
```

## Custom RPC {: #custom-rpc }

RPCs are exposed as a method on a specific module. This means that once available, you can call any rpc via `api.rpc.<module>.<method>(...params[])`. This also works for accessing Ethereum RPC's using polkadot.js API, in the form of `polkadotApi.rpc.eth.*`.

You can check for a list of exposed RPC endpoints by calling `api.rpc.rpc.methods()`, which is the list of known RPCs the node exposes. 

The [Consensus and Finality page](/builders/get-started/eth-compare/consensus-finality/#) has an example for using custom RPC to check the finality of a given transaction. 

--8<-- 'text/disclaimers/third-party-content.md'