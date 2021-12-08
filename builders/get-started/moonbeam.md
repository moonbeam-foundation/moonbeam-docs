---
title: Moonriver
description: Learn how to get started and connect to Moonbeam, the deployment on Polkadot, via RPC and WSS endpoints.
---

# Get Started with Moonbeam

--8<-- 'text/moonbeam/connect.md'

## Block Explorers {: #block-explorers }

For Moonbeam, you can use any of the following block explorers:

 - **Substrate API** — [Subscan](https://moonbeam.subscan.io/) or [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbeam.network#/explorer)
 - **Ethereum API JSON-RPC based** — [Moonbeam Basic Explorer](https://moonbeam-explorer.netlify.app/?network=Moonbeam)
 - **Ethereum API with Indexing** — [Blockscout](https://blockscout.moonbeam.network/)

For more information on each of the available block explorers, please head to the [Block Explorers](/builders/tools/explorers) section of the documentation.

## Connect MetaMask {: #connect-metamask }

Currently, you can't connect MetaMask to Moonbeam as the EVM is not yet enabled. You'll find the instructions on how to connect MetaMask to Moonbeam once the network is fully launched.

<!---
If you already have MetaMask installed, you can easily connect MetaMask to Moonriver:

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonbeam">Connect MetaMask</a>
</div>

!!! note
    MetaMask will popup asking for permission to add Moonriver as a custom network. Once you approve permissions, MetaMask will switch your current network to Moonriver.

If you do not have MetaMask installed, or would like to follow a tutorial to get started, please check out the [Interacting with Moonbeam using MetaMask](/tokens/connect/metamask/) guide.

If you want to connect MetaMask by providing the network information, you can use the following data:

 - Network Name: `Moonriver`
 - RPC URL: `{{ networks.moonriver.rpc_url }}`
 - ChainID: `{{ networks.moonriver.chain_id }}` (hex: `{{ networks.moonriver.hex_chain_id }}`)
 - Symbol (Optional): `MOVR`
 - Block Explorer (Optional): `{{ networks.moonriver.block_explorer }}` 
 --->