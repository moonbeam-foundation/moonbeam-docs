---
title: Using Ledger
description: This guide walks you through how to use your Ledger hardware wallet to sign transactions in Moonbeam, leveraging its Ethereum compatibility features
---

# Interacting with Moonbeam Using Ledger Hardware Wallet

![Intro diagram](/images/ledger/ledger-banner.png)

## Introduction {: #introduction } 

Hardware wallets provide a safer way to store crypto funds because the private key (used for signing transactions) is stored offline. Ledger offers two hardware wallet solutions at the time of writing: Ledger Nano S and Ledger Nano X.

Because Moonbeam is fully Ethereum compatible, and Ledger now supports signing in different Chain ID networks, you can use your Ledger device to sign transactions on Moonbeam!

This tutorial shows you how to get started with your Ledger hardware wallet on Moonbase Alpha. The guide only illustrates the steps for a Ledger Nano X device, but you can follow along with a Ledger Nano S as well. The same process can be applied to the other networks of the Moonbeam ecosystem.

## Checking Prerequisites {: #checking-prerequisites } 

Before you get started, update [Ledger Live](https://www.ledger.com/ledger-live/download) to the latest version available. Also, make sure you've your Ledger hardware wallet device running the latest firmware. The Ledger support website offers tutorials on how to update the firmware of both [Ledger Nano S](https://support.ledger.com/hc/en-us/articles/360002731113-Update-Ledger-Nano-S-firmware) and [Ledger Nano X](https://support.ledger.com/hc/en-us/articles/360013349800-Update-Ledger-Nano-X-firmware) devices.

Once you are running the latest firmware version, ensure you are running the newest Ethereum application. The Ledger support website offers a tutorial on [how to install the Ethereum app](https://support.ledger.com/hc/en-us/articles/360009576554-Ethereum-ETH-).

At the time of writing, the following versions were used:

 - Ledger Live 2.29
 - Ledger Nano S firmware v2.0.0
 - Ledger Nano X firmware v1.3.0
 - Ethereum app v1.8.5

In addition, you'll need MetaMask as an intermediary between your Ledger device and Moonbase Alpha. Make sure that your MetaMask is [connected to Moonbase Alpha](/tokens/connect/metamask/). Chrome users (version 91) need some additional steps, which [are detailed in this tutorial](#chrome-browser). Using Firefox will result in a much simpler/straightforward experience.

Please note that your Ledger device will sign transactions in whichever MetaMask network is connected to.

## Importing your Ledger Account to MetaMask {: #importing-your-ledger-account-to-metamask } 

To get started, you need to connect your Ledger device to the computer, unlock it, open the Ethereum application. Next, to import your Ethereum Ledger account to MetaMask, take the following steps:

 1. Click on the top-right logo to expand the menu
 2. Select "Connect Hardware Wallet"

![MetaMask Connect Hardware Wallet](/images/ledger/ledger-images1.png)

In the next screen, you are prompted to select which hardware wallet you'll like to use in MetaMask. At the moment of writing, only Ledger and Trezor hardware wallets are supported. Here, take the following steps:

 1. Select the Ledger logo
 2. Click on "Continue"

![MetaMask Select Ledger Hardware Wallet](/images/ledger/ledger-images2.png)

If MetaMask was able to connect successfully to your Ledger device, you should see a list of five Ethereum-styled accounts. If not, double-check that Ledger Live is closed, you've connected your Ledger device to the computer, unlocked it, and that the Ethereum app is opened. If you are using Chrome, check these [additional steps](#chrome-browser).

### Import Accounts {: #import-accounts } 

From this list of five Ethereum accounts, take the following steps:

 1. Select the accounts you would like to import from your Ledger device
 2. Click on "Unlock"

![MetaMask Select Ethereum Accounts to Import](/images/ledger/ledger-images3.png)

If you've imported your Ledger Ethereum-styled account successfully, you should see it displayed in the main MetaMask screen like shown in the following image:

![MetaMask Successfully Imported Ledger Account](/images/ledger/ledger-images4.png)

You've now successfully imported a Moonbeam compatible account from your Ledger device and are now ready to start [signing transactions using your hardware wallet](#signing-a-transaction-using-your-ledger).

## Chrome Browser {: #chrome-browser } 

As of Chrome version 91, users that want to connect their Ledger device to MetaMask must be running the latest version of Ledger Live (v2.29 at the time of writing). 

### Enable Ledger Live Support in Metamask {: #enable-ledger-live-support-in-metamask } 

In MetaMask, take the following steps:

 1. Expand the top-right menu and go to "Settings"
 2. Navigate to "Advanced"
 3. Enable the "Use Ledger Live" feature

### Enable Device Access {: #enable-device-access } 

Next, allow Ledger Live to connect to your device by following these steps:

 1. Click on the top-right logo to expand the Metamask menu
 2. Select "Connect Hardware Wallet"
 3. Allow Chrome permission to open Ledger Live
 4. Click "Open" in the Ledger Live App
 5. Open the Ethereum App on your Ledger Device and resume [importing accounts](#import-accounts)

 ![Allow Ledger Live to connect your Ledger Device](/images/ledger/ledger-images5.png)

With this feature enabled, MetaMask will open Ledger Live when trying to connect to your Ledger device. You can read more about it in this [MetaMask blog post](https://metamask.zendesk.com/hc/en-us/articles/360020394612-How-to-connect-a-Trezor-or-Ledger-Hardware-Wallet).

## Signing a Transaction Using your Ledger {: #signing-a-transaction-using-your-ledger } 

If you've successfully [imported your Ledger account to MetaMask](#importing-your-ledger-account-to-metamask), you are ready to sign transactions on Moonbeam using your Ledger device. This tutorial will show you how to send a simple transaction on the Moonbase Alpha TestNet, but it applies to other Moonbeam ecosystem networks.

First, make sure your Ledger account is [funded with DEV tokens](/builders/get-started/moonbase/#get-tokens/). Next, click on the "Send" button.

![MetaMask Ledger Account Funded](/images/ledger/ledger-images6.png)

As you would in a standard transaction, set the recipient address, enter the number of tokens to send, review transaction details and confirm it. This will initiate the transaction signature wizard in your Ledger device. Here, take the following steps:

 1. Click the button to proceed to the next screen. Your Ledger device is only warning you to review the transaction
 2. Check the number of tokens being sent. Please note that the token corresponds to the network MetaMask is connected to. **In this case, it is DEV tokens and not ETH!** When ready, proceed to the next screen
 3. Check the recipient's address and proceed to the next screen
 4. Check the chain ID of the network. This information confirms which network MetaMask is connected to. For example, for Moonbase Alpha, the chain ID is {{ networks.moonbase.chain_id }} (hex: {{ networks.moonbase.hex_chain_id}}), Moonriver {{ networks.moonriver.chain_id }} (hex: {{ networks.moonriver.hex_chain_id }}), and Moonbeam 1284 (not yet live). When ready, proceed to the next screen
 5. Check the max fees applicable to this transaction. This is the gas price multiplied by the gas limit you've set on MetaMask. When ready, proceed to the next screen
 6. If you agree with all the transaction details, approve it. This will sign the transaction and will trigger MetaMask to send it. If not, proceed to the next screen
 7. If you don't agree with all the transaction details, reject it. This will cancel the transaction, and MetaMask will mark it as failed

!!! note
    At the time of writing, the token name is always shown as `ETH`. Please note that the token being handled is the one corresponding to the network MetaMask is connected to.

![MetaMask Ledger Transaction Wizard](/images/ledger/ledger-images7.png)

Right after you've approved the transaction, MetaMask sends it to the network. Once the transaction is confirmed, it will be displayed as "Send" on MetaMask's main screen.

![MetaMask Ledger Transaction Wizard](/images/ledger/ledger-images8.png)

And that is it! You've signed a transaction on Moonbase Alpha using your Ledger hardware wallet!

## Interacting with Contracts Using your Ledger {: #interacting-with-contracts-using-your-ledger } 

By default, Ledger devices don't admit a `data` field in the transaction object. Consequently, users can't deploy or interact with smart contracts.

However, if you want to use your Ledger hardware wallet for transactions related to smart contracts, you need to change a configuration parameter inside the Ethereum application. To do so, take the following steps:

 1. Open the Ledger Ethereum app
 2. Navigate to "Settings"
 3. Find the "Contract data" page. It should state "NOT allowed" at the bottom
 4. Select/validate the option to change its value to "Allowed"

!!! note
    This option is necessary to use your Ledger device to interact with ERC20 token contracts that might live inside the Moonbeam ecosystem.

![MetaMask Ledger Allow Contracts Tx](/images/ledger/ledger-images9.png)