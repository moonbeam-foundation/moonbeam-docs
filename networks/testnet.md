---
title: TestNet
description: Start building on the Moonbeam TestNet using Solidity and your favorite Ethereum tools.
---
# Moonbase Alpha, The Moonbeam TestNet
*Updated September 18, 2020*

## Goal  
The first Moonbeam TestNet, named Moonbase Alpha, aims to provide developers with a place to start experimenting and building on Moonbeam in a shared environment. Since Moonbeam will be deployed as a parachain on Kusama and Polkadot, we want our TestNet to reflect our production configuration. For this reason, we decided that it needed to be a parachain-based configuration rather than a Substrate standalone setup.

In order to collect as much feedback as possible and provide a fast resolution on issues, we have set up a [Discord with a dedicated Moonbase AlphaNet channel](https://discord.gg/nWbtA9x).

## Initial Configuration
Moonbase Alpha has the following configuration:  

-  Infrastructure is hosted by PureStake.
-  Moonbeam runs as a parachain connected to a relay chain.
-  The parachain has one collator that is producing blocks.
-  The relay chain hosts three validators to finalize relay chain blocks. One of them is selected to finalize each block produced by Moonbeam's only collator. This setup provides room to expand to a two-parachain configuration in the future.
-  There are two RPC endpoints.

![TestNet Diagram](/images/testnet/Moonbase-Alpha.png)

## Features  

The following features are available:  

- Fully emulated Ethereum block production in Substrate (Ethereum pallet).
- Dispatchable functions to interact with the Rust EVM implementation ([EVM pallet](https://github.com/paritytech/substrate/tree/master/frame/evm)).
- Native Ethereum RPC support (Web3) in Substrate ([Frontier RPC](https://github.com/paritytech/frontier)). This provides compatibility with Ethereum developer tools such as MetaMask, Truffle, and Remix.

We have many features on Moonbase's roadmap, including a few items that are planned for the next release:

- Unification of Substrate and Ethereum accounts under the H160 format, an effort we are calling Unified Accounts. Consequently, there will be only one kind of account in the system represented by a single address.
- Event subscription support (pub/sub), which is a missing component on the Web3 RPC side and commonly used by dApp developers.

Features that may be implemented in the future:

- Support for third-party collators to enable interested parties to test their setups.
- Implementation of the rewards system, as well as the token economic model ([Staking Pallet](https://wiki.polkadot.network/docs/en/learn-staking)).
- On-chain governance features ([Democracy Pallet](https://github.com/paritytech/substrate/tree/HEAD/frame/democracy)).
- Treasury features ([Treasury Pallet](https://github.com/paritytech/substrate/tree/master/frame/treasury)).

## Get Started

--8<-- "testnet/connect.md"

##Proof of Authority
Moonbase Alpha will run similarly to the way the [Polkadot MainNets ran when they first launched](https://wiki.polkadot.network/docs/en/learn-launch#the-poa-launch): with Proof of Authority instead of Proof of Stake. This means that block finalization is carried out by a known identity, in this case, the PureStake validators.

This also means that PureStake holds the Sudo Key in order to issue the commands and upgrades necessary to the network.

## Tokens

--8<-- "testnet/faucet.md"

## Limitations
This is the first TestNet for Moonbeam, so there are some limitations.

No [pre-compiles](https://ethereum.stackexchange.com/questions/15479/list-of-pre-compiled-contracts) are included in this release. However, all built-in functions are available.

In order to provide an easy on-ramp for developers, this early iteration has no gas limit per block for execution of smart contracts. This is temporary and will be adjusted in the future.

Users only have access to the Moonbeam parachain. In future networks, we will add access to the relay chain so users can test transferring tokens.

## Chain Purge
This network is under active development. Occasionally, chain purges may be needed in order to reset the blockchain to its initial state. This is necessary when doing major TestNet upgrades or maintenance. We will announce when a chain purge will take place via our [Discord channel](https://discord.gg/3rgpMmX) at least 24 hours in advance.

Please take note that PureStake will not be migrating the chain state. Thus, all data stored in the blockchain will be lost when a chain purge is carried out. However, as there is no gas limit, users can easily recreate their pre-purge state.

## Contact Us
If you have any feedback regarding Moonbase Alpha, feel free to reach out through our official development channel on [Discord](https://discord.gg/PfpUATX) :fontawesome-brands-discord:.
