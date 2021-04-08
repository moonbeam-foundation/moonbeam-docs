---
title: Setting Up a Node
description: Follow this tutorial to learn how to set up your first Moonbeam node. You’ll also learn how to connect it to and control it with the Polkadot JS GUI.
---

# Setting Up a Moonbeam Node and Connecting to the Polkadot JS GUI

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed//p_0OAHSlHNM' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style><div class='caption'>You can find all of the relevant code for this tutorial on the <a href="{{ config.site_url }}resources/code-snippets/">code snippets page</a></div>

## Introduction

This guide outlines the steps needed to create a development node for testing the Ethereum compatibility features of Moonbeam.

!!! note
    This tutorial was created using the {{ networks.development.build_tag }} tag of [Moonbase Alpha](https://github.com/PureStake/moonbeam/releases/tag/{{ networks.development.build_tag }}). The Moonbeam platform and the [Frontier](https://github.com/paritytech/frontier) components it relies on for Substrate-based Ethereum compatibility are still under very active development. The examples in this guide assume a MacOS or Ubuntu 18.04-based environment and will need to be adapted accordingly for Windows.

A Moonbeam development node is your own personal development environment for building and testing applications on Moonbeam. For Ethereum developers, it is comparible to Ganache. It enables you to get started quickly and easily without the overhead of a relay chain. You can spin up your node with the `--sealing` option to author blocks instantly, manually, or at a custom interval after transactions are received. By default a block will be created when a transaction is received, which is similar to Ganache's instamine feature. 

If you follow to the end of this guide, you will have a Moonbeam development node running in your local environment, with 10 [pre-funded accounts](#pre-funded-development-accounts), and will be able to connect it to the default Polkadot JS GUI.

There are two ways to get started running a Moonbeam node: you can use [docker to run a pre-built binary](#getting-started-with-docker) or you can [locally install and set up a development node yourself](#installation-and-setup). Using Docker is a quick and convenient way to get started, but does require you to [install Docker](https://docs.docker.com/get-docker/). If you chose to install and set it up yourself, it could take roughly 30 minutes or longer to complete depending on your hardware.

## Getting Started with Docker

Using Docker enables you to spin up a node in a matter of seconds. It prevents you from having to install Substrate and all the dependencies, and you can skip the building the node process as well. The only requirement is to have Docker installed, and then you can execute the following command to download the corresponding image:

```
--8<-- 'code/setting-up-local/dockerpull.md'
```

The tail end of the console log should look like this:

![Docker - imaged pulled](/images/setting-up-a-node/setting-up-node-1.png)

Once the Docker image is downloaded, the next step is to run the image.

You can run the Docker image using the following:

=== "Ubuntu"
    ```
    --8<-- 'code/setting-up-local/dockerrun.md'
    ```

=== "MacOS"
    ```
    --8<-- 'code/setting-up-local/dockerrun_macos.md'
    ```

This should spin up a Moonbeam develoment node in instant seal mode for local testing, so that blocks are authored instantly as transactions are received.
If successful, you should see an output showing an idle state waiting for blocks to be authored:

![Docker - output shows blocks being produced](/images/setting-up-a-node/setting-up-node-2.png)

For more information on some of the flags and options used in the example, check out [Common Flags and Options](#common-flags-and-options). If you want to see a complete list of all of the flags, options, and subcommands, open the help menu by running:

```
docker run --rm --name moonbeam_development \
purestake/moonbeam --help
```

To continue on with the tutorial, the next section is not necessary as you've already spun up a node with Docker. You can skip ahead to [Connecting Polkadot JS Apps to a Local Moonbeam Node](#connecting-polkadot-js-apps-to-a-local-moonbeam-node).
## Installation and Setup  

We start by cloning a specific tag of the Moonbeam repo that you can find here:

[https://github.com/PureStake/moonbeam/](https://github.com/PureStake/moonbeam/)

```
git clone -b {{ networks.development.build_tag }} https://github.com/PureStake/moonbeam
cd moonbeam
```

Next, install Substrate and all its prerequisites (including Rust) by executing:

```
--8<-- 'code/setting-up-local/substrate.md'
```

Once you have followed all of the procedures above, it's time to build the development node by running:

```
--8<-- 'code/setting-up-local/build.md'
```

If a _cargo not found error_ shows up in the terminal, manually add Rust to your system path (or restart your system):

```
--8<-- 'code/setting-up-local/cargoerror.md'
```

!!! note
    The initial build will take a while. Depending on your hardware, you should expect approximately 30 minutes for the build process to finish.

Here is what the tail end of the build output should look like:

![End of build output](/images/setting-up-a-node/setting-up-node-3.png)

Then, you will want to run the node in dev mode using the following command:

```
--8<-- 'code/setting-up-local/runnode.md'
```

!!! note
    For people not familiar with Substrate, the `--dev` flag is a way to run a Substrate-based node in a single node developer configuration for testing purposes. You can learn more about `--dev` in [this Substrate tutorial](https://substrate.dev/docs/en/tutorials/create-your-first-substrate-chain/interact).

You should see an output that looks like the following, showing an idle state waiting for blocks to be produced:

![Output shows blocks being produced](/images/setting-up-a-node/setting-up-node-4.png)

For more information on some of the flags and options used in the example, check out [Common Flags and Options](#common-flags-and-options). If you want to see a complete list of all of the flags, options, and subcommands, open the help menu by running:

```
./target/release/moonbeam --help
```

The local Moonbeam development node provides two RPC endpoints:
 
 - HTTP: `http://127.0.0.1:9933`
 - WS: `ws://127.0.0.1:9944` 
## Connecting Polkadot JS Apps to a Local Moonbeam Node

The locally-running Moonbeam node is a Substrate-based node, so we can interact with it using standard Substrate tools. Let’s start by connecting to it with Polkadot JS Apps.  
Open a browser to: [https://polkadot.js.org/apps/#/explorer](https://polkadot.js.org/apps/#/explorer). This will open Polkadot JS Apps, which automatically connects to Polkadot MainNet.

![Polkadot JS Apps](/images/setting-up-a-node/setting-up-node-5.png)

Click on the top left corner to open the menu to configure the networks, and then navigate down to open the Development sub-menu. In there, you will want to toggle the "Local Node" option, which points Polkadot JS Apps to `ws://127.0.0.1:9944`. Next, select the Switch button, and the site should connect to your Moonbeam development node.

![Select Local Node](/images/setting-up-a-node/setting-up-node-6.png)

With Polkadot JS Apps connected, you will see the Moonbeam development node producing blocks.

![Select Local Node](/images/setting-up-a-node/setting-up-node-7.png)

## Querying Account State

With the release of [Moonbase Alpha v3](https://www.purestake.com/news/moonbeam-network-upgrades-account-structure-to-match-ethereum/), Moonbeam now works under a single account format, which is the Ethereum-styled H160 and is now also supported in Polkadot JS Apps. To check the balance of an address, you can simply import your account to the Accounts tab. You can find more information in the [Unified Accounts](/learn/unified-accounts/) section.
 
Nevertheless, leveraging the Ethereum full RPC capabilities of Moonbeam, you can use [MetaMask](/getting-started/local-node/using-metamask/) to check the balance of that address as well. In addition, you can also use other development tools, such as [Remix](/getting-started/local-node/using-remix/) and [Truffle](/getting-started/local-node/using-truffle/).

## Common Flags and Options

Flags do not take an argument. To use a flag, add it to the end of a command. For example:

```
--8<-- 'code/setting-up-local/runnode.md'
```

- `--dev`: Specifies the development chain
- `--no-telemetry`: Disable connecting to the Substrate telemetry server. For global chains, telemetry is on by default. Telemetry is unavailable if you are running a development (`--dev`) node.
- `--tmp`: Runs a temporary node in which all of the configuration will be deleted at the end of the process
- `--rpc-external`: Listen to all RPC interfaces
- `--ws-external`: Listen to all Websocket interfaces

Options accept an argument on the right side of a command. For example:

```
--8<-- 'code/setting-up-local/runnodewithsealinginterval.md'
```

- `-l <log pattern>` or `--log <log pattern>`: Sets a custom logging filter. The syntax for the log pattern is `<target>=<level>`. For example, to print all of the RPC logs, the command would look like this: `-l rpc=trace`.
- `--sealing <interval>`: When blocks should be sealed in the dev service. Accepted arguments for interval: `instant`, `manual`, or a number representing the timer interval in milliseconds. The default is `instant`.

## Pre-funded Development Accounts

Your Moonbeam development node comes with ten pre-funded accounts for development. The addresses are derived from Substrate's canonical development mnemonic: `bottom drive obey lake curtain smoke basket hold race lonely fit walk`. Checkout the [Using MetaMask](/getting-started/local-node/using-metamask/) section to get started interacting with your accounts.

--8<-- 'text/setting-up-local/dev-accounts.md'
