---
title: Index Data with SubQuery & GraphQL
description: Learn how to use SubQuery to index Substrate and EVM chain data for Moonbeam and Moonriver, and query the data using GraphQL.
categories: Indexer Nodes and Queries
---

# Indexing Moonbeam with SubQuery

## Introduction {: #introduction }

[SubQuery](https://subquery.network){target=\_blank} is a data aggregation layer that operates between the layer-1 blockchains (such as Moonbeam and Polkadot) and DApps. This service unlocks blockchain data and transforms it into a queryable state so that it can be used in intuitive applications. It allows DApp developers to focus on their core use case and front end without needing to waste time on building a custom back end for data processing.

SubQuery supports indexing the Ethereum Virtual Machine (EVM) and Substrate data for any of the Moonbeam networks. A key advantage of using SubQuery is that you can flexibly collect query data across both Moonbeam's EVM and Substrate code with a single project and tool, and then query this data using GraphQL.

For example, SubQuery can filter and query EVM logs and transactions in addition to Substrate data sources. SubQuery introduces more advanced filters than other indexers, allowing filtering of non-contract transactions, transaction senders, contracts, and indexed log arguments, so developers can build a wide variety of projects that cater to their specific data needs.

This quick-start guide will show you how to create a SubQuery project and configure it to index Substrate and EVM data on Moonbeam.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Checking Prerequisites {: #checking-prerequisites }

Later on in this guide, you have the option of deploying your project to a locally running SubQuery node. To do so, you need to have the following installed on your system:

 - [Docker](https://docs.docker.com/get-started/get-docker/){target=\_blank}
 - [Docker Compose](https://docs.docker.com/compose/install){target=\_blank}

!!! note
    If Docker Compose was installed for Linux via the `sudo apt install docker-compose` command, you might run into some errors later on in the guide. Please be sure to follow the instructions for Linux from the official [Install Docker Compose](https://docs.docker.com/compose/install){target=\_blank} guide.

## Create a Project {: #create-a-project }

To get started, you'll need to [create a SubQuery project](https://subquery.network/doc/quickstart/quickstart.html){target=\_blank}:

1. Globally install the [SubQuery CLI](https://subquery.network/doc/indexer/quickstart/quickstart.html#_1-install-the-subquery-cli){target=\_blank}:

    === "npm"

        ```bash
        npm install -g @subql/cli
        ```

    === "yarn"

        ```bash
        yarn global add @subql/cli
        ```    

!!! note
    Using yarn to install `@subql/cli` is discouraged due to its poor dependency management, which can result in various errors.

2. Initialize your SubQuery project using the following command:

    ```bash
    subql init PROJECT_NAME
    ```

3. You'll be prompted to answer a series of questions:

    1. For the **Select a network family** question, although Moonbeam is EVM compatible, the Moonbeam templates are under the **Polkadot** family, so you can choose **Polkadot**

        --8<-- 'code/builders/integrations/indexers/subquery/terminal/select-network-polkadot.md'

    2. The next screen will prompt you to **Select a network**. You can choose between Moonbeam and Moonriver

        !!! note
            To build a project on Moonbase Alpha, you can select either network and adapt it later on

        --8<-- 'code/builders/integrations/indexers/subquery/terminal/select-network-moonbeam.md'

    3. You'll be prompted to **Select a template project**. Depending on the network you chose in the prior step, the template options may vary

        === "Moonbeam"

            |             Template             |                                                                             Description                                                                              |
            |:--------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
            |      `moonbeam-evm-starter`      |                                           A starter EVM project that indexes ERC-20 `Transfer` events and `approve` calls                                            |
            | `moonbeam-substrate-evm-starter` | A starter Substrate and EVM project that indexes ERC-20 `Transfer` events and calls to the Staking Pallet's `joinCandidates` and `executeLeaveCandidates` extrinsics |
            |        `Moonbeam-starter`        |                                        A starter Substrate project that indexes balance transfers through the Balances Pallet                                        |

        === "Moonriver"

            |        Template         |                                      Description                                       |
            |:-----------------------:|:--------------------------------------------------------------------------------------:|
            | `moonriver-evm-starter` |    A starter EVM project that indexes ERC-20 `Transfer` events and `approve` calls     |
            |   `Moonriver-starter`   | A starter Substrate project that indexes balance transfers through the Balances Pallet |

        --8<-- 'code/builders/integrations/indexers/subquery/terminal/select-template.md'

    4. You'll be prompted to add additional information, such as the RPC endpoint, the project's author, and the description of the project. For these, you can just hit enter and accept the default or customize them as you see fit

        !!! note
            To avoid hitting the rate limits of public RPC endpoints, it is recommended to have your own endpoint and API key, which you can get from one of the supported [Endpoint Providers](/builders/get-started/endpoints/){target=\_blank}

        --8<-- 'code/builders/integrations/indexers/subquery/terminal/select-rpc.md'

4. After you've gone through all of the prompts, the starter project will be cloned. You'll just need to install dependencies from within the project directory:

    === "npm"

        ```bash
        cd PROJECT_NAME && npm install
        ```

    === "yarn"

        ```bash
        cd PROJECT_NAME && yarn install
        ```

## Configure the Network {: #configure-the-network }

The template projects already come pre-configured for the network selected while initializing your project. However, if you're working off of an existing project or want to configure your project for Moonbase Alpha instead of Moonbeam or Moonriver, you can update the network configurations in the `project.ts` file.

The `network` configuration is as follows for each network:

=== "Moonbeam"

    ```ts
    network: {
      chainId: 
        '0xfe58ea77779b7abda7da4ec526d14db9b1e9cd40a217c34892af80a9b332b76d',
      endpoint: ['{{ networks.moonbeam.rpc_url }}'],
      chaintypes: {
        file: ./dist/chaintypes.js,
      },
    },
    ```

=== "Moonriver"

    ```ts
    network: {
      chainId: '0x401a1f9dca3da46f5c4091016c8a2f26dcea05865116b286f60f668207d1474b',
      endpoint: ['{{ networks.moonriver.rpc_url }}'],
      chaintypes: {
        file: ./dist/chaintypes.js,
      },
    },
    ```

=== "Moonbase Alpha"

    ```ts
    network: {
      chainId: '0x91bc6e169807aaa54802737e1c504b2577d4fafedd5a02c10293b1cd60e39527',
      endpoint: ['{{ networks.moonbase.rpc_url }}'],
      chaintypes: {
        file: ./dist/chaintypes.js,
      },
    },
    ```

 --8<-- 'text/_common/endpoint-examples.md'

## Modify the GraphQL Schema {: #modify-the-graphql-schema }

In the `schema.graphql` file, you can use GraphQL entities to define the shape of your data. Once you've edited the GraphQL schema for your needs, you'll need to generate the required GraphQL models. To do so, you can run the following command:

=== "npm"

    ```bash
    npm run codegen
    ```

=== "yarn"

    ```bash
    yarn codegen
    ```

--8<-- 'code/builders/integrations/indexers/subquery/terminal/codegen.md'

The generated models will be created in the `src/types/models` directory. These models will be used in the mapping handlers that process the indexed data.

!!! note
    If you make changes to the `schema.graphql` file, you'll need to regenerate your types.

## Index Substrate Data {: #index-substrate-data }

The `project.ts` file is the entry point into your indexer; it defines what type of data to index and the mapping functions that are responsible for handling and processing the indexed data.

To index Substrate data, you'll need to ensure that the type of the `project` is `SubstrateProject`.

```ts
const project: SubstrateProject = { ... }
```

### The Substrate Data Source {: #the-substrate-data-source }

In the `project.dataSources` array, you'll define the Substrate data source and the data to be indexed. The format of the data source is as follows:

```ts
datasources: [
  {
    kind: 'substrate/Runtime',
    startBlock: INSERT_START_BLOCK,
    endBlock: INSERT_END_BLOCK,
    mapping: {
      file: './dist/index.js',
      handlers: [
        {
          kind: 'INSERT_HANDLER_KIND',
          handler: 'INSERT_HANDLER_FUNCTION_NAME',
          filter: {
            'INSERT_FILTER_TYPE': 'INSERT_FILTER',
          },
        },
      ],
    },
  },
],
```

Each property can be defined as follows:

- `kind` - the kind of data source that you'll use, which for Substrate data is the `substrate/Runtime` source
- `startBlock` - (optional) the block from which the indexer will start processing blocks
- `endBlock` - (optional) after this block, the indexer will stop processing blocks
- `mapping` - the data to be indexed and the handlers for the data
    - `file` - the entry path for the mapping
    - `handlers` - the handlers for specific kinds of data
        - `kind` - the kind of handler. For Substrate data, there are three kinds: `substrateBlockHandler`, `substrate/EventHandler`, and `substrate/CallHandler`
        - `handler` - the name of the handler function that will process this data
        - `filter` - (optional) the filter type and data that will trigger a mapping handler. For example, what block, event, or extrinsic to index

### Substrate Mapping Handlers {: #substrate-mapping-handlers }

Using only certain handlers and filters will improve your indexer's efficiency. The handlers available for Substrate data are as follows:

- The [block handler](https://subquery.network/doc/indexer/build/mapping/polkadot.html#block-handler){target=\_blank} is used to index block data and is called once for every block. As such, this type of handler will slow your project down significantly and should only be used if absolutely necessary. The supported filters for the block handler are: `specVersion`, `modulo`, and `timestamp`

    |    Filter     |                                                                    Description                                                                    |                                             Example                                             |
    |:-------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------:|
    | `specVersion` |                                              Filters the blocks that fall into a spec version range                                               | `specVersion: [null, 2000]` <br> `# Indexes blocks with a spec` <br> `version between 0 - 2000` |
    |   `modulo`    |                                                         Filters the blocks at an interval                                                         |                             `modulo: 50 # Indexes every 50 blocks`                              |
    |  `timestamp`  | Filters the blocks at a time interval (in UTC). <br> Accepts a valid [cron expression](https://github.com/roccivic/cron-converter){target=\_blank} |               `timestamp: '*5/ * * * *'` <br> `# Indexes blocks every 5 minutes`                |

- The [event handler](https://subquery.network/doc/indexer/build/mapping/polkadot.html#event-handler){target=\_blank} is used to index certain Substrate events that are part of the runtime. The supported filters for the event handler are: `module` and `method`

    |  Filter  |                      Description                      |       Example        |
    |:--------:|:-----------------------------------------------------:|:--------------------:|
    | `module` | Filters the pallet (module) that the event belongs to | `module: 'balances'` |
    | `method` |                   Filters the event                   | `method: 'Transfer'` |

- The [call handler](https://subquery.network/doc/indexer/build/mapping/polkadot.html#call-handler){target=\_blank} is used to index certain Substrate extrinsics. The supported filters for the call handler are: `module`, `method`, `success`, and `isSigned`

    |   Filter   |                      Description                      |       Example        |
    |:----------:|:-----------------------------------------------------:|:--------------------:|
    |  `module`  | Filters the pallet (module) that extrinsic belongs to | `module: 'balances'` |
    |  `method`  |                 Filters the extrinsic                 | `method: 'Transfer'` |
    | `success`  |          Filters extrinsics based on outcome          |   `success: true`    |
    | `isSigned` |  Filters extrinsics based on whether they're signed   |   `isSigned: true`   |

## Index Ethereum Data {: #index-ethereum-data }

The `project.ts` file is the entry point into your indexer; it defines what type of data to index and the mapping functions that are responsible for handling and processing the indexed data.

To index Substrate data, you'll need to ensure that the type of the `project` is `SubstrateProject<FrontierEvmDatasource>`.

```ts
const project: SubstrateProject<FrontierEvmDatasource> = { ... }
```

### The EVM Data Source {: #the-evm-data-source }

In the `project.dataSources` array, you'll define the EVM data source and the data to be indexed. The EVM data source is powered by a data processor specifically made to work with Moonbeam’s implementation of Frontier. It allows you to reference specific ABI resources used by the processor to parse arguments and the smart contract address that the events are from or the call is made to. In general, it acts as middleware that can provide extra filtering and data transformation.

The format of the data source is as follows:

```ts
datasources: [
  {
    kind: 'substrate/FrontierEvm',
    startBlock: INSERT_START_BLOCK,
    endBlock: INSERT_END_BLOCK,
    processor: {
      file: './node_modules/@subql/frontier-evm-processor/dist/bundle.js',
      options: {
        abi: '',
        address: '',
      },
    },
    assets: ''
    mapping: {
      file: './dist/index.js',
      handlers: [
        {
          kind: 'INSERT_HANDLER_KIND',
          handler: 'INSERT_HANDLER_FUNCTION_NAME',
          filter: {
            'INSERT_FILTER_TYPE': 'INSERT_FILTER',
          },
        },
      ],
    },
  },
],
```

Each property can be defined as follows:

- `kind` - the kind of data source that you'll use, which for EVM data is the `substrate/FrontierEVM` source
- `startBlock` - (optional) the block from which the indexer will start processing blocks
- `endBlock` - (optional) after this block, the indexer will stop processing blocks
- `processor` - the Frontier EVM data processor configuration
    - `file` - the file where the data processor code lives
    - `options` - (optional) the [processor options](https://subquery.network/doc/build/substrate-evm.html#processor-options){target=\_blank} specific to the Frontier EVM processor
        - `abi` - (optional) the ABI that is used to parse arguments. The `abi` value must be a key in the `assets` configuration
        - `address` - (optional) the contract address where the event is emitted from or the call is made to. Using `null` will capture contract creation calls
    - `assets` - (optional) an object of external asset ABI files
- `mapping` - the data to be indexed and the handlers for the data
    - `file` - the entry path for the mapping
    - `handlers` - the handlers for specific kinds of data
        - `kind` - the kind of handler. For EVM data, there are two kinds: `substrate/FrontierEvmCall` and `substrate/FrontierEvmEvent`
        - `handler` - the name of the handler function that will process this data
        - `filter` - (optional) the filter type and data that will trigger a mapping handler. For example, what block, event, or extrinsic to index

### Frontier EVM Mapping Handlers {: #evm-mapping-handlers }

Using only certain handlers and filters will improve your indexer's efficiency. The handlers available for EVM data are as follows:

- The [Frontier EVM call handler](https://subquery.network/doc/indexer/build/substrate-evm.html#call-handlers){target=\_blank} is used to index transactions that are formatted based on [Ethers `TransactionResponse` type](https://docs.ethers.org/v5/api/providers/types/#providers-TransactionResponse){target=\_blank}, but varies slightly. For information on the exact changes, please refer to [SubQuery's documentation](https://subquery.network/doc/indexer/build/substrate-evm.html#handler-functions){target=\_blank}. The supported filters for the call handler are: `function` and `from`

    |   Filter   |                        Description                        |                                    Example                                    |
    |:----------:|:---------------------------------------------------------:|:-----------------------------------------------------------------------------:|
    | `function` |    Filters the call by function signature or selector     | `function: '0x095ea7b3'` <br> `function: 'approve(address to,uint256 value)'` |
    |   `from`   | Filters the call by the address that sent the transaction |             `from: '0x6bd193ee6d2104f14f94e2ca6efefae561a4334b'`              |

- The [Frontier EVM event handler](https://subquery.network/doc/indexer/build/substrate-evm.html#event-handlers){target=\_blank} is used to index certain EVM events. The supported filter for the event handler is: `topics`

    |  Filter  |                                                                  Description                                                                   |                                   Example                                   |
    |:--------:|:----------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------:|
    | `topics` | Filters the event log by topics, which follows the [Ethereum JSON-RPC log filters](https://docs.ethers.org/v5/concepts/events/){target=\_blank} | `topics: 'Transfer(address indexed from,address indexed to,uint256 value)'` |

## Run Your Indexer {: #run-your-indexer }

To run your indexer locally using Docker, you can take the following steps:

1. Build your project:

    === "npm"

        ```bash
        npm run build
        ```

    === "yarn"

        ```bash
        yarn build
        ```

    --8<-- 'code/builders/integrations/indexers/subquery/terminal/npm-run-build.md'

    !!! note
        If you make changes to the `project.ts` file, you'll need to rebuild your project.

2. Start up the Docker container for your indexer:

    === "npm"

        ```bash
        npm run start:docker
        ```

    === "yarn"

        ```bash
        yarn start:docker
        ```

    --8<-- 'code/builders/integrations/indexers/subquery/terminal/logs.md'

3. Head to `http://localhost:3000` to open the GraphQL playground and submit queries. You can open up the **DOCS** or **SCHEMA** tab on the playground as a reference when creating your queries

    !!! note
        It may take a few minutes before the GraphQL server is ready. You'll be able to access the playground after you see the following log:

        ```bash
        substrate-demo-graphql-engine-1  | <subql-query> INFO Started playground at `http://localhost:3000`
        ```

    ![The GraphQL playground in the browser.](/images/builders/integrations/indexers/subquery/subquery-1.webp)

And that's it! For a step-by-step tutorial on how to use the `moonbeam-substrate-evm-starter` template project, you can refer to [SubQuery's Moonbeam (EVM) Quick Start documentation](https://subquery.network/doc/indexer/quickstart/quickstart_chains/polkadot-moonbeam.html){target=\_blank}.

--8<-- 'text/_disclaimers/third-party-content.md'
