---
title: Relay Data Verifier Precompile Contract
description: Learn how to verify data availability and authenticity on the relay chain via a Solidity interface with Moonbeam's Relay Data Verifier Precompile contract.
keywords: solidity, ethereum, verify, proof, relay chain, transaction, moonbeam, precompiled, contracts
---

# Interacting with the Relay Data Verifier Precompile

## Introduction {: #introduction }

Polkadot's relies on state proofs to guarantee data integrity at a particular time. A state proof is a concise, cryptographic data structure representing a specific subset of transactions or state data within a trie. It consists of a set of hashes that form a path from the target data to the root hash stored in the block header.

A client can independently reconstruct the root hash and compare it with the original stored in the block header by providing a state proof. If the reconstructed root hash matches the original, it confirms the target data's authenticity, validity, and inclusion within the blockchain.

Polkadot's unique architecture and parachain block validation process means blockchains like Moonbeam have the relay chain storage root hash in their state. Consequently, Moonbeam can provide a mechanism to verify a relay chain state by checking the proof against the stored storage root hash.

Moonbeam's [relay data verifier precompiled](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/relay-data-verifier/RelayDataVerifier.sol){target=\_blank} contract provides an easy way for smart contracts to programmatically build functions that rely on verifying relay chain state in contract calls. Consequently, no oracles are needed to feed relay chain data to Moonbeam. This functionality is readily available at the following contract addresses:

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.relay_data_verifier }}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.relay_data_verifier }}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.relay_data_verifier }}
     ```

--8<-- 'text/builders/pallets-precompiles/precompiles/security.md'

## The Relay Data Verifier Solidity Interface {: #the-relay-data-verifier-solidity-interface }

[`RelayDataVerifier.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/relay-data-verifier/RelayDataVerifier.sol){target=\_blank} is a Solidity interface that allows developers to interact with the precompile's methods.

??? code "RelayDataVerifier.sol"

    ```solidity
    --8<-- 'code/builders/pallets-precompiles/precompiles/relay-data-verifier/RelayDataVerifier.sol'
    ```

The interface includes the following functions:

???+ function "**latestRelayBlockNumber**() — retrieves the most recent relay chain block that has its storage root stored on the blockchain itself"

    === "Parameters"

        None

    === "Returns"

        The latest relay block number that has a storage root stored on-chain.

??? function "**verifyEntry**(_uint32_ relayBlockNumber, _ReadProof_ calldata readProof, _bytes_ callData key) — verifies a storage entry in the relay chain using a relay block number, a storage proof, and the storage key. It returns the value associated with the key if the verification is successful"

    === "Parameters"

        - `relayBlockNumber` - the relay block number for which the data is being verified. The latest relay block number can be obtained from the `latestRelayBlockNumber()` function
        - `readProof` - a struct defined in the precompile contract, containing the storage proof used to verify the data. The `ReadProof` struct is defined as:
          ```
          struct ReadProof {
              // The block hash against which the proof is generated
              bytes32 at;
              /// The storage proof
              bytes[] proof;
          }
          ```
        - `key` - the storage key for the generated proof
    
    === "Returns"

        When performing a [static call](https://docs.ethers.org/v6/api/contract/#BaseContractMethod-staticCall){target=\_blank} on the `verifyEntry` function, you can view the returned value associated with the key in hexadecimal format.

        ```js
         
        '0x01000000040000000100000000000000f88ce384dca20000000000000000000000370589030a0000000000000000000000203d88792d0000000000000000000000000000000000000000000000000080'
        ```

??? function "**verifyEntries**(_uint32_ relayBlockNumber, _ReadProof_ calldata readProof, _bytes[]_ callData keys) — verifies a set of entries in the relay chain and returns the corresponding values. This function takes a relay block number, a storage proof, and an array of storage keys to verify. It returns an array of values associated with the keys, in the same order as the keys"

    === "Parameters"

        - `relayBlockNumber` - the relay block number for which the data is being verified. The latest relay block number can be obtained from the `latestRelayBlockNumber()` function
        - `readProof` - a struct defined in the precompile contract, containing the storage proof used to verify the data. The `ReadProof` struct is defined as:
        ```
        struct ReadProof {
            // The block hash against which the proof is generated
            bytes32 at;
            /// The storage proof
            bytes[] proof;
        }
        ```
        - `keys` - the storage keys for the generated proof

    === "Returns"

        When performing a [static call](https://docs.ethers.org/v6/api/contract/#BaseContractMethod-staticCall){target=\_blank} on the `verifyEntries` function, you can view an array containing the corresponding values mapped to their respective keys, represented in hexadecimal format.

        ```js
         
        ['0x01000000040000000100000000000000f88ce384dca20000000000000000000000370589030a0000000000000000000000203d88792d0000000000000000000000000000000000000000000000000080']
        ```

## Interact with the Solidity Interface {: #interact-with-the-solidity-interface }

A typical workflow to verify relay chain data involves the following steps:

1. **Moonbeam RPC call** - call the `latestRelayBlockNumber` function to get the latest relay block number tracked by the chain in the `pallet-storage-root`
2. **Relay RPC call** - call the `chain_getBlockHash(blockNumber)` RPC method to get the relay block hash for the block number obtained in step one
3. **Relay RPC call** - call the `state_getReadProof(keys, at)` RPC method to retrieve the storage proof, where `at` is the relay block hash obtained in step two, and `keys` is an array of strings which contains the keys for target storage items. For `@polkadot/api`, it can be obtained via `api.query.module.key()` function
4. **Moonbeam RPC call** - submit an Ethereum transaction to call the `verifyEntry` or `verifyEntries` function to verify the data against the relay block number. The call data should contain the relay block number obtained in step one, the read proof generated in step three, and the key(s) to verify

The following sections will cover how to interact with the Relay Data Verifier Precompile using Ethereum libraries, such as Ethers.js, Web3.js, and Web3.py. The examples in this guide will be on Moonbase Alpha.

### Checking Prerequisites {: #checking-prerequisites }

To follow along with this tutorial, you will need to have:

- Create or have an account on Moonbase Alpha to test out the different features in the precompile
- The account will need to be funded with `DEV` tokens. 
 --8<-- 'text/_common/faucet/faucet-list-item.md'

### Using Ethereum Libraries {: #using-ethereum-libraries }

To interact with the Solidity interface using an Ethereum library, you'll need the precompile's ABI (Application Binary Interface). The ABI for the Relay Chain Data Verifier Precompile is as follows:

??? code "Relay Data Verifier Precompile ABI"

    ```js
    --8<-- 'code/builders/pallets-precompiles/precompiles/relay-data-verifier/abi.js'
    ```

Once you have the ABI, you can interact with the precompile using the Ethereum library of your choice, such as [Ethers.js](/builders/build/eth-api/libraries/ethersjs/){target=\_blank}, [Web3.js](/builders/build/eth-api/libraries/web3js){target=\_blank}, or [Web3.py](/builders/build/eth-api/libraries/web3py){target=\_blank}. The general steps are as follows:

1. Create a provider
2. Create a contract instance of the precompile
3. Interact with the precompile's functions

The provided code example demonstrates how to use the Ethers.js library to interact with the Moonbase Alpha network and its relay chain, verifying a data entry using the `verifyEntry` function.

!!! note
     The code snippets presented in the following sections are not meant for production environments. Please make sure you adapt it for each use case.

=== "Ethers.js"

     ```js
     --8<-- 'code/builders/pallets-precompiles/precompiles/relay-data-verifier/ethers-relay-data-verifier.js'
     ```

=== "Web3.js"

     ```js
     --8<-- 'code/builders/pallets-precompiles/precompiles/relay-data-verifier/web3js-relay-data-verifier.js'
     ```

=== "Web3.py"

     ```py
     --8<-- 'code/builders/pallets-precompiles/precompiles/relay-data-verifier/web3py-relay-data-verifier.py'
     ```
