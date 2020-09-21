---
title: Overview
description: An overview of the networks planned for Moonbeam, an Ethereum-compatible smart contract parachain on Polkadot.
---

#Networks  
We plan to create multiple long-lived, Moonbeam-based networks. Significantly, Moonbeam will be deployed to Kusama in addition to Polkadot.

Our approach will be first to deploy a PureStake hosted parachain TestNet, followed by a parachain deployed to the Rococo TestNet, then Moonbeam to Kusama, and finally to the Polkadot Network. Deploying in this way allows us to de-risk software upgrades to Moonbeam on the Polkadot MainNet while still maintaining a reasonable update velocity. We will add details on how to access different Moonbeam-based networks as the networks become available.

##Moonbeam TestNet - Moonbase Alpha
This Alpha TestNet, named Moonbase, is a network that is hosted by PureStake. It features a parachain-relay chain scheme with one collator and three validators. The goal is to allow developers to test the Ethereum compatibility features of Moonbeam without needing to run their own nodes or network, and in a shared environment that is parachain. [Learn more about Moonbase](/networks/testnet/).

For future releases, Moonbase may support third-party collators, so they can test their setups.

##Moonbeam RococoNet  
Moonbeam will be deployed as a parachain on the Rococo TestNet. This deployment will provide a place to test interoperability with other chains as they, and the corresponding features, become available in Rococo.

##Moonbeam KusamaNet  
Moonbeam will launch as a parachain on the Kusama network, in advance of deploying to the Polkadot MainNet ([more details here](https://www.purestake.com/news/moonbeam-on-kusama/)). This requires parachain functionality to be live on Kusama. We plan to exercise parachain-related functionality such as IPO, XCMP, and SPREE on our KusamaNet as those features become available.

##Moonbeam Polkadot MainNet  
The Moonbeam production MainNet will be deployed as a parachain on Polkadot. This Moonbeam network will feature the highest levels of security and availability. Code running on the MainNet will generally have been vetted through one or more of the other networks listed above.
