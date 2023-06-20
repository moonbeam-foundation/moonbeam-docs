---
title: Multisig Pallet
description: Learn about the Multisig Pallet, which taps into Substrate functionality to provide the ability to approve and dispatch calls from a multisig on Moonbeam.
---

# The Multisig Pallet

![Multisig Moonbeam Banner](/images/builders/pallets-precompiles/pallets/multisig-banner.png)

## Introduction {: #introduction }

Multisig wallets are a special type of wallet that requires multiple signatures in order to execute transactions, as the name implies. A multisig has a set of signers and defines a threshold for the number of signatures required to approve a transaction. This type of wallet provides an additional layer of security and decentralization.

The Multisig Pallet on Moonbeam taps into Substrate functionality to allow for the ability to natively approve and dispatch calls from a multisig. With the Multisig Pallet, multiple signers, also referred to as signatories in Substrate, approve and dispatch transactions from an origin that is derivable deterministically from the set of signers' account IDs and the threshold number of accounts from the set that must approve calls before they can be dispatched.

This page will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the Multisig Pallet on Moonbeam.

## Multisig Pallet Interface {: #multisig-pallet-interface }

### Extrinsics {: #extrinsics }

The Multisig Pallet provides the following extrinsics (functions):

- **asMulti**(threshold, otherSignatories, maybeTimepoint, call, maxWeight) - approves and if possible dispatches a call from a composite origin formed from a number of signed origins (a multisig). If the call has been approved by enough of the other signatories, the call will be dispatched. The [`depositBase`](#constants) will be reserved if this is the first approval plus the `threshold` times the [`depositFactor`](#constants). The total reserved amount will be returned once the call is dispatched or cancelled. This function should be used if it is the final approval, otherwise you'll want to use `approveAsMulti` instead since it only requires a hash of the call
- **approveAsMulti**(threshold, otherSignatories, maybeTimepoint, callHash, maxWeight) - approves a call from a composite origin. For the final approval, you'll want to use `asMulti` instead
- **asMultiThreshold**(otherSignatories, call) - immediately dispatches a multisig call using a single approval from the caller
- **cancelAsMulti**(threshold, otherSignatories, maybeTimepoint, callHash) - cancels a preexisting, ongoing call from a composite origin. Any reserved deposit will be returned upon successful cancellation

Where the inputs that need to be provided can be defined as:

- **threshold** - the total number of approvals required for a dispatch to be executed
- **otherSignatories** - the accounts (other than the sender) who can approve the dispatch
- **maybeTimepoint** - the timepoint (block number and transaction index) of the first approval transaction, unless it is the first approval then this field must be `None`
- **call** - the call to be executed
- **callHash** - the hash of the call to be executed
- **maxWeight** - the maximum weight for the dispatch

### Storage Methods {: #storage-methods }

The Multisig Pallet includes the following read-only storage methods to obtain chain state data:

- **multisigs**() - returns the set of open multisig operations for a given account.
- **palletVersion**() - returns the current pallet version

### Pallet Constants {: #constants }

The Multisig Pallet includes the following read-only functions to obtain pallet constants:

- **depositBase**() - returns the base amount of currency needed to reserve for creating a multisig execution or to store a dispatch call for later. This is held for an additional storage item whose key size is `32 + sizeof(AccountId)` bytes, which is `32 + 20` on Moonbeam, and whose value size is `4 + sizeof((BlockNumber, Balance, AccountId))` bytes, which is `4 + 4 + 16 +20` bytes on Moonbeam
- **depositFactor**() - returns the amount of currency needed per unit threshold when creating a multisig execution. This is held for adding 20 bytes more into a preexisting storage value
- **maxSignatories**() - returns the maximum amount of signatories allowed in the multisig