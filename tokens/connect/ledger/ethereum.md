---
title: Ethereum App
description: This guide walks you through how to use your Ledger hardware wallet to sign transactions in Moonbeam-based networks using the Ethereum app on Ledger Live.
---

# Interacting with Moonbeam Using Ledger and the Ethereum App

## Introduction {: #introduction } 

Hardware wallets provide a safer way to store crypto funds because the private key (used for signing transactions) is stored offline. Ledger offers two hardware wallet solutions at the time of writing: Ledger Nano S and Ledger Nano X.

For Moonbeam, Moonriver, and the Moonbase Alpha TestNet, you can use the Ethereum app on Ledger Live by setting the chain ID. For Moonbeam, the chain ID is 1284, for Moonriver it's 1285, and for Moonbase Alpha it's 1287.

For Moonbeam and Moonriver you also have the option of using the dedicated [Moonbeam app](/tokens/connect/ledger/moonbeam/){target=_blank} or [Moonriver app](/tokens/connect/ledger/moonriver/){target=_blank} on Ledger Live, this way you do not have to worry about setting the chain ID and you know you are connected to the right network. Please note that you can only use the Moonbeam app to connect to the Moonbeam network, and the Moonriver app can only be used to connect to the Moonriver network. These dedicated apps will not work for other Moonbeam-based networks.

In this tutorial, you will learn how to get started with your Ledger hardware wallet on Moonbeam using the Ethereum app. This guide only illustrates the steps for a Ledger Nano X device, but you can follow along with a Ledger Nano S as well. 

--8<-- 'text/_disclaimers/third-party-content-intro.md'

--8<-- 'text/tokens/connect/ledger/checking-prereqs.md'

--8<-- 'text/tokens/connect/ledger/checking-prereqs-ll.md'

## Install the Ledger Live App {: install-the-ledger-live-app }

If you want to connect to Moonbeam, Moonriver, or the Moonbase Alpha TestNet you can do so by installing the Ethereum app, and later on you'll need to specify a chain ID.

--8<-- 'text/tokens/connect/ledger/install-eth-app.md'

In the Ledger Live app, depending on which app(s) you installed you should see them listed under the **Apps installed** tab on the **Manager** page. After the app(s) have been successfully installed, you can close out of Ledger Live. 

<img src="/images/tokens/connect/ledger/ethereum/ledger-1.webp" alt="Moonriver Ledger App Installed" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

## Import your Ledger Account to MetaMask {: #import-your-ledger-account-to-metamask } 

Now that you've installed the app(s) on Ledger Live, you can connect your Ledger to the computer and unlock it, and open the Ethereum app. 

--8<-- 'text/tokens/connect/ledger/import-ledger/step-1.md'

![MetaMask Connect Hardware Wallet](/images/tokens/connect/ledger/ethereum/ledger-2.webp)

--8<-- 'text/tokens/connect/ledger/import-ledger/step-2.md'

![MetaMask Select Ledger Hardware Wallet](/images/tokens/connect/ledger/ethereum/ledger-3.webp)

--8<-- 'text/tokens/connect/ledger/import-ledger/step-3.md'

![Ledger on Chrome](/images/tokens/connect/ledger/ethereum/ledger-4.webp)

--8<-- 'text/tokens/connect/ledger/import-ledger/step-4.md'

If MetaMask was able to connect successfully to your Ledger device, you should see a list of five Moonbeam/Ethereum-styled accounts. If not, double-check that Ledger Live is closed, you've connected your Ledger device to the computer, and unlocked it, and make sure the Ethereum app is open.

--8<-- 'text/tokens/connect/ledger/import-accounts.md'

![MetaMask Select Ethereum Accounts to Import](/images/tokens/connect/ledger/ethereum/ledger-5.webp)

If you've imported your Ledger account successfully, you should see your account and balance displayed in the main MetaMask screen like shown in the following image:

![MetaMask Successfully Imported Ledger Account](/images/tokens/connect/ledger/ethereum/ledger-6.webp)

You can switch accounts in MetaMask at any time to view the balance of your other imported Ledger accounts.

You've now successfully imported a Moonbeam compatible account from your Ledger device and are now ready to start interacting with your Ledger device.

--8<-- 'text/tokens/connect/ledger/receive-tokens.md'


![MetaMask Copy Account](/images/tokens/connect/ledger/ethereum/ledger-7.webp)

Next, you will need to obtain some GLMR, MOVR, or DEV tokens and using the address you just copied, send the tokens to your account. After the transaction has successfully gone through, you will see your balance update.

--8<-- 'text/_common/faucet/faucet-sentence.md'

## Send Tokens {: #send-tokens } 

Next up is sending and signing transactions on Moonbeam using your Ledger device. To get started sending a transaction, click on the **Send** button:

![MetaMask Ledger Account Funded](/images/tokens/connect/ledger/ethereum/ledger-8.webp)

--8<-- 'text/tokens/connect/ledger/send-tokens/set-of-steps-1.md'
4. Check the chain ID of the network. This information confirms which network MetaMask is connected to. For Moonbeam the chain ID is 1284 (hex: 0x504), Moonriver is 1285 (hex: 0x505), and Moonbase Alpha is 1287 (hex: 0x507). When ready, proceed to the next screen
5. Check the max fees applicable to this transaction. This is the gas price multiplied by the gas limit you've set on MetaMask. When ready, proceed to the next screen
6. If you agree with all the transaction details, approve it. This will sign the transaction and will trigger MetaMask to send it. If you don't agree with all the transaction details, reject it. This will cancel the transaction, and MetaMask will mark it as failed

![MetaMask Ledger Transaction Wizard](/images/tokens/connect/ledger/ethereum/ledger-9.webp)

Right after you've approved the transaction, MetaMask sends it to the network. Once the transaction is confirmed, it will be displayed as **Send** on the **Activity** tab in MetaMask.

![MetaMask Ledger Transaction Wizard](/images/tokens/connect/ledger/ethereum/ledger-10.webp)

And that is it! You've signed a transaction and sent some tokens on Moonbeam using your Ledger hardware wallet!

--8<-- 'text/tokens/connect/ledger/blind-signing.md'

![MetaMask Ledger Allow Contracts Tx](/images/tokens/connect/ledger/ethereum/ledger-11.webp)

--8<-- 'text/tokens/connect/ledger/ledger-live.md'

--8<-- 'text/_disclaimers/third-party-content.md'