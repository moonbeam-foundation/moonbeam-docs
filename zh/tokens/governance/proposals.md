---
title: 如何在 OpenGov 中提出行动提案
description: 按照这些分步说明，了解如何在 Moonbeam 上的 Governance v2 (OpenGov) 中提交 Democracy 提案，供其他代币持有者投票。
categories: Governance
---

# 如何在 OpenGov (治理 v2) 中提议行动

## 简介 {: #introduction }

提案是提交到链上的一种方式，代币持有者可以在其中建议系统执行某项操作。提案是治理系统的核心要素之一，因为它们是社区成员提出行动/变更的主要工具，其他代币持有者可以对这些提案进行投票。

在 Moonbeam 中，用户可以使用他们的 H160 地址和私钥（即他们的常规以太坊帐户）来创建提案并对其进行投票！

本指南将概述在 OpenGov（治理 v2）中提交提案，供其他代币持有者投票的流程，并提供逐步说明。本指南将向您展示如何在 Moonbase Alpha 上提交提案，但它可以很容易地适用于 Moonbeam 和 Moonriver。有关如何在 OpenGov 中投票的单独指南，请参见[如何在 OpenGov 中进行提案投票](/tokens/governance/voting/){target=\_blank}。

有关 Moonbeam 治理系统的更多信息，请参阅 [Moonbeam 上的治理](/learn/features/governance/){target=\_blank} 概述页面。

## 定义 {: #definitions }

本指南的一些关键参数如下：

--8<-- 'zh/text/learn/features/governance/proposal-definitions.md'

--8<-- 'zh/text/learn/features/governance/preimage-definitions.md'

 - **提交保证金** - 提交公开投票提案的最低保证金金额

--8<-- 'zh/text/learn/features/governance/lead-in-definitions.md'

请务必查看每个网络和跟踪的[治理参数](/learn/features/governance/#governance-parameters-v2){target=\_blank}。

## 提案路线图 {: #roadmap-of-a-proposal }

本指南将介绍提案路线图中概述的前几个步骤，如下面的图表所示。您将学习如何将您的提案想法提交到 [Moonbeam 社区论坛](https://forum.moonbeam.network){target=\_blank}，提交 preimages，并使用 preimage 哈希在链上提交您的提案。

您可以在治理概述页面的 [提案路线图](/learn/features/governance/#roadmap-of-a-proposal-v2){target=\_blank} 部分找到完整的解释。

![提案路线图](/images/tokens/governance/proposals/proposals-roadmap.webp)

## 向社区论坛提交您的想法 {: #submitting-your-idea-to-the-forum }

在深入了解提交提案的步骤之前，您需要熟悉 [Moonbeam 社区论坛](https://forum.moonbeam.network){target=\_blank}。强烈建议您在论坛上发布任何提案之前，先征求反馈。在继续提交 preimage 和 proposal 之前，应预留至少五天 的时间，供社区在 Moonbeam Forum 上对相关帖子进行讨论并提供反馈。

要访问 Moonbeam 社区论坛，您必须是 [Moonbeam Discord](https://discord.com/invite/PfpUATX){target=\_blank} 社区的成员。然后，您可以注册使用您的 Discord 凭据访问论坛。

登录后，您可以浏览最新的讨论、加入对话，并为您可能有的提案想法创建自己的讨论。在首次发帖或评论之前，请务必熟悉 [常见问题解答](https://forum.moonbeam.network/faq){target=\_blank}，以了解社区准则。

![Moonbeam 论坛主页](/images/tokens/governance/treasury-proposals/treasury-proposal-1.webp)

当您准备好创建包含提案详细信息的帖子时，您可以前往**治理**页面，然后单击**民主提案**。

![Moonbeam 论坛上的治理页面](/images/tokens/governance/proposals/proposals-1.webp)

从那里，您可以单击**打开草稿**并开始使用提供的模板起草您的提案。确保更新帖子的标题并添加任何可选标签，例如，如果提案是针对 Moonbeam 网络的，则添加 **Moonbeam**。标题应遵循与预先填充的标题相同的格式：[提案：XX][状态：想法] 提案标题。例如，[提案：XX][状态：想法] 注册 XC-20 xcMYTOK。一旦提案已在链上正式提交，则需要使用提案 ID 更新 XX。

![向 Moonbeam 论坛添加提案](/images/tokens/governance/proposals/proposals-2.webp)

填写完提案详细信息后，您可以单击**创建主题**以将其保存到论坛并开始讨论您的想法。根据您收到的反馈，您可以在继续提交提案之前更新提案。

## 提出一项行动 {: #proposing-an-action }

本节介绍在 Moonbase Alpha 上使用 OpenGov（治理 v2）创建提案的流程。这些步骤可以适用于 Moonbeam 和 Moonriver。

要在网络中提出提案，您可以使用 Polkadot.js Apps 界面。为此，您需要首先导入一个以太坊风格的帐户（H160 地址），您可以按照[创建或导入 H160 帐户](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=\_blank} 指南进行操作。在本示例中，导入了三个帐户，并使用了超级原始名称命名：Alice、Bob 和 Charlie。

![Polkadot.js 中的帐户](/images/tokens/governance/proposals/proposals-3.webp)

对于提案，您可以选择您想要提出的任何内容，只需确保将其分配给正确的 Origin 和 Track，以便它具有执行操作的正确权限。

在本指南中，该操作将使用 General Admin Origin 和 Track 设置链上备注。

### 提交提案的 Preimage {: #submitting-a-preimage-of-the-proposal }

第一步是提交提案的 preimage。这是因为大型 preimage 的存储成本可能非常高昂，因为 preimage 包含有关提案本身的所有信息。通过此配置，一个具有更多资金的帐户可以提交 preimage，而另一个帐户可以提交提案。

首先，导航至 [Moonbase Alpha 的 Polkadot.js Apps 界面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network){target=\_blank}。与治理相关的所有内容都位于 **治理** 选项卡下，包括 preimage。因此，从 **治理** 下拉列表中，您可以选择 **Preimage**。进入后，单击 **添加 preimage** 按钮。

![在 Polkadot.js 中添加 preimage](/images/tokens/governance/proposals/proposals-4.webp)

在这里，您需要提供以下信息：

 1. 选择您要从中提交 preimage 的帐户
 2. 选择您要与之交互的 pallet 以及要提议的可调度函数（或操作）。您选择的操作将决定需要在以下步骤中填写的字段。在本例中，它是 **system** pallet 和 **remark** extrinsic
 3. 输入调度 extrinsic 所需的任何其他字段。对于此示例，您可以以十六进制或 ascii 格式输入备注
 4. 复制 preimage 哈希。这代表提案。您将在提交实际提案时使用此哈希
 5. 单击 **提交 preimage** 按钮并签署交易

![填写 Preimage 信息](/images/tokens/governance/proposals/proposals-5.webp)

!!! note
    请确保您复制 preimage 哈希，因为提交提案需要它。

请注意，preimage 的存储成本可以计算为基本费用（每个网络）加上每个建议的 preimage 的每字节费用。

提交交易后，您将在 Polkadot.js Apps 界面的右上角看到一些确认信息，并且 preimage 将被添加到 **preimages** 列表中。

### 提交提案 {: #submitting-a-proposal-v2 }

一旦您提交了原像（请查看上一节），路线图的下一个主要里程碑就是提交与之相关的提案。为此，请从**治理**下拉菜单中选择**Referenda**，然后点击**提交提案**。

为了提交提案，您需要选择要使用哪个 Origin 类来执行您的提案。**选择错误的 Track/Origin 可能会导致您的提案执行失败**。有关每个 Origin 类的更多信息，请参阅 Moonbeam 治理概述页面上的[通用定义](/learn/features/governance/#general-definitions-gov2){target=\_blank}部分。

![提交提案](/images/tokens/governance/proposals/proposals-6.webp)

在这里，您需要提供以下信息：

 1. 选择您要从中提交提案的账户（在本例中为 Alice）
 2. 选择要将提案提交到的 Track。与 Track 关联的 Origin 将需要有足够的权限来执行提议的操作。对于本示例，要添加链上备注，您可以从**提交 Track** 下拉菜单中选择 **2 / General Admin**
 3. 在 **origin** 下拉菜单中，选择 **Origins**
 4. 在 **Origins** 下拉菜单中，选择 Origin，在本例中为 **GeneralAdmin**
 5. 输入与提案相关的原像哈希。在本示例中，它是上一节中 `system.remark` 原像的哈希值
 6. 选择颁布的时间，可以是在特定数量的区块之后，也可以是在特定区块。它必须满足最低颁布期，您可以在 OpenGov 的[治理参数](/learn/features/governance/#governance-parameters-v2)中找到该参数
 7. 输入区块数或要在其上颁布提案的特定区块
 8. 点击**提交提案**并签署交易

![填写提案信息](/images/tokens/governance/proposals/proposals-7.webp)

!!! note
    代币可能会被锁定一段不确定的时间，因为无法知道提案何时可能成为全民公投（如果会成为全民公投）。

提交交易后，您将在 Polkadot.js Apps 界面的右上角看到一些确认信息。您还应该在相关的 Origin 部分看到列出的提案，其中显示了提议的操作、提案人等。

如果您使用用于创建提案的同一个账户登录[Polkassembly](https://moonbeam.polkassembly.io/opengov){target=\_blank}，您将能够编辑提案的描述，以包含指向[Moonbeam 社区论坛](https://forum.moonbeam.network){target=\_blank}上提案讨论的链接。这是一个有用的步骤，因为虽然 Polkassembly 会为每个提案自动生成帖子，但它没有提供有关提案内容的上下文信息。

该提案现在处于导入期，可以进行投票了！为了使您的提案从导入期进入下一阶段，至少需要经过准备期，以便有足够的时间讨论提案，所选 Track 中需要有足够的容量，并且需要提交决策保证金。保证金可以由任何代币持有人支付。如果没有足够的容量或尚未提交决策保证金，但准备期已经过去，则该提案将保留在导入期，直到满足所有条件为止。

要了解如何对提案进行投票，请参阅[如何在 OpenGov 中对提案进行投票](/tokens/governance/voting/){target=\_blank}指南。
