---
title:  Batch Precompile
description:  Learn how to send multiple transactions in one with Moonbeam's precompiled batch contract.
keywords: solidity, ethereum, batch, transaction, moonbeam, precompiled, contracts
---

#  Batch Precompile

![Precomiled Contracts Banner](/images/builders/build/canonical-contracts/precompiles/erc20/erc20-banner.png)

## Introduction {: #introduction } 

The batch precompiled contract on Moonbeam allows developers to combine multiple EVM calls into one.

Developers can enhance user experience with batched transactions as it minimizes the number of transactions a user is required to confirm. Additionally, gas fees can be reduced since batching avoids multiple base gas fees (the initial 21000 uints of gas spent to begin a transaction).

The precompile interacts directly with Substrate's EVM pallet. Every call provided to one of its functions will act as if it is a [delegate call](https://docs.soliditylang.org/en/v0.8.15/introduction-to-smart-contracts.html#delegatecall-callcode-and-libraries){target=_blank}.

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

## The Batch Solidity Interface {: #the-batch-interface }

[Batch.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/batch/Batch.sol){target=_blank} is a Solidity interface that allows developers to interact with the precompile's three methods.

--8<-- 'text/batch/batch-interface.md'

## Checking Prerequisites {: #checking-prerequisites } 

To follow along with this tutorial, you will need to have:

- [MetaMask installed and connected to Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
- Create or have two accounts on Moonbase Alpha to test out the different features in the batch precompile
- At least one of the accounts will need to be funded with `DEV` tokens.
 --8<-- 'text/faucet/faucet-list-item.md'

## Interact with the Precompile Using Remix {: #interact-with-the-precompile-using-remix } 

You can interact with the batch precompile using [Remix](https://remix.ethereum.org/){target=_blank}. To add the precompile to Remix and follow along with the tutorial, you will need to:

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

The **SimpleMessage** contract will appear in the list of **Deployed Contracts**.

### Send Native Currency via Precompile {: #send-native-currency-via-precompile }

Sending native currency with the batch precompile is more involved than pressing a few buttons in Remix or Metamask. 

Transactions have a value field to specify the amount of native currency being sent with it. In Remix, this is represented by the **VALUE** input in the **DEPLOY & RUN TRANSACTIONS** tab. However, for the batch precompile, this data is provided within the *value* array input of the batch functions.

Try transferring native currency to two wallets of your choice via the batch precompile on Moonbase Alpha:

1. Make sure that you have at least 0.5 DEV in your connected wallet
2. Expand the Batch contract under **Deployed Contracts**
3. Expand the **batchAll** function
4. For the *to* input, insert your addresses in the following format: `["0xADDRESS1", "0xADDRESS2"]`, where 0xADDRESS1 is the address of the first wallet of your choice and 0xADDRESS2 is the address of the second wallet of your choice
5. For the value input, insert the amount you wish to transfer in wei for each address. For example, `["100000000000000000", "200000000000000000"]` will transfer 0.1 DEV to 0xADDRESS1 and 0.2 DEV to 0xADDRESS2
6. For both of the remaining *call_data* and *gas_limit* inputs, insert `[]`. Call data and gas limit are not a concern for transferring native currency
7. Press **transact**
8. Press **Confirm** in the Metamask extension to confirm the transaction

![Send Batch Transfer](/images/builders/build/canonical-contracts/precompiles/batch/batch-4.png)

Once the transaction is complete, be sure to check both of the accounts' balances, either in Metamask or in a [block explorer](/builders/get-started/explorers/){target=_blank}. Congratulations! You've now sent a batched transfer via the Batch precompile.

!!! note
     Typically if you wanted to send the native currency to or through a contract, you would have to set the value within the overall transaction and interact with a payable function. However, since the Batch precompile interacts directly with Substrate code, this is not necessary.


### Finding a Contract Interaction's Call Data {: #finding-a-contract-interactions-call-data } 

Visual interfaces like Remix and handy libraries like ethers.js hide the way that ethereum transactions interact with solidity smart contracts. The name and input types of a function are hashed into a [function selector](https://docs.soliditylang.org/en/latest/abi-spec.html#function-selector-and-argument-encoding){target=_blank} and the input data is encoded. These two pieces are then combined and sent as the transaction's call data. To send a subtransaction within a batch transaction, the sender to know its call data beforehand. 

Try finding a transaction's call data using Remix:

1. Expand the SimpleMessage contract under **Deployed Contracts**
2. Expand the **`setMessage`** function
3. Enter a number and a message of your choice for **id** & **message**. In this example, **id** will be 1 and **message** will be "moonbeam"
4. Instead of sending the transaction, click the copy button next to the **transact** button to copy the call data

![Transaction Call Data](/images/builders/build/canonical-contracts/precompiles/batch/batch-5.png)

Now you have the transaction's call data! Considering the example values of 1 and "moonbeam", we can keep an eye out for their encoded values in the call data:

 --8<-- 'text/batch/simple-message-call-data.md'

The calldata can be broken into 5 lines, where the first line is the function selector and the next four are the input data. 

Note that the second line is equal to 1, which is the **id** that was provided. 

What's left has to do with the **message** input. These last three lines are tricky, since strings are a [dynamic type](https://docs.soliditylang.org/en/v0.8.15/abi-spec.html#use-of-dynamic-types){target=_blank} with its own format. For sake of simplicity, understand that the third line refers to an offset, the fourth line refers to the string's length, and the fifth line is "moonbeam" in hexadecimal format with zeros for padding.

### Function Interaction via Precompile {: #function-interaction-via-precompile }

Interacting with a function is very similar to [sending a native currency](#send-native-currency-via-precompile), since they are both transactions. However, call data is required to properly provide input to functions and a sender may desire to limit the amount of gas spent in each subtransaction. 

The *call_data* and *gas_limit* transactions more relevant for subtransactions that interact with contracts. For each function in the Batch interface, the *call_data* input is an array that corresponds to the call data for each subtransaction. If its length is less than the *to* input, the remaining subtransactions will have no call data. The *gas_limit* input is an array that corresponds to the amount of gas that each can spend for each subtransaction. If its length is less than the *to* input, the remaining transactions will have all of the batch transaction's remaining gas forwarded.

Try using the precompile to send a transaction:

1. Copy the SimpleMessage contract's address with the copy button on the right side of its header. Be sure to also have the [call data from the previous section](#finding-a-contract-interactions-call-data) 
2. Expand the Batch contract under **Deployed Contracts**
3. Expand the **batchAll** function
4. For the *to* input, insert your addresses in the following format: `["0xSIMPLEMESSAGEADDRESS"]`, where 0xSIMPLEMESSAGEADDRESS is the address of the SimpleMessage contract that you previously copied
5. For the value input, since SimpleMessage does not require any native currency to be paid to it, insert `["0"]` for 0 Wei
6. For the *call_data* input, insert your call data in the following format: `["CALL_DATA"]`, where CALL_DATA is the call data that you found in the previous section
7. For the *gas_limit* input, insert `[]`. You can put in a gas limit value, but it is optional 
8. Press **transact**
9. Press **Confirm** in the Metamask extension to confirm the transaction

![Batch Function Interaction](/images/builders/build/canonical-contracts/precompiles/batch/batch-6.png)

If you used the same call data as the tutorial, let's check to make sure that an actual change has been made:

1. Expand the SimpleMessage contract under **Deployed Contracts**
2. To the right of the **`messages`** button, insert `1`
3. Press the blue **messages** button

![SimpleMessage Confirmation](/images/builders/build/canonical-contracts/precompiles/batch/batch-7.png)

The phrase "moonbeam" should appear underneath it. Congratulations! You have interacted with a function with the Batch precompile. 

### Combining Subtransactions {: combining-subtransactions }

So far, transferring native currency and interacting with functions have been separate, but they can be intertwined. 

The following four strings can be combined as inputs for a batch transaction. They will transact 1 DEV to the public Gerald (`0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b`) account,  and interact with a predeployed SimpleMessage contract twice. Let's break it down:

There are 3 subtransactions, so there are 3 addresses in the *to* input array. The first is the public Gerald account, the next two are a predeployed SimpleMessage contract. You can replace the last two with your own instance of SimpleMessage if you wish. Or, replace only one: you can interact with multiple contracts in a single message.

```
["0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b", "0xd14b70a55F6cBAc06d4FA49b99be0370D0e1BD39", "0xd14b70a55F6cBAc06d4FA49b99be0370D0e1BD39"]
``` 

There will also be 3 values for the *value* array. The first address in the *to* input array has to do with sending 1 DEV, so 1 DEV in Wei is within the array. The following two values are 0 because the function that their subtransactions are interacting with do not accept or require native currency.  

```
["1000000000000000000", "0", "0"]
```

We will need 3 values for the *call_data* array. Since transferring native currency does not require call data, the string is simply blank. The second and third values in the array correspond to invokations of **setMessage** that set messages to ids 5 and 6.

```
["", "0x648345c8000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000009796f752061726520610000000000000000000000000000000000000000000000", "0x648345c800000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000e61206d6f6f6e6265616d2070726f000000000000000000000000000000000000"]
```

The final input is for *gas_input*. This array will be left empty to forward all remaining gas to each subtransaction.

```
[]
```

Try sending a batched transaction with these inputs in Remix the same way [you did before](#function-interaction-via-precompile).

And that's it! You've successfully interacted with the ERC-20 precompile using MetaMask and Remix!

## Finding Call Data with Ethers.js {: #finding-call-data-with-ethers }

If you have only followed the [Ethers.js tutorial](/builders/build/eth-api/libraries/ethersjs/) on Moonbeam, you may find it difficult to find the call data for a function. The answer is hidden within Ether's `utils.Interface` object, where the [encodeFunctionData](https://docs.ethers.io/v5/api/utils/abi/interface/#Interface--encoding){target=_blank} function allows you to input your function name and inputs to receive the resultant call data.

 --8<-- 'code/batch/ethers-batch.md'

Afterwards, you should be all set to interact with the batch precompile as one typically would with a contract in Ethers.