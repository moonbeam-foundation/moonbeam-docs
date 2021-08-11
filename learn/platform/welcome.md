---
title: Welcome
description: Welcome to the documentation website for the Moonbeam smart contract platform, a parachain on Polkadot that is fully Ethereum compatible.
---

# Welcome to Moonbeam

![Main Page Banner](/images/main-banner.png)

This site provides documentation for Moonbeam, a smart contract parachain on the Polkadot network that is fully Ethereum Compatible.  Here, you'll find both high-level and technical information for developers, collators, end-users, and other Moonbeam network participants.

This site will grow and be refined over time as Moonbeam is developed.  We welcome you to join the Moonbeam community and contribute to this site and to the project.

---

## What is Moonbeam? {: #what-is-moonbeam } 

Moonbeam is a developer-oriented blockchain that strives to provide compatibility with the existing Ethereum developer toolchain and network.  It does this by providing a full EVM implementation, a Web3-compatible API, and bridges that connect Moonbeam to existing Ethereum networks.  This allows developers to deploy existing Solidity smart contracts and DApp frontends to Moonbeam with minimal changes.

Moonbeam will also be a parachain on the Polkadot network. That means it will get shared security from the Polkadot relay chain and will be able to integrate with other chains that are connected to Polkadot (once that functionality is available on Polkadot).

---

## How to Get Started with Moonbeam {: #how-to-get-started-with-moonbeam } 

### Networks {: #networks } 

Currently, there are a few ways you can start building on Moonbeam: 

 - Build your own Moonbeam instance as a [development node](/getting-started/local-node/setting-up-a-node/)
 - [Connect](/getting-started/moonbase/connect/) to the [Moonbase Alpha TestNet](/networks/moonbase/)
 - [Connect](/getting-started/moonriver/connect/) to [Moonriver](/networks/moonriver/)

### Wallets {: #wallets } 

Currently, we have tested Moonbeam with the following wallets:

 - [MetaMask](/integrations/wallets/metamask/)
 - [MathWallet](/integrations/wallets/mathwallet/)
 - [Polkadot JS Apps](/integrations/wallets/polkadot-js-apps/) # ERIN
 - [Ledger](/integrations/wallets/ledger/)
 - [Trezor](/integrations/wallets/trezor/)
 - [Nifty](/integrations/wallets/nifty/) # ERIN

However, any wallet that works with an Ethereum custom network should work with Moonbeam as well!

### Deploy a Contract {: #deploy-a-contract } 

Because of Moonbeam's Ethereum compatibility features, you can use the development tools you know and love to deploy a contract:

 - [Ethereum Libraries](/builders/deploy-a-contract/using-ethereum-libraries/)
 - [Remix](/builders/deploy-a-contract/using-remix/)
 - [OpenZeppelin and Remix](/builders/deploy-a-contract/using-openzeppelin-and-remix/)
 - [HardHat](/integrations/hardhat/)
 - [Truffle](/integrations/trufflebox/)
 - [Waffle and Mars](/builders/deploy-a-contract/using-waffle-and-mars/)

Want another Ethereum tool listed here? [Let us know!](https://discord.gg/PfpUATX)

### Interact with the Network {: #interact-with-the-network } 

 - [Web3.js](/integrations/ethlibraries/web3js/)
 - [Ethers.js](/integrations/ethlibraries/etherjs/)
 - [Web3.py](/integrations/ethlibraries/web3py/)
 - [The Graph](/integrations/indexers/thegraph/)
 - [Covalent API](/integrations/indexers/covalent/)
 - [Debug API & Trace Module](/integrations/debug-trace/)

### Oracles {: #oracles } 

 We also have a number of Oracles that can serve as data feed to your smart contracts:

 - [Chainlink](/integrations/oracles/chainlink/)
 - [Band Protocol](/integrations/oracles/band-protocol/)
 - [Razor Network](/integrations/oracles/razor-network/)

### Bridges {: #bridges } 

Currently, we have a fully functioning bridge implementation that connects Ethereum's Rinkeby/Kovan TestNets and Moonbase Alpha:

 - [ChainBridge](/integrations/bridges/ethereum/chainbridge/)

---

## How to Engage With the Moonbeam Community {: #how-to-engage-with-the-moonbeam-community } 

### :fontawesome-brands-discord:  Discord {: #fontawesome-brands-discord-discord } 
Instructions for our TestNet and other development-focused conversation is found on our [Discord channel](https://discord.gg/PfpUATX).

### :moonbeam-element:  Element {: #moonbeam-element-element } 
Technical discussions and support are encouraged in our Element (formerly Riot) room that can be found [here](https://app.element.io/#/room/#moonbeam:matrix.org).

### :fontawesome-brands-telegram-plane:  Telegram {: #fontawesome-brands-telegram-plane-telegram } 
General information and other non-technical topics can be discussed in our Telegram group [here](https://t.me/Moonbeam_Official).

### :fontawesome-brands-twitter:  Twitter {: #fontawesome-brands-twitter-twitter } 
Follow us on Twitter for regular updates: [@MoonbeamNetwork](https://twitter.com/MoonbeamNetwork).

### :fontawesome-brands-youtube:  YouTube {: #fontawesome-brands-youtube-youtube } 
For video-tutorials and related content, subscribe to our YouTube channel [here](https://www.youtube.com/c/MoonbeamNetwork).

### :fontawesome-solid-envelope:  Newsletter {: #fontawesome-solid-envelope-newsletter } 
We send a monthly newsletter with project updates that you can sign up for [here](https://moonbeam.network/newsletter/).

## About This Site {: #about-this-site } 
This site is generated using [mkdocs](https://www.mkdocs.org/) and is based on content in the moonbeam-docs repo, which can be found [on :fontawesome-brands-github: GitHub](https://github.com/PureStake/moonbeam-docs).
