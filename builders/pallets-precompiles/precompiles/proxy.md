---
title: Interacting with the Proxy Precompile on Moonbeam
description: How to use the Moonbeam proxy Solidity precompile interface to make substrate calls on an account's behalf
keywords: solidity, ethereum, proxy, moonbeam, precompiled, contracts, substrate
---

# Interacting with the Proxy Precompile

![Proxy Moonbeam Banner](/images/builders/pallets-precompiles/precompiles/proxy/proxy-banner.png)

## Introduction {: #introduction } 

The proxy precompile on Moonbeam allows accounts to set proxy accounts that can perform specific limited actions on their behalf, such as governance, staking, or balance transfers.

If a user wanted to provide a second user access to a limited number of actions on their behalf, traditionally the only method to do so would be by providing the first account's private key to the second. However, Moonbeam has included the [Substrate proxy pallet](https://wiki.polkadot.network/docs/learn-proxies){target=_blank}, which enables proxy accounts. Proxy accounts ought to be used due to the additional layer of security that they provide, where many accounts can do actions for a main account. This is best if for example a user wanted to keep their wallet safe in cold storage but still wanted to access parts of the wallet's functionality like governance or staking.

The proxy precompile is located at the following address:

=== "Moonbase Alpha"
     ```
     {{networks.moonbase.precompiles.proxy}}
     ```

## The Proxy Solidity Interface {: #the-proxy-solidity-interface } 

[`Proxy.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/proxy/Proxy.sol){target=_blank} is an interface through which Solidity contracts can interact with the proxy pallet. You will not have to be familiar with the Substrate API, since you can interact with it using the Ethereum interface you're familiar with.

The interface includes the following functions:

 - **addProxy**(*address* delegate, *ProxyType* proxyType, *uint32* delay) — registers a proxy account for the sender after a specified number of delay blocks (generally zero)
 - **removeProxy**(*address* delegate, *ProxyType* proxyType, *uint32* delay) — removes a registered proxy for the sender
 - **removeProxies**() — removes all of the proxy accounts delegated to the sender
 - **isProxy**(*address* real, *address* delegate, *ProxyType* proxyType, *uint32* delay) — returns a boolean, true if the delegate address is a proxy of type proxyType, for address real, with the specified delay
 
## Proxy Types {: #proxy-types }

There are multiple types of proxy roles that can be delegated to accounts, where are represented in `Proxy.sol` through the `ProxyType` enum. The following list includes all of the possible proxies and the type of transactions they can make on behalf of the delegator account:

 - **Any** — the any proxy will allow the proxy account to make any type of transaction
 - **NonTransfer** — the non-transfer proxy will allow the proxy account to make any type of transaction, except for balance transfers
 - **Governance** - the governance proxy will allow the proxy account to make any type of governance related transaction (includes both democracy or council pallets)
 - **Staking** - the staking proxy will allow the proxy account to make staking related transactions
 - **CancelProxy** - the cancel proxy will allow the proxy account to reject and remove delayed proxy announcements (of the delegator account)
 - **Balances** - the balances proxy will allow the proxy account to only make balance transfers
 - **AuthorMapping** - ???
 - **IdentityJudgement** - the identity judgement proxy will allow the proxy account to judge and certify the personal information associated with accounts on Polkadot

## Interact with the Solidity Interface {: #interact-with-the-solidity-interface }

### Checking Prerequisites {: #checking-prerequisites } 

The below example is demonstrated on Moonbase Alpha, however, similar steps can be taken for Moonbeam and Moonriver. Before diving into the interface, it's best if you're familiar with [how to propose an action](/tokens/governance/proposals/){target=_blank} and [how to vote on a proposal](/tokens/governance/voting/){target=_blank} on Moonbeam. Additionally, you should:  

 - Have MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - Have an account with some DEV tokens.
 --8<-- 'text/faucet/faucet-list-item.md'

### Remix Set Up {: #remix-set-up } 

1. Get a copy of [`DemocracyInterface.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank}
2. Copy and paste the file contents into a [Remix file](https://remix.ethereum.org/){target=_blank} named `Democracy.sol`

![Copying and Pasting the Democracy Interface into Remix](/images/builders/pallets-precompiles/precompiles/democracy/democracy-1.png)

### Compile the Contract {: #compile-the-contract } 

1. Click on the **Compile** tab, second from top
2. Then to compile the interface, click on **Compile Democracy.sol**

![Compiling DemocracyInteface.sol](/images/builders/pallets-precompiles/precompiles/democracy/democracy-2.png)

### Access the Contract {: #access-the-contract } 

1. Click on the **Deploy and Run** tab, directly below the **Compile** tab in Remix. Note: you are not deploying a contract here, instead you are accessing a precompiled contract that is already deployed
2. Make sure **Injected Web3** is selected in the **ENVIRONMENT** drop down
3. Ensure **Democracy.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract there is no need to deploy, instead you are going to provide the address of the precompile in the **At Address** Field
4. Provide the address of the democracy precompile for Moonbase Alpha: `{{networks.moonbase.precompiles.democracy}}` and click **At Address**
5. The democracy precompile will appear in the list of **Deployed Contracts**

![Provide the address](/images/builders/pallets-precompiles/precompiles/democracy/democracy-3.png)

### Submit a Proposal {: #submit-a-proposal } 

You can submit a proposal via the [democracy precompile](https://github.com/PureStake/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank} if you have the hash of the proposal. You can also submit the preimage if you have the encoded proposal. To get the proposal hash and the encoded proposal, navigate to the **Democracy** tab of [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank}, click on **+ Submit preimage**, and take the following steps:

 1. Select an account (any account is fine because you're not submitting any transaction here)
 2. Choose the pallet you want to interact with and the dispatchable function (or action) to propose. The action you choose will determine the fields that need to fill in the following steps. In this example, it is the **system** pallet and the **remark** function
 3. Enter the text of the remark, ensuring it is unique. Duplicate proposals such as "Hello World!" will not be accepted
 4. Copy the preimage hash. This represents the proposal. You will use this hash when submitting the proposal via the democracy precompile
 5. Click the **Submit preimage** button but don't sign or confirm the transaction on the next page 

![Get the proposal hash](/images/builders/pallets-precompiles/precompiles/democracy/democracy-4.png)

On the next screen, take the following steps:

 1. Press the triangle icon to reveal the encoded proposal in bytes
 2. Copy the encoded proposal - you'll need this when calling the **notePreimage** function in a later step

![Get the encoded proposal](/images/builders/pallets-precompiles/precompiles/democracy/democracy-5.png)

!!! note
     You should NOT sign and submit the transaction here. You will submit this information via the **notePreimage** function in a later step.  

Next you can call the `propose` function of the Solidity interface by taking the following steps:

1. Expand the democracy precompile contract to see the available functions
2. Find the **propose** function and press the button to expand the section
3. Enter the hash of the proposal
4. Enter the value in Wei of the tokens to bond. The minimum bond is {{ networks.moonbeam.democracy.min_deposit }} GLMR, {{ networks.moonriver.democracy.min_deposit }} MOVR, or {{ networks.moonbase.democracy.min_deposit }} DEV. For this example 4 DEV or `4000000000000000000` was entered
5. Press **transact** and confirm the transaction in MetaMask

![Call the propose function](/images/builders/pallets-precompiles/precompiles/democracy/democracy-6.png)

Now you can take the encoded proposal that you got from [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank} and submit it via the `notePreimage` function of the democracy precompile. Despite its name, the preimage is not required to be submitted before the proposal. However, submitting the preimage is required before a proposal can be enacted. To submit the preimage via the `notePreimage` function, take the following steps:

1. Expand the democracy precompile contract to see the available functions 
2. Find the **notePreimage** function and press the button to expand the section
3. Copy the encoded proposal that you noted in the prior section. Note, the encoded proposal is not the same as the preimage hash. Ensure you are are entering the correct value into this field
4. Press **transact** and confirm the transaction in MetaMask

![Submit the preimage](/images/builders/pallets-precompiles/precompiles/democracy/democracy-7.png)

After your transaction has been confirmed you can return to the **Democracy** section of [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank} to see your proposal listed in the proposal queue.

### Second a Proposal {: #second-a-proposal } 

Seconding a proposal allows it to move to referendum status and requires a bond equivalent to the bond furnished by the proposer. Seconded proposals transition to referendum status once per launch period, which is approximately {{ networks.moonbeam.democracy.launch_period.days}} days on Moonbeam, {{ networks.moonriver.democracy.launch_period.days}} day on Moonriver, and {{ networks.moonbase.democracy.launch_period.days}} day on Moonbase Alpha.

First, you'll need to gather some information about the proposal you wish to second. Since you submitted a proposal in the prior step, there should be at least one proposal in the queue. To get the index of that proposal, head to [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank} and take the following steps:

1. Navigate to the **Governance** tab
2. Click on **Democracy**
3. Look for the **Proposals** section and click on the triangle icon to see more details about a proposal
4. Take note of the proposal number - this is the first parameter you'll need
5. Take note of the number of existing seconds. If there are none, this space will be empty

![Get the proposal information](/images/builders/pallets-precompiles/precompiles/democracy/democracy-8.png)

Now, you're ready to return to Remix to second the proposal via the democracy precompile. To do so, take the following steps:

1. Expand the democracy precompile contract to see the available functions if it is not already open
2. Find the **second** function and press the button to expand the section
3. Enter the index of the proposal to second
4. Although you noted the exact number of seconds the proposal already has above, the parameter needed is an upper bound. To avoid gas estimation errors, you should enter a number that is significantly larger than the actual number of seconds. `10` was entered in this example
5. Press **transact** and confirm the transaction in MetaMask

And that's it! To review your seconded proposal, you can revisit [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank} and look for your account in the list of seconds.  

![Second via the precompile](/images/builders/pallets-precompiles/precompiles/democracy/democracy-9.png)

!!! note
    Proposal index numbers are not the same as referendum index numbers. When a proposal moves to referendum status, it will be assigned a new referendum index number.  

### Vote on a Referendum {: #vote-on-a-referendum } 

Seconded proposals transition to referendum status once per launch period, which is approximately {{ networks.moonbeam.democracy.launch_period.days}} days on Moonbeam, {{ networks.moonriver.democracy.launch_period.days}} day on Moonriver, and {{ networks.moonbase.democracy.launch_period.days}} day on Moonbase Alpha. If there are no active referenda currently up for vote on Moonbase Alpha, you may need to wait for the launch period to pass for the proposal you seconded in the prior step to make it to referendum status.

First, you'll need to get the index of the referendum you wish to vote on. Remember, the proposal index is not the same as the referendum index. To get the index of a referendum, head to [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/democracy){target=_blank} and take the following steps:

1. Navigate to the **Governance** Tab
2. Click on **Democracy**
3. Look for the **Referenda** section and click on the triangle icon to see more details about a referendum. If there is no triangle icon, this means that only a proposal hash, and no preimage has been submitted for the proposal
4. Take note of the referendum index

![Get the referendum index](/images/builders/pallets-precompiles/precompiles/democracy/democracy-10.png)

Now, you're ready to return to Remix to vote on the referendum via the democracy precompile. To do so, take the following steps:

1. Expand the democracy precompile contract to see the available functions if it is not already open
2. Find the **standardVote** function and press the button to expand the section
3. Enter the index of the referendum to vote on
4. Leave the field empty for **nay** or input `1` for **aye**. In the context of a referendum, nay is a vote to keep the status quo unchanged. Aye is a vote to enact the action proposed by the referendum
5. Enter the number of tokens to lock in Wei. Avoid entering your full balance here because you need to pay for transaction fees
6. Enter a conviction between 0-6 inclusive that represents the desired lock period for the tokens committed to the vote, where 0 represents no lock period and 6 represents the maximum lock period. For more information on lock periods, see [voting on a proposal](/tokens/governance/voting/){target=_blank}
7. Press **transact** and confirm the transaction in MetaMask

![Call the vote function](/images/builders/pallets-precompiles/precompiles/democracy/democracy-11.png)

And that's it! You've completed your introduction to the democracy precompile. There are a few more functions that are documented in [`DemocracyInterface.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/pallet-democracy/DemocracyInterface.sol){target=_blank} — feel free to reach out on [Discord](https://discord.gg/moonbeam){target=_blank} if you have any questions about those functions or any other aspect of the democracy precompile.
