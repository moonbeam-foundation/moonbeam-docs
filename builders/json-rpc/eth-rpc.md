---
title: Standard Ethereum JSON-RPC Methods
description: Explore a comprehensive list of standard Ethereum JSON-RPC methods that can be used to interface with Moonbeam nodes programmatically. 
---

# Supported Ethereum RPC Methods

## Introduction {: #introduction }

The Moonbeam team has collaborated closely with [Parity](https://www.parity.io/){target=\_blank} on developing [Frontier](/learn/platform/technology/#frontier){target=\_blank}, an Ethereum compatibility layer for Substrate-based chains. This layer enables developers to run unmodified Ethereum dApps on Moonbeam seamlessly.

Nevertheless, not all Ethereum JSON-RPC methods are supported; some of those supported return default values (those related to Ethereum's PoW consensus mechanism in particular). This guide provides a comprehensive list of supported Ethereum JSON-RPC methods on Moonbeam. Developers can quickly reference this list to understand the available functionality for interfacing with Moonbeam's Ethereum-compatible blockchain.

## Standard Ethereum JSON-RPC Methods {: #basic-rpc-methods }

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
- **[eth_getStorageAt](https://eth.wiki/json-rpc/API#eth_getstorageat){target=\_blank}** — returns the content of the storage at a given address
- **[eth_getBlockByHash](https://eth.wiki/json-rpc/API#eth_getblockbyhash){target=\_blank}** — returns information about the block of the given hash, including `baseFeePerGas` on post-London blocks
- **[eth_getBlockByNumber](https://eth.wiki/json-rpc/API#eth_getblockbynumber){target=\_blank}** — returns information about the block specified by block number, including `baseFeePerGas` on post-London blocks
- **[eth_getBlockReceipts](https://docs.alchemy.com/reference/eth-getblockreceipts){target=\_blank}** — returns all transaction receipts for a given block
- **[eth_getTransactionCount](https://eth.wiki/json-rpc/API#eth_gettransactioncount){target=\_blank}** — returns the number of transactions sent from the given address (nonce)
- **[eth_getBlockTransactionCountByHash](https://eth.wiki/json-rpc/API#eth_getblocktransactioncountbyhash){target=\_blank}** — returns the number of transactions in a block with a given block hash
- **[eth_getBlockTransactionCountByNumber](https://eth.wiki/json-rpc/API#eth_getblocktransactioncountbynumber){target=\_blank}** — returns the number of transactions in a block with a given block number
- **[eth_getUncleCountByBlockHash](https://eth.wiki/json-rpc/API#eth_getunclecountbyblockhash){target=\_blank}** —  returns `"0x0"` by default
- **[eth_getUncleCountByBlockNumber](https://eth.wiki/json-rpc/API#eth_getunclecountbyblocknumber){target=\_blank}** — returns `"0x0"` by default
- **[eth_getCode](https://eth.wiki/json-rpc/API#eth_getcode){target=\_blank}** — returns the code at the given address at the given block number
- **[eth_sendTransaction](https://eth.wiki/json-rpc/API#eth_sendtransaction){target=\_blank}** — creates a new message call transaction or a contract creation, if the data field contains code. Returns the transaction hash or the zero hash if the transaction is not yet available
- **[eth_sendRawTransaction](https://eth.wiki/json-rpc/API#eth_sendrawtransaction){target=\_blank}** — creates a new message call transaction or a contract creation for signed transactions. Returns the transaction hash or the zero hash if the transaction is not yet available
- **[eth_call](https://eth.wiki/json-rpc/API#eth_call){target=\_blank}** — executes a new message call immediately without creating a transaction on the blockchain, returning the value of the executed call
- **[eth_estimateGas](https://eth.wiki/json-rpc/API#eth_estimategas){target=\_blank}** — returns an estimated amount of gas necessary for a given transaction to succeed. You can optionally specify a `gasPrice` or `maxFeePerGas` and `maxPriorityFeePerGas`
- **[eth_feeHistory](https://docs.alchemy.com/alchemy/apis/ethereum/eth-feehistory){target=\_blank}** — returns `baseFeePerGas`, `gasUsedRatio`, `oldestBlock`, and `reward` for a specified range of up to 1024 blocks
- **[eth_getTransactionByHash](https://eth.wiki/json-rpc/API#eth_gettransactionbyhash){target=\_blank}** — returns the information about a transaction with a given hash. EIP-1559 transactions have `maxPriorityFeePerGas` and `maxFeePerGas` fields
- **[eth_getTransactionByBlockHashAndIndex](https://eth.wiki/json-rpc/API#eth_gettransactionbyblockhashandindex){target=\_blank}** — returns information about a transaction at a given block hash and a given index position. EIP-1559 transactions have `maxPriorityFeePerGas` and `maxFeePerGas` fields
- **[eth_getTransactionByBlockNumberAndIndex](https://eth.wiki/json-rpc/API#eth_gettransactionbyblocknumberandindex){target=\_blank}** — returns information about a transaction at a given block number and a given index position. EIP-1559 transactions have `maxPriorityFeePerGas` and `maxFeePerGas` fields
- **[eth_getTransactionReceipt](https://eth.wiki/json-rpc/API#eth_gettransactionreceipt){target=\_blank}** — returns the transaction receipt of a given transaction hash
- **[eth_getUncleByBlockHashAndIndex](https://eth.wiki/json-rpc/API#eth_getunclebyblockhashandindex){target=\_blank}** — returns `null` by default
- **[eth_getUncleByBlockNumberAndIndex](https://eth.wiki/json-rpc/API#eth_getunclebyblocknumberandindex){target=\_blank}** — returns `null` by default
- **[eth_getLogs](https://eth.wiki/json-rpc/API#eth_getlogs){target=\_blank}** — returns an array of all logs matching a given filter object
- **[eth_getWork](https://eth.wiki/json-rpc/API#eth_getwork){target=\_blank}** — returns `["0x0","0x0","0x0"]` by default
- **[eth_submitWork](https://eth.wiki/json-rpc/API#eth_submitwork){target=\_blank}** — not supported on Moonbeam
- **[eth_submitHashrate](https://eth.wiki/json-rpc/API#eth_submithashrate){target=\_blank}** — not supported on Moonbeam
- **[eth_newFilter](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter){target=\_blank}** — creates a filter object based on the input provided. Returns a filter ID
- **[eth_newBlockFilter](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newblockfilter){target=\_blank}** — creates a filter in the node to notify when a new block arrives. Returns a filter id
- **[eth_getFilterChanges](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges){target=\_blank}** — polling method for filters (see methods above). Returns an array of logs that occurred since the last poll
- **[eth_getFilterLogs](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterlogs){target=\_blank}** — returns an array of all the logs matching the filter with a given ID
- **[eth_uninstallFilter](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_uninstallfilter){target=\_blank}** — uninstall a filter with a given ID. It should be used when polling is no longer needed. Filters timeout when they are not requested using `eth_getFilterChanges` after some time

## Additional RPC Methods {: #additional-rpc-methods }

Check out some of the non-standard Ethereum and Moonbeam-specific RPC methods:

- [Debug and Trace](/builders/json-rpc/debug-trace/)
- [Event Subscription](/builders/json-rpc/pubsub/)
- [Custom Moonbeam](/builders/json-rpc/moonbeam-custom-api/)
