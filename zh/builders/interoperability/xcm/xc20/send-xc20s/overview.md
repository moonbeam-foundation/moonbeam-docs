---
title: XC-20 Token转移概览
description: 探索资产转移的类型以及通过 XCM 进行远程资产转移的一些基本原理，包括用于资产转移的 XCM 指令。
categories: Basics, XC-20
---

# XC-20 转账概览

## 简介 {: #introduction }

资产可以使用 XCM 在平行链之间移动。目前有两种主要方法：

- **资产瞬移** – 销毁储备链上的代币，并在目标链上铸造相同数量的代币。每个链都持有原生资产作为储备，类似于销毁-铸造桥接机制。由于每个链都可以创建代币，因此需要一定程度的信任
- **远程转移** – 将代币从储备链转移到主权账户（储备链上由目标链以无需信任方式控制的账户）。然后，目标链铸造一个包装（也称为“虚拟”或“跨链”）表示。这个包装版本始终可以与原始资产 1:1 互换，其功能类似于锁定-铸造和销毁-解锁桥。资产发源的链被称为储备链

![资产瞬移和远程转移](/images/builders/interoperability/xcm/xc20/send-xc20s/overview/overview-1.webp)

Moonbeam 目前使用远程转移进行 XC-20 转移。

本页介绍了基于 XCM 的远程转移的基本原理。要了解如何执行 XC-20 转移，请参阅[通过 Substrate API 进行 XC-20 转移](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=\_blank}指南。

## 资产转移的 XCM 指令 {: #xcm-instructions-for-asset-transfers }

XCM Pallet 和 Precompile 抽象了跨链资产转移中涉及的许多复杂性，自动构建必要的 XCM 消息。尽管如此，对底层指令有一个基本的了解可能会很有用。

作为参考，您可以在[使用 Polkadot XCM Pallet 发送 XC-20 指南](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=\_blank}中找到用于发送 XC-20 的 Polkadot XCM Pallet extrinsic。

每个 XCM 转移中的指令因资产和转移路线而异。例如，将像 xcDOT 这样的原生代币返回到其储备链（从 Moonbeam 到 Polkadot）与从 Polkadot 发送 DOT 到 Moonbeam 不同。以下是这些代币转移中常用指令的示例。

### 从储备链转移储备资产的说明 {: #transfer-native-from-origin }

--8<-- 'zh/text/builders/interoperability/xcm/xc20/send-xc20s/overview/DOT-to-xcDOT-instructions.md'

此过程会调用带有 `assets`、`dest` 和 `xcm` 参数的 `TransferReserveAsset`。在 `xcm` 参数中，您通常会指定 `BuyExecution` 和 `DepositAsset` 指令。如[`TransferReserveAsset` 指令](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-executor/src/lib.rs#L630){target=\_blank}中所示，该流程还包括 `ReserveAssetDeposited` 和 `ClearOrigin` 以完成转移。

有关构造用于资产转移（例如 DOT 到 Moonbeam）的 XCM 消息的更多信息，请参阅 [Polkadot XCM Pallet 指南](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=\_blank}。

### 将储备资产转回储备链的说明 {: #transfer-native-to-origin }

--8<-- 'zh/text/builders/interoperability/xcm/xc20/send-xc20s/overview/xcDOT-to-DOT-instructions.md'

步骤 3 到 6 由 `InitiateReserveWithdraw` 指令（步骤 2）自动触发，并在 Polkadot 上执行。一旦在 Moonbeam 上调用 `InitiateReserveWithdraw`，组装好的 XCM 消息会指示 Polkadot 运行这些最终指令，从而完成跨链转移。换句话说，虽然 Moonbeam 在幕后构建 XCM 指令，但它们最终会在 Polkadot 上执行，以完成资产返回其储备链。

有关构建 XCM 消息以将储备资产转移到目标链（例如 xcDOT 到 Polkadot）的更多信息，您可以参考 [Polkadot XCM Pallet](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=\_blank} 指南。

!!! note
	具体说明可能随时间而变化，但此总体流程保持一致：代币从 Moonbeam 上的用户处提取，从本地表示中销毁，并在储备链上解锁。在此过程结束时，它们在其储备链上再次完全可访问。
