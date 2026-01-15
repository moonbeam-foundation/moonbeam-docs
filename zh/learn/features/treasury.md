---
title: Treasury
description: Moonbeam 拥有一个链上金库，由金库委员会成员控制，使利益相关者能够提交提案以进一步发展网络。
categories: Basics
---

# Moonbeam 上的金库

## 简介 {: #introduction }

Moonbeam Treasury 是一个在网络初始阶段启动的链上资金集合地。国库最初预先注资了 0.5% 的代币供应量，并且随着 {{ networks.moonbeam.inflation.parachain_bond_treasury }}% 的平行链债券储备通胀进入国库，国库也会继续积累 GLMR。有关 Moonbeam 通货膨胀数据的更多信息，请参见 [GLMR 代币经济学](https://moonbeam.foundation/glimmer-token-tokenomics/){target=_blank}。

Moonbeam Treasury 资助支持和发展网络的倡议。利益相关者可以为国库委员会的审查提出支出申请，重点关注集成、协作、社区活动和推广等工作。国库支出提案人必须将其提案提交至 [Moonbeam 论坛](https://forum.moonbeam.network/c/governance/treasury-proposals/8){target=_blank}。有关提交的详细信息，请参见 [如何提议国库支出](/tokens/governance/treasury-spend/){target=_blank}。

[国库委员会](https://forum.moonbeam.network/g/TreasuryCouncil){target=_blank} 负责监督 Moonbeam 国库的支出，并对资助提案进行投票。它由来自 Moonbeam 基金会的两名成员和三名外部社区成员组成。三名外部成员的任期为 {{ networks.moonbeam.treasury.months_elected }} 个月。同一个国库委员会负责监督 Moonbeam 和 Moonriver 的国库请求。委员会每月举行一次会议，审查在 [Moonbeam 论坛](https://forum.moonbeam.network/c/governance/treasury-proposals/8){target=_blank} 上提交的提案。一旦提案达成一致，委员会成员必须完成链上批准流程。

## 通用定义 {: #general-definitions }

以下是关于国库的一些重要术语，需要理解：

- **国库委员会** — 由 Moonbeam 基金会代表和外部社区成员组成的小组。委员会负责审查资金提案，确保与社区保持一致，并最终授权国库支出。
- **提案** — 利益相关者提交的，旨在进一步发展网络的计划或建议，需经国库委员会批准。

--8<-- 'text/learn/features/treasury/treasury-addresses-path.md'

## 财政委员会投票流程 {: #treasury-council-voting-process }

财政委员会的成员将提交 `treasury.spend` 调用。此调用需要指定金额、资产类型以及接收资金的受益人账户。财政部支持支出 GLMR 之外的各种代币类型，包括原生 USDT/USDC。一旦提交此外部调用，将创建一个新的财政委员会集体提案，并供委员会成员投票。一旦通过财政委员会的内部投票流程获得批准，资金将通过 `treasury.payout` 外部调用自动释放到受益人账户。
 
!!! note
    财政支出请求的提案人或受益人无需执行链上操作。
    所有财政支出操作将由财政委员会成员完成。

请注意，此过程与之前的财政流程相比发生了重大变化，之前的流程中，代币持有人可以提交附带债券的财政提案。现在，提交财政提案无需执行链上操作。而是只需在 [Moonbeam 论坛](https://forum.moonbeam.network/c/governance/treasury-proposals/8){target=_blank} 上提出财政委员会请求，财政委员会将负责处理链上组件。

有关更多信息，请参阅 [如何提议财政支出](/tokens/governance/treasury-spend/#next-steps){target=_blank}
