---
title: Native Token ERC-20
description:  Learn how to access and interact with an ERC-20 representation of native token on Moonbea, and check how this is done on the Moonbase Alpha TestNet by using the ERC-20 precompiled contract.
---

#  Native Token ERC-20 Precompile

![Precomiled Contracts Banner](/images/builders/tools/precompiles/erc20/erc20-banner.png)

## Introduction {: #introduction } 

The native token ERC-20 precompiled contract on Moonbeam allows developers to interact with the native protocol token through an ERC-20 interface.

One of the main benefits of this precompile is that it removes the necessity of having a wrapped representation of the protocol token as an ERC-20 smart contract, such as WETH on Ethereum. Furthermore, it prevents having multiple wrapped representations of the same protocol token. Consequently, DApps that need to interact with the protocol token via an ERC-20 interface can do so without needing a separate smart contract.

Under the hood, the [ERC-20 precompile](https://github.com/PureStake/moonbeam/blob/master/precompiles/balances-erc20/src/lib.rs) executes specific Substrate actions related to the Substrate balances pallet, which is coded in Rust. The balances pallet provides functionality for handling the [various types of balances in Moonbeam](/builders/get-started/eth-compare/balances/#moonbeam-account-balances), setting the free balance, transferring balances, and more.

This guide will show you how to interact with DEV tokens, the native protocol tokens for the Moonbase Alpha TestNet, via the ERC-20 precompile.

## The ERC-20 Interface {: #the-erc20-interface }

The [ERC20.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol) interface on Moonbeam follows the [EIP-20 Token Standard](https://eips.ethereum.org/EIPS/eip-20) which is the standard API interface for tokens within smart contracts. The standard defines the required functions and events that a token contract must implement to be interoperable with different applications.

The precompile is located at the following address:

=== "Moonbase Alpha"
     ```
     {{networks.moonbase.precompiles.erc20 }}
     ```

The interface includes the following functions:

- **name()** - read-only function that returns the name of the token
- **symbol()** - read-only function that returns the symbol of the token
- **decimals()** - read-only function that returns the decimals of the token
- **totalSupply()** - read-only function that returns the total number of tokens in existence
- **balanceOf(*address* who)** - read-only function that returns the balance of the specified address
- **allowance(*address* owner, *address* spender)** -  read-only function that checks and returns the amount of tokens that an owner is allowed to a spender
- **transfer(*address* to, *uint256* value)** - transfers a given amount of tokens to a specified address and returns true if the transfer was successful
- **approve(*address* spender, *uint256* value)** - approves the provided address to spend a specified amount of tokens on behalf of `msg.sender`. Returns true if successful
- **transferFrom(*address* from, *address* to, *uint256* value)** - transfers tokens from one given address to another given address and returns true if successful

!!! note
    The ERC-20 standard does not specify the implications of multiple calls to `approve`. Changing an allowance with this function numerous times enables a possible attack vector. To avoid incorrect or unintended transaction ordering, you can first reduce the `spender` allowance to `0` and then set the desired allowance afterward. For more details on the attack vector, you can check out the [ERC-20 API: An Attack Vector on Approve/TransferFrom Methods](https://docs.google.com/document/d/1YLPtQxZu1UAvO9cZ1O2RPXBbT0mooh4DYKjA_jp-RLM/edit#) overview

The interface also includes the following required events:

- **Transfer(*address indexed* from, *address indexed* to, *uint256* value)** - emitted when a transfer has been performed
- **Approval(*address indexed* owner, *address indexed* spender, *uint256* value)** - emitted when an approval has been registered

!!! note The ERC-20 precompile does not include `deposit` and `withdraw` functions and subsequent events that are expected from a wrapped token contract, such as WETH.

## Checking Prerequisites {: #checking-prerequisites } 

To follow along with this tutorial, you will need to have:

- [MetaMask installed and connected to the Moonbase Alpha](/tokens/connect/metamask/) TestNet
- Create or have two accounts on Moonbase Alpha to test out the different features in the ERC-20 precompile
- At least one of the accounts will need to be funded with `DEV` tokens. You can obtain tokens for testing purposes from the Moonbase Alpha [faucet](/builders/get-started/moonbase/#get-tokens/)

## Add Token to MetaMask {: #add-token-to-metamask }

If you want to interact with Moonbase Alpha DEV tokens like you would with an ERC-20 in MetaMask, you can create a custom token using the precompile address.

To get started, open up MetaMask and make sure you are [connected to Moonbase Alpha](/tokens/connect/metamask/) and:

1. Switch to the **Assets** tab
2. Click on **Import tokens**

![Import Tokens from Assets Tab in MetaMask](/images/builders/tools/precompiles/erc20/erc20-1.png)

Now, you can create a custom token:

1. Enter the precompile address for the token contract address - `{{networks.moonbase.precompiles.erc20 }}`. As soon as you enter the address, the token symbol and decimal should automatically populate. If they don't you can enter `DEV` for the symbol and `18` for the decimal places
2. Click **Add Custom Token**

![Add Custom Token](/images/builders/tools/precompiles/erc20/erc20-2.png)

MetaMask will prompt you to import the tokens. You can review the token details and click **Import Tokens** to import DEV tokens into your wallet. 

![Confirm and Import Tokens](/images/builders/tools/precompiles/erc20/erc20-3.png)

And that's it! You've successfully added the DEV token as a custom ERC-20 token on the Moonbase Alpha TestNet.

## Interact with the Precompile Using Remix {: #interact-with-the-precompile-using-remix } 

You can interact with the ERC20 precompile using [Remix](https://remix.ethereum.org/). To add the precompile to Remix, you will need to:

1. Get a copy of [ERC20.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol) 
2. Paste the file contents into a Remix file named **IERC20.sol**

### Compile the Contract {: #compile-the-contract } 

Next, you will need to compile the interface in Remix:

1. Click on the **Compile** tab, second from top
2. Compile the **IER20.sol** file

![Compiling IERC20.sol](/images/builders/tools/precompiles/erc20/erc20-4.png)

If the interface was compiled successfully, you will see a green checkmark next to the **Compile** tab.

### Access the Contract {: #access-the-contract } 

Instead of deploying the ERC-20 precompile, you will access the interface given the address of the precompiled contract:

1. Click on the **Deploy and Run** tab directly below the **Compile** tab in Remix. Please note the precompiled contract is already deployed
2. Make sure **Injected Web3** is selected in the **Environment** dropdown. Once you select **Injected Web3**, you might be prompted by MetaMask to connect your account to Remix
3. Make sure the correct account is displayed under **Account**
4. Ensure **IERC20 - IERC20.sol** is selected in the **Contract** dropdown. Since this is a precompiled contract, there is no need to deploy any code. Instead we are going to provide the address of the precompile in the **At Address** Field
5. Provide the address of the ERC-20 precompile: `{{networks.moonbase.precompiles.erc20}}` and click **At Address**

![Access the address](/images/builders/tools/precompiles/erc20/erc20-5.png)

The **IERC20** precompile will appear in the list of **Deployed Contracts**.

### Get Basic Token Information {: #get-basic-token-information } 

The ERC20 interface allows you to quickly obtain token information, including the token's total supply, name, symbol, and decimal places. You can get this information by following these steps:

1. Expand the IERC20 contract under **Deployed Contracts**
2. Click **`decimals`** to get the decimal places of the Moonbase Alpha native protocol token
3. Click **`name`** to get the name of the token
4. Click **`symbol`** to get the symbol of the token
5. Click **`totalSupply`** to obtain the total supply of tokens in existence on Moonbase Alpha

![Total Supply](/images/builders/tools/precompiles/erc20/erc20-6.png)

The response for each call will be displayed under the corresponding function. 

### Get Account Balance {: #get-account-balance } 

You can check the balance of any address on Moonbase Alpha by calling the `balanceOf` function and passing in an address:

1. Expand the **`balanceOf`** function
2. Enter an address you would like to check the balance of for the **owner**
2. Click **call**

![Get Balance of an Account](/images/builders/tools/precompiles/erc20/erc20-7.png)

Your balance will be displayed under the `balanceOf` function.

### Approve a Spend {: #approve-a-spend } 

To approve a spend, you'll need to provide an address for the spender and the number of tokens  that the spender is allowed to spend. The spender can be an externally owned account or a smart contract. For this example, you can approve the spender to spend 1 DEV token. To get started, please follow these steps:

1. Expand the **`approve`** function
2. Enter the address of the spender. You should have created two accounts before starting, so you can use the second account as the spender
3. Enter the amount of tokens the spender can spend for the **value**. For this example, you can allow the spender to spend 1 DEV token in Wei units (`1000000000000000000`) 
4. Click **transact**
5. MetaMask will pop up, and you will be prompted to review the transaction details. Click **View full transaction details** to review the amount to be sent and the address of the spender
6. If everything looks ok, you can click **Confirm** to send the transaction

![Confirm Approve Transaction](/images/builders/tools/precompiles/erc20/erc20-8.png)

After the transaction has successfully gone through, you'll notice that the balance of your account hasn't changed. This is because you have only approved the spend for the given amount, and the spender hasn't spent the funds. In the next section, you will use the `allowance` function to verify that the spender is able to spend 1 DEV token on your behalf.

### Get Allowance of Spender {: #get-allowance-of-spender } 

To check that the spender received the allowance approved in the [Approve a Spend](#approve-a-spend) section, you can:

1. Expand the **`allowance`** function
2. Enter your address for the **owner**
3. Enter the address of the **spender** that you used in the previous section
4. Click **call**

![Get Allowance of Spender](/images/builders/tools/precompiles/erc20/erc20-9.png)

Once the call is complete, the allowance of the spender will be displayed, which should be equivalent to 1 DEV token (`1000000000000000000`).

### Send Transfer {: #send-transfer }

To do a standard transfer and send tokens from your account directly to another account, you can call the `transfer` function by following these steps:

1. Expand the **`transfer`** function
2. Enter the address to send DEV tokens to. You should have created two accounts before starting, so you can use the second account as the recipient
3. Enter the amount of DEV tokens to send. For this example, you can send 1 DEV token (`1000000000000000000`)
4. Click **transact**
5. MetaMask will pop up, you can review the transaction details, and if everything looks good, click **Confirm**

![Send Standard Transfer](/images/builders/tools/precompiles/erc20/erc20-10.png)

Once the transaction is complete, you can [check your balance](#get-account-balance) using the `balanceOf` function or by looking at MetaMask, and notice that this time your balance decreased by 1 DEV token. You can also use the `balanceOf` function to ensure that the recipients balance has increased by 1 DEV token as expected.

### Send TransferFrom {: #send-transferfrom }

So far, you should have approved an allowance of 1 DEV token for the spender and sent 1 DEV token via the standard `transfer` function. The `transferFrom` function varies from the standard `transfer` function as it allows you to define the address to which you want to send the tokens. So you can specify an address that has an allowance or your address as long as you have funds. For this example, you will use the spender's account to initiate a transfer of the allowed funds from the owner to the spender. The spender can send the funds to any account, but you can send the funds from the owner to the spender for this example.

First, you need to switch to the spender's account in MetaMask. Once you switch to the spender's account, you'll notice that the selected address in Remix under the **Accounts** tab is now the spender's.

![Switch accounts Remix](/images/builders/tools/precompiles/erc20/erc20-11.png)

Next, you can initiate and send the transfer, to do so:

1. Expand the **`transferFrom`** function
2. Enter your address as the owner in the **from** field
3. Enter the recipient address, which should be the spender's address, in the **to** field
4. Enter the amount of DEV tokens to send. Again, the spender is currently only allowed to send 1 DEV token, so enter `1000000000000000000`
5. Click **transact**

![Send Standard Transfer](/images/builders/tools/precompiles/erc20/erc20-12.png)

Once the transaction is complete, you can [check the balance](#get-account-balance) of the owner and spender using the `balanceOf` function. The spender's balance should have increased by 1 DEV token, and their allowance should now be depleted. To verify that the spender no longer has an allowance, you can call the `allowance` function, passing in the owner and spender's addresses. You should receive a result of 0.

![Zero Allowance](/images/builders/tools/precompiles/erc20/erc20-13.png)

And that's it! You've successfully interacted with the ERC-20 precompile using MetaMask and Remix!