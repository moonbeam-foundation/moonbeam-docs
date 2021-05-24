---
title: Nimbus Consensus
description: Learn about all the parts of Moonbeam's Nimbus Consensus Framework, and how it works as part of the Polkadot's shared security model
---

# Moonbeam Nominated Proof-of-Stake

![Moonbeam Consensus Banner](/images/consensus/consensus-banner.png)

## Introduction

Moonbeam consensus mechanism is based on [Polkadot's Proof-of-Stake model](https://wiki.polkadot.network/docs/en/learn-consensus) where there are two main actors: collators and validators. [Collators](https://wiki.polkadot.network/docs/en/learn-collator) maintain parachains (such as Moonbeam)) by collecting transactions from users and offering blocks to the Relay Chain [validators](https://wiki.polkadot.network/docs/en/learn-validator).

However, parachains might find the following problems they need to solve in a trustless and decentralized matter (if applicable):

 - Amongst all possible collators, how do you find the top N to join the active collators pool? (Where N is a configurable parameter)
 - Amongt all collators in the active poool, how do you select the collator/s for the next block?

Moonbeam uses a combination of a [staking system](/staking/overview/) and the Nimbus consensus framework to answer those questions. This page provides more detailed information about Nimbus.

## Nimbus Overview