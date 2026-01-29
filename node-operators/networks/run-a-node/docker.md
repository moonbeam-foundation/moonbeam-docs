---
title: Use Docker to Run a Node
description: How to run a full parachain node so you can have your own RPC endpoint or produce blocks for the Moonbeam Network using Docker.
categories: Node Operators and Collators
---

# Run a Node on Moonbeam Using Docker

## Introduction {: #introduction }

Running a full node on a Moonbeam-based network allows you to connect to the network, sync with a bootnode, obtain local access to RPC endpoints, author blocks on the parachain, and more.

In this guide, you'll learn how to quickly spin up a Moonbeam node using [Docker](https://www.docker.com){target=\_blank} and how to maintain and purge your node.

## Checking Prerequisites {: #checking-prerequisites }

To get started, you'll need to:

- [Install Docker](https://docs.docker.com/get-started/get-docker/){target=\_blank}. At the time of writing, the Docker version used was 24.0.6
- Make sure that your system meets the [requirements](/node-operators/networks/run-a-node/overview/#requirements){target=\_blank}. When connecting to Moonriver on Kusama or Moonbeam on Polkadot, it will take a few days to completely sync the embedded relay chain

## Set up Storage for Chain Data {: #storage-chain-data }

To set up the directory for storing chain data, you'll need to:

1. Create a local directory

    === "Moonbeam"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/docker/1.sh'
        ```

    === "Moonriver"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/docker/2.sh'
        ```

    === "Moonbase Alpha"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/docker/3.sh'
        ```

2. Set the ownership and permissions for the local directory that stores the chain data. You can set the permissions either for a specific or current user (replace `INSERT_DOCKER_USER` for the actual user that will run the `docker` command)

    === "Moonbeam"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/docker/4.sh'
        ```

    === "Moonriver"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/docker/5.sh'
        ```

    === "Moonbase Alpha"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/docker/6.sh'
        ```

## Start-up Commands {: #start-up-commands }

To spin up your node, you'll need to execute the `docker run` command. If you're setting up a collator node, make sure to follow the code snippets for [collators](#collator-node).

Note that in the following start-up command, you have to:

- Replace `INSERT_YOUR_NODE_NAME` with your node name of choice. You'll have to do this in two places: one for the parachain and one for the relay chain
- Replace `INSERT_RAM_IN_MB` for 50% of the actual RAM your server has. For example, for 32GB of RAM, the value must be set to `16000`. The minimum value is `2000`, but it is below the recommended specs

For an overview of the flags used in the following start-up commands, plus additional commonly used flags, please refer to the [Flags](/node-operators/networks/run-a-node/flags/){target=\_blank} page of our documentation.

!!! note "For Apple Silicon users"
    If Docker commands fail or behave unexpectedly on Apple Silicon, enable **Use Rosetta for x86_64/amd64 emulation on Apple Silicon** in Docker Desktop settings and use the `amd64` platform for both pull and run commands. For example:

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/docker/7.sh'
    ```

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/docker/8.sh'
    ```

### Full Node {: #full-node }

???+ code "Linux snippets"

    === "Moonbeam"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/docker/9.sh'
        ```

    === "Moonriver"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/docker/10.sh'
        ```

    === "Moonbase Alpha"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/docker/11.sh'
        ```

??? code "MacOS snippets"

    === "Moonbeam"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/docker/12.sh'
        ```

    === "Moonriver"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/docker/13.sh'
        ```

    === "Moonbase Alpha"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/docker/14.sh'
        ```

--8<-- 'text/node-operators/networks/run-a-node/external-access.md'

??? code "Example start-up command for Moonbeam"

    === "Linux"

        ```bash hl_lines="11"
        --8<-- 'code/node-operators/networks/run-a-node/docker/15.sh'
        ```

    === "MacOS"

        ```bash hl_lines="10"
        --8<-- 'code/node-operators/networks/run-a-node/docker/16.sh'
        ```

--8<-- 'text/node-operators/networks/run-a-node/sql-backend.md'

??? code "Example start-up command for Moonbeam"

    === "Linux"

        ```bash hl_lines="12"
        --8<-- 'code/node-operators/networks/run-a-node/docker/17.sh'
        ```

    === "MacOS"

        ```bash hl_lines="10"
        --8<-- 'code/node-operators/networks/run-a-node/docker/18.sh'
        ```

### Collator Node

Beginning with v0.39.0, new Moonbeam collator nodes will no longer generate session keys automatically on start-up. Nodes in existence prior to v0.39.0 do not need to make changes to how they handle session keys. 

When setting up a new node, run the following command to generate and store on disk the session keys that will be referenced in the start-up command: 

=== "Moonbeam"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/docker/19.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/docker/20.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/docker/21.sh'
    ```

!!! note
    You need to [change ownership of the newly created folder](#storage-chain-data) to the specific user or current user for Docker. Node key generation steps can be bypassed using the `--unsafe-force-node-key-generation` parameter in the start-up command, although this is not the recommended practice.

Now you can run your Docker start up commands:

???+ code "Linux snippets"

    === "Moonbeam"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/docker/22.sh'
        ```

    === "Moonriver"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/docker/23.sh'
        ```

    === "Moonbase Alpha"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/docker/24.sh'
        ```

??? code "MacOS snippets"

    === "Moonbeam"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/docker/25.sh'
        ```

    === "Moonriver"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/docker/26.sh'
        ```

    === "Moonbase Alpha"

        ```bash
        --8<-- 'code/node-operators/networks/run-a-node/docker/27.sh'
        ```

## Syncing Your Node {: #syncing-your-node }

Once Docker pulls the necessary images, your full node will start, displaying lots of information, such as the chain specification, node name, role, genesis state, and more.

--8<-- 'code/node-operators/networks/run-a-node/docker/terminal/start.md'

During the syncing process, you will see logs from both the embedded relay chain ([Relaychain]) and the parachain ([🌗]). These logs display a target block (live network state) and a best block (local node synced state).

--8<-- 'code/node-operators/networks/run-a-node/docker/terminal/logs.md'

If you followed the installation instructions for Moonbase Alpha, once synced, you will have a node of the Moonbase Alpha TestNet running locally! For Moonbeam or Moonriver, once synced, you will be connected to peers and see blocks being produced on the network!

!!! note
    It may take a few days to completely sync the embedded relay chain. Make sure that your system meets the [requirements](/node-operators/networks/run-a-node/overview/#requirements){target=\_blank}.

## Maintain Your Node {: #maintain-your-node }

As Moonbeam development continues, it will sometimes be necessary to upgrade your node software. Node operators will be notified on our [Discord channel](https://discord.com/invite/PfpUATX){target=\_blank} when upgrades are available and whether they are necessary (some client upgrades are optional). The upgrade process is straightforward and is the same for a full node or collator.

1. Stop the Docker container:

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/docker/28.sh'
    ```

2. Get the latest version of Moonbeam from the [Moonbeam GitHub Release](https://github.com/moonbeam-foundation/moonbeam/releases){target=\_blank} page
3. Use the latest version to spin up your node. To do so, replace the version in the start-up command with the latest and run it

Once your node is running again, you should see logs in your terminal.

## Purge Your Node {: #purge-your-node }

If you need a fresh instance of your Moonbeam node, you can purge your node by removing the associated data directory.

You'll first need to stop the Docker container:

```bash
--8<-- 'code/node-operators/networks/run-a-node/docker/29.sh'
```

If you did not use the `-v` flag to specify a local directory for storing your chain data when you spun up your node, then the data folder is related to the Docker container itself. Therefore, removing the Docker container will remove the chain data.

If you did spin up your node with the `-v` flag, you will need to purge the specified directory. For example, for the suggested data directly, you can run the following command to purge your parachain and relay chain data:

=== "Moonbeam"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/docker/30.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/docker/31.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/docker/32.sh'
    ```

To only remove the parachain data for a specific chain, you can run:

=== "Moonbeam"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/docker/33.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/docker/34.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/docker/35.sh'
    ```

Similarly, to only remove the relay chain data, you can run:

=== "Moonbeam"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/docker/36.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/docker/37.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/docker/38.sh'
    ```

--8<-- 'text/node-operators/networks/run-a-node/post-purge.md'
