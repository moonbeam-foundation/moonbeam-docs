---
title: Send & Execute XCM Messages
description: Learn how to build a custom XCM message, by combining and experimenting with different XCM instructions, and execute it locally on Moonbeam to see the results.
---

# Send and Execute XCM Messages

## Introduction {: #introduction }

XCM messages are comprised of a [series of instructions](/builders/interoperability/xcm/core-concepts/instructions/){target=\_blank} that are executed by the Cross-Consensus Virtual Machine (XCVM). Combinations of these instructions result in predetermined actions, such as cross-chain token transfers. You can create your own custom XCM messages by combining various XCM instructions.

Pallets such as [X-Tokens](/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/){target=\_blank} and [XCM Transactor](/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/){target=\_blank} provide functions with a predefined set of XCM instructions to either send [XC-20s](/builders/interoperability/xcm/xc20/overview/){target=\_blank} or remotely execute on other chains via XCM. However, to get a better understanding of the results from combining different XCM instructions, you can build and execute custom XCM messages locally on Moonbeam (only available on Moonbase Alpha). You can also send custom XCM messages to another chain (which will start with the [`DecendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=\_blank} instruction). Nevertheless, for the XCM message to be successfully executed, the target chain needs to be able to understand the instructions.

To execute or send a custom XCM message, you can either use the [Polkadot XCM Pallet](#polkadot-xcm-pallet-interface) directly or through the Ethereum API with the [XCM Utilities Precompile](/builders/interoperability/xcm/xcm-utils/){target=\_blank}. In this guide, you'll learn how to use both methods to execute and send custom-built XCM messages locally on Moonbase Alpha.

This guide assumes that you are familiar with general XCM concepts, such as [general XCM terminology](/builders/interoperability/xcm/overview/#general-xcm-definitions){target=\_blank} and [XCM instructions](/builders/interoperability/xcm/core-concepts/instructions/){target=\_blank}. For more information, you can check out the [XCM Overview](/builders/interoperability/xcm/overview/){target=\_blank} documentation.

## Polkadot XCM Pallet Interface {: #polkadot-xcm-pallet-interface }

### Extrinsics {: #extrinsics }

The Polkadot XCM Pallet includes the following relevant extrinsics (functions):

???+ function "**execute**(message, maxWeight) — **supported on Moonbase Alpha only** - executes a custom XCM message on the source chain"

    === "Parameters"

        - `message` - the SCALE-encoded versioned XCM message to be executed
        - `maxWeight` - the maximum weight allowed to be consumed, which is defined by specifying the:
            - `refTime` - the amount of computational time that can be used for execution
            - `proofSize` - the amount of storage in bytes that can be used

    === "Polkadot.js API Example"
        
        ```js
        --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/interface-examples/execute.js'
        ```

???+ function "**send**(dest, message) — **supported on Moonbase Alpha only** - sends a custom XCM message to a destination chain. For the XCM message to be successfully executed, the target chain needs to be able to understand the instructions in the message"

    === "Parameters"

        - `dest` - the XCM versioned multilocation representing a chain in the ecosystem where the XCM message is being sent to (the target chain)
        - `message` - the SCALE-encoded versioned XCM message to be executed

    === "Polkadot.js API Example"
        
        ```js
        --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/interface-examples/send.js'
        ```

### Storage Methods {: #storage-methods }

The Polkadot XCM Pallet includes the following relevant read-only storage methods:

???+ function "**assetTraps**(hash) — returns the existing number of times an asset has been trapped given a hash of the asset"

    === "Parameters"

        `hash` - (optional) the Blake2-256 hash of the [`Asset`](https://github.com/paritytech/xcm-format#6-universal-asset-identifiers){target=\_blank}

    === "Returns"

        The number of times an asset has been trapped. If the hash was omitted, it returns an array of all of the hashes and the number of times each asset has been trapped.

        ```js
        // If using Polkadot.js API and calling toJSON() on the value
        // If hash was provided:
        10

        // If hash was omitted:
        [
          [
            0xf7d4341888be30c6a842a77c52617423e8109aa249e88779019cf731ed772fb7
          ],
          10
        ],
        ...
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/interface-examples/assets-trapped.js'
        ```

??? function "**palletVersion**() — returns current pallet version from storage"

    === "Parameters"

        None

    === "Returns"

        A number representing the current version of the pallet.

        ```js
        // If using Polkadot.js API and calling toJSON() on the unwrapped value
        0
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/interface-examples/pallet-version.js'
        ```

## Checking Prerequisites {: #checking-prerequisites }

To follow along with this guide, you will need the following:

- Your account must be funded with DEV tokens.
  --8<-- 'text/_common/faucet/faucet-list-item.md'

## Execute an XCM Message Locally {: #execute-an-xcm-message-locally }

This section of the guide covers the process of building a custom XCM message to be executed locally (i.e., in Moonbeam) via two different methods: the `execute` function of the Polkadot XCM Pallet and the `xcmExecute` function of the [XCM Utilities Precompile](/builders/interoperability/xcm/xcm-utils/){target=\_blank}. This functionality provides a playground for you to experiment with different XCM instructions and see firsthand the results of these experiments. This also comes in handy to determine the [fees](/builders/interoperability/xcm/core-concepts/weights-fees/){target=\_blank} associated with a given XCM message on Moonbeam.

In the following example, you'll transfer DEV tokens from one account to another on Moonbase Alpha. To do so, you'll be building an XCM message that contains the following XCM instructions, which are executed locally (in this case, on Moonbase Alpha):

 - [`WithdrawAsset`](/builders/interoperability/xcm/core-concepts/instructions#withdraw-asset){target=\_blank} - removes assets and places them into the holding register
 - [`DepositAsset`](/builders/interoperability/xcm/core-concepts/instructions#deposit-asset){target=\_blank} - removes the assets from the holding register and deposits the equivalent assets to a beneficiary account

!!! note
    Typically, when you send an XCM message cross-chain to a target chain, the [`BuyExecution` instruction](/builders/interoperability/xcm/core-concepts/instructions#buy-execution){target=\_blank} is needed to pay for remote execution. However, for local execution, this instruction is not necessary as you are already getting charged via the extrinsic call.

### Execute an XCM Message with the Polkadot.js API {: #execute-an-xcm-message-with-polkadotjs-api }

In this example, you'll execute a custom XCM message locally on Moonbase Alpha using the Polkadot.js API to interact directly with the Polkadot XCM Pallet.

The `execute` function of the Polkadot XCM Pallet accepts two parameters: `message` and `maxWeight`. You can start assembling these parameters by taking the following steps:

1. Build the `WithdrawAsset` instruction, which will require you to define:
    - The multilocation of the DEV token on Moonbase Alpha
    - The amount of DEV tokens to transfer

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/execute/execute-with-polkadot.js:7:14'
    ```

2. Build the `DepositAsset` instruction, which will require you to define:
    - The asset identifier for DEV tokens. You can use the [`WildAsset` format](https://github.com/paritytech/xcm-format/blob/master/README.md#6-universal-asset-identifiers){target=\_blank}, which allows for wildcard matching, to identify the asset
    - The multilocation of the beneficiary account on Moonbase Alpha

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/execute/execute-with-polkadot.js:15:31'
    ```

3. Combine the XCM instructions into a versioned XCM message:

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/execute/execute-with-polkadot.js:32:32'
    ```

4. Specify the `maxWeight`, which includes a value for `refTime` and `proofSize` that you will need to define:
    - The `refTime` is the amount of computational time that can be used for execution. For this example, you can set it to `7,750,000,000` since the `refTime` for [`WithdrawAsset`](https://github.com/moonbeam-foundation/moonbeam/blob/{{networks.moonbase.spec_version}}/pallets/moonbeam-xcm-benchmarks/src/weights/fungible.rs#L36){target=\_blank} and [`DepositAsset`](https://github.com/moonbeam-foundation/moonbeam/blob/{{networks.moonbase.spec_version}}/pallets/moonbeam-xcm-benchmarks/src/weights/fungible.rs#L58){target=\_blank} is set to `{{ xcm.generic_weights.ref_time.withdraw_asset.display }}` each
    - The `proofSize` is the amount of storage in bytes that can be used. You can set this to `4,960,000` since the `proofSize` for [`WithdrawAsset`](https://github.com/moonbeam-foundation/moonbeam/blob/{{networks.moonbase.spec_version}}/pallets/moonbeam-xcm-benchmarks/src/weights/fungible.rs#L36){target=\_blank} and [`DepositAsset`](https://github.com/moonbeam-foundation/moonbeam/blob/{{networks.moonbase.spec_version}}/pallets/moonbeam-xcm-benchmarks/src/weights/fungible.rs#L58){target=\_blank} is set to `{{ xcm.generic_weights.proof_size.withdraw_asset.display }}` each

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/execute/execute-with-polkadot.js:33:33'
    ```

Now that you have the values for each of the parameters, you can write the script for the execution. You'll take the following steps:

 1. Provide the input data for the call. This includes:
     - The Moonbase Alpha endpoint URL to create the provider
     - The values for each of the parameters of the `execute` function
 2. Create a Keyring instance that will be used to send the transaction
 3. Create the [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=\_blank} provider
 4. Craft the `polkadotXcm.execute` extrinsic with the `message` and `maxWeight`
 5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the second step

!!! remember
    This is for demo purposes only. Never store your private key in a JavaScript file.

```js
--8<-- 'code/builders/interoperability/xcm/send-execute-xcm/execute/execute-with-polkadot.js'
```

!!! note
    You can view an example of the above script, which sends 1 DEV to Bobs's account on Moonbeam, on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x1c030408000400010403001300008a5d784563010d0100000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e00700e876481700){target=\_blank} using the following encoded calldata: `0x1c030408000400010403001300008a5d784563010d0100000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e00700e876481700`.

Once the transaction is processed, the 0.1 DEV tokens should be withdrawn from Alice's account along with the associated XCM fees, and the destination account should have received 0.1 DEV tokens in their account. A `polkadotXcm.Attempted` event will be emitted with the outcome.

### Execute an XCM Message with the XCM Utilities Precompile {: #execute-xcm-utils-precompile }

In this section, you'll use the `xcmExecute` function of the [XCM Utilities Precompile](/builders/interoperability/xcm/xcm-utils/){target=\_blank}, which is only supported on Moonbase Alpha, to execute an XCM message locally. The XCM Utilities Precompile is located at the following address:

```text
{{ networks.moonbase.precompiles.xcm_utils }}
```

Under the hood, the `xcmExecute` function of the XCM Utilities Precompile calls the `execute` function of the Polkadot XCM Pallet, which is a Substrate pallet that is coded in Rust. The benefit of using the XCM Utilities Precompile to call `xcmExecute` is that you can do so via the Ethereum API and use [Ethereum libraries](/builders/ethereum/libraries/){target=\_blank} like [Ethers.js](/builders/ethereum/libraries/ethersjs/){target=\_blank}.

The `xcmExecute` function accepts two parameters: the SCALE encoded versioned XCM message to be executed and the maximum weight to be consumed.

First, you'll learn how to generate the encoded calldata, and then you'll learn how to use the encoded calldata to interact with the XCM Utilities Precompile.

#### Generate the Encoded Calldata of an XCM Message {: #generate-encoded-calldata }

To get the encoded calldata of the XCM message, you can create a script similar to the one you created in the [Execute an XCM Message with the Polkadot.js API](#execute-an-xcm-message-with-polkadotjs-api) section. Instead of building the message and sending the transaction, you'll build the message to get the encoded calldata. You'll take the following steps:

 1. Provide the input data for the call. This includes:
     - The Moonbase Alpha endpoint URL to create the provider
     - The values for each of the parameters of the `execute` function as defined in the [Execute an XCM Message with the Polkadot.js API](#execute-an-xcm-message-with-polkadotjs-api) section
 2. Create the [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=\_blank} provider
 3. Craft the `polkadotXcm.execute` extrinsic with the `message` and `maxWeight`
 4. Use the transaction to get the encoded calldata

The entire script is as follows:

```js
--8<-- 'code/builders/interoperability/xcm/send-execute-xcm/execute/generate-encoded-calldata.js'
```

#### Execute the XCM Message {: #execute-xcm-message }

Now that you have the SCALE encoded XCM message, you can use the following code snippets to programmatically call the `xcmExecute` function of the XCM Utilities Precompile using your [Ethereum library](/builders/ethereum/libraries/){target=\_blank} of choice. Generally speaking, you'll take the following steps:

1. Create a provider and signer
2. Create an instance of the XCM Utilities Precompile to interact with
3. Define parameters required for the `xcmExecute` function, which will be the encoded calldata for the XCM message and the maximum weight to use to execute the message. You can set the `maxWeight` to be `400000000n`, which corresponds to the `refTime`. The `proofSize` will automatically be set to the default, which is 64KB
4. Execute the XCM message

!!! remember
    The following snippets are for demo purposes only. Never store your private keys in a JavaScript or Python file.

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/execute/ethers.js'
    ```

=== "Web3.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/execute/web3.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/execute/web3.py'
    ```

And that's it! You've successfully used the Polkadot XCM Pallet and the XCM Utilities Precompile to execute a custom XCM message locally on Moonbase Alpha!

## Send an XCM Message Cross-Chain {: #send-xcm-message }

This section of the guide covers the process of sending a custom XCM message cross-chain (i.e., from Moonbeam to a target chain, such as the relay chain) via two different methods: the `send` function of the Polkadot XCM Pallet and the `xcmSend` function of the [XCM Utilities Precompile](/builders/interoperability/xcm/xcm-utils/){target=\_blank}.

For the XCM message to be successfully executed, the target chain needs to be able to understand the instructions in the message. If it doesn't, you'll see a `Barrier` filter on the destination chain. For security reasons, the XCM message is prepended with the [`DecendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=\_blank} instruction to prevent XCM execution on behalf of the origin chain Sovereign account. **The example in this section will not work for the reasons mentioned above, it is purely for demonstration purposes**.

In the following example, you'll be building an XCM message that contains the following XCM instructions, which will be executed in the Alphanet relay chain:

 - [`WithdrawAsset`](/builders/interoperability/xcm/core-concepts/instructions#withdraw-asset){target=\_blank} - removes assets and places them into the holding register
 - [`BuyExecution`](/builders/interoperability/xcm/core-concepts/instructions#buy-execution){target=\_blank} - takes the assets from holding to pay for execution fees. The fees to pay are determined by the target chain
 - [`DepositAsset`](/builders/interoperability/xcm/core-concepts/instructions#deposit-asset){target=\_blank}- removes the assets from the holding register and deposits the equivalent assets to a beneficiary account

Together, the intention of these instructions is to transfer the native asset of the relay chain, which is UNIT for the Alphanet relay chain, from Moonbase Alpha to an account on the relay chain. This example is for demonstration purposes only to show you how a custom XCM message could be sent cross-chain. Please keep in mind that the target chain needs to be able to understand the instructions in the message to execute them.

### Send an XCM Message with the Polkadot.js API {: #send-xcm-message-with-polkadotjs-api }

In this example, you'll send a custom XCM message from your account on Moonbase Alpha to the relay chain using the [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=\_blank} to interact directly with the Polkadot XCM Pallet.

The `send` function of the Polkadot XCM Pallet accepts two parameters: `dest` and `message`. You can start assembling these parameters by taking the following steps:

1. Build the multilocation of the relay chain token, UNIT, for the `dest`:

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/send/send-with-polkadot.js:10:10'
    ```

2. Build the `WithdrawAsset` instruction, which will require you to define:
    - The multilocation of the UNIT token on the relay chain
    - The amount of UNIT tokens to withdraw

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/send/send-with-polkadot.js:11:18'
    ```

3. Build the `BuyExecution` instruction, which will require you to define:
    - The multilocation of the UNIT token on the relay chain
    - The amount of UNIT tokens to buy for execution
    - The weight limit

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/send/send-with-polkadot.js:19:27'
    ```

4. Build the `DepositAsset` instruction, which will require you to define:
    - The asset identifier for UNIT tokens. You can use the [`WildAsset` format](https://github.com/paritytech/xcm-format/blob/master/README.md#6-universal-asset-identifiers){target=\_blank}, which allows for wildcard matching, to identify the asset
    - The multilocation of the beneficiary account on the relay chain

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/send/send-with-polkadot.js:28:44'
    ```

5. Combine the XCM instructions into a versioned XCM message:

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/send/send-with-polkadot.js:45:45'
    ```

Now that you have the values for each of the parameters, you can write the script to send the XCM message. You'll take the following steps:

 1. Provide the input data for the call. This includes:
     - The Moonbase Alpha endpoint URL to create the provider
     - The values for each of the parameters of the `send` function
 2. Create a Keyring instance that will be used to send the transaction
 3. Create the [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=\_blank} provider
 4. Craft the `polkadotXcm.send` extrinsic with the `dest` and `message`
 5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the second step

!!! remember
    This is for demo purposes only. Never store your private key in a JavaScript file.

```js
--8<-- 'code/builders/interoperability/xcm/send-execute-xcm/send/send-with-polkadot.js'
```

!!! note
    You can view an example of the above script, which sends 1 UNIT to Bobs's relay chain account, on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x1c00040100040c0004010000070010a5d4e813010000070010a5d4e8000d0100010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d67){target=\_blank} using the following encoded calldata: `0x1c00040100040c0004010000070010a5d4e813010000070010a5d4e8000d0100010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d67`.

Once the transaction is processed, a `polkadotXcm.sent` event is emitted with the details of the sent XCM message.

### Send an XCM Message with the XCM Utilities Precompile {: #send-xcm-utils-precompile }

In this section, you'll use the `xcmSend` function of the [XCM Utilities Precompile](/builders/interoperability/xcm/xcm-utils/){target=\_blank}, which is only supported on Moonbase Alpha, to send an XCM message cross-chain. The XCM Utilities Precompile is located at the following address:

=== "Moonbase Alpha"

     ```text
     {{ networks.moonbase.precompiles.xcm_utils }}
     ```

Under the hood, the `xcmSend` function of the XCM Utilities Precompile calls the `send` function of the Polkadot XCM Pallet, which is a Substrate pallet that is coded in Rust. The benefit of using the XCM Utilities Precompile to call `xcmSend` is that you can do so via the Ethereum API and use Ethereum libraries like [Ethers.js](/builders/ethereum/libraries/ethersjs/){target=\_blank}. For the XCM message to be successfully executed, the target chain needs to be able to understand the instructions in the message.

The `xcmSend` function accepts two parameters: the multilocation of the destination and the SCALE encoded versioned XCM message to be sent.

First, you'll learn how to generate the encoded calldata for the XCM message, and then you'll learn how to use the encoded calldata to interact with the XCM Utilities Precompile.

#### Generate the Encoded Calldata of an XCM Message {: #generate-encoded-calldata }

To get the encoded calldata of the XCM message, you can create a script similar to the one you created in the [Send an XCM Message with the Polkadot.js API](#send-xcm-message-with-polkadotjs-api) section. Instead of building the message and sending the transaction, you'll build the message to get the encoded calldata. You'll take the following steps:

 1. Provide the input data for the call. This includes:
     - The Moonbase Alpha endpoint URL to create the provider
     - The values for each of the parameters of the `send` function as defined in the [Send an XCM Message with the Polkadot.js API](#send-xcm-message-with-polkadotjs-api) section
 2. Create the [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=\_blank} provider
 3. Craft the `polkadotXcm.execute` extrinsic with the `message` and `maxWeight`
 4. Use the transaction to get the encoded calldata

The entire script is as follows:

```js
--8<-- 'code/builders/interoperability/xcm/send-execute-xcm/send/generate-encoded-calldata.js'
```

#### Send the XCM Message {: #send-xcm-message }

Before you can send the XCM message, you'll also need to build the multilocation of the destination. For this example, you'll target the relay chain with Moonbase Alpha as the origin chain:

```js
const dest = [
  1, // Parents: 1 
  [] // Interior: Here
];
```

Now that you have the SCALE encoded XCM message and the destination multilocation, you can use the following code snippets to programmatically call the `xcmSend` function of the XCM Utilities Precompile using your [Ethereum library](/builders/ethereum/libraries/){target=\_blank} of choice. Generally speaking, you'll take the following steps:

1. Create a provider and signer
2. Create an instance of the XCM Utilities Precompile to interact with
3. Define parameters required for the `xcmSend` function, which will be the destination and the encoded calldata for the XCM message
4. Send the XCM message

!!! remember
    The following snippets are for demo purposes only. Never store your private keys in a JavaScript or Python file.

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/send/ethers.js'
    ```

=== "Web3.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/send/web3.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/interoperability/xcm/send-execute-xcm/send/web3.py'
    ```

And that's it! You've successfully used the Polkadot XCM Pallet and the XCM Utilities Precompile to send a message from Moonbase Alpha to another chain!
