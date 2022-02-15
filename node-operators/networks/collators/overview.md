---
title: Overview
description: Instructions on how to dive in and become a collator in the Moonbeam Network once you are running a node
---

# Run a Collator on Moonbeam

![Collator Moonbeam Banner](/images/node-operators/networks/collators/collator-banner.png)

## Introduction {: #introduction } 

Collators are members of the network that maintain the parachains they take part in. They run a full node (for both their particular parachain and the relay chain), and they produce the state transition proof for relay chain validators.

As a collator, there is a level of commitment to the community and the network that is necessary to gain trust from the community of delegators. It's important to build a brand, reputation, and community around your collation services. Becoming a known participant throughout the ecosystem is a great way to attract nominations and solidify longevity and sustainability as a collator.

Since the relationship between collators and delegators is one built on trust, and as such, having direct lines of communication with delegators is a great way to build and reinforce that trust. [Joining the Discord](#join-the-discord) and introducing yourself is one way to open the lines of communication.  There are many updates that can be given, such as nodes being updated to a new version, rewards were paid out, servers were migrated, new features or tools have been built, or just checking in to say hello. These kinds of gestures can be much appreciated in putting words and a person behind the name of someone running a server.

There are some additional [requirements](/node-operators/networks/collators/requirements/){target=blank} that need to be considered prior to becoming a collator candidate including machine, bonding, and account requirements. 

Candidates will need a minimum amount of tokens bonded (self-bonded) to be considered eligible. Only a certain number of the top collator candidates by total stake, including self-bonded and delegated stake, will be in the active set of collators. Otherwise, the collator will remain in the candidate pool.

Once a candidate is selected to be in the active set of collators, they are eligible to produce blocks. 

Moonbeam uses the [Nimbus Parachain Consensus Framework](/learn/features/consensus/){target=blank}. This provides a two-step filter to allocate candidates to the active set of collators, then assign collators to a block production slot:

 - The parachain staking filter selects the top candidates in terms of tokens staked in each network. For the exact number of top candidates per each network and the minimum bond amount, you can check out the [Minimum Collator Bond](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=blank} section of our documentation. This filtered pool is called selected candidates (also known as the active set), which are rotated every round
 - The fixed size subset filter picks a pseudo-random subset of the previously selected candidates for each block production slot

Users can spin up full nodes on Moonbeam, Moonriver, and Moonbase Alpha and activate the `collate` feature to participate in the ecosystem as collator candidates. To do, you can checkout the [Run a Node](/node-operators/networks/run-a-node/){target=blank} section of the documentation and spin up a node using either [Docker](node-operators/networks/run-a-node/docker/){target=blank} or [Systemd](node-operators/networks/run-a-node/systemd/){target=blank}.

## Join the Discord {: #join-discord } 

As a collator, it is important to keep track of updates and changes to configuration. It is also important to be able to easily contact us and vice versa in case there is any issue with your node, as that will not only negatively affect collator and delegator rewards, it will also negatively affect the network.

For this purpose, we use [Discord](https://discord.com/invite/moonbeam){target=blank}. The most relevant Discord channels for collators are the following:

 - **tech-upgrades-announcements** — here we will publish any updates or changes in configuration collators will be required to follow. We will also announce any technical issues to watch out for, such as network stalls
 - **collators** — this is the general collator discussion channel. We are proud of having an active and friendly collator community so if you have any questions, this is the place to ask. We will also ping collators here for any issues that require their attention.
 - **meet-the-collators** — in this channel you can introduce yourself to potential delegators

After you join our Discord, feel free to DM *PureStake - Gil#0433* or *PureStake-Art#6950* and introduce yourself. This will let us know who to contact if we see an issue with your node, and will also let us assign the relevant Discord collator role, enabling you to post in *meet-the-collators*.