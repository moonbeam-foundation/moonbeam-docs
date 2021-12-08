---
title: Moonbase Alpha
description: An overview of the current configuration of the Moonbeam TestNet, Moonbase Alpha, and information on how to start building on it using Solidity.
---

# The Moonbase Alpha TestNet

_Updated May 27th, 2021_

!!! note
    With the release of [Moonbase Alpha v8](https://github.com/PureStake/moonbeam/releases/tag/v0.8.0), the minimum gas price has been set to 1 GDEV (similar to GWei on Ethereum). This might be a breaking change if you've previously specified a gas price of `0` for your deployment.

## Goal {: #goal } 

The first Moonbeam TestNet, named Moonbase Alpha, aims to provide developers with a place to start experimenting and building on Moonbeam in a shared environment. Since Moonbeam will be deployed as a parachain on Kusama and Polkadot, we want our TestNet to reflect our production configuration. For this reason, we decided that it needed to be a parachain-based configuration rather than a Substrate development setup.

In order to collect as much feedback as possible and provide fast issue resolution, we have set up a [Discord with a dedicated Moonbase AlphaNet channel](https://discord.gg/PfpUATX).

## Initial Configuration {: #initial-configuration } 

Moonbase Alpha has the following configuration:

 - Moonbase Alpha runs as a parachain connected to a relay chain
 - The parachain has two collators (hosted by PureStake) that are collating blocks. External collators can join the network. Only the top {{ networks.moonbase.staking.max_collators }} collator nodes by stake are chosen in the active set
 - The relay chain hosts three validators (hosted by PureStake) to finalize relay chain blocks. One of them is selected to finalize each block collated by Moonbeam's collators. This setup provides room to expand to a two-parachain configuration in the future
 - There are two RPC endpoints (hosted by PureStake). People can run full nodes to access their own private RPC endpoints

![TestNet Diagram](/images/learn/platform/networks/moonbase-diagram-v7.png)

## Features {: #features } 

The following features are available:

??? release v1 "_September 2020_"
    - Fully-emulated Ethereum block production in Substrate (Ethereum pallet)
    - Dispatchable functions to interact with the Rust EVM implementation ([EVM pallet](https://docs.rs/pallet-evm/2.0.1/pallet_evm/))
    - Native Ethereum RPC support (Web3) in Substrate ([Frontier](https://github.com/paritytech/frontier)). This provides compatibility with Ethereum developer tools such as MetaMask, Remix, and Truffle 

??? release v2 "_October 2020_"
    - Event subscription support (pub/sub), which is a missing component on the Web3 RPC side and commonly used by DApp developers. You can find a tutorial on how to subscribe to events [here](/builders/tools/pubsub/)
    - Support for the following precompile contracts: [ecrecover](https://docs.klaytn.com/smart-contract/precompiled-contracts#address-0x-01-ecrecover-hash-v-r-s), [sha256](https://docs.klaytn.com/smart-contract/precompiled-contracts#address-0x-02-sha-256-data), [ripemd160](https://docs.klaytn.com/smart-contract/precompiled-contracts#address-0x-03-ripemd-160-data) and the [identity function](https://docs.klaytn.com/smart-contract/precompiled-contracts#address-0x-04-datacopy-data) (or datacopy)

??? release v3 "_November 2020_"
    - Unification of Substrate and Ethereum accounts under the H160 format, an effort we are calling [Unified Accounts](https://medium.com/moonbeam-network/moonbase-alpha-v3-introducing-unified-accounts-88fae3564cda). Consequently, there will be only one kind of account in the system represented by a single address
    - Upgrades to the event subscription support, adding the possibility of using wildcards and conditional formatting for topics. You can find more information [here](https://docs.moonbeam.network/builders/tools/pubsub/#using-wildcards-and-conditional-formatting)
    - Polkadot.js Apps now natively supports H160 addresses and ECDSA keys. You can use your Ethereum-style address for Substrate functions (when available) like staking, balances, and governance. You can find more information [here](/tokens/connect/polkadotjs/)

??? release v4 "_December 2020_"
    - Updated to the newest version of the Polkadot parachain protocol ([Parachains V1](https://w3f.github.io/parachain-implementers-guide/)), which fixed several issues with node syncing, paving the way to have multiple collators to sync in the same parachain
    - Multiple improvements to our Etheruem Compatibility features:
        * Event subscription ID now returns an Ethereum-styled subscription ID
        * Fixed gas estimation issues for specific usecases
        * Added support for revert reason message
        * Support for Ethereum transactions without ChainId

??? release v5 "_January 2021_"      
    - Added a custom version of the [Staking pallet](https://wiki.polkadot.network/docs/learn-staking) (for testing and development purposes only)
    - Added support for querying pending transactions while they are in the pool 
    - Fixed some issues when retrieving past events and other minor fixes related to smart contract events
    - Multiple under-the-hood improvements that include an optimization of the EVM execution time, making it 15-50 times faster
    - Support for the [modexp](https://docs.klaytn.com/smart-contract/precompiled-contracts#address-0x05-bigmodexp-base-exp-mod) precompile contracts

??? release v6 "_February 2021_"      
    - Public release of the custom [Staking pallet](https://wiki.polkadot.network/docs/learn-staking). Now token holders can nominate collators and earn rewards
    - Added the [Democracy pallet](https://github.com/paritytech/substrate/tree/HEAD/frame/democracy). Token holders can now [submit proposals](/tokens/governance/proposals/) and [vote on them](/tokens/governance/voting/)
    - Updated to the latest version of [Frontier RPC](https://github.com/paritytech/frontier), which increases EVM execution efficiency by a factor of 5
    - The gas limit has been bump to 15M per block, with a 13M per transaction limit

??? release v7 "_April 2021_"      
    - Added support for Ethereum debug/tracing modules. These are turned off by default, to use them you need to spin up a full-node and turn on the feature
    - Fixed block propagation issues so that is not longer limited to collators, improving network stability
    - Added Councils and Technical Committee, expanding governance features
    - Staking module has been refactored, with new names to improve the end-user experience
    - Added three new precompiles: [Bn128Add](https://eips.ethereum.org/EIPS/eip-196), [Bn128Mul](https://eips.ethereum.org/EIPS/eip-196) and [Bn128Pairing](https://eips.ethereum.org/EIPS/eip-197)

??? release v8 "_May 2021_"      
    - Added the [Treasury pallet](https://substrate.dev/rustdocs/latest/pallet_treasury/index.html), to bring [Treasury functionalities](https://wiki.polkadot.network/docs/learn-treasury) to Moonbase Alpha. Two separate treasuries were set up: one receiving 20% of the transaction fees and governed by democracy/councils, and the other receiving 30% of the block rewards that will serve to secure future parachain slots
    - Added the [Proxy pallet](https://substrate.dev/rustdocs/latest/pallet_proxy/index.html), which enables the use of [Proxy accounts](https://wiki.polkadot.network/docs/learn-proxies) on Moonbase Alpha
    - Introduced a new consensus mechanism, called Nimbus. Nimbus provides different filters to choose a random subset of the current active collator pool to produce the next block. Furthermore, block authors now sign blocks using session keys, which are mapped via an extrinsic to an H160 address for rewards payment. You can read more about Nimbus [here](/learn/features/consensus/)
    - Added a [Staking precompiled contract](https://github.com/PureStake/moonbeam/pull/358) contract at address `{{ networks.moonbase.precompiles.staking }}`. An interface to interact with the contract can be found on [this link](https://raw.githubusercontent.com/PureStake/moonbeam/master/precompiles/parachain-staking/StakingInterface.sol)
    - Added [preliminary logs bloom filtering](https://github.com/paritytech/frontier/pull/364) to match user requests through Frontier. This feature was [further optmized](https://github.com/paritytech/frontier/pull/372) to achieve faster response times and a more predictable performance
    - Added the [parachain Crowdloan pallet](https://github.com/paritytech/polkadot/blob/master/runtime/common/src/crowdloan.rs) to test the distribution of rewards
    - Many improvements that aim to enhance network stability
    - Minimum gas price has been increased to 1 GDEV (analog to GWei on Ethereum)

### Release Notes {: #release-notes } 

For more details regarding the updates of Moonbase Alpha, please refer to the following release notes:

 - [Moonbase Alpha v2](https://github.com/PureStake/moonbeam/releases/tag/v0.2.0)
 - [Moonbase Alpha v3](https://github.com/PureStake/moonbeam/releases/tag/v0.3.0)
 - [Moonbase Alpha v4](https://github.com/PureStake/moonbeam/releases/tag/v0.4.0)
 - [Moonbase Alpha v5](https://github.com/PureStake/moonbeam/releases/tag/v0.5.0)
 - [Moonbase Alpha v6](https://github.com/PureStake/moonbeam/releases/tag/v0.6.0)
 - [Moonbase Alpha v7](https://github.com/PureStake/moonbeam/releases/tag/v0.7.0)
 - [Moonbase Alpha v8](https://github.com/PureStake/moonbeam/releases/tag/v0.8.0)

--8<-- 'text/testnet/connect.md'

## Telemetry {: #telemetry } 

You can see current Moonbase Alpha telemetry information visiting [this link](https://telemetry.polkadot.io/#list/Moonbase%20Alpha).

## Tokens {: #tokens } 

Tokens on Moonbase Alpha, named DEV, will be issued on demand. **DEV tokens hold no value and can be freely acquired**. Currently, there are two ways you can get access to this token: through a Discord bot, or manually.

### Discord - Mission Control {: #discord-mission-control } 

To request tokens automatically, we've created a Discord bot (named Mission Control :sunglasses:) that will automatically send a maximum of 5 DEV tokens every 24 hours (per Discord user) when you enter your address. You can check it out on our [Discord channel](https://discord.gg/PfpUATX). For more information, please visit [this site](/builders/get-started/moonbase/#get-tokens/).
 
Under the category "Miscellaneous", you will find our AlphaNet bot channel. Enter the following message, replacing `<enter-address-here->` with your H160 address:
 
```
!faucet send <enter-address-here->
```

### Manual Procedure {: #manual-procedure } 

For token requests of more than the limited account allowed by our Discord bot, contact a moderator directly via our [Discord channel](https://discord.gg/PfpUATX). We are happy to provide the tokens needed to test your applications.


## Early Stage Proof of Stake {: #early-stage-proof-of-stake } 

With the release of Moonbase Alpha v6, the TestNet is now running with an early stage Proof of Stake system. Currently the active set consists of {{ networks.moonbase.staking.max_collators }} collators, which are nominated with DEV funds held by the team.

As Moonbase Alpha progresses, we expect to evolve into a fully decentralized Proof of Stake network.

## Limitations {: #limitations } 

This is the first TestNet for Moonbeam, so there are some limitations.

Some [precompiles](https://docs.klaytn.com/smart-contract/precompiled-contracts) are yet to be included. You can check a list of supported precompiles [here](/builders/tools/precompiles/). However, all built-in functions are available.

Since the release of Moonbase Alpha v6, the maximum gas limit per block has been set to {{ networks.moonbase.gas_block }}, with a maximum gas limit per transaction of {{ networks.moonbase.gas_tx }}.

Users only have access to the Moonbeam parachain. In future networks, we will add access to the relay chain so users can test transferring tokens.