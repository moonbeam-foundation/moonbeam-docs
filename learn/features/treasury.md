---
title: Treasury
description: As a Polkadot parachain, Moonbeam has an on-chain Treasury controlled by Treasury Council members, enabling stakeholders to submit proposals to further the network.
---

# Treasury on Moonbeam

## Introduction {: #introduction }

The Moonbeam Treasury is an on-chain collection of funds launched at the network's genesis. The Treasury was pre-funded with 0.5% of the total token supply at network launch and accumulates GLMR steadily as {{ networks.moonbeam.inflation.parachain_bond_Treasury }}% of the parachain bond reserve inflation goes to the Treasury. The Moonbeam Treasury is intended to help fund key projects that help maintain and further the growth of the Moonbeam network.

The Treasury enables stakeholders to propose spending initiatives for review and voting by the Treasury Council. Proposals should aim to enhance network engagement, such as funding integrations, collaborations, community events, or outreach. Treasury spend proposers must draft and submit their proposals to the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/Treasury-proposals/8){target=\_blank}. For submission details, see [submitting a Treasury spend](/tokens/governance/Treasury-spend/){target=\_blank}.

The [Treasury Council](https://forum.moonbeam.network/g/TreasuryCouncil){target=\_blank} oversees spending of the Moonbeam Treasury and votes on funding proposals. It comprises two members from the Moonbeam Foundation and three external, independent members. The three external members are elected to terms of {{ networks.moonbeam.Treasury.months_elected }} months. The same Treasury Council oversees Treasury requests for both Moonbeam and Moonriver. The Council meets periodically to review proposals submitted on the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/Treasury-proposals/8){target=\_blank}. Once a proposal is agreed upon, the Council members must complete the on-chain approval process.

## General Definitions {: #general-definitions }

Some important terminology to understand in regard to treasuries:

- **Treasury Council** — a group consisting of Moonbeam Foundation representatives and external, independent members. The Council reviews funding proposals, ensures alignment with the community, and ultimately authorizes Treasury spending
- **Proposal** — a plan or suggestion to further the network that is put forth by stakeholders to be approved by the Treasury Council

### Treasury Council Voting Process {: #Treasury-Council-voting-process }

A member of the Treasury Council must first open [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbeam.network#/explorer){target=\_blank}  and navigate to the **Extrinsics** tab. From there, the Treasury Council member will submit a `Treasury.spend` call. This call requires specifying the amount (for example, 1,000 GLMR) and the beneficiary account to receive the funds. Once this extrinsic is submitted, it creates a new Treasury Council collective proposal containing the specified spending information. Other members of the Treasury Council vote on the proposal with the `TreasuryCouncilCollective.vote` extrinsic by providing a hash to the proposal, the proposal index, and aye/nay boolean to approve. Finally, a member of the Treasury Council closes the vote with the `TreasuryCouncilCollective.close` extrinsic.
 
!!! note
    There is no on-chain action for the proposer or beneficiary of the Treasury spend request.
    All Treasury spend actions will be completed by members of the Treasury Council.

Note that this process has changed significantly from prior Treasury processes, where tokenholders could submit Treasury proposals with bonds attached. Now, no on-chain action is necessary to receive a Treasury proposal - rather, all that is needed is to raise a Treasury Council request on the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/Treasury-proposals/8){target=\_blank} and the Treasury Council will take care of the on-chain component to process a Treasury spend if the proposal is approved.

### The Happy Path of a Treasury Spend Request {: #the-happy-path-of-a-Treasury-spend-request }

The happy path of a Treasury spend request is as follows:

1. **Proposal submission** - the user submits a proposal to the [Moonbeam Forum](https://forum.moonbeam.network/c/governance/Treasury-proposals/8){target=\_blank}. 

2. **Forum discussion** - the proposal is discussed by the community on the Forum. The ultimate aye/nay decision is determined by the Treasury Council

3. **Treasury approval and action** - if the Treasury Council agrees, it authorizes the Treasury spending and moves the process forward

### After the Treasury Council Approval

The final step in the Treasury spend request flow is for the `Treasury.payout` extrinsic to be called. This may be called by anyone after the Treasury Council has approved the spend on-chain by providing the index of the Treasury spend approved.