---
title: Moonriver入门指南
description: 了解如何通过RPC和WSS端点连接到Moonriver，如何将MetaMask连接到Moonriver，以及可用的Moonriver区块浏览器。
categories: Basics
---

# Moonriver入门

--8<-- 'zh/text/builders/get-started/networks/moonriver/connect.md'

## 区块浏览器 {: #block-explorers }

对于 Moonriver，您可以使用以下任何一个区块浏览器：

 - **Ethereum API（等效于 Etherscan）**— [Moonscan](https://moonriver.moonscan.io){target=\_blank}
 - **基于 Ethereum API JSON-RPC** — [Moonbeam Basic Explorer](https://moonbeam-explorer.netlify.app/?network=Moonriver){target=\_blank}
 - **Substrate API** — [Subscan](https://moonriver.subscan.io){target=\_blank} 或 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonriver.moonbeam.network#/explorer){target=\_blank}
 
有关每个可用区块浏览器的更多信息，请访问文档的[区块浏览器](/builders/get-started/explorers/)部分。

## 连接 MetaMask {: #connect-metamask }

如果您已经安装了 MetaMask，您可以轻松地将 MetaMask 连接到 Moonriver：

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonriver">Connect MetaMask</a>
</div>

!!! note
    MetaMask 将弹出窗口，请求允许将 Moonriver 添加为自定义网络。一旦您批准了权限，MetaMask 会将您当前的网路切换到 Moonriver。

如果您没有安装 MetaMask，或者想按照教程开始操作，请查看[使用 MetaMask 与 Moonbeam 交互](/tokens/connect/metamask/)指南。

## 配置 {: #configuration }

请注意以下 gas 配置参数。这些值可能会在将来的运行时升级中发生更改。

|       变量        |                    值                    |
|:---------------------:|:-------------------------------------------:|
|   最低 gas 价格   | {{ networks.moonriver.min_gas_price }} Gwei |
|   目标区块时间   | {{ networks.moonriver.block_time }} 秒 |
|    区块 gas 限制    |     {{ networks.moonriver.gas_block }}      |
| 交易 gas 限制 |       {{ networks.moonriver.gas_tx }}       |
