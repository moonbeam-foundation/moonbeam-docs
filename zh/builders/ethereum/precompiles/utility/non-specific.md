---
title: 非网络特定的预编译合约
description: 了解如何使用预编译合约，这些合约并非特定于以太坊或Moonbeam，但支持在您的应用程序中使用。
keywords: ethereum, moonbeam, ECRecoverPublicKey, sha3FIPS256
categories: Precompiles, Ethereum Toolkit
---

# 非网络特定预编译智能合约

## 简介 {: #introduction }

预编译合约（或预编译）是一组硬编码到区块链客户端中的已编程功能。预编译执行计算量大的任务，例如散列等加密过程。将这些功能移动到区块链客户端具有双重目的：使计算比使用传统智能合约更有效，并确保每个人都可以访问正确运行所需的完整、准确的过程和算法集。

预编译功能被捆绑并在智能合约地址下共享，这允许与传统智能合约类似的交互。一些预编译合约并非特定于以太坊或 Moonbeam，但受支持在您的 Moonbeam 应用程序中使用。

此类别中目前包含的非特定预编译是 `ECRecoverPublicKey` 和 `SHA3FIPS256` 预编译。

在下一节中，您将了解有关这些预编译中包含的功能的更多信息。

## 使用 ECRecoverPublicKey 检索公钥 {: verifying-signatures-ecrecoverpublickey }

`ECRecoverPublicKey` 预编译的主要功能是从给定的消息哈希和签名中恢复用于创建数字签名的公钥。此预编译类似于 [ECRecover](/builders/ethereum/precompiles/utility/eth-mainnet/#verify-signatures-with-ecrecover/){target=_blank}，但区别在于它返回签署消息的帐户的公钥，而不是帐户地址。

在以下部分中，您将学习如何使用 `ECRecoverPublicKey` 预编译。

### 检查先决条件 {: #checking-prerequisites }

--8<-- 'text/_common/install-nodejs.md'

本示例中使用的版本为 v20.15.0 (Node.js) 和 10.7.0 (npm)。您还需要通过执行以下命令安装 [Web3](https://web3js.readthedocs.io/en/latest){target=_blank} 包：

```bash
npm install --save web3
```

要验证已安装的 Web3 版本，您可以使用 `ls` 命令：

```bash
npm ls web3
本示例使用 4.11.1 版本。您还将使用 [Remix](/builders/ethereum/dev-env/remix/){target=_blank}，通过 [MetaMask](/tokens/connect/metamask/){target=_blank} 将其连接到 Moonbase Alpha TestNet。

--8<-- 'text/_common/endpoint-examples.md'

### 检索交易签名值

要使用 `ECRecoverPublicKey` 预编译，您必须首先签署消息以创建和检索消息哈希和交易签名值（`v`、`r`、`s`），以作为合约调用中的参数传递。在处理私钥时，请务必始终使用安全最佳实践。

在您的项目目录中创建一个名为 `signMessage.js` 的新文件：

```bash
touch signMessage.js
```

在您的代码编辑器中打开 `signMessage.js`，并添加以下脚本以使用 Moonbase Alpha TestNet 初始化 Web3，对消息进行签名和哈希处理，并返回签名值：

```js title="signMessage.js"
--8<-- 'code/builders/ethereum/precompiles/utility/nonspecific/signMessage.js'
```

返回到您的终端命令行，使用以下命令运行脚本：

```bash
node signMessage.js
```

此代码将在终端中返回以下对象：

--8<-- 'code/builders/ethereum/precompiles/utility/nonspecific/terminal/signature.md'

保存这些值，因为您将在下一节中需要它们。

### 测试 ECRecoverPublicKey 合约

现在您可以访问 [Remix](https://remix.ethereum.org/){target=\_blank} 来测试预编译合约。请注意，您也可以使用 Web3.js 库，但在这种情况下，您可以转到 Remix 以确保它使用区块链上的预编译合约。您可以使用以下 Solidity 代码来检索公钥：

```solidity title="RecoverPublicKey.sol"
--8<-- 'code/builders/ethereum/precompiles/utility/nonspecific/RecoverPublicKey.sol'
```

使用 [Remix 编译器和部署](/builders/ethereum/dev-env/remix/){target=\_blank} 以及 [MetaMask 指向 Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}，您可以部署合约并调用 `recoverPublicKey()` 方法，该方法返回签署消息的帐户的公钥。现在您可以将此公钥值用于其他加密功能和验证。

![Remix 上返回的公钥](/images/builders/ethereum/precompiles/utility/nonspecific/nonspecific-1.webp)

## 使用 SHA3FIPS256 创建哈希 {: #create-a-hash-with-sha3fips256 }

SHA3-256 是 SHA-3 系列密码哈希算法的一部分，该算法在 [FIPS202](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf){target=_blank} 中进行了编码，可生成长度为 256 位的输出。尽管名称与 SHA256 相似，但 SHA-3 系列是使用完全不同的算法构建的，因此对于相同的输入，产生的哈希输出与 SHA256 不同。您可以使用此 [SHA3-256 哈希计算器工具](https://md5calc.com/hash/sha3-256){target=_blank}自行验证。计算出 SHA3-256 输出后，在下拉选择器中将算法更改为 SHA256，并注意生成的输出。

目前，Solidity 中没有 SHA3-256 支持，因此需要使用内联汇编来调用它。以下示例代码可用于调用此预编译。

```solidity
--8<-- 'code/builders/ethereum/precompiles/utility/eth-mainnet/sha3fips.sol'
```

使用 [Remix](/builders/ethereum/dev-env/remix/){target=_blank} 并通过 [MetaMask 指向 Moonbase Alpha](/tokens/connect/metamask/){target=_blank}，您可以部署合约并调用 `sha3fips(bytes memory data)` 方法以返回数据参数的编码字符串。

--8<-- 'text/_disclaimers/third-party-content-intro.md'
