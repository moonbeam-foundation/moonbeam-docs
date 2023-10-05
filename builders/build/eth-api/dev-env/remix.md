---
title: Deploy Smart Contracts with Remix
description: Learn how to use one of the most popular Ethereum developer tools, the Remix IDE, to interact with Moonbeam-based networks.
---

# Using Remix to Deploy to Moonbeam

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/NBOLCGT5-ww' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## Introduction {: #introduction }

[Remix](https://remix.ethereum.org/){target=_blank} is one of the commonly used development environments for smart contracts on Ethereum. Given Moonbeam’s Ethereum compatibility features, Remix can be used directly with any of the Moonbeam networks.

This guide walks through the process of creating and deploying a Solidity-based smart contract to a Moonbeam development node using the Remix IDE. This guide can be adapted for Moonbeam, Moonriver, or Moonbase Alpha.

## Checking Prerequisites {: #checking-prerequisites }

For the purposes of this guide, you'll need to have the following:

- A locally running [Moonbeam development node](/builders/get-started/networks/moonbeam-dev/){target=_blank}
- [MetaMask installed and configured](/tokens/connect/metamask/){target=_blank} to use your development node

If you followed the guides above, you should have a local Moonbeam node which will begin to author blocks as transactions arrive.

![Local Moonbeam node producing blocks](/images/builders/build/eth-api/dev-env/remix/using-remix-1.png)

Your development node comes with 10 pre-funded accounts. You should have MetaMask connected to your Moonbeam development node and have imported at least one of the pre-funded accounts.

![MetaMask installation with a balance](/images/builders/build/eth-api/dev-env/remix/using-remix-2.png)

If you're adapting this guide for Moonbeam, Moonriver, or Moonbase Alpha make sure you are connected to the correct network and have an account with funds.
--8<-- 'text/_common/faucet/faucet-sentence.md'

## Getting Started with Remix {: #getting-started-with-remix }

Now, you can head to [Remix](https://remix.ethereum.org/){target=_blank} to get started. In the main screen, under **Featured Plugins**, select **SOLIDITY** to configure Remix for Solidity development, then navigate to the **File Explorers** view.

![File explorer](/images/builders/build/eth-api/dev-env/remix/using-remix-3.png)

You will create a new file to save the Solidity smart contract. Hit the **+** button under **File Explorers** and enter the name `MyToken.sol` in the pop-up.

![Create a new file for your Solidity contract](/images/builders/build/eth-api/dev-env/remix/using-remix-4.png)

Next, paste the following smart contract into the editor tab:

```solidity
--8<-- 'code/builders/build/eth-api/dev-env/remix/MyToken.sol'
```

![Paste the contract into the editor](/images/builders/build/eth-api/dev-env/remix/using-remix-5.png)

This is a simple ERC-20 contract based on the current OpenZeppelin ERC-20 template. It creates `MyToken` with symbol `MYTOK` and mints the entirety of the initial supply to the creator of the contract.

Now, navigate to the **Compile** sidebar option and press the **Compile MyToken.sol** button.

![Compile MyToken.sol](/images/builders/build/eth-api/dev-env/remix/using-remix-6.png)

You will see Remix download all of the OpenZeppelin dependencies and compile the contract.

## Deploying a Contract to Moonbeam Using Remix {: #deploying-a-contract-to-moonbeam-using-remix }

Now you can deploy the contract by navigating to the **Deployment** sidebar option. You need to change the topmost **ENVIRONMENT** dropdown from **JavaScript VM** to **Injected Web3**. This tells Remix to use the MetaMask injected provider, which will point it to your Moonbeam development node. If you wanted to try this using another Moonbeam network, you would have to connect MetaMask to the correct network instead of your local development node.

As soon as you select **Injected Web3**, you will be prompted to allow Remix to connect to your MetaMask account.

![Replace](/images/builders/build/eth-api/dev-env/remix/using-remix-7.png)

Press **Next** in MetaMask to allow Remix to access the selected account.

Back on Remix, you should see that the account you wish to use for deployment is now managed by MetaMask. Next to the **Deploy** button, specify an initial supply of 8M tokens. Since this contract uses the default of 18 decimals, the value to put in the box is `8000000000000000000000000`.

Once you have entered this value, select **Deploy**.

![Enter an account balance and deploy](/images/builders/build/eth-api/dev-env/remix/using-remix-8.png)

You will be prompted in MetaMask to confirm the contract deployment transaction.

![Confirm the transaction message](/images/builders/build/eth-api/dev-env/remix/using-remix-9.png)

!!! note
    If you have problems deploying any specific contract, you can try manually increasing the gas limit in MetaMask. Select the colored circle in the top right corner and select **Settings** from the menu. Then click on **Advanced** and toggle the **Advanced Gas Controls** setting to **ON**.

After you press **Confirm** and the deployment is complete, you will see the transaction listed in MetaMask. The contract will appear under **Deployed Contracts** in Remix.

![Confirmed label on a transaction](/images/builders/build/eth-api/dev-env/remix/using-remix-10.png)

Once the contract is deployed, you can interact with it from within Remix.

Drill down on the contract under **Deployed Contracts**. Clicking on **name**, **symbol**, and **totalSupply** should return `MyToken`, `MYTOK`, and `8000000000000000000000000` respectively. If you copy the address from which you deployed the contract and paste it into the **balanceOf** field, you should see the entirety of the balance of the ERC-20 as belonging to that user. Copy the contract address by clicking the button next to the contract name and address.

![Interact with the contract from Remix](/images/builders/build/eth-api/dev-env/remix/using-remix-11.png)

## Interacting with a Moonbeam-based ERC-20 from MetaMask {: #interacting-with-a-moonbeam-based-erc-20-from-metamask }

Now, open MetaMask to add the newly deployed ERC-20 tokens. Before doing so, make sure you have copied the contract's address from Remix. Back in MetaMask, click on **Add Token** as shown below. Make sure you are connected to the account that deployed the token contract.

![Add a token](/images/builders/build/eth-api/dev-env/remix/using-remix-12.png)

Paste the copied contract address into the **Custom Token** field. The **Token Symbol** and **Decimals of Precision** fields should be automatically populated.

![Paste the copied contract address](/images/builders/build/eth-api/dev-env/remix/using-remix-13.png)

After hitting **Next**, you will need to confirm that you want to add these tokens to your MetaMask account. Hit **Add Token** and you should see a balance of 8M MyTokens in MetaMask:

![Add the tokens to your MetaMask account](/images/builders/build/eth-api/dev-env/remix/using-remix-14.png)

Now you can send some of these ERC-20 tokens to the other account that you have set up in MetaMask. Hit **Send** to initiate the transfer of 500 MyTokens and select the destination account.

After hitting **Next**, you will be asked to confirm (similar to what is pictured below).

![Confirmation of the token transfer](/images/builders/build/eth-api/dev-env/remix/using-remix-15.png)

Hit **Confirm** and, after the transaction is complete, you will see a confirmation and a reduction of the MyToken account balance from the sender account in MetaMask:

![Verify the reduction in account balance](/images/builders/build/eth-api/dev-env/remix/using-remix-16.png)

If you own the account that you sent the tokens to, you can add the token asset to verify that the transfer arrived.

## Using the Moonbeam Remix Plugin {: #using-the-moonbeam-remix-plugin }

The Moonbeam team has built a Remix plugin that makes it even easier to develop and deploy your Ethereum smart contracts on Moonbeam. The Moonbeam Remix plugin combines all of the important functions needed to compile, deploy, and interact with your smart contracts from one place - no switching tabs needed. The Moonbeam Remix plugin supports Moonbeam, Moonriver, and the Moonbase Alpha TestNet.

### Installing the Moonbeam Remix Plugin {: #installing-the-moonbeam-remix-plugin }

To install the Moonbeam Remix plugin, take the following steps:

 1. Head to the **Plugin manager** tab
 2. Search for **Moonbeam**
 3. Press **Activate** and the Moonbeam Remix plugin will be added directly above the plugin manager tab

![Activating the Moonbeam Remix Plugin](/images/builders/build/eth-api/dev-env/remix/using-remix-17.png)

Once you've added the plugin, a Moonbeam logo will appear on the left hand side, representing the Moonbeam Remix plugin tab.

### Getting Started with the Moonbeam Remix Plugin {: #getting-started-with-the-moonbeam-remix-plugin }

Click on the Moonbeam logo in your Remix IDE to open the Moonbeam plugin. This part assumes you already have a contract in Remix ready to be compiled. You can generate an [ERC-20 contract here](https://wizard.openzeppelin.com/){target=_blank}. To deploy an ERC-20 Token to Moonbase Alpha using the Moonbeam Remix plugin, you can take the following steps:

 1. Press **Connect** to connect MetaMask to Remix
 2. Ensure you're on the correct network. For this example, you should be on Moonbase Alpha
 3. Press **Compile** or choose **Auto-Compile** if you prefer
 4. Press **Deploy** and **Confirm** the transaction in MetaMask

![Compiling and Deploying a Contract with the Moonbeam Remix Plug](/images/builders/build/eth-api/dev-env/remix/using-remix-18.png)

It's that easy! Once the contract is deployed, you'll see the address and all available read/write methods to interact with it.

The Moonbeam Remix plugin works seamlessly with Remix so you can freely switch between using the traditional Remix compile and deploy tabs and the Moonbeam Remix plugin.

--8<-- 'text/_disclaimers/third-party-content.md'



