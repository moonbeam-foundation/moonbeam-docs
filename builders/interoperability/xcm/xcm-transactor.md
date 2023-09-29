---
title: Remote Execution Through XCM
description: Learn how to perform remote XCM execution from Moonbeam to other chains in the ecosystem using the XCM Transactor Pallet and XCM Transactor Precompile.
---

# Using the XCM Transactor Pallet for Remote Executions

## Introduction {: #introduction }

XCM messages are comprised of a [series of instructions](/builders/interoperability/xcm/overview/#xcm-instructions){target=_blank} that are executed by the Cross-Consensus Virtual Machine (XCVM). Combinations of these instructions result in predetermined actions such as cross-chain token transfers and, more interestingly, remote cross-chain execution.

Nevertheless, building an XCM message from scratch is somewhat tricky. Moreover, XCM messages are sent to other participants in the ecosystem from the root account (that is, SUDO or through a democratic vote), which is not ideal for projects that want to leverage remote cross-chain calls via a simple transaction.

To overcome these issues, developers can leverage wrapper functions/pallets to use XCM features on Polkadot/Kusama, such as the [XCM Transactor Pallet](https://github.com/moonbeam-foundation/moonbeam/blob/master/pallets/xcm-transactor/src/lib.rs){target=_blank}. In that aspect, the XCM Transactor Pallet allows users to perform remote cross-chain calls through a simple transaction in the origin chain.

The two main extrinsics of the pallet allow transacting on a remote chain either through the sovereign account (which should only be allowed through governance) or through a [computed origin](#general-xcm-definitions) on the destination chain. Separate extrinsics are provided for each case.

This guide will show you how to use the XCM Transactor Pallet to send XCM messages from a Moonbeam-based network to other chains in the ecosystem (relay chain/parachains). In addition, you'll also learn how to use the XCM Transactor Precompile to perform the same actions via the Ethereum API.

**Note that there are still limitations in what you can remotely execute through XCM messages**.

**Developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

## XCM Instructions For Remote Execution {: #xcm-instructions-for-remote-execution }

The relevant [XCM instructions](/builders/interoperability/xcm/overview/#xcm-instructions) to perform remote execution through XCM are, but not limited to:

 - [`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} - gets executed in the target chain. Mutates the origin that will be used for executing the subsequent XCM instructions
 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - gets executed in the target chain. Removes assets and places them into the holding register
 - [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - gets executed in the target chain. Takes the assets from holding to pay for execution fees. The fees to pay are determined by the target chain
 - [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} - gets executed in the target chain. Dispatches the encoded call data from a given origin

When the XCM message built by the XCM Transactor Pallet is executed, fees must be paid. All the relevant information can be found in the [XCM Transactor Fees section](/builders/interoperability/xcm/fees/#xcm-transactor-fees){target=_blank} of the [XCM Fees](/builders/interoperability/xcm/fees/){target=_blank} page.

## Relevant XCM Definitions {: #general-xcm-definitions }

 --8<-- 'text/builders/interoperability/xcm/general-xcm-definitions2.md'

 - **Computed origin** —  an account computed when executing the XCM, set by the [Descend Origin](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} XCM instruction and the provided multilocation, which is typically the sovereign account from which the XCM originated. Computed origins are keyless (the private key is unknown). Consequently, computed origins can only be accessed through XCM extrinsics.

     The XCM call [origin conversion](https://github.com/paritytech/polkadot-sdk/blob/polkadot-v1.1.0/polkadot/xcm/xcm-executor/src/lib.rs#L556){target=_blank} happens when the `Transact` instruction gets executed. The new origin is the one that pays for the fees for XCM execution.

     Moonbeam-based networks follow [the computed origins standard set by Polkadot](https://github.com/paritytech/polkadot-sdk/blob/master/polkadot/xcm/xcm-builder/src/location_conversion.rs){target=_blank}, that is, through a `blake2` hash of a data structure that depends on the origin of the XCM message. However, because Moonbeam uses Ethereum-styled accounts, computed origins are truncated to 20 bytes

 - **Transact information** — relates to extra weight and fee information for the XCM remote execution part of the XCM Transactor extrinsic. This is needed because the XCM transaction fee is paid by the sovereign account. Therefore, XCM Transactor calculates what this fee is and charges the sender of the XCM Transactor extrinsic the estimated amount in the corresponding [XC-20 token](/builders/interoperability/xcm/xc20/overview/){target=_blank} to repay the sovereign account

## XCM Transactor Pallet Interface {: #xcm-transactor-pallet-interface}

### Extrinsics {: #extrinsics }

The XCM Transactor Pallet provides the following extrinsics (functions):

 - **hrmpManage**(action, fee, weightInfo) - manages HRMP operations related to opening, accepting, and closing an HRMP channel. The given action can be any of these four actions: `InitOpen`, `Accept`, `Close`, and `Cancel`
 - **removeFeePerSecond**(assetLocation) — remove the fee per second information for a given asset in its reserve chain. The asset is defined as a multilocation
 - **removeTransactInfo**(location) — remove the transact information for a given chain, defined as a multilocation
 - **setFeePerSecond**(assetLocation, feePerSecond) — sets the fee per second information for a given asset on its reserve chain. The asset is defined as a multilocation. The `feePerSecond` is the token units per second of XCM execution that will be charged to the sender of the XCM Transactor extrinsic
 - **setTransactInfo**(location, transactExtraWeight, maxWeight) — sets the transact information for a given chain, defined as a multilocation. The transact information includes:
     - **transactExtraWeight** — weight to cover execution fees of the XCM instructions (`WithdrawAsset`, `BuyExecution`, and `Transact`), which is estimated to be at least 10% over what the remote XCM instructions execution uses 
     - **maxWeight** — maximum weight units allowed for the remote XCM execution
     - **transactExtraWeightSigned** — (optional) weight to cover execution fees of the XCM instructions (`DescendOrigin`, `WithdrawAsset`, `BuyExecution`, and `Transact`), which is estimated to be at least 10% over what the remote XCM instructions execution uses 
 - **transactThroughSigned**(destination, fee, call, weightInfo) — sends an XCM message with instructions to remotely execute a given call in the given destination. The remote call will be signed and executed by a new account that the destination parachain must compute. Moonbeam-based networks follow [the computed origins standard set by Polkadot](https://github.com/paritytech/polkadot-sdk/blob/master/polkadot/xcm/xcm-builder/src/location_conversion.rs){target=_blank}. The extrinsic provides different mechanisms to define the fee and weight
 - **transactThroughSovereign**(destination, feePayer, fee, call, originKind, weightInfo) — sends an XCM message with instructions to remotely execute a given call in the given destination. The remote call will be signed by the origin parachain sovereign account (who pays the fees), but the transaction is dispatched from a given origin. The XCM Transactor Pallet calculates the fees for the remote execution and charges the given account the estimated amount in the corresponding [XC-20 token](/builders/interoperability/xcm/xc20/overview/){target=_blank} given by the asset multilocation

Where the inputs that need to be provided can be defined as:

 - **assetLocation** — a multilocation representing an asset on its reserve chain. The value is used to set or retrieve the fee per second information
 - **location** — a multilocation representing a chain in the ecosystem. The value is used to set or retrieve the transact information
 - **destination** — a multilocation representing a chain in the ecosystem where the XCM message is being sent to
 - **fee** — an enum that provides developers two options on how to define the XCM execution fee item. Both options rely on the `feeAmount`, which is the units of the asset per second of XCM execution you provide to execute the XCM message you are sending. The two different ways to set the fee item are: 
     - **AsCurrencyID** — is the ID of the currency being used to pay for the remote call execution. Different runtimes have different ways of defining the IDs. In the case of Moonbeam-based networks, `SelfReserve` refers to the native token, `ForeignAsset` refers to the asset ID of an [external XC-20](/builders/interoperability/xcm/xc20/overview#external-xc20s){target=_blank} (not to be confused with the XC-20 address), and `Erc20` refers to the contract address of a [local XC-20](/builders/interoperability/xcm/xc20/overview#local-xc20s){target=_blank}
     - **AsMultiLocation** — is the multilocation that represents the asset to be used for fee payment when executing the XCM
 - **innerCall** — encoded call data of the call that will be executed in the destination chain. This is wrapped with the `asDerivative` option if transacting through the sovereign derivative account
 - **weightInfo** — a structure that contains all the weight related information. If not enough weight is provided, the execution of the XCM will fail, and funds might get locked in either the sovereign account or a special pallet. Consequently, **it is essential to correctly set the destination weight to avoid failed XCM executions**. The structure contains two fields:
     - **transactRequiredWeightAtMost** — weight related to the execution of the `Transact` call itself. For transacts through sovereign-derivative, you have to take into account the weight of the `asDerivative` extrinsic as well. However, this does not include the cost (in weight) of all the XCM instructions
     - **overallWeight** — the total weight the XCM Transactor extrinsic can use. This includes all the XCM instructions plus the weight of the call itself (**transactRequiredWeightAtMost**)
 - **call** — similar to `innerCall`, but it is not wrapped with the `asDerivative` extrinsic
 - **feePayer** — the address that will pay for the remote XCM execution in the transact through sovereign extrinsic. The fee is charged in the corresponding [XC-20 token](/builders/interoperability/xcm/xc20/overview/){target=_blank}
 - **originKind** — dispatcher of the remote call in the destination chain. There are [four types of dispatchers](https://github.com/paritytech/polkadot-sdk/blob/master/polkadot/xcm/src/v2/mod.rs#L84){target=_blank} available

### Storage Methods {: #storage-methods }

The XCM Transactor Pallet includes the following read-only storage method:

 - **destinationAssetFeePerSecond**() - returns the fee per second for an asset given a multilocation. This enables the conversion from weight to fee. The storage element is read by the pallet extrinsics if `feeAmount` is set to `None`
 - **palletVersion**() — returns current pallet version from storage
 - **transactInfoWithWeightLimit**(location) — returns the transact information for a given multilocation. The storage element is read by the pallet extrinsics if `feeAmount` is set to `None`

### Pallet Constants {: #constants }

The XCM Transactor Pallet includes the following read-only functions to obtain pallet constants:

- **baseXcmWeight**() - returns the base XCM weight required for execution, per XCM instruction
- **selfLocation**() - returns the multilocation of the chain

## XCM Transactor Transact Through Signed {: #xcmtransactor-transact-through-signed }

This section covers building an XCM message for remote executions using the XCM Transactor Pallet, specifically with the `transactThroughSigned` function. However, you'll not be able to follow along as the destination parachain is not publicly available.

!!! note
    You need to ensure that the call you are going to execute remotely is allowed in the destination chain!

### Checking Prerequisites {: #xcmtransactor-signed-check-prerequisites }

To be able to send the extrinsics in this section, you need to have:

 - An account in the origin chain with [funds](/builders/get-started/networks/moonbase/#get-tokens){target=_blank}
 - Funds in the computed origin on the target chain. You can calculate this address by using the [`calculate-multilocation-derivative-account.ts` script](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/calculate-multilocation-derivative-account.ts){target=_blank}

For this example, the following accounts will be used:

 - Alice's account in the origin parachain with address `0x44236223aB4291b93EEd10E4B511B37a398DEE55`
 - Her computed origin address in the target parachain is `0x5c27c4bb7047083420eddff9cddac4a0a120b45c`

### Building the XCM {: #xcm-transact-through-signed }

Since you'll be interacting with the `transactThroughSigned` function of the XCM Transactor Pallet, you'll need to assemble the `dest`, `fee`, `call`, and `weightInfo` parameters. To do so, you can take the following steps:

1. Define the destination multilocation, which will target parachain 888:

    ```js
    const dest = {
      V3: {
        parents: 1,
        interior: { X1: { Parachain: 888 } },
      },
    };
    ```
  
2. Define the `fee` information, which will require you to:
    - Define the currency ID and provide the asset details
    - Set the fee amount

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

3. Define the `call` that will be executed in the destination chain. This is the encoded call data of the pallet, method, and input values to be called. It can be constructed in [Polkadot.js Apps](https://polkadot.js.org/apps/){target=_blank} (must be connected to the destination chain) or using the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}. For this example, the inner call is a simple balance transfer of 1 token of the destination chain to Alice's account there:

    ```js
    const call =
      '0x030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d';
    ```

4. Set the `weightInfo`, which includes the weight specific to the inner call (`transactRequiredWeightAtMost`) and the optional overall weight of the transact plus XCM execution (`overallWeight`). Both weight parameters require you to specify `refTime` and `proofSize`, where `refTime` is the amount of computational time that can be used for execution and `proofSize` is the amount of storage in bytes that can be used. For each parameter, you can follow these guidelines:
    - For `transactRequiredAtMost`, the weight does not include the weight of the XCM instructions. For this example, set `refTime` to `1000000000` weight units and `proofSize` to `40000`
    - For `overallWeight`, the value must be the total of **transactRequiredWeightAtMost** plus the weight needed to cover the XCM instructions execution costs in the destination chain. If you do not provide this value, the pallet will use the element in storage (if exists), and add it to **transactRequiredWeightAtMost**. For this example, set `refTime` to `2000000000` weight units and `proofSize` to `50000`

    ```js
    const weightInfo = {
      transactRequiredWeightAtMost: { refTime: 1000000000n, proofSize: 40000n },
      overallWeight: { refTime: 2000000000n, proofSize: 50000n },
    };
    ```

    !!! note
        For accurate estimates of the `refTime` and `proofSize` figures for `transactRequiredAtMost`, you can use the [`paymentInfo` method of the Polkadot.js API](/builders/interoperability/xcm/remote-evm-calls/#build-xcm-remote-evm){target=_blank} as described in the [Remote EVM Calls guide](/builders/interoperability/xcm/remote-evm-calls/#estimate-weight-required-at-most){target=_blank}.

Now that you have the values for each of the parameters, you can write the script for the transaction. You'll take the following steps:

 1. Provide the input data for the call. This includes:
     - The Moonbase Alpha endpoint URL to create the provider
     - The values for each of the parameters of the `transactThroughSigned` function
 2. Create a Keyring instance that will be used to send the transaction
 3. Create the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank} provider
 4. Craft the `xcmTransactor.transactThroughSigned` extrinsic with the `dest`, `fee`, `call` and `weightInfo` values
 5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the second step

!!! remember
    This is for demo purposes only. Never store your private key in a JavaScript file.

```js
--8<-- 'code/builders/interoperability/xcm/xcm-transactor/transact-signed.js'
```

!!! note
    You can view an example of the above script, which sends 1 xcUNIT to Alice's account on the relay chain, on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x210603010100e10d00017576e5e612ff054915d426c546b1b21a010000c52ebca2b10000000000000000007c030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d02286bee02710200010300943577420d0300){target=_blank} using the following encoded calldata: `0x210603010100e10d00017576e5e612ff054915d426c546b1b21a010000c52ebca2b10000000000000000007c030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d02286bee02710200010300943577420d0300`.

Once the transaction is processed, Alice should've received one token in her address on the destination chain.

## XCM Transactor Precompile {: #xcmtransactor-precompile }

The XCM Transactor Precompile contract allows developers to access the XCM Transactor Pallet features through the Ethereum API of Moonbeam-based networks. There are several versions of the XCM Transactor Precompile. **V1 will be deprecated in the near future**, so all implementations must migrate to the newer interfaces. V3 is currently only available on Moonbase Alpha. The XCM Transactor Precompiles are located at the following addresses:

=== "Moonbeam"

    | Version |                                Address                                 |
    |:-------:|:----------------------------------------------------------------------:|
    |   V1    | <pre>```{{ networks.moonbeam.precompiles.xcm_transactor_v1 }}```</pre> |
    |   V2    | <pre>```{{ networks.moonbeam.precompiles.xcm_transactor_v2 }}```</pre> |
    |   V3    |                             Not available                              |

=== "Moonriver"
    | Version |                                 Address                                 |
    |:-------:|:-----------------------------------------------------------------------:|
    |   V1    | <pre>```{{ networks.moonriver.precompiles.xcm_transactor_v1 }}```</pre> |
    |   V2    | <pre>```{{ networks.moonriver.precompiles.xcm_transactor_v2 }}```</pre> |
    |   V3    |                              Not available                              |

=== "Moonbase Alpha"

    | Version |                                Address                                 |
    |:-------:|:----------------------------------------------------------------------:|
    |   V1    | <pre>```{{ networks.moonbase.precompiles.xcm_transactor_v1 }}```</pre> |
    |   V2    | <pre>```{{ networks.moonbase.precompiles.xcm_transactor_v2 }}```</pre> |
    |   V3    | <pre>```{{ networks.moonbase.precompiles.xcm_transactor_v3 }}```</pre> |

--8<-- 'text/builders/pallet-precompiles/precompiles/security.md'

### The XCM Transactor Solidity Interface {: #xcmtrasactor-solidity-interface }

The XCM Transactor Precompile is a Solidity interface through which developers can interact with the XCM Transactor Pallet using the Ethereum API.

??? code "XcmTransactorV1.sol"

    ```solidity
    --8<-- 'code/precompiles/xcm-transactor/XcmTransactorV1.sol'
    ```

??? code "XcmTransactorV2.sol"

    ```solidity
    --8<-- 'code/precompiles/xcm-transactor/XcmTransactorV2.sol'
    ```

??? code "XcmTransactorV3.sol"

    ```solidity
    --8<-- 'code/precompiles/xcm-transactor/XcmTransactorV3.sol'
    ```

!!! note
    The [XCM Transactor Precompile V1](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v1/XcmTransactorV1.sol){target=_blank} will be deprecated in the near future, so all implementations must migrate to the newer interfaces.

The interface varies slightly from version to version. You can find an overview of each version's interface below.

=== "V2"

    The V2 interface includes the following functions:

    - **indexToAccount**(*uint16* index) — read-only function that returns the registered address authorized to operate using a derivative account of the Moonbeam-based network sovereign account for the given index
    - **transactInfoWithSigned**(*Multilocation* *memory* multilocation) — read-only function that, for a given chain defined as a multilocation, returns the transact information considering the three XCM instructions associated with the external call execution (`transactExtraWeight`). It also returns extra weight information associated with the `DescendOrigin` XCM instruction for the transact through signed extrinsic (`transactExtraWeightSigned`)
    - **feePerSecond**(*Multilocation* *memory* multilocation) — read-only function that, for a given asset as a multilocation, returns units of token per second of the XCM execution that is charged as the XCM execution fee. This is useful when, for a given chain, there are multiple assets that can be used for fee payment
    - **transactThroughSignedMultilocation**(*Multilocation* *memory* dest, *Multilocation* *memory* feeLocation, *uint64* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *uint64* overallWeight) — function that represents the `transactThroughSigned` method described in the [previous example](#xcmtransactor-transact-through-signed), setting the **fee** type to **AsMultiLocation**. You need to provide the asset multilocation of the token that is used for fee payment instead of the XC-20 token `address`
    - **transactThroughSigned**(*Multilocation* *memory* dest, *address* feeLocationAddress, *uint64* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *uint64* overallWeight) — function that represents the `transactThroughSigned` method described in the [previous example](#xcmtransactor-transact-through-signed), setting the **fee** type to **AsCurrencyId**.  Instead of the asset ID, you'll need to provide the [asset XC-20 address](/builders/interoperability/xcm/xc20/overview/#current-xc20-assets){target=_blank} of the token that is used for fee payment
    - **encodeUtilityAsDerivative**(*uint8* transactor, *uint16* index, *bytes memory* innerCall) - encodes an `asDerivative` wrapped call given the transactor to be used, the index of the derivative account, and the inner call to be executed from the derivated address

=== "V3 (Moonbase Alpha only)"

    The V3 interface adds support for Weights V2, which updates the `Weight` type to represent proof size in addition to computational time. As such, this requires that `refTime` and `proofSize` be defined, where `refTime` is the amount of computational time that can be used for execution and `proofSize` is the amount of storage in bytes that can be used. 
    
    The following struct was added to the XCM Transactor Precompile to support Weights V2:

    ```solidity
    struct Weight {
        uint64 refTime;
        uint65 proofSize;
    }
    ```

    Additionally, support for the `RefundSurplus` and `DepositAsset` instructions was added. To append the `RefundSurplus` instruction to the XCM message, you can use the `refund` parameter, which will refund any leftover funds not used for the `Transact` if set to `true`.

    The V3 interface includes the following functions:

    - **indexToAccount**(*uint16* index) — read-only function that returns the registered address authorized to operate using a derivative account of the Moonbeam-based network sovereign account for the given index
    - **transactInfoWithSigned**(*Multilocation* *memory* multilocation) — read-only function that, for a given chain defined as a multilocation, returns the transact information considering the three XCM instructions associated with the external call execution (`transactExtraWeight`). It also returns extra weight information associated with the `DescendOrigin` XCM instruction for the transact through signed extrinsic (`transactExtraWeightSigned`)
    - **feePerSecond**(*Multilocation* *memory* multilocation) — read-only function that, for a given asset as a multilocation, returns units of token per second of the XCM execution that is charged as the XCM execution fee. This is useful when, for a given chain, there are multiple assets that can be used for fee payment
    - **transactThroughSignedMultilocation**(*Multilocation* *memory* dest, *Multilocation* *memory* feeLocation, *Weight* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *Weight* overallWeight, *bool* refund) — function that represents the `transactThroughSigned` method described in the [previous example](#xcmtransactor-transact-through-signed), setting the **fee** type to **AsMultiLocation**. You need to provide the asset multilocation of the token that is used for fee payment instead of the XC-20 token `address`
    - **transactThroughSigned**(*Multilocation* *memory* dest, *address* feeLocationAddress, *Weight* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *Weight* overallWeight, *bool* refund) — function that represents the `transactThroughSigned` method described in the [previous example](#xcmtransactor-transact-through-signed), setting the **fee** type to **AsCurrencyId**.  Instead of the asset ID, you'll need to provide the [asset XC-20 address](/builders/interoperability/xcm/xc20/overview/#current-xc20-assets){target=_blank} of the token that is used for fee payment
    - **encodeUtilityAsDerivative**(*uint8* transactor, *uint16* index, *bytes memory* innerCall) - encodes an `asDerivative` wrapped call given the transactor to be used, the index of the derivative account, and the inner call to be executed from the derivated address

### Building the Precompile Multilocation {: #building-the-precompile-multilocation }

In the XCM Transactor Precompile interface, the `Multilocation` structure is defined as follows:

--8<-- 'text/builders/interoperability/xcm/xcm-precompile-multilocation.md'

The following code snippet goes through some examples of `Multilocation` structures, as they would need to be fed into the XCM Transactor Precompile functions:

```js
// Multilocation targeting the relay chain asset from a parachain
{
    1, // parents = 1
    [] // interior = here
}

// Multilocation targeting Moonbase Alpha DEV token from another parachain
{
    1, // parents = 1
    // Size of array is 2, meaning is an X2 interior
    [
        "0x00000003E8", // Selector Parachain, ID = 1000 (Moonbase Alpha)
        "0x0403" // Pallet Instance = 3
    ]
}

// Multilocation targeting aUSD asset on Acala
{
    1, // parents = 1
    // Size of array is 1, meaning is an X1 interior
    [
        "0x00000007D0", // Selector Parachain, ID = 2000 (Acala)
        "0x060001" // General Key Selector + Asset Key
    ]
}
```
