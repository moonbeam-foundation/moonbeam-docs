---
title: Identity Pallet
description: This guide covers the available functions in the Identity Pallet on Moonbeam, which are used to create and manage on-chain identities.
---

# The Identity Pallet

## Introduction {: #introduction }

The [Substrate](/learn/platform/technology/#substrate-framework){target=\_blank} Identity Pallet is an out-of-the-box solution for adding personal information to your on-chain account. Personal information can include default fields such as your legal name, display name, website, Twitter handle, and Riot (now known as Element) name. You can also take advantage of custom fields to include any other relevant information.

The pallet also includes functionality to request judgments and verify on-chain identities from registrars, which are accounts appointed via governance to verify the identity information submitted and provide judgment on their findings for a fee.

This guide will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the Identity Pallet on Moonbeam. This guide assumes you are familiar with identity-related terminology; if not, please check out the [Managing your Account Identity](/tokens/manage/identity){target=\_blank} page for more information.

## Identity Pallet Interface {: #preimage-pallet-interface }

### Extrinsics {: #extrinsics }

The Identity Pallet provides the following extrinsics (functions):

- **addRegistrar**(account) - adds an account as a registrar
- **addSub**(sub, data) - adds an account as a sub-account of the caller
- **cancelRequest**(regIndex) - cancels the caller's request for judgment from a given registrar
- **clearIdentity**() - clears the identity for the caller
- **killIdentity**(target) - removes an account's identity and sub-accounts
- **provideJudgement**(regIndex, target, judgement, identity) - provides judgment on an account's identity.  The caller must be the registrar account that corresponds to the `index`
- **quitSub**() - removes the caller as a sub identity account
- **removeSub**(sub) - removes a sub-identity account for the caller
- **renameSub**(sub) - renames a sub-identity account for the caller
- **requestJudgement**(regIndex, maxFee) - requests judgment from a given registrar along with the maximum fee the caller is willing to pay
- **setAccountId**(index, new) - sets a new account for a registrar. The caller must be the registrar account that corresponds to the `index`
- **setFee**(index, fee) - sets the fee for a registar. The caller must be the registrar account that corresponds to the `index`
- **setFields**(index, fields) - sets the registrar's identity. The caller must be the registrar account that corresponds to the `index`
- **setIdentity**(info) - sets the identity for the caller
- **setSubs**(subs) - sets the sub-accounts for the caller

### Storage Methods {: #storage-methods }

The Identity Pallet includes the following read-only storage methods to obtain chain state data:

- **identityOf**(AccountId20) - returns identity information for all accounts or for a given account
- **palletVersion**() - returns the current pallet version
- **registrars**() - returns the set of registrars
- **subsOf**(AccountId20) - returns the sub identities for all accounts or for a given account
- **superOf**(AccountId20) - returns the super identity of all sub-accounts or for a given sub-account

### Pallet Constants {: #constants }

The Identity Pallet includes the following read-only functions to obtain pallet constants:

- **basicDeposit**() - returns the amount held on deposit for a registered identity
- **fieldDeposit**() - returns the amount held on deposit per additional field for a registered identity
- **maxAdditionalFields**() - returns the maximum number of fields that can be stored in an ID
- **maxRegistrars**() - returns the maximum number of registrars allowed in the system
- **maxSubAccounts**() - returns the maximum number of sub-accounts allowed per account
- **subAccountDeposit**() - returns the amount held on deposit for a registered sub-account
