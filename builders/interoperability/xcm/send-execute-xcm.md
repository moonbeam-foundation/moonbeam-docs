---
title: Send & Execute XCM Messages 
description: Learn how to build a custom XCM message, by combining and experimenting with different XCM instructions, and execute it locally on Moonbeam to see the results.
---

# Send and Execute XCM Messages

![Custom XCM Messages Banner](/images/builders/interoperability/xcm/send-execute-xcm/send-execute-xcm-banner.png)

## Introduction {: #introduction } 

XCM messages are comprised of a [series of instructions](/builders/interoperability/xcm/overview/#xcm-instructions){target=_blank} that are executed by the Cross-Consensus Virtual Machine (XCVM). Combinations of these instructions result in predetermined actions such as cross-chain token transfers. You can create your own custom XCM messages by combining various XCM instructions.

Pallets such as [**X-Tokens**](/builders/interoperability/xcm/xc20/xtokens){target=_blank} and [**XCM Transactor**](/builders/interoperability/xcm/xcm-transactor/){target=_blank} provide functions with a predefined set of XCM instructions to either send [XC-20s](/builders/interoperability/xcm/xc20/overview/){target=_blank} or remotely execute on other chains via XCM. However, to get a better understanding of the results from combining different XCM instructions, you can build and execute custom XCM messages locally on Moonbeam. You can also send custom XCM messages to another chain (which will start with the [`DecendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} instruction). Nevertheless, for the XCM message to be successfully executed, the target chain needs to be able to understand the instructions.

To execute or send a custom XCM message, you can either use the [Polkadot XCM Pallet](#polkadot-xcm-pallet-interface) directly, or you can try it out through the Ethereum API with the [XCM Utilities Precompile](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}. In this guide, you'll learn how to use both methods to execute and send customly built XCM messages locally on Moonbase Alpha.

This guide assumes that you are familiar with general XCM concepts, such as [general XCM terminology](/builders/interoperability/xcm/overview/#general-xcm-definitions){target=_blank} and [XCM instructions](/builders/interoperability/xcm/overview/#xcm-instructions){target=_blank}. For more information, you can check out the [XCM Overview](/builders/interoperability/xcm/overview){target=_blank} documentation.

## Polkadot XCM Pallet Interface {: #polkadot-xcm-pallet-interface }

### Extrinsics {: #extrinsics }

The Polkadot XCM Pallet includes the following relevant extrinsics (functions):

 - **execute**(message, maxWeight) — **supported on Moonbase Alpha only** - executes a custom XCM message given the SCALE encoded XCM versioned XCM message to be executed and the maximum weight to be consumed
 - **send**(dest, message) - **supported on Moonbase Alpha only** - sends a custom XCM message given the multilocation of the destination chain to send the message to and the SCALE encoded XCM versioned XCM message to be sent. For the XCM message to be successfully executed, the target chain needs to be able to understand the instructions in the message

### Storage Methods {: #storage-methods }

The Polkadot XCM Pallet includes the following relevant read-only storage methods:

- **assetTraps**(Option<H256>) - returns the existing number of times an asset has been trapped given the Blake2-256 hash of the `MultiAssets` pair. If the hash is omitted, all asset traps are returned
- **palletVersion**() - provides the version of the Polkadot XCM Pallet being used

## Checking Prerequisites {: #checking-prerequisites }

To follow along with this guide, you will need the following:

- Your account must be funded with DEV tokens.
  --8<-- 'text/faucet/faucet-list-item.md'
- If following the instructions on using Polkadot.js Apps, you'll need an [account loaded into the Polkadot.js Apps interface](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/accounts){target=_blank}

## Execute an XCM Message Locally {: #execute-an-xcm-message-locally }

This section of the guide covers the process of building a custom XCM message to be executed locally (i.e., in Moonbeam) via two different methods: the `execute` function of the Polkadot XCM Pallet and the `xcmExecute` function of the [XCM Utilities Precompile](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}. This functionality provides a playground for you to experiment with different XCM instructions and see firsthand the results of these experiments. This also comes in handy to determine the [fees](/builders/interoperability/xcm/fees){target=_blank} associated with a given XCM message on Moonbeam.

In the following example, you'll transfer DEV tokens from one account to another on Moonbase Alpha. To do so, you'll be building an XCM message that contains the following XCM instructions, which are executed locally (in this case, on Moonbase Alpha):

 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - removes assets and places them into the holding register
 - [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} - removes the assets from the holding register and deposits the equivalent assets to a beneficiary account

!!! note
    Typically, when you send an XCM message cross-chain to a target chain, the [`BuyExecution` instruction](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} is needed to pay for remote execution. However, for local execution, this instruction is not necessary as you are already getting charged via the extrinsic call . 

### Execute an XCM Message with Polkadot.js Apps {: #execute-an-xcm-message-with-polkadotjs-apps }

In this example, you'll execute a custom XCM message locally on Moonbase Alpha using Polkadot.js Apps to interact directly with the Polkadot XCM Pallet. 

To get started, you can head to the [**Extrinsics** page of Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=_blank} and take the following steps:

1. Select the account from which you want to send the XCM. In this example, Alice will be the sender
2. Choose the **polkadotXcm** pallet and select the **execute** extrinsic
3. Set the version of the message to **V2**
4. Click the **Add item** button two times for each of the instructions to be added: **WithdrawAsset** and **DepositAsset**
5. Set the first instruction as **WithdrawAsset**. Click the **Add item** button below the instruction name and enter the multilocation of the asset, asset type, and amount to withdraw. Since this example covers how to send DEV tokens from one account to another on Moonbase Alpha, the **WithdrawAsset** instruction will define the amount of DEV tokens on Moonbase Alpha to withdraw. You can use the following values, which will withdraw 0.1 DEV tokens:

    |   Parameter    |       Value        |
    |:--------------:|:------------------:|
    |       ID       |      Concrete      |
    |    Parents     |         0          |
    |    Interior    |         X1         |
    |       X1       |   PalletInstance   |
    | PalletInstance |         3          |
    |      Fun       |      Fungible      |
    |    Fungible    | 100000000000000000 |

6. Set the second instruction to be the **DepositAsset** instruction and enter the following values to deposit DEV tokens to a beneficiary account on Moonbase Alpha, which in this example will be Bob:

    | Parameter |       Value        |
    |:---------:|:------------------:|
    |  Assets   |        Wild        |
    |   Wild    |        All         |
    | MaxAssets |         1          |
    |  Parents  |         0          |
    | Interior  |         X1         |
    |    X1     |    AccountKey20    |
    |  Network  |        Any         |
    |    Key    | Bob's H160 Address |

    The configuration fo **Assets = Wild**, **Wild = All** and **MaxAssets = 1** will take only one asset from the holding registry and deposit it to the defined account.

7. Set the **maxWeight**, which defines the maximum weight units allowed for the XCM execution. For this example, you can enter `1000000000`. Any excess fees will be returned to you
8. Click **Submit Transaction** and sign the transaction

!!! note
    The encoded calldata for the extrinsic configured above is `0x1c03020800040000010403001300008a5d784563010d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e000ca9a3b00000000`.

![Call the execute function of the Polkadot XCM Pallet via Polkadot.js Apps.](/images/builders/interoperability/xcm/send-execute-xcm/send-execute-xcm-1.png)

Once the transaction is processed, the 0.1 DEV tokens should be withdrawn from Alice's account along with the associated XCM fees, and Bob should have received 0.1 DEV tokens in his account. A `polkadotXcm.Attempted` event will be emitted with the outcome.

![Review the transaction details using Polkadot.js Apps.](/images/builders/interoperability/xcm/send-execute-xcm/send-execute-xcm-2.png)

### Execute an XCM Message with the XCM Utilities Precompile {: #execute-xcm-utils-precompile }

In this section, you'll use the `xcmExecute` function of the [XCM Utilities Precompile](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}, which is only supported on Moonbase Alpha, to execute an XCM message locally. The XCM Utilities Precompile is located at the following address:

```
{{ networks.moonbase.precompiles.xcm_utils }}
```

Under the hood, the `xcmExecute` function of the XCM Utilities Precompile calls the `execute` function of the Polkadot XCM Pallet, which is a Substrate pallet that is coded in Rust. The benefit of using the XCM Utilities Precompile to call `xcmExecute` is that you can do so via the Ethereum API and use Ethereum libraries like [Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}.

The `xcmExecute` function accepts two parameters: the SCALE encoded versioned XCM message to be executed and the maximum weight to be consumed. 

To execute the XCM message locally, you'll take the following steps:

1. Build the SCALE encoded calldata. You can grab the encoded calldata from the [previous section](#execute-an-xcm-message-with-polkadotjs-apps), or you can calculate the same calldata programmatically with the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank} 
2. Send the XCM message with the encoded calldata using the Ethereum library and the XCM Utilities Precompile

To get the SCALE encoded calldata programmatically, you can use the following script:

```js
--8<-- 'code/polkadotXcm/xcmExecute/encodedCalldata.js'
```

To summarize, the steps you're taking are as follows: 

1. Provide the input data for the call. This includes:
    - The Moonbase Alpha endpoint URL to create the provider
    - The multilocation of the DEV token as seen by Moonbase Alpha
    - Amount of tokens (in Wei) to withdraw from your account. For this example, 0.1 tokens are more than enough. To understand how to get this value, please refer to the XCM fee page
    - The maximum weight parameter for the `xcmExecute` function
    - The address where the DEV tokens will be transferred to, which in this case is Bob's address
2. Build the first XCM instruction, `WithdrawAsset`. You need to provide the asset multilocation and the amount you want to withdraw. Both variables were already described before
3. Build the second XCM instruction, `DepositAsset`. Whatever is left in holding after the actions executed before (in this case, it should be only DEV tokens) is deposited to Bob's address, which is set as the beneficiary. The asset to be deposited is set with the values of **Assets = Wild**, **Wild = All** and **MaxAssets = 1**
5. Put the XCM message together by concatenating the instructions inside a V2 array
6. Create the Polkadot.js API provider
7. Craft the `polkadotXcm.execute` extrinsic with the XCM message and the maximum weight
8. Get the SCALE encoded calldata

You can use `node` to run the script and the result will be logged to the console. The result should match the encoded calldata from the [previous section](#execute-an-xcm-message-with-polkadotjs-apps): 

```
0x1c03020800040000010403001300008a5d784563010d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e000ca9a3b00000000
```

Before you can use the encoded calldata, you'll need to remove some of the hexadecimal characters that do not correspond to the XCM message, such as the call index for the `polkadotXcm.execute` function, which will be the first 4 characters, and the maximum weight, which will be the last 16 characters:

```
call index:  1c03
XCM message: 020800040000010403001300008a5d784563010d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e0
max weight:  00ca9a3b00000000
```

So, for this example, the encoded calldata for the XCM message alone is: 

```
0x020800040000010403001300008a5d784563010d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e0
```

Now that you have the SCALE encoded XCM message, you can use the following code snippets to programmatically call the `xcmExecute` function of the XCM Utilities Precompile using your Ethereum library of choice:

!!! remember
    The following snippets are for demo purposes only. Never store your private keys in a JavaScript or Python file.

=== "Ethers.js"
    ```js
    --8<-- 'code/polkadotXcm/xcmExecute/ethers.js'
    ```

=== "Web3.js"
    ```js
    --8<-- 'code/polkadotXcm/xcmExecute/web3.js'
    ```

=== "Web3.py"
    ```py
    --8<-- 'code/polkadotXcm/xcmExecute/web3.py'
    ```

And that's it! You've successfully used the Polkadot XCM Pallet and the XCM Utilities Precompile to execute a custom XCM message locally on Moonbase Alpha!

## Send an XCM Message Cross-Chain {: #send-xcm-message }

This section of the guide covers the process of sending a custom XCM message cross-chain (i.e., from Moonbeam to a target chain, such as the relay chain) via two different methods: the `send` function of the Polkadot XCM Pallet and the `xcmSend` function of the [XCM Utilities Precompile](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}. 

For the XCM message to be successfully executed, the target chain needs to be able to understand the instructions in the message. On the contrary, you'll see a `Barrier` filter on the destination chain. For security reasons, the XCM message is prepended with the [`DecendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} instruction to prevent XCM execution on behalf of the origin chain sovereign account. 

In the following example, you'll be building an XCM message that contains the following XCM instructions, which will be executed in the Alphanet relay chain:

 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - removes assets and places them into the holding register
 - [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - takes the assets from holding to pay for execution fees. The fees to pay are determined by the target chain
 - [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} - removes the assets from the holding register and deposits the equivalent assets to a beneficiary account

Together, the intention of these instructions is to transfer the native asset of the relay chain, which is UNIT for the Alphanet relay chain, from Moonbase Alpha to an account on the relay chain. This example is for demonstration purposes only to show you how a custom XCM message could be sent cross-chain. Please keep in mind that the target chain needs to be able to understand the instructions in the message to execute them.

### Send an XCM Message with Polkadot.js Apps {: #send-xcm-message-with-polkadotjs-apps }

In this example, you'll send a custom XCM message from your account on Moonbase Alpha to the relay chain using Polkadot.js Apps to interact directly with the Polkadot XCM Pallet. 

To get started, you can head to the [**Extrinsics** page of Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=_blank} and take the following steps:

1. Select the account from which you want to send the XCM. In this example, Alice will be the sender
2. Choose the **polkadotXcm** pallet and select the **send** extrinsic
3. Set the version of the destination's multilocation to **V1**
4. Enter the multilocation. For this example, the relay chain token can be defined as:

    | Parameter | Value |
    |:---------:|:-----:|
    |  Parents  |   1   |
    | Interior  | Here  |

5. Set the version of the message to **V2**
6. Click the **Add item** button three times for each of the instructions to be added: **WithdrawAsset**, **BuyExecution**, and **DepositAsset**
7. Set the first instruction as **WithdrawAsset**. Click the **Add item** button below the instruction name and enter the multilocation, asset type, and amount to withdraw. For this example, you can use the following values, which will withdraw 1 UNIT token:

    | Parameter |     Value     |
    |:---------:|:-------------:|
    |    ID     |   Concrete    |
    |  Parents  |       1       |
    | Interior  |     Here      |
    |    Fun    |   Fungible    |
    | Fungible  | 1000000000000 |

8. Set the second instruction to be the **BuyExecution** instruction, and again click the **Add item** button below the instruction name and enter the following values to buy execution:

    |  Parameter  |     Value     |
    |:-----------:|:-------------:|
    |     ID      |   Concrete    |
    |   Parents   |       1       |
    |  Interior   |     Here      |
    |     Fun     |   Fungible    |
    |  Fungible   | 1000000000000 |
    | WeightLimit |   Unlimited   |

9. Set the third instruction to be the **DepositAsset** instruction and enter the following values to deposit the UNIT tokens to a beneficiary account on the relay chain, which in this example will be Bob's relay chain address:

    | Parameter |         Value         |
    |:---------:|:---------------------:|
    |  Assets   |         Wild          |
    |   Wild    |          All          |
    | MaxAssets |           1           |
    |  Parents  |           1           |
    | Interior  |          X1           |
    |    X1     |     AccountKey32      |
    |  Network  |          Any          |
    |    ID     | Bob's 32-byte Address |

    The configuration fo **Assets = Wild**, **Wild = All** and **MaxAssets = 1** will take only one asset from the holding registry and deposit it to the defined account.

10. Click **Submit Transaction** and sign the transaction

!!! note
    The encoded calldata for the extrinsic configured above is `0x1c00010100020c000400010000070010a5d4e81300010000070010a5d4e8000d010004010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d67`.

![Call the send function of the Polkadot XCM Pallet via Polkadot.js Apps.](/images/builders/interoperability/xcm/send-execute-xcm/send-execute-xcm-3.png)

Once the transaction is processed, a `polkadotXcm.sent` event is emitted with the details of the sent XCM message.

![Review the transaction details using Polkadot.js Apps.](/images/builders/interoperability/xcm/send-execute-xcm/send-execute-xcm-4.png)

### Send an XCM Message with the XCM Utilities Precompile {: #send-xcm-utils-precompile }

In this section, you'll use the `xcmSend` function of the [XCM Utilities Precompile](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}, which is only supported on Moonbase Alpha, to send an XCM message cross-chain. The XCM Utilities Precompile is located at the following address:

```
{{ networks.moonbase.precompiles.xcm_utils }}
```

Under the hood, the `xcmSend` function of the XCM Utilities Precompile calls the `send` function of the Polkadot XCM Pallet, which is a Substrate pallet that is coded in Rust. The benefit of using the XCM Utilities Precompile to call `xcmSend` is that you can do so via the Ethereum API and use Ethereum libraries like [Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}. For the XCM message to be successfully executed, the target chain needs to be able to understand the instructions in the message.

The `xcmSend` function accepts two parameters: the multilocation of the destination and the SCALE encoded versioned XCM message to be sent.

To send the XCM message locally, you'll take the following steps:

1. Build the multilocation of the destination 
2. Build the SCALE encoded calldata. You can grab the encoded calldata from the [previous section](#send-xcm-message-with-polkadotjs-apps), or you can calculate the same calldata programmatically with the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank} 
3. Send the XCM message, with the destination multilocation and encoded calldata, using the Ethereum library and the XCM Utilities Precompile

The multilocation of the destination, which is the relay chain in this example, is as follows:

```js
const dest = [
  1, // Parents: 1 
  [] // Interior: Here
];
```

This will be used after the encoded calldata is calculated.

Next, you can grab the encoded calldata from the [previous section](#send-xcm-message-with-polkadotjs-apps). However, if you do this, you'll need to look at the encoding details and manually remove the hexadecimal characters that correspond to the destination multilocation, which will vary depending on the destination.

For a more foolproof way to get the encoded calldata, you can programmatically obtain it via the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank} and the `polkadotXcm.execute` function. You'll still need to manipulate the calldata, but this will be easier as you can do the same manipulation every time regardless of the destination.

To build the SCALE encoded calldata programmatically, you can use the following snippet:

```js
--8<-- 'code/polkadotXcm/xcmSend/encodedCalldata.js'
```

To summarize, the steps you're taking are as follows: 

1. Provide the input data for the call. This includes:
    - The Moonbase Alpha endpoint URL to create the provider
    - The multilocation of the relay chain and destination
    - Amount of tokens (in Wei) to withdraw from your account. For this example, 1 token is more than enough. To understand how to get this value, please refer to the XCM fee page
    - The address where the UNIT tokens will be transferred to, which in this case is Bob's address on the relay chain
2. Build the first XCM instruction, `WithdrawAsset`. You need to provide the asset multilocation and the amount you want to withdraw. Both variables were already described before
3. Build the second XCM instruction, `BuyExecution`. You need to provide the asset multilocation, the amount we took out with the previous instruction, and the weight limit
4. Build the third XCM instruction, `DepositAsset`. Whatever is left in holding after the actions executed before is deposited to the beneficiary, which is Bob's address on the relay chain. The asset to be deposited is set with the values of **Assets = Wild**, **Wild = All** and **MaxAssets = 1**
5. Put the XCM message together by concatenating the instructions inside a V2 array
6. Create the Polkadot.js API provider
7. Craft the `polkadotXcm.execute` extrinsic with the XCM message and the max weight; since the max weight is not needed, you can set it to `'0'`
8. Get the SCALE encoded calldata

You can use `node` to run the script and the result will be logged to the console. The result should be slightly different than the encoded calldata from the previous step: 

```
0x1c03020c000400010000070010a5d4e81300010000070010a5d4e8000d010004010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d670000000000000000
```

Before you can use the encoded calldata, you'll need to remove some of the hexadecimal characters that do not correspond to the XCM message, such as the call index for the `polkadotXcm.execute` function, which will be the first 4 characters, and the maximum weight, which will be the last 16 characters:

```
call index:  1c03
XCM message: 020800040000010403001300008a5d784563010d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e0
max weight:  0000000000000000
```

So, for this example, the encoded calldata for the XCM message alone is: 

```
0x020c000400010000070010a5d4e81300010000070010a5d4e8000d010004010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d67
```

Now that you have the multilocation of the destination and the SCALE encoded XCM message, you can use the following code snippets to programmatically call the `xcmSend` function of the XCM Utilities Precompile using your Ethereum library of choice:

!!! remember
    The following snippets are for demo purposes only. Never store your private keys in a JavaScript or Python file.

=== "Ethers.js"
    ```js
    --8<-- 'code/polkadotXcm/xcmSend/ethers.js'
    ```

=== "Web3.js"
    ```js
    --8<-- 'code/polkadotXcm/xcmSend/web3.js'
    ```

=== "Web3.py"
    ```py
    --8<-- 'code/polkadotXcm/xcmSend/web3.py'
    ```

And that's it! You've successfully used the Polkadot XCM Pallet and the XCM Utilities Precompile to send a message from Moonbase Alpha to another chain! 