---
title: Moonbeam Consensus Mechanism
description: Learn about all the parts of Moonbeam's Nimbus Consensus Framework, and how it works as part of the Polkadot's shared security model
---

# Nimbus Consensus Framework

![Moonbeam Consensus Banner](/images/consensus/consensus-banner.png)

## Introduction

Polkadot relies on a [hybrid consensus model](https://wiki.polkadot.network/docs/en/learn-consensus). In such a scheme, the block finality gadget and the block production mechanism are separate. Consequently, parachains only have to worry about producing blocks and rely on the relay chain to validate the state transitions.

At a parachain level, block producers are called [collators](https://wiki.polkadot.network/docs/en/learn-collator). They maintain parachains (such as Moonbeam)) by collecting transactions from users and offering blocks to the Relay Chain [validators](https://wiki.polkadot.network/docs/en/learn-validator).

However, parachains might find the following problems they need to solve in a trustless and decentralized matter (if applicable):

 - Amongst all possible collators, how do you find the top N to join the active collators pool? (Where N is a configurable parameter)
 - Amongt all collators in the active pool, how do you select the collator/s for the next block?

Enter Nimbus. Nimbus is a framework for building slot-based consensus algorithms on [cumulus](https://github.com/paritytech/cumulus)-based parachains, where consensus designers can use the client-side worker and primitive traits, needing only to write their filter(s). Filters can be customizable for each specific usecase, and can be composed so that block authorship is restricted to a subset of collators in multiple steps.

Moonbeam uses a two-layer approach. The first layer is comprised of the a parachain staking filter, which helps select a active collator pool among all collator candidates using a staked based ranking. The second layer adds another filter 

## Parachain Staking