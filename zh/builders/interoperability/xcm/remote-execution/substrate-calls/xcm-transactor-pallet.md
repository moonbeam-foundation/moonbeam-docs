---
title: XCM交易器 pallet
description: 本指南介绍了 XCM 交易器 pallet，并解释了如何使用 pallet 的一些外部函数向另一个链发送远程调用。
categories: XCM 远程执行
---

# 使用 XCM Transactor Pallet 进行远程执行

## 简介 {: #introduction }

XCM 消息由一系列由跨共识虚拟机（XCVM）执行的[指令](builders/interoperability/xcm/core-concepts/instructions/){target=\_blank}组成。这些指令的组合会产生预定的操作，例如跨链代币转移，更有趣的是远程跨链执行。远程执行涉及从一个区块链执行对另一个区块链的操作或动作，同时保持发送者身份和权限的完整性。

通常，XCM 消息从根源（即 SUDO 或通过治理）发送，这对于希望通过简单交易利用远程跨链调用的项目来说并不理想。[XCM Transactor Pallet](https://github.com/moonbeam-foundation/moonbeam/blob/master/pallets/xcm-transactor/src/lib.rs){target=\_blank}使得通过[主权账户](builders/interoperability/xcm/overview/#general-xcm-definitions){target=\_blank}（应该只允许通过治理）或通过来自源链的简单交易的[计算来源账户](builders/interoperability/xcm/remote-execution/computed-origins/){target=\_blank}，在远程链上进行交易变得容易。

本指南将向您展示如何使用 XCM Transactor Pallet 从基于 Moonbeam 的网络向生态系统中的其他链发送 XCM 消息。此外，您还将学习如何使用 XCM Transactor Precompile 通过 Ethereum API 执行相同的操作。

**请注意，通过 XCM 消息远程执行的操作仍然存在限制**。

**开发人员必须了解，发送不正确的 XCM 消息可能会导致资金损失。** 因此，必须先在测试网上测试 XCM 功能，然后再转移到生产环境。

## XCM 交易器 Pallet 接口 {: #xcm-transactor-pallet-interface}

### Extrinsics {: #extrinsics }

XCM Transactor Pallet 提供了以下 extrinsics（函数）：

???+ function "**hrmpManage**(action, fee, weightInfo) - 管理与打开、接受和关闭 HRMP 通道相关的 HRMP 操作"

    在 Moonbeam 或 Moonriver 上，此函数必须通过 General Admin 或 Root Track 的治理来执行。在 Moonbase Alpha 或 Moonbeam 开发节点上，此函数也可以通过 sudo 执行。

    === "参数"

        - `action` - 要执行的操作。可以是 `InitOpen`、`Accept`、`Close` 或 `Cancel`
        - `fee` - 用于支付费用的资产。它包含 `currency` 和 `feeAmount`：
            - `currency` - 定义您如何指定用于支付费用的代币，可以是以下任一项：
                - `AsCurrencyId` - 用于支付费用的资产的货币 ID。货币 ID 可以是：
                    - `SelfReserve` - 使用原生资产
                    - `ForeignAsset` - 使用 [外部 XC-20](builders/interoperability/xcm/xc20/overview/#external-xc20s){target=\_blank}。它要求您指定 XC-20 的资产 ID
                     - `LocalAssetReserve` - *已弃用* - 请改用通过 `Erc20` 货币类型的 [本地 XC-20](builders/interoperability/xcm/xc20/overview/#local-xc20s){target=\_blank}
                    - `Erc20` - 使用 [本地 XC-20](builders/interoperability/xcm/xc20/overview/#local-xc20s){target=\_blank}。它要求您指定本地 XC-20 的合约地址
                - `AsMultiLocation` - 用于支付费用的资产的 XCM 版本化多重位置
            - `feeAmount` - （可选）用于支付费用的金额
        - `weightInfo` - 要使用的权重信息。`weightInfo` 结构包含以下内容：
            - `transactRequiredWeightAtMost` - 执行 `Transact` 调用所需的权重。`transactRequiredWeightAtMost` 结构包含以下内容：
                - `refTime` - 可用于执行的计算时间量
                - `proofSize` - 可使用的存储量（以字节为单位）
            - `overallWeight` - （可选）extrinsic 可用于执行所有 XCM 指令的总权重，加上 `Transact` 调用的权重 (`transactRequiredWeightAtMost`)。`overallWeight` 可以定义为以下任一项：
                - `Unlimited` - 允许可以购买的无限数量的权重
                - `Limited` - 通过定义以下内容来限制可以购买的权重数量：
                    - `refTime` - 可用于执行的计算时间量
                    - `proofSize` - 可使用的存储量（以字节为单位）
    
    === "Polkadot.js API 示例"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/hrmp-manage.js'
        ```

??? function "**removeFeePerSecond**(assetLocation) — 删除给定资产在其储备链中的每秒费用信息"

    在 Moonbeam 或 Moonriver 上，此函数必须通过 General Admin 或 Root Track 的治理来执行。在 Moonbase Alpha 或 Moonbeam 开发节点上，此函数也可以通过 sudo 执行。

    === "参数"

        - `assetLocation` - 要删除每秒费用信息的资产的 XCM 版本化多重位置

    === "Polkadot.js API 示例"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/remove-fee-per-second.js'
        ```

??? function "**removeTransactInfo**(location) — 删除给定链的 transact 信息"

    在 Moonbeam 或 Moonriver 上，此函数必须通过 General Admin 或 Root Track 的治理来执行。在 Moonbase Alpha 或 Moonbeam 开发节点上，此函数也可以通过 sudo 执行。

    === "参数"

        - `location` - 您要删除 transact 信息的给定链的 XCM 版本化多重位置

    === "Polkadot.js API 示例"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/remove-transact-info.js'
        ```

??? function "**setFeePerSecond**(assetLocation, feePerSecond) — 设置给定资产在其储备链上的每秒费用。每秒费用信息通常与执行 XCM 指令的成本有关"

    在 Moonbeam 或 Moonriver 上，此函数必须通过 General Admin 或 Root Track 的治理来执行。在 Moonbase Alpha 或 Moonbeam 开发节点上，此函数也可以通过 sudo 执行。

    === "参数"

        - `assetLocation` - 要删除每秒费用信息的资产的 XCM 版本化多重位置
        - `feePerSecond` - 在执行 XCM 指令时，将向 extrinsic 发送者收取的每秒 XCM 执行的代币单位数

    === "Polkadot.js API 示例"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/set-fee-per-second.js'
        ```

??? function "**setTransactInfo**(location, transactExtraWeight, maxWeight) — 设置给定链的 transact 信息。transact 信息通常包括有关执行 XCM 指令所需的权重以及目标链上允许的远程 XCM 执行的最大权重的详细信息"

    在 Moonbeam 或 Moonriver 上，此函数必须通过 General Admin 或 Root Track 的治理来执行。在 Moonbase Alpha 或 Moonbeam 开发节点上，此函数也可以通过 sudo 执行。

    === "参数"

        - `location` - 您要设置 transact 信息的给定链的 XCM 版本化多重位置
        - `transactExtraWeight` - 用于支付 XCM 指令（`WithdrawAsset`、`BuyExecution` 和 `Transact`）的执行费用的权重，估计至少比远程 XCM 指令执行使用的权重高 10%。`transactExtraWeight` 结构包含以下内容：
            - `refTime` - 可用于执行的计算时间量
            - `proofSize` - 可使用的存储量（以字节为单位）
        - `maxWeight` - 远程 XCM 执行允许的最大权重单位。`maxWeight` 结构还包含 `refTime` 和 `proofSize`
        - `transactExtraWeightSigned` - （可选）用于支付 XCM 指令（`DescendOrigin`、`WithdrawAsset`、`BuyExecution` 和 `Transact`）的执行费用的权重，估计至少比远程 XCM 指令执行使用的权重高 10%。`transactExtraWeightSigned` 结构还包含 `refTime` 和 `proofSize`

    === "Polkadot.js API 示例"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/set-transact-info.js'
        ```

??? function "**transactThroughSigned**(destination, fee, call, weightInfo, refund) — 发送一条 XCM 消息，其中包含在目标链中远程执行调用的指令。远程调用将由目标平行链必须计算的新帐户签名并执行。基于 Moonbeam 的网络遵循 [Polkadot 设置的 Computed Origins 标准](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-builder/src/location_conversion.rs){target=\_blank}"

    === "参数"

        - `dest` - XCM 版本化多重位置，用于生态系统中要将 XCM 消息发送到的链（目标链）
        - `fee` - 用于支付费用的资产。它包含 `currency` 和 `feeAmount`：
            - `currency` - 定义您如何指定用于支付费用的代币，可以是以下任一项：
                - `AsCurrencyId` - 用于支付费用的资产的货币 ID。货币 ID 可以是：
                    - `SelfReserve` - 使用原生资产
                    - `ForeignAsset` - 使用 [外部 XC-20](builders/interoperability/xcm/xc20/overview/#external-xc20s){target=\_blank}。它要求您指定 XC-20 的资产 ID
                     - `LocalAssetReserve` - *已弃用* - 请改用通过 `Erc20` 货币类型的 [本地 XC-20](builders/interoperability/xcm/xc20/overview/#local-xc20s){target=\_blank}
                    - `Erc20` - 使用 [本地 XC-20](builders/interoperability/xcm/xc20/overview/#local-xc20s){target=\_blank}。它要求您指定本地 XC-20 的合约地址
                - `AsMultiLocation` - 用于支付费用的资产的 XCM 版本化多重位置
            - `feeAmount` - （可选）用于支付费用的金额
        - `call` - 将在目标链中执行的调用的编码调用数据
        - `weightInfo` - 要使用的权重信息。`weightInfo` 结构包含以下内容：
            - `transactRequiredWeightAtMost` - 执行 `Transact` 调用所需的权重。`transactRequiredWeightAtMost` 结构包含以下内容：
                - `refTime` - 可用于执行的计算时间量
                - `proofSize` - 可使用的存储量（以字节为单位）
            - `overallWeight` - （可选）extrinsic 可用于执行所有 XCM 指令的总权重，加上 `Transact` 调用的权重 (`transactRequiredWeightAtMost`)。`overallWeight` 可以定义为以下任一项：
                - `Unlimited` - 允许可以购买的无限数量的权重
                - `Limited` - 通过定义以下内容来限制可以购买的权重数量：
                    - `refTime` - 可用于执行的计算时间量
                    - `proofSize` - 可使用的存储量（以字节为单位）
        - `refund` - 指示是否将 `RefundSurplus` 和 `DepositAsset` 指令添加到 XCM 消息以退还任何剩余费用的布尔值

    === "Polkadot.js API 示例"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/transact-through-signed.js'
        ```

    !!! note
        在以下部分中，您将准确了解如何检索使用此 extrinsic 构建和发送 XCM 消息所需的所有参数。

??? function "**transactThroughSovereign**(dest, feePayer, fee, call, originKind, weightInfo, refund) — 发送一条 XCM 消息，其中包含在给定目标远程执行给定调用的指令。远程调用将由源平行链 Sovereign 帐户（支付费用）签名，但事务是从给定的 origin 调度的。XCM Transactor Pallet 计算远程执行的费用，并以相应的 [XC-20 代币](builders/interoperability/xcm/xc20/overview/){target=\_blank} 向给定帐户收取估计金额"

    === "参数"

        - `dest` - XCM 版本化多重位置，用于生态系统中要将 XCM 消息发送到的链（目标链）
        - `feePayer` - （可选）将以相应的 [XC-20 代币](builders/interoperability/xcm/xc20/overview/){target=\_blank} 支付远程 XCM 执行费用的地址。如果未指定 `feePayer`，则 XCM 执行费用将由目标链上的 Sovereign 帐户支付
        - `fee` - 用于支付费用的资产。它包含 `currency` 和 `feeAmount`：
            - `currency` - 定义您如何指定用于支付费用的代币，可以是以下任一项：
                - `AsCurrencyId` - 用于支付费用的资产的货币 ID。货币 ID 可以是：
                    - `SelfReserve` - 使用原生资产
                    - `ForeignAsset` - 使用 [外部 XC-20](builders/interoperability/xcm/xc20/overview/#external-xc20s){target=\_blank}。它要求您指定 XC-20 的资产 ID
                     - `LocalAssetReserve` - *已弃用* - 请改用通过 `Erc20` 货币类型的 [本地 XC-20](builders/interoperability/xcm/xc20/overview/#local-xc20s){target=\_blank}
                    - `Erc20` - 使用 [本地 XC-20](builders/interoperability/xcm/xc20/overview/#local-xc20s){target=\_blank}。它要求您指定本地 XC-20 的合约地址
                - `AsMultiLocation` - 用于支付费用的资产的 XCM 版本化多重位置
            - `feeAmount` - （可选）用于支付费用的金额
        - `call` - 将在目标链中执行的调用的编码调用数据
        - `originKind` - 目标链中远程调用的调度程序。[有四种类型的调度程序](https://github.com/paritytech/polkadot-sdk/blob/polkadot-stable2412/polkadot/xcm/src/v3/mod.rs#L421-L440){target=\_blank} 可用：`Native`、`SovereignAccount`、`Superuser` 或 `Xcm`
        - `weightInfo` - 要使用的权重信息。`weightInfo` 结构包含以下内容：
            - `transactRequiredWeightAtMost` - 执行 `Transact` 调用所需的权重。`transactRequiredWeightAtMost` 结构包含以下内容：
                - `refTime` - 可用于执行的计算时间量
                - `proofSize` - 可使用的存储量（以字节为单位）
            - `overallWeight` - （可选）extrinsic 可用于执行所有 XCM 指令的总权重，加上 `Transact` 调用的权重 (`transactRequiredWeightAtMost`)。`overallWeight` 可以定义为以下任一项：
                - `Unlimited` - 允许可以购买的无限数量的权重
                - `Limited` - 通过定义以下内容来限制可以购买的权重数量：
                    - `refTime` - 可用于执行的计算时间量
                    - `proofSize` - 可使用的存储量（以字节为单位）
        - `refund` - 指示是否将 `RefundSurplus` 和 `DepositAsset` 指令添加到 XCM 消息以退还任何剩余费用的布尔值

    === "Polkadot.js API 示例"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/transact-through-sovereign.js'
        ```

### 存储方法 {: #storage-methods }

XCM Transactor Pallet 包含以下只读存储方法：

???+ function "**destinationAssetFeePerSecond**(location) - 返回给定资产的每秒费用"

    === "参数"

        - `location` - (可选) 特定目标资产的 XCM 版本多位置
    
    === "返回值"

        表示给定资产每秒费用的值的数字。此值的返回格式可能因链及其存储数据的方式而异。您可以使用 `@polkadot/util` 库进行各种转换，例如，使用 `hexToBigInt` 方法将十六进制值转换为大整数。

        ```js
        // If using Polkadot.js API and calling toJSON() on the unwrapped value
        10000000000000
        ```
        
    
    === "Polkadot.js API 示例"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/destination-asset-fee-per-second.js'
        ```

??? function "**palletVersion**() — 从存储返回当前的 pallet 版本"

    === "参数"

        无

    === "返回值"

        表示 pallet 当前版本的数字。

        ```js
        // If using Polkadot.js API and calling toJSON() on the unwrapped value
        0
        ```

    === "Polkadot.js API 示例"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/pallet-version.js'
        ```

??? function "**transactInfoWithWeightLimit**(location) — 返回给定多位置的事务信息"

    === "参数"

        - `location` - (可选) 特定目标资产的 XCM 版本多位置

    === "返回值"

        事务信息对象。

        ```js
        // If using Polkadot.js API and calling toJSON() on the unwrapped value
        {
          transactExtraWeight: { refTime: 3000000000, proofSize: 131072 },
          maxWeight: { refTime: 20000000000, proofSize: 131072 },
          transactExtraWeightSigned: { refTime: 4000000000, proofSize: 131072 },
        }
        ```
    
    === "Polkadot.js API 示例"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/transact-info-with-weight-limit.js'
        ```

### Pallet 常量 {: #constants }

XCM 交易器 Pallet 包含以下只读函数来获取 pallet 常量：

???+ function "**baseXcmWeight**() - 返回每个 XCM 指令执行所需的基本 XCM 权重"

    === "返回值"

        基本 XCM 权重对象。

        ```js
        // If using Polkadot.js API and calling toJSON() on the unwrapped value
        { refTime: 200000000, proofSize: 0 }
        ```

    === "Polkadot.js API 示例"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/base-xcm-weight.js'
        ```

??? function "**selfLocation**() - 返回链的 multilocation"

    === "返回值"

        自定位 multilocation 对象。

        ```js
        // If using Polkadot.js API and calling toJSON() on the unwrapped value
        { parents: 0, interior: { here: null } }
        ```

    === "Polkadot.js API 示例"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/interface-examples/self-location.js'
        ```

## 用于远程执行的 XCM 指令 {: #xcm-instructions-for-remote-execution }

通过 XCM 执行远程执行的相关 [XCM 指令](builders/interoperability/xcm/core-concepts/instructions/){target=\_blank} 包括但不限于：

 - [`DescendOrigin`](builders/interoperability/xcm/core-concepts/instructions/#descend-origin){target=\_blank} - 在目标链中执行。它会改变目标链上的发起方，以匹配源链上的发起方，确保目标链上的执行代表在源链上发起 XCM 消息的同一实体发生
 - [`WithdrawAsset`](builders/interoperability/xcm/core-concepts/instructions/#withdraw-asset){target=\_blank} - 在目标链中执行。移除资产，并将它们放入持有登记处
 - [`BuyExecution`](builders/interoperability/xcm/core-concepts/instructions/#buy-execution){target=\_blank} - 在目标链中执行。从持有处获取资产以支付执行费用。要支付的费用由目标链确定
 - [`Transact`](builders/interoperability/xcm/core-concepts/instructions/#transact){target=\_blank} - 在目标链中执行。从给定的发起方分派编码的调用数据，允许执行特定的操作或函数

## 通过计算的原始帐户进行交易 {: #xcmtransactor-transact-through-signed }

本节介绍如何使用 XCM Transactor Pallet 构建用于远程执行的 XCM 消息，特别是使用 `transactThroughSigned` 函数。此函数使用目标链上的计算原始帐户来分发远程调用。

本节中的示例使用了不可公开访问的目标平行链，因此您无法完全按照示例进行操作。您可以根据自己的用例修改示例。

!!! note
    您需要确保要在远程执行的调用在目标链中是允许的！

### 检查先决条件 {: #xcmtransactor-signed-check-prerequisites }

要能够发送本节中的外部调用，您需要具备以下条件：

- 原始链中的一个帐户，其中包含[资金](builders/get-started/networks/moonbase/#get-tokens){target=\_blank}
- 目标链上计算出的原始帐户中的资金。要了解如何计算计算出的原始帐户的地址，请参阅[如何计算计算出的原始帐户](builders/interoperability/xcm/remote-execution/computed-origins/){target=\_blank}文档

在此示例中，将使用以下帐户：

- Alice在原始平行链（Moonbase Alpha）中的帐户：`0x44236223aB4291b93EEd10E4B511B37a398DEE55`
- 她在目标平行链（平行链888）中计算出的原始地址：`0x5c27c4bb7047083420eddff9cddac4a0a120b45c`

### 构建 XCM {: #xcm-transact-through-signed }

由于您将与 XCM Transactor Pallet 的 `transactThroughSigned` 函数交互，因此您需要组装 `dest`、`fee`、`call`、`weightInfo` 和 `refund` 参数的值。为此，您可以采取以下步骤：

1. 定义目标多重位置，它将目标定为平行链 888

    ```js
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/transact-signed.js:6:11'
    ```
  
2. 定义 `fee` 信息，这将要求您定义货币并设置费用金额

    === "External XC-20s"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/transact-signed.js:13:18'
        ```

    === "Local XC-20s"

        ```js
        const fee = {
          currency: {
            AsCurrencyId: { Erc20: { contractAddress: ERC_20_ADDRESS} },
          },
          feeAmount: 50000000000000000n,
        };
        ```

3. 定义将在目标链中执行的 `call`，它是要调用的 pallet、方法和输入的编码调用数据。 它可以在 [Polkadot.js Apps](https://polkadot.js.org/apps){target=\_blank}（必须连接到目标链）或使用 [Polkadot.js API](builders/substrate/libraries/polkadot-js-api/){target=\_blank} 构建。 对于此示例，内部调用是将目标链的 1 个代币简单余额转移到 Alice 在那里的帐户

    ```js
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/transact-signed.js:19:19'
    ```

4. 设置 `weightInfo`，其中包括特定于内部调用的权重 (`transactRequiredWeightAtMost`) 以及事务加上 XCM 执行的可选整体权重 (`overallWeight`)。 对于每个参数，您可以遵循以下准则：
    - 对于 `transactRequiredAtMost`，您可以将 `refTime` 设置为 `1000000000` 权重单位，将 `proofSize` 设置为 `40000`
    - 对于 `overallWeight`，该值必须是 `transactRequiredWeightAtMost` 加上涵盖目标链中 XCM 指令的执行成本所需的权重的总和。 如果您不提供此值，则 pallet 将使用存储中的元素（如果存在）并将其添加到 `transactRequiredWeightAtMost`。 对于此示例，您可以将 `overallWeight` 设置为 `Unlimited`，这无需知道目标链需要多少权重才能执行 XCM

    ```js
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/transact-signed.js:20:23'
    ```

    !!! note
        为了准确估计 `transactRequiredAtMost` 的 `refTime` 和 `proofSize` 数字，您可以使用 [Polkadot.js API 的 `paymentInfo` 方法](builders/substrate/libraries/polkadot-js-api/#fees){target=\_blank}。

5. 要退还任何剩余的 XCM 费用，您可以将 `refund` 值设置为 `true`。 否则，将其设置为 `false`

    ```js
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/transact-signed.js:24:24'
    ```

### 发送 XCM {: #sending-the-xcm }

既然您已经获得了每个参数的值，那么您可以编写交易脚本。您需要执行以下步骤：

 1. 提供调用的输入数据。包括：
     - 用于创建提供程序的 Moonbase Alpha 端点 URL
     - `transactThroughSigned` 函数的每个参数的值
 2. 创建将用于发送交易的 Keyring 实例
 3. 创建 [Polkadot.js API](builders/substrate/libraries/polkadot-js-api/){target=\_blank} 提供程序
 4. 使用 `dest`、`fee`、`call`、`weightInfo` 和 `refund` 值制作 `xcmTransactor.transactThroughSigned` extrinsic
 5. 使用 `signAndSend` extrinsic 和您在第二步中创建的 Keyring 实例发送交易

!!! remember
    这仅用于演示目的。切勿将您的私钥存储在 JavaScript 文件中。

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/transact-signed.js'
```

!!! note
    您可以在 [Polkadot.js 应用](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x210604010100e10d00017576e5e612ff054915d426c546b1b21a010000c52ebca2b10000000000000000007c030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d02286bee02710200010001){target=\_blank} 上查看上述脚本的示例，该脚本将一个 token 发送到平行链 888 上的 Alice 的 Computed Origin 账户，使用以下编码的 calldata：`0x210604010100e10d00017576e5e612ff054915d426c546b1b21a010000c52ebca2b10000000000000000007c030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d02286bee02710200010001`。

### 通过计算来源费用进行 XCM 交易 {: #transact-through-computed-origin-fees }

当[通过“计算来源”帐户进行交易](#xcmtransactor-transact-through-signed){target=\_blank}时，交易费用由发起调用的同一帐户支付，该帐户是目标链中的“计算来源”帐户。因此，“计算来源”帐户必须持有必要的资金才能支付整个执行过程的费用。请注意，用于支付费用的目标 Token 不需要在来源链中注册为 XC-20。

要估算 Alice 的“计算来源”帐户执行远程调用所需的 Token 数量，您需要检查特定于目标链的交易信息。您可以使用以下脚本来获取平行链 888 的交易信息：

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/transact-info-with-weight-limit.js'
```

响应显示 `transactExtraWeightSigned` 是 `{{ networks.moonbase_beta.xcm_message.transact.weight.display }}`。执行该特定目标链中此远程调用的四个 XCM 指令需要此权重。接下来，您需要了解目标链根据资产价格对 XCM 执行的每个权重收取多少费用。以前，这是通过获取每秒单位值来完成的。但是，此方法已被计算相对价格所取代。相对价格是指从价值（即价格）角度来看，外币资产的多少单位对应于本地 Token（GLMR 或 MOVR）的一个单位。例如，如果外币资产价值 5 美元，而 GLMR 价值 0.25 美元，则相对价格为 0.05。但是，我们必须将结果缩放到 18 位小数，以对应于使用的 Wei 单位。在这种情况下，相对价格将为 `50000000000000000`。

您可以使用 [XCM Tools 存储库](https://github.com/Moonsong-Labs/xcm-tools?tab=readme-ov-file#calculate-relative-price){target=\_blank} 中的脚本来计算相对价格。该脚本也复制如下：

??? code "计算相对价格"
    ```typescript
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/calculate-relative-price.ts'
    ```

请注意，相对价格值与 [中继链 XCM 费用计算](builders/interoperability/xcm/core-concepts/weights-fees/#polkadot){target=\_blank} 部分中估计的成本相关，或者如果目标是另一条平行链，则与 [每权重单位](builders/interoperability/xcm/core-concepts/weights-fees/#moonbeam-reserve-assets){target=\_blank} 部分中显示的成本相关。您需要找到正确的值，以确保“计算来源”帐户持有的 Token 数量是正确的。计算相关的 XCM 执行费用就像将 `transactExtraWeightSigned` 乘以 `relativePrice`（用于估算）一样简单：

```
XCM-Wei-Token-Cost = transactExtraWeightSigned * relativePrice
XCM-Token-Cost = XCM-Wei-Token-Cost / DecimalConversion
```

因此，通过派生调用进行一次 XCM Transactor 交易的实际计算如下：

```
XCM-Wei-Token-Cost = {{ networks.moonbase_beta.xcm_message.transact.weight.numbers_only }} * {{ networks.moonbase.xcm.units_per_second.xcbetadev.transact_numbers_only }}
XCM-Token-Cost = {{ networks.moonbase_beta.xcm_message.transact.wei_betadev_cost }} / 10^18
```

通过“计算来源”进行交易的成本是 `{{ networks.moonbase_beta.xcm_message.transact.betadev_cost }} TOKEN`。**请注意，这不包括远程执行调用的成本，仅包括 XCM 执行费用。**
