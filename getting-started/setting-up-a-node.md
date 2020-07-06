---
title: Setting Up a Node
description: Learn how to set up your first Moonbeam node and connect it to the Polkadot JS GUI.
---

#Setting Up a Moonbeam Node and Connecting to the Polkadot JS GUI  
##Introduction  
This guide outlines steps to create a node for testing the Ethereum compatibility functionality of Moonbeam.

!!! note
    This tutorial was created using the pre-alpha release of [Moonbeam](https://github.com/PureStake/moonbeam/tree/moonbeam-tutorials). The Moonbeam platform, and the [Frontier](https://github.com/paritytech/frontier) components it relies on for Substrate-based Ethereum compatibility, are still under very active development.  We have created this tutorial so you can test out Moonbeam’s Ethereum compatibility features.  Even though we are still in development, we believe it’s important that interested community members and developers have the opportunity to start to try things with Moonbeam and provide feedback.

We will start by downloading and building a Moonbeam node that we will run in developer mode using the `--dev` flag.  

!!! note
     For people not familiar with Substrate, the `--dev` flag is a way you can run a Substrate-based node in a single node developer configuration for testing purposes.  You can learn more about `--dev` in [this Substrate tutorial](https://substrate.dev/docs/en/tutorials/create-your-first-substrate-chain/interact).

The examples in this guide assume an Ubuntu 18.04-based environment and will need to be adapted accordingly for MacOS or Windows.  If you follow to the end of this guide you will have a running Moonbeam node and will be able to connect it to the default Polkadot JS GUI.

##Installation and Setup  
We start by cloning and building a specific branch of the moonbeam repo that you can find here:

[https://github.com/PureStake/moonbeam/tree/moonbeam-tutorials](https://github.com/PureStake/moonbeam/tree/moonbeam-tutorials)

Follow the installation instructions on that page to set up Rust, install Substrate, and clone the repo.  Here is the output from the clone action from my laptop:

![Output from clone action](/images/setting-up-node-1a.png)

Once you have cloned all the required repos, it's time to build the node by running:

`cargo build --release`

!!! note
    The initial build will take a while, depending on your hardware. You should plan on 30 minutes.  You may see warnings related to evm v0.16.1 and use of deprecated item 'sc_service::AbstractService::spawn_essential_task' which can be ignored for purposes of this guide.
   
Here is what the tail end of the build output looks like on my laptop:

![End of build output](/images/setting-up-node-2.png)

Then you will want to run the node in dev mode using the following command:

`./target/release/node-moonbeam --dev`

You should see output that looks like the following and that shows blocks being produced:

![Output shows blocks being produced](/images/setting-up-node-3.png)

##Connecting Polkadot JS Apps to a Local Moonbeam Node
The locally-running Moonbeam node is a Substrate-based node, so we can interact with it using standard Substrate tools.  Let’s start by connecting to it with Polkadot JS Apps.  
Open a browser to: [https://polkadot.js.org/apps/#/settings](https://polkadot.js.org/apps/#/settings)

This will open Polkadot JS Apps and bring you to the RPC configuration area, where you specify which Substrate RPC endpoint you want to connect to.  You will want to toggle the “remote node/endpoint to connect to” to “Local Node (Own, 127.0.0.1:9944)” which is the very last option in the dropdown (you have to scroll down):

![Select Local Node](/images/setting-up-node-4.png)

Next we need to add Moonbeam custom types to Polkadot JS so it understands them.  Under settings navigate to the “Developer” tab, enter the following JSON and hit Save:

``` json
{
 "Address": "AccountId",
 "LookupSource": "AccountId",
 "Account": {
   "nonce": "U256",
   "balance": "U256"
 }
}
```

It should look like this in the UI:

![Node selected in UI](/images/setting-up-node-5.png)

With Polkadot JS properly set up, you can look at blocks being produced in the explorer view, examine the chain state, etc.

An important note is that, in this development node, there are two completely different sets of states:
1. Substrate account state which you will see under Accounts, for example
2. State that is contained within the included EVM

##Querying Account State
Since many of you will be familiar with the standard Substrate-based functionality, let’s look at state within the EVM using the Substrate API.

Navigate to Chain state, select the “evm” module, and select “accounts(H160): Account” as the thing we want to query.  

Enter `0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b` as the account whose state we want to query.  This is an account in the Moonbeam dev node that has been given an initial balance via the genesis configuration.  If you query this account, you should get a balance back that looks like this:

![Querying the account](/images/setting-up-node-6.png)

!!! note
    If you see “Unknown” in the response, check that the Moonbeam custom types have been loaded as described above.

From here, you can begin testing Moonbeam’s Ethereum compatibility by [sending money via MetaMask](/getting-started/using-metamask/), [via Remix](/getting-started/using-remix/), with [Truffle](/getting-started/using-truffle/), or using the [Web3 library](/getting-started/web3-transaction/).
