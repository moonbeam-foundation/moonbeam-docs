---
title: 使用 SubQuery & GraphQL 索引数据
description: 了解如何使用 SubQuery 索引 Moonbeam 和 Moonriver 的 Substrate 和 EVM 链数据，并使用 GraphQL 查询数据。
categories: 索引器和查询
---

# 使用 SubQuery 索引 Moonbeam

## 简介 {: #introduction }

[SubQuery](https://subquery.network){target=\_blank} 是一个数据聚合层，它在第 1 层区块链（如 Moonbeam 和 Polkadot）和 DApp 之间运行。此服务解锁区块链数据并将其转换为可查询状态，以便在直观的应用程序中使用。它使 DApp 开发人员能够专注于其核心用例和前端，而无需浪费时间构建用于数据处理的自定义后端。

SubQuery 支持为任何 Moonbeam 网络索引以太坊虚拟机 (EVM) 和 Substrate 数据。使用 SubQuery 的一个主要优势是，您可以使用单个项目和工具灵活地跨 Moonbeam 的 EVM 和 Substrate 代码收集查询数据，然后使用 GraphQL 查询此数据。

例如，除了 Substrate 数据源之外，SubQuery 还可以过滤和查询 EVM 日志和交易。SubQuery 引入了比其他索引器更高级的过滤器，允许过滤非合约交易、交易发送者、合约和索引日志参数，因此开发人员可以构建各种满足其特定数据需求的项目。

本快速入门指南将向您展示如何创建 SubQuery 项目并将其配置为在 Moonbeam 上索引 Substrate 和 EVM 数据。

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## 检查先决条件 {: #checking-prerequisites }

在本指南的稍后部分，您可以选择将项目部署到本地运行的SubQuery节点。为此，您需要在系统上安装以下组件：

 - [Docker](https://docs.docker.com/get-started/get-docker/){target=\_blank}
 - [Docker Compose](https://docs.docker.com/compose/install){target=\_blank}

!!! note
    如果Docker Compose是通过`sudo apt install docker-compose`命令为Linux安装的，那么您可能会在本指南的稍后部分遇到一些错误。请务必按照官方[安装Docker Compose](https://docs.docker.com/compose/install){target=\_blank}指南中的Linux说明进行操作。

## 创建一个项目 {: #create-a-project }

要开始使用，您需要[创建一个SubQuery项目](https://subquery.network/doc/quickstart/quickstart.html){target=_blank}：

1. 全局安装 [SubQuery CLI](https://subquery.network/doc/indexer/quickstart/quickstart.html#_1-install-the-subquery-cli){target=_blank}：

    === "npm"

        ```bash
        npm install -g @subql/cli
        ```

    === "yarn"

        ```bash
        yarn global add @subql/cli
        ```

!!! note
    不建议使用yarn安装`@subql/cli`，因为它依赖管理不佳，可能导致各种错误。

2. 使用以下命令初始化您的SubQuery项目：

    ```bash
    subql init PROJECT_NAME
    ```

3. 系统将提示您回答一系列问题：

    1. 对于**选择网络系列**问题，虽然Moonbeam与EVM兼容，但Moonbeam模板位于**Polkadot**系列下，因此您可以选择**Polkadot**。

        --8<-- 'code/builders/integrations/indexers/subquery/terminal/select-network-polkadot.md'

    2. 下一个屏幕将提示您**选择一个网络**。您可以在Moonbeam和Moonriver之间进行选择。

        !!! note
            要在Moonbase Alpha上构建项目，您可以选择任一网络并在以后进行调整。

        --8<-- 'code/builders/integrations/indexers/subquery/terminal/select-network-moonbeam.md'

    3. 系统将提示您**选择一个模板项目**。根据您在上一步中选择的网络，模板选项可能会有所不同。

        === "Moonbeam"

            |             Template             |                                                                             Description                                                                              |
            |:--------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
            |      `moonbeam-evm-starter`      |                                           一个启动器EVM项目，它索引ERC-20 `Transfer`事件和`approve`调用                                                            |
            | `moonbeam-substrate-evm-starter` | 一个启动器Substrate和EVM项目，它索引ERC-20 `Transfer`事件和对Staking Pallet的`joinCandidates`和`executeLeaveCandidates`外部函数的调用 |
            |        `Moonbeam-starter`        |                                        一个启动器Substrate项目，它通过Balances Pallet索引余额转移                                                               |

        === "Moonriver"

            |        Template         |                                      Description                                       |
            |:-----------------------:|:--------------------------------------------------------------------------------------:|
            | `moonriver-evm-starter` |    一个启动器EVM项目，它索引ERC-20 `Transfer`事件和`approve`调用     |
            |   `Moonriver-starter`   | 一个启动器Substrate项目，它通过Balances Pallet索引余额转移 |

        --8<-- 'code/builders/integrations/indexers/subquery/terminal/select-template.md'

    4. 系统将提示您添加其他信息，例如RPC终结点、项目作者和项目描述。 对于这些，您可以直接按Enter键并接受默认值，或者根据需要自定义它们。

        !!! note
            为了避免达到公共RPC端点的速率限制，建议您拥有自己的端点和API密钥，您可以从支持的[端点提供商](/builders/get-started/endpoints/){target=\_blank}处获得。

        --8<-- 'code/builders/integrations/indexers/subquery/terminal/select-rpc.md'

4. 完成所有提示后，将克隆启动器项目。 您只需从项目目录中安装依赖项：

    === "npm"

        ```bash
        cd PROJECT_NAME && npm install
        ```

    === "yarn"

        ```bash
        cd PROJECT_NAME && yarn install
        ```

## 配置网络 {: #configure-the-network }

模板项目已预先配置为在初始化项目时选择的网络。但是，如果您正在处理现有项目，或者想要为 Moonbase Alpha 而不是 Moonbeam 或 Moonriver 配置您的项目，您可以在 `project.ts` 文件中更新网络配置。

每个网络的 `network` 配置如下：

=== "Moonbeam"

    ```ts
    network: {
      chainId: 
        '0xfe58ea77779b7abda7da4ec526d14db9b1e9cd40a217c34892af80a9b332b76d',
      endpoint: ['{{ networks.moonbeam.rpc_url }}'],
      chaintypes: {
        file: ./dist/chaintypes.js,
      },
    },
    ```

=== "Moonriver"

    ```ts
    network: {
      chainId: '0x401a1f9dca3da46f5c4091016c8a2f26dcea05865116b286f60f668207d1474b',
      endpoint: ['{{ networks.moonriver.rpc_url }}'],
      chaintypes: {
        file: ./dist/chaintypes.js,
      },
    },
    ```

=== "Moonbase Alpha"

    ```ts
    network: {
      chainId: '0x91bc6e169807aaa54802737e1c504b2577d4fafedd5a02c10293b1cd60e39527',
      endpoint: ['{{ networks.moonbase.rpc_url }}'],
      chaintypes: {
        file: ./dist/chaintypes.js,
      },
    },
    ```

 --8<-- 'text/_common/endpoint-examples.md'

## 修改 GraphQL 模式 {: #modify-the-graphql-schema }

在 `schema.graphql` 文件中，您可以使用 GraphQL 实体来定义数据的形状。根据您的需要编辑 GraphQL 模式后，您需要生成所需的 GraphQL 模型。为此，您可以运行以下命令：

=== "npm"

    ```bash
    npm run codegen
    ```

=== "yarn"

    ```bash
    yarn codegen
    ```

--8<-- 'code/builders/integrations/indexers/subquery/terminal/codegen.md'

生成的模型将在 `src/types/models` 目录中创建。这些模型将用于处理索引数据的映射处理程序中。

!!! note
    如果您更改了 `schema.graphql` 文件，则需要重新生成您的类型。

## 索引 Substrate 数据 {: #index-substrate-data }

`project.ts` 文件是您的索引器的入口点；它定义了要索引的数据类型以及负责处理索引数据的映射函数。

要索引 Substrate 数据，您需要确保 `project` 的类型为 `SubstrateProject`。

```ts
const project: SubstrateProject = { ... }
```

### Substrate 数据源 {: #the-substrate-data-source }

在 `project.dataSources` 数组中，您将定义 Substrate 数据源和要索引的数据。数据源的格式如下：

```ts
datasources: [
  {
    kind: 'substrate/Runtime',
    startBlock: INSERT_START_BLOCK,
    endBlock: INSERT_END_BLOCK,
    mapping: {
      file: './dist/index.js',
      handlers: [
        {
          kind: 'INSERT_HANDLER_KIND',
          handler: 'INSERT_HANDLER_FUNCTION_NAME',
          filter: {
            'INSERT_FILTER_TYPE': 'INSERT_FILTER',
          },
        },
      ],
    },
  },
],
```

每个属性可以定义如下：

- `kind`：您将使用的数据源类型，对于 Substrate 数据，它是 `substrate/Runtime` 源。
- `startBlock`（可选）：索引器将从该区块开始处理区块。
- `endBlock`（可选）：在此区块之后，索引器将停止处理区块。
- `mapping`：要索引的数据和数据的处理程序。
    - `file`：映射的入口路径。
    - `handlers`：特定类型数据的处理程序。
        - `kind`：处理程序的类型。对于 Substrate 数据，有三种类型：`substrateBlockHandler`、`substrate/EventHandler` 和 `substrate/CallHandler`。
        - `handler`：将处理此数据的处理函数的名字。
        - `filter`（可选）：将触发映射处理程序的过滤器类型和数据。例如，要索引的区块、事件或外部操作。

### Substrate映射处理程序 {: #substrate-mapping-handlers }

仅使用某些处理程序和过滤器将提高索引器的效率。Substrate数据可用的处理程序如下：

- [区块处理程序](https://subquery.network/doc/indexer/build/mapping-functions/mapping/polkadot.html#block-handler){target=\_blank}用于索引区块数据，并且每个区块都会调用一次。因此，这种类型的处理程序会显著降低项目的速度，因此只有在绝对必要时才应使用。区块处理程序支持的过滤器为：`specVersion`、`modulo`和`timestamp`。

    |    Filter     |                                                                    Description                                                                    |                                             Example                                             |
    |:-------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------:|
    | `specVersion` |                                              过滤属于特定版本范围的区块                                               | `specVersion: [null, 2000]` <br> `# 索引spec` <br> `版本介于0 - 2000之间的区块`                                                    |
    |   `modulo`    |                                                         按一定间隔过滤区块                                                         |                             `modulo: 50 # 每50个区块建立索引`                              |
    |  `timestamp`  | 按时间间隔（以 UTC 为单位）过滤区块。<br> 接受有效的 [cron 表达式](https://github.com/roccivic/cron-converter){target=\_blank} |               `timestamp: '*5/ * * * *'` <br> `# 每5分钟建立索引块`                |

- [事件处理程序](https://subquery.network/doc/indexer/build/mapping-functions/mapping/polkadot.html#event-handler){target=\_blank}用于索引属于运行时的特定Substrate事件。事件处理程序支持的过滤器为：`module`和`method`。

    |  Filter  |                      Description                      |       Example        |
    |:--------:|:-----------------------------------------------------:|:--------------------:|
    | `module` |             过滤事件所属的pallet（模块）              | `module: 'balances'` |
    | `method` |                     过滤事件                      | `method: 'Transfer'` |

- [调用处理程序](https://subquery.network/doc/indexer/build/mapping-functions/mapping/polkadot.html#call-handler){target=\_blank}用于索引某些Substrate外部因素。调用处理程序支持的过滤器为：`module`、`method`、`success`和`isSigned`。

    |   Filter   |                      Description                      |       Example        |
    |:----------:|:-----------------------------------------------------:|:--------------------:|
    |  `module`  |       过滤外部因素所属的pallet（模块）       | `module: 'balances'` |
    |  `method`  |                   过滤外部因素                   | `method: 'Transfer'` |
    | `success`  |            基于结果过滤外部因素            |   `success: true`    |
    | `isSigned` |     根据外部因素是否已签名进行过滤     |   `isSigned: true`   |

## Index Ethereum Data {: #index-ethereum-data }

The `project.ts` file is the entry point into your indexer; it defines what type of data to index and the mapping functions that are responsible for handling and processing the indexed data.

To index Substrate data, you'll need to ensure that the type of the `project` is `SubstrateProject<FrontierEvmDatasource>`.

```ts
const project: SubstrateProject<FrontierEvmDatasource> = { ... }
```

### EVM数据源 {: #the-evm-data-source }

在 `project.dataSources` 数组中，您将定义EVM数据源和要编制索引的数据。EVM数据源由专门用于处理Moonbeam的Frontier实现的数据处理器提供支持。它允许您引用处理器使用的特定ABI资源来解析参数，以及事件来源或调用目标的智能合约地址。一般来说，它充当中间件，可以提供额外的过滤和数据转换。

数据源的格式如下：

```ts
datasources: [
  {
    kind: 'substrate/FrontierEvm',
    startBlock: INSERT_START_BLOCK,
    endBlock: INSERT_END_BLOCK,
    processor: {
      file: './node_modules/@subql/frontier-evm-processor/dist/bundle.js',
      options: {
        abi: '',
        address: '',
      },
    },
    assets: ''
    mapping: {
      file: './dist/index.js',
      handlers: [
        {
          kind: 'INSERT_HANDLER_KIND',
          handler: 'INSERT_HANDLER_FUNCTION_NAME',
          filter: {
            'INSERT_FILTER_TYPE': 'INSERT_FILTER',
          },
        },
      ],
    },
  },
],
```

每个属性可以定义如下：

- `kind`：您将使用的数据源类型，对于EVM数据，它是 `substrate/FrontierEVM` 源。
- `startBlock`（可选）：索引器将从该区块开始处理区块。
- `endBlock`（可选）：在此区块之后，索引器将停止处理区块。
- `processor`：Frontier EVM数据处理器配置。
    - `file`：数据处理器代码所在的⽂文件。
    - `options` (可选)：Frontier EVM处理器特有的[处理器选项](https://subquery.network/doc/indexer/build/datasource-processors/substrate-evm.html#processor-options){target=\_blank}。
        - `abi`（可选）：用于解析参数的ABI。`abi` 值必须是 `assets` 配置中的一个键。
        - `address`（可选）：事件发出的或调用发生的合约地址。使用 `null` 将捕获合约创建调用。
    - `assets` (可选)：外部资产ABI文件的对象。
- `mapping`：要索引的数据和数据的处理程序。
    - `file`：映射的入口路径。
    - `handlers`：特定类型数据的处理程序。
        - `kind`：处理程序的种类。对于EVM数据，有两种类型：`substrate/FrontierEvmCall` 和 `substrate/FrontierEvmEvent`。
        - `handler`：将处理此数据的处理程序函数的名称。
        - `filter`（可选）：将触发映射处理程序的过滤器类型和数据。例如，要索引的块、事件或外部因素。

### Frontier EVM 映射處理程序 {: #evm-mapping-handlers }

僅使用某些處理程序和篩選器將提高索引器的效率。EVM 數據可用的處理程序如下所示：

- [Frontier EVM 呼叫處理程序](https://subquery.network/doc/indexer/build/substrate-evm.html#call-handlers){target=\_blank} 用於索引基於 [Ethers `TransactionResponse` 類型](https://docs.ethers.org/v5/api/providers/types/#providers-TransactionResponse){target=\_blank} 格式化的交易，但略有不同。有關確切變更的資訊，請參閱 [SubQuery 的文件](https://subquery.network/doc/indexer/build/substrate-evm.html#handler-functions){target=\_blank}。呼叫處理程序支援的篩選器包括：`function` 和 `from`。

    |   Filter   |                        Description                        |                                    Example                                    |
    |:----------:|:---------------------------------------------------------:|:-----------------------------------------------------------------------------:|
    | `function` |    依函式簽章或選取器篩選呼叫     | `function: '0x095ea7b3'` <br> `function: 'approve(address to,uint256 value)'` |
    |   `from`   | 依傳送交易的位址篩選呼叫 |             `from: '0x6bd193ee6d2104f14f94e2ca6efefae561a4334b'`              |

- [Frontier EVM 事件處理程序](https://subquery.network/doc/indexer/build/substrate-evm.html#event-handlers){target=\_blank} 用於索引特定 EVM 事件。事件處理程序支援的篩選器為：`topics`。

    |  Filter  |                                                                  Description                                                                   |                                   Example                                   |
    |:--------:|:----------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------:|
    | `topics` | 依主題篩選事件日誌，這遵循 [Ethereum JSON-RPC 日誌篩選器](https://docs.ethers.org/v5/concepts/events/){target=\_blank} | `topics: 'Transfer(address indexed from,address indexed to,uint256 value)'` |
## 运行你的索引器 {: #run-your-indexer }

要使用 Docker 在本地运行你的索引器，你可以采取以下步骤：

1. 构建你的项目：

    === "npm"

        ```bash
        npm run build
        ```

    === "yarn"

        ```bash
        yarn build
        ```

    --8<-- 'code/builders/integrations/indexers/subquery/terminal/npm-run-build.md'

    !!! note
        如果你更改了 `project.ts` 文件，你需要重新构建你的项目。

2. 启动索引器的 Docker 容器：

    === "npm"

        ```bash
        npm run start:docker
        ```

    === "yarn"

        ```bash
        yarn start:docker
        ```

    --8<-- 'code/builders/integrations/indexers/subquery/terminal/logs.md'

3. 前往 `http://localhost:3000` 打开 GraphQL playground 并提交查询。你可以在 playground 上打开 **DOCS** 或 **SCHEMA** 选项卡，以在创建查询时作为参考。

    !!! note
        GraphQL 服务器可能需要几分钟才能准备好。在看到以下日志后，你就可以访问 playground：

        ```bash
        substrate-demo-graphql-engine-1  | <subql-query> INFO Started playground at `http://localhost:3000`
        ```

    ![浏览器中的 GraphQL playground。](/images/builders/integrations/indexers/subquery/subquery-1.webp)

就是这样！有关如何使用 `moonbeam-substrate-evm-starter` 模板项目的分步教程，你可以参考 [SubQuery 的 Moonbeam (EVM) 快速入门文档](https://subquery.network/doc/indexer/quickstart/quickstart_chains/polkadot-moonbeam.html){target=\_blank}。

--8<-- 'text/_disclaimers/third-party-content.md'
