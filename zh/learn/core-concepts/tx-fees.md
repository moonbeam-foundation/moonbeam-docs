---
title: 计算交易手续费
description: 了解 Moonbeam 中使用的交易费用模型，以及开发者应该注意的与以太坊的不同之处。
categories: Basics
---

# 在Moonbeam上计算交易手续费

## 简介 {: #introduction }

与 Moonbeam 上[用于发送转账的以太坊和 Substrate API](/learn/core-concepts/transfers-api/){target=_blank}类似，Moonbeam 上的 Substrate 和 EVM 层也有不同的交易费用模型，开发人员在需要计算和跟踪交易费用时应注意这些模型。

首先，以太坊交易根据其计算复杂性和数据存储需求消耗 gas 单位。另一方面，Substrate 交易使用“权重”的概念来确定费用。在本指南中，您将学习如何计算 Substrate 和以太坊交易的交易费用。对于以太坊交易，您还将了解 Moonbeam 和以太坊上交易费用计算方式的主要区别。

### 与以太坊的主要区别 {: #key-differences-with-ethereum}

Moonbeam 上的交易费用模型与以太坊上存在一些主要差异，开发人员在 Moonbeam 上进行开发时应注意以下几点：

  - [动态费用机制](https://forum.moonbeam.network/t/proposal-dynamic-fee-mechanism-for-moonbeam-and-moonriver/241){target=_blank} 类似于 [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=_blank}，但实现方式不同

  - Moonbeam 交易费用模型中使用的 gas 量是从交易的 Substrate extrinsic `refTime` 组件（交易权重）通过固定的 `{{ networks.moonbase.tx_weight_to_gas_ratio }}` 系数以及 `proofSize` 组件（交易权重）通过固定的 `{{ xcm.generic_weights.proof_size.weight_per_gas }}` 系数映射得出的。然后，将交易权重向量与单位 gas 价格相乘，以计算交易费用。这种费用模型意味着通过以太坊 API 发送交易（如基本余额转移）可能比通过 Substrate API 发送交易便宜得多。

  - EVM 的设计仅具有 gas 容量，而 Moonbeam 需要 gas 以外的其他指标。特别是，Moonbeam 需要能够记录 proof size，即 Moonbeam 上中继链验证器验证状态转换所需的存储量。当当前区块的 proof size 容量限制达到区块限制的 25% 时，将抛出“Out of Gas”错误。即使 gas 表中还剩余 *传统* gas，也可能发生这种情况。此附加指标还会影响退款。退款基于执行后消耗的更多资源。换句话说，如果成比例地消耗的 proof size 多于传统 gas，则将使用 proof size 计算退款

  - Moonbeam 实施了一种在 [MBIP-5](https://github.com/moonbeam-foundation/moonbeam/blob/master/MBIPS/MBIP-5.md){target=_blank} 中定义的新机制，该机制限制了区块存储，并增加了导致存储增加的交易的 gas 用量

## MBIP-5 概述 {: #overview-of-mbip-5 }

MBIP-5 引入了对 Moonbeam 的费用机制的更改，该机制考虑了网络上的存储增长，这与以太坊处理费用的方式不同。通过提高执行增加链状态的交易所需的 gas，并建立区块存储限制，它可以控制存储增长。

这会影响添加到链状态的合约部署、创建新存储条目的交易以及导致创建新账户的预编译合约调用。

区块存储限制可防止单个区块中的交易集体将存储状态增加超过该限制。每个网络的限制如下：

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.mbip_5.block_storage_limit }}KB
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.mbip_5.block_storage_limit }}KB
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.mbip_5.block_storage_limit }}KB
    ```

为了确定存储（以字节为单位）所需的 gas 量，存在一个比率，定义为：

```text
Ratio = 区块 Gas 限制 / (区块存储限制 * 1024 字节)
```

每个网络的区块 gas 限制如下：

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.gas_block }}
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.gas_block }}
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.gas_block }}
    ```

了解区块 gas 和存储限制后，gas 与存储的比率计算如下：

=== "Moonbeam"

    ```text
    Ratio = {{ networks.moonbeam.gas_block_numbers_only }} / ({{ networks.moonbeam.mbip_5.block_storage_limit }} * 1024)
    Ratio = {{ networks.moonbeam.mbip_5.gas_storage_ratio }} 
    ```

=== "Moonriver"

    ```text
    Ratio = {{ networks.moonriver.gas_block_numbers_only }} / ({{ networks.moonriver.mbip_5.block_storage_limit }} * 1024)
    Ratio = {{ networks.moonriver.mbip_5.gas_storage_ratio }} 
    ```

=== "Moonbase Alpha"

    ```text
    Ratio = {{ networks.moonbase.gas_block_numbers_only }} / ({{ networks.moonbase.mbip_5.block_storage_limit }} * 1024)
    Ratio = {{ networks.moonbase.mbip_5.gas_storage_ratio }} 
    ```

然后，您可以获取给定交易的存储增长量（以字节为单位），并将其乘以 gas 与存储增长的比率，以确定要添加到交易中的 gas 单位数量。例如，如果您执行一个将存储增加 {{ networks.moonbase.mbip_5.example_storage }} 字节的交易，则使用以下计算来确定要添加的 gas 单位：

=== "Moonbeam"

    ```text
    Additional Gas = {{ networks.moonbeam.mbip_5.example_storage }} * {{ networks.moonbeam.mbip_5.gas_storage_ratio }}
    Additional Gas = {{ networks.moonbeam.mbip_5.example_addtl_gas }}
    ```

=== "Moonriver"

    ```text
    Additional Gas = {{ networks.moonriver.mbip_5.example_storage }} * {{ networks.moonriver.mbip_5.gas_storage_ratio }}
    Additional Gas = {{ networks.moonriver.mbip_5.example_addtl_gas }}
    ```

=== "Moonbase Alpha"

    ```text
    Additional Gas = {{ networks.moonbase.mbip_5.example_storage }} * {{ networks.moonbase.mbip_5.gas_storage_ratio }}
    Additional Gas = {{ networks.moonbase.mbip_5.example_addtl_gas }}
    ```

要亲眼目睹此 MBIP 如何将 Moonbeam 与以太坊区分开来，您可以估算两个不同合约交互在两个网络上的 gas：一个修改链状态中的项目，另一个不修改。例如，您可以使用一个问候合约，该合约允许您存储一个名称，然后使用该名称来说“Hello”。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract SayHello {
    mapping(address => string) public addressToName;

    constructor(string memory _name) {
        addressToName[msg.sender] = _name;
    }

    // Store a name associated to the address of the sender
    function setName(string memory _name) public {
        addressToName[msg.sender] = _name;
    } 

    // Use the name in storage associated to the sender
    function sayHello() external view returns (string memory) {
        return string(abi.encodePacked(

## Ethereum API 交易费用 {: #ethereum-api-transaction-fees }

要计算通过 Ethereum API 发送的 Moonbeam 交易产生的费用，可以使用以下公式：

===

    text
    GasPrice = BaseFee + MaxPriorityFeePerGas < MaxFeePerGas ? 
                BaseFee + MaxPriorityFeePerGas : 
                MaxFeePerGas;
    Transaction Fee = (GasPrice * TransactionWeight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    

===

    text
    Transaction Fee = (GasPrice * TransactionWeight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    

===

    text
    Transaction Fee = (GasPrice * TransactionWeight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    

!!! note
    Moonbeam 上的 EIP-1559 交易费用是使用前一个区块的基本费用计算的。

以下各节更详细地描述了计算交易费用所需的每个组成部分。

### 基本费用 {: #base-fee}

`BaseFee` 是发送交易收取的最低金额，是网络本身设置的值。它在 [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=_blank} 中引入。Moonbeam 拥有自己的 [动态费用机制](https://forum.moonbeam.network/t/proposal-dynamic-fee-mechanism-for-moonbeam-and-moonriver/241){target=_blank}，用于计算基本费用，该费用根据区块拥塞情况进行调整。截至运行时 2300，动态费用机制已推广到所有基于 Moonbeam 的网络。

每个网络的最低 Gas 价格如下：

===

    |     变量      |                   值                    |
    |:-----------------:|:------------------------------------------:|
    | 最低 Gas 价格 | {{ networks.moonbeam.min_gas_price }} Gwei |

===

    |     变量      |                   值                    |
    |:-----------------:|:------------------------------------------:|
    | 最低 Gas 价格 | {{ networks.moonriver.min_gas_price }} Gwei |

===

    |     变量      |                   值                    |
    |:-----------------:|:------------------------------------------:|
    | 最低 Gas 价格 | {{ networks.moonbase.min_gas_price }} Gwei |

要计算动态基本费用，请使用以下计算公式：

===

    ```text
    BaseFee = NextFeeMultiplier * 31250000000 / 10^18
    ```

===

    ```text
    BaseFee = NextFeeMultiplier * 312500000 / 10^18
    ```

===

    ```text
    BaseFee = NextFeeMultiplier * 31250000 / 10^18
    ```

`NextFeeMultiplier` 的值可以通过 Substrate Sidecar API 检索，通过以下端点：

```text
GET /pallets/transaction-payment/storage/nextFeeMultiplier?at={blockId}
```

Sidecar 的 pallets 端点返回与 pallet 相关的数据，例如 pallet 存储中的数据。您可以在 [官方 Sidecar 文档](https://paritytech.github.io/substrate-api-sidecar/dist/#operations-tag-pallets){target=_blank} 中阅读有关 pallets 端点的更多信息。手头所需的存储数据是 `nextFeeMultiplier`，可以在 `transaction-payment` pallet 中找到。存储的 `nextFeeMultiplier` 值可以直接从 Sidecar 存储模式中读取。作为 JSON 对象读取，相关的嵌套结构如下：

```text
RESPONSE JSON Storage Object:
    |--at
        |--hash
        |--height
    |--pallet
    |--palletIndex
    |--storageItem
    |--keys
    |--value
```

相关数据将存储在 JSON 对象的 `value` 键中。此值是一个定点数据类型，因此实际值通过将 `value` 除以 `10^18` 来找到。这就是为什么 [`BaseFee` 的计算](#ethereum-api-transaction-fees) 包含这样一个操作。

### 交易权重 {: #transaction-weight}

`TransactionWeight` 是一种 Substrate 机制，用于衡量给定交易在区块中执行所需的执行时间。交易的权重是一个包含两个分量的向量：`refTime` 和 `proofSize`。`refTime` 指的是可用于执行的计算时间量。`proofSize` 指的是提交到 Polkadot Relay Chain 以进行验证的 Moonbeam 区块的 PoV（有效性证明）的大小。由于 `refTime` 和 `proofSize` 都是确定权重的组成部分，因此仅凭其中一个值无法获得准确的权重值。

对于所有交易类型，可以在相关 extrinsic 的事件下检索 `TransactionWeight`，其中 `method` 字段设置为：

text
pallet: "system", method: "ExtrinsicSuccess" 

然后，`TransactionWeight` 映射到区块 JSON 对象的以下两个字段。`proofSize` 映射如下：

text
extrinsics[extrinsic_number].events[event_number].data[0].weight.proof_size 

`refTime` 映射如下：

text
extrinsics[extrinsic_number].events[event_number].data[0].weight.ref_time

### 费用历史记录端点 {: #eth-feehistory-endpoint }

Moonbeam网络实现了 [`eth_feeHistory`](https://www.alchemy.com/docs/node/ethereum/ethereum-api-endpoints/eth-fee-history){target_blank} JSON-RPC端点，作为对EIP-1559支持的一部分。

`eth_feeHistory` 返回一个历史gas信息的集合，您可以从中参考和计算提交EIP-1559交易时 `MaxFeePerGas` 和 `MaxPriorityFeePerGas` 字段的设置值。

以下curl示例将返回Moonbeam网络上从最新区块开始的最近10个区块的gas信息，使用的是 `eth_feeHistory`：

==="Moonbeam"

    sh
    curl --location \
         --request POST '{{ networks.moonbeam.rpc_url }}' \
         --header 'Content-Type: application/json' \
         --data-raw '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_feeHistory",
            "params": ["0xa", "latest"]
         }'
    
==="Moonriver"

    sh
    curl --location \
         --request POST '{{ networks.moonriver.rpc_url }}' \
         --header 'Content-Type: application/json' \
         --data-raw '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_feeHistory",
            "params": ["0xa", "latest"]
         }'
    
==="Moonbase Alpha"

    sh
    curl --location \
         --request POST '{{ networks.moonbase.rpc_url }}' \
         --header 'Content-Type: application/json' \
         --data-raw '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_feeHistory",
            "params": ["0xa", "latest"]
         }'
    
==="Moonbeam Dev Node"

    sh
    curl --location \
         --request POST '{{ networks.development.rpc_url }}' \
         --header 'Content-Type: application/json' \
         --data-raw '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_feeHistory",
            "params": ["0xa", "latest"]
         }'

### 计算交易费用的示例代码 {: #sample-code }

以下代码片段使用 [Axios HTTP 客户端](https://axios-http.com){target=\_blank} 查询 [Sidecar 端点 `/blocks/head`](https://paritytech.github.io/substrate-api-sidecar/dist/#operations-tag-blocks){target=\_blank} 以获取最新的已完成区块。然后，它根据交易类型（对于以太坊 API：legacy、EIP-1559 或 EIP-2930 标准，以及对于 Substrate API）计算区块中所有交易的交易费用，并计算区块中的总交易费用。

!!! note
    Moonbeam 上的 EIP-1559 交易费用是使用前一个区块的基本费用计算的。

以下代码示例仅用于演示目的，未经修改和进一步测试，不应在生产环境中使用。

您可以将以下代码段用于任何基于 Moonbeam 的网络，但您需要相应地修改 `baseFee`。您可以参考 [基本费用](#base-fee) 部分以获取每个网络的计算方法。

js
--8<-- 'code/learn/core-concepts/tx-fees/tx-fees-block-dynamic.js'

## Substrate API 交易费用 {: #substrate-api-transaction-fees }

本指南的这一部分假设您正在通过 [Substrate API Sidecar](/builders/substrate/libraries/sidecar/){target=_blank} 服务与 Moonbeam 区块进行交互。还有其他与 Moonbeam 区块交互的方式，例如使用 [Polkadot.js API 库](/builders/substrate/libraries/polkadot-js-api/){target=_blank}。一旦检索到区块，逻辑是相同的。

您可以参考 [Substrate API Sidecar 页面](/builders/substrate/libraries/sidecar/){target=_blank}，了解有关安装和运行您自己的 Sidecar 服务实例的信息，以及有关如何解码 Moonbeam 交易的 Sidecar 区块的更多详细信息。

**请注意，本节中的信息假设您正在运行 {{ networks.moonbase.substrate_api_sidecar.stable_version }} 版本的 Substrate Sidecar REST API。**

可以通过以下区块端点提取通过 Substrate API 发送的交易的所有费用数据：

```text
GET /blocks/{blockId}
```

区块端点将返回与一个或多个区块相关的数据。您可以在 [官方 Sidecar 文档](https://paritytech.github.io/substrate-api-sidecar/dist/#operations-tag-blocks){target=_blank} 上阅读有关区块端点的更多信息。作为 JSON 对象读取，相关的嵌套结构如下：

```text
RESPONSE JSON Block Object:
    ...
    |--number
    |--extrinsics
        |--{extrinsic_number}
            |--method
            |--signature
            |--nonce
            |--args
            |--tip           
            |--hash
            |--info
            |--era
            |--events
                |--{event_number}
                    |--method
                        |--pallet: "transactionPayment"
                        |--method: "TransactionFeePaid"
                    |--data
                        |--0
                        |--1
                        |--2
    ...

```

对象映射总结如下：

|   交易信息   |                      区块 JSON 字段                       |
|:------------------:|:-----------------------------------------------------------:|
| 费用支付账户 | `extrinsics[extrinsic_number].events[event_number].data[0]` |
|  支付的总费用   | `extrinsics[extrinsic_number].events[event_number].data[1]` |
|        小费         | `extrinsics[extrinsic_number].events[event_number].data[2]` |

与交易费用相关的信息可以在相关 extrinsic 的 event 下检索，其中 `method` 字段设置为：

```text
pallet: "transactionPayment", method: "TransactionFeePaid" 
```

然后，为此 extrinsic 支付的总交易费用将映射到区块 JSON 对象的以下字段：

```text
extrinsics[extrinsic_number].events[event_number].data[1]
```

--8<-- 'text/_disclaimers/third-party-content.md'
