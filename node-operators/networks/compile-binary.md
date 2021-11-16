---
title: Using the Binary
description: How to compile the Moonbeam binary to run a full Parachain node, gain access to RPC endpoints, and produce blocks, for the Moonbeam Network.
---

# Using the Moonbeam Binary

![Full Node Moonbeam Banner](/images/node-operators/networks/compile-binary/compile-binary-banner.png)

## Introduction {: #introduction } 

There are several ways to get started running a full node on the Moonbeam network. This guide goes through the process of compiling the Moonbeam binary from Rust source code. For a more general overview of running nodes, or to get started with Docker, check out the [Run a Node](/node-operators/networks/full-node) page of our documentation.

This guide is meant for people with experience compiling [Substrate](https://substrate.dev/) based blockchain nodes. A parachain node is similar to a typical Substrate node, but there are some differences. A Substrate parachain node will is a bigger build because it contains code to run the parachain itself, as well as code to sync the relay chain, and facilitate communication between the two. As such, this build is quite large and may take over 30 min and require 32GB of memory.

## Compiling the Binary {: #compiling-the-binary } 

The following commands will build the latest release of the Moonbeam parachain.

First, let's start by cloning the moonbeam repo.

```
git clone https://github.com/PureStake/moonbeam
cd moonbeam
```

Let's check out the latest release:

```
git checkout tags/$(git describe --tags)
```

If you already have Rust installed, you can skip the next two steps. Otherwise, install Rust and its prerequisites [via Rust's recommended method](https://www.rust-lang.org/tools/install){target=_blank} by executing:

```
--8<-- 'code/setting-up-node/installrust.md'
```

Next, update your PATH environment variable by running:

```
--8<-- 'code/setting-up-node/updatepath.md'
```

Lastly, build the parachain binary:

```
cargo build --release
```

![Compiling Binary](/images/node-operators/networks/compile-binary/compile-binary-1.png)

If a _cargo not found error_ shows up in the terminal, manually add Rust to your system path or restart your system:
```
--8<-- 'code/setting-up-node/updatepath.md'
```

Now you can use the Moonbeam binary to [run a systemd service](/node-operators/networks/full-node/#running-the-systemd-service).

## Purging Binary Data {: #purging-binary-data }

If you want to start a fresh instance of a node, there are a handful of `purge-chain` commands available to you which will remove your previous chain data as specified. The base command which will remove both the parachain and relay chain data is:

```
./target/release/moonbeam purge-chain
```

You can add the following flags to the above command if you want to specify what data should be purged:

- `--parachain` - only deletes the parachain database, keeping the relay chain data in tact
- `--relaychain` - only deletes the relay chain database, keeping the parachain data in tact

You can also specify a chain to be removed:

- `--chain` - specify the chain using either one of the predefined chains or a path to a file with the chainspec

To purge only your Moonbase Alpha parachain data, for example, you would run the following command:

```
./target/release/moonbeam purge-chain --parachain --chain alphanet
```

To specify a path to the chainspec for a development chain to be purged, you would run:

```
./target/release/moonbeam purge-chain --chain example-moonbeam-dev-service.json
```

For the complete list of available `purge-chain` commands, you can access the help menu by running:

```
./target/release/moonbeam purge-chain --help
```