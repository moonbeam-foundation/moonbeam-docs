---
title: Using Docker
description: How to run a full Parachain node so you can have your own RPC endpoint or produce blocks for the Moonbeam Network using Docker
---

# Run a Node on Moonbeam Using Docker

![Full Node Moonbeam Banner](/images/node-operators/networks/full-node/full-node-banner.png)

## Introduction {: #introduction } 

Running a full node on a Moonbeam-based network allows you to connect to the network, sync with a bootnode, obtain local access to RPC endpoints, author blocks on the parachain, and more.

## Installation Instructions {: #installation-instructions }

A Moonbeam node can be spun up quickly using Docker. For more information on installing Docker, please visit [this page](https://docs.docker.com/get-docker/). At the time of writing, the Docker version used was 19.03.6. When connecting to Moonriver on Kusama, it will take a few days to completely sync the embedded Kusama relay chain. Make sure that your system meets the [requirements](/node-operators/run-a-node/full-node#requirements).

Create a local directory to store the chain data:

=== "Moonbase Alpha"
    ```
    mkdir {{ networks.moonbase.node_directory }}
    ```

=== "Moonriver"
    ```
    mkdir {{ networks.moonriver.node_directory }}
    ```

Next, make sure you set the ownership and permissions accordingly for the local directory that stores the chain data. In this case, set the necessary permissions either for a specific or current user (replace `DOCKER_USER` for the actual user that will run the `docker` command):

=== "Moonbase Alpha"
    ```
    # chown to a specific user
    chown DOCKER_USER {{ networks.moonbase.node_directory }}

    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonbase.node_directory }}
    ```

=== "Moonriver"
    ```
    # chown to a specific user
    chown DOCKER_USER {{ networks.moonriver.node_directory }}

    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonriver.node_directory }}
    ```

Now, execute the docker run command. If you are setting up a collator node, make sure to follow the code snippets for "Collator". Note that you have to replace `YOUR-NODE-NAME` in two different places.

### Full Node {: #full-node } 

=== "Moonbase Alpha"
    ```
    docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
    --base-path=/data \
    --chain {{ networks.moonbase.chain_spec }} \
    --name="YOUR-NODE-NAME" \
    --execution wasm \
    --wasm-execution compiled \
    --pruning archive \
    --state-cache-size 1 \
    -- \
    --pruning archive \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

=== "Moonriver"
    ```
    docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
    --base-path=/data \
    --chain {{ networks.moonriver.chain_spec }} \
    --name="YOUR-NODE-NAME" \
    --execution wasm \
    --wasm-execution compiled \
    --pruning archive \
    --state-cache-size 1 \
    -- \
    --pruning archive \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

### Collator {: #collator } 

=== "Moonbase Alpha"
    ```
    docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
    --base-path=/data \
    --chain {{ networks.moonbase.chain_spec }} \
    --name="YOUR-NODE-NAME" \
    --validator \
    --execution wasm \
    --wasm-execution compiled \
    --pruning archive \
    --state-cache-size 1 \
    -- \
    --pruning archive \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

=== "Moonriver"
    ```
    docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
    --base-path=/data \
    --chain {{ networks.moonriver.chain_spec }} \
    --name="YOUR-NODE-NAME" \
    --validator \
    --execution wasm \
    --wasm-execution compiled \
    --pruning archive \
    --state-cache-size 1 \
    -- \
    --pruning archive \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

If you're using MacOS, you can find all the code snippets [here](/snippets/text/full-node/macos-node/).

Once Docker pulls the necessary images, your full Moonbeam (or Moonriver) node will start, displaying lots of information, such as the chain specification, node name, role, genesis state, and more:

![Full Node Starting](/images/node-operators/networks/full-node/full-node-docker-1.png)

!!! note
    If you want to run an RPC endpoint, to connect polkadot.js.org, or to run your own application, use the flags `--unsafe-rpc-external` and/or `--unsafe-ws-external` to run the full node with external access to the RPC ports.  More details are available by running `moonbeam --help`.  

!!! note
    You can specify a custom Prometheus port with the `--prometheus-port XXXX` flag (replacing `XXXX` with the actual port number). This is possible for both the parachain and embedded relay chain.


```
docker run -p {{ networks.relay_chain.p2p }}:{{ networks.relay_chain.p2p }} -p {{ networks.parachain.p2p }}:{{ networks.parachain.p2p }} -p {{ networks.parachain.rpc }}:{{ networks.parachain.rpc }} -p {{ networks.parachain.ws }}:{{ networks.parachain.ws }} #rest of code goes here
```

During the syncing process, you will see messages from both the embedded relay chain and the parachain (without a tag). These messages display a target block (live network state) and a best block (local node synced state).

![Full Node Starting](/images/node-operators/networks/full-node/full-node-docker-2.png)

!!! note
    It will take a few days to completely sync the embedded Kusama relay chain. Make sure that your system meets the [requirements](#requirements). 

If you followed the installation instructions for Moonbase Alpha, once synced, you will have a node of the Moonbase Alpha TestNet running locally!

If you followed the installation instructions for Moonriver, once synced, you will be connected to peers and see blocks being produced on the Moonriver network! Note that in this case you need to also sync to the Kusama relay chain, which might take a few days.

## Updating the Client {: #updating-the-client } 

As Moonbeam development continues, it will sometimes be necessary to upgrade your node software. Node operators will be notified on our [Discord channel](https://discord.gg/PfpUATX) when upgrades are available and whether they are necessary (some client upgrades are optional). The upgrade process is straightforward and is the same for a full node or collator.

First, stop the docker container:

```
sudo docker stop `CONTAINER_ID`
```

Then, install the new version by repeating the steps described before, making sure that you are using the latest tag available. After updating, you can start the service again.

### Purging the Chain {: #purging-the-chain } 

On an as-needed basis, Moonbase Alpha might be purged and reset. If a purge is required, node operators will be notified in advance (via our [Discord channel](https://discord.gg/PfpUATX)). You can also purge your node if your individual data directory becomes corrupted.

You'll first need to stop the Docker container:

```
  sudo docker stop `CONTAINER_ID`
```

If you did not use the `-v` flag to specify a local directory for storing your chain data when you spun up your node, then the data folder is related to the Docker container itself. Therefore, removing the Docker container will remove the chain data.

If you did spin up your node with the `-v` flag, you will need to purge the specified directory. To purge your parachain and relay chain data, you can run the following command:

=== "Moonbase Alpha"

    ```
    sudo rm -rf {{ networks.moonbase.node_directory }}/*
    ```

=== "Moonriver"

    ```
    sudo rm -rf {{ networks.moonriver.node_directory }}/*
    ```

To only remove the parachain data for a specific chain, you can run:

=== "Moonbase Alpha"

    ```
    sudo rm -rf {{ networks.moonbase.node_directory }}/chains/*
    ```

=== "Moonriver"

    ```
    sudo rm -rf {{ networks.moonriver.node_directory }}/chains/*
    ```

Similarly, to only remove the relay chain data, you can run:

=== "Moonbase Alpha"

    ```
    sudo rm -rf {{ networks.moonbase.node_directory }}/polkadot/*
    ```

=== "Moonriver"

    ```
    sudo rm -rf {{ networks.moonriver.node_directory }}/polkadot/*
    ```

Now that your chain data has been purged, you can start a new node with a fresh data directory. You can install the newest version by repeating the steps described before, making sure you are using the latest tag available.