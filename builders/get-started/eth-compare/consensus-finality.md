---
title: Consensus & Finality
description: The main differences that Ethereum developers should understand in terms of consensus and finality on Moonbeam and how it differs from Ethereum.
---

# Moonbeam Consensus & Finality

![Moonbeam v Ethereum - Consensus and Finality Banner](/images/builders/get-started/eth-compare/consensus-finality-banner.png)

## Introduction {: #introduction }

While Moonbeam strives to be compatible with Ethereum's Web3 API and EVM, there are some important Moonbeam differences that developers should know and understand in terms of consensus and finality.

In short, consensus is a way for different parties to agree on a shared state. As blocks are created, nodes in the network must decide which block will represent the next valid state. Finality defines when that valid state cannot be altered or reversed.

At the time of writing, Ethereum uses a consensus protocol based on [Proof-of-Work (PoW)](https://ethereum.org/en/developers/docs/consensus-mechanisms/pow/){target=_blank}, which provides probabilistic finality. In contrast, Moonbeam uses a hybrid consensus protocol based on Delegated Proof-of-Stake (DPoS), which provides deterministic finality. DPoS is an evolution of Polkadot's [Nominated Proof of Stake (NPoS)](https://wiki.polkadot.network/docs/learn-consensus){target=_blank} concept, that puts more power into the hands of token holders by allowing delegators to choose which collator candidate they want to support and in what magnitude.

This guide will outline some of these main differences around consensus and finality, and what to expect when using Moonbeam for the first time.

## Ethereum Consensus and Finality {: #ethereum-consensus-and-finality }

As stated before, Ethereum is currently using a PoW consensus protocol and the longest chain rule, where finality is probabilistic. 

Probabilistic finality means that the probability that a block (and all its transactions) will not be reverted increases as more blocks are built on top of it. Therefore, the higher the number of blocks you wait, the higher the certainty that a transaction will not be re-organized, and consequently reverted. As suggested in [this blog on finality](https://blog.ethereum.org/2016/05/09/on-settlement-finality/){target=blank} by Vitalik, _"you can wait 13 confirmations for a one-in-a-million chance of the attacker succeeding."_

## Moonbeam Consensus and Finality {: #moonbeam-consensus-and-finality }

In Polkadot, there are collators and validators. [Collators](https://wiki.polkadot.network/docs/en/learn-collator){target=_blank} maintain parachains (in this case, Moonbeam) by collecting transactions from users and producing state transition proofs for the relay chain [validators](https://wiki.polkadot.network/docs/en/learn-validator){target=_blank}. The collator set (nodes that produce blocks) are selected based on the [stake they have in the network](/learn/features/consensus/){target=_blank}. 

For finality, Polkadot/Kusama rely on [GRANDPA](https://wiki.polkadot.network/docs/learn-consensus#finality-gadget-grandpa){target=_blank}. GRANDPA provides deterministic finality for any given transaction (block). In other words, when a block/transaction is marked as final, it can't be reverted except via on-chain governance or forking. Moonbeam follows this deterministic finality.

## Main Differences {: #main-differences }

In terms of consensus, Moonbeam is based on Delegated Proof-of-Stake, while Ethereum relies on Proof-of-Work, which are very different. Consequently, Proof of Work concepts, such as  `difficulty`, `uncles`, `hashrate`, generally don’t have meaning within Moonbeam.

For APIs that return values related to Ethereum’s Proof of Work, default values are returned. Existing Ethereum contracts that rely on Proof of Work internals (e.g., mining pool contracts) will almost certainly not work as expected on Moonbeam.

However, the deterministic finality of Moonbeam can be used to provide a better user experience than is currently possible in Ethereum. The strategy to check for transaction finality is fairly simple:

 1. You ask the network for the hash of the latest finalized block
 2. You retrieve the block number using the hash
 3. You compare it with the block number of your transaction. If your transaction was included in a previous block, it is finalized
 4. As as safety check, retrieve the block by number, and verify that the given transaction hash is in the block

The following sections outline how you can check for transaction finality using both the Ethereum JSON-RPC (custom Web3 request) and the Substrate (Polkadot) JSON-RPC.

## Checking Tx Finality with Moonbeam RPC Endpoints {: #checking-tx-finality-with-moonbeam-rpc-endpoints }

Moonbeam has added support for two custom RPC endpoints, `moon_isBlockFinalized` and `moon_isTxFinalized`, that can be used to check whether an on-chain event is finalized. 

For more information you can go to the [Finality RPC Endpoints](/builders/build/moonbeam-custom-api#finality-rpc-endpoints){target=_blank} section of the Moonbeam Custom API page.


## Checking Tx Finality with Ethereum Libraries {: #checking-tx-finality-with-ethereum-libraries }

You can make calls to the Substrate JSON-RPC using the `send` method of both [Web3.js](https://web3js.readthedocs.io/){target=_blank} and [Ethers.js](https://docs.ethers.io/){target=_blank}. Custom RPC requests are also possible using [Web3.py](https://web3py.readthedocs.io/){target=_blank} with the `make_request` method. You can use the Web3.js example as a baseline.

The code snippets rely on two custom RPC requests from the Substrate JSON-RPC: `chain_getFinalizedHead` and `chain_getHeader`. The first request gets the block hash of the last finalized block. The second request gets the block header for a given block hash. The same is true for `eth_getBlockByNumber` and `eth_getTransactionReceipt`, to check if the given transaction hash is included in the block.

--8<-- 'text/common/endpoint-examples.md'

!!! note
    The code snippets presented in the following sections are not meant for production environments. Please make sure you adapt it for each use-case.

=== "web3.js"
    --8<-- 'code/vs-ethereum/web3.md'

=== "ethers.js"
    --8<-- 'code/vs-ethereum/ethers.md'

=== "web3.py"
    --8<-- 'code/vs-ethereum/web3py.md'

## Checking Tx Finality with Substrate Libraries {: #checking-tx-finality-with-substrate-libraries }

The [Polkadot.js API package](https://polkadot.js.org/docs/api/start){target=_blank} and [Python Substrate Interface package](https://github.com/polkascan/py-substrate-interface){target=_blank} provides developers a way to interact with Substrate chains using JavaScript and Python.

Given a transaction hash (`tx_hash`), the following code snippets fetch the current finalized block and compare it with the block number of the transaction you've provided. The code relies on three RPC requests from the Substrate JSON-RPC: 

- `chain_getFinalizedHead` - the first request gets the block hash of the last finalized block
- `chain_getHeader` - the second request gets the block header for a given block hash
- `eth_getTransactionReceipt` - this retrieves the ETH transaction receipt given the transaction hash.

You can find more information about Polkadot.js and the Substrate JSON RPC in their [official documentation site](https://polkadot.js.org/docs/substrate/rpc){target=_blank}, and more about Python Substrate Interface in their [official documentation site](https://polkascan.github.io/py-substrate-interface/){target=_blank}.

=== "Polkadot.js"
    --8<-- 'code/vs-ethereum/polkadotjs.md'

=== "py-substrate-interface"
    --8<-- 'code/vs-ethereum/pysubstrateinterface.md'
