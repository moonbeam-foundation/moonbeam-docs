---
title: Preimage Precompile Contract
description: Learn how to take the first necessary step to submit a proposal on-chain by submitting a preimage that contains the action to be carried out in the proposal.
---

# Interacting with the Preimage Precompile

## Introduction {: #introduction }

As a Polkadot parachain and decentralized network, Moonbeam features native on-chain governance that enables stakeholders to participate in the direction of the network. With the introduction of OpenGov, also referred to as Governance v2, the Preimage Pallet allows token holders to take the first step towards creating a proposal by submitting the preimage, which is the action to be carried out in the proposal, on-chain. The hash of the preimage is required to submit the proposal. To learn more about Moonbeam's governance system, such as an overview of related terminology, the roadmap of a proposal, and more, please refer to the [Governance on Moonbeam](/learn/features/governance/){target=\_blank} page.

The Preimage Precompile interacts directly with Substrate's Preimage Pallet. This pallet is coded in Rust and is normally not accessible from the Ethereum side of Moonbeam. However, the Preimage Precompile allows you to access functions needed to create and manage preimages, all of which are part of the Substrate Preimage Pallet, directly from a Solidity interface.

The Preimage Precompile is located at the following address:

=== "Moonbeam"

     ```text
     {{ networks.moonbeam.precompiles.preimage }}
     ```

=== "Moonriver"

     ```text
     {{ networks.moonriver.precompiles.preimage }}
     ```

=== "Moonbase Alpha"

     ```text
     {{ networks.moonbase.precompiles.preimage }}
     ```

--8<-- 'text/builders/ethereum/precompiles/security.md'

## The Preimage Solidity Interface {: #the-preimage-solidity-interface }

[`Preimage.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=\_blank} is a Solidity interface that allows developers to interact with the precompile's two methods:

- **notePreimage**(*bytes memory* encodedPropsal) — registers a preimage on-chain for an upcoming proposal given the encoded proposal and returns the preimage hash. This doesn't require the proposal to be in the dispatch queue but does require a deposit which is returned once enacted. Uses the [`notePreimage`](/builders/substrate/interfaces/features/governance/preimage/#:~:text=notePreimage(encodedProposal)){target=\_blank} method of the preimage pallet
- **unnotePreimage**(*bytes32* hash) - clears an unrequested preimage from storage given the hash of the preimage to be removed. Uses the [`unnotePreimage`](/builders/substrate/interfaces/features/governance/preimage/#:~:text=notePreimage(hash)){target=\_blank} method of the preimage pallet

The interface also includes the following events:

- **PreimageNoted**(*bytes32* hash) - emitted when a preimage was registered on-chain
- **PreimageUnnoted**(*bytes32* hash) - emitted when a preimage was un-registered on-chain

## Interact with the Solidity Interface {: #interact-with-the-solidity-interface }

### Checking Prerequisites {: #checking-prerequisites }

The below example is demonstrated on Moonbase Alpha, however, similar steps can be taken for Moonriver. To follow the steps in this guide, you'll need to have the following:

 - MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
 - An account with some DEV tokens.
 --8<-- 'text/_common/faucet/faucet-list-item.md'

### Remix Set Up {: #remix-set-up }

1. Click on the **File explorer** tab
2. Paste a copy of [`Preimage.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=\_blank} into a [Remix file](https://remix.ethereum.org){target=\_blank} named `Preimage.sol`

![Copy and paste the referenda Solidity interface into Remix.](/images/builders/ethereum/precompiles/features/governance/preimage/preimage-1.webp)

### Compile the Contract {: #compile-the-contract }

1. Click on the **Compile** tab, second from top
2. Then to compile the interface, click on **Compile Preimage.sol**

![Compile the Preimage.sol interface using Remix.](/images/builders/ethereum/precompiles/features/governance/preimage/preimage-2.webp)

### Access the Contract {: #access-the-contract }

1. Click on the **Deploy and Run** tab, directly below the **Compile** tab in Remix. Note: you are not deploying a contract here, instead you are accessing a precompiled contract that is already deployed
2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** drop down
3. Ensure **Preimage.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract there is no need to deploy, instead you are going to provide the address of the precompile in the **At Address** field
4. Provide the address of the Preimage Precompile for Moonbase Alpha: `{{ networks.moonbase.precompiles.preimage }}` and click **At Address**
5. The Preimage Precompile will appear in the list of **Deployed Contracts**

![Access the Preimage.sol interface by provide the precompile's address.](/images/builders/ethereum/precompiles/features/governance/preimage/preimage-3.webp)

### Submit a Preimage of a Proposal {: #submit-a-preimage }

In order to submit a proposal, you'll first need to submit a preimage of that proposal, which essentially defines the proposed action on-chain. You can submit the preimage using the `notePreimage` function of the Preimage Precompile. The `notePreimage` function accepts the encoded proposal, so the first step you'll need to take is to get the encoded proposal, which can easily be done using Polkadot.js Apps.

In this section, you'll get the preimage hash and the encoded proposal data for a proposal. To get the preimage hash, you'll first need to navigate to the **Preimage** page of [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#){target=\_blank}:

 1. Navigate to the [**Governance** tab](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/democracy){target=\_blank}
 2. Select **Preimages** from the dropdown
 3. From the **Preimages** page, click on **+ Add preimage**

![Add a new preimage](/images/builders/ethereum/precompiles/democracy/democracy-4.webp)

Then take the following steps:

 1. Select an account (any account is fine because you're not submitting any transaction here)
 2. Choose the pallet you want to interact with and the dispatchable function (or action) to propose. The action you choose will determine the fields that need to fill in the following steps. In this example, it is the **system** pallet and the **remark** function
 3. Enter the text of the remark, ensuring it is unique. Duplicate proposals such as "Hello World!" will not be accepted
 4. Click the **Submit preimage** button but don't sign or confirm the transaction on the next page 

![Get the proposal hash](/images/builders/ethereum/precompiles/democracy/democracy-5.webp)

On the next screen, take the following steps:

 1. Press the triangle icon to reveal the encoded proposal in bytes
 2. Copy the **bytes** representing the encoded proposal - you'll need this when calling the `notePreimage` function in a later step

![Get the encoded proposal](/images/builders/ethereum/precompiles/democracy/democracy-6.webp)

!!! note
     You should NOT sign and submit the transaction here. You will submit this information via the `notePreimage` function in the next step.

Now you can take the **bytes** of the encoded proposal that you got from [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/democracy){target=\_blank} and submit it via the `notePreimage` function of the Preimage Precompile. To submit the preimage via the `notePreimage` function, take the following steps:

1. Expand the Preimage Precompile contract to see the available functions
2. Find the **notePreimage** function and press the button to expand the section
3. Provide the **bytes** of the encoded proposal that you noted in the prior section. Note, the encoded proposal is not the same as the preimage hash. Ensure you are are entering the correct value into this field
4. Press **transact** and confirm the transaction in MetaMask

![Submit the preimage using the notePreimage function of the Preimage Precompile.](/images/builders/ethereum/precompiles/features/governance/preimage/preimage-4.webp)

Now that you've submitted the preimage for your proposal your proposal can be submitted! Head over to the [Referenda Precompile documentation](/builders/ethereum/precompiles/features/governance/referenda/){target=\_blank} to learn how to submit your proposal.

If you wish to remove a preimage, you can follow the same steps noted above except use the `unnotePreimage` function and pass in the preimage hash instead of the encoded proposal.
