---
title:  Native Token ERC-20 Precompile
description:  Learn how to access and interact with an ERC-20 representation of the native token on Moonbeam through the precompiled ERC-20 Interface.
keywords: solidity, ethereum, native, token, moonbeam, precompiled, contracts
---

#  Native Token ERC-20 Precompile

## Introduction {: #introduction }

The native token ERC-20 precompiled contract on Moonbeam allows developers to interact with the native protocol token through an ERC-20 interface. Although GLMR and MOVR are not ERC-20 tokens, now you can interact with them as if they were native ERC-20s!

One of the main benefits of this precompile is that it removes the necessity of having a wrapped representation of the protocol token as an ERC-20 smart contract, such as WETH on Ethereum. Furthermore, it prevents having multiple wrapped representations of the same protocol token. Consequently, DApps that need to interact with the protocol token via an ERC-20 interface can do so without needing a separate smart contract.

Under the hood, the [ERC-20 precompile](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/src/lib.rs){target=\_blank} executes specific Substrate actions related to the Substrate balances pallet, which is coded in Rust. The balances pallet provides functionality for handling the [various types of balances on Moonbeam](/learn/core-concepts/balances/#moonbeam-account-balances){target=\_blank}, setting the free balance, transferring balances, and more.

This guide will show you how to interact with DEV tokens, the native protocol tokens for the Moonbase Alpha TestNet, via the ERC-20 precompile. You can also follow and adapt this guide to learn how to use GLMR or MOVR as an ERC-20 token.

The precompile is located at the following address:

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.erc20 }}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.erc20 }}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonriver.precompiles.erc20 }}
     ```

--8<-- 'text/builders/ethereum/precompiles/security.md'

## The ERC-20 Solidity Interface {: #the-erc20-interface }

The [`ERC20.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol){target=\_blank} interface on Moonbeam follows the [EIP-20 Token Standard](https://eips.ethereum.org/EIPS/eip-20){target=\_blank} which is the standard API interface for tokens within smart contracts. The standard defines the required functions and events that a token contract must implement to be interoperable with different applications.

--8<-- 'text/builders/ethereum/precompiles/ux/erc20/erc20-interface.md'

!!! note
    The ERC-20 precompile does not include `deposit` and `withdraw` functions and subsequent events that are expected from a wrapped token contract, such as WETH.

## Interact with the Solidity Interface {: #interact-with-the-solidity-interface }

### Checking Prerequisites {: #checking-prerequisites }

To follow along with this tutorial, you will need to have:

- [MetaMask installed and connected to Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
- Create or have two accounts on Moonbase Alpha to test out the different features in the ERC-20 precompile
- At least one of the accounts will need to be funded with `DEV` tokens.
 --8<-- 'text/_common/faucet/faucet-list-item.md'

### Add Token to MetaMask {: #add-token-to-metamask }

If you want to interact with Moonbase Alpha DEV tokens like you would with an ERC-20 in MetaMask, you can create a custom token using the precompile address.

To get started, open up MetaMask and make sure you are [connected to Moonbase Alpha](/tokens/connect/metamask/){target=\_blank} and:

1. Switch to the **Assets** tab
2. Click on **Import tokens**

![Import Tokens from Assets Tab in MetaMask](/images/builders/ethereum/precompiles/ux/erc20/erc20-1.webp)

Now, you can create a custom token:

1. Enter the precompile address for the token contract address - `{{networks.moonbase.precompiles.erc20 }}`. As soon as you enter the address, the **Token Symbol** and **Token Decimal** fields should automatically populate. If they don't you can enter `DEV` for the symbol and `18` for the decimal places
2. Click **Add Custom Token**

![Add Custom Token](/images/builders/ethereum/precompiles/ux/erc20/erc20-2.webp)

MetaMask will prompt you to import the tokens. You can review the token details and click **Import Tokens** to import DEV tokens into your wallet.

![Confirm and Import Tokens](/images/builders/ethereum/precompiles/ux/erc20/erc20-3.webp)

And that's it! You've successfully added the DEV token as a custom ERC-20 token on the Moonbase Alpha TestNet.

### Remix Set Up {: #remix-set-up }

You can interact with the ERC-20 precompile using [Remix](https://remix.ethereum.org){target=\_blank}. To add the precompile to Remix, you will need to:

1. Get a copy of [`ERC20.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol){target=\_blank}
2. Paste the file contents into a Remix file named `IERC20.sol`

### Compile the Contract {: #compile-the-contract }

Next, you will need to compile the interface in Remix:

1. Click on the **Compile** tab, second from top
2. Compile the interface by clicking on **Compile IERC20.sol**

![Compiling IERC20.sol](/images/builders/ethereum/precompiles/ux/erc20/erc20-4.webp)

If the interface was compiled successfully, you will see a green checkmark next to the **Compile** tab.

### Access the Contract {: #access-the-contract }

Instead of deploying the ERC-20 precompile, you will access the interface given the address of the precompiled contract:

1. Click on the **Deploy and Run** tab directly below the **Compile** tab in Remix. Please note the precompiled contract is already deployed
2. Make sure **Injected Web3** is selected in the **ENVIRONMENT** dropdown. Once you select **Injected Web3**, you might be prompted by MetaMask to connect your account to Remix
3. Make sure the correct account is displayed under **ACCOUNT**
4. Ensure **IERC20 - IERC20.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract, there is no need to deploy any code. Instead you are going to provide the address of the precompile in the **At Address** field
5. Provide the address of the ERC-20 precompile: `{{networks.moonbase.precompiles.erc20}}` and click **At Address**

![Access the address](/images/builders/ethereum/precompiles/ux/erc20/erc20-5.webp)

The **IERC20** precompile will appear in the list of **Deployed Contracts**.

### Get Basic Token Information {: #get-basic-token-information }

The ERC-20 interface allows you to quickly obtain token information, including the token's total supply, name, symbol, and decimal places. You can get this information by following these steps:

1. Expand the **IERC20** contract under **Deployed Contracts**
2. Click **decimals** to get the decimal places of the Moonbase Alpha native protocol token
3. Click **name** to get the name of the token
4. Click **symbol** to get the symbol of the token
5. Click **totalSupply** to obtain the total supply of tokens in existence on Moonbase Alpha

![Total Supply](/images/builders/ethereum/precompiles/ux/erc20/erc20-6.webp)

The response for each call will be displayed under the corresponding function.

### Get Account Balance {: #get-account-balance }

You can check the balance of any address on Moonbase Alpha by calling the `balanceOf` function and passing in an address:

1. Expand the **balanceOf** function
2. Enter an address you would like to check the balance of for the **owner**
2. Click **call**

![Get Balance of an Account](/images/builders/ethereum/precompiles/ux/erc20/erc20-7.webp)

Your balance will be displayed under the `balanceOf` function.

### Approve a Spend {: #approve-a-spend }

To approve a spend, you'll need to provide an address for the spender and the number of tokens  that the spender is allowed to spend. The spender can be an externally owned account or a smart contract. For this example, you can approve the spender to spend 1 DEV token. To get started, please follow these steps:

1. Expand the **approve** function
2. Enter the address of the spender. You should have created two accounts before starting, so you can use the second account as the spender
3. Enter the amount of tokens the spender can spend for the **value**. For this example, you can allow the spender to spend 1 DEV token in Wei units (`1000000000000000000`)
4. Click **transact**
5. MetaMask will pop up, and you will be prompted to review the transaction details. Click **View full transaction details** to review the amount to be sent and the address of the spender
6. If everything looks ok, you can click **Confirm** to send the transaction

![Confirm Approve Transaction](/images/builders/ethereum/precompiles/ux/erc20/erc20-8.webp)

After the transaction has successfully gone through, you'll notice that the balance of your account hasn't changed. This is because you have only approved the spend for the given amount, and the spender hasn't spent the funds. In the next section, you will use the `allowance` function to verify that the spender is able to spend 1 DEV token on your behalf.

### Get Allowance of Spender {: #get-allowance-of-spender }

To check that the spender received the allowance approved in the [Approve a Spend](#approve-a-spend) section, you can:

1. Expand the **allowance** function
2. Enter your address for the **owner**
3. Enter the address of the **spender** that you used in the previous section
4. Click **call**

![Get Allowance of Spender](/images/builders/ethereum/precompiles/ux/erc20/erc20-9.webp)

Once the call is complete, the allowance of the spender will be displayed, which should be equivalent to 1 DEV token (`1000000000000000000`).

### Send Transfer {: #send-transfer }

To do a standard transfer and send tokens from your account directly to another account, you can call the `transfer` function by following these steps:

1. Expand the **transfer** function
2. Enter the address to send DEV tokens to. You should have created two accounts before starting, so you can use the second account as the recipient
3. Enter the amount of DEV tokens to send. For this example, you can send 1 DEV token (`1000000000000000000`)
4. Click **transact**
5. MetaMask will pop up, you can review the transaction details, and if everything looks good, click **Confirm**

![Send Standard Transfer](/images/builders/ethereum/precompiles/ux/erc20/erc20-10.webp)

Once the transaction is complete, you can [check your balance](#get-account-balance) using the `balanceOf` function or by looking at MetaMask, and notice that this time your balance decreased by 1 DEV token. You can also use the `balanceOf` function to ensure that the recipients balance has increased by 1 DEV token as expected.

### Send Transfer From Specific Account {: #send-transferfrom }

So far, you should have approved an allowance of 1 DEV token for the spender and sent 1 DEV token via the standard `transfer` function. The `transferFrom` function varies from the standard `transfer` function as it allows you to define the address to which you want to send the tokens. So you can specify an address that has an allowance or your address as long as you have funds. For this example, you will use the spender's account to initiate a transfer of the allowed funds from the owner to the spender. The spender can send the funds to any account, but you can send the funds from the owner to the spender for this example.

First, you need to switch to the spender's account in MetaMask. Once you switch to the spender's account, you'll notice that the selected address in Remix under the **Accounts** tab is now the spender's.

![Switch accounts Remix](/images/builders/ethereum/precompiles/ux/erc20/erc20-11.webp)

Next, you can initiate and send the transfer, to do so:

1. Expand the **transferFrom** function
2. Enter your address as the owner in the **from** field
3. Enter the recipient address, which should be the spender's address, in the **to** field
4. Enter the amount of DEV tokens to send. Again, the spender is currently only allowed to send 1 DEV token, so enter `1000000000000000000`
5. Click **transact**

![Send Standard Transfer](/images/builders/ethereum/precompiles/ux/erc20/erc20-12.webp)

Once the transaction is complete, you can [check the balance](#get-account-balance) of the owner and spender using the `balanceOf` function. The spender's balance should have increased by 1 DEV token, and their allowance should now be depleted. To verify that the spender no longer has an allowance, you can call the `allowance` function, passing in the owner and spender's addresses. You should receive a result of 0.

![Zero Allowance](/images/builders/ethereum/precompiles/ux/erc20/erc20-13.webp)

And that's it! You've successfully interacted with the ERC-20 precompile using MetaMask and Remix!