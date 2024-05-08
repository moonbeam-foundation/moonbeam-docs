---
title: Preimage Pallet
description: Learn about the available extrinsics and storage methods for the Preimage Pallet on Moonbeam, which are used to store and manage on-chain preimages.
keywords: democracy, substrate, pallet, moonbeam, polkadot, preimage
---

# The Preimage Pallet

## Introduction {: #introduction }

The Preimage Pallet allows for the users and the runtime to store the preimage of a hash on chain. This can be used by other pallets for storing and managing large byte-blobs. For example, token holders can submit a democracy proposal through the Democracy Pallet using a preimage hash.

Governance-related functionality is based on three new pallets and precompiles: the [Preimage Pallet](/builders/pallets-precompiles/pallets/preimage/){target=\_blank} and [Preimage Precompile](/builders/pallets-precompiles/precompiles/preimage/){target=\_blank}, the [Referenda Pallet](/builders/pallets-precompiles/pallets/referenda/){target=\_blank} and [Referenda Precompile](/builders/pallets-precompiles/precompiles/referenda/){target=\_blank}, and the [Conviction Voting Pallet](/builders/pallets-precompiles/pallets/conviction-voting/){target=\_blank} and [Conviction Voting Precompile](/builders/pallets-precompiles/precompiles/conviction-voting/){target=\_blank}. The aforementioned precompiles are Solidity interfaces that enable you to perform governance functions using the Ethereum API.

This guide will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the Preimage Pallet on Moonbeam. This guide assumes you are familiar with governance-related terminology, if not, please check out the [governance overview page](/learn/features/governance/#opengov){target=\_blank} for more information.

## Preimage Pallet Interface {: #preimage-pallet-interface }

### Extrinsics {: #extrinsics }

The Preimage Pallet provides the following extrinsics (functions):

- **notePreimage**(encodedProposal) - registers a preimage for an upcoming proposal given the encoded preimage of a proposal. If the preimage was previously requested, no fees or deposits are taken for providing the preimage. Otherwise, a deposit is taken proportional to the size of the preimage. Emits a `Noted` event
- **requestPreimage**(bytes) - requests a preimage to be uploaded to the chain without paying any fees or deposits. If the preimage request has already been provided on-chain by a user, their related deposit is unreserved, and they no longer control the preimage. Emits a `Requested` event
- **unnotePreimage**(hash) - clears an unrequested preimage from the runtime storage given the hash of the preimage to be removed. Emits a `Cleared` event
- **unrequestPreimage**(hash) - clears a previously made request for a preimage. Emits a `Cleared` event

### Storage Methods {: #storage-methods }

The Preimage Pallet includes the following read-only storage methods to obtain chain state data:

- **palletVersion**() - returns the current pallet version
- **preimageFor**((H256, u32)) - returns a list of the proposal hashes of all preimages along with their associated data. If given a proposal hash and the length of the associated data, a specific preimage is returned
- **statusFor**(H256) - returns the request status of all preimages or for a given preimage hash 
