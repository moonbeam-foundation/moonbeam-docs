---
title: Networks
description: The various Moonbeam based networks that are available to connect to.
---

#Networks
There are multiple long lived Moonbeam based networks that are planned.  Significantly, Moonbeam will be deployed to Kusama in addition to Polkadot.  We will follow the approach that software releases will first be deployed to our TestNet, followed by our KusamaNet, and finally to the Polkadot MainNet.  Deploying in this way allows us to de-risk software upgrades to Moonbeam on the Polkadot MainNet while still maintaining a reasonable update velocity.  Details on how to access different Moonbeam based networks will be updated here as the networks become available.

##DevNet
This is a Network with nodes hosted by PureStake that is a precursor to our official testnet.  We expect the DevNet to be available in July 2020.  The DevNet will allow developers to test the Ethereum compatibility features of Moonbeam without needing to run their own nodes or network.  More details on the DevNet coming soon.

##TestNet
The TestNet will be the way we initially engage with the Collator community on Moonbeam.  It will provide a place where Collators can test their setups in preparation for performing Collation services on the Moonbeam KusamaNet and MainNet.  It is also the place where new feature releases will be deployed first.

##KusamaNet
We will deploy Moonbeam as a parachain on the Kusama network in advance of deploying to the Polkadot MainNet.  This requires parachain functionality to be live on Kusama.  We plan to exercise parachain related functionality such as IPO, XCMP, and SPREE on our KusamaNet as those features become available.

##MainNet
The Moonbeam production MainNet will be deployed as a parachain on Polkadot.  This Moonbeam network will feature the highest levels of security and avaiability.  Code running on the MainNet will generally have been vetted through one or more of the other networks listed above.
