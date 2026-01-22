---
title: Moonbeam 路由流动性
description: 了解如何在建立与基于 Moonbeam 的网络的跨链集成后接收 Moonbeam 路由流动性。
categories: XCM
---

# Moonbeam 路由流动性

## Introduction {: #introduction }

Moonbeam 路由流动性 (MRL) 是指 Moonbeam 连接的任何区块链生态系统中的流动性都可以路由到 Polkadot 平行链的使用案例。这之所以成为可能，是因为多个组件协同工作：

- **通用消息传递 (GMP)** - 连接包括 Moonbeam 在内的多个区块链的技术。借助它，开发人员可以传递带有任意数据的消息，并且可以通过[与链无关的 GMP 协议](builders/interoperability/protocols/){target=_blank}跨非平行链区块链发送代币
- [**跨共识消息传递 (XCM)**](builders/interoperability/xcm/overview/){target=_blank} - Polkadot 的 GMP 版本。驱动 Polkadot 及其平行链（包括 Moonbeam）之间跨链互动的主要技术
- **支持 XCM 的 ERC-20** - 也称为[本地 XC-20](builders/interoperability/xcm/xc20/overview/#local-xc20s){target=_blank}，是指 Moonbeam EVM 上存在的所有现成的支持 XCM 的 ERC-20 代币
- [**GMP 预编译**](builders/ethereum/precompiles/interoperability/gmp/){target=_blank} - [预编译合约](builders/ethereum/precompiles/overview/){target=_blank}，它充当从 [Wormhole GMP 协议](builders/interoperability/protocols/wormhole/){target=_blank}传递的消息与 XCM 之间的接口

这些组件组合在一起，通过 Moonbeam 提供到平行链的无缝流动性路由。可以使用[GMP 预编译](builders/ethereum/precompiles/interoperability/gmp/){target=_blank}或与 XCM 相关的预编译（如 [X-Tokens](builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/){target=_blank} 预编译）交互的传统智能合约将流动性路由到平行链。

GMP 协议通常以锁定/铸造或销毁/铸造的方式移动资产。这种流动性通常以 ERC-20 代币的形式存在于 Moonbeam 上。Moonbeam 上的所有 ERC-20 现在都支持 XCM，这意味着只要它们在其他平行链上注册，它们现在就可以作为 XC-20 存在于任何其他平行链中。支持 XCM 的 ERC-20 在 Moonbeam 上被称为[本地 XC-20](builders/interoperability/xcm/xc20/overview/#local-xc20s){target=_blank}。

MRL 目前可以通过与 Wormhole 连接的链获得，但没有什么可以阻止平行链团队通过不同的 GMP 提供商实施类似的途径。

本指南将主要介绍与 Wormhole 的 SDK 和接口集成，以便您的平行链可以通过 Moonbeam 访问来自非平行链区块链的流动性的过程。它还将介绍入门的要求以及通过 Wormhole 提供的代币。

## 前提条件 {: #prerequisites }

要开始将 MRL 与您的平行链集成，您首先需要：

- [通过 HRMP 通道与 Moonbeam 建立跨链集成](builders/interoperability/xcm/xc-registration/xc-integration/){target=_blank}，以便资产可以从 Moonbeam 发送到您的平行链
- [在您的平行链上注册 Moonbeam 的资产](builders/interoperability/xcm/xc-registration/assets/#register-moonbeam-native-assets){target=_blank}。这是必需的，因为发送用于资产转移的 XCM 消息的 pallet 存在临时缺陷，这使得 Moonbeam 的原生 Gas 资产成为唯一可用作返回路径上的跨链费用的资产
- [注册您想要路由到您的平行链的本地 XC-20 代币](builders/interoperability/xcm/xc-registration/assets/#register-local-xc20){target=_blank}
    - 允许这些本地 XC-20 代币用于 XCM 费用
- 允许用户发送 `Transact` XCM 指令（通过 `polkadotXcm.Send` 或使用 [XCM Transactor Pallet](builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/#xcm-transactor-pallet-interface){target=_blank}），这支持远程 EVM 调用，允许远程平行链上的帐户与 Moonbeam 上的桥接智能合约交互
## 通过虫洞的 MRL {: #mrl-through-wormhole }

虽然 MRL 旨在包含许多不同的 GMP 提供商，但 Wormhole 是第一个为公众构建的。在您完成所有[先决条件](#prerequisites)之后，要通过 Wormhole 接收流动性，您需要：

- 通知 Moonbeam 团队您希望集成到 MRL 程序中，以便我们可以帮助您进行技术实施
- 与 Wormhole 团队和其他依赖 MRL 的前端连接，以最终确定技术细节并同步公告。他们可能需要以下信息：
    - 平行链 ID
    - 您的平行链使用的帐户类型（即 AccountId32 或 AccountKey20）
    - 您已注册的令牌的地址和名称
    - [Wormhole Connect](https://wormhole.com/products/connect){target=_blank} 前端可以使用的端点
    - 为什么您希望您的平行链通过 Wormhole Connect 连接？

### 通过 Wormhole 将 Token 发送到平行链 {: #sending-tokens-through-wormhole }

MRL 提供一键式解决方案，允许您将多位置定义为从任何具有 [Wormhole Connect 集成](https://wormhole.com/products/connect){target=_blank}的 Wormhole 链到达的资产的最终目的地。

要通过 Wormhole 和 MRL 发送 Token，用户界面将混合使用 [Wormhole TokenBridge](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/interfaces/ITokenBridge.sol){target=_blank} 和 [Moonbeam 的 GMP 预编译](builders/ethereum/precompiles/interoperability/gmp/){target=_blank}。

转移流动性的用户将调用原始链的 Wormhole TokenBridge 智能合约部署上的 `transferTokensWithPayload` 方法，该合约实现 `ITokenBridge.sol` 接口以将 Token 发送到 GMP 预编译。此函数需要一个字节负载，格式化为 SCALE 编码的多位置对象，该对象包装在另一个预编译特定的版本化类型中。要了解如何构建此负载，请参阅 GMP 预编译文档的 [构建 Wormhole 的负载](builders/ethereum/precompiles/interoperability/gmp/#building-the-payload-for-wormhole){target=_blank}部分。

Wormhole 依赖于一组分布式节点，这些节点监控多个区块链上的状态。在 Wormhole 中，这些节点被称为 [守护者](https://wormhole.com/docs/protocol/infrastructure/guardians/){target=_blank}。守护者的作用是观察消息并签署相应的负载。如果 2/3 的 Wormhole 签名守护者验证了特定消息，则该消息将被批准，并且可以在其他链上接收。

守护者签名和消息构成一个名为 [已验证操作批准 (VAA)](https://wormhole.com/docs/protocol/infrastructure/vaas/){target=_blank} 的证明。这些 VAA 由 Wormhole 网络中的 [中继器](https://wormhole.com/docs/protocol/infrastructure/relayer/){target=_blank} 传递到其目的地。在目标链上，VAA 用于执行操作。在这种情况下，VAA 被传递到 GMP 预编译的 `wormholeTransferERC20` 函数中，该函数通过 Wormhole 桥合约（铸造 Token）处理 VAA，并使用 XCM 消息将 Token 中继到平行链。请注意，作为集成 MRL 的平行链，您可能不需要实施或使用 GMP 预编译。

中继器的唯一工作是将 Wormhole 守护者批准的交易传递到目标链。MRL 已经得到一些中继器的支持，但任何人都可以运行一个。此外，用户可以在通过 Wormhole 桥接时手动执行他们在目标链中的交易，并完全避免中继器。

![Transferring wormhole MRL](/images/builders/interoperability/mrl/mrl-1.webp)

### 通过 Wormhole 将代币从平行链发送回去 {: #sending-tokens-back-through-wormhole }

要将代币从平行链通过 Wormhole 发送回目标链，用户必须发送一笔交易，最好使用 `utility.batchAll` extrinsic，这将把代币转移和远程执行操作批量处理到一笔交易中。例如，包含 `xTokens.transferMultiassets` 调用和具有 `Transact` 指令的 `polkadotXcm.send` 调用的批处理。

批量处理的原因是为了提供一键式解决方案。然而，目前，用户还必须拥有平行链上的 xcGLMR（GLMR 的表示）。原因主要有两个：

- 本地 XC-20（支持 XCM 的 ERC-20）不能用于支付 Moonbeam 上的 XCM 执行费用。这是一个设计决策，因为我们更倾向于将它们视为 ERC-20 并利用 ERC-20 接口的本地 `transfer` 函数。因此，处理 XC-20 的 XCM 指令仅限于将资金从一个账户转移到另一个账户，并且不理解 XCM 流固有的 Holding Register
- 目前，与 XCM 相关的 pallet 限制了 XCM 消息发送具有不同储备链的代币的能力。因此，您不能发送 XC-20 并将费用代币设置为原生平行链代币

请注意，截至 2024 年底，X-Tokens 预编译现在在底层使用 Polkadot XCM pallet，取代了 X-Tokens pallet。使用不同 pallet 的平行链必须实施自己的解决方案，以在单个消息中转移储备和非储备资产。

例如，将 MRL 代币从平行链通过 Wormhole 发送回目标链的整个过程的简要概述如下：

1. 使用 Utility pallet 的 `batchAll` extrinsic 发送一个批处理交易，其中包含以下两个调用。
    - **`xTokens.transferMultiassets`** - 将 xcGLMR 和本地 XC-20 发送到用户的 [Computed Origin 账户](#calculate-computed-origin-account)。Computed Origin 账户是 Moonbeam 上的一个无密钥账户，另一个平行链上的账户可以通过 XCM 控制该账户
    - **`polkadotXcm.send`** - 带有 `Transact` 指令。通过 XCM 向 Moonbeam 上的 Batch Precompile 发送[远程 EVM 调用](builders/interoperability/xcm/remote-execution/remote-evm-calls/){target=_blank}，该调用使用 `ethereumXcm.transact` extrinsic 将以下两个调用批处理到单个远程 EVM 交易中：
        - **`approve`**（本地 XC-20 合约）- 批准 Wormhole 中继器转移本地 XC-20
        - **`transferTokensWithRelay`**（中继器合约）- 调用 Moonbeam 上 Wormhole TokenBridge 智能合约的 `transferTokensWithPayload` 函数来跨链转移代币，这将广播消息以供 Wormhole Guardians 接收
2. Guardian Network 将接收 Wormhole 交易并对其进行签名
3. Wormhole 中继器将代币中继到目标链和目标账户

![跨链转移 Wormhole MRL](/images/builders/interoperability/mrl/mrl-2.webp)

现在您已经对总体规划有一个大致的了解，您可以开始实施它了。本指南中的示例将向您展示如何将资产从平行链转移到 Moonbase Alpha，然后再通过 Wormhole 转移回目标链，但本指南可以适用于 Moonbeam。

#### 计算计算源账户 {: #calculate-computed-origin-account }

要通过 Wormhole 发送代币，您需要在 Moonbeam 上计算用户的计算源账户（以前称为多位置衍生账户）。这可以使用 [xcm-tools 存储库](https://github.com/Moonsong-Labs/xcm-tools){target=_blank} 中的 [`calculate-multilocation-derivative-account.ts` 脚本](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/calculate-multilocation-derivative-account.ts){target=_blank} 离线完成。有关更多详细信息，您可以参考 [计算源](/builders/interoperability/xcm/remote-execution/computed-origins/){target=_blank} 指南。

或者，也可以使用 [XCM 实用程序预编译](/builders/interoperability/xcm/xcm-utils/){target=_blank} 的 `multilocationToAddress` 函数。

#### 创建一个项目 {: #create-a-project }

您需要为本指南中将要构建的文件创建一个新的项目目录。请按照以下步骤设置您的项目：

1. 创建一个新目录并进入该目录

    ```bash
    mkdir wormhole-mrl-demo && cd wormhole-mrl-demo
    ```

2. 创建一个 `package.json` 文件：

    ```bash
    npm init -y
    ```

3. 安装构建远程 EVM 调用和 XCM extrinsic 所需的软件包

    ```bash
    npm i @polkadot/api ethers
    ```

4. 创建本指南所需的文件：

    - `build-transfer-multiassets-call.js` - 用于创建跨链传输资产的 `xTokens.transferMultiassets` extrinsic。它包含批量交易的第一个调用的逻辑
    - `build-remote-calldata.js` - 用于创建编码的 calldata，该 calldata 批准 Wormhole 中继器传输本地 XC-20，并通过 Wormhole TokenBridge 合约启动传输。这是批量交易的第二个调用所必需的
    - `build-remote-evm-call.js` - 用于创建执行远程 EVM 调用的 `polkadotXcm.send` extrinsic。它包含批量交易的第二个调用的逻辑
    - `send-batch-transaction.js` - 用于组装和发送资产转移和远程 EVM 调用的批量交易

    ```bash
    touch build-transfer-multiassets.js build-remote-calldata.js \
    build-remote-evm-call.js send-batch-transaction.js
    ```

5. 为您在本指南中将要使用的每个合约的 ABI 创建一个目录和文件：

    ```bash
    mkdir abi && touch abi/ERC20.js abi/TokenRelayer.js abi/Batch.js
    ```

    ??? code "ERC-20 接口 ABI"

        ```js title="ERC20.js"
        --8<-- 'code/builders/interoperability/mrl/abi/ERC20.js'
        ```

    ??? code "TokenBridge 中继器 ABI"

        ```js title="TokenRelayer.js"
        --8<-- 'code/builders/interoperability/mrl/abi/TokenRelayer.js'
        ```
        

    ??? code "批量预编译 ABI"

        ```js title="Batch.js"
        --8<-- 'code/builders/interoperability/mrl/abi/Batch.js'
        ```

#### 构建转移多资产交易 {: #build-transfer-multiassets }

您可以开始处理 `xTokens.transferMultiassets` 交易，它接受四个参数：

- `assets` - 定义了 xcDEV（Moonbeam 的 xcGLMR）和本地 XC-20 的多重位置和数量，以便发送到 Moonbase Alpha，其中 xcDEV 作为第一个资产，本地 XC-20 作为第二个资产
- `feeItem` - 设置为 xcDEV 资产的索引，在本例中为 `0`，以便 DEV 用于支付 Moonbase Alpha 中的执行费用
- `dest` - 一个多重位置，定义了您在前一节中在 Moonbase Alpha 上计算的计算来源帐户
- `destWeightLimit` - 要购买的权重，用于支付目标链上的 XCM 执行费用

您可以在 [X-Tokens Precompile 页面](builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/#xtokens-solidity-interface){target=_blank} 文档中找到有关每个参数的更多信息。

在 `build-transfer-multiassets-call.js` 文件中，您将构建 `xTokens.transferMultiassets` 交易并将其导出。

```js title="build-transfer-multiassets-call.js"
--8<-- 'code/builders/interoperability/mrl/build-transfer-multiassets-call.js'
```

要修改 Moonbeam 的代码，您将使用以下配置：

|           参数            | 值  |
|:------------------------------:|:-----:|
|          平行链 ID          | 2004  |
|     余额 Pallet 索引      |  10   |
| ERC-20 XCM 桥 Pallet 索引 |  110  |

#### 构建远程 EVM 调用 {: #build-the-remote-evm-call }

为了生成批量交易的第二个调用，即 `polkadotXcm.send` extrinsic，您需要创建 EVM 交易，然后组装执行该 EVM 交易的 XCM 指令。

目前，您将专注于生成 EVM 交易的 calldata。为此，您将构建一个与 [Batch Precompile](builders/ethereum/precompiles/ux/batch/){target=_blank} 交互的交易，以便在一个交易中发生两个交易。这很有帮助，因为此 EVM 交易必须批准 Wormhole 中继器以中继本地 XC-20 代币和中继操作本身。

要创建批量交易并将其包装在要在 Moonbeam 上执行的远程 EVM 调用中，您需要执行以下步骤：

    1. 创建本地 XC-20、[Wormhole 中继器](https://github.com/wormhole-foundation/example-token-bridge-relayer/blob/main/evm/src/token-bridge-relayer/TokenBridgeRelayer.sol){target=_blank} 和 [Batch Precompile](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/batch/Batch.sol){target=_blank} 的合约实例。为此，您需要每个合约的 ABI 和 Wormhole 中继器的地址。您可以使用 [xLabs 中继器](https://xlabs.xyz/){target=_blank}:

        === "Moonbeam"
        ```text
        0xcafd2f0a35a4459fa40c0517e17e6fa2939441ca
        ```
        === "Moonbase Alpha"
        ```text
        0x9563a59c15842a6f322b10f69d1dd88b41f2e97b
        ```

2. 使用 Ether 的 `encodeFunctionData` 函数获取批量交易中两个调用的编码调用数据：`approve` 交易和 `transferTokensWithRelay` 交易
3. 将两个交易合并成一个批量交易，并使用 Ether 的 `encodeFunctionData` 获取批量交易的编码调用数据
4. 使用批量交易的编码调用数据，通过 `ethereumXcm.transact` extrinsic 创建远程 EVM 调用，它接受 `xcmTransaction` 作为参数。有关更多信息，请参阅 [远程 EVM 调用文档](builders/interoperability/xcm/remote-execution/remote-evm-calls/#ethereum-xcm-pallet-interface){target=_blank}

在 `build-remote-calldata.js` 文件中，添加以下代码：

```js title="build-remote-calldata.js"
--8<-- 'code/builders/interoperability/mrl/build-remote-calldata.js'
```

#### 构建远程 EVM 调用的 XCM 消息 {: #build-xcm-message-for-remote-evm-call }

接下来，您需要创建 extrinsic 以将远程 EVM 调用发送到 Moonbeam。为此，您需要发送一条 XCM 消息，以便 [`Transact`](/builders/interoperability/xcm/core-concepts/instructions/#transact){target=_blank} XCM 指令能够成功执行。最常见的方法是通过 `polkadotXcm.send`，并配合使用 [`WithdrawAsset`](/builders/interoperability/xcm/core-concepts/instructions/#withdraw-asset){target=_blank}、[`BuyExecution`](/builders/interoperability/xcm/core-concepts/instructions/#buy-execution){target=_blank} 和 [`Transact`](/builders/interoperability/xcm/core-concepts/instructions/#transact){target=_blank} 指令。[`RefundSurplus`](/builders/interoperability/xcm/core-concepts/instructions/#refund-surplus){target=_blank} 和 [`DepositAsset`](/builders/interoperability/xcm/core-concepts/instructions/#deposit-asset){target=_blank} 也可以用于确保没有资产被困住，但它们在技术上是可选的。

在 `build-remote-evm-call.js` 文件中，添加以下代码：

```js title="build-remote-evm-call.js"
--8<-- 'code/builders/interoperability/mrl/build-remote-evm-call.js'
```

#### 构建批量外部调用 {: #build-batch-extrinsic }

为了确保 `xTokens.transferMultiassets` 和 `polkadotXcm.send` 交易一起发送，您可以使用 `utility.batchAll` 将它们批量处理。这有助于确保资产转移发生在 EVM 交易之前，这是一个必要的区别。遗憾的是，这可能会随着未来的 XCM 更新而发生变化。

在 `send-batch-transaction.js` 文件中，添加以下代码：

```js title="send-batch-transaction.js"
--8<-- 'code/builders/interoperability/mrl/send-batch-transaction.js'
```

如果您想查看一个完全实现此功能的示例项目，可以在 [GitHub 存储库](https://github.com/jboetticher/mrl-mono){target=\_blank} 中找到一个示例。

重要的是要注意，并非每个平行链都以允许此路径的方式实现 X-Tokens 和其他 pallets。基于 Substrate 的链非常灵活，以至于不存在标准。如果您认为您的平行链不支持此路径，请在 [Moonbeam 论坛](https://forum.moonbeam.network){target=\_blank} 上和 Wormhole 团队提供替代解决方案。

### 通过 Wormhole 提供的代币 {: #tokens-available-through-wormhole }

虽然 Wormhole 在技术上能够跨链桥接任何代币，但中继器不会支持每种代币的费用。可以通过 Wormhole 的 MRL 解决方案桥接的 ERC-20 资产取决于 [xLabs 中继器](https://xlabs.xyz){target=\_blank} 接收的代币量。Moonbeam 和 Moonbase Alpha 可用的代币在下表中列出：

=== "Moonbeam"

    |    代币名称     | 符号 | 小数位数 |                  地址                   |
    |:-----------------:|:------:|:--------:|:------------------------------------------:|
    |   Wrapped AVAX    | wAVAX  |    18    | 0xd4937A95BeC789CC1AE1640714C61c160279B22F |
    |  Wrapped Bitcoin  |  wBTC  |    8     | 0xE57eBd2d67B462E9926e04a8e33f01cD0D64346D |
    |    Wrapped BNB    |  wBNB  |    18    | 0xE3b841C3f96e647E6dc01b468d6D0AD3562a9eeb |
    | Celo 原生资产 |  CELO  |    18    | 0xc1a792041985F65c17Eb65E66E254DC879CF380b |
    |  Dai 稳定币   |  DAI   |    18    | 0x06e605775296e851FF43b4dAa541Bb0984E9D6fD |
    | Wrapped Ethereum  |  wETH  |    18    | 0xab3f0245B83feB11d15AAffeFD7AD465a59817eD |
    |  Wrapped Fantom   |  wFTM  |    18    | 0x609AedD990bf45926bca9E4eE988b4Fb98587D3A |
    |   Wrapped GLMR    | wGLMR  |    18    | 0xAcc15dC74880C9944775448304B263D191c6077F |
    |   Wrapped Matic   | wMATIC |    18    | 0x82DbDa803bb52434B1f4F41A6F0Acb1242A7dFa3 |
    |    Wrapped SOL    |  SOL   |    9     | 0x99Fec54a5Ad36D50A4Bba3a41CAB983a5BB86A7d |
    |        Sui        |  SUI   |    9     | 0x484eCCE6775143D3335Ed2C7bCB22151C53B9F49 |
    |    Tether USD     |  USDT  |    6     | 0xc30E9cA94CF52f3Bf5692aaCF81353a27052c46f |
    |  USDC (Wormhole)  |  USDC  |    6     | 0x931715FEE2d06333043d11F658C8CE934aC61D0c |

=== "Moonbase Alpha"

    |        代币名称        | 符号 | 小数位数 |                  地址                   |
    |:------------------------:|:------:|:--------:|:------------------------------------------:|
    |       Wrapped Avax       | wAVAX  |    18    | 0x2E8afeCC19842229358f3650cc3F091908dcbaB4 |
    |       Wrapped BNB        |  wBNB  |    18    | 0x6097E80331B0c6aF4F74D7F2363E70Cb2Fd078A5 |
    |    Celo 原生资产     |  CELO  |    18    | 0x3406a9b09adf0cb36DC04c1523C4b294C6b79513 |
    |      Dai 稳定币      |  DAI   |    18    | 0xc31EC0108D8e886be58808B4C2C53f8365f1885D |
    |      Wrapped Ether       |  wETH  |    18    | 0xD909178CC99d318e4D46e7E66a972955859670E1 |
    | Wrapped Ether (Wormhole) |  wETH  |    18    | 0xd27d8883E31FAA11B2613b14BE83ad8951C8783C |
    |      Wrapped Fantom      |  wFTM  |    18    | 0x566c1cebc6A4AFa1C122E039C4BEBe77043148Ee |
    |      Wrapped Matic       | wMATIC |    18    | 0xD2888f015BcB76CE3d27b6024cdEFA16836d0dbb |
    |           Sui            |  SUI   |    9     | 0x2ed4B5B1071A3C676664E9085C0e3826542C1b27 |
    |           USDC           |  USDC  |    6     | 0x6533CE14804D113b1F494dC56c5D60A43cb5C3b5 |

请花时间使用 [Wormhole 资产验证器](https://portalbridge.com/#/token-origin-verifier){target=_blank} 验证这些资产是否仍然是 Moonbeam 上的 Wormhole 资产。

--8<-- 'text/_disclaimers/third-party-content.md'
