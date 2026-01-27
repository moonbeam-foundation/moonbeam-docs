---
title: 通过 Hyperlane 实现跨链
description: 了解 Hyperlane，一种用于跨链资产转移的 GMP 协议，以及如何在 Moonbeam 上使用 Hyperlane 开始构建跨链应用程序。
categories: GMP Providers
---


# Hyperlane 协议

## 介绍 {: #introduction }

[Hyperlane](https://hyperlane.xyz/){target=\_blank} 是一个用于 Web3 的安全模块化跨链通信协议。Hyperlane 使 dApp 用户能够一键与任何连接链上的任何资产或应用程序进行交互。它支持通用资产转移以及自定义跨链消息传递。

使用[链间安全模块 (ISM)](https://docs.hyperlane.xyz/docs/protocol/ISM/modular-security){target=\_blank}，Hyperlane 允许开发人员配置消息在链之间发送和验证的方式。Hyperlane 由验证器、中继器和瞭望塔组成。[验证器](https://v2.hyperlane.xyz/docs/protocol/agents/validators){target=\_blank}将监视并确认跨链消息。[中继器](https://v2.hyperlane.xyz/docs/protocol/agents/relayer){target=\_blank}花费 gas 在链之间发送消息。[瞭望塔](https://v2.hyperlane.xyz/docs/protocol/agents/processor){target=\_blank}执行检查以确保验证器是善意参与者，从而保护协议。查看技术堆栈图及其[协议文档](https://docs.hyperlane.xyz/docs/protocol/protocol-overview){target=\_blank}以获取更多详细信息。

![Hyperlane 技术堆栈图](/images/builders/interoperability/protocols/hyperlane/hyperlane-1.webp)

Hyperlane API 提供了一套丰富的 Web3 应用程序开发套件，确保开发人员拥有构建所需的工具。借助这些工具和 API，开发人员可以使用 Hyperlane 协议及其 API 来编写可以轻松部署到所有 Hyperlane 连接的生态系统中的 dApp。

--8<-- 'zh/text/_disclaimers/third-party-content-intro.md'

## 入门 {: #getting-started }

这里有一些资源可以帮助您开始使用 Hyperlane 构建跨链应用程序：

- **[开发者文档](https://v2.hyperlane.xyz/docs/build-with-hyperlane/guides){target=\_blank}** - 用于技术指南
- **[Hyperlane 浏览器](https://explorer.hyperlane.xyz){target=\_blank}** - 用于跟踪跨链传输

## 合约 {: #contracts }

查看部署到 Moonbeam 的 Hyperlane 合约列表，以及通过 Hyperlane 连接到 Moonbeam 的网络。

- [主网和测试网合约](https://v2.hyperlane.xyz/docs/resources/addresses/permissionless){target=\_blank}

--8<-- 'zh/text/_disclaimers/third-party-content.md'
