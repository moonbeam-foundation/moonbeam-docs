---
title: 如何使用 Web3.py Ethereum 库
description: 按照本教程学习如何使用 Ethereum Web3 Python 库将交易发送到 Moonbeam 并将 Solidity 智能合约部署到 Moonbeam。
categories: Libraries and SDKs, Ethereum Toolkit
---

# Web3.py Python 库

## 简介 {: #introduction }

[Web3.py](https://web3py.readthedocs.io) 是一组允许开发者使用 Python 通过 HTTP、IPC 或 WebSocket 协议与以太坊节点交互的库。Moonbeam 有一个类似于以太坊的 API，它与以太坊风格的 JSON-RPC 调用完全兼容。因此，开发者可以利用这种兼容性，并使用 Web3.py 库与 Moonbeam 节点交互，就像在以太坊上操作一样。

在本指南中，您将学习如何使用 Web3.py 库在 Moonbase Alpha 上发送交易和部署合约。本指南可以适用于 [Moonbeam](/builders/get-started/networks/moonbeam/){target=_blank}、[Moonriver](/builders/get-started/networks/moonriver/){target=_blank} 或 [Moonbeam 开发节点](/builders/get-started/networks/moonbeam-dev/){target=_blank}。

## 检查先决条件 {: #checking-prerequisites }

对于本指南中的示例，您需要具备以下条件：

 - 一个有资金的帐户。
  --8<-- 'text/_common/faucet/faucet-list-item.md'
 - 
--8<-- 'text/_common/endpoint-examples-list-item.md'

!!! note
    --8<-- 'text/_common/assumes-mac-or-ubuntu-env.md'

## 创建一个 Python 项目 {: #create-a-python-project }

首先，您可以创建一个目录来存储您在本指南中将要创建的所有文件：

bash
mkdir web3-examples && cd web3-examples

对于本指南，您需要安装 Web3.py 库和 Solidity 编译器。要安装这两个软件包，您可以运行以下命令：

bash
pip3 install web3 py-solc-x solc-select

## 使用 Moonbeam 设置 Web3.py {: #setup-web3-with-moonbeam }

在本指南中，您将创建许多提供不同功能的脚本，例如发送交易、部署合约以及与已部署的合约交互。在大多数这些脚本中，您需要创建一个 [Web3.py 提供程序](https://web3py.readthedocs.io/en/stable/providers.html){target=_blank} 以与网络交互。

--8<-- 'text/_common/endpoint-setup.md'

要创建提供程序，您可以采取以下步骤：

1. 导入 `web3` 库
2. 使用 `Web3(Web3.HTTPProvider())` 方法创建 `web3` 提供程序，并提供端点 URL

===

    ```python
    # 1. Import web3.py
    from web3 import Web3

    # 2. Create web3.py provider
    web3 = Web3(Web3.HTTPProvider("{{ networks.moonbeam.rpc_url }}")) # 在此处插入您的 RPC URL
    ```

===

    ```python
    # 1. Import web3.py
    from web3 import Web3

    # 2. Create web3.py provider
    web3 = Web3(Web3.HTTPProvider("{{ networks.moonriver.rpc_url }}")) # 在此处插入您的 RPC URL
    ```

===

    ```python
    # 1. Import web3.py
    from web3 import Web3

    # 2. Create web3.py provider
    web3 = Web3(Web3.HTTPProvider("{{ networks.moonbase.rpc_url }}"))
    ```

===

    ```python
    # 1. Import web3.py
    from web3 import Web3

    # 2. Create web3.py provider
    web3 = Web3(Web3.HTTPProvider("{{ networks.development.rpc_url }}"))
    ```

保存此代码段，因为您将在以下部分中使用的脚本中需要它。

## 发送交易 {: #send-a-transaction }

在本节中，您将创建几个脚本。第一个脚本用于在尝试发送交易之前检查您帐户的余额。第二个脚本实际上会发送交易。

您还可以使用余额脚本在发送交易后检查帐户余额。

### 检查余额脚本 {: #check-balances-script }

您只需要一个文件来检查交易发送前后两个地址的余额。首先，您可以通过运行以下命令创建一个`balances.py`文件：

bash
touch balances.py

接下来，您将为此文件创建脚本并完成以下步骤：

1. [设置Web3提供程序](#setup-web3-with-moonbeam)
2. 定义`address_from`和`address_to`变量
3. 使用`web3.eth.get_balance`函数获取帐户余额，并使用`web3.from_wei`格式化结果

python
--8<-- 'code/builders/ethereum/libraries/web3-py/balances.py'

要运行脚本并获取帐户余额，您可以运行以下命令：

bash
python3 balances.py

如果成功，原始地址和接收地址的余额将以ETH显示在您的终端中。

## 部署合约 {: #deploy-a-contract }

--8<-- 'text/builders/ethereum/libraries/contract.md'

### 部署合约脚本 {: #deploy-contract-script }

有了用于编译 `Incrementer.sol` 合约的脚本，您就可以使用结果来发送一个用于部署它的已签名交易。为此，您可以创建一个名为 `deploy.py` 的部署脚本文件：

bash
touch deploy.py

接下来，您将为此文件创建脚本并完成以下步骤：

1. 添加导入，包括 Web3.py 以及 `Incrementer.sol` 合约的 ABI 和字节码
2. [设置 Web3 提供程序](#setup-web3-with-moonbeam)
3. 定义 `account_from`，包括 `private_key`。私钥是签署交易所必需的。**注意：这仅用于示例目的。切勿将您的私钥存储在 Python 文件中**
4. 使用 `web3.eth.contract` 函数创建一个合约实例，并传入合约的 ABI 和字节码
5. 使用合约实例构建一个构造函数交易，并传入要递增的值。对于本示例，您可以使用 `5`。然后，您将使用 `build_transaction` 函数传入交易信息，包括 `from` 地址和发送者的 `nonce`。要获取 `nonce`，您可以使用 `web3.eth.get_transaction_count` 函数
6. 使用 `web3.eth.account.sign_transaction` 函数签署交易，并传入构造函数交易和发送者的 `private_key`
7. 使用已签名的交易，您可以使用 `web3.eth.send_raw_transaction` 函数发送它，并通过使用 `web3.eth.wait_for_transaction_receipt` 函数等待交易收据

python
--8<-- 'code/builders/ethereum/libraries/web3-py/deploy.py'

要运行脚本，您可以在终端中输入以下命令：

bash
python3 deploy.py

如果成功，合约的地址将显示在终端中。

--8<-- 'code/builders/ethereum/libraries/web3-py/terminal/deploy.md'

### 读取合约数据（调用方法）{: #read-contract-data }

调用方法是一种不会修改合约存储（更改变量）的交互类型，这意味着不需要发送交易。它们只是读取已部署合约的各种存储变量。

首先，您可以创建一个文件并将其命名为 `get.py`：

bash
touch get.py

然后，您可以按照以下步骤创建脚本：

1. 添加导入，包括 Web3.py 和 `Incrementer.sol` 合约的 ABI
2. [设置 Web3 提供程序](#setup-web3-with-moonbeam)
3. 定义已部署合约的 `contract_address`
4. 使用 `web3.eth.contract` 函数创建一个合约实例，并传入已部署合约的 ABI 和地址
5. 使用合约实例，您可以调用 `number` 函数

python
--8<-- 'code/builders/ethereum/libraries/web3-py/get.py'

要运行脚本，您可以在终端中输入以下命令：

bash
python3 get.py

如果成功，该值将显示在终端中。
