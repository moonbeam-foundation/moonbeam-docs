---
title: Parameters Pallet
description: Learn how Moonbeam's Parameters Pallet safely and dynamically modifies network config items via on-chain governance, removing the need for runtime upgrades.
---

# The Parameters Pallet

## Introduction {: #introduction }

The Parameters Pallet on Moonbeam is a governance-focused module that enables community-driven modifications to key network configuration items, such as the deposit requirement for the randomness module, directly on-chain through proposals and votes, without necessarily requiring a runtime upgrade. By removing the need for frequent code changes, the Parameters Pallet allows the network to respond more quickly to evolving needs while maintaining transparency and consensus.

This guide will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the Parameters Pallet on Moonbeam. This guide assumes you are familiar with governance-related terminology; if not, please check out the [governance overview page](/learn/features/governance/#opengov){target=_blank} for more information.

## Parameters Pallet Interface {: #parameter-pallet-interface }

### Extrinsics {: #extrinsics }

The Parameters Pallet provides one extrinsic (functions):

???+ function "**setParameter**(keyValue) - sets the value of a parameter"

    === "Parameters"

        - `keyValue` - the key to the storage item to be modified

    === "Example"

        Suppose you want to adjust the deposit parameter for the randomness pallet. You'd start by crafting a call to the `setParameter` function, specifying the randomness pallet's key and the new deposit value. In Polkadot.js Apps, this involves selecting `parameters.setParameter(keyValue)` and then updating the deposit field for `PalletRandomness`. While you can generate and review this call data beforehand, the actual change must still go through the governance process—meaning it needs to be proposed, voted on, and approved by the community before the new deposit value takes effect on-chain

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/parameters/set_parameter.js'
        ```

### Storage Methods {: #storage-methods }

The Parameters Pallet includes the following read-only storage methods to obtain chain state data:

???+ function "**parameters**(parameters) - when queried with a parameter key, it returns either the corresponding value variant (e.g., RuntimeConfig with FeesTreasuryProportion) or None if no value is set."

    === "Parameters"

        - `parameters` - the name of the pallet combined with the specific key identifying the storage item to retrieve

    === "Returns"

        The parameters.parameters(...) storage method is a dictionary that stores dynamic runtime parameters under specific keys. When queried with a parameter key, it returns either the corresponding value variant (e.g., `RuntimeConfig` with `FeesTreasuryProportion`) or None if no value is set

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/parameters/get_storage_item.js'
        ```

??? function "**palletVersion**() - returns the current pallet version"

    === "Parameters"

        None

    === "Returns"

        A number representing the current version of the pallet

        ```js
        // If using Polkadot.js API and calling toJSON() on the query results
        0
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/parameters/pallet_version.js'
        ```

### Pallet Constants {: #constants }

The Parameters Pallet does not have any constants.
