---
title: 将 XC-20 发送到其他链
description: 本指南介绍了 Polkadot XCM Pallet，并解释了如何使用该 pallet 的一些 extrinsic 将 XC-20 发送到另一个链。
categories: XC-20
---

# 使用 Polkadot XCM Pallet 发送 XC-20s

## 简介 {: #introduction }

!!! note

    Polkadot XCM Pallet 取代了已弃用的 XTokens Pallet。因此，请确保您使用 Polkadot XCM Pallet 与 XC-20 交互。

手动创建用于同质化资产转移的 XCM 消息是一项具有挑战性的任务。因此，开发人员可以利用包装器函数和 pallet 在 Polkadot 和 Kusama 上使用 XCM 功能。其中一个包装器的例子是 [XCM](https://docs.polkadot.com/develop/interoperability/send-messages/){target=_blank} Pallet，它提供了通过 XCM 转移同质化资产的不同方法。

本指南将向您展示如何利用 Polkadot XCM Pallet 将 [XC-20](/builders/interoperability/xcm/xc20/overview/){target=_blank} 从基于 Moonbeam 的网络发送到生态系统中的其他链（中继链/平行链）。

**开发人员必须了解，发送不正确的 XCM 消息可能会导致资金损失。** 因此，在转移到生产环境之前，在测试网上测试 XCM 功能至关重要。

## 命名规范 {: #nomenclature }

因为有各种与 XCM 相关的 pallet 和预编译合约，它们的名称听起来很相似，所以以下部分将阐明它们之间的区别。

- `PolkadotXCM` - 此 pallet（也是此页面的重点）使您能够在 Moonbeam 上与 XC-20 交互，替换已弃用的 `XTokens` pallet
- `pallet-xcm` - 通用的 Polkadot XCM pallet 允许您与跨链资产进行交互。Moonbeam 的 `PolkadotXCM` pallet 本质上是 `pallet-xcm` 的包装器。因此，您可能会看到 `PolkadotXCM` 和 `pallet-xcm` 被互换使用
- `XTokens` - 此 pallet 现在已弃用，并由 `PolkadotXCM` 替代
- `XCMInterface.sol` - 此预编译合约是 solidity 接口，可替换 `XTokens.sol`，并使您可以通过 solidity 接口从 EVM 与 `PolkadotXCM` 的方法进行交互

## Polkadot XCM Pallet 接口 {: #polkadotxcm-pallet-interface }

### Extrinsics {: #extrinsics }

Polkadot XCM Pallet 提供了以下 extrinsics（函数）：

??? function "**forceDefaultXcmVersion**(maybeXcmVersion) — 设置消息编码的安全默认 XCM 版本（仅限管理员）"
    === "参数"
           - `maybeXcmVersion` - 当目标支持的版本未知时，要使用的默认 XCM 编码版本。可以是：
               - 一个版本号
               - `None` 以禁用默认版本设置

??? function "**transferAssets**(dest, beneficiary, assets, feeAssetItem, weightLimit) — 使用预留或传送方法将资产从本地链转移到目标链"
    === "参数"
           - `dest` - 资产的目标上下文。通常指定为：
               - `X2(Parent, Parachain(..))` 用于平行链到平行链的转移
               - `X1(Parachain(..))` 用于中继链到平行链的转移
           - `beneficiary` - 目标上下文中收款人的位置。通常是 `AccountId32` 值
           - `assets` - 要转移的资产。必须：
               - 具有相同的预留位置或可传送到目的地（不包括手续费资产）
               - 包括用于支付手续费的资产
           - `feeAssetItem` - `assets` 数组中指示应使用哪种资产来支付手续费的索引
           - `weightLimit` - 目标链上 XCM 手续费购买的权重限制。可以定义为：
               - `Unlimited` - 允许无限量的权重
               - `Limited` - 指定最大权重值

        转移行为根据资产类型而异：

           - **本地预留**：
               - 将资产转移到目标链的主权账户
               - 发送 XCM 以铸造并存入基于预留的资产到收款人
           
           - **目标预留**：
               - 销毁本地资产
               - 通知目标链从该链的主权账户中提取预留
               - 存入收款人
           
           - **远程预留**：
               - 销毁本地资产
               - 发送 XCM 以在主权账户之间移动预留
               - 通知目标链铸造并存入收款人
           
           - **传送**：
               - 销毁本地资产
               - 发送 XCM 以铸造/传送资产并存入收款人

           提醒一下，发起人必须能够提取指定的资产并执行 XCM。如果需要的权重超过 `weightLimit` 中指定的权重，操作将失败，并且传送的资产可能面临风险

??? function "**transferAssetsUsingTypeAndThen**(dest, assets, assetsTransferType, remoteFeesId, feesTransferType, customXcmOnDest, weightLimit) — 使用显式转移类型和自定义目标行为转移资产"
    === "参数"
           - `dest` - 资产的目标上下文。可以指定为：
               - `[Parent, Parachain(..)]` 用于平行链到平行链的转移
               - `[Parachain(..)]` 用于中继链到平行链的转移
               - `(parents: 2, (GlobalConsensus(..), ..))` 用于跨桥生态系统转移
           - `assets` - 要转移的资产。必须：
               - 具有相同的预留位置
               - 可传送到目的地
           - `assetsTransferType` - 指定应如何转移主要资产：
               - `LocalReserve` - 转移到主权账户，在目标链上铸造
               - `DestinationReserve` - 在本地销毁，从目标链的主权账户中提取
               - `RemoteReserve(reserve)` - 在本地销毁，通过指定的链（通常是 Asset Hub）移动预留
               - `Teleport` - 在本地销毁，在目标链上铸造/传送
           - `remoteFeesId` - 指定应使用包含的哪些资产来支付手续费
           - `feesTransferType` - 指定应如何转移手续费支付资产（与 `assetsTransferType` 相同的选项）
           - `customXcmOnDest` - 在目标链上作为最后一步执行的 XCM 指令。通常用于：
               - 将资产存入收款人：`Xcm(vec![DepositAsset { assets: Wild(AllCounted(assets.len())), beneficiary }])`
               - 或使用转移的资产执行更复杂的操作
           - `weightLimit` - 目标链上 XCM 手续费购买的权重限制。可以定义为：
               - `Unlimited` - 允许无限量的权重
               - `Limited` - 指定最大权重值

        一些提醒：

        - `BuyExecution` 用于使用指定的 `remoteFeesId` 资产购买执行时间
        - 手续费支付资产可以使用与主要资产不同的转移类型
        - 发起人必须能够提取指定的资产并执行 XCM
        - 如果需要的权重超过 `weightLimit` 中指定的权重，操作将失败，并且转移的资产可能面临风险

### 存储方法 {: #storage-methods }

Polkadot XCM Pallet 包含以下只读存储方法。请注意，这并非详尽的列表。要查看当前可用的存储方法，请查看 [Polkadot.js Apps 的链状态](https://polkadot.js.org/apps/#/chainstate){target=_blank}。

???+ function "**assetTraps**(h256 hash) — 返回给定哈希的被困资产的计数"
    === "参数"
        - `hash`: `H256` - 资产陷阱的哈希标识符。当资产被困时，会为其分配唯一的哈希标识符。您可以省略此字段以返回有关所有被困资产的信息
    === "返回值"
        返回一个 `U32`（无符号 32 位整数），表示资产在此哈希位置被困的次数。
        ```js
        // 示例返回值显示哈希 → 计数映射
        [
          [[0x0140f264543926e689aeefed15a8379f6e75a8c6884b0cef0832bb913a343b53], 1],
          [[0x0d14fd8859d8ff15dfe4d4002b402395129cdc4b69dea5575efa1dc205b96020], 425],
          [[0x166f82439fd2b25b28b82224e82ad9f26f2da26b8257e047182a6a7031accc9a], 3]
        ]
        ```
    === "Polkadot.js API 示例"
        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/polkadot-xcm/asset-traps.js'
        ```

??? function "**queryCounter**() — 最新的可用查询索引"

    === "参数"

        无

    === "返回值"

        `u64` - 最新的可用查询索引

    === "Polkadot.js API 示例"

        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/polkadot-xcm/query-counter.js'
        ```

??? function "**safeXcmVersion**() — 当目标版本未知时，用于编码 XCM 的默认版本"

    === "参数"

        无

    === "返回值"

        `u32` - 当目标版本未知时，用于编码 XCM 的默认版本

    === "Polkadot.js API 示例"

        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/polkadot-xcm/safe-xcm-version.js'
        ```

??? function "**supportedVersion**(XcmVersion, Multilocation) — 返回给定位置支持的 XCM 版本"

    === "参数"
        - version `u32`: XcmVersion - 要检查的版本号
        - location: MultiLocation - 要检查版本支持的位置

    === "返回值"
        返回位置到其支持的 XCM 版本的映射。每个条目包含一个 MultiLocation，指定平行链位置（包括父级和内部信息）以及一个 XcmVersion 编号，指示支持的版本

    === "Polkadot.js API 示例"
        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/polkadot-xcm/check-xcm-version.js'
        ```

??? function "**palletVersion**() — 从存储返回当前的 pallet 版本"

    === "参数"

        无

    === "返回值"

        表示 pallet 当前版本的数字。

        ```js
        // 如果使用 Polkadot.js API 并在未包装的值上调用 toJSON()
        0
        ```

    === "Polkadot.js API 示例"

        ```js
         --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/polkadot-xcm/pallet-version.js'
        ```

### Pallet 常量 {: #constants }

Polkadot XCM pallet 没有常量部分。

## 使用 Polkadot XCM Pallet 构建 XCM 消息 {: #build-with-PolkadotXCM-pallet}

本指南介绍了使用 Polkadot XCM Pallet 构建 XCM 消息的过程，特别是 `transferAssets` 函数。

!!! note
    每个平行链都可以允许和禁止来自托盘的特定方法。因此，开发人员必须确保他们使用允许的方法，否则交易将失败，并出现类似于 `system.CallFiltered` 的错误。

您将传输 xcUNIT 代币，它是 Alphanet 中继链代币 UNIT 的 [XC-20](/builders/interoperability/xcm/xc20/overview/){target=_blank} 表示形式。您可以针对任何其他 XC-20 调整本指南。

### 检查先决条件 {: #polkadotxcm-check-prerequisites}

要按照本指南中的示例进行操作，您需要具备以下条件：

- 一个有资金的帐户。
 --8<-- 'text/_common/faucet/faucet-list-item.md'
- 一些 xcUNIT 代币。您可以在 [Moonbeam-Swap](https://moonbeam-swap.netlify.app/#/swap){target=_blank} 上将 DEV 代币（Moonbase Alpha 的原生代币）兑换为 xcUNIT，这是一个 Moonbase Alpha 上的演示 Uniswap-V2 克隆

    !!! note
        您可以调整本指南以转移另一个 [外部 XC-20 或本地 XC-20](/builders/interoperability/xcm/xc20/overview/){target=_blank}。对于外部 XC-20，您需要资产 ID 和资产具有的小数位数。对于本地 XC-20，您需要合约地址。

    ![Moonbeam Swap xcUNIT](/images/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/xtokens-1.webp)

要检查您的 xcUNIT 余额，您可以将 XC-20 的 [预编译地址](/builders/interoperability/xcm/xc20/overview/#calculate-xc20-address){target=_blank} 添加到 MetaMask，地址如下：

```text
0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080
```

### Polkadot XCM 转移资产函数 {: #polkadotxcm-transfer-assets-function}

在此示例中，您将构建一条 XCM 消息，以通过 Polkadot XCM Pallet 的 `transferAssets` 函数，使用 [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=_blank}，将 xcUNIT 从 Moonbase Alpha 转移回 Alphanet 中继链。

要使用 `polkadotXcm` pallet 执行有限的储备转移，请按照以下步骤操作：

1. 安装所需的依赖项：用于区块链交互的 `@polkadot/api`，用于实用函数的 `@polkadot/util`，以及用于加密函数的 `@polkadot/util-crypto`。

2. 通过使用 Moonbase Alpha 端点 `wss://wss.api.moonbase.moonbeam.network` 创建 WebSocket 提供程序来设置您的网络连接。 使用此提供程序初始化 Polkadot API。

3. 使用以太坊格式配置您的帐户。 为以太坊地址创建一个密钥环实例，然后使用您的私钥添加您的帐户。 请记住在私钥前加上 `0x`，从 MetaMask 导出密钥时会省略该前缀。

    !!! remember
        这仅用于演示目的。 切勿将您的私钥存储在 JavaScript 文件中。

4. 通过使用 `decodeAddress` 函数将 SS58 格式地址转换为原始字节来准备目标地址。 如果目标 SS58 地址已经是十六进制格式，则无需转换。

5. 构建 XCM 转移交易，包含：中继链作为目标（具有 `parents: 1` 的父链）、受益人（使用 `AccountId32` 格式）、资产（金额，具有 12 位小数）、费用资产项 (0) 和权重限制（“无限制”）。

    ??? code "定义目标、受益人和资产"
        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/polkadot-xcm/destination-beneficiary-fee.js'
        ```

6. 提交您的交易并实施带有错误处理的监控逻辑。

7. 交易完成后，脚本将自动退出。 过程中的任何错误都将记录到控制台以进行故障排除。

???+ code "查看完整脚本"
    ```js
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/polkadot-xcm/send-xcm.js'
    ```

!!! note
    您可以在 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x1c0b0401000400010100d4620637e11439598c5fbae0506dc68b9fb1edb33b316761bf99987a1034a96b0404010000070010a5d4e80000000000){target=_blank} 上查看上述脚本的示例，该脚本将 1 个 xcUNIT 发送到中继链上的 Alice 帐户，使用以下编码的 calldata：`0x1c0b0401000400010100d4620637e11439598c5fbae0506dc68b9fb1edb33b316761bf99987a1034a96b0404010000070010a5d4e80000000000`。

交易处理完毕后，中继链上的目标帐户应已收到转移的金额，减去为在目标链上执行 XCM 而扣除的一小笔费用。

#### 故障排除

如果您在复制演示时遇到困难，请采取以下故障排除步骤：

 - 确保您的发送账户中有足够的 DEV 代币
 - 确保您的发送账户中有足够的 xcUNIT 代币（或您指定的其他 XC-20 代币）
 - 在 Moonbase Alpha 上的 Polkadot.js Apps 上检查 [Explorer](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer){target=_blank}，以确保在源链上成功完成交易
 - 在 Polkadot.js Apps 上检查 [Explorer](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frelay.api.moonbase.moonbeam.network#/explorer){target=_blank}，并查看 Moonbase 中继链上收到的 XCM 消息
