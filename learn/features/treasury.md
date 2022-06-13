---
title: Treasury
description: As a Polkadot parachain, Moonbeam has an on-chain treasury controlled by council members, enabling stakeholders to submit proposals to further the network.
---

# Treasury on Moonbeam

![Treasury Moonbeam Banner](/images/learn/features/treasury/treasury-overview-banner.png)

## Introduction {: #introduction } 

A treasury is an on-chain managed collection of funds. Moonbeam will have a community treasury for supporting network initiatives to further the network. This treasury will be funded by a percentage of transaction fees of the network and will be managed by the Council.

Each Moonbeam-based network will have it's own treasury. In other words, the Moonbase Alpha TestNet, Moonshadow on Westend, Moonriver on Kusama, and Moonbeam on Polkadot will each have their own respective treasury. 

## General Definitions {: #general-definitions } 

Some important terminology to understand in regards to treasuries:

- **Council** — a group of elected individuals that control how treasury funds will be spent
- **Proposal** — a plan or suggestion to further the network that is put forth by stakeholders to be approved by the council
- **Proposal bond** — a deposit equal to a percentage of the total proposal spend amount
- **Proposal bond minimum** — minimum amount for a proposal bond. This is the lower limit of the bond for a treasury proposal
- **Proposal bond maximum** — maximum amount (cap) for a proposal bond. **Proposal bonds are currently uncapped in all Moonbeam-based networks**
- **Spend period** — the amount of days, in blocks, during which the treasury funds as many proposals as possible without exceeding the maximum
- **Maximum approved proposals** — the maximum amount of proposals that can wait in the spending queue

=== "Moonbeam"
    |            Variable             |  |                                                        Value                                                         |
    |:-------------------------------:|::|:--------------------------------------------------------------------------------------------------------------------:|
    |          Proposal bond          |  |                        {{ networks.moonbeam.treasury.proposal_bond }}% of the proposed spend                         |
    |      Proposal bond minimum      |  |                               {{ networks.moonbeam.treasury.proposal_bond_min }} GLMR                                |
    |      Proposal bond maximum      |  |                                  {{ networks.moonbeam.treasury.proposal_bond_max }}                                  |
    |          Spend period           |  | {{ networks.moonbeam.treasury.spend_period_blocks }} blocks ({{ networks.moonbeam.treasury.spend_period_days}} days) |
    |   Maximum approved proposals    |  |                               {{ networks.moonbeam.treasury.max_approved_proposals }}                                |
    | % of transaction fees allocated |  |                                  {{ networks.moonbeam.treasury.tx_fees_allocated }}                                  |

=== "Moonriver"
    |            Variable             |  |                                                         Value                                                          |
    |:-------------------------------:|::|:----------------------------------------------------------------------------------------------------------------------:|
    |          Proposal bond          |  |                         {{ networks.moonriver.treasury.proposal_bond }}% of the proposed spend                         |
    |      Proposal bond minimum      |  |                                {{ networks.moonriver.treasury.proposal_bond_min }} MOVR                                |
    |      Proposal bond maximum      |  |                                  {{ networks.moonriver.treasury.proposal_bond_max }}                                   |
    |          Spend period           |  | {{ networks.moonriver.treasury.spend_period_blocks }} blocks ({{ networks.moonriver.treasury.spend_period_days}} days) |
    |   Maximum approved proposals    |  |                                {{ networks.moonriver.treasury.max_approved_proposals }}                                |
    | % of transaction fees allocated |  |                                  {{ networks.moonriver.treasury.tx_fees_allocated }}                                   |

=== "Moonbase Alpha"
    |            Variable             |  |                                                        Value                                                         |
    |:-------------------------------:|::|:--------------------------------------------------------------------------------------------------------------------:|
    |          Proposal bond          |  |                        {{ networks.moonbase.treasury.proposal_bond }}% of the proposed spend                         |
    |      Proposal bond minimum      |  |                                {{ networks.moonbase.treasury.proposal_bond_min }} DEV                                |
    |      Proposal bond maximum      |  |                                  {{ networks.moonbase.treasury.proposal_bond_max }}                                  |
    |          Spend period           |  | {{ networks.moonbase.treasury.spend_period_blocks }} blocks ({{ networks.moonbase.treasury.spend_period_days}} days) |
    |   Maximum approved proposals    |  |                               {{ networks.moonbase.treasury.max_approved_proposals }}                                |
    | % of transaction fees allocated |  |                                  {{ networks.moonbase.treasury.tx_fees_allocated }}                                  |

## Community Treasury {: #community-treasury } 

The Treasury is funded by a percentage of each block's transaction fees. The remaining percentage of the fees is burned (check the table above). The Treasury allows stakeholders to submit spending proposals to be reviewed and voted on by the Council. These spending proposals should include initiatives to further the network or boost network engagement. Some network initiatives could include funding integrations or collaborations, community events, network outreach, and more. 

To deter spam, proposals must be submitted with a deposit, also known as a proposal bond. The proposal bond is a percentage (check the table above) of the amount requested by the proposer, with a minimum amount and no upper limit (compared to Polkadot and Kusama, which have a maximum bond amount). A governance proposal can change these values. So, any token holder with enough tokens to cover the deposit can submit a proposal. If the proposer doesn't have enough funds to cover the deposit, the extrinsic will fail due to insufficient funds, but transaction fees will still be deducted. 

Once a proposal has been submitted, the Council votes on it. The threshold for accepting a treasury proposal is at least three-fifths of the Council. On the other hand, the threshold for rejecting a proposal is at least one-half of the Council. Please note that there is no way for a user to revoke a treasury proposal after it has been submitted.
 
If approved by the council, the proposal enters a queue to be placed into a spend period. If the spending queue happens to contain the number of maximum approved proposals, the proposal submission will fail similarly to how it would if the proposer's balance is too low. If the proposal gets rejected, the deposit will be lost and transferred to the parachain treasury account.

Once the proposal is in a spend period, the funds will get distributed to the beneficiary, and the original deposit will be returned to the proposer. If the Treasury runs out of funds, the remaining approved proposals will remain in storage until the following spend period when the Treasury has enough funds again.

The happy path for a treasury proposal is shown in the following diagram:

![Treasury Proposal Happy Path Diagram](/images/learn/features/treasury/treasury-proposal-roadmap.png)
