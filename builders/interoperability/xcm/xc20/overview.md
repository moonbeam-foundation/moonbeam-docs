---
title: XC-20s and Cross-Chain Assets
description:  Learn how to access and interact with an ERC-20 interface for cross-chain tokens on Moonbeam using the assets precompiled Solidity contract.
---

# Overview of XC-20s

![Cross-Chain Assets Precompiled Contracts Banner](/images/builders/interoperability/xcm/xc20/overview/overview-banner.png)

## Introduction {: #introduction } 

The [Cross-Consensus Message (XCM)](https://wiki.polkadot.network/docs/learn-crosschain){target=_blank} format defines how messages can be sent between interoperable blockchains. This format opens the door to transferring messages and assets (Substrate assets) between Moonbeam/Moonriver and the relay chain or other parachains in the Polkadot/Kusama ecosystems. 

Substrate assets are natively interoperable. However, developers need to tap into the Substrate API to interact with them, with no real visibility into the EVM. Consquently, interoperable Substrate assets are not that attractive for developers building on the EVM. To fix that and to help developers tap into the native interoperability that Polkadot/Kusama offers, Moonbeam introduced the concept of XC-20s.

XC-20s are a unique asset class on Moonbeam. It combines the power of Substrate assets (native interoperability) but allows users and developers to interact with them through a familiar [ERC-20 interface](/builders/interoperability/xcm/xc20/xc20/#the-erc20-interface){target=_blank}. Moreover, developers can integrate XC-20s with regular [Ethereum development frameworks](/builders/build/eth-api/dev-env/){target=_blank} or dApps, and create connected contracts strategies with such assets. Moreover, with the introduction of [RT2301](https://github.com/PureStake/moonbeam/tree/runtime-2301), all ERC-20s are XCM-ready, meaning they can also be referred to as XC-20s.

![Moonbeam XC-20 XCM Integration With Polkadot](/images/builders/interoperability/xcm/overview/overview-4.png)

## Types of XC-20s {: #types-of-xc-20s }

There are two types of XC-20s: [local](/builders/interoperability/xcm/xc20/xcm-erc20s){target=_blank} and [external](/builders/interoperability/xcm/xc20/xc20){target=_blank}.

Local XC-20s are all ERC-20s that exist on the EVM, and that can be transferred cross-chain through XCM. In order for local XC-20s to be transferred to another parachain, the asset needs to be registered on that chain. When transferring local XC-20s, the actual tokens reside in the destination chain's Sovereign account on Moonbeam.

External XC-20s are native cross-chain assets that are transferred from another parachain or the relay chain to Moonbeam. These assets are Substrate assets at their core. When transferring external XC-20s, the actual tokens reside in Moonbeam's Sovereign account in each of these chains. External XC-20s will all have _xc_ prepended to their names to distinguish them as native cross-chain assets.

Both types of XC-20s can be easily sent to other parachains in the ecosystem as if they were Substrate assets, through both the Ethereum and Substrate API. If local XC-20s are sent through the Substrate API, the transaction won't be visible from EVM-based block explorers, such as [Moonscan](https://moonscan.io){target=_blank}. Only transactions done via the Ethereum API are visible through such explorers.

On the EVM side, both types of assets provide an [ERC-20 interface](/builders/interoperability/xcm/xc20/xc20/#the-erc20-interface){target=_blank} so smart contracts and users can easily interact with them, and no knowledge of Substrate is required. This ultimately provides greater flexibility for developers when working with these types of assets and allows seamless integrations with EVM-based smart contracts such as DEXs and lending platforms, among others. To learn how to interact with external XC-20s via an ERC-20 interface, please refer to the [Interact with External XC-20s using an ERC-20 Interface](/builders/interoperability/xcm/xc20/xc20/#interact-with-the-precompile-using-remix){target=_blank} docs.

The main difference between these two types of assets is that local XC-20s are EVM ERC-20s, while external XC-20s are Substrate assets with an ERC-20 interface on top.

Cross-chain transfers of XC-20s are done using the [X-Tokens Pallet](/builders/interoperability/xcm/xc20/xtokens/){target=_blank}. The instructions for transferring external and local XC-20s are slightly different depending on the type and multilocation of the given asset. For external XC-20s, you can refer to the [Using the X-Tokens Pallet To Send XC-20s](/builders/interoperability/xcm/xc20/xtokens){target=_blank} guide. For local XC-20s, please check out the [Send ERC-20s Cross Chain via XCM](/builders/interoperability/xcm/xc20/xcm-erc20s){target=_blank} guide.

