---
title: Overview
description: As a Polkadot parachain, Moonbeam will use an on-chain governance system, allowing for a stake-weighted vote on public referenda.
---

# Governance in Moonbeam

![Governance Moonbeam Banner](/images/governance/governance-overview-banner.png)

## Introduction

Moonbeam is a decentralized network that will be governed by a community of stakeholders including core developers, application developers, collators, token holders, users, partners, and other contributors. 

We aim to facilitate the engagement of token holders from each of these categories as part of launching the network.

## General Definitions

With great power comes great responsibility. Some of the important parameters that need to be understood to engage with Moonbeam's governance are the following:

 - **Proposals** — actions or items being proposed by token holders. This need to be seconded by other users in order to become move to referendum
 - **Referendum** — most seconded proposal move to referendum in order to be voted on by the community. There can only be one active referendum at a time, unless there is an emergency referendum in progress
 - **Launch period** — how often new public referenda are launched
 - **Voting period** — time token holders have to vote for a referendum (duration of a referendum)
- **Voting** — referenda are voted on by token holders on a stake and conviction weighted basis. Convictions is refered to as the time that you wish to lock your tokens when you vote, the longer you lock them, more weight your vote has.  Referenda which pass are subject to delayed enactment such that people that disagree with the direction of the decision have time to exit the network
 - **Enactment period** — time between a proposal being approved and enacted (make law). It is also the minimum period necessary to lock funds to propose an action
 - **Lock period** — time, after the proposal enactment, that the tokens of the winning voters are locked. Users can still use this tokens for staking or voting
 - **Delegation** — act of transfering your voting power to another account for up to a certain conviction

## Principles

Guiding "soft" principles for engagement with Moonbeam’s governance process include:

 - Being inclusive to token holders that want to engage with Moonbeam and that are affected by governance decisions.
 - To favor token holders engagement, even with views contrary to our own, versus a lack of engagement.
 - A commitment to openness and transparency in the decision-making process.
 - Working to keep the greater good of the network ahead of any personal gain.  
 - Acting at all times as a moral agent that considers the consequences of action (or inaction) from a moral standpoint.
 - Being patient and generous in our interactions with other token holders, but not tolerating abusive or destructive language, actions, and behavior.

These points were heavily inspired by Vlad Zamfir’s writings on governance. Refer to his articles, [especially this one](https://medium.com/@Vlad_Zamfir/how-to-participate-in-blockchain-governance-in-good-faith-and-with-good-manners-bd4e16846434).

## On-Chain Governance Mechanics

The "hard" governance process for Moonbeam will be driven by an on-chain process and will leverage the Democracy, Council, and Treasury [Substrate frame pallets](/resources/glossary/#substrate-frame-pallets), similar to how Kusama and the Polkadot Relay Chain are governed. The overall intent of these modules are to allow the majority of tokens on the network to determine the outcomes of key decisions around the network. These decision points come in the form of stake-weighted voting on proposed referenda.

Some of the main components of this governance model include:

 - **Council** — A group of elected individuals who have special voting rights within the system.  Council members are expected to propose referenda for voting and have an ability to veto publicly-sourced referenda.  There are rolling elections for council members where GLMR holders will vote on new or existing council members.
 - **Treasury** — A collection of funds that can be spent by submitting a proposal along with a deposit.  Spending proposals must be approved by the council.  Rejected proposals will result in the proposer losing their deposit.

See [this overview on the Polkadot website](https://polkadot.network/a-walkthrough-of-polkadots-governance/) and [this wiki post](https://wiki.polkadot.network/docs/en/learn-governance) for more details on how these Substrate frame pallets implement on-chain governance.
