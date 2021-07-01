---
title: Moonriver
description: An overview of the current configuration of the Moonbeam deployment on Kusama, Moonriver, and information on how to start building on it using Solidity.
---

# Moonriver

_Updated June 30th, 2021_

## Goal

In June 2021, Moonriver first launched as a parachain on the Kusama network. Moonriver is a sister network of Moonbeam, and provides an environment to test new code under real economic conditions. Developers now have access to start experimenting and building on an incentivized canary network connected to Kusama. 

In order to collect as much feedback as possible and provide fast issue resolution, we have set up a [Discord with a dedicated Moonriver channel](https://discord.gg/5TaUvbRvgM).

## Initial Configurations

Moonriver is scheduled to follow a [5-phase launch process](https://moonbeam.network/networks/moonriver/launch/). At the end of the 5 phases, Moonriver will have the following configurations:

 - Moonriver runs as a parachain connected to the Kusama relay chain.
 - The parachain has an active set of {{ networks.moonriver.staking.initial_collators }} (or more) collators that are collating blocks. The active set is made up of the top collator nodes by stake. The number of collators in the active set is subject to governance. 
 - The Kusama relay chain finalizes relay chain blocks.
 - There are two RPC endpoints (hosted by PureStake). People can run full nodes to access their own private RPC endpoints.

![Moonriver Diagram](/images/moonriver/moonriver-diagram.png)

Currently, you can expect the following network configurations:

| Variable              | Value                                       |
|-----------------------|---------------------------------------------|
| Minimum gas price     | {{ networks.moonriver.min_gas_price }} gsed |
| Block time            | {{ networks.moonriver.block_time }} seconds |
| Block gas limit       | {{ networks.moonriver.gas_block }}          |
| Transaction gas limit | {{ networks.moonriver.gas_tx }}             |
| RPC endpoint          | {{ networks.moonriver.rpc_url }}            |
| WSS endpoint          | {{ networks.moonriver.wss_url }}            |

Some network configurations will change and improve over time, such as the block time, block gas limit, and transaction gas limit. 

## Get Started

--8<-- 'text/moonriver/connect.md'

## Telemetry

You can see current Moonriver telemetry information visiting [this link](https://telemetry.polkadot.io/#list/Moonriver).

## Tokens

The tokens on Moonriver will also be called Moonriver (MOVR). Check out the Moonbeam Foundation for more information on the [Moonriver token](https://moonbeam.foundation/moonriver-token/). 

### Token Denominations

The smallest unit of Moonriver is called a Sediment. It takes 10^18 Sediment to make one Moonriver. The denominations are as follows:

| Unit         | Moonriver            | Sediment                      |
|--------------|----------------------|-------------------------------|
| Sediment     | 0.000000000000000001 | 1                             |
| Kilosediment | 0.000000000000001    | 1,000                         |
| Megasediment | 0.000000000001       | 1,000,000                     |
| Gigasediment | 0.000000001          | 1,000,000,000                 |
| Micromovr    | 0.000001             | 1,000,000,000,000             |
| Millimovr    | 0.001                | 1,000,000,000,000,000         |
| Movr         | 1                    | 1,000,000,000,000,000,000     |
| Kilomovr     | 1,000                | 1,000,000,000,000,000,000,000 |


## Proof of Stake

Over the course of the Moonriver launch, the network will progressively be updated to a fully decentralized Proof of Stake network.

There will be an initial collator election and the active collator set will start at {{ networks.moonriver.staking.initial_collators }} collators. Once governance is enabled in [Phase 2](https://moonbeam.network/networks/moonriver/launch/), the number of collators in the active set will be subject to governance. The active set will consist of the top collators by stake, including nominations.

## Limitations

Some [precompiles](https://docs.klaytn.com/smart-contract/precompiled-contracts) are yet to be included. You can check a list of supported precompiles [here](/integrations/precompiles/). However, all built-in functions are available.

