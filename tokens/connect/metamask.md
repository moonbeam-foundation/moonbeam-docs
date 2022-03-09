---
title: Using MetaMask
description: This guide walks you through how to connect MetaMask, an browser-based Ethereum wallet, to Moonriver, the Moonbase Alpha TestNet, or a Moonbeam development node.
---

# Interacting with Moonbeam Using MetaMask

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/ywpc1UwpIyg' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style><div class='caption'>In this video, we'll show you how to connect your MetaMask wallet to the Moonriver network</a></div>

## Introduction {: #introduction } 

Developers can leverage Moonbeam's Ethereum compatibility features to integrate tools, such as [MetaMask](https://metamask.io/), into their DApps. By doing so, they can use the injected library MetaMask provides to interact with the blockchain.

Currently, MetaMask can be configured to connect to a few networks: Moonbeam, Moonriver, the Moonbase Alpha TestNet, and a Moonbeam development node.

If you already have MetaMask installed, you can easily connect MetaMask to the network of your choice:

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonbeam">Connect to Moonbeam</a>
</div>

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonriver">Connect to Moonriver</a>
</div>

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonbase">Connect to Moonbase Alpha</a>
</div>

!!! note
    MetaMask will popup asking for permission to add a a custom network. Once you approve permissions, MetaMask will switch your current network.

Learn [how to integrate a Connect MetaMask button](/builders/interact/metamask-dapp/) into your DApp, so that users can connect to Moonbase Alpha with a simple click of a button. The guide can also be adapted for the other Moonbeam-based networks.

## Install the MetaMask Extension {: #install-the-metamask-extension } 

First, we start with a fresh and default [MetaMask](https://metamask.io/) installation from the Chrome store. After downloading, installing, and initializing the extension, follow the **Get Started** guide. In there, you need to create a wallet, set a password, and store your secret backup phrase (this gives direct access to your funds, so make sure to store these in a secure place). 

## Create a Wallet {: #create-a-wallet } 

After installing [MetaMask](https://metamask.io), the setup will automatically open a new task with a welcome screen. Click **Get Started** to begin the setup process.

![MetaMask1](/images/tokens/connect/metamask/metamask-1.png)

When prompted, you are given the option to import a wallet using a recovery seed phrase. For this exercise, set up a new wallet.

![MetaMask2](/images/tokens/connect/metamask/metamask-2.png)

## Import Accounts {: #import-accounts } 

Instead of creating an account, you also have the option of importing any account into MetaMask you hold the private keys to. For this example, you'll import a development account.

![Import dev account into MetaMask](/images/tokens/connect/metamask/metamask-3.png)

The details for the development accounts that comes pre-funded for this development node are as follows:

--8<-- 'code/setting-up-node/dev-accounts.md'

--8<-- 'code/setting-up-node/dev-testing-account.md'

On the import screen, select **Private Key** and paste in one of the keys listed above. For this example we'll use Gerald's key:

![Paste your account key into MetaMask](/images/tokens/connect/metamask/metamask-4.png)

You should end up with an imported **Account 2** that looks like this:

![MetaMask displaying your new Account 2](/images/tokens/connect/metamask/metamask-5.png)

## Connect MetaMask to Moonbeam {: #connect-metamask-to-moonbeam } 

Once you have [MetaMask](https://metamask.io/) installed and have created or imported an account, you can connect it to Moonbeam by clicking on the network dropdown and selecting **Add Network**.

![MetaMask3](/images/tokens/connect/metamask/metamask-6.png)

Here you can configure MetaMask for the following networks:

=== "Moonbeam"
    |         Variable          |                                      Value                                       |
    |:-------------------------:|:--------------------------------------------------------------------------------:|
    |       Network Name        |                                    `Moonbeam`                                    |
    |          RPC URL          |                       `{{ networks.moonbeam.public_rpc_url }}`                       |
    |          ChainID          | `{{ networks.moonbeam.chain_id }}` (hex: `{{ networks.moonbeam.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                      `GLMR`                                      |
    | Block Explorer (Optional) |                     `{{ networks.moonbeam.block_explorer }}`                     |

=== "Moonriver"
    |         Variable          |                                       Value                                        |
    |:-------------------------:|:----------------------------------------------------------------------------------:|
    |       Network Name        |                                    `Moonriver`                                     |
    |          RPC URL          |                       `{{ networks.moonriver.public_rpc_url }}`                        |
    |          ChainID          | `{{ networks.moonriver.chain_id }}` (hex: `{{ networks.moonriver.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                       `MOVR`                                       |
    | Block Explorer (Optional) |                     `{{ networks.moonriver.block_explorer }}`                      |

=== "Moonbase Alpha"
    |         Variable          |                                      Value                                       |
    |:-------------------------:|:--------------------------------------------------------------------------------:|
    |       Network Name        |                                 `Moonbase Alpha`                                 |
    |          RPC URL          |                       `{{ networks.moonbase.public_rpc_url }}`                       |
    |          ChainID          | `{{ networks.moonbase.chain_id }}` (hex: `{{ networks.moonbase.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                      `DEV`                                       |
    | Block Explorer (Optional) |                     `{{ networks.moonbase.block_explorer }}`                     |

=== "Moonbeam Dev Node"
    |         Variable          |                                         Value                                          |
    |:-------------------------:|:--------------------------------------------------------------------------------------:|
    |       Network Name        |                                     `Moonbeam Dev`                                     |
    |          RPC URL          |                          `{{ networks.development.rpc_url }}`                          |
    |          ChainID          | `{{ networks.development.chain_id }}` (hex: `{{ networks.development.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                         `DEV`                                          |
    | Block Explorer (Optional) |                      `{{ networks.development.block_explorer }}`                       |

![MetaMask5](/images/tokens/connect/metamask/metamask-7.png)

## Initiate a Transfer {: #initiate-a-transfer } 

You can also try sending some tokens with MetaMask. You will need two accounts for this example, so if you need to create another one you can do so now. Once you have two accounts, click **Send** to initiate the transfer. Select the **Transfer between my accounts** option, transfer 100 tokens, and leave all other settings as they are:

![Initiating a token transfer](/images/tokens/connect/metamask/metamask-8.png)

Once you have submitted the transaction, you will see it **pending** until it is confirmed, as shown in the following image:

![Transaction confirmation](/images/tokens/connect/metamask/metamask-9.png)

Note that the Account 2 balance has been decreased by the sent amount + gas fees. Flipping over to Account 1, we see the 100 sent tokens have arrived:

![New balance in Account 1](/images/tokens/connect/metamask/metamask-10.png)

If you head back over to your terminal where you have your Moonbeam node running, you will begin to see blocks being authored as transactions arrive:

![Moonbeam Development Node](/images/tokens/connect/metamask/metamask-11.png)

!!! note
    If you end up resetting your development node using the Substrate purge-chain command, you will need to reset your MetaMask genesis account. To do so click on the colored circle in the top right corner and from the menu click on **Settings**. Then click on **Advanced**, and **Reset Account**. This will clear the transaction history from your accounts and reset the nonce. Make sure you don’t erase anything that you want to keep!
 
--8<-- 'text/disclaimers/third-party-content.md'