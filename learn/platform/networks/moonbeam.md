---
title: Moonbeam
description: An overview of the current configuration of the Moonbeam deployment on Polkadot, Moonbeam, and information on how to start building on it using Solidity.
---

# Moonbeam

_Updated December 12th, 2021_

## Goal {: #goal } 

Moonbeam is expected to be onboarded as a parachain to Moonbeam on December 17th 2021. Moonbeam is the most Ethereum compatible smart-contract parachain in the Polkadot ecosystem. It allows developers to port their projects with minimal to no code changes, enabling them to tap into the Polkadot ecosystem and all its assets.

## Initial Configurations {: #initial-configurations } 

Moonbeam is scheduled to follow a [3-phase launch process](https://moonbeam.network/networks/moonbeam/launch/). Currently, Moonbeam is not yet launched, but it is expected to have the following configuration.

![Moonbeam Diagram](/images/learn/platform/networks/moonbeam-diagram.png)

Some important variables/configurations to note include:

=== "General"
    |       Variable        |                                    Value                                     |
    |:---------------------:|:----------------------------------------------------------------------------:|
    |   Minimum gas price   |                 {{ networks.moonbeam.min_gas_price }} Gwei*                 |
    |   Target block time   |  {{ networks.moonbeam.block_time }} seconds (expected to be 6     seconds)  |
    |    Block gas limit    | {{ networks.moonbeam.gas_block }} (expected to increase by at     least 4x) |
    | Transaction gas limit |  {{ networks.moonbeam.gas_tx }} (expected to increase by at     least 4x)   |
    |     RPC endpoint      |                    {{ networks.moonbeam.rpc_url }}    }                     |
    |     WSS endpoint      |                       {{ networks.moonbeam.wss_url }}                       |

=== "Governance"
    |         Variable         |                                                             Value                                                              |
    |:------------------------:|:------------------------------------------------------------------------------------------------------------------------------:|
    |      Voting Period       |      {{ networks.moonbeam.democracy.vote_period.blocks}} blocks ({{networks.moonbeam.democracy.vote_period.days}} days)      |
    | Fast-Track Voting Period | {{ networks.moonbeam.democracy.fast_vote_period.blocks}} blocks ({{networks.moonbeam.democracy.fast_vote_period.days}} days) |
    |     Enactment Period     |     {{ networks.moonbeam.democracy.enact_period.blocks}} blocks ({{networks.moonbeam.democracy.enact_period.days}} day)      |
    |     Cool-off Period      |      {{ networks.moonbeam.democracy.cool_period.blocks}} blocks ({{networks.moonbeam.democracy.cool_period.days}} days)      |
    |     Minimum Deposit      |                                    {{ networks.moonbeam.democracy.    min_deposit }} MOVR                                     |
    |      Maximum Votes       |                                        {{ networks.moonbeam.    democracy.max_votes }}                                        |
    |    Maximum Proposals     |                                      {{ networks.moonbeam.democracy.    max_proposals }}                                      |

=== "Staking"
    |             Variable             |                                                     Value                                                     |
    |:--------------------------------:|:-------------------------------------------------------------------------------------------------------------:|
    |     Minimum nomination stake     |                           {{ networks.moonbeam.staking.    min_nom_stake }} tokens                           |
    | Maximum nominators per collators |                             {{ networks.moonbeam.staking.    max_nom_per_col }}                              |
    | Maximum collators per nominator  |                             {{ networks.moonbeam.staking.    max_col_per_nom }}                              |
    |              Round               | {{ networks.moonbeam.staking.round_blocks }} blocks ({{     networks.moonbeam.staking.round_hours }} hours) |
    |          Bond duration           |                             {{ networks.moonbeam.staking.    bond_lock }} rounds                             |

_*Read more about [token denominations](#token-denominations)_

--8<-- 'text/moonbeam/connect.md'

## Telemetry {: #telemetry } 

You can see current Moonbeam telemetry information visiting [this link](https://telemetry.polkadot.io/#list/Moonbeam).

## Tokens {: #tokens } 

The tokens on Moonbeam will also be called Glimmer (GLMR). Check out the Moonbeam Foundation site for more information on the [Glimmer](https://moonbeam.foundation/glimmer-token/). 

### Token Denominations {: #token-denominations } 

The smallest unit of Glimmer (GMLR), similarly to Ethereum, is a Wei. It takes 10^18 Wei to make one Glimmer. The denominations are as follows:

|      Unit      |   Glimmer (GLMR)   |              Wei              |
|:--------------:|:--------------------:|:-----------------------------:|
|      Wei       | 0.000000000000000001 |               1               |
|    Kilowei     |  0.000000000000001   |             1,000             |
|    Megawei     |    0.000000000001    |           1,000,000           |
|    Gigawei     |     0.000000001      |         1,000,000,000         |
| Microglmr |       0.000001       |       1,000,000,000,000       |
| Milliglmr |        0.001         |     1,000,000,000,000,000     |
|   GLMR    |          1           |   1,000,000,000,000,000,000   |
| Kiloglmr  |        1,000         | 1,000,000,000,000,000,000,000 |

## Proof of Stake {: #proof-of-stake } 

Over the course of the 3-phase Moonbean launch, the network will progressively be updated to a fully decentralized Proof of Stake network. For a breakdown of what will occur during each phase, check out the [Network Launch Status](https://moonbeam.network/networks/moonbeam/launch/) page.

## Limitations {: #limitations } 

Some [precompiles](https://docs.klaytn.com/smart-contract/precompiled-contracts) are yet to be included. You can check a list of supported precompiles [here](/builders/tools/precompiles/). However, all built-in functions are available.

