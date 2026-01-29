---
title: 使用 Tenderly 调试和模拟交易
description: 按照分步指南开始使用 Tenderly，包括使用调试器、分叉和模拟交易以及监控智能合约。
categories: 教程
---

# 使用 Tenderly 模拟和调试交易

## 简介 {: #introduction }

Tenderly 是一个适用于 EVM 网络的all-in-one开发平台，使 Web3 开发者能够构建、测试、监控和运营其智能合约。Tenderly 拥有一整套[产品](/builders/ethereum/dev-env/tenderly/)，可以在智能合约的整个生命周期中为您提供帮助，从最早的开发阶段到实时生产 dApp 的维护和警报。

Tenderly 提供的多数服务均可免费使用，但是您需要订阅付费计划才能使用高级功能，例如实时警报和作战室功能。Tenderly 支持 Moonbeam 和 Moonriver，但目前不支持 Moonbase Alpha。有关 Tenderly 产品的更多信息，请务必熟悉[Tenderly 简介](/builders/ethereum/dev-env/tenderly/)。

在本教程中，我们将探讨 Tenderly 的两个最强大的功能：调试器和模拟器。

## 检查必备条件 {: #checking-prerequisites }

要开始，您需要以下条件：

 - 拥有一个免费的 [Tenderly 帐户](https://dashboard.tenderly.co/register?utm_source=homepage){target=\_blank}。您不需要付费计划即可完成本教程

## 创建 Tenderly 项目 {: #create-a-tenderly-project }

即使不是严格要求，创建一个 Tenderly 项目来保持组织性并访问更多 Tenderly 的可用功能也是一个好主意。在**选择项目**下拉菜单下，您可以按**创建项目**或直接前往仪表板上的[创建项目](https://dashboard.tenderly.co/projects/create){target=\_blank}页面。

给您的项目命名，然后按**创建项目**。虽然您可以在稍后更改您的项目名称，但 URL 将保留您创建的原始名称。

![创建一个 Tenderly 账户](/images/tutorials/eth-api/using-tenderly/tenderly-1.webp)

一个免费账户只能创建一个项目；但是，您可以在单个项目下拥有多个智能合约。

## 添加智能合约 {: #add-smart-contracts }

将智能合约添加到您的 Tenderly 项目就像将其添加到书签一样。虽然不是必需的，但添加合约将解锁额外的 Tenderly 功能，而不仅仅是在 Tenderly 平台上搜索合约。

要将智能合约添加到您的 Tenderly 项目，请单击**Inspect**标题下的**Contracts**选项卡，然后单击**Add Contracts**。然后，执行以下步骤：

1. 输入合约的地址。在本教程中，我们将使用 FRAX 稳定币合约 `0x322E86852e492a7Ee17f28a78c663da38FB33bfb`
2. 选择合约部署到的网络。 在这种情况下，我们将选择 **Moonbeam**
3. 给合约起个名字，以帮助您在仪表板上识别它
4. 按 **Add Contract**

![添加智能合约](/images/tutorials/eth-api/using-tenderly/tenderly-2.webp)

## 模拟交易 {: #simulate-a-transaction }

模拟允许您查看交易的执行方式，而无需实际将其发送到区块链上。您可以针对任何时间点或仅是最新的区块模拟交易。

前往 **Simulator** 选项卡，让我们按照以下步骤创建一个针对 Moonbeam 网络的模拟交易：

1. 选择您要交互的合约。此处显示的名称是您在[将其添加到 Tenderly 工作区](#add-smart-contracts)时为合约指定的昵称。
2. 选择您要调用的合约函数。为了演示目的，此处选择了 `Transfer`
3. 接下来，我们将输入相关的函数参数。对于目标地址，您可以输入任何地址，例如 Alith 的地址：`0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`
4. 对于金额，您也可以指定任何金额，例如 `10000000000`
5. 选择 **Pending Block** 以针对最新生成的 Moonbeam 区块运行模拟
6. 将发件人地址指定为 Baltathar：`0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0` 或您选择的另一个地址
7. 按 **Simulate Transaction**

![针对 Moonbeam 模拟交易](/images/tutorials/eth-api/using-tenderly/tenderly-3.webp)

显然，此模拟交易将会失败，因为我们试图发送我们没有的 10,000 FRAX。但是，通过 [Tenderly 模拟器](https://docs.tenderly.co/simulator-ui){target=\_blank}，我们可以调整区块链状态并运行假设不同条件的模拟。例如，让我们运行假设 Baltathar 实际上持有 10,000 FRAX 余额的模拟。按右上角的 **Re-Simulate**，然后执行以下步骤：

1. 展开 **State Overrides** 部分
2. 按 **Add State Override**
3. 选择相关的合约，在本例中为 FRAX 合约
4. 在 **Storage Variables** 部分下，我们将通过将密钥指定为 `balanceOf[0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0]`，并将值指定为 `10000000000`，来覆盖保存 Baltathar 余额的映射。请务必注意，您是在 **Storage Variables** 部分而不是 **Balance** 部分执行此步骤
5. 按 **Add** 以确认添加状态覆盖
6. 按 **Simulate Transaction**

![使用状态覆盖针对 Moonbeam 模拟交易](/images/tutorials/eth-api/using-tenderly/tenderly-4.webp)

!!! note
    请记住，Alith 和 Baltathar 账户是[公共开发者账户列表](/builders/get-started/networks/moonbeam-dev/#pre-funded-development-accounts){target=\_blank}的一部分，具有已知的私钥。您将丢失发送到这些地址的任何资金。

如果正确添加了状态覆盖，您现在应该会在运行模拟时看到交易模拟成功界面。如果出现错误，您可以按 **Re-Simulate** 并验证您是否已正确配置状态覆盖。

![使用状态覆盖进行的交易模拟成功](/images/tutorials/eth-api/using-tenderly/tenderly-5.webp)

您还可以通过 [Simulations API](https://docs.tenderly.co/reference/api#tag/Simulations){target=\_blank} 访问 Tenderly 的交易模拟器。

## 调试 {: #debugging }

[Debugger](https://docs.tenderly.co/debugger){target=\_blank} 是 Tenderly 最强大和最受赞誉的功能之一。它速度很快，并且只需要最少的设置。实际上，如果您正在调查的合约已经在链上验证，那么启动调试器就像在 Tenderly 上搜索交易哈希一样简单。让我们来试试。

在顶部的搜索栏中，您可以粘贴合约地址或交易哈希。请记住，Tenderly 支持 Moonbeam 和 Moonriver，但目前不支持 Moonbase Alpha。这是一个 GLMR / FRAX 在 StellaSwap 上进行交换的交易哈希示例：

```text
0x80c87ab47e077ca491045047389e6bd88a748ca24971a288d09608834a3bda07
```

找到交易哈希后，您会在顶部看到有关交易的所有典型统计信息，例如状态、gas 价格、gas 使用量等。接下来，您将看到已传输的代币的细目分类。在底部，您将看到每个函数调用的长列表。鉴于交换是一个相对复杂的交互，并且鉴于 StellaSwap 使用可升级的代理合约，您将在此示例中看到一个相当长的列表。

![Debugger 1](/images/tutorials/eth-api/using-tenderly/tenderly-6.webp)

如果您单击左侧导航栏上的 **合约**，您将看到与该交易交互的每个合约的列表。您可以单击合约以查看更多详细信息，如果合约已验证，则可以查看整个源代码。

![Debugger 2](/images/tutorials/eth-api/using-tenderly/tenderly-7.webp)

在左侧导航栏向下，您将看到一个 **事件** 选项卡，后跟一个 **状态更改** 选项卡，该选项卡以可视方式表示由于此交易而发生的链状态的每次更改。

![Debugger 3](/images/tutorials/eth-api/using-tenderly/tenderly-8.webp)

如果您向下滚动到 **调试器** 选项卡，您将能够逐行单步执行合约，并在底部看到关键状态信息，从而使您能够查明任何错误的来源。

![Debugger 4](/images/tutorials/eth-api/using-tenderly/tenderly-9.webp)

最后，您将看到一个 **Gas 分析器**，它将以可视方式表示在整个交易过程中 gas 的使用位置和方式。您可以单击任何函数调用（以蓝色矩形表示）以查看每个调用中花费了多少 gas。

![Debugger 4](/images/tutorials/eth-api/using-tenderly/tenderly-10.webp)

要了解更多详细信息，请务必查看 [如何使用 Tenderly 调试器](https://docs.tenderly.co/debugger){target=\_blank} 指南。就这样！您已在掌握 Tenderly 的道路上走得很远，这肯定会节省您的时间并简化您在 Moonbeam 上构建 dApp 的开发体验。

--8<-- 'zh/text/_disclaimers/educational-tutorial.md'

--8<-- 'zh/text/_disclaimers/third-party-content.md'
