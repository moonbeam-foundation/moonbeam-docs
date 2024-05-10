---
title: Overview of Networks
description: An overview of all of the MainNet and TestNet deployments of Moonbeam, an Ethereum-compatible smart contract parachain on Polkadot and Kusama.
---

# Networks

There are multiple long-lived Moonbeam-based networks. Most significantly, there is the Moonbeam deployment on Polkadot and Kusama.

An overview of our parachain deployments is as follows:

 - Moonbeam: deployment on Polkadot (_December 2021_)
 - Moonriver: deployment on Kusama (_June 2021_)
 - Moonbase Alpha: Parachain TestNet for Moonbeam and Moonriver (_September 2020_)

This strategy allows us to de-risk software upgrades to Moonbeam on the Polkadot MainNet while still maintaining a reasonable update velocity.

## Moonbeam {: #moonbeam }

The Moonbeam production MainNet is a parachain on Polkadot and has been since December 17th, 2021. Moonbeam features the highest levels of security and availability. Code running on the MainNet has generally been vetted through one or more of the other networks listed above.

Moonbeam will offer parachain-related functionalities such as [XCMP](https://wiki.polkadot.network/docs/learn-crosschain){target=\_blank} and [SPREE](https://wiki.polkadot.network/docs/learn-spree){target=\_blank} as these features become available.

[Learn more about Moonbeam](/learn/platform/networks/moonbeam).

## Moonriver {: #moonriver }

In advance of deploying to the Polkadot MainNet, [Moonbeam launched Moonriver](https://moonbeam.network/announcements/moonriver-launch-kusama){target=\_blank} as a parachain on the Kusama network. The parachain functionality is live on Kusama.

Moonriver will offer parachain-related functionalities such as [XCMP](https://wiki.polkadot.network/docs/learn-crosschain){target=\_blank} and [SPREE](https://wiki.polkadot.network/docs/learn-spree){target=\_blank} as these features become available.

[Learn more about Moonriver](/learn/platform/networks/moonriver).

## Moonbase Alpha {: #moonbase-alpha }

This TestNet is a network hosted by OpsLayer. It features a parachain/relay chain scheme. The goal is to allow developers to test the Ethereum compatibility features of Moonbeam in a shared parachain environment without needing to run their own nodes or network.

[Learn more about Moonbase Alpha](/learn/platform/networks/moonbase).
