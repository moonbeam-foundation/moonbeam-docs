---
title: Ethereum App
description: 本指南将引导您了解如何使用 Ledger 硬件钱包，通过 Ledger Live 上的 Ethereum 应用程序在 Moonbeam 上运行的网络中签署交易。
categories: Tokens and Accounts, Ethereum Toolkit
---

# 使用 Ledger 和 Ethereum 应用程序与 Moonbeam 交互

## 介绍 {: #introduction }

硬件钱包提供了一种更安全的加密货币存储方式，因为私钥（用于签署交易）是离线存储的。在撰写本文时，Ledger 提供两种硬件钱包解决方案：Ledger Nano S 和 Ledger Nano X。

对于 Moonbeam、Moonriver 和 Moonbase Alpha 测试网，您可以通过设置链 ID 来使用 Ledger Live 上的以太坊应用程序。对于 Moonbeam，链 ID 是 1284，对于 Moonriver 是 1285，对于 Moonbase Alpha 是 1287。以太坊应用程序涵盖所有支持的基于 Moonbeam 的网络，并且可用于连接 Ledger 设备。

在本教程中，您将学习如何开始在 Moonbeam 上使用以太坊应用程序的 Ledger 硬件钱包。本指南仅说明了 Ledger Nano X 设备的步骤，但您也可以按照 Ledger Nano S 进行操作。

--8<-- 'zh/text/_disclaimers/third-party-content-intro.md'

--8<-- 'zh/text/tokens/connect/ledger/checking-prereqs.md'

--8<-- 'zh/text/tokens/connect/ledger/checking-prereqs-ll.md'

## 安装 Ledger Live 应用程序 {: install-the-ledger-live-app }

如果您想连接到 Moonbeam、Moonriver 或 Moonbase Alpha TestNet，您可以通过安装 Ethereum 应用程序来实现，稍后您需要指定一个链 ID。

--8<-- 'zh/text/tokens/connect/ledger/install-eth-app.md'

在 Ledger Live 应用程序中，根据您安装的应用程序，您应该在 **Manager** 页面上的 **已安装的应用程序** 选项卡下看到它们。成功安装应用程序后，您可以关闭 Ledger Live。

<img src=

## 将您的 Ledger 帐户导入 MetaMask {: #import-your-ledger-account-to-metamask }

现在您已经在 Ledger Live 上安装了应用程序，您可以将您的 Ledger 连接到电脑并解锁，然后打开 Ethereum 应用程序。

--8<-- 'zh/text/tokens/connect/ledger/import-ledger/step-1.md'

![MetaMask 连接硬件钱包](/images/tokens/connect/ledger/ethereum/ledger-2.webp)

--8<-- 'zh/text/tokens/connect/ledger/import-ledger/step-2.md'

![MetaMask 选择 Ledger 硬件钱包](/images/tokens/connect/ledger/ethereum/ledger-3.webp)

--8<-- 'zh/text/tokens/connect/ledger/import-ledger/step-3.md'

![Ledger on Chrome](/images/tokens/connect/ledger/ethereum/ledger-4.webp)

--8<-- 'zh/text/tokens/connect/ledger/import-ledger/step-4.md'

如果 MetaMask 成功连接到您的 Ledger 设备，您应该会看到一个包含五个 Moonbeam / 以太坊风格账户的列表。 如果没有看到，请仔细检查 Ledger Live 是否已关闭，您已将 Ledger 设备连接到电脑并解锁，并确保 Ethereum 应用程序已打开。

--8<-- 'zh/text/tokens/connect/ledger/import-accounts.md'

![MetaMask 选择要导入的以太坊帐户](/images/tokens/connect/ledger/ethereum/ledger-5.webp)

如果您已成功导入 Ledger 帐户，您应该会在 MetaMask 主屏幕上看到您的帐户和余额，如下图所示：

![MetaMask 成功导入 Ledger 帐户](/images/tokens/connect/ledger/ethereum/ledger-6.webp)

您可以随时在 MetaMask 中切换帐户，以查看其他导入的 Ledger 帐户的余额。

您现在已成功从 Ledger 设备导入了一个 Moonbeam 兼容帐户，现在可以开始与您的 Ledger 设备进行交互。

--8<-- 'zh/text/tokens/connect/ledger/receive-tokens.md'

![MetaMask 复制帐户](/images/tokens/connect/ledger/ethereum/ledger-7.webp)

接下来，您需要获得一些 GLMR、MOVR 或 DEV 代币，并使用您刚刚复制的地址，将代币发送到您的帐户。交易成功完成后，您将看到您的余额更新。

--8<-- 'zh/text/_common/faucet/faucet-sentence.md'

## 发送 Token {: #send-tokens }

接下来是在 Moonbeam 上使用 Ledger 设备发送和签署交易。要开始发送交易，请点击**发送**按钮：

![MetaMask Ledger 帐户已充值](/images/tokens/connect/ledger/ethereum/ledger-8.webp)

--8<-- 'zh/text/tokens/connect/ledger/send-tokens/set-of-steps-1.md'
4. 检查网络的链 ID。此信息确认 MetaMask 连接到哪个网络。对于 Moonbeam，链 ID 为 1284（十六进制：0x504），Moonriver 为 1285（十六进制：0x505），Moonbase Alpha 为 1287（十六进制：0x507）。准备就绪后，进入下一个屏幕
5. 检查适用于此交易的最高费用。这是您在 MetaMask 上设置的 Gas 价格乘以 Gas 限制。准备就绪后，进入下一个屏幕
6. 如果您同意所有交易详情，请批准它。这将签署交易，并触发 MetaMask 发送它。如果您不同意所有交易详情，请拒绝它。这将取消交易，MetaMask 会将其标记为失败

![MetaMask Ledger 交易向导](/images/tokens/connect/ledger/ethereum/ledger-9.webp)

在您批准交易后，MetaMask 会将其发送到网络。交易确认后，它将在 MetaMask 的**活动**选项卡上显示为**发送**。

![MetaMask Ledger 交易向导](/images/tokens/connect/ledger/ethereum/ledger-10.webp)

就这样！您已经使用 Ledger 硬件钱包在 Moonbeam 上签署了一笔交易并发送了一些 Token！

--8<-- 'zh/text/tokens/connect/ledger/blind-signing.md'

![MetaMask Ledger 允许合约交易](/images/tokens/connect/ledger/ethereum/ledger-11.webp)

--8<-- 'zh/text/tokens/connect/ledger/ledger-live.md'

--8<-- 'zh/text/_disclaimers/third-party-content.md'
