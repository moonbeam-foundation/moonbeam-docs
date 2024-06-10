---
title: Referenda Pallet
description: This guide covers the available functions for the Referenda Pallet on Moonbeam, of which are used to view and submit data related to on-chain referenda
keywords: democracy, substrate, pallet, moonbeam, polkadot, voting, vote, referenda
---

# The Referenda Pallet

## Introduction {: #introduction }

The Referenda Pallet allows token holders to make, delegate, and manage Conviction-weighted votes on referenda.

Governance-related functionality is based on three new pallets and precompiles: the [Preimage Pallet](/builders/substrate/interfaces/features/governance/preimage/){target=\_blank} and [Preimage Precompile](/builders/ethereum/precompiles/features/governance/preimage/){target=\_blank}, the [Referenda Pallet](/builders/substrate/interfaces/features/governance/referenda/){target=\_blank} and [Referenda Precompile](/builders/ethereum/precompiles/features/governance/referenda/){target=\_blank}, and the [Conviction Voting Pallet](/builders/substrate/interfaces/features/governance/conviction-voting/){target=\_blank} and [Conviction Voting Precompile](/builders/ethereum/precompiles/features/governance/conviction-voting/){target=\_blank}. The aforementioned precompiles are Solidity interfaces that enable you to perform governance functions using the Ethereum API.

This guide will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the Referenda Pallet on Moonbeam. This guide assumes you are familiar with governance-related terminology, if not, please check out the [governance overview page](/learn/features/governance/#opengov){target=\_blank} for more information.

## Referenda Pallet Interface {: #preimage-pallet-interface }

### Extrinsics {: #extrinsics }

The Referenda Pallet provides the following extrinsics (functions):

- **cancel**(index) - cancels an ongoing referendum given the index of the referendum to cancel. This type of action requires a proposal to be created and assigned to either the Root Track or the Emergency Canceller Track
- **kill**(index) - cancels an ongoing referendum and slashes the deposits given the index of the referendum to cancel. This type of action requires a proposal to be created and assigned to either the Root Track or the Emergency Killer Track
- **placeDecisionDeposit**(index) - posts the Decision Deposit for a referendum given the index of the referendum
- **refundDecisionDeposit**(index) - refunds the Decision Deposit for a closed referendum back to the depositor given the index of the referendum
- **refundSubmissionDeposit**(index) - refunds the Submission Deposit for a closed referendum back to the depositor given the index of the referendum
- **submit**(proposalOrigin, proposal, enactmentMoment) - proposes a referendum on a privileged action given the Origin from which the proposal should be executed, the proposal, and the moment tht the proposal should be enacted

### Storage Methods {: #storage-methods }

The Referenda Pallet includes the following read-only storage methods to obtain chain state data:

- **decidingCount**() - returns the number of referenda being decided currently
- **palletVersion**() - returns the current pallet version
- **referendumCount**() - returns the number of referenda started so far
- **referendumInfoFor**(u32) - returns information concerning any given referendum
- **trackQueue**(u16) - returns the sorted list of referenda ready to be decided but not yet being decided on, ordered by conviction-weighted approvals. This should be empty if the deciding count is less than the maximum referenda that can be decided on

### Pallet Constants {: #constants }

The Referenda Pallet includes the following read-only functions to obtain pallet constants:

- **maxQueued**() - returns the maximum size of the referendum queue for a single Track
- **submissionDeposit**() - returns the minimum amount to be used as a deposit for a public referendum proposal 
- **tracks**() - returns information concerning the different referendum Tracks
- **undecidingTimeout**() - the number of blocks after submission that a referendum must begin being decided by. Once this passes, then anyone may cancel the referendum