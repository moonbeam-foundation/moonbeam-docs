---
title: Non-Network Specific Precompiles
description: Learn how to use precompiled contracts, which are not specific to Ethereum or Moonbeam, yet are supported for use in your application.
keywords: ethereum, moonbeam, StorageCleaner, ECRecoverPublicKey
---

# Non-Network Specific Precompiled Smart Contracts

## Introduction {: #introduction }

A precompiled contract, or simply precompile, is a set of programmed functionality that it is hard coded into the blockchain client itself. Precompiles are designed to perform computationally heavy tasks, such as cryptographic processes like hashing. Moving these functionalities to the blockchain client serves the dual purposes of making the computation more efficient than using a traditional smart contract and ensuring everyone has access to the complete and correct set of processes and algorithms required for the blockchain to operate properly.

Precompile functionality is bundled and shared under a smart contract address which allows interactions similar to a traditional smart contract. There are some precompiled contracts that are not specific to Ethereum nor to Moonbeam, but are supported for use in your Moonbeam application. 

The following precompiles are currently included in this category: StorageCleaner and ECRecoverPublicKey. 

In the next section, you will learn more about the functionalities included in these precompiles.  

## Clear Storage Entries with StorageCleaner {: #clear-storage-with-storagecleaner }

The main function of this precompile is to clear storage entry key-value pairs for a smart contract marked as self-destructed, sometimes also referred to as 'suicided.' StorageCleaner includes functionality to iterate over a list of addresses to identify self-destructed contracts and delete the appropriate storage entries associated with identified addresses. You can also input a limit to prevent the precompile from consuming too much gas. 

## Verify Signatures with ECRecoverPublicKey {: verifying-signatures-ecrecoverpublickey }

The main function of this precompile is to verify the signature of a message. This precompile is similar to [ECRecover](/builders/ethereum/precompiles/utility/eth-mainnet/#verify-signatures-with-ecrecover/){target=\_blank} with the exception of returning the public key of the account which signed the message rather than the account address. 



