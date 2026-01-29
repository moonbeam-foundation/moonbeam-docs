---
title: XCM 多重定位
description: 了解关于多重定位的所有知识，它们在 XCM 中的作用，以及如何格式化多重定位以定位生态系统中的特定点。
categories: XCM
---

# 多重定位（Multilocations）

## 简介 {: #introduction }

多重位置定义了相对于给定原点的整个中继链/平行链生态系统中的特定点。它可用于定位特定的平行链、资产、帐户，甚至是平行链内的 pallet。

多重位置遵循分层结构，其中某些位置封装在其他位置内。例如，中继链封装了连接到它的所有平行链。同样，平行链封装了存在于其中的所有 pallet、帐户和资产。

![多重位置的层次结构](/images/builders/interoperability/xcm/core-concepts/multilocations/multilocations-1.webp)

## 定义多位置 {: #defining-a-multilocation }

多位置包含两个参数：

- `parents` - 指的是从给定的原点开始，你需要向上追溯到父区块链的“跳数”。从平行链在 relay chain 生态系统中的角度来看，只能有一个父链，因此 `parents` 的值只能是 `0` (表示平行链) 或 `1` (表示 relay chain)。当定义考虑到其他共识系统（如以太坊）的通用位置时，`parents` 可以具有更高的值
- `interior` - 指的是定义目标点所需的字段数。从 relay chain 出发，您可以向下钻取以定位特定的平行链、帐户、资产或该平行链上的 pallet。由于此向下移动可能更复杂，因此 [Junctions](#junctions) 用于表示到达目标位置所需的步骤，并由 `XN` 定义，其中 `N` 是所需的 Junctions 数。如果定义目标点不需要任何 Junctions，则其值将为 `Here` 而不是 `X1`

例如，如果您专门以 relay chain 为目标，您将使用 `Here`，因为您没有在 relay chain 上定义帐户、平行链或平行链中的特定点。

另一方面，如果您以 relay chain 上的帐户、平行链或平行链中的特定点为目标，您将根据需要使用一个或多个 Junctions。

### 连接点 {: #junctions }

连接点可以是以下任何一种：

- `Parachain` - 使用平行链的 ID 描述平行链

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/1.js'
    ```

- `AccountId32` - 描述一个 32 字节的 Substrate 风格账户。接受一个可选的 `network` 参数，可以是以下之一：`Any`、`Named`、`Polkadot` 或 `Kusama`

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/2.js'
    ```

- `AccountIndex64` - 描述一个 64 位（8 字节）的账户索引。接受一个可选的 `network` 参数，可以是以下之一：`Any`、`Named`、`Polkadot` 或 `Kusama`

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/3.js'
    ```

- `AccountKey20` - 描述一个 20 字节的 Ethereum 风格账户，就像在 Moonbeam 中使用的一样。接受一个可选的 `network` 参数，可以是以下之一：`Any`、`Named`、`Polkadot` 或 `Kusama`

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/4.js'
    ```

- `PalletInstance` - 描述目标链上的 pallet 的索引

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/5.js'
    ```

- `GeneralIndex` - 描述一个非描述性的索引，可用于定位以键值格式存储的数据

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/6.js'
    ```

- `GeneralKey` - 描述一个非描述性的键，可用于定位更复杂的数据结构。这需要您指定数据的 `data` 和 `length`

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/7.js'
    ```

- `OnlyChild` - 描述位置的子项（如果父项和子项之间只有一对一的关系）。当前，除了在派生上下文时作为后备之外，不使用此项
- `Plurality` - 描述满足特定条件或共享共同特征的多个元素。这要求您指定 Junction 表示的 [Body ID](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/src/v3/junction.rs#L150-L176){target=\_blank} 和 [Body Part](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/src/v3/junction.rs#L222-L251){target=\_blank}

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/8.js'
    ```

使用连接点时，您将使用 `XN`，其中 `N` 是到达目标位置所需的连接点数。例如，如果您要从平行链定位 Moonbeam 上的帐户，则需要将 `parents` 设置为 `1`，并且需要定义两个连接点，即 `Parachain` 和 `AccountKey20`，因此您将使用 `X2`，它是一个将包含每个连接点的数组：

```js
--8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/9.js'
```

## Multilocations 示例 {: #example-multilocations }

### 从另一个平行链定位 Moonbeam {: #target-moonbeam-from-parachain }

要从另一个平行链定位基于 Moonbeam 的链，您需要使用以下多重定位：

=== "Moonbeam"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/10.js'
    ```

=== "Moonriver"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/11.js'
    ```

=== "Moonbase Alpha"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/12.js'
    ```

### 从另一个平行链定位 Moonbeam 上的帐户 {: #target-account-moonbeam-from-parachain }

要从另一个平行链定位 Moonbeam 链上的特定帐户，您可以使用以下多重定位：

=== "Moonbeam"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/9.js'
    ```

=== "Moonriver"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/14.js'
    ```

=== "Moonbase Alpha"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/15.js'
    ```

### 从另一个平行链定位 Moonbeam 的原生资产 {: #target-moonbeam-native-asset-from-parachain }

要从另一个平行链定位 Moonbeam 的原生资产，您可以使用以下多重地址：

=== "Moonbeam"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/16.js'
    ```

=== "Moonriver"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/17.js'
    ```

=== "Moonbase Alpha"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/18.js'
    ```

### 从中继链定位 Moonbeam {: #target-moonbeam-from-relay }

要从中继链定位基于 Moonbeam 的链，您可以使用以下多重定位：

=== "Moonbeam"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/19.js'
    ```

=== "Moonriver"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/20.js'
    ```

=== "Moonbase Alpha"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/21.js'
    ```

### 从 Moonbeam 定位中继链 {: #target-relay-from-moonbeam }

要从基于 Moonbeam 的链定位中继链，您可以使用以下多重定位：

=== "Moonbeam"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/22.js'
    ```

=== "Moonriver"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/22.js'
    ```

=== "Moonbase Alpha"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/22.js'
    ```

### 从 Moonbeam 定位中继链上的帐户 {: #target-account-relay-from-moonbeam }

要定位中继链上的特定帐户，您将使用以下多重定位：

=== "Moonbeam"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/25.js'
    ```

=== "Moonriver"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/25.js'
    ```

=== "Moonbase Alpha"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/25.js'
    ```

### 从 Moonbeam 定位另一个平行链 {: #target-parachain-from-moonbeam }

要从 Moonbeam 定位另一个平行链（例如，ID 为 1234 的平行链），您可以使用以下多重地址：

=== "Moonbeam"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/28.js'
    ```

=== "Moonriver"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/28.js'
    ```

=== "Moonbase Alpha"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/28.js'
    ```

### Location to Account API {: #location-to-account-api }

Location to Account API 是一种将多重位置转换为 `AccountID20` 地址的简便方法。可以通过 Polkadot.js Apps **开发者**部分的[运行时调用](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/runtime){target=\_blank}选项卡访问 Location to Account API。Location to Account API 的 `convertLocation` 方法将多重位置作为参数，并返回 `AccountID20` 地址。

```javascript
// Query the locationToAccountApi using convertLocation method
const result =
  await api.call.locationToAccountApi.convertLocation(multilocation);
console.log('转换结果：', result.toHuman());
```

您可以在下方查看完整的脚本。

??? code "查看完整脚本"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/location-to-account.js'
    ```

该方法将返回与提供的多重位置对应的 `AccountID20` 地址，如下所示：

```bash
--8<-- 'code/builders/interoperability/xcm/core-concepts/multilocations/32.sh'
```
