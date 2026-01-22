---
title: 在 Moonbeam 上转移和监控余额
description: 开发者需要了解的关于 Moonbeam 上可用的不同余额转移与以太坊相比的主要差异的描述。
categories: 基础知识
---

# Moonbeam 上的余额转移

## 简介 {: #introduction }

尽管 Moonbeam 致力于与 Ethereum 的 Web3 API 和 EVM 兼容，但在基础网络代币（例如，GLMR 和 MOVR）的余额转移方面，开发人员应该了解和理解 Moonbeam 的一些重要差异。

代币持有者有两种在 Moonbeam 上发起余额转移的方式。一方面，用户可以通过以太坊 API 使用 MetaMask、MathWallet 等应用程序或任何其他使用以太坊 JSON-RPC 的工具。另一方面，用户可以通过 Polkadot.js Apps 网站或直接使用 Substrate RPC 来使用 Substrate API。

开发人员需要知道，代币持有者可以利用这两个 API 来转移基础层网络代币。请注意，这些注释不适用于其他资产的转移，例如 Moonriver 或 Moonbeam EVM 中基于 ERC-20 的资产。这些资产的转移只能通过以太坊 API 完成，因为这些是智能合约交互。

本指南将概述用于基础层网络代币余额转移的两个 API 之间的主要区别，以及首次使用 Moonbeam 时的预期情况。

## Ethereum 转账 {: #ethereum-transfers }

使用 Ethereum API 进行简单的余额转账依赖于 `eth_sendRawTransaction` JSON-RPC。可以直接从一个账户转到另一个账户，也可以通过智能合约进行。

有不同的策略来监听 Ethereum 上的转账或余额更改，本文档不涵盖这些策略。但它们都侧重于使用 Ethereum JSON-RPC 的不同策略。

## Moonbeam 转账 {: #moonbeam-transfers }

如前所述，Moonbeam 使代币持有者能够通过 Ethereum 和 Substrate API 执行底层的网络代币转账。在 Moonbeam 上触发代币转账有多种情况。因此，要监控所有转账，**您应该使用 Polkadot.js SDK**（Substrate API）。

在介绍不同的场景之前，先介绍与区块相关的两个不同元素：

 - **Extrinsic** — 指源于系统外部的状态更改。Extrinsic 最常见的形式是交易。它们按执行顺序排列
 - **Events** — 指由 extrinsic 生成的日志。每个 extrinsic 可以有多个事件。它们按执行顺序排列

不同的转账场景包括：

 - **Substrate 转账** — 将创建一个 extrinsic，即 `balances.transferAllowDeath` 或 `balances.transferKeepAlive`。它将触发**一个** `balances.Transfer` 事件
 - **Substrate 功能** — 某些原生 Substrate 功能可以创建 extrinsic，将代币发送到某个地址。例如，[Treasury](/learn/features/treasury/){target=_blank} 可以创建一个 extrinsic，如 `treasury.proposeSend`，它将触发**一个或多个** `balances.Transfer` 事件
 - **Ethereum 转账** — 将创建一个带有空输入的 `ethereum.transact` extrinsic。它将触发**一个** `balances.Transfer` 事件
 - **通过智能合约进行的 Ethereum 转账** — 将创建一个带有某些数据作为输入的 `ethereum.transact` extrinsic。它将触发**一个或多个** `balances.Transfer` 事件

上面描述的所有场景都将有效地转移底层的网络代币。监控所有这些场景最简单的方法是依赖 `balances.Transfer` 事件。

## 监控原生代币余额转移 {: #monitor-transfers }

以下代码示例将演示如何监听通过 Substrate 或 Ethereum API 发送的两种类型的原生代币转移，可以使用 [Polkadot.js API 库](https://polkadot.js.org/docs/api/start/){target=\_blank} 或 [Substrate API Sidecar](https://github.com/paritytech/substrate-api-sidecar){target=\_blank}。以下代码片段仅用于演示目的，未经修改和在生产环境中进一步测试，不应使用。

### 使用Polkadot.js API {: #using-polkadotjs-api }

[Polkadot.js API 包](https://polkadot.js.org/docs/api/start/){target=_blank}为开发人员提供了一种使用 JavaScript 与 Substrate 链交互的方式。

以下代码片段使用 [`subscribeFinalizedHeads`](https://polkadot.js.org/docs/substrate/rpc/#subscribefinalizedheads-header){target=_blank} 订阅新的最终确定的区块头，循环遍历从区块中获取的 extrinsics，并检索每个 extrinsic 的事件。然后，它检查是否有任何事件对应于 `balances.Transfer` 事件。如果是，它将提取转账的 `from`、`to`、`amount` 和 `tx hash`，并在控制台上显示。请注意，`amount` 以最小单位 (Wei) 显示。您可以在他们的 [官方文档网站](https://polkadot.js.org/docs/substrate/rpc){target=_blank}上找到有关 Polkadot.js 和 Substrate JSON-RPC 的所有可用信息。

```ts
--8<-- 'code/learn/core-concepts/transfers-api/balance-event.ts'
```

此外，您可以在此 [GitHub 页面](https://gist.github.com/crystalin/b2ce44a208af60d62b5ecd1bad513bce){target=\_blank}上找到与余额转账相关的更多特定案例的示例代码片段。

### 使用 Substrate API Sidecar {: #using-substrate-api-sidecar }

开发者还可以使用 [Substrate API Sidecar](https://github.com/paritytech/substrate-api-sidecar){target=_blank}（一个用于与使用 Substrate 框架构建的区块链交互的 REST API 服务）检索 Moonbeam 区块并监控通过 Substrate 和 Ethereum API 发送的交易。

以下代码片段使用 Axios HTTP 客户端查询 [Sidecar 端点 `/blocks/head`](https://paritytech.github.io/substrate-api-sidecar/dist){target=_blank} 以获取最新的已完成区块，然后解码该区块，以获取 EVM 和 Substrate API 级别的原生代币转移的 `from`、`to`、`value`、`tx hash` 和 `transaction status`。

```js
--8<-- 'code/learn/core-concepts/transfers-api/sidecar-transfer.js'
```

您可以参考 [Substrate API Sidecar 页面](/builders/substrate/libraries/sidecar/)，获取有关安装和运行您自己的 Sidecar 服务实例的信息，以及有关如何解码 Sidecar 区块以进行 Moonbeam 交易的更多详细信息。
