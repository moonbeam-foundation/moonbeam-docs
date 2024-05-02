---
title: Glossary
description: We've compiled a glossary of terms related to Polkadot that'll make it easier to learn more about the ecosystem.
---

# Glossary

There's a great deal of terminology that's specific to Polkadot, Substrate, and the emerging Parity/Web3 ecosystem. We've compiled a list of terms we think you'll want to know as you review the Moonbeam documentation, plans, and tutorials.

### Collators {: #collators }

One of the key network participants needed to support parachains within the Polkadot Network.  In Moonbeam, collators are the nodes that are responsible for block production and for submitting produced blocks up to the Polkadot relay chain for finalization.

### Delegators {: #delegators }

Moonbeam token holders who stake tokens, vouching for specific collator candidates on the parachain. Any user that holds a minimum amount of tokens as [free balance](https://wiki.polkadot.network/docs/learn-accounts#balance-types/){target=\_blank} can become a delegator by staking their tokens.

### Nominators {: #nominators }

Relay chain token holders who select to "back" a validator. They can receive part of the validator's reward, but are subject to slashing of their staked tokens in case the validator misbehaves. A nominator can back up to 16 validators, and their bond is fully distributed between the backed validators that were selected for the validator set.

### Nominated Proof of Stake {: #nominated-proof-of-stake }

The mechanism used by Polkadot for selecting its block validator set to maximize chain security. At its core, it is a Proof-of-Stake system (PoS) in which nominators back validators. The latter with the highest backing are selected to be part of the validator set for a session. The stake of a validator is slashed in case of misbehavior. Thus, nominators are expected to do due diligence on the validators they nominate.

### Parachains {: #parachains }

A blockchain which has a slot and is connected to Polkadot.  Parachains receive shared security from Polkadot and the ability to interact with other parachains on the Polkadot network. They must lock DOT, the native relay chain token, to secure a slot for a specific period (up two years).

### Parathreads {: #parathreads }

A blockchain which can connect to Polkadot.  Parathreads are able to interact with other members of the Polkadot network, but they bid for block finalization (in DOT) on a block-to-block basis. They compete with other parathreads for block finalization, meaning that the block with the highest bid is selected to be finalize in that round.

### Polkadot {: #polkadot }

A network of connected blockchains that provides shared security and the ability to interact between chains.  Polkadot is built using the Substrate development framework.  Chains that connect to Polkadot are called parachains.

### Relay Chain {: #relay-chain }

The backbone blockchain supporting the Polkadot network.  Parachains connect to the relay Chain and use it for shared security and message passing.  Validators on the relay Chain help secure the parachains.

### Smart Contract {: #smart-contract }

A smart contract is a computer program or a transaction protocol that is intended to automatically execute, control, or document legally relevant events and actions according to the terms of a contract or an agreement. Smart contracts intend to reduce the need for trusted intermediators, arbitrations, and enforcement costs, as well as reduce fraud losses and malicious and accidental exceptions. [Learn more](https://en.wikipedia.org/wiki/Smart_contract/){target=\_blank}.

### Substrate {: #substrate }

A Rust-based blockchain development framework created by Parity Technologies based on their experience implementing multiple blockchain clients.  Substrate comes with many modules and functionalities that are needed when building a blockchain, including P2P networking, consensus mechanisms, staking, cryptocurrency, on-chain governance modules, and more.  It dramatically reduces the time and engineering effort required to implement a blockchain.

### Substrate Frame Pallets {: #substrate-frame-pallets }

Substrate Frame Pallets are a collection of Rust-based modules, providing the functionality required for building a blockchain.  

### Validators {: #validators }

A node that secures the Polkadot relay Chain by staking DOT in the network, which is slashed if they misbehave. They finalize blocks from collators on parachains and also participate on consensus for the next relay Chain block with other validators.

### WebAssembly/Wasm {: #webassemblywasm }

WebAssembly is an open standard that defines a portable binary code format. It is supported by different programming languages, compilers, and browsers.
