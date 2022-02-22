---
title: Ethers.js
description: Follow this tutorial to learn how to use the Ethereum EtherJS Library to deploy Solidity smart contracts to Moonbeam.
---
# Ethers.js JavaScript Library

![Intro diagram](/images/builders/build/eth-api/eth-libraries/ethersjs-banner.png)

## Introduction {: #introduction } 

The [ethers.js](https://docs.ethers.io/) library provides a set of tools to interact with Ethereum Nodes with JavaScript, similar to web3.js. Moonbeam has an Ethereum-like API available that is fully compatible with Ethereum-style JSON RPC invocations. Therefore, developers can leverage this compatibility and use the ethers.js library to interact with a Moonbeam node as if they were doing so on Ethereum. You can read more about ethers.js on this [blog post](https://medium.com/l4-media/announcing-ethers-js-a-web3-alternative-6f134fdd06f3).

## Setup Ethers.js with Moonbeam {: #setup-ethersjs-with-moonbeam } 

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

Different methods are available inside `provider` and `wallet`. Depending on which network you want to connect to, you can set the network configurations to the following values:

=== "Moonbeam"
    |   Variable   |                                      Value                                       |
    |:------------:|:--------------------------------------------------------------------------------:|
    |   RPC_URL    |                        `{{ networks.moonbeam.rpc_url }}`                         |
    |   ChainID    | `{{ networks.moonbeam.chain_id }}` (hex: `{{ networks.moonbeam.hex_chain_id }}`) |
    | NETWORK_NAME |                       `{{ networks.moonbeam.chain_spec }}`                       |

=== "Moonriver"
    |   Variable   |                                       Value                                        |
    |:------------:|:----------------------------------------------------------------------------------:|
    |   RPC_URL    |                         `{{ networks.moonriver.rpc_url }}`                         |
    |   ChainID    | `{{ networks.moonriver.chain_id }}` (hex: `{{ networks.moonriver.hex_chain_id }}`) |
    | NETWORK_NAME |                       `{{ networks.moonriver.chain_spec }}`                        |

=== "Moonbase Alpha"
    |   Variable   |                                      Value                                       |
    |:------------:|:--------------------------------------------------------------------------------:|
    |   RPC_URL    |                        `{{ networks.moonbase.rpc_url }}`                         |
    |   ChainID    | `{{ networks.moonbase.chain_id }}` (hex: `{{ networks.moonbase.hex_chain_id }}`) |
    | NETWORK_NAME |                                 `moonbase-alpha`                                 |

=== "Moonbeam Dev Node" 
    |   Variable   |                                         Value                                          |
    |:------------:|:--------------------------------------------------------------------------------------:|
    |   RPC_URL    |                          `{{ networks.development.rpc_url }}`                          |
    |   ChainID    | `{{ networks.development.chain_id }}` (hex: `{{ networks.development.hex_chain_id }}`) |
    | NETWORK_NAME |                                 `moonbeam-development`                                 |
 
## Tutorials {: #tutorials } 

If you are interested in a more detailed step-by-step guide, you can go to our specific tutorials on using ethers.js on Moonbeam to [send a transaction](/builders/interact/eth-libraries/send-transaction/) or [deploy a contract](/builders/interact/eth-libraries/deploy-contract/).

--8<-- 'text/disclaimers/third-party-content.md'