---
title: Run a Chainlink Node
description: How to set up a Chainlink Oracle node for the Moonbeam Network to feed data on-chain to be used by smart contracts.
categories: Oracle Nodes
---

# Run a Chainlink Oracle Node on Moonbeam

## Introduction {: #introduction }

As an open, permissionless network, anyone may choose to operate an oracle providing data to smart contracts running on Moonbeam.

This article provides an overview in regards to setting up a Chainlink oracle on Moonbase Alpha.

!!! note
    The examples provided are for demonstration purposes only. Passwords **MUST** be managed securely and never stored in plaintext. These examples assume an Ubuntu 18.04-based environment, but call-outs for MacOS are included. This guide is for a development setup only, do not use this for a production environment.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Basic Request Model {: #basic-request-model }

--8<-- 'text/builders/integrations/oracles/chainlink/brm.md'

## Advanced Users {: #advanced-users }

If you are familiar with running Chainlink oracle nodes, this information will get you started on the Moonbase Alpha TestNet quickly:

 - Chainlink documentation on [Running a Chainlink Node](https://docs.chain.link/chainlink-nodes/v1/running-a-chainlink-node){target=\_blank}
 - Moonbase Alpha WSS EndPoint: `wss://wss.api.moonbase.moonbeam.network`
 - Moonbase Alpha ChainId: `{{ networks.moonbase.chain_id }}` (hex: `{{ networks.moonbase.hex_chain_id}}`)
 - LINK Token on Moonbase Alpha: `0xa36085F69e2889c224210F603D836748e7dC0088`
 - 
 --8<-- 'text/_common/faucet/faucet-list-item.md'

## Checking Prerequisites {: #checking-prerequisites }

To follow along with this guide, you will need to have:

 - [Docker installed](https://docs.docker.com/get-started/get-docker/){target=\_blank} for running Postgres DB and ChainLink node containers
 - An account with funds. You can create one with [MetaMask](/tokens/connect/metamask/){target=\_blank}.
 --8<-- 'text/_common/faucet/faucet-list-item.md'
 - Access to the [Remix IDE](https://remix.ethereum.org){target=\_blank} in case you want to use it to deploy the oracle contract. For more information you can check out the [Using Remix to Deploy to Moonbeam](/builders/ethereum/dev-env/remix/){target=\_blank} tutorial

## Getting Started {: #getting-started }

This guide will walk through the process of setting up the oracle node, summarized as:

 - Setup a Chainlink node connected to Moonbase Alpha
 - Fund the node
 - Deploy an oracle contract
 - Create a job on the node
 - Bond the node and oracle
 - Test using a client contract

## Node Setup {: #node-setup }

To get the node setup, you can take the following steps:

1. Create a new directory to place all the necessary files

    ```bash
    mkdir -p ~/.chainlink-moonbeam && cd ~/.chainlink-moonbeam
    ```

2. Create a Postgres DB with Docker (MacOS users may replace `--network host \` with `-p 5432:5432`)

    ```bash
    docker run -d --name chainlink_postgres_db \
        --volume chainlink_postgres_data:/var/lib/postgresql/data \
        -e 'POSTGRES_PASSWORD={INSERT_PASSWORD}' \
        -e 'POSTGRES_USER=chainlink' \
        --network host \
        -t postgres:11
    ```

    Make sure to replace `{INSERT_PASSWORD}` with an actual password. Docker will proceed to download the necessary images if they haven't already been downloaded

3. Create an environment file for Chainlink in the `chainlink-moonbeam` directory. This file is read on the creation of the Chainlink container. MacOS users may replace `localhost` with `host.docker.internal`

    ```bash
    echo "ROOT=/chainlink
    LOG_LEVEL=debug
    ETH_CHAIN_ID=1287
    MIN_OUTGOING_CONFIRMATIONS=2
    LINK_CONTRACT_ADDRESS={INSERT_LINK_TOKEN_CONTRACT_ADDRESS}
    CHAINLINK_TLS_PORT=0
    SECURE_COOKIES=false
    GAS_UPDATER_ENABLED=false
    ALLOW_ORIGINS=*
    ETH_URL=wss://wss.api.moonbase.moonbeam.network
    DATABASE_URL=postgresql://chainlink:{INSERT_PASSWORD}@localhost:5432/chainlink?sslmode=disable
    MINIMUM_CONTRACT_PAYMENT=0" > ~/.chainlink-moonbeam/.env
    ```

    Here, besides the password (`{INSERT_PASSWORD}`), you also need to provide the LINK token contract (`{INSERT_LINK_TOKEN_CONTRACT_ADDRESS}`)

4. Create an `.api` file that stores the user and password used to access the node's API, the node's operator UI, and the Chainlink command line

    ```bash
    touch .api
    ```

5. Set both an email address and another password

    ```bash
    echo "{INSERT_EMAIL_ADDRESS}" > ~/.chainlink-moonbeam/.api
    echo "{INSERT_ANOTHER_PASSWORD}" >> ~/.chainlink-moonbeam/.api
    ```

6. Lastly, you need another file that stores the wallet password for the node's address

    ```bash
    touch .password
    ```

7. Set the third password

    ```bash
    echo "{INSERT_THIRD_PASSWORD}" > ~/.chainlink-moonbeam/.password
    ```

8. Launch the containers (MacOS users may replace `--network host \` with `-p 6688:6688`)

    ```bash
    docker run -d --name chainlink_oracle_node \
      --volume $(pwd):/chainlink \
      --env-file=.env \
      --network host \
      -t smartcontract/chainlink:0.9.2 \
        local n \
        -p /chainlink/.password \
        -a /chainlink/.api
    ```

!!! note
    Reminder, do not store any production passwords in a plaintext file. The examples provided are for demonstration purposes only.

To verify everything is running and that the logs are progressing use:

```bash
docker ps #Containers Running
docker logs --tail 50 {INSERT_CONTAINER_ID} #Logs progressing
```

![Docker logs](/images/node-operators/oracle-nodes/chainlink/chainlink-node-1.webp)

## Contract Setup {: #contract-setup }

With the oracle node running, you can start to configure the smart contract side of things. First, you'll need to fund the oracle node by taking the following steps:

1. Retrieve the address that the oracle node will use to send transactions and write data on-chain by logging into the Chainlink node's UI (located at `http://localhost:6688/`). You'll need to use the credentials from the `.api` file

    ![Chainlink login](/images/node-operators/oracle-nodes/chainlink/chainlink-node-2.webp)

2. Go to the **Configuration Page** and copy the node address
3. Fund the node.
 --8<-- 'text/_common/faucet/faucet-list-item.md'

    ![Chainlink address](/images/node-operators/oracle-nodes/chainlink/chainlink-node-3.webp)

Next, you'll need to deploy the oracle contract, which is the middleware between the chain and the node. The contract emits an event with all the necessary information, which is read by the oracle node. Then, the node fulfills the request and writes the requested data in the caller's contract.

The source code of the oracle contract can be found in [Chainlink's official GitHub repository](https://github.com/smartcontractkit/chainlink/blob/v1.13.3/contracts/src/v0.6/Oracle.sol){target=\_blank}. For this example, you can use Remix to interact with Moonbase Alpha and deploy the contract. In [Remix](https://remix.ethereum.org){target=\_blank}, you can create a new file and copy the following code:

```bash
pragma solidity ^0.6.6;

import "@chainlink/contracts/src/v0.6/Oracle.sol";
```

After compiling the contract, you can take the following steps to deploy and interact with the contract:

1. Head to the **Deploy and Run Transactions** tab
2. Make sure you've selected **Injected Web3** and have MetaMask connected to Moonbase Alpha
3. Verify your address is selected
4. Enter the LINK token address and click **Deploy** to deploy the contract. MetaMask will pop-up and you can confirm the transaction
5. Once deployed, under the **Deployed Contracts** section, copy the address of the contract

![Deploy Oracle using Remix](/images/node-operators/oracle-nodes/chainlink/chainlink-node-4.webp)

Lastly, you have to bond the oracle node and the oracle smart contract. A node can listen to the requests sent to a certain oracle contract, but only authorized (aka. bonded) nodes can fulfill the request with a result. To bond the oracle node and smart contract, you can take the following steps:

1. To set the authorization using the `setFulfillmentPermission()` function from the oracle contract, enter the address of the node that you want to bond to the contract
2. In the `_allowed` field you can set a boolean that indicates the status of the bond, for this example enter in `true`
3. Click **transact** to send the request. MetaMask will pop-up and you can confirm the transaction
4. Check the oracle node is authorized with the `getAuthorizationStatus()` view function, passing in the oracle node address

![Authorize Chainlink Oracle Node](/images/node-operators/oracle-nodes/chainlink/chainlink-node-5.webp)

## Creating a Job {: #creating-a-job }

The last step to have a fully configured Chainlink oracle is to create a job. Referring to [Chainlink’s official documentation](https://docs.chain.link/chainlink-nodes/oracle-jobs/v1/job-specifications){target=\_blank}:

> A Job specifications, or specs, contain the sequential tasks that the node must perform to produce a final result. A spec contains at least one initiator and one task, which are discussed in detail below. Specs are defined using standard JSON so that they are human-readable and can be easily parsed by the Chainlink node.

Seeing an oracle as an API service, a job here would be one of the functions that you can call and that will return a result. To get started creating your first job, take the following steps:

1. Go to the **Jobs** sections of your node at `http://localhost:6688/jobs`
2. Click on **New Job**

![Chainlink oracle New Job](/images/node-operators/oracle-nodes/chainlink/chainlink-node-6.webp)

Next, you can create the new job:

1. Paste the following JSON. This will create a job that will request the current ETH price in USD

    ```json
    {
        "initiators": [
            {
                "type": "runlog",
                "params": { "address": "INSERT_YOUR_ORACLE_CONTRACT_ADDRESS" }
            }
        ],
        "tasks": [
            {
                "type": "httpget",
                "params": {
                    "get": "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
                }
            },
            {
                "type": "jsonparse",
                "params": { "path": ["USD"] }
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

2. Make sure you enter your oracle contract address (`INSERT_YOUR_ORACLE_CONTRACT_ADDRESS`)
3. Create the job by clicking on **Create Job**

![Chainlink New Job JSON Blob](/images/node-operators/oracle-nodes/chainlink/chainlink-node-7.webp)

And that is it! You have fully set up a Chainlink oracle node that is running on Moonbase Alpha.

### Using Any API {: #using-any-api }

You can also create and use a job spec to work with any API. You can search for preexisting jobs from an independent listing service such as [market.link](https://market.link){target=\_blank}. Please note that although the jobs might be implemented for other networks, you'll be able to use the job spec to create the job for your oracle node on Moonbase Alpha. Once you find a job that fits your needs, you'll need to copy the job spec JSON and use it to create a new job.

For example, the previous job spec can be altered to be more generic so it can be used for any API:

```json
{
    "initiators": [
        {
            "type": "runlog",
            "params": { "address": "INSERT_YOUR_ORACLE_CONTRACT_ADDRESS" }
        }
    ],
    "tasks": [
        { "type": "httpget" },
        { "type": "jsonparse" },
        { "type": "multiply" },
        { "type": "ethuint256" },
        { "type": "ethtx" }
    ]
}
```

If you need a more custom solution, you can check out Chainlink's documentation to learn how to build your own [External Adapter](https://docs.chain.link/chainlink-nodes/external-adapters/developers){target=\_blank}.

## Test the Oracle {: #test-the-oracle }

To verify the oracle is up and answering requests, follow the [using a Chainlink Oracle](/builders/integrations/oracles/chainlink/) tutorial. The main idea is to deploy a client contract that makes requests to the oracle, and the oracle writes the requested data into the contract's storage.

--8<-- 'text/_disclaimers/third-party-content.md'
