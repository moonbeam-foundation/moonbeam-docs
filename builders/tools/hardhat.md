---
title: Hardhat
description: Learn how to configure Hardhat to add a local Moonbeam development node and the Moonbase Alpha TestNet as networks for testing and deploying Solidity smart contracts.
---

# Hardhat

![Hardhat Create Project](/images/builders/interact/hardhat/hardhat-banner.png)

## Introduction {: #introduction } 

[Hardhat](https://hardhat.org/) is a popular development framework for compiling, testing, and deploying Solidity smart contracts. Since Moonbeam is Ethereum compatible, with a few lines of extra configuration, you can use Hardhat as you normally would to develop on Moonbeam.

## Configure Hardhat to Connect to Moonbeam {: #configure-hardhat-to-connect-to-moonbeam } 

To get started with Hardhat you must have an npm project. If you do not yet have one, to create one you can run:

```
npm init
```

Once you have a npm project, install Hardhat:

```
npm install hardhat
```

Then to create a Hardhat config file in your project, run:

```
npx hardhat
```

In your `hardhat.config.js` file, add network configurations for a Moonbeam development node and the Moonbase Alpha TestNet:

```javascript
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
        url: '{{ networks.development.rpc_url }}',
        chainId: {{ networks.development.chain_id }},  // {{ networks.development.hex_chain_id }} in hex,
        accounts: [privateKeyDev]
      },
      // Moonbase Alpha TestNet
      moonbase: {
        url: `{{ networks.moonbase.rpc_url }}`,
        chainId: {{ networks.moonbase.chain_id }},  // {{ networks.moonbase.hex_chain_id }} in hex,
        accounts: [privateKeyMoonbase]
      },
      // Moonriver
      moonbase: {
        url: `{{ networks.moonriver.rpc_url }}`,
        chainId: {{ networks.moonriver.chain_id }},  // {{ networks.moonriver.hex_chain_id }} in hex,
        accounts: [privateKeyMoonriver]
      },
   },
};
```

## Tutorial {: #tutorial } 

If you are interested in a more detailed step-by-step guide, check out our specific tutorial about using [Hardhat](/builders/interact/hardhat/) with Moonbeam.