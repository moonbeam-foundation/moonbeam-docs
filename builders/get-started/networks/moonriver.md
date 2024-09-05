---
title: Moonriver Get Started Guide
description: Learn how to connect to Moonriver via RPC and WSS endpoints, how to connect MetaMask to Moonriver, and about the available Moonriver block explorers.
---

# Get Started with Moonriver

--8<-- 'text/builders/get-started/networks/moonriver/connect.md'

## Block Explorers {: #block-explorers }

For Moonriver, you can use any of the following block explorers:

 - **Ethereum API (Etherscan Equivalent)** — [Moonscan](https://moonriver.moonscan.io){target=\_blank}
 - **Ethereum API JSON-RPC based** — [Moonbeam Basic Explorer](https://moonbeam-explorer.netlify.app/?network=Moonriver){target=\_blank}
 - **Substrate API** — [Subscan](https://moonriver.subscan.io){target=\_blank} or [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonriver.moonbeam.network#/explorer){target=\_blank}
 
For more information on each of the available block explorers, please head to the [Block Explorers](/builders/get-started/explorers/) section of the documentation.

## Connect MetaMask {: #connect-metamask }

If you already have MetaMask installed, you can easily connect MetaMask to Moonriver:

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonriver">Connect MetaMask</a>
</div>

!!! note
    MetaMask will popup asking for permission to add Moonriver as a custom network. Once you approve permissions, MetaMask will switch your current network to Moonriver.

If you do not have MetaMask installed, or would like to follow a tutorial to get started, please check out the [Interacting with Moonbeam using MetaMask](/tokens/connect/metamask/) guide.

## Configuration {: #configuration }

Please note the following gas configuration parameters. These values are subject to change in future runtime upgrades.

|       Variable        |                    Value                    |
|:---------------------:|:-------------------------------------------:|
|   Minimum gas price   | {{ networks.moonriver.min_gas_price }} Gwei |
|   Target block time   | {{ networks.moonriver.block_time }} seconds |
|    Block gas limit    |     {{ networks.moonriver.gas_block }}      |
| Transaction gas limit |       {{ networks.moonriver.gas_tx }}       |
