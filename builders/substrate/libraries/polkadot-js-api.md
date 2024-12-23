---
title: How to use the Polkadot.js API
description: Learn how to use the Polkadot.js API to interact with a Moonbeam node to get chain data and send transactions (extrinsics) via the Substrate side of Moonbeam.
---

# Polkadot.js API Library

## Introduction {: #introduction }

[Polkadot.js](https://wiki.polkadot.network/docs/polkadotjs){target=\_blank} is a collection of tools that allow you to interact with Polkadot and its parachains, such as Moonbeam. The [Polkadot.js API](https://polkadot.js.org/docs/api){target=\_blank} is one component of Polkadot.js and is a library that allows application developers to query a Moonbeam node and interact with the node's Substrate interfaces using JavaScript, enabling you to read and write data to the network.

You can use the Polkadot.js API to query on-chain data and send extrinsics from the Substrate side of Moonbeam. You can query Moonbeam's runtime constants, chain state, events, transaction (extrinsic) data, and more.

Here you will find an overview of the available functionalities and some commonly used code examples to get you started on interacting with Moonbeam networks using the Polkadot.js API library.

## Checking Prerequisites {: #checking-prerequisites }

Installing and using Polkadot.js API library requires Node.js to be installed.

--8<-- 'text/_common/install-nodejs.md'

--8<-- 'text/_common/endpoint-examples.md'

### Install Polkadot.js API {: #installing-polkadot.js-api-library }

First, you need to install the Polkadot.js API library for your project through a package manager such as `yarn`. Install it in your project directory with the following command:

=== "npm"

    ```bash
    npm i @polkadot/api
    ```

=== "yarn"

    ```bash
    yarn add @polkadot/api
    ```

The library also includes other core components like Keyring for account management, or some utilities that are used throughout this guide.

## Create an API Provider Instance {: #creating-an-API-provider-instance }

Similar to [Ethereum API libraries](/builders/ethereum/libraries/){target=\_blank}, you must first instantiate an API instance of the Polkadot.js API. Create the `WsProvider` using the WebSocket endpoint of the Moonbeam network you wish to interact with.

--8<-- 'text/_common/endpoint-examples.md'

=== "Moonbeam"

    ```javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    const main = async () => {
      // Construct API provider
      const wsProvider = new WsProvider('{{ networks.moonbeam.wss_url }}');
      const api = await ApiPromise.create({ provider: wsProvider });

      // Code goes here

      await api.disconnect();
    }

    main();
    ```

=== "Moonriver"

    ```javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    const main = async () => {
      // Construct API provider
      const wsProvider = new WsProvider('{{ networks.moonriver.wss_url }}');
      const api = await ApiPromise.create({ provider: wsProvider });

      // Code goes here

      await api.disconnect();
    }

    main();
    ```

=== "Moonbase Alpha"

    ```javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    const main = async () => {
      // Construct API provider
      const wsProvider = new WsProvider('{{ networks.moonbase.wss_url }}');
      const api = await ApiPromise.create({ provider: wsProvider });

      // Code goes here

      await api.disconnect();
    }

    main();
    ```

=== "Moonbeam Dev Node"

    ```javascript
    // Import
    import { ApiPromise, WsProvider } from '@polkadot/api';

    const main = async () => {
      // Construct API provider
      const wsProvider = new WsProvider('{{ networks.development.wss_url }}');
      const api = await ApiPromise.create({ provider: wsProvider });

      // Code goes here

      await api.disconnect();
    }

    main();
    ```

### Metadata and Dynamic API Decoration {: #metadata-and-dynamic-api-decoration }

Before diving into the details of performing different tasks via the Polkadot.js API library, it's useful to understand some of the basic workings of the library.

When the Polkadot.js API connects to a node, one of the first things it does is retrieve the metadata and decorate the API based on the metadata information. The metadata effectively provides data in the form of:

```text
api.<type>.<module>.<section>
```

Where `<type>` can be either:

- `query` - for endpoints to read all the state queries
- `tx` - for endpoints related to transactions
- `rpc` - for endpoints specific to RPC calls
- `consts` - for endpoints specific to runtime constants

And therefore, none of the information contained in the `api.{query, tx, rpc, consts}.<module>.<method>` endpoints are hard-coded in the API. This allows parachains like Moonbeam to have custom endpoints through its [pallets](/builders/substrate/interfaces/){target=\_blank} that can be directly accessed via the Polkadot.js API library.

## Query On-Chain Data on Moonbeam {: #querying-for-information }

In this section, you will learn how to query for on-chain information using the Polkadot.js API library.

### Moonbeam Chain State Queries {: #state-queries }

This category of queries retrieves information related to the current state of the chain. These endpoints are generally of the form `api.query.<module>.<method>`, where the module and method decorations are generated through metadata. You can see a list of all available endpoints by examining the `api.query` object, for example via:

```javascript
console.log(api.query);
```

Assuming you've [initialized the API](#creating-an-API-provider-instance), here is a code sample for retrieving basic account information given its address :

```javascript
// Define wallet address
const addr = 'INSERT_ADDRESS';

// Retrieve the last timestamp
const now = await api.query.timestamp.now();

// Retrieve the account balance & current nonce via the system module
const { nonce, data: balance } = await api.query.system.account(addr);

console.log(
  `${now}: balance of ${balance.free} and a current nonce of ${nonce}`
);
```

??? code "View the complete script"

    ```js
    --8<-- 'code/builders/substrate/libraries/polkadot-js-api/state-queries.js'
    ```

### Moonbeam RPC Queries {: #rpc-queries }

The RPC calls provide the backbone for the transmission of data to and from the node. This means that all API endpoints such as `api.query`, `api.tx` or `api.derive` just wrap RPC calls, providing information in the encoded format as expected by the node. You can see a list of all available endpoints by examining the `api.rpc` object, for example via:

```javascript
console.log(api.rpc);
```

The `api.rpc` interface follows the a similar format to `api.query`, for instance:

```javascript
// Retrieve the chain name
const chain = await api.rpc.system.chain();

// Retrieve the latest header
const lastHeader = await api.rpc.chain.getHeader();

// Log the information
console.log(
  `${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`
);
```

??? code "View the complete script"

    ```js
    --8<-- 'code/builders/substrate/libraries/polkadot-js-api/rpc-queries.js'
    ```

### Query Subscriptions {: #query-subscriptions }

The `rpc` API also provide endpoints for subscriptions. You can adapt the previous example to start using subscriptions to listen to new blocks. Note that you need to remove the API disconnect when using subscriptions, to avoid normal closures of the WSS connection.

```javascript
// Retrieve the chain name
const chain = await api.rpc.system.chain();

// Subscribe to the new headers
await api.rpc.chain.subscribeNewHeads((lastHeader) => {
  console.log(
    `${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`
  );
});
// Remove await api.disconnect()!
```

The general pattern for `api.rpc.subscribe*` functions is to pass a callback into the subscription function, and this will be triggered on each new entry as they are imported.

Other calls under `api.query.*` can be modified in a similar fashion to use subscription, including calls that have parameters. Here is an example of how to subscribe to balance changes in an account:

```javascript
// Define wallet address
const addr = 'INSERT_ADDRESS';

// Subscribe to balance changes for a specified account
await api.query.system.account(addr, ({ nonce, data: balance }) => {
  console.log(
    `Free balance is ${balance.free} with ${balance.reserved} reserved and a nonce of ${nonce}`
  );
});

// Remove await api.disconnect()!
```

??? code "View the complete script"

    ```js
    --8<-- 'code/builders/substrate/libraries/polkadot-js-api/query-subscriptions.js'
    ```

## Create a Keyring for a Moonbeam Account {: #keyrings }

The Keyring object is used for maintaining key pairs, and the signing of any data, whether it's a transfer, a message, or a contract interaction.

### Create a Keyring Instance {: #creating-a-keyring-instance }

You can create an instance by just creating an instance of the Keyring class, and specifying the default type of wallet address used. For Moonbeam networks, the default wallet type should be `ethereum`.

```javascript
// Import the keyring as required
import Keyring from '@polkadot/keyring';

// Create a keyring instance
const keyring = new Keyring({ type: 'ethereum' });
```

### Add an Account to a Keyring {: #adding-accounts }

There are a number of ways to add an account to the keyring instance, including from the mnemonic phrase and from the shortform private key.

=== "From Mnemonic"

    ```javascript
    --8<-- 'code/builders/substrate/libraries/polkadot-js-api/adding-accounts-mnemonic.js'
    ```

=== "From Private Key"

    ```javascript
    --8<-- 'code/builders/substrate/libraries/polkadot-js-api/adding-accounts-private-key.js'
    ```

## Dry Run API  {: #dry-run-api }

The Dry Run API is an easy and convenient way to test the integrity of a call without incurring any transaction fees. The Dry Run API can be accessed from the [Runtime Calls](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbeam.network#/runtime){target=\_blank} tab of the **Developer** section of Polkadot.js Apps. While primarily intended for the [testing of XCM messages](/builders/interoperability/xcm/send-execute-xcm/#test-an-xcm-message-with-the-dry-run-api){target=\_blank} , the Dry Run API can be used to test any arbitrary call. 

This method takes the origin and call data as parameters and returns an execution result and additional event data. 

```javascript
const testAccount = api.createType(
  'AccountId20',
  '0x88bcE0b038eFFa09e58fE6d24fDe4b5Af21aa798'
);
const callData =
  '0x030088bce0b038effa09e58fe6d24fde4b5af21aa79813000064a7b3b6e00d';
const callDataU8a = hexToU8a(callData);

const result = await api.call.dryRunApi.dryRunCall(
  { system: { Signed: testAccount } },
  callDataU8a
);
```

??? code "View the complete script"

    ```js
    --8<-- 'code/builders/substrate/libraries/polkadot-js-api/dry-run.js'
    ```

Upon calling the Dry Run API, the method will tell you whether the call would be successful and returns the event data that would be emitted if the call were actually submitted on chain. You can view the initial output of the `dryRunCall` below.

??? code "View the complete output"

    ```json
    --8<-- 'code/builders/substrate/libraries/polkadot-js-api/dry-run-result.json'
    ```

## Send Transactions on Moonbeam  {: #transactions }

Transaction endpoints are exposed on endpoints generally of the form `api.tx.<module>.<method>`, where the module and method decorations are generated through metadata. These allow you to submit transactions for inclusion in blocks, be it transfers, interacting with pallets, or anything else Moonbeam supports. You can see a list of all available endpoints by examining the `api.tx` object, for example via:

```javascript
console.log(api.tx);
```

### Send a Transaction {: #sending-basic-transactions }

The Polkadot.js API library can be used to send transactions to the network. For example, assuming you've [initialized the API](#creating-an-API-provider-instance) and a [keyring instance](#creating-a-keyring-instance), you can use the following snippet to send a basic transaction (this code sample will also retrieve the encoded calldata of the transaction as well as the transaction hash after submitting):

```javascript
// Initialize wallet key pairs
const alice = keyring.addFromUri('INSERT_ALICES_PRIVATE_KEY');
const bob = 'INSERT_BOBS_ADDRESS';

// Form the transaction
const tx = await api.tx.balances.transferAllowDeath(bob, 12345n);

// Retrieve the encoded calldata of the transaction
const encodedCalldata = tx.method.toHex();
console.log(`Encoded calldata: ${encodedCallData}`);

// Sign and send the transaction
const txHash = await tx
  .signAndSend(alice);

// Show the transaction hash
console.log(`Submitted with hash ${txHash}`);
```

??? code "View the complete script"

    ```js
    --8<-- 'code/builders/substrate/libraries/polkadot-js-api/basic-transactions.js'
    ```

!!! note
    Prior to client v0.35.0, the extrinsic used to perform a simple balance transfer was the `balances.transfer` extrinsic. It has since been deprecated and replaced with the `balances.transferAllowDeath` extrinsic.

Note that the `signAndSend` function can also accept optional parameters, such as the `nonce`. For example, `signAndSend(alice, { nonce: aliceNonce })`. You can use the [sample code from the State Queries](/builders/substrate/libraries/polkadot-js-api/#state-queries){target=\_blank} section to retrieve the correct nonce, including transactions in the mempool.

### Fee Information {: #fees }

The transaction endpoint also offers a method to obtain weight information for a given `api.tx.<module>.<method>`. To do so, you'll need to use the `paymentInfo` function after having built the entire transaction with the specific `module` and `method`.

The `paymentInfo` function returns weight information in terms of `refTime` and `proofSize`, which can be used to determine the transaction fee. This is extremely helpful when crafting [remote execution calls via XCM](/builders/interoperability/xcm/remote-execution/){target=\_blank}.

For example, assuming you've [initialized the API](#creating-an-API-provider-instance), the following snippet shows how you can get the weight information for a simple balance transfer between two accounts:

```javascript
// Transaction to get weight information
const tx = api.tx.balances.transferAllowDeath('INSERT_BOBS_ADDRESS', BigInt(12345));

// Get weight info
const { partialFee, weight } = await tx.paymentInfo('INSERT_SENDERS_ADDRESS');

console.log(`Transaction weight: ${weight}`);
console.log(`Transaction fee: ${partialFee.toHuman()}`);
```

??? code "View the complete script"

    ```js
    --8<-- 'code/builders/substrate/libraries/polkadot-js-api/payment-info.js'
    ```

### Transaction Events {: #transaction-events }

Any transaction will emit events, as a bare minimum this will always be either a `system.ExtrinsicSuccess` or `system.ExtrinsicFailed` event for the specific transaction. These provide the overall execution result for the transaction, i.e. execution has succeeded or failed.

Depending on the transaction sent, some other events may however be emitted, for instance for a balance transfer event, this could include one or more `balance.Transfer` events.

The Transfer API page includes an [example code snippet](/learn/core-concepts/transfers-api/#monitor-all-balance-transfers-with-the-substrate-api){target=\_blank} for subscribing to new finalized block headers, and retrieving all `balance.Transfer` events.

### Batch Transactions {: #batching-transactions }

The Polkadot.js API allows transactions to be batch processed via the `api.tx.utility.batch` method. The batched transactions are processed sequentially from a single sender. The transaction fee can be estimated using the `paymentInfo` helper method.

For example, assuming you've [initialized the API](#creating-an-API-provider-instance), a [keyring instance](#creating-a-keyring-instance) and [added an account](#adding-accounts), the following example makes a couple of transfers and also uses the `api.tx.parachainStaking` module to schedule a request to decrease the bond of a specific collator candidate:

```javascript
// Construct a list of transactions to batch
const collator = 'INSERT_COLLATORS_ADDRESS';
const txs = [
  api.tx.balances.transferAllowDeath('INSERT_BOBS_ADDRESS', BigInt(12345)),
  api.tx.balances.transferAllowDeath('INSERT_CHARLEYS_ADDRESS', BigInt(12345)),
  api.tx.parachainStaking.scheduleDelegatorBondLess(collator, BigInt(12345)),
];

// Estimate the fees as RuntimeDispatchInfo, using the signer (either
// address or locked/unlocked keypair)
const info = await api.tx.utility.batch(txs).paymentInfo(alice);

console.log(`Estimated fees: ${info}`);

// Construct the batch and send the transactions
api.tx.utility.batch(txs).signAndSend(alice, ({ status }) => {
  if (status.isInBlock) {
    console.log(`included in ${status.asInBlock}`);

    // Disconnect API here!
  }
});
```

??? code "View the complete script"

    ```js
    --8<-- 'code/builders/substrate/libraries/polkadot-js-api/batch-transactions.js'
    ```

!!! note
    You can check out all of the available functions for the `parachainStaking` module by adding `console.log(api.tx.parachainStaking);` to your code.

## Substrate and Custom JSON-RPC Endpoints {: #substrate-and-custom-json-rpc-endpoints }

RPCs are exposed as a method on a specific module. This means that once available, you can call any RPC via `api.rpc.<module>.<method>(...params[])`. This also works for accessing Ethereum RPCs using the Polkadot.js API, in the form of `polkadotApi.rpc.eth.*`.

Some of the methods availabe through the Polkadot.js API interface are also available as JSON-RPC endpoints on Moonbeam nodes. This section will provide some examples; you can check for a list of exposed RPC endpoints by calling `api.rpc.rpc.methods()` or the `rpc_methods` endpoint listed below.

- **[`methods()`](https://polkadot.js.org/docs/substrate/rpc/#methods-rpcmethods){target=\_blank}**
    - **Interface** -  `api.rpc.rpc.methods`
    - **JSON-RPC** - `rpc_methods`
    - **Returns** - The list of RPC methods that are exposed by the node

    ```bash
      curl --location --request POST 'https://rpc.api.moonbase.moonbeam.network' \
      --header 'Content-Type: application/json' \
      --data-raw '{
        "jsonrpc":"2.0",
        "id":1,
        "method":"rpc_methods",
        "params": []
      }'
    ```

- **[`getBlock(hash?: BlockHash)`](https://polkadot.js.org/docs/substrate/rpc/#getblockhash-blockhash-signedblock){target=\_blank}**
    - **Interface** - `api.rpc.chain.getBlock`
    - **JSON-RPC** - `chain_getBlock`
    - **Returns** - The header and body of a block as specified by the block hash parameter

    ```bash
      curl --location --request POST 'https://rpc.api.moonbase.moonbeam.network' \
      --header 'Content-Type: application/json' \
      --data-raw '{
        "jsonrpc":"2.0",
        "id":1,
        "method":"chain_getBlock",
        "params": ["0x870ad0935a27ed8684048860ffb341d469e091abc2518ea109b4d26b8c88dd96"]
      }'
    ```

- **[`getFinalizedHead()`](https://polkadot.js.org/docs/substrate/rpc/#getfinalizedhead-blockhash){target=\_blank}**
    - **Interface** `api.rpc.chain.getFinalizedHead`
    - **JSON-RPC** `chain_getFinalizedHead`
    - **Returns** The block hash of the last finalized block in the canonical chain

    ```bash
      curl --location --request POST '{{ networks.moonbase.rpc_url }}' \
      --header 'Content-Type: application/json' \
      --data-raw '{
        "jsonrpc":"2.0",
        "id":1,
        "method":"chain_getHeader",
        "params": []
      }'
    ```

The [Consensus and Finality page](/learn/core-concepts/consensus-finality/){target=\_blank} has sample code for using the exposed custom and Substrate RPC calls to check the finality of a given transaction.

## Polkadot.js API Utility Functions {: #utilities }

The Polkadot.js API also includes a number of utility libraries for computing commonly used cryptographic primitives and hash functions.

The following example computes the deterministic transaction hash of a raw Ethereum legacy transaction by first computing its RLP ([Recursive Length Prefix](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/){target=\_blank}) encoding, then hashing the result with keccak256.

```javascript
import { encode } from '@polkadot/util-rlp';
import { keccakAsHex } from '@polkadot/util-crypto';
import { numberToHex } from '@polkadot/util';

// Define the raw signed transaction
const txData = {
  nonce: numberToHex(1),
  gasPrice: numberToHex(21000000000),
  gasLimit: numberToHex(21000),
  to: '0xc390cC49a32736a58733Cf46bE42f734dD4f53cb',
  value: numberToHex(1000000000000000000),
  data: '',
  v: '0507',
  r: '0x5ab2f48bdc6752191440ce62088b9e42f20215ee4305403579aa2e1eba615ce8',
  s: '0x3b172e53874422756d48b449438407e5478c985680d4aaa39d762fe0d1a11683',
};

// Extract the values to an array
var txDataArray = Object.keys(txData).map(function (key) {
  return txData[key];
});

// Calculate the RLP encoded transaction
var encoded_tx = encode(txDataArray);

// Hash the encoded transaction using keccak256
console.log(keccakAsHex(encoded_tx));
```

You can check the respective [NPM repository page](https://www.npmjs.com/package/@polkadot/util-crypto/v/0.32.19){target=\_blank} for a list of available methods in the `@polkadot/util-crypto` library and their descriptions.

--8<-- 'text/_disclaimers/third-party-content.md'
