---
title: 区块浏览器
description: 目前可用于浏览 Moonbeam 的 Substrate 和 Ethereum 层的区块浏览器的概述。
categories: 基础知识
---

# 区块浏览器

## 简介 {: #introduction }

区块浏览器可以被认为是区块链的搜索引擎。它们允许用户搜索诸如余额、合约和交易等信息。更高级的区块浏览器甚至提供索引功能，这使它们能够提供完整的信息集，例如网络中的 ERC-20 代币。它们甚至可能提供 API 服务以通过外部服务访问它。

Moonbeam 提供了两种不同类型的浏览器：一种用于查询 Ethereum API，另一种专用于 Substrate API。所有基于 EVM 的交易都可以通过 Ethereum API 访问，而 Substrate API 可以用于 Substrate 原生功能，例如治理和质押。Substrate API 还包括有关基于 EVM 的交易的信息，但仅显示有限的信息。

## 快速链接 {: #quick-links }

--8<-- 'text/builders/get-started/explorers/explorers.md'

## Ethereum API {: #ethereum-api }

### Moonscan {: #Moonscan }

[Moonscan](https://moonscan.io){target=\_blank} 是 Moonbeam 网络的的主要以太坊 API 区块链浏览器。Moonscan 由 Etherscan 团队构建，提供强大、直观且功能丰富的体验。除了其全面的交易和区块数据外，Moonscan 还提供许多[统计数据和图表](https://moonbeam.moonscan.io/charts){target=_blank}，例如平均 Gas 价格、每日交易量和区块大小图表。

Moonscan 的其他功能包括：

 - [验证人排行榜](https://moonbeam.moonscan.io/collators){target=\_blank}，按性能对验证人进行排名
 - [合约源代码验证](builders/ethereum/verify-contracts/block-explorers/){target=_blank}，可通过 Web 界面和 API 访问
 - 能够读取和写入已验证智能合约的状态数据
 - [Token 授权](https://moonscan.io/tokenapprovalchecker){target=_blank}，您可以在其中查看和撤销之前的所有 Token 授权
 - [添加 Token 信息](builders/get-started/token-profile/){target=\_blank} 并为部署到 Moonbeam 网络的 ERC-20、ERC-721 和 ERC-1155 创建配置文件。该配置文件可以包括指向您的项目、社交媒体、价格数据以及与您的 Token 相关的其他信息的链接

![Moonbeam Moonscan](/images/builders/get-started/explorers/explorers-1.webp)

### Expedition {: #expedition }

一个 Moonbeam 主题的 [Expedition](https://github.com/xops/expedition){target=\_blank} 浏览器可以在[这个链接](https://moonbeam-explorer.netlify.app){target=\_blank}中找到。它是一个基于 JSON-RPC 的基本浏览器。

默认情况下，该浏览器连接到 Moonbeam。但是，您可以切换到 Moonriver 或 Moonbase Alpha，或者按照以下步骤将其连接到本地开发节点：

 1. 点击网络文本，您可以在其中选择所有不同的网络，包括在 `{{ networks.development.rpc_url }}` 上运行的 **Moonbeam Development Node**
 2. 如果您想连接到特定的 RPC URL，请选择 **Add Custom Chain** 并输入 URL。例如，`http://localhost:9937`

![Expedition Explorer](/images/builders/get-started/explorers/explorers-2.webp)

## Substrate API {: #substrate-api }

### Subscan {: #subscan }

[Subscan](https://moonbeam.subscan.io){target=\_blank} 是基于 Moonbeam 网络的 Substrate API 区块链浏览器。Subscan 能够解析标准或自定义模块。例如，这对于显示有关 Staking、Governance 和 EVM pallets（或模块）的信息非常有用。该代码是完全开源的，可以在 [Subscan Essentials GitHub repo](https://github.com/subscan-explorer/subscan-essentials){target=\_blank} 中找到。

![Subscan Moonbeam](/images/builders/get-started/explorers/explorers-3.webp)

### Polkadot.js {: #polkadotjs }

虽然 Polkadot.js Apps 不是一个功能完善的区块浏览器，但它对于运行本地开发节点以查看事件和查询交易哈希的用户来说，是一个方便的选择。Polkadot.js Apps 使用 WebSocket 端点与网络进行交互。您可以轻松连接到 [Moonbeam](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/explorer){target=\_blank}、[Moonriver](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonriver.moonbase.moonbeam.network#/explorer){target=\_blank} 或 [Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/explorer){target=\_blank}。

![Polkadot.js Moonbeam](/images/builders/get-started/explorers/explorers-4.webp)

要将其连接到 Moonbeam 开发节点，您可以按照[将 Polkadot.js Apps 连接到本地 Moonbeam 节点](/builders/get-started/networks/moonbeam-dev/#connecting-polkadot-js-apps-to-a-local-moonbeam-node){target=\_blank}部分中的步骤进行操作，该部分位于[Moonbeam 开发节点入门](/builders/get-started/networks/moonbeam-dev/){target=\_blank}指南中。此处的默认端口是 `9944`。
![Polkadot.js Local Node](/images/builders/get-started/explorers/explorers-5.webp)
