---
title: Setting Up a Node
description: Follow this tutorial to learn how to set up your first Moonbeam node. You’ll also learn how to connect it to and control it with the Polkadot JS GUI.
---

# Setting Up a Moonbeam Node and Connecting to the Polkadot JS GUI  
<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed//p_0OAHSlHNM' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style><div class='caption'>You can find all of the relevant code for this tutorial on the [code snippets page](/resources/code-snippets/)</div>

## Introduction  
This guide outlines steps to create a standalone local node for testing the Ethereum compatibility functionality of Moonbeam.

!!! note
    This tutorial was created using the v3 release of [Moonbase Alpha](https://github.com/PureStake/moonbeam/releases/tag/v0.3.0). The Moonbeam platform, and the [Frontier](https://github.com/paritytech/frontier) components it relies on for Substrate-based Ethereum compatibility, are still under very active development. The examples in this guide assume an Ubuntu 18.04-based environment and will need to be adapted accordingly for MacOS or Windows.

If you follow to the end of this guide, you will have a Moonbeam node running in your local enviroment, and will be able to connect it to the default Polkadot JS GUI.

## Installation and Setup  
We start by cloning a specific tag of the Moonbeam repo that you can find here:

[https://github.com/PureStake/moonbeam/](https://github.com/PureStake/moonbeam/)

```
--8<-- 'setting-up-local/clone.md'
```

Next, install Substrate and all its prerequisites (including rust), by executing:

```
--8<-- 'setting-up-local/substrate.md'
```

Now, lets make some checks (correct version of rust nigthly) with the initialization script:

```
--8<-- 'setting-up-local/initscript.md'
```

Once you have followed all of the procedures above, it's time to build the standalone node by running:

```
--8<-- 'setting-up-local/build.md'
```

If a _cargo not found error_ shows up in the terminal, manually add Rust to your system path (or restart your system):

```
--8<-- 'setting-up-local/cargoerror.md'
```

!!! note
    The initial build will take a while. Depending on your hardware, you should plan on 30 minutes for the build process to finish.

Here is what the tail end of the build output should look like:

![End of build output](/images/setting-up-a-node/setting-up-node-2b.png)

Then you will want to run the node in dev mode using the following command:

```
--8<-- 'setting-up-local/runnode.md'
```

!!! note
    For people not familiar with Substrate, the `--dev` flag is a way you can run a Substrate-based node in a single node developer configuration for testing purposes. You can learn more about `--dev` in [this Substrate tutorial](https://substrate.dev/docs/en/tutorials/create-your-first-substrate-chain/interact).

You should see an output that looks like the following, showing that blocks are being produced:

![Output shows blocks being produced](/images/setting-up-a-node/setting-up-node-3b.png)

The local standalone Moonbeam node provides two RPC endpoints:
 
 - HTTP: `http://127.0.0.1:9933`
 - WS: `ws://127.0.0.1:9944` 

## Getting Started with Docker
An alternative to the steps higlighted before is to use docker to run a pre-build binary. Doing so, you prevent having to install Substrate and all the dependencies, and you can skip the building the node process as well. The only requirement is to have Docker installed, and then you can execute the following command to download the corresponding image:

```
--8<-- 'setting-up-local/dockerpull.md'
```
The tail end of the console log should look like this:

![Docker - imaged pulled](/images/setting-up-a-node/setting-up-node-9a.png)

Once the Docker image is downloaded, you can run it with the following line:

```
--8<-- 'setting-up-local/dockerrun.md'
```

If successful you should see an ouput similar to before, showing that blocks are being produced:

![Docker - output shows blocks being produced](/images/setting-up-a-node/setting-up-node-8a.png)

## Connecting Polkadot JS Apps to a Local Moonbeam Node
The locally-running Moonbeam node is a Substrate-based node, so we can interact with it using standard Substrate tools. Let’s start by connecting to it with Polkadot JS Apps.  
Open a browser to: [https://polkadot.js.org/apps/#/explorer](https://polkadot.js.org/apps/#/explorer). This will open Polkadot JS Apps which automatically connects to Polkadot MainNet. 

![Polkadot JS Apps](/images/setting-up-a-node/setting-up-node-4b.png)

Click on the top left corner to open the menu to configure the networks, and then navigate down to open the Development sub-menu. In there,  you will want to toggle the "Local Node" option which points Polkadot JS Apps to `ws://127.0.0.1:9944`. Next, hit on the Switch button and the site should connect to your standalone Moonbeam node.

![Select Local Node](/images/setting-up-a-node/setting-up-node-5b.png)

With Polkadot JS Apps connected, you will see the standalone Moonbeam node producing blocks.

![Select Local Node](/images/setting-up-a-node/setting-up-node-6b.png)

## Querying Account State
With the release of [Moonbase Alpha v3](https://www.purestake.com/news/moonbeam-network-upgrades-account-structure-to-match-ethereum/), Moonbeam now works under a single account format, which is the Ethereum-styled H160 and is now also supported in Polkadot JS Apps. To check the balance of an address, you can simply import your account to the Accounts tab. You can find more information in [this site](/integrations/polkadotjs/).

Nevertheless, leveraging the Ethereum full RPC capabilities of Moonbeam, you can use [MetaMask](/getting-started/using-metamask/) to check the balance of that address as well. In addition, you can also use other development tools such as [Remix](/getting-started/using-remix/), [Truffle](/getting-started/using-truffle/), or the [Web3 JavaScript library](/getting-started/web3-transaction/).


