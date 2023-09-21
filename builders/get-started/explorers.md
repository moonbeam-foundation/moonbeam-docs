---
title: Block Explorers
description: An overview of the currently available block explorers that may be used to navigate the Substrate and Ethereum layers of Moonbeam.
---

# Block Explorers

## Introduction {: #introduction }

Block explorers can be thought of as search engines for the blockchain. They allow users to search information such as balances, contracts, and transactions. More advanced block explorers even offer indexing capabilities, which enable them to provide a complete set of information, such as ERC-20 tokens in the network. They might even offer API services to access it via external services.

Moonbeam provides two different kind of explorers: ones to query the Ethereum API, and others  dedicated to the Substrate API. All EVM-based transactions are accessible via the Ethereum API wheras the Substrate API can be relied upon for Substrate-native functions such as governance and staking. The Substrate API also includes information about the EVM-based transactions, but only limited information is shown.

## Quick Links {: #quick-links }

--8<-- 'text/explorers/explorers.md'

## Ethereum API {: #ethereum-api }

### Moonscan {: #Moonscan }

[Moonscan](https://moonscan.io/){target=_blank} is the primary Ethereum API block explorer for Moonbeam-based networks. Built by the Etherscan team, Moonscan provides a powerful, intuitive, and feature-rich experience. In addition to its comprehensive transaction and block data, Moonscan provides a number of [statistics and charts](https://moonbeam.moonscan.io/charts){target=_blank}, such as average gas price, daily transactions, and block size charts.

Other Moonscan features include:

 - [Collator leaderboard](https://moonbeam.moonscan.io/collators){target=_blank} ranking collators by performance
 - [Contract source code verification](/builders/build/eth-api/verify-contracts/block-explorers/){target=_blank}, accessible both via a web interface and an API
 - Ability to read and write state data of verified smart contracts
 - [Token approvals](https://moonscan.io/tokenapprovalchecker){target=_blank} where you can view and revoke any of your prior token approvals
 - [Adding token information](/builders/get-started/token-profile/){target=_blank} and creating a profile for ERC-20s, ERC-721s, and ERC-1155s deployed to Moonbeam-based networks. The profile can include links to your project, social media, price data, and other information pertaining to your token

![Moonbeam Moonscan](/images/builders/get-started/explorers/explorers-1.png)

### Expedition {: #expedition }

A Moonbeam-themed version of the [Expedition](https://github.com/xops/expedition){target=_blank} explorer can be found in [this link](https://moonbeam-explorer.netlify.app/){target=_blank}. It is a basic JSON-RPC based explorer.

By default, the explorer is connected to Moonbeam. However, you can switch to Moonriver or Moonbase Alpha, or connect it to a local dev node by following the next steps:

 1. Click on the network text, where you'll be able to select between all different networks, including a **Moonbeam Development Node** running on `{{ networks.development.rpc_url }}`
 2. In the case you want to connect to a specific RPC URL, select **Add Custom Chain** and enter the URL. For example, `http://localhost:9937`

![Expedition Explorer](/images/builders/get-started/explorers/explorers-2.png)

## Substrate API {: #substrate-api }

### Subscan {: #subscan }

[Subscan](https://moonbeam.subscan.io/){target=_blank} is the primary Substrate API block explorer for Moonbeam-based networks. Subscan is capable of parsing standard or custom modules. For example, this is useful to display information regarding the Staking, Governance, and EVM pallets (or modules). The code is all open-source and can be found in the [Subscan Essentials GitHub repo](https://github.com/subscan-explorer/subscan-essentials){target=_blank}.

![Subscan Moonbeam](/images/builders/get-started/explorers/explorers-3.png)

### Polkadot.js {: #polkadotjs }

While not a full-featured block explorer, Polkadot.js Apps is a convenient option especially for users running local development nodes to view events and query transaction hashes. Polkadot.js Apps uses the WebSocket endpoint to interact with the Network. You can easily connect to [Moonbeam](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/explorer){target=_blank}, [Moonriver](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonriver.moonbase.moonbeam.network#/explorer){target=_blank}, or [Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/explorer){target=_blank}.

![Polkadot.js Moonbeam](/images/builders/get-started/explorers/explorers-4.png)

To connect it to a Moonbeam development node, you can follow the steps in the [Connecting Polkadot.js Apps to a Local Moonbeam Node](/builders/get-started/networks/moonbeam-dev/#connecting-polkadot-js-apps-to-a-local-moonbeam-node){target=_blank} section of the [Getting Started with a Moonbeam Development Node](/builders/get-started/networks/moonbeam-dev/){target=_blank} guide. The default port for this is `9944`.

![Polkadot.js Local Node](/images/builders/get-started/explorers/explorers-5.png)
