---
title: Subscribe to Events
description: Subscribe to specific events in the blockchain
---

# Subscribe to events in Moonbase Alpha

## Introduction

With the [release of Moonbase Alpha v2](TODO LINK), the capability to subscribe to Ethereum style specific event was added. In this guide, we will outline the subscription types available and the current limitations.

## Checking Prerequisites

The examples in this guide are based on a Ubuntu 18.04 environment. Also, you will need the following:

-  Have MetaMask installed and [connected to Moonbase](/getting-started/testnet/metamask)
-  Have an account with funds, which you can get from [Mission Control](/getting-started/testnet/faucet)
-  Deploy your own ERC20 token on Moonbase, which you can do following [our Remix tutorial](/getting-started/local-node/using-remix) but first pointing MetaMask to Moonbase

In addition, we need to install Node.js (we'll go for v14.x) and the npm package manager. You can do this by running in your terminal:

```
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
```
```
sudo apt install -y nodejs
```

We can verify that everything installed correctly by querying the version for each package:

```
node -v
```
```
npm -v
```

As of the writing of this guide, versions used were 14.6.0 and 6.14.6, respectively. Also, we need to install the Web3 package by executing:

```
npm install --save web3
```

To verify the installed version of Web3, you can use the `ls` command:

```
npm ls web3
```

As of the writing of this guide, the version used was 1.3.0. 

## Subscribing to Event Logs in Moonbase Alpha v2

Any contract that follows the ERC20 token standard emits an event related to a transfer of tokens, that is, `event Transfer(address indexed from, address indexed to, uint256 value)`. For this example, we will subscribe to the logs of such events. Using the Web3 JS library, we need the following piece of code:

```js
const Web3 = require('web3');
const web3 = new Web3('wss://wss.testnet.moonbeam.network');

web3.eth.subscribe('logs', {
    address: 'ContractAddress',
    topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef']
}, (error, result) => {
    if (error)
        console.error(error);
})
    .on("connected", function (subscriptionId) {
        console.log(subscriptionId);
    })
    .on("data", function (log) {
        console.log(log);
    });
```

Note that we are connecting to the WebSocket endpoint of Moonbase Alpha. We use the `web3.eth.subscribe(‘logs’,  options [, callback])` method to subscribe to the logs, filtered by the given options. In our case, the options are the contract’s address where the events are emitted from, and the topics used to describe the event. More information about topics can be found in [this Medium post](https://medium.com/mycrypto/understanding-event-logs-on-the-ethereum-blockchain-f4ae7ba50378). If no topics are included, you subscribe to all events emitted by the contract. But in order to filter only the Transfer event, we need to include the signature of the event, calculated as:

```js
EventSignature = keccak256(Transfer(address,address,uint256))
```

The result of the previous calculation is what's shown in the code snippet from before. We’ll go back to filtering by topics later on. The rest of the code handles the callback function. Once we execute this code, we’ll get a subscription ID, and the terminal will wait for any event through that subscription:

![Subscription ID](/images/testnet/testnet-pubsub1.png)

Next, an ERC20 token transfer will be sent with the following parameters:

-  From address: 0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b
-  To address: 0xfcB0B397BB28046C01be6A3d66c7Eda99Fb0f344
-  Value (tokens): 10000000000000000000 - that is 10 with 18 zeros

Once we send the transaction, the log of the event emitted by the transaction will appear in the terminal:

![Log of the transfer event](/images/testnet/testnet-pubsub2.png)

Lets break down the response received. Our target event sends two pieces of indexed information, the “from” and “to” addresses (in that order), which are treated like topics. The other piece of data shared by our event is the number of tokens, that is not indexed. Therefore, there is a total of three topics (the maximum is four), which correspond to the opcode LOG3:

![Description of LOG3](/images/testnet/testnet-pubsub3.png)

Consequently, you can see that the “from” and “to” addresses are contained inside the topics returned by the logs. Ethereum addresses are 40 hex characters long (1 hex character is 4 bits, hence 160 bits or H160 format). Thus, the extra 24 zeros are needed to fill the gap to H256, which are 64 hex characters long. 

Unindexed data is returned in the “data” field of the logs, but this is encoded in bytes32/hex. To decode it we can use for example this [online tool](https://web3-type-converter.brn.sh/), and verify that the “data” is in fact 10 (plus 18 zeros). 

If the event returns multiple unindexed values, these will be appended one after the other in the same order the event emmits them. Therefore, each value is then obtained by deconstructing data into separate 32 bytes (or 64 hex character long) pieces.

This example showed how we could subscribe only to event logs of a specific contract. But the Web3 JS library provides other subscription types that we’ll go over in the following sections.

## Subscribe to Incoming Pending Transactions

In order to subscribe to pending transactions, we can use the `web3.eth.subscribe(‘pendingTransactions’, [, callback])` method, implementing the same callback function to check for the response. This is much simpler than our previous example, and it returns the transaction hash of the pending transactions.

![Subscribe pending transactions response](/images/testnet/testnet-pubsub4.png)

We can verify that this transaction hash is the same as that shown in MetaMask (or Remix).

## Subscribe to Incoming Block Headers

Another type available under the Web3 JS library is to subscribe to new block headers. To do so, we use the `web3.eth.subscribe('newBlockHeaders' [, callback])` method, implementing the same callback function to check for the response. This subscription provides incoming block headers and can be used to track changes in the blockchain.

![Subscribe to block headers response](/images/testnet/testnet-pubsub5.png)

Note that in the image only one block header is shown. These messages are displayed for every block produced, so they can fill up the terminal quite fast.

## Check if the Node is Synchronized with the Network

With pub/sub it is also possible to check whether a particular node, which you are subscribed to, is currently synchronized with the network. For that, we can leverage the `web3.eth.subscribe(‘syncing' [, callback])` method, implementing the same callback function to check for the response. This subscription will return an object when the node is synced with the network.

![Subscribe to syncing response](/images/testnet/testnet-pubsub6.png)

## Current Limitations

The pub/sub implementation in [Frontier](https://github.com/paritytech/frontier) is still in active development. This first version allows dApp developers (or users in general) to subscribe to specific event types, but there are still some limitations. From the previous examples, you might have noticed that some of the fields are not showing proper information, and that is because certain properties are yet to be supported by Frontier.

Another limitation is related to the logs of the event. On Ethereum, you can use wildcards and pass in multiple input addresses, for example, to filter specific logs. Let's say we would like to subscribe to all events of a contract that have two specific addresses in the “topic_1” field (remember that “topic_0” is reserved to the event signature). Then we could pass in the following topic as input:

```js
topics: [null, [address1, address2]]
```

Here, by using the wildcard null in place for the event signature, we are listening to all events emitted by the contract that we subscribed to. But with this configuration, we can also use a second input field, that is "topic_1", to define a filter by address as mentioned before.

The current Frontier implementation does not support these features. As an alternative, you can create multiple subscriptions for all the events of the contract and the different addresses, but this increases the number of operations to be carried out. However, this is expected to be supported in future versions of the Moonbase TestNet.

## We Want to Hear From You

If you have any feedback regarding the Moonbase Alpha v2, pub/sub, or any other Moonbeam related topic, feel free to reach out through our official development [Discord channel](https://discord.gg/PfpUATX).



