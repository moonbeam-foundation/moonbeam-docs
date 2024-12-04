---
title: Conviction Voting Pallet
description: This guide covers the available functions in the Conviction Voting Pallet on Moonbeam, which are used to vote, delegate votes, remove votes, and more.
keywords: democracy, substrate, pallet, moonbeam, polkadot, voting, vote, referenda
---

# The Conviction Voting Pallet

## Introduction {: #introduction }

The Conviction Voting Pallet allows token holders to make, delegate, and manage Conviction-weighted votes on referenda.

Governance-related functionality is based on three new pallets and precompiles: the [Preimage Pallet](/builders/substrate/interfaces/features/governance/preimage/){target=\_blank} and [Preimage Precompile](/builders/ethereum/precompiles/features/governance/preimage/){target=\_blank}, the [Referenda Pallet](/builders/substrate/interfaces/features/governance/referenda/){target=\_blank} and [Referenda Precompile](/builders/ethereum/precompiles/features/governance/referenda/){target=\_blank}, and the [Conviction Voting Pallet](/builders/substrate/interfaces/features/governance/conviction-voting/){target=\_blank} and [Conviction Voting Precompile](/builders/ethereum/precompiles/features/governance/conviction-voting/){target=\_blank}. The aforementioned precompiles are Solidity interfaces that enable you to perform governance functions using the Ethereum API.

This guide will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the Preimage Pallet on Moonbeam. This guide assumes you are familiar with governance-related terminology; if not, please check out the [governance overview page](/learn/features/governance/#opengov){target=_blank} for more information.

## Conviction Voting Pallet Interface {: #preimage-pallet-interface }

### Extrinsics {: #extrinsics }

The Conviction Voting Pallet provides the following extrinsics (functions):

??? function "**delegate**(class, to, conviction, balance) - delegate the voting power (with some given Conviction) to another account for a particular class (Origin and, by extension, Track) of polls (referenda). The balance delegated is locked for as long as it's delegated, and thereafter for the time appropriate for the Conviction's lock period. Emits a `Delegated` event"

    === "Parameters"

        - `class` - the index of the Track that the delegate account is permitted to vote on proposals for. The index for each Track is as follows:
            - `0` - Root Track
            - `1` - Whitelisted Track
            - `2` - General Admin Track
            - `3` - Emergency Canceller Track
            - `4` - Emergency Killer Track
        - `to` - the account to delegate voting power to
        - `conviction` - the [Conviction multiplier](/learn/features/governance#conviction-multiplier-v2){target=_blank} value to use for the delegation. You can specify either the name of the Conviction multiplier value or the index associated with the value:
            - `'None'` or `0`
            - `'Locked1x'` or `1`
            - `'Locked2x'` or `2`
            - `'Locked3x'` or `3`
            - `'Locked4x'` or `4`
            - `'Locked5x'` or `5`
            - `'Locked6x'` or `6`
        - `balance` -the number of tokens to delegate to the other account in Wei

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/conviction-voting/delegate.js'
        ```

??? function "**removeOtherVote**(target, class, index) - removes a vote for a poll (referendum). If the `target` is equal to the signer, then this function is exactly equivalent to `removeVote`. If not equal to the signer, then the vote must have expired, either because the poll was canceled, the voter lost the poll, or because the Conviction period is over"

    === "Parameters"

        - `target` - the voter to remove the vote for
        - `class` - the index of the Track the poll belongs to. The index for each Track is as follows:
            - `0` - Root Track
            - `1` - Whitelisted Track
            - `2` - General Admin Track
            - `3` - Emergency Canceller Track
            - `4` - Emergency Killer Track
        - `index` - the index of the poll (referendum)

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/conviction-voting/remove-other-vote.js'
        ```

??? function "**removeVote**(class, index) - removes a vote for a poll"

    This can occur if one of the following is true:

    - If the poll was canceled, tokens are immediately available for unlocking if there is no other pending lock
    - If the poll is ongoing, the token holder's votes no longer count for the tallying, and tokens are immediately available for unlocking if there is no other pending lock
    - If the poll has ended, there are two different scenarios:
        - If the token holder voted against the tallied result or voted with no Conviction, the tokens are immediately available for unlocking if there is no other pending lock
        - If, however, the poll has ended and the results coincide with the vote of the token holder (with a given Conviction) and the lock period of the Conviction is not over, then the lock will be aggregated into the overall account's lock. This may involve _overlocking_ (where the two locks are combined into a single lock that is the maximum of both the amount locked and the time it is locked)

    === "Parameters"

        - `class` - the index of the Track the poll belongs to. The index for each Track is as follows:
            - `0` - Root Track
            - `1` - Whitelisted Track
            - `2` - General Admin Track
            - `3` - Emergency Canceller Track
            - `4` - Emergency Killer Track
        - `index` - the index of the poll (referendum)

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/conviction-voting/remove-vote.js'
        ```

??? function "**undelegate**(class) - undelegates the voting power for a particular class (Origin and, by extension, Track) of polls (referenda). Tokens may be unlocked after an amount of time consistent with the lock period of the Conviction with which the delegation was issued. Emits an `Undelegated` event"

    === "Parameters"

        - `class` - the index of the Track to remove the voting power for. The index for each Track is as follows:
            - `0` - Root Track
            - `1` - Whitelisted Track
            - `2` - General Admin Track
            - `3` - Emergency Canceller Track
            - `4` - Emergency Killer Track

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/conviction-voting/undelegate.js'
        ```

??? function "**unlock**(class, target) - removes a lock for a prior vote or delegation vote within a particular class (Origin and, by extension, Track), which has expired"

    === "Parameters"

        - `class` - the index of the Track that the poll is assigned to. The index for each Track is as follows:
            - `0` - Root Track
            - `1` - Whitelisted Track
            - `2` - General Admin Track
            - `3` - Emergency Canceller Track
            - `4` - Emergency Killer Track
        - `target` - the account to remove the lock for

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/conviction-voting/unlock.js'
        ```

??? function "**vote**(pollIndex, vote) - submits a vote in a poll (referendum). If the vote is "Aye", the vote is to enact the proposal; if it is a "Nay", the vote is to keep the status quo"

    === "Parameters"

        - `pollIndex` - the index of the poll (referendum)
        - `vote` - the vote and the amount to lock for the vote. There are three types of votes: 
            - `Standard` - votes a Conviction-weighted vote, with a given amount locked for "Aye" or "Nay". To use `Standard`, you'll have to specify the following:
                - `aye` - a boolean indicating whether the vote is an "Aye" or a "Nay"
                - `conviction` - the [Conviction multiplier](/learn/features/governance#conviction-multiplier-v2){target=_blank} value to use for the delegation. You can specify either the name of the Conviction multiplier value or the index associated with the value:
                    - `0` or `'None'`
                    - `1` or `'Locked1x'`
                    - `2` or `'Locked2x'`
                    - `3` or `'Locked3x'`
                    - `4` or `'Locked4x'`
                    - `5` or `'Locked5x'`
                    - `6` or `'Locked6x'`
                    - balance - the number of tokens to lock for the vote
            - `Split` - votes a split vote, with a given amount locked for "Aye" and a given amount locked for "Nay". To use `Split`, you'll have to specify the following:
                - `aye` - the balance to lock for an "Aye" vote
                - `nay` - the balance to lock for a "Nay" vote
            - `SplitAbstain` - votes a split abstained vote, with a given amount locked for "Aye", a given amount locked for "Nay", and a given amount locked for an abstain vote (support). To use `SplitAbstain`, you'll have to specify the following:
                - `aye` - the balance to lock for an "Aye" vote
                - `nay` - the balance to lock for a "Nay" vote
                - `abstain` - the balance to lock for an abstain vote


    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/conviction-voting/vote.js'
        ```

### Storage Methods {: #storage-methods }

The Conviction Voting Pallet includes the following read-only storage methods to obtain chain state data:

??? function "**classLocksFor**(account) - returns the voting classes (Origins and, by extension, Tracks), which have a non-zero lock requirement, and the lock amounts that they require"

    === "Parameters"

        - `account` - the account to get voting information for

    === "Returns"

        An array containing the class locks. Each class lock is an array that includes the index of the class (Origin and, by extension, Track) and the balance the voter has locked in the class. The index for each Track is as follows:
            - `0` - Root Track
            - `1` - Whitelisted Track
            - `2` - General Admin Track
            - `3` - Emergency Canceller Track
            - `4` - Emergency Killer Track

        ```js
        // If using Polkadot.js API and calling toJSON() on the query results
        [
          [
            2, // Index of the class
            '0x00000000000000000de0b6b3a7640000' // Amount locked
          ]
        ]
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/conviction-voting/class-locks-for.js'
        ```

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
        --8<-- 'code/builders/pallets-precompiles/pallets/conviction-voting/pallet-version.js'
        ```

??? function "**votingFor**(account, class) - returns all of the votes for a particular voter in a particular voting class (Origin and, by extension, Track)"

    === "Parameters"

        - `account` - the account to get the voting information for
        - `class` - the index of the voting class. The index for each Track is as follows:
            - `0` - Root Track
            - `1` - Whitelisted Track
            - `2` - General Admin Track
            - `3` - Emergency Canceller Track
            - `4` - Emergency Killer Track

    === "Returns"

        The voting information for the given voter. The voter can be either `casting`, if the voter isn't actively delegating, or `delegating`, if the user is actively delegating
        The information for each type.

        === "Casting"

            If the voter isn't actively delegating. If the voter was previously assigned as a delegate, any delegate votes will appear under `delegations`.

            ```js
            {
              casting: {
                votes: [ 
                  [ 
                    0, // Track Index
                    {
                      standard: { // Vote type can be either Standard, Split, or SplitAbstain
                        vote: '0x81', // The vote (Aye or Nay) and the Conviction
                        balance: '0x0000000000001999c6880e003a480000' // Vote value
                      } 
                    } 
                  ] 
                ],
                delegations: { // Delegate votes
                  votes: '0x000000000000000ad78ebc5ac6200000', // Total Conviction-weighted votes
                  capital: '0x00000000000000056bc75e2d63100000' // Total delegated amount
                },
                prior: [ // Locked votes. After unlocking votes, this will reset to [0, 0]
                  56328, // The block at which the delegated amount can be unlocked
                  '0x00000000000000056bc75e2d63100000'  // The delegated amount
                ]
              }
            }
            ```

        === "Delegating"

            If the voter is actively delegating their votes to another voter. If the voter was previously delegated by another voter, they're votes will appear under `delegations`.

            ```js
            // If using Polkadot.js API and calling toJSON() on the query results
            {
              delegating: {
                balance: '0x00000000000000056bc75e2d63100000', // The delegated amount
                target: '0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0', // The delegate account
                conviction: 'Locked2x', // The permitted Conviction
                delegations: { // Delegate votes (if voter was previously delegated)
                  votes: 0,  // Total Conviction-weighted votes
                  capital: 0 // Total delegated amount
                },
                prior: [ // Locked votes
                  0, // The block at which the delegated amount can be unlocked
                  0  // The delegated amount
                ]
              }
            }
            ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/conviction-voting/voting-for.js'
        ```

### Pallet Constants {: #constants }

The Conviction Voting Pallet includes the following read-only functions to obtain pallet constants:

??? function "**maxVotes**() - returns the maximum number of concurrent votes an account may have"

    === "Parameters"

        None.

    === "Returns"

        The maximum number of votes.

        ```js
        // If using Polkadot.js API and calling toJSON() on the result
        20
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/conviction-voting/max-votes.js'
        ```

??? function "**voteLockingPeriod**() - returns the minimum period of vote locking. It should not be shorter than the Enactment Period to ensure that, in the case of an approval, those successful voters are locked into the consequences that their votes entail"

    === "Parameters"

        None.

    === "Returns"

        The vote-locking period.

        ```js
        // If using Polkadot.js API and calling toJSON() on the result
        7200
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/pallets-precompiles/pallets/conviction-voting/vote-locking-period.js'
        ```
