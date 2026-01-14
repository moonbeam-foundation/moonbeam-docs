---
title: 抵押预编译合约
description: 通过专门的预编译合约释放抵押的潜力，该合约旨在简化和优化 Moonbeam 中的参与。
keywords: solidity, ethereum, staking, moonbeam, precompiled, contracts
categories: Precompiles, Ethereum Toolkit
---

# 与 Staking 预编译交互

## 简介 {: #introduction }

Moonbeam 通过平行链 Staking Pallet 使用委托权益证明系统，允许代币持有者（委托人）准确地表达他们希望支持哪些验证人候选人以及支持的权益数量。平行链 Staking Pallet 的设计使其能够在链上强制执行委托人和候选人之间的共享风险/奖励。有关 Staking 的一般信息，例如一般术语、Staking 变量等，请参阅[Moonbeam 上的 Staking](/learn/features/staking/){target=_blank}页面。

Staking 模块使用 Rust 编写，它是 pallet 的一部分，通常无法从 Moonbeam 的 Ethereum 端访问。但是，Staking 预编译允许开发人员通过位于以下地址的预编译合约使用 Ethereum API 访问 Staking 功能：

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.staking}}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.staking}}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.staking}}
     ```

本指南将介绍 Staking 预编译接口中的可用方法。此外，它还将向您展示如何通过 Staking 预编译和 Ethereum API 与平行链 Staking Pallet 进行交互。本指南中的示例是在 Moonbase Alpha 上完成的，但它们可以适用于 Moonbeam 或 Moonriver。

--8<-- 'text/builders/ethereum/precompiles/security.md'

## 退出延迟 {: #exit-delays }

Parachain Staking Pallet 的一些外部调用包含退出延迟，您必须等待才能执行该请求。需要注意的退出延迟如下：

===
    |        Variable         |                                                                         Value                                                                         |
    |:-----------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    | Decrease candidate bond |       {{ networks.moonbeam.collator_timings.can_bond_less.rounds }} 轮（{{ networks.moonbeam.collator_timings.can_bond_less.hours }} 小时）       |
    | Decrease delegator bond |      {{ networks.moonbeam.delegator_timings.del_bond_less.rounds }} 轮（{{ networks.moonbeam.delegator_timings.del_bond_less.hours }} 小时）      |
    |    Revoke delegation    | {{ networks.moonbeam.delegator_timings.revoke_delegations.rounds }} 轮（{{ networks.moonbeam.delegator_timings.revoke_delegations.hours }} 小时） |
    |    Leave candidates     |    {{ networks.moonbeam.collator_timings.leave_candidates.rounds }} 轮（{{ networks.moonbeam.collator_timings.leave_candidates.hours }} 小时）    |
    |    Leave delegators     |   {{ networks.moonbeam.delegator_timings.leave_delegators.rounds }} 轮（{{ networks.moonbeam.delegator_timings.leave_delegators.hours }} 小时）   |

===
    |        Variable         |                                                                          Value                                                                          |
    |:-----------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------:|
    | Decrease candidate bond |       {{ networks.moonriver.collator_timings.can_bond_less.rounds }} 轮（{{ networks.moonriver.collator_timings.can_bond_less.hours }} 小时）       |
    | Decrease delegator bond |      {{ networks.moonriver.delegator_timings.del_bond_less.rounds }} 轮（{{ networks.moonriver.delegator_timings.del_bond_less.hours }} 小时）      |
    |    Revoke delegation    | {{ networks.moonriver.delegator_timings.revoke_delegations.rounds }} 轮（{{ networks.moonriver.delegator_timings.revoke_delegations.hours }} 小时） |
    |    Leave candidates     |    {{ networks.moonriver.collator_timings.leave_candidates.rounds }} 轮（{{ networks.moonriver.collator_timings.leave_candidates.hours }} 小时）    |
    |    Leave delegators     |   {{ networks.moonriver.delegator_timings.leave_delegators.rounds }} 轮（{{ networks.moonriver.delegator_timings.leave_delegators.hours }} 小时）   |

===
    |        Variable         |                                                                         Value                                                                         |
    |:-----------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    | Decrease candidate bond |       {{ networks.moonbase.collator_timings.can_bond_less.rounds }} 轮（{{ networks.moonbase.collator_timings.can_bond_less.hours }} 小时）       |
    | Decrease delegator bond |      {{ networks.moonbase.delegator_timings.del_bond_less.rounds }} 轮（{{ networks.moonbase.delegator_timings.del_bond_less.hours }} 小时）      |
    |    Revoke delegation    | {{ networks.moonbase.delegator_timings.revoke_delegations.rounds }} 轮（{{ networks.moonbase.delegator_timings.revoke_delegations.hours }} 小时） |
    |    Leave candidates     |    {{ networks.moonbase.collator_timings.leave_candidates.rounds }} 轮（{{ networks.moonbase.collator_timings.leave_candidates.hours }} 小时）    |
    |    Leave delegators     |   {{ networks.moonbase.delegator_timings.leave_delegators.rounds }} 轮（{{ networks.moonbase.delegator_timings.leave_delegators.hours }} 小时）   |

## 与 Solidity 接口交互 {: #interact-with-solidity-interface }

### 检查先决条件 {: #checking-prerequisites }

以下示例在 Moonbase Alpha 上演示，但 Moonbeam 和 Moonriver 也可以采取类似的步骤。

 - 安装 MetaMask 并[连接到 Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - 拥有一个至少有 `{{networks.moonbase.staking.min_del_stake}}` 代币的帐户。
  --8<-- 'text/_common/faucet/faucet-list-item.md'

!!! note
    由于最低委托金额加上 gas 费用，下面的例子需要超过 `{{networks.moonbase.staking.min_del_stake}}` 代币。如果您需要的比水龙头分配的更多，请在 Discord 上联系我们，我们将很乐意为您提供帮助。

### Remix 设置 {: #remix-set-up }

1. 点击 **文件浏览器** 选项卡
2. 获取 [`StakingInterface.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=_blank} 的副本，并将文件内容粘贴到名为 `StakingInterface.sol` 的 Remix 文件中

![将 Staking 接口复制并粘贴到 Remix 中](/images/builders/ethereum/precompiles/features/staking/staking-1.webp)

### 编译合约 {: #compile-the-contract }

1. 点击顶部的第二个 **编译** 选项卡
2. 然后编译接口，点击 **Compile StakingInterface.sol**

![编译 StakingInterface.sol](/images/builders/ethereum/precompiles/features/staking/staking-2.webp)

### 访问合约 {: #access-the-contract }

1. 点击Remix中**Compile（编译）**选项卡正下方的**Deploy and Run（部署和运行）**选项卡。注意：您不是在此处部署合约，而是访问已部署的预编译合约
2. 确保在**ENVIRONMENT（环境）**下拉列表中选择**Injected Provider - Metamask（注入提供程序 - Metamask）**
3. 确保在**CONTRACT（合约）**下拉列表中选择**ParachainStaking - StakingInterface.sol**。由于这是一个预编译合约，因此无需部署，您需要在**At Address（在地址处）**字段中提供预编译的地址
4. 提供Moonbase Alpha 的 staking 预编译地址：`{{networks.moonbase.precompiles.staking}}`，然后点击**At Address（在地址处）**
5. Parachain Staking 预编译将出现在**Deployed Contracts（已部署合约）**列表中

![提供地址](/images/builders/ethereum/precompiles/features/staking/staking-3.webp)

### 使用自动复利委托整理人 {: #delegate-a-collator }

在此示例中，您将委托一个整理人，并设置在 Moonbase Alpha 上自动复利的奖励百分比。委托人是质押代币并为特定候选人担保的代币持有者。任何在其自由余额中持有至少 {{networks.moonbase.staking.min_del_stake}} 个代币的用户都可以成为委托人。在委托候选人时，您可以同时设置自动复利。您将能够指定奖励的百分比，这些奖励将自动应用于您的总委托。您不必立即设置自动复利，您可以稍后随时执行。

您可以自己进行研究并选择您想要的候选人。在本指南中，将使用以下候选人地址：`{{ networks.moonbase.staking.candidates.address1 }}`。

为了委托候选人，您需要确定候选人当前的委托计数、他们的自动复利委托计数以及您自己的委托计数。

候选人委托计数是支持特定候选人的委托数量。要获得候选人委托人计数，您可以调用 staking 预编译提供的函数。展开 **PARACHAINSTAKING** 合同（在 **Deployed Contracts** 列表下），然后：

1. 找到并展开 **candidateDelegationCount** 函数
2. 输入候选人地址 (`{{ networks.moonbase.staking.candidates.address1 }}`)
3. 单击 **call**
4. 调用完成后，将显示结果

![调用整理人委托计数](/images/builders/ethereum/precompiles/features/staking/staking-4.webp)

自动复利委托计数是配置了自动复利的委托数量。要确定设置了自动复利的委托数量，您可以

1. 找到并展开 **candidateAutoCompoundingDelegationCount** 函数
2. 输入候选人地址 (`{{ networks.moonbase.staking.candidates.address1 }}`)
3. 单击 **call**
4. 调用完成后，将显示结果

![获取候选人自动复利委托计数](/images/builders/ethereum/precompiles/features/staking/staking-5.webp)

您需要检索的最后一项是您的委托计数。如果您不知道您现有的委托数量，您可以按照以下步骤轻松获取：

1. 找到并展开 **delegatorDelegationCount** 函数
2. 输入您的地址
3. 单击 **call**
4. 调用完成后，将显示结果

![调用委托人委托计数](/images/builders/ethereum/precompiles/features/staking/staking-6.webp)

现在您已经获得了[候选人委托人计数](#:~:text=To obtain the candidate delegator count)、[自动复利委托计数](#:~:text=To determine the number of delegations that have auto-compounding set up)和您的[现有委托数量](#:~:text=If you don't know your existing number of delegations)，您拥有委托候选人并设置自动复利所需的所有信息。要开始：

1. 找到并展开 **delegateWithAutoCompound** 函数
2. 输入您要委托的候选人地址。对于此示例，您可以使用 `{{ networks.moonbase.staking.candidates.address1 }}`
3. 提供要以 Wei 委托的数量。委托至少需要 `{{networks.moonbase.staking.min_del_stake}}` 个代币，因此 Wei 的最低金额为 `{{networks.moonbase.staking.min_del_stake_wei}}`
4. 输入 0-100 之间的整数（无小数），表示自动复利的奖励百分比
5. 输入候选人的委托计数
6. 输入候选人的自动复利委托计数
7. 输入您的委托计数
8. 按 **transact**
9. MetaMask 将会弹出，您可以查看详细信息并确认交易

![委托整理人](/images/builders/ethereum/precompiles/features/staking/staking-7.webp)

如果您想在不设置自动复利的情况下进行委托，您可以按照之前的步骤，但不要使用 **delegateWithAutoCompound**，而是可以使用 **delegate** extrinsic。

### 验证委托 {: #verify-delegation }

要验证您的委托是否成功，您可以在 Polkadot.js Apps 中检查链状态。首先，将您的 MetaMask 地址添加到 [Polkadot.js Apps 中的地址簿](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/addresses){target=_blank}。

导航到**账户**，然后导航到**地址簿**，点击**添加联系人**，然后输入以下信息：

1. 添加您的 MetaMask 地址
2. 提供该账户的昵称
3. 点击**保存**

![添加到地址簿](/images/builders/ethereum/precompiles/features/staking/staking-8.webp)

要验证您的委托是否成功，请前往 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/chainstate){target=_blank} 并导航到**开发者**，然后导航到**链状态**

1. 选择 **parachainStaking** pallet
2. 选择 **delegatorState** 查询
3. 输入您的地址
4. （可选）如果您想提供一个特定的区块哈希进行查询，您可以启用 **include option** 滑块
5. 点击 **+** 按钮以返回结果并验证您的委托

!!! note
    如果您正在寻找委托概览，则不必在 **blockhash to query at** 字段中输入任何内容。

![验证委托](/images/builders/ethereum/precompiles/features/staking/staking-9.webp)

### 确认自动复利百分比 {: #confirm-auto-compounding }

您可以使用Solidity接口的`delegationAutoCompound`函数在Remix中确认您设置的自动复利奖励百分比：

1. 找到并展开 **delegationAutoCompound** 函数
2. 输入您用于委托的帐户
3. 输入您已委托的候选人
4. 点击 **call**
5. 结果将出现在 **call** 按钮下方

![验证自动复利百分比](/images/builders/ethereum/precompiles/features/staking/staking-10.webp)

### 设置或更改自动复利百分比 {: #set-or-change-auto-compounding }

如果您最初设置委托时未启用自动复利，或者您想要更新已设置自动复利的现有委托的百分比，您可以使用Solidity接口的`setAutoCompound`函数。

您需要获取为要设置或更新自动复利的候选人设置自动复利的委托数量。您还需要检索您自己的委托计数。您可以按照[使用自动复利委托验证人](#delegate-a-collator)部分中的说明获取这两项。

获得必要的信息后，您可以在Remix中采取以下步骤：

1. 找到并展开 **setAutoCompound** 函数
2. 输入您要设置或更新自动复利的候选人的帐户
3. 输入一个0-100之间的数字，表示您想要自动复利的奖励百分比
4. 输入候选人的自动复利委托计数
5. 输入您的委托计数
6. 按 **transact**
7. MetaMask 将会弹出，您可以查看详细信息并确认交易

![设置或更新自动复利百分比](/images/builders/ethereum/precompiles/features/staking/staking-11.webp)

### 撤销委托 {: #revoke-a-delegation }

从[运行时版本 1001](https://moonbeam.network/news/moonriver-technical-update-staking-changes-as-part-of-runtime-upgrade-1001){target=_blank}开始，用户与各种质押功能交互的方式发生了重大变化，包括处理质押退出的方式。

现在，退出需要您安排一个退出或撤销委托的请求，等待一个延迟期，然后执行该请求。

要撤销对特定候选人的委托并取回您的代币，您可以使用 `scheduleRevokeDelegation` 外部函数。安排请求不会自动撤销您的委托，您必须等待一个[退出延迟](#exit-delays)，然后使用 `executeDelegationRequest` 方法执行该请求。

要撤销委托并取回您的代币，请返回 Remix，然后：

1. 找到并展开 **scheduleRevokeDelegation** 函数
2. 输入您要撤销委托的候选人地址
3. 点击 **transact**
4. MetaMask 将会弹出，您可以查看交易详情，然后点击 **Confirm**

![撤销委托](/images/builders/ethereum/precompiles/features/staking/staking-12.webp)

交易确认后，您必须等待退出延迟的持续时间，然后才能执行并撤销委托请求。如果您在退出延迟结束前尝试撤销，您的外部函数将失败。

退出延迟过后，您可以返回 Remix 并按照以下步骤执行到期请求：

1. 找到并展开 **executeDelegationRequest** 函数
2. 输入您要撤销委托的委托人地址
3. 输入您要撤销其委托的候选人地址
4. 点击 **transact**
5. MetaMask 将会弹出，您可以查看交易详情，然后点击 **Confirm**

调用完成后，将显示结果，并且将为给定的委托人并从指定的候选人处撤销委托。您也可以在 Polkadot.js Apps 上再次检查您的委托人状态以确认。

如果由于任何原因您需要取消挂起的已安排的撤销委托请求，您可以通过在 Remix 中执行以下步骤来完成：

1. 找到并展开 **cancelDelegationRequest** 函数
2. 输入您要取消挂起请求的候选人地址
3. 点击 **transact**
4. MetaMask 将会弹出，您可以查看交易详情，然后点击 **Confirm**

您可以在 Polkadot.js Apps 上再次检查您的委托人状态，以确认您的委托仍然完好。
