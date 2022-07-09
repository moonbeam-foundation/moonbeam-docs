---
title: Remote Execution Through XCM
description: How to do remote XCM calls in other chains using the XCM-Transactor pallet. The XCM-Transactor precompile enables access to core functions via the Ethereum API.
---

# Using the XCM-Transactor Pallet for Remote Executions

![XCM-Transactor Precompile Contracts Banner](/images/builders/xcm/xcm-transactor/xcmtransactor-banner.png)

## Introduction {: #introduction}

XCM messages are comprised of a [series of instructions](/builders/xcm/overview/#xcm-instructions){target=_blank} that are executed by the Cross-Consensus Virtual Machine (XCVM). Combinations of these instructions result in predetermined actions such as cross-chain token transfers and, more interestingly, remote cross-chain execution.

Nevertheless, building an XCM message from scratch is somewhat tricky. Moreover, XCM messages are sent to other participants in the ecosystem from the root account (that is, SUDO or through a democratic vote), which is not ideal for projects that want to leverage remote cross-chain calls via a simple transaction. 

To overcome these issues, developers can leverage wrapper functions/pallets to use XCM features on Polkadot/Kusama, such as the [XCM-transactor pallet](https://github.com/PureStake/moonbeam/blob/master/pallets/xcm-transactor/src/lib.rs){target=_blank}. In addition, the XCM-transactor pallet allows users to perform remote cross-chain calls from an account derivated from the sovereign account (called derivative account), so that they can be easily executed with a simple transaction.

This guide will show you how to use the XCM-transactor pallet to send XCM messages from a Moonbeam-based network to other chains in the ecosystem (relay chain/parachains). In addition, you'll also learn how to use the XCM-transactor precompile to perform the same actions via the Ethereum API. 

**Note that there are still limitations in what you can remotely execute through XCM messages**.

**Developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

## Relevant XCM Definitions {: #general-xcm-definitions }

--8<-- 'text/xcm/general-xcm-definitions2.md'

 - **Derivative account** — an account derivated from another account using a simple index. The derivation is done by calculating the Blake2 hash of `modlpy/utilisuba` + `originalAddress` + `index`. Because the private key of this account is unknown, transactions must be initiated with the `utility.asDerivative` method. When transacting through the derivative account, transaction fees are paid by the origin account, but the transaction is dispatched from the derivative account. For example, Alice has a derivative account with an index `0`. If she transfers any balance using the `asDerivative` function, Alice would still pay for transaction fees, but the funds being transferred will be withdrawn from the derivative account at index `0`. You can use a [script to calculate the derivative account](https://github.com/albertov19/PolkaTools/blob/main/calculateDerivedAddress.ts){target=_blank}

 - **Transact information** — relates to extra weight and fee information for the XCM remote execution part of the XCM-transactor extrinsic. This is needed because the XCM transaction fee is paid by the sovereign account. Therefore, XCM-transactor calculates what this fee is, and charges the sender of the XCM-transactor extrinsic the estimated amount in the corresponding [XC-20 token](/builders/xcm/xc20/overview/){target=_blank}, to repay the sovereign account

## XCM-Transactor Pallet Interface {: #xcm-transactor-pallet-interface}

### Extrinsics {: #extrinsics }

The XCM-transactor pallet provides the following extrinsics (functions):

 - **deregister**(index) — deregisters a derivative account for a given index. This prevents the previously registered account from using a derivative address for remote execution. This extrinsic is only callable by *root*, for example, through a democracy proposal
 - **register**(address, index) — registers a given address as a derivative account at a given index. This extrinsic is only callable by *root*, for example, through a democracy proposal
 - **removeTransactInfo**(location) — remove the transact information for a given chain, defined as a multilocation
 - **setTransactInfo**(location, transactExtraWeight, feePerSecond, maxWeight) — sets the transact information for a given chain, defined as a multilocation. The transact information includes:
     - **transactExtraWeight** — which is estimated to be at least 10% over what the remote XCM instructions execution uses (`WithdrawAsset`, `BuyExecution`, and `Transact`)
     - **feePerSecond** — it is the token units per second of XCM execution that will be charged to the sender of the XCM-transactor extrinsic
     - **maxWeight** — maximum weight units allowed for the remote XCM execution
 - **transactThroughDerivative**(destination, index, currencyID, destWeight, innerCall) — sends an XCM message with instructions to remotely execute a given call in the given destination (wrapped with the `asDerivative` option). The remote call will be signed by the origin parachain sovereign account (who pays the fees), but the transaction is dispatched from the sovereign's derivative account for the given index. The XCM-transactor pallet calculates the fees for the remote execution and charges the sender of the extrinsic the estimated amount in the corresponding [XC-20 token](/builders/xcm/xc20/overview/){target=_blank} given by the asset ID
 - **transactThroughDerivativeMultilocation**(destination, index, feeLocation, destWeight, innerCall) — same as `transactThroughDerivative`, but the remote execution fees are charged in the corresponding [XC-20 token](/builders/xcm/xc20/overview/){target=_blank} given by the asset multilocation
 - **transactThroughSovereign**(destination, feePayer, feeLocation, destWeight, call, originKind) — sends an XCM message with instructions to remotely execute a given call in the given destination. The remote call will be signed by the origin parachain sovereign account (who pays the fees), but the transaction is dispatched from a given origin. The XCM-transactor pallet calculates the fees for the remote execution and charges the given account the estimated amount in the corresponding [XC-20 token](/builders/xcm/xc20/overview/){target=_blank} given by the asset multilocation

Where the inputs that need to be provided can be defined as:

 - **index** — value to be used to calculate the derivative account. In the context of the XCM-transactor pallet, this is a derivative account of the parachain sovereign account in another chain
 - **location** — a multilocation representing a chain in the ecosystem. The value is used to set or retrieve the transact information
 - **destination** — a multilocation representing a chain in the ecosystem where the XCM message is being sent to
 - **currencyID** — the ID of the currency being used to pay for the remote call execution. Different runtimes have different ways of defining the IDs. In the case of Moonbeam-based networks, `SelfReserve` refers to the native token, and `ForeignAsset` refers to the asset ID of the XC-20 (not to be confused with the XC-20 address)
 - **destWeight** — the maximum amount of execution time you want to provide in the destination chain to execute the XCM message being sent. If not enough weight is provided, the execution of the XCM will fail, and funds might get locked in either the sovereign account or a special pallet. For transacts through derivative, you have to take into account the `asDerivative` extrinsic as well, but the XCM-transactor pallet adds the weight for the XCM instructions with the transact information set before. **It is essential to correctly set the destination weight to avoid failed XCM executions**
 - **innerCall** — encoded call data of the call that will be executed in the destination chain. This is wrapped with the `asDerivative` option if transacting through the derivative account
 - **feeLocation** — a multilocation representing the currency being used to pay for the remote call execution
 - **feePayer** — the address that will pay for the remote XCM execution in the transact through sovereign extrinsic. The fee is charged in the corresponding [XC-20 token](/builders/xcm/xc20/overview/){target=_blank}
 - **call** — similar to `innerCall`, but it is not wrapped with the `asDerivative` extrinsic
 - **originKind** — dispatcher of the remote call in the destination chain. There are [four types of dispatchers](https://github.com/paritytech/polkadot/blob/0a34022e31c85001f871bb4067b7d5f5cab91207/xcm/src/v0/mod.rs#L60){target=_blank} available


### Storage Methods {: #storage-methods }

The XCM-transactor pallet includes the following read-only storage method:

 - **destinationAssetFeePerSecond**() - returns the fee per second for an asset given a multilocation. This enables conversion from weight to fee
 - **indexToAccount**(index) — returns the origin chain account associated with the given derivative index
 - **palletVersion**() — returns current pallet version from storage
 - **transactInfoWithWeightLimit**(location) — returns the transact information for a given multilocation

### Pallet Constants {: #constants }

The XCM-transactor pallet includes the following read-only functions to obtain pallet constants:

- **baseXcmWeigh**() - returns the base XCM weight required for execution
- **selfLocation**() - returns the multilocation of the chain

## Building an XCM with the XCM-Transactor Pallet {: #build-xcm-xcmtransactor-pallet}

This guide covers building an XCM message for remote executions using the XCM-transactor pallet, specifically with the `transactThroughDerivative` function. The steps to use the `transactThroughDerivativeMultilocation` function are identical, but instead of the currency ID, you specify a multilocation for the fee token.

!!! note
    You need to ensure that the call you are going to execute remotely is allowed in the destination chain!

### Checking Prerequisites {: #xcmtransactor-check-prerequisites}

To be able to send the extrinsics in Polkadot.js Apps, you need to have:

 - An [account](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/accounts){target=_blank} with [funds](/builders/get-started/networks/moonbase/#get-tokens){target=_blank}
 - The account from which you are going to send the XCM through the XCM-transactor pallet must also be registered in a given index to be able to operate through a derivative account of the sovereign account. The registration is done through the root account (SUDO in Moonbase Alpha), so [contact us](https://discord.gg/PfpUATX){target=_blank} to get it registered. For this example, Alice's account was registered at index `42`
 - Remote calls through XCM-transactor require the destination chain fee token to pay for that execution. Because the action is initiated in Moonbeam, you'll need to hold its [XC-20](/builders/xcm/xc20/){target=_blank} representation. For this example, because you are sending an XCM message to the relay chain, you need `xcUNIT` tokens to pay for the execution fees, which is the Moonbase Alpha representation of the Alphanet relay chain token `UNIT`. You can acquire some by swapping for DEV tokens (Moonbase Alpha's native token) on [Moonbeam-Swap](https://moonbeam-swap.netlify.app){target=_blank}, a demo Uniswap-V2 clone on Moonbase Alpha

![Moonbeam Swap xcUNITs](/images/builders/xcm/xc20/xtokens/xtokens-1.png)

To check your `xcUNIT` balance, you can add the XC-20 to MetaMask with the following address:

```
0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080
```

If you're interested in how the precompile address is calculated, you can check out the following guides:

- [Calculate External XC-20 Precompile Addresses](/builders/xcm/xc20/xc20/#calculate-xc20-address){target=_blank}
- [Calculate Mintable XC-20 Precompile Addresses](/builders/xcm/xc20/mintable-xc20/#calculate-xc20-address){target=_blank}

### XCM-Transactor Transact Through Derivative Function {: #xcmtransactor-transact-through-derivative}

In this example, you'll build an XCM message to execute a remote call in the relay chain from Moonbase Alpha through the `transactThroughDerivative` function of the XCM-transactor pallet.

If you've [checked the prerequisites](#xcmtransactor-check-prerequisites), head to the extrinsic page of [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/extrinsics){target=_blank} and set the following options:

1. Select the account from which you want to send the XCM. Make sure the account complies with all the [prerequisites](#xcmtransactor-check-prerequisites)
2. Choose the **xcmTransactor** pallet
3. Choose the **transactThroughDerivative** extrinsic
4. Set the destination to **Relay**, to target the relay chain
5. Enter the index of the derivative account you've been registered to. For this example, the index value is `42`. Remember that the derivate account depends on the index
6. Set the currency ID to **ForeignAsset**. This is because you are not transferring DEV tokens (*SelfReserve*)
7. Enter the asset ID. For this example, `xcUNIT` has an asset id of `42259045809535163221576417993425387648`. You can check all available assets IDs in the [XC-20 address section](/builders/xcm/xc20/overview/#current-xc20-assets){target=_blank} 
8. Set the destination weight. The value must include the `asDerivative` extrinsic as well. However, the weight of the XCM instructions is added by the XCM-transactor pallet. For this example, `1000000000` is enough
9.  Enter the inner call that will be executed in the destination chain. This is the encoded call data of the pallet, method, and input values to be called. It can be constructed in Polakdot.js Apps (must be connected to the destination chain), or using the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}. For this example, the inner call is `0x04000030fcfb53304c429689c8f94ead291272333e16d77a2560717f3a7a410be9b208070010a5d4e8`, which is a simple balance transfer of 1 `UNIT` to Alice's account in the relay chain. You can decode the call in [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics/decode){target=_blank}
10. Click the **Submit Transaction** button and sign the transaction

!!! note
    The encoded call data for the extrinsic configured above is `0x2103002a00018080778c30c20fa2ebc0ed18d2cbca1f00ca9a3b00000000a404000030fcfb53304c429689c8f94ead291272333e16d77a2560717f3a7a410be9b208070010a5d4e8`.

![XCM-Transactor Transact Through Derivative Extrinsic](/images/builders/xcm/xcm-transactor/xcmtransactor-1.png)

Once the transaction is processed, you can check the relevant extrinsics and events in [Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer/query/0x14cebfb2b4a4c0bf72cb2562344e6803263f45491d2ab14e7b91115ebd52e706){target=_blank} and the [relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/explorer/query/0x630456e6578d5b414db2e83486a6961ff90dc06bf979988b370dcb0e57550e41){target=_blank}. Note that, in Moonbase Alpha, there is an event associated to the `transactThroughDerivative` method, but also some `xcUNIT` tokens are burned to repay the sovereign account for the transactions fees. In the relay chain, the `paraInherent.enter` extrinsic shows a `balance.Transfer` event, where 1 `UNIT` token is transferred to Alice's address. Still, the transaction fees are paid by the Moonbase Alpha sovereign account.

## Retrieve Registered Derivative Indexes

To fetch a list of all registered addresses allowed to operate through the Moonbeam-based network sovereign account and their corresponding indexes, head to the **Chain State** section of [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/chainstate){target=_blank} (under the **Developer** tab). In there, take the following steps:

1. From the **selected state query** dropdown, choose **xcmTransactor**
2. Select the **indexToAccount** method
3. (Optional) Disable/enable the include options slider. This will allow you to query the address authorized for a given index or request all addresses for all registered indexes
4. If you've enabled the slider, enter the index to query
5. Send the query by clicking on the **+** button

![Check Registered Derivative Indexes](/images/builders/xcm/xcm-transactor/xcmtransactor-2.png)

## XCM-Transactor Precompile {: #xcmtransactor-precompile}

The XCM-transactor precompile contract allows developers to access the XCM-transactor pallet features through the Ethereum API of Moonbeam-based networks. Similar to other [precompile contracts](/builders/build/canonical-contracts/precompiles/){target=_blank}, the XCM-transactor precompile is located at the following addresses:

=== "Moonbeam"
     ```
     {{networks.moonbeam.precompiles.xcm_transactor}}
     ```

=== "Moonriver"
     ```
     {{networks.moonriver.precompiles.xcm_transactor}}
     ```

=== "Moonbase Alpha"
     ```
     {{networks.moonbase.precompiles.xcm_transactor}}
     ```

### The XCM-Transactor Solidity Interface {: #xcmtrasactor-solidity-interface } 

[XcmTransactor.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/xcm-transactor/XcmTransactor.sol){target=_blank} is an interface through which developers can interact with the XCM-transactor pallet using the Ethereum API.

The interface includes the following functions:

 - **index_to_account**(*uint16* index) — read-only function that returns the registered address authorized to operate using a derivative account of the Moonbeam-based network sovereign account for the given index
  - **transact_info**(*Multilocation* *memory* multilocation) — read-only function that, for a given chain defined as a multilocation, returns the transact information
  <!-- - **transact_info_with_signed**(*Multilocation* *memory* multilocation) — read-only function that, for a given chain defined as a multilocation, returns the transact information considering the 3 XCM instructions associated to the external call execution, but also returns extra weight information associated with the `decendOrigin` XCM instruction to execute the remote call  -->
 - **fee_per_second**(*Multilocation* *memory* multilocation) — read-only function that, for a given asset as a multilocation, returns units of token per second of the XCM execution that is charged as the XCM execution fee. This is useful when, for a given chain, there are multiple assets that can be used for fee payment
 - **transact_through_derivative**(*uint8* transactor, *uint16* index, *address*  address, *uint64* weight, *bytes* *memory* inner_call) — function that represents the `transactThroughDerivative` method described in the [previous example](#xcmtransactor-transact-through-derivative). Instead of the currency ID (asset ID), you'll need to provide the [assets precompile address](#xcmtransactor-check-prerequisites) for the `address` of the token that is used for fee payment.
 - **transact_through_derivative_multilocation**(*uint8* transactor, *uint16* index, *Multilocation* *memory* fee_asset, *uint64* weight, *bytes* *memory* inner_call) — function that represents the `transactThroughDerivativeMultilocation` method. It is very similar `transact_through_derivative`, but you need to provide the asset multilocation of the token that is used for fee payment instead of the XC-20 token `address`

### Building the Precompile Multilocation {: #building-the-precompile-multilocation }

In the XCM-transactor precompile interface, the `Multilocation` structure is defined as follows:

--8<-- 'text/xcm/xcm-precompile-multilocation.md'

The following code snippet goes through some examples of `Multilocation` structures, as they would need to be fed into the XCM-transactor precompile functions:


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