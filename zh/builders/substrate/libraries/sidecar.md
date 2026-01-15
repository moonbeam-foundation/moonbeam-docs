---
title: 将 Substrate API Sidecar 与 Moonbeam 结合使用
description: 了解如何在基于 Moonbeam 的网络中使用基于 Substrate 的 REST 服务 Sidecar，以访问区块、帐户余额、计算gas使用量等。
categories: Substrate Toolkit, Libraries and SDKs
---

# 将 Substrate API Sidecar 与 Moonbeam 结合使用

## 介绍 {: #introduction }

Substrate API Sidecar 允许应用程序通过 REST API 访问基于 Substrate 的区块链的区块、账户余额和其他信息。这对于需要跟踪 Moonbeam 网络上的账户余额和其他状态变化的交易所、钱包或其他类型的应用程序非常有用。本页将介绍如何为 Moonbeam 安装和运行 Substrate API Sidecar，以及常用的 API 端点。

## 安装和运行 Substrate API Sidecar {: #installing-and-running-substrate-api-sidecar }

有多种安装和运行 Substrate API Sidecar 的方法。本指南将介绍通过 NPM 在本地安装和运行它的步骤。有关通过 Docker 运行 Substrate API Sidecar，或从源代码构建和运行它的信息，请参阅 [Substrate API Sidecar Github Repository](https://github.com/paritytech/substrate-api-sidecar#readme)。

### 检查先决条件 {: #checking-prerequisites }

通过 NPM 在本地运行此服务需要安装 Node.js。

--8<-- 'text/_common/install-nodejs.md'

### Installing the Substrate API Sidecar {: #installing-the-substrate-api-sidecar }

To install the Substrate API Sidecar service locally in the current directory, run this from the command line:

```bash
npm install @substrate/api-sidecar@{{ networks.moonbase.substrate_api_sidecar.stable_version }}

## 设置 Substrate API Sidecar {: #setting-up-the-substrate-api-sidecar }

在 Sidecar 将要运行的终端中，导出网络的 WS 端点的环境变量。例如：

=== "Moonbeam"

    bash
    export SAS_SUBSTRATE_URL=wss://wss.api.moonbeam.network
    

=== "Moonriver"

    bash
    export SAS_SUBSTRATE_URL=wss://wss.api.moonriver.moonbeam.network
    

=== "Moonbase Alpha"

    bash
    export SAS_SUBSTRATE_URL=wss://wss.api.moonbase.moonbeam.network
    

=== "Moonbeam Dev Node"

    bash
    export SAS_SUBSTRATE_URL=ws://127.0.0.1:9944
    

请参考 [公共端点](/builders/get-started/endpoints/) 页面，获取 Moonbeam 网络端点的完整列表。

设置环境变量后，您可以使用 `echo` 命令检查环境变量是否已正确设置，方法是输入：

bash
echo $SAS_SUBSTRATE_URL

它应该显示您刚刚设置的网络端点。

## 生成类型包 {: #generating-the-types-bundle }

Moonbeam 引入了与标准 Substrate 类型不同的自定义类型。对于像 Substrate API Sidecar 这样的 API 客户端来说，要正确理解和解码这些自定义类型，您必须为 Substrate API Sidecar 提供您正在交互的相应网络的自定义类型包。生成自定义类型包并将其与 Substrate API Sidecar 关联非常简单。

首先，请确保您已安装 [Parity 的 `generate-types-bundle` 包](https://github.com/paritytech/generate-type-bundle){target=\_blank}：

bash
npm install -g @substrate/generate-type-bundle

然后，运行以下命令为相应的网络生成类型包：

===

bash
generate-type-bundle -p "$(pwd)" -s moonbeam

===

bash
generate-type-bundle -p "$(pwd)" -s moonriver

===

bash
generate-type-bundle -p "$(pwd)" -s moonbase

请注意，运行后续命令将覆盖现有的 `typesBundle.json`。然后，您需要设置 `SAS_SUBSTRATE_TYPES_BUNDLE` 环境变量，如下所示。如果您已重命名 `typesBundle.json`，请确保使用正确的文件名。

bash
export SAS_SUBSTRATE_TYPES_BUNDLE="$(pwd)/typesBundle.json"

设置环境变量后，您可以使用以下 `echo` 命令验证是否已正确设置：

bash
echo $SAS_SUBSTRATE_TYPES_BUNDLE

## 运行 Substrate API Sidecar {: #running-substrate-api-sidecar }

设置网络端点环境变量后，从安装目录的根目录运行：

bash
node_modules/.bin/substrate-api-sidecar 

如果安装和配置成功，您应该在控制台中看到以下输出：

--8<-- 'code/builders/get-started/networks/moonbeam-dev/terminal/sidecar.md'

## Substrate API Sidecar 端点 {: #substrate-api-sidecar-endpoints }

一些常用的 Substrate API Sidecar 端点包括：

 - **GET /blocks​/head** — 获取最近最终确定的区块。可选参数 `finalized` 可以设置为 `false` 来获取最新的已知区块，该区块可能尚未最终确定
 - **GET /blocks/head/header** — 获取最近最终确定的区块头。可选参数 `finalized` 可以设置为 `false` 来获取最新的已知区块头，该区块头可能尚未最终确定
 - **GET /blocks/{blockId}** — 按高度或哈希获取一个区块
 - **GET /accounts/{accountId}/balance-info** — 获取帐户的余额信息
 - **GET /node/version** — 获取关于 Substrates 节点实现和版本的信息
 - **GET /runtime/metadata** — 以解码的 JSON 格式获取运行时元数据。

有关 Substrate API Sidecar 上可用的 API 端点的完整列表，请参阅[官方文档](https://paritytech.github.io/substrate-api-sidecar/dist)。

## 区块 JSON 对象中的 EVM 字段映射 {: #evm-fields-mapping-in-block-json-object }

Substrate API Sidecar 以 JSON 对象的形式返回 Moonbeam 区块。与 Moonbeam 交易的 EVM 执行相关的信息位于顶层字段 `extrinsics` 下，其中各个外部因素以数字方式组织为嵌套的 JSON 对象。嵌套结构如下：

text
RESPONSE JSON 区块对象：
    |--extrinsics
        |--{extrinsic_number}
            |--method
                |--pallet: "ethereum"
                |--method: "transact"
            |--signature
            |--nonce 
            |--args
                |--transaction
                    |--{transaction_type}
            |--hash
            |--events
                |--{event_number}
                    |--method
                        |--pallet: "ethereum"
                        |--method: "Executed"
                    |--data
                        |--0
                        |--1
                        |--2
                        |--3
    ...

Moonbeam EVM 交易可以通过当前外部对象下的 `method` 字段来识别，该字段设置为：

text
{extrinsic_number}.method.pallet = "ethereum"
{extrinsic_number}.method.method = "transact"

### 交易类型和有效负载 {: #transaction-types-and-payload }

Moonbeam EVM 目前支持三种交易标准：`legacy`、`eip1559` 和 `eip2930`。这些对应于上面 JSON 对象图中的 `transaction type` 字段。对于每种交易类型，交易有效负载包含以下字段：

===

    ```text
        ...
        |--eip1559
            |--chainId
            |--nonce
            |--maxPriorityFeePerGas
            |--maxFeePerGas
            |--gasLimit
            |--action
            |--value
            |--input
            |--accessList
            |--oddYParity
            |--r
            |--s
        ...
    ```

===

    ```text
        ...
        |--legacy
            |--nonce
            |--gasPrice
            |--gasLimit
            |--action
            |--value
            |--input
            |--signature
        ...
    ```

===

    ```text
        ...
        |--eip2930
            |--chainId
            |--nonce
            |--gasPrice
            |--gasLimit
            |--action
            |--value
            |--input
            |--accessList
            |--oddYParity
            |--r
            |--s
        ...
    ```

有关新的 [EIP1559](https://eips.ethereum.org/EIPS/eip-1559){target=_blank} 和 [EIP2930](https://eips.ethereum.org/EIPS/eip-2930){target=_blank} 交易类型以及每个字段含义的更多信息，请参阅各自的官方以太坊提案规范。

### 交易字段映射 {: #transaction-field-mappings }

要获取任何 EVM 交易类型的 EVM 发送者地址、接收者地址和 EVM 哈希，请检查当前 extrinsic 对象下的 `events` 字段，并确定 `method` 字段设置为以下内容的事项：

text
{event_number}.method.pallet: "ethereum"
{event_number}.method.method: "Executed" 

然后将 EVM 字段映射概括如下：

=== "EIP1559"
    |        EVM 字段         |                               区块 JSON 字段                               |
    |:------------------------:|:----------------------------------------------------------------------------:|
    |         链 ID         |       `extrinsics[extrinsic_number].args.transaction.eip1559.chainId`        |
    |          随机数           |        `extrinsics[extrinsic_number].args.transaction.eip1559.nonce`         |
    | 每个 gas 的最大优先费用 | `extrinsics[extrinsic_number].args.transaction.eip1559.maxPriorityFeePerGas` |
    |     每个 gas 的最大费用      |     `extrinsics[extrinsic_number].args.transaction.eip1559.maxFeePerGas`     |
    |        Gas 限制         |       `extrinsics[extrinsic_number].args.transaction.eip1559.gasLimit`       |
    |       访问列表        |      `extrinsics[extrinsic_number].args.transaction.eip1559.accessList`      |
    |        签名         |    `extrinsics[extrinsic_number].args.transaction.eip1559.oddYParity/r/s`    |
    |      发送者地址      |         `extrinsics[extrinsic_number].events[event_number].data[0]`          |
    |    接收者地址     |         `extrinsics[extrinsic_number].events[event_number].data[1]`          |
    |         EVM 哈希         |         `extrinsics[extrinsic_number].events[event_number].data[2]`          |
    |   EVM 执行状态   |         `extrinsics[extrinsic_number].events[event_number].data[3]`          |

=== "Legacy"
    |      EVM 字段       |                         区块 JSON 字段                         |
    |:--------------------:|:----------------------------------------------------------------:|
    |        随机数         |   `extrinsics[extrinsic_number].args.transaction.legacy.nonce`   |
    |      Gas 价格       | `extrinsics[extrinsic_number].args.transaction.legacy.gasPrice`  |
    |      Gas 限制       | `extrinsics[extrinsic_number].args.transaction.legacy.gasLimit`  |
    |        值         |   `extrinsics[extrinsic_number].args.transaction.legacy.value`   |
    |      签名       | `extrinsics[extrinsic_number].args.transaction.legacy.signature` |
    |    发送者地址    |   `extrinsics[extrinsic_number].events[event_number].data[0]`    |
    |  接收者地址   |   `extrinsics[extrinsic_number].events[event_number].data[1]`    |
    |       EVM 哈希       |   `extrinsics[extrinsic_number].events[event_number].data[2]`    |
    | EVM 执行状态 |   `extrinsics[extrinsic_number].events[event_number].data[3]`    |

=== "EIP2930"
    |      EVM 字段       |                            区块 JSON 字段                            |
    |:--------------------:|:----------------------------------------------------------------------:|
    |       链 ID       |    `extrinsics[extrinsic_number].args.transaction.eip2930.chainId`     |
    |        随机数         |     `extrinsics[extrinsic_number].args.transaction.eip2930.nonce`      |
    |      Gas 价格       |    `extrinsics[extrinsic_number].args.transaction.eip2930.gasPrice`    |
    |      Gas 限制       |    `extrinsics[extrinsic_number].args.transaction.eip2930.gasLimit`    |
    |        值         |     `extrinsics[extrinsic_number].args.transaction.eip2930.value`      |
    |     访问列表      |   `extrinsics[extrinsic_number].args.transaction.eip2930.accessList`   |
    |      签名       | `extrinsics[extrinsic_number].args.transaction.eip2930.oddYParity/r/s` |
    |    发送者地址    |      `extrinsics[extrinsic_number].events[event_number].data[0]`       |
    |  接收者地址   |      `extrinsics[extrinsic_number].events[event_number].data[1]`       |
    |       EVM 哈希       |      `extrinsics[extrinsic_number].events[event_number].data[2]`       |
    | EVM 执行状态 |      `extrinsics[extrinsic_number].events[event_number].data[3]`       |

!!! note
    对于 Substrate 交易，“随机数”和“签名”字段位于 `extrinsics[extrinsic_number]` 下。对于 EVM 交易，“随机数”和“签名”字段位于 `extrinsics[extrinsic_number].args.transaction[transaction_type]` 下，从而将 `extrinsics[extrinsic_number]` 下的“随机数”和“签名”保留为 `null`。

    成功执行的 EVM 交易将在“EVM 执行状态”字段下返回 `succeed: "Stopped"` 或 `succeed: "Returned"`。

{
  "source_path": "builders/substrate/libraries/sidecar.md",
  "source_language": "EN",
  "target_language": "ZH",
  "checksum": "1f9f71cba55ffcab7624462da3a3c22b4c4431d8a45a3d3eddedd43c09270750",
  "content": "### ERC-20 Token Transfers {: #erc-20-token-transfers }\n\nEvents emitted by smart contracts such as an ERC-20 token contract deployed on Moonbeam can be decoded from Sidecar block JSON objects. The nesting structure is as following:\n\n```text
RESPONSE JSON Block Object:
    |--extrinsics
        |--{extrinsic_number}
            |--method
                |--pallet: \"ethereum\"\n                |--method: \"transact\"\n            |--signature:\n            |--nonce: \n            |--args
                |--transaction
                    |--{transaction_type}\n            |--hash
            |--events
                |--{event_number}
                    |--method
                        |--pallet: \"evm\"\n                        |--method: \"Log\"\n                    |--data
                        |--0
                            |-- address
                            |-- topics
                                |--0
                                |--1
                                |--2
					        |-- data
            ...
    ...

## 用于监控原生代币转移的示例代码 { #sample-code-for-monitoring-native-token-transfers }

[交易 API 页面](/learn/core-concepts/transfers-api/#using-substrate-api-sidecar){target=\_blank} 有一个代码段，演示了如何使用 Substrate API Sidecar 来检索和解码使用 Substrate 和 Ethereum API 在 Moonbeam 网络上发送的原生代币转移。您可以将其作为起点，构建利用 Sidecar 监听 Moonbeam 网络上的转移的后端。

## 计算交易费用 {: #calculating-transaction-fees }

有关如何使用 Substrate Sidecar API 计算 Moonbeam 交易的交易费用的更多详细信息和示例代码，请查看[在 Moonbeam 上计算交易费用](/learn/core-concepts/tx-fees/){target=_blank}页面。

--8<-- 'text/_disclaimers/third-party-content.md'
