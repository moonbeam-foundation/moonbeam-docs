---
title: Identity Pallet
description: This guide covers the available functions in the Identity Pallet on Moonbeam, which are used to create and manage on-chain identities.
categories: Substrate Toolkit
---

# The Identity Pallet

## Introduction {: #introduction }

The [Substrate](/learn/platform/glossary/#substrate){target=\_blank} Identity Pallet is an out-of-the-box solution for adding personal information to your on-chain account. Personal information can include default fields such as your legal name, display name, website, Twitter handle, and Riot (now known as Element) name. You can also take advantage of custom fields to include any other relevant information.

The pallet also includes functionality to request judgments and verify on-chain identities from registrars, which are accounts appointed via governance to verify the identity information submitted and provide judgment on their findings for a fee.

This guide will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the Identity Pallet on Moonbeam. This guide assumes you are familiar with identity-related terminology; if not, please check out the [Managing your Account Identity](/tokens/manage/identity/){target=\_blank} page for more information.

## Identity Pallet Interface {: #preimage-pallet-interface }

### Extrinsics {: #extrinsics }

The Identity Pallet provides the following extrinsics (functions):

??? function "**addRegistrar**(account) - adds an account as a registrar. Must be executed by the General Admin Origin"

    === "Parameters"

        - `account` - the account to add as a registrar

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/add-registrar.js'
        ```

??? function "**addSub**(sub, data) - adds an account as a sub-account of the caller. You can optionally provide a name for the sub-account. This function is not callable via a `NonTransfer` proxy. You can sign the transaction directly or use a different [proxy type](/tokens/manage/proxy-accounts/#proxy-types){target=\_blank} (`Any`, `IdentityJudgement`, etc.)" 

    === "Parameters"

        - `sub` - the account to add as a sub-account
        - `data` - an object that specifies the name of the sub-account, where the key is the data type and the value is the data. You can use any of the following data types to define the name of the sub-account:
            - `None` - no name should be used
            - `Raw` - a raw value using hex or ascii
            - `BlakeTwo256` - a BLAKE2-256 hash value
            - `Sha256` - a SHA-256 value
            - `Keccak256` - a Keccak-256 value
            - `ShaThree256` - a SHA3-256 value

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/add-sub.js'
        ```

??? function "**cancelRequest**(regIndex) - cancels the caller's request for judgment from a given registrar"

    === "Parameters"

        - `regIndex` - the index of the registrar

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/cancel-request.js'
        ```

??? function "**clearIdentity**() - clears the identity for the caller"

    === "Parameters"

        None.

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/clear-identity.js'
        ```

??? function "**killIdentity**(target) - removes an account's identity and sub-accounts. Must be executed by the General Admin Origin"

    === "Parameters"

        - `target` - the account to remove the identity and sub-accounts for

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/kill-identity.js'
        ```

??? function "**provideJudgement**(regIndex, target, judgement, identity) - provides judgment on an account's identity.  The caller must be the registrar account that corresponds to the `index`. Must be executed by a registrar"

    === "Parameters"

        - `regIndex` - the index of the registrar submitting the judgement
        - `target` - the account to provide the judgment for
        - `judgement` - the judgement or level of confidence in the identity information provided. There are seven levels of confidence, you can either provide the name or the index of the confidence level:
            - `Unknown` or `0` - no judgement made yet. This is the default value
            - `FeePaid` or `1` - indicates a user has requested judgement and it is in progress
            - `Reasonable` or `2` - the information appears reasonable, but no in-depth checks were performed using legal identity documents
            - `KnownGood` or `3` - the information is correct and is based upon review of legal identity documents
            - `OutOfDate` or `4` - the information used to be good, but is now out of date
            - `LowQuality` or `5` - the information is low quality or imprecise, but can be updated as needed
            - `Erroneous` or `6` - the information is erroneous and may indicate malicious intent. This state cannot be modified and can only be removed if the entire identity has been removed
        - `identity` - the 32-byte hash of the identity

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/provide-judgement.js'
        ```

??? function "**quitSub**() - removes the caller as a sub-identity account"

    === "Parameters"

        None.

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/quit-sub.js'
        ```

??? function "**removeSub**(sub) - removes a sub-identity account for the caller"

    === "Parameters"

        - `sub` - the sub-identity account to remove

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/remove-sub.js'
        ```

??? function "**renameSub**(sub) - renames a sub-identity account for the caller"

    === "Parameters"

        - `sub` - the sub-identity account to rename

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/rename-sub.js'
        ```

??? function "**requestJudgement**(regIndex, maxFee) - requests judgment from a given registrar along with the maximum fee the caller is willing to pay"

    === "Parameters"

        - `regIndex` - the index of the registrar to request judgement from
        - `maxFee` - the maximum fee in Wei that can be paid to the registrar for providing judgement

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/request-judgement.js'
        ```

??? function "**setAccountId**(index, new) - sets a new account for an existing registrar. Must be executed by the registrar account that corresponds to the `index`."

    === "Parameters"

        - `index` - the index of the registrar
        - `new` - the account to set as the registrar's new account

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/set-account-id.js'
        ```

??? function "**setFee**(index, fee) - sets the fee for a registar. Must be executed by the registrar account that corresponds to the `index`"

    === "Parameters"

        - `index` - the index of the registrar
        - `fee` - the fee in Wei required to be paid to the registrar for a judgement

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/set-fee.js'
        ```

??? function "**setFields**(index, fields) - sets the fields that a registrar cares about when providing judgements. Must be executed by the registrar account that corresponds to the `index`"

    === "Parameters"

        - `index` - the index of the registrar
        - `fields` - an array of the fields that the registrar cares about. The fields can be any of the following:
            - `Display` - a display name
            - `Legal` - a legal name
            - `Web` - a website
            - `Riot` - a Riot username
            - `Email` - an email address
            - `PpgFingerprint` - a PPG fingerprint
            - `Image` - an image
            - `Twitter` - a Twitter username

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/set-fields.js'
        ```

??? function "**setIdentity**(info) - sets the identity for the caller"

    === "Parameters"

        - `info` - the identity information. The identity information can include any of the following optional fields:
            - `display` - a display name
            - `legal` - a legal name
            - `web` - a website
            - `riot` - a Riot username
            - `email` - an email address
            - `ppgFingerprint` - a PPG fingerprint
            - `image` - an image
            - `twitter` - a Twitter username
            - `additional` - an array that contains custom fields for additional information. Each additional item is represented as an array that contains two objects: one for the field name and one for the field value. You can define the additional field names and values in the following formats:
                - `None` - no additional information should be used
                - `Raw` - a raw value using hex or ascii
                - `BlakeTwo256` - a BLAKE2-256 hash value
                - `Sha256` - a SHA-256 value
                - `Keccak256` - a Keccak-256 value
                - `ShaThree256` - a SHA3-256 value
            
        When setting an identity, a deposit is required. If setting additional fields, an additional deposit will be required per each additional field. For more information, please refer to the [Manage an Identity](/tokens/manage/identity#general-definitions){target=_blank} documentation.
  
    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/set-identity.js'
        ```

??? function "**setSubs**(subs) - sets the sub-accounts for the caller. This function is not callable via a `NonTransfer` proxy. You can sign the transaction directly or use a different [proxy type](/tokens/manage/proxy-accounts/#proxy-types){target=\_blank} (`Any`, `IdentityJudgement`, etc.)"

    === "Parameters"

        - `subs` - an array that defines the sub-accounts. Each sub-account is represented as an array itself, with the address of the sub-account as the zero index and the name as the first index. The name is an object that can be defined in the following formats:
            - `None` - no additional information should be used
            - `Raw` - a raw value using hex or ascii
            - `BlakeTwo256` - a BLAKE2-256 hash value
            - `Sha256` - a SHA-256 value
            - `Keccak256` - a Keccak-256 value
            - `ShaThree256` - a SHA3-256 value

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/set-subs.js'
        ```

### Storage Methods {: #storage-methods }

The Identity Pallet includes the following read-only storage methods to obtain chain state data:

??? function "**authorityOf**(account) – returns authority properties for a given account"

    === "Parameters"

        - `account` – the 20-byte account ID (`AccountId20`) you want to inspect.

    === "Returns"

        An `Option<PalletIdentityAuthorityProperties>`

        If the supplied account **is not** a username-granting authority, the call returns `null`.

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/authority.js'
        ```

??? function "**identityOf**(account) - returns identity information for a given account"

    === "Parameters"

        - `account` - the account to get identity information for

    === "Returns"

        Identity information for the given account, including judgments (if the account has requested a judgment from a registrar), the deposit is held for the identity and the identity information. If the account does not have an identity set, `null` is returned.

        ```js
        // If using Polkadot.js API and calling toJSON() on the query results
        {
          judgements: [],
          deposit: '0x00000000000000000e53d254821d0000',
          info: {
            additional: [ [Array] ],
            display: { raw: '0x416c697468' },
            legal: { none: null },
            web: { none: null },
            riot: { none: null },
            email: { raw: '0x616c69746840616c6974682e636f6d' },
            pgpFingerprint: null,
            image: { none: null },
            twitter: { none: null }
          }
        }
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/identity-of.js'
        ```

??? function "**palletVersion**() - returns the current pallet version"

    === "Parameters"

        None

    === "Returns"

        The version of the pallet, e.g. `1`

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/pallet-version.js'
        ```

??? function "**pendingUsernames**(username) - returns information for a pending username"

    === "Parameters"

        - `username` – the username to query.  
          Pass it as a `Bytes` value (hex-encoded or plain ASCII).

    === "Returns"

        An `Option` that is:

        - `null` – if the username is **not** pending, or  
        - `(AccountId20, u32, PalletIdentityProvider)` – when pending, where  
            - `AccountId20` is the account that has been offered the username  
            - `u32` is the **block number deadline** by which the account must accept it  
            - `PalletIdentityProvider` is the authority that issued the username

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/pending-usernames.js'
        ```

??? function "**registrars**() - returns the set of registrars"

    === "Parameters"

        None

    === "Returns"

        The set of registrators as a vector

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/registrars.js'
        ```

??? function "**subsOf**(AccountId20) - returns the sub-identities for all accounts or a given account"

    === "Parameters"

        - `AccountId20` the account to check the sub-identities for

    === "Returns"

        The sub-identities, if any.

        ```
        Raw subs response: [0,[]]
            Formatted Subs: {
              "deposit": "0",
              "subAccounts": []
            }
            Number of sub-accounts: 0
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/subs-of.js'
        ```

??? function "**superOf**(AccountId20) - returns the super identity of all sub-accounts or for a given sub-account"

    === "Parameters"

        - `AccountId20` - the account to check the super identities of

    === "Returns"

        The super identities, if any.

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/super-of.js'
        ```

??? function "**unbindingUsernames**(username) – returns the block height at which a username being revoked will be released"

    === "Parameters"

        - `username` – the username to inspect, supplied as `Bytes` (plain ASCII or hex).

    === "Returns"

        An `Option<u32>`: it is `null` when the username is **not** in the unbinding process; otherwise it contains the block number after which the username becomes free to claim again.

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/unbinding-usernames.js'
        ```

??? function "**usernameInfoOf**(username) – returns information for a given username"

    === "Parameters"

        - `username` – the username to look up.  
          Supply it as a `Bytes` value (plain ASCII or hex).

    === "Returns"

        An `AccountId20` of the Account currently bound to the username and a provider value, i.e., the authority that issued the username.

        If the username is **unregistered**, the call returns `null`.

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/username-info-of.js'
        ```

??? function "**usernameOf**(account) – returns the primary username bound to an account"

    === "Parameters"

        - `account` – the `AccountId20` you want to query.

    === "Returns"

        Returns an `Option<Bytes>`: it is null when the account has no primary username; otherwise, it contains a Bytes value with the UTF-8 (or hex-encoded) string of the account’s primary username.

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/username-of.js'
        ```

### Pallet Constants {: #constants }

The Identity Pallet includes the following read-only functions to obtain pallet constants:

??? function "**basicDeposit**() - returns the amount held on deposit for a registered identity"

    === "Parameters"

        None

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/basic-deposit.js'
        ```

    === "Example Response"

        ```bash
        Raw basicDeposit response: 1025800000000000000
        Basic Deposit (formatted): 1,025,800,000,000,000,000
        ```

??? function "**byteDeposit**() - returns the amount held on deposit per additional bytes of data for a registered identity"

    === "Parameters"

        None


    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/byte-deposit.js'
        ```

    === "Example Response"
        ```
        Raw byteDeposit response: 100000000000000
        Byte Deposit (formatted): 100,000,000,000,000
        ```

??? function "**maxRegistrars**() - returns the maximum number of registrars allowed in the system"

    === "Parameters"
        None
    === "Returns"
        - `u32` - Maximum number of registrars allowed
    === "Polkadot.js API Example"
        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/max-registrars.js'
        ```

??? function "**maxSubAccounts**() - returns the maximum number of sub-accounts allowed per account"

    === "Parameters"
        None
    === "Returns"
        - `u32` - Maximum number of sub-accounts allowed per identity
    === "Polkadot.js API Example"
        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/max-subaccounts.js'
        ```

??? function "**subAccountDeposit**() - returns the amount held on deposit for a registered sub-account"

    === "Parameters"
        None
    === "Returns"
        - `Balance` - Amount of currency held on deposit for a sub-account
    === "Polkadot.js API Example"
        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/subaccount-deposit.js'
        ```

??? function "**pendingUsernameExpiration**() - returns the time period for which a username remains pending"

    === "Parameters"
        None
    === "Returns"
        - `BlockNumber` - Number of blocks before a pending username expires
    === "Polkadot.js API Example"
        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/pending-username-exp.js'
        ```

??? function "**maxSuffixLength**() - returns the maximum length allowed for a username suffix"

    === "Parameters"
        None
    === "Returns"
        - `u32` - Maximum number of characters allowed in a username suffix
    === "Polkadot.js API Example"
        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/max-suffix-length.js'
        ```

??? function "**maxUsernameLength**() - returns the maximum length allowed for a username"
    === "Parameters"
        None
    === "Returns"
        - `u32` - Maximum number of characters allowed in a username
    === "Polkadot.js API Example"
        ```js
        --8<-- 'code/builders/substrate/interfaces/account/identity/max-username-length.js'
        ```
