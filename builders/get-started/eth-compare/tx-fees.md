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

The fees of a transaction sent via the Substrate API on Moonbeam can be read directly from a Sidecar block JSON object. The nesting structure is as follows:

```JSON
RESPONSE JSON Block Object:
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

### Calculating Ethereum API Transaction Fees {: #calculating-ethereum-api-transaction-fees }

To calculate the fee incurred on a Moonbeam transaction sent via the Ethereum API, the following formula can be used:

=== "EIP-1559"
    ```
    Gas Price = Base Fee + Max Priority Fee Per Gas < Max Fee Per Gas ? 
                Base Fee + Max Priority Fee Per Gas: 
                Max Fee Per Gas;
    Transaction Fee = (Gas Price * Transaction Weight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```
=== "Legacy"
    ```
    Transaction Fee = (Gas Price * Transaction Weight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```
=== "EIP-2930"
    ```
    Transaction Fee = (Gas Price * Transaction Weight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```

With the introduction of RT1900, there is a `Transaction Weight` mismatch between what is reported by the Sidecar API and what is used for the EVM transaction fee. Consequently, you need to add the following amount to `Transaction Weight`:

=== "Moonbeam"
    ```
    86298000
    ```

**The weight mismatch is fixed with RT2000.** This means that for networks running RT2000, you don't need to add any amount. The reported value is correct and should be used for the calculations shown before.

The values of `Gas Price`, `Max Fee Per Gas` and `Max Priority Fee Per Gas` for the applicable transaction types can be read from the block JSON object according to the structure described in [the Sidecar API page](/builders/build/substrate-api/sidecar/#evm-fields-mapping-in-block-json-object){target=_blank}, also truncated and reproduced below: 

=== "EIP1559"
    |        EVM Field         |                               Block JSON Field                               |
    |:------------------------:|:----------------------------------------------------------------------------:|
    |     Max Fee Per Gas      |     `extrinsics[extrinsic_number].args.transaction.eip1559.maxFeePerGas`     |
    | Max Priority Fee Per Gas | `extrinsics[extrinsic_number].args.transaction.eip1559.maxPriorityFeePerGas` |

=== "Legacy"
    | EVM Field |                        Block JSON Field                         |
    |:---------:|:---------------------------------------------------------------:|
    | Gas Price | `extrinsics[extrinsic_number].args.transaction.legacy.gasPrice` |

=== "EIP2930"
    | EVM Field |                         Block JSON Field                         |
    |:---------:|:----------------------------------------------------------------:|
    | Gas Price | `extrinsics[extrinsic_number].args.transaction.eip2930.gasPrice` |

The `Base Fee`, introduced in [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=_blank}, is a value set by the network itself. The `Base Fee` for `EIP1559` type transactions is currently static on Moonbeam networks and has the following assigned value:

=== "Moonbeam"
    | Variable |  Value   |
    |:--------:|:--------:|
    | Base Fee | 100 Gwei |

=== "Moonriver"
    | Variable | Value  |
    |:--------:|:------:|
    | Base Fee | 1 Gwei |

=== "Moonbase Alpha"
    | Variable | Value  |
    |:--------:|:------:|
    | Base Fee | 1 Gwei |

`Transaction Weight` is a Substrate mechanism used to measure the execution time a given transaction takes to be executed within a block. For all transactions types, `Transaction Weight` can be retrieved under the event of the relevant extrinsic where the `method` field is set to:

```
pallet: "system", method: "ExtrinsicSuccess" 
```

And then `Transaction Weight` is mapped to the following field of the block JSON object:

```
extrinsics[extrinsic_number].events[event_number].data[0].weight
```

!!! note
    Please remember that runtime 190X there is a `Transaction Weight` mismatch. You need to add a constant to its value. Check the [Calculating Ethereum API Transaction Fees](#calculating-ethereum-api-transaction-fees) for more information. This was fixed with the subsequent RT2000.

### Key Differences with Ethereum {: #ethereum-api-transaction-fees} 

As seen in the above section, there are some key differences between the transaction fee model on Moonbeam and the one on Ethereum that developers should be mindful of when developing on Moonbeam:

  - The network base fee on Moonbeam networks is currently static. This has many implications, one of which is that a transaction sent with a gas price set to a value lower than the network base fee will always fail, even if the blocks aren't currently full on the network. This behavior is different from Ethereum, which does not have a floor on the gas price of a transaction to be accepted. 
    
    The network base fee could be changed to be variable in a future runtime update. 

  - The amount of gas used in Moonbeam's transaction fee model is mapped from the transaction's Substrate extrinsic weight value via a fixed factor of {{ networks.moonbase.tx_weight_to_gas_ratio }}. This value is then multiplied with the unit gas price to calculate the transaction fee. This fee model means it can potentially be significantly cheaper to send transactions such as basic balance transfers via the Ethereum API than the Substrate API. 

### Fee History Endpoint {: #eth-feehistory-endpoint }

Moonbeam networks implement the [`eth_feeHistory`](https://docs.alchemy.com/reference/eth-feehistory){target_blank} JSON-RPC endpoint as a part of the support for EIP-1559. 

`eth_feeHistory` returns a collection of historical gas information from which you can reference and calculate what to set for the `Max Fee Per Gas` and `Max Priority Fee Per Gas` fields when submitting EIP-1559 transactions. 

The following curl example will return the gas information of the last 10 blocks starting from the latest block on the respective Moonbeam network using `eth_feeHistory`:

=== "Moonbeam"
    ```sh
    curl --location 
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
    curl --location 
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
    curl --location 
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
    curl --location 
         --request POST '{{ networks.development.rpc_url }}' \
         --header 'Content-Type: application/json' \
         --data-raw '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_feeHistory",
            "params": ["0xa", "latest"]
         }'
    ```

## Sample Code for Calculating Transaction Fees {: #sample-code }

The following code snippet uses the [Axios HTTP client](https://axios-http.com/){target=_blank} to query the [Sidecar endpoint `/blocks/head`](https://paritytech.github.io/substrate-api-sidecar/dist/){target=_blank} for the latest finalized block. It then calculates the transaction fees of all transactions in the block according to the transaction type (for Ethereum API: legacy, EIP-1559 or EIP-2930 standards, and for Substrate API), as well as calculating the total transaction fees in the block. 

The following code sample is for demo purposes only and should not be used without modification and further testing in a production environment. 

--8<-- 'code/vs-ethereum/tx-fees-block.md'

--8<-- 'text/disclaimers/third-party-content.md'
