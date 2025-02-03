---
title: XC-20s and Cross-Chain Assets
description: Learn about the types of cross-chain assets on Moonbeam, in particular, local and external XC-20s, and view a list of the external XC-20s on Moonbeam.
---

# Overview of XC-20s

## Introduction {: #introduction }

The [Cross-Consensus Message (XCM)](https://wiki.polkadot.network/docs/learn-crosschain){target=\_blank} format defines a universal way for different blockchains to exchange messages. Using XCM, developers can send messages and transfer Substrate-based assets between the relay chain and other parachains in the Polkadot/Kusama ecosystems.

While Substrate assets are inherently interoperable, interacting with them requires using the Substrate API, which offers little visibility into the EVM. This creates a barrier for EVM-focused developers. To address this gap and extend Polkadot/Kusama’s native interoperability to the EVM, Moonbeam introduced the concept of XC-20s.

Initially, Moonbeam offered XC-20s as a specialized asset type, requiring cross-chain configuration during asset creation to enable full cross-chain capabilities. Now, since [runtime 2301](https://github.com/moonbeam-foundation/moonbeam/tree/runtime-2301){target=\_blank}, any ERC-20 token on Moonbeam can be configured for cross-chain transfers at any time effectively allowing all ERC-20s to function as XC-20s. Said differently, it is possible to make any ERC-20 an XC-20 at any time, by following the steps in the [XC Registration section](/builders/interoperability/xcm/xc-registration/){target=\_blank}.  

XC-20s are a unique asset class on Moonbeam that blend the native interoperability of Substrate assets with a standard [ERC-20 interface](/builders/interoperability/xcm/xc20/interact/#the-erc20-interface){target=\_blank}. This means developers and users can interact with them just like any other ERC-20 token, with no Substrate knowledge needed, allowing seamless integration with EVM-based smart contracts (such as DEXs, lending platforms, and more) and familiar Ethereum development frameworks.

![Moonbeam XC-20 XCM Integration With Polkadot](/images/builders/interoperability/xcm/overview/overview-3.webp)

This page aims to cover the basics on XC-20s; if you want to learn how to interact with or transfer XC-20s, please refer to the [Interact with XC-20s](/builders/interoperability/xcm/xc20/interact/){target=\_blank} or the [Using the X-Tokens Precompile To Send XC-20s](/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/){target=\_blank} guides.

## Types of XC-20s {: #types-of-xc-20s }

There are two types of XC-20s: local and external.

### What are Local XC-20s? {: #local-xc20s }

Local XC-20s are all ERC-20s that exist on the EVM, and that can be transferred cross-chain through XCM. For local XC-20s to be transferred to another parachain, the asset must be registered on that chain. When transferring local XC-20s, the underlying tokens reside in the destination chain's Sovereign account on Moonbeam. Local XC-20s must follow [the ERC-20 interface outlined in this guide](/builders/interoperability/xcm/xc20/interact/#the-erc20-interface){target=\_blank}. They must implement the standard ERC-20 function signatures, including the correct function selector of the `transfer` function as described in [EIP-20](https://eips.ethereum.org/EIPS/eip-20){target=\_blank}. However, additional functionality can still be added as long as it doesn’t break the base methods. 

Note that, post-RT2301, creating a local XC-20 is equivalent to simply deploying a standard ERC-20 and enabling cross-chain features.

### What are External XC-20s? {: #external-xc20s }

External XC-20s are native cross-chain assets originating from another parachain or the relay chain and have wrapped representations minted on Moonbeam. These assets are Substrate assets at their core. When transferring external XC-20s, the underlying native tokens reside in Moonbeam's Sovereign account in each chain. Recall that a Sovereign account is a special type of keyless account that can hold assets and interact with other chains and is governed by Moonbeam’s runtime rather than by any individual. The wrapped versions can then be freely utilized on Moonbeam.

External XC-20s all have _xc_ prepended to their names to distinguish them as native cross-chain assets. For example, DOT, native to the Polkadot relay chain, is known as xcDOT when it exists in XC-20 form on Moonbeam. 

### Local XC-20s vs External XC-20s {: #xc-20-comparison }

Both local and external XC-20s can be transferred to other parachains as if they were Substrate assets, using the Ethereum or Substrate API. However, when using the Substrate API, EVM logs are generated for local XC-20s but not for external ones. As a result, the Ethereum API is recommended for better visibility in EVM-based explorers such as [Moonscan](https://moonscan.io){target=\_blank}.

Within Moonbeam, local XC-20s can only be transferred via their standard ERC-20 interface. By contrast, external XC-20s support both the Substrate and ERC-20 interfaces. Remember that transfers of external XC-20s through the Substrate API will not appear in EVM-based explorers; only transactions performed via the Ethereum API are visible in those explorers.

The key difference is that local XC-20s are EVM-native ERC-20s with XCM capabilities, whereas external XC-20s are inherently Substrate assets that expose an ERC-20 interface.

Cross-chain transfers of XC-20s are done using the Polkadot XCM Pallet. To learn how to use this pallet to transfer XC-20s, you can refer to the [Using the Polkadot XCM Pallet](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=\_blank} guide.

## Asset Reserves 

### Remote Reserve Assets

A remote reserve asset is a token whose canonical ledger—the source of truth for minting and burning—resides on a chain different from where it’s currently in use. In the case of xcDOT on Moonbeam, the underlying DOT tokens representing the xcDOT remain locked in Moonbeam’s sovereign account on the Polkadot relay chain, while xcDOT functions as a wrapped representation in Moonbeam’s EVM environment.

Users can hold and transact with xcDOT on Moonbeam (for DeFi, governance, and more), knowing that the underlying DOT is safely locked on the relay chain. At any point, the wrapped xcDOT can be redeemed for the original DOT, effectively burning the xcDOT and unlocking the corresponding DOT tokens on Polkadot.

### Local Reserve Assets 

A local reserve asset on Moonbeam is a token whose canonical ledger—from an XCM perspective—resides natively on Moonbeam. In other words, Moonbeam is the asset’s home chain, where minting and burning take place. 

For example, Wormhole-wrapped ETH (wETH) is considered a local reserve asset on Moonbeam, even though Ethereum is the ultimate source of ETH. Once ETH is wrapped by Wormhole and enters the Polkadot ecosystem via Moonbeam, wETH can be transferred to other parachains through [Moonbeam Routed Liquidity (MRL)](/builders/interoperability/mrl/){target=\_blank}.

The important caveat is that, on a purely Ethereum-level view, ETH remains governed by and minted on Ethereum. However, from an XCM standpoint, wETH on Moonbeam is treated as a local reserve asset, meaning the canonical supply of wETH (as far as Polkadot ecosystems are concerned) exists on Moonbeam.

## Multilocation Overview

A [multilocation](/builders/interoperability/xcm/core-concepts/multilocations/){target=\_blank} is a structured way to pinpoint where an asset or account lives in the Polkadot/Kusama ecosystem. It specifies how many hops up or down the chain hierarchy are needed (the parents), and which detailed paths (the interior junctions) must be followed to get to a specific parachain, account, pallet, or asset.

When you see an XC-20 on Moonbeam that’s not native to Moonbeam (for example, xcDOT or xcASTR), it corresponds to a foreign asset whose reserve or home is on another parachain or the relay chain.

Keep in mind that multilocations are always relative to a current position. For instance, defining a multilocation on Moonbeam differs from defining one on the Polkadot relay chain, even if both refer to the same asset. The multilocation identifies the asset’s origin chain and asset ID so the XCM virtual machine knows precisely where to lock, unlock, or update tokens. It identifies that asset’s origin chain and asset ID so that XCM knows:

- Where to lock/unlock the real tokens (on the origin chain)
- How to mint/burn the wrapped representation on Moonbeam (critical to ensuring correct redemptions on the origin chain)

As an example, to construct a multilocation identifying Moonbeam’s native asset, imagine sending tokens from another parachain. In that case, you often set parents: `1` to move up to the relay chain level, then include two junctions under interior. The first `({ Parachain: 2004 })` indicates Moonbeam’s parachain ID, while the second `({ PalletInstance: 10 })` identifies the Balances pallet that manages the native asset, GLMR. This multilocation defines GLMR from the perspective of another parachain. For more information on defining and constructing multilocations, be sure to check the [multilocations guide](/builders/interoperability/xcm/core-concepts/multilocations/){target=\_blank}.

## Current List of External XC-20s {: #current-xc20-assets }

The current list of available external XC-20 assets per network is as follows:

=== "Moonbeam"
    |        Origin         |  Symbol   |                                                            XC-20 Address                                                             |
    |:---------------------:|:---------:|:------------------------------------------------------------------------------------------------------------------------------------:|
    |       Polkadot        |   xcDOT   |  [0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080](https://moonscan.io/token/0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080){target=\_blank}  |
    |         Acala         |  xcaSEED  |  [0xfFfFFFFF52C56A9257bB97f4B2b6F7B2D624ecda](https://moonscan.io/token/0xfFfFFFFF52C56A9257bB97f4B2b6F7B2D624ecda){target=\_blank}  |
    |         Acala         |   xcACA   |  [0xffffFFffa922Fef94566104a6e5A35a4fCDDAA9f](https://moonscan.io/token/0xffffFFffa922Fef94566104a6e5A35a4fCDDAA9f){target=\_blank}  |
    |         Acala         |  xcLDOT   |  [0xFFfFfFffA9cfFfa9834235Fe53f4733F1b8B28d4](https://moonscan.io/token/0xFFfFfFffA9cfFfa9834235Fe53f4733F1b8B28d4){target=\_blank}  |
    |        Apillon        |  xcNCTR   |  [0xFfFFfFfF8A9736B44EbF188972725bED67BF694E](https://moonscan.io/token/0xFfFFfFfF8A9736B44EbF188972725bED67BF694E){target=\_blank}  |
    |         Astar         |  xcASTR   |  [0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf](https://moonscan.io/token/0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf){target=\_blank}  |
    |        Bifrost        |   xcBNC   |  [0xFFffffFf7cC06abdF7201b350A1265c62C8601d2](https://moonscan.io/token/0xFFffffFf7cC06abdF7201b350A1265c62C8601d2){target=\_blank}  |
    |        Bifrost        |  xcBNCS   |  [0xfFfffffF6aF229AE7f0F4e0188157e189a487D59](https://moonscan.io/token/0xfFfffffF6aF229AE7f0F4e0188157e189a487D59){target=\_blank}  |
    |        Bifrost        |   xcFIL   |  [0xfFFfFFFF6C57e17D210DF507c82807149fFd70B2](https://moonscan.io/token/0xfFFfFFFF6C57e17D210DF507c82807149fFd70B2){target=\_blank}  |
    |        Bifrost        |  xcvASTR  |  [0xFffFffff55C732C47639231a4C4373245763d26E](https://moonscan.io/token/0xFffFffff55C732C47639231a4C4373245763d26E){target=\_blank}  |
    |        Bifrost        |  xcvDOT   |  [0xFFFfffFf15e1b7E3dF971DD813Bc394deB899aBf](https://moonscan.io/token/0xFFFfffFf15e1b7E3dF971DD813Bc394deB899aBf){target=\_blank}  |
    |        Bifrost        |  xcvFIL   |  [0xFffffFffCd0aD0EA6576B7b285295c85E94cf4c1](https://moonscan.io/token/0xFffffFffCd0aD0EA6576B7b285295c85E94cf4c1){target=\_blank}  |
    |        Bifrost        |  xcvGLMR  |  [0xFfFfFFff99dABE1a8De0EA22bAa6FD48fdE96F6c](https://moonscan.io/token/0xFfFfFFff99dABE1a8De0EA22bAa6FD48fdE96F6c){target=\_blank}  |
    |        Bifrost        | xcvMANTA  |  [0xFFfFFfFfdA2a05FB50e7ae99275F4341AEd43379](https://moonscan.io/token/0xFFfFFfFfdA2a05FB50e7ae99275F4341AEd43379){target=\_blank}  |
    |      Centrifuge       |   xcCFG   |  [0xFFfFfFff44bD9D2FFEE20B25D1Cf9E78Edb6Eae3](https://moonscan.io/token/0xFFfFfFff44bD9D2FFEE20B25D1Cf9E78Edb6Eae3){target=\_blank}  |
    |      Composable       | xcIBCMOVR |  [0xFfFfffFF3AFcd2cAd6174387df17180a0362E592](https://moonscan.io/token/0xFfFfffFF3AFcd2cAd6174387df17180a0362E592){target=\_blank}  |
    |      Composable       | xcIBCPICA |  [0xfFFFFfFFABe9934e61db3b11be4251E6e869cf59](https://moonscan.io/token/0xfFFFFfFFABe9934e61db3b11be4251E6e869cf59){target=\_blank}  |
    |      Composable       | xcIBCIST  |  [0xfFfFffff6A3977d5B65D1044FD744B14D9Cef932](https://moonscan.io/token/0xfFfFffff6A3977d5B65D1044FD744B14D9Cef932){target=\_blank}  |
    |      Composable       | xcIBCBLD  |  [0xFffFffff9664be0234ea4dc64558F695C4f2A9EE](https://moonscan.io/token/0xFffFffff9664be0234ea4dc64558F695C4f2A9EE){target=\_blank}  |
    |      Composable       | xcIBCTIA  |  [0xFFFfFfff644a12F6F01b754987D175F5A780A75B](https://moonscan.io/token/0xFFFfFfff644a12F6F01b754987D175F5A780A75B){target=\_blank}  |
    |      Composable       | xcIBCATOM |  [0xffFFFffF6807D5082ff2f6F86BdE409245e2D953](https://moonscan.io/token/0xffFFFffF6807D5082ff2f6F86BdE409245e2D953){target=\_blank}  |
    |       Darwinia        |  xcRING   |  [0xFfffFfff5e90e365eDcA87fB4c8306Df1E91464f](https://moonscan.io/token/0xFfffFfff5e90e365eDcA87fB4c8306Df1E91464f){target=\_blank}  |
    |          DED          |   xcDED   |  [0xfFffFFFf5da2d7214D268375cf8fb1715705FdC6](https://moonscan.io/token/0xfFffFFFf5da2d7214D268375cf8fb1715705FdC6){target=\_blank}  |
    |      Equilibrium      |   xcEQ    |  [0xFffFFfFf8f6267e040D8a0638C576dfBa4F0F6D6](https://moonscan.io/token/0xFffFFfFf8f6267e040D8a0638C576dfBa4F0F6D6){target=\_blank}  |
    |      Equilibrium      |   xcEQD   |  [0xFFffFfFF8cdA1707bAF23834d211B08726B1E499](https://moonscan.io/token/0xFFffFfFF8cdA1707bAF23834d211B08726B1E499){target=\_blank}  |
    |        HydraDX        |   xcHDX   |  [0xFFFfFfff345Dc44DDAE98Df024Eb494321E73FcC](https://moonscan.io/token/0xFFFfFfff345Dc44DDAE98Df024Eb494321E73FcC){target=\_blank}  |
    |       Interlay        |  xcIBTC   |  [0xFFFFFfFf5AC1f9A51A93F5C527385edF7Fe98A52](https://moonscan.io/token/0xFFFFFfFf5AC1f9A51A93F5C527385edF7Fe98A52){target=\_blank}  |
    |       Interlay        |  xcINTR   |  [0xFffFFFFF4C1cbCd97597339702436d4F18a375Ab](https://moonscan.io/token/0xFffFFFFF4C1cbCd97597339702436d4F18a375Ab){target=\_blank}  |
    |         Manta         |  xcMANTA  |  [0xfFFffFFf7D3875460d4509eb8d0362c611B4E841](https://moonscan.io/token/0xfFFffFFf7D3875460d4509eb8d0362c611B4E841){target=\_blank}  |
    |         Nodle         |  xcNODL   |  [0xfffffffFe896ba7Cb118b9Fa571c6dC0a99dEfF1](https://moonscan.io/token/0xfffffffFe896ba7Cb118b9Fa571c6dC0a99dEfF1){target=\_blank}  |
    | OriginTrail Parachain |  xcNEURO  |  [0xFfffffFfB3229c8E7657eABEA704d5e75246e544](https://moonscan.io/token/0xFfffffFfB3229c8E7657eABEA704d5e75246e544){target=\_blank}  |
    |       Parallel        |  xcPARA   |  [0xFfFffFFF18898CB5Fe1E88E668152B4f4052A947](https://moonscan.io/token/0xFfFffFFF18898CB5Fe1E88E668152B4f4052A947){target=\_blank}  |
    |         Peaq          |  xcPEAQ   |  [0xFffFFFFFEC4908b74688a01374f789B48E9a3eab](https://moonscan.io/token/0xFffFFFFFEC4908b74688a01374f789B48E9a3eab){target=\_blank}  |
    |       Pendulum        |   xcPEN   |  [0xffFFfFFf2257622F345E1ACDe0D4f46D7d1D77D0](https://moonscan.io/token/0xffFFfFFf2257622F345E1ACDe0D4f46D7d1D77D0){target=\_blank}  |
    |         Phala         |   xcPHA   |  [0xFFFfFfFf63d24eCc8eB8a7b5D0803e900F7b6cED](https://moonscan.io/token/0xFFFfFfFf63d24eCc8eB8a7b5D0803e900F7b6cED){target=\_blank}  |
    |       Polkadex        |  xcPDEX   |  [0xfFffFFFF43e0d9b84010b1b67bA501bc81e33C7A](https://moonscan.io/token/0xfFffFFFF43e0d9b84010b1b67bA501bc81e33C7A){target=\_blank}  |
    |  Polkadot Asset Hub   |  xcPINK   |  [0xfFfFFfFf30478fAFBE935e466da114E14fB3563d](https://moonscan.io/token/0xfFfFFfFf30478fAFBE935e466da114E14fB3563d){target=\_blank}  |
    |  Polkadot Asset Hub   |  xcSTINK  |  [0xFffFffFf54c556bD1d0F64ec6c78f1B477525E56](https://moonscan.io/token/0xFffFffFf54c556bD1d0F64ec6c78f1B477525E56){target=\_blank}  |
    |  Polkadot Asset Hub   |  xcUSDC   |  [0xFFfffffF7D2B0B761Af01Ca8e25242976ac0aD7D](https://moonscan.io/token/0xFFfffffF7D2B0B761Af01Ca8e25242976ac0aD7D){target=\_blank}  |
    |  Polkadot Asset Hub   |  xcUSDT   |  [0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d](https://moonscan.io/token/0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d){target=\_blank}  |
    |  Polkadot Asset Hub   |  xcWIFD   |  [0xfffffffF2e1D1ac9eA1686255bEfe995B31abc96](https://moonscan.io/token/0xfffffffF2e1D1ac9eA1686255bEfe995B31abc96){target=\_blank}  |
    |      Snowbridge       |  WBTC.e   | [0xfFffFFFf1B4Bb1ac5749F73D866FfC91a3432c47](https://moonscan.io/address/0xffffffff1B4BB1AC5749F73D866FFC91A3432C47){target=\_blank} |
    |      Snowbridge       | wstETH.e  |  [0xFfFFFfFF5D5DEB44BF7278DEE5381BEB24CB6573](https://moonscan.io/token/0xFfFFFfFF5D5DEB44BF7278DEE5381BEB24CB6573){target=\_blank}  |
    |      Snowbridge       |  WETH.e   |  [0xfFffFFFF86829AFE1521AD2296719DF3ACE8DED7](https://moonscan.io/token/0xfFffFFFF86829AFE1521AD2296719DF3ACE8DED7){target=\_blank}  |
    |       Subsocial       |   xcSUB   |  [0xfFfFffFf43B4560Bc0C451a3386E082bff50aC90](https://moonscan.io/token/0xfFfFffFf43B4560Bc0C451a3386E082bff50aC90){target=\_blank}  |
    |        Unique         |   xcUNQ   |  [0xFffffFFFD58f77E6693CFB99EbE273d73C678DC2](https://moonscan.io/token/0xFffffFFFD58f77E6693CFB99EbE273d73C678DC2){target=\_blank}  |
    |       Zeitgeist       |   xcZTG   |  [0xFFFFfffF71815ab6142E0E20c7259126C6B40612](https://moonscan.io/token/0xFFFFfffF71815ab6142E0E20c7259126C6B40612){target=\_blank}  |

     _*You can check each [Asset ID](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/assets){target=\_blank} on Polkadot.js Apps_

=== "Moonriver"
    |      Origin      | Symbol  |                                                                XC-20 Address                                                                 |
    |:----------------:|:-------:|:--------------------------------------------------------------------------------------------------------------------------------------------:|
    |      Kusama      |  xcKSM  | [0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080](https://moonriver.moonscan.io/token/0xffffffff1fcacbd218edc0eba20fc2308c778080){target=\_blank} |
    |     Bifrost      |  xcBNC  | [0xFFfFFfFFF075423be54811EcB478e911F22dDe7D](https://moonriver.moonscan.io/token/0xFFfFFfFFF075423be54811EcB478e911F22dDe7D){target=\_blank} |
    |     Bifrost      | xcvBNC  | [0xFFffffff3646A00f78caDf8883c5A2791BfCDdc4](https://moonriver.moonscan.io/token/0xFFffffff3646A00f78caDf8883c5A2791BfCDdc4){target=\_blank} |
    |     Bifrost      | xcvKSM  | [0xFFffffFFC6DEec7Fc8B11A2C8ddE9a59F8c62EFe](https://moonriver.moonscan.io/token/0xFFffffFFC6DEec7Fc8B11A2C8ddE9a59F8c62EFe){target=\_blank} |
    |     Bifrost      | xcvMOVR | [0xfFfffFfF98e37bF6a393504b5aDC5B53B4D0ba11](https://moonriver.moonscan.io/token/0xfFfffFfF98e37bF6a393504b5aDC5B53B4D0ba11){target=\_blank} |
    |     Calamari     |  xcKMA  | [0xffffffffA083189F870640B141AE1E882C2B5BAD](https://moonriver.moonscan.io/token/0xffffffffA083189F870640B141AE1E882C2B5BAD){target=\_blank} |
    |       Crab       | xcCRAB  | [0xFFFffFfF8283448b3cB519Ca4732F2ddDC6A6165](https://moonriver.moonscan.io/token/0xFFFffFfF8283448b3cB519Ca4732F2ddDC6A6165){target=\_blank} |
    |   Crust-Shadow   |  xcCSM  | [0xffFfFFFf519811215E05eFA24830Eebe9c43aCD7](https://moonriver.moonscan.io/token/0xffFfFFFf519811215E05eFA24830Eebe9c43aCD7){target=\_blank} |
    |      Heiko       |  xcHKO  | [0xffffffFF394054BCDa1902B6A6436840435655a3](https://moonriver.moonscan.io/token/0xffffffFF394054BCDa1902B6A6436840435655a3){target=\_blank} |
    |    Integritee    | xcTEER  | [0xFfFfffFf4F0CD46769550E5938F6beE2F5d4ef1e](https://moonriver.moonscan.io/token/0xFfFfffFf4F0CD46769550E5938F6beE2F5d4ef1e){target=\_blank} |
    |      Karura      |  xcKAR  | [0xFfFFFFfF08220AD2E6e157f26eD8bD22A336A0A5](https://moonriver.moonscan.io/token/0xFfFFFFfF08220AD2E6e157f26eD8bD22A336A0A5){target=\_blank} |
    |      Karura      | xcaSEED | [0xFfFffFFfa1B026a00FbAA67c86D5d1d5BF8D8228](https://moonriver.moonscan.io/token/0xFfFffFFfa1B026a00FbAA67c86D5d1d5BF8D8228){target=\_blank} |
    |      Khala       |  xcPHA  | [0xffFfFFff8E6b63d9e447B6d4C45BDA8AF9dc9603](https://moonriver.moonscan.io/token/0xffFfFFff8E6b63d9e447B6d4C45BDA8AF9dc9603){target=\_blank} |
    |     Kintsugi     | xcKINT  | [0xfffFFFFF83F4f317d3cbF6EC6250AeC3697b3fF2](https://moonriver.moonscan.io/token/0xfffFFFFF83F4f317d3cbF6EC6250AeC3697b3fF2){target=\_blank} |
    |     Kintsugi     | xckBTC  | [0xFFFfFfFfF6E528AD57184579beeE00c5d5e646F0](https://moonriver.moonscan.io/token/0xFFFfFfFfF6E528AD57184579beeE00c5d5e646F0){target=\_blank} |
    | Kusama Asset Hub | xcRMRK  | [0xffffffFF893264794d9d57E1E0E21E0042aF5A0A](https://moonriver.moonscan.io/token/0xffffffFF893264794d9d57E1E0E21E0042aF5A0A){target=\_blank} |
    | Kusama Asset Hub | xcUSDT  | [0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d](https://moonriver.moonscan.io/token/0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d){target=\_blank} |
    |      Litmus      |  xcLIT  | [0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0](https://moonriver.moonscan.io/token/0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0){target=\_blank} |
    |     Mangata      |  xcMGX  | [0xffFfFffF58d867EEa1Ce5126A4769542116324e9](https://moonriver.moonscan.io/token/0xffFfFffF58d867EEa1Ce5126A4769542116324e9){target=\_blank} |
    |     Picasso      | xcPICA  | [0xFffFfFFf7dD9B9C60ac83e49D7E3E1f7A1370aD2](https://moonriver.moonscan.io/token/0xFffFfFFf7dD9B9C60ac83e49D7E3E1f7A1370aD2){target=\_blank} |
    |    Robonomics    |  xcXRT  | [0xFffFFffF51470Dca3dbe535bD2880a9CcDBc6Bd9](https://moonriver.moonscan.io/token/0xFffFFffF51470Dca3dbe535bD2880a9CcDBc6Bd9){target=\_blank} |
    |      Shiden      |  xcSDN  | [0xFFFfffFF0Ca324C842330521525E7De111F38972](https://moonriver.moonscan.io/token/0xFFFfffFF0Ca324C842330521525E7De111F38972){target=\_blank} |
    |    Tinkernet     | xcTNKR  | [0xfFFfFffF683474B842852111cc31d470bD8f5081](https://moonriver.moonscan.io/token/0xffffffff683474b842852111cc31d470bd8f5081){target=\_blank} |
    |      Turing      |  xcTUR  | [0xfFffffFf6448d0746f2a66342B67ef9CAf89478E](https://moonriver.moonscan.io/token/0xfFffffFf6448d0746f2a66342B67ef9CAf89478E){target=\_blank} |

    _*You can check each [Asset ID](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonriver.moonbeam.network#/assets){target=\_blank} on Polkadot.js Apps_

=== "Moonbase Alpha"
    |        Origin        | Symbol |                                                                XC-20 Address                                                                |
    |:--------------------:|:------:|:-------------------------------------------------------------------------------------------------------------------------------------------:|
    | Relay Chain Alphanet | xcUNIT | [0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080](https://moonbase.moonscan.io/token/0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080){target=\_blank} |

     _*You can check each [Asset ID](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=\_blank} on Polkadot.js Apps_

### Retrieve List of External XC-20s and Their Metadata {: #list-xchain-assets }

To fetch a list of the currently available external XC-20s along with their associated metadata, you can query the chain state using the [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=\_blank}. You'll take the following steps:

1. Create an API provider for the network you'd like to get the list of assets for. You can use the following WSS endpoints for each network:

    === "Moonbeam"

        ```text
        wss://wss.api.moonbeam.network
        ```

    === "Moonriver"

        ```text
        wss://wss.api.moonriver.moonbeam.network
        ```

    === "Moonbase Alpha"

        ```text
        {{ networks.moonbase.wss_url }}
        ```

2. Query the `assets` pallet for all assets
3. Iterate over the list of assets to get all of the asset IDs along with their associated metadata

```js
--8<-- 'code/builders/interoperability/xcm/xc20/overview/retrieve-xc20s.js'
```

The result will display the asset ID along with some additional information for all of the registered external XC-20s.

## Retrieve Local XC-20 Metadata {: #retrieve-local-xc20-metadata }

Since local XC-20s are ERC-20s on Moonbeam that can be transferred via XCM to another parachain, you can interact with local XC-20s like you would an ERC-20. As long as you have the address and the ABI of the ERC-20, you can retrieve its metadata by interacting with its ERC-20 interface to retrieve the name, symbol, and decimals for the asset.

The following is an example that retrieves the asset metadata for the [Jupiter token](https://moonbase.moonscan.io/token/0x9aac6fb41773af877a2be73c99897f3ddfacf576){target=\_blank} on Moonbase Alpha:

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc20/overview/local-xc20s/ethers.js'
    ```

=== "Web3.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc20/overview/local-xc20s/web3.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/interoperability/xcm/xc20/overview/local-xc20s/web3.py'
    ```
