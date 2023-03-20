---
title: Send & Execute XCM Messages 
description: Learn how to build a custom XCM message, by combining and experimenting with different XCM instructions, and execute it locally on Moonbeam to see the results.
---

# Send and Execute XCM Messages

![Custom XCM Messages Banner](/images/builders/interoperability/xcm/custom-xcm-messages/custom-xcm-banner.png)

## Introduction {: #introduction } 

XCM messages are comprised of a [series of instructions](/builders/interoperability/xcm/overview/#xcm-instructions){target=_blank} that are executed by the Cross-Consensus Virtual Machine (XCVM). Combinations of these instructions result in predetermined actions such as cross-chain token transfers. You can create your own custom XCM messages by combining various XCM instructions.

To get a better understanding of the results from combining different XCM instructions, you can build and execute custom XCM messages locally on Moonbeam. You can also send custom XCM messages to another chain; however, for the XCM message to be successfully executed, the target chain needs to be able to understand the instructions.

To execute or send a custom XCM message, you can either use the [Polkadot XCM Pallet](#polkadot-xcm-pallet-interface) directly, or you can try it out through the Ethereum API with the [XCM Utilities Precompile](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}. In this guide, you'll learn how to use both methods to execute a custom XCM message locally on Moonbase Alpha.

This guide assumes that you are familiar with general XCM concepts such as [general XCM terminology](/builders/interoperability/xcm/overview/#general-xcm-definitions){target=_blank} and [XCM instructions](/builders/interoperability/xcm/overview/#xcm-instructions){target=_blank}. For more information, you can check out the [XCM Overview](/builders/interoperability/xcm/overview){target=_blank} documentation.

## Polkadot XCM Pallet Interface {: #polkadot-xcm-pallet-interface }

### Extrinsics {: #extrinsics }

The Polkadot XCM Pallet includes the following relevant extrinsics (functions):

 - **execute**(message, maxWeight) — **supported on Moonbase Alpha only** - executes a custom XCM message given the SCALE encoded XCM versioned XCM message to be executed and the maximum weight to be consumed
 - **send**(dest, message) - **supported on Moonbase Alpha only** - sends a custom XCM message given the multilocation of the destination chain to send the message to and the SCALE encoded XCM versioned XCM message to be sent. For the XCM message to be successfully executed, the target chain needs to be able to understand the instructions in the message

### Storage Methods {: #storage-methods }

The Polkadot XCM Pallet includes the following relevant read-only storage methods:

- **assetTraps**(Option<H256>) - returns the existing number of times an asset has been trapped given the Blake2-256 hash of the `MultiAssets` pair. If the hash is omitted, all asset traps are returned
- **palletVersion**() - provides the version of the Polkadot XCM Pallet being used

## Execute an XCM Message Locally {: #execute-an-xcm-message-locally }

This section of the guide covers the process of building a custom XCM message to be executed locally (i.e., in Moonbeam) via two different methods: the `execute` function of the Polkadot XCM Pallet and the `xcmExecute` function of the [XCM Utilities Precompile](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}. This functionality provides a playground for you to experiment with different XCM instructions and see firsthand the results of these experiments. This also comes in handy to determine the [fees](/builders/interoperability/xcm/fees){target=_blank} associated with a given XCM message on Moonbeam.

In the following example, you'll transfer DEV tokens from one account to another on Moonbase Alpha. To do so, you'll be building an XCM message that contains the following XCM instructions, which are executed locally (in this case, on Moonbase Alpha):

 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - removes assets and places them into the holding register
 - [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} - removes the assets from the holding register and deposits the equivalent assets to a beneficiary account

Typically when you send an XCM message cross-chain to a target chain, the [`BuyExecution` instruction](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} is needed to pay for remote execution. However, for local execution this instruction is not necessary as you are already getting charged when you execute the extrinsic. 

### Checking Prerequisites {: #checking-prerequisites }

To follow along with this guide, you will need the following:

- Your account must be funded with DEV tokens.
  --8<-- 'text/faucet/faucet-list-item.md'
- If following the instructions on how to execute an XCM message with Polkadot.js Apps, you'll need an [account loaded into the Polkadot.js Apps interface](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/accounts){target=_blank}

### Execute an XCM Message with Polkadot.js Apps {: #execute-an-xcm-message-with-polkadotjs-apps }

In this example, you'll execute a custom XCM message locally on Moonbase Alpha using Polkadot.js Apps to interact directly with the Polkadot XCM Pallet. 

To get started, you can head to the [**Extrinsic** page of Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/extrinsics){target=_blank} and take the following steps:

1. Select the account from which you want to send the XCM. In this example, Alice will be the sender
2. Choose the **polkadotXcm** pallet and select the **execute** extrinsic
3. Set the version of the message to **V2**
4. Click the **Add item** button three times for each of the instructions to be added: **WithdrawAsset**, **BuyExecution**, and **DepositAsset**
5. Set the first instruction as **WithdrawAsset**. Click the **Add item** button below the instruction name and enter the multilocation, the asset type, and the amount to withdraw. Since this example covers how to send DEV tokens from one account to another on Moonbase Alpha, the **WithdrawAsset** instruction will define the amount of DEV tokens on Moonbase Alpha to withdraw. You can use the following values, which will withdraw 0.1 DEV tokens:

    |   Parameter    |       Value        |
    |:--------------:|:------------------:|
    |       ID       |      Concrete      |
    |    Parents     |         0          |
    |    Interior    |         X1         |
    |       X1       |   PalletInstance   |
    | PalletInstance |         3          |
    |      Fun       |      Fungible      |
    |    Fungible    | 100000000000000000 |

6. Set the second instruction to be the **BuyExecution** instruction and again click the **Add item** button below the instruction name and enter the following values to buy execution:

    |   Parameter    |       Value        |
    |:--------------:|:------------------:|
    |       ID       |      Concrete      |
    |    Parents     |         0          |
    |    Interior    |         X1         |
    |       X1       |   PalletInstance   |
    | PalletInstance |         3          |
    |      Fun       |      Fungible      |
    |    Fungible    | 100000000000000000 |
    |  WeightLimit   |     Unlimited      |

7. Set the third instruction to be the **DepositAsset** instruction and enter the following values to deposit DEV tokens to a beneficiary account on Moonbase Alpha, which in this example will be Bob:

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

8. Set the **maxWeight**, which defines the maximum weight units allowed for the XCM execution. For this example, you can enter `1000000000`. Any excess fees will be returned to you
9. Click **Submit Transaction** and sign the transaction

!!! note
    The encoded calldata for the extrinsic configured above is `0x1c03020c00040000010403001300008a5d78456301130000010403001300008a5d78456301000d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e000ca9a3b00000000`.

![Call the execute function of the Polkadot XCM Pallet via Polkadot.js Apps.](/images/builders/interoperability/xcm/custom-xcm-messages/custom-xcm-1.png)

Once the transaction is processed, the 0.1 DEV tokens should be withdrawn from Alice's account along with the associated XCM fees, and Bob should have received 0.1 DEV tokens in his account. A `polkadotXcm.Attempted` event will be emitted with the outcome.

![Review the transaction details using Polkadot.js Apps.](/images/builders/interoperability/xcm/custom-xcm-messages/custom-xcm-2.png)

### Execute an XCM Message with the XCM Utilities Precompile {: #execute-xcm-utils-precompile }

In this section, you'll use the `xcmExecute` function of the [XCM Utilities Precompile](/builders/pallets-precompiles/precompiles/xcm-utils){target=_blank}, which is only supported on Moonbase Alpha, to execute a XCM message locally. The XCM Utilities Precompile is located at the following address:

```
{{ networks.moonbase.precompiles.xcm_utils }}
```

Under the hood, the `xcmExecute` function of the XCM Utilities Precompile calls the `execute` function of the Polkadot XCM Pallet, which is a Substrate pallet that is coded in Rust. The benefit of using the XCM Utilities Precompile to call `xcmExecute` is that you can do so via the Ethereum API and use Ethereum libraries like [Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}.

The `xcmExecute` function accepts two parameters: the SCALE encoded versioned XCM message to be executed and the maximum weight to be consumed. 

To execute the XCM message locally, you'll take the following steps:

1. Build the SCALE encoded calldata. You can grab the encoded calldata from the [previous section](#execute-an-xcm-message-with-polkadotjs-apps), or you can calculate the same calldata programmatically with the [Polkadot.js API](/build/substrate-api/polkadot-js-api/){target=_blank} 
2. Send the XCM message, with the encoded calldata, using the Ethereum library and the XCM Utilities Precompile

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
3. Build the second XCM instruction, `BuyExecution`. Here, we are paying for Moonbase Alpha block execution time in DEV tokens by providing its multilocation and the amount we took out with the previous instruction
4. Build the third XCM instruction, `DepositAsset`. Whatever is left in holding after the actions executed before (in this case, it should be only DEV tokens) is deposited to Bob's address, which is set as the beneficiary
5. Put the XCM message together by concatenating the instructions inside a V2 array
6. Create the Polkadot.js API provider
7. Craft the `polkadotXcm.execute` extrinsic with the XCM message and the maximum weight
8. Get the SCALE encoded calldata

You can use `node` to run the script and the result will be logged to the console. The result should match the encoded calldata from the [previous section](#execute-an-xcm-message-with-polkadotjs-apps): 

```
0x1c03020c00040000010403001300008a5d78456301130000010403001300008a5d78456301000d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e000ca9a3b00000000
```

Before you can use the encoded calldata, you'll need to remove some of the hexadecimal characters that do not correspond to the XCM message, such as the call index for the `polkadotXcm.execute` function, which will be the first 4 characters, and the maximum weight, which will be the last 16 characters:

```
call index:  1c03
XCM message: 020c00040000010403001300008a5d78456301130000010403001300008a5d78456301000d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e0
max weight:  00ca9a3b00000000
```

So, for this example, the encoded calldata for the XCM message alone is: 

```
0x020c00040000010403001300008a5d78456301130000010403001300008a5d78456301000d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e0
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
