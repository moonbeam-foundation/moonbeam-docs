---
title: Moonbeam 入门
description: 了解如何通过 RPC 和 WSS 端点连接到 Moonbeam，如何将 MetaMask 连接到 Moonbeam，以及可用的 Moonbeam 区块链浏览器。
categories: Basics
---

# Moonbeam入门

--8<-- 'text/builders/get-started/networks/moonbeam/connect.md'

## 区块浏览器 {: #block-explorers }

对于 Moonbeam，您可以使用以下任何区块浏览器：

 - **以太坊 API（Etherscan 等效）** — [Moonscan](https://moonbeam.moonscan.io){target=\_blank}
 - **基于以太坊 API JSON-RPC** — [Moonbeam Basic Explorer](https://moonbeam-explorer.netlify.app/?network=Moonbeam){target=\_blank}
 - **Substrate API** — [Subscan](https://moonbeam.subscan.io){target=\_blank} 或 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/explorer){target=\_blank}

有关每个可用区块浏览器的更多信息，请访问文档的 [区块浏览器](/builders/get-started/explorers/){target=\_blank} 部分。

## 连接 MetaMask {: #connect-metamask }

如果您已经安装了 MetaMask，您可以轻松地将 MetaMask 连接到 Moonbeam：

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonbeam">Connect MetaMask</a>
</div>

!!! note
    MetaMask 将弹出窗口，请求允许将 Moonbeam 添加为自定义网络。一旦您批准权限，MetaMask 会将您当前的 网络切换到 Moonbeam。

如果您没有安装 MetaMask，或者想按照教程开始操作，请查看[使用 MetaMask 与 Moonbeam 交互](/tokens/connect/metamask/){target=_blank} 指南。

## 配置 {: #configuration }

请注意以下 gas 配置参数。这些值可能会在未来的运行时升级中发生变化。

|       变量        |                   值                    |
|:---------------------:|:------------------------------------------:|
|   最低 gas 价格   | {{ networks.moonbeam.min_gas_price }} Gwei |
|   目标区块时间   | {{ networks.moonbeam.block_time }} 秒 |
|    区块 gas 限制    |     {{ networks.moonbeam.gas_block }}      |
| 交易 gas 限制 |       {{ networks.moonbeam.gas_tx }}       |
