---
title: 如何使用 Chopsticks 来 Fork Moonbeam
description: 了解如何使用 Chopsticks 来重放区块、剖析状态更改、测试 XCM 交互以及在本地 Fork 整个 Moonbeam 网络的基础知识。
categories: Substrate Toolkit, Dev Environments
---

# 如何使用 Chopsticks 分叉 Moonbeam

## 简介 {: #introduction }

[Chopsticks](https://github.com/AcalaNetwork/chopsticks){target=_blank} 提供了一种开发者友好的方法，用于在本地复刻现有的基于 Substrate 的链。它允许重放区块，以便轻松检查外部因素如何影响状态、为 XCM 测试复刻多个区块等等。这使开发者能够在本地开发环境中测试和实验他们自己的定制区块链配置，而无需部署实时网络。

总的来说，Chopsticks 旨在简化在 Substrate 上构建区块链应用程序的过程，并使其对更广泛的开发者可访问。

### 快速入门 {: #quickstart }

Fork Moonbeam 最简单的方法是通过存储在 Chopsticks GitHub 存储库中的配置文件：

===

    bash
    npx @acala-network/chopsticks@latest \
    --config=https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonbeam.yml
    

===

    bash
    npx @acala-network/chopsticks@latest \
    --config=https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonriver.yml
    

===

    bash
    npx @acala-network/chopsticks@latest \
    --config=https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonbase-alpha.yml

### 与 Fork 交互 {: #interacting-with-a-fork }

运行 fork 时，默认情况下它可以通过以下方式访问：

```text
ws://localhost:8000
```

您将能够通过诸如 [Polkadot.js](https://github.com/polkadot-js/common){target=_blank} 及其 [用户界面 Polkadot.js Apps](https://github.com/polkadot-js/apps){target=_blank} 等库与平行链进行交互。

您可以通过 [Polkadot.js Apps 托管的用户界面](https://polkadot.js.org/apps/#/explorer){target=_blank} 与 Chopsticks 进行交互。为此，请访问该页面并执行以下步骤：

1. 单击左上角的图标
2. 转到底部并打开 **Development**
3. 选择 **Custom** 端点并输入 `ws://localhost:8000`
4. 单击 **Switch** 按钮

![Open WSS](/images/builders/substrate/dev-env/chopsticks/chopsticks-1.webp)
![Switch WSS](/images/builders/substrate/dev-env/chopsticks/chopsticks-2.webp)

现在，您应该能够像与活动的平行链或中继链一样与 fork 进行交互。

!!! note
    如果您的浏览器无法连接到 Chopsticks 提供的 WebSocket 端点，您可能需要允许 Polkadot.js Apps URL 的不安全连接。 另一种解决方案是运行 [Polkadot.js Apps 的 Docker 版本](https://github.com/polkadot-js/apps#docker){target=_blank}。

## 重放区块 {: #replaying-blocks }

如果您想重放一个区块并检索其信息以剖析 extrinsic 的影响，您可以使用 `npx @acala-network/chopsticks@latest run-block` 命令。它有以下标志：

|            Flag            |                                      Description                                       |
|:--------------------------:|:--------------------------------------------------------------------------------------:|
|         `endpoint`         |                         要分叉的平行链的端点。                         |
|          `block`           |            用于指定要重放分叉的区块哈希或编号。            |
|      `wasm-override`       |  用作平行链运行时的 WASM 路径，而不是端点的运行时。   |
|            `db`            |    用于存储或将要存储平行链数据库的文件名路径。    |
|          `config`          |                            配置文件的路径或 URL。                             |
| `output-path=/[file_path]` |   用于将结果打印到 JSON 文件，而不是在控制台中打印出来。   |
|           `html`           | 包含以生成块之间存储差异预览的 HTML 表示形式。 |
|           `open`           |                        是否打开 HTML 表示形式。                        |

例如，运行以下命令将重新运行 Moonbeam 的第 1000 个区块，并将存储差异和其他数据写入 `moonbeam-output.json` 文件中：

bash
npx @acala-network/chopsticks@latest run-block  \
--endpoint wss://wss.api.moonbeam.network  \
--output-path=./moonbeam-output.json  \
--block 1000

## WebSocket 命令 {: #websocket-commands }

Chopsticks 的内部 websocket 服务器具有特殊的端点，允许操作本地 Substrate 链。以下是可以调用的方法：

|      方法      |      参数       |                          描述                          |
|:----------------:|:---------------------:|:-------------------------------------------------------------:|
|  `dev_newBlock`  |       `options`       |               生成一个或多个新区块。               |
| `dev_setStorage` | `values`, `blockHash` |         创建或覆盖任何存储的值。         |
| `dev_timeTravel` |        `date`         |     将区块的时间戳设置为 `date` 值。      |
|  `dev_setHead`   |    `hashOrNumber`     | 将区块链的头设置为特定的哈希或数字。 |

以上参数的格式如下：

|   参数    |               格式                |                                示例                                 |
|:--------------:|:-----------------------------------:|:----------------------------------------------------------------------:|
|   `options`    | `{ "to": number, "count": number }` |                            `{ "count": 5 }`                            |
|    `values`    |              `Object`               | `{ "Sudo": { "Key": "0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b" } }`  |
|  `blockHash`   |              `string`               | `"0x1a34506b33e918a0106b100db027425a83681e2332fe311ee99d6156d2a91697"` |
|     `date`     |               `Date`                |                        `"2030-08-15T00:00:00"`                         |
| `hashOrNumber` |               `number               |                                string`                                 |

- **`options` { "to": number, "count": number }** - 一个 JSON 对象，其中 `"to"` 将创建达到某个值的区块，而 `"count"` 将增加一定数量的区块。在 JSON 对象中一次只使用一个条目
- **`values` Object** - 一个 JSON 对象，类似于存储值的路径，类似于您通过 Polkadot.js 检索到的路径
- **`blockHash` string** - 可选项，更改存储值的区块哈希值
- **`date` Date** - 一个 Date 字符串（与 JavaScript Date 库兼容），它将更改要创建的下一个区块的时间戳。所有未来的区块将按时间顺序排列在该时间点之后
- **`hashOrNumber` number | string** - 如果找到，链头将被设置为具有此值的区块号或区块哈希的区块

每个方法都可以通过连接到 websocket（默认为 `ws://localhost:8000`）并以下列格式发送数据和参数来调用。将 `METHOD_NAME` 替换为方法的名称，并将 `PARAMETER_1` 和 `PARAMETER_2` 替换为与该方法相关的参数数据，或将其删除：

{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "METHOD_NAME",
    "params": ["PARAMETER_1", "PARAMETER_2", "..."]
}

--8<-- 'text/_disclaimers/third-party-content.md'
