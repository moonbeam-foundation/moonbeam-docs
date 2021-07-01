---
title: Telemetry
description: How to run telemetry for a full Parachain node for the Moonbeam Network
---

# Telemetry for a Full Node

![Telemetry Moonbeam Banner](/images/fullnode/telemetry-banner.png)

## Introduction

Since Moonbase Alpha v6, and the recent launch of Moonriver, you can spin up a node that connects to the Moonbase Alpha TestNet or Moonriver on Kusama. You can check those steps in [this tutorial](/node-operators/networks/full-node/).

This guide will provide the necessary steps to enable the telemetry server for your Moonbeam-based node.

!!! note
    The steps described in this guide are for a telemetry instance different than the standard Polkadot telemetry enabled by default (you can run nodes with no telemetry by using the `--no-telemetry` flag). The steps described in this guide are mandatory only for collator nodes.

## Telemetry Exporter Summary

Moonbeam will run a telemetry server that collects Prometheus metrics from all the Moonbeam parachain nodes on the network. Running this will be a great help to us during our development phase.  

The metrics exporter can run either as a Kubernetes sidecar, or as a local binary if you are running a VM. It will push data out to our servers, so you do not have to enable any incoming ports for this service.

We are using a service called [Gantree Node Watchdog](https://github.com/gantree-io/gantree-node-watchdog) to upload telemetry automatically.  Once you enable telemetry, you can also access a Prometheus/Grafana server from the [Gantree App](https://app.gantree.io/).  There are detailed instructions on the GitHub repository. If you need more info, here is a quick start. 

For now, we need to run two node watchdogs, one for the parachain and one for the relay chain.  This will be updated in a future release. 

For help, contact our [Discord server](https://discord.gg/FQXm74UQ7V) or the [Gantree Discord](https://discord.gg/N95McPjHZ2). 
 
## Checking Prerequisites

Before following this tutorial, you need to:

 1. Log in to [https://app.gantree.io](https://app.gantree.io) and create an account.  Navigate to API keys and copy your API key. 
 2. Request a PCK key in our [Discord server](https://discord.gg/FQXm74UQ7V)


 You can use the same PCK key for all of our Moonbeam-based networks, which currently includes Moonbase Alpha and Moonriver.
   
## Telemetry Exporter with Docker

We will run two instances of the Gantree node watchdog using Docker: one for the parachain and one for the relay chain.  

### Required Configuration Information

- GANTREE_NODE_WATCHDOG_API_KEY
- GANTREE_NODE_WATCHDOG_PROJECT_ID
- GANTREE_NODE_WATCHDOG_CLIENT_ID
- GANTREE_NODE_WATCHDOG_PCKRC
- GANTREE_NODE_WATCHDOG_METRICS_HOST

### Instructions

First, clone the instance monitoring client repository and build the docker image:

```
git clone https://github.com/gantree-io/gantree-node-watchdog
cd gantree-node-watchdog
# checkout latest release
git checkout tags/$(git tag | tail -1)
docker build .  
# get the IMAGE-NAME for use below
docker images
```

Run the docker container (parachain Gantree node watchdog). Note that you need to replace the following fields:

  - `IMAGE-NAME` with the one fetched in the previous step
  - `YOUR-API-KEY` with the one provided by [https://app.gantree.io](https://app.gantree.io)
  - `YOUR-SERVER-NAME`
  - `YOUR-PCK-KEY` with the one requested in our Discord server (you can use the same one for all Moonbeam-based networks).

The `PROJECT_ID` will always be set to `moonbeam`, regardless of what network you are connected to. The `CLIENT_ID` should contain your company name so we can easily identify you on the Prometheus/Grafana dashboard.

```
docker run -it --network="host" \
-e GANTREE_NODE_WATCHDOG_API_KEY="YOUR-API-KEY" \
-e GANTREE_NODE_WATCHDOG_PROJECT_ID="moonbeam" \
-e GANTREE_NODE_WATCHDOG_CLIENT_ID="YOUR-SERVER-NAME-parachain" \
-e GANTREE_NODE_WATCHDOG_PCKRC="YOUR-PCK-KEY" \
-e GANTREE_NODE_WATCHDOG_METRICS_HOST="http://127.0.0.1:9615" \
--name gantree_watchdog_parachain IMAGE-NAME
```

Now, we need to run the relay Gantree node watchdog. Note that you need to replace the same information as in the previous step.

```
docker run -it --network="host" \
-e GANTREE_NODE_WATCHDOG_API_KEY="YOUR-API-KEY" \
-e GANTREE_NODE_WATCHDOG_PROJECT_ID="moonbeam" \
-e GANTREE_NODE_WATCHDOG_CLIENT_ID="YOUR-SERVER-NAME-relay" \
-e GANTREE_NODE_WATCHDOG_PCKRC="YOUR-PCK-KEY" \
-e GANTREE_NODE_WATCHDOG_METRICS_HOST="http://127.0.0.1:9616" \
--name gantree_watchdog_relay IMAGE-NAME
```

You should see "waiting for provisioning" in the logs. If it is your first time running Gantree, it will wait until you log back into the portal and click "provision dashboard" to switch to "provisioning". This switch can take a few minutes. Once it's complete, you can log into the [https://app.gantree.io](https://app.gantree.io) and select networks. You will see a `View Monitoring Dashboard` link to your custom Prometheus / Grafana dashboard which you can customize to your needs.  

Once things are working well, you can update the commands to run in daemon mode.  Remove `-it` and add `-d` to the command above.  

## Telemetry Exporter with Systemd

We will run two instances of the Gantree node watchdog: one for the parachain and one for the relay chain.  

### Required Configuration Information

- GANTREE_NODE_WATCHDOG_API_KEY
- GANTREE_NODE_WATCHDOG_PROJECT_ID
- GANTREE_NODE_WATCHDOG_CLIENT_ID
- GANTREE_NODE_WATCHDOG_PCKRC
- GANTREE_NODE_WATCHDOG_METRICS_HOST

### Instructions

First, we need to download the Gantree node watchdog binary from the [release page](https://github.com/gantree-io/gantree-node-watchdog/releases), and extract it to a folder, for example, `/usr/local/bin`.

Next, let's create two folders for the configuration files:

```
mkdir -p /var/lib/gantree/parachain
mkdir -p /var/lib/gantree/relay
```

Now, we need to generate the configuration files, place each in the folders created in the previous step. Note that you need to replace the following fields:

  - `YOUR-API-KEY` with the one provided by [https://app.gantree.io](https://app.gantree.io)
  - `YOUR-SERVER-NAME`
  - `YOUR-PCK-KEY` with the one requested in our Discord server

The `project_id` will always be set to `moonbeam`, regardless of what network you are connected to. The `client_id` should contain your company name so we can easily identify you on the Prometheus/Grafana dashboard.

Parachain:

```
# Contents of /var/lib/gantree/parachain/.gnw_config.json
{
  "api_key": "YOUR-API-KEY",
  "project_id": "moonbeam",
  "client_id": "YOUR-SERVER-NAME-parachain",
  "pckrc": "YOUR-PCK-KEY",
  "metrics_host": "http://127.0.0.1:9615"
}
```

Embedded relay chain:

```
# Contents of /var/lib/gantree/relay/.gnw_config.json
{
  "api_key": "YOUR-API-KEY",
  "project_id": "moonbeam",
  "client_id": "YOUR-SERVER-NAME-relay",
  "pckrc": "YOUR-PCK-KEY",
  "metrics_host": "http://127.0.0.1:9616"
}
```

The next step is to generate your systemd configuration file.

Parachain:

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

Embedded relay chain:

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

We are almost there! Now, let's enable and start the systemd services, monitor logs for errors:

```
sudo systemctl enable gantree-parachain
sudo systemctl start gantree-parachain && journalctl -f -u gantree-parachain

sudo systemctl enable gantree-relay
sudo systemctl start gantree-relay && journalctl -f -u gantree-relay
```

You should see waiting for provisioning in the logs.  Once it's complete, you can log into the [https://app.gantree.io](https://app.gantree.io) and select networks. You will see a `View Monitoring Dashboard` link to your custom Prometheus / Grafana dashboard which you can customize to your needs.  
