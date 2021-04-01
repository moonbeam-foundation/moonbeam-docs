---
title: Chainlink Node
description: How to set up a Chainlink Oracle node for the Moonbeam Network to feed data on-chain to be used by Smart Contracts
---

# Run a Chainlink Oracle Node on Moonbeam

![Chainlink Moonbeam Banner](/images/chainlink/chainlinknode-banner.png)

## Introduction

As an open, permissionless network, anyone may choose to operate an Oracle providing data to smart contracts running on Moonbeam.

This article provides an overview in regards to setting up a Chainlink Oracle on Moonbase Alpha.

!!! note
    The examples provided are for demonstration purposes only. Passwords **MUST** be managed securely and never stored in plaintext. These examples assume an Ubuntu 18.04-based environment, but call-outs for MacOs are included. This guide is for a development setup only, do not use this for a production environment.

## Basic Request Model

Before we go dive into how to get started, it is important to understand the basics of the "basic request model."

--8<-- 'text/chainlink/chainlink-brm.md'

## Advanced Users

If you are familiar with running Chainlink Oracle nodes, this information will get you started on the Moonbase Alpha TestNet quickly:

 - Chainlink documentation, which can be found [here](https://docs.chain.link/docs/running-a-chainlink-node)
 - Moonbase Alpha WSS EndPoint: `wss://wss.testnet.moonbeam.network`
 - Moonbase Alpha ChainId: `1287`
 - LINK Token on Moonbase Alpha: `0xa36085F69e2889c224210F603D836748e7dC0088`
 - Get Moonbase Alpha tokens from [our Faucet](/getting-started/testnet/faucet/)

## Getting Started

This guide will walk through the process of setting up the Oracle node, summarized as:

 - Setup a Chainlink node connected to Moonbase Alpha
 - Fund node
 - Deploy an Oracle contract
 - Create a job on the Chainlink node
 - Bond node and Oracle
 - Test using a client contract

The basic requirements are:

 - Docker for running Postgres DB and ChainLink node containers. For more information on installing Docker, please visit [this page](https://docs.docker.com/get-docker/)
 - An account with funds. You can create one with [Metamask](/integrations/wallets/metamask/), which can be funded via [our Faucet](https://docs.moonbeam.network/getting-started/testnet/faucet/)
 - Access to the Remix IDE in case you want to use it to deploy the Oracle contract. You can find more information about Remix on Moonbeam [here](/integrations/remix/)

## Node Setup

First, let's create a new directory to place all the necessary files. For example:

```
mkdir -p ~/.chainlink-moonbeam //
cd ~/.chainlink-moonbeam
```

Next, lets create a Postgres DB with Docker. To do so, execute the following command (MacOs users may replace `--network host \` with `-p 5432:5432`):

```
docker run -d --name chainlink_postgres_db \
    --volume chainlink_postgres_data:/var/lib/postgresql/data \
    -e 'POSTGRES_PASSWORD={YOU_PASSWORD_HERE}' \
    -e 'POSTGRES_USER=chainlink' \
    --network host \
    -t postgres:11
```

Make sure to replace `{YOU_PASSWORD_HERE}` with an actual password.

!!! note
    Reminder, do not store any production passwords in a plaintext file. The examples provided are for demonstration purposes only.

Docker will proceed to download the necessary images if they are not available. Now, we need to create an environment file for Chainlink in the newly-created directory. This file is read on the creation of the Chainlink container. MacOs users may replace `localhost` with `host.docker.internal`.

```
echo "ROOT=/chainlink
LOG_LEVEL=debug
ETH_CHAIN_ID=1287
MIN_OUTGOING_CONFIRMATIONS=2
LINK_CONTRACT_ADDRESS={LINK TOKEN CONTRACT ADDRESS}
CHAINLINK_TLS_PORT=0
SECURE_COOKIES=false
GAS_UPDATER_ENABLED=false
ALLOW_ORIGINS=*
ETH_URL=wss://wss.testnet.moonbeam.network
DATABASE_URL=postgresql://chainlink:{YOUR_PASSWORD_HERE}@localhost:5432/chainlink?sslmode=disable
MINIMUM_CONTRACT_PAYMENT=0" > ~/.chainlink-moonbeam/.env
```

Here, besides the password (`{YOUR_PASSWORD_HERE}`), we need to provide the Link token contract (`{LINK TOKEN CONTRACT ADDRESS}`). After we've created the environment file, we also need an `.api` file that stores the user and password used to access the node's API, the node's operator UI,and the Chainlink command line.

```
echo "{AN_EMAIL_ADDRESS}" >  ~/.chainlink-moonbeam/.api
echo "{ANOTHER_PASSWORD}"   >> ~/.chainlink-moonbeam/.api
```

Set both an email address and another password. Lastly, we need another file that stores the wallet password for the node's address:

```
echo "{THIRD_PASSWORD}" > ~/.chainlink-moonbeam/.password
```

Now that we have finished creating all necessary files, we can launch the containers with the following command (MacOs users may replace `--network host \` with `-p 6688:6688`):

```
docker run -d --name chainlink_oracle_node \
    --volume $(pwd):/chainlink \
    --env-file=.env \
    --network host \
    -t smartcontract/chainlink:0.9.2 \
        local n \
        -p /chainlink/.password \
        -a /chainlink/.api
```

To verify everything is running and that the logs are progressing use:

```
docker ps #Containers Running
docker logs --tail 50 {container_id} #Logs progressing
```

![Docker logs](/images/chainlink/chainlinknode-image1.png)

## Contract Setup

With the Oracle node running, let's configure the smart contract side of things.

First, we need to retrieve the address that the Oracle node will use to send transactions and write data on-chain. To retrieve the address, log into the [ChainLink node's UI](http://localhost:6688/) (located at `http://localhost:6688/`) using the credentials from the `.api` file.

![Chainlink login](/images/chainlink/chainlinknode-image2.png)

Go to the 'Configuration Page` and copy the node address. Use the [Moonbeam Faucet](https://docs.moonbeam.network/getting-started/testnet/faucet/) to fund it.

![Chainlink address](/images/chainlink/chainlinknode-image3.png)

Next, we need to deploy the Oracle contract, which is the middleware between the chain and the node. The contract emits an event with all the necessary information, which is read by the Oracle node. Then, the node fulfills the request and writes the requested data in the caller's contract.

The source code of the Oracle contract can be found in Chainlink's official GitHub repository [here](https://github.com/smartcontractkit/chainlink/tree/develop/evm-contracts/src/v0.6). For this example, we'll use Remix to interact with Moonbase Alpha and deploy the contract. In Remix, we can copy the following code:

```
pragma solidity ^0.6.6;

import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.6/Oracle.sol";
```

After compiling the contract, head to the "Deploy and Run Transactions" tab, enter the Link token address and deploy the contract. Once deployed, copy the address of the contract.

![Deploy Oracle using Remix](/images/chainlink/chainlinknode-image4.png)

Lastly, we have to bond the Oracle node and the Oracle smart contract. A node can listen to the requests sent to a certain Oracle contract, but only authorized (aka. bonded) nodes can fulfill the request with a result.

To set this authorization, we can use the function `setFulfillmentPermission()` from the Oracle contract. This needs two parameters:

 - The address of the node that we want to bond to the contract (which we did in a previous step)
 - A boolean indicating the status of the bond. In this case, we set it to `true`

We can use the instance of the contract deployed on Remix to do so, and check the Oracle node is authorized with the view function `getAuthorizationStatus()`, passing in the Oracle node address.

![Authorize Chainlink Oracle Node](/images/chainlink/chainlinknode-image5.png)

## Create Job on the Oracle node

The last step to have a fully configured Chainlink Oracle is to create a Job. Referring to [Chainlink’s official documentation](https://docs.chain.link/docs/job-specifications):

> A Job specifications, or specs, contain the sequential tasks that the node must perform to produce a final result. A spec contains at least one initiator and one task, which are discussed in detail below. Specs are defined using standard JSON so that they are human-readable and can be easily parsed by the Chainlink node.

Seeing an Oracle as an API service, a Job here would be one of the functions that we can call and that will return a result. To create our first Job, go to the [Jobs sections of your node](http://localhost:6688/jobs) and click on "New Job."

![Chainlink Oracle New Job](/images/chainlink/chainlinknode-image6.png)

Next, paste the following JSON. This will create a Job that will request the current ETH price in USD. Make sure you enter your Oracle contract address (`YOUR_ORACLE_CONTRACT_ADDRESS`).

```
{
  "initiators": [
    {
      "type": "runlog",
      "params": { "address": "YOUR_ORACLE_CONTRACT_ADDRESS" }
    }
  ],
  "tasks": [
    {
      "type": "httpget",
      "params": { "get": "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD" }
    },
    {
      "type": "jsonparse",
      "params": { "path": [ "USD" ] }
    },
    {
      "type": "multiply",
      "params": { "times": 100 }
    },
    { "type": "ethuint256" },
    { "type": "ethtx" }
  ]
}
```

![Chainlink New Job JSON Blob](/images/chainlink/chainlinknode-image7.png)

And that is it! You have fully set up a Chainlink Oracle node that is running on Moonbase Alpha.

## Test the Oracle

To verify the Oracle is up and answering requests, follow our [using an Oracle](/integrations/oracles/chainlink/) tutorial. The main idea is to deploy a client contract that requests to the Oracle, and the Oracle writes the requested data into the contract's storage.

## We Want to Hear From You

If you have any feedback regarding implementing Chainlink on your project or any other Moonbeam-related topic, feel free to reach out through our official development [Discord server](https://discord.com/invite/PfpUATX).
