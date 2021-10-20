---
title: Moonbeam Development Node
description: Follow this tutorial to learn how to set up your first Moonbeam node. You’ll also learn how to connect it to and control it with the Polkadot.js GUI.
---

# Getting Started with a Moonbeam Development Node

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/-bRooBW2g0o' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## Introduction {: #introduction } 

This guide outlines the steps needed to create a development node for testing the Ethereum compatibility features of Moonbeam.

!!! note
    This tutorial was created using the {{ networks.development.build_tag }} tag of [Moonbase Alpha](https://github.com/PureStake/moonbeam/releases/tag/{{ networks.development.build_tag }}). The Moonbeam platform and the [Frontier](https://github.com/paritytech/frontier) components it relies on for Substrate-based Ethereum compatibility are still under very active development.
    --8<-- 'text/common/assumes-mac-or-ubuntu-env.md'

A Moonbeam development node is your own personal development environment for building and testing applications on Moonbeam. For Ethereum developers, it is comparable to Ganache. It enables you to get started quickly and easily without the overhead of a relay chain. You can spin up your node with the `--sealing` option to author blocks instantly, manually, or at a custom interval after transactions are received. By default a block will be created when a transaction is received, which is similar to Ganache's instamine feature. 

If you follow to the end of this guide, you will have a Moonbeam development node running in your local environment, with 10 [pre-funded accounts](#pre-funded-development-accounts), and will be able to connect it to the default Polkadot.js GUI.

There are two ways to get started running a Moonbeam node: you can use [Docker to run a pre-built binary](#getting-started-with-docker) or you can [compile the binary locally](#getting-started-with-the-binary-file) and set up a development node yourself. Using Docker is a quick and convenient way to get started as you won't have to install Substrate and all the dependencies, and you can skip the building the node process as well. It does require you to [install Docker](https://docs.docker.com/get-docker/). On the other hand, if you decide you want to go through the process of building your own development node, it could take roughly 30 minutes or longer to complete depending on your hardware.

## Getting Started with Docker {: #getting-started-with-docker } 

Using Docker enables you to spin up a node in a matter of seconds. Once you have Docker installed, then you can execute the following command to download the corresponding image:

```
docker pull purestake/moonbeam:{{ networks.development.build_tag }}
```

The tail end of the console log should look like this:

![Docker - imaged pulled](/images/builders/get-started/moonbeam-dev/moonbeam-dev-1.png)

Once the Docker image is downloaded, the next step is to run the image.

You can run the Docker image using the following:

=== "Ubuntu"
    ```
    docker run --rm --name {{ networks.development.container_name }} --network host \
    purestake/moonbeam:{{ networks.development.build_tag }} \
    --dev
    ```

=== "MacOS"
    ```
    docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 -p 9933:9933 \
    purestake/moonbeam:{{ networks.development.build_tag }} \
    --dev --ws-external --rpc-external
    ```

=== "Windows"
    ```
    docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 -p 9933:9933 ^
    purestake/moonbeam:{{ networks.development.build_tag }} ^
    --dev --ws-external --rpc-external
    ```

This should spin up a Moonbeam development node in instant seal mode for local testing, so that blocks are authored instantly as transactions are received.
If successful, you should see an output showing an idle state waiting for blocks to be authored:

![Docker - output shows blocks being produced](/images/builders/get-started/moonbeam-dev/moonbeam-dev-2.png)

For more information on some of the flags and options used in the example, check out [Flags and Options](#commands-flags-and-options). If you want to see a complete list of all of the flags, options, and subcommands, open the help menu by running:

```
docker run --rm --name {{ networks.development.container_name }} \
purestake/moonbeam \
--help
```

To continue on with the tutorial, the next section is not necessary as you've already spun up a node with Docker. You can skip ahead to [Connecting Polkadot.js Apps to a Local Moonbeam Node](#connecting-polkadot-js-apps-to-a-local-moonbeam-node).

## Getting Started with the Binary File {: #getting-started-with-the-binary-file } 

!!! note
    If you know what you are doing, you can directly download the precompiled binaries attached to each release on the [Moonbeam-release page](https://github.com/PureStake/moonbeam/releases). These will not work in all systems. For example, the binaries only work with x86-64 Linux with specific versions of dependencies. The safest way to ensure compatibility is to compile the binary in the system where it will be run from.

First, start by cloning a specific tag of the Moonbeam repo that you can find here:

[https://github.com/PureStake/moonbeam/](https://github.com/PureStake/moonbeam/)

```
git clone -b {{ networks.development.build_tag }} https://github.com/PureStake/moonbeam
cd moonbeam
```

If you already have Rust installed, you can skip the next two steps. Otherwise, install Rust and its prerequisites [via Rust's recommended method](https://www.rust-lang.org/tools/install){target=_blank} by executing:

```
--8<-- 'code/setting-up-node/installrust.md'
```

Next, update your PATH environment variable by running:

```
--8<-- 'code/setting-up-node/updatepath.md'
```

Now, build the development node by running:

```
--8<-- 'code/setting-up-node/build.md'
```

!!! note
    The initial build will take a while. Depending on your hardware, you should expect approximately 30 minutes for the build process to finish.

Here is what the tail end of the build output should look like:

![End of build output](/images/builders/get-started/moonbeam-dev/moonbeam-dev-3.png)

Then, you will want to run the node in dev mode using the following command:

```
--8<-- 'code/setting-up-node/runnode.md'
```

!!! note
    For people not familiar with Substrate, the `--dev` flag is a way to run a Substrate-based node in a single node developer configuration for testing purposes. You can learn more about `--dev` in [this Substrate tutorial](https://substrate.dev/docs/en/tutorials/create-your-first-substrate-chain/interact).

You should see an output that looks like the following, showing an idle state waiting for blocks to be produced:

![Output shows blocks being produced](/images/builders/get-started/moonbeam-dev/moonbeam-dev-4.png)

For more information on some of the flags and options used in the example, check out [Flags and Options](#commands-flags-and-options). If you want to see a complete list of all of the flags, options, and subcommands, open the help menu by running:

```
./target/release/moonbeam --help
```
## Connecting Polkadot.js Apps to a Local Moonbeam Node {: #connecting-polkadot-js-apps-to-a-local-moonbeam-node } 

The development node is a Substrate-based node, so you can interact with it using standard Substrate tools. The two provided RPC endpoints are:

 - **HTTP** - `http://127.0.0.1:9933`
 - **WS** - `ws://127.0.0.1:9944` 

Start by connecting to it with Polkadot.js Apps. Open a browser to: [https://polkadot.js.org/apps/#/explorer](https://polkadot.js.org/apps/#/explorer). This will open Polkadot.js Apps, which automatically connects to Polkadot MainNet.

![Polkadot.js Apps](/images/builders/get-started/moonbeam-dev/moonbeam-dev-5.png)

Click on the top left corner to open the menu to configure the networks, and then navigate down to open the Development sub-menu. In there, you will want to toggle the "Local Node" option, which points Polkadot.js Apps to `ws://127.0.0.1:9944`. Next, select the Switch button, and the site should connect to your Moonbeam development node.

![Select Local Node](/images/builders/get-started/moonbeam-dev/moonbeam-dev-6.png)

With Polkadot.js Apps connected, you will see the Moonbeam development node waiting for transactions to arrive to begin producing blocks.

![Select Local Node](/images/builders/get-started/moonbeam-dev/moonbeam-dev-7.png)

## Querying Account State {: #querying-account-state } 

With the release of [Moonbase Alpha v3](https://www.purestake.com/news/moonbeam-network-upgrades-account-structure-to-match-ethereum/), Moonbeam now works under a single account format, which is the Ethereum-styled H160 and is now also supported in Polkadot.js Apps. To check the balance of an address, you can simply import your account in the Accounts tab. You can find more information in the [Unified Accounts](/learn/features/unified-accounts/) section.
 
Nevertheless, leveraging the Ethereum full RPC capabilities of Moonbeam, you can use [MetaMask](/tokens/connect/metamask/) to check the balance of that address as well. In addition, you can also use other development tools, such as [Remix](/builders/interact/remix/) and [Truffle](/builders/interact/truffle/).

## Commands, Flags and Options {: #common-commands-flags-and-options } 

### Purging the Chain {: #purging-the-chain } 

When running a node via the binary file, data is stored in a local directory typically located in `~/.local/shared/moonbeam/chains/development/db`. If you want to start a fresh instance of the node, you can either delete the content of the folder, or run the following command inside the `moonbeam` folder:

```
./target/release/moonbeam purge-chain --dev -y
```

This will remove the data folder, note that all chain data is now lost.

If you used Docker, the data folder is related to the Docker container itself.
### Node Flags {: #node-flags } 

Flags do not take an argument. To use a flag, add it to the end of a command. For example:

```
--8<-- 'code/setting-up-node/runnode.md'
```

- **`--dev`** - specifies the development chain
- **`--no-telemetry`** - disable connecting to the Substrate telemetry server. For global chains, telemetry is on by default. Telemetry is unavailable if you are running a development (`--dev`) node
- **`--tmp`** - runs a temporary node in which all of the configuration will be deleted at the end of the process
- **`--rpc-external`** - listen to all RPC interfaces
- **`--ws-external`** - listen to all Websocket interfaces

### Node Options {: #node-options } 

Options accept an argument to the right side of the option. For example:

```
--8<-- 'code/setting-up-node/runnodewithsealinginterval.md'
```

- **`-l <log pattern>` or `--log <log pattern>`** - sets a custom logging filter. The syntax for the log pattern is `<target>=<level>`. For example, to print all of the RPC logs, the command would look like this: `-l rpc=trace`
- **`--sealing <interval>`** - when blocks should be sealed in the dev service. Accepted arguments for interval: `instant`, `manual`, or a number representing the timer interval in milliseconds (for example, `6000` will have the node produce blocks every 6 seconds). The default is `instant`
- **`--rpc-port <port>`** - sets the HTTP RPC server TCP port. Accepts a port as the argument
- **`--ws-port <port>`**: sets the WebSockets RPC server TCP port. Accepts a port as the argument

For a complete list of flags and options, spin up your Moonbeam development node with `--help` added to the end of the command.

## Debug, Trace and TxPool APIs {: #debug-trace-txpool-apis } 

You can also gain access to some non-standard RPC methods by running a tracing node, which allow developers to inspect and debug transactions during runtime. Tracing nodes use a different Docker image than a standard Moonbeam development node. 

To learn how to run a Moonbeam development tracing node, check out the [Debug & Trace](/builders/tools/debug-trace/#try-it-out) guide and be sure to switch to the **Moonbeam Development Node** tab throughout the instructions.

## Pre-funded Development Accounts {: #pre-funded-development-accounts } 

Your Moonbeam development node comes with ten pre-funded accounts for development. The addresses are derived from Substrate's canonical development mnemonic: 

```
bottom drive obey lake curtain smoke basket hold race lonely fit walk
```

--8<-- 'code/setting-up-node/dev-accounts.md'

Checkout the [Using MetaMask](/tokens/connect/metamask/) section to get started interacting with your accounts.

Also, included with the development node is a prefunded account used for testing purposes:

--8<-- 'code/setting-up-node/dev-testing-account.md'

## Block Explorers

For a Moonbeam development node, you can use any of the following block explorers:

 - **Substrate API** — [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/explorer) on WS port `9944`
 - **Ethereum API JSON-RPC based** — [Moonbeam Basic Explorer](https://moonbeam-explorer.netlify.app/?network=MoonbeamDevNode) on HTTP port `9933`
