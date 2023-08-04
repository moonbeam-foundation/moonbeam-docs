---
title: Solidity Precompiles
description: An overview of the available Solidity precompiles on Moonbeam. Precompiles enable you to interact with Substrate features using the Ethereum API.
---

# Overview of the Precompiled Contracts on Moonbeam

![Precompiled Contracts Banner](/images/builders/pallets-precompiles/precompiles/overview/overview-banner.png)

## Overview {: #introduction }

On Moonbeam, a precompiled contract is native Substrate code that has an Ethereum-style address and can be called using the Ethereum API, like any other smart contract. The precompiles allow you to call the Substrate runtime directly which is not normally accessible from the Ethereum side of Moonbeam.

The Substrate code responsible for implementing precompiles can be found in the [EVM pallet](/learn/features/eth-compatibility/#evm-pallet){target=_blank}. The EVM pallet includes the [standard precompiles found on Ethereum and some additional precompiles that are not specific to Ethereum](https://github.com/paritytech/frontier/tree/master/frame/evm/precompile){target=_blank}. It also provides the ability to create and execute custom precompiles through the generic [`Precompiles` trait](https://paritytech.github.io/frontier/rustdocs/pallet_evm/trait.Precompile.html){target=_blank}. There are several custom Moonbeam-specific precompiles that have been created, all of which can be found in the [Moonbeam codebase](https://github.com/moonbeam-foundation/moonbeam/tree/master/precompiles){target=_blank}.

The Ethereum precompiled contracts contain complex functionality that is computationally intensive, such as hashing and encryption. The custom precompiled contracts on Moonbeam provide access to Substrate-based functionality such as staking, governance, XCM-related functions, and more.

The Moonbeam-specific precompiles can be interacted with through familiar and easy-to-use Solidity interfaces using the Ethereum API, which are ultimately used to interact with the underlying Substrate interface. This flow is depicted in the following diagram:

![Precompiled Contracts Diagram](/images/builders/pallets-precompiles/precompiles/overview/overview-1.png)

--8<-- 'text/precompiles/security.md'

## Precompiled Contract Addresses {: #precompiled-contract-addresses }

The precompiled contracts are categorized by address and based on the origin network. If you were to convert the precompiled addresses to decimal format, and break them into categories by numeric value, the categories are as follows:

- **0-1023** - [Ethereum MainNet precompiles](#ethereum-mainnet-precompiles)
- **1024-2047** - precompiles that are [not in Ethereum and not Moonbeam specific](#non-moonbeam-specific-nor-ethereum-precomiles)
- **2048-4095** - [Moonbeam specific precompiles](#moonbeam-specific-precompiles)

--8<-- 'text/precompiles/eth-mainnet.md'

--8<-- 'text/precompiles/non-specific.md'

### Moonbeam Specific Precompiles {: #moonbeam-specific-precompiles }

=== "Moonbeam"
    |                                                                         Contract                                                                          |                           Address                            |
    |:---------------------------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------:|
    |    [Parachain Staking](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=_blank}     |          {{networks.moonbeam.precompiles.staking}}           |
    |   [Crowdloan Rewards](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/crowdloan-rewards/CrowdloanInterface.sol){target=_blank}    |         {{networks.moonbeam.precompiles.crowdloan }}         |
    |            [ERC-20 Interface](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol){target=_blank}            |           {{networks.moonbeam.precompiles.erc20 }}           |
    |        [Democracy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank}        |         {{networks.moonbeam.precompiles.democracy}}          |
    |                  [X-Tokens](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=_blank}                   |          {{networks.moonbeam.precompiles.xtokens}}           |
    |          [Relay Encoder](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/relay-encoder/RelayEncoder.sol){target=_blank}           |       {{networks.moonbeam.precompiles.relay_encoder}}        |
    | [XCM Transactor Legacy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v1/XcmTransactorV1.sol){target=_blank} |   {{networks.moonbeam.precompiles.xcm_transactor_legacy}}    |
    |    [Author Mapping](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol){target=_blank}     |       {{networks.moonbeam.precompiles.author_mapping}}       |
    |                      [Batch](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/batch/Batch.sol){target=_blank}                      |           {{networks.moonbeam.precompiles.batch}}            |
    |              [Randomness](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/randomness/Randomness.sol){target=_blank}               |         {{networks.moonbeam.precompiles.randomness}}         |
    |             [Call Permit](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/call-permit/CallPermit.sol){target=_blank}              |        {{networks.moonbeam.precompiles.call_permit }}        |
    |                      [Proxy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/proxy/Proxy.sol){target=_blank}                      |           {{networks.moonbeam.precompiles.proxy }}           |
    |              [XCM Utilities](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol){target=_blank}               |         {{networks.moonbeam.precompiles.xcm_utils }}         |
    |    [XCM Transactor](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v2/XcmTransactorV2.sol){target=_blank}     |       {{networks.moonbeam.precompiles.xcm_transactor}}       |
    |          [Council Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}           |    {{networks.moonbeam.precompiles.collective_council }}     |
    |    [Technical Committee Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}     | {{networks.moonbeam.precompiles.collective_tech_committee }} |
    |      [Treasury Council Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}      |    {{networks.moonbeam.precompiles.collective_treasury }}    |
    | [Precompile Registry](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/precompile-registry/PrecompileRegistry.sol){target=_blank}  |         {{networks.moonbeam.precompiles.registry }}          |

=== "Moonriver"
    |                                                                         Contract                                                                          |                                Address                                |
    |:---------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------:|
    |    [Parachain Staking](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=_blank}     |              {{networks.moonriver.precompiles.staking}}               |
    |   [Crowdloan Rewards](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/crowdloan-rewards/CrowdloanInterface.sol){target=_blank}    |             {{networks.moonriver.precompiles.crowdloan }}             |
    |            [ERC-20 Interface](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol){target=_blank}            |               {{networks.moonriver.precompiles.erc20 }}               |
    |        [Democracy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank}        |             {{networks.moonriver.precompiles.democracy}}              |
    |                  [X-Tokens](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=_blank}                   |              {{networks.moonriver.precompiles.xtokens}}               |
    |          [Relay Encoder](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/relay-encoder/RelayEncoder.sol){target=_blank}           |           {{networks.moonriver.precompiles.relay_encoder}}            |
    | [XCM Transactor Legacy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v1/XcmTransactorV1.sol){target=_blank} |       {{networks.moonriver.precompiles.xcm_transactor_legacy}}        |
    |    [Author Mapping](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol){target=_blank}     |           {{networks.moonriver.precompiles.author_mapping}}           |
    |                      [Batch](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/batch/Batch.sol){target=_blank}                      |               {{networks.moonriver.precompiles.batch}}                |
    |              [Randomness](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/randomness/Randomness.sol){target=_blank}               |             {{networks.moonriver.precompiles.randomness}}             |
    |             [Call Permit](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/call-permit/CallPermit.sol){target=_blank}              |            {{networks.moonriver.precompiles.call_permit }}            |
    |                      [Proxy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/proxy/Proxy.sol){target=_blank}                      |               {{networks.moonriver.precompiles.proxy }}               |
    |              [XCM Utilities](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol){target=_blank}               |             {{networks.moonriver.precompiles.xcm_utils }}             |
    |    [XCM Transactor](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v2/XcmTransactorV2.sol){target=_blank}     |           {{networks.moonriver.precompiles.xcm_transactor}}           |
    |          [Council Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}           |        {{networks.moonriver.precompiles.collective_council }}         |
    |    [Technical Committee Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}     |     {{networks.moonriver.precompiles.collective_tech_committee }}     |
    |      [Treasury Council Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}      |        {{networks.moonriver.precompiles.collective_treasury }}        |
    |                [Referenda](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=_blank}                |             {{networks.moonriver.precompiles.referenda }}             |
    |    [Conviction Voting](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=_blank}     |         {{networks.moonriver.precompiles.conviction_voting }}         |
    |                 [Preimage](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=_blank}                  |             {{networks.moonriver.precompiles.preimage }}              |
    |        [OpenGov Tech Committee](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}         | {{networks.moonriver.precompiles.collective_opengov_tech_committee }} |
    | [Precompile Registry](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/precompile-registry/PrecompileRegistry.sol){target=_blank}  |             {{networks.moonriver.precompiles.registry }}              |

=== "Moonbase Alpha"
    |                                                                         Contract                                                                          |                               Address                                |
    |:---------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------:|
    |    [Parachain Staking](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=_blank}     |              {{networks.moonbase.precompiles.staking}}               |
    |   [Crowdloan Rewards](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/crowdloan-rewards/CrowdloanInterface.sol){target=_blank}    |             {{networks.moonbase.precompiles.crowdloan }}             |
    |            [ERC-20 Interface](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol){target=_blank}            |               {{networks.moonbase.precompiles.erc20 }}               |
    |        [Democracy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank}        |             {{networks.moonbase.precompiles.democracy}}              |
    |                  [X-Tokens](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=_blank}                   |              {{networks.moonbase.precompiles.xtokens}}               |
    |          [Relay Encoder](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/relay-encoder/RelayEncoder.sol){target=_blank}           |           {{networks.moonbase.precompiles.relay_encoder}}            |
    | [XCM Transactor Legacy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v1/XcmTransactorV1.sol){target=_blank} |       {{networks.moonbase.precompiles.xcm_transactor_legacy}}        |
    |    [Author Mapping](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol){target=_blank}     |           {{networks.moonbase.precompiles.author_mapping}}           |
    |                      [Batch](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/batch/Batch.sol){target=_blank}                      |               {{networks.moonbase.precompiles.batch}}                |
    |              [Randomness](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/randomness/Randomness.sol){target=_blank}               |             {{networks.moonbase.precompiles.randomness}}             |
    |             [Call Permit](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/call-permit/CallPermit.sol){target=_blank}              |            {{networks.moonbase.precompiles.call_permit }}            |
    |                      [Proxy](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/proxy/Proxy.sol){target=_blank}                      |               {{networks.moonbase.precompiles.proxy }}               |
    |              [XCM Utilities](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol){target=_blank}               |             {{networks.moonbase.precompiles.xcm_utils }}             |
    |    [XCM Transactor](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v2/XcmTransactorV2.sol){target=_blank}     |           {{networks.moonbase.precompiles.xcm_transactor}}           |
    |          [Council Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}           |        {{networks.moonbase.precompiles.collective_council }}         |
    |    [Technical Committee Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}     |     {{networks.moonbase.precompiles.collective_tech_committee }}     |
    |      [Treasury Council Collective](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}      |        {{networks.moonbase.precompiles.collective_treasury }}        |
    |                [Referenda](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=_blank}                |             {{networks.moonbase.precompiles.referenda }}             |
    |    [Conviction Voting](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=_blank}     |         {{networks.moonbase.precompiles.conviction_voting }}         |
    |                 [Preimage](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=_blank}                  |             {{networks.moonbase.precompiles.preimage }}              |
    |        [OpenGov Tech Committee](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank}         | {{networks.moonbase.precompiles.collective_opengov_tech_committee }} |
    | [Precompile Registry](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/precompile-registry/PrecompileRegistry.sol){target=_blank}  |             {{networks.moonbase.precompiles.registry }}              |