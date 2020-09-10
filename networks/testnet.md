---
title: TestNet
description: Start building on the Moonbeam TestNet using Solidity and your favorite Ethereum tools.
---
# Moonbeam TestNet  
*Updated September 10, 2020*

##Goal  
The Moonbeam TestNet is for developers who want to start experimenting or building around Moonbeam in a parachain-based environment. In order to collect as much feedback as possible and provide a fast resolution on issues, we have set up a [Discord with a dedicated TestNet channel](https://discord.gg/nWbtA9x).

##Initial Configuration
This version of the TestNet is hosted by PureStake, but future versions will incorporate collators and other ecosystem participants.  

This is the initial configuration for the Moonbeam TestNet:  
-  Infrastructure is hosted by PureStake.
-  Moonbeam runs as a parachain connected to a relay chain.
-  The parachain has one collator that is producing blocks.
-  The relay chain hosts three validators to finalize relay chain blocks. One of them is selected to finalize each block produced by Moonbeam's only collator. This setup provides room to expand to a two-parachain configuration in the future.

![TestNet Diagram](/images/networks/Moonbeam-TestNet-1.png)

## Features
The following features are available:  
- Fully emulated Ethereum block production in Substrate (Ethereum pallet).
- Dispatchable functions to interact with the Rust EVM implementation ([EVM pallet](https://github.com/paritytech/substrate/tree/master/frame/evm)).
- Native Ethereum RPC support (Web3) in Substrate ([Frontier RPC](https://github.com/paritytech/frontier)). This provides compatibility with Ethereum developer tools such as MetaMask, Truffle, and Remix.

We have many features on the TestNet roadmap, including a few items that are planned for the next release:

- Unification of Substrate and Ethereum accounts under the H160 format, an effort we are calling Unified Accounts. Consequently, there will be only one kind of account in the system represented by a single address.
- Event subscription support (pub/sub), which is a missing component on the Web3 RPC side and commonly used by dApp developers.

Futures that may be implemented in the future:

- Support for third-party collators to enable interested parties to test their setups.
- Implementation of the rewards system, as well as the token economic model ([Staking Pallet](https://wiki.polkadot.network/docs/en/learn-staking)).
- On-chain governance features ([Democracy Pallet](https://github.com/paritytech/substrate/tree/HEAD/frame/democracy)).
- Treasury features ([Treasury Pallet](https://github.com/paritytech/substrate/tree/master/frame/treasury)).

##Get Started

To connect to the Moonbeam TestNet, simply point your provider to the following RPC DNS:

```
http://rpc.testnet.moonbeam.network
```

For the Web3 library, create a local Web3 instance and set the provider to connect to the Moonbeam TestNet:

```js
const Web3 = require('web3'); //Load Web3 library
.
.
.
//Create local Web3 instance - set the Moonbeam TestNet as provider
const web3 = new Web3('http://rpc.testnet.moonbeam.network'); 
```
Any Ethereum wallet should be able to generate a valid address for Moonbeam (for example, [MetaMask](https://metamask.io/)).

For WebSocket connections, you can use the following DNS:

```
wss://wss.testnet.moonbeam.network
```

##Proof of Authority
The Moonbeam TestNet will run similarly to the way the [Kusama and Polkadot MainNets ran when they first launched](https://wiki.polkadot.network/docs/en/learn-launch#the-poa-launch): with Proof of Authority instead of Proof of Stake. This means that block finalization is carried out by a known identity, in this case, the PureStake validators.

This also means that PureStake holds the Sudo Key in order to issue the commands and upgrades necessary to the network.

##Limitations
This is the first Moonbeam TestNet, so there are some limitations.

Tokens on the Moonbeam TestNet, named DEV, will be issued on demand. To request tokens, we've created a Discord bot (named Mission Control :sunglasses:) that will automatically send a maximum of 10 DEV tokens per hour (per Discord user) when you enter your address. You can check it out on our [Discord channel](https://discord.gg/nWbtA9x).

In addition, users only have access to the Moonbeam parachain. In future networks, we will add access to the Rococo relay chain so users can test transferring tokens.

In order to provide an easy on-ramp for developers, smart contracts in this early iteration have no gas limit per block. This is temporary and will be adjusted in the future.

##Chain Purge
This network is under active development. Occasionally, chain purges may be necessary in order to reset the blockchain to its initial state. This is necessary when doing major TestNet upgrades or maintenance. We will announce when a chain purge will take place via our [Discord channel](https://discord.gg/3rgpMmX) at least 24 hours in advance.

Please take note that PureStake will not be migrating the chain state. Thus, all data stored in the blockchain will be lost when a chain purge is carried out. However, as there is no gas limit, users can easily recreate their pre-purge state.

##Contact Us
If you have any feedback regarding the Moonbeam TestNet, feel free to reach out through our official development channel on [Discord](https://discord.gg/3rgpMmX).
