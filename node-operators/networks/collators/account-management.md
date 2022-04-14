---
title: Collator Account Management
description: Learn how to manage your collator account including generating session keys, mapping author IDs, setting an identity, and creating proxy accounts.
---

# Collator Account Management

![Collator Account Management Banner](/images/node-operators/networks/collators/account-management/account-management-banner.png)

## Introduction {: #introduction } 

When running a collator node on Moonbeam-based networks, there are some account management activities that you will need to be aware of. First and foremost you will need to create session keys for your primary and backup servers which will be used to sign blocks. Then you'll need to map each session key, also known as an author ID, to your H160 account for block rewards to be paid out.

In addition, there are some optional account management activities that you can consider such as setting an on-chain identity or setting up proxy accounts.

This guide will cover how to manage your collator account including generating and rotating your session keys, mapping your author ID, setting an identity, and creating proxy accounts.

## Session Keys {: #session-keys } 

Collators will need to sign blocks using an author ID, which is basically a [session key](https://wiki.polkadot.network/docs/learn-keys#session-keys){target=_blank}. To match the Substrate standard, Moonbeam collator's session keys are [SR25519](https://wiki.polkadot.network/docs/learn-keys#what-is-sr25519-and-where-did-it-come-from){target=_blank}. This guide will show you how you can create/rotate your session keys associated with your collator node.

First, make sure you're [running a collator node](/node-operators/networks/run-a-node/overview/){target=_blank}. Once you have your collator node running, your terminal should print similar logs:

![Collator Terminal Logs](/images/node-operators/networks/collators/account-management/account-1.png)

Next, session keys can be created/rotated by sending an RPC call to the HTTP endpoint with the `author_rotateKeys` method. For reference, if your collator's HTTP endpoint is at port `9933`, the JSON-RPC call might look like this:

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

![Collator Terminal Logs RPC Rotate Keys](/images/node-operators/networks/collators/account-management/account-2.png)

Make sure you write down the public key of the author ID. Each of your servers, your primary and backup, should have their own unique key. Since the keys never leave your servers, you can consider them a unique ID for that server.

Next, your author ID will be mapped to an H160 Ethereum-styled address to which the block rewards are paid.

## Map Author ID to your Account {: #map-author-id-to-your-account } 

Once you've generated your author ID (session keys), the next step is to map it to your H160 account (an Ethereum-style address). Make sure you hold the private keys to this account, as this is where the block rewards are paid out to.

There is a bond that is sent when mapping your author ID with your account. This bond is per author ID registered. The bond set is as follows:

 - Moonbeam -  {{ networks.moonbeam.staking.collator_map_bond }} GLMR tokens
 - Moonriver - {{ networks.moonriver.staking.collator_map_bond }} MOVR tokens
 - Moonbase Alpha - {{ networks.moonbase.staking.collator_map_bond }} DEV tokens 

The `authorMapping` module has the following extrinsics programmed:

 - **addAssociation**(*address* authorID) — maps your author ID to the H160 account from which the transaction is being sent, ensuring it is the true owner of its private keys. It requires a [bond](#:~:text=The bond set is as follows)
 - **clearAssociation**(*address* authorID) — clears the association of an author ID to the H160 account from which the transaction is being sent, which needs to be the owner of that author ID. Also refunds the bond
 - **updateAssociation**(*address* oldAuthorID, *address* newAuthorID) —  updates the mapping from an old author ID to a new one. Useful after a key rotation or migration. It executes both the `add` and `clear` association extrinsics atomically, enabling key rotation without needing a second bond

The module also adds the following RPC calls (chain state):

- **mapping**(*address* optionalAuthorID) — displays all mappings stored on-chain, or only that related to the input if provided

### Mapping Extrinsic {: #mapping-extrinsic } 

To map your author ID to your account, you need to be inside the [candidate pool](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}. Once you are a candidate, you need to send a mapping extrinsic. Note that this will bond tokens per author ID registered. To do so, take the following steps:

 1. Head to the **Developer** tab
 2. Select the **Extrinsics** option
 3. Choose the account that you want to map your author ID to be associated with, from which you'll sign this transaction
 4. Select the **authorMapping** extrinsic
 5. Set the method to **addAssociation()**
 6. Enter the author ID. In this case, it was obtained via the RPC call `author_rotateKeys` in the previous section
 7. Click on **Submit Transaction**

![Author ID Mapping to Account Extrinsic](/images/node-operators/networks/collators/account-management/account-3.png)

If the transaction is successful, you will see a confirmation notification on your screen. If not, make sure you've [joined the candidate pool](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}.

![Author ID Mapping to Account Extrinsic Successful](/images/node-operators/networks/collators/account-management/account-4.png)

### Checking the Mappings {: #checking-the-mappings } 

You can also check the current on-chain mappings by verifying the chain state. To do so, take the following steps:

 1. Head to the **Developer** tab
 2. Select the **Chain state** option
 3. Choose **authorMapping** as the state to query
 4. Select the **mappingWithDeposit** method
 5. Provide an author ID to query. Optionally, you can disable the slider to retrieve all mappings 
 6. Click on the **+** button to send the RPC call

![Author ID Mapping Chain State](/images/node-operators/networks/collators/account-management/account-5.png)

You should be able to see the H160 account associated with the author ID provided. If no author ID was included, this would return all the mappings stored on-chain.

## Setting an Identity {: #setting-an-identity }

Setting an on-chain identity enables your collator node to be easily identifiable. As opposed to showing your account address, your chosen display name will be displayed instead. 

There are a couple of ways you can set your identity, to learn how to set an identity for your collator node please check out the [Managing your Account Identity](/tokens/manage/identity/){target=_blank} page of our documentation.

## Proxy Accounts {: #proxy-accounts }

Proxy accounts are accounts that can be enabled to perform a limited number of actions on your behalf. Proxies allow users to keep a primary account securely in cold storage while using the proxy to actively participate in the network on behalf of the primary account. You can remove authorization of the proxy account at any time. As an additional layer of security, you can setup your proxy with a delay period. This delay period would provide you time to review the transaction, and cancel if needed, before it automatically gets executed. 

To learn how to setup a proxy account, please refer to the [Setting up a Proxy Account](/tokens/manage/proxy-accounts/){target=_blank} page of our documentation.