---
title: 如何使用 Polkadot.js 应用
description: 按照这个快速教程学习如何使用 Moonbeam 的以太坊风格 H160 地址，并使用 Polkadot.js 应用发送交易。
categories: 代币和账户, 以太坊工具包
---

# 如何使用 Polkadot.js Apps 与 Moonbeam 互动

## 介绍 {: #introduction }

作为 Polkadot 平行链，Moonbeam 使用[统一账户结构](/learn/core-concepts/unified-accounts/){target=_blank}，允许您通过一个以太坊样式的地址与 Substrate (Polkadot) 功能和 Moonbeam 的 EVM 进行交互。这种统一的账户结构意味着您无需同时维护 Substrate 和以太坊账户即可与 Moonbeam 进行交互，而是可以使用一个以太坊私钥来完成所有操作。

Polkadot.js Apps 界面原生支持 H160 地址和 ECDSA 密钥。因此，在本教程中，您可以查看以太坊账户在 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=_blank} 上的集成。

--8<-- 'text/_disclaimers/third-party-content-intro.md'

!!! note
    Polkadot.js Apps 正在逐步淘汰对存储在浏览器缓存中的本地账户的支持。建议您使用像 [Talisman 这样的浏览器扩展将您的账户注入到 Polkadot.js Apps 中](/tokens/connect/talisman/){target=_blank}。

## 将 Polkadot.js 应用程序连接到 Moonbeam {: #connect-polkadotjs-apps }

首次启动 [Polkadot.js 应用程序](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=_blank} 时，您可能已连接到所需的网络，也可能未连接。

您可以通过单击左上角的徽标来更改所选网络，您将在其中找到按主网、测试网和本地网络组织的列表。每个网络都可以在以下部分找到：

|          网络          |        部分        |
|:-------------------------:|:---------------------:|
|          Moonbeam         | Polkadot & Parachains |
|         Moonriver         |  Kusama & Parachains  |
|       Moonbase Alpha      |     测试网络     |
| Moonbeam 开发节点 |      开发      |

选择正确的网络后，您可以滚动回顶部并单击 **切换**。

![连接到 Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-1.webp)

切换后，Polkadot.js 网站不仅会连接到所选网络，而且每个网络的徽标和样式也会发生变化。

![连接到 Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-2.webp)

## 在 Polkadot.js Apps 中创建或导入 H160 帐户 {: #creating-or-importing-an-h160-account }

!!! note
    出于安全考虑，建议不要将密钥存储在本地浏览器中。更安全的方法是使用浏览器扩展程序，如 [Talisman，将您的帐户注入到 Polkadot.js Apps 中](/tokens/connect/talisman/){target=_blank}。

在本节中，您将学习如何创建新帐户或将现有的 MetaMask 帐户导入到 Polkadot.js Apps 中。首先，需要一个先决步骤。作为逐步淘汰对本地存储在浏览器缓存中的帐户的支持的一部分，您需要在“**设置**”选项卡中启用对帐户本地存储的支持。为此，请按照以下步骤操作：

1. 导航到“**设置**”选项卡
2. 在“**浏览器内帐户创建**”标题下，选择“**允许本地浏览器内帐户存储**”
3. 点击“**保存**”

![允许本地浏览器内帐户存储](/images/tokens/connect/polkadotjs/polkadotjs-3.webp)

现在，您可以返回 [Polkadot.js Apps 的帐户页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/accounts){target=_blank} 并继续执行以下步骤：

1. 导航到“**帐户**”部分
2. 点击“**添加帐户**”按钮

![连接到 Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-4.webp)

这将打开一个向导弹出窗口，指导您完成将帐户添加到 Polkadot.js Apps 界面的过程：

1. 点击下拉菜单
2. 将选择从“**助记词**”更改为“**私钥**”，这允许您通过私钥添加帐户

!!! note
    目前，您只能通过私钥在 Polkadot.js 中创建或导入帐户。如果稍后尝试将此帐户导入到以太坊钱包（如 MetaMask），则使用助记词执行此操作将导致不同的公共地址。这是因为 Polkadot.js 使用 BIP39，而以太坊使用 BIP32 或 BIP44。

![连接到 Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-5.webp)

接下来，如果要创建新帐户，请确保存储向导显示的私钥。如果要导入现有帐户，请输入您可以从 MetaMask 导出的私钥。

!!! note
    切勿泄露您的私钥，因为它们可以直接访问您的资金。本指南中的步骤仅用于演示目的。

确保在私钥中包含前缀，即 `0x`。如果输入的信息正确，则相应的公共地址应出现在窗口的左上角，然后点击“**下一步**”。

![连接到 Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-6.webp)

要完成向导，您可以设置帐户名称和密码。收到确认消息后，您应该在主“**帐户**”选项卡中看到具有相应余额的地址：在本例中，是 Bob 的地址。此外，您可以覆盖 MetaMask 扩展程序，以查看两个余额是否相同。

![连接到 Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-7.webp)

## 通过 Substrate 的 API 发送交易 {: #sending-a-transaction-through-substrates-api }

现在，为了展示 Moonbeam 的[统一账户](/learn/core-concepts/unified-accounts/){target=_blank}方案的潜力，您可以使用 Polkadot.js Apps 通过 Substrate API 进行转账。请记住，您正在使用以太坊式 H160 地址与 Substrate 交互。为此，您可以导入另一个帐户。

接下来，点击 Bob 的**发送**按钮，这将打开另一个向导，引导您完成发送交易的流程。

1. 设置**发送至地址**
2. 输入要发送的**金额**，本例中为 1 DEV 代币
3. 准备就绪后，点击**进行转账**按钮

![连接到 Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-8.webp)

然后，系统会提示您输入密码并签名并提交交易。交易确认后，您应该会看到每个帐户的余额已更新。

![连接到 Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-9.webp)

就这样！我们很高兴能够在 Polkadot.js Apps 中支持 H160 账户，因为我们相信这将大大增强 Moonbeam 网络及其以太坊兼容功能的用户体验。

--8<-- 'text/_disclaimers/third-party-content.md'
