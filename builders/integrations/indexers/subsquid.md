---
title: Index Data with SQD (formerly Subsquid)
description: Learn how to use SQD (Subsquid), a query node framework for Substrate-based chains, to index and process Substrate and EVM data for Moonbeam and Moonriver.
categories: Indexers and Queries
---

# Indexing Moonbeam with SQD (formerly Subsquid)

## Introduction {: #introduction }

[SQD (formerly Subsquid)](https://sqd.dev/){target=\_blank} is a data network that allows rapid and cost-efficient retrieval of blockchain data from 200+ chains using the decentralized data lake and open-source SDK from SQD. In very simple terms, you can think of SQD as an ETL (extract, transform, and load) tool with a GraphQL server included. It enables comprehensive filtering, pagination, and even full-text search capabilities.

SQD has native support for both Ethereum Virtual Machine (EVM) and Substrate data. Since Moonbeam is a Substrate-based smart contract platform that is EVM-compatible, you can use SQD to index both EVM and Substrate-based data. If you exclusively want to index EVM data, use the EVM processor. If you need Substrate events or calls, or Frontier EVM data alongside Substrate context, use the Substrate processor and the Frontier EVM utilities.

This quick-start guide shows you how to create Substrate and EVM Squid SDK projects with SQD and configure them to index data on Moonbeam.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Checking Prerequisites {: #checking-prerequisites }

Before you get started with SQD, install the following:

- [Node.js](https://nodejs.org/en/download){target=\_blank} version 18 or newer
- [Docker](https://docs.docker.com/get-started/get-docker/){target=\_blank}
- [Squid CLI](https://docs.sqd.dev/en/cloud/reference/cli/installation){target=\_blank}

## Index Substrate Data on Moonbeam {: #index-substrate-calls-events }

To index Substrate data on Moonbeam, create a SQD project and configure it for Moonbeam by taking the following steps:

1. Create a SQD project based on the Substrate template by running:

    ```bash
    sqd init INSERT_SQUID_NAME --template substrate
    ```

    For more information on getting started with this template, check out the [Simple Substrate squid](https://docs.sqd.dev/en/sdk/squid-sdk/tutorials/substrate){target=\_blank} guide on the SQD documentation site.

2. Navigate into the root directory of your Squid project and install dependencies by running:  

    ```bash
    npm i
    ```

3. To configure your SQD project to run on Moonbeam, update the `typegen.json` file. The `typegen.json` file generates TypeScript interface classes for your data. Depending on the network you index data on, set the `specVersions` value in the `typegen.json` file as follows:

    === "Moonbeam"

        ```json
        "specVersions": "https://v2.archive.subsquid.io/metadata/moonbeam",
        ```

    === "Moonriver"

        ```json
        "specVersions": "https://v2.archive.subsquid.io/metadata/moonriver",
        ```

    === "Moonbase Alpha"

        ```json
        "specVersions": "https://v2.archive.subsquid.io/metadata/moonbase",
        ```

4. Modify the `src/processor.ts` file, which is where Squids instantiate the processor, configure it, and attach handler functions. The processor can fetch historical on-chain data from a [SQD Network gateway](https://docs.sqd.dev/en/sdk/squid-sdk/glossary#archives){target=\_blank} and use a chain RPC endpoint for metadata retrieval and direct RPC queries. Configure your processor to pull data from the [Substrate dataset](https://docs.sqd.dev/en/data/substrate){target=\_blank} that corresponds to the network you are indexing data on:

    === "Moonbeam"

        ```ts
        const processor = new SubstrateBatchProcessor()
          .setGateway('https://v2.archive.subsquid.io/network/moonbeam-substrate')
          .setRpcEndpoint('{{ networks.moonbeam.rpc_url }}')
        ```

    === "Moonriver"

        ```ts
        const processor = new SubstrateBatchProcessor()
          .setGateway('https://v2.archive.subsquid.io/network/moonriver-substrate')
          .setRpcEndpoint('{{ networks.moonriver.rpc_url }}')
        ```

    === "Moonbase Alpha"

        ```ts
        const processor = new SubstrateBatchProcessor()
          .setGateway('https://v2.archive.subsquid.io/network/moonbase-substrate')
          .setRpcEndpoint('{{ networks.moonbase.rpc_url }}')
        ```

    !!! note
        For the Moonbeam or Moonriver RPC endpoint passed to `setRpcEndpoint()`, use your own endpoint from one of the supported [Endpoint Providers](/builders/get-started/endpoints/){target=\_blank}. This RPC endpoint is separate from the SQD gateway configured with `setGateway()`.

5. The SQD Substrate template uses Substrate-style accounts by default, but Moonbeam uses Ethereum-style accounts, so you'll need to remove the ss58 encoding from the account fields. The `getTransferEvents` function in `src/main.ts` is responsible for iterating through the events ingested by `processor.ts` and saving the relevant transfer events to the database — this is where you'll make that change. Remove the ss58 encoding from the `from` and `to` fields. The default, unmodified Substrate template encodes these fields as shown:

    ```ts
    from: ss58.codec('kusama').encode(rec.from),
    to: ss58.codec('kusama').encode(rec.to),
    ```

    After you remove the ss58 encoding, use the following lines:

    ```ts
    from: rec.from, 
    to: rec.to, 
    ```

Now that your SQD project is configured to index Substrate data on Moonbeam, update the `schema.graphql`, `typegen.json`, `src/main.ts`, and `src/processor.ts` files to index the data you need for your project. Next, take the steps in the [Run Your Indexer](#run-your-indexer) section to run your indexer and query your Squid.

## Index Ethereum Data on Moonbeam {: #index-ethereum-contracts }

To index EVM data on Moonbeam, create a SQD project and configure it for Moonbeam by taking the following steps:

1. Create a SQD project for EVM data by using the generic EVM template:

    ```bash
    sqd init INSERT_SQUID_NAME --template evm
    ```

    For more information on getting started with Squid SDK templates, check out the [Development flow](https://docs.sqd.dev/en/sdk/squid-sdk/how-to-start/squid-development){target=\_blank} guide.

2. Navigate into the root directory of your Squid project and install dependencies by running:

    ```bash
    npm i
    ```

3. Modify the `src/processor.ts` file, which is where Squids instantiate the processor, configure it, and attach handler functions. The processor fetches historical on-chain data from a SQD Network gateway. Configure your processor to pull data from the [EVM dataset](https://docs.sqd.dev/en/data/evm){target=\_blank} that corresponds to the network you are indexing data on:

    === "Moonbeam"

        ```ts
        const processor = new EvmBatchProcessor()
          .setGateway('https://v2.archive.subsquid.io/network/moonbeam-mainnet')
        ```

    === "Moonriver"

        ```ts
        const processor = new EvmBatchProcessor()
          .setGateway('https://v2.archive.subsquid.io/network/moonriver-mainnet')
        ```

    === "Moonbase Alpha"

        ```ts
        const processor = new EvmBatchProcessor()
          .setGateway('https://v2.archive.subsquid.io/network/moonbase-testnet')
        ```

Now that you've configured your SQD project to index EVM data on Moonbeam, update the `schema.graphql`, `src/main.ts`, and `src/processor.ts` files to index the data you need for your project. Continue with the steps in the following section to run your indexer and query your Squid.

## Run Your Indexer {: #run-your-indexer }

These steps apply to both Substrate and EVM indexers. After you configure your SQD indexer, run it by taking the following steps:

!!! note
    The `setGateway()` examples in this guide use legacy `https://v2.archive.subsquid.io` gateways. If you self-host a Squid SDK project with these gateways, you need a SQD API key. This requirement applies to self-hosted projects, not squids deployed on SQD Cloud. See the [Accessing SQD data with API keys](https://docs.sqd.dev/en/data/api-keys){target=\_blank} guide for more information.

1. Build the project by running:

    ```bash
    sqd build
    ```

2. Launch Postgres by running:

    ```bash
    sqd up
    ```

3. Apply database migrations:

    ```bash
    sqd migration:apply
    ```

    If you changed `schema.graphql`, clean and regenerate migrations before applying them:

    ```bash
    sqd migration:clean
    sqd migration:generate
    sqd migration:apply
    ```

4. Run the services defined in `squid.yaml` locally:

    ```bash
    sqd run .
    ```

5. Query your template Substrate or EVM Squid with the following sample queries. If you modified the template Squid to index different data, modify this query accordingly.

    === "Substrate Indexer"

        ```graphql
        query MyQuery {
          accountsConnection(orderBy: id_ASC) {
            totalCount
          }
        }
        ```

    === "EVM Indexer"

        ```graphql
        query MyQuery {
          burns(orderBy: value_DESC) {
            address
            block
            id
            txHash
            value
          }
        }
        ```

For additional examples and workflows, refer to the [SQD documentation](https://docs.sqd.dev/){target=\_blank}.

--8<-- 'text/_disclaimers/third-party-content.md'
