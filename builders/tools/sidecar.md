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
    export SAS_SUBSTRATE_WS_URL=wss://wss.moonriver.moonbeam.network
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

## EVM Field Mapping in Block JSON Object {: #evm-fields-mapping-in-block-json-object}

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
                    |--nonce
                    |--gasPrice
                    |--gasLimit
                    |--signature
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

To obtain the EVM sender address, recipient address, and EVM hash, check the `events` field under the current extrinsic object, and identify the event where the `method` field is set to:

```
{event number}.method.pallet: "ethereum"
{event number}.method.method: "Executed" 
```

The EVM field mappings are then summarized as the following:

| EVM Field              | Block JSON Field                                           |
|------------------------|------------------------------------------------------------|
| `Nonce`                | extrinsics.{extrinsic number}.args.transaction.nonce       |
| `GasPrice`             | extrinsics.{extrinsic number}.args.transaction.gasPrice    |
| `GasLimit`             | extrinsics.{extrinsic number}.args.transaction.gasLimit    |
| `Signature`            | extrinsics.{extrinsic number}.args.transaction.signature   |
| `Sender Address`       | extrinsics.{extrinsic number}.events.{event number}.data.0 |
| `Recipient Address`    | extrinsics.{extrinsic number}.events.{event number}.data.1 |
| `EVM Hash`             | extrinsics.{extrinsic number}.events.{event number}.data.2 |
| `EVM Execution Status` | extrinsics.{extrinsic number}.events.{event number}.data.3 |

!!! note
    EVM transaction nonce and signature fields are under `extrinsics.{extrinsic number}.args.transaction`, whereas the `nonce` and `signature` fields under `extrinsics.{extrinsic number}` are the Substrate transaction nonce and signature, which are set to `null` for EVM transactions.


### Computing Gas Spent {: #computing-gas-used } 

To calculate the gas spent or used during EVM execution of the transaction, the following formula can be used: 

```
GasPrice * Tx Weight / {{ networks.moonbase.tx_weight_to_gas_ratio }}
```

where GasPrice can be read from the block according to the above table, and Tx Weight can be retrieved under the event of the relevant extrinsic where the `method` field is set to: 

```
pallet: "system", method: "ExtrinsicSuccess" 
```

And Tx Weight is mapped to the following field of the block JSON object:

```
extrinsics.{extrinsic number}.events.{event number}.data.0.weight
```

## Public Moonbeam Sidecar Deployments  {: #public-moonbeam-sidecar-deployments }

There are public Substrate API Sidecar deployments for Moonbeam networks and can be used by querying their endpoints according to the API. 

=== "Moonriver"
    ```
    https://moonriver-rest-api.moonriver.moonbeam.network
    ```

=== "Moonbase Alpha"
    ```
    https://moonbase-rest-api.testnet.moonbeam.network
    ```
