---
title: Tenderly 开发平台
description: 了解如何使用 Tenderly（一个以太坊开发平台）在 Moonbeam 上构建、调试和监控 Solidity 智能合约。
categories: Dev Environments, Ethereum Toolkit
---

# 在 Moonbeam 上使用 Tenderly

## 简介 {: #introduction }

[Tenderly](https://tenderly.co){target=\_blank} 是一个 Web3 开发平台，包含一套旨在帮助开发者完成 DApp 开发生命周期的工具。借助 Tenderly，您可以构建、调试、测试、优化、监控、设置警报以及查看 Moonbeam 和 Moonriver 上智能合约的分析。

Tenderly 平台提供以下功能：

- **[合约验证](https://docs.tenderly.co/contract-verification){target=\_blank}** - 验证智能合约对于充分利用 Tenderly 的所有功能至关重要，因此 Tenderly 提供了几种验证方法。您可以通过 [Tenderly 仪表板](https://docs.tenderly.co/contract-verification/dashboard){target=\_blank}、[Tenderly CLI 和 Foundry](https://docs.tenderly.co/contract-verification/foundry){target=\_blank} 或 [Tenderly Hardhat 插件](https://docs.tenderly.co/contract-verification/hardhat){target=\_blank} 验证智能合约

- **[调试器](https://docs.tenderly.co/debugger){target=\_blank}** - 使用可视化调试器检查交易，并更深入地了解代码的行为。借助调试器，您可以查看交易的堆栈跟踪、查看交易中进行的调用、单步执行合约以及查看解码后的输入、输出和状态变量。您可以在 Tenderly 仪表板或 [Tenderly 调试器 Chrome 扩展程序](https://docs.tenderly.co/debugger/dev-toolkit-browser-extension){target=\_blank} 上使用调试器

- **[Gas 分析器](https://docs.tenderly.co/debugger/gas-profiler){target=\_blank}** - 查看您在细粒度级别上花费了多少 gas，以便您可以优化智能合约并降低交易 gas 成本

- **[模拟器](https://docs.tenderly.co/simulator-ui){target=\_blank}** - 在 TestNet 开发环境中模拟交易，以了解您的交易在不必将其发送到链上的情况下将如何运行。这样，您就可以知道交易的结果，并确保它在发送到网络之前按预期工作。您可以尝试不同的参数，模拟历史和当前交易，以及编辑合约源代码。您可以从 Tenderly 仪表板访问模拟器，也可以使用 [Tenderly 模拟 API](https://docs.tenderly.co/reference/api#tag/Simulations){target=\_blank} 以编程方式利用模拟器

- **[虚拟 TestNets](https://docs.tenderly.co/virtual-testnets){target=\_blank}** - 在隔离的环境中模拟实时 Moonbeam 网络，以与已部署的合约和实时链上数据进行交互。这些测试环境支持跨智能合约、UI、后端和数据索引的受控开发、测试和调试。它们支持复杂场景的顺序交易模拟。使用此功能时，需要注意一些限制。[Moonbeam 预编译合约](/builders/ethereum/precompiles/overview){target=\_blank} 不受支持，因为它们是 Substrate 实现的一部分，并且无法在模拟的 EVM 环境中复制，从而禁止您与跨链资产、质押和治理进行交互。

- **[警报](https://docs.tenderly.co/alerts/intro-to-alerts){target=\_blank}** - 配置实时警报，以便在发生特定事件时通知您，使您随时了解智能合约的运行情况

- **[Web3 操作](https://docs.tenderly.co/web3-actions/intro-to-web3-actions){target=\_blank}** - 在 JavaScript 或 TypeScript 中创建可编程函数，这些函数在发生特定智能合约或链事件时由 Tenderly 自动执行

!!! note
    Tenderly 支持 Moonbeam、Moonriver 和 Moonbase Alpha，但 Web3 网关除外。有关更多信息，请查看 Tenderly 关于 [支持的网络](https://docs.tenderly.co/supported-networks#supported-networks){target=\_blank} 的文档。

## 开始使用

Tenderly 仪表板提供对一体化 Web3 开发平台的访问。要开始使用该仪表板，您需要[注册](https://dashboard.tenderly.co/register){target=\_blank}一个帐户。注册后，您就可以开始浏览您的 Tenderly 仪表板。

![Tenderly 仪表板](/images/builders/ethereum/dev-env/tenderly/tenderly-1.webp)

如果您不想设置帐户，您还可以使用 [Tenderly 的浏览器](https://dashboard.tenderly.co/explorer){target=\_blank}访问有限的功能。没有帐户，您仍然可以深入了解合约和交易。但是，您将无法模拟交易或创建虚拟测试网。
要以编程方式与 Tenderly 的功能交互，您可以查看 [Tenderly CLI](https://github.com/Tenderly/tenderly-cli){target=\_blank} GitHub 存储库以获取更多信息。

以下部分将向您展示如何在 Moonbeam 上开始使用 Tenderly。有关更详细的文档，请参阅 [Tenderly 的文档站点](https://docs.tenderly.co){target=\_blank}。

### 添加合约 {: #add-a-contract }

开始使用 Tenderly 仪表板的一个好方法是添加已部署的智能合约。添加合约后，您将能够创建交易模拟和虚拟测试网，使用调试器，设置监控和警报等等。

要添加新合约，您可以单击左侧面板上的 **合约**，然后单击 **添加合约**。将出现一个弹出窗口，您可以按照以下步骤操作：

1. 输入合约地址
2. （可选）您可以为您的合约命名
3. 根据您将智能合约部署到的网络，选择 **Moonbeam**、**Moonriver** 或 **Moonbase Alpha** 作为网络
4. （可选）切换 **添加更多** 滑块，以在初始合约之后添加其他合约
5. 最后，要将合约添加到仪表板，请单击 **保存**

![添加合约](/images/builders/ethereum/dev-env/tenderly/tenderly-2.webp)

添加合约后，它将显示在 **合约** 仪表板上的合约列表中。如果合约尚未验证，仪表板将显示 **未验证** 状态以及 **验证** 按钮。

![合约列表中的合约](/images/builders/ethereum/dev-env/tenderly/tenderly-3.webp)

为了充分利用 Tenderly 工具集，建议您验证您的智能合约，您可以通过单击 **验证** 来完成。您可以选择通过上传合约的 JSON、ABI 或源代码来验证您的合约。有关更多信息，请参阅 Tenderly 关于 [智能合约验证](https://docs.tenderly.co/contract-verification#verifying-a-smart-contract){target=\_blank} 的文档。

### 创建虚拟测试网 {: #virtual-testnets-moonbeam }

Tenderly 的虚拟测试网功能在隔离环境中模拟了 Moonbeam 实时网络，使您能够与已部署的合约和实时链上数据进行交互。

使用此功能时，需要注意一些限制。您无法与任何 [Moonbeam 预编译合约](/builders/ethereum/precompiles/){target=\_blank} 及其函数进行交互。预编译是 Substrate 实现的一部分，因此无法在模拟的 EVM 环境中复制。这禁止您与 Moonbeam 上的跨链资产和基于 Substrate 的功能（如质押和治理）进行交互。

Tenderly 使通过仪表板创建测试网非常简单。要开始使用，请单击左侧菜单上的 **Virtual TestNets（虚拟测试网）**，然后单击 **Create Virtual TestNet（创建虚拟测试网）**。从那里，您可以按照以下步骤操作：

1. 从 **Parent network（父网络）** 下拉菜单中选择 **Moonbeam**、**Moonriver** 或 **Moonbase Alpha**
2. （可选）为您的测试网命名
3. 选择您的 **Chain ID（链 ID）**；您可以使用自定义 ID 或原始网络 ID。建议设置自定义链 ID，以防止重放攻击，并避免在将虚拟测试网添加到钱包时出现问题
4. 选择是否打开或关闭 **Public Explorer（公共浏览器）**
5. 如果您希望您的虚拟测试网与父网络实时保持更新，请启用 **State Sync（状态同步）**
6. 要限制数据，请禁用 **Use latest block（使用最新区块）** 并输入区块号，或者保持启用以包含所有区块
7. 单击 **Create（创建）**

![Virtual TestNet Moonbeam](/images/builders/ethereum/dev-env/tenderly/tenderly-4.webp)

创建虚拟测试网后，您可以通过部署合约或创建交易模拟来开始使用它。

要部署合约，请转到左侧菜单中的“合约”。使用 **Watched Contracts（已监视的合约）** 中的一个，或通过 **Watch Contract（监视合约）** 添加一个新合约。添加后，它将出现在 **Contracts（合约）** 中，您可以在其中查看其详细信息。

要创建模拟，请单击 **Simulation（模拟）** 按钮，然后输入模拟的配置。有关模拟的更多信息，请参阅 Tenderly 的 [Simulator UI Overview（模拟器用户界面概述）](https://docs.tenderly.co/simulator-ui/using-simulation-ui){target=\_blank} 文档。

![TestNet simulations](/images/builders/ethereum/dev-env/tenderly/tenderly-5.webp)

既然您已经了解了如何在 Moonbeam 上开始使用 Tenderly 的一些功能，请随时深入了解并查看其开发平台中提供的其他工具。您可以访问 [Tenderly 的文档站点](https://docs.tenderly.co){target=\_blank} 以获取更多信息。您还可以查看 Moonbeam 关于 [使用 Tenderly 模拟和调试交易](/tutorials/eth-api/using-tenderly/){target=\_blank} 的教程。

--8<-- 'zh/text/_disclaimers/third-party-content.md'
