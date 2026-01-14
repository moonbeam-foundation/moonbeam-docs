---
title: 如何使用 viem Ethereum 库
description: 查看本教程，了解如何使用以太坊的 viem TypeScript 接口发送交易并将 Solidity 智能合约部署到 Moonbeam。
categories: Libraries and SDKs, Ethereum Toolkit
---

# viem TypeScript Ethereum Library

## 简介 {: #introduction }

[viem](https://viem.sh){target=_blank} 是一个模块化的 TypeScript 库，允许开发人员与 JSON-RPC API 上的抽象进行交互，从而可以轻松地与 Ethereum 节点进行交互。由于 Moonbeam 具有类似于 Ethereum 的 API，该 API 与 Ethereum 风格的 JSON RPC 调用完全兼容，因此开发人员可以利用此兼容性与 Moonbeam 节点进行交互。有关 viem 的更多信息，请查看他们的[文档网站](https://viem.sh/docs/getting-started){target=_blank}。

在本指南中，您将学习如何使用 viem 在 Moonbase Alpha 测试网上发送交易和部署合约。本指南适用于 [Moonbeam](/builders/get-started/networks/moonbeam/){target=_blank}、[Moonriver](/builders/get-started/networks/moonriver/){target=_blank} 或 [Moonbeam 开发节点](/builders/get-started/networks/moonbeam-dev/){target=_blank}。

## 检查先决条件 {: #checking-prerequisites }

对于本指南中的示例，您需要具备以下条件：

- 一个有资金的帐户。
  --8<-- 'text/_common/faucet/faucet-list-item.md'
- 
  --8<-- 'text/_common/endpoint-examples-list-item.md'

!!! note
    --8<-- 'text/_common/assumes-mac-or-ubuntu-env.md'

## 安装 viem {: #installing-viem }

首先，您需要创建一个基本的 TypeScript 项目。首先，创建一个目录来存储您在本指南中创建的所有文件，并使用以下命令初始化项目：

bash
mkdir viem-examples && cd viem-examples && npm init --y

对于本指南，您需要安装 viem 库和 Solidity 编译器。要安装这两个软件包，您可以运行以下命令：

==="npm"

    bash
    npm install typescript ts-node viem solc@0.8.30
    

==="yarn"

    bash
    yarn add typescript ts-node viem solc@0.8.30
    

您可以通过运行以下命令来创建 TypeScript 配置文件：

bash
npx tsc --init

!!! note
    本教程是使用 Node.js v18.18.0 创建的。

## 设置一个 viem 客户端 (Provider) {: #setting-up-a-viem-provider }

在本指南中，你将创建许多提供不同功能的脚本，例如发送交易、部署合约以及与已部署的合约进行交互。在大多数这些脚本中，你需要创建一个 [viem 客户端](https://docs.ethers.org/v6/api/providers/){target=_blank} 来与网络进行交互。

--8<-- 'text/_common/endpoint-setup.md'

你可以使用 `createPublicClient` 函数创建一个 viem 客户端来读取链上数据，如余额或合约数据，或者你可以使用 `createWalletClient` 函数创建一个 viem 客户端来写入链上数据，如发送交易。

### 用于读取链数据 {: #for-reading-chain-data }

要创建用于读取链数据的客户端，您可以采取以下步骤：

1. 从 `viem` 导入 `createPublicClient` 和 `http` 函数，并从 `viem/chains` 导入您想要交互的网络。链可以是以下任何一个：`moonbeam`、`moonriver` 或 `moonbaseAlpha`
2. 使用 `createPublicClient` 函数创建 `client`，并传入网络和 HTTP RPC 端点

===

    ts
    import { createPublicClient, http } from 'viem';
    import { moonbeam } from 'viem/chains';

    const rpcUrl = '{{ networks.moonbeam.rpc_url }}'
    const publicClient = createPublicClient({
      chain: moonbeam,
      transport: http(rpcUrl),
    });
    

===

    ts
    import { createPublicClient, http } from 'viem';
    import { moonriver } from 'viem/chains';

    const rpcUrl = '{{ networks.moonriver.rpc_url }}'
    const publicClient = createPublicClient({
      chain: moonriver,
      transport: http(rpcUrl),
    });
    

===

    ts
    import { createPublicClient, http } from 'viem';
    import { moonbaseAlpha } from 'viem/chains';

    const rpcUrl = '{{ networks.moonbase.rpc_url }}'
    const publicClient = createPublicClient({
      chain: moonbaseAlpha,
      transport: http(rpcUrl),
    });
    

===

    ts
    import { createPublicClient, http } from 'viem';
    import { moonbeamDev } from 'viem/chains';

    const rpcUrl = '{{ networks.development.rpc_url }}'
    const publicClient = createPublicClient({
      chain: moonbeamDev,
      transport: http(rpcUrl),
    })

### 用于写入链数据 {: #for-writing-chain-data }

要创建一个用于写入链数据的客户端，您可以采取以下步骤：

1. 从 `viem` 导入 `createWalletClient` 和 `http` 函数，从 `viem/accounts` 导入 `privateKeyToAccount` 函数以通过其私钥加载您的帐户，以及从 `viem/chains` 导入您要与之交互的网络。该链可以是以下任何一种：`moonbeam`、`moonriver` 或 `moonbaseAlpha`
2. 使用 `privateKeyToAccount` 函数创建您的帐户
3. 使用 `createWalletClient` 函数创建 `client`，并传入帐户、网络和 HTTP RPC 端点

!!! remember
    这仅用于演示目的。切勿将您的私钥存储在 TypeScript 文件中。

===

    ts
    import { createWalletClient, http } from 'viem';
    import { privateKeyToAccount } from 'viem/accounts';
    import { moonbeam } from 'viem/chains';

    const account = privateKeyToAccount('INSERT_PRIVATE_KEY');
    const rpcUrl = '{{ networks.moonbeam.rpc_url }}'
    const walletClient = createWalletClient({
      account,
      chain: moonbeam,
      transport: http(rpcUrl),
    });
    

===

    ts
    import { createWalletClient, http } from 'viem';
    import { privateKeyToAccount } from 'viem/accounts';
    import { moonriver } from 'viem/chains';

    const account = privateKeyToAccount('INSERT_PRIVATE_KEY');
    const rpcUrl = '{{ networks.moonriver.rpc_url }}'
    const walletClient = createWalletClient({
      account,
      chain: moonriver,
      transport: http(rpcUrl),
    });
    

===

    ts
    import { createWalletClient, http } from 'viem';
    import { privateKeyToAccount } from 'viem/accounts';
    import { moonbaseAlpha } from 'viem/chains';

    const account = privateKeyToAccount('INSERT_PRIVATE_KEY');
    const rpcUrl = '{{ networks.moonbase.rpc_url }}'
    const walletClient = createWalletClient({
      account,
      chain: moonbaseAlpha,
      transport: http(rpcUrl),
    });
    

===

    ts
    import { createWalletClient, http } from 'viem';
    import { privateKeyToAccount } from 'viem/accounts';
    import { moonbeamDev } from 'viem/chains';

    const account = privateKeyToAccount('INSERT_PRIVATE_KEY');
    const rpcUrl = '{{ networks.development.rpc_url }}'
    const walletClient = createWalletClient({
      account,
      chain: moonbeamDev,
      transport: http(rpcUrl),
    });
    

!!! note
    要与基于浏览器的钱包进行交互，您可以使用以下代码创建一个帐户：

    ts
    const [account] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    const walletClient = createWalletClient({
      account,
      chain: moonbeam,
      transport: custom(window.ethereum),
    });

## 发送交易 {: #send-transaction }

在本节中，您将创建几个脚本。第一个脚本用于在尝试发送交易之前检查您帐户的余额。第二个脚本实际上会发送交易。

您还可以使用余额脚本来检查交易发送后的帐户余额。

### 检查余额脚本 {: #check-balances-script }

您只需要一个文件来检查交易发送前后两个地址的余额。首先，您可以通过运行以下命令创建一个 `balances.ts` 文件：

bash
touch balances.ts

接下来，您将为此文件创建脚本并完成以下步骤：

1. 更新您的导入，以包括来自 `viem` 的 `createPublicClient`、`http` 和 `formatEther` 函数，以及您想要从 `viem/chains` 交互的网络
2. [设置一个公共 viem 客户端](#for-reading-chain-data)，该客户端可用于读取链数据，例如帐户余额
3. 定义 `addressFrom` 和 `addressTo` 变量
4. 创建包装 `publicClient.getBalance` 方法的异步 `balances` 函数
5. 使用 `publicClient.getBalance` 函数获取 `addressFrom` 和 `addressTo` 地址的余额。您还可以利用 `formatEther` 函数将余额转换为更易读的数字（以 GLMR、MOVR 或 DEV 为单位）
6. 最后，运行 `balances` 函数

ts
--8<-- 'code/builders/ethereum/libraries/viem/balances.ts'

要运行脚本并获取帐户余额，您可以运行以下命令：

bash
npx ts-node balances.ts

如果成功，则始发地址和接收地址的余额将以 DEV 格式显示在您的终端中。

--8<-- 'code/builders/ethereum/libraries/viem/terminal/balances.md'

## 部署合约 {: #deploy-contract }

--8<-- 'text/builders/ethereum/libraries/contract.md'

### 编译合约脚本 {: #compile-contract-script }

--8<-- 'text/builders/ethereum/libraries/compile-ts.md'
--8<-- 'text/builders/ethereum/libraries/compile.md'

js
--8<-- 'code/builders/ethereum/libraries/compile.ts'

### 与合约交互（发送方法）{: #interact-with-contract }

发送方法是修改合约存储（更改变量）的交互类型，这意味着需要签名并发送交易。在本节中，您将创建两个脚本：一个用于递增，一个用于重置递增器。首先，您可以为每个脚本创建一个文件，并将它们命名为 `increment.ts` 和 `reset.ts`：

bash
touch increment.ts reset.ts

打开 `increment.ts` 文件，并按照以下步骤创建脚本：

1. 更新您的导入，以包括 `viem` 中的 `createWalletClient` 和 `http` 函数、您要与之交互的 `viem/chains` 中的网络，以及您在 [编译合约脚本](#compile-contract-script) 部分中创建的 `compile.ts` 文件中的 `contractFile`。
2. [设置一个 viem 钱包客户端](#for-writing-chain-data) 用于写入链数据，该客户端将与您的私钥一起用于发送交易。**注意：这仅用于示例目的。切勿将您的私钥存储在 TypeScript 文件中**。
3. [设置一个公共 viem 客户端](#for-reading-chain-data) 用于读取链数据，该客户端将用于等待交易收据。
4. 使用已部署合约的地址创建 `contractAddress` 变量，使用 `compile.ts` 文件中的 `contractFile` 创建 `abi` 变量，并创建 `_value` 以递增合约。
5. 创建异步 `increment` 函数。
6. 使用 `walletClient.writeContract` 函数调用合约，传入 `abi`、函数名称、`contractAddress` 和 `_value`。您可以使用 `await`，它将在请求 Promise 解决后返回交易哈希。
7. 使用 `publicClient.waitForTransactionReceipt` 函数等待交易收据，表明交易已完成。如果您需要交易收据，或者您在此脚本之后直接运行 `get.ts` 脚本以检查当前数字是否已按预期更新，这将特别有用。
8. 最后，调用 `increment` 函数。

js
--8<-- 'code/builders/ethereum/libraries/viem/increment.ts'

要运行该脚本，您可以在终端中输入以下命令：

bash
npx ts-node increment.ts

如果成功，交易哈希将显示在终端中。您可以将 `get.ts` 脚本与 `increment.ts` 脚本一起使用，以确保该值按预期更改。

--8<-- 'code/builders/ethereum/libraries/viem/terminal/increment.md'

接下来，您可以打开 `reset.ts` 文件，并按照以下步骤创建脚本：

1. 更新您的导入，以包括 `viem` 中的 `createWalletClient` 和 `http` 函数、您要与之交互的 `viem/chains` 中的网络，以及您在 [编译合约脚本](#compile-contract-script) 部分中创建的 `compile.ts` 文件中的 `contractFile`。
2. [设置一个 viem 钱包客户端](#for-writing-chain-data) 用于写入链数据，该客户端将与您的私钥一起用于发送交易。**注意：这仅用于示例目的。切勿将您的私钥存储在 TypeScript 文件中**。
3. [设置一个公共 viem 客户端](#for-reading-chain-data) 用于读取链数据，该客户端将用于等待交易收据。
4. 使用已部署合约的地址创建 `contractAddress` 变量，并使用 `compile.ts` 文件中的 `contractFile` 创建 `abi` 变量，以递增合约。
5. 创建异步 `reset` 函数。
6. 使用 `walletClient.writeContract` 函数调用合约，传入 `abi`、函数名称、`contractAddress` 和一个空数组作为参数。您可以使用 `await`，它将在请求 Promise 解决后返回交易哈希。
7. 使用 `publicClient.waitForTransactionReceipt` 函数等待交易收据，表明交易已完成。如果您需要交易收据，或者您在此脚本之后直接运行 `get.ts` 脚本以检查当前数字是否已重置为 `0`，这将特别有用。
8. 最后，调用 `reset` 函数。

ts
--8<-- 'code/builders/ethereum/libraries/viem/reset.ts'

要运行该脚本，您可以在终端中输入以下命令：

bash
npx ts-node reset.ts

如果成功，交易哈希将显示在终端中。您可以将 `get.ts` 脚本与 `reset.ts` 脚本一起使用，以确保该值按预期更改。

--8<-- 'code/builders/ethereum/libraries/viem/terminal/reset.md'

--8<-- 'text/_disclaimers/third-party-content.md'
