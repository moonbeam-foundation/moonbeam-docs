---
title: 如何连接和使用 Trezor
description: 了解如何将您的 Trezor 硬件钱包导入 MetaMask，以及如何使用您的 Trezor 在 Moonbeam 上签署交易。
categories: Tokens and Accounts
---

# 使用 Trezor 硬件钱包与 Moonbeam 交互

## 介绍 {: #introduction }

硬件钱包提供了一种更安全的加密货币存储方式，因为用于签署交易的私钥是离线存储的。在撰写本文时，Trezor 提供了两种硬件钱包解决方案：Trezor One 和 Trezor Model T。

由于 Moonbeam 与 Ethereum 完全兼容，您可以使用 Trezor 设备在 Moonbeam 上签署交易！

本教程向您展示如何在 Moonbase Alpha 上开始使用 Trezor 硬件钱包。本指南仅说明了 Trezor Model T 设备的步骤，但您也可以按照 Trezor One 的步骤进行操作。

请注意，您的 Trezor 设备将签署连接到 MetaMask 的任何网络中的交易。

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## 检查先决条件 {: #checking-prerequisites }

在开始之前，请将 [Trezor Suite](https://suite.trezor.io){target=_blank} 更新到可用的最新版本。另外，请确保您的 Trezor 硬件钱包正在运行最新的固件。Trezor wiki 提供了关于如何更新 [Trezor One](https://trezor.io/guides/trezor-suite/update-trezor-firmware){target=_blank} 和 [Trezor Model T](https://trezor.io/guides/trezor-suite/update-trezor-firmware){target=_blank} 设备固件的教程。

在撰写本文时，使用了以下版本：

 - Trezor Suite 21.5.1
 - Trezor One 固件 v1.10.0
 - Trezor Model T 固件 v2.4.0

此外，您需要 MetaMask 作为您的 Trezor 设备和 Moonbase Alpha 之间的媒介。请确保您的 MetaMask 已[连接到 Moonbase Alpha](/tokens/connect/metamask/){target=_blank}。请注意，您的 Trezor 设备将签署连接到 MetaMask 网络的交易。

## 将您的 Trezor 帐户导入 MetaMask {: #importing-your-trezor-account-to-metamask }

首先，您需要设置一个钱包（标准钱包或隐藏钱包）。连接您的 Trezor 设备、将其解锁并在 Trezor Suite 中设置一个钱包。接下来，要将您的 Trezor Ethereum 帐户导入 MetaMask，请执行以下步骤：

 1. 点击右上角的徽标以展开菜单
 2. 选择 **连接硬件钱包**

![MetaMask 连接硬件钱包](/images/tokens/connect/ledger/ethereum/ledger-2.webp)

之后，系统会提示您选择要在 MetaMask 中使用的硬件钱包。在撰写本文时，仅支持 Ledger 和 Trezor 硬件钱包。如果您已准备好 Trezor 设备，请执行以下步骤：

 1. 选择 Trezor 徽标
 2. 点击 **继续**

![MetaMask 选择 Trezor 硬件钱包](/images/tokens/connect/trezor/trezor-2.webp)

点击该按钮后，应会显示一个名为 **TrezorConnect** 的新选项卡，您需要在其中配对设备。如果您的 Trezor Suite 已打开并已连接设备，则不需要此操作。在这里，点击 **配对设备**。

![Trezor 硬件钱包连接配对设备](/images/tokens/connect/trezor/trezor-3.webp)

在下一个屏幕上，请执行以下步骤：

 1. 点击 **检查设备**。这将打开一个菜单，显示您要连接到哪个 Trezor 设备（如果有）
 2. 选择您要使用的 Trezor 设备
 3. 点击 **连接**

![Trezor 硬件钱包连接向导选择并连接设备](/images/tokens/connect/trezor/trezor-4.webp)

连接设备后，您需要允许 MetaMask 读取其公钥。因此，请点击 **允许本次会话一次**。或者，您也可以选中 **不再询问** 复选框。

![Trezor 硬件钱包连接向导允许读取公钥](/images/tokens/connect/trezor/trezor-5.webp)

接下来，系统会询问您是否要导出您的 Ethereum 帐户的公钥（选项卡被裁剪并在下图中标记为 1）。之后，系统会提示您选择是否使用 Trezor 的密码选项（选项卡被裁剪并在图像中标记为 2）。如果要使用默认钱包，只需点击 **进入**。否则，请参阅 [Trezor 关于密码钱包的指南文章](https://trezor.io/guides/backups-recovery/advanced-wallets/what-is-a-passphrase){target=_blank}。

![Trezor 硬件钱包连接向导允许导出和密码](/images/tokens/connect/trezor/trezor-6.webp)

如果 MetaMask 能够成功连接到您的 Trezor 设备，您应该会看到一个包含五个 Ethereum 样式帐户的列表。如果不是，请仔细检查您是否已将 Trezor 设备正确连接到计算机并已解锁。您也可以在打开 Trezor Suite 应用程序的情况下重复该过程。

从此包含五个 Ethereum 帐户的列表中，请执行以下步骤：

 1. 选择您要从 Trezor 设备导入的帐户
 2. 点击 **解锁**

![Trezor 选择要导入的 Ethereum 帐户](/images/tokens/connect/trezor/trezor-7.webp)

如果您已成功导入 Trezor Ethereum 样式帐户，您应该会在主 MetaMask 屏幕中看到它，如下图所示：

![MetaMask 成功导入 Trezor 帐户](/images/tokens/connect/trezor/trezor-8.webp)

您现在已成功从 Trezor 设备导入了与 Moonbeam 兼容的帐户，并且可以开始[使用您的硬件钱包签署交易](#signing-a-transaction-using-your-trezor)。

## 使用您的 Trezor 设备签署交易 {: #signing-a-transaction-using-your-trezor }

如果您已成功地[将您的 Trezor 帐户导入到 MetaMask](#importing-your-trezor-account-to-metamask)，您就可以使用您的 Trezor 设备在 Moonbeam 上签署交易。本教程将向您展示如何在 Moonbase Alpha 测试网上发送一个简单的交易，但它也适用于其他的 Moonbeam 生态系统网络。

首先，确保您的 Trezor 帐户已[充值 DEV 代币](/builders/get-started/networks/moonbase/#get-tokens){target=_blank}。接下来，点击 **发送** 按钮。

![MetaMask Trezor 帐户已充值](/images/tokens/connect/trezor/trezor-9.webp)

此时会弹出一个 `TrezorConnect` 标签页，请求允许从您的设备读取公钥，并准备您的 Trezor 设备以进行交易和数据签名。准备就绪后，点击 **允许本次会话**。您也可以选择勾选 **不再询问** 复选框。

![Trezor 硬件钱包允许读取公钥和签名](/images/tokens/connect/trezor/trezor-10.webp)

与标准交易一样，设置接收者地址，输入要发送的代币数量，检查交易的详情并确认。这将启动您 Trezor 设备中的交易签名向导。在此，请按照以下步骤操作：

 1. 检查所有交易详情。请注意，该代币与 MetaMask 连接的网络相对应。**在这种情况下，它是 DEV 代币而不是 UNKN！**
 2. 检查完所有详情后，按住按钮确认

!!! note
    在撰写本文时，所有 Moonbeam 相关网络的代币名称始终显示为 `UNKN`。请注意，正在处理的代币是与 MetaMask 连接的网络相对应的代币。

![Trezor 硬件钱包签署交易](/images/tokens/connect/trezor/trezor-11.webp)

在您批准交易后，MetaMask 会立即将其发送到网络。一旦交易被确认，它将在 MetaMask 的主屏幕上显示为 **发送**。

![MetaMask Trezor 交易向导](/images/tokens/connect/trezor/trezor-12.webp)

就这样！您已经使用您的 Trezor 硬件钱包在 Moonbase Alpha 上签署了一笔交易。

使用您的 Trezor 设备与智能合约交互的过程类似。在确认交易之前，请务必仔细检查您 Trezor 设备上正在签名的数据。

--8<-- 'text/_disclaimers/third-party-content.md'
