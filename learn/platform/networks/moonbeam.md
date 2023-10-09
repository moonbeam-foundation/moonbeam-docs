---
title: Moonbeam Network Overview
description: An overview of the current configuration of the Moonbeam deployment on Polkadot, Moonbeam, and information on how to start building on it using Solidity.
---

# Moonbeam

## Goal {: #goal } 

Moonbeam onboarded as a parachain to Polkadot on December 17th 2021. Moonbeam is the most Ethereum compatible smart-contract parachain in the Polkadot ecosystem. It allows developers to port their projects with minimal to no code changes, enabling them to tap into the Polkadot ecosystem and all its assets.

In order to collect as much feedback as possible and provide fast issue resolution, you can check out the dedicated [Moonbeam Network section on Discord](https://discord.gg/PfpUATX){target=_blank}.

## Initial Configurations {: #initial-configurations } 

Currently, Moonbeam has the following configurations:

- Runs as a parachain connected to the Polkadot relay chain
- Has an active set of {{ networks.moonbeam.staking.max_candidates }} collators
- Has infrastructure providers that provide [API endpoints](/builders/get-started/endpoints/){target=_blank} to connect to the network. Projects can also [run their own node](/node-operators/networks/run-a-node/){target=_blank} to have access to their own private endpoints

![Moonbeam Diagram](/images/learn/platform/networks/moonbeam-diagram.png)

Some important variables/configurations to note include (still subject to change):

=== "General"
    |       Variable        |                                  Value                                  |
    |:---------------------:|:-----------------------------------------------------------------------:|
    |   Minimum gas price   |               {{ networks.moonbeam.min_gas_price }} Gwei*               |
    |   Target block time   |  {{ networks.moonbeam.block_time }} seconds (expected to be 6 seconds)  |
    |    Block gas limit    | {{ networks.moonbeam.gas_block }} (expected to increase by at least 4x) |
    | Transaction gas limit |  {{ networks.moonbeam.gas_tx }} (expected to increase by at least 4x)   |

=== "Staking"
    |             Variable              |                                                  Value                                                  |
    |:---------------------------------:|:-------------------------------------------------------------------------------------------------------:|
    |     Minimum delegation stake      |                           {{ networks.moonbeam.staking.min_del_stake }} GLMR                            |
    | Maximum delegators per candidates |                             {{ networks.moonbeam.staking.max_del_per_can }}                             |
    |  Maximum delegations per account  |                             {{ networks.moonbeam.staking.max_del_per_del }}                             |
    |               Round               | {{ networks.moonbeam.staking.round_blocks }} blocks ({{ networks.moonbeam.staking.round_hours }} hours) |
    |           Bond duration           |               delegation takes effect in the next round (funds are withdrawn immediately)               |
    |          Unbond duration          |                     {{ networks.moonbeam.delegator_timings.del_bond_less.rounds }} rounds                      |

_*Read more about [token denominations](#token-denominations)_

--8<-- 'text/builders/get-started/networks/moonbeam/connect.md'

## Telemetry {: #telemetry } 

You can see current Moonbeam telemetry information by visiting [Polkadot's Telemetry dashboard](https://telemetry.polkadot.io/#list/0xfe58ea77779b7abda7da4ec526d14db9b1e9cd40a217c34892af80a9b332b76d){target=_blank}.

## Tokens {: #tokens } 

The tokens on Moonbeam are called Glimmer (GLMR). Check out the Moonbeam Foundation site for more information on the [Glimmer](https://moonbeam.foundation/glimmer-token/){target=_blank} token. 

### Token Denominations {: #token-denominations } 

The smallest unit of Glimmer (GMLR), similarly to Ethereum, is a Wei. It takes 10^18 Wei to make one Glimmer. The denominations are as follows:

|   Unit    |    Glimmer (GLMR)    |              Wei              |
|:---------:|:--------------------:|:-----------------------------:|
|    Wei    | 0.000000000000000001 |               1               |
|  Kilowei  |  0.000000000000001   |             1,000             |
|  Megawei  |    0.000000000001    |           1,000,000           |
|  Gigawei  |     0.000000001      |         1,000,000,000         |
| Microglmr |       0.000001       |       1,000,000,000,000       |
| Milliglmr |        0.001         |     1,000,000,000,000,000     |
|   GLMR    |          1           |   1,000,000,000,000,000,000   |
| Kiloglmr  |        1,000         | 1,000,000,000,000,000,000,000 |

## Proof of Stake {: #proof-of-stake } 

The Moonriver network is a fully decentralized Delegated Proof of Stake network where users of the network can delegate collator candidates to produce blocks and earn rewards. It uses the [Nimbus framework](/learn/features/consensus/){target=_blank} framework for parachain consensus. The number of candidates in the active set will be subject to governance. The active set will consist of the top candidates by stake, including delegations. 

## Limitations {: #limitations } 

Some [precompiles](https://docs.klaytn.com/smart-contract/precompiled-contracts){target=_blank} are yet to be included. You can check a list of supported precompiles on the [Solidity Precompiles page](/builders/pallets-precompiles/precompiles/overview/){target=_blank}. However, all built-in functions are available.

