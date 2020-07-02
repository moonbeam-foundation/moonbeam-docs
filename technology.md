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

![Interaction Diagram](/images/technology-diagram.png)

A high level interaction flow is shown above.  A Web3 RPC call from a DApp or existing Ethereum developer tool such as Truffle are received by a Moonbeam node.  The node will have both Web3 RPCs and Substrate RPCs available meaning that you can use Ethereum or Substrate tools when interacting with a Moonbeam node.  These RPC calls are handled by associated Substrate runtime functions.  The Substrate runtime checks signatures and handles any extrinsics.  Smart contract calls are ultimately passed to the EVM to execute the state transitions.

By basing our EVM implementation on Pallet-EVM, which in turn is based on SputnikVM, we get a full EVM implementation that is currently in use in Ethereum Classic.

