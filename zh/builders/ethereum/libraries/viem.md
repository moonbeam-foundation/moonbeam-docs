---
title: 如何使用 viem Ethereum 库
description: 查看本教程，了解如何使用 viem TypeScript 接口与以太坊交互，以便将交易发送和把 Solidity 智能合约部署到 Moonbeam。
categories: 库和 SDK, Ethereum Toolkit
---


# viem TypeScript Ethereum库

## 介绍 {: #introduction }

[viem](https://viem.sh){target=\_blank} 是一个模块化的 TypeScript 库，允许开发人员通过 JSON-RPC API 与抽象进行交互，从而轻松地与 Ethereum 节点进行交互。由于 Moonbeam 具有类似于 Ethereum 的 API，并且完全兼容 Ethereum 风格的 JSON RPC 调用，因此开发人员可以利用此兼容性与 Moonbeam 节点进行交互。有关 viem 的更多信息，请查看他们的[文档站点](https://viem.sh/docs/getting-started){target=\_blank}。

在本指南中，您将学习如何使用 viem 在 Moonbase Alpha TestNet 上发送交易和部署合约。本指南适用于 [Moonbeam](/builders/get-started/networks/moonbeam/){target=\_blank}、[Moonriver](/builders/get-started/networks/moonriver/){target=\_blank} 或 [Moonbeam 开发节点](/builders/get-started/networks/moonbeam-dev/){target=\_blank}。

## 检查先决条件 {: #checking-prerequisites }

对于本指南中的示例，您需要具备以下条件：

- 拥有资金的帐户。
    --8<-- 'zh/text/_common/faucet/faucet-list-item.md'
- --8<-- 'zh/text/_common/endpoint-examples-list-item.md'

!!! note

    --8<-- 'zh/text/_common/assumes-mac-or-ubuntu-env.md'

## 安装 viem {: #installing-viem }

要开始使用，您需要创建一个基本的 TypeScript 项目。首先，创建一个目录来存储您将在本指南中创建的所有文件，并使用以下命令初始化项目：

```bash
--8<-- 'code/builders/ethereum/libraries/viem/1.sh'
```

对于本指南，您需要安装 viem 库和 Solidity 编译器。要安装这两个软件包，您可以运行以下命令：

=== "npm"

    ```bash
    --8<-- 'code/builders/ethereum/libraries/viem/2.sh'
    ```

=== "yarn"

    ```bash
    --8<-- 'code/builders/ethereum/libraries/viem/3.sh'
    ```

您可以通过运行以下命令来创建 TypeScript 配置文件：

```bash
--8<-- 'code/builders/ethereum/libraries/viem/4.sh'
```

!!! note

    本教程是使用 Node.js v18.18.0 创建的。

## 设置 viem 客户端（Provider） {: #setting-up-a-viem-provider }

在本指南中，你将创建许多提供不同功能的脚本，例如发送交易、部署合约以及与已部署的合约进行交互。在大多数这些脚本中，你需要创建一个 [viem 客户端](https://docs.ethers.org/v6/api/providers/){target=\_blank} 以与网络进行交互。

--8<-- 'zh/text/_common/endpoint-setup.md'

你可以使用 `createPublicClient` 函数创建一个 viem 客户端来读取链数据，例如余额或合约数据，或者你可以使用 `createWalletClient` 函数创建一个 viem 客户端来写入链数据，例如发送交易。

### 用于读取链数据 {: #for-reading-chain-data }

要创建用于读取链数据的客户端，您可以采取以下步骤：

1. 从 `viem` 导入 `createPublicClient` 和 `http` 函数，并从 `viem/chains` 导入您要与之交互的网络。链可以是以下任何一种：`moonbeam`、`moonriver` 或 `moonbaseAlpha`
1. 使用 `createPublicClient` 函数创建 `client`，并传入网络和 HTTP RPC 端点

=== "Moonbeam"

    ```ts
    --8<-- 'code/builders/ethereum/libraries/viem/5.ts'
    ```

=== "Moonriver"

    ```ts
    --8<-- 'code/builders/ethereum/libraries/viem/6.ts'
    ```

=== "Moonbase Alpha"

    ```ts
    --8<-- 'code/builders/ethereum/libraries/viem/7.ts'
    ```

=== "Moonbeam Dev Node"

    ```ts
    --8<-- 'code/builders/ethereum/libraries/viem/8.ts'
    ```

### 用于写入链数据 {: #for-writing-chain-data }

要创建一个用于写入链数据的客户端，您可以采取以下步骤：

1. 从 `viem` 导入 `createWalletClient` 和 `http` 函数，从 `viem/accounts` 导入 `privateKeyToAccount` 函数以通过私钥加载您的帐户，并从 `viem/chains` 导入您要与之交互的网络。链可以是以下任何一种：`moonbeam`、`moonriver` 或 `moonbaseAlpha`
1. 使用 `privateKeyToAccount` 函数创建您的帐户
1. 使用 `createWalletClient` 函数创建 `client`，并传入帐户、网络和 HTTP RPC 端点

!!! remember

    这仅用于演示目的。切勿将您的私钥存储在 TypeScript 文件中。

=== "Moonbeam"

    ```ts
    --8<-- 'code/builders/ethereum/libraries/viem/9.ts'
    ```

=== "Moonriver"

    ```ts
    --8<-- 'code/builders/ethereum/libraries/viem/10.ts'
    ```

=== "Moonbase Alpha"

    ```ts
    --8<-- 'code/builders/ethereum/libraries/viem/11.ts'
    ```

=== "Moonbeam Dev Node"

    ```ts
    --8<-- 'code/builders/ethereum/libraries/viem/12.ts'
    ```

!!! note

    要与基于浏览器的钱包进行交互，您可以使用以下代码创建一个帐户：

    ```ts
    --8<-- 'code/builders/ethereum/libraries/viem/13.ts'
    ```

## 发送交易 {: #send-transaction }

在本节中，您将创建几个脚本。第一个脚本用于在尝试发送交易之前检查您帐户的余额。第二个脚本实际上将发送交易。

您还可以使用余额脚本来检查交易发送后的帐户余额。

### 检查余额脚本 {: #check-balances-script }

您只需要一个文件即可在发送交易之前和之后检查两个地址的余额。要开始，您可以通过运行以下命令创建一个 `balances.ts` 文件：

```bash
--8<-- 'code/builders/ethereum/libraries/viem/14.sh'
```

接下来，您将为此文件创建脚本并完成以下步骤：

1. 更新您的导入，以包括来自 `viem` 的 `createPublicClient`、`http` 和 `formatEther` 函数，以及您想要从 `viem/chains` 交互的网络
1. [设置一个公共 viem 客户端](#for-reading-chain-data)，该客户端可用于读取链数据，例如帐户余额
1. 定义 `addressFrom` 和 `addressTo` 变量
1. 创建包装 `publicClient.getBalance` 方法的异步 `balances` 函数
1. 使用 `publicClient.getBalance` 函数获取 `addressFrom` 和 `addressTo` 地址的余额。您还可以利用 `formatEther` 函数将余额转换为更易于阅读的数字（以 GLMR、MOVR 或 DEV 为单位）
1. 最后，运行 `balances` 函数

```ts
--8<-- 'code/builders/ethereum/libraries/viem/balances.ts'
```

要运行脚本并获取帐户余额，您可以运行以下命令：

```bash
--8<-- 'code/builders/ethereum/libraries/viem/15.sh'
```

如果成功，则原始地址和接收地址的余额将以 DEV 形式显示在您的终端中。

--8<-- 'code/builders/ethereum/libraries/viem/terminal/balances.md'

### 发送交易脚本 {: #send-transaction-script }

您只需要一个文件即可在账户之间执行交易。本示例将从源地址（您持有其私钥）向另一个地址转账 1 个 DEV 代币。首先，可以通过运行以下命令创建 `transaction.ts` 文件：

```bash
--8<-- 'code/builders/ethereum/libraries/viem/16.sh'
```

接下来，创建该文件的脚本并完成以下步骤：

1. 更新导入，包含来自 `viem` 的 `createWalletClient`、`http` 和 `parseEther`，来自 `viem/accounts` 的 `privateKeyToAccount`，以及来自 `viem/chains` 的目标网络
1. [设置一个 viem 钱包客户端](#for-writing-chain-data) 用于写入链数据，它将与您的私钥一起用于发送交易。**注意：这仅用于示例目的。切勿将您的私钥存储在 TypeScript 文件中**
1. [设置一个公共 viem 客户端](#for-reading-chain-data) 用于读取链数据，它将用于等待交易收据
1. 定义 `addressTo` 变量
1. 创建异步 `send` 函数，该函数包装交易对象和 `walletClient.sendTransaction` 方法
1. 使用 `walletClient.sendTransaction` 函数签名并发送交易。需要传入交易对象，只需包含接收方地址和发送金额即可。注意可以使用 `parseEther`，它会处理从 Ether 到 Wei 的单位转换，类似于使用 `parseUnits(value, decimals)`。使用 `await` 等待交易处理完毕并返回交易哈希
1. 使用 `publicClient.waitForTransactionReceipt` 函数等待交易收据，表示交易已完成。如果您需要交易收据，或者在此脚本之后直接运行 `balances.ts` 脚本以检查余额是否按预期更新，这将特别有用
1. 最后，运行 `send` 函数

```ts
--8<-- 'code/builders/ethereum/libraries/viem/transaction.ts'
```

要运行该脚本，您可以在终端中运行以下命令：

```bash
--8<-- 'code/builders/ethereum/libraries/viem/17.sh'
```

如果交易成功，您会在终端中看到交易哈希被打印出来。

!!! note

    viem 要求在私钥前加上 `0x` 前缀。许多钱包会省略这个 `0x`，因此在替换 `INSERT_PRIVATE_KEY` 时请确认已包含它。

您还可以使用 `balances.ts` 脚本来检查源账户和接收账户的余额是否已更改。整个工作流程如下所示：

--8<-- 'code/builders/ethereum/libraries/viem/terminal/transaction.md'

## 部署合约 {: #deploy-contract }

--8<-- 'zh/text/builders/ethereum/libraries/contract.md'

### 编译合约脚本 {: #compile-contract-script }

--8<-- 'zh/text/builders/ethereum/libraries/compile-ts.md'

--8<-- 'zh/text/builders/ethereum/libraries/compile.md'


--8<-- 'code/builders/ethereum/libraries/compile.ts'

### 部署合约脚本 {: #deploy-contract-script }

有了用于编译 `Incrementer.sol` 合约的脚本，您就可以使用结果发送已签名的交易来部署它。为此，您可以创建一个名为 `deploy.ts` 的部署脚本文件：

```bash
--8<-- 'code/builders/ethereum/libraries/viem/18.sh'
```

接下来，您将为此文件创建脚本并完成以下步骤：

1. 更新您的导入，以包括来自 `viem` 的 `createPublicClient`、`createWalletClient` 和 `http` 函数，来自 `viem/accounts` 的 `privateKeyToAccount` 函数，您要与之交互的来自 `viem/chains` 的网络，以及您在 [编译合约脚本](#compile-contract-script) 部分中创建的 `compile.ts` 文件中的 `contractFile`。
1. [设置一个 viem 钱包客户端](#for-writing-chain-data) 以写入链数据，该客户端将与您的私钥一起用于部署 `Incrementer` 合约。**注意：这仅用于示例目的。切勿在 TypeScript 文件中存储您的私钥**
1. [设置一个公共 viem 客户端](#for-reading-chain-data) 以读取链数据，该客户端将用于读取部署的交易收据
1. 加载已编译合约的合约 `bytecode` 和 `abi`
1. 创建异步 `deploy` 函数，该函数将用于通过 `walletClient.deployContract` 方法部署合约
1. 使用 `walletClient.deployContract` 函数来签名和发送交易。您需要传入合约的 ABI 和字节码、用于部署交易的帐户以及增量器的初始值。使用 `await` 等待，直到处理完交易并返回交易哈希
1. 使用 `publicClient.readContract` 函数获取部署的交易收据。使用 `await` 等待，直到处理完交易并返回合约地址
1. 最后，运行 `deploy` 函数

```ts
--8<-- 'code/builders/ethereum/libraries/viem/deploy.ts'
```

要运行脚本，您可以在终端中输入以下命令：

```bash
--8<-- 'code/builders/ethereum/libraries/viem/19.sh'
```

如果成功，合约的地址将显示在终端中。

--8<-- 'code/builders/ethereum/libraries/viem/terminal/deploy.md'

### 读取合约数据（调用方法）{: #read-contract-data }

调用方法不会修改合约存储（更改变量），因此无需发送交易。它们只是读取已部署合约的各种存储变量。

要开始，您可以创建一个文件并命名为 `get.ts`：

```bash
--8<-- 'code/builders/ethereum/libraries/viem/20.sh'
```

然后按照以下步骤创建脚本：

1. 更新导入，包含来自 `viem` 的 `createPublicClient` 和 `http`，来自 `viem/chains` 的目标网络，以及您在[编译合约脚本](#compile-contract-script)部分创建的 `compile.ts` 文件中的 `contractFile`
1. [设置一个公共 viem 客户端](#for-reading-chain-data) 用于读取链数据，将用于读取 `Incrementer` 合约的当前值
1. 使用已部署合约的地址创建 `contractAddress` 变量，并使用 `compile.ts` 文件中的 `contractFile` 创建 `abi` 变量
1. 创建异步 `get` 函数
1. 使用 `publicClient.readContract` 调用合约，传入 `abi`、函数名称、`contractAddress` 以及任何参数（如需）。使用 `await`，在请求 promise 解析后返回所需的值
1. 最后，调用 `get` 函数

```ts
--8<-- 'code/builders/ethereum/libraries/viem/get.ts'
```

要运行脚本，您可以在终端中输入以下命令：

```bash
--8<-- 'code/builders/ethereum/libraries/viem/21.sh'
```

如果成功，该值将显示在终端中。

--8<-- 'code/builders/ethereum/libraries/viem/terminal/get.md'

### 与合约交互（发送方法）{: #interact-with-contract }

发送方法是修改合约存储（更改变量）的交互类型，这意味着需要签名并发送交易。在本节中，您将创建两个脚本：一个用于递增，一个用于重置递增器。要开始，您可以为每个脚本创建一个文件，并将它们命名为 `increment.ts` 和 `reset.ts`：

```bash
--8<-- 'code/builders/ethereum/libraries/viem/22.sh'
```

打开 `increment.ts` 文件，并按照以下步骤创建脚本：

1. 更新您的导入，以包括来自 `viem` 的 `createWalletClient` 和 `http` 函数、您想要与之交互的来自 `viem/chains` 的网络，以及您在 [编译合约脚本](#compile-contract-script) 部分中创建的 `compile.ts` 文件中的 `contractFile`
1. [设置一个 viem 钱包客户端](#for-writing-chain-data) 用于写入链数据，它将与您的私钥一起用于发送交易。**注意：这仅用于示例目的。切勿将您的私钥存储在 TypeScript 文件中**
1. [设置一个公共 viem 客户端](#for-reading-chain-data) 用于读取链数据，它将用于等待交易收据
1. 使用已部署合约的地址创建 `contractAddress` 变量，使用 `compile.ts` 文件中的 `contractFile` 创建 `abi` 变量，并创建 `_value` 以按其递增合约
1. 创建异步 `increment` 函数
1. 使用 `walletClient.writeContract` 函数调用合约，传入 `abi`、函数名称、`contractAddress` 和 `_value`。您可以使用 `await`，它将在请求 Promise 解析后返回交易哈希
1. 使用 `publicClient.waitForTransactionReceipt` 函数等待交易收据，表示交易已完成。如果您需要交易收据，或者如果您在此脚本之后直接运行 `get.ts` 脚本以检查当前数字是否已按预期更新，这将特别有用
1. 最后，调用 `increment` 函数

```js
--8<-- 'code/builders/ethereum/libraries/viem/increment.ts'
```

要运行脚本，您可以在终端中输入以下命令：

```bash
--8<-- 'code/builders/ethereum/libraries/viem/23.sh'
```

如果成功，交易哈希将显示在终端中。您可以将 `get.ts` 脚本与 `increment.ts` 脚本一起使用，以确保该值按预期更改。

--8<-- 'code/builders/ethereum/libraries/viem/terminal/increment.md'

接下来，您可以打开 `reset.ts` 文件，并按照以下步骤创建脚本：

1. 更新您的导入，以包括来自 `viem` 的 `createWalletClient` 和 `http` 函数、您想要与之交互的来自 `viem/chains` 的网络，以及您在 [编译合约脚本](#compile-contract-script) 部分中创建的 `compile.ts` 文件中的 `contractFile`
1. [设置一个 viem 钱包客户端](#for-writing-chain-data) 用于写入链数据，它将与您的私钥一起用于发送交易。**注意：这仅用于示例目的。切勿将您的私钥存储在 TypeScript 文件中**
1. [设置一个公共 viem 客户端](#for-reading-chain-data) 用于读取链数据，它将用于等待交易收据
1. 使用已部署合约的地址创建 `contractAddress` 变量，并使用 `compile.ts` 文件中的 `contractFile` 创建 `abi` 变量，以按其递增合约
1. 创建异步 `reset` 函数
1. 使用 `walletClient.writeContract` 函数调用合约，传入 `abi`、函数名称、`contractAddress` 和一个空数组作为参数。您可以使用 `await`，它将在请求 Promise 解析后返回交易哈希
1. 使用 `publicClient.waitForTransactionReceipt` 函数等待交易收据，表示交易已完成。如果您需要交易收据，或者如果您在此脚本之后直接运行 `get.ts` 脚本以检查当前数字是否已重置为 `0`，这将特别有用
1. 最后，调用 `reset` 函数

```ts
--8<-- 'code/builders/ethereum/libraries/viem/reset.ts'
```

要运行脚本，您可以在终端中输入以下命令：

```bash
--8<-- 'code/builders/ethereum/libraries/viem/24.sh'
```

如果成功，交易哈希将显示在终端中。您可以将 `get.ts` 脚本与 `reset.ts` 脚本一起使用，以确保该值按预期更改。

--8<-- 'code/builders/ethereum/libraries/viem/terminal/reset.md'

--8<-- 'zh/text/_disclaimers/third-party-content.md'
