---
title: Moonriver Overview
description: An overview of the current configuration of the Moonbeam deployment on Kusama, Moonriver, and information on how to start building on it using Solidity.
---

# Moonriver

## Goal {: #goal }

In June 2021, Moonriver first launched as a parachain on the Kusama network. Moonriver is a sister network of Moonbeam, and provides an environment to test new code under real economic conditions. Developers now have access to start experimenting and building on an incentivized canary network connected to Kusama.

In order to collect as much feedback as possible and provide fast issue resolution, you can check out the dedicated [Moonriver section on Discord](https://discord.com/invite/5TaUvbRvgM){target=\_blank}.

## Initial Configurations {: #initial-configurations }

Currently, Moonriver has the following configurations:

- Runs as a parachain connected to the Kusama relay chain
- Has an active set of {{ networks.moonriver.staking.max_candidates }} collators
- Has infrastructure providers that provide [API endpoints](/builders/get-started/endpoints/){target=\_blank} to connect to the network. Projects can also [run their own node](/node-operators/networks/run-a-node/){target=\_blank} to have access to their own private endpoints

![Moonriver Diagram](/images/learn/platform/networks/moonriver-diagram.webp)

Some important variables/configurations to note include:

=== "General"
    |       Variable        |                    Value                     |
    |:---------------------:|:--------------------------------------------:|
    |   Minimum gas price   | {{ networks.moonriver.min_gas_price }} Gwei* |
    |   Target block time   | {{ networks.moonriver.block_time }} seconds  |
    |    Block gas limit    |      {{ networks.moonriver.gas_block }}      |
    | Transaction gas limit |       {{ networks.moonriver.gas_tx }}        |

=== "Staking"
    |             Variable              |                                                   Value                                                   |
    |:---------------------------------:|:---------------------------------------------------------------------------------------------------------:|
    |     Minimum delegation stake      |                            {{ networks.moonriver.staking.min_del_stake }} MOVR                            |
    | Maximum delegators per candidates |                             {{ networks.moonriver.staking.max_del_per_can }}                              |
    |  Maximum delegations per account  |                             {{ networks.moonriver.staking.max_del_per_del }}                              |
    |               Round               | {{ networks.moonriver.staking.round_blocks }} blocks ({{ networks.moonriver.staking.round_hours }} hours) |
    |           Bond duration           |                delegation takes effect in the next round (funds are withdrawn immediately)                |
    |          Unbond duration          |                  {{ networks.moonriver.delegator_timings.del_bond_less.rounds }} rounds                   |

_*Read more about [token denominations](#token-denominations)_

--8<-- 'text/_common/async-backing.md'

    Additionally, the block and transaction gas limits increased by 4x on Moonriver.

--8<-- 'text/builders/get-started/networks/moonriver/connect.md'

## Telemetry {: #telemetry }

You can see current Moonriver telemetry information by visiting [Polkadot's Telemetry dashboard](https://telemetry.polkadot.io/#list/0x401a1f9dca3da46f5c4091016c8a2f26dcea05865116b286f60f668207d1474b){target=\_blank}.

## Tokens {: #tokens }

The tokens on Moonriver will also be called Moonriver (MOVR). Check out the Moonbeam Foundation site for more information on the [Moonriver token](https://moonbeam.network/moonriver-token-tokenomics){target=\_blank}.

### Token Denominations {: #token-denominations }

The smallest unit of Moonriver, similarly to Ethereum, is a Wei. It takes 10^18 Wei to make one Moonriver. The denominations are as follows:

|      Unit      |   Moonriver (MOVR)   |              Wei              |
|:--------------:|:--------------------:|:-----------------------------:|
|      Wei       | 0.000000000000000001 |               1               |
|    Kilowei     |  0.000000000000001   |             1,000             |
|    Megawei     |    0.000000000001    |           1,000,000           |
|    Gigawei     |     0.000000001      |         1,000,000,000         |
| Micromoonriver |       0.000001       |       1,000,000,000,000       |
| Millimoonriver |        0.001         |     1,000,000,000,000,000     |
|   Moonriver    |          1           |   1,000,000,000,000,000,000   |
| Kilomoonriver  |        1,000         | 1,000,000,000,000,000,000,000 |

## Proof of Stake {: #proof-of-stake }

The Moonriver network is a fully decentralized Delegated Proof of Stake network where users of the network can delegate collator candidates to produce blocks and earn rewards. It uses the [Nimbus framework](/learn/features/consensus/){target=\_blank} framework for parachain consensus. The number of candidates in the active set will be subject to governance. The active set will consist of the top candidates by stake, including delegations.

## Limitations {: #limitations }

Some [precompiles](https://www.evm.codes/precompiled){target=\_blank} are yet to be included. You can check a list of supported precompiles on the [Canonical Contract page](/builders/ethereum/precompiles/){target=\_blank}. However, all built-in functions are available.
