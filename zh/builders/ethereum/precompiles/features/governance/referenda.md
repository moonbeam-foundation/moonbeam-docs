---
title: Referenda 预编译合约
description: 了解如何通过 Moonbeam 上的 Referenda 预编译合约，直接通过 Solidity 接口查看和提交链上提案，以供全民公投。
categories: Precompiles, Ethereum Toolkit
---

# 与Referenda预编译交互

## 简介 {: #introduction }

作为 Polkadot 平行链和去中心化网络，Moonbeam 具有原生的链上治理功能，使利益相关者能够参与到网络的发展方向中。随着 OpenGov（也称为 Governance v2）的推出，Referenda Pallet 允许代币持有者获取有关现有公投的信息、提交提案以供公投，并管理与决策保证金相关的操作，决策保证金是决定公投所需的内容。要了解有关 Moonbeam 治理系统的更多信息，例如相关术语、原则、机制等的概述，请参阅[Moonbeam 上的治理](learn/features/governance/){target=\_blank}页面。

Referenda Precompile 直接与 Substrate 的 Referenda Pallet 交互。此 pallet 以 Rust 编写，通常无法从 Moonbeam 的以太坊端访问。但是，它允许您访问查看公投、提交公投和管理所需决策保证金所需的功能。这些功能是 Substrate Referenda Pallet 的一部分，可以直接从 Solidity 接口访问。

Referenda Precompile 位于以下地址：

=== "Moonbeam"

     ```text
     {{ networks.moonbeam.precompiles.referenda }}
     ```

=== "Moonriver"

     ```text
     {{ networks.moonriver.precompiles.referenda }}
     ```

=== "Moonbase Alpha"

     ```text
     {{ networks.moonbase.precompiles.referenda }}
     ```

--8<-- 'zh/text/builders/ethereum/precompiles/security.md'

## Referenda Solidity接口 {: #the-referenda-solidity-interface }

[`Referenda.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=\_blank} 是一个Solidity接口，允许开发者与预编译的方法进行交互。

方法如下：

??? function "**referendumCount**() - 一个只读函数，返回全民公投总数"

    === "参数"

        无。

    === "返回"

        - `uint256` 全民公投总数

??? function "**submissionDeposit**() - 一个只读函数，返回每次全民公投所需的提交保证金"

    === "参数"

        无。

    === "返回"

        - `uint256` 所需提交保证金的金额

??? function "**decidingCount**(*uint16* trackId) - 一个只读函数，返回给定Track的正在决定的全民公投总数"

    === "参数"

        - `trackId` - 要查询决定计数的uint16 Track ID

    === "返回"

        - `uint256` 指定Track的决定全民公投的计数

??? function "**trackIds**() - 一个只读函数，返回所有Track（和Origin）的Track ID列表"

    === "参数"

        无。

    === "返回"

        - `uint16[]` Track ID数组

??? function "**trackInfo**(*uint16* trackId) - 一个只读函数，返回为给定Track ID配置的以下治理参数"

    === "参数"

        - `trackId` - 要查询参数的uint16 Track ID

    === "返回"

        - `string` name - Track的名称
        - `uint256` maxDeciding - 一次可以决定的全民公投的最大数量
        - `uint256` decisionDeposit - 决策保证金的金额
        - `uint256` preparePeriod - 准备期的持续时间
        - `uint256` decisionPeriod - 决策期的持续时间
        - `uint256` confirmPeriod - 确认期的持续时间
        - `uint256` minEnactmentPeriod - 实施期必须的最小时间量
        - `bytes` minApproval - 批准所需的最小“赞成”票数，占总体信念加权票数的百分比
        - `bytes` minSupport - 批准所需的最小“赞成”票数，不考虑信念加权票，占总供应量的百分比

??? function "**referendumStatus**(*uint32* referendumIndex) - 一个只读函数，返回给定全民公投的状态"

    === "参数"

        - `referendumIndex` - 要查询状态的全民公投的uint32索引

    === "返回"

        ReferendumStatus枚举：
        ```solidity
        enum ReferendumStatus {
             Ongoing,
             Approved,
             Rejected,
             Cancelled,
             TimedOut,
             Killed
        }
        ```

??? function "**ongoingReferendumInfo**(*uint32* referendumIndex) - 一个只读函数，返回与正在进行的全民公投有关的信息"

    === "参数"

        - `referendumIndex` - 要查询的正在进行中的全民公投的uint32索引

    === "返回"

        - `uint16` trackId - 此全民公投的Track
        - `bytes` origin - 此全民公投的Origin
        - `bytes` proposal - 全民公投的提案哈希
        - `bool` enactmentType - 如果提案计划在颁布*时*分派，则为`true`；如果在颁布时间*之后*分派，则为`false`
        - `uint256` enactmentTime - 提案应计划颁布的时间
        - `uint256` submissionTime - 提交时间
        - `address` submissionDepositor - 提交保证金的存款人地址
        - `uint256` submissionDeposit - 提交保证金的金额
        - `address` decisionDepositor - 决策保证金的存款人地址
        - `uint256` decisionDeposit - 决策保证金的金额
        - `uint256` decidingSince - 此全民公投进入决策期的时间
        - `uint256` decidingConfirmingEnd - 此全民公投计划离开确认期的时间
        - `uint256` ayes - “赞成”票数，以信念锁定投票后的形式表示
        - `uint32` support - “赞成”票的百分比，以总投票类别中信念锁定前的形式表示
        - `uint32` approval - “赞成”和“反对”票中“赞成”票的百分比
        - `bool` inQueue - 如果此全民公投已放入队列中以供决定，则为`true`
        - `uint256` alarmTime - 下一个计划的唤醒时间
        - `bytes` taskAddress - 如果计划了，则为调度程序任务地址

??? function "**closedReferendumInfo**(*uint32* referendumIndex) - 一个只读函数，返回与已结束的全民公投有关的信息"

    === "参数"

        - `referendumIndex` - 要查询的已结束的全民公投的uint32索引

    === "返回"

        - `uint256` end - 全民公投结束的时间
        - `address` submissionDepositor - 提交保证金的存款人地址
        - `uint256` submissionDeposit - 提交保证金的金额
        - `address` decisionDepositor - 决策保证金的存款人地址
        - `uint256` decisionDeposit - 决策保证金的金额

??? function "**killedReferendumBlock**(*uint32* referendumIndex) - 一个只读函数，返回给定全民公投被终止的区块"

    === "参数"

        - `referendumIndex` - 要查询的已终止的全民公投的uint32索引

    === "返回"

        - `uint256` 全民公投被终止的区块号

??? function "**submitAt**(*uint16* trackId, *bytes32* proposalHash, *uint32* proposalLen, *uint32* block) - 提交全民公投，指定一个Track ID，该ID对应于要从中分派提案的来源。返回提交的全民公投的公民投票索引"

    === "参数"

        - `trackId` - uint16 Track ID，对应于要从中分派提案的来源
        - `proposalHash` - 建议的运行时调用的bytes32前像哈希
        - `proposalLen` - 提案的uint32长度
        - `block` - *在*执行此操作的uint32区块号

    === "返回"

        - `uint32` 提交的全民公投的索引

??? function "**submitAfter**(*uint16* trackId, *bytes32* proposalHash, *uint32* proposalLen, *uint32* block) - 提交全民公投，指定一个Track ID，该ID对应于要从中分派提案的来源。返回提交的全民公投的公民投票索引"

    === "参数"

        - `trackId` - uint16 Track ID，对应于要从中分派提案的来源
        - `proposalHash` - 建议的运行时调用的bytes32前像哈希
        - `proposalLen` - 提案的uint32长度
        - `block` - *之后*将执行此操作的uint32区块号

    === "返回"

        - `uint32` 提交的全民公投的索引

??? function "**placeDecisionDeposit**(*uint32* index) - 给定正在进行的全民公投的索引，发布全民公投的决策保证金"

    === "参数"

        - `index` - 要放置决策保证金的正在进行中的全民公投的uint32索引

    === "返回"

        无。

??? function "**refundDecisionDeposit**(*uint32* index) - 将已结束的全民公投的决策保证金退还给存款人"

    === "参数"

        - `index` - 决策保证金仍被锁定的已结束的全民公投的uint32索引

    === "返回"

        无。

??? function "**refundSubmissionDeposit**(*uint32* index) - 将已结束的全民公投的提交保证金退还给存款人"

    === "参数"

        - `index` - 要退还提交保证金的已结束的全民公投的uint32索引

    === "返回"

        无。

该接口还包括以下事件：

- **SubmittedAt**(*uint16 indexed* trackId, *uint32* referendumIndex, *bytes32* hash) - 当全民公投*在*给定区块被提交时，会发出此事件
- **SubmittedAfter**(*uint16 indexed* trackId, *uint32* referendumIndex, *bytes32* hash) - 当全民公投*在*给定区块后被提交时，会发出此事件
- **DecisionDepositPlaced**(*uint32* index, *address* caller, *uint256* depositedAmount) - 当全民公投的决策保证金被放置时，会发出此事件
- **DecisionDepositRefunded**(*uint32* index, *address* caller, *uint256* refundedAmount) - 当已结束的全民公投的决策保证金被退还时，会发出此事件
- **SubmissionDepositRefunded**(*uint32* index, *address* caller, *uint256* refundedAmount) - 当有效全民公投的提交保证金被退还时，会发出此事件

## 与Solidity接口交互 {: #interact-with-the-solidity-interface }

### 检查先决条件 {: #checking-prerequisites }

以下示例在 Moonbase Alpha 上演示，但是，类似步骤也可用于 Moonriver。要遵循本指南中的步骤，您需要具备以下条件：

 - 安装了 MetaMask 并[连接到 Moonbase Alpha](tokens/connect/metamask/){target=\_blank}
 - 一个拥有一些 DEV 代币的帐户。
 --8<-- 'zh/text/_common/faucet/faucet-list-item.md'

### Remix 设置 {: #remix-set-up }

1. 点击**文件浏览器**标签
2. 将[`Referenda.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=\_blank}的副本粘贴到名为`Referenda.sol`的 [Remix 文件](https://remix.ethereum.org){target=\_blank}中

![将 Referenda Solidity 界面复制并粘贴到 Remix 中。](/images/builders/ethereum/precompiles/features/governance/referenda/referenda-1.webp)

### 编译合约 {: #compile-the-contract }

1. 点击顶部的第二个 **Compile** 选项卡
2. 然后要编译接口，请点击 **Compile Referenda.sol**

![使用 Remix 编译 Referenda.sol 接口。](/images/builders/ethereum/precompiles/features/governance/referenda/referenda-2.webp)

### 访问合约 {: #access-the-contract }

1. 点击 Remix 中**Compile**选项卡正下方的**Deploy and Run**选项卡。注意：您无需在此处部署合约，而是访问一个已部署的预编译合约
2. 确保在 **ENVIRONMENT** 下拉菜单中选择了 **Injected Provider - Metamask**
3. 确保在 **CONTRACT** 下拉菜单中选择了 **Referenda.sol**。由于这是一个预编译的合约，因此无需部署，而是要在 **At Address** 字段中提供预编译的地址
4. 提供 Moonbase Alpha 的 Referenda 预编译地址：`{{ networks.moonbase.precompiles.referenda }}`，然后点击 **At Address**
5. Referenda 预编译将出现在 **Deployed Contracts** 列表中

![通过提供预编译地址访问 Referenda.sol 界面。](/images/builders/ethereum/precompiles/features/governance/referenda/referenda-3.webp)

### 提交提案 {: #submit-a-proposal }

为了提交提案，您应该已经提交了提案的预映像哈希值。如果您还没有这样做，请按照[预映像预编译](builders/ethereum/precompiles/features/governance/preimage/){target=\_blank}文档中概述的步骤进行操作。有两种方法可以用来提交提案：`submitAt` 和 `submitAfter`。`submitAt` 函数提交一个提案，以便在给定的区块*执行*，而 `submitAfter` 函数提交一个提案，以便在特定的区块*之后*执行。在本示例中，将使用 `submitAt` ，但是如果您想使用 `submitAfter` ，也可以应用相同的步骤。

要提交提案，您需要确定您的提案属于哪个 Track 以及该 Track 的 Track ID。如需这些要求的帮助，您可以参考[治理概述页面的 OpenGov 部分](learn/features/governance/#opengov){target=\_blank}。

您还需要确保您手头有预映像哈希和预映像的长度，这两者都应该从遵循[预映像预编译](builders/ethereum/precompiles/features/governance/preimage/){target=\_blank}文档中的步骤获得。如果您不确定，您可以从 [Polkadot.js Apps 的预映像页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/preimages){target=\_blank}找到您的预映像，并复制预映像哈希。要获得预映像的长度，您可以从 [Polkadot.js Apps Chain State 页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/chainstate){target=\_blank}使用 `preimageFor` 方法查询 `preimage` pallet。

一旦您有了 Track ID、预映像哈希和预映像长度，您就可以使用 Referenda Precompile 提交提案了。从 Remix 中，您可以采取以下步骤：

1. 展开 Referenda Precompile 合约以查看可用的函数
2. 找到 **submitAt** 函数，然后按按钮展开该部分
3. 输入您的提案将通过处理的 Track ID
4. 输入预映像哈希。您应该已经从遵循[预映像预编译](builders/ethereum/precompiles/features/governance/preimage/){target=\_blank}文档中的步骤获得
5. 输入预映像的长度
6. 输入您希望提案执行的区块
7. 按 **transact** 并在 MetaMask 中确认交易

![使用 Referenda Precompile 的 submitAt 函数提交提案。](/images/builders/ethereum/precompiles/features/governance/referenda/referenda-4.webp)

在您的交易被确认后，您将能够在 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/referenda){target=\_blank} 的 **Referenda** 页面上看到列出的提案。您还可以在 [Polkassembly](https://moonbase.polkassembly.io/opengov){target=\_blank} 上查看您的提案，该网站按提案所属的 Track 对提案进行排序。

### 提交决策保证金 {: #submit-decision-deposit }

既然您已经提交了提案，下一步是提交决策保证金。决策保证金是指提案在导入期结束时进入决策阶段所需的最低保证金金额。有关决策保证金的更多信息，请参阅[治理概述页面的 OpenGov 部分](learn/features/governance/#opengov){target=\_blank}。
您可以使用 Referenda Precompile 的 `placeDecisionDeposit` 函数提交决策保证金。您只需要拥有提案的索引和足够的资金即可。决策保证金因 Track 而异，要查找所需的最低金额，您可以查看[治理概述页面上的按 Track 常规参数表](learn/features/governance/#general-parameters-by-track){target=\_blank}。

要提交保证金，您可以按照以下步骤操作：

1. 找到 **placeDecisionDeposit** 函数，然后按按钮展开该部分
2. 输入提案的索引
3. 按 **transact** 并在 MetaMask 中确认交易

![使用 Referenda Precompile 的 placeDecisionDeposit 函数为 Referenda 放置决策保证金。](/images/builders/ethereum/precompiles/features/governance/referenda/referenda-5.webp)

现在已经放置了决策保证金，提案离进入决策期又近了一步。还需要在指定的 Track 中有足够的容量，并且必须经过准备期的持续时间才能进入决策期。

要对提案进行投票，您可以按照 [Conviction Voting Precompile](builders/ethereum/precompiles/features/governance/conviction-voting/){target=\_blank} 文档中概述的步骤进行操作。

### 退还决策保证金 {: #refund-decision-deposit }

一旦全民投票被批准或拒绝，决策保证金即可退还。只要全民投票没有因提案具有恶意而被取消，情况就是如此。如果提案被认为是恶意的，并通过 Root Track 或 Emergency Killer Track 终止，则决策保证金将被削减。

要退还决策保证金，您可以使用 Referenda 预编译的 `refundDecisionDeposit` 函数。为此，您可以采取以下步骤：

1. 找到 **refundDecisionDeposit** 函数，然后按按钮展开该部分
2. 输入全民投票的索引
3. 按 **transact**，然后在 MetaMask 中确认交易

![使用 Referenda 预编译的 refundDecisionDeposit 函数退还 Referenda 的决策保证金。](/images/builders/ethereum/precompiles/features/governance/referenda/referenda-6.webp)

就是这样！您已完成 Referenda 预编译的介绍。[`Referenda.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=\_blank} 中记录了更多函数 — 如果您对这些函数或 Referenda 预编译的任何其他方面有任何疑问，请随时通过 [Discord](https://discord.com/invite/PfpUATX){target=\_blank} 联系。
