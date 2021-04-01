---
title: Eth Compatibility
description: It can seem daunting to move to a Polkadot parachain if you’re used to Ethereum. Here’s what to expect when using Moonbeam for the first time.
---

# Ethereum Compatibility

## Differences Between Moonbeam and Ethereum

While Moonbeam strives to be compatible with Ethereum’s Web3 API and EVM, there are a number of important Moonbeam differences.

First, Moonbeam uses a Proof of Stake-based consensus mechanism, which means that Proof of Work concepts, such as difficulty, uncles, hashrate, etc., generally don’t have meaning within Moonbeam.  For APIs that return values related to Ethereum’s Proof of Work, we return default values.  Existing Ethereum contracts that rely on Proof of Work internals (e.g., mining pool contracts) will almost certainly not work as expected on Moonbeam.

Another significant difference between Moonbeam and Ethereum is that Moonbeam includes an extensive set of on-chain governance features based on Substrate functionality.  These onchain governance modules include functionality to power upgrades to the blockchain itself based on token weighted voting.

## What Stays the Same

If you're moving portions of your existing workloads and state off of Ethereum Layer 1 to Moonbeam, you can expect minimal required changes (aside from the exceptions noted above). Your applications, contracts, and tools will largely remain unchanged.

Moonbeam supports:

 - **Solidity-Based Smart Contracts**
 - **Ecosystem Tools** (e.g., block explorers, front-end development libraries, wallets)
 - **Development Tools** (e.g., Truffle, Remix, MetaMask)
 - **Ethereum Tokens via Bridges** (e.g., token movement, state visibility, message passing)
