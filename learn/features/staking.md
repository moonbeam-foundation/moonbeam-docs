---
title: Staking
description: Moonbeam provides staking features where token holders delegate collator candidates with their tokens and earn rewards
---

# Staking in Moonbeam

![Staking Moonbeam Banner](/images/learn/features/staking/staking-overview-banner.png)

## Introduction {: #introduction } 

Moonbeam uses a block production mechanism based on [Polkadot's Proof-of-Stake model](https://wiki.polkadot.network/docs/learn-consensus), where there are collators and validators. [Collators](https://wiki.polkadot.network/docs/learn-collator) maintain parachains (in this case, Moonbeam) by collecting transactions from users and producing state transition proofs for the relay chain [validators](https://wiki.polkadot.network/docs/learn-validator).

The candidates in the active set of collators (nodes that produce blocks) are selected based on their stake in the network. And here is where staking comes in.

Collator candidates (and token holders if they delegate) have a stake in the network. The top N candidates by staked amount are chosen to produce blocks with a valid set of transactions, where N is a configurable parameter. Part of each block reward goes to the collators that produced the block, who then shares it with the delegators considering their percental contributions towards the collator's stake. In such a way, network members are incentivized to stake tokens to improve the overall security.

To easily manage staking related actions, you can visit the [Moonbeam Network DApp](https://apps.moonbeam.network/) and use the network tabs at the top of the page to easily switch between Moonbeam networks. To learn how to use the DApp, you can check out the [How to Stake MOVR Tokens](https://moonbeam.network/tutorial/stake-movr/) guide or or [video tutorial](https://www.youtube.com/watch?v=D2wPnqfoeIg), both of which can be adapted for the Moonbeam and the Moonbase Alpha TestNet.

## General Definitions {: #general-definitions } 

--8<-- 'text/staking/staking-definitions.md'

## Quick Reference {: #quick-reference }

=== "Moonbeam"
    |             Variable             |                                                                         Value                                                                         |
    |:--------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          Round duration          |                        {{ networks.moonbeam.staking.round_blocks }} blocks ({{ networks.moonbeam.staking.round_hours }} hours)                        |
    | Minimum delegation per candidate |                                                  {{ networks.moonbeam.staking.min_del_stake }} GLMR                                                   |
    | Maximum delegators per candidate |                                                    {{ networks.moonbeam.staking.max_del_per_can }}                                                    |
    |       Maximum delegations        |                                                    {{ networks.moonbeam.staking.max_del_per_del }}                                                    |
    |       Reward payout delay        |    {{ networks.moonbeam.delegator_timings.rewards_payouts.rounds }} rounds ({{ networks.moonbeam.delegator_timings.rewards_payouts.hours }} hours)    |
    |    Add or increase delegation    |                                           takes effect in the next round (funds are withdrawn immediately)                                            |
    |    Decrease delegation delay     |      {{ networks.moonbeam.delegator_timings.del_bond_less.rounds }} rounds ({{ networks.moonbeam.delegator_timings.del_bond_less.hours }} hours)      |
    |     Revoke delegations delay     | {{ networks.moonbeam.delegator_timings.revoke_delegations.rounds }} rounds ({{ networks.moonbeam.delegator_timings.revoke_delegations.hours }} hours) |
    |      Leave delegators delay      |   {{ networks.moonbeam.delegator_timings.leave_delegators.rounds }} rounds ({{ networks.moonbeam.delegator_timings.leave_delegators.hours }} hours)   |

=== "Moonriver"
    |             Variable             |                                                                          Value                                                                          |
    |:--------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          Round duration          |                        {{ networks.moonriver.staking.round_blocks }} blocks ({{ networks.moonriver.staking.round_hours }} hours)                        |
    | Minimum delegation per candidate |                                                   {{ networks.moonriver.staking.min_del_stake }} MOVR                                                   |
    | Maximum delegators per candidate |                                                    {{ networks.moonriver.staking.max_del_per_can }}                                                     |
    |       Maximum delegations        |                                                    {{ networks.moonriver.staking.max_del_per_del }}                                                     |
    |       Reward payout delay        |    {{ networks.moonriver.delegator_timings.rewards_payouts.rounds }} rounds ({{ networks.moonriver.delegator_timings.rewards_payouts.hours }} hours)    |
    |    Add or increase delegation    |                                            takes effect in the next round (funds are withdrawn immediately)                                             |
    |    Decrease delegation delay     |      {{ networks.moonriver.delegator_timings.del_bond_less.rounds }} rounds ({{ networks.moonriver.delegator_timings.del_bond_less.hours }} hours)      |
    |     Revoke delegations delay     | {{ networks.moonriver.delegator_timings.revoke_delegations.rounds }} rounds ({{ networks.moonriver.delegator_timings.revoke_delegations.hours }} hours) |
    |      Leave delegators delay      |   {{ networks.moonriver.delegator_timings.leave_delegators.rounds }} rounds ({{ networks.moonriver.delegator_timings.leave_delegators.hours }} hours)   |
    
=== "Moonbase Alpha"
    |             Variable             |                                                                         Value                                                                         |
    |:--------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          Round duration          |                        {{ networks.moonbase.staking.round_blocks }} blocks ({{ networks.moonbase.staking.round_hours }} hours)                        |
    | Minimum delegation per candidate |                                                   {{ networks.moonbase.staking.min_del_stake }} DEV                                                   |
    | Maximum delegators per candidate |                                                    {{ networks.moonbase.staking.max_del_per_can }}                                                    |
    |       Maximum delegations        |                                                    {{ networks.moonbase.staking.max_del_per_del }}                                                    |
    |       Reward payout delay        |    {{ networks.moonbase.delegator_timings.rewards_payouts.rounds }} rounds ({{ networks.moonbase.delegator_timings.rewards_payouts.hours }} hours)    |
    |    Add or increase delegation    |                                           takes effect in the next round (funds are withdrawn immediately)                                            |
    |    Decrease delegation delay     |      {{ networks.moonbase.delegator_timings.del_bond_less.rounds }} rounds ({{ networks.moonbase.delegator_timings.del_bond_less.hours }} hours)      |
    |     Revoke delegations delay     | {{ networks.moonbase.delegator_timings.revoke_delegations.rounds }} rounds ({{ networks.moonbase.delegator_timings.revoke_delegations.hours }} hours) |
    |      Leave delegators delay      |   {{ networks.moonbase.delegator_timings.leave_delegators.rounds }} rounds ({{ networks.moonbase.delegator_timings.leave_delegators.hours }} hours)   |
    
To learn how to get the current value of any of the parameters around staking, check out the [Retrieving Staking Parameters](/tokens/staking/stake/#retrieving-staking-parameters) section of the [How to Stake your Tokens](/tokens/staking/stake/) guide. 

If you're looking for candidate or collator-specific requirements and information, you can take a look at the [Collators](/node-operators/networks/collator) guide.

## Resources for Selecting a Collator {: #resources-for-selecting-a-collator}

There are a few resources you can check out to help you select a collator to delegate:

=== "Moonbeam"
    |      Variable       |                                                  Value                                                  |
    |:-------------------:|:-------------------------------------------------------------------------------------------------------:|
    | List of candidates  |                [Moonbeam Subscan](https://moonbeam.subscan.io/validator){target=_blank}                 |
    | Collator statistics | [Moonbeam Explorer](https://moonbeam-explorer.netlify.app/stats/miners?network=Moonbeam){target=_blank} |

=== "Moonriver"
    |      Variable       |                                                                 Value                                                                 |
    |:-------------------:|:-------------------------------------------------------------------------------------------------------------------------------------:|
    | List of candidates  |                              [Moonriver Subscan](https://moonriver.subscan.io/validator){target=_blank}                               |
    | Collator statistics |               [Moonbeam Explorer](https://moonbeam-explorer.netlify.app/stats/miners?network=Moonriver){target=_blank}                |
    |  Collator APY data  | [DappLooker Collator Dashboard](http://analytics.dapplooker.com/public/dashboard/7dfc5a6e-da33-4d54-94bf-0dfa5e6843cb){target=_blank} |

=== "Moonbase Alpha"
    |      Variable       |                                                    Value                                                     |
    |:-------------------:|:------------------------------------------------------------------------------------------------------------:|
    | List of candidates  |                [Moonbase Alpha Subscan](https://moonbase.subscan.io/validator){target=_blank}                |
    | Collator statistics | [Moonbeam Explorer](https://moonbeam-explorer.netlify.app/stats/miners?network=MoonbaseAlpha){target=_blank} |


!!! note
    The DappLooker Collator dashboard for Moonriver is experimental beta software and may not accurately reflect collator performance. Be sure to do your own research before delegating to a collator.

## Reward Distribution {: #reward-distribution } 

Rewards for collators and their delegators are calculated at the start of every round for their work prior to the [reward payout delay](#quick-reference). For example, on Moonriver the rewards are calculated for the collators work from {{ networks.moonriver.delegator_timings.rewards_payouts.rounds }} rounds ago.

The calculated rewards are then paid out on a block-by-block basis. For every block, one collator will be chosen to receive their entire reward payout from the prior round, along with their delegators, until all of the rewards have been paid for that round. For example, if there are {{ networks.moonriver.staking.max_candidates }} collators who produced blocks in the prior round, all of the collators and their delegators would be paid by block {{ networks.moonriver.staking.max_candidates }} of the new round.

### Annual Inflation {: #annual-inflation}

The distribution of the annual inflation goes as follows:

=== "Moonbeam"
    |                 Variable                  |                                         Value                                         |
    |:-----------------------------------------:|:-------------------------------------------------------------------------------------:|
    |             Annual inflation              |               {{ networks.moonbeam.inflation.total_annual_inflation }}%               |
    | Rewards pool for collators and delegators | {{ networks.moonbeam.inflation.delegator_reward_inflation }}% of the annual inflation |
    |            Collator commission            | {{ networks.moonbeam.inflation.collator_reward_inflation }}% of the annual inflation  |
    |          Parachain bond reserve           |  {{ networks.moonbeam.inflation.parachain_bond_inflation }}% of the annual inflation  |

=== "Moonriver"
    |                 Variable                  |                                         Value                                          |
    |:-----------------------------------------:|:--------------------------------------------------------------------------------------:|
    |             Annual inflation              |               {{ networks.moonriver.inflation.total_annual_inflation }}%               |
    | Rewards pool for collators and delegators | {{ networks.moonriver.inflation.delegator_reward_inflation }}% of the annual inflation |
    |            Collator commission            | {{ networks.moonriver.inflation.collator_reward_inflation }}% of the annual inflation  |
    |          Parachain bond reserve           |  {{ networks.moonriver.inflation.parachain_bond_inflation }}% of the annual inflation  |

=== "Moonbase Alpha"
    |                 Variable                  |                                         Value                                         |
    |:-----------------------------------------:|:-------------------------------------------------------------------------------------:|
    |             Annual inflation              |               {{ networks.moonbase.inflation.total_annual_inflation }}%               |
    | Rewards pool for collators and delegators | {{ networks.moonbase.inflation.delegator_reward_inflation }}% of the annual inflation |
    |            Collator commission            | {{ networks.moonbase.inflation.collator_reward_inflation }}% of the annual inflation  |
    |          Parachain bond reserve           |  {{ networks.moonbase.inflation.parachain_bond_inflation }}% of the annual inflation  |

From the rewards pool, collators get the rewards corresponding to their stake in the network. The rest are distributed among delegators by stake.

### Calculating Rewards {: #calculating-rewards }

Mathematically speaking, for collators, the reward distribution per block proposed and finalized would look like this:

![Staking Collator Reward](/images/learn/features/staking/staking-overview-1.png)

Where `amount_due` is the corresponding inflation being distributed in a specific block, the `stake` corresponds to the number of tokens bonded by the collator in respect to the total stake of that collator (accounting delegations).

For each delegator, the reward distribution (per block proposed and finalized by the delegated collator) would look like this:

![Staking Delegator Reward](/images/learn/features/staking/staking-overview-2.png)

Where `amount_due` is the corresponding inflation being distributed in a specific block, the `stake` corresponds to the amount of tokens bonded by each delegator in respect to the total stake of that collator.
