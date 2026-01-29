---
title: Governance
description: 作为 Polkadot 平行链，Moonbeam 使用链上治理系统，允许对公共提案进行基于权益加权的投票。
categories: Governance, Basics
---

# Moonbeam 上的治理

## 简介 {: #introduction }

Moonbeam 治理机制的目标是根据社区的意愿推进协议。在这一共同使命中，治理流程力求涵盖所有代币持有者。对协议的任何和所有更改都必须经过全民公投，以便所有代币持有者（按权益加权）都可以对决策发表意见。

[Moonbeam 社区论坛](https://forum.moonbeam.network){target=\_blank} 和 [Polkassembly](https://moonbeam.polkassembly.io/opengov){target=\_blank} 等治理论坛可以进行公开讨论，并根据社区的意见改进提案。自主制定和[无分叉升级](https://docs.polkadot.com/develop/parachains/maintenance/runtime-upgrades/#forkless-upgrades){target=\_blank} 将社区团结起来，共同推进协议。

随着 OpenGov（最初称为 Gov2）的推出，Polkadot 的第二阶段治理引入了多项对治理流程的修改。您可以阅读 [OpenGov：什么是 Polkadot Gov2](https://moonbeam.network/news/opengov-what-is-polkadot-gov2){target=\_blank} 这篇博文，其中概述了 OpenGov 中所做的所有更改。

截至运行时 2400，所有 Moonbeam 网络都使用 OpenGov 作为其治理系统。

## 原则 {: #principles }

参与 Moonbeam 治理流程的指导性“软”原则包括：

 - 对希望参与 Moonbeam 并受治理决策影响的代币持有者具有包容性
 - 即使观点与我们自己的观点相反，也偏向于代币持有者的参与，而不是缺乏参与
 - 致力于决策过程的开放性和透明性
 - 努力将网络的更大利益置于个人利益之上
 - 始终充当道德主体，从道德角度考虑行动（或不作为）的后果
 - 在与其他代币持有者的互动中保持耐心和慷慨，但不容忍辱骂或破坏性的语言、行为和举止，并遵守 [Moonbeam 的行为准则](https://github.com/moonbeam-foundation/code-of-conduct){target=\_blank}

这些要点很大程度上受到了 Vlad Zamfir 关于治理的著作的启发。请参阅他的文章，尤其是 [如何以诚信（和良好举止）参与区块链治理](https://medium.com/@Vlad_Zamfir/how-to-participate-in-blockchain-governance-in-good-faith-and-with-good-manners-bd4e16846434){target=\_blank} Medium 文章。

## 链上治理机制 {: #on-chain-governance-mechanics }

Moonbeam 的“硬”治理流程将由链上流程驱动，该流程允许网络中的大多数代币持有者决定围绕网络做出的关键决策的结果。这些决策点以对拟议的全民投票进行权益加权投票的形式出现。

此治理模型的一些主要组成部分包括：

 - **全民投票** — 一种基于权益的投票方案，其中每项全民投票都与对 Moonbeam 系统进行更改的特定提案相关联，包括关键参数的值、代码升级或对治理系统本身的更改
 - **投票** — 全民投票将由代币持有者以权益加权的方式进行投票。通过的全民投票会受到延迟颁布的影响，以便不同意该决策方向的人员有时间退出网络
 - **理事会和技术委员会治理 V1** — 一组在系统中拥有特殊投票权的社区成员。随着 Governance v1 的弃用和移除，这两个委员会均已自 [runtime 2800 版本](https://forum.moonbeam.network/t/runtime-rt2801-schedule/1616/4){target=\_blank} 解散
 - **OpenGov 技术委员会** — 一组可以将某些提案添加到白名单轨道的社区成员

有关这些 Substrate 框架 pallet 如何实施链上治理的更多详细信息，您可以查看 [Polkadot 治理的演练](https://polkadot.com/blog/a-walkthrough-of-polkadots-governance){target=\_blank} 博客文章和 [Polkadot 治理 Wiki](https://wiki.polkadot.com/learn/learn-polkadot-opengov/){target=\_blank}。

## Governance v2：OpenGov {: #opengov }

本节将涵盖您需要了解的关于Moonbeam上的OpenGov的所有内容。

### 通用定义 {: #general-definitions-gov2 }

--8<-- 'zh/text/learn/features/governance/proposal-definitions.md'

--8<-- 'zh/text/learn/features/governance/preimage-definitions.md'

 - **Origin（发起者）** - 一种基于授权的操作分发源，用于确定提案所发布的 Track（轨道）
 - **Track（轨道）** - 一个特定于 Origin 的管道，概述了提案的生命周期。目前，有五个轨道：

    |    Origin Track（发起者轨道）     |                                   Description（描述）                                   |                         Referendum Examples（公投示例）                          |
    |:-------------------:|:--------------------------------------------------------------------------------:|:--------------------------------------------------------------------:|
    |        Root（Root）         |                                最高权限                                 |           Runtime upgrades（运行时升级），Technical Committee management（技术委员会管理）           |
    |     Whitelisted（白名单）     | 提案在被分发前需经过技术委员会的白名单处理 |                       Fast-tracked operations（快速通道操作）                        |
    |    General Admin（通用管理）    |                          用于一般的链上决策                          | Changes to XCM fees（更改 XCM 费用），Orbiter program（轨道飞行器计划），Staking parameters（质押参数），Registrars（注册员） |
    | Emergency Canceller（紧急取消者） |          用于取消公投。决策保证金将退还          |                    Wrongly constructed referendum（错误构建的公投）                    |
    |  Emergency Killer（紧急终结者）   |       用于终止不良/恶意公投。决策保证金将被扣除       |                         Malicious referendum（恶意公投）                         |
    | Fast General Admin（快速通用管理）  |                      用于更快的通用链上决策                       |                       HRMP channel management（HRMP 通道管理）                        |

轨道具有不同的标准参数，这些参数与其 Origin 类的级别成正比。例如，更危险和特权的公投将具有更多的保障措施、更高的阈值和更长的批准考虑期。请参阅 [治理参数](#governance-parameters-v2) 部分以获取更多信息。

--8<-- 'zh/text/learn/features/governance/vote-conviction-definitions.md'

--8<-- 'zh/text/learn/features/governance/approval-support-definitions.md'

--8<-- 'zh/text/learn/features/governance/lead-in-definitions.md'
    
 - **Decide Period（决定期）** - 代币持有者继续对公投进行投票。如果公投在期限结束时未通过，它将被拒绝，并且决策保证金将被退还
 - **Confirm Period（确认期）** - 决定期内的一段时间，在此期间公投需要保持足够的赞成和支持才能被批准并进入实施期
 - **Enactment Period（实施期）** - 一个指定的时间，该时间在创建提案时定义，批准的公投在可以分发之前等待。每个轨道都有最短时间限制

--8<-- 'zh/text/learn/features/governance/delegation-definitions.md'

### Governance Parameters {: #governance-parameters-v2 }

=== "Moonbeam"  
    |          Variable           |                           Value                            |
    |:---------------------------:|:----------------------------------------------------------:|
    |    Preimage base deposit    |     {{ networks.moonbeam.preimage.base_deposit }} GLMR     |
    |  Preimage deposit per byte  |     {{ networks.moonbeam.preimage.byte_deposit }} GLMR     |
    | Proposal Submission Deposit | {{ networks.moonbeam.governance.submission_deposit }} GLMR |

=== "Moonriver"
    |          Variable           |                            Value                            |
    |:---------------------------:|:-----------------------------------------------------------:|
    |    Preimage base deposit    |     {{ networks.moonriver.preimage.base_deposit }} MOVR     |
    |  Preimage deposit per byte  |     {{ networks.moonriver.preimage.byte_deposit }} MOVR     |
    | Proposal Submission Deposit | {{ networks.moonriver.governance.submission_deposit }} MOVR |

=== "Moonbase Alpha"
    |          Variable           |                           Value                           |
    |:---------------------------:|:---------------------------------------------------------:|
    |    Preimage base deposit    |     {{ networks.moonbase.preimage.base_deposit }} DEV     |
    |  Preimage deposit per byte  |     {{ networks.moonbase.preimage.byte_deposit }} DEV     |
    | Proposal Submission Deposit | {{ networks.moonbase.governance.submission_deposit }} DEV |

#### 按 Track 列出的一般参数 {: #general-parameters-by-track }

=== "Moonbeam"
    |         Track          | Track ID |                                      容量                                       |                                决策<br>保证金                                 |
    |:----------------------:|:--------:|:-----------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------:|
    |          Root          |    0     |        {{ networks.moonbeam.governance.tracks.root.max_deciding }} 个提案        |        {{ networks.moonbeam.governance.tracks.root.decision_deposit }} GLMR        |
    |      已加入白名单       |    1     |    {{ networks.moonbeam.governance.tracks.whitelisted.max_deciding }} 个提案     |    {{ networks.moonbeam.governance.tracks.whitelisted.decision_deposit }} GLMR     |
    |     通用管理员      |    2     |   {{ networks.moonbeam.governance.tracks.general_admin.max_deciding }} 个提案    |   {{ networks.moonbeam.governance.tracks.general_admin.decision_deposit }} GLMR    |
    | 紧急<br>取消者 |    3     |     {{ networks.moonbeam.governance.tracks.canceller.max_deciding }} 个提案      |     {{ networks.moonbeam.governance.tracks.canceller.decision_deposit }} GLMR      |
    |  紧急<br>终止者   |    4     |       {{ networks.moonbeam.governance.tracks.killer.max_deciding }} 个提案       |       {{ networks.moonbeam.governance.tracks.killer.decision_deposit }} GLMR       |
    |   快速通用管理员   |    5     | {{ networks.moonbeam.governance.tracks.fast_general_admin.max_deciding }} 个提案 | {{ networks.moonbeam.governance.tracks.fast_general_admin.decision_deposit }} GLMR |

=== "Moonriver"
    |         Track          | Track ID |                                       容量                                       |                                 决策<br>保证金                                 |
    |:----------------------:|:--------:|:------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------:|
    |          Root          |    0     |        {{ networks.moonriver.governance.tracks.root.max_deciding }} 个提案        |        {{ networks.moonriver.governance.tracks.root.decision_deposit }} MOVR        |
    |      已加入白名单       |    1     |    {{ networks.moonriver.governance.tracks.whitelisted.max_deciding }} 个提案     |    {{ networks.moonriver.governance.tracks.whitelisted.decision_deposit }} MOVR     |
    |     通用管理员      |    2     |   {{ networks.moonriver.governance.tracks.general_admin.max_deciding }} 个提案    |   {{ networks.moonriver.governance.tracks.general_admin.decision_deposit }} MOVR    |
    | 紧急<br>取消者 |    3     |     {{ networks.moonriver.governance.tracks.canceller.max_deciding }} 个提案      |     {{ networks.moonriver.governance.tracks.canceller.decision_deposit }} MOVR      |
    |  紧急<br>终止者   |    4     |       {{ networks.moonriver.governance.tracks.killer.max_deciding }} 个提案       |       {{ networks.moonriver.governance.tracks.killer.decision_deposit }} MOVR       |
    |   快速通用管理员   |    5     | {{ networks.moonriver.governance.tracks.fast_general_admin.max_deciding }} 个提案 | {{ networks.moonriver.governance.tracks.fast_general_admin.decision_deposit }} MOVR |

=== "Moonbase Alpha"
    |         Track          | Track ID |                                      容量                                       |                                决策<br>保证金                                |
    |:----------------------:|:--------:|:-----------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------:|
    |          Root          |    0     |        {{ networks.moonbase.governance.tracks.root.max_deciding }} 个提案        |        {{ networks.moonbase.governance.tracks.root.decision_deposit }} DEV        |
    |      已加入白名单       |    1     |    {{ networks.moonbase.governance.tracks.whitelisted.max_deciding }} 个提案     |    {{ networks.moonbase.governance.tracks.whitelisted.decision_deposit }} DEV     |
    |     通用管理员      |    2     |   {{ networks.moonbase.governance.tracks.general_admin.max_deciding }} 个提案    |   {{ networks.moonbase.governance.tracks.general_admin.decision_deposit }} DEV    |
    | 紧急<br>取消者 |    3     |     {{ networks.moonbase.governance.tracks.canceller.max_deciding }} 个提案      |     {{ networks.moonbase.governance.tracks.canceller.decision_deposit }} DEV      |
    |  紧急<br>终止者   |    4     |       {{ networks.moonbase.governance.tracks.killer.max_deciding }} 个提案       |       {{ networks.moonbase.governance.tracks.killer.decision_deposit }} DEV       |
    |   快速通用管理员   |    5     | {{ networks.moonbase.governance.tracks.fast_general_admin.max_deciding }} 个提案 | {{ networks.moonbase.governance.tracks.fast_general_admin.decision_deposit }} DEV |

#### 按 Track 列出周期参数 {: #period-parameters-by-track }

=== "Moonbeam"
    |         Track          |                                                                                准备<br>期                                                                                 |                                                                                  Decide<br>Period                                                                                  |                                                                                确认<br>期                                                                                 |                                                                                 Minimum<br>Enactment Period                                                                                  |
    |:----------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          Root          |               {{ networks.moonbeam.governance.tracks.root.prepare_period.blocks }} blocks <br>({{ networks.moonbeam.governance.tracks.root.prepare_period.time }})               |               {{ networks.moonbeam.governance.tracks.root.decision_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.root.decision_period.time }})               |               {{ networks.moonbeam.governance.tracks.root.confirm_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.root.confirm_period.time }})               |               {{ networks.moonbeam.governance.tracks.root.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.root.min_enactment_period.time }})               |
    |      已加入白名单       |        {{ networks.moonbeam.governance.tracks.whitelisted.prepare_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.whitelisted.prepare_period.time }})        |        {{ networks.moonbeam.governance.tracks.whitelisted.decision_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.whitelisted.decision_period.time }})        |        {{ networks.moonbeam.governance.tracks.whitelisted.confirm_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.whitelisted.confirm_period.time }})        |        {{ networks.moonbeam.governance.tracks.whitelisted.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.whitelisted.min_enactment_period.time }})        |
    |     通用管理员      |      {{ networks.moonbeam.governance.tracks.general_admin.prepare_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.general_admin.prepare_period.time }})      |      {{ networks.moonbeam.governance.tracks.general_admin.decision_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.general_admin.decision_period.time }})      |      {{ networks.moonbeam.governance.tracks.general_admin.confirm_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.general_admin.confirm_period.time }})      |      {{ networks.moonbeam.governance.tracks.general_admin.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.general_admin.min_enactment_period.time }})      |
    | 紧急<br>取消者 |          {{ networks.moonbeam.governance.tracks.canceller.prepare_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.canceller.prepare_period.time }})          |          {{ networks.moonbeam.governance.tracks.canceller.decision_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.canceller.decision_period.time }})          |          {{ networks.moonbeam.governance.tracks.canceller.confirm_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.canceller.confirm_period.time }})          |          {{ networks.moonbeam.governance.tracks.canceller.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.canceller.min_enactment_period.time }})          |
    |  紧急<br>终止者   |             {{ networks.moonbeam.governance.tracks.killer.prepare_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.killer.prepare_period.time }})             |             {{ networks.moonbeam.governance.tracks.killer.decision_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.killer.decision_period.time }})             |             {{ networks.moonbeam.governance.tracks.killer.confirm_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.killer.confirm_period.time }})             |             {{ networks.moonbeam.governance.tracks.killer.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.killer.min_enactment_period.time }})             |
    |   快速通用管理员   | {{ networks.moonbeam.governance.tracks.fast_general_admin.prepare_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.fast_general_admin.prepare_period.time }}) | {{ networks.moonbeam.governance.tracks.fast_general_admin.decision_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.fast_general_admin.decision_period.time }}) | {{ networks.moonbeam.governance.tracks.fast_general_admin.confirm_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.fast_general_admin.confirm_period.time }}) | {{ networks.moonbeam.governance.tracks.fast_general_admin.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbeam.governance.tracks.fast_general_admin.min_enactment_period.time }}) |

=== "Moonriver"
    |         Track          |                                                                                 准备<br>期                                                                                  |                                                                                   Decide<br>Period                                                                                   |                                                                                 确认<br>期                                                                                  |                                                                                  Minimum<br>Enactment Period                                                                                   |
    |:----------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          Root          |               {{ networks.moonriver.governance.tracks.root.prepare_period.blocks }} blocks <br>({{ networks.moonriver.governance.tracks.root.prepare_period.time }})               |               {{ networks.moonriver.governance.tracks.root.decision_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.root.decision_period.time }})               |               {{ networks.moonriver.governance.tracks.root.confirm_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.root.confirm_period.time }})               |               {{ networks.moonriver.governance.tracks.root.min_enactment_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.root.min_enactment_period.time }})               |
    |      已加入白名单       |        {{ networks.moonriver.governance.tracks.whitelisted.prepare_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.whitelisted.prepare_period.time }})        |        {{ networks.moonriver.governance.tracks.whitelisted.decision_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.whitelisted.decision_period.time }})        |        {{ networks.moonriver.governance.tracks.whitelisted.confirm_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.whitelisted.confirm_period.time }})        |        {{ networks.moonriver.governance.tracks.whitelisted.min_enactment_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.whitelisted.min_enactment_period.time }})        |
    |     通用管理员      |      {{ networks.moonriver.governance.tracks.general_admin.prepare_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.general_admin.prepare_period.time }})      |      {{ networks.moonriver.governance.tracks.general_admin.decision_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.general_admin.decision_period.time }})      |      {{ networks.moonriver.governance.tracks.general_admin.confirm_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.general_admin.confirm_period.time }})      |      {{ networks.moonriver.governance.tracks.general_admin.min_enactment_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.general_admin.min_enactment_period.time }})      |
    | 紧急<br>取消者 |          {{ networks.moonriver.governance.tracks.canceller.prepare_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.canceller.prepare_period.time }})          |          {{ networks.moonriver.governance.tracks.canceller.decision_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.canceller.decision_period.time }})          |          {{ networks.moonriver.governance.tracks.canceller.confirm_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.canceller.confirm_period.time }})          |          {{ networks.moonriver.governance.tracks.canceller.min_enactment_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.canceller.min_enactment_period.time }})          |
    |  紧急<br>终止者   |             {{ networks.moonriver.governance.tracks.killer.prepare_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.killer.prepare_period.time }})             |             {{ networks.moonriver.governance.tracks.killer.decision_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.killer.decision_period.time }})             |             {{ networks.moonriver.governance.tracks.killer.confirm_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.killer.confirm_period.time }})             |             {{ networks.moonriver.governance.tracks.killer.min_enactment_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.killer.min_enactment_period.time }})             |
    |   快速通用管理员   | {{ networks.moonriver.governance.tracks.fast_general_admin.prepare_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.fast_general_admin.prepare_period.time }}) | {{ networks.moonriver.governance.tracks.fast_general_admin.decision_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.fast_general_admin.decision_period.time }}) | {{ networks.moonriver.governance.tracks.fast_general_admin.confirm_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.fast_general_admin.confirm_period.time }}) | {{ networks.moonriver.governance.tracks.fast_general_admin.min_enactment_period.blocks }} blocks<br> ({{ networks.moonriver.governance.tracks.fast_general_admin.min_enactment_period.time }}) |

=== "Moonbase Alpha"
    |         Track          |                                                                                准备<br>期                                                                                 |                                                                                  Decide<br>Period                                                                                  |                                                                                确认<br>期                                                                                 |                                                                                 Minimum<br>Enactment Period                                                                                  |
    |:----------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          Root          |               {{ networks.moonbase.governance.tracks.root.prepare_period.blocks }} blocks <br>({{ networks.moonbase.governance.tracks.root.prepare_period.time }})               |               {{ networks.moonbase.governance.tracks.root.decision_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.root.decision_period.time }})               |               {{ networks.moonbase.governance.tracks.root.confirm_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.root.confirm_period.time }})               |               {{ networks.moonbase.governance.tracks.root.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.root.min_enactment_period.time }})               |
    |      已加入白名单       |        {{ networks.moonbase.governance.tracks.whitelisted.prepare_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.whitelisted.prepare_period.time }})        |        {{ networks.moonbase.governance.tracks.whitelisted.decision_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.whitelisted.decision_period.time }})        |        {{ networks.moonbase.governance.tracks.whitelisted.confirm_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.whitelisted.confirm_period.time }})        |        {{ networks.moonbase.governance.tracks.whitelisted.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.whitelisted.min_enactment_period.time }})        |
    |     通用管理员      |      {{ networks.moonbase.governance.tracks.general_admin.prepare_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.general_admin.prepare_period.time }})      |      {{ networks.moonbase.governance.tracks.general_admin.decision_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.general_admin.decision_period.time }})      |      {{ networks.moonbase.governance.tracks.general_admin.confirm_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.general_admin.confirm_period.time }})      |      {{ networks.moonbase.governance.tracks.general_admin.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.general_admin.min_enactment_period.time }})      |
    | 紧急<br>取消者 |          {{ networks.moonbase.governance.tracks.canceller.prepare_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.canceller.prepare_period.time }})          |          {{ networks.moonbase.governance.tracks.canceller.decision_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.canceller.decision_period.time }})          |          {{ networks.moonbase.governance.tracks.canceller.confirm_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.canceller.confirm_period.time }})          |          {{ networks.moonbase.governance.tracks.canceller.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.canceller.min_enactment_period.time }})          |
    |  紧急<br>终止者   |             {{ networks.moonbase.governance.tracks.killer.prepare_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.killer.prepare_period.time }})             |             {{ networks.moonbase.governance.tracks.killer.decision_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.killer.decision_period.time }})             |             {{ networks.moonbase.governance.tracks.killer.confirm_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.killer.confirm_period.time }})             |             {{ networks.moonbase.governance.tracks.killer.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.killer.min_enactment_period.time }})             |
    |   快速通用管理员   | {{ networks.moonbase.governance.tracks.fast_general_admin.prepare_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.fast_general_admin.prepare_period.time }}) | {{ networks.moonbase.governance.tracks.fast_general_admin.decision_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.fast_general_admin.decision_period.time }}) | {{ networks.moonbase.governance.tracks.fast_general_admin.confirm_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.fast_general_admin.confirm_period.time }}) | {{ networks.moonbase.governance.tracks.fast_general_admin.min_enactment_period.blocks }} blocks<br> ({{ networks.moonbase.governance.tracks.fast_general_admin.min_enactment_period.time }}) |

--8<-- 'zh/text/_common/async-backing.md'

#### 按 Track 列出支持与批准参数 {: #support-and-approval-parameters-by-track }

=== "Moonbeam"
    |         Track          | 批准 Curve |                                                                                                                                                                                                                                                 批准 Parameters                                                                                                                                                                                                                                                  | 支持 Curve |                                                                                                                                                                                                                                               支持 Parameters                                                                                                                                                                                                                                               |
    |:----------------------:|:--------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          Root          |   Reciprocal   |                                           {{ networks.moonbeam.governance.tracks.root.min_approval.time0 }}: {{ networks.moonbeam.governance.tracks.root.min_approval.percent0 }}%<br>{{ networks.moonbeam.governance.tracks.root.min_approval.time1 }}: {{ networks.moonbeam.governance.tracks.root.min_approval.percent1 }}%<br>{{ networks.moonbeam.governance.tracks.root.min_approval.time2 }}: {{ networks.moonbeam.governance.tracks.root.min_approval.percent2 }}%                                           |    Linear     |                                                                                                                {{ networks.moonbeam.governance.tracks.root.min_support.time0 }}: {{ networks.moonbeam.governance.tracks.root.min_support.percent0 }}%<br>{{ networks.moonbeam.governance.tracks.root.min_support.time1 }}: {{ networks.moonbeam.governance.tracks.root.min_support.percent1 }}%                                                                                                                |
    |      已加入白名单       |   Reciprocal   |                      {{ networks.moonbeam.governance.tracks.whitelisted.min_approval.time0 }}: {{ networks.moonbeam.governance.tracks.whitelisted.min_approval.percent0 }}%<br>{{ networks.moonbeam.governance.tracks.whitelisted.min_approval.time1 }}: {{ networks.moonbeam.governance.tracks.whitelisted.min_approval.percent1 }}%<br>{{ networks.moonbeam.governance.tracks.whitelisted.min_approval.time2 }}: {{ networks.moonbeam.governance.tracks.whitelisted.min_approval.percent2 }}%                      |  Reciprocal   |                      {{ networks.moonbeam.governance.tracks.whitelisted.min_support.time0 }}: {{ networks.moonbeam.governance.tracks.whitelisted.min_support.percent0 }}%<br>{{ networks.moonbeam.governance.tracks.whitelisted.min_support.time1 }}: {{ networks.moonbeam.governance.tracks.whitelisted.min_support.percent1 }}%<br>{{ networks.moonbeam.governance.tracks.whitelisted.min_support.time2 }}: {{ networks.moonbeam.governance.tracks.whitelisted.min_support.percent2 }}%                      |
    |     通用管理员      |   Reciprocal   |                {{ networks.moonbeam.governance.tracks.general_admin.min_approval.time0 }}: {{ networks.moonbeam.governance.tracks.general_admin.min_approval.percent0 }}%<br>{{ networks.moonbeam.governance.tracks.general_admin.min_approval.time1 }}: {{ networks.moonbeam.governance.tracks.general_admin.min_approval.percent1 }}%<br>{{ networks.moonbeam.governance.tracks.general_admin.min_approval.time2 }}: {{ networks.moonbeam.governance.tracks.general_admin.min_approval.percent2 }}%                |  Reciprocal   |                {{ networks.moonbeam.governance.tracks.general_admin.min_support.time0 }}: {{ networks.moonbeam.governance.tracks.general_admin.min_support.percent0 }}%<br>{{ networks.moonbeam.governance.tracks.general_admin.min_support.time1 }}: {{ networks.moonbeam.governance.tracks.general_admin.min_support.percent1 }}%<br>{{ networks.moonbeam.governance.tracks.general_admin.min_support.time2 }}: {{ networks.moonbeam.governance.tracks.general_admin.min_support.percent2 }}%                |
    | 紧急<br>取消者 |   Reciprocal   |                            {{ networks.moonbeam.governance.tracks.canceller.min_approval.time0 }}: {{ networks.moonbeam.governance.tracks.canceller.min_approval.percent0 }}%<br>{{ networks.moonbeam.governance.tracks.canceller.min_approval.time1 }}: {{ networks.moonbeam.governance.tracks.canceller.min_approval.percent1 }}%<br>{{ networks.moonbeam.governance.tracks.canceller.min_approval.time2 }}: {{ networks.moonbeam.governance.tracks.canceller.min_approval.percent2 }}%                            |  Reciprocal   |                            {{ networks.moonbeam.governance.tracks.canceller.min_support.time0 }}: {{ networks.moonbeam.governance.tracks.canceller.min_support.percent0 }}%<br>{{ networks.moonbeam.governance.tracks.canceller.min_support.time1 }}: {{ networks.moonbeam.governance.tracks.canceller.min_support.percent1 }}%<br>{{ networks.moonbeam.governance.tracks.canceller.min_support.time2 }}: {{ networks.moonbeam.governance.tracks.canceller.min_support.percent2 }}%                            |
    |  紧急<br>终止者   |   Reciprocal   |                                     {{ networks.moonbeam.governance.tracks.killer.min_approval.time0 }}: {{ networks.moonbeam.governance.tracks.killer.min_approval.percent0 }}%<br>{{ networks.moonbeam.governance.tracks.killer.min_approval.time1 }}: {{ networks.moonbeam.governance.tracks.killer.min_approval.percent1 }}%<br>{{ networks.moonbeam.governance.tracks.killer.min_approval.time2 }}: {{ networks.moonbeam.governance.tracks.killer.min_approval.percent2 }}%                                     |  Reciprocal   |                                     {{ networks.moonbeam.governance.tracks.killer.min_support.time0 }}: {{ networks.moonbeam.governance.tracks.killer.min_support.percent0 }}%<br>{{ networks.moonbeam.governance.tracks.killer.min_support.time1 }}: {{ networks.moonbeam.governance.tracks.killer.min_support.percent1 }}%<br>{{ networks.moonbeam.governance.tracks.killer.min_support.time2 }}: {{ networks.moonbeam.governance.tracks.killer.min_support.percent2 }}%                                     |
    |   快速通用管理员   |   Reciprocal   | {{ networks.moonbeam.governance.tracks.fast_general_admin.min_approval.time0 }}: {{ networks.moonbeam.governance.tracks.fast_general_admin.min_approval.percent0 }}%<br>{{ networks.moonbeam.governance.tracks.fast_general_admin.min_approval.time1 }}: {{ networks.moonbeam.governance.tracks.fast_general_admin.min_approval.percent1 }}%<br>{{ networks.moonbeam.governance.tracks.fast_general_admin.min_approval.time2 }}: {{ networks.moonbeam.governance.tracks.fast_general_admin.min_approval.percent2 }}% |  Reciprocal   | {{ networks.moonbeam.governance.tracks.fast_general_admin.min_support.time0 }}: {{ networks.moonbeam.governance.tracks.fast_general_admin.min_support.percent0 }}%<br>{{ networks.moonbeam.governance.tracks.fast_general_admin.min_support.time1 }}: {{ networks.moonbeam.governance.tracks.fast_general_admin.min_support.percent1 }}%<br>{{ networks.moonbeam.governance.tracks.fast_general_admin.min_support.time2 }}: {{ networks.moonbeam.governance.tracks.fast_general_admin.min_support.percent2 }}% |

=== "Moonriver"
    |         Track          | 批准 Curve |                                                                                                                                                                                                                                                    批准 Parameters                                                                                                                                                                                                                                                     | 支持 Curve |                                                                                                                                                                                                                                                  支持 Parameters                                                                                                                                                                                                                                                  |
    |:----------------------:|:--------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          Root          |   Reciprocal   |                                           {{ networks.moonriver.governance.tracks.root.min_approval.time0 }}: {{ networks.moonriver.governance.tracks.root.min_approval.percent0 }}%<br>{{ networks.moonriver.governance.tracks.root.min_approval.time1 }}: {{ networks.moonriver.governance.tracks.root.min_approval.percent1 }}%<br>{{ networks.moonriver.governance.tracks.root.min_approval.time2 }}: {{ networks.moonriver.governance.tracks.root.min_approval.percent2 }}%                                           |    Linear     |                                                                                                                 {{ networks.moonriver.governance.tracks.root.min_support.time0 }}: {{ networks.moonriver.governance.tracks.root.min_support.percent0 }}%<br>{{ networks.moonriver.governance.tracks.root.min_support.time1 }}: {{ networks.moonriver.governance.tracks.root.min_support.percent1 }}%                                                                                                                 |
    |      已加入白名单       |   Reciprocal   |                      {{ networks.moonriver.governance.tracks.whitelisted.min_approval.time0 }}: {{ networks.moonriver.governance.tracks.whitelisted.min_approval.percent0 }}%<br>{{ networks.moonriver.governance.tracks.whitelisted.min_approval.time1 }}: {{ networks.moonriver.governance.tracks.whitelisted.min_approval.percent1 }}%<br>{{ networks.moonriver.governance.tracks.whitelisted.min_approval.time2 }}: {{ networks.moonriver.governance.tracks.whitelisted.min_approval.percent2 }}%                      |  Reciprocal   |                      {{ networks.moonriver.governance.tracks.whitelisted.min_support.time0 }}: {{ networks.moonriver.governance.tracks.whitelisted.min_support.percent0 }}%<br>{{ networks.moonriver.governance.tracks.whitelisted.min_support.time1 }}: {{ networks.moonriver.governance.tracks.whitelisted.min_support.percent1 }}%<br>{{ networks.moonriver.governance.tracks.whitelisted.min_support.time2 }}: {{ networks.moonriver.governance.tracks.whitelisted.min_support.percent2 }}%                      |
    |     通用管理员      |   Reciprocal   |                {{ networks.moonriver.governance.tracks.general_admin.min_approval.time0 }}: {{ networks.moonriver.governance.tracks.general_admin.min_approval.percent0 }}%<br>{{ networks.moonriver.governance.tracks.general_admin.min_approval.time1 }}: {{ networks.moonriver.governance.tracks.general_admin.min_approval.percent1 }}%<br>{{ networks.moonriver.governance.tracks.general_admin.min_approval.time2 }}: {{ networks.moonriver.governance.tracks.general_admin.min_approval.percent2 }}%                |  Reciprocal   |                {{ networks.moonriver.governance.tracks.general_admin.min_support.time0 }}: {{ networks.moonriver.governance.tracks.general_admin.min_support.percent0 }}%<br>{{ networks.moonriver.governance.tracks.general_admin.min_support.time1 }}: {{ networks.moonriver.governance.tracks.general_admin.min_support.percent1 }}%<br>{{ networks.moonriver.governance.tracks.general_admin.min_support.time2 }}: {{ networks.moonriver.governance.tracks.general_admin.min_support.percent2 }}%                |
    | 紧急<br>取消者 |   Reciprocal   |                            {{ networks.moonriver.governance.tracks.canceller.min_approval.time0 }}: {{ networks.moonriver.governance.tracks.canceller.min_approval.percent0 }}%<br>{{ networks.moonriver.governance.tracks.canceller.min_approval.time1 }}: {{ networks.moonriver.governance.tracks.canceller.min_approval.percent1 }}%<br>{{ networks.moonriver.governance.tracks.canceller.min_approval.time2 }}: {{ networks.moonriver.governance.tracks.canceller.min_approval.percent2 }}%                            |  Reciprocal   |                            {{ networks.moonriver.governance.tracks.canceller.min_support.time0 }}: {{ networks.moonriver.governance.tracks.canceller.min_support.percent0 }}%<br>{{ networks.moonriver.governance.tracks.canceller.min_support.time1 }}: {{ networks.moonriver.governance.tracks.canceller.min_support.percent1 }}%<br>{{ networks.moonriver.governance.tracks.canceller.min_support.time2 }}: {{ networks.moonriver.governance.tracks.canceller.min_support.percent2 }}%                            |
    |  紧急<br>终止者   |   Reciprocal   |                                     {{ networks.moonriver.governance.tracks.killer.min_approval.time0 }}: {{ networks.moonriver.governance.tracks.killer.min_approval.percent0 }}%<br>{{ networks.moonriver.governance.tracks.killer.min_approval.time1 }}: {{ networks.moonriver.governance.tracks.killer.min_approval.percent1 }}%<br>{{ networks.moonriver.governance.tracks.killer.min_approval.time2 }}: {{ networks.moonriver.governance.tracks.killer.min_approval.percent2 }}%                                     |  Reciprocal   |                                     {{ networks.moonriver.governance.tracks.killer.min_support.time0 }}: {{ networks.moonriver.governance.tracks.killer.min_support.percent0 }}%<br>{{ networks.moonriver.governance.tracks.killer.min_support.time1 }}: {{ networks.moonriver.governance.tracks.killer.min_support.percent1 }}%<br>{{ networks.moonriver.governance.tracks.killer.min_support.time2 }}: {{ networks.moonriver.governance.tracks.killer.min_support.percent2 }}%                                     |
    |   快速通用管理员   |   Reciprocal   | {{ networks.moonriver.governance.tracks.fast_general_admin.min_approval.time0 }}: {{ networks.moonriver.governance.tracks.fast_general_admin.min_approval.percent0 }}%<br>{{ networks.moonriver.governance.tracks.fast_general_admin.min_approval.time1 }}: {{ networks.moonriver.governance.tracks.fast_general_admin.min_approval.percent1 }}%<br>{{ networks.moonriver.governance.tracks.fast_general_admin.min_approval.time2 }}: {{ networks.moonriver.governance.tracks.fast_general_admin.min_approval.percent2 }}% |  Reciprocal   | {{ networks.moonriver.governance.tracks.fast_general_admin.min_support.time0 }}: {{ networks.moonriver.governance.tracks.fast_general_admin.min_support.percent0 }}%<br>{{ networks.moonriver.governance.tracks.fast_general_admin.min_support.time1 }}: {{ networks.moonriver.governance.tracks.fast_general_admin.min_support.percent1 }}%<br>{{ networks.moonriver.governance.tracks.fast_general_admin.min_support.time2 }}: {{ networks.moonriver.governance.tracks.fast_general_admin.min_support.percent2 }}% |

=== "Moonbase Alpha"
    |         Track          | 批准 Curve |                                                                                                                                                                                                                                                 批准 Parameters                                                                                                                                                                                                                                                  | 支持 Curve |                                                                                                                                                                                                                                               支持 Parameters                                                                                                                                                                                                                                               |
    |:----------------------:|:--------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          Root          |   Reciprocal   |                                           {{ networks.moonbase.governance.tracks.root.min_approval.time0 }}: {{ networks.moonbase.governance.tracks.root.min_approval.percent0 }}%<br>{{ networks.moonbase.governance.tracks.root.min_approval.time1 }}: {{ networks.moonbase.governance.tracks.root.min_approval.percent1 }}%<br>{{ networks.moonbase.governance.tracks.root.min_approval.time2 }}: {{ networks.moonbase.governance.tracks.root.min_approval.percent2 }}%                                           |    Linear     |                                                                                                                {{ networks.moonbase.governance.tracks.root.min_support.time0 }}: {{ networks.moonbase.governance.tracks.root.min_support.percent0 }}%<br>{{ networks.moonbase.governance.tracks.root.min_support.time1 }}: {{ networks.moonbase.governance.tracks.root.min_support.percent1 }}%                                                                                                                |
    |      已加入白名单       |   Reciprocal   |                      {{ networks.moonbase.governance.tracks.whitelisted.min_approval.time0 }}: {{ networks.moonbase.governance.tracks.whitelisted.min_approval.percent0 }}%<br>{{ networks.moonbase.governance.tracks.whitelisted.min_approval.time1 }}: {{ networks.moonbase.governance.tracks.whitelisted.min_approval.percent1 }}%<br>{{ networks.moonbase.governance.tracks.whitelisted.min_approval.time2 }}: {{ networks.moonbase.governance.tracks.whitelisted.min_approval.percent2 }}%                      |  Reciprocal   |                      {{ networks.moonbase.governance.tracks.whitelisted.min_support.time0 }}: {{ networks.moonbase.governance.tracks.whitelisted.min_support.percent0 }}%<br>{{ networks.moonbase.governance.tracks.whitelisted.min_support.time1 }}: {{ networks.moonbase.governance.tracks.whitelisted.min_support.percent1 }}%<br>{{ networks.moonbase.governance.tracks.whitelisted.min_support.time2 }}: {{ networks.moonbase.governance.tracks.whitelisted.min_support.percent2 }}%                      |
    |     通用管理员      |   Reciprocal   |                {{ networks.moonbase.governance.tracks.general_admin.min_approval.time0 }}: {{ networks.moonbase.governance.tracks.general_admin.min_approval.percent0 }}%<br>{{ networks.moonbase.governance.tracks.general_admin.min_approval.time1 }}: {{ networks.moonbase.governance.tracks.general_admin.min_approval.percent1 }}%<br>{{ networks.moonbase.governance.tracks.general_admin.min_approval.time2 }}: {{ networks.moonbase.governance.tracks.general_admin.min_approval.percent2 }}%                |  Reciprocal   |                {{ networks.moonbase.governance.tracks.general_admin.min_support.time0 }}: {{ networks.moonbase.governance.tracks.general_admin.min_support.percent0 }}%<br>{{ networks.moonbase.governance.tracks.general_admin.min_support.time1 }}: {{ networks.moonbase.governance.tracks.general_admin.min_support.percent1 }}%<br>{{ networks.moonbase.governance.tracks.general_admin.min_support.time2 }}: {{ networks.moonbase.governance.tracks.general_admin.min_support.percent2 }}%                |
    | 紧急<br>取消者 |   Reciprocal   |                            {{ networks.moonbase.governance.tracks.canceller.min_approval.time0 }}: {{ networks.moonbase.governance.tracks.canceller.min_approval.percent0 }}%<br>{{ networks.moonbase.governance.tracks.canceller.min_approval.time1 }}: {{ networks.moonbase.governance.tracks.canceller.min_approval.percent1 }}%<br>{{ networks.moonbase.governance.tracks.canceller.min_approval.time2 }}: {{ networks.moonbase.governance.tracks.canceller.min_approval.percent2 }}%                            |  Reciprocal   |                            {{ networks.moonbase.governance.tracks.canceller.min_support.time0 }}: {{ networks.moonbase.governance.tracks.canceller.min_support.percent0 }}%<br>{{ networks.moonbase.governance.tracks.canceller.min_support.time1 }}: {{ networks.moonbase.governance.tracks.canceller.min_support.percent1 }}%<br>{{ networks.moonbase.governance.tracks.canceller.min_support.time2 }}: {{ networks.moonbase.governance.tracks.canceller.min_support.percent2 }}%                            |
    |  紧急<br>终止者   |   Reciprocal   |                                     {{ networks.moonbase.governance.tracks.killer.min_approval.time0 }}: {{ networks.moonbase.governance.tracks.killer.min_approval.percent0 }}%<br>{{ networks.moonbase.governance.tracks.killer.min_approval.time1 }}: {{ networks.moonbase.governance.tracks.killer.min_approval.percent1 }}%<br>{{ networks.moonbase.governance.tracks.killer.min_approval.time2 }}: {{ networks.moonbase.governance.tracks.killer.min_approval.percent2 }}%                                     |  Reciprocal   |                                     {{ networks.moonbase.governance.tracks.killer.min_support.time0 }}: {{ networks.moonbase.governance.tracks.killer.min_support.percent0 }}%<br>{{ networks.moonbase.governance.tracks.killer.min_support.time1 }}: {{ networks.moonbase.governance.tracks.killer.min_support.percent1 }}%<br>{{ networks.moonbase.governance.tracks.killer.min_support.time2 }}: {{ networks.moonbase.governance.tracks.killer.min_support.percent2 }}%                                     |
    |   快速通用管理员   |   Reciprocal   | {{ networks.moonbase.governance.tracks.fast_general_admin.min_approval.time0 }}: {{ networks.moonbase.governance.tracks.fast_general_admin.min_approval.percent0 }}%<br>{{ networks.moonbase.governance.tracks.fast_general_admin.min_approval.time1 }}: {{ networks.moonbase.governance.tracks.fast_general_admin.min_approval.percent1 }}%<br>{{ networks.moonbase.governance.tracks.fast_general_admin.min_approval.time2 }}: {{ networks.moonbase.governance.tracks.fast_general_admin.min_approval.percent2 }}% |  Reciprocal   | {{ networks.moonbase.governance.tracks.fast_general_admin.min_support.time0 }}: {{ networks.moonbase.governance.tracks.fast_general_admin.min_support.percent0 }}%<br>{{ networks.moonbase.governance.tracks.fast_general_admin.min_support.time1 }}: {{ networks.moonbase.governance.tracks.fast_general_admin.min_support.percent1 }}%<br>{{ networks.moonbase.governance.tracks.fast_general_admin.min_support.time2 }}: {{ networks.moonbase.governance.tracks.fast_general_admin.min_support.percent2 }}% |

#### 确信倍数 {: #conviction-multiplier-v2 }

确信倍数与在全民公投通过后，代币将被锁定的执行周期数相关。因此，您愿意锁定代币的时间越长，您的投票权重就越大。您也可以选择根本不锁定代币，但投票权重会大大降低（代币在全民公投期间仍会被锁定）。

如果您以 6 倍的确信度投票 1000 个代币，则您的加权投票将为 6000 个单位。也就是说，1000 个锁定的代币乘以确信度，在本例中为 6。另一方面，如果您决定在颁布后不想锁定您的代币，您可以以 0.1 倍的确信度投票您的 1000 个代币。在这种情况下，您的加权投票仅为 100 个单位。

每个网络的确信倍数值为：

=== "Moonbeam"
    | 执行后锁定周期 | 确信倍数 |      大概锁定时间       |
    |:----------------------------:|:---------------------:|:--------------------------------------------------------------:|
    |              0               |          0.1          |                              无                              |
    |              1               |           1           | {{networks.moonbeam.conviction.lock_period.conviction_1}} 天  |
    |              2               |           2           | {{networks.moonbeam.conviction.lock_period.conviction_2}} 天 |
    |              4               |           3           | {{networks.moonbeam.conviction.lock_period.conviction_3}} 天 |
    |              8               |           4           | {{networks.moonbeam.conviction.lock_period.conviction_4}} 天 |
    |              16              |           5           | {{networks.moonbeam.conviction.lock_period.conviction_5}} 天 |
    |              32              |           6           | {{networks.moonbeam.conviction.lock_period.conviction_6}} 天 |

=== "Moonriver"
    | 执行后锁定周期 | 确信倍数 |        大概锁定时间        |
    |:----------------------------:|:---------------------:|:---------------------------------------------------------------:|
    |              0               |          0.1          |                              无                               |
    |              1               |           1           | {{networks.moonriver.conviction.lock_period.conviction_1}} 天  |
    |              2               |           2           | {{networks.moonriver.conviction.lock_period.conviction_2}} 天 |
    |              4               |           3           | {{networks.moonriver.conviction.lock_period.conviction_3}} 天 |
    |              8               |           4           | {{networks.moonriver.conviction.lock_period.conviction_4}} 天 |
    |              16              |           5           | {{networks.moonriver.conviction.lock_period.conviction_5}} 天 |
    |              32              |           6           | {{networks.moonriver.conviction.lock_period.conviction_6}} 天 |

=== "Moonbase Alpha"
    | 执行后锁定周期 | 确信倍数 |      大概锁定时间       |
    |:----------------------------:|:---------------------:|:--------------------------------------------------------------:|
    |              0               |          0.1          |                              无                              |
    |              1               |           1           | {{networks.moonbase.conviction.lock_period.conviction_1}} 天  |
    |              2               |           2           | {{networks.moonbase.conviction.lock_period.conviction_2}} 天 |
    |              4               |           3           | {{networks.moonbase.conviction.lock_period.conviction_3}} 天 |
    |              8               |           4           | {{networks.moonbase.conviction.lock_period.conviction_4}} 天 |
    |              16              |           5           | {{networks.moonbase.conviction.lock_period.conviction_5}} 天 |
    |              32              |           6           | {{networks.moonbase.conviction.lock_period.conviction_6}} 天 |

!!! note
    锁定时间近似值基于常规的 {{ networks.moonriver.block_time }} 秒区块时间。区块生成可能会有所不同，因此显示的锁定时间不应被视为精确值。

### 提案路线图 {: #roadmap-of-a-proposal-v2 }

在提交提案之前，提案的作者可以将其提案想法提交到[Moonbeam治理论坛](https://forum.moonbeam.network/c/governance/2){target=\_blank}的指定的民主提案部分，以获取社区的反馈，至少需要五天。然后，作者可以根据他们收集的反馈对提案进行调整。

一旦作者准备就绪，他们就可以在链上提交提案。为此，首先，他们需要提交提案的预映像。提交者需要绑定费用以在链上存储预映像。一旦提交者取消注释预映像，保证金就会退还。接下来，他们可以提交实际提案并支付提交保证金，这足以支付提案的链上存储成本。然后，导入期开始，社区可以通过锁定代币开始对提案投“赞成”或“反对”票。为了使全民投票能够推进并从导入期进入决定期，必须满足以下标准：

- 全民投票必须等待准备期，以便有足够的时间在提案进入下一阶段之前进行讨论
- 所选轨道中有足够的容量
- 已经支付了决策保证金，该保证金满足轨道的最低要求

如果全民投票符合上述标准，它将进入决定期，并在其指定的轨道中占据一个位置。在决定期中，投票继续进行，并且全民投票有设定的天数来达到批准和支持要求，以便它能够进入确认期。

一旦进入确认期，全民投票必须在整个期间内持续满足批准和支持要求。如果全民投票在任何时候未能满足要求，它将被返回到决定期。如果全民投票再次满足批准和支持要求，它可以再次进入确认期，并且决定期将被延迟到确认期结束。如果决定期结束，但尚未收到足够的批准和支持，全民投票将被拒绝，决策保证金将被退还。提案可以随时再次提出。

如果全民投票在确认期内持续收到足够的批准和支持，它将被批准并进入颁布期。它将等待颁布期的持续时间，然后才能被分派。

提案的理想路径如下图所示：

![OpenGov中提案路线图的理想路径图。](/images/learn/features/governance/proposal-roadmap.webp)

### 提案示例演练

在 Moonriver 上为 General Admin Track 提交的提案（及其原像）将具有以下特征：

 - 批准曲线从 {{ networks.moonriver.governance.tracks.general_admin.min_approval.percent0 }}% 开始于 {{ networks.moonriver.governance.tracks.general_admin.min_approval.time0 }}，到 {{ networks.moonriver.governance.tracks.general_admin.min_approval.percent1 }}% 结束于 {{ networks.moonriver.governance.tracks.general_admin.min_approval.time1 }}
 - 支持曲线从 {{ networks.moonriver.governance.tracks.general_admin.min_support.percent0 }}% 开始于 {{ networks.moonriver.governance.tracks.general_admin.min_support.time0 }}，到 {{ networks.moonriver.governance.tracks.general_admin.min_support.percent1 }}% 结束于 {{ networks.moonriver.governance.tracks.general_admin.min_support.time1 }}
 - 全民投票以 0% 的“赞成”票（在引导期内没有人投票）开始“决定期”
 - 代币持有者开始投票，批准率在 {{ networks.moonriver.governance.tracks.general_admin.min_approval.time1 }} 之前增加到 {{ networks.moonriver.governance.tracks.general_admin.min_approval.percent1 }}% 以上的值
 - 如果在确认期（{{ networks.moonriver.governance.tracks.general_admin.confirm_period.blocks }} 区块，大约 {{ networks.moonriver.governance.tracks.general_admin.confirm_period.time }}）内达到批准和支持阈值，则全民投票获得批准
 - 如果在“决定期”内未达到批准和支持阈值，则提案将被拒绝。请注意，需要在“确认期”内满足阈值。因此，如果满足阈值，但在“决定期”到期时“确认期”尚未完成，则提案将被拒绝

可以使用以下公式计算批准和支持百分比：

=== "Approval"

    ```text
    Approval = 100 * ( Total Conviction-weighted "Aye" votes / Total Conviction-weighted votes ) 
    ```

=== "Support"

    ```text
    Support = 100 * ( Total Aye + Abstain votes, ignoring conviction / Total supply )
    ```

### 提案取消 {: #proposal-cancellations }

如果发现已进入投票阶段的提案存在问题，则可能需要阻止其获得批准。这些情况可能涉及恶意活动或技术问题，由于最近对网络的升级，这些问题使得更改无法实施。

取消必须由网络投票才能执行。取消提案比典型的提案更快，因为它们必须在寻求取消的提案颁布之前决定，但它们遵循与其他全民公投相同的流程。

有一个取消发起方（Origin）用于针对包含意外问题的全民公投，称为紧急取消者（Emergency Canceller）。紧急取消者发起方和 Root Origin 允许取消全民公投。无论发起方如何，如果提案被取消，它将被拒绝，并且决策保证金（Decision Deposit）将被退还。

此外，还有一个 Kill Origin，用于旨在损害网络的恶意全民公投，称为紧急杀手（Emergency Killer）。紧急杀手发起方和 Root Origin 有能力终止全民公投。在这种情况下，提案将被取消，并且决策保证金将被削减，这意味着无论发起方如何，保证金金额都会被销毁。

### OpenGov技术委员会的权利 {: #rights-of-the-opengov-technical-committee }

在Polkadot上，来自Governance v1的技术委员会被Fellowship取代，根据[Polkadot的wiki](https://wiki.polkadot.com/general/web3-and-polkadot/#fellowship){target=\_blank}，Fellowship是“一个主要目标是代表那些体现并包含Kusama和/或Polkadot网络和协议技术知识库的人类，并且在很大程度上是自治的专家机构”。

对于Moonbeam的OpenGov实施，没有采用Fellowship，而是有一个社区OpenGov技术委员会，它具有与Fellowship非常相似的权力。他们在治理中的权力在于他们有能力将提案列入白名单。OpenGov技术委员会成员只有在将提案列入白名单可以防止网络出现安全漏洞时，才能投票将提案列入白名单。OpenGov技术委员会成员是否将提案列入白名单的通过门槛由治理决定。因此，OpenGov技术委员会对网络的权力非常有限。其目的是对代币持有人提出的紧急安全问题进行技术审查。

虽然仍然受制于治理，但白名单通道背后的想法是，它将具有不同的参数，以使提案更快地通过。白名单通道的参数，包括批准、支持和投票，由Moonriver或Moonbeam代币持有人通过治理决定，OpenGov技术委员会无法更改。

OpenGov技术委员会由在基于Moonbeam的网络中具有技术知识和专业知识的社区成员组成。

### OpenGov 相关指南 {: #try-it-out }

有关通过 OpenGov 在 Moonbeam 上提交提案和参与公投的相关指南，请查看以下指南：

 - [如何提交提案](/tokens/governance/proposals/){target=\_blank}
 - [如何对提案进行投票](/tokens/governance/voting/){target=\_blank}
 - [与预映像预编译合约（Solidity 接口）交互](/builders/ethereum/precompiles/features/governance/preimage/){target=\_blank}
 - [与公投预编译合约（Solidity 接口）交互](/builders/ethereum/precompiles/features/governance/referenda/){target=\_blank}
 - [与信念投票预编译合约（Solidity 接口）交互](/builders/ethereum/precompiles/features/governance/conviction-voting/){target=\_blank}
