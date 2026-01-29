---
title: XCM 指令
description: 当 XCM 指令被组合在一起时，它们会形成一个执行跨链操作的 XCM 消息。 看看一些最常见的指令。
categories: XCM, Basics
---

# XCM指令

## 简介 {: #introduction }

XCM 消息包含一系列由跨共识虚拟机 (XCVM) 执行的[操作和指令](https://github.com/paritytech/xcm-format#5-the-xcvm-instruction-set){target=\_blank}。一个操作（例如，将一个区块链的通证转移到另一个区块链）由 XCVM 在源链和目标链中部分执行的指令组成。

例如，将 DOT 从 Polkadot 转移到 Moonbeam 的 XCM 消息将包含以下 XCM 指令（按该顺序），其中一些在 Polkadot 上执行，另一些在 Moonbeam 上执行：

 1. [TransferReserveAsset](#transfer-reserve-asset) — 在 Polkadot 中执行
 2. [ReserveAssetDeposited](#reserve-asset-deposited) — 在 Moonbeam 中执行
 3. [ClearOrigin](#clear-origin) — 在 Moonbeam 中执行
 4. [BuyExecution](#buy-execution) — 在 Moonbeam 中执行
 5. [DepositAsset](#deposit-asset) — 在 Moonbeam 中执行

从头开始构建 XCM 消息的指令并非易事。因此，开发人员可以利用包装函数和 pallet 来使用 XCM 功能。[Polkadot XCM](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=\_blank} 和 [XCM Transactor](/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/){target=\_blank} Pallet 提供了具有预定义 XCM 指令集的功能，可以发送 [XC-20](/builders/interoperability/xcm/xc20/overview/){target=\_blank} 或通过 XCM 在其他链上远程执行。

如果您有兴趣尝试不同的指令组合，您可以[使用 Polkadot XCM Pallet 执行和发送自定义 XCM 消息](/builders/interoperability/xcm/send-execute-xcm/){target=\_blank}。

本指南概述了一些最常用的 XCM 指令，包括上面示例中的指令。

## 购买执行 {: #buy-execution }

[`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=\_blank} 指令通常在目标链中执行。它从持有注册表（跨共识虚拟机（XCVM）中的临时位置）中获取资产，以支付执行费用。目标链确定要支付的费用。

## 清除来源 {: #clear-origin }

[`ClearOrigin`](https://github.com/paritytech/xcm-format#clearorigin){target=\_blank} 指令在目标链中执行。它清除 XCM 作者的来源，从而确保后续的 XCM 指令无法命令作者的权限。

## 资产存入 {: #deposit-asset }

[`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=\_blank} 指令在目标链中执行。它从持有注册表（Cross-Consensus Virtual Machine (XCVM) 中的一个临时位置）中移除资产，并将它们发送到目标链上的目标帐户。

## Descend Origin {: #descend-origin }

[`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=\_blank} 指令在目标链中执行。它会改变目标链上的来源，以匹配源链上的来源，确保目标链上的执行代表在源链上启动 XCM 消息的同一实体。

## 启动储备提取 {: #initiate-reserve-withdraw }

[`InitiateReserveWithdraw`](https://github.com/paritytech/xcm-format#initiatereservewithdraw){target=\_blank} 指令在源链中执行。它从控股登记处（跨共识虚拟机 (XCVM) 中的一个临时位置）移除资产（本质上是烧毁它们），然后向储备链发送一条以 `WithdrawAsset` 指令开头的 XCM 消息。

## 退还剩余 {: #refund-surplus }

[`RefundSurplus`](https://github.com/paritytech/xcm-format#refundsurplus){target=\_blank} 指令通常在 XCM 处理完毕后在目标链中执行。此指令将从 `BuyExecution` 指令中获取任何剩余资产，并将资产放入持有寄存器中，这是跨共识虚拟机 (XCVM) 中的一个临时位置。

## 储备资产已存入 {: #reserve-asset-deposited }

[`ReserveAssetDeposited`](https://github.com/paritytech/xcm-format#reserveassetdeposited-){target=\_blank} 指令在目标链中执行。它获取在主权账户中收到的资产的表示形式，并将它们放入持有注册表中，这是跨共识虚拟机（XCVM）中的一个临时位置。

## 设置附录 {: #set-appendix }

[`SetAppendix`](https://github.com/paritytech/xcm-format#setappendix){target=\_blank} 指令在目标链中执行。它设置附录寄存器，该寄存器保存应在当前执行完成后运行的代码。

## 转移储备资产 {: #transfer-reserve-asset }

[`TransferReserveAsset`](https://github.com/paritytech/xcm-format#transferreserveasset){target=\_blank} 指令在储备链中执行。它将资产从原始帐户转移，并将其存入目标链上的目标帐户。然后，它将一条包含 `ReserveAssetDeposited` 指令的 XCM 消息发送到目标链，后跟要执行的 XCM 指令。

## Transact {: #transact }

[`Transact`](https://github.com/paritytech/xcm-format#transact){target=\_blank} 指令在目标链中执行。它从给定的来源分派编码的调用数据，从而允许在目标链上执行特定的操作或函数。

## 提取资产 {: #withdraw-asset }

[`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=\_blank} 指令可以在源链或目标链中执行。它会移除资产并将它们放入持有寄存器中，这是跨共识虚拟机 (XCVM) 中的一个临时位置。
