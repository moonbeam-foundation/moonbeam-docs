---
title: 如何使用 Ethers.js 以太坊库
description: 按照本教程学习如何使用以太坊 Ethers.js 库来发送交易，并将 Solidity 智能合约部署到 Moonbeam。
categories: Libraries and SDKs, Ethereum Toolkit
---


## 简介 {: #introduction }

[Ethers.js](https://docs.ethers.org/v6){target=\_blank} 库提供了一组使用 JavaScript 与以太坊节点交互的工具，类似于 Web3.js。Moonbeam 有一个类似于以太坊的 API 可用，它与以太坊风格的 JSON-RPC 调用完全兼容。因此，开发人员可以利用这种兼容性，并使用 Ethers.js 库与 Moonbeam 节点交互，就像在以太坊上进行交互一样。有关 Ethers.js 的更多信息，请查看他们的[文档站点](https://docs.ethers.org/v6){target=\_blank}。

在本指南中，您将学习如何使用 Ethers.js 库在 Moonbase Alpha 上发送交易和部署合约。本指南适用于 [Moonbeam](builders/get-started/networks/moonbeam/){target=\_blank}、[Moonriver](builders/get-started/networks/moonriver/){target=\_blank} 或 [Moonbeam 开发节点](builders/get-started/networks/moonbeam-dev/){target=\_blank}。

## 检查先决条件 {: #checking-prerequisites }

在本指南的示例中，您需要具备以下条件：

- 一个有资金的帐户。
    --8<-- 'zh/text/_common/faucet/faucet-list-item.md'
    --8<-- 'zh/text/_common/endpoint-examples-list-item.md'

!!! note

    --8<-- 'zh/text/_common/assumes-mac-or-ubuntu-env.md'

## 安装 Ethers.js {: #install-ethersjs }

首先，您需要启动一个基本的 JavaScript 项目。首先，创建一个目录来存储您将在本指南中创建的所有文件，并使用以下命令初始化项目：

```bash
mkdir ethers-examples && cd ethers-examples && npm init --y
```

在本指南中，您需要安装 Ethers.js 库和 Solidity 编译器。要安装这两个 NPM 包，您可以运行以下命令：

=== "npm"

    ```bash
    npm install ethers solc@0.8.30
    ```

=== "yarn"

    ```bash
    yarn add ethers solc@0.8.30
    ```

## 设置 Ethers Provider {: #setting-up-the-ethers-provider }

在本指南中，您将创建许多脚本，这些脚本提供不同的功能，例如发送交易、部署合约以及与已部署的合约进行交互。在大多数这些脚本中，您需要创建一个 [Ethers provider](https://docs.ethers.org/v6/api/providers/){target=\_blank} 来与网络进行交互。

--8<-- 'zh/text/_common/endpoint-setup.md'

要创建一个 provider，您可以采取以下步骤：

1. 导入 `ethers` 库
2. 定义 `providerRPC` 对象，该对象可以包括您想要在其上发送交易的任何网络的网络配置。您将包括每个网络的 `name`、`rpc` 和 `chainId`
3. 使用 `ethers.JsonRpcProvider` 方法创建 `provider`

=== "Moonbeam"

```js
// 1. Import ethers
const ethers = require('ethers');

// 2. Define network configurations
const providerRPC = {
  moonbeam: {
    name: 'moonbeam',
    rpc: '{{ networks.moonbeam.rpc_url }}', // Insert your RPC URL here
    chainId: {{ networks.moonbeam.chain_id }}, // {{ networks.moonbeam.hex_chain_id }} in hex,
  },
};
// 3. Create ethers provider
const provider = new ethers.JsonRpcProvider(providerRPC.moonbeam.rpc, {
  chainId: providerRPC.moonbeam.chainId,
  name: providerRPC.moonbeam.name,
});
```

=== "Moonriver"

```js
// 1. Import ethers
const ethers = require('ethers');

// 2. Define network configurations
const providerRPC = {
  moonriver: {
    name: 'moonriver',
    rpc: '{{ networks.moonriver.rpc_url }}', // Insert your RPC URL here
    chainId: {{ networks.moonriver.chain_id }}, // {{ networks.moonriver.hex_chain_id }} in hex,
  },
};
// 3. Create ethers provider
const provider = new ethers.JsonRpcProvider(providerRPC.moonriver.rpc, {
  chainId: providerRPC.moonriver.chainId,
  name: providerRPC.moonriver.name,
});
```

=== "Moonbase Alpha"

```js
// 1. Import ethers
const ethers = require('ethers');

// 2. Define network configurations
const providerRPC = {
  moonbase: {
    name: 'moonbase-alpha',
    rpc: '{{ networks.moonbase.rpc_url }}',
    chainId: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }} in hex,
  },
};
// 3. Create ethers provider
const provider = new ethers.JsonRpcProvider(providerRPC.moonbase.rpc, {
  chainId: providerRPC.moonbase.chainId,
  name: providerRPC.moonbase.name,
});
```

=== "Development"

```js
// 1. Import ethers
const ethers = require('ethers');

// 2. Define network configurations
const providerRPC = {
  dev: {
    name: 'moonbeam-development',
    rpc: '{{ networks.development.rpc_url }}',
    chainId: {{ networks.development.chain_id }}, // {{ networks.development.hex_chain_id }} in hex,
  },
};
// 3. Create ethers provider
const provider = new ethers.JsonRpcProvider(providerRPC.dev.rpc, {
  chainId: providerRPC.dev.chainId,
  name: providerRPC.dev.name,
});
```

保存此代码片段，因为您将在以下各节中使用的脚本中需要它。

## 发送交易 {: #send-a-transaction }

在本节中，您将创建几个脚本。第一个脚本用于在尝试发送交易之前检查您帐户的余额。第二个脚本将实际发送交易。

您还可以使用余额脚本来检查发送交易后的帐户余额。

### 检查余额脚本 {: #check-balances-script }

您只需要一个文件来检查交易发送前后两个地址的余额。要开始，您可以运行以下命令创建一个 `balances.js` 文件：

```bash
touch balances.js
```

接下来，您将为此文件创建脚本并完成以下步骤：

1. [设置 Ethers 提供程序](#setting-up-the-ethers-provider)
2. 定义 `addressFrom` 和 `addressTo` 变量
3. 创建封装 `provider.getBalance` 方法的异步 `balances` 函数
4. 使用 `provider.getBalance` 函数获取 `addressFrom` 和 `addressTo` 地址的余额。您还可以利用 `ethers.formatEther` 函数将余额转换为 ETH 中更易读的数字
5. 最后，运行 `balances` 函数

```js
// 1. Add Ethers provider logic here:
// {...}

// 2. Create address variables
const addressFrom = 'INSERT_FROM_ADDRESS';
const addressTo = 'INSERT_TO_ADDRESS';

// 3. Create balance function
const balances = async () => {
  // 4. Get balances
  const balanceFrom = ethers.formatEther(await provider.getBalance(addressFrom));
  const balanceTo = ethers.formatEther(await provider.getBalance(addressTo));

  console.log(`The balance of ${addressFrom} is: ${balanceFrom} DEV`);
  console.log(`The balance of ${addressTo} is: ${balanceTo} DEV`);
};

// 5. Call the balance function
balances();
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethers-js/balances.js'
    ```

要运行脚本并获取帐户余额，您可以运行以下命令：

```bash
node balances.js
```

如果成功，始发地址和接收地址的余额将显示在您的终端中，单位为 DEV。

### 发送交易脚本 {: #send-transaction-script }

您只需要一个文件来执行帐户之间的交易。在此示例中，您将从原始地址（您持有私钥）向另一个地址转移 1 个 DEV 代币。首先，您可以运行以下命令来创建一个 `transaction.js` 文件：

```bash
touch transaction.js
```

接下来，您将为此文件创建脚本并完成以下步骤：

1. [设置 Ethers 提供程序](#setting-up-the-ethers-provider)
2. 定义 `privateKey` 和 `addressTo` 变量。私钥是创建钱包实例所必需的。**注意：这仅用于示例目的。切勿将您的私钥存储在 JavaScript 文件中**
3. 使用先前步骤中的 `privateKey` 和 `provider` 创建一个钱包。钱包实例用于签署交易
4. 创建异步 `send` 函数，该函数包装交易对象和 `wallet.sendTransaction` 方法
5. 创建仅需要收件人地址和发送金额的交易对象。请注意，可以使用 `ethers.parseEther`，它可以处理从 Ether 到 Wei 的必要单位转换 - 类似于使用 `ethers.parseUnits(value, 'ether')`
6. 使用 `wallet.sendTransaction` 方法发送交易，然后使用 `await` 等待直到交易被处理并且返回交易收据
7. 最后，运行 `send` 函数

```js
// 1. Add Ethers provider logic here:
// {...}

// 2. Create account variables
const accountFrom = {
  privateKey: 'INSERT_YOUR_PRIVATE_KEY',
};
const addressTo = 'INSERT_TO_ADDRESS';

// 3. Create wallet
let wallet = new ethers.Wallet(accountFrom.privateKey, provider);

// 4. Create send function
const send = async () => {
  console.log(`尝试从 ${wallet.address} 向 ${addressTo} 发送交易`);

  // 5. Create tx object
  const tx = {
    to: addressTo,
    value: ethers.parseEther('1'),
  };

  // 6. Sign and send tx - wait for receipt
  const createReceipt = await wallet.sendTransaction(tx);
  await createReceipt.wait();
  console.log(`交易成功，哈希值为：${createReceipt.hash}`);
};

// 7. Call the send function
send();
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethers-js/transaction.js'
    ```

要运行该脚本，您可以在终端中运行以下命令：

```bash
node transaction.js
```

如果交易成功，您将在终端中看到已打印出交易哈希。

您还可以使用 `balances.js` 脚本来检查原始帐户和接收帐户的余额是否已更改。整个工作流程如下所示：

--8<-- 'code/builders/ethereum/libraries/ethers-js/terminal/transaction.md'

## 部署合约 {: #deploy-a-contract }

--8<-- 'zh/text/builders/ethereum/libraries/contract.md'

### 编译合约脚本 {: #compile-contract-script }

--8<-- 'zh/text/builders/ethereum/libraries/compile-js.md'

--8<-- 'zh/text/builders/ethereum/libraries/compile.md'

```javascript
--8<-- 'code/builders/ethereum/libraries/compile.js'
```

### 与合约交互（发送方法）{: #interact-with-contract }

发送方法是修改合约存储（更改变量）的交互类型，这意味着需要签名并发送交易。在本节中，您将创建两个脚本：一个用于递增，一个用于重置递增器。要开始，您可以为每个脚本创建一个文件，并将它们命名为 `increment.js` 和 `reset.js`：

```bash
touch increment.js reset.js
```

打开 `increment.js` 文件，并按照以下步骤创建脚本：

1. 从 `compile.js` 文件导入 `abi`
2. [设置 Ethers 提供程序](#setting-up-the-ethers-provider)
3. 定义原始帐户的 `privateKey`、已部署合约的 `contractAddress` 以及要递增的 `_value`。私钥是创建钱包实例所必需的。**注意：这仅用于示例目的。切勿将您的私钥存储在 JavaScript 文件中**
4. 使用上一步中的 `privateKey` 和 `provider` 创建一个钱包。钱包实例用于签署交易
5. 使用 `ethers.Contract` 函数创建一个合约实例，并传入 `contractAddress`、`abi` 和 `provider`
6. 创建异步 `increment` 函数
7. 使用合约实例调用合约的方法之一，并在必要时传入任何输入。对于此示例，您将调用 `increment` 方法，该方法需要递增的值作为输入。您可以使用 `await`，它将在请求 promise 解决后返回请求的值
8. 最后，调用 `increment` 函数

```js
// 1. Import contract ABI
const { abi } = require('./compile');

// 2. Add Ethers provider logic here:
// {...}

// 3. Create variables
const accountFrom = {
  privateKey: 'INSERT_YOUR_PRIVATE_KEY',
};
const contractAddress = 'INSERT_CONTRACT_ADDRESS';
const _value = 3;

// 4. Create wallet
let wallet = new ethers.Wallet(accountFrom.privateKey, provider);

// 5. Create contract instance with signer
const incrementer = new ethers.Contract(contractAddress, abi, wallet);

// 6. Create increment function
const increment = async () => {
  console.log(
    `调用地址为：${contractAddress} 的合约中的 increment by ${_value} 函数`
  );

  // 7. Sign and send tx and wait for receipt
  const createReceipt = await incrementer.increment(_value);
  await createReceipt.wait();

  console.log(`交易成功，哈希值为：${createReceipt.hash}`);
};

// 8. Call the increment function
increment();
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethers-js/increment.js'
    ```

要运行该脚本，您可以在终端中输入以下命令：

```bash
node increment.js
```

如果成功，交易哈希将显示在终端中。您可以将 `get.js` 脚本与 `increment.js` 脚本一起使用，以确保该值按预期更改：

```
--8<-- 'code/builders/ethereum/libraries/ethers-js/terminal/increment.md'
```

接下来，您可以打开 `reset.js` 文件，并按照以下步骤创建脚本：

1. 从 `compile.js` 文件导入 `abi`
2. [设置 Ethers 提供程序](#setting-up-the-ethers-provider)
3. 定义原始帐户的 `privateKey` 和已部署合约的 `contractAddress`。私钥是创建钱包实例所必需的。**注意：这仅用于示例目的。切勿将您的私钥存储在 JavaScript 文件中**
4. 使用上一步中的 `privateKey` 和 `provider` 创建一个钱包。钱包实例用于签署交易
5. 使用 `ethers.Contract` 函数创建一个合约实例，并传入 `contractAddress`、`abi` 和 `provider`
6. 创建异步 `reset` 函数
7. 使用合约实例调用合约的方法之一，并在必要时传入任何输入。对于此示例，您将调用 `reset` 方法，该方法不需要任何输入。您可以使用 `await`，它将在请求 promise 解决后返回请求的值
8. 最后，调用 `reset` 函数

```js
// 1. Import contract ABI
const { abi } = require('./compile');

// 2. Add Ethers provider logic here:
// {...}

// 3. Create variables
const accountFrom = {
  privateKey: 'INSERT_YOUR_PRIVATE_KEY',
};
const contractAddress = 'INSERT_CONTRACT_ADDRESS';

// 4. Create wallet
let wallet = new ethers.Wallet(accountFrom.privateKey, provider);

// 5. Create contract instance with signer
const incrementer = new ethers.Contract(contractAddress, abi, wallet);

// 6. Create reset function
const reset = async () => {
  console.log(
    `调用地址为：${contractAddress} 的合约中的 reset 函数`
  );

  // 7. Sign and send tx and wait for receipt
  const createReceipt = await incrementer.reset();
  await createReceipt.wait();

  console.log(`交易成功，哈希值为：${createReceipt.hash}`);
};

// 8. Call the reset function
reset();
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethers-js/reset.js'
    ```

要运行该脚本，您可以在终端中输入以下命令：

```bash
node reset.js
```

如果成功，交易哈希将显示在终端中。您可以将 `get.js` 脚本与 `reset.js` 脚本一起使用，以确保该值按预期更改：

```text
--8<-- 'code/builders/ethereum/libraries/ethers-js/terminal/reset.md'
```

```text
--8<-- 'zh/text/_disclaimers/third-party-content.md'
```
