---
title: Moonbase Alpha TestNet Overview
description: An overview of the current configuration of the Moonbeam TestNet, Moonbase Alpha, and information on how to start building on it using Solidity.
---

# The Moonbase Alpha TestNet

_Updated May 26th, 2022_

!!! note
    With the release of [Moonbase Alpha v8](https://github.com/PureStake/moonbeam/releases/tag/v0.8.0){target=_blank}, the minimum gas price has been set to 1 GDEV (similar to GWei on Ethereum). This might be a breaking change if you've previously specified a gas price of `0` for your deployment.

## Goal {: #goal } 

The first Moonbeam TestNet, named Moonbase Alpha, aims to provide developers with a place to start experimenting and building on Moonbeam in a shared environment. Since Moonbeam is deployed as a parachain on Kusama and Polkadot, the goal of the TestNet is to reflect the production configurations. For this reason, it was decided that it needed to be a parachain-based configuration rather than a Substrate development setup.

In order to collect as much feedback as possible and provide fast issue resolution, please join the [Moonbeam Discord](https://discord.gg/PfpUATX){target=_blank}.

## Initial Configuration {: #initial-configuration } 

Moonbase Alpha has the following configuration:

 - Runs as a parachain connected to a relay chain
 - Has an active set of {{ networks.moonbase.staking.max_candidates }} collator nodes, including some run by PureStake
 - The relay chain hosts validators run by PureStake to finalize relay chain blocks. One of them is selected to finalize each block collated by Moonbeam's collators. This setup provides room to expand to a two-parachain configuration in the future
 - Has infrastructure providers that provide [API endpoints](/builders/get-started/endpoints/){target=_blank} to connect to the network. Projects can also [run their own node](/node-operators/networks/run-a-node/){target=_blank} to have access to their own private endpoints

![TestNet Diagram](/images/learn/platform/networks/moonbase-diagram-v7.png)

Some important variables/configurations to note include:

=== "General"
    |       Variable        |                                  Value                                  |
    |:---------------------:|:-----------------------------------------------------------------------:|
    |   Minimum gas price   |               {{ networks.moonbase.min_gas_price }} Gwei                |
    |   Target block time   |  {{ networks.moonbase.block_time }} seconds (expected to be 6 seconds)  |
    |    Block gas limit    | {{ networks.moonbase.gas_block }} (expected to increase by at least 4x) |
    | Transaction gas limit |  {{ networks.moonbase.gas_tx }} (expected to increase by at least 4x)   |

=== "Governance"
    |         Variable         |                                                            Value                                                             |
    |:------------------------:|:----------------------------------------------------------------------------------------------------------------------------:|
    |      Voting period       |      {{ networks.moonbase.democracy.vote_period.blocks}} blocks ({{networks.moonbase.democracy.vote_period.days}} days)      |
    | Fast-track voting period | {{ networks.moonbase.democracy.fast_vote_period.blocks}} blocks ({{networks.moonbase.democracy.fast_vote_period.days}} days) |
    |     Enactment period     |     {{ networks.moonbase.democracy.enact_period.blocks}} blocks ({{networks.moonbase.democracy.enact_period.days}} day)      |
    |     Cool-off period      |      {{ networks.moonbase.democracy.cool_period.blocks}} blocks ({{networks.moonbase.democracy.cool_period.days}} days)      |
    |     Minimum deposit      |                                      {{ networks.moonbase.democracy.min_deposit }} DEV                                       |
    |      Maximum votes       |                                         {{ networks.moonbase.democracy.max_votes }}                                          |
    |    Maximum proposals     |                                       {{ networks.moonbase.democracy.max_proposals }}                                        |

=== "Staking"
    |             Variable              |                                                  Value                                                  |
    |:---------------------------------:|:-------------------------------------------------------------------------------------------------------:|
    |     Minimum delegation stake      |                            {{ networks.moonbase.staking.min_del_stake }} DEV                            |
    | Maximum delegators per candidates |                             {{ networks.moonbase.staking.max_del_per_can }}                             |
    |  Maximum delegations per account  |                             {{ networks.moonbase.staking.max_del_per_del }}                             |
    |               Round               | {{ networks.moonbase.staking.round_blocks }} blocks ({{ networks.moonbase.staking.round_hours }} hours) |
    |           Bond duration           |               delegation takes effect in the next round (funds are withdrawn immediately)               |
    |          Unbond duration          |                  {{ networks.moonbase.delegator_timings.del_bond_less.rounds }} rounds                  |

--8<-- 'text/testnet/connect.md'

## Telemetry {: #telemetry } 

You can see current Moonbase Alpha telemetry information by visiting [Polkadot's Telemetry dashboard](https://telemetry.polkadot.io/#list/0x91bc6e169807aaa54802737e1c504b2577d4fafedd5a02c10293b1cd60e39527){target=_blank}.

## Tokens {: #tokens } 

Tokens on Moonbase Alpha, named DEV, will be issued on demand. **DEV tokens hold no value and can be freely acquired**. Currently, there are a few ways you can get access to this token: through the Moonbase Alpha Faucet, a Discord bot, or manually.

### Moonbase Alpha Faucet {: #moonbase-alpha-faucet }

You can enter your address to automatically request DEV tokens from the [Moonbase Alpha Faucet](https://apps.moonbeam.network/moonbase-alpha/faucet/){target=_blank} website. The faucet dispenses {{ networks.moonbase.website_faucet_amount }} every 24 hours.

### Discord - Mission Control {: #discord-mission-control } 

To [request tokens](/builders/get-started/networks/moonbase/#get-tokens/){target=_blank} automatically, we've created a Discord bot (named Mission Control :sunglasses:) that will automatically send a maximum of {{ networks.moonbase.discord_faucet_amount }} every 24 hours (per Discord user) when you enter your address. You can check it out on our [Discord channel](https://discord.gg/PfpUATX).
 
!!! note
    The Discord faucet will be deprecated by end of June 2022.

Under the category **Miscellaneous**, you will find the **#moonbase-faucet** channel. Enter the following message, replacing `<enter-address-here>` with your H160 address:
 
```
!faucet send <enter-address-here>
```

### Manual Procedure {: #manual-procedure } 

For token requests of more than the limited account allowed by our Discord bot, contact a moderator directly via the [Moonbeam Discord server](https://discord.gg/PfpUATX){target=_blank}. We are happy to provide the tokens needed to test your applications.

## Proof of Stake {: #proof-of-stake } 

The Moonbase Alpha TestNet is a fully decentralized Delegated Proof of Stake network where users of the network can delegate collator candidates to produce blocks and "earn rewards" for testing purposes. Please note, that the Moonbase Alpha DEV tokens have no real value. The number of candidates in the active set will be subject to governance. The active set will consist of the top candidates by stake, including delegations.

## Limitations {: #limitations } 

This is the first TestNet for Moonbeam, so there are some limitations.

Some [precompiles](https://docs.klaytn.com/smart-contract/precompiled-contracts){target=_blank} are yet to be included. You can check out the list of supported precompiles on the [Canonical Contract page](/builders/build/canonical-contracts/precompiles/){target=_blank}. However, all built-in functions are available.

Since the release of Moonbase Alpha v6, the maximum gas limit per block has been set to {{ networks.moonbase.gas_block }}, with a maximum gas limit per transaction of {{ networks.moonbase.gas_tx }}.