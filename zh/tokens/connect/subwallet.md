---
title: 如何将 SubWallet 连接到 Moonbeam
description: 本指南将引导您了解如何将 SubWallet（一款综合性的 Polkadot、Substrate 和 Ethereum 钱包）连接到 Moonbeam。
categories: Tokens and Accounts, Ethereum Toolkit
---

# 使用 SubWallet 与 Moonbeam 交互

## 介绍 {: #introduction }

Moonbeam 的开发者和用户在钱包方面有多种选择。得益于 Moonbeam 完美的以太坊兼容性，Moonbeam 支持各种流行的钱包，包括 [SubWallet](https://www.subwallet.app){target=\_blank}。

SubWallet 是一款综合性的 Web3 钱包，原生支持 Substrate 和以太坊账户。虽然 Moonbeam 是一个基于 Substrate 的区块链，但它有一个 [统一账户系统](/learn/core-concepts/unified-accounts/){target=\_blank}，该系统用以太坊风格的账户和密钥取代了默认的 Substrate 风格的账户和密钥。由于 SubWallet 支持以太坊风格的账户，您可以使用 SubWallet 与您的 Moonbeam 账户进行交互。

本指南将带您完成所有必要的步骤，从安装 SubWallet 到设置钱包、将其连接到 Moonbeam 以及发送资金。

--8<-- 'zh/text/_disclaimers/third-party-content-intro.md'

## 安装 SubWallet {: #install-subwallet }

您可以通过几种方式与 SubWallet 进行交互：它有**浏览器扩展、移动应用程序和可从 Web 访问的仪表板**。

您可以访问 [SubWallet 的下载页面](https://www.subwallet.app/download.html){target=\_blank} 并下载适合您平台的 SubWallet 来开始使用。

如果您选择使用可从 Web 访问的仪表板，则无需下载任何内容。您可以在 [web.subwallet.app](https://web.subwallet.app/welcome){target=\_blank} 访问该仪表板。

移动应用程序、浏览器扩展和 Web 仪表板的界面非常相似，因此您可以调整以下说明（重点介绍浏览器扩展）以适用于移动应用程序和 Web 仪表板。

## 设置钱包 {: #setup-a-wallet }

下载 SubWallet 浏览器扩展程序后，系统会提示您设置钱包。您可以从以下选项中进行选择：

- **创建新帐户** - 允许您通过创建密码和生成种子词来创建一个全新的帐户
- **导入帐户** - 允许您使用种子词、JSON 文件、私钥或通过二维码导入现有帐户
- **附加帐户** - 允许您在没有私钥的情况下连接到帐户。您可以使用此方法连接到冷存储钱包（如 Keystone）或仅查看帐户。使用仅查看帐户，您将无法转移资金或与您的帐户互动；您只能查看帐户余额

    !!! note
        浏览器扩展程序支持 Ledger，但移动应用程序尚不支持。移动应用程序对 Ledger 的支持即将推出！

- **连接钱包** - *仅在 Web 仪表板上可用* - 允许您连接到浏览器扩展程序钱包。您可以使用此方法轻松连接到您使用 SubWallet 浏览器扩展程序或另一个钱包（如 MetaMask）创建的帐户

以下部分将提供有关使用 SubWallet [创建新帐户](#create-a-new-account) 和 [导入现有帐户](#import-an-account) 的分步说明。

如果您要附加帐户，您可以在 [SubWallet 的帐户管理文档](https://docs.subwallet.app/main/extension-user-guide/account-management){target=\_blank} 中找到分步说明。同样，如果您要在 Web 仪表板上连接钱包，您可以在 [SubWallet 的连接扩展程序文档](https://docs.subwallet.app/main/web-dashboard-user-guide/account-management/connect-extension){target=\_blank} 中找到说明。

### 创建新账户 {: #create-a-new-account }

创建一个新账户将生成一个助记词，可以从中派生多个以太坊和 Substrate 账户。默认情况下，SubWallet 将生成一个以太坊账户和一个 Substrate 账户，但您可以轻松地从同一个助记词派生更多账户。要与 Moonbeam 互动，您需要使用以太坊账户。点击**创建新账户**开始。

![SubWallet 浏览器扩展程序的主屏幕。](/images/tokens/connect/subwallet/subwallet-1.webp)

在接下来的屏幕上，系统将提示您创建一个密码来保护您的新钱包：

1. 输入一个至少包含 8 个字符的密码
2. 再次输入密码以确认
3. 点击**继续**

![SubWallet 浏览器扩展程序上的创建密码屏幕。](/images/tokens/connect/subwallet/subwallet-2.webp)

然后，系统会提示您备份您的助记词。这是非常重要的一步，特别是考虑到您可以稍后从此助记词派生其他账户。

1. 查看您的助记词并将其保存在安全的地方

    !!! remember
        您永远不应与任何人分享您的助记词（助记符）或私钥。这会使他们可以直接访问您的资金。本指南仅用于教育目的。

2. 安全存储您的助记词后，点击**我已经把它保存在安全的地方**

![在 SubWallet 浏览器扩展程序上备份您的助记词。](/images/tokens/connect/subwallet/subwallet-3.webp)

!!! note
    如果您在移动应用程序上创建新帐户，则必须重新输入您的助记词以验证您是否已存储它。这些词必须按正确的顺序输入。

创建密码并保存助记词后，您将连接到您的帐户。您可以随时[添加其他账户](#add-additional-accounts)。

### 导入账户 {: #import-an-account }

要将现有帐户导入 SubWallet，您可以选择**导入帐户**。

![SubWallet 浏览器扩展的主屏幕。](/images/tokens/connect/subwallet/subwallet-4.webp)

在随后的屏幕上，选择您希望导入现有帐户的方式。您可以选择**从助记词导入**、**从 Polkadot.{js} 导入**、**通过 MetaMask 私钥导入**和**通过二维码导入**。

如果您选择**从助记词导入**，从助记词导入帐户时可能会出现一些不兼容问题。例如，Trust Wallet 和 SafePal 是与 SubWallet 不兼容的钱包。如果您遇到不兼容问题，SubWallet 建议创建一个新钱包。

如果您选择**从 Polkadot.{js} 导入**，您需要确保该帐户是在 Polkadot.js 中通过私钥创建的。如果它是用助记词创建的，并且您尝试将其导入到 SubWallet，则将使用不同的公共地址。这是因为 Polkadot.js 使用 [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki){target=\_blank}，而 Ethereum 使用 [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki){target=\_blank} 或 [BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki){target=\_blank}。

![从 SubWallet 浏览器扩展的“导入帐户”屏幕中选择导入选项。](/images/tokens/connect/subwallet/subwallet-5.webp)

如果您通过助记词导入您的帐户，您可以选择您的帐户类型为 Substrate (Polkadot) 或 EVM (Ethereum)，或两者兼有。Moonbeam 使用 Ethereum 样式的帐户，因此您需要选择 **Ethereum** 来导入基于 Moonbeam 的网络的帐户。

![在 SubWallet 浏览器扩展上选择要导入的帐户类型。](/images/tokens/connect/subwallet/subwallet-6.webp)

完成导入过程后，系统将提示您输入密码以保护您的新钱包：

1. 输入至少包含 8 个字符的密码
2. 再次输入密码以确认它
3. 点击“继续”

![SubWallet 浏览器扩展上的创建密码屏幕。](/images/tokens/connect/subwallet/subwallet-7.webp)

接下来，您将能够提供相关的助记词、私钥、JSON 文件或二维码，您可以立即开始使用您的新帐户。您可以随时添加[其他帐户](#add-additional-accounts)。

### 添加其他帐户 {: #add-additional-accounts }

在您创建新帐户或将现有帐户导入 SubWallet 后，您可以按照以下步骤添加其他帐户：

1. 点击帐户下拉菜单
2. 从屏幕底部选择一个选项。您可以点击**创建新帐户**，点击导入按钮导入现有帐户，或点击附加按钮附加到现有冷存储钱包或仅查看帐户

![查看帐户详细信息并创建新帐户、导入帐户或附加帐户。](/images/tokens/connect/subwallet/subwallet-8.webp)

如果您要创建新帐户，则可以选择**使用新种子短语创建**或**从现有帐户派生**。如果您要使用新的种子短语创建新帐户，则需要选择帐户类型并备份帐户，类似于[创建新帐户](#create-a-new-account)部分中的说明。如果您选择派生新帐户，系统将提示您选择要从中派生帐户的现有帐户。

如果您要导入新帐户，则需要选择是使用种子短语、JSON 文件、MetaMask 私钥还是二维码导入，然后重复[导入帐户](#import-an-account)部分中概述的过程。

如果要附加帐户，您可以在 [SubWallet 的帐户管理文档](https://docs.subwallet.app/main/extension-user-guide/account-management){target=\_blank}上找到分步说明。

## 将 SubWallet 连接到 Moonbeam {: #connect-subwallet-to-moonbeam }

要为 Moonbeam 配置 SubWallet，请选择**搜索令牌**图标旁边的**自定义你的资产显示**图标。

![SubWallet 浏览器扩展上的令牌屏幕。](/images/tokens/connect/subwallet/subwallet-9.webp)

要添加 Moonbeam，你可以：

1. 搜索“Moon”以查看所有基于 Moonbeam 的网络，或搜索特定网络
2. 切换开关以连接到网络

![SubWallet 浏览器扩展上的自定义资产显示屏幕。](/images/tokens/connect/subwallet/subwallet-10.webp)

如果你尝试连接[本地的 Moonbeam 开发节点](/builders/get-started/networks/moonbeam-dev/){target=\_blank}，可以点击左上角的汉堡菜单（三横线菜单），进入设置页面。

![SubWallet 浏览器扩展上的令牌屏幕。](/images/tokens/connect/subwallet/subwallet-11.webp)

从设置菜单中，单击**管理网络**。

![SubWallet 浏览器扩展上的设置屏幕。](/images/tokens/connect/subwallet/subwallet-12.webp)

单击右上角的 **+** 图标，然后输入[网络配置](/builders/get-started/quick-start/#network-configurations){target=\_blank}。你还可以从此菜单管理和连接到其他网络。

![SubWallet 浏览器扩展上的令牌屏幕。](/images/tokens/connect/subwallet/subwallet-13.webp)

默认情况下，所有余额在 SubWallet 中都是隐藏的，但是如果按下**显示余额**图标，则可以切换余额可见性。

![SubWallet 浏览器扩展上的令牌屏幕。](/images/tokens/connect/subwallet/subwallet-14.webp)

## 与网络互动 {: #interact-with-the-network }

一旦您将 [SubWallet 连接](#connect-subwallet-to-moonbeam) 到任何基于 Moonbeam 的网络，您就可以开始使用您的钱包，方式包括：

- 从另一个地址接收代币
- 向另一个地址发送代币
- 将代币添加到 SubWallet 并与之互动

### 接收代币 {: #receive-a-token }

要从另一个账户接收代币，您需要向交易方展示您的钱包地址，他们可以将资产发送到该地址。

要复制您的地址，请点击**获取地址**图标。

![SubWallet 浏览器扩展上的代币界面。](/images/tokens/connect/subwallet/subwallet-15.webp)

如果您有多个帐户，并且从帐户下拉菜单中选择了**所有帐户**，则需要选择要将资产发送到的接收帐户。否则，请确保您连接的帐户（显示在屏幕顶部）是您要将资产发送到的帐户。**这应该是您的 Moonbeam 帐户，它是一个以太坊风格的地址。**

![在 SubWallet 浏览器扩展上选择一个帐户来接收代币。](/images/tokens/connect/subwallet/subwallet-16.webp)

接下来，您可以搜索并选择您想要接收的代币。在本例中，选择的是 DEV。

![在 SubWallet 浏览器扩展上搜索并选择所需的代币。](/images/tokens/connect/subwallet/subwallet-17.webp)

!!! note
    SubWallet 支持接收跨链代币，所以请务必检查代币名称下的链标志是否与您想要的链匹配。

您将看到与您的帐户关联的二维码和地址。**仔细检查显示的地址是否为以太坊风格的帐户**。

![用于在 SubWallet 浏览器扩展上接收代币的二维码和地址。](/images/tokens/connect/subwallet/subwallet-18.webp)

现在您只需要向发送者展示二维码或地址即可。

### 发送交易 {: #send-a-transaction }

要开始将一个简单的 Token 转移到 Moonbeam 上的另一个地址，您可以点击**发送**图标。

![SubWallet 浏览器扩展上的 Token 屏幕。](/images/tokens/connect/subwallet/subwallet-19.webp)

接下来，您可以按照以下步骤操作：

1. 指定要发送的资产和目标链

    !!! note
        某些 Token 允许跨链转移，因此在选择目标网络时，您可以选择下拉菜单以查看可用选项。

2. 输入目标地址，也可以使用地址簿或扫描收款人的二维码来完成

    !!! note
        如果您使用的是移动应用程序，请点击**下一步**继续。

3. 输入要发送的 Token 数量
4. 查看交易详情，然后按**转移**

![SubWallet 浏览器扩展上的转移屏幕，您可以在其中输入交易详情。](/images/tokens/connect/subwallet/subwallet-20.webp)

在下一个屏幕上，您将能够查看交易详情并提交交易。如果交易详情看起来没问题，您可以点击**批准**以发送交易。

![SubWallet 浏览器扩展上的转移确认屏幕。](/images/tokens/connect/subwallet/subwallet-21.webp)

发送交易后，您将能够查看交易详情。

就这样！有关如何使用 SubWallet 的更多信息，请参阅 [SubWallet 的文档](https://docs.subwallet.app/main){target=\_blank}。

--8<-- 'zh/text/_disclaimers/third-party-content.md'
