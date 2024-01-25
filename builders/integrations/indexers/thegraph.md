---
title: Build APIs with The Graph
description: Learn how to build APIs, called subgraphs, to store and fetch on-chain data for a given smart contract using The Graph indexing protocol on Moonbeam. 
---

# Using The Graph on Moonbeam

## Introduction {: #introduction }

Indexing protocols organize information in a way that applications can access it more efficiently. For example, Google indexes the entire internet to provide information rapidly when you search for something.

[The Graph](https://thegraph.com/){target=\_blank} is a decentralized and open-source indexing protocol for querying networks like Ethereum. In short, it provides a way to efficiently store data emitted by events from smart contracts so that other projects or DApps can access it easily.

Furthermore, developers can build APIs, called Subgraphs. Users or other developers can use Subgraphs to query data specific to a set of smart contracts. Data is fetched with a standard GraphQL API. You can visit The Graph's documentation site to read more [about The Graph protocol](https://thegraph.com/docs/about/introduction#what-the-graph-is){target=\_blank}.

Due to the support of Ethereum tracing modules on Moonbeam, The Graph is capable of indexing blockchain data on Moonbeam. This guide takes you through the creation of a simple subgraph for a Lottery contract on Moonbase Alpha. This guide can be adapted for Moonbeam and Moonriver.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Quick Start

If you're familiar with The Graph and looking to learn how to dive right in on any of the Moonbeam-based networks, you can use the following `network` configurations for your Subgraph manifest (`subgraph.yaml`):

=== "Moonbeam"

    ```yaml
    dataSources:
      network: moonbeam
    ```

=== "Moonriver"

    ```yaml
    dataSources:
      network: moonriver
    ```

=== "Moonbase Alpha"

    ```yaml
    dataSources:
      network: mbase
    ```

=== "Moonbeam Dev Node"

    ```yaml
    dataSources:
      network: mbase
    ```

## Checking Prerequisites {: #checking-prerequisites }

To use The Graph on Moonbase Alpha you have two options:

 - Run a Graph Node against Moonbase Alpha and point your Subgraph to it. To do so, you can follow [this tutorial](/node-operators/indexer-nodes/thegraph-node/){target=\_blank} (you can also adapt the instructions for Moonbeam and Moonriver)
 - Point your Subgraph to The Graph API via the [Graph Explorer website](https://thegraph.com/explorer/){target=\_blank}. To do so you need to create an account and have an access token

## The Lottery Contract {: #the-lottery-contract }

For this example, a simple Lottery contract will be used. You can find the Solidity file in the [MoonLotto GitHub repository](https://github.com/papermoonio/moonlotto-subgraph/blob/main/contracts/MoonLotto.sol){target=\_blank}.

The contract hosts a lottery where players can buy ticket for themselves, or gift one to another user. When 1 hour has passed, if there are 10 participants, the next player that joins the lottery will execute a function that picks the winner. All the funds stored in the contract are sent to the winner, after which a new round starts.

The main functions of the contract are the following:

 - **joinLottery**() — function to enter the lottery's current round, the value (amount of tokens) sent to the contract need to be equal to the ticket price
 - **giftTicket**(*address* recipient) —  similar to `joinLottery` but the ticket's owner can be set to a different address
 - **enterLottery**(*address* owner) — an internal function that handles the lottery's tickets logic. If an hour has passed and there are at least 10 participants, it calls the `pickWinner` function
 - **pickWinner**() — an internal function that selects the lottery winner with a pseudo-random number generator (not safe, only for demonstration purposes). It handles the logic of transferring funds and resetting variable for the next lottery round

### Events of the Lottery Contract {: #events-of-the-lottery-contract }

The Graph uses the events emitted by the contract to index data. The lottery contract emits only two events:

 - **PlayerJoined** — in the `enterLottery` function. It provides information related to the latest lottery entry, such as the address of the player, current lottery round, if the ticket was gifted, and the prize amount of the current round
 - **LotteryResult** — in the `pickWinner` function. It provides information to the draw of an ongoing round, such as the address of the winner, current lottery round, if the winning ticket was a gift, amount of the prize, and timestamp of the draw

## Creating a Subgraph {: #creating-a-subgraph }

This section goes through the process of creating a Subgraph. For the Lottery Subgraph, a [GitHub repository](https://github.com/papermoonio/moonlotto-subgraph){target=\_blank} was prepared with everything you need to help you get started. The repository also includes the Lottery contract, as well as a Hardhat configuration file and deployment script. If you are not familiar with it, you can check our [Hardhat integration guide](/builders/build/eth-api/dev-env/hardhat/){target=\_blank} to learn about the configuration file and how to deploy a contract using Hardhat.

To get started, first clone the repository and install the dependencies:

```bash
git clone https://github.com/papermoonio/moonlotto-subgraph \
&& cd moonlotto-subgraph && yarn
```

Now, you can create the TypeScript types for The Graph by running:

```bash
npx graph codegen --output-dir src/types/
```

!!! note
    Creating the types requires you to have the ABI files specified in the `subgraph.yaml` file. This sample repository has the file already, but this is usually obtained after compiling the contract.

The `codegen` command can also be executed using `yarn codegen`.

For this example, the contract was deployed to `{{ networks.moonbase.thegraph.lotto_contract }}`. The `README.md` file in the [Moonlotto repository](https://github.com/papermoonio/moonlotto-subgraph){target=\_blank} has the steps necessary to compile and deploy the contract if required.

### Subgraphs Core Structure {: #subgraphs-core-structure }

In general terms, Subgraphs define the data that The Graph will index from the blockchain and the way it is stored. Subgraphs tend to have some of the following files:

 - **subgraph.yaml** — is a YAML file that contains the [Subgraph's manifest](https://thegraph.com/docs/en/developer/create-subgraph-hosted/#the-subgraph-manifest){target=\_blank}, that is, information related to the smart contracts being indexed by the Subgraph
 - **schema.graphql** — is a [GraphQL schema](https://thegraph.com/docs/en/developer/create-subgraph-hosted/#the-graph-ql-schema){target=\_blank} file that defines the data store for the Subgraph being created and its structure. It is written using [GraphQL interface definition schema](https://graphql.org/learn/schema/#type-language){target=\_blank}
 - **AssemblyScript mappings** — code in TypeScript (then compiled to [AssemblyScript](https://github.com/AssemblyScript/assemblyscript){target=\_blank}) that is used to translate event data from the contract to the entities defined in the schema

There is no particular order to follow when modifying the files to create a Subgraph.

### Schema.graphql {: #schemagraphql }

It is important to outline what data needs to be extracted from the events of the contract before modifying the `schema.graphql`. Schemas need to be defined considering the requirements of the DApp itself. For this example, although there is no DApp associated with the lottery, four entities are defined:

 - **Round** — refers to a lottery round. It stores an index of the round, the prize awarded, the timestamp of when the round started, the timestamp of when the winner was drawn, and information regarding the participating tickets, which is derived from the `Ticket` entity
 - **Player** — refers to a player that has participated in at least one round. It stores its address and information from all its participating tickets, which is derived from the `Ticket` entity
 - **Ticket** — refers to a ticket to enter a lottery round. It stores if the ticket was gifted, the owner's address, the round from which the ticket is valid, and if it was a winning ticket

In short, the `schema.graphql` should look like the following snippet:

```graphql
type Round @entity {
  id: ID!
  index: BigInt!
  prize: BigInt! 
  timestampInit: BigInt!
  timestampEnd: BigInt
  tickets: [Ticket!] @derivedFrom(field: "round")
}

type Player @entity {
  id: ID!
  address: Bytes!
  tickets: [Ticket!] @derivedFrom(field: "player")
}

type Ticket @entity {
  id: ID!
  isGifted: Boolean!
  player: Player!
  round: Round!
  isWinner: Boolean!
}
```

### Subgraph Manifest {: #subgraph-manifest }

The `subgraph.yaml` file, or Subgraph's manifest, contains the information related to the smart contract being indexed, including the events which have the data needed to be mapped. That data is then stored by Graph nodes, allowing applications to query it.

Some of the most important parameters in the `subgraph.yaml` file are:

 - **repository** — refers to the Github repository of the subgraph
 - **schema/file** — refers to the location of the `schema.graphql` file
 - **dataSources/name** — refers to the name of the Subgraph
 - **network** — refers to the network name. This value **must** be set to `mbase` for any Subgraph being deployed to Moonbase Alpha. For Moonbeam and Moonriver, you can use `moonbeam` and `moonriver`, respectively
 - **dataSources/source/address** — refers to the address of the contract of interest
 - **dataSources/source/abi** — refers to where the interface of the contract is stored inside the `types` folder created with the `codegen` command
 - **dataSources/source/startBlock** — refers to the start block from which the indexing will start. Ideally, this value should be close to the block the contract was created in. You can use [Moonscan](https://moonbase.moonscan.io/) to get this information by providing the contract address. For this example, the contract was created at block `{{ networks.moonbase.thegraph.block_number }}`
 - **dataSources/mapping/file** — refers to the location of the mapping file
 - **dataSources/mapping/entities** — refers to the definitions of the entities in the `schema.graphql` file
 - **dataSources/abis/name** — refers to where the interface of the contract is stored inside the `types/dataSources/name`
 - **dataSources/abis/file** — refers to the location where the `.json` file with the contract's ABI is stored
 - **dataSources/eventHandlers** — no value needs to be defined here, but this section refers to all the events that The Graph will index
 - **dataSources/eventHandlers/event** — refers to the structure of an event to be tracked inside the contract. You need to provide the event name and its type of variables
 - **dataSources/eventHandlers/handler** — refers to the name of the function inside the `mapping.ts` file which handles the event data

In short, the `subgraph.yaml` should look like the following snippet:

```yml
specVersion: 0.0.4
description: Moonbeam lottery subgraph tutorial
repository: https://github.com/papermoonio/moonlotto-subgraph
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum/contract
    name: MoonLotto
    network: mbase
    source:
      address: '{{ networks.moonbase.thegraph.lotto_contract }}'
      abi: MoonLotto
      startBlock: {{ networks.moonbase.thegraph.block_number }}
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      file: ./src/mapping.ts
      entities:
        - Player
        - Round
        - Ticket
        - Winner
      abis:
        - name: MoonLotto
          file: ./artifacts/contracts/MoonLotto.sol/MoonLotto.json
      eventHandlers:
        - event: PlayerJoined(uint256,address,uint256,bool,uint256)
          handler: handlePlayerJoined
        - event: LotteryResult(uint256,address,uint256,bool,uint256,uint256)
          handler: handleLotteryResult
```

### Mappings {: #mappings }

Mappings files are what transform the blockchain data into entities defined in the schema file. Each event handler inside the `subgraph.yaml` file needs to have a subsequent function in the mapping.

The mapping file used for the Lottery example can be found in the [Moonlotto Github Repository](https://github.com/papermoonio/moonlotto-subgraph/blob/main/src/mapping.ts){target=\_blank}.

In general, the strategy of each handler function is to load the event data, check if an entry already exists, arrange the data as desired, and save the entry. For example, the handler function for the `PlayerJoined` event is as follows:

```js
export function handlePlayerJoined(event: PlayerJoined): void {
  // ID for the round:
  // round number
  let roundId = event.params.round.toString();
  // try to load Round from a previous player
  let round = Round.load(roundId);
  // if round doesn't exists, it's the first player in the round -> create round
  if (round == null) {
    round = new Round(roundId);
    round.timestampInit = event.block.timestamp;
  }
  round.index = event.params.round;
  round.prize = event.params.prizeAmount;

  round.save();

  // ID for the player:
  // issuer address
  let playerId = event.params.player.toHex();
  // try to load Player from previous rounds
  let player = Player.load(playerId);
  // if player doesn't exists, create it
  if (player == null) {
    player = new Player(playerId);
  }
  player.address = event.params.player;

  player.save();

  // ID for the ticket (round - player_address - ticket_index_round):
  // `${round_number}-${player_address}-${ticket_index_per_round}`
  let nextTicketIndex = event.params.ticketIndex.toString();
  let ticketId = `${roundId}-${playerId}-${nextTicketIndex}`;

  let ticket = new Ticket(ticketId);
  ticket.round = roundId;
  ticket.player = playerId;
  ticket.isGifted = event.params.isGifted;
  ticket.isWinner = false;

  ticket.save();
}
```

## Deploying a Subgraph {: #deploying-a-subgraph }

There are a few different ways to deploy a Subgraph. This guide will cover how to deploy a Subgraph [Using the Hosted Service](#using-the-hosted-service){target=\_blank} and [Using a Local Graph Node](#using-a-local-graph-node){target=\_blank}.

### Using the Hosted Service

If you are going to use The Graph API (hosted service), you need to:

 - Create a [Graph Explorer](https://thegraph.com/explorer/){target=\_blank} account, you will need a Github account
 - Go to your dashboard and write down the access token
 - Create your Subgraph via the **Add Subgraph** button in the Graph Explorer site. Write down the Subgraph name

Next, in the terminal you can add your access token and deploy your Subgraph:

```bash
npx graph auth --product hosted-service <access-token>
npx graph deploy --product hosted-service <username>/<subgraph-name>    
```

Where:

 - **username** - refers to your GitHub username you used to create an account with
 - **subgraph-name** - refers to the Subgraph name
 - **access-token** — refers to the access token to use The Graph API
 
!!! note
    All steps can be found in the Graph's documentation for using a [Hosted Service to Deploy your Subgraph](https://thegraph.com/docs/developer/quick-start#4-deploy-your-subgraph){target=\_blank}.
 
### Using a Local Graph Node

If using a local Graph Node, you can create your Subgraph executing the following code:

```bash
npx graph create <username>/<subgraph-name> --node <graph-node>
```

Where:

 - **username** — refers to the username related to the Subgraph being created
 - **subgraph-name** — refers to the Subgraph name
 - **graph-node** — refers to the URL of the hosted service to use. Typically, for a local Graph Node is `http://127.0.0.1:8020`

Once created, you can deploy your Subgraph by running the following command with the same parameters as before:

```bash
npx graph deploy <username>/<subgraph-name> \
--ipfs <ipfs-url> \
--node <graph-node> \
--access-token <access-token>
```

Where:

 - **username** — refers to the username used when creating the Subgraph
 - **subraph-name** — refers to the Subgraph name defined when creating the Subgraph
 - **ipfs-url**  — refers to the URL for IPFS. If using The Graph API you can use `https://api.thegraph.com/ipfs/`. For your local Graph Node, the default value is `http://localhost:5001`
 - **graph-node** — refers to the URL of the hosted service to use. If using The Graph API you can use `https://api.thegraph.com/deploy/`. For your local Graph Node, the default value is `http://localhost:8020`
 - **access-token** — refers to the access token to use The Graph API. If you are using a local Graph Node this parameter is not necessary

The logs from the previous command should look similar to:

![The Graph deployed](/images/builders/integrations/indexers/the-graph/the-graph-1.webp)

DApps can now use the Subgraph endpoints to fetch the data indexed by The Graph protocol.

--8<-- 'text/_disclaimers/third-party-content.md'
