---
title: Conviction Voting Pallet
description: This guide covers the available functions in the Conviction Voting Pallet on Moonbeam, of which are used to vote, delegate votes, remove votes, and more.
keywords: democracy, substrate, pallet, moonbeam, polkadot, voting, vote, referenda
---

# The Conviction Voting Pallet

## Introduction {: #introduction }

The Conviction Voting Pallet allows token holders to make, delegate, and manage Conviction-weighted votes on referenda.

Governance-related functionality is based on three new pallets and precompiles: the [Preimage Pallet](/builders/pallets-precompiles/pallets/preimage/){target=\_blank} and [Preimage Precompile](/builders/pallets-precompiles/precompiles/preimage/){target=\_blank}, the [Referenda Pallet](/builders/pallets-precompiles/pallets/referenda/){target=\_blank} and [Referenda Precompile](/builders/pallets-precompiles/precompiles/referenda/){target=\_blank}, and the [Conviction Voting Pallet](/builders/pallets-precompiles/pallets/conviction-voting/){target=\_blank} and [Conviction Voting Precompile](/builders/pallets-precompiles/precompiles/conviction-voting/){target=\_blank}. The aforementioned precompiles are Solidity interfaces that enable you to perform governance functions using the Ethereum API.

This guide will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the Conviction Voting Pallet on Moonbeam. This guide assumes you are familiar with governance-related terminology, if not, please check out the [governance overview page](/learn/features/governance/#opengov){target=\_blank} for more information.

## Conviction Voting Pallet Interface {: #preimage-pallet-interface }

### Extrinsics {: #extrinsics }

The Conviction Voting Pallet provides the following extrinsics (functions):

- **delegate**(class, to, conviction, balance) - delegate the voting power (with some given Conviction) to another account for a particular class (Origin) of polls (referenda). The balance delegated is locked for as long as it's delegated, and thereafter for the time appropriate for the Conviction's lock period. Emits a `Delegated` event
- **removeOtherVote**(target, class, index) - removes a vote for a poll (referendum). If the `target` is equal to the signer, then this function is exactly equivalent to `removeVote`. If not equal to the signer, then the vote must have expired, either because the poll was cancelled, the voter lost the poll or because the conviction period is over
- **removeVote**(class, index) - Removes a vote for a poll. This can occur if one of the following is true:
    - If the poll was cancelled, tokens are immediatly available for unlocking if there is no other pending lock
    - If the poll is ongoing, the token holder's votes do not longer count for the tallying, tokens are immediatly available for unlocking if there is no other pending lock
    - If the poll has ended, there are two different scenarios:
        - If the token holder voted against the tallied result or voted with no conviction, the tokens are immediatly available for unlocking if there is no other pending lock
        - If, however, the poll has ended and the results coincides with the vote of the token holder (with a given conviction), and the lock period of the Conviction is not over, then the lock will be aggregated into the overall account's lock. This may involve _overlocking_ (where the two locks are combined into a single lock that is the maximum of both the amount locked and the time is it locked for)

- **undelegate**(class) - undelegates the voting power for a particular class (Origin) of polls (referenda). Tokens may be unlocked following once an amount of time consistent with the lock period of the conviction with which the delegation was issued. Emits an `Undelegated` event
- **unlock**(class, target) - removes a lock for a prior vote/delegation vote within a particluar class (Origin), which has expired
- **vote**(pollIndex, vote) - submits a vote in a poll (referendum). If the vote is "Aye", the vote is to enact the proposal; otherwise, it is a "Nay" vote to keep the status quo

### Storage Methods {: #storage-methods }

The Conviction Voting Pallet includes the following read-only storage methods to obtain chain state data:

- **classLocksFor**(AccountId20) - returns the voting classes (Origins), which have a non-zero lock requirement and the lock amounts which they require
- **palletVersion**() - returns the current pallet version
- **votingFor**(AccountId20, u16) - returns all of the votes for a particular voter in a particular voting class (Origin)

### Pallet Constants {: #constants }

The Conviction Voting Pallet includes the following read-only functions to obtain pallet constants:

- **maxVotes**() - returns the maximum number of concurrent votes an account may have
- **voteLockingPeriod**() - returns the minimum period of vote locking. It should not be shorter than the Enactment Period to ensure that in the case of an approval, those successful voters are locked into the consequences that their votes entail