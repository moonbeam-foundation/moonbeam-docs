---
title: How to Stake
description: A guide that shows how you can stake your tokens in Moonbeam by nominating collators
---

# How to Stake your Tokens

![Staking Moonbeam Banner](/images/staking/staking-stake-banner.png)

## Introduction

Collators (block producers) with the highest stake in the network join the active pool of collators, from which they are selected to offer a block to the relay chain.

Token holders can add to the collators' stake using their tokens, a process called nomination (also referred to as staking). When they do so, they are vouching for that specific collator, and their nomination is a signal of trust.

Collators receive part of the block rewards as part of the token inflationary model. They can share these as staking rewards with their nominators, considering their percental contribution toward his stake in the network.

With the release of [Moonbase Alpha v6](https://github.com/PureStake/moonbeam/releases/tag/v0.6.0), users of the network can now stake their tokens to nominate collators. This guide outlines all the steps to do so.

## General Definitions

--8<-- 'text/staking/staking-definitions.md'

Currently, for Moonbase Alpha:

|             Variable             |     |                         Value                         |
| :------------------------------: | :-: | :---------------------------------------------------: |
|     Minimum nomination stake     |     |     {{ networks.moonbase.staking.min_nom_stake }}     |
|        Minimum nomination        |     |     {{ networks.moonbase.staking.min_nom_amount}}     | | Maximum nominators per collators |     |     {{ networks.moonbase.staking.max_nom_per_col }}   |
| Maximum collators per nominator  |     |     {{ networks.moonbase.staking.max_col_per_nom }}   |
|              Round               |     | {{ networks.moonbase.staking.round_blocks }} blocks ({{ networks.moonbase.staking.round_hours }} hours) |
|          Bond duration           |     |     {{ networks.moonbase.staking.bond_lock }} rounds  |

## Extrinsics Definitions

There are many extrinsics related to the staking pallet, so all of them are not covered in this guide. However, this list defines all of the extrinsics associated with the nomination process:

!!! note
    Extrinsics might change in the future as the staking pallet is updated.

 - **nominate**(*address* collator, *uint256* amount) — extrinsic to nominate a collator. The amount must be at least {{ networks.moonbase.staking.min_nom_amount }} tokens
 - **leaveNominators**() — extrinsic to leave the set of nominators. Consequently, all ongoing nominations will be revoked
 - **nominatorBondLess**(*address* collator, *uint256* less) — extrinsic to reduce the amount of staked tokens for an already nominated collator. The amount must not decrease your overall total staked below {{ networks.moonbase.staking.min_nom_stake }} tokens
 - **nominatorBondMore**(*address* collator, *uint256* more) — extrinsic to increase the amount of staked tokens for an already nominated collator
 - **revokeNomination**(*address* collator) — extrinsic to remove an existing nomination

## Retrieving the List of Collators

Before starting to stake tokens, it is important to retrieve the list of collators available in the network. To do so, navigate to "Chain state" under the "Developer" tab.

![Staking Account](/images/staking/staking-stake-1.png)

Here, provide the following information:

 1. Choose the pallet to interact with. In this case, it is the `parachainStaking` pallet
 2. Choose the state to query. In this case, it is the `selectedCandidates` or `candidatePool` state
 3. Send the state query by clicking on the "+" button

Each extrinsic provides a different response:

 - **selectedCandidates** — returns the current active set of collators, that is, the top {{ networks.moonbase.staking.max_collators }} collators by total tokens staked (including nominations)
 - **candidatePool** — returns the current list of all the collators, including those that are not in the active set

![Staking Account](/images/staking/staking-stake-2.png)

## Get the Collator Nominator Count

First, you need to get the `collator_nominator_count` as you'll need to submit this parameter in a later transaction. To do so, you'll have to run the following JavaScript code snippet from within [PolkadotJS](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/js):



```js
// Simple script to get collator_nominator_count
// Remember to replace COLLATOR_ADDRESS with the address of desired collator.
const collatorAccount = 'COLLATOR_ADDRESS'; 
const collatorInfo = await api.query.parachainStaking.collatorState2(collatorAccount);
console.log(collatorInfo.toHuman()["nominators"].length);
```

 1. Head to the "Developer" tab 
 2. Click on "JavaScript"
 3. Copy the code from the previous snippet and paste it inside the code editor box 
 4. (Optional) Click the save icon and set a name for the code snippet, for example, "Get collator_nominator_count". This will save the code snippet locally
 5. Click on the run button. This will execute the code from the editor box
 6. Copy the result, as you'll need it when initiating a nomination

![Get collator nominator count](/images/staking/staking-stake-3.png)

## Get your Number of Existing Nominations
If you've never made a nomination from your address you can skip this section. However, if you're unsure how many existing nominations you have, you'll want to run the following JavaScript code snippet to get `nomination_count` from within [PolkadotJS](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/js):

```js
// Simple script to get your number of existing nominations.
// Remember to replace YOUR_ADDRESS_HERE with your nominator address.
const yourNominatorAccount = 'YOUR_ADDRESS_HERE'; 
const nominatorInfo = await api.query.parachainStaking.nominatorState(yourNominatorAccount);
console.log(nominatorInfo.toHuman()["nominations"].length);
```

 1. Head to the "Developer" tab 
 2. Click on "JavaScript"
 3. Copy the code from the previous snippet and paste it inside the code editor box 
 4. (Optional) Click the save icon and set a name for the code snippet, for example, "Get existing nominations". This will save the code snippet locally
 5. Click on the run button. This will execute the code from the editor box
 6. Copy the result, as you'll need it when initiating a nomination

![Get existing nomination count](/images/staking/staking-stake-4.png)

## How to Nominate a Collator

This section goes over the process of nominating collators. The tutorial will use the following collators as a reference:

|  Variable  |     |                      Address                       |
| :--------: | :-: | :------------------------------------------------: |
| Collator 1 |     | {{ networks.moonbase.staking.collators.address1 }} |
| Collator 2 |     | {{ networks.moonbase.staking.collators.address2 }} |

To access staking features, you need to use the PolkadotJS Apps interface. To do so, you need to import/create an Ethereum-style account first (H160 address), which you can do by following [this guide](/integrations/wallets/polkadotjs/#creating-or-importing-an-h160-account).

For this example, an account was imported and named with a super original name: Alice.

Currently, everything related to staking needs to be accessed via the "Extrinsics" menu, under the "Developer" tab:

![Staking Account](/images/staking/staking-stake-5.png)

To nominate a collator, provide the following information:

 1. Select the account from which you want to stake your tokens
 2. Choose the pallet you want to interact with. In this case, it is the `parachainStaking` pallet
 3. Choose the extrinsic method to use for the transaction. This will determine the fields that need to fill in the following steps. In this case, it is the `nominate` extrinsic
 4. Set the collator's address you want to nominate. In this case, it is set to `{{ networks.moonbase.staking.collators.address1 }}`
 5. Set the number of tokens you want to stake
 6. Input the `collator_nominator_count` you [retrieved above from the JavaScript console](/staking/stake/#get-the-collator-nominator-count)
 7. Input the `nomination_count` [you retrieved from the Javascript console](/staking/stake/#get-your-number-of-existing-nominations). This is `0` if you haven't yet nominated a collator
 8. Click the "Submit Transaction" button and sign the transaction

![Staking Join Nominators Extrinsics](/images/staking/staking-stake-6.png)

!!! note
    The parameters used in steps 6 and 7 are for gas estimation purposes and do not need to be exact. However, they should not be lower than the actual values. 

Once the transaction is confirmed, you can head back to the "Accounts" tab to verify that you have a reserved balance (equal to the number of tokens staked).

To verify a nomination, you can navigate to "Chain state" under the "Developer" tab.

![Staking Account and Chain State](/images/staking/staking-stake-7.png)

Here, provide the following information:

 1. Choose the pallet you want to interact with. In this case, it is the `parachainStaking` pallet
 2. Choose the state to query. In this case, it is the `nominatorState`
 3. Make sure to enable the "include option" slider
 4. Send the state query by clicking on the "+" button

![Staking Chain State Query](/images/staking/staking-stake-8.png)

In the response, you should see your account (in this case, Alice's account) with a list of the nominations. Each nomination contains the target address of the collator and the amount.

You can follow the same steps as described to nominate other collators in the network. For example, Alice nominated `{{ networks.moonbase.staking.collators.address2 }}` as well.

## How to Stop Nominations

If you are already a nominator, you have two options to stop your nominations: using the `revokeNomination` extrinsic to unstake your tokens from a specific collator, or using the `leaveNominators` extrinsic to revoke all ongoing nominations.

This example is a continuation of the previous section, and assumes that you have at least two active nominations.

You can remove your nomination from a specific collator by navigating to the "Extrinsics" menu under the "Developer" tab. Here, provide the following information:

 1. Select the account from which you want to remove your nomination
 2. Choose the pallet you want to interact with. In this case, it is the `parachainStaking` pallet
 3. Choose the extrinsic method to use for the transaction. This will determine the fields that need to fill in the following steps. In this case, it is the `revokeNomination` extrinsic
 4. Set the collator's address you want to remove your nomination from. In this case, it is set to `{{ networks.moonbase.staking.collators.address2 }}`
 5. Click the "Submit Transaction" button and sign the transaction

![Staking Revoke Nomination Extrinsic](/images/staking/staking-stake-9.png)

Once the transaction is confirmed, you can verify that your nomination was removed in the "Chain state" option under the "Developer" tab.

Here, provide the following information:

 1. Choose the pallet you want to interact with. In this case, it is the `parachainStaking` pallet
 2. Choose the state to query. In this case, it is the `nominatorState` state
 3. Make sure to enable the "include options" slider
 4. Send the state query by clicking on the "+" button

![Staking Revoke Nomination Chain State](/images/staking/staking-stake-8.png)

In the response, you should see your account (in this case, Alice's account) with a list of the nominations. Each nomination contains the target address of the collator, and the amount.

As mentioned before, you can also remove all ongoing nominations with the `leaveNominators` extrinsic (in step 3 of the "Extrinsics" instructions). This extrinsic requires no input:

![Staking Leave Nominatiors Extrinsic](/images/staking/staking-stake-10.png)

Once the transaction is confirmed, your account should not be listed in the `nominatorState` state when queried, and you should have no reserved balance (related to staking).

## Staking Rewards

As collators receive rewards from block production, nominators get rewards as well. A brief overview on how the rewards are calculated can be found in [this page](/staking/overview/#reward-distribution).

In summary, nominators will earn rewards based on their stake of the total nominations for the collator being rewarded (including the collator's stake as well).

From the previous example, Alice was rewarded with `0.0044` tokens after two payout rounds:

![Staking Reward Example](/images/staking/staking-stake-1.png)
