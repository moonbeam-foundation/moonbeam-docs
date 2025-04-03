---
title: How to Propose a Treasury Spend
description: Learn about the full life cycle of a Treasury proposal from the initial proposal on Moonbeam's Community Forum to Council approval of the on-chain spend.
---

# How to Propose a Treasury Spend

## Introduction {: #introduction }

Treasury spending proposals enable community members to request funding for projects that benefit the Moonbeam network, such as infrastructure improvements, resources, events, and ecosystem tools. The Treasury Council reviews proposals and weighs community feedback received in the Moonbeam Forum, however, ultimate aye/nay decision rests with the Council. For more information about the structure of the Treasury Council, see the [Treasury page](/learn/features/treasury/){target=\_blank}.

In this guide, you'll learn how to prepare and submit a Treasury spending proposal and understand the full lifecycle of a Treasury Proposal. 

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

1. **Proposal submission** - the user submits a proposal to the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/Treasury-proposals/8){target=\_blank}

2. **Forum discussion** - the proposal is discussed by the community on the Forum. The ultimate yay/nay decision is determined by the Treasury council

3. **Treasury approval & action** - if the Treasury Council agrees, it authorizes the Treasury spending and moves the process forward

![Moonbeam Forum Home](/images/tokens/governance/treasury-proposals/treasury-proposal-1.webp)

## Submitting Your Idea to the Forum {: #submitting-your-idea-to-the-forum }

!!! note
    You'll need to have an account on the [Moonbeam Forum](https://forum.moonbeam.network/){target=\_blank} and be logged in before submitting a Treasury spend proposal.

As mentioned in the happy path above, the first step of a Treasury proposal is to submit the proposal to the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/Treasury-proposals/8){target=\_blank}. To properly submit a Treasury spend request, take the following steps:

1. From the [**Governance** section](https://forum.moonbeam.network/c/governance/Treasury-proposals/8){target=\_blank}, click **New Topic**. By starting the topic in the **Governance** section, the proposal will come pre-filled with a template to ensure you cover all the necessary points 
2. Provide a title for the proposal
3. Enter the contents of the proposal, covering: the Title and Proposal Status, a brief Abstract, the Motivation, a Project Overview with Team Experience, the Rationale, any Key Terms, the Overall Cost, the Use of Treasury Funds, the technical Specifications, and the Steps to Implement
4. Press **Create Topic**

![Submit a Treasury spend proposal](/images/tokens/governance/Treasury-proposals/Treasury-proposal-2.webp)

## Next Steps {: #next-steps }

No further steps are required by the proposer. Members of the Treasury Council will complete all on-chain actions. For more information about the Treasury Council voting process, see the [Treasury page](/learn/features/treasury/#Treasury-council-voting-process){target=\_blank}. The final step in the Treasury spend request flow is for the `treasury.payout` extrinsic to be called. This may be called by anyone after the Treasury council has approved the spend on-chain by providing the index of the Treasury spend approved. Most likely, this step will be completed by a member of the Treasury council, however, this step is documented here as it is one of the only steps that anyone can complete. 

To do so, open [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbeam.network#/explorer){target=\_blank} and navigate to the **Extrinsics** tab and take the following steps:

1. Select the **Treasury** pallet
2. Select the **payout** extrinsic
3. Specify the index of the Treasury collective spend
4. Press **Submit Transaction** and confirm the transaction in your wallet

![Call Treasury.payout](/images/tokens/governance/Treasury-proposals/Treasury-proposal-3.webp)
