---
title: Ledger
description: This guide walks you through how to use your Ledger hardware wallet to sign transactions in Moonbeam, leveraging its Ethereum compatibility features
---

# Ledger Hardware Wallet

![Intro diagram](/images/ledger/ledger-banner.png)

## Introduction

Hardware wallets provide a safer way to store crypto funds because the private key (used for signing transactions) is stored offline. Ledger offers two hardware wallet solutions at the time of writing: Ledger Nano S and Ledger Nano X.

Because Moonbeam is fully Ethereum compatible, and Ledger now supports signing in different Chain ID networks, you can use your Ledger device to sign transactions on Moonbeam!

This tutorial shows you how to get started with your Ledger hardware wallet on Moonbase Alpha. The guide only illustrates the steps for a Ledger Nano X device, but you can follow along with a Ledger Nano S as well. The same process can be applied to the other networks of the Moonbeam ecosystem.

## Checking Prerequisites

Before you get started, update [Ledger Live](https://www.ledger.com/ledger-live/download) to the latest version available. Also, make sure you've your Ledger hardware wallet device running the latest firmware. The Ledger support website offers tutorials on how to update the firmware of both [Ledger Nano S](https://support.ledger.com/hc/en-us/articles/360002731113-Update-Ledger-Nano-S-firmware) and [Ledger Nano X](https://support.ledger.com/hc/en-us/articles/360013349800-Update-Ledger-Nano-X-firmware) devices.

Once you are running the latest firmware version, ensure you are running the newest Ethereum application. The Ledger support website offers a tutorial on [how to install the Ethereum app](https://support.ledger.com/hc/en-us/articles/360009576554-Ethereum-ETH-).

At the time of writing, the following versions were used:

 - Ledger Live 2.29
 - Ledger Nano S firmware v2.0.0
 - Ledger Nano X firmware v1.3.0
 - Ethereum app v1.8.5

In addition, you'll need MetaMask as an intermediary between your Ledger device and Moonbase Alpha. Make sure that your MetaMask is [connected to Moonbase Alpha](/integrations/wallets/metamask/). Chrome users (version 91) need some additional steps, which [are detailed in this tutorial](#chrome-browser). Using Firefox will result in a much simpler/straightforward experience.

Please note that your Ledger device will sign transactions in whichever MetaMask network is connected to.

## Importing your Ledger Account to MetaMask

To get started, you need to connect your Ledger device to the computer, unlock it, open the Ethereum application. Next, to import your Ethereum Ledger account to MetaMask, take the following steps:

 1. Click on the top-right logo to expand the menu
 2. Select "Connect Hardware Wallet"

![MetaMask Connect Hardware Wallet](/images/ledger/ledger-images1.png)

In the next screen, you are prompted to select which hardware wallet you'll like to use in MetaMask. At the moment of writing, only Ledger and Trezor hardware wallets are supported. Here, take the following steps:

 1. Select the Ledger logo
 2. Click on "Continue"

![MetaMask Select Ledger Hardware Wallet](/images/ledger/ledger-images2.png)

If MetaMask was able to connect successfully to your Ledger device, you should see a list of five Ethereum-styled accounts. On the contrary, double-check that Ledger Live is closed, you've connected your Ledger device to the computer, unlocked it, and that the Ethereum app is opened. If you are using Chrome, check these [additional steps](#chrome-browser).

From this list of five Ethereum accounts, take the following steps:

 1. Select the accounts you would like to import from your Ledger device
 2. Click on "Unlock"

![MetaMask Select Ethereum Accounts to Import](/images/ledger/ledger-images3.png)

If you've imported your Ledger Ethereum-styled account successfully, you should see it displayed in the main MetaMask screen like shown in the following image:

![MetaMask Successfully Imported Ledger Account](/images/ledger/ledger-images4.png)

You've now successfully imported a Moonbeam compatible account from your Ledger device and are now ready to start [signing transactions using your hardware wallet](#signing-a-transaction-using-your-ledger).

### Chrome Browser

As of Chrome version 91, users that want to connect their Ledger device to MetaMask must be running the latest version of Ledger Live (v2.29 at the time of writing). 

In addition, in MetaMask, they must enable Ledger Live support. To do so, take the following steps:

 1. Expand the top-right menu and go to "Settings"
 2. Navigate to "Advanced"
 3. Enable the "Use Ledger Live" feature

With this feature enabled, MetaMask will open Ledger Live when trying to connect to your Ledger device. You can read more about it in this [MetaMask blog post](https://metamask.zendesk.com/hc/en-us/articles/360020394612-How-to-connect-a-Trezor-or-Ledger-Hardware-Wallet).

## Signing a Transaction Using your Ledger

If you've successfully [imported your Ledger account to MetaMask](#importing-your-ledger-account-to-metamask), you are ready to sign transactions on Moonbeam using your Ledger device. This tutorial will show you how to send a simple transaction on the Moonbase Alpha TestNet, but it applies to other Moonbeam ecosystem networks.

First, make sure your Ledger account is [funded with DEV tokens](/getting-started/moonbase/faucet/). Next, click on the "Send" button.

![MetaMask Ledger Account Funded](/images/ledger/ledger-images5.png)

As you would in a standard transaction, set the recipient address, enter the number of tokens to send, review transaction details and confirm it. This will initiate the transaction signature wizard in your Ledger device. Here, take the following steps:

 1. Click the button to proceed to the next screen. Your Ledger device is only warning you to review the transaction
 2. Check the number of tokens being sent. Please note that the token corresponds to the network MetaMask is connected to. **In this case, it is DEV tokens and not ETH!** When ready, proceed to the next screen
 3. Check the recipient's address and proceed to the next screen
 4. Check the chain ID of the network. This information confirms which network MetaMask is connected to. For example, for Moonbase Alpha, the chain ID is 1287, Moonriver 1285 (not yet live), and Moonbeam 1284 (not yet live). When ready, proceed to the next screen
 5. Check the max fees applicable to this transaction. This is the gas price multiplied by the gas limit you've set on MetaMask. When ready, proceed to the next screen
 6. If you agree with all the transaction details, approve it. This will sign the transaction and will trigger MetaMask to send it. On the contrary, proceed to the next screen
 7. If you don't agree with all the transaction details, reject it. This will cancel the transaction, and MetaMask will mark it as failed

!!! note
    At the time of writing, the token name is always shown as `ETH`. Please note that the token being handled is the one corresponding to the network MetaMask is connected to.

![MetaMask Ledger Transaction Wizard](/images/ledger/ledger-images6.png)

Right after you've approved the transaction, MetaMask sends it to the network. Once the transaction is confirmed, it will be displayed as "Send" on MetaMask's main screen.

![MetaMask Ledger Transaction Wizard](/images/ledger/ledger-images7.png)

And that is it! You've signed a transaction on Moonbase Alpha using your Ledger hardware wallet!

## Interacting with Contracts Using your Ledger

By default, Ledger devices don't admit a `data` field in the transaction object. Consequently, users can't deploy or interact with smart contracts.

However, if you want to use your Ledger hardware wallet for transactions related to smart contracts, you need to change a configuration parameter inside the Ethereum application. To do so, take the following steps:

 1. Open the Ledger Ethereum app
 2. Navigate to "Settings"
 3. Find the "Contract data" page. It should state "NOT allowed" at the bottom
 4. Select/validate the option to change its value to "Allowed"

!!! note
    This option is necessary to use your Ledger device to interact with ERC20 token contracts that might live inside the Moonbeam ecosystem.

![MetaMask Ledger Allow Contracts Tx](/images/ledger/ledger-images8.png)