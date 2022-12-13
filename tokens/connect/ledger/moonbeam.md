---
title: Moonbeam App
description: This guide walks you through how to use your Ledger hardware wallet to sign transactions in Moonbeam, using the native Moonbeam Ledger Live app.
---

# Interacting with Moonbeam Using Ledger and the Moonbeam App

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src="https://www.youtube.com/embed/-cbaLG1XOF8"  frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## Introduction {: #introduction } 

Hardware wallets provide a safer way to store crypto funds because the private key (used for signing transactions) is stored offline. Ledger offers two hardware wallet solutions at the time of writing: Ledger Nano S and Ledger Nano X.

You can interact with Moonbeam using your Ledger hardware wallet through the Moonbeam Ledger Live app. With the dedicated Moonbeam app, you do not have to worry about setting the chain ID and you know you are connected to the right network. Please note that you can only use the Moonbeam app to connect to the Moonbeam network, it cannot be used to connect to other Moonbeam-based networks.

You also have the option of using the Ethereum app to connect to Moonbeam. The main difference between using the Moonbeam and the Ethereum app is that you have to specify the chain ID when you use the Etheruem app, which is 1284 for Moonbeam. If you're interested in using the Ethereum app instead, you can check out the [Interacting with Moonbeam Using Ledger and the Ethereum App](/tokens/connect/ledger/ethereum){target=_blank} guide.

In this tutorial, you will learn how to get started with your Ledger hardware wallet on Moonbeam using the Moonbeam app. This guide only illustrates the steps for a Ledger Nano X device, but you can follow along with a Ledger Nano S as well. 

--8<-- 'text/disclaimers/third-party-content-intro.md'

--8<-- 'text/ledger/checking-prereqs.md'

As of November 29, 2022, the Moonbeam and Ledger Live integration was released, allowing you to send and receive GLMR tokens with your Ledger device directly in Ledger Live. With this integration, you'll no longer need to connect your Ledger to MetaMask. If you prefer this method, please skip ahead to the [Use Ledger Live to Send & Receive GLMR](#use-ledger-live) section of this guide.

If you prefer to use MetaMask as an intermediary between your Ledger device and Moonbeam, make sure that your MetaMask is [connected to Moonbeam](/tokens/connect/metamask/){target=_blank}. 

As of [MetaMask version 10.5.0](https://consensys.net/blog/metamask/metamask-and-ledger-integration-fixed/){target=_blank}, connecting your Ledger device with MetaMask on Chrome is easy again. You just need to have the latest version of MetaMask installed. 

## Install the Moonbeam Ledger Live App {: install-the-moonbeam-ledger-live-app }

The Moonbeam app is dependent on the Ethereum app, so first you will need to install the Ethereum app. Once the Ethereum app is installed you will be able to install the Moonbeam app without a problem. Please note that the Moonbeam app is only for the Moonbeam network, it will not work for Moonriver or Moonbase Alpha.

--8<-- 'text/ledger/install-eth-app.md'
4. Search for Moonbeam (GLMR) in the **App catalog** and click **Install**. Again, your Ledger device will show **Processing** and once complete, the Moonbeam app will appear on your Ledger device

In the Ledger Live app, you should see the Ethereum and Moonbeam app listed under the **Apps installed** tab on the **Manager** page. After the apps have been successfully installed, you can close out of Ledger Live. 

<img src="/images/tokens/connect/ledger/moonbeam/ledger-1.png" alt="Moonriver Ledger App Installed" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

## Import your Ledger Account to MetaMask {: #import-your-ledger-account-to-metamask } 

Now that you've installed the Ledger Live apps, you can connect your Ledger to the computer, unlock it, and open the Moonbeam app. 

--8<-- 'text/ledger/import-ledger/step-1.md'

![MetaMask Connect Hardware Wallet](/images/tokens/connect/ledger/moonbeam/ledger-2.png)

--8<-- 'text/ledger/import-ledger/step-2.md'

![MetaMask Select Ledger Hardware Wallet](/images/tokens/connect/ledger/moonbeam/ledger-3.png)

--8<-- 'text/ledger/import-ledger/step-3.md'

![Ledger on Chrome](/images/tokens/connect/ledger/moonbeam/ledger-4.png)

--8<-- 'text/ledger/import-ledger/step-4.md'

If MetaMask was able to connect successfully to your Ledger device, you should see a list of five Moonbeam/Ethereum-styled accounts. If not, double-check that Ledger Live is closed, you've connected your Ledger device to the computer, unlocked it, and have the Moonbeam app open.

--8<-- 'text/ledger/import-accounts.md'

![MetaMask Select Ethereum Accounts to Import](/images/tokens/connect/ledger/moonbeam/ledger-5.png)

If you've imported your Ledger account successfully, you should see your account and balance displayed in the main MetaMask screen like shown in the following image:

![MetaMask Successfully Imported Ledger Account](/images/tokens/connect/ledger/moonbeam/ledger-6.png)

You can switch accounts in MetaMask at any time to view the balance of your other imported Ledger accounts.

You've now successfully imported a Moonbeam compatible account from your Ledger device and are now ready to start interacting with your Ledger device.

--8<-- 'text/ledger/receive-tokens.md'

![MetaMask Copy Account](/images/tokens/connect/ledger/moonbeam/ledger-7.png)

Next, you will need to obtain some GLMR tokens and using the address you just copied, send the tokens to your account. After the transaction has successfully gone through, you will see your balance update.

## Send Tokens {: #send-tokens } 

Next up is sending and signing transactions on Moonbeam using your Ledger device. To get started sending a transaction, click on the **Send** button:

![MetaMask Ledger Account Funded](/images/tokens/connect/ledger/moonbeam/ledger-8.png)

--8<-- 'text/ledger/send-tokens/set-of-steps-1.md'
--8<-- 'text/ledger/send-tokens/set-of-steps-2.md'

![MetaMask Ledger Transaction Wizard](/images/tokens/connect/ledger/moonbeam/ledger-9.png)

Right after you've approved the transaction, MetaMask sends it to the network. Once the transaction is confirmed, it will be displayed as **Send** on the **Activity** tab in MetaMask.

![MetaMask Ledger Transaction Wizard](/images/tokens/connect/ledger/moonbeam/ledger-10.png)

And that is it! You've signed a transaction and sent some GLMR tokens using your Ledger hardware wallet!

--8<-- 'text/ledger/blind-signing.md'

![MetaMask Ledger Allow Contracts Tx](/images/tokens/connect/ledger/moonbeam/ledger-11.png)

## Use Ledger Live to Send & Receive GLMR {: #use-ledger-live }

You can also use your Ledger device to send and receive GLMR tokens securely from within Ledger Live. This enables you to manage your GLMR tokens without connecting your device to MetaMask.

When you open up the Ledger Live app, make sure that you've installed the latest updates. If there are any pending updates that need to be installed, there will be a banner at the top of the screen that prompts you to install the updates.

To get started, you'll need to login to your Ledger device to unlock it. From Ledger Live, click on **My Ledger**. On your device, you'll be prompted to allow Ledger manager; you can click both buttons on your device to allow it.

Once on the Ledger manager, you'll need to make sure that your firmware is up to date, and if the Moonbeam and/or Ethereum apps need to be updated, go ahead and install the latest versions.

Next, you'll need to add an account to your Ledger Live app. To do so, you can take the following steps:

1. Click on **Accounts** from the left-side menu
2. Select **Add account**
3. A dropdown will appear. Search for GLMR and **Moonbeam (GLMR)** should appear for you to select
4. Click **Continue**

![Add account to Ledger Live](/images/tokens/connect/ledger/moonbeam/ledger-12.png)

Next, you'll be able to enter an account name and click **Add account**. If your account was successfully added, you can click **Done** and your account will appear in your list of accounts.

### Receive Tokens

To receive GLMR to your Ledger device, you can take the following steps from Ledger Live:

1. Click on **Receive** from the left-side menu
2. A pop-up will appear. You can select your Moonbeam account where you want to receive tokens from the **Account to credit** dropdown
3. Click **Continue**

![Verify receiving address in Ledger Live](/images/tokens/connect/ledger/moonbeam/ledger-13.png)

Next, your address should appear on Ledger Live, and you'll be prompted to verify your address on your Ledger device. On your device, you can take the following steps:

1. You should see **Verify Address** on your device's screen. Click the right button to start verifying your address
2. On the next screen, you should see your address. Compare the address on your device to the one displayed on Ledger Live and verify it matches. At this time, you'll want to copy the address from Ledger Live so you can send a transaction to it. Click the right button to continue
3. Now, you should see the **Approve** screen. If the addresses match, you can click both buttons on your device to approve the verification. Otherwise, click the right button again to get to the **Reject** screen where you can click both buttons to reject the verification

![Verify receiving address on Ledger device](/images/tokens/connect/ledger/moonbeam/ledger-14.png)

Over on Ledger Live, you'll see that your address has been shared securely, and you can click **Done**. Now, you can send some GLMR to your Ledger account.

### Send Tokens

To send GLMR from your Ledger device, you can take the following steps from Ledger Live:

1. Click on **Send** from the left-side menu
2. A pop-up will appear. From the **Account to debit** dropdown, you can select your Moonbeam account that you want to send tokens from
3. Enter an address in the **Receipient address** field
4. Click **Continue**

![Send transaction in Ledger Live](/images/tokens/connect/ledger/moonbeam/ledger-15.png)

On the next screen, you can enter the amount of GLMR that you would like to send and click **Continue**.

![Enter amount to send in Ledger Live](/images/tokens/connect/ledger/moonbeam/ledger-16.png)

The last step on Ledger Live is to verify that the transaction details are correct. If everything looks good, you can click **Continue**. Then you'll be prompted to confirm the transaction on your Ledger device:

1. The first screen will be the **Review transaction** screen. Click the right button to proceed to the next screen
2. Verify the amount of GLMR you're sending and click the right button to proceed
3. Verify the address you're sending the GLMR to and click the right button to proceed
4. The **Network** screen should show **Moonbeam**. Click the right button to proceed
5. Review the **Max Fees** and click the right button to proceed
6. If everything looks good, you can click both buttons to **Accept and send** the transaction. Otherwise, you can click the right button to get to the **Reject** screen where you can click both buttons to reject the transaction

![Send transaction from Ledger device](/images/tokens/connect/ledger/moonbeam/ledger-17.png)

On Ledger Live, you should see that your transaction was sent, and you can view the details of the transaction. Once the transaction has been confirmed, your GLMR balance will update.

And that is it! You've successfully used the Moonbeam Ledger Live integration to receive and send tokens with your Ledger device directly from Ledger Live!

--8<-- 'text/disclaimers/third-party-content.md'
