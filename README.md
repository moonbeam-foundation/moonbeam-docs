---
title: Welcome
description: Welcome to the documentation website for the Moonbeam smart contract platform, a parachain on Polkadot.
---

#Welcome to Moonbeam

This site provides documentation for Moonbeam, a Smart Contract Parachain on the Polkadot Network.  The site aims to provide information for developers, collators, end users, and other Moonbeam network participants.  This site is a living site which will grow and be refined over time as Moonbeam is developed.  We welcome you to join the Moonbeam community and contribute to this site and to the project.


##What is Moonbeam?  
Moonbeam is a developer oriented blockchain that strives to provide compatibility with the existing Ethereum developer toolchain and network.  It does this by providing a full EVM implementation, a web3 compatible API, and bridges connecting Moonbeam to existing Ethereum networks.  This means that developers will be able to deploy existing Solidity smart contracts and DApp frontends to Moonbeam with minimal changes.

Moonbeam will also be a parachain on the Polkadot network which means that it will get shared security from the Polkadot relay chain, and that Moonbeam will be able to integrate with other chains that are connected to Polkadot once that functionality is available on Polkadot.

##What is the Current Status and Roadmap for Moonbeam?
Moonbeam is currently pre alpha software.  We are working on the implementation of the minimum feature set which will be needed to launch our testnet in Q3 2020.  Our rough roadmap beyond that is to launch on Kusama in Q4 2020 and on the Polkadot mainnet in Q1 2021.

You can follow the Getting Started guides on this website to start to work with the Ethereum compatibility functionality of Moonbeam.  Our current focus is on making sure the Moonbeam EVM and Web3 features are feature complete.  Other critical components in our backlog that have to be implemented include the implementation of a unified account system and functionality to power collator incentives.

##What are the Differences Between Moonbeam and Ethereum?
While Moonbeam strives to be compatible with Ethereum’s Web3 API and EVM, there are a number of important Moonbeam differences.  Moonbeam uses a Proof of Stake based consensus mechanism, which means that Proof of Work concepts such as difficulty, uncles, hashrate, etc generally don’t have meaning within Moonbeam.  For APIs that return values related to Ethereum’s Proof of Work, we return default values.  Existing Ethereum contracts that rely on Proof of Work internals (e.g. Mining Pool contracts) will not work as expected on Moonbeam.

Another significant difference between Moonbeam and Ethereum is that Moonbeam includes an extensive set of on-chain governance features based on Substrate functionality.  These onchain governance modules include functionality to power upgrades to the blockchain itself based on token weighted voting.

##How Can I Engage With the Moonbeam Community?
Technical discussions and support are encouraged in our Riot room that can be found [here](https://matrix.to/#/!dzULkAiPePEaverEEP:matrix.org?via=matrix.org)

General information and other non-technical topics can be discussed in our telegram group [here]().

Follow us on twitter for regular updates: [@MoonbeamNetwork](https://twitter.com/MoonbeamNetwork).

We send a monthly newsletter with project updates that you can sign up for [here](https://moonbeam.network/).

##About this Site
This site is generated based on content in the moonbeam-docs repo which can be found [here](https://github.com/PureStake/moonbeam-docs) using [mkdocs](https://www.mkdocs.org/).

