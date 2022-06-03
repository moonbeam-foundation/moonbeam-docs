---
title: Remote Execution Through XCM
description: Learn how to do remote XCM calls in other chains using the XCM-Transactor pallet. The XCM-Transactor precompile allows you to access these core functions via the Ethereum API.
---

# Using the XCM-Transactor Pallet for Remote Executions

![X-Tokens Precompile Contracts Banner](/images/builders/xcm/xc20/xtokens/xtokens-banner.png)

## Introduction {: #introduction}

XCM messages are comprised of a [series of instructions](/builders/xcm/overview/#xcm-instructions) that are executed by the Cross-Consensus Virtual Machine (XCVM). Combinations of these instructions result in predetermined actions such as cross-chain token transfers and, more interestingly, remote cross-chain execution.

Nevertheless, building an XCM message from scratch is somewhat tricky. Moreover, XCM messages are sent to other participants in the ecosystem from the root account (that is, SUDO or through a democratic vote), which is not ideal for projects that want to leverage remote cross-chain calls via a simple transaction. 

To assess these issues, developers can leverage wrapper functions/pallets to use XCM features on Polkadot/Kusama, such as the [XCM-Transactor pallet](https://github.com/PureStake/moonbeam/blob/master/pallets/xcm-transactor/src/lib.rs){target=_blank}. In addition, the XCM-transactor pallet allows users to perform remote cross-chain calls from an account derivated from the sovereign account (called derivative account), so that they can be easily executed with a simple transaction.

This guide will show you how to use the XCM-Transactor pallet to send XCM messages from a Moonbeam-based network to other chains in the ecosystem (relay chain/parachains). In addition, you'll also learn how to use the XCM-Transactor precompile to perform the same actions via the Ethereum API. 

**Note that there are still limitations in what you can remotely execute through XCM messages**.

**Developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

## Relevant XCM Definitions {: #general-xcm-definitions }

--8<-- 'text/xcm/general-xcm-definitions2.md'

 - **Derivative account** —  an account derivated from another account using a simple index. The derivation is done by calculating the Blake2 hash of `modlpy/utilisuba` + `originalAddress` + `index`. Because the private keys of this account is unknown, transactions must be initiated with the `utility.asDerivative` method. When transacting through the derivative account, transaction fees are paid by the origin account, but the transaction is dispatched from the derivative account. For example, Alice has a derivative account with an index `0`. If she transfers any balance using the `asDerivative` function, Alice would still pay for transaction fees, but the funds being transferred will be withdrawn from the derivative account at index `0`

 - **Transact information** — relates to extra weight and fee information for the XCM remote execution part of the XCM-Transactor extrinsic. This is needed because the XCM transaction fee is paid by the Sovereign Account. Therefore, XCM-Transactor calculates what this fee is, and charges the sender of the XCM-Transactor extrinsic the estimated amount in the corresponding [XC-20 token](/builders/xcm/xc20/overview/), to repay the Sovereign Account

## XCM-Transactor Pallet Interface {: #xcm-transactor-pallet-interface}

The XCM-Transactor pallet provides the following extrinsics (functions):

 - **deregister(index)** — deregisters a derivative account for a given index. This prevents the previously registered account from using a derivative address for remote execution. This extrinsic is only callable by **root**, for example, through a democracy proposal
 - **register(address, index)** — registers a given address as a derivative account at a given index. This extrinsic is only callable by **root**, for example, through a democracy proposal
 - **removeTransactInfo(location)** — remove the transact information for a given chain, defined as a multilocation
 - **setTransactInfo(location, transactExtraWeight, feePerSecond, maxWeight)** — sets the transact information for a given chain, defined as a multilocation. The transact information includes:
     - **transactExtraWeight** — which is estimated to be at least 10% over what the remote XCM instructions execution actually uses (`WithdrawAsset`, `BuyExecution`, and `Transact`)
     - **feePerSecond** — it is the token units per second of XCM execution that will be charged to the sender of the XCM-Transactor extrinsic
     - **maxWeight** — maximum weight units allowed for the remote XCM execution
 - **transactThroughDerivative(destination, index, currencyID, destWeight, innerCall)** — sends an XCM message with instructions to remotely execute a given call in the given destination (wrapped with the `asDerivative` option). The remote call will be signed by the origin parachain sovereign account (who pays the fees), but the transaction is dispatched from the sovereign's derivative account for the given index. The XCM-transactor pallet calculates the fees for the remote execution and charges the sender of the extrinsic the estimated amount in the corresponding [XC-20 token](/builders/xcm/xc20/overview/) given by the asset ID
 - **transactThroughDerivativeMultilocation(destination, index, feeLocation, destWeight, innerCall)** — sends an XCM message with instructions to remotely execute a given call in the given destination (wrapped with the `asDerivative` option). The remote call will be signed by the origin parachain sovereign account (who pays the fees), but the transaction is dispatched from the sovereign's derivative account for the given index. The XCM-transactor pallet calculates the fees for the remote execution and charges the sender of the extrinsic the estimated amount in the corresponding [XC-20 token](/builders/xcm/xc20/overview/) given by the asset multilocation
 - **transactThroughSovereign(destination, feePayer, feeLocation, destWeight, call, originKind)** — sends an XCM message with instructions to remotely execute a given call in the given destination. The remote call will be signed by the origin parachain sovereign account (who pays the fees), but the transaction is dispatched from a given origin. The XCM-transactor pallet calculates the fees for the remote execution and charges the given account the estimated amount in the corresponding [XC-20 token](/builders/xcm/xc20/overview/) given by the asset multilocation

Where the inputs that need to be provided can be defined as:

 - **index** — value to be used to calculate the derivative account. In the context of the XCM-Transactor pallet, this is a derivative account of the parachain sovereign account in another chain
 - **location** — a multilocation representing a chain in the ecosystem. The value is used to set or retrieve the transact information
 - **destination** — a multilocation representing a chain in the ecosystem where the XCM message is being sent to
 - **currencyID** — the ID of the currency being used to pay for the remote call execution. Different runtimes have different ways of defining the IDs. In the case of Moonbeam-based networks, `SelfReserve` refers to the native token, and `ForeignAsset` refers to the asset ID of the XC-20 (not to be confused with the XC-20 address)
 - **destWeight** — the maximum amount of execution time you want to provide in the destination chain to execute the XCM message being sent. If not enough weight is provided, the execution of the XCM will fail, and funds might get locked in either the sovereign account or a special pallet. For transacts through derivative, you have to take into account the `asDerivative` extrinsic as well, but the XCM-Transactor pallet adds the weight for the XCM instructions with the transact information set before. **It is essential to correctly set the destination weight to avoid failed XCM executions**
 - **innerCall** — encoded call data of the call that will be executed in the destination chain. This is wrapped with the `asDerivative` option if transacting through the derivative account
 - **feeLocation** — a multilocation representing the currency being used to pay for the remote call execution
 - **feePayer** — the address that will pay for the remote XCM execution in the transact through sovereign extrinsic. The fee is charged in the corresponding [XC-20 token](/builders/xcm/xc20/overview/)
 - **call** — similar to `innerCall`, but it is not wrapped with the `asDerivative` extrinsic
 - **originKind** — dispatcher of the remote call in the destination chain. There are [four types of dispatchers](https://github.com/paritytech/polkadot/blob/0a34022e31c85001f871bb4067b7d5f5cab91207/xcm/src/v0/mod.rs#L60){target=_blank} available

The XCM-Transactor pallet provides three read-method:

 - **indexToAccount(index)** — returns the origin chain account associated with the given derivative index
 - **transactInfoWithWeightLimit(location)** — returns the transact information for a given multilocation
 - **palletVersion()** — returns current pallet version from storage


https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/explorer/query/5212976
