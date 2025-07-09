---
title: Staking
description: Moonbeam provides staking features where token holders delegate collator candidates with their tokens and earn rewards.
---

# Staking on Moonbeam

## Introduction {: #introduction }

Moonbeam uses a block production mechanism based on [Polkadot's Proof-of-Stake model](https://docs.polkadot.com/polkadot-protocol/architecture/polkadot-chain/pos-consensus/){target=\_blank}, where there are collators and validators. [Collators](https://wiki.polkadot.network/learn/learn-collator/){target=\_blank} maintain parachains (in this case, Moonbeam) by collecting transactions from users and producing state transition proofs for the relay chain [validators](https://wiki.polkadot.network/learn/learn-validator/){target=\_blank}.

The candidates in the active set of collators (nodes that produce blocks) are selected based on their stake in the network. And here is where staking comes in.

Collator candidates (and token holders if they delegate) have a stake in the network. The top N candidates by staked amount are chosen to produce blocks with a valid set of transactions, where N is a configurable parameter. Part of each block reward goes to the collators that produced the block, who then share it with the delegators considering their percental contributions towards the collator's stake. In such a way, network members are incentivized to stake tokens to improve the overall security. Since staking is done at a protocol level through the staking interface, if you choose to delegate, the collators you delegate to do not have access to your tokens.

To easily manage staking related actions, you can visit the [Moonbeam Network DApp](https://apps.moonbeam.network){target=\_blank} and use the network tabs at the top of the page to easily switch between Moonbeam networks. To learn how to use the DApp, you can check out the [How to Stake MOVR Tokens](https://moonbeam.network/news/how-to-stake-movr-tokens-on-moonriver-and-earn-staking-rewards){target=\_blank} guide or [video tutorial](https://www.youtube.com/watch?v=8GwetYmzEJM){target=\_blank}, both of which can be adapted for the Moonbeam and the Moonbase Alpha TestNet.

## General Definitions {: #general-definitions }

Some important parameters to understand in relation to the staking system on Moonbeam include:

 - **Round** — a specific number of blocks around which staking actions are enforced. For example, new delegations are enacted when the next round starts. When bonding less or revoking delegations, funds are returned after a specified number of rounds
 - **Candidates** - node operators that are eligible to become block producers if they can acquire enough stake to be in the active set
 - **Collators** — active set of candidates that are selected to be block producers. They collect transactions from users and produce state transition proofs for the relay chain to validate
 - **Delegators** — token holders who stake tokens, vouching for specific collator candidates. Any user that holds a minimum amount of tokens as [free balance](https://wiki.polkadot.network/learn/learn-accounts/#balance-types) can become a delegator
 - **Minimum delegation per candidate** — minimum amount of tokens to delegate candidates once a user is in the set of delegators
 - **Maximum delegators per candidate** — maximum number of delegators, by staked amount, that a candidate can have which are eligible to receive staking rewards
 - **Maximum delegations** — maximum number of candidates a delegator can delegate
 - **Exit delay** - an exit delay is the amount of rounds before a candidate or delegator can execute a scheduled request to decrease or revoke a bond, or leave the set of candidates or delegators
 - **Reward payout delay** - a certain amount of rounds must pass before staking rewards are distributed automatically to the free balance
 - **Reward pool** - a portion of the annual inflation that is set aside for collators and delegators
 - **Collator commission** - default fixed percent a collator takes off the top of the due staking rewards. Not related to the reward pool
 - **Delegator rewards** — the aggregate delegator rewards distributed over all eligible delegators, taking into account the relative size of stakes ([read more](/learn/features/staking/#reward-distribution))
 - **Auto-compounding** - a setting that automatically applies a percentage of a delegator's rewards to their total amount delegated
 - **Slashing** — a mechanism to discourage collator misbehavior, where typically the collator and their delegators get slashed by losing a percentage of their stake. Currently, there is no slashing but this can be changed through governance. Collators who produce blocks that are not finalized by the relay chain won't receive rewards

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

--8<-- 'text/_common/async-backing.md'

To learn how to get the current value of any of the parameters around staking, check out the [Retrieving Staking Parameters](/tokens/staking/stake/#retrieving-staking-parameters){target=\_blank} section of the [How to Stake your Tokens](/tokens/staking/stake/){target=\_blank} guide.

If you're looking for candidate or collator-specific requirements and information, you can take a look at the [Collators](/node-operators/networks/collators/requirements/#bonding-requirements){target=\_blank} guide.

## Resources for Selecting a Collator {: #resources-for-selecting-a-collator}

There are a few resources you can check out to help you select a collator to delegate:

=== "Moonbeam"
    |           Variable           |                                      Value                                      |
    |:----------------------------:|:-------------------------------------------------------------------------------:|
    |     Stake GLMR Dashboard     |              [Stake GLMR](https://stakeglmr.com){target=\_blank}               |
    |    Collators Leaderboard     |       [Moonscan](https://moonbeam.moonscan.io/collators){target=\_blank}       |
    |      Collator Dashboard      | [DappLooker](https://dapplooker.com/dashboard/moonbeam-collator-dashboard-91){target=\_blank} |

=== "Moonriver"
    |           Variable           |                                      Value                                       |
    |:----------------------------:|:--------------------------------------------------------------------------------:|
    |     Stake MOVR Dashboard     |               [Stake MOVR](https://stakemovr.com){target=\_blank}               |
    |    Collators Leaderboard     |       [Moonscan](https://moonriver.moonscan.io/collators){target=\_blank}       |
    |      Collator Dashboard      | [DappLooker](https://dapplooker.com/dashboard/moonriver-collator-dashboard-28){target=\_blank} |

=== "Moonbase Alpha"
    |      Variable      |                                      Value                                       |
    |:------------------:|:--------------------------------------------------------------------------------:|
    | List of candidates | [Moonbase Alpha Subscan](https://moonbase.subscan.io/validator){target=\_blank} |

!!! note
    The DappLooker Collator dashboard for Moonriver is experimental beta software and may not accurately reflect collator performance. Be sure to do your own research before delegating to a collator.

### General Tips {: #general-tips }

- To optimize your staking rewards, you should generally choose a collator with a lower total amount bonded. In that case, your delegation amount will represent a larger portion of the collator’s total stake and you will earn proportionally higher rewards. However, there is a higher risk of the collator being kicked out of the active set and not earning rewards at all
- The minimum bond for each collator tends to increase over time, so if your delegation is close to the minimum, there is a higher chance you might fall below the minimum and not receive rewards
- Spreading delegations between multiple collators is more efficient in terms of rewards, but only recommended if you have enough to stay above the minimum bond of each collator
- You can consider collator performance by reviewing the number of blocks each collator has produced recently
- You can set up auto-compounding which will automatically restake a specified percentage of your delegation rewards

## Reward Distribution {: #reward-distribution }

Rewards for collators and their delegators are calculated at the start of every round for their work prior to the [reward payout delay](#quick-reference). For example, on Moonriver the rewards are calculated for the collators work from {{ networks.moonriver.delegator_timings.rewards_payouts.rounds }} rounds ago.

The calculated rewards are then paid out on a block-by-block basis starting at the second block of the round. For every block, one collator will be chosen to receive their entire reward payout from the prior round, along with their delegators, until all rewards have been paid out for that round. For example, if there are {{ networks.moonriver.staking.max_candidates }} collators who produced blocks in the prior round, all of the collators and their delegators will be paid by block {{ networks.moonriver.staking.paid_out_block }} of the new round.

You can choose to auto-compound your delegation rewards so you no longer have to manually delegate rewards. If you choose to set up auto-compounding, you can specify the percentage of rewards to be auto-compounded. These rewards will then be automatically added to your delegation.

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

![Staking Collator Reward](/images/learn/features/staking/staking-overview-1.webp)

Where `amount_due` is the corresponding inflation being distributed in a specific block, the `stake` corresponds to the number of tokens bonded by the collator in respect to the total stake of that collator (accounting delegations).

For each delegator, the reward distribution (per block proposed and finalized by the delegated collator) would look like this:

![Staking Delegator Reward](/images/learn/features/staking/staking-overview-2.webp)

Where `amount_due` is the corresponding inflation being distributed in a specific block, the `stake` corresponds to the amount of tokens bonded by each delegator in respect to the total stake of that collator.

--8<-- 'text/_disclaimers/staking-risks.md'
*Staked MOVR/GLMR tokens are locked up, and retrieving them requires a {{ networks.moonriver.delegator_timings.del_bond_less.days }} day/{{ networks.moonbeam.delegator_timings.del_bond_less.days }} day waiting period .*
--8<-- 'text/_disclaimers/staking-risks-part-2.md'
