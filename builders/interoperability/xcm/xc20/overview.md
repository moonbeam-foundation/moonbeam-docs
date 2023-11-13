---
title: XC-20s and Cross-Chain Assets
description: Learn about the types of cross-chain assets on Moonbeam, in particular, local and external XC-20s, and view a list of the external XC-20s on Moonbeam.
---

# Overview of XC-20s

## Introduction {: #introduction }

The [Cross-Consensus Message (XCM)](https://wiki.polkadot.network/docs/learn-crosschain){target=_blank} format defines how messages can be sent between interoperable blockchains. This format opens the door to transferring messages and assets (Substrate assets) between Moonbeam/Moonriver and the relay chain or other parachains in the Polkadot/Kusama ecosystems.

Substrate assets are natively interoperable. However, developers need to tap into the Substrate API to interact with them, with no real visibility into the EVM. Consquently, interoperable Substrate assets are not that attractive for developers building on the EVM. To fix that and to help developers tap into the native interoperability that Polkadot/Kusama offers, Moonbeam introduced the concept of XC-20s.

XC-20s are a unique asset class on Moonbeam. It combines the power of Substrate assets (native interoperability) but allows users and developers to interact with them through a familiar [ERC-20 interface](/builders/interoperability/xcm/xc20/interact#the-erc20-interface){target=_blank}. On the EVM side, XC-20s have an [ERC-20 interface](/builders/interoperability/xcm/xc20/interact#the-erc20-interface){target=_blank}, so smart contracts and users can easily interact with them, and no knowledge of Substrate is required. This ultimately provides greater flexibility for developers when working with these types of assets and allows seamless integrations with EVM-based smart contracts such as DEXs and lending platforms, among others. Moreover, developers can integrate XC-20s with regular [Ethereum development frameworks](/builders/build/eth-api/dev-env/){target=_blank} or dApps, and create connected contracts strategies with such assets. Moreover, with the introduction of [RT2301](https://github.com/moonbeam-foundation/moonbeam/tree/runtime-2301){target=_blank}, all ERC-20s are XCM-ready, meaning they can also be referred to as XC-20s.

![Moonbeam XC-20 XCM Integration With Polkadot](/images/builders/interoperability/xcm/overview/overview-4.png)

This page aims to cover the basics on XC-20s, if you want to learn how to interact with or transfer XC-20s, please refer to the [Interact with XC-20s](/builders/interoperability/xcm/xc20/interact){target=_blank} or the [Using the X-Tokens Pallet To Send XC-20s](/builders/interoperability/xcm/xc20/xtokens){target=_blank} guides.

## Types of XC-20s {: #types-of-xc-20s }

There are two types of XC-20s: local and external.

### What are Local XC-20s? {: #local-xc20s }

Local XC-20s are all ERC-20s that exist on the EVM, and that can be transferred cross-chain through XCM. In order for local XC-20s to be transferred to another parachain, the asset needs to be registered on that chain. When transferring local XC-20s, the actual tokens reside in the destination chain's Sovereign account on Moonbeam. Local XC-20s must follow [the ERC-20 interface outlined in this guide](/builders/interoperability/xcm/xc20/interact#the-erc20-interface){target=_blank}, they cannot be customized ERC-20s. More specifically, the function selector of the `transfer` function must be as described in [EIP-20](https://eips.ethereum.org/EIPS/eip-20){target=_blank}:

```js
function transfer(address _to, uint256 _value) public returns (bool success)
```

If the function selector of the `transfer` function deviates from the standard, the cross-chain transfer will fail.

### What are External XC-20s? {: #external-xc20s }

External XC-20s are native cross-chain assets that are transferred from another parachain or the relay chain to Moonbeam. These assets are Substrate assets at their core. When transferring external XC-20s, the actual tokens reside in Moonbeam's Sovereign account in each of these chains. External XC-20s will all have _xc_ prepended to their names to distinguish them as native cross-chain assets.

### Local XC-20s vs External XC-20s {: #xc-20-comparison }

Both types of XC-20s can be easily sent to other parachains in the ecosystem as if they were Substrate assets, through both the Ethereum and Substrate API. However, using the Substrate API for XCM transfer will emit EVM logs for local XC-20s, but not for external XC-20s. Using the Ethereum API is recommended to provide more visibility into the XCM actions through EVM-based explorers, such as [Moonscan](https://moonscan.io){target=_blank}.

Within Moonbeam, local XC-20s can only be transferred through their regular ERC-20 interface. On the contrary, external XC-20s can be transferred through both interfaces (Substrate and ERC-20). If external XC-20s are transferred through the Substrate API, the transaction won't be visible from EVM-based block explorers. Only transactions done via the Ethereum API are visible through such explorers.

The main difference between these two types of assets is that local XC-20s are EVM ERC-20s that have XCM capabilities, while external XC-20s are Substrate assets with an ERC-20 interface on top.

Cross-chain transfers of XC-20s are done using the [X-Tokens Pallet](/builders/interoperability/xcm/xc20/xtokens/){target=_blank}. To learn how to use the X-Tokens Pallet to transfer XC-20s, you can refer to the [Using the X-Tokens Pallet To Send XC-20s](/builders/interoperability/xcm/xc20/xtokens){target=_blank} guide.

## Current List of External XC-20s {: #current-xc20-assets }

The current list of available external XC-20 assets per network is as follows:

=== "Moonbeam"
    |       Origin       | Symbol |                                                           XC-20 Address                                                           |
    |:------------------:|:------:|:---------------------------------------------------------------------------------------------------------------------------------:|
    |      Polkadot      | xcDOT  | [0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080](https://moonscan.io/token/0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080){target=_blank} |
    |       Acala        | xcaUSD | [0xfFfFFFFF52C56A9257bB97f4B2b6F7B2D624ecda](https://moonscan.io/token/0xfFfFFFFF52C56A9257bB97f4B2b6F7B2D624ecda){target=_blank} |
    |       Acala        | xcACA  | [0xffffFFffa922Fef94566104a6e5A35a4fCDDAA9f](https://moonscan.io/token/0xffffFFffa922Fef94566104a6e5A35a4fCDDAA9f){target=_blank} |
    |       Astar        | xcASTR | [0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf](https://moonscan.io/token/0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf){target=_blank} |
    |      Bifrost       | xcBNC  | [0xffffffff7cc06abdf7201b350a1265c62c8601d2](https://moonscan.io/token/0xffffffff7cc06abdf7201b350a1265c62c8601d2){target=_blank} |
    |      Darwinia      | xcRING | [0xFfffFfff5e90e365eDcA87fB4c8306Df1E91464f](https://moonscan.io/token/0xFfffFfff5e90e365eDcA87fB4c8306Df1E91464f){target=_blank} |
    |      Interlay      | xcIBTC | [0xFFFFFfFf5AC1f9A51A93F5C527385edF7Fe98A52](https://moonscan.io/token/0xFFFFFfFf5AC1f9A51A93F5C527385edF7Fe98A52){target=_blank} |
    |      Interlay      | xcINTR | [0xFffFFFFF4C1cbCd97597339702436d4F18a375Ab](https://moonscan.io/token/0xFffFFFFF4C1cbCd97597339702436d4F18a375Ab){target=_blank} |
    |      Parallel      | xcPARA | [0xFfFffFFF18898CB5Fe1E88E668152B4f4052A947](https://moonscan.io/token/0xFfFffFFF18898CB5Fe1E88E668152B4f4052A947){target=_blank} |
    |       Phala        | xcPHA  | [0xFFFfFfFf63d24eCc8eB8a7b5D0803e900F7b6cED](https://moonscan.io/token/0xFFFfFfFf63d24eCc8eB8a7b5D0803e900F7b6cED){target=_blank} |
    | Polkadot Asset Hub | xcUSDT | [0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d](https://moonscan.io/token/0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d){target=_blank} |

     _*You can check each [Asset ID](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/assets){target=_blank} on Polkadot.js Apps_

=== "Moonriver"
    |      Origin      | Symbol |                                                                XC-20 Address                                                                |
    |:----------------:|:------:|:-------------------------------------------------------------------------------------------------------------------------------------------:|
    |      Kusama      | xcKSM  | [0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080](https://moonriver.moonscan.io/token/0xffffffff1fcacbd218edc0eba20fc2308c778080){target=_blank} |
    |     Bifrost      | xcBNC  | [0xFFfFFfFFF075423be54811EcB478e911F22dDe7D](https://moonriver.moonscan.io/token/0xFFfFFfFFF075423be54811EcB478e911F22dDe7D){target=_blank} |
    |     Calamari     | xcKMA  | [0xffffffffA083189F870640B141AE1E882C2B5BAD](https://moonriver.moonscan.io/token/0xffffffffA083189F870640B141AE1E882C2B5BAD){target=_blank} |
    |       Crab       | xcCRAB | [0xFFFffFfF8283448b3cB519Ca4732F2ddDC6A6165](https://moonriver.moonscan.io/token/0xFFFffFfF8283448b3cB519Ca4732F2ddDC6A6165){target=_blank} |
    |   Crust-Shadow   | xcCSM  | [0xffFfFFFf519811215E05eFA24830Eebe9c43aCD7](https://moonriver.moonscan.io/token/0xffFfFFFf519811215E05eFA24830Eebe9c43aCD7){target=_blank} |
    |      Heiko       | xcHKO  | [0xffffffFF394054BCDa1902B6A6436840435655a3](https://moonriver.moonscan.io/token/0xffffffFF394054BCDa1902B6A6436840435655a3){target=_blank} |
    |    Integritee    | xcTEER | [0xFfFfffFf4F0CD46769550E5938F6beE2F5d4ef1e](https://moonriver.moonscan.io/token/0xFfFfffFf4F0CD46769550E5938F6beE2F5d4ef1e){target=_blank} |
    |      Karura      | xcKAR  | [0xFfFFFFfF08220AD2E6e157f26eD8bD22A336A0A5](https://moonriver.moonscan.io/token/0xFfFFFFfF08220AD2E6e157f26eD8bD22A336A0A5){target=_blank} |
    |      Karura      | xcaUSD | [0xFfFffFFfa1B026a00FbAA67c86D5d1d5BF8D8228](https://moonriver.moonscan.io/token/0xFfFffFFfa1B026a00FbAA67c86D5d1d5BF8D8228){target=_blank} |
    |      Khala       | xcPHA  | [0xffFfFFff8E6b63d9e447B6d4C45BDA8AF9dc9603](https://moonriver.moonscan.io/token/0xffFfFFff8E6b63d9e447B6d4C45BDA8AF9dc9603){target=_blank} |
    |     Kintsugi     | xcKINT | [0xfffFFFFF83F4f317d3cbF6EC6250AeC3697b3fF2](https://moonriver.moonscan.io/token/0xfffFFFFF83F4f317d3cbF6EC6250AeC3697b3fF2){target=_blank} |
    |     Kintsugi     | xckBTC | [0xFFFfFfFfF6E528AD57184579beeE00c5d5e646F0](https://moonriver.moonscan.io/token/0xFFFfFfFfF6E528AD57184579beeE00c5d5e646F0){target=_blank} |
    |      Litmus      | xcLIT  | [0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0](https://moonriver.moonscan.io/token/0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0){target=_blank} |
    |    Robonomics    | xcXRT  | [0xFffFFffF51470Dca3dbe535bD2880a9CcDBc6Bd9](https://moonriver.moonscan.io/token/0xFffFFffF51470Dca3dbe535bD2880a9CcDBc6Bd9){target=_blank} |
    |      Shiden      | xcSDN  | [0xFFFfffFF0Ca324C842330521525E7De111F38972](https://moonriver.moonscan.io/token/0xFFFfffFF0Ca324C842330521525E7De111F38972){target=_blank} |
    | Kusama Asset Hub | xcRMRK | [0xffffffFF893264794d9d57E1E0E21E0042aF5A0A](https://moonriver.moonscan.io/token/0xffffffFF893264794d9d57E1E0E21E0042aF5A0A){target=_blank} |
    | Kusama Asset Hub | xcUSDT | [0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d](https://moonriver.moonscan.io/token/0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d){target=_blank} |

    _*You can check each [Asset ID](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonriver.moonbeam.network#/assets){target=_blank} on Polkadot.js Apps_

=== "Moonbase Alpha"
    |        Origin         |  Symbol  |                                                               XC-20 Address                                                                |
    |:---------------------:|:--------:|:------------------------------------------------------------------------------------------------------------------------------------------:|
    | Relay Chain Alphanet  |  xcUNIT  | [0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080](https://moonbase.moonscan.io/token/0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080){target=_blank} |
    |   Basilisk Alphanet   |  xcBSX   | [0xFFfFfFfF4d0Ff56d0097BBd14920eaC488540BFA](https://moonbase.moonscan.io/token/0xFFfFfFfF4d0Ff56d0097BBd14920eaC488540BFA){target=_blank} |
    |    Clover Alphanet    |  xcCLV   | [0xFfFfFffFD3ba399d7D9d684D94b22767a5FA1cCA](https://moonbase.moonscan.io/token/0xFfFfFffFD3ba399d7D9d684D94b22767a5FA1cCA){target=_blank} |
    | Crust/Shadow Alphanet |  xcCSM   | [0xffFfFFFf519811215E05eFA24830Eebe9c43aCD7](https://moonbase.moonscan.io/token/0xffFfFFFf519811215E05eFA24830Eebe9c43aCD7){target=_blank} |
    |  Integritee Alphanet  |  xcTEER  | [0xFfFfffFf4F0CD46769550E5938F6beE2F5d4ef1e](https://moonbase.moonscan.io/token/0xFfFfffFf4F0CD46769550E5938F6beE2F5d4ef1e){target=_blank} |
    |   Kintsugi Alphanet   |  xckBTC  | [0xFffFfFff5C2Ec77818D0863088929C1106635d26](https://moonbase.moonscan.io/token/0xFffFfFff5C2Ec77818D0863088929C1106635d26){target=_blank} |
    |   Kintsugi Alphanet   |  xcKINT  | [0xFFFfffff27C019790DFBEE7cB70F5996671B2882](https://moonbase.moonscan.io/token/0xFFFfffff27C019790DFBEE7cB70F5996671B2882){target=_blank} |
    |   Litentry Alphanet   |  xcLIT   | [0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0](https://moonbase.moonscan.io/token/0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0){target=_blank} |
    |   Pangolin Alphanet   | xcPARING | [0xFFFffFfF8283448b3cB519Ca4732F2ddDC6A6165](https://moonbase.moonscan.io/token/0xFFFffFfF8283448b3cB519Ca4732F2ddDC6A6165){target=_blank} |
    |  Alphanet Asset Hub   |  xcTT1   | [0xfFffFfFf75976211C786fe4d73d2477e222786Ac](https://moonbase.moonscan.io/token/0xfFffFfFf75976211C786fe4d73d2477e222786Ac){target=_blank} |

     _*You can check each [Asset ID](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=_blank} on Polkadot.js Apps_

### Retrieve List of External XC-20s and Their Metadata {: #list-xchain-assets }

To fetch a list of the currently available external XC-20s along with their associated metadata, you can query the chain state using the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api){target=_blank}. You'll take the following steps:

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

The following is an example that retrieves the asset metadata for the [Jupiter token](https://moonbase.moonscan.io/token/0x9aac6fb41773af877a2be73c99897f3ddfacf576){target=_blank} on Moonbase Alpha:

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
