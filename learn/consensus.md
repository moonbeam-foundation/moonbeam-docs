---
title: Parachain Consensus
description: Learn about all the parts of Moonbeam's Nimbus consensus framework and how it works as part of the Polkadot's shared security model
---

# Nimbus Consensus Framework

![Moonbeam Consensus Banner](/images/consensus/consensus-banner.png)

## Introduction

Polkadot relies on a [hybrid consensus model](https://wiki.polkadot.network/docs/en/learn-consensus). In such a scheme, the block finality gadget and the block production mechanism are separate. Consequently, parachains only have to worry about producing blocks and rely on the relay chain to validate the state transitions.

At a parachain level, block producers are called [collators](https://wiki.polkadot.network/docs/en/learn-collator). They maintain parachains (such as Moonbeam)) by collecting transactions from users and offering blocks to the relay chain [validators](https://wiki.polkadot.network/docs/en/learn-validator).

However, parachains might find the following problems they need to solve in a trustless and decentralized matter (if applicable):

 - Amongst all possible collators, how do you find the top N to join the active collators pool? (Where N is a configurable parameter)
 - Amongst all collators in the active pool, how do you select eligible collator(s) for the next block producing slot?

Enter Nimbus. Nimbus is a framework for building slot-based consensus algorithms on [Cumulus](https://github.com/paritytech/cumulus)-based parachains. It strives to provide standard implementations for the logistical parts of such consensus engines and helpful traits for implementing the elements (filters) that researchers and developers want to customize. These filters can be customizable to define what a block authorship slot is and can be composed, so block authorship is restricted to a subset of collators in multiple steps.

For example, Moonbeam uses a two-layer approach. The first layer comprises the parachain staking filter, which helps select an active collator pool among all collator candidates using a staked-based ranking. The second layer adds another filter which narrows down the number of collators to a subset for each slot and block height.

Notice that Nimbus can only answer which collator(s) are eligible to produce a parachain block in the next available slot. It is the [Cumulus](https://wiki.polkadot.network/docs/en/build-cumulus#docsNav) consensus mechanism that marks this parachain block as best, and ultimately the [BABE](https://wiki.polkadot.network/docs/en/learn-consensus#babe) and [GRANDPA](https://wiki.polkadot.network/docs/en/learn-consensus#grandpa-finality-gadget) hybrid consensus model that will include this parachain block in the relay chain and finalize it. Once all relay chain forks are resolved at a relay chain level, that parachain block is deterministically finalized.

The following two sections go over the filtering strategy currently used at Moonbeam.

## Parachain Staking Filtering

Collators can join the candidate pool by simply bonding some tokens via an extrinsic. Once in the pool, token holders can add the collator's stake via nomination (also referred to as staking).

Parachain staking filtering is the first of the two Nimbus filters applied to the collator's candidate pool. It selects the top {{ networks.moonbase.staking.max_collators }} collators in terms of tokens staked in the network, which includes the bond and nominations from token holders. This filtered pool is called the selected candidates, and it is renewed every round (which lasts {{ networks.moonbase.staking.round_blocks }} blocks). For a given round, the following diagram describes the parachain staking filtering:

![Nimbus Parachain Staking Filter](/images/consensus/consensus-images1.png)

From this pool, another filter is applied to retrieve a subset of eligible collators for the next slot.

If you want to learn more about staking, visit our [staking documentation](/staking/overview).

## Fixed Size Subset Filtering

Once the parachain staking filter is applied and the selected collator candidates are retrieved, a second filter helps narrow down the number to a few eligible collators for the next block authoring slot.

In broad terms, this second filter picks a pseudo-random subset of the previously selected candidates. The eligibility ratio, a tunable parameter, defines the size of this subset.

A high eligibility ratio results in fewer chances for the network to skip a block production round, as more collators will be eligible to propose a block for a specific slot. However, only a certain number of validators are assigned to a parachain, meaning that most of these blocks will not be backed by a validator.  For those that are, a higher number of backed blocks means that it might take longer for the relay chain to solve all possible forks and return a finalized block.

A lower eligibility ratio might provide faster block finalization times. However, if the eligible collators are not able to propose a block (for whatever reason), the network will skip a block, affecting its stability.

Once the size of the subset is defined, collators are randomly selected using the relay chain's block height as a source of entropy. Consequently, a new subset of eligible collators is selected for every relay chain block. For a given round and a given block `XYZ`, the following diagram describes the fixed-size subset filtering: 

![Nimbus Parachain Staking Filter](/images/consensus/consensus-images1.png)

## Why Nimbus?

You might ask yourself: but why Nimbus? Initially, it was not envisioned when Moonbeam was being developed. As Moonbeam progressed, the necessity for a more customizable but straightforward parachain consensus mechanism became clear, as the available methods presented some drawbacks. Some of the reasons are listed in the following sections.

<!-- The [AuRa](https://crates.io/crates/sc-consensus-aura) (short for authority-round) consensus mechanism is based on a known list of authorities that take turns to produce blocks in every slot. Each authority can propose only one block per slot and builds on top of the longest chain. Aura is somewhat simplistic but very capable. However, how do you select this list of authorities? -->

### Weight and Extra Execution

Nimbus puts the author-checking execution in a [Substrate pallet](https://substrate.dev/docs/en/knowledgebase/runtime/pallets). At first glance, you might think this adds a higher execution load to a single block compared to doing this check off-chain. But consider this from a perspective of both parachain nodes and validators.

For parachain nodes, this computation will be made. Either way, checking in the runtime does not change the total amount of computation they do. Since the extrinsic that does the checking is an _inherent_, it does not cost any fees, so that number is also unchanged. Consequently, there is not much difference from their perspective.

The validators will also have to check the author either way. The difference is whether they do it in the custom executor or the pallet. By putting the author-checking execution logic in a pallet, the execution time can be benchmarked and quantified with weights. Suppose this logic is not accounted for in the weight system, as is when it goes straight in the executor like in AuRa. In that case, there is the risk of a block exceeding the execution limit (currently 1/2 seconds). This means that the unaccounted author check pushes the total execution time across the threshold.

In practice, this check will be fast and will most likely not push execution time over the limit. But from a theoretical perspective, accounting for its weight is better for implementation purposes.

### Reusability

Another benefit of moving the author-checking execution to a pallet, rather than a custom executor, is that one single executor can be reused for any consensus that can be expressed in the Nimbus framework. That is slot-based, signature-sealed algorithms. 

For example, the [relay-chain provided consensus](https://github.com/paritytech/cumulus/blob/master/client/consensus/relay-chain/src/lib.rs), [AuRa](https://crates.io/crates/sc-consensus-aura) and [BABE](https://crates.io/crates/sc-consensus-babe) have each their own custom executor. With Nimbus, these consensus mechanisms can reuse the same executor. The power of reusability is evidenced by the Nimbus implementation of AuRa in less than 100 lines of code.

### Hot-Swapping Consensus

Teams building parachains may want to change, tune, or adjust their consensus algorithm from time to time. If the author-checking is done off-chain, swapping consensus would require a client upgrade and hard fork.

With the Nimbus framework, writing a consensus engine is as easy as writing a [Substrate pallet](https://substrate.dev/docs/en/knowledgebase/runtime/pallets). Consequently, swapping consensus is as easy as upgrading a pallet. 

Nonetheless, hot swapping is still bounded by consensus engines (filters) that fit within Nimbus, but it might be helpful for teams that are yet confident on what consensus they want to implement in the long run.