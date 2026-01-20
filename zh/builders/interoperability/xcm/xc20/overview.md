---
title: XC-20 和跨链资产
description: 了解 Moonbeam 上的跨链资产类型，特别是本地和外部 XC-20，并查看 Moonbeam 上的外部 XC-20 列表。
categories: Basics, XC-20
---

# XC-20 概述

## 简介 {: #introduction }

[跨共识消息 (XCM)](https://wiki.polkadot.com/learn/learn-xcm/){target=_blank} 格式为区块链交换消息和转移资产提供了一种通用方式。为了将这种互操作性扩展到 EVM，Moonbeam 引入了 XC-20，这是一种 Moonbeam 上的 ERC-20 代币，它与 XCM 转移完全兼容。

在 Moonbeam 上部署的任何 ERC-20 都可以配置为 XC-20，从而可以通过 XCM 访问连接的任何链。这使得专注于 EVM 的开发人员可以使用熟悉的 ERC-20 工作流程，同时受益于 Polkadot 的原生跨链功能，而无需 Substrate 方面的专业知识。

从技术角度来看，本地 XC-20 是源自 Moonbeam 的 ERC-20 代币（包括在 Moonbeam 上发行后被视为原生的桥接代币），而外部 XC-20 是代币的包装表示，其规范账本存在于另一个平行链或中继链上。在所有情况下，XC-20 的功能都与标准 ERC-20 相同——支持常见的基于 EVM 的用例（例如 DeFi、DEX 和借贷平台）——但具有无缝跨链互操作性的额外优势。

![Moonbeam XC-20 与 Polkadot 的 XCM 集成](/images/builders/interoperability/xcm/overview/overview-3.webp)

本页面旨在介绍 XC-20 的基础知识；如果您想了解如何与 XC-20 交互或转移 XC-20，请参阅 [发送 XC-20 指南](/builders/interoperability/xcm/xc20/send-xc20s/overview/){target=_blank}。

## XC-20 的类型 {: #types-of-xc-20s }

XC-20 有两种类型：本地和外部。

### 什么是本地 XC-20？ {: #local-xc20s }

本地 XC-20 是指 EVM 上存在的所有 ERC-20，可以通过 XCM 进行跨链转移。为了将本地 XC-20 转移到另一个平行链，必须在该链上注册资产。当转移本地 XC-20 时，底层代币驻留在目标链在 Moonbeam 上的主权账户中。[主权账户](/builders/interoperability/xcm/core-concepts/sovereign-accounts/){target=_blank} 是由区块链运行时（而不是个人）管理的无密钥账户，可以持有资产并与其他链交互。本地 XC-20 必须遵循[本指南中概述的 ERC-20 接口](/builders/interoperability/xcm/xc20/interact/#the-erc20-interface){target=_blank}。它们必须实现标准的 ERC-20 函数签名，包括 [EIP-20](https://eips.ethereum.org/EIPS/eip-20){target=_blank} 中描述的 `transfer` 函数的正确函数选择器。但是，只要不破坏基本方法，仍然可以添加其他功能。

创建本地 XC-20 相当于部署一个标准的 ERC-20 并在任何 Moonbeam 网络上启用跨链功能。

### 什么是外部 XC-20？ {: #external-xc20s }

外部 XC-20 是源自另一个平行链或中继链的跨链代币，它们在 Moonbeam 上表示为 ERC-20 代币。原始代币仍然锁定在其主链上的 Moonbeam 主权账户中，而包装后的 ERC-20 表示形式可以在 Moonbeam 上自由使用。当您转移外部 XC-20 时，规范资产仍然位于其源链的主权账户中，而 ERC-20 表示形式是在 Moonbeam 上流通的内容。

外部 XC-20 的名称都带有 _xc_ 前缀，以将其区分为跨链资产。例如，DOT 是 Polkadot 中继链的原生代币，当其在 Moonbeam 上表示为 XC-20 时，被称为 xcDOT。

### 本地 XC-20 与外部 XC-20 {: #local-xc-20s-vs-external-xc-20s }

从 Polkadot 的角度来看，本地 XC-20 是 EVM 原生的 ERC-20 代币，Moonbeam 是它们的“家”（或储备链）。这包括最初从 Polkadot 外部桥接进来的代币（例如，Wormhole 封装的 ETH），因为一旦它们在 Moonbeam 上作为 ERC-20 发行，Polkadot 就会将它们视为 Moonbeam 本地的代币。当本地 XC-20 被转移到另一个平行链时，这些代币会移动到该链在 Moonbeam 上的主权账户中。

另一方面，外部 XC-20 是 ERC-20 代币的表示，这些代币的规范账本保留在另一个平行链或中继链上。Moonbeam 持有“封装”版本，而底层代币则锁定在 Moonbeam 在原始链上的主权账户中。

从跨链转移的角度来看，本地和外部 XC-20 可以使用 Ethereum 或 Substrate API 通过 Polkadot 的 XCM 基础设施发送。由于底层资产是具有 EVM 字节码的 ERC-20，遵循 [EIP-20 代币标准](https://eips.ethereum.org/EIPS/eip-20){target=_blank}，因此通过 Substrate 和 Ehereum API 发起的转移都会生成 EVM 日志，这些日志对诸如 [Moonscan](https://moonscan.io){target=_blank} 之类的基于 EVM 的浏览器可见。相反，您无法使用 Substrate API 发送常规 ERC-20 转移。除了通过 XCM 进行的跨链转移之外，所有其他的 XC-20 交互（例如查询余额或调整授权额度）都必须在 EVM 中进行。

XC-20 的跨链转移通过 Polkadot XCM Pallet 执行，该 Pallet 利用 ERC-20 的常规铸造、销毁和转移机制来实现 XCM 资产流动。如果您想了解如何使用该 Pallet 发送 XC-20，请参阅 [使用 Polkadot XCM Pallet](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=_blank} 指南。

## 资产储备 {: #asset-reserves }

在 Polkadot 或 Kusama 生态系统中跨链转移代币时，每个代币都有一个“储备”链，用于保存其规范账本——这是铸造、销毁和供应管理的真实来源。对于 XC-20，了解哪个链是储备链决定了资产是在 Moonbeam 上本地管理还是在另一个链上远程管理。

无论储备位于何处，Moonbeam 上的 XC-20 仍然是 ERC-20 代币，开发人员和用户可以在 EVM 中与之交互。但是，从 XCM 的角度来看，储备链决定了在执行跨链操作时，代币在幕后是如何锁定、解锁、铸造或销毁的。

### 本地储备资产 {: #local-reserve-assets }

Moonbeam 上的本地储备资产是一种代币，从 XCM 的角度来看，其规范账本原生位于 Moonbeam 上。换句话说，Moonbeam 是该资产的源链，在该链上进行铸造和销毁。

例如，Wormhole 封装的 ETH (wETH) 被认为是 Moonbeam 上的本地储备资产，即使 Ethereum 是 ETH 的最终来源。一旦 ETH 被 Wormhole 封装并通过 Moonbeam 进入 Polkadot 生态系统，wETH 就可以通过 [Moonbeam 路由流动性 (MRL)](/builders/interoperability/mrl/){target=_blank} 转移到其他平行链。

重要的注意事项是，在纯粹的 Ethereum 层面来看，ETH 仍然受 Ethereum 的管辖并在 Ethereum 上铸造。但是，从 XCM 的角度来看，Moonbeam 上的 wETH 被视为本地储备资产，这意味着 wETH 的规范供应（就 Polkadot 生态系统而言）存在于 Moonbeam 上。

### 远程储备资产 {: #remote-reserve-assets }

远程储备资产是一种代币，其规范账本（铸造和销毁的真实来源）位于与其当前使用位置不同的链上。以 Moonbeam 上的 xcDOT 为例，代表 xcDOT 的底层 DOT 代币仍然锁定在 Moonbeam 在 Polkadot 中继链上的主权账户中，而 xcDOT 在 Moonbeam 的 EVM 环境中充当包装的表示形式。

用户可以在 Moonbeam 上持有和交易 xcDOT（用于 DeFi、治理等），他们知道底层 DOT 安全地锁定在中继链上。在任何时候，包装的 xcDOT 都可以兑换为原始 DOT，从而有效地销毁 xcDOT 并解锁 Polkadot 上的相应 DOT 代币。

### 检索外部 XC-20 及其元数据的列表 {: #list-xchain-assets }

要获取当前可用的外部 XC-20 及其关联元数据的列表，您可以使用 [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=\_blank} 查询链状态。您将执行以下步骤：

1. 为您想要获取资产列表的网络创建一个 API 提供程序。您可以为每个网络使用以下 WSS 端点：

    === "Moonbeam"

        text
        wss://wss.api.moonbeam.network
        

    === "Moonriver"

        text
        wss://wss.api.moonriver.moonbeam.network
        

    === "Moonbase Alpha"

        {{ networks.moonbase.wss_url }}

2. 查询 `assets` pallet 以获取所有资产
3. 迭代资产列表以获取所有资产 ID 及其关联的元数据

js
--8<-- 'code/builders/interoperability/xcm/xc20/overview/retrieve-xc20s.js'

结果将显示资产 ID 以及所有已注册的外部 XC-20 的一些其他信息。

## 检索本地 XC-20 元数据 {: #retrieve-local-xc20-metadata }

由于本地 XC-20 是 Moonbeam 上的 ERC-20，可以通过 XCM 转移到另一个平行链，您可以像与 ERC-20 交互一样与本地 XC-20 交互。只要您拥有 ERC-20 的地址和 ABI，您就可以通过与其 ERC-20 接口交互来检索其元数据，以检索资产的名称、符号和小数位数。

以下是一个示例，检索 Moonbase Alpha 上的 [Jupiter 代币](https://moonbase.moonscan.io/token/0x9aac6fb41773af877a2be73c99897f3ddfacf576){target=_blank}的资产元数据：

==="Ethers.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc20/overview/local-xc20s/ethers.js'
    ```

==="Web3.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc20/overview/local-xc20s/web3.js'
    ```

==="Web3.py"

    ```py
    --8<-- 'code/builders/interoperability/xcm/xc20/overview/local-xc20s/web3.py'
    ```
