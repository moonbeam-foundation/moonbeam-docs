---
title:  Batch Precompile
description:  Learn how to send multiple transactions in one with Moonbeam's precompiled batch contract.
keywords: solidity, ethereum, batch, transaction, moonbeam, precompiled, contracts
---

#  Batch Precompile

![Precomiled Contracts Banner](/images/builders/build/canonical-contracts/precompiles/erc20/erc20-banner.png)

## Introduction {: #introduction } 

The batch precompiled contract on Moonbeam allows developers to combine multiple calls into one.

An application that requires multiple transactions can enhance its user experience by batching its transactions into one. Additionally, gas fees can be reduced by avoiding the initiation of multiple transactions.

The precompile interacts directly with substrate's evm pallet. Every call provided to one of its functions will act as if it is a [delegate call](https://github.com/PureStake/moonbeam/blob/master/precompiles/batch/Batch.sol).

The precompile is located at the following address:

=== "Moonbeam"
     ```
     {{networks.moonbeam.precompiles.batch }}
     ```

=== "Moonriver"
     ```
     {{networks.moonriver.precompiles.batch }}
     ```

=== "Moonbase Alpha"
     ```
     {{networks.moonriver.precompiles.batch }}
     ```

## The Batch Interface {: #the-batch-interface }

[Batch.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/batch/Batch.sol){target=_blank} is an interface that allows developers to interact with the precompile's three methods.

--8<-- 'text/batch/batch-interface.md'

## Checking Prerequisites {: #checking-prerequisites } 

To follow along with this tutorial, you will need to have:

- [MetaMask installed and connected to Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
- Create or have an account on Moonbase Alpha to test out the different features in the batch precompile
- At least one of the accounts will need to be funded with `DEV` tokens.
 --8<-- 'text/faucet/faucet-list-item.md'

## Interact with the Precompile Using Remix {: #interact-with-the-precompile-using-remix } 

You can interact with the batch precompile using [Remix](https://remix.ethereum.org/). To add the precompile to Remix and follow along with the tutorial, you will need to:

1. Get a copy of [Batch.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/batch/Batch.sol){target=_blank}
2. Paste the file contents into a Remix file named **IERC20.sol**
3. Get a copy of [SimpleMessage.sol](#simple-message)
4. Paste the file contents into a Remix file named **SimpleMessage.sol**

### SimpleMessage.sol {: #simple-message}

The contract `SimpleMessage.sol` will be used as an example of batching contract interactions, but in practice any contract can be interacted with.

 --8<-- 'text/batch/simple-message.md'

### Compile the Contract {: #compile-the-contract } 

Next, you will need to compile both files in Remix:

1. Make sure that you have the **Batch.sol** file open
2. Click on the **Compile** tab, second from top
3. Compile the **Batch.sol** file

![Compiling IERC20.sol](/images/builders/build/canonical-contracts/precompiles/batch/batch-1.png)

If the interface was compiled successfully, you will see a green checkmark next to the **Compile** tab.

### Access the Precompile {: #access-the-precompile } 

Instead of deploying the Batch precompile, you will access the interface given the address of the precompiled contract:

1. Click on the **Deploy and Run** tab directly below the **Compile** tab in Remix. Please note the precompiled contract is already deployed
2. Make sure **Injected Web3** is selected in the **Environment** dropdown. Once you select **Injected Web3**, you might be prompted by MetaMask to connect your account to Remix
3. Make sure the correct account is displayed under **Account**
4. Ensure **Batch - Batch.sol** is selected in the **Contract** dropdown. Since this is a precompiled contract, there is no need to deploy any code. Instead we are going to provide the address of the precompile in the **At Address** Field
5. Provide the address of the Batch precompile: `{{networks.moonbase.precompiles.batch}}` and click **At Address**

![Access the address](/images/builders/build/canonical-contracts/precompiles/batch/batch-2.png)

The **IERC20** precompile will appear in the list of **Deployed Contracts**.

### Deploy SimpleMessage

On the other hand, SimpleMessage.sol will be deployed as a new contract. Before starting this section, repeat the [compilation step](#compile-the-contract) with the **SimpleMessage.sol** file.

1. Click on the **Deploy and Run** tab directly below the **Compile** tab in Remix
2. Make sure **Injected Web3** is selected in the **Environment** dropdown. Once you select **Injected Web3**, you might be prompted by MetaMask to connect your account to Remix
3. Make sure the correct account is displayed under **Account**
4. Ensure **SimpleMessage - SimpleMessage.sol** is selected in the **Contract** dropdown
5. Click **Deploy**
6. Confirm the Metamask transaction that appears by clicking **Confirm**

![Deploy SimpleMessage](/images/builders/build/canonical-contracts/precompiles/batch/batch-3.png)

### Finding a Contract Interaction's Call Data {: #finding-a-contract-interactions-call-data } 

Visual interfaces like Remix and handy libraries like ethers.js hide the way that ethereum transactions interact with solidity smart contracts. The name and input types of a function are hashed into a [function selector](https://docs.soliditylang.org/en/latest/abi-spec.html#function-selector-and-argument-encoding) and the input data is encoded. These two pieces are then combined and sent as the transaction's call data. To send a subtransaction within a batch transaction, the sender to know its call data beforehand. 

Try finding a transaction's call data using remix:

1. Expand the SimpleMessage contract under **Deployed Contracts**
2. Expand the **`setMessage`** function
3. Enter a number and a message of your choice for **id** & **message**. In this example, **id** will be 1 and **message** will be "moonbeam"
4. Instead of sending the transaction, click the copy button next to the **transact** button to copy the call data

![Total Supply](/images/builders/build/canonical-contracts/precompiles/erc20/erc20-6.png)

Now you have the transaction's call data! Considering the example values of 1 and "moonbeam", we can keep an eye out for their encoded values in the call data:

 --8<-- 'text/batch/simple-message-call-data.md'


### Get Account Balance {: #get-account-balance } 

You can check the balance of any address on Moonbase Alpha by calling the `balanceOf` function and passing in an address:

1. Expand the **`balanceOf`** function
2. Enter an address you would like to check the balance of for the **owner**
2. Click **call**

![Get Balance of an Account](/images/builders/build/canonical-contracts/precompiles/erc20/erc20-7.png)

Your balance will be displayed under the `balanceOf` function.

### Approve a Spend {: #approve-a-spend } 

To approve a spend, you'll need to provide an address for the spender and the number of tokens  that the spender is allowed to spend. The spender can be an externally owned account or a smart contract. For this example, you can approve the spender to spend 1 DEV token. To get started, please follow these steps:

1. Expand the **`approve`** function
2. Enter the address of the spender. You should have created two accounts before starting, so you can use the second account as the spender
3. Enter the amount of tokens the spender can spend for the **value**. For this example, you can allow the spender to spend 1 DEV token in Wei units (`1000000000000000000`) 
4. Click **transact**
5. MetaMask will pop up, and you will be prompted to review the transaction details. Click **View full transaction details** to review the amount to be sent and the address of the spender
6. If everything looks ok, you can click **Confirm** to send the transaction

![Confirm Approve Transaction](/images/builders/build/canonical-contracts/precompiles/erc20/erc20-8.png)

After the transaction has successfully gone through, you'll notice that the balance of your account hasn't changed. This is because you have only approved the spend for the given amount, and the spender hasn't spent the funds. In the next section, you will use the `allowance` function to verify that the spender is able to spend 1 DEV token on your behalf.

### Get Allowance of Spender {: #get-allowance-of-spender } 

To check that the spender received the allowance approved in the [Approve a Spend](#approve-a-spend) section, you can:

1. Expand the **`allowance`** function
2. Enter your address for the **owner**
3. Enter the address of the **spender** that you used in the previous section
4. Click **call**

![Get Allowance of Spender](/images/builders/build/canonical-contracts/precompiles/erc20/erc20-9.png)

Once the call is complete, the allowance of the spender will be displayed, which should be equivalent to 1 DEV token (`1000000000000000000`).

### Send Transfer {: #send-transfer }

To do a standard transfer and send tokens from your account directly to another account, you can call the `transfer` function by following these steps:

1. Expand the **`transfer`** function
2. Enter the address to send DEV tokens to. You should have created two accounts before starting, so you can use the second account as the recipient
3. Enter the amount of DEV tokens to send. For this example, you can send 1 DEV token (`1000000000000000000`)
4. Click **transact**
5. MetaMask will pop up, you can review the transaction details, and if everything looks good, click **Confirm**

![Send Standard Transfer](/images/builders/build/canonical-contracts/precompiles/erc20/erc20-10.png)

Once the transaction is complete, you can [check your balance](#get-account-balance) using the `balanceOf` function or by looking at MetaMask, and notice that this time your balance decreased by 1 DEV token. You can also use the `balanceOf` function to ensure that the recipients balance has increased by 1 DEV token as expected.

### Send TransferFrom {: #send-transferfrom }

So far, you should have approved an allowance of 1 DEV token for the spender and sent 1 DEV token via the standard `transfer` function. The `transferFrom` function varies from the standard `transfer` function as it allows you to define the address to which you want to send the tokens. So you can specify an address that has an allowance or your address as long as you have funds. For this example, you will use the spender's account to initiate a transfer of the allowed funds from the owner to the spender. The spender can send the funds to any account, but you can send the funds from the owner to the spender for this example.

First, you need to switch to the spender's account in MetaMask. Once you switch to the spender's account, you'll notice that the selected address in Remix under the **Accounts** tab is now the spender's.

![Switch accounts Remix](/images/builders/build/canonical-contracts/precompiles/erc20/erc20-11.png)

Next, you can initiate and send the transfer, to do so:

1. Expand the **`transferFrom`** function
2. Enter your address as the owner in the **from** field
3. Enter the recipient address, which should be the spender's address, in the **to** field
4. Enter the amount of DEV tokens to send. Again, the spender is currently only allowed to send 1 DEV token, so enter `1000000000000000000`
5. Click **transact**

![Send Standard Transfer](/images/builders/build/canonical-contracts/precompiles/erc20/erc20-12.png)

Once the transaction is complete, you can [check the balance](#get-account-balance) of the owner and spender using the `balanceOf` function. The spender's balance should have increased by 1 DEV token, and their allowance should now be depleted. To verify that the spender no longer has an allowance, you can call the `allowance` function, passing in the owner and spender's addresses. You should receive a result of 0.

![Zero Allowance](/images/builders/build/canonical-contracts/precompiles/erc20/erc20-13.png)

And that's it! You've successfully interacted with the ERC-20 precompile using MetaMask and Remix!