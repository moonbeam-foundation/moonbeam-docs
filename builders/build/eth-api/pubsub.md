---
title: Subscribe to Ethereum-style Events on Moonbeam
description: Use Ethereum-like publish-subscribe functionality to subscribe to specific events on Moonbeam's Ethereum-compatible chain.
---

# Subscribe to Events

## Introduction {: #introduction }

Moonbeam supports events subscription for Ethereum-style events. This allows you to wait for events and handle them accordingly instead of polling for them.

It works by subscribing to particular events and for each subscription an id is returned. For each event that matches the subscription a notification with relevant data is sent together with the subscription id.

In this guide, you will learn how to subscribe to event logs, incoming pending transactions, and incoming block headers on Moonbase Alpha. This guide can also be adapted for Moonbeam or Moonriver.

## Checking Prerequisites {: #checking-prerequisites }

The examples in this guide are based on an Ubuntu 18.04 environment. You will also need the following:

 - Have MetaMask installed and [connected to Moonbase](/tokens/connect/metamask/){target=_blank}
 - Have an account with funds.
  --8<-- 'text/_common/faucet/faucet-list-item.md'
 - Deploy your own ERC-20 token on Moonbase. You can do following [our Remix tutorial](/builders/build/eth-api/dev-env/remix/){target=_blank}, while first pointing MetaMask to Moonbase

--8<-- 'text/_common/install-nodejs.md'

As of writing this guide, the versions used were 14.6.0 and 6.14.6, respectively. You will also need to install the Web3 package by executing:

```bash
npm install --save web3
```

To verify the installed version of Web3, you can use the `ls` command:

```bash
npm ls web3
```

As of writing this guide, the version used was 1.3.0.

## Subscribe to Event Logs {: #subscribing-to-event-logs-in-moonbase-alpha }

Any contract that follows the ERC-20 token standard emits an event related to a transfer of tokens, that is, `event Transfer(address indexed from, address indexed to, uint256 value)`. For this example, you will subscribe to the logs of such events. Using the Web3.js library, you need the following piece of code:

```js
const Web3 = require('web3');
const web3 = new Web3('wss://wss.api.moonbase.moonbeam.network');

web3.eth
  .subscribe(
    'logs',
    {
      address: 'INSERT_CONTRACT_ADDRESS',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      ],
    },
    (error, result) => {
      if (error) console.error(error);
    }
  )
  .on('connected', function (subscriptionId) {
    console.log(subscriptionId);
  })
  .on('data', function (log) {
    console.log(log);
  });
```

Note that you are connecting to the WebSocket endpoint of Moonbase Alpha. You're using the `web3.eth.subscribe(‘logs’,  options [, callback])` method to subscribe to the logs, filtered by the given options. In this case, the options are the contract’s address where the events are emitted from and the topics used to describe the event. More information about topics can be found in the [Understanding event logs on the Ethereum blockchain](https://medium.com/mycrypto/understanding-event-logs-on-the-ethereum-blockchain-f4ae7ba50378){target=_blank} Medium post. If no topics are included, you subscribe to all events emitted by the contract. In order to only filter the `Transfer` event, you need to include the signature of the event, calculated as:

```js
EventSignature = keccak256(Transfer(address,address,uint256))
```

The result of the calculation is shown in the previous code snippet. You'll return to filtering by topics later on. The rest of the code handles the callback function. Once you execute this code, you'll get a subscription ID, and the terminal will wait for any event through that subscription:

![Subscription ID](/images/builders/build/eth-api/pubsub/pubsub-1.png)

Next, an ERC-20 token transfer will be sent with the following parameters:

 - **From address** - `0x44236223aB4291b93EEd10E4B511B37a398DEE55`
 - **To address** - `0x8841701Dba3639B254D9CEe712E49D188A1e941e`
 - **Value (tokens)** - `1000000000000000000` - that is 1 with 18 zeros

Once you send the transaction, the log of the event emitted by the transaction will appear in the terminal:

![Log of the transfer event](/images/builders/build/eth-api/pubsub/pubsub-2.png)

The target event sends two pieces of indexed information: the `from` and `to` addresses (in that order), which are treated like topics. The other piece of data shared by the event is the number of tokens, which is not indexed. Therefore, there is a total of three topics (the maximum is four), which correspond to the opcode LOG3:

![Description of LOG3](/images/builders/build/eth-api/pubsub/pubsub-3.png)

Consequently, you can see that the `from` and `to` addresses are contained inside the topics returned by the logs. Ethereum addresses are 40 hex characters long (1 hex character is 4 bits, hence 160 bits or H160 format). Thus, the extra 24 zeros are needed to fill the gap to H256, which is 64 hex characters long.

Unindexed data is returned in the `data` field of the logs, but this is encoded in bytes32/hex. To decode it you can use, for example, this [Web3 Type Converter tool](https://web3-type-converter.onbrn.com/){target=_blank}, and verify that the `data` is in fact 1 (plus 18 zeros).

If the event returns multiple unindexed values, they will be appended one after the other in the same order the event emits them. Therefore, each value is then obtained by deconstructing data into separate 32 bytes (or 64 hex character long) pieces.

### Use Wildcards and Conditional Formatting {: #using-wildcards-and-conditional-formatting }

In the v2 release that introduced the subscribing to logs feature, there were some limitations regarding using wildcards and conditional formatting for the topics. Nevertheless, with the release of [Moonbase Alpha v3](https://moonbeam.network/announcements/moonbeam-network-upgrades-account-structure-to-match-ethereum/){target=_blank}, this is now possible.

Using the same example as in the previous section, lets subscribe to the events of the token contract with the following code:

```js
const Web3 = require('web3');
const web3 = new Web3('wss://wss.api.moonbase.moonbeam.network');

web3.eth
  .subscribe(
    'logs',
    {
      address: 'INSERT_CONTRACT_ADDRESS',
      topics: [
        null,
        [
          '0x00000000000000000000000044236223aB4291b93EEd10E4B511B37a398DEE55',
          '0x0000000000000000000000008841701Dba3639B254D9CEe712E49D188A1e941e',
        ],
      ],
    },
    (error, result) => {
      if (error) console.error(error);
    }
  )
  .on('connected', function (subscriptionId) {
    console.log(subscriptionId);
  })
  .on('data', function (log) {
    console.log(log);
  });
```

Here, by using the wildcard `null` in place for the event signature, you'll filter to listen to all events emitted by the contract that you subscribed to. But with this configuration, you can also use a second input field (`topic_1`) to define a filter by address as mentioned before. In the case of this subscription, you are notifying that you want to only receive events where `topic_1` is one of the addresses you are providing. Note that the addresses need to be in H256 format. For example, the address `0x44236223aB4291b93EEd10E4B511B37a398DEE55` needs to be entered as `0x00000000000000000000000044236223aB4291b93EEd10E4B511B37a398DEE55`. As before, the output of this subscription will display the event signature in `topic_0` to tell you which event was emitted by the contract.

![Conditional Subscription](/images/builders/build/eth-api/pubsub/pubsub-4.png)

As shown, after you provided the two addresses with conditional formatting, you should have received two logs with the same subscription ID. Events emitted by transactions from different addresses will not throw any logs to this subscription.

This example showed how you could subscribe to just the event logs of a specific contract, but the Web3.js library provides other subscription types that will be covered in the following sections.

## Subscribe to Incoming Pending Transactions {: #subscribe-to-incoming-pending-transactions }

In order to subscribe to pending transactions, you can use the `web3.eth.subscribe(‘pendingTransactions’, [, callback])` method, implementing the same callback function to check for the response. This is much simpler than the previous example, and it returns the transaction hash of the pending transactions.

![Subscribe pending transactions response](/images/builders/build/eth-api/pubsub/pubsub-5.png)

You can verify that this transaction hash is the same as that shown in MetaMask (or Remix).

## Subscribe to Incoming Block Headers {: #subscribe-to-incoming-block-headers }

Another type available under the Web3.js library is to subscribe to new block headers. To do so, you can use the `web3.eth.subscribe('newBlockHeaders' [, callback])` method, implementing the same callback function to check for the response. This subscription provides incoming block headers and can be used to track changes in the blockchain.

![Subscribe to block headers response](/images/builders/build/eth-api/pubsub/pubsub-6.png)

Note that only one block header is shown in the image. These messages are displayed for every block produced so they can fill up the terminal quite fast.

## Check if a Node is Synchronized with the Network {: #check-if-a-node-is-synchronized-with-the-network }

With pub/sub it is also possible to check whether a particular node you are subscribed to is currently synchronizing with the network. For that, we can leverage the [`web3.eth.subscribe(‘syncing' [, callback])`](https://web3js.readthedocs.io/en/v1.2.11/web3-eth-subscribe.html#subscribe-syncing){target=_blank} method, implementing the same callback function to check for the response. This subscription will either return a boolean when `syncing` is false, or an object describing the syncing progress when `syncing` is true, as seen below.

![Subscribe to syncing response](/images/builders/build/eth-api/pubsub/pubsub-7.png)

!!! note
    The pub/sub implementation in [Frontier](https://github.com/paritytech/frontier){target=_blank} is still in active development. This current version allows users to subscribe to specific event types, but there may still be some limitations.
