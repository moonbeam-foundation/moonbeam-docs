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

In your `hardhat.config.js` file, you'll need to add network configurations for any of the Moonbeam networks.
--8<-- 'text/common/endpoint-setup.md'

=== "Moonbeam"

    ```js
      module.exports = {
        networks: {
          moonbeam: {
            url: '{{ networks.moonbeam.rpc_url }}', // Insert your RPC URL here
            chainId: {{ networks.moonbeam.chain_id }},  // {{ networks.moonbeam.hex_chain_id }} in hex,
            accounts: ["YOUR-PRIVATE-KEY-HERE"],
          },
        }
      }
    ```

=== "Moonriver"

    ```js
      module.exports = {
        networks: {
          moonriver: {
            url: '{{ networks.moonriver.rpc_url }}', // Insert your RPC URL here
            chainId: {{ networks.moonriver.chain_id }},  // {{ networks.moonriver.hex_chain_id }} in hex,
            accounts: ["YOUR-PRIVATE-KEY-HERE"],
          },
        }
      }
    ```

=== "Moonbase Alpha"

    ```js
      module.exports = {
        networks: {
          moonbase: {
            url: '{{ networks.moonbase.rpc_url }}',
            chainId: {{ networks.moonbase.chain_id }},  // {{ networks.moonbase.hex_chain_id }} in hex,
            accounts: ["YOUR-PRIVATE-KEY-HERE"],
          },
        }
      }
    ```

=== "Moonbeam Dev Node"

    ```js
      module.exports = {
        networks: {
          dev: {
            url: '{{ networks.development.rpc_url }}',
            chainId: {{ networks.development.chain_id }},  // {{ networks.development.hex_chain_id }} in hex,
            accounts: ["99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342"],
          },
        }
      }
    ```

## Tutorial {: #tutorial } 

If you are interested in a more detailed step-by-step guide, check out our specific tutorial about using [Hardhat](/builders/interact/hardhat/) with Moonbeam.

--8<-- 'text/disclaimers/third-party-content.md'