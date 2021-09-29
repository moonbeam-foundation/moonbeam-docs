---
title: Using MathWallet
description: This guide walks you through how to connect Mathwallet, a browser-based wallet that works with Ethereum, to Moonbeam.
---

# Interacting with Moonbeam Using MathWallet
 
![Intro banner](/images/mathwallet/mathwallet-banner.png)

## Introduction {: #introduction } 

MathWallet [announced](https://mathwallet.org/moonbeam-wallet/en/) that is now natively supporting the [Moonbase Alpha TestNet](/learn/platform/networks/moonbase/) and [Moonriver](/learn/platform/networks/moonriver/). This means that you are now able to interact with Moonbase Alpha and Moonriver using another wallet besides MetaMask.

In this tutorial, we'll go through how to setup MathWallet to connect to our [TestNet](#connect-to-moonbase-alpha) and [Moonriver](#connect-to-moonriver). We'll also present a brief example of using MathWallet as a Web3 provider for other tools such as [Remix](/builders/tools/remix/).

## Checking Prerequisites {: #checking-prerequisites } 

First, you need to install the MathWallet browser extension installed, which you can get from their [website](https://mathwallet.org/en-us/).

With the browser extension installed, please open it and set a password.

![Set wallet password](/images/mathwallet/mathwallet-images-1.png)

## Connect to Moonbase Alpha {: #connect-to-moonbase-alpha } 

In this part, we'll go through the process of connecting MathWallet to Moonbase Alpha. Enable Moonbase Alpha under Settings (top right gear icon) -> Networks -> Ethereum.

![Enable Moonbase Alpha](/images/mathwallet/mathwallet-images-2.png)

And lastly, on the main screen, click Switch Network and select Moonbase Alpha

![Connect to Moonbase Alpha](/images/mathwallet/mathwallet-images-3.png)

And that is it, you now have MathWallet connected to the Moonbase Alpha TestNet! Your wallet should look like this:

![Wallet Connected to Moonbase Alpha](/images/mathwallet/mathwallet-images-4.png)

## Connect to Moonriver {: #connect-to-moonriver } 

Getting started with Moonriver is a straightforward process. All you have to do is click Switch Network and select Moonriver

![Connect to Moonriver](/images/mathwallet/mathwallet-images-5.png)

And that is it, you now have MathWallet connected to Moonriver! Your wallet should look like this:

![Wallet Connected to Moonriver](/images/mathwallet/mathwallet-images-6.png)

## Adding a Wallet {: #adding-a-wallet } 

The following steps will show you how to interact with the Moonbase Alpha TestNet, but can also be used to interact with Moonriver.

After you are connected to Moonbase Alpha, you can now create a wallet to get an account and start interacting with the TestNet. Currently, there are three ways to add a wallet:

 - Create a wallet
 - Import an existing wallet using a mnemonic or private key
- Connect hardware wallet (_not supported for now_)

### Create a wallet {: #create-a-wallet } 

The following steps for creating a wallet can be modified for Moonriver

To create a new wallet, click the :heavy_plus_sign: sign next to "Moonbase Alpha" and select "Create Wallet".

![MathWallet create a wallet](/images/mathwallet/mathwallet-images-7.png)

Set and confirm a wallet name. Next, make sure you safely store the mnemonic, as it provides direct access to your funds. Once you have completed the process, you should see your newly created wallet with its associated public address.

![MathWallet wallet created](/images/mathwallet/mathwallet-images-8.png)

### Import a wallet {: #import-a-wallet } 

To create a new wallet, click the :heavy_plus_sign: sign next to "Moonbase Alpha" and select "Import Wallet".

![MathWallet import a wallet](/images/mathwallet/mathwallet-images-9.png)

Next, select between importing using a mnemonic or a private key. For the first option, enter the mnemonic word by word, separated by spaces. For the second option, enter the private key (either with the `0x` prefix or not, it works both ways).

![MathWallet private key or mnemonic import](/images/mathwallet/mathwallet-images-10.png)

After clicking next, set a wallet name, and that is it! You should see your imported wallet with its associated public address.

![MathWallet imported wallet](/images/mathwallet/mathwallet-images-11.png)

## Using MathWallet {: #using-mathwallet } 

MathWallet serves as a Web3 provider in tools such as [Remix](/builders/tools/remix/). By having MathWallet connected to Moonbase Alpha or Moonriver, you can deploy contracts as you would like using MetaMask, signing the transactions with MathWallet instead.

For example, in Remix, when deploying a smart contract to Moonbase Alpha, make sure you select the "Injected Web3" option in the "Environment" menu. If you have MathWallet connected, you will see the TestNet chain ID just below the box (_{{ networks.moonbase.chain_id }}_) and your MathWallet account injected into Remix as well. When sending a transaction, you should see a similar pop-up from MathWallet:

![MathWallet sign transaction](/images/mathwallet/mathwallet-images-12.png)

By clicking on "Accept," you are signing this transaction, and the contract will be deployed to the Moonbase Alpha TestNet.

