---
title: Overview
description: Moonbeam provides staking features where token holders nominate collators with their tokens and earn rewards
---

# Staking  in Moonbeam

![Staking Moonbeam Banner](/images/staking/staking-overview-banner.png)

## Introduction

Moonbeam uses a block production mechanism based on [Polkadot's Proof-of-Stake model](https://wiki.polkadot.network/docs/en/learn-consensus), where there are collators and validators. [Collators](https://wiki.polkadot.network/docs/en/learn-collator) mantain parachains (in this case Moonbeam) by collecting transactions from users and producing state transition proofs for the Relay Chain [validators](https://wiki.polkadot.network/docs/en/learn-validator). 

The collators set (nodes that produce blocks) are selected based on the stake the have in the network. And here is where staking comes in. 

Collators (and token holders if they nominate) have a stake in the network from which they get slashed if they misbehave. Therefore, the higher the stake, the higher the network security. But also, the higher the stake, the more likely that collator will get selected to produce a block and earn rewards, which they share with their nominators. In such a way, network members are incentivized to stake tokens to improve the overall security.

## General Definitions

Some important parameters to understand related ot the staking system in Moonbeam include:

 - **Collators** — block producers. They collect transactions from users and produce state transition proofs for the Relay Chain to validate. Have a stake in the network that get slashed if they misbehave
 - **Nominators** — token holders which stake tokens vouching for specific collators. Any user that holds a minimum amount of tokens (in [TODO balance](https://wiki.polkadot.network/docs/en/learn-accounts#balance-types)) can become a nominator
 - **Minimum nomination stake** — is the minimum amount of tokens a user needs to stake to become a nominator
 - **Minimum nomination** — once a user is a nominator, it is the minimum amount of tokens to nominate other collators
 - **Maximumm nominators per collator** —  maximum number of nominators a collator can have
 - **Maximumm collators per nominator** —  maximum number of collators a nominator can nominate

Currently, for Moonbase Alpha:

|      Variable                  |   |                 Value                         |
|:------------------------------:|:-:|:---------------------------------------------:|
|Minimum nomination stake        |   | {{ networks.moonbase.staking.min_nom_stake }} |
|Minimum nomination              |   | {{ networks.moonbase.staking.min_nom_amount}} |
|Maximum nominators per collators|   | {{ networks.moonbase.staking.max_nom_per_col }} |
|Maximum collators per nominator|   | {{ networks.moonbase.staking.max_col_per_nom }} |
