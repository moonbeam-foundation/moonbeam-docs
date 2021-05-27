---
title: Run a Node
description: How to run a full Parachain node for the Moonbeam Network to have your RPC Endpoint or produce blocks
---

# Run a Node on Moonbeam

![Full Node Moonbeam Banner](/images/fullnode/fullnode-banner.png)

## Introduction

With the release of Moonbase Alpha v6, you can spin up a node that connects to the Moonbase Alpha TestNet, syncs with a bootnode, provides local access your RPC endpoints, and even authors blocks on the parachain.

In our TestNet, the relay chain is hosted and run by PureStake. But as development progresses, there will also be deployments in Kusama and then Polkadot. Here's how these upcoming environments will be named and their corresponding [chain specification files](https://substrate.dev/docs/en/knowledgebase/integrate/chain-spec) name:

|    Network     |     | Hosted By |     |   Chain Name    |
| :------------: | :-: | :-------: | :-: | :-------------: |
| Moonbase Alpha |     | PureStake |     |    alphanet     |
|   Moonriver    |     |  Kusama   |     | _not available_ |
|    Moonbeam    |     | Polkadot  |     | _not available_ |

This guide is meant for people with experience running [Substrate](https://substrate.dev/) based chains. Running a parachain is similar to running a Substrate node with a few differences. A Substrate parachain node will run two processes: one to sync the relay chain and one to sync the parachain. As such, many things are doubled, for example, the database directory, the ports used, the log lines, and more.

!!! note
    Moonbase Alpha is still considered an Alphanet, and as such _will not_ have 100% uptime. The parachain _will_ be purged from time to time. During the development of your application, make sure you implement a method to redeploy your contracts and accounts to a fresh parachain quickly. Chain purges will be announced via our [Discord channel](https://discord.gg/PfpUATX) at least 24 hours in advance.

## Requirements

The minimum specs recommended to run a node are shown in the following table. For our Kusama and Polkadot MainNet deployments, disk requirements will be higher as the network grows.

|  Component   |     | Requirement                                                                                                                |
| :----------: | :-: | :------------------------------------------------------------------------------------------------------------------------- |
|   **CPU**    |     | 8 Cores (Fastest per core speed)                                                                      |
|   **RAM**    |     | 16 GB                                                                         |
|   **SSD**    |     | 50 GB (to start in our TestNet)                                                                                            |
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

A Moonbase Alpha node can be spun up quickly using Docker. For more information on installing Docker, please visit [this page](https://docs.docker.com/get-docker/). At the time of writing, the Docker version used was 19.03.6.

First, create a local directory to store the chain data:

```
mkdir {{ networks.moonbase.node_directory }}
```

Next, set the necessary permissions either for a specific or current user (replace `DOCKER_USER` for the actual user that will run the `docker` command):

```
# chown to a specific user
chown DOCKER_USER {{ networks.moonbase.node_directory }}

# chown to current user
sudo chown -R $(id -u):$(id -g) {{ networks.moonbase.node_directory }}
```

!!! note
    Make sure you set the ownership and permissions accordingly for the local directory that stores the chain data.

Now, execute the docker run command. Note that you have to:

 - Replace `YOUR-NODE-NAME` in two different places.

!!! note
    If you are setting up a collator node, make sure to follow the code snippets for "Collator".

### Full Node

=== "Ubuntu"
    ```
    docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonbase.parachain_docker_tag }} \
    --base-path=/data \
    --chain alphanet \
    --name="YOUR-NODE-NAME" \
    --execution wasm \
    --wasm-execution compiled \
    --pruning archive \
    --state-cache-size 1 \
    -- \
    --pruning archive \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

=== "MacOS"
    ```
    docker run -p {{ networks.parachain.rpc }}:{{ networks.parachain.rpc }} -p {{ networks.parachain.ws }}:{{ networks.parachain.ws }} -v "{{ networks.moonbase.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonbase.parachain_docker_tag }} \
    --base-path=/data \
    --chain alphanet \
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

=== "Ubuntu"
    ```
    docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonbase.parachain_docker_tag }} \
    --base-path=/data \
    --chain alphanet \
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

=== "MacOS"
    ```
    docker run -p {{ networks.parachain.rpc }}:{{ networks.parachain.rpc }} -p {{ networks.parachain.ws }}:{{ networks.parachain.ws }} -v "{{ networks.moonbase.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonbase.parachain_docker_tag }} \
    --base-path=/data \
    --chain alphanet \
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

Once Docker pulls the necessary images, your Moonbase Alpha full node will start, displaying lots of information, such as the chain specification, node name, role, genesis state, and more:

![Full Node Starting](/images/fullnode/fullnode-docker1.png)

!!! note
    If you want to run an RPC endpoint, to connect polkadot.js.org, or to run your own application, use the flags `--unsafe-rpc-external` and/or `--unsafe-ws-external` to run the full node with external access to the RPC ports.  More details are available by running `moonbeam --help`.  

!!! note
    If you are having issues with the default telemetry, you can add the flag `--no-telemetry` to run the full node without telemetry activated.

!!! note
    You can specify a custom Prometheus port with the `--prometheus-port XXXX` flag (replacing `XXXX` with the actual port number). This is possible for both the parachain and embedded relay chain.

The command above will enable all exposed ports required for basic operation, including the P2P, and Prometheus (telemetry) ports. This command is compatible to use with the Gantree Node Watchdog telemetry. If you want to expose specific ports, enable those on the Docker run command line as shown below. However, doing so will block the Gantree Node Watchdog (telemetry) container from accessing the moonbeam container, so don't do this when running a collator unless you understand [docker networking](https://docs.docker.com/network/).

```
docker run -p {{ networks.relay_chain.p2p }}:{{ networks.relay_chain.p2p }} -p {{ networks.parachain.p2p }}:{{ networks.parachain.p2p }} -p {{ networks.parachain.rpc }}:{{ networks.parachain.rpc }} -p {{ networks.parachain.ws }}:{{ networks.parachain.ws }} #rest of code goes here
```

During the syncing process, you will see messages from both the embedded relay chain and the parachain (without a tag). These messages display a target block (TestNet) and a best block (local node synced state).

![Full Node Starting](/images/fullnode/fullnode-docker2.png)

Once synced, you have a node of the Moonbase Alpha TestNet running locally!

## Installation Instructions - Binary

This section goes through the process of compiling the binary and running a Moonbeam full node as a systemd service. The following steps were tested on an Ubuntu 18.04 installation. Moonbase Alpha may work with other Linux flavors, but Ubuntu is currently the only tested version.

### Compiling the Binary

The following commands will build the latest release of the Moonbeam parachain.

First, let's start by cloning the moonbeam repo.

```
git clone https://github.com/PureStake/moonbeam
cd moonbeam
```

Let's check out the latest release:

```
git checkout tags/$(git tag | tail -1)
```

Next, install Substrate and all its prerequisites, including Rust, by executing:

```
--8<-- 'code/setting-up-node/substrate.md'
```

Lastly, build parachain binary:

```
cargo build --release
```

![Compiling Binary](/images/fullnode/fullnode-binary1.png)

If a _cargo not found error_ shows up in the terminal, manually add Rust to your system path or restart your system:

```
--8<-- 'code/setting-up-node/cargoerror.md'
```

### Running the Systemd Service

The following commands will set up everything regarding running the service.

First, let's create a service account to run the service:

```
adduser moonbase_service --system --no-create-home
```

Next, create a directory to store the binary and data and set the necessary permissions:

```
mkdir {{ networks.moonbase.node_directory }}
chown moonbase_service {{ networks.moonbase.node_directory }}
```

!!! note
    Make sure you set the ownership and permissions accordingly for the local directory that stores the chain data.

Now, copy the binary built in the last section to the created folder:

```
cp ./target/release/{{ networks.moonbase.binary_name }} {{ networks.moonbase.node_directory }}
```

The next step is to create the systemd configuration file. Note that you have to:

 - Replace `YOUR-NODE-NAME` in two different places
 - Double-check that the binary is in the proper path as described below (_ExecStart_)
 - Double-check the base path if you've used a different directory
 - Name the file `/etc/systemd/system/moonbeam.service`

!!! note
    If you are setting up a collator node, make sure to follow the code snippets for "Collator".

=== "Full Node"
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
         --chain alphanet \
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

=== "Collator"
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
         --chain alphanet \
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
    If you are having issues with the default telemetry, you can add the flag `--no-telemetry` to run the full node without telemetry activated.

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

![Service Status](/images/fullnode/fullnode-binary2.png)

You can also check the logs by executing:

```
journalctl -f -u moonbeam.service
```

![Service Logs](/images/fullnode/fullnode-binary3.png)

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

To enable your Moonbase Alpha node's telemetry server, you can follow [this tutorial](/node-operators/networks/telemetry/).

Running telemetry on a full node is not necessary. However, it is a requirement to do so for collators.

Also, you can see current Moonbase Alpha telemetry information visiting [this link](https://telemetry.polkadot.io/#list/Moonbase%20Alpha).

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

