---
title: Moonbeam App
description: This guide walks you through how to use your Ledger hardware wallet to sign transactions in Moonbeam using the native Moonbeam Ledger Live app.
---

# Interacting with Moonbeam Using Ledger and the Moonbeam App

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src="https://www.youtube.com/embed/-cbaLG1XOF8"  frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## Introduction {: #introduction } 

Hardware wallets provide a safer way to store crypto funds because the private key (used for signing transactions) is stored offline. Ledger offers two hardware wallet solutions at the time of writing: Ledger Nano S and Ledger Nano X.

You can interact with Moonbeam using your Ledger hardware wallet through the Moonbeam Ledger Live app. With the dedicated Moonbeam app, you do not have to worry about setting the chain ID and you know you are connected to the right network. Please note that you can only use the Moonbeam app to connect to the Moonbeam network, it cannot be used to connect to other Moonbeam-based networks.

You also have the option of using the Ethereum app to connect to Moonbeam. The main difference between using the Moonbeam and the Ethereum app is that you have to specify the chain ID when you use the Ethereum app, which is 1284 for Moonbeam. If you're interested in using the Ethereum app instead, you can check out the [Interacting with Moonbeam Using Ledger and the Ethereum App](/tokens/connect/ledger/ethereum){target=\_blank} guide.

In this tutorial, you will learn how to get started with your Ledger hardware wallet on Moonbeam using the Moonbeam app. This guide only illustrates the steps for a Ledger Nano X device, but you can follow along with a Ledger Nano S as well. 

--8<-- 'text/_disclaimers/third-party-content-intro.md'

--8<-- 'text/tokens/connect/ledger/checking-prereqs.md'

--8<-- 'text/tokens/connect/ledger/checking-prereqs-ll.md'

## Install the Moonbeam Ledger Live App {: install-the-moonbeam-ledger-live-app }

The Moonbeam app is dependent on the Ethereum app, so first you will need to install the Ethereum app. Once the Ethereum app is installed you will be able to install the Moonbeam app without a problem. Please note that the Moonbeam app is only for the Moonbeam network, it will not work for Moonriver or Moonbase Alpha.

--8<-- 'text/tokens/connect/ledger/install-eth-app.md'
4. Search for Moonbeam (GLMR) in the **App catalog** and click **Install**. Again, your Ledger device will show **Processing** and once complete, the Moonbeam app will appear on your Ledger device

In the Ledger Live app, you should see the Ethereum and Moonbeam app listed under the **Apps installed** tab on the **Manager** page. After the apps have been successfully installed, you can close out of Ledger Live. 

<img src="/images/tokens/connect/ledger/moonbeam/ledger-1.png" alt="Moonriver Ledger App Installed" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

## Import your Ledger Account to MetaMask {: #import-your-ledger-account-to-metamask } 

Now that you've installed the Ledger Live apps, you can connect your Ledger to the computer, unlock it, and open the Moonbeam app. 

--8<-- 'text/tokens/connect/ledger/import-ledger/step-1.md'

![MetaMask Connect Hardware Wallet](/images/tokens/connect/ledger/moonbeam/ledger-2.png)

--8<-- 'text/tokens/connect/ledger/import-ledger/step-2.md'

![MetaMask Select Ledger Hardware Wallet](/images/tokens/connect/ledger/moonbeam/ledger-3.png)

--8<-- 'text/tokens/connect/ledger/import-ledger/step-3.md'

![Ledger on Chrome](/images/tokens/connect/ledger/moonbeam/ledger-4.png)

--8<-- 'text/tokens/connect/ledger/import-ledger/step-4.md'

If MetaMask was able to connect successfully to your Ledger device, you should see a list of five Moonbeam/Ethereum-styled accounts. If not, double-check that Ledger Live is closed, you've connected your Ledger device to the computer, unlocked it, and have the Moonbeam app open.

--8<-- 'text/tokens/connect/ledger/import-accounts.md'

![MetaMask Select Ethereum Accounts to Import](/images/tokens/connect/ledger/moonbeam/ledger-5.png)

If you've imported your Ledger account successfully, you should see your account and balance displayed in the main MetaMask screen like shown in the following image:

![MetaMask Successfully Imported Ledger Account](/images/tokens/connect/ledger/moonbeam/ledger-6.png)

You can switch accounts in MetaMask at any time to view the balance of your other imported Ledger accounts.

You've now successfully imported a Moonbeam compatible account from your Ledger device and are now ready to start interacting with your Ledger device.

--8<-- 'text/tokens/connect/ledger/receive-tokens.md'

![MetaMask Copy Account](/images/tokens/connect/ledger/moonbeam/ledger-7.png)

Next, you will need to obtain some GLMR tokens and using the address you just copied, send the tokens to your account. After the transaction has successfully gone through, you will see your balance update.

## Send Tokens {: #send-tokens } 

Next up is sending and signing transactions on Moonbeam using your Ledger device. To get started sending a transaction, click on the **Send** button:

![MetaMask Ledger Account Funded](/images/tokens/connect/ledger/moonbeam/ledger-8.png)

--8<-- 'text/tokens/connect/ledger/send-tokens/set-of-steps-1.md'
--8<-- 'text/tokens/connect/ledger/send-tokens/set-of-steps-2.md'

![MetaMask Ledger Transaction Wizard](/images/tokens/connect/ledger/moonbeam/ledger-9.png)

Right after you've approved the transaction, MetaMask sends it to the network. Once the transaction is confirmed, it will be displayed as **Send** on the **Activity** tab in MetaMask.

![MetaMask Ledger Transaction Wizard](/images/tokens/connect/ledger/moonbeam/ledger-10.png)

And that is it! You've signed a transaction and sent some GLMR tokens using your Ledger hardware wallet!

--8<-- 'text/tokens/connect/ledger/blind-signing.md'

![MetaMask Ledger Allow Contracts Tx](/images/tokens/connect/ledger/moonbeam/ledger-11.png)

--8<-- 'text/tokens/connect/ledger/ledger-live.md'

--8<-- 'text/_disclaimers/third-party-content.md'
