---
title: 将 Talisman 与 Polkadot JS Apps 搭配使用
description: 按照本快速教程学习如何使用 Moonbeam 的以太坊风格 H160 地址，并使用 Polkadot.js Apps 和 Talisman 发送交易。
categories: Tokens and Accounts, Ethereum Toolkit
---

# 使用 Talisman 与 Moonbeam 交互

## 简介 {: #introduction }

作为 Polkadot 平行链，Moonbeam 使用[统一账户结构](/learn/core-concepts/unified-accounts/){target=_blank}，允许您通过单个以太坊风格的地址与 Substrate (Polkadot) 功能和 Moonbeam 的 EVM 进行交互。这种统一账户结构意味着您无需维护 Substrate 和以太坊账户即可与 Moonbeam 进行交互 - 相反，您可以使用单个以太坊私钥完成所有操作。

[Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=_blank} 支持通过 [Talisman](https://talisman.xyz){target=_blank} 等扩展程序注入到浏览器中的 H160 账户。请注意，Polkadot.js Apps 正在逐步淘汰对[本地存储在浏览器缓存中的账户](/tokens/connect/polkadotjs/)的支持。虽然您可以继续使用您通过 Polkadot.js Apps 导入并本地存储在浏览器中的任何帐户，但您将无法添加任何新帐户。这意味着您需要使用像 Talisman 这样的扩展程序。此外，通常认为从像 Talisman 这样的扩展程序注入您的帐户比直接将帐户存储在浏览器中更安全。

本指南将包括在 Talisman 中设置帐户并使用它通过 Polkadot.js Apps 与 Moonbeam 交互的所有步骤。

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## 设置 Talisman {: #setting-up-talisman }

Talisman 是一个原生支持 Substrate (Polkadot) 和 Ethereum 账户的加密钱包。Talisman 钱包浏览器扩展程序可在 [Google Chrome](https://chromewebstore.google.com/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld){target=_blank} 和 [Brave](https://chromewebstore.google.com/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld){target=_blank} 上使用，相应的资产仪表板可在 [app.talisman.xyz](https://app.talisman.xyz){target=_blank} 访问

首先，下载并安装 [Talisman 扩展程序](https://talisman.xyz){target=_blank}。扩展程序打开后，系统会提示您创建新钱包或导入现有钱包。就本演示而言，您将创建一个新钱包。在以下屏幕上，系统将提示您创建一个密码来保护新钱包。

![在 Talisman 中创建新钱包或导入现有钱包。](/images/tokens/connect/talisman/talisman-1.webp)

!!! 请记住
    Talisman 不需要您备份助记词，但会在屏幕底部提醒您。如果您不备份助记词，您可能会丢失所有资产。

要备份您新创建的钱包，请按照以下步骤操作：

1. 按 **立即备份**
2. 输入您的 Talisman 钱包的密码
3. 按 **查看恢复短语** 并将其存储在安全的地方

![备份您的 Talisman 恢复短语。](/images/tokens/connect/talisman/talisman-2.webp)

## 设置 Talisman 以连接到测试网 {: #setting-up-talisman-to-connect-to-testnets }

Talisman 可以在您[启用以太坊账户后](#connecting-talisman-to-moonbase-alpha-polkadot.js-apps)与所有 Moonbeam 网络配合使用。您还可以通过点击扩展程序左上角的 Talisman 徽标，在**投资组合**选项卡中查看所有网络中的余额。默认情况下，Talisman 会隐藏您的测试网帐户余额。但是，您可以通过以下步骤进行更改：

1. 打开 Talisman 扩展程序，然后点击 Talisman 徽标
2. 选择**设置**
3. 选择**以太坊网络**
4. 点击**启用测试网**

![在 Talisman 中查看 Moonbase Alpha 测试网帐户余额。](/images/tokens/connect/talisman/talisman-3.webp)

## 将 Talisman 连接到 Moonbeam 和 Polkadot.js 应用 {: #connecting-talisman-to-moonbase-alpha-polkadot.js-apps }

将 Talisman 连接到 Polkadot.js 应用中基于 Moonbeam 的网络非常简单。请记住，如果您想连接到 Moonbase Alpha，您需要[启用测试网](#setting-up-talisman-to-connect-to-testnets)。

要连接到基于 Moonbeam 的网络，在本例中为 Moonbase Alpha 测试网，请前往 [Moonbase Alpha Polkadot.js 应用](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=_blank}。Talisman 扩展程序将提示您选择要与 Polkadot.js 应用一起使用的帐户。如果它没有自动弹出，您可以打开 Talisman 扩展程序并按顶部的**已连接/未连接**按钮。要配置 Talisman 以在 Polkadot.js 应用上与 Moonbeam 网络正确交互，您应该执行以下步骤：

1. 选中 **显示以太坊帐户** 旁边的框
2. 选择您要连接到 Polkadot.js 应用的帐户。在本示例中，它只是**我的以太坊帐户**。这是 Talisman 分配的默认名称，您可以根据需要重命名
3. 按**连接 1**。该值将根据您连接的帐户数量而变化

![在 Talisman 中启用以太坊/Moonbeam 帐户。](/images/tokens/connect/talisman/talisman-4.webp)

您的 Talisman 钱包现已连接到 Polkadot.js 应用。刷新 Polkadot.js 应用后，您应该在 [Polkadot.js 应用的帐户页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=_blank} 中看到您的 Talisman 帐户。首次启动 [Polkadot.js 应用](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=_blank} 时，您可能已连接到所需的网络，也可能未连接。您可以通过单击左上角的徽标，然后向下滚动到**测试网络**部分，选择 Moonbase Alpha，然后滚动回顶部并单击**切换**，将所选网络更改为 Moonbase Alpha TestNet。

![连接到 Polkadot.js 应用。](/images/tokens/connect/talisman/talisman-5.webp)

切换后，Polkadot.js 网站不仅会连接到 Moonbase Alpha，还会更改其样式以完美匹配。

![在 Polkadot.js 应用中切换到 Moonbase Alpha。](/images/tokens/connect/talisman/talisman-6.webp)

## 向 Talisman 添加新帐户 {: #adding-a-new-account-to-talisman }

在本节中，您将学习如何创建新帐户，或将已有的 MetaMask 帐户导入到 Polkadot.js Apps 中。

1. 打开 Talisman 扩展程序，然后单击左上角的 Talisman 徽标
2. 选择 **添加帐户**
3. 选择 **新建帐户**
4. 选择 **Ethereum** 作为帐户类型
5. 为您的新帐户命名
6. 按 **创建**

![在 Talisman 中创建一个新的 Moonbeam 帐户。](/images/tokens/connect/talisman/talisman-7.webp)

虽然我们的新帐户已成功创建，但 Polkadot.js Apps 尚未意识到这一点。 要将新帐户连接到 Polkadot.js Apps，请按照 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=_blank} 中的以下步骤操作：

1. 打开 Talisman 扩展程序，然后按 **已连接/未连接** 按钮
2. 确保已选中 **显示 Eth 帐户**
3. 单击您要连接的帐户。 如果选中该帐户，则该帐户旁边的绿点将亮起

![将 Talisman 帐户连接到 Polkadot.js Apps。](/images/tokens/connect/talisman/talisman-8.webp)

## 通过 Substrate 的 API 发送交易 {: #sending-a-transaction-through-substrates-api }

现在，为了展示 Moonbeam 的[统一账户](/learn/core-concepts/unified-accounts/){target=\_blank}方案的潜力，您可以使用 Polkadot.js Apps 通过 Substrate API 进行转账。请记住，您正在使用以太坊风格的 H160 地址与 Substrate 进行交互。为此，您可以[添加另一个账户](#adding-a-new-account-to-talisman)。在 Talisman 中，账户已重命名为熟悉的 Alice 和 Bob 账户。要将一些 DEV 资金从 Alice 发送到 Bob，请按照以下步骤操作：

点击 Alice 的**发送**按钮，这将打开另一个向导，指导您完成发送交易的过程。

1. 设置**发送到地址**
2. 输入要发送的**金额**，在本例中为 4 个 DEV 代币
3. 准备就绪后，点击**进行转账**按钮
4. 在 Talisman 弹窗中批准交易

![通过 Talisman 使用 Substrate API 发送 Moonbeam 交易。](/images/tokens/connect/talisman/talisman-9.webp)

交易确认后，您应该会看到每个账户的余额已更新。

![您可以在成功交易后在 Polkadot.js Apps 中看到您的余额已更新。](/images/tokens/connect/talisman/talisman-10.webp)

就这样！这些步骤演示了在 Polkadot.js Apps 中使用 Talisman 与注入的 H160 账户进行交互的简易性和强大的安全性。所有这些都得益于 Moonbeam 的统一账户结构，这是 Moonbeam 致力于提供最佳用户体验的绝佳示例。

--8<-- 'text/_disclaimers/third-party-content.md'
