---
title: Moralis
description: Learn how to build on the Moonbeam network with Moralis' API suite.
---

# Introduction to Moralis

## Introduction {: #introduction }

As a one-stop solution for blockchain development, [Moralis](https://moralis.io/) offers a comprehensive platform that empowers developers to create, launch, and scale decentralized applications (dApps) with ease. This guide will show you how to access the API endpoints for Moonbeam using curl commands and JavaScript and Python snippets.

Moralis' offerings are structured into four primary categories of API services-

- **EVM API**: EVM API allows developers to query essential data for Ethereum Virtual Machine (EVM)-compatible blockchains. Moralis provides dedicated APIs for four key areas: NFTs, tokens, wallets, and general blockchain information.

- **Streams API**: Real-time data is crucial in the fast-paced blockchain world. Moralis's Streams API enables developers to listen for real-time events on the chain, you can listen for when a new event is emitted in your contract or when a wallet address does an NFT transfer or a transaction.

- **RPC API**: The RPC API offers a secure and reliable connection to various blockchain networks. It provides a high-performance gateway for developers to interact with blockchain nodes, ensuring stable and efficient communication between dApps and the blockchain.

- **Auth API**: Moralis's Auth API offers a secure method for implementing wallet-based authentication in dApps. This service simplifies the often complex process of verifying user identities and managing sessions in a decentralized context.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Sign up with Moralis {: #sign-up-with-moralis }

Head over to the [signup page](https://admin.moralis.io/register) to create an account. Once you're in, navigate to the API keys section. There, you can generate your own unique API key and be sure to copy it for future use.

![Moralis API key](/images/builders/integrations/indexers/moralis/moralis-1.webp)

## Querying Moralis API {: #querying-moralis-api }

With the API key, you can try Moralis' REST APIs. The following examples show how the EVM API works-

Getting the token balance of a wallet:

```bash
curl --request GET \
 --url 'https://deep-index.moralis.io/api/v2.2/0xd4d7fb1f98dD66f6D1f393E8e237AdF74c31F3ea/erc20?chain=moonbeam' \
     --header 'accept: application/json' \
 --header 'X-API-Key: INSERT_YOUR_API_KEY' 
```

Getting the list of owners of an NFT:

```bash
curl --request GET \
 --url 'https://deep-index.moralis.io/api/v2.2/nft/0xfffffffffffffffffffffffffffffffffffffffff/owners?chain=moonbeam&format=decimal' \
     --header 'accept: application/json' \
 --header 'X-API-Key: INSERT_YOUR_API_KEY' 
```

For a comprehensive overview of the available APIs and their capabilities, please refer to Moralis' [official documentation](https://docs.moralis.io/web3-data-api/evm/reference).

## Moralis SDK {: #moralis-SDK }

Moralis has an SDK that allows developers to seamlessly integrate Moralis' API into their backend infrastructure. This SDK offers a wide array of features, including-

1. Data querying from both EVM and Solana APIs
2. Integration of Web3 authentication
3. A collection of utility functions for efficient data transformation and formatting

Moralis currently provides official SDK support for two primary programming languages-

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

Once the SDK is ready, you can leverage it to query Moralis's APIs. Here's an example of how to interact with the EVM API using a JSON RPC interface:

=== "Javascript"

    ```js
    import Moralis from 'moralis';

        try {
          await Moralis.start({
            apiKey: "INSERT_YOUR_API_KEY"
    });

          const response = await Moralis.EvmApi.block.getBlock({
            "chain": "0x504",
            "blockNumberOrHash": "1"
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

    params = {
          "chain": "moonbeam",
          "block_number_or_hash": "1"
    }

    result = evm_api.block.get_block(
          api_key=api_key,
          params=params,
    )

        print(result)
    ```


## Stream API {: #stream-api }

Moralis Streams API is a tool for developers to listen to and react to events happening on blockchains in real time. This API lets you listen for specific events, such as a new transaction being added to a block, a particular smart contract function being called, or an NFT being transferred and delivering the event via Webhook.

Head over to the Streams page within Moralis and click **Create a new stream** to get started.

![stream API page](/images/builders/integrations/indexers/moralis/moralis-2.webp)

To get started quickly, let's choose a predefined template here. In this example, we're interested in xcDOT transactions. Select the "Contract Activity" template. This will allow us to easily listen for events related specifically to xcDOT.

![template selection page](/images/builders/integrations/indexers/moralis/moralis-3.webp)

On the next page, enter the following details:

- Smart Contract Address: Paste 0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080 for [xcDot](https://moonscan.io/token/0xffffffff1fcacbd218edc0eba20fc2308c778080)
- Network: Select Moonbeam from the available options.
Moralis lets you listen to events on Moonbeam, Moonriver, and Moonbase Alpha.

![details input page](/images/builders/integrations/indexers/moralis/moralis-4.webp)

Next, customize what events you want to receive. For this example, simply choose "All contract events." 

You may also test the stream to confirm it's capturing the data you need.

![event selection and stream test page](/images/builders/integrations/indexers/moralis/moralis-5.webp)

Next, you can connect the stream to an endpoint to receive updates from Moralis.

![webhook setup page](/images/builders/integrations/indexers/moralis/moralis-6.webp)

All set! Once you activate your stream, you'll see a screen like this:

![stream API end page](/images/builders/integrations/indexers/moralis/moralis-7.webp)

## RPC API {: #rpc-api }

Moralis also offers node services for Moonbeam networks. To leverage the Moralis Moonbeam RPC endpoint, simply head over to the Nodes page.
Select "Moonbeam" and "Mainnet" here to get started.  Don't forget, that Moralis supports Moonriver and Moonbase Alpha as well.

![RPC API setup page](/images/builders/integrations/indexers/moralis/moralis-8.webp)

Just click "Create Node," and your Moonbeam node will be up and running in seconds, ready to handle your RPC requests.

![node ready page](/images/builders/integrations/indexers/moralis/moralis-9.webp)