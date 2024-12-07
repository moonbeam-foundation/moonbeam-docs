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
        - `threshold` - The total number of approvals required for the dispatch to be executed
        - `otherSignatories` - The accounts (other than the sender) who can approve the dispatch
        - `maybeTimepoint` - The timepoint (block number and transaction index) of the first approval transaction. Must be `None` if this is the first approval
        - `call` - The actual call to be executed once approved
        - `maxWeight` - The maximum weight allowed for the dispatch
    === "Polkadot.js API Example"
        ```js
        --8<-- 'code/builders/substrate/interfaces/account/multisig/as-multi.js'
        ```

    === "Example Response"
        ```
        Validation checks:
        Account address: 0x3B939FeaD1557C741Ff06492FD0127bd287A421e
        Multisig address: 0x2c6a9d09E7C01f3D4154000193BDDcC597523221
        Other signatories: [
          '0x253b05C595222a1e3E7Bcf1611cA1307194a030F',
          '0x4B718e1CCeb83bfE87FD5f79cb98FFc2d4600C7E'
        ]
        Threshold: 2
        Call hash: 0xdbbc67f35ca518976f4d392fb32745786e6b58fc526fab0dafb6eda44d9850a3
        Max weight: { refTime: '806342022', proofSize: '211174' }
        Timepoint: null
        Transaction included in block hash: 0x0050f1b137e5814dc4eb16390d10287d9234de1d5827dd64ba85c878d4c53849
            balances.Withdraw: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",4858229333763]
            balances.Reserved: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e","0x00000000000000000e1107d468560000"]
            multisig.NewMultisig: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e","0x2c6a9d09E7C01f3D4154000193BDDcC597523221","0xdbbc67f35ca518976f4d392fb32745786e6b58fc526fab0dafb6eda44d9850a3"]
            balances.Deposit: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",1222550823750]
            balances.Deposit: ["0x6d6F646c70632f74727372790000000000000000",727135702003]
            transactionPayment.TransactionFeePaid: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",3635678510013,0]
            system.ExtrinsicSuccess: [{"weight":{"refTime":404917324,"proofSize":5587},"class":"Normal","paysFee":"Yes"}]
        Multisig event: NewMultisig
        ```

??? function "**approveAsMulti**(threshold, otherSignatories, maybeTimepoint, callHash, maxWeight) - approves a call from a composite origin. For the final approval, you'll want to use `asMulti` instead"
    === "Parameters"
        - `threshold` - The total number of approvals required for the dispatch to be executed
        - `otherSignatories` - The accounts (other than the sender) who can approve the dispatch
        - `maybeTimepoint` - The timepoint (block number and transaction index) of the first approval transaction. Must be `None` if this is the first approval
        - `callHash` - The hash of the call to be executed
        - `maxWeight` - The maximum weight allowed for the dispatch
    === "Polkadot.js API Example"
        ```js
        --8<-- 'code/builders/substrate/interfaces/account/multisig/approve-as-multi.js'
        ```    

    === "Example Response"
        ```bash
        Found timepoint: { height: 9174086, index: 5 }
        Validation checks:
        Account address: 0x3B939FeaD1557C741Ff06492FD0127bd287A421e
        Multisig address: 0x2c6a9d09E7C01f3D4154000193BDDcC597523221
        Other signatories: [
          '0x253b05C595222a1e3E7Bcf1611cA1307194a030F',
          '0x4B718e1CCeb83bfE87FD5f79cb98FFc2d4600C7E'
        ]
        Threshold: 2
        Call hash: 0xa2902805948bdd92fcaf661965215efd6a5980d0092c065e7470859c1b37b6a9
        Max weight: { refTime: '806342022', proofSize: '211174' }
        Timepoint: { height: 9174086, index: 5 }
        Transaction included in block hash: 0xb7b0f712dc7aa3d471e1db89e0d182b59e1febf8bb1df73a03f36417fe19b506
            balances.Withdraw: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",4512391685922]
            multisig.MultisigApproval: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",{"height":9174086,"index":5},"0x2c6a9d09E7C01f3D4154000193BDDcC597523221","0xa2902805948bdd92fcaf661965215efd6a5980d0092c065e7470859c1b37b6a9"]
            balances.Deposit: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",1025179732500]
            balances.Deposit: ["0x6d6F646c70632f74727372790000000000000000",697442390685]
            transactionPayment.TransactionFeePaid: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",3487211953422,0]
            system.ExtrinsicSuccess: [{"weight":{"refTime":389364247,"proofSize":5587},"class":"Normal","paysFee":"Yes"}]
        ```


??? function "**asMultiThreshold**(otherSignatories, call) - immediately dispatches a multisig call using a single approval from the caller"
    === "Parameters"
        - `otherSignatories` - The accounts (other than the sender) who can approve the dispatch
        - `call` - The actual call to be executed once approved
    === "Polkadot.js API Example"
        ```js
        --8<-- 'code/builders/substrate/interfaces/account/multisig/as-multi-threshold.js'
        ```

    === "Example Response"
        ```
        Found timepoint: { height: 9174086, index: 5 }
        Validation checks:
        Account address: 0x3B939FeaD1557C741Ff06492FD0127bd287A421e
        Multisig address: 0x2c6a9d09E7C01f3D4154000193BDDcC597523221
        Other signatories: [
          '0x253b05C595222a1e3E7Bcf1611cA1307194a030F',
          '0x4B718e1CCeb83bfE87FD5f79cb98FFc2d4600C7E'
        ]
        Threshold: 2
        Call hash: 0xa2902805948bdd92fcaf661965215efd6a5980d0092c065e7470859c1b37b6a9
        Max weight: { refTime: '806342022', proofSize: '211174' }
        Timepoint: { height: 9174086, index: 5 }
        Transaction included in block hash: 0xb7b0f712dc7aa3d471e1db89e0d182b59e1febf8bb1df73a03f36417fe19b506
            balances.Withdraw: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",4512391685922]
            multisig.MultisigApproval: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",{"height":9174086,"index":5},"0x2c6a9d09E7C01f3D4154000193BDDcC597523221","0xa2902805948bdd92fcaf661965215efd6a5980d0092c065e7470859c1b37b6a9"]
            balances.Deposit: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",1025179732500]
            balances.Deposit: ["0x6d6F646c70632f74727372790000000000000000",697442390685]
            transactionPayment.TransactionFeePaid: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",3487211953422,0]
            system.ExtrinsicSuccess: [{"weight":{"refTime":389364247,"proofSize":5587},"class":"Normal","paysFee":"Yes"}]
        ```


??? function "**cancelAsMulti**(threshold, otherSignatories, maybeTimepoint, callHash) - cancels a preexisting, ongoing call from a composite origin. Any reserved deposit will be returned upon successful cancellation"
    === "Parameters"
        - `threshold` - The total number of approvals required for the dispatch to be executed
        - `otherSignatories` - The accounts (other than the sender) who can approve the dispatch
        - `maybeTimepoint` - The timepoint (block number and transaction index) of the first approval transaction. Must be `None` if this is the first approval
        - `callHash` - The hash of the call to be executed

    === "Polkadot.js API Example"
        ```js
        --8<-- 'code/builders/substrate/interfaces/account/multisig/cancel-as-multi.js'
        ```

    === "Example Response"
        ```bash
        Found timepoint: { height: 9174086, index: 5 }
        Validation checks:
        Account address: 0x3B939FeaD1557C741Ff06492FD0127bd287A421e
        Multisig address: 0x2c6a9d09E7C01f3D4154000193BDDcC597523221
        Other signatories: [
          '0x253b05C595222a1e3E7Bcf1611cA1307194a030F',
          '0x4B718e1CCeb83bfE87FD5f79cb98FFc2d4600C7E'
        ]
        Threshold: 2
        Call hash: 0xa2902805948bdd92fcaf661965215efd6a5980d0092c065e7470859c1b37b6a9
        Max weight: { refTime: '806342022', proofSize: '211174' }
        Timepoint: { height: 9174086, index: 5 }
        Transaction included in block hash: 0xb7b0f712dc7aa3d471e1db89e0d182b59e1febf8bb1df73a03f36417fe19b506
            balances.Withdraw: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",4512391685922]
            multisig.MultisigApproval: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",{"height":9174086,"index":5},"0x2c6a9d09E7C01f3D4154000193BDDcC597523221","0xa2902805948bdd92fcaf661965215efd6a5980d0092c065e7470859c1b37b6a9"]
            balances.Deposit: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",1025179732500]
            balances.Deposit: ["0x6d6F646c70632f74727372790000000000000000",697442390685]
            transactionPayment.TransactionFeePaid: ["0x3B939FeaD1557C741Ff06492FD0127bd287A421e",3487211953422,0]
            system.ExtrinsicSuccess: [{"weight":{"refTime":389364247,"proofSize":5587},"class":"Normal","paysFee":"Yes"}]
        ```

### Storage Methods {: #storage-methods }

The Multisig Pallet includes the following read-only storage methods to obtain chain state data:

??? function "**multisigs**() - returns the set of open multisig operations for a given account."

    === "Parameters"

        - `account` - The address of the multisig
        - `callHash` - (Optional) The hash of the multisig call

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/multisig/multisigs.js'
        ```

    === "Example Response"
        ```
        [
          [
            [
              0x2c6a9d09E7C01f3D4154000193BDDcC597523221
              0xa2902805948bdd92fcaf661965215efd6a5980d0092c065e7470859c1b37b6a9
            ]
            {
              when: {
                height: 9,174,086
                index: 5
              }
              deposit: 1,013,600,000,000,000,000
              depositor: 0x253b05C595222a1e3E7Bcf1611cA1307194a030F
              approvals: [
                0x253b05C595222a1e3E7Bcf1611cA1307194a030F
              ]
            }
          ]
        ]
        ```  



??? function "**palletVersion**() - returns the current pallet version"

    === "Parameters"

        None

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/multisig/pallet-version.js'
        ```

    === "Example Response"

        `1`

### Pallet Constants {: #constants }

The Multisig Pallet includes the following read-only functions to obtain pallet constants:

??? function "**depositBase**() - returns the base amount of currency needed to reserve for creating a multisig execution or to store a dispatch call for later. This is held for an additional storage item whose key size is `32 + sizeof(AccountId)` bytes, which is `32 + 20` on Moonbeam, and whose value size is `4 + sizeof((BlockNumber, Balance, AccountId))` bytes, which is `4 + 4 + 16 +20` bytes on Moonbeam"

    === "Parameters"

        None

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/multisig/deposit-base.js'
        ```

    === "Example Response"

        ```
        Multisig Deposit Base: 1,009,600,000,000,000,000
        ```

??? function "**depositFactor**() - returns the amount of currency needed per unit threshold when creating a multisig execution. This is held for adding 20 bytes more into a preexisting storage value"

    === "Parameters"

        None

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/multisig/deposit-factor.js'
        ```

    === "Example Response"

        ```
        Multisig Deposit Factor: 2,000,000,000,000,000
        ```

??? function "**maxSignatories**() - returns the maximum amount of signatories allowed in the multisig"

    === "Parameters"

        None

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/multisig/max-signatories.js'
        ```

    === "Example Response"
           ```
           Multisig Max Signatories: 100
           ```

## How to Create a Multisig Account {: #create-a-multisig-account }

You can easily create a multisig account from the Polkadot.js Apps interface. The easiest way to do so is from the [**Accounts** page](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/accounts){target=\_blank}.

To get started, go ahead and click on **Multisig**.

![Add a multisig on Polkadot.js Apps](/images/builders/substrate/interfaces/account/multisig/multisig-1.webp)

Next, you can take the following steps:

1. Choose which accounts you want to add to the multisig. For this example, three accounts will be chosen: Alice, Bob, and Charlie
2. Enter a number for **threshold**. This example will use `2`
3. Add a name for the multisig. This example uses `ABC` for Alice, Bob, and Charlie
4. Click **Create**

![Set up the multisig members](/images/builders/substrate/interfaces/account/multisig/multisig-2.webp)

Now, the ABC multisig account will appear under the **multisig** section on the **Accounts** page.

![View the multisig account on the Accounts page of Polkadot.js Apps](/images/builders/substrate/interfaces/account/multisig/multisig-3.webp)

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

With the basics out of the way, you can begin to create a multisig call. For this example, you can create a call that will transfer 0.1 DEV from the ABC multisig account to Charlie's account. First, you'll need to get the encoded call data for the transfer. Go ahead and navigate to the [**Extrinsics** page on Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=\_blank} and take the following steps:

1. Make sure an account is selected. It doesn't have to be the ABC multisig account, as the selected account is not included in the encoded call data
2. Select the **balances** pallet and the **transfer** extrinsic
3. Set Charlie as the **dest** account
4. Enter the amount to transfer, which is `0.1` DEV for this example
5. Click the copy button next to the **encoded call data**
6. Click the copy button next to the **encoded call hash**. Please note that you do not have to submit the extrinsic, you only need the encoded call data and the encoded call hash

![Get the encoded call data for a balance transfer](/images/builders/substrate/interfaces/account/multisig/multisig-4.webp)

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

![Create a multisig call](/images/builders/substrate/interfaces/account/multisig/multisig-5.webp)

Now that you've created the multisig call, you can submit approval transactions from either Bob's or Charlie's account, or both. Remember, for the call to be approved and dispatched, you need to have at least two of three members of the multisig to approve it. Since Alice created the multisig call, that means she has already automatically approved it.

You can easily approve the transactions through the **Accounts** page of Polkadot.js Apps. Next to your multisig account, you'll notice there is a multisig icon there that you can hover over. Once you hover over it, you'll be able to click on **View pending approvals**.

![View pending multisig approvals](/images/builders/substrate/interfaces/account/multisig/multisig-6.webp)

The **pending call hashes** pop-up will appear where you can follow these steps:

1. Since you should only have one hash at this point, you can select it from this list. If you have multiple hashes, you can compare the hashes in the list with the encoded call hash you copied earlier on in this section
2. The **depositor** should be automatically populated. For this example, it should be Alice
3. For the **approval type**, you can choose to either approve or reject the call. For this example, you can select **Approve this call hash**
4. Choose the account you want to approve the transaction from. This example uses Bob's account
5. Click **Approve** to submit the approval transaction. Under the hood, this uses the `approveAsMulti` extrinsic of the Multisig Pallet

![Approve a multisig call](/images/builders/substrate/interfaces/account/multisig/multisig-7.webp)

So far, Alice and Bob have approved the multisig call, which means the threshold has been met. However, the call has not been dispatched yet since you have not yet submitted an executing approval. To do so, you'll take the same steps as above plus these additional steps:

1. Select the account you want to approve the transaction from. This example uses Charlie's account
2. Toggle the **multisig message with call (for final approval)** switch to on. Under the hood, this switches the extrinsic to `asMulti`, which automatically approves and dispatches the call if the threshold for approvals has been met as is the case at this point
3. The **call data for final approval** field will appear. Enter the encoded call data that you copied earlier on in this section
4. Click **Approve** to submit the approval, which will also dispatch the multisig call

![Approve and dispatch a multisig call](/images/builders/substrate/interfaces/account/multisig/multisig-8.webp)

Once the final transaction has been submitted, 0.1 DEV tokens will be transferred from the ABC multisig account to Charlie's account and the multisig deposit will be returned to Alice's account. And that's it! You've successfully created a multisig call, approved the call, and dispatched it.