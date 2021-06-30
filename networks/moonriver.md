---
title: Moonriver
description: An overview of the current configuration of the Moonbeam deployment on Kusama, Moonriver, and information on how to start building on it using Solidity.
---

# Moonriver

_Updated June 30th, 2021_

## Goal

In June 2021, Moonriver first launched as a parachain on the Kusama network. Moonriver is a sister network of Moonbeam, and provides an environment to test new code under real economic conditions. Developers now have access to start experimenting and building on an incentivized canary network connected to Kusama. 

In order to collect as much feedback as possible and provide fast issue resolution, we have set up a [Discord with a dedicated Moonriver channel](https://discord.gg/5TaUvbRvgM).

## Initial Configuration

Moonriver is scheduled to follow a [5-phase launch process](https://moonbeam.network/networks/moonriver/launch/). At the end of the 5 phases, Moonriver will have the following configurations:

 - Moonriver runs as a parachain connected to the Kusama relay chain (Phase 0)
 - The parachain has an active set of {{ networks.moonriver.staking.initial_collators }} (or more) collators that are collating blocks. The active set is made up of the top collator nodes by stake. The number of collators in the active set is subject to governance. 
 - The Kusama relay chain finalizes relay chain blocks.
 - There are two RPC endpoints (hosted by PureStake). People can run full nodes to access their own private RPC endpoints

![Moonriver Diagram](/images/moonriver/moonriver-diagram.png)

## Features

### Release Notes

For more details regarding the updates of Moonriver, please refer to the following release notes:

 - [Moonriver Genesis](https://github.com/PureStake/moonbeam/releases/tag/moonriver-genesis)

## Get Started

--8<-- 'text/moonriver/connect.md'

## Telemetry

You can see current Moonriver telemetry information visiting [this link](https://telemetry.polkadot.io/#list/Moonriver).

## Tokens

The tokens on Moonriver will also be called Moonriver (MOVR). Check out the Moonbeam Foundation for more information on the [Moonriver token](https://moonbeam.foundation/moonriver-token/).

## Proof of Stake

Over the course of the Moonriver launch, the network will progressively be updated to a fully decentralized Proof of Stake network.

There will be an initial collator election and the active collator set will start at {{ networks.moonriver.staking.initial_collators }} collators. Once governance is enabled in [Phase 2](https://moonbeam.network/networks/moonriver/launch/), the number of collators in the active set will be subject to governance. The active set will consist of the top collators by stake, including nominations.

## Limitations

Some [precompiles](https://docs.klaytn.com/smart-contract/precompiled-contracts) are yet to be included. You can check a list of supported precompiles [here](/integrations/precompiles/). However, all built-in functions are available.

Since the launch of Moonriver, the maximum gas limit per block has been set to {{ networks.moonriver.gas_block }}, with a maximum gas limit per transaction of {{ networks.moonriver.gas_tx }}.

