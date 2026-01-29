---
title: XCM 执行费用
description: 了解处理 XCM 执行费用支付所涉及的 XCM 指令，以及如何在 Polkadot、Kusama 和基于 Moonbeam 的网络上计算费用。
categories: XCM
---

# Moonbeam上的XCM费用

## 简介 {: #introduction}

XCM 旨在成为一种在共识系统之间交流思想的语言。发送 XCM 消息包含一系列指令，这些指令在发起链和目标链中执行。XCM 指令的组合会导致诸如代币转移之类的操作。为了处理和执行每个 XCM 指令，通常需要支付相关的费用。

但是，XCM 的设计具有通用性、可扩展性和高效性，因此在不断增长的生态系统中，它始终具有价值和面向未来的特性。因此，通用性适用于包括 XCM 执行费用支付在内的概念。在 Ethereum 中，费用已纳入交易协议，而在 Polkadot 生态系统中，每个链都可以灵活地定义如何处理 XCM 费用。

本指南将介绍费用支付的各个方面，例如谁负责支付 XCM 执行费用、如何支付费用以及如何在 Moonbeam 上计算费用。

!!! note
    **以下信息仅供一般参考。** 自撰写本文以来，权重和外部基本成本可能已更改。请确保您检查实际值，并且切勿将以下信息用于生产应用程序。

## 费用支付 {: #payment-of-fees }

一般来说，费用支付过程可以描述如下：

1. 需要提供一些资产
2. 必须协商资产交换计算时间（或权重）
3. XCM 操作将按照指示执行，并具有所提供的权重限制或可用于执行的资金

每个链都可以配置 XCM 费用的处理方式以及可以使用哪些代币支付（原生储备代币或外部代币）。例如：

- **Polkadot 和 Kusama** - 费用分别以 DOT 或 KSM 支付，并交给区块的验证者
- **Moonbeam 和 Moonriver** - XCM 执行费用可以用储备资产（分别为 GLMR 或 MOVR）支付，也可以用在其他链中产生的资产支付（如果这些资产注册为 [XCM 执行资产](/builders/interoperability/xcm/xc-registration/assets/){target=\_blank}）。当 XCM 执行（代币转移或远程执行）以原生链储备资产（GLMR 或 MOVR）支付时，{{ networks.moonbeam.treasury.tx_fees_burned }}% 将被销毁。当 XCM 执行以国外资产支付时，费用将发送到 Treasury

考虑以下情景：Alice 在 Polkadot 上有一些 DOT，她想将其转移到 Moonbeam 上的 Alith。她发送了一条 XCM 消息，其中包含一组 XCM 指令，这些指令将从她在 Polkadot 上的帐户中检索给定数量的 DOT，并将它们作为 xcDOT 铸造到 Alith 的帐户中。部分指令在 Polkadot 上执行，另一部分在 Moonbeam 上执行。

Alice 如何支付 Moonbeam 来执行这些指令并满足她的请求？她的请求通过一系列包含在 XCM 消息中的 XCM 指令来满足，这使她可以购买执行时间，减去任何相关的 XCM 执行费用。执行时间用于发行和转移 xcDOT，这是 DOT 在 Moonbeam 上的表示。这意味着当 Alice 将一些 DOT 发送到 Alith 在 Moonbeam 上的帐户时，她将收到她的 DOT 的 1:1 表示，即 xcDOT 减去任何 XCM 执行费用。请注意，在这种情况下，XCM 执行费用以 xcDOT 支付并发送到 Treasury。

Alice 转移的确切过程如下：

1. 资产被发送到 Polkadot 上由 Moonbeam 拥有的帐户，称为 Sovereign 帐户。收到资产后，将向 Moonbeam 发送一条 XCM 消息
2. Moonbeam 中的 XCM 消息将：
    1. 铸造相应的资产表示
    2. 购买相应的执行时间
    3. 使用该执行时间将表示（减去费用）存入目标帐户

### XCM 指令 {: #xcm-instructions }

XCM 消息由一系列 XCM 指令组成。因此，不同的 XCM 指令组合会导致不同的操作。例如，要将 DOT 移动到 Moonbeam，可以使用以下 XCM 指令：

--8<-- 'zh/text/builders/interoperability/xcm/xc20/send-xc20s/overview/DOT-to-xcDOT-instructions.md'

要检查如何构建 XCM 消息的指令以将自留资产转移到目标链（例如将 DOT 转移到 Moonbeam），您可以参考 [X-Tokens 开放运行时模块库](https://github.com/moonbeam-foundation/open-runtime-module-library/blob/master/xtokens/src/lib.rs){target=\_blank} 存储库（例如）。您将需要查看 [`transfer_self_reserve_asset`](https://github.com/moonbeam-foundation/open-runtime-module-library/blob/master/xtokens/src/lib.rs#L699){target=\_blank} 函数。您会注意到它调用 `TransferReserveAsset` 并传入 `assets`、`dest` 和 `xcm` 作为参数。特别是，`xcm` 参数包括 `BuyExecution` 和 `DepositAsset` 指令。然后，如果您前往 Polkadot GitHub 存储库，您可以找到 [`TransferReserveAsset` 指令](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-executor/src/lib.rs#L671){target=\_blank}。XCM 消息是通过将 `ReserveAssetDeposited` 和 `ClearOrigin` 指令与 `xcm` 参数组合而构建的，如前所述，`xcm` 参数包括 `BuyExecution` 和 `DepositAsset` 指令。

--8<-- 'zh/text/builders/interoperability/xcm/xc20/send-xc20s/overview/xcDOT-to-DOT-instructions.md'

要检查如何构建 XCM 消息的指令以将储备资产转移到目标链（例如将 xcDOT 转移到 Polkadot），您可以参考 [X-Tokens 开放运行时模块库](https://github.com/moonbeam-foundation/open-runtime-module-library/tree/master/xtokens){target=\_blank} 存储库。您将需要查看 [`transfer_to_reserve`](https://github.com/moonbeam-foundation/open-runtime-module-library/blob/master/xtokens/src/lib.rs#L719){target=\_blank} 函数。您会注意到它调用 `WithdrawAsset`，然后调用 `InitiateReserveWithdraw` 并传入 `assets`、`dest` 和 `xcm` 作为参数。特别是，`xcm` 参数包括 `BuyExecution` 和 `DepositAsset` 指令。然后，如果您前往 Polkadot GitHub 存储库，您可以找到 [`InitiateReserveWithdraw` 指令](https://github.com/paritytech/polkadot-sdk/blob/{{polkadot_sdk}}/polkadot/xcm/xcm-executor/src/lib.rs#L903){target=\_blank}。XCM 消息是通过将 `WithdrawAsset` 和 `ClearOrigin` 指令与 `xcm` 参数组合而构建的，如前所述，`xcm` 参数包括 `BuyExecution` 和 `DepositAsset` 指令。

## 中继链 XCM 费用计算 {: #rel-chain-xcm-fee-calc }

Substrate 引入了一种权重系统，用于确定外部因素的计算成本有多高或换句话说有多昂贵。一个权重单位被定义为一个皮秒的执行时间。在支付费用时，用户将根据所发出调用的权重支付交易费用，以及网络拥塞等因素。

以下部分将详细介绍如何计算 Polkadot 和 Kusama 的 XCM 费用。重要的是要注意，特别是 Kusama，使用基准数据来确定 XCM 指令的总权重成本，并且某些 XCM 指令可能包括数据库读取和写入，这会增加调用的权重。

Polkadot 和 Kusama 中有两个可用的数据库：RocksDB（默认）和 ParityDB，两者都有各自与每个网络相关的权重成本。

### Polkadot {: #polkadot }

Polkadot上的总权重成本除了给定指令所需的权重外，还考虑了数据库的读取和写入。Polkadot对指令以及数据库的读取和写入操作使用基准权重。数据库操作的权重成本细分可以在[RocksDB（默认）](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/constants/src/weights/rocksdb_weights.rs){target=\_blank}和[ParityDB](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/constants/src/weights/paritydb_weights.rs){target=\_blank}的相应存储库文件中找到。

现在您已经了解了Polkadot上数据库读取和写入的权重成本，您可以使用指令的基本权重来计算给定指令的权重成本。

在Polkadot上，基准基础权重分为两类：可替代的和通用的。可替代权重用于涉及转移资产的XCM指令，通用权重用于其他所有指令。您可以直接在Polkadot Runtime代码中查看[可替代资产](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L46){target=\_blank}和[通用资产](https://github.com/polkadot-fellows/runtimes/blob/{{networks.polkadot.spec_version}}/relay/polkadot/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L46){target=\_blank}的当前权重。

确定指令权重成本后，您可以计算每个指令的DOT成本。

在Polkadot中，[`ExtrinsicBaseWeight`](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/constants/src/weights/extrinsic_weights.rs#L56){target=\_blank}设置为`{{ networks.polkadot.extrinsic_base_weight.display }}`，它[映射到](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/constants/src/lib.rs#L92){target=\_blank}美分的1/10。其中1美分是`10^10 / 100`。

因此，要计算执行XCM指令的成本，可以使用以下公式：

```
XCM-DOT-Cost = XCMInstrWeight * DOTWeightToFeeCoefficient
```

其中`DOTWeightToFeeCoefficient`是一个常数（映射到1美分），可以计算为：

```
DOTWeightToFeeCoefficient = 10^10 / ( 10 * 100 * DOTExtrinsicBaseWeight )
```

现在，您可以开始计算以DOT为单位的最终费用，使用`DOTWeightToFeeCoefficient`作为常数，`TotalWeight`作为变量：

```
XCM-Planck-DOT-Cost = TotalWeight * DOTWeightToFeeCoefficient
XCM-DOT-Cost = XCM-Planck-DOT-Cost / DOTDecimalConversion
```

### Kusama {: #kusama }

Kusama上的总权重成本除了给定指令所需的权重外，还会考虑数据库的读取和写入。数据库操作的权重成本细分可以在[RocksDB（默认）](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.kusama.spec_version }}/relay/kusama/constants/src/weights/rocksdb_weights.rs){target=\_blank}和[ParityDB](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.kusama.spec_version }}/relay/kusama/constants/src/weights/paritydb_weights.rs){target=\_blank}的相应存储库文件中找到。

在Kusama上，基准基本权重分为两类：可替代的和通用的。可替代权重用于涉及移动资产的XCM指令，通用权重用于其他所有指令。您可以在Kusama Runtime代码中直接查看[可替代资产](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.kusama.spec_version }}/relay/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L46){target=\_blank}和[通用资产](https://github.com/polkadot-fellows/runtimes/blob/{{networks.kusama.spec_version}}/relay/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L46){target=\_blank}的当前权重。

在确定指令权重成本后，您可以使用[`ExtrinsicBaseWeight`](https://github.com/polkadot-fellows/runtimes/blob/{{networks.kusama.spec_version}}/relay/kusama/constants/src/weights/extrinsic_weights.rs#L56){target=\_blank}和[权重费用映射](https://github.com/polkadot-fellows/runtimes/blob/{{networks.kusama.spec_version}}/relay/kusama/constants/src/lib.rs#L90){target=\_blank}来计算KSM中指令的成本。

要计算执行XCM指令的成本，可以使用以下公式：

```
XCM-KSM-Cost = XCMInstrWeight * KSMWeightToFeeCoefficient
```

其中`KSMWeightToFeeCoefficient`是一个常数（映射到1美分），可以计算为：

```
KSMWeightToFeeCoefficient = 10^12 / ( 10 * 3000 * KSMExtrinsicBaseWeight )
```

现在，您可以开始计算KSM中的最终费用，使用`KSMWeightToFeeCoefficient`作为常量，`TotalWeight`作为变量：

```
XCM-Planck-KSM-Cost = TotalWeight * KSMWeightToFeeCoefficient
XCM-KSM-Cost = XCM-Planck-KSM-Cost / KSMDecimalConversion
```

## 基于 Moonbeam 的网络 XCM 费用计算 {: #moonbeam-xcm-fee-calc }

Substrate 引入了一个权重系统，用于确定一个 extrinsic 从计算成本角度来看有多重或换句话说有多昂贵。一个单位的权重被定义为一皮秒的执行时间。在支付费用时，用户将根据所调用函数的权重支付交易费，并且每个平行链可以决定如何将权重转换为费用。例如，这可以解释与交易大小和存储相关的额外成本。

对于所有基于 Moonbeam 的网络，通用 XCM 指令都经过基准测试，而同质化 XCM 指令仍然对每个指令使用固定的权重。因此，经过基准测试的 XCM 指令的总权重成本除了给定指令所需的权重外，还考虑了数据库的读取和写入次数。Polkadot SDK 细分了相关的 [RocksDB 数据库权重](https://github.com/paritytech/polkadot-sdk/blob/{{polkadot_sdk}}/substrate/frame/support/src/weights/rocksdb_weights.rs#L27-L28){target=\_blank}。

现在，您可以使用指令的基本权重以及额外的数据库读取和写入（如果适用）来计算同质化和通用 XCM 指令的权重成本。

例如，`WithdrawAsset` 指令是同质化 XCM 指令的一部分。因此，它没有经过基准测试，并且 [`WithdrawAsset` 指令](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/runtime/moonbeam/src/weights/xcm/fungible.rs#L36){target=\_blank} 的总权重成本为 `{{ xcm.fungible_weights.display }}`，但传输本地 XC-20 时除外。本地 XC-20 的 `WithdrawAsset` 指令的总权重成本基于将 Ethereum gas 转换为 Substrate 权重。

`BuyExecution` 指令是通用的，因此具有预定义的基准权重。您可以在 [Moonbeam 运行时源代码](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/runtime/moonbeam/src/weights/xcm/generic.rs#L132-L133){target=\_blank} 中查看其当前基本权重。除了基本权重外，该指令还执行四次数据库读取，这些读取被添加到计算总权重中。

您可以在下表中找到所有 XCM 指令的所有权重值，这些值适用于所有基于 Moonbeam 的网络：

|                                                                                     基准测试指令                                                                                     |                                                                                    非基准测试指令                                                                                    |
|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| [通用 XCM 指令](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/runtime/moonbeam/src/weights/xcm/generic.rs){target=\_blank} | [同质化 XCM 指令](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/runtime/moonbeam/src/weights/xcm/fungible.rs){target=\_blank} |

以下部分将分解如何计算基于 Moonbeam 的网络的 XCM 费用。主要有两种情况：

 - 以储备代币（如 GLMR、MOVR 或 DEV 等原生代币）支付的费用
 - 以外部资产 (XC-20) 支付的费用

### 储备资产的费用计算 {: #moonbeam-reserve-assets }

对于每个 XCM 指令，权重单位会转换为余额单位，作为费用计算的一部分。每个基于 Moonbeam 的网络的每个权重单位的 Wei 数量如下：

|                                                                                                  Moonbeam                                                                                                   |                                                                                                   Moonriver                                                                                                    |                                                                                               Moonbase Alpha                                                                                                |
|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| [{{ networks.moonbeam.xcm.instructions.wei_per_weight.display }}](https://github.com/moonbeam-foundation/moonbeam/blob/{{networks.moonbeam.spec_version}}/runtime/moonbeam/src/lib.rs#L163){target=\_blank} | [{{ networks.moonriver.xcm.instructions.wei_per_weight.display }}](https://github.com/moonbeam-foundation/moonbeam/blob/{{networks.moonriver.spec_version}}/runtime/moonriver/src/lib.rs#L170){target=\_blank} | [{{ networks.moonbase.xcm.instructions.wei_per_weight.display }}](https://github.com/moonbeam-foundation/moonbeam/blob/{{networks.moonbase.spec_version}}/runtime/moonbase/src/lib.rs#L163){target=\_blank} |

这意味着，例如在 Moonbeam 上，计算储备资产中一个 XCM 指令成本的公式如下：

```
XCM-Wei-Cost = XCMInstrWeight * WeiPerWeight
XCM-GLMR-Cost = XCM-Wei-Cost / 10^18
```

因此，例如，可替代指令的实际计算如下：

```
XCM-Wei-Cost = {{ xcm.fungible_weights.numbers_only }} * {{ networks.moonbeam.xcm.instructions.wei_per_weight.numbers_only }}
XCM-GLMR-Cost = {{ networks.moonbeam.xcm.transfer_glmr.wei_cost }} / 10^18
```

对于 Moonbeam 上的 XCM 指令，总成本为 `{{ networks.moonbeam.xcm.transfer_glmr.glmr_cost }} GLMR`。

### 外部资产的费用计算 {: #fee-calc-external-assets }

Moonbeam根据调用的权重对外部资产收取费用。权重是一个包含两个字段的结构体，`refTime` 和 `proofSize`。`refTime` 指的是可用于执行的计算时间量。`proofSize` 指的是提交到Polkadot中继链进行验证的Moonbeam块的PoV（有效性证明）的大小。由于 `refTime` 和 `proofSize` 都是确定权重的组成部分，因此仅凭其中一个值无法获得准确的权重值。

您可以使用 [`xcmPaymentApi` 的 `queryXcmWeight` 方法](#query-xcm-weight)查询XCM指令的 `refTime` 和 `proofSize`。您可以通过[编程方式](#query-xcm-weight)或访问 [Polkadot.js Apps的运行时调用选项卡](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam.api.onfinality.io%2Fpublic-ws#/runtime){target=\_blank} 来执行此操作。`queryXcmWeight` 方法采用XCM版本，并且指令具有parameter参数，并返回相应的 `refTime` 和 `proofSize` 值。

#### 权重到 Gas 的映射 {: #weight-to-gas-mapping }

对于源自 EVM 操作的调用，例如依赖 EVM 操作 `MintInto` 的 `DepositAsset` 指令，您可以通过将 gas 限制乘以权重乘数来计算它们各自的权重值。对于 `refTime`，您需要将 gas 限制乘以 `{{ xcm.generic_weights.weight_per_gas.numbers_only }}`，对于 `proofSize`，您需要将 gas 限制乘以 `{{ xcm.generic_weights.proof_size.weight_per_gas }}`。为方便起见，下面提供了一个图表。

| 权重类型 |                       乘数值                       |
| :-------: | :---------------------------------------------------: |
|  引用时间   |   {{ xcm.generic_weights.weight_per_gas.display }}   |
| 证明大小  | {{ xcm.generic_weights.proof_size.weight_per_gas }} |

要确定 Alice 将 DOT 转移到 Moonbeam 的总权重，您需要转移所需的四个 XCM 指令中的每一个的权重。请注意，虽然前三个指令具有与这些指令相对应的特定 `refTime` 和 `proofSize` 值，可以通过 [`xcmPaymentApi` 的 `queryXcmWeight` 方法](#query-xcm-weight) 检索，但 `DepositAsset` 依赖于 EVM 操作 [`MintInto`](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/pallets/moonbeam-foreign-assets/src/evm.rs#L40){target=\_blank} 和每个 gas 的 `WeightPerGas` 转换 `{{ xcm.generic_weights.weight_per_gas.display }}`。因此，`DepositAsset` 的 `refTime` 可以计算为：

```
{{ xcm.generic_weights.ref_time.mint_into_gas.numbers_only }} gas * {{ xcm.generic_weights.weight_per_gas.numbers_only }} weight per gas = {{ xcm.generic_weights.ref_time.deposit_asset.numbers_only }}
```

`DepositAsset` 的 `proofSize` 可以计算为：

```
{{ xcm.generic_weights.ref_time.mint_into_gas.numbers_only }} gas * {{ xcm.generic_weights.proof_size.weight_per_gas }} weight per gas = {{ xcm.generic_weights.proof_size.deposit_asset.numbers_only }}
```

### 权重到资产费用转换 {: #weight-to-asset-fee-conversion}

一旦您获得了 `refTime` 和 `proofSize` 值的总和，您就可以轻松检索所需的相应费用金额。[`xcmPaymentApi` 的 `queryWeightToAssetFee` 方法]( #weight-to-asset-fee-conversion) 采用 `refTime`、`proofSize` 和资产多重位置作为参数，并返回相应的费用。通过提供上面获得的 `{{ networks.moonbeam.xcm.transfer_dot.total_weight.display }}` `refTime` 和 `{{ xcm.generic_weights.proof_size.transfer_dot_total.display }}` `proofSize` 以及 DOT 的资产多重位置，我们得到 `88,920,522` Plank 的费用金额，这是 Polkadot 中最小的单位。我们可以将其除以 `10^10` 转换为 DOT，从而得到 `{{ networks.moonbeam.xcm.transfer_dot.xcdot_cost }}` DOT 的 DOT 费用金额。

## XCM 支付 API 扩展示例 {: #xcm-payment-api-exanded-examples }

XCM 支付 API 方法提供了各种有用的方法来计算费用、评估可接受的费用支付货币等等。请记住，除了通过 API 访问之外，您还可以通过 [Polkadot.js 应用程序的运行时调用选项卡](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam.api.onfinality.io%2Fpublic-ws#/runtime){target=\_blank} 与 XCM 支付 API 进行交互。

### 查询可接受的手续费支付资产 {: #query-acceptable-fee-payment-assets }

此函数将XCM版本作为参数，并以多重定位形式返回可接受的手续费资产列表。

```js
--8<-- 'code/builders/interoperability/xcm/core-concepts/weights-fees/1.js'
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/weights-fees/query-acceptable-payment-assets.js'
    ```

### 权重到资产费用转换 {: #weight-to-asset-fee-conversion }

此方法将权重转换为指定资产的费用。它接受权重和资产多重定位作为参数，并返回相应的费用金额。

```js
--8<-- 'code/builders/interoperability/xcm/core-concepts/weights-fees/2.js'
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/weights-fees/weight-to-asset-fee-conversion.js'
    ```

### 查询 XCM 权重 {: #query-xcm-weight}

此方法将 XCM 消息作为参数，并返回消息的权重。

```js
--8<-- 'code/builders/interoperability/xcm/core-concepts/weights-fees/3.js'
```

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/weights-fees/query-xcm-weight.js'
    ```
