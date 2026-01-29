---
title: Subscribe to Ethereum-style Events on Moonbeam
description: Take a look at the non-standard Ethereum JSON-RPC methods supported on Moonbeam that offer publish-subscribe functionality for specific events.
categories: JSON-RPC APIs, Ethereum Toolkit
---

# Subscribe to Events

## Introduction {: #introduction }

Moonbeam supports event subscriptions for Ethereum-style events, which allows you to wait for events and handle them accordingly instead of polling for them.

It works by subscribing to particular events; an ID is returned for each subscription. For each event that matches the subscription, a notification with relevant data is sent together with the subscription ID.

In this guide, you will learn how to subscribe to event logs, incoming pending transactions, and incoming block headers on Moonbase Alpha. This guide can also be adapted for Moonbeam or Moonriver.

## Supported Pubsub JSON-RPC Methods {: #filter-rpc-methods }

Please note that the examples in this section require installing [wscat](https://github.com/websockets/wscat){target=\_blank}.

???+ function "eth_subscribe"

    Creates a subscription for a given subscription name.

    === "Parameters"

        - `subscription_name` *string* - the type of the event to subscribe to. The [supported subscription](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#create-subscriptions#supported-subscriptions){target=\_blank} types are:
            - [`newHeads`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#newheads){target=\_blank} — triggers a notification each time a new header is appended to the chain
            - [`logs`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#logs){target=\_blank} — returns logs that are included in new imported blocks and match a given filter criteria
            - [`newPendingTransactions`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#newpendingtransactions){target=\_blank} — returns the hash for all transactions that are added to the pending state
            - [`syncing`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#syncing){target=\_blank} — indicates when the node starts or stops synchronizing with the network

    === "Returns"

        The `result` returns the subscription ID.

    === "Example"

        ```bash
        --8<-- 'code/builders/ethereum/json-rpc/pubsub/1.sh'
        ```

???+ function "eth_unsubscribe"

    Cancels an existing subscription given its subscription ID.

    === "Parameters"

        - `subscription_id` *string* - the subscription ID
  
    === "Returns"

        The `result` returns a boolean indicating whether or not the subscription was successfully canceled.

    === "Example"

        ```bash
        --8<-- 'code/builders/ethereum/json-rpc/pubsub/2.sh'
        ```

## Subscribe to Events Using Ethereum Libraries {: #subscribe-to-events }

This section will show you how to use [Ethereum libraries](/builders/ethereum/libraries/){target=\_blank}, like [Ethers.js](/builders/ethereum/libraries/ethersjs/){target=\_blank}, to programmatically subscribe to events on Moonbeam.

### Checking Prerequisites {: #checking-prerequisites }

The examples in this guide are based on an Ubuntu 22.04 environment. You will also need the following:

- MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
- An account with funds.
  --8<-- 'text/_common/faucet/faucet-list-item.md'
- To deploy your own ERC-20 token on Moonbase Alpha. You can do this by following [our Remix tutorial](/builders/ethereum/dev-env/remix/){target=\_blank} while first pointing MetaMask to Moonbase Alpha
- Ethers.js or the Ethereum library of your choice installed. You can install Ethers.js via npm:

    ```bash
    --8<-- 'code/builders/ethereum/json-rpc/pubsub/3.sh'
    ```

### Subscribe to Event Logs {: #subscribing-to-event-logs-in-moonbase-alpha }

Any contract that follows the ERC-20 token standard emits an event related to a token transfer, that is, `event Transfer(address indexed from, address indexed to, uint256 value)`. In this section, you'll learn how to subscribe to these events using the Ethers.js library.

Use the following code snippet to set up a subscription to listen for token transfer events:

```js
--8<-- 'code/builders/ethereum/json-rpc/pubsub/subscribe-to-event-logs.js'
```

!!! note
    Make sure to replace `'INSERT_CONTRACT_ADDRESS'` with the actual address of the ERC-20 token contract that you should have already deployed (as a [prerequisite](#checking-prerequisites)).

In the provided code:

- A WebSocket provider is used to listen for the `Transfer` event and parse the log with the contract ABI
- The listener filters for the `Transfer` event by signature, which can be calculated as follows:

    ```js
    --8<-- 'code/builders/ethereum/json-rpc/pubsub/4.js'
    ```

    This translates to `0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef` and is used as the first topic in the subscription filter.

If you do not provide any topics, you subscribe to all events emitted by the contract. More information about topics can be found in the [Understanding event logs on the Ethereum blockchain](https://medium.com/mycrypto/understanding-event-logs-on-the-ethereum-blockchain-f4ae7ba50378){target=\_blank} Medium post.

By executing this code, you'll establish a subscription to monitor ERC-20 token transfer events on Moonbeam. New events will be logged to the terminal as they occur.

--8<-- 'code/builders/ethereum/json-rpc/pubsub/terminal/contract-events.md'

#### Understanding Event Logs {: #understanding-event-logs }

To illustrate the process, assume that an ERC-20 token transfer has been sent with the following parameters:

 - **From address** - `0x44236223aB4291b93EEd10E4B511B37a398DEE55`
 - **To address** - `0x8841701Dba3639B254D9CEe712E49D188A1e941e`
 - **Value (tokens)** - `1000000000000000000` (1 DEV in Wei)

The event logs emitted by the transaction are as follows:

--8<-- 'code/builders/ethereum/json-rpc/pubsub/terminal/log-transfer-event.md'

If you look at the `topics` array, there are a total of three topics present (in this order):

1. The event signature of the `Transfer` event
2. The `from` address
3. The `to` address

As there are a total of three topics (the maximum is four), this corresponds to the LOG3 opcode:

![Description of LOG3](/images/builders/ethereum/json-rpc/pubsub/pubsub-1.webp)

Indexed topics, such as the `from` and `to` addresses, are typically represented by 256-bit (64 hexadecimal character) values. If necessary, they are padded with zeros to reach the full length.

Unindexed data, such as the value of tokens transferred, is not included in the `topics` array. Instead, it is returned within the logs' `data` field, encoded in bytes32/hex format. To decode it, you can use, for example, this [Web3 Type Converter tool](https://web3-type-converter.onbrn.com){target=\_blank} and verify that the `data` is 1 DEV token formatted in Wei.

If the event returns multiple unindexed values, they will be appended one after the other in the same order the event emits them. Therefore, each value is obtained by deconstructing data into separate 32-byte (or 64-hex-character-long) pieces.

#### Use Wildcards and Conditional Formatting {: #using-wildcards-and-conditional-formatting }

Using the same example as in the previous section, you can subscribe to Transfer events while filtering by specific senders with the following code:

```js
--8<-- 'code/builders/ethereum/json-rpc/pubsub/use-wildcards.js'
```

Here, the first indexed parameter (`from`) is filtered to the provided address list, while `to` is set to `null` to act as a wildcard. The contract filter handles topic formatting for you, so you don't need to manually pad the addresses.

--8<-- 'code/builders/ethereum/json-rpc/pubsub/terminal/conditional-subscription.md'

As shown, after you provided the two addresses with conditional formatting, you should have received two logs with the same subscription. Events emitted by transactions from different addresses will not throw any logs to this subscription.

This example showed how you could subscribe to just the event logs of a specific contract, but the same approach applies to other subscription types covered in the following sections.

### Subscribe to Incoming Pending Transactions {: #subscribe-to-incoming-pending-transactions }

To subscribe to pending transactions with Ethers.js, you can use a WebSocket provider and the `provider.on('pending')` event. The transaction hash of the pending transactions is returned, and you can optionally fetch full transaction details with `provider.getTransaction(hash)`.

--8<-- 'code/builders/ethereum/json-rpc/pubsub/terminal/pending-txn.md'

You can try this by sending a transaction and verifying that the transaction hash returned by the subscription is the same one returned by the development tool or wallet you are using.

### Subscribe to Incoming Block Headers {: #subscribe-to-incoming-block-headers }

You can also subscribe to new block headers using `provider.on('block')`, then fetch the block with `provider.getBlock(blockNumber)`. This subscription provides incoming block headers and can be used to track changes in the blockchain.

--8<-- 'code/builders/ethereum/json-rpc/pubsub/terminal/block-headers.md'

Note that only one block header is shown in the image. These messages are displayed for every block produced so they can quickly fill up the terminal.

### Check If a Node Is Synchronized with the Network {: #check-if-a-node-is-synchronized-with-the-network }

With pubsub, checking whether a particular node is currently synchronizing with the network is also possible. You can call the `eth_subscribe` RPC with `syncing` using your preferred library's low-level WebSocket request helper. This subscription will either return a boolean when `syncing` is false or an object describing the syncing progress when `syncing` is true, as seen below.

--8<-- 'code/builders/ethereum/json-rpc/pubsub/terminal/syncing.md'

!!! note
    The pubsub implementation in [Frontier](https://github.com/polkadot-evm/frontier){target=\_blank} is still in active development. This current version allows users to subscribe to specific event types, but there may still be some limitations.
