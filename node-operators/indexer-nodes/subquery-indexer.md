
---
title: Create a SubQuery indexing project
description: Create a SubQuery project in minutes indexing Moonbeam blockchain data with Docker
---

# Create a SubQuery Indexing Project on Moonbeam

![SubQuery Indexer with Moonbeam](/images/node-operators/indexer-nodes/subquery/subquery-indexer.png)

## Introduction {: #introduction } 

[SubQuery](https://subquery.network/) is a leading data indexer that provides fast, reliable, decentralised, and customised APIs for web3 projects. SubQuery empowers developers from over 80+ ecosystems (including Moonbeam) with rich indexed data to allow them to build intuitive and immersive experiences for their users. The SubQuery Network powers unstoppable apps with a resilient and decentralised infrastructure network. Use SubQuery's blockchain developer toolkit to build the web3 applications of the future, without wasting time building a custom backend for data processing activities.

## Quick Start Guide {: #quick-start-guide } 

This quick start guide introduces SubQuery's Substrate EVM support by using an example project in Moonbeam Network. The example project indexes all Transfers from the [Moonbeam EVM FRAX ERC-20 contract](https://moonscan.io/token/0x322e86852e492a7ee17f28a78c663da38fb33bfb), as well as Collators joining and leaving events from [Moonbeam's Staking functions](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/).

This project is unique, as it indexes data from both Moonbeam's Substrate execution layer (native Moonbeam pallets and runtime), with smart contract data from Moonbeam's EVM smart contract layer, within the same SubQuery project and into the same dataset. A very similar approach was taken with [indexing Astar's WASM layer too](https://academy.subquery.network/quickstart/quickstart_chains/polkadot-astar.html).

Previously, in the [1. Create a New Project](https://academy.subquery.network/quickstart/quickstart.html) section, [3 key files](https://academy.subquery.network/quickstart/quickstart.html#_3-make-changes-to-your-project) were mentioned. Let's take a closer look at these files.


## 1. GraphQL Schema File {: #graphql-schema-file } 

The `schema.graphql` file determines the shape of the data that you are using SubQuery to index, hence it's a great place to start. The shape of your data is defined in a GraphQL Schema file with various [GraphQL entities](https://academy.subquery.network/build/graphql.html).

The Moonbeam-evm-substrate-starter project has two entities. An Erc20Transfer and Collator. These two entities index ERC-20 transfers related to [the $FRAX contract](https://moonscan.io/token/0x322e86852e492a7ee17f28a78c663da38fb33bfb), as well as any [collators joining or leaving](https://docs.moonbeam.network/node-operators/networks/collators/activities/) the Moonbeam Parachain.

```graphql
type Erc20Transfer @entity {
  id: ID! #id is a required field
  from: String!
  to: String!
  contractAddress: String!
  amount: BigInt!
}

type Collator @entity {
  id: ID! #collator address
  joinedDate: Date!
}
```

!!! note 
    When you make any changes to the schema file, please ensure that you regenerate your types directory.

=== "yarn"
    ```
    yarn codgen
    ```

=== "npm"
    ```
    npm run-script codegen
    ```

You will find the generated models in the `/src/types/models` directory.

Check out the [GraphQL Schema](https://academy.subquery.network/build/graphql.html) documentation to get in-depth information on `schema.graphql` file.

## 2. The Project Manifest File {: #the-project-manifest-file } 

The Project Manifest (`project.yaml`) file works as an entry point to your project. It defines most of the details on how SubQuery will index and transform the chain data. For Substrate/Polkadot chains, there are three types of mapping handlers:

- [BlockHanders](https://academy.subquery.network/build/manifest/polkadot.html#mapping-handlers-and-filters): On each and every block, run a mapping function
- [EventHandlers](https://academy.subquery.network/build/manifest/polkadot.html#mapping-handlers-and-filters): On each and every Event that matches optional filter criteria, run a mapping function
- [CallHanders](https://academy.subquery.network/build/manifest/polkadot.html#mapping-handlers-and-filters): On each and every extrinsic call that matches optional filter criteria, run a mapping function

For [EVM](https://academy.subquery.network/build/substrate-evm.html) and [WASM](https://academy.subquery.network/build/substrate-wasm.html) data processors on Substrate/Polkadot chains, there are only two types of mapping handlers:

- [EventHandlers](https://academy.subquery.network/build/substrate-evm.html#event-handlers): On each and every Event that matches optional filter criteria, run a mapping function
- [CallHanders](https://academy.subquery.network/build/substrate-evm.html#call-handlers): On each and every extrinsic call that matches optional filter criteria, run a mapping function


### Substrate Manifest section {: #substrate-manifest-Section } 

**Since we are planning to index all Polkadot transfers, we need to update the `datasources` section as follows:**

```yaml
dataSources:
  - kind: substrate/Runtime
    # This is the datasource for Moonbeam's Native Substrate processor
    startBlock: 1
    mapping:
      file: ./dist/index.js
      handlers:
       - handler: handleCollatorJoined
          kind: substrate/CallHandler
          filter:
            module: staking
            method: joinCandidates
        - handler: handleCollatorLeft
          kind: substrate/CallHandler
          filter:
            module: staking
            method: executeLeaveCandidates
```

This indicates that you will be running a `handleCollatorJoined` mapping function whenever the method `joinCandidates` is called on the `staking` pallet. Similarly, we will run `handleCollatorLeft` whenever the method `executeLeaveCandidates` is called on the staking pallet. This covers the most basic actions that Collators can do (requesting to join the candidates pool & leaving the candidates pool). For more information about other methods possible under the pallet `staking`in Moonbeam, the Moonbeam documentation provides a [list of possible functions to call](https://docs.moonbeam.network/builders/pallets-precompiles/pallets/staking/).

Check out our [Manifest File](https://academy.subquery.network/build/manifest/polkadot.html) documentation to get more information about the Project Manifest (`project.yaml`) file.

### EVM Manifest Section {: #evm-manifest-Section } 

If you're not using the [EVM-Substrate starter template](https://github.com/subquery/subql-starter/tree/main/Moonbeam/moonbeam-evm-substrate-starter) then please add the frontier EVM Datasource as a dependency using `yarn add @subql/frontier-evm-processor`.

We are indexing all transfers and approve contract call events from the $FRAX contract `0x322E86852e492a7Ee17f28a78c663da38FB33bfb`. First, you will need to import the contract ABI defintion. You can copy the entire JSON and save it as a file `./erc20.abi.json` in the root directory.

This section in the Project Manifest now imports all the correct definitions and lists the triggers that we look for on the blockchain when indexing. We add another section the datasource beneath the above [substrate manifest section](https://academy.subquery.network/quickstart/quickstart_chains/polkadot-moonbeam.html#substrate-manifest-section).

```yaml
dataSources:
  - kind: substrate/Runtime
    # This is the datasource for Moonbeam's Native Substrate processor
    ...
  - kind: substrate/FrontierEvm
    # This is the datasource for Moonbeam's EVM processor
    startBlock: 189831
    #This is the block at which $FRAX contract was deployed
    processor:
      file: ./node_modules/@subql/frontier-evm-processor/dist/bundle.js
      options:
        abi: erc20
        contract: "0x322E86852e492a7Ee17f28a78c663da38FB33bfb" # Mainnet
    assets:
      erc20:
        file: ./erc20.abi.json
    mapping:
      file: ./dist/index.js
      handlers:
        - handler: handleErc20Transfer
          kind: substrate/MoonbeamEvent
          filter:
            topics:
              - Transfer(address indexed from,address indexed to,uint256 value)

```

The above code indicates that you will be running a `handleErc20Transfer` mapping function whenever there is an `Transfer` event on any transaction from the Moonbeam $FRAX contract.

Check out our [Substrate EVM](https://academy.subquery.network/build/substrate-evm.html) documentation to get more information about the Project Manifest (`project.yaml`) file for Substrate EVM contracts.

## 3. Mapping Functions ## 2 {: #mapping-functions } 

Mapping functions define how chain data is transformed into the optimised GraphQL entities that we previously defined in the `schema.graphql` file.

Navigate to the default mapping function in the `src/mappings` directory. There are the exported functions `handleCollatorJoined`, `handleCollatorLeft` and `handleErc20Transfer`.

```ts
export async function handleCollatorJoined(
  call: SubstrateExtrinsic
): Promise<void> {
  //We added a logger to the top of this function, in order to see the block number of the event we are processing.
  logger.info(`Processing SubstrateEvent at ${call.block.block.header.number}`);

  const address = call.extrinsic.signer.toString();

  const collator = Collator.create({
    id: address,
    joinedDate: call.block.timestamp,
  });

  await collator.save();
}

export async function handleCollatorLeft(
  call: SubstrateExtrinsic
): Promise<void> {
  //We added a logger to the top of this function, in order to see the block number of the event we are processing.
  logger.info(`Processing SubstrateCall at ${call.block.block.header.number}`);

  const address = call.extrinsic.signer.toString();
  await Collator.remove(address);
}
```

The `handleCollatorJoined` and `handleCollatorLeft` functions receives Substrate event/call data from the native Substrate environment whenever an event/call matches the filters that were specified previously in the `project.yaml`. It extracts the various data from the event/call payload, then checks if an existing Collator record exists. If none exists (e.g. it's a new collator), then it instantiates a new one and then updates the total stake to reflect the new collators. Then the `.save()` function is used to save the new/updated entity (_SubQuery will automatically save this to the database_).

```ts
export async function erc20Transfer(
  event: MoonbeamEvent<
    [string, string, BigNumber] & { from: string; to: string; value: BigNumber }
  >
): Promise<void> {
  //We added a logger to the top of this function, in order to see the block number of the event we are processing.
  logger.info(`Processing MoonbeamEvent at ${event.blockNumber.toString()}`);
  const transfer = Erc20Transfer.create({
    id: event.transactionHash,
    from: event.args.from,
    to: event.args.to,
    amount: event.args.value.toBigInt(),
    contractAddress: event.address,
  });

  await transfer.save();
}
```

The `handleErc20Transfer` function receives event data from the EVM execution environment whenever an event matches the filters that was specified previously in the `project.yaml`. It instantiates a new `Transfer` entity and populates the fields with data from the EVM Call payload. Then the `.save()` function is used to save the new entity (_SubQuery will automatically save this to the database_).

Check out our mappings documentation for [Substrate](https://academy.subquery.network/build/mapping/polkadot.html) and the [Substrate Frontier EVM data processor](https://academy.subquery.network/build/substrate-evm.html) to get detailed information on mapping functions for each type.

## 4. Build Your Project {: #build-your-project } 

Next, build your work to run your new SubQuery project. Run the build command from the project's root directory as given here:

=== "yarn"
    ```
    yarn build
    ```

=== "npm"
    ```
    npm run-script build
    ```

!!! note 
    Whenever you make changes to your mapping functions, make sure to rebuild your project.


## 5. Run Your Project Locally with Docker {: #run-your-project-locally-with-docker } 

SubQuery provides a Docker container to run projects very quickly and easily for development purposes.

The `docker-compose.yml` file defines all the configurations that control how a SubQuery node runs. For a new project, which you have just initialised, you won't need to change anything.

Run the following command under the project directory:

=== "yarn"
    ```
    yarn start:docker
    ```

=== "npm"
    ```
    npm run-script start:docker
    ```

!!! note 
    It may take a few minutes to download the required images and start the various nodes and Postgres databases.

Visit [Running SubQuery Locally](https://academy.subquery.network/run_publish/run.html) to get more information on the file and the settings.

## 6. Query Your Project {: #query-your-project } 

Once the container is running, navigate to http://localhost:3000 in your browser and run the sample GraphQL command provided in the README file. Below is an example query from this project.

Once the container is running, navigate to http://localhost:3000 in your browser and run the sample GraphQL command provided in the README file. Below is an example query from the Astar-wasm-starter project.

```graphql
query {
  erc20Transfers(first: 3, orderBy: BLOCK_HEIGHT_ASC) {
    nodes {
      id
      from
      to
      contractAddress
      amount
    }
  }
}
```

There is a _Docs_ tab on the right side of the playground which should open a documentation drawer. This documentation is automatically generated and helps you find what entities and methods you can query. To learn more about the GraphQL Query language [here](https://academy.subquery.network/run_publish/query.html).

You should see results similar to below:

```json
{
  "data": {
    "erc20Transfers": {
      "nodes": [
        {
          "id": "0x6eadc6336e57c95012a0b3fe0bbfdfe4b05870db45f54022f6f0fae99094389e",
          "from": "0xB213A825552FBC78DcA987824F74c8a870696ede",
          "to": "0xd3bE0E32147ae91378F035fF96f3e2cAb96aC48b",
          "contractAddress": "0x322e86852e492a7ee17f28a78c663da38fb33bfb",
          "amount": "421311117864349454574"
        },
        {
          "id": "0x042e355370899571f0a8828e943ac794554b48c3d042a0a26cfd64e3b1107de5",
          "from": "0xd3bE0E32147ae91378F035fF96f3e2cAb96aC48b",
          "to": "0x1d3286A3348Fa99852d147C57A79045B41c4f713",
          "contractAddress": "0x322e86852e492a7ee17f28a78c663da38fb33bfb",
          "amount": "180233014368657600639"
        },
        {
          "id": "0x1fcc93ee0879ade7df0bfbaaaff32b0aef31698865ede29290b5616b59683f5e",
          "from": "0x5f68e72bF781d3927a59Ff74030b87A0F628EB91",
          "to": "0x054Fb7D6c1E3d7771B128Eb6FA63864745284Fc5",
          "contractAddress": "0x322e86852e492a7ee17f28a78c663da38fb33bfb",
          "amount": "24614491694707430571"
        },
        {
          "id": "0x50eecab0be3c46ff1d1aa8effcd1166bbdcb9f28582c2a5f53fd35b25b8cd021",
          "from": "0x2974A0D3e70FDe22d44c188F770beE964205aCad",
          "to": "0xa7A3Cb7d3f9Cf963012fdd54E6de3562A3A5f140",
          "contractAddress": "0x322e86852e492a7ee17f28a78c663da38fb33bfb",
          "amount": "380739794849478795472"
        }
      ]
    }
  }
}
```

## What's next? {: #what-next } 

Congratulations! You have now a locally running SubQuery project that accepts GraphQL API requests for transfer events from the $FRAX smart contract at [`0x322E86852e492a7Ee17f28a78c663da38FB33bfb`](https://moonscan.io/token/0x322e86852e492a7ee17f28a78c663da38fb33bfb).

!!! note 
    Find out how to build a performant SubQuery project and avoid common mistakes in [Project Optimisation](../../build/optimisation.md).

Click [here](https://academy.subquery.network/quickstart/whats-next.html) to learn what should be your **next step** in your SubQuery journey.
