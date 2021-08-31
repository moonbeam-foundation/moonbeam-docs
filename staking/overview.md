---
title: Overview
description: Moonbeam provides staking features where token holders nominate collators with their tokens and earn rewards
---

# Staking in Moonbeam

![Staking Moonbeam Banner](/images/staking/staking-overview-banner.png)

## Introduction {: #introduction } 

Moonbeam uses a block production mechanism based on [Polkadot's Proof-of-Stake model](https://wiki.polkadot.network/docs/learn-consensus), where there are collators and validators. [Collators](https://wiki.polkadot.network/docs/learn-collator) maintain parachains (in this case, Moonbeam) by collecting transactions from users and producing state transition proofs for the relay chain [validators](https://wiki.polkadot.network/docs/learn-validator).

The collators' set (nodes that produce blocks) are selected based on their stake in the network. And here is where staking comes in.

Collators (and token holders if they nominate) have a stake in the network. The top N collators by staked amount are chosen to produce blocks with a valid set of transactions, where N is a configurable parameter. Part of each block reward goes to the collator that produced the block, who then shares it with the nominators considering their percental contributions towards the collator's staked. In such a way, network members are incentivized to stake tokens to improve the overall security.

## Quick Reference {: #quick-reference }

* Minimum Nomination Amount: {{ networks.moonbase.staking.min_nom_stake }} MOVR/DEV
* Max Eligible Nominators Per Collator: Top {{ networks.moonriver.staking.max_nom_per_col }} nominators by size of stake per collator are eligible for staking rewards (nominators not in the top {{ networks.moonriver.staking.max_nom_per_col }} do not receive any rewards)
* Bonding Duration: {{ networks.moonriver.staking.bond_lock }} rounds ({{ networks.moonriver.staking.round_blocks }} blocks/round, time per round is approximately 1 hour)
* Unbonding Duration: {{ networks.moonriver.staking.bond_lock }} rounds 
* Reward Payout Time: Rewards are distributed automatically to the free balance {{ networks.moonriver.collator_timings.rewards_payouts.rounds }} rounds after they are earned
* Aggregate Nominator Rewards: 50% of total inflation
* Nominator Rewards: Variable; it's the aggregate nominator rewards distributed over all eligible nominators, taking into account the relative size of stakes; [More Information](/staking/overview/#reward-distribution)
* Collator Commission: Fixed at 20% of total inflation, separate from the nominator reward pool
* Slashing: No slashing currently (can be changed with governance); collator rewards are paid as part of produced blocks, so offline or poorly performing collators that don’t produce blocks will pay out less or no rewards
* Collator Information: [Link1](https://moonriver.subscan.io/validator) [Link2](https://moonbeam-explorer.netlify.app/stats/miners/)
* Managing Staking and Nomination Related Actions: [Link](https://apps.moonbeam.network/moonriver)


## General Definitions {: #general-definitions } 

--8<-- 'text/staking/staking-definitions.md'

=== "Moonbase Alpha"

    |             Variable             |  |                                                  Value                                                  |
    |:--------------------------------:|::|:-------------------------------------------------------------------------------------------------------:|
    |     Minimum nomination stake     |  |                          {{ networks.moonbase.staking.min_nom_stake }} DEV                              |
    |        Minimum nomination        |  |                          {{ networks.moonbase.staking.min_nom_amount}} DEV                              |
    | Maximum nominators per collators |  |                             {{ networks.moonbase.staking.max_nom_per_col }}                             |
    | Maximum collators per nominator  |  |                             {{ networks.moonbase.staking.max_col_per_nom }}                             |
    |              Round               |  | {{ networks.moonbase.staking.round_blocks }} blocks ({{ networks.moonbase.staking.round_hours }} hours) |
    |          Bond duration           |  |                            {{ networks.moonbase.staking.bond_lock }} rounds                             |

=== "Moonriver"

    |             Variable             |  |                                                   Value                                                   |
    |:--------------------------------:|::|:---------------------------------------------------------------------------------------------------------:|
    |     Minimum nomination stake     |  |                           {{ networks.moonriver.staking.min_nom_stake }} MOVR                             |
    |        Minimum nomination        |  |                           {{ networks.moonriver.staking.min_nom_amount}} MOVR                             |
    | Maximum nominators per collators |  |                             {{ networks.moonriver.staking.max_nom_per_col }}                              |
    | Maximum collators per nominator  |  |                             {{ networks.moonriver.staking.max_col_per_nom }}                              |
    |              Round               |  | {{ networks.moonriver.staking.round_blocks }} blocks ({{ networks.moonriver.staking.round_hours }} hours) |
    |          Bond duration           |  |                             {{ networks.moonriver.staking.bond_lock }} rounds                             |


## Reward Distribution {: #reward-distribution } 

Collators are rewarded at the end of every round ({{ networks.moonbase.staking.round_blocks }} blocks) for their work from {{ networks.moonbase.staking.bond_lock }} rounds ago.

The distribution of the 5% annual inflation goes as follows:

 - 1% goes to incentivizing collators
 - 1.5% goes to the parachain bond reserve
 - The remaining 2.5% will go to users that stake their tokens

Out of that 2.5%, collators gets the rewards corresponding to their stake in the network.The rest are distributed among nominators by stake.

Mathematically speaking, for collators, the reward distribution per block proposed and finalized would look like this:

![Staking Collator Reward](/images/staking/staking-overview-1.png)

Where `amount_due` is the corresponding inflation being distributed in a specific block, the `stake` corresponds to the number of tokens bonded by the collator in respect to the total stake of that collator (accounting nominations).

For each nominator, the reward distribution (per block proposed and finalized by the nominated collator) would look like this:

![Staking Nominator Reward](/images/staking/staking-overview-2.png)

Where `amount_due` is the corresponding inflation being distributed in a specific block, the `stake` corresponds to the amount of tokens bonded by each nominator in respect to the total stake of that collator.

## Try it out {: #try-it-out } 

In the Moonbase Alpha TestNet, token holders can stake and earn rewards (to get familiar with the system as the token doesn't have any actual value).

To do so, you can check [this guide](/staking/stake/).

--8<-- 'text/moonriver-launch/post-launch.md'
