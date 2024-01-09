---
title: Multisig Pallet
description: Learn about the Multisig Pallet, which taps into Substrate functionality to provide the ability to approve and dispatch calls from a multisig on Moonbeam.
---

# The Multisig Pallet

## Introduction {: #introduction }

Multisig wallets are a special type of wallet that requires multiple signatures in order to execute transactions, as the name implies. A multisig has a set of signers and defines a threshold for the number of signatures required to approve a transaction. This type of wallet provides an additional layer of security and decentralization.

The Multisig Pallet on Moonbeam taps into Substrate functionality to allow for the ability to natively approve and dispatch calls from a multisig. With the Multisig Pallet, multiple signers, also referred to as signatories in Substrate, approve and dispatch transactions from an origin that is derivable deterministically from the set of signers' account IDs and the threshold for the number of accounts from the set that must approve calls before they can be dispatched.

This page will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the Multisig Pallet on Moonbeam. It will also include a brief demo on how to create a multisig account and send a transaction that requires two of three signers to approve and dispatch the transaction.

## Multisig Pallet Interface {: #multisig-pallet-interface }

### Extrinsics {: #extrinsics }

The Multisig Pallet provides the following extrinsics (functions):

??? function "**asMulti**(threshold, otherSignatories, maybeTimepoint, call, maxWeight) - approves and if possible dispatches a call from a composite origin formed from a number of signed origins (a multisig). If the call has been approved by enough of the other signatories, the call will be dispatched. The [`depositBase`](#constants) will be reserved if this is the first approval plus the `threshold` times the [`depositFactor`](#constants). The total reserved amount will be returned once the call is dispatched or cancelled. This function should be used if it is the final approval, otherwise you'll want to use `approveAsMulti` instead since it only requires a hash of the call"

    === "Parameters"

        - `threshold` -
        - `otherSignatories` -
        - `maybeTimepoint` -
        - `call` -
        - `maxWeight` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        TODO
        ```

??? function "**approveAsMulti**(threshold, otherSignatories, maybeTimepoint, callHash, maxWeight) - approves a call from a composite origin. For the final approval, you'll want to use `asMulti` instead"

    === "Parameters"

        - `threshold` -
        - `otherSignatories` -
        - `maybeTimepoint` -
        - `callHash` -
        - `maxWeight` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        TODO
        ```

??? function "**asMultiThreshold**(otherSignatories, call) - immediately dispatches a multisig call using a single approval from the caller"

    === "Parameters"

        - `otherSignatories` -
        - `call` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        TODO
        ```

??? function "**cancelAsMulti**(threshold, otherSignatories, maybeTimepoint, callHash) - cancels a preexisting, ongoing call from a composite origin. Any reserved deposit will be returned upon successful cancellation"

    === "Parameters"

        - `threshold` -
        - `otherSignatories` -
        - `maybeTimepoint` -
        - `callHash` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        TODO
        ```


Where the inputs that need to be provided can be defined as:

??? function "**threshold** - the total number of approvals required for a dispatch to be executed"

    === "Parameters"

        TODO

    === "Returns"

        TODO

    === "Polkadot.js API Example"

       ```js
        TODO
       ```

??? function "**otherSignatories** - the accounts (other than the sender) who can approve the dispatch"

    === "Parameters"

        TODO

    === "Returns"

        TODO

    === "Polkadot.js API Example"

       ```js
        TODO
       ```

??? function "**maybeTimepoint** - the timepoint (block number and transaction index) of the first approval transaction, unless it is the first approval then this field must be `None`"

    === "Parameters"

        TODO

    === "Returns"

        TODO

    === "Polkadot.js API Example"

       ```js
        TODO
       ```

??? function "**call** - the call to be executed"

    === "Parameters"

        TODO

    === "Returns"

        TODO

    === "Polkadot.js API Example"

       ```js
        TODO
       ```

??? function "**callHash** - the hash of the call to be executed"

    === "Parameters"

        TODO

    === "Returns"

        TODO

    === "Polkadot.js API Example"

       ```js
        TODO
       ```

??? function "**maxWeight** - the maximum weight for the dispatch"

    === "Parameters"

        TODO

    === "Returns"

        TODO

    === "Polkadot.js API Example"

       ```js
        TODO
       ```


### Storage Methods {: #storage-methods }

The Multisig Pallet includes the following read-only storage methods to obtain chain state data:

??? function "**multisigs**() - returns the set of open multisig operations for a given account."

    === "Parameters"

        - `` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        TODO
        ```

??? function "**palletVersion**() - returns the current pallet version"

    === "Parameters"

        - `` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        TODO
        ```


### Pallet Constants {: #constants }

The Multisig Pallet includes the following read-only functions to obtain pallet constants:

??? function "**depositBase**() - returns the base amount of currency needed to reserve for creating a multisig execution or to store a dispatch call for later. This is held for an additional storage item whose key size is `32 + sizeof(AccountId)` bytes, which is `32 + 20` on Moonbeam, and whose value size is `4 + sizeof((BlockNumber, Balance, AccountId))` bytes, which is `4 + 4 + 16 +20` bytes on Moonbeam"

    === "Parameters"

        - `` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        TODO
        ```

??? function "**depositFactor**() - returns the amount of currency needed per unit threshold when creating a multisig execution. This is held for adding 20 bytes more into a preexisting storage value"

    === "Parameters"

        - `` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        TODO
        ```

??? function "**maxSignatories**() - returns the maximum amount of signatories allowed in the multisig"

    === "Parameters"

        - `` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        TODO
        ```


## How to Create a Multisig Account {: #create-a-multisig-account }

You can easily create a multisig account from the Polkadot.js Apps interface. The easiest way to do so is from the [**Accounts** page](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/accounts){target=_blank}.

To get started, go ahead and click on **Multisig**.

![Add a multisig on Polkadot.js Apps](/images/builders/pallets-precompiles/pallets/multisig/multisig-1.png)

Next, you can take the following steps:

1. Choose which accounts you want to add to the multisig. For this example, three accounts will be chosen: Alice, Bob, and Charlie
2. Enter a number for **threshold**. This example will use `2`
3. Add a name for the multisig. This example uses `ABC` for Alice, Bob, and Charlie
4. Click **Create**

![Set up the multisig members](/images/builders/pallets-precompiles/pallets/multisig/multisig-2.png)

Now, the ABC multisig account will appear under the **multisig** section on the **Accounts** page.

![View the multisig account on the Accounts page of Polkadot.js Apps](/images/builders/pallets-precompiles/pallets/multisig/multisig-3.png)

You can click on the colored icon next to the multisig account to copy the address and fund it with DEV tokens.
--8<-- 'text/_common/faucet/faucet-sentence.md'

## How to Create a Multisig Transaction {: #create-a-multisig-transaction }

Now that you've created a multisig account, you can create a multisig call from one of the accounts that make up the multisig. This example will create the call from Alice's account. As such, Alice will need to submit a deposit. The deposit is calculated as follows:

```text
Deposit = depositBase + threshold * depositFactor
```

You can retrieve the `depositBase` and `depositFactor` using the getter functions for the [Pallet Constants](#constants).

Once the call is approved and dispatched or cancelled the deposit will be returned to Alice.

Since there is a threshold of two for this multisig, at least Bob or Charlie will need to approve the call if not both of them. The last account to approve the call will also need to dispatch the call. Dispatching the call is done automatically when the `asMulti` function is used to approve the call.

With the basics out of the way, you can begin to create a multisig call. For this example, you can create a call that will transfer 0.1 DEV from the ABC multisig account to Charlie's account. First, you'll need to get the encoded call data for the transfer. Go ahead and navigate to the [**Extrinsics** page on Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=_blank} and take the following steps:

1. Make sure an account is selected. It doesn't have to be the ABC multisig account, as the selected account is not included in the encoded call data
2. Select the **balances** pallet and the **transfer** extrinsic
3. Set Charlie as the **dest** account
4. Enter the amount to transfer, which is `0.1` DEV for this example
5. Click the copy button next to the **encoded call data**
6. Click the copy button next to the **encoded call hash**. Please note that you do not have to submit the extrinsic, you only need the encoded call data and the encoded call hash

![Get the encoded call data for a balance transfer](/images/builders/pallets-precompiles/pallets/multisig/multisig-4.png)

Make sure you've copied and saved the encoded call data and the encoded call hash as you'll need them both to approve the multisig call later on in the tutorial. For this example, the encoded call data and hash are as follows:

=== "Encoded call data"

    ```text
    0x0300798d4ba9baf0064ec19eb4f0a1a45785ae9d6dfc1300008a5d78456301
    ```

=== "Encoded call hash"

    ```text
    0x76d1a0a8f6eb177dd7a561ef954e83893823fa5d77f576910f3fdc6cb4666dea
    ```

Next, you can create the multisig call by using the `asMulti` extrinsic, you'll take the following steps:

1. Select the account you want to create the call with. For this example, Alice is used
2. Select the **multisig** pallet and the **asMulti** extrinsic
3. Set the threshold of the multisig to the same value as you initially set from the **Accounts** page, which should be `2`
4. Add the other accounts that are associated with the multisig: Bob and Charlie
5. Since this is the first transaction to create the multisig call, make sure the **include option** slider is toggled off for the **maybeTimepoint** field. You would only enter this information for approvals that rely on knowing the timepoint at which the call was created
6. Provide the call information for the balance transfer similarly to how you did it in the previous set of steps. Select the **balances** pallet and the **transfer** extrinsic
7. Set the **dest** account to Charlie
8. Set the **value** to `0.1` DEV tokens
9. You can leave the **refTime** and **proofSize** fields set to `0`
10. Click **Submit Transaction** to create the multisig call

![Create a multisig call](/images/builders/pallets-precompiles/pallets/multisig/multisig-5.png)

Now that you've created the multisig call, you can submit approval transactions from either Bob's or Charlie's account, or both. Remember, for the call to be approved and dispatched, you need to have at least two of three members of the multisig to approve it. Since Alice created the multisig call, that means she has already automatically approved it.

You can easily approve the transactions through the **Accounts** page of Polkadot.js Apps. Next to your multisig account, you'll notice there is a multisig icon there that you can hover over. Once you hover over it, you'll be able to click on **View pending approvals**.

![View pending multisig approvals](/images/builders/pallets-precompiles/pallets/multisig/multisig-6.png)

The **pending call hashes** pop-up will appear where you can follow these steps:

1. Since you should only have one hash at this point, you can select it from this list. If you have multiple hashes, you can compare the hashes in the list with the encoded call hash you copied earlier on in this section
2. The **depositor** should be automatically populated. For this example, it should be Alice
3. For the **approval type**, you can choose to either approve or reject the call. For this example, you can select **Approve this call hash**
4. Choose the account you want to approve the transaction from. This example uses Bob's account
5. Click **Approve** to submit the approval transaction. Under the hood, this uses the `approveAsMulti` extrinsic of the Multisig Pallet

![Approve a multisig call](/images/builders/pallets-precompiles/pallets/multisig/multisig-7.png)

So far, Alice and Bob have approved the multisig call, which means the threshold has been met. However, the call has not been dispatched yet since you have not yet submitted an executing approval. To do so, you'll take the same steps as above plus these additional steps:

1. Select the account you want to approve the transaction from. This example uses Charlie's account
2. Toggle the **multisig message with call (for final approval)** switch to on. Under the hood, this switches the extrinsic to `asMulti`, which automatically approves and dispatches the call if the threshold for approvals has been met as is the case at this point
3. The **call data for final approval** field will appear. Enter the encoded call data that you copied earlier on in this section
4. Click **Approve** to submit the approval, which will also dispatch the multisig call

![Approve and dispatch a multisig call](/images/builders/pallets-precompiles/pallets/multisig/multisig-8.png)

Once the final transaction has been submitted, 0.1 DEV tokens will be transferred from the ABC multisig account to Charlie's account and the multisig deposit will be returned to Alice's account. And that's it! You've successfully created a multisig call, approved the call, and dispatched it.