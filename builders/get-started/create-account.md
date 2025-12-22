---
title: Create an Account
description: To begin developing on Moonbeam, you must create an account. This guide will provide you with the information needed to create one to use on Moonbeam.
categories: Basics
---

# Create an Account

## Introduction {: #introduction }

To get started developing on Moonbeam, developers must create an account. The most prevalent approach involves leveraging a wallet application, which facilitates generating and managing cryptographic keys essential for interacting with Moonbeam.

Moonbeam uses H160 Ethereum-style accounts and ECDSA keys, represented in 20-byte addresses. If you already have an Ethereum account and its private key or mnemonic, you can use your account on Moonbeam.

This guide will walk you through the step-by-step process of creating an account on Moonbeam. Whether you're new to blockchain technology or an experienced Ethereum user, this guide will provide all the information you need to get started.

!!! note
    This guide does not pertain to a local Moonbeam development node. If you are using a development node, you don't need to worry about creating an account, as the node comes with ten pre-funded accounts for testing purposes. Please refer to the [Getting Started with a Local Moonbeam Development Node](/builders/get-started/networks/moonbeam-dev/){target=\_blank} guide for more information.

## Choose a Wallet {: #choose-a-wallet }

A wallet is a software or hardware tool that allows you to securely store, manage, and interact with your digital assets, such as tokens or coins. Wallets store your private keys, which are essential for authorizing transactions on the network.

You can review a list of wallets on the [Moonbeam DApp Directory](https://apps.moonbeam.network/moonbeam/app-dir?cat=wallets){target=\_blank}.

![View list of wallets on the Moonbeam DApp](/images/builders/get-started/create-account/create-account-1.webp)

The list of wallets on the dApp is not exhaustive and may only cover some of the available options. You should be able to use any Ethereum-compatible wallet to generate an address and its associated private key.

You can also check out any of the wallets in the [Connect to Moonbeam](/tokens/connect/){target=\_blank} section of the docs.

## Use Your Wallet to Create an Account {: #use-your-wallet-to-create-an-account }

After you've selected a wallet and downloaded it, you'll most likely be prompted to create a new account or import an existing one the first time you open it. You'll want to create a new account.

Depending on the wallet, when creating an account, you may be prompted to backup and restore a seed phrase, also referred to as a mnemonic or recovery phrase. This phrase is a sequence of generated words that serve as a backup mechanism for private keys. They typically consist of 12 to 24 words randomly selected from a predefined list. Seed phrases are used to derive private keys deterministically, meaning that the same sequence of words will always generate the same set of private keys. They are crucial for recovering access to a cryptocurrency wallet in case of loss or device failure. **Make sure you save the phrase in a safe place; if you lose access to this phrase, you'll lose access to any funds you hold in your account.**

After saving your seed phrase, you can start developing on Moonbeam. Many wallets offer the option to export the private key linked to your account. By doing so, you can utilize your private key instead of the seed phrase during development. However, taking adequate precautions to securely store your private key or seed phrase while developing is essential.

And that's it! Before sending your first transaction on a Moonbeam-based network, ensure you have the necessary [network configurations for your chosen network](/builders/get-started/networks/){target=\_blank} and an [RPC endpoint](/builders/get-started/endpoints/){target=\_blank} for the network. Once you have these items, you'll be able to follow along with tutorials like the [How to use Ethers.js](/builders/ethereum/libraries/ethersjs/){target=\_blank} to send a transaction.
