---
title: Collator Account Management
description: Learn how to manage your collator account including generating session keys, mapping Nimbus IDs, setting an identity, and creating proxy accounts.
---

# Collator Account Management

![Collator Account Management Banner](/images/node-operators/networks/collators/account-management/account-management-banner.png)

## Introduction {: #introduction } 

When running a collator node on Moonbeam-based networks, there are some account management activities that you will need to be aware of. First and foremost you will need to create [session keys](https://wiki.polkadot.network/docs/learn-keys#session-keys){target=_blank} for your primary and backup servers which will be used to determine block production and sign blocks.

In addition, there are some optional account management activities that you can consider such as setting an on-chain identity or setting up proxy accounts.

This guide will cover how to manage your collator account including generating and rotating your session keys, registering and updating your session keys, setting an identity, and creating proxy accounts.

## Generate Session Keys {: #session-keys } 

--8<-- 'text/collaotrs/generate-session-keys.md'

## Mapping Bonds {: #mapping-bonds }

There is a bond that is sent when mapping your session keys with your account. This bond is per session keys registered. The bond set is as follows:

=== "Moonbeam"
    ```
    {{ networks.moonbeam.staking.collator_map_bond }} GLMR
    ```
  
=== "Moonriver"
    ```
    {{ networks.moonriver.staking.collator_map_bond }} MOVR
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.staking.collator_map_bond }} DEV
    ```

## Author Mapping Pallet Interface {: #author-mapping-interface }

The `authorMapping` module has the following extrinsics programmed:

 - **setKeys**(keys) — accepts the result of calling `author_rotateKeys`, which is the concatenated public keys of your Nimbus and VRF keys, and sets the session keys at once. Useful after a key rotation or migration. Calling `setKeys` requires a [bond](#mapping-bonds). Replaces the deprecated `addAssociation` and `updateAssociation` extrinsics
- **removeKeys**() - removes the session keys. Replaces the deprecated `clearAssociation` extrinsic

The following methods are **deprecated**, but will still exist for backwards compatibility:

 - **addAssociation**(nimbusId) — maps your Nimbus ID to the H160 account from which the transaction is being sent, ensuring it is the true owner of its private keys. It requires a [bond](#mapping-bonds). This method maintains backwards compatibility by setting the `keys` to the Nimbus ID by default
 - **updateAssociation**(oldNimbusId, newNimbusId) —  updates the mapping from an old Nimbus ID to a new one. Useful after a key rotation or migration. It executes both the `add` and `clear` association extrinsics automically, enabling key rotation without needing a second bond. This method maintains backwards compatibility by setting the `newKeys` to the Nimbus ID by default
 - **clearAssociation**(nimbusId) — clears the association of a Nimbus ID to the H160 account from which the transaction is being sent, which needs to be the owner of that Nimbus ID. Also refunds the bond

The module also adds the following RPC calls (chain state):

- **mappingWithDeposit**(NimbusPrimitivesNimbusCryptoPublic | string | Uint8Array) — displays all mappings stored on-chain, or only that related to the Nimbus ID if provided
- **nimbusLookup**(AccountId20) - displays a reverse mapping of account IDs to Nimbus IDs for all collators or for a given collator address

## Map Session Keys {: #mapping-extrinsic } 

Once you've generated your session keys, the next step is to map your session keys to your H160 account (an Ethereum-style address). Make sure you hold the private keys to this account, as this is where the block rewards are paid out to.

To map your session keys to your account, you need to be inside the [candidate pool](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}. Once you are a candidate, you need to send a mapping extrinsic. Note that this will bond tokens per author ID registered.

In this guide, you'll learn how to map session keys from Polkadot.js Apps. To learn how to create the mapping through the author mapping precompiled contract, you can refer to the page on [Interacting with the Author Mapping Precompile](/builders/pallets-precompiles/precompiles/author-mapping){target=_blank}.

To create the mapping from [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=_blank} (make sure you're connected to the correct network), click on **Developer** at the top of the page, choose the **Extrinsics** option from the dropdown, and take the following steps:

 1. Choose the account that you want to map your author ID to be associated with, from which you'll sign this transaction
 2. Select the **authorMapping** extrinsic
 3. Set the method to **setKeys()**
 4. Enter the **keys**. It is the response obtained via the RPC call `author_rotateKeys` in the previous section, which is the concatenated public keys of your Nimbus ID and VRF key
 5. Click on **Submit Transaction**

![Author ID Mapping to Account Extrinsic](/images/node-operators/networks/collators/account-management/account-3.png)

If the transaction is successful, you will see a confirmation notification on your screen. If not, make sure you've [joined the candidate pool](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}.

If you receive the following error, you may need to try rotating and mapping your keys again: `VRF PreDigest was not included in the digests (check rand key is in keystore)`

## Check Mappings {: #checking-the-mappings } 

You can check the current on-chain mappings by verifying the chain state. You can do this one of two ways: via the `mappingWithDeposit` method or the `nimbusLookup` method. Both methods can be used to query the on-chain data for all of the collators or for a specific collator.

You can check the current on-chain mappings for a specific collator or you can also check all of the mappings stored on-chain. 

### Using the Mapping with Deposit Method {: #using-mapping-with-deposit }

To use the `mappingWithDeposit` method to check the mapping for a specific collator, you'll need to get the Nimbus ID. To do so, you can take the first 64 hexadecimal characters of the concatenated public keys to get the Nimbus ID. To verify that the Nimbus ID is correct, you can run the following command with the first 64 characters passed into the `params` array:

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

From [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=_blank}, click on **Developer** at the top of the page, then choose **Chain State** from the dropdown, and take the following steps:

 1. Choose **authorMapping** as the state to query
 2. Select the **mappingWithDeposit** method
 3. Provide a Nimbus ID to query. Optionally, you can disable the slider to retrieve all mappings 
 4. Click on the **+** button to send the RPC call

![Nimbus ID Mapping Chain State](/images/node-operators/networks/collators/account-management/account-5.png)

You should be able to see the H160 account associated with the Nimbus ID provided and the deposit paid. If no Nimbus ID was included, this would return all the mappings stored on-chain.

### Using the Nimbus Lookup Method {: #using-nimbus-lookup }

To use the `nimbusLookup` method to check the mapping for a specific collator, you'll need the collator's address. If you do not pass an argument to the method, you can retrieve all of the on-chain mappings.

From [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=_blank}, click on **Developer** at the top of the page, then choose **Chain State** from the dropdown, and take the following steps:

 1. Choose **authorMapping** as the state to query
 2. Select the **nimbusLookup** method
 3. Provide a collator's address to query. Optionally, you can disable the slider to retrieve all mappings 
 4. Click on the **+** button to send the RPC call

![Nimbus ID Mapping Chain State](/images/node-operators/networks/collators/account-management/account-6.png)

You should be able to see the nimbus ID associated with the H160 account provided. If no account was provided, this would return all the mappings stored on-chain.

## Setting an Identity {: #setting-an-identity }

Setting an on-chain identity enables your collator node to be easily identifiable. As opposed to showing your account address, your chosen display name will be displayed instead. 

There are a couple of ways you can set your identity, to learn how to set an identity for your collator node please check out the [Managing your Account Identity](/tokens/manage/identity/){target=_blank} page of our documentation.

## Proxy Accounts {: #proxy-accounts }

Proxy accounts are accounts that can be enabled to perform a limited number of actions on your behalf. Proxies allow users to keep a primary account securely in cold storage while using the proxy to actively participate in the network on behalf of the primary account. You can remove authorization of the proxy account at any time. As an additional layer of security, you can setup your proxy with a delay period. This delay period would provide you time to review the transaction, and cancel if needed, before it automatically gets executed. 

To learn how to setup a proxy account, please refer to the [Setting up a Proxy Account](/tokens/manage/proxy-accounts/){target=_blank} page of our documentation.
