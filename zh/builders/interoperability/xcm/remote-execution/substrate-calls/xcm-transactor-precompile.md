---
title: XCM交易器预编译
description: 本指南介绍了XCM交易器预编译，并展示了如何使用它的一些功能，通过以太坊库向其他链发送远程调用。
categories: XCM 远程执行
---

# 使用 XCM Transactor 预编译进行远程执行

XCM 消息由一系列由跨共识虚拟机 (XCVM) 执行的[指令](builders/interoperability/xcm/core-concepts/instructions/){target=\_blank}组成。这些指令的组合会产生预定的操作，例如跨链代币转移，更有趣的是，远程跨链执行。远程执行涉及从一个区块链在另一个区块链上执行操作或动作，同时保持发送者身份和权限的完整性。

通常，XCM 消息是从根源（即 SUDO 或通过治理）发送的，这对于希望通过简单交易利用远程跨链调用的项目来说并不理想。[XCM Transactor Pallet](https://github.com/moonbeam-foundation/moonbeam/blob/master/pallets/xcm-transactor/src/lib.rs){target=\_blank} 可以通过[主权账户](builders/interoperability/xcm/overview/#general-xcm-definitions){target=\_blank}（应仅允许通过治理）或通过来自源链的简单交易的[计算来源账户](builders/interoperability/xcm/remote-execution/computed-origins/){target=\_blank}，轻松地在远程链上进行交易。

但是，XCM Transactor Pallet 是用 Rust 编写的，通常无法从 Moonbeam 的 Ethereum API 端访问。因此，Moonbeam 引入了 XCM Transactor 预编译，它是一个 Solidity 接口，允许您使用 Ethereum API 直接与 Substrate pallet 交互。

本指南将向您展示如何使用 XCM Transactor 预编译将 XCM 消息从基于 Moonbeam 的网络发送到生态系统中的其他链。

**请注意，通过 XCM 消息远程执行的操作仍然存在限制**。

**开发人员必须了解，发送不正确的 XCM 消息可能会导致资金损失。** 因此，在转移到生产环境之前，必须在测试网上测试 XCM 功能。

## XCM Transactor 预编译合约地址 {: #precompile-address }

XCM Transactor 预编译有多个版本。**V1 将在不久的将来被弃用**，因此所有实现都必须迁移到更新的接口。

XCM Transactor 预编译位于以下地址：

=== "Moonbeam"

    | 版本  |                                地址                                 |
    |:-------:|:----------------------------------------------------------------------:|
    |   V1    | <pre>```{{ networks.moonbeam.precompiles.xcm_transactor_v1 }}```</pre> |
    |   V2    | <pre>```{{ networks.moonbeam.precompiles.xcm_transactor_v2 }}```</pre> |
    |   V3    | <pre>```{{ networks.moonbeam.precompiles.xcm_transactor_v3 }}```</pre> |

=== "Moonriver"

    | 版本  |                                 地址                                 |
    |:-------:|:-----------------------------------------------------------------------:|
    |   V1    | <pre>```{{ networks.moonriver.precompiles.xcm_transactor_v1 }}```</pre> |
    |   V2    | <pre>```{{ networks.moonriver.precompiles.xcm_transactor_v2 }}```</pre> |
    |   V3    | <pre>```{{ networks.moonriver.precompiles.xcm_transactor_v3 }}```</pre> |

=== "Moonbase Alpha"

    | 版本  |                                地址                                 |
    |:-------:|:----------------------------------------------------------------------:|
    |   V1    | <pre>```{{ networks.moonbase.precompiles.xcm_transactor_v1 }}```</pre> |
    |   V2    | <pre>```{{ networks.moonbase.precompiles.xcm_transactor_v2 }}```</pre> |
    |   V3    | <pre>```{{ networks.moonbase.precompiles.xcm_transactor_v3 }}```</pre> |

--8<-- 'zh/text/builders/ethereum/precompiles/security.md'

## XCM Transactor Solidity 接口 {: #xcmtrasactor-solidity-interface }

XCM Transactor 预编译合约是一个 Solidity 接口，开发者可以通过它使用 Ethereum API 与 XCM Transactor Pallet 交互。

??? code "XcmTransactorV1.sol"

    ```solidity
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/XcmTransactorV1.sol'
    ```

??? code "XcmTransactorV2.sol"

    ```solidity
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/XcmTransactorV2.sol'
    ```

??? code "XcmTransactorV3.sol"

    ```solidity
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/XcmTransactorV3.sol'
    ```

!!! note
    [XCM Transactor Precompile V1](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v1/XcmTransactorV1.sol){target=\_blank} 将在不久的将来被弃用，因此所有实现都必须迁移到更新的接口。

该接口在不同版本之间略有不同。您可以在下面找到每个版本的接口概述。

=== "V2"

    V2 接口包括以下函数：

    ??? function "**transactInfoWithSigned**(*Multilocation* *memory* multilocation) — 一个只读函数，返回给定链的事务信息"

        === "Parameters"

            - `multilocation` - 要获取事务信息的链的 multilocation
        
        === "Returns"

            以下事务信息：

              - 与外部调用执行相关的三个 XCM 指令 (`transactExtraWeight`)
              - 与通过签名 extrinsic 进行事务的 `DescendOrigin` XCM 指令相关的额外权重信息 (`transactExtraWeightSigned`)
              - 给定链中消息允许的最大权重

            ```js
            [ 173428000n, 0n, 20000000000n ]
            ```

    ??? function "**feePerSecond**(*Multilocation* *memory* multilocation) — 一个只读函数，返回每秒 XCM 执行的 token 单位数，该值作为给定资产的 XCM 执行费用收取。当对于给定链，有多个资产可用于支付费用时，这非常有用"

        === "Parameters"

            - `multilocation` - 要获取每秒单位值的资产的 multilocation
        
        === "Returns"
            
            储备链对给定资产收取的每秒费用。

            ```js
            13764626000000n
            ```

    ??? function "**transactThroughSignedMultilocation**(*Multilocation* *memory* dest, *Multilocation* *memory* feeLocation, *uint64* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *uint64* overallWeight) — 发送一条 XCM 消息，其中包含在目标链中远程执行调用的指令。远程调用将由一个新账户签名并执行，该账户称为 [Computed Origin](builders/interoperability/xcm/remote-execution/computed-origins/){target=\_blank} 账户，目标平行链必须计算该账户。基于 Moonbeam 的网络遵循 [Polkadot 设定的 Computed Origins 标准](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-builder/src/location_conversion.rs){target=\_blank}。您需要提供用于支付费用的 token 的资产 multilocation，而不是 XC-20 token 的地址"

        === "Parameters"

            - `dest` - 生态系统中一条链的 multilocation，XCM 消息将发送到该链（目标链）。multilocation 必须以特定方式格式化，这在 [构建预编译 Multilocation](#building-the-precompile-multilocation) 部分中描述
            - `feeLocation` - 用于支付费用的资产的 multilocation。multilocation 必须以特定方式格式化，这在 [构建预编译 Multilocation](#building-the-precompile-multilocation) 部分中描述
            - `transactRequiredWeightAtMost` - 在目标链中购买的权重，用于执行在 `Transact` 指令中定义的调用
            - `call` - 在目标链中执行的调用，如 `Transact` 指令中定义
            - `feeAmount` - 用作费用的金额
            - `overallWeight` - extrinsic 可以用来执行所有 XCM 指令的总权重，加上 `Transact` 调用的权重 (`transactRequiredWeightAtMost`)。`overallWeight` 结构还包含 `refTime` 和 `proofSize`。如果您为 `refTime` 传递一个 uint64 的最大值，您将允许购买无限量的权重，从而无需确切知道目标链执行 XCM 需要多少权重

    ??? function "**transactThroughSigned**(*Multilocation* *memory* dest, *address* feeLocationAddress, *uint64* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *uint64* overallWeight) — 发送一条 XCM 消息，其中包含在目标链中远程执行调用的指令。远程调用将由一个新账户签名并执行，该账户称为 [Computed Origin](builders/interoperability/xcm/remote-execution/computed-origins/){target=\_blank} 账户，目标平行链必须计算该账户。基于 Moonbeam 的网络遵循 [Polkadot 设定的 Computed Origins 标准](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-builder/src/location_conversion.rs){target=\_blank}。您需要提供 XC-20 资产的地址以用于支付费用"

        === "Parameters"

            - `dest` - 生态系统中一条链的 multilocation，XCM 消息将发送到该链（目标链）。multilocation 必须以特定方式格式化，这在 [构建预编译 Multilocation](#building-the-precompile-multilocation) 部分中描述
            - `feeLocationAddress` - 用于支付费用的资产的 [XC-20 地址](builders/interoperability/xcm/xc20/overview/#current-xc20-assets){target=\_blank}
            - `transactRequiredWeightAtMost` - 在目标链中购买的权重，用于执行在 `Transact` 指令中定义的调用
            - `call` - 在目标链中执行的调用，如 `Transact` 指令中定义
            - `feeAmount` - 用作费用的金额
            - `overallWeight` - extrinsic 可以用来执行所有 XCM 指令的总权重，加上 `Transact` 调用的权重 (`transactRequiredWeightAtMost`)。`overallWeight` 结构还包含 `refTime` 和 `proofSize`。如果您为 `refTime` 传递一个 uint64 的最大值，您将允许购买无限量的权重，从而无需确切知道目标链执行 XCM 需要多少权重

=== "V3"

    V3 接口增加了对 Weights V2 的支持，该版本更新了 `Weight` 类型，以表示除了计算时间之外的 proof size。因此，这要求定义 `refTime` 和 `proofSize`，其中 `refTime` 是可用于执行的计算时间量，`proofSize` 是可以使用的存储量（以字节为单位）。
    
    以下结构已添加到 XCM Transactor Precompile 中以支持 Weights V2：

    ```solidity
    struct Weight {
        uint64 refTime;
        uint65 proofSize;
    }
    ```

    此外，还增加了对 [`RefundSurplus`](builders/interoperability/xcm/core-concepts/instructions/#refund-surplus){target=\_blank} 和 [`DepositAsset`](builders/interoperability/xcm/core-concepts/instructions/#deposit-asset){target=\_blank} 指令的支持。要将 `RefundSurplus` 指令附加到 XCM 消息，您可以使用 `refund` 参数，如果设置为 `true`，该参数将退还未用于 `Transact` 的任何剩余资金。

    V3 接口包括以下函数：

    ??? function "**transactInfoWithSigned**(*Multilocation* *memory* multilocation) — 一个只读函数，返回给定链的事务信息"

        === "Parameters"

            - `multilocation` - 要获取事务信息的链的 multilocation
        
        === "Returns"

            以下事务信息：

              - 与外部调用执行相关的三个 XCM 指令 (`transactExtraWeight`)
              - 与通过签名 extrinsic 进行事务的 `DescendOrigin` XCM 指令相关的额外权重信息 (`transactExtraWeightSigned`)
              - 给定链中消息允许的最大权重

            ```js
            [ 173428000n, 0n, 20000000000n ]
            ```

    ??? function "**feePerSecond**(*Multilocation* *memory* multilocation) — 一个只读函数，返回每秒 XCM 执行的 token 单位数，该值作为给定资产的 XCM 执行费用收取。当对于给定链，有多个资产可用于支付费用时，这非常有用"

        === "Parameters"

            - `multilocation` - 要获取每秒单位值的资产的 multilocation
        
        === "Returns"
            
            储备链对给定资产收取的每秒费用。

            ```js
            13764626000000n
            ```

    ??? function "**transactThroughSignedMultilocation**(*Multilocation* *memory* dest, *Multilocation* *memory* feeLocation, *Weight* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *Weight* overallWeight, *bool* refund) — 发送一条 XCM 消息，其中包含在目标链中远程执行调用的指令。远程调用将由一个新账户签名并执行，该账户称为 [Computed Origin](builders/interoperability/xcm/remote-execution/computed-origins/){target=\_blank} 账户，目标平行链必须计算该账户。基于 Moonbeam 的网络遵循 [Polkadot 设定的 Computed Origins 标准](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-builder/src/location_conversion.rs){target=\_blank}。您需要提供用于支付费用的 token 的资产 multilocation，而不是 XC-20 token 的地址"

        === "Parameters"

            - `dest` - 生态系统中一条链的 multilocation，XCM 消息将发送到该链（目标链）。multilocation 必须以特定方式格式化，这在 [构建预编译 Multilocation](#building-the-precompile-multilocation) 部分中描述
            - `feeLocation` - 用于支付费用的资产的 multilocation。multilocation 必须以特定方式格式化，这在 [以下部分](#building-the-precompile-multilocation) 中描述
            - `transactRequiredWeightAtMost` - 在目标链中购买的权重，用于执行在 `Transact` 指令中定义的调用。`transactRequiredWeightAtMost` 结构包含以下内容：
                - `refTime` - 可用于执行的计算时间量
                - `proofSize` - 可以使用的存储量（以字节为单位）
                它应格式化如下：

                ```js
                [ INSERT_REF_TIME, INSERT_PROOF_SIZE ]
                ```
                  
            - `call` - 在目标链中执行的调用，如 `Transact` 指令中定义
            - `feeAmount` - 用作费用的金额
            - `overallWeight` - extrinsic 可以用来执行所有 XCM 指令的总权重，加上 `Transact` 调用的权重 (`transactRequiredWeightAtMost`)。`overallWeight` 结构还包含 `refTime` 和 `proofSize`。如果您为 `refTime` 传递一个 uint64 的最大值，您将允许购买无限量的权重，从而无需确切知道目标链执行 XCM 需要多少权重
            - `refund` - 一个布尔值，指示是否将 `RefundSurplus` 和 `DepositAsset` 指令添加到 XCM 消息中，以退还任何剩余费用

    ??? function "**transactThroughSigned**(*Multilocation* *memory* dest, *address* feeLocationAddress, *Weight* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *Weight* overallWeight, *bool* refund) — 发送一条 XCM 消息，其中包含在目标链中远程执行调用的指令。远程调用将由一个新账户签名并执行，该账户称为 [Computed Origin](builders/interoperability/xcm/remote-execution/computed-origins/){target=\_blank} 账户，目标平行链必须计算该账户。基于 Moonbeam 的网络遵循 [Polkadot 设定的 Computed Origins 标准](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-builder/src/location_conversion.rs){target=\_blank}。您需要提供 XC-20 资产的地址以用于支付费用"

        === "Parameters"

            - `dest` - 生态系统中一条链的 multilocation，XCM 消息将发送到该链（目标链）。multilocation 必须以特定方式格式化，这在 [构建预编译 Multilocation](#building-the-precompile-multilocation) 部分中描述
            - `feeLocationAddress` - 用于支付费用的资产的 [XC-20 地址](builders/interoperability/xcm/xc20/overview/#current-xc20-assets){target=\_blank}
            - `transactRequiredWeightAtMost` - 在目标链中购买的权重，用于执行在 `Transact` 指令中定义的调用。`transactRequiredWeightAtMost` 结构包含以下内容：
                - `refTime` - 可用于执行的计算时间量
                - `proofSize` - 可以使用的存储量（以字节为单位）
                它应格式化如下：

                ```js
                [ INSERT_REF_TIME, INSERT_PROOF_SIZE ]
                ```
                
            - `call` - 在目标链中执行的调用，如 `Transact` 指令中定义
            - `feeAmount` - 用作费用的金额
            - `overallWeight` - extrinsic 可以用来执行所有 XCM 指令的总权重，加上 `Transact` 调用的权重 (`transactRequiredWeightAtMost`)。`overallWeight` 结构还包含 `refTime` 和 `proofSize`。如果您为 `refTime` 传递一个 uint64 的最大值，您将允许购买无限量的权重，从而无需确切知道目标链执行 XCM 需要多少权重
            - `refund` - 一个布尔值，指示是否将 `RefundSurplus` 和 `DepositAsset` 指令添加到 XCM 消息中，以退还任何剩余费用

## 用于远程执行的 XCM 指令 {: #xcm-instructions-for-remote-execution }

通过 XCM 执行远程执行的相关 [XCM 指令](builders/interoperability/xcm/core-concepts/instructions/){target=\_blank} 包括但不限于：

 - [`DescendOrigin`](builders/interoperability/xcm/core-concepts/instructions/#descend-origin){target=\_blank} - 在目标链中执行。它会改变目标链上的来源，以匹配源链上的来源，确保目标链上的执行代表在源链上发起 XCM 消息的同一实体
 - [`WithdrawAsset`](builders/interoperability/xcm/core-concepts/instructions/#withdraw-asset){target=\_blank} - 在目标链中执行。移除资产并将其放入持有注册表
 - [`BuyExecution`](builders/interoperability/xcm/core-concepts/instructions/#buy-execution){target=\_blank} - 在目标链中执行。从持有注册表中获取资产以支付执行费用。要支付的费用由目标链确定
 - [`Transact`](builders/interoperability/xcm/core-concepts/instructions/#transact){target=\_blank} - 在目标链中执行。从给定的来源分派编码的调用数据，从而可以执行特定的操作或函数

## 构建预编译多重定位 {: #building-the-precompile-multilocation }

在 XCM 交易器预编译接口中，`Multilocation` 结构定义如下：

--8<-- 'zh/text/builders/interoperability/xcm/xcm-precompile-multilocation.md'

以下代码片段介绍了一些 `Multilocation` 结构的示例，因为它们需要馈送到 XCM 交易器预编译函数中：

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/multilocations.js'
```

## 通过计算来源账户进行交易 {: #xcmtransactor-transact-through-signed }

本节介绍了如何构建 XCM 消息，以便使用 XCM Transactor Pallet 进行远程执行，特别是使用 `transactThroughSigned` 函数。此函数使用目标链上的[计算来源](builders/interoperability/xcm/remote-execution/computed-origins/){target=\_blank}账户来分派远程调用。

本节中的示例使用了一个不可公开访问的目标平行链，因此您无法完全按照示例进行操作。您可以根据自己的用例修改示例。

!!! note
    您需要确保您要远程执行的调用在目标链中是允许的！

### 检查先决条件 {: #xcmtransactor-signed-check-prerequisites }

要能够发送本节中的外部交易，您需要具备：

- 原始链中的一个拥有[资金](builders/get-started/networks/moonbase/#get-tokens){target=\_blank}的帐户
- 目标链上的计算原始帐户中的资金。要了解如何计算计算原始帐户的地址，请参阅[如何计算计算原始](builders/interoperability/xcm/remote-execution/computed-origins/){target=\_blank}文档。

在本示例中，将使用以下帐户：

- 原始平行链（Moonbase Alpha）中的 Alice 帐户：`0x44236223aB4291b93EEd10E4B511B37a398DEE55`
- 目标平行链（Parachain 888）中她的计算原始地址：`0x5c27c4bb7047083420eddff9cddac4a0a120b45c`

### 构建 XCM {: #xcm-transact-through-signed }

在此示例中，您将与 XCM 交易器预编译 V3 的 `transactThroughSigned` 函数交互。要使用此函数，您需要执行以下常规步骤：

1. 使用 Moonbase Alpha RPC 终结点创建提供程序
2. 创建签名者以发送交易。此示例使用私钥创建签名者，仅用于演示目的。**切勿将您的私钥存储在 JavaScript 文件中**
3. 使用预编译的地址和 ABI 创建 XCM 交易器 V3 预编译的合约实例

    ??? code "XCM 交易器 V3 ABI"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/XcmTransactorV3ABI.js'
        ```

4. 组装 `transactThroughSigned` 函数的参数：

    - `dest` - 目标的多重定位，即平行链 888：

        ```js
        const dest = [
          1, // parents = 1
          [  // interior = X1 (the array has a length of 1)
            '0x0000000378', // Parachain selector + Parachain ID 888
          ],
        ];
        ```

    - `feeLocationAddress` - 用于支付费用的 XC-20 地址，即平行链 888 的原生资产：

        ```js
        const feeLocationAddress = '0xFFFFFFFF1AB2B146C526D4154905FF12E6E57675';
        ```

    - `transactRequiredWeightAtMost` - 在 `Transact` 指令中执行调用所需的权重。您可以使用 Polkadot.js API 的 [`paymentInfo` 方法](builders/substrate/libraries/polkadot-js-api/#fees){target=\_blank} 获取此信息

        ```js
        const transactRequiredWeightAtMost = [1000000000n, 5000n];
        ```

    - `call` - 要调用的 pallet、方法和输入的编码调用数据。它可以在 [Polkadot.js Apps](https://polkadot.js.org/apps){target=\_blank}（必须连接到目标链）中构建，也可以使用 [Polkadot.js API](builders/substrate/libraries/polkadot-js-api/){target=\_blank}。在此示例中，内部调用是将目标链的 1 个代币简单地转移到 Alice 在该链上的帐户：

        ```js
        const call =
          '0x030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d';
        ```

    - `feeAmount` - 用于支付费用的金额

        ```js
        const feeAmount = 50000000000000000n;
        ```

    - `overallWeight` - 内部调用 (`transactRequiredWeightAtMost`) 特有的权重，加上覆盖目标链中 XCM 指令执行成本所需的权重：`DescendOrigin`、`WithdrawAsset`、`BuyExecution` 和 `Transact`。请务必注意，每个链都定义了自己的权重要求。要确定给定链上每个 XCM 指令所需的权重，请参阅该链的文档或联系其团队成员。或者，您可以为 `refTime`（数组的第一个索引）传递 uint64 的最大值。这将解释为使用无限量的权重，从而无需确切知道目标链执行 XCM 需要多少权重

        ```js
        const overallWeight = [18446744073709551615n, 10000n];
        ```

5. 创建 `transactThroughSigned` 函数，传入参数
6. 签名并发送交易

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/transact-through-signed/ethers.js'
    ```

=== "Web3.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/transact-through-signed/web3.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/transact-through-signed/web3.py'
    ```

### 通过计算 Origin 费用进行 XCM 交易 {: #transact-through-computed-origin-fees }

当[通过计算 Origin 账户进行交易](#xcmtransactor-transact-through-signed){target=\_blank}时，交易费用由发起调用的同一账户支付，即目标链中的计算 Origin 账户。因此，计算 Origin 账户必须持有必要的资金来支付整个执行过程。请注意，用于支付费用的目标 Token 不需要在起始链中注册为 XC-20。

要估计 Alice 的计算 Origin 账户需要持有的 Token 数量才能执行远程调用，您需要检查特定于目标链的交易信息。您可以使用以下脚本来获取平行链 888 的交易信息：

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/transact-info-with-signed.js'
```

响应显示 `transactExtraWeightSigned` 为 `{{ networks.moonbase_beta.xcm_message.transact.weight.display }}`。执行该特定目标链中此远程调用的四个 XCM 指令需要此权重。接下来，您需要找出目标链根据资产价格，对每个 XCM 执行权重的收费。以前，这是通过获取每秒单位值来完成的。但是，此方法已被计算相对价格所取代。相对价格是指从价值（即价格）角度来看，多少单位的外国资产对应于一个单位的本机 Token（GLMR 或 MOVR）。例如，如果外国资产价值 5 美元，而 GLMR 价值 0.25 美元，则相对价格为 0.05。但是，我们必须将结果缩放到 18 位小数，以对应于使用的 Wei 单位。在这种情况下，相对价格将为 `50000000000000000`。

您可以使用 [XCM Tools repo](https://github.com/Moonsong-Labs/xcm-tools?tab=readme-ov-file#calculate-relative-price){target=\_blank} 中的脚本计算相对价格。该脚本也如下所示：

??? code "计算相对价格"
    ```typescript
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/calculate-relative-price.ts'
    ```

请注意，相对价格值与 [中继链 XCM 费用计算](builders/interoperability/xcm/core-concepts/weights-fees/#polkadot){target=\_blank} 部分中估计的成本或 [每权重单位](builders/interoperability/xcm/core-concepts/weights-fees/#moonbeam-reserve-assets){target=\_blank} 部分中显示的成本相关（如果目标是另一个平行链）。您需要找到正确的值，以确保计算 Origin 账户持有的 Token 数量正确。计算相关的 XCM 执行费用就像将 `transactExtraWeightSigned` 乘以 `relativePrice` 一样简单（用于估算）：

```
XCM-Wei-Token-Cost = transactExtraWeightSigned * relativePrice
XCM-Token-Cost = XCM-Wei-Token-Cost / DecimalConversion
```

因此，通过派生调用进行一次 XCM Transactor 交易的实际计算如下：

```
XCM-Wei-Token-Cost = {{ networks.moonbase_beta.xcm_message.transact.weight.numbers_only }} * {{ networks.moonbase.xcm.units_per_second.xcbetadev.transact_numbers_only }}
XCM-Token-Cost = {{ networks.moonbase_beta.xcm_message.transact.wei_betadev_cost }} / 10^18
```

通过计算 Origin 进行交易的成本为 `{{ networks.moonbase_beta.xcm_message.transact.betadev_cost }} TOKEN`。**请注意，这不包括远程执行调用的成本，仅包括 XCM 执行费用。**
