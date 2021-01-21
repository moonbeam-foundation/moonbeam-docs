---
title: Full Node
description: How to run a full Parachain node for the Moonbeam Network to have your own RPC Endpoint
---

# Run a Full Node on Moonbeam

![Full Node Moonbeam Banner](/images/fullnode/fullnode-banner.png)

## Introduction

With the {{ networks.moonbase.version }} release of Moonbase Alpha, you can spin up a full node that connects to the Moonbase Alpha TestNet, syncs with a bootnode, and provides local access your own RPC endpoints. 

In our TestNet, the relay chain is hosted and ran by PureStake. But as development progresses, there will be deployments as well in Kusama and then Polkadot.  Here's how we will name these upcoming environments and their corresponding [chain specification files](https://substrate.dev/docs/en/knowledgebase/integrate/chain-spec) key: 

|      Network      |   |     Hosted By    |   |   Spec File   |
|:-----------------:|:-:|:----------------:|:-:|:-------------:|
|   Moonbase Alpha  |   |     PureStake    |   |    alphanet   |
|      Moonriver    |   |       Kusama     |   |_not available_|
|      Moonbase     |   |      Polkadot    |   |_not available_|

This guide is targeted toward someone with experience running [Substrate](https://substrate.dev/) based chains.  Running a parachain is similar to running a Substrate node, with a few differences. A Substrate parachain node will run two processes, one to sync the relay chain and one to sync the parachain.  As such, many things are doubled, for example, the data directory, the ports used, the log lines, among others.

!!! note 
    Moonbase is still considered an Alphanet, and as such *will not* have 100% uptime.  We *will* be purging the parachain from time to time. During the development of your application, make sure you implement a method to redeploy your contracts and accounts to a fresh parachain quickly. We will announce when a chain purge will take place via our [Discord channel](https://discord.gg/PfpUATX) at least 24 hours in advance.


## Requirements

The minimum specs recommended for a full node is shown in the following table. For our Kusama and Polkadot MainNet deployments, disk requirements will be higher as the network grows.

| Component  |   |                     Requirement                          |
|:----------:|:-:|:---------------------------------------------------------|
|   **CPU**  |   | 8 Cores (early development phase - not optimized yet)    |
|   **RAM**  |   | 16 GB (early development phase - not optimized yet)      |
|   **SSD**  |   | 50 GB (to start in our TestNet)                          |
|**Firewall**|   | P2P port must be open to incoming traffic:<br>&nbsp; &nbsp; - Source: Any<br>&nbsp; &nbsp; - Destination: 30333, 30334 TCP             |

## Running Ports

As stated before, the parachain node will listen on multiple ports. The default Substrate ports are used in the relay chain, while the parachain will listen on the next higher port.

The only ports that need to be open for incoming traffic are those designated  for P2P

### Default ports for relay chain

|  Description |   |                Port                  |
|:------------:|:-:|:------------------------------------:|
|    **P2P**   |   | {{ networks.relay_chain.p2p }} (TCP) |
|    **RPC**   |   | {{ networks.relay_chain.rpc }}       |
|    **WS**    |   | {{ networks.relay_chain.ws }}        |
|**Prometheus**|   | {{ networks.relay_chain.prometheus }}|
 
### Default ports for a parachain full-node

|  Description |   |                Port                  |
|:------------:|:-:|:------------------------------------:|
|    **P2P**   |   | {{ networks.parachain.p2p }} (TCP)   |
|    **RPC**   |   | {{ networks.parachain.rpc }}         |
|    **WS**    |   | {{ networks.parachain.ws }}          |
|**Prometheus**|   | {{ networks.parachain.prometheus }}  |


## Installation Instructions - Docker

A Moonbase Alpha full node can be spun up quickly using Docker. For more information on installing Docker, please visit [this page](https://docs.docker.com/get-docker/). At the time of writing, the Docker version used was 19.03.13.

First, we need to create a local directory to store the chain data:

```
mkdir moonbase-alpha   
```
Now we can execute the docker run command. Note that you have to:

  - Replace `YOUR-NODE-NAME` in two different places
  - Replace `CHAIN-SPEC` for the specification file key associated with the network you want to connect to (for example, _alphanet_ to connect your full node to the Moonbase Alpha TestNet)

```
docker run -d -p 30333:30333 -p 30334:30334 -v moonbase-alpha:/data/ \
gcr.io/purestake-dev/moonbase-parachain-testnet:{{ networks.moonbase.parachain_docker_sha }} \
moonbase-alpha/moonbase-alphanet \
    --base-path=/data \
    --chain  \
    --name="YOUR-NODE-NAME" \
    --execution wasm \
    --wasm-execution compiled \
    -- \
    --name="YOUR-NODE-NAME (Embedded Relay)"
```

 You can verify the docker image with the following checksum `{{ networks.moonbase.parachain_docker_sha }}`.

!!! note 
    The checksum value will change from time to time. We will attempt to keep this documentation up to date, but it may not always be.  If you see logs about a mismatched sha, contact us via our [Discord channel](https://discord.gg/PfpUATX) for the latest `SHA` to use.

If you want to expose WS or RPC ports, enable those on the Docker run command line, for example:

```
docker run -d -p 30333:30333 -p 30334:30334 -p 9934:9934 -p 9945:9945 #rest of code goes here 
```

TODO -> Screenshot here

## Installation Instructions - Binary

In this section, we'll go through the process of compiling the binary and running a Moonbeam full node as a systemd service. The following steps were tested on an Ubuntu 18.04 installation. Moonbase Alpha may work with other flavors of Linux, but Ubuntu is currently the only tested version.  

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

Next, install Substrate and all its prerequisites (including rust), by executing:

```
--8<-- 'setting-up-local/substrate.md'
```

Now, we need to make some checks (correct version of rust nigthly) with the initialization script:

```
--8<-- 'setting-up-local/initscript.md'
```

Lastly, let's build parachain binary:

```
cd ./node/parachain
cargo build --release
```

TODO -> Screenshot here

If a _cargo not found error_ shows up in the terminal, manually add Rust to your system path (or restart your system):

```
--8<-- 'setting-up-local/cargoerror.md'
```

### Running the Systemd Service

The following commands will set up everything regarding running the service.

First, let's create a service account to run the service:

```
adduser moonbase_service --system --no-create-home
```

Next, we need to create a directory to store the binary and data, and we'll also set the necessary permissions:

```
mkdir moonbase-alpha
chmod 0755 moonbase-alpha
chown moonbase_service moonbase-alpha
```

Now, we need to copy the binary we built in the last section to the folder you created:

```
cp ./moonbeam/target/release/moonbase-alphanet ./moonbase-alpha/
```

The next step is to create the systemd configuration file. Note that you have to:

  - Replace `YOUR-NODE-NAME` in two different places
  - Replace `CHAIN-SPEC` for the specification file key associated with the network you want to connect to (for example, _alphanet_ to connect your full node to the Moonbase Alpha TestNet)
  - Replace `FULL-PATH-HERE` for the path to the folder from the root directory. Double check that the binary is in the proper path as described below (_ExecStart_)
  - Double check the base path if you've used a different directory 
  - Name the file `/etc/systemd/system/moonbeam.service`

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
ExecStart=/FULL-PATH-HERE/moonbase-alpha/moonbase-parachain \
     --parachain-id 1000 \
     --no-telemetry \
     --port 30334 \
     --rpc-port 9934 \
     --ws-port 9945 \
     --pruning=archive \
     --unsafe-rpc-external \
     --unsafe-ws-external \
     --rpc-methods=Safe \
     --rpc-cors all \
     --log rpc=info \
     --base-path moonbase-alpha \
     --chain CHAIN-SPEC \
     --name "YOUR-NODE-NAME" \
     -- \
     --port 30333 \
     --rpc-port 9933 \
     --ws-port 9944 \
     --pruning=archive \
     --name="YOUR-NODE-NAME (Embedded Relay)"
     
[Install]
WantedBy=multi-user.target
```
We are almost there! We need to register and start the service by running:

```
systemctl enable moonbeam.service
systemctl start moonbeam.service
```

And lastly, verify the service is running:

```
systemctl status moonbeam.service
# and/or
journalctl -f -u moonbeam.service
```

TODO -> Screenshot here

## Telemetry Exporter

Moonbeam will run a telemetry server that collects Prometheus metrics from all the Moonbeam parachain nodes on the network. Running this will be a great help to us during our development phase.  

The metrics exporter can run either as a kubernetes sidecar, or as a local binary if you are running a VM. It will push data out to our servers, so you do not have to enable any incoming ports for this service.

We are using a service called [Gantree Node Watchdog](https://github.com/gantree-io/gantree-node-watchdog) to automatically upload telemetry.  Once you enable telemetry, you can also access a Prometheus/Grafana server from the [Gantree App] (https://app.gantree.io/).  There are detailed instructions on the github repo if you need more info, here is a quick start. 

For now we need to run two node watchdogs, one for the relay chain and one for the parachain.  This will be updated in a future release. 

For help, contact the Moonbeam Discord or the [Gantree Discord](https://discord.gg/4Ep2NKrz). 
 
### Gathering Information
1. Login to https://app.gantree.io and create an account.  Navigate to API keys and copy your API key. 
2. Request a PCK key in our [Discord channel](https://discord.gg/PfpUATX)
   
### Docker
We will run two instances of the gantree node watchdog; one for the relay chain and one for the parachain.  
Required Configuration Information
* GANTREE_NODE_WATCHDOG_API_KEY
* GANTREE_NODE_WATCHDOG_PROJECT_ID
* GANTREE_NODE_WATCHDOG_CLIENT_ID
* GANTREE_NODE_WATCHDOG_PCKRC
* GANTREE_NODE_WATCHDOG_METRICS_HOST

Instructions
1. Download or compile the docker image ([TODO]: no compiled image yet, but soon, need to update instructions below for "IMAGE-NAME", needs persistant storage for .gnw config file )
2. Run the relay Gantree node watchdog
  ```
  docker run -it --network="host" -e GANTREE_NODE_WATCHDOG_API_KEY="YOUR-API-KEY" -e GANTREE_NODE_WATCHDOG_PROJECT_ID="moonbase-alpha" -e GANTREE_NODE_WATCHDOG_CLIENT_ID="YOUR-SERVER-NAME-relay" -e GANTREE_NODE_WATCHDOG_PCKRC="YOUR-PCK-KEY" -e GANTREE_NODE_WATCHDOG_METRICS_HOST="http://172.0.0.1:9615"  --name gantree_watchdog_relay IMAGE-NAME
  ```
3. Run the parachain Gantree node watchdog
  ```
  docker run -it --network="host" -e GANTREE_NODE_WATCHDOG_API_KEY="YOUR-API-KEY" -e GANTREE_NODE_WATCHDOG_PROJECT_ID="moonbase-alpha" -e GANTREE_NODE_WATCHDOG_CLIENT_ID="YOUR-SERVER-NAME-parachain" -e GANTREE_NODE_WATCHDOG_PCKRC="YOUR-PCK-KEY" -e GANTREE_NODE_WATCHDOG_METRICS_HOST="http://172.0.0.1:9616" --name gantree_watchdog_relay IMAGE-NAME
  ```
4.  You should see waiting for provisioning in the logs.  Log into the https://app.gantree.io, select networks. Click the network and then `Provision Dashboard`.  This step may take a few minutes.  Once it completes, return to the network and you will see a `View Monitoring Dashboard` link to your custom Prometheus / Grafana dashboard. 
5.  Once things are workign well, you can update the commands to run in daemon mode.  

### Systemd
  
Instructions

1. Download the gantree node watchdog binary from the release page and extract to a folder.  e.g. `/usr/local/bin` 
2. Create 2 folders for the configuration files
  ```
  mkdir -p /var/lib/gantree/relay
  mkdir -p /var/lib/gantree/parachain
  ```
3. Generate your config files, place each in the folders created in the step above. 
  ```
  # Contents of /var/lib/gantree/relay/.gnw_config.json
  {
    "api_key": "YOUR-API-KEY",
    "project_id": "moonbase-alpha",
    "client_id": "YOUR-SERVER-NAME-relay",
    "pckrc": "YOUR-PCK-KEY",
    "metrics_host": "http://127.0.0.1:9615"
  }
  ```
  ```
  # Contents of /var/lib/gantree/parachain/.gnw_config.json
  {
    "api_key": "YOUR-API-KEY",
    "project_id": "moonbase-alpha",
    "client_id": "YOUR-SERVER-NAME-parachain",
    "pckrc": "YOUR-PCK-KEY",
    "metrics_host": "http://127.0.0.1:9616"
  }
  ```
4. Generate your systemd config
  ```
  # Contents of /etc/systemd/system/gantree-relay.service

  [Unit]
  Description=Gantree Node Watchdog Relay
  After=network.target

  [Service]
  WorkingDirectory=/var/lib/gantree/relay
  Type=simple
  Restart=always
  ExecStart=/usr/local/bin/gantree_node_watchdog

  [Install]
  WantedBy=multi-user.target
  ```
  ```
  # Contents of /etc/systemd/system/gantree-parachain.service

  [Unit]
  Description=Gantree Node Watchdog Parachain
  After=network.target

  [Service]
  WorkingDirectory=/var/lib/gantree/parachain
  Type=simple
  Restart=always
  ExecStart=/usr/local/bin/gantree_node_watchdog

  [Install]
  WantedBy=multi-user.target

  ```
5. Enable and start the systemd services, monitor logs for errors
  ```
  sudo systemctl enable gantree-relay
  sudo systemctl enable gantree-parachain
  sudo systemctl start gantree-relay && journalctl -f -u gantree-relay
  sudo systemctl start gantree-parachain && journalctl -f -u gantree-parachain
  ```
6. You should see the logs waiting for provisioning.  Log into the https://app.gantree.io, select networks. Click the network and then `Provision Dashboard`.  This step may take a few minutes.  Once it completes, return to the network and you will see a `View Monitoring Dashboard` link to your custom Prometheus / Grafana dashboard. 


## Logs and Troubleshooting

You will see logs from both the relay chain as well as the parachain.  The relay chain will be prefixed by `[Relaychain]` while the parachain has no prefix.

TODO -> Screenshot here

!!! note 
    There is currently a [bug in cumulus](https://github.com/paritytech/cumulus/issues/257) regarding naming issue.


### In Sync

Both chains must be in sync at all times, and you should see either `Imported` or `Idle` messages and have connected peers. 

TODO -> Screenshot here
(image - Relay_Parachain_Idle.png) 

### Mismatched SHA

The Moonbase Alpha TestNet is often upgraded. Consequently, you may see a mismatched `SHA` log line and have your node stall. This typically means you are running an older version and will need to upgrade.

TODO -> Screenshot here
(image - Mismatched_Sha.png) still need to take it 

We announce the upgrades (and corresponding chain purge) via our [Discord channel](https://discord.gg/PfpUATX), at least 24 hours in advance.

## Contact Us

If you have any feedback regarding running a full node or any other Moonbeam related topic, feel free to reach out through our official development [Discord server](https://discord.com/invite/PfpUATX).




