---
title: XC-20 和跨链资产
description: 了解 Moonbeam 上的跨链资产类型，特别是本地和外部 XC-20，并查看 Moonbeam 上的外部 XC-20 列表。
categories: Basics, XC-20
---

# XC-20 概述

## 简介 {: #introduction }

[跨共识消息 (XCM)](https://wiki.polkadot.com/learn/learn-xcm/){target=\_blank} 格式为区块链交换消息和转移资产提供了一种通用方式。为了将这种互操作性扩展到 EVM，Moonbeam 引入了 XC-20，这是一种 Moonbeam 上的 ERC-20 代币，它与 XCM 转移完全兼容。

在 Moonbeam 上部署的任何 ERC-20 都可以配置为 XC-20，从而可以通过 XCM 访问连接的任何链。这使得专注于 EVM 的开发人员可以使用熟悉的 ERC-20 工作流程，同时受益于 Polkadot 的原生跨链功能，而无需 Substrate 方面的专业知识。

从技术角度来看，本地 XC-20 是源自 Moonbeam 的 ERC-20 代币（包括在 Moonbeam 上发行后被视为原生的桥接代币），而外部 XC-20 是代币的包装表示，其规范账本存在于另一个平行链或中继链上。在所有情况下，XC-20 的功能都与标准 ERC-20 相同——支持常见的基于 EVM 的用例（例如 DeFi、DEX 和借贷平台）——但具有无缝跨链互操作性的额外优势。

![Moonbeam XC-20 与 Polkadot 的 XCM 集成](/images/builders/interoperability/xcm/overview/overview-3.webp)

本页面旨在介绍 XC-20 的基础知识；如果您想了解如何与 XC-20 交互或转移 XC-20，请参阅 [发送 XC-20 指南](/builders/interoperability/xcm/xc20/send-xc20s/overview/){target=\_blank}。

## XC-20 的类型 {: #types-of-xc-20s }

XC-20 有两种类型：本地和外部。

### 什么是本地 XC-20？ {: #local-xc20s }

本地 XC-20 是指 EVM 上存在的所有 ERC-20，可以通过 XCM 进行跨链转移。为了将本地 XC-20 转移到另一个平行链，必须在该链上注册资产。当转移本地 XC-20 时，底层代币驻留在目标链在 Moonbeam 上的主权账户中。[主权账户](/builders/interoperability/xcm/core-concepts/sovereign-accounts/){target=\_blank} 是由区块链运行时（而不是个人）管理的无密钥账户，可以持有资产并与其他链交互。本地 XC-20 必须遵循[本指南中概述的 ERC-20 接口](/builders/interoperability/xcm/xc20/interact/#the-erc20-interface){target=\_blank}。它们必须实现标准的 ERC-20 函数签名，包括 [EIP-20](https://eips.ethereum.org/EIPS/eip-20){target=\_blank} 中描述的 `transfer` 函数的正确函数选择器。但是，只要不破坏基本方法，仍然可以添加其他功能。

创建本地 XC-20 相当于部署一个标准的 ERC-20 并在任何 Moonbeam 网络上启用跨链功能。

### 什么是外部 XC-20？ {: #external-xc20s }

外部 XC-20 是源自另一个平行链或中继链的跨链代币，它们在 Moonbeam 上表示为 ERC-20 代币。原始代币仍然锁定在其主链上的 Moonbeam 主权账户中，而包装后的 ERC-20 表示形式可以在 Moonbeam 上自由使用。当您转移外部 XC-20 时，规范资产仍然位于其源链的主权账户中，而 ERC-20 表示形式是在 Moonbeam 上流通的内容。

外部 XC-20 的名称都带有 _xc_ 前缀，以将其区分为跨链资产。例如，DOT 是 Polkadot 中继链的原生代币，当其在 Moonbeam 上表示为 XC-20 时，被称为 xcDOT。

### 本地 XC-20 与外部 XC-20 {: #local-xc-20s-vs-external-xc-20s }

从 Polkadot 的角度来看，本地 XC-20 是 EVM 原生的 ERC-20 代币，Moonbeam 是它们的“家”（或储备链）。这包括最初从 Polkadot 外部桥接进来的代币（例如，Wormhole 封装的 ETH），因为一旦它们在 Moonbeam 上作为 ERC-20 发行，Polkadot 就会将它们视为 Moonbeam 本地的代币。当本地 XC-20 被转移到另一个平行链时，这些代币会移动到该链在 Moonbeam 上的主权账户中。

另一方面，外部 XC-20 是 ERC-20 代币的表示，这些代币的规范账本保留在另一个平行链或中继链上。Moonbeam 持有“封装”版本，而底层代币则锁定在 Moonbeam 在原始链上的主权账户中。

从跨链转移的角度来看，本地和外部 XC-20 可以使用 Ethereum 或 Substrate API 通过 Polkadot 的 XCM 基础设施发送。由于底层资产是具有 EVM 字节码的 ERC-20，遵循 [EIP-20 代币标准](https://eips.ethereum.org/EIPS/eip-20){target=\_blank}，因此通过 Substrate 和 Ehereum API 发起的转移都会生成 EVM 日志，这些日志对诸如 [Moonscan](https://moonscan.io){target=\_blank} 之类的基于 EVM 的浏览器可见。相反，您无法使用 Substrate API 发送常规 ERC-20 转移。除了通过 XCM 进行的跨链转移之外，所有其他的 XC-20 交互（例如查询余额或调整授权额度）都必须在 EVM 中进行。

XC-20 的跨链转移通过 Polkadot XCM Pallet 执行，该 Pallet 利用 ERC-20 的常规铸造、销毁和转移机制来实现 XCM 资产流动。如果您想了解如何使用该 Pallet 发送 XC-20，请参阅 [使用 Polkadot XCM Pallet](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=\_blank} 指南。

## 资产储备 {: #asset-reserves }

在 Polkadot 或 Kusama 生态系统中跨链转移代币时，每个代币都有一个“储备”链，用于保存其规范账本——这是铸造、销毁和供应管理的真实来源。对于 XC-20，了解哪个链是储备链决定了资产是在 Moonbeam 上本地管理还是在另一个链上远程管理。

无论储备位于何处，Moonbeam 上的 XC-20 仍然是 ERC-20 代币，开发人员和用户可以在 EVM 中与之交互。但是，从 XCM 的角度来看，储备链决定了在执行跨链操作时，代币在幕后是如何锁定、解锁、铸造或销毁的。

### 本地储备资产 {: #local-reserve-assets }

Moonbeam 上的本地储备资产是一种代币，从 XCM 的角度来看，其规范账本原生位于 Moonbeam 上。换句话说，Moonbeam 是该资产的源链，在该链上进行铸造和销毁。

例如，Wormhole 封装的 ETH (wETH) 被认为是 Moonbeam 上的本地储备资产，即使 Ethereum 是 ETH 的最终来源。一旦 ETH 被 Wormhole 封装并通过 Moonbeam 进入 Polkadot 生态系统，wETH 就可以通过 [Moonbeam 路由流动性 (MRL)](/builders/interoperability/mrl/){target=\_blank} 转移到其他平行链。

重要的注意事项是，在纯粹的 Ethereum 层面来看，ETH 仍然受 Ethereum 的管辖并在 Ethereum 上铸造。但是，从 XCM 的角度来看，Moonbeam 上的 wETH 被视为本地储备资产，这意味着 wETH 的规范供应（就 Polkadot 生态系统而言）存在于 Moonbeam 上。

### 远程储备资产 {: #remote-reserve-assets }

远程储备资产是一种代币，其规范账本（铸造和销毁的真实来源）位于与其当前使用位置不同的链上。以 Moonbeam 上的 xcDOT 为例，代表 xcDOT 的底层 DOT 代币仍然锁定在 Moonbeam 在 Polkadot 中继链上的主权账户中，而 xcDOT 在 Moonbeam 的 EVM 环境中充当包装的表示形式。

用户可以在 Moonbeam 上持有和交易 xcDOT（用于 DeFi、治理等），他们知道底层 DOT 安全地锁定在中继链上。在任何时候，包装的 xcDOT 都可以兑换为原始 DOT，从而有效地销毁 xcDOT 并解锁 Polkadot 上的相应 DOT 代币。

## 当前外部 XC-20 列表 {: #current-xc20-assets }

当前每个网络可用的外部 XC-20 资产列表如下：

=== "Moonbeam"
    |        Origin         |  Symbol   |                                                            XC-20 Address                                                             |
    |:---------------------:|:---------:|:------------------------------------------------------------------------------------------------------------------------------------:|
    |       Polkadot        |   xcDOT   |  [0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080](https://moonscan.io/token/0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080){target=\_blank}  |
    |         Acala         |  xcaUSD   |  [0xfFfFFFFF52C56A9257bB97f4B2b6F7B2D624ecda](https://moonscan.io/token/0xfFfFFFFF52C56A9257bB97f4B2b6F7B2D624ecda){target=\_blank}  |
    |         Acala         |   xcACA   |  [0xffffFFffa922Fef94566104a6e5A35a4fCDDAA9f](https://moonscan.io/token/0xffffFFffa922Fef94566104a6e5A35a4fCDDAA9f){target=\_blank}  |
    |         Acala         |  xcLDOT   |  [0xFFfFfFffA9cfFfa9834235Fe53f4733F1b8B28d4](https://moonscan.io/token/0xFFfFfFffA9cfFfa9834235Fe53f4733F1b8B28d4){target=\_blank}  |
    |        Apillon        |  xcNCTR   |  [0xFfFFfFfF8A9736B44EbF188972725bED67BF694E](https://moonscan.io/token/0xFfFFfFfF8A9736B44EbF188972725bED67BF694E){target=\_blank}  |
    |         Astar         |  xcASTR   |  [0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf](https://moonscan.io/token/0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf){target=\_blank}  |
    |        Bifrost        |   xcBNC   |  [0xFFffffFf7cC06abdF7201b350A1265c62C8601d2](https://moonscan.io/token/0xFFffffFf7cC06abdF7201b350A1265c62C8601d2){target=\_blank}  |
    |        Bifrost        |  xcBNCS   |  [0xfFfffffF6aF229AE7f0F4e0188157e189a487D59](https://moonscan.io/token/0xfFfffffF6aF229AE7f0F4e0188157e189a487D59){target=\_blank}  |
    |        Bifrost        |   xcFIL   |  [0xfFFfFFFF6C57e17D210DF507c82807149fFd70B2](https://moonscan.io/token/0xfFFfFFFF6C57e17D210DF507c82807149fFd70B2){target=\_blank}  |
    |        Bifrost        |  xcvASTR  |  [0xFffFffff55C732C47639231a4C4373245763d26E](https://moonscan.io/token/0xFffFffff55C732C47639231a4C4373245763d26E){target=\_blank}  |
    |        Bifrost        |  xcvBNC   |  [0xffFffFff31d724194b6A76e1d639C8787E16796b](https://moonscan.io/token/0xffFffFff31d724194b6A76e1d639C8787E16796b){target=\_blank}  |
    |        Bifrost        |  xcvDOT   |  [0xFFFfffFf15e1b7E3dF971DD813Bc394deB899aBf](https://moonscan.io/token/0xFFFfffFf15e1b7E3dF971DD813Bc394deB899aBf){target=\_blank}  |
    |        Bifrost        |  xcvFIL   |  [0xFffffFffCd0aD0EA6576B7b285295c85E94cf4c1](https://moonscan.io/token/0xFffffFffCd0aD0EA6576B7b285295c85E94cf4c1){target=\_blank}  |
    |        Bifrost        |  xcvGLMR  |  [0xFfFfFFff99dABE1a8De0EA22bAa6FD48fdE96F6c](https://moonscan.io/token/0xFfFfFFff99dABE1a8De0EA22bAa6FD48fdE96F6c){target=\_blank}  |
    |        Bifrost        | xcvMANTA  |  [0xFFfFFfFfdA2a05FB50e7ae99275F4341AEd43379](https://moonscan.io/token/0xFFfFFfFfdA2a05FB50e7ae99275F4341AEd43379){target=\_blank}  |
    |      Centrifuge       |   xcCFG   |  [0xFFfFfFff44bD9D2FFEE20B25D1Cf9E78Edb6Eae3](https://moonscan.io/token/0xFFfFfFff44bD9D2FFEE20B25D1Cf9E78Edb6Eae3){target=\_blank}  |
    |      Composable       | xcIBCMOVR |  [0xFfFfffFF3AFcd2cAd6174387df17180a0362E592](https://moonscan.io/token/0xFfFfffFF3AFcd2cAd6174387df17180a0362E592){target=\_blank}  |
    |      Composable       | xcIBCPICA |  [0xfFFFFfFFABe9934e61db3b11be4251E6e869cf59](https://moonscan.io/token/0xfFFFFfFFABe9934e61db3b11be4251E6e869cf59){target=\_blank}  |
    |      Composable       | xcIBCIST  |  [0xfFfFffff6A3977d5B65D1044FD744B14D9Cef932](https://moonscan.io/token/0xfFfFffff6A3977d5B65D1044FD744B14D9Cef932){target=\_blank}  |
    |      Composable       | xcIBCBLD  |  [0xFffFffff9664be0234ea4dc64558F695C4f2A9EE](https://moonscan.io/token/0xFffFffff9664be0234ea4dc64558F695C4f2A9EE){target=\_blank}  |
    |       Equilibrium     |   xcEQ    |  [0xffffFFffDDEb23A7aa4FcE1A0A9aEdE9F4dC773c](https://moonscan.io/token/0xffffFFffDDEb23A7aa4FcE1A0A9aEdE9F4dC773c){target=\_blank}  |
    |       Equilibrium     |   xcEQD   |  [0xFFfFFfff0B84704cD545d36BDee4a0f3B5c0aA3C](https://moonscan.io/token/0xFFfFFfff0B84704cD545d36BDee4a0f3B5c0aA3C){target=\_blank}  |
    |         Hydration     |   xcHDX   |  [0xFfFfFffF5c6D9dDB24c393e8B5078D9f20D49cA2](https://moonscan.io/token/0xFfFfFffF5c6D9dDB24c393e8B5078D9f20D49cA2){target=\_blank}  |
    |         Interlay      |  xcIBTC   |  [0xFFfffFFfA893D3150A8659b7F5429d12abf8e4BF](https://moonscan.io/token/0xFFfffFFfA893D3150A8659b7F5429d12abf8e4BF){target=\_blank}  |
    |          Kilt         |   xcKILT  |  [0xfFffFfffE4cc9bC577d05f09f5A4aC3aaA12fA3C](https://moonscan.io/token/0xfFffFfffE4cc9bC577d05f09f5A4aC3aaA12fA3C){target=\_blank}  |
    |         Moonbeam      |  xcUSDC.mb|  [0xFFfffffF7D2B0B761Af01Ca8e25242976ac0aD7D](https://moonscan.io/token/0xFFfffffF7D2B0B761Af01Ca8e25242976ac0aD7D){target=\_blank}  |
    |         Moonbeam      |  xcUSDT.mb|  [0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d](https://moonscan.io/token/0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d){target=\_blank}  |
    |          Nodle        |  xcNODL   |  [0xFFFFfffF20784bC6bCCc8b1e09360ac7cE3600C2](https://moonscan.io/token/0xFFFFfffF20784bC6bCCc8b1e09360ac7cE3600C2){target=\_blank}  |
    |        OriginTrail    |  xcTRAC   |  [0xFFfFfFff7dB7600aC4c53b04Bf51E98D804FdCae](https://moonscan.io/token/0xFFfFfFff7dB7600aC4c53b04Bf51E98D804FdCae){target=\_blank}  |
    |       Parallel        |  xcPARA   |  [0xfFfFFFff24B3Cf292e239b0B34755Bf1E2c5bA4C](https://moonscan.io/token/0xfFfFFFff24B3Cf292e239b0B34755Bf1E2c5bA4C){target=\_blank}  |
    |       Pendulum        |  xcPEN    |  [0xFFfFFfFf8dB2C25e8BA3F389710b94bC18d49C14](https://moonscan.io/token/0xFFfFFfFf8dB2C25e8BA3F389710b94bC18d49C14){target=\_blank}  |
    |         Phala         |   xcPHA   |  [0xFFFfFfFf63d24eCc8eB8a7b5D0803e900F7b6cED](https://moonscan.io/token/0xFFFfFfFf63d24eCc8eB8a7b5D0803e900F7b6cED){target=\_blank}  |
    |       Polkadex        |  xcPDEX   |  [0xfFffFFFF43e0d9b84010b1b67bA501bc81e33C7A](https://moonscan.io/token/0xfFffFFFF43e0d9b84010b1b67bA501bc81e33C7A){target=\_blank}  |
    |  Polkadot Asset Hub   |  xcPINK   |  [0xfFfFFfFf30478fAFBE935e466da114E14fB3563d](https://moonscan.io/token/0xfFfFFfFf30478fAFBE935e466da114E14fB3563d){target=\_blank}  |
    |  Polkadot Asset Hub   |  xcSTINK  |  [0xFffFffFf54c556bD1d0F64ec6c78f1B477525E56](https://moonscan.io/token/0xFffFffFf54c556bD1d0F64ec6c78f1B477525E56){target=\_blank}  |
    |  Polkadot Asset Hub   |  xcUSDC   |  [0xFFfffffF7D2B0B761Af01Ca8e25242976ac0aD7D](https://moonscan.io/token/0xFFfffffF7D2B0B761Af01Ca8e25242976ac0aD7D){target=\_blank}  |
    |  Polkadot Asset Hub   |  xcUSDT   |  [0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d](https://moonscan.io/token/0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d){target=\_blank}  |
    |  Polkadot Asset Hub   |  xcWIFD   |  [0xfffffffF2e1D1ac9eA1686255bEfe995B31abc96](https://moonscan.io/token/0xfffffffF2e1D1ac9eA1686255bEfe995B31abc96){target=\_blank}  |
    |      Snowbridge       |   DAI.e   |  [0xfFfffFFf9DE12E6658C49B4834f9278f6A39f5d7](https://moonscan.io/token/0xfFfffFFf9DE12E6658C49B4834f9278f6A39f5d7){target=\_blank}  |
    |      Snowbridge       |   ETH.e   |  [0xFFFfFFffaFF6dF83d0A1935dDA2e5F1F402C0c45](https://moonscan.io/token/0xFFFfFFffaFF6dF83d0A1935dDA2e5F1F402C0c45){target=\_blank}  |
    |      Snowbridge       |  USDC.e   |  [0xfffFFFFF166F84967F054AE95ab5764c38Cf3aEd](https://moonscan.io/token/0xfffFFFFF166F84967F054AE95ab5764c38Cf3aEd){target=\_blank}  |
    |      Snowbridge       |  USDT.e   |  [0xFFffFfff7bc304425217b49E9598415C514ae81B](https://moonscan.io/token/0xFFffFfff7bc304425217b49E9598415C514ae81B){target=\_blank}  |
    |      Snowbridge       |  WBTC.e   | [0xfFffFFFf1B4Bb1ac5749F73D866FfC91a3432c47](https://moonscan.io/address/0xffffffff1B4BB1AC5749F73D866FFC91A3432C47){target=\_blank} |
    |      Snowbridge       | wstETH.e  |  [0xFfFFFfFF5D5DEB44BF7278DEE5381BEB24CB6573](https://moonscan.io/token/0xFfFFFfFF5D5DEB44BF7278DEE5381BEB24CB6573){target=\_blank}  |
    |      Snowbridge       |  WETH.e   |  [0xfFffFFFF86829AFE1521AD2296719DF3ACE8DED7](https://moonscan.io/token/0xfFffFFFF86829AFE1521AD2296719DF3ACE8DED7){target=\_blank}  |
    |       Subsocial       |   xcSUB   |  [0xfFfFffFf43B4560Bc0C451a3386E082bff50aC90](https://moonscan.io/token/0xfFfFffFf43B4560Bc0C451a3386E082bff50aC90){target=\_blank}  |
    |        Unique         |   xcUNQ   |  [0xFffffFFFD58f77E6693CFB99EbE273d73C678DC2](https://moonscan.io/token/0xFffffFFFD58f77E6693CFB99EbE273d73C678DC2){target=\_blank}  |
    |       Zeitgeist       |   xcZTG   |  [0xFFFFfffF71815ab6142E0E20c7259126C6B40612](https://moonscan.io/token/0xFFFFfffF71815ab6142E0E20c7259126C6B40612){target=\_blank}  |

    _*您可以在 Polkadot.js Apps 上查看每个 [Asset ID](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/assets){target=\_blank}*_

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
    |     Kintsugi     | xcKBTC  | [0xFFFfFfFfF6E528AD57184579beeE00c5d5e646F0](https://moonriver.moonscan.io/token/0xFFFfFfFfF6E528AD57184579beeE00c5d5e646F0){target=\_blank} |
    | Kusama Asset Hub | xcRMRK  | [0xffffffFF893264794d9d57E1E0E21E0042aF5A0A](https://moonriver.moonscan.io/token/0xffffffFF893264794d9d57E1E0E21E0042aF5A0A){target=\_blank} |
    | Kusama Asset Hub | xcUSDT  | [0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d](https://moonriver.moonscan.io/token/0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d){target=\_blank} |
    |      Litmus      |  xcLIT  | [0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0](https://moonriver.moonscan.io/token/0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0){target=\_blank} |
    |     Mangata      |  xcMGX  | [0xffFfFffF58d867EEa1Ce5126A4769542116324e9](https://moonriver.moonscan.io/token/0xffFfFffF58d867EEa1Ce5126A4769542116324e9){target=\_blank} |
    |     Picasso      | xcPICA  | [0xFffFfFFf7dD9B9C60ac83e49D7E3E1f7A1370aD2](https://moonriver.moonscan.io/token/0xFffFfFFf7dD9B9C60ac83e49D7E3E1f7A1370aD2){target=\_blank} |
    |    Robonomics    |  xcXRT  | [0xFffFFffF51470Dca3dbe535bD2880a9CcDBc6Bd9](https://moonriver.moonscan.io/token/0xFffFFffF51470Dca3dbe535bD2880a9CcDBc6Bd9){target=\_blank} |
    |      Shiden      |  xcSDN  | [0xFFFfffFF0Ca324C842330521525E7De111F38972](https://moonriver.moonscan.io/token/0xFFFfffFF0Ca324C842330521525E7De111F38972){target=\_blank} |
    |    Tinkernet     | xcTNKR  | [0xfFFfFffF683474B842852111cc31d470bD8f5081](https://moonriver.moonscan.io/token/0xffffffff683474b842852111cc31d470bd8f5081){target=\_blank} |
    |      Turing      |  xcTUR  | [0xfFffffFf6448d0746f2a66342B67ef9CAf89478E](https://moonriver.moonscan.io/token/0xfFffffFf6448d0746f2a66342B67ef9CAf89478E){target=\_blank} |
    |     Moonbeam     | GLMR.mb | [0xFfFffFff1a49463978f19dfD6983f2fa1885C254](https://moonriver.moonscan.io/token/0xFfFffFff1a49463978f19dfD6983f2fa1885C254){target=\_blank} |
    |     Moonbeam     |xcUSDC.mb| [0xFFFFFFfF2215880E56fe63a96E54E073757C3092](https://moonriver.moonscan.io/token/0xFFFFFFfF2215880E56fe63a96E54E073757C3092){target=\_blank} |
    |     Moonbeam     |xcUSDT.mb| [0xFFFFFFFFc70260a3bf46A91cF87B6F5e6Abba712](https://moonriver.moonscan.io/token/0xFFFFFFFFc70260a3bf46A91cF87B6F5e6Abba712){target=\_blank} |
    |     Moonbeam     |whUSDC.mb| [0xFfFfffff9E27Ab60FADFd33ABf71B39A7445f7eD](https://moonriver.moonscan.io/token/0xFfFfffff9E27Ab60FADFd33ABf71B39A7445f7eD){target=\_blank} |

    _*您可以在 Polkadot.js Apps 上查看每个 [Asset ID](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonriver.moonbeam.network#/assets){target=\_blank}*_

=== "Moonbase Alpha"
    |        Origin        | Symbol |                                                                XC-20 Address                                                                |
    |:--------------------:|:------:|:-------------------------------------------------------------------------------------------------------------------------------------------:|
    | Relay Chain Alphanet | xcUNIT | [0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080](https://moonbase.moonscan.io/token/0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080){target=\_blank} |

    _*您可以在 Polkadot.js Apps 上查看每个 [Asset ID](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=\_blank}*_

### 检索外部 XC-20 及其元数据的列表 {: #list-xchain-assets }

要获取当前可用的外部 XC-20 及其关联元数据的列表，您可以使用 [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=\_blank} 查询链状态。您将执行以下步骤：

1. 为您想要获取资产列表的网络创建一个 API 提供程序。您可以为每个网络使用以下 WSS 端点：

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

2. 查询 `assets` pallet 以获取所有资产
3. 迭代资产列表以获取所有资产 ID 及其关联的元数据

```js
--8<-- 'code/builders/interoperability/xcm/xc20/overview/retrieve-xc20s.js'
```

结果将显示资产 ID 以及所有已注册的外部 XC-20 的一些其他信息。

## 检索本地 XC-20 元数据 {: #retrieve-local-xc20-metadata }

由于本地 XC-20 是 Moonbeam 上的 ERC-20，可以通过 XCM 转移到另一个平行链，您可以像与 ERC-20 交互一样与本地 XC-20 交互。只要您拥有 ERC-20 的地址和 ABI，您就可以通过与其 ERC-20 接口交互来检索其元数据，以检索资产的名称、符号和小数位数。

以下是一个示例，检索 Moonbase Alpha 上的 [Jupiter 代币](https://moonbase.moonscan.io/token/0x9aac6fb41773af877a2be73c99897f3ddfacf576){target=\_blank}的资产元数据：

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
