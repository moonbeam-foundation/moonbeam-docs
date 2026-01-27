---
title: 计算交易费用
description: 了解 Moonbeam 中使用的交易费用模型，以及开发人员应该注意的与以太坊相比的差异。
categories: Basics
---

# 在 Moonbeam 上计算交易费用

## 简介 {: #introduction }

与 Moonbeam 上的[用于发送转账的 Ethereum 和 Substrate API](learn/core-concepts/transfers-api/){target=\_blank}类似，Moonbeam 上的 Substrate 和 EVM 层也有不同的交易手续费模型，开发者在需要计算和跟踪交易手续费时应该注意。

首先，以太坊交易根据其计算复杂性和数据存储要求消耗 gas 单位。另一方面，Substrate 交易使用“权重”的概念来确定费用。在本指南中，您将学习如何计算 Substrate 和 Ethereum 交易的交易手续费。在以太坊交易方面，您还将了解 Moonbeam 和以太坊计算交易手续费方式之间的主要区别。

### 与以太坊的主要区别 {: #key-differences-with-ethereum}

Moonbeam 上的交易费模型与以太坊上的交易费模型存在一些主要差异，开发人员在 Moonbeam 上进行开发时应注意：

  - [动态费用机制](https://forum.moonbeam.network/t/proposal-dynamic-fee-mechanism-for-moonbeam-and-moonriver/241){target=\_blank} 类似于 [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=\_blank} 的机制，但实现方式不同

  - Moonbeam 的交易费用模型中使用的 gas 量是从交易的 Substrate extrinsic `refTime` 组件（交易权重）通过固定因子 `{{ networks.moonbase.tx_weight_to_gas_ratio }}` 映射而来，`proofSize` 组件（交易权重）通过固定因子 `{{ xcm.generic_weights.proof_size.weight_per_gas }}` 映射而来。然后将交易权重向量与单位 gas 价格相乘，以计算交易费用。这种费用模型意味着通过 Ethereum API 发送交易（如基本余额转移）可能比通过 Substrate API 发送交易便宜得多。

  - EVM 的设计仅具有 gas 容量，而 Moonbeam 需要 gas 之外的额外指标。特别是，Moonbeam 需要能够记录证明大小，这是 Moonbeam 上中继链验证器验证状态转换所需的存储量。当当前区块的证明大小容量达到上限（即区块上限的 25%）时，将抛出“Out of Gas”错误。即使 gas 表中剩余*旧版* gas，也可能发生这种情况。此额外指标也会影响退款。退款基于执行后消耗的更多资源。换句话说，如果按比例消耗的证明大小多于旧版 gas，则将使用证明大小来计算退款

  - Moonbeam 实施了 [MBIP-5](https://github.com/moonbeam-foundation/moonbeam/blob/master/MBIPS/MBIP-5.md){target=\_blank} 中定义的新机制，该机制限制了区块存储，并增加了导致存储增加的交易的 gas 使用量

## MBIP-5 概述 {: #overview-of-mbip-5 }

MBIP-5 引入了对 Moonbeam 的费用机制的更改，该机制考虑了网络上的存储增长，这与以太坊处理费用的方式不同。通过提高执行增加链状态的交易所需的 Gas，并建立区块存储限制，它可以控制存储增长。

这会影响添加到链状态的合约部署、创建新存储条目的交易以及导致创建新帐户的预编译合约调用。

区块存储限制可防止单个区块中的交易集体将存储状态增加超过限制。每个网络的限制如下：

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
    

要确定存储（以字节为单位）的 Gas 量，存在一个定义为以下内容的比例：

```text
比例 = 区块 Gas 限制 / (区块存储限制 * 1024 字节)
```

每个网络的区块 Gas 限制如下：

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

了解了区块 Gas 和存储限制后，Gas 与存储的比例计算如下：

=== "Moonbeam"

    ```text
    比例 = {{ networks.moonbeam.gas_block_numbers_only }} / ({{ networks.moonbeam.mbip_5.block_storage_limit }} * 1024)
    比例 = {{ networks.moonbeam.mbip_5.gas_storage_ratio }} 
    ```

=== "Moonriver"

    ```text
    比例 = {{ networks.moonriver.gas_block_numbers_only }} / ({{ networks.moonriver.mbip_5.block_storage_limit }} * 1024)
    比例 = {{ networks.moonriver.mbip_5.gas_storage_ratio }} 
    ```

=== "Moonbase Alpha"

    ```text
    比例 = {{ networks.moonbase.gas_block_numbers_only }} / ({{ networks.moonbase.mbip_5.block_storage_limit }} * 1024)
    比例 = {{ networks.moonbase.mbip_5.gas_storage_ratio }} 
    ```

然后，您可以获取给定交易的存储增长（以字节为单位），并将其乘以 Gas 与存储增长的比率，以确定要添加到交易中的 Gas 单位数量。例如，如果您执行的交易将存储增加 {{ networks.moonbase.mbip_5.example_storage }} 字节，则使用以下计算来确定要添加的 Gas 单位：

=== "Moonbeam"

    ```text
    额外 Gas = {{ networks.moonbeam.mbip_5.example_storage }} * {{ networks.moonbeam.mbip_5.gas_storage_ratio }}
    额外 Gas = {{ networks.moonbeam.mbip_5.example_addtl_gas }}
    ```

=== "Moonriver"

    ```text
    额外 Gas = {{ networks.moonriver.mbip_5.example_storage }} * {{ networks.moonriver.mbip_5.gas_storage_ratio }}
    额外 Gas = {{ networks.moonriver.mbip_5.example_addtl_gas }}
    ```

=== "Moonbase Alpha"

    ```text
    额外 Gas = {{ networks.moonbase.mbip_5.example_storage }} * {{ networks.moonbase.mbip_5.gas_storage_ratio }}
    额外 Gas = {{ networks.moonbase.mbip_5.example_addtl_gas }}
    ```

要亲身体验此 MBIP 如何区分 Moonbeam 和以太坊，您可以估算两个不同合约交互在两个网络上的 Gas：一个修改链状态中的项目，另一个不修改。例如，您可以使用一个问候合约，该合约允许您存储一个名称，然后使用该名称来说“Hello”。

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
        return string(abi.encodePacked("Hello ", addressToName[msg.sender]));
    }
}
```
您可以在 Moonriver 和以太坊上，或在 Moonbeam 的测试网 Moonbase Alpha 和以太坊的测试网 Sepolia 上部署此合约。上述合约已部署到 Moonbase Alpha 和 Sepolia。您可以随意访问以下地址的这些合约：

=== "Moonbase Alpha"

    ```text
    0xDFF8E772A9B212dc4FbA19fa650B440C5c7fd7fd
    ```

=== "Sepolia"

    ```text
    0x8D0C059d191011E90b963156569A8299d7fE777d
    ```

接下来，您可以使用 `eth_estimateGas` 方法来检查在每个网络上调用 `setName` 和 `sayHello` 函数的 Gas 估算值。为此，您需要每个交易的字节码，其中包括函数选择器，以及 `setName` 函数的要设置的名称。此示例字节码将名称设置为“Chloe”：

=== "设置名称"

    ```text
    0xc47f00270000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000543686c6f65000000000000000000000000000000000000000000000000000000
    ```

=== "Say Hello"

    ```text
    0xef5fb05b
    ```

现在，您可以使用以下 curl 命令在 Moonbase Alpha 上返回 Gas 估算值：

=== "设置名称"

    ```sh
    curl {{ networks.moonbase.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
    '{
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_estimateGas",
        "params":[{
            "to": "0xDFF8E772A9B212dc4FbA19fa650B440C5c7fd7fd",
            "data": "0xc47f00270000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000543686c6f65000000000000000000000000000000000000000000000000000000"
        }]
    }'
    ```

=== "Say Hello"

    ```sh
    curl {{ networks.moonbase.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
    '{
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_estimateGas",
        "params":[{
            "to": "0xDFF8E772A9B212dc4FbA19fa650B440C5c7fd7fd",
            "data": "0xef5fb05b"
        }]
    }'
    ```

然后在 Sepolia 上，您可以对 `data` 使用相同的字节码，并修改 RPC URL 和合约地址以定位部署到 Sepolia 的合约：

=== "设置名称"

    ```sh
    curl https://sepolia.publicgoods.network -H "Content-Type:application/json;charset=utf-8" -d \
    '{
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_estimateGas",
        "params":[{
            "to": "0x8D0C059d191011E90b963156569A8299d7fE777d",
            "data": "0xc47f00270000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000543686c6f65000000000000000000000000000000000000000000000000000000"
        }]
    }'
    ```

=== "Say Hello"

    ```sh
    curl https://sepolia.publicgoods.network -H "Content-Type:application/json;charset=utf-8" -d \
    '{
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_estimateGas",
        "params":[{
            "to": "0x8D0C059d191011E90b963156569A8299d7fE777d",
            "data": "0xef5fb05b"
        }]
    }'
    ```

在撰写本文时，两个网络的 Gas 估算值如下：

=== "Moonbase Alpha"

    |   方法   | Gas 估算值 |
    |:----------:|:------------:|
    |  `setName` |     45977    |
    | `sayHello` |     25938    |

=== "Sepolia"

    |   方法   | Gas 估算值 |
    |:----------:|:------------:|
    |  `setName` |     21520    |
    | `sayHello` |     21064    |

您会看到，在 Sepolia 上，两个调用的 Gas 估算值非常相似，而在 Moonbase Alpha 上，调用之间存在显着差异，并且修改存储的 `setName` 调用比 `sayHello` 调用使用更多的 Gas。

## Ethereum API 交易费用 {: #ethereum-api-transaction-fees }

要计算通过 Ethereum API 发送的 Moonbeam 交易产生的费用，可以使用以下公式：

=== "EIP-1559"

    ```text
    GasPrice = BaseFee + MaxPriorityFeePerGas < MaxFeePerGas ? 
                BaseFee + MaxPriorityFeePerGas : 
                MaxFeePerGas;
    Transaction Fee = (GasPrice * TransactionWeight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```

=== "Legacy"

    ```text
    Transaction Fee = (GasPrice * TransactionWeight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```

=== "EIP-2930"

    ```text
    Transaction Fee = (GasPrice * TransactionWeight) / {{ networks.moonbase.tx_weight_to_gas_ratio }}
    ```

!!! note
    Moonbeam 上的 EIP-1559 交易费用是使用前一个区块的基本费用计算的。

以下各节更详细地描述了计算交易费用所需的每个组成部分。

### 基础费用 {: #base-fee}

`BaseFee` 是发送交易收取的最低金额，是由网络本身设置的值。它是在 [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=\_blank} 中引入的。Moonbeam 拥有自己的 [动态费用机制](https://forum.moonbeam.network/t/proposal-dynamic-fee-mechanism-for-moonbeam-and-moonriver/241){target=\_blank}，用于计算基础费用，该费用会根据区块拥堵情况进行调整。截至 runtime 2300，动态费用机制已推广到所有基于 Moonbeam 的网络。

每个网络的最低 Gas 价格如下：

=== "Moonbeam"

    |     变量      |                   值                    |
    |:-----------------:|:------------------------------------------:|
    | 最低 Gas 价格 | {{ networks.moonbeam.min_gas_price }} Gwei |

=== "Moonriver"

    |     变量      |                   值                    |
    |:-----------------:|:------------------------------------------:|
    | 最低 Gas 价格 | {{ networks.moonriver.min_gas_price }} Gwei |

=== "Moonbase Alpha"

    |     变量      |                   值                    |
    |:-----------------:|:------------------------------------------:|
    | 最低 Gas 价格 | {{ networks.moonbase.min_gas_price }} Gwei |

要计算动态基础费用，请使用以下计算公式：

=== "Moonbeam"

    ```text
    BaseFee = NextFeeMultiplier * 31250000000 / 10^18
    ```

=== "Moonriver"

    ```text
    BaseFee = NextFeeMultiplier * 312500000 / 10^18
    ```

=== "Moonbase Alpha"

    ```text
    BaseFee = NextFeeMultiplier * 31250000 / 10^18
    ```

`NextFeeMultiplier` 的值可以从 Substrate Sidecar API 中检索，通过以下端点：

```text
GET /pallets/transaction-payment/storage/nextFeeMultiplier?at={blockId}
```

Sidecar 的 pallets 端点返回与 pallet 相关的数据，例如 pallet 存储中的数据。您可以在 [官方 Sidecar 文档](https://paritytech.github.io/substrate-api-sidecar/dist/#operations-tag-pallets){target=\_blank} 中阅读有关 pallets 端点的更多信息。从存储中获取所需的数据是 `nextFeeMultiplier`，它可以在 `transaction-payment` pallet 中找到。存储的 `nextFeeMultiplier` 值可以直接从 Sidecar 存储模式中读取。作为 JSON 对象读取，相关的嵌套结构如下：

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

相关数据将存储在 JSON 对象的 `value` 键中。此值是定点数据类型，因此，实际值通过将 `value` 除以 `10^18` 得到。这就是为什么 [`BaseFee` 的计算方式](#ethereum-api-transaction-fees) 包含这样的操作。

### GasPrice、MaxFeePerGas 和 MaxPriorityFeePerGas {: #gasprice-maxfeepergas-maxpriorityfeepergas }

`GasPrice` 用于指定在 [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=\_blank} 之前的传统（legacy）交易的 gas 价格。`MaxFeePerGas` 和 `MaxPriorityFeePerGas` 都是在 EIP-1559 中与 `BaseFee` 一同引入的。`MaxFeePerGas` 定义了每单位 gas 允许支付的最高手续费，它等于 `BaseFee` 与 `MaxPriorityFeePerGas` 之和。`MaxPriorityFeePerGas` 则是交易发送方配置的最高手续费优先费（priority fee），用于激励区块中对该交易进行优先打包。

尽管 Moonbeam 与以太坊兼容，但其核心仍是一条基于 Substrate 的链，而 Substrate 中的优先级机制与以太坊不同。在 Substrate 中，交易并不是按 gas 价格来排序优先级的。为了解决这一点，Moonbeam 采用了经过修改的优先级系统，使用一种“以太坊优先”的方案对 Substrate 交易重新设定优先级。Substrate 交易仍会经过有效性（validity）流程，在该流程中会被分配交易标签（tags）、存活期（longevity）以及优先级（priority）。随后，原始优先级会被覆盖为一个新的优先级，该优先级基于交易的每 gas 手续费（fee per gas）计算得出，而该值又由交易的 tip 与 weight 推导而来。如果该交易是以太坊交易，则优先级会根据优先费（priority fee）来设定。

需要注意的是，优先级并不是决定区块内交易排序的唯一因素。其他因素（例如交易的存活期 longevity）也会在排序过程中发挥作用。

适用于相应交易类型的 `GasPrice`、`MaxFeePerGas` 和 `MaxPriorityFeePerGas` 的取值，可以根据 [Sidecar API 页面](builders/substrate/libraries/sidecar/#evm-fields-mapping-in-block-json-object){target=\_blank} 中描述的结构，从区块的 JSON 对象中读取。

某个特定区块中的以太坊交易数据可以通过以下区块端点提取：


```text
GET /blocks/{blockId}
```

相关取值的路径也已被截断，并在下方重新列出：


=== "EIP1559"
    |      EVM 字段       |                               区块 JSON 字段                               |
    |:-------------------:|:---------------------------------------------------------------------------:|
    |    MaxFeePerGas     |     `extrinsics[extrinsic_number].args.transaction.eip1559.maxFeePerGas`     |
    | MaxPriorityFeePerGas | `extrinsics[extrinsic_number].args.transaction.eip1559.maxPriorityFeePerGas` |

=== "Legacy"
    | EVM 字段 |                        区块 JSON 字段                         |
    |:--------:|:-------------------------------------------------------------:|
    | GasPrice | `extrinsics[extrinsic_number].args.transaction.legacy.gasPrice` |

=== "EIP2930"
    | EVM 字段 |                         区块 JSON 字段                         |
    |:--------:|:--------------------------------------------------------------:|
    | GasPrice | `extrinsics[extrinsic_number].args.transaction.eip2930.gasPrice` |



### 交易权重 {: #transaction-weight}

`TransactionWeight` 是一种 Substrate 机制，用于衡量给定交易在区块内执行所需的执行时间。交易的权重是一个包含两个分量的向量：`refTime` 和 `proofSize`。`refTime` 指的是可用于执行的计算时间量。`proofSize` 指的是 Moonbeam 区块的 PoV（有效性证明）的大小，该PoV 会被提交到 Polkadot Relay Chain 进行验证。由于 `refTime` 和 `proofSize` 都是确定权重的组成部分，因此仅凭其中一个值无法获得准确的权重值。

对于所有交易类型，可以在相关 extrinsic 的事件下检索 `TransactionWeight`，其中 `method` 字段设置为：

```text
pallet: "system", method: "ExtrinsicSuccess" 
```

然后，`TransactionWeight` 映射到区块 JSON 对象的以下两个字段。`proofSize` 的映射如下：

```text
extrinsics[extrinsic_number].events[event_number].data[0].weight.proof_size 
```

`refTime` 的映射如下：

```text
extrinsics[extrinsic_number].events[event_number].data[0].weight.ref_time
```

### Fee History 端点 {: #eth-feehistory-endpoint }

Moonbeam 网络实现了 [`eth_feeHistory`](https://www.alchemy.com/docs/node/ethereum/ethereum-api-endpoints/eth-fee-history){target_blank} JSON-RPC 端点，作为对 EIP-1559 的支持。

`eth_feeHistory` 返回历史 gas 信息集合，您可以参考这些信息并计算提交 EIP-1559 交易时 `MaxFeePerGas` 和 `MaxPriorityFeePerGas` 字段的设置值。

以下 curl 示例将使用 `eth_feeHistory` 返回在相应 Moonbeam 网络上从最新区块开始的最近 10 个区块的 gas 信息：

=== "Moonbeam"

    ```sh
    curl --location \
         --request POST '{{ networks.moonbeam.rpc_url }}' \
         --header 'Content-Type: application/json' \
         --data-raw '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_feeHistory",
            "params": ["0xa", "latest"]
         }'
    ```
    
=== "Moonriver"

    ```sh
    curl --location \
         --request POST '{{ networks.moonriver.rpc_url }}' \
         --header 'Content-Type: application/json' \
         --data-raw '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_feeHistory",
            "params": ["0xa", "latest"]
         }'
    ``` 
=== "Moonbase Alpha"

    ```sh
    curl --location \
         --request POST '{{ networks.moonbase.rpc_url }}' \
         --header 'Content-Type: application/json' \
         --data-raw '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_feeHistory",
            "params": ["0xa", "latest"]
         }'
    ```
=== "Moonbeam Dev Node"

    ```sh
    curl --location \
         --request POST '{{ networks.development.rpc_url }}' \
         --header 'Content-Type: application/json' \
         --data-raw '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_feeHistory",
            "params": ["0xa", "latest"]
         }'
    ```

### 用于计算交易费的示例代码 {: #sample-code }

以下代码片段使用 [Axios HTTP 客户端](https://axios-http.com){target=\_blank} 查询 [Sidecar 端点 `/blocks/head`](https://paritytech.github.io/substrate-api-sidecar/dist/#operations-tag-blocks){target=\_blank} 以获取最新的最终确定区块。然后，它根据交易类型（对于以太坊 API：legacy、EIP-1559 或 EIP-2930 标准，以及对于 Substrate API）计算区块中所有交易的交易费用，并计算区块中的总交易费用。

!!! note
    Moonbeam 上的 EIP-1559 交易费用是使用前一个区块的基本费用计算的。

以下代码示例仅用于演示目的，未经修改和在生产环境中进行进一步测试，不应使用。

您可以将以下代码段用于任何基于 Moonbeam 的网络，但您需要相应地修改 `baseFee`。您可以参考 [基本费用](#base-fee) 部分来获取每个网络的计算方法。

```js
--8<-- 'code/learn/core-concepts/tx-fees/tx-fees-block-dynamic.js'
```

## Substrate API 交易费用 {: #substrate-api-transaction-fees }

本指南的这一部分假设您正在通过 [Substrate API Sidecar](/builders/substrate/libraries/sidecar/){target=\_blank} 服务与 Moonbeam 区块进行交互。还有其他与 Moonbeam 区块交互的方式，例如使用 [Polkadot.js API 库](/builders/substrate/libraries/polkadot-js-api/){target=\_blank}。一旦检索到区块，逻辑是相同的。

您可以参考 [Substrate API Sidecar 页面](/builders/substrate/libraries/sidecar/){target=\_blank}，获取有关安装和运行您自己的 Sidecar 服务实例的信息，以及有关如何解码 Sidecar 区块以进行 Moonbeam 交易的更多细节。

**请注意，本节中的信息假设您运行的是 Substrate Sidecar REST API 的 {{ networks.moonbase.substrate_api_sidecar.stable_version }} 版本。**

通过 Substrate API 发送的交易的所有费用数据都可以从以下区块端点提取：

```text
GET /blocks/{blockId}
```

区块端点将返回与一个或多个区块相关的数据。您可以在 [官方 Sidecar 文档](https://paritytech.github.io/substrate-api-sidecar/dist/#operations-tag-blocks){target=\_blank} 上阅读有关区块端点的更多信息。以 JSON 对象读取时，相关的嵌套结构如下：

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

与交易费用相关的信息可以在相关 extrinsic 的事件下检索，其中 `method` 字段设置为：

```text
pallet: "transactionPayment", method: "TransactionFeePaid" 
```

然后，为此 extrinsic 支付的总交易费用将映射到区块 JSON 对象的以下字段：

```text
extrinsics[extrinsic_number].events[event_number].data[1]
```
--8<-- 'zh/text/_disclaimers/third-party-content.md'
