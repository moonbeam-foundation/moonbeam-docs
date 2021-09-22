---
title: RPC Support
description: A description of the main differences that Ethereum developers need to understand in terms of the Ethereum RPC support Moonbeam Provides.
---

## Introduction

While Moonbeam strives to be compatible with Ethereum's Web3 API and EVM, there are some important Moonbeam differences that developers should know and understand in terms of the [Ethereum API JSON-RPC](https://eth.wiki/json-rpc/API#json-rpc-methods) support.

The Moonbeam team has collaborated closely with [Parity](https://www.parity.io/) on developing [Frontier](https://github.com/paritytech/frontier). Frontier is the Ethereum compatibility layer for Substrate based chains, and it is what allows developers to run unmodified Ethereum dApps.

Nevertheless, not all of the Ethereum JSON RPC methods are supported, and some of the supported ones return default values (those related to PoW). This guide will outline some of these main differences around Ethereum RPC support and what to expect when using Moonbeam for the first time.

## Basic Ethereum JSON RPC Methods

At the time of writing, the basic JSON RPC methods from the Ethereum API supported by Moonbeam are:

 - **[eth_protocolVersion](https://eth.wiki/json-rpc/API#eth_protocolversion)** — Returns `1` by default
 - **[eth_syncing](https://eth.wiki/json-rpc/API#eth_syncing)** — Returns an object with data about the sync status or `false`
 - **[eth_hashrate](https://eth.wiki/json-rpc/API#eth_hashrate)** — Returns `"0x0"` by default
 - **[eth_coinbase](https://eth.wiki/json-rpc/API#eth_coinbase)** — Returns the latest block author. Not necessarily a finalized block
 - **[eth_mining](https://eth.wiki/json-rpc/API#eth_mining)** — Returns `false` by default
 - **[eth_chainId](https://eth.wiki/json-rpc/API#eth_chainid)** — Returns the chain ID used for signing at the current block
 - **[eth_gasPrice](https://eth.wiki/json-rpc/API#eth_gasprice)** — Returns the current gas price
 - **[eth_accounts](https://eth.wiki/json-rpc/API#eth_accounts)** — Returns a list of addresses owned by the client
 - **[eth_blockNumber](https://eth.wiki/json-rpc/API#eth_blocknumber)** — Returns the highest available block number
 - **[eth_getBalance](https://eth.wiki/json-rpc/API#eth_getbalance)** — Returns the balance of the given address
 - **[eth_getStorageAt](https://eth.wiki/json-rpc/API#eth_getstorageat)** — Returns content of the storage at a given address
 - **[eth_getBlockByHash](https://eth.wiki/json-rpc/API#eth_getblockbyhash)** — Returns the block of the given hash
 - **[eth_getBlockByNumber](https://eth.wiki/json-rpc/API#eth_getblockbynumber)** — Returns the block of the given block number
 - **[eth_getTransactionCount](https://eth.wiki/json-rpc/API#eth_gettransactioncount)** — Returns the number of transactions sent from the given address (nonce)
 - **[eth_getBlockTransactionCountByHash](https://eth.wiki/json-rpc/API#eth_getblocktransactioncountbyhash)** — Returns the number of transactions in a block with a given block hash
 - **[eth_getBlockTransactionCountByNumber](https://eth.wiki/json-rpc/API#eth_getblocktransactioncountbynumber)** — Returns the number of transactions in a block with a given block number
 - **[eth_getUncleCountByBlockHash](https://eth.wiki/json-rpc/API#eth_getunclecountbyblockhash)** —  Returns `"0x0"` by default
 - **[eth_getUncleCountByBlockNumber](https://eth.wiki/json-rpc/API#eth_getunclecountbyblocknumber)** — Returns `"0x0"` by default
 - **[eth_getCode](https://eth.wiki/json-rpc/API#eth_getcode)** — Returns the code at given address at given block number
 - **[eth_sendTransaction](https://eth.wiki/json-rpc/API#eth_sendtransaction)** — Creates new message call transaction or a contract creation, if the data field contains code. Returns the transaction hash, or the zero hash if the transaction is not yet available
 - **[eth_sendRawTransaction](https://eth.wiki/json-rpc/API#eth_sendrawtransaction)** — Creates new message call transaction or a contract creation for signed transactions. Returns the transaction hash, or the zero hash if the transaction is not yet available
 - **[eth_call](https://eth.wiki/json-rpc/API#eth_call)** — Executes a new message call immediately without creating a transaction on the block chain, returning the value of the executed call
 - **[eth_estimateGas](https://eth.wiki/json-rpc/API#eth_estimategas)** — Returns an esimate amount of how much gas is necessary for a given transaction to succeed
 - **[eth_getTransactionByHash](https://eth.wiki/json-rpc/API#eth_gettransactionbyhash)** — Returns the information about a transation with a given hash
 - **[eth_getTransactionByBlockHashAndIndex](https://eth.wiki/json-rpc/API#eth_gettransactionbyblockhashandindex)** — Returns information about a trasaction at a given block hash, and a given index position
 - **[eth_getTransactionByBlockNumberAndIndex](https://eth.wiki/json-rpc/API#eth_gettransactionbyblocknumberandindex)** — Returns information about a trasaction at a given block number, and a given index position
 - **[eth_getTransactionReceipt](https://eth.wiki/json-rpc/API#eth_gettransactionreceipt)** — Returns the transaction receipt of a given transaction hash
 - **[eth_getUncleByBlockHashAndIndex](https://eth.wiki/json-rpc/API#eth_getunclebyblockhashandindex)** — Returns `"null"` by default
 - **[eth_getUncleByBlockNumberAndIndex](https://eth.wiki/json-rpc/API#eth_getunclebyblocknumberandindex)** — Returns `null` by default
 - **[eth_getLogs](https://eth.wiki/json-rpc/API#eth_getlogs)** — Returns the transaction receipt of a given transaction hash
 - **[eth_getWork](https://eth.wiki/json-rpc/API#eth_getwork)** — Returns `["0x0","0x0","0x0"]` by default
 - **[eth_submitWork](https://eth.wiki/json-rpc/API#eth_submitwork)** — Not supported in Moonbeam
 - **[eth_submitHashrate](https://eth.wiki/json-rpc/API#eth_submithashrate)** — Not supported in Moonbeam

## Filter-related Ethereum JSON RPC Methods

At the time of writing, the filter-related JSON RPC methods from the Ethereum API supported by Moonbeam are:

- **[eth_newFilter](https://eth.wiki/json-rpc/API#eth_newfilter)** — Creates a filter object based on the input provided. Returns a filter ID
 - **[eth_newBlockFilter](https://eth.wiki/json-rpc/API#eth_newblockfilter)** — Creates a filter in the node to notify when a new block arrives. Returns a filter id
 - **[eth_newPendingTransactionFilter](https://eth.wiki/json-rpc/API#eth_newpendingtransactionfilter)** — Creates a filter in the node to notify when a new pending transaction arrives. Returns a filter ID
 - **[eth_getFilterChanges](https://eth.wiki/json-rpc/API#eth_getfilterchanges)** — Polling method for filters (see methods above). Returns an array of logs which occured since last poll
 - **[eth_getFilterLogs](https://eth.wiki/json-rpc/API#eth_getfilterlogs)** — Returns an array of all the logs matching the filter with a given ID
 - **[eth_uninstallFilter](https://eth.wiki/json-rpc/API#eth_uninstallfilter)** — Uninstall a filters with a given ID. Should be used when polling is not longer needed. Filters timeout when they are not requested using `eth_getFilterChanges` after a period of time

## Event Subcription Ethereum JSON RPC Methods

At the time of writing, the [event subscription JSON RPC methods](https://geth.ethereum.org/docs/rpc/pubsub) from the Ethereum API supported by Moonbeam are:

- **[eth_subscribe](https://geth.ethereum.org/docs/rpc/pubsub#create-subscription)** — Creates a subscription for a given subscription name. If successful, returns the subscription ID
- **[eth_unsubscribe](https://geth.ethereum.org/docs/rpc/pubsub#cancel-subscription)** — Cancels the subscription given by its ID

### Supported Subscriptions

At the time of writing, the [supported subcriptions](https://geth.ethereum.org/docs/rpc/pubsub#supported-subscriptions) are:

 - **[newHeads](https://geth.ethereum.org/docs/rpc/pubsub#newheads)** — Triggers a notification each time a new header is appended to the chain
 - **[logs](https://geth.ethereum.org/docs/rpc/pubsub#logs)** — Returns logs that are included in new imported blocks, and match a given filter criteria
 - **[newPendingTransactions](https://geth.ethereum.org/docs/rpc/pubsub#newpendingtransactions)** — Returns the hash for all transactions that are added to the pending state
 - **[syncing](https://geth.ethereum.org/docs/rpc/pubsub#syncing)** — Indicates when the node starts or stop synchronizing with the network

You can find a dedicated tutorial for these subscriptions in [this page](/builders/tools/pubsub/).