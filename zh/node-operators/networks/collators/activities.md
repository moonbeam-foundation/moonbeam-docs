---
title: Moonbeam Collator 活动
description: 关于如何深入了解成为和维护 Moonbeam 网络中排序人节点的相关活动的说明。
categories: 节点运营者和排序人
---

# Collator 活动

## 简介 {: #introduction }

要成为基于 Moonbeam 的网络上的收集人，您需要满足[绑定要求](/node-operators/networks/collators/requirements/#bonding-requirements){target=\_blank}并加入候选池。进入候选池后，您可以随时调整您的自抵押金额或决定离开池。

如果您希望减少您的自抵押金额或离开候选池，您需要先安排一个离开请求，然后在[延迟期](#collator-timings)过后执行该请求。

本指南将带您了解离开或减少自抵押金额时需要注意的重要时间，如何加入和离开候选池，以及如何调整您的自抵押。

## 整理人计时 {: #collator-timings }

在开始之前，重要的是要注意与整理人活动相关的不同操作的一些时间安排：

=== "Moonbeam"
    |               变量                |                                                                         值                                                                         |
    |:-------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    |            轮次持续时间             |                        {{ networks.moonbeam.staking.round_blocks }} 区块 ({{ networks.moonbeam.staking.round_hours }} 小时)                        |
    |           离开候选人            |    {{ networks.moonbeam.collator_timings.leave_candidates.rounds }} 轮次 ({{ networks.moonbeam.collator_timings.leave_candidates.hours }} 小时)    |
    |           撤销委托           | {{ networks.moonbeam.delegator_timings.revoke_delegations.rounds }} 轮次 ({{ networks.moonbeam.delegator_timings.revoke_delegations.hours }} 小时) |
    |        减少自委托         |       {{ networks.moonbeam.collator_timings.can_bond_less.rounds }} 轮次 ({{ networks.moonbeam.collator_timings.can_bond_less.hours }} 小时)       |
    | 奖励支付（当前轮次之后） |    {{ networks.moonbeam.delegator_timings.rewards_payouts.rounds }} 轮次 ({{ networks.moonbeam.delegator_timings.rewards_payouts.hours }} 小时)    |
    |        最大离线轮次         |         {{ networks.moonbeam.collator_timings.max_offline.rounds }} 轮次 ({{ networks.moonbeam.collator_timings.max_offline.hours }} 小时)         |

=== "Moonriver"
    |               变量                |                                                                          值                                                                          |
    |:-------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |            轮次持续时间             |                        {{ networks.moonriver.staking.round_blocks }} 区块 ({{ networks.moonriver.staking.round_hours }} 小时)                        |
    |           离开候选人            |    {{ networks.moonriver.collator_timings.leave_candidates.rounds }} 轮次 ({{ networks.moonriver.collator_timings.leave_candidates.hours }} 小时)    |
    |           撤销委托           | {{ networks.moonriver.delegator_timings.revoke_delegations.rounds }} 轮次 ({{ networks.moonriver.delegator_timings.revoke_delegations.hours }} 小时) |
    |        减少自委托         |       {{ networks.moonriver.collator_timings.can_bond_less.rounds }} 轮次 ({{ networks.moonriver.collator_timings.can_bond_less.hours }} 小时)       |
    | 奖励支付（当前轮次之后） |    {{ networks.moonriver.delegator_timings.rewards_payouts.rounds }} 轮次 ({{ networks.moonriver.delegator_timings.rewards_payouts.hours }} 小时)    |
    |        最大离线轮次         |         {{ networks.moonriver.collator_timings.max_offline.rounds }} 轮次 ({{ networks.moonriver.collator_timings.max_offline.hours }} 小时)         |

=== "Moonbase Alpha"
    |               变量                |                                                                         值                                                                         |
    |:-------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    |            轮次持续时间             |                        {{ networks.moonbase.staking.round_blocks }} 区块 ({{ networks.moonbase.staking.round_hours }} 小时)                        |
    |           离开候选人            |    {{ networks.moonbase.collator_timings.leave_candidates.rounds }} 轮次 ({{ networks.moonbase.collator_timings.leave_candidates.hours }} 小时)    |
    |           撤销委托           | {{ networks.moonbase.delegator_timings.revoke_delegations.rounds }} 轮次 ({{ networks.moonbase.delegator_timings.revoke_delegations.hours }} 小时) |
    |        减少自委托         |       {{ networks.moonbase.collator_timings.can_bond_less.rounds }} 轮次 ({{ networks.moonbase.collator_timings.can_bond_less.hours }} 小时)       |
    | 奖励支付（当前轮次之后） |    {{ networks.moonbase.delegator_timings.rewards_payouts.rounds }} 轮次 ({{ networks.moonbase.delegator_timings.rewards_payouts.hours }} 小时)    |
    |        最大离线轮次         |         {{ networks.moonbase.collator_timings.max_offline.rounds }} 轮次 ({{ networks.moonbase.collator_timings.max_offline.hours }} 小时)         |

!!! note
    先前表格中显示的值可能会在将来的版本中更改。

--8<-- 'zh/text/_common/async-backing.md'

## 成为候选人 {: #become-a-candidate }

### 获取候选池的大小 {: #get-the-size-of-the-candidate-pool }

首先，您需要获取 `candidatePool` 的大小（这可以通过治理来更改），因为您需要在稍后的交易中提交此参数。为此，您必须从 [Polkadot.js](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/js){target=\_blank} 中运行以下 JavaScript 代码片段：

```js
--8<-- 'code/node-operators/networks/collators/activities/1.js'
```

前往 **Developer** 选项卡，从下拉列表中选择 **JavaScript**，然后执行以下步骤：

 1. 从之前的代码段中复制代码并将其粘贴到代码编辑器框中。（可选）单击保存图标并为代码段设置一个名称，例如“Get candidatePool size”。这会将代码段保存在本地
 2. 要执行代码，请单击运行按钮
 3. 复制结果，因为在加入候选池时需要它

![获取候选人数量](/images/node-operators/networks/collators/activities/activities-1.webp)

### 加入候选人池 {: #join-the-candidate-pool }

一旦您的节点运行并与网络同步，您就成为候选人并加入候选人池。根据您连接到的网络，请转到 [Polkadot.js](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/accounts){target=\_blank}，点击 **Developer** 选项卡，从下拉列表中选择 **Extrinsics**，然后执行以下步骤：

 1. 选择您要成为收集人的帐户。确认您的帐户已至少存入[所需的最低权益](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=\_blank}加上一些额外的交易费用
 2. 在 **submit the following extrinsic** 菜单下选择 **parachainStaking** pallet
 3. 打开下拉菜单，其中列出了所有与权益相关的可能的外部因素，然后选择 **joinCandidates** 函数
 4. 将保证金设置为至少[最低金额](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=\_blank}，以便被视为候选人。您需要以 `Wei` 为单位输入此金额。例如，Moonbase Alpha 上的 {{ networks.moonbase.staking.min_can_stk }} DEV 的最低保证金为 `{{ networks.moonbase.staking.min_can_stk_wei }}` Wei ({{ networks.moonbase.staking.min_can_stk }} + 18 个额外的零)。只有备选保证金才会计入此检查。额外的委托不算数
 5. 将候选人计数设置为候选人池大小。要了解如何检索此值，请查看[获取候选人池大小](#get-the-size-of-the-candidate-pool)部分
 6. 提交交易。按照向导操作，并使用您为帐户设置的密码签署交易

![通过 Polkadot.js 加入候选人池](/images/node-operators/networks/collators/activities/activities-2.webp)

!!! note
    函数名称和最低保证金要求可能会在未来的版本中更改。

如前所述，只有委托权益最高的候选人才能进入活跃的收集人集合。每个网络中排名前列的候选人的确切数量和最低保证金金额可在[最低收集人保证金](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=\_blank}部分中找到。

## 停止整理 {: #stop-collating }

要停止整理并离开候选池，您必须首先安排一个离开该池的请求。安排请求会自动将您从活跃集中移除，因此您将不再有资格生成区块或赚取奖励。您必须等待 [退出延迟](#collator-timings) 的持续时间，然后才能执行离开的请求。请求执行后，您将从候选池中移除。

类似于 [Polkadot 的 `chill()`](https://docs.polkadot.com/infrastructure/running-a-validator/operational-tasks/pause-validating/){target=\_blank} 功能，您可以 [暂时离开候选池](#temporarily-leave-the-candidate-pool) 而无需解绑您的代币。

### 安排离开候选人请求 {: #schedule-request-to-leave-candidates }

要开始并安排请求，请导航到**开发人员**选项卡，单击**外部因素**，然后执行以下步骤：

 1. 选择您的候选人帐户
 2. 在**提交以下外部因素**菜单下选择 **parachainStaking** pallet
 3. 选择 **scheduleLeaveCandidates** 外部因素
 4. 输入您应该在[获取候选池大小](#get-the-size-of-the-candidate-pool)部分中检索到的 `candidateCount`
 5. 提交交易。按照向导操作，并使用您为该帐户设置的密码签署交易

![安排离开候选人请求](/images/node-operators/networks/collators/activities/activities-3.webp)

### 执行离开候选人的请求 {: #execute-request-to-leave-candidates }

等待期过后，您就可以执行该请求了。要执行离开候选人池的请求，您首先需要获得候选人的委托数量。为此，您可以查询候选人信息，其中将包括委托计数。要开始，请单击**开发者**选项卡，选择**链状态**，然后按照以下步骤操作：

 1. 从**选定的状态查询**下拉菜单中，选择 **parachainStaking**
 2. 选择 **candidateInfo** 外部函数
 3. 选择要获取信息的候选人帐户
 4. 单击 **+** 按钮提交外部函数
 5. 复制 **`delegationCount`** 以用于执行离开候选人的请求

![获取委托计数](/images/node-operators/networks/collators/activities/activities-4.webp)

现在您已经获得了委托计数，您可以执行该请求了。切换回 **外部函数** 选项卡，然后按照以下步骤操作：

 1. 选择您的候选人帐户
 2. 在 **提交以下外部函数** 菜单下选择 **parachainStaking** pallet
 3. 选择 **executeLeaveCandidates** 外部函数
 4. 选择目标候选人帐户（在提交 `scheduleLeaveCandidates` 外部函数后，退出延迟过去后，任何人都可以执行该请求）
 5. 输入候选人的委托计数
 6. 提交交易。按照向导操作，并使用您为该帐户设置的密码签署交易

![执行离开候选人的请求](/images/node-operators/networks/collators/activities/activities-5.webp)

### 取消离开候选人的请求 {: #cancel-request-to-leave-candidates }

如果您安排了离开候选人池的请求但改变了主意，只要请求尚未执行，您可以取消请求并保留在候选人池中。要取消请求，请确保您已点击 **Developer** 选项卡中的 **Extrinsics**，然后按照以下步骤操作：

 1. 选择您的候选人帐户
 2. 在 **submit the following extrinsic** 菜单下选择 **parachainStaking** 托盘
 3. 选择 **cancelLeaveCandidates** 外部调用
 4. 提供您应该在 [获取候选人池的大小](#get-the-size-of-the-candidate-pool) 部分检索到的 `candidateCount`
 5. 提交交易。按照向导操作，并使用您为该帐户设置的密码签署交易

![取消离开候选人的请求](/images/node-operators/networks/collators/activities/activities-6.webp)

### 临时离开候选池 {: #temporarily-leave-the-candidate-pool }

如果您想暂时离开候选池，可以使用 `goOffline` 方法轻松实现。例如，如果您需要暂时离开以执行维护操作，这将非常有用。完成后，您可以使用 `goOnline` 方法重新加入池。

要暂时离开，您可以按照以下步骤操作：

 1. 导航到**开发者**选项卡
 2. 点击**Extrinsics**
 3. 选择您的候选人账户
 4. 在**提交以下 extrinsic** 菜单下选择 **parachainStaking** pallet
 5. 选择 **goOffline** extrinsic
 6. 提交交易。按照向导操作，并使用您为该账户设置的密码签署交易

![暂时离开候选池](/images/node-operators/networks/collators/activities/activities-7.webp)

然后，每当您希望重新加入时，您可以按照上述相同的步骤使用 `goOnline` 方法，然后在第 5 步中，选择 `goOnline` extrinsic。请注意，只有在您之前调用过 `goOffline` 的情况下，才能调用 `goOnline`。

## 更改自抵押金额 {: #change-self-bond-amount }

作为候选人，更改您的自抵押金额会略有不同，具体取决于您是增加还是减少抵押。如果您要增加抵押，这是一个简单的过程，您可以通过 `candidateBondMore()` 外部函数来增加您的权益。您无需等待任何延迟，也无需安排请求然后执行它；相反，您的请求将立即自动执行。

如果您希望减少抵押，则必须安排一个请求，等待[退出延迟](#collator-timings)，然后您将能够执行该请求并将指定数量的代币 वापस 返回到您的自由余额中。换句话说，安排请求不会立即或自动减少抵押；只有在执行请求后才会减少。

### 增加保证金 {: #bond-more }

作为候选人，有两种增加抵押的方法。第一种也是推荐的方法是将要抵押的资金发送到另一个拥有的地址，然后[委托给您的整理人](/tokens/staking/stake/#how-to-nominate-a-collator)。或者，已经抵押了至少[最低自抵押金额](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=\_blank}的整理人可以从 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonriver.moonbeam.network#/accounts){target=\_blank} 增加其保证金。导航到 **开发者** 选项卡，点击 **外部调用**，然后按照以下步骤操作：

 1. 选择您的整理人帐户（并验证它是否包含要抵押的额外资金）
 2. 在 **提交以下外部调用** 菜单下选择 **parachainStaking** 托盘
 3. 打开下拉菜单，其中列出了所有与抵押相关的可能的外部调用，然后选择 **candidateBondMore** 函数
 4. 在 **more: BalanceOf** 字段中指定要抵押的额外数额
 5. 提交交易。按照向导操作，并使用您为帐户设置的密码签署交易

![整理人增加保证金](/images/node-operators/networks/collators/activities/activities-8.webp)

### 减少抵押 {: #bond-less}

作为排序人或排序人候选人，只要在减少抵押后，您的抵押数量多于[最低自抵押数量](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=\_blank}，您就可以减少您的抵押数量。

为了减少抵押，您必须首先安排一个请求，等待[退出延迟](#collator-timings)的持续时间，然后执行该请求。只要请求尚未执行，您可以随时[取消请求](#cancel-bond-less-request)。

#### 安排减少绑定请求 {: #schedule-bond-less }

要安排减少绑定的请求，请确保您已点击**Developer**标签并点击**Extrinsics**，然后您可以按照以下步骤操作：

 1. 选择您的候选人帐户
 2. 在**submit the following extrinsic**菜单下选择**parachainStaking** pallet
 3. 打开下拉菜单并选择**scheduleCandidateBondLess**函数
 4. 在 **less: BalanceOf** 字段中指定要减少的绑定金额
 5. 提交交易。按照向导操作，并使用您为帐户设置的密码签署交易

![安排候选人减少绑定](/images/node-operators/networks/collators/activities/activities-9.webp)

交易确认后，您必须等待退出延迟时间，然后才能执行并减少绑定金额。如果您尝试在退出延迟之前执行请求，您的 extrinsic 将会失败，并且您会在 Polkadot.js 中看到 `parachainStaking.PendingDelegationRequest` 的错误。

#### 执行减少保证金请求 {: #execute-bond-less-request }

在安排减少保证金请求的退出延迟时间过后，您可以执行该请求以实际减少保证金金额。前往**开发者**选项卡，选择**Extrinsics**，然后按照以下步骤操作：

 1. 选择一个帐户来执行请求
 2. 在**提交以下 extrinsic** 菜单下选择 **parachainStaking** pallet
 3. 选择 **executeCandidateBondLess** extrinsic
 4. 选择目标候选人帐户（在提交 `scheduleCandidateBondLess` 后，退出延迟时间过后，任何人都可以执行该请求）
 5. 提交交易。按照向导操作，并使用您为帐户设置的密码签署交易

![执行减少候选人保证金](/images/node-operators/networks/collators/activities/activities-10.webp)

交易确认后，您可以从**帐户**选项卡检查您的可用和保留余额，并注意到现在执行已经完成，您的余额已更新。

#### 取消减少质押请求 {: #cancel-bond-less-request }

如果您安排了增加或减少质押的请求，但改变了主意，只要该请求尚未执行，您可以随时取消该请求并保持您的质押金额不变。要取消请求，请前往“**开发者**”选项卡，选择“**Extrinsics**”，然后按照以下步骤操作：

 1. 选择您的候选人帐户（并验证它是否包含要质押的额外资金）
 2. 在“**submit the following extrinsic**”菜单下选择 **parachainStaking** pallet
 3. 选择 **cancelCandidateBondRequest** extrinsic
 4. 提交交易。按照向导操作，并使用您为帐户设置的密码签署交易

![取消离开候选人请求](/images/node-operators/networks/collators/activities/activities-11.webp)

## 将整理人标记为非活跃状态 {: #mark-collator-as-inactive }

如果某个非活跃整理人连续多个轮次未产生区块，您可以将该整理人标记为非活跃状态。一个整理人可以离线的最长轮次数如下：

=== "Moonbeam"

    {{ networks.moonbeam.collator_timings.max_offline.rounds }} 轮（{{ networks.moonbeam.collator_timings.max_offline.hours }} 小时）

=== "Moonriver"

    {{ networks.moonriver.collator_timings.max_offline.rounds }} 轮（{{ networks.moonriver.collator_timings.max_offline.hours }} 小时）

=== "Moonbase Alpha"

    {{ networks.moonbase.collator_timings.max_offline.rounds }} 轮（{{ networks.moonbase.collator_timings.max_offline.hours }} 小时）

要将整理人标记为非活跃状态，您可以使用 `notifyInactiveCollator` extrinsic，它会在整理人处于非活跃状态时通知运行时，并且默认情况下将整理人标记为离线。为此，您可以前往 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/accounts){target=\_blank}，确保您已连接到正确的网络，然后点击 **Developer** 选项卡，从下拉菜单中选择 **Extrinsics**，然后执行以下步骤：

 1. 选择您的帐户
 2. 在 **submit the following extrinsic** 菜单下选择 **parachainStaking** pallet
 3. 选择 **notifyInactiveCollator** extrinsic
 4. 指定要标记为非活跃状态的整理人
 5. 提交交易。按照向导操作，并使用您为帐户设置的密码签署交易

![将整理人标记为非活跃状态](/images/node-operators/networks/collators/activities/activities-12.webp)

该整理人将被暂时从候选池中移除，并且他们可以随时通过调用 `goOnline` extrinsic 重新加入。
