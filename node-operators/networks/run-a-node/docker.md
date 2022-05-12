---
title: Use Docker to Run a Node
description: How to run a full Parachain node so you can have your own RPC endpoint or produce blocks for the Moonbeam Network using Docker
---

# Run a Node on Moonbeam Using Docker

![Full Node Moonbeam Banner](/images/node-operators/networks/run-a-node/docker/docker-banner.png)

## Introduction {: #introduction } 

Running a full node on a Moonbeam-based network allows you to connect to the network, sync with a bootnode, obtain local access to RPC endpoints, author blocks on the parachain, and more.

## Installation Instructions {: #installation-instructions }

A Moonbeam node can be spun up quickly using Docker. For more information on installing Docker, please visit [this page](https://docs.docker.com/get-docker/){target=_blank}. At the time of writing, the Docker version used was 19.03.6. When connecting to Moonriver on Kusama or Moonbeam on Polkadot, it will take a few days to completely sync the embedded relay chain. Make sure that your system meets the [requirements](/node-operators/networks/run-a-node/overview#requirements){target=_blank}.

Create a local directory to store the chain data:

=== "Moonbeam"
    ```
    mkdir {{ networks.moonbeam.node_directory }}
    ```

=== "Moonriver"
    ```
    mkdir {{ networks.moonriver.node_directory }}
    ```

=== "Moonbase Alpha"
    ```
    mkdir {{ networks.moonbase.node_directory }}
    ```

Next, make sure you set the ownership and permissions accordingly for the local directory that stores the chain data. In this case, set the necessary permissions either for a specific or current user (replace `DOCKER_USER` for the actual user that will run the `docker` command):

=== "Moonbeam"
    ```
    # chown to a specific user
    chown DOCKER_USER {{ networks.moonbeam.node_directory }}

    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonbeam.node_directory }}
    ```

=== "Moonriver"
    ```
    # chown to a specific user
    chown DOCKER_USER {{ networks.moonriver.node_directory }}

    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonriver.node_directory }}
    ```

=== "Moonbase Alpha"
    ```
    # chown to a specific user
    chown DOCKER_USER {{ networks.moonbase.node_directory }}

    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonbase.node_directory }}
    ```

Now, execute the docker run command. If you are setting up a collator node, make sure to follow the code snippets for "Collator". Note that you have to:
 
 - Replace `YOUR-NODE-NAME` in two different places
 - Replace `<50% RAM in MB>` for 50% of the actual RAM your server has. For example, for 32 GB RAM, the value must be set to `16000`. The minimum value is `2000`, but it is below the recommended specs

### Full Node {: #full-node } 

=== "Moonbeam"
    ```
    docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
    --base-path=/data \
    --chain {{ networks.moonbeam.chain_spec }} \
    --name="YOUR-NODE-NAME" \
    --execution wasm \
    --wasm-execution compiled \
    --pruning archive \
    --state-cache-size 0 \
    --db-cache <50% RAM in MB> \
    -- \
    --execution wasm \
    --pruning 1000 \
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
    --state-cache-size 0 \
    --db-cache <50% RAM in MB> \
    -- \
    --execution wasm \
    --pruning 1000 \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

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
    --state-cache-size 0 \
    --db-cache <50% RAM in MB> \
    -- \
    --execution wasm \
    --pruning 1000 \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

### Collator {: #collator } 

=== "Moonbeam"
    ```
    docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
    --base-path=/data \
    --chain {{ networks.moonbeam.chain_spec }} \
    --name="YOUR-NODE-NAME" \
    --validator \
    --execution wasm \
    --wasm-execution compiled \
    --pruning archive \
    --state-cache-size 0 \
    --db-cache <50% RAM in MB> \
    -- \
    --execution wasm \
    --pruning 1000 \
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
    --state-cache-size 0 \
    --db-cache <50% RAM in MB> \
    -- \
    --execution wasm \
    --pruning 1000 \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```
    
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
    --state-cache-size 0 \
    --db-cache <50% RAM in MB> \
    -- \
    --execution wasm \
    --pruning 1000 \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

!!! note
    For an overview of the above flags, please refer to the [Flags](/node-operators/networks/run-a-node/flags){target=_blank} page of our documentation.

If you're using MacOS, there are adapted [code snippets](https://www.github.com/PureStake/moonbeam-docs-cn/blob/master/.snippets/text/full-node/macos-node.md){target=_blank} specific for MacOS which can be used instead.

Once Docker pulls the necessary images, your full Moonbeam (or Moonriver) node will start, displaying lots of information, such as the chain specification, node name, role, genesis state, and more:

![Full Node Starting](/images/node-operators/networks/run-a-node/docker/full-node-docker-1.png)

!!! note
    If you want to run an RPC endpoint, to connect Polkadot.js Apps, or to run your own application, use the flags `--unsafe-rpc-external` and/or `--unsafe-ws-external` to run the full node with external access to the RPC ports.  More details are available by running `moonbeam --help`. This is **not** recommended for Collators.  

!!! note
    You can specify a custom Prometheus port with the `--prometheus-port XXXX` flag (replacing `XXXX` with the actual port number). This is possible for both the parachain and embedded relay chain.


```
docker run -p {{ networks.relay_chain.p2p }}:{{ networks.relay_chain.p2p }} -p {{ networks.parachain.p2p }}:{{ networks.parachain.p2p }} -p {{ networks.parachain.rpc }}:{{ networks.parachain.rpc }} -p {{ networks.parachain.ws }}:{{ networks.parachain.ws }} #rest of code goes here
```

During the syncing process, you will see messages from both the embedded relay chain and the parachain (without a tag). These messages display a target block (live network state) and a best block (local node synced state).

![Full Node Starting](/images/node-operators/networks/run-a-node/docker/full-node-docker-2.png)

!!! note
    It may take a few days to completely sync the embedded relay chain. Make sure that your system meets the [requirements](/node-operators/networks/run-a-node/overview#requirements){target=_blank}. 

If you followed the installation instructions for Moonbase Alpha, once synced, you will have a node of the Moonbase Alpha TestNet running locally!

If you followed the installation instructions for Moonbeam/Moonriver, once synced, you will be connected to peers and see blocks being produced on the Moonbeam/Moonriver network! Note that in this case you need to also sync to the Polkadot/Kusama relay chain, which might take a few days.

## Update the Client {: #update-the-client } 

As Moonbeam development continues, it will sometimes be necessary to upgrade your node software. Node operators will be notified on our [Discord channel](https://discord.gg/PfpUATX){target=_blank} when upgrades are available and whether they are necessary (some client upgrades are optional). The upgrade process is straightforward and is the same for a full node or collator.

1. Stop the docker container:

    ```
    sudo docker stop `CONTAINER_ID`
    ```

2. Get the latest version of Moonbeam from the [Moonbeam GitHub Release](https://github.com/PureStake/moonbeam/releases/){target=_blank} page

3. Use the latest version to spin up your node. To do so, replace the version in the [Full Node](#full-node) or [Collator](#collator) command with the latest and run it

Once your node is running again, you should see logs in your terminal.

## Purge Your Node {: #purge-your-node } 

If you need a fresh instance of your Moonbeam node, you can purge your node by removing the associated data directory. 

You'll first need to stop the Docker container:

```
  sudo docker stop `CONTAINER_ID`
```

If you did not use the `-v` flag to specify a local directory for storing your chain data when you spun up your node, then the data folder is related to the Docker container itself. Therefore, removing the Docker container will remove the chain data.

If you did spin up your node with the `-v` flag, you will need to purge the specified directory. For example, for the suggested data directly, you can run the following command to purge your parachain and relay chain data:

=== "Moonbeam"
    ```
    sudo rm -rf {{ networks.moonbeam.node_directory }}/*
    ```

=== "Moonriver"
    ```
    sudo rm -rf {{ networks.moonriver.node_directory }}/*
    ```

=== "Moonbase Alpha"
    ```
    sudo rm -rf {{ networks.moonbase.node_directory }}/*
    ```


To only remove the parachain data for a specific chain, you can run:

=== "Moonbeam"
    ```
    sudo rm -rf {{ networks.moonbeam.node_directory }}/chains/*
    ```

=== "Moonriver"
    ```
    sudo rm -rf {{ networks.moonriver.node_directory }}/chains/*
    ```

=== "Moonbase Alpha"
    ```
    sudo rm -rf {{ networks.moonbase.node_directory }}/chains/*
    ```

Similarly, to only remove the relay chain data, you can run:

=== "Moonbeam"
    ```
    sudo rm -rf {{ networks.moonbeam.node_directory }}/polkadot/*
    ```

=== "Moonriver"
    ```
    sudo rm -rf {{ networks.moonriver.node_directory }}/polkadot/*
    ```

=== "Moonbase Alpha"
    ```
    sudo rm -rf {{ networks.moonbase.node_directory }}/polkadot/*
    ```

--8<-- 'text/purge-chain/post-purge.md'
