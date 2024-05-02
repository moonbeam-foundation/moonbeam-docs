---
title: Treasury
description: As a Polkadot parachain, Moonbeam has an on-chain treasury controlled by council members, enabling stakeholders to submit proposals to further the network.
---

# Treasury on Moonbeam

## Introduction {: #introduction }

A Treasury is an on-chain managed collection of funds. Each Moonbeam-based network has a community Treasury for supporting network initiatives to further the network, funded by a percentage of transaction fees of the network it is on and managed by the Council.

As of October 19th, 2022 a community submitted referendum for an Interim Treasury Program was passed by the community. This 6-month program establishes a separate community Treasury Council to manage Treasury funds, a budget for Treasury spending, and a required discussion time to gather community feedback on possible future Treasury proposals.

## General Definitions {: #general-definitions }

Some important terminology to understand in regards to treasuries:

- **Treasury council** — a collective of community appointed individuals that control how Treasury funds will be spent with the community approved budget
- **Proposal** — a plan or suggestion to further the network that is put forth by stakeholders to be approved by the Treasury Council
- **Proposal bond** — a deposit equal to a percentage of the total proposal spend amount, as long as it meets the proposal bond minimum, otherwise the deposit is equal to the minimum
- **Proposal bond minimum** — minimum amount for a proposal bond. This is the lower limit of the bond for a Treasury proposal
- **Proposal bond maximum** — maximum amount (cap) for a proposal bond. **Proposal bonds are currently uncapped in all Moonbeam-based networks**
- **Motion duration** - the maximum amount of time, in blocks, for Treasury Council members to vote on motions. Motions may end in fewer blocks if enough votes are cast to determine the result
- **Spend period** — the amount of days, in blocks, during which the Treasury funds as many proposals as possible without exceeding the maximum
- **Maximum approved proposals** — the maximum amount of proposals that can wait in the spending queue

=== "Moonbeam"
    |                      Variable                      |                                                            Value                                                            |
    |:--------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------:|
    |          Current Treasury Council members          |                              {{ networks.moonbeam.treasury.current_council_members }} members                               |
    |                   Proposal bond                    |             {{ networks.moonbeam.treasury.proposal_bond }}% of the proposed spend or the proposal bond minimum              |
    |               Proposal bond minimum                |                                   {{ networks.moonbeam.treasury.proposal_bond_min }} GLMR                                   |
    |               Proposal bond maximum                |                                     {{ networks.moonbeam.treasury.proposal_bond_max }}                                      |
    |                  Motion duration                   | {{ networks.moonbeam.treasury.motion_duration_blocks }} blocks ({{ networks.moonbeam.treasury.motion_duration_days }} days) |
    |                    Spend period                    |    {{ networks.moonbeam.treasury.spend_period_blocks }} blocks ({{ networks.moonbeam.treasury.spend_period_days}} days)     |
    |             Maximum approved proposals             |                                   {{ networks.moonbeam.treasury.max_approved_proposals }}                                   |
    | Target % of transaction fees allocated to Treasury |                                     {{ networks.moonbeam.treasury.tx_fees_allocated }}                                      |

=== "Moonriver"
    |                      Variable                      |                                                             Value                                                             |
    |:--------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------:|
    |          Current Treasury Council members          |                               {{ networks.moonriver.treasury.current_council_members }} members                               |
    |                   Proposal bond                    |                 the minimim amount or {{ networks.moonriver.treasury.proposal_bond }}% of the proposed spend                  |
    |               Proposal bond minimum                |                                   {{ networks.moonriver.treasury.proposal_bond_min }} MOVR                                    |
    |               Proposal bond maximum                |                                      {{ networks.moonriver.treasury.proposal_bond_max }}                                      |
    |                  Motion duration                   | {{ networks.moonriver.treasury.motion_duration_blocks }} blocks ({{ networks.moonriver.treasury.motion_duration_days }} days) |
    |                    Spend period                    |    {{ networks.moonriver.treasury.spend_period_blocks }} blocks ({{ networks.moonriver.treasury.spend_period_days}} days)     |
    |             Maximum approved proposals             |                                   {{ networks.moonriver.treasury.max_approved_proposals }}                                    |
    | Target % of transaction fees allocated to Treasury |                                      {{ networks.moonriver.treasury.tx_fees_allocated }}                                      |

=== "Moonbase Alpha"
    |                      Variable                      |                                                            Value                                                            |
    |:--------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------:|
    |          Current Treasury Council members          |                              {{ networks.moonbase.treasury.current_council_members }} members                               |
    |                   Proposal bond                    |             {{ networks.moonbase.treasury.proposal_bond }}% of the proposed spend or the proposal bond minimum              |
    |               Proposal bond minimum                |                                   {{ networks.moonbase.treasury.proposal_bond_min }} DEV                                    |
    |               Proposal bond maximum                |                                     {{ networks.moonbase.treasury.proposal_bond_max }}                                      |
    |                  Motion duration                   | {{ networks.moonbase.treasury.motion_duration_blocks }} blocks ({{ networks.moonbase.treasury.motion_duration_days }} days) |
    |                    Spend period                    |    {{ networks.moonbase.treasury.spend_period_blocks }} blocks ({{ networks.moonbase.treasury.spend_period_days}} days)     |
    |             Maximum approved proposals             |                                   {{ networks.moonbase.treasury.max_approved_proposals }}                                   |
    | Target % of transaction fees allocated to Treasury |                                     {{ networks.moonbase.treasury.tx_fees_allocated }}                                      |

--8<-- 'text/_common/async-backing-moonbase.md'

## Community Treasury {: #community-treasury }

The Treasury is funded by a percentage of each block's transaction fees. The remaining percentage of the fees is burned (check the table above). The Treasury allows stakeholders to submit spending proposals to be reviewed and voted on by the Treasury Council. These spending proposals should include initiatives to further the network or boost network engagement. Some network initiatives could include funding integrations or collaborations, community events, network outreach, and more. Before a proposal is submitted, the author of the proposal can submit their idea for their proposal to the designated Treasury [discussion forum](https://forum.moonbeam.foundation/){target=\_blank} for feedback from the community for at least five days.

To deter spam, proposals must be submitted with a deposit, also known as a proposal bond. The proposal bond is a percentage (check the table above) of the amount requested by the proposer, with a minimum amount and no upper limit (compared to Polkadot and Kusama, which have a maximum bond amount). A governance proposal can change these values. So, any token holder with enough tokens to cover the deposit can submit a proposal. If the proposer doesn't have enough funds to cover the deposit, the extrinsic will fail due to insufficient funds, but transaction fees will still be deducted.

Once a proposal has been submitted, a Treasury Council member may motion for a vote on the proposal. The Treasury Council then votes on it during the motion duration. The threshold for accepting a treasury proposal is at least three-fifths of the treasury council. On the other hand, the threshold for rejecting a proposal is at least one-half of the treasury council. If any member(s) of the Treasury Council fails to vote during the motion duration, the vote of the Treasury Council member that holds the "Default Vote" position acts as the default. The "Default Vote" position mirrors that of [Polkadot's "Prime Member"](https://wiki.polkadot.network/docs/learn/learn-governance#prime-members/){target=\_blank}. Please note that there is no way for a user to revoke a treasury proposal after it has been submitted.

If approved by the treasury council, the proposal enters a queue to be placed into a spend period. If the spending queue happens to contain the number of maximum approved proposals, the proposal submission will fail similarly to how it would if the proposer's balance is too low. If the proposal gets rejected, the deposit is non-refundable.

Once the proposal is in a spend period, the funds will get distributed to the beneficiary, and the original deposit will be returned to the proposer. If the treasury runs out of funds, the remaining approved proposals will remain in storage until the following spend period when the treasury has enough funds again.

The happy path for a treasury proposal is shown in the following diagram:

![Treasury Proposal Happy Path Diagram](/images/learn/features/treasury/treasury-proposal-roadmap.webp)
