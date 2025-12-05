---
title:  Author Mapping Precompile
description: A guide for collators to learn how to use the Author Mapping Solidity interface to map session keys to a Moonbeam address where block rewards are paid out. 
keywords: solidity, ethereum, author mapping, collator, moonbeam, precompiled, contracts, block producer
categories: Node Operators and Collators
---

# Interacting with the Author Mapping Precompile

## Introduction {: #introduction }

The author mapping precompiled contract on Moonbeam allows collator candidates to map session keys to a Moonbeam address where block rewards are paid out, through a familiar and easy-to-use Solidity interface. This enables candidates to complete author mapping with a Ledger or any other Ethereum wallet compatible with Moonbeam. However, it is recommended to generate your keys on an air-gapped machine. You can find out more information by referring to the [account requirements section of the Collator Requirements page](/node-operators/networks/collators/requirements/#account-requirements){target=\_blank}.

To become a collator candidate, you must be [running a collator node](/node-operators/networks/run-a-node/overview/){target=\_blank}. You'll also need to [join the candidate pool](/node-operators/networks/collators/activities/#become-a-candidate){target=\_blank} fully sync your node and submit the required [bonds](#bonds) before generating your session keys and mapping them to your account. There is an [additional bond](#bonds) that must be paid when mapping your session keys.

The precompile is located at the following address:

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.author_mapping }}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.author_mapping }}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.author_mapping }}
     ```

--8<-- 'text/builders/ethereum/precompiles/security.md'

## The Author Mapping Solidity Interface {: #the-solidity-interface }

[`AuthorMappingInterface.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol){target=\_blank} is a Solidity interface that allows developers to interact with the precompile's methods.

- **removeKeys**() - removes the author ID and session keys. Replaces the deprecated `clearAssociation` extrinsic
- **setKeys**(*bytes memory* keys) — accepts the result of calling `author_rotateKeys`, which is the concatenated public keys of your Nimbus and VRF keys, and sets the author ID and the session keys at once. Useful after a key rotation or migration. Calling `setKeys` requires a [bond](#bonds). Replaces the deprecated `addAssociation` and `updateAssociation` extrinsics
- **nimbusIdOf**(*address* who) - retrieves the Nimbus ID of the given address. If no Nimbus ID exists for the given address, it returns `0`
- **addressOf**(*bytes32* nimbusId) - retrieves the address associated to a given Nimbus ID. If the Nimbus ID is unknown, it returns `0`
- **keysOf**(*bytes32* nimbusId) - retrieves the keys associated to the given Nimbus ID. If the Nimbus ID is unknown, it returns empty bytes

## Required Bonds {: #bonds }

To follow along with this tutorial, you'll need to join the candidate pool and map your session keys to your H160 Ethereum-style account. Two bonds are required to perform both of these actions.

The minimum bond to join the candidate pool is set as follows:

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.staking.min_can_stk }} GLMR
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.staking.min_can_stk }} MOVR
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.staking.min_can_stk }} DEV
    ```

There is a bond that is sent when mapping your session keys with your account. This bond is per session keys registered. The bond set is as follows:

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

## Interact with the Solidity Interface {: #interact-with-the-solidity-interface }

### Checking Prerequisites {: #checking-prerequisites }

The below example is demonstrated on Moonbase Alpha, however, similar steps can be taken for Moonbeam and Moonriver. You should:  

 - Have MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
 - Have an account with DEV tokens. You should have enough to cover the [candidate and mapping bonds](#bonds) plus gas fees to send the transaction and map your session keys to your account. To get enough DEV tokens to follow along with this guide, you can contact a moderator directly via the [Moonbeam Discord server](https://discord.com/invite/PfpUATX){target=\_blank}
 - Make sure you're [running a collator node](/node-operators/networks/run-a-node/overview/){target=\_blank} and it's fully synced
 - Make sure you've [joined the candidate pool](/node-operators/networks/collators/activities/#become-a-candidate){target=\_blank}

As previously mentioned, you can use a Ledger by connecting it to MetaMask, please refer to the [Ledger](/tokens/connect/ledger/ethereum/){target=\_blank} guide on how to import your Ledger to MetaMask. Please note that it is not recommended to use Ledger for production purposes. You can find out more information by referring to the [account requirements section of the Collator Requirements page](/node-operators/networks/collators/requirements/#account-requirements){target=\_blank}.

### Generate Session Keys {: #generate-session-keys }

--8<-- 'text/node-operators/networks/collators/account-management/generate-session-keys.md'

### Remix Set Up {: #remix-set-up }

To get started, get a copy of [`AuthorMappingInterface.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol){target=\_blank} and take the following steps:

1. Click on the **File explorer** tab
2. Copy and paste the file contents into a [Remix file](https://remix.ethereum.org){target=\_blank} named `AuthorMappingInterface.sol`

![Copying and Pasting the Author Mapping Interface into Remix](/images/node-operators/networks/collators/author-mapping/author-mapping-1.webp)

### Compile the Contract {: #compile-the-contract }

1. Click on the **Compile** tab, second from top
2. Then to compile the interface, click on **Compile AuthorMappingInterface.sol**

![Compiling AuthorMappingInterface.sol](/images/node-operators/networks/collators/author-mapping/author-mapping-2.webp)

### Access the Contract {: #access-the-contract }

1. Click on the **Deploy and Run** tab, directly below the **Compile** tab in Remix. Note: you are not deploying a contract here, instead you are accessing a precompiled contract that is already deployed
2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** drop down
3. Ensure **AuthorMappingInterface.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract there is no need to deploy, instead you are going to provide the address of the precompile in the **At Address** field
4. Provide the address of the author mapping precompile for Moonbase Alpha: `{{networks.moonbase.precompiles.author_mapping}}` and click **At Address**

![Provide the address](/images/node-operators/networks/collators/author-mapping/author-mapping-3.webp)

The author mapping precompile will appear in the list of **Deployed Contracts**.

### Map Session Keys {: #map-session-keys }

The next step is to map your session keys to your H160 account (an Ethereum-style address). Make sure you hold the private keys to this account, as this is where the block rewards are paid out to.

To map your session keys to your account, you need to be inside the [candidate pool](/node-operators/networks/collators/activities/#become-a-candidate){target=\_blank}. Once you are a candidate, you need to send a mapping extrinsic. Note that this will bond tokens per author ID registered.

Before getting started, ensure you're connected to the account that you want to map your session keys to. This will be the account where you will receive block rewards.

1. Expand the **AUTHORMAPPING** contract
2. Expand the **setKeys** method
3. Enter your session keys
4. Click **transact**
5. Confirm the MetaMask transaction that appears by clicking **Confirm**

![Map your session keys](/images/node-operators/networks/collators/author-mapping/author-mapping-4.webp)

To verify you have mapped your session keys successfully, you can use either the `mappingWithDeposit` method or the `nimbusLookup` method of the [author mapping pallet](/node-operators/networks/collators/account-management/#author-mapping-interface){target=\_blank}. To do so, please refer to the [Check Mappings section of the Collator Account Management guide](/node-operators/networks/collators/account-management/#check-the-mappings){target=\_blank}.
