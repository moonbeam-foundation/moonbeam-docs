---
title: 调试与追踪交易
description: 查看 Geth 的 Debug 和 Txpool API 以及 OpenEthereum 的 Trace 模块中包含的非标准 JSON-RPC 方法，这些方法在 Moonbeam 上受支持。
categories: JSON-RPC API, 以太坊工具包
---

# 调试 API & 追踪模块

## 介绍 {: #introduction }

Geth 的 [debug](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug){target=\_blank} 和 [txpool](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool){target=\_blank} API 以及 OpenEthereum 的 [trace](https://openethereum.github.io/JSONRPC-trace-module){target=\_blank} 模块提供了非标准的 RPC 方法，以便更深入地了解交易处理。作为 Moonbeam 为开发者提供无缝以太坊体验的目标的一部分，我们支持其中一些非标准的 RPC 方法。支持这些 RPC 方法是一个重要的里程碑，因为许多项目（如 [The Graph](https://thegraph.com){target=\_blank}）依赖它们来索引区块链数据。

本指南将介绍 Moonbeam 上可用的受支持 RPC 方法，以及如何使用 curl 命令针对启用了 debug、txpool 和 tracing 标志的追踪节点调用它们。您可以通过两种方式访问追踪节点：通过受支持的追踪 RPC 提供商或启动您自己的追踪节点。

要查看追踪 RPC 提供商的列表，请查看 [网络端点](/builders/get-started/endpoints/#tracing-providers){target=\_blank} 页面。

如果您希望设置自己的追踪节点，您可以按照 [运行追踪节点](/node-operators/networks/tracing-node/){target=\_blank} 指南进行操作。您的追踪节点的 RPC HTTP 端点应位于 `{{ networks.development.rpc_url }}`，并且您的节点应显示与以下内容类似的日志：

--8<-- 'code/builders/ethereum/json-rpc/debug-trace/terminal/start-up-logs.md'
