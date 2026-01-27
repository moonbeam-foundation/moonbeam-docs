---
title: 如何使用 Chopsticks 将 Moonbeam 分叉
description: 了解如何使用 Chopsticks 重放区块、剖析状态更改、测试 XCM 交互以及在本地分叉整个 Moonbeam 网络的基础知识。
categories: Substrate 工具包，开发环境
---

# 如何使用 Chopsticks Fork Moonbeam

## 简介 {: #introduction }

[Chopsticks](https://github.com/AcalaNetwork/chopsticks){target=\_blank} 提供了一种对开发者友好的方法，可以在本地 Fork 现有的基于 Substrate 的链。它允许重放区块，以便轻松检查 extrinsic 如何影响状态，Fork 多个区块以进行 XCM 测试等等。这允许开发者在本地开发环境中，测试和实验他们自己的自定义区块链配置，而无需部署实时网络。

总的来说，Chopsticks 旨在简化在 Substrate 上构建区块链应用程序的过程，并使其能够被更广泛的开发者使用。

## 使用 Chopsticks 分叉 Moonbeam {: #forking-moonbeam }

要使用 Chopsticks，您可以将其作为软件包通过 [Node package manager](https://nodejs.org/en){target=\_blank} 或 [Yarn](https://yarnpkg.com){target=\_blank} 安装：

```bash
npm i @acala-network/chopsticks@latest
```

安装完成后，您可以使用 Node package executor 运行命令。例如，以下命令运行 Chopsticks 的基本命令：

```bash
npx @acala-network/chopsticks@latest
```

要运行 Chopsticks，您需要某种配置，通常是通过文件。Chopsticks 的源代码仓库包含一组 [YAML](https://yaml.org){target=\_blank} 配置文件，可用于创建各种 Substrate 链的本地副本。 您可以从[源代码仓库的 `configs` 文件夹](https://github.com/AcalaNetwork/chopsticks){target=\_blank}下载配置文件。

Moonbeam、Moonriver 和 Moonbase Alpha 都有可用的默认文件：

=== "Moonbeam"

    ```yaml
    endpoint: wss://wss.api.moonbeam.network
    mock-signature-host: true
    db: ./db.sqlite

    import-storage:
      System:
        Account:
          -
            -
              - "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"
            - data:
                free: "100000000000000000000000"
      TechCommitteeCollective:
        Members: ["0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"]
      CouncilCollective:
        Members: ["0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"]
      TreasuryCouncilCollective:
        Members: ["0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"]
      AuthorFilter:
        EligibleRatio: 100
        EligibleCount: 100
    ```

=== "Moonriver"

    ```yaml
    endpoint: wss://wss.moonriver.moonbeam.network
    mock-signature-host: true
    db: ./db.sqlite

    import-storage:
      System:
        Account:
          -
            -
              - "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"
            - data:
                free: "100000000000000000000000"
      TechCommitteeCollective:
        Members: ["0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"]
      CouncilCollective:
        Members: ["0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"]
      TreasuryCouncilCollective:
        Members: ["0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"]
      AuthorFilter:
        EligibleRatio: 100
        EligibleCount: 100
    ```

=== "Moonbase Alpha"

    ```yaml
    endpoint: wss://wss.api.moonbase.moonbeam.network
    mock-signature-host: true
    db: ./db.sqlite

    import-storage:
      System:
        Account:
          -
            -
              - "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"
            - data:
                free: "100000000000000000000000"
      TechCommitteeCollective:
        Members: ["0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"]
      CouncilCollective:
        Members: ["0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"]
      TreasuryCouncilCollective:
        Members: ["0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"]
      Sudo:
        Key: "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac"
      AuthorFilter:
        EligibleRatio: 100
        EligibleCount: 100
    ```

以下是可以包含在配置文件中的设置：

|           Option           |                                    Description                                     |
| :------------------------: | :--------------------------------------------------------------------------------: |
|         `genesis`          |         从 parachain 的原始 genesis 文件构建分叉的链接，而不是 endpoint。          |
|        `timestamp`         |                               要分叉的区块的时间戳。                               |
|         `endpoint`         |                          要分叉的 parachain 的 endpoint。                          |
|          `block`           |                      用于指定在哪个区块哈希或编号处回放分叉。                      |
|      `wasm-override`       |          要用作 parachain 运行时的 WASM 路径，而不是 endpoint 的运行时。           |
|            `db`            |                 存储或将存储 parachain 数据库的文件的名称的路径。                  |
|          `config`          |                               配置文件的路径或 URL。                               |
|           `port`           |                           要在其上公开 endpoint 的端口。                           |
|     `build-block-mode`     |                  区块应如何在分叉中构建：batch、manual、instant。                  |
|      `import-storage`      |             要在 parachain 存储中覆盖的预定义 JSON/YAML 存储文件路径。             |
| `allow-unresolved-imports` |              使用 WASM 构建 parachain 时是否允许 WASM 未解析的导入。               |
|           `html`           |                         包括以生成区块之间的存储差异预览。                         |
|   `mock-signature-host`    | 模拟签名主机，以便任何以 `0xdeadbeef` 开头并由 `0xcd` 填充的签名都被认为是有效的。 |

您可以使用配置文件和基本命令 `npx @acala-network/chopsticks@latest`，通过为其提供 `--config` 标志来分叉资产。

您可以使用默认配置文件的原始 GitHub URL、本地配置文件的路径，或者仅使用链的名称作为 `--config` 标志。例如，以下命令都以相同的方式使用 Moonbeam 的配置：

=== "Chain Name"

    ```bash
    npx @acala-network/chopsticks@latest --config=moonbeam
    ```

=== "GitHub URL"

    ```bash
    npx @acala-network/chopsticks@latest \
    --config=https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonbeam.yml
    ```

=== "Local File Path"

    ```bash
    npx @acala-network/chopsticks@latest --config=configs/moonbeam.yml
    ```

!!! note

    如果使用文件路径，请确保您已下载[Moonbeam 配置文件](https://github.com/AcalaNetwork/chopsticks/blob/master/configs/moonbeam.yml){target=\_blank}，或者创建了自己的配置文件。

但是，配置文件不是必需的。所有设置（除了 `genesis` 和 `timestamp`）也可以作为标志传递，以在命令行中完全配置环境。例如，以下命令在区块 100 处分叉 Moonbase Alpha。

```bash
npx @acala-network/chopsticks@latest --endpoint {{ networks.moonbase.wss_url }} --block 100
```

### 快速入门 {: #quickstart }

复刻 Moonbeam 最简单的方法是通过存储在 Chopsticks GitHub 存储库中的配置文件：

=== "Moonbeam"

    ```bash
    npx @acala-network/chopsticks@latest \
    --config=https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonbeam.yml
    ```

=== "Moonriver"

    ```bash
    npx @acala-network/chopsticks@latest \
    --config=https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonriver.yml
    ```

=== "Moonbase Alpha"

    ```bash
    npx @acala-network/chopsticks@latest \
    --config=https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonbase-alpha.yml
    ```

### 与分叉交互 {: #interacting-with-a-fork }

当运行一个分叉时，默认情况下它将可以通过以下方式访问：

```text
ws://localhost:8000
```

您将能够通过诸如 [Polkadot.js](https://github.com/polkadot-js/common){target=\_blank} 及其 [用户界面 Polkadot.js Apps](https://github.com/polkadot-js/apps){target=\_blank} 等库与平行链进行交互。

您可以通过 [Polkadot.js Apps 托管的用户界面](https://polkadot.js.org/apps/#/explorer){target=\_blank} 与 Chopsticks 进行交互。为此，请访问该页面并执行以下步骤：

1. 单击左上角的图标
1. 转到底部并打开 **Development**
1. 选择 **Custom** 端点并输入 `ws://localhost:8000`
1. 单击 **Switch** 按钮

![Open WSS](/images/builders/substrate/dev-env/chopsticks/chopsticks-1.webp)
![Switch WSS](/images/builders/substrate/dev-env/chopsticks/chopsticks-2.webp)

现在，您应该能够像与活动的平行链或中继链一样与该分叉进行交互。

!!! note

    如果您的浏览器无法连接到 Chopsticks 提供的 WebSocket 端点，您可能需要允许 Polkadot.js Apps URL 的不安全连接。另一种解决方案是运行 [Polkadot.js Apps 的 Docker 版本](https://github.com/polkadot-js/apps#docker){target=\_blank}。

## 重放区块 {: #replaying-blocks }

如果您想重放一个区块并检索其信息以剖析 extrinsic 的影响，您可以使用 `npx @acala-network/chopsticks@latest run-block` 命令。其后续标志如下：

|            Flag            |                     Description                      |
| :------------------------: | :--------------------------------------------------: |
|         `endpoint`         |                要分叉的平行链的端点。                |
|          `block`           |          用于指定重放分叉的区块哈希或编号。          |
|      `wasm-override`       |  用作平行链运行时的 WASM 路径，而不是端点的运行时。  |
|            `db`            |       存储或将存储平行链数据库的文件的路径名。       |
|          `config`          |                配置文件的路径或 URL。                |
| `output-path=/[file_path]` | 用于将结果打印到 JSON 文件而不是在控制台中打印出来。 |
|           `html`           |      包括以生成块之间存储差异预览HTML表示形式。      |
|           `open`           |               是否打开 HTML 表示形式。               |

例如，运行以下命令将重新运行 Moonbeam 的第 1000 个区块，并将存储差异和其他数据写入 `moonbeam-output.json` 文件中：

```bash
npx @acala-network/chopsticks@latest run-block \
  --endpoint wss://wss.api.moonbeam.network \
  --output-path=./moonbeam-output.json \
  --block 1000
```

## XCM 测试 {: #xcm-testing }

要测试不同网络之间的 XCM 消息，你可以在本地 fork 多条平行链和一条中继链。例如，在你已下载源 GitHub 仓库中的 [`configs` 目录](https://github.com/AcalaNetwork/chopsticks/tree/master/configs){target=\_blank} 的前提下，以下命令会 fork Moonriver、Karura 和 Kusama：

```bash
npx @acala-network/chopsticks@latest xcm \
--r=kusama.yml \
--p=moonriver.yml \
--p=karura.yml
```

你应该会看到类似下面的输出：

```text
[13:50:57.807] INFO (rpc/64805): Loading config file https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/moonriver.yml
[13:50:59.655] INFO (rpc/64805): Moonriver RPC listening on port 8000
[13:50:59.656] INFO (rpc/64805): Loading config file https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/karura.yml
[13:51:03.275] INFO (rpc/64805): Karura RPC listening on port 8001
[13:51:03.586] INFO (xcm/64805): Connected parachains [2000,2023]
[13:51:03.586] INFO (rpc/64805): Loading config file https://raw.githubusercontent.com/AcalaNetwork/chopsticks/master/configs/kusama.yml
[13:51:07.241] INFO (rpc/64805): Kusama RPC listening on port 8002
[13:51:07.700] INFO (xcm/64805): Connected relaychain 'Kusama' with parachain 'Moonriver'
[13:51:08.386] INFO (xcm/64805): Connected relaychain 'Kusama' with parachain 'Karura'
```

是否包含 `r`（指定中继链）是可选的，因为 Chopsticks 会在网络之间自动模拟一条中继链。你也可以使用原始 GitHub URL 或某个常用分支名称，方式与基础命令类似。

## WebSocket 命令 {: #websocket-commands }

Chopsticks的内部websocket服务器具有特殊的端点，允许操作本地Substrate链。以下是可以调用的方法：

|       方法       |         参数          |                 描述                 |
| :--------------: | :-------------------: | :----------------------------------: |
|  `dev_newBlock`  |       `options`       |       生成一个或多个新的区块。       |
| `dev_setStorage` | `values`, `blockHash` |       创建或覆盖任何存储的值。       |
| `dev_timeTravel` |        `date`         |   将区块的时间戳设置为 `date` 值。   |
|  `dev_setHead`   |    `hashOrNumber`     | 将区块链的头设置为特定的哈希或数字。 |

以上参数的格式如下：

|      参数      |                格式                 |                                  示例                                  |
| :------------: | :---------------------------------: | :--------------------------------------------------------------------: |
|   `options`    | `{ "to": number, "count": number }` |                            `{ "count": 5 }`                            |
|    `values`    |              `Object`               | `{ "Sudo": { "Key": "0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b" } }`  |
|  `blockHash`   |              `string`               | `"0x1a34506b33e918a0106b100db027425a83681e2332fe311ee99d6156d2a91697"` |
|     `date`     |               `Date`                |                        `"2030-08-15T00:00:00"`                         |
| `hashOrNumber` |            `number` 或 `string`            |                                `500`                                |

- **`options` { "to": number, "count": number }** - 一个JSON对象，其中 `"to"` 将创建区块直到某个值，而 `"count"` 将按某个区块数递增。一次只能在JSON对象中使用一个条目
- **`values` Object** - 一个JSON对象，类似于存储值的路径，类似于您通过Polkadot.js检索到的内容
- **`blockHash` string** - 可选，更改存储值的区块哈希
- **`date` Date** - 一个日期字符串（与JavaScript Date库兼容），它将更改创建的下一个区块的时间戳。所有未来的区块将按时间顺序排列在该时间点之后
- **`hashOrNumber` number \| string** - 如果找到，链头将被设置为具有此值的区块号或区块哈希的区块

每个方法都可以通过连接到websocket（默认为 `ws://localhost:8000`）并以下列格式发送数据和参数来调用。将 `METHOD_NAME` 替换为方法的名称，并将 `PARAMETER_1` 和 `PARAMETER_2` 替换为与该方法相关的参数数据，或将其删除：

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "METHOD_NAME",
    "params": ["PARAMETER_1", "PARAMETER_2", "..."]
}
```

--8<-- 'zh/text/_disclaimers/third-party-content.md'
