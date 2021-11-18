---
title: Using Polkadot.js Extension
description: Follow this quick tutorial to learn how to use Moonbeam’s Ethereum-standard H160 addresses with the Polkadot JS Extension.
---

# Interacting with Moonbeam Using the Polkadot.js Extension

![Intro diagram](/images/tokens/connect/polkadotjs/polkadotjs-banner.png)

## Introduction {: #introduction } 

The Polkadot.js extension manages accounts and facilitates the signing of transactions with those accounts. It is not a full-featured wallet like [MetaMask](/tokens/connect/metamask). However, the extension has the ability to inject accounts into the browser, which provides a similar user experience to a full-featured wallet with the benefit of added security.

Creating and mantaining accounts in the Polkadot.js extension is more secure than creating them directly in Polkadot.js Apps. With the extension, the accounts live outside of the browser and are only injected into sites that you specifically authorize. Additionally, the extension can protect you from known phishing sites. 

With the latest update to the Polkadot.js extension, the plugin now natively supports Ethereum-style H160 addresses used by Moonriver and Moonbeam. 

## Installing the Polkadot.js Extension {: #installing-the-polkadot.js-extension } 

The Polkadot.js extension is compatible with Chrome, Brave, and Firefox. To install it, head to [this link](https://polkadot.js.org/extension/) and click on your respective browser. If you're using Brave, click on the Chrome link. 

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjsext/polkadotjs-ext-1.png)

## Update Metadata {: #update-metadata } 

It's important to update the extension metadata for each network you want to interact with, otherwise you may not see all of the latest updates reflected in the extension. To do so, first head to [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.moonriver.moonbeam.network#/settings).

If you're not connected to the Moonbeam or Moonriver network, click the network logo in the upper left corner, then take the following steps:

 1. Click on the `Kusama and Parachains` tab for Moonriver or the `Polkadot and Parachains` tab for Moonbeam
 2. Find Moonriver in the list and select any one of the providers in the dropdown
 3. Click the "Switch" Button at the Top and wait for the page to reload

![Switch to the correct network](/images/tokens/connect/polkadotjsext/polkadotjs-ext-2.png)


Ensure you're on the Moonriver or Moonbeam Network, then take the following steps: 

 1. Click on the "Settings" Tab
 2. Navigate to "Metadata"
 3. Click on "Update Metadata". If you see a message that reads `No Upgradable extensions`, you can skip the following steps
 4. The Polkadot.js extension will pop up to prompt you to confirm the update. As a safety measure, verify the URL displayed in the extension is the same as the Polkadot.js Apps URL in your browser
 5. Click "Yes, do this metadata update" to complete the update  

It's a good idea to repeat the `Update metadata` process for each network that you'd like to interact with. 

![Update Metadata](/images/tokens/connect/polkadotjsext/polkadotjs-ext-3a.png)

!!! note
    Moonbeam uses Ethereum-style H160 addresses across all of its networks - Moonbeam, Moonriver, and Moonbase Alpha. There is no need to create separate accounts for use on each chain.

## Creating a Moonbeam Address {: #creating-a-moonbeam-address }
Open the Polkadot.js extension and click on the "+" Icon. Then press "Create a New Account". This will open the “Create an account” wizard. In the first page, the twelve word mnemonic seed is shown. Make sure you backup your twelve word mnemonic seed. The words must be kept in the exact order displayed on your screen. For more information on storing your mnemonic seed safely, see [this link](https://wiki.polkadot.network/docs/learn-account-generation#storing-your-key-safely). On this page, take the following steps:

 1. Ensure you have your mnemonic seed securely backed up, then check the corresponding box. If you navigate away from the extension before completing the account setup wizard, the seed will not be saved and you'll need to create a new account.
 2. Click on the “next step” button

!!! note
    DO NOT share your seed with anyone. Your seed grants full access to ALL of your funds. 

![New Account](/images/tokens/connect/polkadotjsext/polkadotjs-ext-4.png)

On this final page of the account creation wizard, take the following steps:

 1. Select the `Moonriver` Network. If you create an account in another format, such as Polkadot or Kusama, you'll be unable to later convert that to the Ethereum-style address format used in Moonriver and you'll need to create a new Moonriver address 
 2. Give this account a descriptive name
 3. Set a password, this will be used when signing transactions
 4. Confirm the password
 5. Click “Add the account with the generated seed” to complete the account generation 

![Finish Account Creation](/images/tokens/connect/polkadotjsext/polkadotjs-ext-5.png)

!!! note
    Currently, the Polkadot.js Extension does not support derived Ethereum-style addresses. This means that you can create only one address per seed. Similarly, this means that if you're importing a Metamask wallet, you'll only be able to utilize your first Metamask account within the Polkadot.js Extension. This is expected to be a temporary limitation and will be resolved soon. 

## Interacting with PolkadotJSApps {: #interacting-with-polkadotjsapps }

Remember that you cannot send funds directly from the Polkadot.js Extension. However, the extension can inject your accounts in other applications, such as [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonriver.api.onfinality.io%2Fpublic-ws#/accounts), if you grant it permission to do so. Navigate to the [Accounts Page](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonriver.api.onfinality.io%2Fpublic-ws#/accounts) where you should see your injected account. 

 1. If this is your first time using the extension, you'll need to give the extension permission to inject your accounts into Polkadot.js Apps. As a safety measure, verify the URL displayed in the pop-up matches the URL of Polkadot.js Apps.
 2. Click "Yes, allow this application access"
 3. Navigate to the accounts page
 4. Click "My Accounts"
 5. You should see your account from the extension injected into Polkadot.js Apps. Here, you can send a transaction and you'll sign the transaction in the Polkadot.js extension. For more information about using Polkadot.js Apps, see the [Polkadot.js Apps tutorial here](/tokens/connect/polkadotjs).

If you don't see your account in Polkadot.js Apps, first refresh the page. Secondly, check the extension to verify that the account is not hidden by toggling the eye icon next to your account in the extension.

![Polkadot.js Apps](/images/tokens/connect/polkadotjsext/polkadotjs-ext-6.png)
