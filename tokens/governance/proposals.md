---
title: Propose an Action
description: How to send a proposal to be voted on Moonbeam via governance features
---

# How to Propose an Action

![Governance Moonbeam Banner](/images/tokens/governance/proposals/governance-proposal-banner.png)

## Introduction {: #introduction } 

As mentioned in the [governance overview page](/learn/features/governance/#definitions), a proposal is a submission to the chain in which a token holder suggests for an action to be enacted by the system.

Proposals are one of the core elements of the governance system because they are the main tool for stakeholders to propose actions/changes, which other stakeholders then vote on.

In Moonbeam, users will be able to create, second, and vote on proposals using their H160 address and private key, that is, their regular Ethereum account!

With the release of [Moonbase Alpha v6](https://github.com/PureStake/moonbeam/releases/tag/v0.6.0), users of the network can now submit proposals for public referenda in the TestNet. This guide outlines the process of how to create a proposal. The steps will go from its creation until it reaches public referenda. You can find a guide on how to vote on a proposal [here](/tokens/governance/voting/).

More information can be found in Polkadot's Wiki pages related to [Governance](https://wiki.polkadot.network/docs/learn-governance#council) and [Participate in Democracy](https://wiki.polkadot.network/docs/maintain-guides-democracy).

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

=== "Moonbase Alpha"
    |         Variable         |  |                                                          Value                                                          |
    |:------------------------:|::|:-----------------------------------------------------------------------------------------------------------------------:|
    |      Launch Period       |  | {{ networks.moonbase.democracy.launch_period.blocks}} blocks ({{ networks.moonbase.democracy.launch_period.days}} days) |
    |     Cool-off Period      |  |   {{ networks.moonbase.democracy.cool_period.blocks}} blocks ({{ networks.moonbase.democracy.cool_period.days}} days)   |
    | Minimum Preimage Deposit |  |                                 {{ networks.moonbase.democracy.min_preim_deposit}} DEV                                  |
    | Minimum Proposal Deposit |  |                                    {{ networks.moonbase.democracy.min_deposit}} DEV                                     |

=== "Moonriver"
    |         Variable         |  |                                                           Value                                                           |
    |:------------------------:|::|:-------------------------------------------------------------------------------------------------------------------------:|
    |      Launch Period       |  | {{ networks.moonriver.democracy.launch_period.blocks}} blocks ({{ networks.moonriver.democracy.launch_period.days}} days) |
    |     Cool-off Period      |  |   {{ networks.moonriver.democracy.cool_period.blocks}} blocks ({{ networks.moonriver.democracy.cool_period.days}} days)   |
    | Minimum Preimage Deposit |  |                                  {{ networks.moonriver.democracy.min_preim_deposit}} MOVR                                 |
    | Minimum Proposal Deposit |  |                                     {{ networks.moonriver.democracy.min_deposit}} MOVR                                    |

This guide will show you how to submit a proposal on Moonbase Alpha.

## Roadmap of a Proposal {: #roadmap-of-a-proposal } 

--8<-- 'text/governance/roadmap.md'

## Proposing an Action {: #proposing-an-action } 

This section goes over the process of creating a proposal, from a preimage until it reaches public referenda. Instead of making a generic example, this guide will actually create a real proposal that will serve as a base for this guide and others.

To make a proposal in the network, you need to use the Polkadot.js Apps interface. To do so, you need import an Ethereum-style account first (H160 address), which you can do following [this guide](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account). For this example, three accounts were imported and named with super original names: Alice, Bob, and Charley.

![Accounts in Polkadot.js](/images/tokens/governance/proposals/proposals-1.png)

This proposal is to make permanent on-chain the remark "This is a unique string."

### Submitting a Preimage of the Proposal {: #submitting-a-preimage-of-the-proposal } 

The first step is to submit a preimage of the proposal. This is because the storage cost of large preimages can be pretty hefty, as the preimage contains all the information regarding the proposal itself. With this configuration, one account with more funds can submit a preimage and another account can submit the proposal.

Everything related to governance lives under the "Democracy" tab. Once there, click on the "Submit preimage" button.

![Submit Preimage](/images/tokens/governance/proposals/proposals-2.png)

Here, you need to provide the following information:

 1. Select the account from which you want to submit the preimage
 2. Choose the pallet you want to interact with and the dispatchable function (or action) to propose. The action you choose will determine the fields that need to fill in the following steps. In this case, it is the `system` pallet and the `remark` function
 3. Enter the text of the remark in either ascii or hexidecimal format prefixed with "0x". Ensure the remark is unique. "Hello World!" has already been proposed, and duplicate identical proposals will not be accepted. These remarks reside permanently on-chain so please don't enter sensitive information or profanity 
 4. Copy the preimage hash. This represents the proposal. You will use this hash when submitting the actual proposal
 5. Click the "Submit preimage" button and sign the transaction

![Fill in the Preimage Information](/images/tokens/governance/proposals/proposals-3.png)

!!! note
    Make sure you copy the preimage hash, as it is necessary to submit the proposal.

Note that the storage cost of the preimage is displayed at the bottom left corner of this window. After the transaction is submitted, you will see some confirmations on the top right corner of the Polkadot.js Apps interface, but nothing will have changed in the main democracy screen. However, don't worry. If the transaction is confirmed, the preimage has been submitted.

### Submitting a Proposal {: #submitting-a-proposal } 

Once you have committed the preimage (check the previous section), the roadmap's next major milestone is to submit the proposal related to it. To do so, in the main democracy screen, click on "Submit proposal."

![Submit proposal](/images/tokens/governance/proposals/proposals-4.png)

Here, you need to provide the following information:

 1. Select the account from which you want to submit the proposal (in this case, Alice)
 2. Enter the preimage hash related to the proposal. In this example, it is the hash of the `remark` preimage from the previous section
 3. Set the locked balance. This is the number of tokens the proposer bonds with his proposal. Remember that the proposal with the most amount of tokens locked goes to referendum. The minimum deposit is displayed just below this input tab
 4. Click the "Submit proposal" button and sign the transaction

![Fill in the Proposal Information](/images/tokens/governance/proposals/proposals-5.png)

!!! note
    Tokens might be locked for an indeterminate amount of time because it is unknown when a proposal may become a referendum (if ever).

After the transaction is submitted, you will see some confirmations on the top right corner of the Polkadot.js Apps interface. You should also see the proposal listed in the "Proposals" section, displaying the proposer and the amounts of tokens locked, and it is now ready to be seconded!

![Proposal listed](/images/tokens/governance/proposals/proposals-6.png)

### Seconding a Proposal {: #seconding-a-proposal } 

To second a proposal means that you agree with it and want to back it up with your tokens to help it reach public referenda. The amount of tokens to be locked is equal to the proposer's original deposit - no more, no less.

!!! note
    A single account can second a proposal multiple times. This is by design, as an account could just send tokens to different addresses and use them to second the proposal. What counts is the number of tokens backing up a proposal, not the number of vouches it has received.

This section outlines the steps to second the proposal made in the previous section. To do so, click the "Second" button that is located to the right of the respective proposal.

![Proposal listed to Second](/images/tokens/governance/proposals/proposals-7.png)

Here, you need to provide the following information:

 1. Select the account you want to second the proposal with (in this case, Charley)
 2. Verify the number of tokens required to second the proposal
 3. Click the "Second" button and sign the transaction

![Fill in Second Information](/images/tokens/governance/proposals/proposals-8.png)

!!! note
    Tokens might be locked for an indeterminate amount of time because it is unknown when a proposal may become a referendum (if ever)

After the transaction is submitted, you will see some confirmations on the top right corner of the Polkadot.js Apps interface. You should also see the proposal listed in the "Proposals" section, displaying the proposer and the amounts of tokens locked and listing the users that have seconded this proposal!

![Proposal Seconded](/images/tokens/governance/proposals/proposals-9.png)

