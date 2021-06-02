---
title: Collators
description: Instructions on how to become a collator in the Moonbeam Network once you are running a node
---

# Run a Collator on Moonbeam

![Collator Moonbeam Banner](/images/fullnode/collator-banner.png)

## Introduction

Collators are members of the network that maintain the parachains they take part in. They run a full node (for both their particular parachain and the relay chain), and they produce the state transition proof for relay chain validators.

With the release of Moonbase Alpha v6, users can spin up full nodes and activate the `collate` feature and participate in the ecosystem as collators.

Moonbeam uses the [Nimbus Parachain Consensus Framework](/learn/consensus/). This provides a two-step filter to allocate collators to a block production slot:

 - The parachain staking filter selects the top {{ networks.moonbase.staking.max_collators }} collators in terms of tokens staked in the network. This filtered pool is called selected candidates, and selected candidates are rotated every round
 - The fixed size subset filter picks a pseudo-random subset of the previously selected candidates for each block production slot

This guide will take you through the following steps:

 - **[Technical requirements](#technical-requirements)** — shows you the criteria you must meet from a technical perspective
 - **[Accounts and staking requirements](#accounts-and-staking-requirements)** — goes through the process of getting your account set up and bond tokens to become a collator candidate
 - **[Generate session keys](#generate-session-keys)** — explains how to generate session keys, used to map your author ID with your H160 account
 - **[Map author ID to your account](#map-author-id-to-your-account)** — outlines the steps to map your public session key to your H160 account, where block rewards will be paid to

## Technical Requirements

From a technical perspective, collators must meet the following requirements:

 - Have a full node running with the collation options. To do so, follow the [spin up a full node tutorial](/node-operators/networks/full-node/), considering the specific code snippets for collators
 - Enable the telemetry server for your full node. To do so, follow the [telemetry tutorial](/node-operators/networks/telemetry/)

## Accounts and Staking Requirements

Similar to Polkadot validators, you need to create an account. For Moonbeam, this is an H160 account or basically an Ethereum style account from which you hold the private keys. In addition, you need a nominated stake (DEV tokens) to collate. The slots are currently limited to {{ networks.moonbase.collators_slots }} but may be increased over time.  

Collators need to have a minimum of {{ networks.moonbase.staking.collator_min_stake }} DEV to be considered eligible (become a candidate). Only the top {{ networks.moonbase.staking.max_collators }} collators by nominated stake will be in the active set.   

### Account in PolkadotJS

A collator has an account associated with its collation activities. This account mapped to an author ID to identify him as a block producer and send the payouts from block rewards. 

Currently, you have two ways of proceeding in regards having an account in [PolkadotJS](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts):

 - Importing an existing (or create a new) H160 account from external wallets or services such as [MetaMask](/integrations/wallets/metamask/) and [MathWallet](/integrations/wallets/mathwallet/)
 - Create a new H160 account with [PolkadotJS](/integrations/wallets/polkadotjs/)

Once you have an H160 account imported to PolkadotJS, you should see it under the "Accounts" tab. Make sure you have your public address at hand (`PUBLIC_KEY`), as it is needed to configure your [deploy your full node](/node-operators/networks/full-node/) with the collation options.

![Account in PolkadotJS](/images/fullnode/collator-polkadotjs1.png)

### Become a Collator Candidate

Once your node is running and in sync with the network, you become a collator candidate by following the steps below in [PolkadotJS](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.testnet.moonbeam.network#/accounts):

 1. Navigate to the "Developers" tab and click on "Extrinsics"
 2. Select the account you want to be associated with your collation activities
 3. Confirm your collator account is funded with at least {{ networks.moonbase.staking.collator_min_stake }} DEV tokens plus some extra for transaction fees 
 4. Select `parachainStaking` pallet under the "submit the following extrinsics" menu
 5. Open the drop-down menu, which lists all the possible extrinsics related to staking, and select the `joinCandidates()` function
 6. Set the bond to at least {{ networks.moonbase.staking.collator_min_stake }}, which is the minimum amount to be considered a collator candidate. Only collator bond counts for this check. Additional nominations do not count
 7. Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account

![Join Collators pool PolkadotJS](/images/fullnode/collator-polkadotjs2.png)

!!! note
    Function names and the minimum bond requirement are subject to change in future releases.

As mentioned before, only the top {{ networks.moonbase.staking.max_collators }} collators by nominated stake will be in the active set. 

### Stop Collating

Similar to Polkadot's `chill()` function, to leave the collator's candidate pool, follow the same steps as before but select the `leaveCandidates()` function in step 5.


### Timings

The following table presents some of the timings in regards to different actions related to collation activities:

|                Action               |   |   Rounds  |   |   Hours  |
|:-----------------------------------:|:-:|:---------:|:-:|:--------:|
|  Join/leave collator candidates     |   |     2     |   |    4     |
|      Add/remove nominations         |   |     1     |   |    2     |
|Rewards payouts (after current round)|   |     2     |   |    4     |


!!! note 
    The values presented in the previous table are subject to change in future releases.

## Session Keys

With the release of [Moonbase Alpha v8](/networks/testnet/), collators will sign blocks using an author ID, which is basically a [session key](https://wiki.polkadot.network/docs/en/learn-keys#session-keys). To match the Substrate standard, Moonbeam collator's session keys are [SR25519](https://wiki.polkadot.network/docs/en/learn-keys#what-is-sr25519-and-where-did-it-come-from). This guide will show you how you can create/rotate your session keys associated to your collator node.

First, make sure you're [running a collator node](/node-operators/networks/full-node/) and you have exposed the RPC ports. Once you have your collator node running, your terminal should print similar logs:

![Collator Terminal Logs](/images/fullnode/collator-terminal1.png)

Next, session keys can be rotated by sending an RPC call to the HTTP endpoint with the `author_rotateKeys` method. For reference, if your collator's HTTP endpoint is at port `9933`, the JSON-RPC call might look like this:

```
curl http://127.0.0.1:9933 -H \
"Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"author_rotateKeys",
    "params": []
  }'
```

The collator node should respond with the corresponding public key of the new author ID (session key).

![Collator Terminal Logs RPC Rotate Keys](/images/fullnode/collator-terminal2.png)

Make sure you write down this public key of the author ID. Next, this will be mapped to an H160 Ethereum-styled address to which the block rewards are paid.

## Map Author ID to your Account

Once you've generated your author ID (session keys), the next step is to map it to your H160 account (an Ethereum-styled address). Make sure you hold the private keys to this account, as this is where the block rewards are paid out to.

There is a {{ networks.moonbase.staking.collator_map_bond }} DEV tokens bond that is sent when mapping your authord ID with your account. This bond is per author ID registered.

The `authorMapping` module has the following extrinsics programmed:

 - **addAssociation** — one input: author ID. Maps your author ID to the H160 account from which the transaction is being sent, ensuring is the true owner of its private keys. It requires a {{ networks.moonbase.staking.collator_map_bond }} DEV tokens bond
 - **clearAssociation** — one input: author ID. Clears the association of an author ID to the H160 account from which the transaction is being sent, which needs to be the owner of that author ID. Also refunds the {{ networks.moonbase.staking.collator_map_bond }} DEV tokens bond
 - **updateAssociation** — two inputs: old and new author IDs. Updates the mapping from an old author ID to a new one. Useful after a key rotation or migration. It executes both the `add` and `clear` association extrinsics atomically, enabling key rotation without needing a second bond

The module also adds the following RPC calls (chain state):

- **mapping** — one optional input: author ID. Displays all mappings stored on-chain, or only that related to the input if provided

### Mapping Extrinsic

To map your author ID to your account, you need to be inside the selected candidates pool. Once you are a selected candidate, you need to send a mapping extrinsic (transaction). Note that this will bond {{ networks.moonbase.staking.collator_map_bond }} DEV tokens, and this is per author ID registered. To do so, take the following steps:

 1. Head to the "Developer" tab
 2. Select the "Extrinsics" option
 3. Choose the account that you want to map your author ID to be associated with, from which you'll sign this transaction
 4. Select the `authorMapping` extrinsic
 5. Set the method to `addAssociation()`
 6. Enter the author ID. In this case, it was obtained via the RPC call `author_rotateKeys` in the previous section
 7. Click on "Submit Transaction"

![Author ID Mapping to Account Extrinsic](/images/fullnode/collator-polkadotjs3.png)

If the transaction is successful, you will see a confirmation notification on your screen. On the contrary, make sure you are inside the selected candidates.

![Author ID Mapping to Account Extrinsic Successful](/images/fullnode/collator-polkadotjs4.png)

### Checking the Mappings

You can also check the current on-chain mappings by verifying the chain state. To do so, take the following steps:

 1. Head to the "Developer" tab
 2. Select the "Chain state" option
 3. Choose `authorMapping` as the state to query. Currently, there is only one method programmed (`mapping`)
 4. Optionally, provide an author ID to query, or press the slider to retrieve all on-chain mappings
 5. Click on the "+" button to send the RPC call

![Author ID Mapping Chain State](/images/fullnode/collator-polkadotjs5.png)

If no author ID was included, this would return all the mappings stored on-chain, where you can verify that your author ID is correctly mapped to your H160 account.