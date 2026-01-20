---
title: 运行节点
description: 了解为 Moonbeam 网络运行完整平行链节点的所有必要细节，以拥有您的 RPC 端点或生产区块。
categories: Basics, Node Operators and Collators
---

# 在Moonbeam上运行节点

## 简介 {: #introduction }

在基于 Moonbeam 的网络上运行完整节点，您可以连接到网络、与引导节点同步、获得对 RPC 端点的本地访问权限、在平行链上创建区块等等。

Moonbeam 有多个部署，包括 Moonbase Alpha 测试网、Kusama 上的 Moonriver 和 Polkadot 上的 Moonbeam。以下是这些环境的命名方式以及它们对应的[链规范文件](https://docs.polkadot.com/develop/parachains/deployment/generate-chain-specs/)名称：

|    网络     |      托管方      |             链名称              |
|:--------------:|:-------------------:|:-----------------------------------:|
| Moonbase Alpha | Moonbeam 基金会 | {{ networks.moonbase.chain_spec }}  |
|   Moonriver    |       Kusama        | {{ networks.moonriver.chain_spec }} |
|    Moonbeam    |      Polkadot       | {{ networks.moonbeam.chain_spec }}  |

!!! note
    Moonbase Alpha 仍然被认为是 Alphanet，因此_不会_有 100% 的正常运行时间。平行链可能会根据需要进行清除。在开发应用程序期间，请确保您实施一种方法，以便将您的合约和账户快速重新部署到新的平行链。 如果需要清除链，我们至少会提前 24 小时通过我们的 [Discord 频道](https://discord.com/invite/PfpUATX) 发布通知。

## 要求 {: #requirements }

运行平行链节点类似于典型的 Substrate 节点，但存在一些差异。Substrate 平行链节点是一个更大的构建，因为它包含运行平行链本身的代码，以及同步中继链和促进两者之间通信的代码。因此，此构建非常大，可能需要超过 30 分钟，并需要 32GB 内存。

下表显示了运行节点的最低建议规格。对于我们的 Kusama 和 Polkadot MainNet 部署，随着网络的增长，磁盘要求将会更高。

=== "Moonbeam"
    |  组件   |                                                        要求                                                        |
    |:------------:|:--------------------------------------------------------------------------------------------------------------------------:|
    |   **CPU**    |                             {{ networks.moonbeam.node.cores }} 核心（每个核心速度最快）                              |
    |   **RAM**    |                                            {{ networks.moonbeam.node.ram }} GB                                             |
    |   **SSD**    |                                      {{ networks.moonbeam.node.hd }} TB（推荐）                                      |
    | **防火墙** | P2P 端口必须对传入流量开放：<br>&nbsp; &nbsp; - 来源：任何<br>&nbsp; &nbsp; - 目标：30333、30334 TCP |

=== "Moonriver"
    |  组件   |                                                        要求                                                        |
    |:------------:|:--------------------------------------------------------------------------------------------------------------------------:|
    |   **CPU**    |                             {{ networks.moonriver.node.cores }} 核心（每个核心速度最快）                             |
    |   **RAM**    |                                            {{ networks.moonriver.node.ram }} GB                                            |
    |   **SSD**    |                                     {{ networks.moonriver.node.hd }} TB（推荐）                                      |
    | **防火墙** | P2P 端口必须对传入流量开放：<br>&nbsp; &nbsp; - 来源：任何<br>&nbsp; &nbsp; - 目标：30333、30334 TCP |

=== "Moonbase Alpha"
    |  组件   |                                                        要求                                                        |
    |:------------:|:--------------------------------------------------------------------------------------------------------------------------:|
    |   **CPU**    |                             {{ networks.moonbase.node.cores }} 核心（每个核心速度最快）                              |
    |   **RAM**    |                                            {{ networks.moonbase.node.ram }} GB                                             |
    |   **SSD**    |                                      {{ networks.moonbase.node.hd }} TB（推荐）                                      |
    | **防火墙** | P2P 端口必须对传入流量开放：<br>&nbsp; &nbsp; - 来源：任何<br>&nbsp; &nbsp; - 目标：30333、30334 TCP |

!!! note
    如果在运行节点时没有看到 `Imported` 消息（没有 `[Relaychain]` 标签），您可能需要仔细检查您的端口配置。

## 运行端口 {: #running-ports }

如前所述，中继链/平行链节点将监听多个端口。默认的 Substrate 端口用于平行链，而中继链将监听下一个更高的端口。

唯一需要打开以允许传入流量的端口是那些指定用于 P2P 的端口。**收集人不得打开 RPC 或 WS 端口**。

--8<-- 'text/node-operators/networks/run-a-node/client-changes.md'

### Parachain完整节点的默认端口 {: #default-ports-for-a-parachain-full-node }

|     描述     |         端口         |
| :----------: | :------------------: |
|    **P2P**   | {{ networks.parachain.p2p }} (TCP) |
|  **RPC & WS** | {{ networks.parachain.ws }}  |
| **Prometheus** | {{ networks.parachain.prometheus }} |

### 嵌入式中继链的默认端口 {: #default-ports-of-embedded-relay-chain }

|    描述    |         端口          |
|:--------:|:---------------------:|
|   **P2P**  | {{ networks.relay_chain.p2p }} (TCP) |
| **RPC & WS** | {{ networks.relay_chain.ws }} |
| **Prometheus** | {{ networks.relay_chain.prometheus }} |

## 安装 {: #installation }

这里有一些不同的指南可以帮助您开始运行基于 Moonbeam 的节点：

- [使用 Docker](/node-operators/networks/run-a-node/docker/) - 此方法提供了一种快速简便的 Docker 容器入门方法
- [使用 Systemd](/node-operators/networks/run-a-node/systemd/) - 建议有 Substrate 节点编译经验的用户使用此方法

## Debug、Trace 和 TxPool API {: #debug-trace-txpool-apis }

您还可以通过运行跟踪节点来访问某些非标准的 RPC 方法，这允许开发人员在运行时检查和调试交易。跟踪节点使用与标准 Moonbase Alpha、Moonriver 或 Moonbeam 节点不同的 Docker 镜像。请查看[运行跟踪节点](/node-operators/networks/tracing-node/)指南，并确保在整个说明中切换到正确的网络选项卡。然后，要与您的跟踪节点进行交互，请查看[Debug & Trace](/builders/ethereum/json-rpc/debug-trace/)指南。

## 延迟加载 {: #lazy-loading }

延迟加载允许 Moonbeam 节点在后台下载网络状态时运行，从而无需等待完全同步即可使用。您可以使用以下标志激活延迟加载：

- **`--lazy-loading-remote-rpc`** - 允许通过依赖指定的 RPC 获取网络状态来进行延迟加载，直到节点完全同步，例如：`--lazy-loading-remote-rpc 'INSERT-RPC-URL'`

使用此功能启动节点后，您将看到如下输出：

--8<-- 'code/node-operators/networks/run-a-node/terminal/lazy-loading.md'

!!! note
    Moonbeam 的延迟加载需要大量的 RPC 请求。为了避免受到公共端点的速率限制，强烈建议使用[专用端点](/builders/get-started/endpoints#endpoint-providers)。

您可以使用以下可选参数进一步自定义延迟加载功能：

- **`--lazy-loading-block`** - 指定一个用于开始加载数据的区块哈希值。如果未提供，将使用最新的区块
- **`--lazy-loading-delay-between-requests`** - 使用延迟加载时，RPC 请求之间的延迟（以毫秒为单位）。此参数控制连续 RPC 请求之间等待的时间量。这有助于管理请求速率并避免服务器不堪重负。默认值为 `100` 毫秒
- **`--lazy-loading-max-retries-per-request`** - 使用延迟加载时，RPC 请求的最大重试次数。默认值为 `10` 次重试
- **`--lazy-loading-runtime-override`** - WASM 文件的路径，用于在 fork 时覆盖运行时。如果未提供，它将从正在 fork 的区块中获取运行时
- **`--lazy-loading-state-overrides`** - JSON 文件的路径，其中包含在 fork 时要应用的状态覆盖

状态覆盖文件应定义您要覆盖的相应 pallet、存储项和值，如下所示：

[
 {
     "pallet": "System",
     "storage": "SelectedCandidates",
     "value": "0x04f24ff3a9cf04c71dbc94d0b566f7a27b94566cac"
 }
]

## 日志和故障排除 {: #logs-and-troubleshooting }

您将看到来自中继链和平行链的日志。中继链将以 `[Relaychain]` 为前缀，而平行链没有前缀。

### P2P 端口未打开 {: #p2p-ports-not-open }

如果您没有看到 `Imported` 消息（没有 `[Relaychain]` 标签），则需要检查 P2P 端口配置。P2P 端口必须对传入流量开放。

### 同步 {: #in-sync }

两条链必须始终保持同步，您应该看到 `Imported` 或 `Idle` 消息，并且已连接对等节点。

### Genesis 不匹配 {: #genesis-mismatching }

Moonbase Alpha 测试网可能需要不时地进行清除和升级。因此，您可能会看到以下消息：

text
DATE [Relaychain] 具有 peer id `ID` 的 Bootnode 位于不同的链上
chain (我们的 genesis: GENESIS_ID 他们的: OTHER_GENESIS_ID)

这通常意味着您正在运行旧版本，需要升级。

我们会提前至少 24 小时通过我们的 [Discord 频道](https://discord.com/invite/PfpUATX) 公布升级（以及相应的链清除）。

清除链数据的说明会略有不同，具体取决于您启动节点的方式：

  - 对于 Docker，您可以查看 [清除节点](/node-operators/networks/run-a-node/docker/#purge-your-node) 部分的 [使用 Docker](/node-operators/networks/run-a-node/docker/) 页面
  - 对于 Systemd，您可以查看 [清除节点](/node-operators/networks/run-a-node/systemd/#purge-your-node) 部分的 [使用 Systemd](/node-operators/networks/run-a-node/systemd/) 页面
