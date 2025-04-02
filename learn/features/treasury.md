---
title: Treasury
description: As a Polkadot parachain, Moonbeam has an on-chain treasury controlled by treasury council members, enabling stakeholders to submit proposals to further the network.
---

# Treasury on Moonbeam

## Introduction {: #introduction }

The Moonbeam Treasury is an on-chain collection of funds launched at the network's genesis. The Treasury was pre-funded with 0.5% of the total token supply at network launch and accumulates GLMR steadily as {{ networks.moonbeam.inflation.parachain_bond_treasury }}% of the parachain bond reserve inflation goes to the Treasury. The Moonbeam Treasury is intended to help fund key projects that help maintain and further the growth of the Moonbeam network.

The Treasury enables stakeholders to propose spending initiatives for review and voting by the Treasury Council. Proposals should aim to enhance network engagement, such as funding integrations, collaborations, community events, or outreach. Treasury spend proposers must draft and submit their proposals to the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/treasury-proposals/8){target=\_blank}. For submission details, see [submitting a treasury spend](/tokens/governance/treasury-spend/){target=\_blank}.

The [Treasury Council](https://forum.moonbeam.network/g/TreasuryCouncil){target=\_blank} oversees spending of the Moonbeam treasury and votes on funding proposals. It comprises two members from the Moonbeam Foundation and three external, independent members. The three external members are elected to terms of {{ networks.moonbeam.treasury.months_elected }} months. The same treasury council oversees treasury requests for both Moonbeam and Moonriver. The Council meets periodically to review proposals submitted on the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/treasury-proposals/8){target=\_blank}. Once a proposal is agreed upon, the Council members must complete the on-chain approval process.

## General Definitions {: #general-definitions }

Some important terminology to understand in regard to treasuries:

- **Treasury Council** — a group consisting of Moonbeam Foundation representatives and external, independent members. The Council reviews funding proposals, ensures alignment with the community, and ultimately authorizes treasury spending
- **Proposal** — a plan or suggestion to further the network that is put forth by stakeholders to be approved by the Treasury Council

### Treasury Council Voting Process {: #treasury-council-voting-process }

A member of the Treasury Council must first open [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbeam.network#/explorer){target=\_blank}  and navigate to the **Extrinsics** tab. From there, the treasury council member will submit a `treasury.spend` call. This call requires specifying the amount (for example, 1,000 GLMR) and the beneficiary account to receive the funds. Once this extrinsic is submitted, it creates a new Treasury Council collective proposal containing the specified spending information. Other members of the treasury council vote on the proposal with the `treasuryCouncilCollective.vote` extrinsic by providing a hash to the proposal, the proposal index, and aye/nay boolean to approve. Finally, a member of the treasury council closes the vote with the `treasuryCouncilCollective.close` extrinsic.
 
!!! note
    There is no on-chain action for the proposer or beneficiary of the treasury spend request.
    All treasury spend actions will be completed by members of the treasury council.

Note that this process has changed significantly from prior treasury processes, where tokenholders could submit treasury proposals with bonds attached. Now, no on-chain action is necessary to receive a treasury proposal - rather, all that is needed is to raise a treasury council request on the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/treasury-proposals/8){target=\_blank} and the treasury council will take care of the on-chain component to process a treasury spend if the proposal is approved.

### The Happy Path of a Treasury Spend Request {: #the-happy-path-of-a-treasury-spend-request }

The happy path of a treasury spend request is as follows:

1. **Proposal submission** - the user submits a proposal to the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/treasury-proposals/8){target=\_blank}

2. **Forum discussion** - the proposal is discussed by the community on the Forum. The ultimate aye/nay decision is determined by the treasury council

3. **Treasury approval and action** - if the Treasury Council agrees, it authorizes the treasury spending and moves the process forward

### After the Treasury Council Approval

The final step in the treasury spend request flow is for the `treasury.payout` extrinsic to be called. This may be called by anyone after the treasury council has approved the spend on-chain by providing the index of the treasury spend approved. For more information on submitting a treasury spend proposal, see the instructions for [submitting a treasury spend](/tokens/governance/treasury-spend/){target=\_blank}.