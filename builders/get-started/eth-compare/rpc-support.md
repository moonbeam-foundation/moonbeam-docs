---
title: Supported RPC Methods
description: A description of the main differences that Ethereum developers need to understand in terms of the Ethereum RPC support Moonbeam provides.
---

# Supported Ethereum RPC Methods

## Introduction {: #introduction }

While Moonbeam strives to be compatible with Ethereum's Web3 API and EVM, there are some important differences that developers should know and understand in terms of the [Ethereum API JSON-RPC](https://eth.wiki/json-rpc/API#json-rpc-methods){target=\_blank} support on Moonbeam.

The Moonbeam team has collaborated closely with [Parity](https://www.parity.io/){target=\_blank} on developing [Frontier](/learn/features/eth-compatibility/#frontier){target=\_blank}. Frontier is the Ethereum compatibility layer for Substrate-based chains, and it is what allows developers to run unmodified Ethereum DApps.

Nevertheless, not all of the Ethereum JSON-RPC methods are supported, and some of the supported ones return default values (those related to Ethereum's PoW consensus mechanism in particular). This guide will outline some of these main differences around Ethereum RPC support and what to expect when using Moonbeam for the first time.

## Basic Ethereum JSON-RPC Methods {: #basic-rpc-methods }

The basic JSON-RPC methods from the Ethereum API supported by Moonbeam are:

- **[eth_protocolVersion](https://eth.wiki/json-rpc/API#eth_protocolversion){target=\_blank}** — returns `1` by default
- **[eth_syncing](https://eth.wiki/json-rpc/API#eth_syncing){target=\_blank}** — returns an object with data about the sync status or `false`
- **[eth_hashrate](https://eth.wiki/json-rpc/API#eth_hashrate){target=\_blank}** — returns `"0x0"` by default
- **[eth_coinbase](https://eth.wiki/json-rpc/API#eth_coinbase){target=\_blank}** — returns the latest block author. Not necessarily a finalized block
- **[eth_mining](https://eth.wiki/json-rpc/API#eth_mining){target=\_blank}** — returns `false` by default
- **[eth_chainId](https://eth.wiki/json-rpc/API#eth_chainid){target=\_blank}** — returns the chain ID used for signing at the current block
- **[eth_gasPrice](https://eth.wiki/json-rpc/API#eth_gasprice){target=\_blank}** — returns the base fee per unit of gas used. This is currently the minimum gas price for each network
- **[eth_accounts](https://eth.wiki/json-rpc/API#eth_accounts){target=\_blank}** — returns a list of addresses owned by the client
- **[eth_blockNumber](https://eth.wiki/json-rpc/API#eth_blocknumber){target=\_blank}** — returns the highest available block number
- **[eth_getBalance](https://eth.wiki/json-rpc/API#eth_getbalance){target=\_blank}** — returns the balance of the given address
- **[eth_getStorageAt](https://eth.wiki/json-rpc/API#eth_getstorageat){target=\_blank}** — returns content of the storage at a given address
- **[eth_getBlockByHash](https://eth.wiki/json-rpc/API#eth_getblockbyhash){target=\_blank}** — returns information about the block of the given hash including `baseFeePerGas` on post-London blocks
- **[eth_getBlockByNumber](https://eth.wiki/json-rpc/API#eth_getblockbynumber){target=\_blank}** — returns information about the block specified by block number including `baseFeePerGas` on post-London blocks
- **[eth_getBlockReceipts](https://docs.alchemy.com/reference/eth-getblockreceipts){target=\_blank}** — returns all transaction receipts for a given block
- **[eth_getTransactionCount](https://eth.wiki/json-rpc/API#eth_gettransactioncount){target=\_blank}** — returns the number of transactions sent from the given address (nonce)
- **[eth_getBlockTransactionCountByHash](https://eth.wiki/json-rpc/API#eth_getblocktransactioncountbyhash){target=\_blank}** — returns the number of transactions in a block with a given block hash
- **[eth_getBlockTransactionCountByNumber](https://eth.wiki/json-rpc/API#eth_getblocktransactioncountbynumber){target=\_blank}** — returns the number of transactions in a block with a given block number
- **[eth_getUncleCountByBlockHash](https://eth.wiki/json-rpc/API#eth_getunclecountbyblockhash){target=\_blank}** —  returns `"0x0"` by default
- **[eth_getUncleCountByBlockNumber](https://eth.wiki/json-rpc/API#eth_getunclecountbyblocknumber){target=\_blank}** — returns `"0x0"` by default
- **[eth_getCode](https://eth.wiki/json-rpc/API#eth_getcode){target=\_blank}** — returns the code at given address at given block number
- **[eth_sendTransaction](https://eth.wiki/json-rpc/API#eth_sendtransaction){target=\_blank}** — creates new message call transaction or a contract creation, if the data field contains code. Returns the transaction hash, or the zero hash if the transaction is not yet available
- **[eth_sendRawTransaction](https://eth.wiki/json-rpc/API#eth_sendrawtransaction){target=\_blank}** — creates new message call transaction or a contract creation for signed transactions. Returns the transaction hash, or the zero hash if the transaction is not yet available
- **[eth_call](https://eth.wiki/json-rpc/API#eth_call){target=\_blank}** — executes a new message call immediately without creating a transaction on the block chain, returning the value of the executed call
- **[eth_estimateGas](https://eth.wiki/json-rpc/API#eth_estimategas){target=\_blank}** — returns an estimate amount of how much gas is necessary for a given transaction to succeed. You can optionally specify a `gasPrice` or `maxFeePerGas` and `maxPriorityFeePerGas`
- **[eth_feeHistory](https://docs.alchemy.com/alchemy/apis/ethereum/eth-feehistory){target=\_blank}** — returns `baseFeePerGas`, `gasUsedRatio`, `oldestBlock`, and `reward` for a specified range of up to 1024 blocks
- **[eth_getTransactionByHash](https://eth.wiki/json-rpc/API#eth_gettransactionbyhash){target=\_blank}** — returns the information about a transaction with a given hash. EIP-1559 transactions have `maxPriorityFeePerGas` and `maxFeePerGas` fields
- **[eth_getTransactionByBlockHashAndIndex](https://eth.wiki/json-rpc/API#eth_gettransactionbyblockhashandindex){target=\_blank}** — returns information about a transaction at a given block hash, and a given index position. EIP-1559 transactions have `maxPriorityFeePerGas` and `maxFeePerGas` fields
- **[eth_getTransactionByBlockNumberAndIndex](https://eth.wiki/json-rpc/API#eth_gettransactionbyblocknumberandindex){target=\_blank}** — returns information about a transaction at a given block number, and a given index position. EIP-1559 transactions have `maxPriorityFeePerGas` and `maxFeePerGas` fields
- **[eth_getTransactionReceipt](https://eth.wiki/json-rpc/API#eth_gettransactionreceipt){target=\_blank}** — returns the transaction receipt of a given transaction hash. After London support was added in runtime 1200, a new field named `effectiveGasPrice` has been added to the receipt, specifying the gas price of the transaction
- **[eth_getUncleByBlockHashAndIndex](https://eth.wiki/json-rpc/API#eth_getunclebyblockhashandindex){target=\_blank}** — returns `null` by default
- **[eth_getUncleByBlockNumberAndIndex](https://eth.wiki/json-rpc/API#eth_getunclebyblocknumberandindex){target=\_blank}** — returns `null` by default
- **[eth_getLogs](https://eth.wiki/json-rpc/API#eth_getlogs){target=\_blank}** — returns an array of all logs matching a given filter object
- **[eth_getWork](https://eth.wiki/json-rpc/API#eth_getwork){target=\_blank}** — returns `["0x0","0x0","0x0"]` by default
- **[eth_submitWork](https://eth.wiki/json-rpc/API#eth_submitwork){target=\_blank}** — not supported on Moonbeam
- **[eth_submitHashrate](https://eth.wiki/json-rpc/API#eth_submithashrate){target=\_blank}** — not supported on Moonbeam

## Filter-related Ethereum JSON-RPC Methods {: #filter-rpc-methods }

The filter-related JSON-RPC methods from the Ethereum API supported by Moonbeam are:

- **[eth_newFilter](https://eth.wiki/json-rpc/API#eth_newfilter){target=\_blank}** — creates a filter object based on the input provided. Returns a filter ID
- **[eth_newBlockFilter](https://eth.wiki/json-rpc/API#eth_newblockfilter){target=\_blank}** — creates a filter in the node to notify when a new block arrives. Returns a filter id
- **[eth_getFilterChanges](https://eth.wiki/json-rpc/API#eth_getfilterchanges){target=\_blank}** — polling method for filters (see methods above). Returns an array of logs which occurred since last poll
- **[eth_getFilterLogs](https://eth.wiki/json-rpc/API#eth_getfilterlogs){target=\_blank}** — returns an array of all the logs matching the filter with a given ID
- **[eth_uninstallFilter](https://eth.wiki/json-rpc/API#eth_uninstallfilter){target=\_blank}** — uninstall a filter with a given ID. Should be used when polling is no longer needed. Filters timeout when they are not requested using `eth_getFilterChanges` after a period of time

## Event Subscription Ethereum JSON-RPC Methods {: #event-subscription-rpc-methods }

The [event subscription JSON-RPC methods](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#create-subscriptions){target=\_blank} from the Ethereum API supported by Moonbeam are:

- **[eth_subscribe](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#create-subscriptions){target=\_blank}** — creates a subscription for a given subscription name. If successful, returns the subscription ID
- **[eth_unsubscribe](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#cancel-subscriptions){target=\_blank}** — cancels the subscription given by its ID

### Supported Subscription Parameters {: #supported-subscription }

The [supported subscriptions](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#create-subscriptions#supported-subscriptions){target=\_blank} are:

- **[newHeads](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#newheads){target=\_blank}** — triggers a notification each time a new header is appended to the chain
- **[logs](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#logs){target=\_blank}** — returns logs that are included in new imported blocks, and match a given filter criteria
- **[newPendingTransactions](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#newpendingtransactions){target=\_blank}** — returns the hash for all transactions that are added to the pending state
- **[syncing](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#syncing){target=\_blank}** — indicates when the node starts or stop synchronizing with the network

For a dedicated tutorial for these subscriptions, check out the [Events Subscription](/builders/build/eth-api/pubsub/){target=\_blank} guide.

## Debug and Trace JSON-RPC Methods {: #debug-trace }

The supported methods from Geth's [debug](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug){target=\_blank} and [txpool](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool){target=\_blank} APIs and OpenEthereum's [trace](https://openethereum.github.io/JSONRPC-trace-module){target=\_blank} module are as follows:

- **[debug_traceTransaction](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtracetransaction){target=\_blank}** - given a transaction hash, this method attempts to replay a transaction in the exact same manner as it was executed on the network
- **[debug_traceBlockByNumber](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debug_traceblockbynumber){target=\_blank}** - given a block number, this method attempts to replay a block in the exact same manner as it was executed on the network
- **[debug_traceBlockByHash](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debug_traceblockbyhash){target=\_blank}** - given a block hash, this method attempts to replay a block in the exact same manner as it was executed on the network
- **[trace_filter](https://openethereum.github.io/JSONRPC-trace-module#trace_filter){target=\_blank}** - given a filter, this method returns matching traces
- **[txpool_content](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-content){target=\_blank}** - returns the details for all of the transactions that are currently pending, waiting to be included in the next block(s), and queued for future execution
- **[txpool_inspect](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-inspect){target=\_blank}** - returns a summary of all of the transactions that are currently pending, waiting to be included in the next block(s), and queued for future execution
- **[txpool_status](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-status){target=\_blank}** - returns the total number of transactions currently pending, waiting to be included in the next block(s), and queued for future execution

For a dedicated tutorial for these debug and trace methods, check out the [Debug API & Trace Module](/builders/build/eth-api/debug-trace/){target=\_blank} guide.

## Batch Requests {: #batch-request }

Moonbeam clients support [batch requests](https://geth.ethereum.org/docs/interacting-with-geth/rpc/batch){target=\_blank}, allowing you to send multiple data requests simultaneously in an array. This reduces network delays by fetching data in a single call, which is especially beneficial for retrieving large amounts of independent data.
