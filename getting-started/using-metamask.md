---
title: Using MetaMask
description: Learn how to interact with the Moonbeam node using the MetaMask browser plug-in.
hero: Getting Started with Moonbeam
---
#Interacting with a Moonbeam Node Using MetaMask  
##Introduction  
This guide outlines steps for using a self-contained Moonbeam dev node to send tokens between EVM accounts with MetaMask.  If you haven’t already set up your own local dev node, refer to [this tutorial](/getting-started/setting-up-a-node/) or follow the instructions in the [GitHub repository](https://github.com/PureStake/moonbeam).

!!! note
    This tutorial was created using the pre-alpha release of [Moonbeam](https://github.com/PureStake/moonbeam/tree/crystalin-moonbeam-frontier). The Moonbeam platform, and the [Frontier](https://github.com/paritytech/frontier) components it relies on for Substrate-based Ethereum compatibility, are still under very active development.  We have created this tutorial so you can test out Moonbeam’s Ethereum compatibility features.  Even though we are still in development, we believe it’s important that interested community members and developers have the opportunity to start to try things with Moonbeam and provide feedback.

The examples in this guide assume an Ubuntu 18.04-based environment and will need to be adapted accordingly for MacOS or Windows.

You can interact with Moonbeam in two ways: using Substrate RPC endpoints, or by using Web3-compatible RPC endpoints.  The latter endpoints are currently being served from the same RPC server as the Substrate RPCs.  In this tutorial, we will use the Web3 RPC endpoints to interact with Moonbeam.

##Install the MetaMask Extension
First, we start with a fresh and default MetaMask installation from the Chrome store, which is where we will import our dev account:

![Import dev account into MetaMask](/images/using-metamask-1.png)

The details for the dev account for this example are:

Address: `0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b`

Key: `99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342`

On the import screen, select “Private Key” and paste in the key listed above:

![Paste your account key into MetaMask](/images/using-metamask-2.png)

You should end up with an imported “Account 2” that looks like this:

![MetaMask displaying your new Account 2](/images/using-metamask-3.png)

##Connect to the Local Moonbeam Node  
Now let’s connect MetaMask to our locally running Moonbeam node.  

Navigate to Settings -> Networks -> Add Network and fill in the following details:

Network Name: `Moonbeam Dev`
New RPC URL: `http://127.0.0.1:9933`
ChainID: `43`

![Enter your new network information into MetaMask](/images/using-metamask-4.png)

When you hit "save" and exit the network settings screen, MetaMask should be connected to the local Moonbeam dev node via its Web3 RPC, and you should see the Moonbeam dev account with a balance of 123456.123 ETH.

![Your new Moonbeam account with a balance of 123456.123](/images/using-metamask-5.png)

##Initiating a Transfer
Let’s try sending some tokens with MetaMask.  

For simplicity, I will transfer from this dev account to the default MetaMask account that came with my installation using the “Transfer between my accounts” option.  Let’s transfer 100 tokens and leave all other settings at the default:

![Initiating a token transfer](/images/using-metamask-6.png)

Once you submit, you will see the transaction in the “pending” state until it is confirmed like this:

![Transaction confirmation](/images/using-metamask-7.png)

Note that the Account 2 balance has been decreased by the sent amount + gas fees.  Flipping over to Account 1, we see the 100 sent tokens have arrived:

![New balance in Account 1](/images/using-metamask-8.png)

!!! note
    If you end up resetting your dev node using the Substrate purge-chain command, you will need to reset your MetaMask dev account using Settings -> Advanced -> Reset Account.  This will clear the transaction history from your accounts and reset the nonce. Make sure you don’t erase anything you want to keep!

##We Want to Hear From You
This is obviously a simple example, but it provides context for how you can start working with Moonbeam and how you can try out its Ethereum compatibility features.  We are interested in hearing about your experience following the steps in this guide or your experience trying other Ethereum-based tools with Moonbeam.  Feel free to join us in the [Moonbeam Riot room here](https://matrix.to/#/!dzULkAiPePEaverEEP:matrix.org?via=matrix.org&via=web3.foundation).  We would love to hear your feedback on Moonbeam and answer any questions that you have.  
	
