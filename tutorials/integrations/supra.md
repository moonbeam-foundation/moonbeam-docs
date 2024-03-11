---
title: Supra Oracles
description: In this step-by-step tutorial, learn about Supra's pull model and how to use their price feeds to fetch price data in smart contracts on Moonbeam.
---

# Fetching Price Data with Supra Oracles

## Introduction {: #introduction }

Oracles play a crucial role in blockchain ecosystems by facilitating the interaction between smart contracts and external data sources.

Supra Oracles is one Oracle service provider that enables you to retrieve price data from external services and feed it to smart contracts to validate the accuracy of such data and publish it on-chain. Supra achieves this flow using a pull model that fetches price data as needed.

In this guide, you'll learn about Supra's pull model and how to use their price feeds to fetch price data in smart contracts on Moonbeam.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## An Overview of Supra's V1 Pull Model {: #pull-model }

Supra uses a pull model as a customized approach that publishes price data upon request. It combines Web2 and Web3 methods to achieve low latency when sending data from Supra to destination chains. The process involves the following steps:

1. Web2 methods are used to retrieve price data from Supra
2. Smart contracts are utilized for cryptographically verifying and writing the latest price data on-chain, where it lives on immutable ledgers, using [Supra's Pull contract](https://supra.com/docs/data-feeds/pull-model){target=\_blank}
3. Once the data has been written on-chain, the most recently published price feed data will be available in Supra's Storage contract

You can fetch price data from Supra for any [available data pairs](https://supra.com/docs/data-feeds/data-feeds-index/){target=\_blank}.

The addresses for Supra's contracts on Moonbeam are as follows:

=== "Moonbeam"

    |  Contract   |                                                              Address                                                               |
    |:-----------:|:----------------------------------------------------------------------------------------------------------------------------------:|
    | Pull Oracle | [{{ networks.moonbeam.supra.pull_oracle }}](https://moonscan.io/address/{{ networks.moonbeam.supra.pull_oracle }}){target=\_blank} |
    |   Storage   |   [{{ networks.moonbeam.supra.storage }}](https://moonscan.io/address/{{ networks.moonbeam.supra.pull_oracle }}){target=\_blank}   |

=== "Moonbase Alpha"

    |  Contract   |                                                                   Address                                                                   |
    |:-----------:|:-------------------------------------------------------------------------------------------------------------------------------------------:|
    | Pull Oracle | [{{ networks.moonbase.supra.pull_oracle }}](https://moonbase.moonscan.io/address/{{ networks.moonbeam.supra.pull_oracle }}){target=\_blank} |
    |   Storage   |   [{{ networks.moonbase.supra.storage }}](https://moonbase.moonscan.io/address/{{ networks.moonbeam.supra.pull_oracle }}){target=\_blank}   |

!!! note
    Moonriver is not supported at this time.

## Checking Prerequisites {: #checking-prerequisites }

To follow along with this guide, you will need:

- An account with funds.
  --8<-- 'text/_common/faucet/faucet-list-item.md'

## Use Web2 Code to Retrieve Price Data {: #web2-retrieve-price-data }

To build out the Web2 component required to fetch price data from Supra, you can use their [Pull Service Client library](https://github.com/Entropy-Foundation/oracle-pull-example){target=\_blank}, designed to interact with a gRPC server to fetch price data. gRPC is a modern remote procedure call (RPC) framework created by Google. You can check out the [gRPC documentation](https://grpc.io/docs/what-is-grpc/){target=\_blank} for more information if you need to familiarize yourself.

The library offers JavaScript or Rust-based clients for EVM, Sui, and Aptos-based chains. For Moonbeam, you can use the JavaScript or Rust-based EVM client. We'll use the [JavaScript client](https://github.com/Entropy-Foundation/oracle-pull-example/tree/master/javascript/evm_client){target=\_blank}.

We'll copy the JavaScript client code and add it to our project, but you can also clone the [repository](https://github.com/Entropy-Foundation/oracle-pull-example){target=\_blank} with all the clients.

### Create a Project {: #create-a-project }

Follow these steps to create your project:

1. Create an empty project directory

    ```
    mkdir moonbeam-supra
    ```

2. Create a basic `package.json` file for your project

    ```
    cd moonbeam-supra && npm init-y
    ```

3. Install dependencies needed to work with Supra's gRPC server

    ```
    npm install @grpc/grpc-js @grpc/proto-loader
    ```

### Create the Pull Service Client {: #create-pull-service-client }

To create the pull service client, you'll need to create two files: one that defines the schema for the gRPC service, `client.proto`, and another that relies on the schema and is used to fetch the proof for a given data pair, `pullServiceClient.js`.

You can create both files using the following command:

```bash
touch client.proto pullServiceClient.js
```

Then, you can copy the following code snippets and add them to their respective files:

???+ code "Pull service client files"

    === "client.proto"

        ```proto
        --8<-- 'code/tutorials/integrations/supra/client.proto'
        ```

    === "pullServiceClient.js"

        ```js
        --8<-- 'code/tutorials/integrations/supra/pullServiceClient.js'
        ```

### Use the Pull Service Client to Fetch Price Data {: #use-the-pull-service-client }

In this section, you'll create an instance of the `PullServiceClient` to retrieve the proof for the ETH_USDT pair. You can modify this example for any of the [available data pairs](https://supra.com/docs/data-feeds/data-feeds-index){target=\_blank}.

To get started, create a file to add our logic:

```bash
touch main.js
```

In the `main.js` file, take the following steps to add the logic for retrieving proof data:

1. Import the `PullServiceClient` from the `pullServiceClient.js` file

    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js::1'
    ```

2. Create a variable to store the index of the data pair for which you want to retrieve the price data. This example requests the ETH_USDT data pair, but you can use the [index of any available data pair](https://supra.com/docs/data-feeds/data-feeds-index){target=\_blank}

    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js::1'

    --8<-- 'code/tutorials/integrations/supra/main-mb.js:9:9'
    ```

3. Create a `getProofs` function, where you'll add all the logic

    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:12:12'
      // Add logic
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:30:30'
    ```

4. In the `getProofs` function, you can define the address for the gRPC server and use it to create an instance of the `PullServiceClient`. Supra has one address for MainNets, `'mainnet-dora.supraoracles.com'` and one for TestNets, `'testnet-dora.supraoracles.com'`

    === "Moonbeam"

        ```js title="main.js"
        --8<-- 'code/tutorials/integrations/supra/main-mb.js:12:14'
        --8<-- 'code/tutorials/integrations/supra/main-mb.js:30:30'
        ```

    === "Moonbase Alpha"

        ```js title="main.js"
        --8<-- 'code/tutorials/integrations/supra/main-mba.js:12:14'
        --8<-- 'code/tutorials/integrations/supra/main-mb.js:30:30'
        ```

5. To request data from the client, first, you need to define the data you want to request

    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:12:12'
      // ...
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:16:19'
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:30:30'
    ```

6. Now you can request the proof for the data pair(s) by calling the `getProof` method of the Pull Service Client

    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:12:12'
      // ...
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:21:29'
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:30:30'
    ```

7. Create a `main` function that calls the `getProofs` function and saves the proofs to be consumed in later steps

    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:120:121'
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:133:135'
    ```

??? code "main.js"

    === "Moonbeam"

        ```js
        --8<-- 'code/tutorials/integrations/supra/main-mb.js::1'

        --8<-- 'code/tutorials/integrations/supra/main-mb.js:9:30'

        --8<-- 'code/tutorials/integrations/supra/main-mb.js:120:121'
        --8<-- 'code/tutorials/integrations/supra/main-mb.js:133:135'
        ```

    === "Moonbase Alpha"

        ```js
        --8<-- 'code/tutorials/integrations/supra/main-mba.js::1'

        --8<-- 'code/tutorials/integrations/supra/main-mba.js:9:30'

        --8<-- 'code/tutorials/integrations/supra/main-mba.js:120:121'
        --8<-- 'code/tutorials/integrations/supra/main-mba.js:133:135'
        ```

So far, you have the logic required to retrieve proofs for data pairs. The proofs are bytes of data that are not human-readable, but you can follow the steps in the next section to deserialize the data into human-readable formats. This step is optional, so you can [skip ahead to verify the proofs and write the price data on-chain](#verify-and-publish-proofs).

### Deserialize the Proofs {: #deserialize-proofs }

If you want to deserialize the data to read the latest price data you've retrieved, you can use the interfaces for the proof data and the signed coherent cluster data.

Coherent cluster data is a set of values where all the values in that set agree. This is a component of Supra's DORA (Distributed Oracle Agreement) protocol, which, in its simplest form, is a protocol that aggregates a set of data into a single representative value. If you want to dive deeper, check out the [DORA litepaper](https://supra.com/news/dora-distributed-oracle-agreement/){target=\_blank}.

You'll need to create a file for each interface, which you can store in a `resources` directory:

```bash
mkdir resources && touch resources/oracleProof.json resources/signedCoherentCluster.json
```

Then, you can copy the following code snippets and add them to their respective files:

???+ code "Interface files"

    === "oracleProof.json"

        ```json
        --8<-- 'code/tutorials/integrations/supra/oracleProof.json'
        ```

    === "signedCoherentCluster.json"

        ```json
        --8<-- 'code/tutorials/integrations/supra/signedCoherentCluster.json'
        ```

To work with these interfaces, you must install the [Ethereum library](/builders/build/eth-api/libraries/){target=\_blank} of your choice. For this example, we'll use [Web3.js](/builders/build/eth-api/libraries/web3js){target=\_blank}.

```bash
npm i web3
```

Next, you can take the following steps to create a function that deserializes the proof data:

1. In the `main.js` file, import the interfaces and Web3
    
    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:2:4'
    ```

2. Create a Web3 instance, which will be used to interact with the interfaces. You can add this snippet directly after the imports

    === "Moonbeam"

        ```js title="main.js"
        --8<-- 'code/tutorials/integrations/supra/main-mb.js:8:8'
        ```

    === "Moonbase Alpha"
    
        ```js title="main.js"
        --8<-- 'code/tutorials/integrations/supra/main-mba.js:8:8'
        ```

3. Create a `deserializeProofBytes` function to add all the logic for deserializing the proofs. The function should accept the proof formatted in hex as a parameter

    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:33:33'
      // Add logic here
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:75:75'
    ```

4. First you can decode the parameters of the proof data using the Oracle Proof interface and extract the raw bytes of the signed pair cluster data and which pair IDs have been requested

    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:33:33'
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:34:38'
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:75:75'
    ```

5. Next, you can iterate over the signed pair cluster data and decode the parameters using the Signed Coherent Cluster interface, and then save the data for each pair to variables that you can log to the console

    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:33:33'
      // ...

    --8<-- 'code/tutorials/integrations/supra/main-mb.js:40:75'
    ```

6. In the `main` function that you created in the previous section, you can convert the `proofs` to hex and call the `deserializeProofBytes` function

    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:120:125'
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:133:135'
    ```

??? code "main.js"

    === "Moonbeam"

        ```js
        --8<-- 'code/tutorials/integrations/supra/main-mb.js::4'

        --8<-- 'code/tutorials/integrations/supra/main-mb.js:8:75'

        --8<-- 'code/tutorials/integrations/supra/main-mb.js:120:125'
        --8<-- 'code/tutorials/integrations/supra/main-mb.js:133:135'
        ```

    === "Moonbase Alpha"

        ```js
        --8<-- 'code/tutorials/integrations/supra/main-mba.js::4'

        --8<-- 'code/tutorials/integrations/supra/main-mba.js:8:75'

        --8<-- 'code/tutorials/integrations/supra/main-mba.js:120:125'
        --8<-- 'code/tutorials/integrations/supra/main-mba.js:133:135'
        ```

When you request the proof data, you can view that data in a human-readable format. You can try it out by running:

```bash
node main.js
```

The terminal output should look something like the following:

--8<-- 'code/tutorials/integrations/supra/terminal/deserialized-output.md'

## Use Web3 to Verify and Publish the Proofs {: #verify-and-publish-proofs }

Now that we've retrieved the price data, we need to be able to consume it to verify and publish the data on-chain. To do this, we'll need a smart contract that uses Supra's Pull contract to verify the proof data.

### Create the Consumer Contract {: #create-the-consumer-contract }

You can take the following steps to create our smart contract:

1. Create a new file for the smart contract, which we'll name `OracleClient`

    ```bash
    touch OracleClient.sol
    ```

2. In the file, create an interface for Supra's Pull contract. The interface outlines the data structure for the price data and has a function that we'll call to verify proofs. Then, in our `OracleClient` contract, we'll instantiate the `ISupraOraclePull` interface with the address of Supra's Pull contract on Moonbeam or Moonbase Alpha

    ```solidity title="OracleClient.sol"
    --8<-- 'code/tutorials/integrations/supra/OracleClient.sol::20'
    ```

3. In the same file, create the `OracleClient` contract. As mentioned in the previous step, the constructor of this contract instantiates the `ISupraOraclePull` interface with the address of Supra's Pull contract. The contract also includes a function that calls the `verifyOracleProof` function of the Pull contract and saves the price data on-chain

    ```solidity title="OracleClient.sol"
    // ...

    --8<-- 'code/tutorials/integrations/supra/OracleClient.sol:22:55'
    ```

??? code "OracleClient.sol"

    ```solidity
    --8<-- 'code/tutorials/integrations/supra/OracleClient.sol'
    ```

!!! note
    This contract only saves the price data for one pair. So, if you want to save the price data for multiple pairs, you must modify the contract.

### Deploy the Contract {: #deploy-the-consumer-contract }

With the contract created, you must next deploy the contract. Since we've already installed Web3.js, let's use it to deploy the contract. If you're unfamiliar with the process, you can reference the [Web3.js docs on deploying a smart contract](https://docs.moonbeam.network/builders/build/eth-api/libraries/web3js/#deploy-a-contract){target=\_blank}.

To deploy the contract, take the following steps:

1. Create a file that will contain the logic for compiling and deploying the smart contract

    ```bash
    touch deploy.js
    ```

2. Install the Solidity compiler. We're installing version 0.8.20, as that is the version required by the `OracleClient` contract

    ```bash
    npm i solc@0.8.20
    ```

3. Add the following imports

    ```js title="deploy.js"
    --8<-- 'code/tutorials/integrations/supra/deploy-oracle-mb.js:1:3'
    ```

4. Create the Web3 instance

    === "Moonbeam"

        ```js
        --8<-- 'code/tutorials/integrations/supra/deploy-oracle-mb.js:5:5'
        ```

    === "Moonbase Alpha"

        ```js
        --8<-- 'code/tutorials/integrations/supra/deploy-oracle-mba.js:5:5'
        ```

5. Create a function that compiles the `OracleClient` contract, saves the ABI in the `resources` directory for later use, and returns the ABI and bytecode for the deployment

    ```js title="deploy.js"
    --8<-- 'code/tutorials/integrations/supra/deploy-oracle-mb.js:7:39'
    ```

6. Create the function to deploy the compiled contract. You'll need to pass the address of Supra's Pull contract to the constructor. You'll also need to provide your address and your private key

    !!! remember
        Never store your private key in a JavaScript file; this is for demo purposes only.

    === "Moonbeam"

        ```js title="deploy.js"
        --8<-- 'code/tutorials/integrations/supra/deploy-oracle-mb.js:41:73'
        ```

    === "Moonbase Alpha"

        ```js title="deploy.js"
        --8<-- 'code/tutorials/integrations/supra/deploy-oracle-mba.js:41:73'
        ```

??? code "deploy.js"

    === "Moonbeam"

        ```js
        --8<-- 'code/tutorials/integrations/supra/deploy-oracle-mb.js:1'
        ```

    === "Moonbase Alpha"

        ```js
        --8<-- 'code/tutorials/integrations/supra/deploy-oracle-mba.js:1'
        ```

To deploy the contract, run:

```bash
node deploy.js
```

The contract's address will be printed to the terminal; save it as you'll need it in the following steps.

--8<-- 'code/tutorials/integrations/supra/terminal/deploy.md'

### Call the Contract {: #call-the-consumer-contract }

To verify the proof data and publish the latest price on-chain, the last step you'll need to do is to create a function that calls the `GetPairPrice` function of the `OracleClient` contract.

Back in the `main.js` file, take the following steps:

1. Import the ABI for the `OracleClient` contract

    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:5:5'
    ```

2. Create a function that accepts the hex-formatted proof data and will be responsible for calling the `OracleClient` contract

    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:78:78'
      // Add logic here
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:104:104'
    ```

3. In the `callContract` function, create an instance of the deployed `OracleClient` contract using the ABI and the contract address, which you should have saved from deploying the contract in the previous set of steps

    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:78:80'
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:104:104'
    ```

4. Create the transaction object that will call the `GetPairPrice` function of the `OracleClient` contract. You'll need to provide your address in the transaction object

    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:78:94'
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:104:104'
    ```
  
5. Add logic for signing and sending the transaction. You'll need to provide your private key

    !!! remember
        Never store your private key in a JavaScript file; this is for demo purposes only.

    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:78:104'
    ```

6. The last step is to call the `callContract` function from the `main` function

    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:120:129'
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:133:135'
    ```

??? code "main.js"

    === "Moonbeam"

        ```js
        --8<-- 'code/tutorials/integrations/supra/main-mb.js::5'
        --8<-- 'code/tutorials/integrations/supra/main-mb.js:7:104'

        --8<-- 'code/tutorials/integrations/supra/main-mb.js:120:129'
        --8<-- 'code/tutorials/integrations/supra/main-mb.js:133:135'
        ```

    === "Moonbase Alpha"

        ```js
        --8<-- 'code/tutorials/integrations/supra/main-mba.js::5'
        --8<-- 'code/tutorials/integrations/supra/main-mba.js:7:104'

        --8<-- 'code/tutorials/integrations/supra/main-mba.js:120:129'
        --8<-- 'code/tutorials/integrations/supra/main-mba.js:133:135'
        ```

And that's all the logic you'll need to request, verify, and write the latest price data for a data pair on-chain using Supra!

To verify and write the price data on-chain, go ahead and run:

```bash
node main.js
```

The deserialized output and the transaction receipt will be printed to the console.

--8<-- 'code/tutorials/integrations/supra/terminal/transaction-receipt.md'

## Retrieve On-Chain Price Data {: #retrieve-on-chain-price-data }

If you want to access the on-chain price data, you can create another contract that interacts with Supra's Storage contract.

### Create the Retrieval Contract {: #create-the-retrieval-contract }

To create the contract, you can take the following steps:

1. Create a new file for the smart contract, which we'll name `FeedClient`

    ```bash
    touch FeedClient.sol
    ```

2. In the file, create an interface for Supra's Storage contract. The interface has two functions: one for retrieving the price data for a single data pair and another that retrieves price data for multiple data pairs. Then, in our `FeedClient` contract, we'll instantiate the `ISupraSValueFeed` interface with the address of Supra's Storage contract on Moonbeam or Moonbase Alpha

    ```solidity title="FeedClient.sol"
    --8<-- 'code/tutorials/integrations/supra/FeedClient.sol:1:9'
    ```

3. In the same file, create the `FeedClient` contract. As mentioned in the previous step, the constructor of this contract instantiates the `ISupraSValueFeed` interface with the address of Supra's Storage contract. The contract also includes functions that call the `getSValue` and `getSValues` functions of the Storage contract and return the response in a decoded format

    ```solidity title="FeedClient.sol"
    // ...

    --8<-- 'code/tutorials/integrations/supra/FeedClient.sol:11:63'
    ```

??? code "FeedClient.sol"

    ```solidity
    --8<-- 'code/tutorials/integrations/supra/FeedClient.sol'
    ```

### Deploy the Contract {: #deploy-the-retrieval-contract }

The steps for compiling and deploying the contract are similar to those in the previous section. You can either duplicate the `deploy.js` file and make the necessary edits or directly edit the existing `deploy.js` file with the following two changes:

- Update the contract name from `OracleClient` to `FeedClient`
- Update the contract address in the deployment transaction to be the Storage contract address instead of the Pull contract address

You should end up with the following code:

???+ code "deploy.js"

    === "Moonbeam"

        ```js
        --8<-- 'code/tutorials/integrations/supra/deploy-feed-mb.js'
        ```

    === "Moonbase Alpha"

        ```js
        --8<-- 'code/tutorials/integrations/supra/deploy-feed-mba.js'
        ```

To deploy the contract, run:

```bash
node deploy.js
```

The contract address will be printed to your terminal; save it as you'll need it in the next section.

### Call the Contract {: #call-the-retrieval-contract }

For simplicity, you can add a function to the `main.js` file that retrieves the data from the `FeedClient` contract:

1. Import the ABI of the `FeedClient` contract

    ```js
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:6:6'
    ```

2. Create a function named `getPriceData` that accepts the index of a data pair as a parameter and will be responsible for calling the `FeedClient` contract

    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:107:107'
      // Add logic here
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:118:118'
    ```

3. In the `getPriceData` function, create an instance of the deployed `FeedClient` contract using the ABI and the contract address, which you should have saved from deploying the contract in the previous set of steps

    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:107:109'
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:118:118'
    ```

4. Call the `getPrice` function of the `FeedClient` contract and log the results to the console

    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:107:118'
    ```

5. In the `main` function, add the logic to call the `getPriceData` function

    ```js title="main.js"
    --8<-- 'code/tutorials/integrations/supra/main-mb.js:120:135'
    ```

??? code "main.js"

    === "Moonbeam"

        ```js
        --8<-- 'code/tutorials/integrations/supra/main-mb.js'
        ```

    === "Moonbase Alpha"

        ```js
        --8<-- 'code/tutorials/integrations/supra/main-mba.js'
        ```

Run the following command to print the price data to the terminal:

!!! note
    Feel free to comment out the calls to the `deserializeProofBytes` and `callContract` functions if you only want to retrieve the price data.

```bash
node main.js
```

The terminal output should now include the price data.

--8<-- 'code/tutorials/integrations/supra/terminal/price-data-output.md'

And that's it! You've successfully fetched the proof data from Supra, verified and published it on-chain, and retrieved it! For more information on Supra Oracles, please check out their [documentation](https://supra.com/docs/){target=\_blank}.

--8<-- 'text/_disclaimers/educational-tutorial.md'

--8<-- 'text/_disclaimers/third-party-content.md'
