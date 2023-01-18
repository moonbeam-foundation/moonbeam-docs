---
title: Governance
description: As a Polkadot parachain, Moonbeam uses an on-chain governance system, allowing for a stake-weighted vote on public referenda.
---

# Governance on Moonbeam

![Governance Moonbeam Banner](/images/learn/features/governance/governance-overview-banner.png)

## Introduction {: #introduction } 

The goal of Moonbeam’s governance mechanism is to advance the protocol according to the desires of the community. In that shared mission, the governance process seeks to include all token holders. All and any changes to the protocol must go through a referendum so that all token holders, weighted by stake, can have input on the decision. Governance forums like the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=_blank} and [Polkassembly](https://moonbeam.polkassembly.network/){target=_blank} enable open discussion and enable proposals to be refined based on community input. Autonomous enactments and [forkless upgrades](https://wiki.polkadot.network/docs/learn-runtime-upgrades#forkless-upgrades/){target=_blank} unite the community towards a shared mission to advance the protocol.

!!! note "Upcoming Governance Changes"
    The contents in this guide are subject to change. See [this pull request](https://github.com/paritytech/substrate/pull/10195){target=_blank} for more details on Polkadot's recent efforts to modify Polkadot Governance ("Gov2"). You can also check out [Gavin Wood's blog post](https://medium.com/polkadot-network/gov2-polkadots-next-generation-of-decentralised-governance-4d9ef657d11b){target=_blank} explaining the background of Gov2. Note all changes to governance will go through governance and token-holder approval.  

## General Definitions {: #general-definitions } 

With great power comes great responsibility. Some important parameters to understand before engaging with Moonbeam's governance include:

 - **Proposals** — actions or items being proposed by token holders. There are two main ways that a proposal is created:
    - **Democracy Proposal** - a proposal that is submitted by anyone in the community and will be open for endorsements from the token holders. The Democracy Proposal that has the highest amount of bonded support will be selected to be a referendum at the end of the Launch Period
    - **External Proposals** - a proposal that is created by the Council and then, if accepted by the Council, is submitted for token holder voting. When the Council submits an External Proposal, the Council sets the Vote Tallying Metric
        - **Fast-tracked Proposals** - the Technical Committee may choose to fast-track an External Proposal which means changing the default parameters such as the Voting Period and Enactment Period. A fast-tracked referendum can be created alongside existing active referenda. That is to say, an emergency referendum does not replace the currently active referendum
- **Referendum** — a proposal that is up for token-holder voting. Each referendum is tied to a specific proposal for a change to the Moonbeam system including values for key parameters, code upgrades, or changes to the governance system itself
- **Launch period** — the time period before a voting period that publicly submitted proposals will gather endorsements
- **Voting period** — time token holders have to vote for a referendum (duration of a referendum)
- **Voting** — referenda are voted on by token holders on a stake and conviction weighted basis. Conviction refers to the time that token holders voluntarily lock their tokens when voting: the longer they are locked, the more weight their vote has. Token holders may vote with tokens that are delegated on collators. Voting is always binary; your only options in voting are “aye”, “nay”, or abstaining
- **Vote Tallying Metric** — there are three types of vote tallying metrics: (i) Positive Turnout Bias (Super-Majority Approve), (ii) Negative Turnout Bias (Super-Majority Against), or (iii) Simple Majority. See [Polkadot’s Wiki on Tallying](https://wiki.polkadot.network/docs/learn-governance#tallying){target=_blank} for more information about how these different vote tallying metrics work
    - The vote tallying metric applied depends on the type of Referendum: 
        - Democracy Proposals - Positive Turnout Bias (Super-Majority Approve) tallying metric is applied
        - External Proposals - the vote tallying metric is set by the Council
- **Enactment period** — time between a proposal being approved and enacted (make law). It is also the minimum period necessary to lock funds to propose an action
- **Lock period** — time (after the proposal enactment) that the tokens of the winning voters are locked. Users can still use these tokens for staking or voting. 
- **Cool-off period** — duration a veto from the technical committee lasts before the proposal may be submitted again
- **Delegation** — act of transferring your voting power to another account for up to a certain conviction

## Quick Reference {: #quick-reference }

=== "Moonbeam"
    |            Variable            |                                                         Value                                                          |
    |:------------------------------:|:----------------------------------------------------------------------------------------------------------------------:|
    |         Launch period          | {{ networks.moonbeam.democracy.launch_period.blocks}} blocks ({{ networks.moonbeam.democracy.launch_period.days}} day) |
    |         Voting period          |  {{ networks.moonbeam.democracy.vote_period.blocks}} blocks ({{ networks.moonbeam.democracy.vote_period.days}} days)   |
    |        Enactment period        | {{ networks.moonbeam.democracy.enact_period.blocks}} blocks ({{ networks.moonbeam.democracy.enact_period.days}} days)  |
    |        Cool-off period         |  {{ networks.moonbeam.democracy.cool_period.blocks}} blocks ({{ networks.moonbeam.democracy.cool_period.days}} days)   |
    |        Minimum deposit         |                                   {{ networks.moonbeam.democracy.min_deposit }} GLMR                                   |
    |       Maximum proposals        |                                    {{ networks.moonbeam.democracy.max_proposals }}                                     |
    | Maximum referenda (at a time)* |                                    {{ networks.moonbeam.democracy.max_referenda }}                                     |
   
    **The maximum number of referenda at a time does not take fast tracked referenda into consideration.* 

=== "Moonriver"
    |            Variable            |                                                          Value                                                           |
    |:------------------------------:|:------------------------------------------------------------------------------------------------------------------------:|
    |         Launch period          | {{ networks.moonriver.democracy.launch_period.blocks}} blocks ({{ networks.moonriver.democracy.launch_period.days}} day) |
    |         Voting period          |  {{ networks.moonriver.democracy.vote_period.blocks}} blocks ({{ networks.moonriver.democracy.vote_period.days}} days)   |
    |        Enactment period        |  {{ networks.moonriver.democracy.enact_period.blocks}} blocks ({{ networks.moonriver.democracy.enact_period.days}} day)  |
    |        Cool-off period         |  {{ networks.moonriver.democracy.cool_period.blocks}} blocks ({{ networks.moonriver.democracy.cool_period.days}} days)   |
    |        Minimum deposit         |                                   {{ networks.moonriver.democracy.min_deposit }} MOVR                                    |
    |       Maximum proposals        |                                     {{ networks.moonriver.democracy.max_proposals }}                                     |
    | Maximum referenda (at a time)* |                                     {{ networks.moonriver.democracy.max_referenda }}                                     |
    
    **The maximum number of referenda at a time does not take fast tracked referenda into consideration.* 

=== "Moonbase Alpha"
    |            Variable            |                                                         Value                                                          |
    |:------------------------------:|:----------------------------------------------------------------------------------------------------------------------:|
    |         Launch period          | {{ networks.moonbase.democracy.launch_period.blocks}} blocks ({{ networks.moonbase.democracy.launch_period.days}} day) |
    |         Voting period          |  {{ networks.moonbase.democracy.vote_period.blocks}} blocks ({{ networks.moonbase.democracy.vote_period.days}} days)   |
    |        Enactment period        |  {{ networks.moonbase.democracy.enact_period.blocks}} blocks ({{ networks.moonbase.democracy.enact_period.days}} day)  |
    |        Cool-off period         |  {{ networks.moonbase.democracy.cool_period.blocks}} blocks ({{ networks.moonbase.democracy.cool_period.days}} days)   |
    |        Minimum deposit         |                                   {{ networks.moonbase.democracy.min_deposit }} DEV                                    |
    |       Maximum proposals        |                                    {{ networks.moonbase.democracy.max_proposals }}                                     |
    | Maximum referenda (at a time)* |                                    {{ networks.moonbase.democracy.max_referenda }}                                     |
    
    **The maximum number of referenda at a time does not take fast tracked referenda into consideration.* 

!!! note
    The Voting Period and Enactment Period are subject to change for External Proposals.

## Principles {: #principles } 

Guiding "soft" principles for engagement with Moonbeam's governance process include:

 - Being inclusive to token holders that want to engage with Moonbeam and that are affected by governance decisions
 - Favoring token holder engagement, even with views contrary to our own, versus a lack of engagement
 - A commitment to openness and transparency in the decision-making process
 - Working to keep the greater good of the network ahead of any personal gain  
 - Acting at all times as a moral agent that considers the consequences of action (or inaction) from a moral standpoint
 - Being patient and generous in our interactions with other token holders, but not tolerating abusive or destructive language, actions, and behavior, and abiding by [Moonbeam’s Code of Conduct](https://github.com/moonbeam-foundation/code-of-conduct){target=_blank}

These points were heavily inspired by Vlad Zamfir’s writings on governance. Refer to his articles, especially the [How to Participate in Blockchain Governance in Good Faith (and with Good Manners)](https://medium.com/@Vlad_Zamfir/how-to-participate-in-blockchain-governance-in-good-faith-and-with-good-manners-bd4e16846434){target=_blank} Medium article.

## On-Chain Governance Mechanics {: #on-chain-governance-mechanics } 

The "hard" governance process for Moonbeam will be driven by an on-chain process and will leverage the Democracy, Council, and Treasury [Substrate frame pallets](/learn/platform/glossary/#substrate-frame-pallets){target=_blank}, similar to how Kusama and the Polkadot relay chain are governed. The overall intent of these modules are to allow the majority of tokens on the network to determine the outcomes of key decisions around the network. These decision points come in the form of stake-weighted voting on proposed referenda.

Some of the main components of this governance model include:

 - **Referenda** — a stake-based voting scheme where each referendum is tied to a specific proposal for a change to the Moonbeam system including values for key parameters, code upgrades, or changes to the governance system itself
 - **Voting** — referendum will be voted on by token holders on a stake-weighted basis. Referenda which pass are subject to delayed enactment such that people that disagree with the direction of the decision have time to exit the network
 - **Council & Technical Committee** — a group of community members who have special voting rights within the system

For more details on how these Substrate frame pallets implement on-chain governance, you can checkout the [Walkthrough of Polkadot’s Governance](https://polkadot.network/a-walkthrough-of-polkadots-governance/){target=_blank} blog post and the [Polkadot Governance Wiki](https://wiki.polkadot.network/docs/learn-governance){target=_blank}.

## Vote Weight {: #vote-weight }

A token holder’s influence in a referendum is determined by two parameters specified at the time of voting: lock balance and conviction. Lock balance is the number of tokens that a user commits to a vote (note, this is not the same as a user’s total account balance). Akin to Polkadot’s governance, Moonbeam uses a concept of voluntary locking that allows token holders to increase their voting power by locking tokens for a longer period of time. Specifying no lock period means a user’s vote is valued at 10% of their lock balance. Additional voting power can be achieved by specifying a greater conviction. For each increase in conviction (vote multiplier), the lock periods double. You can read more about conviction in [Vote on a Proposal](/tokens/governance/voting/#how-to-vote){target=_blank}.

## Voting Rights of the Council and the Technical Committee {: #voting-rights-of-the-council-and-the-technical-committee } 

### External Proposals {: #external-proposals }

The Council may submit external referenda (through a Council proposal) for token-holder voting.

### Fast-Tracked External Proposals {: #fast-tracked-external-proposals }

As in Polkadot and Kusama, the Technical Committee has the ability to fast-track an External Proposal. Fast-Tracked Proposals with a Voting Period of a day or more require one half of the Technical Committee approval. Fast-tracked Proposals with a Voting Period of less than a day are called “Instant Fast-tracked Proposals” and require three fifths of the Technical Committee approval. 

### Voting Rights to Cancel and Veto {: #voting-rights-cancel-veto }

The Technical Committee may decide to cancel democracy proposals that are uncontroversially dangerous, 
malicious or that violate the Moonbeam governance guiding principles.

Alternatively, the Council may decide to cancel publicly-submitted referenda originated from such malicious democracy proposals.

A single technical committee member may veto an external proposal, however, they can only veto it once, and it only lasts for the cool-off period.

## Try it out {: #try-it-out } 

Token holders can submit proposals and vote on referenda on Moonbeam, Moonriver, and Moonbase Alpha. To do so, check the following guides:

 - [Submit a proposal](/tokens/governance/proposals/)
 - [Vote on a proposal](/tokens/governance/voting/)
 - [Interact with DemocracyInterface.sol](/builders/pallets-precompiles/precompiles/democracy/)
