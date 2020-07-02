---
title: Governance
description: Explanation of how Governance works in Moonbeam
---

#Governance in Moonbeam

Moonbeam is a decentralized network that will be governed by a community of stakeholders including core developers, application developers, collators, token holders, users, partners, and other contributors.  PureStake aims to facilitate the engagement of stakeholders from each of these categories as part of launching the network.

Guiding "soft" principles for engagement with Moonbeam’s governance process include:

* Being inclusive to stakeholders that want to engage with Moonbeam and that are affected by governance decisions.
* To favor stakeholder engagement even with views contrary to our own vs a lack of engagement.
* A commitment to openness and transparency in the decision making process.
* Working to keep the greater good of the network ahead of any personal gain.  
* Acting at all times as a moral agent that considers the consequences of action (or inaction) from a moral standpoint.
* Being patient and generous in our interactions with other stakeholders, but not tolerating abusive or destructive language, actions, and behavior.

These points were heavily inspired by Vlad Zamfir’s writings on governance, see especially [https://medium.com/@Vlad_Zamfir/how-to-participate-in-blockchain-governance-in-good-faith-and-with-good-manners-bd4e16846434](https://medium.com/@Vlad_Zamfir/how-to-participate-in-blockchain-governance-in-good-faith-and-with-good-manners-bd4e16846434)

##On-chain Governance Mechanics

The "hard" governance process for Moonbeam will be driven by an on-chain process and will leverage the Democracy, Council, and Treasury Substrate frame pallets, similar to how Kusama and the Polkadot Relay Chain are governed.  The overall intent of these modules are to allow the majority of tokens on the network to determine the outcomes of key decisions around the network.  These decision points come in the form of stake weighted voting on proposed referenda.

Some of the main components of this governance model include:

* Council - A group of elected individuals who have special voting rights within the system.  Council members are expected to propose referenda for voting and have an ability to veto publicly sourced referenda.  There are rolling elections for council members where GLMR holders will vote on new or existing council members.
* Referenda - Any proposal for a change to the Moonbeam system including values for key parameters, code upgrades, or changes to the governance system itself.
* Voting - Referenda will be voted on by GMLR token holders on a stake weighted basis.  Referenda which pass are subject to delayed enactment such that people that disagree with the direction of the decision have time to exit the network.
* Treasury - a collection of funds that can be spent by submitting a proposal along with a deposit.  Spending proposals must be approved by the council.  Rejected proposals will result in the proposer losing their deposit.

See [https://polkadot.network/a-walkthrough-of-polkadots-governance/](https://polkadot.network/a-walkthrough-of-polkadots-governance/) and [https://wiki.polkadot.network/docs/en/learn-governance](https://wiki.polkadot.network/docs/en/learn-governance) for more details on how these Substrate frame pallets implement on-chain governance.
