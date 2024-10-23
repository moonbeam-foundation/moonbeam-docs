---
title: Non-Network Specific Precompiles
description: Learn how to use precompiled contracts, which are not specific to Ethereum or Moonbeam, yet are supported for use in your application.
keywords: ethereum, moonbeam, StorageCleaner, ECRecoverPublicKey, sha3FIPS256
---

# Non-Network Specific Precompiled Smart Contracts

## Introduction {: #introduction }

A precompiled contract, or precompile, is a set of programmed functionalities hard-coded into the blockchain client. Precompiles perform computationally heavy tasks, such as cryptographic processes like hashing. Moving these functionalities to the blockchain client serves the dual purpose of making the computation more efficient than using a traditional smart contract and ensuring everyone has access to the complete and accurate set of processes and algorithms required to operate correctly.

Precompile functionality is bundled and shared under a smart contract address, which allows interactions similar to those of a traditional smart contract. Some precompiled contracts are not specific to Ethereum or Moonbeam, but are supported for use in your Moonbeam application. 

The nonspecific precompiles currently included in this category include `StorageCleaner`, `ECRecoverPublicKey`, and `SHA3FIPS256`. 

In the next section, you will learn more about the functionalities included in these precompiles.  

## Clear Storage Entries with StorageCleaner {: #clear-storage-with-storagecleaner }

The primary function of the `StorageCleaner` precompile is to clear storage entry key-value pairs for a smart contract marked as self-destructed, previously referred to as 'suicided.' `StorageCleaner` includes functionality to iterate over a list of addresses to identify self-destructed contracts and delete the appropriate storage entries associated with identified addresses. You can also input a numeric limit to prevent the precompile from consuming too much gas. 

With the implementation of [EIP-6780: SELFDESTRUCT](https://eips.ethereum.org/EIPS/eip-6780){target=\_blank} as part of the Ethereum Cancun/Dencun upgrade, contracts can only be self-destructed in the same transaction where they are created. This limitation keeps storage entries small and allows them to be automatically deleted during destruction. The `StorageCleaner` precompile remains available when a legacy contract needs storage entries cleared. 

## Retrieve a Public Key with ECRecoverPublicKey {: verifying-signatures-ecrecoverpublickey }

The primary function of the `ECRecoverPublicKey` precompile is to recover the public key used to create a digital signature from a given message hash and signature. This precompile is similar to [ECRecover](/builders/ethereum/precompiles/utility/eth-mainnet/#verify-signatures-with-ecrecover/){target=\_blank}, with the exception of returning the public key of the account that signed the message rather than the account address. 

In the following sections, you will learn how to use the `ECRecoverPublicKey` precompile.

### Checking Prerequisites {: checking-prerequisites }

--8<-- 'text/_common/install-nodejs.md'

The versions used in this example are v20.15.0 (Node.js) and 10.7.0 (npm). You will also need to install the [Web3](https://web3js.readthedocs.io/en/latest){target=\_blank} package by executing:

```bash
npm install --save web3
```

To verify the installed version of Web3, you can use the `ls` command:

```bash
npm ls web3
```

This example uses version 4.11.1. You will also use [Remix](/builders/ethereum/dev-env/remix/){target=\_blank}, connecting it to the Moonbase Alpha TestNet via [MetaMask](/tokens/connect/metamask/){target=\_blank}.

--8<-- 'text/_common/endpoint-examples.md'

### Retrieve Transaction Signature Values

To use the `ECRecoverPublicKey` precompile, you must first sign a message to create and retrieve the message hash and transaction signature values (`v`, `r`, `s`) to pass as arguments in the contract call. Always use security best practices when handling private keys. 

Create a new file called `signMessage.js` in your project directory:

```bash
touch signMessage.js
```

Open `signMessage.js` in your code editor and add the following script to initialize Web3 with Moonbase Alpha TestNet, sign and hash the message, and return the signature values:

```js title="signMessage.js"
--8<-- 'code/builders/ethereum/precompiles/utility/nonspecific/signMessage.js'
```

Return to your terminal command line to run the script with this command:

```bash
node signMessage.js
```

This code will return the following object in the terminal:

--8<-- 'code/builders/ethereum/precompiles/utility/nonspecific/terminal/signature.md'

Save these values as you will need them in the next section.

### Test ECRecoverPublicKey Contract

You can now visit [Remix](https://remix.ethereum.org/){target=\_blank} to test the precompiled contract. Note that you could also use the Web3.js library, but in this case, you can go to Remix to ensure it is using the precompiled contract on the blockchain. The Solidity code you can use to retrieve the public key is the following:

```solidity title="RecoverPublicKey.sol"
--8<-- 'code/builders/ethereum/precompiles/utility/nonspecific/RecoverPublicKey.sol'
```

Using the [Remix compiler and deployment](/builders/ethereum/dev-env/remix/){target=\_blank} and with [MetaMask pointing to Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}, you can deploy the contract and call the `recoverPublicKey()` method which returns the public key for the account that signed the message. You can now use this public key value for other cryptographic functions and verifications.

![Returned Public Key on Remix](/images/builders/ethereum/precompiles/utility/nonspecific/nonspecific-1.webp)

## Create a Hash with SHA3FIPS256 {: #create-a-hash-with-sha3fips256 }

SHA3-256 is part of the SHA-3 family of cryptographic hashes codified in [FIPS202](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf) that produces an output 256 bits in length. Although the name is similar to SHA256, the SHA-3 family is built with an entirely different algorithm and accordingly produces a different hash output than SHA256 for the same input. You can verify this yourself using this [SHA3-256 Hash Calculator tool](https://md5calc.com/hash/sha3-256){target=\_blank}. After calculating the SHA3-256 output, change the algorithm in the drop-down selector to SHA256 and take note of the resulting output.

Currently there is no SHA3-256 support in Solidity, so it needs to be called with inline assembly. The following sample code can be used to call this precompile.

```solidity
--8<-- 'code/builders/ethereum/precompiles/utility/eth-mainnet/sha3fips.sol'
```

Using [Remix](/builders/ethereum/dev-env/remix/){target=\_blank} with [MetaMask pointing to Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}, you can deploy the contract and call the `sha3fips(bytes memory data)` method to return the encoded string of the data parameter.

--8<-- 'text/_disclaimers/third-party-content-intro.md'