---
title: Block Explorers
description: An overview of the currently available block explorers that may be used to navigate the Substrate and Ethereum layers of Moonbeam.
---
# Block Explorers

![Explorer Banner](/images/builders/tools/explorers/explorers-banner.png)

## Introduction {: #introduction } 

Block explorers can be thought of as search engines for the blockchain. They allow users to search information such as balances, contracts, and transactions. More advanced block explorers even offer indexing capabilities, which enable them to provide a complete set of information, such as ERC-20 tokens in the network. They might even offer API services to access it via external services.

Moonbeam provides two different kind of explorers: ones to query the Ethereum API, and others  dedicated to the Substrate API. All EVM-based transactions are accessible via the Ethereum API wheras the Substrate API can be relied upon for Substrate-native functions such as governance and staking. The Substrate API also includes information about the EVM-based transactions, but only limited information is shown. 

## Quick Links {: #quick-links } 

<!-- TODO: add blockscout when it's ready -->
<!-- |                          [Blockscout](https://blockscout.moonriver.moonbeam.network/){target=_blank}                          |    EVM    |      https://blockscout.moonriver.moonbeam.network/      | -->

=== "Moonbeam"
    |                                                        Block Explorer                                                        |   Type    |                           URL                           |
    |:----------------------------------------------------------------------------------------------------------------------------:|:---------:|:-------------------------------------------------------:|
    |                                   [Moonscan](https://moonbeam.moonscan.io/){target=_blank}                                   |    EVM    |              https://moonbeam.moonscan.io/              |
    |                     [Expedition](https://moonbeam-explorer.netlify.app/?network=Moonbeam){target=_blank}                     |    EVM    | https://moonbeam-explorer.netlify.app/?network=Moonbeam |
    |                                    [Subscan](https://moonbeam.subscan.io/){target=_blank}                                    | Substrate |              https://moonbeam.subscan.io/               |
    | [Polkadot.Js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam.api.onfinality.io%2Fpublic-ws#/explorer){target=_blank} | Substrate |         https://polkadot.js.org/apps/#/explorer         |


=== "Moonriver"
    |                                                        Block Explorer                                                         |   Type    |                           URL                            |
    |:-----------------------------------------------------------------------------------------------------------------------------:|:---------:|:--------------------------------------------------------:|
    |                                   [Moonscan](https://moonriver.moonscan.io/){target=_blank}                                   |    EVM    |              https://moonriver.moonscan.io/              |
    |                          [Blockscout](https://blockscout.moonriver.moonbeam.network/){target=_blank}                          |    EVM    |      https://blockscout.moonriver.moonbeam.network/      |
    |                     [Expedition](https://moonbeam-explorer.netlify.app/?network=Moonriver){target=_blank}                     |    EVM    | https://moonbeam-explorer.netlify.app/?network=Moonriver |
    |                                    [Subscan](https://moonriver.subscan.io/){target=_blank}                                    | Substrate |              https://moonriver.subscan.io/               |
    | [Polkadot.Js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonriver.api.onfinality.io%2Fpublic-ws#/explorer){target=_blank} | Substrate |         https://polkadot.js.org/apps/#/explorer          |

=== "Moonbase Alpha"
    |                                                     Block Explorer                                                      |   Type    |                             URL                              |
    |:-----------------------------------------------------------------------------------------------------------------------:|:---------:|:------------------------------------------------------------:|
    |                                [Moonscan](https://moonbase.moonscan.io/){target=_blank}                                 |    EVM    |                https://moonbase.moonscan.io/                 |
    |                   [Blockscout](https://moonbase-blockscout.testnet.moonbeam.network/){target=_blank}                    |    EVM    |    https://moonbase-blockscout.testnet.moonbeam.network/     |
    |                [Expedition](https://moonbeam-explorer.netlify.app/?network=MoonbaseAlpha){target=_blank}                |    EVM    | https://moonbeam-explorer.netlify.app/?network=MoonbaseAlpha |
    |                                 [Subscan](https://moonbase.subscan.io/){target=_blank}                                  | Substrate |                 https://moonbase.subscan.io/                 |
    | [Polkadot.Js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer){target=_blank} | Substrate |           https://polkadot.js.org/apps/#/explorer            |

## Ethereum API {: #ethereum-api } 

### Moonscan {: #Moonscan } 

[Moonscan](https://moonscan.io/){target=_blank} is the primary Ethereum API block explorer for Moonbeam-based networks. Built by the Etherscan team, Moonscan provides a powerful, intuitive, and feature-rich experience. In addition to its comprehensive transaction and block data, Moonscan provides a number of [statistics and charts](https://moonbeam.moonscan.io/charts){target=_blank}, such as average gas price, daily transactions, and block size charts.

Other Moonscan features include:

 - [Collator leaderboard](https://moonbeam.moonscan.io/collators){target=_blank} ranking collators by performance
 - [Contract source code verification](https://moonscan.io/verifyContract){target=_blank}, accessible both via a web interface and an API
 - Ability to read and write state data of verified smart contracts
 - [Token approvals](https://moonscan.io/tokenapprovalchecker){target=_blank} where you can view and revoke any of your prior token approvals

![Moonriver Moonscan](/images/builders/tools/explorers/explorers-1.png)

### Blockscout {: #blockscout } 

[Blockscout](https://blockscout.moonriver.moonbeam.network/){target=_blank} provides an easy-to-use interface for users to inspect and confirm transactions on EVM blockchains, including Moonbeam-based networks. It allows you to search transactions, view accounts, and balances, and verify smart contracts. More information can be found in their [documentation site](https://docs.blockscout.com/){target=_blank}.

As main features, Blockscout offers:

 - Open source development, meaning all code is open to the community to explore and improve. You can find the code [here](https://github.com/blockscout/blockscout){target=_blank}
 - Real-time transaction tracking
 - Smart contract interaction
 - Full-featured [API with GraphQL](https://blockscout.moonriver.moonbeam.network/graphiql){target=_blank}, where users can test API calls directly from a web interface
 - ERC-20 and ERC-721 token support, listing all available token contracts in a friendly interface

![Blockscout Explorer](/images/builders/tools/explorers/explorers-2.png)

### Expedition {: #expedition } 

A Moonbeam-themed version of the [Expedition](https://github.com/xops/expedition){target=_blank} explorer can be found in [this link](https://moonbeam-explorer.netlify.app/){target=_blank}. It is a basic JSON-RPC based explorer.

By default, the explorer is connected to Moonbeam. However, you can switch to Moonriver or Moonbase Alpha, or connect it to a local dev node by following the next steps:

 1. Click on the network text, where you'll be able to select between all different networks, including a **Moonbeam Development Node** running on `{{ networks.development.rpc_url }}`
 2. In the case you want to connect to a specific RPC URL, select **Add Custom Chain** and enter the URL. For example, `http://localhost:9937`

![Expedition Explorer](/images/builders/tools/explorers/explorers-3.png)

## Substrate API {: #substrate-api } 

### Subscan {: #subscan } 

[Subscan](https://moonbeam.subscan.io/){target=_blank} is the primary Substrate API block explorer for Moonbeam-based networks. Subscan is capable of parsing standard or custom modules. For example, this is useful to display information regarding the Staking, Governance, and EVM pallets (or modules). The code is all open-source and can be found in the [Subscan Essentials GitHub repo](https://github.com/itering/subscan-essentials){target=_blank}.

![Subscan Moonriver](/images/builders/tools/explorers/explorers-4.png)

### Polkadot.js {: #polkadotjs } 

While not a full-featured block explorer, Polkadot.js Apps is a convenient option especially for users running local development nodes to view events and query transaction hashes. Polkadot.js Apps uses the WebSocket endpoint to interact with the Network. You can easily connect to [Moonbeam](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbeam.network#/explorer){target=_blank}, [Moonriver](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.moonriver.moonbase.moonbeam.network#/explorer){target=_blank}, or [Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer){target=_blank}.

![Polkadot.js Moonriver](/images/builders/tools/explorers/explorers-5.png)

To connect it to a Moonbeam development node, you can follow the steps in [this tutorial](/builders/get-started/moonbeam-dev/#connecting-polkadot-js-apps-to-a-local-moonbeam-node). The default port for this is `9944`.

![Polkadot.js Local Node](/images/builders/tools/explorers/explorers-6.png)
