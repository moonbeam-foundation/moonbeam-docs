---
title: Moonbeam Routed Liquidity
description: Learn how to receive Moonbeam Routed Liquidity after establishing a cross-chain integration with a Moonbeam-based network.  
---

# Receiving Moonbeam Routed Liquidity

![XCM Overview Banner](/images/builders/interoperability/xcm/xc-integration/xc-integration-banner.png)

## Introduction {: #introduction }

Moonbeam Routed Liquidity (MRL) refers to a Moonbeam use case in which liquidity that exists in any blockchain ecosystem that Moonbeam is connected to can be routed to Polkadot parachains. This is possible because of general message passing (GMP), where messages with arbitrary data and tokens can be sent across non-parachain blockchains through [chain-agnostic GMP protocols](/builders/interoperability/protocols){target=_blank}.  

These GMP protocols can combine with Polkadot’s XCM messaging system to allow for seamless liquidity routing into parachains, either through the GMP precompile or traditional smart contracts that interact with XCM-related precompiles.

This guide will cover the process of integrating with a GMP provider’s SDKs and interfaces so that your parachain can access liquidity from non-parachain blockchains through Moonbeam. In addition, this guide will provide the necessary data to register the liquidity represented as Moonbeam’s ERC-20 xc-assets on your parachains.

Currently, MRL is available through Wormhole connected chains, but there is nothing stopping a parachain team from implementing a similar pathway through a different GMP provider.  

## Prerequisites {: #prerequisites }

In order to begin an MRL integration with your parachain, you will first need to:  

- [Establish an XC integration with Moonbeam](/builders/interoperability/xcm/xc-integration){target=_blank}
- [Registering the XC-20 token you want to routed to your parachain](/builders/interoperability/xcm/xc-integration#register-local-xc-20s-erc-20s){target=_blank}
- [Register Moonbeam’s asset on your parachain](/builders/interoperability/xcm/xc-integration#moonbeam-native-tokens){target=_blank}

An XC integration is required, because otherwise assets would not be able to be sent from Moonbeam into your parachain.  

GMP protocols typically move assets in a lock/mint or burn/mint fashion. This liquidity exists on Moonbeam normally as ERC-20 tokens. All ERC-20s on Moonbeam are now XCM-enabled, meaning that they can now exist as XC-20s in any other parachain, as long as they register it to enable XCM transfers.  

Registering Moonbeam’s asset is also required due to a temporary drawback of pallets that send XCM messages for asset transfer, making Moonbeam’s native gas asset the only asset that can be used as a cross-chain fee on the way back.  

## MRL through Wormhole {: #mrl-through-wormhole }

While MRL intends to encompass many different GMP providers, Wormhole is the first that has been built for the public. After you have an XC integration with Moonbeam, the steps to receive liquidity through Wormhole:  

1. Register all of the ERC-20 assets that you desire on the parachain
2. Notify the Moonbeam team of your desire to integrate into the MRL program so that we can help you with the technical implementation
3. Create a forum post on the Moonbeam Community Forum to supply the following information:
    - Parachain ID  
    - The account type that your parachain uses (AccountId32 vs AccountKey20)  
    - The addresses and names of the tokens that you have registered  
    - An endpoint that can be used by the Wormhole Connect frontend  
    - Why you want your parachain to be connected through Wormhole Connect  
4. Connect with the Wormhole team to finalize technical details and sync announcements  

### Tokens Available through Wormhole {: #tokens-available-through-wormhole }

While Wormhole 

The ERC-20 assets that can be bridged through Wormhole's MRL solution are dependent on the tokens that the [xLabs relayer](https://xlabs.xyz/){target=_blank} takes in. A current list of the tokens are available here

