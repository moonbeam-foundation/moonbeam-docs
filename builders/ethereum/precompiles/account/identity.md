---
title: Identity Precompile
description: Learn all you need to know about the Identity Precompile, such as its address, Solidity interface, and how to interact with it using popular Ethereum libraries.
---

# Identity Precompile on Moonbeam

## Introduction {: #introduction }

The Identity Precompile is a Solidity interface that allows you to create, manage, and retrieve information on on-chain identities. Identities are attached to accounts and include personal information, such as your legal name, display name, website, Twitter handle, Riot (now known as Element) name, and more. You can also take advantage of custom fields to include any other relevant information.

The Identity Precompile interacts directly with Substrate's [Identity Pallet](/builders/substrate/interfaces/account/identity/){target=\_blank} to provide the functionality needed to create and manage identities. This pallet is coded in Rust and is normally not accessible from the Ethereum side of Moonbeam. However, the Identity Precompile allows you to access this functionality directly from the Solidity interface.

The Identity Precompile is located at the following address:

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.identity }}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.identity }}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.identity }}
     ```

--8<-- 'text/builders/ethereum/precompiles/security.md'

## The Identity Precompile Solidity Interface {: #the-solidity-interface }

[`Identity.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/identity/Identity.sol){target=\_blank} is a Solidity interface that allows developers to interact with the precompile's methods.

??? code "Identity.sol"

    ```solidity
    --8<-- 'code/builders/ethereum/precompiles/account/identity/Identity.sol'
    ```

The Identity Precompile contains some functions that can be called by anyone and some judgment-related functions that can only be called by a registrar. The functions that can be called by anyone are as follows:

??? function "**identity**(*address* who) - returns registration information for a given account"

    === "Parameters"

        - `who` - address of the account to query the identity information for

??? function "**superOf**(*address* who) - retrieves the super account for a sub-account. If the given account is not a sub-account, the address returned is `0x0000000000000000000000000000000000000000`"

    === "Parameters"

        - `who` - address of the account to query the super-account for

??? function "**subsOf**(*address* who) - returns the sub-accounts for a given account. If the given account doesn't have any sub-accounts, an empty array is returned (`[]`)"

    === "Parameters"

        - `who` - address of the account to query the sub-accounts for

??? function "**registrars**() - returns the list of registrars"

    === "Parameters"

        None.

??? function "**setIdentity**(*IdentityInfo memory* info) - sets the identity for the caller"

    === "Parameters"

        - `info` - IdentityInfo memory struct containing the identity information to be set

??? function "**setSubs**(*SubAccount[] memory* subs) - sets the sub-accounts for the caller"

    === "Parameters"

        - `subs` - SubAccount[] memory array containing the sub-accounts to be set

??? function "**clearIdentity**() - clears the identity for the caller"

    === "Parameters"

        None.

??? function "**requestJudgement**(*uint32* regIndex, *uint256* maxFee) - requests judgment from a given registrar along with the maximum fee the caller is willing to pay"

    === "Parameters"

        - `regIndex` - uint32 index of the registrar to request judgment from
        - `maxFee` - uint256 maximum fee the caller is willing to pay for the judgment

??? function "**cancelRequest**(*uint32* regIndex) - cancels the caller's request for judgment from a given registrar"

    === "Parameters"

        - `regIndex` - uint32 index of the registrar to cancel the judgment request from

??? function "**addSub**(*address* sub, *Data memory* data) - adds a sub-identity account for the caller"

    === "Parameters"

        - `sub` - address of the sub-account to add
        - `data` - Data memory struct containing the sub-account information

??? function "**renameSub**(*address* sub, *Data memory* data) - renames a sub-identity account for the caller"

    === "Parameters"

        - `sub` - address of the sub-account to rename
        - `data` - Data memory struct containing the new sub-account information

??? function "**removeSub**(*address* sub) - removes a sub identity account for the caller"

    === "Parameters"

        - `sub` - address of the sub-account to remove

??? function "**quitSub**(*address* sub) - removes the caller as a sub-identity account"

    === "Parameters"

        - `sub` - address of the sub-account to quit



The judgment-related functions that must be called by a registrar and the caller must be the registrar account that corresponds to the `regIndex` are:

??? function "**setFee**(*uint32* regIndex, *uint256* fee) - sets the fee for a registar"

    === "Parameters"

        - `regIndex` - uint32 index of the registrar setting the fee
        - `fee` - uint256 new fee amount to be set for the registrar

??? function "**setAccountId**(*uint32* regIndex, *address* newAccount) - sets a new account for a registrar"

    === "Parameters"

        - `regIndex` - uint32 index of the registrar being updated
        - `newAccount` - address of the new account to be set for the registrar

??? function "**setFields**(*uint32* regIndex, *IdentityFields memory* fields) - sets the registrar's identity"

    === "Parameters"

        - `regIndex` - uint32 index of the registrar setting their identity fields
        - `fields` - IdentityFields memory struct containing the identity fields to be set

??? function "**provideJudgement**(*uint32* regIndex, *address* target, *Judgement memory* judgement, *bytes32* identity) - provides judgment on an account's identity"

    === "Parameters"

        - `regIndex` - uint32 index of the registrar providing the judgment
        - `target` - address of the account receiving the judgment
        - `judgement` - Judgement memory struct containing the judgment details
        - `identity` - bytes32 hash of the identity information being judged


## Interact with the Solidity Interface {: #interact-with-interface }

The following sections will cover how to interact with the Identity Precompile using [Ethereum libraries](/builders/ethereum/libraries/){target=\_blank}, such as [Ethers.js](/builders/ethereum/libraries/ethersjs/){target=\_blank}, [Web3.js](/builders/ethereum/libraries/web3js/){target=\_blank}, and [Web3.py](/builders/ethereum/libraries/web3py/){target=\_blank}.

The examples in this guide will be on Moonbase Alpha.
--8<-- 'text/_common/endpoint-examples.md'

### Using Ethereum Libraries {: #use-ethereum-libraries }

To interact with the Identity Precompile's Solidity interface with an Ethereum library, you'll need the Identity Precompile's ABI.

??? code "Identity Precompile ABI"

    ```js
    --8<-- 'code/builders/ethereum/precompiles/account/identity/abi.js'
    ```

Once you have the ABI, you can interact with the precompile using the Ethereum library of your choice. Generally speaking, you'll take the following steps:

1. Create a provider
2. Create a contract instance of the Identity Precompile
3. Interact with the Identity Precompile's functions

In the examples below, you'll learn how to assemble the data required to set an identity, how to set an identity, and how to retrieve the identity information once it's been set.

!!! remember
    The following snippets are for demo purposes only. Never store your private keys in a JavaScript or Python file.

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/ethereum/precompiles/account/identity/ethers.js'
    ```

=== "Web3.js"

    ```js
    --8<-- 'code/builders/ethereum/precompiles/account/identity/web3.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/ethereum/precompiles/account/identity/web3.py'
    ```
