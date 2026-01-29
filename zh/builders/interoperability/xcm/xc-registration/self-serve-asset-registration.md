---
title: 自助资产注册
description: 本指南展示了兄弟平行链如何通过 ForeignAssetOwnerOrigin 在 Moonbeam 上将原生代币注册为外部资产，以解锁 Moonbeam 上的 ERC-20 UX。
categories: XCM
---

# 兄弟平行链的自助资产注册

## 简介 {: #introduction }

在 Moonbeam 或 Moonriver 上注册您的平行链原生代币，可以让您的社区享受 ERC‑20 风格的用户体验和深入的 EVM 集成，同时保留完整的链上溯源。本指南向兄弟 Polkadot 平行链团队展示了如何使用 Moonbeam Runtime 3600 中引入的新的 `ForeignAssetOwnerOrigin` 自行注册外来资产。

### 为什么需要新的 Origin？{: #why-a-new-origin }

Moonbeam 引入了一个新的专用 Origin，名为 `ForeignAssetOwnerOrigin`，它只允许 Origin 包含资产多重定位的 XCM 消息在 `evm‑foreign‑assets` pallet 中执行调用。实际上，这意味着只有拥有该资产的平行链的主权账户或 Moonbeam 治理机构才能创建、冻结、解冻或重新定位它。与此同时，一个可配置的运行时常量 `ForeignAssetCreationDeposit` 会在创建时从调用者的主权账户中预留。该保证金旨在阻止垃圾注册。

## 必需的存款 {: #required-deposits }

为了防止垃圾邮件，需要 `ForeignAssetCreationDeposit` 并在资产的整个生命周期内锁定。存款从 Moonbeam 网络上的兄弟平行链的主权账户中获得资金，因此需要有足够的资金来支付资产存款和相关的交易费用。如果资产通过治理销毁，则存款将被解除保留并返回到原始主权账户。

存款是特定于网络的，可以通过 Moonbeam 治理通过 `parameters` pallet 进行调整：

=== "Moonbeam"

    |    Variable    |                       Value                       |
    |:--------------:|:-------------------------------------------------:|
    | Foreign Asset Deposit | {{ networks.moonbeam.xcm.foreign_asset_deposit.display }} GLMR |
=== "Moonriver"

    |    Variable    |                       Value                       |
    |:--------------:|:-------------------------------------------------:|
    | Foreign Asset Deposit | {{ networks.moonriver.xcm.foreign_asset_deposit.display }} MOVR |
=== "Moonbase Alpha"

    |    Variable    |                       Value                       |
    |:--------------:|:-------------------------------------------------:|
    | Foreign Asset Deposit | {{ networks.moonbase.xcm.foreign_asset_deposit.display }} DEV |

## 必备条件 {: #prerequisites }

需要注意以下几个必备条件：

- Moonbeam上的兄弟平行链的[主权账户](/builders/interoperability/xcm/core-concepts/sovereign-accounts/){target=\_blank}必须有足够的资金来支付资产存款和交易费用。建议您预留额外的资金缓冲，以备后续交易之需。请参阅此[主权账户计算指南](/builders/interoperability/xcm/core-concepts/sovereign-accounts/){target=\_blank}
- 您的平行链应支持 XCM V4
- 您的平行链需要与 Moonbeam 建立双向 XCM 通道。请参阅此[关于打开与 Moonbeam 之间的 XCM 通道的信息指南](/builders/interoperability/xcm/xc-registration/xc-integration/){target=\_blank}

## 收集您的资产详细信息 {: #assemble-your-asset-details }

在 Moonbeam 上注册您的兄弟平行链代币之前，您需要收集四个信息：

* **`AssetID`**: 从代币的 `multilocation` 派生的确定性 `u128`（见下文）。
* **`Decimals`**: 代币使用的小数位数（例如，`18`）。
* **`Symbol`**: 一个简短的交易代码，例如 `xcTEST`。该交易代码应以 `xc` 作为前缀。
* **`Name`**: 一个人类可读的名称，例如 `Test Token`。

```typescript
--8<-- 'code/builders/interoperability/xcm/xc-registration/self-serve-asset-registration/1.ts'
```

### 如何计算资产 ID {: #calculate-asset-id }

要生成代币的资产 ID，首先需要知道它的多重定位。`assetLocation` 是一个 SCALE 编码的多重定位，用于精确定位您的兄弟链上现有的代币。定义资产的方法有很多种，您的多重定位可能包括平行链 ID、管理资产的 pallet 以及本地资产索引。由于 extrinsic 在 Moonbeam 上执行，因此您需要从 Moonbeam 的角度描述路径：首先向上跳一级到 Relay `("parents": 1)`，然后向下进入您的平行链 `(Parachain: <paraId>)`、pallet 和资产索引。Moonbeam 使用它来验证调用者是否真的“包含”该资产，然后才允许任何注册或更新。

构造好您的多重定位后，请随手保存，因为下一步会用到它。典型的资产多重定位如下所示：

XCM 工具仓库中有一个有用的[计算外部资产信息脚本](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/calculate-external-asset-info.ts){target=\_blank}，您可以使用该脚本以编程方式生成资产 ID。该脚本接受两个参数，即资产的多重定位和目标网络（Moonbeam 或 Moonriver）。使用您资产的多重定位和目标网络调用 `calculate-external-asset-info.ts` 助手脚本，如下所示，以轻松生成其资产 ID。

```bash
--8<-- 'code/builders/interoperability/xcm/xc-registration/self-serve-asset-registration/3.sh'
```

该脚本将返回 `assetID`，您现在可以将其传递给 `evmForeignAssets.createForeignAsset`。

### 推导 XC-20 地址

将 `assetID` 转换为十六进制，在左侧填充到 32 个十六进制字符，并在前面加上八个 `F`，如下所示：

```text
xc20Address = 0xFFFFFFFF + hex(assetId).padStart(32, '0')
```

xcDOT 的 XC-20 地址示例可以这样计算：

=== "公式"

```ts
--8<-- 'code/builders/interoperability/xcm/xc-registration/self-serve-asset-registration/4.ts'
```

=== "示例"

```bash
--8<-- 'code/builders/interoperability/xcm/xc-registration/self-serve-asset-registration/5.sh'
```

## 生成编码的调用数据 {: #generate-the-encoded-call-data }

以下代码片段展示了如何构建需要发送到 Moonbeam 的调用，该调用会创建外部资产。保存生成的十六进制字符串，因为您会将其嵌入到从您的兄弟平行链分派的后续 XCM `Transact` 调用中。

```ts
--8<-- 'code/builders/interoperability/xcm/xc-registration/self-serve-asset-registration/generate-call-data.ts'
```

### 使用 XCM Transact 调度调用 {: #dispatch-the-call-with-xcm-transact }

要注册您的资产，请将 SCALE 编码的 `createForeignAsset` 字节包装在从您的平行链的主权账户执行的单个 `Transact` 指令中。调用的基本结构如下所示：

```text
Transact {
  originKind: SovereignAccount,
  requireWeightAtMost: <weight>,
  call: <encodedCall>
}
```

通过 `xcmPallet.send` 发送 transact 指令，目标平行链对于 Moonbeam 为 `2004`（对于 Moonriver 为 `2023`）。

```rust
--8<-- 'code/builders/interoperability/xcm/xc-registration/self-serve-asset-registration/6.rs'
```

最后，在 Moonbeam 上查找以下成功发出的事件：

```text
EvmForeignAssets.ForeignAssetCreated(assetId, location, creator)
```

它的存在确认了 XC-20 资产已启动。

## 管理现有外部资产 {: #managing-an-existing-foreign-asset }

创建外部资产后，可以使用以下外部函数对其进行更新。请注意，如果主权帐户发送调用，则主权帐户和位置仍必须位于来源内部。否则，唯一其他授权来源是来自 Moonbeam 治理行动的 `Root`。

| Extrinsic                                     | 谁可以调用？                                     | 注释                                                  |
|-----------------------------------------------|---------------------------------------------------|-------------------------------------------------------|
| `changeXcmLocation`                           | 兄弟主权帐户或 Moonbeam 治理                     | 需要已预留的存款。                                      |
| `freezeForeignAsset` / `unfreezeForeignAsset` | 兄弟主权帐户或 Moonbeam 治理                     | `freeze` 可以选择销毁资产的元数据。                       |

## 常见问题 {: #faqs }

### 如何取回保证金？

保证金会在资产的整个生命周期内保持预留状态。如果资产通过治理被销毁，保证金将被解除预留并返还给原始主权帐户。

### 普通的 EOA 可以注册资产吗？

不可以。来自非主权、非治理账户的调用会因 `BadOrigin` 而失败。

### 如果我的 XCM 位置超出我的原始位置会发生什么？

该调用将被 `LocationOutsideOfOrigin` 拒绝。请仔细检查 `Parachain`、`PalletInstance` 和 `GeneralIndex` 字段。

### 可以创建的资产数量是否有限制？

是的，每个网络（例如，Moonbeam、Moonriver）的外部资产数量限制为 `256` 个。超出此限制的尝试将返回 `TooManyForeignAssets`。如果接近此阈值，则可以在将来的运行时升级中进行修订以解除此限制。
