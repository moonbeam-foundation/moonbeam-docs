---
title: 如何使用 Ethers.js Ethereum 库
description: 按照本教程学习如何使用 Ethereum Ethers.js 库来发送交易并将 Solidity 智能合约部署到 Moonbeam。
categories: Libraries and SDKs, Ethereum Toolkit
---


# Ethers.js JavaScript 库

## 简介 {: #introduction }

[Ethers.js](https://docs.ethers.org/v6){target=\_blank} 库提供了一组使用 JavaScript 与以太坊节点交互的工具，类似于 Web3.js。Moonbeam 有一个类似以太坊的 API，它与以太坊风格的 JSON-RPC 调用完全兼容。因此，开发人员可以利用这种兼容性，并使用 Ethers.js 库与 Moonbeam 节点交互，就像在以太坊上进行操作一样。有关 Ethers.js 的更多信息，请查看其[文档站点](https://docs.ethers.org/v6){target=\_blank}。

在本指南中，您将学习如何使用 Ethers.js 库在 Moonbase Alpha 上发送交易和部署合约。本指南适用于 [Moonbeam](/builders/get-started/networks/moonbeam/){target=\_blank}、[Moonriver](/builders/get-started/networks/moonriver/){target=\_blank} 或 [Moonbeam 开发节点](/builders/get-started/networks/moonbeam-dev/){target=\_blank}。

## 检查先决条件 {: #checking-prerequisites }

对于本指南中的示例，您需要具备以下条件：

- 一个有资金的帐户。
    --8<-- 'zh/text/_common/faucet/faucet-list-item.md'
    --8<-- 'zh/text/_common/endpoint-examples-list-item.md'

!!! note

    --8<-- 'zh/text/_common/assumes-mac-or-ubuntu-env.md'

## 安装 Ethers.js {: #install-ethersjs }

要开始使用，你需要启动一个基本的 JavaScript 项目。首先，创建一个目录来存储你将在本指南中创建的所有文件，并使用以下命令初始化项目：

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/1.sh'
```

对于本指南，你需要安装 Ethers.js 库和 Solidity 编译器。要安装这两个 NPM 包，你可以运行以下命令：

=== "npm"

    ```bash
    --8<-- 'code/builders/ethereum/libraries/ethersjs/2.sh'
    ```

=== "yarn"

    ```bash
    --8<-- 'code/builders/ethereum/libraries/ethersjs/3.sh'
    ```

## 设置 Ethers Provider {: #setting-up-the-ethers-provider }

在本指南中，您将创建许多脚本，这些脚本提供不同的功能，例如发送交易、部署合约以及与已部署的合约进行交互。在大多数这些脚本中，您需要创建一个 [Ethers 提供程序](https://docs.ethers.org/v6/api/providers/){target=\_blank} 以与网络进行交互。

--8<-- 'zh/text/_common/endpoint-setup.md'

要创建提供程序，您可以按照以下步骤操作：

1. 导入 `ethers` 库
1. 定义 `providerRPC` 对象，该对象可以包括您想要在上面发送交易的任何网络的网络配置。您将包括每个网络的 `name`、`rpc` 和 `chainId`
1. 使用 `ethers.JsonRpcProvider` 方法创建 `provider`

=== "Moonbeam"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethersjs/4.js'
    ```

=== "Moonriver"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethersjs/5.js'
    ```

=== "Moonbase Alpha"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethersjs/6.js'
    ```

=== "Moonbeam Dev Node"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethersjs/7.js'
    ```

保存此代码段，因为您将在以下各节中使用的脚本中需要它。

## 发送交易 {: #send-a-transaction }

在本节中，您将创建几个脚本。第一个是检查您的帐户余额，然后再尝试发送交易。第二个脚本实际上会发送交易。

您还可以使用余额脚本来检查交易发送后的帐户余额。

### 检查余额脚本 {: #check-balances-script }

您只需要一个文件即可在交易发送前后检查两个地址的余额。首先，可以通过运行以下命令创建一个 `balances.js` 文件：

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/8.sh'
```

接下来，创建该文件的脚本并完成以下步骤：

1. [设置 Ethers 提供程序](#setting-up-the-ethers-provider)
1. 定义 `addressFrom` 和 `addressTo` 变量
1. 创建异步 `balances` 函数，该函数包装了 `provider.getBalance` 方法
1. 使用 `provider.getBalance` 获取 `addressFrom` 和 `addressTo` 的余额。你还可以使用 `ethers.formatEther` 将余额转换为更易读的 ETH 数值
1. 最后，运行 `balances` 函数

```js
--8<-- 'code/builders/ethereum/libraries/ethersjs/9.js'
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethers-js/balances.js'
    ```

要运行脚本并获取账户余额，可以运行以下命令：

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/10.sh'
```

如果成功，源地址和接收地址的余额将在终端中以 DEV 显示。

### 发送交易脚本 {: #send-transaction-script }

您只需要一个文件即可在账户间执行交易。此示例将从源地址（您拥有其私钥）向另一个地址转账 1 个 DEV 代币。首先，可以通过运行以下命令创建 `transaction.js` 文件：

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/11.sh'
```

接下来，创建该文件的脚本并完成以下步骤：

1. [设置 Ethers 提供程序](#setting-up-the-ethers-provider)
1. 定义 `privateKey` 和 `addressTo` 变量。私钥用于创建钱包实例。**注意：这仅用于示例目的。切勿将您的私钥存储在 JavaScript 文件中**
1. 使用前面步骤中的 `privateKey` 和 `provider` 创建一个钱包。钱包实例用于签署交易
1. 创建异步 `send` 函数，该函数包装交易对象和 `wallet.sendTransaction` 方法
1. 创建交易对象，仅需要接收方地址和发送金额。注意可以使用 `ethers.parseEther`，它会处理将 Ether 转换为 Wei 的必要单位转换（类似于使用 `ethers.parseUnits(value, 'ether')`）
1. 使用 `wallet.sendTransaction` 发送交易，并使用 `await` 等待交易处理完毕并返回交易回执
1. 最后，运行 `send` 函数

```js
--8<-- 'code/builders/ethereum/libraries/ethersjs/12.js'
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethers-js/transaction.js'
    ```

要运行该脚本，您可以在终端中运行以下命令：

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/13.sh'
```

如果交易成功，您会在终端中看到交易哈希被打印出来。

您还可以使用 `balances.js` 脚本来检查源账户和接收账户的余额是否已更改。整个工作流程如下所示：

--8<-- 'code/builders/ethereum/libraries/ethers-js/terminal/transaction.md'

## 部署合约 {: #deploy-a-contract }

--8<-- 'zh/text/builders/ethereum/libraries/contract.md'

### 编译合约脚本 {: #compile-contract-script }

--8<-- 'zh/text/builders/ethereum/libraries/compile-js.md'

--8<-- 'zh/text/builders/ethereum/libraries/compile.md'

```js
--8<-- 'code/builders/ethereum/libraries/compile.js'
```

### 部署合约脚本 {: #deploy-contract-script }

有了编译 `Incrementer.sol` 合约的脚本，您就可以使用结果发送一个已签名的交易来部署它。为此，您可以创建一个名为 `deploy.js` 的部署脚本文件：

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/14.sh'
```

接下来，您将创建这个文件的脚本并完成以下步骤：

1. 从 `compile.js` 导入合约文件
1. [设置 Ethers 提供程序](#setting-up-the-ethers-provider)
1. 定义源账户的 `privateKey`。创建钱包实例需要私钥。**注意：这仅用于示例目的。切勿将您的私钥存储在 JavaScript 文件中**
1. 使用前面步骤中的 `privateKey` 和 `provider` 创建一个钱包。钱包实例用于签署交易
1. 加载已编译合约的合约 `bytecode` 和 `abi`
1. 使用 `ethers.ContractFactory` 函数创建一个带有签名者的合约实例，提供 `abi`、`bytecode` 和 `wallet` 作为参数
1. 创建将用于部署合约的异步 `deploy` 函数
1. 在 `deploy` 函数中，使用 `incrementer` 合约实例调用 `deploy` 并传入初始值。对于此示例，您可以将初始值设置为 `5`。这将发送用于合约部署的交易。要等待交易收据，您可以使用合约部署交易的 `deployed` 方法
1. 最后，运行 `deploy` 函数

```js
--8<-- 'code/builders/ethereum/libraries/ethersjs/15.js'
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethers-js/deploy.js'
    ```

要运行该脚本，您可以在终端中输入以下命令：

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/16.sh'
```

如果成功，合约的地址将显示在终端中。

--8<-- 'code/builders/ethereum/libraries/ethers-js/terminal/deploy.md'

### 读取合约数据（调用方法）{: #read-contract-data }

调用方法是一种不会修改合约存储（更改变量）的交互类型，这意味着不需要发送交易。它们只是读取已部署合约的各种存储变量。

要开始，您可以创建一个文件并将其命名为 `get.js`：

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/17.sh'
```

然后，您可以按照以下步骤创建脚本：

1. 从 `compile.js` 文件导入 `abi`
1. [设置 Ethers 提供程序](#setting-up-the-ethers-provider)
1. 使用已部署合约的地址创建 `contractAddress` 变量
1. 使用 `ethers.Contract` 函数创建一个合约实例，并传入 `contractAddress`、`abi` 和 `provider`
1. 创建异步 `get` 函数
1. 使用合约实例调用合约的其中一个方法，并在必要时传入任何输入。对于此示例，您将调用不需要任何输入的 `number` 方法。您可以使用 `await`，它将在请求 promise resolve 后返回请求的值
1. 最后，调用 `get` 函数

```js
--8<-- 'code/builders/ethereum/libraries/ethersjs/18.js'
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethers-js/get.js'
    ```

要运行该脚本，您可以在终端中输入以下命令：

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/19.sh'
```

如果成功，该值将显示在终端中。

### 与合约交互（发送方法）{: #interact-with-contract }

发送方法是修改合约存储（更改变量）的交互类型，这意味着需要签名并发送交易。在本节中，您将创建两个脚本：一个用于递增，一个用于重置递增器。要开始，您可以为每个脚本创建一个文件，并将它们命名为 `increment.js` 和 `reset.js`：

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/20.sh'
```

打开 `increment.js` 文件，并按照以下步骤创建脚本：

1. 从 `compile.js` 文件导入 `abi`
1. [设置 Ethers 提供程序](#setting-up-the-ethers-provider)
1. 定义原始帐户的 `privateKey`、已部署合约的 `contractAddress` 和要递增的 `_value`。需要私钥来创建钱包实例。**注意：这仅用于示例目的。切勿将您的私钥存储在 JavaScript 文件中**
1. 使用上一步骤中的 `privateKey` 和 `provider` 创建一个钱包。钱包实例用于对交易进行签名
1. 使用 `ethers.Contract` 函数创建一个合约实例，并传入 `contractAddress`、`abi` 和 `provider`
1. 创建异步 `increment` 函数
1. 使用合约实例调用合约的方法之一，并在必要时传入任何输入。对于此示例，您将调用 `increment` 方法，该方法需要要递增的值作为输入。您可以使用 `await`，它将在请求 promise 解析后返回所请求的值
1. 最后，调用 `increment` 函数

```js
--8<-- 'code/builders/ethereum/libraries/ethersjs/21.js'
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethers-js/increment.js'
    ```

要运行该脚本，您可以在终端中输入以下命令：

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/22.sh'
```

如果成功，交易哈希将显示在终端中。您可以将 `get.js` 脚本与 `increment.js` 脚本一起使用，以确保值按预期更改：

--8<-- 'code/builders/ethereum/libraries/ethers-js/terminal/increment.md'

接下来，您可以打开 `reset.js` 文件，并按照以下步骤创建脚本：

1. 从 `compile.js` 文件导入 `abi`
1. [设置 Ethers 提供程序](#setting-up-the-ethers-provider)
1. 定义原始帐户的 `privateKey` 和已部署合约的 `contractAddress`。需要私钥来创建钱包实例。**注意：这仅用于示例目的。切勿将您的私钥存储在 JavaScript 文件中**
1. 使用上一步骤中的 `privateKey` 和 `provider` 创建一个钱包。钱包实例用于对交易进行签名
1. 使用 `ethers.Contract` 函数创建一个合约实例，并传入 `contractAddress`、`abi` 和 `provider`
1. 创建异步 `reset` 函数
1. 使用合约实例调用合约的方法之一，并在必要时传入任何输入。对于此示例，您将调用 `reset` 方法，该方法不需要任何输入。您可以使用 `await`，它将在请求 promise 解析后返回所请求的值
1. 最后，调用 `reset` 函数

```js
--8<-- 'code/builders/ethereum/libraries/ethersjs/23.js'
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethers-js/reset.js'
    ```

要运行该脚本，您可以在终端中输入以下命令：

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/24.sh'
```

如果成功，交易哈希将显示在终端中。您可以将 `get.js` 脚本与 `reset.js` 脚本一起使用，以确保值按预期更改：

--8<-- 'code/builders/ethereum/libraries/ethers-js/terminal/reset.md'

--8<-- 'zh/text/_disclaimers/third-party-content.md'
