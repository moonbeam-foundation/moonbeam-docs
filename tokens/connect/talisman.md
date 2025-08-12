---
title: Using Talisman with Polkadot JS Apps
description: Follow this quick tutorial to learn how to use Moonbeam’s Ethereum-style H160 addresses and send transactions with Polkadot.js Apps and Talisman.
categories: Tokens and Accounts, Ethereum Toolkit
---

# Interacting with Moonbeam Using Talisman

## Introduction {: #introduction }

As a Polkadot parachain, Moonbeam uses a [unified account structure](/learn/core-concepts/unified-accounts/){target=\_blank} that allows you to interact with Substrate (Polkadot) functionality and Moonbeam's EVM, all from a single Ethereum-style address. This unified account structure means that you don't need to maintain both a Substrate and an Ethereum account to interact with Moonbeam - instead, you can do it all with a single Ethereum private key.

[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=\_blank} supports H160 accounts injected into the browser via an extension like [Talisman](https://talisman.xyz){target=\_blank}. Note, Polkadot.js Apps is phasing out support for [accounts stored locally in the browser's cache](/tokens/connect/polkadotjs/). While you can continue to use any accounts that you've imported and stored in your browser locally via Polkadot.js Apps, you won't be able to add any new ones. This means that you'll need to use an extension like Talisman. Furthermore, injecting your account from an extension like Talisman is generally regarded to be safer than storing the account directly in the browser.

This guide will include all of the steps for setting up an account in Talisman and using it to interact with Moonbeam through Polkadot.js Apps.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Setting up Talisman {: #setting-up-talisman }

Talisman is a crypto-wallet that natively supports Substrate (Polkadot) and Ethereum accounts. The Talisman wallet browser extension is available on [Google Chrome](https://chromewebstore.google.com/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld){target=\_blank} and [Brave](https://chromewebstore.google.com/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld){target=\_blank}, and a corresponding asset dashboard is accessible at [app.talisman.xyz](https://app.talisman.xyz){target=\_blank}

First, download and install the [Talisman extension](https://talisman.xyz){target=\_blank}. Once the extension opens up, you'll be prompted to either create a new wallet or import an existing one. For the purposes of this demo, you'll create a new wallet. On the following screen you'll be prompted to create a password to secure the new wallet.  

![Create a new wallet or import an existing one into Talisman.](/images/tokens/connect/talisman/talisman-1.webp)

!!! Remember
    Talisman does not require you to back up your seed phrase but will nudge you with a reminder at the bottom of the screen. If you don't back up your seed phrase, you could lose all of your assets.

To back up your newly created wallet, take the following steps:

1. Press **Backup Now**
2. Enter the password to your Talisman wallet
3. Press **View Recovery Phrase** and store it in a secure place

![Back up your Talisman recovery phrase.](/images/tokens/connect/talisman/talisman-2.webp)

## Setting up Talisman to Connect to Testnets {: #setting-up-talisman-to-connect-to-testnets }

Talisman works with all Moonbeam networks [after you enable Ethereum accounts](#connecting-talisman-to-moonbase-alpha-polkadot.js-apps). You can also see your balances across all networks in the **Portfolio** tab by clicking on the extension's Talisman logo in the upper left-hand corner. By default, Talisman hides your testnet account balances. However, you can change this by taking the following steps:

1. Open the Talisman extension and click on the Talisman logo
2. Select **Settings**
3. Select **Ethereum Networks**
4. Click **Enable Testnets**

![See your Moonbase Alpha testnet account balances in Talisman.](/images/tokens/connect/talisman/talisman-3.webp)

## Connecting Talisman to Moonbeam and Polkadot.js Apps {: #connecting-talisman-to-moonbase-alpha-polkadot.js-apps }

Connecting Talisman to a Moonbeam-based network in Polkadot.js Apps is straightforward. Remember that you need to [enable testnets](#setting-up-talisman-to-connect-to-testnets) if you want to connect to Moonbase Alpha.

To connect to a Moonbeam-based network, the Moonbase Alpha testnet in this example, head to [Moonbase Alpha Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=\_blank}. The Talisman extension will prompt you to select the accounts you'd like to use with Polkadot.js Apps. If it doesn't automatically pop up, you can open the Talisman extension and press the **Connected / Not Connected** button at the top. To configure Talisman to correctly interface with Moonbeam networks on Polkadot.js Apps, you should take the following steps:

1. Check the box next to **Show Ethereum Accounts**
2. Select the accounts you want to connect to Polkadot.js Apps. In this example, it is only **My Ethereum Account**. This is the default name assigned by Talisman which you can rename if you'd like
3. Press **Connect 1**. The value will change depending on the number of accounts you are connecting

![Enable Ethereum/Moonbeam accounts in Talisman.](/images/tokens/connect/talisman/talisman-4.webp)

Your Talisman wallet is now connected to Polkadot.js Apps. After refreshing Polkadot.js Apps, you should see your Talisman account in the [Accounts page of Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=\_blank}. When launching [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=\_blank} for the first time, you may or may not be connected to the desired network. You can change your selected network to the Moonbase Alpha TestNet by clicking the logo in the top left corner, then scroll down to the **Test Networks** section, select Moonbase Alpha, and scroll back to the top and click **Switch**.

![Connect to Polkadot.js Apps.](/images/tokens/connect/talisman/talisman-5.webp)

After switching, the Polkadot.js site will not only connect to Moonbase Alpha, but also change its styling to make a perfect match.

![Switch to Moonbase Alpha in Polkadot.js Apps.](/images/tokens/connect/talisman/talisman-6.webp)

## Adding a New Account to Talisman {: #adding-a-new-account-to-talisman }

In this section, you'll learn how you can create a new account, or import an already existing MetaMask account to Polkadot.js Apps.

1. Open the Talisman extension and click on the Talisman logo in the upper left hand corner
2. Select **Add Account**
3. Select **New Account**
4. Select **Ethereum** as the account type
5. Give your new account a name
6. Press **Create**

![Create a new Moonbeam account in Talisman.](/images/tokens/connect/talisman/talisman-7.webp)

Although our new account has been successfully created, Polkadot.js Apps isn't aware of it yet. To connect the new account to Polkadot.js Apps, take the following steps from [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=\_blank}:

1. Open the Talisman extension and Press the **Connected / Not-connected** button
2. Ensure **Show Eth accounts** is checked
3. Click on the account you'd like to connect. The green dot next to the account will light up if it is selected

![Connect Talisman account to Polkadot.js Apps.](/images/tokens/connect/talisman/talisman-8.webp)

## Sending a Transaction Through Substrate's API {: #sending-a-transaction-through-substrates-api }

Now, to demonstrate the potential of Moonbeam's [unified accounts](/learn/core-concepts/unified-accounts/){target=\_blank} scheme you can make a transfer through the Substrate API using Polkadot.js Apps. Remember that you are interacting with Substrate using an Ethereum-style H160 address. To do so, you can [add another account](#adding-a-new-account-to-talisman). The accounts in Talisman have been renamed to the familiar Alice and Bob accounts. To send some DEV funds from Alice to Bob, take the following steps:

Click on Alice's **send** button, which opens another wizard that guides you through the process of sending a transaction.

1. Set the **send to address**
2. Enter the **amount** to send, which is 4 DEV tokens in this example
3. When ready, click on the **Make Transfer** button
4. Approve the transaction in the Talisman pop up

![Send a Moonbeam transaction through the Substrate API with Talisman.](/images/tokens/connect/talisman/talisman-9.webp)

After the transaction is confirmed, you should see the balances updated for each account.

![You can see your balances updated in Polkadot.js Apps after a successful transaction.](/images/tokens/connect/talisman/talisman-10.webp)

And that is it! These steps have demonstrated the ease coupled with the robust security of interacting with injected H160 accounts in Polkadot.js Apps with Talisman. All of this is possible because of Moonbeam's unified account structure, a great example of Moonbeam's commitment to providing the best user experience.

--8<-- 'text/_disclaimers/third-party-content.md'
