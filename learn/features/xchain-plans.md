---
title: Cross-Chain Communication
description: This guide covers the ways you can build cross-chain dApps with Moonbeam, including via XCM, cross consensus messaging, and GMP, general message passing.
categories: Basics, XCM
---

# Cross-Chain Communication Methods

Moonbeam makes it easy for developers to build smart contracts that connect across chains, both within the Polkadot ecosystem and outside the Polkadot ecosystem. This page will provide an overview of the underlying protocols that enable cross-chain communication and how you can leverage them to build connected contracts. For implementation details, refer to the [interoperability builder docs](/builders/interoperability/){target=\_blank}.

Two key terms that will come up frequently in this guide are XCM and GMP. [XCM](/builders/interoperability/xcm/){target=\_blank} refers to cross-consensus messaging, and it's Polkadot's native interoperability language that facilitates communication between Polkadot blockchains. You can read more about the [standardized XCM message format](https://docs.polkadot.com/develop/interoperability/intro-to-xcm/){target=\_blank} and [How to Get Started Building with XCM](/builders/interoperability/xcm/){target=\_blank}.

[GMP](https://moonbeam.network/news/seamless-blockchain-interoperability-the-power-of-general-message-passing-gmp){target=\_blank}, or general message passing, refers to the sending and receiving of messages within decentralized blockchain networks. While XCM is a type of general message passing, GMP colloquially refers to cross-chain communication between Moonbeam and blockchains outside of Polkadot. Similarly, in this guide, XCM refers to cross-chain messaging within Polkadot, and GMP refers to cross-chain messaging between Moonbeam and other ecosystems outside of Polkadot.

## Quick Reference {: #quick-reference }  

=== "Comparison of XCM vs GMP"
|     Specification     |                                                                       XCM                                                                        |                                                                                                                                                       GMP                                                                                                                                                        |
|:---------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|       **Scope**       |                                                      Polkadot and its connected parachains                                                       |                                                                                                                                    Any blockchain supported by a GMP provider                                                                                                                                    |
|     **Provider**      |                                                                     Polkadot                                                                     | [Axelar](/builders/interoperability/protocols/axelar/){target=\_blank}, [Wormhole](/builders/interoperability/protocols/wormhole/){target=\_blank}, [LayerZero](/builders/interoperability/protocols/layerzero/){target=\_blank}, [Hyperlane](/builders/interoperability/protocols/hyperlane/){target=\_blank}, etc. |
|  **Implementation**   |                               [XCM Virtual Machine](https://wiki.polkadot.com/learn/learn-xcvm/){target=\_blank}                               |                                                                                                                                                 Smart contracts                                                                                                                                                  |
|     **Security**      |                                                            Polkadot's shared security                                                            |                                                                                                                                 Proprietary consensus determined by GMP provider                                                                                                                                 |
|       **Fees**        | [Purchased with `BuyExecution` XCM instruction with supported asset](/builders/interoperability/xcm/core-concepts/weights-fees/){target=\_blank} |                                                                                                                    User sends value with transaction to pay for gas on the destination chain                                                                                                                     |
| **Adding New Chains** |                                            Requires creation of XCM channels by both connected chains                                            |                                                                                                                                       Requires GMP provider to add support                                                                                                                                       |

## XCM Transport Methods {: #xcm-transport-methods }  

XCMP is the protocol that carries messages conforming to the XCM standard. The difference between the two is easy to remember with the added letter "P" for protocol. While XCM is the language that defines the format of the message to send, XCMP can be thought of as the pipes that enable the delivery of said messages.

XCMP is comprised of channels that enable communication between connected blockchains. When a parachain launches on Polkadot, two XCM channels are established automatically to allow for communication between the Polkadot relay chain and the parachain itself. XCM channels are omnidirectional, so two channels must be established for bidirectional communication. 

Polkadot parachains can optionally choose to establish additional XCM channels with other parachains. Establishing XCM channels with other chains is a double opt-in process, so the receiving chain must also agree to have the channel established. Establishing XCM channels with another parachain allows for the exchange of XCM messages, enabling the flow of cross-chain assets and remote contract calls, to name a few examples. 

There are several different subcategories of XCM transport methods, including:

### VMP {: #vmp } 

VMP, or [Vertical Message Passing](https://wiki.polkadot.com/learn/learn-xcm-transport/#vmp-vertical-message-passing){target=\_blank}, refers to message passing between the relay chain and a parachain. Given that XCM channels are one-way, there are two types of message passing that comprise VMP, namely:  

- **UMP** - Upward Message Passing refers to message passing from a parachain to the relay chain
- **DMP** - Downward Message Passing refers to message passing from the relay chain to a parachain

### HRMP {: #HRMP } 

[Horizontal Relay-routed Message Passing](https://wiki.polkadot.com/learn/learn-xcm-transport/#hrmp-xcmp-lite){target=\_blank} (HRMP) is a temporary protocol that is currently being used while XCMP (Cross-Chain Message Passing) is still under development. HRMP serves as a placeholder and provides the same functionality and interface as XCMP. However, HRMP is more resource-intensive because it stores all messages within the Relay Chain's storage. 

When opening XCM channels with other parachains today, those channels are using HRMP in place of the aforementioned XCMP. Once the implementation of XCMP is complete, the plan is to phase out HRMP and replace it with XCMP gradually. For more information about each one, be sure to check out [Polkadot's Guide to XCM Transport](https://wiki.polkadot.com/learn/learn-xcm-transport/){target=\_blank}.

## General Message Passing {: #general-message-passing } 

As you know, GMP colloquially refers to cross-chain communication between Moonbeam and other blockchains outside of Polkadot. General message passing is enabled by cross-chain protocols that specialize in cross-chain communication. Each GMP provider takes a slightly different approach, but conceptually, they are quite similar. There are different contracts and functions for each provider, but each GMP provider has the same end goal: to provide secure and reliable cross-chain communication.  

### Happy Path of a Cross-Chain Message {: #happy-path-of-a-cross-chain-message } 

At a high level, the happy path of a message sent via GMP is as follows. A user or developer will call a contract specific to the GMP protocol, sometimes referred to as a mailbox contract or a gateway contract. This call typically includes parameters like the destination chain, the destination contract address, and includes sufficient value to pay for the transaction on the destination chain. A GMP provider listens for specific events on the origin blockchain pertaining to their gateway or mailbox contracts that indicate that a user wants to send a cross-chain message using their protocol. The GMP provider will validate certain parameters, including whether or not sufficient value was provided to pay for gas on the destination chain. In fact, the GMP provider may have a decentralized network of many nodes checking the authenticity of the message and verifying parameters. The GMP provider will not validate the integrity of the contract call to be delivered on the destination chain. E.g., the GMP provider will happily deliver a valid, paid-for message that contains a smart contract call that reverts on arrival. Finally, if everything checks out according to the consensus mechanism of the GMP provider, the message will be delivered to the destination chain, triggering the respective contract call at the destination.

![Happy Path of a cross chain GMP message](/images/learn/features/xchain-plans/xchain-plans-1.webp) 

### GMP Providers Integrated with Moonbeam {: #gmp-providers-integrated-with-moonbeam } 
A large number of GMP providers have integrated with Moonbeam, which is beneficial for several reasons. For one, it enables you to work with whichever GMP provider you prefer. Second, it means that Moonbeam is connected to a rapidly growing number of chains. Whenever a GMP provider integrated with Moonbeam adds support for another chain, Moonbeam is automatically now connected with that chain. GMP providers are constantly adding support for new chains, and it's exciting to see those new integrations benefit the Moonbeam community. Additionally, having a variety of GMP providers allows for redundancy and backup. GMP providers have occasional maintenance windows or downtime; thus, it may make sense to add support for multiple GMP providers to ensure consistent uptime. 

A significant number of GMP providers have integrated with Moonbeam, offering multiple benefits. Firstly, this integration allows users the flexibility to choose their preferred GMP provider. Secondly, Moonbeam's connectivity is enhanced as it automatically links with any new chains that its GMP providers support. Given that GMP providers frequently expand their support to new chains, the continuous roll out of new chains is a promising ongoing benefit for the Moonbeam community. Additionally, the diversity of GMP providers ensures better reliability and backup options. Since GMP providers can occasionally experience downtime or scheduled maintenance, the ability to integrate with multiple GMP providers is an important benefit.

The following GMP providers have integrated with Moonbeam: 

- [Axelar](/builders/interoperability/protocols/axelar/){target=\_blank}
- [Hyperlane](/builders/interoperability/protocols/hyperlane/){target=\_blank}
- [LayerZero](/builders/interoperability/protocols/layerzero/){target=\_blank} 
- [Wormhole](/builders/interoperability/protocols/wormhole/){target=\_blank}

## Implementing Both XCM and GMP {: #implementing-both-xcm-and-gmp } 

Building with XCM or GMP does not preclude building with the other. As they suit different use cases, a team may seek to utilize XCM to handle interoperability needs within Polkadot, and GMP to deliver cross-chain messages to and from blockchains outside of Polkadot. As an example, several DEXes on Moonbeam support the trading of tokens migrated to Moonbeam via XCM, such as xcDOT, and assets bridged from ecosystems outside of Polkadot, such as USDC via Wormhole. 

### Moonbeam Routed Liquidity {: #moonbeam-routed-liquidity }

[Moonbeam Routed Liquidity](/builders/interoperability/mrl/) (MRL) enables seamless liquidity between external blockchains connected to Moonbeam via Wormhole to Polkadot parachains connected to Moonbeam via XCM. This combination of GMP and XCM means that any ERC-20 token on a chain that Wormhole has integrated with can be routed through Moonbeam to a destination parachain (and back). A diagram of the happy path of a token transfer to a parachain via MRL is shown below, and you can find more information at the [MRL docs](/builders/interoperability/mrl/). 

![Happy Path of an MRL token transfer](/images/learn/features/xchain-plans/xchain-plans-2.webp) 


--8<-- 'text/_disclaimers/third-party-content.md'
