---
title: Staking Precompile Contract
description: Unlock the potential of staking with a specialized precompiled contract designed to streamline and optimize participation in Moonbeam.
keywords: solidity, ethereum, staking, moonbeam, precompiled, contracts
---

# Interacting with the Staking Precompile

## Introduction {: #introduction }

Moonbeam uses a Delegated Proof of Stake system through the [Parachain Staking](/builders/substrate/interfaces/features/staking/){target=\_blank} Pallet, allowing token holders (delegators) to express exactly which collator candidates they would like to support and with what quantity of stake. The design of the Parachain Staking Pallet is such that it enforces shared risk/reward on chain between delegators and candidates. For general information on staking, such as general terminology, staking variables, and more, please refer to the [Staking on Moonbeam](/learn/features/staking/){target=\_blank} page.

The staking module is coded in Rust and it is part of a pallet that is normally not accessible from the Ethereum side of Moonbeam. However, a staking precompile allows developers to access the staking features using the Ethereum API in a precompiled contract located at address:

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.staking}}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.staking}}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.staking}}
     ```

This guide will cover the available methods in the staking precompile interface. In addition, it will show you how to interact with the Parachain Staking Pallet through the staking precompile and the Ethereum API. The examples in this guide are done on Moonbase Alpha, but they can be adapted for Moonbeam or Moonriver.

--8<-- 'text/builders/ethereum/precompiles/security.md'

## Exit Delays {: #exit-delays }

Some of the Parachain Staking Pallet extrinsics include exit delays that you must wait before the request can be executed. The exit delays to note are as follows:

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

## Parachain Staking Solidity Interface {: #the-parachain-staking-solidity-interface }

[`StakingInterface.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=\_blank} is an interface through which Solidity contracts can interact with parachain-staking. The beauty is that Solidity developers don’t have to learn the Substrate API. Instead, they can interact with staking functions using the Ethereum interface they are familiar with.

The Solidity interface includes the following functions:

??? function "**isDelegator**(*address* delegator) - read-only function that checks whether the specified address is currently a staking delegator. Uses the [`delegatorState`](/builders/substrate/interfaces/features/staking/#:~:text=delegatorState(AccountId20)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `delegator` - address to check if they are currently a delegator

    === "Returns"

        - `bool` whether the address is currently a delegator

??? function "**isCandidate**(*address* candidate) - read-only function that checks whether the specified address is currently a collator candidate. Uses the [`candidateState`](/builders/substrate/interfaces/features/staking/#:~:text=candidateState(AccountId20)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `candidate` - address to check if they are currently a collator candidate

    === "Returns"

        - `bool` whether the address is currently a candidate

??? function "**isSelectedCandidate**(*address* candidate) - read-only function that checks whether the specified address is currently part of the active collator set. Uses the [`selectedCandidates`](/builders/substrate/interfaces/features/staking/#:~:text=selectedCandidates()){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `candidate` - address to check if they are currently an active collator

    === "Returns"

        - `bool` whether the address is currently an active collator

??? function "**points**(*uint256* round) - read-only function that gets the total points awarded to all collators in a given round. Uses the [`points`](/builders/substrate/interfaces/features/staking/#:~:text=points(u32)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `round` - uint256 round number to query points for

    === "Returns"

        - `uint256` total points awarded in the specified round

??? function "**awardedPoints**(*uint32* round, *address* candidate) - read-only function that returns the total points awarded in a given round to a given collator. If `0` is returned, it could be because no blocks were produced or the storage for that round has been removed. Uses the [`points`](/builders/substrate/interfaces/features/staking/#:~:text=awardedPts(u32, AccountId20)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `round` - uint32 round number to query
        - `candidate` - address of the collator to query points for

    === "Returns"

        - `uint256` points awarded to the collator in the specified round

??? function "**delegationAmount**(*address* delegator, *address* candidate) - read-only function that returns the amount delegated by a given delegator in support of a given candidate. Uses the [`delegatorState`](/builders/substrate/interfaces/features/staking/#:~:text=delegatorState(AccountId20)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `delegator` - address of the delegator
        - `candidate` - address of the candidate

    === "Returns"

        - `uint256` amount delegated

??? function "**isInTopDelegations**(*address* delegator, *address* candidate) - read-only function that returns a boolean indicating whether the given delegator is in the top delegations for the given candidate. Uses the [`topDelegations`](/builders/substrate/interfaces/features/staking/#:~:text=topDelegations(AccountId20)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `delegator` - address of the delegator to check
        - `candidate` - address of the candidate

    === "Returns"

        - `bool` whether the delegator is in the top delegations

??? function "**minDelegation**() - read-only function that gets the minimum delegation amount. Uses the [`minDelegation`](/builders/substrate/interfaces/features/staking/#:~:text=minDelegation()){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        None.

    === "Returns"

        - `uint256` minimum delegation amount

??? function "**candidateCount**() - read-only function that gets the current amount of collator candidates. Uses the [`candidatePool`](/builders/substrate/interfaces/features/staking/#:~:text=candidatePool()){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        None.

    === "Returns"

        - `uint256` current number of collator candidates

??? function "**round**() - read-only function that returns the current round number. Uses the [`round`](/builders/substrate/interfaces/features/staking/#:~:text=round()){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        None.

    === "Returns"

        - `uint256` current round number

??? function "**candidateDelegationCount**(*address* candidate) - read-only function that returns the number of delegations for the specified collator candidate address. Uses the [`candidateInfo`](/builders/substrate/interfaces/features/staking/#:~:text=candidateInfo(AccountId20)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `candidate` - address of the collator candidate to query

    === "Returns"

        - `uint256` number of delegations for the candidate

??? function "**candidateAutoCompoundingDelegationCount**(*address* candidate) - a read-only function that returns the number of auto-compounding delegations for the specified candidate. Uses the [`autoCompoundingDelegations`](/builders/substrate/interfaces/features/staking/#:~:text=autoCompoundingDelegations(AccountId20)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `candidate` - address of the candidate to query

    === "Returns"

        - `uint256` number of auto-compounding delegations

??? function "**delegatorDelegationCount**(*address* delegator) - read-only function that returns the number of delegations for the specified delegator address. Uses the [`delegatorState`](/builders/substrate/interfaces/features/staking/#:~:text=delegatorState(AccountId20)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `delegator` - address of the delegator to query

    === "Returns"

        - `uint256` number of delegations for the delegator

??? function "**selectedCandidates**() - read-only function that gets the selected candidates for the current round. Uses the [`selectedCandidates`](/builders/substrate/interfaces/features/staking/#:~:text=selectedCandidates()){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        None.

    === "Returns"

        - `address[]` array of selected candidate addresses

??? function "**delegationRequestIsPending**(*address* delegator, *address* candidate) - returns a boolean to indicate whether there is a pending delegation request made by a given delegator for a given candidate"

    === "Parameters"

        - `delegator` - address of the delegator
        - `candidate` - address of the candidate

    === "Returns"

        - `bool` whether there is a pending delegation request

??? function "**candidateExitIsPending**(*address* candidate) - returns a boolean to indicate whether a pending exit exists for a specific candidate. Uses the [`candidateInfo`](/builders/substrate/interfaces/features/staking/#:~:text=candidateInfo(AccountId20)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `candidate` - address of the candidate to check

    === "Returns"

        - `bool` whether there is a pending exit request

??? function "**candidateRequestIsPending**(*address* candidate) - returns a boolean to indicate whether there is a pending bond less request made by a given candidate. Uses the [`candidateInfo`](/builders/substrate/interfaces/features/staking/#:~:text=candidateInfo(AccountId20)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `candidate` - address of the candidate to check

    === "Returns"

        - `bool` whether there is a pending bond less request

??? function "**delegationAutoCompound**(*address* delegator, *address* candidate) - returns the auto-compound percentage for a delegation given the delegator and candidate"

    === "Parameters"

        - `delegator` - address of the delegator
        - `candidate` - address of the candidate

    === "Returns"

        - `uint256` auto-compound percentage

??? function "**getDelegatorTotalStaked**(*address* delegator) - read-only function that returns the total staked amount of a given delegator, regardless of the candidate. Uses the [`delegatorState`](/builders/substrate/interfaces/features/staking/#:~:text=delegatorState(AccountId20)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `delegator` - address of the delegator to query

    === "Returns"

        - `uint256` total staked amount

??? function "**getCandidateTotalCounted**(*address* candidate) - read-only function that returns the total amount staked for a given candidate. Uses the [`candidateInfo`](/builders/substrate/interfaces/features/staking/#:~:text=candidateInfo(AccountId20)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `candidate` - address of the candidate to query

    === "Returns"

        - `uint256` total amount staked for the candidate

??? function "**joinCandidates**(*uint256* amount, *uint256* candidateCount) - allows the account to join the set of collator candidates with the specified bond amount and the current candidate count. Uses the [`joinCandidates`](/builders/substrate/interfaces/features/staking/#:~:text=joinCandidates(bond, candidateCount)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `amount` - uint256 bond amount to stake as a candidate
        - `candidateCount` - uint256 current number of candidates in the pool

    === "Returns"

        None.

??? function "**scheduleLeaveCandidates**(*uint256* candidateCount) - schedules a request for a candidate to remove themselves from the candidate pool. Scheduling the request does not automatically execute it. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `executeLeaveCandidates` extrinsic. Uses the [`scheduleLeaveCandidates`](/builders/substrate/interfaces/features/staking/#:~:text=scheduleLeaveCandidates(candidateCount)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `candidateCount` - uint256 current number of candidates in the pool

    === "Returns"

        None.

??? function "**executeLeaveCandidates**(*address* candidate, *uint256* candidateDelegationCount) - executes the due request to leave the set of collator candidates. Uses the [`executeLeaveCandidates`](/builders/substrate/interfaces/features/staking/#:~:text=executeLeaveCandidates(candidate, candidateDelegationCount)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `candidate` - address of the candidate leaving the pool
        - `candidateDelegationCount` - uint256 number of delegations for the candidate

    === "Returns"

        None.

??? function "**cancelLeaveCandidates**(*uint256* candidateCount) - allows a candidate to cancel a pending scheduled request to leave the candidate pool. Given the current number of candidates in the pool. Uses the [`cancelLeaveCandidates`](/builders/substrate/interfaces/features/staking/#:~:text=cancelLeaveCandidates(candidateCount)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `candidateCount` - uint256 current number of candidates in the pool

    === "Returns"

        None.

??? function "**goOffline**() - temporarily leave the set of collator candidates without unbonding. Uses the [`goOffline`](/builders/substrate/interfaces/features/staking/#:~:text=goOffline()){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        None.

    === "Returns"

        None.

??? function "**goOnline**() - rejoin the set of collator candidates after previously calling `goOffline()`. Uses the [`goOnline`](/builders/substrate/interfaces/features/staking/#:~:text=goOnline()){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        None.

    === "Returns"

        None.

??? function "**candidateBondMore**(*uint256* more) - collator candidate increases bond by the specified amount. Uses the [`candidateBondMore`](/builders/substrate/interfaces/features/staking/#:~:text=candidateBondMore(more)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `more` - uint256 amount to increase the bond by

    === "Returns"

        None.

??? function "**scheduleCandidateBondLess**(*uint256* less) - schedules a request to decrease a candidates bond by the specified amount. Scheduling the request does not automatically execute it. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `execute_candidate_bond_request` extrinsic. Uses the [`scheduleCandidateBondLess`](/builders/substrate/interfaces/features/staking/#:~:text=scheduleCandidateBondLess(less)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `less` - uint256 amount to decrease the bond by

    === "Returns"

        None.

??? function "**executeCandidateBondLess**(*address* candidate) - executes any due requests to decrease a specified candidate's bond amount. Uses the [`executeCandidateBondLess`](/builders/substrate/interfaces/features/staking/#:~:text=executeCandidateBondLess(candidate)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `candidate` - address of the candidate to execute the bond decrease for

    === "Returns"

        None.

??? function "**cancelCandidateBondLess**() - allows a candidate to cancel a pending scheduled request to decrease a candidates bond. Uses the [`cancelCandidateBondLess`](/builders/substrate/interfaces/features/staking/#:~:text=cancelCandidateBondLess()){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        None.

    === "Returns"

        None.

??? function "**delegateWithAutoCompound**(*address* candidate, *uint256* amount, *uint8* autoCompound, *uint256* candidateDelegationCount, *uint256* candidateAutoCompoundingDelegationCount, *uint256* delegatorDelegationCount) - makes a delegation in support of a collator candidate and automatically sets the percent of rewards to auto-compound given an integer (no decimals) for `autoCompound` between 0-100. Uses the [`delegateWithAutoCompound`](/builders/substrate/interfaces/features/staking/#:~:text=delegateWithAutoCompound){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `candidate` - address of the candidate to delegate to
        - `amount` - uint256 amount to delegate
        - `autoCompound` - uint8 percentage of rewards to auto-compound (0-100)
        - `candidateDelegationCount` - uint256 current number of delegations for the candidate
        - `candidateAutoCompoundingDelegationCount` - uint256 current number of auto-compounding delegations for the candidate
        - `delegatorDelegationCount` - uint256 current number of delegations from the delegator

    === "Returns"

        None.

??? function "**scheduleRevokeDelegation**(*address* candidate) - schedules a request to revoke a delegation given the address of a candidate. Scheduling the request does not automatically execute it. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `executeDelegationRequest` extrinsic. Uses the [`scheduleRevokeDelegation`](/builders/substrate/interfaces/features/staking/#:~:text=scheduleRevokeDelegation(collator)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `candidate` - address of the candidate to revoke delegation from

    === "Returns"

        None.

??? function "**delegatorBondMore**(*address* candidate, *uint256* more) - delegator increases bond to a collator by the specified amount. Uses the [`delegatorBondMore`](/builders/substrate/interfaces/features/staking/#:~:text=delegatorBondMore(candidate, more)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `candidate` - address of the candidate to increase delegation for
        - `more` - uint256 amount to increase the delegation by

    === "Returns"

        None.

??? function "**scheduleDelegatorBondLess**(*address* candidate, *uint256* less) - schedules a request for a delegator to bond less with respect to a specific candidate. Scheduling the request does not automatically execute it. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `executeDelegationRequest` extrinsic. Uses the [`scheduleDelegatorBondLess`](/builders/substrate/interfaces/features/staking/#:~:text=scheduleDelegatorBondLess(candidate, less)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `candidate` - address of the candidate to decrease delegation for
        - `less` - uint256 amount to decrease the delegation by

    === "Returns"

        None.

??? function "**executeDelegationRequest**(*address* delegator, *address* candidate) - executes any due delegation requests provided the address of a delegator and a candidate. Uses the [`executeDelegationRequest`](/builders/substrate/interfaces/features/staking/#:~:text=executeDelegationRequest(delegator, candidate)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `delegator` - address of the delegator
        - `candidate` - address of the candidate

    === "Returns"

        None.

??? function "**cancelDelegationRequest**(*address* candidate) - cancels any pending delegation requests provided the address of a candidate. Uses the [`cancelDelegationRequest`](/builders/substrate/interfaces/features/staking/#:~:text=cancelDelegationRequest(candidate)){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `candidate` - address of the candidate to cancel the delegation request for

    === "Returns"

        None.

??? function "**setAutoCompound**(*address* candidate, *uint8* value, *uint256* candidateAutoCompoundingDelegationCount, *uint256* delegatorDelegationCount) - sets an auto-compound value for an existing delegation given an integer (no decimals) for the `value` between 0-100. Uses the [`setAutoCompound`](/builders/substrate/interfaces/features/staking/#:~:text=setAutoCompound){target=\_blank} method of the Parachain Staking Pallet"

    === "Parameters"

        - `candidate` - address of the candidate
        - `value` - uint8 percentage to auto-compound (0-100)
        - `candidateAutoCompoundingDelegationCount` - uint256 current number of auto-compounding delegations for the candidate
        - `delegatorDelegationCount` - uint256 current number of delegations from the delegator

    === "Returns"

        None.

## Interact with the Solidity Interface {: #interact-with-solidity-interface }

### Checking Prerequisites {: #checking-prerequisites }

The below example is demonstrated on Moonbase Alpha, however, similar steps can be taken for Moonbeam and Moonriver.

 - Have MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
 - Have an account with at least `{{networks.moonbase.staking.min_del_stake}}` token.
  --8<-- 'text/_common/faucet/faucet-list-item.md'

!!! note
    The example below requires more than `{{networks.moonbase.staking.min_del_stake}}` token due to the minimum delegation amount plus gas fees. If you need more than the faucet dispenses, please contact us on Discord and we will be happy to help you.

### Remix Set Up {: #remix-set-up }

1. Click on the **File explorer** tab
2. Get a copy of [`StakingInterface.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=\_blank} and paste the file contents into a Remix file named `StakingInterface.sol`

![Copying and Pasting the Staking Interface into Remix](/images/builders/ethereum/precompiles/features/staking/staking-1.webp)

### Compile the Contract {: #compile-the-contract }

1. Click on the **Compile** tab, second from top
2. Then to compile the interface, click on **Compile StakingInterface.sol**

![Compiling StakingInteface.sol](/images/builders/ethereum/precompiles/features/staking/staking-2.webp)

### Access the Contract {: #access-the-contract }

1. Click on the **Deploy and Run** tab, directly below the **Compile** tab in Remix. Note: you are not deploying a contract here, instead you are accessing a precompiled contract that is already deployed
2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** drop down
3. Ensure **ParachainStaking - StakingInterface.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract there is no need to deploy, instead you are going to provide the address of the precompile in the **At Address** field
4. Provide the address of the staking precompile for Moonbase Alpha: `{{networks.moonbase.precompiles.staking}}` and click **At Address**
5. The Parachain Staking precompile will appear in the list of **Deployed Contracts**

![Provide the address](/images/builders/ethereum/precompiles/features/staking/staking-3.webp)

### Delegate a Collator with Auto-Compounding {: #delegate-a-collator }

For this example, you are going to be delegating a collator and setting up the percentage of rewards to auto-compound on Moonbase Alpha. Delegators are token holders who stake tokens, vouching for specific candidates. Any user that holds a minimum amount of {{networks.moonbase.staking.min_del_stake}} token in their free balance can become a delegator. When delegating a candidate, you can simultaneously set up auto-compounding. You'll be able to specify a percentage of your rewards that will automatically be applied to your total delegation. You don't have to set up auto-compounding right away, you can always do it at a later time.

You can do your own research and select the candidate you desire. For this guide, the following candidate address will be used: `{{ networks.moonbase.staking.candidates.address1 }}`.

In order to delegate a candidate, you'll need to determine the candidate's current delegation count, their auto-compounding delegation count, and your own delegation count.

The candidate delegation count is the number of delegations backing a specific candidate. To obtain the candidate delegator count, you can call a function that the staking precompile provides. Expand the **PARACHAINSTAKING** contract found under the **Deployed Contracts** list, then:

1. Find and expand the **candidateDelegationCount** function
2. Enter the candidate address (`{{ networks.moonbase.staking.candidates.address1 }}`)
3. Click **call**
4. After the call is complete, the results will be displayed

![Call collator delegation count](/images/builders/ethereum/precompiles/features/staking/staking-4.webp)

The auto-compounding delegation count is the amount of delegations that have auto-compounding configured. To determine the number of delegations that have auto-compounding set up, you can

1. Find and expand the **candidateAutoCompoundingDelegationCount** function
2. Enter the candidate address (`{{ networks.moonbase.staking.candidates.address1 }}`)
3. Click **call**
4. After the call is complete, the results will be displayed

![Get candidate auto-compounding delegation count](/images/builders/ethereum/precompiles/features/staking/staking-5.webp)

The last item you'll need to retrieve is your delegation count. If you don't know your existing number of delegations, you can easily get them by following these steps:

1. Find and expand the **delegatorDelegationCount** function
2. Enter your address
3. Click **call**
4. After the call is complete, the results will be displayed

![Call delegator delegation count](/images/builders/ethereum/precompiles/features/staking/staking-6.webp)

Now that you have obtained the [candidate delegator count](#:~:text=To obtain the candidate delegator count), the [auto-compounding delegation count](#:~:text=To determine the number of delegations that have auto-compounding set up), and your [number of existing delegations](#:~:text=If you don't know your existing number of delegations), you have all of the information you need to delegate a candidate and set up auto-compounding. To get started:

1. Find and expand the **delegateWithAutoCompound** function
2. Enter the candidate address you would like to delegate. For this example you can use `{{ networks.moonbase.staking.candidates.address1 }}`
3. Provide the amount to delegate in Wei. There is a minimum of `{{networks.moonbase.staking.min_del_stake}}` token to delegate, so the lowest amount in Wei is `{{networks.moonbase.staking.min_del_stake_wei}}`
4. Enter an integer (no decimals) between 0-100 to represent the percentage of rewards to auto-compound
5. Enter the delegation count for the candidate
6. Enter the auto-compounding delegation count for the candidate
7. Enter your delegation count
8. Press **transact**
9. MetaMask will pop-up, you can review the details and confirm the transaction

![Delegate a Collator](/images/builders/ethereum/precompiles/features/staking/staking-7.webp)

If you want to delegate without setting up auto-compounding, you can follow the previous steps, but instead of using **delegateWithAutoCompound**, you can use the **delegate** extrinsic.

### Verify Delegation {: #verify-delegation }

To verify your delegation was successful, you can check the chain state in Polkadot.js Apps. First, add your MetaMask address to the [address book in Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/addresses){target=\_blank}.

Navigate to **Accounts** and then **Address Book**, click on **Add contact**, and enter the following information:

1. Add your MetaMask address
2. Provide a nickname for the account
3. Click **Save**

![Add to Address Book](/images/builders/ethereum/precompiles/features/staking/staking-8.webp)

To verify your delegation was successful, head to [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/chainstate){target=\_blank} and navigate to **Developer** and then **Chain State**

1. Select the **parachainStaking** pallet
2. Select the **delegatorState** query
3. Enter your address
4. Optionally, you can enable the **include option** slider if you want to provide a specific blockhash to query
5. Click the **+** button to return the results and verify your delegation

!!! note
    You do not have to enter anything in the **blockhash to query at** field if you are looking for an overview of your delegations.

![Verify delegation](/images/builders/ethereum/precompiles/features/staking/staking-9.webp)

### Confirm Auto-Compounding Percentage {: #confirm-auto-compounding }

You can confirm the percentage of rewards you've set to auto-compound in Remix using the `delegationAutoCompound` function of the Solidity interface:

1. Find and expand the **delegationAutoCompound** function
2. Enter your account you used to delegate with
3. Enter the candidate you've delegated
4. Click **call**
5. The response will appear below the **call** button

![Verify auto-compound percentage](/images/builders/ethereum/precompiles/features/staking/staking-10.webp)

### Set or Change the Auto-Compounding Percentage {: #set-or-change-auto-compounding }

If you initially set up your delegation without auto-compounding or if you want to update the percentage on an existing delegation with auto-compounding set up, you can use the `setAutoCompound` function of the Solidity interface.

You'll need to get the number of delegations with auto-compounding set up for the candidate you want to set or update auto-compounding for. You'll also need to retrieve your own delegation count. You can follow the instructions in the [Delegate a Collator with Auto-Compounding](#delegate-a-collator) section to get both of these items.

Once you have the necessary information, you can take the following steps in Remix:

1. Find and expand the **setAutoCompound** function
2. Enter the candidate's account you want to set or update auto-compounding for
3. Enter a number 0-100 to represent the percentage of rewards you want to auto-compound
4. Enter the auto-compounding delegation count for the candidate
5. Enter your delegation count
6. Press **transact**
7. MetaMask will pop-up, you can review the details and confirm the transaction

![Set or update auto-compound percentage](/images/builders/ethereum/precompiles/features/staking/staking-11.webp)

### Revoke a Delegation {: #revoke-a-delegation }

As of [runtime version 1001](https://moonbeam.network/news/moonriver-technical-update-staking-changes-as-part-of-runtime-upgrade-1001){target=\_blank}, there have been significant changes to the way users can interact with various staking features. Including the way staking exits are handled.

Exits now require you to schedule a request to exit or revoke a delegation, wait a delay period, and then execute the request.

To revoke a delegation for a specific candidate and receive your tokens back, you can use the `scheduleRevokeDelegation` extrinsic. Scheduling a request does not automatically revoke your delegation, you must wait an [exit delay](#exit-delays), and then execute the request by using the `executeDelegationRequest` method.

To revoke a delegation and receive your tokens back, head back over to Remix, then:

1. Find and expand the **scheduleRevokeDelegation** function
2. Enter the candidate address you would like to revoke the delegation for
3. Click **transact**
4. MetaMask will pop, you can review the transaction details, and click **Confirm**

![Revoke delegation](/images/builders/ethereum/precompiles/features/staking/staking-12.webp)

Once the transaction is confirmed, you must wait the duration of the exit delay before you can execute and revoke the delegation request. If you try to revoke it before the exit delay is up, your extrinsic will fail.

After the exit delay has passed, you can go back to Remix and follow these steps to execute the due request:

1. Find and expand the **executeDelegationRequest** function
2. Enter the address of the delegator you would like to revoke the delegation for
3. Enter the candidate address you would like to revoke the delegation from
4. Click **transact**
5. MetaMask will pop, you can review the transaction details, and click **Confirm**

After the call is complete, the results will be displayed and the delegation will be revoked for the given delegator and from the specified candidate. You can also check your delegator state again on Polkadot.js Apps to confirm.

If for any reason you need to cancel a pending scheduled request to revoke a delegation, you can do so by following these steps in Remix:

1. Find and expand the **cancelDelegationRequest** function
2. Enter the candidate address you would like to cancel the pending request for
3. Click **transact**
4. MetaMask will pop, you can review the transaction details, and click **Confirm**

You can check your delegator state again on Polkadot.js Apps to confirm that your delegation is still intact.
