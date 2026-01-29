---
title: 计算得出的原始账户
description: 了解计算得出的原始账户，这些账户可用于通过一个简单的交易执行远程跨链调用，以及如何计算这些账户。
categories: XCM 远程执行
---

# 计算的原始账户

## 简介 {: #introduction }

计算来源，之前被称为多位置衍生帐户，是执行通过 XCM 的远程调用时计算出的帐户。

计算来源是无密钥的（私钥未知）。因此，只能通过来自原始帐户的 XCM extrinsic 访问计算来源。换句话说，原始帐户是唯一可以启动在您的计算来源帐户上交易的帐户，如果您失去对原始帐户的访问权限，您也将失去对您的计算来源帐户的访问权限。

计算来源是从用于在目标链中执行 XCM 的来源计算得出的。默认情况下，这是源链在目标链中的主权帐户。此来源可以通过 [`DescendOrigin`](/builders/interoperability/xcm/core-concepts/instructions/#descend-origin){target=\_blank} XCM 指令进行更改。但是，目标链可以决定是否使用新更改的来源来执行 XCM。在 Moonbeam 上，计算来源帐户用于执行 XCM。

基于 Moonbeam 的网络遵循 [Polkadot 设置的计算来源标准](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-builder/src/location_conversion.rs){target=\_blank}，也就是说，通过一个 `blake2` 哈希，该哈希取决于 XCM 消息的来源的数据结构。但是，由于 Moonbeam 使用以太坊样式的帐户，因此计算来源被截断为 20 个字节。

## 原始转换 {: #origin-conversion }

当执行 `Transact` 指令时，会发生远程调用的[原始转换](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-executor/src/lib.rs#L719){target=\_blank}。目标链上的新原始地址是为目标链上 XCM 执行付费的地址。

例如，从 relay 链，[`DescendOrigin`](/builders/interoperability/xcm/core-concepts/instructions/#descend-origin){target=\_blank} 指令由 [XCM Pallet](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/pallet-xcm/src/lib.rs){target=\_blank} 本地注入。对于 Moonbase Alpha 的 relay 链（基于 Westend）而言，它具有以下格式（多位置连接）：

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/computed-origins/1.js'
```

其中 `decodedAddress` 对应于在 relay 链上签署交易的帐户的地址（以解码的 32 字节格式）。您可以使用以下代码段来确保您的地址已正确解码，如果需要，它将解码地址，如果不需要，则忽略它：

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/computed-origins/2.js'
```

当 XCM 指令在 Moonbeam（本例中为 Moonbase Alpha）中执行时，原始地址将变异为以下多位置：

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/computed-origins/3.js'
```

## 如何计算导出的原始地址 {: #calculate-computed-origin }

您可以通过 [xcm-tools](https://github.com/Moonsong-Labs/xcm-tools){target=\_blank} 存储库中的 `calculate-multilocation-derivative-account` 或 `calculate-remote-origin` 脚本轻松计算导出的原始地址帐户。

该脚本接受以下输入：

- `--ws-provider` 或 `-w` - 对应于用于获取导出的原始地址的端点。这应该是目标链的端点
- `--address` 或 `-a` - 指定发送 XCM 消息的源链地址
- `--para-id` 或 `--p` -（可选）指定 XCM 消息的原始链的平行链 ID。它是可选的，因为 XCM 消息可能来自中继链（没有平行链 ID）。或者，平行链可以充当其他平行链的中继链
- `--parents` -（可选）对应于源链相对于目标链的父链值。如果要计算中继链上帐户的导出的原始地址帐户，则此值为 `1`。如果省略，则父链值默认为 `0`

要使用该脚本，您可以采取以下步骤：

1. 克隆 [xcm-tools](https://github.com/Moonsong-Labs/xcm-tools){target=\_blank} 存储库
2. 运行 `yarn` 以安装必要的软件包
3. 运行脚本

    ```bash
    --8<-- 'code/builders/interoperability/xcm/remote-execution/computed-origins/4.sh'
    ```

您还可以使用 [XCM 实用程序预编译](/builders/interoperability/xcm/xcm-utils/){target=\_blank} 的 `multilocationToAddress` 函数来计算导出的原始地址帐户。

### 计算基于 Moonbeam 的网络上的计算来源 {: #calculate-the-computed-origin-on-moonbeam }

例如，要在 Moonbase Alpha 上计算 Alice 的中继链账户的计算来源，该账户为 `5DV1dYwnQ27gKCKwhikaw1rz1bYdvZZUuFkuduB4hEK3FgDT`，您可以使用以下命令来运行脚本：

```bash
--8<-- 'code/builders/interoperability/xcm/remote-execution/computed-origins/5.sh'
```

!!! note
    对于 Moonbeam 或 Moonriver，您将需要拥有自己的端点和 API 密钥，您可以从支持的 [端点提供商](/builders/get-started/endpoints/){target=\_blank} 处获取。

返回的输出包括以下值：

|                    名称                     |                                                                           值                                                                           |
|:-------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------:|
|        原始链编码地址         |                                                    `5DV1dYwnQ27gKCKwhikaw1rz1bYdvZZUuFkuduB4hEK3FgDT`                                                     |
|        原始链解码地址         |                                           `0x3ec5f48ad0567c752275d87787954fef72f557b8bfa5eefc88665fa0beb89a56`                                            |
| 目标链中收到的多位置 | `{"parents":1,"interior":{"x1":{"accountId32":{"network": {"westend":null},"id":"0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0afb2e78fdbbbf4ce26c2556c"}}}}` |
|     计算得到的来源账户 (32 字节)      |                                           `0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0afb2e78fdbbbf4ce26c2556c`                                            |
|     计算得到的来源账户 (20 字节)      |                                                       `0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0`                                                        |

因此，对于此示例，Alice 在 Moonbase Alpha 上的计算来源帐户是 `0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0`。 请注意，Alice 是唯一可以从继链通过远程交易访问此帐户的人，因为她是其私钥的所有者，并且计算出的来源帐户是无密钥的。
