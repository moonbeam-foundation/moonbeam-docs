---
title: Building Cross-Chain dApps
description: This guide covers the ways you can build cross-chain dApps with Moonbeam, including via XCM, cross consensus messaging, and GMP, general message passing.
---

# Building Cross-Chain dApps

Moonbeam makes it easy for developers to build smart contracts that connect across chains, both within the Polkadot ecosystem and outside the Polkadot ecosystem. This guide will provide a fundamental overview of the underlying protocols that enable cross-chain communication, and how you can leverage them to build connected contracts. For step-by-step guides of how to put these principles into practice, be sure to check out the [Interoperability Tutorials](/tutorials/interoperability/){target=\_blank}. 

Two key terms that will come up frequently in this guide are XCM and GMP. XCM refers to cross-consensus messaging, and it's the native interoperability language of Polkadot that facilitates communication between Polkadot blockchains. 

GMP, or general message passing, refers to the sending and receiving of messages within decentralized blockchain networks. While XCM *is a* type of general message passing, GMP is used colloquially to refer to cross-chain communication between Moonbeam and blockchains outside of Polkadot. Similarly, in this guide, XCM refers to cross-chain messaging within Polkadot, and GMP refers to cross-chain messaging between Moonbeam and other ecosystems outside of Polkadot. 


## XCM Overview {: #xcm-overview }  

XCM, or [cross-consensus message format](https://wiki.polkadot.network/docs/learn-xcm){target=\_blank}, defines a specification for how to construct a message to send between two interoperating blockchains. Simply put, it's a way for two consensus systems to be able to communicate. Thanks to the standardized XCM format, the receiving blockchain knows the exact actions to take when receiving the message. 

The cross-consensus message name was chosen specifically over cross-chain to indicate the flexibility of the XCM message format. It's designed to be flexible enough for blockchains with entirely different consensus systems to adopt the XCM message format and seamlessly interoperate with other blockchains. Other blockchains outside of Polkadot are free to adopt the XCM message format, but the majority of blockchains integrating XCM are naturally Polkadot parachains.

For more information about building with XCM on Moonbeam, be sure to check out [XCM Interoperability in the Builders section](https://docs.moonbeam.network/builders/interoperability/xcm/){target=\_blank}. 

### XCM Transport Methods {: #xcm-transport-methods }  

XCMP is the protocol that carries messages conforming to the XCM standard. It's easy to remember the difference between the two with the added letter "P" for protocol. While XCM is the language that defines the format of the message to send, XCMP can be thought of as the pipes that enable the delivery of said messages.

XCMP is comprised of channels that enable communication between connected blockchains. When a parachain launches on Polkadot, two XCM channels are established automatically to allow for communication between the Polkadot relay chain and the parachain itself. XCM channels are omnidirectional, so two channels must be established for bidirectional communication. 

Optionally, Polkadot parachains can choose to establish additional XCM channels with other parachains. Establishing XCM channels with other chains is a double opt-in process, so the receiving chain must also agree to have the channel established. Establishing XCM channels with another parachain allows for XCM messages to be exchanged, enabling the flow of cross-chain assets and remote contract calls, to name a few examples. 

There are several different subcategories of XCM transport methods, including:

#### VMP {: #vmp } 

VMP, or Vertical Message Passing, refers to message passing between the relay chain and a parachain. Given that XCM channels are one way, there are two types of message passing that comprise VMP, namely:  

- **UMP** - Upward Message Passing refers to message passing from a parachain to the relay chain
- **DMP** - Downward Message Passing refers to message passing from the relay chain to a parachain

#### HRMP {: #HRMP } 

[Horizontal Relay-routed Message Passing](https://wiki.polkadot.network/docs/learn-xcm-transport#hrmp-xcmp-lite){target=\_blank} (HRMP) is a temporary protocol that is currently being used while XCMP (Cross-Chain Message Passing) is still under development. HRMP serves as a placeholder and provides the same functionality and interface as XCMP. However, HRMP is more resource-intensive because it stores all messages within the Relay Chain's storage. 

When opening XCM channels with other parachains today, those channels are using HRMP in place of the aforementioned XCMP. Once the implementation of XCMP is complete, the plan is to gradually phase out HRMP and replace it with XCMP.

For more information about each one, be sure to check out [Polkadot's Guide to XCM Transport](https://wiki.polkadot.network/docs/learn-xcm-transport){target=\_blank}.

## General Message Passing {: #general-message-passing } 

As you know, GMP colloquially refers to cross-chain communication between Moonbeam and other blockchains outside of Polkadot. General message passing is enabled by cross-chain protocols that specialize in cross-chain communication. Each GMP provider takes a slightly different approach, but conceptually, they quite similar. You'll be interacting with different contracts and functions for each provider but each GMP provider has the same end-goal: to provide secure and reliable cross-chain communication. 

An incredible array of GMP providers have integrated with Moonbeam, which is beneficial for several reasons. For one, it enables you to work with whichever GMP provider you prefer. Second, it means that Moonbeam is connected to a rapidly growing number of other chains. Whenever a GMP provider integrated with Moonbeam adds support for another chain, Moonbeam is automatically now connected with that chain. GMP providers are constantly adding support for new chains, and it's exciting to see those new integrations benefit the Moonbeam community. Additionally, having a variety of GMP providers allows for redundancy and backup. GMP providers have occassional maintenance windows or downtime, and thus it may make sense to add support for multiple GMP providers to ensure consistent uptime. 

The following GMP providers have integrated with Moonbeam: 

- [Axelar](/builders/interoperability/protocols/axelar/){target=\_blank}
- [Hyperlane](/builders/interoperability/protocols/hyperlane/){target=\_blank}
- [LayerZero](/builders/interoperability/protocols/layerzero/){target=\_blank} 
- [Wormhole](/builders/interoperability/protocols/wormhole/){target=\_blank}
