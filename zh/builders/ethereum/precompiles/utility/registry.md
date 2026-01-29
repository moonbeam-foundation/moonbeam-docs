---
title: 预编译注册表
description: 了解如何在 Moonbeam 上访问预编译注册表并与之交互，该注册表可用于检查给定地址是否为预编译地址以及是否受支持。
categories: 预编译, Ethereum 工具包
---

# Moonbeam上的预编译注册表

## 简介 {: #introduction }

预编译注册表是 Moonbeam 上可用[预编译合约](/builders/ethereum/precompiles/overview/){target=\_blank}的单一数据源。预编译注册表可用于确定地址是否对应于预编译合约，以及预编译合约是处于活动状态还是已弃用状态。当 Substrate 和 Polkadot 生态系统中存在上游更改，从而导致与预编译合约的向后不兼容的更改时，这尤其有用。开发人员可以设计退出策略，以确保他们的 dApp 在这些情况下能够优雅地恢复。

预编译注册表还有另一个用途，因为它允许任何用户为预编译合约设置“虚拟代码”(`0x60006000fd`)，从而使预编译合约可以从 Solidity 调用。这是必要的，因为默认情况下，Moonbeam 上的预编译合约没有字节码。“虚拟代码”可以绕过 Solidity 中的检查，以确保合约字节码存在且非空。

注册表预编译合约位于以下地址：

=== "Moonbeam"

    `{{ networks.moonbeam.precompiles.registry }}`

=== "Moonriver"

    `{{ networks.moonriver.precompiles.registry }}`

=== "Moonbase Alpha"

    `{{ networks.moonbase.precompiles.registry }}`

--8<-- 'zh/text/builders/ethereum/precompiles/security.md'

## 预编译注册表 Solidity 接口 {: #the-solidity-interface }

[`PrecompileRegistry.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/precompile-registry/PrecompileRegistry.sol){target=\_blank} 是一个 Solidity 接口，允许开发者与预编译的方法进行交互。

??? code "PrecompileRegistry.sol"

    ```solidity
    --8<-- 'code/builders/ethereum/precompiles/utility/registry/PrecompileRegistry.sol'
    ```

该接口包括以下函数：

??? function "**isPrecompile**(*address* a) - 返回一个布尔值，指示给定地址是否为预编译地址。对于活动和已弃用的预编译地址，返回 `true`"

    === "参数"

        - `a` - 要检查是否为预编译地址的地址

    === "返回值"

        - `bool` 地址是否为预编译地址（活动或已弃用）

??? function "**isActivePrecompile**(*address* a) - 返回一个布尔值，指示给定地址是否为活动预编译地址。如果预编译已弃用，则返回 `false`"

    === "参数"

        - `a` - 要检查是否为活动预编译地址的地址

    === "返回值"

        - `bool` 地址是否为活动预编译地址

??? function "**updateAccountCode**(*address* a) - 使用虚拟代码 (`0x60006000fd`) 更新给定预编译地址的字节码，给定预编译的地址。默认情况下，预编译没有与其关联的字节码。此函数可用于添加虚拟字节码，以绕过 Solidity 中的要求，即在可以调用合约的函数之前，检查合约的字节码是否为空"

    === "参数"

        - `a` - 要使用虚拟字节码更新的预编译地址

    === "返回值"

        无。

## 与预编译注册表Solidity接口交互 {: #interact-with-precompile-registry-interface }

以下章节将介绍如何通过[Remix](/builders/ethereum/dev-env/remix/){target=\_blank} 和 [以太坊库](/builders/ethereum/libraries/){target=\_blank}（例如 [Ethers.js](/builders/ethereum/libraries/ethersjs/){target=\_blank} 和 [Web3.py](/builders/ethereum/libraries/web3py/){target=\_blank}）与注册表预编译进行交互。

本指南中的示例将在Moonbase Alpha上进行。
--8<-- 'zh/text/_common/endpoint-examples.md'

### 使用 Remix 与预编译注册表交互 {: #use-remix }

要快速开始使用 [Remix](/builders/ethereum/dev-env/remix/){target=\_blank}，[预编译注册表合约已从 GitHub 加载](https://remix.ethereum.org/#url=https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/precompile-registry/PrecompileRegistry.sol){target=\_blank}。您也可以在 Remix 中创建一个新文件，并手动粘贴 [`PrecompileRegistry.sol`](#the-solidity-interface) 合约的内容。

![将预编译注册表接口添加到 Remix](/images/builders/ethereum/precompiles/utility/registry/registry-1.webp)

然后，您可以按照以下步骤编译、部署预编译注册表并与之交互：

1. 在“**编译**”选项卡中，单击“**编译 PrecompileRegistry.sol**”以编译合约。成功编译合约后，将出现一个绿色复选标记

    ![编译预编译注册表合约](/images/builders/ethereum/precompiles/utility/registry/registry-2.webp)

2. 在“**部署和运行交易**”选项卡中，您可以使用其地址加载预编译注册表：

    1. 确保在“**环境**”下拉列表中选择了“**注入提供程序 - Metamask**”，并且您已将 MetaMask 连接到 Moonbase Alpha
    2. 确保在“**合约**”下拉列表中选择了“**PrecompileRegistry**”。由于这是一个预编译合约，因此无需部署，而是需要在“**位于地址**”字段中提供预编译的地址
    3. 提供 Moonbase Alpha 的预编译注册表的地址：`{{ networks.moonbase.precompiles.registry }}`，然后单击“**位于地址**”
    4. 预编译注册表将出现在“**已部署合约**”列表中

    ![访问预编译注册表合约](/images/builders/ethereum/precompiles/utility/registry/registry-3.webp)

3. 您可以与任何预编译方法进行交互。在“**已部署合约**”下，展开预编译注册表以查看方法列表。例如，您可以使用 **isPrecompile** 函数检查地址是否为预编译

    ![与预编译注册表合约交互](/images/builders/ethereum/precompiles/utility/registry/registry-4.webp)

### 使用以太坊库与预编译注册表交互 {: #use-ethereum-libraries }

要使用以太坊库与预编译注册表的 Solidity 接口交互，您需要预编译注册表的 ABI。

??? code "预编译注册表 ABI"

    ```js
    --8<-- 'code/builders/ethereum/precompiles/utility/registry/abi.js'
    ```

获得 ABI 后，您可以使用您选择的以太坊库与注册表进行交互。一般来说，您需要执行以下步骤：

1. 创建一个 provider
2. 创建预编译注册表的合约实例
3. 与预编译注册表的功能进行交互

!!! remember
    以下代码段仅供演示使用。切勿将您的私钥存储在 JavaScript 或 Python 文件中。

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/ethereum/precompiles/utility/registry/ethers.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/ethereum/precompiles/utility/registry/web3.py'
    ```
