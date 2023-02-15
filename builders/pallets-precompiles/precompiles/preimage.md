---
title: Preimage Precompile Contract
description: Learn how to take the first necessary step to submit a proposal on-chain by submitting a preimage that contains the action to be carried out in the proposal.
---

# Interacting with the Preimage Precompile

![Precomiled Contracts Banner](/images/builders/pallets-precompiles/precompiles/...)

## Introduction {: #introduction }

As a Polkadot parachain and decentralized network, Moonbeam features native on-chain governance that enables stakeholders to participate in the direction of the network. With the introduction of Governance v2, also referred to as OpenGov, the Preimage Pallet allows token holders to take the first step towards creating a proposal by submitting the preimage, which is the action to be carried out in the proposal, on-chain. The hash of the preimage is required to submit the proposal. To learn more about Moonbeam's governance system, such as an overview of related terminology, the roadmap of a proposal, and more, please refer to the [Governance on Moonbeam](/learn/features/governance){target=_blank} page. 

The Preimage Precompile interacts directly with Substrate's Preimage Pallet. This pallet is coded in Rust and is normally not accessible from the Ethereum side of Moonbeam. However, the Preimage Precompile allows you to access functions needed to create and manage preimages, all of which are part of the Substrate Preimage Pallet, directly from a Solidity interface.

The Preimage Precompile is currently available in Governance v2, which is available on Moonriver and Moonbase Alpha only. If you're looking for similar functionality for Moonbeam, which is still on Governance v1, you can refer to the [Democracy Precompile](/builders/pallets-precompiles/precompiles/democracy){target=_blank} documentation.

The Preimage Precompile is located at the following address:

=== "Moonriver"
     ```
     {{ networks.moonriver.precompiles.preimage }}
     ```

=== "Moonbase Alpha"
     ```
     {{ networks.moonbase.precompiles.preimage }}
     ```

--8<-- 'text/precompiles/security.md'

## The Preimage Solidity Interface {: #the-preimage-solidity-interface }

[`Preimage.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=_blank} is a Solidity interface that allows developers to interact with the precompile's two methods:

- **notePreimage**(*bytes memory* encodedPropsal) — registers a preimage on-chain for an upcoming proposal given the encoded proposal. This doesn't require the proposal to be in the dispatch queue but does require a deposit which is returned once enacted. Uses the [`notePreimage`](/builders/pallets-precompiles/pallets/preimage/#:~:text=notePreimage(encodedProposal)){target=_blank} method of the preimage pallet
- **unnotePreimage**(*bytes32* hash) - clears an unrequested preimage from storage given the hash of the preimage to be removed. Uses the [`unnotePreimage`](/builders/pallets-precompiles/pallets/preimage/#:~:text=notePreimage(hash)){target=_blank} method of the preimage pallet

The interface also includes the following events:

- **PreimageNoted**(*bytes32* hash) - emitted when a preimage was registered on-chain
- **PreimageUnnoted**(*bytes32* hash) - emitted when a preimage was un-registered on-chain

## Interact with the Solidity Interface {: #interact-with-the-solidity-interface }

### Checking Prerequisites {: #checking-prerequisites } 

The below example is demonstrated on Moonbase Alpha, however, similar steps can be taken for Moonriver. To follow the steps in this guide, you'll need to have the following: 

 - MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - An account with some DEV tokens.
 --8<-- 'text/faucet/faucet-list-item.md'

### Remix Set Up {: #remix-set-up } 

1. Click on the **File explorer** tab
2. Paste a copy of [`Preimage.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=_blank} into a [Remix file](https://remix.ethereum.org/){target=_blank} named `Preimage.sol`

![Copy and paste the referenda Solidity interface into Remix.](/images/builders/pallets-precompiles/precompiles/preimage/preimage-1.png)

### Compile the Contract {: #compile-the-contract } 

1. Click on the **Compile** tab, second from top
2. Then to compile the interface, click on **Compile Preimage.sol**

![Compile the Preimage.sol interface using Remix.](/images/builders/pallets-precompiles/precompiles/preimage/preimage-2.png)

### Access the Contract {: #access-the-contract } 

1. Click on the **Deploy and Run** tab, directly below the **Compile** tab in Remix. Note: you are not deploying a contract here, instead you are accessing a precompiled contract that is already deployed
2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** drop down
3. Ensure **Preimage.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract there is no need to deploy, instead you are going to provide the address of the precompile in the **At Address** field
4. Provide the address of the Preimage Precompile for Moonbase Alpha: `{{ networks.moonbase.precompiles.preimage }}` and click **At Address**
5. The Preimage Precompile will appear in the list of **Deployed Contracts**

![Access the Preimage.sol interface by provide the precompile's address.](/images/builders/pallets-precompiles/precompiles/preimage/preimage-3.png)

### Submit a Preimage of a Proposal {: #submit-a-preimage } 

In order to submit a proposal, you'll first need to submit a preimage of that proposal, which essentially defines the proposed action on-chain. You can submit the preimage using the `notePreimage` function of the Preimage Precompile. The `notePreimage` function accepts the encoded proposal, so the first step you'll need to take is to get the encoded proposal, which can easily be done using Polkadot.js Apps.

--8<-- 'text/precompiles/governance/submit-preimage.md'

Now you can take the encoded proposal that you got from [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank} and submit it via the `notePreimage` function of the Preimage Precompile. To submit the preimage via the `notePreimage` function, take the following steps:

1. Expand the Preimage Precompile contract to see the available functions 
2. Find the **notePreimage** function and press the button to expand the section
3. Copy the encoded proposal that you noted in the prior section. Note, the encoded proposal is not the same as the preimage hash. Ensure you are are entering the correct value into this field
4. Press **transact** and confirm the transaction in MetaMask

![Submit the preimage using the notePreimage function of the Preimage Precompile.](/images/builders/pallets-precompiles/precompiles/preimage/preimage-4.png)

Now that you've submitted the preimage for your proposal your proposal can be submitted! Head over to the [Referenda Precompile documentation](/builders/pallets-precompiles//precompiles/referenda){target=_blank} to learn how to submit your proposal.

If you wish to remove a preimage, you can follow the same steps noted above except use the `unnotePreimage` function and pass in the preimage hash instead of the encoded proposal.
