---
title: Calculating Transaction Fees on Moonbeam
description: The page outlines the transaction fee model used in Moonbeam, and differences with Ethereum that developers should be aware of. 
---

# Calculating Transaction Fees on Moonbeam

![Transaction Fees Banner](/images/builders/get-started/eth-compare/tx-fees-banner.png)

## Introduction {: #introduction }

Similar to [the Ethereum and Substrate APIs for sending transfers](/builders/get-started/eth-compare/transfers-api/){target=_blank}  on Moonbeam, the Substrate and EVM layers on Moonbeam also have distinct transaction fee models that developers should be aware of when they need to calculate and keep track of the transaction fees of their transactions. 

The following page will assume the developer is interacting with Moonbeam blocks via [the Substrate API Sidecar](/builders/build/substrate-api/sidecar/){target=_blank} service. There are other ways of interacting with Moonbeam blocks, such as using [the Polkadot.js API library](/builders/build/substrate-api/polkadot-js-api/){target=_blank}, the logic would be identical once the blocks are retrieved. 

You can reference the [Substrate API Sidecar page](/builders/build/substrate-api/sidecar/) for information on installing and running your own Sidecar service instance, as well as more details on how to decode Sidecar blocks for Moonbeam transactions. 

## Substrate API Transaction Fees {: #substrate-api-transaction-fees }

The fees of a transaction sent via the Substrate API on Moonbeam can be read directly from a Substrate API Sidecar block JSON object. The nesting structure is as the following:

```JSON
RESPONSE JSON Block Object:
    |--extrinsics
        |--{extrinsic number}
            |--method
            |--signature
            |--nonce
            |--args
            |--tip           
            |--hash
            |--info
            |--era
            |--events
                |--{event number}
                    |--method
                        |--pallet: "transactionPayment"
                        |--method: "TransactionFeePaid"
                    |--data
                        |--0
                        |--1
                        |--2
    ...

```

The object mappings are summarized as the following:

|     Tx Information      |                           Block JSON Field                            |
|:-----------------------:|:---------------------------------------------------------------------:|
| Fee Paying Account | `extrinsics.{extrinsic number}.events.{event number}.data.0`  |
|  Total Fees Paid  | `extrinsics.{extrinsic number}.events.{event number}.data.1` |
|     Tip      | `extrinsics.{extrinsic number}.events.{event number}.data.2` |

The transaction fee related information can be retrieved under the event of the relevant extrinsic where the `method` field is set to: 

```
pallet: "transactionPayment", method: "TransactionFeePaid" 
```

And then the total transaction fee paid for this extrinsic is mapped to the following field of the block JSON object:

```
extrinsics.{extrinsic number}.events.{event number}.data.1
```

## Ethereum API Transaction Fees {: #ethereum-api-transaction-fees }

### Calculating Ethereum API Transaction Fees {: #calculating-ethereum-api-transaction-fees }

To calculate the fee incurred on a Moonbeam transaction sent via the Ethereum API, the following formula can be used:

=== "EIP1559"
    ```
    Transaction Fee =（Base Fee + Max Priority Fee Per Gas) * Transaction Weight / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```
=== "Legacy"
    ```
    Transaction Fee = Gas Price * Transaction Weight / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```
=== "EIP2930"
    ```
    Transaction Fee = Gas Price * Transaction Weight / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```

The values of `Gas Price` and `Max Priority Fee Per Gas` for the applicable transaction types can be read from the block JSON object according to data structure described in [the Sidecar API page](/builders/build/substrate-api/sidecar/#evm-fields-mapping-in-block-json-object){target=_blank}. 

The `Base Fee`, introduced in [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=_blank}, is a value set by the network itself. The `Base Fee` for `EIP1559` type transactions is currently static on Moonbeam networks and has the following assigned value:

=== "Moonbeam"
    | Variable |  Value   |
    |:--------:|:--------:|
    | Base fee | 100 Gwei |

=== "Moonriver"
    | Variable | Value  |
    |:--------:|:------:|
    | Base fee | 1 Gwei |

=== "Moonbase Alpha"
    | Variable | Value  |
    |:--------:|:------:|
    | Base fee | 1 Gwei |

`Transaction Weight` is a Substrate mechanism used to manage the time it takes to validate a block. For all transactions types, `Transaction Weight` can be retrieved under the event of the relevant extrinsic where the `method` field is set to: 

```
pallet: "system", method: "ExtrinsicSuccess" 
```

And then `Transaction Weight` is mapped to the following field of the block JSON object:

```
extrinsics.{extrinsic number}.events.{event number}.data.0.weight
```

### Key Differences with Ethereum {: #ethereum-api-transaction-fees} 

As seen in the above section, there are some key differences between the transaction fee model on Moonbeam and the one on Ethereum that developers should be mindful of when developing on Moonbeam:

  - The network base fee on Moonbeam networks is currently static. This has many implications, one of which is that transaction sent with gas price set to a value lower than the network base fee will always fail, even if the blocks aren't full currently on the network. This behavior is different from Ethereum, which does not have a floor on the gas price of a transaction to be accepted. 
    
    The network base fee could be changed to be variable in a future runtime update. 

  - The amount of gas used in Moonbeam's transaction fee model is mapped from the transaction's Substrate extrinsic weight value via a fixed factor of {{ networks.moonbase.tx_weight_to_gas_ratio }}. This value is then multiplied with the unit gas price to calculate the transaction fee. This fee model means it can be potentially significantly cheaper to send transactions such as basic balance transfers via the Ethereum API than the Substrate API. 

### `eth_feeHistory` Endpoint {: #eth-feehistory-endpoint }

Moonbeam networks implement the [`eth_feeHistory`](https://docs.alchemy.com/reference/eth-feehistory){target_blank} JSON-RPC endpoint as a part of the support for EIP1559. 

`eth_feeHistory` returns a collection of historical gas information from which you can reference and calculate what to set for the `Max Fee Per Gas` and `Max Priority Fee Per Gas` fields when submitting EIP1559 transactions. 

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

## Sample Code for Calculating Transaction Fees

The following code snippet uses the Axios HTTP client to query the Sidecar endpoint `/blocks/head`(https://paritytech.github.io/substrate-api-sidecar/dist/){target=_blank} for the latest finalized block, and then calculates the transaction fees of all transactions in the block according to the transaction type (for Ethereum API: legacy, EIP1559 or EIP2930 standards, and for Substrate API), as well as calculating the total transaction fees in the block. 

The following code sample is for demo purposes only and should not be used without modification and further testing in a production environment. 

--8<-- 'code/vs-ethereum/tx-fees-block.md'


