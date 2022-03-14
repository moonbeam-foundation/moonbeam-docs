---
title: Governance
description: As a Polkadot parachain, Moonbeam will use an on-chain governance system, allowing for a stake-weighted vote on public referenda.
---

# Governance in Moonbeam

![Governance Moonbeam Banner](/images/learn/features/governance/governance-overview-banner.png)

## Introduction {: #introduction } 

Moonbeam is a decentralized network that is governed by its community of token holders. The goal of Moonbeam’s governance mechanism is to advance the protocol according to the desires of the community. In that shared mission, the governance process seeks to include core developers, application developers, collators, users, and other contributors. Governance forums like [Polkassembly](https://moonbeam.polkassembly.network/){target=blank} enable open discussion and enable proposals to be refined based on community input. Autonomous enactments and [forkless upgrades](https://wiki.polkadot.network/docs/learn-runtime-upgrades#forkless-upgrades/){target=blank} unite the community towards a shared mission to advance the protocol.

## General Definitions {: #general-definitions } 

With great power comes great responsibility. Some important parameters to understand before engaging with Moonbeam's governance include:

 - **Proposals** — actions or items being proposed by token holders. Once per launch period, the most seconded proposal is moved to referendum status
 - **Referendum** — when the most seconded proposal is voted on by the community. There can be a maximum of five active referenda at a time unless there is an emergency referendum in progress
 - **Launch period** — how often new public referenda are launched
 - **Voting period** — time token holders have to vote for a referendum (duration of a referendum)
 - **Fast-Track Voting period** — duration for voting for emergency proposals that address critical issues
- **Voting** — referenda are voted on by token holders on a stake and conviction weighted basis. Conviction refers to the time that token holders voluntarily lock their tokens when voting: the longer they are locked, the more weight their vote has. Referenda that pass are subject to delayed enactment so that people who disagree with the direction of the decision have time to exit the network
 - **Enactment period** — time between a proposal being approved and enacted (make law). It is also the minimum period necessary to lock funds to propose an action
 - **Lock period** — time (after the proposal enactment) that the tokens of the winning voters are locked. Users can still use these tokens for staking or voting
 - **Cool-off period** - duration a veto from the technical committee lasts before the proposal may be submitted again
 - **Delegation** — act of transferring your voting power to another account for up to a certain conviction

## Quick Reference {: #quick-reference }

=== "Moonbeam"
    |         Variable         |                                                            Value                                                             |
    |:------------------------:|:----------------------------------------------------------------------------------------------------------------------------:|
    |      Voting Period       |     {{ networks.moonbeam.democracy.vote_period.blocks}} blocks ({{ networks.moonbeam.democracy.vote_period.days}} days)      |
    | Fast-Track Voting Period | {{ networks.moonbeam.democracy.fast_vote_period.blocks}} blocks ({{ networks.moonbeam.democracy.fast_vote_period.days}} day) |
    |     Enactment Period     |    {{ networks.moonbeam.democracy.enact_period.blocks}} blocks ({{ networks.moonbeam.democracy.enact_period.days}} days)     |
    |     Cool-off Period      |     {{ networks.moonbeam.democracy.cool_period.blocks}} blocks ({{ networks.moonbeam.democracy.cool_period.days}} days)      |
    |     Minimum Deposit      |                                      {{ networks.moonbeam.democracy.min_deposit }} GLMR                                      |
    |    Maximum Proposals     |                                       {{ networks.moonbeam.democracy.max_proposals }}                                        |

=== "Moonriver"
    |         Variable         |                                                               Value                                                               |
    |:------------------------:|:---------------------------------------------------------------------------------------------------------------------------------:|
    |      Voting Period       |       {{ networks.moonriver.democracy.vote_period.blocks}} blocks ({{ networks.moonriver.democracy.vote_period.days}} days)       |
    | Fast-Track Voting Period | {{ networks.moonriver.democracy.fast_vote_period.blocks}} blocks ({{ networks.moonriver.democracy.fast_vote_period.hours}} hours) |
    |     Enactment Period     |      {{ networks.moonriver.democracy.enact_period.blocks}} blocks ({{ networks.moonriver.democracy.enact_period.days}} day)       |
    |     Cool-off Period      |       {{ networks.moonriver.democracy.cool_period.blocks}} blocks ({{ networks.moonriver.democracy.cool_period.days}} days)       |
    |     Minimum Deposit      |                                        {{ networks.moonriver.democracy.min_deposit }} MOVR                                        |
    |    Maximum Proposals     |                                         {{ networks.moonriver.democracy.max_proposals }}                                          |

=== "Moonbase Alpha"
    |         Variable         |                                                              Value                                                              |
    |:------------------------:|:-------------------------------------------------------------------------------------------------------------------------------:|
    |      Voting Period       |       {{ networks.moonbase.democracy.vote_period.blocks}} blocks ({{ networks.moonbase.democracy.vote_period.days}} days)       |
    | Fast-Track Voting Period | {{ networks.moonbase.democracy.fast_vote_period.blocks}} blocks ({{ networks.moonbase.democracy.fast_vote_period.hours}} hours) |
    |     Enactment Period     |      {{ networks.moonbase.democracy.enact_period.blocks}} blocks ({{ networks.moonbase.democracy.enact_period.days}} day)       |
    |     Cool-off Period      |       {{ networks.moonbase.democracy.cool_period.blocks}} blocks ({{ networks.moonbase.democracy.cool_period.days}} days)       |
    |     Minimum Deposit      |                                        {{ networks.moonbase.democracy.min_deposit }} DEV                                        |
    |    Maximum Proposals     |                                         {{ networks.moonbase.democracy.max_proposals }}                                         |

## Principles {: #principles } 

Guiding "soft" principles for engagement with Moonbeam's governance process include:

 - Being inclusive to token holders that want to engage with Moonbeam and that are affected by governance decisions
 - Favoring token holder engagement, even with views contrary to our own, versus a lack of engagement
 - A commitment to openness and transparency in the decision-making process
 - Working to keep the greater good of the network ahead of any personal gain  
 - Acting at all times as a moral agent that considers the consequences of action (or inaction) from a moral standpoint
 - Being patient and generous in our interactions with other token holders, but not tolerating abusive or destructive language, actions, and behavior

These points were heavily inspired by Vlad Zamfir’s writings on governance. Refer to his articles, especially the [How to Participate in Blockchain Governance in Good Faith (and with Good Manners)](https://medium.com/@Vlad_Zamfir/how-to-participate-in-blockchain-governance-in-good-faith-and-with-good-manners-bd4e16846434){target=blank} Medium article.

## On-Chain Governance Mechanics {: #on-chain-governance-mechanics } 

The "hard" governance process for Moonbeam will be driven by an on-chain process and will leverage the Democracy, Council, and Treasury [Substrate frame pallets](/learn/platform/glossary/#substrate-frame-pallets){target=blank}, similar to how Kusama and the Polkadot relay chain are governed. The overall intent of these modules are to allow the majority of tokens on the network to determine the outcomes of key decisions around the network. These decision points come in the form of stake-weighted voting on proposed referenda.

Some of the main components of this governance model include:

 - **Referendum** — a proposal for a change to the Moonbeam system including values for key parameters, code upgrades, or changes to the governance system itself
 - **Voting** — referenda will be voted on by token holders on a stake-weighted basis. Referenda which pass are subject to delayed enactment such that people that disagree with the direction of the decision have time to exit the network
 - **Council** — a group of elected individuals who have special voting rights within the system. Council members are expected to propose referenda for voting and have an ability to veto publicly-sourced referenda. There are rolling elections for council members where GLMR holders will vote on new or existing council members. The Council is also responsible for electing the technical committee
 - **Technical Committee** — a group of individuals elected by the Council who have special voting rights. As in Polkadot and Kusama, the Technical Committee has the ability to (along with the Council) fast-track emergency referenda voting and implementation in urgent circumstances. A fast-tracked referendum can be created alongside existing active referenda. That is to say, an emergency referendum does not replace currently active referenda
 - **Treasury** — a collection of funds that can be spent by submitting a proposal along with a deposit. Spending proposals must be approved by the council. Rejected proposals will result in the proposer losing their deposit

For more details on how these Substrate frame pallets implement on-chain governance, you can checkout the [Walkthrough of Polkadot’s Governance](https://polkadot.network/a-walkthrough-of-polkadots-governance/){target=blank} blog post and the [Polkadot Governance Wiki](https://wiki.polkadot.network/docs/learn-governance){target=blank}.

## Vote Weight {: #vote-weight }

A token holder’s influence in a referendum is determined by two parameters specified at the time of voting: lock balance and conviction. Lock balance is the number of tokens that a user commits to a vote (note, this is not the same as a user’s total account balance). Akin to Polkadot’s governance, Moonbeam uses a concept of voluntary locking that allows token holders to increase their voting power by locking tokens for a longer period of time. Specifying no lock period means a user’s vote is valued at 10% of their lock balance. Additional voting power can be achieved by specifying a greater conviction. For each increase in conviction (vote multiplier), the lock periods double. You can read more about conviction in [Vote on a Proposal.](/tokens/governance/voting/#how-to-vote)

## Voting Rights of the Council and the Technical Committee {: #voting-rights-of-the-council-and-the-technical-committee } 

This section covers some background information on voting rights. There is a limit to the amount of time in blocks that the technical committee and the council have to vote on motions. Motions may end in fewer blocks if there are already enough votes submitted to determine the outcome. There is a [maximum amount of proposals](#quick-reference) that can be open each in the technical committee and in the council.

**Voting Rights to Cancel:**

 - The technical committee may cancel a proposal before it has been passed only by unanimous vote
 - A single technical committee member may veto an inbound council proposal, however, they can only veto it once, and it only lasts for the [cool-off period](#quick-reference)

## Try it out {: #try-it-out } 

Token holders can submit proposals and vote on referenda on Moonbeam, Moonriver, and Moonbase Alpha. To do so, check the following guides:

 - [Submit a proposal](/tokens/governance/proposals/)
 - [Vote on a proposal](/tokens/governance/voting/)
 - [Interact with DemocracyInterface.sol](/builders/tools/precompiles/democracy/)
