---
title: Moonbeam 特定的 RPC 方法
description: 探索 Moonbeam 专门的 API 端点，其中包含专为 Moonbeam 功能设计的自定义 JSON-RPC 方法。
categories: JSON-RPC APIs, Reference
---

# Moonbeam 自定义 API

## 简介 {: #introduction }

Moonbeam 节点包括对自定义 JSON-RPC 端点的支持：

- `moon_isBlockFinalized`
- `moon_isTxFinalized`
- `moon_getEthSyncBlockRange`

这些端点为检查链上事件的最终性提供了有价值的功能。

要开始探索 Moonbeam 的自定义 JSON-RPC 端点，您可以尝试下面提供的 curl 示例。这些示例演示了如何查询 Moonbase Alpha 的公共 RPC 端点。但是，您可以通过更改 URL 和 API 密钥轻松地修改它们，以便与您自己的 Moonbeam 或 Moonriver 端点一起使用。如果您还没有这样做，您可以从我们支持的[端点提供商](/builders/get-started/endpoints/){target=_blank}处获取您的端点和 API 密钥。

## 支持的自定义 RPC 方法 {: #rpc-methods }

???+ function "moon_isBlockFinalized"

    检查给定区块哈希的区块是否已最终确定。

    === "参数"

        - `block_hash` *string* - 区块的哈希值，接受 Substrate 风格或 Ethereum 风格的区块哈希作为输入

    === "返回值"

        返回一个布尔值：如果区块已最终确定，则返回 `true`；如果区块未最终确定或未找到，则返回 `false`。

    === "示例"

        ```bash
        curl -H "Content-Type: application/json" -X POST --data '{
          "jsonrpc": "2.0",
          "id": "1",
          "method": "moon_isBlockFinalized",
          "params": ["INSERT_BLOCK_HASH"]
        }' {{ networks.moonbase.rpc_url }}
        ```
        

???+ function "moon_isTxFinalized"

    检查给定 EVM 交易哈希的交易是否已最终确定。

    === "参数"

        - `tx_hash` *string* - 交易的 EVM 交易哈希

    === "返回值"

        返回一个布尔值：如果交易已最终确定，则返回 `true`；如果交易未最终确定或未找到，则返回 `false`。

    === "示例"

        ```bash
        curl -H "Content-Type: application/json" -X POST --data '{
          "jsonrpc": "2.0",
          "id": "1",
          "method": "moon_isTxFinalized",
          "params": ["INSERT_TRANSACTION_HASH"]
        }' {{ networks.moonbase.rpc_url }}
        ```
        

???+ function "moon_getEthSyncBlockRange"

    返回 Frontier 后端中完全索引的区块范围。

    === "参数"

        None

    === "返回值"

        返回 Frontier 后端中完全索引的区块范围。以下示例响应包括区块 `0` 和最新完全索引区块的 Substrate 区块哈希：

        ```[
        "0x91bc6e169807aaa54802737e1c504b2577d4fafedd5a02c10293b1cd60e39527",
        "0xb1b49bd709ca9fe0e751b8648951ffbb2173e1258b8de8228cfa0ab27003f612"
        ]```

    === "示例"

        ```bash
        curl -H "Content-Type: application/json" -X POST --data '{
          "jsonrpc": "2.0",
          "id": "1",
          "method": "moon_getEthSyncBlockRange",
          "params": []
        }' {{ networks.moonbase.rpc_url }}
        ```
