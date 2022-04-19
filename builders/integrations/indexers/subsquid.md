---
title: Index Moonbeam Data with Subsquid
description: Learn how to use Subsquid to process Substrate and EVM data for Moonbeam and Moonriver.
---

# Indexing Moonbeam with Subsquid

![Subsquid Banner](/images/builders/integrations/indexers/subsquid/subsquid-banner.png)

## Introduction {: #introduction }

[Subsquid](https://subsquid.io){target=_blank} is a query node framework for Substrate-based blockchains. In very simple terms, Subsquid can be thought of as an ETL (Extract, Transform, and Load) tool, with a GraphQL server included.

Subsquid's [multi-layer approach](https://docs.subsquid.io/key-concepts/architecture){target=_blank} aims to pre-process and decode raw chain data and store it for easier access by query nodes, providing increased performance over direct RPC calls.

Thanks to Subsquid, the complexity of fetching and transforming blockchain data can be vastly reduced. On top of that, developers get a batteries-included GraphQL server with comprehensive filtering, pagination, and even full-text search capabilities.

Subsquid has native and full support for both the Ethereum Virtual Machine and Substrate data. This allows developers to extract on-chain data from any of the Moonbeam networks and process EVM logs as well as Substrate entities (events, extrinsics and storage items) in one single project and serve the resulting data with one single GraphQL endpoint.

Thanks to unparalleled features such as filtering by EVM topic, by contract address, and by block range, Subsquid provides developers with the necessary tools and flexibility to build the best data projects possible.

This guide will explain how to create a Subsquid project (also known as a *"Squid"*) that indexes ERC-721 token transfers on the Moonriver network. As such, you'll be looking at the `Transfer` EVM event topics. This guide can be adapted for Moonbeam or Moonbase Alpha.

## Checking Prerequisites {: #checking-prerequisites}

For a Squid project to be able to run, you need to have the following installed:

- [Node.js](https://nodejs.org/en/download/){target=_blank} version 16 or later
- [Docker](https://docs.docker.com/get-docker/){target=_blank}

## Create a Project {: #create-a-project }

You can create a project by using the template repository made available by Subsquid. To get started, you can take the following steps:

1. Vist the [`squid-template` repository on GitHub](https://github.com/subsquid/squid-template){target=_blank}
2. Click the **Use this template** button
3. Select the account and repository name for your project
4. Clone the created repository (be careful of changing `<account>` with your own GitHub account):

    ```bash
    git clone git@github.com:<account>/squid-template.git
    ```

To view the complete project, you can check out the [`squid-evm-template` repository on GitHub](https://github.com/subsquid/squid-evm-template){target=_blank}.

The next sections will take the template and customize it, one aspect at a time, to obtain the right data and process it.

### Install Dependencies {: #install-dependencies}

The subsquid template is a Node.js project and comes with a `package.json` file, defining its dependencies, which you need to install, by running:

```bash
npm i
```

The template was originally developed to process balance transfers on the Kusama network; since the project you are going to build in this guide indexes ERC-721 token transfers, you have to install some additional packages. You can do so with this command:

```bash
npm i @ethersproject/abi ethers @subsquid/substrate-evm-processor
```

[![Image from Gyazo](https://i.gyazo.com/a6d785e88ce366a327ce2bd60735df87.gif)](https://gyazo.com/a6d785e88ce366a327ce2bd60735df87)

These packages will be useful with the ERC-721 ABI definition that will be discussed in the following sections.

## Define Entity Schema {: #define-entity-schema }

In order to customize the project for the purposes of this guide, you'll need to make changes to the schema and define the entities to keep track of. These entities include:

- Token transfers
- Ownership of tokens
- Contracts and their minted tokens

To make these changes, you can edit the `schema.graphql` file:

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
    - A type's field referring to another type definition (`from: Owner`), is establishing a relation between two entities
    - The `@derivedFrom` directive signals that the field tagged with it will not be persisted on the database, it will rather be derived, as the directive name suggests
    
    For more information on GraphQL schema definitions and the more advanced options available, please refer to the [schema section on Subsquid's documentation site](https://docs.subsquid.io/reference/openreader-schema){target=_blank}.

To generate TypeScript entity classes for the schema definition you will need to run the `codegen` tool:

```bash
npx sqd codegen
```

You will find the auto-generated files under `src/model/generated`.

![Subsquid Project structure](/images/builders/integrations/indexers/subsquid/subsquid-1.png)

## ABI Definition and Wrapper {: #abi-definition-and-wrapper}

Subsquid offers support for exploring the chain's metadata and automatically building TypeScript type-safe interfaces for Substrate data sources (events, extrinsics, storage items). Changes are also automatically detected in the runtime. This feature is not yet available for EVM contracts, but it's in the Subsquid roadmap. For the time being, TypeScript interfaces for EVM events have to be built manually.

In order to be able to extract and process ERC-721 data, it is necessary to obtain the definition of its Application Binary Interface (ABI). This can be obtained in the form of a JSON file, which then needs to be imported in the project. This will allow it to process all contracts using such an interface.

1. Create a dedicated `abis` folder in the project and then create a JSON file for the ERC-721 ABI. The `abis` folder is useful if you want to use multiple types of contracts, with different ABIs

    ```bash
    mkdir src/abis
    touch src/abis/ERC721.json
    ```

2. Copy the [ABI for the ERC-721 Interface](https://www.github.com/PureStake/moonbeam-docs-cn/blob/master/.snippets/code/subsquid/erc721.md){target=_blank} and paste it in the `ERC721.json` file

!!! note
    The ERC-721 ABI defines the signatures of all events in the contract.
    A quick search for the `Transfer` event (which is central to the project in this guide) shows that it has three arguments, named: `from`, `to`, and `tokenId`. Their types are, respectively, `address`, `address`, and `uint256`.
    As such, the actual definition of the `Transfer` event looks like this: `Transfer(address, address, uint256)`.

In the following steps you are going to write some additional code to import and manage this interface definition into your project.

### Adjust TypeScript Configuration {: #adjust-typescript-configuration }

In order to be able to read and import the ABI JSON file in TypeScript code, you need to add an option to the `tsconfig.json` file in the project's root folder. Open the file and add the `"resolveJsonModule": true` option to the `"compilerOptions"` section:

```json
// tsconfig.json
{
  "compilerOptions": {
    ...
    "resolveJsonModule": true
  },
  ...
}
```

### Use the ABI to Get and Decode Event Data {: #get-and-decode-event-data }

Now you'll want to create a TypeScript file and set up the logic to create a data interface and decode event data using the ABI

1. In the `src/abis` folder, create a new file named `erc721.ts`:

    ```
    touch src/abis/erc721.ts
    ```

2. Import the JSON ABI into a TypeScript object
3. Create a data interface that will be used to pass data across the project
4. Define a mapping between the EVM event of interest, the topic related to it, and a function to decode the event itself. In this case the event is the `Transfer` event

```typescript
// src/abis/erc721.ts
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

You'll be using the `events` map to decode the `Transfer` event in the next section.

### Clean up {: #clean-up }

Subsquid automatically generates TypeScript interfaces for Substrate entities, but, unfortunately, this is not yet available for EVM logs. These interfaces are stored under the `src/types` folder and since they are not going to be used, you can remove them from the project, by deleting the entire `types` folder:

```
rm -r src/types
```

## Define and Bind Event Handler(s) {: #define-and-bind-event-handlers }

At this point, it is worth explaining what a [processor](https://docs.subsquid.io/key-concepts/processor){target=_blank} is and how it works. The Subsquid SDK provides users with a class, named `SubstrateProcessor` or, in this specific case [`SubstrateEvmProcessor`](https://docs.subsquid.io/reference/evm-processor){target=_blank} that connects to the [Subsquid archive](https://docs.subsquid.io/key-concepts/architecture#archive){target=_blank}. The processor starts to loop, from the configured starting block, until the configured end block, or until data is available or new data is added to the chain.

Such a class exposes methods to "attach" functions that will "handle" specific data (Substrate events, extrinsics, storage items, or, in the case of this project, EVM logs). These methods can be configured by specifying the event or extrinsic name, or the EVM log contract address, for example.

While looping through the chain data, provided by the archive, when the processor encounters one of the configured event names, it will trigger the provided "handler" function, so any custom logic that you implement will be executed.

You can find more information about these [key concepts on Subsquid's documentation](https://docs.subsquid.io/key-concepts){target=_blank}.

Before getting started with the event handler, it is necessary to define some constants and some helper functions. It is general good practice to separate these concerns from the main file of the project and for this reason, you can create two additional files:

```
mkdir src/helpers
touch src/constants.ts src/helpers/events.ts
```

### Constants Definitions {: #constants-definitions }

In the `src/constants.ts` file, you are going to define a few constants that will later be useful. For this example, you can use the Moonsama contract on Moonriver and the ERC-721 token ABI.

1. Define the ERC-721 token contract address
2. Define the API endpoint and configurations
3. Define contract information, including the contract name, symbol, and total supply
4. Set up an Ethers provider and then use it to create a contract instance along with the contract address and ABI

```typescript
// src/constants.ts
import { ethers } from "ethers";
import ABI from "./abis/ERC721.json";

export const CONTRACT_ADDRESS = "0xb654611f84a8dc429ba3cb4fda9fad236c505a1a";

// API constants
export const CHAIN_NODE = "wss://wss.api.moonriver.moonbeam.network";
export const BATCH_SIZE = 500;
export const API_RETRIES = 5;

// From contract
export const CONTRACT_NAME = "Moonsama";
export const CONTRACT_SYMBOL = "MSAMA";
export const CONTRACT_TOTAL_SUPPLY = 1000n;

// Ethers contract
export const PROVIDER = new ethers.providers.WebSocketProvider(CHAIN_NODE);
export const CONTRACT_INSTANCE = new ethers.Contract(
  CONTRACT_ADDRESS,
  ABI,
  PROVIDER
);
```

To adapt the constants for Moonbeam or Moonbase Alpha, you'll need to update the token contract information for a token deployed to the chosen network. You'll also need to update the `CHAIN_NODE` constant to the correct WSS endpoint:

=== "Moonbeam"
    ```
    export const CHAIN_NODE = "wss://wss.api.moonbeam.network";
    ```

=== "Moonriver"
    ```
    export const CHAIN_NODE = "wss://wss.api.moonriver.moonbeam.network";
    ```

=== "Moonbase Alpha"
    ```
    export const CHAIN_NODE = "wss://wss.api.moonbase.moonbeam.network";
    ```

### Event Handler and Helper Functions {: #event-handler-and-helper-functions }

In the `src/helpers/events.ts` file, you'll take the following steps:

1. Define interfaces to pass data around
2. Define functions to fetch a contract interface from the database or create one
3. Create a contract log handler function. The handler function can be named `contractLogsHandler` and its purpose is to:

    - Decode the event (using the mapping defined in the previous section)
    - Obtain information about token transfers
    - Write this data to the correct fields of the right entities and save them to the database

```typescript
// src/helpers/events.ts
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

A "handler" function is simply a TypeScript function that takes in a `Context` of the correct type (`EvmLogHandlerContext`, in this case). Its purpose is to use this context, which contains the triggering event and the interface to store data, to extract data, process it with the custom business logic, and save the refined data to the database.

!!! note
    Defining a separate function for handling events is not strictly necessary. It is also possible to bind an "arrow function" to the processor, but it is still advisable and considered good practice to do so.

### Create Processor and Attach Handler {: #create-processor-and-attach-handler }

After having imported the ABI contract, defined the necessary constants and business logic, it is time to attach the handler function to the processor and configuring the latter for execution. This is done by editing the `src/processor.ts` file in the project folder. 

1. Remove the pre-existing code
2. Update the imports to include the `CONTRACT_ADDRESS` constant, the two helper functions defined in the previous section, as well as the `events` mapping defined in the `erc721.ts` file
3. Create a processor using the `SubstrateEvmProcessor`, designed specifically to sift through EVM logs, and pass in a name of your choice. For this example, you can use `moonriver-substrate` or feel free to update it for the network you're developing on
4. Update the data source and types bundle
5. Attach the EVM log handler function that will filter the `Transfer` events and a pre-block hook, for good measure (this last one will be responsible for creating and saving a contract entity in the database)

```typescript
// src/processor.ts
import { SubstrateEvmProcessor } from "@subsquid/substrate-evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import { CHAIN_NODE, BATCH_SIZE, CONTRACT_ADDRESS } from "./constants";
import { contractLogsHandler, createContractEntity } from "./helpers/events";
import { events } from "./abis/erc721";

const processor = new SubstrateEvmProcessor("moonriver-substrate");

processor.setBatchSize(BATCH_SIZE);

processor.setDataSource({
  chain: CHAIN_NODE,
  archive: lookupArchive("moonriver")[0].url,
});

processor.setTypesBundle("moonbeam");

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

If you are adapting this guide for Moonbeam or Moonbase Alpha, be sure to update the data source so it uses the correct network:

=== "Moonbeam"
    ```
    processor.setDataSource({
      chain: CHAIN_NODE,
      archive: lookupArchive("moonbeam")[0].url,
    });
    ```

=== "Moonriver"
    ```
    processor.setDataSource({
      chain: CHAIN_NODE,
      archive: lookupArchive("moonriver")[0].url,
    });
    ```

=== "Moonbase Alpha"
    ```
    processor.setDataSource({
      chain: CHAIN_NODE,
      archive: lookupArchive("moonbase")[0].url,
    });
    ```

The `lookupArchive` function is used to consult the [archive registry](https://github.com/subsquid/archive-registry){target=_blank} and yield the right archive address, given a network name. Network names should be in lowercase.

The `addEvmLogHandler` function takes in three arguments, in this case:

  1. The contract address
  2. An object containing options for defining further filtering (the event topic in this case, but you could also define a block range)
  3. The handler function itself

## Launch and Set Up the Database {: #launch-and-set-up-the-database }

A Squid needs a database to store data to, as it has been mentioned in previous sections. When running the project locally, as it is the case for this guide, it is possible to use the `docker-compose.yml` file that comes with the template and launch a PostgreSQL container. In order to do so, simply open a console window launch the following command in the terminal:

```bash
docker-compose up -d
```

This should be the terminal output:

[![Image from Gyazo](https://i.gyazo.com/71e9b457a3267e0a1d40496abcfc6e0a.gif)](https://gyazo.com/71e9b457a3267e0a1d40496abcfc6e0a)

!!! note
    The `-d` parameter launches the container in `daemon` mode, which means the terminal will not be blocked and no further output will be visible.
    It is possible to omit this parameter and maintain monitoring of the container, however, this is also possible via the `docker logs` command.

Squid projects automatically manage the database connection and schema, via an [ORM abstraction](https://en.wikipedia.org/wiki/Object%E2%80%93relational\_mapping){target=_blank}. As such, you should be using the provided automated tools to manage the database schema and migrations.

To set up the database, you can take the following steps:

1. Build the code

    ```bash
    npm run build
    ```

2. Remove the template's default migration:

    ```bash
    rm -rf db/migrations/*.js
    ```

3. Make sure the Postgres Docker container, `squid-template_db_1`, is running

    ```bash
    docker ps -a
    ```

3. Drop the current database (if you have never run the project before, this is not necessary), create a new database, create the initial migration, and apply the migration

    ```bash
    npx sqd db drop
    npx sqd db create
    npx sqd db create-migration Init
    npx sqd db migrate
    ```

    ![Drop the database, re-create it, generate a migration and apply it](/images/builders/integrations/indexers/subsquid/subsquid-2.png)

## Launch the Project {: #launch-the-project }

To launch the processor (this will block the current terminal), you can run the following command:

```bash
node -r dotenv/config lib/processor.js
```

You should see some log messages about the progress:

[![Image from Gyazo](https://i.gyazo.com/13223997aa1e9738c842634826b39654.gif)](https://gyazo.com/13223997aa1e9738c842634826b39654)

Finally, in a separate command line console window, launch the GraphQL server:

```bash
npx squid-graphql-server
```

And see for yourself the result of your hard work, by visiting [`localhost:4350/graphql`](http://localhost:4350/graphql){target=_blank} and accessing the [GraphiQl](https://github.com/graphql/graphiql){target=_blank} console.

From this window, you can perform queries such as this one, to find out the account owners with the biggest balances:

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
query MyQuery {
  tokens(where: {owner: {id_eq: "0x495E889d1A6cEB447a57dcc1C68410299392380c"}}) {
    uri
    contract {
      id
      name
      symbol
      totalSupply
    }
  }
}
```

![GraphiQL playground with some sample queries](/images/builders/integrations/indexers/subsquid/subsquid-3.png)

Have some fun playing around with queries, after all, it's a *playground*!

## Publish the Project {: #publish-the-project }

So far, you have tested your project locally, including running the database and serving the GraphQL server.

Subsquid offers a SaaS solution to host projects created by its community. To access this platform, check out [Subsquid's SaaS home page](https://app.subsquid.io/dashboard){target=_blank} and login with your GitHub account.

The guided procedure is very simple to follow, but should you need more info and guidance, please head over to the dedicated [Deploy your Squid tutorial](https://docs.subsquid.io/tutorial/deploy-your-squid){target=_blank} on Subquid's documentation site.

You can also check out other projects hosted there, by heading to the [Aquarium](https://app.subsquid.io/aquarium){target=_blank}, because that's where Squids are!

## Example Projects Repository {: #example-projects-repository }

Subsquid is creating example projects that can be used as templates and the one in this guide is one of them. You can check out the example repository and [view the finalized and complete project on GitHub](https://github.com/subsquid/squid-evm-template){target=_blank}. Subsquid's GitHub account is going to grow over time and will include more and more examples.

Subsquid SDK has been created to facilitate developing Web3 apps on top of blockchain data, thanks to its automated code generation tools, the type-safe interface and robustness against runtime upgrades. The [Subsquid template repository](https://github.com/subsquid/squid-template){target=_blank} and its [EVM logs version](https://github.com/subsquid/squid-evm-template){target=_blank} are the starting point for experimenting with the framework and starting to build your DApp easier and faster.

[Subsquid's documentation](https://docs.subsquid.io/){target=_blank} contains informative material and it's the best place to start, if you are curious about some aspects that were not fully explained in this guide.
