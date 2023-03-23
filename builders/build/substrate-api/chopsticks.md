---
title: How to use Chopsticks to Fork Moonbeam
description: Learn the basics of how to use Chopsticks to replay blocks, dissect state changes, test XCM interactions, and locally fork the entirety of a Moonbeam network.
---

# How to Use Chopsticks to Fork Moonbeam

![Chopsticks diagram](/images/builders/build/substrate-api/chopsticks/chopsticks-banner.png)

## Introduction {: #introduction }

[Chopsticks](https://github.com/AcalaNetwork/chopsticks){target=_blank} provides a developer-friendly method of locally forking existing Substrate based chains. It allows for the replaying of blocks to easily examine how extrinsics effect state, the forking of multiple blocks for XCM testing, and more. This allows developers to test and experiment with their own custom blockchain configurations in a local development environment, without the need to deploy a live network.  

Overall, Chopsticks aims to simplify the process of building blockchain applications on Substrate and make it accessible to a wider range of developers.

## Checking Prerequisites {: #checking-prerequisites }

To use Chopsticks, you will need the following:  

- Have [Node](https://nodejs.org/en/download/){target=_blank} installed  
- Have [Docker](https://docs.docker.com/get-docker/){target=_blank} installed
- (Optional) Have a recent version of [Rust installed](https://www.rust-lang.org/tools/install){target=_blank} 

## Configuring Chopsticks {: configuring-chopsticks }

There are two ways to use Chopsticks. The first and recommended way is by installing it as a package:  

```
yarn add @acala-network/chopsticks
```

The alternate option is to clone Chopsticks from its GitHub repository, add dependencies, and build it. Note that the commands in this guide will assume that you are using the package installation, which uses `npx @acala-network/chopsticks` or `yarn dlx` instead of `npm run` or `yarn start` for local builds:  

```
git clone --recurse-submodules https://github.com/AcalaNetwork/chopsticks.git && \
cd chopsticks && \
yarn && \
yarn build-wasm
```

Chopsticks includes a set of [YAML](https://yaml.org/){target=_blank} configuration files that can be used to create a local copy of a variety of Substrate chains. You can view each of the default configuration files within the `configs` folder of the [source repository](https://github.com/AcalaNetwork/chopsticks.git){target=_blank}. Moonbeam, Moonriver, and Moonbase Alpha all have default files available. The example configuration below is the current configuration for Moonbeam:  

```yaml
endpoint: wss://wss.api.moonbeam.network
mock-signature-host: true
db: ./db.sqlite

import-storage:
  System:
    Account:
      -
        -
          - "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"
        - data:
            free: "100000000000000000000000"
  TechCommitteeCollective:
    Members: ["0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"]
  CouncilCollective:
    Members: ["0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"]
  TreasuryCouncilCollective:
    Members: ["0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"]
  AuthorFilter:
    EligibleRatio: 100
    EligibleCount: 100
```

The settings that can be included in the config file are the same as the flags in the [`dev` command](#forking-moonbeam){target=_blank}, as well as these additional options:  

|  Option   |                                        Description                                         |
|:---------:|:------------------------------------------------------------------------------------------:|
|  genesis  | The link to a parachain's raw genesis file to build the fork from, instead of an endpoint. |
| timestamp |                            Timestamp of the block to fork from.                            |

## Forking Moonbeam {: #forking-moonbeam }

The simplest way to fork Moonbeam is through the previously introduced configuration files:  

=== "Moonbeam"
    ```
    npx @acala-network/chopsticks dev --config=https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonbeam.yml
    ```

=== "Moonriver"
    ```
    npx @acala-network/chopsticks dev --config=https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonriver.yml
    ```

=== "Moonbase Alpha"
    ```
    npx @acala-network/chopsticks dev --config=https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonbase-alpha.yml
    ```

A configuration file is not necessary, however. There are additional commands and flags to configure the environment completely in the command line.  

The `npx @acala-network/chopsticks dev` command forks a chain, and includes following flags:  

|           Flag           |                                             Description                                             |
|:------------------------:|:---------------------------------------------------------------------------------------------------:|
|         endpoint         |                               The endpoint of the parachain to fork.                                |
|          block           |                  Use to specify at which block hash or number to replay the fork.                   |
|      wasm-override       |         Path of the WASM to use as the parachain runtime, instead of an endpoint's runtime.         |
|            db            |          Path to the name of the file that stores or will store the parachain's database.           |
|          config          |                                   Path or URL of the config file.                                   |
|           port           |                                 The port to expose an endpoint on.                                  |
|     build-block-mode     |                   How blocks should be built in the fork: batch, manual, instant.                   |
|      import-storage      |          A pre-defined JSON/YAML storage file path to override in the parachain's storage.          |
| allow-unresolved-imports |         Whether to allow WASM unresolved imports when using a WASM to build the parachain.          |
|      import-storage      |                      Include to generate storage diff preview between blocks.                       |
|   mock-signature-host    | Mock signature host so any signature starts with 0xdeadbeef and filled by 0xcd is considered valid. |

### Interacting with a Fork {: #interacting-with-a-fork }

When running a fork, by default it will be accessible at `ws://localhost:8000`. You will be able to interact with the parachain via libraries such as [Polkadot.js](https://github.com/polkadot-js/common){target=_blank} and its [user interface, Polkadot.js Apps](https://github.com/polkadot-js/apps){target=_blank}.  

You can interact with Chopsticks via the [Polkadot.js Apps hosted user interface](https://polkadot.js.org/apps/#/explorer){target=_blank}. To do so, visit the page and take the following steps:

1. Click the icon in the top left
2. Go to the bottom and open **Development**
3. Select the **Custom** endpoint and enter `ws://localhost:8000`
4. Click the **Switch** button

![Open WSS](/images/builders/build/substrate-api/chopsticks/chopsticks-1.png)
![Switch WSS](/images/builders/build/substrate-api/chopsticks/chopsticks-2.png)

You should now be able to interact with the fork as you would an active parachain or relay chain.

!!! note
    If your browser cannot connect to the WebSocket endpoint provided by Chopsticks, you might need to allow insecure connections for the Polkadot.js Apps URL. Another solution is to run the [Docker version of Polkadot.js Apps](https://github.com/polkadot-js/apps#docker){target=_blank}.

## Replaying Blocks {: #replaying-blocks }

In the case where you would like to replay a block and retrieve its information to dissect the effects of an extrinsic, you can use the `npx @acala-network/chopsticks run-block` command. Its following flags are:  

|           Flag           |                                      Description                                       |
|:------------------------:|:--------------------------------------------------------------------------------------:|
|         endpoint         |                         The endpoint of the parachain to fork.                         |
|          block           |            Use to specify at which block hash or number to replay the fork.            |
|      wasm-override       |  Path of the WASM to use as the parachain runtime, instead of an endpoint's runtime.   |
|            db            |    Path to the name of the file that stores or will store the parachain's database.    |
|          config          |                            Path or URL of the config file.                             |
| output-path=/[file_path] |   Use to print out results to a JSON file instead of printing it out in the console.   |
|           html           | Include to generate an HTML representation of the storage diff preview between blocks. |
|           open           |                        Whether to open the HTML representation.                        |

For example, running the following command will re-run Moonbeam's block 1000, and write the storage diff and other data in a `moonbeam-output.json` file:  

```
npx @acala-network/chopsticks run-block --endpoint wss://wss.api.moonbeam.network --block 1000 --output-path=./moonbeam-output.json
```

## XCM Testing {: #xcm-testing }

To test out XCM messages between networks, you can fork multiple parachains and a relay chain locally. For example, the following will fork Moonriver, Karura, and Kusama given that you've downloaded the [config folder from the GitHub repository](https://github.com/AcalaNetwork/chopsticks/tree/master/configs){target=_blank}:  

```
npx @acala-network/chopsticks xcm --relaychain=configs/kusama.yml --parachain=configs/moonriver.yml --parachain=configs/karura.yml
```

You should see something like the following output:  

```
[12:48:58.766] INFO (rpc/21840): Moonriver RPC listening on port 8000
[12:49:03.266] INFO (rpc/21840): Karura RPC listening on port 8001
[12:49:03.565] INFO (xcm/21840): Connected parachains [2000,2023]
[12:49:07.058] INFO (rpc/21840): Kusama RPC listening on port 8002
[12:49:07.557] INFO (xcm/21840): Connected relaychain 'Kusama' with parachain 'Moonriver'
[12:49:08.227] INFO (xcm/21840): Connected relaychain 'Kusama' with parachain 'Karura'
```

Including the `relaychain` command is optional, as Chopsticks will automatically mock a relay chain between networks.  

## WebSocket Commands

Chopsticks' internal websocket server has special endpoints that allows the manipulation of the local Substrate chain. These are the methods that can be invoked:  

|     Method     |    Parameters     |                          Description                          |
|:--------------:|:-----------------:|:-------------------------------------------------------------:|
|  dev_newBlock  |      options      |               Generates one or more new blocks.               |
| dev_setStorage | values, blockHash |         Create or overwrite the value of any storage.         |
| dev_timeTravel |       date        |     Sets the timestamp of the block to the `date` value.      |
|  dev_setHead   |   hashOrNumber    | Sets the head of the blockchain to a specific hash or number. |

Each method can be invoked by connecting to the websocket (`ws://localhost:8000` by default) and sending the data and parameters in the following format. Replace `METHOD_NAME` with the name of the method, and replace or delete `PARAMETER_1` and `PARAMETER_2` with the parameter data relevant to the method:  

```
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "METHOD_NAME",
    "params": [PARAMETER_1, PARAMETER_2...]
}
```

Parameters can be described in the following ways:  

- **`options` { "to": number, "count": number }** - optional, leave `null` to create one block. Use `"to"` to create blocks up to a certain value, use `"count"` to increase by a certain number of blocks  
- **`values` Object** - a JSON object resembling the path to a storage value, similar to what you would retrieve via Polkadot.js  
- **`blockHash` string** - optional, the blockhash at which the storage value is changed
- **`date` string** - a Date string (compatible with the JavaScript Date library) that will change the time stamp from which the next blocks being created will be at. All future blocks will be sequentially after that point in time
- **`hashOrNumber` number | string** - if found, the chain head will be set to the block with the block number or block hash of this value

--8<-- 'text/disclaimers/third-party-content.md'