---
title: How to Propose a Treasury Spend
description: Learn about the full life cycle of a Treasury proposal from the initial proposal on Moonbeam's Community Forum to the Treasury collective approving the spend on-chain.
---

# How to Propose a Treasury Spend

## Introduction {: #introduction }

As mentioned in the [Treasury overview page](/learn/features/governance/#definitions){target=\_blank}, the Moonbeam Treasury is an on-chain collection of funds that was launched at the genesis of the network. The Treasury was pre-funded with 0.5% of the total token supply at network launch and accumulates GLMR steadily as {{ networks.moonbeam.inflation.parachain_bond_treasury }}% of the Parachain bond reserve inflation goes to the Treasury. The Moonbeam Treasury is intended to help fund key projects that help maintain and further the growth of the Moonbeam network.

The Treasury Council oversees spending of the Moonbeam treasury and votes on funding proposals. It comprises two members from the Moonbeam Foundation and three external, independent members. The same treasury council oversees treasury requests for both Moonbeam and Moonriver. The Council meets periodically to review proposals submitted on the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/treasury-proposals/8){target=\_blank}. Once a proposal is agreed upon, the Council members must complete the on-chain approval process. 

## Definitions {: #definitions }

Some of the key parameters for this guide are the following:

 - **Treasury address** — the address where Treasury funds accrue and are disbursed from
 - **Beneficiary** — the address, such as a [Moonbeam Safe multisig](/tokens/manage/multisig-safe/){target=\_blank}, that will receive the funds of the Treasury proposal if enacted
 - **Value** — the amount that is being asked for and will be allocated to the beneficiary address if the Treasury proposal is passed

The treasury address for each respective network can be found below:

=== "Moonbeam"

    [0x6d6F646c70632f74727372790000000000000000](https://moonbase.subscan.io/account/0x6d6F646c70632f74727372790000000000000000){target=_blank}

=== "Moonriver"

    [0x6d6f646C70792f74727372790000000000000000](https://moonriver.subscan.io/account/0x6d6f646C70792f74727372790000000000000000){target=_blank}

=== "Moonbase Alpha"

    [0x6d6F646c70632f74727372790000000000000000](https://moonbase.subscan.io/account/0x6d6F646c70632f74727372790000000000000000){target=_blank}


## Roadmap of a Treasury Proposal {: #roadmap-of-a-treasury-proposal }

The happy path of a treasury spend request is as follows:

1. **Proposal Submission** - The user submits a proposal to the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/treasury-proposals/8){target=\_blank}

2. **Forum Discussion** - The proposal is discussed by the community on the Forum. The ultimate yay/nay decision is determined by the treasury council

3. **Treasury Approval & Action** - If the Treasury Council agrees, it authorizes the treasury spending and moves the process forward

![Moonbeam Forum Home](/images/tokens/governance/treasury-proposals/treasury-proposal-1.webp)

## Submitting your Idea to the Forum {: #submitting-your-idea-to-the-forum }

As mentioned in the happy path above, the first step of a treasury proposal is to submit the proposal to the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/treasury-proposals/8){target=\_blank}. To properly submit a treasury spend request, take the following steps:

1. From the [governance section](https://forum.moonbeam.network/c/governance/treasury-proposals/8){target=\_blank}, click **New Topic**. By starting the topic in the governance section, the proposal will come pre-filled with a template to ensure you cover all the necessary points 
2. Provide a title for the proposal
3. Enter the contents of the proposal, making sure to cover each of the following categories:

    - **Title** and **Proposal Status** 

    - **Abstract** - two or three sentences that summarize the MBTP

    - **Motivation** - a statement on why the Moonbeam Community via the Treasury Council should support the MBTP

    - **Project Overview and Team Experience** - description of project and relevant team experience

    - **Rationale** - an explanation of how the MBTP would add value to the Moonbeam Ecosystem

    - **Key Terms *(optional)*** - definitions of any terms within the proposal that are unique to the MBTP

    - **Overall Cost** - the total cost of the MBTP and how this cost ties to the deliverables or milestones

    - **Use of Treasury Funds** - detailed explanation of use of Treasury Funds including deliverables/ milestones and timeline

    - **Specifications** - a detailed breakdown of the platforms and technologies that will be used

    - **Steps to Implement** - the steps to implement the MBTP, including associated costs, manpower, and other resources for each step where applicable

4. Press **Create Topic**

![Submit a treasury spend proposal](/images/tokens/governance/treasury-proposals/treasury-proposal-2.webp)


### Treasury Council Voting Process {: #treasury-council-voting-process }

A member of the Treasury Council must first open [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbeam.network#/explorer){target=\_blank}  and navigate to the **Extrinsics** tab. From there, the treasury council member will submit a `treasury.spend` call. This call requires specifying the amount (for example, 1,000 GLMR) and the beneficiary account to receive the funds. Once this extrinsic is submitted, it creates a new Treasury Council collective proposal containing the specified spending information. Other members of the treasury council vote on the proposal with the `treasuryCouncilCollective.vote` extrinsic by providing a hash to the proposal, the proposal index, and aye/nay boolean to approve. Finally, a member of the treasury council closes the vote with the `treasuryCouncilCollective.close` extrinsic.
 
!!! note
    There is no on-chain action for the proposer or beneficiary of the treasury spend request.
    All treasury spend actions will be completed by members of the treasury council.

Note that this process has changed significantly from prior treasury processes, where tokenholders could submit treasury proposals with bonds attached. Now, no on-chain action is necessary to receive a treasury proposal - rather, all that is needed is to raise a treasury council request on the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/treasury-proposals/8){target=\_blank} and the treasury council will take care of the on-chain component to process a treasury spend if the proposal is approved.

## After the Treasury Council Approval

The final step in the treasury spend request flow is for the `treasury.payout` extrinsic to be called. This may be called by anyone after the treasury council has approved the spend on-chain by providing the index of the treasury spend approved. Most likely, this step will be completed by a member of the treasury council, however, this step is documented here as it is one of the only steps that can be completed by anyone. 

To do so, open [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbeam.network#/explorer){target=\_blank} and navigate to the **Extrinsics** tab and take the following steps:

1. Select the **treasury** pallet
2. Select the **payout** extrinsic
3. Specify the index of the treasury collective spend
4. Press **Submit Transaction** and confirm the transaction in your wallet

![Call treasury.payout](/images/tokens/governance/treasury-proposals/treasury-proposal-3.webp)
