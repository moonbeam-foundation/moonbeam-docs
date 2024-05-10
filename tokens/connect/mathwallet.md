---
title: Connect MathWallet
description: This guide walks you through how to connect Mathwallet, a browser-based wallet that works with Ethereum, to Moonbeam.
---

# Interacting with Moonbeam Using MathWallet

## Introduction {: #introduction }

MathWallet [announced](https://mathwallet.org/moonbeam-wallet/en) that is now natively supporting each of the [Moonbeam-based networks](/learn/platform/networks/){target=\_blank}. This means that you are now able to interact with any of the networks using another wallet besides MetaMask.

In this tutorial, we'll go through how to setup MathWallet to connect to each of the networks: [Moonbeam](#connect-to-moonbeam), [Moonriver](#connect-to-moonriver), and [Moonbase Alpha](#connect-to-moonbase-alpha). We'll also present a brief example of using MathWallet as a Web3 provider for other tools such as [Remix](/builders/build/eth-api/dev-env/remix/){target=\_blank}.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Checking Prerequisites {: #checking-prerequisites }

First, you need to install the MathWallet browser extension, which you can get from their [website](https://mathwallet.org/en-us){target=\_blank}.

With the browser extension installed, please open it and set a password.

![Set wallet password](/images/tokens/connect/mathwallet/mathwallet-1.webp)

## Connect to Moonbeam {: #connect-to-moonbeam }

To get started with Moonbeam, all you have to do is click **Switch Network** and select **Moonbeam**.

![Switch to Moonbeam](/images/tokens/connect/mathwallet/mathwallet-2.webp)

And that is it, you now have MathWallet connected to Moonbeam! Your wallet should look like this:

<img src="/images/tokens/connect/mathwallet/mathwallet-3.webp" alt="Wallet Connected to Moonbeam" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

Now that you've successfully connected to Moonbeam, you can skip ahead to the [Adding a Wallet](#adding-a-wallet) section to get started creating or importing a wallet.

## Connect to Moonriver {: #connect-to-moonriver }

Getting started with Moonriver is a straightforward process. All you have to do is click **Switch Network** and select **Moonriver**.

![Connect to Moonriver](/images/tokens/connect/mathwallet/mathwallet-4.webp)

And that is it, you now have MathWallet connected to Moonriver! Your wallet should look like this:

<img src="/images/tokens/connect/mathwallet/mathwallet-5.webp" alt="Wallet Connected to Moonrive" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

Now that you've successfully connected to Moonriver, you can skip ahead to the [Adding a Wallet](#adding-a-wallet) section to get started creating or importing a wallet.

## Connect to Moonbase Alpha {: #connect-to-moonbase-alpha }

In this part, we'll go through the process of connecting MathWallet to Moonbase Alpha. First you'll need to enable Moonbase Alpha. To do so, go to the settings by clicking on the gear icon. Then click on **Networks** and scroll down through the **Ethereum** section until you find **Moonbase Alpha** and toggle the switch.

![Enable Moonbase Alpha](/images/tokens/connect/mathwallet/mathwallet-6.webp)

Lastly you'll need to switch to Moonbase Alpha. From the main screen, click **Switch Network** and select **Moonbase Alpha**.

![Connect to Moonbase Alpha](/images/tokens/connect/mathwallet/mathwallet-7.webp)

And that is it, you now have MathWallet connected to the Moonbase Alpha TestNet! Your wallet should look like this:

![Wallet Connected to Moonbase Alpha](/images/tokens/connect/mathwallet/mathwallet-8.webp)

Now that you've successfully connected to Moonbase Alpha, you can move on to the [Adding a Wallet](#adding-a-wallet) section to get started creating or importing a wallet.

## Adding a Wallet {: #adding-a-wallet }

The following steps will show you how to interact with the Moonbase Alpha TestNet, but can also be used to interact with Moonbeam and Moonriver.

After you are connected to Moonbase Alpha, you can now create a wallet to get an account and start interacting with the TestNet. Currently, there are three ways to add a wallet:

 - Create a wallet
 - Import an existing wallet using a mnemonic or private key
 - Connect hardware wallet (_not supported for now_)

### Create a Wallet {: #create-a-wallet }

The following steps for creating a wallet can be modified for Moonbeam and Moonriver.

To create a new wallet, click the :heavy_plus_sign: sign next to **Moonbase Alpha** and select **Create Wallet**.

![MathWallet create a wallet](/images/tokens/connect/mathwallet/mathwallet-9.webp)

Set and confirm a wallet name. Next, make sure you safely store the mnemonic, as it provides direct access to your funds. Once you have completed the process, you should see your newly created wallet with its associated public address.

![MathWallet wallet created](/images/tokens/connect/mathwallet/mathwallet-10.webp)

### Import a Wallet {: #import-a-wallet }

To create a new wallet, click the :heavy_plus_sign: sign next to **Moonbase Alpha** and select **Import Wallet**.

![MathWallet import a wallet](/images/tokens/connect/mathwallet/mathwallet-11.webp)

Next, select between importing using a mnemonic or a private key. For the first option, enter the mnemonic word by word, separated by spaces. For the second option, enter the private key (either with the `0x` prefix or not, it works both ways).

![MathWallet private key or mnemonic import](/images/tokens/connect/mathwallet/mathwallet-12.webp)

After clicking next, set a wallet name, and that is it! You should see your imported wallet with its associated public address.

![MathWallet imported wallet](/images/tokens/connect/mathwallet/mathwallet-13.webp)

## Using MathWallet {: #using-mathwallet }

MathWallet serves as a Web3 provider in tools such as [Remix](/builders/build/eth-api/dev-env/remix/). By having MathWallet connected to Moonbase Alpha or Moonriver, you can deploy contracts as you would like using MetaMask, signing the transactions with MathWallet instead.

For example, in Remix, when deploying a smart contract to Moonbase Alpha, make sure you select the **Injected Web3** option in the **ENVIRONMENT** menu. If you have MathWallet connected, you will see the TestNet chain ID just below the box (_{{ networks.moonbase.chain_id }}_) and your MathWallet account injected into Remix as well. When sending a transaction, you should see a similar pop-up from MathWallet:

![MathWallet sign transaction](/images/tokens/connect/mathwallet/mathwallet-14.webp)

By clicking on **Accept** you are signing this transaction, and the contract will be deployed to the Moonbase Alpha TestNet.

--8<-- 'text/_disclaimers/third-party-content.md'
