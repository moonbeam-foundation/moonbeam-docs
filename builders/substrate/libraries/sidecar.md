---
title: Using Substrate API Sidecar with Moonbeam
description: Learn how to use Sidecar, a Substrate-based REST service, with Moonbeam-based networks to access blocks, account balances, compute gas used, and more.
---

# Using Substrate API Sidecar with Moonbeam

## Introduction {: #introduction }

Substrate API Sidecar allows applications to access blocks, account balance, and other information of Substrate-based blockchains through a REST API. This can be useful for exchanges, wallets or other types of applications that need to keep track of account balance and other state changes on a Moonbeam network. This page will describe how to install and run a Substrate API Sidecar for Moonbeam, and the commonly used API endpoints.

## Installing and Running Substrate API Sidecar {: #installing-and-running-substrate-api-sidecar }

There are multiple ways of installing and running the Substrate API Sidecar. This guide will describe the steps for installing and running it locally through NPM. For running Substrate API Sidecar through Docker, or building and running it from source, please refer to the [Substrate API Sidecar Github Repository](https://github.com/paritytech/substrate-api-sidecar#readme).

### Checking Prerequisites {: #checking-prerequisites }

Running this service locally through NPM requires Node.js to be installed.

--8<-- 'text/_common/install-nodejs.md'

### Installing the Substrate API Sidecar {: #installing-the-substrate-api-sidecar }

To install the Substrate API Sidecar service locally in the current directory, run this from the command line:

```bash
npm install @substrate/api-sidecar@{{ networks.moonbase.substrate_api_sidecar.stable_version }}
```

!!! note
    If the current folder does not already have a Node.js project structure, you need to manually created the `node_modules` directory by typing `mkdir node_modules`.

Substrate API Sidecar v{{ networks.moonbase.substrate_api_sidecar.stable_version }} is the current stable version that has been tested to work with Moonbeam networks. You can verify the installation was successful by typing from the installation directory root:

```bash
node_modules/.bin/substrate-api-sidecar --version
```

## Setting up the Substrate API Sidecar {: #setting-up-the-substrate-api-sidecar }

In the terminal that Sidecar will run, export the environmental variable for the WS endpoint of the network. Examples:

=== "Moonbeam"

    ```bash
    export SAS_SUBSTRATE_URL=wss://wss.api.moonbeam.network
    ```

=== "Moonriver"

    ```bash
    export SAS_SUBSTRATE_URL=wss://wss.api.moonriver.moonbeam.network
    ```

=== "Moonbase Alpha"

    ```bash
    export SAS_SUBSTRATE_URL=wss://wss.api.moonbase.moonbeam.network
    ```

=== "Moonbeam Dev Node"

    ```bash
    export SAS_SUBSTRATE_URL=ws://127.0.0.1:9944
    ```

Please reference the [Public Endpoints](/builders/get-started/endpoints/) page for a full list of Moonbeam network endpoints.

After setting the environmental variable, you can use the `echo` command to check that the environmental variable has been set correctly, by typing:

```bash
echo $SAS_SUBSTRATE_URL
```

And it should display the network endpoint you have just set.

## Generating the Types Bundle {: #generating-the-types-bundle }

Moonbeam introduces custom types that differ from the standard Substrate types. For API clients like Substrate API Sidecar to properly understand and decode these custom types, you must provide Substrate API Sidecar with the corresponding custom types bundle for the respective network you're interacting with. Generating the custom types bundle and associating it with Substrate API Sidecar is quick. 

First, ensure that you installed [Parity's `generate-types-bundle` package](https://github.com/paritytech/generate-type-bundle){target=\_blank}:

```bash
npm install -g @substrate/generate-type-bundle
```

Then, run the following command to generate the types bundle for the respective network:

=== "Moonbeam"

    ```bash
    generate-type-bundle -p . -s moonbeam
    ```

=== "Moonriver"

    ```bash
    generate-type-bundle -p . -s moonriver
    ```

=== "Moonbase Alpha"

    ```bash
    generate-type-bundle -p . -s moonbase
    ```

Note that running subsequent commands will overwrite the existing `typesBundle.json.` You'll then need to set the `SAS_SUBSTRATE_TYPES_BUNDLE` environment variable as shown below. If you've renamed the `typesBundle.json,` ensure you use the correct file name. 

```bash
export SAS_SUBSTRATE_TYPES_BUNDLE="./typesBundle.json"
```

After setting the environmental variable, you can use the `echo` command to check that the environmental variable has been set correctly by typing:

```bash
echo $SAS_SUBSTRATE_TYPES_BUNDLE
```

## Running Substrate API Sidecar {: #running-substrate-api-sidecar }

With the network endpoint environmental variable set, and from the installation directory root, run:

```bash
node_modules/.bin/substrate-api-sidecar 
```

If the installation and configuration are successful, you should see this output in the console:

--8<-- 'code/builders/get-started/networks/moonbeam-dev/terminal/sidecar.md'

## Substrate API Sidecar Endpoints {: #substrate-api-sidecar-endpoints }

Some of the commonly used Substrate API Sidecar endpoints include:

 - **GET /blocks​/head** — Get the most recently finalized block. The optional parameter `finalized` can be set to `false` to the get the newest known block, which may not be finalized
 - **GET /blocks/head/header** — Get the most recently finalized block header. The optional parameter `finalized` can be set to `false` to the get the newest known block header, which may not be finalized
 - **GET /blocks/{blockId}** — Get a block by its height or hash
 - **GET /accounts/{accountId}/balance-info** — Get balance information for an account
 - **GET /node/version** — Get information about the Substrates node's implementation and versioning
 - **GET /runtime/metadata** — Get the runtime metadata in decoded, JSON form.

For a full list of API endpoints available on Substrate API Sidecar, please refer to the [official documentation](https://paritytech.github.io/substrate-api-sidecar/dist).

## EVM Field Mapping in Block JSON Object {: #evm-fields-mapping-in-block-json-object }

Substrate API Sidecar returns Moonbeam blocks as a JSON object. Information related to EVM execution of Moonbeam transactions is under the `extrinsics` top level field, where individual extrinsics are organized numerically as nested JSON objects. The nesting structure is as following:

```text
RESPONSE JSON Block Object:
    |--extrinsics
        |--{extrinsic_number}
            |--method
                |--pallet: "ethereum"
                |--method: "transact"
            |--signature
            |--nonce 
            |--args
                |--transaction
                    |--{transaction_type}
            |--hash
            |--events
                |--{event_number}
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

```text
{extrinsic_number}.method.pallet = "ethereum"
{extrinsic_number}.method.method = "transact"
```

### Transaction Types and Payload {: #transaction-types-and-payload }

The Moonbeam EVM currently supports three transaction standards: `legacy`, `eip1559`, and `eip2930`. These correspond to the `transaction type` field in the above JSON object diagram. For each transaction type, the transaction payload contains the following fields:

=== "EIP1559"

    ```text
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

=== "Legacy"

    ```text
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

=== "EIP2930"

    ```text
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

For more information on the new [EIP1559](https://eips.ethereum.org/EIPS/eip-1559){target=\_blank} and [EIP2930](https://eips.ethereum.org/EIPS/eip-2930){target=\_blank} transaction types and what each field means, please refer to the respective official Ethereum proposal specs.

### Transaction Field Mappings {: #transaction-field-mappings }

To obtain the EVM sender address, recipient address, and EVM hash of any EVM transaction type, check the `events` field under the current extrinsic object, and identify the event where the `method` field is set to:

```text
{event_number}.method.pallet: "ethereum"
{event_number}.method.method: "Executed" 
```

The EVM field mappings are then summarized as the following:

=== "EIP1559"
    |        EVM Field         |                               Block JSON Field                               |
    |:------------------------:|:----------------------------------------------------------------------------:|
    |         Chain ID         |       `extrinsics[extrinsic_number].args.transaction.eip1559.chainId`        |
    |          Nonce           |        `extrinsics[extrinsic_number].args.transaction.eip1559.nonce`         |
    | Max priority fee per gas | `extrinsics[extrinsic_number].args.transaction.eip1559.maxPriorityFeePerGas` |
    |     Max fee per gas      |     `extrinsics[extrinsic_number].args.transaction.eip1559.maxFeePerGas`     |
    |        Gas limit         |       `extrinsics[extrinsic_number].args.transaction.eip1559.gasLimit`       |
    |       Access list        |      `extrinsics[extrinsic_number].args.transaction.eip1559.accessList`      |
    |        Signature         |    `extrinsics[extrinsic_number].args.transaction.eip1559.oddYParity/r/s`    |
    |      Sender address      |         `extrinsics[extrinsic_number].events[event_number].data[0]`          |
    |    Recipient address     |         `extrinsics[extrinsic_number].events[event_number].data[1]`          |
    |         EVM hash         |         `extrinsics[extrinsic_number].events[event_number].data[2]`          |
    |   EVM execution status   |         `extrinsics[extrinsic_number].events[event_number].data[3]`          |

=== "Legacy"
    |      EVM Field       |                         Block JSON Field                         |
    |:--------------------:|:----------------------------------------------------------------:|
    |        Nonce         |   `extrinsics[extrinsic_number].args.transaction.legacy.nonce`   |
    |      Gas price       | `extrinsics[extrinsic_number].args.transaction.legacy.gasPrice`  |
    |      Gas limit       | `extrinsics[extrinsic_number].args.transaction.legacy.gasLimit`  |
    |        Value         |   `extrinsics[extrinsic_number].args.transaction.legacy.value`   |
    |      Signature       | `extrinsics[extrinsic_number].args.transaction.legacy.signature` |
    |    Sender address    |   `extrinsics[extrinsic_number].events[event_number].data[0]`    |
    |  Recipient address   |   `extrinsics[extrinsic_number].events[event_number].data[1]`    |
    |       EVM hash       |   `extrinsics[extrinsic_number].events[event_number].data[2]`    |
    | EVM execution status |   `extrinsics[extrinsic_number].events[event_number].data[3]`    |

=== "EIP2930"
    |      EVM Field       |                            Block JSON Field                            |
    |:--------------------:|:----------------------------------------------------------------------:|
    |       Chain ID       |    `extrinsics[extrinsic_number].args.transaction.eip2930.chainId`     |
    |        Nonce         |     `extrinsics[extrinsic_number].args.transaction.eip2930.nonce`      |
    |      Gas price       |    `extrinsics[extrinsic_number].args.transaction.eip2930.gasPrice`    |
    |      Gas limit       |    `extrinsics[extrinsic_number].args.transaction.eip2930.gasLimit`    |
    |        Value         |     `extrinsics[extrinsic_number].args.transaction.eip2930.value`      |
    |     Access list      |   `extrinsics[extrinsic_number].args.transaction.eip2930.accessList`   |
    |      Signature       | `extrinsics[extrinsic_number].args.transaction.eip2930.oddYParity/r/s` |
    |    Sender address    |      `extrinsics[extrinsic_number].events[event_number].data[0]`       |
    |  Recipient address   |      `extrinsics[extrinsic_number].events[event_number].data[1]`       |
    |       EVM hash       |      `extrinsics[extrinsic_number].events[event_number].data[2]`       |
    | EVM execution status |      `extrinsics[extrinsic_number].events[event_number].data[3]`       |

!!! note
    For Substrate transactions, the "Nonce" and "Signature" fields are under `extrinsics[extrinsic_number]`. For EVM transactions, the "Nonce" and "Signature" fields are under `extrinsics[extrinsic_number].args.transaction[transaction_type]`, leaving the "Nonce" and "Signature" under `extrinsics[extrinsic_number]` to be `null`.

    A successfully executed EVM transaction will return either `succeed: "Stopped"` or `succeed: "Returned"` under the "EVM Execution Status" field.

### ERC-20 Token Transfers {: #erc-20-token-transfers }

Events emitted by smart contracts such as an ERC-20 token contract deployed on Moonbeam can be decoded from Sidecar block JSON objects. The nesting structure is as following:

```text
RESPONSE JSON Block Object:
    |--extrinsics
        |--{extrinsic_number}
            |--method
                |--pallet: "ethereum"
                |--method: "transact"
            |--signature:
            |--nonce: 
            |--args
                |--transaction
                    |--{transaction_type}
            |--hash
            |--events
                |--{event_number}
                    |--method
                        |--pallet: "evm"
                        |--method: "Log"
                    |--data
                        |--0
                            |-- address
                            |-- topics
                                |--0
                                |--1
                                |--2
					        |-- data
            ...
    ...

```

Moonbeam ERC-20 token transfers will emit the [`Transfer`](https://eips.ethereum.org/EIPS/eip-20){target=\_blank} event which can be decoded as the following:

|     Tx Information      |                           Block JSON Field                            |
|:-----------------------:|:---------------------------------------------------------------------:|
| ERC-20 contract address |  `extrinsics[extrinsic_number].events[event_number].data[0].address`  |
|  Event signature hash   | `extrinsics[extrinsic_number].events[event_number].data[0].topics[0]` |
|     Sender address      | `extrinsics[extrinsic_number].events[event_number].data[0].topics[1]` |
|    Recipient address    | `extrinsics[extrinsic_number].events[event_number].data[0].topics[2]` |
|         Amount          |   `extrinsics[extrinsic_number].events[event_number].data[0].data`    |

Other events emitted by EVM smart contracts can be decoded in a similar fashion, but the content of the topics and data fields will change depending on the definition of the specific event.

!!! note
    The amount transferred is given in Wei and in hexadecimal format.

## Sample Code for Monitoring Native Token Transfers { #sample-code-for-monitoring-native-token-transfers }

The [Transfers API page](/learn/core-concepts/transfers-api/#using-substrate-api-sidecar){target=\_blank} has a code snippet demonstrating how to use Substrate API Sidecar to retrieve and decode native token transfers sent with both Substrate and Ethereum APIs on Moonbeam networks. You can reference that as a starting point to build out backends that utilize Sidecar to listen to transfers on Moonbeam networks.

## Calculating Transaction Fees {: #calculating-transaction-fees }

For more detailed information and sample code on how to calculate the transaction fees of Moonbeam transactions using Substrate Sidecar API, please check the [Calculating Transaction Fees on Moonbeam](/learn/core-concepts/tx-fees/){target=\_blank} page.

--8<-- 'text/_disclaimers/third-party-content.md'
