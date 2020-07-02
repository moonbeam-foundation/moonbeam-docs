---
title: Eth Compatibility
description: Known differences and compatibility issues between Ethereum and Moonbeam
---

#Eth Compatibility: What are the Differences Between Moonbeam and Ethereum?
While Moonbeam strives to be compatible with Ethereum’s Web3 API and EVM, there are a number of important Moonbeam differences.  Moonbeam uses a Proof of Stake based consensus mechanism, which means that Proof of Work concepts such as difficulty, uncles, hashrate, etc generally don’t have meaning within Moonbeam.  For APIs that return values related to Ethereum’s Proof of Work, we return default values.  Existing Ethereum contracts that rely on Proof of Work internals (e.g. Mining Pool contracts) will almost certainly not work as expected on Moonbeam.

Another significant difference between Moonbeam and Ethereum is that Moonbeam includes an extensive set of on-chain governance features based on Substrate functionality.  These onchain governance modules include functionality to power upgrades to the blockchain itself based on token weighted voting.

