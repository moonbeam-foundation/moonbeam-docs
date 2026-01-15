---
title: 在 Moonscan 上添加 Token 信息
description: 为部署到基于 Moonbeam 的网络的 ERC-20、ERC-721 和 ERC-1155 Token 在 Moonscan 上添加 Token 信息并创建 Token 档案。
categories: Tokens and Accounts, Ethereum Toolkit
---

# 在 Moonscan 上添加代币信息

## 简介 {: #introduction }

本教程将指导您完成将您的 ERC-20、ERC-721 或 ERC-1155 代币的个人资料添加到 [Moonscan](https://moonscan.io){target=_blank} 的过程。

​​Moonscan 是一个与 EVM 兼容的区块链浏览器和分析平台。它是 Moonbeam 和 Etherscan 的集成，它允许用户和开发人员访问开发工具和网络统计信息，这些信息提供了对 Moonriver 和 Moonbeam 的 EVM 的精细洞察。

开发人员可以在 Moonriver 和 Moonbeam 上为他们的代币创建个人资料。该个人资料捕获有关代币背后的项目、社交媒体链接、价格数据链接以及与项目代币销售相关的其他基本信息。

![代币示例](/images/builders/get-started/token-profile/profile-1.webp)

本教程将向您展示如何在 Moonscan 上创建一个示例 ERC-20 代币（名为 DemoToken (DEMO)）的个人资料，该代币已部署到 Moonriver。这些说明可以适用于任何基于 Moonbeam 的网络，以及 ERC-721 或 ERC-1155 代币。

## 检查先决条件 {: #checking-prerequisites }

要学习本教程，您需要具备以下条件：

- 一个 [Moonscan 帐户](https://moonscan.io/register){target=_blank}

在本指南的后面，您需要验证代币合约地址的所有权。您可以手动或自动执行此操作，但如果您选择自动执行，您还需要以下内容：

- 访问部署代币合约的帐户，以便您可以作为所有者签署消息
- MetaMask 已安装并连接到代币部署到的网络

## 入门 {: #getting-started }

首先，您需要确保已登录到您的 Moonscan 帐户。登录帐户后，您可以转到要为其添加配置文件的令牌的令牌页面。对于 ERC-20，您可以在搜索栏中搜索令牌的名称。或者，对于任何令牌，您可以手动输入 URL。

===

    text
    https://moonscan.io/token/INSERT_CONTRACT_ADDRESS
    

===

    text
    https://moonriver.moonscan.io/token/INSERT_CONTRACT_ADDRESS 
    

===

    text
    https://moonbase.moonscan.io/token/INSERT_CONTRACT_ADDRESS
    

在“社交资料”旁边，您可以单击**更新**。

![更新令牌](/images/builders/get-started/token-profile/profile-2.webp)

您将被转到**令牌更新申请表**。

如果您尚未验证您的合约源代码，您需要先这样做，然后才能继续下一步。如果您已经验证了您的合约，您可以跳到 [验证地址所有权](#verifying-address-ownership) 部分。

## 验证合约源代码 {: #verifying-contract-source-code }

您可以通过几种方式验证您的合约源代码。您可以直接从 Moonscan 验证，或者如果您使用 Hardhat 或 Foundry 开发合约，您也可以使用它们对应的 [Etherscan 集成](/builders/ethereum/verify-contracts/etherscan-plugins/){target=_blank}。

要直接从 Moonscan 验证您的合约源代码，您可以点击**工具**链接。

![Token update application form](/images/builders/get-started/token-profile/profile-3.webp)

您将被带到**验证并发布合约源代码**页面，您可以在其中输入有关合约及其编译方式的详细信息。

1. 输入代币合约地址
2. 从下拉列表中选择**编译器类型**
3. 选择您使用的**编译版本**
4. 然后选择一个**开源许可证类型**
5. 查看并点击**我同意服务条款**复选框
6. 点击**继续**

![Verify & publish contract - page 1](/images/builders/get-started/token-profile/profile-4.webp)

您将被带到下一页，您可以在其中输入合约源代码并指定使用的其他设置和参数。

1. 合约地址和编译器应已填写完毕。如果启用了优化，您可以更新**优化**下拉列表
2. 输入合约源代码的扁平化版本。要展平合约，您可以使用 Flattener Remix 插件
3. 如果需要，更新**构造函数参数**、**合约库地址**和**其他设置**部分
4. 点击**我不是机器人**
5. 最后，点击**验证并发布**

![Verify & publish contract - page 2](/images/builders/get-started/token-profile/profile-5.webp)

现在您的合约源代码已通过验证，您可以继续下一步，验证您是否是合约地址所有者。

## 验证地址所有权 {: #verifying-address-ownership }

在**Token Update Application Form**页面，您应该在屏幕顶部看到一条消息，指出您需要验证合约地址所有者。要开始此过程，您可以单击**tool**链接。

![Token update application form](/images/builders/get-started/token-profile/profile-6.webp)

您将被带到**Verify Address Ownership**页面，您可以在该页面上手动签署消息以验证您的所有权，或者通过连接到Web3来验证。 如果您希望手动验证所有权，则需要消息签名哈希。 否则，如果您连接到Web3，系统将为您计算哈希值。

![Verify address ownership](/images/builders/get-started/token-profile/profile-7.webp)

### 手动签署消息 {: #sign-message-manually }

如果您希望手动验证所有权，您需要消息签名哈希。如果您已经自己计算了哈希值，您可以点击**手动签署消息**，输入**消息签名哈希**，然后点击**验证所有权**。

![手动验证地址所有权](/images/builders/get-started/token-profile/profile-8.webp)

### 连接到 Web3 {: #connect-to-web3 }

您可以使用 MetaMask 轻松计算消息签名哈希。您需要将部署合约的帐户加载到 MetaMask 中。然后，您可以单击**连接到 Web3**，MetaMask 将会弹出。

1. 选择要连接的帐户，该帐户应该是您用于部署合约的帐户
2. 连接到该帐户

![连接 MetaMask 帐户](/images/builders/get-started/token-profile/profile-9.webp)

返回到**验证地址所有权**页面，您可以采取以下步骤

1. 单击**使用 Web3 签名**
2. MetaMask 将会弹出，您可以**签名**消息

![在 MetaMask 上签署消息以验证地址所有权](/images/builders/get-started/token-profile/profile-10.webp)

签署消息后，您可以单击**单击以继续**。现在您应该看到**消息签名哈希**已自动为您填充。您只需单击**验证所有权**。

![验证地址所有权提交](/images/builders/get-started/token-profile/profile-11.webp)

## 创建配置文件 {: #creating-the-profile }

现在您可以开始填写必要的信息来构建代币配置文件，包括项目信息、社交媒体链接、价格数据链接等等。您应确保提供的所有链接在提交前均可正常访问且安全。

您至少需要填写以下信息：

- **请求类型**
- **代币合约地址**
- **请求者姓名**
- **请求者电子邮件地址**
- **官方项目网站**
- **官方项目电子邮件地址**
- **下载 32x32 png 图标徽标的链接**
- **项目描述**

所有其他字段都是可选的。填写完信息后，您可以点击页面底部的“**提交**”。

![创建代币配置文件](/images/builders/get-started/token-profile/profile-12.webp)

就这样！您已成功在 Moonscan 上创建并提交了代币的配置文件！Moonscan 团队将尽快审核您的提交，并在需要时为您提供进一步的说明。
