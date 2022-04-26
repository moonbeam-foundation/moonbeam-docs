---
title: Moonbeam Collator Activities
description: Instructions on how to dive in and learn about the related activites for becoming and being a collator in the Moonbeam Network.
---

# Collator Activities

![Collator Activities Banner](/images/node-operators/networks/collators/activities/activities-banner.png)

## Introduction {: #introduction }

Becoming a collator on Moonbeam-based networks require you to meet [bonding requirements](/node-operators/networks/collators/requirements/#bonding-requirements){target=_blank} and join the candidate pool. Once you're in the candidate pool, you can then adjust your self-bond amount or decide to leave the pool at any time.

If you wish to reduce your self-bond amount or leave the candidate pool, it requires you to first schedule a request to leave and then execute upon the request after a [delay period](#collator-timings) has passed.

This guide will take you through the important timings to be aware of when leaving or reducing your self-bond amount, how to join and leave the candidate pool, and adjust your self-bond.

## Collator Timings {: #collator-timings }

Before getting started, it's important to note some of the timings of different actions related to collation activities:

=== "Moonbeam"
    |               Variable                |                                                                         Value                                                                         |
    |:-------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    |            Round duration             |                        {{ networks.moonbeam.staking.round_blocks }} blocks ({{ networks.moonbeam.staking.round_hours }} hours)                        |
    |           Leave candidates            |    {{ networks.moonbeam.collator_timings.leave_candidates.rounds }} rounds ({{ networks.moonbeam.collator_timings.leave_candidates.hours }} hours)    |
    |           Revoke delegation           | {{ networks.moonbeam.delegator_timings.revoke_delegations.rounds }} rounds ({{ networks.moonbeam.delegator_timings.revoke_delegations.hours }} hours) |
    |        Reduce self-delegation         |       {{ networks.moonbeam.collator_timings.can_bond_less.rounds }} rounds ({{ networks.moonbeam.collator_timings.can_bond_less.hours }} hours)       |
    | Rewards payouts (after current round) |    {{ networks.moonbeam.delegator_timings.rewards_payouts.rounds }} rounds ({{ networks.moonbeam.delegator_timings.rewards_payouts.hours }} hours)    |

=== "Moonriver"
    |               Variable                |                                                                          Value                                                                          |
    |:-------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |            Round duration             |                        {{ networks.moonriver.staking.round_blocks }} blocks ({{ networks.moonriver.staking.round_hours }} hours)                        |
    |           Leave candidates            |    {{ networks.moonriver.collator_timings.leave_candidates.rounds }} rounds ({{ networks.moonriver.collator_timings.leave_candidates.hours }} hours)    |
    |           Revoke delegation           | {{ networks.moonriver.delegator_timings.revoke_delegations.rounds }} rounds ({{ networks.moonriver.delegator_timings.revoke_delegations.hours }} hours) |
    |        Reduce self-delegation         |       {{ networks.moonriver.collator_timings.can_bond_less.rounds }} rounds ({{ networks.moonriver.collator_timings.can_bond_less.hours }} hours)       |
    | Rewards payouts (after current round) |    {{ networks.moonriver.delegator_timings.rewards_payouts.rounds }} rounds ({{ networks.moonriver.delegator_timings.rewards_payouts.hours }} hours)    |

=== "Moonbase Alpha"
    |               Variable                |                                                                         Value                                                                         |
    |:-------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    |            Round duration             |                        {{ networks.moonbase.staking.round_blocks }} blocks ({{ networks.moonbase.staking.round_hours }} hours)                        |
    |           Leave candidates            |    {{ networks.moonbase.collator_timings.leave_candidates.rounds }} rounds ({{ networks.moonbase.collator_timings.leave_candidates.hours }} hours)    |
    |           Revoke delegation           | {{ networks.moonbase.delegator_timings.revoke_delegations.rounds }} rounds ({{ networks.moonbase.delegator_timings.revoke_delegations.hours }} hours) |
    |      Reduce self-delegation      |      {{ networks.moonbase.delegator_timings.del_bond_less.rounds }} rounds ({{ networks.moonbase.delegator_timings.del_bond_less.hours }} hours)      |
    | Rewards payouts (after current round) |    {{ networks.moonbase.delegator_timings.rewards_payouts.rounds }} rounds ({{ networks.moonbase.delegator_timings.rewards_payouts.hours }} hours)    |

!!! note 
    The values presented in the previous table are subject to change in future releases.

## Become a Candidate {: #become-a-candidate } 

### Get the Size of the Candidate Pool {: #get-the-size-of-the-candidate-pool } 

First, you need to get the `candidatePool` size (this can change through governance) as you'll need to submit this parameter in a later transaction. To do so, you'll have to run the following JavaScript code snippet from within [Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/js){target=_blank}:

```js
// Simple script to get candidate pool size
const candidatePool = await api.query.parachainStaking.candidatePool();
console.log(`Candidate pool size is: ${candidatePool.length}`);
```

 1. Head to the **Developer** tab 
 2. Click on **JavaScript**
 3. Copy the code from the previous snippet and paste it inside the code editor box 
 4. (Optional) Click the save icon and set a name for the code snippet, for example, "Get candidatePool size". This will save the code snippet locally
 5. To execute the code, click on the run button
 6. Copy the result, as you'll need it when joining the candidate pool

![Get Number of Candidates](/images/node-operators/networks/collators/activities/activities-1.png)

### Join the Candidate Pool {: #join-the-candidate-pool } 

Once your node is running and in sync with the network, you become a candidate (and join the candidate pool). Depending on which network you are connected to, head to [Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/accounts){target=_blank} and take the following steps:

 1. Navigate to the **Developer** tab and click on **Extrinsics**
 2. Select the account you want to be associated with your collation activities
 3. Confirm your account is funded with at least the [minimum stake required](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=_blank} plus some extra for transaction fees 
 4. Select **parachainStaking** pallet under the **submit the following extrinsic** menu
 5. Open the drop-down menu, which lists all the possible extrinsics related to staking, and select the **joinCandidates()** function
 6. Set the bond to at least the [minimum amount](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=_blank} to be considered a candidate. You'll need to enter this amount in `Wei`. As an example, the minimum bond of {{ networks.moonbase.staking.min_can_stk }} DEV on Moonbase Alpha would be `{{ networks.moonbase.staking.min_can_stk_wei }}` in Wei ({{ networks.moonbase.staking.min_can_stk }} + 18 extra zeros). Only the candidate bond counts for this check. Additional delegations do not count
 7. Set the candidate count as the candidate pool size. To learn how to retrieve this value, check the [Get the Size of the Candidate Pool](#get-the-size-of-the-candidate-pool) section
 8. Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account

![Join candidate pool via Polkadot.js](/images/node-operators/networks/collators/activities/activities-2.png)

!!! note
    Function names and the minimum bond requirement are subject to change in future releases.

As mentioned before, only the top candidates by delegated stake will be in the active set of collators. The exact number of candidates in the top for each network and the minimum bond amount can be found in the [Minimum Collator Bond](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=_blank} section.

## Stop Collating {: #stop-collating } 

As of the latest runtime upgrade, [runtime version 1001](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/){target=_blank}, there have been significant changes to the way users can interact with various staking features, including the way staking exits are handled. 

To stop collating and leave the candidate pool, you must first schedule a request to leave the pool. Scheduling a request does not automatically remove you from the candidate pool, you must wait an [exit delay](#collator-timings). After the delay you will be able to execute the request and stop collating. While you are waiting the specified number of rounds, you will still be eligible to produce blocks and earn rewards if you're in the active set.

Similar to [Polkadot's `chill()`](https://wiki.polkadot.network/docs/maintain-guides-how-to-chill){target=_blank} functionality, you can [temporarily leave the candidate pool](#temporarily-leave-the-candidate-pool) without unbonding your tokens.

### Schedule Request to Leave Candidates

To get started and schedule a request, take the following steps:

 1. Navigate to the **Developer** tab 
 2. Click on **Extrinsics**
 3. Select your candidate account
 4. Select **parachainStaking** pallet under the **submit the following extrinsic** menu
 5. Select the **scheduleLeaveCandidates** extrinsic
 6. Enter the `candidateCount` which you should have retrieved in the [Get the Size of the Candidate Pool](#get-the-size-of-the-candidate-pool) section
 7. Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account

![Schedule leave candidates request](/images/node-operators/networks/collators/activities/activities-3.png)

### Execute Request to Leave Candidates

After the waiting period has passed, you'll be able to execute the request. To execute the request, you can follow these steps:

 1. Navigate to the **Developer** tab 
 2. Click on **Extrinsics**
 3. Select your candidate account
 4. Select **parachainStaking** pallet under the **submit the following extrinsic** menu
 5. Select the **executeLeaveCandidates** extrinsic
 6. Select the target candidate account (anyone can execute the request after the exit delay has passed after submitting the `scheduleLeaveCandidates` extrinsic)
 7. Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account

![Execute leave candidates request](/images/node-operators/networks/collators/activities/activities-4.png)

### Cancel Request to Leave Candidates

If you scheduled a request to leave the candidate pool but changed your mind, as long as the request has not been executed, you can cancel the request and remain in the candidate pool. To cancel the request you can follow these steps:

 1. Navigate to the **Developer** tab 
 2. Click on **Extrinsics**
 3. Select your candidate account
 4. Select **parachainStaking** pallet under the **submit the following extrinsic** menu
 5. Select the **cancelLeaveCandidates** extrinsic
 6. Provide the `candidateCount` which you should have retrieved in the [Get the Size of the Candidate Pool](#get-the-size-of-the-candidate-pool) section
 7. Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account

![Cancel leave candidates request](/images/node-operators/networks/collators/activities/activities-5.png)

### Temporarily Leave the Candidate Pool {: #temporarily-leave-the-candidate-pool }

If you want to temporarily leave the candidate pool, you can easily do so using the `goOffline` method. This can be useful, for example, if you need to temporarily leave to perform maintenance operations. Once you're done, you can then rejoin the pool using the `goOnline` method.

To temporarily leave, you can take the following steps:

 1. Navigate to the **Developer** tab 
 2. Click on **Extrinsics**
 3. Select your candidate account
 4. Select **parachainStaking** pallet under the **submit the following extrinsic** menu
 5. Select the **goOffline** extrinsic
 6. Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account

![Temporarily leave candidates pool](/images/node-operators/networks/collators/activities/activities-6.png) 

Then, whenever you wish to rejoin, you can use the `goOnline` method, by following the same steps outline above and then in step 5, choose the `goOnline` extrinsic. Please note that you can only call `goOnline` if you have previously called `goOffline`.

## Change Self-Bond Amount {: #change-self-bond-amount }

As a candidate, changing your self-bond amount varies slightly depending on if you're bonding more or less. If you're bonding more, it is a straightforward process where you can increase your stake via the `candidateBondMore()` extrinsic. You do not have to wait any delays and you do not need to schedule a request and then execute it, instead your request will be executed instantly and automatically.

If you wish to bond less, you have to schedule a request, wait an [exit delay](#collator-timings), and then you will be able to execute the request and get a specified amount of tokens back into your free balance. In other words, scheduling the request doesn't decrease the bond instantly or automatically, it will only be decreased once the request has been executed.

### Bond More {: #bond-more }

As a candidate, there are two options for increasing one's stake. The first and recommended option is to send the funds to be staked to another owned address and [delegate to your collator](/tokens/staking/stake/#how-to-nominate-a-collator). Alternatively, collators that already have at least the [minimum self-bond amount](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=_blank} staked can increase their bond from [Polkadot JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonriver.moonbeam.network#/accounts) as follows:

 1. Navigate to the **Developer** tab 
 2. Click on **Extrinsics**
 3. Select your collator account (and verify it contains the additional funds to be bonded)
 4. Select **parachainStaking** pallet under the **submit the following extrinsic** menu
 5. Open the drop-down menu, which lists all the possible extrinsics related to staking, and select the **candidateBondMore()** function
 6. Specify the additional amount to be bonded in the **more: BalanceOf** field
 7. Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account

![Collator Bond More](/images/node-operators/networks/collators/activities/activities-7.png)

### Bond Less {: #bond-less}

As of the latest runtime upgrade, [runtime version 1001](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/), there have been significant changes to the way users can interact with various staking features, including the way staking exits are handled. As a collator or collator candidate you may decrease your amount bonded as long as you have more than the [minimum self-bond amount](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=_blank} after the decrease.

In order to bond less, you have to first schedule a request, wait the duration of the [exit delay](#collator-timings), and then execute the request. You can [cancel a request](#cancel-bond-less-request) at any time, as long as the request hasn't been executed yet.

#### Schedule Bond Less Request

To schedule a request to bond less, you can follow these steps: 

 1. Navigate to the **Developer** tab 
 2. Click on **Extrinsics**
 3. Select your candidate account
 4. Select **parachainStaking** pallet under the **submit the following extrinsic** menu
 5. Open the drop-down menu and select the **scheduleCandidateBondLess()** function
 6. Specify the amount to decrease the bond by in the  **less: BalanceOf** field
 7. Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account
 
![Schedule Candidate Bond Less](/images/node-operators/networks/collators/activities/activities-8.png)

Once the transaction is confirmed, you must wait the duration of the exit delay and then you will be able to execute and decrease the bond amount. If you try to execute the request before the exit delay, your extrinsic will fail and you'll see an error in Polkadot.js for `parachainStaking.PendingDelegationRequest`.

#### Execute Bond Less Request

After the exit delay has passed from scheduling a request to decrease your bond, you can execute the request to actually decrease the bond amount by following these steps:

 1. Navigate to the **Developer** tab 
 2. Click on **Extrinsics**
 3. Select an account to execute the request with
 4. Select **parachainStaking** pallet under the **submit the following extrinsic** menu
 5. Select the **executeCandidateBondLess** extrinsic
 6. Select the target candidate account (anyone can execute the request after the exit delay has passed since the `scheduleCandidateBondLess` was submitted)
 7. Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account

![Execute Candidate Bond Less](/images/node-operators/networks/collators/activities/activities-9.png)

Once the transaction has been confirmed, you can check your free and reserved balances from the **Accounts** tab and notice now that the execution has gone through, your balances have been updated.

#### Cancel Bond Less Request

If you scheduled a request to bond more or less but changed your mind, as long as the request has not been executed, you can cancel the request at any time and keep your bond amount as is. To cancel the request you can follow these steps:

 1. Navigate to the **Developer** tab 
 2. Click on **Extrinsics**
 3. Select your candidate account (and verify it contains the additional funds to be bonded)
 4. Select **parachainStaking** pallet under the **submit the following extrinsic** menu
 5. Select the **cancelCandidateBondRequest** extrinsic
 6. Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account

![Cancel leave candidates request](/images/node-operators/networks/collators/activities/activities-10.png)