---
title: Treasury
description: Moonbeam 拥有一个由国库委员会成员控制的链上国库，使利益相关者能够提交提案以进一步发展网络。
categories: Basics
---

# Moonbeam 上的 Treasury

## 简介 {: #introduction }

Moonbeam Treasury是在网络创世之初启动的链上资金集合。国库最初预先注资了代币供应量的0.5%，并随着{{ networks.moonbeam.inflation.parachain_bond_treasury }}%的平行链债券储备通货膨胀进入国库，国库将继续积累GLMR。有关Moonbeam通货膨胀数据的更多信息，请参见[GLMR代币经济学](https://moonbeam.foundation/glimmer-token-tokenomics/){target=_blank}。

Moonbeam Treasury为支持和发展网络的计划提供资金。利益相关者可以为国库委员会的审查提出支出要求，重点关注集成、协作、社区活动和外展等工作。国库支出提案人必须将其提案提交给[Moonbeam论坛](https://forum.moonbeam.network/c/governance/treasury-proposals/8){target=_blank}。有关提交详细信息，请参见[如何提出国库支出](/tokens/governance/treasury-spend/){target=_blank}。

[国库委员会](https://forum.moonbeam.network/g/TreasuryCouncil){target=_blank}负责监督Moonbeam Treasury的支出并对资金提案进行投票。它由Moonbeam基金会的两名成员和三名外部社区成员组成。三名外部成员的任期为{{ networks.moonbeam.treasury.months_elected }}个月。同一国库委员会负责监督Moonbeam和Moonriver的国库请求。理事会每月召开一次会议，审查在[Moonbeam论坛](https://forum.moonbeam.network/c/governance/treasury-proposals/8){target=_blank}上提交的提案。一旦提案达成一致，理事会成员必须完成链上审批流程。

## 常规定义 {: #general-definitions }

以下是关于国库的一些重要术语，需要理解：

- **国库委员会** — 由 Moonbeam 基金会代表和外部社区成员组成的小组。委员会负责审查资金提案，确保与社区保持一致，并最终授权国库支出
- **提案** — 利益相关者提交的，旨在进一步发展网络的计划或建议，需要获得国库委员会的批准

--8<-- 'text/learn/features/treasury/treasury-addresses-path.md'

## 财政委员会投票流程 {: #treasury-council-voting-process }

财政委员会的成员将提交一个 `treasury.spend` 调用。此调用需要指定金额、资产类型以及接收资金的受益人账户。财政部支持支出 GLMR 之外的各种 Token 类型，包括原生 USDT/USDC。一旦提交了此外部调用，将创建一个新的财政委员会集体提案，并提供给委员会成员进行投票。一旦通过财政委员会的内部投票流程获得批准，资金将通过 `treasury.payout` 外部调用自动释放到受益人账户。
 
!!! note
    对于财政部支出请求的提议者或受益人来说，没有链上操作。
    所有财政部支出操作将由财政委员会的成员完成。

请注意，此过程与之前的财政部流程相比发生了重大变化，之前的流程中，Token 持有者可以提交附加债券的财政部提案。现在，不需要任何链上操作即可提交财政部提案。相反，所需要的只是在 [Moonbeam 论坛](https://forum.moonbeam.network/c/governance/treasury-proposals/8){target=_blank} 上提出财政委员会请求，财政委员会将负责链上组件。

有关更多信息，请参见 [如何提出财政部支出](/tokens/governance/treasury-spend/#next-steps){target=_blank}
