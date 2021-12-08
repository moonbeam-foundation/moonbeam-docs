---
title: Staking
description: Moonbeam provides staking features where token holders nominate collators with their tokens and earn rewards
---

# Staking in Moonbeam

![Staking Moonbeam Banner](/images/learn/features/staking/staking-overview-banner.png)

## Introduction {: #introduction } 

Moonbeam uses a block production mechanism based on [Polkadot's Proof-of-Stake model](https://wiki.polkadot.network/docs/learn-consensus), where there are collators and validators. [Collators](https://wiki.polkadot.network/docs/learn-collator) maintain parachains (in this case, Moonbeam) by collecting transactions from users and producing state transition proofs for the relay chain [validators](https://wiki.polkadot.network/docs/learn-validator).

The collators' set (nodes that produce blocks) are selected based on their stake in the network. And here is where staking comes in.

Collators (and token holders if they nominate) have a stake in the network. The top N collators by staked amount are chosen to produce blocks with a valid set of transactions, where N is a configurable parameter. Part of each block reward goes to the collator that produced the block, who then shares it with the nominators considering their percental contributions towards the collator's staked. In such a way, network members are incentivized to stake tokens to improve the overall security.

## General Definitions {: #general-definitions } 

--8<-- 'text/staking/staking-definitions.md'

## Quick Reference {: #quick-reference }

=== "Moonriver" 

    - **Minimum nomination amount** — {{ networks.moonriver.staking.min_nom_stake }} MOVR
    - **Round duration** — {{ networks.moonriver.staking.round_blocks }} blocks, time per round is approximately {{ networks.moonriver.staking.round_hours }} hour
    - **Max eligible nominators per collator** — for a given round, only the top {{ networks.moonriver.staking.max_nom_per_col }} nominators by staked amount are eligible for staking rewards
    - **Max collators per nominator** — a nominator can nominated {{ networks.moonriver.staking.max_col_per_nom }} different collators
    - **Bonding duration** — nomination takes effect in the next round (funds are withdrawn immediately)
    - **Unbonding duration** — {{ networks.moonriver.staking.bond_lock }} rounds
    - **Reward payout time** — {{ networks.moonriver.collator_timings.rewards_payouts.rounds }} rounds. Rewards are distributed automatically to the free balance
    - **Collator commission** — fixed at {{ networks.moonriver.staking.collator_reward_inflation }}% of the annual inflation ({{ networks.moonriver.total_annual_inflation }}%). Not related to the nominators reward pool
    - **Nominators reward pool** — {{ networks.moonriver.staking.nominator_reward_inflation }}% of the annual inflation
    - **Nominator rewards** — variable. It's the aggregate nominator rewards distributed over all eligible nominators, taking into account the relative size of stakes ([read more](/staking/overview/#reward-distribution))
    - **Slashing** — currently, there is no slashing. This can be later changed through governance. Collators who produce blocks that are not finalized by the relay chain won't receive rewards
    - **Collator information** — a list of Moonriver collators is available on [Subscan](https://moonriver.subscan.io/validator){target=_blank}. A collator performance leaderboard is accessible on [Moonscan](https://moonriver.moonscan.io/collators){target=_blank}
    - **Collator APY Info** - [DappLooker Collator Dashboard](http://analytics.dapplooker.com/public/dashboard/7dfc5a6e-da33-4d54-94bf-0dfa5e6843cb){target=_blank} *Warning! This dashboard is experimental beta software and may not accurately reflect collator performance. Be sure to do your own research before delegating to a collator* 
    - **Manage staking related actions** — visit the [Moonbeam Network DApp](https://apps.moonbeam.network/moonriver){target=_blank}

=== "Moonbase Alpha" 

    - **Minimum nomination amount** — {{ networks.moonbase.staking.min_nom_stake }} DEV
    - **Round duration** — {{ networks.moonbase.staking.round_blocks }} blocks, time per round is approximately {{ networks.moonbase.staking.round_hours }} hour
    - **Max eligible nominators per collator** — for a given round, only the top {{ networks.moonbase.staking.max_nom_per_col }} nominators by staked amount are eligible for staking rewards
    - **Max collators per nominator** — a nominator can nominated {{ networks.moonbase.staking.max_col_per_nom }} different collators
    - **Bonding duration** — nomination takes effect in the next round (funds are withdrawn immediately)
    - **Unbonding duration** — {{ networks.moonbase.staking.bond_lock }} rounds
    - **Reward payout time** — {{ networks.moonbase.collator_timings.rewards_payouts.rounds }} rounds. Rewards are distributed automatically to the free balance
    - **Collator commission** — fixed at {{ networks.moonbase.staking.collator_reward_inflation }}% of the annual  inflation ({{ networks.moonriver.total_annual_inflation }}%). Not related to the nominators reward pool
    - **Nominators reward pool** — {{ networks.moonbase.staking.nominator_reward_inflation }}% of the annual  inflation
    - **Nominator rewards** — variable. It's the aggregate nominator rewards distributed over all eligible nominators, taking into account the relative size of stakes ([read more](/staking/overview/#reward-distribution))
    - **Slashing** — currently, there is no slashing. This can be later changed through governance. Collators who produce blocks that are not finalized by the relay chain won't receive rewards
    - **Collator information** — a list of Moonbase Alpha collators is available on [Subscan](https://moonbase.subscan.io/validator){target=_blank}. Collator data for the last two rounds: [Moonbeam Explorer](https://moonbeam-explorer.netlify.app/stats/miners?network=MoonbaseAlpha){target=_blank}
    - **Manage staking related actions** — visit the [Moonbeam Network DApp](https://apps.moonbeam.network/moonbase-alpha){target=_blank}

To learn how to get the current value of any of the parameters around staking, check out the [Retrieving Staking Parameters](/tokens/staking/stake/#retrieving-staking-parameters) section of the [How to Stake your Tokens](/tokens/staking/stake/) guide. 

## Reward Distribution {: #reward-distribution } 

Collators are rewarded at the end of every round ({{ networks.moonbase.staking.round_blocks }} blocks) for their work from {{ networks.moonbase.staking.bond_lock }} rounds ago.

The distribution of the 5% annual inflation goes as follows:

 - 1% goes to incentivizing collators
 - 1.5% goes to the parachain bond reserve
 - The remaining 2.5% will go to users that stake their tokens

Out of that 2.5%, collators gets the rewards corresponding to their stake in the network.The rest are distributed among nominators by stake.

Mathematically speaking, for collators, the reward distribution per block proposed and finalized would look like this:

![Staking Collator Reward](/images/learn/features/staking/staking-overview-1.png)

Where `amount_due` is the corresponding inflation being distributed in a specific block, the `stake` corresponds to the number of tokens bonded by the collator in respect to the total stake of that collator (accounting nominations).

For each nominator, the reward distribution (per block proposed and finalized by the nominated collator) would look like this:

![Staking Nominator Reward](/images/learn/features/staking/staking-overview-2.png)

Where `amount_due` is the corresponding inflation being distributed in a specific block, the `stake` corresponds to the amount of tokens bonded by each nominator in respect to the total stake of that collator.

## Try it out {: #try-it-out } 

You can start interacting with staking functions on Moonriver and Moonbase Alpha through the [Moonbeam Network DApp](https://apps.moonbeam.network/moonriver). To do so, you can check [this guide](https://moonbeam.network/tutorial/stake-movr/) or [this video tutorial](https://www.youtube.com/watch?v=maIfN2QkPpc).
