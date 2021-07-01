---
title: Compile the Binary
description: How to compile the Moonbeam binary to run a full Parachain node, gain access to RPC endpoints, and produce blocks, for the Moonbeam Network.
---

# Compile the Moonbeam Binary

![Full Node Moonbeam Banner](/images/fullnode/compile-binary-banner.png)

## Introduction

There are several ways to get started running a full node on the Moonbeam network. This guide goes through the process of compiling the Moonbeam binary from Rust source code. For a more general overview of running nodes, or to get started with Docker, check out the [Run a Node](/node-operators/networks/full-node) page of our documentation.

This guide is meant for people with experience compiling [Substrate](https://substrate.dev/) based blockchain nodes. A parachain node is similar to a typical Substrate node, but there are some differences. A Substrate parachain node will is a bigger build because it contains code to run the parachain itself, as well as code to sync the relay chain, and facilitate communication between the two. As such, this build is quite large and may take over 30 min and require 32GB of memory.

## Compiling the Binary

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

Next, install a Substrate development environment, including Rust, by executing:

```
--8<-- 'code/setting-up-node/substrate.md'
```

Lastly, build parachain binary:

```
cargo build --release
```

![Compiling Binary](/images/fullnode/compile-binary1.png)

If a _cargo not found error_ shows up in the terminal, manually add Rust to your system path or restart your system:

```
--8<-- 'code/setting-up-node/cargoerror.md'
```

Now you can use the Moonbeam binary to [run a systemd service](/node-operators/networks/full-node/#running-the-systemd-service).