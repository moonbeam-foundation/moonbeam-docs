---
title: Overview
description: An overview of the networks planned for Moonbeam, an Ethereum-compatible smart contract parachain on Polkadot.
---

# Networks

We plan to create multiple long-lived, Moonbeam-based networks. Significantly, Moonbeam will be deployed to Kusama in addition to Polkadot.

Our roadmap in regards to deployments as a parachain is the following:

 - Moonbase Alpha: PureStake hosted parachain TestNet (_September 2020_) 
 - Moonrock: deployment on the Rococo TestNet
 - Moonshadow: deployment on the Westend TestNet
 - Moonriver: deployment on Kusama (_end of Q2 2021_)
 - Moonbeam: deployment on Polkadot (_end of Q3 2021_)
 
This strategy allows us to de-risk software upgrades to Moonbeam on the Polkadot MainNet while still maintaining a reasonable update velocity. We will add details on how to access different Moonbeam-based networks as the networks become available.

## Moonbase Alpha

This TestNet is a network hosted by PureStake. It features a parachain/relay chain scheme. The goal is to allow developers to test the Ethereum compatibility features of Moonbeam in a shared parachain environment without needing to run their own nodes or network.

[Learn more about Moonbase Alpha](/networks/moonbase/).

## Moonrock  

Moonbeam deployment to the [Rococo parachain TestNet](https://polkadot.network/introducing-rococo-polkadots-parachain-testnet/) is called Moonrock. This instance is not meant to be long-lived and is aimed to be used for development purposes.

You can read more about the role Moonrock plays for Moonbeam in [this blog post](https://moonbeam.network/blog/role-of-rococo-in-moonriver-launch-strategy/).

## Moonshadow

Moonbeam deployment to the [Westend TestNet](https://polkadot.network/westend-introducing-a-new-testnet-for-polkadot-and-kusama/) is called Moonshadow.

Moonshadow will serve as a dry run for the future network launch process of [Moonriver](https://moonbeam.network/networks/moonriver/launch/)/Moonbeam. Compared to Moonbase Alpha, where we have control over the relay chain, Moonshadow replicates the production environment of Kusama/Polkadot, where the relay chain is an independent blockchain.

## Moonriver

Moonbeam will launch as a parachain on the Kusama network in advance of deploying to the Polkadot MainNet ([more details here](https://www.purestake.com/news/moonbeam-on-kusama/)). This requires parachain functionality to be live on Kusama. 

We plan to exercise parachain-related functionality such as [Crowdloan](https://wiki.polkadot.network/docs/en/learn-crowdloans), [XCMP](https://wiki.polkadot.network/docs/en/learn-crosschain), and [SPREE](https://wiki.polkadot.network/docs/en/learn-spree) on Moonriver as those features become available.

## Moonbeam Polkadot MainNet

The Moonbeam production MainNet will be deployed as a parachain on Polkadot. This Moonbeam network will feature the highest levels of security and availability. Code running on the MainNet will generally have been vetted through one or more of the other networks listed above.