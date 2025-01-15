---
title: Index a Local Development Node
description: Improve your DApp development experience by following this guide to learn how to index a DApp deployed locally on a Moonbeam dev node with SQD (Subsquid)!
---

# Index a Local Moonbeam Development Node with SQD (formerly Subsquid)

_by Erin Shaben and Kevin Neilson_

## Introduction {: #introduction }

When developing a dApp, it's beneficial to develop smart contracts using a local development environment as opposed to a live network, such as a TestNet or MainNet. Local development removes some of the hassles involved with developing on a live network, like having to fund development accounts and waiting for blocks to be produced. On Moonbeam, developers can spin up their own local [Moonbeam development node](/builders/get-started/networks/moonbeam-dev/){target=\_blank} to quickly and easily build and test applications.

But what about dApps that rely on indexers to index blockchain data? How can developers of these applications streamline the development process? Thanks to [SQD](/builders/integrations/indexers/subsquid/){target=\_blank}, a data network for retrieving data from 100+ chains, it is now possible to index blocks in a local development environment, such as your Moonbeam development node!

This tutorial will walk you through the process of indexing data on a local Moonbeam development node using SQD. We'll create an ERC-20 contract and use SQD to index transfers of our ERC-20.

## Check Prerequisites {: #check-prerequisites }

To follow along with this tutorial, you'll need to have:

- [Docker installed](https://docs.docker.com/get-docker){target=\_blank}
- [Docker Compose installed](https://docs.docker.com/compose/install){target=\_blank}
- An empty Hardhat project. For step-by-step instructions, please refer to the [Creating a Hardhat Project](/builders/ethereum/dev-env/hardhat/#creating-a-hardhat-project){target=\_blank} section of our Hardhat documentation page
- An [ERC-20 token deployed](#deploy-an-erc-20-contract) to your local development node, unless you plan on indexing Moonbase Alpha and using an existing ERC-20

We'll configure our Hardhat project and create our SQD project later on in the tutorial.

## Spin up a Local Development Node {: #spin-up-a-local-development-node }

To get started, we're going to spin up a local Moonbeam development node using Docker. For the purposes of this tutorial, we're going to configure our development node to produce (seal) blocks every four seconds. This will ease the debugging process. However, you can feel free to increase or decrease this time or configure your node to instantly seal blocks. When using instant seal, a block will be created when a transaction is received.

We'll use the following commands when starting up our node:

- `--dev` - specifies to use a development chain
- `--sealing 4000` - seals a block every four seconds (4000 milliseconds)
- `--rpc-external` - listen to all HTTP and WebSocket interfaces

To spin up a development node, which will pull the latest Docker image for Moonbeam, you can run the following command:

=== "Ubuntu"

    ```bash
    docker run --rm --name {{ networks.development.container_name }} --network host \
    moonbeamfoundation/moonbeam:{{ networks.development.build_tag }} \
    --dev --sealing 4000 --rpc-external
    ```

=== "MacOS"

    ```bash
    docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 \
    moonbeamfoundation/moonbeam:{{ networks.development.build_tag }} \
    --dev --sealing 4000 --rpc-external
    ```

=== "Windows"

    ```bash
    docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 ^
    moonbeamfoundation/moonbeam:{{ networks.development.build_tag }} ^
    --dev --sealing 4000 --rpc-external
    ```

This will start up our development node, which can be accessed on port 9944. Note that you do not have to use Docker; you can also [run a local node by compiling the Moonbeam binary](/builders/get-started/networks/moonbeam-dev/#getting-started-with-the-binary-file){target=\_blank}.

![Spin up a Moonbeam development node](/images/tutorials/integrations/local-subsquid/new/local-squid-1.webp)

Our development node comes with 10 prefunded accounts.

??? note "Development account addresses and private keys"
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/dev-accounts.md'

For more information on running a Moonbeam development node, please refer to the [Getting Started with a Moonbeam Development Node](/builders/get-started/networks/moonbeam-dev/){target=\_blank} guide.

## Deploy an ERC-20 with Hardhat {: #deploy-an-erc-20-with-hardhat }

You should have already created an empty Hardhat project, but if you haven't done so, you can find instructions in the [Creating a Hardhat Project](/builders/ethereum/dev-env/hardhat/#creating-a-hardhat-project){target=\_blank} section of our Hardhat documentation page.

In this section, we'll configure our Hardhat project for a local Moonbeam development node, create an ERC-20 contract, and write scripts to deploy and interact with our contract.

Before we dive into creating our project, let's install a couple of dependencies that we'll need: the [Hardhat Ethers plugin](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-ethers){target=\_blank} and [OpenZeppelin contracts](https://docs.openzeppelin.com/contracts/4.x){target=\_blank}. The Hardhat Ethers plugin provides a convenient way to use the [Ethers](/builders/ethereum/libraries/ethersjs/){target=\_blank} library to interact with the network. We'll use OpenZeppelin's base ERC-20 implementation to create an ERC-20. To install both of these dependencies, you can run:

=== "npm"

    ```bash
    npm install @nomicfoundation/hardhat-ethers ethers@6 @openzeppelin/contracts
    ```

=== "yarn"

    ```bash
    yarn add @nomicfoundation/hardhat-ethers ethers@6 @openzeppelin/contracts
    ```

### Configure Hardhat for a Local Development Node {: #create-a-hardhat-project }

Before we update the configuration file, we'll need to get the private key of one of our development accounts, which will be used to deploy our contract and send transactions. For this example, we'll use Alith's private key:

```text
0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133
```

!!! remember
    **You should never store your private keys in a JavaScript or Python file.**

    The private keys for the development accounts are public knowledge because the accounts exist within your own development environment. However, when you move on to indexing a live network such as Moonbase Alpha or Moonbeam (which is out of scope for this tutorial), you should manage your private keys with a designated secret manager or similar service.

Now we can edit `hardhat.config.js` to include the following network and account configurations for our Moonbeam development node:

???+ code "hardhat.config.js"

    ```js
    --8<-- 'code/tutorials/integrations/local-subsquid/hardhat-config.js'
    ```

### Create an ERC-20 Contract {: #create-an-erc-20-contract }

For the purposes of this tutorial, we'll be creating a simple ERC-20 contract. We'll rely on OpenZeppelin's ERC-20 base implementation. We'll start by creating a file for the contract and naming it `MyTok.sol`:

```bash
mkdir -p contracts && touch contracts/MyTok.sol
```

Now we can edit the `MyTok.sol` file to include the following contract, which will mint an initial supply of MYTOKs and allow only the owner of the contract to mint additional tokens:

???+ code "MyTok.sol"

    ```solidity
    --8<-- 'code/tutorials/integrations/local-subsquid/MyTok.sol'
    ```

### Deploy an ERC-20 Contract {: #deploy-an-erc-20-contract }

Now that we have our contract set up, we can compile and deploy our contract.

To compile the contract, you can run:

```bash
npx hardhat compile
```

![Compile contracts using Hardhat](/images/tutorials/integrations/local-subsquid/new/local-squid-2.webp)

This command will compile our contract and generate an `artifacts` directory containing the ABI of the contract. To deploy our contract, we'll need to create a deployment script that deploys our ERC-20 contract and mints an initial supply of MYTOKs. We'll use Alith's account to deploy the contract, and we'll specify the initial supply to be 1000 MYTOK. The initial supply will be minted and sent to the contract owner, which is Alith.

Let's take the following steps to deploy our contract:

1. Create a directory and file for our script:

    ```bash
    mkdir -p scripts && touch scripts/deploy.js
    ```

2. In the `deploy.js` file, go ahead and add the following script:

    ???+ code "deploy.js"

        ```js
        --8<-- 'code/tutorials/integrations/local-subsquid/deploy.js'
        ```

3. Run the script using the `dev` network configurations we set up in the `hardhat.config.js` file:

    ```bash
    npx hardhat run scripts/deploy.js --network dev
    ```

The address of the deployed contract should be printed to the terminal. Save the address, as we'll need it to interact with the contract in the following section.

![Deploy contracts using Hardhat](/images/tutorials/integrations/local-subsquid/new/local-squid-3.webp)

### Transfer ERC-20s {: #transfer-erc-20s }

Since we'll be indexing `Transfer` events for our ERC-20, we'll need to send a few transactions that transfer some tokens from Alith's account to our other test accounts. We'll do this by creating a simple script that transfers 10 MYTOKs to Baltathar, Charleth, Dorothy, and Ethan. We'll take the following steps:

1. Create a new file script to send transactions:

    ```bash
    touch scripts/transactions.js
    ```

2. In the `transactions.js` file, add the following script and insert the contract address of your deployed MyTok contract (output in the console in the prior step):

    ???+ code "transactions.js"

        ```js
        --8<-- 'code/tutorials/integrations/local-subsquid/transactions.js'
        ```

3. Run the script to send the transactions:

    ```bash
    npx hardhat run scripts/transactions.js --network dev
    ```

As each transaction is sent, you'll see a log printed to the terminal.

![Send transactions using Hardhat](/images/tutorials/integrations/local-subsquid/new/local-squid-4.webp)

Now we can move on to creating our Squid to index the data on our local development node.

## Create a SQD Project {: #create-SQD-project }

Now we're going to create our Subquid project. First, we'll need to install the [SQD CLI](https://docs.subsquid.io/squid-cli){target=\_blank}:

```bash
npm i -g @subsquid/cli@latest
```

To verify successful installation, you can run:

```bash
sqd --version
```

Now we'll be able to use the `sqd` command to interact with our Squid project. To create our project, we're going to use the `--template` (`-t`) flag, which will create a project from a template. We'll be using the EVM Squid template, which is a starter project for indexing EVM chains.

You can run the following command to create an EVM Squid named `local-squid`:

```bash
sqd init local-squid --template evm
```

This will create a Squid with all of the necessary dependencies. You can go ahead and install the dependencies:

```bash
cd local-squid && npm ci
```

Now that we have a starting point for our project, we'll need to configure our project to index ERC-20 `Transfer` events from our local development node.

### Set Up the Indexer for ERC-20 Transfers {: #set-up-the-indexer-for-erc-20-transfer events}

In order to index ERC-20 transfers, we'll need to take a series of actions:

1. Update the database schema and generate models for the data
2. Use the `ERC20` contract's ABI to generate TypeScript interface classes that will be used by our Squid to index `Transfer` events
3. Configure the processor to process `Transfer` events for the `ERC20` contract
4. Add logic to process the `Transfer` events and save the processed transfer data

As mentioned, we'll first need to define the database schema for the transfer data. To do so, we'll edit the `schema.graphql` file, which is located in the root directory, and create a `Transfer` entity and `Account` entity. You can copy and paste the below schema, ensuring that any existing schema is first removed.

???+ code "schema.graphql"

    ```graphql
    --8<-- 'code/tutorials/integrations/local-subsquid/schema.graphql'
    ```

Now we can generate the entity classes from the schema, which we'll use when we process the transfer data. This will create new classes for each entity in the `src/model/generated` directory.

```bash
sqd codegen
```

In the next step, we'll use the ERC-20 ABI to automatically generate TypeScript interface classes. Below is a generic ERC-20 standard ABI. Copy and paste it into a file named `erc20.json` in the `abi` folder at the root level of the project.

??? code "ERC-20 ABI"

    ```json
    --8<-- 'code/tutorials/integrations/local-subsquid/erc20.json'
    ```

Next, we can use our contract's ABI to generate TypeScript interface classes. We can do this by running:

```bash
sqd typegen
```

![Run sqd typegen](/images/tutorials/integrations/local-subsquid/new/local-squid-5.webp)

This will generate the related TypeScript interface classes in the `src/abi/erc20.ts` file. For this tutorial, we'll be accessing the `events` specifically.

### Configure the Processor {: #configure-the-processor}

The `processor.ts` file tells SQD exactly what data you'd like to ingest. Transforming that data into the exact desired format will take place at a later step. In `processor.ts`, we'll need to indicate a data source, a contract address, the event(s) to index, and a block range.

Open up the `src` folder and head to the `processor.ts` file.

To get started, you can import the ERC-20 ABI, which will be used to define the ERC-20 data to be indexed:

```ts
import * as erc20 from './abi/erc20';
```

Next, we need to tell the SQD processor which contract we're interested in. Create a constant for the address in the following manner:

```ts
export const contractAddress = 'INSERT_CONTRACT_ADDRESS'.toLowerCase();
```

The `.toLowerCase()` is critical because the SQD processor is case-sensitive, and some block explorers format contract addresses with capitalization. Next, you'll see the line `export const processor = new EvmBatchProcessor()`, followed by `.setDataSource`. We'll need to make a few changes here. SQD has [available archives for many chains, including Moonbeam, Moonriver, and Moonbase Alpha](https://docs.subsquid.io/evm-indexing/supported-networks){target=\_blank} that can speed up the data retrieval process. For indexing a local development node, there's no archive necessary so the exclusive data source will be the RPC URL of our local node. Go ahead and comment out or delete the archive line. Once done, your code should look similar to the below:

```ts
.setDataSource({
  chain: {
    url: assertNotNull('{{ networks.development.rpc_url }}'),
    rateLimit: 300,
  },
})
```

![Run SQD commands](/images/tutorials/integrations/local-subsquid/new/local-squid-6.webp)

The Squid template comes with a variable for your RPC URL defined in your `.env` file. You can replace that with the RPC URL for your local development node. For demonstration purposes, the RPC URL for a local development node is hardcoded directly, as shown above. If you're setting the RPC URL in your `.env`, the respective line will look like this:

```text
RPC_ENDPOINT={{ networks.development.rpc_url }}
```

Now, let's define the event that we want to index by adding the following:

```ts
.addLog({
  address: [contractAddress],
  topic0: [erc20.events.Transfer.topic],
  transaction: true,
})
```

The `Transfer` event is defined in `erc20.ts`, which was auto-generated when `sqd typegen` was run. The import `import * as erc20 from './abi/erc20'` is already included as part of the Squid EVM template.

Block range is an important value to modify to narrow the scope of the blocks you're indexing. For example, if you launched your ERC-20 at block `1200000` on Moonbeam, there is no need to query the chain before that block for `Transfer` events. Since we're indexing a local node, this field can be excluded or set to 0. Setting an accurate block range will improve the performance of your indexer. You can set the earliest block to begin indexing in the following manner:

```ts
.setBlockRange({
  from: 0, // Note the lack of quotes here
});
```

The chosen start block here is 0 since we're indexing a local development node, but if you were indexing data on another Moonbeam network, you should change it to a starting block relevant to what you're indexing.

Change the `setFields` section to specify the following data for our processor to ingest:

```ts
.setFields({
  log: {
    topics: true,
    data: true,
  },
  transaction: {
    hash: true,
  },
})
```

Once you've completed the prior steps, your `processor.ts` file should look similar to this:

???+ code "processor.ts"

    ```ts
    --8<-- 'code/tutorials/integrations/local-subsquid/processor.ts'
    ```

### Transform and Save the Data {: #transform-and-save-the-data}

While `processor.ts` determines the data being consumed, `main.ts` determines the bulk of actions related to processing and transforming that data. In the simplest terms, we are processing the data that was ingested via the SQD processor and inserting the desired pieces into a TypeORM database. For more detailed information on how SQD works, be sure to check out the [SQD docs on Developing a Squid](https://docs.subsquid.io/basics/squid-development){target=\_blank}

Our `main.ts` file is going to scan through each processed block for the `Transfer` event and decode the transfer details, including the sender, receiver, and amount. The script also fetches account details for involved addresses and creates transfer objects with the extracted data. The script then inserts these records into a TypeORM database enabling them to be easily queried.

Let's break down the code that comprises `main.ts` in order:

1. In `processor.run`, the processor will iterate through all of the selected blocks and look for `Transfer` event logs. Whenever it finds a `Transfer` event, it's going to store it in an array of `Transfer` events where it awaits further processing
2. The `TransferEvent` interface is the type of structure that stores the data extracted from the event logs
3. `getTransfer` is a helper function that extracts and decodes ERC-20 `Transfer` event data from a log entry. It constructs and returns a `TransferEvent` object, which includes details such as the transaction ID, block number, sender and receiver addresses, and the amount transferred. `getTransfer` is called at the time of storing the relevant `Transfer` events into the array of transfers
4. `processTransfers` enriches the transfer data and then inserts these records into a TypeORM database using the `ctx.store` methods. The account model, while not strictly necessary, allows us to introduce another entity in the schema to demonstrate working with multiple entities in your Squid
5. `getAccount` is a helper function that manages the retrieval and creation of account objects. Given an account ID and a map of existing accounts, it returns the corresponding account object. If the account doesn't exist in the map, it creates a new one, adds it to the map, and then returns it

We'll demo a sample query in a later section. You can copy and paste the below code into your `main.ts` file:

???+ code "main.ts"

    ```ts
    --8<-- 'code/tutorials/integrations/local-subsquid/main.ts'
    ```

Now we've taken all of the steps necessary and are ready to run our indexer!

### Run the Indexer {: #run-indexer }

To run our indexer, we're going to run a series of `sqd` commands, as follows:

1. Build our project

    ```bash
    sqd build
    ```

2. Launch the database:

    ```bash
    sqd up
    ```

3. Run the following two commands sequentially:

    ```bash
    sqd migration:generate
    sqd migration:apply
    ```

4. Launch the processor:

    ```bash
    sqd process
    ```

!!! note
    You can review the `commands.json` file to see what each `sqd` command does under the hood.

In your terminal, you should see your indexer starting to process blocks!

![Run sqd process](/images/tutorials/integrations/local-subsquid/new/local-squid-6.webp)

If your Squid isn't indexing blocks properly, make sure that your development node is running with the `--sealing` flag. For this example, you should have set the flag as `--sealing 4000`, so that a block is produced every four seconds. You can feel free to edit the sealing interval as needed. Before you try to spin up your Squid again, run the following commands to restart your Squid:

1. Shut down your Squid

    ```bash
    sqd down
    ```

2. Start your Squid back up:

    ```bash
    sqd up
    ```

3. Start indexing again:

    ```bash
    sqd process
    ```

Now your indexer should be indexing your development node without any problems!

## Query your Squid {: #query-your-squid }

To query your squid, open up a new terminal window within your project and run the following command:

```bash
sqd serve
```

And that's it! You can now run queries against your Squid on the GraphQL playground at `http://localhost:4350/graphql`. Try crafting your own GraphQL query, or use the below one:

???+ code "Sample query"

    ```ts
    --8<-- 'code/tutorials/integrations/local-subsquid/sample-query.graphql'
    ```

![Running queries in GraphQL playground](/images/tutorials/integrations/local-subsquid/new/local-squid-7.webp)

All of the transfers will be returned, including the transfer of the initial supply to Alith's account and the transfers from Alith to Baltathar, Charleth, Dorothy, and Ethan.

And that's it! You've successfully used SQD to index data on a local Moonbeam development node! You can view the entire project on [GitHub](https://github.com/eshaben/local-squid-demo){target=\_blank}.

## Debug Your Squid {: #debug-your-squid }

It may seem tricky at first to debug errors when building your Squid, but fortunately, there are several techniques you can use to streamline this process. First and foremost, if you're facing errors with your Squid, you should enable debug mode in your `.env` file by uncommenting the debug mode line. This will trigger much more verbose logging and will help you locate the source of the error.

```text
# Uncommenting the below line enables debug mode
SQD_DEBUG=*
```

You can also add logging statements directly to your `main.ts` file to indicate specific parameters like block height and more. For example, see this version of `main.ts` which has been enhanced with detailed logging:

??? code "main.ts"

    ```ts
    --8<-- 'code/tutorials/integrations/local-subsquid/main-with-logging.ts'
    ```

See the [SQD guide to logging](https://docs.subsquid.io/basics/logging){target=\_blank} for more information on debug mode.

### Common Errors {: #common-errors }

Below are some common errors you may face when building a project and how you can solve them.

```text
FATAL sqd:processor RpcError: Expect block number from id: BlockId::Number(15316)
```

This error indicates that your indexer is trying to process blocks that don't exist on your local node. You can resolve this by setting a relevant `to` block limit in your processor as follows:

```ts
.setBlockRange({from: 0, to: 100})
```

Another common error can occur when you're experimenting with multiple instances of SQD on your machine.

```text
Error response from daemon: driver failed programming external connectivity on endpoint my-awesome-squid-db-1
(49df671a7b0531abbb5dc5d2a4a3f5dc7e7505af89bf0ad1e5480bd1cdc61052):
Bind for 0.0.0.0:23798 failed: port is already allocated
```

This error indicates that you have another instance of SQD running somewhere else. You can stop that gracefully with the command `sqd down` or by pressing the **Stop** button next to the container in Docker Desktop.

```text
Error: connect ECONNREFUSED 127.0.0.1:23798
     at createConnectionError (node:net:1634:14)
     at afterConnectMultiple (node:net:1664:40) {
     errno: -61,code: 'ECONNREFUSED',syscall: 'connect',
     address: '127.0.0.1',port: 23798}]}
```

To resolve this, run `sqd up` before you run `sqd migration:generate`.

Is your Squid error-free, yet you aren't seeing any transfers detected? Make sure your log events are consistent and identical to the ones your processor is looking for. Your contract address also needs to be lowercase, which you can be assured of by defining it as follows:

```text
export const contractAddress = '0x37822de108AFFdd5cDCFDaAa2E32756Da284DB85'.toLowerCase();
```

--8<-- 'text/_disclaimers/educational-tutorial.md'

--8<-- 'text/_disclaimers/third-party-content.md'
