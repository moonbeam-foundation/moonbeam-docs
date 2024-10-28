---
title: Parachain Staking Pallet
description: Learn about the Parachain Staking Pallet interface on Moonbeam, which can be used to perform delegator and collator activities and retrieve staking information.
keywords: staking, substrate, pallet, moonbeam, polkadot
---

# The Parachain Staking Pallet

## Introduction {: #introduction }

Moonbeam uses a Delegated Proof of Stake (DPoS) system that determines which collators are eligible to produce blocks based on their total stake in the network. For general information on staking, such as general terminology, staking variables, and more, please refer to the [Staking on Moonbeam](/learn/features/staking/){target=\_blank} page.

The DPoS system is powered by the [parachain staking](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/parachain-staking/src){target=\_blank} pallet, allowing token holders (delegators) to express exactly which collator candidates they would like to support and with what quantity of stake. The design of the parachain staking pallet is such that it enforces shared risk/reward on chain between delegators and candidates.

Some of the functionality of the parachain staking pallet is also available through a staking precompile. The precompile is a Solidity interface that enables you to perform staking actions through the Ethereum API. Please refer to the [Staking Precompile](/builders/ethereum/precompiles/features/staking/){target=\_blank} guide for more information.

This guide will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the parachain staking pallet.

## Exit Delays {: #exit-delays }

Some of the staking pallet extrinsics include exit delays that you must wait before the request can be executed. The exit delays to note are as follows:

=== "Moonbeam"
    |        Variable         |                                                                         Value                                                                         |
    |:-----------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    | Decrease candidate bond |       {{ networks.moonbeam.collator_timings.can_bond_less.rounds }} rounds ({{ networks.moonbeam.collator_timings.can_bond_less.hours }} hours)       |
    | Decrease delegator bond |      {{ networks.moonbeam.delegator_timings.del_bond_less.rounds }} rounds ({{ networks.moonbeam.delegator_timings.del_bond_less.hours }} hours)      |
    |    Revoke delegation    | {{ networks.moonbeam.delegator_timings.revoke_delegations.rounds }} rounds ({{ networks.moonbeam.delegator_timings.revoke_delegations.hours }} hours) |
    |    Leave candidates     |    {{ networks.moonbeam.collator_timings.leave_candidates.rounds }} rounds ({{ networks.moonbeam.collator_timings.leave_candidates.hours }} hours)    |
    |    Leave delegators     |   {{ networks.moonbeam.delegator_timings.leave_delegators.rounds }} rounds ({{ networks.moonbeam.delegator_timings.leave_delegators.hours }} hours)   |

=== "Moonriver"
    |        Variable         |                                                                          Value                                                                          |
    |:-----------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------:|
    | Decrease candidate bond |       {{ networks.moonriver.collator_timings.can_bond_less.rounds }} rounds ({{ networks.moonriver.collator_timings.can_bond_less.hours }} hours)       |
    | Decrease delegator bond |      {{ networks.moonriver.delegator_timings.del_bond_less.rounds }} rounds ({{ networks.moonriver.delegator_timings.del_bond_less.hours }} hours)      |
    |    Revoke delegation    | {{ networks.moonriver.delegator_timings.revoke_delegations.rounds }} rounds ({{ networks.moonriver.delegator_timings.revoke_delegations.hours }} hours) |
    |    Leave candidates     |    {{ networks.moonriver.collator_timings.leave_candidates.rounds }} rounds ({{ networks.moonriver.collator_timings.leave_candidates.hours }} hours)    |
    |    Leave delegators     |   {{ networks.moonriver.delegator_timings.leave_delegators.rounds }} rounds ({{ networks.moonriver.delegator_timings.leave_delegators.hours }} hours)   |

=== "Moonbase Alpha"
    |        Variable         |                                                                         Value                                                                         |
    |:-----------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    | Decrease candidate bond |       {{ networks.moonbase.collator_timings.can_bond_less.rounds }} rounds ({{ networks.moonbase.collator_timings.can_bond_less.hours }} hours)       |
    | Decrease delegator bond |      {{ networks.moonbase.delegator_timings.del_bond_less.rounds }} rounds ({{ networks.moonbase.delegator_timings.del_bond_less.hours }} hours)      |
    |    Revoke delegation    | {{ networks.moonbase.delegator_timings.revoke_delegations.rounds }} rounds ({{ networks.moonbase.delegator_timings.revoke_delegations.hours }} hours) |
    |    Leave candidates     |    {{ networks.moonbase.collator_timings.leave_candidates.rounds }} rounds ({{ networks.moonbase.collator_timings.leave_candidates.hours }} hours)    |
    |    Leave delegators     |   {{ networks.moonbase.delegator_timings.leave_delegators.rounds }} rounds ({{ networks.moonbase.delegator_timings.leave_delegators.hours }} hours)   |

## Parachain Staking Pallet Interface {: #parachain-staking-pallet-interface }

### Extrinsics {: #extrinsics }

The parachain staking pallet provides the following extrinsics (functions):

??? function "**cancelCandidateBondLess**() - cancels a pending scheduled request to decrease a candidate's self bond amount"

    === "Parameters"

        None.

    === "Polkadot.js API Example"

        ```js
         --8<-- 'code/builders/substrate/interfaces/account/staking/cancel-candidate-bond-less.js'
        ```

??? function "**cancelDelegationRequest**(candidate) - cancels any pending delegation requests provided the address of a candidate"

    === "Parameters"

        - `candidate` - The address of the relevant collator

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/cancel-delegation-request.js'
        ```

??? function "**cancelLeaveCandidates**(candidateCount) - cancels a candidate's pending scheduled request to leave the candidate pool given the current number of candidates in the pool"

    === "Parameters"

        - `candidateCount` - The current number of collator candidates in the pool

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/cancel-leave-candidates.js'
        ```

??? function "**candidateBondMore**(more) - request to increase a candidate's self bond by a specified amount"

    === "Parameters"

        - `more` - The amount of WEI by which to increase the candidate's self bond

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/candidate-bond-more.js'
        ```

??? function "**delegate**(candidate, amount, candidateDelegationCount, delegationCount) - *deprecated as of runtime 2400* - request to add a delegation to a specific candidate for a given amount. Use the `delegateWithAutoCompound` extrinsic instead"

    === "Parameters"

        - `candidate` - The address of the collator candidate to delegate to (H160 format address, e.g., '0x123...')
        - `amount` - The amount to delegate in Wei (e.g., 1 DEV = 1_000_000_000_000_000_000 Wei)
        - `candidateDelegationCount` - The current number of delegations to the candidate
        - `delegationCount` - The current number of delegations from the delegator

    === "Polkadot.js API Example"

        ```
        *deprecated as of runtime 2400*
        Use the `delegateWithAutoCompound` extrinsic instead 
        ```

??? function "**delegateWithAutoCompound**(candidate, amount, autoCompound, candidateDelegationCount, candidateAutoCompoundingDelegationCount, delegationCount) - delegates a collator candidate and sets the percentage of rewards to auto-compound given an integer (no decimals) for the `amount` between 0-100. If the caller is not a delegator, this function adds them to the set of delegators. If the caller is already a delegator, then it adjusts their delegation amount"

    === "Parameters"

        - `candidate` -
        - `amount` -
        - `autoCompound` -
        - `candidateDelegationCount` -
        - `candidateAutoCompoundingDelegationCount` -
        - `delegationCount` -

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/delegate-with-autocompound.js'
        ```

??? function "**delegatorBondMore**(candidate, more) - request to increase a delegator's amount delegated for a specific candidate"

    === "Parameters"

        - `candidate` -
        - `more` -

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/delegator-bond-more.js'
        ```

??? function "**executeCandidateBondLess**(candidate) - executes any scheduled due requests to decrease a candidate's self bond amount"

    === "Parameters"

        - `candidate` -

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/execute-candidate-bond-less.js'
        ```

??? function "**executeDelegationRequest**(delegator, candidate) - executes any scheduled due delegation requests for a specific delegator provided the address of the candidate"

    === "Parameters"

        - `delegator` -
        - `candidate` -

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/execute-delegation-request.js'
        ```

??? function "**executeLeaveCandidates**(candidate, candidateDelegationCount) - executes any scheduled due requests to leave the set of collator candidates"

    === "Parameters"

        - `candidate` -
        - `candidateDelegationCount` -

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/execute-leave-candidates.js'
        ```

??? function "**goOffline**() - allows a collator candidate to temporarily leave the pool of candidates without unbonding"

    === "Parameters"

        None.

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/go-offline.js'
        ```

??? function "**goOnline**() - allows a collator candidate to rejoin the pool of candidates after previously calling `goOffline()`"

    === "Parameters"

        None.

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/go-online.js'
        ```

??? function "**joinCandidates**(bond, candidateCount) - request to join the set of collator candidates with a specified bond amount and provided the current candidate count"

    === "Parameters"

        - `bond` -
        - `candidateCount` -

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/join-candidates.js'
        ```

??? function "**notifyInactiveCollator**(collator) - marks a collator as inactive if they have not been producing blocks for the maximum number of offline rounds, as returned by the [`maxOfflineRounds` pallet constant](#constants)"

    === "Parameters"

        - `collator` -

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/notify-inactive-collator.js'
        ```

??? function "**scheduleCandidateBondLess**(less) - schedules a request to decrease a candidate's self bond by a specified amount. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `executeCandidateBondLess` extrinsic"

    === "Parameters"

        - `less` -

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/schedule-candidate-bond-less.js'
        ```

??? function "**scheduleDelegatorBondLess**(candidate, less) - schedules a request for a delegator to bond less with respect to a specific candidate. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `executeDelegationRequest` extrinsic"

    === "Parameters"

        - `candidate` -
        - `less` -

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/schedule-delegator-bond-less.js'
        ```

??? function "**scheduleLeaveCandidates**(candidateCount) - schedules a request for a candidate to remove themselves from the candidate pool. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `executeLeaveCandidates` extrinsic"

    === "Parameters"

        - `candidateCount` -

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/schedule-leave-candidates.js'
        ```

??? function "**scheduleRevokeDelegation**(collator) - schedules a request to revoke a delegation given the address of a candidate. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `executeDelegationRequest` extrinsic"

    === "Parameters"

        - `collator` -

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/schedule-revoke-delegation.js'
        ```

??? function "**setAutoCompound**(candidate, value, candidateAutoCompoundingDelegationCountHint, delegationCountHint) - sets the percentage of rewards to be auto-compounded for an existing delegation given an integer (no decimals) for the `value` between 0-100"

    === "Parameters"

        - `candidate` -
        - `value` -
        - `candidateAutoCompoundingDelegationCountHint` -
        - `delegationCountHint` -

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/set-auto-compound.js'
        ```

### Storage Methods {: #storage-methods }

The parachain staking pallet includes the following read-only storage methods to obtain chain state data:

??? function "**atStake**(u32, AccountId20) - provides a snapshot of a collator's delegation stake and the percentage of rewards set to auto-compound given a round number and, optionally, the collator's address"

    === "Parameters"

        - `u32` -
        - `AccountId20` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/at-stake.js'
        ```

??? function "**autoCompoundingDelegations**(AccountId20) - returns a list of delegators for a given candidate that have set up auto-compounding along with the percentage of rewards set to be auto-compounded"

    === "Parameters"

        - `AccountId20` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/get-autocompounding.js'
        ```

??? function "**awardedPts**(u32, AccountId20) - returns the awarded points for each collator per round given a round number and, optionally, the collator's address"

    === "Parameters"

        - `u32` -
        - `AccountId20` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/query-awarded-points.js'
        ```

??? function "**bottomDelegations**(AccountId20) - returns at the most the bottom 50 delegations for all candidates or for a given candidate's address"

    === "Parameters"

        - `AccountId20` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
         --8<-- 'code/builders/substrate/interfaces/account/staking/bottom.js'
        ```

??? function "**candidateInfo**(AccountId20) - returns candidate information such as the candidate's bond, delegation count, and more for all candidates or for a given candidate's address"

    === "Parameters"

        - `AccountId20` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/candidate-info.js'
        ```

??? function "**candidatePool**() - returns a list of each of the candidates in the pool and their total backing stake"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/query-candidate-pool.js'
        ```

??? function "**candidateState**(AccountId20) - *deprecated as of runtime 1200* - use `candidateInfo` instead"

    === "Parameters"

        - `AccountId20` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        *Deprecated as of runtime 1200* - use `candidateInfo` instead"
        ```

??? function "**collatorCommission**() - returns the commission percent taken off of rewards for all collators"

    === "Parameters"

        None.

    === "Returns"

        

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/collator-commission.js'
        ```

??? function "**collatorState2**(AccountId20) - *deprecated as of runtime 1001* - use `candidateInfo` instead"

    === "Parameters"

        - `AccountId20` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        Ddeprecated as of runtime 1001* - use `candidateInfo` instead"
        ```

??? function "**delayedPayouts**(u32) - returns the delayed payouts for all rounds or for a given round"

    === "Parameters"

        - `u32` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/query-delayed-payouts.js'
        ```

??? function "**delegationScheduledRequests**(AccountId20) - returns the outstanding scheduled delegation requests for all collators or for a given collator's address"

    === "Parameters"

        - `AccountId20` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/scheduled-delegation-requests.js'
        ```

??? function "**delegatorState**(AccountId20) - returns delegator information such as their delegations, delegation status, and total delegation amount for all delegators or for a given delegator's address"

    === "Parameters"

        - `AccountId20` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/query-delegator-state.js'
        ```

??? function "**enabledMarkingOffline**() - returns a boolean indicating whether or not the marking offline feature for inactive collators is enabled"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/query-enabled-marking-offline.js'
        ```

??? function "**inflationConfig**() - returns the inflation configuration"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/inflation-config.js'
        ```

??? function "**nominatorState2**(AccountId20) - *deprecated as of runtime 1001* - use `delegatorState` instead"

    === "Parameters"

        - `AccountId20` -

    === "Returns"

        Deprecated as of runtime 1001* - use `delegatorState` instead"

    === "Polkadot.js API Example"

        ```js
        Deprecated as of runtime 1001* - use `delegatorState` instead"
        ```

??? function "**palletVersion**() - returns the current pallet version"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/pallet-version.js'
        ```

??? function "**points**(u32) - returns the total points awarded to collators for block production in all rounds or for a given round"

    === "Parameters"

        - `u32` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/query-collator-points.js'
        ```

??? function "**round**() - returns the current round number, the first block of the current round, and the length of the round"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/query-current-round.js'
        ```

??? function "**selectedCandidates**() - returns the collator candidates selected to be in the active set for the current round"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/query-selected-candidates.js'
        ```

??? function "**topDelegations**(AccountId20) - returns at the most the top 300 delegations for all collators or for a given collator's address"

    === "Parameters"

        - `AccountId20` -

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/query-top-delegations.js'
        ```

??? function "**total**() - returns the total capital locked in the staking pallet"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/query-total.js'
        ```

??? function "**totalSelected**() - returns the total number of collator candidates that can be selected for the active set"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/query-total-selected.js'
        ```


### Pallet Constants {: #constants }

The parachain staking pallet includes the following read-only functions to obtain pallet constants:

??? function "**candidateBondLessDelay**() - returns the number of rounds that must be waited until a candidate's scheduled request to decrease their self bond can be executed"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/candidate-bond-less-delay.js'
        ```

??? function "**defaultBlocksPerRound**() -  *deprecated as of runtime 1900* - returns the default number of blocks per round"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        *Deprecated as of runtime 1900* - returns the default number of blocks per round"
        ```

??? function "**defaultCollatorCommission**() - *deprecated as of runtime 1900* - returns the default commission due to collators"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        *Deprecated as of runtime 1900* - returns the default commission due to collators"
        ```

??? function "**defaultParachainBondReservePercent**() - *deprecated as of runtime 1900* - returns the default percent of inflation set aside for the parachain bond account"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        *Deprecated as of runtime 1900*
        ```

??? function "**delegationBondLessDelay**() - returns the number of rounds that must be waited until a scheduled request to decrease a delegation can be executed"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/delegation-bond-less-delay.js'
        ```

??? function "**leaveCandidatesDelay**() - returns the number of rounds that must be waited before a scheduled request for a candidate to leave the candidate pool can be executed"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/leave-candidates-delay.js'
        ```

??? function "**leaveDelegatorsDelay**() - returns the number of rounds that must be waited before a scheduled request for a delegator to leave the set of delegators can be executed"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/leave-delegators-delay.js'
        ```

??? function "**maxBottomDelegationsPerCandidate**() - returns the maximum number of bottom delegations per candidate"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/max-bottom-delegations.js'
        ```

??? function "**maxCandidates**() - returns the maximum number of candidates allowed in the candidate pool"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/max-candidates.js'
        ```

??? function "**maxDelegationsPerDelegator**() - returns the maximum number of delegations per delegator"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/max-delegations.js'
        ```

??? function "**maxOfflineRounds**() - returns the number of rounds that must pass before a collator that has stopped producing blocks is marked as inactive"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/max-offline-rounds.js'
        ```

??? function "**maxTopDelegationsPerCandidate**() - returns the maximum number of top delegations per candidate"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/max-top-per-candidate.js'
        ```

??? function "**minBlocksPerRound**() - returns the minimum number of blocks per round"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/min-blocks-per-round.js'
        ```

??? function "**minCandidateStk**() - returns the minimum stake required for a candidate to be a collator candidate"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/min-cand-stake.js'
        ```

??? function "**minCollatorStk**() - *deprecated as of runtime 2400* - returns the minimum stake required for a candidate to be in the active set"

    === "Parameters"

        None.

    === "Returns"

        *Deprecated as of runtime 2400.* Returns minimum stake required for a candidate to be in the active set

    === "Polkadot.js API Example"

        ```js
        *Deprecated as of runtime 2400*
        ```

??? function "**minDelegation**() - returns the minimum delegation amount"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/min-delegation.js'
        ```

??? function "**minDelegatorStk**() - *deprecated as of runtime 2500* - returns the minimum stake for an account to be a delegator"

    === "Parameters"

        None.

    === "Returns"

        *Deprecated as of runtime 2500*. Returns the minimum stake for an account to be a delegator

    === "Polkadot.js API Example"

        ```js
        *Deprecated as of runtime 2500*
        ```

??? function "**minSelectedCandidates**() - returns the minimum number of selected candidates in the active set every round"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/min-selected-candidates.js'
        ```

??? function "**revokeDelegationDelay**() - returns the number of rounds that must be waited before a scheduled request to revoke a delegation can be executed"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/revoke-delegation-delay.js'
        ```

??? function "**rewardPaymentDelay**() - returns the number of rounds that must be waited after which block authors are rewarded"

    === "Parameters"

        None.

    === "Returns"

        TODO

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/account/staking/reward-delay.js'
        ```
