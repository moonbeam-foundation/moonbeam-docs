---
title: Overview
description: As a Polkadot parachain, Moonbeam will use an on-chain treasury controlled by council members, that allows for stakeholders to submit proposals to further the network.
---

# Treasury in Moonbeam

![Treasury Moonbeam Banner](/images/treasury/treasury-overview-banner.png)

## Introduction

A treasury is an on-chain managed collection of funds. Moonbeam will have a community treasury for supporting network initiatives to further the network. This treasury will be funded by a percentage of transaction fees of the network and will be managed by the Council.

Each Moonbeam-based network will have it's own treasury. In other words, the Moonbase Alpha TestNet, Moonshadow on Westend, Moonriver on Kusama, and Moonbeam on Polkadot will each have their own respective treasury. 

## General Definitions

Some important terminology to understand in regards to treasuries:

- **Council** — a group of elected individuals that control how treasury funds will be spent
- **Proposal** — a plan or suggestion to further the network that is put forth by stakeholders to be approved by the council
- **Proposal bond** — a deposit equal to a percentage of the total proposal spend amount
- **Proposal bond minimum** — minimum amount for a proposal bond. This amount must be paid as the bond if it is higher than the deposit percentage
- **Spend period** — the amount of days, in blocks, during which the treasury funds as many proposals as possible without exceeding the maximum
- **Maximum approved proposals** — the maximum amount of proposals that can wait in the spending queue

Currently, the Treasury values are as follows:

=== "Moonbase Alpha"
    |             Variable             |     |                                                             Value                                                      |
    | :------------------------------: | :-: | :--------------------------------------------------------------------------------------------------------------------: |
    |           Proposal bond          |     |                            {{ networks.moonbase.treasury.proposal_bond }}% of the proposed spend                       |
    |       Proposal bond minimum      |     |                                  {{ networks.moonbase.treasury.proposal_bond_min }} DEV                              |
    |           Spend period           |     |  {{ networks.moonbase.treasury.spend_period_blocks }} blocks ({{ networks.moonbase.treasury.spend_period_days}} days)  |
    |     Maximum approved proposals   |     |                                  {{ networks.moonbase.treasury.max_approved_proposals }}                               |
    |     % of transaction fees allocated   |     |                                  {{ networks.moonbase.treasury.tx_fees_allocated }}                               |

=== "Moonriver"
    |             Variable             |     |                                                             Value                                                      |
    | :------------------------------: | :-: | :--------------------------------------------------------------------------------------------------------------------: |
    |           Proposal bond          |     |                            {{ networks.moonriver.treasury.proposal_bond }}% of the proposed spend                       |
    |       Proposal bond minimum      |     |                                  {{ networks.moonriver.treasury.proposal_bond_min }} MOVR                              |
    |           Spend period           |     |  {{ networks.moonriver.treasury.spend_period_blocks }} blocks ({{ networks.moonriver.treasury.spend_period_days}} days)  |
    |     Maximum approved proposals   |     |                                  {{ networks.moonriver.treasury.max_approved_proposals }}                               |
     |     % of transaction fees allocated   |     |                                  {{ networks.moonriver.treasury.tx_fees_allocated }}                               |

## Community Treasury

To fund the Treasury, a percentage of each block's transactions fees will be allocated to it. The remaining percentage of the fees are burned (check table above). The Treasury allows stakeholders to submit spending proposals to be reviewed and voted on by the Council. These spending proposals should include initiatives to further the network or boost network engagement. Some network initiatives could include funding integrations or collaborations, community events, network outreach, and more. 

To deter spam, proposals must be submitted with a deposit, also known as a proposal bond.The proposal bond needs to be higher than the minimum amount, known as the proposal bond minimum, which can be changed by a governance proposal. So, any token holder that has enough tokens to cover the deposit can submit a proposal. If the proposer doesn't have enough funds to cover the deposit, the extrinsic will fail due to insufficient funds, but transaction fees will still be deducted. 

Once a proposal has been submitted, is subject to governance, and the council votes on it. If the proposal gets rejected, the deposit will be lost and transfered to the treasury pot. If approved by the council, the proposal enters a queue to be placed into a spend period. If the spending queue happens to contain the number of maximum approved proposals, the proposal submission will fail similarly to how it would if the proposer's balance is too low.

Once the proposal is in a spend period, the funds will get distributed to the beneficiary and the original deposit will be returned to the proposer. If the treasury runs out of funds, the remaining approved proposals will remain in storage until the next spend period when the Treasury has enough funds again.

The happy path for a treasury proposal is shown in the following diagram:

![Treasury Proposal Happy Path Diagram](/images/treasury/treasury-proposal-roadmap.png)
