---
title: How to Propose an Action
description: Learn about the roadmap of a proposal and how to propose an action, send it to be voted on, and second a proposal on Moonbeam via Governance v1 features.
---

# How to Propose an Action in Governance v1

## Introduction {: #introduction } 

A proposal is a submission to the chain in which a token holder suggests for an action to be enacted by the system. Proposals are one of the core elements of the governance system because they are the main tool for stakeholders to propose actions/changes, which other stakeholders then vote on.

In Moonbeam, users will be able to create, second, and vote on proposals using their H160 address and private key, that is, their regular Ethereum account!

Moonbeam's governance system is in the process of getting revamped! This next phase of governance is known as OpenGov or Governance v2. During the roll-out process, OpenGov will be rigorously tested on Moonriver before a proposal will be made to deploy it on Moonbeam. Until it launches on Moonbeam, Moonbeam will continue to use Governance v1. As such, **this guide is for proposals on Moonbeam only**. If you're looking to submit a proposal on Moonriver, you can refer to the [How to Propose an Action in OpenGov](/tokens/governance/proposals/opengov-proposals){target=_blank} guide.

This guide outlines the process of how to create a proposal in Governance v1 on Moonbeam. The steps will go from its creation until it reaches public referenda. There is a separate guide on [How to Vote on a Proposal](/tokens/governance/voting/voting){target=_blank} in Governance v1. 

For more information on Moonbeam's governance system, including Governance v1 and OpenGov (Governance v2), please refer to the [governance overview page](/learn/features/governance/){target=_blank}.

## Definitions {: #definitions } 

Some of the key parameters for this guide are the following:

--8<-- 'text/governance/proposal-definitions.md'

 - **Second** - other stakeholders can second (approve) a proposal if they agree with it and want to help it reach public referenda. This requires matching the deposit of the original proposer

--8<-- 'text/governance/preimage-definitions.md'

 - **Proposal deposit** — minimum amount of tokens that the proposer needs to bond when submitting a proposal. Tokens might be locked for an indeterminate amount of time because it is unknown when a proposal may become a referendum (if ever). This is true for tokens bonded by both the proposer and users that second the proposal
 - **Launch Period** — how often new public referenda are launched
 - **Cool-off Period** — duration (in blocks) in which a proposal may not be re-submitted after being vetoed

=== "Moonbeam"
    |         Variable          |                                                          Value                                                          |
    |:-------------------------:|:-----------------------------------------------------------------------------------------------------------------------:|
    |   Preimage base deposit   |                                   {{ networks.moonbeam.preimage.base_deposit }} GLMR                                    |
    | Preimage deposit per byte |                                   {{ networks.moonbeam.preimage.byte_deposit }} GLMR                                    |
    |     Proposal deposit      |                                   {{ networks.moonbeam.democracy.min_deposit }} GLMR                                    |
    |       Launch Period       | {{ networks.moonbeam.democracy.launch_period.blocks}} blocks ({{ networks.moonbeam.democracy.launch_period.days}} days) |
    |      Cool-off Period      |   {{ networks.moonbeam.democracy.cool_period.blocks}} blocks ({{ networks.moonbeam.democracy.cool_period.days}} days)   |

## Roadmap of a Proposal {: #roadmap-of-a-proposal } 

This guide will cover the first few steps outlined in the proposal roadmap, as highlighted in the diagram below. You'll learn how to submit your proposal idea to the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=_blank}, submit a preimage, submit your proposal on-chain using the preimage hash, and finally how to second a proposal.

You can find a full explanation of the [happy path for a Governance v1 proposal on the Governance overview page](/learn/features/governance/#roadmap-of-a-proposal){target=_blank}.

![Proposal Roadmap](/images/tokens/governance/proposals/v1/proposal-roadmap.png)

--8<-- 'text/governance/submit-idea.md'

## Proposing an Action {: #proposing-an-action }

This section goes over the process of creating a proposal on Moonbeam with Governance v1, from submitting a preimage until it reaches public referenda.

!!! note
    The images in this guide are shown on the Moonbase Alpha interface on Polkadot.js Apps, however these steps will need to be performed on [Moonbeam's Polkadot.js Apps interface](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network){target=_blank}.

To make a proposal in the network, you can use the Polkadot.js Apps interface. To do so, you need to import an Ethereum-style account first (H160 address), which you can do following the [Creating or Importing an H160 Account](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank} guide. For this example, three accounts were imported and named with super original names: Alice, Bob, and Charlie.

![Accounts in Polkadot.js](/images/tokens/governance/proposals/v1/proposals-3.png)

This proposal is to make permanent on-chain the remark "This is a unique string."

### Submitting a Preimage of the Proposal {: #submitting-a-preimage-of-the-proposal } 

The first step is to submit a preimage of the proposal. This is because the storage cost of large preimages can be pretty hefty, as the preimage contains all the information regarding the proposal itself. With this configuration, one account with more funds can submit a preimage and another account can submit the proposal.

First, navigate to [Moonbeam's Polkadot.js Apps interface](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network){target=_blank}. Everything related to governance lives under the **Governance** tab, including preimages. So, from the **Governance** dropdown, you can select **Preimages**. Once there, click on the **Add preimage** button.

![Add preimage in Polkadot.js](/images/tokens/governance/proposals/v1/proposals-4.png)

Here, you need to provide the following information:

 1. Select the account from which you want to submit the preimage
 2. Choose the pallet you want to interact with and the dispatchable function (or action) to propose. The action you choose will determine the fields that need to fill in the following steps. In this case, it is the `system` pallet and the `remark` function
 3. Enter the text of the remark in either ascii or hexidecimal format prefixed with "0x". Ensure the remark is unique. "Hello World!" has already been proposed, and duplicate identical proposals will not be accepted. These remarks reside permanently on-chain so please don't enter sensitive information or profanity 
 4. Copy the preimage hash. This represents the proposal. You will use this hash when submitting the actual proposal
 5. Click the **Submit preimage** button and sign the transaction

![Fill in the Preimage Information](/images/tokens/governance/proposals/v1/proposals-5.png)

!!! note
    Make sure you copy the preimage hash, as it is necessary to submit the proposal.

Note that the storage cost of the preimage can be calculated as the base fee (per network) plus the fee per byte of the preimage being proposed. 

After the transaction is submitted, you will see some confirmations on the top right corner of the Polkadot.js Apps interface and the preimage will be added to the list of **preimages**.

### Submitting a Proposal {: #submitting-a-proposal } 

Once you have committed the preimage (check the previous section), the roadmap's next major milestone is to submit the proposal related to it. To do so, select **Democracy** from the **Governance** dropdown, and click on **Submit proposal**.

![Submit proposal](/images/tokens/governance/proposals/v1/proposals-6.png)

Here, you need to provide the following information:

 1. Select the account from which you want to submit the proposal (in this case, Alice)
 2. Enter the preimage hash related to the proposal. In this example, it is the hash of the `remark` preimage from the previous section
 3. Set the locked balance. This is the number of tokens the proposer bonds with his proposal. Remember that the proposal with the most amount of tokens locked goes to referendum. The minimum deposit is displayed just below this input tab
 4. Click the **Submit proposal** button and sign the transaction

![Fill in the Proposal Information](/images/tokens/governance/proposals/v1/proposals-7.png)

!!! note
    Tokens might be locked for an indeterminate amount of time because it is unknown when a proposal may become a referendum (if ever).

After the transaction is submitted, you will see some confirmations on the top right corner of the Polkadot.js Apps interface. You should also see the proposal listed in the **Proposals** section, displaying the proposer and the amounts of tokens locked, and it is now ready to be seconded!

If you login to [Polkassembly](https://moonbeam.polkassembly.network/){target=_blank} with the same account that you used to create the proposal, you'll be able to edit the description of the proposal to include a link to the proposal discussion on the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=_blank}. This is a helpful step because while Polkassembly auto-generates a post for each proposal, it doesn't provide context information on the contents of the proposal. 

You’ll need to edit your proposal on the [Moonbeam Community Forum](https://forum.moonbeam.foundation/){target=_blank}. You will need to update the title to include the proposal ID, and the status will need to be changed to `Submitted` state.

## Seconding a Proposal {: #seconding-a-proposal } 

To second a proposal means that you agree with it and want to back it up with your tokens to help it reach public referenda. The amount of tokens to be locked is equal to the proposer's original deposit - no more, no less.

!!! note
    A single account can second a proposal multiple times. This is by design, as an account could just send tokens to different addresses and use them to second the proposal. What counts is the number of tokens backing up a proposal, not the number of vouches it has received.

This section outlines the steps to second the proposal made in the previous section. To do so, click the **Endorse** button that is located to the right of the respective proposal.

![Proposal listed to Second](/images/tokens/governance/proposals/v1/proposals-8.png)

Here, you need to provide the following information:

 1. Select the account you want to second the proposal with (in this case, Charlie)
 2. Verify the number of tokens required to second the proposal
 3. Click the **Endorse** button and sign the transaction

![Fill in Endorse Information](/images/tokens/governance/proposals/v1/proposals-9.png)

!!! note
    Tokens might be locked for an indeterminate amount of time because it is unknown when a proposal may become a referendum (if ever).

After the transaction is submitted, you will see some confirmations on the top right corner of the Polkadot.js Apps interface. You should also see the proposal listed in the **Proposals** section, displaying the proposer and the amounts of tokens locked and listing the users that have seconded this proposal!

![Proposal Endorsed](/images/tokens/governance/proposals/v1/proposals-10.png)

At each Launch Period, the most seconded proposal becomes a referendum. To learn how to vote on a proposal, please refer to the [How to Vote on a Proposal](/tokens/governance/voting/voting){target=_blank} guide.