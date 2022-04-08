---
title: How to Stake on Moonbeam
description: A guide that shows how you can stake your tokens and earn rewards in Moonbeam by delegating collator candidates.
---

# How to Stake your Tokens

![Staking Moonbeam Banner](/images/tokens/staking/stake/stake-banner.png)

## Introduction {: #introduction } 

Collator candidates with the highest stake in the network join the active pool of collators (block producers), from which they are selected to offer a block to the relay chain.

Token holders can add to candidates' stake using their tokens, a process called delegation (also referred to as staking). When they do so, they are vouching for that specific candidate, and their delegation is a signal of trust. When delegating, tokens are deducted instantly and added to the total amount staked by the user. Exiting a position is divided into a two step operation: scheduling and execution. First, token holders must schedule a request to exit their position, and wait for a given delay or unbonding period, which depends on the network. Once the unbonding period has expired, users can execute their scheduled action.

Once a candidate joins the active set of collators, they are eligible to produce blocks and receive partial block rewards as part of the token inflationary model. They share these as staking rewards with their delegators, considering their proportional contribution toward their stake in the network.

This guide will show you how to stake on Moonbase Alpha via Polkadot.js Apps, but similar steps can be taken for any of the Moonbeam and Moonriver. Token holders that want to easily stake their tokens can use the [Moonbeam dApp](https://apps.moonbeam.network/) to do so.

For more general information on staking, please check out the [Staking in Moonbeam](/learn/features/staking/) overview.

## Extrinsics Definitions {: #extrinsics-definitions } 

There are many extrinsics related to the staking pallet, so all of them are not covered in this guide. However, the following list defines all of the extrinsics associated with the delegation process. After [runtime upgrade 1001](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/), some extrinsics where deprecated.

!!! note
    Extrinsics might change in the future as the staking pallet is updated.

### Join or Leave The Delegator Set

 - **delegate**(*address* candidate, *uint256* amount, *uint256* candidateDelegationCount, *uint256* delegatorDelegationCount) - extrinsic to delegate a collator. The amount needs to be greater than the minimum delegation stake. Replaces the deprecated `nominate` extrinsic
 - **scheduleLeaveDelegators**() - extrinsic to schedule to leave the set of delegators. There is an [exit delay](/learn/features/staking/#quick-reference) before you can execute the request via the `executeLeaveDelegators` extrinsic and actually leave the set of delegators. Replaces the deprecated `leaveNominators` extrinsic
 - **executeLeaveDelegators**(*uint256* delegatorDelegationCount) - extrinsic to execute and leave the set of delegators. This extrinsic should only be used after a leave has been scheduled and the exit delay has passed. Consequently, all ongoing delegations will be revoked
 - **cancelLeaveDelegators**() - extrinsic to cancel a scheduled request to leave the set of delegators

The following extrinsics are deprecated: 

 - **nominate**(*address* collator, *uint256* amount, *uint256* collatorNominationCount, *uint256* nominatorNominationCount) — extrinsic to delegate a collator. The amount needs to be greater than the minimum delegation stake
 - **leaveNominators**(*uint256* nominatorNominationCount) — extrinsic to leave the set of delegators. Consequently, all ongoing delegations will be revoked
 
### Bond More or Less 

 - **delegatorBondMore**(*address* candidate, *uint256* more) - extrinsic to request to increase the amount of staked tokens for an already delegated collator. Replaces the deprecated `nominatorBondMore` extrinsic
 - **scheduleDelegatorBondLess**(*address* candidate, *uint256* less) - extrinsic to request to reduce the amount of staked tokens for an already delegated collator. The amount must not decrease your overall total staked below the minimum delegation stake. There will be a [bond less delay](/learn/features/staking/#quick-reference) before you can execute the request via the `executeCandidateBondRequest` extrinsic. Replaces the deprecated `nominatorBondLess` extrinsic
 - **executeCandidateBondRequest**(*address* candidate) - extrinsic to execute a decrease in the bond for a specific candidate. This extrinsic should only be used after a bond request has been scheduled and the exit delay has passed
 - **cancelCandidateBondLess**() - extrinsic to cancel a scheduled request to increase or decrease the bond for a specific candidate

The following extrinsics are deprecated: 

 - **nominatorBondLess**(*address* collator, *uint256* less) — extrinsic to reduce the amount of staked tokens for an already delegated collator. The amount must not decrease your overall total staked below the minimum delegation stake
 - **nominatorBondMore**(*address* collator, *uint256* more) — extrinsic to increase the amount of staked tokens for an already delegated collator

### Revoke Delegations

 - **scheduleRevokeDelegation**(*address* collator) - extrinsic to schedule to remove an existing delegation entirely. There will be a [revoke delegation delay](/learn/features/staking/#quick-reference) before you can execute the request via the `executeDelegationRequest` extrinsic. Replaces the deprecated `revokeNomination` extrinsic 
 - **executeDelegationRequest**(*address* delegator, *address* candidate) - extrinsic to execute and pending delegation requests. This extrinsic should only be used after a request has been scheduled and the exit delay has passed 
 - **cancelDelegationRequest**(*address* candidate) - extrinsic to cancel a scheduled request to revoke a delegation

The following extrinsic is deprecated: 

 - **revokeNomination**(*address* collator) — extrinsic to remove an existing delegation

## Retrieving Staking Parameters {: #retrieving-staking-parameters } 

You can now read any of the current parameters around staking, such as the ones previously listed in the [General Definitions](#general-definitions) section and more, directly from Polkadot.js Apps.

Navigate to Polkadot.js Apps **Chain state** UI, and for the purposes of this guide, connect to [Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/chainstate){target=_blank}. Alternatively, you can connect to [Moonbeam](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbeam.network/#chainstate){target=_blank} or [Moonriver](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonriver.moonbeam.network/#chainstate){target=_blank}.

Then to retrieve the various staking parameters, you'll need to:

1. Select the **Constants** tab on the **Chain state** UI
2. From the **selected constant query** dropdown, choose **parachainStaking**
3. Choose any function you would like to get data for. For this example, you can use **maxDelegationsPerDelegator**. This will return the maximum number of candidates you can delegate
4. Click **+** to return the current value

![Retrieving staking parameters](/images/tokens/staking/stake/stake-12.png)

You should then see the maximum delegations per delegator, which can also be found in the [Staking in Moonbeam](/learn/features/staking/#quick-reference) overview.

## How to Stake via Polkadot.js Apps {: #how-to-delegate-a-candidate } 

This section goes over the process of delegating collator candidates.

The tutorial will use the following candidates on Moonbase Alpha as a reference:

|  Variable   |  |                       Address                       |
|:-----------:|::|:---------------------------------------------------:|
| Candidate 1 |  | {{ networks.moonbase.staking.candidates.address1 }} |
| Candidate 2 |  | {{ networks.moonbase.staking.candidates.address2 }} |

Before staking via Polkadot.js Apps, you need to retrieve some important parameters.

### Retrieving the List of Candidates {: #retrieving-the-list-of-candidates } 

Before starting to stake tokens, it is important to retrieve the list of collator candidates available in the network. To do so:

 1. Head to the **Developer** tab 
 2. Click on **Chain State**
 3. Choose the pallet to interact with. In this case, it is the **parachainStaking** pallet
 4. Choose the state to query. In this case, it is the **selectedCandidates** or **candidatePool** state
 5. Send the state query by clicking on the **+** button

Each extrinsic provides a different response:

 - **selectedCandidates** — returns the current active set of collators, that is, the top collator candidates by total tokens staked (including delegations). For example, on Moonbase Alpha it is the top {{ networks.moonbase.staking.max_candidates }} candidates
 - **candidatePool** — returns the current list of all the candidates, including those that are not in the active set

![Staking Account](/images/tokens/staking/stake/stake-2.png)

### Get the Candidate Delegation Count {: #get-the-candidate-delegation-count } 

First, you need to get the `candidateInfo`, which will contain the delegator count, as you'll need to submit this parameter in a later transaction. To retrieve the parameter, make sure you're still on the **Chain State** tab of the **Devloper** page, and then take the following steps:

 1. Choose the **parachainStaking** pallet to interact with
 2. Choose the **candidateInfo** state to query
 3. Make sure the **include option** slider is enabled
 4. Enter the collator candidate's address
 5. Send the state query by clicking on the **+** button
 6. Copy the result as you'll need it when initiating a delegation

![Get candidate delegation count](/images/tokens/staking/stake/stake-14.png)

### Get your Number of Existing Delegations {: #get-your-number-of-existing-delegations } 

If you've never made a delegation from your address you can skip this section. However, if you're unsure how many existing delegations you have, you'll want to run the following JavaScript code snippet to get `delegationCount` from within [Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/js){target=_blank}:

```js
// Simple script to get your number of existing delegations.
// Remember to replace YOUR_ADDRESS_HERE with your delegator address.
const yourDelegatorAccount = 'YOUR_ADDRESS_HERE'; 
const delegatorInfo = await api.query.parachainStaking.delegatorState(yourDelegatorAccount);
console.log(delegatorInfo.toHuman()["delegations"].length);
```

 1. Head to the **Developer** tab 
 2. Click on **JavaScript**
 3. Copy the code from the previous snippet and paste it inside the code editor box 
 4. (Optional) Click the save icon and set a name for the code snippet, for example, **Get existing delegations**. This will save the code snippet locally
 5. To execute the code, click on the run button
 6. Copy the result as you'll need it when initiating a delegation

![Get existing delegation count](/images/tokens/staking/stake/stake-13.png)

### Staking your Tokens

To access staking features, you need to use the Polkadot.js Apps interface. To do so, you need to import/create an Ethereum-style account first (H160 address), which you can do by following [this guide](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account).

For this example, an account was imported and named with a super original name: Alice. Alice's address is `0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`.

Currently, everything related to staking needs to be accessed via the **Extrinsics** menu, under the **Developer** tab:

![Staking Account](/images/tokens/staking/stake/stake-5.png)

To delegate a candidate, provide the following information:

 1. Select the account from which you want to stake your tokens
 2. Choose the **parachainStaking** pallet
 3. Choose the **delegate** extrinsic
 4. Set the candidate's address to delegate. In this case, it is set to `{{ networks.moonbase.staking.candidates.address1 }}`
 5. Set the number of tokens you want to stake
 6. Input the `candidateDelegationCount` you [retrieved previously from querying `candidateInfo`](#get-the-candidate-delegation-count)
 7. Input the `delegationCount` [you retrieved from the JavaScript console](#get-your-number-of-existing-delegations). This is `0` if you haven't yet delegated a candidate
 8. Click the **Submit Transaction** button and sign the transaction

![Staking Join Delegators Extrinsics](/images/tokens/staking/stake/stake-15.png)

!!! note
    The parameters used in steps 6 and 7 are for gas estimation purposes and do not need to be exact. However, they should not be lower than the actual values. 

Once the transaction is confirmed, you can head back to the **Accounts** tab to verify that you have a reserved balance (equal to the number of tokens staked).

To verify a delegation, you can navigate to **Chain state** under the **Developer** tab.

![Staking Account and Chain State](/images/tokens/staking/stake/stake-7.png)

Here, provide the following information:

 1. Choose the pallet you want to interact with. In this case, it is the **parachainStaking** pallet
 2. Choose the state to query. In this case, it is the **delegatorState**
 3. Verify the selected address is correct. In this case, we are looking at Alice's account
 4. Make sure to enable the **include option** slider
 5. Send the state query by clicking on the **+** button

![Staking Chain State Query](/images/tokens/staking/stake/stake-16.png)

In the response, you should see your account (in this case, Alice's account) with a list of the delegations. Each delegation contains the target address of the candidate and the amount.

You can follow the same steps as described to delegate other candidates in the network. For example, Alice delegated `{{ networks.moonbase.staking.candidates.address2 }}` as well.

## How to Stop Delegations {: #how-to-stop-delegations } 

As of [runtime version 1001](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/), there have been significant changes to the way users can interact with various staking features. Including the way staking exits are handled.

If you want to make an exit and stop a delegation, you have to first schedule it, wait an exit delay, and then execute the exit. If you are already a delegator, you have two options to request to stop your delegations: using the `scheduleRevokeDelegation` extrinsic to request to unstake your tokens from a specific collator candidate, or using the `scheduleLeaveDelegators` extrinsic to request to revoke all ongoing delegations. Scheduling a request does not automatically revoke your delegations, you must wait an [exit delay](/learn/features/staking/#quick-reference) and then execute the request by using either the `executeDelegationRequest` method or the `executeLeaveDelegators` method. 

### Schedule Request to Stop Delegations

This example is a continuation of the previous section, and assumes that you have at least two active delegations.

To schedule a request to revoke your delegation from a specific candidate, navigate to the **Extrinsics** menu under the **Developer** tab. Here, provide the following information:

 1. Select the account from which you want to remove your delegation
 2. Choose the `parachainStaking` pallet
 3. Choose the `scheduleRevokeDelegation` extrinsic
 4. Set the candidate's address you want to remove your delegation from. In this case, it is set to `{{ networks.moonbase.staking.candidates.address2 }}`
 5. Click the **Submit Transaction** button and sign the transaction

![Staking Schedule Request to Revoke Delegation Extrinsic](/images/tokens/staking/stake/stake-17.png)

!!! note
    There can only be one pending scheduled request per candidate.

As mentioned before, you can also remove all ongoing delegations with the `scheduleLeaveDelegators` extrinsic in step 3 of the **Extrinsics** instructions. This extrinsic requires no input.

![Staking Leave Delegators Extrinsic](/images/tokens/staking/stake/stake-18.png)

Once you have scheduled an exit, you must wait an [exit delay](/learn/features/staking/#quick-reference) before you can then execute it. If you try to execute it before the exit delay is up the extrinsic will fail and you'll see an error from Polkadot.js Apps for `parachainStaking.PendingDelegationRequest`.

### Execute Request to Stop Delegations

After the exit delay has passed after initiating the scheduled request, you can go back to the **Developer** tab of the **Extrinsics** menu and follow these steps to execute the request:

 1. Select the account to execute the revocation
 2. Choose the **parachainStaking** pallet
 3. Choose the **executeDelegationRequest** extrinsic
 4. Set the delegator's address you want to remove the delegation for. For this example, it will be Alice's address `0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`
 5. Set the candidate's address you want to remove your delegation from. In this case, it is set to `{{ networks.moonbase.staking.candidates.address2 }}`
 6. Click the **Submit Transaction** button and sign the transaction

![Staking Execute Revoke Delegation Extrinsic](/images/tokens/staking/stake/stake-19.png)

If you want to remove all ongoing delegations, you can adapt the **Extrinsics** instructions to call the `executeLeaveDelegators` extrinsic:

1. Select the account to remove all the delegations for
2. Choose the **parachainStaking** pallet
3. Choose the **executeLeaveDelegators** extrinsic
4. Enter the total number of all delegations to revoke using the `delegationCount` [you retrieved from the JavaScript console](#get-your-number-of-existing-delegations). This is `0` if you haven't yet delegated a candidate
5. Click the **Submit Transaction** button and sign the transaction

![Staking Execute Leave Delegators Extrinsic](/images/tokens/staking/stake/stake-20.png)

Once the transaction is confirmed, you can verify that your delegation was removed or that you left the set of delegators by going to the **Chain state** option under the **Developer** tab. Here, provide the following information:

 1. Choose the **parachainStaking** pallet
 2. Choose the **delegatorState** state to query
 3. Select your account
 4. Make sure to enable the **include options** slider
 5. Send the state query by clicking on the **+** button

![Staking Verify Delegation is Revoked](/images/tokens/staking/stake/stake-21.png)

In the response, you should see your account (in this case, Alice's account) with a list of the remaining delegations. Each delegation contains the target address of the candidate, and the amount. There should no longer be an entry for `{{ networks.moonbase.staking.candidates.address2 }}`. Or if you left the delegator set, you should see a response of `<none>`.

You can also check your free and reserved balances from the **Accounts** tab and notice now that the execution has gone through, your balances have been updated.

### Cancel Request to Stop Delegations

If you scheduled a request to stop delegations but changed your mind, as long as the request has not been executed, you can cancel the request at any time and all of your delegations will remain as is. If you scheduled a request via the `scheduleRevokeDelegation` extrinsic, you will need to call `cancelDelegationRequest`. On the other hand, if you scheduled a request via the `scheduleRevokeDelegation` extrinsic, you will need to call the `cancelLeaveDelegators` extrinsic. To cancel the request you can follow these steps:

1. Select the account to cancel the scheduled request for
2. Choose the **parachainStaking** pallet
3. Choose the **cancelDelegationRequest** or the **cancelLeaveDelegators** extrinsic
4. Enter the candidates address that corresponds to the due request you would like to cancel
5. Click the **Submit Transaction** button and sign the transaction

![Staking Cancel Scheduled Request to Revoke Delegation via Chain State](/images/tokens/staking/stake/stake-22.png)

## Staking Rewards {: #staking-rewards } 

As candidates in the active set of collators receive rewards from block production, delegators get rewards as well. A brief overview on how the rewards are calculated can be found in [this page](/staking/overview/#reward-distribution).

In summary, delegators will earn rewards based on their stake of the total delegations for the collator being rewarded (including the collator's stake as well).

From the previous example, Alice was rewarded with `0.0044` tokens after two payout rounds:

![Staking Reward Example](/images/tokens/staking/stake/stake-11.png)

--8<-- 'text/disclaimers/staking-risks.md'
*Staked MOVR/GLMR tokens are locked up, and retrieving them requires a {{ networks.moonriver.delegator_timings.del_bond_less.days }} day/{{ networks.moonbeam.delegator_timings.del_bond_less.days }} day waiting period .*
--8<-- 'text/disclaimers/staking-risks-part-2.md'

