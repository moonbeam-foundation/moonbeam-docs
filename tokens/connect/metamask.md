---
title: Using MetaMask
description: This guide walks you through how to connect MetaMask, an browser-based Ethereum wallet, to Moonbeam.
---

# Interacting with Moonbeam Using MetaMask

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed//hrpBd2-a7as' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## Introduction {: #introduction } 

Developers can leverage Moonbeam's Ethereum compatibility features to integrate tools, such as [MetaMask](https://metamask.io/), into their DApps. By doing so, they can use the injected library MetaMask provides to interact with the blockchain.

If you already have MetaMask installed, you can easily connect MetaMask to the Moonbase Alpha TestNet:

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask">Connect MetaMask</a>
</div>

!!! note
    MetaMask will popup asking for permission to add Moonbase Alpha as a custom network. Once you approve permissions, MetaMask will switch your current network to Moonbase Alpha.

Learn [how to integrate a Connect MetaMask button](/builders/interact/metamask-dapp/) into your dapp, so that users can connect to Moonbase Alpha with a simple click of a button.

## Install the MetaMask Extension {: #install-the-metamask-extension } 

First, we start with a fresh and default [MetaMask](https://metamask.io/) installation from the Chrome store. After downloading, installing, and initializing the extension, follow the "Get Started" guide. In there, you need to create a wallet, set a password, and store your secret backup phrase (this gives direct access to your funds, so make sure to store these in a secure place). 

## Create a Wallet {: #create-a-wallet } 

After installing [MetaMask](https://metamask.io), the setup will automatically open a new task with a welcome screen. Click "Get Started" to begin the setup process.

![MetaMask1](/images/metamask/metamask-1.png)

When prompted, you are given the option to import a wallet using a recovery seed phrase. For this exercise, set up a new wallet.

![MetaMask2](/images/metamask/metamask-2.png)

## Import Accounts {: #import-accounts } 

Instead of creating an account, you also have the option of importing any account into MetaMask you hold the private keys to. For this example, you'll import a development account.

![Import dev account into MetaMask](/images/metamask/metamask-3.png)

The details for the development accounts that comes pre-funded for this development node are as follows:

--8<-- 'code/setting-up-node/dev-accounts.md'

--8<-- 'code/setting-up-node/dev-testing-account.md'

On the import screen, select “Private Key” and paste in one of the keys listed above. For this example we'll use Gerald's key:

![Paste your account key into MetaMask](/images/metamask/metamask-4.png)

You should end up with an imported “Account 2” that looks like this:

![MetaMask displaying your new Account 2](/images/metamask/metamask-5.png)

## Connect MetaMask to Moonbeam {: #connect-metamask-to-moonbeam } 

Once you have [MetaMask](https://metamask.io/) installed and have created or imported an account, you can connect it to Moonbeam by clicking on the top right logo and opening the settings.

![MetaMask3](/images/metamask/metamask-6.png)

Next, navigate to the Networks tab and click on the "Add Network" button.

![MetaMask4](/images/metamask/metamask-7.png)

Here you can configure MetaMask for the following networks:

=== "Moonbeam Development Node"

    - Network Name: `Moonbeam Dev`
    - RPC URL: `{{ networks.development.rpc_url }}`
    - ChainID: `{{ networks.development.chain_id }}`
    - Symbol (Optional): `DEV`
    - Block Explorer (Optional): `{{ networks.development.block_explorer }}`

=== "Moonbase Alpha"

    - Network Name: `Moonbase Alpha`
    - RPC URL: `{{ networks.moonbase.rpc_url }}`
    - ChainID: `{{ networks.moonbase.chain_id }}`
    - Symbol (Optional): `DEV`
    - Block Explorer (Optional): `{{ networks.moonbase.block_explorer }}`

=== "Moonriver"

    - Network Name: `Moonriver`
    - RPC URL: `{{ networks.moonriver.rpc_url }}`
    - ChainID: `{{ networks.moonriver.chain_id }}`
    - Symbol (Optional): `MOVR`
    - Block Explorer (Optional): `{{ networks.moonriver.block_explorer }}`

![MetaMask5](/images/metamask/metamask-8.png)

## Initiate a Transfer {: #initiate-a-transfer } 

You can also try sending some tokens with MetaMask. You will need two accounts for this example, so if you need to create another one you can do so now. Once you have two accounts, click "Send" to initiate the transfer. Select the “Transfer between my accounts” option, transfer 100 tokens, and leave all other settings as they are:

![Initiating a token transfer](/images/metamask/metamask-9.png)

Once you have submitted the transaction, you will see it “pending” until it is confirmed, as shown in the following image:

![Transaction confirmation](/images/metamask/metamask-10.png)

Note that the Account 2 balance has been decreased by the sent amount + gas fees. Flipping over to Account 1, we see the 100 sent tokens have arrived:

![New balance in Account 1](/images/metamask/metamask-11.png)

If you head back over to your terminal where you have your Moonbeam node running, you will begin to see blocks being authored as transactions arrive:

![Moonbeam Development Node](/images/metamask/metamask-12.png)

!!! note
    If you end up resetting your development node using the Substrate purge-chain command, you will need to reset your MetaMask genesis account using Settings -> Advanced -> Reset Account. This will clear the transaction history from your accounts and reset the nonce. Make sure you don’t erase anything that you want to keep!
 
