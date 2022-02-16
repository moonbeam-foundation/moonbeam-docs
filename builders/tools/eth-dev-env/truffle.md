---
title: Truffle
description: Learn how to configure Truffle to add a local Moonbeam development node and the Moonbase Alpha TestNet as networks for testing and deploying Solidity smart contracts.
---

# Truffle

![Intro diagram](/images/builders/tools/eth-dev-env/truffle-banner.png)

## Introduction {: #introduction } 

[Truffle](https://www.trufflesuite.com/truffle) is a popular development framework for compiling, testing, and deploying Solidity smart contracts. Since Moonbeam is Ethereum compatible, with a few lines of extra configuration, you can use Truffle as you normally would with Ethereum to develop on Moonbeam.

## Configure Truffle to Connect to Moonbeam {: #configure-truffle-to-connect-to-moonbeam } 

If you haven't yet, you'll want to globally install Truffle:

```
npm install -g truffle
```

In your `truffle-config.js` file, add network configurations for a Moonbeam development node and the Moonbase Alpha TestNet:

```javascript
const HDWalletProvider = require('@truffle/hdwallet-provider');
// Moonbeam Private Key - Note: This is for example purposes only. Never store your private keys in a JavaScript file.
const privateKeyMoonbeam = "YOUR-PRIVATE-KEY-HERE";
// Moonriver Private Key - Note: This is for example purposes only. Never store your private keys in a JavaScript file.
const privateKeyMoonriver = "YOUR-PRIVATE-KEY-HERE";
// Moonbase Alpha Private Key
const privateKeyMoonbase = "YOUR-PRIVATE-KEY-HERE";
// Moonbeam Development Node Private Key
const privateKeyDev = '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';

module.exports = {
   networks: {
      // Moonbeam
      moonbeam: {
        provider: () => {
          return new HDWalletProvider(
            privateKeyMoonbeam,
            '{{ networks.moonbeam.rpc_url }}'
          );
        },
        network_id: {{ networks.moonbeam.chain_id }}, // {{ networks.moonbeam.hex_chain_id }} in hex,
      }
      // Moonriver
      moonriver: {
        provider: () => {
          return new HDWalletProvider(
            privateKeyMoonriver,
            '{{ networks.moonriver.rpc_url }}'
          );
        },
        network_id: {{ networks.moonriver.chain_id }}, // {{ networks.moonriver.hex_chain_id }} in hex,
      }
      // Moonbase Alpha TestNet
      moonbase: {
        provider: () => {
          return new HDWalletProvider(
            privateKeyMoonbase,
            '{{ networks.moonbase.rpc_url }}'
          );
        },
        network_id: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }} in hex,
      },
      // Moonbeam Development Node
      dev: {
        provider: () => {
          return new HDWalletProvider(privateKeyDev, '{{ networks.development.rpc_url }}')
         },
        network_id: {{ networks.development.chain_id }}, // {{ networks.development.hex_chain_id }} in hex,
      },
   },
};
```

## Tutorial {: #tutorial } 

If you are interested in a more detailed step-by-step guide, go to our specific tutorial about [using Truffle](/builders/interact/truffle/) with Moonbeam.

--8<-- 'text/disclaimers/third-party-content.md'