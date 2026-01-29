---
title: 调试与追踪交易
description: 查看 Geth 的 Debug 和 Txpool API 以及 OpenEthereum 的 Trace 模块中包含的非标准 JSON-RPC 方法，这些方法在 Moonbeam 上受支持。
categories: JSON-RPC API, 以太坊工具包
---

# 调试 API 与追踪模块

## 介绍 {: #introduction }

Geth 的 [debug](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug){target=\_blank} 和 [txpool](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool){target=\_blank} API 以及 OpenEthereum 的 [trace](https://openethereum.github.io/JSONRPC-trace-module){target=\_blank} 模块提供了非标准 RPC 方法，便于更深入地了解交易处理。Moonbeam 为了为开发者提供无缝的以太坊体验，支持了其中一些非标准的 RPC 方法。这是一个关键里程碑，因为许多项目（如 [The Graph](https://thegraph.com){target=\_blank}）依赖这些方法来索引区块链数据。

本指南将介绍 Moonbeam 上受支持的 RPC 方法，以及如何针对启用 debug、txpool 和 tracing 标志的追踪节点使用 curl 命令调用它们。你可以通过两种方式访问追踪节点：使用受支持的追踪 RPC 提供商，或自行启动追踪节点。

要查看追踪 RPC 提供商列表，请查阅 [网络端点](/builders/get-started/endpoints/#tracing-providers){target=\_blank} 页面。

如果你希望搭建自己的追踪节点，可以参考[运行追踪节点](/node-operators/networks/tracing-node/){target=\_blank}指南。追踪节点的 RPC HTTP 端点应为 `{{ networks.development.rpc_url }}`，节点日志应类似于下方示例：

--8<-- 'code/builders/ethereum/json-rpc/debug-trace/terminal/start-up-logs.md'

## 支持的 Debug 和 Trace JSON-RPC 方法 {: #supported-methods }

???+ function "debug_traceTransaction"

    此方法尝试以与网络上执行相同的方式重放一笔交易。更多信息请参阅 [Geth 文档](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtracetransaction){target=\_blank}。

    === "参数"

        - `transaction_hash` *string* - 要追踪的交易哈希
        - `tracer_config` *string* - （可选）用于配置追踪器的 JSON 对象，包含以下字段：
          - `tracer` *string* - 设置追踪器类型

        如果未提供 `tracer_config`，则默认使用 opcode logger。opcode logger 还提供以下附加字段：

        - `opcode_config` *string* - （可选）用于配置 opcode logger 的 JSON 对象：
          - `disableStorage` *boolean* — （可选，默认：`false`）设为 `true` 时禁用存储捕获
          - `disableMemory` *boolean* — （可选，默认：`false`）设为 `true` 时禁用内存捕获
          - `disableStack` *boolean* — （可选，默认：`false`）设为 `true` 时禁用堆栈捕获

    === "返回值"

        如果提供了 `tracer_config`，`result` 对象包含以下字段：

        - `type` - 调用类型
        - `from` - 发送交易的地址
        - `to` - 交易的接收地址
        - `value` - 随交易发送的值
        - `gas` - 交易执行提供的 gas
        - `gasUsed` - 已使用的 gas
        - `input` - 交易输入数据
        - `output` - 交易输出数据
        - `error` - 错误类型（如有）
        - `revertReason` - Solidity 回退原因（如有）
        - `calls` - 子调用列表（如有）

        <br>
        如果使用默认的 opcode logger，`result` 对象包含以下字段：

        - `gas` - 交易执行提供的 gas
        - `returnValue` - 交易执行生成的输出
        - `structLogs` - 一个数组，其中包含[每个 opcode 的详细日志对象](https://geth.ethereum.org/docs/developers/evm-tracing/built-in-tracers#struct-opcode-logger){target=\_blank}
        - `failed` - 布尔值，指示交易执行是否失败

    === "示例"

        使用 `tracer_config`：

        ```bash
        --8<-- 'code/builders/ethereum/json-rpc/debug-trace/1.sh'
        ```

        <br>
        使用默认的 opcode logger：

        ```bash
        --8<-- 'code/builders/ethereum/json-rpc/debug-trace/2.sh'
        ```

???+ function "debug_traceBlockByNumber"

    此方法尝试以与网络上执行相同的方式重放某个区块。更多信息请参阅 [Geth 文档](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtraceblockbynumber){target=\_blank}。

    === "参数"

        - `block_number` *string* - 要追踪的区块号
        - `tracer_config` *string* - 用于配置追踪器的 JSON 对象，包含以下字段：
          - `tracer` *string* - 设置追踪器类型。必须设为 `callTracer`，仅返回交易及子调用；否则追踪器会尝试默认使用 opcode logger，但目前由于该调用过于消耗资源而不支持

    === "返回值"

        该方法返回一个顶层为 result 的 JSON 对象，其中 result 为数组。数组中的每个元素对应区块中的一笔交易，包含 `txHash` 和 `result` 对象：

        - `txHash` - 交易哈希

        `result` 对象包含以下字段：

        - `type` - 调用类型
        - `from` - 发送交易的地址
        - `to` - 交易的接收地址
        - `value` - 随交易发送的值
        - `gas` - 交易执行提供的 gas
        - `gasUsed` - 已使用的 gas
        - `input` - 交易输入数据
        - `output` - 交易输出数据
        - `error` - 错误类型（如有）
        - `revertReason` - Solidity 回退原因（如有）
        - `calls` - 子调用列表（如有）

    === "示例"

        ```bash
        --8<-- 'code/builders/ethereum/json-rpc/debug-trace/3.sh'
        ```

???+ function "debug_traceBlockByHash"

    此方法尝试以与网络上执行相同的方式重放某个区块。更多信息请参阅 [Geth 文档](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtraceblockbyhash){target=\_blank}。

    === "参数"

        - `block_hash` *string* - 要追踪的区块哈希
        - `tracer_config` *string* - 用于配置追踪器的 JSON 对象，包含以下字段：
          - `tracer` *string* - 设置追踪器类型。必须设为 `callTracer`，仅返回交易及子调用；否则追踪器会尝试默认使用 opcode logger，但目前由于该调用过于消耗资源而不支持

    === "返回值"

        该方法返回一个顶层为 result 的 JSON 对象，其中 result 为数组。数组中的每个元素对应区块中的一笔交易，包含 `txHash` 和 `result` 对象：

        - `txHash` - 交易哈希

        `result` 对象包含以下字段：

        - `type` - 调用类型
        - `from` - 发送交易的地址
        - `to` - 交易的接收地址
        - `value` - 随交易发送的值
        - `gas` - 交易执行提供的 gas
        - `gasUsed` - 已使用的 gas
        - `input` - 交易输入数据
        - `output` - 交易输出数据
        - `error` - 错误类型（如有）
        - `revertReason` - Solidity 回退原因（如有）
        - `calls` - 子调用列表

    === "示例"

        ```bash
        --8<-- 'code/builders/ethereum/json-rpc/debug-trace/4.sh'
        ```

???+ function "debug_traceCall"

    此方法在给定区块的上下文中执行 eth_call，并使用父区块的最终状态作为基准。更多信息请参阅 [Geth 文档](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtracecall){target=\_blank}。

    === "参数"

        - `call_object` *object* - 要执行的交易对象
        - `block_hash` *string* - 基准区块的哈希

    === "返回值"

        - `gas` - 交易执行提供的 gas
        - `returnValue` - 交易执行生成的输出
        - `structLogs` - 一个数组，其中包含[每个 opcode 的详细日志对象](https://geth.ethereum.org/docs/developers/evm-tracing/built-in-tracers#struct-opcode-logger){target=\_blank}

    === "示例"

        ```bash
        --8<-- 'code/builders/ethereum/json-rpc/debug-trace/5.sh'
        ```

???+ function "trace_filter"

    此方法根据给定的过滤条件返回匹配的追踪。更多信息请参阅 [OpenEthereum 文档](https://openethereum.github.io/JSONRPC-trace-module#trace_filter){target=\_blank}。

    === "参数"

        - `fromBlock` *string* — （可选）区块号（十六进制）、`earliest`（创世区块）或 `latest`（默认，当前最好区块）。追踪起始区块
        - `toBlock` *string* — （可选）区块号（十六进制）、`earliest`（创世区块）或 `latest`（当前最好区块）。追踪结束区块
        - `fromAddress` *array* — （可选）仅筛选来自这些地址的交易。若提供空数组，则不基于此字段筛选
        - `toAddress` *array* — （可选）仅筛选发送到这些地址的交易。若提供空数组，则不基于此字段筛选
        - `after` *uint* — （可选）默认偏移为 `0`。追踪起始序号
        - `count` *uint* — （可选）每批显示的追踪数量

        需要注意的默认值：

        - 单次 `trace_filter` 请求最多返回 `500` 条追踪记录，超过该限制将返回错误
        - 请求处理的区块会在缓存中临时存储 `300` 秒，之后会被删除

        你可以在启动追踪节点时配置[其他标志](/node-operators/networks/tracing-node/#additional-flags){target=\_blank}以调整默认值。

    === "返回值"

        `result` 数组包含区块追踪的对象列表。所有对象都包含以下字段：

        - `blockHash` - 交易所在区块的哈希
        - `blockNumber` - 交易所在区块的区块号
        - `subtraces` - 交易发起的合约调用追踪
        - `traceAddress` - 调用执行的地址列表、父级地址及当前子调用的顺序
        - `transactionHash` - 交易哈希
        - `transactionPosition` - 交易位置
        - `type` - 方法类型，例如 `call` 或 `create`

        <br>
        如果交易的 `type` 为 `call`，还会包含以下字段：

        - `action` - 包含调用信息的对象：
          - `from` - 发送方地址
          - `callType` - 方法类型，如 `call`、`delegatecall`
          - `gas` - 发送方提供的 gas，十六进制编码
          - `input` - 随交易发送的数据
          - `to` - 接收方地址
          - `value` - 随交易发送的值，十六进制编码
        - `result` - 包含交易结果的对象
          - `gasUsed` - 本次交易单独使用的 gas 数量
          - `output` - 合约调用返回的值，仅包含返回方法实际发送的值；如果返回方法未执行，则输出为空字节

        如果交易的 `type` 为 `create`，则会包含以下字段：

        - `action` - 包含合约创建信息的对象：
          - `from` - 发送方地址
          - `creationMethod` - 创建方式，如 `create`
          - `gas` - 发送方提供的 gas，十六进制编码
          - `init` - 合约的初始化代码
          - `value` - 随交易发送的值，十六进制编码
        - `result` - 包含交易结果的对象
          - `address` - 合约地址
          - `code` - 合约字节码
          - `gasUsed` - 本次交易单独使用的 gas 数量

    === "示例"

        以下示例从零偏移开始，返回前 20 条追踪：

        ```sh
        --8<-- 'code/builders/ethereum/json-rpc/debug-trace/6.sh'
        ```

???+ function "txpool_content"

    返回当前等待打包到后续区块的所有 pending 交易以及未来执行的 queued 交易的详细信息。更多信息请参阅 [Geth 文档](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-content){target=\_blank}。

    === "参数"

        无

    === "返回值"

        `result` 对象包含以下字段：

        - `pending` - 包含 pending 交易详情的对象，将地址映射到一批计划交易
          - `address` - 发起交易的地址，将地址对应的 nonce 映射到各自的交易
            - `nonce` - 发送地址的 nonce
              - `blockHash` - 交易所在区块的哈希。对于 pending 交易，这是一个十六进制格式的空 32 字节字符串
              - `blockNumber` - 交易加入区块的区块号，十六进制编码。pending 交易为 `null`
              - `from` - 发送方地址
              - `gas` - 交易使用的 gas 数量
              - `gasPrice` - 发送方愿意为交易支付的总 Wei 数量
              - `maxFeePerGas` - 愿意为交易支付的最大 gas 费用
              - `maxPriorityFeePerGas` - 愿意支付给矿工的小费上限
              - `hash` - 交易哈希
              - `input` - 编码后的交易输入数据
              - `nonce` - 发送方迄今为止发送的交易数量
              - `to` - 接收方地址。合约创建交易时为 `null`
              - `transactionIndex` - 交易在区块中的索引位置，十六进制编码。pending 交易为 `null`
              - `value` - 转账数额（Wei），十六进制编码
        - `queued` - 包含 queued 交易详情的对象，将地址映射到一批计划交易
          - `address` - 发起交易的地址，将地址对应的 nonce 映射到各自的交易
            - `nonce` - 发送地址的 nonce
              - `blockHash` - 交易所在区块的哈希。对于 queued 交易，这是一个十六进制格式的空 32 字节字符串
              - `blockNumber` - 交易加入区块的区块号，十六进制编码。queued 交易为 `null`
              - `from` - 发送方地址
              - `gas` - 交易使用的 gas 数量
              - `gasPrice` - 发送方愿意为交易支付的总 Wei 数量
              - `maxFeePerGas` - 愿意为交易支付的最大 gas 费用
              - `maxPriorityFeePerGas` - 愿意支付给矿工的小费上限
              - `hash` - 交易哈希
              - `input` - 编码后的交易输入数据
              - `nonce` - 发送方迄今为止发送的交易数量
              - `to` - 接收方地址。合约创建交易时为 `null`
              - `transactionIndex` - 交易在区块中的索引位置，十六进制编码。queued 交易为 `null`
              - `value` - 转账数额（Wei），十六进制编码

    === "示例"

        ```sh
        --8<-- 'code/builders/ethereum/json-rpc/debug-trace/7.sh'
        ```

???+ function "txpool_inspect"

    返回当前等待打包到后续区块的所有 pending 交易以及未来执行的 queued 交易的摘要信息。更多信息请参阅 [Geth 文档](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-inspect){target=\_blank}。

    === "参数"

        无

    === "返回值"

        `result` 对象包含以下字段：

        - `pending` - 包含 pending 交易摘要字符串的对象，将地址映射到一批计划交易
          - `address` - 发起交易的地址，将地址对应的 nonce 映射到各自的交易摘要字符串
        - `queued` - 包含 queued 交易摘要字符串的对象，将地址映射到一批计划交易
          - `address` - 发起交易的地址，将地址对应的 nonce 映射到各自的交易摘要字符串

    === "示例"

        ```sh
        --8<-- 'code/builders/ethereum/json-rpc/debug-trace/8.sh'
        ```

???+ function "txpool_status"

    返回当前等待打包到后续区块的 pending 交易数量以及未来执行的 queued 交易数量。更多信息请参阅 [Geth 文档](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-status){target=\_blank}。

    === "参数"

        无

    === "返回值"

        `result` 对象包含以下字段：

        - `pending` - pending 交易数量
        - `queued` - queued 交易数量

    === "示例"

        ```sh
        --8<-- 'code/builders/ethereum/json-rpc/debug-trace/9.sh'
        ```
