---
title: Collators
description: Instructions on how to become a collator in the Moonbeam Network once you are running a node
---

# Run a Collator on Moonbeam

![Collator Moonbeam Banner](/images/fullnode/collator-banner.png)

## Introduction

Collators are members of the network that maintain the parachains they take part in. They run a full node (for both their particular parachain and the relay chain), and they produce the state transition proof for relay chain validators.

With the release of Moonbase Alpha v6, users can spin up not only full nodes but they can also activate the `collate` feature and participate in the ecosystem as collators.

This guide will take you through the steps of spinning up your collator node, which is an extension of a full node.

## Requirements

From a technical perspective, collators must meet the following requirements:

 - Have a full node running with the collation options. To do so, follow [this tutorial](/node-operators/networks/full-node/) considering the specific code snippets for collators
 - Enable the telemetry server for your full node. To do so, follow [this tutorial](/node-operators/networks/telemetry/)
 - TODO > Add more requirements?

## Account and Staking Requirements

Similar to Polkadot validators, you need to create an account (although in this case, it's an H160 account) and have a nominated stake (DEV tokens) in order to collate. The slots are currently limited to {{ networks.moonbase.collators_slots }}, but may be increased over time.  

Validators need to have a minimum of {{ networks.moonbase.collator_min_stake }} DEV to be considered eligible to be a collator (for example, become a candidate). Only the top {{ networks.moonbase.collator_slots }} collators by nominated stake will be in the active set.  

## Account in PolkadotJS

A collator has an account associated with its collation activities. This account is used to identify him as a block producer and send the payouts from block rewards.

Currently, you have two ways of proceeding in regards to the account:

 - Importing an existing (or create a new) H160 account from external wallets or services such as [MetaMask](/integrations/wallets/metamask/) and [MathWallet](/integrations/wallets/mathwallet)
 - Create a new H160 account with [PolkadotJS](/integrations/wallets/polkadotjs/)

Once you have an H160 account imported to PolkadotJS, you should see it under the "Accounts" tab. Make sure you have your public address at hand (`PUBLIC_KEY`), as it is needed to configure your [deploy your full node](/node-operators/networks/full-node/) with the collation options.

![Account in PolkadotJS](/images/fullnode/collator-polkadotjs1.png)

## Become a Collator Candidate

Once your node is running, and in sync with the network, you become a collator candidate by following the steps below:

1. Navigate to the "Developers" tab and click on "Extrinsics"
2. Select the account you want associated with your collation activities
3. Confirm your collator account is funded with at least {{ networks.moonbase.collator_min_stake }} DEV tokens plus some extra for transaction fees 
4. Select "stake" under the "submit the following extrinsics" menu
5. Open the drop-down menu, which lists all the possible extrinsics related to staking, and select the `joinCandidates()` function
6. Set the fee to {{networks.moonbase.per_bill_fee}}. The fee is related to TODO
7. Set the bond to at least {{ networks.moonbase.collator_min_stake }}, which is the minimum amount to be considered a collator candidate. Only collator bond counts for this check. Additional nominations do not count
8. Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account

![Join Collators pool PolkadotJS](/images/fullnode/collator-polkadotjs2.png)

!!! note
    Function names and the minimum bond requirement are subject to change in future releases.

As mentioned before, only the top {{ networks.moonbase.collator_slots }} collators by nominated stake will be in the active set. 

To leave the collator's candidate pool, follow the same steps as before but select the `leaveCandidates()` function in step 4.


## Timings

The following table presents some of the timings in regards to different actions related to collation activities:
TODO >  check timings (it might be x2)

|                Action               |   |   Rounds  |   |   Hours  |
|:-----------------------------------:|:-:|:---------:|:-:|:--------:|
|  Join/leave collator candidates     |   |     2     |   |    2     |
|      Add/remove nominations         |   |     1     |   |    1     |
|Rewards payouts (after current round)|   |     2     |   |    2     |


!!! note 
    The values presented in the previous table are subject to change in future releases.


You may nominate your collator with another account you control or solicit nominations from others.  The top {{ networks.moonbase.collator_slots }} collators by total stake (including nominations) will be active for the next round.  Use the `stake.nominateNew()` function only to select a new collator to nominate. Use `stake.nominatorBondMore()` and `stake.nominatorBondLess()` to adjust the bond associated with an already nominated collator. 
6. It may take up to 2 hours to get in the active set (if you have enough stake)
7. The only way to see the active set now is to run a query against the [chain state](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/chainstate).  The query is still called `stake.validators()` although this will change to `stake.collators()` in a future release 
8. Block production is a random subsection of collators, but within that subsection speed matters.  A collator who can calculate and submit blocks faster than it's peers will author more blocks and generate more rewards

## We Want to Hear From You

If you have any feedback regarding running a collator or any other Moonbeam related topic, feel free to reach out through our official development [Discord server](https://discord.com/invite/PfpUATX).
