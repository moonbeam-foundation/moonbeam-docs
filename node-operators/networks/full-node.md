---
title: Run a Node
description: How to run a full Parachain node for the Moonbeam Network to have your RPC Endpoint or produce blocks
---

# Run a Node on Moonbeam

![Full Node Moonbeam Banner](/images/fullnode/fullnode-banner.png)

## Introduction

Running a full node on a Moonbeam-based network allows you to connect to the network, sync with a bootnode, obtain local access to RPC endpoints, author blocks on the parachain, and more.

There are multiple deployments of Moonbeam, including the Moonbase Alpha TestNet, Moonriver on Kusama, and eventually there will be Moonbeam on Polkadot. Here's how these environments are named and their corresponding [chain specification file](https://substrate.dev/docs/en/knowledgebase/integrate/chain-spec) names:

|    Network     |     | Hosted By |     |   Chain Name    |
| :------------: | :-: | :-------: | :-: | :-------------: |
| Moonbase Alpha |     | PureStake |     |    {{ networks.moonbase.chain_spec }}     |
|   Moonriver    |     |  Kusama   |     |    {{ networks.moonriver.chain_spec }}    |
|    Moonbeam    |     | Polkadot  |     | _not available_ |

This guide is meant for people with experience compiling [Substrate](https://substrate.dev/) based blockchain nodes. A parachain node is similar to a typical Substrate node, but there are some differences. A Substrate parachain node will is a bigger build because it contains code to run the parachain itself, as well as code to sync the relay chain, and facilitate communication between the two. As such, this build is quite large and may take over 30 min and require 32GB of memory.

!!! note
    Moonbase Alpha is still considered an Alphanet, and as such _will not_ have 100% uptime. The parachain _will_ be purged from time to time. During the development of your application, make sure you implement a method to redeploy your contracts and accounts to a fresh parachain quickly. Chain purges will be announced via our [Discord channel](https://discord.gg/PfpUATX) at least 24 hours in advance.

## Requirements

The minimum specs recommended to run a node are shown in the following table. For our Kusama and Polkadot MainNet deployments, disk requirements will be higher as the network grows.

=== "Moonbase Alpha"
    |  Component   |     | Requirement                                                                                                                |
    | :----------: | :-: | :------------------------------------------------------------------------------------------------------------------------- |
    |   **CPU**    |     | 8 Cores (Fastest per core speed)                                                                      |
    |   **RAM**    |     | 16 GB                                                                         |
    |   **SSD**    |     | 50 GB (to start)                                                                                            |
    | **Firewall** |     | P2P port must be open to incoming traffic:<br>&nbsp; &nbsp; - Source: Any<br>&nbsp; &nbsp; - Destination: 30333, 30334 TCP |

=== "Moonriver"
    |  Component   |     | Requirement                                                                                                                |
    | :----------: | :-: | :------------------------------------------------------------------------------------------------------------------------- |
    |   **CPU**    |     | 8 Cores (Fastest per core speed)                                                                      |
    |   **RAM**    |     | 16 GB                                                                         |
    |   **SSD**    |     | 300 GB (to start)                                                                              |
    | **Firewall** |     | P2P port must be open to incoming traffic:<br>&nbsp; &nbsp; - Source: Any<br>&nbsp; &nbsp; - Destination: 30333, 30334 TCP |


!!! note
    If you don't see an `Imported` message (without the `[Relaychain]` tag) when running a node, you might need to double-check your port configuration.

## Running Ports

As stated before, the relay/parachain nodes will listen on multiple ports. The default Substrate ports are used in the parachain, while the relay chain will listen on the next higher port.

The only ports that need to be open for incoming traffic are those designated for P2P.

### Default Ports for a Parachain Full-Node

|  Description   |     |                Port                 |
| :------------: | :-: | :---------------------------------: |
|    **P2P**     |     | {{ networks.parachain.p2p }} (TCP)  |
|    **RPC**     |     |    {{ networks.parachain.rpc }}     |
|     **WS**     |     |     {{ networks.parachain.ws }}     |
| **Prometheus** |     | {{ networks.parachain.prometheus }} |

### Default Ports of Embedded Relay Chain

|  Description   |     |                 Port                  |
| :------------: | :-: | :-----------------------------------: |
|    **P2P**     |     | {{ networks.relay_chain.p2p }} (TCP)  |
|    **RPC**     |     |    {{ networks.relay_chain.rpc }}     |
|     **WS**     |     |     {{ networks.relay_chain.ws }}     |
| **Prometheus** |     | {{ networks.relay_chain.prometheus }} |

## Installation Instructions - Docker

A Moonbeam node can be spun up quickly using Docker. For more information on installing Docker, please visit [this page](https://docs.docker.com/get-docker/). At the time of writing, the Docker version used was 19.03.6. When connecting to Moonriver on Kusama, it will take a few days to completely sync the embedded Kusama relay chain. Make sure that your system meets the [requirements](#requirements).

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

### Full Node

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

### Collator

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

![Full Node Starting](/images/fullnode/fullnode-docker1.png)

!!! note
    If you want to run an RPC endpoint, to connect polkadot.js.org, or to run your own application, use the flags `--unsafe-rpc-external` and/or `--unsafe-ws-external` to run the full node with external access to the RPC ports.  More details are available by running `moonbeam --help`.  

!!! note
    You can specify a custom Prometheus port with the `--prometheus-port XXXX` flag (replacing `XXXX` with the actual port number). This is possible for both the parachain and embedded relay chain.

The command above will enable all exposed ports required for basic operation, including the P2P, and Prometheus (telemetry) ports. This command is compatible to use with the Gantree Node Watchdog telemetry. If you want to expose specific ports, enable those on the Docker run command line as shown below. However, doing so will block the Gantree Node Watchdog (telemetry) container from accessing the moonbeam container, so don't do this when running a collator unless you understand [docker networking](https://docs.docker.com/network/).

```
docker run -p {{ networks.relay_chain.p2p }}:{{ networks.relay_chain.p2p }} -p {{ networks.parachain.p2p }}:{{ networks.parachain.p2p }} -p {{ networks.parachain.rpc }}:{{ networks.parachain.rpc }} -p {{ networks.parachain.ws }}:{{ networks.parachain.ws }} #rest of code goes here
```

During the syncing process, you will see messages from both the embedded relay chain and the parachain (without a tag). These messages display a target block (live network state) and a best block (local node synced state).

![Full Node Starting](/images/fullnode/fullnode-docker2.png)

!!! note
    It will take a few days to completely sync the embedded Kusama relay chain. Make sure that your system meets the [requirements](#requirements). 

If you followed the installation instructions for Moonbase Alpha, once synced, you will have a node of the Moonbase Alpha TestNet running locally!

If you followed the installation instructions for Moonriver, once synced, you will be connected to peers and see blocks being produced on the Moonriver network! Note that in this case you need to also sync to the Kusama relay chain, which might take a few days.

## Installation Instructions - Binary

This section goes through the process of using the release binary and running a Moonbeam full node as a systemd service. The following steps were tested on an Ubuntu 18.04 installation. Moonbeam may work with other Linux flavors, but Ubuntu is currently the only tested version.

To manually build the binaries yourself, check out the [Compile Moonbeam Binary](/node-operators/networks/compile-binary) guide.

### Use the Release Binary

There are a couple ways to get started with the Moonbeam binary. You can compile the binary yourself, but the whole process can take around 30 minutes to install the dependencies and build the binary. If you're interested in going this route, check out the [Compile the Binary](/) page of our documentation.

Or you can use the [release binary](https://github.com/PureStake/moonbeam/releases) to get started right away.

Use `wget` to grab the latest release binary:


=== "Moonbase Alpha"
    ```
    wget https://github.com/PureStake/moonbeam/releases/download/{{ networks.moonbase.parachain_release_tag }}/moonbeam
    ```

=== "Moonriver"
    ```
    wget https://github.com/PureStake/moonbeam/releases/download/{{ networks.moonriver.parachain_release_tag }}/moonbeam
    ``` 

To verify that you have downloaded the correct version, you can run `sha256sum moonbeam` in your terminal, you should receive the following output:

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.parachain_sha256sum }}
    ```

=== "Moonriver"
    ```
    {{ networks.moonriver.parachain_sha256sum }}
    ```

Once you've retrieved the binary, you can use it to run the systemd service.

### Running the Systemd Service

The following commands will set up everything regarding running the service.

First, let's create a service account to run the service:

=== "Moonbase Alpha"
    ```
    adduser moonbase_service --system --no-create-home
    ```

=== "Moonriver"
    ```
    adduser moonriver_service --system --no-create-home
    ```

Next, create a directory to store the binary and data. Make sure you set the ownership and permissions accordingly for the local directory that stores the chain data.:

=== "Moonbase Alpha"
    ```
    mkdir {{ networks.moonbase.node_directory }}
    chown moonbase_service {{ networks.moonbase.node_directory }}
    ```

=== "Moonriver"
    ```
    mkdir {{ networks.moonriver.node_directory }}
    chown moonriver_service {{ networks.moonriver.node_directory }}
    ```

Now, copy the binary built in the last section to the created folder. If you [compiled the binary](/node-operators/networks/compile-binary/) yourself, you'll need to copy the binary in the target directory (`./target/release/{{ networks.moonbase.binary_name }}`). Otherwise, copy the Moonbeam binary in the root:

=== "Moonbase Alpha"
    ```
    cp ./{{ networks.moonbase.binary_name }} {{ networks.moonbase.node_directory }}
    ```

=== "Moonriver"
    ```
    cp ./{{ networks.moonriver.binary_name }} {{ networks.moonriver.node_directory }}
    ```

The next step is to create the systemd configuration file. If you are setting up a collator node, make sure to follow the code snippets for "Collator". Note that you have to:

 - Replace `YOUR-NODE-NAME` in two different places
 - Double-check that the binary is in the proper path as described below (_ExecStart_)
 - Double-check the base path if you've used a different directory
 - Name the file `/etc/systemd/system/moonbeam.service`

#### Full Node

=== "Moonbase Alpha"
    ```
    [Unit]
    Description="Moonbase Alpha systemd service"
    After=network.target
    StartLimitIntervalSec=0

    [Service]
    Type=simple
    Restart=on-failure
    RestartSec=10
    User=moonbase_service
    SyslogIdentifier=moonbase
    SyslogFacility=local7
    KillSignal=SIGHUP
    ExecStart={{ networks.moonbase.node_directory }}/{{ networks.moonbase.binary_name }} \
         --port {{ networks.parachain.p2p }} \
         --rpc-port {{ networks.parachain.rpc }} \
         --ws-port {{ networks.parachain.ws }} \
         --pruning=archive \
         --state-cache-size 1 \
         --base-path {{ networks.moonbase.node_directory }} \
         --chain {{ networks.moonbase.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --pruning=archive \
         --name="YOUR-NODE-NAME (Embedded Relay)"

    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonriver"
    ```
    [Unit]
    Description="Moonriver systemd service"
    After=network.target
    StartLimitIntervalSec=0
    
    [Service]
    Type=simple
    Restart=on-failure
    RestartSec=10
    User=moonriver_service
    SyslogIdentifier=moonriver
    SyslogFacility=local7
    KillSignal=SIGHUP
    ExecStart={{ networks.moonriver.node_directory }}/{{ networks.moonriver.binary_name }} \
         --port {{ networks.parachain.p2p }} \
         --rpc-port {{ networks.parachain.rpc }} \
         --ws-port {{ networks.parachain.ws }} \
         --pruning=archive \
         --state-cache-size 1 \
         --base-path {{ networks.moonriver.node_directory }} \
         --chain {{ networks.moonriver.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --pruning=archive \
         --name="YOUR-NODE-NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```
#### Collator

=== "Moonbase Alpha"
    ```
    [Unit]
    Description="Moonbase Alpha systemd service"
    After=network.target
    StartLimitIntervalSec=0

    [Service]
    Type=simple
    Restart=on-failure
    RestartSec=10
    User=moonbase_service
    SyslogIdentifier=moonbase
    SyslogFacility=local7
    KillSignal=SIGHUP
    ExecStart={{ networks.moonbase.node_directory }}/{{ networks.moonbase.binary_name }} \
         --validator \
         --port {{ networks.parachain.p2p }} \
         --rpc-port {{ networks.parachain.rpc }} \
         --ws-port {{ networks.parachain.ws }} \
         --pruning=archive \
         --state-cache-size 1 \
         --base-path {{ networks.moonbase.node_directory }} \
         --chain {{ networks.moonbase.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --pruning=archive \
         --name="YOUR-NODE-NAME (Embedded Relay)"

    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonriver"
    ```
    [Unit]
    Description="Moonriver systemd service"
    After=network.target
    StartLimitIntervalSec=0

    [Service]
    Type=simple
    Restart=on-failure
    RestartSec=10
    User=moonriver_service
    SyslogIdentifier=moonriver
    SyslogFacility=local7
    KillSignal=SIGHUP
    ExecStart={{ networks.moonriver.node_directory }}/{{ networks.moonriver.binary_name }} \
         --validator \
         --port {{ networks.parachain.p2p }} \
         --rpc-port {{ networks.parachain.rpc }} \
         --ws-port {{ networks.parachain.ws }} \
         --pruning=archive \
         --state-cache-size 1 \
         --base-path {{ networks.moonriver.node_directory }} \
         --chain {{ networks.moonriver.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --port {{ networks.relay_chain.p2p }} \
         --rpc-port {{ networks.relay_chain.rpc }} \
         --ws-port {{ networks.relay_chain.ws }} \
         --pruning=archive \
         --name="YOUR-NODE-NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```

!!! note
    You can specify a custom Prometheus port with the `--promethues-port XXXX` flag (replacing `XXXX` with the actual port number). This is possible for both the parachain and embedded relay chain.

Almost there! Register and start the service by running:

```
systemctl enable moonbeam.service
systemctl start moonbeam.service
```

And lastly, verify the service is running:

```
systemctl status moonbeam.service
```

![Service Status](/images/fullnode/fullnode-binary1.png)

You can also check the logs by executing:

```
journalctl -f -u moonbeam.service
```

![Service Logs](/images/fullnode/fullnode-binary2.png)

## Advanced Flags and Options

--8<-- 'text/setting-up-node/advanced-flags.md'

## Updating the Client

As Moonbeam development continues, it will sometimes be necessary to upgrade your node software. Node operators will be notified on our [Discord channel](https://discord.gg/PfpUATX) when upgrades are available and whether they are necessary (some client upgrades are optional). The upgrade process is straightforward and is the same for a full node or collator.

First, stop the docker container or systemd service:

```
sudo docker stop `CONTAINER_ID`
# or
sudo systemctl stop moonbeam
```

Then, install the new version by repeating the steps described before, making sure that you are using the latest tag available. After updating, you can start the service again.

### Purging the Chain

Occasionally Moonbase Alpha might be purged and reset around major upgrades. As always, node operators will be notified in advance (via our [Discord channel](https://discord.gg/PfpUATX)) if this upgrade is accompanied by a purge. You can also purge your node if your individual data directory becomes corrupted.

To do so, first stop the docker container or systemd service:

```
sudo docker stop `CONTAINER_ID`
# or
sudo systemctl stop moonbeam
```

Next, remove the content of the folder where the chain data is stored (both for the parachain and relay chain):

```
sudo rm -rf {{ networks.moonbase.node_directory }}/*
```

Lastly, install the newest version by repeating the steps described before, making sure you are using the latest tag available. If so, you can start a new node with a fresh data directory.

## Telemetry

To enable your Moonbase Alpha or Moonriver node's telemetry server, you can follow [this tutorial](/node-operators/networks/telemetry/).

Running telemetry on a full node is not necessary. However, it is a requirement to do so for collators.

Also, you can check out current [Moonbase Alpha telemetry](https://telemetry.polkadot.io/#list/Moonbase%20Alpha) and [Moonriver telemetry](https://telemetry.polkadot.io/#list/Moonriver) data.

## Logs and Troubleshooting

You will see logs from both the relay chain as well as the parachain. The relay chain will be prefixed by `[Relaychain]`, while the parachain has no prefix.

### P2P Ports Not Open

If you don't see an `Imported` message (without the `[Relaychain]` tag), you need to check the P2P port configuration. P2P port must be open to incoming traffic.

### In Sync

Both chains must be in sync at all times, and you should see either `Imported` or `Idle` messages and have connected peers.

### Genesis Mismatching

The Moonbase Alpha TestNet is often upgraded. Consequently, you may see the following message:

```
DATE [Relaychain] Bootnode with peer id `ID` is on a different
chain (our genesis: GENESIS_ID theirs: OTHER_GENESIS_ID)
```

This typically means that you are running an older version and will need to upgrade.

We announce the upgrades (and corresponding chain purge) via our [Discord channel](https://discord.gg/PfpUATX) at least 24 hours in advance.

