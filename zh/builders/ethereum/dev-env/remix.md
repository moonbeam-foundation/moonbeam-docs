---
title: 使用 Remix 部署智能合约
description: 了解如何使用 Remix IDE（最广泛使用的以太坊开发工具之一）在 Moonbeam 上部署 Solidity 智能合约并与之交互。
categories: 开发环境, 以太坊工具包
---

# 使用 Remix 部署到 Moonbeam

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/TkbYDRzVe7g?si=eX2hFClaMaf0AQLc' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## 简介 {: #introduction }

[Remix](https://remix.ethereum.org){target=\_blank} 是一个集成开发环境 (IDE)，用于在 Ethereum 和与 Ethereum 兼容的链上开发智能合约。它提供了一个易于使用的界面，用于编写、编译和部署智能合约。 鉴于 Moonbeam 的 Ethereum 兼容性功能，你可以直接将 Remix 与任何 Moonbeam 网络一起使用。

本指南将引导你完成使用 Remix IDE 创建 Solidity 智能合约并将其部署到 [Moonbeam 开发节点](/builders/get-started/networks/moonbeam-dev/){target=\_blank} 的过程。 本指南可以适用于 [Moonbeam](/builders/get-started/networks/moonbeam/){target=\_blank}、[Moonriver](/builders/get-started/networks/moonriver/){target=\_blank} 或 [Moonbase Alpha](/builders/get-started/networks/moonbase/){target=\_blank}。

如果你熟悉 Remix，则可以跳到 [将 Remix 连接到 Moonbeam](#connect-remix-to-moonbeam){target=\_blank} 部分，了解如何将 Remix 与 Moonbeam 一起使用。

## 检查先决条件 {: #checking-prerequisites }

为了本指南的目的，您需要具备以下条件：

- 本地运行的 [Moonbeam 开发节点](/builders/get-started/networks/moonbeam-dev/){target=\_blank}
- [MetaMask 已安装并连接](/tokens/connect/metamask/){target=_blank} 到您的开发节点

如果您按照上述指南操作，您应该拥有一个本地 Moonbeam 节点，该节点将在交易到达时开始创建区块。

--8<-- 'code/builders/ethereum/dev-env/remix/terminal/node.md'

您的开发节点附带 10 个预先注资的账户。您应该将 MetaMask 连接到您的 Moonbeam 开发节点，并导入至少一个预先注资的账户。您可以参考 MetaMask 文档的 [导入账户](/tokens/connect/metamask/#import-accounts){target=\_blank} 部分，获取关于如何导入开发账户的分步说明。

![MetaMask 的主屏幕，显示连接到 Moonbeam 开发节点的帐户及其余额。](/images/builders/ethereum/dev-env/remix/remix-1.webp)

如果您正在为 Moonbeam、Moonriver 或 Moonbase Alpha 调整本指南，请确保您已连接到正确的网络，并且拥有一个有资金的帐户。
--8<-- 'text/_common/faucet/faucet-sentence.md'

## 熟悉 Remix {: #get-familiar-with-remix }

如果您导航到 [https://remix.ethereum.org/](https://remix.ethereum.org){target=\_blank}，您会看到 Remix 的布局分为四个部分：

1. 插件面板
2. 侧面板
3. 主面板
4. 终端

![Remix IDE 的布局及其四个部分。](/images/builders/ethereum/dev-env/remix/remix-2.webp)

插件面板显示每个预加载插件、插件管理器和设置菜单的图标。您将在此处看到每个预加载插件的一些图标，这些插件是**文件浏览器**、**在文件中搜索**、**Solidity 编译器**和**部署和运行交易**插件。随着其他插件被激活，它们的图标将出现在此面板中。

侧面板显示当前正在查看的插件的内容。默认情况下，您将看到文件浏览器插件，它显示默认工作区和一些预加载的文件和文件夹。但是，如果您从插件面板中选择其他图标之一，您将看到所选插件的内容。

主面板会自动加载 **Home** 选项卡，其中包含指向各种资源的链接。您可以随时关闭此选项卡，并通过单击插件面板左上角的蓝色 Remix 图标重新打开它。在主面板中，您将能够看到您正在处理的每个文件。例如，您可以双击**文件浏览器**侧面板中的任何文件，它将作为主面板中的选项卡出现。

终端面板类似于您在操作系统上拥有的标准终端；您可以从中执行脚本，并将日志打印到其中。所有交易和合约交互都会自动记录到终端。您还可以直接从终端与 [Ethers](https://docs.ethers.org/v6){target=\_blank} JavaScript 库进行交互。

## 将智能合约添加到文件浏览器 {: #add-a-smart-contract-to-the-file-explorer }

在本示例中，您将创建一个包含 ERC-20 代币合约的新文件。它是基于当前 [OpenZeppelin ERC-20 模板](https://docs.openzeppelin.com/contracts/4.x/erc20){target=\_blank} 的简单 ERC-20 合约。该合约会创建一个符号为 `MYTOK` 的 `MyToken` 代币，并将初始供应量全部铸造给合约创建者。

在插件面板的 **File explorer** 选项卡中，您可以按照以下步骤创建新文件：

1. 点击文件图标
2. 输入合约名称：`MyToken.sol`

![在 Remix 中使用文件浏览器插件创建新文件。](/images/builders/ethereum/dev-env/remix/remix-3.webp)

主面板会切换到一个空文件，您可以在其中添加合约的 Solidity 代码。将 `MyToken.sol` 智能合约粘贴到新文件中：

```solidity
--8<-- 'code/builders/ethereum/dev-env/remix/MyToken.sol'
```

![在 Remix 主面板中新建的文件中添加合约代码。](/images/builders/ethereum/dev-env/remix/remix-4.webp)

## 编译 Solidity 智能合约 {: #compile-a-solidity-smart-contract }

在编译合约之前，请确保您已从**文件资源管理器**选项卡中选择了合约文件。然后，从插件面板中选择 **Solidity Compiler** 选项。

确保左上角的编译器版本符合您的合约中定义的版本以及 [OpenZeppelin 的 `ERC20.sol` 合约](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol){target=\_blank} 中定义的版本。例如，`MyToken.sol` 合约需要 Solidity ^0.8.30，并且 OpenZeppelin 的 `ERC20.sol` 合约与 ^0.8.30 兼容，因此编译器需要设置为 0.8.30 或更新的版本。

Solidity 编译器插件还允许您更改一些设置并为编译器应用高级配置。如果您计划迭代智能合约，您可以选中**自动编译**框，这样每当您进行更改时，合约将自动重新编译。

此外，在**高级配置**菜单中，您可以更改 EVM 版本、启用优化并设置整个合约生命周期内字节码预计运行的次数；默认设置为 200 次。有关合约优化的更多信息，请参阅 [Solidity 文档中的优化器](https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options){target=\_blank}。

在此示例中，不需要其他配置。要编译 `MyToken.sol` 合约，只需单击**编译 MyToken.sol** 合约。如果编译成功，您将在插件面板中 **Solidity compiler** 插件旁边看到一个绿色的勾号。

![Remix 侧面板中显示的 Solidity 编译器插件。](/images/builders/ethereum/dev-env/remix/remix-5.webp)

### 调试编译错误 {: #debug-compilation-errors }

如果您尝试编译智能合约但出现错误或警告，您可以直接通过 Remix 中 Solidity 编译器插件的 ChatGPT 轻松调试问题。

例如，如果您只向 ERC-20 构造函数提供了令牌名称，但忘记了令牌符号并尝试编译合约，则错误将显示在侧面板中。您可以向下滚动以阅读错误，并且您会看到还有一个**ASK GPT**按钮。要获得调试问题的帮助，您可以单击**ASK GPT**，Remix 终端将返回一个响应，该响应将指导您朝着正确的方向尝试修复问题。如果您需要其他帮助，您可以直接访问源并询问 [ChatGPT](https://chatgpt.com/){target=\_blank}。

![Solidity 编译器插件侧面板中显示的错误消息，带有一个用于调试询问 GPT 按钮。](/images/builders/ethereum/dev-env/remix/remix-6.webp)

成功修复问题并重新编译合约后，您将在插件面板中 **Solidity 编译器** 插件旁边看到一个绿色复选标记。

![插件面板中 Solidity 编译器插件旁边的绿色复选标记。](/images/builders/ethereum/dev-env/remix/remix-7.webp)

## 部署 Solidity 智能合约 {: #deploy-a-solidity-smart-contract }

**部署和运行交易** 插件使您能够配置合约部署选项、部署合约以及与已部署的合约交互。

侧面板包含以下部署选项：

- Environment - 允许您选择部署的执行环境
- Account - 将从中发送部署交易的帐户
- Gas Limit - 部署交易可以消耗的最大 gas 量
- Value - 要随部署交易一起发送的本地资产数量
- Contract - 要部署的合约
- Deploy - 使用所选帐户、gas 限制、value 以及任何构造函数参数的值，将部署交易发送到指定的环境
- At Address - 允许您通过指定现有合约的地址来与它交互

以下部分将介绍如何配置部署到 Moonbeam 的环境。

### 将 Remix 连接到 Moonbeam {: #connect-remix-to-moonbeam }

要将智能合约部署到 Moonbeam，您需要确保已将钱包连接到您的 Moonbeam 开发节点或您选择的 Moonbeam 网络。然后，从 **Deploy and run transactions（部署和运行交易）** 选项卡中，您可以通过从 **ENVIRONMENT（环境）** 下拉菜单中选择您的钱包来将 Remix 连接到您的钱包。例如，如果您安装了 Trust Wallet，您将从下拉菜单中看到 **Injected Provider - TrustWallet（注入的提供商 - TrustWallet）**。除了注入的提供商之外，您还可以通过 WalletConnect 连接到 Moonbeam。

对于此示例，将使用 MetaMask。您应该已经安装了 MetaMask 并连接到本地 Moonbeam 开发节点。如果未连接，请参阅 [使用 MetaMask 与 Moonbeam 交互](/tokens/connect/metamask/){target=\_blank} 指南，以获取分步说明。

从 **ENVIRONMENT（环境）** 下拉菜单中，选择 **Injected Provider - MetaMask（注入的提供商 - MetaMask）**。

![环境下拉菜单在“部署和运行事务”侧面板上展开，以显示所有可用选项。](/images/builders/ethereum/dev-env/remix/remix-8.webp)

MetaMask 将自动弹出并提示您连接到 Remix。您需要：

1. 选择您要连接到 Remix 的帐户
2. 点击 **Next（下一步）**
3. 点击 **Connect（连接）** 以将您的帐户连接到 Remix

![您必须经历的两个 MetaMask 屏幕才能连接到 Remix：一个提示您选择要连接的帐户，另一个授予 Remix 权限。](/images/builders/ethereum/dev-env/remix/remix-9.webp)

将 MetaMask 连接到 Remix 后，侧面板将更新以显示您连接到的网络和帐户。对于 Moonbeam 开发节点，您应该会看到 **Custom (1281) network（自定义（1281）网络）**。

![Remix 中“部署和运行事务”侧面板显示已连接到 MetaMask 的环境、连接的网络为 1281 以及连接的帐户地址。](/images/builders/ethereum/dev-env/remix/remix-10.webp)

### 将合约部署到 Moonbeam {: #deploy-the-contract-to-moonbeam }

现在您已经连接了您的钱包，您可以部署合约了。由于您部署的是一个简单的 ERC-20 代币智能合约，Remix 设置的默认 gas 限制为 300 万，这已经足够了，您不需要指定一个随部署一起发送的值。因此，您可以按照以下步骤部署合约：

1. 确保 **ENVIRONMENT** 设置为 **Injected Provider - MetaMask**
2. 确保连接的帐户是您要从中部署交易的帐户
3. 使用默认的 **GAS LIMIT** `3000000`
4. 将 **VALUE** 保持为 `0`
5. 确保 `MyToken.sol` 是选定的合约
6. 展开 **DEPLOY** 下拉列表
7. 指定初始供应量。对于本例，您可以将其设置为 800 万个代币。由于此合约使用默认的 18 位小数，因此在框中输入的值为 `8000000000000000000000000`
8. 单击 **transact** 以发送部署交易
9. MetaMask 将会弹出，您可以单击 **Confirm** 以部署合约

![完全填写好的“部署和运行交易”侧面板，用于执行合约部署。](/images/builders/ethereum/dev-env/remix/remix-11.webp)

部署交易完成后，您将在 Remix 终端中看到有关部署交易的详细信息。此外，该合约将出现在侧面板的 **Deployed Contracts** 部分下。

## 与已部署的智能合约交互 {: #interact-with-deployed-smart-contracts }

一旦您部署了一个智能合约，或者通过“**At Address**”按钮访问了一个现有的合约，该合约将出现在侧面板的“**已部署合约**”部分下。您可以展开合约来查看所有您可以与之交互的合约函数。

要与给定的函数交互，您可以单击函数名称，该名称将包含在橙色、红色或蓝色按钮中。橙色按钮用于写入区块链且不可支付的函数；红色按钮用于写入区块链且可支付的函数；蓝色按钮用于从区块链读取数据的函数。

根据您交互的函数，您可能需要输入参数值。如果该函数需要输入，您可以通过展开该函数并为每个参数输入一个值来输入它们。

如果您交互的函数是可支付的，您可以在侧面板顶部的“**VALUE**”字段中输入金额，该字段与具有可支付的构造函数的合约使用的值字段相同。

### 调用智能合约函数 {: #call-the-smart-contract-functions }

如果您展开 **MYTOKEN** 合约下拉菜单，您将能够看到所有可以与之交互的可用函数。要与给定的函数交互，您可以根据需要提供任何输入，然后单击包含要交互的函数名称的按钮。

例如，如果您想调用 `totalSupply` 函数，您无需签署交易，因为您会立即得到响应。

![已部署的 ERC-20 合约中可用函数以及调用 totalSupply 函数的响应的视图。](/images/builders/ethereum/dev-env/remix/remix-12.webp)

另一方面，如果您调用 `approve` 函数，该函数将批准一个帐户作为给定数量的 MYTOK 代币的消费方，您需要在 MetaMask 中提交批准。要对此进行测试，您可以采取以下步骤：

1. 将 **spender** 设置为您希望能够代表您消费代币的帐户。对于此示例，您可以使用 Bob 的帐户（预先资助的开发帐户之一）：`0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0`
2. 输入消费方可以消费的数量。对于此示例，您可以通过输入 `10000000000000000000` 来批准 Bob 消费 10 个 MYTOK
3. 按 **transact**
4. MetaMask 将会弹出，您需要查看批准的详细信息并提交批准

![ERC-20 合约的 approve 函数的输入以及 MetaMask 弹出的批准窗口。](/images/builders/ethereum/dev-env/remix/remix-13.webp)

要查看您的余额或批准，或转移 MYTOK，您可以将 MYTOK 添加到您的钱包。有关如何将代币添加到 MetaMask 的信息，您可以参考[添加 ERC-20 代币](/tokens/connect/metamask/#add-erc20){target=\_blank}部分中的[我们的 MetaMask 文档](/tokens/connect/metamask/){target=\_blank}。

--8<-- 'text/_disclaimers/third-party-content.md'
