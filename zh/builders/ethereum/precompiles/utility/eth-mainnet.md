---
title: Ethereum MainNet 预编译
description: 了解如何使用以太坊上的标准预编译合约，例如在 Moonbeam 上的 ECRECOVER、SHA256 等。
keywords: ethereum, moonbeam, ecrecover, sha256, ripemd-160, Bn128Add, Bn128Mul, Bn128Pairing
categories: Precompiles, Ethereum Toolkit
---

# 以太坊主网预编译合约

## 简介 {: #introduction }

以太坊中的预编译合约是指包含复杂加密计算但不需要 EVM 开销的合约。这些预编译可以在 EVM 中用于处理特定的常见操作，例如哈希和签名方案。

目前包括以下预编译：ecrecover、sha256、ripemd-160、Bn128Add、Bn128Mul、Bn128Pairing、identity 函数和模幂运算。

这些预编译在以太坊上原生可用，并且为了保持以太坊的兼容性，它们在 Moonbeam 上也可用。

在本指南中，您将学习如何使用和/或验证这些预编译。

## 使用 ECRECOVER 验证签名 {: #verify-signatures-with-ecrecover }

此预编译的主要功能是验证消息的签名。通常来说，您将交易的签名值提供给 `ecrecover`，它会返回一个地址。如果返回的地址与发送交易的公共地址相同，则签名已验证。

以下是一个小例子，展示如何利用此预编译函数。您需要检索交易的签名值（`v`、`r`、`s`）。因此，您将签名并检索已签名消息，其中包含这些值：

```js
--8<-- 'code/builders/ethereum/precompiles/utility/eth-mainnet/ecrecover.js'
```

此代码将在终端中返回以下对象：

```
--8<-- 'code/builders/ethereum/precompiles/utility/eth-mainnet/ecrecoverresult.md'
```

有了必要的值，您可以转到 [Remix](/builders/ethereum/dev-env/remix/){target=_blank} 来测试预编译的合约。请注意，这也可以使用 Web3.js 库进行验证，但在这种情况下，您可以转到 Remix 以确保它正在使用区块链上的预编译合约。您可以用来验证签名的 Solidity 代码如下：

```solidity
--8<-- 'code/builders/ethereum/precompiles/utility/eth-mainnet/ecrecoverremix.sol'
```

使用 [Remix 编译器和部署](/builders/ethereum/dev-env/remix/){target=_blank} 并且 [MetaMask 指向 Moonbase Alpha](/tokens/connect/metamask/){target=_blank}，您可以部署合约并调用 `verify()` 方法，如果 `ecrecover` 返回的地址等于用于签署消息的地址（与私钥相关，需要在合约中手动设置），则返回 **true**。

## 使用 SHA256 进行哈希 {: #hashing-with-sha256 }

此哈希函数从给定的数据返回 SHA256 哈希值。要测试此预编译合约，您可以使用此 [SHA256 哈希计算器工具](https://md5calc.com/hash/sha256){target=_blank} 来计算您想要的任何字符串的 SHA256 哈希值。在本例中，您将使用 `Hello World!`。您可以直接前往 Remix 并部署以下代码，其中计算出的哈希值设置为 `expectedHash` 变量：

```solidity
--8<-- 'code/builders/ethereum/precompiles/utility/eth-mainnet/sha256.sol'
```

合约部署完成后，您可以调用 `checkHash()` 方法，如果 `calculateHash()` 返回的哈希值等于提供的哈希值，则返回 **true**。

## 使用 RIPEMD160 哈希 {: #hashing-with-ripemd-160 }

此哈希函數從給定的數據返回 RIPEMD160 哈希。要測試此預編譯，您可以使用此 [RIPEMD160 哈希計算器工具](https://md5calc.com/hash/ripemd160){target=_blank} 來計算任何字符串的 RIPEMD160 哈希。在這種情況下，您將再次使用 `Hello World!` 執行此操作。您將重用與以前相同的代碼，但使用 `ripemd160` 函數。請注意，它返回一個 `bytes20` 類型的變量：

```solidity
--8<-- 'code/builders/ethereum/precompiles/utility/eth-mainnet/ripemd160.sol'
```

部署合約後，您可以調用 `checkHash()` 方法，如果 `calculateHash()` 返回的哈希等於提供的哈希，則返回 **true**。

## BN128Add {: #bn128add }

BN128Add 预编译实现了本地椭圆曲线点加法。它返回一个椭圆曲线点，表示 `(ax, ay) + (bx, by)`，使得 `(ax, ay)` 和 `(bx, by)` 是 BN256 曲线上的有效点。

目前 Solidity 中没有 BN128Add 的支持，所以需要使用内联汇编来调用。以下示例代码可用于调用此预编译。

```solidity
--8<-- 'code/builders/ethereum/precompiles/utility/eth-mainnet/bn128add.sol'
```

使用 [Remix 编译器和部署](/builders/ethereum/dev-env/remix/){target=_blank} 并使用 [MetaMask 指向 Moonbase Alpha](/tokens/connect/metamask/){target=_blank}，您可以部署合约并调用 `callBn256Add(bytes32 ax, bytes32 ay, bytes32 bx, bytes32 by)` 方法以返回操作结果。

## BN128Mul {: #bn128mul }

BN128Mul 预编译实现了与标量值的原生椭圆曲线乘法。它返回一个椭圆曲线点，表示 `scalar * (x, y)`，使得 `(x, y)` 是 BN256 曲线上的有效曲线点。

目前，Solidity 中没有 BN128Mul 支持，因此需要使用内联汇编来调用它。以下示例代码可用于调用此预编译。

```solidity
--8<-- 'code/builders/ethereum/precompiles/utility/eth-mainnet/bn128mul.sol'
```

使用 [Remix 编译器和部署](/builders/ethereum/dev-env/remix/){target=_blank} 以及 [指向 Moonbase Alpha 的 MetaMask](/tokens/connect/metamask/){target=_blank}，您可以部署合约并调用 `callBn256ScalarMul(bytes32 x, bytes32 y, bytes32 scalar)` 方法来返回操作结果。

## BN128配对 {: #bn128pairing }

BN128 配对预编译实现了椭圆曲线配对操作，以执行 zkSNARK 验证。有关更多信息，请查看 [EIP-197 标准](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-197.md){target=_blank}。

目前 Solidity 中没有 BN128 配对支持，因此需要使用内联汇编来调用它。以下示例代码可用于调用此预编译。

```solidity
--8<-- 'code/builders/ethereum/precompiles/utility/eth-mainnet/bn128pairing.sol'
```

使用 [Remix 编译器和部署](/builders/ethereum/dev-env/remix/){target=_blank} 以及 [MetaMask 指向 Moonbase Alpha](/tokens/connect/metamask/){target=_blank}，您可以部署合约并调用 `function callBn256Pairing(bytes memory input)` 方法以返回操作结果。

## 身份函数 {: #the-identity-function }

也被称为数据复制，此函数提供了一种更便宜的在内存中复制数据的方法。

目前，Solidity 中不支持身份函数，因此需要使用内联汇编来调用它。以下示例代码（改编自 Solidity）可用于调用此预编译合约：

```solidity
--8<-- 'code/builders/ethereum/precompiles/utility/eth-mainnet/identity.sol'
```

您可以使用此 [Web3 类型转换器工具](https://web3-type-converter.onbrn.com){target=_blank} 从任何字符串获取字节，因为这是 `callDataCopy()` 方法的输入。

部署合约后，您可以调用 `callDataCopy()` 方法并验证 `memoryStored` 是否与您作为函数输入传递的字节匹配。

## 模幂运算 {: #modular-exponentiation }

此预编译计算整数 `b`（底数）的 `e` 次方（指数）除以正整数 `m`（模数）后的余数。

Solidity 编译器不支持此功能，因此需要使用内联汇编来调用。以下代码经过简化，用于展示此预编译的功能：

```solidity
--8<-- 'code/builders/ethereum/precompiles/utility/eth-mainnet/modularexp.sol'
```

您可以尝试在 [Remix](/builders/ethereum/dev-env/remix/){target=_blank} 中执行此操作。使用 `verify()` 函数，传递底数、指数和模数。此函数将把结果存储在 `checkResult` 变量中。

## P256 验证 {: #p256-verify }

P256Verify 预编译增加了对 [RIP-7212](https://github.com/ethereum/RIPs/blob/master/RIPS/rip-7212.md){target=_blank} 的支持，即 Secp256r1 椭圆曲线的签名验证。此预编译添加了签名验证的 WASM 实现，旨在由可用的本机运行时函数调用替换。

```solidity
--8<-- 'code/builders/ethereum/precompiles/utility/eth-mainnet/p256verify.sol'
```

下面的文件包含两个不同的测试用例：一个具有有效的签名测试，第二个具有无效的签名测试。

??? code "p256verifywithtests.sol"
    ```solidity
    --8<-- 'code/builders/ethereum/precompiles/utility/eth-mainnet/p256verifywithtests.sol'
    ```

使用 [Remix 编译器和部署](/builders/ethereum/dev-env/remix/){target=_blank} 以及 [指向 Moonbase Alpha 的 MetaMask](/tokens/connect/metamask/){target=_blank}，您可以部署合约并使用以下参数调用 `verify` 方法：

=== “有效签名”

	| 参数       | 值                                                                                                                                             |
	|--------------|------------------------------------------------------------------------------------------------------------------------------------------------|
	| `msg_hash`   | `0xb5a77e7a90aa14e0bf5f337f06f597148676424fae26e175c6e5621c34351955`                                                                           |
	| `signature`  | `["0x289f319789da424845c9eac935245fcddd805950e2f02506d09be7e411199556", "0xd262144475b1fa46ad85250728c600c53dfd10f8b3f4adf140e27241aec3c2da"]` |
	| `public_key` | `["0x3a81046703fccf468b48b145f939efdbb96c3786db712b3113bb2488ef286cdc", "0xef8afe82d200a5bb36b5462166e8ce77f2d831a52ef2135b2af188110beaefb1"]` |
	| 预期结果   | `true`                                                                                                                                         |

=== “无效签名”

	| 参数          | 值                                                                                                                                             |
	|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------|
	| `msg_hash`      | `0xd182e6ad7f520e511f6c3e2b8c68059b6bbd41fbabd9831f79217e1319cde05b`                                                                           |
	| `signature`     | `["0x6162630000000000000000000000000000000000000000000000000000000000", "0x6162630000000000000000000000000000000000000000000000000000000000"]` |
	| `public_key`    | `["0x6162630000000000000000000000000000000000000000000000000000000000", "0x6162630000000000000000000000000000000000000000000000000000000000"]` |
	| 预期结果   | `false`                                                                                                                                          |

您将收到两个布尔值作为响应；第一个指示签名是否有效，第二个指示对 P256Verify 预编译的调用是否成功。第二个布尔值应始终返回 true；第一个是检查签名是否有效的那个。
