---
title: 调试和追踪交易
description: 了解 Moonbeam 上支持的 Geth 的 Debug 和 Txpool API 以及 OpenEthereum 的 Trace 模块中包含的非标准 JSON-RPC 方法。
categories: JSON-RPC APIs, Ethereum 工具包
---

# Debug API & Trace 模块

## 简介 {: #introduction }

Geth 的 [debug](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug){target=_blank} 和 [txpool](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool){target=_blank} API 以及 OpenEthereum 的 [trace](https://openethereum.github.io/JSONRPC-trace-module){target=_blank} 模块提供了非标准的 RPC 方法，以便更深入地了解交易处理。为了实现为开发者提供无缝以太坊体验这一 Moonbeam 的目标，我们支持其中一些非标准的 RPC 方法。支持这些 RPC 方法是一个重要的里程碑，因为许多项目（如 [The Graph](https://thegraph.com){target=_blank}）都依赖它们来索引区块链数据。

本指南将介绍 Moonbeam 上可用的受支持的 RPC 方法，以及如何使用 curl 命令针对启用了 debug、txpool 和 tracing 标志的跟踪节点来调用它们。您可以通过两种方式访问跟踪节点：通过受支持的跟踪 RPC 提供商或启动您自己的跟踪节点。

要查看跟踪 RPC 提供商的列表，请查看 [网络端点](/builders/get-started/endpoints/#tracing-providers){target=_blank} 页面。

如果您希望设置自己的跟踪节点，您可以按照 [运行跟踪节点](/node-operators/networks/tracing-node/){target=_blank} 指南进行操作。您的跟踪节点的 RPC HTTP 端点应位于 `{{ networks.development.rpc_url }}`，并且您的节点应显示与以下内容相似的日志：

--8<-- 'code/builders/ethereum/json-rpc/debug-trace/terminal/start-up-logs.md'

## 支持的Debug和Trace JSON-RPC方法 {: #supported-methods }

???+ function "debug_traceTransaction"

    此方法尝试以与在网络上执行相同的方式重放交易。有关更多信息，请参阅 [Geth 的文档](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtracetransaction){target=_blank}。

    === "参数"

        - `transaction_hash` *string* - 要跟踪的交易的哈希值
        - `tracer_config` *string* - （可选）用于配置跟踪器的 JSON 对象，其中包含以下字段：
            - `tracer` *string* - 设置跟踪器的类型

        如果未提供 `tracer_config`，则操作码记录器将是默认跟踪器。操作码记录器提供以下附加字段：

        - `opcode_config` *string* - （可选）用于配置操作码记录器的 JSON 对象：
            - `disableStorage` *boolean* — (可选，默认值：`false`) 将此设置为 `true` 将禁用存储捕获
            - `disableMemory` *boolean* — (可选，默认值：`false`) 将此设置为 `true` 将禁用内存捕获
            - `disableStack` *boolean* — (可选，默认值：`false`) 将此设置为 `true` 将禁用堆栈捕获

    === "返回值"

        如果您提供了 `tracer_config`，则 `result` 对象包含以下字段：

        - `type` - 调用的类型
        - `from` - 发送交易的地址
        - `to` - 交易定向到的地址
        - `value` - 随此交易发送的值的整数
        - `gas` - 为交易执行提供的 gas 的整数
        - `gasUsed` - 已使用的 gas 的整数
        - `input` - 输入时给定的数据
        - `output` - 作为输出返回的数据
        - `error` - 错误的类型（如果有）
        - `revertReason` - solidity revert 原因的类型（如果有）
        - `calls` - 子调用的列表（如果有）

        <br>
        如果您使用了默认的操作码记录器，则 `result` 对象包含以下字段：

        - `gas`- 为交易执行提供的 gas 的整数
        - `returnValue` - 交易执行产生的输出
        - `structLogs` - [包含每个操作码详细日志的对象数组](https://geth.ethereum.org/docs/developers/evm-tracing/built-in-tracers#struct-opcode-logger){target=_blank} 在交易期间执行
        - `failed` - 一个布尔值，指示交易执行是失败还是成功

    === "示例"

        使用 `tracer_config`：

        ```bash
        curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
        '{
          "jsonrpc":"2.0",
          "id": 1,
          "method": "debug_traceTransaction",
          "params": ["INSERT_TRANSACTION_HASH", {"tracer": "callTracer"}]
        }'
        ```

        <br>
        使用默认的操作码记录器：

        ```bash
        curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
        '{
          "jsonrpc":"2.0",
          "id": 1,
          "method": "debug_traceTransaction",
          "params": ["INSERT_TRANSACTION_HASH"]
        }'
        ```

???+ function "debug_traceBlockByNumber"

    此方法尝试以与在网络上执行相同的方式重放区块。有关更多信息，请参阅 [Geth 的文档](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtraceblockbynumber){target=_blank}。

    === "参数"

        - `block_number` *string* - 要跟踪的区块的区块号
        - `tracer_config` *string* - 用于配置跟踪器的 JSON 对象，其中包含以下字段：
            - `tracer` *string* - 设置跟踪器的类型。这必须设置为 `callTracer`，它仅返回交易和子调用。否则，跟踪器将尝试默认使用操作码记录器，但由于调用的繁重性质，目前不支持该记录器

    === "返回值"

        该方法返回一个 JSON 对象，该对象具有一个顶层 result 属性，该属性是一个数组。此数组中的每个元素对应于区块中的单个交易，并包括一个 `txHash` 和一个 `result` 对象，如下所示：

        - `txHash` - 交易哈希

        `result` 对象包含以下字段：

        - `type` - 调用的类型
        - `from` - 发送交易的地址
        - `to` - 交易定向到的地址
        - `value` - 随此交易发送的值的整数
        - `gas` - 为交易执行提供的 gas 的整数
        - `gasUsed` - 已使用的 gas 的整数
        - `input` - 输入时给定的数据
        - `output` - 作为输出返回的数据
        - `error` - 错误的类型（如果有）
        - `revertReason` - solidity revert 原因的类型（如果有）
        - `calls` - 子调用的列表（如果有）

    === "示例"

        ```bash
        curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
          '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "debug_traceBlockByNumber",
            "params": ["INSERT_BLOCK_NUMBER", {"tracer": "callTracer"}]
          }'
        ```

???+ function "debug_traceBlockByHash"

    此方法尝试以与在网络上执行相同的方式重放区块。有关更多信息，请参阅 [Geth 的文档](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtraceblockbyhash){target=_blank}。

    === "参数"

        - `block_hash` *string* - 要跟踪的区块的区块哈希
        - `tracer_config` *string* - 用于配置跟踪器的 JSON 对象，其中包含以下字段：
            - `tracer` *string* - 设置跟踪器的类型。这必须设置为 `callTracer`，它仅返回交易和子调用。否则，跟踪器将尝试默认使用操作码记录器，但由于调用的繁重性质，目前不支持该记录器

    === "返回值"

        该方法返回一个 JSON 对象，该对象具有一个顶层 result 属性，该属性是一个数组。此数组中的每个元素对应于区块中的单个交易，并包括一个 `txHash` 和一个 `result` 对象，如下所示：

        - `txHash` - 交易哈希

        `result` 对象包含以下字段：

        - `type` - 调用的类型
        - `from` - 发送交易的地址
        - `to` - 交易定向到的地址
        - `value` - 随此交易发送的值的整数
        - `gas` - 为交易执行提供的 gas 的整数
        - `gasUsed` - 已使用的 gas 的整数
        - `input` - 输入时给定的数据
        - `output` - 作为输出返回的数据
        - `error` - 错误的类型（如果有）
        - `revertReason` - solidity revert 原因的类型（如果有）
        - `calls` - 子调用的列表

    === "示例"

        ```bash
        curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
          '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "debug_traceBlockByHash",
            "params": ["INSERT_BLOCK_HASH", {"tracer": "callTracer"}]
          }'
        ```

???+ function "debug_traceCall"

    此方法使用父区块的最终状态作为基础，在给定区块的上下文中执行 eth_call。有关更多信息，请参阅 [Geth 的文档](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtracecall){target=_blank}。

    === "参数"
        - `call_object` *object* 要执行的交易对象
        - `block_hash` *string* - 基本区块的区块哈希

    === "返回值"
        - `gas`- 为交易执行提供的 gas 的整数
        - `returnValue` - 交易执行产生的输出
        - `structLogs` - [包含每个操作码详细日志的对象数组](https://geth.ethereum.org/docs/developers/evm-tracing/built-in-tracers#struct-opcode-logger){target=_blank} 在交易期间执行

    === "示例"

        ```bash
        curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
          '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "debug_traceCall",
            "params": [{
                "from": "INSERT_FROM_ADDRESS",
                "to":"INSERT_TO_ADDRESS",
                "data":"INSERT_CALL_DATA"
                }, "INSERT_BLOCK_HASH"]
          }'
        ```

???+ function "trace_filter"

    此方法返回给定过滤器的匹配跟踪。有关更多信息，请参阅 [Open Ethereum 的文档](https://openethereum.github.io/JSONRPC-trace-module#trace_filter){target=_blank}。

    === "参数"

        - `fromBlock` *string* — (可选) 区块号 (十六进制)、`earliest`（创世区块）或 `latest`（默认，可用最佳区块）。跟踪起始区块
        - `toBlock` *string* — (可选) 区块号 (十六进制)、`earliest`（创世区块）或 `latest`（可用最佳区块）。跟踪结束区块
        - `fromAddress` *array* — (可选) 仅过滤来自这些地址的交易。如果提供一个空数组，则不使用此字段进行过滤
        - `toAddress` *array* — (可选) 仅过滤到这些地址的交易。如果提供一个空数组，则不使用此字段进行过滤
        - `after` *uint* — (可选) 默认偏移量为 `0`。跟踪偏移量（或起始）编号
        - `count` *uint* — (可选) 在批处理中显示的跟踪数

        您应该注意以下几个默认值：

        - 允许 `trace_filter` 的单个请求返回的最大跟踪条目数为 `500`。超过此限制的请求将返回错误
        - 请求处理的区块会临时存储在缓存中 `300` 秒，之后会被删除

        您可以在启动跟踪节点时配置[其他标志](/node-operators/networks/tracing-node/#additional-flags){target=_blank} 以更改默认值。

    === "返回值"

        `result` 数组包含区块跟踪的对象数组。所有对象将包含以下字段：

        - `blockHash`- 此交易所在的区块的哈希值
        - `blockNumber` - 此交易所在的区块号
        - `subtraces` - 交易发起的合约调用的跟踪
        - `traceAddress` - 执行调用的地址列表、父地址和当前子调用的顺序
        - `transactionHash` - 交易的哈
