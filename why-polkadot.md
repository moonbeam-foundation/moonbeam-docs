---
title: Why Polkadot
description: Rationale for building Moonbeam using Substrate and deploying to Polkadot
---

After extensive research, we decided to build Moonbeam using the Substrate development framework and to deploy Moonbeam as a Parachain on the Polkadot network. 

Substrate is a good technical fit for Moonbeam. Substrate includes extensive functionality that we can leverage vs needing to build it ourselves. This includes peer to peer networking, consensus mechanisms, governance functionality, an EVM implementation, etc. Overall our use of Substrate will dramatically reduce the time and implementation effort needed to implement Moonbeam.  The level of customization that Substrate allows also is what we needed to be able to achieve our Ethereum compatibility goals.  And by using Rust we get both safety guarantees and performance. 

The Polkadot network is also a good fit for Moonbeam.  By being a parachain on Polkadot we will be able to directly integrate with and move tokens between any other parachains and parathreads on the network. We also can leverage any of the bridges being independently built to connect non-Polkadot chains to Polkadot, including bridges to Ethereum. Polkadot’s interoperability model uniquely supports Moonbeam’s cross-chain integration goals and is a key enabling technology to support the Moonbeam vision.

But perhaps just as important as the technical criteria above, we like the people in the Polkadot ecosystem.  This includes people at Parity, the Web3 Foundation, and other projects in the ecosystem.  We have built many valuable relationships and find the people to be both extremely talented and to be the kind of people we want to be around.

