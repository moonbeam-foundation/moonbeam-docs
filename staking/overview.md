---
title: Overview
description: Moonbeam provides staking features where token holders nominate collators with their tokens and earn rewards
---

# Staking in Moonbeam

![Staking Moonbeam Banner](/images/staking/staking-overview-banner.png)

## Introduction

Moonbeam uses a block production mechanism based on [Polkadot's Proof-of-Stake model](https://wiki.polkadot.network/docs/learn-consensus), where there are collators and validators. [Collators](https://wiki.polkadot.network/docs/learn-collator) maintain parachains (in this case, Moonbeam) by collecting transactions from users and producing state transition proofs for the relay chain [validators](https://wiki.polkadot.network/docs/learn-validator).

The collators' set (nodes that produce blocks) are selected based on their stake in the network. And here is where staking comes in.

Collators (and token holders if they nominate) have a stake in the network. The top N collators by staked amount are chosen to produce blocks with a valid set of transactions, where N is a configurable parameter. Part of each block reward goes to the collator that produced the block, who then shares it with the nominators considering their percental contributions towards the collator's staked. In such a way, network members are incentivized to stake tokens to improve the overall security.

## General Definitions

--8<-- 'text/staking/staking-definitions.md'

Currently, for Moonbase Alpha:

|             Variable             |     |                                                  Value                                                  |
| :------------------------------: | :-: | :-----------------------------------------------------------------------------------------------------: |
|     Minimum nomination stake     |     |                          {{ networks.moonbase.staking.min_nom_stake }} tokens                           |
|        Minimum nomination        |     |                          {{ networks.moonbase.staking.min_nom_amount}} tokens                           |
| Maximum nominators per collators |     |                             {{ networks.moonbase.staking.max_nom_per_col }}                             |
| Maximum collators per nominator  |     |                             {{ networks.moonbase.staking.max_col_per_nom }}                             |
|              Round               |     | {{ networks.moonbase.staking.round_blocks }} blocks ({{ networks.moonbase.staking.round_hours }} hours) |
|          Bond duration           |     |                            {{ networks.moonbase.staking.bond_lock }} rounds                             |

## Reward Distribution

At the end of every round ({{ networks.moonbase.staking.round_blocks }} blocks), collators are rewarded for their work from {{ networks.moonbase.staking.bond_lock }} rounds ago.

When collators join the set of collators, they establish a commission to charge their nominators for the service they provide. Therefore, the reward distribution goes as follows:

 - The commission is taken out of the reward to be distributed
 - The collator gets the rewards corresponding to their stake in the network, plus the commission
 - The rest of the rewards are distributed among nominators by stake

Mathematically speaking, for collators, the reward would look like this:

![Staking Collator Reward](/images/staking/staking-overview-1.png)

Where the stake corresponds to the amount of tokens bonded by the collator in respect to the total stake of that collator (accounting nominations).

For each nominator, the reward would look like this:

![Staking Nominator Reward](/images/staking/staking-overview-2.png)

Where the stake corresponds to the amount of tokens bonded by each nominator in respect to the total stake of that collator.

## Try it on Moonbase Alpha

In the Moonbase Alpha TestNet, token holders can stake and earn rewards (to get familiar with the system as the token doesn't have any actual value).

To do so, you can check [this guide](/staking/stake/).
