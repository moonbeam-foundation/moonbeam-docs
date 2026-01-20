---
title: 通过 LayerZero 进行跨链
description: 了解 LayerZero，一种用于跨链资产转移的 GMP 协议，以及如何在 Moonbeam 上开始使用 LayerZero 构建跨链应用程序。
categories: GMP Providers
---


# LayerZero 协议

## 简介 {: #introduction }

[LayerZero](https://layerzero.network){target=\_blank} 为 Web3 提供安全的全链互操作性。它由 Oracle 参与者和 Relayer 参与者组成，它们分别工作以提供从一个链到另一个链的安全消息。LayerZero 的基础设施使 dApp 用户只需单击一下，即可与任何连接链上的任何资产或应用程序进行交互。

LayerZero 是一个传输层，它通过低级通信原语实现资产转移。利用 LayerZero 的 DApp 被称为用户应用程序，其消息通过 Relayer 在链之间传递，并且其消息由 Oracle 的区块头在目标链上验证。请看下面的技术堆栈图及其[概念文档](https://docs.layerzero.network/v2/home/v2-overview){target=\_blank}以获取更多详细信息。

![LayerZero 技术堆栈图](/images/builders/interoperability/protocols/layerzero/layerzero-1.webp)

LayerZero API 提供了一套丰富的 Web3 应用程序开发工具，确保开发人员拥有构建所需的工具。借助这些工具和 API，开发人员可以使用 LayerZero 协议及其 API 编写可以轻松部署在所有 LayerZero 连接的生态系统中的 dApp。

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## 入门 {: #getting-started }

以下是一些资源，可帮助您开始使用 LayerZero 构建跨链应用程序：

- **[开发者文档](https://docs.layerzero.network/v2){target=\_blank}** - 用于技术指南
- **[Stargate](https://stargate.finance){target=\_blank}** - Stargate 团队构建的、使用 LayerZero 的桥接 UI

## 合约 {: #contracts }

查看部署到 Moonbeam 的 LayerZero 合约列表，以及通过 LayerZero 连接到 Moonbeam 的网络。

- **主网合约** - [Moonbeam](https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts#moonbeam){target=\_blank}

- **测试网合约** - [Moonbase Alpha](https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts#moonbase){target=\_blank}

--8<-- 'text/_disclaimers/third-party-content.md'
