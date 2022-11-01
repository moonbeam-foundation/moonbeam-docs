---
title: Staking Precompile Contract
description: Learn how to use the staking Precompile that allows developers to access staking features using the Ethereum API in a precompiled contract
keywords: solidity, ethereum, staking, moonbeam, precompiled, contracts
---

# Interacting with the Staking Precompile

![Staking Moonbeam Banner](/images/builders/pallets-precompiles/precompiles/staking/staking-banner.png)

## Introduction {: #introduction } 

Moonbeam uses a Delegated Proof of Stake system through the [parachain staking](/builders/pallets-precompiles/pallets/staking){target=_blank} pallet, allowing token holders (delegators) to express exactly which collator candidates they would like to support and with what quantity of stake. The design of the parachain staking pallet is such that it enforces shared risk/reward on chain between delegators and candidates. For general information on staking, such as general terminology, staking variables, and more, please refer to the [Staking on Moonbeam](/learn/features/staking){target=_blank} page.

The staking module is coded in Rust and it is part of a pallet that is normally not accessible from the Ethereum side of Moonbeam. However, a staking precompile allows developers to access the staking features using the Ethereum API in a precompiled contract located at address:

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

This guide will cover the available methods in the staking precompile interface. In addition, it will show you how to interact with the staking pallet through the staking precompile and the Ethereum API. The examples in this guide are done on Moonbase Alpha, but they can be adapted for Moonbeam or Moonriver.

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

## Parachain Staking Solidity Interface {: #the-parachain-staking-solidity-interface } 

[`StakingInterface.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=_blank} is an interface through which Solidity contracts can interact with parachain-staking. The beauty is that Solidity developers don’t have to learn the Substrate API. Instead, they can interact with staking functions using the Ethereum interface they are familiar with.

The Solidity interface includes the following functions:

 - **isDelegator**(*address* delegator) — read-only function that checks whether the specified address is currently a staking delegator. Uses the [`delegatorState`](/builders/pallets-precompiles/pallets/staking/#:~:text=delegatorState(AccountId20)){target=_blank} method of the staking pallet
 - **isCandidate**(*address* candidate) — read-only function that checks whether the specified address is currently a collator candidate. Uses the [`candidateState`](/builders/pallets-precompiles/pallets/staking/#:~:text=candidateState(AccountId20)){target=_blank} method of the staking pallet
 - **isSelectedCandidate**(*address* candidate) - read-only function that checks whether the specified address is currently part of the active collator set. Uses the [`selectedCandidates`](/builders/pallets-precompiles/pallets/staking/#:~:text=selectedCandidates()){target=_blank} method of the staking pallet
 - **points**(*uint256* round) - read-only function that gets the total points awarded to all collators in a given round. Uses the [`points`](/builders/pallets-precompiles/pallets/staking/#:~:text=points(u32)){target=_blank} method of the staking pallet
 - **minDelegation**() — read-only function that gets the minimum delegation amount. Uses the [`minDelegation`](/builders/pallets-precompiles/pallets/staking/#:~:text=minDelegation()){target=_blank} method of the staking pallet
 - **candidateCount**() - read-only function that gets the current amount of collator candidates. Uses the [`candidatePool`](/builders/pallets-precompiles/pallets/staking/#:~:text=candidatePool()){target=_blank} method of the staking pallet
 - **round**() - read-only function that returns the current round number. Uses the [`round`](/builders/pallets-precompiles/pallets/staking/#:~:text=round()){target=_blank} method of the staking pallet
 - **candidateDelegationCount**(*address* candidate) - read-only function that returns the number of delegations for the specified collator candidate address. Uses the [`candidateInfo`](/builders/pallets-precompiles/pallets/staking/#:~:text=candidateInfo(AccountId20)){target=_blank} method of the staking pallet
 - **delegatorDelegationCount**(*address* delegator) - read-only function that returns the number of delegations for the specified delegator address. Uses the [`delegatorState`](/builders/pallets-precompiles/pallets/staking/#:~:text=delegatorState(AccountId20)){target=_blank} method of the staking pallet
 - **selectedCandidates**() - read-only function that gets the selected candidates for the current round. Uses the [`selectedCandidates`](/builders/pallets-precompiles/pallets/staking/#:~:text=selectedCandidates()){target=_blank} method of the staking pallet
 - **delegationRequestIsPending**(*address* delegator, *address* candidate) - returns a boolean to indicate whether there is a pending delegation request made by a given delegator for a given candidate
 - **candidateExitIsPending**(*address* candidate) - returns a boolean to indicate whether a pending exit exists for a specific candidate. Uses the [`candidateInfo`](/builders/pallets-precompiles/pallets/staking/#:~:text=candidateInfo(AccountId20)){target=_blank} method of the staking pallet
 - **candidateRequestIsPending**(*address* candidate) - returns a boolean to indicate whether there is a pending bond less request made by a given candidate. Uses the [`candidateInfo`](/builders/pallets-precompiles/pallets/staking/#:~:text=candidateInfo(AccountId20)){target=_blank} method of the staking pallet
 - **joinCandidates**(*uint256* amount, *uint256* candidateCount) — allows the account to join the set of collator candidates with a specified bond amount and the current candidate count. Uses the [`joinCandidates`](/builders/pallets-precompiles/pallets/staking/#:~:text=joinCandidates(bond, candidateCount)){target=_blank} method of the staking pallet
 - **scheduleLeaveCandidates**(*uint256* candidateCount) - schedules a request for a candidate to remove themselves from the candidate pool. Scheduling the request does not automatically execute it. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `executeLeaveCandidates` extrinsic. Uses the [`scheduleLeaveCandidates`](/builders/pallets-precompiles/pallets/staking/#:~:text=scheduleLeaveCandidates(candidateCount)){target=_blank} method of the staking pallet
 - **executeLeaveCandidates**(*address* candidate, *uint256* candidateDelegationCount) - executes the due request to leave the set of collator candidates. Uses the [`executeLeaveCandidates`](/builders/pallets-precompiles/pallets/staking/#:~:text=executeLeaveCandidates(candidate, candidateDelegationCount)){target=_blank} method of the staking pallet
 - **cancelLeaveCandidates**(*uint256* candidateCount) - allows a candidate to cancel a pending scheduled request to leave the candidate pool. Given the current number of candidates in the pool. Uses the [`cancelLeaveCandidates`](/builders/pallets-precompiles/pallets/staking/#:~:text=cancelLeaveCandidates(candidateCount)){target=_blank} method of the staking pallet 
 - **goOffline**() — temporarily leave the set of collator candidates without unbonding. Uses the [`goOffline`](/builders/pallets-precompiles/pallets/staking/#:~:text=goOffline()){target=_blank} method of the staking pallet
 - **goOnline**() — rejoin the set of collator candidates after previously calling `goOffline()`. Uses the [`goOnline`](/builders/pallets-precompiles/pallets/staking/#:~:text=goOnline()){target=_blank} method of the staking pallet
 - **candidateBondMore**(*uint256* more) — collator candidate increases bond by specified amount. Uses the [`candidateBondMore`](/builders/pallets-precompiles/pallets/staking/#:~:text=candidateBondMore(more)){target=_blank} method of the staking pallet
 - **scheduleCandidateBondLess**(*uint256* less) - schedules a request to decrease a candidates bond by a specified amount. Scheduling the request does not automatically execute it. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `execute_candidate_bond_request` extrinsic. Uses the [`scheduleCandidateBondLess`](/builders/pallets-precompiles/pallets/staking/#:~:text=scheduleCandidateBondLess(less)){target=_blank} method of the staking pallet
 - **executeCandidateBondLess**(*address* candidate) - executes any due requests to decrease a specified candidates bond amount. Uses the [`executeCandidateBondLess`](/builders/pallets-precompiles/pallets/staking/#:~:text=executeCandidateBondLess(candidate)){target=_blank} method of the staking pallet
 - **cancelCandidateBondLess**() - allows a candidate to cancel a pending scheduled request to decrease a candidates bond. Uses the [`cancelCandidateBondLess`](/builders/pallets-precompiles/pallets/staking/#:~:text=cancelCandidateBondLess()){target=_blank} method of the staking pallet
 - **delegate**(*address* candidate, *uint256* amount, *uint256* candidateDelegationCount, *uint256* delegatorDelegationCount) — if the caller is not a delegator, this function adds them to the set of delegators. If the caller is already a delegator, then it adjusts their delegation amount. Uses the [`delegate`](/builders/pallets-precompiles/pallets/staking/#:~:text=delegate(candidate, amount, candidateDelegationCount, delegationCount)){target=_blank} method of the staking pallet
 - **scheduleRevokeDelegation**(*address* candidate) — schedules a request to revoke a delegation given the address of a candidate. Scheduling the request does not automatically execute it. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `executeDelegationRequest` extrinsic. Uses the [`scheduleRevokeDelegation`](/builders/pallets-precompiles/pallets/staking/#:~:text=scheduleRevokeDelegation(collator)){target=_blank} method of the staking pallet
 - **delegatorBondMore**(*address* candidate, *uint256* more) — delegator increases bond to a collator by specified amount. Uses the [`delegatorBondMore`](/builders/pallets-precompiles/pallets/staking/#:~:text=delegatorBondMore(candidate, more)){target=_blank} method of the staking pallet
 - **scheduleDelegatorBondLess**(*address* candidate, *uint256* less) — schedules a request for a delegator to bond less with respect to a specific candidate. Scheduling the request does not automatically execute it. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `executeDelegationRequest` extrinsic. Uses the [`scheduleDelegatorBondLess`](/builders/pallets-precompiles/pallets/staking/#:~:text=scheduleDelegatorBondLess(candidate, less)){target=_blank} method of the staking pallet
 - **executeDelegationRequest**(*address* delegator, *address* candidate) - executes any due delegation requests provided the address of a delegator and a candidate. Uses the [`executeDelegationRequest`](/builders/pallets-precompiles/pallets/staking/#:~:text=executeDelegationRequest(delegator, candidate)){target=_blank} method of the staking pallet
 - **cancelDelegationRequest**(*address* candidate) - cancels any pending delegation requests provided the address of a candidate. Uses the [`cancelDelegationRequest`](/builders/pallets-precompiles/pallets/staking/#:~:text=cancelDelegationRequest(candidate)){target=_blank} method of the staking pallet

As of runtime 1800, the following methods are **deprecated**:

 - **scheduleLeaveDelegators**() — schedules a request to leave the set of delegators and revoke all ongoing delegations. Scheduling the request does not automatically execute it. There is an [exit delay](#exit-delays) that must be waited before you can execute the request via the `executeLeaveDelegators` extrinsic. Use the [batch utility](/builders/pallets-precompiles/precompiles/batch){target=_blank} with `scheduleRevokeDelegation` for all delegations instead
 - **executeLeaveDelegators**(*address* delegator, *uint256* delegatorDelegationCount) - executes the due request to leave the set of delegators and revoke all delegations. Use the [batch utility](/builders/pallets-precompiles/precompiles/batch){target=_blank} with `executeDelegationRequest` for all delegations instead
 - **cancelLeaveDelegators**() - cancels a pending scheduled request to leave the set of delegators. Use the [batch utility](/builders/pallets-precompiles/precompiles/batch){target=_blank} with `cancelDelegationRequest` for all delegations instead

As of runtime 1001, the following methods are **deprecated** and, as of runtime 1800, have been removed:

 - **is_nominator**(*address* nominator) — read-only function that checks whether the specified address is currently a staking delegator. Use `isDelegator` instead
 - **min_nomination**() — read-only function that gets the minimum delegation amount. Use `minDelegation` instead
 - **collator_nomination_count**(*address* collator) - read-only function that returns the number of delegations for the specified collator address. Use `candidateDelegationCount` instead
 - **nominator_nomination_count**(*address* nominator) - read-only function that returns the number of delegations for the specified delegator address. Use `delegatorDelegationCount` instead
 - **leave_candidates**(*uint256* amount, *uint256* candidateCount) — immediately removes the account from the candidate pool to prevent others from selecting it as a collator and triggers unbonding. Use `scheduleLeaveCandidates` and `executeLeaveCandidates` instead
 - **candidate_bond_less**(*uint256* less) — collator candidate decreases bond by specified amount. Use `scheduleCandidateBondLess` and `executeCandidateBondLess` instead
 - **nominate**(*address* collator, *uint256* amount, *uint256* collatorNominationCount, *uint256* nominatorNominationCount) — if the caller is not a delegator, this function adds them to the set of delegators. If the caller is already a delegator, then it adjusts their delegation amount. Use `delegate` instead
 - **leave_nominators**(*uint256* nominatorNominationCount) — leave the set of delegators and revoke all ongoing delegations. Use `scheduleLeaveDelegators` and `executeLeaveDelegators` instead
 - **revoke_nominations**(*address* collator) — revoke a specific delegation. Use `scheduleRevokeDelegation` and `executeDelegationRequest` instead
 - **nominator_bond_more**(*address* collator, *uint256* more) — delegator increases bond to a collator by specified amount. Use `delegatorBondMore` instead
 - **nominator_bond_less**(*address* collator, *uint256* less) — delegator decreases bond to a collator by specified amount. Use `scheduleDelegatorBondLess` and `executeDelegationRequest` instead

## Interact with the Solidity Interface {: #interact-with-solidity-interface }

### Checking Prerequisites {: #checking-prerequisites } 

The below example is demonstrated on Moonbase Alpha, however, similar steps can be taken for Moonbeam and Moonriver.

 - Have MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - Have an account with at least `{{networks.moonbase.staking.min_del_stake}}` token.
  --8<-- 'text/faucet/faucet-list-item.md'

!!! note
    The example below requires more than `{{networks.moonbase.staking.min_del_stake}}` token due to the minimum delegation amount plus gas fees. If you need more than the faucet dispenses, please contact us on Discord and we will be happy to help you. 

### Remix Set Up {: #remix-set-up } 

1. Click on the **File explorer** tab
2. Get a copy of [`StakingInterface.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=_blank} and paste the file contents into a Remix file named `StakingInterface.sol`

![Copying and Pasting the Staking Interface into Remix](/images/builders/pallets-precompiles/precompiles/staking/staking-1.png)

### Compile the Contract {: #compile-the-contract } 

1. Click on the **Compile** tab, second from top
2. Then to compile the interface, click on **Compile StakingInterface.sol**

![Compiling StakingInteface.sol](/images/builders/pallets-precompiles/precompiles/staking/staking-2.png)

### Access the Contract {: #access-the-contract } 

1. Click on the **Deploy and Run** tab, directly below the **Compile** tab in Remix. Note: you are not deploying a contract here, instead you are accessing a precompiled contract that is already deployed
2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** drop down
3. Ensure **ParachainStaking - StakingInterface.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract there is no need to deploy, instead you are going to provide the address of the precompile in the **At Address** field
4. Provide the address of the staking precompile for Moonbase Alpha: `{{networks.moonbase.precompiles.staking}}` and click **At Address**
5. The Parachain Staking precompile will appear in the list of **Deployed Contracts**

![Provide the address](/images/builders/pallets-precompiles/precompiles/staking/staking-3.png)

### Delegate a Collator {: #delegate-a-collator } 

For this example, you are going to be delegating a collator on Moonbase Alpha. Delegators are token holders who stake tokens, vouching for specific candidates. Any user that holds a minimum amount of {{networks.moonbase.staking.min_del_stake}} token in their free balance can become a delegator. 

You can do your own research and select the candidate you desire. For this guide, the following candidate address will be used: `{{ networks.moonbase.staking.candidates.address1 }}`.

In order to delegate a candidate, you'll need to determine the current candidate delegation count and delegator delegation count. The candidate delegation count is the number of delegations backing a specific candidate. The delegator delegation account is the number of delegations made by the delegator.

To obtain the candidate delegator count, you can call a function that the staking precompile provides. Expand the **PARACHAINSTAKING** contract found under the **Deployed Contracts** list, then:

1. Find and expand the **candidateDelegationCount** function
2. Enter the candidate address (`{{ networks.moonbase.staking.candidates.address1 }}`)
3. Click **call**
4. After the call is complete, the results will be displayed

![Call collator delegation count](/images/builders/pallets-precompiles/precompiles/staking/staking-4.png)

If you don't know your existing number of delegations, you can easily get them by following these steps:

1. Find and expand the **delegatorDelegationCount** function
2. Enter your address
3. Click **call**
4. After the call is complete, the results will be displayed

![Call delegator delegation count](/images/builders/pallets-precompiles/precompiles/staking/staking-5.png)

Now that you have obtained the [candidate delegator count](#:~:text=To obtain the candidate delegator count) and your [number of existing delegations](#:~:text=If you don't know your existing number of delegations), you have all of the information you need to delegate a candidate. To get started:

1. Find and expand the **delegate** function
2. Enter the candidate address you would like to delegate (`{{ networks.moonbase.staking.candidates.address1 }}`)
3. Provide the amount to delegate in Wei. There is a minimum of `{{networks.moonbase.staking.min_del_stake}}` token to delegate, so the lowest amount in Wei is `5000000000000000000`
4. Enter the delegation count for the candidate
5. Enter your delegation count
6. Press **transact**
7. MetaMask will pop-up, you can review the details and confirm the transaction

![Delegate a Collator](/images/builders/pallets-precompiles/precompiles/staking/staking-6.png)

### Verify Delegation {: #verify-delegation } 

To verify your delegation was successful, you can check the chain state in Polkadot.js Apps. First, add your MetaMask address to the [address book in Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/addresses){target=_blank}. 

1. Navigate to **Accounts** and then **Address Book**
2. Click on **Add contact**
3. Add your MetaMask address
4. Provide a nickname for the account
5. Click **Save**

![Add to Address Book](/images/builders/pallets-precompiles/precompiles/staking/staking-7.png)

To verify your delegation was successful, head to [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/chainstate){target=_blank} and navigate to **Developer** and then **Chain State**

1. Select the **parachainStaking** pallet
2. Select the **delegatorState** query
3. Enter your address
4. Optionally, you can enable the **include option** slider if you want to provide a specific blockhash to query
5. Click the **+** button to return the results and verify your delegation

!!! note
    You do not have to enter anything in the **blockhash to query at** field if you are looking for an overview of your delegations.

![Verify delegation](/images/builders/pallets-precompiles/precompiles/staking/staking-8.png)

### Revoke a Delegation {: #revoke-a-delegation } 

As of [runtime version 1001](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/){target=_blank}, there have been significant changes to the way users can interact with various staking features. Including the way staking exits are handled. 

Exits now require you to schedule a request to exit or revoke a delegation, wait a delay period, and then execute the request.

To revoke a delegation for a specific candidate and receive your tokens back, you can use the `scheduleRevokeDelegation` extrinsic. Scheduling a request does not automatically revoke your delegation, you must wait an [exit delay](#exit-delays), and then execute the request by using the `executeDelegationRequest` method.

To revoke a delegation and receive your tokens back, head back over to Remix, then:

1. From the list of **Deployed Contracts**, find and expand the **scheduleRevokeDelegation** function
2. Enter the candidate address you would like to revoke the delegation for
3. Click **transact**
4. MetaMask will pop, you can review the transaction details, and click **Confirm**

![Revoke delegation](/images/builders/pallets-precompiles/precompiles/staking/staking-9.png)

Once the transaction is confirmed, you must wait the duration of the exit delay before you can execute and revoke the delegation request. If you try to revoke it before the exit delay is up, your extrinsic will fail.

After the exit delay has passed, you can go back to Remix and follow these steps to execute the due request:

1. From the list of **Deployed Contracts**, find and expand the **executeDelegationRequest** function
2. Enter the address of the delegator you would like to revoke the delegation for
3. Enter the candidate address you would like to revoke the delegation from
4. Click **transact**
5. MetaMask will pop, you can review the transaction details, and click **Confirm**

After the call is complete, the results will be displayed and the delegation will be revoked for the given delegator and from the specified candidate. You can also check your delegator state again on Polkadot.js Apps to confirm.

If for any reason you need to cancel a pending scheduled request to revoke a delegation, you can do so by following these steps in Remix:

1. From the list of **Deployed Contracts**, find and expand the **cancelDelegationRequest** function
2. Enter the candidate address you would like to cancel the pending request for
3. Click **transact**
4. MetaMask will pop, you can review the transaction details, and click **Confirm**

You can check your delegator state again on Polkadot.js Apps to confirm that your delegation is still in tact.