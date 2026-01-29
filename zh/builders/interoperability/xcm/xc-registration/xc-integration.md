---
title: 打开跨链通道
description: 了解如何通过基于 Moonbeam 的网络建立跨链集成。 包括打开和接受 HRMP 通道以及注册资产。
categories: XCM, Integrations
---

# 如何建立与 Moonbeam 的 XC 集成

## 简介 {: #introduction }

在跨链消息传递（XCMP）仍在开发期间，已经实现了一个过渡协议，称为水平中继路由消息传递（HRMP）。它与 XCMP 具有相同的接口和功能，但消息会存储在中继链上并从中继链读取；而在 XCMP 中，中继链只存储与消息相关的元数据。由于 HRMP 的所有消息都需要通过中继链传递，因此它对资源的需求更高。一旦 XCMP 实现，HRMP 将被逐步淘汰。

所有与 Moonbeam 的 XCMP 通道集成都是单向的，这意味着消息只会沿一个方向流动。如果链 A 向链 B 发起通道，那么链 A 只能向 B 发送消息，而 B 无法向 A 回发消息。因此，如果希望两条链之间可以双向发送消息，链 B 也需要向链 A 发起通道。

在打开 XCMP（或 HRMP）通道之后，双方链上的对应资产需要先在对方链上注册，才能进行转移。要查看如何注册资产的分步说明，请参阅[如何注册跨链资产](/builders/interoperability/xcm/xc-registration/assets/){target=\\_blank}指南。

本指南将介绍在一条平行链与基于 Moonbeam 的网络之间打开并接受 HRMP 通道的流程。此外，本指南还提供创建一个批量提案的必要步骤，用于将“打开并接受通道”和“在 Moonbeam 上注册资产”合并为单个提案。

本指南中的所有示例都使用一个用于简化整个流程的 CLI 工具，您可以在 [xcm-tools GitHub 仓库](https://github.com/Moonsong-Labs/xcm-tools){target=\\_blank} 中找到。

```bash
git clone https://github.com/Moonsong-Labs/xcm-tools && \
cd xcm-tools && \
yarn
```

## Moonbase Alpha XCM 集成概述 {: #moonbase-alpha-xcm }

Moonriver/Moonbeam XCM 集成的第一步是通过 Alphanet 中继链与 Moonbase Alpha TestNet 集成。然后在进行 Moonbeam 之前，必须完成 Moonriver 集成（如果适用）。

开始使用 Moonbase Alpha 的整个过程可以概括如下：

1. 使用 Alphanet 中继链[同步节点](#sync-a-node)
2. 在 Alphanet 中继链上[计算您的平行链主权账户](#calculate-and-fund-the-parachain-sovereign-account)
3. 一旦您的节点完全同步，请通过 [Telegram](https://t.me/Moonbeam_Official){target=\_blank} 或 [Discord](https://discord.com/invite/PfpUATX){target=\_blank} 与 Moonbeam 团队联系，以便该团队可以将您的平行链加入到中继链上。提供以下信息以进行加入：
   - WASM/Genesis head hash
   - 您的平行链 ID
   - 您的主权账户地址。Moonbeam 团队将在中继链级别为您的主权账户提供资金。此步骤是创建 HRMP 通道所必需的
   - 编码的调用数据，用于打开到您的平行链的 HRMP 通道，接受传入的 HRMP 通道，以及[注册资产](/builders/interoperability/xcm/xc-registration/assets/#register-xc-20s){target=\_blank}（如果适用）。这将通过 sudo 执行
4. 从您的平行链打开到 Moonbase Alpha 的 HRMP 通道（通过 sudo 或通过治理）
5. 接受来自 Moonbase Alpha 的 HRMP 通道（通过 sudo 或通过治理）
6. （可选）在您的平行链上[注册 Moonbase Alpha 的 DEV 令牌](/builders/interoperability/xcm/xc-registration/assets/#register-moonbeam-native-assets){target=\_blank}
7. 为了测试 XCM 集成，请发送一些令牌到：

   ```
   AccountId (Encoded): 5GWpSdqkkKGZmdKQ9nkSF7TmHp6JWt28BMGQNuG4MXtSvq3e
   Decoded (32-Bytes):  0xc4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a063
   ```

8. 测试 XCM 集成

![Moonbase Alpha 跨链集成过程](/images/builders/interoperability/xcm/xc-registration/xc-integration/channels-1.webp)

一旦所有这些步骤都完成，并且两个团队都成功测试了资产转移，您的平行链令牌就可以添加到 [Moonbeam DApp](https://apps.moonbeam.network/moonbase-alpha){target=\_blank} 的**跨链资产**部分。如果存款和取款按预期工作，则可以开始与 Moonriver 集成。

### 同步节点 {: #sync-a-node }

要同步节点，您可以使用 [Alphanet 中继链规范](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam/refs/heads/master/specs/alphanet/westend-embedded-specs-v8.json){target=\_blank}（注意：中继链是基于 Westend 的，可能需要一天时间才能同步）。

作为参考，您可以使用 [Moonbase Alpha 的规范文件](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam/runtime-1103/specs/alphanet/parachain-embedded-specs-v8.json){target=\_blank}。您需要将其适配到您的链。

还有一些 [Alphanet 生态系统中继链的快照](https://www.certhum.com/moonbase-databases){target=\_blank}，您可以使用它们快速入门，这些快照由社区提供。

### 计算和资助平行链主权账户 {: #calculate-and-fund-the-parachain-sovereign-account }

您可以使用[xcm-tools 存储库中的脚本](https://github.com/Moonsong-Labs/xcm-tools){target=\_blank}计算主权账户信息。要运行该脚本，您必须提供平行链 ID 和关联的中继链的名称。

您可以在[中继链的 Polkadot.js Apps 页面](https://polkadot.js.org/apps/?rpc=wss://relay.api.moonbase.moonbeam.network#/parachains){target=\_blank}上找到已使用的平行链 ID。

中继链的可接受值包括 `polkadot`（默认）、`kusama` 和 `moonbase`。

例如，可以使用以下方法获取 Moonbase Alpha 的中继链和其他平行链的主权账户：

```bash
yarn calculate-sovereign-account --p 1000 --r moonbase
```

这应该会产生以下响应：

```
Sovereign Account Address on Relay: 0x70617261e8030000000000000000000000000000000000000000000000000000
Sovereign Account Address on other Parachains (Generic): 0x7369626ce8030000000000000000000000000000000000000000000000000000
Sovereign Account Address on Moonbase Alpha: 0x7369626ce8030000000000000000000000000000
```

## Moonriver 和 Moonbeam XCM 集成概述 {: #moonriver-moonbeam }

从技术角度来看，创建与 Moonriver 和 Moonbeam 的 HRMP 通道的过程几乎相同。但是，与 Moonbeam 社区的互动至关重要，并且是提案获得通过的必要条件。

在开始之前，请查看社区投票通过的 [Moonriver](https://moonriver.polkassembly.io/referenda/0){target=\_blank} 和 [Moonbeam](https://moonbeam.polkassembly.io/proposal/21){target=\_blank} 的 HRMP 通道指南。

该过程可以总结为以下步骤：

1. 从您的链打开（或确保存在）到 Moonriver/Moonbeam 的 HRMP 通道。可以选择注册 MOVR/GLMR
2. 创建 [两个 Moonbeam 社区论坛帖子](#create-forum-posts)，其中包含 XCM 集成的一些关键信息：
   - 一个 [XCM 披露帖子](/builders/interoperability/xcm/xc-registration/forum-templates/#xcm-disclosure)，您将在其中提供有关项目、代码库和社交网络渠道的一些披露信息
   - 一个 [XCM 提案帖子](/builders/interoperability/xcm/xc-registration/forum-templates/#xcm-proposals)，您将在其中提供有关提案本身的一些技术信息
3. 在 Moonbeam/Moonriver 上创建一个批量提案，以：

   1. 接受传入的 HRMP 通道
   2. 建议打开从 Moonriver/Moonbeam 发出的传出 HRMP 通道
   3. 将资产注册为 [XC-20 代币](/builders/interoperability/xcm/xc20/overview/){target=\_blank}（如果适用）

   提案应在 [OpenGov](/learn/features/governance/#opengov){target=\_blank} 的 General Admin Track 中完成。正常的颁布时间如下：

   - **Moonriver** - 决策期约为 {{ networks.moonriver.governance.tracks.general_admin.decision_period.time }}，颁布时间至少为 {{ networks.moonriver.governance.tracks.general_admin.min_enactment_period.time }}
   - **Moonbeam** - 决策期约为 {{ networks.moonbeam.governance.tracks.general_admin.decision_period.time }}，颁布时间至少为 {{ networks.moonbeam.governance.tracks.general_admin.min_enactment_period.time }}

4. 在连接的平行链上接受来自 Moonriver/Moonbeam 的 HRMP 通道
5. 交换价值 50 美元的代币以测试 XCM 集成。请将代币发送至：

   ```
   AccountId (Encoded): 5E6kHM4zFdH5KEJE3YEzX5QuqoETVKUQadeY8LVmeh2HyHGt
   Decoded (32-Bytes):  0x5a071f642798f89d68b050384132eea7b65db483b00dbb05548d3ce472cfef48
   ```

6. 提供 MOVR/GLMR 的以太坊风格地址
7. 使用提供的代币测试 XCM 集成

下图描述了在 Moonbeam 上成功提案的此过程的示例。

![Moonbeam 和 Moonriver 跨链集成过程](/images/builders/interoperability/xcm/xc-registration/xc-integration/channels-2.webp)

成功完成这些步骤后，可以协调营销工作，并且可以将 Moonriver/Moonbeam 上的新 XC-20 添加到 [Moonbeam DApp](https://apps.moonbeam.network){target=\_blank} 的 **Cross Chain Assets** 部分。

### 创建论坛帖子 {: #create-forum-posts }

要在 [Moonbeam 社区论坛](https://forum.moonbeam.network){target=\_blank} 上创建论坛帖子，您需要确保将帖子添加到正确的类别并添加相关内容。 有关要遵循的通用指南和模板，请参阅 [Moonbeam 社区论坛 XCM 集成模板](/builders/interoperability/xcm/xc-registration/forum-templates/#){target=\_blank} 页面。

## 创建 HRMP 通道 {: #create-an-hrmp-channel }

在可以将任何消息从您的平行链发送到 Moonbeam 之前，必须先打开一个 HRMP 通道。要创建 HRMP 通道，您需要向中继链发送一条 XCM 消息，该消息将请求通过中继链打开通道。该消息需要包含**至少**以下 XCM 指令：

1. [WithdrawAsset](/builders/interoperability/xcm/core-concepts/instructions/#withdraw-asset){target=\_blank} - 从原始平行链的 Sovereign 账户（在中继链中）取出资金到一个持有状态
2. [BuyExecution](/builders/interoperability/xcm/core-concepts/instructions/#buy-execution){target=\_blank} - 从中继链购买执行时间以执行 XCM 消息
3. [Transact](/builders/interoperability/xcm/core-concepts/instructions/#transact){target=\_blank} - 提供要执行的中继链调用数据。在这种情况下，调用将是 HRMP extrinsic

!!! note
    您可以添加 [DepositAsset](/builders/interoperability/xcm/core-concepts/instructions/#deposit-asset){target=\_blank} 以在执行后退还剩余资金。如果未提供此选项，则不会进行退款。此外，您还可以在 [Transact](/builders/interoperability/xcm/core-concepts/instructions/#transact){target=\_blank} 之后添加 [RefundSurplus](/builders/interoperability/xcm/core-concepts/instructions/#refund-surplus){target=\_blank} 以获取未用于 Transact 的任何剩余资金。但是您必须计算支付额外 XCM 指令的执行成本是否值得。

要将这些 XCM 消息发送到中继链，通常会调用 [Polkadot XCM Pallet](https://github.com/paritytech/polkadot-sdk/tree/{{ polkadot_sdk }}/polkadot/xcm/pallet-xcm){target=\_blank}。Moonbeam 还有一个 [XCM Transactor Pallet](/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/){target=\_blank}，它将该过程简化为抽象 XCM 消息构造器的调用。

您可能会使用 Polkadot.js Apps 为 HRMP 操作生成 calldata，但 [xcm-tools GitHub 存储库](https://github.com/Moonsong-Labs/xcm-tools){target=\_blank} 可以为您构建它，并且是此过程的推荐工具。

```bash
git clone https://github.com/Moonsong-Labs/xcm-tools && \
cd xcm-tools && \
yarn
```

xcm-tools 存储库有一个用于 HRMP 交互的特定脚本，称为 [`hrmp-channel-manipulator.ts`](https://github.com/Moonsong-Labs/xcm-tools/blob/main/scripts/hrmp-channel-manipulator.ts){target=\_blank}。此命令为特定的 HRMP 操作生成编码的 calldata，前提是它具有正确的详细信息。该脚本使用 DepositAsset XCM 指令构建 XCM 消息，但不使用 RefundSurplus。

编码的 calldata 然后用于提交将执行 HRMP 操作的治理提案。所有与 HRMP 相关的提案都应分配给 General Admin Track。

`hrmp-channel-manipulator.ts` 脚本旨在是通用的。它应该适用于包含 Polkadot XCM Pallet 的任何链，尽管它会尝试首先使用 XCM Transactor Pallet 的 `hrmpManage` extrinsic。如果链上不存在 XCM Transactor Pallet，将使用 Polkadot XCM Pallet 的 `send` extrinsic。**请注意，它期望 pallet 名称为 `polkadotXcm`，因为 extrinsic 将构建为 `api.tx.polkadotXcm.send()`**。对于 Moonbeam，General Admin Track 无法执行 `polkadotXcm.send` 调用，因此必须使用 `xcmTransactor.hrmpManage` extrinsic。

以下各节将介绍在基于 Moonbeam 的网络中创建和接受打开通道请求的步骤，但它们也可以适用于您的平行链。

### 在 Moonbeam 上接受 HRMP 通道 {: #accept-an-hrmp-channel-on-moonbeam }

当平行链收到来自另一个平行链的传入 HRMP 通道打开请求时，它必须向中继链发出信号，表明它接受此通道，然后才能使用该通道。这需要一个 XCM 消息发送到中继链，其中包含调用 HRMP Pallet 和 `hrmpAcceptOpenChannel` extrinsic 的 Transact 指令。

幸运的是，[xcm-tools](https://github.com/Moonsong-Labs/xcm-tools){target=\_blank} GitHub 仓库的 `hrmp-channel-manipulator.ts` 脚本可以为您构建 XCM！

--8<-- 'zh/text/builders/interoperability/xcm/xc-registration/xc-integration/hrmp-manipulator-args.md'

运行以下命令将提供编码后的 calldata，以接受 Moonbeam 网络上的打开 HRMP 通道请求。将 `YOUR_PARACHAIN_ID` 替换为您平行链的 ID：

=== "Moonbeam"

    ```bash
yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonbeam.network  \
    --relay-ws-provider wss://rpc.polkadot.io \
    --hrmp-action accept
    ```

=== "Moonriver"

    ```bash
yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonriver.moonbeam.network  \
    --relay-ws-provider wss://kusama-rpc.polkadot.io \
    --hrmp-action accept
    ```

=== "Moonbase Alpha"

    ```bash
yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonbase.moonbeam.network  \
    --relay-ws-provider wss://relay.api.moonbase.moonbeam.network \
    --hrmp-action accept
    ```

!!! note
    您可以通过更改 `parachain-ws-provider` 来使脚本适应您的平行链。

运行脚本后，您将看到如下所示的输出：

--8<-- 'code/builders/interoperability/xcm/xc-registration/integration/terminal/accept.md'

如上所示运行脚本将返回编码后的 calldata，以接受 HRMP 通道。您还可以使用该脚本在链上为给定的 HRMP 操作创建并提交预映像和提案。对于 Moonbeam 和 Moonriver，提案必须通过 General Admin Track 提交。

请参阅 [README](https://github.com/Moonsong-Labs/xcm-tools/tree/main#hrmp-manipulator-script){target=\_blank} 以获取参数的完整列表，包括可选参数，以及有关如何使用 HRMP-manipulator 脚本的示例。

如果您计划将交易与其他调用批量处理，请复制生成的 calldata，以便稍后在使用 [批量交易](#batch-actions-into-one) 脚本时使用。

### 从 Moonbeam 打开 HRMP 通道 {: #open-an-hrmp-channel-from-moonbeam }

平行链需要双向 HRMP 通道才能相互发送 XCM。建立 HRMP 通道的第一步是创建打开通道请求。这需要一个带有 Transact 指令的 XCM 消息到中继链，该指令调用 HRMP Pallet 和 `hrmpInitOpenChannel` extrinsic。

幸运的是，[xcm-tools](https://github.com/Moonsong-Labs/xcm-tools){target=\_blank} GitHub 存储库的 `hrmp-channel-manipulator.ts` 脚本可以为您构建 XCM！

--8<-- 'zh/text/builders/interoperability/xcm/xc-registration/xc-integration/hrmp-manipulator-args.md'

运行以下命令将提供编码的 calldata，以从 Moonbeam 网络创建 HRMP 通道请求。最大消息大小和容量值可以从中继链的 Configuration Pallet 和 `activeConfig` extrinsic 获取。将 `YOUR_PARACHAIN_ID` 替换为您的平行链的 ID：

=== "Moonbeam"

    ```bash
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonbeam.network  \
    --relay-ws-provider wss://rpc.polkadot.io \
    --max-capacity 1000 --max-message-size 102400 \
    --hrmp-action open
    ```

=== "Moonriver"

    ```bash
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonriver.moonbeam.network  \
    --relay-ws-provider wss://kusama-rpc.polkadot.io \
    --max-capacity 1000 --max-message-size 102400 \
    --hrmp-action open
    ```

=== "Moonbase Alpha"

    ```bash
    yarn hrmp-manipulator --target-para-id YOUR_PARACHAIN_ID \
    --parachain-ws-provider wss://wss.api.moonbase.moonbeam.network  \
    --relay-ws-provider wss://relay.api.moonbase.moonbeam.network \
    --max-capacity 1000 --max-message-size 102400 \
    --hrmp-action open
    ```

!!! note
     您可以通过更改 `parachain-ws-provider` 来调整脚本以适应您的平行链。

运行脚本后，您将看到如下所示的输出：

--8<-- 'code/builders/interoperability/xcm/xc-registration/integration/terminal/propose.md'

如上所示运行脚本将返回编码的 calldata，以打开 HRMP 通道。您还可以使用该脚本为给定的 HRMP 操作创建和提交链上的 preimage 和提案。对于 Moonbeam 和 Moonriver，提案必须通过 General Admin Track 提交。

有关参数（包括可选参数）的完整列表以及如何使用 HRMP-manipulator 脚本的示例，请参阅 [README](https://github.com/Moonsong-Labs/xcm-tools/tree/main#hrmp-manipulator-script){target=\_blank}。

如果您计划将交易与其他调用批量处理，请复制生成的 calldata，以便以后在使用 [批量交易](#batch-actions-into-one) 脚本时使用。

## 将操作批量处理为一个 {: #batch-actions-into-one }

在平行链上完成 XCM 过程最有效的方法是将所有交易批量处理在一起。[xcm-tools 存储库](https://github.com/Moonsong-Labs/xcm-tools){target=\_blank}提供了一个脚本，可以将 extrinsic 调用批量处理为单个调用，从而只需要一个交易。如果您的平行链想要同时打开一个 HRMP 通道并注册一个资产，这将很有帮助。在 Moonbeam 网络上提议通道注册时，**应该使用**此方法。

如果您除了建立通道之外还要注册资产，请参阅[如何注册跨链资产](/builders/interoperability/xcm/xc-registration/assets/){target=\_blank}指南，以了解如何生成资产注册所需的编码调用数据。

下图描述了将所有交易批量处理为一个的过程。

![批量 XCM 集成过程](/images/builders/interoperability/xcm/xc-registration/xc-integration/channels-3.webp)

您现在将使用编码的调用数据输出，用于打开通道、接受通道和注册资产，并将它们插入到以下命令中，以将批量提案发送到 democracy。

您可以为您要批处理的每个调用添加一个 `--call "INSERT_CALL"`。在运行命令之前，请替换以下值：

- `OPEN_CHANNEL_CALL` 是 SCALE 编码的调用数据，用于[从 Moonbeam 打开到您的平行链的 HRMP 通道](#open-an-hrmp-channel-from-moonbeam)
- `ACCEPT_INCOMING_CALL` 是 SCALE 编码的调用数据，用于[从您的平行链接受通道请求](#accept-an-hrmp-channel-on-moonbeam)
- `REGISTER_ASSET_CALL` 是 SCALE 编码的调用数据，用于[注册跨链资产](/builders/interoperability/xcm/xc-registration/assets/#register-xc-20s){target=\_blank}。如果您有多个资产要在 Moonbeam 上注册，您可以包含额外的注册 SCALE 编码的调用数据，并带有额外的 `--call` 标志

=== "Moonbeam"

    ```bash
yarn generic-call-propose -w wss://wss.api.moonbeam.network \
    --call "OPEN_CHANNEL_CALL" \
    --call "ACCEPT_INCOMING_CALL" \
    --call "REGISTER_ASSET_CALL" \
    ```

=== "Moonriver"

    ```bash
yarn generic-call-propose -w wss://wss.api.moonriver.moonbeam.network \
    --call "OPEN_CHANNEL_CALL" \
    --call "ACCEPT_INCOMING_CALL" \
    --call "REGISTER_ASSET_CALL" \
    ```

=== "Moonbase Alpha"

    ```bash
yarn generic-call-propose -w wss://wss.api.moonbase.moonbeam.network  \
    --call "OPEN_CHANNEL_CALL" \
    --call "ACCEPT_INCOMING_CALL" \
    --call "REGISTER_ASSET_CALL" \
    ```

!!! note
    您可以通过更改 `parachain-ws-provider` 来重新调整您的平行链的脚本。

有了编码的调用数据，您就可以提交治理提案。对于 Moonbeam 和 Moonriver，您必须将提案分配给 General Admin Track。建议您熟悉[基于 Moonbeam 的网络上的 OpenGov：Governance v2 流程](/learn/features/governance/#opengov){target=\_blank}。

如果您想直接从 CLI 发送治理提案，您需要使用以下附加标志：

```bash
--account-priv-key YOUR_PRIVATE_KEY \
--send-preimage-hash true \
--send-proposal-as v2 \
--track '{ "Origins": "GeneralAdmin" }'
```

对于 Moonbase Alpha，您无需提供私钥或通过治理。相反，您可以使用 `--sudo` 标志，并将输出提供给 Moonbeam 团队，以便可以通过 sudo 快速添加资产和通道。

请随时查看此脚本的[其他标志](#additional-flags-xcm-tools)。

## XCM-Tools 的附加标志 {: #additional-flags-xcm-tools }

[xcm-tools GitHub 仓库](https://github.com/Moonsong-Labs/xcm-tools){target=\_blank} 及其大多数函数都可以通过一些附加标志来调用，这些标志会在所采取的操作周围创建一些包装器。例如，您可能希望将 XCM 消息的发送包装在 sudo 中，或者通过民主提案。

以下是可与该脚本一起使用的完整选项：

|         标志         |             类型              |                                                                                    描述                                                                                     |
| :------------------: | :---------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|   account-priv-key   |            字符串             |                                   （send-proposal-as，send-preimage-hash 所需）用于发送交易的帐户的私钥                                    |
|         sudo         |            布尔值            |                是否将外部调用数据包装在 `sudo.sudo` 外部调用中。如果存在 `account-priv-key`，它将尝试发送交易                 |
|  send-preimage-hash  |            布尔值            |                                                     是否将编码的外部调用数据作为预映像提交并检索其哈希                                                     |
|   send-proposal-as   | democracy/council-external/v2 |                                   是否通过民主或理事会（Governance v1）或 OpenGov（Governance v2）发送编码的外部调用数据                                    |
| collective-threshold |            数字             |                                                (council-external 所需) 理事会决定提案的阈值                                                 |
|        delay         |            数字             |                                                (v2 所需) OpenGovV2 提案执行延迟的区块数                                                |
|        track         | 字符串（JSON 编码的来源）  | （v2 所需）OpenGovV2 提案的 JSON 编码来源。对于 Moonbeam 网络：“Root”、“WhitelistedCaller”、“GeneralAdmin”、“ReferendumCanceller”、“ReferendumKiller” |
|       at-block       |            数字             |            是否将外部调用数据包装在 `scheduler.schedule` 外部调用中。将来应该安排执行操作的区块            |
|     fee-currency     |    字符串 (多重定位)     |                                      （使用 XCM Transactor 的非 Moonbeam 链所需）中继链资产的多重定位                                       |

!!! note
    必须像这样指定 track 选项：`'{ "Origins": "INSERT_ORIGIN" }'`，您可以在其中插入以下任何一个作为来源：“Root”、“WhitelistedCaller”、“GeneralAdmin”、“ReferendumCanceller”、“ReferendumKiller”。
