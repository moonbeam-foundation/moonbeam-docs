---
title: Collator
description: How to run a Collator node on the Moonbeam Network
---

# Run a Collator on Moonbeam

![Full Node Moonbeam Banner](/images/fullnode/fullnode-banner.png)

## Introduction

With the release of Moonbase Alpha v6, you can spin up a collator that connects to the Moonbase Alpha TestNet, syncs with a bootnode, and provides local access your own RPC endpoints, and authors blocks on the parachain. 

In our TestNet, the relay chain is hosted and run by PureStake. But as development progresses, there will be deployments as well in Kusama and then Polkadot.  Here's how we will name these upcoming environments and their corresponding [chain specification files](https://substrate.dev/docs/en/knowledgebase/integrate/chain-spec) name: 

|      Network      |   |     Hosted By    |   |   Chain Name  |
|:-----------------:|:-:|:----------------:|:-:|:-------------:|
|   Moonbase Alpha  |   |     PureStake    |   |    alphanet   |
|      Moonriver    |   |       Kusama     |   |_not available_|
|      Moonbeam     |   |      Polkadot    |   |_not available_|

This guide is targeted toward someone with experience running [Substrate](https://substrate.dev/) based chains.  Running a parachain is similar to running a Substrate node, with a few differences. A Substrate parachain node will run two processes, one to sync the relay chain and one to sync the parachain.  As such, many things are doubled, for example, the database directory, the ports used, the log lines, among others.

!!! note 
    Moonbase is still considered an Alphanet, and as such *will not* have 100% uptime.  We *will* be purging the parachain from time to time. During the development of your application, make sure you implement a method to redeploy your contracts and accounts to a fresh parachain quickly. We will announce when a chain purge will take place via our [Discord channel](https://discord.gg/PfpUATX) at least 24 hours in advance.


## Requirements

The minimum specs recommended for a Collator is shown in the following table. For our Kusama and Polkadot MainNet deployments, disk requirements will be higher as the network grows.

| Component  |   |                     Requirement                          |
|:----------:|:-:|:---------------------------------------------------------|
|   **CPU**  |   | 8 Cores (early development phase - not optimized yet)    |
|   **RAM**  |   | 16 GB (early development phase - not optimized yet)      |
|   **SSD**  |   | 50 GB (to start in our TestNet)                          |
|**Firewall**|   | P2P port must be open to incoming traffic:<br>&nbsp; &nbsp; - Source: Any<br>&nbsp; &nbsp; - Destination: 30333, 30334 TCP             |

!!! note
    If you don't see an `Imported` message (without the `[Relaychain]` tag) when running the Collator, you might need to double-check your port configuration.

## Account and Staking Requirements
Similar to Polkadot validators, you need to create an account (although in this case it's an H160 account) and have nominated stake (DEV tokens) in order to collate.  The slots are currently limited, but may be increased over time.  

Validators need to have a minimum of {{ networks.moonbase.collator_min_stake }} DEV to be considered eligible to be a collator (i.e. get in the waiting pool).  After that the top {{ networks.moonbase.collator_slots }} collators by nominated stake will be the active set.  

Reach out to us on our [Discord channel](https://discord.gg/PfpUATX) if you are interested in becoming a collator. 


## Running Ports

As stated before, the parachain node will listen on multiple ports. The default Substrate ports are used in the parachain, while the relay chain will listen on the next higher port.

The only ports that need to be open for incoming traffic are those designated for P2P.

### Default ports for a parachain full-node

|  Description |   |                Port                  |
|:------------:|:-:|:------------------------------------:|
|    **P2P**   |   | {{ networks.parachain.p2p }} (TCP)   |
|    **RPC**   |   | {{ networks.parachain.rpc }}         |
|    **WS**    |   | {{ networks.parachain.ws }}          |
|**Prometheus**|   | {{ networks.parachain.prometheus }}  |

### Default ports of embedded relay chain

|  Description |   |                Port                  |
|:------------:|:-:|:------------------------------------:|
|    **P2P**   |   | {{ networks.relay_chain.p2p }} (TCP) |
|    **RPC**   |   | {{ networks.relay_chain.rpc }}       |
|    **WS**    |   | {{ networks.relay_chain.ws }}        |
|**Prometheus**|   | {{ networks.relay_chain.prometheus }}|
 

## Installation Instructions - Generate an Account

A Moonbase Alpha collator is controlled by running extriniscs against the parachain.  

1. Login to the Moonbase Alpha polkadot.js site.  [https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts}
2. Under Accounts, create a new Ethereum type address from "Private Key".  Mnemonic is not supported with this version of Moonbase Alpha. Save your backup and private key securely.  
3. Record the `PUBLIC_KEY` for use in the configuration below.  
4. Follow the steps below for setting up and configuring the node, then we will return to this site to continue the process.  
   
## Installation Instructions - Docker

A Moonbase Alpha Collator can be spun up quickly using Docker. For more information on installing Docker, please visit [this page](https://docs.docker.com/get-docker/). At the time of writing, the Docker version used was 19.03.6.

First, we need to create a local directory to store the chain data, and also set the necessary permissions:

```
mkdir {{ networks.moonbase.node_directory }}
```

!!! note
    Make sure you set the permissions accordingly for the local directory that stores the chain data.

Now we can execute the docker run command. Note that you have to replace `YOUR-NODE-NAME` in two different places, and insert your `PUBLIC_KEY` (the Ethereum H160 account you configured above). 

```
docker run -p {{ networks.relay_chain.p2p }}:{{ networks.relay_chain.p2p }} -p {{ networks.parachain.p2p }}:{{ networks.parachain.p2p }} -v "{{ networks.moonbase.node_directory }}:/data" \
purestake/moonbase-parachain-testnet:{{ networks.moonbase.parachain_docker_tag }} \
/moonbase-alphanet/moonbase-alphanet \
    --base-path=/data \
    --chain alphanet \
    --name="YOUR-NODE-NAME" \
    --collator \ 
    --author-id PUBLIC_KEY \
    --execution wasm \
    --wasm-execution compiled \
    -- \
    --name="YOUR-NODE-NAME (Embedded Relay)"
```

Once Docker pulls the necessary images, your Moonbase Alpha Collator will start, displaying lots of information such as the chain specification, node name, role, genesis state, among others:

![Full Node Starting](/images/fullnode/fullnode-docker1.png)

If you want to expose WS or RPC ports, enable those on the Docker run command line, for example:

```
docker run -p {{ networks.relay_chain.p2p }}:{{ networks.relay_chain.p2p }} -p {{ networks.parachain.p2p }}:{{ networks.parachain.p2p }} -p {{ networks.parachain.rpc }}:{{ networks.parachain.rpc }} -p {{ networks.parachain.ws }}:{{ networks.parachain.ws }} #rest of code goes here 
```

During the syncing process you will see messages from both the embedded relay chain and the parachain (without a tag). This messages display a target block (TestNet), and a best block (local node synced state). 

![Full Node Starting](/images/fullnode/fullnode-docker2.png)

Once synced, you have a Collator of the Moonbase Alpha TestNet running locally!
## Installation Instructions - Binary

In this section, we'll go through the process of compiling the binary and running a Moonbeam Collator as a systemd service. The following steps were tested on an Ubuntu 18.04 installation. Moonbase Alpha may work with other flavors of Linux, but Ubuntu is currently the only tested version.  

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

Next, install Substrate and all its prerequisites (including Rust), by executing:

```
--8<-- 'setting-up-local/substrate.md'
```

Now, we need to make some checks (correct version of Rust nightly) with the initialization script:

```
--8<-- 'setting-up-local/initscript.md'
```

Lastly, let's build parachain binary:

```
cargo build --release
```
![Compiling Binary](/images/fullnode/fullnode-binary1.png)

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
mkdir {{ networks.moonbase.node_directory }}
chmod 0755 {{ networks.moonbase.node_directory }}
chown moonbase_service {{ networks.moonbase.node_directory }}
```

Now, we need to copy the binary we built in the last section to the created folder:

```
cp ./target/release/moonbase-alphanet {{ networks.moonbase.node_directory }}
```

The next step is to create the systemd configuration file. Note that you have to:

  - Replace `YOUR-NODE-NAME` in two different places
  - Replace `PUBLIC-KEY` with the public key of your H160 Ethereum address created above
  - Double-check that the binary is in the proper path as described below (_ExecStart_)
  - Double-check the base path if you've used a different directory 
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
ExecStart={{ networks.moonbase.node_directory }}/moonbase-alphanet \
     --parachain-id 1000 \
     --no-telemetry \
     --collator \ 
     --author-id PUBLIC_KEY \
     --port {{ networks.parachain.p2p }} \
     --rpc-port {{ networks.parachain.rpc }} \
     --ws-port {{ networks.parachain.ws }} \
     --pruning=archive \
     --unsafe-rpc-external \
     --unsafe-ws-external \
     --rpc-methods=Safe \
     --rpc-cors all \
     --log rpc=info \
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

We are almost there! We need to register and start the service by running:

```
systemctl enable moonbeam.service
systemctl start moonbeam.service
```

And lastly, verify the service is running:

```
systemctl status moonbeam.service
```

![Service Status](/images/fullnode/fullnode-binary2.png)

We can also check the logs by executing:

```
journalctl -f -u moonbeam.service
```

![Service Logs](/images/fullnode/fullnode-binary3.png)

## Telemetry

_Comming soon_


## Start / Stop Collating
Once your node is up and running, and in sync with the network, you can begin collating by following the steps below. 
1. Navigate back to [https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts}
2. Confirm your collator account is loaded. 
3. Fund the account with at least {{ networks.moonbase.collator_min_stake }} DEV plus some extra for tx fees. 
4. From your collator account, bond your (self) collator by calling the `stake.joinCandidates()` function.  Set the fee to {{networks.moonbase.per-bill-fee}}, bond to {{ networks.moonbase.collator_min_stake }}.  These numbers may change with future releases but don't adjust them for now. The bond amount is a minimum, you may bond more, but if you bond less you are not considered a valid collator.  Only collator bond counts for this check, additional nominations do not.  
5. You may nominate your collator with another account you control or solicit nominations from others.  The top {{ networks.moonbase.collator_slots }} collators by total stake (including nominations) will be active for the next round.  Use the `stake.nominateNew()` function only to select a new collator to nominate. Use `stake.nominatorBondMore()` and `stake.nominatorBondLess()` to adjust the bond associated with an already nominated collator.  !!!note These function names are subject to change in future releases.
6. It may take up to 2 hours to get in the active set (if you have enough stake)
7. The only way to see the active set now is to run a query against the [chain state](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/chainstate).  The query is still called `stake.validators()` although this will change to `stake.collators()` in a future release.  
8. Block production is a random subsection of collators, but within that subsection speed matters.  A collator who can calculate and submit blocks faster than it's peers will author more blocks and generate more rewards.  


## Timings
!!!note Subject to change

Join or leave collator candidates = 2 rounds = 2 hours
Add or remove nominations = 1 round = 1 hour
Payments = 2 rounds after round ends




## Logs and Troubleshooting

You will see logs from both the relay chain as well as the parachain.  The relay chain will be prefixed by `[Relaychain]` while the parachain has no prefix.

!!! note 
    There is currently a [bug in cumulus](https://github.com/paritytech/cumulus/issues/257) regarding the naming issue.

### P2P Ports Not Open

If you don't seen an `Imported` message (without the `[Relaychain]` tag), you need to check the P2P port configuration. P2P port must be open to incoming traffic.

### In Sync

Both chains must be in sync at all times, and you should see either `Imported` or `Idle` messages and have connected peers.

### Genesis Mismatching

The Moonbase Alpha TestNet is often upgraded. Consequently, you may see the following message:

```
DATE [Relaychain] Bootnode with peer id `ID` is on a different 
chain (our genesis: GENESIS_ID theirs: OTHER_GENESIS_ID)
``` 

This typically means you are running an older version and will need to upgrade.

We announce the upgrades (and corresponding chain purge) via our [Discord channel](https://discord.gg/PfpUATX), at least 24 hours in advance.

## We Want to Hear From You

If you have any feedback regarding running a Collator or any other Moonbeam related topic, feel free to reach out through our official development [Discord server](https://discord.com/invite/PfpUATX).
