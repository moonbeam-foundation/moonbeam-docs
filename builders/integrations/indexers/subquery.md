---
title: Index Data with SubQuery & GraphQL
description: Learn how to use SubQuery to index Substrate and EVM chain data for Moonbeam and Moonriver, and query the data using GraphQL.
---

# Indexing Moonbeam with SubQuery

## Introduction {: #introduction }

[SubQuery](https://subquery.network/){target=_blank} is a data aggregation layer that operates between the layer-1 blockchains (such as Moonbeam and Polkadot) and DApps. This service unlocks blockchain data and transforms it to a queryable state so that it can be used in intuitive applications. It allows DApp developers to focus on their core use case and front end, without needing to waste time on building a custom back end for data processing.

SubQuery supports indexing the Ethereum Virtual Machine (EVM) and Substrate data for any of the Moonbeam networks. A key advantage of using SubQuery is that you can flexibly collect query data across both Moonbeam's EVM and Substrate code with a single project and tool, and then query this data using GraphQL.

For example, SubQuery can filter and query EVM logs and transactions in addition to Substrate data sources. SubQuery introduces more advanced filters than other indexers, allowing filtering of non-contract transactions, transaction senders, contracts and indexed log arguments, so developers can build a wide variety of projects that cater to their specific data needs.

Throughout this guide, you'll learn how to create a SubQuery project that indexes ERC-20 transfer and approvals on Moonbeam. More specifically, this guide will cover indexing `Transfer` events and `approve` function calls.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Checking Prerequisites {: #checking-prerequisites }

Later on in this guide, you have the option of deploying your project to a locally running SubQuery node. To do so, you need to have the following installed on your system:

 - [Docker](https://docs.docker.com/get-docker/){target=_blank}
 - [Docker Compose](https://docs.docker.com/compose/install/){target=_blank}

!!! note
    If Docker Compose was installed for Linux via the `sudo apt install docker-compose` command you might run into some errors later on in the guide. Please be sure to follow the instructions for Linux from the official [Install Docker Compose](https://docs.docker.com/compose/install/){target=_blank} guide.

## Creating a Project {: #creating-a-project }

To get started, you'll need to [create a SubQuery project](https://academy.subquery.network/quickstart/quickstart.html){target=_blank}. You can create a project for Moonbeam, Moonriver, or Moonbase Alpha. For the purposes of this guide, Moonbeam will be used.

In general, you will need to:

1. Globally install the SubQuery CLI:

    ```bash
    npm install -g @subql/cli
    ```

    !!! note
        At time of writing this guide, the version used was 1.3.1.

2. Initialize your SubQuery project using the following command:

    ```bash
    subql init PROJECT_NAME
    ```

3. You'll be prompted to answer a series of questions:

    1. For the **Select a network family** question, you can choose **Substrate**

        ![Select Moonbeam](/images/builders/integrations/indexers/subquery/subquery-1.png)

    2. The next screen will prompt you to **Select a network**. At time of writing this guide, Moonriver was the only option. You can go ahead and choose **Moonriver**, and it can be adapted for Moonbeam or Moonbase Alpha

        ![Select moonbeam-starter](/images/builders/integrations/indexers/subquery/subquery-2.png)

    3. You'll be prompted to **Select a template project**. You can choose between the EVM starter project or creating a project from a git endpoint. Since this guide will be based off of the Moonriver EVM starter project, you can select **moonriver-evm-starter**

        ![Select moonbeam-starter](/images/builders/integrations/indexers/subquery/subquery-3.png)

    4. The starter project will be cloned, and then you will be prompted to answer a few more questions. For these, you can just hit enter and accept the default or customize them as you see fit

        ![Create project](/images/builders/integrations/indexers/subquery/subquery-4.png)

4. A directory will automatically be created for your SubQuery project. You'll just need to install dependencies from within the project directory:

    ```bash
    cd PROJECT_NAME && yarn install
    ```

After the initialization is complete, you'll have a base SubQuery project that contains the following files (among others):

- **[`project.yaml`](https://github.com/subquery/tutorials-frontier-evm-starter/blob/moonriver/project.yaml){target=_blank}** - the [Manifest File](https://academy.subquery.network/build/manifest/polkadot.html){target=_blank} which acts as the entry point of your project
- **[`schema.graphql`](https://github.com/subquery/tutorials-frontier-evm-starter/blob/moonriver/schema.graphql){target=_blank}** - the [GraphQL Schema](https://academy.subquery.network/build/graphql.html){target=_blank} which defines the shape of your data. The template includes `Transaction` and `Approval` entities
- **[`src/mappings/mappingHandlers.ts`](https://github.com/subquery/tutorials-frontier-evm-starter/blob/moonriver/src/mappings/mappingHandlers.ts){target=_blank}** - exports the [Mapping](https://academy.subquery.network/build/mapping/polkadot.html){target=_blank} functions which are used to define how chain data is transformed into the GraphQL entities that are defined in the schema
- **[`src/chaintypes.ts`](https://github.com/subquery/tutorials-frontier-evm-starter/blob/moonriver/src/chaintypes.ts){target=_blank}** - exports the chain types specifically for Moonbeam so you can index Moonbeam data
- **[`erc20.abi.json`](https://github.com/subquery/tutorials-frontier-evm-starter/blob/moonriver/erc20.abi.json){target=_blank}** - JSON file containing the ABI for the standard ERC-20 interface which will be used to filter ERC-20 transfer and approval data

If you take a look at the `package.json` file, you'll notice that the `chaintypes` are exported there. If for some reason they are not, or if you're expanding upon an existing Substrate project to add Moonbeam support, you'll need to include the following snippet:

```json
  "exports": {
    "chaintypes": "src/chaintypes.ts"
  }
```

## Updating the Network Configuration {: #updating-the-network-configuration }

You'll need to update the `network` config in the `project.yaml` file. The `chainId` field can be used to enter the genesis hash for the network you want to index.

 --8<-- 'text/_common/endpoint-examples.md'

The `network` config is as follows for each network:

=== "Moonbeam"

    ```yaml
    network:
    chainId: '0xfe58ea77779b7abda7da4ec526d14db9b1e9cd40a217c34892af80a9b332b76d'
    endpoint: '{{ networks.moonbeam.rpc_url }}'
    dictionary: 'https://api.subquery.network/sq/subquery/moonbeam-dictionary'
    chaintypes:
      file: ./dist/chaintypes.js
    ```

=== "Moonriver"

    ```yaml
    network:
    chainId: '0x401a1f9dca3da46f5c4091016c8a2f26dcea05865116b286f60f668207d1474b'
    endpoint: '{{ networks.moonriver.rpc_url }}'
    dictionary: 'https://api.subquery.network/sq/subquery/moonriver-dictionary'
    chaintypes:
      file: ./dist/chaintypes.js
    ```

=== "Moonbase Alpha"

    ```yaml
    network:
    chainId: '0x91bc6e169807aaa54802737e1c504b2577d4fafedd5a02c10293b1cd60e39527'
    endpoint: '{{ networks.moonbase.rpc_url }}'
    dictionary: 'https://api.subquery.network/sq/subquery/moonbase-alpha-dictionary'
    chaintypes:
      file: ./dist/chaintypes.js
    ```
  
## The Moonbeam Custom Data Source {: #moonbeam-custom-data-source }

You'll also need to update the `dataSources` config which can be found in the `project.yaml` file. A data source defines the data that will be filtered and extracted. It also defines the location of the mapping function handler for the data transformation to be applied.

SubQuery has created a data processor specifically made to work with Moonbeam’s implementation of [Frontier](https://github.com/paritytech/frontier){target=_blank}. It allows you to reference specific ABI resources used by the processor to parse arguments and the smart contract address that the events are from or the call is made to. In general, it acts as middleware that can provide extra filtering and data transformation. The Frontier EVM processor is already a dependency if you're using the template. If you are starting from scratch, make sure to install it:

```bash
yarn add @subql/frontier-evm-processor
```

If you're using the template, you'll notice that the ERC-20 ABI is already declared under `dataSources.processor.options`. The address already listed is for the [Solarbeam (SOLAR) token](https://moonriver.moonscan.io/address/0x6bd193ee6d2104f14f94e2ca6efefae561a4334b){target=_blank} on Moonriver. For this example, you can use the [Wrapped GLMR (WGLMR) token](https://moonscan.io/address/0xAcc15dC74880C9944775448304B263D191c6077F){target=_blnk} address on Moonbeam: `0xAcc15dC74880C9944775448304B263D191c6077F`.

The fields in the `dataSources` configuration can be broken down as follows:

- **kind** - *required* field that specifies the custom Moonbeam data processor
- **startBlock** - field that specifies the block to start indexing data from
- **processor.file** - *required* field that references the file where the data processor code lives
- **processor.options** - includes [processor options](https://academy.subquery.network/build/substrate-evm.html#processor-options){target=_blank} specific to the Frontier EVM processor including the `abi` that is used by the processor to parse arguments. As well as the `address` where the contract event is from or the call is made to
- **assets** - an object of external asset ABI files
- **mapping** - the mapping specification. This includes the path to the mapping entry, the mapping functions, and their corresponding handler types, with any additional mapping filters

## The GraphQL Schema {: #setup-the-graphql-schema }

In the `schema.graphql` file, the template includes a `Transaction` and `Approval` entity. Later on in the guide, you'll listen for transaction events and approval calls.

```gql
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

To generate the required GraphQL models defined in your schema file, you can run the following:

```bash
yarn codegen
```

![yarn codegen results](/images/builders/integrations/indexers/subquery/subquery-5.png)

These models will be used in the mapping handlers covered in the next section.

## Mapping Handlers {: #mapping-handlers }

The mapping specification includes the [mapping functions](https://academy.subquery.network/build/mapping/polkadot.html){target=_blank} that define how chain data is transformed.

The template contains two mapping functions which are found under `src/mappings/mappingHandlers.ts`. These mapping functions transform off chain data to the GraphQL entities that you define. The two handlers are as follows:

- **[Event handler](https://academy.subquery.network/build/substrate-evm.html#event-handlers){target=_blank}** - used to capture information where certain events are emitted within a new block. As this function will be called anytime an event is emitted, you can use mapping filters to only handle events you need. This will improve performance and reduce indexing times
- **[Call handler](https://academy.subquery.network/build/substrate-evm.html#call-handlers){target=_blank}** - used to capture information for certain extrinsics

In a traditional Substrate project, the event passed in to the `handleEvent` mapping function is a `SubstrateEvent`. Similarly, the extrinsic passed into the `handleCall` mapping function is a `SubstrateExtrinsic`. For Moonbeam, your mapping functions will receive a `FrontierEvmEvent` and a `FrontierEvmCall` instead. These are based on Ether's [TransactionResponse](https://docs.ethers.org/v6/api/providers/#TransactionResponse){target=_blank} or [Log](https://docs.ethers.org/v6/api/providers/#Log){target=_blank} type.

For this example, the `FrontierEvmEvent` will be used to handle and filter `Transfer` events and the `FrontierEvmCall` will be used to handle and filter `approve` function calls. You can add additional handlers as needed.

The mapping handlers are then configured in the `project.yaml` manifest file under the `dataSources` configuration. You'll create a `mapping.handlers.handler` configuration for each handler you have. The `handleMoonbeamEvent` and `handleMoonbeamCall` handlers are already configured in the template

To adapt the template for the WGLMR token on Moonbeam, you'll need to update the `from` field under `mapping.handlers.handler.filter` to be the WGLMR contract address:

```yaml
mapping:
  file: './dist/index.js'
  handlers:
    - handler: handleMoonbeamEvent
      kind: substrate/FrontierEvmEvent
      filter:
        topics:
          - Transfer(address indexed from,address indexed to,uint256 value)
          - null
          - null
          - null
    - handler: handleMoonbeamCall
      kind: substrate/FrontierEvmCall
      filter:
        function: approve(address to,uint256 value)
        from: '0xAcc15dC74880C9944775448304B263D191c6077F'
```

!!! note
    You can also use the `filter` field to only listen to certain events or specific function calls.

## Deploying your Project {: #deploying-your-project }

To deploy your project to SubQuery's hosted service, it is mandatory to build your configuration before upload. You can do so by running:

```bash
yarn build
```

![yarn build results](/images/builders/integrations/indexers/subquery/subquery-6.png)

Next you can choose to either [publish your project](https://academy.subquery.network/run_publish/publish.html){target=_blank} to [SubQuery Projects](https://project.subquery.network/){target=_blank} or [run a SubQuery node locally](https://academy.subquery.network/run_publish/run.html){target=_blank} using Docker. To do so you can run:

```bash
docker-compose pull && docker-compose up
```

![docker-compose logs](/images/builders/integrations/indexers/subquery/subquery-7.png)

!!! note
    It may take some time to download the required packages for the first time but soon you'll see a running SubQuery node.

It might take a minute or two for your database to spin up and your node to start syncing, but you should eventually see your node start to fetch blocks.

![fetching blocks logs](/images/builders/integrations/indexers/subquery/subquery-8.png)

Now you can query your project by opening your browser to [http://localhost:3000](http://localhost:3000){target=_blank}, where you'll find a GraphQL playground. On the top right of the playground, you'll find a **Docs** button that will open a documentation drawer. This documentation is automatically generated and helps you find what entities and methods you can query.

![GraphQL playground](/images/builders/integrations/indexers/subquery/subquery-9.png)

Congratulations! You now have a Moonbeam SubQuery project that accepts GraphQL API queries! Please note that depending on your configured start block, it could take a couple of days to index Moonbeam.

## Example Projects {: #example-projects }

To view the complete example project for Moonriver, you can checkout the [live Moonriver EVM Starter Project on the SubQuery Explorer](https://explorer.subquery.network/subquery/subquery/moonriver-evm-starter-project){target=_blank}. Or you can also view additional projects from the [SubQuery Explorer](https://explorer.subquery.network/){target=_blank}.

If you have any questions about this make sure you check out the [SubQuery documentation for Substrate EVM Support](https://academy.subquery.network/build/substrate-evm.html){target=_blank} or reach out to the SubQuery team on the #technical-support channel in the [SubQuery Discord](https://discord.com/invite/subquery){target=_blank}.

### Moonbuilders Tutorial {: #moonbuilders-tutorial }

SubQuery joined the [Moonbuilders workshop](https://www.crowdcast.io/e/moonbuilders-ws/10){target=_blank} in December to show off live how to create a simple SubQuery project. You can try out the [resulting sample project](https://github.com/stwiname/moonbuilders-demo){target=_blank} by yourself.

--8<-- 'text/_disclaimers/third-party-content.md'
