---
title: How to Propose an Action in OpenGov
description: Follow these step-by-step instructions to learn how to submit a Democracy proposal for other token holders to vote on in Governance v2 (OpenGov) on Moonbeam. 
---

# How to Propose an Action in OpenGov (Governance v2)

## Introduction {: #introduction }

A proposal is a submission to the chain in which a token holder suggests for an action to be enacted by the system. Proposals are one of the core elements of the governance system because they are the main tool for community members to propose actions/changes, which other token holders then vote on.

In Moonbeam, users are able to create and vote on proposals using their H160 address and private key, that is, their regular Ethereum account!

This guide will outline the process, with step-by-step instructions, of how to submit a proposal for other token holders to vote on in OpenGov (Governance v2). This guide will show you how to submit the proposal on Moonbase Alpha, but it can be easily adapted for Moonbeam and Moonriver. There is a separate guide on [How to Vote on a Proposal in OpenGov](/tokens/governance/voting/){target=\_blank}.

For more information on Moonbeam's governance system, please refer to the [Governance on Moonbeam](/learn/features/governance/){target=\_blank} overview page.

## Definitions {: #definitions }

Some of the key parameters for this guide are the following:

--8<-- 'text/learn/features/governance/proposal-definitions.md'

--8<-- 'text/learn/features/governance/preimage-definitions.md'

 - **Submission Deposit** - the minimum deposit amount for submitting a public referendum proposal

--8<-- 'text/learn/features/governance/lead-in-definitions.md'

Make sure you check the [Governance Parameters](/learn/features/governance/#governance-parameters-v2){target=\_blank} for each network and track.

## Roadmap of a Proposal {: #roadmap-of-a-proposal }

This guide will cover the first few steps outlined in the proposal roadmap, as highlighted in the diagram below. You'll learn how to submit your proposal idea to the [Moonbeam Community Forum](https://forum.moonbeam.foundation){target=\_blank}, submit a preimage, and submit your proposal on-chain using the preimage hash.

You can find a full explanation in the [Roadmap of a Proposal](/learn/features/governance/#roadmap-of-a-proposal-v2){target=\_blank} section on the Governance overview page.

![Proposal Roadmap](/images/tokens/governance/proposals/proposals-roadmap.webp)

## Submit your Idea to the Community Forum {: #submitting-your-idea-to-the-forum }

Before diving into the steps for submitting a proposal, you'll want to get familiar with [Moonbeam's Community Forum](https://forum.moonbeam.foundation){target=\_blank}. It's highly recommended that you preface any proposal with a post on the forum to solicit feedback. You should allow a period of five days for the community to discuss and provide feedback on the Moonbeam Forum post before proceeding to submit the preimage and proposal.

To access the Moonbeam Community Forum, you must be a member of the [Moonbeam Discord](https://discord.com/invite/PfpUATX){target=\_blank} community. You can then sign up to get access to the forum using your Discord credentials.

Once you’re logged in, you can explore the latest discussions, join conversations, and create your own discussion for a proposal idea you may have. Before posting or commenting for the first time, be sure to familiarize yourself with the [FAQ](https://forum.moonbeam.foundation/faq){target=\_blank} to learn about the community guidelines.

![Moonbeam Forum Home](/images/tokens/governance/treasury-proposals/treasury-proposal-1.webp)

When you're ready to create a post with the details of your proposal, you can head to the **Governance** page and click on **Democracy Proposals**.

![Governance page on Moonbeam Forum](/images/tokens/governance/proposals/proposals-1.webp)

From there, you can click on **Open Draft** and begin to draft your proposal using the template provided. Make sure to update the title of the post and add any of the optional tags, such as **Moonbeam** if the proposal is for the Moonbeam network. The title should follow the format as the pre-populated title: [Proposal: XX][Status: Idea] proposal title. For example, [Proposal: XX][Status: Idea] Register XC-20 xcMYTOK. The XX will need to be updated with the proposal ID once the proposal has been formally submitted on-chain.

![Add a proposal to the Moonbeam Forum](/images/tokens/governance/proposals/proposals-2.webp)

After you've filled out your proposal details, you can click **Create Topic** to save it to the forum and open the discussion on your idea. Based on the feedback you receive, you can update the proposal before proceeding to submit it.

## Proposing an Action {: #proposing-an-action }

This section goes over the process of creating a proposal with OpenGov (Governance v2) on Moonbase Alpha. These steps can be adapted for Moonbeam and Moonriver.

To make a proposal in the network, you can use the Polkadot.js Apps interface. To do so, you need to import an Ethereum-style account first (H160 address), which you can do following the [Creating or Importing an H160 Account](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=\_blank} guide. For this example, three accounts were imported and named with super original names: Alice, Bob, and Charlie.

![Accounts in Polkadot.js](/images/tokens/governance/proposals/proposals-3.webp)

For the proposal, you can choose anything you would like to propose, just make sure that you assign it to the right Origin and Track, so that it has the right privileges to execute the action.

For the purposes of this guide, the action will be to set an on-chain remark using the General Admin Origin and Track.

### Submitting a Preimage of the Proposal {: #submitting-a-preimage-of-the-proposal }

The first step is to submit a preimage of the proposal. This is because the storage cost of large preimages can be pretty hefty, as the preimage contains all the information regarding the proposal itself. With this configuration, one account with more funds can submit a preimage and another account can submit the proposal.

First, navigate to [Moonbase Alpha's Polkadot.js Apps interface](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network){target=\_blank}. Everything related to governance lives under the **Governance** tab, including preimages. So, from the **Governance** dropdown, you can select **Preimages**. Once there, click on the **Add preimage** button.

![Add preimage in Polkadot.js](/images/tokens/governance/proposals/proposals-4.webp)

Here, you need to provide the following information:

 1. Select the account from which you want to submit the preimage
 2. Choose the pallet you want to interact with and the dispatchable function (or action) to propose. The action you choose will determine the fields that need to fill in the following steps. In this case, it is the **system** pallet and the **remark** extrinsic
 3. Enter any additional fields required for the extrinsic to be dispatched. For this example, you can enter the remark in hex or ascii format
 4. Copy the preimage hash. This represents the proposal. You will use this hash when submitting the actual proposal
 5. Click the **Submit preimage** button and sign the transaction

![Fill in the Preimage Information](/images/tokens/governance/proposals/proposals-5.webp)

!!! note
    Make sure you copy the preimage hash, as it is necessary to submit the proposal.

Note that the storage cost of the preimage can be calculated as the base fee (per network) plus the fee per byte of the preimage being proposed.

After the transaction is submitted, you will see some confirmations on the top right corner of the Polkadot.js Apps interface and the preimage will be added to the list of **preimages**.

### Submitting a Proposal {: #submitting-a-proposal-v2 }

Once you have committed the preimage (check the previous section), the roadmap's next major milestone is to submit the proposal related to it. To do so, select **Referenda** from the **Governance** dropdown, and click on **Submit proposal**.

In order to submit a proposal, you'll need to choose which Origin class you want your proposal to be executed with. **Choosing the wrong Track/Origin might result in your proposal failing at execution**. For more information on each Origin class, please refer to the [General Definitions](/learn/features/governance/#general-definitions-gov2){target=\_blank} section on the Governance on Moonbeam overview page.

![Submit proposal](/images/tokens/governance/proposals/proposals-6.webp)

Here, you need to provide the following information:

 1. Select the account from which you want to submit the proposal (in this case, Alice)
 2. Choose the Track to submit the proposal to. The Origin associated with the Track will need to have enough authority to execute the proposed action. For this example, to add an on-chain remark, you can select **2 / General Admin** from the **submission track** dropdown
 3. In the **origin** dropdown, choose **Origins**
 4. In the **Origins** dropdown, select the Origin, which in this case is **GeneralAdmin**
 5. Enter the preimage hash related to the proposal. In this example, it is the hash of the `system.remark` preimage from the previous section
 6. Choose the moment of enactment, either after a specific number of blocks, or at a specific block. It must meet the minimum Enactment Period, which you can find in OpenGov's [Governance Parameters](/learn/features/governance/#governance-parameters-v2)
 7. Enter the number of blocks or the specific block to enact the proposal at
 8. Click **Submit proposal** and sign the transaction

![Fill in the Proposal Information](/images/tokens/governance/proposals/proposals-7.webp)

!!! note
    Tokens might be locked for an indeterminate amount of time because it is unknown when a proposal may become a referendum (if ever).

After the transaction is submitted, you will see some confirmations on the top right corner of the Polkadot.js Apps interface. You should also see the proposal listed in the associated Origin section, displaying the proposed action, proposer, and more.

If you login to [Polkassembly](https://moonbeam.polkassembly.io/opengov){target=\_blank} with the same account that you used to create the proposal, you'll be able to edit the description of the proposal to include a link to the proposal discussion on the [Moonbeam Community Forum](https://forum.moonbeam.foundation){target=\_blank}. This is a helpful step because while Polkassembly auto-generates a post for each proposal, it doesn't provide context information on the contents of the proposal.

The proposal is now in the Lead-in Period and is ready to be voted on! In order for your proposal to progress out of the Lead-in Period to the next phase, at a minimum the Prepare Period will need to pass so there is enough time for the proposal to be discussed, there will need to be enough Capacity in the chosen Track, and the Decision Deposit will need to be submitted. The deposit can be paid by any token holder. If there isn't enough Capacity or the Decision Deposit hasn't been submitted, but the Prepare Period has passed, the proposal will remain in the Lead-in Period until all of the criteria is met.

To learn how to vote on a proposal, please refer to the [How to Vote on a Proposal in OpenGov](/tokens/governance/voting/){target=\_blank} guide.
