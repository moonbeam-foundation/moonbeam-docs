---
title: Interacting with the Democracy Precompile on Moonbeam
description: How to use the Moonbeam democracy Solidity precompile interface to interact with democracy functions using the Ethereum API
keywords: solidity, ethereum, democracy, moonbeam, precompiled, contracts
---

# Interacting with the Democracy Precompile

![Democracy Moonbeam Banner](/images/builders/pallets-precompiles/precompiles/democracy/democracy-banner.png)

## Introduction {: #introduction } 

As a Polkadot parachain and decentralized network, Moonbeam features native on-chain governance that enables stakeholders to participate in the direction of the network. To learn more about governance, such as an overview of related terminology, principles, mechanics, and more, please refer to the [Governance on Moonbeam](/learn/features/governance){target=_blank} page. 

The on-chain governance system is made possible thanks to the [Substrate democracy pallet](/builders/pallets-precompiles/pallets/democracy){target=_blank}. The democracy pallet is coded in Rust and it is part of a pallet that is normally not accessible from the Ethereum side of Moonbeam. However, the democracy precompile allows you to access the governance functions of the Substrate democracy pallet directly from a Solidity interface. Additionally, this enables a vastly improved end-user experience. For example, token-holders can vote on referenda directly from MetaMask, rather than importing an account in Polkadot.js Apps and navigating a complex UI. 

The democracy precompile is located at the following address:

=== "Moonbeam"
     ```
     {{networks.moonbeam.precompiles.democracy}}
     ```

=== "Moonriver"
     ```
     {{networks.moonriver.precompiles.democracy}}
     ```

=== "Moonbase Alpha"
     ```
     {{networks.moonbase.precompiles.democracy}}
     ```

--8<-- 'text/precompiles/security.md'

## The Democracy Solidity Interface {: #the-democracy-solidity-interface } 

[`DemocracyInterface.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank} is an interface through which Solidity contracts can interact with the democracy pallet. The beauty of the precompile is that you don’t have to learn the Substrate API — you can interact with functions using the Ethereum interface you're familiar with.

The interface includes the following functions:

 - **publicPropCount**() — read-only function that returns the total number of public proposals past and present. Uses the [`publicPropCount`](/builders/pallets-precompiles/pallets/democracy/#:~:text=publicPropCount()){target=_blank} method of the democracy pallet
 - **depositOf**(*uint256* propIndex) — read-only function that returns the total number of tokens locked behind the proposal. Uses the [`depositOf`](/builders/pallets-precompiles/pallets/democracy/#:~:text=depositOf(u32)){target=_blank} method of the democracy pallet
 - **lowestUnbaked**() — read-only function that returns the referendum with the lowest index that is currently being voted on. For clarity, a baked referendum is one that has been closed (and if passed, scheduled for enactment). An unbaked referendum is therefore one in which voting is ongoing. Uses the [`lowestUnbaked`](/builders/pallets-precompiles/pallets/democracy/#:~:text=lowestUnbaked()){target=_blank} method of the democracy pallet
 - **ongoingReferendumInfo**(*uint256* refIndex) — read-only function that returns the details of the specified ongoing referendum in the form of a tuple that includes the following:
     - Block in which the referendum ended (*uint256*)
     - The proposal hash (*bytes32*)
     - [The biasing mechanism](https://wiki.polkadot.network/docs/learn-governance#super-majority-approve){target=_blank} where 0 is `SuperMajorityApprove`, 1 is `SuperMajorityAgainst`, 2 is `SimpleMajority` (*uint256*)
     - The enactment delay period (*uint256*)
     - The total aye vote, including conviction (*uint256*)
     - The total nay note, including conviction (*uint256*)
     - The total turnout, not including conviction (*uint256*)
- **finishedReferendumInfo**(*uint256* refIndex) — read-only function that returns a boolean indicating whether a referendum passed and the block at which it finished
 - **propose**(*bytes32* proposalHash, *uint256* value) — submit a proposal by providing a hash and the number of tokens to lock. Uses the [`propose`](/builders/pallets-precompiles/pallets/democracy/#:~:text=propose(proposalHash, value)){target=_blank} method of the democracy pallet
 - **second**(*uint256* propIndex, *uint256* secondsUpperBound) — second a proposal by providing the proposal index and a number greater than or equal to the number of existing seconds for this proposal (necessary to calculate the weight of the call). An amount is not needed because seconds require the same amount the original proposer locked. Uses the [`second`](/builders/pallets-precompiles/pallets/democracy/#:~:text=second(proposal, secondsUpperBound)){target=_blank} method of the democracy pallet 
 - **standardVote**(*uint256* refIndex, *bool* aye, *uint256* voteAmount, *uint256* conviction) — vote in a referendum by providing the proposal index, the vote direction (`true` is a vote to enact the proposal, `false` is a vote to keep the status quo), the number of tokens to lock, and the conviction. Conviction is an integer from `0` to `6` where `0` is no lock time and `6` is the maximum lock time. Uses the [`vote`](/builders/pallets-precompiles/pallets/democracy/#:~:text=vote(refIndex, vote)){target=_blank} method of the democracy pallet 
 - **removeVote**(*uint256* refIndex) — this method is used to remove a vote for a referendum before clearing expired democracy locks. Note, this cannot be used to revoke or cancel a vote while a proposal is being voted on.  
 - **delegate**(*address* representative, *uint256* candidateCount, *uint256* amount) — delegate voting power to another account by specifying an account to whom the vote shall be delegated, a conviction factor which is used for all delegated votes, and the number of tokens to delegate. Uses the [`delegate`](/builders/pallets-precompiles/pallets/democracy/#:~:text=delegate(to, conviction, balance)){target=_blank} method of the democracy pallet 
 - **unDelegate**() — a method called by the delegator to undelegate voting power. Tokens are eligible to be unlocked once the conviction period specified by the original delegation has elapsed. Uses the [`undelegate`](/builders/pallets-precompiles/pallets/democracy/#:~:text=undelegate()){target=_blank} method of the democracy pallet 
 - **unlock**(*address* target) — unlock tokens that have an expired lock. You MUST call **removeVote** for each proposal with tokens locked you seek to unlock prior to calling **unlock**, otherwise tokens will remain locked. This function may be called by any account. Uses the [`unlock`](/builders/pallets-precompiles/pallets/democracy/#:~:text=unlock(target)){target=_blank} method of the democracy pallet 
 - **notePreimage**(*bytes* encodedProposal) — Registers a preimage for an upcoming proposal. This doesn't require the proposal to be in the dispatch queue but does require a deposit which is returned once enacted. Uses the [`notePreimage`](/builders/pallets-precompiles/pallets/democracy/#:~:text=notePreimage(encodedProposal)){target=_blank} method of the democracy pallet
 - **noteImminentPreimage**(*bytes* encodedProposal) — Register the preimage for an upcoming proposal. This requires the proposal to be in the dispatch queue. No deposit is needed. When this call is successful, i.e. the preimage has not been uploaded before and matches some imminent proposal, no fee is paid. Uses the [`noteImminentPreimage`](/builders/pallets-precompiles/pallets/democracy/#:~:text=noteImminentPreimage(encodedProposal)){target=_blank} method of the democracy pallet

The interface also includes the following events:

- **Proposed**(*uint32 indexed* proposalIndex, *uint256* deposit) - emitted when a motion has been proposed
- **Seconded**(*uint32 indexed* proposalIndex, *address* seconder) - emitted when an account has seconded a proposal
- **StandardVote**(*uint32 indexed* referendumIndex, *address* voter, *bool* aye, *uint256* voteAmount, *uint8* conviction) - emitted when an account has made a standard vote
- **Delegated**(*address indexed* who, *address* target) - emitted when an account has delegated some voting power to another account
- **Undelegated**(*address indexed* who) - emitted when an account has undelegated some of their voting power from another account

## Interact with the Solidity Interface {: #interact-with-the-solidity-interface }

### Checking Prerequisites {: #checking-prerequisites } 

The below example is demonstrated on Moonbase Alpha, however, similar steps can be taken for Moonbeam and Moonriver. Before diving into the interface, it's best if you're familiar with [how to propose an action](/tokens/governance/proposals/){target=_blank} and [how to vote on a proposal](/tokens/governance/voting/){target=_blank} on Moonbeam. Additionally, you should:  

 - Have MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - Have an account with some DEV tokens.
 --8<-- 'text/faucet/faucet-list-item.md'

### Remix Set Up {: #remix-set-up } 

1. Click on the **File explorer** tab
2. Paste a copy of [`DemocracyInterface.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank} into a [Remix file](https://remix.ethereum.org/){target=_blank} named `Democracy.sol`

![Copying and Pasting the Democracy Interface into Remix](/images/builders/pallets-precompiles/precompiles/democracy/democracy-1.png)

### Compile the Contract {: #compile-the-contract } 

1. Click on the **Compile** tab, second from top
2. Then to compile the interface, click on **Compile Democracy.sol**

![Compiling DemocracyInteface.sol](/images/builders/pallets-precompiles/precompiles/democracy/democracy-2.png)

### Access the Contract {: #access-the-contract } 

1. Click on the **Deploy and Run** tab, directly below the **Compile** tab in Remix. Note: you are not deploying a contract here, instead you are accessing a precompiled contract that is already deployed
2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** drop down
3. Ensure **Democracy.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract there is no need to deploy, instead you are going to provide the address of the precompile in the **At Address** field
4. Provide the address of the democracy precompile for Moonbase Alpha: `{{networks.moonbase.precompiles.democracy}}` and click **At Address**
5. The democracy precompile will appear in the list of **Deployed Contracts**

![Provide the address](/images/builders/pallets-precompiles/precompiles/democracy/democracy-3.png)

### Submit a Proposal {: #submit-a-proposal } 

You can submit a proposal via the `propose` function of the [democracy precompile](https://github.com/PureStake/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank} as long as you have the preimage hash of the proposal. But before a proposal can be submitted, you'll first need to submit the preimage by passing in the encoded proposal data to the `notePreimage` function, which now belongs to the [preimage pallet](/builders/pallets-precompiles/pallets/preimage){target=_blank}.

In this section, you'll get the preimage hash and the encoded proposal data for a proposal. To get the preimage hash, you can:

 1. Navigate to the [**Governance** tab of Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank}
 2. Select **Preimages** from the dropdown
 3. From the **Preimages** page, click on **+ Add preimage**

![Add a new preimage](/images/builders/pallets-precompiles/precompiles/democracy/democracy-4.png)

Then take the following steps:

 1. Select an account (any account is fine because you're not submitting any transaction here)
 2. Choose the pallet you want to interact with and the dispatchable function (or action) to propose. The action you choose will determine the fields that need to fill in the following steps. In this example, it is the **system** pallet and the **remark** function
 3. Enter the text of the remark, ensuring it is unique. Duplicate proposals such as "Hello World!" will not be accepted
 4. Copy the preimage hash, which represents the proposal, and save it as it will be used in the following steps to submit the proposal via the democracy precompile
 5. Click the **Submit preimage** button but don't sign or confirm the transaction on the next page 

![Get the proposal hash](/images/builders/pallets-precompiles/precompiles/democracy/democracy-5.png)

On the next screen, take the following steps:

 1. Press the triangle icon to reveal the encoded proposal in bytes
 2. Copy the encoded proposal - you'll need this when calling the **notePreimage** function in a later step

![Get the encoded proposal](/images/builders/pallets-precompiles/precompiles/democracy/democracy-6.png)

!!! note
     You should NOT sign and submit the transaction here. You will submit this information via the **notePreimage** function in the next step.  

Now you can take the encoded proposal that you got from [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank} and submit it via the `notePreimage` function of the democracy precompile. Despite its name, the preimage is not required to be submitted before the proposal. However, submitting the preimage is required before a proposal can be enacted. To submit the preimage via the `notePreimage` function, take the following steps:

1. Expand the democracy precompile contract to see the available functions 
2. Find the **notePreimage** function and press the button to expand the section
3. Copy the encoded proposal that you noted in the prior section. Note, the encoded proposal is not the same as the preimage hash. Ensure you are are entering the correct value into this field
4. Press **transact** and confirm the transaction in MetaMask

![Submit the preimage](/images/builders/pallets-precompiles/precompiles/democracy/democracy-7.png)

Next you can call the `propose` function of the Solidity interface by taking the following steps:

1. Expand the democracy precompile contract to see the available functions
2. Find the **propose** function and press the button to expand the section
3. Enter the hash of the proposal
4. Enter the value in Wei of the tokens to bond. The minimum bond is {{ networks.moonbeam.democracy.min_deposit }} GLMR, {{ networks.moonriver.democracy.min_deposit }} MOVR, or {{ networks.moonbase.democracy.min_deposit }} DEV. For this example 4 DEV or `4000000000000000000` was entered
5. Press **transact** and confirm the transaction in MetaMask

![Call the propose function](/images/builders/pallets-precompiles/precompiles/democracy/democracy-8.png)

After your transaction has been confirmed you can return to the **Democracy** section of [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank} to see your proposal listed in the proposal queue.

### Second a Proposal {: #second-a-proposal } 

Seconding a proposal allows it to move to referendum status and requires a bond equivalent to the bond furnished by the proposer. Seconded proposals transition to referendum status once per launch period, which is approximately {{ networks.moonbeam.democracy.launch_period.days}} days on Moonbeam, {{ networks.moonriver.democracy.launch_period.days}} day on Moonriver, and {{ networks.moonbase.democracy.launch_period.days}} day on Moonbase Alpha.

First, you'll need to gather some information about the proposal you wish to second. Since you submitted a proposal in the prior step, there should be at least one proposal in the queue. To get the index of that proposal, head to [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank} and take the following steps:

1. Navigate to the **Governance** tab
2. Click on **Democracy**
3. Look for the **Proposals** section and click on the triangle icon to see more details about a proposal
4. Take note of the proposal number - this is the first parameter you'll need
5. Take note of the number of existing seconds. If there are none, this space will be empty

![Get the proposal information](/images/builders/pallets-precompiles/precompiles/democracy/democracy-9.png)

Now, you're ready to return to Remix to second the proposal via the democracy precompile. To do so, take the following steps:

1. Expand the democracy precompile contract to see the available functions if it is not already open
2. Find the **second** function and press the button to expand the section
3. Enter the index of the proposal to second
4. Although you noted the exact number of seconds the proposal already has above, the parameter needed is an upper bound. To avoid gas estimation errors, you should enter a number that is significantly larger than the actual number of seconds. `10` was entered in this example
5. Press **transact** and confirm the transaction in MetaMask

And that's it! To review your seconded proposal, you can revisit [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank} and look for your account in the list of seconds.  

![Second via the precompile](/images/builders/pallets-precompiles/precompiles/democracy/democracy-10.png)

!!! note
    Proposal index numbers are not the same as referendum index numbers. When a proposal moves to referendum status, it will be assigned a new referendum index number.  

### Vote on a Referendum {: #vote-on-a-referendum } 

Seconded proposals transition to referendum status once per launch period, which is approximately {{ networks.moonbeam.democracy.launch_period.days}} days on Moonbeam, {{ networks.moonriver.democracy.launch_period.days}} day on Moonriver, and {{ networks.moonbase.democracy.launch_period.days}} day on Moonbase Alpha. If there are no active referenda currently up for vote on Moonbase Alpha, you may need to wait for the launch period to pass for the proposal you seconded in the prior step to make it to referendum status.

First, you'll need to get the index of the referendum you wish to vote on. Remember, the proposal index is not the same as the referendum index. To get the index of a referendum, head to [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank} and take the following steps:

1. Navigate to the **Governance** Tab
2. Click on **Democracy**
3. Look for the **Referenda** section and click on the triangle icon to see more details about a referendum. If there is no triangle icon, this means that only a proposal hash, and no preimage has been submitted for the proposal
4. Take note of the referendum index

![Get the referendum index](/images/builders/pallets-precompiles/precompiles/democracy/democracy-11.png)

Now, you're ready to return to Remix to vote on the referendum via the democracy precompile. To do so, take the following steps:

1. Expand the democracy precompile contract to see the available functions if it is not already open
2. Find the **standardVote** function and press the button to expand the section
3. Enter the index of the referendum to vote on
4. Leave the field empty for **nay** or input `1` for **aye**. In the context of a referendum, nay is a vote to keep the status quo unchanged. Aye is a vote to enact the action proposed by the referendum
5. Enter the number of tokens to lock in Wei. Avoid entering your full balance here because you need to pay for transaction fees
6. Enter a conviction between 0-6 inclusive that represents the desired lock period for the tokens committed to the vote, where 0 represents no lock period and 6 represents the maximum lock period. For more information on lock periods, see [voting on a proposal](/tokens/governance/voting/){target=_blank}
7. Press **transact** and confirm the transaction in MetaMask

![Call the vote function](/images/builders/pallets-precompiles/precompiles/democracy/democracy-12.png)

And that's it! You've completed your introduction to the democracy precompile. There are a few more functions that are documented in [`DemocracyInterface.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank} — feel free to reach out on [Discord](https://discord.gg/moonbeam){target=_blank} if you have any questions about those functions or any other aspect of the democracy precompile.
