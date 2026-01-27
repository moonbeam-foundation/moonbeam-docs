---
title: 在区块浏览器上验证智能合约
description: 了解如何使用可用的区块浏览器（例如 Moonscan）在基于 Moonbeam 的网络上验证智能合约。
categories: Ethereum Toolkit
---

# 使用区块浏览器验证智能合约

## 简介 {: #introduction }

在区块浏览器上验证智能合约是提高 Moonbeam 上已部署智能合约透明度和安全性的绝佳方法。用户可以直接查看已验证智能合约的源代码，对于某些区块浏览器，他们还可以通过区块浏览器的界面直接与合约的公共方法进行交互。

本页面将概述通过区块浏览器在 Moonbeam 网络上验证智能合约的步骤。

## 部署合约 {: #deploying-the-contract }

为了在区块浏览器上验证智能合约，必须首先将合约部署到目标网络。本教程将介绍如何将智能合约部署到 [Moonbase Alpha](builders/get-started/networks/moonbase/){target=\_blank}，但它也可以适用于 Moonbeam 或 Moonriver。

您可以查看此页面，获取有关使用 Moonbeam 上的 Ethereum 库[部署智能合约](builders/ethereum/libraries/){target=\_blank}的教程。您也可以使用开发者工具，例如 [Remix](builders/ethereum/dev-env/remix/#deploying-a-contract-to-moonbeam-using-remix){target=\_blank}、[Hardhat](builders/ethereum/dev-env/hardhat/){target=\_blank}，或者其他首选工具，将智能合约部署到 Moonbeam。

本教程将使用与上述部署教程相同的合约，用于合约验证示例。

使用的合约是一个简单的增量器，任意命名为 `Incrementer.sol`。Solidity 代码如下：

```solidity
--8<-- 'code/builders/ethereum/libraries/Incrementer.sol'
```

### 收集合约验证信息

您需要收集一些与合约编译器和部署相关的信息，以便成功验证合约。

1. 记下用于编译和部署合约的 Solidity 编译器版本。Solidity 编译器版本通常可以在使用的部署工具中选择或指定
2. 记下在 Solidity 源文件开头使用的任何 SPDX 许可证标识符（此示例使用 MIT 许可证）：

    ```solidity
    // SPDX-License-Identifier: MIT
    ```

3. （可选）如果在编译期间启用了优化，请记下优化运行参数的值
4. （可选）如果合约构造函数方法接受参数，请记下构造函数参数的 [ABI 编码形式](https://docs.soliditylang.org/en/develop/abi-spec.html)
5. 部署后，记下智能合约的已部署合约地址。合约的部署地址可以在控制台输出中找到（如果使用基于命令行的工具（如 Hardhat）或以太坊库），也可以从 Remix IDE 等工具的 GUI 中复制

![Remix IDE 中的编译器选项示例](/images/builders/ethereum/verify-contracts/block-explorers/verify-contract-1.webp)

![Remix IDE 中的合约地址](/images/builders/ethereum/verify-contracts/block-explorers/verify-contract-2.webp)

## 验证合约 {: #verifying-the-contract }

下一步将是在与EVM兼容的Moonbeam网络浏览器中验证您部署的智能合约。

### Moonscan {: #moonscan }

请按照以下步骤在 Moonscan 上验证合约：

1. 转到 Moonscan 的 [验证和发布合约源代码](https://moonbase.moonscan.io/verifyContract) 页面
2. 在第一个字段中填写合约的已部署地址，包括 `0x` 前缀
3. 选择编译器类型。对于当前的 `Incrementer.sol` 示例，选择 **Solidity (Single file)**
4. 选择编译器类型后，选择用于编译合约的编译器版本。如果使用的编译器版本是 nightly commit，请取消选中该字段下的复选框以选择 nightly 版本
5. 选择使用的开源许可证。对于当前的 `Incrementer.sol` 示例，选择选项 **MIT License (MIT)**。如果没有使用任何许可证，请选择 **No License (None)**
6. 单击表单底部的 **Continue** 按钮以继续进入下一页

![First Page Screenshot](/images/builders/ethereum/verify-contracts/block-explorers/verify-contract-3.webp)

在第二页上，**Contract Address**、**Compiler** 和 **Constructor Arguments** 字段应已预先填写。填写其余信息：

1. 将合约的全部内容复制并粘贴到标记为该内容的文本字段中
2. （可选）如果编译期间启用了 **Optimization**，请选择 **Yes**，并在 **Misc Settings/Runs(Optimizer)** 下填写运行次数
3. （可选）添加合约库及其地址（如果合约中使用了任何库）
4. （可选）选中可能适用于您的合约的任何其他可选字段，并相应地填写它们
5. 单击底部的 CAPTCHA 和 **Verify and Publish** 按钮以确认并开始验证

![Second Page Screenshot](/images/builders/ethereum/verify-contracts/block-explorers/verify-contract-4.webp)

短暂等待后，验证结果将显示在浏览器中，并且成功结果页面将显示合约的 ABI 编码的构造函数参数、合约名称、字节码和 ABI。

![Result Page Screenshot](/images/builders/ethereum/verify-contracts/block-explorers/verify-contract-5.webp)

## 智能合约扁平化 {: #smart-contract-flattening }

对于验证由多个文件组成的智能合约，该过程略有不同，需要进行一些预处理，以将目标智能合约的所有依赖项组合到一个 Solidity 文件中。

此预处理通常称为智能合约扁平化。 有许多工具可用于将多部分智能合约扁平化为单个 Solidity 文件，例如 [Hardhat 的 Flatten 任务](https://hardhat.org/hardhat-runner/docs/advanced/flattening){target=\_blank}。 有关其用法的更详细说明，请参阅相应的智能合约扁平化工具的文档。

在扁平化多部分智能合约后，可以使用新的扁平化 Solidity 文件在区块浏览器上验证它，就像验证单文件智能合约一样，如本教程中所述。

### 在 Moonscan 上验证多部分智能合约 {: #verify-multi-part-smart-contract-on-moonscan }

为了在 Moonscan 上进行验证，有一个内置功能可以处理多部分智能合约。

在**编译器类型**下选择 **Solidity (多部分文件)**（上述示例的第 3 步）。然后，在下一页上，选择并上传合约所包含的所有不同的 Solidity 文件，包括它们嵌套的依赖合约文件。

![Moonscan 多文件页面](/images/builders/ethereum/verify-contracts/block-explorers/verify-contract-6.webp)

除此之外，该过程与在 Moonscan 上验证单文件合约的过程大致相同。
