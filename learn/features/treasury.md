---
title: Treasury
description: Moonbeam has an on-chain Treasury controlled by Treasury Council members, enabling stakeholders to submit proposals to further the network.
categories: Basics
---

# Treasury on Moonbeam

## Introduction {: #introduction }

The Moonbeam Treasury is an on-chain collection of funds launched at the network's genesis. Initially pre-funded with 0.5% of the token supply, the Treasury continues to accumulate GLMR as {{ networks.moonbeam.inflation.parachain_bond_treasury }}% of the parachain bond reserve inflation goes to the Treasury. For more information about Moonbeam inflation figures, see [GLMR Tokenomics](https://moonbeam.foundation/glimmer-token-tokenomics/){target=\_blank}.

The Moonbeam Treasury funds initiatives that support and grow the network. Stakeholders can propose spending requests for Treasury Council review, focusing on efforts like integrations, collaborations, community events, and outreach. Treasury spend proposers must submit their proposals to the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/treasury-proposals/8){target=\_blank}. For submission details, see [How to Propose a Treasury Spend](/tokens/governance/treasury-spend/){target=\_blank}.

The [Treasury Council](https://forum.moonbeam.network/g/TreasuryCouncil){target=\_blank} oversees the spending of the Moonbeam Treasury and votes on funding proposals. It comprises two members from the Moonbeam Foundation and three external community members. The three external members are elected to terms of {{ networks.moonbeam.treasury.months_elected }} months. The same Treasury Council oversees Treasury requests for both Moonbeam and Moonriver. The Council meets monthly to review proposals submitted on the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/treasury-proposals/8){target=\_blank}. Once a proposal is agreed upon, the Council members must complete the on-chain approval process.

## General Definitions {: #general-definitions }

Some important terminology to understand regarding treasuries:

- **Treasury Council** — a group of Moonbeam Foundation representatives and external community members. The Council reviews funding proposals, ensures alignment with the community, and ultimately authorizes Treasury spending
- **Proposal** — a plan or suggestion submitted by stakeholders to further the network to be approved by the Treasury Council

--8<-- 'text/learn/features/treasury/treasury-addresses-path.md'

## Treasury Council Voting Process {: #treasury-council-voting-process }

A member of the Treasury Council will submit a `treasury.spend` call. This call requires specifying the amount, the asset type, and the beneficiary account to receive the funds. The Treasury supports spending various token types beyond GLMR, including native USDT/USDC. Once this extrinsic is submitted, a new Treasury Council collective proposal will be created and made available for council members to vote on. Once approved through the Treasury Council's internal voting process, the funds will be released automatically to the beneficiary account through the `treasury.payout` extrinsic.
 
!!! note
    There is no on-chain action for the proposer or beneficiary of the Treasury spend request.
    All Treasury spend actions will be completed by members of the Treasury Council.

Note that this process has changed significantly from prior Treasury processes, where tokenholders could submit Treasury proposals with bonds attached. Now, no on-chain action is necessary to submit a Treasury proposal. Rather, all that is needed is to raise a Treasury Council request on the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/treasury-proposals/8){target=\_blank} and the Treasury Council will take care of the on-chain components. 

For more information, see [How to Propose a Treasury Spend](/tokens/governance/treasury-spend/#next-steps){target=\_blank}