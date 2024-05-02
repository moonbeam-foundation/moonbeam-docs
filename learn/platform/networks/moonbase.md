---
title: Moonbase Alpha TestNet Overview
description: An overview of the current configuration of the Moonbeam TestNet, Moonbase Alpha, and information on how to start building on it using Solidity.
---

# The Moonbase Alpha TestNet

## Goal {: #goal }

The first Moonbeam TestNet, named Moonbase Alpha, aims to provide developers with a place to start experimenting and building on Moonbeam in a shared environment. Since Moonbeam is deployed as a parachain on Kusama and Polkadot, the goal of the TestNet is to reflect the production configurations. For this reason, it was decided that it needed to be a parachain-based configuration rather than a Substrate development setup.

In order to collect as much feedback as possible and provide fast issue resolution, please join the [Moonbeam Discord](https://discord.gg/PfpUATX/){target=\_blank}.

## Initial Configuration {: #initial-configuration }

Moonbase Alpha has the following configuration:

 - Runs as a parachain connected to a relay chain
 - Has an active set of {{ networks.moonbase.staking.max_candidates }} collator nodes run by the community
 - The relay chain hosts validators to finalize relay chain blocks. One of them is selected to finalize each block collated by Moonbeam's collators. This setup provides room to expand to a two-parachain configuration in the future
 - Has infrastructure providers that provide [API endpoints](/builders/get-started/endpoints/){target=\_blank} to connect to the network. Projects can also [run their own node](/node-operators/networks/run-a-node/){target=\_blank} to have access to their own private endpoints

![TestNet Diagram](/images/learn/platform/networks/moonbase-diagram.webp)

Some important variables/configurations to note include:

=== "General"
    |       Variable        |                   Value                    |
    |:---------------------:|:------------------------------------------:|
    |   Minimum gas price   | {{ networks.moonbase.min_gas_price }} Gwei |
    |   Target block time   | {{ networks.moonbase.block_time }} seconds |
    |    Block gas limit    |     {{ networks.moonbase.gas_block }}      |
    | Transaction gas limit |       {{ networks.moonbase.gas_tx }}       |

=== "Staking"
    |             Variable              |                                                                    Value                                                                    |
    |:---------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------:|
    |     Minimum delegation stake      |                                              {{ networks.moonbase.staking.min_del_stake }} DEV                                              |
    | Maximum delegators per candidates |                                               {{ networks.moonbase.staking.max_del_per_can }}                                               |
    |  Maximum delegations per account  |                                               {{ networks.moonbase.staking.max_del_per_del }}                                               |
    |               Round               |                   {{ networks.moonbase.staking.round_blocks }} blocks ({{ networks.moonbase.staking.round_hours }} hour)                    |
    |           Bond duration           |                                 delegation takes effect in the next round (funds are withdrawn immediately)                                 |
    |          Unbond duration          | {{ networks.moonbase.delegator_timings.del_bond_less.rounds }} rounds ({{ networks.moonbase.delegator_timings.del_bond_less.hours }} hours) |

--8<-- 'text/_common/async-backing-moonbase.md'
    
    Additionally, as of runtime 2900, the block and transaction gas limits increased by 4x on Moonbase Alpha.

--8<-- 'text/builders/get-started/networks/moonbase/connect.md'

## Alphanet Relay Chain {: #relay-chain }

The Alphanet relay chain is connected to Moonbase Alpha and is [Westend](https://polkadot.network/blog/westend-introducing-a-new-testnet-for-polkadot-and-kusama/){target=\_blank}-based but unique to the Moonbeam ecosystem. It resembles how you would interact with Kusama or Polkadot. The native tokens of the Alphanet relay chain are UNIT tokens, which are for testing purposes only and have no real value.

## Telemetry {: #telemetry }

You can see current Moonbase Alpha telemetry information by visiting [Polkadot's Telemetry dashboard](https://telemetry.polkadot.io/#list/0x91bc6e169807aaa54802737e1c504b2577d4fafedd5a02c10293b1cd60e39527/){target=\_blank}.

## Tokens {: #tokens }

Tokens on Moonbase Alpha, named DEV, will be issued on demand. **DEV tokens hold no value and can be freely acquired**.

You can enter your address to automatically request DEV tokens from the [Moonbase Alpha Faucet](https://faucet.moonbeam.network/){target=\_blank} website. The faucet dispenses {{ networks.moonbase.website_faucet_amount }} every 24 hours.

For token requests of more than the limited amount allowed by the faucet, contact a moderator directly via the [Moonbeam Discord server](https://discord.gg/PfpUATX/){target=\_blank}. We are happy to provide the tokens needed to test your applications.

## Proof of Stake {: #proof-of-stake }

The Moonbase Alpha TestNet is a fully decentralized Delegated Proof of Stake network where users of the network can delegate collator candidates to produce blocks and "earn rewards" for testing purposes. Please note, that the Moonbase Alpha DEV tokens have no real value. The number of candidates in the active set will be subject to governance. The active set will consist of the top candidates by stake, including delegations.

## Limitations {: #limitations }

This is the first TestNet for Moonbeam, so there are some limitations.

Some [precompiles](https://docs.klaytn.com/smart-contract/precompiled-contracts/){target=\_blank} are yet to be included. You can check out the list of supported precompiles on the [Canonical Contract page](/builders/pallets-precompiles/precompiles/){target=\_blank}. However, all built-in functions are available.

Since the release of Moonbase Alpha v6, the maximum gas limit per block has been set to {{ networks.moonbase.gas_block }}, with a maximum gas limit per transaction of {{ networks.moonbase.gas_tx }}.