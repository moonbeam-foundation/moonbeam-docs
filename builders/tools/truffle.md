---
title: Truffle
description: Learn how to configure Truffle to add a local Moonbeam development node and the Moonbase Alpha TestNet as networks for testing and deploying Solidity smart contracts.
---

# Truffle

![Intro diagram](/images/integrations/integrations-truffle-banner.png)

## Introduction

[Truffle](https://www.trufflesuite.com/truffle) is a popular development framework for compiling, testing, and deploying Solidity smart contracts. Since Moonbeam is Ethereum compatible, with a few lines of extra configuration, you can use Truffle as you normally would with Ethereum to develop on Moonbeam.

## Configure Truffle to Connect to Moonbeam

If you haven't yet, you'll want to globally install Truffle:

```
npm install -g truffle
```

In your `truffle-config.js` file, add network configurations for a Moonbeam development node and the Moonbase Alpha TestNet:

```javascript
const HDWalletProvider = require('@truffle/hdwallet-provider');
// Moonbeam Development Node Private Key
const privateKeyDev =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';
// Moonbase Alpha Private Key
const privateKeyMoonbase = "YOUR-PRIVATE-KEY-HERE";
// Moonriver Private Key - Note: This is for example purposes only. Never store your private keys in a JavaScript file.
const privateKeyMoonriver = "YOUR-PRIVATE-KEY-HERE";

module.exports = {
   networks: {
      // Moonbeam Development Node
      dev: {
        provider: () => {
          return new HDWalletProvider(privateKeyDev, 'http://localhost:9933/')
         },
        network_id: 1281,
      },
      // Moonbase Alpha TestNet
      moonbase: {
        provider: () => {
          return new HDWalletProvider(
            privateKeyMoonbase,
            'https://rpc.testnet.moonbeam.network'
          );
        },
        network_id: 1287,
      },
      // Moonriver
      moonriver: {
        provider: () => {
          return new HDWalletProvider(
            privateKeyMoonriver,
            'https://rpc.moonriver.moonbeam.network'
          );
        },
        network_id: 1285,
      }
   },
};
```


## Tutorial

If you are interested in a more detailed step-by-step guide, go to our specific tutorial about [using Truffle](/builders/interact/truffle/) with Moonbeam.