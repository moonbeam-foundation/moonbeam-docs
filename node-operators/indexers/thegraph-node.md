---
title: Graph Node
description: Build APIs using The Graph indexing protocol on Moonbeam
---

# Running a Graph Node on Moonbeam

![The Graph Node on Moonbeam](/images/thegraph/thegraphnode-banner.png)

## Introduction

A Graph Node sources events from a blockchain to deterministically update a data store that can be then queried via a GraphQL endpoint.

There are two ways you can set up a Graph Node: you can use Docker to run an all-in-one image, or you can run their [Rust implementation](https://github.com/graphprotocol/graph-node). The steps described in this guide will only cover the Docker alternative, as it is more convenient, and you can set up a Graph Node very quickly.

!!! note
    The steps described in this guide have been tested in both Ubuntu 18.04-based and MacOs environments, and they will need to be adapted accordingly for other systems.

## Checking Prerequisites

Before diving into setting up a Graph Node, you neeed to have the following installed on your system:

 - [Docker](https://docs.docker.com/get-docker/)
 - [Docker Compose](https://docs.docker.com/compose/install/)
 - [JQ](https://stedolan.github.io/jq/download/)

In addition, you need to have a node running with the `--ethapi=trace` option enabled. Currently, you can spin up two different kinds of nodes:

 - **Moonbeam development node** — run your own Moonbeam instance in your private environment. To do so, you can follow [this guide](/getting-started/local-node/setting-up-a-node/). Make sure to check the [advanced flags section](/getting-started/local-node/setting-up-a-node/#advanced-flags-and-options)
 - **Moonbase Alpha node** — run a full node of the TestNet and access your own private endpoints. To do so, you can follow [this guide](/node-operators/networks/full-node/). Make sure to check the [advanced flags section](/node-operators/networks/full-node/#advanced-flags-and-options)

In this guide, a Graph Node runs against a Moonbase Alpha full node with the `--ethapi=trace` flag.

## Running a Graph Node

The first step is to clone the [Graph Node repository](https://github.com/graphprotocol/graph-node/):

```
git clone https://github.com/graphprotocol/graph-node/ \
&& cd graph-node/docker
```

Next, execute the `setup.sh` file. This will pull all the necessary Docker images and write the necessary information in the `docker-compose.yml` file.

```
./setup.sh
```

The tail end from the logs of the previous command should look something similar to:

![Graph Node setup](/images/thegraph/thegraphnode-images1.png)

Once everything is set up, you need to modify the "Ethereum environment" inside the `docker-compose.yml` file, so that it points to the endpoint of the node you are running this Graph Node against. Note that the `setup.sh` file detects the `Host IP` and writes its value, so you'll need to modify it accordingly.

```
ethereum: 'mbase:http://localhost:9933'
```

The entire `docker-compose.yml` file should look something similar to:

```
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
      ethereum: 'mbase:http://localhost:9933'
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

```
docker-compose up
```

![Graph Node compose up](/images/thegraph/thegraphnode-images2.png)

After a while, you should see logs related to the Graph Node syncing with the latest available block in the network:

![Graph Node logs](/images/thegraph/thegraphnode-images3.png)

And that is it! You have a Graph Node running against the Moonbase Alpha TestNet. Feel free to adapt this example to a Moonbeam development node as well.

## We Want to Hear From You

If you have any feedback regarding running a Graph Node in Moonbeam or any other Moonbeam-related topic, feel free to reach out through our official development [Discord channel](https://discord.gg/PfpUATX).