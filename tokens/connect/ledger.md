---
title: Connect & Use Ledger
description: This guide walks you through how to use your Ledger hardware wallet to sign transactions on Moonbeam, leveraging its Ethereum compatibility features
---

# Interacting with Moonbeam Using Ledger Hardware Wallet

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/ct4h9MN41j4' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## Introduction {: #introduction } 

Hardware wallets provide a safer way to store crypto funds because the private key (used for signing transactions) is stored offline. Ledger offers two hardware wallet solutions at the time of writing: Ledger Nano S and Ledger Nano X.

For Moonbeam, Moonriver, and the Moonbase Alpha TestNet, you can use the Ethereum app on Ledger Live by setting the chain ID. For Moonbeam, the chain ID is 1284, for Moonriver it's 1285, and for Moonbase Alpha it's 1287.

For Moonriver, you also have the option of using the dedicated Moonriver app on Ledger Live, this way you do not have to worry about setting the chain ID and you know you are connected to the right network. Please note that the Moonriver app can only be used for connecting to the Moonriver network, it will not work for Moonbeam or Moonbase Alpha.

In this tutorial, you will learn how to get started with your Ledger hardware wallet on Moonbeam. This guide only illustrates the steps for a Ledger Nano X device, but you can follow along with a Ledger Nano S as well. 

## Checking Prerequisites {: #checking-prerequisites } 

Before you get started, update [Ledger Live](https://www.ledger.com/ledger-live/download) to the latest version available. Also, make sure you've your Ledger hardware wallet device running the latest firmware. The Ledger support website offers tutorials on how to update the firmware of both [Ledger Nano S](https://support.ledger.com/hc/en-us/articles/360002731113-Update-Ledger-Nano-S-firmware) and [Ledger Nano X](https://support.ledger.com/hc/en-us/articles/360013349800-Update-Ledger-Nano-X-firmware) devices.

At the time of writing, the following versions were used:

 - [Ledger Live 2.35.1](https://support.ledger.com/hc/en-us/articles/360020773319-What-s-new-in-Ledger-Live-?docs=true)
 - [Ledger Nano S firmware v2.0.0](https://support.ledger.com/hc/en-us/articles/360010446000-Ledger-Nano-S-firmware-release-notes?docs=true)
 - [Ledger Nano X firmware v2.0.1](https://support.ledger.com/hc/en-us/articles/360014980580-Ledger-Nano-X-firmware-release-notes?docs=true)

In addition, you'll need MetaMask as an intermediary between your Ledger device and Moonbeam. Make sure that your MetaMask is [connected to Moonbeam](/tokens/connect/metamask/). 

As of [MetaMask version 10.5.0](https://consensys.net/blog/metamask/metamask-and-ledger-integration-fixed/), connecting your Ledger device with MetaMask on Chrome is easy again. You just need to have the latest version of MetaMask installed. 

## Install the Ledger Live App {: install-the-ledger-live-app }

If you want to connect to Moonbeam, Moonriver, or the Moonbase Alpha TestNet you can do so by installing the Ethereum app, and later on you'll need to specify a chain ID.

For Moonriver specifically, you also have the option of using the dedicated Moonriver app from the Ledger Live app catalog. This way you do not have to worry about chain configurations and know you are connected to the Moonriver network. First you will need to install the Ethereum app since the Moonriver app is dependent on it. Once the Ethereum app is installed you will be able to install the Moonriver app without a problem. Please note that the Moonriver app is only for the Moonriver network, it will not work for Moonbeam or Moonbase Alpha.

To get started, open up Ledger Live and:

1. Select **Manager** from the menu
2. Connect and unlock your device (this must be done before installation)
3. In the **App catalog** search for Ethereum (ETH) and click **Install**. Your Ledger device will show **Processing** and once the installation is complete, the app will appear on your Ledger device
4. *This step is only for the dedicated Moonriver app.* Search for Moonriver (MOVR) in the **App catalog** and click **Install**. Again, your Ledger device will show **Processing** and once complete, the Moonriver app will appear on your Ledger device

In the Ledger Live app, depending on which app(s) you installed you should see them listed under the **Apps installed** tab on the **Manager** page. After the app(s) have been successfully installed, you can close out of Ledger Live. 

<img src="/images/tokens/connect/ledger/ledger-1.png" alt="Moonriver Ledger App Installed" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

## Import your Ledger Account to MetaMask {: #import-your-ledger-account-to-metamask } 

Now that you've installed the app(s) on Ledger Live, you can connect your Ledger to the computer and unlock it. If you're trying to connect to Moonbeam, Moonriver, or Moonbase Alpha via the Ethereum app, you can go ahead and open the Ethereum app. If you're connecting to Moonriver using the dedicated Moonriver app, you can open the Moonriver app instead. Then import your Ledger account to MetaMask using the following steps:

 1. Click on the top-right logo to expand the menu
 2. Select **Connect Hardware Wallet**

![MetaMask Connect Hardware Wallet](/images/tokens/connect/ledger/ledger-2.png)

In the next screen, you are prompted to select which hardware wallet you'll like to use in MetaMask. At the moment of writing, only Ledger and Trezor hardware wallets are supported. Here, take the following steps:

 1. Select the Ledger logo
 2. Click on **Continue**

![MetaMask Select Ledger Hardware Wallet](/images/tokens/connect/ledger/ledger-3.png)

If you're using Chrome or a Chrome-based browser like Brave, you'll be prompted to select your Ledger device to connect via WebHID:

1. Select your Ledger device from the pop-up
2. Click **Connect**

![Ledger on Chrome](/images/tokens/connect/ledger/ledger-4.png)

If a pop-up doesn't appear, you may need to change your MetaMask settings to enable a WebHID connection. You can check and update your MetaMask settings by following these steps:

1. Expand the top-right menu and go to **Settings** 
2. Navigate to **Advanced**
3. Scroll down to **Preferred Ledger Connection Type** and select **WebHID** from the dropdown

!!! note
    The **Preferred Ledger Connection Type** setting is only available on Chrome and Chrome-based browsers. This setting doesn't exist on other browsers such as Firefox.

If MetaMask was able to connect successfully to your Ledger device, you should see a list of five Moonbeam/Ethereum-styled accounts. If not, double-check that Ledger Live is closed, you've connected your Ledger device to the computer, and unlocked it. If you're using the Ethereum app, make sure that it's open. If you're using the dedicated Moonriver app, make sure that the Moonriver app is open instead.

### Import Accounts and View Balances {: #import-accounts-and-view-balances } 

From this list of five Moonbeam accounts, take the following steps:

 1. Select the accounts you would like to import from your Ledger device
 2. Click on **Unlock**

![MetaMask Select Ethereum Accounts to Import](/images/tokens/connect/ledger/ledger-5.png)

If you've imported your Ledger account successfully, you should see your account and balance displayed in the main MetaMask screen like shown in the following image:

![MetaMask Successfully Imported Ledger Account](/images/tokens/connect/ledger/ledger-6.png)

You can switch accounts in MetaMask at any time to view the balance of your other imported Ledger accounts.

You've now successfully imported a Moonbeam compatible account from your Ledger device and are now ready to start interacting with your Ledger device.

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
 4. *This step only applies if you're using the Ethereum app*. Check the chain ID of the network. This information confirms which network MetaMask is connected to. For Moonbeam the chain ID is 1284 (hex: 0x504), Moonriver is 1285 (hex: 0x505), and Moonbase Alpha is 1287 (hex: 0x507). When ready, proceed to the next screen
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
    This option is necessary to use your Ledger device to interact with ERC-20 token contracts that might live inside the Moonbeam ecosystem.

![MetaMask Ledger Allow Contracts Tx](/images/tokens/connect/ledger/ledger-11.png)

--8<-- 'text/disclaimers/third-party-content.md'