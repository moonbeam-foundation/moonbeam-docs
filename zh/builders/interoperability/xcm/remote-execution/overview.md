---
title: 远程执行概述
description: 了解通过 XCM 消息进行远程执行的基础知识，XCM 消息允许用户使用他们通过 XCM 远程控制的帐户在其他区块链上执行操作。
categories: XCM Remote Execution, Basics
---

# 通过 XCM 进行远程执行

## 简介 {: #introduction }

[跨共识消息（XCM）](https://wiki.polkadot.com/learn/learn-xcm/){target=\_blank}格式定义了如何在可互操作的区块链之间发送消息。此格式为发送 XCM 消息打开了大门，该消息可以在基于 Moonbeam 的网络、中继链或 Polkadot/Kusama 生态系统中的其他平行链中执行任意字节集。

通过 XCM 进行远程执行为跨链交互开辟了一系列新的可能性，从链在其他链上执行操作到用户在不切换链的情况下执行远程操作。

本页介绍了 XCM 远程执行的基本原理。如果您想了解如何通过 XCM 执行远程执行，请参阅[通过 Substrate API 进行远程执行](builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/){target=\_blank}或[通过 Ethereum API 进行远程执行](builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/){target=\_blank}指南。

## 执行源 {: #execution-origin }

一般来说，所有交易都有一个源，也就是调用的来源。以太坊交易只有一种源类型，即 `msg.sender`，它是启动交易的账户。

基于 Substrate 的交易更为复杂，因为它们可以具有不同权限级别的不同源。这类似于具有特定 `require` 语句的 EVM 智能合约调用，其中调用必须来自允许的地址。相比之下，这些权限级别是在基于 Substrate 的运行时本身中编程的。

源在 Substrate 运行时的不同组件中非常重要，因此在 Moonbeam 运行时中也很重要。例如，它们定义了他们在[链上治理实施](learn/features/governance/){target=\_blank}中继承的权限级别。

在执行 XCM 消息期间，源定义了执行 XCM 的上下文。默认情况下，XCM 由目标链中源链的主权账户执行。这种 Polkadot 特有的属性，即具有在执行 XCM 时计算的远程源，被称为[计算源](builders/interoperability/xcm/remote-execution/computed-origins/){target=\_blank}（以前称为多位置衍生账户）。

根据目标链的配置，包括 `DescendOrigin` XCM 指令可以改变执行 XCM 消息的源。此属性对于远程 XCM 执行非常重要，因为正在执行的操作会考虑新改变的源的上下文，而不是源链的主权账户。

## 远程执行的 XCM 指令 {: #xcm-instructions-remote-execution }

通过 XCM 在 Moonbeam（作为一个例子）上执行远程执行所需的核心 XCM 指令如下：

 - [`DescendOrigin`](builders/interoperability/xcm/core-concepts/instructions/#descend-origin){target=\_blank} - （可选）在 Moonbeam 中执行。改变来源以创建一个新的计算来源，该来源表示由来源链中的发送者通过 XCM 控制的无密钥账户
 - [`WithdrawAsset`](builders/interoperability/xcm/core-concepts/instructions/#withdraw-asset){target=\_blank} - 在 Moonbeam 中执行。从计算来源中提取资金
 - [`BuyExecution`](builders/interoperability/xcm/core-concepts/instructions/#buy-execution){target=\_blank} - 在 Moonbeam 中执行。使用前一个 XCM 指令提取的资金来支付 XCM 执行费用，包括远程调用
 - [`Transact`](builders/interoperability/xcm/core-concepts/instructions/#transact){target=\_blank} - 在 Moonbeam 中执行。执行 XCM 指令中提供的任意字节

以上详细说明的 XCM 指令可以用其他 XCM 指令来补充，以更准确地处理某些情况，例如执行失败。一个例子是包含 [`SetAppendix`](builders/interoperability/xcm/core-concepts/instructions/#set-appendix){target=\_blank}、[`RefundSurplus`](builders/interoperability/xcm/core-concepts/instructions/#refund-surplus){target=\_blank} 和 [`Deposit`](builders/interoperability/xcm/core-concepts/instructions/#deposit-asset){target=\_blank}。

## 通过 XCM 流进行通用远程执行 {: #general-remote-execution-via-xcm-flow }

用户通过构建 XCM 的 pallet 在源链中启动一个交易，该 XCM 至少包含[远程执行所需的 XCM 指令](#xcm-instructions-remote-execution)。该交易在源链中执行，源链将包含给定指令的 XCM 消息发送到目标链。

XCM 消息到达目标链，目标链执行它。默认情况下，它以源链的 Sovereign 帐户作为计算 Origin 执行。使用此类 Origin 的一个示例是链在 relay 链上打开或接受 HRMP 通道时。

如果 XCM 消息包含 [`DescendOrigin`](builders/interoperability/xcm/core-concepts/instructions/#descend-origin){target=\_blank} 指令，则目标链可能会改变 Origin 以计算新的计算 Origin（Moonbeam 及其衍生网络就是这种情况）。

接下来，[`WithdrawAsset`](builders/interoperability/xcm/core-concepts/instructions/#withdraw-asset){target=\_blank} 从计算 Origin（Sovereign 帐户或已改变的帐户）中提取资金，然后这些资金用于通过 [`BuyExecution`](builders/interoperability/xcm/core-concepts/instructions/#buy-execution){target=\_blank} XCM 指令支付 XCM 执行费用。请注意，在这两个指令中，您都需要指定要使用的资产。此外，您必须在要购买的执行量中包含要执行的字节。

最后，[`Transact`](builders/interoperability/xcm/core-concepts/instructions/#transact){target=\_blank} 执行对应于目标链中 pallet 和函数的任意字节集。您必须指定要使用的 Origin 类型（通常为 `SovereignAccount`）和执行字节所需的权重（类似于以太坊领域中的 gas）。

![在目标链上执行的 XCM 指令以进行远程执行的示意图。](/images/builders/interoperability/xcm/remote-execution/overview/overview-1.webp)
