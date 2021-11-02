---
title: Using Ledger
description: This guide walks you through how to use your Ledger hardware wallet to sign transactions in Moonbeam, leveraging its Ethereum compatibility features
---

# Interacting with Moonbeam Using Ledger Hardware Wallet

![Intro diagram](/images/tokens/connect/ledger/ledger-banner.png)

## Introduction {: #introduction } 

Hardware wallets provide a safer way to store crypto funds because the private key (used for signing transactions) is stored offline. Ledger offers two hardware wallet solutions at the time of writing: Ledger Nano S and Ledger Nano X.

With the release of the Moonriver app on Ledger Live, you can now use your Ledger device to sign transactions on Moonriver without having to deal with chain configurations. If you want to use your Ledger device with one of the other Moonbeam-based networks, you can use the Ethereum app on Ledger Live by setting the chain ID. 

In this tutorial, you will learn how to get started with your Ledger hardware wallet on Moonbeam. This guide only illustrates the steps for a Ledger Nano X device, but you can follow along with a Ledger Nano S as well. 

## Checking Prerequisites {: #checking-prerequisites } 

Before you get started, update [Ledger Live](https://www.ledger.com/ledger-live/download) to the latest version available. Also, make sure you've your Ledger hardware wallet device running the latest firmware. The Ledger support website offers tutorials on how to update the firmware of both [Ledger Nano S](https://support.ledger.com/hc/en-us/articles/360002731113-Update-Ledger-Nano-S-firmware) and [Ledger Nano X](https://support.ledger.com/hc/en-us/articles/360013349800-Update-Ledger-Nano-X-firmware) devices.

At the time of writing, the following versions were used:

 - Ledger Live 2.34.3
 - Ledger Nano S firmware v2.0.0
 - Ledger Nano X firmware v2.0.0

In addition, you'll need MetaMask as an intermediary between your Ledger device and Moonbeam. Make sure that your MetaMask is [connected to Moonbeam](/tokens/connect/metamask/). Chrome users (version 91) need some additional steps, which [are detailed in this tutorial](#chrome-browser). Using Firefox will result in a much simpler/straightforward experience.

## Install the Ledger Live App {: install-the-ledger-live-app }

If you want to connect to Moonriver, you can use the Moonriver app from the Ledger Live app catalog. Otherwise, for other Moonbeam-based networks, you can use the Ethereum Ledger Live app. To get started, open up Ledger Live and:

1. Select **Manager** from the menu
2. Connect and unlock your device (this must be done before installation)
3. In the **App catalog** search for Moonriver (MOVR) or Ethereum (ETH)
4. Click **Install**

Your Ledger device will show a status of **Processing**. Then once the app has been successfully installed, it will appear in the menu on your Ledger device. In the Ledger Live app, you'll also see the app under the **Apps installed** tab on the **Manager** page.

After the app has been successfully installed, you can close out of Ledger Live. 

<img src="/images/tokens/connect/ledger/ledger-1.png" alt="Moonriver Ledger App Installed" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

## Import your Ledger Account to MetaMask {: #import-your-ledger-account-to-metamask } 

Once the app has been installed from Ledger Live, connect your Ledger device to the computer, unlock it, open the Moonriver or Ethereum application. Then import your Ledger account to MetaMask using the following steps:

 1. Click on the top-right logo to expand the menu
 2. Select **Connect Hardware Wallet**

![MetaMask Connect Hardware Wallet](/images/tokens/connect/ledger/ledger-2.png)

In the next screen, you are prompted to select which hardware wallet you'll like to use in MetaMask. At the moment of writing, only Ledger and Trezor hardware wallets are supported. Here, take the following steps:

 1. Select the Ledger logo
 2. Click on **Continue**

![MetaMask Select Ledger Hardware Wallet](/images/tokens/connect/ledger/ledger-3.png)

If MetaMask was able to connect successfully to your Ledger device, you should see a list of five Moonbeam/Ethereum-styled accounts. If not, double-check that Ledger Live is closed, you've connected your Ledger device to the computer, unlocked it, and that the Moonriver or Ethereum app is opened. If you are using Chrome, check these [additional steps](#chrome-browser).

### Import Accounts and View Balances {: #import-accounts-and-view-balances } 

From this list of five Moonbeam accounts, take the following steps:

 1. Select the accounts you would like to import from your Ledger device
 2. Click on **Unlock**

![MetaMask Select Ethereum Accounts to Import](/images/tokens/connect/ledger/ledger-4.png)

If you've imported your Ledger account successfully, you should see your account and balance displayed in the main MetaMask screen like shown in the following image:

![MetaMask Successfully Imported Ledger Account](/images/tokens/connect/ledger/ledger-5.png)

You can switch accounts in MetaMask at any time to view the balance of your other imported Ledger accounts.

You've now successfully imported a Moonbeam compatible account from your Ledger device and are now ready to start interacting with your Ledger device. If you're not using Chrome, you can skip ahead to the [Receiving Tokens](#receive-tokens) section of this guide.

## Chrome Browser {: #chrome-browser } 

As of Chrome version 91, users that want to connect their Ledger device to MetaMask must be running the latest version of Ledger Live (v2.29 at the time of writing). 

### Enable Ledger Live Support in Metamask {: #enable-ledger-live-support-in-metamask } 

In MetaMask, take the following steps:

 1. Expand the top-right menu and go to **Settings**
 2. Navigate to **Advanced**
 3. Enable the **Use Ledger Live** feature

### Enable Device Access {: #enable-device-access } 

Next, allow Ledger Live to connect to your device by following these steps:

 1. Click on the top-right logo to expand the Metamask menu
 2. Select **Connect Hardware Wallet**
 3. Allow Chrome permission to open Ledger Live
 4. Click **Open** in the Ledger Live App
 5. Open the Moonriver or Ethereum App on your Ledger Device and continue on to [import accounts](#import-accounts-and-view-balances)

 ![Allow Ledger Live to connect your Ledger Device](/images/tokens/connect/ledger/ledger-6.png)

With this feature enabled, MetaMask will open Ledger Live when trying to connect to your Ledger device. You can read more about it in this [MetaMask blog post](https://metamask.zendesk.com/hc/en-us/articles/360020394612-How-to-connect-a-Trezor-or-Ledger-Hardware-Wallet).

## Receive Tokens {: #receive-tokens } 

To get started interacting with your Ledger device, you will need to send some funds to it. Copy your address from MetaMask by clicking on your account name and address in MetaMask.

![MetaMask Copy Account](/images/tokens/connect/ledger/ledger-7.png)

Next, you will need to obtain some MOVR or DEV tokens and using the address you just copied, send the tokens to your account. After the transaction has successfully gone through, you will see your balance update.

If you need DEV tokens for the Moonbase Alpha TestNet, you can head to the faucet to [Get Tokens](/builders/get-started/moonbase/#get-tokens).

## Send Tokens {: #send-tokens } 

Next up is sending and signing transactions on Moonbeam using your Ledger device. To get started sending a transaction, click on the **Send** button:

![MetaMask Ledger Account Funded](/images/tokens/connect/ledger/ledger-8.png)

As you would in a standard transaction, set the recipient address, enter the number of tokens to send, review transaction details and confirm it. This will initiate the transaction signature wizard in your Ledger device. Here, take the following steps:

 1. Click the button to proceed to the next screen. Your Ledger device is only warning you to review the transaction
 2. Check the number of tokens being sent then proceed to the next screen
 3. Check the recipient's address and proceed to the next screen
 4. *This step only applies if you're using the Ethereum app*. Check the chain ID of the network. This information confirms which network MetaMask is connected to. For example, for Moonbase Alpha, the chain ID is 1287 (hex: 0x507), Moonriver 1285 (hex: 0x505), and Moonbeam 1284 (not yet live). When ready, proceed to the next screen
 5. Check the max fees applicable to this transaction. This is the gas price multiplied by the gas limit you've set on MetaMask. When ready, proceed to the next screen
 6. If you agree with all the transaction details, approve it. This will sign the transaction and will trigger MetaMask to send it. If not, proceed to the next screen
 7. If you don't agree with all the transaction details, reject it. This will cancel the transaction, and MetaMask will mark it as failed

![MetaMask Ledger Transaction Wizard](/images/tokens/connect/ledger/ledger-9.png)

Right after you've approved the transaction, MetaMask sends it to the network. Once the transaction is confirmed, it will be displayed as **Send** on the **Activity** tab in MetaMask.

![MetaMask Ledger Transaction Wizard](/images/tokens/connect/ledger/ledger-10.png)

And that is it! You've signed a transaction and sent some tokens on Moonbeam using your Ledger hardware wallet!

## Interact with Contracts Using your Ledger {: #interact-with-contracts-using-your-ledger } 

By default, Ledger devices don't admit a `data` field in the transaction object. Consequently, users can't deploy or interact with smart contracts.

However, if you want to use your Ledger hardware wallet for transactions related to smart contracts, you need to change a configuration parameter inside the app on your device. To do so, take the following steps:

 1. On your Ledger, open the Moonriver or Ethereum app
 2. Navigate to **Settings**
 3. Find the **Blind signing** page. It should state **NOT Enabled** at the bottom
 4. Select/validate the option to change its value to **Enabled**

!!! note
    This option is necessary to use your Ledger device to interact with ERC20 token contracts that might live inside the Moonbeam ecosystem.

![MetaMask Ledger Allow Contracts Tx](/images/tokens/connect/ledger/ledger-11.png)