---
title: Staking Functions
description: Moonbeam Parachain Staking Ethereum Solidity Precompile Interface Demo
---

# Interacting with the Staking Precompile

![Staking Moonbeam Banner](/images/builders/build/canonical-contracts/precompiles/staking/staking-banner.png)

## Introduction {: #introduction } 

Moonbeam uses a Delegated Proof of Stake system through a [Parachain-Staking](https://github.com/PureStake/moonbeam/tree/master/pallets/parachain-staking/src) pallet, allowing token holders (delegators) to express exactly which collator candidates they would like to support and with what quantity of stake. The design of the Parachain-Staking pallet is such that it enforces shared risk/reward on chain between delegators and candidates.

The Staking module is coded in Rust and it is part of a pallet that is normally not accessible from the Ethereum side of Moonbeam. However, a Staking Precompile allows developers to access the staking features using the Ethereum API in a precompiled contract located at address:

=== "Moonbeam"
     ```
     {{networks.moonbeam.precompiles.staking}}
     ```

=== "Moonriver"
     ```
     {{networks.moonriver.precompiles.staking}}
     ```

=== "Moonbase Alpha"
     ```
     {{networks.moonbase.precompiles.staking}}
     ```

This guide will show you how to interact with the Staking Precompile on Moonbase Alpha. Similar steps can be followed for Moonrvier.

## The Parachain-Staking Solidity Interface {: #the-parachain-staking-solidity-interface } 

[StakingInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol) is an interface through which solidity contracts can interact with Parachain-Staking. The beauty is that solidity developers don’t have to learn the Substrate API. Instead, they can interact with staking functions using the Ethereum interface they are familiar with.

The interface includes the following functions:

 - **is_delegator**(*address* delegator) — read-only function that checks whether the specified address is currently a staking delegator. Replaces the deprecated `is_nominator` extrinsic
 - **is_candidate**(*address* candidate) — read-only function that checks whether the specified address is currently a collator candidate
 - **is_selected_candidate**(*address* candidate) - read-only function that checks whether the specified address is currently part of the active collator set
 - **points**(*uint256* round) - read-only function that gets the total points awarded to all collators in a given round
 - **min_delegation**() — read-only function that gets the minimum delegation amount. Replaces the deprecated `min_nomination` extrinsic
 - **candidate_count**() - read-only function that gets the current amount of collator candidates
 - **candidate_delegation_count**(*address* candidate) - read-only function that returns the number of delegations for the specified collator candidate address. Replaces the deprecated `collator_nomination_count` extrinsic
 - **delegator_delegation_count**(*address* delegator) - read-only function that returns the number of delegations for the specified delegator address. Replaces the deprecated `nominator_nomination_count` extrinsic
 - **join_candidates**(*uint256* amount, *uint256* candidateCount) — allows the account to join the set of collator candidates with a specified bond amount and the current candidate count
 - **schedule_leave_candidates**(*uint256* candidateCount) - schedules a request for a candidate to remove themselves from the candidate pool. Scheduling the request does not automatically execute it. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `execute_leave_candidates` extrinsic. Replaces the deprecated `leave_candidates` extrinsic
 - **execute_leave_candidates**() - executes the due request to leave the set of collator candidates 
 - **cancel_leave_candidates**(*uint256* candidateCount) - allows a candidate to cancel a pending scheduled request to leave the candidate pool. Given the current number of candidates in the pool
 - **go_offline**() — temporarily leave the set of collator candidates without unbonding
 - **go_online**() — rejoin the set of collator candidates after previously calling go_offline()
 - **candidate_bond_more**(*uint256* more) — collator candidate increases bond by specified amount
 - **schedule_candidate_bond_less**(*uint256* more) - schedules a request to decrease a candidates bond by a specified amount. Scheduling the request does not automatically execute it. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `execute_candidate_bond_request` extrinsic. Replaces the deprecated `candidate_bond_less` extrinsic
 - **execute_candidate_bond_request**(*address* candidate) - executes any due requests to decrease a specified candidates bond amount
 - **cancel_candidate_bond_request**() - allows a candidate to cancel a pending scheduled request to decrease a candidates bond
 - **delegate**(*address* candidate, *uint256* amount, *uint256* candidateDelegationCount, *uint256* delegatorDelegationCount) — if the caller is not a delegator, this function adds them to the set of delegators. If the caller is already a delegator, then it adjusts their delegation amount. Replaces the deprecated `nominate` extrinsic
 - **schedule_leave_delegators**() — schedules a request to leave the set of delegators and revoke all ongoing delegations. Scheduling the request does not automatically execute it. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `execute_leave_delegators` extrinsic. Replaces the deprecated `leave_nominators` extrinsic
 - **execute_leave_delegators**(*uint256* delegatorDelegationCount) - executes the due request to leave the set of delegators and revoke all delegations
 - **cancel_leave_delegators**() - cancels a pending scheduled request to leave the set of delegators
 - **schedule_revoke_delegation**(*address* candidate) — schedules a request to revoke a delegation given the address of a candidate. Scheduling the request does not automatically execute it. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `execute_delegation_request` extrinsic. Replaces the deprecated `revoke_nominations` extrinsic
 - **delegator_bond_more**(*address* candidate, *uint256* more) — delegator increases bond to a collator by specified amount. Replaces the deprecated `nominator_bond_more` extrinsic
 - **schedule_delegator_bond_less**(*address* candidate, *uint256* less) — schedules a request for a delegator to bond less with respect to a specific candidate. Scheduling the request does not automatically execute it. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `execute_delegation_request` extrinsic. Replaces the deprecated `nominator_bond_less` extrinsic
 - **execute_delegation_request**(*address* delegator, *address* candidate) - executes any due delegation requests provided the address of a delegator and a candidate
 - **cancel_delegation_request**(*address* candidate) - cancels any pending delegation requests provided the address of a candidate

The following methods are **deprecated** and will be removed in the future:

 - **is_nominator**(*address* nominator) — read-only function that checks whether the specified address is currently a staking delegator
 - **min_nomination**() — read-only function that gets the minimum delegation amount
 - **collator_nomination_count**(*address* collator) - read-only function that returns the number of delegations for the specified collator address
 - **nominator_nomination_count**(*address* nominator) - read-only function that returns the number of delegations for the specified delegator address
 - **leave_candidates**(*uint256* amount, *uint256* candidateCount) — immediately removes the account from the candidate pool to prevent others from selecting it as a collator and triggers unbonding
 - **candidate_bond_less**(*uint256* less) — collator candidate decreases bond by specified amount
 - **nominate**(*address* collator, *uint256* amount, *uint256* collatorNominationCount, *uint256* nominatorNominationCount) — if the caller is not a delegator, this function adds them to the set of delegators. If the caller is already a delegator, then it adjusts their delegation amount
 - **leave_nominators**(*uint256* nominatorNominationCount) — leave the set of delegators and revoke all ongoing delegations
 - **revoke_nominations**(*address* collator) — revoke a specific delegation
 - **nominator_bond_more**(*address* collator, *uint256* more) — delegator increases bond to a collator by specified amount
 - **nominator_bond_less**(*address* collator, *uint256* less) — delegator decreases bond to a collator by specified amount

## Exit Delays 

Some of the aforementioned staking interface functions include exit delays that you must wait before the request can be executed. The exit delays to note are as follows:

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

## Checking Prerequisites {: #checking-prerequisites } 

The below example is demonstrated on Moonbase Alpha, however, similar steps can be taken for Moonbeam and Moonriver.

 - Have MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/)
 - Have an account with over `{{networks.moonbase.staking.min_del_stake}}` tokens. You can get this from [Mission Control](/builders/get-started/moonbase/#get-tokens/)

!!! note
    The example below requires more than `{{networks.moonbase.staking.min_del_stake}}` tokens due to the minimum delegation amount plus gas fees. If you need more than the faucet dispenses, please contact us on Discord and we will be happy to help you. 

## Remix Set Up {: #remix-set-up } 

1. Get a copy of [StakingInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol)
2. Copy and paste the file contents into a Remix file named StakingInterface.sol

![Copying and Pasting the Staking Interface into Remix](/images/builders/build/canonical-contracts/precompiles/staking/staking-1.png)

## Compile the Contract {: #compile-the-contract } 

1. Click on the Compile tab, second from top
2. Compile [StakingInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol)

![Compiling StakingInteface.sol](/images/builders/build/canonical-contracts/precompiles/staking/staking-2.png)

## Access the Contract {: #access-the-contract } 

1. Click on the Deploy and Run tab, directly below the Compile tab in Remix. **Note**: we are not deploying a contract here, instead we are accessing a precompiled contract that is already deployed
2. Make sure **Injected Web3** is selected in the Environment drop down
3. Ensure **ParachainStaking - StakingInterface.sol** is selected in the **Contract** dropdown. Since this is a precompiled contract there is no need to deploy, instead we are going to provide the address of the precompile in the **At Address** Field
4. Provide the address of the staking precompile for Moonbase Alpha: `{{networks.moonbase.precompiles.staking}}` and click **At Address**
5. The Parachain Staking precompile will appear in the list of **Deployed Contracts**

![Provide the address](/images/builders/build/canonical-contracts/precompiles/staking/staking-3.png)

## Delegate a Collator {: #delegate-a-collator } 

For this example, we are going to be delegating a collator on Moonbase Alpha. Delegators are token holders who stake tokens, vouching for specific candidates. Any user that holds a minimum amount of {{networks.moonbase.staking.min_del_stake}} tokens as free balance can become a delegator. 

You can do your own research and select the candidate you desire. For this guide, the following candidate address will be used: `{{ networks.moonbase.staking.candidates.address1 }}`.

In order to delegate a candidate, you'll need to determine the current candidate delegation count and delegator delegation count. The candidate delegation count is the number of delegations backing a specific candidate. The delegator delegation account is the number of delegations made by the delegator.

### Get the Candidate Delegator Count {: #get-the-candidate-delegator-count } 

To obtain the candidate delegator count, you can call a function that the staking precompile provides. Expand the **PARACHAINSTAKING** contract found under the **Deployed Contracts** list, then:

1. Find and expand the **candidate_delegation_count** function
2. Enter the candidate address (`{{ networks.moonbase.staking.candidates.address1 }}`)
3. Click **call**
4. After the call is complete, the results will be displayed

![Call collator delegation count](/images/builders/build/canonical-contracts/precompiles/staking/staking-4.png)

### Get your Number of Existing Delegations {: #get-your-number-of-existing-delegations } 

If you don't know your existing number of delegations, you can easily get them by following these steps:

1. Find and expand the **delegator_delegation_count** function
2. Enter your address
3. Click **call**
4. After the call is complete, the results will be displayed

![Call delegator delegation count](/images/builders/build/canonical-contracts/precompiles/staking/staking-5.png)

### Call Delegate {: #call-delegate } 

Now that you have obtained the [candidate delegator count](#get-the-candidate-delegator-count) and your [number of existing delegations](#get-your-number-of-existing-delegations), you have all of the information you need to delegate a candidate. To get started:

1. Find and expand the **delegate** function
2. Enter the candidate address you would like to delegate (`{{ networks.moonbase.staking.candidates.address1 }}`)
3. Provide the amount to delegate in WEI. There is a minimum of `{{networks.moonbase.staking.min_del_stake}}` tokens to delegate, so the lowest amount in WEI is `5000000000000000000`
4. Enter the delegation count for the candidate
5. Enter your delegation count
6. Press **transact**
7. MetaMask will pop-up, you can review the details and confirm the transaction

![Delegate a Collator](/images/builders/build/canonical-contracts/precompiles/staking/staking-6.png)

## Verify Delegation {: #verify-delegation } 

To verify your delegation was successful, you can check the chain state in Polkadot.js Apps. First, add your metamask address to the [address book in Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/addresses){target=_blank}. If you've already completed this step you can skip ahead to the [Verify Delegator State](#verify-delegator-state) section to jump right in. 

### Add Metamask Address to Address Book {: #add-metamask-address-to-address-book } 

1. Navigate to **Accounts** and then **Address Book**
2. Click on **Add contact**
3. Add your Metamask Address
4. Provide a nickname for the account
5. Click **Save**

![Add to Address Book](/images/builders/build/canonical-contracts/precompiles/staking/staking-7.png)

### Verify Delegator State {: #verify-delegator-state } 

To verify your delegation was successful, head to [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/chainstate){target=_blank} and navigate to **Developer** and then **Chain State**

1. Select the **parachainStaking** pallet
2. Select the **delegatorState** query
3. Enter your address
4. Optionally, you can enable the **include option** slider if you want to provide a specific blockhash to query
5. Click the **+** button to return the results and verify your delegation

!!! note
    You do not have to enter anything in the **blockhash to query at** field if you are looking for an overview of your delegations.

![Verify delegation](/images/builders/build/canonical-contracts/precompiles/staking/staking-8.png)

## Revoking a Delegation {: #revoking-a-delegation } 

As of [runtime version 1001](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/), there have been significant changes to the way users can interact with various staking features. Including the way staking exits are handled. 

Exits now require you to schedule a request to exit or revoke a delegation, wait a delay period, and then execute the request.

To revoke a delegation for a specific candidate and receive your tokens back, you can use the `scheduleRevokeDelegation` extrinsic. Scheduling a request does not automatically revoke your delegation, you must wait an [exit delay](#exit-delays), and then execute the request by using the `executeDelegationRequest` method.

### Schedule Request to Revoke a Delegation

To revoke a delegation and receive your tokens back, head back over to Remix, then:

1. From the list of **Deployed Contracts**, find and expand the **schedule_revoke_delegation** function
2. Enter the candidate address you would like to revoke the delegation for
3. Click **transact**
4. MetaMask will pop, you can review the transaction details, and click **confirm**

![Revoke delegation](/images/builders/build/canonical-contracts/precompiles/staking/staking-9.png)

Once the transaction is confirmed, you must wait the duration of the exit delay before you can execute and revoke the delegation request. If you try to revoke it before the exit delay is up, your extrinsic will fail.

### Execute Request to Revoke a Delegation

After the exit delay has passed, you can go back to Remix and follow these steps to execute the due request:

1. From the list of **Deployed Contracts**, find and expand the **execute_delegation_request** function
2. Enter the address of the delegator you would like to revoke the delegation for
3. Enter the candidate address you would like to revoke the delegation from
4. Click **transact**
5. MetaMask will pop, you can review the transaction details, and click **confirm**

After the call is complete, the results will be displayed and the delegation will be revoked for the given delegator and from the specified candidate. You can also check your delegator state again on Polkadot.js Apps to confirm.

### Cancel Request to Revoke a Delegation

If for any reason you need to cancel a pending scheduled request to revoke a delegation, you can do so by following these steps in Remix:

1. From the list of **Deployed Contracts**, find and expand the **cancel_delegation_request** function
2. Enter the candidate address you would like to cancel the pending request for
3. Click **transact**
4. MetaMask will pop, you can review the transaction details, and click **confirm**

You can check your delegator state again on Polkadot.js Apps to confirm that your delegation is still in tact.