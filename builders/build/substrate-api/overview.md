---
title: Polkadot's Substrate in Moonbeam
description: Discover Polkadot's Substrate developer framework and how it shapes blockchain development in both Moonbeam's networks and other parachains.

---

# Polkadot's Substrate on Moonbeam

## What is Substrate? {: #what-is-substrate }

Polkadot's Substrate is an open-source, modular SDK for building blockchains in Rust. It is developed by Parity Technologies, the same team behind Polkadot.  

Where Polkadot is a chain through which many blockchains are connected to, Substrate is the toolset that Moonbeam uses that provides the foundational building blocks for creating custom, domain-specific blockchains. Substrate's FRAME framework is designed to be flexible and forkless, allowing developers to choose the components that best suit their blockchain needs and perform runtime upgrades without requiring network forks like Ethereum does. Most developers will gravitate towards Substrate with the intention of integrating with the Polkadot ecosystem, but its flexibility allows users to create both solo-chains and parachains.  

This page will provide an overview of Polkadot's Substrate and how it relates to the Moonbeam ecosystem. If you're interested in developing on Polkadot yourself with Substrate and FRAME, the [Substrate Developer Hub](https://docs.substrate.io/learn/what-can-you-build/){target=\_blank} provides comprehensive documentation, tutorials, and examples.

## Substrate Pallets {: #substrate-pallets }

Pallets are the fundamental building blocks of Substrate blockchains. They are modular components that encapsulate specific functionality. Each pallet is essentially a piece of Rust code that dictates how a particular feature or function operates within the blockchain's runtime.  

Pallets are used to customize and extend the capabilities of a Substrate-based blockchain. They can be thought of as plug-and-play modules that can be mixed, matched, and configured to create a bespoke blockchain. Each pallet is independent and designed to do one thing well, providing specific functionality such as managing balances, handling consensus, or facilitating on-chain governance.

Some examples of open-source pallets that are available to all Substrate developers are:  

- **[Balances Pallet](https://crates.io/crates/pallet-balances/){target=\_blank}** — manages the balance of accounts in a Substrate blockchain
- **[Assets Pallet](https://crates.io/crates/pallet-assets/){target=\_blank}** — handles the creation and management of on-chain fungible assets
- **Consensus Pallets** — these pallets provide different consensus mechanisms, such as [AURA](https://crates.io/crates/pallet-aura/){target=\_blank} and [BABE](https://crates.io/crates/pallet-babe/){target=\_blank}, for block production
- **Governance Pallets** — these pallets, like [Referenda](https://crates.io/crates/pallet-referenda/){target=\_blank} and [Collective](https://crates.io/crates/pallet-collective/){target=\_blank}, provide on-chain governance mechanisms
- **[Frontier Pallets](https://polkadot-evm.github.io/frontier/){target=\_blank}** — Ethereum compatibility layer pallets that allows Substrate-based blockchains to interact with Ethereum-based applications that the Moonbeam team pioneered. Includes pallets such as the [EVM Pallet](https://crates.io/crates/pallet-evm/){target=\_blank}  
- **[Parachain Staking Pallet](/builders/pallets-precompiles/pallets/staking/){target=\_blank}** - enables a delegated proof of stake (DPoS) system, a pallet that Moonbeam created

In addition to the standard pallets provided by Polkadot's Substrate, developers can [create their own pallets](https://docs.substrate.io/tutorials/collectibles-workshop/03-create-pallet/){target=\_blank} to add custom functionality to their own blockchains.  

!!! note
    Developers can edit pre-existing pallets because they are all open source. This flexibility is one of the benefits of using Polkadot's Substrate, but it's also important to know that there are a few standards that are enforced across each of the parachains that are connected through the Polkadot relay chain.  

The Moonbeam runtime, built with Polkadot's Substrate, can be found in the [Moonbeam GitHub repository](https://github.com/moonbeam-foundation/moonbeam/){target=\_blank}. Within this repository, you can see additional custom pallets that the Moonbeam team has written and edited within the [`pallets` folder](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/){target=\_blank}. You can also check out documentation on some Substrate pallets as they pertain to Moonbeam in the [Pallets section](/builders/pallets-precompiles/pallets/){target=\_blank} of our documentation.

You can interact with Substrate features exposed by these pallets using development tools like the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=\_blank}, the [Python Substrate Interface](/builders/build/substrate-api/py-substrate-interface/){target=\_blank}, and the [Substrate API Sidecar](/builders/build/substrate-api/sidecar/){target=\_blank}.

## Forkless Upgrades {: #forkless-upgrades }

One of the best things about developing on Polkadot with Substrate is the ability to introduce [forkless upgrades](https://docs.substrate.io/maintain/runtime-upgrades/){target=\_blank} to blockchain runtimes. In traditional blockchain architectures, making substantial changes to the blockchain's rules or logic often requires a hard fork. This process can be disruptive and contentious, potentially splitting the community and the blockchain itself into two separate entities.  

Substrate takes a different approach. It separates the blockchain's state (data) from its logic (rules). The logic is contained in the blockchain's runtime, which is itself stored on the blockchain. This design allows the runtime to be upgraded through a special kind of transaction, effectively changing the rules without disrupting the continuity of the blockchain.  

Whenever you build a blockchain with Substrate, you compile your Rust code into a build binary. This build can be uploaded into a pre-existing and running blockchain through [FRAME's `set_code` call](https://paritytech.github.io/substrate/master/frame_system/pallet/enum.Call.html#variant.set_code){target=\_blank}. When a new runtime is uploaded and approved (typically through an on-chain governance process), all nodes automatically switch to the new runtime at a specified block number. This process is smooth and automatic, with no need for node operators to manually upgrade their software.  

Moonbeam regularly uses the forkless upgrade system to add additional features to the Moonbeam ecosystem. You can keep track of and discuss Moonbeam's upcoming forkless upgrades on the [Moonbeam forum](https://forum.moonbeam.foundation/){target=\_blank}.  

## Native Interoperability {: #native-interoperability }

While Substrate allows developers to create blockchains, one of its biggest advantages is that it supports integration for native interoperability through relay chains like Polkadot and Kusama.  

A relay chain is a central chain that connects several blockchains, known as parachains. Each parachain is a distinct blockchain with its own runtime and state, but all are connected to and secured by the relay chain. Substrate-based blockchains can become parachains by connecting to the relay chain. Once connected, they can communicate with other parachains through a mechanism known as [Cross-Consensus Messaging (XCM)](/builders/interoperability/xcm/overview/){target=\_blank}. This allows them to exchange information and conduct transactions in the same language, enabling a wide range of interoperable applications.  

Native interoperability offers the following advantages:  

- **Shared security** — parachains share the security of the relay chain, reducing the resources each chain needs to secure itself
- **Interchain communication** — parachains can communicate with each other, enabling the transfer of data and assets between different blockchains
- **Asset transfers** — parachains that can communicate with each other can easily send native assets between each other  

By providing native interoperability, Substrate enables the creation of a diverse, interconnected ecosystem of blockchains. This aligns with the vision of a multi-chain future, where different blockchains can work together to provide a richer, more capable blockchain environment.  

Moonbeam's networks have a series of XCM connections with many other parachains. You can view upcoming XCM integrations in the [XCM section of the Moonbeam forum](https://forum.moonbeam.foundation/c/xcm-hrmp/13/){target=\_blank}.