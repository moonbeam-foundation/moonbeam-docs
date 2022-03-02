---
title: Ethers.js
description: Follow this tutorial to learn how to use the Ethereum EtherJS Library to deploy Solidity smart contracts to Moonbeam.
---
# Ethers.js JavaScript Library

![Intro diagram](/images/builders/tools/eth-libraries/ethersjs-banner.png)

## Introduction {: #introduction } 

The [ethers.js](https://docs.ethers.io/) library provides a set of tools to interact with Ethereum Nodes with JavaScript, similar to web3.js. Moonbeam has an Ethereum-like API available that is fully compatible with Ethereum-style JSON RPC invocations. Therefore, developers can leverage this compatibility and use the ethers.js library to interact with a Moonbeam node as if they were doing so on Ethereum. You can read more about ethers.js on this [blog post](https://medium.com/l4-media/announcing-ethers-js-a-web3-alternative-6f134fdd06f3).

## Setup Ethers.js with Moonbeam {: #setup-ethersjs-with-moonbeam } 

To get started with the ethers.js library, install it using the following command:

```
npm install ethers
```

You can configure ethers.js to work with any of the Moonbeam networks.
--8<-- 'text/common/endpoint-setup.md'

The simplest way to get started with each of the networks is as follows:

=== "Moonbeam"

    ```js
    const ethers = require('ethers');

    // Variables definition
    const privKey = '0xPRIVKEY'; // For demo purposes only. Never store your private key in a JavaScript file

    // Define Provider
    const provider = new ethers.providers.StaticJsonRpcProvider(
      '{{ networks.moonbeam.rpc_url }}', // Insert your RPC URL here
      {
        chainId: "{{ networks.moonbeam.chain_id }}", // {{ networks.moonbeam.hex_chain_id }} in hex
        name: 'moonbeam'
      }
    );

    // Create Wallet
    let wallet = new ethers.Wallet(privKey, provider);
    ```

=== "Moonriver"

    ```js
    const ethers = require('ethers');

    // Variables definition
    const privKey = '0xPRIVKEY'; // For demo purposes only. Never store your private key in a JavaScript file

    // Define Provider
    const provider = new ethers.providers.StaticJsonRpcProvider(
      '{{ networks.moonriver.rpc_url }}', // Insert your RPC URL here
      {
        chainId: "{{ networks.moonriver.chain_id }}", // {{ networks.moonriver.hex_chain_id }} in hex
        name: 'moonriver'
      }
    );

    // Create Wallet
    let wallet = new ethers.Wallet(privKey, provider);
    ```

=== "Moonbase Alpha"

    ```js
    const ethers = require('ethers');

    // Variables definition
    const privKey = '0xPRIVKEY';

    // Define Provider
    const provider = new ethers.providers.StaticJsonRpcProvider(
      '{{ networks.moonbase.rpc_url }}',
      {
        chainId: "{{ networks.moonbase.chain_id }}", // {{ networks.moonbase.hex_chain_id }} in hex
        name: 'moonbase'
      }
    );

    // Create Wallet
    let wallet = new ethers.Wallet(privKey, provider);
    ```

=== "Moonbeam Dev Node"

    ```js
    const ethers = require('ethers');

    // Variables definition
    const privKey = '0xPRIVKEY';

    // Define Provider
    const provider = new ethers.providers.StaticJsonRpcProvider(
      '{{ networks.development.rpc_url }}',
      {
        chainId: "{{ networks.development.chain_id }}", // {{ networks.development.hex_chain_id }} in hex
        name: 'moonbeam-development'
      }
    );

    // Create Wallet
    let wallet = new ethers.Wallet(privKey, provider);
    ```

Different methods are available inside `provider` and `wallet`. 

## Tutorials {: #tutorials } 

If you are interested in a more detailed step-by-step guide, you can go to our specific tutorials on using ethers.js on Moonbeam to [send a transaction](/builders/interact/eth-libraries/send-transaction/) or [deploy a contract](/builders/interact/eth-libraries/deploy-contract/).

--8<-- 'text/disclaimers/third-party-content.md'