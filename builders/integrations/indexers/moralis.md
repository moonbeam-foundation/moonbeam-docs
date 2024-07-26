---
title: Interact with Moralis APIs
description: Learn how Moralis' API suite empowers developers to retrieve and leverage various data sets from Moonbeam, Moonriver, and Moonbase Alpha.
---

# Access Moonbeam Data via Moralis APIs

## Introduction {: #introduction }

As a one-stop solution for blockchain development, [Moralis](https://moralis.io/){target=\_blank} offers a comprehensive platform that empowers developers to create, launch, and scale decentralized applications (dApps) with ease.

Moralis' offerings are structured into these primary categories of API services:

- **EVM API** - EVM API allows developers to query essential data for Ethereum Virtual Machine (EVM)-compatible blockchains. Moralis provides dedicated APIs for four key areas: NFTs, tokens, wallets, and general blockchain information

- **Streams API** - the Streams API enables developers to listen for on-chain events, such as smart contract event emissions, in real-time. Popular use cases include real-time wallet notifications, asset monitoring, and gaming event notifications

- **RPC API** - the RPC API offers a secure and reliable connection to various blockchain networks. It provides a high-performance gateway for developers to interact with blockchain nodes, ensuring stable and efficient communication between dApps and the blockchain

This guide will show you how to access the API endpoints for Moonbeam using curl commands and the Moralis SDK using JavaScript and Python snippets.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Checking Prerequisites {: #checking-prerequisites }

To interact with Moralis' API endpoints, an account and API key are required.

Head to the [sign up page](https://admin.moralis.io/register){target=\_blank} to create an account. Once you're in, navigate to the **API keys** section. There, you can generate your own unique API key. Be sure to copy it for future use.

![Moralis API key](/images/builders/integrations/indexers/moralis/moralis-1.webp)

## Querying the EVM API {: #querying-the-evm-api }

With the API key, you can try Moralis' REST APIs. The following examples show how the EVM API works:

Get the token balance of a wallet:  

```bash
curl --request GET \
--url 'https://deep-index.moralis.io/api/v2.2/0xd4d7fb1f98dD66f6D1f393E8e237AdF74c31F3ea/erc20?chain=moonbeam' \
--header 'accept: application/json' \
--header 'X-API-Key: INSERT_YOUR_API_KEY' 
```

Get the list of owners of an NFT:  

```bash
curl --request GET \
--url 'https://deep-index.moralis.io/api/v2.2/nft/0xfffffffffffffffffffffffffffffffffffffffff/owners?chain=moonbeam&format=decimal' \
--header 'accept: application/json' \
--header 'X-API-Key: INSERT_YOUR_API_KEY' 
```

For a comprehensive overview of EVM APIs and their capabilities, please refer to Moralis' [official documentation](https://docs.moralis.io/web3-data-api/evm/reference){target=\_blank}.

## Using the Moralis SDK {: #using-the-moralis-SDK }

Moralis has an SDK that allows developers to seamlessly integrate Moralis' API into their backend infrastructure. This SDK offers a wide array of features, including:

- Data querying from EVM APIs  
- Integration of Web3 authentication  
- A collection of utility functions for efficient data transformation and formatting  

Moralis currently provides official SDK support for two primary programming languages:

- NodeJS
- Python

To install Moralis SDK:

=== "npm"

    ```bash
    npm install moralis
    ```

=== "yarn"

    ```bash
    yarn add moralis
    ```

=== "pnpm"

    ```bash
    pnpm add moralis
    ```

=== "pip"

    ```bash
    pip install moralis
    ```

Once the SDK is ready, you can leverage it to query Moralis APIs. Here's an example of how to interact with the EVM API using a JSON-RPC interface:

=== "JavaScript"

    ```js
    import Moralis from 'moralis';

    try {
    await Moralis.start({
      apiKey: 'INSERT_YOUR_API_KEY',
    });

    const response = await Moralis.EvmApi.block.getBlock({
      chain: '0x504',
      blockNumberOrHash: '1',
    });

    console.log(response.raw);
    } catch (e) {
    console.error(e);
    }
    ```

=== "Python"

    ```python
    from moralis import evm_api

    api_key = "INSERT_YOUR_API_KEY"

    params = {"chain": "moonbeam", "block_number_or_hash": "1"}

    result = evm_api.block.get_block(
        api_key=api_key,
        params=params,
    )

    print(result)
    ```

For more information on advanced features and configurations within the Moralis SDK, please refer to the official [Javascript](https://moralisweb3.github.io/Moralis-JS-SDK/Introduction){target=\_blank} and [Python](https://moralisweb3.github.io/Moralis-Python-SDK/){target=\_blank} documentation.

## Accessing the Stream API {: #accessing-stream-api }

The Moralis Streams API is a tool for developers to listen to and react to events happening on blockchains in real time. This API lets you listen for specific events, such as a new transaction being added to a block, a particular smart contract function being called, or an NFT being transferred and delivering the event via Webhook.

Head over to the **Streams** page from your Moralis dashboard and click **Create a new stream** to get started.

![stream API page](/images/builders/integrations/indexers/moralis/moralis-2.webp)

To get started quickly, choose a predefined template. This example focuses on transactions related to xcDOT. Select the **Contract Activity** template to listen for events related specifically to xcDOT.

![template selection page](/images/builders/integrations/indexers/moralis/moralis-3.webp)

On the next page, enter the following details:

1. Enter the smart contract address for [xcDot](https://moonscan.io/token/0xffffffff1fcacbd218edc0eba20fc2308c778080){target=\_blank}: 0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080
2. Select Moonbeam from the available network options. Moralis supports listening to events on Moonbeam, Moonriver, and Moonbase Alpha 
3. Customize the events you want to receive. For this example, choose All contract events. You may also test the stream to confirm it captures the needed data
4. Connect the stream to an endpoint to receive updates from Moralis
5. Click Save to activate your stream

![details input page](/images/builders/integrations/indexers/moralis/moralis-4.webp)

All set. Once you activate your stream, it will be added to your list of streams on your dashboard:

![stream API end page](/images/builders/integrations/indexers/moralis/moralis-5.webp)

## Accessing the RPC API {: #accessing-rpc-api }

To use the Moralis Moonbeam RPC endpoint, visit the **Nodes** page, click **Create Node**, and take the following steps:

1. Select **Moonbeam** as the protocol
2. Choose **Mainnet** as the chain
3. Click **Create Node**

![RPC API setup page](/images/builders/integrations/indexers/moralis/moralis-5.webp)

Your RPC endpoint will be generated for you to easily copy, and your Moonbeam node will be up and running in seconds, ready to handle your RPC requests. You can view your nodes at any time from your dashboard.

![node ready page](/images/builders/integrations/indexers/moralis/moralis-7.webp)

And that's it! Hope this guide has been helpful. For advance features and more complex use cases, refer to [the official Moralis documentation](https://docs.moralis.io/) for further details.

--8<-- 'text/_disclaimers/third-party-content.md'