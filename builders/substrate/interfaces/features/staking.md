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

        None

    === "Polkadot.js API Example"

        ```js
         --8<-- 'code/builders/substrate/interfaces/features/staking/cancel-candidate-bond-less.js'
        ```

??? function "**cancelDelegationRequest**(candidate) - cancels any pending delegation requests provided the address of a candidate"

    === "Parameters"

        - `candidate` - The address of the relevant collator

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/cancel-delegation-request.js'
        ```

??? function "**cancelLeaveCandidates**(candidateCount) - cancels a candidate's pending scheduled request to leave the candidate pool given the current number of candidates in the pool"

    === "Parameters"

        - `candidateCount` - The current number of collator candidates in the pool

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/cancel-leave-candidates.js'
        ```

??? function "**candidateBondMore**(more) - request to increase a candidate's self bond by a specified amount"

    === "Parameters"

        - `more` - The amount of WEI by which to increase the candidate's self bond

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/candidate-bond-more.js'
        ```

??? function "**delegate**(candidate, amount, candidateDelegationCount, delegationCount) - *deprecated as of runtime 2400* - request to add a delegation to a specific candidate for a given amount. Use the `delegateWithAutoCompound` extrinsic instead"

    === "Parameters"

        - `candidate` - The address of the collator candidate to delegate to (H160 format address, e.g., '0x123...')
        - `amount` - The amount to delegate in Wei (e.g., 1 DEV = 1_000_000_000_000_000_000 Wei)
        - `candidateDelegationCount` - The current number of delegations to the candidate
        - `delegationCount` - The current number of delegations from the delegator

    === "Polkadot.js API Example"

        *Deprecated as of runtime 2400*
        Use the `delegateWithAutoCompound` extrinsic instead 

??? function "**delegateWithAutoCompound**(candidate, amount, autoCompound, candidateDelegationCount, candidateAutoCompoundingDelegationCount, delegationCount) - delegates a collator candidate and sets the percentage of rewards to auto-compound given an integer (no decimals) for the `amount` between 0-100. If the caller is not a delegator, this function adds them to the set of delegators. If the caller is already a delegator, then it adjusts their delegation amount"

    === "Parameters"

        - `candidate` - The collator's address you want to delegate to
        - `amount` - The amount to delegate (in Wei, e.g. 1000000000000000000 for 1 DEV)
        - `autoCompound` - The percentage of rewards to automatically compound (0-100)
        - `candidateDelegationCount` - The current number of delegations to the collator
        - `candidateAutoCompoundingDelegationCount` - The current number of auto-compounding delegations for the collator
        - `delegationCount` - The total number of delegations you have across all collators

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/delegate-with-auto-compound.js'
        ```

??? function "**delegatorBondMore**(candidate, more) - request to increase a delegator's amount delegated for a specific candidate"

    === "Parameters"

        - `candidate` - the address of the respective collator
        - `more` - The amount you want to increase your delegation by (in Wei, e.g. 1000000000000000000 for 1 DEV)

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/delegator-bond-more.js'
        ```

??? function "**executeCandidateBondLess**(candidate) - executes any scheduled due requests to decrease a candidate's self bond amount"

    === "Parameters"

        - `candidate` - the address of the respective collator

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/execute-candidate-bond-less.js'
        ```

??? function "**executeDelegationRequest**(delegator, candidate) - executes any scheduled due delegation requests for a specific delegator provided the address of the candidate"

    === "Parameters"

        - `delegator` - The address of the delegator who made the delegation request
        - `candidate` - The collator's address associated with the delegation request

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/execute-delegation-request.js'
        ```

??? function "**executeLeaveCandidates**(candidate, candidateDelegationCount) - executes any scheduled due requests to leave the set of collator candidates"

    === "Parameters"

        - `candidate` - The address of the collator who requested to leave the candidate pool
        - `candidateDelegationCount` - The current number of delegations for the leaving candidate

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/execute-leave-candidates.js'
        ```

??? function "**goOffline**() - allows a collator candidate to temporarily leave the pool of candidates without unbonding"

    === "Parameters"

        None

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/go-offline.js'
        ```

??? function "**goOnline**() - allows a collator candidate to rejoin the pool of candidates after previously calling `goOffline()`"

    === "Parameters"

        None

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/go-online.js'
        ```

??? function "**joinCandidates**(bond, candidateCount) - request to join the set of collator candidates with a specified bond amount and provided the current candidate count"

    === "Parameters"

        - `bond` - The amount to stake as collator bond (in Wei, e.g. 500000000000000000000 for 500 DEV)
        - `candidateCount` - The total number of candidates currently in the candidate pool

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/join-candidates.js'
        ```

??? function "**notifyInactiveCollator**(collator) - marks a collator as inactive if they have not been producing blocks for the maximum number of offline rounds, as returned by the [`maxOfflineRounds` pallet constant](#constants)"

    === "Parameters"

        - `collator` - the address of the collator to be notified

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/notify-inactive-collator.js'
        ```

??? function "**scheduleCandidateBondLess**(less) - schedules a request to decrease a candidate's self bond by a specified amount. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `executeCandidateBondLess` extrinsic"

    === "Parameters"

        - `less` - The amount you want to decrease your delegation by (in Wei, e.g. 1000000000000000000 for 1 DEV)

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/schedule-candidate-bond-less.js'
        ```

??? function "**scheduleDelegatorBondLess**(candidate, less) - schedules a request for a delegator to bond less with respect to a specific candidate. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `executeDelegationRequest` extrinsic"

    === "Parameters"

        - `candidate` - The collator's address for which you want to decrease your delegation
        - `less` - The amount you want to decrease your delegation by (in Wei, e.g. 1000000000000000000 for 1 DEV)

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/schedule-delegator-bond-less.js'
        ```

??? function "**scheduleLeaveCandidates**(candidateCount) - schedules a request for a candidate to remove themselves from the candidate pool. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `executeLeaveCandidates` extrinsic"

    === "Parameters"

        - `candidateCount` - The total number of candidates currently in the candidate pool

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/schedule-leave-candidates.js'
        ```

??? function "**scheduleRevokeDelegation**(collator) - schedules a request to revoke a delegation given the address of a candidate. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `executeDelegationRequest` extrinsic"

    === "Parameters"

        - `collator` - The collator's address from which you want to revoke your delegation

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/schedule-revoke-delegation.js'
        ```

??? function "**setAutoCompound**(candidate, value, candidateAutoCompoundingDelegationCountHint, delegationCountHint) - sets the percentage of rewards to be auto-compounded for an existing delegation given an integer (no decimals) for the `value` between 0-100"

    === "Parameters"

        - `candidate` - The collator's address you're delegating to
        - `value` - Auto-compound percentage (0-100)
        - `candidateAutoCompoundingDelegationCountHint` - Number of auto-compounding delegations for this collator
        - `delegationCountHint` - Total number of delegations you have across all collators

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/set-auto-compound.js'
        ```

### Storage Methods {: #storage-methods }

The parachain staking pallet includes the following read-only storage methods to obtain chain state data:

??? function "**atStake**(u32, AccountId20) - provides a snapshot of a collator's delegation stake and the percentage of rewards set to auto-compound given a round number and, optionally, the collator's address"

    === "Parameters"

        - `u32` - round number
        - `AccountId20` - collator address to query. If omitted, information about all collators will be returned

    === "Returns"

        Information about a collator's delegations including delegator addresses, amounts, and auto-compound percentages

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/at-stake.js'
        ```

??? function "**autoCompoundingDelegations**(AccountId20) - returns a list of delegators for a given candidate that have set up auto-compounding along with the percentage of rewards set to be auto-compounded"

    === "Parameters"

        - `AccountId20` - the collator address to query. If omitted, information about all collators will be returned

    === "Returns"

        The list of delegators who have auto-compounding enabled and the respective percentage of rewards they have set to be auto-compounded

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/get-autocompounding.js'
        ```

??? function "**awardedPts**(u32, AccountId20) - returns the awarded points for each collator per round given a round number and, optionally, the collator's address"

    === "Parameters"

        - `u32` - the round number
        - `AccountId20` - the collator to query. If omitted, information about all collators will be returned

    === "Returns"

        The number of awarded points for a given round and collator. 

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/query-awarded-points.js'
        ```

??? function "**bottomDelegations**(AccountId20) - returns at the most the bottom 50 delegations for all candidates or for a given candidate's address"

    === "Parameters"

        - `AccountId20` - the collator to query. If omitted, information about all collators will be returned

    === "Returns"

        The bottom 50 delegations for a given collator address

    === "Polkadot.js API Example"

        ```js
         --8<-- 'code/builders/substrate/interfaces/features/staking/bottom.js'
        ```

??? function "**candidateInfo**(AccountId20) - returns candidate information such as the candidate's bond, delegation count, and more for all candidates or for a given candidate's address"

    === "Parameters"

        - `AccountId20` - The collator address to query. If omitted, information about all collators will be returned

    === "Returns"

        Information about the relevant collator including collator bond, total backing stake, delegation count, lowest included delegation amount, collator status, and capacity information

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/candidate-info.js'
        ```

??? function "**candidatePool**() - returns a list of each of the candidates in the pool and their total backing stake"

    === "Parameters"

        None

    === "Returns"

        A list of each of the candidates in the pool and their total backing stake

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/query-candidate-pool.js'
        ```

??? function "**candidateState**(AccountId20) - *deprecated as of runtime 1200* - use `candidateInfo` instead"

    === "Parameters"

        - `AccountId20` - the collator account to query

    === "Returns"

        *Deprecated as of runtime 1200* - use `candidateInfo` instead

    === "Polkadot.js API Example"

        *Deprecated as of runtime 1200* - use `candidateInfo` instead

??? function "**collatorCommission**() - returns the commission percent taken off of rewards for all collators"

    === "Parameters"

        None

    === "Returns"

        The percent collator commission, e.g. `20.00%` 

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/collator-commission.js'
        ```

??? function "**collatorState2**(AccountId20) - *deprecated as of runtime 1001* - use `candidateInfo` instead"

    === "Parameters"

        - `AccountId20` - the collator to query

    === "Returns"

        Deprecated as of runtime 1001* - use `candidateInfo` instead

    === "Polkadot.js API Example"

        Deprecated as of runtime 1001* - use `candidateInfo` instead

??? function "**delayedPayouts**(u32) - returns the delayed payouts for all rounds or for a given round"

    === "Parameters"

        - `u32` - the round to query. If omitted, the latest round information will be returned

    === "Returns"

        The round issuance, the total staking reward, and collator commission.

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/query-delayed-payouts.js'
        ```

??? function "**delegationScheduledRequests**(AccountId20) - returns the outstanding scheduled delegation requests for all collators or for a given collator's address"

    === "Parameters"

        - `AccountId20` - the address of the collator. If omitted, information about all collators will be returned

    === "Returns"

        The set of pending scheduled delegation requests including the delegator's address, the action requested, and eligible block at which the action can be executed.

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/scheduled-delegation-requests.js'
        ```

??? function "**delegatorState**(AccountId20) - returns delegator information such as their delegations, delegation status, and total delegation amount for all delegators or for a given delegator's address"

    === "Parameters"

        - `AccountId20` - the address of the delegator to query

    === "Returns"

        Delegator state information including the collators delegated and their respective amounts

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/query-delegator-state.js'
        ```

??? function "**enabledMarkingOffline**() - returns a boolean indicating whether or not the marking offline feature for inactive collators is enabled"

    === "Parameters"

        None

    === "Returns"

        `boolean` - Indicating whether or not the marking offline feature for inactive collators is enabled

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/query-enabled-marking-offline.js'
        ```

??? function "**inflationConfig**() - returns the inflation configuration"

    === "Parameters"

        None

    === "Returns"

        A JSON object that contains the minimum, ideal, and maximum inflation parameters in each of the following thresholds: expected, annual, and round. 

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/inflation-config.js'
        ```

??? function "**nominatorState2**(AccountId20) - *deprecated as of runtime 1001* - use `delegatorState` instead"

    === "Parameters"

        - `AccountId20` - The account to query

    === "Returns"

        Deprecated as of runtime 1001* - use `delegatorState` instead

    === "Polkadot.js API Example"

        Deprecated as of runtime 1001* - use `delegatorState` instead

??? function "**palletVersion**() - returns the current pallet version"

    === "Parameters"

        None

    === "Returns"

        `u16` - current pallet version

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/pallet-version.js'
        ```

??? function "**points**(u32) - returns the total points awarded to collators for block production in all rounds or for a given round"

    === "Parameters"

        - `u32` - a round number. If omitted, the data for the last three rounds will be returned

    === "Returns"

        - `u32` - total points awarded to collators in the given round 

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/query-collator-points.js'
        ```

??? function "**round**() - returns the current round number, the first block of the current round, and the length of the round"

    === "Parameters"

        None

    === "Returns"

        Returns the current round number, the first block of the current round, and the length of the round

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/query-current-round.js'
        ```

??? function "**selectedCandidates**() - returns the collator candidates selected to be in the active set for the current round"

    === "Parameters"

        None

    === "Returns"

        A set of `AccountId20`s - collator candidates selected to be in the active set for the current round  

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/query-selected-candidates.js'
        ```

??? function "**topDelegations**(AccountId20) - returns at the most the top 300 delegations for all collators or for a given collator's address"

    === "Parameters"

        - `AccountId20` - Address of the given collator. If no address is provided then the top 300 delegations for all collators is returned.

    === "Returns"

        Returns up to the top 300 delegations for a given collator, including the address of the delegator and the amount delegated

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/query-top-delegations.js'
        ```

??? function "**total**() - returns the total capital locked in the staking pallet"

    === "Parameters"

        None

    === "Returns"

        `u128` - returns the total capital locked in the staking pallet

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/query-total.js'
        ```

??? function "**totalSelected**() - returns the total number of collator candidates that can be selected for the active set"

    === "Parameters"

        None

    === "Returns"

        `u32` - returns the total number of collator candidates that can be selected for the active set

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/query-total-selected.js'
        ```


### Pallet Constants {: #constants }

The parachain staking pallet includes the following read-only functions to obtain pallet constants:

??? function "**candidateBondLessDelay**() - returns the number of rounds that must be waited until a candidate's scheduled request to decrease their self bond can be executed"

    === "Parameters"

        None

    === "Returns"

        `u32` - returns the number of rounds that must be waited until a candidate's scheduled request to decrease their self bond can be executed

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/candidate-bond-less-delay.js'
        ```

??? function "**defaultBlocksPerRound**() -  *deprecated as of runtime 1900* - returns the default number of blocks per round"

    === "Parameters"

        None

    === "Returns"

        *Deprecated as of runtime 1900*

    === "Polkadot.js API Example"

        *Deprecated as of runtime 1900*

??? function "**defaultCollatorCommission**() - *deprecated as of runtime 1900* - returns the default commission due to collators"

    === "Parameters"

        None

    === "Returns"

        *Deprecated as of runtime 1900*

    === "Polkadot.js API Example"

        *Deprecated as of runtime 1900*

??? function "**defaultParachainBondReservePercent**() - *deprecated as of runtime 1900* - returns the default percent of inflation set aside for the parachain bond account"

    === "Parameters"

        None

    === "Returns"

        *Deprecated as of runtime 1900*

    === "Polkadot.js API Example"

        *Deprecated as of runtime 1900*

??? function "**delegationBondLessDelay**() - returns the number of rounds that must be waited until a scheduled request to decrease a delegation can be executed"

    === "Parameters"

        None

    === "Returns"

        `u32` - returns the number of rounds that must be waited until a scheduled request to decrease a delegation can be executed

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/delegation-bond-less-delay.js'
        ```

??? function "**leaveCandidatesDelay**() - returns the number of rounds that must be waited before a scheduled request for a candidate to leave the candidate pool can be executed"

    === "Parameters"

        None

    === "Returns"

        `u32` - returns the number of rounds that must be waited before a scheduled request for a candidate to leave the candidate pool can be executed

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/leave-candidates-delay.js'
        ```

??? function "**leaveDelegatorsDelay**() - returns the number of rounds that must be waited before a scheduled request for a delegator to leave the set of delegators can be executed"

    === "Parameters"

        None

    === "Returns"

        `u32` - returns the number of rounds that must be waited before a scheduled request for a delegator to leave the set of delegators can be executed

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/leave-delegators-delay.js'
        ```

??? function "**maxBottomDelegationsPerCandidate**() - returns the maximum number of bottom delegations per candidate"

    === "Parameters"

        None

    === "Returns"

        `u32` - returns the maximum number of bottom delegations per candidate

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/max-bottom-delegations.js'
        ```

??? function "**maxCandidates**() - returns the maximum number of candidates allowed in the candidate pool"

    === "Parameters"

        None

    === "Returns"

        `u32` - returns the maximum number of candidates allowed in the candidate pool

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/max-candidates.js'
        ```

??? function "**maxDelegationsPerDelegator**() - returns the maximum number of delegations per delegator"

    === "Parameters"

        None

    === "Returns"

        `u32` - returns the maximum number of delegations per delegator

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/max-delegations.js'
        ```

??? function "**maxOfflineRounds**() - returns the number of rounds that must pass before a collator that has stopped producing blocks is marked as inactive"

    === "Parameters"

        None

    === "Returns"

        `u32` - returns the number of rounds that must pass before a collator that has stopped producing blocks is marked as inactive

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/max-offline-rounds.js'
        ```

??? function "**maxTopDelegationsPerCandidate**() - returns the maximum number of top delegations per candidate"

    === "Parameters"

        None

    === "Returns"

        `u32` - returns the maximum number of top delegations per candidate

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/max-top-per-candidate.js'
        ```

??? function "**minBlocksPerRound**() - returns the minimum number of blocks per round"

    === "Parameters"

        None

    === "Returns"

        `u32` - returns the minimum number of blocks per round

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/min-blocks-per-round.js'
        ```

??? function "**minCandidateStk**() - returns the minimum stake required for a candidate to be a collator candidate"

    === "Parameters"

        None

    === "Returns"

        `u128` - returns the minimum stake required for a candidate to be a collator candidate

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/min-cand-stake.js'
        ```

??? function "**minCollatorStk**() - *deprecated as of runtime 2400* - returns the minimum stake required for a candidate to be in the active set"

    === "Parameters"

        None

    === "Returns"

        *Deprecated as of runtime 2400*

    === "Polkadot.js API Example"

        *Deprecated as of runtime 2400*

??? function "**minDelegation**() - returns the minimum delegation amount"

    === "Parameters"

        None

    === "Returns"

        `u128` - returns the minimum delegation amount

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/min-delegation.js'
        ```

??? function "**minDelegatorStk**() - *deprecated as of runtime 2500* - returns the minimum stake for an account to be a delegator"

    === "Parameters"

        None

    === "Returns"

        *Deprecated as of runtime 2500*

    === "Polkadot.js API Example"

        *Deprecated as of runtime 2500*

??? function "**minSelectedCandidates**() - returns the minimum number of selected candidates in the active set every round"

    === "Parameters"

        None

    === "Returns"

        `u32` - the minimum number of selected candidates in the active set every round

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/min-selected-candidates.js'
        ```

??? function "**revokeDelegationDelay**() - returns the number of rounds that must be waited before a scheduled request to revoke a delegation can be executed"

    === "Parameters"

        None

    === "Returns"

        `u32` - the number of rounds that must be waited before a scheduled request to revoke a delegation can be executed

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/revoke-delegation-delay.js'
        ```

??? function "**rewardPaymentDelay**() - returns the number of rounds that must be waited after which block authors are rewarded"

    === "Parameters"

        None

    === "Returns"

        `u32` - The number of rounds that must be waited after which block authors are rewarded

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/substrate/interfaces/features/staking/reward-delay.js'
        ```
