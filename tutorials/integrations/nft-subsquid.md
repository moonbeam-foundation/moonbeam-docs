---
title: Index NFT Transfers with SQD (Subsquid)
description: Learn how to use SQD (formerly Subsquid), a query node framework for Substrate-based chains, to index and process NFT transfer data for Moonbeam and Moonriver.
---

# Indexing NFT Transfers on Moonbeam with SQD (formerly Subsquid)

_by Massimo Luraschi_

## Introduction {: #introduction }

[SQD (formerly Subsquid)](https://subsquid.io){target=\_blank} is a data network that allows rapid and cost-efficient retrieval of blockchain data from 100+ chains using SQD's decentralized data lake and open-source SDK.

The SDK offers a highly customizable Extract-Transform-Load-Query stack and indexing speeds of up to and beyond 50,000 blocks per second when indexing events and transactions.

SQD has native and full support for the Ethereum Virtual Machine (EVM) and Substrate data. This allows developers to extract on-chain data from any of the Moonbeam networks, process EVM logs and Substrate entities (events, extrinsic, and storage items) in one single project, and serve the resulting data with one single GraphQL endpoint. With SQD, filtering by EVM topic, contract address, and block range are all possible.

This guide will explain how to create a SQD project (also known as a _"Squid"_) from a template (indexing Moonsama transfers on Moonriver) and change it to index ERC-721 token transfers on the Moonbeam network. As such, you'll be looking at the `Transfer` EVM event topics. This guide can be adapted for Moonbase Alpha as well.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Checking Prerequisites {: #checking-prerequisites }

For a Squid project to be able to run, you need to have the following installed:

- Familiarity with Git
- [Node.js](https://nodejs.org/en/download/package-manager){target=\_blank} version 16 or later
- [Docker](https://docs.docker.com/get-docker){target=\_blank}
- [Squid CLI](https://docs.subsquid.io/squid-cli/installation/){target=\_blank}

## Scaffold a Project From a Template {: #scaffolding-using-sqd-init }

We will start with the [`frontier-evm` squid template](https://github.com/subsquid-labs/squid-frontier-evm-template){target=\_blank}, available through [`sqd init`](https://docs.subsquid.io/squid-cli/init/){target=\_blank}. It is built to index EVM smart contracts deployed on Moonriver, but it can also index Substrate events. To retrieve the template and install the dependencies, run the following:

```bash
sqd init moonbeam-tutorial --template frontier-evm
cd moonbeam-tutorial
npm ci
```

## Define the Entity Schema {: #define-entity-schema }

Next, we ensure the Squid's data [schema](https://docs.subsquid.io/sdk/reference/schema-file/intro/){target=\_blank} defines the [entities](https://docs.subsquid.io/sdk/reference/schema-file/entities/){target=\_blank} that we want to track. We are interested in:

- Token transfers
- Ownership of tokens
- Contracts and their minted tokens

The EVM template already contains a schema file that defines `Token` and `Transfer` entities, but we need to modify it for our use case and add `Owner` and `Contract` entities:

```graphql title="schema.graphql"
--8<-- 'code/tutorials/integrations/nft-subsquid/schema.graphql'
```

It's worth noting a couple of things in this [schema definition](https://docs.subsquid.io/sdk/reference/schema-file/){target=\_blank}:

- **`@entity`** - signals that this type will be translated into an ORM model that is going to be persisted in the database
- **`@derivedFrom`** - signals that the field will not be persisted in the database. Instead, it will be [derived from](https://docs.subsquid.io/sdk/reference/schema-file/entity-relations/){target=\_blank} the entity relations
- **type references** (e.g., `owner: Owner`) - when used on entity types, they establish a relation between two entities

TypeScript entity classes have to be regenerated whenever the schema is changed, and to do that, we use the `squid-typeorm-codegen` tool. The pre-packaged `commands.json` already comes with a `codegen` shortcut, so we can invoke it with `sqd`:

```bash
sqd codegen
```

The generated entity classes can then be browsed in the `src/model/generated` directory. Each entity should have a `.model.ts` file.

## ABI Definition and Type Generation {: #abi-definition }

SQD maintains [tools](https://docs.subsquid.io/sdk/resources/tools/typegen/generation/?typegen=substrate){target=\_blank} for the automated generation of TypeScript classes to handle Substrate data sources (events, extrinsics, storage items). Possible runtime upgrades are automatically detected and accounted for.

Similar functionality is available for EVM indexing through the [`squid-evm-typegen`](https://docs.subsquid.io/sdk/resources/tools/typegen/generation/?typegen=evm){target=\_blank} tool. It generates TypeScript modules for handling EVM logs and transactions based on a [JSON ABI](https://docs.ethers.org/v6/basics/abi/){target=\_blank} of the contract.

We will need such a module for the [ERC-721](https://eips.ethereum.org/EIPS/eip-721){target=\_blank}-compliant part of the contracts' interfaces for our squid. Once again, the template repository already includes it, but it is still important to explain what needs to be done in case one wants to index a different type of contract.

The procedure uses a `sqd` script from the template that uses `squid-evm-typegen` to generate Typescript facades for JSON ABIs stored in the `abi` folder. Place any ABIs you require for interfacing your contracts there and run:

```bash
sqd typegen:evm
```

The results will be stored at `src/abi`. One module will be generated for each ABI file, including constants useful for filtering, functions for decoding EVM events, and functions defined in the ABI.

## Processor Object and the Batch Handler {: #define-event-handlers }

SQD SDK provides users with the [`SubstrateBatchProcessor` class](https://docs.subsquid.io/sdk/reference/processors/substrate-batch/context-interfaces/){target=\_blank}. The `SubstrateBatchProcessor` declaration and configurations are in the `src/processor.ts` file. Its instances connect to [SQD Network gateways](https://docs.subsquid.io/subsquid-network/reference/substrate-networks/){target=\_blank} at chain-specific URLs to get chain data and apply custom transformations. The indexing begins at the starting block and keeps up with new blocks after reaching the tip.

The `SubstrateBatchProcessor` [exposes methods](https://docs.subsquid.io/sdk/reference/processors/substrate-batch/general/){target=\_blank} to "subscribe" to specific data such as Substrate events, extrinsics, storage items, or, for EVM, logs, and transactions. The actual data processing is then started by calling the `.run()` function, as seen in the `src/main.ts` file. This will start generating requests to the gateway for [_batches_](https://docs.subsquid.io/sdk/resources/basics/batch-processing/){target=\_blank} of data specified in the configuration and will trigger the callback function every time a batch is returned by the gateway.

This callback function expresses all the mapping logic. This is where chain data decoding should be implemented and where the code to save processed data on the database should be defined.

### Manage the EVM Contracts {: #managing-the-evm-contracts }

Before we begin defining the mapping logic of the Squid, we will write a `src/contracts.ts` utility module to manage the involved EVM contracts. It will export:

- Addresses of [Exiled Racers Pilots](https://moonbeam.moonscan.io/token/0x515e20e6275ceefe19221fc53e77e38cc32b80fb){target=\_blank} and [Exiled Racers Racecrafts](https://moonbeam.moonscan.io/token/0x104b904e19fbda76bb864731a2c9e01e6b41f855){target=\_blank}
- A `Map` from the contract addresses to hardcoded `Contract` entity instances

Now, let's take a look at the complete contents of the file:

```typescript title="src/contracts.ts"
--8<-- 'code/tutorials/integrations/nft-subsquid/contract.ts'
```

## Configure the Processor {: #configure-processor }

In the `src/processor.ts` file, Squids instantiate the processor (a `SubstrateBatchProcessor` in our case) and configure it.

We adapt the template code to process EVM logs for the two Exiled Racers contracts and point the processor data source setting to the Moonbeam SQD Network gateway URL. Here is the result:

```typescript title="src/processor.ts"
--8<-- 'code/tutorials/integrations/nft-subsquid/processor.ts'
```

If you are adapting this guide for Moonbase Alpha, be sure to update the data source to the correct network:

```js
'https://v2.archive.subsquid.io/network/moonbase-substrate'
```

!!! note
    This code expects to find a working Moonbeam RPC URL in the `RPC_ENDPOINT` environment variable. You can get your own endpoint and API key from a supported [Endpoint Provider](/builders/get-started/endpoints/){target=\_blank}.

    Set it in the `.env` file and [SQD Cloud secrets](https://docs.subsquid.io/cloud/resources/env-variables/){target=\_blank} if and when you deploy your Squid there. We tested the code using a public endpoint at `wss://wss.api.moonbeam.network`; we recommend using private endpoints for production.

## Define the Batch Handler {: #define-batch-handler }

We'll need to rewrite the batch handler logic in the `src/main.ts` file.  We'll iterate over all of the events for each batch of blocks to find the EVM logs relative to the Exiled Racers contracts. We'll extract the from and to addresses and the token ID from the EVM logs. Then, we'll format this data as defined in the schema and save it to the database.

Here is the result:

```typescript title="src/main.ts"
--8<-- 'code/tutorials/integrations/nft-subsquid/main.ts'
```

!!! note
    The `contract.tokenURI` call accesses the **state** of the contract via a chain RPC endpoint. This can slow down indexing, but this data is only available in this way. You'll find more information on accessing state in the [dedicated section of the SQD docs](https://docs.subsquid.io/sdk/resources/tools/typegen/state-queries/#example-1){target=\_blank}.

## Launch and Set Up the Database {: #launch-database }

Squid projects automatically manage the database connection and schema via an [ORM abstraction](https://en.wikipedia.org/wiki/Object%E2%80%93relational\_mapping){target=\_blank}. In this approach, the schema is managed through migration files. Because we made changes to the schema, we need to remove the existing migration(s), create a new one, and then apply the new migration.

This involves the following steps:

1. Make sure you start with a clean Postgres database. The following commands drop-create a new Postgres instance in Docker:

    ```bash
    sqd down
    sqd up
    ```

2. Generate the new migration (this will wipe any old migrations):

    ```bash
    sqd migration:generate
    ```

    !!! note
        This command runs the following commands:

        - `clean` - deletes all the build artifacts
        - `build` - creates a fresh build of the project
        - `migration:clean` - cleans the migration folder
        - `migration:generate` - generates a database migration matching the TypeORM entities

When you launch the processor in the next section, your migrations will be applied automatically. However, if you need to apply them manually, you can do so using the `sqd migration:apply` command.

## Launch the Project {: #launch-project }

To launch the processor, run the following command (this will block the current terminal):

```bash
sqd process
```

!!! note
    This command runs the following commands:

    - `clean` - deletes all the build artifacts
    - `build` - creates a fresh build of the project
    - `migration:apply` - applies the database migrations

Finally, in a separate terminal window, launch the GraphQL server:

```bash
sqd serve
```

Visit [`localhost:4350/graphql`](http://localhost:4350/graphql){target=\_blank} to access the [GraphiQL](https://github.com/graphql/graphiql){target=\_blank} console. From this window, you can perform queries such as this one to fetch a batch of owners:

```graphql
query MyQuery {
  owners(limit: 10) {
    id
  }
}
```

Or this other one, looking up the tokens owned by a given owner:

```graphql
query MyQuery {
  tokens(where: {owner: {id_eq: "0x09534CF342ad376DdBA6C3e94490C3f161F42ed2"}}) {
    uri
    contract {
      id
      name
      symbol
      totalSupply
    }
  }
}
```

Have fun playing around with queries; after all, it's a _playground_!

## Publish the Project {: #publish-the-project }

SQD offers a SaaS solution to host projects created by its community. All templates ship with a deployment manifest file named `squid.yml`, which can be used with the Squid CLI command `sqd deploy`.

Please refer to the [SQD Cloud Quickstart](https://docs.subsquid.io/cloud/overview/){target=\_blank} page on SQD's documentation site for more information.

## Example Project Repository {: #example-project-repository }

You can view the template used here and many other example repositories [on SQD's examples organization on GitHub](https://github.com/orgs/subsquid-labs/repositories){target=\_blank}.

[SQD's documentation](https://docs.subsquid.io){target=\_blank} contains informative material, and it's the best place to start if you are curious about some aspects that were not fully explained in this guide.

--8<-- 'text/_disclaimers/educational-tutorial.md'

--8<-- 'text/_disclaimers/third-party-content.md'
