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

=== "Moonriver" 

    - **Minimum nomination amount** — {{ networks.moonriver.staking.min_nom_stake }} MOVR
    - **Max eligible nominators per collator** — top {{ networks.moonriver.staking.max_nom_per_col }} nominators by size of stake per collator are eligible for staking rewards (nominators not in the top {{ networks.moonriver.staking.max_nom_per_col }} do not receive any rewards)
    - **Bonding duration** — {{ networks.moonriver.staking.bond_lock }} rounds ({{ networks.moonriver.staking.round_blocks }} blocks/round, time per round is approximately {{ networks.moonriver.staking.round_hours }} hour)
    - **Unbonding duration** — {{ networks.moonriver.staking.bond_lock }} rounds 
    - **Reward payout time** — rewards are distributed automatically to the free balance {{ networks.moonriver.collator_timings.rewards_payouts.rounds }} rounds after they are earned
    - **Aggregate nominator rewards** — {{ networks.moonriver.staking.nominator_reward_as_percent_of_inflation }}% of total inflation, which is set to {{ networks.moonriver.treasury.total_annual_inflation }}% per year
    - **Nominator rewards** — variable; it's the aggregate nominator rewards distributed over all eligible nominators, taking into account the relative size of stakes ([More Information](/staking/overview/#reward-distribution))
    - **Collator commission** — fixed at {{ networks.moonriver.staking.collator_reward_as_percent_of_inflation }}% of total inflation, set to a {{ networks.moonriver.treasury.total_annual_inflation }}% annual total inflation rate, separate from the nominator reward pool
    - **Slashing** — no slashing currently (can be changed with governance); collator rewards are paid as part of produced blocks, so offline or poorly performing collators that don’t produce blocks will pay out less or no rewards
    - **Collator information** — [list of validators on the Moonriver Subscan](https://moonriver.subscan.io/validator), [collator data on the Moonbeam Explorer](https://moonbeam-explorer.netlify.app/stats/miners/)
    - **Managing staking and nomination related actions** — [the Moonbeam Network dApp](https://apps.moonbeam.network/moonriver)

=== "Moonbase Alpha" 

    - **Minimum nomination amount** — {{ networks.moonbase.staking.min_nom_stake }} DEV
    - **Max eligible nominators per collator** — top {{ networks.moonbase.staking.max_nom_per_col }} nominators by size of stake per collator are eligible for staking rewards (nominators not in the top {{ networks.moonbase.staking.max_nom_per_col }} do not receive any rewards)
    - **Bonding duration** — {{ networks.moonbase.staking.bond_lock }} rounds ({{ networks.moonbase.staking.round_blocks }} blocks/round, time per round is approximately {{ networks.moonbase.staking.round_hours }} hour)
    - **Unbonding duration** — {{ networks.moonbase.staking.bond_lock }} rounds 
    - **Reward payout time** — rewards are distributed automatically to the free balance {{ networks.moonbase.collator_timings.rewards_payouts.rounds }} rounds after they are earned
    - **Aggregate nominator rewards** — {{ networks.moonbase.staking.nominator_reward_as_percent_of_inflation }}% of total inflation, which is set to {{ networks.moonbase.treasury.total_annual_inflation }}% per year
    - **Nominator rewards** — variable; it's the aggregate nominator rewards distributed over all eligible nominators, taking into account the relative size of stakes ([More Information](/staking/overview/#reward-distribution))
    - **Collator commission** — fixed at {{ networks.moonbase.staking.collator_reward_as_percent_of_inflation }}% of total inflation, set to a {{ networks.moonbase.treasury.total_annual_inflation }}% annual total inflation rate, separate from the nominator reward pool
    - **Slashing** — no slashing currently (can be changed with governance); collator rewards are paid as part of produced blocks, so offline or poorly performing collators that don’t produce blocks will pay out less or no rewards
    - **Collator information** — [list of validators on the Moonbase Alpha Subscan](https://moonbase.subscan.io/validator)
    - **Managing staking and nomination related actions** — [the Moonbeam Network dApp](https://apps.moonbeam.network/moonbase-alpha)

## General Definitions {: #general-definitions } 

--8<-- 'text/staking/staking-definitions.md'

=== "Moonriver"

    |             Variable             |  |                                                   Value                                                   |
    |:--------------------------------:|::|:---------------------------------------------------------------------------------------------------------:|
    |     Minimum nomination stake     |  |                           {{ networks.moonriver.staking.min_nom_stake }} MOVR                             |
    |        Minimum nomination        |  |                           {{ networks.moonriver.staking.min_nom_amount}} MOVR                             |
    | Maximum nominators per collators |  |                             {{ networks.moonriver.staking.max_nom_per_col }}                              |
    | Maximum collators per nominator  |  |                             {{ networks.moonriver.staking.max_col_per_nom }}                              |
    |              Round               |  | {{ networks.moonriver.staking.round_blocks }} blocks ({{ networks.moonriver.staking.round_hours }} hours) |
    |          Bond duration           |  |                             {{ networks.moonriver.staking.bond_lock }} rounds                             |

=== "Moonbase Alpha"

    |             Variable             |  |                                                  Value                                                  |
    |:--------------------------------:|::|:-------------------------------------------------------------------------------------------------------:|
    |     Minimum nomination stake     |  |                          {{ networks.moonbase.staking.min_nom_stake }} DEV                              |
    |        Minimum nomination        |  |                          {{ networks.moonbase.staking.min_nom_amount}} DEV                              |
    | Maximum nominators per collators |  |                             {{ networks.moonbase.staking.max_nom_per_col }}                             |
    | Maximum collators per nominator  |  |                             {{ networks.moonbase.staking.max_col_per_nom }}                             |
    |              Round               |  | {{ networks.moonbase.staking.round_blocks }} blocks ({{ networks.moonbase.staking.round_hours }} hours) |
    |          Bond duration           |  |                            {{ networks.moonbase.staking.bond_lock }} rounds                             |


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

You can start interacting with staking functions on Moonbase Alpha or Moonriver through this [dashboard](https://apps.moonbeam.network/moonriver). To do so, you can check [this guide](https://moonbeam.network/tutorial/stake-movr/) or [this video tutorial](https://www.youtube.com/watch?v=maIfN2QkPpc).
