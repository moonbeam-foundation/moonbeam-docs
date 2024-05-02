---
title: Utility Pallet
description: Learn about the available extrinsics for the Utility Pallet on Moonbeam and how to interact with them using Polkadot.js Apps and the Polkadot.js API.
keywords: utility, batch, substrate, pallet, moonbeam, polkadot
---

# The Utility Pallet

## Introduction {: #introduction }

Through Substrate's Utility Pallet, users on Moonbeam can include multiple calls into a single transaction through the two available batch extrinsics and use derivative accounts to send calls.

This guide will provide an overview and examples of the extrinsics and getters for the pallet constants available in the Utility Pallet on Moonbeam.

## Derivative Accounts {: #derivative-accounts }

Derivative accounts are accounts that are derived from another account using an index. This enables the derivative account to dispatch transactions and use the origin account to pay for transaction fees. Since the private key of this account is unknown, transactions must be initiated with the `asDerivative` extrinsic of this pallet. For example, Alice has a derivative account with an index `0`. If she transfers any balance using the `asDerivative` function, Alice would still pay for transaction fees, but the funds being transferred will be withdrawn from the derivative account at index `0`.

The derivation is done by calculating the Blake2 hash of `modlpy/utilisuba` + `originalAddress` + `index`.  You can use a [script to calculate a derivative account](https://github.com/albertov19/PolkaTools/blob/main/calculateDerivedAddress.ts/){target=\_blank} given an origin account and index.

One use case of derivative accounts can be found in the XCM Transactor Pallet. The pallet allows users to perform remote cross-chain calls from an account derivated from the Sovereign account which enables the calls to be easily executed with a simple transaction. For more information, please refer to the [Using the XCM Transactor Pallet for Remote Executions](/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/){target=\_blank} guide.

## Utility Pallet Interface {: #utility-pallet-interface }

### Extrinsics {: #extrinsics }

The Utility Pallet provides the following extrinsics (functions):

- **asDerivative**(index, call) - sends a call through an indexed pseudonym of the sender given the index number and the call
- **batch**(calls) - sends a batch of calls to be dispatched. If a call fails, any successful calls up until that point will be processed and a `BatchInterrupted` event will be emitted. If all calls are successful, then the `BatchCompleted` event is emitted. The number of calls must not exceed the [limit](#constants)
- **batchAll**(calls) - sends a batch of calls to be dispatched and atomically execute them. If one of the calls fail, the entire transaction will rollback and fail. The number of calls must not exceed the [limit](#constants)
- **dispatchAs**(asOrigin, call) - dispatches a function call provided an origin and the call to be dispatched. The dispatch origin for this call must be `Root`

### Pallet Constants {: #constants }

The Utility Pallet includes the following read-only functions to obtain pallet constants:

- **batchedCallsLimit**() - returns the limit on the number of batched calls

## Using the Batch Extrinsics  {: #using-the-batch-extrinsics }

You can access the batch extrinsics using the Polkadot.js Apps interface or through the Polkadot.js API. This example will show you how to use the `batch` extrinsic from Polkadot.js Apps. If you're using the Polkadot.js API, you can access the Utility Pallet through `api.tx.utility.batch` interface. For more information on batching transactions with the API, please refer to the [Polkadot.js API Library](/builders/build/substrate-api/polkadot-js-api/#batching-transactions/){target=\_blank} page.

To get started, you can navigate to [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/){target=\_blank} and connect to Moonbase Alpha. This example can also be adapted for Moonbeam or Moonriver.

You can send any combination of calls, whether they're balance transfers, democracy actions, staking actions, or more.

As a basic example, you can send two balance transfers at once. To get started, click on the **Developer** dropdown, select **Extrinsics**, and take the following steps:

1. Select the account to submit the `batch` extrinsic with
2. Choose **utility** from the **submit the following extrinsic** menu
3. Select the **batch** extrinsic
4. Fields for the first call should already appear, and to add a second call click on **Add item**
5. For the first call, select **balances**
6. Choose the **transfer** extrinsic
7. Enter the destination account to send the funds to
8. Enter an amount of DEV tokens to send in the **value** field, make sure you account for 18 decimals
9. For the second call, you can repeat steps 5 through 8
10. To send the calls at once, click on **Submit Transaction**

![Send batch transaction](/images/builders/pallets-precompiles/pallets/utility/utility-1.webp)

Next you will need to enter your password and click on **Sign and Submit**. Then you can review the extrinsic on [Subscan](https://moonbase.subscan.io/){target=\_blank}.

!!! note
    As a reference, you can [view the exact extrinsic for this example on Subscan](https://moonbase.subscan.io/extrinsic/2561364-6/){target=\_blank}.

If you take a look at the **Events** tab at the bottom of the extrinsic page, you should see several events including two `balances (Transfer)` events, two `utility (ItemCompleted)` events, and a `utility (BatchCompleted)` event containing the details of the batch transaction.