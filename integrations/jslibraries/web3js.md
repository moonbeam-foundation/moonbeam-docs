---
title: Web3.js
description: Follow this tutorial to learn how to use the Ethereum Web3 JavaScript Library to deploy Solidity smart contracts to Moonbeam.
---
# Web3.js JavaScript Library

![Intro diagram](/images/integrations/integrations-web3js-0.png)

## Introduction

[Web3.js](https://web3js.readthedocs.io/en/v1.3.0/) is a set of libraries that allow developers to interact with Ethereum nodes using HTTP, IPC or WebSocket protocols. Moonbeam has an Ethereum-like API available that is fully compatible with Ethereum-style JSON RPC invocations. Therefore, developers can leverage this compatibility and use the web3.js library to interact with a Moonbeam node as if they were doing so on Ethereum.

## Setup Web3.js with Moonbeam

To get started with the web3.js library, we first need to install it using the following command:

```
npm install web3
```

Once done, the simplest setup to start using the library and its methods is the following:

```js
const Web3 = require('web3');

//Create web3 instance
const web3 = new Web3('RPC_URL');
```

Depending on which network you want to connect to, you can set the `RPC_URL` to the following values:

 - Moonbeam standalone node (default): `http://127.0.0.1:9933`
 - Moonbase Alpha TestNet: `https://rpc.testnet.moonbeam.network`

## Step-by-step Tutorials
In the case that you are interested in a more detailed step-by-step guide, you can go to our specific tutorials on using web3.js on a Moonbeam standalone node to [send a transaction](/getting-started/local-node/web3-js/web3-transaction/), or [deploy a contract](/getting-started/local-node/web3-js/web3-contract/). The steps can also be adapted to deploy on the Moonbase Alpha TestNet, by using the correct `RPC_URL` as mentioned before.

