---
title: How to Propose an Action on Moonbeam
description: Learn about the roadmap of a proposal and how to propose an action, send it to be voted on, and second a proposal on Moonbeam via governance features.
---

# How to Propose an Action

![Governance Moonbeam Banner](/images/tokens/governance/proposals/governance-proposal-banner.png)

## Introduction {: #introduction } 

As mentioned in the [governance overview page](/learn/features/governance/#definitions){target=_blank}, a proposal is a submission to the chain in which a token holder suggests for an action to be enacted by the system.

Proposals are one of the core elements of the governance system because they are the main tool for stakeholders to propose actions/changes, which other stakeholders then vote on. In Moonbeam, users will be able to create, second, and vote on proposals using their H160 address and private key, that is, their regular Ethereum account!

This guide outlines the process of how to create a proposal. The steps will go from its creation until it reaches public referenda. There is a separate guide on [How to Vote on a Proposal](/tokens/governance/voting/){target=_blank}. More information can be found in Polkadot's Wiki pages related to [Governance](https://wiki.polkadot.network/docs/learn-governance#council){target=_blank} and [Participate in Democracy](https://wiki.polkadot.network/docs/maintain-guides-democracy){target=_blank}.

!!! note
    This guide was done with a customized version of Moonbeam with short Launch/Enactment periods for demonstration purposes only.

## Definitions {: #definitions } 

Some of the key parameters for this guide are the following:

 - **Proposal** — action or items being proposed by users of the network
 - **Second** — other stakeholders can second (approve) a proposal if they agree with it and want to help it reach public referenda. This requires matching the deposit of the original proposer
 - **Preimage hash** — hash of the proposal to be enacted. The first step to make a proposal is to submit a preimage. The hash is just its identifier. The proposer of the preimage can be different than the user that proposes that preimage as a formal proposal
 - **Minimum preimage deposit** — minimum amount of tokens that the proposer needs to pay when submitting a preimage
 - **Minimum proposal deposit** — minimum amount of tokens that the proposer needs to bond when submitting a proposal. Tokens might be locked for an indeterminate amount of time because it is unknown when a proposal may become a referendum (if ever). This is true for tokens bonded by both the proposer and users that second the proposal
 - **Launch period** — how often new public referenda are launched
 - **Cool-off period** — duration (in blocks) in which a proposal may not be re-submitted after being vetoed

=== "Moonbeam"
    |         Variable         |                                                          Value                                                          |
    |:------------------------:|:-----------------------------------------------------------------------------------------------------------------------:|
    |      Launch period       | {{ networks.moonbeam.democracy.launch_period.blocks}} blocks ({{ networks.moonbeam.democracy.launch_period.days}} days) |
    |     Cool-off period      |   {{ networks.moonbeam.democracy.cool_period.blocks}} blocks ({{ networks.moonbeam.democracy.cool_period.days}} days)   |
    | Minimum preimage deposit |                                 {{ networks.moonbeam.democracy.min_preim_deposit}} GLMR                                 |
    | Minimum proposal deposit |                                    {{ networks.moonbeam.democracy.min_deposit}} GLMR                                    |

=== "Moonriver"
    |         Variable         |                                                           Value                                                           |
    |:------------------------:|:-------------------------------------------------------------------------------------------------------------------------:|
    |      Launch period       | {{ networks.moonriver.democracy.launch_period.blocks}} blocks ({{ networks.moonriver.democracy.launch_period.days}} days) |
    |     Cool-off period      |   {{ networks.moonriver.democracy.cool_period.blocks}} blocks ({{ networks.moonriver.democracy.cool_period.days}} days)   |
    | Minimum preimage deposit |                                 {{ networks.moonriver.democracy.min_preim_deposit}} MOVR                                  |
    | Minimum proposal deposit |                                    {{ networks.moonriver.democracy.min_deposit}} MOVR                                     |

=== "Moonbase Alpha"
    |         Variable         |                                                          Value                                                          |
    |:------------------------:|:-----------------------------------------------------------------------------------------------------------------------:|
    |      Launch period       | {{ networks.moonbase.democracy.launch_period.blocks}} blocks ({{ networks.moonbase.democracy.launch_period.days}} days) |
    |     Cool-off period      |   {{ networks.moonbase.democracy.cool_period.blocks}} blocks ({{ networks.moonbase.democracy.cool_period.days}} days)   |
    | Minimum preimage deposit |                                 {{ networks.moonbase.democracy.min_preim_deposit}} DEV                                  |
    | Minimum proposal deposit |                                    {{ networks.moonbase.democracy.min_deposit}} DEV                                     |


This guide will show you how to submit a proposal on Moonbase Alpha. It can be adapted for Moonbeam or Moonriver.

## Roadmap of a Proposal {: #roadmap-of-a-proposal } 

--8<-- 'text/governance/roadmap.md'

## Submitting your Idea to the Forum {: #submitting-your-idea-to-the-forum }

It's highly recommended that you preface any proposal with a post on [Moonbeam's Community Forum](https://forum.moonbeam.foundation/){target=_blank}. You should allow a period of five days for the community to provide feedback on the Moonbeam Forum post before proceeding to submit the preimage and proposal.

To access the Moonbeam Community Forum, you must be a member of the [Moonbeam Discord](https://discord.com/invite/PfpUATX){target=_blank} community. You can then sign up to get access to the forum using your Discord credentials.

Once you’re logged in, you can explore the latest discussions, join conversations, and create your own discussion for a proposal idea you may have. Before posting or commenting for the first time, be sure to familiarize yourself with the [FAQ](https://forum.moonbeam.foundation/faq){target=_blank} to learn about the community guidelines.

![Moonbeam Forum Home](/images/tokens/governance/treasury-proposals/treasury-proposal-1.png)

When you're ready to create a post with the details of your proposal, you can head to the **Governance** page and click on **Democracy Proposals**.

![Governance page on Moonbeam Forum](/images/tokens/governance/proposals/proposals-1.png)

From there, you can click on **Open Draft** and begin to draft your proposal using the template provided. Make sure to update the title of the post and add any of the optional tags, such as **Moonbeam** if the proposal is for the Moonbeam network. The title should follow the format as the pre-populated title: [Proposal: XX][Status: Idea] proposal title. For example, [Proposal: XX][Status: Idea] Register XC-20 xcMYTOK. The XX will need to be updated with the proposal ID once the proposal has been formally submitted on-chain.

![Add a proposal to the Moonbeam Forum](/images/tokens/governance/proposals/proposals-2.png)

After you've filled out your proposal details, you can click **Create Topic** to save it to the forum and open the discussion on your idea. Based on the feedback you receive, you can update the proposal before proceeding to submit it.

## Proposing an Action {: #proposing-an-action } 

This section goes over the process of creating a proposal, from submitting a preimage until it reaches public referenda. Instead of making a generic example, this guide will actually create a real proposal that will serve as a base for this guide and others.

To make a proposal in the network, you can use the Polkadot.js Apps interface. To do so, you need to import an Ethereum-style account first (H160 address), which you can do following the [Creating or Importing an H160 Account](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank} guide. For this example, three accounts were imported and named with super original names: Alice, Bob, and Charlie.

![Accounts in Polkadot.js](/images/tokens/governance/proposals/proposals-3.png)

This proposal is to make permanent on-chain the remark "This is a unique string."

### Submitting a Preimage of the Proposal {: #submitting-a-preimage-of-the-proposal } 

The first step is to submit a preimage of the proposal. This is because the storage cost of large preimages can be pretty hefty, as the preimage contains all the information regarding the proposal itself. With this configuration, one account with more funds can submit a preimage and another account can submit the proposal.

Everything related to governance lives under the **Governance** tab, including preimages. So, from the **Governance** dropdown, you can select **Preimages**. Once there, click on the **Add preimage** button.

![Add preimage in Polkadot.js](/images/tokens/governance/proposals/proposals-4.png)

Here, you need to provide the following information:

 1. Select the account from which you want to submit the preimage
 2. Choose the pallet you want to interact with and the dispatchable function (or action) to propose. The action you choose will determine the fields that need to fill in the following steps. In this case, it is the `system` pallet and the `remark` function
 3. Enter the text of the remark in either ascii or hexidecimal format prefixed with "0x". Ensure the remark is unique. "Hello World!" has already been proposed, and duplicate identical proposals will not be accepted. These remarks reside permanently on-chain so please don't enter sensitive information or profanity 
 4. Copy the preimage hash. This represents the proposal. You will use this hash when submitting the actual proposal
 5. Click the **Submit preimage** button and sign the transaction

![Fill in the Preimage Information](/images/tokens/governance/proposals/proposals-5.png)

!!! note
    Make sure you copy the preimage hash, as it is necessary to submit the proposal.

Note that the storage cost of the preimage is displayed at the bottom left corner of this window. After the transaction is submitted, you will see some confirmations on the top right corner of the Polkadot.js Apps interface and the preimage will be added to the list of **preimages**.

### Submitting a Proposal {: #submitting-a-proposal } 

Once you have committed the preimage (check the previous section), the roadmap's next major milestone is to submit the proposal related to it. To do so, select **Democracy** from the **Governance** dropdown, and click on **Submit proposal**.

![Submit proposal](/images/tokens/governance/proposals/proposals-6.png)

Here, you need to provide the following information:

 1. Select the account from which you want to submit the proposal (in this case, Alice)
 2. Enter the preimage hash related to the proposal. In this example, it is the hash of the `remark` preimage from the previous section
 3. Set the locked balance. This is the number of tokens the proposer bonds with his proposal. Remember that the proposal with the most amount of tokens locked goes to referendum. The minimum deposit is displayed just below this input tab
 4. Click the **Submit proposal** button and sign the transaction

![Fill in the Proposal Information](/images/tokens/governance/proposals/proposals-7.png)

!!! note
    Tokens might be locked for an indeterminate amount of time because it is unknown when a proposal may become a referendum (if ever).

After the transaction is submitted, you will see some confirmations on the top right corner of the Polkadot.js Apps interface. You should also see the proposal listed in the **Proposals** section, displaying the proposer and the amounts of tokens locked, and it is now ready to be seconded!

If you login to [Polkassembly](https://moonbeam.polkassembly.network/){target=_blank} with the same account that you used to create the proposal, you'll be able to edit the description of the proposal to include a link to the proposal discussion on the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=_blank}. This is a helpful step because while Polkassembly auto-generates a post for each proposal, it doesn't provide context information on the contents of the proposal. 

You’ll need to edit your proposal on the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=_blank}. You will need to update the title to include the proposal ID, and the status will need to be changed to `Submitted` state.

### Seconding a Proposal {: #seconding-a-proposal } 

To second a proposal means that you agree with it and want to back it up with your tokens to help it reach public referenda. The amount of tokens to be locked is equal to the proposer's original deposit - no more, no less.

!!! note
    A single account can second a proposal multiple times. This is by design, as an account could just send tokens to different addresses and use them to second the proposal. What counts is the number of tokens backing up a proposal, not the number of vouches it has received.

This section outlines the steps to second the proposal made in the previous section. To do so, click the **Endorse** button that is located to the right of the respective proposal.

![Proposal listed to Second](/images/tokens/governance/proposals/proposals-8.png)

Here, you need to provide the following information:

 1. Select the account you want to second the proposal with (in this case, Charlie)
 2. Verify the number of tokens required to second the proposal
 3. Click the **Endorse** button and sign the transaction

![Fill in Endorse Information](/images/tokens/governance/proposals/proposals-9.png)

!!! note
    Tokens might be locked for an indeterminate amount of time because it is unknown when a proposal may become a referendum (if ever)

After the transaction is submitted, you will see some confirmations on the top right corner of the Polkadot.js Apps interface. You should also see the proposal listed in the **Proposals** section, displaying the proposer and the amounts of tokens locked and listing the users that have seconded this proposal!

![Proposal Endorsed](/images/tokens/governance/proposals/proposals-10.png)