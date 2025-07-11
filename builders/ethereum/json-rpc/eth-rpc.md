---
title: Standard Ethereum JSON-RPC Methods
description: Explore a comprehensive list of standard Ethereum JSON-RPC methods that can be used to interface with Moonbeam nodes programmatically. 
---

# Supported Ethereum RPC Methods

## Introduction {: #introduction }

The Moonbeam team has collaborated closely with [Parity](https://www.parity.io){target=\_blank} on developing [Frontier](/learn/platform/technology/#frontier){target=\_blank}, an Ethereum compatibility layer for Substrate-based chains. This layer enables developers to run unmodified Ethereum dApps on Moonbeam seamlessly.

Nevertheless, not all Ethereum JSON-RPC methods are supported; some of those supported return default values (those related to Ethereum's PoW consensus mechanism in particular). This guide provides a comprehensive list of supported Ethereum JSON-RPC methods on Moonbeam. Developers can quickly reference this list to understand the available functionality for interfacing with Moonbeam's Ethereum-compatible blockchain.

## Standard Ethereum JSON-RPC Methods {: #basic-rpc-methods }

The basic JSON-RPC methods from the Ethereum API supported by Moonbeam are:

- **[eth_protocolVersion](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_protocolversion){target=\_blank}** — returns `1` by default
- **[eth_syncing](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_syncing){target=\_blank}** — returns an object with data about the sync status or `false`
- **[eth_hashrate](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_hashrate){target=\_blank}** — returns `"0x0"` by default
- **[eth_coinbase](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_coinbase){target=\_blank}** — returns the latest block author. Not necessarily a finalized block
- **[eth_mining](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_mining){target=\_blank}** — returns `false` by default
- **[eth_chainId](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_chainid){target=\_blank}** — returns the chain ID used for signing at the current block
- **[eth_gasPrice](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gasprice){target=\_blank}** — returns the base fee per unit of gas used. This is currently the minimum gas price for each network
- **[eth_accounts](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_accounts){target=\_blank}** — returns a list of addresses owned by the client
- **[eth_blockNumber](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber){target=\_blank}** — returns the highest available block number
- **[eth_getBalance](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getbalance){target=\_blank}** — returns the balance of the given address. Instead of providing a block number as a parameter, you can provide a [default block parameter](#default-block-parameters)
- **[eth_getStorageAt](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getstorageat){target=\_blank}** — returns the content of the storage at a given address. Instead of providing a block number as a parameter, you can provide a [default block parameter](#default-block-parameters)
- **[eth_getBlockByHash](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbyhash){target=\_blank}** — returns information about the block of the given hash, including `baseFeePerGas` on post-London blocks
- **[eth_getBlockByNumber](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber){target=\_blank}** — returns information about the block specified by block number, including `baseFeePerGas` on post-London blocks. Instead of providing a block number as the first parameter, you can provide a [default block parameter](#default-block-parameters)
- **[eth_getBlockReceipts](https://www.alchemy.com/docs/node/ethereum/ethereum-api-endpoints/eth-get-block-receipts){target=\_blank}** — returns all transaction receipts for a given block
- **[eth_getTransactionCount](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactioncount){target=\_blank}** — returns the number of transactions sent from the given address (nonce). Instead of providing a block number as a parameter, you can provide a [default block parameter](#default-block-parameters)
- **[eth_getBlockTransactionCountByHash](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbyhash){target=\_blank}** — returns the number of transactions in a block with a given block hash
- **[eth_getBlockTransactionCountByNumber](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbynumber){target=\_blank}** — returns the number of transactions in a block with a given block number
- **[eth_getUncleCountByBlockHash](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getunclecountbyblockhash){target=\_blank}** —  returns `"0x0"` by default
- **[eth_getUncleCountByBlockNumber](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getunclecountbyblocknumber){target=\_blank}** — returns `"0x0"` by default
- **[eth_getCode](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getcode){target=\_blank}** — returns the code at the given address at the given block number. Instead of providing a block number as a parameter, you can provide a [default block parameter](#default-block-parameters)
- **[eth_sendTransaction](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction){target=\_blank}** — creates a new message call transaction or a contract creation, if the data field contains code. Returns the transaction hash or the zero hash if the transaction is not yet available
- **[eth_sendRawTransaction](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendrawtransaction){target=\_blank}** — creates a new message call transaction or a contract creation for signed transactions. Returns the transaction hash or the zero hash if the transaction is not yet available
- **[eth_call](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_call){target=\_blank}** — executes a new message call immediately without creating a transaction on the blockchain, returning the value of the executed call
    - Moonbeam supports the use of the optional _state override set_ object. This address-to-state mapping object allows the user to specify some state to be ephemerally overridden before executing a call to `eth_call`. The state override set is commonly used for tasks like debugging smart contracts. Visit the [go-ethereum](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-eth#:~:text=Object%20%2D%20State%20override%20set){target=\_blank} documentation to learn more
    - Instead of providing a block number as a parameter, you can provide a [default block parameter](#default-block-parameters)
- **[eth_estimateGas](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_estimategas){target=\_blank}** — returns an estimated amount of gas necessary for a given transaction to succeed. You can optionally specify a `gasPrice` or `maxFeePerGas` and `maxPriorityFeePerGas`. Instead of providing a block number as a parameter, you can provide a [default block parameter](#default-block-parameters)
- **[eth_maxPriorityFeePerGas](https://www.alchemy.com/docs/node/ethereum/ethereum-api-endpoints/eth-max-priority-fee-per-gas){target=\_blank}** - returns an estimate of how much priority fee, in Wei, is needed for inclusion in a block
- **[eth_feeHistory](https://www.alchemy.com/docs/node/ethereum/ethereum-api-endpoints/eth-fee-history){target=\_blank}** — returns `baseFeePerGas`, `gasUsedRatio`, `oldestBlock`, and `reward` for a specified range of up to 1024 blocks
- **[eth_getTransactionByHash](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactionbyhash){target=\_blank}** — returns the information about a transaction with a given hash. EIP-1559 transactions have `maxPriorityFeePerGas` and `maxFeePerGas` fields
- **[eth_getTransactionByBlockHashAndIndex](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactionbyblockhashandindex){target=\_blank}** — returns information about a transaction at a given block hash and a given index position. EIP-1559 transactions have `maxPriorityFeePerGas` and `maxFeePerGas` fields
- **[eth_getTransactionByBlockNumberAndIndex](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactionbyblocknumberandindex){target=\_blank}** — returns information about a transaction at a given block number and a given index position. EIP-1559 transactions have `maxPriorityFeePerGas` and `maxFeePerGas` fields. Instead of providing a block number as a parameter, you can provide a [default block parameter](#default-block-parameters)
- **[eth_getTransactionReceipt](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactionreceipt){target=\_blank}** — returns the transaction receipt of a given transaction hash
- **[eth_getUncleByBlockHashAndIndex](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getunclebyblockhashandindex){target=\_blank}** — returns `null` by default
- **[eth_getUncleByBlockNumberAndIndex](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getunclebyblocknumberandindex){target=\_blank}** — returns `null` by default
- **[eth_getLogs](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs){target=\_blank}** — returns an array of all logs matching a given filter object. Instead of providing a block number as a parameter, you can provide a [default block parameter](#default-block-parameters)
- **[eth_newFilter](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter){target=\_blank}** — creates a filter object based on the input provided. Returns a filter ID
- **[eth_newBlockFilter](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newblockfilter){target=\_blank}** — creates a filter in the node to notify when a new block arrives. Returns a filter ID
- **[eth_newPendingTransactionFilter](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter){target=\_blank}** - creates a filter in the node to notify when new pending transactions arrive. Returns a filter ID
- **[eth_getFilterChanges](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges){target=\_blank}** — polling method for filters (see methods above). Returns an array of logs that occurred since the last poll
- **[eth_getFilterLogs](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterlogs){target=\_blank}** — returns an array of all the logs matching the filter with a given ID
- **[eth_uninstallFilter](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_uninstallfilter){target=\_blank}** — uninstall a filter with a given ID. It should be used when polling is no longer needed. Filters timeout when they are not requested using `eth_getFilterChanges` after some time

## Default Block Parameters {: #default-block-parameters }

Moonbeam supports several default block parameters that allow you to query a subset of JSON-RPC methods at significant block heights. Moonbeam supports the following default block parameters: 

- `finalized` - Refers to the most recent block that Polkadot validators have finalized
- `safe` - Synonymous with `finalized` in Moonbeam. In Ethereum, `safe` refers to the most recent block that is considered safe by the network, meaning it is unlikely to be reverted but has not yet been finalized. With Moonbeam's fast and deterministic finality, `finalized` and `safe` refer to the same blocks. 
- `earliest` - Refers to the genesis block of the blockchain
- `pending` - Represents the latest state, including pending transactions that have not yet been mined into a block. This is a live view of the mempool
- `latest` - Refers to the latest confirmed block in the blockchain, which may not be finalized

## Unsupported Ethereum JSON-RPC Methods {: #unsupported-rpc-methods }

 Moonbeam does not support the following Ethereum API JSON-RPC methods:

 - **[eth_getProof](https://www.alchemy.com/docs/node/ethereum/ethereum-api-endpoints/eth-get-proof){target=\_blank}** - returns the account and storage values of the specified account including the Merkle-proof
 - **[eth_blobBaseFee](https://www.quicknode.com/docs/ethereum/eth_blobBaseFee){target=\_blank}** - returns the expected base fee for blobs in the next block
 - **[eth_createAccessList](https://www.alchemy.com/docs/node/ethereum/ethereum-api-endpoints/eth-create-access-list){target=\_blank}** - creates an EIP-2930 type `accessList` based on a given transaction object
 - **[eth_sign](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sign){target=\_blank}** - allows the user to sign an arbitrary hash to be sent at a later time. Presents a [security risk](https://support.metamask.io/privacy-and-security/what-is-eth_sign-and-why-is-it-a-risk/){target=\_blank} as the arbitrary hash can be fraudulently applied to other transactions
 - **[eth_signTransaction](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_signtransaction){target=\_blank}** - allows the user to sign a transaction to be sent at a later time. It is rarely used due to associated security risks

## Additional RPC Methods {: #additional-rpc-methods }

Check out some of the non-standard Ethereum and Moonbeam-specific RPC methods:

- [Debug and Trace](/builders/ethereum/json-rpc/debug-trace/)
- [Event Subscription](/builders/ethereum/json-rpc/pubsub/)
- [Custom Moonbeam](/builders/ethereum/json-rpc/moonbeam-custom-api/)
