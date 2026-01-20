---
title: 使用 Foundry 部署合约
description: 了解如何使用 Foundry（一个以太坊开发环境）在 Moonbeam 上编译、部署和调试 Solidity 智能合约。
categories: 开发环境, 以太坊工具包
---


# 使用 Foundry 部署到 Moonbeam

## 简介 {: #introduction }

[Foundry](https://github.com/foundry-rs/foundry){target=\_blank} 是一个用 Rust 编写的以太坊开发环境，可帮助开发人员管理依赖项、编译项目、运行测试、部署合约以及从命令行与区块链进行交互。Foundry 可以直接与 Moonbeam 的以太坊 API 交互，因此可用于将智能合约部署到 Moonbeam 中。

Foundry 由四个工具组成：

- **[Forge](https://getfoundry.sh/forge/overview/){target=\_blank}** - 编译、测试和部署合约
- **[Cast](https://getfoundry.sh/cast/overview/){target=\_blank}** - 用于与合约交互的命令行界面
- **[Anvil](https://getfoundry.sh/anvil/overview/){target=\_blank}** - 用于开发目的的本地 TestNet 节点，可以 Fork 预先存在的网络
- **[Chisel](https://getfoundry.sh/chisel/overview/){target=\_blank}** - 一个 Solidity REPL，用于快速测试 Solidity 代码片段

本指南将介绍如何使用 Foundry 在 Moonbase Alpha 测试网上编译、部署和调试以太坊智能合约。本指南也适用于 Moonbeam、Moonriver 或 Moonbeam 开发节点。

## 检查先决条件 {: #checking-prerequisites }

要开始，您将需要以下内容：

- 拥有一个有资金的帐户。

--8<-- 'text/_common/faucet/faucet-list-item.md'

- --8<-- 'text/_common/endpoint-examples-list-item.md'

- 安装了[Foundry](https://getfoundry.sh/introduction/installation/){target=\_blank}

## 创建 Foundry 项目 {: #creating-a-foundry-project }

如果还没有 Foundry 项目，您需要创建一个。 您可以通过完成以下步骤来创建一个：

1. 如果您还没有安装 Foundry，请安装它。 如果在 Linux 或 MacOS 上，您可以运行以下命令：

    ```bash
    curl -L https://foundry.paradigm.xyz | bash
    foundryup
    ```

    如果在 Windows 上，您必须先安装 Rust，然后从源代码构建 Foundry：

    ```bash
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs/ | sh
    cargo install --git https://github.com/foundry-rs/foundry foundry-cli anvil --bins --locked
    ```

1. 创建项目，这将创建一个包含三个文件夹的文件夹，并打开它：

    ```bash
    forge init foundry && cd foundry
    ```

创建默认项目后，您应该看到三个文件夹。

- `lib` - 项目的所有依赖项，以 git 子模块的形式存在
- `src` - 放置智能合约（带有功能）的位置
- `test` - 放置项目的 forge 测试的位置，这些测试是用 Solidity 编写的

除了这三个文件夹之外，还将创建一个 git 项目，以及一个预先编写的 `.gitignore` 文件，其中忽略了相关的文件类型和文件夹。

## 部署合约 {: #deploying-the-contract }

使用 Foundry 部署合约主要有两种方式。第一种是直接使用命令 `forge create`。还有一种更灵活、更强大的方式是使用 Foundry 脚本，它可以在部署前运行模拟。在以下章节中，将介绍 `forge create` 和 Foundry 脚本。

### 使用 Forge Create {: #using-forge-create }

在部署之前，您需要通过导入您的私钥来设置您的密钥库。您可以使用 `cast wallet import` 命令，如下所示：

```bash
cast wallet import deployer --interactive
```

这将提示您：

1. 输入您的私钥
1. 输入密码以加密密钥库

该帐户将以“deployer”的名称保存在您的密钥库中。然后，您可以在部署命令中使用此帐户名。在部署合约或发送交易时，系统将提示您输入密钥库密码。

使用 `forge create` 部署合约只需要一个命令，但您必须包含 RPC 端点和构造函数参数。`MyToken.sol` 在其构造函数中要求提供初始令牌供应量，因此以下每个命令都包含 100 作为构造函数参数。 您可以使用以下命令为正确的网络部署 `MyToken.sol` 合约：

=== "Moonbeam"

    ```bash
    forge create src/MyToken.sol:MyToken \
    --rpc-url {{ networks.moonbeam.rpc_url }} \
    --broadcast \
    --account deployer \
    --constructor-args 100
    ```

=== "Moonriver"

    ```bash
    forge create src/MyToken.sol:MyToken \
    --rpc-url {{ networks.moonriver.rpc_url }} \
    --broadcast \
    --account deployer \
    --constructor-args 100
    ```

=== "Moonbase Alpha"

    ```bash
    forge create src/MyToken.sol:MyToken \
    --rpc-url {{ networks.moonbase.rpc_url }} \
    --broadcast \
    --account deployer \
    --constructor-args 100
    ```

=== "Moonbeam Dev Node"

    ```bash
    forge create src/MyToken.sol:MyToken \
    --rpc-url {{ networks.development.rpc_url }} \
    --broadcast \
    --account deployer \
    --constructor-args 100
    ```

部署合约并在几秒钟后，您应该在终端中看到该地址。

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/deploy.md'

恭喜！您的合约已上线！保存该地址，您将在下一步中使用它与此合约实例进行交互。

## 与合约交互 {: #interacting-with-the-contract }

Foundry 包含 cast，这是一个用于执行以太坊 RPC 调用的 CLI。

尝试使用 Cast 检索您的令牌名称，其中 `INSERT_YOUR_CONTRACT_ADDRESS` 是您在上一节中部署的合约的地址：

=== "Moonbeam"

    ```bash
    cast call INSERT_YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonbeam.rpc_url }}
    ```

=== "Moonriver"

    ```bash
    cast call INSERT_YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonriver.rpc_url }}
    ```

=== "Moonbase Alpha"

    ```bash
    cast call INSERT_YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonbase.rpc_url }}
    ```

=== "Moonbeam Dev Node"

    ```bash
    cast call INSERT_YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.development.rpc_url }}
    ```

您应该以十六进制格式获取此数据：

text
0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000074d79546f6b656e00000000000000000000000000000000000000000000000000

这远非可读，但您可以使用 Cast 将其转换为所需的格式。 在这种情况下，数据是文本，因此您可以将其转换为 ASCII 字符以查看“My Token”：

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/cast.md'

```bash
cast --to-ascii 0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000074d79546f6b656e00000000000000000000000000000000000000000000000000
```

您也可以使用 cast 改变数据。 尝试通过将令牌发送到零地址来销毁令牌。

=== "Moonbeam"

    ```bash
    cast send --private-key INSERT_YOUR_PRIVATE_KEY \
      --rpc-url {{ networks.moonbeam.rpc_url }} \
      --chain {{ networks.moonbeam.chain_id }} \
      INSERT_YOUR_CONTRACT_ADDRESS \
      "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

=== "Moonriver"

    ```bash
    cast send --private-key INSERT_YOUR_PRIVATE_KEY \
      --rpc-url {{ networks.moonriver.rpc_url }} \
      --chain {{ networks.moonriver.chain_id }} \
      INSERT_YOUR_CONTRACT_ADDRESS \
      "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

=== "Moonbase Alpha"

    ```bash
    cast send --private-key INSERT_YOUR_PRIVATE_KEY \
      --rpc-url {{ networks.moonbase.rpc_url }} \
      --chain {{ networks.moonbase.chain_id }} \
      INSERT_YOUR_CONTRACT_ADDRESS \
      "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

=== "Moonbeam Dev Node"

    ```bash
    cast send --private-key INSERT_YOUR_PRIVATE_KEY \
      --rpc-url {{ networks.development.rpc_url }} \
      --chain {{ networks.development.chain_id }} \
      INSERT_YOUR_CONTRACT_ADDRESS \
      "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

该事务将由您的 Moonbase 帐户签名并广播到网络。 输出应类似于：

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/burn.md'

恭喜，您已使用 Foundry 成功部署并与合约交互！

## 使用 Anvil 进行 Fork {: #forking-with-cast-anvil }

如前所述，[Anvil](https://getfoundry.sh/anvil/overview/#anvil){target=\_blank} 是一个用于开发目的的本地 TestNet 节点，可以 fork 预先存在的网络。Fork Moonbeam 允许您与部署在网络上的实时合约进行交互。

使用 Anvil 进行 fork 时，需要注意一些限制。由于 Anvil 基于 EVM 实现，因此您无法与任何 Moonbeam 预编译合约及其功能进行交互。预编译是 Substrate 实现的一部分，因此无法在模拟的 EVM 环境中复制。这禁止您与 Moonbeam 上的跨链资产以及基于 Substrate 的功能（如质押和治理）进行交互。

要 fork Moonbeam 或 Moonriver，您需要拥有自己的端点和 API 密钥，您可以从支持的[端点提供商](/builders/get-started/endpoints/){target=\_blank}之一处获得。

要从命令行 fork Moonbeam，您可以从 Foundry 项目目录中运行以下命令：

=== "Moonbeam"

    ```bash
    anvil --fork-url {{ networks.moonbeam.rpc_url }}
    ```

=== "Moonriver"

    ```bash
    anvil --fork-url {{ networks.moonriver.rpc_url }}
    ```

=== "Moonbase Alpha"

    ```bash
    anvil --fork-url {{ networks.moonbase.rpc_url }}
    ```

您的 fork 实例将拥有 10 个预先注资 10,000 个测试 token 的开发账户。fork 实例可在 `http://127.0.0.1:8545/` 上使用。终端中的输出应类似于以下内容：

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/fork-anvil.md'

要验证您是否已 fork 网络，可以查询最新的区块号：

```bash
curl --data '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8545 
```

如果您将 `result` 从 [十六进制转换为十进制](https://www.rapidtables.com/convert/number/hex-to-decimal.html){target=\_blank}，您应该获得从您 fork 网络时开始的最新区块号。您可以使用 [区块浏览器](/builders/get-started/explorers/){target=\_blank} 交叉引用区块号。

从这里，您可以将新合约部署到您的 Moonbeam fork 实例，或者与已经部署的合约进行交互。在此指南的前一个示例的基础上，您可以使用 Cast 进行调用，以检查您部署合约的账户中已铸造的 MYTOK token 的余额：

```bash
cast call INSERT_CONTRACT_ADDRESS  "balanceOf(address)(uint256)" INSERT_YOUR_ADDRESS --rpc-url http://localhost:8545
```
