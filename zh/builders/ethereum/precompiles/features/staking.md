---
title: Staking Precompile Contract
description: 通过专门设计的预编译合约来简化和优化 Moonbeam 的参与，从而释放 Staking 的潜力。
keywords: solidity, ethereum, staking, moonbeam, precompiled, contracts
categories: Precompiles, Ethereum Toolkit
---


# 与 Staking 预编译交互

## 简介 {: #introduction }

Moonbeam 通过 Parachain Staking Pallet 使用委托权益证明系统，允许 Token 持有者（委托人）准确表达他们想要支持哪些整理人候选人以及支持多少权益。Parachain Staking Pallet 的设计理念是，它在链上强制实施委托人和候选人之间的共同风险/回报。有关 Staking 的一般信息，例如通用术语、Staking 变量等，请参阅 [Moonbeam 上的 Staking](/learn/features/staking/){target=\_blank} 页面。

Staking 模块是用 Rust 编写的，它是 pallet 的一部分，通常无法从 Moonbeam 的 Ethereum 端访问。但是，staking 预编译允许开发人员使用位于以下地址的预编译合约中的 Ethereum API 访问 Staking 功能：

=== "Moonbeam"

    `{{ networks.moonbeam.precompiles.staking }}`

=== "Moonriver"

    `{{ networks.moonriver.precompiles.staking }}`

=== "Moonbase Alpha"

    `{{ networks.moonbase.precompiles.staking }}`

本指南将介绍 staking 预编译接口中可用的方法。此外，它还将向您展示如何通过 staking 预编译和 Ethereum API 与 Parachain Staking Pallet 交互。本指南中的示例是在 Moonbase Alpha 上完成的，但它们可以适应 Moonbeam 或 Moonriver。

--8<-- 'text/builders/ethereum/precompiles/security.md'

## 退出延迟 {: #exit-delays }

一些 Parachain Staking Pallet 的外部调用包含退出延迟，您必须等待才能执行请求。需要注意的退出延迟如下：

=== "Moonbeam"

    |        Variable         |                                                                         Value                                                                         |
    | :---------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------: |
    | Decrease candidate bond |       {{ networks.moonbeam.collator_timings.can_bond_less.rounds }} rounds ({{ networks.moonbeam.collator_timings.can_bond_less.hours }} hours)       |
    | Decrease delegator bond |      {{ networks.moonbeam.delegator_timings.del_bond_less.rounds }} rounds ({{ networks.moonbeam.delegator_timings.del_bond_less.hours }} hours)      |
    |    Revoke delegation    | {{ networks.moonbeam.delegator_timings.revoke_delegations.rounds }} rounds ({{ networks.moonbeam.delegator_timings.revoke_delegations.hours }} hours) |
    |    Leave candidates     |    {{ networks.moonbeam.collator_timings.leave_candidates.rounds }} rounds ({{ networks.moonbeam.collator_timings.leave_candidates.hours }} hours)    |
    |    Leave delegators     |   {{ networks.moonbeam.delegator_timings.leave_delegators.rounds }} rounds ({{ networks.moonbeam.delegator_timings.leave_delegators.hours }} hours)   |

=== "Moonriver"

    |        Variable         |                                                                          Value                                                                          |
    | :---------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------: |
    | Decrease candidate bond |       {{ networks.moonriver.collator_timings.can_bond_less.rounds }} rounds ({{ networks.moonriver.collator_timings.can_bond_less.hours }} hours)       |
    | Decrease delegator bond |      {{ networks.moonriver.delegator_timings.del_bond_less.rounds }} rounds ({{ networks.moonriver.delegator_timings.del_bond_less.hours }} hours)      |
    |    Revoke delegation    | {{ networks.moonriver.delegator_timings.revoke_delegations.rounds }} rounds ({{ networks.moonriver.delegator_timings.revoke_delegations.hours }} hours) |
    |    Leave candidates     |    {{ networks.moonriver.collator_timings.leave_candidates.rounds }} rounds ({{ networks.moonriver.collator_timings.leave_candidates.hours }} hours)    |
    |    Leave delegators     |   {{ networks.moonriver.delegator_timings.leave_delegators.rounds }} rounds ({{ networks.moonriver.delegator_timings.leave_delegators.hours }} hours)   |

=== "Moonbase Alpha"

    |        Variable         |                                                                         Value                                                                         |
    | :---------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------: |
    | Decrease candidate bond |       {{ networks.moonbase.collator_timings.can_bond_less.rounds }} rounds ({{ networks.moonbase.collator_timings.can_bond_less.hours }} hours)       |
    | Decrease delegator bond |      {{ networks.moonbase.delegator_timings.del_bond_less.rounds }} rounds ({{ networks.moonbase.delegator_timings.del_bond_less.hours }} hours)      |
    |    Revoke delegation    | {{ networks.moonbase.delegator_timings.revoke_delegations.rounds }} rounds ({{ networks.moonbase.delegator_timings.revoke_delegations.hours }} hours) |
    |    Leave candidates     |    {{ networks.moonbase.collator_timings.leave_candidates.rounds }} rounds ({{ networks.moonbase.collator_timings.leave_candidates.hours }} hours)    |
    |    Leave delegators     |   {{ networks.moonbase.delegator_timings.leave_delegators.rounds }} rounds ({{ networks.moonbase.delegator_timings.leave_delegators.hours }} hours)   |

## 与 Solidity 接口交互 {: #interact-with-solidity-interface }

### 检查先决条件 {: #checking-prerequisites }

下面的例子是在 Moonbase Alpha 上演示的，但是，类似的步骤也可以在 Moonbeam 和 Moonriver 上进行。

- 安装 MetaMask 并[连接到 Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
- 拥有至少 `{{networks.moonbase.staking.min_del_stake}}` 代币的账户。

--8<-- 'text/_common/faucet/faucet-list-item.md'

!!! note

    由于最低委托金额加上 gas 费用，下面的示例需要超过 `{{networks.moonbase.staking.min_del_stake}}` 代币。如果您需要的比水龙头分配的更多，请在 Discord 上联系我们，我们将很乐意为您提供帮助。

### Remix 设置 {: #remix-set-up }

1. 点击 **文件浏览器** 选项卡
1. 获取 [`StakingInterface.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=\_blank} 的副本，并将文件内容粘贴到名为 `StakingInterface.sol` 的 Remix 文件中

![将 Staking 接口复制并粘贴到 Remix 中](/images/builders/ethereum/precompiles/features/staking/staking-1.webp)

### 编译合约 {: #compile-the-contract }

1. 点击顶部的第二个 **Compile** 选项卡
1. 然后要编译接口，点击 **Compile StakingInterface.sol**

![Compiling StakingInterface.sol](/images/builders/ethereum/precompiles/features/staking/staking-2.webp)

### 访问合约 {: #access-the-contract }

1. 点击 Remix 中**编译**选项卡下方的 **部署和运行** 选项卡。注意：您不需要在此处部署合约，而是访问已经部署的预编译合约
1. 确保在 **ENVIRONMENT** 下拉菜单中选择 **注入提供者 - Metamask**
1. 确保在 **CONTRACT** 下拉菜单中选择 **ParachainStaking - StakingInterface.sol**。由于这是一个预编译合约，因此无需部署，而是需要在 **At Address** 字段中提供预编译的地址
1. 提供 Moonbase Alpha 的 staking 预编译合约地址：`{{networks.moonbase.precompiles.staking}}` 并点击 **At Address**
1. Parachain Staking 预编译合约将出现在 **Deployed Contracts** 列表中

![提供地址](/images/builders/ethereum/precompiles/features/staking/staking-3.webp)

### 使用自动复利委托整理人 {: #delegate-a-collator }

在此示例中，您将委托一个整理人，并设置在 Moonbase Alpha 上自动复利的奖励百分比。委托人是质押代币并为特定候选人担保的代币持有者。任何在其可用余额中持有至少 {{networks.moonbase.staking.min_del_stake}} 个代币的用户都可以成为委托人。委托候选人时，您可以同时设置自动复利。您可以指定一定百分比的奖励自动应用于您的总委托额。您不必立即设置自动复利，您可以稍后随时进行设置。

您可以进行自己的研究并选择您想要的候选人。在本指南中，将使用以下候选人地址：`{{ networks.moonbase.staking.candidates.address1 }}`。

为了委托候选人，您需要确定候选人当前的委托计数、他们的自动复利委托计数以及您自己的委托计数。

被选人委托计数是支持特定被选人的委托数。要获取候选人委托人计数，您可以调用 staking 预编译提供的函数。展开**已部署合约**列表下的 **PARACHAINSTAKING** 合约，然后：

1. 找到并展开 **candidateDelegationCount** 函数
1. 输入候选人地址 (`{{ networks.moonbase.staking.candidates.address1 }}`)
1. 点击 **call**
1. 调用完成后，将显示结果

![调用整理人委托计数](/images/builders/ethereum/precompiles/features/staking/staking-4.webp)

自动复利委托计数是已配置自动复利的委托数。要确定已设置自动复利的委托数，您可以

1. 找到并展开 **candidateAutoCompoundingDelegationCount** 函数
1. 输入候选人地址 (`{{ networks.moonbase.staking.candidates.address1 }}`)
1. 点击 **call**
1. 调用完成后，将显示结果

![获取候选人自动复利委托计数](/images/builders/ethereum/precompiles/features/staking/staking-5.webp)

您需要检索的最后一项是您的委托计数。如果您不知道您现有的委托数，您可以按照以下步骤轻松获取它们：

1. 找到并展开 **delegatorDelegationCount** 函数
1. 输入您的地址
1. 点击 **call**
1. 调用完成后，将显示结果

![调用委托人委托计数](/images/builders/ethereum/precompiles/features/staking/staking-6.webp)

现在您已经获得了[候选人委托人计数](#:~:text=%E8%A6%81%E8%8E%B7%E5%8F%96%E5%80%99%E9%80%89%E4%BA%BA%E5%A7%94%E6%89%98%E4%BA%BA%E8%AE%A1%E6%95%B0)，[自动复利委托计数](#:~:text=%E8%A6%81%E7%A1%AE%E5%AE%9A%E5%B7%B2%E8%AE%BE%E7%BD%AE%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%A9%E7%9A%84%E5%A7%94%E6%89%98%E6%95%B0)以及您的[现有委托数](#:~:text=%E5%A6%82%E6%9E%9C%E6%82%A8%E4%B8%8D%E7%9F%A5%E9%81%93%E6%82%A8%E7%8E%B0%E6%9C%89%E7%9A%84%E5%A7%94%E6%89%98%E6%95%B0)，您拥有委托候选人并设置自动复利所需的所有信息。要开始使用：

1. 找到并展开 **delegateWithAutoCompound** 函数
1. 输入您要委托的候选人地址。在此示例中，您可以使用 `{{ networks.moonbase.staking.candidates.address1 }}`
1. 以 Wei 为单位提供要委托的数量。委托最少需要 `{{networks.moonbase.staking.min_del_stake}}` 个代币，因此 Wei 的最低金额为 `{{networks.moonbase.staking.min_del_stake_wei}}`
1. 输入一个介于 0-100 之间的整数（无小数）以表示自动复利的奖励百分比
1. 输入候选人的委托计数
1. 输入候选人的自动复利委托计数
1. 输入您的委托计数
1. 按 **transact**
1. MetaMask 将弹出，您可以查看详细信息并确认交易

![委托整理人](/images/builders/ethereum/precompiles/features/staking/staking-7.webp)

如果您想在不设置自动复利的情况下进行委托，您可以按照前面的步骤操作，但不要使用 **delegateWithAutoCompound**，而可以使用 **delegate** extrinsic。

### 验证委托 {: #verify-delegation }

要验证您的委托是否成功，您可以在 Polkadot.js Apps 中检查链状态。首先，将您的 MetaMask 地址添加到 [Polkadot.js Apps 中的地址簿](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/addresses){target=\_blank}。

导航至 **Accounts**，然后导航至 **Address Book**，点击 **Add contact**，并输入以下信息：

1. 添加您的 MetaMask 地址
1. 提供该帐户的昵称
1. 点击 **Save**

![添加到地址簿](/images/builders/ethereum/precompiles/features/staking/staking-8.webp)

要验证您的委托是否成功，请前往 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/chainstate){target=\_blank} 并导航至 **Developer**，然后导航至 **Chain State**

1. 选择 **parachainStaking** pallet
1. 选择 **delegatorState** 查询
1. 输入您的地址
1. （可选）如果您想提供特定的区块哈希进行查询，您可以启用 **include option** 滑块
1. 点击 **+** 按钮以返回结果并验证您的委托

!!! note

    如果您正在寻找委托的概述，则不必在 **blockhash to query at** 字段中输入任何内容。

![验证委托](/images/builders/ethereum/precompiles/features/staking/staking-9.webp)

### 确认自动复利百分比 {: #confirm-auto-compounding }

您可以使用Solidity接口的`delegationAutoCompound`函数在Remix中确认您设置的自动复利奖励百分比：

1. 找到并展开 **delegationAutoCompound** 函数
1. 输入您用于委托的帐户
1. 输入您已委托的候选人
1. 点击 **call**
1. 响应将出现在 **call** 按钮下方

![验证自动复利百分比](/images/builders/ethereum/precompiles/features/staking/staking-10.webp)

### 设置或更改自动复利百分比 {: #set-or-change-auto-compounding }

如果您最初在设置委托时没有设置自动复利，或者您想要更新现有已设置自动复利的委托的百分比，您可以使用 Solidity 界面的 `setAutoCompound` 函数。

您需要获取要设置或更新自动复利的候选人的已设置自动复利的委托数量。您还需要检索您自己的委托计数。您可以按照[使用自动复利委托验证人](#delegate-a-collator)部分中的说明获取这两个项目。

获得必要的信息后，您可以在 Remix 中执行以下步骤：

1. 找到并展开 **setAutoCompound** 函数
1. 输入您要为其设置或更新自动复利的候选人的帐户
1. 输入一个 0-100 之间的数字，以表示您要自动复利的奖励百分比
1. 输入候选人的自动复利委托计数
1. 输入您的委托计数
1. 按 **transact**
1. MetaMask 将会弹出，您可以查看详细信息并确认交易

![设置或更新自动复利百分比](/images/builders/ethereum/precompiles/features/staking/staking-11.webp)

### 撤销委托 {: #revoke-a-delegation }

从 [运行时版本 1001](https://moonbeam.network/news/moonriver-technical-update-staking-changes-as-part-of-runtime-upgrade-1001){target=\_blank} 开始，用户与各种 Staking 功能交互的方式发生了重大变化。包括处理 Staking 退出的方式。

现在，退出需要您安排一个退出或撤销委托的请求，等待一段延迟期，然后执行该请求。

要撤销对特定候选人的委托并收回您的代币，您可以使用 `scheduleRevokeDelegation` extrinsic。安排请求不会自动撤销您的委托，您必须等待一个 [退出延迟](#exit-delays)，然后使用 `executeDelegationRequest` 方法执行该请求。

要撤销委托并收回您的代币，请返回 Remix，然后：

1. 找到并展开 **scheduleRevokeDelegation** 函数
1. 输入您要撤销委托的候选人地址
1. 点击 **transact**
1. MetaMask 将弹出，您可以查看交易详情，然后点击 **Confirm**

![撤销委托](/images/builders/ethereum/precompiles/features/staking/staking-12.webp)

交易确认后，您必须等待退出延迟的持续时间，才能执行和撤销委托请求。如果您尝试在退出延迟结束前撤销它，您的 extrinsic 将会失败。

退出延迟结束后，您可以返回 Remix 并按照以下步骤执行到期请求：

1. 找到并展开 **executeDelegationRequest** 函数
1. 输入您要撤销委托的委托人地址
1. 输入您要从中撤销委托的候选人地址
1. 点击 **transact**
1. MetaMask 将弹出，您可以查看交易详情，然后点击 **Confirm**

调用完成后，将显示结果，并且将为给定的委托人撤销来自指定候选人的委托。您还可以在 Polkadot.js Apps 上再次检查您的委托人状态以进行确认。

如果由于任何原因您需要取消待处理的计划请求以撤销委托，您可以通过在 Remix 中按照以下步骤操作来完成：

1. 找到并展开 **cancelDelegationRequest** 函数
1. 输入您要取消待处理请求的候选人地址
1. 点击 **transact**
1. MetaMask 将弹出，您可以查看交易详情，然后点击 **Confirm**

您可以在 Polkadot.js Apps 上再次检查您的委托人状态，以确认您的委托仍然完好无损。
