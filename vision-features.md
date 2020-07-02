---
title: Vision
description: The vision for Moonbeam, the audiences we are targetting, and key features
---

#Moonbeam Vision

We believe that the future will have many chains and there will be many users and assets on those chains.  In this context, Moonbeam is a smart contract platform that provides an Ethereum compatible environment for building decentralized applications that target the assets and users on these chains.

Existing Smart Contract platforms are designed to service the users and assets on a specific chain.  Moonbeam aims to provide cross chain smart contract functionality to allow developers to shift existing workloads and logic to Moonbeam, and to extend the reach of their applications to users and assets on other chains.  The way we facilitate cross chain integration is through being a parachain on the Polkadot network.  The Polkadot network provides integration and connectivity between parachains that are connected to the network, and to other non-Polkadot based chains such as Ethereum and Bitcoin via bridges.

There are three main audiences we are building for:
* Existing Ethereum based projects where we can help them with cost and scalability challenges they are facing.  Moonbeam helps existing projects by offering the ability to move portions of their existing workloads and state off Ethereum layer 1. The platform supports a hybrid approach where applications live on both Ethereum and Moonbeam simultaneously.  Moonbeam minimizes required change to existing applications and extends their reach to the Polkadot network and chains connected to Polkadot.
* Polkadot ecosystem projects that need Smart Contract functionality to augment their existing parachains and parathreads.  In particular, any scenario where functionality is needed that is not included on the main Polkadot Relay Chain.  An example of this would be a place where teams can crowdfund their projects, implement lockdrops, and other more complex financial transactions than are provided by base Substrate functionality.  We provide the option for these builders to leverage the mature and extensive Ethereum development toolchain to meet their goals.
* New developers that want to leverage the specialized functionality from Polkadot parachains and reach users and assets on other chains.  In order to compose functionality from Polkadot parachains, Moonbeam will act as a lightweight integration layer that aggregates network services before presenting them to end users.  Implementing a composed service using pre-built integrations on a smart contract platform will be a lot faster and easier in many cases than building a full substrate runtime and performing the integrations yourself in the runtime.

Moonbeam achieves these goals with the following key features:

* It is decentralized and permissionless — a base requirement for censorship resistance and to support many existing and future DApp use cases.
* It contains a full EVM implementation so existing Solidity based Smart Contracts can be migrated with minimal change and with expected execution results.
* It implements the Web3 RPC API so that existing DApp front ends can be migrated with minimal change required, and so that existing Ethereum based tools such as Truffle, Remix, and Metamask can be used without modification against Moonbeam.
* It is also compatible with the Substrate ecosystem toolset including block explorers, front end development libraries, wallets, giving developers and users the ability to use the right tool for what they are trying to accomplish.
* It features native cross chain integration via the Polkadot network and via token bridges that allows for token movement, state visibility, and message passing with Ethereum and other chains.
* It includes an onchain governance system to allow stakeholders to quickly and forklessly evolve the base protocol based on developer and community needs.

We believe this unique combination of elements fills a strategic market gap, while at the same time positioning Moonbeam to address future developer needs as the Polkadot network grows over time.  Building your own chain with Substrate is powerful but also comes with a number of additional responsibilities such as learning and implementing the chain’s runtime in Rust, creating a token economy, and incentivizing a community of node operators.  For many developers and projects, an Ethereum compatible smart contract based approach will be much simpler and faster to implement.  And by building these smart contracts on Moonbeam, developers can still integrate with other chains and get value from Polkadot based network effects.
