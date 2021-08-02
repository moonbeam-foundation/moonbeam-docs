---
title: Overview
description: An overview of the networks planned for Moonbeam, an Ethereum-compatible smart contract parachain on Polkadot.
---

# Networks

We plan to create multiple long-lived, Moonbeam-based networks. Significantly, Moonbeam will be deployed to Kusama in addition to Polkadot.

Our roadmap in regards to deployments as a parachain is the following:

 - Moonbase Alpha: PureStake hosted parachain TestNet (_September 2020_) 
 - Moonrock: deployment on the Rococo TestNet (_May 2021_)
 - Moonriver: deployment on Kusama (_June 2021_)
 - Moonbeam: deployment on Polkadot (_end of Q3 2021_)
 
This strategy allows us to de-risk software upgrades to Moonbeam on the Polkadot MainNet while still maintaining a reasonable update velocity. We will add details on how to access different Moonbeam-based networks as the networks become available.

## Moonbase Alpha {: #moonbase-alpha } 

This TestNet is a network hosted by PureStake. It features a parachain/relay chain scheme. The goal is to allow developers to test the Ethereum compatibility features of Moonbeam in a shared parachain environment without needing to run their own nodes or network.

[Learn more about Moonbase Alpha](/networks/moonbase/).

## Moonrock {: #moonrock } 

We decided not to participate in the first parachain deployments to Rococo because we have been running our own parachain/relay chain setup since we launched our TestNet in September 2020.

However, Moonrock was deployed to Rococo for the first time in May 2021. 

## Moonriver {: #moonriver } 

In advance of deploying to the Polkadot MainNet, [Moonbeam launched Moonriver](https://moonbeam.network/announcements/moonriver-launch-kusama/) as a parachain on the Kusama network. The parachain functionality is live on Kusama and features are progressively being released according to the [Moonriver launch schedule](https://moonbeam.network/networks/moonriver/launch/). 

We plan to exercise parachain-related functionality such as [XCMP](https://wiki.polkadot.network/docs/learn-crosschain) and [SPREE](https://wiki.polkadot.network/docs/learn-spree) on Moonriver as those features become available.

[Learn more about Moonriver](/networks/moonriver/).

## Moonbeam Polkadot MainNet {: #moonbeam-polkadot-mainnet } 

The Moonbeam production MainNet will be deployed as a parachain on Polkadot. This Moonbeam network will feature the highest levels of security and availability. Code running on the MainNet will generally have been vetted through one or more of the other networks listed above.
