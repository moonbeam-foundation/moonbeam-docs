---
title: Nifty Wallet
description: This guide walks you through how to connect Nifty Wallet, a browser-based wallet that works with Ethereum, to Moonbeam.
---

# Interacting with Moonbeam Using Nifty Wallet
 
![Intro banner](/images/nifty/nifty-banner.png)

## Introduction

[Nifty Wallet](https://www.poa.network/for-users/nifty-wallet) is a POA wallet, initially forked from MetaMask, and extended for interaction with POA features. Since Nifty is Ethereum compatible, it can also be used on Moonbeam. 

Please be aware that Nifty Wallet is beta software and it is recommended to sign out when you're done using a site.

This tutorial will cover how to setup Nifty Wallet to connect to our TestNet, Moonbase Alpha.

## Creating a Wallet

First, you need to install the [Nifty Wallet browser extension](https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid?hl=en) from the Chrome web store.

With the browser extension installed, please open it and set a password.

![Set wallet password](/images/nifty/nifty-images-1.png)

After creating a password, a vault will be created for your account and seed words to restore your account will be generated. You'll be prompted to save the generated seed words. You can choose to save the seed words as a file or if you decide to save them another way, you can proceed by clicking "I've copied it somewhere safe". 

## Connect Nifty Wallet to Moonbeam

Once you've created an account, you can now connect to the Moonbase Alpha TestNet by creating a custom network. 

Navigate to the settings, in the top left corner, click on the POA dropdown. Scroll down to the bottom and select Custom RPC.
  
![Create Custom RPC](/images/nifty/nifty-images-2.png)

Enter the RPC URL for Moonbase Alpha in the New RPC URL Field: `https://rpc.testnet.moonbeam.network`. Then click "Save".

![Connect to Moonbase Alpha](/images/nifty/nifty-images-3.png)

The current RPC should change to the Moonbase Alpha RPC URL, and in the top left corner you'll see the network has changed to "Private Network".

![Wallet Connected to Moonbase Alpha](/images/nifty/nifty-images-4.png)

And that is it, you now have Nifty Wallet connected to the Moonbase Alpha TestNet!

## Using Nifty Wallet

Nifty Wallet serves as a Web3 provider in tools such as [Remix](/integrations/remix/). By having Nifty Wallet connected to Moonbase Alpha, you can deploy contracts as you would like using MetaMask, signing the transactions with Nifty instead. 

For example, in Remix, when deploying a smart contract, make sure you select the "Injected Web3" option in the "Environment" menu. If you have Nifty Wallet connected, you will see the TestNet chain ID just below the box (_1287_) and your Nifty Wallet account injected into Remix as well. When sending a transaction, you should see a similar pop-up from Nifty:

![Nifty sign transaction](/images/nifty/nifty-images-5.png)

Ensure you have DEV tokens in your account and, if necessary, head to the faucet to obtain some tokens. By clicking on "Submit," you are signing this transaction, and the contract will be deployed to the Moonbase Alpha TestNet.

Please note that although your account balance shows ETH, it is not real ETH, and just DEV tokens. 

The transaction will be displayed under the "Sent" tab.

![Nifty confirmed transaction](/images/nifty/nifty-images-6.png)


## Create a New Account

To create a new account, click the user icon in the top right corner and select "Create Account".

![Nifty create an account](/images/nifty/nifty-images-7.png)

## Import an Account

To create a new wallet, click the user icon in the top right corner and select "Import Account".

![Nifty import an account](/images/nifty/nifty-images-7.png)

Next, select the type of import from the dropdown and enter the necessary details to import your account. For example, if you choose to import with a private key, paste your private key in the input field and click "Import".

![MathWallet private key or mnemonic import](/images/nifty/nifty-images-8.png)

