---
title: Collators
description: Instructions on how to become a collator in the Moonbeam Network once you are running a node
---

# Run a Collator on Moonbeam

![Collator Moonbeam Banner](/images/node-operators/networks/collators/collator-banner.png)

## Introduction {: #introduction } 

Collators are members of the network that maintain the parachains they take part in. They run a full node (for both their particular parachain and the relay chain), and they produce the state transition proof for relay chain validators.

Users can spin up full nodes on Moonbase Alpha and Moonriver and activate the `collate` feature to participate in the ecosystem as collator candidates. Once a candidate is selected to be in the active set of collators, they are eligible to produce blocks. 

Moonbeam uses the [Nimbus Parachain Consensus Framework](/learn/features/consensus/). This provides a two-step filter to allocate candidates to the active set of collators, then assign collators to a block production slot:

 - The parachain staking filter selects the top {{ networks.moonbase.staking.max_candidates }} candidates on Moonbase Alpha and the top {{ networks.moonriver.staking.max_candidates }} candidates on Moonriver in terms of tokens staked in each network. This filtered pool is called selected candidates, which are rotated every round
 - The fixed size subset filter picks a pseudo-random subset of the previously selected candidates for each block production slot

This guide will take you through the following steps:

 - **[Technical requirements](#technical-requirements)** — shows you the criteria you must meet from a technical perspective
 - **[Accounts and staking requirements](#accounts-and-staking-requirements)** — goes through the process of getting your account set up and bond tokens to become a candidate
 - **[Generate session keys](#generate-session-keys)** — explains how to generate session keys, used to map your author ID with your H160 account
 - **[Map author ID to your account](#map-author-id-to-your-account)** — outlines the steps to map your public session key to your H160 account, where block rewards will be paid to

## Technical Requirements {: #technical-requirements } 

From a technical perspective, collators must meet the following requirements:

 - Have a full node running with the collation options. To do so, follow the [Run a Node](/node-operators/networks/run-a-node/overview/) tutorial, considering the specific code snippets for collators

## Accounts and Staking Requirements {: #accounts-and-staking-requirements } 

Similar to Polkadot validators, you need to create an account. For Moonbeam, this is an H160 account or an Ethereum-style account from which you hold the private keys. In addition, you will need a minimum amount of tokens staked to be considered eligible (become a candidate). Only a certain number of the top collator candidates by delegated stake will be in the active set of collators.

=== "Moonriver"
    |    Variable     |                           Value                           |
    |:---------------:|:---------------------------------------------------------:|
    |   Bond Amount   | {{ networks.moonriver.staking.candidate_bond_min }} MOVR  |
    | Active set size | {{ networks.moonriver.staking.max_candidates }} collators |

=== "Moonbase Alpha"
    |    Variable     |                          Value                           |
    |:---------------:|:--------------------------------------------------------:|
    |   Bond Amount   |  {{ networks.moonbase.staking.candidate_bond_min }} DEV  |
    | Active set size | {{ networks.moonbase.staking.max_candidates }} collators |

### Account in Polkadot.js {: #account-in-polkadotjs } 

A collator has an account associated with its collation activities. This account is mapped to an author ID to identify the collator as a block producer and send the payouts from block rewards. 

Currently, you have two ways of proceeding in regard to having an account in [Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/accounts){target=_blank}:

 - Importing an existing (or create a new) H160 account from external wallets or services such as [MetaMask](/tokens/connect/metamask/) and [MathWallet](/tokens/connect/mathwallet/)
 - Create a new H160 account with [Polkadot.js](/tokens/connect/polkadotjs/)

Once you have an H160 account imported to Polkadot.js, you should see it under the **Accounts** tab. Make sure you have your public address at hand (`PUBLIC_KEY`), as it is needed to configure your [full node](/node-operators/networks/run-a-node/overview/) with the collation options.

![Account in Polkadot.js](/images/node-operators/networks/collators/collator-polkadotjs-1.png)

## Become a Candidate {: #become-a-candidate } 

Before getting started, it's important to note some of the timings of different actions related to collation and delegation activities:

=== "Moonriver"
    |               Variable                |                                                                          Value                                                                          |
    |:-------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |           Leave candidates            |    {{ networks.moonriver.collator_timings.leave_candidates.rounds }} rounds ({{ networks.moonriver.collator_timings.leave_candidates.hours }} hours)    |
    |          Revoke delegations           | {{ networks.moonriver.delegator_timings.revoke_delegations.rounds }} rounds ({{ networks.moonriver.delegator_timings.revoke_delegations.hours }} hours) |
    |     Reduce candidate delegations      |       {{ networks.moonriver.collator_timings.can_bond_less.rounds }} rounds ({{ networks.moonriver.collator_timings.can_bond_less.hours }} hours)       |
    | Rewards payouts (after current round) |    {{ networks.moonriver.delegator_timings.rewards_payouts.rounds }} rounds ({{ networks.moonriver.delegator_timings.rewards_payouts.hours }} hours)    |

=== "Moonbase Alpha"
    |               Variable                |                                                                         Value                                                                         |
    |:-------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
    |           Leave candidates            |    {{ networks.moonbase.collator_timings.leave_candidates.rounds }} rounds ({{ networks.moonbase.collator_timings.leave_candidates.hours }} hours)    |
    |          Revoke delegations           | {{ networks.moonbase.delegator_timings.revoke_delegations.rounds }} rounds ({{ networks.moonbase.delegator_timings.revoke_delegations.hours }} hours) |
    |     Reduce candidate delegations      |     {{ networks.moonriver.delegator_timings.del_bond_less.rounds }} rounds ({{ networks.moonriver.delegator_timings.del_bond_less.hours }} hours)     |
    | Rewards payouts (after current round) |    {{ networks.moonbase.delegator_timings.rewards_payouts.rounds }} rounds ({{ networks.moonbase.delegator_timings.rewards_payouts.hours }} hours)    |



!!! note 
    Joining the collator candidate pool takes effect immediately. Adding or increasing a delegation also takes effect immediately, but rewards payouts are calculated {{ networks.moonriver.delegator_timings.rewards_payouts.rounds }} rounds later. The calculated rewards are then paid out incrementally, once per block, until the total rewards have been paid. In each block, one collator is chosen to receive their reward payout, and is paid along with their delegators. The values presented in the previous table are subject to change in future releases.

### Get the Size of the Candidate Pool {: #get-the-size-of-the-candidate-pool } 

First, you need to get the `candidatePool` size (this can change through governance) as you'll need to submit this parameter in a later transaction. To do so, you'll have to run the following JavaScript code snippet from within [Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/js){target=_blank}:

```js
// Simple script to get candidate pool size
const candidatePool = await api.query.parachainStaking.candidatePool();
console.log(`Candidate pool size is: ${candidatePool.length}`);
```

 1. Head to the **Developer** tab 
 2. Click on **JavaScript**
 3. Copy the code from the previous snippet and paste it inside the code editor box 
 4. (Optional) Click the save icon and set a name for the code snippet, for example, "Get candidatePool size". This will save the code snippet locally
 5. To execute the code, click on the run button
 6. Copy the result, as you'll need it when joining the candidate pool

![Get Number of Candidates](/images/node-operators/networks/collators/collator-polkadotjs-2.png)

### Join the Candidate Pool {: #join-the-candidate-pool } 

Once your node is running and in sync with the network, you become a candidate (and join the candidate pool). Depending on which network you are connected to, head to Polkadot.js for [Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/accounts){target=_blank} or [Moonriver](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.moonriver.moonbeam.network#/accounts){target=_blank} and take the following steps:

 1. Navigate to the **Developer** tab and click on **Extrinsics**
 2. Select the account you want to be associated with your collation activities
 3. Confirm your account is funded with at least the [minimum stake required](#accounts-and-staking-requirements) plus some extra for transaction fees 
 4. Select **parachainStaking** pallet under the **submit the following extrinsic** menu
 5. Open the drop-down menu, which lists all the possible extrinsics related to staking, and select the **joinCandidates()** function
 6. Set the bond to at least the [minimum amount](#accounts-and-staking-requirements) to be considered a candidate. You'll need to enter this amount in `wei`. As an example, the minimum bond of {{ networks.moonbase.staking.candidate_bond_min }} DEV in Moonbase Alpha would be `{{ networks.moonbase.staking.candidate_bond_min_wei }}` (21 zeros) in wei. For Moonriver, the minimum bond of {{ networks.moonriver.staking.candidate_bond_min }} MOVR is `{{ networks.moonriver.staking.candidate_bond_min_wei }}` (20 zeros) in wei. Only the candidate bond counts for this check. Additional delegations do not count
 7. Set the candidate count as the candidate pool size. To learn how to retrieve this value, check the [Get the Size of the Candidate Pool](#get-the-size-of-the-candidate-pool) section
 8. Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account

![Join candidate pool via Polkadot.js](/images/node-operators/networks/collators/collator-polkadotjs-16.png)

!!! note
    Function names and the minimum bond requirement are subject to change in future releases.

As mentioned before, only the top {{ networks.moonbase.staking.max_candidates }} candidates on Moonbase Alpha and the top {{ networks.moonriver.staking.max_candidates }} candidates on Moonriver by delegated stake will be in the active set of collators. 

## Stop Collating {: #stop-collating } 

As of the latest runtime upgrade, [runtime version 1001](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/){target=_blank}, there have been significant changes to the way users can interact with various staking features, including the way staking exits are handled. 

To stop collating and leave the candidate pool, you must first schedule a request to leave the pool. Scheduling a request does not automatically remove you from the candidate pool, you must wait {{ networks.moonriver.collator_timings.leave_candidates.rounds }} rounds ({{ networks.moonriver.collator_timings.leave_candidates.hours }} hours) in Moonriver until you will be able to execute the request and stop collating. On Moonbase Alpha, the waiting period is {{ networks.moonbase.collator_timings.leave_candidates.rounds }} rounds ({{ networks.moonbase.collator_timings.leave_candidates.hours }} hours). While you are waiting the specified number of rounds, you will still be eligible to produce blocks and earn rewards if you're in the active set.

#### Schedule Request to Leave Candidates

To get started and schedule a request, take the following steps:

 1. Navigate to the **Developer** tab 
 2. Click on **Extrinsics**
 3. Select your candidate account
 4. Select **parachainStaking** pallet under the **submit the following extrinsic** menu
 5. Select the **scheduleLeaveCandidates** extrinsic
 6. Enter the `candidateCount` which you should have retrieved in the [Get the Size of the Candidate Pool](#get-the-size-of-the-candidate-pool) section
 7. Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account

![Schedule leave candidates request](/images/node-operators/networks/collators/collator-polkadotjs-9.png)

#### Execute Request to Leave Candidates

After the waiting period has passed, you'll be able to execute the request. To execute the request, you can follow these steps:

 1. Navigate to the **Developer** tab 
 2. Click on **Extrinsics**
 3. Select your candidate account
 4. Select **parachainStaking** pallet under the **submit the following extrinsic** menu
 5. Select the **executeLeaveCandidates** extrinsic
 6. Select the target candidate account (anyone can execute the request after the exit delay has passed after submitting the `scheduleLeaveCandidates` extrinsic)
 7. Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account

![Execute leave candidates request](/images/node-operators/networks/collators/collator-polkadotjs-10.png)

#### Cancel Request to Leave Candidates

If you scheduled a request to leave the candidate pool but changed your mind, as long as the request has not been executed, you can cancel the request and remain in the candidate pool. To cancel the request you can follow these steps:

 1. Navigate to the **Developer** tab 
 2. Click on **Extrinsics**
 3. Select your candidate account
 4. Select **parachainStaking** pallet under the **submit the following extrinsic** menu
 5. Select the **cancelLeaveCandidates** extrinsic
 6. Provide the `candidateCount` which you should have retrieved in the [Get the Size of the Candidate Pool](#get-the-size-of-the-candidate-pool) section
 7. Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account

![Cancel leave candidates request](/images/node-operators/networks/collators/collator-polkadotjs-11.png)

## Change Candidate Bond Amount {: #change-candidate-bond-amount }

Changing your candidate bond amount varies slightly depending on if you're bonding more or less. If you're bonding more, it is a straightforward process where you can increase your stake via the `candidateBondMore()` extrinsic. You do not have to wait any delays and you do not need to schedule a request and then execute it, instead your request will be executed instantly and automatically.

If you wish to bond less, you have to schedule a request, wait an exit delay, and then you will be able to execute the request and get a specified amount of tokens back into your free balance. There is a delay of {{ networks.moonbase.collator_timings.can_bond_less.rounds }} rounds ({{ networks.moonbase.collator_timings.can_bond_less.hours }} hours) for Moonbase Alpha and {{ networks.moonriver.collator_timings.can_bond_less.rounds }} rounds ({{ networks.moonriver.collator_timings.can_bond_less.hours }} hours) for Moonriver. In other words, scheduling the request doesn't decrease the bond instantly or automatically, it will only be decreased once the request has been executed.

### Bond More {: #bond-more }

As a candidate there are two options for increasing one's stake. The first and recommended option is to send the funds to be staked to another owned address and [delegate to your collator](/tokens/staking/stake/#how-to-nominate-a-collator). Alternatively, collators that have {{ networks.moonriver.staking.candidate_bond_min }} MOVR or more bonded can increase their bond from [Polkadot JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.moonriver.moonbeam.network#/accounts) as follows:

 1. Navigate to the **Developer** tab 
 2. Click on **Extrinsics**
 3. Select your collator account (and verify it contains the additional funds to be bonded)
 4. Select **parachainStaking** pallet under the **submit the following extrinsic** menu
 5. Open the drop-down menu, which lists all the possible extrinsics related to staking, and select the **candidateBondMore()** function
 6. Specify the additional amount to be bonded in the **more: BalanceOf** field
 7. Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account
 
!!! note
    Collators will not earn additional rewards for increasing their bond amount. To increase your staked MOVR, it is recommended that you instead send funds to another owned address and delegate to your collator.

![Collator Bond More](/images/node-operators/networks/collators/collator-polkadotjs-7.png)

### Bond Less {: #bond-less}

As of the latest runtime upgrade, [runtime version 1001](https://moonbeam.network/announcements/staking-changes-moonriver-runtime-upgrade/), there have been significant changes to the way users can interact with various staking features, including the way staking exits are handled. As a collator or collator candidate in Moonriver you may decrease your amount bonded if you have more than {{ networks.moonriver.staking.candidate_bond_min }} MOVR bonded.

!!! note
    The collator bond for Moonriver was previously 100 MOVR for a brief period during the network launch process. If you are collator with {{ networks.moonriver.staking.candidate_bond_min }} MOVR or less, you won't be able to decrease your bond. 

In order to bond less, you have to first schedule a request, wait the duration of the exit delay, and then execute the request. You can [cancel a request](#cancel-request) at any time, as long as the request hasn't been executed yet.

There is an exit delay of {{ networks.moonbase.delegator_timings.revoke_delegations.rounds }} rounds ({{ networks.moonbase.delegator_timings.revoke_delegations.hours }} hours) for Moonbase Alpha and {{ networks.moonriver.delegator_timings.revoke_delegations.rounds }} rounds ({{ networks.moonriver.delegator_timings.revoke_delegations.hours }} hours) for Moonriver.

#### Schedule Request

To schedule a request to bond less, you can follow these steps: 

 1. Navigate to the **Developer** tab 
 2. Click on **Extrinsics**
 3. Select your candidate account
 4. Select **parachainStaking** pallet under the **submit the following extrinsic** menu
 5. Open the drop-down menu and select the **scheduleCandidateBondLess()** function
 6. Specify the amount to decrease the bond by in the  **less: BalanceOf** field
 7. Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account
 
![Schedule Candidate Bond Less](/images/node-operators/networks/collators/collator-polkadotjs-12.png)

Once the transaction is confirmed, you must wait the duration of the exit delay and then you will be able to execute and decrease the bond amount. If you try to execute the request before the exit delay, your extrinsic will fail and you'll see an error from Polkadot.js Apps for `parachainStaking.PendingDelegationRequest`.

#### Execute Request

After the exit delay has passed from scheduling a request to decrease your bond, you can execute the request to actually decrease the bond amount by following these steps:

 1. Navigate to the **Developer** tab 
 2. Click on **Extrinsics**
 3. Select an account to execute the request with
 4. Select **parachainStaking** pallet under the **submit the following extrinsic** menu
 5. Select the **executeCandidateBondLess** extrinsic
 6. Select the target candidate account (anyone can execute the request after the exit delay has passed since the `scheduleCandidateBondLess` was submitted)
 7. Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account

![Execute Candidate Bond Less](/images/node-operators/networks/collators/collator-polkadotjs-13.png)

Once the transaction has been confirmed, you can check your free and reserved balances from the **Accounts** tab and notice now that the execution has gone through, your balances have been updated.

#### Cancel Request

If you scheduled a request to bond more or less but changed your mind, as long as the request has not been executed, you can cancel the request at any time and keep your bond amount as is. To cancel the request you can follow these steps:

 1. Navigate to the **Developer** tab 
 2. Click on **Extrinsics**
 3. Select your candidate account (and verify it contains the additional funds to be bonded)
 4. Select **parachainStaking** pallet under the **submit the following extrinsic** menu
 5. Select the **cancelCandidateBondRequest** extrinsic
 6. Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account

![Cancel leave candidates request](/images/node-operators/networks/collators/collator-polkadotjs-14.png)


## Session Keys {: #session-keys } 

Collators will need to sign blocks using an author ID, which is basically a [session key](https://wiki.polkadot.network/docs/learn-keys#session-keys){target=_blank}. To match the Substrate standard, Moonbeam collator's session keys are [SR25519](https://wiki.polkadot.network/docs/learn-keys#what-is-sr25519-and-where-did-it-come-from){target=_blank}. This guide will show you how you can create/rotate your session keys associated with your collator node.

First, make sure you're [running a collator node](/node-operators/networks/run-a-node/overview/) and you have exposed the RPC ports. Once you have your collator node running, your terminal should print similar logs:

![Collator Terminal Logs](/images/node-operators/networks/collators/collator-terminal-1.png)

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

![Collator Terminal Logs RPC Rotate Keys](/images/node-operators/networks/collators/collator-terminal-2.png)

Make sure you write down this public key of the author ID. Next, this will be mapped to an H160 Ethereum-styled address to which the block rewards are paid.

## Map Author ID to your Account {: #map-author-id-to-your-account } 

Once you've generated your author ID (session keys), the next step is to map it to your H160 account (an Ethereum-style address). Make sure you hold the private keys to this account, as this is where the block rewards are paid out to.

There is a bond that is sent when mapping your author ID with your account. This bond is per author ID registered. The bond set is as follows:

 - Moonbase Alpha - {{ networks.moonbase.staking.collator_map_bond }} DEV tokens 
 - Moonriver - {{ networks.moonriver.staking.collator_map_bond }} MOVR tokens. 

The `authorMapping` module has the following extrinsics programmed:

 - **addAssociation**(*address* authorID) — maps your author ID to the H160 account from which the transaction is being sent, ensuring it is the true owner of its private keys. It requires a [bond](#accounts-and-staking-requirements)
 - **clearAssociation**(*address* authorID) — clears the association of an author ID to the H160 account from which the transaction is being sent, which needs to be the owner of that author ID. Also refunds the bond
 - **updateAssociation**(*address* oldAuthorID, *address* newAuthorID) —  updates the mapping from an old author ID to a new one. Useful after a key rotation or migration. It executes both the `add` and `clear` association extrinsics atomically, enabling key rotation without needing a second bond

The module also adds the following RPC calls (chain state):

- **mapping**(*address* optionalAuthorID) — displays all mappings stored on-chain, or only that related to the input if provided

### Mapping Extrinsic {: #mapping-extrinsic } 

To map your author ID to your account, you need to be inside the [candidate pool](#become-a-candidate). Once you are a candidate, you need to send a mapping extrinsic (transaction). Note that this will bond tokens per author ID registered. To do so, take the following steps:

 1. Head to the **Developer** tab
 2. Select the **Extrinsics** option
 3. Choose the account that you want to map your author ID to be associated with, from which you'll sign this transaction
 4. Select the **authorMapping** extrinsic
 5. Set the method to **addAssociation()**
 6. Enter the author ID. In this case, it was obtained via the RPC call `author_rotateKeys` in the previous section
 7. Click on **Submit Transaction**

![Author ID Mapping to Account Extrinsic](/images/node-operators/networks/collators/collator-polkadotjs-4.png)

If the transaction is successful, you will see a confirmation notification on your screen. If not, make sure you've joined the [candidate pool](#become-a-candidate).

![Author ID Mapping to Account Extrinsic Successful](/images/node-operators/networks/collators/collator-polkadotjs-5.png)

### Checking the Mappings {: #checking-the-mappings } 

You can also check the current on-chain mappings by verifying the chain state. To do so, take the following steps:

 1. Head to the **Developer** tab
 2. Select the **Chain state** option
 3. Choose **authorMapping** as the state to query
 4. Select the **mappingWithDeposit** method
 5. Provide an author ID to query. Optionally, you can disable the slider to retrieve all mappings 
 6. Click on the **+** button to send the RPC call

![Author ID Mapping Chain State](/images/node-operators/networks/collators/collator-polkadotjs-6.png)

You should be able to see the H160 account associated with the author ID provided. If no author ID was included, this would return all the mappings stored on-chain.
