---
title: Using MetaMask
description: This tutorial walks you through how to interact with a local Moonbeam node using a default installation of the MetaMask browser plug-in.
---

# Interacting with a Moonbeam Node Using MetaMask

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed//hrpBd2-a7as' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style><div class='caption'>You can find all of the relevant code for this tutorial on the <a href="{{ config.site_url }}resources/code-snippets/">code snippets page</a></div>

## Introduction

This guide outlines the steps needed to connect MetaMask to a self-contained Moonbeam standalone node in order to send tokens between accounts. If you haven’t already set up your own local dev node, refer to [this tutorial](/getting-started/local-node/setting-up-a-node/), or follow the instructions in the [GitHub repository](https://github.com/PureStake/moonbeam/).

!!! note
    This tutorial was created using the {{ networks.moonbase.version }} release of [Moonbase Alpha](https://github.com/PureStake/moonbeam/releases/tag/{{ networks.moonbase.version }}). The Moonbeam platform and the [Frontier](https://github.com/paritytech/frontier) components it relies on for Substrate-based Ethereum compatibility are still under very active development. 
    --8<-- 'text/common/assumes-mac-or-ubuntu-env.md'

You can interact with Moonbeam in two ways: by using Substrate RPC endpoints or using Web3-compatible RPC endpoints. The latter endpoints are currently being served from the same RPC server as the Substrate RPCs. In this tutorial, we will use the Web3 RPC endpoints to interact with Moonbeam.

## Install the MetaMask Extension

First, we start with a fresh and default [MetaMask](https://metamask.io/) installation from the Chrome store. After downloading, installing, and initializing the extension, follow the "Get Started" guide. In there, you need to create a wallet, set a password, and store your secret backup phrase (this gives direct access to your funds, so make sure to store these in a secure place). Once completed, we will import the development account:

![Import dev account into MetaMask](/images/metamask/using-metamask-1.png)

The details for the development account that comes pre-funded for this standalone build are as follows:

--8<-- 'text/metamask-local/dev-account.md'

On the import screen, select “Private Key” and paste in the key listed above:

![Paste your account key into MetaMask](/images/metamask/using-metamask-2.png)

You should end up with an imported “Account 2” that looks like this:

![MetaMask displaying your new Account 2](/images/metamask/using-metamask-3.png)

## Connect to the Local Moonbeam Node

Now, let’s connect MetaMask to our locally running Moonbeam node, which will begin to produce blocks as they are authored:

![Standalone Moonbeam Node](/images/metamask/using-metamask-9.png)

If so, in MetaMask, navigate to Settings -> Networks -> Add Network and fill in the following details:

--8<-- 'text/metamask-local/standalone-details.md'

![Enter your new network information into MetaMask](/images/metamask/using-metamask-4.png)

When you hit "save" and exit the network settings screen, MetaMask should be connected to the local Moonbeam standalone node via its Web3 RPC, and you should see the Moonbeam dev account with a balance of 1207925.8196 DEV.

![Your new Moonbeam account with a balance of 123456.123](/images/metamask/using-metamask-5.png)

## Initiating a Transfer

Let’s try sending some tokens with MetaMask.

For simplicity, we will transfer from this dev account to the one created while setting up MetaMask. Click "Send" to initiate the transfer. Consequently, we can use the “Transfer between my accounts” option. Let’s transfer 100 tokens and leave all other settings as they are:

![Initiating a token transfer](/images/metamask/using-metamask-6.png)

Once you have submitted the transaction, you will see it “pending” until it is confirmed, as shown in the following image:

![Transaction confirmation](/images/metamask/using-metamask-7.png)

Note that the Account 2 balance has been decreased by the sent amount + gas fees. Flipping over to Account 1, we see the 100 sent tokens have arrived:

![New balance in Account 1](/images/metamask/using-metamask-8.png)

!!! note
    If you end up resetting your standalone node using the Substrate purge-chain command, you will need to reset your MetaMask genesis account using Settings -> Advanced -> Reset Account. This will clear the transaction history from your accounts and reset the nonce. Make sure you don’t erase anything that you want to keep!

--8<-- '../text/common/we-want-to-hear-from-you.md'
