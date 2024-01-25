---
title: How to use Polkadot.js Apps
description: Follow this quick tutorial to learn how to use Moonbeam’s Ethereum-style H160 addresses and send transactions with Polkadot.js Apps.
---

# How to use Polkadot.js Apps to Interact with Moonbeam

## Introduction {: #introduction }

As a Polkadot parachain, Moonbeam uses a [unified account structure](/learn/features/unified-accounts/){target=\_blank} that allows you to interact with Substrate (Polkadot) functionality and Moonbeam's EVM, all from a single Ethereum-style address. This unified account structure means that you don't need to maintain both a Substrate and an Ethereum account to interact with Moonbeam - instead, you can do it all with a single Ethereum private key.

The Polkadot.js Apps interface natively supports H160 addresses and ECDSA keys. So, in this tutorial, you can check out this integration of Ethereum-based accounts on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=\_blank}.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

!!! note
    Polkadot.js Apps is phasing out support for accounts stored locally in the browser's cache. Instead, it is recommended that you use a browser extension like [Talisman to inject your accounts into Polkadot.js Apps](/tokens/connect/talisman){target=\_blank}.

## Connect Polkadot.js Apps to Moonbeam {: #connecting-to-moonbase-alpha }

When launching [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=\_blank} for the first time, you may or may not be connected to the desired network.

You can change the selected network by clicking the logo in the top left corner, where you'll find a list of networks organized by MainNets, TestNets, and local networks. Each network can be found under the following sections:

|          Network          |        Section        |
|:-------------------------:|:---------------------:|
|          Moonbeam         | Polkadot & Parachains |
|         Moonriver         |  Kusama & Parachains  |
|       Moonbase Alpha      |     Test Networks     |
| Moonbeam Development Node |      Development      |

Once you've selected the correct network, you can scroll back to the top and click **Switch**.

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-1.webp)

After switching, the Polkadot.js site will not only connect to the chosen network, but the logo and styling will change for each network.

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-2.webp)

## Create or Import an H160 Account into Polkadot.js Apps {: #creating-or-importing-an-h160-account }

!!! note
    For security purposes, it is recommended that you do not store accounts locally in the browser. A more secure method is using a browser extension like [Talisman to inject your accounts into Polkadot.js Apps](/tokens/connect/talisman){target=\_blank}.

In this section, you'll learn how you can create a new account or import a preexisting MetaMask account to Polkadot.js Apps. First, there is one prerequisite step. As part of the process of phasing out support for accounts stored locally in the browser's cache, you'll need to enable support for local storage of accounts in the **Settings** tab. To do so, take the following steps:

1. Navigate to the **Settings** tab
2. Select **Allow local in-browser account storage** under the **in-browser account creation** heading
3. Press **Save**

![Allow local in-browser account storage](/images/tokens/connect/polkadotjs/polkadotjs-3.webp)

You can now head back to the [Accounts page of Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=\_blank} and proceed with the next steps:

1. Navigate to the **Accounts** section
2. Click on the **Add account** button

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-4.webp)

This will open a wizard pop-up that will guide you through the process of adding an account to the Polkadot.js Apps interface:

1. Click on the drop-down menu
2. Change the selection from **Mnemonic** to **Private Key**, this allows you to add an account through a private key

!!! note
    Currently, you can only create or import accounts in Polkadot.js via a private key. Doing so with the mnemonic will result in a different public address if you later try to import this account to an Ethereum wallet such as MetaMask. This is because Polkadot.js uses BIP39, whereas Ethereum uses BIP32 or BIP44.

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-5.webp)

Next, if you want to create a new account, make sure you store the private key displayed by the wizard. If you want to import an existing account, enter your private key that you can export from MetaMask.

!!! note
    Never reveal your private keys as they give direct access to your funds. The steps in this guide are for demonstration purposes only.

Make sure to include the prefix in the private key, i.e., `0x`. If you entered the information correctly, the corresponding public address should appear in the upper left corner of the window, and then click **Next**.

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-6.webp)

To finish the wizard, you can set an account name and password. After a confirmation message, you should see in the main **Accounts** tab the address with the corresponding balance: in this case, Bob's address. Moreover, you can overlay the MetaMask extension to see that both balances are the same.

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-7.webp)

## Send a Transaction Through Substrate's API {: #sending-a-transaction-through-substrates-api }

Now, to demonstrate the potential of Moonbeam's [unified accounts](/learn/features/unified-accounts){target=\_blank} scheme, you can make a transfer through the Substrate API using Polkadot.js Apps. Remember that you are interacting with Substrate using an Ethereum-style H160 address. To do so, you can import another account.

Next, click on Bob's **send** button, which opens another wizard that guides you through the process of sending a transaction.

1. Set the **send to address**
2. Enter the **amount** to send, which for this example is 1 DEV token
3. When ready, click on the **Make Transfer** button

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-8.webp)

Then you'll be prompted to enter your password and sign and submit the transaction. Once the transaction is confirmed, you should see the balances updated for each account.

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-9.webp)

And that is it! We are excited about being able to support H160 accounts in Polkadot.js Apps, as we believe this will greatly enhance the user experience on the Moonbeam Network and its Ethereum compatibility features.

--8<-- 'text/_disclaimers/third-party-content.md'