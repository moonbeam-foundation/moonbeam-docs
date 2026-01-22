---
title: 通过 Axelar 实现跨链
description: 了解 Axelar，一种用于跨链资产转移的 GMP 协议，以及如何在 Moonbeam 上开始使用 Axelar 构建跨链应用程序。
categories: GMP Providers
---

# Axelar 网络

## 简介 {: #introduction }

[Axelar](https://www.axelar.network){target=\_blank} 为 Web3 提供安全的跨链通信。Axelar 的基础设施使 dApp 用户只需单击一下，即可与任何连接链上的任何资产或应用程序进行交互。Axelar 网络由无需许可的权益证明验证器集提供支持，允许 dApp 使用图灵完备的调用跨链传递任意消息。

Axelar 是一个全栈传输层，支持资产转移、[通用消息传递](https://docs.axelar.dev/dev/general-message-passing/overview){target=\_blank} 和程序的可组合性。它安全地连接所有区块链生态系统、应用程序、资产和用户，以实现 Web3 互操作性。Axelar 由去中心化的验证器网络、安全网关合约、统一翻译、路由架构以及一套协议和应用程序编程接口 (API) 组成。请查看 [技术堆栈图](https://www.axelar.network/blog/an-introduction-to-the-axelar-network){target=\_blank} 了解更多详情。

![Axelar 技术堆栈图](/images/builders/interoperability/protocols/axelar/axelar-1.webp)

Axelar API 提供了一套丰富的 Web3 应用程序开发套件，确保开发人员拥有构建所需的工具。借助这些工具和 API，开发人员可以使用 Axelar 网络及其 API 编写可以轻松部署在所有 Axelar 连接的生态系统中的 dApp。

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## 入门 {: #getting-started }

有几个资源可以帮助您开始使用 Axelar 构建跨链应用程序：

- **[开发者文档](https://docs.axelar.dev/dev/intro){target=\_blank}** - 用于技术指南
- **[Squid](https://app.squidrouter.com/){target=\_blank}** - 一种用于在链之间转移资产的桥接 UI

还有一个区块浏览器可用于跟踪您的跨链传输等：

- **[Axelarscan for MainNet](https://axelarscan.io){target=\_blank}**
- **[Axelarscan for TestNet](https://testnet.axelarscan.io){target=\_blank}**

## 合约 {: #contracts }

查看已部署到 Moonbeam 的 Axelar 合约列表，以及通过 Axelar 连接到 Moonbeam 的网络。

- **MainNet 合约** - [Moonbeam](https://docs.axelar.dev/dev/reference/mainnet-contract-addresses){target=\_blank}

- **TestNet 合约** - [Moonbase Alpha](https://docs.axelar.dev/dev/reference/testnet-contract-addresses){target=\_blank}

--8<-- 'text/_disclaimers/third-party-content.md'
