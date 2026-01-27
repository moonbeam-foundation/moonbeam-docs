---
title: 如何在 OpenGov 中对提案进行投票
description: 请按照本指南学习如何投票和锁定您的代币，以支持或拒绝在 Moonbeam 上 Governance v2 (OpenGov) 中为全民投票提出的提案。
categories: Governance
---

# 如何在 Governance v2 中对提案进行投票：OpenGov

## 简介 {: #introduction }

公民投票是简单、包容和基于权益的投票方案。每个公民投票都附带一个提案，该提案建议采取行动。在 OpenGov 中，每个公民投票都有一个特定的 Origin 类，提案将通过该类执行，并且每个 Origin 都有其自己的 Track，提案将通过该 Track 进行处理。虽然公民投票通过一个共同的流程完成，但批准要求是特定于轨道的。

代币持有者可以使用他们自己的代币对公民投票进行投票，包括那些锁定在质押中的代币。投票的权重由两个因素决定：锁定的代币数量和锁定持续时间（称为信念）。这是为了确保有经济投入以防止出售选票。因此，您愿意锁定代币的时间越长，您的投票权重就越大。您也可以选择完全不锁定代币，但投票权重会大大降低。

在 Moonbeam 中，用户可以使用他们的 H160 地址和私钥（即他们常规的以太坊帐户！）来创建提案并进行投票！

本指南将概述在 Governance v2: OpenGov 中对公民投票进行投票的过程，并提供分步说明。本指南将向您展示如何在 Moonbase Alpha 上进行投票，但它可以很容易地适用于 Moonbeam 和 Moonriver。

!!! note
    本页面从更技术的层面介绍了如何投票的机制。代币持有者可以利用诸如 [Polkassembly](https://moonbeam.network/news/participate-in-opengov-with-polkassembly-on-moonbeam){target=\_blank} 等平台，使用户界面更友好的方式进行投票。

## 定义 {: #definitions }

本指南的一些关键参数如下：

--8<-- 'zh/text/learn/features/governance/vote-conviction-definitions.md'

 - **最大投票数** — 每个账户的并发投票最大数

    === "Moonbeam"

        ```text
        {{ networks.moonbeam.governance.max_votes }} votes
        ```

    === "Moonriver"

        ```text
        {{ networks.moonriver.governance.max_votes }} votes
        ```

    === "Moonbase Alpha"

        ```text
        {{ networks.moonbase.governance.max_votes }} votes
        ```

--8<-- 'zh/text/learn/features/governance/approval-support-definitions.md'

--8<-- 'zh/text/learn/features/governance/lead-in-definitions.md'

 - **决定期** - 代币持有人继续对全民公投进行投票。如果全民公投在期限结束时未通过，则将被拒绝，并且决策保证金将被退还
 - **确认期** - 决定期内的一段时间，在此期间，全民公投需要保持足够的批准和支持才能获得批准并进入颁布期
 - **颁布期** - 指定的时间，该时间在创建提案时定义，至少要满足批准的全民公投在可以发送之前等待的最短时间

--8<-- 'zh/text/learn/features/governance/delegation-definitions.md'

有关特定于 Track 的参数（例如决定期、确认期和颁布期的长度、批准和支持要求等）的概述，请参阅[治理概述页面的 OpenGov（治理 v2）的治理参数部分](learn/features/governance/#governance-parameters-v2){target=\_blank}。

## 提案路线图 {: #roadmap-of-a-proposal }

本指南将介绍如何对公共提案进行投票，如下面的提案路线图图中突出显示的步骤所示。除了学习如何对提案进行投票外，您还将了解提案如何通过导入期、决策和确认期以及执行期。

您可以在[治理概述页面](learn/features/governance/#roadmap-of-a-proposal-v2){target=\_blank}上找到有关 OpenGov 提案的[开心路径](happy path)的完整说明。

![提案路线图](/images/tokens/governance/voting/proposal-roadmap.webp)

## 论坛讨论 {: #forum-discussion}

针对民主投票的全民公投只有是或否两种结果。但是，代币持有者的意见往往比简单的赞成或反对更为细致。因此，强烈建议您在提出任何提案之前，先在 [Moonbeam 社区论坛](https://forum.moonbeam.network){target=\_blank} 上发布帖子。

论坛的关键作用是提供一个讨论平台，让提案者在进行链上操作之前能够收到社区的反馈。在论坛上创建帖子既快速又简单，如[使用 Moonbeam 社区论坛](https://moonbeam.network/news/using-the-moonbeam-community-forum-to-submit-a-treasury-proposal){target=\_blank} 指南中所示。论坛中有对应于每种提案类型的类别，包括民主、金库和赠款提案。虽然此步骤是可选的，但解释提案的详细信息并跟进提出的任何问题，可能会增加该倡议被接受并随后被社区通过的机会。

![Moonbeam's Community Forum home](/images/tokens/governance/voting/vote-1.webp)

## 对全民公投进行投票 {: #voting-on-a-referendum }

本节介绍如何在 Moonbase Alpha 上的 OpenGov（治理 v2）中对公共全民公投进行投票。这些步骤可以适用于 Moonbeam 和 Moonriver。本指南假定已经有一个正在进行的全民公投。如果您想对一个公开的全民公投进行投票，您可以按照这些说明来学习投票方法。

要在网络上对提案进行投票，您需要使用 Polkadot.js Apps 界面。为此，您需要首先导入一个以太坊样式的帐户（H160 地址），您可以通过遵循[创建或导入 H160 帐户](tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=\_blank} 指南来完成。在本示例中，导入了三个帐户，并使用超级原始名称对其进行了命名：Alice、Bob 和 Charlie。

![Polkadot.js 中的帐户](/images/tokens/governance/proposals/proposals-3.webp)

首先，您需要导航到 [Moonbase Alpha 的 Polkadot.js Apps 界面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network){target=\_blank}。与治理相关的所有内容都位于“**治理**”选项卡下。要查看所有全民公投，您可以从“**治理**”下拉菜单中选择“**全民公投**”。在“**全民公投**”页面上，您将看到一个按轨道组织的全民公投列表。要查看特定全民公投的详细信息，您可以单击描述旁边的箭头。操作和描述旁边的数字称为全民公投索引。

### 如何通过贡献决策保证金来支持提案 {: #submit-decision-deposit }

为了使全民公投从准备阶段进入决定阶段，必须提交决策保证金。提案的作者或任何其他代币持有者都可以提交此保证金。保证金根据提案的轨道而有所不同。

例如，在 General Admin Track 中的全民公投在 Moonbase Alpha 链上的决策保证金为 {{ networks.moonbase.governance.tracks.general_admin.decision_deposit }}。

从 [Polkadot.js Apps 上的全民公投列表](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/referenda){target=\_blank} 中，您可能会注意到一些提案处于**准备中**状态。如果全民公投需要提交决策保证金，您将看到一个**决策保证金**按钮。要提交保证金，您可以直接点击此按钮。

![要开始为全民公投提交决策保证金，请点击 Polkadot.js Apps 上的“决策保证金”按钮。](/images/tokens/governance/voting/vote-2.webp)

然后按照以下步骤从特定账户提交保证金：

1. 选择**从账户存款**。此账户不必是提案的作者；它可以来自任何代币持有者。但是，如果提案被认为是恶意的，决策保证金将被销毁。因此，在存入保证金之前，建议您进行尽职调查，以确保提案不是恶意的
2. **全民公投 ID** 和**决策保证金**字段将根据全民公投及其所属的轨道自动为您填充
3. 点击**存入保证金**并签署交易

![要提交决策保证金，请选择存入保证金的账户，然后点击 Polkadot.js Apps 上的“存入保证金”按钮。](/images/tokens/governance/voting/vote-3.webp)

一旦存入保证金，Polkadot.js Apps 将更新并显示支付决策保证金的账户以及保证金金额。现在，此全民公投离满足准备阶段的标准又近了一步。

如果准备阶段已过，并且在 General Admin Track 中有足够的空间进行全民公投，则此提案将进入决定阶段。

### 如何投票 {: #how-to-vote }

您可能已经注意到，在导入期内，投票不是必需的。但是，在决定期内，投票至关重要。本节中的步骤将适用于导入期和决定期内的全民投票。

要投票并锁定支持或反对全民投票的代币，您可以先单击要投票的全民投票旁边的“**投票**”按钮。

![要在全民投票中投票，请单击 Polkadot.js Apps 上的“投票”按钮。](/images/tokens/governance/voting/vote-4.webp)

然后，您可以按照以下步骤填写投票的详细信息：

1. 选择**用账户投票**
2. 选择您希望如何对全民投票进行投票。您可以选择**赞成**以支持全民投票，选择**反对**以反对它，或者如果您想指定一个“赞成”投票值和一个“反对”投票值，则选择**拆分**
3. 输入投票值
4. 设置投票信念，它决定了您的投票权重 (`vote_weight = tokens * conviction_multiplier`)。请参阅[信念乘数](learn/features/governance/#conviction-multiplier){target=\_blank}文档以获取更多信息
5. 单击“**投票**”并签署交易

![要在全民投票中提交投票，请填写投票的详细信息，然后单击 Polkadot.js Apps 上的“投票”按钮。](/images/tokens/governance/voting/vote-5.webp)

!!! note
    先前图像中显示的锁定时间不应作为参考，因为它们可能会发生变化。

要查看您的投票和所有其他全民投票的投票如何影响批准和支持曲线，您可以单击“**投票**”按钮旁边的箭头。您会注意到有两个图表，每个曲线一个。如果将鼠标悬停在图表上，您可以看到特定区块所需的最低赞成或支持以及当前的赞成或支持。

![查看 Polkadot.js Apps 上全民投票的批准和支持曲线。](/images/tokens/governance/voting/vote-6.webp)

Moonbase Alpha 上通用管理通道中的提案将具有以下特征：

 - 批准曲线从 {{ networks.moonbase.governance.tracks.general_admin.min_approval.percent0 }}% 开始于 {{ networks.moonbase.governance.tracks.general_admin.min_approval.time0 }} 并在 {{ networks.moonbase.governance.tracks.general_admin.min_approval.time1 }} 时变为 {{ networks.moonbase.governance.tracks.general_admin.min_approval.percent1 }}%
 - 支持曲线从 {{ networks.moonbase.governance.tracks.general_admin.min_support.percent0 }}% 开始于 {{ networks.moonbase.governance.tracks.general_admin.min_support.time0 }} 并在 {{ networks.moonbase.governance.tracks.general_admin.min_support.time1 }} 时变为 {{ networks.moonbase.governance.tracks.general_admin.min_support.percent1 }}%
 - 全民投票以 0% 的“赞成”票开始决定期（在导入期内无人投票）
 - 代币持有者开始投票，并且批准度在 {{ networks.moonbase.governance.tracks.general_admin.min_approval.time1 }} 时增加到 {{ networks.moonbase.governance.tracks.general_admin.min_approval.percent1 }}% 以上的值
 - 如果在确认期（{{ networks.moonbase.governance.tracks.general_admin.confirm_period.blocks }} 个区块，约 {{ networks.moonbase.governance.tracks.general_admin.confirm_period.time }}）内满足批准和支持阈值，则全民投票获得批准
 - 如果在决定期内未满足批准和支持阈值，则提案将被拒绝。请注意，需要在确认期的持续时间内满足阈值。因此，如果满足阈值，但在确认期完成之前决定期结束，则提案将被拒绝

在下面的图像中，您会注意到已收到足够的批准和支持，因此确认期正在进行中。如果全民投票保持批准和支持水平，则在区块 124,962 处，确认期将结束，然后颁布期将开始。您可以将鼠标悬停在图表上，以了解有关每个期间的更多信息。假设此全民投票保持其已收到的批准和支持水平，则颁布期将在区块 132,262 处结束，并且将发送提案操作。

![查看 Polkadot.js Apps 上全民投票的批准和支持曲线。](/images/tokens/governance/voting/vote-7.webp)

如果在确认期内全民投票没有持续收到足够的批准和支持，只要再次满足批准和支持要求并在确认期的持续时间内持续满足，它仍然有机会通过。如果全民投票进入确认期，但决定期设置为在确认期结束之前结束，则决定期实际上将延长至确认期结束。如果决定期结束并且全民投票仍未获得足够的批准和支持，则全民投票将被拒绝，并且可以退还决定保证金。

颁布期由提案的作者在最初提交时定义，但它至少需要是最短的颁布期。

### 委托投票 {: #delegate-voting }

代币持有人可以选择将其投票权委托给他们信任的另一个帐户。被委托的帐户不需要采取任何特定操作。当他们投票时，投票权重（即代币乘以委托人选择的信念乘数）将添加到他们的投票中。

随着 OpenGov（治理 v2）的推出，代币持有人甚至可以按 Track-by-Track 的方式委托其投票权，并为每个 Track 指定不同的受托人，这被称为多角色委托。

从 [Polkadot.js Apps 上的 referenda 页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/referenda){target=\_blank}，您可以单击**Delegate**开始。

![要在 referendum 上提交委托投票，请单击 Polkadot.js Apps 上的“Delegate”按钮。](/images/tokens/governance/voting/vote-8.webp)

然后，您可以按照以下步骤填写委托的详细信息：

1.  输入**delegate from account**，这应该是您希望从中委托投票的帐户
2.  选择**submission track**，或者如果您希望其他帐户代表您在任何 Track 上投票，请将**apply delegation to all tracks**滑块切换为开启
3.  输入**delegated vote value**
4.  设置投票信念，这决定了您的投票权重 (`vote_weight = tokens * conviction_multiplier`)。有关更多信息，请参阅 [信念乘数](learn/features/governance/#conviction-multiplier){target=\_blank} 文档
5.  单击**Next**
6.  在下一个屏幕上，选择**delegate to address**，这应该是您希望将投票委托给的帐户
7.  单击**Delegate**并签署交易

![通过填写所有委托详细信息并单击 Polkadot.js Apps 上的“Delegate”按钮，在 referendum 上提交委托投票。](/images/tokens/governance/voting/vote-9.webp)

现在，您选择将投票委托给的帐户将能够代表您投票。一旦此帐户投票，委托的总投票权重将分配给该帐户选择的选项。对于本示例，Baltahar 可以使用 Charleth 委托给他的投票权重，以 20000 的总权重（10000 个代币，x2 信念因子）投票赞成 referendum。

您可以继续上述过程为每个 Track 委托一个具有不同投票权重的不同帐户。

要取消委托，您需要前往**Developer**选项卡并单击**Extrinsics**。从那里，您可以按照以下步骤操作：

1.  选择您已从中委托的帐户
2.  选择 **convictionVoting** pallet 和 **undelegate** extrinsic
3.  输入 Origin 的 **class**。对于 General Admin Track，它是 `2`。有关 Track ID 的完整列表，请参阅 [治理概述页面的 OpenGov 部分](learn/features/governance/#general-parameters-by-track){target=\_blank}
4.  单击**Submit transaction**并签署交易

![在 Polkadot.js Apps 上取消委托投票。](/images/tokens/governance/voting/vote-10.webp)

### 退还决策保证金 {: #refund-the-decision-deposit }

如果一项全民投票获得批准或拒绝，则决策保证金将有资格获得退还，只要它不是因为恶意提案而被拒绝。恶意提案将导致决策保证金被削减。任何代币持有人都可以触发将保证金退还到最初放置保证金的原始帐户。要退还保证金，您可以按照[Polkadot.js Apps 上的全民投票页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/referenda){target=\_blank}上的以下步骤操作。如果全民投票符合条件且保证金尚未退还，您将看到一个**退还保证金**按钮。因此，您可以继续单击该按钮以开始。

![从 Polkadot.js Apps 上通过的全民投票开始退还决策保证金。](/images/tokens/governance/voting/vote-11.webp)

然后，要提交退款交易，您可以：

1. 选择您要触发退款的帐户。这不需要是最初放置存款的帐户
2. 单击**退还保证金**并签署交易

![Polkadot.js Apps 上的退还决策保证金。](/images/tokens/governance/voting/vote-12.webp)

### 解锁锁定的代币 {: #unlocking-locked-tokens }

当代币持有人投票时，使用的代币会被锁定，无法转移。您可以通过展开地址的帐户详细信息，在“帐户”选项卡中验证您是否有任何锁定的代币。在那里，您将看到不同类型的余额。如果您有任何代币锁定在全民公投中，您将在您的余额详细信息中看到**referenda**，您可以将鼠标悬停在它上面，以了解您的代币为哪个全民公投锁定的详细信息。不同的锁定状态包括：

 - 因正在进行的全民公投而被锁定，这意味着您已经使用了您的代币，必须等到全民公投结束，即使您已经以无锁定信念因子投票
 - 因选择的信念乘数而被锁定，显示剩余的区块数和时间
 - 锁定已过期，这意味着您现在可以取回您的代币

![在 Polkadot.js Apps 的帐户页面上查看锁定的余额。](/images/tokens/governance/voting/vote-13.webp)

一旦锁定过期，您可以请求取回您的代币。为此，请导航到“开发者”选项卡下的“Extrinsics”菜单。在这里，需要发送两个不同的外部操作。首先，您需要提供以下信息：

 1. 选择您要从中恢复代币的帐户
 2. 选择您要与之交互的 pallet。在本例中，它是 `convictionVoting` pallet 和用于交易的外部操作。这将决定您需要在以下步骤中填写的字段。在本例中，它是 `removeVote` 外部操作。此步骤对于解锁代币是必要的。此外部操作也可用于从全民公投中移除您的投票
 4. （可选）您可以指定要移除投票的 Track ID。为此，只需切换“包含选项”滑块，并在“class u16”字段中输入 Track ID
 5. 输入全民公投索引。这是出现在“全民公投”选项卡左侧的数字
 6. 单击“提交交易”按钮并签署交易

![提交一个外部操作以移除您在 Polkadot.js Apps 上的全民公投投票。](/images/tokens/governance/voting/vote-14.webp)

对于下一个外部操作，您需要提供以下信息：

 1. 选择您要从中恢复代币的帐户
 2. 选择您要与之交互的 pallet。在本例中，它是 `convictionVoting` pallet
 3. 选择用于交易的外部操作方法。这将决定需要在以下步骤中填写的字段。在本例中，它是 `unlock` 外部操作
 4. 输入要移除投票锁定的 Track ID
 5. 输入将接收解锁代币的目标帐户。在本例中，代币将返回给 Alice
 6. 单击“提交交易”按钮并签署交易

![提交一个外部操作以解锁您在 Polkadot.js Apps 的全民公投中锁定的代币。](/images/tokens/governance/voting/vote-15.webp)

一旦交易完成，锁定的代币应该被解锁。要仔细检查，您可以返回到“帐户”选项卡，并查看您的完整余额现在是**可转移的**。
