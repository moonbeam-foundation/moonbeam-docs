---
title: How to Propose a Treasury Spend
description: Learn about the full life cycle of a Treasury proposal from the initial proposal on Moonbeam's Community Forum to the Treasury collective approving the spend on-chain.
---

# How to Propose a Treasury Spend

## Introduction {: #introduction }

As mentioned in the [Treasury overview page](/learn/features/Treasury/){target=\_blank}, the Moonbeam Treasury is an on-chain collection of funds that was launched at the genesis of the network. The Treasury was pre-funded with 0.5% of the total token supply at network launch and accumulates GLMR steadily as {{ networks.moonbeam.inflation.parachain_bond_Treasury }}% of the Parachain bond reserve inflation goes to the Treasury. The Moonbeam Treasury is intended to help fund key projects that help maintain and further the growth of the Moonbeam network.

The [Treasury Council](https://forum.moonbeam.network/g/TreasuryCouncil){target=\_blank} oversees spending of the Moonbeam Treasury and votes on funding proposals. It comprises two members from the Moonbeam Foundation and three external, independent members. The same Treasury council oversees Treasury requests for both Moonbeam and Moonriver. The Council meets periodically to review proposals submitted on the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/Treasury-proposals/8){target=\_blank}. Once a proposal is agreed upon, the Council members must complete the on-chain approval process. 

## Definitions {: #definitions }

Some of the key parameters for this guide are the following:

 - **Treasury address** — the address where Treasury funds accrue and are disbursed from
 - **Beneficiary** — the address, such as a [Moonbeam Safe multisig](/tokens/manage/multisig-safe/){target=\_blank}, that will receive the funds of the Treasury proposal if enacted
 - **Value** — the amount that is being asked for and will be allocated to the beneficiary address if the Treasury proposal is passed

The Treasury address for each respective network can be found below:

=== "Moonbeam"

    [0x6d6F646c70632f74727372790000000000000000](https://moonbase.subscan.io/account/0x6d6F646c70632f74727372790000000000000000){target=_blank}

=== "Moonriver"

    [0x6d6f646C70792f74727372790000000000000000](https://moonriver.subscan.io/account/0x6d6f646C70792f74727372790000000000000000){target=_blank}

=== "Moonbase Alpha"

    [0x6d6F646c70632f74727372790000000000000000](https://moonbase.subscan.io/account/0x6d6F646c70632f74727372790000000000000000){target=_blank}


## Roadmap of a Treasury Proposal {: #roadmap-of-a-Treasury-proposal }

The happy path of a Treasury spend request is as follows:

1. **Proposal Submission** - The user submits a proposal to the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/Treasury-proposals/8){target=\_blank}

2. **Forum Discussion** - The proposal is discussed by the community on the Forum. The ultimate yay/nay decision is determined by the Treasury council

3. **Treasury Approval & Action** - If the Treasury Council agrees, it authorizes the Treasury spending and moves the process forward

![Moonbeam Forum Home](/images/tokens/governance/Treasury-proposals/Treasury-proposal-1.webp)

## Submitting Your Idea to the Forum {: #submitting-your-idea-to-the-forum }

!!! note
    You'll need to have an account on the [Moonbeam Forum](https://forum.moonbeam.network/){target=\_blank} and be logged in before submitting a Treasury spend proposal.

As mentioned in the happy path above, the first step of a Treasury proposal is to submit the proposal to the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/Treasury-proposals/8){target=\_blank}. To properly submit a Treasury spend request, take the following steps:

1. From the [governance section](https://forum.moonbeam.network/c/governance/Treasury-proposals/8){target=\_blank}, click **New Topic**. By starting the topic in the governance section, the proposal will come pre-filled with a template to ensure you cover all the necessary points 
2. Provide a title for the proposal
3. Enter the contents of the proposal, covering: the Title and Proposal Status, a brief Abstract, the Motivation, a Project Overview with Team Experience, the Rationale, any Key Terms, the Overall Cost, the Use of Treasury Funds, the technical Specifications, and the Steps to Implement
4. Press **Create Topic**

![Submit a Treasury spend proposal](/images/tokens/governance/Treasury-proposals/Treasury-proposal-2.webp)


### Treasury Council Voting Process {: #Treasury-council-voting-process }

A member of the Treasury Council will submit a `treasury.spend` call. This call requires specifying the amount, the asset type, and the beneficiary account to receive the funds. The Treasury supports spending various token types beyond GLMR, including native USDT/USDC. Once this extrinsic is submitted, it creates a new Treasury Council collective proposal containing the specified spending information, and is available for members of the council to vote on. Once approved through the Treasury Council's internal voting process, the funds can be released to the beneficiary account through the `treasury.payout` extrinsic.

!!! note
    There is no on-chain action for the proposer or beneficiary of the Treasury spend request.
    All Treasury spend actions will be completed by members of the Treasury council.

Note that this process has changed significantly from prior Treasury processes, where tokenholders could submit Treasury proposals with bonds attached. Now, no on-chain action is necessary to receive a Treasury proposal - rather, all that is needed is to raise a Treasury council request on the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/Treasury-proposals/8){target=\_blank} and the Treasury council will take care of the on-chain component to process a Treasury spend if the proposal is approved.

## After the Treasury Council Approval

The final step in the Treasury spend request flow is for the `treasury.payout` extrinsic to be called. This may be called by anyone after the Treasury council has approved the spend on-chain by providing the index of the Treasury spend approved. Most likely, this step will be completed by a member of the Treasury council, however, this step is documented here as it is one of the only steps that anyone can complete. 

To do so, open [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbeam.network#/explorer){target=\_blank} and navigate to the **Extrinsics** tab and take the following steps:

1. Select the **Treasury** pallet
2. Select the **payout** extrinsic
3. Specify the index of the Treasury collective spend
4. Press **Submit Transaction** and confirm the transaction in your wallet

![Call Treasury.payout](/images/tokens/governance/Treasury-proposals/Treasury-proposal-3.webp)
