---
title: Governance
description: 作为 Polkadot 平行链，Moonbeam 使用链上治理系统，允许对公共提案进行权益加权投票。
categories: Governance, Basics
---

# Moonbeam 上的治理

## 简介 {: #introduction }

Moonbeam 的治理机制的目标是根据社区的意愿推进协议。在这一共同使命中，治理过程力求涵盖所有代币持有者。对协议的任何和所有更改都必须经过全民投票，以便所有代币持有者（按权益加权）都可以对决策发表意见。

诸如 [Moonbeam 社区论坛](https://forum.moonbeam.network){target=_blank} 和 [Polkassembly](https://moonbeam.polkassembly.io/opengov){target=_blank} 等治理论坛可以进行公开讨论，并允许根据社区的意见改进提案。自主制定和 [无分叉升级](https://docs.polkadot.com/develop/parachains/maintenance/runtime-upgrades/#forkless-upgrades){target=_blank} 将社区团结在一起，共同推进协议。

随着 OpenGov（最初称为 Gov2）的推出，Polkadot 治理的第二阶段，治理流程引入了一些修改。您可以阅读 [OpenGov：什么是 Polkadot Gov2](https://moonbeam.network/news/opengov-what-is-polkadot-gov2){target=_blank} 博客文章，其中概述了 OpenGov 中所做的所有更改。

从运行时 2400 开始，所有 Moonbeam 网络都使用 OpenGov 作为其治理系统。

## 原则 {: #principles }

参与 Moonbeam 治理过程的指导性“软”原则包括：

- 对希望参与 Moonbeam 并受治理决策影响的代币持有者具有包容性
- 偏向代币持有者的参与，即使观点与我们自己的观点相反，而不是缺乏参与
- 致力于决策过程的公开性和透明度
- 努力将网络的更大利益置于个人利益之上
- 始终充当道德代理人，从道德的角度考虑行动（或不作为）的后果
- 在与其他代币持有者互动时保持耐心和慷慨，但不容忍辱骂或破坏性语言、行为和举止，并遵守 [Moonbeam 的行为准则](https://github.com/moonbeam-foundation/code-of-conduct){target=_blank}

这些观点主要受到 Vlad Zamfir 关于治理的著作的启发。请参考他的文章，尤其是 [如何以诚信（和良好的礼仪）参与区块链治理](https://medium.com/@Vlad_Zamfir/how-to-participate-in-blockchain-governance-in-good-faith-and-with-good-manners-bd4e16846434){target=_blank} Medium 文章。

## 链上治理机制 {: #on-chain-governance-mechanics }

Moonbeam 的“硬”治理流程将由链上流程驱动，允许网络中的大多数代币决定围绕网络的关键决策的结果。这些决策点以对拟议的全民投票进行权益加权投票的形式出现。

此治理模型的一些主要组成部分包括：

 - **全民投票** — 一种基于权益的投票方案，其中每个全民投票都与更改 Moonbeam 系统的特定提案相关联，包括关键参数的值、代码升级或对治理系统本身的更改
 - **投票** — 全民投票将由代币持有人以权益加权的方式进行投票。通过的全民投票会延迟颁布，以便不同意该决策方向的人有时间退出网络
 - **理事会和技术委员会治理 V1** — 一组在系统内具有特殊投票权的社区成员。随着治理 v1 的弃用和移除，这两个委员会均已在 [runtime 2800 版本](https://forum.moonbeam.network/t/runtime-rt2801-schedule/1616/4){target=_blank} 中解散
 - **OpenGov 技术委员会** — 一组可以将某些提案添加到白名单轨道的社区成员

有关这些 Substrate 框架 pallets 如何实施链上治理的更多详细信息，您可以查看 [波卡治理方案漫游](https://polkadot.com/blog/a-walkthrough-of-polkadots-governance){target=_blank} 博客文章和 [波卡治理 Wiki](https://wiki.polkadot.com/learn/learn-polkadot-opengov/){target=_blank}。

## Governance v2：OpenGov {: #opengov }

本节将涵盖您需要了解的关于 Moonbeam 上的 OpenGov 的所有内容。

### 通用定义 {: #general-definitions-gov2 }

--8<-- 'text/learn/features/governance/proposal-definitions.md'

--8<-- 'text/learn/features/governance/preimage-definitions.md'

 - **Origin** - 基于授权的操作分发源，用于确定提案发布于哪个轨道下
 - **Track** - 特定于 Origin 的管道，概述了提案的生命周期。目前，有五个轨道：

    |    Origin 轨道     |                                   描述                                    |                         公投示例                          |
    |:-------------------:|:--------------------------------------------------------------------------------:|:--------------------------------------------------------------------:|
    |        Root         |                                最高权限                                 |           运行时升级、技术委员会管理           |
    |     Whitelisted     | 技术委员会在分发前将其列入白名单的提案 |                       快速通道操作                        |
    |    General Admin    |                          用于一般链上决策                          | 更改 XCM 费用、Orbiter 程序、质押参数、注册机构 |
    | Emergency Canceller |          用于取消公投。决策保证金将退还          |                    构建错误的公投                    |
    |  Emergency Killer   |       用于终止不良/恶意公投。决策保证金将被削减       |                         恶意公投                         |
    | Fast General Admin  |                      用于更快的通用链上决策                       |                       HRMP 通道管理                        |

轨道具有不同的标准参数，这些参数与其 Origin 类的级别成正比。例如，更危险和特权的公投将具有更多的保障措施、更高的阈值和更长的批准考虑期。请参阅[治理参数](#governance-parameters-v2)部分，了解更多信息。

--8<-- 'text/learn/features/governance/vote-conviction-definitions.md'

--8<-- 'text/learn/features/governance/approval-support-definitions.md'

--8<-- 'text/learn/features/governance/lead-in-definitions.md'
    
 - **Decide Period** - 代币持有人继续对公投进行投票。如果公投未在期限结束前通过，它将被拒绝，并且决策保证金将被退还
 - **Confirm Period** - Decide Period 内的一段时间，在此期间公投需要保持足够的批准和支持才能获得批准并进入 Enactment Period
 - **Enactment Period** - 指定的时间，在创建提案时定义，批准的公投在可以分发之前等待的时间。每个轨道都有最短时间

--8<-- 'text/learn/features/governance/delegation-definitions.md'

### 治理参数 {: #governance-parameters-v2 }

=== "Moonbeam"
    |          变量           |                           值                            |
    |:---------------------------:|:----------------------------------------------------------:|
    |    预映像基本存款    |     {{ networks.moonbeam.preimage.base_deposit }} GLMR     |
    |  每字节预映像存款  |     {{ networks.moonbeam.preimage.byte_deposit }} GLMR     |
    | 提案提交存款 | {{ networks.moonbeam.governance.submission_deposit }} GLMR |

=== "Moonriver"
    |          变量           |                            值                            |
    |:---------------------------:|:-----------------------------------------------------------:|
    |    预映像基本存款    |     {{ networks.moonriver.preimage.base_deposit }} MOVR     |
    |  每字节预映像存款  |     {{ networks.moonriver.preimage.byte_deposit }} MOVR     |
    | 提案提交存款 | {{ networks.moonriver.governance.submission_deposit }} MOVR |

=== "Moonbase Alpha"
    |          变量           |                           值                           |
    |:---------------------------:|:---------------------------------------------------------:|
    |    预映像基本存款    |     {{ networks.moonbase.preimage.base_deposit }} DEV     |
    |  每字节预映像存款  |     {{ networks.moonbase.preimage.byte_deposit }} DEV     |
    | 提案提交存款 | {{ networks.moonbase.governance.submission_deposit }} DEV |

#### 按轨道的常规参数 {: #general-parameters-by-track }

=== "Moonbeam"
    |         轨道          | 轨道 ID |                                      容量                                       |                                决策<br>存款                                 |
    |:----------------------:|:--------:|:-----------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------:|
    |          根          |    0     |        {{ networks.moonbeam.governance.tracks.root.max_deciding }} 个提案        |        {{ networks.moonbeam.governance.tracks.root.decision_deposit }} GLMR        |
    |      已列入白名单       |    1     |    {{ networks.moonbeam.governance.tracks.whitelisted.max_deciding }} 个提案     |    {{ networks.moonbeam.governance.tracks.whitelisted.decision_deposit }} GLMR     |
    |     常规管理员      |    2     |   {{ networks.moonbeam.governance.tracks.general_admin.max_deciding }} 个提案    |   {{ networks.moonbeam.governance.tracks.general_admin.decision_deposit }} GLMR    |
    | 紧急<br>取消者 |    3     |     {{ networks.moonbeam.governance.tracks.canceller.max_deciding }} 个提案      |     {{ networks.moonbeam.governance.tracks.canceller.decision_deposit }} GLMR      |
    |  紧急<br>杀手   |    4     |       {{ networks.moonbeam.governance.tracks.killer.max_deciding }} 个提案       |       {{ networks.moonbeam.governance.tracks.killer.decision_deposit }} GLMR       |
    |   快速常规管理员   |    5     | {{ networks.moonbeam.governance.tracks.fast_general_admin.max_deciding }} 个提案 | {{ networks.moonbeam.governance.tracks.fast_general_admin.decision_deposit }} GLMR |

=== "Moonriver"
    |         轨道          | 轨道 ID |                                       容量                                       |                                 决策<br>存款                                 |
    |:----------------------:|:--------:|:------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------:|
    |          根          |    0     |        {{ networks.moonriver.governance.tracks.root.max_deciding }} 个提案        |        {{ networks.moonriver.governance.tracks.root.decision_deposit }} MOVR        |
    |      已列入白名单       |    1     |    {{ networks.moonriver.governance.tracks.whitelisted.max_deciding }} 个提案     |    {{ networks.moonriver.governance.tracks.whitelisted.decision_deposit }} MOVR     |
    |     常规管理员      |    2     |   {{ networks.moonriver.governance.tracks.general_admin.max_deciding }} 个提案    |   {{ networks.moonriver.governance.tracks.general_admin.decision_deposit }} MOVR    |
    | 紧急<br>取消者 |    3     |     {{ networks.moonriver.governance.tracks.canceller.max_deciding }} 个提案      |     {{ networks.moonriver.governance.tracks.canceller.decision_deposit }} MOVR      |
    |  紧急<br>杀手   |    4     |       {{ networks.moonriver.governance.tracks.killer.max_deciding }} 个提案       |       {{ networks.moonriver.governance.tracks.killer.decision_deposit }} MOVR       |
    |   快速常规管理员   |    5     | {{ networks.moonriver.governance.tracks.fast_general_admin.max_deciding }} 个提案 | {{ networks.moonriver.governance.tracks.fast_general_admin.decision_deposit }} MOVR |

=== "Moonbase Alpha"
    |         轨道          | 轨道 ID |                                      容量                                       |                                决策<br>存款                                |
    |:----------------------:|:--------:|:-----------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------:|
    |          根          |    0     |        {{ networks.moonbase.governance.tracks.root.max_deciding }} 个提案        |        {{ networks.moonbase.governance.tracks.root.decision_deposit }} DEV        |
    |      已列入白名单       |    1     |    {{ networks.moonbase.governance.tracks.whitelisted.max_deciding }} 个提案     |    {{ networks.moonbase.governance.tracks.whitelisted.decision_deposit }} DEV     |
    |     常规管理员      |    2     |   {{ networks.moonbase.governance.tracks.general_admin.max_deciding }} 个提案    |   {{ networks.moonbase.governance.tracks.general_admin.decision_deposit }} DEV    |
    | 紧急<br>取消者 |    3     |     {{ networks.moonbase.governance.tracks.canceller.max_deciding }} 个提案      |     {{ networks.moonbase.governance.tracks.canceller.decision_deposit }} DEV      |
    |  紧急<br>杀手   |    4     |       {{ networks.moonbase.governance.tracks.killer.max_deciding }} 个提案       |       {{ networks.moonbase.governance.tracks.killer.decision_deposit }} DEV       |
    |   快速常规管理员   |    5     | {{ networks.moonbase.governance.tracks.fast_general_admin.max_deciding }} 个提案 | {{ networks.moonbase.governance.tracks.fast_general_admin.decision_deposit }} DEV |

#### 确信倍数 {: #conviction-multiplier-v2 }

确信倍数与在全民投票通过后（如果获得批准）代币将被锁定的Enactment Period的数量有关。因此，您愿意锁定代币的时间越长，您的投票权重就越高。您也可以选择根本不锁定代币，但是投票权重会大大降低（代币在全民投票期间仍会被锁定）。

如果您以 6 倍的 Conviction 投票 1000 个代币，则您的加权投票将为 6000 个单位。也就是说，1000 个锁定的代币乘以 Conviction，在本例中为 6。另一方面，如果您决定在颁布后不想锁定您的代币，则可以使用 0.1 倍的 Conviction 投票 1000 个代币。在这种情况下，您的加权投票仅为 100 个单位。

每个网络的 Conviction 倍数值为：

=== "Moonbeam"
    | 法定后锁定周期 | 确信倍数 | 大约锁定时间 |
    |:----------------------------:|:---------------------:|:--------------------------------------------------------------:|
    | 0 | 0.1 | 无 |
    | 1 | 1 | {{networks.moonbeam.conviction.lock_period.conviction_1}} 天 |
    | 2 | 2 | {{networks.moonbeam.conviction.lock_period.conviction_2}} 天 |
    | 4 | 3 | {{networks.moonbeam.conviction.lock_period.conviction_3}} 天 |
    | 8 | 4 | {{networks.moonbeam.conviction.lock_period.conviction_4}} 天 |
    | 16 | 5 | {{networks.moonbeam.conviction.lock_period.conviction_5}} 天 |
    | 32 | 6 | {{networks.moonbeam.conviction.lock_period.conviction_6}} 天 |

=== "Moonriver"
    | 法定后锁定周期 | 确信倍数 | 大约锁定时间 |
    |:----------------------------:|:---------------------:|:---------------------------------------------------------------:|
    | 0 | 0.1 | 无 |
    | 1 | 1 | {{networks.moonriver.conviction.lock_period.conviction_1}} 天 |
    | 2 | 2 | {{networks.moonriver.conviction.lock_period.conviction_2}} 天 |
    | 4 | 3 | {{networks.moonriver.conviction.lock_period.conviction_3}} 天 |
    | 8 | 4 | {{networks.moonriver.conviction.lock_period.conviction_4}} 天 |
    | 16 | 5 | {{networks.moonriver.conviction.lock_period.conviction_5}} 天 |
    | 32 | 6 | {{networks.moonriver.conviction.lock_period.conviction_6}} 天 |

=== "Moonbase Alpha"
    | 法定后锁定周期 | 确信倍数 | 大约锁定时间 |
    |:----------------------------:|:---------------------:|:--------------------------------------------------------------:|
    | 0 | 0.1 | 无 |
    | 1 | 1 | {{networks.moonbase.conviction.lock_period.conviction_1}} 天 |
    | 2 | 2 | {{networks.moonbase.conviction.lock_period.conviction_2}} 天 |
    | 4 | 3 | {{networks.moonbase.conviction.lock_period.conviction_3}} 天 |
    | 8 | 4 | {{networks.moonbase.conviction.lock_period.conviction_4}} 天 |
    | 16 | 5 | {{networks.moonbase.conviction.lock_period.conviction_5}} 天 |
    | 32 | 6 | {{networks.moonbase.conviction.lock_period.conviction_6}} 天 |

!!! note
    锁定时间近似值基于常规的 {{ networks.moonriver.block_time }} 秒区块时间。区块生产可能会有所不同，因此显示的锁定时间不应被视为确切值。

### 提案路线图 {: #roadmap-of-a-proposal-v2 }

在提交提案之前，提案的作者可以将其提案想法提交到 [Moonbeam 治理讨论论坛](https://forum.moonbeam.network/c/governance/2){target=\_blank} 的指定民主提案部分，以征求社区的反馈，至少需要五天。之后，作者可以根据他们收集到的反馈对提案进行调整。

一旦作者准备就绪，他们可以在链上提交提案。为此，首先，他们需要提交提案的预映像。提交者需要绑定一笔费用，以将预映像存储在链上。一旦提交者取消预映像注释，该绑定将会被返还。接下来，他们可以提交实际提案并支付提交保证金，这足以支付提案的链上存储成本。然后，进入导入期，社区可以通过锁定代币开始对提案投“赞成”或“反对”票。为了使全民公投能够进入并移出导入期进入决定期，必须满足以下标准：

- 全民公投必须等待准备期，以便有足够的时间在提案进入下一阶段之前对其进行讨论
- 所选轨道有足够的容量
- 已支付符合轨道最低要求的决定保证金

如果全民公投符合上述标准，则它将进入决定期，并占用其指定轨道中的一个位置。在决定期内，投票继续进行，并且全民公投有设定的天数来达到进入确认期所需的批准和支持要求。

一旦进入确认期，全民公投必须在该期间内持续满足批准和支持要求。如果在任何时候全民公投未能满足要求，它将返回到决定期。如果全民公投再次满足批准和支持要求，它可以再次进入确认期，并且决定期将延迟到确认期结束。如果决定期结束，但没有收到足够的批准和支持，则全民公投将被拒绝，并且决定保证金将被退还。该提案可以随时再次提出。

如果在确认期内，全民公投持续获得足够的批准和支持，它将被批准并进入颁布期。它将等待颁布期，然后才能被调度。

提案的快乐路径如下图所示：

![OpenGov 中提案路线图的快乐路径图。](/images/learn/features/governance/proposal-roadmap.webp)

### 提案示例演练

在 Moonriver 上针对 General Admin Track 提交的提案（及其预图像）将具有以下特征：

 - 批准曲线从 {{ networks.moonriver.governance.tracks.general_admin.min_approval.percent0 }}% 开始于 {{ networks.moonriver.governance.tracks.general_admin.min_approval.time0 }}，到 {{ networks.moonriver.governance.tracks.general_admin.min_approval.percent1 }}% 结束于 {{ networks.moonriver.governance.tracks.general_admin.min_approval.time1 }}
 - 支持曲线从 {{ networks.moonriver.governance.tracks.general_admin.min_support.percent0 }}% 开始于 {{ networks.moonriver.governance.tracks.general_admin.min_support.time0 }}，到 {{ networks.moonriver.governance.tracks.general_admin.min_support.percent1 }}% 结束于 {{ networks.moonriver.governance.tracks.general_admin.min_support.time1 }}
 - 公投以 0% 的 “赞成” 票开始决定期（在引导期内无人投票）
 - 代币持有人开始投票，批准率在 {{ networks.moonriver.governance.tracks.general_admin.min_approval.time1 }} 之前增加到 {{ networks.moonriver.governance.tracks.general_admin.min_approval.percent1 }}% 以上
 - 如果在确认期（{{ networks.moonriver.governance.tracks.general_admin.confirm_period.blocks }} 个区块，大约 {{ networks.moonriver.governance.tracks.general_admin.confirm_period.time }}）内满足批准和支持阈值，则公投获得批准
 - 如果在决定期内未满足批准和支持阈值，则提案将被拒绝。请注意，需要在确认期的持续时间内满足阈值。因此，如果满足了阈值，但在确认期完成之前决定期已过期，则提案将被拒绝

批准和支持百分比可以使用以下公式计算：

==="批准"

    text
    Approval = 100 * ( Total Conviction-weighted "Aye" votes / Total Conviction-weighted votes ) 
    

==="支持"

    text
    Support = 100 * ( Total Aye + Abstain votes, ignoring conviction / Total supply )

### 提案取消 {: #proposal-cancellations }

如果在投票阶段的提案被发现存在问题，可能需要阻止其获得批准。这些情况可能涉及恶意活动或技术问题，这些问题使得由于网络最近的升级而无法实施更改。

取消必须由网络投票才能执行。取消提案比典型提案更快，因为它们必须在寻求取消的提案颁布之前决定，但它们遵循与其他全民投票相同的流程。

有一个取消发起者用于应对包含不可预见问题的全民投票，称为紧急取消者。紧急取消者发起者和根发起者可以取消全民投票。无论发起者如何，如果提案被取消，它将被拒绝，并且决策保证金将被退还。

此外，还有一个终止发起者，用于旨在危害网络的恶意全民投票，称为紧急杀手。紧急杀手发起者和根发起者有能力终止全民投票。在这种情况下，提案被取消，并且决策保证金被削减，这意味着无论发起者如何，保证金金额都会被烧毁。

### OpenGov技术委员会的权利 {: #rights-of-the-opengov-technical-committee }

在Polkadot上，Governance v1的技术委员会被Fellowship取代，根据[Polkadot的wiki](https://wiki.polkadot.com/general/web3-and-polkadot/#fellowship){target=_blank}，Fellowship是“一个主要目标是代表体现和包含Kusama和/或Polkadot网络和协议的技术知识库的人类，并且在很大程度上是自治的专家机构”。

对于Moonbeam对OpenGov的实施，没有采用Fellowship，而是设立了一个社区OpenGov技术委员会，该委员会拥有与Fellowship非常相似的权力。他们在治理中的权力在于他们有能力将提案列入白名单。只有当列入白名单的提案可以防止网络的安全漏洞时，OpenGov技术委员会成员才可以投票将其列入白名单。OpenGov技术委员会成员是否将提案列入白名单的通过门槛由治理决定。因此，OpenGov技术委员会对网络的权力非常有限。其目的是对代币持有者提出的紧急安全问题进行技术审查。

虽然仍然受治理约束，但白名单轨道的理念是，它将具有不同的参数，以使提案更快地通过。白名单轨道的参数，包括批准、支持和投票，由Moonriver或Moonbeam代币持有者通过治理决定，并且不能由OpenGov技术委员会更改。

OpenGov技术委员会由社区成员组成，他们拥有在Moonbeam基础网络中的技术知识和专业知识。

### OpenGov 相关指南 {: #try-it-out }

有关使用 OpenGov 在 Moonbeam 上提交提案和对全民公投进行投票的相关指南，请查看以下指南：

 - [如何提交提案](/tokens/governance/proposals/){target=\_blank}
 - [如何对提案进行投票](/tokens/governance/voting/){target=\_blank}
 - [与预编译的 Preimages 合约（Solidity 接口）交互](/builders/ethereum/precompiles/features/governance/preimage/){target=\_blank}
 - [与预编译的全民公投合约（Solidity 接口）交互](/builders/ethereum/precompiles/features/governance/referenda/){target=\_blank}
 - [与预编译的信念投票合约（Solidity 接口）交互](/builders/ethereum/precompiles/features/governance/conviction-voting/){target=\_blank}
