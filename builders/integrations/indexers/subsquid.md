---
title: Subsquid
description: Learn how to use Subsquid to process Substrate and EVM data for Moonbeam and Moonriver
---

# Indexing Moonbeam with Subsquid

![Subsquid Banner](/images/builders/integrations/indexers/subsquid/subsquid-banner.png)

## Introduction {: #introduction }

[Subsquid](https://subsquid.io){target=_blank} is a query node framework for Substrate-based blockchains. In very simple terms, Subsquid can be thought of as an ETL tool, with a GraphQL server included.

Subsquid's [multi-layer approach](https://docs.subsquid.io/key-concepts/architecture) aims to pre-process and decode raw chain data and store it for easier access by query nodes, providing increased performance over direct RPC calls.

Thanks to Subsquid, the complexity of fetching and transforming blockchain data can be vastly reduced. On top of that, developers get a batteries-included GraphQL server with comprehensive filtering, pagination, and even full-text search capabilities.

Subsquid has native and full support for both Ethereum Virtual Machine and Substrate data. This allows developers to extract on-chain data from any of the Moonbean networks and process EVM logs as well as Substrate entities (Events, Extrinsics and Storage items) in one single project and serve the resulting data with one single GraphQL endpoint.

Thanks to unparalleled features such as filtering by EVM topic, by contract address, and by block range, Subsquid provides developers with the necessary tools and flexibility to build the best data projects possible.

This guide will explain how to create a Subsquid project (also known as *"Squid"*) that indexes ERC-721 token transfers on the Moonriver network. As such, we will be looking at the `Transfer` EVM event topics.

## Development Environment set up {: #development-environment-set-up }

### Node.js

For a Squid project to be able to run we need to have installed Node.js. As for how to install it:

* There are binaries ready for many Linux distributions [users can install](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
* Mac OS users will find it as easy as using [Homebrew](https://nodejs.org/en/download/package-manager/#alternatives-2),&#x20;
* For Windows, the best bet is to leverage WSL2 and follow [this guide](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl) or even simpler use Linux options directly in WSL.

If Node.js is already present in the system, be sure to have version 16 or later installed, by running:

```bash
node --version
```

### Docker

The other requisite is Docker, which has similar options:

* [Here’s an example](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository) of how to install Docker on Ubuntu
* Mac OS users have a [Desktop version](https://docs.docker.com/desktop/mac/install/)
* And so have [Windows users](https://docs.docker.com/desktop/windows/install/)

## Create a project {: #create-a-project }

The first thing to do, although it might sound trivial to GitHub experts, is visiting the template [repository page](https://github.com/subsquid/squid-template) and clicking the button labelled "Use this template" and select the account and repository name for your project.

Next, clone the created repository (be careful of changing `<account>` with your own account)

```bash
git clone git@github.com:<account>/squid-template.git
```

For reference on the complete work, you can find the entire project [here](https://github.com/subsquid/squid-examples/tree/main/squid-moonsama-erc721).
The next sections will take the template and customise it, one aspect at a time, to obtain the right data and process it as we intend to.

## Install current and additional dependencies

The subsquid template is a Node.js project and comes with a `package.json` file, defining its dependencies, which we need to install, by running:

```bash
npm i
```

At the same time, the template was developed to process balance transfers on the Kusama network; since the project we are going to build in this guide has a different objective, we have to install some new packages. We can do so with this command:

```bash
npm i @ethersproject/abi ethers @subsquid/substrate-evm-processor
```

[![Image from Gyazo](https://i.gyazo.com/a6d785e88ce366a327ce2bd60735df87.gif)](https://gyazo.com/a6d785e88ce366a327ce2bd60735df87)

These will be useful with the ERC721 ABI definition we are going to discuss below.

## Define Entity Schema

The next thing to do, in order to customize the project for our own purpose, is to make changes to the schema and define the Entities we want to keep track of.

Because we said we want to track

* files added and deleted from the chain
* groups joined by a certain account
* storage orders placed by a certain account

We are going to make these changes to our `schema.graphql`:

```graphql
type Token @entity {
  id: ID!
  owner: Owner
  uri: String
  transfers: [Transfer!]! @derivedFrom(field: "token")
  contract: Contract
}

type Owner @entity {
  id: ID!
  ownedTokens: [Token!]! @derivedFrom(field: "owner")
  balance: BigInt
}

type Contract @entity {
  id: ID!
  name: String
  symbol: String
  totalSupply: BigInt
  mintedTokens: [Token!]! @derivedFrom(field: "contract")
}

type Transfer @entity {
  id: ID!
  token: Token!
  from: Owner
  to: Owner
  timestamp: BigInt!
  block: Int!
  transactionHash: String!
}
```

!!! note
    It's worth noting a couple of things in this schema:

    - The `@entity` directive signals that this type will be translated into an ORM model that is going to be persisted in the database
    - A type's field referring to another type definition (`from: Owner`), is establishing a relation betweent two entities
    - The `@derivedFrom` directive signals that the field tagged with it will not be persisted on the database, it will rather be derived, as the directive name suggests
    
    For more information on GraphQL schema definitions and the more advanced options available, please refer to the [extensive section on Subsquid's documentation site](https://docs.subsquid.io/reference/openreader-schema).

To finalize this step, it is necessary to run the `codegen` tool, which will generate TypeScript Entity classes for our schema definition, running the following command:

```bash
npx sqd codegen
```

You will find the autogenerated files under `src/model/generated`:

![Subsquid Project structure](/images/builders/integrations/indexers/subsquid/subsquid-project-structure-codegen.png)

## ABI definition and wrapper

Subsquid offers amazing support for exploring the chain's metadata and automatically building TypeScript type-safe interfaces for Substrate data sources (Events, Extrinsix, Storage items), that also automatically detect changes in the Runtime. This feature is not yet available for EVM contracts, but it's in our Roadmap.

For this reason, in order to be able to extract and process ERC-721 data, it is necessary to obtain the definition of its Application Binary Interface. This can be obtained in the form of a JSON file, which then needs to be imported in the project and it will allow it to process all contracts using such an interface.

We suggest creating a dedicated `abis` folder in the project, as we'll be importing the ABI interface and writing additional code to create a programmatic interface around its content. This will also be useful, in case you want to treat multiple types of contracts, with different ABIs. The folder and files can be created in your IDE, but these are bash commands to do so:

```bash
mkdir src/abis
touch src/abis/ERC721.json
```

Now you can copy the [ABI for the ERC-721 Interface](/.snippets/code/subsquid/erc721.md){target=_blank} and copy it in the newly created JSON file.

!!! note
    The ERC 721 ABI defines the signatures of all events in the contract.
    A quick search for the `Transfer` event (which is central to the project in this guide) shows that it has three arguments, named: `from`, `to`, `tokenId` and their types are, respectively `address`, `address`, `uint256`.
    As such, the actual definition of the `Transfer` event looks like this: `Transfer(address, address, uint256)`, and this is what we are going to use in the next section.

Subsquid offers amazing support for automatically building TypeScript type-safe interfaces for Substrate data sources (Events, Extrinsics, Storage items), that also automatically detect changes in the Runtime. This feature is not yet available for EVM contracts, but it's in our Roadmap, so for the time being, TypeScript interfaces for EVM events have to be built manually.

As mentioned, in the following steps we are going to write some additional code to import and manage this interface definition into our project.

### Adjust TypeScript configuration

In order to be able to read and import the ABI JSON file in TypeScript code, we need to add an option to the `tsconfig.json` file in the project's root folder. Open the file and add the `"resolveJsonModule": true` option to the `"compilerOptions"` section. It should look something like this:

```json
{
  "compilerOptions": {
    // ... other options
    "resolveJsonModule": true
  },
  // ... other sections
}
```

### Programmatic interface and event decoding

In the `src/abis` folder we just created, let's create a new file named `erc721.ts` and start editing it.

In this file we want to obtain three things:

* Import the JSON ABI into a TypeScript object
* Create a data interface that we will be using to pass data across our program
* Define a mapping between the EVM event we are interested, the topic related to it, and a function to decode the event itsef.

Here is the code we want to add to the file, in order to obtain what we just described:

```typescript
import { Interface } from "@ethersproject/abi";
import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import erc721Json from "./ERC721.json";

const abi = new Interface(erc721Json);

export interface TransferEvent {
  from: string;
  to: string;
  tokenId: bigint;
}

const transferFragment = abi.getEvent("Transfer(address,address,uint256)");

export const events = {
  "Transfer(address,address,uint256)": {
    topic: abi.getEventTopic("Transfer(address,address,uint256)"),
    decode(data: EvmLogHandlerContext): TransferEvent {
      const result = abi.decodeEventLog(
        transferFragment,
        data.data || "",
        data.topics
      );
      return {
        from: result[0],
        to: result[1],
        tokenId: result[2].toBigInt(),
      };
    },
  },
};

```

We will be using the `events` map to decode the `Transfer` EVM event in the very next section.

### Clean up

In previous chapter we mentioned that Subsquid automatically generates TypeScript interface for Substrate entities, but, unfortunately, this is not yet available for EVM logs.

These interfaces are stored under the `src/types` folder and since we are not going to use them, it will just be better to remove them from the project, by deleting the entire `types` folder.

## Define and bind Event Handler(s)

At this point, it is worth explaining what a Processor is and how it works. The Subsquid SDK provides users with a class, named `SubstrateProcessor` or, in this specific case `SubstrateEvmProcessor` that connects to our Subsquid Archive, and starts to loop, from the configured starting block, until the configured end block, or until data is available or new data is added to the chain.

Such a class exposes methods to "attach" functions that will "handle" specific data (Substrate Events, Extrinsics, Storage items, or, in the case of this project, EVM logs). These methods can be configured by specifying the Event or Extrinsic name, or the EVM log contract address, for example.

While looping through the chain data, provided by the Archive, when the processor encounters one of the configured Event names, it will trigger the provided "handler" function, so that custom logic implemented by the developer will be executed.

You can find more information about this topic in the [related section on Subsquid's own documentation](https://docs.subsquid.io/key-concepts/processor).

### Constants definition

Before we deal with the Event Handler, it is necessary to define some constants and some helper functions. It is general good practice to separate these concerns from the main file of the project and for this reason, we are going to create two additional files.

Let'start by creating the `src/constants.ts` file and start editing. What we are going to define in this file are, as the name says, a few constants that will later be useful, such as API endpoints, the contract name, symbol, contract address, and the contract instance itself. Here's the content of the file, to obtain what we just described:

```typescript
import { ethers } from "ethers";
import ABI from "./abis/ERC721.json";

export const CONTRACT_ADDRESS = "0xb654611f84a8dc429ba3cb4fda9fad236c505a1a";

// API constants
export const CHAIN_NODE = "wss://wss.api.moonriver.moonbeam.network";
export const ARCHIVE =
  "https://moonriver-beta.indexer.gc.subsquid.io/v4/graphql";
export const BATCH_SIZE = 500;
export const API_RETRIES = 5;

// From contract
export const CONTRACT_NAME = "Moonsama";
export const CONTRACT_SYMBOL = "MSAMA";
export const CONTRACT_TOTAL_SUPPLY = 1000n;

// ethers contract
export const PROVIDER = new ethers.providers.WebSocketProvider(CHAIN_NODE);
export const CONTRACT_INSTANCE = new ethers.Contract(
  CONTRACT_ADDRESS,
  ABI,
  PROVIDER
);

```

### Event handler and helper functions

The next area we have to focus on is a series of helpful functions, so we are going to create a new `src/helpers` folder, then create a file named `events.ts` inside it and start editing it.

In this file we are going to define a couple of interfaces to pass data around, and a couple of auxiliary functions to fetch a Contract interface from the Database or create one.
Finally, the most important bit here, we need to define a function that will serve as the contract log handler itself, containing the business logic for this project.

We are naming our handler function `contractLogsHandler` and its purpose is to decode the event (using the mapping defined in the previous section), obtaining information about token transfer, and then write this data to the correct fields of the right entities and save them to the database.

Here's the content of such file:

```typescript
import {
  assertNotNull,
  EvmLogHandlerContext,
  Store,
} from "@subsquid/substrate-evm-processor";
import { Owner, Token, Transfer, Contract } from "../model";
import {
  CONTRACT_INSTANCE,
  CONTRACT_NAME,
  CONTRACT_SYMBOL,
  CONTRACT_TOTAL_SUPPLY,
} from "../constants";
import * as erc721 from "../abis/erc721";

export function createContractEntity(): Contract {
  return new Contract({
    id: CONTRACT_INSTANCE.address,
    name: CONTRACT_NAME,
    symbol: CONTRACT_SYMBOL,
    totalSupply: CONTRACT_TOTAL_SUPPLY,
  });
}

let contractEntity: Contract | undefined;

export async function getContractEntity({
  store,
}: {
  store: Store;
}): Promise<Contract> {
  if (contractEntity == null) {
    contractEntity = await store.get(Contract, CONTRACT_INSTANCE.address);
  }
  return assertNotNull(contractEntity);
}

export interface EvmLog {
  data: string;
  topics?: Array<string> | null;
  address: string;
}
export interface ParsedLogs {
  name: string;
  args?: any;
  topics: string;
  fragment: any;
  signature: string;
}

export async function contractLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  const transfer =
    erc721.events["Transfer(address,address,uint256)"].decode(ctx);

  let from = await ctx.store.get(Owner, transfer.from);
  if (from == null) {
    from = new Owner({ id: transfer.from, balance: 0n });
    await ctx.store.save(from);
  }

  let to = await ctx.store.get(Owner, transfer.to);
  if (to == null) {
    to = new Owner({ id: transfer.to, balance: 0n });
    await ctx.store.save(to);
  }

  let token = await ctx.store.get(Token, transfer.tokenId.toString());
  if (token == null) {
    token = new Token({
      id: transfer.tokenId.toString(),
      uri: await CONTRACT_INSTANCE.tokenURI(transfer.tokenId),
      contract: await getContractEntity(ctx),
      owner: to,
    });
    await ctx.store.save(token);
  } else {
    token.owner = to;
    await ctx.store.save(token);
  }

  await ctx.store.save(
    new Transfer({
      id: ctx.txHash,
      token,
      from,
      to,
      timestamp: BigInt(ctx.substrate.block.timestamp),
      block: ctx.substrate.block.height,
      transactionHash: ctx.txHash,
    })
  );
}

```

!!! note
    A "handler" function is simply a TypeScript function that takes in a `Context` of the correct type (`EvmLogHandlerContext`, in this case).
    Its purpose is to use this context, which contains the triggering event, and the interface to store data, to extract data, process it with the custom business logic, and save the refined data to the database.

!!! note
    Defininig a separate function for handling events is not strictly necessary, as it is also possible to bind an "arrow function" to the processor, but it is still advisable and considered good practice to do so.

### Configuring the Processor

After having imported the ABI contract, defined the necessary constants and business logic, it is time to attach the handler function to our Processor and configuring the latter for execution. This is done by editing the `src/processor.ts` file in the project folder.

The first thing to do, is to deal with imports. We are going to need the `CONTRACT_ADDRESS` constant, the two helper functions defined in the previous section, as well as the `events` mapping defined in the `erc721.ts` file from earlier in the guide.
It is also worth noticing that, contrary to the template's project, we are not going to use `SubstrateProcessor`, but `SubstrateEvmProcessor` instead. Subsquid has developed a specific data processor to sift through EVM logs, which is exactly what we need for this project. So let's see our imports:

```typescript
import { SubstrateEvmProcessor } from "@subsquid/substrate-evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import { CHAIN_NODE, BATCH_SIZE, CONTRACT_ADDRESS } from "./constants";
import { contractLogsHandler, createContractEntity } from "./helpers/events";
import { events } from "./abis/erc721";
```

Next, we are going to take the line that instantiates `SubstrateProcessor` and substitute it with the newly imported class (`SubstrateEvmProcessor`). This is also a good time to customize it with an appropriate name and change the data source and types bundle to the right values for the Moonriver network. This is what it should look like:

```typescript
const processor = new SubstrateEvmProcessor("moonriver-substrate");

processor.setBatchSize(BATCH_SIZE);

processor.setDataSource({
  chain: CHAIN_NODE,
  archive: lookupArchive("moonriver")[0].url,
});

processor.setTypesBundle("moonbeam");
```

At this point, we can completely delete the bottom part of the `processor.ts` file, as, since we have defined our helper and evm handler functions in different files, it is going to look a lot shorter and much simpler.

Here, we only need to attach the evm log handler function and a pre-block hook, for good measure (this last one will be responsible for creating and saving a Contract entity in the database). Here is the code:

```typescript
processor.addPreHook({ range: { from: 0, to: 0 } }, async (ctx) => {
  await ctx.store.save(createContractEntity());
});

processor.addEvmLogHandler(
  CONTRACT_ADDRESS,
  {
    filter: [events["Transfer(address,address,uint256)"].topic],
  },
  contractLogsHandler
);

processor.run();
```

!!! note
    The `addEvmLogHandler` function takes in three arguments, in this case:
    
    * the contract address
    * an object containing options for defining further filtering (the event topic in our case, but we could also define a block range)
    * the handler function itself

## Launch database container and apply changes

A Squid needs a database to store data to, as it has been mentioned in previous sections. When running the project locally, as it is the case for this guide, it is possible to use the `docker-compose.yml` file that comes with the template and launch a PostgreSQL container. In order to do so, simply open a console window launch the following command in the terminal:

```bash
docker-compose up -d
```

This should be the terminal output:

[![Image from Gyazo](https://i.gyazo.com/71e9b457a3267e0a1d40496abcfc6e0a.gif)](https://gyazo.com/71e9b457a3267e0a1d40496abcfc6e0a)

!!! note
    The `-d` parameter launches the container in `daemon` mode, which means the terminal will not be blocked and no further output will be visible.
    It is possible to omit this parameter and maintain monitoring of the container, however, this is also possible via the `docker logs` command.

Squid project automatically manages the database connection and schema, via an [ORM abstraction](https://en.wikipedia.org/wiki/Object%E2%80%93relational\_mapping). As such, we should be using the provided automated tools to manage the database schema and migrations.

First, we need to get rid of the template's default migration:

```bash
rm -rf db/migrations/*.js
```

Then, make sure the Postgres docker container is running, in order to have a database to connect to, and run the following commands:

```bash
npx sqd db drop
npx sqd db create
npx sqd db create-migration Init
npx sqd db migrate
```

These will, in order:

1. drop the current database
   * If you have never run the project before, this is not necessary
2. create a new database
3. create the initial migration, by looking up the schema we defined in the previous chapter
4. apply the migration

![Drop the database, re-create it, generate a migration and apply it](/images/builders/integrations/indexers/subsquid/subsquid-migration.png)

!!! note
    The first command in the list, `npx sqd db drop` is not necessary if the container has been launched for first time. As it's visible from the image, the command has "failed", reporting that the database named `squid` does not, in fact, exist.

## Launch the project

It's finally time to run the project. First of all, let's build the code

```bash
npm run build
```

And then launch the processor (this will block the current terminal)

```bash
node -r dotenv/config lib/processor.js
```

You should see some log messages about the progress:

[![Image from Gyazo](https://i.gyazo.com/13223997aa1e9738c842634826b39654.gif)](https://gyazo.com/13223997aa1e9738c842634826b39654)

Finally, in a separate command line console window, launch the GraphQL server:

```bash
npx squid-graphql-server
```

And see for yourself the result of your hard work, by visiting the `localhost:4350/graphql` URL in a browser and accessing the [GraphiQl](https://github.com/graphql/graphiql) console.

From this window, we can perform queries such as this one, to find out the account owners with the biggest balances:

```graphql
query MyQuery {
  owners(limit: 10, where: {}, orderBy: balance_DESC) {
    balance
    id
  }
}
```

Or this other one, looking up the tokens owned by a given owner:

```graphql
  tokens(where: {owner: {id_eq: "0x495E889d1A6cEB447a57dcc1C68410299392380c"}}) {
    uri
    contract {
      id
      name
      symbol
      totalSupply
    }
  }
```

![GraphiQL playground with some sample queries](/images/builders/integrations/indexers/subsquid/subsquid-graphiql-playground.png)

Have some fun playing around with queries, afterall, it's a *playground*!

## Publishing your project

So far, we have tested our project locally, including running the database and serving the GraphQL server.

Subsquid offers a SaaS solution to host projects created by its community. To access this platform, check out [Subsquid's SaaS home page](https://app.subsquid.io/dashboard){target=_blank} and login with your GitHub account.

The guided procedure is very simple to follow, but should you need more info and guidance, please head over to the dedicated [Tutorial in the documentation](https://docs.subsquid.io/tutorial/deploy-your-squid){target=_blank}.

You can also check out other projects hosted there, by heading to the [Aquarium](https://app.subsquid.io/aquarium){target=_blank}, because that's where Squids are!

## Example Projects repository {: #example-projects-repository }

Subsquid is creating [a repository full of example projects](https://github.com/subsquid/squid-examples/){target=_blank} and the one in this guide is one of them, under the name `squid-moonsama-erc721`. You can check out the examples repository and [view the finalised and complete project there](https://github.com/subsquid/squid-examples/tree/main/squid-moonsama-erc721){target=_blank}. The repository is going to grow over time and will include more and more examples.

Subsquid SDK has been created to facilitate developing Web3 apps on top of blockchain data, thanks to its automated code generation tools, the type-safe interface and robustness against Runtime upgrades. [Subsquid template repository](https://github.com/subsquid/squid-template){target=_blank} is the starting point for experimenting with the framework and start building your DApp, easier, faster.

[Subsquid documentation](https://docs.subsquid.io/){target=_blank} contains informative material and it's the best place to start, if you are curious about some aspect that were not fully explained in this guide.

## Subsquid community

For questions and support, join the [Subsquid Developers Telegram group](https://t.me/HydraDevs){target=_blank} and [Subsquid Discord server](https://discord.gg/dxR4wNgdjV){target=_blank}: you'll get to be part of the community, meet the team and other community members, and be the first to know about the project's initiatives. A [Subsquid Official Telegram chat](https://t.me/subsquid){target=_blank} is also available to discuss the project with fellow enthusiasts.

Community members are invited to contribute: if you have developed a small, interesting project that you want to share with your fellow devs, feel free to fork the repository, add your project and create a Pull Request to permanently add it!
The same can be said for spotting mistakes or bugs in the projects, they can either be reported as Issues, or, if you feel confident you know the solution, just create a Pull Request with a fix. Depending on the type and level of difficulty and quality of the contribution, **you'll receive economic rewards** for your work.
