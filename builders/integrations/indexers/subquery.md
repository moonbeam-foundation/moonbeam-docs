---
title: Index Data with SubQuery & GraphQL
description: Learn how to use SubQuery to index Substrate and EVM chain data for Moonbeam and Moonriver, and query the data using GraphQL.
---

# Indexing Moonbeam with SubQuery

![SubQuery Banner](/images/builders/integrations/indexers/subquery/subquery-banner.png)

## Introduction {: #introduction }

[SubQuery](https://subquery.network/){target=_blank} is a data aggregation layer that operates between the layer-1 blockchains (such as Moonbeam and Polkadot) and DApps. This service unlocks blockchain data and transforms it to a queryable state so that it can be used in intuitive applications. It allows DApp developers to focus on their core use case and front end, without needing to waste time on building a custom back end for data processing.

SubQuery supports indexing the Ethereum Virtual Machine (EVM) and Substrate data for any of the Moonbeam networks. A key advantage of using SubQuery is that you can flexibly collect query data across both Moonbeam's EVM and Substrate code with a single project and tool, and then query this data using GraphQL.

For example, SubQuery can filter and query EVM logs and transactions in addition to Substrate data sources. SubQuery introduces more advanced filters than other indexers, allowing filtering of non-contract transactions, transaction senders, contracts and indexed log arguments, so developers can build a wide variety of projects that cater to their specific data needs.

Throughout this guide, you'll learn how to create a SubQuery project that indexes ERC-20 transfer and approvals on Moonbeam. More specifically, this guide will cover indexing `Transfer` events and `approve` function calls.

## Checking Prerequisites {: #checking-prerequisites }

Later on in this guide, you have the option of deploying your project to a locally running SubQuery node. To do so, you need to have the following installed on your system:

 - [Docker](https://docs.docker.com/get-docker/){target=_blank}
 - [Docker Compose](https://docs.docker.com/compose/install/){target=_blank}

!!! note
    If Docker Compose was installed for Linux via the `sudo apt install docker-compose` command you might run into some errors later on in the guide. Please be sure to follow the instructions for Linux from the official [Install Docker Compose](https://docs.docker.com/compose/install/){target=_blank} guide.

## Creating a Project {: #creating-a-project }

To get started, you'll need to [create a SubQuery project](https://doc.subquery.network/create/introduction/){target=_blank}. You can create a project for Moonbeam, Moonriver, or Moonbase Alpha. For the purposes of this guide, Moonbeam will be used. 

In general, you will need to:

1. Globally install the SubQuery CLI:

    ```
    npm install -g @subql/cli
    ```

2. Initialize your SubQuery project using the following command:

    ```
    subql init PROJECT_NAME
    ```

3. You'll be prompted to answer a series of questions:

    1. For the **Select a network** question, you can choose any of the Moonbeam networks. For this example, you can select **Moonbeam**

        ![Select Moonbeam](/images/builders/integrations/indexers/subquery/subquery-1.png)    

    2. For each of the networks, you can then select a template project. There are starter projects available for each of the networks. For Moonriver specifically, you can choose between the standard starter project and an EVM starter project. This guide will be based off of the Moonriver EVM starter project, but will be built from the standard starter project available for Moonbeam. You can go ahead and select **moonbeam-starter**

        ![Select moonbeam-starter](/images/builders/integrations/indexers/subquery/subquery-2.png)    

    3. The starter project will be cloned, and then you will be prompted to answer a few more questions. For these, you can just hit enter and accept the default or customize them as you see fit

        ![Create project](/images/builders/integrations/indexers/subquery/subquery-2.png)   

4. A directory will automatically be created for your SubQuery project. You'll just need to install dependencies from within the project directory:

    ```
    cd PROJECT_NAME && yarn install
    ```

After the initialization is complete, you'll have a base SubQuery project that contains the following files (among others):

- **`project.yaml`** - the [Manifest File](https://doc.subquery.network/create/manifest/){target=_blank} which acts as the entry point of your project
- **`schema.graphql`** - the [GraphQL Schema](https://doc.subquery.network/create/graphql/){target=_blank} which defines the shape of your data
- **`src/mappings/mappingHandlers.ts`** - exports the [Mapping](https://doc.subquery.network/create/mapping/){target=_blank} functions which are used to define how chain data is transformed into the GraphQL entities that are defined in the schema
- **`src/chaintypes.ts`** - exports the chain types specifically for Moonbeam so you can index Moonbeam data

If you take a look at the `package.json` file, you'll notice that the `chaintypes` are exported there. If for some reason they are not, or if you're expanding upon an existing Substrate project to add Moonbeam support, you'll need to include the following snippet:

```json
  "exports": {
    "chaintypes": "src/chaintypes.ts"
  }
```

## Adding the ERC-20 Contract ABI {: #adding-the-erc-20-contract-abi }

To index ERC-20 data, you'll need to add a JSON file containing the ABI of the ERC-20. You can use the ABI for the standard ERC-20 interface and it will work for all ERC-20 contracts that use this generic interface.

To create the file you can run:

```sh
touch erc20.abi.json
```

Then you can copy and paste in the [ABI for the ERC-20 Interface](https://www.github.com/PureStake/moonbeam-docs/blob/master/.snippets/code/subquery/erc20-abi.md){target=_blank} to the JSON file.

In the next steps, you'll be able to use the ABI to filter ERC-20 transfer and approval data.

## Adding the Moonbeam Custom Data Source {: #adding-the-moonbeam-custom-data-source }

A data source defines the data that will be filtered and extracted. It also defines the location of the mapping function handler for the data transformation to be applied.

SubQuery has created a data processor specifically made to work with Moonbeam’s implementation of [Frontier](https://github.com/paritytech/frontier){target=_blank}. It allows you to reference specific ABI resources used by the processor to parse arguments and the smart contract address that the events are from or the call is made to. In general, it acts as middleware that can provide extra filtering and data transformation.

For this example, you'll need to specify the ERC-20 ABI in the processor options. You can also specify a contract address for a specific ERC-20 token so that the processor only returns data for the given token. You can use the Wrapped GLMR (WGLMR) token address: `0xAcc15dC74880C9944775448304B263D191c6077F`.

1. From within your SubQuery project, you can add the custom data source as a dependency by running the following command:

    ```
    yarn add @subql/contract-processors
    ```

2. Replace the existing `dataSources` section with the [Frontier EVM custom data source](https://doc.subquery.network/create/substrate-evm/#data-source-spec){target=_blank} to your `project.yaml` manifest file:

    ```yaml
    dataSources:
      - kind: substrate/FrontierEvm
        startBlock: 1
        processor:
          file: './node_modules/@subql/contract-processors/dist/frontierEvm.js'
          options:
            abi: erc20 # this must match one of the keys in the assets field
            address: '0xAcc15dC74880C9944775448304B263D191c6077F' # optionally get data for a specific contract (WGLMR)
        assets: 
          erc20:
            file: './erc20.abi.json'
        mapping: {...} # the data for this field will be added later on in this guide
    ```

The fields in the above configuration can be broken down as follows:

- **kind** - *required* field that specifies the custom Moonbeam data processor
- **startBlock** - field that specifies the block to start indexing data from
- **processor.file** - *required* field that references the file where the data processor code lives
- **processor.options** - includes [processor options](https://doc.subquery.network/create/substrate-evm/#processor-options){target=_blank} specific to the Frontier EVM processor including the `abi` that is used by the processor to parse arguments. As well as the `address` where the contract event is from or the call is made to
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

You can check out the complete [schema.graphql file for this example on GitHub](https://www.github.com/PureStake/moonbeam-docs/blob/master/.snippets/code/subquery/schema.graphql.md){target=_blank}.

## Indexing Moonbeam Data {: #indexing-moonbeam-data }

Next, you can add the mapping specification and handlers for the custom data source to your code. The mapping specification includes the [mapping functions](https://doc.subquery.network/create/mapping/#){target=_blank} that define how chain data is transformed.

Your sample SubQuery project contains three mapping functions which are found under `src/mappings/mappingHandlers.ts`. These mapping functions transform off chain data to the GraphQL entities that you define. The three handlers are as follows:

- **Block handler** - used to capture information each time a new block is added to the network. This function is called once for every block
- **Event handler** - used to capture information where certain events are emitted within a new block. As this function will be called anytime an event is emitted, you can use mapping filters to only handle events you need. This will improve performance and reduce indexing times
- **Call handler** - used to capture information for certain extrinsics

In your sample SubQuery project, you'll notice that the event passed in to the `handleEvent` mapping function is a `SubstrateEvent`. Similarly, the extrinsic passed into the `handleCall` mapping function is a `SubstrateExtrinsic`. For Moonbeam, your mapping functions will receive a [`FrontierEvmEvent`](https://doc.subquery.network/create/substrate-evm/#frontierevmevent){target=_blank}  and a [`FrontierEvmCall`](https://doc.subquery.network/create/moonbeam/#frontierevmcall){target=_blank} instead. These are based on Ether's [TransactionResponse](https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse){target=_blank} or [Log](https://docs.ethers.io/v5/api/providers/types/#providers-Log){target=_blank} type.

For this example, the `FrontierEvmEvent` will be used to handle and filter `Transfer` events and the `FrontierEvmCall` will be used to handle and filter `approve` function calls.

Before updating your project for Moonbeam, you'll need to install [ethers.js](https://docs.ethers.io/){target=_blank} which will be used to specify types for the transfer and approval event arguments:

```
yarn add ethers
```

Now to update your sample SubQuery project to be used for Moonbeam, you can take the following steps:

1. Replace the existing imports with the following:

    ```js
    import { FrontierEvmEvent, FrontierEvmCall } from '@subql/contract-processors/dist/frontierEvm';
    import { Approval, Transaction } from "../types";
    import { BigNumber } from "ethers";
    ```

    The `Approval` and `Transaction` types will be automatically generated in the following steps

2. Setup the types for the transfer events and approve calls based on the ERC-20 ABI

    ```ts
    type TransferEventArgs = [string, string, BigNumber] & { from: string; to: string; value: BigNumber; };
    type ApproveCallArgs = [string, BigNumber] & { _spender: string; _value: BigNumber; }
    ```

3. You can remove the preexisting `handleBlock` function

4. Replace the `handleEvent` function with a Moonbeam-specific mapping function. For this example, the `handleMoonbeamEvent` function will build a new transaction based off of a transaction event and save it: 

    ```ts
    export async function handleMoonbeamEvent(event: FrontierEvmEvent<TransferEventArgs>): Promise<void> {
        const transaction = new Transaction(event.transactionHash);

        transaction.value = event.args.value.toBigInt();
        transaction.from = event.args.from;
        transaction.to = event.args.to;
        transaction.contractAddress = event.address;

        await transaction.save();
    }
    ```

5. Replace the `handleCall` function with a Moonbeam-specific mapping function. For this example, the `handleMoonbeamCall` function will build a new approval based off of an approval function call and save it: 

    ```ts
    export async function handleMoonbeamCall(event: FrontierEvmCall<ApproveCallArgs>): Promise<void> {
        const approval = new Approval(event.hash);

        approval.owner = event.from;
        approval.value = event.args._value.toBigInt();
        approval.spender = event.args._spender;
        approval.contractAddress = event.to;

        await approval.save();
    }
    ```

6. To actually use the `FrontierEvmEvent` and `FrontierEvmCall` handlers, and the `handleMoonbeamEvent` and `handleMoonbeamCall` mapping functions, you can add them to your `project.yaml` manifest file (under `dataSources`):

    ```yaml
        mapping:
          file: './dist/index.js'
          handlers:
            - handler: handleMoonbeamEvent
              kind: substrate/FrontierEvmEvent
              filter:
                topics:
                  - Transfer(address indexed from,address indexed to,uint256 value)
            - handler: handleMoonbeamCall
              kind: substrate/FrontierEvmCall
              filter:
                function: approve(address to,uint256 value)
                from: '0xAcc15dC74880C9944775448304B263D191c6077F'
    ```

    !!! note
        You can also use the `filter` field to only listen to certain events or specific function calls. 

7. Generate the required GraphQL models defined in your GraphQL schema file:

    ```
    yarn codegen
    ```

    ![yarn codegen results](/images/builders/integrations/indexers/subquery/subquery-4.png)   

8. To deploy your project to SubQuery's hosted service, it is mandatory to build your configuration before upload. You can do so by running:

    ```
    yarn build
    ```

    ![yarn build results](/images/builders/integrations/indexers/subquery/subquery-5.png)   

9. Either [publish your project](https://doc.subquery.network/publish/publish/){target=_blank} to [SubQuery Projects](https://project.subquery.network/){target=_blank} or [run a SubQuery node locally](https://doc.subquery.network/run/run/){target=_blank} using Docker

    ```
    docker-compose pull && docker-compose up
    ```

    ![docker-compose logs](/images/builders/integrations/indexers/subquery/subquery-6.png)   

    !!! note
        It may take some time to download the required packages for the first time but soon you'll see a running SubQuery node.

You can checkout the complete [mappingHandlers.ts file](https://www.github.com/PureStake/moonbeam-docs/blob/master/.snippets/code/subquery/mappingHandlers.ts.md){target=_blank} and [project.yaml file for this example on GitHub](https://www.github.com/PureStake/moonbeam-docs/blob/master/.snippets/code/subquery/project.yaml.md){target=_blank}.

It might take a minute or two for your database to spin up and your node to start syncing, but you should eventually see your node start to fetch blocks.

![fetching blocks logs](/images/builders/integrations/indexers/subquery/subquery-7.png)   

Now you can query your project by opening your browser to http://localhost:3000, where you'll find a GraphQL playground. On the top right of the playground, you'll find a **Docs** button that will open a documentation drawer. This documentation is automatically generated and helps you find what entities and methods you can query.

![GraphQL playground](/images/builders/integrations/indexers/subquery/subquery-8.png)   

Congratulations! You now have a Moonbeam SubQuery project that accepts GraphQL API queries! Please note that depending on your configured start block, it could take a couple of days to index Moonbeam. 

## Example Projects {: #example-projects }

To view a complete example project that is similar to the one you just created, but built on Moonriver, you can check out the [SubQuery Moonriver EVM Starter GitHub repository](https://github.com/subquery/tutorials-frontier-evm-starter){target=_blank} or it's also accessible via the [live SubQuery project on the SubQuery Explorer](https://explorer.subquery.network/subquery/subquery/moonriver-evm-starter-project){target=_blank}.

If you have any questions about this make sure you check out the [SubQuery documentation for Substrate EVM Support](https://doc.subquery.network/create/substrate-evm/){target=_blank} or reach out to the SubQuery team on the #technical-support channel in the [SubQuery Discord](https://discord.com/invite/subquery){target=_blank}.

Feel free to clone the [Moonriver EVM Starter example project on GitHub](https://github.com/subquery/tutorials-frontier-evm-starter){target=_blank}.

As you can see, creating a Moonbeam, Moonriver, or Moonbase Alpha project that indexes both Substrate and EVM data in a single project is extremely simple. You can use SubQuery’s advanced scaffolding tools to speed up your DApp development and take advantage of richer indexing for your data to build more intuitive DApps.

### Moonbuilders Tutorial

SubQuery joined the [Moonbuilders workshop](https://www.crowdcast.io/e/moonbuilders-ws/10){target=_blank} in December to show off live how to create a simple SubQuery project. You can try out the [resulting sample project](https://github.com/stwiname/moonbuilders-demo){target=_blank} by yourself.
