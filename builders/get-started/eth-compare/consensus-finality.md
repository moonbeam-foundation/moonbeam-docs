---
title: Consensus & Finality
description: A description of the main differences that Ethereum developers need to understand in terms of consensus and finality on Moonbeam.
---

![Moonbeam v Ethereum - Consensus and Finality Banner](/images/builders/get-started/eth-compare/consensus-finality-banner.png)

## Introduction {: #introduction }

While Moonbeam strives to be compatible with Ethereum's Web3 API and EVM, there are some important Moonbeam differences that developers should know and understand in terms of consensus and finality.

In short, consensus is a way for different parties to agree on a shared state. As blocks are created, nodes in the network must decide which block will represent the next valid state. Finality defines when that valid state cannot be altered or reversed.

At the time of writing, Ethereum uses a consensus protocol based on [Proof-of-Work (PoW)](https://ethereum.org/en/developers/docs/consensus-mechanisms/pow/), which provides probabilistic finality. In contrast, Moonbeam uses a hybrid consensus protocol based on Delegated Proof-of-Stake (DPoS), which provides deterministic finality. DPoS is an evolution of Polkadot's [Nominated Proof of Stake (NPoS)](https://wiki.polkadot.network/docs/learn-consensus) concept, that puts more power into the hands of token holders by allowing delegators to choose which collator candidate they want to support and in what magnitude.

This guide will outline some of these main differences around consensus and finality, and what to expect when using Moonbeam for the first time.

## Ethereum Consensus and Finality {: #ethereum-consensus-and-finality }

As stated before, Ethereum is currently using a PoW consensus protocol and the longest chain rule, where finality is probabilistic. 

Probabilistic finality means that the probability that a block (and all its transactions) will not be reverted increases as more blocks are built on top of it. Therefore, the higher the number of blocks you wait, the higher the certainty that a transaction will not be re-organized, and consequently reverted. As suggested by [this blog on finality](https://blog.ethereum.org/2016/05/09/on-settlement-finality/) by Vitalik, _"you can wait 13 confirmations for a one-in-a-million chance of the attacker succeeding."_

## Moonbeam Consensus and Finality {: #moonbeam-consensus-and-finality }

In Polkadot, there are collators and validators. [Collators](https://wiki.polkadot.network/docs/en/learn-collator) maintain parachains (in this case, Moonbeam) by collecting transactions from users and producing state transition proofs for the Relay Chain [validators](https://wiki.polkadot.network/docs/en/learn-validator). The collator set (nodes that produce blocks) are selected based on the [stake they have in the network](/learn/features/consensus/). 

For finality, Polkadot/Kusama rely on [GRANDPA](https://wiki.polkadot.network/docs/learn-consensus#finality-gadget-grandpa). GRANDPA provides deterministic finality for any given transaction (block). In other words, when a block/transaction is marked as final, it can't be reverted except via on-chain governance or forking. Moonbeam follows this deterministic finality.

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

Moonbeam has added support for two new RPC endpoints, `moon_isBlockFinalized` and `moon_isTxFinalized` to the Moonbeam node, that are useful for checking whether an on-chain event is finalized. The information on these two endpoints are as follows:

=== "moon_isBlockFinalized"
    |   Variable   |                                      Value                                       |
    |:------------:|:--------------------------------------------------------------------------------|
    |   Endpoint |                        `moon_isBlockFinalized`                     |
    |   Description   | Check for the finality of the block given by its block hash |
    |  Parameters |    `block_hash`: **STRING** The hash of the block, accepts either Substrate-style or ethereum-style block hash as its input                     | 
    |  Returns | `result`: **BOOLEAN** Returns `true` if the block is finalized, `false` if the block is not finalized or not found  | 

=== "moon_isTxFinalized"
    |   Variable   |                                      Value                                       |
    |:------------:|:--------------------------------------------------------------------------------|
    |   Endpoint |                        `moon_isTxFinalized`                     |
    |   Description   | Check for the finality of the transaction given by its EVM tx hash |
    |  Parameters | `tx_hash`: **STRING** The EVM tx hash of the transaction  | 
    |  Returns |  `result`: **BOOLEAN** Returns `true` if the tx is finalized; `false` if the tx is not finalized or not found | 

You can try out these endpoints with the following curl examples. These examples query the public RPC endpoint of Moonbase Alpha, but they can be modified to use with Moonbeam and Moonriver by changing the URL of the RPC endpoint to the corresponding [endpoints](https://docs.moonbeam.network/builders/get-started/endpoints/){target=_blank}. 

=== "moon_isBlockFinalized"
    ```
    curl -H "Content-Type: application/json" -X POST --data 
        '[{
            "jsonrpc":"2.0",
            "id":"1",
            "method":"moon_isBlockFinalized",
            "params":["Put-Block-Hash-Here"
        ]}]' 
        https://rpc.api.moonbase.moonbeam.network
    ```

=== "moon_isTxFinalized"
    ```
    curl -H "Content-Type: application/json" -X POST --data 
        '[{
            "jsonrpc":"2.0",
            "id":"1",
            "method":"moon_isTxFinalized",
            "params":["Put-Tx-Hash-Here"
        ]}]' 
        https://rpc.api.moonbase.moonbeam.network
    ```


## Checking Tx Finality with Ethereum Libraries {: #checking-tx-finality-with-ethereum-libraries }

You can make calls to the Substrate JSON-RPC using the `send` method of both [Web3.js](https://web3js.readthedocs.io/) and [Ethers.js](https://docs.ethers.io/). Custom RPC requests are also possible using [Web3.py](https://web3py.readthedocs.io/) with the `make_request` method. You can use the Web3.js example as a baseline.

The code snippets rely on two custom RPC requests from the Substrate JSON-RPC: `chain_getFinalizedHead` and `chain_getHeader`. The first request gets the block hash of the last finalized block. The second request gets the block header for a given block hash. The same is true for `eth_getBlockByNumber` and `eth_getTransactionReceipt`, to check if the given transaction hash is included in the block.

!!! note
    The code snippets presented in the following sections are not meant for production environments. Please make sure you adapt it for each use-case.

=== "web3.js"
    --8<-- 'code/vs-ethereum/web3.md'

=== "ethers.js"
    --8<-- 'code/vs-ethereum/ethers.md'

=== "web3.py"
    --8<-- 'code/vs-ethereum/web3py.md'

## Checking Tx Finality with Substrate Libraries {: #checking-tx-finality-with-substrate-libraries }

The [Polkadot.js API package](https://polkadot.js.org/docs/api/start) and [Python Substrate Interface package](https://github.com/polkascan/py-substrate-interface) provides developers a way to interact with Substrate chains using Javascript and Python.

Given a transaction hash (`tx_hash`), the following code snippets fetch the current finalized block and compare it with the block number of the transaction you've provided. The code relies on three RPC requests from the Substrate JSON-RPC: `chain_getFinalizedHead`, `chain_getHeader` and `eth_getTransactionReceipt`. The first request gets the block hash of the last finalized block. The second request gets the block header for a given block hash. The third request is fairly similar to the Ethereum JSON-RPC method, but it is done directly via the Substrate metadata.

You can find more information about Polkadot.js and the Substrate JSON RPC in their [official documentation site](https://polkadot.js.org/docs/substrate/rpc), and more about Python Substrate Interface in their [official documentation site](https://polkascan.github.io/py-substrate-interface/).

=== "Polkadot.js"
    --8<-- 'code/vs-ethereum/polkadotjs.md'

=== "py-substrate-interface"
    --8<-- 'code/vs-ethereum/pysubstrateinterface.md'
