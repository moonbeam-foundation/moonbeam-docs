---
title: 使用插件验证智能合约
description: 了解如何使用 Hardhat 和 Foundry 中支持 Moonscan API 的内置工具在 Moonbeam 网络上验证智能合约。
categories: Ethereum Toolkit
---

# 使用 Etherscan 插件验证智能合约

## 简介 {: #introduction }

验证智能合约是提高部署在 Moonbeam 上的合约透明度和安全性的绝佳方法。Hardhat 和 Foundry 与 Etherscan 的合约验证服务集成，通过本地检测要验证的合约以及所需的 Solidity 库（如果有）来自动执行验证合约的过程。

Hardhat 插件可以无缝集成到您的 [Hardhat](https://hardhat.org){target=\_blank} 项目中。[Foundry](https://github.com/foundry-rs/foundry){target=\_blank} 也具有 Etherscan 功能，但它们内置于其 Forge 工具中，而不是包含在单独的插件中。

本指南将向您展示如何使用这两个插件来验证部署在 Moonbase Alpha 上的智能合约。本指南也适用于 Moonbeam 和 Moonriver。

## 检查先决条件 {: #checking-prerequisites }

要学习本教程，您需要具备以下条件：

- [MetaMask 已安装并连接到 Moonbase Alpha](/tokens/connect/metamask/){target=\_blank} 测试网
- 一个已充值 `DEV` 代币的帐户。
 --8<-- 'zh/text/_common/faucet/faucet-list-item.md'
- 一个 Etherscan API 密钥
- 已安装并配置 Git

## 生成 Etherscan API 密钥 {: generating-an-etherscan-api-key }

要在 Moonbeam 网络的 Moonscan 上验证合约，您需要一个 [Etherscan API 密钥](https://docs.etherscan.io/etherscan-v2/getting-an-api-key){target=\_blank}。由于 Moonscan 是 Etherscan 生态系统的一部分，因此单个密钥适用于所有支持的网络。

要创建 [Etherscan 帐户](https://etherscan.io/){target=\_blank} 并生成您的密钥，请按照以下步骤操作：

1. 点击 **Sign In**（登录）
2. 选择 **Click to sign up**（点击注册），然后注册您的新帐户

![注册 Moonscan](/images/builders/ethereum/verify-contracts/etherscan-plugins/plugins-1.webp)

拥有帐户并登录后，您就可以创建 API 密钥。

1. 从左侧菜单中选择 **API Dashboard**（API 仪表板）
2. 要添加新密钥，请点击 **+ Add**（+ 添加）按钮

![添加 API 密钥](/images/builders/ethereum/verify-contracts/etherscan-plugins/plugins-2.webp)

然后，系统会提示您为 API 密钥输入 **AppName**（应用程序名称），输入名称并点击 **Continue**（继续）后，它将出现在您的 API 密钥列表中。

## 使用 Hardhat Etherscan 插件 {: #using-the-hardhat-verify-plugin }

本指南本节中的示例将基于在[使用 Hardhat 部署到 Moonbeam](/builders/ethereum/dev-env/hardhat/){target=\_blank} 指南中创建的 `Box.sol` 合约。

要开始使用 Hardhat Etherscan 插件，您首先需要安装插件库：

```bash
--8<-- 'code/builders/ethereum/verify-contracts/etherscan-plugins/1.sh'
```

您可以将您的 Etherscan API 密钥添加到 `hardhat.config.js` 文件中。

在您的 Hardhat 项目中，打开您的 `hardhat.config.js` 文件。您需要导入 `hardhat-verify` 插件、您的 Etherscan API 密钥，并添加 Etherscan 的配置：

```js
--8<-- 'code/builders/ethereum/verify-contracts/etherscan-plugins/2.js'
```

要验证合约，您将运行 `verify` 命令，并传入已部署合约的地址以及部署的网络：

```bash
--8<-- 'code/builders/ethereum/verify-contracts/etherscan-plugins/3.sh'
```

在您的终端中，您应该看到您的合约的源代码已成功提交以进行验证。如果验证成功，您应该看到 **Successfully verified contract**，并且在 [Moonscan for Moonbase Alpha](https://moonbase.moonscan.io){target=\_blank} 上会有一个指向合约代码的链接。

--8<-- 'code/builders/ethereum/verify-contracts/etherscan-plugins/terminal/hardhat-verify.md'

如果您要验证的合约具有构造函数参数，您需要运行上述命令，并在命令末尾添加用于部署合约的构造函数参数。例如：

```bash
--8<-- 'code/builders/ethereum/verify-contracts/etherscan-plugins/4.sh'
```

请参阅 [Hardhat Verify 文档](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify){target=\_blank} 以获取有关其他用例的帮助，例如：

- [复杂参数](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#complex-arguments){target=\_blank}
- [具有无法检测地址的库](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#libraries-with-undetectable-addresses){target=\_blank}
- 使用[多个 API 密钥](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#multiple-api-keys-and-alternative-block-explorers){target=\_blank}
- 以编程方式使用 [`verify` 命令](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#using-programmatically){target=\_blank}
- [确定正确的构造函数参数](https://info.etherscan.com/determine-correct-constructor-argument-during-source-code-verification-on-etherscan/){target=\_blank}

## 使用 Foundry 进行验证 {: #using-foundry-to-verify }

本指南此部分中的示例将使用在[使用 Foundry 部署到 Moonbeam](/builders/ethereum/dev-env/foundry/){target=\_blank} 指南中创建的 `MyToken.sol` 合约。

除了 Foundry 项目，您还需要一个 [Etherscan API 密钥](https://etherscan.io/){target=\_blank} 来验证您的合约。

如果您已经部署了示例合约，您可以使用 `verify-contract` 命令来验证它。在验证合约之前，您需要对构造函数参数进行 ABI 编码。要对示例合约执行此操作，您可以运行以下命令：

```bash
--8<-- 'code/builders/ethereum/verify-contracts/etherscan-plugins/5.sh'
```

结果应为 `0x0000000000000000000000000000000000000000000000000000000000000064`。然后，您可以使用以下命令验证合约：

=== "Moonbeam"

    ```bash
    forge verify-contract --chain-id {{ networks.moonbeam.chain_id }} \
      YOUR_CONTRACT_ADDRESS \
      --constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
      src/MyToken.sol:MyToken \
      --etherscan-api-key INSERT_YOUR_ETHERSCAN_API_KEY
    ```

=== "Moonriver"

    ```bash
    forge verify-contract --chain-id {{ networks.moonriver.chain_id }} \
      YOUR_CONTRACT_ADDRESS \
      --constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
      src/MyToken.sol:MyToken \
      --etherscan-api-key INSERT_YOUR_ETHERSCAN_API_KEY
    ```

=== "Moonbase Alpha"

    ```bash
    forge verify-contract --chain-id {{ networks.moonbase.chain_id }} \
      YOUR_CONTRACT_ADDRESS \
      --constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
      src/MyToken.sol:MyToken \
      --etherscan-api-key INSERT_YOUR_ETHERSCAN_API_KEY
    ```

--8<-- 'code/builders/ethereum/verify-contracts/etherscan-plugins/terminal/forge-verify.md'

如果您想同时部署示例合约并进行验证，那么您可以使用以下命令：

=== "Moonbeam"

    ```bash
    forge create --rpc-url {{ networks.moonbeam.rpc_url }} \
      --constructor-args 100 \
      --etherscan-api-key INSERT_YOUR_ETHERSCAN_API_KEY \
      --verify --private-key YOUR_PRIVATE_KEY \
      src/MyToken.sol:MyToken
    ```

=== "Moonriver"

    ```bash
    forge create --rpc-url {{ networks.moonriver.rpc_url }} \
      --constructor-args 100 \
      --etherscan-api-key INSERT_YOUR_ETHERSCAN_API_KEY \
      --verify --private-key YOUR_PRIVATE_KEY \
      src/MyToken.sol:MyToken
    ```

=== "Moonbase Alpha"

    ```bash
    forge create --rpc-url {{ networks.moonbase.rpc_url }} \
      --constructor-args 100 \
      --etherscan-api-key INSERT_YOUR_ETHERSCAN_API_KEY \
      --verify --private-key YOUR_PRIVATE_KEY \
      src/MyToken.sol:MyToken
    ```

--8<-- 'code/builders/ethereum/verify-contracts/etherscan-plugins/terminal/forge-create-verify.md'
