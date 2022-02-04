---
title: Democracy 
description: Moonbeam Democracy Solidity Precompile Interface Demo
---

# Interacting with the Democracy Precompile

![Staking Moonbeam Banner](/images/builders/tools/precompiles/staking/staking-banner.png)

## Introduction {: #introduction } 

As a Polkadot parachain, Moonbeam features native on-chain governance thanks to the [substrate democracy pallet](https://marketplace-staging.substrate.dev/pallets/pallet-democracy){target=_blank}. The democracy precompile allows developers to access the governance functions of the substrate democracy pallet directly from a solidity interface. This enables a vastly improved end-user experience. For example, token-holders can vote on referenda directly from MetaMask, rather than importing an account in Polkadot.Js Apps and navigating a complex UI. 

The democracy pallet is coded in Rust and it is part of a pallet that is normally not accessible from the Ethereum side of Moonbeam. However, the Democracy Precompile allows developers to access the native substrate democracy features using the Ethereum API in a precompiled contract located at address:

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

## The Democracy Solidity Interface {: #the-democracy-solidity-interface } 

[DemocracyInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol) is an interface through which solidity contracts can interact with the democracy pallet. The beauty of the precompile is that you don’t have to learn the Substrate API- you can interact with staking functions using the Ethereum interface you're familiar with.

The interface includes the following functions:

 - **public_prop_count**() — read-only function that returns the total number of public proposals past and present
 - **deposit_of**(*uint256* prop_index) — read-only function that returns the total number of tokens locked behind the proposal
 - **lowest_unbaked**() — read-only function that returns the referendum with the lowest index that is currently being voted on. For clarity, a baked referendum is one that has been closed (and if passed, scheduled for enactment). An unbaked referendum is therefore one in which voting is ongoing
 - **propose**(*bytes32* proposal_hash, *uint256* value) — submit a proposal by providing a hash and the number of tokens to lock 
 - **second**(*uint256* prop_index, *uint256* seconds_upper_bound) — second a proposal by providing the proposal index and a number greater than or equal to the number of existing seconds for this proposal (necessary to calculate the weight of the call). An amount is not needed because seconds require the same amount the original proposer locked 
 - **standard_vote**(*uint256* ref_index, *bool* aye, *uint256* vote_amount, *uint256* conviction) — vote in a referendum by providing the proposal index, the vote direction (`true` is a vote to enact the proposal, `false` is a vote to keep the status quo), the number of tokens to lock, and the conviction. Conviction is an integer from `0` to `6` where `0` is no lock time and `6` is the maximum lock time
 - **remove_vote**(*uint256* ref_index) — this method is used to remove a vote for a referendum before clearing expired democracy locks. Note, this cannot be used to revoke or cancel a vote while a proposal is being voted on 
 - **delegate**(*address* representative, *uint256* candidateCount, *uint256* amount) — delegate voting power to another account by specifying an account to whom the vote shall be delegated, a conviction factor which is used for all delegated votes, and the number of tokens to delegate.
 - **un_delegate**() — a method called by the delegator to undelegate voting power. Tokens are eligible to be unlocked once the conviction period specified by the original delegation has elapsed
 - **unlock**(*address* target) — unlock tokens that have an expired lock. You MUST call **remove_vote** for each proposal with tokens locked you seek to unlock prior to calling **unlock**, otherwise tokens will remain locked. This function may be called by any account
 - **note_preimage**(*bytes* encoded_proposal) — Registers a preimage for an upcoming proposal. This doesn't require the proposal to be in the dispatch queue but does require a deposit which is returned once enacted
 - **note_imminent_preimage**(*bytes* encoded_proposal) — Register the preimage for an upcoming proposal. This requires the proposal to be in the dispatch queue. No deposit is needed. When this call is successful, i.e. the preimage has not been uploaded before and matches some imminent proposal, no fee is paid

The interface also includes the following functions which are not currently supported but may be supported in the future:

  - **ongoing_referendum_info**(*uint256* ref_index) — read-only function that returns the details of the specified ongoing referendum in the form of a tuple that includes the following:
    1. block in which the referendum ended (*uint256*)
    2. the proposal hash (*bytes32*)
    3. the biasing mechanism where 0 is SuperMajorityApprove, 1 is SuperMajorityAgainst, 2 is SimpleMajority (*uint256*)
    4. the enactment delay period (*uint256*)
    5. the total aye vote, including conviction (*uint256*)
    6. the total nay note, including conviction (*uint256*)
    7. the total turnout, not including conviction (*uint256*)

 - **finished_referendum_info**(*uint256* ref_index) — read-only function that returns a boolean indicating whether a referendum passed and the block at which it finished
 
## Checking Prerequisites {: #checking-prerequisites } 

The below example is demonstrated on Moonbase Alpha, however, similar steps can be taken for Moonbeam and Moonriver. Before diving into the interface, it's best if you're familiar with [how to propose an action](/tokens/governance/proposals/) and [how to vote on a proposal](/tokens/governance/proposals/) in Moonbeam. Additionally, you should:  

 - Have MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/)
 - Have an account with some DEV tokens. You can get these from [Mission Control](/builders/get-started/moonbase/#get-tokens/)

## Remix Set Up {: #remix-set-up } 

1. Get a copy of [DemocracyInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank}
2. Copy and paste the file contents into a Remix file named DemocracyInterface.sol

![Copying and Pasting the Democracy Interface into Remix](/images/builders/tools/precompiles/democracy/democracy-1.png)

## Compile the Contract {: #compile-the-contract } 

1. Click on the Compile tab, second from top
2. Compile [DemocracyInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank}

![Compiling DemocracyInteface.sol](/images/builders/tools/precompiles/democracy/democracy-2.png)

## Access the Contract {: #access-the-contract } 

1. Click on the Deploy and Run tab, directly below the Compile tab in Remix. **Note**: you are not deploying a contract here, instead you are accessing a precompiled contract that is already deployed
2. Make sure **Injected Web3** is selected in the Environment drop down
3. Ensure **DemocracyInterface.sol** is selected in the **Contract** dropdown. Since this is a precompiled contract there is no need to deploy, instead you are going to provide the address of the precompile in the **At Address** Field
4. Provide the address of the democracy precompile for Moonbase Alpha: `{{networks.moonbase.precompiles.democracy}}` and click **At Address**
5. The Democracy precompile will appear in the list of **Deployed Contracts**

![Provide the address](/images/builders/tools/precompiles/democracy/democracy-3.png)

## Submit a Proposal {: #submit-a-proposal } 

### Get the Hash and Encoded Proposal {: #submit-the-preimage-hash } 

You can submit a proposal using via [DemocracyInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank} if you have the hash of the proposal. You can also submit the preimage via the precompile if you have the encoded proposal. To get the proposal hash and the encoded proposal, take the following steps in [Polkadot.JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank}:

 1. Select an account (any account is fine because you're not submitting any transaction here)
 2. Choose the pallet you want to interact with and the dispatchable function (or action) to propose. The action you choose will determine the fields that need to fill in the following steps. In this example, it is the `system` pallet and the `remark` function
 3. Enter the text of the remark, ensuring it is unique. Duplicate proposals such as "Hello World!" will not be accepted
 4. Copy the preimage hash. This represents the proposal. You will use this hash when submitting the proposal via the Democracy precompile
 5. Click the **Submit preimage** button but don't sign or confirm the transaction on the next page 

![Get the proposal hash](/images/builders/tools/precompiles/democracy/democracy-7.png)

On the next screen, take the following steps:

 1. Press the triangle icon to reveal the encoded proposal in bytes
 2. Copy the encoded proposal - you'll need this when calling the **note_preimage** function in a later step

![Get the encoded proposal](/images/builders/tools/precompiles/democracy/democracy-8.png)

!!! note
     You should NOT sign and submit the transaction here. You will submit this information via the **note_preimage** function in a later step.  

### Call the Propose Function {: #call-the-propose-function }

1. Expand the Democracy precompile contract to see the available functions. Remember, we are not deploying a contract here, instead we are accessing a precompiled contract that is already deployed
2. Find the **propose** function press the button to expand the section
3. Enter the hash of the proposal
4. Enter the value in WEI of the tokens to bond.  {{ networks.moonbase.democracy.min_deposit }} DEV / {{ networks.moonriver.democracy.min_deposit }} MOVR or {{ networks.moonbeam.democracy.min_deposit }} GLMR is the minimum. For this example 4 DEV or `4000000000000000000` was entered
5. Press **transact** and confirm the transaction in MetaMask

![Call the propose function](/images/builders/tools/precompiles/democracy/democracy-9.png)

### Submit the Preimage {: #submit-the-preimage }

At this step, you'll take the encoded proposal that you got from [Polkadot.JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank} and submit it via the **note_preimage** function of the democracy precompile. Despite its name, the preimage is not required to be submitted before the proposal. However, submitting the preimage is required before a proposal can be enacted. To submit the preimage via the **note_preimage** function, take the following steps:

1. Expand the Democracy precompile contract to see the available functions 
2. Find the **note_preimage** function press the button to expand the section
3. Copy the encoded proposal that you noted in the the prior section. Note, the encoded proposal is not the same as the preimage hash. Ensure you are are entering the correct value into this field
4. Press **transact** and confirm the transaction in MetaMask

![Submit the preimage](/images/builders/tools/precompiles/democracy/democracy-10.png)

After your transaction has been confirmed you can return to the Democracy section of [Polkadot.JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank} to see your proposal listed in the proposal queue.

## Second a Proposal {: #second-a-proposal } 

Seconding a proposal allows it to move to referendum status and requires a bond equivalent to the bond furnished by the proposer. Seconded proposals transition to referendum status once per launch period, which is approximately ({{ networks.moonbase.democracy.launch_period.days}} day in Moonbase Alpha and Moonriver, and {{ networks.moonbeam.democracy.launch_period.days}} days in Moonbeam). 

### Get the Proposal Index {: #get-the-proposal-index } 

First, you'll need to gather some information about the proposal you wish to second. Since you submitted a proposal in the prior step, there should be at least one proposal in the queue. To get the index of that proposal, head to [Polkadot.JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank} and take the following steps:

1. Navigate to the **Governance** Tab
2. Click on **Democracy**
3. Look for the **Proposals** section and click on the triangle icon to see more details about a proposal
4. Take note of the proposal number - this is the first parameter you'll need
5. Take note of the number of existing seconds. If there are none, this space will be empty

![Get the proposal information](/images/builders/tools/precompiles/democracy/democracy-4.png)

### Call the Second Function {: #call-the-second-function } 

Now, you're ready to return to Remix to second the proposal via the democracy precompile. To do so, take the following steps:

1. Expand the Democracy precompile contract to see the available functions if it is not already open
2. Find the **second** function press the button to expand the section
3. Enter the index of the proposal to second
4. Although you noted the exact number of seconds the proposal already has above, the parameter needed is an upper bound. To avoid gas estimation errors, you should enter a number that is significantly larger than the actual number of seconds. `10` was entered in this example
5. Press **transact** and confirm the transaction in MetaMask

And that's it! To review your seconded proposal, you can re-visit [Polkadot.JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank} and look for your account in the list of seconds.  

![Second via the precompile](/images/builders/tools/precompiles/democracy/democracy-5.png)

!!! note
    Proposal index numbers are not the same as referendum index numbers. When a proposal moves to referendum status, it will be assigned a new referendum index number.  

## Vote on a Referendum {: #vote-on-a-referendum } 

Seconded proposals transition to referendum status once per launch period, which is approximately {{ networks.moonbase.democracy.launch_period.days}} day in Moonbase Alpha and Moonriver, and {{ networks.moonbeam.democracy.launch_period.days}} days in Moonbeam. If there are no active referenda currently up for vote in Moonbase Alpha, you may need to wait for the launch period to pass for the proposal you seconded in the prior step to make it to referendum status.

### Get the Referendum Index {: #get-the-referendum-index } 

First, you'll need to get the index of the referendum you wish to vote on. Remember, the proposal index is not the same as the referendum index. To get the index of a referendum, head to [Polkadot.JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank} and take the following steps:

1. Navigate to the **Governance** Tab
2. Click on **Democracy**
3. Look for the **Referenda** section and click on the triangle icon to see more details about a referendum. If there is no triangle icon, this means that only a proposal hash, and no preimage has been submitted for the proposal
4. Take note of the referendum index

![Get the referendum index](/images/builders/tools/precompiles/democracy/democracy-12.png)

### Call the Standard Vote Function {: #call-the-standard-vote-function } 

Now, you're ready to return to Remix to vote on the referendum via the democracy precompile. To do so, take the following steps:

1. Expand the Democracy precompile contract to see the available functions if it is not already open
2. Find the **standard_vote** function press the button to expand the section
3. Enter the index of the referendum to vote on
4. Enter 0 for nay or 1 for aye. In the context of a referendum, nay is a vote to keep the status quo unchanged. Aye is a vote to enact the action proposed by the referendum
5. Enter the number of tokens to lock in WEI. Avoid entering your full balance here because you need to pay for transaction fees
6. Enter a conviction between 0-6 inclusive that represents the desired lock period for the tokens committed to the vote, where 0 represents no lock period and 6 represents the maximum lock period. For more information on lock periods, see [voting on a proposal](/tokens/governance/voting/)
7. Press transact and confirm the transaction in MetaMask

![Call the vote function](/images/builders/tools/precompiles/democracy/democracy-13.png)

And that's it! You've completed your introduction to the democracy precompile. There are a few more functions that are documented in [DemocracyInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank} — feel free to reach out on [Discord](https://discord.gg/moonbeam){target=_blank} if you have any questions about those functions or any other aspect of the democracy precompile.
