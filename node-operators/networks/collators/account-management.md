---
title: Collator Account Management
description: Learn how to manage your collator account, including generating session keys, mapping Nimbus IDs, setting an identity, and creating proxy accounts.
categories: Node Operators and Collators
---

# Collator Account Management

## Introduction {: #introduction }

When running a collator node on Moonbeam-based networks, there are some account management activities that you will need to be aware of. First and foremost you will need to create [session keys](https://wiki.polkadot.com/learn/learn-cryptography/#session-keys){target=\_blank} for your primary and backup servers which will be used to determine block production and sign blocks.

In addition, there are some optional account management activities that you can consider such as setting an on-chain identity or setting up proxy accounts.

This guide will cover how to manage your collator account including generating and rotating your session keys, registering and updating your session keys, setting an identity, and creating proxy accounts.

## Process to Add and Update Session Keys {: #process }

The process for adding your session keys for the first time is the same as it would be for rotating your session keys. The process to create/rotate session keys is as follows:

1. [Generate session keys](#session-keys) using the `author_rotateKeys` RPC method. The response to calling this method will be a 128 hexadecimal character string containing a Nimbus ID and the public key of a VRF session key
2. [Join the candidate pool](/node-operators/networks/collators/activities/#become-a-candidate){target=\_blank} if you haven't already
3. [Map the session keys](#mapping-extrinsic) to your candidate account using the [Author Mapping Pallet](#author-mapping-interface)'s `setKeys(keys)` extrinsic, which accepts the entire 128 hexadecimal character string as the input. When you call `setKeys` for the first time, you'll be required to submit a [mapping bond](#mapping-bonds). If you're rotating your keys and you've previously submitted a mapping bond, no new bond is required

Each step of the process is outlined in the following sections.

## Generate Session Keys {: #session-keys }

--8<-- 'text/node-operators/networks/collators/account-management/generate-session-keys.md'

## Manage Session Keys {: #manage-session-keys }

Once you've created or rotated your session keys, you'll be able to manage your session keys using the extrinsics in the Author Mapping Pallet. You can map your session keys, verify the on-chain mappings, and remove session keys.

### Author Mapping Pallet Interface {: #author-mapping-interface }

The `authorMapping` module has the following extrinsics:

 - **setKeys**(keys) — accepts the result of calling `author_rotateKeys`, which is the concatenated public keys of your Nimbus and VRF keys, and sets the session keys at once. Useful after a key rotation or migration. Calling `setKeys` requires a [bond](#mapping-bonds). Replaces the deprecated `addAssociation` and `updateAssociation` extrinsics
- **removeKeys**() - removes the session keys. This is only required if you intend to stop collating and leave the candidate pool. Replaces the deprecated `clearAssociation` extrinsic

The module also adds the following RPC calls (chain state):

- **mappingWithDeposit**(NimbusPrimitivesNimbusCryptoPublic | string | Uint8Array) — displays all mappings stored on-chain, or only that related to the Nimbus ID if provided
- **nimbusLookup**(AccountId20) - displays a reverse mapping of account IDs to Nimbus IDs for all collators or for a given collator address

### Map Session Keys {: #mapping-extrinsic }

With your newly generated session keys in hand, the next step is to map your session keys to your H160 account (an Ethereum-style address). Make sure you hold the private keys to this account, as this is where the block rewards are paid out to.

To map your session keys to your account, you need to be inside the [candidate pool](/node-operators/networks/collators/activities/#become-a-candidate){target=\_blank}. Once you are a candidate, you need to send a mapping extrinsic, which requires a mapping bond.

#### Mapping Bonds {: #mapping-bonds }

The mapping bond is per session keys registered. The bond for mapping your session keys to your account is as follows:

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.staking.collator_map_bond }} GLMR
    ```
  
=== "Moonriver"

    ```text
    {{ networks.moonriver.staking.collator_map_bond }} MOVR
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.staking.collator_map_bond }} DEV
    ```

#### Use Polkadot.js Apps to Map Session Keys {: #use-polkadotjs-apps }

In this section, you'll learn how to map session keys from Polkadot.js Apps. To learn how to create the mapping through the author mapping precompiled contract, you can refer to the page on [Interacting with the Author Mapping Precompile](/node-operators/networks/collators/author-mapping/){target=\_blank}.

To create the mapping from [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=\_blank} (make sure you're connected to the correct network), click on **Developer** at the top of the page, choose the **Extrinsics** option from the dropdown, and take the following steps:

 1. Choose the account that you want to map your author ID to be associated with, from which you'll sign this transaction
 2. Select the **authorMapping** extrinsic
 3. Set the method to **setKeys()**
 4. Enter the **keys**. It is the response obtained via the RPC call `author_rotateKeys` in the previous section, which is the concatenated public keys of your Nimbus ID and VRF key
 5. Click on **Submit Transaction**

![Author ID Mapping to Account Extrinsic](/images/node-operators/networks/collators/account-management/account-1.webp)

!!! note
    If you receive the following error, you may need to try rotating and mapping your keys again: `VRF PreDigest was not included in the digests (check rand key is in keystore)`.

If the transaction is successful, you will see a confirmation notification on your screen. If not, make sure you've [joined the candidate pool](/node-operators/networks/collators/activities/#become-a-candidate){target=\_blank}.

### Check Mappings {: #checking-the-mappings }

You can check the current on-chain mappings by verifying the chain state. You can do this one of two ways: via the `mappingWithDeposit` method or the `nimbusLookup` method. Both methods can be used to query the on-chain data for all of the collators or for a specific collator.

You can check the current on-chain mappings for a specific collator or you can also check all of the mappings stored on-chain.

#### Using the Mapping with Deposit Method {: #using-mapping-with-deposit }

To use the `mappingWithDeposit` method to check the mapping for a specific collator, you'll need to get the Nimbus ID. To do so, you can take the first 64 hexadecimal characters of the concatenated public keys to get the Nimbus ID. To verify that the Nimbus ID is correct, you can run the following command with the first 64 characters passed into the `params` array:

```bash
--8<-- 'code/node-operators/networks/collators/account-management/1.sh'
```

If it's correct the response should return `"result": true`.

--8<-- 'code/node-operators/networks/collators/account-management/check-nimbus-key.md'

From [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=\_blank}, click on **Developer** at the top of the page, then choose **Chain State** from the dropdown, and take the following steps:

 1. Choose **authorMapping** as the state to query
 2. Select the **mappingWithDeposit** method
 3. Provide a Nimbus ID to query. Optionally, you can disable the slider to retrieve all mappings 
 4. Click on the **+** button to send the RPC call

![Nimbus ID Mapping Chain State](/images/node-operators/networks/collators/account-management/account-2.webp)

You should be able to see the H160 account associated with the Nimbus ID provided and the deposit paid. If no Nimbus ID was included, this would return all the mappings stored on-chain.

#### Using the Nimbus Lookup Method {: #using-nimbus-lookup }

To use the `nimbusLookup` method to check the mapping for a specific collator, you'll need the collator's address. If you do not pass an argument to the method, you can retrieve all of the on-chain mappings.

From [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=\_blank}, click on **Developer** at the top of the page, then choose **Chain State** from the dropdown, and take the following steps:

 1. Choose **authorMapping** as the state to query
 2. Select the **nimbusLookup** method
 3. Provide a collator's address to query. Optionally, you can disable the slider to retrieve all mappings
 4. Click on the **+** button to send the RPC call

![Nimbus ID Mapping Chain State](/images/node-operators/networks/collators/account-management/account-3.webp)

You should be able to see the nimbus ID associated with the H160 account provided. If no account was provided, this would return all the mappings stored on-chain.

### Remove Session Keys {: #removing-session-keys }

Before removing your session keys, you'll want to make sure that you've stopped collating and left the candidate pool. To stop collating, you'll need to schedule a request to leave the candidate pool, wait a delay period, and then execute the request. For step-by-step instructions, please refer to the [Stop Collating](/node-operators/networks/collators/activities/#stop-collating){target=\_blank} section of the Moonbeam Collator Activities page.

Once you have left the candidate pool, you can remove your session keys. After which, the mapping bond you deposited will be returned to your account.

From [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=\_blank}, click on **Developer** at the top of the page, then choose **Extrinsics** from the dropdown, and take the following steps:

1. Select your account
2. Choose the **authorMapping** pallet and the **removeKeys** extrinsic
3. Click **Submit Transaction**

![Remove session keys on Polkadot.js Apps](/images/node-operators/networks/collators/account-management/account-4.webp)

Once the transaction goes through, the mapping bond will be returned to you. To make sure that the keys were removed, you can follow the steps in the [Check Mappings](#checking-the-mappings) section.

## Setting an Identity {: #setting-an-identity }

Setting an on-chain identity enables your collator node to be easily identifiable. As opposed to showing your account address, your chosen display name will be displayed instead.

There are a couple of ways you can set your identity, to learn how to set an identity for your collator node please check out the [Managing your Account Identity](/tokens/manage/identity/){target=\_blank} page of our documentation.

## Proxy Accounts {: #proxy-accounts }

Proxy accounts are accounts that can be enabled to perform a limited number of actions on your behalf. Proxies allow users to keep a primary account securely in cold storage while using the proxy to actively participate in the network on behalf of the primary account. You can remove authorization of the proxy account at any time. As an additional layer of security, you can setup your proxy with a delay period. This delay period would provide you time to review the transaction, and cancel if needed, before it automatically gets executed.

To learn how to setup a proxy account, please refer to the [Setting up a Proxy Account](/tokens/manage/proxy-accounts/){target=\_blank} page of our documentation.
