---
title: Ethers.js
description: Use the Ethereum EtherJS Library to deploy contracts into Moonbeam
---
# Ethers.js JavaScript Library

![Intro diagram](/images/integrations/integrations-ethersjs-0.png)

## Introduction
The [ethers.js](https://docs.ethers.io/) library provide a set of tools to interact with Ethereum Nodes, similar to web3.js. Moonbeam has an Ethereum-like API available that is fully compatible with Ethereum-style JSON RPC invocations. Therefore, developers can leverage this compatibility and use the ethers.js library to interact with a Moonbeam node as if they were doing so on Ethereum. You can read more about ethers.js on this [blogpost](https://medium.com/l4-media/announcing-ethers-js-a-web3-alternative-6f134fdd06f3).

## Setup Ethers.js with Moonbeam
To get started with the ethers.js library, we first need to install it using the following command:

```
npm install ethers
```

Once done, the simplest setup to start using the library and its methods is the following:

```js
const ethers = require('ethers');

// Variables definition
const privKey = '0xPRIVKEY';

// Define Provider
let provider = new ethers.providers.JsonRpcProvider(RPC_URL);

// Create Wallet
let wallet = new ethers.Wallet(privKey, provider);
```
Different methods are available inside `provider` and `wallet`. Depending on which network you want to connect to, you can set the `RPC_URL` to the following values:

 - Moonbeam standalone node (default): `http://127.0.0.1:9933`
 - Moonbase Alpha TestNet: `https://rpc.testnet.moonbeam.network`

## Step-by-step Tutorials

In the case that you are interested in a more detailed step-by-step guide, you can go to our specific tutorials on using ethers.js on a Moonbeam standalone node to [send a transaction](/getting-started/local-node/ethers-js/ethers-transaction/), or [deploy a contract](/getting-started/local-node/ethers-js/ethers-contract/). The steps can also be adapted to deploy on the Moonbase Alpha TestNet, by using the correct `RPC_URL` as mentioned before.