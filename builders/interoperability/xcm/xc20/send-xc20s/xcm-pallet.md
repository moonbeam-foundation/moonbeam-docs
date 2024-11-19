---
title: Send XC-20s to Other Chains
description: This guide provides an introduction to the PolkadotXCM Pallet and explains how to send XC-20s to another chain using the pallet's extrinsics.
---

# Using the PolkadotXCM Pallet To Send XC-20s

## Introduction {: #introduction }

!!! note

    The PolkadotXCM Pallet replaces the deprecated XTokens Pallet. Accordingly, ensure that you are using the PolkadotXCM Pallet to interact with XC-20s.

Building an XCM message for fungible asset transfers is not an easy task. Consequently, there are wrapper functions and pallets that developers can leverage to use XCM features on Polkadot and Kusama. One example of such wrappers is the [XCM](https://wiki.polkadot.network/docs/learn-xcm-pallet){target=\_blank} Pallet, which provides different methods to transfer fungible assets via XCM.

This guide will show you how to leverage the X-Tokens Pallet to send [XC-20s](/builders/interoperability/xcm/xc20/overview/){target=\_blank} from a Moonbeam-based network to other chains in the ecosystem (relay chain/parachains).

**Developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

## Nomenclature {: #nomenclature }

Because there are a variety of XCM-related pallets and precompiles with similar sounding names, the following section will clarify the differences between each of them. 

- `PolkadotXCM` - this pallet (and the focus of this page) enables you to interact with XC-20s on Moonbeam, replacing the deprecated `XTokens` pallet 
- `pallet-xcm`- this is the general Polkadot XCM pallet that allows you to interact with cross-chain assets. Moonbeam's `PolkadotXCM` pallet is essentially a wrapper of `pallet-xcm`. Because of this, you may see `PolkadotXCM` and `pallet-xcm` referred to interchangeably
- `XTokens` - This pallet is now deprecated and replaced by `PolkadotXCM`
- `XCMInterface.sol` - This precompile is the solidity interface that replaces `XTokens.sol` and enables you to interact with the methods of `PolkadotXCM` from the EVM via a solidity interface

## PolkadotXCM Pallet Interface {: #polkadotxcm-pallet-interface }

### Extrinsics {: #extrinsics }

The PolkadotXCM Pallet provides the following extrinsics (functions):

???+ function "**claimAssets**(assets, beneficiary) — claims assets that were trapped in this pallet during XCM execution"
    === "Parameters"
        - `assets` - the exact assets, specified as multilocation, that were trapped during XCM execution
        - `beneficiary` - the destination where the claimed assets will be deposited. This specifies the location/account that will receive the claimed assets

??? function "**execute**(message, maxWeight) — executes an XCM message from a local, signed origin. Event will be emitted to indicate whether the message was executed completely or partially. If the `maxWeight` provided is less than what's required to execute the message, no execution attempt will be made"
    === "Parameters"
           - `message` - the XCM message to be executed
           - `maxWeight` - the maximum weight that can be used for executing the message. This can be defined by:
               - `refTime` - the amount of computational time that can be used for execution
               - `proofSize` - the amount of storage in bytes that can be used

??? function "**forceDefaultXcmVersion**(maybeXcmVersion) — sets a safe default XCM version for message encoding (admin origins only)"
    === "Parameters"
           - `maybeXcmVersion` - the default XCM encoding version to be used when a destination's supported version is unknown. Can be either:
               - A version number
               - `None` to disable the default version setting

??? function "**forceSubscribeVersionNotify**(location) — subscribes to XCM version updates from a specific location (admin origins only)"
    === "Parameters"
           - `location` - the location from which to receive XCM version notifications. This specifies the source that will notify about their current XCM version and any subsequent changes

??? function "**forceSuspension**(suspended) — sets or unsets the global suspension state of the XCM executor (admin origins only)"
    === "Parameters"
           - `suspended` - a boolean value that controls the suspension state:
               - `true` - suspends the XCM executor
               - `false` - resumes the XCM executor

??? function "**forceUnsubscribeVersionNotify**(location) — removes a subscription to XCM version notifications from a specific location (admin origins only)"
    === "Parameters"
           - `location` - the location from which to stop receiving XCM version notifications. This specifies the source to unsubscribe from version updates

??? function "**forceXcmVersion**(location, version) — specifies the XCM version supported by a particular destination. This function can only be called by an origin specified by AdminOrigin. This manually sets the XCM version for a destination rather than relying on version notifications"
    === "Parameters"
           - `location` - the destination whose XCM version capability is being declared
           - `version` - the latest XCM version number that the specified location supports


??? function "**limitedReserveTransferAssets**(dest, beneficiary, assets, feeAssetItem, weightLimit) — transfers assets from the local chain to a destination chain via their reserve location"
    === "Parameters"
           - `dest` - the destination context for the assets. Typically specified as:
               - `[Parent, Parachain(..)]` for parachain to parachain transfers
               - `[Parachain(..)]` for relay to parachain transfers
           - `beneficiary` - the recipient location in the context of the destination. Generally an `AccountId32` value
           - `assets` - the assets to be transferred. Must:
               - Have the same reserve location
               - Not be teleportable to the destination
               - Include assets for fee payment
           - `feeAssetItem` - the index in the `assets` array indicating which asset should be used to pay fees
           - `weightLimit` - the weight limit for XCM fee purchase on the destination chain. Can be defined as:
               - `Unlimited` - allows an unlimited amount of weight
               - `Limited` - specifies a maximum weight value

           The transfer behavior varies based on asset reserve location:
           
           - **Local Reserve**: 
               - Transfers assets to destination chain's sovereign account
               - Sends XCM to mint and deposit reserve-based assets to beneficiary
           
           - **Destination Reserve**:
               - Burns local assets
               - Notifies destination to withdraw reserves from this chain's sovereign account
               - Deposits to beneficiary
           
           - **Remote Reserve**:
               - Burns local assets
               - Sends XCM to move reserves between sovereign accounts
               - Notifies destination to mint and deposit to beneficiary
               
            As a reminder, if more weight is needed than specified in `weightLimit`, the operation will fail and transferred assets may be at risk

??? function "**limitedTeleportAssets**(dest, beneficiary, assets, feeAssetItem, weightLimit) — teleports assets from the local chain to a destination chain"
    === "Parameters"
           - `dest` - the destination context for the assets. Typically specified as:
               - `[Parent, Parachain(..)]` for parachain to parachain transfers
               - `[Parachain(..)]` for relay to parachain transfers
           - `beneficiary` - the recipient location in the context of the destination. Generally an `AccountId32` value
           - `assets` - the assets to be teleported. Must include assets necessary for fee payment on the destination chain
           - `feeAssetItem` - the index in the `assets` array indicating which asset should be used to pay fees
           - `weightLimit` - the weight limit for XCM fee purchase on the destination chain. Can be defined as:
               - `Unlimited` - allows an unlimited amount of weight
               - `Limited` - specifies a maximum weight value

           As a reminder, the origin must be capable of both withdrawing the specified assets and executing XCM. If more weight is needed than specified in `weightLimit`, the operation will fail and teleported assets may be at risk

??? function "**reserveTransferAssets**(dest, beneficiary, assets, feeAssetItem) — transfers assets from the local chain to a destination chain via their reserve location. This function is deprecated. Use `limitedReserveTransferAssets` instead"

??? function "**send**(dest, message) — sends an XCM message to a destination"
    === "Parameters"
        - `dest` - the destination to which the XCM message will be sent
        - `message` - the XCM message to be sent

??? function "**teleportAssets**(dest, beneficiary, assets, feeAssetItem) — teleports assets from the local chain to a destination chain. This function is deprecated. Use `limitedTeleportAssets` instead"

??? function "**transferAssets**(dest, beneficiary, assets, feeAssetItem, weightLimit) — transfers assets from the local chain to a destination chain using reserve or teleport methods"
    === "Parameters"
           - `dest` - the destination context for the assets. Typically specified as:
               - `X2(Parent, Parachain(..))` for parachain to parachain transfers
               - `X1(Parachain(..))` for relay to parachain transfers
           - `beneficiary` - the recipient location in the context of the destination. Generally an `AccountId32` value
           - `assets` - the assets to be transferred. Must:
               - Have the same reserve location or be teleportable to destination (excluding fee assets)
               - Include assets for fee payment
           - `feeAssetItem` - the index in the `assets` array indicating which asset should be used to pay fees
           - `weightLimit` - the weight limit for XCM fee purchase on the destination chain. Can be defined as:
               - `Unlimited` - allows an unlimited amount of weight
               - `Limited` - specifies a maximum weight value

        The transfer behavior varies based on asset type:

           - **Local Reserve**: 
               - Transfers assets to destination chain's sovereign account
               - Sends XCM to mint and deposit reserve-based assets to beneficiary
           
           - **Destination Reserve**:
               - Burns local assets
               - Notifies destination to withdraw reserves from this chain's sovereign account
               - Deposits to beneficiary
           
           - **Remote Reserve**:
               - Burns local assets
               - Sends XCM to move reserves between sovereign accounts
               - Notifies destination to mint and deposit to beneficiary
           
           - **Teleport**:
               - Burns local assets
               - Sends XCM to mint/teleport assets and deposit to beneficiary

           As a reminder, the origin must be capable of both withdrawing the specified assets and executing XCM. If more weight is needed than specified in `weightLimit`, the operation will fail and teleported assets may be at risk


??? function "**transferAssetsUsingTypeAndThen**(dest, assets, assetsTransferType, remoteFeesId, feesTransferType, customXcmOnDest, weightLimit) — transfers assets with explicit transfer types and custom destination behavior"
    === "Parameters"
           - `dest` - the destination context for the assets. Can be specified as:
               - `[Parent, Parachain(..)]` for parachain to parachain transfers
               - `[Parachain(..)]` for relay to parachain transfers
               - `(parents: 2, (GlobalConsensus(..), ..))` for cross-bridge ecosystem transfers
           - `assets` - the assets to be transferred. Must either:
               - Have the same reserve location
               - Be teleportable to destination
           - `assetsTransferType` - specifies how the main assets should be transferred:
               - `LocalReserve` - transfers to sovereign account, mints at destination
               - `DestinationReserve` - burns locally, withdraws from sovereign account at destination
               - `RemoteReserve(reserve)` - burns locally, moves reserves through specified chain (typically Asset Hub)
               - `Teleport` - burns locally, mints/teleports at destination
           - `remoteFeesId` - specifies which of the included assets should be used for fee payment
           - `feesTransferType` - specifies how the fee payment asset should be transferred (same options as `assetsTransferType`)
           - `customXcmOnDest` - XCM instructions to execute on the destination chain as the final step. Typically used to:
               - Deposit assets to beneficiary: `Xcm(vec![DepositAsset { assets: Wild(AllCounted(assets.len())), beneficiary }])`
               - Or perform more complex operations with the transferred assets
           - `weightLimit` - the weight limit for XCM fee purchase on the destination chain. Can be defined as:
               - `Unlimited` - allows an unlimited amount of weight
               - `Limited` - specifies a maximum weight value


        A few reminders:

        - `BuyExecution` is used to purchase execution time using the specified `remoteFeesId` asset
        - Fee payment asset can use a different transfer type than the main assets
        - The origin must be capable of both withdrawing the specified assets and executing XCM
        - If more weight is needed than specified in `weightLimit`, the operation will fail and transferred assets may be at risk

### Storage Methods {: #storage-methods }

The X-Tokens Pallet includes the following read-only storage method:

???+ function "**assetTraps**(h256 hash) — returns the count of trapped assets for a given hash"
    === "Parameters"
        - `hash`: `H256` - The hash identifier for the asset trap. When an asset is trapped, a unique hash identifier is assigned to it. You can omit this field to return information about all assets trapped
    === "Returns"
        Returns a `U32` (unsigned 32-bit integer) representing the number of times an asset has been trapped at this hash location.
        ```js
        // Example return values showing hash → count mappings
        [
          [[0x0140f264543926e689aeefed15a8379f6e75a8c6884b0cef0832bb913a343b53], 1],
          [[0x0d14fd8859d8ff15dfe4d4002b402395129cdc4b69dea5575efa1dc205b96020], 425],
          [[0x166f82439fd2b25b28b82224e82ad9f26f2da26b8257e047182a6a7031accc9a], 3]
        ]
        ```
    === "Polkadot.js API Example"
        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/polkadot-xcm/asset-traps.js'
        ```

??? function "**queryCounter**() — the latest available query index"

    === "Parameters"

        None

    === "Returns"

        `u64` - The latest available query index

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/polkadot-xcm/query-counter.js'
        ```

??? function "**safeXcmVersion**() — default version to encode XCM when destination version is unknown"

    === "Parameters"

        None

    === "Returns"

        `u32` - default version to encode XCM when destination version is unknown

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/polkadot-xcm/safe-xcm-version.js'
        ```

??? function "**supportedVersion**(xcmVersion) — default version to encode XCM when destination version is unknown"

    === "Parameters"

        `xcmVersion` - `u32` - the latest XCM version that a known location supports. E.g. Enter `4` for XCM V4. 
        `xcmVersionedLocation` - Optionally, you can provide a multilocation that you wish to check. Otherwise you can omit this field and all known locations that support the provided xcmVersion will be returned. 

    === "Returns"

        `u32` - default version to encode XCM when destination version is unknown

    === "Polkadot.js API Example"

        ```js
        
        ```


??? function "supportedVersion(XcmVersion, MultiLocation) → Option<XcmVersion> — returns the supported XCM version for a given location"

=== "Parameters"
- version `u32`: XcmVersion - The version number to check
- location: MultiLocation - The location to check for version support

=== "Returns"
Returns a mapping of locations to their supported XCM versions. Each entry contains:
- A MultiLocation specifying the parachain location (including parent and interior information)
- An XcmVersion number indicating the supported version

=== "Polkadot.js API Example"



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
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/interface-examples/pallet-version.js'
        ```



### Pallet Constants {: #constants }

There are no constants part of the PolkadotXCM pallet.

## Building an XCM Message with the X-Tokens Pallet {: #build-xcm-xtokens-pallet}

This guide covers the process of building an XCM message using the X-Tokens Pallet, more specifically, with the `transfer` and `transferMultiasset` functions. Nevertheless, these two cases can be extrapolated to the other functions in the pallet, especially once you become familiar with multilocations.

!!! note
    Each parachain can allow and forbid specific methods from a pallet. Consequently, developers must ensure that they use methods that are allowed, or the transaction will fail with an error similar to `system.CallFiltered`.

You'll be transferring xcUNIT tokens, which are the [XC-20](/builders/interoperability/xcm/xc20/overview/){target=\_blank} representation of the Alphanet relay chain token, UNIT. You can adapt this guide for any other XC-20.

### Checking Prerequisites {: #xtokens-check-prerequisites}

To follow along with the examples in this guide, you need to have the following:

- An account with funds.
 --8<-- 'text/_common/faucet/faucet-list-item.md'
- Some xcUNIT tokens. You can swap DEV tokens (Moonbase Alpha's native token) for xcUNITs on [Moonbeam-Swap](https://moonbeam-swap.netlify.app/#/swap){target=\_blank}, a demo Uniswap-V2 clone on Moonbase Alpha

    !!! note
        You can adapt this guide to transfer another [external XC-20 or a local XC-20](/builders/interoperability/xcm/xc20/overview/){target=\_blank}. For external XC-20s, you'll need the asset ID and the number of decimals the asset has. For local XC-20s, you'll need the contract address.

    ![Moonbeam Swap xcUNIT](/images/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/xtokens-1.webp)

To check your xcUNIT balance, you can add the XC-20's [precompile address](/builders/interoperability/xcm/xc20/overview/#calculate-xc20-address){target=\_blank} to MetaMask with the following address:

```text
0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080
```

### Determining Weight Needed for XCM Execution {: #determining-weight }

To determine the weight needed for XCM execution on the destination chain, you'll need to know which XCM instructions are executed on the destination chain. You can find an overview of the XCM instructions used in the [XCM Instructions for Transfers via X-Tokens](/builders/interoperability/xcm/xc20/send-xc20s/overview/#xcm-instructions-for-asset-transfers){target=\_blank} guide.

In this example, where you're transferring xcUNIT from Moonbase Alpha to the Alphanet relay chain, the instructions that are executed on Alphanet are:

|                                                                                         Instruction                                                                                          |                          Ref Time                          |                          Proof Size                          |
|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------:|:------------------------------------------------------------:|
|   [`WithdrawAsset`](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/pallets/moonbeam-xcm-benchmarks/src/weights/fungible.rs#L35){target=\_blank}   |  {{ xcm.generic_weights.ref_time.deposit_asset.display }}  |  {{ xcm.generic_weights.proof_size.deposit_asset.display }}  |
|    [`ClearOrigin`](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/pallets/moonbeam-xcm-benchmarks/src/weights/generic.rs#L191){target=\_blank}    |  {{ xcm.generic_weights.ref_time.clear_origin.display }}   |          {{ xcm.generic_weights.proof_size.zero }}           |
| [`BuyExecution`](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/pallets/moonbeam-xcm-benchmarks/src/weights/generic.rs#L128-L129){target=\_blank} | {{ networks.alphanet.xcm_instructions.buy_exec.ref_time }} | {{ networks.alphanet.xcm_instructions.buy_exec.proof_size }} |
|   [`DepositAsset`](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/pallets/moonbeam-xcm-benchmarks/src/weights/fungible.rs#L60){target=\_blank}    |  {{ xcm.generic_weights.ref_time.deposit_asset.display }}  |  {{ xcm.generic_weights.proof_size.deposit_asset.display }}  |
|                                                                                          **TOTAL**                                                                                           | **{{ networks.alphanet.xcm_message.transfer.ref_time }}**  | **{{ networks.alphanet.xcm_message.transfer.proof_size }}**  |

!!! note
    Some weights include database reads and writes; for example, the `WithdrawAsset` and `DepositAsset` instructions include both one database read and one write. To get the total weight, you'll need to add the weight of any required database reads or writes to the base weight of the given instruction.

    For Westend-based relay chains, like Alphanet, you can get the weight cost for read and write database operations for [Rocks DB](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/constants/src/weights/rocksdb_weights.rs#L27-L31){target=\_blank} (which is the default database) in the [polkadot-sdk](https://github.com/paritytech/polkadot-sdk){target=\_blank} repository on GitHub.

Since Alphanet is a Westend-based relay chain, you can refer to the instruction weights defined in the [Westend runtime code](https://github.com/paritytech/polkadot-sdk/tree/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend){target=\_blank}, which are broken up into two types of instructions: [fungible](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs){target=\_blank} and [generic](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_generic.rs){target=\_blank}.

It's important to note that each chain defines its own weight requirements. To determine the weight required for each XCM instruction on a given chain, please refer to the chain's documentation or reach out to a member of their team. To learn how to find the weights required by Moonbeam, Polkadot, or Kusama, you can refer to our documentation on [Weights and Fees](/builders/interoperability/xcm/core-concepts/weights-fees/){target=\_blank}.

### X-Tokens Transfer Function {: #xtokens-transfer-function}

In this example, you'll build an XCM message to transfer xcUNIT from Moonbase Alpha back to the Alphanet relay chain through the `transfer` function of the X-Tokens Pallet using the [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=\_blank}.

Since you'll be interacting with the `transfer` function, you can take the following steps to gather the arguments for the `currencyId`, `amount`, `dest`, and `destWeightLimit`:

1. Define the `currencyId`. For external XC-20s, you'll use the `ForeignAsset` currency type and the asset ID of the asset, which in this case is `42259045809535163221576417993425387648`. For a local XC-20, you'll need the address of the token. In JavaScript, this translates to:

    === "External XC-20"

        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/transfer.js:9:13'
        ```

    === "Local XC-20"

        ```js
        const currencyId = { Erc20: { contractAddress: 'INSERT_ERC_20_ADDRESS' } };
        ```

2. Specify the `amount` to transfer. For this example, you are sending 1 xcUNIT, which has 12 decimals:

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/transfer.js:14:14'
    ```

3. Define the multilocation of the destination, which will target an account on the relay chain from Moonbase Alpha. Note that the only asset that the relay chain can receive is its own

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/transfer.js:15:20'
    ```

    !!! note
        For an `AccountId32`, `AccountIndex64`, or `AccountKey20`, you have the option of specifying a `network` parameter. If you don't specify one, it will default to `None`.

4. Set the `destWeightLimit`. Since the weight required to execute XCM messages varies for each chain, you can set the weight limit to be `Unlimited`, or if you have an estimate of the weight needed, you can use `Limited`, but please note that if set below the requirements, the execution may fail

    === "Unlimited"

        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/transfer.js:21:21'
        ```

    === "Limited"

        ```js
        const destWeightLimit = {
          Limited: {
            refTime: 'INSERT_ALLOWED_AMOUNT',
            proofSize: 'INSERT_ALLOWED_AMOUNT',
          },
        };
        ```
        
        As outlined in the [Determining Weight Needed for XCM Execution](#determining-weight) section, you'll need {{ networks.alphanet.xcm_message.transfer.weight.display }} weight units for the XCM execution on Alphanet. You can set the `refTime` to `{{ networks.alphanet.xcm_instructions.deposit_asset.total_weight.numbers_only }}`. The `proofSize` can be `0`, as the Alphanet relay chain does not currently account for `proofSize`.

Now that you have the values for each of the parameters, you can write the script for the transfer. You'll take the following steps:

 1. Provide the input data for the call. This includes:
     - The Moonbase Alpha endpoint URL to create the provider
     - The values for each of the parameters of the `transfer` function
 2. Create a Keyring instance that will be used to send the transaction
 3. Create the [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=\_blank} provider
 4. Craft the `xTokens.transfer` extrinsic with the `currencyId`, `amount`, `dest`, and `destWeightLimit`
 5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the second step

!!! remember
    This is for demo purposes only. Never store your private key in a JavaScript file.

```js
--8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/transfer.js'
```

!!! note
    You can view an example of the above script, which sends 1 xcUNIT to Alice's account on the relay chain, on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x1e00018080778c30c20fa2ebc0ed18d2cbca1f0010a5d4e8000000000000000000000004010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d6700){target=\_blank} using the following encoded calldata: `0x1e00018080778c30c20fa2ebc0ed18d2cbca1f0010a5d4e8000000000000000000000004010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d6700`.

Once the transaction is processed, the target account on the relay chain should have received the transferred amount minus a small fee that is deducted to execute the XCM on the destination chain.

### X-Tokens Transfer Multiasset Function {: #xtokens-transfer-multiasset-function}

In this example, you'll build an XCM message to transfer xcUNIT from Moonbase Alpha back to the Alphanet relay chain using the `transferMultiasset` function of the X-Tokens Pallet.

Since you'll be interacting with the `transferMultiasset` function, you can take the following steps to gather the arguments for the `asset`, `dest`, and `destWeightLimit`:

1. Define the XCM asset multilocation of the `asset`, which will target UNIT tokens in the relay chain from Moonbase Alpha as the origin. Each chain sees its own asset differently. Therefore, you will have to set a different asset multilocation for each destination

    === "External XC-20"

        ```js
        // Multilocation for UNIT in the relay chain
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/transfer-multiasset.js:9:19'
        ```

    === "Local XC-20"

        ```js
        // Multilocation for a local XC-20 on Moonbeam
        const asset = {
          V4: {
            id: {
              parents: 0,
              interior: {
                X2: [
                  { PalletInstance: 48 },
                  { AccountKey20: { key: 'INSERT_ERC_20_ADDRESS' } },
                ],
              },
            },
            fun: {
              Fungible: { Fungible: 1000000000000000000n }, // 1 token
            },
          },
        };
        ```

        For information on the default gas limit for local XC-20 transfers and how to override the default, please refer to the following section: [Override Local XC-20 Gas Limits](#override-local-xc20-gas-limits).

2. Define the XCM destination multilocation of the `dest`, which will target an account in the relay chain from Moonbase Alpha as the origin:

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/transfer-multiasset.js:20:25'
    ```

    !!! note
        For an `AccountId32`, `AccountIndex64`, or `AccountKey20`, you have the option of specifying a `network` parameter. If you don't specify one, it will default to `None`.

3. Set the `destWeightLimit`. Since the weight required to execute XCM messages varies for each chain, you can set the weight limit to be `Unlimited`, or if you have an estimate of the weight needed, you can use `Limited`, but please note that if set below the requirements, the execution may fail

    === "Unlimited"

        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/transfer-multiasset.js:26:26'
        ```

    === "Limited"

        ```js
        const destWeightLimit = {
          Limited: {
            refTime: 'INSERT_ALLOWED_AMOUNT',
            proofSize: 'INSERT_ALLOWED_AMOUNT',
          },
        };
        ```
        
        As outlined in the [Determining Weight Needed for XCM Execution](#determining-weight) section, you'll need {{ networks.alphanet.xcm_message.transfer.weight.display }} weight units for the XCM execution on Alphanet. You can set the `refTime` to `{{ networks.alphanet.xcm_instructions.deposit_asset.total_weight.numbers_only }}`. The `proofSize` can be `0`, as the Alphanet relay chain does not currently account for `proofSize`.

Now that you have the values for each of the parameters, you can write the script for the transfer. You'll take the following steps:

 1. Provide the input data for the call. This includes:
     - The Moonbase Alpha endpoint URL to create the provider
     - The values for each of the parameters of the `transferMultiasset` function
 2. Create a Keyring instance that will be used to send the transaction
 3. Create the [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=\_blank} provider
 4. Craft the `xTokens.transferMultiasset` extrinsic with the `asset`, `dest`, and `destWeightLimit`
 5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the second step

!!! remember
    This is for demo purposes only. Never store your private key in a JavaScript file.

```js
--8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/transfer-multiasset.js'
```

!!! note
    You can view an example of the above script, which sends 1 xcUNIT to Alice's account on the relay chain, on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x1e0104010000070010a5d4e804010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d6700){target=\_blank} using the following encoded calldata: `0x1e0104010000070010a5d4e804010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d6700`.

Once the transaction is processed, the account on the relay chain should have received the transferred amount minus a small fee that is deducted to execute the XCM on the destination chain.

#### Override Local XC-20 Gas Limits {: #override-local-xc20-gas-limits }

If you are transferring a local XC-20, the default units of gas are as follows for each network:

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.erc20_xcm.transfer_gas_limit }}
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.erc20_xcm.transfer_gas_limit }}
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.erc20_xcm.transfer_gas_limit }}
    ```

You can override the default gas limit using an additional junction when you create the multilocation for the local XC-20. To do so, you'll need to use the `GeneralKey` junction, which accepts two arguments: `data` and `length`.

For example, to set the gas limit to `300000`, you'll need to set the `length` to `32`, and for the `data`, you'll need to pass in `gas_limit: 300000`. However, you can't simply pass in the value for `data` in text; you'll need to properly format it to a 32-byte zero-padded hex string, where the value for the gas limit is in little-endian format. To properly format the `data`, you can take the following steps:

1. Convert `gas_limit:` to its byte representation
2. Convert the value for the gas limit into its little-endian byte representation
3. Concatenate the two-byte representations into a single value padded to 32 bytes
4. Convert the bytes to a hex string

Using the `@polkadot/util` library, these steps are as follows:

```js
--8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/override-gas-limit.js'
```

The following is an example of a multilocation with the gas limit set to `300000`:

```js
--8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/override-gas-limit-multilocation.js'
```
