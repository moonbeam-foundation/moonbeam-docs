---
title: Using Polkadot.js Apps
description: Follow this quick tutorial to learn how to use Moonbeam’s Ethereum-standard H160 addresses with Substrate-based apps like Polkadot.js.
---

# Interacting with Moonbeam Using Polkadot.js Apps and the Polkadot.js Extension

![Intro diagram](/images/tokens/connect/polkadotjs/polkadotjs-banner.png)

## Introduction {: #introduction } 

[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonriver.api.onfinality.io%2Fpublic-ws#/accounts){target=_blank} is a hosted wallet built on the Polkadot-js stack. Polkadot.js Apps can be used to manage substrate style accounts as well as Ethereum-style H160 accounts. Moonbeam uses Ethereum-style addresses and thanks to its [unified account structure](/learn/features/unified-accounts/){target=_blank}, there is no need to separately maintain Substrate-style accounts and keys. 

Polkadot.js Apps natively supports Ethereum-style (H160) addresses and ECDSA keys. In this tutorial, we'll set up a new Moonbeam account with the help of the Polkadot.js Extension, and send a transaction via Polkadot.js Apps.

## The Polkadot.js Extension {: #the-polkadot.js-extension } 

The [Polkadot.js extension](https://polkadot.js.org/extension/){target=_blank} manages accounts and facilitates the signing of transactions with those accounts. It is not a full-featured wallet like [MetaMask](/tokens/connect/metamask){target=_blank}. However, the extension has the ability to inject accounts into the browser, which provides a similar user experience to a full-featured wallet with the benefit of added security. Although dApp support for the Polkadot.js extension is limited, the extension seamlessly integrates with Polkadot.js Apps enabling you to send and receive funds and participate in Polkadot-native functions such as governance.

Creating and mantaining accounts in the Polkadot.js extension is more secure than creating them directly in Polkadot.js Apps. With the extension, the accounts live outside of the browser and are only injected into sites that you specifically authorize. Additionally, the extension can protect you from known phishing sites. 

With the latest update to the Polkadot.js extension, the plugin now natively supports Ethereum-style H160 addresses used by Moonriver and Moonbeam. 

## Installing the Polkadot.js Extension {: #installing-the-polkadot.js-extension } 

The Polkadot.js extension is compatible with Chrome, Brave, and Firefox. To install it, head to [this link](https://polkadot.js.org/extension/){target=_blank} and click on your respective browser. If you're using Brave, click on the Chrome link. 

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjsext/polkadotjs-ext-1.png)

## Update Metadata {: #update-metadata } 

It's important to update the extension metadata for each network you want to interact with, otherwise you may not see all of the latest updates reflected in the extension. To do so, first head to [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.moonriver.moonbeam.network#/settings){target=_blank}.

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

![Update Metadata](/images/tokens/connect/polkadotjsext/polkadotjs-ext-3.png)



## Creating a Moonbeam Address {: #creating-a-moonbeam-address }
Open the Polkadot.js extension and click on the "+" Icon. Then press "Create a New Account". This will open the “Create an account” wizard. In the first page, the twelve word mnemonic seed is shown. Make sure you backup your twelve word mnemonic seed. The words must be kept in the exact order displayed on your screen. For more information on storing your mnemonic seed safely, see [this link](https://wiki.polkadot.network/docs/learn-account-generation#storing-your-key-safely){target=_blank}. On this page, take the following steps:

 1. Ensure you have your mnemonic seed securely backed up, then check the corresponding box. If you navigate away from the extension before completing the account setup wizard, the seed will not be saved and you'll need to create a new account
 2. Click on the “next step” button

!!! note
    Moonbeam uses Ethereum-style H160 addresses across all of its networks - Moonbeam, Moonriver, and Moonbase Alpha. There is no need to create separate accounts for use on each chain.

![New Account](/images/tokens/connect/polkadotjsext/polkadotjs-ext-4.png)

!!! note
    Do NOT share your seed with anyone. Your seed grants full access to ALL of your funds. 

On this final page of the account creation wizard, take the following steps:

 1. Select the `Moonriver` Network. If you create an account in another format, such as Polkadot or Kusama, you'll be unable to later convert that to the Ethereum-style address format used in Moonriver and you'll need to create a new Moonriver address 
 2. Give this account a descriptive name
 3. Set a password, this will be used when signing transactions
 4. Confirm the password
 5. Click “Add the account with the generated seed” to complete the account generation 

<img src="/images/tokens/connect/polkadotjsext/polkadotjs-ext-5.png" alt="Finish Account Creation" style="width: 60%; display: block; margin-left: auto; margin-right: auto;" />

## Interacting with Polkadot.js Apps {: #interacting-with-polkadot.js-apps }

Remember that you cannot send funds directly from the Polkadot.js Extension. However, the extension can inject your accounts into other apps, such as [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonriver.api.onfinality.io%2Fpublic-ws#/accounts){target=_blank}, if you grant it permission to do so. Navigate to the [Accounts Page](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonriver.api.onfinality.io%2Fpublic-ws#/accounts){target=_blank} where you should see your injected account. 

 1. If this is your first time using the extension, you'll need to give the extension permission to inject your accounts into Polkadot.js Apps. As a safety measure, verify the URL displayed in the pop-up matches the URL of Polkadot.js Apps
 2. Click "Yes, allow this application access"
 3. Navigate to the accounts page
 4. Click "My Accounts"
 5. You should see your account from the extension injected into Polkadot.js Apps. Here, you can send a transaction and you'll sign the transaction in the Polkadot.js extension.

If you don't see your account in Polkadot.js Apps, first refresh the page. Second, check the extension to verify that the account is not hidden by toggling the eye icon next to your account in the extension.

![Polkadot.js Apps](/images/tokens/connect/polkadotjsext/polkadotjs-ext-6.png)

## Sending a Transaction Through Substrate's API {: #sending-a-transaction-through-substrates-api } 

Now, let's demonstrate the potential of Moonbeam's Unified Account structure by sending funds through the Substrate API using Polkadot.js Apps. Remember that we are interacting with Substrate using an Ethereum-style H160 address. To do so, we've imported another account named Alice with 0.02 MOVR tokens.

![Polkadot.js Apps Accounts](/images/tokens/connect/polkadotjsext/image2.png)

Next, click on Alice's send button, which opens another wizard that guides you through the process of sending a transaction. Set the send to address and the amount, which for our example is 0.01 MOVR tokens. When ready, click on the "Make Transfer" button.

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjsext/image3.png)

After the transaction is signed using the password, Polkadot.js will display some messages on the top right corner while it's being processed. Once confirmed, you should see the balances updated for each account.

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-app-9.png)

And that is it! We are excited about being able to support H160 accounts in Polkadot.js Apps, as we believe this will greatly enhance the user experience in the Moonbeam Network and its Ethereum compatibility features.

## Importing an Existing Account {: #creating-or-importing-an-h160-account } 

You can import an account created in another wallet such as Metamask to the Polkadot.js Extension. To do so, take the following steps.

 1. Click the "+" Button to add an account
 2. Press the "Import from pre-existing seed" button
 3. Enter your mnemonic seed phrase
 4. Select the Moonriver or Moonbeam Network
 5. Press the "Next" Button to Finish adding the account

If you don't see Moonriver or Moonbeam in the dropdown, follow the [Update Metadata](#update-metadata) steps.

![Import an Existing Account](/images/tokens/connect/polkadotjsext/combinedimage1a.png)

!!! note
    Currently, the Polkadot.js Extension does not support derived Ethereum-style addresses. This means that you can create only one address per seed. Similarly, this means that if you're importing a Metamask wallet, you'll only be able to utilize your first Metamask account within the Polkadot.js Extension. This is expected to be a temporary limitation and will be resolved soon.


!!! note
    Never reveal your private keys as they give direct access to your funds. The private key and mnemonic seed shown in this guide are for demostration purposes only. 
    
