---
title: Solidity 预编译
description: Moonbeam 上可用 Solidity 预编译合约的概述。通过预编译合约，您可以使用 Ethereum API 与 Substrate 功能进行交互。
categories: Reference, Basics
---

# Moonbeam 预编译合约概览

## 概述 {: #introduction }

在 Moonbeam 上，预编译合约是具有以太坊风格地址的原生 Substrate 代码，可以使用以太坊 API 调用，就像任何其他智能合约一样。预编译允许您直接调用 Substrate 运行时，这通常无法从 Moonbeam 的以太坊端访问。

负责实现预编译的 Substrate 代码可以在 [EVM pallet](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm/){target=_blank} 中找到。EVM pallet 包括 [以太坊上的标准预编译和一些特定于以太坊的附加预编译](https://github.com/polkadot-evm/frontier/tree/master/frame/evm/precompile){target=_blank}。它还提供了通过通用 [`Precompiles` trait](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm/trait.Precompile.html){target=_blank} 创建和执行自定义预编译的能力。已经创建了几个自定义的 Moonbeam 特定的预编译，所有这些都可以在 [Moonbeam 代码库](https://github.com/moonbeam-foundation/moonbeam/tree/master/precompiles){target=_blank} 中找到。重要的是要强调，此列表中的 `CallableByContract` 检查的预编译无法在合约构造函数内部调用。

以太坊预编译合约包含计算密集型的复杂功能，例如哈希和加密。Moonbeam 上的自定义预编译合约提供对基于 Substrate 的功能的访问，例如 Staking、治理、XCM 相关功能等。

Moonbeam 特定的预编译可以通过使用以太坊 API 的熟悉且易于使用的 Solidity 接口进行交互，这些接口最终用于与底层 Substrate 接口进行交互。此流程如下图所示：

![预编译合约示意图](/images/builders/ethereum/precompiles/overview/overview-1.webp)

--8<-- 'text/builders/ethereum/precompiles/security.md'

## 预编译合约地址 {: #precompiled-contract-addresses }

预编译合约按地址和原始网络进行分类。如果您要将预编译地址转换为十进制格式，并按数值将其分为几类，则这些类别如下：

- **0-1023** - [以太坊主网预编译](#ethereum-mainnet-precompiles)
- **1024-2047** - [不在以太坊中且不是 Moonbeam 特有的预编译](#non-moonbeam-specific-nor-ethereum-precomiles)
- **2048-4095** - [Moonbeam 特有的预编译](#moonbeam-specific-precompiles)

--8<-- 'text/builders/ethereum/canonical-contracts/eth-mainnet.md'

--8<-- 'text/builders/ethereum/canonical-contracts/non-specific.md'
