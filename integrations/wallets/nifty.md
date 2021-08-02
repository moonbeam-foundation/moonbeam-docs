---
title: Nifty Wallet
description: This guide walks you through how to connect Nifty Wallet, a browser-based wallet that works with Ethereum, to Moonbeam.
---

# Interacting with Moonbeam Using Nifty Wallet
 
![Intro banner](/images/nifty/nifty-banner.png)

## Introduction {: #introduction } 

[Nifty Wallet](https://www.poa.network/for-users/nifty-wallet) was initially forked from MetaMask, and has been extended for interaction with POA networks, POA Core and POA Sokol. Since Nifty is Ethereum compatible, it can also be used on Moonbeam. 

Please be aware that Nifty Wallet is beta software and it is recommended to sign out when you're done using a site.

This tutorial will cover how to setup Nifty Wallet to connect to our TestNet, Moonbase Alpha.

## Creating a Wallet {: #creating-a-wallet } 

First, you need to install the [Nifty Wallet browser extension](https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid?hl=en) from the Chrome web store.

With the browser extension installed, please open it and set a password.

<img src="/images/nifty/nifty-images-1.png" alt="Set wallet password" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

After creating a password, a vault will be created for your account and seed words to restore your account will be generated. You'll be prompted to save the generated seed words. You can choose to save the seed words as a file or if you decide to save them another way, you can proceed by clicking "I've copied it somewhere safe". Just be sure that you have safely stored the seed words and you don't share them with anyone.

## Connect Nifty Wallet to Moonbeam {: #connect-nifty-wallet-to-moonbeam } 

Once you've created an account, you can now connect to the Moonbase Alpha TestNet by creating a custom network. 

You can also connect to Moonbase Alpha using an imported account. At this time, hardware wallets are not supported for custom RPCs. 

Navigate to the settings, in the top left corner, click on the POA dropdown. Scroll down to the bottom and select Custom RPC.
  
<img src="/images/nifty/nifty-images-2.png" alt="Create Custom RPC" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

Enter the RPC URL for Moonbeam in the New RPC URL Field:

=== "Moonbeam Development Node"

    ```
      {{ networks.development.rpc_url }}
    ```
    
=== "Moonbase Alpha"

    ```
      {{ networks.moonbase.rpc_url }}
    ```

=== "Moonriver"

    ```
      {{ networks.moonriver.rpc_url }}
    ```


Then click "Save".

<img src="/images/nifty/nifty-images-3.png" alt="Connect to Moonbase Alpha" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

The current RPC should change to the Moonbase Alpha RPC URL, and in the top left corner you'll see the network has changed to "Private Network".

<img src="/images/nifty/nifty-images-4.png" alt="Wallet Connected to Moonbase Alpha" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

And that is it, you now have Nifty Wallet connected to the Moonbase Alpha TestNet!

## Using Nifty Wallet {: #using-nifty-wallet } 

Nifty Wallet serves as a Web3 provider in tools such as [Remix](/integrations/remix/). By having Nifty Wallet connected to Moonbase Alpha, you can deploy contracts as you would like using MetaMask, signing the transactions with Nifty instead. 

For example, in Remix, when deploying a smart contract, make sure you select the "Injected Web3" option in the "Environment" menu. If you have Nifty Wallet connected, you will see the TestNet chain ID just below the box (_1287_) and your Nifty Wallet account injected into Remix as well. When sending a transaction, you should see a similar pop-up from Nifty:

<img src="/images/nifty/nifty-images-5.png" alt="Nifty sign transaction" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

Ensure you have DEV tokens in your account and, if necessary, head to the [faucet](/getting-started/moonbase/faucet/) to obtain some tokens. By clicking on "Submit," you are signing this transaction, and the contract will be deployed to the Moonbase Alpha TestNet.

!!! note
    Please note that although your account balance shows ETH, it is not real ETH, and just DEV tokens. 

The transaction will be displayed under the "Sent" tab.

<img src="/images/nifty/nifty-images-6.png" alt="Nifty confirmed transaction" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

## Create a New Account {: #create-a-new-account } 

To create a new account, click the user icon in the top right corner and select "Create Account".

<img src="/images/nifty/nifty-images-7.png" alt="Nifty create an account" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

A new account will be created and you'll be switched to the new account.

<img src="/images/nifty/nifty-images-8.png" alt="Nifty create an account" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

## Import an Account {: #import-an-account } 

To create a new wallet, click the user icon in the top right corner and select "Import Account".

<img src="/images/nifty/nifty-images-9.png" alt="Nifty import an account" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

Next, select the type of import from the dropdown and enter the necessary details to import your account. For example, if you choose to import with a private key, paste your private key in the input field and click "Import".

<img src="/images/nifty/nifty-images-10.png" alt="MathWallet private key or mnemonic import" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

Your account will be imported and you'll be switched to the imported account.

<img src="/images/nifty/nifty-images-11.png" alt="Nifty create an account" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />
