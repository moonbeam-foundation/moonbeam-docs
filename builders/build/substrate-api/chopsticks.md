---
title: How to use Chopsticks to Fork Moonbeam
description: Follow this tutorial to learn the basic of how to use Chopstick to locally fork the entirety of a Moonbeam network.
---

# How to Use Chopsticks to Fork Moonbeam

![Chopsticks diagram](/images/builders/build/substrate-api/polkadot-js-api/polkadot-js-api-banner.png)

## Introduction {: #introduction }

Chopsticks is a library for building Substrate-based blockchain applications. Most importantly, Chopsticks provides a developer-friendly method of locally forking existing Substrate based chains. This allows developers to test and experiment with their own custom blockchain configurations in a local development environment, without the need to deploy a live network.  

Overall, Chopsticks aims to simplify the process of building blockchain applications on Substrate and make it accessible to a wider range of developers.

## Checking Prerequeisites {: #checking-prerequisites }

To use Chopsticks, you will need the following:  

- Have a recent version of [Rust installed](https://www.rust-lang.org/tools/install){target=_blank} 
- Have [Yarn](https://classic.yarnpkg.com/en/){target=_blank} installed  
- Have [Docker](https://docs.docker.com/get-docker/){target=_blank} installed

## Configuring Chopsticks {: configuring-chopsticks }

First, install chopsticks from its GitHub repository, add dependencies, and build it:  

```
git clone --recurse-submodules https://github.com/AcalaNetwork/chopsticks.git && cd chopsticks
yarn
yarn build-wasm
```

Chopsticks includes a set of [YAML configuration files that can be used to create a local copy of a variety of Substrate chains. You can view each of the default configuration files within the `configs` folder. Moonbeam, Moonriver, and Moonbase Alpha all have default files available. The example configuration below is the current  configuration for Moonbeam:  

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

The settings that can be included in the config file are the same as the flags in the [`yarn start dev` command](#forking-moonbeam), as well as these additional options:  

|          Option          |                                           Description                                               |
|:------------------------:|:---------------------------------------------------------------------------------------------------:|
|         genesis          | The link to a parachain's raw genesis file to build the fork from.                                  |
|        timestamp         | TIME AAAAH IM RUNNING OUT AAAAH                                 |

## Forking Moonbeam {: #forking-moonbeam }

The simplest way to fork Moonbeam is through the previously introduced configuration files:  

=== "Moonbeam"
    ```
    yarn start dev --config=configs/moonbeam.yml
    ```

=== "Moonriver"
    ```
    yarn start dev --config=configs/moonriver.yml
    ```

=== "Moonbase Alpha"
    ```
    yarn start dev --config=configs/moonbase-alpha.yml
    ```

A configuration file is not necessary, however. There are additional commands and flags to configure the environment completely in the command line.  

The `yarn start dev` command forks a chain, and includes following flags:  

|           Flag           |                                           Description                                               |
|:------------------------:|:---------------------------------------------------------------------------------------------------:|
|         endpoint         | The endpoint of the parachain to fork.                                                              |
|          block           | Use to specify at which block hash or number to replay the fork.                                    |
|      wasm-override       | Path of the WASM to use as the parachain, instead of forking an endpoint.                           |
|            db            | Path to the name of the file that stores or will store the parachain's database.                    |
|          config          | Path to the config file.                                                                            |
|           port           | The port to expose an endpoint on.                                                                  |
|      build-block-mode    | How blocks should be built in the fork: batch, manual, instant.                                     |
|      import-storage      | A pre-defined JSON/YAML storage file path to override in the parachain's storage.                   |
| allow-unresolved-imports | Whether to allow WASM unresolved imports when using a WASM to build the parachain.                  |
|       import-storage     | Include to generate storage diff preview between blocks.                                            |
|    mock-signature-host   | Mock signature host so any signature starts with 0xdeadbeef and filled by 0xcd is considered valid. |

### Interacting with a Fork {: #interacting-with-a-fork }

When running a fork, by default it will be accessible at `ws://localhost:8000`. You will be able to interact with the parachain via libraries such as [polkadot.js](https://github.com/polkadot-js/common){target=_blank} and its [locally built user interface](https://github.com/polkadot-js/apps){target=_blank}.  

**Go into building polkadotjs apps and connecting**

## Replaying and Dissecting Blocks {: #replaying-and-dissecting-blocks }

In the case where you would like to replay a block and retrieve its information to dissect the effects of an extrinsic, you can use the `yarn start run-block` command. Its following flags are:  

|           Flag           |                                           Description                                               |
|:------------------------:|:---------------------------------------------------------------------------------------------------:|
|         endpoint         | The endpoint of the parachain to fork.                                                              |
|          block           | Use to specify at which block hash or number to replay the fork.                                    |
|      wasm-override       | Path of the WASM to use as the parachain, instead of forking an endpoint.                           |
|            db            | Path to the name of the file that stores or will store the parachain's database.                    |
|          config          | Path to the config file.                                                                            |
| output-path=/[file_path] | Use to print out results to a JSON file.                                                            |
|           html           | Include to generate an HTML representation of the storage diff preview between blocks.              |
|           open           | Whether to open the HTML representation.                                                            |

Similarly, you can use the `yarn start dry-run` command to run an extrinsic within a specific block to see its outcome. It has many of the same flags as the `run-block` command:  

|           Flag           |                                           Description                                               |
|:------------------------:|:---------------------------------------------------------------------------------------------------:|
|         endpoint         | The endpoint of the parachain to fork.                                                              |
|          block           | Use to specify at which block hash or number to replay the fork.                                    |
|            at            | Use to specify at which block hash to replay the fork.                                              |
|         preimage         | Use to specify the preimage on which to replay the fork.                                            |
|      wasm-override       | Path of the WASM to use as the parachain, instead of forking an endpoint.                           |
|            db            | Path to the name of the file that stores or will store the parachain's database.                    |
|          config          | Path to the config file.                                                                            |
|  output-path=[file_path] | Use to print out results to a JSON file.                                                            |
|           html           | Include to generate an HTML representation of the storage diff preview between blocks.              |
|           open           | Whether to open the HTML representation.                                                            |
|         extrinsic        | The calldata of the extrinsic to call with the dry run.                                             |
|          address         | Required with extrinsic: the address that calls the extrinsic in the dry run.                       |
