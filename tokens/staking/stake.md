---
title: How to Stake your MOVR & GLMR Tokens
description: A guide that shows how you can stake your tokens and earn rewards on Moonbeam by delegating collator candidates.
---

# How to Stake your Tokens

## Introduction {: #introduction }

Collator candidates with the highest stake in the network join the active pool of collators (block producers), from which they are selected to offer a block to the relay chain.

Token holders can add to candidates' stake using their tokens, a process called delegation (also referred to as staking). When they do so, they are vouching for that specific candidate, and their delegation is a signal of trust. When delegating, tokens are deducted instantly and added to the total amount staked by the user. Exiting a position is divided into a two step operation: scheduling and execution. First, token holders must schedule a request to exit their position, and wait for a given delay or unbonding period, which depends on the network. Once the unbonding period has expired, users can execute their scheduled action.

Once a candidate joins the active set of collators, they are eligible to produce blocks and receive partial block rewards as part of the token inflationary model. They share these as staking rewards with their delegators, considering their proportional contribution toward their stake in the network. Delegators can choose to auto-compound their rewards so that a set percentage of their rewards are automatically applied to their total delegation amount.

This guide will show you how to stake on Moonbase Alpha via Polkadot.js Apps, but similar steps can be taken for any of the Moonbeam and Moonriver. Token holders that want to easily stake their tokens can use the [Moonbeam dApp](https://apps.moonbeam.network/){target=\_blank} to do so.

For more general information on staking, please check out the [Staking on Moonbeam](/learn/features/staking/){target=\_blank} overview.

## Extrinsics Definitions {: #extrinsics-definitions }

There are many extrinsics related to the staking pallet, you can check out a complete list of them on the [Parachain Staking Pallet](/builders/pallets-precompiles/pallets/staking){target=\_blank} page.

The following list covers the extrinsics that you'll use in this guide and are associated with the delegation process.

!!! note
    Extrinsics might change in the future as the staking pallet is updated.

### Join the Delegator Set {: #join-or-leave-the-delegator-set }

 - **delegateWithAutoCompound**(*address* candidate, *uint256* amount, *uint8* autoCompound, *uint256* candidateDelegationCount, *uint256* candidateAutoCompoundingDelegationCount, *uint256* delegatorDelegationCount) - extrinsic to delegate a given amount to a collator. The amount needs to be greater than the minimum delegation stake. This also sets the percentage of rewards to be auto-compounded

### Bond More or Less  {: #bond-more-or-less }

 - **delegatorBondMore**(*address* candidate, *uint256* more) - extrinsic to request to increase the amount of staked tokens for an already delegated collator
 - **scheduleDelegatorBondLess**(*address* candidate, *uint256* less) - extrinsic to request to reduce the amount of staked tokens for an already delegated collator. The amount must not decrease your overall total staked below the minimum delegation stake. There will be a [bond less delay](/learn/features/staking/#quick-reference/#:~:text=Decrease delegation delay){target=\_blank} before you can execute the request via the `executeDelegationRequest` extrinsic
 - **executeDelegationRequest**(*address* delegator, *address* candidate) - extrinsic to execute and pending delegation requests. This extrinsic should only be used after a request has been scheduled and the exit delay has passed
 - **scheduleCandidateBondLess**(*uint256* less) - extrinsic that allows a collator candidate to request to decrease their self bond by a given amount. There will be a [bond less delay](/node-operators/networks/collators/activities/#collator-timings/#:~:text=Reduce self){target=\_blank} before you can execute the request via the `executeCandidateBondLess` extrinsic
 - **executeCandidateBondLess**(*address* candidate) - extrinsic to execute a decrease a candidate's self bond amount. This extrinsic should only be used after a bond request has been scheduled and the exit delay has passed
 - **cancelCandidateBondLess**() - extrinsic to cancel a scheduled request to increase or decrease the bond for a specific candidate

### Revoke Delegations {: #revoke-delegations }

 - **scheduleRevokeDelegation**(*address* collator) - extrinsic to schedule to remove an existing delegation entirely. There will be a [revoke delegation delay](/learn/features/staking/#quick-reference/#:~:text=Revoke delegations delay){target=\_blank} before you can execute the request via the [`executeDelegationRequest`](#:~:text=executeDelegationRequest(address delegator, address candidate)) extrinsic
 - **cancelDelegationRequest**(*address* candidate) - extrinsic to cancel a scheduled request to revoke a delegation

### Set or Change Auto-Compounding Percentage {: #set-change-auto-compounding }

 - **setAutoCompound**(*address* candidate, *uint8* value, *uint256* candidateAutoCompoundingDelegationCount, *uint256* delegatorDelegationCount) - sets an auto-compound value for an existing delegation

## Retrieve Staking Values {: #retrieving-staking-parameters }

You can check out any of the constant staking values using Polkadot.js Apps, such as the maximum number of delegations, minimum stake requirements, exit delays for delegation requests, and more.

To do so, you can navigate to Polkadot.js Apps **Chain state** UI, and for the purposes of this guide, connect to [Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/chainstate){target=\_blank}. Alternatively, you can connect to [Moonbeam](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network/#chainstate){target=\_blank} or [Moonriver](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonriver.moonbeam.network/#chainstate){target=\_blank}.

Then to retrieve the various staking parameters, select the **Constants** tab on the **Chain state** UI, and take the following steps:

1. From the **selected constant query** dropdown, choose **parachainStaking**
2. Choose any function you would like to get data for. For this example, you can use **maxDelegationsPerDelegator**. This will return the maximum number of candidates you can delegate
3. Click **+** to return the current value

![Retrieving staking parameters](/images/tokens/staking/stake/stake-1.webp)

You should then see the maximum delegations per delegator, which can also be found in the [Staking on Moonbeam](/learn/features/staking/#quick-reference){target=\_blank} overview.

## How to Stake & Auto-Compound Rewards via Polkadot.js Apps {: #how-to-delegate-a-candidate }

This section goes over the process of delegating collator candidates. The address of the collator candidate on Moonbase Alpha that is used throughout this guide is `{{ networks.moonbase.staking.candidates.address1 }}`.

Before staking via Polkadot.js Apps, you need to retrieve some important parameters such as the list of candidates, the delegation count of the candidate you want to delegate, and your number of delegations. To auto-compound your delegation rewards, you'll also need the auto-compounding delegation count of the candidate you want to delegate.

### Retrieve the List of Candidates {: #retrieving-the-list-of-candidates }

Before starting to stake tokens, it is important to retrieve the list of collator candidates available in the network. To do so, head to the **Developer** tab, click on **Chain State**, and take the following steps:

 1. Choose the pallet to interact with. In this case, it is the **parachainStaking** pallet
 2. Choose the state to query. In this case, it is the **selectedCandidates** or **candidatePool** state
 3. Send the state query by clicking on the **+** button

Each extrinsic provides a different response:

 - **selectedCandidates** — returns the current active set of collators, that is, the top collator candidates by total tokens staked (including delegations). For example, on Moonbase Alpha it is the top {{ networks.moonbase.staking.max_candidates }} candidates
 - **candidatePool** — returns the current list of all the candidates, including those that are not in the active set

![Staking Account](/images/tokens/staking/stake/stake-2.webp)

### Get the Candidate Delegation Count {: #get-the-candidate-delegation-count }

First, you need to get the `candidateInfo`, which will contain the delegator count, as you'll need to submit this parameter in a later transaction. To retrieve the parameter, make sure you're still on the **Chain State** tab of the **Developer** page, and then take the following steps:

 1. Choose the **parachainStaking** pallet to interact with
 2. Choose the **candidateInfo** state to query
 3. Make sure the **include option** slider is enabled
 4. Enter the collator candidate's address
 5. Send the state query by clicking on the **+** button
 6. Copy the result as you'll need it when initiating a delegation

![Get candidate delegation count](/images/tokens/staking/stake/stake-3.webp)

### Get the Candidate Auto-Compounding Delegation Count {: #get-candidate-auto-compounding-count }

The auto-compounding delegation count is the amount of delegations that have auto-compounding configured. To determine the number of delegations that have auto-compounding set up, you can query the auto-compounding delegations for the candidate on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/js){target=\_blank} using the following snippet:

```js
// Simple script to get the number of auto-compounding delegations for a given candidate.
// Remember to replace INSERT_CANDIDATE_ADDRESS with the candidate's address you want to delegate.
const candidateAccount = 'INSERT_CANDIDATE_ADDRESS';
const autoCompoundingDelegations =
  await api.query.parachainStaking.autoCompoundingDelegations(candidateAccount);
console.log(autoCompoundingDelegations.toHuman().length);
```

To run the snippet, make sure you're on the **JavaScript** page of Polkadot.js Apps (which can be selected from the **Developer** dropdown), and take the following steps:

 1. Copy the code from the previous snippet and paste it inside the code editor box
 2. (Optional) Click the save icon and set a name for the code snippet, for example, **Get auto-compounding delegation count**. This will save the code snippet locally
 3. To execute the code, click on the run button
 4. Copy the result as you'll need it when initiating a delegation

![Get candidate auto-compounding delegation count](/images/tokens/staking/stake/stake-4.webp)

### Get your Number of Existing Delegations {: #get-your-number-of-existing-delegations }

If you've never made a delegation from your address you can skip this section. However, if you're unsure how many existing delegations you have, you'll want to run the following JavaScript code snippet to get `delegationCount` from within [Polkadot.js](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/js){target=\_blank}:

```js
// Simple script to get your number of existing delegations.
// Remember to replace INSERT_YOUR_ADDRESS with your delegator address.
const yourDelegatorAccount = 'INSERT_YOUR_ADDRESS'; 
const delegatorInfo = 
  await api.query.parachainStaking.delegatorState(yourDelegatorAccount);

if (delegatorInfo.toHuman()) {
  console.log(delegatorInfo.toHuman()['delegations'].length);
} else {
  console.log(0);
}
```

Head to the **Developer** tab and click on **JavaScript**. Then take the following steps:

 1. Copy the code from the previous snippet and paste it inside the code editor box
 2. (Optional) Click the save icon and set a name for the code snippet, for example, **Get delegation count**. This will save the code snippet locally
 3. To execute the code, click on the run button
 4. Copy the result as you'll need it when initiating a delegation

![Get existing delegation count](/images/tokens/staking/stake/stake-5.webp)

### Stake your Tokens {: #staking-your-tokens }

To access staking features, you need to use the Polkadot.js Apps interface. To do so, you need to import/create an Ethereum-style account first (H160 address), which you can do by following the [Creating or Importing an H160 Account](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=\_blank} section of the Polkadot.js guide.

For this example, an account was imported and named with a super original name: Alice. Alice's address is `0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`.

To delegate a candidate and set up auto-compounding for your staking rewards, take the following steps:

 1. Select the account from which you want to stake your tokens
 2. Choose the **parachainStaking** pallet
 3. Choose the **delegateWithAutoCompound** extrinsic
 4. Set the candidate's address to delegate. In this case, it is set to `{{ networks.moonbase.staking.candidates.address1 }}`
 5. Set the number of tokens you want to stake
 6. Set the percentage of rewards to auto-compound by entering a number 0-100
 7. Input the `candidateDelegationCount` you [retrieved previously from querying `candidateInfo`](#get-the-candidate-delegation-count)
 8. Input the `candidateAutoCompoundingDelegationCount` you [retrieved previously from querying `autoCompoundingDelegations`](#get-candidate-auto-compounding-count)
 9. Input the `delegationCount` [you retrieved from the JavaScript console](#get-your-number-of-existing-delegations). This is `0` if you haven't yet delegated a candidate
 10. Click the **Submit Transaction** button and sign the transaction

![Staking Join Delegators Extrinsics](/images/tokens/staking/stake/stake-6.webp)

!!! note
    The parameters used in steps 7-9 are for gas estimation purposes and do not need to be exact. However, they should not be lower than the actual values.

### Verify Delegations {: #verifying-delegations }

Once the transaction is confirmed, you can verify your delegation by navigating to **Chain state** under the **Developer** tab. Here, provide the following information:

 1. Choose the pallet you want to interact with. In this case, it is the **parachainStaking** pallet
 2. Choose the state to query. In this case, it is the **delegatorState**
 3. Verify the selected address is correct. In this case, you are looking at Alice's account
 4. Make sure to enable the **include option** slider
 5. Send the state query by clicking on the **+** button

![Verify delegations](/images/tokens/staking/stake/stake-7.webp)

In the response, you should see your account (in this case, Alice's account) with a list of the delegations. Each delegation contains the target address of the candidate and the amount.

You can follow the same steps as described to delegate other candidates in the network.

### Verify Auto-Compounding Percentage {: #verifying-auto-compounding-percentage }

If you want to verify the percentage of rewards that are set to auto-compound for a specific delegation, you can use the following script that will query the `autoCompoundingDelegations` extrinsic and filter the results based on the delegator's address:

```js
// Simple script to verify your auto-compounding percentage for a given candidate.
// Remember to replace INSERT_CANDIDATE_ADDRESS with the candidate's address you
// want to delegate and replace INSERT_DELEGATOR_ADDRESS with the address used to 
// delegate with
const candidateAccount = 'INSERT_CANDIDATE_ADDRESS';
const delegationAccount = 'INSERT_DELEGATOR_ADDRESS';
const autoCompoundingDelegations =
  await api.query.parachainStaking.autoCompoundingDelegations(candidateAccount);
const delegation = autoCompoundingDelegations.find(
  (del) => del.delegator == delegationAccount
);

console.log(`${delegation.value}%`);
```

In Polkadot.js Apps, you can head to the **Developer** tab and select **JavaScript** from the dropdown. Then you can take the following steps:

 1. Copy the code from the previous snippet and paste it inside the code editor box
 2. (Optional) Click the save icon and set a name for the code snippet, for example, **Get auto-compounding percentage**. This will save the code snippet locally
 3. To execute the code, click on the run button
 4. The result is returned in the terminal on the right side

![Verify auto-compounding percentage](/images/tokens/staking/stake/stake-8.webp)

## Set or Change the Auto-Compounding Percentage {: #set-or-change-auto-compounding }

If you initially set up your delegation without auto-compounding or if you want to update the percentage on an existing delegation with auto-compounding set up, you can use the `setAutoCompound` function of the Solidity interface.

You'll need to [get the number of delegations with auto-compounding set up](#get-candidate-auto-compounding-count) for the candidate you want to set or update auto-compounding for. You'll also need to [retrieve your own delegation count](#get-your-number-of-existing-delegations). Once you have the necessary information, you can click on the **Developer** tab, select **Extrinsics** from the dropdown, and take the following steps:

 1. Select the account from which you initially delegated from and want to set or update auto-compounding for
 2. Choose the **parachainStaking** pallet
 3. Choose the **setAutoCompound** extrinsic
 4. Set the candidate's address that you delegated. For this example, it is set to `{{ networks.moonbase.staking.candidates.address1 }}`
 5. Set the percentage of rewards to auto-compound by entering a number 0-100
 6. For the **candidateAutoCompoundingDelegationHint** field, enter the candidate's number of delegations with auto-compounding configured
 7. For the **delegationCountHint** field, enter your number of delegations
 8. Click the **Submit Transaction** button and sign the transaction

![Staking Chain State Query](/images/tokens/staking/stake/stake-9.webp)

## How to Stop Delegations {: #how-to-stop-delegations }

As of [runtime version 1001](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/){target=\_blank}, there have been significant changes to the way users can interact with various staking features. Including the way staking exits are handled.

If you want to make an exit and stop a delegation, you have to first schedule it, wait an exit delay, and then execute the exit request. If you are already a delegator, you can request to stop your delegations using the `scheduleRevokeDelegation` extrinsic to request to unstake your tokens from a specific collator candidate. Scheduling a request does not automatically revoke your delegations, you must wait an [exit delay](/learn/features/staking/#quick-reference){target=\_blank} and then execute the request by using the `executeDelegationRequest` method.

### Schedule Request to Stop Delegations {: #schedule-request-to-stop-delegations }

To schedule a request to revoke your delegation from a specific candidate, navigate to the **Extrinsics** menu under the **Developer** tab. Here, provide the following information:

 1. Select the account from which you want to remove your delegation
 2. Choose the `parachainStaking` pallet
 3. Choose the `scheduleRevokeDelegation` extrinsic
 4. Set the candidate's address you want to remove your delegation from. In this case, it is set to `{{ networks.moonbase.staking.candidates.address1 }}`
 5. Click the **Submit Transaction** button and sign the transaction

![Staking Schedule Request to Revoke Delegation Extrinsic](/images/tokens/staking/stake/stake-10.webp)

!!! note
    There can only be one pending scheduled request per candidate.

Once you have scheduled an exit, you must wait an [exit delay](/learn/features/staking/#quick-reference){target=\_blank} before you can then execute it. If you try to execute it before the exit delay is up the extrinsic will fail and you'll see an error from Polkadot.js Apps for `parachainStaking.PendingDelegationRequest`.

### Execute Request to Stop Delegations {: #execute-request-to-stop-delegations }

After the exit delay has passed after initiating the scheduled request, you can go back to the **Developer** tab of the **Extrinsics** menu and follow these steps to execute the request:

 1. Select the account to execute the revocation
 2. Choose the **parachainStaking** pallet
 3. Choose the **executeDelegationRequest** extrinsic
 4. Set the delegator's address you want to remove the delegation for. For this example, it will be Alice's address `0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`
 5. Set the candidate's address you want to remove your delegation from. In this case, it is set to `{{ networks.moonbase.staking.candidates.address1 }}`
 6. Click the **Submit Transaction** button and sign the transaction

![Staking Execute Revoke Delegation Extrinsic](/images/tokens/staking/stake/stake-11.webp)

Once the transaction is confirmed, you can verify that your delegation was removed by going to the **Chain state** option under the **Developer** tab. Here, provide the following information:

 1. Choose the **parachainStaking** pallet
 2. Choose the **delegatorState** state to query
 3. Select your account
 4. Make sure to enable the **include options** slider
 5. Send the state query by clicking on the **+** button

![Staking Verify Delegation is Revoked](/images/tokens/staking/stake/stake-12.webp)

In the response, you should see your account (in this case, Alice's account) with a list of the remaining delegations. Each delegation contains the target address of the candidate, and the amount. There should no longer be an entry for `{{ networks.moonbase.staking.candidates.address1 }}`. If you no longer have any delegations, `<none>` will be returned.

To ensure the revocation went through as expected, you can follow the steps in the [Verifying Delegations](#verifying-delegations) section above.

### Cancel Request to Stop Delegations {: #cancel-request-to-stop-delegations }

If you scheduled a request to stop delegations but changed your mind, as long as the request has not been executed, you can cancel the request at any time and all of your delegations will remain as is. To cancel the request you can follow these steps:

1. Select the account to cancel the scheduled request for
2. Choose the **parachainStaking** pallet
3. Choose the **cancelDelegationRequest** extrinsic
4. Enter the candidates address that corresponds to the due request you would like to cancel
5. Click the **Submit Transaction** button and sign the transaction

![Staking Cancel Scheduled Request to Revoke Delegation](/images/tokens/staking/stake/stake-13.webp)

## Staking Rewards {: #staking-rewards }

As candidates in the active set of collators receive rewards from block production, delegators get rewards as well. A brief overview on how the rewards are calculated can be found in the [Reward Distribution section](/learn/features/staking/#reward-distribution){target=\_blank} of the Staking on Moonbeam overview page.

In summary, delegators will earn rewards based on their stake of the total delegations for the collator being rewarded (including the collator's stake as well).

Delegators can choose to auto-compound their rewards so that their rewards are automatically applied to their total delegation amount. If a delegator has multiple delegations, auto-compounding will need to be set for each delegation.

--8<-- 'text/_disclaimers/staking-risks.md'
*Staked MOVR/GLMR tokens are locked up, and retrieving them requires a {{ networks.moonriver.delegator_timings.del_bond_less.days }} day/{{ networks.moonbeam.delegator_timings.del_bond_less.days }} day waiting period .*
--8<-- 'text/_disclaimers/staking-risks-part-2.md'
