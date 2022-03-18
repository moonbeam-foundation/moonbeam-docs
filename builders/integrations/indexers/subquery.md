---
title: SubQuery
description: Learn how to use SubQuery to index Substrate and EVM data for Moonbeam and Moonriver
---

# Indexing Moonbeam with SubQuery

![SubQuery Banner](/images/builders/integrations/indexers/subquery/subquery-banner.png)

## Introduction {: #introduction }

[SubQuery](https://subquery.network/){target=_blank} is a data aggregation layer that operates between the layer-1 blockchains (such as Moonbeam and Polkadot) and DApps. This service unlocks blockchain data and transforms it to a queryable state so that it can be used in intuitive applications. It allows DApp developers to focus on their core use case and front end, without needing to waste time on building a custom back end for data processing.

SubQuery supports indexing the Ethereum Virtual Machine (EVM) and Substrate data for any of the Moonbeam networks. A key advantage of using SubQuery is that you can flexibly collect query data across both Moonbeam's EVM and Substrate code with a single project and tool, and then query this data using GraphQL.

For example, SubQuery can filter and query EVM logs and transactions in addition to Substrate data sources. SubQuery introduces more advanced filters than other indexers, allowing filtering of non-contract transactions, transaction senders, contracts and indexed log arguments, so developers can build a wide variety of projects that cater to their specific data needs.

## Checking Prerequisites {: #checking-prerequisites }

Later on in this guide, you have the option of deploying your project to a locally running SubQuery node. To do so, you need to have the following installed on your system:

 - [Docker](https://docs.docker.com/get-docker/){target=_blank}
 - [Docker Compose](https://docs.docker.com/compose/install/){target=_blank}

## Getting Started {: #getting-started }

To get started, you'll need to [create a SubQuery project](https://doc.subquery.network/create/introduction/){target=_blank}.

In general, you will need to:

1. Globally install the SubQuery CLI:

    ```
    npm install -g @subql/cli
    ```

2. Create a directory for your SubQuery project:

    ```
    mkdir subquery-example && cd subquery-example
    ```

3. Initialize your SubQuery project using the following command:

    ```
    subql init PROJECT_NAME
    ```

    You'll be prompted to enter a series of questions. For the **Select a network** question, you can choose any of the Moonbeam networks: **Moonbeam**, **Moonriver**, **Moonbeam Alpha**. For the RPC endpoint question, you can enter in the [Network Endpoint](/builders/get-started/endpoints/){target=_blank} for the specific network you're creating the project for

4. Install dependencies from within your project directory:

    ```
    cd PROJECT_NAME && npm install
    ```

After the initialization is complete, you'll have a base SubQuery project that contains the following files (among others):

- **`project.yaml`** - the [Manifest File](https://doc.subquery.network/create/manifest/){target=_blank} which acts as the entry point of your project
- **`schema.graphql`** - the [GraphQL Schema](https://doc.subquery.network/create/graphql/){target=_blank} which defines the shape of your data
- **`src/mappings/mappingHandlers.ts`** - exports the [Mapping](https://doc.subquery.network/create/mapping/){target=_blank} functions which are used to define how chain data is transformed into the GraphQL entities that are defined in the schema

The process to index Moonbeam data takes only two steps: [adding the Moonbeam custom data source](#adding-the-moonbeam-custom-data-source){target=_blank} and then [indexing the Moonbeam data](#indexing-moonbeam-data){target=_blank}.

## Adding the Moonbeam Custom Data Source {: #adding-the-moonbeam-custom-data-source }

A data source defines the data that will be filtered and extracted. It also defines the location of the mapping function handler for the data transformation to be applied.

SubQuery has created a data processor specifically made to work with Moonbeam’s implementation of [Frontier](https://github.com/paritytech/frontier){target=_blank}. It allows you to reference specific ABI resources used by the processor to parse arguments and the smart contract address that the events are from or the call is made to. In general, it acts as middleware that can provider extra filtering and data transformation.

1. From within your SubQuery project, you can add the custom data source as a dependency by running the following [NPM](https://www.npmjs.com/){target=_blank} command:

    ```
    npm install @subql/contract-processors
    ```

2. Add the [Moonbeam custom data source](https://doc.subquery.network/create/moonbeam/#data-source-spec){target=_blank} to your `project.yaml` manifest file:

    ```yaml
    dataSources:
      - kind: substrate/Moonbeam
        processor:
          file: './node_modules/@subql/contract-processors/dist/moonbeam.js'
          options: {...}
        assets: {...}
        mapping: {...}
    ```

The fields in the above configuration can be broken down as follows:

- **kind** - *required* field that specifies the custom Moonbeam data processor
- **processor.file** - *required* field that references the file where the data processor code lives
- **processor.options** - includes [options](https://doc.subquery.network/create/moonbeam/#processor-options){target=_blank} specific to the Moonbeam processor including the `abi` that is used by the processor to parse arguments. As well as the `address` where the contract event is from or the call is made to
- **assets** - an object of external asset ABI files
- **mapping** - the mapping specification. This includes the path to the mapping entry, the mapping functions, and their corresponding handler types, with any additional mapping filters

## Setup the GraphQL Schema {: #setup-the-graphql-schema }

In the `schema.graphql` file, you can update it to include a `Transaction` and `Approval` entity. Later on in the guide, you'll listen for transaction events and approval calls.

```
type Transaction @entity {
  id: ID! # Transaction hash
  value: BigInt!
  to: String!
  from: String!
  contractAddress: String!
}

type Approval @entity {
  id: ID! # Transaction hash
  value: BigInt!
  owner: String!
  spender: String!
  contractAddress: String!
}
```

## Indexing Moonbeam Data {: #indexing-moonbeam-data }

Next, you can add the mapping specification and handlers for the custom data source to your code. The mapping specification includes the [mapping functions](https://doc.subquery.network/create/mapping/#){target=_blank} that define how chain data is transformed.

Your sample SubQuery project contains three mapping functions which are found under `src/mappings/mappingHandlers.ts`. These mapping functions transform off chain data to the GraphQL entities that you define. The three handlers are as follows:

- **Block handler** - used to capture information each time a new block is added to the network. This function is called once for every block
- **Event handler** - used to capture information where certain events are emitted within a new block. As this function will be called anytime an event is emitted, you can use mapping filters to only handle events you need. This will improve performance and reduce indexing times
- **Call handler** - used to capture information for certain extrinsics

In your sample SubQuery project, you'll notice that the event passed in to the `handleEvent` mapping function is a `SubstrateEvent`. Similarly, the extrinsic passed into the `handleCall` mapping function is a `SubstrateExtrinsic`. For Moonbeam, your mapping functions will receive a [`MoonbeamEvent`](https://doc.subquery.network/create/moonbeam/#moonbeamevent){target=_blank}  and a [`MoonbeamCall`](https://doc.subquery.network/create/moonbeam/#moonbeamcall){target=_blank} instead. These are based on Ether's [TransactionResponse](https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse){target=_blank} or [Log](https://docs.ethers.io/v5/api/providers/types/#providers-Log){target=_blank} type.

To update your sample SubQuery project to be used for Moonbeam, you can take the following steps:

1. Import the following:

    ```js
    import { MoonbeamEvent, MoonbeamCall } from '@subql/contract-processors/dist/moonbeam';
    import { Approval, Transaction } from "../types";
    ```

    The `Approval` and `Transaction` types will be automatically generated in the following steps

2. Replace the `handleEvent` function with a Moonbeam-specific mapping function. For this example, the `handleMoonbeamEvent` function will build a new transaction based off of a transaction event and save it: 

    ```js
    export async function handleMoonbeamEvent(event: MoonbeamEvent<TransferEventArgs>): Promise<void> {
        const transaction = new Transaction(event.transactionHash);

        transaction.value = event.args.value.toBigInt();
        transaction.from = event.args.from;
        transaction.to = event.args.to;
        transaction.contractAddress = event.address;

        await transaction.save();
    }
    ```

3. Replace the `handleCall` function with a Moonbeam-specific mapping function. For this example, the `handleMoonbeamCall` function will build a new approval based off of an approval function call and save it: 

    ```js
    export async function handleMoonbeamCall(event: MoonbeamCall<ApproveCallArgs>): Promise<void> {
        const approval = new Approval(event.hash);

        approval.owner = event.from;
        approval.value = event.args._value.toBigInt();
        approval.spender = event.args._spender;
        approval.contractAddress = event.to;

        await approval.save();
    }
    ```

4. To actually use the `MoonbeamEvent` and `MoonbeamCall` handlers, and the `handleMoonbeamEvent` and `handleMoonbeamCall` mapping functions, you can add them to your `project.yaml` manifest file:

    ```yaml
        mapping:
          file: './dist/index.js'
          handlers:
            - handler: handleMoonbeamEvent
              kind: substrate/MoonbeamEvent
              filter: {...}
            - handler: handleMoonbeamCall
              kind: substrate/MoonbeamCall
              filter: {...}
    ```

    !!! note
        You can also use the `filter` field to only listen to certain events or specific function calls. 

5. Generate the required GraphQL models defined in your GraphQL schema file:

    ```
    npm run codegen
    ```

6. Either [publish your project](https://doc.subquery.network/publish/publish/){target=_blank} to [SubQuery Projects](https://project.subquery.network/){target=_blank} or [run a SubQuery node locally](https://doc.subquery.network/run/run/){target=_blank} using Docker

    ```
    docker-compose pull && docker-compose up
    ```

    !!! note
        It may take some time to download the required packages for the first time but soon you'll see a running SubQuery node.

7. Now you can query your project by opening your browser to http://localhost:3000, where you'll find a GraphQL playground. On the top right of the playground, you'll find a **Docs** button that will open a documentation drawer. This documentation is automatically generated and helps you find what entities and methods you can query

    ```
    {
      query {
        {...}
      }
    }
    ```

Congratulations! You now have a Moonbeam SubQuery project that accepts GraphQL API queries!

## Example Projects {: #example-projects }

To view the complete example project that you just created, you can check out the [GitHub repository](https://github.com/subquery/tutorials-moonriver-evm-starter){target=_blank} or it's also accessible via the [live SubQuery project on the SubQuery Explorer](https://explorer.subquery.network/subquery/subquery/moonriver-evm-starter-project){target=_blank}.

If you have any questions about this make sure you check out the [SubQuery documentation for Moonbeam](https://doc.subquery.network/create/moonbeam){target=_blank} or reach out to the SubQuery team on the #technical-support channel in the [SubQuery Discord](https://discord.com/invite/subquery){target=_blank}.

Feel free to clone the [example project on GitHub](https://github.com/subquery/tutorials-moonriver-evm-starter){target=_blank}.

As you can see, creating a Moonbeam, Moonriver, or Moonbase Alpha project that indexes both Substrate and EVM data in a single project is extremely simple. You can use SubQuery’s advanced scaffolding tools to speed up your DApp development and take advantage of richer indexing for your data to build more intuitive DApps.

### Moonbuilders Tutorial

SubQuery joined the [Moonbuilders workshop](https://www.crowdcast.io/e/moonbuilders-ws/10){target=_blank} in December to show off live how to create a simple SubQuery project. You can try out the [resulting sample project](https://github.com/stwiname/moonbuilders-demo){target=_blank} by yourself.
