---
title: 如何使用 Web3.py 以太坊库
description: 按照本教程学习如何使用以太坊 Web3 Python 库将交易发送到 Moonbeam 并将 Solidity 智能合约部署到 Moonbeam。
categories: 库和 SDK，以太坊工具包
---


# Web3.py Python库

## 介绍 {: #introduction }

[Web3.py](https://web3py.readthedocs.io) 是一组库，允许开发人员使用 Python 通过 HTTP、IPC 或 WebSocket 协议与以太坊节点进行交互。Moonbeam 有一个类似于以太坊的 API 可用，它与以太坊风格的 JSON-RPC 调用完全兼容。因此，开发人员可以利用这种兼容性，并使用 Web3.py 库与 Moonbeam 节点交互，就像在以太坊上进行交互一样。

在本指南中，您将学习如何使用 Web3.py 库在 Moonbase Alpha 上发送交易和部署合约。本指南可以适用于 [Moonbeam](/builders/get-started/networks/moonbeam/){target=\_blank}、[Moonriver](/builders/get-started/networks/moonriver/){target=\_blank} 或 [Moonbeam 开发节点](/builders/get-started/networks/moonbeam-dev/){target=\_blank}。

## 检查先决条件 {: #checking-prerequisites }

对于本指南中的示例，您需要具备以下条件：

- 一个有资金的帐户。

--8<-- 'zh/text/_common/faucet/faucet-list-item.md'

- --8<-- 'zh/text/_common/endpoint-examples-list-item.md'

!!! note

    --8<-- 'zh/text/_common/assumes-mac-or-ubuntu-env.md'

## 创建 Python 项目 {: #create-a-python-project }

首先，您可以创建一个目录来存储您将在本指南中创建的所有文件：

```bash
mkdir web3-examples && cd web3-examples
```

对于本指南，您需要安装 Web3.py 库和 Solidity 编译器。 要安装这两个软件包，您可以运行以下命令：

```bash
pip3 install web3 py-solc-x solc-select
```

## 使用 Moonbeam 设置 Web3.py {: #setup-web3-with-moonbeam }

在本指南中，您将创建许多提供不同功能的脚本，例如发送交易、部署合约以及与已部署的合约进行交互。在大多数这些脚本中，您需要创建一个 [Web3.py provider](https://web3py.readthedocs.io/en/stable/providers.html){target=\_blank} 来与网络交互。

--8<-- 'zh/text/_common/endpoint-setup.md'

要创建一个提供程序，您可以按照以下步骤操作：

1. 导入 `web3` 库
1. 使用 `Web3(Web3.HTTPProvider())` 方法创建 `web3` 提供程序，并提供端点 URL

=== "Moonbeam"

    ```python
    # 1. Import web3.py
    from web3 import Web3

    # 2. Create web3.py provider
    web3 = Web3(Web3.HTTPProvider("{{ networks.moonbeam.rpc_url }}")) # Insert your RPC URL here
    ```

=== "Moonriver"

    ```python
    # 1. Import web3.py
    from web3 import Web3

    # 2. Create web3.py provider
    web3 = Web3(Web3.HTTPProvider("{{ networks.moonriver.rpc_url }}")) # Insert your RPC URL here
    ```

=== "Moonbase Alpha"

    ```python
    # 1. Import web3.py
    from web3 import Web3

    # 2. Create web3.py provider
    web3 = Web3(Web3.HTTPProvider("{{ networks.moonbase.rpc_url }}"))
    ```

=== "Moonbeam Dev Node"

    ```python
    # 1. Import web3.py
    from web3 import Web3

    # 2. Create web3.py provider
    web3 = Web3(Web3.HTTPProvider("{{ networks.development.rpc_url }}"))
    ```

保存此代码段，因为您将在以下部分中使用的脚本中用到它。

## 发送交易 {: #send-a-transaction }

在本节中，您将创建几个脚本。第一个脚本是在尝试发送交易之前检查您的帐户余额。第二个脚本将实际发送交易。

您还可以使用余额脚本在发送交易后检查帐户余额。

### 检查余额脚本 {: #check-balances-script }

您只需要一个文件来检查交易发送前后两个地址的余额。要开始，您可以运行以下命令创建一个 `balances.py` 文件：

```bash
touch balances.py
```

接下来，您将为此文件创建脚本并完成以下步骤：

1. [设置 Web3 提供程序](#setup-web3-with-moonbeam)
1. 定义 `address_from` 和 `address_to` 变量
1. 使用 `web3.eth.get_balance` 函数获取帐户余额，并使用 `web3.from_wei` 格式化结果


--8<-- 'code/builders/ethereum/libraries/web3-py/balances.py'

要运行脚本并获取帐户余额，您可以运行以下命令：

```bash
python3 balances.py
```

如果成功，原始地址和接收地址的余额将以 ETH 显示在您的终端中。

### 发送交易脚本 {: #send-transaction-script }

您只需要一个文件即可在账户之间执行交易。此示例将从源地址（您持有其私钥）向另一个地址转账 1 个 DEV 代币。首先，可以通过运行以下命令创建 `transaction.py` 文件：

```bash
touch transaction.py
```

接下来，为该文件创建脚本并完成以下步骤：

1. 添加导入项，包括 Web3.py 和 `rpc_gas_price_strategy`，后续将用它来获取交易的 gas 价格
1. [设置 Web3 提供程序](#setup-web3-with-moonbeam)
1. 定义 `account_from`（包含 `private_key`）和接收方地址 `address_to`。私钥是签名交易所必需的。**注意：这仅用于示例目的。切勿将您的私钥存储在 Python 文件中**
1. 使用 [Web3.py Gas Price API](https://web3py.readthedocs.io/en/stable/gas_price.html){target=\_blank} 设置 gas 价格策略。在本示例中，使用导入的 `rpc_gas_price_strategy`
1. 使用 `web3.eth.account.sign_transaction` 创建并签署交易。传入交易的 `nonce`、`gas`、`gasPrice`、`to` 和 `value` 以及发送者的 `private_key`。`nonce` 可通过 `web3.eth.get_transaction_count` 获取，`gasPrice` 使用 `web3.eth.generate_gas_price` 预先确定，`value` 可用 `web3.to_wei` 将可读金额转换为 Wei
1. 使用已签名的交易，调用 `web3.eth.send_raw_transaction` 发送交易，并使用 `web3.eth.wait_for_transaction_receipt` 等待交易回执

```python
--8<-- 'code/builders/ethereum/libraries/web3-py/transaction.py'
```

要运行该脚本，您可以在终端中运行以下命令：

```bash
python3 transaction.py
```

如果交易成功，您会在终端中看到交易哈希被打印出来。

您还可以使用 `balances.py` 脚本来检查源账户和接收账户的余额是否已更改。整个工作流程如下所示：

--8<-- 'code/builders/ethereum/libraries/web3-py/terminal/transaction.md'

## 部署合约 {: #deploy-a-contract }

--8<-- 'zh/text/builders/ethereum/libraries/contract.md'

### 编译合约脚本 {: #compile-contract-script }

在本节中，您将创建一个脚本，使用 Solidity 编译器输出 `Incrementer.sol` 合约的字节码和接口（ABI）。首先，可以通过运行以下命令创建 `compile.py` 文件：

```bash
touch compile.py
```

接下来，为该文件创建脚本并完成以下步骤：

1. 导入 `solcx` 包
1. **可选** - 如果尚未安装 Solidity 编译器，可以使用 `solcx.install_solc` 函数进行安装
1. 使用 `solcx.compile_files` 函数编译 `Incrementer.sol` 合约
1. 导出合约的 ABI 和字节码

```python
--8<-- 'code/builders/ethereum/libraries/web3-py/compile.py'
```

!!! note

    如果遇到 “Solc is not installed” 错误，请取消注释代码片段中的第 2 步。

### 部署合约脚本 {: #deploy-contract-script }

有了用于编译 `Incrementer.sol` 合约的脚本，您可以使用结果发送一个已签名的交易来部署它。为此，您可以创建一个名为 `deploy.py` 的部署脚本文件：

```bash
touch deploy.py
```

接下来，您将为该文件创建脚本并完成以下步骤：

1. 添加导入，包括 Web3.py 以及 `Incrementer.sol` 合约的 ABI 和字节码
1. [设置 Web3 提供程序](#setup-web3-with-moonbeam)
1. 定义 `account_from`，包括 `private_key`。私钥是签署交易的必需项。**注意：这仅用于示例目的。切勿将您的私钥存储在 Python 文件中**
1. 使用 `web3.eth.contract` 函数创建一个合约实例，并传入合约的 ABI 和字节码
1. 使用合约实例构建一个构造函数交易，并传入要递增的值。对于此示例，您可以使用 `5`。然后，您将使用 `build_transaction` 函数传入交易信息，包括 `from` 地址和发送者的 `nonce`。要获取 `nonce`，您可以使用 `web3.eth.get_transaction_count` 函数
1. 使用 `web3.eth.account.sign_transaction` 函数签署交易，并传入构造函数交易和发送者的 `private_key`
1. 使用已签名的交易，您可以使用 `web3.eth.send_raw_transaction` 函数发送它，并使用 `web3.eth.wait_for_transaction_receipt` 函数等待交易回执

--8<-- 'code/builders/ethereum/libraries/web3-py/deploy.py'

要运行该脚本，您可以在终端中输入以下命令：

```bash
python3 deploy.py
```

如果成功，合约的地址将显示在终端中。

--8<-- 'code/builders/ethereum/libraries/web3-py/terminal/deploy.md'

### 读取合约数据（调用方法）{: #read-contract-data }

调用方法不会修改合约存储（更改变量），因此无需发送交易。它们只是读取已部署合约的各种存储变量。

要开始，您可以创建一个文件并命名为 `get.py`：

```bash
touch get.py
```

然后，您可以按照以下步骤创建脚本：

1. 添加导入项，包括 Web3.py 和 `Incrementer.sol` 合约的 ABI
1. [设置 Web3 提供程序](#setup-web3-with-moonbeam)
1. 定义已部署合约的 `contract_address`
1. 使用 `web3.eth.contract` 函数创建合约实例，并传入已部署合约的 ABI 和地址
1. 使用合约实例调用 `number` 函数

```python
--8<-- 'code/builders/ethereum/libraries/web3-py/get.py'
```

要运行该脚本，您可以在终端中输入以下命令：

```bash
python3 get.py
```

如果成功，该值将显示在终端中。

### 与合约交互（发送方法）{: #interact-with-contract }

发送方法是修改合约存储（更改变量）的交互类型，这意味着需要签名并发送交易。在本节中，您将创建两个脚本：一个用于递增，另一个用于重置递增器。要开始，您可以为每个脚本创建一个文件，并将它们命名为 `increment.py` 和 `reset.py`：

```bash
touch increment.py reset.py
```

打开 `increment.py` 文件，并按照以下步骤创建脚本：

1. 添加导入项，包括 Web3.py 和 `Incrementer.sol` 合约的 ABI
1. [设置 Web3 提供程序](#setup-web3-with-moonbeam)
1. 定义 `account_from`，包括 `private_key`、已部署合约的 `contract_address` 和要递增的 `value`。私钥是签名交易所必需的。**注意：这仅用于示例目的。切勿将您的私钥存储在 Python 文件中**
1. 使用 `web3.eth.contract` 函数创建合约实例，并传入已部署合约的 ABI 和地址
1. 使用合约实例构建递增交易，并传入要递增的值。然后，您将使用 `build_transaction` 函数传入交易信息，包括 `from` 地址和发送方的 `nonce`。要获取 `nonce`，您可以使用 `web3.eth.get_transaction_count` 函数
1. 使用 `web3.eth.account.sign_transaction` 函数签署交易，并传入递增交易和发送方的 `private_key`
1. 使用已签名的交易，您可以使用 `web3.eth.send_raw_transaction` 函数发送它，并使用 `web3.eth.wait_for_transaction_receipt` 函数等待交易收据

--8<-- 'code/builders/ethereum/libraries/web3-py/increment.py'

要运行该脚本，您可以在终端中输入以下命令：

```bash
python3 increment.py
```

如果成功，交易哈希将显示在终端中。您可以将 `get.py` 脚本与 `increment.py` 脚本一起使用，以确保该值按预期更改：

--8<-- 'code/builders/ethereum/libraries/web3-py/terminal/increment.md'

接下来，您可以打开 `reset.py` 文件，并按照以下步骤创建脚本：

1. 添加导入项，包括 Web3.py 和 `Incrementer.sol` 合约的 ABI
1. [设置 Web3 提供程序](#setup-web3-with-moonbeam)
1. 定义 `account_from`，包括 `private_key` 和已部署合约的 `contract_address`。私钥是签名交易所必需的。**注意：这仅用于示例目的。切勿将您的私钥存储在 Python 文件中**
1. 使用 `web3.eth.contract` 函数创建合约实例，并传入已部署合约的 ABI 和地址
1. 使用合约实例构建重置交易。然后，您将使用 `build_transaction` 函数传入交易信息，包括 `from` 地址和发送方的 `nonce`。要获取 `nonce`，您可以使用 `web3.eth.get_transaction_count` 函数
1. 使用 `web3.eth.account.sign_transaction` 函数签署交易，并传入重置交易和发送方的 `private_key`
1. 使用已签名的交易，您可以使用 `web3.eth.send_raw_transaction` 函数发送它，并使用 `web3.eth.wait_for_transaction_receipt` 函数等待交易收据

--8<-- 'code/builders/ethereum/libraries/web3-py/reset.py'

要运行该脚本，您可以在终端中输入以下命令：

```bash
python3 reset.py
```

如果成功，交易哈希将显示在终端中。您可以将 `get.py` 脚本与 `reset.py` 脚本一起使用，以确保该值按预期更改：

--8<-- 'code/builders/ethereum/libraries/web3-py/terminal/reset.md'

--8<-- 'zh/text/_disclaimers/third-party-content.md'
