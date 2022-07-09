---
title: Utility Pallet
description: Learn about the available extrinsics for the utility pallet on Moonbeam and how to interact with them using Polkadot.js Apps and the Polkadot.js API.
keywords: utility, batch, substrate, pallet, moonbeam, polkadot
---

# The Utility Pallet

## Introduction {: #introduction }

Through Substrate's utility pallet, users on Moonbeam can include multiple calls into a single transaction and use derivative accounts to send calls.

Some of the functionality of the utility pallet is also available through a batch precompile. The precompile is a Solidity interface that enables you to perform batch calls using the Ethereum API. Please refer to the [Batch Precompile](/builders/build/precompiles/batch){target=_blank} guide for more information.

This guide will provide an overview of the extrinsics and getters for the pallet constants available in the utility pallet on Moonbeam.

## Utility Pallet Interface {: #utility-pallet-interface }

### Extrinsics {: #extrinsics }

The utility pallet provides the following extrinsics (functions):

- **asDerivative**(index, call) - sends a call through an indexed pseudonym of the sender given the index number and the call
- **batch**(calls) - sends a batch of calls to be dispatched. The number of calls must not exceed the [limit](#constants)
- **batchAll**(calls) - sends a batch of calls to be dispatched and atomically execute them. If one of the calls fail, the entire transaction will fail. The number of calls must not exceed the [limit](#constants)
- **dispatchAs**(asOrigin, call) - dispatches a function call provided an origin and the call to be dispatched. The dispatch origin for this call must be `Root`

### Pallet Constants {: #constants }

The utility pallet includes the following read-only functions to obtain pallet constants:

- **batchedCallsLimit**() - returns the limit on the number of batched calls