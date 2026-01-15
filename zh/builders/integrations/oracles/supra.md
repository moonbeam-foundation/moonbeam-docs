---
title: Supra 预言机
description: Supra 的 Pull Oracle 为各种用例提供低延迟、按需的价格馈送更新。了解如何在 Moonbeam 上集成 Supra 的预言机。
categories: 预言机节点
---

# Supra 预言机

## 简介 {: #introduction }

[Supra](https://supra.com){target=\_blank} 是一个新型、高吞吐量的预言机和层内：一个垂直整合的跨链解决方案工具包（数据预言机、资产桥、自动化网络等），可互连所有区块链，包括公有链（L1 和 L2）或私有链（企业），包括 Moonbeam。

Supra 提供去中心化的预言机价格 Feeds，可用于链上和链下用例，例如现货和永续 DEX、借贷协议和支付协议。

本页面提供您在 Moonbeam 上开始使用 Supra 所需的一切。

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## 如何使用 Supra 的价格 Feed {: #price-feeds }

Supra 采用拉取模型作为一种定制方法，可以根据请求发布价格数据。它结合了 Web2 和 Web3 方法，以在将数据从 Supra 发送到目标链时实现低延迟。该过程包括以下步骤：

1. Web2 方法用于从 Supra 检索价格数据。
2. 智能合约用于以加密方式验证并将最新的价格数据写入链上，这些数据存储在使用 [Supra 的拉取 Oracle V1](https://docs.supra.com/oracles/data-feeds/pull-oracle){target=_blank} 的不可变账本上。
3. 一旦数据被写入链上，最近发布的价格 Feed 数据将可以在 Supra 的存储合约中使用。

Supra 在 Moonbeam 上的合约地址如下：

==="Moonbeam"

    |  Contract   |                                                               Address                                                               |
    |:-----------:|:-----------------------------------------------------------------------------------------------------------------------------------:|
    | Pull Oracle | [{{ networks.moonbeam.supra.pull_oracle }}](https://moonscan.io/address/{{ networks.moonbeam.supra.pull_oracle }}){target=_blank} |
    |   Storage   |     [{{ networks.moonbeam.supra.storage }}](https://moonscan.io/address/{{ networks.moonbeam.supra.storage }}){target=_blank}     |

==="Moonbase Alpha"

    |  Contract   |                                                                   Address                                                                    |
    |:-----------:|:--------------------------------------------------------------------------------------------------------------------------------------------:|
    | Pull Oracle | [{{ networks.moonbase.supra.pull_oracle }}](https://moonbase.moonscan.io/address/{{ networks.moonbase.supra.pull_oracle }}){target=_blank} |
    |   Storage   |     [{{ networks.moonbase.supra.storage }}](https://moonbase.moonscan.io/address/{{ networks.moonbase.supra.storage }}){target=_blank}     |

!!! note
    目前不支持 Moonriver。

### 可用价格信息列表 {: #list-of-available-price-feeds }

要查看 Supra 提供的可用数据对的完整列表，请查看他们文档站点上的[数据信息目录](https://docs.supra.com/oracles/data-feeds/data-feeds-index)。

要与任何这些数据对进行交互，您需要记下该对的 **Pair ID**。

### 尝试一下 {: #try-it-out }

按照[上一节](#price-feeds)中提到的步骤，或参考[Supra 文档](https://supra.com/developers/){target=_blank}，尝试一个使用 Supra 拉取模型获取价格数据的基本示例。

## 与 Supra 建立连接 {: #connect-with-supra }

仍在寻找答案？Supra 已经有了！查看您可以联系 Supra 团队的所有方式：

- 访问 [Supra 的网站 supraoracles.com](https://supra.com){target=_blank}。
- 阅读他们的[文档](https://docs.supra.com/oracles/overview){target=_blank}。
- 在 [Telegram](https://t.me/SupraOracles){target=_blank} 上与他们聊天。
- 在 [X](https://x.com/SupraOracles){target=_blank} 上关注他们。
- 加入他们的 [Discord](https://discord.com/invite/supraoracles){target=_blank}。
- 查看他们的 [Youtube](https://www.youtube.com/SupraOfficial){target=_blank}。

--8<-- 'text/_disclaimers/third-party-content.md'
