---
title: 将 XC-20 发送到其他链
description: 了解如何使用 X-Tokens 预编译和熟悉的以太坊库（如 Ethers 和 Web3），通过跨共识消息传递 (XCM) 跨链发送资产。
categories: Precompiles, XC-20, Ethereum Toolkit
---

# 使用 X-Tokens 预编译发送 XC-20s

## 简介 {: #introduction }

构建用于可替换资产转移的 XCM 消息并非易事。因此，开发人员可以利用包装函数和托盘在 Polkadot 和 Kusama 上使用 XCM 功能。此类包装器的一个示例是 [Polkadot XCM](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=_blank} 托盘，它提供了通过 XCM 转移可替换资产的不同方法。

[Polkadot XCM 托盘](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=_blank} 以 Rust 编码，通常无法从 Moonbeam 的 Ethereum API 端访问。但是，[XCM 预编译](/builders/interoperability/xcm/xc20/send-xc20s/eth-api/){target=_blank} 和 X-Tokens 预编译允许您直接与 Polkadot XCM 托盘交互，以从 Solidity 接口发送 XC-20。

本指南将向您展示如何利用 X-Tokens 预编译，使用 Ethers 和 Web3 等 Ethereum 库将 [XC-20](/builders/interoperability/xcm/xc20/overview/){target=_blank} 从基于 Moonbeam 的网络发送到生态系统中的其他链（中继链/平行链）。

**开发人员必须了解，发送不正确的 XCM 消息可能会导致资金损失。** 因此，在进入生产环境之前，必须在 TestNet 上测试 XCM 功能。

## X-Tokens 预编译合约地址 {: #contract-address }

X-Tokens 预编译合约位于以下地址：

=== "Moonbeam"

     text
     {{networks.moonbeam.precompiles.xtokens}}
     

=== "Moonriver"

     text
     {{networks.moonriver.precompiles.xtokens}}
     

=== "Moonbase Alpha"

     text
     {{networks.moonbase.precompiles.xtokens}}
     

--8<-- 'text/builders/ethereum/precompiles/security.md'

## X-Tokens Solidity 接口 {: #xtokens-solidity-interface }

[Xtokens.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=_blank} 是一个接口，开发人员可以通过它使用 Ethereum API 与 X-Tokens Pallet 进行交互。

??? code "Xtokens.sol"

    ```solidity
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/Xtokens.sol'
    ```

该接口包括以下函数：

???+ function "**transfer**(*address* currencyAddress, *uint256* amount, *Multilocation* *memory* destination, *uint64* weight) — 转移一种货币，给定货币的合约地址"

    === "参数"

        - `currencyAddress` - 要转移的资产的地址
            - 对于 [外部 XC-20](/builders/interoperability/xcm/xc20/overview/#external-xc20s){target=_blank}，请提供 [XC-20 预编译地址](/builders/interoperability/xcm/xc20/overview/#current-xc20-assets){target=_blank}
            - 对于原生代币（即 GLMR、MOVR 和 DEV），请提供 [ERC-20 预编译](/builders/ethereum/precompiles/ux/erc20/#the-erc20-interface){target=_blank} 地址，该地址为 `{{networks.moonbeam.precompiles.erc20 }}`
            - 对于 [本地 XC-20](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=_blank}，请提供代币的地址
        - `amount` - 将通过 XCM 发送的代币数量
        - `destination` - 通过 XCM 发送的代币的目标地址的多位置。它支持不同的地址格式，例如 20 字节或 32 字节地址（Ethereum 或 Substrate）。多位置必须以特定方式格式化，这在 [构建预编译多位置](#building-the-precompile-multilocation) 部分中进行了描述
        - `weight` - 要购买的权重，用于支付目标链上 XCM 执行的费用，该费用从转移的资产中扣除

??? function "**transferWithFee**(*address* currencyAddress, *uint256* amount, *uint256* fee, *Multilocation* *memory* destination, *uint64* weight) — 转移一种货币，定义为原生代币（自留）或资产 ID，并从金额中单独指定费用"

    === "参数"

        - `currencyAddress` - 要转移的资产的地址
            - 对于 [外部 XC-20](/builders/interoperability/xcm/xc20/overview/#external-xc20s){target=_blank}，请提供 [XC-20 预编译地址](/builders/interoperability/xcm/xc20/overview/#current-xc20-assets){target=_blank}
            - 对于原生代币（即 GLMR、MOVR 和 DEV），请提供 [ERC-20 预编译](/builders/ethereum/precompiles/ux/erc20/#the-erc20-interface){target=_blank} 地址，该地址为 `{{networks.moonbeam.precompiles.erc20 }}`
            - 对于 [本地 XC-20](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=_blank}，请提供代币的地址
        - `amount` - 将通过 XCM 发送的代币数量
        - `fee` — 用于支付目标（目的地）链中 XCM 执行的金额。如果此值不足以支付执行成本，则资产将困在目标链中
        - `destination` - 通过 XCM 发送的代币的目标地址的多位置。它支持不同的地址格式，例如 20 字节或 32 字节地址（Ethereum 或 Substrate）。多位置必须以特定方式格式化，这在 [构建预编译多位置](#building-the-precompile-multilocation) 部分中进行了描述
        - `weight` - 要购买的权重，用于支付目标链上 XCM 执行的费用，该费用从转移的资产中扣除

??? function "**transferMultiasset**(*Multilocation* *memory* asset, *uint256* amount, *Multilocation* *memory* destination, *uint64* weight) — 转移一种可替代资产，由其多位置定义"

    === "参数"

        - `asset` - 要转移的资产的多位置。多位置必须以特定方式格式化，这在 [构建预编译多位置](#building-the-precompile-multilocation) 部分中进行了描述
        - `amount` - 将通过 XCM 发送的代币数量
        - `destination` - 通过 XCM 发送的代币的目标地址的多位置。它支持不同的地址格式，例如 20 字节或 32 字节地址（Ethereum 或 Substrate）。多位置必须以特定方式格式化，这在 [构建预编译多位置](#building-the-precompile-multilocation) 部分中进行了描述
        - `weight` - 要购买的权重，用于支付目标链上 XCM 执行的费用，该费用从转移的资产中扣除

??? function "**transferMultiassetWithFee**(*Multilocation* *memory* asset, *uint256* amount, *uint256* fee, *Multilocation* *memory* destination, *uint64* weight) — 转移一种可替代资产，由其多位置定义，并以不同的资产（也由其多位置定义）支付费用"

    === "参数"

        - `asset` - 要转移的资产的多位置。多位置必须以特定方式格式化，这在 [构建预编译多位置](#building-the-precompile-multilocation) 部分中进行了描述
        - `amount` - 将通过 XCM 发送的代币数量
        - `fee` — 用于支付目标（目的地）链中 XCM 执行的金额。如果此值不足以支付执行成本，则资产将困在目标链中
        - `destination` - 通过 XCM 发送的代币的目标地址的多位置。它支持不同的地址格式，例如 20 字节或 32 字节地址（Ethereum 或 Substrate）。多位置必须以特定方式格式化，这在 [构建预编译多位置](#building-the-precompile-multilocation) 部分中进行了描述
        - `weight` - 要购买的权重，用于支付目标链上 XCM 执行的费用，该费用从转移的资产中扣除

??? function "**transferMulticurrencies**(*Currency[]* *memory* currencies, *uint32* feeItem, *Multilocation* *memory* destination, *uint64* weight) — 转移不同的货币，指定哪种货币用作费用。每种货币都定义为原生代币（自留）或资产 ID"

    === "参数"

        - `currencies` - 要发送的货币的数组，这些货币由其货币地址和要发送的金额标识
        - `feeItem` — 一个索引，用于定义要发送的资产数组的资产位置，用于支付目标链中 XCM 执行的费用。例如，如果只发送一种资产，则 `feeItem` 将为 `0`
        - `destination` - 通过 XCM 发送的代币的目标地址的多位置。它支持不同的地址格式，例如 20 字节或 32 字节地址（Ethereum 或 Substrate）。多位置必须以特定方式格式化，这在 [构建预编译多位置](#building-the-precompile-multilocation) 部分中进行了描述
        - `weight` - 要购买的权重，用于支付目标链上 XCM 执行的费用，该费用从转移的资产中扣除

??? function "**transferMultiassets**(*MultiAsset[]* *memory* assets, *uint32* feeItem, *Multilocation* *memory* destination, *uint64* weight) — 转移几种可替代资产，由其多位置定义，并以其中一种资产（也由其多位置定义）支付费用"

    === "参数"

        - `assets` - 要转移的每种资产的多位置数组。多位置必须以特定方式格式化，这在 [构建预编译多位置](#building-the-precompile-multilocation) 部分中进行了描述
        - `feeItem` — 一个索引，用于定义要发送的资产数组的资产位置，用于支付目标链中 XCM 执行的费用。例如，如果只发送一种资产，则 `feeItem` 将为 `0`
        - `destination` - 通过 XCM 发送的代币的目标地址的多位置。它支持不同的地址格式，例如 20 字节或 32 字节地址（Ethereum 或 Substrate）。多位置必须以特定方式格式化，这在 [构建预编译多位置](#building-the-precompile-multilocation) 部分中进行了描述
        - `weight` - 要购买的权重，用于支付目标链上 XCM 执行的费用，该费用从转移的资产中扣除

## 构建预编译多重定位 {: #building-the-precompile-multilocation }

[多重定位](/builders/interoperability/xcm/core-concepts/multilocations/){target=_blank}定义了相对于给定原点的整个中继链/平行链生态系统中的特定点。它们经常被 X-Tokens 预编译用来定义资产和目标链及账户的位置。

多重定位需要以预编译可以理解的特定方式进行格式化，这与和 pallet 交互时看到的格式不同。在 X-Tokens 预编译接口中，`Multilocation` 结构定义如下：

--8<-- 'text/builders/interoperability/xcm/xcm-precompile-multilocation.md'

以下代码片段提供了一些多重定位结构的示例，它们需要被提供给 X-Tokens 预编译函数：

```js
--8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/multilocations.js'
```

## 构建 XCM 消息 {: #build-xcm-xtokens-precompile }

本指南介绍了使用 X-Tokens 预编译构建 XCM 消息的过程，更具体地说，是使用 `transfer` 和 `transferMultiasset` 函数。然而，这两个用例可以推广到预编译的其他函数，特别是当您熟悉多位置时。

您将传输 xcUNIT 代币，它们是 Alphanet 中继链代币 UNIT 的 [XC-20](/builders/interoperability/xcm/xc20/overview/){target=_blank} 表示。您可以针对任何其他 XC-20 调整本指南。

### 检查先决条件 {: #xtokens-check-prerequisites}

要学习本指南中的示例，您需要具备以下条件：

- X-Tokens预编译合约的ABI

    ??? code "X-Tokens预编译合约ABI"

        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/abi.js'
        ```

- 一个有资金的账户。
 --8<-- 'text/_common/faucet/faucet-list-item.md'
- 一些xcUNIT代币。您可以在[Moonbeam-Swap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}上使用DEV代币（Moonbase Alpha的本地代币）兑换xcUNIT，Moonbeam-Swap是Moonbase Alpha上的一个演示版的Uniswap-V2克隆。

    !!! note
        您可以修改本指南以转移另一个[外部XC-20或者本地XC-20](/builders/interoperability/xcm/xc20/overview/){target=_blank}。对于外部XC-20，您需要资产ID和资产的小数位数。对于本地XC-20，您需要合约地址。

    ![Moonbeam Swap xcUNIT](/images/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/xtokens-1.webp)

    要检查您的xcUNIT余额，您可以将XC-20的[预编译地址](/builders/interoperability/xcm/xc20/interact/#calculate-xc20-address){target=_blank}添加到MetaMask，地址如下：

    ```
    0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080
    ```

!!! note
    要在Moonbeam或Moonriver上测试这些示例，您可以将RPC URL替换为您自己的端点和API密钥，您可以从受支持的[端点提供商](/builders/get-started/endpoints/){target=_blank}处获得。

### 确定 XCM 执行所需的权重 {: #determining-weight }

要确定目标链上 XCM 执行所需的权重，您需要知道哪些 XCM 指令在目标链上执行。您可以在[通过 X-Tokens 进行传输的 XCM 指令](/builders/interoperability/xcm/xc20/send-xc20s/overview/#xcm-instructions-for-asset-transfers){target=_blank}指南中找到使用的 XCM 指令的概述。

!!! note
    一些权重包括数据库读取和写入；例如，`WithdrawAsset` 和 `DepositAsset` 指令既包括一个数据库读取又包括一个写入。要获得总权重，您需要将任何必需的数据库读取或写入的权重添加到给定指令的基本权重中。

    对于基于 Westend 的中继链，如 Alphanet，您可以在 GitHub 上的 [polkadot-sdk](https://github.com/paritytech/polkadot-sdk){target=_blank}存储库中获得 [Rocks DB](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/constants/src/weights/rocksdb_weights.rs#L27-L31){target=_blank}（这是默认数据库）的读取和写入数据库操作的权重成本。

由于 Alphanet 是基于 Westend 的中继链，因此您可以参考[Westend 运行时代码](https://github.com/paritytech/polkadot-sdk/tree/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend){target=_blank}中定义的指令权重，这些指令权重分为两种类型：[可替代](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs){target=_blank}和 [通用](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_generic.rs){target=_blank}。

重要的是要注意，每个链都定义了自己的权重要求。要确定给定链上每个 XCM 指令所需的权重，请参阅链的文档或联系其团队成员.要了解如何查找 Moonbeam、Polkadot 或 Kusama 所需的权重，您可以参考我们关于[权重和费用](/builders/interoperability/xcm/core-concepts/weights-fees/){target=_blank}的文档。

### X-Tokens 预编译传输函数 {: #precompile-transfer }

要使用 X-Tokens 预编译的 `transfer` 函数，您需要执行以下常规步骤：

1. 使用 Moonbase Alpha RPC 端点创建一个 provider
2. 创建一个签名者来发送交易。此示例使用私钥来创建签名者，仅用于演示目的。**切勿将您的私钥存储在 JavaScript 文件中**
3. 使用预编译的地址和 ABI 创建 X-Tokens 预编译的合约实例
4. 组装 `transfer` 函数的参数：

    - `currencyAddress` - xcUNIT 的地址：`0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080`
    - `amount` - 1 xcUNIT。由于 xcUNIT 有 12 位小数，您可以使用：`1000000000000`
    - `destination` - 目标的多重定位，它定位中继链上的 Alice 的帐户：`'0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300'`
    - `weight` - 为目标链上的 XCM 执行购买的[权重](#determining-weight)：`{{ networks.alphanet.xcm_message.transfer.weight.display }}`

5. 创建 `transfer` 函数，传入参数
6. 签名并发送交易

=== "Ethers.js"

    js
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer/ethers.js'
    

=== "Web3.js"

    js
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer/web3.js'
    

=== "Web3.py"

    py
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer/web3.py'

### X-Tokens 预编译转移多资产函数 {: #precompile-transfer-multiasset}

要使用 X-Tokens 预编译的 `transfer` 函数，您需要执行以下常规步骤：

1. 使用 Moonbase Alpha RPC 端点创建一个 provider
2. 创建一个签名者以发送交易。此示例使用私钥创建签名者，仅用于演示目的。**切勿将您的私钥存储在 JavaScript 文件中**
3. 使用预编译的地址和 ABI 创建 X-Tokens 预编译的合约实例
4. 组合 `transferMultiasset` 函数的参数：

    - `asset` - xcUNIT 的多位置：`[1, []]`
    - `amount` - 1 xcUNIT。由于 xcUNIT 有 12 位小数，您可以使用：`1000000000000`
    - `destination` - 目标的多位置，目标是继电器链上的 Alice 帐户：`'0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300'`
    - `weight` - 在目标链上为 XCM 执行购买的[权重](#determining-weight)：`{{ networks.alphanet.xcm_message.transfer.weight.numbers_only }}`

5. 创建 `transferMultiasset` 函数，传入参数
6. 签名并发送交易

===

    js
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer-multiasset/ethers.js'
    

===

    js
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer-multiasset/web3.js'
    

===

    py
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer-multiasset/web3.py'
