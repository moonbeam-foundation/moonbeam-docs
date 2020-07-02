---
title: Technology
description: An overview of the technology used in Moonbeam
---

#Technology
Moonbeam is a smart contract blockchain platform built in the Rust programming language using the Substrate framework.  Rust is a good language for implementing a Blockchain as it is highly performant like C and C++, but has built in memory safety features enforced at compile time which prevents many common bugs and security issues that can arise from C and C++ implementations.  Substrate provides a rich set of tools for creating blockchains including a runtime execution environment that enables a generic state transition function, and a pluggable set of modules providing implementations of various blockchain subsystems.

Moonbeam leverages multiple existing Substrate frame pallets to provide key blockchain services and functionality, including core blockchain data structures, peer to peer networking, consensus mechanisms, accounts, assets, and balances.  Custom pallets and logic in the runtime implement Moonbeam-specific behavior and functionality such as cross chain token integration.  For leveraged pallets, Moonbeam will strive to stay as close as possible to the upstream Substrate codebase and incorporate Substrate bug fixes, enhancements, and new features on an ongoing basis.

##Blockchain Runtime
The core Moonbeam runtime specifies the state transition function and behavior of the Moonbeam blockchain.  The runtime uses Substrate Frame, Frame Pallets, and custom modules that are compiled to Web-Assembly (Wasm), and native binaries.  These compiled versions will be executed in the Polkadot Relay Chain and Moonbeam node environments.  Substrate Frame Pallets are a collection of Rust based modules providing functionality required when building a blockchain.  Web-Assembly is an open standard that defines a portable binary code format. It is supported by different programming languages, compilers, and browsers.

Some of the key Substrate Frame Pallets used in the Moonbeam runtime include:

* Balances -  Support for accounts, balances, and transfers.
* EVM - Full Rust based EVM implementation based on SputnikVM.  Provides the state transition logic for Moonbeam based smart contracts.
* Ethereum - Provides emulation of Ethereum block processing for the EVM.
* RPC-Ethereum - Web3 RPC implementation in Substrate.
* Council - Includes governance mechanics around the council and proposals.
* Democracy - Functionality for public stake weighted token holder voting.
* Executive - Orchestration layer that dispatches calls to other runtime modules.
* Indices - Support for user friendly short names for account addresses.
* System - Provides low-level types, storage, and blockchain functions.
* Treasury - On chain treasury that can be used to fund public goods such as a parachain slot.

Moonbeam also uses the Cumulus library to provide integration to the Polkadot relay chain.

In addition to these Substrate Frame Pallets, we will be implementing modules that implement Moonbeam specific functionality including collator mechanics and rewards, and other developer building blocks.

##Ethereum Compatibility Architecture
Smart contracts on Moonbeam can be implemented using Solidity, Vyper, and any other language which can compile smart contracts to EVM compatible bytecode.  Moonbean aims to provide a low-friction and secure environment for the development, testing, and execution of smart contracts that is compatible with the existing Ethereum developer toolchain.  The execution behavior and semantics of Moonbeam based smart contracts will strive to be as close to Ethereum version 1 as possible.  Moonbeam is a single shard, so cross contract calls have the same synchronous execution semantics as on Ethereum version 1.

![Interaction Diagram](/images/interaction-diagram.png)

A high level interaction flow is shown above.  A Web3 RPC call from a DApp or existing Ethereum developer tool such as Truffle are received by a Moonbeam node.  The node will have both Web3 RPCs and Substrate RPCs available meaning that you can use Ethereum or Substrate tools when interacting with a Moonbeam node.  These RPC calls are handled by associated Substrate runtime functions.  The Substrate runtime checks signatures and handles any extrinsics.  Smart contract calls are ultimately passed to the EVM to execute the state transitions.

By basing our EVM implementation on Pallet-EVM, which in turn is based on SputnikVM, we get a full EVM implementation that is currently in use in Ethereum Classic.

Some key differences between Moonbeam and Ethereum include the consensus mechanism.  Moonbeam uses a Proof of Stake based approach used by Polkadot parachains, where Moonbeam nodes will be responsible for block production and offering blocks up to the Relay Chain as Collators for finalization.  This means that anything related to Ethereum’s proof of work consensus mechanism is unlikely to make sense in the context of Moonbeam.  This includes concepts like difficulty, uncles, hashrate, etc.  In many cases APIs that query for these values, which are needed to provide Web3 API completeness, will always return default values.  This also means that there are existing smart contracts which will not work the same on Moonbeam.  Notably, anything that relies on these Ethereum consensus internals, such as mining pool contracts.

##Cross-Chain Integration Plans
One of the key planned features of Moonbeam is providing an easy way for developers to use smart contracts to integrate with other chains in the Polkadot ecosystem.  Polkadot defines a low-level integration protocol that can be used to facilitate communication between parachains within the Polkadot network called Cross-chain Message Passing (XCMP), and a way to share trusted logic between chains on the Polkadot network called Shared Protected Runtime Execution Enclaves (SPREE).  Parity is in the process of implementing XCMP and is in the design phase of SPREE as of the writing of this document (July 2020).  Post Polkadot mainnet launch, XCMP and SPREE support will be released as upgrades to the Polkadot relay chain.  We plan to implement and support integration scenarios based on these protocols when they are available.

The initial scenario we are most interested in will be to allow for the movement of tokens from other chains into Moonbeam-based tokens, such that they can be used within DeFi and other applications on the platform.  Once their work is done, these assets can then move back or out to other chains.

As the integration features of the Polkadot network evolve, we will provide ways for developers to access those integrations from smart contracts and to compose features across chains in Moonbeam smart contracts.  

To provide an analogy, we think of Polkadot as something like Linux.  Both are developer oriented platforms that come with libraries that make building applications easier.  Recall the old Unix philosophy where you build tools that do one job and do it well.  This is something similar to the specialization that we expect to happen for parachains on Polkadot.  On Linux you can combine and compose these purpose built tools together to achieve higher order effects using a shell like bash.  We hope that Moonbeam based smart contracts can provide an analogous “bash-like” environment where specialized smart contracts and parachain functionality can be composed to achieve higher order goals.  It may be the case that projects start as one or more Moonbeam smart contracts and migrate over time to be “native applications,” which could be parathreads or parachains in the Polkadot context, if they need more performance or more direct control over their economies.

###Ethereum Integration Plans
Connectivity to Ethereum is an important capability needed for Moonbeam to be able to support Ethereum based projects, particularly in hybrid deployments where projects are simultaneously deployed to Ethereum and Moonbeam.  There is at least one project independent of Moonbeam to build a parachain based Ethereum bridge that is under development.  Once this bridge is operational it will provide a mechanism for moving tokens, state, and messages to and from Ethereum leveraging Polkadot.

Until there is a parachain based bridge in production, we plan to provide 2 solutions for projects that want to integrate Ethereum and Moonbeam.  The first is a utility that can export state from Ethereum into a binary file, where this binary file can be used to import that state into Moonbeam.  Each use of this utility would be a one time, one way migration.

The second is an integrated point-to-point Ethereum bridge directly incorporated into Moonbeam.  This bridge would allow for token movement and cross chain state queries and messages.  As the Polkadot ecosystem develops we expect multiple Ethereum integration options as choices for projects deploying to Moonbeam.
