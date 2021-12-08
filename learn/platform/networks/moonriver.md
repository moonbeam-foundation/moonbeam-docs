---
title: Moonriver
description: An overview of the current configuration of the Moonbeam deployment on Kusama, Moonriver, and information on how to start building on it using Solidity.
---

# Moonriver

_Updated August 5th, 2021_

## Goal {: #goal } 

In June 2021, Moonriver first launched as a parachain on the Kusama network. Moonriver is a sister network of Moonbeam, and provides an environment to test new code under real economic conditions. Developers now have access to start experimenting and building on an incentivized canary network connected to Kusama. 

In order to collect as much feedback as possible and provide fast issue resolution, we have set up a [Discord with a dedicated Moonriver channel](https://discord.gg/5TaUvbRvgM).

## Initial Configurations {: #initial-configurations } 

Currently, Moonriver has the following configurations:

- Runs as a parachain connected to the Kusama relay chain
- Has an active set of {{ networks.moonriver.staking.max_collators }} collators
- It has infrastructure providers that provide [API endpoints](/builders/get-started/endpoints/) to connect to the network. Projecs can also [run their own node](/node-operators/networks/run-a-node/) to have access to their own private endpoints

![Moonriver Diagram](/images/learn/platform/networks/moonriver-diagram.png)

Some important variables/configurations to note include:

=== "General"
    |       Variable        |                                    Value                                     |
    |:---------------------:|:----------------------------------------------------------------------------:|
    |   Minimum gas price   |                 {{ networks.moonriver.min_gas_price }} Gwei*                 |
    |   Target block time   |  {{ networks.moonriver.block_time }} seconds (expected to be 6     seconds)  |
    |    Block gas limit    | {{ networks.moonriver.gas_block }} (expected to increase by at     least 4x) |
    | Transaction gas limit |  {{ networks.moonriver.gas_tx }} (expected to increase by at     least 4x)   |
    |     RPC endpoint      |                    {{ networks.moonriver.rpc_url }}  |
    |     WSS endpoint      |                       {{ networks.moonriver.wss_url }}                       |

=== "Governance"
    |         Variable         |                                                             Value                                                              |
    |:------------------------:|:------------------------------------------------------------------------------------------------------------------------------:|
    |      Voting Period       |      {{ networks.moonriver.democracy.vote_period.blocks}} blocks ({{networks.moonriver.democracy.vote_period.days}} days)      |
    | Fast-Track Voting Period | {{ networks.moonriver.democracy.fast_vote_period.blocks}} blocks ({{networks.moonriver.democracy.fast_vote_period.days}} days) |
    |     Enactment Period     |     {{ networks.moonriver.democracy.enact_period.blocks}} blocks ({{networks.moonriver.democracy.enact_period.days}} day)      |
    |     Cool-off Period      |      {{ networks.moonriver.democracy.cool_period.blocks}} blocks ({{networks.moonriver.democracy.cool_period.days}} days)      |
    |     Minimum Deposit      |                                    {{ networks.moonriver.democracy.    min_deposit }} MOVR                                     |
    |      Maximum Votes       |                                        {{ networks.moonriver.    democracy.max_votes }}                                        |
    |    Maximum Proposals     |                                      {{ networks.moonriver.democracy.    max_proposals }}                                      |

=== "Staking"
    |             Variable             |                                                     Value                                                     |
    |:--------------------------------:|:-------------------------------------------------------------------------------------------------------------:|
    |     Minimum nomination stake     |                           {{ networks.moonriver.staking.    min_nom_stake }} tokens                           |
    | Maximum nominators per collators |                             {{ networks.moonriver.staking.    max_nom_per_col }}                              |
    | Maximum collators per nominator  |                             {{ networks.moonriver.staking.    max_col_per_nom }}                              |
    |              Round               | {{ networks.moonriver.staking.round_blocks }} blocks ({{     networks.moonriver.staking.round_hours }} hours) |
    |          Bond duration           |                             {{ networks.moonriver.staking.    bond_lock }} rounds                             |

_*Read more about [token denominations](#token-denominations)_

--8<-- 'text/moonriver/connect.md'

## Telemetry {: #telemetry } 

You can see current Moonriver telemetry information visiting [this link](https://telemetry.polkadot.io/#list/Moonriver).

## Tokens {: #tokens } 

The tokens on Moonriver will also be called Moonriver (MOVR). Check out the Moonbeam Foundation site for more information on the [Moonriver token](https://moonbeam.foundation/moonriver-token/). 

### Token Denominations {: #token-denominations } 

The smallest unit of Moonriver, similarly to Ethereum, is a Wei. It takes 10^18 Wei to make one Moonriver. The denominations are as follows:

| Unit             | Moonriver (MOVR)       | Wei                             |
|------------------|------------------------|---------------------------------|
| :--------------: | :--------------------: | :-----------------------------: |
| Wei              | 0.000000000000000001   | 1                               |
| Kilowei          | 0.000000000000001      | 1,000                           |
| Megawei          | 0.000000000001         | 1,000,000                       |
| Gigawei          | 0.000000001            | 1,000,000,000                   |
| Micromoonriver   | 0.000001               | 1,000,000,000,000               |
| Millimoonriver   | 0.001                  | 1,000,000,000,000,000           |
| Moonriver        | 1                      | 1,000,000,000,000,000,000       |
| Kilomoonriver    | 1,000                  | 1,000,000,000,000,000,000,000   |

## Proof of Stake {: #proof-of-stake } 

TODO -> Add what Erin writes about this

## Limitations {: #limitations } 

Some [precompiles](https://docs.klaytn.com/smart-contract/precompiled-contracts) are yet to be included. You can check a list of supported precompiles [here](/builders/tools/precompiles/). However, all built-in functions are available.

