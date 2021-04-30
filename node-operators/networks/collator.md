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

## Tech Requirements

From a technical perspective, collators must meet the following requirements:

 - Have a full node running with the collation options. To do so, follow [this tutorial](/node-operators/networks/full-node/) considering the specific code snippets for collators
 - Enable the telemetry server for your full node. To do so, follow [this tutorial](/node-operators/networks/telemetry/)

## Account and Staking Requirements

Similar to Polkadot validators, you need to create an account (although in this case, it's an H160 account) and have a nominated stake (DEV tokens) in order to collate. The slots are currently limited to {{ networks.moonbase.collators_slots }}, but may be increased over time.  

Collators need to have a minimum of {{ networks.moonbase.staking.collator_min_stake }} DEV to be considered eligible (become a candidate). Only the top {{ networks.moonbase.staking.max_collators }} collators by nominated stake will be in the active set.  

!!! note
    Currently, creating or importing an account in PolkadotJS via a mnemonic seed will result in a different public address if you later try to import this account to an Ethereum wallet such as MetaMask. This is because PolkadotJS uses BIP39, whereas Ethereum uses BIP32 or BIP44. 

## Account in PolkadotJS

A collator has an account associated with its collation activities. This account is used to identify him as a block producer and send the payouts from block rewards.

Currently, you have two ways of proceeding in regards having an account in [PolkadotJS](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts):

 - Importing an existing (or create a new) H160 account from external wallets or services such as [MetaMask](/integrations/wallets/metamask/) and [MathWallet](/integrations/wallets/mathwallet/)
 - Create a new H160 account with [PolkadotJS](/integrations/wallets/polkadotjs/)

Once you have an H160 account imported to PolkadotJS, you should see it under the "Accounts" tab. Make sure you have your public address at hand (`PUBLIC_KEY`), as it is needed to configure your [deploy your full node](/node-operators/networks/full-node/) with the collation options.

![Account in PolkadotJS](/images/fullnode/collator-polkadotjs1.png)

## Become a Collator Candidate

Once your node is running, and in sync with the network, you become a collator candidate by following the steps below in [PolkadotJS](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts):

 1. Navigate to the "Developers" tab and click on "Extrinsics"
 2. Select the account you want associated with your collation activities
 3. Confirm your collator account is funded with at least {{ networks.moonbase.staking.collator_min_stake }} DEV tokens plus some extra for transaction fees 
 4. Select `parachainStaking` pallet under the "submit the following extrinsics" menu
 5. Open the drop-down menu, which lists all the possible extrinsics related to staking, and select the `joinCandidates()` function
 6. Set the bond to at least {{ networks.moonbase.staking.collator_min_stake }}, which is the minimum amount to be considered a collator candidate. Only collator bond counts for this check. Additional nominations do not count
 7. Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account

![Join Collators pool PolkadotJS](/images/fullnode/collator-polkadotjs2.png)

!!! note
    Function names and the minimum bond requirement are subject to change in future releases.

As mentioned before, only the top {{ networks.moonbase.staking.max_collators }} collators by nominated stake will be in the active set. 

## Stop Collating

Similar to Polkadot's `chill()` function, to leave the collator's candidate pool, follow the same steps as before but select the `leaveCandidates()` function in step 5.


## Timings

The following table presents some of the timings in regards to different actions related to collation activities:

|                Action               |   |   Rounds  |   |   Hours  |
|:-----------------------------------:|:-:|:---------:|:-:|:--------:|
|  Join/leave collator candidates     |   |     2     |   |    4     |
|      Add/remove nominations         |   |     1     |   |    2     |
|Rewards payouts (after current round)|   |     2     |   |    4     |


!!! note 
    The values presented in the previous table are subject to change in future releases.

## We Want to Hear From You

If you have any feedback regarding running a collator or any other Moonbeam related topic, feel free to reach out through our official development [Discord server](https://discord.com/invite/PfpUATX).
