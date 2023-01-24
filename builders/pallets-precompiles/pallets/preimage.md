---
title: Preimage Pallet
description: Learn about the available extrinsics and storage methods for the preimage pallet on Moonbeam, which are used to store and manage on-chain preimages.
keywords: democracy, substrate, pallet, moonbeam, polkadot, preimage
---

# The Preimage Pallet

![Preimage Moonbeam Banner](/images/builders/pallets-precompiles/pallets/preimage-banner.png)

## Introduction {: #introduction }

The preimage pallet allows for the users and the runtime to store the preimage of a hash on chain. This can be used by other pallets for storing and managing large byte-blobs. For example, token holders can submit a democracy proposal through the democracy pallet using a preimage hash. 

Some of the functionality of the preimage pallet is also available through the democracy precompile. The precompile is a Solidity interface that enables you to perform governance functions using the Ethereum API. Please refer to the [Democracy Precompile](/builders/pallets-precompiles/precompiles/democracy){target=_blank} guide for more information.

This guide will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the preimage pallet on Moonbeam.

## Preimage Pallet Interface {: #preimage-pallet-interface }

### Extrinsics {: #extrinsics }

The preimage pallet provides the following extrinsics (functions):

- **notePreimage**(encodedProposal) - registers a preimage for an upcoming proposal given the encoded preimage of a proposal. If the preimage was previously requested, no fees or deposits are taken for providing the preimage. Otherwise, a deposit is taken proportional to the size of the preimage. Emits a `Noted` event
- **requestPreimage**(bytes) - requests a preimage to be uploaded to the chain without paying any fees or deposits. If the preimage request has already been provided on-chain by a user, their related deposit is unreserved, and they no longer control the preimage. Emits a `Requested` event
- **unnotePreimage**(hash) - clears an unrequested preimage from the runtime storage given the hash of the preimage to be removed. Emits a `Cleared` event
- **unrequestPreimage**(hash) - clears a previously made request for a preimage. Emits a `Cleared` event

### Storage Methods {: #storage-methods }

The preimage pallet includes the following read-only storage methods to obtain chain state data:

- **palletVersion**() - returns the current pallet version
- **preimageFor**((H256, u32)) - returns a list of the proposal hashes of all preimages along with their associated data. If given a proposal hash and the length of the associated data, a specific preimage is returned
- **statusFor**(H256) - returns the request status of all preimages or for a given preimage hash 
