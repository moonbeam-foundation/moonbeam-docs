---
title: How to Connect SubWallet to Moonbeam
description: This guide walks you through how to connect SubWallet, a comprehensive Polkadot, Substrate, and Ethereum wallet, to Moonbeam. 
---

# Interacting with Moonbeam Using SubWallet

## Introduction {: #introduction }

Developers and users of Moonbeam have a variety of options when it comes to wallets. Thanks to Moonbeam's seamless Ethereum compatibility, Moonbeam supports a great variety of popular wallets, including [SubWallet](https://www.subwallet.app/){target=_blank}.

SubWallet is a comprehensive Web3 wallet that natively supports Substrate and Ethereum accounts. Although Moonbeam is a Substrate-based blockchain, it has a [unified account system](/learn/features/unified-accounts){target=_blank} that replaces the default Substrate-style accounts and keys with Ethereum-style accounts and keys. Since SubWallet supports Ethereum-style accounts, you can interact with your Moonbeam account using SubWallet.

This guide takes you through all the necessary steps, from installing SubWallet to setting up a wallet, connecting it to Moonbeam, and sending funds.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Install SubWallet {: #install-subwallet }

There are several ways you can interact with SubWallet: they have a browser extension, a mobile app, and a web-accessible dashboard.

You can get started by heading to [SubWallet's download page](https://www.subwallet.app/download.html){target=_blank} and downloading SubWallet for the platform of your choice.

If you choose to use the web-accessible dashboard, you won't need to download anything. You can access the dashboard at [web.subwallet.app](https://web.subwallet.app/welcome){target=_blank}.

## Setup a Wallet {: #setup-a-wallet }

Once you've downloaded SubWallet or navigated to the web dashboard, you'll be prompted to set up your wallet. You'll be able to choose from the following options:

- **Create a new account** - allows you to create an entirely new account by creating a password and generating a seed phrase
- **Import an account** - allows you to import an existing account using the seed phrase, JSON file, private key, or by QR code
- **Attach an account** - allows you to connect to an account without the private key. You can use this method to connect to a cold storage wallet, like [Ledger](/tokens/connect/ledger/){target=_blank}, or a watch-only account. With a watch-only account, you will not be able to transfer funds or interact with your account; you'll only be able to view account balances
- **Connect wallet** - *only available on the web dashboard* - allows you to connect to a browser extension wallet. You can use this method to easily connect to an account you've created using the SubWallet browser extension or another wallet, such as [MetaMask](/tokens/connect/metamask){target=_blank}

The following sections will provide step-by-step instructions for [creating a new account](#create-a-new-account) and [importing an existing account](#import-an-account) with SubWallet.

### Create a New Account {: #create-a-new-account }

Creating a new account will generate a seed phrase that can derive multiple Ethereum and Substrate accounts. By default, SubWallet will generate a single Ethereum and a single Substrate account, but you can easily derive more from the same seed phrase. Click **Create a new account** to get started.

![The main screen of the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-1.png)

On the following screen, you'll be prompted to create a password to secure your new wallet:

1. Enter a password that has at least 8 characters
2. Confirm the password by entering it again
3. Click **Continue**

![The create a password screen on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-2.png)

You'll then be prompted to back up your seed phrase. This is an important step, especially because you have the option to later derive additional accounts from this seed phrase.

1. View your seed phrase and save it in a safe place

    !!! remember
        You should never share your seed phrase (mnemonic) or private key with anyone. This gives them direct access to your funds. This guide is for educational purposes only.

2. Once you've safely stored your seed phrase, click **I have kept it somewhere safe**

![Back up your seed phrase on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-3.png)

Once you've created a password and saved your seed phrase, you'll be connected to your account. You can add additional accounts by taking the following steps:

1. Click on the account dropdown
2. Select one of the options from the bottom of the screen. You can click **Create a new account** to repeat the process you just went through, the import button to import an existing account, or the attach button to attach to an existing account with the private key or seed phrase

![View account details and create a new account, import one, or attach one.](/images/tokens/connect/subwallet/subwallet-4.png)

### Import an Account {: #import-an-account }

To import an existing account into SubWallet, you can select **Import an account**.

![The main screen of the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-5.png)

On the following screen, select the method by which you would like to import the existing account. You can choose from **Import from seed phrase**, **Import from Polkadot.{js}**, **Import by MetaMask private key**, and **Import by QR code**.

If you select **Import from seed phrase**, there are some incompatibility issues that can arise when importing an account from seed phrase. For example, Trust Wallet and SafePal are among the wallets not compatible with SubWallet. If you run into incompatibility issues, SubWallet recommends creating a new wallet.

If you select **Import from Polkadot.{js}**, you'll need to make sure that the account was created in Polkadot.js via private key. If it was created with a seed phrase and you attempt to import it to SubWallet, a different public address will be used. This is because Polkadot.js uses [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki){target=_blank}, whereas Ethereum uses [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki){target=_blank} or [BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki){target=_blank}.

![Select the import option from the Import account screen of the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-6.png)

If you import your account via seed phrase, you'll have to select your account type as either Substrate (Polkadot) or EVM (Ethereum), or both. To interact with Moonbeam, you'll need to choose **Ethereum**.

![Import existing account part 2](/images/tokens/connect/subwallet/subwallet-7.png)

Once you've completed the import process, you'll be prompted to enter a password to secure your new wallet:

1. Enter a password that has at least 8 characters
2. Confirm the password by entering it again
3. Click **Continue**

![The create a password screen on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-8.png)

Next, you'll be able to provide the relevant seed phrase, private key, JSON file, or QR code, and you can begin using your new account right away.

## Connect SubWallet to Moonbeam {: #connect-subwallet-to-moonbeam }

To configure SubWallet for Moonbeam, select the hamburger menu from the top left corner, which will take you to the settings page.

![The tokens screen on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-9.png)

From the settings menu, click **Manage networks**.

![The tokens screen on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-10.png)

To add Moonbeam, you can:

1. Search for "Moon" to view all Moonbeam-based networks, or search for a specific network
2. Toggle the switch to connect to the network

![The tokens screen on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-11.png)

If you're trying to connect to a [local Moonbeam development node](/builders/get-started/networks/moonbeam-dev){target=_blank}, you can click the **+** icon in the top right corner and enter in the [network configurations](/builders/get-started/quick-start/#network-configurations){target=_blank}.

By default, all balances are hidden in SubWallet, but if you press the eye icon, you can toggle balance visibility.

![The tokens screen on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-12.png)

## Interact with the Network {: #interact-with-the-network }

Once you've [connected SubWallet](#connect-subwallet-to-moonbeam) to any Moonbeam-based network, you can start using your wallet by:

- Sending a token transfer to another address
- Adding ERC-20s to Metamask and interacting with them
- Adding ERC-721s to Metamask and interacting with them

### Send a Transaction {: #send-a-transaction }

To get started with a simple token transfer to another address on Moonbeam, you can click the send icon.

![The tokens screen on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-13.png)

Next, you can take the following steps:

1. Specify the asset to send and the destination chain (in this case, the same chain that you're sending from)
2. Enter the destination address
3. Enter the amount of tokens to send
4. Look over the transaction details, then press **Transfer**

![The transfer screen on the SubWallet browser extension, where you can enter in the transaction details.](/images/tokens/connect/subwallet/subwallet-14.png)

On the next screen, you'll be able to review the transaction details and submit the transaction. If the transaction details look good, you can click **Approve** to send the transaction.

![The transfer confirmation screen on the SubWallet browser extension.](/images/tokens/connect/subwallet/subwallet-15.png)

After you send the transaction, you'll be able to review the transaction details.

And that's it! For more information on how to use SubWallet, please refer to [SubWallet's documentation](https://docs.subwallet.app/main/){target=_blank}.

--8<-- 'text/_disclaimers/third-party-content.md'
