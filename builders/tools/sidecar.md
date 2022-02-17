---
title: Substrate API Sidecar
description: Information on how to use Substrate-based REST service with Moonbeam networks
---

# Using Substrate API Sidecar with Moonbeam

![Substrate API Sidecar](/images/builders/tools/sidecar/sidecar-banner.png)

## Introduction {: #introduction } 

Substrate API Sidecar allows applications to access blocks, account balance, and other information of Substrate-based blockchains through a REST API. This can be useful for exchanges, wallets or other types of applications that need to keep track of account balance and other state changes on a Moonbeam network. This page will describe how to install and run a Substrate API Sidecar for Moonbeam, and the commonly used API endpoints.

## Installing and Running Substrate API Sidecar {: #installing-and-running-substrate-api-sidecar } 

There are multiple ways of installing and running the Substrate API Sidecar. This guide will describe the steps for installing and running it locally through NPM. For running Substrate API Sidecar through Docker, or building and running it from source, please refer to the [Substrate API Sidecar Github Repository](https://github.com/paritytech/substrate-api-sidecar#readme).

### Checking Prerequisites {: #checking-prerequisites }

Running this service locally through NPM requires node.js to be installed. 

--8<-- 'text/common/install-nodejs.md'

#### Installing the Substrate API Sidecar {: #installing-the-substrate-api-sidecar }

To install the Substrate API Sidecar service in the current directory, run this from the command line:

```
npm install @substrate/api-sidecar@{{ networks.moonbase.substrate_api_sidecar.stable_version }}
```

Substrate API Sidecar v{{ networks.moonbase.substrate_api_sidecar.stable_version }} is the current stable version that has been tested to work with Moonbeam networks. You can verify the installation was successful by typing from the installation directory root:

```
node_modules/.bin/substrate-api-sidecar --version
```

## Setting up the Substrate API Sidecar {: #setting-up-the-substrate-api-sidecar }

In the terminal that Sidecar will run, export the environmental variable for the WS endpoint of the network. Examples: 

=== "Moonbeam"
    ```
    export SAS_SUBSTRATE_WS_URL=wss://wss.api.moonbeam.network
    ```

=== "Moonriver"
    ```
    export SAS_SUBSTRATE_WS_URL=wss://wss.api.moonriver.moonbeam.network
    ```

=== "Moonbase Alpha"
    ```
    export SAS_SUBSTRATE_WS_URL=wss://wss.api.moonbase.moonbeam.network
    ```

=== "Moonbeam Dev Node"
    ```
    export SAS_SUBSTRATE_WS_URL=ws://127.0.0.1:9944
    ```

Please reference the [Public Endpoints](/builders/get-started/endpoints/) page for a full list of Moonbeam network endpoints.

After setting the environmental variable, you can use the `echo` command to check that the environmental variable has been set correctly, by typing:

```
echo $SAS_SUBSTRATE_WS_URL
```

And it should display the network endpoint you have just set. 

## Running Substrate API Sidecar {: #running-substrate-api-sidecar } 

With the network endpoint environmental variable set, and from the installation directory root, run:

```
node_modules/.bin/substrate-api-sidecar 
```

If the installation and configuration are successful, you should see this output in the console: 

![Successful Output](/images/builders/tools/sidecar/sidecar-1.png)

## Substrate API Sidecar Endpoints {: #substrate-api-sidecar-endpoints } 

Some of the commonly used Substrate API Sidecar endpoints include:

 - **GET /blocks​/head** — Get the most recently finalized block. The optional parameter `finalized` can be set to `false` to the get the newest known block, which may not be finalized.
 - **GET /blocks/head/header** — Get the most recently finalized block header. The optional parameter `finalized` can be set to `false` to the get the newest known block header, which may not be finalized. 
 - **GET /blocks/{blockId}** — Get a block by its height or hash.
 - **GET /accounts/{accountId}/balance-info** — Get balance information for an account.
 - **GET /node/version** — Get information about the Substrates node's implementation and versioning.
 - **GET /runtime/metadata** — Get the runtime metadata in decoded, JSON form.

For a full list of API endpoints available on Substrate API Sidecar, please refer to the [official documentation](https://paritytech.github.io/substrate-api-sidecar/dist/).

## EVM Field Mapping in Block JSON Object {: #evm-fields-mapping-in-block-json-object }

Substrate API Sidecar returns Moonbeam blocks as a JSON object. Information related to EVM execution of Moonbeam transactions is under the `extrinsics` top level field, where individual extrinsics are organized numerically as nested JSON objects. The nesting structure is as following:

```JSON
RESPONSE JSON Block Object:
    |--extrinsics
        |--{extrinsic number}
            |--method
                |--pallet: "ethereum"
                |--method: "transact"
            |--signature:
            |--nonce: 
            |--args
                |--transaction
                    |--transaction type
            |--tip
            |--hash
            |--events
                |--{event number}
                    |--method
                        |--pallet: "ethereum"
                        |--method: "Executed"
                    |--data
                        |--0
                        |--1
                        |--2
                        |--3
    ...

```

Moonbeam EVM transactions can be identify by the `method` field under the current extrinsic object, where it is set to:

```
{extrinsic number}.method.pallet = "ethereum"
{extrinsic number}.method.method = "transact"
```

### Transaction Types and Payload {: #transaction-types-and-payload }

The Moonbeam EVM currently supports three transaction standards: `legacy`, `eip1559`, and `eip2930`. These correspond to the `transaction type` field in the above JSON object diagram. For each transaction type, the transaction payload contains the following fields:

=== "Legacy"
    ```JSON
        ...
        |--legacy
            |--nonce
            |--gasPrice
            |--gasLimit
            |--action
            |--value
            |--input
            |--signature       
        ...
    ```

=== "EIP1559"
    ```JSON
        ...
        |--eip1559
            |--chainId
            |--nonce
            |--maxPriorityFeePerGas
            |--maxFeePerGas
            |--gasLimit
            |--action
            |--value
            |--input
            |--accessList
            |--oddYParity
            |--r
            |--s      
        ...
    ```
=== "EIP2930"
    ```JSON
        ...
        |--eip2930
            |--chainId
            |--nonce
            |--gasPrice
            |--gasLimit
            |--action
            |--value
            |--input
            |--accessList 
            |--oddYParity
            |--r
            |--s      
        ...
    ```

For more information on the new [EIP1559](https://eips.ethereum.org/EIPS/eip-1559){target=_blank} and [EIP2930](https://eips.ethereum.org/EIPS/eip-2930){target=_blank} transaction types and what each field means, please refer to the respective official proposal specs. 

### Transaction Field Mappings {: #transaction-field-mappings }

To obtain the EVM sender address, recipient address, and EVM hash of any EVM transaction type, check the `events` field under the current extrinsic object, and identify the event where the `method` field is set to:

```
{event number}.method.pallet: "ethereum"
{event number}.method.method: "Executed" 
```

The EVM field mappings are then summarized as the following:

=== "Legacy"

    | EVM Field              | Block JSON Field                                           |
    |------------------------|------------------------------------------------------------|
    | `Nonce`                | extrinsics.{extrinsic number}.args.transaction.legacy.nonce|
    | `GasPrice`             | extrinsics.{extrinsic number}.args.transaction.legacy.gasPrice|
    | `GasLimit`             | extrinsics.{extrinsic number}.args.transaction.legacy.gasLimit|
    | `Value`                | extrinsics.{extrinsic number}.args.transaction.legacy.value|   
    | `Signature`            | extrinsics.{extrinsic number}.args.transaction.legacy.signature|
    | `Sender Address`       | extrinsics.{extrinsic number}.events.{event number}.data.0 |
    | `Recipient Address`    | extrinsics.{extrinsic number}.events.{event number}.data.1 |
    | `EVM Hash`             | extrinsics.{extrinsic number}.events.{event number}.data.2 |
    | `EVM Execution Status` | extrinsics.{extrinsic number}.events.{event number}.data.3 |

=== "EIP1559"

    | EVM Field              | Block JSON Field                                           |
    |------------------------|------------------------------------------------------------|
    | `Chain ID`             | extrinsics.{extrinsic number}.args.transaction.eip1559.chainId|   
    | `Nonce`                | extrinsics.{extrinsic number}.args.transaction.eip1559.nonce|
    | `MaxPriorityFeePerGas` | extrinsics.{extrinsic number}.args.transaction.eip1559.maxPriorityFeePerGas|
    | `maxFeePerGas` | extrinsics.{extrinsic number}.args.transaction.eip1559.maxFeePerGas|
    | `Tip`                  | extrinsics.{extrinsic number}.tip                          |
    | `GasLimit`             | extrinsics.{extrinsic number}.args.transaction.eip1559.gasLimit|
    | `Access List`          | extrinsics.{extrinsic number}.args.transaction.eip1559.accessList|       
    | `Signature`            | extrinsics.{extrinsic number}.args.transaction.eip1559.oddYParity/r/s|
    | `Sender Address`       | extrinsics.{extrinsic number}.events.{event number}.data.0 |
    | `Recipient Address`    | extrinsics.{extrinsic number}.events.{event number}.data.1 |
    | `EVM Hash`             | extrinsics.{extrinsic number}.events.{event number}.data.2 |
    | `EVM Execution Status` | extrinsics.{extrinsic number}.events.{event number}.data.3 |

=== "EIP2930"

    | EVM Field              | Block JSON Field                                           |
    |------------------------|------------------------------------------------------------|
    | `Chain ID`             | extrinsics.{extrinsic number}.args.transaction.eip2930.chainId|
    | `Nonce`                | extrinsics.{extrinsic number}.args.transaction.eip2930.nonce |
    | `GasPrice`             | extrinsics.{extrinsic number}.args.transaction.eip2930.gasPrice|
    | `GasLimit`             | extrinsics.{extrinsic number}.args.transaction.eip2930.gasLimit|
    | `Value`                | extrinsics.{extrinsic number}.args.transaction.eip2930.value| 
    | `Access List`          | extrinsics.{extrinsic number}.args.transaction.eip2930.accessList|       
    | `Signature`            | extrinsics.{extrinsic number}.args.transaction.eip2930.oddYParity/r/s|
    | `Sender Address`       | extrinsics.{extrinsic number}.events.{event number}.data.0 |
    | `Recipient Address`    | extrinsics.{extrinsic number}.events.{event number}.data.1 |
    | `EVM Hash`             | extrinsics.{extrinsic number}.events.{event number}.data.2 |
    | `EVM Execution Status` | extrinsics.{extrinsic number}.events.{event number}.data.3 |


!!! note
    EVM transaction nonce and signature fields are under `extrinsics.{extrinsic number}.args.transaction.{transactiontype}`, whereas the `nonce` and `signature` fields under `extrinsics.{extrinsic number}` are the Substrate transaction nonce and signature, which are set to `null` for EVM transactions.


### Computing Gas Used {: #computing-gas-used } 

To calculate the gas spent or used during EVM execution of the transaction, the following formula can be used: 

=== "Legacy"
    ```
    Gas Used = GasPrice * Tx Weight / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```
=== "EIP1559"
    ```
    Gas Used =（Base Fee + Tip) * Tx Weight / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```
=== "EIP2930"
    ```
    Gas Used = GasPrice * Tx Weight / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```

The values of `GasPrice` and `Tip` for the applicable transaction types can be read from the block according to the above table. 

The `Base Fee` for `EIP1559` type transactions is current static on Moonbeam networks and has the following assigned value:

=== "Moonbeam"
    |      Variable      |                                     Value                                      |
    |:------------------:|:------------------------------------------------------------------------------:|
    | Base Fee | 100 Gwei |

=== "Moonriver"
    |      Variable      |                                     Value                                      |
    |:------------------:|:------------------------------------------------------------------------------:|
    | Base Fee | 1 Gwei |

=== "Moonbase Alpha"
    |      Variable      |                                     Value                                      |
    |:------------------:|:------------------------------------------------------------------------------:|
    | Base Fee | 1 Gwei |

For all transactions types, `Tx Weight` can be retrieved under the event of the relevant extrinsic where the `method` field is set to: 

```
pallet: "system", method: "ExtrinsicSuccess" 
```

And the `Tx Weight` is mapped to the following field of the block JSON object:

```
extrinsics.{extrinsic number}.events.{event number}.data.0.weight
```
