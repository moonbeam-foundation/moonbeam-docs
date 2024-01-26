---
title: How to Propose a Treasury Spend
description: Learn about the full life cycle of a Treasury proposal from the initial proposal on Moonbeam's Community Forum to submitting the Treasury spend on-chain.
---

# How to Propose a Treasury Spend

## Introduction {: #introduction }

As mentioned in the [Treasury overview page](/learn/features/governance/#definitions){target=\_blank}, the Moonbeam Treasury is an on-chain collection of funds that was launched at the genesis of the network. The Treasury was pre-funded with 0.5% of the total token supply at network launch and has been steadily accumulating GLMR from a portion of transaction fees (approx. {{ networks.moonbeam.treasury.tx_fees_allocated }}% of transaction fees go to the Treasury). The Moonbeam Treasury is intended to help fund key projects that help maintain and further the growth of the Moonbeam network.

Moonbeam has adopted an interim [community Treasury program](https://moonbeam.foundation/news/proposal-treasury-program-approved/){target=\_blank}, which established a Treasury Council comprised of two Moonbeam foundation members and three non-foundation members. The Treasury Council facilitates community discussions on spending ideas and votes on spending proposals. The community Treasury program kicked off in October of 2022 with an initial duration of six months. At the end of the six-month period the program will be evaluated and considered alongside relevant [Gov2](https://moonbeam.network/blog/opengov/){target=\_blank} changes. If initial budgeting parameters are maintained, the on-chain Treasury has sufficient funds to operate for a period of not less than four years.

It is extremely important that you understand the [process of the community Treasury program](https://github.com/moonbeam-foundation/treasury/blob/main/interim/interim_treasury_proposal.md){target=\_blank} prior to initiating an on-chain Treasury proposal. The outlined process allows for revisions based on feedback provided by the Treasury Council. Thoughtful iteration based on feedback from the Treasury Council can improve the chances of your Treasury spend proposal successfully passing.

Creating a Treasury proposal differs from proposing other types of governance actions. This guide outlines the process of how to create a Treasury proposal. There is a separate guide on [How to Propose an Action](/tokens/governance/proposals/){target=\_blank} which discusses proposing governance actions unrelated to the Treasury.

!!! note
    Proposing a Treasury spend is not a riskless action. Bonds may be locked for an indefinite period of time and the entirety of your bond is forfeited if your proposal is rejected. You should carefully consider these ramifications and proceed with raising a Treasury spend proposal only at the advice of the Treasury Council.

## Definitions {: #definitions }

Some of the key parameters for this guide are the following:

 - **Proposal Bond** — the percentage of proposed Treasury spend amount required to be submitted at the origination of the proposal. These tokens might be locked for an indeterminate amount of time because there is no guarantee the proposal will be acted upon. This bond is transferred to the Treasury if the proposal is rejected but refunded if the proposal is passed
 - **Minimum Bond** — the minimum bond accepted with a proposed Treasury spend regardless of the amount of the Treasury spend. This minimum bond amount may render small Treasury proposal amounts infeasible
 - **Treasury address** — the address where Treasury funds accrue and are disbursed from
 - **Beneficiary** — the address, such as a [Moonbeam Safe multisig](/tokens/manage/multisig-safe/){target=\_blank}, that will receive the funds of the Treasury proposal if enacted
 - **Value** — the amount that is being asked for and will be allocated to the beneficiary address if the Treasury proposal is enacted
 - **Spend period** — the waiting period after a Treasury proposal has been approved, but before the funds have been disbursed to the beneficiary

=== "Moonbeam"
    |     Variable     |                                                                    Value                                                                    |
    |:----------------:|:-------------------------------------------------------------------------------------------------------------------------------------------:|
    |  Proposal Bond   |                                      {{ networks.moonbeam.treasury.proposal_bond}}% of proposed spend                                       |
    |   Minimum Bond   |                                           {{ networks.moonbeam.treasury.proposal_bond_min}} GLMR                                            |
    |   Spend Period   |                                           {{ networks.moonbeam.treasury.spend_period_days}} days                                            |
    | Treasury Address | [0x6d6f646C70792f74727372790000000000000000](https://moonbeam.subscan.io/account/0x6d6f646C70792f74727372790000000000000000){target=\_blank} |

=== "Moonriver"
    |     Variable     |                                                                    Value                                                                     |
    |:----------------:|:--------------------------------------------------------------------------------------------------------------------------------------------:|
    |  Proposal Bond   |                                      {{ networks.moonriver.treasury.proposal_bond}}% of proposed spend                                       |
    |   Minimum Bond   |                                           {{ networks.moonriver.treasury.proposal_bond_min}} MOVR                                            |
    |   Spend Period   |                                           {{ networks.moonriver.treasury.spend_period_days}} days                                            |
    | Treasury Address | [0x6d6f646C70792f74727372790000000000000000](https://moonriver.subscan.io/account/0x6d6f646C70792f74727372790000000000000000){target=\_blank} |

=== "Moonbase Alpha"
    |     Variable     |                                                                    Value                                                                    |
    |:----------------:|:-------------------------------------------------------------------------------------------------------------------------------------------:|
    |  Proposal Bond   |                                      {{ networks.moonbase.treasury.proposal_bond}}% of proposed spend                                       |
    |   Minimum Bond   |                                            {{ networks.moonbase.treasury.proposal_bond_min}} DEV                                            |
    |   Spend Period   |                                           {{ networks.moonbase.treasury.spend_period_days}} days                                            |
    | Treasury Address | [0x6d6f646C70792f74727372790000000000000000](https://moonbase.subscan.io/account/0x6d6F646c70632f74727372790000000000000000){target=\_blank} |


This guide will show you how to submit a proposal on Moonbase Alpha. It can be adapted for Moonbeam or Moonriver. In any case, it's recommended that you familiarize yourself with the steps of submitting a Treasury proposal on Moonbase Alpha or a local dev node before taking the steps on Moonbeam or Moonriver.

## Roadmap of a Treasury Proposal {: #roadmap-of-a-treasury-proposal }

You can find a full explanation of the [happy path for a Treasury proposal on the Treasury overview page](/learn/features/treasury/){target=\_blank}. For more information on the process, see this [guide to the interim community Treasury program](https://moonbeam.foundation/news/proposal-treasury-program-approved/){target=\_blank}.

![Proposal Roadmap](/images/tokens/governance/treasury-proposals/treasury-proposal-roadmap.webp)

## Submitting your Idea to the Forum {: #submitting-your-idea-to-the-forum }

It's highly recommended that you preface any proposal with a post on [Moonbeam's Community Forum](https://forum.moonbeam.foundation/){target=\_blank}. You should allow a period of five days for the community to provide feedback on the Moonbeam Forum post. This is especially important for Treasury proposals because of the irrevocable bond required to submit a Treasury spend proposal. You can submit your idea for a Treasury spend proposal by following [the instructions in the Using the Moonbeam Community Forum to Submit a Treasury Proposal guide](https://moonbeam.network/blog/using-moonbeam-community-forum/){target=\_blank}.

![Moonbeam Forum Home](/images/tokens/governance/treasury-proposals/treasury-proposal-1.webp)

## Proposing an Action {: #proposing-an-action }

This guide focuses on the mechanics of submitting an on-chain Treasury proposal after you have worked with the Treasury Council to refine your idea. If you haven't yet completed the prior steps of the Treasury proposal process, please take a moment to review the [guidelines of the community Treasury program](https://github.com/moonbeam-foundation/treasury/blob/main/interim/interim_treasury_proposal.md){target=\_blank} and evaluate your standing. Engaging the community and revising your proposal based on feedback received is the most critical piece of your proposal. Submitting the on-chain Treasury proposal is the easy part, demonstrated in the following guide.

To get started, head to [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/treasury){target=\_blank} and take the following steps:

1. Select the **Governance** heading
2. Click on **Treasury**
3. Click **Submit Proposal**

![Treasury home](/images/tokens/governance/treasury-proposals/treasury-proposal-2.webp)

Then, take the following steps:

1. Select the account that will be the creator of the Treasury proposal. Make sure that the account selected here is sufficiently funded with your proposal bond
2. Select the beneficiary of the proposal. This should correspond to the account indicated in your forum post
3. Indicate the value of the spend proposal. The required bond is {{ networks.moonbeam.treasury.proposal_bond}}% of the proposal's value. The bond committed to a Treasury spend proposal is irrevocable
4. Review each field for accuracy then press **Submit proposal** and sign the transaction

![Submitting a Treasury spend proposal](/images/tokens/governance/treasury-proposals/treasury-proposal-3.webp)

After submitting your Treasury proposal, you can refresh Polkadot.js Apps and you should see your proposal listed. If you don't see your proposal appear here, your account may not have contained sufficient funds for the required bond.

If you login to [Polkassembly](https://moonbeam.polkassembly.io/opengov){target=\_blank} with the same account that you used to create the Treasury spend proposal, you'll be able to edit the description of the proposal to include a link to the proposal discussion on the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=\_blank}. This is a helpful step because while Polkassembly auto-generates a post for each proposal, it doesn't provide context information on the contents of the proposal.

After submitting the on-chain proposal, you’ll need to edit your proposal on the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=\_blank}. You will need to update the title to include the proposal ID, and the status will need to be changed to `Submitted` state. The full instructions to edit your Moonbeam Community Forum post are available on [this guide to using the Moonbeam Community Forum](https://moonbeam.network/blog/using-moonbeam-community-forum/){target=\_blank}.

![Polkassembly](/images/tokens/governance/treasury-proposals/treasury-proposal-4.webp)
