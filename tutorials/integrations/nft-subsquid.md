---
title: Index NFT Transfers with Subsquid
description: Learn how to use Subsquid, a query node framework for Substrate-based chains, to index and process Substrate and EVM data for Moonbeam and Moonriver.
---

# Indexing NFT Transfers on Moonbeam with Subsquid

![Subsquid Banner](/images/builders/integrations/indexers/subsquid/subsquid-banner.png)

_March 7, 2023 | by Massimo Luraschi_

## Introduction {: #introduction }

[Subsquid](https://subsquid.io){target=_blank} is a full-stack blockchain indexing SDK and specialized data lakes (Archives) optimized for extraction of large volumes of historical on-chain data.

The SDK offers a highly customizable Extract-Transform-Load-Query stack and indexing speeds of up to and beyond 50,000 blocks per second when indexing events and transactions.

Subsquid has native and full support for both the Ethereum Virtual Machine and Substrate data. This allows developers to extract on-chain data from any of the Moonbeam networks and process EVM logs as well as Substrate entities (events, extrinsics and storage items) in one single project and serve the resulting data with one single GraphQL endpoint. With Subsquid, filtering by EVM topic, contract address, and block range are all possible.

This guide will explain how to create a Subsquid project (also known as a *"squid"*) from a template (indexing Moonsama transfers on Moonriver), and change it to index ERC-721 token transfers on the Moonbeam network. As such, you'll be looking at the `Transfer` EVM event topics. This guide can be adapted for Moonbase Alpha as well.

--8<-- 'text/disclaimers/third-party-content-intro.md'

## Checking Prerequisites {: #checking-prerequisites}

For a Squid project to be able to run, you need to have the following installed:

- Familiarity with Git 
- [Node.js](https://nodejs.org/en/download/){target=_blank} version 16 or later
- [Docker](https://docs.docker.com/get-docker/){target=_blank}
- [Squid CLI](/squid-cli/installation){target=_blank}

!!! note
    This tutorial uses custom scripts defined in `commands.json`. The scripts are automatically picked up as `sqd` sub-commands.

## Scaffold using `sqd init` {: #scaffolding-using-sqd-init}

We will start with the [`frontier-evm` squid template](https://github.com/subsquid-labs/squid-frontier-evm-template/){target=_blank} available through [`sqd init`]([/squid-cli/init](https://docs.subsquid.io/squid-cli/)){target=_blank}. It is built to index EVM smart contracts deployed on Moonriver, but it is also capable of indexing Substrate events. To retrieve the template and install the dependencies, run

```bash
sqd init moonbeam-tutorial --template frontier-evm
cd moonbeam-tutorial
npm ci
```

## Define Entity Schema {: #define-entity-schema}

Next, we ensure that the data [schema](https://docs.subsquid.io/basics/schema-file/){target=_blank} of the squid defines [entities](https://docs.subsquid.io/basics/schema-file/entities/){target=_blank} that we would like to track. We are interested in:

* Token transfers
* Ownership of tokens
* Contracts and their minted tokens

Luckily, the EVM template already contains a schema file that defines the exact entities we need:

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

It's worth noting a couple of things in this [schema definition](https://docs.subsquid.io/basics/schema-file/):

* **`@entity`**: Signals that this type will be translated into an ORM model that is going to be persisted in the database.
* **`@derivedFrom`**: Signals that the field will not be persisted in the database. Instead, it will be [derived from](https://docs.subsquid.io/basics/schema-file/entity-relations/) the entity relations.
* **type references** (e.g. `from: Owner`): When used on entity types, they establish a relation between two entities.

TypeScript entity classes have to be regenerated whenever the schema is changed, and to do that we use the `squid-typeorm-codegen` tool. The pre-packaged `commands.json` already comes with a `codegen` shortcut, so we can invoke it with `sqd`:

```bash
sqd codegen
```
The (re)generated entity classes can then be browsed at `src/model/generated`.

## ABI Definition and Wrapper {: #abi-definition}

Subsquid maintains [tools](https://docs.subsquid.io/substrate-indexing/squid-substrate-typegen/) for automated generation of TypeScript classes for handling Substrate data sources (events, extrinsics, storage items). Possible runtime upgrades are automatically detected and accounted for.

Similar functionality is available for EVM indexing through the [`squid-evm-typegen`](https://docs.subsquid.io/evm-indexing/squid-evm-typegen/) tool. It generates TypeScript modules for handling EVM logs and transactions based on a [JSON ABI](https://docs.ethers.io/v5/api/utils/abi/) of the contract.

For our squid we will need such a module for the [ERC-721](https://eips.ethereum.org/EIPS/eip-721)-compliant part of the contracts' interfaces. Once again, the template repository already includes it, but it is still important to explain what needs to be done in case one wants to index a different type of contract.

The procedure uses an `sqd` script from the template that uses `squid-evm-typegen` to generate Typescript facades for JSON ABIs stored in the `abi` folder. Place any ABIs you requre for interfacing your contracts there and run
```bash
sqd typegen
```
The results will be stored at `src/abi`. One module will be generated for each ABI file, and it will include constants useful for filtering and functions for decoding EVM events and functions defined in the ABI.

## Define and Bind Event Handler(s) {: #define-event-handlers}

Subsquid SDK provides users with the [`SubstrateBatchProcessor` class](https://docs.subsquid.io/substrate-indexing/). Its instances connect to chain-specific [Subsquid archives](https://docs.subsquid.io/archives/overview/) to get chain data and apply custom transformations. The indexing begins at the starting block and keeps up with new blocks after reaching the tip.

`SubstrateBatchProcessor`s [exposes methods](https://docs.subsquid.io/substrate-indexing/configuration/) to "subscribe" them to specific data such as Substrate events, extrinsics, storage items or, for EVM, logs and transactions. The actual data processing is then started by calling the `.run()` function. This will start generating requests to the Archive for [*batches*](https://docs.subsquid.io/basics/batch-processing/) of data specified in the configuration, and will trigger the callback function, or *batch handler* (passed to `.run()` as second argument) every time a batch is returned by the Archive.

It is in this callback function that all the mapping logic is expressed. This is where chain data decoding should be implemented, and where the code to save processed data on the database should be defined.

### Managing the EVM contract

Before we begin defining the mapping logic of the squid, we are going to rewrite the `src/contracts.ts` utility module for managing the involved EVM contracts. It will export:

* Addresses of [Gromlins](https://moonscan.io/token/0xf27a6c72398eb7e25543d19fda370b7083474735) contract.
* A function that will create and save an instance of the `Contract` entity to the database
* A function that rill return a `Contract` instance (either the already existing one, or a newly created entity). The first time the function is called, it verifies if a `Contract` does exist already, in the negative case, it will invoke the first function, and cache the result, so on subsequent calls the cached version will be returned.

Here are the full file contents:

```typescript
// src/contract.ts
import { Contract as ContractAPI } from "./abi/erc721";
import { BigNumber } from "ethers";
import { Context } from "./processor";
import { Contract } from "./model";

export const contractAddress = "0x0000000000000000000000000000000001000000";

export async function createContractEntity(ctx: Context): Promise<Contract> {
  const lastBlock = ctx.blocks[ctx.blocks.length -1].header
  const contractAPI = new ContractAPI({...ctx, block: lastBlock}, contractAddress);
  let name = "", symbol = "", totalSupply = BigNumber.from(0);
  ctx.log.info("Creating new Contract model instance")
  try {
    name = await contractAPI.name();
    symbol = await contractAPI.symbol();
    totalSupply = await contractAPI.totalSupply();
  } catch (error) {
    ctx.log.warn(`[API] Error while fetching Contract metadata for address ${contractAddress}`);
    if (error instanceof Error) {
      ctx.log.warn(`${error.message}`);
    }
  }
  return new Contract({
    id: contractAddress,
    name: name,
    symbol: symbol,
    totalSupply: totalSupply.toBigInt(),
  });
}

let contractEntity: Contract | undefined;

export async function getContractEntity(ctx: Context): Promise<Contract> {
  if (contractEntity == null) {
    contractEntity = await ctx.store.get(Contract, contractAddress);
    if (contractEntity == null) {
      contractEntity = await createContractEntity(ctx);
      await ctx.store.insert(contractEntity);
    }
  }
  return contractEntity;
}
```

!!! note
    The `createContractEntity` function is accessing the **state** of the contract via a chain RPC endpoint. This is slowing down the indexing a little, but this data is only available this way. You'll find more information on accessing state in the [dedicated section of our docs](https://docs.subsquid.io/substrate-indexing/evm-support#access-the-contract-state).

## Configure Processor and Attach Handler {: #configure-processor}

The `src/processor.ts` file is where squids instantiate the processor (a `SubstrateBatchProcessor` in our case), configure it and attach the handler functions.

Not much needs to be changed here, except adapting the template code to handle the Gromlins contract and setting the processor to use the `moonbeam` archive URL retrieved from the [archive registry](https://github.com/subsquid/archive-registry){target=_blank}.

If you are adapting this guide for Moonriver or Moonbase Alpha, be sure to update the data source to the correct network:

=== "Moonbeam"
    ```
    processor.setDataSource({
      chain: CHAIN_NODE,
      archive: lookupArchive("moonbeam", {type: "Substrate"}),
    });
    ```

=== "Moonriver"
    ```
    processor.setDataSource({
      chain: process.env.RPC_ENDPOINT,
      archive: lookupArchive("moonriver", {type: "Substrate"}),
    });
    ```

=== "Moonbase Alpha"
    ```
    processor.setDataSource({
      chain: process.env.RPC_ENDPOINT,
      archive: lookupArchive("moonbase", {type: "Substrate"}),
    });
    ```

!!! note
    The `lookupArchive` function is used to consult the [archive registry](https://github.com/subsquid/archive-registry){target=_blank} and yield the archive address, given a network name. Network names should be in lowercase.

Here is the end result:

```typescript
// src/processor.ts
import { lookupArchive } from "@subsquid/archive-registry";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import {
  BatchContext,
  BatchProcessorItem,
  EvmLogEvent,
  SubstrateBatchProcessor,
  SubstrateBlock,
} from "@subsquid/substrate-processor";
import { In } from "typeorm";
import { ethers } from "ethers";
import { contractAddress, getContractEntity } from "./contract";
import { Owner, Token, Transfer } from "./model";
import * as erc721 from "./abi/erc721";
import { EvmLog, getEvmLog } from "@subsquid/frontier";

const database = new TypeormDatabase();

const processor = new SubstrateBatchProcessor()
  .setDataSource({
    // FIXME: set RPC_ENDPOINT secret when deploying to Aquarium
    //        See https://docs.subsquid.io/deploy-squid/env-variables/
    chain: process.env.RPC_ENDPOINT || "wss://wss.api.moonbeam.network",
    archive: lookupArchive("moonbeam", {type: "Substrate"}),
  })
  .addEvmLog(contractAddress, {
    filter: [[
      erc721.events.Transfer.topic
    ]], 
  });

type Item = BatchProcessorItem<typeof processor>;
type Context = BatchContext<Store, Item>;

processor.run(database, async (ctx) => {
  const transfersData: TransferData[] = [];

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.name === "EVM.Log") {
        // EVM log extracted from the substrate event
        const evmLog = getEvmLog(ctx, item.event)
        const transfer = handleTransfer(block.header, item.event, evmLog);
        transfersData.push(transfer);
      }
    }
  }

  await saveTransfers(ctx, transfersData);
});

type TransferData = {
  id: string;
  from: string;
  to: string;
  token: ethers.BigNumber;
  timestamp: bigint;
  block: number;
  transactionHash: string;
};

function handleTransfer(
  block: SubstrateBlock,
  event: EvmLogEvent,
  evmLog: EvmLog
): TransferData {
  const { from, to, tokenId } = erc721.events.Transfer.decode(evmLog);

  const transfer: TransferData = {
    id: event.id,
    token: tokenId,
    from,
    to,
    timestamp: BigInt(block.timestamp),
    block: block.height,
    transactionHash: event.evmTxHash,
  };

  return transfer;
}

async function saveTransfers(ctx: Context, transfersData: TransferData[]) {
  const tokensIds: Set<string> = new Set();
  const ownersIds: Set<string> = new Set();

  for (const transferData of transfersData) {
    tokensIds.add(transferData.token.toString());
    ownersIds.add(transferData.from);
    ownersIds.add(transferData.to);
  }

  const transfers: Set<Transfer> = new Set();

  const tokens: Map<string, Token> = new Map(
    (await ctx.store.findBy(Token, { id: In([...tokensIds]) })).map((token) => [
      token.id,
      token,
    ])
  );

  const owners: Map<string, Owner> = new Map(
    (await ctx.store.findBy(Owner, { id: In([...ownersIds]) })).map((owner) => [
      owner.id,
      owner,
    ])
  );
  
  if (process.env.RPC_ENDPOINT == undefined) {
    ctx.log.warn(`RPC_ENDPOINT env variable is not set`)
  }

  for (const transferData of transfersData) {
    const contract = new erc721.Contract(
      ctx,
      { height: transferData.block },
      contractAddress
    );

    let from = owners.get(transferData.from);
    if (from == null) {
      from = new Owner({ id: transferData.from, balance: 0n });
      owners.set(from.id, from);
    }

    let to = owners.get(transferData.to);
    if (to == null) {
      to = new Owner({ id: transferData.to, balance: 0n });
      owners.set(to.id, to);
    }

    const tokenId = transferData.token.toString();

    let token = tokens.get(tokenId);
    if (token == null) {
      token = new Token({
        id: tokenId,
        // FIXME: use multicall here to batch
        //        contract calls and speed up indexing
        uri: await contract.tokenURI(transferData.token),
        contract: await getContractEntity(ctx.store),
      });
      tokens.set(token.id, token);
      ctx.log.info(`Upserted NFT: ${token.id}`)
    }
    token.owner = to;

    const { id, block, transactionHash, timestamp } = transferData;

    const transfer = new Transfer({
      id,
      block,
      timestamp,
      transactionHash,
      from,
      to,
      token,
    });

    transfers.add(transfer);
  }

  await ctx.store.save([...owners.values()]);
  await ctx.store.save([...tokens.values()]);
  await ctx.store.save([...transfers]);
}
```

!!! note
    It is also worth pointing out that the `contract.tokenURI` call is accessing the **state** of the contract via a chain RPC endpoint. This is slowing down the indexing a little bit, but this data is only available this way. You'll find more information on accessing state in the [dedicated section of our docs](/substrate-indexing/evm-support#access-the-contract-state).


!!! note
    This code expects to find a URL of a working Moonbeam RPC endpoint in the `RPC_ENDPOINT` environment variable. Set it in the `.env` file and in [Aquarium secrets](/deploy-squid/env-variables) if and when you deploy your squid there. We tested the code using a public endpoint available at `wss://wss.api.moonbeam.network`; for production, we recommend using private endpoints.

## Launch and Set Up the Database {: #launch-database}

When running the project locally it is possible to use the `docker-compose.yml` file that comes with the template to launch a PostgreSQL container. To do so, run `sqd up` in your terminal.

Squid projects automatically manage the database connection and schema via an [ORM abstraction](https://en.wikipedia.org/wiki/Object%E2%80%93relational\_mapping). In this approach the schema is managed through migration files. Because we made changes to the schema, we need to remove the existing migration(s) and create a new one, then apply the new migration.

This involves the following steps:

1. Build the code:

    ```bash
    sqd build
    ```

2. Make sure you start with a clean Postgres database. The following commands drop-create a new Postgres instance in Docker:

    ```bash
    sqd down
    sqd up
    ```

3. Generate the new migration (this will wipe any old migrations):

    ```bash
    sqd migration:generate
    ```

4. Apply the migration, so that the tables are created in the database:

    ```bash
    sqd migration:apply
    ```

## Launch the Project {: #launch-project}

To launch the processor run the following command (this will block the current terminal):

```bash
sqd process
```

Finally, in a separate terminal window, launch the GraphQL server:

```bash
sqd serve
```

Visit [`localhost:4350/graphql`](http://localhost:4350/graphql) to access the [GraphiQL](https://github.com/graphql/graphiql) console. From this window, you can perform queries such as this one, to find out the account owners with the biggest balances:

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
  tokens(where: {owner: {id_eq: "0x5274a86d39fd6db8e73d0ab6d7d5419c1bf593f8"}}) {
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

Have fun playing around with queries, after all, it's a _playground_!

## Publish the Project {: #publish-the-project}

Subsquid offers a SaaS solution to host projects created by its community. All templates ship with a deployment manifest file named `squid.yml`, which can be used, in conjunction to the Squid CLI command `sqd deploy`.

Please refer to the [Deploy your Squid section](https://docs.subsquid.io/deploy-squid/quickstart/){target=_blank} on Subquid's documentation site for more information.

## Example Project Repository {: #example-project-repository }

You can view the template used here, as well as many other example repositories [on Subsquid's examples organization on GitHub](https://github.com/orgs/subsquid-labs/repositories){target=_blank}.

[Subsquid's documentation](https://docs.subsquid.io/){target=_blank} contains informative material, and it's the best place to start, if you are curious about some aspects that were not fully explained in this guide.

--8<-- 'text/disclaimers/educational-tutorial.md'

--8<-- 'text/disclaimers/third-party-content.md'
