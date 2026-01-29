---
title: Index Data with SQD (formerly Subsquid)
description: Learn how to use SQD (Subsquid), a query node framework for Substrate-based chains, to index and process Substrate and EVM data for Moonbeam and Moonriver.
categories: Indexers and Queries
---

# Indexing Moonbeam with SQD (formerly Subsquid)

## Introduction {: #introduction }

[SQD (formerly Subsquid)](https://www.sqd.ai/){target=\_blank} is a data network that allows rapid and cost-efficient retrieval of blockchain data from 100+ chains using SQD’s decentralized data lake and open-source SDK. In very simple terms, SQD can be thought of as an ETL (extract, transform, and load) tool with a GraphQL server included. It enables comprehensive filtering, pagination, and even full-text search capabilities.

SQD has native and full support for both Ethereum Virtual Machine (EVM) and Substrate data. Since Moonbeam is a Substrate-based smart contact platform that is EVM-compatible, SQD can be used to index both EVM and Substrate-based data. SQD offers a Substrate Archive and Processor and an EVM Archive and Processor. The Substrate Archive and Processor can be used to index both Substrate and EVM data. This allows developers to extract on-chain data from any of the Moonbeam networks and process EVM logs as well as Substrate entities (events, extrinsics, and storage items) in one single project and serve the resulting data with one single GraphQL endpoint. If you exclusively want to index EVM data, it is recommended to use the EVM Archive and Processor.

This quick-start guide will show you how to create Substrate and EVM projects with SQD and configure it to index data on Moonbeam.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Checking Prerequisites {: #checking-prerequisites }

To get started with SQD, you'll need to have the following:

- [Node.js](https://nodejs.org/en/download/package-manager){target=\_blank} version 16 or newer
- [Docker](https://docs.docker.com/get-started/get-docker/){target=\_blank}
- [Squid CLI](https://docs.sqd.ai/squid-cli/installation/){target=\_blank}

!!! note
    The Squid template is not compatible with `yarn`, so you'll need to use `npm` instead.

## Index Substrate Data on Moonbeam {: #index-substrate-calls-events }

To get started indexing Substrate data on Moonbeam, you'll need to create a SQD project and configure it for Moonbeam by taking the following steps:

1. Create a SQD project based on the Substrate template by running:

    ```bash
    --8<-- 'code/builders/integrations/indexers/subsquid/1.sh'
    ```

    For more information on getting started with this template, please check out the [Quickstart: Substrate chains](http://docs.sqd.ai/quickstart/quickstart-substrate/){target=\_blank} guide on SQD's documentation site.

2. Navigate into the root directory of your Squid project and install dependencies by running:  

    ```bash
    --8<-- 'code/builders/integrations/indexers/subsquid/2.sh'
    ```

3. To configure your SQD project to run on Moonbeam, you'll need to update the `typegen.json` file. The `typegen.json` file is responsible for generating TypeScript interface classes for your data. Depending on the network you're indexing data on, the `specVersions` value in the `typegen.json` file should be configured as follows:

    === "Moonbeam"

        ```json
        --8<-- 'code/builders/integrations/indexers/subsquid/3.json'
        ```

    === "Moonriver"

        ```json
        --8<-- 'code/builders/integrations/indexers/subsquid/4.json'
        ```

    === "Moonbase Alpha"

        ```json
        --8<-- 'code/builders/integrations/indexers/subsquid/5.json'
        ```

4. Modify the `src/processor.ts` file, which is where Squids instantiate the processor, configure it, and attach handler functions. The processor fetches historical on-chain data from an [Archive](https://docs.sqd.ai/glossary/#archives){target=\_blank}, which is a specialized data lake. You'll need to configure your processor to pull data from the Archive that corresponds to the [network](http://docs.sqd.ai/substrate-indexing/supported-networks/){target=\_blank} you are indexing data on:

    === "Moonbeam"

        ```ts
        --8<-- 'code/builders/integrations/indexers/subsquid/6.ts'
        ```

    === "Moonriver"

        ```ts
        --8<-- 'code/builders/integrations/indexers/subsquid/7.ts'
        ```

    === "Moonbase Alpha"

        ```ts
        --8<-- 'code/builders/integrations/indexers/subsquid/8.ts'
        ```

    !!! note
        --8<-- 'text/_common/endpoint-setup.md'

5. There's one more quick change to make to the template. The SQD Substrate template is configured to process Substrate account types, but Moonbeam uses Ethereum-style accounts. The `getTransferEvents` function in the `src/main.ts` file will iterate through the events ingested by `processor.ts` and store the relevant `transfer` events in the database. In the `getTransferEvents` function, remove the ss58 encoding of the `from` and `to` fields. In an unmodified Substrate template, the `from` and `to` fields are ss58 encoded as shown:

    ```ts
    --8<-- 'code/builders/integrations/indexers/subsquid/9.ts'
    ```

    After removing the ss58 encoding, the respective lines are:

    ```ts
    --8<-- 'code/builders/integrations/indexers/subsquid/10.ts'
    ```

And that's all you have to do to configure your SQD project to index Substrate data on Moonbeam! Now you can update the `schema.graphql`, `typegen.json`, `src/main.ts`, and `src/processor.ts` files to index the data you need for your project! Next, take the steps in the [Run your Indexer](#run-your-indexer) section to run your indexer and query your Squid.

## Index Ethereum Data on Moonbeam {: #index-ethereum-contracts }

To get started indexing EVM data on Moonbeam, you'll need to create a SQD project and configure it for Moonbeam by taking the following steps:

1. You can create a SQD project for EVM data by using the generic [EVM template](https://github.com/subsquid-labs/squid-evm-template){target=\_blank} or you can use the [ABI template](https://github.com/subsquid-labs/squid-abi-template){target=\_blank} for indexing data related to a specific contract:

    === "EVM"

        ```bash
        --8<-- 'code/builders/integrations/indexers/subsquid/11.sh'
        ```

    === "ABI"

        ```bash
        --8<-- 'code/builders/integrations/indexers/subsquid/12.sh'
        ```

    For more information on getting started with both of these templates, please check out the following SQD docs:
      
      - [Quickstart: EVM chains](http://docs.sqd.ai/quickstart/quickstart-ethereum/){target=\_blank}
      - [Quickstart: generate from ABI](http://docs.sqd.ai/quickstart/quickstart-abi/){target=\_blank}

2. Navigate into the root directory of your Squid project and install dependencies by running:

    ```bash
    --8<-- 'code/builders/integrations/indexers/subsquid/13.sh'
    ```

3. Modify the `src/processor.ts` file, which is where Squids instantiate the processor, configure it, and attach handler functions. The processor fetches historical on-chain data from an [Archive](https://docs.sqd.ai/glossary/#archives){target=\_blank}, which is a specialized data lake. You'll need to configure your processor to pull data from the Archive that corresponds to the [network](http://docs.sqd.ai/evm-indexing/supported-networks/){target=\_blank} you are indexing data on:

    === "Moonbeam"

        ```ts
        --8<-- 'code/builders/integrations/indexers/subsquid/14.ts'
        ```

    === "Moonriver"

        ```ts
        --8<-- 'code/builders/integrations/indexers/subsquid/15.ts'
        ```

    === "Moonbase Alpha"

        ```ts
        --8<-- 'code/builders/integrations/indexers/subsquid/16.ts'
        ```

    !!! note
        --8<-- 'text/_common/endpoint-setup.md'

And that's all you have to do to configure your SQD project to index EVM data on Moonbeam! Now you can update the `schema.graphql`, `src/main.ts`, and `src/processor.ts` files to index the data you need for your project! Continue with the steps in the following section to run your indexer and query your Squid.

## Run Your Indexer {: #run-your-indexer }

These steps apply to both Substrate and EVM indexers. Running your SQD indexer after you've properly configured it takes only a few steps:  

1. Launch Postgres by running:

    ```bash
    --8<-- 'code/builders/integrations/indexers/subsquid/17.sh'
    ```

2. Inspect and run the processor:

    ```bash
    --8<-- 'code/builders/integrations/indexers/subsquid/18.sh'
    ```

3. Open a separate terminal window in the same directory, then start the GraphQL server:

    ```bash
    --8<-- 'code/builders/integrations/indexers/subsquid/19.sh'
    ```

4. You can query your template Substrate or EVM Squid with the below sample queries. If you've modified the template Squid to index different data, you'll need to modify this query accordingly

    === "Substrate Indexer"

        ```graphql
        --8<-- 'code/builders/integrations/indexers/subsquid/20.graphql'
        ```

    === "EVM Indexer"

        ```graphql
        --8<-- 'code/builders/integrations/indexers/subsquid/21.graphql'
        ```

For additional examples and workflows, refer to the [SQD documentation](https://docs.sqd.dev/){target=\_blank}.

--8<-- 'text/_disclaimers/third-party-content.md'
