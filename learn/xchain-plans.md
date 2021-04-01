---
title: Cross-Chain Integration
description: Moonbeam's cross-chain integrations will support both Polkadot-based parachains and non-Polkadot chains, like Ethereum.
---

# Cross-Chain Integration Plans

One of the key planned features for Moonbeam is to provide an easy way for developers to use smart contracts to integrate with other chains in the Polkadot ecosystem.

Polkadot defines a low-level integration protocol, called cross-chain message passing (XCMP), that can be used to facilitate communication between parachains within the Polkadot network and share trusted logic between chains on the Polkadot network, called shared protected runtime execution enclaves (SPREE). Parity is in the process of implementing XCMP and is in the design phase of SPREE as of writing this document (July 2020). Post-Polkadot mainnet launch, XCMP and SPREE support will be released as upgrades to the Polkadot relay chain. We plan to implement and support integration scenarios based on these protocols when they are available.

## An Analogy: The "Bash of Linux"

For us, Polkadot will serve a similar function to something like Linux. Both are developer-oriented platforms that come with libraries to make building applications easier. 

Recall the old Unix philosophy, where users build tools that do one job and do it well. This is similar to the specialization that we expect to happen to parachains on Polkadot. On Linux, you can combine and compose these purpose-built tools together to achieve higher order effects using a shell-like bash. We anticipate Moonbeam-based smart contracts will provide an analogous “bash-like” environment, where specialized smart contracts and parachain functionality can be composed to achieve higher order goals.

It may be the case that projects start as one or more Moonbeam smart contracts and migrate over time to be “native applications” — which could be parathreads or parachains in the Polkadot context — if they need more performance or more direct control over their economies.

## Integration with Other Polkadot-Based Chains

The initial scenario we are most interested in is to allow for the movement of tokens from other chains into Moonbeam-based tokens, such that they can be used within DeFi and other applications on the platform. Once their work is done, these assets can then move back or out to other chains.

As the integration features of the Polkadot network evolve, we will continue to provide ways for developers to access those integrations from smart contracts and to compose features across chains in Moonbeam smart contracts.

## Integration with Ethereum

Connectivity to Ethereum is an important capability needed for Moonbeam to be able to support Ethereum-based projects, particularly in hybrid deployments where projects are simultaneously deployed to Ethereum and Moonbeam. There is at least one project under development, independent of Moonbeam, to build a parachain-based Ethereum bridge. Once this bridge is operational, it will provide a mechanism for moving tokens, state, and messages to and from Ethereum by leveraging Polkadot.

Until there is a parachain-based bridge in production, we plan to provide two solutions for projects that want to integrate Ethereum and Moonbeam:

 1. A utility that can export state from Ethereum into a binary file, where this binary file can be used to import that state into Moonbeam. Each use of this utility would be a one-time, one-way migration.
 2. An integrated point-to-point Ethereum bridge directly incorporated into Moonbeam. This bridge would allow for token movement and cross-chain state queries and messages. As the Polkadot ecosystem develops, we expect multiple Ethereum integration options as choices for projects deploying to Moonbeam.
