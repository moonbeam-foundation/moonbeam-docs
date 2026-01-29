---
title: 如何质押您的 MOVR 和 GLMR 代币
description: 本指南介绍如何通过委托收集人候选人来质押您的代币并在 Moonbeam 上赚取奖励。
categories: Staking
---

# 如何质押您的代币

## 简介 {: #introduction }

在网络中拥有最高权益的 Collator 候选者将加入 Collator（区块生产者）的活跃池，他们将从中被选中，向中继链提供区块。

代币持有者可以使用他们的代币来增加候选者的权益，这个过程称为委托（也称为质押）。当他们这样做时，他们相当于在为该特定候选者担保，并且他们的委托是一种信任信号。在委托时，代币会被立即扣除并添加到用户质押的总金额中。退出头寸分为两个步骤操作：计划和执行。首先，代币持有者必须计划一个退出其头寸的请求，并等待给定的延迟或解绑期，这取决于网络。一旦解绑期到期，用户可以执行他们计划的操作。

一旦候选人加入 Collator 的活跃集合，他们就有资格生产区块并获得部分区块奖励，作为代币通胀模型的一部分。他们会与他们的委托人分享这些奖励作为质押奖励，考虑到他们对网络中权益的按比例贡献。委托人可以选择自动复投他们的奖励，以便将其奖励的设定百分比自动应用于他们的总委托金额。

本指南将向您展示如何通过 Polkadot.js Apps 在 Moonbase Alpha 上进行质押，但对于 Moonbeam 和 Moonriver，可以采取类似的步骤。想要轻松质押代币的代币持有者可以使用 [Moonbeam dApp](https://apps.moonbeam.network){target=\_blank} 来进行质押。

有关质押的更多一般信息，请查看 [Moonbeam 上的质押](/learn/features/staking/){target=\_blank} 概述。

## 外在函数定义 {: #extrinsics-definitions }

有许多与Staking Pallet相关的外在函数；您可以直接在 Polkadot.js Apps 中或通过查看链元数据来浏览完整列表。

以下列表涵盖了您将在本指南中使用并与委托流程相关的外在函数。

!!! note
    随着Staking Pallet的更新，外在函数将来可能会发生变化。

### 加入委托人集合 {: #join-or-leave-the-delegator-set }

 - **delegateWithAutoCompound**(*address* candidate, *uint256* amount, *uint8* autoCompound, *uint256* candidateDelegationCount, *uint256* candidateAutoCompoundingDelegationCount, *uint256* delegatorDelegationCount) - 用于将给定数量委托给整理人的外部因素。金额需要大于最小委托股份。这也会设置自动复利奖励的百分比

### 增加或减少质押  {: #bond-more-or-less }

 - **delegatorBondMore**(*address* candidate, *uint256* more) - 用于请求增加已委托的整理人的质押代币数量的外部函数
 - **scheduleDelegatorBondLess**(*address* candidate, *uint256* less) - 用于请求减少已委托的整理人的质押代币数量的外部函数。该数量不得使您的总质押量低于最低委托质押量。在您可以通过 `executeDelegationRequest` 外部函数执行请求之前，会有一个[减少质押延迟](/learn/features/staking/#:~:text=Decrease delegation delay){target=\_blank}
 - **executeDelegationRequest**(*address* delegator, *address* candidate) - 用于执行和挂起的委托请求的外部函数。此外部函数应仅在请求已安排且退出延迟已过后使用
 - **scheduleCandidateBondLess**(*uint256* less) - 允许整理人候选人请求减少其自抵押一定数量的外部函数。在您可以通过 `executeCandidateBondLess` 外部函数执行请求之前，会有一个[减少质押延迟](/node-operators/networks/collators/activities/#:~:text=Reduce self-delegation){target=\_blank}
 - **executeCandidateBondLess**(*address* candidate) - 用于执行减少候选人的自抵押金额的外部函数。此外部函数应仅在抵押请求已安排且退出延迟已过后使用
 - **cancelCandidateBondLess**() - 用于取消已安排的增加或减少特定候选人的抵押的请求的外部函数

### 撤销委托 {: #revoke-delegations }

 - **scheduleRevokeDelegation**(*address* collator) - 用于安排完全移除现有委托的外部函数。在您通过 [`executeDelegationRequest`](#:~:text=executeDelegationRequest(address delegator, address candidate)) 外部函数执行请求之前，会有一个[撤销委托延迟](/learn/features/staking/#:~:text=Revoke delegations delay){target=\_blank}
 - **cancelDelegationRequest**(*address* candidate) - 外部函数，用于取消计划撤销委托的请求

### 设置或更改自动复利百分比 {: #set-change-auto-compounding }

 - **setAutoCompound**(*address* candidate, *uint8* value, *uint256* candidateAutoCompoundingDelegationCount, *uint256* delegatorDelegationCount) - 为现有委托设置自动复利值

## 检索 Staking 值 {: #retrieving-staking-parameters }

您可以使用 Polkadot.js Apps 查看任何恒定的 Staking 值，例如最大委托数、最低抵押要求、委托请求的退出延迟等。

为此，您可以导航到 Polkadot.js Apps **Chain state** UI，并且为了本指南的目的，连接到 [Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/chainstate){target=\_blank}。或者，您可以连接到 [Moonbeam](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network/#chainstate){target=\_blank} 或 [Moonriver](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonriver.moonbeam.network/#chainstate){target=\_blank}。

然后，要检索各种 Staking 参数，请在 **Chain state** UI 上选择 **Constants** 选项卡，并按照以下步骤操作：

1. 从 **selected constant query（选择的常量查询）** 下拉列表中，选择 **parachainStaking**
2. 选择您想要获取数据的任何函数。对于此示例，您可以使用 **maxDelegationsPerDelegator**。这将返回您可以委托的最大候选人数
3. 单击 **+** 以返回当前值

![检索 Staking 参数](/images/tokens/staking/stake/stake-1.webp)

然后，您应该会看到每个委托人的最大委托数，这也可以在 [Moonbeam 上的 Staking](/learn/features/staking/#quick-reference){target=\_blank} 概述中找到。

## 如何通过 Polkadot.js Apps 质押和自动复利奖励 {: #how-to-delegate-a-candidate }

本节介绍了委托整理人候选人的过程。在本指南中使用的 Moonbase Alpha 上的整理人候选人的地址是 `{{ networks.moonbase.staking.candidates.address1 }}`。

在使用 Polkadot.js Apps 进行质押之前，您需要检索一些重要参数，例如候选人列表、您要委托的候选人的委托计数以及您的委托数量。要自动复利您的委托奖励，您还需要您要委托的候选人的自动复利委托计数。

### 检索候选人列表 {: #retrieving-the-list-of-candidates }

在开始质押代币之前，重要的是检索网络中可用的整理人候选人列表。为此，请前往**Developer**选项卡，点击**Chain State**，然后按照以下步骤操作：

 1. 选择要交互的 pallet。在本例中，它是 **parachainStaking** pallet
 2. 选择要查询的状态。在本例中，它是 **selectedCandidates** 或 **candidatePool** 状态
 3. 通过点击 **+** 按钮发送状态查询

每个 extrinsic 提供不同的响应：

 - **selectedCandidates** — 返回当前活跃的整理人集合，即按质押代币总数（包括委托）排名的顶部整理人候选人。例如，在 Moonbase Alpha 上，它是顶部 {{ networks.moonbase.staking.max_candidates }} 个候选人
 - **candidatePool** — 返回当前所有候选人的列表，包括那些不在活跃集合中的候选人

![质押账户](/images/tokens/staking/stake/stake-2.webp)

### 获取候选人委托计数 {: #get-the-candidate-delegation-count }

首先，你需要获取`candidateInfo`，其中包含委托人计数，因为你需要在后续交易中提交此参数。要检索该参数，请确保你仍在**开发者**页面的**链状态**选项卡上，然后执行以下步骤：

 1. 选择要交互的 **parachainStaking** pallet
 2. 选择要查询的 **candidateInfo** 状态
 3. 确保已启用 **include option** 滑块
 4. 输入 collator 候选人的地址
 5. 单击 **+** 按钮发送状态查询
 6. 复制结果，因为在发起委托时需要它

![获取候选人委托计数](/images/tokens/staking/stake/stake-3.webp)

### 获取候选人自动复利委托计数 {: #get-candidate-auto-compounding-count }

自动复利委托计数是已配置自动复利的委托数量。要确定设置了自动复利的委托数量，您可以使用以下代码段在 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/js){target=\_blank} 上查询候选人的自动复利委托：

```js
// Simple script to get the number of auto-compounding delegations for a given candidate.
// Remember to replace INSERT_CANDIDATE_ADDRESS with the candidate's address you want to delegate.
const candidateAccount = 'INSERT_CANDIDATE_ADDRESS';
const autoCompoundingDelegations =
  await api.query.parachainStaking.autoCompoundingDelegations(candidateAccount);
console.log(autoCompoundingDelegations.toHuman().length);
```

要运行此代码段，请确保您位于 Polkadot.js Apps 的 **JavaScript** 页面（可以从**开发者**下拉菜单中选择），并执行以下步骤：

 1. 从前面的代码段中复制代码并将其粘贴到代码编辑器框中
 2. （可选）单击保存图标并为代码段设置一个名称，例如，**获取自动复利委托计数**。这将在本地保存代码段
 3. 要执行代码，请单击运行按钮
 4. 复制结果，因为在启动委托时需要它

![获取候选人自动复利委托计数](/images/tokens/staking/stake/stake-4.webp)

### 获取您现有的委托数量 {: #get-your-number-of-existing-delegations }

如果您从未使用该地址进行过委托，您可以跳过本节。不过，如果您不确定自己已有多少条委托记录，建议在 [Polkadot.js](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/js){target=\_blank} 中运行以下 JavaScript 代码片段，以获取 `delegationCount`：

```js
// Simple script to get your number of existing delegations.
// Remember to replace INSERT_YOUR_ADDRESS with your delegator address.
const yourDelegatorAccount = 'INSERT_YOUR_ADDRESS'; 
const delegatorInfo = 
  await api.query.parachainStaking.delegatorState(yourDelegatorAccount);

if (delegatorInfo.toHuman()) {
  console.log(delegatorInfo.toHuman()['delegations'].length);
} else {
  console.log(0);
}
```

前往 **开发者** 选项卡并单击 **JavaScript**，然后按以下步骤操作：

 1. 从上一段代码中复制并粘贴到代码编辑器框中
 2. （可选）单击保存图标并为代码段设置一个名称，例如 **获取委托数量**。这会将代码段保存在本地
 3. 单击运行按钮执行代码
 4. 复制输出结果，因为在发起委托时需要用到

![获取现有委托计数](/images/tokens/staking/stake/stake-5.webp)

### 质押您的代币 {: #staking-your-tokens }

要访问质押功能，您需要使用 Polkadot.js Apps 界面。为此，您需要首先导入/创建一个以太坊风格的帐户（H160 地址），您可以通过遵循 Polkadot.js 指南的[创建或导入 H160 帐户](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=\_blank}部分来完成。

在此示例中，导入了一个帐户，并以一个超级原始的名称命名：Alice。Alice 的地址是 `0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`。

要委托一个侯选人并为您的质押奖励设置自动复利，请执行以下步骤：

 1. 选择您要从中质押代币的帐户
 2. 选择 **parachainStaking** pallet
 3. 选择 **delegateWithAutoCompound** extrinsic
 4. 设置要委托的侯选人的地址。在本例中，它被设置为 `{{ networks.moonbase.staking.candidates.address1 }}`
 5. 设置您要质押的代币数量
 6. 通过输入 0-100 之间的数字来设置自动复利的奖励百分比
 7. 输入您[之前从查询 `candidateInfo` 中检索到的 `candidateDelegationCount`](#get-the-candidate-delegation-count)
 8. 输入您[之前从查询 `autoCompoundingDelegations` 中检索到的 `candidateAutoCompoundingDelegationCount`](#get-candidate-auto-compounding-count)
 9. 输入[您从 JavaScript 控制台中检索到的 `delegationCount`](#get-your-number-of-existing-delegations)。如果您尚未委托任何侯选人，则为 `0`
 10. 单击 **提交交易** 按钮并签署交易

![质押加入委托人 Extrinsics](/images/tokens/staking/stake/stake-6.webp)

!!! note
    步骤 7-9 中使用的参数用于 gas 估算，不需要完全准确。但是，它们不应低于实际值。

### 验证委托 {: #verifying-delegations }

交易确认后，您可以通过导航至**开发者**选项卡下的**链状态**来验证您的委托。在此处，提供以下信息：

 1. 选择您想要交互的 pallet。在本例中，它是 **parachainStaking** pallet
 2. 选择要查询的状态。在本例中，它是 **delegatorState**
 3. 验证所选地址是否正确。在本例中，您正在查看 Alice 的帐户
 4. 确保启用 **include option** 滑块
 5. 点击 **+** 按钮发送状态查询

![验证委托](/images/tokens/staking/stake/stake-7.webp)

在响应中，您应该看到您的帐户（在本例中为 Alice 的帐户）以及委托列表。每个委托都包含候选人的目标地址和数量。

您可以按照所述的相同步骤来委托网络中的其他候选人。

### 验证自动复利百分比 {: #verifying-auto-compounding-percentage }

如果您想验证为特定委托设置自动复利的奖励百分比，您可以使用以下脚本查询 `autoCompoundingDelegations` extrinsic，并根据委托人的地址过滤结果：

```js
// Simple script to verify your auto-compounding percentage for a given candidate.
// Remember to replace INSERT_CANDIDATE_ADDRESS with the candidate's address you
// want to delegate and replace INSERT_DELEGATOR_ADDRESS with the address used to 
const candidateAccount = 'INSERT_CANDIDATE_ADDRESS';
const delegationAccount = 'INSERT_DELEGATOR_ADDRESS';
const autoCompoundingDelegations =
  await api.query.parachainStaking.autoCompoundingDelegations(candidateAccount);
const delegation = autoCompoundingDelegations.find(
  (del) => del.delegator == delegationAccount
);

console.log(`${delegation.value}%`);
```

在 Polkadot.js Apps 中，您可以前往 **Developer** 选项卡，然后从下拉列表中选择 **JavaScript**。然后，您可以按照以下步骤操作：

 1. 从前面的代码段中复制代码，并将其粘贴到代码编辑器框中
 2. （可选）单击保存图标，并为代码段设置一个名称，例如 **Get auto-compounding percentage**。这会将代码段保存在本地
 3. 要执行代码，请单击运行按钮
 4. 结果将返回到右侧的终端中

![验证自动复利百分比](/images/tokens/staking/stake/stake-8.webp)

## 设置或更改自动复利百分比 {: #set-or-change-auto-compounding }

如果您最初设置委托时未启用自动复利，或者您想要更新已设置自动复利的现有委托的百分比，您可以使用 Solidity 界面的 `setAutoCompound` 函数。

您需要[获取要设置或更新自动复利的候选人的已设置自动复利的委托数量](#get-candidate-auto-compounding-count)。您还需要[检索您自己的委托数量](#get-your-number-of-existing-delegations)。获得必要的信息后，您可以单击**开发者**选项卡，从下拉列表中选择**Extrinsics**，然后按照以下步骤操作：

 1. 选择您最初从中委托并要设置或更新自动复利的帐户
 2. 选择 **parachainStaking** pallet
 3. 选择 **setAutoCompound** extrinsic
 4. 设置您委托的候选人地址。在此示例中，它设置为 `{{ networks.moonbase.staking.candidates.address1 }}`
 5. 通过输入一个 0-100 的数字来设置要自动复利的奖励百分比
 6. 对于 **candidateAutoCompoundingDelegationHint** 字段，输入配置了自动复利的候选人的委托数量
 7. 对于 **delegationCountHint** 字段，输入您的委托数量
 8. 单击**提交交易**按钮并签署交易

![Staking Chain State Query](/images/tokens/staking/stake/stake-9.webp)

## 如何停止委托 {: #how-to-stop-delegations }

从 [运行时版本 1001](https://moonbeam.network/news/moonriver-technical-update-staking-changes-as-part-of-runtime-upgrade-1001){target=\_blank} 开始，用户与各种质押功能互动的方式发生了重大变化。包括处理质押退出的方式。

如果您想退出并停止委托，您必须首先安排它，等待退出延迟，然后执行退出请求。如果您已经是委托人，您可以使用 `scheduleRevokeDelegation` extrinsic 请求停止您的委托，以请求从特定的整理人候选人处取消质押您的代币。安排请求不会自动撤销您的委托，您必须等待 [退出延迟](/learn/features/staking/#quick-reference){target=\_blank}，然后使用 `executeDelegationRequest` 方法执行请求。

### 安排请求停止委托 {: #schedule-request-to-stop-delegations }

要安排撤销您对特定候选人的委托的请求，请导航到**开发者**选项卡下的 **Extrinsics** 菜单。在此处，提供以下信息：

 1. 选择您要从中删除委托的帐户
 2. 选择 `parachainStaking` pallet
 3. 选择 `scheduleRevokeDelegation` extrinsic
 4. 设置您要从中删除委托的候选人的地址。在这种情况下，它设置为 `{{ networks.moonbase.staking.candidates.address1 }}`
 5. 单击 **Submit Transaction** 按钮并签署交易

![Staking Schedule Request to Revoke Delegation Extrinsic](/images/tokens/staking/stake/stake-10.webp)

!!! note
    每个候选人只能有一个待处理的计划请求。

安排退出后，您必须等待一个 [退出延迟](/learn/features/staking/#quick-reference){target=\_blank} 才能执行它。如果您尝试在退出延迟结束前执行它，则 extrinsic 将失败，并且您会从 Polkadot.js Apps 看到 `parachainStaking.PendingDelegationRequest` 的错误。

### 执行停止委托的请求 {: #execute-request-to-stop-delegations }

在启动计划请求后经过退出延迟后，您可以返回**Extrinsics**菜单的**Developer**选项卡，并按照以下步骤执行请求：

 1. 选择要执行撤销的帐户
 2. 选择 **parachainStaking** pallet
 3. 选择 **executeDelegationRequest** extrinsic
 4. 设置您要删除其委托的委托人的地址。对于此示例，它将是 Alice 的地址 `0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`
 5. 设置您要从中删除委托的候选人的地址。在这种情况下，它被设置为 `{{ networks.moonbase.staking.candidates.address1 }}`
 6. 点击**Submit Transaction**按钮并签署交易

![Staking Execute Revoke Delegation Extrinsic](/images/tokens/staking/stake/stake-11.webp)

交易确认后，您可以通过转到**Developer**选项卡下的**Chain state**选项来验证您的委托是否已删除。在这里，提供以下信息：

 1. 选择 **parachainStaking** pallet
 2. 选择 **delegatorState** 状态以进行查询
 3. 选择您的帐户
 4. 确保启用**include options**滑块
 5. 通过单击 **+** 按钮发送状态查询

![Staking Verify Delegation is Revoked](/images/tokens/staking/stake/stake-12.webp)

在响应中，您应该看到您的帐户（在本例中为 Alice 的帐户）以及剩余委托的列表。每个委托都包含候选人的目标地址和金额。不应再有 `{{ networks.moonbase.staking.candidates.address1 }}` 的条目。如果您不再有任何委托，将返回 `<none>`。

为确保撤销按预期进行，您可以按照上面[验证委托](#verifying-delegations)部分中的步骤操作。

### 取消停止委托的请求 {: #cancel-request-to-stop-delegations }

如果您已安排停止委托的请求但改变了主意，只要该请求尚未执行，您可以随时取消该请求，并且您的所有委托将保持不变。要取消请求，您可以按照以下步骤操作：

1. 选择要取消计划请求的帐户
2. 选择 **parachainStaking** pallet
3. 选择 **cancelDelegationRequest** extrinsic
4. 输入与您要取消的到期请求相对应的候选人地址
5. 单击 **提交交易** 按钮并签署交易

![Staking 取消计划的撤销委托请求](/images/tokens/staking/stake/stake-13.webp)

## 质押奖励 {: #staking-rewards }

由于整理人的活跃集合中的候选人会从区块生产中获得奖励，因此委托人也会获得奖励。有关如何计算奖励的简要概述，请参见 Moonbeam 质押概述页面的[奖励分配部分](/learn/features/staking/#reward-distribution){target=\_blank}。

总而言之，委托人将根据其在获得奖励的整理人的总委托中所占的股份（包括整理人的股份）来获得奖励。

委托人可以选择自动复投其奖励，以便将其奖励自动应用于其总委托金额。如果委托人有多个委托，则需要为每个委托设置自动复投。

--8<-- 'zh/text/_disclaimers/staking-risks.md'
*质押的 MOVR/GLMR 代币会被锁定，取回它们需要 {{ networks.moonriver.delegator_timings.del_bond_less.days }} 天/{{ networks.moonbeam.delegator_timings.del_bond_less.days }} 天的等待期。*
--8<-- 'zh/text/_disclaimers/staking-risks-part-2.md'
