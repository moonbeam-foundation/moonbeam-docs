---
title: 主权账户和储备支持的转移
description: 了解主权账户如何在 Moonbeam 上工作、如何计算它们以及它们在跨链资产转移中的作用。
categories: XCM
---

# 主权账户概述

## 简介 {: #introduction }

在基于 Polkadot 的生态系统中，主权账户是一种独特的、无密钥的账户，它通过 XCM 而不是个人或组织由区块链的运行时控制。这些账户用于在跨链转移代币时存储资产。例如，如果您将储备代币从平行链转移到 Moonbeam，则始发平行链会将这些代币锁定在源链上的 Moonbeam 主权账户中，同时在 Moonbeam 上生成这些代币的包装表示。

主权账户在[储备支持的转移](https://wiki.polkadot.com/learn/learn-xcm-usecases/#reserve-asset-transfer){target=\_blank}中起着核心作用，其中一条链（“储备”）持有真实的资产，而其他链持有衍生代币。当代币跨链移动时，储备（或来源）链会锁定或解锁底层资产，并且衍生代币会在目标链上生成或销毁。

## 计算平行链主权账户 {: #calculating-sovereign }

您可以使用 [xcm-tools](https://github.com/Moonsong-Labs/xcm-tools){target=\_blank} 存储库计算给定中继链上平行链的主权账户。当您需要验证底层代币的锁定位置或直接为平行链的主权账户提供资金时，这尤其有用。

1. 克隆或导航到 [xcm-tools 存储库](https://github.com/Moonsong-Labs/xcm-tools){target=\_blank}
2. 使用 `calculate-sovereign-account` 脚本，使用 `--p` 标志指定 **Parachain ID**，并使用 `--r` 标志指定中继链（默认为 `polkadot`；其他接受的值为 `kusama` 或 `moonbase`）

您需要的平行链 ID 可以在相应中继链的 [Polkadot.js Apps **Parachains** 页面](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frelay.api.moonbase.moonbeam.network#/parachains){target=\_blank} 上找到。 **Parachains** 页面可以在 **Network** 下拉菜单中访问。

例如，要计算 Moonbase Alpha 测试网上平行链 `1000` 的主权账户地址：

```bash
--8<-- 'code/builders/interoperability/xcm/core-concepts/sovereign-accounts/1.sh'
```

运行该脚本将生成如下输出：

--8<-- 'code/builders/interoperability/xcm/core-concepts/sovereign-accounts/terminal/calculate.md'

中继地址是 Polkadot 或 Kusama 中继链引用主权账户的方式。通用平行链地址通常用于从其他平行链引用此平行链的主权账户。 Moonbase Alpha 地址是 Moonbase Alpha 使用的 H160 EVM 地址格式中相应的主权账户。

## 了解更多 {: #learn-more }

主权账户构成了储备支持转移的支柱，从而能够安全托管资产，以便在 Polkadot 的生态系统中铸造包装代币。通过将主权账户与 XCM 框架相结合，平行链可以无缝地互操作——以透明、信任最小化的方式锁定和解锁资产。有关主权账户如何促进与 XCM 的跨链传输的更多信息，请务必查看[发送 XC-20 部分](/builders/interoperability/xcm/xc20/send-xc20s/overview/){target=\_blank}。
