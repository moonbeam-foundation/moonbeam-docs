---
title: How to Connect MetaMask
description: This guide walks you through how to connect MetaMask, a browser-based Ethereum wallet, to Moonbeam-based networks and how to transfer funds.
---

# Interacting with Moonbeam Using MetaMask

## Introduction {: #introduction }

Developers can leverage Moonbeam's Ethereum compatibility features to integrate tools, such as [MetaMask](https://metamask.io){target=\_blank}, into their dApps. By doing so, they can use the injected library MetaMask provides to interact with the blockchain.

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
    MetaMask will pop up asking for permission to add a custom network. Once you approve permissions, MetaMask will switch your current network.

Learn [how to integrate a Connect MetaMask button](/builders/integrations/wallets/metamask/){target=\_blank} into your dApp, so that users can connect to Moonbase Alpha with a simple click of a button. The guide can also be adapted for the other Moonbeam-based networks.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Install the MetaMask Extension {: #install-the-metamask-extension }

First, you'll start with a fresh and default [MetaMask](https://metamask.io){target=\_blank} installation from the Chrome store. After downloading, installing, and initializing the extension, follow the **Get Started** guide. In there, you need to create a wallet, set a password, and store your secret backup phrase (this gives direct access to your funds, so make sure to store these in a secure place).

## Setup a Wallet {: #setup-a-wallet }

After installing [MetaMask](https://metamask.io){target=\_blank}, the setup will automatically open a new task with a welcome screen. Here, you are offered two options:

- **Create a new wallet** - you'll go through some steps to get a new seed phrase. Ensure you store this phrase securely and you don't share it publicly
- **Import an existing wallet** - you already have a seed phrase stored, and you want to restore an account from that recovery phrase

![Metamask Setup Interface](/images/tokens/connect/metamask/metamask-1.webp)

Once you've clicked on the option that adapts to your needs, follow the steps, and you should be all setup.

!!! note
    Multiple accounts can be derived from a seed phrase by changing what is known as the address index. By default, when creating or importing an account from the seed phrase, you get the account with the address index 0. You can get the other indexes by just adding new accounts in the main Metamask screen.

## Import Accounts {: #import-accounts }

Once you've created a wallet or imported an existing one, you can also import any account into MetaMask if you hold the private keys.

For this example, you'll use private keys from the development account. Click the account switcher button to import an account using its private keys. That is where it says **Account 1**.

![Importing account from private key metamask menu](/images/tokens/connect/metamask/metamask-2.webp)

Next, click on **Import Account**.

![Importing account from private key account switcher menu](/images/tokens/connect/metamask/metamask-3.webp)

Finally, enter the private keys of the account you are trying to import. For example, you can use one of the accounts prefunded in the Moonbeam development node. This guide uses Gerald's key. Once you've entered the private key, click on **Import**.

??? note "Development account addresses and private keys"
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/dev-accounts.md'
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/dev-testing-account.md'

![Paste your account key into MetaMask](/images/tokens/connect/metamask/metamask-4.webp)

You should end up with an imported **Account 2** that looks like this:

![MetaMask displaying your new Account 2](/images/tokens/connect/metamask/metamask-5.webp)

## Connect MetaMask to Moonbeam {: #connect-metamask-to-moonbeam }

Once you have [MetaMask](https://metamask.io){target=\_blank} installed and have created or imported an account, you can connect it to any Moonbeam-based network. To do so, take the following steps:

1. Click in the upper left network selector menu
2. Select **Add Network**

![Add new network in Metamask menu](/images/tokens/connect/metamask/metamask-6.webp)

Next, go to the bottom of the page and click on **Add a network manually**:

![Add network manually in Metamask](/images/tokens/connect/metamask/metamask-7.webp)

Here, you can configure MetaMask for the following networks:

=== "Moonbeam"
    |         Variable          |                                      Value                                       |
    |:-------------------------:|:--------------------------------------------------------------------------------:|
    |       Network Name        |                                    `Moonbeam`                                    |
    |          RPC URL          |                     `{{ networks.moonbeam.public_rpc_url }}`                     |
    |         Chain ID          | `{{ networks.moonbeam.chain_id }}` (hex: `{{ networks.moonbeam.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                      `GLMR`                                      |
    | Block Explorer (Optional) |                     `{{ networks.moonbeam.block_explorer }}`                     |

=== "Moonriver"
    |         Variable          |                                       Value                                        |
    |:-------------------------:|:----------------------------------------------------------------------------------:|
    |       Network Name        |                                    `Moonriver`                                     |
    |          RPC URL          |                     `{{ networks.moonriver.public_rpc_url }}`                      |
    |         Chain ID          | `{{ networks.moonriver.chain_id }}` (hex: `{{ networks.moonriver.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                       `MOVR`                                       |
    | Block Explorer (Optional) |                     `{{ networks.moonriver.block_explorer }}`                      |

=== "Moonbase Alpha"
    |         Variable          |                                      Value                                       |
    |:-------------------------:|:--------------------------------------------------------------------------------:|
    |       Network Name        |                                 `Moonbase Alpha`                                 |
    |          RPC URL          |                        `{{ networks.moonbase.rpc_url }}`                         |
    |         Chain ID          | `{{ networks.moonbase.chain_id }}` (hex: `{{ networks.moonbase.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                      `DEV`                                       |
    | Block Explorer (Optional) |                     `{{ networks.moonbase.block_explorer }}`                     |

=== "Moonbeam Dev Node"
    |         Variable          |                                         Value                                          |
    |:-------------------------:|:--------------------------------------------------------------------------------------:|
    |       Network Name        |                                     `Moonbeam Dev`                                     |
    |          RPC URL          |                          `{{ networks.development.rpc_url }}`                          |
    |         Chain ID          | `{{ networks.development.chain_id }}` (hex: `{{ networks.development.hex_chain_id }}`) |
    |     Symbol (Optional)     |                                         `DEV`                                          |
    | Block Explorer (Optional) |                      `{{ networks.development.block_explorer }}`                       |

To do so, fill in the following information:

1. **Network name** - name that represents the network you are connecting to
2. **RPC URL** - [RPC endpoint](/builders/get-started/endpoints){target=\_blank} of the network
3. **Chain ID** - chain ID of the Ethereum compatible network
4. **Symbol** - (optional) symbol of the native token of the network. For example, for Moonbeam, the value would be **GLMR**
5. **Block Explorer** - (optional) URL of the [block explorer](/builders/get-started/explorers){target=\_blank}
6. Once you've verified all the information, click on **Save**

![Add network in Metamask](/images/tokens/connect/metamask/metamask-8.webp)

Once you've added the network, you'll be redirected to a screen stating that you've successfully added a network. Furthermore, you'll be prompted to **Switch to Moonbase Alpha**, the network added in this example.

![Successfully added a network in Metamask](/images/tokens/connect/metamask/metamask-9.webp)

## Interact with the Network {: #interact-with-the-network }

Once you've [connected Metamask](#connect-metamask-to-moonbeam) to any Moonbeam-based network, you can start using your wallet by:

- Sending a token transfer to another address
- Adding ERC-20s to Metamask and interacting with them
- Adding ERC-721s to Metamask and interacting with them

### Initiate a Transfer { #initiate-a-transfer }

This section showcases how to do a simple token transfer to another address as an example of using Metamask with Moonbeam.

To do so, take the following steps:

1. Ensure you are connected to the correct network
2. Ensure you have selected the account you want to use for the transfer
3. On the main screen of your Metamask wallet, click on **Send**

![Initiate balance transfer in Metamask](/images/tokens/connect/metamask/metamask-10.webp)

Next, you can enter the address to which you want to send the tokens. For this example, a wallet that has already been imported to Metamask is selected, known as **Bob**.

![Select account to send tokens to in Metamask](/images/tokens/connect/metamask/metamask-11.webp)

On the next screen, take the following steps:

1. Enter the number of tokens you want to send
2. Verify that all the information is correct, and click on **Next**

![Set the amount of tokens to send in Metamask](/images/tokens/connect/metamask/metamask-12.webp)

Lastly, confirm that all the gas-related parameters and fees are correct. After you've verified that everything is OK, click **Confirm**. At this point, your transaction has been sent to the network!

![Confirming a transaction in Metamask](/images/tokens/connect/metamask/metamask-13.webp)

Once you've confirmed your transaction, you are taken back to the main screen of your wallet, where you'll see the transaction as **Pending**. After less than a minute, the transaction should be **Confirmed**. If you click on your transaction, you can check more details and view it in a block explorer.

![Transaction confirmed in Metamask](/images/tokens/connect/metamask/metamask-14.webp)

### Add an ERC-20 Token {: #add-an-erc20-token }

To add an ERC-20 to your MetaMask wallet, you'll need to import the token using its address:

1. Make sure you've switched to the **Tokens** tab in MetaMask
2. Click **Import tokens**
3. Enter the contract address of the token you want to import. The **Token symbol** and **Token decimal** fields will automatically be populated, but you can edit the **Token symbol** if needed
4. Click **Next**

![The tokens tab and the import tokens process in MetaMask, where the token address, symbol, and decimal are defined.](/images/tokens/connect/metamask/metamask-15.webp)

Next, you'll be able to review the token import details. To finalize the import, you can click **Import**.

![Review the token details and finalize the import in MetaMask.](/images/tokens/connect/metamask/metamask-16.webp)

Under the **Tokens** tab, you'll be able to see the token and the account balance for the token.

![View the imported token in the list of assets on the tokens tab in MetaMask.](/images/tokens/connect/metamask/metamask-17.webp)

### Add an ERC-721 Token {: #add-an-erc721-token }

To add an ERC-721 to your MetaMask wallet, you'll need the token's address:

1. Make sure you've switched to the **NFTs** tab in MetaMask
2. Click **Import NFT**
3. Enter the **Address** of the NFT you want to import and the **Token ID**
4. Click **Import**

![The NFTs tab and the import NFT process in MetaMask, where the address and the token ID of the NFT are defined.](/images/tokens/connect/metamask/metamask-18.webp)

Once you've imported your NFT, you'll be able to see a preview of your NFT in the **NFTs** tab. You can click on the NFT to see more details.

![View the imported NFT in the list of NFTs on the NFTs tab in MetaMask.](/images/tokens/connect/metamask/metamask-19.webp)

--8<-- 'text/_disclaimers/third-party-content.md'
