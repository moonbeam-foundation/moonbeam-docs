---
title: The XCM Transactor Pallet
description: This guide provides an introduction to the XCM Transactor Pallet and explains how to send remote calls to another chain using some of the pallet's extrinsics.
---

# Using the XCM Transactor Pallet for Remote Execution

## Introduction {: #introduction }

XCM messages are comprised of a [series of instructions](/builders/interoperability/xcm/core-concepts/instructions/){target=\_blank} that are executed by the Cross-Consensus Virtual Machine (XCVM). Combinations of these instructions result in predetermined actions such as cross-chain token transfers and, more interestingly, remote cross-chain execution. Remote execution involves executing operations or actions on one blockchain from another blockchain while maintaining the integrity of the sender's identity and permissions.

Typically, XCM messages are sent from the root origin (that is, SUDO or through governance), which is not ideal for projects that want to leverage remote cross-chain calls via a simple transaction. The [XCM Transactor Pallet](https://github.com/moonbeam-foundation/moonbeam/blob/master/pallets/xcm-transactor/src/lib.rs){target=\_blank} makes it easy to transact on a remote chain through either the [Sovereign account](/builders/interoperability/xcm/overview#general-xcm-definitions){target=\_blank}, which should only be allowed through governance, or a [Computed Origin account](/builders/interoperability/xcm/remote-execution/computed-origins){target=\_blank} via a simple transaction from the source chain.

This guide will show you how to use the XCM Transactor Pallet to send XCM messages from a Moonbeam-based network to other chains in the ecosystem. In addition, you'll also learn how to use the XCM Transactor Precompile to perform the same actions via the Ethereum API.

**Note that there are still limitations to what you can remotely execute through XCM messages**.

**Developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

## XCM Transactor Pallet Interface {: #xcm-transactor-pallet-interface}

### Extrinsics {: #extrinsics }

The XCM Transactor Pallet provides the following extrinsics (functions):

???+ function "**hrmpManage**(action, fee, weightInfo) - manages HRMP operations related to opening, accepting, and closing an HRMP channel"

    On Moonbeam or Moonriver, this function must be executed via governance through the General Admin or the Root Track. On Moonbase Alpha or a Moonbeam development node, this function can also be executed via sudo.

    === "Parameters"

        - `action` - the action to execute. Can be either `InitOpen`, `Accept`, `Close`, or `Cancel`
        - `fee` - the asset to be used for fees. This contains the `currency` and the `feeAmount`:
            - `currency` -  defines how you are specifying the token to use to pay for the fees, which can be either of the following:
                - `AsCurrencyId` - the currency ID of the asset to use for the fees. The currency ID can be either:
                    - `SelfReserve` - uses the native asset
                    - `ForeignAsset` - uses an [external XC-20](/builders/interoperability/xcm/xc20/overview#external-xc20s){target=\_blank}. It requires you to specify the asset ID of the XC-20
                     - `LocalAssetReserve` - *deprecated* - use [Local XC-20s](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=\_blank} instead via the `Erc20` currency type
                    - `Erc20` - uses a [local XC-20](/builders/interoperability/xcm/xc20/overview#local-xc20s){target=\_blank}. It requires you to specify the contract address of the local XC-20
                - `AsMultiLocation` - the XCM versioned multilocation for the asset to use for the fees
            - `feeAmount` - (optional) the amount to use for fees
        - `weightInfo` - the weight information to be used. The `weightInfo` structure contains the following:
            - `transactRequiredWeightAtMost` — the weight required to perform the execution of the `Transact` call.  The `transactRequiredWeightAtMost` structure contains the following:
                - `refTime` - the amount of computational time that can be used for execution
                - `proofSize` - the amount of storage in bytes that can be used
            - `overallWeight` — (optional) the total weight the extrinsic can use to execute all the XCM instructions, plus the weight of the `Transact` call (`transactRequiredWeightAtMost`). The `overallWeight` can be defined as either:
                - `Unlimited` - allows an unlimited amount of weight that can be purchased
                - `Limited` - limits the amount of weight that can be purchased by defining the following:
                    - `refTime` - the amount of computational time that can be used for execution
                    - `proofSize` - the amount of storage in bytes that can be used
    
    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/hrmp-manage.js'
        ```

??? function "**removeFeePerSecond**(assetLocation) — remove the fee per second information for a given asset in its reserve chain"

    On Moonbeam or Moonriver, this function must be executed via governance through the General Admin or the Root Track. On Moonbase Alpha or a Moonbeam development node, this function can also be executed via sudo.

    === "Parameters"

        - `assetLocation` - the XCM versioned multilocation of the asset to remove the fee per second information for

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/remove-fee-per-second.js'
        ```

??? function "**removeTransactInfo**(location) — remove the transact information for a given chain"

    On Moonbeam or Moonriver, this function must be executed via governance through the General Admin or the Root Track. On Moonbase Alpha or a Moonbeam development node, this function can also be executed via sudo.

    === "Parameters"

        - `location` - the XCM versioned multilocation of a given chain that you wish to remove the transact information for

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/remove-transact-info.js'
        ```

??? function "**setFeePerSecond**(assetLocation, feePerSecond) — sets the fee per second for a given asset on its reserve chain. The fee per second information typically relates to the cost of executing XCM instructions"

    On Moonbeam or Moonriver, this function must be executed via governance through the General Admin or the Root Track. On Moonbase Alpha or a Moonbeam development node, this function can also be executed via sudo.

    === "Parameters"

        - `assetLocation` - the XCM versioned multilocation of the asset to remove the fee per second information for
        - `feePerSecond` - the number of token units per second of XCM execution that will be charged to the sender of the extrinsic when executing XCM instructions

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/set-fee-per-second.js'
        ```

??? function "**setTransactInfo**(location, transactExtraWeight, maxWeight) — sets the transact information for a given chain. The transact information typically includes details about the weight required for executing XCM instructions as well as the maximum weight allowed for remote XCM execution on the target chain"

    On Moonbeam or Moonriver, this function must be executed via governance through the General Admin or the Root Track. On Moonbase Alpha or a Moonbeam development node, this function can also be executed via sudo.

    === "Parameters"

        - `location` - the XCM versioned multilocation of a given chain that you wish to set the transact information for
        - `transactExtraWeight` — the weight to cover execution fees of the XCM instructions (`WithdrawAsset`, `BuyExecution`, and `Transact`), which is estimated to be at least 10% over what the remote XCM instructions execution uses. The `transactExtraWeight` structure contains the following:
            - `refTime` - the amount of computational time that can be used for execution
            - `proofSize` - the amount of storage in bytes that can be used
        - `maxWeight` — maximum weight units allowed for the remote XCM execution. The `maxWeight` structure also contains `refTime` and `proofSize`
        - `transactExtraWeightSigned` — (optional) the weight to cover execution fees of the XCM instructions (`DescendOrigin`, `WithdrawAsset`, `BuyExecution`, and `Transact`), which is estimated to be at least 10% over what the remote XCM instructions execution uses. The `transactExtraWeightSigned` structure also contains `refTime` and `proofSize`

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/set-transact-info.js'
        ```

??? function "**transactThroughSigned**(destination, fee, call, weightInfo, refund) — sends an XCM message with instructions to remotely execute a call in the destination chain. The remote call will be signed and executed by a new account that the destination parachain must compute. Moonbeam-based networks follow [the Computed Origins standard set by Polkadot](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-builder/src/location_conversion.rs){target=\_blank}"

    === "Parameters"

        - `dest` - the XCM versioned multilocation for a chain in the ecosystem where the XCM message is being sent to (the target chain)
        - `fee` - the asset to be used for fees. This contains the `currency` and the `feeAmount`:
            - `currency` -  defines how you are specifying the token to use to pay for the fees, which can be either of the following:
                - `AsCurrencyId` - the currency ID of the asset to use for the fees. The currency ID can be either:
                    - `SelfReserve` - uses the native asset
                    - `ForeignAsset` - uses an [external XC-20](/builders/interoperability/xcm/xc20/overview#external-xc20s){target=\_blank}. It requires you to specify the asset ID of the XC-20
                     - `LocalAssetReserve` - *deprecated* - use [Local XC-20s](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=\_blank} instead via the `Erc20` currency type
                    - `Erc20` - uses a [local XC-20](/builders/interoperability/xcm/xc20/overview#local-xc20s){target=\_blank}. It requires you to specify the contract address of the local XC-20
                - `AsMultiLocation` - the XCM versioned multilocation for the asset to use for the fees
            - `feeAmount` - (optional) the amount to use for fees
        - `call` - encoded call data of the call that will be executed in the target chain
        - `weightInfo` - the weight information to be used. The `weightInfo` structure contains the following:
            - `transactRequiredWeightAtMost` — the weight required to perform the execution of the `Transact` call.  The `transactRequiredWeightAtMost` structure contains the following:
                - `refTime` - the amount of computational time that can be used for execution
                - `proofSize` - the amount of storage in bytes that can be used
            - `overallWeight` — (optional) the total weight the extrinsic can use to execute all the XCM instructions, plus the weight of the `Transact` call (`transactRequiredWeightAtMost`). The `overallWeight` can be defined as either:
                - `Unlimited` - allows an unlimited amount of weight that can be purchased
                - `Limited` - limits the amount of weight that can be purchased by defining the following:
                    - `refTime` - the amount of computational time that can be used for execution
                    - `proofSize` - the amount of storage in bytes that can be used
        - `refund` - a boolean indicating whether or not to add the `RefundSurplus` and `DepositAsset` instructions to the XCM message to refund any leftover fees 

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/transact-through-signed.js'
        ```

    !!! note
        In the following sections, you'll learn exactly how to retrieve all of the arguments needed to build and send an XCM message using this extrinsic.

??? function "**transactThroughSovereign**(dest, feePayer, fee, call, originKind, weightInfo, refund) — sends an XCM message with instructions to remotely execute a given call at the given destination. The remote call will be signed by the origin parachain Sovereign account (who pays the fees), but the transaction is dispatched from a given origin. The XCM Transactor Pallet calculates the fees for the remote execution and charges the given account the estimated amount in the corresponding [XC-20 token](/builders/interoperability/xcm/xc20/overview/){target=\_blank}"

    === "Parameters"

        - `dest` - the XCM versioned multilocation for a chain in the ecosystem where the XCM message is being sent to (the target chain)
        - `feePayer` - the address that will pay for the remote XCM execution in the corresponding [XC-20 token](/builders/interoperability/xcm/xc20/overview/){target=\_blank}
        - `fee` - the asset to be used for fees. This contains the `currency` and the `feeAmount`:
            - `currency` -  defines how you are specifying the token to use to pay for the fees, which can be either of the following:
                - `AsCurrencyId` - the currency ID of the asset to use for the fees. The currency ID can be either:
                    - `SelfReserve` - uses the native asset
                    - `ForeignAsset` - uses an [external XC-20](/builders/interoperability/xcm/xc20/overview#external-xc20s){target=\_blank}. It requires you to specify the asset ID of the XC-20
                     - `LocalAssetReserve` - *deprecated* - use [Local XC-20s](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=\_blank} instead via the `Erc20` currency type
                    - `Erc20` - uses a [local XC-20](/builders/interoperability/xcm/xc20/overview#local-xc20s){target=\_blank}. It requires you to specify the contract address of the local XC-20
                - `AsMultiLocation` - the XCM versioned multilocation for the asset to use for the fees
            - `feeAmount` - (optional) the amount to use for fees
        - `call` - encoded call data of the call that will be executed in the target chain
        - `originKind` — dispatcher of the remote call in the destination chain. There are [four types of dispatchers](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/src/v2/mod.rs#L85){target=\_blank} available: `Native`, `SovereignAccount`, `Superuser`, or `Xcm`
        - `weightInfo` - the weight information to be used. The `weightInfo` structure contains the following:
            - `transactRequiredWeightAtMost` — the weight required to perform the execution of the `Transact` call.  The `transactRequiredWeightAtMost` structure contains the following:
                - `refTime` - the amount of computational time that can be used for execution
                - `proofSize` - the amount of storage in bytes that can be used
            - `overallWeight` — (optional) the total weight the extrinsic can use to execute all the XCM instructions, plus the weight of the `Transact` call (`transactRequiredWeightAtMost`). The `overallWeight` can be defined as either:
                - `Unlimited` - allows an unlimited amount of weight that can be purchased
                - `Limited` - limits the amount of weight that can be purchased by defining the following:
                    - `refTime` - the amount of computational time that can be used for execution
                    - `proofSize` - the amount of storage in bytes that can be used
        - `refund` - a boolean indicating whether or not to add the `RefundSurplus` and `DepositAsset` instructions to the XCM message to refund any leftover fees 

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/transact-through-sovereign.js'
        ```

### Storage Methods {: #storage-methods }

The XCM Transactor Pallet includes the following read-only storage method:

???+ function "**destinationAssetFeePerSecond**(location) - returns the fee per second for a given asset"

    === "Parameters"

        - `location` - (optional) the XCM versioned multilocation for a specific destination asset
    
    === "Returns"

        A number representing the value for fee per second of the given asset. This value may be returned in a different format depending on the chain and how they store their data. You can use the `@polkadot/util` library for a variety of conversions, for example, to convert a hex value to a big integer using the `hexToBigInt` method.

        ```js
        // If using Polkadot.js API and calling toJSON() on the unwrapped value
        10000000000000
        ```
    
    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/destination-asset-fee-per-second.js'
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
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/pallet-version.js'
        ```

??? function "**transactInfoWithWeightLimit**(location) — returns the transact information for a given multilocation"

    === "Parameters"

        - `location` - (optional) the XCM versioned multilocation for a specific destination asset

    === "Returns"

        The transact information object.

        ```js
        // If using Polkadot.js API and calling toJSON() on the unwrapped value
        {
          transactExtraWeight: { refTime: 3000000000, proofSize: 131072 },
          maxWeight: { refTime: 20000000000, proofSize: 131072 },
          transactExtraWeightSigned: { refTime: 4000000000, proofSize: 131072 },
        }
        ```
    
    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/transact-info-with-weight-limit.js'
        ```

### Pallet Constants {: #constants }

The XCM Transactor Pallet includes the following read-only functions to obtain pallet constants:

???+ function "**baseXcmWeight**() - returns the base XCM weight required for execution, per XCM instruction"

    === "Returns"

        The base XCM weight object.

        ```js
        // If using Polkadot.js API and calling toJSON() on the unwrapped value
        { refTime: 200000000, proofSize: 0 }
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/base-xcm-weight.js'
        ```

??? function "**selfLocation**() - returns the multilocation of the chain"

    === "Returns"

        The self-location multilocation object.

        ```js
        // If using Polkadot.js API and calling toJSON() on the unwrapped value
        { parents: 0, interior: { here: null } }
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/self-location.js'
        ```

## XCM Instructions for Remote Execution {: #xcm-instructions-for-remote-execution }

The relevant [XCM instructions](/builders/interoperability/xcm/core-concepts/instructions/){target=\_blank} to perform remote execution through XCM are, but are not limited to:

 - [`DescendOrigin`](/builders/interoperability/xcm/core-concepts/instructions#descend-origin){target=\_blank} - gets executed in the target chain. It mutates the origin on the target chain to match the origin on the source chain, ensuring execution on the target chain occurs on behalf of the same entity initiating the XCM message on the source chain
 - [`WithdrawAsset`](/builders/interoperability/xcm/core-concepts/instructions#withdraw-asset){target=\_blank} - gets executed in the target chain. Removes assets and places them into a holding register
 - [`BuyExecution`](/builders/interoperability/xcm/core-concepts/instructions#buy-execution){target=\_blank} - gets executed in the target chain. Takes the assets from holding to pay for execution fees. The fees to pay are determined by the target chain
 - [`Transact`](/builders/interoperability/xcm/core-concepts/instructions#transact){target=\_blank} - gets executed in the target chain. Dispatches encoded call data from a given origin, allowing for the execution of specific operations or functions

## Transact through a Computed Origin Account {: #xcmtransactor-transact-through-signed }

This section covers building an XCM message for remote execution using the XCM Transactor Pallet, specifically with the `transactThroughSigned` function. This function uses a Computed Origin account on the destination chain to dispatch the remote call.

The example in this section uses a destination parachain that is not publicly available, so you won't be able to follow along exactly. You can modify the example as needed for your own use case.

!!! note
    You need to ensure that the call you are going to execute remotely is allowed in the destination chain!

### Checking Prerequisites {: #xcmtransactor-signed-check-prerequisites }

To be able to send the extrinsics in this section, you need to have:

- An account in the origin chain with [funds](/builders/get-started/networks/moonbase/#get-tokens){target=\_blank}
- Funds in the Computed Origin account on the target chain. To learn how to calculate the address of the Computed Origin account, please refer to the [How to Calculate the Computed Origin](/builders/interoperability/xcm/remote-execution/computed-origins){target=\_blank} documentation

For this example, the following accounts will be used:

- Alice's account in the origin parachain (Moonbase Alpha): `0x44236223aB4291b93EEd10E4B511B37a398DEE55`
- Her Computed Origin address in the target parachain (Parachain 888): `0x5c27c4bb7047083420eddff9cddac4a0a120b45c`

### Building the XCM {: #xcm-transact-through-signed }

Since you'll be interacting with the `transactThroughSigned` function of the XCM Transactor Pallet, you'll need to assemble the values for the `dest`, `fee`, `call`, `weightInfo`, and `refund` parameters. To do so, you can take the following steps:

1. Define the destination multilocation, which will target parachain 888

    ```js
    const dest = {
      V3: {
        parents: 1,
        interior: { X1: { Parachain: 888 } },
      },
    };
    ```
  
2. Define the `fee` information, which will require you to define the currency and set the fee amount

    === "External XC-20s"

        ```js
        const fee = {
          currency: {
            AsCurrencyId: { ForeignAsset: 35487752324713722007834302681851459189n },
          },
          feeAmount: 50000000000000000n,
        };
        ```

    === "Local XC-20s"

        ```js
        const fee = {
          currency: {
            AsCurrencyId: { Erc20: { contractAddress: ERC_20_ADDRESS} },
          },
          feeAmount: 50000000000000000n,
        };
        ```

3. Define the `call` that will be executed in the destination chain, which is the encoded call data of the pallet, method, and input to be called. It can be constructed in [Polkadot.js Apps](https://polkadot.js.org/apps/){target=\_blank} (which must be connected to the destination chain) or using the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=\_blank}. For this example, the inner call is a simple balance transfer of 1 token of the destination chain to Alice's account there

    ```js
    const call =
      '0x030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d';
    ```

4. Set the `weightInfo`, which includes the weight specific to the inner call (`transactRequiredWeightAtMost`) and the optional overall weight of the transact plus XCM execution (`overallWeight`). For each parameter, you can follow these guidelines:
    - For `transactRequiredAtMost`, you can set `refTime` to `1000000000` weight units and `proofSize` to `40000`
    - For `overallWeight`, the value must be the total of `transactRequiredWeightAtMost` plus the weight needed to cover the execution costs for the XCM instructions in the destination chain. If you do not provide this value, the pallet will use the element in storage (if it exists) and add it to `transactRequiredWeightAtMost`. For this example, you can set the `overallWeight` to `Unlimited`, which removes the need to know how much weight the destination chain will require to execute the XCM

    ```js
    const weightInfo = {
      transactRequiredWeightAtMost: { refTime: 1000000000n, proofSize: 40000n },
      overallWeight: { Unlimited: null },
    };
    ```

    !!! note
        For accurate estimates of the `refTime` and `proofSize` figures for `transactRequiredAtMost`, you can use the [`paymentInfo` method of the Polkadot.js API](/builders/build/substrate-api/polkadot-js-api#fees){target=\_blank}.

5. To refund any leftover XCM fees, you can set the `refund` value to `true`. Otherwise, set it to `false`

    ```js
    const refund = true;
    ```

### Sending the XCM {: #sending-the-xcm }

Now that you have the values for each of the parameters, you can write the script for the transaction. You'll take the following steps:

 1. Provide the input data for the call. This includes:
     - The Moonbase Alpha endpoint URL to create the provider
     - The values for each of the parameters of the `transactThroughSigned` function
 2. Create a Keyring instance that will be used to send the transaction
 3. Create the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=\_blank} provider
 4. Craft the `xcmTransactor.transactThroughSigned` extrinsic with the `dest`, `fee`, `call`, `weightInfo`, and `refund` values
 5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the second step

!!! remember
    This is for demo purposes only. Never store your private key in a JavaScript file.

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/transact-signed.js'
```

!!! note
    You can view an example of the above script, which sends one token to Alice's Computed Origin account on parachain 888, on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x210603010100e10d00017576e5e612ff054915d426c546b1b21a010000c52ebca2b10000000000000000007c030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d02286bee02710200010001){target=\_blank} using the following encoded calldata: `0x210603010100e10d00017576e5e612ff054915d426c546b1b21a010000c52ebca2b10000000000000000007c030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d02286bee02710200010001`.

### XCM Transact through Computed Origin Fees {: #transact-through-computed-origin-fees }

When [transacting through the Computed Origin account](#xcmtransactor-transact-through-signed){target=\_blank}, the transaction fees are paid by the same account from which the call is dispatched, which is a Computed Origin account in the destination chain. Consequently, the Computed Origin account must hold the necessary funds to pay for the entire execution. Note that the destination token, for which fees are paid, does not need to be registered as an XC-20 in the origin chain.

To estimate the amount of token Alice's Computed Origin account will need to have to execute the remote call, you need to check the transact information specific to the destination chain. You can use the following script to get the transact information for parachain 888:

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/transact-info-with-weight-limit.js'
```

From the response, you can see that the `transactExtraWeightSigned` is `{{ networks.moonbase_beta.xcm_message.transact.weight.display }}`. This is the weight needed to execute the four XCM instructions for this remote call in that specific destination chain. Next, you need to find out how much the destination chain charges per weight of XCM execution. Normally, you would look into the units per second for that particular chain. But in this scenario, no XC-20 tokens are burned. Therefore, units per second can be used for reference, but it does not ensure that the estimated number of tokens is correct. To get the units per second as a reference value, you can use the following script:

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/destination-asset-fee-per-second.js'
```

Note that the units per second value is related to the cost estimated in the [Relay Chain XCM Fee Calculation](/builders/interoperability/xcm/core-concepts/weights-fees/#polkadot){target=\_blank} section or to the one shown in the [Units per weight](/builders/interoperability/xcm/core-concepts/weights-fees/#moonbeam-reserve-assets){target=\_blank} section if the target is another parachain. You'll need to find the correct value to ensure that the amount of tokens the Computed Origin account holds is correct. Calculating the associated XCM execution fee is as simple as multiplying the `transactExtraWeightSigned` times the `unitsPerSecond` (for an estimation):

```text
XCM-Wei-Token-Cost = transactExtraWeightSigned * unitsPerSecond
XCM-Token-Cost = XCM-Wei-Token-Cost / DecimalConversion
```

Therefore, the actual calculation for one XCM Transactor transact through derivative call is:

```text
XCM-Wei-Token-Cost = {{ networks.moonbase_beta.xcm_message.transact.weight.numbers_only }} * {{ networks.moonbase.xcm.units_per_second.xcbetadev.transact_numbers_only }}
XCM-Token-Cost = {{ networks.moonbase_beta.xcm_message.transact.wei_betadev_cost }} / 10^18
```

The cost of transacting through a Computed Origin is `{{ networks.moonbase_beta.xcm_message.transact.betadev_cost }} TOKEN`. **Note that this does not include the cost of the call being remotely executed, only XCM execution fees.**
