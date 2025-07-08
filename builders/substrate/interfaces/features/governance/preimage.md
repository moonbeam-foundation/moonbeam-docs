---
title: Preimage Pallet
description: Learn about the available extrinsics and storage methods for the Preimage Pallet on Moonbeam, which are used to store and manage on-chain preimages.
keywords: democracy, substrate, pallet, moonbeam, polkadot, preimage
---

# The Preimage Pallet

## Introduction {: #introduction }

The Preimage Pallet allows users and the runtime to store the preimage of some encoded call data on chain. Furthermore, other pallets can use preimage hashes to store and manage large byte-blobs. For example, token holders can submit a governance proposal through the Referenda Pallet using a preimage hash of the action to be carried out.

Governance-related functionality is based on three new pallets and precompiles: the [Preimage Pallet](/builders/substrate/interfaces/features/governance/preimage/){target=\_blank} and [Preimage Precompile](/builders/ethereum/precompiles/features/governance/preimage/){target=\_blank}, the [Referenda Pallet](/builders/substrate/interfaces/features/governance/referenda/){target=\_blank} and [Referenda Precompile](/builders/ethereum/precompiles/features/governance/referenda/){target=\_blank}, and the [Conviction Voting Pallet](/builders/substrate/interfaces/features/governance/conviction-voting/){target=\_blank} and [Conviction Voting Precompile](/builders/ethereum/precompiles/features/governance/conviction-voting/){target=\_blank}. The aforementioned precompiles are Solidity interfaces that enable you to perform governance functions using the Ethereum API.

This guide will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the Preimage Pallet on Moonbeam. This guide assumes you are familiar with governance-related terminology; if not, please check out the [governance overview page](/learn/features/governance/#opengov){target=_blank} for more information.

## Preimage Pallet Interface {: #preimage-pallet-interface }

### Extrinsics {: #extrinsics }

The Preimage Pallet provides the following extrinsics (functions):

??? function "**notePreimage**(encodedProposal) - registers a preimage for an upcoming proposal, given the encoded preimage of a proposal. If the preimage was previously requested, no fees or deposits are taken for providing the preimage. Otherwise, a deposit is taken proportional to the size of the preimage. Emits a `Noted` event"

    === "Parameters"

        - `encodedProposal` - the encoded call data of the action that is being proposed. Please refer to the [How to Generate the Encoded Proposal](#generate-encoded-proposal) section for more information

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/preimage/note-preimage.js'
        ```

??? function "**requestPreimage**(bytes) - requests a preimage to be uploaded to the chain without paying any fees or deposits. Once the preimage request has been submitted on-chain, the user who submitted the preimage and deposit will get their deposit back, and they will no longer control the preimage. Must be executed by the Root Origin. Emits a `Requested` event"

    === "Parameters"

        - `bytes` - the hash of a preimage

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/preimage/request-preimage.js'
        ```

??? function "**unnotePreimage**(hash) - clears an unrequested preimage from the runtime storage, given the hash of the preimage to be removed. Emits a `Cleared` event"

    === "Parameters"

        - `hash` - the hash of a preimage

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/preimage/unnote-preimage.js'
        ```

??? function "**unrequestPreimage**(hash) - clears a previously made request for a preimage. Must be executed by the Root Origin. Emits a `Cleared` event"

    === "Parameters"

        - `hash` - the hash of a preimage

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/preimage/unrequest-preimage.js'
        ```

### Storage Methods {: #storage-methods }

The Preimage Pallet includes the following read-only storage methods to obtain chain state data:

??? function "**palletVersion**() - returns the current pallet version"

    === "Parameters"

        None.

    === "Returns"

        A number representing the current version of the pallet.

        ```js
        // If using Polkadot.js API and calling toJSON() on the query results
        0
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/preimage/pallet-version.js'
        ```

??? function "**preimageFor**([hash, length]) - returns the encoded proposal for a preimage, given the hash and length of the preimage"

    === "Parameters"

        - `[hash, length]` - a tuple containing the hash and the length of the preimage

    === "Returns"

        The encoded call data of the proposal.

        ```js
        // If using Polkadot.js API and calling toJSON() on the query results
        0x00002c68656c6c6f5f776f726c64
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/preimage/preimage-for.js'
        ```

??? function "**statusFor**(hash) - returns the request status for a given preimage hash"

    === "Parameters"

        - `hash` - the preimage hash to get the request status for

    === "Returns"

        Status information for the preimage, which includes the status, the preimage deposit information, and the length of the preimage. The status can be either `unrequested` or `requested`.

        ```js
        {
          unrequested: { // Request status
            deposit: [
              '0x3B939FeaD1557C741Ff06492FD0127bd287A421e', // Depositor
              '0x00000000000000004569f6996d8c8000' // Amount deposited
            ],
            len: 18 // Length of the preimage
          }
        }
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/preimage/status-for.js'
        ```

## How to Generate an Encoded Proposal {: #generate-encoded-proposal }

To generate an encoded proposal, you must first create the extrinsic that will be run if the proposal passes the governance process. Instead of attempting to send the extrinsic, you'll obtain the SCALE-encoded hash of the extrinsic, which you'll use to submit the preimage.

For example, if you wanted to set an on-chain remark that said "Hello World," you could generate the encoded call data using the following snippet:

```js
--8<-- 'code/builders/pallets-precompiles/pallets/preimage/generate-encoded-call-data.js'
```

Then, you can use the encoded call data to submit the preimage for the proposal:

```js
--8<-- 'code/builders/pallets-precompiles/pallets/preimage/submit-encoded-call-data.js'
```
