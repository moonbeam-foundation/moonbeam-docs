---
title: Supra Oracles
description: Supra's Pull Oracle provides low-latency, on-demand price feed updates for a variety of use cases. Learn how to integrate Supra's oracle on Moonbeam.
---

# Supra Oracles

## Introduction {: #introduction }

[Supra](https://supraoracles.com){target=\_blank} is a novel, high-throughput oracle and intralayer: a vertically integrated toolkit of cross-chain solutions (data oracles, asset bridges, automation network, and more) that interlink all blockchains, public (L1s and L2s) or private (enterprises), including Moonbeam.

Supra provides decentralized oracle price feeds that can be used for on-chain and off-chain use cases such as spot and perpetual DEXes, lending protocols, and payment protocols.

In this guide, you'll learn how to use Supra Oracles' price feeds to fetch price data in smart contracts on Moonbeam.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## How to use Supra's Price Feeds {: #price-feeds }

Supra uses a pull model as a customized approach that publishes price data upon request. It combines Web2 and Web3 methods to achieve low latency when sending data from Supra to destination chains. The process involves the following steps:

1. Web2 methods are used to retrieve price data from Supra
2. Smart contracts are utilized for cryptographically verifying and writing the latest price data on-chain, where it lives on immutable ledgers, using [Supra's Pull Oracle V1](https://supra.com/docs/data-feeds/pull-model){target=\_blank}
3. Once the data has been written on-chain, the most recently published price feed data will be available in Supra's Storage contract

You can fetch price data from Supra for any [available data pairs](https://supra.com/docs/data-feeds/data-feeds-index/){target=\_blank}.

The Pull Oracle contract on Moonbeam is located at the following address:

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.supra.pull_oracle }}
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.supra.pull_oracle }}
    ```

!!! note
    Moonriver is not supported at this time.

When retrieving the last stored price data for an asset, you'll interact with the Storage contract, which is located at the following address:

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.supra.storage }}
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.supra.storage }}
    ```

### Retrieve Price Data From Supra {: #retrieve-price-data-from-supra }

The first step of the process is to set up your Web2 code to interact with [Supra's Pull Oracle V1](https://supra.com/docs/data-feeds/pull-model){target=\_blank}. For simplicity, you can use the [JavaScript (EVM) code library](https://github.com/Entropy-Foundation/oracle-pull-example/tree/master/javascript/evm_client){target=\_blank} created by Supra.

You can follow the step-by-step instructions on how to set up the Web2 code on the [Integrating Pull Oracle V1](https://supra.com/docs/data-feeds/pull-model){target=\_blank} page of Supra's documentation.

As a quick overview, you'll need to:

1. Clone the [Oracle Pull Example](https://github.com/Entropy-Foundation/oracle-pull-example/tree/master/javascript/evm_client){target=\_blank} repository

    ```bash
    git clone https://github.com/Entropy-Foundation/oracle-pull-example.git
    ```

2. Navigate to the JavaScript (EVM) library and install the necessary dependencies:

    ```bash
    cd oracle-pull-example/javascript/evm_client && npm install
    ```

In the `oracle-pull-example/javascript/evm-client/main.js` file, you'll need to:

1. Set the gRPC server address

    === "Moonbeam"

        ```js
        const address = 'mainnet-dora.supraoracles.com';
        ```

    === "Moonbase Alpha"

        ```js
        const address = 'testnet-dora.supraoracles.com';
        ```

2. Add the RPC URL for [Moonbeam](/builders/get-started/endpoints/#moonbeam){target=\_blank} or [Moonbase Alpha](/builders/get-started/endpoints/#moonbase-alpha){target=\_blank} (depending on which network you're interacting with) when [configuring the Web3 provider](https://github.com/Entropy-Foundation/oracle-pull-example/blob/master/javascript/evm_client/main.js#L28){target=\_blank}

    === "Moonbeam"

        ```js
        const web3 = new Web3(new Web3.providers.HttpProvider('{{ networks.moonbeam.public_rpc_url }}'));
        ```

    === "Moonbase Alpha"

        ```js
        const web3 = new Web3(new Web3.providers.HttpProvider('{{ networks.moonbase.rpc_url }}'));
        ```

3. Add your account address and the private key. This will be the account that you'll use to verify and publish the price data on-chain

    !!! remember
        This example is for demo purposes only; never store your private key in a JavaScript file.

You'll also need to add the contract address of the contract that you'll be deploying in the following section. This is the contract that you will use to verify and publish the price data on-chain. So, you can leave it as is for now and circle back to it after you've deployed the contract.

### Verify and Publish Price Data On-Chain {: #verify-publish-price-data-on-chain }

Next, you'll create the contract to verify and publish the price data. To get started, you can take the following steps:

1. Create an interface that you will apply later in order to verify and fetch S-values from Supra's Pull contract. An S-value is an aggregated mean price of an asset

    ```solidity
    --8<-- 'code/builders/integrations/oracles/supra/ISupraOraclePull.sol'
    ```  

2. Create a contract that uses the `ISupraOraclePull` interface defined in the previous step. You can set up the constructor of the contract to accept the address of the Pull contract on Moonbeam

    ```solidity
    --8<-- 'code/builders/integrations/oracles/supra/MockOracleClientConstructor.sol'
    ```  

3. Create a function that receives and verifies the S-value

    ```solidity
    --8<-- 'code/builders/integrations/oracles/supra/GetPairPrice.sol'
    ```

And that's it for the contract! You can review Supra's documentation for some [recommended best practices](https://supra.com/docs/data-feeds/pull-model#recommended-best-practices){target=\_blank}.

??? code "View the complete contract"

    ```solidity
    --8<-- 'code/builders/integrations/oracles/supra/MockOracleClient.sol'
    ```

Next, you'll need to deploy the contract. When deploying the contract, you must pass in the Pull Oracle contract address for Moonbeam or Moonbase Alpha. The addresses for each network are:

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.supra.pull_oracle }}
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.supra.pull_oracle }}
    ```

To quickly deploy the contract, you can use [Remix](https://remix.ethereum.org/){target=\_blank}. For a refresher on setting up Remix, see the [Using Remix to Deploy to Moonbeam](/builders/build/eth-api/dev-env/remix/){target=\_blank} guide.

Once you've deployed your contract, head back to the `oracle-pull-example/javascript/evm-client/main.js` file and [add the contract address](https://github.com/Entropy-Foundation/oracle-pull-example/blob/master/javascript/evm_client/main.js#L32){target=\_blank}.

Now you can run the script, which will retrieve the price data and verify and publish it on-chain:

```bash
node main.js
```

Once you've run the script, you should see the price data and the transaction receipt from calling the `GetPairPrice` function printed to the terminal.

--8<-- 'code/builders/integrations/oracles/supra/terminal/output.md'

### Retrieve On-Chain Price Data {: #retrieve-on-chain-price-data }

To retrieve the most recently published on-chain data for a given data pair, you can create another contract that interacts with Supra's Storage contract on Moonbeam or Moonbase Alpha. To do so, you can take the following steps:

1. Create an interface that you will apply later to retrieve an S-value

    ```solidity
    --8<-- 'code/builders/integrations/oracles/supra/ISupraSValueFeed.sol'
    ```

2. Create an instance of the S-value Feed using the interface defined in the previous step and the address of the Storage contract on Moonbeam or Moonbase Alpha

    === "Moonbeam"

        ```solidity
        contract ISupraSValueFeedExample {
            ISupraSValueFeed internal sValueFeed;

            constructor() {
                sValueFeed = ISupraSValueFeed({{ networks.moonbeam.supra.storage }});
            }
        }
        ```

    === "Moonbase Alpha"

        ```solidity
        contract ISupraSValueFeedExample {
            ISupraSValueFeed internal sValueFeed;

            constructor() {
                sValueFeed = ISupraSValueFeed({{ networks.moonbase.supra.storage }});
            }
        }
        ```

3. Add logic for retrieving the price data and decoding it

    ```solidity
    --8<-- 'code/builders/integrations/oracles/supra/GetPriceFunctions.sol'
    ```

??? code "View the complete contract"

    ```solidity
    --8<-- 'code/builders/integrations/oracles/supra/ISupraSValueFeedExample.sol'
    ```

To quickly deploy the contract, you can use [Remix](https://remix.ethereum.org/){target=\_blank}. For a refresher on setting up Remix, see the [Using Remix to Deploy to Moonbeam](/builders/build/eth-api/dev-env/remix/){target=\_blank} guide.

Once the contract has been deployed, you can call the `getPrice` function and pass in the index of a single price feed or call the `getPriceForMultiplePair` function and pass in an array of the indexes of each data pair to retrieve. You can find the [indexes of each data pair](https://supra.com/docs/data-feeds/data-feeds-index/){target=\_blank} on Supra's documentation.

## Connect with Supra {: #connect-with-supra }

Still looking for answers? Supra's got them! Check out all the ways you can reach the Supra team:

- Visit [Supra's websites at supraoracles.com](https://supraoracles.com){target=\_blank}
- Read their [docs](https://supraoracles.com/docs/overview){target=\_blank}
- Chat with them on [Telegram](https://t.me/SupraOracles){target=\_blank}
- Follow them on [Twitter](https://twitter.com/SupraOracles){target=\_blank}
- Join their [Discord](https://discord.gg/supraoracles){target=\_blank}
- Check out their [Youtube](https://www.youtube.com/SupraOfficial){target=\_blank}

--8<-- 'text/_disclaimers/third-party-content.md'
