---
title: Consensus & Finality
description: A description of the main differences that Ethereum developers need to understand in terms of consensus and finality on Moonbeam.
---

## Introduction

While Moonbeam strives to be compatible with Ethereum's Web3 API and EVM, there are some important Moonbeam differences that developers should know and understand in terms of consensus and finality.

In short, consensus is a way for different parties to agree on a shared state. As blocks are created, nodes in the network must decide which block will represent the next valid state. Finality defines when that valid state cannot be altered or reversed.

At the time of writing, Ethereum uses a consensus protocol based on [Proof-of-Work (PoW)](https://ethereum.org/en/developers/docs/consensus-mechanisms/pow/), which provides probabilistic finality. On the contrary, Moonbeam uses a hybrid consensus protocol based on [Nominated Proof-of-Stake (NPoS)](https://wiki.polkadot.network/docs/learn-consensus), which provides deterministic finality.

This guide will outline some of these main differences around consensus and finality, and what to expect when using Moonbeam for the first time.

## Ethereum Consensus and Finality

As stated before, Ethereum is currently using a PoW consensus protocol and the longest chain rule, where finality is probabilistic. 

Probabilistic finality means that the probability that a block (and all its transactions) will not be reverted increases as more blocks are built on top of it. Therefore, the higher the number of blocks you wait, the higher the certainty that a transaction will not be re-organized, and consequently reverted. As suggested by [this blog on finality](https://blog.ethereum.org/2016/05/09/on-settlement-finality/) by Vitalik, _"you can wait 13 confirmations for a one-in-a-million chance of the attacker succeeding."_

## Moonbeam Consensus and Finality

In Polkadot, there are collators and validators. [Collators](https://wiki.polkadot.network/docs/en/learn-collator) maintain parachains (in this case, Moonbeam) by collecting transactions from users and producing state transition proofs for the Relay Chain [validators](https://wiki.polkadot.network/docs/en/learn-validator). The collators set (nodes that produce blocks) are selected based on the [stake they have in the network](/learn/features/consensus/). 

For finality, Polkadot/Kusama rely on [GRANDPA](https://wiki.polkadot.network/docs/learn-consensus#finality-gadget-grandpa). GRANDPA provides deterministic finality for any given transaction (block). In other terms, when a block/transaction is marked as final, it can't be reverted except via on-chain governance or forking. Moonbeam follows this deterministic finality.

## Main Differences

In terms of consensus, Moonbeam is based on Nominated Proof-of-Stake, while Ethereum relies on Proof-of-Work, which are very different. Consequently, Proof of Work concepts, such as  `difficulty`, `uncles`, `hashrate`, generally don’t have meaning within Moonbeam.

For APIs that return values related to Ethereum’s Proof of Work, default values are returned. Existing Ethereum contracts that rely on Proof of Work internals (e.g., mining pool contracts) will almost certainly not work as expected on Moonbeam.

In terms of finality, on Moonbeam, you can check when a transaction is finalized, meaning that it can't be reverted. The strategy is fairly simple: 
 1. You ask the network the hash of the latest finalized block
 2. You retrieve the block number using the hash
 3. You compare it with the block number of your transaction. If your transaction was included in a previous block, it is finalized

The following sections outline how you can check for transaction finality using both the Ethereum JSON-RPC (custom Web3 request) and the Substrate (Polkadot) JSON-RPC.

## Checking Tx Finality with Ethereum Libraries

You can make calls to the Substrate JSON-RPC using the `send` method of both [Web3.js](https://web3js.readthedocs.io/) and [Ethers.js](https://docs.ethers.io/).

Custom RPC requests are also possible using [Web3.py](https://web3py.readthedocs.io/) with the `make_request` method. You can use the Web3.js example as a baseline.

!!! note
    The code snippets presented in the following sections are not meant for production environments. Please make sure you adapt it for each use-case.

### Custom RPC Requests with Web3.js

With [Web3.js](https://web3js.readthedocs.io/), you can make custom RPC requests with the `web3.currentProvider.send()` method. However, at the time of writing, this was not in the official Web3.js documentation.

Given a transaction hash (`tx_hash`), the following code snippet uses Web3.js to fetch the current finalized block and compare it with the block number of the transaction you've provided. 

The code relies on two custom RPC requests from the Substrate JSON-RPC: `chain_getFinalizedHead` and `chain_getHeader`. The first request gets the block hash of the last finalized block. The second request gets the block header for a given block hash. It also uses the same custom RPC function for `eth_getTransactionReceipt`, but this can be modified to use the regular `web3.eth.getTransactionReceipt(hash)` method.

--8<-- 'code/vs-ethereum/web3.md'

### Custom RPC Requests with Ethers.js

With [Ethers.js](https://docs.ethers.io/), you can make custom RPC requests with the `JsonRpcProvider` web3 provider. This will enable the `web3Provider.send()` method, as detailed in their [documentation site](https://docs.ethers.io/v5/api/providers/jsonrpc-provider/#JsonRpcProvider-send).

Given a transaction hash (`tx_hash`), the following code snippet uses Ethers.js to fetch the current finalized block and compare it with the block number of the transaction you've provided. 

The code relies on two custom RPC requests from the Substrate JSON-RPC: `chain_getFinalizedHead` and `chain_getHeader`. The first request gets the block hash of the last finalized block. The second request gets the block header for a given block hash. It also uses the same custom RPC function for `eth_getTransactionReceipt`, but this can be modified to use the regular `web3Provider.getTransactionReceipt(hash)` method.

--8<-- 'code/vs-ethereum/ethers.md'

<!---
### Custom RPC Requests with Web3.py

With [Web3.py](https://web3py.readthedocs.io/en/stable/), you can make custom RPC requests with the `JSONBaseProvider()` web3 provider. This will enable the `encode_rpc_request` and `decode_rpc_response` methods. However, at the time of writing, this was not in the official Web3.py documentation.

Given a transaction hash (`tx_hash`), the following code snippet uses Web3.py to fetch the current finalized block and compare it with the block number of the transaction you've provided. 

The code asynchronously calls two custom RPC requests from the Substrate JSON-RPC: `chain_getFinalizedHead` and `chain_getHeader`. The first request gets the block hash of the last finalized block. The second request gets the block header for a given block hash. It uses the built-in `web3.eth.getTransactionReceipt` method for retrieving the transaction receipt.

--8<-- 'code/vs-ethereum/web3py.md'
-->

## Checking Tx Finality with Polkadot.js

The [Polkadot.js API package](https://polkadot.js.org/docs/api/start) provides developers a way to interact with Substrate chains using Javascript.

Given a transaction hash (`tx_hash`), the following code snippet uses Polkadot.js to fetch the current finalized block and compare it with the block number of the transaction you've provided. You can find all the available information about Polkadot.js and the Substrate JSON RPC in their [official documentation site](https://polkadot.js.org/docs/substrate/rpc).

The code relies on three RPC requests from the Substrate JSON-RPC: `chain_getFinalizedHead`, `chain_getHeader` and `eth_getTransactionReceipt`. The first request gets the block hash of the last finalized block. The second request gets the block header for a given block hash. The third request is fairly similar to the Ethereum JSON-RPC method, but it is done directly via the Substrate metadata.

--8<-- 'code/vs-ethereum/polkadotjs.md'
