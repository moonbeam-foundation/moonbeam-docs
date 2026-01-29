---
title: 质押预编译合约
description: 使用专门的预编译合约释放质押潜力，简化并优化在 Moonbeam 上的参与流程。
keywords: solidity, ethereum, staking, moonbeam, precompiled, contracts
categories: Precompiles, Ethereum Toolkit
---


# 与质押预编译交互

## 简介 {: #introduction }

Moonbeam 通过 Parachain Staking Pallet 使用委托权益证明（DPoS）系统，允许代币持有者（委托人）明确选择他们要支持的整理人候选者以及质押数量。Parachain Staking Pallet 的设计使委托人与候选者在链上共享风险与收益。有关质押的基础信息，例如通用术语、质押变量等，请参阅 [Moonbeam 上的质押](/learn/features/staking/){target=\_blank} 页面。

质押模块使用 Rust 编写，是一个 pallet 的一部分，通常无法从 Moonbeam 的以太坊端访问。不过，质押预编译允许开发者通过以太坊 API 访问位于以下地址的预编译合约中的质押功能：

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

本指南将涵盖质押预编译接口中的可用方法。此外，还会展示如何通过质押预编译和以太坊 API 与 Parachain Staking Pallet 交互。本指南示例在 Moonbase Alpha 上完成，但同样适用于 Moonbeam 或 Moonriver。

--8<-- 'zh/text/builders/ethereum/precompiles/security.md'

## 退出延迟 {: #exit-delays }

Parachain Staking Pallet 的部分 extrinsic 包含退出延迟，在请求可以执行之前必须等待。需要注意的退出延迟如下：

=== "Moonbeam"

    |         变量          |                                                                         值                                                                         |
    | :---------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------: |
    |    减少候选者保证金    |       {{ networks.moonbeam.collator_timings.can_bond_less.rounds }} 轮 ({{ networks.moonbeam.collator_timings.can_bond_less.hours }} 小时)       |
    |    减少委托人保证金    |      {{ networks.moonbeam.delegator_timings.del_bond_less.rounds }} 轮 ({{ networks.moonbeam.delegator_timings.del_bond_less.hours }} 小时)      |
    |       撤销委托        | {{ networks.moonbeam.delegator_timings.revoke_delegations.rounds }} 轮 ({{ networks.moonbeam.delegator_timings.revoke_delegations.hours }} 小时) |
    |       退出候选者       |    {{ networks.moonbeam.collator_timings.leave_candidates.rounds }} 轮 ({{ networks.moonbeam.collator_timings.leave_candidates.hours }} 小时)    |
    |       退出委托人       |   {{ networks.moonbeam.delegator_timings.leave_delegators.rounds }} 轮 ({{ networks.moonbeam.delegator_timings.leave_delegators.hours }} 小时)   |

=== "Moonriver"

    |         变量          |                                                                          值                                                                          |
    | :---------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------: |
    |    减少候选者保证金    |       {{ networks.moonriver.collator_timings.can_bond_less.rounds }} 轮 ({{ networks.moonriver.collator_timings.can_bond_less.hours }} 小时)       |
    |    减少委托人保证金    |      {{ networks.moonriver.delegator_timings.del_bond_less.rounds }} 轮 ({{ networks.moonriver.delegator_timings.del_bond_less.hours }} 小时)      |
    |       撤销委托        | {{ networks.moonriver.delegator_timings.revoke_delegations.rounds }} 轮 ({{ networks.moonriver.delegator_timings.revoke_delegations.hours }} 小时) |
    |       退出候选者       |    {{ networks.moonriver.collator_timings.leave_candidates.rounds }} 轮 ({{ networks.moonriver.collator_timings.leave_candidates.hours }} 小时)    |
    |       退出委托人       |   {{ networks.moonriver.delegator_timings.leave_delegators.rounds }} 轮 ({{ networks.moonriver.delegator_timings.leave_delegators.hours }} 小时)   |

=== "Moonbase Alpha"

    |         变量          |                                                                         值                                                                         |
    | :---------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------: |
    |    减少候选者保证金    |       {{ networks.moonbase.collator_timings.can_bond_less.rounds }} 轮 ({{ networks.moonbase.collator_timings.can_bond_less.hours }} 小时)       |
    |    减少委托人保证金    |      {{ networks.moonbase.delegator_timings.del_bond_less.rounds }} 轮 ({{ networks.moonbase.delegator_timings.del_bond_less.hours }} 小时)      |
    |       撤销委托        | {{ networks.moonbase.delegator_timings.revoke_delegations.rounds }} 轮 ({{ networks.moonbase.delegator_timings.revoke_delegations.hours }} 小时) |
    |       退出候选者       |    {{ networks.moonbase.collator_timings.leave_candidates.rounds }} 轮 ({{ networks.moonbase.collator_timings.leave_candidates.hours }} 小时)    |
    |       退出委托人       |   {{ networks.moonbase.delegator_timings.leave_delegators.rounds }} 轮 ({{ networks.moonbase.delegator_timings.leave_delegators.hours }} 小时)   |

## Parachain Staking Solidity 接口 {: #the-parachain-staking-solidity-interface }

[`StakingInterface.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=\_blank} 是一个接口，使 Solidity 合约能够与 parachain-staking 交互。这样一来，Solidity 开发者不必学习 Substrate API，而是可以使用熟悉的以太坊接口与质押功能交互。

该 Solidity 接口包含以下函数：

??? function "**isDelegator**(*address* delegator) - 只读函数，检查指定地址当前是否为质押委托人。使用 Parachain Staking Pallet 的 `delegatorState` 方法"

    === "参数"

        - `delegator` - 要检查是否当前为委托人的地址

    === "返回值"

        - `bool` 该地址当前是否为委托人

??? function "**isCandidate**(*address* candidate) - 只读函数，检查指定地址当前是否为整理人候选者。使用 Parachain Staking Pallet 的 `candidateState` 方法"

    === "参数"

        - `candidate` - 要检查是否当前为整理人候选者的地址

    === "返回值"

        - `bool` 该地址当前是否为整理人候选者

??? function "**isSelectedCandidate**(*address* candidate) - 只读函数，检查指定地址当前是否属于活跃整理人集合。使用 Parachain Staking Pallet 的 `selectedCandidates` 方法"

    === "参数"

        - `candidate` - 要检查是否当前为活跃整理人的地址

    === "返回值"

        - `bool` 该地址当前是否为活跃整理人

??? function "**points**(*uint256* round) - 只读函数，获取指定轮次中所有整理人获得的总积分。使用 Parachain Staking Pallet 的 `points` 方法"

    === "参数"

        - `round` - uint256 要查询积分的轮次

    === "返回值"

        - `uint256` 指定轮次中授予的总积分

??? function "**awardedPoints**(*uint32* round, *address* candidate) - 只读函数，返回指定轮次中指定整理人获得的总积分。如果返回 `0`，可能是因为没有产生区块或该轮次的存储已被移除。使用 Parachain Staking Pallet 的 `points` 方法"

    === "参数"

        - `round` - uint32 要查询的轮次
        - `candidate` - 要查询积分的整理人地址

    === "返回值"

        - `uint256` 指定轮次中该整理人获得的积分

??? function "**delegationAmount**(*address* delegator, *address* candidate) - 只读函数，返回给定委托人对给定候选者的委托金额。使用 Parachain Staking Pallet 的 `delegatorState` 方法"

    === "参数"

        - `delegator` - 委托人地址
        - `candidate` - 候选者地址

    === "返回值"

        - `uint256` 委托金额

??? function "**isInTopDelegations**(*address* delegator, *address* candidate) - 只读函数，返回布尔值，表示给定委托人是否位于给定候选者的顶级委托中。使用 Parachain Staking Pallet 的 `topDelegations` 方法"

    === "参数"

        - `delegator` - 要检查的委托人地址
        - `candidate` - 候选者地址

    === "返回值"

        - `bool` 该委托人是否位于顶级委托中

??? function "**minDelegation**() - 只读函数，获取最小委托数量。使用 Parachain Staking Pallet 的 `minDelegation` 方法"

    === "参数"

        无。

    === "返回值"

        - `uint256` 最小委托数量

??? function "**candidateCount**() - 只读函数，获取当前整理人候选者数量。使用 Parachain Staking Pallet 的 `candidatePool` 方法"

    === "参数"

        无。

    === "返回值"

        - `uint256` 当前整理人候选者数量

??? function "**round**() - 只读函数，返回当前轮次编号。使用 Parachain Staking Pallet 的 `round` 方法"

    === "参数"

        无。

    === "返回值"

        - `uint256` 当前轮次编号

??? function "**candidateDelegationCount**(*address* candidate) - 只读函数，返回指定整理人候选者地址的委托数量。使用 Parachain Staking Pallet 的 `candidateInfo` 方法"

    === "参数"

        - `candidate` - 要查询的整理人候选者地址

    === "返回值"

        - `uint256` 候选者的委托数量

??? function "**candidateAutoCompoundingDelegationCount**(*address* candidate) - 只读函数，返回指定候选者的自动复投委托数量。使用 Parachain Staking Pallet 的 `autoCompoundingDelegations` 方法"

    === "参数"

        - `candidate` - 要查询的候选者地址

    === "返回值"

        - `uint256` 自动复投委托数量

??? function "**delegatorDelegationCount**(*address* delegator) - 只读函数，返回指定委托人地址的委托数量。使用 Parachain Staking Pallet 的 `delegatorState` 方法"

    === "参数"

        - `delegator` - 要查询的委托人地址

    === "返回值"

        - `uint256` 委托人委托数量

??? function "**selectedCandidates**() - 只读函数，获取当前轮次被选中的候选者。使用 Parachain Staking Pallet 的 `selectedCandidates` 方法"

    === "参数"

        无。

    === "返回值"

        - `address[]` 被选中候选者地址数组

??? function "**delegationRequestIsPending**(*address* delegator, *address* candidate) - 返回布尔值，表示给定委托人对给定候选者是否存在待处理的委托请求"

    === "参数"

        - `delegator` - 委托人地址
        - `candidate` - 候选者地址

    === "返回值"

        - `bool` 是否存在待处理委托请求

??? function "**candidateExitIsPending**(*address* candidate) - 返回布尔值，表示指定候选者是否存在待处理的退出请求。使用 Parachain Staking Pallet 的 `candidateInfo` 方法"

    === "参数"

        - `candidate` - 要检查的候选者地址

    === "返回值"

        - `bool` 是否存在待处理的退出请求

??? function "**candidateRequestIsPending**(*address* candidate) - 返回布尔值，表示给定候选者是否存在待处理的减少保证金请求。使用 Parachain Staking Pallet 的 `candidateInfo` 方法"

    === "参数"

        - `candidate` - 要检查的候选者地址

    === "返回值"

        - `bool` 是否存在待处理的减少保证金请求

??? function "**delegationAutoCompound**(*address* delegator, *address* candidate) - 返回给定委托人和候选者的自动复投比例"

    === "参数"

        - `delegator` - 委托人地址
        - `candidate` - 候选者地址

    === "返回值"

        - `uint256` 自动复投比例

??? function "**getDelegatorTotalStaked**(*address* delegator) - 只读函数，返回给定委托人的总质押金额，与候选者无关。使用 Parachain Staking Pallet 的 `delegatorState` 方法"

    === "参数"

        - `delegator` - 要查询的委托人地址

    === "返回值"

        - `uint256` 总质押金额

??? function "**getCandidateTotalCounted**(*address* candidate) - 只读函数，返回给定候选者的总质押金额。使用 Parachain Staking Pallet 的 `candidateInfo` 方法"

    === "参数"

        - `candidate` - 要查询的候选者地址

    === "返回值"

        - `uint256` 该候选者的总质押金额

??? function "**joinCandidates**(*uint256* amount, *uint256* candidateCount) - 允许账户以指定保证金金额和当前候选者数量加入整理人候选者集合。使用 Parachain Staking Pallet 的 `joinCandidates` 方法"

    === "参数"

        - `amount` - uint256 作为候选者质押的保证金金额
        - `candidateCount` - uint256 当前候选者池数量

    === "返回值"

        无。

??? function "**scheduleLeaveCandidates**(*uint256* candidateCount) - 安排候选者退出候选者池的请求。安排请求不会自动执行。需要等待 [退出延迟](#exit-delays)，然后才能通过 `executeLeaveCandidates` extrinsic 执行请求。使用 Parachain Staking Pallet 的 `scheduleLeaveCandidates` 方法"

    === "参数"

        - `candidateCount` - uint256 当前候选者池数量

    === "返回值"

        无。

??? function "**executeLeaveCandidates**(*address* candidate, *uint256* candidateDelegationCount) - 执行到期的退出整理人候选者集合请求。使用 Parachain Staking Pallet 的 `executeLeaveCandidates` 方法"

    === "参数"

        - `candidate` - 退出候选者池的候选者地址
        - `candidateDelegationCount` - uint256 候选者的委托数量

    === "返回值"

        无。

??? function "**cancelLeaveCandidates**(*uint256* candidateCount) - 允许候选者取消待处理的退出候选者池请求。需要提供当前候选者池数量。使用 Parachain Staking Pallet 的 `cancelLeaveCandidates` 方法"

    === "参数"

        - `candidateCount` - uint256 当前候选者池数量

    === "返回值"

        无。

??? function "**goOffline**() - 在不解绑的情况下暂时离开整理人候选者集合。使用 Parachain Staking Pallet 的 `goOffline` 方法"

    === "参数"

        无。

    === "返回值"

        无。

??? function "**goOnline**() - 在之前调用 `goOffline()` 后重新加入整理人候选者集合。使用 Parachain Staking Pallet 的 `goOnline` 方法"

    === "参数"

        无。

    === "返回值"

        无。

??? function "**candidateBondMore**(*uint256* more) - 整理人候选者将保证金增加指定数量。使用 Parachain Staking Pallet 的 `candidateBondMore` 方法"

    === "参数"

        - `more` - uint256 增加的保证金数量

    === "返回值"

        无。

??? function "**scheduleCandidateBondLess**(*uint256* less) - 安排请求减少候选者保证金的指定数量。安排请求不会自动执行。需要等待 [退出延迟](#exit-delays)，然后才能通过 `execute_candidate_bond_request` extrinsic 执行请求。使用 Parachain Staking Pallet 的 `scheduleCandidateBondLess` 方法"

    === "参数"

        - `less` - uint256 减少的保证金数量

    === "返回值"

        无。

??? function "**executeCandidateBondLess**(*address* candidate) - 执行到期的请求，以减少指定候选者的保证金数量。使用 Parachain Staking Pallet 的 `executeCandidateBondLess` 方法"

    === "参数"

        - `candidate` - 要执行减少保证金的候选者地址

    === "返回值"

        无。

??? function "**cancelCandidateBondLess**() - 允许候选者取消待处理的减少保证金请求。使用 Parachain Staking Pallet 的 `cancelCandidateBondLess` 方法"

    === "参数"

        无。

    === "返回值"

        无。

??? function "**delegateWithAutoCompound**(*address* candidate, *uint256* amount, *uint8* autoCompound, *uint256* candidateDelegationCount, *uint256* candidateAutoCompoundingDelegationCount, *uint256* delegatorDelegationCount) - 为整理人候选者进行委托，并自动设置奖励自动复投的百分比；`autoCompound` 为 0-100 的整数（无小数）。使用 Parachain Staking Pallet 的 `delegateWithAutoCompound` 方法"

    === "参数"

        - `candidate` - 要委托的候选者地址
        - `amount` - uint256 委托金额
        - `autoCompound` - uint8 自动复投奖励比例（0-100）
        - `candidateDelegationCount` - uint256 候选者当前委托数量
        - `candidateAutoCompoundingDelegationCount` - uint256 候选者当前自动复投委托数量
        - `delegatorDelegationCount` - uint256 委托人当前委托数量

    === "返回值"

        无。

??? function "**scheduleRevokeDelegation**(*address* candidate) - 安排根据候选者地址撤销委托的请求。安排请求不会自动执行。需要等待 [退出延迟](#exit-delays)，然后才能通过 `executeDelegationRequest` extrinsic 执行请求。使用 Parachain Staking Pallet 的 `scheduleRevokeDelegation` 方法"

    === "参数"

        - `candidate` - 要撤销委托的候选者地址

    === "返回值"

        无。

??? function "**delegatorBondMore**(*address* candidate, *uint256* more) - 委托人向整理人增加指定数量的委托保证金。使用 Parachain Staking Pallet 的 `delegatorBondMore` 方法"

    === "参数"

        - `candidate` - 要增加委托的候选者地址
        - `more` - uint256 增加的委托金额

    === "返回值"

        无。

??? function "**scheduleDelegatorBondLess**(*address* candidate, *uint256* less) - 安排委托人针对特定候选者减少委托保证金的请求。安排请求不会自动执行。需要等待 [退出延迟](#exit-delays)，然后才能通过 `executeDelegationRequest` extrinsic 执行请求。使用 Parachain Staking Pallet 的 `scheduleDelegatorBondLess` 方法"

    === "参数"

        - `candidate` - 要减少委托的候选者地址
        - `less` - uint256 减少的委托金额

    === "返回值"

        无。

??? function "**executeDelegationRequest**(*address* delegator, *address* candidate) - 执行到期的委托请求，需要提供委托人和候选者地址。使用 Parachain Staking Pallet 的 `executeDelegationRequest` 方法"

    === "参数"

        - `delegator` - 委托人地址
        - `candidate` - 候选者地址

    === "返回值"

        无。

??? function "**cancelDelegationRequest**(*address* candidate) - 取消待处理的委托请求，需要提供候选者地址。使用 Parachain Staking Pallet 的 `cancelDelegationRequest` 方法"

    === "参数"

        - `candidate` - 要取消委托请求的候选者地址

    === "返回值"

        无。

??? function "**setAutoCompound**(*address* candidate, *uint8* value, *uint256* candidateAutoCompoundingDelegationCount, *uint256* delegatorDelegationCount) - 为现有委托设置自动复投值；`value` 为 0-100 的整数（无小数）。使用 Parachain Staking Pallet 的 `setAutoCompound` 方法"

    === "参数"

        - `candidate` - 候选者地址
        - `value` - uint8 自动复投比例（0-100）
        - `candidateAutoCompoundingDelegationCount` - uint256 候选者当前自动复投委托数量
        - `delegatorDelegationCount` - uint256 委托人当前委托数量

    === "返回值"

        无。

## 与 Solidity 接口交互 {: #interact-with-solidity-interface }

### 检查先决条件 {: #checking-prerequisites }

以下示例在 Moonbase Alpha 上演示，但 Moonbeam 和 Moonriver 也可采用类似步骤。

- 安装 MetaMask 并 [连接到 Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
- 拥有至少 `{{networks.moonbase.staking.min_del_stake}}` 代币的账户。

--8<-- 'zh/text/_common/faucet/faucet-list-item.md'

!!! note

    下面的示例由于最低委托金额加上 gas 费用，需要超过 `{{networks.moonbase.staking.min_del_stake}}` 代币。如果你需要的数量超过水龙头发放，请在 Discord 联系我们，我们很乐意提供帮助。

### Remix 设置 {: #remix-set-up }

1. 点击 **File explorer** 选项卡
1. 获取 [`StakingInterface.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=\_blank} 并将其内容粘贴到 Remix 中名为 `StakingInterface.sol` 的文件里

![Copying and Pasting the Staking Interface into Remix](/images/builders/ethereum/precompiles/features/staking/staking-1.webp)

### 编译合约 {: #compile-the-contract }

1. 点击 **Compile** 选项卡（从上往下第二个）
1. 然后点击 **Compile StakingInterface.sol** 以编译该接口

![Compiling StakingInterface.sol](/images/builders/ethereum/precompiles/features/staking/staking-2.webp)

### 访问合约 {: #access-the-contract }

1. 点击 Remix 中 **Compile** 选项卡正下方的 **Deploy and Run** 选项卡。注意：这里不是部署合约，而是访问已部署的预编译合约
1. 确保 **ENVIRONMENT** 下拉菜单中选择 **Injected Provider - Metamask**
1. 确保 **CONTRACT** 下拉菜单中选择 **ParachainStaking - StakingInterface.sol**。由于这是预编译合约，无需部署，而是需要在 **At Address** 字段提供预编译地址
1. 提供 Moonbase Alpha 的质押预编译地址：`{{networks.moonbase.precompiles.staking}}` 并点击 **At Address**
1. Parachain Staking 预编译将出现在 **Deployed Contracts** 列表中

![Provide the address](/images/builders/ethereum/precompiles/features/staking/staking-3.webp)

### 委托整理人并启用自动复投 {: #delegate-a-collator }

在此示例中，你将在 Moonbase Alpha 上委托一名整理人，并设置奖励自动复投的比例。委托人是质押代币、为特定候选者背书的代币持有者。任何在可用余额中至少持有 {{networks.moonbase.staking.min_del_stake}} 代币的用户都可以成为委托人。委托候选者时，你可以同时设置自动复投。你可以指定奖励中自动加入到总委托中的百分比。你不必立即设置自动复投，之后也可以再设置。

你可以自行研究并选择想要的候选者。本指南将使用以下候选者地址：`{{ networks.moonbase.staking.candidates.address1 }}`。

要委托某个候选者，你需要确定该候选者当前的委托数量、自动复投委托数量，以及你自己的委托数量。

候选者委托数量指支持某一候选者的委托笔数。要获取候选者委托数量，你可以调用质押预编译提供的函数。在 **Deployed Contracts** 列表中展开 **PARACHAINSTAKING** 合约，然后：

1. 找到并展开 **candidateDelegationCount** 函数
1. 输入候选者地址（`{{ networks.moonbase.staking.candidates.address1 }}`）
1. 点击 **call**
1. 调用完成后将显示结果

![Call collator delegation count](/images/builders/ethereum/precompiles/features/staking/staking-4.webp)

自动复投委托数量指已设置自动复投的委托数量。要确定已设置自动复投的委托数量，你可以：

1. 找到并展开 **candidateAutoCompoundingDelegationCount** 函数
1. 输入候选者地址（`{{ networks.moonbase.staking.candidates.address1 }}`）
1. 点击 **call**
1. 调用完成后将显示结果

![Get candidate auto-compounding delegation count](/images/builders/ethereum/precompiles/features/staking/staking-5.webp)

你还需要获取自己的委托数量。如果你不知道当前的委托数量，可以按照以下步骤获取：

1. 找到并展开 **delegatorDelegationCount** 函数
1. 输入你的地址
1. 点击 **call**
1. 调用完成后将显示结果

![Call delegator delegation count](/images/builders/ethereum/precompiles/features/staking/staking-6.webp)

现在你已经获得了[候选者委托数量](#:~:text=To obtain the candidate delegator count)、[自动复投委托数量](#:~:text=To determine the number of delegations that have auto-compounding set up)以及你自己的[现有委托数量](#:~:text=If you don't know your existing number of delegations)，已具备委托候选者并设置自动复投所需的全部信息。开始操作：

1. 找到并展开 **delegateWithAutoCompound** 函数
1. 输入你要委托的候选者地址。本示例可使用 `{{ networks.moonbase.staking.candidates.address1 }}`
1. 以 Wei 提供委托金额。委托的最低金额为 `{{networks.moonbase.staking.min_del_stake}}` 代币，因此最小 Wei 金额为 `{{networks.moonbase.staking.min_del_stake_wei}}`
1. 输入 0-100 的整数（不含小数），表示自动复投奖励比例
1. 输入候选者的委托数量
1. 输入候选者的自动复投委托数量
1. 输入你的委托数量
1. 点击 **transact**
1. MetaMask 会弹出，你可以查看详情并确认交易

![Delegate a Collator](/images/builders/ethereum/precompiles/features/staking/staking-7.webp)

如果你希望在不设置自动复投的情况下委托，可以按上述步骤操作，但将 **delegateWithAutoCompound** 改为使用 **delegate** extrinsic。

### 验证委托 {: #verify-delegation }

要验证委托是否成功，可以在 Polkadot.js Apps 中检查链状态。首先，将你的 MetaMask 地址添加到 [Polkadot.js Apps 地址簿](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/addresses){target=\_blank}。

导航至 **Accounts** 然后 **Address Book**，点击 **Add contact**，并填写以下信息：

1. 添加你的 MetaMask 地址
1. 为账户提供一个昵称
1. 点击 **Save**

![Add to Address Book](/images/builders/ethereum/precompiles/features/staking/staking-8.webp)

要验证委托是否成功，前往 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/chainstate){target=\_blank} 并导航至 **Developer** 然后 **Chain State**

1. 选择 **parachainStaking** pallet
1. 选择 **delegatorState** 查询
1. 输入你的地址
1. 可选：如果你想指定区块哈希进行查询，可启用 **include option** 滑块
1. 点击 **+** 按钮返回结果并验证你的委托

!!! note

    如果你只是想查看委托概览，无需在 **blockhash to query at** 字段中输入任何内容。

![Verify delegation](/images/builders/ethereum/precompiles/features/staking/staking-9.webp)

### 确认自动复投比例 {: #confirm-auto-compounding }

你可以在 Remix 中使用 Solidity 接口的 `delegationAutoCompound` 函数确认你设置的自动复投奖励比例：

1. 找到并展开 **delegationAutoCompound** 函数
1. 输入你用于委托的账户
1. 输入你委托的候选者
1. 点击 **call**
1. 响应会显示在 **call** 按钮下方

![Verify auto-compound percentage](/images/builders/ethereum/precompiles/features/staking/staking-10.webp)

### 设置或更改自动复投比例 {: #set-or-change-auto-compounding }

如果你最初在不启用自动复投的情况下进行了委托，或者你想更新已启用自动复投的委托比例，可以使用 Solidity 接口的 `setAutoCompound` 函数。

你需要获取要设置或更新自动复投的候选者的自动复投委托数量，同时还需要获取你自己的委托数量。可参考 [委托整理人并启用自动复投](#delegate-a-collator) 部分的步骤获取这两项信息。

获取必要信息后，在 Remix 中执行以下步骤：

1. 找到并展开 **setAutoCompound** 函数
1. 输入你要设置或更新自动复投的候选者账户
1. 输入 0-100 的数值，表示你希望自动复投的奖励比例
1. 输入候选者的自动复投委托数量
1. 输入你的委托数量
1. 点击 **transact**
1. MetaMask 会弹出，你可以查看详情并确认交易

![Set or update auto-compound percentage](/images/builders/ethereum/precompiles/features/staking/staking-11.webp)

### 撤销委托 {: #revoke-a-delegation }

从 [runtime 版本 1001](https://moonbeam.network/news/moonriver-technical-update-staking-changes-as-part-of-runtime-upgrade-1001){target=\_blank} 开始，用户与多项质押功能交互的方式发生了重大变化，包括质押退出的处理方式。

现在退出需要你先安排退出或撤销委托的请求，等待延迟期，然后再执行该请求。

要撤销对某个候选者的委托并取回代币，可以使用 `scheduleRevokeDelegation` extrinsic。安排请求不会自动撤销委托，你必须等待 [退出延迟](#exit-delays)，然后使用 `executeDelegationRequest` 方法执行请求。

要撤销委托并取回代币，请回到 Remix，然后：

1. 找到并展开 **scheduleRevokeDelegation** 函数
1. 输入你要撤销委托的候选者地址
1. 点击 **transact**
1. MetaMask 会弹出，你可以查看交易详情并点击 **Confirm**

![Revoke delegation](/images/builders/ethereum/precompiles/features/staking/staking-12.webp)

交易确认后，在你可以执行并撤销委托请求之前必须等待退出延迟期。如果在退出延迟结束之前尝试撤销，你的 extrinsic 会失败。

退出延迟结束后，你可以回到 Remix 并按以下步骤执行到期请求：

1. 找到并展开 **executeDelegationRequest** 函数
1. 输入你要撤销委托的委托人地址
1. 输入你要撤销委托的候选者地址
1. 点击 **transact**
1. MetaMask 会弹出，你可以查看交易详情并点击 **Confirm**

调用完成后将显示结果，给定委托人对指定候选者的委托将被撤销。你也可以在 Polkadot.js Apps 中再次查看委托人状态以确认。

如果你需要取消待处理的撤销委托请求，可以在 Remix 中按以下步骤操作：

1. 找到并展开 **cancelDelegationRequest** 函数
1. 输入你要取消待处理请求的候选者地址
1. 点击 **transact**
1. MetaMask 会弹出，你可以查看交易详情并点击 **Confirm**

你可以在 Polkadot.js Apps 中再次检查委托人状态，以确认你的委托仍然有效。
