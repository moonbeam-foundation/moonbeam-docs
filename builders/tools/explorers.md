---
title: Block Explorers
description: An overview of the currently available block explorers that may be used to navigate the Substrate and Ethereum layers of Moonbeam.
---
# Block Explorers

![Explorer Banner](/images/builders/tools/explorers/explorers-banner.png)

## Introduction {: #introduction } 

Block explorers can be thought of as search engines for the blockchain. They allow users to search information such as balances, contracts, and transactions. More advanced block explorers even offer indexing capabilities, which enable them to provide a complete set of information, such as ERC-20 tokens in the network. They might even offer API services to access it via external services.

Moonbeam provides two different sets of explorers: one to query the Ethereum API, and one for the Substrate API. All EVM-based transactions are accesible via the Ethereum API wheras the Substrate API can be relied upon for Substrate-native functions such as governance and staking. 

## Quick Links {: #quick-links } 

=== "Moonriver"
    |                                                               Block Explorer                                                               |                  Type                   |                  URL                   |
    |   :-------------------------------------------------------------------------------   -------------------------------------------------------:|  :------------------------------------------:| :------------------------------------------:|
    |         [Moonscan](https://moonriver.moonscan.io/){target=_blank}         |  EVM | https://moonriver.moonscan.io/ |
    | [Blockscout](https://blockscout.moonriver.moonbeam.network/){target=_blank} |     EVM | https://blockscout.moonriver.moonbeam.network/ | 
    |  [Subscan](https://moonriver.subscan.io/){target=_blank}  |     Substrate | https://moonriver.subscan.io/ |
    |                                          [Polkadot.Js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonriver.api.onfinality.io%2Fpublic-ws#/explorer){target=_blank}                                          |  Substrate | https://polkadot.js.org/apps/#/explorer | 

=== "Moonbase Alpha"
    |                                                               Block Explorer                                                               |                  Type                   |                  URL                   |
    |   :-------------------------------------------------------------------------------   -------------------------------------------------------:|  :------------------------------------------:| :------------------------------------------:|
    |         [Moonscan](https://moonbase.moonscan.io/){target=_blank}         |  EVM | https://moonbase.moonscan.io/ |
    | [Blockscout](https://moonbase-blockscout.testnet.moonbeam.network/){target=_blank} |     EVM | https://moonbase-blockscout.testnet.moonbeam.network/ | 
    |  [Subscan](https://moonbase.subscan.io/){target=_blank}  |     Substrate | https://moonbase.subscan.io/ |
    |                                          [Polkadot.Js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/explorer){target=_blank}                                           |  Substrate | https://polkadot.js.org/apps/#/explorer | 

## Ethereum API {: #ethereum-api } 

### Moonscan {: #Moonscan } 

[Moonscan](https://moonscan.io/){target=_blank} is the primary Ethereum API block explorer for Moonbeam. Built by the Etherscan team, Moonscan provides a powerful, intuitive, and feature-rich experience. 

![Moonriver Moonscan](/images/builders/tools/explorers/explorers-6.png)

### Blockscout {: #blockscout } 

[Blockscout](https://blockscout.moonriver.moonbeam.network/){target=_blank} provides an easy-to-use interface for users to inspect and confirm transactions on EVM blockchains, including Moonbeam. It allows you to search transactions, view accounts, and balances, and verify smart contracts. More information can be found in their [documentation site](https://docs.blockscout.com/){target=_blank}.

As main features, Blockscout offers:

 - Open source development, meaning all code is open to the community to explore and improve. You can find the code [here](https://github.com/blockscout/blockscout){target=_blank}
 - Real-time transaction tracking
 - Smart contract interaction
 - ERC-20 and ERC-721 token support, listing all available token contract in a friendly interface
 - Full-featured API with GraphQL, where users can test API calls directly from a web interface

![Blockscout Explorer](/images/builders/tools/explorers/explorers-2.png)

## Substrate API {: #substrate-api } 

### Subscan {: #subscan } 

[Subscan](https://moonriver.subscan.io/){target=_blank} is the primary Substrate API block explorer for Moonbeam. Subscan is capable of parsing standard or custom modules. For example, this is useful to display information regarding the Staking, Governance, and EVM pallets (or modules). The code is all open-source and can be found [here](https://github.com/itering/subscan-essentials){target=_blank}.

An instance of Subscan running against the Moonbase Alpha TestNet can be found in [this link](https://moonbase.subscan.io/).

![Subscan Moonbase Alpha](/images/builders/tools/explorers/explorers-5.png)

### Polkadot.js {: #polkadotjs } 

Polkadot.js Apps uses the WebSocket endpoint to interact with the Network. To connect it to a Moonbeam development node, you can follow the steps in [this tutorial](/builders/get-started/moonbeam-dev/#connecting-polkadot-js-apps-to-a-local-moonbeam-node). The default port for this is `9944`.

![Polkadot.js Local Node](/images/builders/tools/explorers/explorers-3.png)

To view and interact with Moonbase Alpha's substrate layer, go to [this URL](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/explorer). This is the Polkadot.js Apps pointing to the TestNet. You can find more information in [this page](/tokens/connect/polkadotjs/).

![Polkadot.js Moonbase Alpha](/images/builders/tools/explorers/explorers-4.png)


