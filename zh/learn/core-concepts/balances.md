---
title: 账户余额
description: 以太坊开发者需要了解的关于Moonbeam账户余额与以太坊账户余额的主要区别的描述。
categories: 基础知识
---

# Moonbeam 账户余额

## 简介 {: #introduction }

虽然 Moonbeam 致力于与以太坊的 Web3 API 和 EVM 兼容，但在账户余额方面，开发人员应该了解并理解 Moonbeam 的一些重要差异。

Moonbeam 的设计目标之一是创建一个尽可能接近以太坊的环境，并提供一组与以太坊兼容的 Web3 RPC 端点。然而，Moonbeam 也是一条基于 Substrate 的链，这意味着它公开了 Substrate RPC，并且它具有由 Substrate 提供支持的集成功能，例如 Staking、Governance 以及其他不属于以太坊 API 的功能。

Moonbeam 的[统一账户](/learn/core-concepts/unified-accounts/){target=\_blank}是 Moonbeam 实现以太坊兼容性的一种方式，它通过更改协议中底层的账户类型，使其类似于以太坊（H160 或以 `0x` 开头的 20 字节地址）。统一账户被 Substrate 和以太坊 API 使用，并映射到区块链上相同的底层数据存储。然而，通过以太坊 API 使用 Moonbeam 账户时，来自以太坊的用户应该了解一些重要的差异。

本指南将概述这些主要差异中的一些，以及首次使用 Moonbeam 时的预期情况。

## 以太坊账户余额 {: #ethereum-account-balances }

以太坊上的账户是一个具有代币余额（在本例中为以太币或ETH）的实体。账户持有人可以在以太坊上发送以太币交易，账户可以由用户（使用用于签名的私钥）或智能合约控制。

因此，以太坊有两种主要类型的账户：用户所有和合约所有。无论类型如何，以太坊账户都有一个单一的余额字段，表示该地址拥有的Wei的数量，其中Wei是以太币的一个面额（每个ETH为1 x 10^18 Wei）。

![以太坊余额图示](/images/learn/core-concepts/balances/balances-1.webp)

## Moonbeam 账户余额 {: #moonbeam-account-balances }

Moonbeam 上的账户也是一个具有代币余额的实体（代币将取决于网络）。与以太坊一样，账户持有人可以在他们连接的 Moonbeam 网络上发送代币交易。此外，账户可以由用户（使用私钥进行签名）或智能合约控制。

与以太坊一样，主要有两种类型的账户：用户拥有的和合约拥有的。但是，在 Moonbeam 上，在这两种账户类型中，还有[代理账户](https://wiki.polkadot.com/learn/learn-proxies/){target=\_blank}，它们可以代表另一个账户执行有限数量的操作。在余额方面，所有 Moonbeam 账户类型都有五 (5) 种不同的[余额类型](https://wiki.polkadot.com/learn/learn-accounts/#balance-types#balance-types){target=\_blank}：

 - **可用** — 指的是可以从 Substrate API 使用（未锁定/冻结）的余额。`可用`余额的概念取决于要执行的操作。例如，在民主投票中，不会从`可用`余额中扣除分配给投票的余额，但代币持有人将无法转移该余额
 - **可减少** — 指的是可以通过 Moonbeam 上的以太坊 API 使用（未锁定/冻结）的余额。例如，这是 MetaMask 引擎显示的余额。它是真正可消费的余额，用于核算所有民主锁定（在 Polkadot.js Apps 中显示为可转移）
 - **保留** — 指的是由于链上要求而持有的余额，可以通过执行一些链上操作来释放。例如，创建代理账户或设置链上身份的保证金显示为`保留余额`。在释放这些资金之前，**不能**通过以太坊 API 转移或访问这些资金
 - **其他冻结** — 表示在提取资金时，`可用`余额不能低于的余额，交易费用支付除外。例如，用于对治理提案进行投票的资金显示为`其他冻结`。在释放这些资金之前，**不能**通过以太坊 API 转移或访问这些资金
 - **费用冻结** — 表示专门支付交易费用时，`可用`余额不能低于的余额。在释放这些资金之前，**不能**通过以太坊 API 转移或访问这些资金

![Moonbeam balances diagram](/images/learn/core-concepts/balances/balances-2.webp)

### 计算您的可转移余额 {: #calculating-your-transferable-balance }

账户的可转移或可消费余额可以计算为可用余额减去 `0` 或冻结和保留代币之间的差额的最大值：

```text
Transferable = free - max(0, frozen - reserved )
```

以下是计算可转移余额的两个示例：

账户拥有 `1000` 个可用代币、`200` 个冻结代币和 `50` 个保留代币。可转移余额计算如下：

```text
Transferable = 1000 - max(0, 200 - 50) = 1000 - 150 = 850
```
如果冻结的代币少于保留的代币，例如拥有 `1000` 个可用代币、`100` 个冻结代币和 `150` 个保留代币，则可转移余额将为：

```text
Transferable = 1000 - max(0, 100 - 150) = 1000 - 0 = 1000
```

### 检索您的余额 {: #retrieve-your-balance }

您可以使用[Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=\_blank}查看您的余额，包括您的可用（或可转账）余额和保留余额（如果存在）。

!!! note
    --8<-- 'zh/text/_common/endpoint-examples.md'

```js
--8<-- 'code/learn/core-concepts/balances/balance.js'
```

!!! note
    从运行时 4000 开始，由于 `ParachainStaking` pallet 从已弃用的 `Currency` 特征迁移到现代 `Fungible` 特征，质押锁已被余额冻结所取代。先前使用标识符 [`stkngcol`, `stkngdel`] 读取 `Balances.Locks` 的查询现在必须使用冻结原因 [`StakingCollator`, `StakingDelegator`] 读取 `Balances.Freezes`。

您可以使用 Polkadot.js API 检索您的余额冻结，如下所示。

```js
--8<-- 'code/learn/core-concepts/balances/freezes.js'
```

## 主要差异 {: #main-differences }

以太坊和 Moonbeam 上的账户余额之间的主要区别在于 Moonbeam 上的锁定和保留余额的概念。这些代币仍然归该账户所有，但它们尚不可花费。

从以太坊的 API 角度来看，一个账户可能会显示它具有一定的余额（称为 `reducible` 余额）。但是，在链上操作之后，此值可能会增加（或减少），而无需实际的余额转移。

请务必注意，此处描述的账户和行为差异仅适用于具有基础资产（GLMR、MOVR）的账户余额，以及不与智能合约交互的该资产的余额。一旦 Moonbeam 账户余额与智能合约交互，其行为将与以太坊的行为相同。例如，如果您在 Moonriver 上包装 MOVR，则无法通过质押或治理操作来更改基础余额，因为这是合约存储的一部分。在这种情况下，该账户的可减少余额已提交给包装的 MOVR 智能合约，并且无法通过 Substrate 操作进行修改。
