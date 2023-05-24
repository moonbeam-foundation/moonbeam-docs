---
title: Polkadot's Substrate in Moonbeam
description: Discover Polkadot's Substrate developer framework and how it shapes blockchain development in both Moonbeam's networks and other parachains.

---

# Polkadot's Substrate on Moonbeam

![Substrate banner](/images/builders/build/substrate-api/substrate/substrate-banner.png)

## Introduction {: #introduction }
 
Polkadot's Substrate is an open-source, modular SDK for building blockchains in Rust. It is developed by Parity Technologies, the same team behind Polkadot.  

Substrate provides the foundational building blocks for creating custom, domain-specific blockchains through its framework FRAME. FRAME is designed to be flexible and forkless, allowing developers to choose the components that best suit their blockchain needs and perform runtime upgrades without requiring network forks like Ethereum. Most developers will gravitate towards Substrate with the intention to integrate with the Polkadot ecosystem, but its flexibility allows users to create both solo-chains and parachains.  

This page will provide an overview of Polkadot's Substrate and how it relates to the Moonbeam ecosystem.  

## Creating a Blockchain with Substrate {: creating-a-blockchain-with-substrate }

If you're interested in developing on Polkadot with Substrate and FRAME, the [Substrate Developer Hub](https://docs.substrate.io/learn/what-can-you-build/){target=_blank} provides comprehensive documentation, tutorials, and examples.  

### Substrate Pallets {: #substrate-pallets }

Pallets are the fundamental building blocks of Substrate blockchains. They are modular components that encapsulate specific functionality. Each pallet is essentially a piece of Rust code that dictates how a particular feature or function operates within the blockchain's runtime.  

Pallets are used to customize and extend the capabilities of a Substrate-based blockchain. They can be thought of as plug-and-play modules that can be mixed, matched, and configured to create a bespoke blockchain. Each pallet is independent and designed to do one thing well, providing a specific functionality such as managing balances, handling consensus, or facilitating on-chain governance.

Some examples of open-source pallets that are available to all Substrate developers are:  

- **[Balances Pallet](https://crates.io/crates/pallet-balances){target=_blank}** — manages the balance of accounts in a Substrate blockchain
- **[Assets Pallet](https://crates.io/crates/pallet-assets){target=_blank}** — handles the creation and management of on-chain fungible assets
- **Consensus Pallets** — these pallets provide different consensus mechanisms, such as [Aura](https://crates.io/crates/pallet-aura){target=_blank} and [Babe](https://crates.io/crates/pallet-babe){target=_blank}, for block production
- **Governance Pallets** — these pallets, like [Democracy](https://crates.io/crates/pallet-democracy){target=_blank} and [Collective](https://crates.io/crates/pallet-collective){target=_blank}, provide on-chain governance mechanisms
- **[EVM Pallet](https://crates.io/crates/pallet-evm){target=_blank}** — provides an Ethereum Virtual Machine (EVM) environment, allowing execution of Ethereum smart contracts

In addition to the standard pallets provided by Polkadot's Substrate, developers can [create their own pallets](https://docs.substrate.io/tutorials/collectibles-workshop/03-create-pallet/){target=_blank} to add custom functionality to their own blockchains.  

!!! note
    Developers can edit pre-existing pallets because they are all open source. This flexibility is one of the benefits of using Polkadot's Substrate, but it's also important to know that there are few standards that are enforced across each of the parachains that are connected through the Polkadot relay chain.  

### Forkless Upgrades {: #forkless-upgrades }

One of the best things about developing on Polkadot with Substrate is the ability to introduce [forkless upgrades](https://docs.substrate.io/maintain/runtime-upgrades/){target=_blank} to blockchain runtimes. In traditional blockchain architectures, making substantial changes to the blockchain's rules or logic often requires a hard fork. This process can be disruptive and contentious, potentially splitting the community and the blockchain itself into two separate entities.  

Substrate takes a different approach. It separates the blockchain's state (data) from its logic (rules). The logic is contained in the blockchain's runtime, which is itself stored on the blockchain. This design allows the runtime to be upgraded through a special kind of transaction, effectively changing the rules without disrupting the continuity of the blockchain.  

Whenever you build a blockchain with Substrate, you compile your Rust code into a build binary. This build can be uploaded into a pre-existing and running blockchain through [FRAME's `set_code` call](https://paritytech.github.io/substrate/master/frame_system/pallet/enum.Call.html#variant.set_code){target=_blank}. When a new runtime is uploaded and approved (typically through an on-chain governance process), all nodes automatically switch to the new runtime at a specified block number. This process is smooth and automatic, with no need for node operators to manually upgrade their software.  

## Substrate and Moonbeam {: #substrate-and-moonbeam }

Moonbeam is an Ethereum-compatible smart contract platform on the Polkadot network that makes it easy to create, deploy, and run DApps. As a parachain, Moonbeam is built on Substrate, which allows it to seamlessly integrate with the Polkadot ecosystem.  

The Moonbeam team has been an active contributor to the Substrate ecosystem. The team has pioneered and contributed to several open-source Substrate pallets, including the Ethereum compatibility layer pallets that allows Substrate-based blockchains to interact with Ethereum-based applications, called [Frontier](https://paritytech.github.io/frontier/){target=_blank}.  

The Moonbeam runtime, built with Polkadot's Substrate, can be found in the [Moonbeam GitHub repository](https://github.com/PureStake/moonbeam){target=_blank}.  