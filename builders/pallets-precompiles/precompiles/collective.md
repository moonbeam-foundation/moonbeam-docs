---
title:  Collective Precompile Contract
description: Learn how to use the Moonbeam Collective Precompile to perform democracy functions through any of the collectives on Moonbeam, such as the Treasury Council.
keywords: solidity, ethereum, collective, proposal, council technical, committee, moonbeam, precompiled, contracts
---

# Interacting with the Collective Precompile

## Introduction {: #introduction }

The Collective Precompile enables a user to directly interact with [Substrate's collective pallet](https://paritytech.github.io/substrate/master/pallet_collective/index.html){target=_blank} directly from a Solidity interface.

A collective is a group of members that are responsible for specific democracy-related actions such as proposing, voting on, executing, and closing motions. Each can execute different actions with different origins. Consequently, collectives can be created with very specific scopes. For example, Moonriver has four collectives: the Council collective, the Technical Committee collective, the Treasury Council collective, and the OpenGov Technical Committee collective (for whitelisting OpenGov proposals). As such, there is a precompile for each collective. For more information on the Council, Technical Committee, and OpenGov Technical Committee please refer to the [Governance on Moonbeam](/learn/features/governance/){target=_blank} page, and for more information on the Treasury Council, please refer to the [Treasury on Moonbeam](/learn/features/treasury/){target=_blank} page.

This guide will show you how to propose, vote on, and close a proposal using the Collective Precompile.

The Collective Precompiles are located at the following addresses:

=== "Moonbeam"
     |     Collective      |                           Address                            |
     |:-------------------:|:------------------------------------------------------------:|
     |       Council       |    {{networks.moonbeam.precompiles.collective_council }}     |
     | Technical Committee | {{networks.moonbeam.precompiles.collective_tech_committee }} |
     |  Treasury Council   |    {{networks.moonbeam.precompiles.collective_treasury }}    |

=== "Moonriver"
     |         Collective          |                                Address                                |
     |:---------------------------:|:---------------------------------------------------------------------:|
     |           Council           |        {{networks.moonriver.precompiles.collective_council }}         |
     |     Technical Committee     |     {{networks.moonriver.precompiles.collective_tech_committee }}     |
     |      Treasury Council       |        {{networks.moonriver.precompiles.collective_treasury }}        |
     | OpenGov Technical Committee | {{networks.moonriver.precompiles.collective_opengov_tech_committee }} |

=== "Moonbase Alpha"
     |         Collective          |                               Address                                |
     |:---------------------------:|:--------------------------------------------------------------------:|
     |           Council           |        {{networks.moonbase.precompiles.collective_council }}         |
     |     Technical Committee     |     {{networks.moonbase.precompiles.collective_tech_committee }}     |
     |      Treasury Council       |        {{networks.moonbase.precompiles.collective_treasury }}        |
     | OpenGov Technical Committee | {{networks.moonbase.precompiles.collective_opengov_tech_committee }} |

--8<-- 'text/builders/pallets-precompiles/precompiles/security.md'

## The Collective Solidity Interface {: #the-call-permit-interface }

[`Collective.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank} is a Solidity interface that allows developers to interact with the precompile's five methods.

The interface includes the following functions:

- **execute**(*bytes memory* proposal) - executes a proposal as a single member of the collective. The sender must be a member of the collective. This will *not* revert if the Substrate proposal is dispatched but fails
- **propose**(*uint32* threshold, *bytes memory* proposal) - adds a new proposal to be voted on. The sender must be a member of the collective. If the threshold is less than two then the proposal will be dispatched and executed directly, with the proposer as dispatcher. If the threshold is met, the index of the new proposal is returned
- **vote**(*bytes32* proposalHash, *uint32* proposalIndex, *bool* approve) - votes on a proposal. The sender must be a member of the collective
- **close**(*bytes32* proposalHash, *uint32* proposalIndex, *uint64* proposalWeightBound, *uint32* lengthBound) - closes a proposal. Can be called by anyone once there are enough votes. Returns a boolean indicating whether the proposal was executed or removed
- **proposalHash**(*bytes memory* proposal) - computes the hash of a proposal

Where the inputs that need to be provided can be defined as:

- **proposal** - the [SCALE encoded](https://docs.substrate.io/reference/scale-codec/){target=_blank} Substrate call that proposes an action
- **threshold** - amount of members required to dispatch the proposal
- **proposalHash** - the hash of the proposal
- **proposalIndex** - the index of the proposal
- **approve** - the vote to approve the proposal or not
- **proposalWeightBound** - the maximum amount of Substrate weight the proposal can use. If the proposal call uses more, the call will revert
- **lengthBound** - a value higher or equal to the length of the SCALE encoded proposal in bytes

The interface includes the following events:

- **Executed**(*bytes32* proposalHash) - emitted when a proposal is executed
- **Proposed**(*address indexed* who, *uint32* indexed proposalIndex, *bytes32 indexed* proposalHash, *uint32* threshold) - emitted when a proposal has successfully been proposed and can be executed or voted on
- **Voted**(*address indexed* who, *bytes32 indexed proposalHash, *bool* voted) - emitted when a proposal is voted on
- **Closed**(*bytes32 indexed* proposalHash) - emitted when a proposal has been closed

## Interacting with the Solidity Interface {: #interacting-with-the-solidity-interface }

The example in this section will show you how to submit a Treasury proposal using the Treasury Council Collective Precompile. As such, the proposal will be subject to meeting the voting requirements of the Treasury Council. The threshold for accepting a Treasury proposal is at least three-fifths of the Treasury Council. On the other hand, the threshold for rejecting a proposal is at least one-half of the Treasury Council. Please keep in mind that in order to propose and vote on the proposal, you must be a member of the Treasury Council.

If you are not a member of the Treasury Council on Moonbeam, Moonriver, or Moonbase Alpha, you can test out the features of the Collective Precompile using a [Moonbeam development node](/builders/get-started/networks/moonbeam-dev/){target=_blank}. The Moonbeam development node comes with [ten pre-funded accounts](/builders/get-started/networks/moonbeam-dev/#pre-funded-development-accounts){target=_blank}, of which Baltathar, Charleth, and Dorothy are automatically set as members of the Treasury Council collective. You can use any of these three accounts to follow along with the rest of the guide.

### Checking Prerequisites {: #checking-prerequisites }

The example in this guide will be shown on a Moonbeam development node, however, it can be adapted for any of the Moonbeam-based networks.

To get started, you will need to have the following:

 - Have MetaMask installed and [connected to one of the Moonbeam-based networks](/tokens/connect/metamask/){target=_blank}
 - Have an account with funds. If using a Moonbeam development node, the development accounts are pre-funded. For Moonbeam, Moonriver, or Moonbase Alpha, you'll need to fund your account.
  --8<-- 'text/_common/faucet/faucet-list-item.md'

If you're using a Moonbeam development node and the development accounts, you'll also need to do the following:

- Set your development node to seal blocks on a time interval such as every 6 seconds (6000 milliseconds) using the `--sealing 6000` flag
- [Connect Polkadot.js Apps to your local Moonbeam development node](/builders/get-started/networks/moonbeam-dev/#connecting-polkadot-js-apps-to-a-local-moonbeam-node){target=_blank}
- Import Baltathar's, Charleth's, and/or Dorothy's accounts into [Polkadot.js Apps](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank} and [MetaMask](/tokens/connect/metamask/#import-accounts){target=_blank}

### Remix Set Up {: #remix-set-up }

1. Get a copy of [`Collective.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank} 
2. Copy and paste the file contents into a [Remix file](https://remix.ethereum.org/){target=_blank} named `Collective.sol`

![Copying and Pasting the Collective Interface into Remix](/images/builders/pallets-precompiles/precompiles/collective/collective-1.webp)

### Compile the Contract {: #compile-the-contract }

1. Click on the **Compile** tab, second from top
2. Then to compile the interface, click on **Compile Collective.sol**

![Compiling Collective.sol](/images/builders/pallets-precompiles/precompiles/collective/collective-2.webp)

### Access the Contract {: #access-the-contract }

1. Click on the **Deploy and Run** tab, directly below the **Compile** tab in Remix. Note: You are not deploying a contract here; instead you are accessing a precompiled contract that is already deployed
2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** drop down
3. Ensure **Collective - Collective.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract there is no need to deploy, instead you are going to provide the address of the precompile in the **At Address** Field
4. Provide the address of the Collective Precompile,`{{networks.moonbase.precompiles.collective_treasury}}`, and click **At Address**
5. The Collective Precompile will appear in the list of **Deployed Contracts**

![Access the precompile contract](/images/builders/pallets-precompiles/precompiles/collective/collective-3.webp)

### Create a Proposal {: #create-a-proposal }

In order to submit a proposal to be voted on by the Treasury Council collective, you must first create a Treasury proposal. If a Treasury proposal that you want to vote on already exists and you have the proposal index, you can skip ahead to the next section.

To submit a Treasury proposal, you can do so via the [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/treasury){target=_blank} Treasury page. For this example, you can create a simple proposal to send Alith 10 DEV tokens that can be used to host a community event. To get started, click on **Submit proposal**, and fill out the following information:

1. From the **submit with account** dropdown, select the account you want to submit the proposal with. The bond for the proposal will be taken from this account
2. Select the **beneficiary**, which can be **Alith** for this example
3. Enter `10` for the **value**
4. Click on **Submit proposal** and then sign and submit the proposal

![Submit a treasury proposal](/images/builders/pallets-precompiles/precompiles/collective/collective-4.webp)

You should see the proposal appear in the **proposals** section. If this is the first proposal created, it will have a proposal index of `0`, which will be needed in the next section. To view all of the proposals, you can navigate to the **Developer** tab, select **Chain State**, and take the following steps:

1. From the **selected state query** dropdown, choose **treasury**
2. Select the **proposals** extrinsic
3. Toggle the **include option** slider off
4. Click **+** to submit the query
5. The results will appear below with the proposal index and the proposal details

![View all treasury proposals](/images/builders/pallets-precompiles/precompiles/collective/collective-5.webp)

Now that you have the proposal and the proposal index, you'll be able to approve the proposal in the following section using the Collective Precompile.

### Propose the Proposal {: #propose-the-proposal }

In order to propose a proposal using the Collective Precompile, so that the corresponding collective can vote on it, you will need to obtain the encoded call data of the call, to be executed by proposal. You can get the encoded call data from Polkadot.js Apps. For this example, you need to propose the **approveProposal** extrinsic of the treasury pallet. To do so, navigate to the **Developer** tab, select **Extrinsics**, and take the following steps:

1. Select an account (any account is fine because you're not submitting any transaction here)
2. Select the **treasury** pallet
3. Choose the **approveProposal** extrinsic
4. Enter the proposal index that the collective will vote on to approve
5. Copy the **encoded call data** for the proposal

![Get encoded proposal](/images/builders/pallets-precompiles/precompiles/collective/collective-6.webp)

For this example, the extrinsic encoded call data for the proposal in this example is `0x110200`.

With the encoded proposal, you can head back to Remix and expand the **COLLECTIVE** precompile contract under the **Deployed Contracts** section. Make sure you're connected to your account that is a member of the Treasury Council, and take the following steps to propose the approval:

1. Expand the **propose** function
2. Enter the **threshold**. Keep in mind that for Treasury proposals to be approved, at least three-fifths of the Treasury Council is needed to vote in approval. As such, you can set the threshold to `2` for this example
3. For the **proposal** field, you can paste the encoded proposal you retrieved from Polkadot.js Apps
4. Click **transact**
5. MetaMask will pop up and you can confirm the transaction

![Propose the approval](/images/builders/pallets-precompiles/precompiles/collective/collective-7.webp)

### Vote on a Proposal {: #vote-on-a-proposal }

To vote on a proposal, you'll need to get the proposal hash by passing in the encoded proposal into the **proposalHash** function.

![Get the proposal hash](/images/builders/pallets-precompiles/precompiles/collective/collective-8.webp)

Once you have the proposal hash, make sure you're connected to your account that is a member of the Treasury Council, and take the following steps to vote on a proposal:

1. Expand the **vote** function in Remix
2. Enter the **proposalHash**
3. Enter the **proposalIndex**
4. Enter `true` for the **approve** field
5. Click **transact**
6. MetaMask will pop up and you can confirm the transaction

![Vote on the proposal](/images/builders/pallets-precompiles/precompiles/collective/collective-9.webp)

With the threshold set to `2`, you'll need to switch accounts in MetaMask to another member of the Treasury Council collective and repeat the steps above to vote and meet the threshold. Once the threshold has been met, you can then close the proposal, which will automatically execute it, and if approved, the proposal enters a queue to be placed into a spend period where the proposed amount will be distributed to the beneficiary. In this case, once the proposal is placed into a spend period, 10 DEV tokens will be distributed to Alith.

## Close a Proposal {: #close-a-proposal }

If a proposal has enough votes, anyone can close a proposal. You do not need to be a member of the Treasury Council in order to close a proposal. To close a proposal, you can take the following steps:

1. Expand the **close** function
2. Enter the **proposalHash**
3. Enter the **proposalIndex**
4. Enter the **proposalWeightBound**, which for this example can be `1000000000`
5. Enter the **lengthBound**, which can be a value equal to or greater than the length of the encoded call data for the proposal. For this example the encoded call data is `0x110200`, and as such, you can set this value to `8`
6. Click on **transact**
7. MetaMask will pop up and you can confirm the transaction

![Close the proposal](/images/builders/pallets-precompiles/precompiles/collective/collective-10.webp)

You can verify the proposal has been approved using Polkadot.js Apps. From the **Developer** tab, select **Chain State**, and take the following steps:

1. Select the **treasury** pallet
2. Select the **approvals** extrinsic
3. Click **+** to submit the query
4. The proposal will appear in the list of approvals

![Review the treasury approvals](/images/builders/pallets-precompiles/precompiles/collective/collective-11.webp)

Once the proposal is in a spend period, the funds will get distributed to the beneficiary, and the original bond will be returned to the proposer. If the Treasury runs out of funds, the approved proposals will remain in storage until the following spend period when the Treasury has enough funds again.
