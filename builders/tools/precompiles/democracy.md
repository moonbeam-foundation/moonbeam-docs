---
title: Democracy Precompile
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

This guide will show you how to interact with the Democracy Precompile on Moonbase Alpha but the process is exactly the same for Moonbeam and Moonriver.

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

1. Click on the Deploy and Run tab, directly below the Compile tab in Remix. **Note**: we are not deploying a contract here, instead we are accessing a precompiled contract that is already deployed
2. Make sure **Injected Web3** is selected in the Environment drop down
3. Ensure **DemocracyInterface.sol** is selected in the **Contract** dropdown. Since this is a precompiled contract there is no need to deploy, instead we are going to provide the address of the precompile in the **At Address** Field
4. Provide the address of the democracy precompile for Moonbase Alpha: `{{networks.moonbase.precompiles.democracy}}` and click **At Address**
5. The Democracy precompile will appear in the list of **Deployed Contracts**

![Provide the address](/images/builders/tools/precompiles/democracy/democracy-3.png)

## Submit a Proposal {: #submit-a-proposal } 






## Second a Proposal {: #second-a-proposal } 

Seconding a proposal allows it to move to referendum status and requires a bond equivalent to the bond furnished by the proposer. Seconded proposals transition to referendum status once per launch period, which is approximately ({{ networks.moonbase.democracy.launch_period.days}} day in Moonbase Alpha and Moonriver, and {{ networks.moonbeam.democracy.launch_period.days}} days in Moonbeam). 

### Get the Proposal Index {: #get-the-proposal-index } 

First, you'll need to gather some information about the proposal you wish to second. If there are no proposals in the queue, you'll [need to submit a proposal](/tokens/governance/proposals/#proposing-an-action). Then, head to [Polkadot.JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank} and take the following steps:

1. Navigate to the **Governance** Tab
2. Click on **Democracy**
3. Look for the **Proposals** section and click on the triangle icon to see more details about a proposal
4. Take note of the proposal number - this is the first parameter you'll need
5. Take note of the number of existing seconds. If there are none, this space will be empty

![Get the proposal information](/images/builders/tools/precompiles/democracy/democracy-4.png)

### Call the Second Function {: #call-the-second-function } 

Now, you're ready to return to Remix to second the proposal via the democracy precompile. To do so, take the following steps:

1. Expand the Democracy precompile contract to see the available functions. Remember, we are not deploying a contract here, instead we are accessing a precompiled contract that is already deployed
2. Find the **second** function press the button to expand the section
3. Enter the index of the proposal to second
4. Although you noted the exact number of seconds the proposal already has above, the parameter needed is an upper bound. To avoid gas estimation errors, you should enter a number that is significantly larger than the actual number of seconds. `10` was entered in this example
5. Press **transact** and confirm the transaction in MetaMask.

And that's it! To review your seconded proposal, you can re-visit [Polkadot.JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank} and look for your account in the list of seconds.  

![Second via the precompile](/images/builders/tools/precompiles/democracy/democracy-5.png)

## Vote on a Proposal {: #vote-on-a-proposal } 

For this example, we'll vote on a proposal in Moonbase Alpha. 

You can do your own research and select the candidate you desire. For this guide, the following candidate address will be used: `{{ networks.moonbase.staking.candidates.address1 }}`.

In order to delegate a candidate, you'll need to determine the current candidate delegation count and delegator delegation count. The candidate delegation count is the number of delegations backing a specific candidate. The delegator delegation account is the number of delegations made by the delegator.
