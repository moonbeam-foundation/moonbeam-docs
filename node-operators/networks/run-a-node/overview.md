---
title: Run a Node
description: Learn about all of the necessary details to run a full parachain node for the Moonbeam Network to have your RPC endpoint or produce blocks.
---

# Run a Node on Moonbeam

## Introduction {: #introduction }

Running a full node on a Moonbeam-based network allows you to connect to the network, sync with a bootnode, obtain local access to RPC endpoints, author blocks on the parachain, and more.

There are multiple deployments of Moonbeam, including the Moonbase Alpha TestNet, Moonriver on Kusama, and Moonbeam on Polkadot. Here's how these environments are named and their corresponding [chain specification file](https://docs.substrate.io/build/chain-spec/) names:

|    Network     |      Hosted By      |             Chain Name              |
|:--------------:|:-------------------:|:-----------------------------------:|
| Moonbase Alpha | Moonbeam Foundation | {{ networks.moonbase.chain_spec }}  |
|   Moonriver    |       Kusama        | {{ networks.moonriver.chain_spec }} |
|    Moonbeam    |      Polkadot       | {{ networks.moonbeam.chain_spec }}  |

!!! note
    Moonbase Alpha is still considered an Alphanet, and as such _will not_ have 100% uptime. The parachain might be purged as needed. During the development of your application, make sure you implement a method to redeploy your contracts and accounts to a fresh parachain quickly. If a chain purge is required, it will be announced via our [Discord channel](https://discord.com/invite/PfpUATX) at least 24 hours in advance.

## Requirements {: #requirements }

Running a parachain node is similar to a typical Substrate node, but there are some differences. A Substrate parachain node is a bigger build because it contains code to run the parachain itself, as well as code to sync the relay chain, and facilitate communication between the two. As such, this build is quite large and may take over 30 min and require 32GB of memory.

The minimum specs recommended to run a node are shown in the following table. For our Kusama and Polkadot MainNet deployments, disk requirements will be higher as the network grows.

=== "Moonbeam"
    |  Component   |                                                        Requirement                                                         |
    |:------------:|:--------------------------------------------------------------------------------------------------------------------------:|
    |   **CPU**    |                             {{ networks.moonbeam.node.cores }} Cores (Fastest per core speed)                              |
    |   **RAM**    |                                            {{ networks.moonbeam.node.ram }} GB                                             |
    |   **SSD**    |                                      {{ networks.moonbeam.node.hd }} TB (recommended)                                      |
    | **Firewall** | P2P port must be open to incoming traffic:<br>&nbsp; &nbsp; - Source: Any<br>&nbsp; &nbsp; - Destination: 30333, 30334 TCP |

=== "Moonriver"
    |  Component   |                                                        Requirement                                                         |
    |:------------:|:--------------------------------------------------------------------------------------------------------------------------:|
    |   **CPU**    |                             {{ networks.moonriver.node.cores }} Cores (Fastest per core speed)                             |
    |   **RAM**    |                                            {{ networks.moonriver.node.ram }} GB                                            |
    |   **SSD**    |                                     {{ networks.moonriver.node.hd }} TB (recommended)                                      |
    | **Firewall** | P2P port must be open to incoming traffic:<br>&nbsp; &nbsp; - Source: Any<br>&nbsp; &nbsp; - Destination: 30333, 30334 TCP |

=== "Moonbase Alpha"
    |  Component   |                                                        Requirement                                                         |
    |:------------:|:--------------------------------------------------------------------------------------------------------------------------:|
    |   **CPU**    |                             {{ networks.moonbase.node.cores }} Cores (Fastest per core speed)                              |
    |   **RAM**    |                                            {{ networks.moonbase.node.ram }} GB                                             |
    |   **SSD**    |                                      {{ networks.moonbase.node.hd }} TB (recommended)                                      |
    | **Firewall** | P2P port must be open to incoming traffic:<br>&nbsp; &nbsp; - Source: Any<br>&nbsp; &nbsp; - Destination: 30333, 30334 TCP |

!!! note
    If you don't see an `Imported` message (without the `[Relaychain]` tag) when running a node, you might need to double-check your port configuration.

## Running Ports {: #running-ports }

As stated before, the relay/parachain nodes will listen on multiple ports. The default Substrate ports are used in the parachain, while the relay chain will listen on the next higher port.

The only ports that need to be open for incoming traffic are those designated for P2P. **Collators must not have RPC or WS ports opened**.

--8<-- 'text/node-operators/networks/run-a-node/client-changes.md'

### Default Ports for a Parachain Full-Node {: #default-ports-for-a-parachain-full-node }

|  Description   |                Port                 |
|:--------------:|:-----------------------------------:|
|    **P2P**     | {{ networks.parachain.p2p }} (TCP)  |
|  **RPC & WS**  |     {{ networks.parachain.ws }}     |
| **Prometheus** | {{ networks.parachain.prometheus }} |

### Default Ports of Embedded Relay Chain {: #default-ports-of-embedded-relay-chain }

|  Description   |                 Port                  |
|:--------------:|:-------------------------------------:|
|    **P2P**     | {{ networks.relay_chain.p2p }} (TCP)  |
|  **RPC & WS**  |     {{ networks.relay_chain.ws }}     |
| **Prometheus** | {{ networks.relay_chain.prometheus }} |

## Installation {: #installation }

There are a couple different guides to help you get started running a Moonbeam-based node:

- [Using Docker](/node-operators/networks/run-a-node/docker/) - this method provides a quick and easy way to get started with a Docker container
- [Using Systemd](/node-operators/networks/run-a-node/systemd/) - this method is recommended for those with experience compiling a Substrate node

## Debug, Trace and TxPool APIs {: #debug-trace-txpool-apis }

You can also gain access to some non-standard RPC methods by running a tracing node, which allow developers to inspect and debug transactions during runtime. Tracing nodes use a different Docker image than a standard Moonbase Alpha, Moonriver, or Moonbeam node. Check out the [Run a Tracing Node](/node-operators/networks/tracing-node/) guide and be sure to switch to the right network tab throughout the instructions. Then to interact with your tracing node, check out the [Debug & Trace](/builders/ethereum/json-rpc/debug-trace/) guide.

## Lazy Loading {: #lazy-loading }

Lazy loading lets a Moonbeam node operate while downloading network state in the background, eliminating the need to wait for full synchronization before use. You can activate lazy loading with the following flag:

- **`--lazy-loading-remote-rpc`** - allows lazy loading by relying on a specified RPC for network state until the node is fully synchronized e.g. `--lazy-loading-remote-rpc 'INSERT-RPC-URL'`

Upon spooling up a node with this feature, you'll see output like the following:

--8<-- 'code/node-operators/networks/run-a-node/terminal/lazy-loading.md'

!!! note
    Lazy loading a Moonbeam requires a large number of RPC requests. To avoid being rate-limited by a public endpoint, it's highly recommended to use a [dedicated endpoint](/builders/get-started/endpoints#endpoint-providers).  

You can further customize your use of the lazy loading functionality with the following optional parameters:

- **`--lazy-loading-block`** - specifies a block hash from which to start loading data. If not provided, the latest block will be used
- **`--lazy-loading-delay-between-requests`** - the delay (in milliseconds) between RPC requests when using lazy loading. This parameter controls the amount of time to wait between consecutive RPC requests. This can help manage request rate and avoid overwhelming the server. Default value is `100` milliseconds
- **`--lazy-loading-max-retries-per-request`** - the maximum number of retries for an RPC request when using lazy loading. Default value is `10` retries
- **`--lazy-loading-runtime-override`** - path to a WASM file to override the runtime when forking. If not provided, it will fetch the runtime from the block being forked
- **`--lazy-loading-state-overrides`** - path to a JSON file containing state overrides to be applied when forking 

The state overrides file should define the respective pallet, storage item, and value that you seek to override as follows:

```json
[
 {
     "pallet": "System",
     "storage": "SelectedCandidates",
     "value": "0x04f24ff3a9cf04c71dbc94d0b566f7a27b94566cac"
 }
]
```

## Logs and Troubleshooting {: #logs-and-troubleshooting }

You will see logs from both the relay chain and the parachain. The relay chain will be prefixed by `[Relaychain]`, while the parachain has no prefix.

### P2P Ports Not Open {: #p2p-ports-not-open }

If you don't see an `Imported` message (without the `[Relaychain]` tag), you need to check the P2P port configuration. P2P port must be open to incoming traffic.

### In Sync {: #in-sync }

Both chains must be in sync at all times, and you should see either `Imported` or `Idle` messages and have connected peers.

### Genesis Mismatching {: #genesis-mismatching }

The Moonbase Alpha TestNet may need to be purged and upgraded once in a while. Consequently, you may see the following message:

```text
DATE [Relaychain] Bootnode with peer id `ID` is on a different
chain (our genesis: GENESIS_ID theirs: OTHER_GENESIS_ID)
```

This typically means that you are running an older version and will need to upgrade.

We announce the upgrades (and corresponding chain purge) via our [Discord channel](https://discord.com/invite/PfpUATX) at least 24 hours in advance.

Instructions for purging chain data will vary slightly depending on how you spun up your node:

  - For Docker, you can check out the [Purge Your Node](/node-operators/networks/run-a-node/docker/#purge-your-node) section of the [Using Docker](/node-operators/networks/run-a-node/docker/) page
  - For Systemd, you can take a look at the [Purge Your Node](/node-operators/networks/run-a-node/systemd/#purge-your-node) section of the [Using Systemd](/node-operators/networks/run-a-node/systemd/) page