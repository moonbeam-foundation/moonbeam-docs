---
title: 在 Moonbeam 上订阅以太坊风格的事件
description: 了解 Moonbeam 上支持的非标准以太坊 JSON-RPC 方法，这些方法为特定事件提供发布-订阅功能。
categories: JSON-RPC APIs, Ethereum Toolkit
---

# 订阅事件

## 简介 {: #introduction }

Moonbeam 支持以太坊风格的事件订阅，允许您等待事件并相应地处理它们，而不是轮询它们。

它的工作原理是订阅特定事件；每个订阅都会返回一个 ID。对于每个与订阅匹配的事件，都会发送包含相关数据的通知以及订阅 ID。

在本指南中，您将学习如何在 Moonbase Alpha 上订阅事件日志、传入的待处理交易和传入的区块头。本指南也适用于 Moonbeam 或 Moonriver。

## 支持的 Pubsub JSON-RPC 方法 {: #filter-rpc-methods }

请注意，本节中的示例需要安装 [wscat](https://github.com/websockets/wscat){target=\_blank}。

???+ function "eth_subscribe"

    为给定的订阅名称创建订阅。

    === "参数"

        - `subscription_name` *string* - 要订阅的事件类型。支持的[订阅](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#create-subscriptions#supported-subscriptions){target=\_blank} 类型有：
            - [`newHeads`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#newheads){target=\_blank} — 每次将新标头附加到链时触发通知
            - [`logs`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#logs){target=\_blank} — 返回包含在新的导入块中并符合给定筛选标准的日志
            - [`newPendingTransactions`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#newpendingtransactions){target=\_blank} — 返回添加到挂起状态的所有交易的哈希值
            - [`syncing`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/pubsub#syncing){target=\_blank} — 指示节点何时开始或停止与网络同步

    === "返回值"

        `result` 返回订阅 ID。

    === "示例"

        ```bash
        wscat -c {{ networks.moonbase.wss_url }} -x '
          {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_subscribe",
            "params": ["INSERT_SUBSCRIPTION_NAME"]
          }'
        ```
        

???+ function "eth_unsubscribe"

    取消给定订阅 ID 的现有订阅。

    === "参数"

        - `subscription_id` *string* - 订阅 ID
  
    === "返回值"

        `result` 返回一个布尔值，指示是否成功取消订阅。

    === "示例"

        ```bash
        wscat -c {{ networks.moonbase.wss_url }} -x '
          {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_unsubscribe",
            "params": ["INSERT_SUBSCRIPTION_ID"]
          }'
        ```

## 使用以太坊库订阅事件 {: #subscribe-to-events }

本节将向您展示如何使用[以太坊库](builders/ethereum/libraries/){target=\_blank}（如[Ethers.js](builders/ethereum/libraries/ethersjs/){target=\_blank}）以编程方式订阅 Moonbeam 上的事件。

### 检查先决条件 {: #checking-prerequisites }

本指南中的示例基于 Ubuntu 22.04 环境。您还需要以下内容：

- 安装 MetaMask 并[连接到 Moonbase Alpha](tokens/connect/metamask/){target=\_blank}
- 一个有资金的帐户。
  --8<-- 'zh/text/_common/faucet/faucet-list-item.md'
- 在 Moonbase Alpha 上部署您自己的 ERC-20 代币。您可以通过按照[我们的 Remix 教程](builders/ethereum/dev-env/remix/){target=\_blank}，同时首先将 MetaMask 指向 Moonbase Alpha 来做到这一点
- 安装 Ethers.js 或您选择的 Ethereum 库。您可以通过 npm 安装 Ethers.js：

    ```bash
    npm install ethers
    ```

### 订阅事件日志 {: #subscribing-to-event-logs-in-moonbase-alpha }

任何遵循 ERC-20 代币标准的合约都会发出与代币转移相关的事件，即 `event Transfer(address indexed from, address indexed to, uint256 value)`。在本节中，您将学习如何使用 Ethers.js 库订阅这些事件。

使用以下代码片段来设置一个订阅，以侦听代币转移事件：

```js
--8<-- 'code/builders/ethereum/json-rpc/pubsub/subscribe-to-event-logs.js'
```

!!! note
    请务必将 `'INSERT_CONTRACT_ADDRESS'` 替换为您应该已经部署的 ERC-20 代币合约的实际地址（作为[前提条件](#checking-prerequisites)）。

在提供的代码中：

- WebSocket 提供程序用于侦听 `Transfer` 事件，并使用合约 ABI 解析日志
- 侦听器通过签名来过滤 `Transfer` 事件，签名可以按如下方式计算：

    ```js
    EventSignature = keccak256(Transfer(address,address,uint256))
    ```

    这转换为 `0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef`，并用作订阅过滤器中的第一个主题。

如果您不提供任何主题，您将订阅合约发出的所有事件。有关主题的更多信息，请参见 [了解以太坊区块链上的事件日志](https://medium.com/mycrypto/understanding-event-logs-on-the-ethereum-blockchain-f4ae7ba50378){target=\_blank} Medium 文章。

通过执行此代码，您将建立一个订阅来监视 Moonbeam 上的 ERC-20 代币转移事件。新事件发生时将记录到终端。

--8<-- 'code/builders/ethereum/json-rpc/pubsub/terminal/contract-events.md'

#### 理解事件日志 {: #understanding-event-logs }

为了说明这个过程，假设一个 ERC-20 代币转移已发送，参数如下：

 - **From 地址** - `0x44236223aB4291b93EEd10E4B511B37a398DEE55`
 - **To 地址** - `0x8841701Dba3639B254D9CEe712E49D188A1e941e`
 - **Value（代币）** - `1000000000000000000` (1 DEV in Wei)

该交易发出的事件日志如下：

--8<-- 'code/builders/ethereum/json-rpc/pubsub/terminal/log-transfer-event.md'

如果您查看 `topics` 数组，则总共有三个主题（按此顺序）：

1. `Transfer` 事件的事件签名
2. `from` 地址
3. `to` 地址

由于总共有三个主题（最大值为四个），因此这对应于 LOG3 操作码：

![LOG3 描述](/images/builders/ethereum/json-rpc/pubsub/pubsub-1.webp)

索引主题（例如 `from` 和 `to` 地址）通常由 256 位（64 个十六进制字符）值表示。如有必要，它们会用零填充以达到完整长度。

未索引的数据（例如转移的代币值）不包含在 `topics` 数组中。相反，它在日志的 `data` 字段中以 bytes32/hex 格式返回。要解码它，您可以使用例如这个 [Web3 类型转换器工具](https://web3-type-converter.onbrn.com){target=\_blank} 并验证 `data` 是以 Wei 格式格式化的 1 DEV 代币。

如果事件返回多个未索引的值，它们将按照事件发出它们的相同顺序一个接一个地附加。因此，每个值都是通过将数据解构为单独的 32 字节（或 64 个十六进制字符长）的部分来获得的。

#### 使用通配符和条件格式 {: #using-wildcards-and-conditional-formatting }

使用与上一节相同的示例，您可以通过以下代码订阅 Transfer 事件，同时按特定发送者进行过滤：

```js
--8<-- 'code/builders/ethereum/json-rpc/pubsub/use-wildcards.js'
```

在此，第一个索引参数 (`from`) 被过滤到提供的地址列表，而 `to` 设置为 `null` 以充当通配符。合约过滤器会为您处理主题格式，因此您无需手动填充地址。

--8<-- 'code/builders/ethereum/json-rpc/pubsub/terminal/conditional-subscription.md'

如图所示，在您提供具有条件格式的两个地址后，您应该收到两个具有相同订阅的日志。来自不同地址的交易发出的事件不会向此订阅抛出任何日志。

此示例展示了如何仅订阅特定合约的事件日志，但相同的方法适用于以下各节中介绍的其他订阅类型。

### 订阅传入的待处理交易 {: #subscribe-to-incoming-pending-transactions }

要使用 Ethers.js 订阅待处理交易，您可以使用 WebSocket 提供程序和 `provider.on('pending')` 事件。将返回待处理交易的交易哈希，您可以选择使用 `provider.getTransaction(hash)` 获取完整的交易详细信息。

--8<-- 'code/builders/ethereum/json-rpc/pubsub/terminal/pending-txn.md'

您可以尝试发送一笔交易，并验证订阅返回的交易哈希是否与您使用的开发工具或钱包返回的交易哈希相同。

### 订阅传入的区块头 {: #subscribe-to-incoming-block-headers }

您还可以使用 `provider.on('block')` 订阅新的区块头，然后使用 `provider.getBlock(blockNumber)` 获取区块。此订阅提供传入的区块头，可用于跟踪区块链中的更改。

--8<-- 'code/builders/ethereum/json-rpc/pubsub/terminal/block-headers.md'

请注意，图像中仅显示了一个区块头。 这些消息是为每个生成的块显示的，因此它们可以快速填满终端。

### 检查节点是否与网络同步 {: #check-if-a-node-is-synchronized-with-the-network }

使用 pubsub，还可以检查特定节点当前是否与网络同步。您可以使用首选库的底层 WebSocket 请求助手调用带有 `syncing` 的 `eth_subscribe` RPC。当 `syncing` 为 false 时，此订阅将返回一个布尔值；当 `syncing` 为 true 时，将返回一个描述同步进度的对象，如下所示。

--8<-- 'code/builders/ethereum/json-rpc/pubsub/terminal/syncing.md'

!!! note
    [Frontier](https://github.com/polkadot-evm/frontier){target=\_blank} 中的 pubsub 实现仍在积极开发中。当前版本允许用户订阅特定事件类型，但可能仍然存在一些限制。
