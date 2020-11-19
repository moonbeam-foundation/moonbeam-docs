---
title: Using MetaMask
description: This tutorial walks you through how to interact with a local Moonbeam node using a default installation of the MetaMask browser plug-in.
---

# Interacting with a Moonbeam Node Using MetaMask

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed//hrpBd2-a7as' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style><div class='caption'>You can find all of the relevant code for this tutorial on the [code snippets page](/resources/code-snippets/)</div>

## Introduction

This guide outlines steps for using a self-contained Moonbeam standalone node to send tokens between accounts with MetaMask. If you haven’t already set up your own local dev node, refer to [this tutorial](/getting-started/setting-up-a-node/) or follow the instructions in the [GitHub repository](https://github.com/PureStake/moonbeam/tree/moonbeam-tutorials).

!!! note
    This tutorial was created using the v3 release of [Moonbase Alpha](https://github.com/PureStake/moonbeam/releases/tag/v0.3.0). The Moonbeam platform, and the [Frontier](https://github.com/paritytech/frontier) components it relies on for Substrate-based Ethereum compatibility, are still under very active development. The examples in this guide assume an Ubuntu 18.04-based environment and will need to be adapted accordingly for MacOS or Windows.

You can interact with Moonbeam in two ways: using Substrate RPC endpoints, or by using Web3-compatible RPC endpoints. The latter endpoints are currently being served from the same RPC server as the Substrate RPCs. In this tutorial, we will use the Web3 RPC endpoints to interact with Moonbeam.

## Install the MetaMask Extension

First, we start with a fresh and default [MetaMask](https://metamask.io/) installation from the Chrome store. After downloading, installing and initializing the extension, follow the "Get Started" guide. In there, you need to create a wallet, set a password, and store your secret backup phrase (this gives direct access to your funds, so make sure to store these in a secure place). Once completed, we will import the development account:

![Import dev account into MetaMask](/images/metamask/using-metamask-1.png)

The details for the development account that comes pre-funded for this standalone build are as follows:

-  Private key: `99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342`
-  Public address: `0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b`

On the import screen, select “Private Key” and paste in the key listed above:

![Paste your account key into MetaMask](/images/metamask/using-metamask-2.png)

You should end up with an imported “Account 2” that looks like this:

![MetaMask displaying your new Account 2](/images/metamask/using-metamask-3.png)

## Connect to the Local Moonbeam Node

Now let’s connect MetaMask to our locally running Moonbeam node, which should be producing blocks:

![Standalone Moonbeam Node](/images/metamask/using-metamask-9.png)

If so, in MetaMask, navigate to Settings -> Networks -> Add Network and fill in the following details:

-  Network Name: `Moonbeam Dev`
-  New RPC URL: `http://127.0.0.1:9933`
-  ChainID: `1281`
-  Symbol (Optional): DEV

![Enter your new network information into MetaMask](/images/metamask/using-metamask-4.png)

When you hit "save" and exit the network settings screen, MetaMask should be connected to the local Moonbeam standalone node via its Web3 RPC, and you should see the Moonbeam dev account with a balance of 1208925.8196 DEV.

![Your new Moonbeam account with a balance of 123456.123](/images/metamask/using-metamask-5.png)

## Initiating a Transfer

Let’s try sending some tokens with MetaMask.

For simplicity, we will transfer from this dev account to the one created while setting up MetaMask. Consequently, we can use the “Transfer between my accounts” option. Let’s transfer 100 tokens and leave all other settings as they are:

![Initiating a token transfer](/images/metamask/using-metamask-6.png)

Once you have submitted the transaction, you will see it “pending” until it is confirmed, as shown in the following image:

![Transaction confirmation](/images/metamask/using-metamask-7.png)

Note that the Account 2 balance has been decreased by the sent amount + gas fees. Flipping over to Account 1, we see the 100 sent tokens have arrived:

![New balance in Account 1](/images/metamask/using-metamask-8.png)

!!! note
    If you end up resetting your standalone node using the Substrate purge-chain command, you will need to reset your MetaMask genesis account using Settings -> Advanced -> Reset Account. This will clear the transaction history from your accounts and reset the nonce. Make sure you don’t erase anything you want to keep!

## We Want to Hear From You

This is obviously a simple example, but it provides context for how you can start working with Moonbeam and how you can try out its Ethereum compatibility features. We are interested in hearing about your experience following the steps in this guide or your experience trying other Ethereum-based tools with Moonbeam. Feel free to join us in the [Moonbeam Discord here](https://discord.gg/PfpUATX). We would love to hear your feedback on Moonbeam and answer any questions that you have.
