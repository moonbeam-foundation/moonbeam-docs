---
title: Run a Collator Node
description: Instructions on how to dive in and become a collator in the Moonbeam Network once you are running a node.
categories: Basics, Node Operators and Collators
---

# Run a Collator on Moonbeam

## Introduction {: #introduction }

Collators are members of the network that maintain the parachains they take part in. They run a full node (for both their particular parachain and the relay chain), and they produce the state transition proof for relay chain validators.

There are some [requirements](/node-operators/networks/collators/requirements/){target=\_blank} that need to be considered prior to becoming a collator candidate including machine, bonding, account, and community requirements.

Candidates will need a minimum amount of tokens bonded (self-bonded) to be considered eligible. Only a certain number of the top collator candidates by total stake, including self-bonded and delegated stake, will be in the active set of collators. Otherwise, the collator will remain in the candidate pool.

Once a candidate is selected to be in the active set of collators, they are eligible to produce blocks.

Moonbeam uses the Nimbus Parachain Consensus Framework. This provides a two-step filter to allocate candidates to the active set of collators, then assign collators to a block production slot:

 - The parachain staking filter selects the top candidates in terms of tokens staked in each network. For the exact number of top candidates per each network and the minimum bond amount, you can check out the [Minimum Collator Bond](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=\_blank} section of our documentation. This filtered pool is called selected candidates (also known as the active set), which are rotated every round
 - The fixed size subset filter picks a pseudo-random subset of the previously selected candidates for each block production slot

Users can spin up full nodes on Moonbeam, Moonriver, and Moonbase Alpha and activate the `collate` feature to participate in the ecosystem as collator candidates. To do this, you can checkout the [Run a Node](/node-operators/networks/run-a-node/){target=\_blank} section of the documentation and spin up a node using either [Docker](/node-operators/networks/run-a-node/docker/){target=\_blank} or [Systemd](/node-operators/networks/run-a-node/systemd/){target=\_blank}.

## Join the Discord {: #join-discord }

As a collator, it is important to keep track of updates and changes to configuration. It is also important to be able to easily contact us and vice versa in case there is any issue with your node, as that will not only negatively affect collator and delegator rewards, it will also negatively affect the network.

For this purpose, we use [Discord](https://discord.com/invite/moonbeam){target=\_blank}. The most relevant Discord channels for collators are the following:

 - **tech-upgrades-announcements** — here we will publish any updates or changes in configuration changes collators will be required to follow. We will also announce any technical issues to monitor, such as network stalls
 - **collators** — this is the general collator discussion channel. We are proud of having an active and friendly collator community so if you have any questions, this is the place to ask. We will also ping collators here for any issues that require their attention.
 - **meet-the-collators** — in this channel you can introduce yourself to potential delegators

After you join our Discord, feel free to DM *gilmouta* or *artkaseman* and introduce yourself. This will let us know who to contact if we see an issue with your node, and will also let us assign the relevant Discord collator role, enabling you to post in *meet-the-collators*.
