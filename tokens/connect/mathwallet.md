---
title: Using MathWallet
description: This guide walks you through how to connect Mathwallet, a browser-based wallet that works with Ethereum, to Moonbeam.
---

# Interacting with Moonbeam Using MathWallet
 
![Intro banner](/images/tokens/connect/mathwallet/mathwallet-banner.png)

## Introduction {: #introduction } 

MathWallet [announced](https://mathwallet.org/moonbeam-wallet/en/) that is now natively supporting each of the [Moonbeam-based networks](/learn/platform/networks). This means that you are now able to interact with any of the networks using another wallet besides MetaMask.

In this tutorial, we'll go through how to setup MathWallet to connect to each of the networks: [Moonbeam](#connect-to-moonbeam), [Moonriver](#connect-to-moonriver), and [Moonbase Alpha](#connect-to-moonbase-alpha). We'll also present a brief example of using MathWallet as a Web3 provider for other tools such as [Remix](/builders/tools/remix/).

## Checking Prerequisites {: #checking-prerequisites } 

First, you need to install the MathWallet browser extension, which you can get from their [website](https://mathwallet.org/en-us/).

With the browser extension installed, please open it and set a password.

![Set wallet password](/images/tokens/connect/mathwallet/mathwallet-1.png)

## Connect to Moonbeam {: #connect-to-moonbeam } 

To get started with Moonbeam, you will need to add a custom network. To get started click on the settings gear. Then select **Networks**. Scroll down to the bottom of the **Ethereum** section, and add click **Custom**.

![Create custom network]()

Next you will be able to enter in the network configurations for Moonbeam:

1. Make sure **Ethereum** is selected
2. Enter "Moonbeam" for the **Name**
3. Enter the Moonbeam RPC URL for the **Node Address** ({{ networks.moonbeam.rpc_url }})
4. Click **Confirm**

![Add Moonbeam as a custom network]()

Once you've added the network you will need to switch to it. Go back to the main screen, and click on **Switch Network**, and then select **Moonbeam**.

![Select Moonbeam]()

And that is it, you now have MathWallet connected to Moonbeam! Your wallet should look like this:

![Wallet Connected to Moonbeam]()

Eventually this process will be improved upon, and it will be similar to connecting to Moonriver.

Now that you've successfully connected to Moonbeam, you can skip ahead to the [Adding a Wallet](#adding-a-wallet) section to get started creating or importing a wallet.

## Connect to Moonriver {: #connect-to-moonriver } 

Getting started with Moonriver is a straightforward process. All you have to do is click **Switch Network** and select **Moonriver**

![Connect to Moonriver](/images/tokens/connect/mathwallet/mathwallet-5.png)

And that is it, you now have MathWallet connected to Moonriver! Your wallet should look like this:

![Wallet Connected to Moonriver](/images/tokens/connect/mathwallet/mathwallet-6.png)

Now that you've successfully connected to Moonriver, you can skip ahead to the [Adding a Wallet](#adding-a-wallet) section to get started creating or importing a wallet.

## Connect to Moonbase Alpha {: #connect-to-moonbase-alpha } 

In this part, we'll go through the process of connecting MathWallet to Moonbase Alpha. First you'll need to enable Moonbase Alpha. To do so, go to the settings by clicking on the gear icon. Then click on **Networks** and scroll down through the **Ethereum** section until you find **Moonbase Alpha** and toggle the switch.

![Enable Moonbase Alpha](/images/tokens/connect/mathwallet/mathwallet-2.png)

Lastly you'll need to switch to Moonbase Alpha. From the main screen, click **Switch Network** and select **Moonbase Alpha**.

![Connect to Moonbase Alpha](/images/tokens/connect/mathwallet/mathwallet-3.png)

And that is it, you now have MathWallet connected to the Moonbase Alpha TestNet! Your wallet should look like this:

![Wallet Connected to Moonbase Alpha](/images/tokens/connect/mathwallet/mathwallet-4.png)

Now that you've successfully connected to Moonbase Alpha, you can move on to the [Adding a Wallet](#adding-a-wallet) section to get started creating or importing a wallet.

## Adding a Wallet {: #adding-a-wallet } 

The following steps will show you how to interact with the Moonbase Alpha TestNet, but can also be used to interact with Moonbeam and Moonriver.

After you are connected to Moonbase Alpha, you can now create a wallet to get an account and start interacting with the TestNet. Currently, there are three ways to add a wallet:

 - Create a wallet
 - Import an existing wallet using a mnemonic or private key
 - Connect hardware wallet (_not supported for now_)

### Create a Wallet {: #create-a-wallet } 

The following steps for creating a wallet can be modified for Moonriver

To create a new wallet, click the :heavy_plus_sign: sign next to **Moonbase Alpha** and select **Create Wallet**.

![MathWallet create a wallet](/images/tokens/connect/mathwallet/mathwallet-7.png)

Set and confirm a wallet name. Next, make sure you safely store the mnemonic, as it provides direct access to your funds. Once you have completed the process, you should see your newly created wallet with its associated public address.

![MathWallet wallet created](/images/tokens/connect/mathwallet/mathwallet-8.png)

### Import a Wallet {: #import-a-wallet } 

To create a new wallet, click the :heavy_plus_sign: sign next to **Moonbase Alpha** and select **Import Wallet**.

![MathWallet import a wallet](/images/tokens/connect/mathwallet/mathwallet-9.png)

Next, select between importing using a mnemonic or a private key. For the first option, enter the mnemonic word by word, separated by spaces. For the second option, enter the private key (either with the `0x` prefix or not, it works both ways).

![MathWallet private key or mnemonic import](/images/tokens/connect/mathwallet/mathwallet-10.png)

After clicking next, set a wallet name, and that is it! You should see your imported wallet with its associated public address.

![MathWallet imported wallet](/images/tokens/connect/mathwallet/mathwallet-11.png)

## Using MathWallet {: #using-mathwallet } 

MathWallet serves as a Web3 provider in tools such as [Remix](/builders/tools/remix/). By having MathWallet connected to Moonbase Alpha or Moonriver, you can deploy contracts as you would like using MetaMask, signing the transactions with MathWallet instead.

For example, in Remix, when deploying a smart contract to Moonbase Alpha, make sure you select the **Injected Web3** option in the **Environment** menu. If you have MathWallet connected, you will see the TestNet chain ID just below the box (_{{ networks.moonbase.chain_id }}_) and your MathWallet account injected into Remix as well. When sending a transaction, you should see a similar pop-up from MathWallet:

![MathWallet sign transaction](/images/tokens/connect/mathwallet/mathwallet-12.png)

By clicking on **Accept** you are signing this transaction, and the contract will be deployed to the Moonbase Alpha TestNet.

