---
title: Ethers.js
description: Follow this tutorial to learn how to use the Ethereum EtherJS Library to deploy Solidity smart contracts to Moonbeam.
---
# Ethers.js JavaScript Library

![Intro diagram](/images/integrations/integrations-ethersjs-banner.png)

## Introduction

The [ethers.js](https://docs.ethers.io/) library provides a set of tools to interact with Ethereum Nodes with JavaScript, similar to web3.js. Moonbeam has an Ethereum-like API available that is fully compatible with Ethereum-style JSON RPC invocations. Therefore, developers can leverage this compatibility and use the ethers.js library to interact with a Moonbeam node as if they were doing so on Ethereum. You can read more about ethers.js on this [blog post](https://medium.com/l4-media/announcing-ethers-js-a-web3-alternative-6f134fdd06f3).

## Setup Ethers.js with Moonbeam

To get started with the ethers.js library, install it using the following command:

```
npm install ethers
```

Once done, the simplest setup to start using the library and its methods is the following:

```js
const ethers = require('ethers');

// Variables definition
const privKey = '0xPRIVKEY';

// Define Provider
const provider = new ethers.providers.StaticJsonRpcProvider('RPC_URL', {
    chainId: ChainId,
    name: 'NETWORK_NAME'
});

// Create Wallet
let wallet = new ethers.Wallet(privKey, provider);
```

Different methods are available inside `provider` and `wallet`. Depending on which network you want to connect to, you can set the `RPC_URL` to the following values:

Moonbeam development node: 
 - RPC_URL: `http://127.0.0.1:9933`"
 - ChainId: `1281`
 - NETWORK_NAME: `moonbeam-development`
 
Moonbase Alpha TestNet: 
 - RPC_URL: `https://rpc.testnet.moonbeam.network`
 - ChainId: `1287`
 - NETWORK_NAME: `moonbase-alpha`

## Step-by-step Tutorials

If you are interested in a more detailed step-by-step guide, you can go to our specific tutorials on using ethers.js on Moonbeam to [send a transaction](/getting-started/local-node/send-transaction/) or [deploy a contract](/getting-started/local-node/deploy-contract/).
