---
title: Calculating Transaction Fees
description: Learn about the transaction fee model used in Moonbeam and the differences compared to Ethereum that developers should be aware of. 
---

# Calculating Transaction Fees on Moonbeam

![Transaction Fees Banner](/images/builders/get-started/eth-compare/tx-fees-banner.png)

## Introduction {: #introduction }

Similar to [the Ethereum and Substrate APIs for sending transfers](/builders/get-started/eth-compare/transfers-api/){target=_blank} on Moonbeam, the Substrate and EVM layers on Moonbeam also have distinct transaction fee models that developers should be aware of when they need to calculate and keep track of the transaction fees of their transactions.

This guide assumes you are interacting with Moonbeam blocks via [the Substrate API Sidecar](/builders/build/substrate-api/sidecar/){target=_blank} service. There are other ways of interacting with Moonbeam blocks, such as using [the Polkadot.js API library](/builders/build/substrate-api/polkadot-js-api/){target=_blank}. The logic is identical once the blocks are retrieved.

You can reference the [Substrate API Sidecar page](/builders/build/substrate-api/sidecar/){target=_blank} for information on installing and running your own Sidecar service instance, as well as more details on how to decode Sidecar blocks for Moonbeam transactions.

**Note that the information on this page assumes you are running version {{ networks.moonbase.substrate_api_sidecar.stable_version }} of the Substrate Sidecar REST API.**

## Substrate API Transaction Fees {: #substrate-api-transaction-fees }

All the information around fee data for transactions sent via the Substrate API can be extracted from the following block endpoint:

```
GET /blocks/{blockId}
```

The block endpoints will return data relevant to one or more blocks. You can read more about the block endpoints on the [official Sidecar documentation](https://paritytech.github.io/substrate-api-sidecar/dist/#operations-tag-blocks){target=_blank}. Read as a JSON object, the relevant nesting structure is as follows:  

```JSON
RESPONSE JSON Block Object:
    ...
    |--number
    |--extrinsics
        |--{extrinsic_number}
            |--method
            |--signature
            |--nonce
            |--args
            |--tip           
            |--hash
            |--info
            |--era
            |--events
                |--{event_number}
                    |--method
                        |--pallet: "transactionPayment"
                        |--method: "TransactionFeePaid"
                    |--data
                        |--0
                        |--1
                        |--2
    ...

```

The object mappings are summarized as follows:

|   Tx Information   |                      Block JSON Field                       |
|:------------------:|:-----------------------------------------------------------:|
| Fee paying account | `extrinsics[extrinsic_number].events[event_number].data[0]` |
|  Total fees paid   | `extrinsics[extrinsic_number].events[event_number].data[1]` |
|        Tip         | `extrinsics[extrinsic_number].events[event_number].data[2]` |

The transaction fee related information can be retrieved under the event of the relevant extrinsic where the `method` field is set to:

```
pallet: "transactionPayment", method: "TransactionFeePaid" 
```

And then the total transaction fee paid for this extrinsic is mapped to the following field of the block JSON object:

```
extrinsics[extrinsic_number].events[event_number].data[1]
```

## Ethereum API Transaction Fees {: #ethereum-api-transaction-fees }

To calculate the fee incurred on a Moonbeam transaction sent via the Ethereum API, the following formula can be used:

=== "EIP-1559"
    ```
    GasPrice = BaseFee + MaxPriorityFeePerGas < MaxFeePerGas ? 
                BaseFee + MaxPriorityFeePerGas : 
                MaxFeePerGas;
    Transaction Fee = (GasPrice * TransactionWeight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```
=== "Legacy"
    ```
    Transaction Fee = (GasPrice * TransactionWeight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```
=== "EIP-2930"
    ```
    Transaction Fee = (GasPrice * TransactionWeight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```

!!! note
    Due to a current bug, EIP-1559 transaction fees are calculated using the previous block's base fee. As such, you can adapt your calculations to use the base fee of the previous block to match the on-chain data.

The following sections describe in more detail each of the components needed to calculate the transaction fee.

### Base Fee {: #base-fee}

The `BaseFee` is the minimum amount charged to send a transaction and is a value set by the network itself. It was introduced in [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=_blank}. Moonbeam has its own [dynamic fee mechanism](https://forum.moonbeam.foundation/t/proposal-status-idea-dynamic-fee-mechanism-for-moonbeam-and-moonriver/241){target=_blank} for calculating the base fee, which is adjusted based on block congestion. As of runtime 2300, the dynamic fee mechanism has been rolled out to all of the Moonbeam-based networks.

The minimum gas price for each network is as follows:

=== "Moonbeam"
    |     Variable      |  Value   |
    |:-----------------:|:--------:|
    | Minimum Gas Price | 125 Gwei |

=== "Moonriver"
    |     Variable      |   Value   |
    |:-----------------:|:---------:|
    | Minimum Gas Price | 1.25 Gwei |

=== "Moonbase Alpha"
    |     Variable      |   Value    |
    |:-----------------:|:----------:|
    | Minimum Gas Price | 0.125 Gwei |

To calculate the dynamic base fee, the following calculation is used:

=== "Moonbeam"

    ```
    BaseFee = NextFeeMultiplier * 125000000000 / 10^18
    ```

=== "Moonriver"

    ```
    BaseFee = NextFeeMultiplier * 1250000000 / 10^18
    ```

=== "Moonbase Alpha"

    ```
    BaseFee = NextFeeMultiplier * 125000000 / 10^18
    ```

The value of `NextFeeMultiplier` can be retrieved from the Substrate Sidecar API, via the following endpoint:

```
GET /pallets/transaction-payment/storage/nextFeeMultiplier?at={blockId}
```

The pallets endpoints for Sidecar returns data relevant to a pallet, such as data in a pallet's storage. You can read more about the pallets endpoint in the [official Sidecar documentation](https://paritytech.github.io/substrate-api-sidecar/dist/#operations-tag-pallets){target=_blank}. The data at hand that's required from storage is the `nextFeeMultiplier`, which can be found in the `transaction-payment` pallet. The stored `nextFeeMultiplier` value can be read directly from the Sidecar storage schema. Read as a JSON object, the relevant nesting structure is as follows:

```JSON
RESPONSE JSON Storage Object:
    |--at
        |--hash
        |--height
    |--pallet
    |--palletIndex
    |--storageItem
    |--keys
    |--value
```

The relevant data will be stored in the `value` key of the JSON object. This value is a fixed point data type, hence the real value is found by dividing the `value` by `10^18`. This is why [the calculation of `BaseFee`](#ethereum-api-transaction-fees) includes such an operation.

### GasPrice, MaxFeePerGas, and MaxPriorityFeePerGas {: #gasprice-maxfeepergas-maxpriorityfeepergas }

The `GasPrice` is used to specify the gas price of legacy transactions prior to [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=_blank}. The `MaxFeePerGas` and `MaxPriorityFeePerGas` were both introduced in EIP-1559 alongside the `BaseFee`. The `MaxFeePerGas` defines the maximum fee permitted to be paid per unit of gas and is the sum of the `BaseFee` and the `MaxPriorityFeePerGas`. The `MaxPriorityFeePerGas` is the maximum priority fee configured by the sender of a transaction that is used to incentive the prioritization of a transaction in a block.

Although Moonbeam is Ethereum-compatible, it is also a Substrate-based chain at its core, and priorities work differently in Substrate than in Ethereum. In Substrate, transactions are not prioritized by gas price. To address this, Moonbeam uses a modified prioritization system that reprioritizes Substrate transactions using an Ethereum-first solution. A Substrate transaction still goes through the validity process, where it is assigned transaction tags, longevity, and a priority. The original priority is then overwritten with a new priority based on the transaction's fee per gas, which is derived from the transaction's tip and weight. If the transaction is an Ethereum transaction, the priority is set according to the priority fee.

It's important to note that priority is not the sole component responsible for determining the order of transactions in a block. Other components, such as the longevity of a transaction, also play a role in the sorting process.

The values of `GasPrice`, `MaxFeePerGas` and `MaxPriorityFeePerGas` for the applicable transaction types can be read from the block JSON object according to the structure described in [the Sidecar API page](/builders/build/substrate-api/sidecar/#evm-fields-mapping-in-block-json-object){target=_blank}.

The data for an Ethereum transaction in a particular block can be extracted from the following block endpoint:

```
GET /blocks/{blockId}
```

The paths to the relevant values have also truncated and reproduced below: 

=== "EIP1559"
    |      EVM Field       |                               Block JSON Field                               |
    |:--------------------:|:----------------------------------------------------------------------------:|
    |     MaxFeePerGas     |     `extrinsics[extrinsic_number].args.transaction.eip1559.maxFeePerGas`     |
    | MaxPriorityFeePerGas | `extrinsics[extrinsic_number].args.transaction.eip1559.maxPriorityFeePerGas` |

=== "Legacy"
    | EVM Field |                        Block JSON Field                         |
    |:---------:|:---------------------------------------------------------------:|
    | GasPrice  | `extrinsics[extrinsic_number].args.transaction.legacy.gasPrice` |

=== "EIP2930"
    | EVM Field |                         Block JSON Field                         |
    |:---------:|:----------------------------------------------------------------:|
    | GasPrice  | `extrinsics[extrinsic_number].args.transaction.eip2930.gasPrice` |

### Transaction Weight {: #transaction-weight}

`TransactionWeight` is a Substrate mechanism used to measure the execution time a given transaction takes to be executed within a block. For all transactions types, `TransactionWeight` can be retrieved under the event of the relevant extrinsic where the `method` field is set to:

```
pallet: "system", method: "ExtrinsicSuccess" 
```

And then `TransactionWeight` is mapped to the following field of the block JSON object:

```
extrinsics[extrinsic_number].events[event_number].data[0].weight
```

### Key Differences with Ethereum {: #ethereum-api-transaction-fees}

As seen in the sections above, there are some key differences between the transaction fee model on Moonbeam and the one on Ethereum that developers should be mindful of when developing on Moonbeam:

  - The [dynamic fee mechanism](https://forum.moonbeam.foundation/t/proposal-status-idea-dynamic-fee-mechanism-for-moonbeam-and-moonriver/241){target=_blank} resembles that of [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=_blank} but the implementation is different

  - The amount of gas used in Moonbeam's transaction fee model is mapped from the transaction's Substrate extrinsic weight value via a fixed factor of {{ networks.moonbase.tx_weight_to_gas_ratio }}. This value is then multiplied with the unit gas price to calculate the transaction fee. This fee model means it can potentially be significantly cheaper to send transactions such as basic balance transfers via the Ethereum API than the Substrate API

  - The EVM is designed to solely have capacity for gas and Moonbeam requires additional metrics outside of gas. In particular, Moonbeam needs the ability to record proof size, which is the amount of storage required on Moonbeam for a relay chain validator to verify a state transition. When the capacity limit for proof size has been reached for the current block, which is 25% of the block limit, an "Out of Gas" error will be thrown. This can happen even if there is remaining *legacy* gas in the gasometer. This additional metric also impacts refunds. Refunds are based on the more consumed resource after the execution. In other words, if more proof size has been consumed proportionally than legacy gas, the refund will be calculated using proof size

### Fee History Endpoint {: #eth-feehistory-endpoint }

Moonbeam networks implement the [`eth_feeHistory`](https://docs.alchemy.com/reference/eth-feehistory){target_blank} JSON-RPC endpoint as a part of the support for EIP-1559. 

`eth_feeHistory` returns a collection of historical gas information from which you can reference and calculate what to set for the `MaxFeePerGas` and `MaxPriorityFeePerGas` fields when submitting EIP-1559 transactions. 

The following curl example will return the gas information of the last 10 blocks starting from the latest block on the respective Moonbeam network using `eth_feeHistory`:

=== "Moonbeam"
    ```sh
    curl --location \
         --request POST '{{ networks.moonbeam.rpc_url }}' \
         --header 'Content-Type: application/json' \
         --data-raw '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_feeHistory",
            "params": ["0xa", "latest"]
         }'
    ```
=== "Moonriver"
    ```sh
    curl --location \
         --request POST '{{ networks.moonriver.rpc_url }}' \
         --header 'Content-Type: application/json' \
         --data-raw '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_feeHistory",
            "params": ["0xa", "latest"]
         }'
    ```
=== "Moonbase Alpha"
    ```sh
    curl --location \
         --request POST '{{ networks.moonbase.rpc_url }}' \
         --header 'Content-Type: application/json' \
         --data-raw '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_feeHistory",
            "params": ["0xa", "latest"]
         }'
    ```
=== "Moonbeam Dev Node"
    ```sh
    curl --location \
         --request POST '{{ networks.development.rpc_url }}' \
         --header 'Content-Type: application/json' \
         --data-raw '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_feeHistory",
            "params": ["0xa", "latest"]
         }'
    ```

### Sample Code for Calculating Transaction Fees {: #sample-code }

The following code snippet uses the [Axios HTTP client](https://axios-http.com/){target=_blank} to query the [Sidecar endpoint `/blocks/head`](https://paritytech.github.io/substrate-api-sidecar/dist/#operations-tag-blocks){target=_blank} for the latest finalized block. It then calculates the transaction fees of all transactions in the block according to the transaction type (for Ethereum API: legacy, EIP-1559 or EIP-2930 standards, and for Substrate API), as well as calculating the total transaction fees in the block.

!!! note
    Due to a current bug, EIP-1559 transaction fees are calculated using the previous block's base fee. As such, you can adapt your calculations to use the base fee of the previous block to match the on-chain data.

The following code sample is for demo purposes only and should not be used without modification and further testing in a production environment.

You can use the following snippet for any Moonbeam-based network, but you'll need to modify the `baseFee` accordingly. You can refer back to the [Base Fee](#base-fee) section to get the calculation for each network.

--8<-- 'code/vs-ethereum/tx-fees/tx-fees-block-dynamic.md'

--8<-- 'text/disclaimers/third-party-content.md'
