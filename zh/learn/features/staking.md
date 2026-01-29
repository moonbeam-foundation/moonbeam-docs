---
title: 质押 (Staking)
description: Moonbeam 提供质押功能，代币持有者可以使用其代币委托收集人候选者并赚取奖励。
categories: 基础知识, 质押 (Staking)
---

# 在 Moonbeam 上进行质押

## 简介 {: #introduction }

Moonbeam 使用基于 [Polkadot 的权益证明模型](https://docs.polkadot.com/polkadot-protocol/architecture/polkadot-chain/pos-consensus/){target=\_blank} 的区块生产机制，其中有收集人和验证人。[收集人](https://wiki.polkadot.com/learn/learn-collator/){target=\_blank} 通过从用户那里收集交易并为中继链[验证人](https://wiki.polkadot.com/learn/learn-validator/){target=\_blank}生成状态转换证明来维护平行链（在本例中为 Moonbeam）。

活跃收集人集合（生成区块的节点）中的候选者是根据他们在网络中的权益来选择的。这就是质押的用武之地。

收集人候选者（以及如果他们委托，则为代币持有者）在网络中拥有权益。按质押数量排名的前 N 个候选者被选择来生成一组有效的交易区块，其中 N 是一个可配置的参数。每个区块奖励的一部分会分配给生成区块的收集人，然后收集人会根据委托人在收集人权益中所占的百分比，与委托人分享奖励。这样，网络成员就会被激励质押代币，以提高整体安全性。由于质押是在协议级别通过质押界面完成的，如果您选择委托，您委托的收集人将无法访问您的代币。

要轻松管理与质押相关的操作，您可以访问 [Moonbeam 网络 DApp](https://apps.moonbeam.network){target=\_blank} 并使用页面顶部的网络选项卡在 Moonbeam 网络之间轻松切换。要了解如何使用 DApp，您可以查看[如何在 Moonriver 上质押 MOVR 代币](https://moonbeam.network/news/how-to-stake-movr-tokens-on-moonriver-and-earn-staking-rewards){target=\_blank} 指南或[视频教程](https://www.youtube.com/watch?v=8GwetYmzEJM){target=\_blank}，两者都可以适用于 Moonbeam 和 Moonbase Alpha 测试网。

## 常见定义 {: #general-definitions }

以下是与 Moonbeam 上的 Staking 系统相关的一些重要参数，需要理解：

 - **Round（轮次）**— 强制执行 Staking 行为的特定区块数。例如，在下一轮开始时，新的委托将被执行。在减少绑定或撤销委托时，资金将在指定轮数后返还
 - **Candidates（候选人）**- 如果节点运营商能够获得足够的 Staking 量以进入活跃集，则有资格成为区块生产者
 - **Collators（整理人）**— 被选为区块生产者的候选人活跃集。他们从用户那里收集交易，并生成状态转换证明以供中继链验证
 - **Delegators（委托人）**— 质押代币并为特定整理人候选人担保的代币持有者。任何持有最少数量代币作为[可用余额](https://wiki.polkadot.com/learn/learn-accounts/#balance-types#balance-types)的用户都可以成为委托人
 - **Minimum delegation per candidate（每个候选人的最低委托量）**— 用户进入委托人集合后，委托给候选人的最小代币数量。
 - **Maximum delegators per candidate（每个候选人的最大委托人数）**— 根据质押数量，候选人可以拥有的符合获得 Staking 奖励资格的最大委托人数
 - **Maximum delegations（最大委托数）**— 委托人可以委托的最大候选人数
 - **Exit delay（退出延迟）**- 退出延迟是指候选人或委托人可以执行计划的请求以减少或撤销绑定、或离开候选人或委托人集合之前的轮数
 - **Reward payout delay（奖励支付延迟）**- 在 Staking 奖励自动分配到可用余额之前必须经过的轮次数
 - **Reward pool（奖励池）**- 预留给整理人和委托人的年度通货膨胀的一部分
 - **Collator commission（整理人佣金）**- 整理人从应付 Staking 奖励中提取的默认固定百分比。与奖励池无关
 - **Delegator rewards（委托人奖励）**— 在所有符合条件的委托人之间分配的累计委托人奖励，同时考虑到质押的相对大小（[了解更多](/learn/features/staking/#reward-distribution)）
 - **Auto-compounding（自动复利）**- 一种设置，可自动将委托人奖励的百分比应用于其委托的总金额
 - **Slashing（罚没）**— 一种阻止整理人不良行为的机制，通常整理人及其委托人会被罚没，损失一定百分比的质押。目前，没有罚没，但可以通过治理来更改。未被中继链最终确认的区块的整理人将不会收到奖励

## 快速参考 {: #quick-reference }

=== "Moonbeam"
    |             变量             |                                                                         值                                                                         |
    |:--------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          轮次持续时间          |                        {{ networks.moonbeam.staking.round_blocks }} 区块 ({{ networks.moonbeam.staking.round_hours }} 小时)                        |
    | 每个候选人的最小委托量 |                                                  {{ networks.moonbeam.staking.min_del_stake }} GLMR                                                   |
    | 每个候选人的最大委托人数 |                                                    {{ networks.moonbeam.staking.max_del_per_can }}                                                    |
    |       最大委托数        |                                                    {{ networks.moonbeam.staking.max_del_per_del }}                                                    |
    |       奖励支付延迟        |    {{ networks.moonbeam.delegator_timings.rewards_payouts.rounds }} 轮 ({{ networks.moonbeam.delegator_timings.rewards_payouts.hours }} 小时)    |
    |    添加或增加委托    |                                           在下一轮生效（资金立即提取）                                            |
    |    减少委托延迟     |      {{ networks.moonbeam.delegator_timings.del_bond_less.rounds }} 轮 ({{ networks.moonbeam.delegator_timings.del_bond_less.hours }} 小时)      |
    |     撤销委托延迟     | {{ networks.moonbeam.delegator_timings.revoke_delegations.rounds }} 轮 ({{ networks.moonbeam.delegator_timings.revoke_delegations.hours }} 小时) |
    |      离开委托人延迟      |   {{ networks.moonbeam.delegator_timings.leave_delegators.rounds }} 轮 ({{ networks.moonbeam.delegator_timings.leave_delegators.hours }} 小时)   |

=== "Moonriver"
    |             变量             |                                                                          值                                                                          |
    |:--------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          轮次持续时间          |                        {{ networks.moonriver.staking.round_blocks }} 区块 ({{ networks.moonriver.staking.round_hours }} 小时)                        |
    | 每个候选人的最小委托量 |                                                   {{ networks.moonriver.staking.min_del_stake }} MOVR                                                   |
    | 每个候选人的最大委托人数 |                                                    {{ networks.moonriver.staking.max_del_per_can }}                                                     |
    |       最大委托数        |                                                    {{ networks.moonriver.staking.max_del_per_del }}                                                     |
    |       奖励支付延迟        |    {{ networks.moonriver.delegator_timings.rewards_payouts.rounds }} 轮 ({{ networks.moonriver.delegator_timings.rewards_payouts.hours }} 小时)    |
    |    添加或增加委托    |                                            在下一轮生效（资金立即提取）                                             |
    |    减少委托延迟     |      {{ networks.moonriver.delegator_timings.del_bond_less.rounds }} 轮 ({{ networks.moonriver.delegator_timings.del_bond_less.hours }} 小时)      |
    |     撤销委托延迟     | {{ networks.moonriver.delegator_timings.revoke_delegations.rounds }} 轮 ({{ networks.moonriver.delegator_timings.revoke_delegations.hours }} 小时) |
    |      离开委托人延迟      |   {{ networks.moonriver.delegator_timings.leave_delegators.rounds }} 轮 ({{ networks.moonriver.delegator_timings.leave_delegators.hours }} 小时)   |

=== "Moonbase Alpha"
    |             变量             |                                                                         值                                                                         |
    |:--------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    |          轮次持续时间          |                        {{ networks.moonbase.staking.round_blocks }} 区块 ({{ networks.moonbase.staking.round_hours }} 小时)                        |
    | 每个候选人的最小委托量 |                                                   {{ networks.moonbase.staking.min_del_stake }} DEV                                                   |
    | 每个候选人的最大委托人数 |                                                    {{ networks.moonbase.staking.max_del_per_can }}                                                    |
    |       最大委托数        |                                                    {{ networks.moonbase.staking.max_del_per_del }}                                                    |
    |       奖励支付延迟        |    {{ networks.moonbase.delegator_timings.rewards_payouts.rounds }} 轮 ({{ networks.moonbase.delegator_timings.rewards_payouts.hours }} 小时)    |
    |    添加或增加委托    |                                           在下一轮生效（资金立即提取）                                            |
    |    减少委托延迟     |      {{ networks.moonbase.delegator_timings.del_bond_less.rounds }} 轮 ({{ networks.moonbase.delegator_timings.del_bond_less.hours }} 小时)      |
    |     撤销委托延迟     | {{ networks.moonbase.delegator_timings.revoke_delegations.rounds }} 轮 ({{ networks.moonbase.delegator_timings.revoke_delegations.hours }} 小时) |
    |      离开委托人延迟      |   {{ networks.moonbase.delegator_timings.leave_delegators.rounds }} 轮 ({{ networks.moonbase.delegator_timings.leave_delegators.hours }} 小时)   |

--8<-- 'zh/text/_common/async-backing.md'

要了解如何获取有关质押的任何参数的当前值，请查看[检索质押参数](/tokens/staking/stake/#retrieving-staking-parameters){target=\_blank}部分 [如何质押您的代币](/tokens/staking/stake/){target=\_blank} 指南。

如果您正在寻找候选人或整理人特定的要求和信息，您可以查看[整理人](/node-operators/networks/collators/requirements/#bonding-requirements){target=\_blank} 指南。

## 选择 Collator 的资源 {: #resources-for-selecting-a-collator}

您可以通过以下资源选择要委托的 Collator：

=== "Moonbeam"
|           变量           |                                      值                                      |
|:----------------------------:|:-------------------------------------------------------------------------------:|
|     质押 GLMR 仪表盘     |              [质押 GLMR](https://www.stakeglmr.com/){target=\_blank}               |
|    Collator 排行榜     |       [Moonscan](https://moonbeam.moonscan.io/collators){target=\_blank}       |
|      Collator 仪表盘      | [DappLooker](https://dapplooker.com/dashboard/moonbeam-collator-dashboard-91){target=\_blank} |

=== "Moonriver"
|           变量           |                                      值                                       |
|:----------------------------:|:--------------------------------------------------------------------------------:|
|     质押 MOVR 仪表盘     |               [质押 MOVR](https://stakemovr.com){target=\_blank}               |
|    Collator 排行榜     |       [Moonscan](https://moonriver.moonscan.io/collators){target=\_blank}       |
|      Collator 仪表盘      | [DappLooker](https://dapplooker.com/dashboard/moonriver-collator-dashboard-28){target=\_blank} |

=== "Moonbase Alpha"
|      变量      |                                      值                                       |
|:------------------:|:--------------------------------------------------------------------------------:|
| 候选人列表 | [Moonbase Alpha Subscan](https://moonbase.subscan.io/validator){target=\_blank} |

### 一般提示 {: #general-tips }

- 为了优化您的质押奖励，您通常应该选择总抵押量较低的整理人。在这种情况下，您的委托金额将代表整理人总质押中更大的部分，您将获得成比例的更高奖励。但是，整理人被踢出活跃集并且根本无法获得奖励的风险更高
- 每个整理人的最低保证金往往会随着时间的推移而增加，因此如果您的委托接近最低保证金，则您更有可能低于最低保证金而无法获得奖励
- 在多个整理人之间分配委托在奖励方面更有效，但仅当您有足够的资金保持在每个整理人的最低保证金之上时才建议这样做
- 您可以通过查看每个整理人最近生成的区块数量来考虑整理人的表现
- 您可以设置自动复利，这将自动重新质押指定百分比的您的委托奖励

## 奖励分配 {: #reward-distribution }

验证人和他们的委托人的奖励是在每一轮开始时计算的，根据他们先于[奖励支付延迟](#quick-reference)之前的工作。 例如，在 Moonriver 上，奖励是根据验证人从 {{ networks.moonriver.delegator_timings.rewards_payouts.rounds }} 轮之前的工作计算得出的。

计算出的奖励然后从该轮的第二个区块开始，逐个区块地支付。对于每个区块，将选择一个验证人来接收他们上一轮的全部奖励支付，以及他们的委托人，直到该轮的所有奖励都已支付完毕。例如，如果上一轮有 {{ networks.moonriver.staking.max_candidates }} 个验证人生成了区块，那么所有的验证人及其委托人都将由新区快 {{ networks.moonriver.staking.paid_out_block }} 支付。

您可以选择自动复投您的委托奖励，这样您就不再需要手动委托奖励。如果您选择设置自动复投，您可以指定要自动复投的奖励百分比。这些奖励将自动添加到您的委托中。

### 年度通货膨胀 {: #annual-inflation}

年度通货膨胀的分配如下：

=== "Moonbeam"
    |                 变量                  |                                         值                                         |
    |:-----------------------------------------:|:-------------------------------------------------------------------------------------:|
    |             年度通货膨胀              |               {{ networks.moonbeam.inflation.total_annual_inflation }}%               |
    | 验证人和委托人的奖励池 | {{ networks.moonbeam.inflation.delegator_reward_inflation }}% 的年度通货膨胀 |
    |            验证人佣金            | {{ networks.moonbeam.inflation.collator_reward_inflation }}% 的年度通货膨胀  |
    |          平行链债券储备           |  {{ networks.moonbeam.inflation.parachain_bond_inflation }}% 的年度通货膨胀  |

=== "Moonriver"
    |                 变量                  |                                         值                                          |
    |:-----------------------------------------:|:--------------------------------------------------------------------------------------:|
    |             年度通货膨胀              |               {{ networks.moonriver.inflation.total_annual_inflation }}%               |
    | 验证人和委托人的奖励池 | {{ networks.moonriver.inflation.delegator_reward_inflation }}% 的年度通货膨胀 |
    |            验证人佣金            | {{ networks.moonriver.inflation.collator_reward_inflation }}% 的年度通货膨胀  |
    |          平行链债券储备           |  {{ networks.moonriver.inflation.parachain_bond_inflation }}% 的年度通货膨胀  |

=== "Moonbase Alpha"
    |                 变量                  |                                         值                                         |
    |:-----------------------------------------:|:-------------------------------------------------------------------------------------:|
    |             年度通货膨胀              |               {{ networks.moonbase.inflation.total_annual_inflation }}%               |
    | 验证人和委托人的奖励池 | {{ networks.moonbase.inflation.delegator_reward_inflation }}% 的年度通货膨胀 |
    |            验证人佣金            | {{ networks.moonbase.inflation.collator_reward_inflation }}% 的年度通货膨胀  |
    |          平行链债券储备           |  {{ networks.moonbase.inflation.parachain_bond_inflation }}% 的年度通货膨胀  |

从奖励池中，验证人获得与其在网络中的股份相对应的奖励。其余的按股份分配给委托人。

### 奖励计算 {: #calculating-rewards }

从数学上讲，对于整理人来说，每个提议和最终确定的区块的奖励分配如下所示：

![抵押整理人奖励](/images/learn/features/staking/staking-overview-1.webp)

其中 `amount_due` 是在特定区块中分配的相应通货膨胀，`stake` 对应于整理人绑定的代币数量，相对于该整理人的总权益（包括委托）。

对于每个委托人，（由委托的整理人提议和最终确定的）每个区块的奖励分配如下所示：

![抵押委托人奖励](/images/learn/features/staking/staking-overview-2.webp)

其中 `amount_due` 是在特定区块中分配的相应通货膨胀，`stake` 对应于每个委托人绑定的代币数量，相对于该整理人的总权益。

--8<-- 'zh/text/_disclaimers/staking-risks.md'

*抵押的MOVR/GLMR代币被锁定，取回它们需要等待 {{ networks.moonriver.delegator_timings.del_bond_less.days }} 天/{{ networks.moonbeam.delegator_timings.del_bond_less.days }} 天。*

--8<-- 'zh/text/_disclaimers/staking-risks-part-2.md'
