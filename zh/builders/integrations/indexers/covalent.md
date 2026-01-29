---
title: GoldRush API
description: 使用 GoldRush (之前称为 Covalent) API 在 Moonbeam 上查询区块链数据，例如余额、交易、转账、代币持有者和事件日志。
categories: Indexers and Queries
---

# GoldRush API 入门

## 简介 {: #introduction }

[GoldRush](https://goldrush.dev/){target=\_blank}，前身为 Covalent，是一种托管的区块链数据解决方案，可访问 [100 多个受支持的区块链](https://goldrush.dev/docs/chains/overview#supported-chains){target=\_blank} 的历史和当前链上数据，包括 [Moonbeam](https://goldrush.dev/docs/chains/moonbeam){target=\_blank}、[Moonriver](https://goldrush.dev/docs/chains/moonriver){target=\_blank} 和 [Moonbase Alpha](https://goldrush.dev/docs/chains/moonbeam-moonbase-alpha){target=\_blank}。GoldRush 维护每个受支持区块链的完整存档副本，这意味着每个余额、交易、日志事件和 NFT 资产数据都可以从创世区块获得。此数据可通过以下方式获得：

- [统一 API](#unified-api-overview) - 通过熟悉的 REST API 将区块链数据整合到您的应用中

本指南将介绍开始使用 [Foundational API](https://goldrush.dev/docs/goldrush-foundational-api/quickstart){target=\_blank} 所需的所有详细信息，以及如何使用 curl 命令以及 JavaScript 和 Python 代码段访问 Moonbeam 的 API 端点。

--8<-- 'zh/text/_disclaimers/third-party-content-intro.md'

## 统一 API 概述 {: #unified-api-overview }

GoldRush 的统一 API 是一个强大但易于使用的 REST API，可提供跨所有区块链网络的资产可见性。它具有跨网络一致的请求和响应对象格式。例如，用户可以通过更改请求 URL 中唯一的区块链名称或 ID 路径参数，来获取任何受支持的区块链上钱包地址的所有令牌余额。与通常仅限于对特定区块进行查询的 JSON-RPC 接口相比，GoldRush 的统一 API 可以提供更多的数据灵活性。它还允许查询多个对象和批量导出数据。

### 查询统一 API {: #querying-the-unified-api }

在您获得 GoldRush API 密钥后，可以轻松开始查询统一 API。请确保您拥有[您的 API 密钥](https://goldrush.dev/platform/auth/register/){target=\_blank}，该密钥以 `cqt_` 或 `ckey_` 开头。

您可以在 GoldRush 文档的 Web 界面中与任何 API 方法进行交互。要试用代币余额 API，请访问[代币余额文档](https://goldrush.dev/docs/api-reference/foundational-api/balances/get-token-balances-for-address){target=\_blank}，然后执行以下步骤：

1. 粘贴您的 API 密钥
2. 输入所需的 `chainName`，例如 Moonbase Alpha 的 `moonbeam-moonbase-alpha`。如果您不确定所需网络的 chainName 应该是什么，请参考[快速入门部分](#quick-start)
3. 输入您希望检查代币余额的地址
4. 按**发送**

[![JSON 中的 API 响应示例](/images/builders/integrations/indexers/covalent/covalent-1.webp)](https://goldrush.mintlify.app/docs/api/balances/get-token-balances-for-address){target=\_blank}

### 快速开始 {: #quick-start }

如果您熟悉 GoldRush 并准备好开始，您将需要 chainID 和网络名称才能开始。

=== "Moonbeam"
    |  Parameter  |               Value                |
    |:-----------:|:----------------------------------:|
    | `chainName` |         `moonbeam-mainnet`         |
    |  `chainID`  | `{{ networks.moonbeam.chain_id }}` |

=== "Moonriver"
    |  Parameter  |                Value                |
    |:-----------:|:-----------------------------------:|
    | `chainName` |        `moonbeam-moonriver`         |
    |  `chainID`  | `{{ networks.moonriver.chain_id }}` |

=== "Moonbase Alpha"
    |  Parameter  |               Value                |
    |:-----------:|:----------------------------------:|
    | `chainName` |     `moonbeam-moonbase-alpha`      |
    |  `chainID`  | `{{ networks.moonbase.chain_id }}` |

### 统一 API 的基本原理 {: #fundamentals-of-the-unified-api }

 - GoldRush API 是 RESTful 风格的，它围绕着可以通过 Web 界面获得的主要资源而设计
 - API 的当前版本为版本 1
 - 所有端点的默认返回格式为 JSON
 - 所有请求都需要身份验证；您需要[一个 API 密钥](https://goldrush.dev/platform/auth/register/){target=\_blank}才能使用 GoldRush API
 - API 调用的成本以积分计价，并且因特定调用而异。创建 API 密钥后，您将获得大量免费积分以开始使用（在撰写本文时为 25,000 个）。您可以在 [GoldRush 仪表板](https://goldrush.dev/platform/){target=\_blank}上跟踪这些免费积分的使用情况
 - 请注意，免费开发 API 密钥的速率限制为每秒 `4` 个请求。专业计划的订阅者每秒最多可以发出 `50` 个请求。
 - API 的根 URL 为：`https://api.covalenthq.com/v1/`
 - 所有请求都通过 HTTPS 完成（通过纯 HTTP 的调用将失败）
 - API 的刷新率是实时的：30 秒或两个区块，批量 30 分钟或 40 个区块

### 端点类型 {: #types-of-endpoints }

GoldRush API 有三种类型的端点：

 - **A 类** — 返回适用于所有区块链网络的丰富区块链数据的端点，例如：余额、交易、日志事件等
 - **B 类** — 适用于区块链上特定协议的端点，例如，Uniswap 仅适用于 Ethereum，不适用于其他区块链网络
 - **C 类** — 由社区构建和维护，但由 GoldRush 基础设施提供支持的端点

### 支持的示例端点 {: #sample-supported-endpoints }

有关支持的端点的完整列表，请参阅 [GoldRush API 参考](https://goldrush.dev/docs/api-reference/foundational-api/cross-chain/get-address-activity){target=\_blank}。支持的端点的子集包括：

- **代币余额**- 获取地址的所有代币余额（原生、ERC-20、ERC-721、ERC-1155）以及当前市场价格
- **原生代币余额**- 检索地址的原生代币余额
- **获取交易**- 获取并呈现带有已解码日志事件的单个交易
- **交易摘要**- 检索地址的关键钱包活动数据
- **最早的交易**- 获取地址的最早交易
- **最近的交易**- 获取地址的最近交易
- **分页交易**- 获取地址的分页交易
- **批量时间分段交易**- 获取 15 分钟时间分段内的所有交易
- **区块交易**- 获取特定区块中的所有交易
- **ERC-20 代币转移**- 获取地址的特定 ERC-20 代币的转移历史记录
- **跨链活动**- 查找地址处于活跃状态的链
- **代币批准**- 获取地址的代币批准列表
- **NFT 批准**- 检索地址的 NFT 批准

## 统一 API 方法 {: #unified-api-methods }

要了解有关统一 API 的每种方法的更多信息，并获得尝试每种方法的交互式界面，请务必查看 [GoldRush 文档](https://goldrush.dev/docs/goldrush-foundational-api/overview){target=\_blank}。

### 余额 {: #balances }

???+ function "代币余额"

    [代币余额端点](https://goldrush.dev/docs/api-reference/foundational-api/balances/get-token-balances-for-address){target=\_blank} 检索与给定地址关联的本地代币、可替代代币 (ERC-20) 和不可替代代币 (ERC-721 & ERC-1155)。返回的数据包括当前市场价格和其他代币元数据。

    === "参数"

        - `chainName` *string* - 例如 `moonbeam-mainnet`、`moonbeam-moonriver` 或 `moonbeam-moonbase-alpha`
        - `walletAddress` *string* - 您希望检查代币余额的地址

    === "示例请求"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/token-balances/request.sh'
        ```

    === "示例响应"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/token-balances/response.sh'
        ```

??? function "本地代币余额"

    [本地代币余额端点](https://goldrush.dev/docs/api-reference/foundational-api/balances/get-native-token-balance){target=\_blank} 以简化的方式检索给定地址的本地代币余额。

    === "参数"

        - `chainName` *string* - 例如 `moonbeam-mainnet`、`moonbeam-moonriver` 或 `moonbeam-moonbase-alpha`
        - `walletAddress` *string* - 您希望检查代币余额的地址

    === "示例请求"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/native-token-balances/request.sh'
        ```

    === "示例响应"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/native-token-balances/response.sh'
        ```

??? function "获取地址的 ERC-20 代币转移"

    [获取地址的 ERC-20 代币转移](https://goldrush.dev/docs/api-reference/foundational-api/balances/get-erc20-token-transfers-for-address){target=\_blank} 用于在提供钱包地址和 ERC-20 代币合约地址时，获取代币的转入和转出以及地址的历史价格

    === "参数"

        - `chainName` *string* - 例如 `moonbeam-mainnet`、`moonbeam-moonriver` 或 `moonbeam-moonbase-alpha`
        - `walletAddress` *string* - 您希望查询的地址
        - `contractAddress` *string* - 要查询的 ERC-20 代币合约

    === "示例请求"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/get-erc20-transfers/request.sh'
        ```

    === "示例响应"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/get-erc20-transfers/response.sh'
        ```

### 交易 {: #transactions }

???+ function "获取交易"

    [获取交易](https://goldrush.dev/docs/api-reference/foundational-api/transactions/get-a-transaction){target=\_blank} 用于获取和渲染单个交易，包括其解码的日志事件。

    === "参数"

        - `chainName` *string* - 例如 `moonbeam-mainnet`、`moonbeam-moonriver` 或 `moonbeam-moonbase-alpha`
        - `txHash` *string* - 交易哈希

    === "示例请求"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/get-a-transaction/request.sh'
        ```

    === "示例响应"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/get-a-transaction/response.sh'
        ```

??? function "获取地址的交易摘要"

    [获取地址的交易摘要](https://goldrush.dev/docs/api-reference/foundational-api/transactions/get-transaction-summary-for-address){target=\_blank} 检索关键钱包活动数据，包括第一笔和最近的交易以及总交易计数。 它能够快速分析钱包年龄、不活动周期和整体 Web3 参与度。

    === "参数"

        - `chainName` *string* - 例如 `moonbeam-mainnet`、`moonbeam-moonriver` 或 `moonbeam-moonbase-alpha`
        - `walletAddress` *string* - 您希望查询的地址

    === "示例请求"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/transaction-summary/request.sh'
        ```

    === "示例响应"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/transaction-summary/response.sh'
        ```

??? function "获取地址的最早交易 (v3)"

    [获取地址的最早交易](https://goldrush.dev/docs/api-reference/foundational-api/transactions/get-earliest-transactions-for-address-v3){target=\_blank} 检索涉及地址的最早交易。

    === "参数"

        - `chainName` *string* - 例如 `moonbeam-mainnet`、`moonbeam-moonriver` 或 `moonbeam-moonbase-alpha`
        - `walletAddress` *string* - 您希望查询的地址

    === "示例请求"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/earliest-transactions/request.sh'
        ```

    === "示例响应"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/earliest-transactions/response.sh'
        ```

??? function "获取地址的最近交易 (v3)"

    [获取地址的最近交易](https://goldrush.dev/docs/api-reference/foundational-api/transactions/get-recent-transactions-for-address-v3){target=\_blank} 检索涉及地址的最近交易。

    === "参数"

        - `chainName` *string* - 例如 `moonbeam-mainnet`、`moonbeam-moonriver` 或 `moonbeam-moonbase-alpha`
        - `walletAddress` *string* - 您希望查询的地址

    === "示例请求"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/recent-transactions/request.sh'
        ```

    === "示例响应"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/recent-transactions/response.sh'
        ```

??? function "获取地址的分页交易 (v3)"

    [获取地址的分页交易 (v3)](https://goldrush.dev/docs/api-reference/foundational-api/transactions/get-paginated-transactions-for-address-v3){target=\_blank} 获取涉及地址和指定页面的交易，从 0 索引开始。

    === "参数"

        - `chainName` *string* - 例如 `moonbeam-mainnet`、`moonbeam-moonriver` 或 `moonbeam-moonbase-alpha`
        - `walletAddress` *string* - 您希望查询的地址
        - `page` *integer* - 请求的页面，0 索引。

    === "示例请求"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/get-paginated-transactions/request.sh'
        ```

    === "示例响应"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/get-paginated-transactions/response.sh'
        ```

??? function "获取地址的批量时间段交易 (v3)"

    [获取地址的批量时间段交易 (v3)](https://goldrush.dev/docs/api-reference/foundational-api/transactions/get-time-bucket-transactions-for-address-v3){target=\_blank} 用于获取所有交易，包括 15 分钟时间段间隔内解码的日志事件。

    === "参数"

        - `chainName` *string* - 例如 `moonbeam-mainnet`、`moonbeam-moonriver` 或 `moonbeam-moonbase-alpha`
        - `walletAddress` *string* - 您希望查询的地址
        - `timeBucket` *integer* - 0 索引的 15 分钟时间段。例如 8 9 Oct 2024 01:49 GMT = 1728420540 (Unix 时间)。1728420540/900 = 1920467 timeBucket。

    === "示例请求"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/get-bulk-time/request.sh'
        ```

    === "示例响应"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/get-bulk-time/response.sh'
        ```

??? function "按页面获取区块中的所有交易 (v3)"

    [按页面获取区块中的所有交易 (v3)](https://goldrush.dev/docs/api-reference/foundational-api/transactions/get-all-transactions-in-a-block-by-page){target=\_blank} 用于获取区块中包括其解码的日志事件的所有交易，并进一步标记有趣的钱包或交易。

    === "参数"

        - `chainName` *string* - 例如 `moonbeam-mainnet`、`moonbeam-moonriver` 或 `moonbeam-moonbase-alpha`
        - `blockHeight` *integer* - 请求的区块高度。也接受 `latest` 关键字
        - `page` *integer* - 请求的页面，0 索引。

    === "示例请求"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/get-all-txns-in-block/request.sh'
        ```

    === "示例响应"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/get-all-txns-in-block/response.sh'
        ```

??? function "获取区块中的所有交易 (v3)"

    [获取区块中的所有交易 (v3)](https://goldrush.dev/docs/api-reference/foundational-api/transactions/get-all-transactions-in-a-block){target=\_blank} 用于获取区块中包括其解码的日志事件的所有交易，并进一步标记有趣的钱包或交易。 它以区块哈希作为参数，并且不接受页面参数。

    === "参数"

        - `chainName` *string* - 例如 `moonbeam-mainnet`、`moonbeam-moonriver` 或 `moonbeam-moonbase-alpha`
        - `blockHash` *integer* - 请求的区块哈希

    === "示例请求"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/all-txns-by-block-hash/request.sh'
        ```

    === "示例响应"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/all-txns-by-block-hash/response.sh'
        ```

### 跨链 {: #cross-chain }

???+ function "获取地址的跨链活动"

    [获取地址的跨链活动](https://goldrush.dev/docs/api-reference/foundational-api/cross-chain/get-address-activity){target=\_blank} 用于查找地址在哪些链上处于活跃状态，只需一次 API 调用即可

    === "参数"

        - `walletAddress` *string* - 您希望查询的地址

    === "示例请求"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/cross-chain/request.sh'
        ```
        

    === "示例响应"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/cross-chain/response.sh'
        ```

### 安全性 {: #security }

???+ function "获取地址的令牌批准"

    [获取地址的令牌批准](https://goldrush.dev/docs/api-reference/foundational-api/security/get-token-approvals-for-address){target=\_blank} 用于获取钱包资产的所有令牌合约中按消费方分类的批准列表

    === "参数"

        - `chainName` *string* - 例如 `moonbeam-mainnet`、`moonbeam-moonriver` 或 `moonbeam-moonbase-alpha`
        - `walletAddress` *string* - 您希望查询的地址

    === "示例请求"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/erc20-approvals/request.sh'
        ```

    === "示例响应"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/erc20-approvals/response.sh'
        ```

GoldRush API 提供了许多其他方法，包括 NFT、价格、比特币和实用程序方法。请务必查看 [GoldRush API](https://goldrush.dev/docs/api-reference/foundational-api/cross-chain/get-address-activity){target=\_blank}，以获取有关每种方法的更多信息。

## API 参数和资源 {: #api-parameters-and-resources }

### API 参数 {: #api-parameters }

=== "Moonbeam"
    |       参数        |      值      |
    |:----------------------:|:---------------:|
    |    响应格式    |    JSON, CSV    |
    | 实时数据延迟 |    2 个区块     |
    |   批量数据延迟   |   30 分钟    |
    |     API 免费层级      | 限制为 4 RPS  |
    |    API 高级层级    | 限制为 50 RPS |

=== "Moonriver"
    |       参数        |      值      |
    |:----------------------:|:---------------:|
    |    响应格式    |    JSON, CSV    |
    | 实时数据延迟 |    2 个区块     |
    |   批量数据延迟   |   30 分钟    |
    |     API 免费层级      | 限制为 4 RPS  |
    |    API 高级层级    | 限制为 50 RPS |

=== "Moonbase Alpha"
    |       参数        |      值      |
    |:----------------------:|:---------------:|
    |    响应格式    |    JSON, CSV    |
    | 实时数据延迟 |    2 个区块     |
    |   批量数据延迟   |   30 分钟    |
    |     API 免费层级      | 限制为 4 RPS  |
    |    API 高级层级    | 限制为 50 RPS |

### API 资源 {: #api-resources }

- [API 参考和浏览器内端点演示](https://goldrush.mintlify.app/docs/api/overview){target=\_blank}
- [GoldRush 快速入门](https://goldrush.mintlify.app/docs/quickstart){target=\_blank}
- [书面指南](https://goldrush.dev/docs/overview){target=\_blank}

## 如何使用统一 API {: #how-to-use-the-unified-api }

首先，请确保您拥有[您的 API 密钥](https://goldrush.dev/platform/auth/register/){target=\_blank}，该密钥以 `cqt_` 或 `ckey_` 开头。 拥有 API 密钥后，您可以访问任何受支持的端点。 要获取特定网络的信息，您必须提供链 ID。

### 检查先决条件 {: #checking-prerequisites }

要开始使用 GoldRush API，您需要具备以下条件：

 - 一个免费的 [GoldRush API 密钥](https://goldrush.dev/platform/auth/register/){target=\_blank}
 - 安装 MetaMask 并[连接到 Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
 - 一个有资金的帐户。
 
  --8<-- 'zh/text/_common/faucet/faucet-list-item.md'

### 使用 Curl {: #using-curl }

支持的端点之一是代币持有者（token holders）端点，它会返回某个代币的所有持有者列表。在本示例中，你可以查询 ERTH 代币的持有者。ERTH 代币在 Moonbase Alpha 上的合约地址为 `0x08B40414525687731C23F430CEBb424b332b3d35`。

请在将占位符替换为你的 API Key 后，尝试在终端窗口中运行下面的命令。


```bash
curl https://api.covalenthq.com/v1/1287/tokens/\\\n0x08B40414525687731C23F430CEBb424b332b3d35/token_holders/ \\\n-u INSERT_YOUR_API_KEY:
```

### 使用 Javascript {: #using-javascript }

将下面的代码块复制并粘贴到您喜欢的环境或 [JSFiddle](https://jsfiddle.net){target=\_blank} 中。设置 API 密钥后，设置地址常量。请记住，对于 Moonbase Alpha，链 ID 为 `{{ networks.moonbase.chain_id }}`。

=== "使用 Fetch"

    ```js
    --8<-- 'code/builders/integrations/indexers/covalent/javascript-using-fetch.js'
    ```

=== "使用 Async"

    ```js
    --8<-- 'code/builders/integrations/indexers/covalent/javascript-using-async.js'
    ```

balances 端点返回所有 ERC-20 和 NFT token 余额的列表，包括 ERC-721 和 ERC-1155 余额，以及它们当前的现货价格（如果可用）。

![JavaScript 控制台输出](/images/builders/integrations/indexers/covalent/covalent-2.webp)

### 使用 Python {: #using-python }

GoldRush 没有官方的 API 包装器。要直接查询 API，您必须使用 Python [requests 库](https://pypi.org/project/requests){target=\_blank}。使用命令行 `pip install requests` 将 requests 安装到您的环境中。然后导入它并在您的代码中使用它。使用 HTTP 动词 get 方法从 API 返回信息。将下面的代码块复制并粘贴到您喜欢的环境中并运行它。输出应该与上面的屏幕截图类似，但是格式可能会因您的环境而异。

python
--8<-- 'zh/code/builders/integrations/indexers/covalent/python-example.py'

!!! note
    `auth` 的第二个参数为空，因为不需要密码 - 只需要您的 API 密钥。

--8<-- 'zh/text/_disclaimers/third-party-content.md'
