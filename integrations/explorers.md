---
title: Block Explorers
description: An overview of the currently available block explorers that may be used to navigate the Substrate and Ethereum layers of the Moonbeam TestNet.
---
# Block Explorers

![Explorer Banner](/images/explorers/explorers-banner.png)

## Introduction 

Block explorers can be thought of as search engines for the blockchain. They allow users to search information such as balances, contracts, and transactions. More advanced block explorers even offer indexing capabilities, which enable them to provide a complete set of information, such as ERC20 tokens in the network. They might even offer API services to access it via external services.

Moonbeam provides two different sets of explorers: one to query the Ethereum API, and one for the Substrate API.

!!! note
    If you are using Brave Browser and your explorer is not connecting to the Moonbeam instance you are pointing it to, try disabling Brave Shield.

## Ethereum API

### Expedition (Dev Node - TestNet)

A Moonbeam-themed version of the [Expedition](https://github.com/etclabscore/expedition) explorer can be found in [this link](https://moonbeam-explorer.netlify.app/).

By default, the explorer is connected to the Moonbase Alpha TestNet. However, you can connect it following the next steps:

 1. Click on the gear icon in the top right corner
 2. Select "Development" if you have a node running on `http://localhost:9933` (default RPC location of a Moonbeam node running with `--dev`flag). You can also switch back to "Moonbase Alpha"
 3. In the case you want to connect to a specific RPC URL, select "Custom RPC" and enter the URL. For example, `http://localhost:9937`

![Expedition Explorer](/images/explorers/explorers-images-1.png)

### Blockscout (TestNet)

Blockscout provides an easy-to-use interface for users to inspect and confirm transactions on EVM blockchains, including Moonbeam. It allows you to search transactions, view accounts, and balances, and verify smart contracts. More information can be found in their [documentation site](https://docs.blockscout.com/).

As main features, Blockscout offers:

 - Open source development, meaning all code is open to the community to explore and improve. You can find the code [here](https://github.com/blockscout/blockscout)
 - Real-time transaction tracking
 - Smart contract interaction
 - ERC20 and ERC721 token support, listing all available token contract in a friendly interface
 - Full-featured API with GraphQL, where users can test API calls directly from a web interface

An instance of Blockscout running against the Moonbase Alpha TestNet can be found in [this link](https://moonbase-blockscout.testnet.moonbeam.network/).

![Blockscout Explorer](/images/explorers/explorers-images-2.png)

## Substrate API

### PolkadotJS (Dev Node - TestNet)

Polkadot JS Apps uses the WebSocket endpoint to interact with the Network. To connect it to a Moonbeam development node, you can follow the steps in [this tutorial](/getting-started/local-node/setting-up-a-node/#connecting-polkadot-js-apps-to-a-local-moonbeam-node). The default port for this is `9944`.

![Polkadot JS Local Node](/images/explorers/explorers-images-3.png)

To view and interact with Moonbase Alpha's substrate layer, go to [this URL](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/explorer). This is the Polkadot JS Apps pointing to the TestNet. You can find more information in [this page](/integrations/wallets/polkadotjs/).

![Polkadot JS Moonbase Alpha](/images/explorers/explorers-images-4.png)

### Subscan

Subscan provides blockchain explorer capabilities for Substrate-based chains. It is capable of parsing standard or custom modules. For example, this is useful to display information regarding the Staking, Governance, and EVM pallets (or modules). Code is all open-source and can be found [here](https://github.com/itering/subscan-essentials).

An instance of Subscan running against the Moonbase Alpha TestNet can be found in [this link](https://moonbase.subscan.io/).

![Subscan Moonbase Alpha](/images/explorers/explorers-images-5.png)
## We Want to Hear From You

If you have any feedback regarding block explorers or any other Moonbeam-related topic, feel free to reach out through our official development [Discord channel](https://discord.gg/PfpUATX).
