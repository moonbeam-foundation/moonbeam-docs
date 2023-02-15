---
title: Referenda Precompile Contract
description: Learn how to view and submit proposals on-chain to be put forth for referenda, directly through a Solidity interface with the Referenda Precompile on Moonbeam.
---

# Interacting with the Referenda Precompile

![Precomiled Contracts Banner](/images/builders/pallets-precompiles/precompiles/...)

## Introduction {: #introduction }

As a Polkadot parachain and decentralized network, Moonbeam features native on-chain governance that enables stakeholders to participate in the direction of the network. With the introduction of Governance v2, also referred to as OpenGov, the Referenda Pallet allows token holders to get information on existing referenda, submit a proposal to be put forth for referenda, and manage actions related to the Decision Deposit, which is required for a referenda to be decided on. To learn more about Moonbeam's governance system, such as an overview of related terminology, principles, mechanics, and more, please refer to the [Governance on Moonbeam](/learn/features/governance){target=_blank} page. 

The Referenda Precompile interacts directly with Substrate's Referenda Pallet. This pallet is coded in Rust and is normally not accessible from the Ethereum side of Moonbeam. However, the Referenda Precompile allows you to access functions needed to view referenda, submit referenda, and manage the required Decision Deposit, all of which are part of the Substrate Referenda Pallet, directly from a Solidity interface.

The Referenda Precompile is currently available in Governance v2, which is available on Moonriver and Moonbase Alpha only. If you're looking for similar functionality for Moonbeam, which is still on Governance v1, you can refer to the [Democracy Precompile](/builders/pallets-precompiles/precompiles/democracy){target=_blank} documentation.

The Referenda Precompile is located at the following address:

=== "Moonriver"
     ```
     {{ networks.moonriver.precompiles.referenda }}
     ```

=== "Moonbase Alpha"
     ```
     {{ networks.moonbase.precompiles.referenda }}
     ```

--8<-- 'text/precompiles/security.md'

## The Referenda Solidity Interface {: #the-referenda-solidity-interface } 

[`Referenda.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=_blank} is a Solidity interface that allows developers to interact with the precompile's methods. The methods are as follows:

- **referendumCount**() - a read-only function that returns the total referendum count
- **submissionDeposit**() - a read-only function that returns the Submission Deposit for all referenda
- **decidingCount**(*uint16* trackId) - a read-only function that returns the total count of deciding referenda of a given track
- **trackIds**() - a read-only function that returns a list of the Track IDs for all tracks (and origins)
- **trackInfo**(*uint16* trackId) - a read-only function that returns the governance parameters configured for a given Track ID
- **submitAt**(*uint16* trackId, *bytes memory* proposal, *uint32* block) - submits a referenda given a Track ID corresponding to the origin from which the proposal is to be dispatched, the proposed runtime call, and the block number *at* which this will be executed
- **submitAfter**(*uint16* trackId, *bytes memory* proposal, *uint32* block) - submits a referenda given a Track ID corresponding to the origin from which the proposal is to be dispatched, the proposed runtime call, and the block number *after* which this will be executed
- **placeDecisionDeposit**(*uint32* index) - posts the Decision Deposit for a referendum given the index of the going referendum
- **refundDecisionDeposit**(*uint32* index) - refunds the Decision Deposit for a closed referendum back to the depositor given the index of the closed referendum in which the Decision Deposit is still locked

The interface also includes the following events:

- **SubmittedAt**(*uint16 indexed* trackId, *uint32* blockNumber, *bytes32* hash) - emitted when a referenda has been submitted *at* a given block
- **SubmittedAfter**(*uint16 indexed* trackId, *uint32* blockNumber, *bytes32* hash) - emitted when a referenda has been submitted *after* a given block
- **DecisionDepositPlaced**(*uint32* index) - emitted when a Decision Deposit for a referendum has been placed
- **DecisionDepositRefunded**(*uint32* index) - emitted when a Decision Deposit for a closed referendum has been refunded

## Interact with the Solidity Interface {: #interact-with-the-solidity-interface }

### Checking Prerequisites {: #checking-prerequisites } 

The below example is demonstrated on Moonbase Alpha, however, similar steps can be taken for Moonriver. To follow the steps in this guide, you'll need to have the following: 

 - MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - An account with some DEV tokens.
 --8<-- 'text/faucet/faucet-list-item.md'

### Remix Set Up {: #remix-set-up } 

1. Click on the **File explorer** tab
2. Paste a copy of [`Referenda.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=_blank} into a [Remix file](https://remix.ethereum.org/){target=_blank} named `Referenda.sol`

![Copy and paste the Referenda Solidity interface into Remix.](/images/builders/pallets-precompiles/precompiles/referenda/referenda-1.png)

### Compile the Contract {: #compile-the-contract } 

1. Click on the **Compile** tab, second from top
2. Then to compile the interface, click on **Compile Referenda.sol**

![Compile the Referenda.sol interface using Remix.](/images/builders/pallets-precompiles/precompiles/referenda/referenda-2.png)

### Access the Contract {: #access-the-contract } 

1. Click on the **Deploy and Run** tab, directly below the **Compile** tab in Remix. Note: you are not deploying a contract here, instead you are accessing a precompiled contract that is already deployed
2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** drop down
3. Ensure **Referenda.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract there is no need to deploy, instead you are going to provide the address of the precompile in the **At Address** field
4. Provide the address of the Referenda Precompile for Moonbase Alpha: `{{ networks.moonbase.precompiles.referenda }}` and click **At Address**
5. The Referenda Precompile will appear in the list of **Deployed Contracts**

![Access the Referenda.sol interface by provide the precompile's address.](/images/builders/pallets-precompiles/precompiles/referenda/referenda-3.png)

### Submit a Proposal {: #submit-a-proposal }

In order to submit a proposal, you should have already submitted the preimage hash for the proposal. If you have not done so, please follow the steps outlined in the [Preimage Precompile](/builders/pallets-precompiles/precompiles/preimage){target=_blank} documentation. There are two methods that can be used to submit a proposal: `submitAt` and `submitAfter`. The `submitAt` function submits a proposal to be executed *at* a given block and the `submitAfter` function submits a proposal to be executed *after* a specific block. For this example, `submitAt` will be used but the same steps can be applied if you want to use `submitAfter` instead.

To submit the proposal, you'll need to determine which Track your proposal belongs to and the Track ID of that Track. For help with these requirements, you can refer to the [Governance v2 section of the governance overview page](/learn/features/governance/#governance-v2){target=_blank}.

Once you have the Track ID and the encoded proposal, you can go ahead and submit the proposal using the Referenda Precompile. From Remix, you can take the following steps:

1. Expand the Referenda Precompile contract to see the available functions
2. Find the **submitAt** function and press the button to expand the section
3. Enter the track ID that your proposal will be processed through
4. Enter the encoded proposal. You should have received this from following the steps in the [Preimage Precompile](/builders/pallets-precompiles/precompiles/preimage){target=_blank} documentation
5. Enter the block you want the proposal to be executed at
6. Press **transact** and confirm the transaction in MetaMask

[Submit the proposal using the submitAt function of the Referenda Precompile.](/images/builders/pallets-precompiles/precompiles/referenda/referenda-4.png)

After your transaction has been confirmed you'll be able to see the proposal listed on the **Referenda** page of [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/referenda){target=_blank}. You can also check out your proposal on [Polkassembly](https://moonbase.polkassembly.network/){target=_blank}, which sorts proposals by the Track they belong to.

### Submit Decision Deposit {: #submit-decision-deposit }

Now that you've submitted your proposal, the next step is to submit the Decision Deposit. The Decision Deposit is the minimum deposit amount required for a referendum to progress to the decision phase at the end of the Lead-in Period. For more information on the Decision Deposit, please refer to the [Governance v2 section of the governance overview page](/learn/features/governance/#governance-v2){target=_blank}.

You can submit the Decision Deposit using the `placeDecisionDeposit` function of the Referenda Precompile. You'll just need to have the index of the referendum and enough funds to do so. The Decision Deposit varies by Track, to find the minimum amount required you can take a look at the [General Parameters by Track table on the governance overview page](/learn/features/governance/#general-parameters-by-track){target=_blank}.

To submit the deposit, you can take the following steps:

1. Find the **placeDecisionDeposit** function and press the button to expand the section
2. Enter the index of the referendum
3. Press **transact** and confirm the transaction in MetaMask

[Place the Decision Deposit for a Referenda using the placeDecisionDeposit function of the Referenda Precompile.](/images/builders/pallets-precompiles/precompiles/referenda/referenda-5.png)

Now that the Decision Deposit has been placed, the referendum is one step closer to moving to the Decide Period. There will also need to be enough Capacity in the designated Track and the duration of the Prepare Period must pass for it to move to the Decide Period. 

To vote on referenda, you can follow the steps outlined in the [Conviction Voting Precompile](/builders/pallets-precompiles/precompiles/conviction-voting){target=_blank} documentation.

### Refund Decision Deposit {: #refund-decision-deposit }

Once a referendum has either been approved or rejected, the Decision Deposit can be refunded. This holds true as long as the referendum wasn't cancelled due to the proposal being malicious. If the proposal is deemed malicious and killed via the Emergency Killer Track, the Decision Deposit will be slashed.

To refund the Decision Deposit, you can use the `refundDecisionDeposit` function of the Referenda Precompile. To do so, you can take the following steps:

1. Find the **placeDecisionDeposit** function and press the button to expand the section
2. Enter the index of the referendum
3. Press **transact** and confirm the transaction in MetaMask

[Refund the Decision Deposit for a Referenda using the placeDecisionDeposit function of the Referenda Precompile.](/images/builders/pallets-precompiles/precompiles/referenda/referenda-6.png)

And that's it! You've completed your introduction to the Referenda Precompile. There are a few more functions that are documented in [`Referenda.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/referenda/Referenda.sol){target=_blank} — feel free to reach out on [Discord](https://discord.gg/moonbeam){target=_blank} if you have any questions about those functions or any other aspect of the Referenda Precompile.