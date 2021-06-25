---
title: Run a Node on Moonriver
description: How to run a full Parachain node for the Moonbeam Network to have your RPC Endpoint or produce blocks
---

# Run a Node on Moonriver

![Full Node Moonriver Banner](/images/fullnode/fullnode-banner-moonriver.png)

## Introduction

Running a full node on a Moonbeam-based network allows you to connect to the network, sync with a bootnode, obtain local access to RPC endpoints, author blocks on the parachain, and more.

There are multiple deployments of Moonbeam, including the Moonbase Alpha TestNet, right around the corner will be Moonriver on Kusama, and eventually there will be Moonbeam on Polkadot. Here's how these environments are named and their corresponding [chain specification file](https://substrate.dev/docs/en/knowledgebase/integrate/chain-spec) names:

|    Network     |     | Hosted By |     |   Chain Name    |
| :------------: | :-: | :-------: | :-: | :-------------: |
| Moonbase Alpha |     | PureStake |     |    alphanet     |
|   Moonriver    |     |  Kusama   |     |    moonriver    |
|    Moonbeam    |     | Polkadot  |     | _not available_ |

Installation instructions and the minimum specs recommended for running a node vary based on which deployment of Moonbeam you are connecting to. This guide will show you how to run a full node and collator node on the Moonriver network. After installation is complete and your node has been synced, you will connect to peers, but until Moonriver wins an auction slot, blocks will not be produced. You will have to sync the entire embedded Kusama relay chain, and that could take a few days.

This guide is meant for people with experience running [Substrate](https://substrate.dev/) based chains. Running a parachain is similar to running a Substrate node with a few differences. A Substrate parachain node will run two processes: one to sync the relay chain and one to sync the parachain. As such, many things are doubled, for example, the database directory, the ports used, the log lines, and more.

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

## Requirements

For our Kusama MainNet deployment, Moonriver, disk requirements will be higher as the network grows. 

|  Component   |     | Requirement                                                                                                                |
| :----------: | :-: | :------------------------------------------------------------------------------------------------------------------------- |
|   **CPU**    |     | 8 Cores (Fastest per core speed)                                                                      |
|   **RAM**    |     | 16 GB                                                                         |
|   **SSD**    |     | 300 GB (to start)                                                                              |
| **Firewall** |     | P2P port must be open to incoming traffic:<br>&nbsp; &nbsp; - Source: Any<br>&nbsp; &nbsp; - Destination: 30333, 30334 TCP |

## Installation Instructions - Docker

A Moonbeam node can be spun up quickly using Docker. For more information on installing Docker, please visit [this page](https://docs.docker.com/get-docker/). At the time of writing, the Docker version used was 19.03.6. When connecting to Moonriver on Kusama, it will take a few days to completely sync the embedded Kusama relay chain. Make sure that your system meets the [requirements](#requirements). 

Create a local directory to store the chain data:

```
mkdir {{ networks.moonriver.node_directory }}
```

Set the necessary permissions either for a specific or current user (replace `DOCKER_USER` for the actual user that will run the `docker` command):

```
# chown to a specific user
chown DOCKER_USER {{ networks.moonriver.node_directory }}

# chown to current user
sudo chown -R $(id -u):$(id -g) {{ networks.moonriver.node_directory }}
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
    docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonriver.parachain_docker_tag }} \
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

=== "MacOS"
    ```
    docker run -p {{ networks.parachain.rpc }}:{{ networks.parachain.rpc }} -p {{ networks.parachain.ws }}:{{ networks.parachain.ws }} -v "{{ networks.moonriver.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonriver.parachain_docker_tag }} \
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

=== "Ubuntu"
    ```
    docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonriver.parachain_docker_tag }} \
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

=== "MacOS"
    ```
    docker run -p {{ networks.parachain.rpc }}:{{ networks.parachain.rpc }} -p {{ networks.parachain.ws }}:{{ networks.parachain.ws }} -v "{{ networks.moonriver.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonriver.parachain_docker_tag }} \
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

Once Docker pulls the necessary images, your full Moonriver node will start, displaying lots of information, such as the chain specification, node name, role, genesis state, and more. The following output is from spinning up a full node on Moonbase Alpha:

![Full Node Starting](/images/fullnode/fullnode-docker1.png)   /// REPLACE SCREENSHOTS ///

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

!!! note
    It will take a few days to completely sync the embedded Kusama relay chain. Make sure that your system meets the [requirements](#requirements). 

Once synced, you will be connected to peers, but blocks will not be produced until Moonriver secures a parachain lease.

## Installation Instructions - Binary

This section goes through the process of compiling the binary and running a Moonbeam full node as a systemd service. The following steps were tested on an Ubuntu 18.04 installation. Moonriver may work with other Linux flavors, but Ubuntu is currently the only tested version.

### Compiling the Binary

The following commands will build the latest release of the Moonbeam parachain.

First, let's start by cloning the Moonbeam repo.

```
git clone https://github.com/PureStake/moonbeam
cd moonbeam
```

Let's check out the latest release  :

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
adduser moonriver_service --system --no-create-home
```

Next, create a directory to store the binary and data and set the necessary permissions:

```
mkdir {{ networks.moonriver.node_directory }}
chown moonriver_service {{ networks.moonriver.node_directory }}
```

!!! note
    Make sure you set the ownership and permissions accordingly for the local directory that stores the chain data.

Now, copy the binary built in the last section to the created folder:

```
cp ./target/release/{{ networks.moonriver.binary_name }} {{ networks.moonriver.node_directory }}
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

=== "Collator"
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

## Telemetry

To enable your Moonriver node's telemetry server, you can follow [this tutorial](/node-operators/networks/telemetry/). // TODO: update telemetry tutorial

Running telemetry on a full node is not necessary. However, it is a requirement to do so for collators.

Also, you can see current Moonriver telemetry information visiting [this link](https://telemetry.polkadot.io/#list/Moonriver).

## Logs and Troubleshooting

You will see logs from both the relay chain as well as the parachain. The relay chain will be prefixed by `[Relaychain]`, while the parachain has no prefix.

### P2P Ports Not Open

If you don't see an `Imported` message (without the `[Relaychain]` tag), you need to check the P2P port configuration. P2P port must be open to incoming traffic.

### In Sync

Both chains must be in sync at all times, and you should see either `Imported` or `Idle` messages and have connected peers.

