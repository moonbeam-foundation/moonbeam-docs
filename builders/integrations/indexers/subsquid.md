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
- [Git](https://git-scm.com/downloads){target=\_blank}
- [Docker](https://docs.docker.com/get-started/get-docker/){target=\_blank}
- [Squid CLI](https://docs.sqd.dev/en/cloud/reference/cli/installation){target=\_blank}

!!! note
    The commands in this guide use `npm`, matching the current Squid SDK templates and quick-start docs from SQD.

## Index Substrate Data on Moonbeam {: #index-substrate-calls-events }

To index Substrate data on Moonbeam, create a SQD project and configure it for Moonbeam by taking the following steps:

1. Create a SQD project based on the Substrate template by running:

    ```bash
    sqd init INSERT_SQUID_NAME --template substrate
    ```

    For more information on getting started with this template, check out the [Simple Substrate squid](https://docs.sqd.dev/en/sdk/squid-sdk/tutorials/substrate){target=\_blank} guide on the SQD documentation site.

2. Navigate into the root directory of your Squid project and install dependencies by running:  

    ```bash
    npm ci
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

1. Create a SQD project for EVM data by using the generic EVM template or the ABI template. The EVM template is a minimal Squid SDK project for EVM data. Use the ABI template with [Squid generation tools](https://docs.sqd.dev/en/sdk/squid-sdk/resources/tools/squid-gen){target=\_blank} to generate a squid from contract ABIs:

    === "EVM"

        ```bash
        sqd init INSERT_SQUID_NAME --template evm
        ```

    === "ABI"

        ```bash
        sqd init INSERT_SQUID_NAME --template abi
        ```

    For more information on getting started with Squid SDK templates, check out the [Development flow](https://docs.sqd.dev/en/sdk/squid-sdk/how-to-start/squid-development){target=\_blank} and [Squid SDK Quickstart](https://docs.sqd.dev/en/sdk/squid-sdk/quickstart){target=\_blank} guides on the SQD documentation site.

2. Navigate into the root directory of your Squid project and install dependencies by running:

    ```bash
    npm ci
    ```

3. If you use the ABI template, configure the contracts and events you want to index in `squidgen.yaml` and generate the squid code:

    ```bash
    npx squid-gen config squidgen.yaml
    ```

    The `squidgen.yaml` configuration includes the `archive` field for the SQD Network gateway, the target data store, and the contracts, ABIs, events, and functions to index. For the `archive` value, use the corresponding Moonbeam EVM gateway from the next step.

4. Modify the `src/processor.ts` file, which is where Squids instantiate the processor, configure it, and attach handler functions. The processor can fetch historical on-chain data from a SQD Network gateway. Configure your processor to pull data from the [EVM dataset](https://docs.sqd.dev/en/data/evm){target=\_blank} that corresponds to the network you are indexing data on:

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

After you configure your SQD project to index EVM data on Moonbeam, update the `schema.graphql`, `src/main.ts`, and `src/processor.ts` files to index the data you need for your project. Continue with the steps in the following section to run your indexer and query your Squid.

## Run Your Indexer {: #run-your-indexer }

These steps apply to both Substrate and EVM indexers. After you configure your SQD indexer, run it by taking the following steps:

!!! note
    The `setGateway()` examples in this guide use legacy `https://v2.archive.subsquid.io` gateways. SQD requires an API key for self-hosted Squid SDK projects that use these legacy gateways. SQD Cloud squids that rely on legacy gateways are not affected. See the [Accessing SQD data with API keys](https://docs.sqd.dev/en/data/api-keys){target=\_blank} guide for more information.

1. Build the project by running:

    ```bash
    npm run build
    ```

2. Launch Postgres by running:

    ```bash
    docker compose up -d
    ```

3. Apply database migrations:

    ```bash
    npx squid-typeorm-migration apply
    ```

    If you changed the schema or generated an ABI-based squid, generate migrations before applying them:

    ```bash
    npx squid-typeorm-migration generate
    npx squid-typeorm-migration apply
    ```

4. Inspect and run the processor:

    ```bash
    node -r dotenv/config lib/main.js
    ```

5. Open a separate terminal window in the same directory, then start the GraphQL server:

    ```bash
    npx squid-graphql-server
    ```

6. Query your template Substrate or EVM Squid with the following sample queries. If you modified the template Squid to index different data, modify this query accordingly.

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
