---
title: Truffle
description: Learn how to configure Truffle to add a local Moonbeam development node and the Moonbase Alpha TestNet as networks for testing and deploying Solidity smart contracts.
---

# Truffle

![Intro diagram](/images/builders/tools/eth-dev-env/truffle-banner.png)

## Introduction {: #introduction } 

[Truffle](https://www.trufflesuite.com/truffle) is a popular development framework for compiling, testing, and deploying Solidity smart contracts. Since Moonbeam is Ethereum compatible, with a few lines of extra configuration, you can use Truffle as you normally would with Ethereum to develop on Moonbeam.

## Configure Truffle to Connect to Moonbeam {: #configure-truffle-to-connect-to-moonbeam } 

--8<-- 'text/common/endpoint-setup.md'

If you haven't yet, you'll want to globally install Truffle:

```
npm install -g truffle
```

In your `truffle-config.js` file, you'll need to add network configurations for any of the Moonbeam networks.
--8<-- 'text/common/endpoint-setup.md'

=== "Moonbeam"

    ```js
    const HDWalletProvider = require('@truffle/hdwallet-provider');

    module.exports = {
      networks: {
        moonbeam: {
          provider: () => {
            return new HDWalletProvider(
              "YOUR-PRIVATE-KEY-HERE", // Insert your private key 
              '{{ networks.moonbeam.rpc_url }}' // Insert your RPC URL
            );
          },
          network_id: {{ networks.moonbeam.chain_id }}, // {{ networks.moonbeam.hex_chain_id }} in hex
        }
      }
    }
    ```

=== "Moonriver"

    ```js
    const HDWalletProvider = require('@truffle/hdwallet-provider');

    module.exports = {
      networks: {
        moonriver: {
          provider: () => {
            return new HDWalletProvider(
              "YOUR-PRIVATE-KEY-HERE", // Insert your private key 
              '{{ networks.moonriver.rpc_url }}' // Insert your RPC URL
            );
          },
          network_id: {{ networks.moonriver.chain_id }}, // {{ networks.moonriver.hex_chain_id }} in hex
        }
      }
    }
    ```

=== "Moonbase Alpha"

    ```js
    const HDWalletProvider = require('@truffle/hdwallet-provider');

    module.exports = {
      networks: {
        moonbase: {
          provider: () => {
            return new HDWalletProvider(
              "YOUR-PRIVATE-KEY-HERE", // Insert your private key 
              '{{ networks.moonbase.rpc_url }}'
            );
          },
          network_id: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }} in hex
        }
      }
    }
    ```

=== "Moonbeam Dev Node"

    ```js
    const HDWalletProvider = require('@truffle/hdwallet-provider');

    module.exports = {
      networks: {
        dev: {
          provider: () => {
            return new HDWalletProvider(
              "99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342",
              '{{ networks.development.rpc_url }}'
            );
          },
          network_id: {{ networks.development.chain_id }}, // {{ networks.development.hex_chain_id }} in hex
        }
      }
    }
    ```

## Tutorial {: #tutorial } 

If you are interested in a more detailed step-by-step guide, go to our specific tutorial about [using Truffle](/builders/interact/truffle/) with Moonbeam.

--8<-- 'text/disclaimers/third-party-content.md'