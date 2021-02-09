---
title: Collators
description: Instructions on how to become a collator in the Moonbeam Network once you are running a node
---

# Run a Collator on Moonbeam

![Full Node Moonbeam Banner](/images/fullnode/fullnode-banner.png)

## Introduction

Collators are member of the network that maintain the parachains they take part of. They run a full node (for both their particular parachain and the relay chain) and they produce the state transition proof for relay chain validators.

With the release of Moonbase Alpha v6, users can spin up not only full nodes, but they can also activate the `collate` feature and participate in the ecosystem as Collators.

This guide will take you through the steps of spining up your own collator node, which is an extension of a full node.

## Requirements

From a technical perspective, collators must meet the following requirements:

 - Have a full node running with the collation options. To do so, follow [this tutorial](/node-operators/networks/full-node/) considering the specific code snippets for collators
 - Enable the telemetry server for your full node. To do so, follow [this tutorial](/node-operators/networks/telemetry/)


## Account and Staking Requirements

Similar to Polkadot validators, you need to create an account (although in this case it's an H160 account) and have nominated stake (DEV tokens) in order to collate.  The slots are currently limited, but may be increased over time.  

Validators need to have a minimum of {{ networks.moonbase.collator_min_stake }} DEV to be considered eligible to be a collator (i.e. get in the waiting pool).  After that the top {{ networks.moonbase.collator_slots }} collators by nominated stake will be the active set.  

Reach out to us on our [Discord channel](https://discord.gg/PfpUATX) if you are interested in becoming a collator. 

## Account in PolkadotJS

A collator has an account associated with its collation activities. This account is used not only to identify him as a block producer, but to proceed with the payouts in regards to block rewards.

Currently, you have two ways of proceeding in regards to the account:

 - Importing an existing (or create a new) H160 account from external wallets or services such as [MetaMask](/integrations/wallets/metamask/) and [MathWallet](/integrations/wallets/mathwallet)
 - Create a new H160 account with PolkadotJS

1. Login to the Moonbase Alpha polkadot.js site.  [https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts}
2. Under Accounts, create a new Ethereum type address from "Private Key".  Mnemonic is not supported with this version of Moonbase Alpha. Save your backup and private key securely.  
3. Record the `PUBLIC_KEY` for use in the configuration below.  
4. Follow the steps below for setting up and configuring the node, then we will return to this site to continue the process.  

## Start / Stop Collating
Once your node is up and running, and in sync with the network, you can begin collating by following the steps below. 
1. Navigate back to [https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts}
2. Confirm your collator account is loaded. 
3. Fund the account with at least {{ networks.moonbase.collator_min_stake }} DEV plus some extra for tx fees. 
4. From your collator account, bond your (self) collator by calling the `stake.joinCandidates()` function.  Set the fee to {{networks.moonbase.per_bill_fee}}, bond to {{ networks.moonbase.collator_min_stake }}.  These numbers may change with future releases but don't adjust them for now. The bond amount is a minimum, you may bond more, but if you bond less you are not considered a valid collator.  Only collator bond counts for this check, additional nominations do not.  
5. You may nominate your collator with another account you control or solicit nominations from others.  The top {{ networks.moonbase.collator_slots }} collators by total stake (including nominations) will be active for the next round.  Use the `stake.nominateNew()` function only to select a new collator to nominate. Use `stake.nominatorBondMore()` and `stake.nominatorBondLess()` to adjust the bond associated with an already nominated collator.  !!!note These function names are subject to change in future releases.
6. It may take up to 2 hours to get in the active set (if you have enough stake)
7. The only way to see the active set now is to run a query against the [chain state](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/chainstate).  The query is still called `stake.validators()` although this will change to `stake.collators()` in a future release.  
8. Block production is a random subsection of collators, but within that subsection speed matters.  A collator who can calculate and submit blocks faster than it's peers will author more blocks and generate more rewards.  


## Timings
!!!note Subject to change

Join or leave collator candidates = 2 rounds = 2 hours
Add or remove nominations = 1 round = 1 hour
Payments = 2 rounds after round ends



## We Want to Hear From You

If you have any feedback regarding running a Collator or any other Moonbeam related topic, feel free to reach out through our official development [Discord server](https://discord.com/invite/PfpUATX).
