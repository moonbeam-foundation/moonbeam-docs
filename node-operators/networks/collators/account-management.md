---
title: Collator Account Management
description: Learn how to manage your collator account including generating session keys, mapping author IDs, setting an identity, and creating proxy accounts.
---

# Collator Account Management

![Collator Account Management Banner](/images/node-operators/networks/collators/account-management/account-management-banner.png)

## Introduction {: #introduction } 

When running a collator node on Moonbeam-based networks, there are some account management activities that you will need to be aware of. First and foremost you will need to create [session keys](https://wiki.polkadot.network/docs/learn-keys#session-keys){target=_blank} for your primary and backup servers which will be used to determine block production and sign blocks.

In addition, there are some optional account management activities that you can consider such as setting an on-chain identity or setting up proxy accounts.

This guide will cover how to manage your collator account including generating and rotating your session keys, registering and updating your session keys, setting an identity, and creating proxy accounts.

## Generating Session Keys {: #session-keys } 

To match the Substrate standard, Moonbeam collator's session keys are [SR25519](https://wiki.polkadot.network/docs/learn-keys#what-is-sr25519-and-where-did-it-come-from){target=_blank}. This guide will show you how you can create/rotate your session keys associated with your collator node.

First, make sure you're [running a collator node](/node-operators/networks/run-a-node/overview/){target=_blank}. Once you have your collator node running, your terminal should print similar logs:

![Collator Terminal Logs](/images/node-operators/networks/collators/account-management/account-1.png)

Next, session keys can be created/rotated by sending an RPC call to the HTTP endpoint with the `author_rotateKeys` method. When you call `author_rotateKeys`, the result is the size of two keys. The response will contain a concatenated author ID (Nimbus key) and VRF key. The author ID will be used to sign blocks and create an association to your H160 account for block rewards to be paid out. The [VRF](https://wiki.polkadot.network/docs/learn-randomness#vrf){target=_blank} key is required for block production.

For reference, if your collator's HTTP endpoint is at port `9933`, the JSON-RPC call might look like this:

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

The collator node should respond with the concatenated public keys of your new session keys. The first 64 hexadecimal characters after the `0x` prefix represent your author ID and the last 64 hexadecimal characters are the public key of your VRF session key. 

![Collator Terminal Logs RPC Rotate Keys](/images/node-operators/networks/collators/account-management/account-2.png)

Make sure you write down the concatenated public keys. Each of your servers, your primary and backup, should have their own unique keys. Since the keys never leave your servers, you can consider them a unique ID for that server.

Next, you'll need to register your session keys and map the author ID session key to an H160 Ethereum-styled address to which the block rewards are paid.

## Map Author ID & Set Session Keys {: #map-author-id-set-session-keys } 

There is a bond that is sent when mapping your author ID with your account. This bond is per author ID registered. The bond set is as follows:

 - Moonbeam -  {{ networks.moonbeam.staking.collator_map_bond }} GLMR tokens
 - Moonriver - {{ networks.moonriver.staking.collator_map_bond }} MOVR tokens
 - Moonbase Alpha - {{ networks.moonbase.staking.collator_map_bond }} DEV tokens 

The `authorMapping` module has the following extrinsics programmed:

 - **setKeys**(*address* keys) — accepts the result of calling `author_rotateKeys`, which is the concatenated public keys of your Nimbus and VRF keys, and sets the author ID and the session keys at once. Useful after a key rotation or migration. Calling `setKeys` requires a [bond](#:~:text=The bond set is as follows). Replaces the deprecated `addAssociation` and `updateAssociation` extrinsics
- **removeKeys**() - removes the author ID and session keys. Replaces the deprecated `clearAssociation` extrinsic

The following methods are **deprecated**, but will still exist for backwards compatibility:

 - **addAssociation**(*address* authorID) — maps your author ID to the H160 account from which the transaction is being sent, ensuring it is the true owner of its private keys. It requires a [bond](#:~:text=The bond set is as follows). This method maintains backwards compatibility by setting the `keys` to the author ID by default
 - **updateAssociation**(*address* oldAuthorID, *address* newAuthorID) —  updates the mapping from an old author ID to a new one. Useful after a key rotation or migration. It executes both the `add` and `clear` association extrinsics automically, enabling key rotation without needing a second bond. This method maintains backwards compatibility by setting the `newKeys` to the author ID by default
 - **clearAssociation**(*address* authorID) — clears the association of an author ID to the H160 account from which the transaction is being sent, which needs to be the owner of that author ID. Also refunds the bond

The module also adds the following RPC calls (chain state):

- **mapping**(*address* optionalAuthorID) — displays all mappings stored on-chain, or only that related to the input if provided

### Mapping Extrinsic {: #mapping-extrinsic } 

Once you've generated your session keys, the next step is to register the session keys and map the author ID to your H160 account (an Ethereum-style address). Make sure you hold the private keys to this account, as this is where the block rewards are paid out to.

To map your author ID to your account, you need to be inside the [candidate pool](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}. Once you are a candidate, you need to send a mapping extrinsic. Note that this will bond tokens per author ID registered. To do so, click on **Developer** at the top of the page, choose the **Extrinsics** option from the dropdown, and take the following steps:

 1. Choose the account that you want to map your author ID to be associated with, from which you'll sign this transaction
 2. Select the **authorMapping** extrinsic
 3. Set the method to **setKeys()**
 4. Enter the **keys**. In this case, it is the response obtained via the RPC call `author_rotateKeys` in the previous section
 5. Click on **Submit Transaction**

![Author ID Mapping to Account Extrinsic](/images/node-operators/networks/collators/account-management/account-3.png)

If the transaction is successful, you will see a confirmation notification on your screen. If not, make sure you've [joined the candidate pool](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}.

### Checking the Mappings {: #checking-the-mappings } 

You can check the current on-chain mappings for a specific author ID or you can also check all of the mappings stored on-chain. For checking a specific author ID, you can take the first 64 hexadecimal characters of the concatenated public keys to get the author ID. To verify that the author ID is correct, you can run the following command with the first 64 characters passed into the `params` array:

```
curl http://127.0.0.1:9933 -H "Content-Type:application/json;charset=utf-8" -d   '{
  "jsonrpc":"2.0",
  "id":1,
  "method":"author_hasKey",
  "params": ["72c7ca7ef07941a3caeb520806576b52cb085f7577cc12cd36c2d64dbf73757a", "nmbs"]
}'
```

If it's correct the response should return `"result": true`.

![Check Nimbus Key](/images/node-operators/networks/collators/account-management/account-4.png)

You can check the current on-chain mappings by verifying the chain state. You'll need to click on **Developer** at the top of the page, then choose **Chain State** from the dropdown, and take the following steps:

 1. Choose **authorMapping** as the state to query
 2. Select the **mappingWithDeposit** method
 3. Provide an author ID (Nimbus ID) to query. Optionally, you can disable the slider to retrieve all mappings 
 4. Click on the **+** button to send the RPC call

![Author ID Mapping Chain State](/images/node-operators/networks/collators/account-management/account-5.png)

You should be able to see the H160 account associated with the author ID provided. If no author ID was included, this would return all the mappings stored on-chain.

## Setting an Identity {: #setting-an-identity }

Setting an on-chain identity enables your collator node to be easily identifiable. As opposed to showing your account address, your chosen display name will be displayed instead. 

There are a couple of ways you can set your identity, to learn how to set an identity for your collator node please check out the [Managing your Account Identity](/tokens/manage/identity/){target=_blank} page of our documentation.

## Proxy Accounts {: #proxy-accounts }

Proxy accounts are accounts that can be enabled to perform a limited number of actions on your behalf. Proxies allow users to keep a primary account securely in cold storage while using the proxy to actively participate in the network on behalf of the primary account. You can remove authorization of the proxy account at any time. As an additional layer of security, you can setup your proxy with a delay period. This delay period would provide you time to review the transaction, and cancel if needed, before it automatically gets executed. 

To learn how to setup a proxy account, please refer to the [Setting up a Proxy Account](/tokens/manage/proxy-accounts/){target=_blank} page of our documentation.
