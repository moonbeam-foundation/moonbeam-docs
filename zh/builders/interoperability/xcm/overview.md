---
title: 跨共识消息传递 (XCM)
description: 跨共识消息传递 (XCM) 的工作原理概述，以及开发人员如何利用 Polkadot/Kusama XCM 来获取新资产。
categories: Basics, XCM
---

# 跨共识消息传递 (XCM)

## 简介 {: #introduction }

[Polkadot 的架构](https://wiki.polkadot.com/learn/learn-architecture/){target=_blank} 允许平行链彼此原生互操作，从而实现任何类型数据或资产的跨区块链转移。

为此，[跨共识消息（XCM）](https://wiki.polkadot.com/learn/learn-xcm/){target=_blank} 格式定义了一种语言，用于描述两个互操作区块链之间的消息传输应如何执行。XCM 并非 Polkadot 专用，因为它旨在成为不同共识系统之间的通用且可扩展的语言。

本页是对 XCM 和其他相关元素的简要介绍和概述。更多信息可以在 [Polkadot 的 Wiki](https://wiki.polkadot.com/learn/learn-xcm/){target=_blank} 中找到。

如果您想跳转到更多与 XCM 相关的内容，请随时查看以下页面：

- [**核心 XCM 概念**](/builders/interoperability/xcm/core-concepts/){target=_blank} - 了解与 [XCM 指令](/builders/interoperability/xcm/core-concepts/instructions/){target=_blank}、[多位置](/builders/interoperability/xcm/core-concepts/multilocations/){target=_blank} 和 [XCM 费用](/builders/interoperability/xcm/core-concepts/weights-fees/){target=_blank} 相关的主题
- [**XC 注册**](/builders/interoperability/xcm/xc-registration/){target=_blank} - 完成[使用 Moonbeam 打开 XCM 通道](/builders/interoperability/xcm/xc-registration/xc-integration/){target=_blank}以及如何[将 Polkadot 原生资产注册为 XC-20](/builders/interoperability/xcm/xc-registration/assets/){target=_blank} 的过程
- [**XC-20**](/builders/interoperability/xcm/xc20/){target=_blank} - 阅读此 Moonbeam 独有资产类别的[概述](/builders/interoperability/xcm/xc20/overview/){target=_blank}，并了解如何[与 XC-20 交互](/builders/interoperability/xcm/xc20/interact/){target=_blank}以及如何[通过 XCM 发送它们](/builders/interoperability/xcm/xc20/send-xc20s/){target=_blank}
- [**通过 XCM 进行远程执行**](/builders/interoperability/xcm/remote-execution/){target=_blank} - 掌握与通过 XCM 进行远程执行相关的所有概念，从[高级概述](/builders/interoperability/xcm/remote-execution/overview/){target=_blank}开始，然后是 [计算来源](/builders/interoperability/xcm/remote-execution/computed-origins/){target=_blank}，最后是[通过 XCM 进行的远程调用](/builders/interoperability/xcm/remote-execution/substrate-calls/){target=_blank}和[通过 XCM 进行的远程 EVM 调用](/builders/interoperability/xcm/remote-execution/remote-evm-calls/){target=_blank}
- [**XCM SDK**](https://moonbeam-foundation.github.io/xcm-sdk/latest/){target=_blank} - 了解如何[使用 Moonbeam 的 XCM SDK](https://moonbeam-foundation.github.io/xcm-sdk/latest/example-usage/xcm/){target=_blank}
- **XCM 调试和工具** - 了解如何通过[发送和执行通用 XCM 消息](/builders/interoperability/xcm/send-execute-xcm/){target=_blank}来测试一些 XCM 场景，或者如何使用 [XCM 实用程序预编译](/builders/interoperability/xcm/xcm-utils/){target=_blank} 来直接在 EVM 中访问 XCM_related 实用程序函数

## 通用 XCM 定义 {: #general-xcm-definitions }

--8<-- 'text/builders/interoperability/xcm/general-xcm-definitions.md'
--8<-- 'text/builders/interoperability/xcm/general-xcm-definitions2.md'

## 通过 XCM 实现跨链传输协议 {: #xcm-transport-protocols }

XCM 实现了两种跨共识或传输协议，用于在其组成的平行链之间处理 XCM 消息，Moonbeam 便是其中之一：

- **垂直消息传递 (VMP)** — 一旦项目作为平行链加入，它将自动与中继链建立双向通信通道。因此，无需链注册。VMP 分为两种消息传递传输协议：

    * **向上消息传递 (UMP)** — 允许平行链向其中继链发送消息，例如从 Moonbeam 到 Polkadot
    * **向下消息传递 (DMP)** — 允许中继链将消息传递给其平行链之一，例如从 Polkadot 到 Moonbeam

- **跨链消息传递 (XCMP)** — 允许两个平行链交换消息，只要它们连接到同一个中继链。跨链交易使用基于 Merkle 树的简单排队机制来解决，以确保保真度。收集人（Collator）在平行链之间交换消息，而中继链验证人将验证消息传输是否发生

!!! note
    目前，在开发 XCMP 时，会实施一种权宜之计协议，称为水平中继路由消息传递 (HRMP)，其中消息存储在中继链中并从中读取。将来，完整的 XCMP 实现将会弃用它。

![垂直消息传递和跨链消息传递概述](/images/builders/interoperability/xcm/overview/overview-1.webp)

## 建立跨链通信 {: #channel-registration }

在两个链开始通信之前，必须打开一个消息通道。通道是单向的，这意味着从链 A 到链 B 的通道只会传递从 A 到 B 的消息。因此，必须打开两个通道才能来回发送消息。

当建立连接时，中继链和平行链之间的 XCM 通道会自动打开。但是，当平行链 A 想要与平行链 B 建立通信通道时，平行链 A 必须向其网络发送一个打开通道的外在函数。这个外在函数也是一个 XCM！

即使平行链 A 已经表达了与平行链 B 建立 XCM 通道的意图，但后者尚未向中继链发出接收来自平行链 A 的消息的信号。因此，为了建立一个已建立的通道，平行链 B 必须向中继链发送一个外在函数（一个 XCM）。接受通道的外在函数与前一个类似。但是，编码的调用数据仅包括新方法（接受通道）和发送者的平行链 ID（在本例中为平行链 A）。一旦两个平行链都同意，通道将在下一个时期内打开。

要了解有关通道注册过程的更多信息，请参阅[如何使用 Moonbeam 建立 XC 集成](/builders/interoperability/xcm/xc-registration/xc-integration/){target=_blank}指南。

![XCM 通道注册概述](/images/builders/interoperability/xcm/overview/overview-2.webp)

建立通道后，可以在平行链之间发送跨链消息。对于资产转移，资产需要先注册，然后才能通过 XCM 进行转移，可以通过将其内置到运行时作为常量或通过托盘来实现。Moonbeam 依靠 Substrate 托盘来处理资产注册，而无需运行时升级，从而使过程更加简单。

要了解如何在 Moonbeam 上注册资产以及将 Moonbeam 资产添加到另一个链所需的信息，请参阅[如何注册跨链资产](/builders/interoperability/xcm/xc-registration/assets/){target=_blank} 指南。

## Moonbeam 上的 XCM {: #moonbeam-and-xcm }

由于 Moonbeam 是 Polkadot 生态系统中的一个平行链，因此 XCM 最直接的实现方式之一是能够实现从 Polkadot 和其他平行链到 Moonbeam 的资产转移。这允许用户将其代币引入 Moonbeam 及其所有 dApp。

为此，Moonbeam 引入了 [XC-20s](/builders/interoperability/xcm/xc20/overview/){target=_blank}，它扩展了 Moonbeam 独特的以太坊兼容性功能。XC-20 允许 Polkadot 原生资产通过预编译合约以标准 [ERC-20 接口](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/balances-erc20/ERC20.sol){target=_blank} 表示。当这些资产在 Moonbeam 上注册后，它们可以设置为 XCM 执行费用资产。因此，当用户将此类资产转移到 Moonbeam 时，少量金额将用于支付 XCM 执行费用。

此外，部署到 Moonbeam 的 ERC-20 可以通过 XCM 发送到 Polkadot 生态系统中的其他链。因此，从开发人员的角度来看，XC-20 是一种 ERC-20 代币，其额外的好处是它是一种 XCM 跨链资产，并且 dApp 可以通过熟悉的 ERC-20 接口轻松支持它们。

![Moonbeam XC-20 XCM 与 Polkadot 的集成](/images/builders/interoperability/xcm/overview/overview-3.webp)

要通过 Moonbeam 在 Polkadot 生态系统中发送 XC-20，开发人员需要使用 [Polkadot XCM Pallet](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=_blank} 通过 Substrate API 进行传输，以及使用 [X-Tokens Precompile](/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/){target=_blank} 或 [XCM Precompile](/builders/interoperability/xcm/xc20/send-xc20s/eth-api/){target=_blank} 通过以太坊 API 进行传输。

Moonbeam 的另一个独特功能是能够从 EVM 智能合约启动 XCM 操作，或通过远程执行通过 XCM 消息调用其 EVM。这开启了一系列新的可能性，Moonbeam 上的合约可以通过 XCM 访问特定于平行链的功能，或者其他平行链生态系统可以使用 Moonbeam 上的 EVM 智能合约来扩展其功能。

以下部分提供了前面提到的主要用例的高级概述。

### Moonbeam 与 Polkadot 之间的 XCM 转移 {: #transfers-moonbeam-polkadot }

由于 Moonbeam 是 Polkadot 生态系统中的一个平行链，因此 XCM + VMP 的一个直接实现是从/到 Polkadot/Moonbeam 的 DOT 转移。为此，DOT 在 Moonbeam 上注册为 [_xcDOT_](https://moonscan.io/token/0xffffffff1fcacbd218edc0eba20fc2308c778080){target=_blank}。

Alice (Polkadot) 希望将一定数量的 DOT 从 Polkadot 转移到她在 Moonbeam 上的账户，名为 Alith。因此，她发起一个表达其意图的 XCM。对于此类转移，Moonbeam 在 Polkadot 上拥有一个主权账户。

因此，在 Polkadot 上执行 XCM 消息会将 DOT 的数量转移到 Moonbeam 在 Polkadot 上的主权账户。资产存入后，消息的第二部分将发送到 Moonbeam。

Moonbeam 将在本地执行 XCM 消息计划执行的操作。在这种情况下，它是铸造并将相同数量的 _xcDOT_ 转移到 Alice 定义的账户，在本例中为 Alith。在目标平行链中执行 XCM 的费用以被转移的资产（本例中为 _xcDOT_ ）支付。

![从 Relay Chain 到 Moonbeam 的转移](/images/builders/interoperability/xcm/overview/overview-4.webp)

请注意以下事项：

- Alice 和 Alith 账户可能不同。例如，Polkadot 的账户是 SR25519（或 ED25519），而 Moonbeam 的账户是 ECDSA（以太坊风格）账户。它们也可以有不同的所有者
- 在一定程度上存在信任，即一条链依赖另一条链来执行其 XCM 消息的一部分。这是在运行时级别编程的，因此可以轻松验证
- 在此示例中，_xcDOT_ 是 Moonbeam 在 Polkadot 上的主权账户中持有的原始 DOT 的包装表示。_xcDOT_ 可以随时在 Moonbeam 内转移，也可以按 1:1 的比例兑换 DOT（减去一些费用）

Alith 将她的 _xcDOT_ 存入流动资金池。接下来，Charleth 通过与该流动资金池进行交换获得了一些 _xcDOT_，并且他想将一些 _xcDOT_ 转移到 Charley 的 Polkadot 账户。因此，他发起一个表达其意图的 XCM。

因此，在 Moonbeam 上执行 XCM 消息会将 _xcDOT_ 的数量烧毁。资产烧毁后，消息的第二部分将发送到 Polkadot。

Polkadot 将在本地执行 XCM 消息计划执行的操作。在这种情况下，它是将从 Moonbeam 主权账户烧毁的相同数量的 _xcDOT_ 转移到 Charleth 定义的账户，在本例中为 Charley。

![从 Moonbeam 返回 Relay Chain 的转移](/images/builders/interoperability/xcm/overview/overview-5.webp)

### Moonbeam 与其他平行链之间的 XCM 转移 {: #transfers-moonbeam-other-parachains }

由于 Moonbeam 是 Polkadot 生态系统中的一个平行链，因此可以从 Moonbeam 和其他平行链进行 XCM 和 XCMP 资产转移的简单实现。本节概述了与 Polkadot/Moonbeam 的 XCM 相比的主要区别。

首要条件是平行链之间必须存在双向通道，并且被转移的资产必须在目标平行链中注册。只有当两个条件都满足时，才能在平行链之间发送 XCM。

然后，当 Alith (Moonbeam) 将一定数量的 GLMR 从 Moonbeam 转移到目标平行链中的另一个账户 (Alice) 时，代币将被发送到 Moonbeam 上由该目标平行链拥有的主权账户。

当 XCM 消息在目标平行链中执行时，预计这将铸造并将相同数量的 _xcGLMR_（跨链 GLMR）转移到由 Alith 定义的账户，在本例中为 Alice。在目标平行链中执行 XCM 的费用以转移的资产（本例中为 _xcGLMR_）支付。

![从 Moonbeam 到另一个平行链的转移](/images/builders/interoperability/xcm/overview/overview-6.webp)

如上一节所述，_xcGLMR_ 移回 Moonbeam 的过程类似。首先，XCM 消息执行会烧毁返回到 Moonbeam 的 _xcGLMR_ 数量。烧毁后，消息的剩余部分通过中继链发送到 Moonbeam。Moonbeam 将在本地执行 XCM 消息，并将 GLMR（与烧毁的 _xcGLMR_ 数量相同）从目标平行链主权账户转移到指定的地址。

### 其他链与 Moonbeam 之间的远程执行 {: #execution-chains-moonbeam }

如前所述，XCM 还支持从/到 Moonbeam 对 Polkadot 生态系统中的其他链进行远程执行。

与其他用例类似，在链之间进行远程执行之前，需要建立特定于 XCM 的通道。通道是通用的，因此它们可用于资产转移和远程执行。

另一个重要的组成部分是用于支付远程执行费用的资产。在 Moonbeam 上，当注册 XC-20 时，可以将其设置为 XCM 执行费用资产。因此，当将该 XC-20 转移到 Moonbeam 时，XCM 执行费用将从转移的金额中扣除。对于远程执行，用户可以在 XCM 消息中包含少量代币，以支付 XCM 执行费用。

Alice (Polkadot) 想要通过 Moonbeam 上的智能合约执行某个远程操作。因此，她发起了一个表达她意图的 XCM；她必须事先用 GLMR 或 _xcDOT_ 为她在 Moonbeam 上拥有的 XCM 执行帐户注资。

Moonbeam 将在本地执行 XCM 消息被编程执行的操作。在本例中，它是提取 Alice 决定的用于 XCM 执行费用的资产，并购买 Moonbeam 上的一些执行时间，以执行 Moonbeam EVM 上的智能合约调用。

您可以在[远程执行](/builders/interoperability/xcm/remote-execution/overview/){target=_blank}页面上详细了解该流程。
