---
title: Index Moonbeam Data with Subsquid
description: Learn how to use Subsquid, a query node framework for Substrate-based chains, to index and process Substrate and EVM data for Moonbeam and Moonriver.
---

# Indexing Moonbeam with Subsquid

![Subsquid Banner](/images/builders/integrations/indexers/subsquid/subsquid-banner.png)

## Introduction {: #introduction }

[Subsquid](https://subsquid.io){target=_blank} is a query node framework for Substrate-based blockchains. In very simple terms, Subsquid can be thought of as an ETL (Extract, Transform, and Load) tool, with a GraphQL server included. It enables comprehensive filtering, pagination, and even full-text search capabilities

Subsquid has native and full support for both the Ethereum Virtual Machine and Substrate data. This allows developers to extract on-chain data from any of the Moonbeam networks and process EVM logs as well as Substrate entities (events, extrinsics and storage items) in one single project and serve the resulting data with one single GraphQL endpoint. With Subsquid, filtering by EVM topic, contract address, and block range are all possible.

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

5. Then you can install the dependencies from within the project directory:

    ```bash
    cd squid-template && npm i
    ```

6. You'll also need to install a few additional dependencies to index EVM data:

    ```bash
    npm i @ethersproject/abi ethers @subsquid/substrate-evm-processor @subsquid/evm-typegen
    ```

[![Image from Gyazo](https://i.gyazo.com/a6d785e88ce366a327ce2bd60735df87.gif)](https://gyazo.com/a6d785e88ce366a327ce2bd60735df87)

The next sections will take the template and customize it, one aspect at a time, to obtain the right data and process it. To view the complete project, you can check out the [`squid-evm-template` repository on GitHub](https://github.com/subsquid/squid-evm-template){target=_blank}.

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

It's worth noting a couple of things in this [schema definition](https://docs.subsquid.io/reference/openreader-schema){target=_blank}:

  - **`@entity`** - signals that this type will be translated into an ORM model that is going to be persisted in the database
  - **`@derivedFrom`** - signals the field will not be persisted on the database, it will rather be derived
  - **type references** (i.e. `from: Owner`) - establishes a relation between two entities

To generate TypeScript entity classes for the schema definition, you'll run the `codegen` tool:

```bash
npx sqd codegen
```

You will find the auto-generated files under `src/model/generated`.

![Subsquid Project structure](/images/builders/integrations/indexers/subsquid/subsquid-1.png)

## ABI Definition and Wrapper {: #abi-definition-and-wrapper}

Subsquid offers support for automatically building TypeScript type-safe interfaces for Substrate data sources (events, extrinsics, storage items). Changes are automatically detected in the runtime. To generate TypeScript interfaces and decode functions specifically for EVM logs, you can use Subsquid's `evm-typegen` tool.

To extract and process ERC-721 data, it is necessary to obtain the definition of its Application Binary Interface (ABI). This can be obtained in the form of a JSON file, which will be imported into the project.

1. Create an `abis` foldet and create a JSON file for the ERC-721 ABI

    ```bash
    mkdir src/abis
    touch src/abis/ERC721.json
    ```

2. Copy the [ABI for the ERC-721 Interface](https://www.github.com/PureStake/moonbeam-docs/blob/master/.snippets/code/subsquid/erc721.md){target=_blank} and paste it in the `ERC721.json` file

!!! note
    The ERC-721 ABI defines the signatures of all events in the contract. The `Transfer` event has three arguments, named: `from`, `to`, and `tokenId`. Their types are, respectively, `address`, `address`, and `uint256`. As such, the actual definition of the `Transfer` event looks like this: `Transfer(address, address, uint256)`.

### Adjust TypeScript Configuration {: #adjust-typescript-configuration }

In order to be able to read and import the ABI JSON file in TypeScript code, you need to add an option to the `tsconfig.json` file. Open the file and add the `"resolveJsonModule": true` option to the `"compilerOptions"` section:

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

To automatically generate TypeScript interfaces from an ABI definition, and decode event data, simply run this command from the project's root folder:

```bash
npx squid-evm-typegen --abi src/abi/ERC721.json --output src/abi/erc721.ts
```

The `abi` parameter points at the JSON file previously created, and the `output` parameter is the name of the file that will be generated by the command itself.

## Define and Bind Event Handler(s) {: #define-and-bind-event-handlers }

The Subsquid SDK provides users with a [processor](https://docs.subsquid.io/key-concepts/processor){target=_blank} class, named `SubstrateProcessor` or, in this specific case [`SubstrateEvmProcessor`](https://docs.subsquid.io/reference/evm-processor){target=_blank}. The processor connects to the [Subsquid archive](https://docs.subsquid.io/key-concepts/architecture#archive){target=_blank} to get chain data. It loops from the configured starting block, until the configured end block, or until new data is added to the chain.

The processor exposes methods to "attach" functions that will "handle" specific data such as Substrate events, extrinsics, storage items, or EVM logs. These methods can be configured by specifying the event or extrinsic name, or the EVM log contract address, for example. As the processor loops over the data, when it encounters one of the configured event names, it will execute the logic in the "handler" function.

Before getting started with the event handler, it is necessary to define some constants and some helper functions to manage the EVM contract. You can create an additional file for these items:

```bash
touch src/contract.ts
```

### Manage the EVM contract {: #event-handler-and-helper-functions }

In the `src/contract.ts` file, you'll take the following steps:

1. Define the chain node endpoint (optional but useful)
2. Create a contract interface to store information such as the address and ABI
3. Define functions to fetch a contract entity from the database or create one
4. Define the `processTransfer` EVM log handler, implementing logic to track token transfers

```typescript
// src/contracts.ts
import { assertNotNull, Store } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import * as erc721 from "./abi/erc721";
import { Contract } from "./model";
 
export const CHAIN_NODE = "wss://wss.api.moonriver.moonbeam.network";

export const contract = new ethers.Contract(
  "0xb654611f84a8dc429ba3cb4fda9fad236c505a1a",
  erc721.abi,
  new ethers.providers.WebSocketProvider(assertNotNull(CHAIN_NODE))
);
 
export function createContractEntity(): Contract {
  return new Contract({
    id: contract.address,
    name: "Moonsama",
    symbol: "MSAMA",
    totalSupply: 1000n,
  });
}
 
let contractEntity: Contract | undefined;
 
export async function getContractEntity({
  store,
}: {
  store: Store;
}): Promise<Contract> {
  if (contractEntity == null) {
    contractEntity = await store.get(Contract, contract.address);
  }
  return assertNotNull(contractEntity);
}

async function processTransfer(ctx: EvmLogHandlerContext): Promise<void> {
  const transfer =
    events["Transfer(address,address,uint256)"].decode(ctx);

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
      uri: await contract.tokenURI(transfer.tokenId),
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

The "handler" function takes in a `Context` of the correct type (`EvmLogHandlerContext`, in this case). The context contains the triggering event and the interface to store data, and is used to extract and process data and save it to the database.

!!! note
    For the event handler, it is also possible to bind an "arrow function" to the processor.

### Create Processor and Attach Handler {: #create-processor-and-attach-handler }

Now you can attach the handler function to the processor and configure the processor for execution. This is done by editing the `src/processor.ts` file.

1. Remove the preexisting code
2. Update the imports to include the `CHAIN_NODE` and `contract` constant, the `getContractEntity` and `createContractEntity` helper functions, the `processTransfer` handler function, and `events` mapping
3. Create a processor using the `SubstrateEvmProcessor` and pass in a name of your choice. For this example, you can use `moonriver-substrate` or feel free to update it for the network you're developing on
4. Update the data source and types bundle
5. Attach the EVM log handler function and a pre-block hook which will create and save a contract entity in the database

```typescript
// src/processor.ts
import {
  EvmLogHandlerContext,
  SubstrateEvmProcessor,
} from "@subsquid/substrate-evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import { CHAIN_NODE, contract, createContractEntity, getContractEntity, processTransfer } from "./contract";
import { events } from "./abi/erc721";
import { Owner, Token, Transfer } from "./model";

const processor = new SubstrateEvmProcessor("moonriver-substrate");

processor.setDataSource({
  chain: CHAIN_NODE,
  archive: lookupArchive("moonriver")[0].url,
});

processor.addPreHook({ range: { from: 0, to: 0 } }, async (ctx) => {
  await ctx.store.save(createContractEntity());
});

processor.addEvmLogHandler(
  contract.address,
  {
    filter: [events["Transfer(address,address,uint256)"].topic],
  },
  processTransfer
);

processor.run();

```

If you are adapting this guide for Moonbeam or Moonbase Alpha, be sure to update the data source to the correct network:

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

!!! note
    The `lookupArchive` function is used to consult the [archive registry](https://github.com/subsquid/archive-registry){target=_blank} and yield the archive address, given a network name. Network names should be in lowercase.

## Launch and Set Up the Database {: #launch-and-set-up-the-database }

When running the project locally, as it is the case for this guide, it is possible to use the `docker-compose.yml` file that comes with the template to launch a PostgreSQL container. To do so, run the following command in your terminal:

```bash
docker-compose up -d
```

[![Image from Gyazo](https://i.gyazo.com/71e9b457a3267e0a1d40496abcfc6e0a.gif)](https://gyazo.com/71e9b457a3267e0a1d40496abcfc6e0a)

!!! note
    The `-d` parameter is optional, it launches the container in `daemon` mode so the terminal will not be blocked and no further output will be visible.

Squid projects automatically manage the database connection and schema, via an [ORM abstraction](https://en.wikipedia.org/wiki/Object%E2%80%93relational\_mapping){target=_blank}. 

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

[![Image from Gyazo](https://i.gyazo.com/13223997aa1e9738c842634826b39654.gif)](https://gyazo.com/13223997aa1e9738c842634826b39654)

Finally, in a separate terminal window, launch the GraphQL server:

```bash
npx squid-graphql-server
```

Visit [`localhost:4350/graphql`](http://localhost:4350/graphql){target=_blank} to access the [GraphiQl](https://github.com/graphql/graphiql){target=_blank} console. From this window, you can perform queries such as this one, to find out the account owners with the biggest balances:

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

Subsquid offers a SaaS solution to host projects created by its community. Please refer to the [Deploy your Squid tutorial](https://docs.subsquid.io/tutorial/deploy-your-squid){target=_blank} on Subquid's documentation site for more information.

You can also check out other projects hosted there, by heading to the [Aquarium](https://app.subsquid.io/aquarium){target=_blank}, because that's where Squids are!

## Example Project Repository {: #example-project-repository }

You can [view the finalized and complete project on GitHub](https://github.com/subsquid/squid-evm-template){target=_blank}.

[Subsquid's documentation](https://docs.subsquid.io/){target=_blank} contains informative material and it's the best place to start, if you are curious about some aspects that were not fully explained in this guide.
