---
title: 使用 SQD (前身为 Subsquid) 索引数据
description: 了解如何使用 SQD (Subsquid)，这是一个用于基于 Substrate 的链的查询节点框架，用于为 Moonbeam 和 Moonriver 索引和处理 Substrate 和 EVM 数据。
categories: Indexers and Queries
---

# 使用SQD（前身为Subsquid）索引Moonbeam

## 介绍 {: #introduction }

[SQD（前身为 Subsquid）](https://www.sqd.ai/){target=\_blank} 是一个数据网络，它允许使用 SQD 的去中心化数据湖和开源 SDK，从 100 多个链中快速且经济高效地检索区块链数据。简单来说，SQD 可以被认为是一个包含 GraphQL 服务器的 ETL（提取、转换和加载）工具。它支持全面的过滤、分页，甚至全文搜索功能。

SQD 本身完全支持以太坊虚拟机（EVM）和 Substrate 数据。由于 Moonbeam 是一个基于 Substrate 且与 EVM 兼容的智能合约平台，因此 SQD 可用于索引基于 EVM 和 Substrate 的数据。SQD 提供 Substrate 存档和处理器以及 EVM 存档和处理器。Substrate 存档和处理器可用于索引 Substrate 和 EVM 数据。这允许开发人员从任何 Moonbeam 网络中提取链上数据，并在一个项目中处理 EVM 日志以及 Substrate 实体（事件、外部操作和存储项），并通过一个 GraphQL 端点提供结果数据。如果您只想索引 EVM 数据，建议使用 EVM 存档和处理器。

本快速入门指南将向您展示如何使用 SQD 创建 Substrate 和 EVM 项目，并配置它以索引 Moonbeam 上的数据。

--8<-- 'zh/text/_disclaimers/third-party-content-intro.md'

## 检查先决条件 {: #checking-prerequisites }

要开始使用 SQD，您需要具备以下条件：

- [Node.js](https://nodejs.org/en/download/package-manager){target=\_blank} 16 或更高版本
- [Docker](https://docs.docker.com/get-started/get-docker/){target=\_blank}
- [Squid CLI](https://docs.sqd.ai/squid-cli/installation/){target=\_blank}

!!! note
    Squid 模板与 `yarn` 不兼容，因此您需要改用 `npm`。

## 在 Moonbeam 上索引 Substrate 数据 {: #index-substrate-calls-events }

要开始在 Moonbeam 上索引 Substrate 数据，您需要创建一个 SQD 项目，并通过执行以下步骤将其配置为 Moonbeam：

1. 通过运行以下命令，创建一个基于 Substrate 模板的 SQD 项目：

    ```bash
    --8<-- 'code/builders/integrations/indexers/subsquid/1.sh'
    ```

    有关开始使用此模板的更多信息，请查看 SQD 文档站点上的 [快速入门：Substrate 链](http://docs.sqd.ai/quickstart/quickstart-substrate/){target=\_blank} 指南。

2. 导航到您的 Squid 项目的根目录，并通过运行以下命令安装依赖项：

    ```bash
    --8<-- 'code/builders/integrations/indexers/subsquid/2.sh'
    ```

3. 要配置您的 SQD 项目以在 Moonbeam 上运行，您需要更新 `typegen.json` 文件。`typegen.json` 文件负责为您的数据生成 TypeScript 接口类。根据您在其上索引数据的网络，`typegen.json` 文件中的 `specVersions` 值应配置如下：

    === "Moonbeam"

        ```json
        --8<-- 'code/builders/integrations/indexers/subsquid/3.json'
        ```

    === "Moonriver"

        ```json
        --8<-- 'code/builders/integrations/indexers/subsquid/4.json'
        ```

    === "Moonbase Alpha"

        ```json
        --8<-- 'code/builders/integrations/indexers/subsquid/5.json'
        ```

4. 修改 `src/processor.ts` 文件，Squids 在其中实例化处理器、配置处理器并附加处理函数。处理器从 [Archive](https://docs.sqd.ai/glossary/#archives){target=\_blank} 中提取历史链上数据，这是一个专门的数据湖。您需要配置您的处理器以从与您正在索引数据的 [网络](http://docs.sqd.ai/substrate-indexing/supported-networks/){target=\_blank} 对应的 Archive 中提取数据：

    === "Moonbeam"

        ```ts
        --8<-- 'code/builders/integrations/indexers/subsquid/6.ts'
        ```

    === "Moonriver"

        ```ts
        --8<-- 'code/builders/integrations/indexers/subsquid/7.ts'
        ```

    === "Moonbase Alpha"

        ```ts
        --8<-- 'code/builders/integrations/indexers/subsquid/8.ts'
        ```

    !!! note
        --8<-- 'zh/text/_common/endpoint-setup.md'

5. 还有一项快速更改需要对模板进行。SQD Substrate 模板配置为处理 Substrate 帐户类型，但 Moonbeam 使用以太坊样式的帐户。`src/main.ts` 文件中的 `getTransferEvents` 函数将迭代 `processor.ts` 提取的事件，并将相关的 `transfer` 事件存储在数据库中。在 `getTransferEvents` 函数中，删除 `from` 和 `to` 字段的 ss58 编码。在未修改的 Substrate 模板中，`from` 和 `to` 字段按如下所示进行 ss58 编码：

    ```ts
    --8<-- 'code/builders/integrations/indexers/subsquid/9.ts'
    ```

    删除 ss58 编码后，相应的行是：

    ```ts
    --8<-- 'code/builders/integrations/indexers/subsquid/10.ts'
    ```

这就是配置您的 SQD 项目以在 Moonbeam 上索引 Substrate 数据所需要做的全部工作！现在，您可以更新 `schema.graphql`、`typegen.json`、`src/main.ts` 和 `src/processor.ts` 文件，以索引您的项目所需的数据！接下来，按照 [运行您的索引器](#run-your-indexer) 部分中的步骤运行您的索引器并查询您的 Squid。

## 在 Moonbeam 上索引以太坊数据 {: #index-ethereum-contracts }

要开始在 Moonbeam 上索引 EVM 数据，您需要创建一个 SQD 项目，并通过以下步骤将其配置为 Moonbeam：

1. 您可以使用通用的 [EVM 模板](https://github.com/subsquid-labs/squid-evm-template){target=\_blank} 创建一个用于 EVM 数据的 SQD 项目，或者您可以使用 [ABI 模板](https://github.com/subsquid-labs/squid-abi-template){target=\_blank} 索引与特定合约相关的数据：

    === "EVM"

        ```bash
        --8<-- 'code/builders/integrations/indexers/subsquid/11.sh'
        ```

    === "ABI"

        ```bash
        --8<-- 'code/builders/integrations/indexers/subsquid/12.sh'
        ```

    有关开始使用这两个模板的更多信息，请查看以下 SQD 文档：
      
      - [快速入门：EVM 链](http://docs.sqd.ai/quickstart/quickstart-ethereum/){target=\_blank}
      - [快速入门：从 ABI 生成](http://docs.sqd.ai/quickstart/quickstart-abi/){target=\_blank}

2. 导航到您的 Squid 项目的根目录，并通过运行以下命令安装依赖项：

    ```bash
    --8<-- 'code/builders/integrations/indexers/subsquid/2.sh'
    ```

3. 修改 `src/processor.ts` 文件，Squid 在其中实例化处理器、配置处理器并附加处理函数。处理器从 [Archive](https://docs.sqd.ai/glossary/#archives){target=\_blank} 中获取历史链上数据，这是一个专门的数据湖。您需要配置您的处理器以从与您正在索引数据的 [网络](http://docs.sqd.ai/evm-indexing/supported-networks/){target=\_blank} 对应的 Archive 中提取数据：

   === "Moonbeam"

        ```ts
        --8<-- 'code/builders/integrations/indexers/subsquid/14.ts'
        ```

    === "Moonriver"

        ```ts
        --8<-- 'code/builders/integrations/indexers/subsquid/15.ts'
        ```

    === "Moonbase Alpha"

        ```ts
        --8<-- 'code/builders/integrations/indexers/subsquid/16.ts'
        ```

    !!! note
        --8<-- 'zh/text/_common/endpoint-setup.md'

这就是配置您的 SQD 项目以在 Moonbeam 上索引 EVM 数据所需的全部操作！现在您可以更新 `schema.graphql`、`src/main.ts` 和 `src/processor.ts` 文件，以索引您项目所需的数据！继续执行下一节中的步骤以运行您的索引器并查询您的 Squid。

## 运行您的索引器 {: #run-your-indexer }

这些步骤适用于 Substrate 和 EVM 索引器。在正确配置 SQD 索引器后，只需几个步骤即可运行它：

1. 通过运行以下命令启动 Postgres：

    ```bash
    --8<-- 'code/builders/integrations/indexers/subsquid/17.sh'
    ```

2. 检查并运行处理器：

    ```bash
    --8<-- 'code/builders/integrations/indexers/subsquid/18.sh'
    ```

3. 在同一目录中打开一个单独的终端窗口，然后启动 GraphQL 服务器：

    ```bash
    --8<-- 'code/builders/integrations/indexers/subsquid/19.sh'
    ```

4. 您可以使用以下示例查询查询您的模板 Substrate 或 EVM Squid。如果您修改了模板 Squid 来索引不同的数据，则需要相应地修改此查询

    === "Substrate 索引器"

        ```graphql
        --8<-- 'code/builders/integrations/indexers/subsquid/20.graphql'
        ```

    === "EVM 索引器"

        ```graphql
        --8<-- 'code/builders/integrations/indexers/subsquid/21.graphql'
        ```

有关其他示例和工作流程，请参阅 [SQD 文档](https://docs.sqd.dev/){target=\_blank}。

--8<-- 'zh/text/_disclaimers/third-party-content.md'
