---
title: Index a Local Development Node
description: Improve your DApp development experience by following this guide to learn how to index a DApp deployed locally on a Moonbeam development node with Subsquid!
---

# Index a Local Moonbeam Development Node with Subsquid

_by Erin Shaben_

## Introduction {: #introduction }

When developing a dApp, it's beneficial to develop smart contracts using a local development environment as opposed to a live network, such as a TestNet or MainNet. Local development removes some of the hassles involved with developing on a live network, like having to fund development accounts and waiting for blocks to be produced. On Moonbeam, developers can spin up their own local [Moonbeam development node](/builders/get-started/networks/moonbeam-dev){target=_blank} to quickly and easily build and test applications.

But what about dApps that rely on indexers to index blockchain data? How can developers of these applications streamline the development process? Thanks to [Subsquid](/builders/integrations/indexers/subsquid){target=_blank}, a data network for retrieving data from 100+ chains, it is now possible to index blocks on a local development environment, such as your Moonbeam development node!

This tutorial will walk you through the process of indexing data on a local Moonbeam development node using Subsquid. We'll create an ERC-20 contract and use Subsquid to index transfers of our ERC-20.

This tutorial is based off of Massimo Luraschi's tutorial on how to [Boost your dApp development productivity with local indexing](https://medium.com/subsquid/boost-your-dapp-development-productivity-with-local-indexing-3936ba7a8cec){target=_blank}, but was modified for a Moonbeam development node.

## Checking Prerequisites {: #checking-prerequisites }

To follow along with this tutorial, you'll need to have:

- [Docker installed](https://docs.docker.com/get-docker/){target=_blank}
- [Docker Compose installed](https://docs.docker.com/compose/install/){target=_blank}
- An empty Hardhat project. For step-by-step instructions, please refer to the [Creating a Hardhat Project](/builders/build/eth-api/dev-env/hardhat/#creating-a-hardhat-project){target=_blank} section of our Hardhat documentation page

We'll configure our Hardhat project and create our Subsquid project later on in the tutorial.

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
    purestake/moonbeam:{{ networks.development.build_tag }} \
    --dev --sealing 4000 --rpc-external
    ```

=== "MacOS"

    ```bash
    docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 \
    purestake/moonbeam:{{ networks.development.build_tag }} \
    --dev --sealing 4000 --rpc-external
    ```

=== "Windows"

    ```bash
    docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 ^
    purestake/moonbeam:{{ networks.development.build_tag }} ^
    --dev --sealing 4000 --rpc-external
    ```

This will start up our development node, which can be accessed on port 9944.

![Spin up a Moonbeam development node](/images/tutorials/integrations/local-subsquid/local-squid-1.png)

Our development node comes with 10 prefunded accounts.

??? note "Development account addresses and private keys"
    --8<-- 'code/setting-up-node/dev-accounts.md'

For more information on running a Moonbeam development node, please refer to the [Getting Started with a Moonbeam Development Node](/builders/get-started/networks/moonbeam-dev){target=_blank} guide.

## Set Up a Hardhat Project {: #create-a-hardhat-project }

You should have already created an empty Hardhat project, but if you haven't done so, you can find instructions in the [Creating a Hardhat Project](/builders/build/eth-api/dev-env/hardhat/#creating-a-hardhat-project){target=_blank} section of our Hardhat documentation page.

In this section, we'll configure our Hardhat project for a local Moonbeam development node, create an ERC-20 contract, and write scripts to deploy and interact with our contract.

Before we dive into creating our project, let's install a couple of dependencies that we'll need: the [Hardhat Ethers plugin](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-ethers){target=_blank} and [OpenZeppelin contracts](https://docs.openzeppelin.com/contracts/4.x/){target=_blank}. The Hardhat Ethers plugin provides a convenient way to use the [Ethers](/builders/build/eth-api/libraries/ethersjs){target=_blank} library to interact with the network. We'll use OpenZeppelin's base ERC-20 implementation to create an ERC-20. To install both of these dependencies, you can run:

=== "npm"

    ```bash
    npm install @nomicfoundation/hardhat-ethers ethers @openzeppelin/contracts
    ```

=== "yarn"

    ```bash
    yarn add @nomicfoundation/hardhat-ethers ethers @openzeppelin/contracts
    ```

### Configure Hardhat For a Local Development Node {: #create-a-hardhat-project }

Before we update the configuration file, we'll need to get the private key of one of our development accounts, which will be used to deploy our contract and send transactions. For this example, we'll use Alith's private key:

```text
0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133
```

!!! remember
    **You should never store your private keys in a JavaScript or Python file.**

    The private keys for the development accounts are public knowledge because the accounts exist within your own development environment. However, when you move on to indexing a live network such as Moonbase Alpha or Moonbeam (which is out of scope for this tutorial), you should manage your private keys with a designated secret manager or similar service.

Now we can edit `hardhat.config.js` to include the following network and account configurations for our Moonbeam development node:

```js
require('@nomicfoundation/hardhat-ethers');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',
  networks: {
    dev: { 
      url: '{{ networks.development.rpc_url }}',
      chainId: {{ networks.development.chain_id }}, // (hex: {{ networks.development.hex_chain_id }}),
      accounts: ['0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133'], // Alith's private key
    },
  },
};
```

### Create an ERC-20 Contract {: #create-an-erc-20-contract }

For the purposes of this tutorial, we'll be creating a simple ERC-20 contract. We'll rely on OpenZeppelin's ERC-20 base implementation. We'll start by creating a file for the contract and naming it `MyTok.sol`:

```bash
mkdir -p contracts && touch contracts/MyTok.sol
```

Now we can edit the `MyTok.sol` file to include the following contract, which will mint an initial supply of MYTOKs and allow only the owner of the contract to mint additional tokens:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyTok is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("MyToken", "MYTOK") {
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

### Deploy an ERC-20 Contract {: #deploy-erc-20-contract }

Now that we have our contract set up, we can compile and deploy our contract.

To compile the contract, you can run:

```bash
npx hardhat compile
```

![Compile contracts using Hardhat](/images/tutorials/integrations/local-subsquid/local-squid-2.png)

This command will compile our contract and generate an `artifacts` directory containing the ABI of the contract.

To deploy our contract, we'll need to create a deployment script that deploys our ERC-20 contract and mints an initial supply of MYTOKs. We'll use Alith's account to deploy the contract, and we'll specify the initial supply to be 1000 MYTOK. The initial supply will be minted and sent to the contract owner, which is Alith.

Let's take the following steps to deploy our contract:

1. Create a directory and file for our script:

    ```bash
    mkdir -p scripts && touch scripts/deploy.js
    ```

2. In the `deploy.js` file, go ahead and add the following script:

    ```js
    // We require the Hardhat Runtime Environment explicitly here. This is optional
    // but useful for running the script in a standalone fashion through `node <script>`.
    //
    // You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
    // will compile your contracts, add the Hardhat Runtime Environment's members to the
    // global scope, and execute the script.
    const hre = require('hardhat');
    
    async function main() {
      // Get ERC-20 Contract
      const MyTok = await hre.ethers.getContractFactory('MyTok');
    
      // Deploy it with Inital supply of 1000
      const myTok = await MyTok.deploy(1000000000000000000000n);
    
      // Wait for the Deployment
      await myTok.deployed();
    
      console.log(`Contract deployed to ${myTok.address}`);
    }
    
    // We recommend this pattern to be able to use async/await everywhere
    // and properly handle errors.
    main().catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
    ```

3. Run the script using the `dev` network configurations we set up in the `hardhat.config.js` file:

    ```bash
    npx hardhat run scripts/deploy.js --network dev
    ```

The address of the deployed contract should be printed to the terminal. Save the address, as we'll need it to interact with the contract in the following section.

![Deploy contracts using Hardhat](/images/tutorials/integrations/local-subsquid/local-squid-3.png)

### Transfer ERC-20s {: #transfer-erc-20s }

Since we'll be indexing `Transfer` events for our ERC-20, we'll need to send a few transactions that transfer some tokens from Alith's account to our other test accounts. We'll do this by creating a simple script that transfers 10 MYTOKs to Baltathar, Charleth, Dorothy, and Ethan. We'll take the following steps:

1. Create a new file script to send transactions:

    ```bash
    touch scripts/transactions.js
    ```

2. In the `transactions.js` file, add the following script:

    ```js
    // We require the Hardhat Runtime Environment explicitly here. This is optional
    // but useful for running the script in a standalone fashion through `node <script>`.
    //
    // You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
    // will compile your contracts, add the Hardhat Runtime Environment's members to the
    // global scope, and execute the script.
    const hre = require('hardhat');

    async function main() {
      // Get Contract ABI
      const MyTok = await hre.ethers.getContractFactory('MyTok');

      // Plug ABI to Address
      const myTok = await MyTok.attach('0xc01Ee7f10EA4aF4673cFff62710E1D7792aBa8f3');

      const value = hre.ethers.utils.parseUnits('10', 'ether');

      let tx;
      // Transfer to Baltathar
      tx = await myTok.transfer('0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0', value);
      await tx.wait();
      console.log(`Transfer to Baltathar with TxHash ${tx.hash}`);

      // Transfer to Charleth
      tx = await myTok.transfer('0x798d4Ba9baf0064Ec19eB4F0a1a45785ae9D6DFc', value);
      await tx.wait();
      console.log(`Transfer to Charleth with TxHash ${tx.hash}`);

      // Transfer to Dorothy
      tx = await myTok.transfer('0x773539d4Ac0e786233D90A233654ccEE26a613D9', value);
      await tx.wait();
      console.log(`Transfer to Dorothy with TxHash ${tx.hash}`);

      // Transfer to Ethan
      tx = await myTok.transfer('0xFf64d3F6efE2317EE2807d223a0Bdc4c0c49dfDB', value);
      await tx.wait();
      console.log(`Transfer to Ethan with TxHash ${tx.hash}`);
    }

    // We recommend this pattern to be able to use async/await everywhere
    // and properly handle errors.
    main().catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
    ```

3. Run the script to send the transactions:

    ```bash
    npx hardhat run scripts/transactions.js --network dev
    ```

As each transaction is sent, you'll see a log printed to the terminal.

![Send transactions using Hardhat](/images/tutorials/integrations/local-subsquid/local-squid-4.png)

Now we can move on to creating our Squid to index the data on our local development node.

## Create a Subsquid Project {: #create-subsquid-project }

Now we're going to create our Subquid project. First, we'll need to install the [Subsquid CLI](https://docs.subsquid.io/squid-cli/){target=_blank}:

```bash
npm i -g @subsquid/cli
```

Now we'll be able to use the `sqd` command to interact with our Squid project. To create our project, we're going to use the `-t` flag, which will create a project from a template. We'll be using the EVM Squid template, which is a starter project for indexing EVM chains.

You can run the following command to create an EVM Squid named `local-squid`:

```bash
sqd init local-squid -t evm
```

This will create a Squid with all of the necessary dependencies. You can go ahead and install the dependencies:

```bash
cd local-squid && npm install
```

Now that we have a starting point for our project, we'll need to configure our project to index ERC-20 `Transfer` events from our local development node.

### Index a Local Moonbeam Development Node {: #index-a-local-dev-node }

To index our local development node, we'll use Subsquid's EVM Archive. If you're not familiar with Subsquid, an Archive is a data lake for on-chain data. As you probably have guessed, the EVM Archive is for EVM data.

The EVM Archive is made available through Subsquid's `subsquid/eth-archive-worker` Docker image. We'll configure the Archive to retrieve our on-chain data by pointing it to the port that our development node is running on: `9944`.

To get started, we'll create a new directory and Docker compose file for our Archive:

```bash
mkdir archive && touch archive/docker-compose.archive.yml
```

Next, we'll add the following code to the `docker-compose.archive.yml` file:

```yml
version: "3"

services:
  worker:
    image: subsquid/eth-archive-worker:latest
    environment:
      RUST_LOG: "info"
    ports:
      - 8080:8080
    command: [
            "/eth/eth-archive-worker",
            "--server-addr", "0.0.0.0:8080",
            "--db-path", "/data/db",
            "--data-path", "/data/parquet/files",
            "--request-timeout-secs", "300",
            "--connect-timeout-ms", "1000",
            "--block-batch-size", "10",
            "--http-req-concurrency", "10",
            "--best-block-offset", "10",
            "--rpc-urls", "http://host.docker.internal:9944/",
            "--max-resp-body-size", "30",
            "--resp-time-limit", "5000",
            "--query-concurrency", "16",
    ]
    # Uncomment this section on Linux machines.
    # The connection to local RPC node will not work otherwise.
    # extra_hosts:
    #   - "host.docker.internal:host-gateway"
    volumes:
      - database:/data/db

volumes:
  database:
```

!!! note
    If you're on Linux, don't forget to uncomment the `extra_hosts` section.

To easily run our Archive, let's update the preexisting `commands.json` file, which is located in the root `local-squid` directory, to include an `archive-up` and `archive-down` command, which will spin up and spin down our Archive as needed:

```json
{
    "$schema": "https://cdn.subsquid.io/schemas/commands.json",
    "commands": {
      "archive-up": {
        "description": "Start local Moonbeam Archive",
        "cmd": ["docker-compose", "-f", "archive/docker-compose.archive.yml", "up", "-d"]
      },
      "archive-down": {
        "description": "Stop local Moonbeam Archive",
        "cmd": ["docker-compose", "-f", "archive/docker-compose.archive.yml", "down"]
      },
      // ...
    }
  }
```

!!! note
    It doesn't matter where you add the two new commands in the `commands` object. Feel free to add them to the top of the list or wherever you see fit.

Now we can start our Archive by running:

```bash
sqd archive-up
```

This will run our Archive on port 8080.

![Spin up a local Subsquid EVM Archive](/images/tutorials/integrations/local-subsquid/local-squid-5.png)

That's it for the Archive! Now we need to update our Squid project to index ERC-20 `Transfer` events, and then we'll be ready to run our indexer!

### Index ERC-20 Transfers {: #index-erc-20-transfer events}

In order to index ERC-20 transfers, we'll need to take a series of actions:

1. Update the database schema and generate models for the data
2. Use the `MyTok` contract's ABI to generate TypeScript interface classes that will be used by our Squid to index `Transfer` events
3. Configure the processor to process `Transfer` events for the `MyTok` contract from our local development node and Archive. Then we'll add logic to process the `Transfer` events and save the processed transfer data

As mentioned, we'll first need to define the database schema for the transfer data. To do so, we'll edit the `schema.graphql` file, which is located in the root `local-squid` directory, and create a `Transfer` entity:

```graphql
type Transfer @entity {
  id: ID!
  block: Int!
  from: String! @index
  to: String! @index
  value: BigInt!
  txHash: String!
  timestamp: BigInt!
}
```

Now we can generate the entity classes from the schema, which we'll use when we process the transfer data:

```bash
sqd codegen
```

Next, we can tackle the second item on our list and use our contract's ABI to generate TypeScript interface classes. We can do this by running:

```bash
sqd typegen ../artifacts/contracts/MyTok.sol/MyTok.json
```

![Run Subsquid commands](/images/tutorials/integrations/local-subsquid/local-squid-6.png)

This will generate the related TypeScript interface classes in the `src/abi/MyTok.ts` file. For this tutorial, we'll be accessing the `events` specifically.

For the third step, we'll start to update the processor. The processor fetches on-chain data from an Archive, transforms the data as specified, and saves the result. We'll tackle each of these items in the `src/processor.ts` file.

We'll be taking the following steps:

1. Importing the files we generated in the previous two steps: the data model and the events interface
2. Set the data source `chain` to be our local development node and the `archive` to be our local Archive
3. Tell our processor to process EVM logs for our `MyTok` contract and filter the logs for `Transfer` events
4. Add logic to process the transfer data.  We'll iterate over each of the blocks and `Transfer` events associated with our `MyTok` contract, decode them, and save the transfer data to our database

You can replace all of the preexisting content in the `src/processor.ts` file with the following:

```js
import { TypeormDatabase } from '@subsquid/typeorm-store';
import { EvmBatchProcessor } from '@subsquid/evm-processor';
import { Transfer } from './model';
import { events } from './abi/MyTok';

const contractAddress = '0xc01Ee7f10EA4aF4673cFff62710E1D7792aBa8f3'.toLowerCase();
const processor = new EvmBatchProcessor()
  .setDataSource({
    chain: 'http://localhost:9944', // Local development node
    archive: 'http://localhost:8080', // Local Archive
  })
  .addLog(contractAddress, {
    filter: [[events.Transfer.topic]],
    data: {
      evmLog: {
        topics: true,
        data: true,
      },
      transaction: {
        hash: true
      }
    }
  });

processor.run(new TypeormDatabase(), async (ctx) => {
  const transfers: Transfer[] = []
  for (let c of ctx.blocks) {
    for (let i of c.items) {

      if (i.address === contractAddress && i.kind === 'evmLog'){
          if (i.transaction){
            const { from, to, value } = events.Transfer.decode(i.evmLog)
            transfers.push(new Transfer({
              id: `${String(c.header.height).padStart(10, '0')}-${i.transaction.hash.slice(3,8)}`,
              block: c.header.height,
              from: from,
              to: to,
              value: value.toBigInt(),
              timestamp: BigInt(c.header.timestamp),
              txHash: i.transaction.hash
            }))
          }
      }
    }
   }
   await ctx.store.save(transfers)
});
```

Now we've taken all of the steps necessary and are ready to run our indexer!

### Run the Indexer {: #run-indexer }

To run our indexer, we're going to run a series of `sqd` commands:

1. Build our project

    ```bash
    sqd build
    ```

2. Launch the database:

    ```bash
    sqd up
    ```

3. Remove the database migration file that comes with the EVM template and generate a new one for our new database schema:

    ```bash
    sqd migration:clean
    sqd migration:generate
    ```

4. Launch the processor:

    ```bash
    sqd process
    ```

!!! note
    You can review the `commands.json` file to see what each `sqd` command does under the hood.

In your terminal, you should see your indexer starting to process blocks!

![Spin up a Subsquid indexer](/images/tutorials/integrations/local-subsquid/local-squid-7.png)

If your Squid isn't indexing blocks properly, make sure that your development node is running with the `--sealing` flag. For this example, you should have set the flag as `--sealing 4000`, so that a block is produced every four seconds. You can feel free to edit the sealing interval as needed. Before you try to spin up your Squid again, run the following commands to shut down your local Archive and Squid:

```bash
sqd archive-down && sqd down
```

Then you can start your local Archive and Squid back up:

```bash
sqd archive-up && sqd up
```

Finally, you should be able to start indexing again:

```bash
sqd process
```

Now your indexer should be indexing your development node without any problems!

### Query the Indexer {: #query-indexer }

To query our indexer, we'll need to launch the GraphQL server in a new terminal window:

```bash
sqd serve
```

The GraphQL server will be launched and you can access it at [localhost:4350/graphql](http://localhost:4350/graphql){target=_blank}. Then you can query the database for all of the transfer data:

```gql
query MyQuery {
  transfers {
    id
    block
    from
    to
    value
    txHash
  }
}
```

All of the transfers will be returned, including the transfer of the initial supply to Alith's account and the transfers from Alith to Baltathar, Charleth, Dorothy, and Ethan.

![Query transfer data using the GraphQL server](/images/tutorials/integrations/local-subsquid/local-squid-8.png)

And that's it! You've successfully used Subsquid to index data on a local Moonbeam development node! You can view the entire project on [GitHub](https://github.com/eshaben/local-squid-demo){target=_blank}.

--8<-- 'text/disclaimers/educational-tutorial.md'

--8<-- 'text/disclaimers/third-party-content.md'
