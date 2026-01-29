---
title: 收集人的轨道飞行器计划
description: 了解 Moonbeam 收集人的轨道飞行器计划，包括资格标准、保证金要求、奖励、性能指标等。
categories: 节点运营商和收集人
---

# Moonbeam 轨道器计划

## 介绍 {: #introduction }

Moonbeam 基金会宣布对轨道飞行器计划进行有限的试用。与[去中心化节点](https://nodes.web3.foundation/){target=\_blank}类似，该计划允许收集人参与网络的多样性和安全性，即使他们没有足够的资金或支持以其他方式进入活跃集。该计划是在社区的投入下开发的。

Moonbeam 基金会将在活跃集中维护轨道飞行器池，并将分配区块生产的权限给计划中的每个成员，这些成员被称为轨道飞行器。

活跃的轨道飞行器将定期轮换，以保持活跃轮次的公平分配。将监控轨道飞行器的性能，并且每轮的支出将根据每个轨道飞行器在该轮产生的区块重定向到每个轨道飞行器。总体奖励将与分配给每个特定整理者账户的所有其他轨道飞行器共享。

只要轨道飞行器的性能在其同行的范围内，他们将保持其在轮换中的位置。如果他们低于此阈值，他们将被从池中删除，并降级到 Moonbase Alpha 的等待列表末尾。等待列表中的新轨道飞行器将占用他们的位置。

## 持续时间 {: #duration }

随着项目的进展，Moonbeam 基金会将评估结果并进行调整。虽然没有具体的结束日期，但项目可能会结束或发生重大变化。我们鼓励参与者在整个项目过程中提供反馈，并注意项目可能会与此处解释的概念有所不同。

## 资格 {: #eligibility }

要参与轨道飞行器计划，您必须符合以下资格标准：

- 由于该计划的性质，每个轨道飞行器必须通过身份验证检查，并且不能是某些司法管辖区的居民
- 每个轨道飞行器必须发布保证金。发布此保证金是为了防止不良行为，并将受到罚没
- 每个实体（个人或团体）每个网络只能运行一个轨道飞行器（即，Moonriver 上一个，Moonbeam 上一个）
- 轨道飞行器不能在其轨道飞行器所在的同一网络上运行另一个活动的整理人。但是，他们可以在 Moonbeam 上运行一个活跃的整理人，在 Moonriver 上运行一个轨道飞行器，反之亦然，只要他们不同时在同一网络上拥有两者

## 沟通 {: #communication }

将为此程序创建一个私有的 Discord 群组，大部分沟通将通过此频道或通过 DM 进行。填写完申请后，您将被添加到该群组中。

## Orbiters 和 Orbiter 池配置 {: #configuration }

Orbiter 池由 Moonbeam 基金会维护，并将区块生产权限分配给每个 orbiter。每个网络的每个 orbiter 池的 orbiter 最大数量如下：

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.orbiter.max_orbiters_per_collator }} 每个池的 orbiters
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.orbiter.max_orbiters_per_collator }} 每个池的 orbiters
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.orbiter.max_orbiters_per_collator }} 每个池的 orbiters
    ```

对于 Moonbeam 和 Moonriver，活动集中允许的最大 orbiter 池数量也有限制。对于 Moonbase Alpha，将根据需要设置任意数量的 orbiter 池。最大数量如下：

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.orbiter.max_collators }} orbiter 池
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.orbiter.max_collators }} orbiter 池
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.orbiter.max_collators }} orbiter 池
    ```

每个 orbiter 将在一定数量的轮次内处于活动状态，然后下一个 orbiter 将接管。每个网络的活动轮次数如下：

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.orbiter.active.rounds }} 轮（约 {{ networks.moonbeam.orbiter.active.hours }} 小时）
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.orbiter.active.rounds }} 轮（约 {{ networks.moonriver.orbiter.active.hours }} 小时）
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.orbiter.active.rounds }} 轮（约 {{ networks.moonbase.orbiter.active.hours }} 小时）
    ```

## 应用程序和入职流程 {: #application-and-onboarding-process }

要加入轨道飞行器计划，您需要首先填写一份申请表，您需要在其中提交联系信息、社交媒体句柄以及整理人和节点详细信息。在表格的末尾，您还需要按照说明完成身份验证。

<div class="button-wrapper">
    <a href="https://docs.google.com/forms/d/e/1FAIpQLSewdSAFgs0ZbgvlflmZbHrSpe6uH9HdXdGIL7i07AB2pFgxVQ/viewform" target="_blank" class="md-button">Moonbeam Orbiter Program Application</a>
</div>

一旦您通过身份验证并被该计划接受，您将收到通知，然后入职流程将开始。新的轨道飞行器必须运行 Moonbase Alpha 节点两周，才有资格运行 Moonriver 节点。然后，轨道飞行器必须运行 Moonriver 节点四周，才有资格运行 Moonbeam 节点。一旦您符合资格，您无需在任何网络上运行轨道飞行器。您可以随时通过[取消注册](#leaving-the-program)离开其他网络，您将收到您的保证金。要再次加入该网络，您需要重新注册，并且将在队列的末尾。

入职流程的概要如下：

- [通过同步准备您的节点](/node-operators/networks/run-a-node/overview/){target=\_blank}
- 完全同步后，您可以[生成会话密钥](/node-operators/networks/collators/account-management/#session-keys){target=\_blank}
- [注册您的会话密钥](/node-operators/networks/collators/account-management/#map-author-id-set-session-keys){target=\_blank}并发布相关的[映射保证金](#mapping-bond)
- 准备就绪后，通过 `moonbeamOrbiters.orbiterRegister()` extrinsic 注册为轨道飞行器，并发布相关的[轨道飞行器保证金](#bond)
- 轨道飞行器将被放置在每个网络的等待列表中，直到有可用插槽
- 一旦插槽打开，您将开始在相应网络上生成区块并获得奖励

## 债券 {: #bond }

### 映射保证金 {: #mapping-bond}

当您将作者 ID 映射到您的帐户时，会发送一个保证金。此保证金是针对每个注册的作者 ID。保证金设置如下：

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.staking.collator_map_bond }} GLMR
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.staking.collator_map_bond }} MOVR
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.staking.collator_map_bond }} DEV
    ```

### Orbiter 保证金 {: #orbiter-bond }

如前所述，每个轨道器必须提交保证金才能加入该计划。此保证金与活动集合的保证金不同，因为它在绑定时不赚取任何委托奖励。当前的保证金如下：

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.orbiter.bond }} GLMR
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.orbiter.bond }} MOVR
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.orbiter.bond }} DEV
    ```

## 奖励 {: #rewards }

轨道器的奖励将在分配到同一轨道器池的其他轨道器之间分配。每个轨道器池的最大轨道器数量在[配置部分](#configuration)中描述。以 Moonriver 为例，它是 {{ networks.moonriver.orbiter.max_orbiters_per_collator }}，因此奖励大约是验证人奖励的 1/{{ networks.moonriver.orbiter.max_orbiters_per_collator }}。系统会跟踪每个轨道器在活动期间生成的区块，并按比例分配奖励。

## 性能指标 {: #performance-metrics }

每个轨道器的性能将在一段时间内进行评估，以确定它们是否处于活动状态并生成区块，以及它们的性能是否在所有其他轨道器池整理者的范围内。预计轨道器将运行顶级硬件以保持在该范围内。有关硬件要求的更多信息，请查看[整理者要求页面](/node-operators/networks/collators/requirements/){target=\_blank}。

指标将在七天的时间内进行评估。性能指标如下：

- 轨道器在最近三个活跃的回合中生成了一个区块
- 轨道器的区块生成量在七天计划平均值的两个标准差范围内
- 轨道器的每区块交易量在七天计划平均值的两个标准差范围内
- 轨道器的区块权重在七天计划平均值的两个标准差范围内

!!! note
    这些因素可能会随着计划的进行而发生变化。

## 离开程序 {: #leaving-the-program }

轨道器可以离开程序并立即获得退还的抵押金，没有任何延迟。唯一的限制是，如果轨道器当前处于活动状态，则无法离开；一旦它们不再处于活动状态，它们可以随时通过发出 `moonbeamOrbiters.orbiterUnregister()` extrinsic 来离开。
