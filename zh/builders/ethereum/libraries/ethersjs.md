---
title: 如何使用 Ethers.js 以太坊库
description: 请按照本教程学习如何使用以太坊 Ethers.js 库来发送交易，并将 Solidity 智能合约部署到 Moonbeam。
categories: Libraries and SDKs, Ethereum Toolkit
---

# Ethers.js JavaScript 库

## 简介 {: #introduction }

[Ethers.js](https://docs.ethers.org/v6){target=_blank} 库提供了一组使用 JavaScript 与以太坊节点交互的工具，类似于 Web3.js。Moonbeam 有一个类似于以太坊的 API，它与以太坊风格的 JSON-RPC 调用完全兼容。因此，开发人员可以利用这种兼容性，并使用 Ethers.js 库与 Moonbeam 节点交互，就像在以太坊上进行交互一样。有关 Ethers.js 的更多信息，请查看其[文档站点](https://docs.ethers.org/v6){target=_blank}。

在本指南中，您将学习如何使用 Ethers.js 库在 Moonbase Alpha 上发送交易和部署合约。本指南适用于 [Moonbeam](/builders/get-started/networks/moonbeam/){target=_blank}、[Moonriver](/builders/get-started/networks/moonriver/){target=_blank} 或 [Moonbeam 开发节点](/builders/get-started/networks/moonbeam-dev/){target=_blank}。

## 检查先决条件 {: #checking-prerequisites }

对于本指南中的示例，您需要具备以下条件：

- 一个有资金的帐户。
  --8<-- 'text/_common/faucet/faucet-list-item.md'
- 
  --8<-- 'text/_common/endpoint-examples-list-item.md'

!!! note
    --8<-- 'text/_common/assumes-mac-or-ubuntu-env.md'

## 安装 Ethers.js {: #install-ethersjs }

首先，你需要启动一个基本的 JavaScript 项目。首先，创建一个目录来存储你将在本指南中创建的所有文件，并使用以下命令初始化项目：

bash
mkdir ethers-examples && cd ethers-examples && npm init --y

在本指南中，你需要安装 Ethers.js 库和 Solidity 编译器。要安装这两个 NPM 包，你可以运行以下命令：

=== "npm"

    bash
    npm install ethers solc@0.8.30
    

=== "yarn"

    bash
    yarn add ethers solc@0.8.30

## 设置 Ethers Provider {: #setting-up-the-ethers-provider }

在本指南中，您将创建许多脚本，这些脚本提供不同的功能，例如发送交易、部署合约以及与已部署的合约进行交互。在大多数这些脚本中，您需要创建一个 [Ethers provider](https://docs.ethers.org/v6/api/providers/){target=_blank} 以与网络进行交互。

--8<-- 'text/_common/endpoint-setup.md'

要创建 provider，您可以采取以下步骤：

1. 导入 `ethers` 库
2. 定义 `providerRPC` 对象，该对象可以包括您要在其上发送交易的任何网络的网络配置。您将包括每个网络的 `name`、`rpc` 和 `chainId`
3. 使用 `ethers.JsonRpcProvider` 方法创建 `provider`

===

    ```js
    // 1. 导入 ethers
    const ethers = require('ethers');

    // 2. 定义网络配置
    const providerRPC = {
      moonbeam: {
        name: 'moonbeam',
        rpc: '{{ networks.moonbeam.rpc_url }}', // 在此处插入您的 RPC URL
        chainId: {{ networks.moonbeam.chain_id }}, // {{ networks.moonbeam.hex_chain_id }}，以十六进制表示
      },
    };
    // 3. 创建 ethers provider
    const provider = new ethers.JsonRpcProvider(providerRPC.moonbeam.rpc, {
      chainId: providerRPC.moonbeam.chainId,
      name: providerRPC.moonbeam.name,
    });
    ```

===

    ```js
    // 1. 导入 ethers
    const ethers = require('ethers');

    // 2. 定义网络配置
    const providerRPC = {
      moonriver: {
        name: 'moonriver',
        rpc: '{{ networks.moonriver.rpc_url }}', // 在此处插入您的 RPC URL
        chainId: {{ networks.moonriver.chain_id }}, // {{ networks.moonriver.hex_chain_id }}，以十六进制表示
      },
    };
    // 3. 创建 ethers provider
    const provider = new ethers.JsonRpcProvider(providerRPC.moonriver.rpc, {
      chainId: providerRPC.moonriver.chainId,
      name: providerRPC.moonriver.name,
    });
    ```

===

    ```js
    // 1. 导入 ethers
    const ethers = require('ethers');

    // 2. 定义网络配置
    const providerRPC = {
      moonbase: {
        name: 'moonbase-alpha',
        rpc: '{{ networks.moonbase.rpc_url }}',
        chainId: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }}，以十六进制表示
      },
    };
    // 3. 创建 ethers provider
    const provider = new ethers.JsonRpcProvider(providerRPC.moonbase.rpc, {
      chainId: providerRPC.moonbase.chainId,
      name: providerRPC.moonbase.name,
    });
    ```

===

    ```js
    // 1. 导入 ethers
    const ethers = require('ethers');

    // 2. 定义网络配置
    const providerRPC = {
      dev: {
        name: 'moonbeam-development',
        rpc: '{{ networks.development.rpc_url }}',
        chainId: {{ networks.development.chain_id }}, // {{ networks.development.hex_chain_id }}，以十六进制表示
      },
    };
    // 3. 创建 ethers provider
    const provider = new ethers.JsonRpcProvider(providerRPC.dev.rpc, {
      chainId: providerRPC.dev.chainId,
      name: providerRPC.dev.name,
    });
    ```

保存此代码段，因为您将在以下各节中使用的脚本中需要它。

## 发送交易 {: #send-a-transaction }

在本节中，您将创建几个脚本。第一个脚本用于在尝试发送交易之前检查您的帐户余额。第二个脚本将实际发送交易。

您还可以使用余额脚本来检查交易发送后的帐户余额。

### 发送交易脚本 {: #send-transaction-script }

您只需要一个文件即可执行帐户之间的交易。在此示例中，您将从原始地址（您持有私钥的地址）向另一个地址转移 1 个 DEV 代币。首先，您可以运行以下命令来创建 `transaction.js` 文件：

bash
touch transaction.js

接下来，您将为此文件创建脚本并完成以下步骤：

1. [设置 Ethers 提供程序](#setting-up-the-ethers-provider)
2. 定义 `privateKey` 和 `addressTo` 变量。需要私钥才能创建钱包实例。**注意：这仅用于示例目的。切勿将您的私钥存储在 JavaScript 文件中**
3. 使用上一步中的 `privateKey` 和 `provider` 创建一个钱包。钱包实例用于签署交易
4. 创建异步 `send` 函数，该函数包装交易对象和 `wallet.sendTransaction` 方法
5. 创建交易对象，该对象仅需要收件人的地址和要发送的金额。请注意，可以使用 `ethers.parseEther`，它可以处理从 Ether 到 Wei 的必要单位转换 - 类似于使用 `ethers.parseUnits(value, 'ether')`
6. 使用 `wallet.sendTransaction` 方法发送交易，然后使用 `await` 等待直到交易被处理并且返回交易收据
7. 最后，运行 `send` 函数

js
// 1. 在此处添加 Ethers 提供程序逻辑：
// {...}

// 2. 创建帐户变量
const accountFrom = {
  privateKey: 'INSERT_YOUR_PRIVATE_KEY',
};
const addressTo = 'INSERT_TO_ADDRESS';

// 3. 创建钱包
let wallet = new ethers.Wallet(accountFrom.privateKey, provider);

// 4. 创建发送函数
const send = async () => {
  console.log(`Attempting to send transaction from ${wallet.address} to ${addressTo}`);

  // 5. 创建 tx 对象
  const tx = {
    to: addressTo,
    value: ethers.parseEther('1'),
  };

  // 6. 签名并发送 tx - 等待收据
  const createReceipt = await wallet.sendTransaction(tx);
  await createReceipt.wait();
  console.log(`Transaction successful with hash: ${createReceipt.hash}`);
};

// 7. 调用发送函数
send();

??? code "查看完整脚本"

    js
    --8<-- 'code/builders/ethereum/libraries/ethers-js/transaction.js'
    

要运行脚本，您可以在终端中运行以下命令：

bash
node transaction.js

如果交易成功，您将在终端中看到已打印出交易哈希。

您还可以使用 `balances.js` 脚本来检查原始帐户和接收帐户的余额是否已更改。整个工作流程如下所示：

--8<-- 'code/builders/ethereum/libraries/ethers-js/terminal/transaction.md'

## 部署合约 {: #deploy-a-contract }

--8<-- 'text/builders/ethereum/libraries/contract.md'

### 编译合约脚本 {: #compile-contract-script }

--8<-- 'text/builders/ethereum/libraries/compile-js.md'
--8<-- 'text/builders/ethereum/libraries/compile.md'

js
--8<-- 'code/builders/ethereum/libraries/compile.js'
