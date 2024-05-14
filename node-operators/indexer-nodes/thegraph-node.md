---
title: Run a Graph Node
description: Use Docker to spin up and run your own Graph node to provide indexing and querying services of on-chain data on Moonbeam.
---

# Running a Graph Node on Moonbeam

## Introduction {: #introduction }

A [Graph](https://thegraph.com){target=\_blank} Node sources events from a blockchain to deterministically update a data store that can be then queried via a GraphQL endpoint.

There are two ways you can set up a Graph Node: you can use Docker to run an all-in-one image, or you can run their [Rust implementation](https://github.com/graphprotocol/graph-node){target=\_blank}. The steps described in this guide will only cover the Docker alternative, as it is more convenient, and you can set up a Graph Node very quickly.

!!! note
    The steps described in this guide have been tested in both Ubuntu 18.04-based and MacOS environments, and they will need to be adapted accordingly for other systems.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Checking Prerequisites {: #checking-prerequisites }

Before diving into setting up a Graph Node, you need to have the following installed on your system:

 - [Docker](https://docs.docker.com/get-docker){target=\_blank}
 - [Docker Compose](https://docs.docker.com/compose/install){target=\_blank}
 - [JQ](https://stedolan.github.io/jq/download){target=\_blank}


In this guide, you will learn how to run a Graph node against a Moonbase Alpha tracing node with the `tracing` flag enabled. To spin up a full node with the `tracing` flag enabled, check out the [Debug & Trace](/node-operators/networks/tracing-node/){target=\_blank} guide.

This guide can also be adapted for Moonbeam and Moonriver.
--8<-- 'text/_common/endpoint-examples.md'

## Running a Graph Node {: #running-a-graph-node }

The first step is to clone the [Graph Node repository](https://github.com/graphprotocol/graph-node){target=\_blank}:

```bash
git clone https://github.com/graphprotocol/graph-node/ \
&& cd graph-node/docker
```

Next, execute the `setup.sh` file. This will pull all the necessary Docker images and write the necessary information in the `docker-compose.yml` file.

```bash
./setup.sh
```

The tail end from the logs of the previous command should look something similar to:

![Graph Node setup](/images/node-operators/indexer-nodes/the-graph/the-graph-node-1.webp)

Once everything is set up, you need to modify the "Ethereum environment" inside the `docker-compose.yml` file, so that it points to the endpoint of the node you are running this Graph Node against. Note that the `setup.sh` file detects the `Host IP` and writes its value, so you'll need to modify it accordingly.

=== "Moonbeam"

    ```yaml
    ethereum: 'moonbeam:{{ networks.development.rpc_url }}'
    ```

=== "Moonriver"

    ```yaml
    ethereum: 'moonriver:{{ networks.development.rpc_url }}'
    ```

=== "Moonbase Alpha"

    ```yaml
    ethereum: 'mbase:{{ networks.development.rpc_url }}'
    ```

=== "Moonbeam Dev Node"

    ```yaml
    ethereum: 'mbase:{{ networks.development.rpc_url }}'
    ```

The entire `docker-compose.yml` file should look something similar to:

```yaml
version: '3'
services:
  graph-node:
    image: graphprotocol/graph-node
    ports:
      - '8000:8000'
      - '8001:8001'
      - '8020:8020'
      - '8030:8030'
      - '8040:8040'
    depends_on:
      - ipfs
      - postgres
    environment:
      postgres_host: postgres
      postgres_user: graph-node
      postgres_pass: let-me-in
      postgres_db: graph-node
      ipfs: 'ipfs:5001'
      ethereum: 'mbase:{{ networks.development.rpc_url }}'
      RUST_LOG: info
  ipfs:
    image: ipfs/go-ipfs:v0.4.23
    ports:
      - '5001:5001'
    volumes:
      - ./data/ipfs:/data/ipfs
  postgres:
    image: postgres
    ports:
      - '5432:5432'
    command: ["postgres", "-cshared_preload_libraries=pg_stat_statements"]
    environment:
      POSTGRES_USER: graph-node
      POSTGRES_PASSWORD: let-me-in
      POSTGRES_DB: graph-node
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
```

Lastly, to run the Graph Node, just run the following command:

```bash
docker-compose up
```

![Graph Node compose up](/images/node-operators/indexer-nodes/the-graph/the-graph-node-2.webp)

After a while, you should see logs related to the Graph Node syncing with the latest available block in the network:

![Graph Node logs](/images/node-operators/indexer-nodes/the-graph/the-graph-node-3.webp)

And that is it! You have a Graph Node running against the Moonbase Alpha TestNet. Feel free to adapt this example for Moonbeam and Moonriver as well.

--8<-- 'text/_disclaimers/third-party-content.md'
