---
title: Web3.js
description: Follow this tutorial to learn how to use the Ethereum Web3 JavaScript Library to deploy Solidity smart contracts to Moonbeam.
---
# Web3.js JavaScript Library

![Intro diagram](/images/builders/tools/eth-libraries/web3js-banner.png)

## Introduction {: #introduction } 

[Web3.js](https://web3js.readthedocs.io/) is a set of libraries that allow developers to interact with Ethereum nodes using HTTP, IPC, or WebSocket protocols with JavaScript. Moonbeam has an Ethereum-like API available that is fully compatible with Ethereum-style JSON RPC invocations. Therefore, developers can leverage this compatibility and use the web3.js library to interact with a Moonbeam node as if they were doing so on Ethereum.

## Setup Web3.js with Moonbeam {: #setup-web3js-with-moonbeam } 

To get started with the web3.js library, we first need to install it using the following command:

```
npm install web3
```

You can configure ethers.js to work with any of the Moonbeam networks.
--8<-- 'text/common/endpoint-setup.md'

The simplest way to get started with each of the networks is as follows:

=== "Moonbeam"

    ```js
    const Web3 = require('web3');

    //Create web3 instance
    const web3 = new Web3('{{ networks.moonbeam.rpc_url }}'); // Insert your RPC URL here
    ```

=== "Moonriver"

    ```js
    const Web3 = require('web3');

    //Create web3 instance
    const web3 = new Web3('{{ networks.moonriver.rpc_url }}'); // Insert your RPC URL here
    ```

=== "Moonbase Alpha"

    ```js
    const Web3 = require('web3');

    //Create web3 instance
    const web3 = new Web3('{{ networks.moonbase.rpc_url }}');
    ```

=== "Moonbeam Dev Node"

    ```js
    const Web3 = require('web3');

    //Create web3 instance
    const web3 = new Web3('{{ networks.development.rpc_url }}');
    ```

## Tutorials {: #tutorials } 

If you are interested in a more detailed step-by-step guide, go to our specific tutorials about using web3.js on Moonbeam to [send a transaction](/builders/interact/eth-libraries/send-transaction/) or [deploy a contract](/builders/interact/eth-libraries/deploy-contract/).

--8<-- 'text/disclaimers/third-party-content.md'