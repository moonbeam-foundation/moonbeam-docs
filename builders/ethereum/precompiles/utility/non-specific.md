---
title: Neither Moonbeam Nor Ethereum Specific Precompiles
description: Learn how to use precompiled contracts which are not specific to Moonbeam or Ethereum, such as sha3FIPS256, ECRecoverPublicKey, and StorageCleaner.
keywords: ethereum, moonbeam, ECRecoverPublicKey, sha3FIPS256, StorageCleaner, precompile
---

# Neither Moonbeam Nor Ethereum Specific Precompiles

## Introduction {: #introduction }

Precompiled contracts (precompiles) are a set of special, predefined functions built into the software of a blockchain client. These functions are designed to perform computation heavy cryptography, such as hashing and signature verification, in a standardized and more efficient way. These functions are grouped together and assigned a blockchain address. You can interact with precompiles using the same tools as working with your deployed contracts. 

There is a group of precompiles that are neither specific to Moonbeam nor Ethereum but are supported for use. This group includes `Sha3FIPS256`, `ECRecoverPublicKey`, and `StorageCleaner`. 

In this guide, you will learn how to use and/or verify these precompiles. 

## Checking Prerequisites {: #checking-prerequisites }

<!--TODO: refer to pre-reqs in Eth main version of article for starter-->

## Hashing with SHA3FIPS256 {: #hashing-with-sha3fips256 }

SHA3-256 is part of the SHA-3 family of cryptographic hashes codified in [FIPS202](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf) that produces an output 256 bits in length. Although the name is similar to SHA256, the SHA-3 family is built with an entirely different algorithm and accordingly produces a different hash output than SHA256 for the same input. You can verify this yourself using this [SHA3-256 Hash Calculator tool](https://md5calc.com/hash/sha3-256){target=\_blank}. After calculating the SHA3-256 output, change the algorithm in the drop-down selector to SHA256 and take note of the resulting output.

Currently there is no SHA3-256 support in Solidity, so it needs to be called with inline assembly. The following sample code can be used to call this precompile.

```solidity
--8<-- 'code/builders/ethereum/precompiles/utility/eth-mainnet/sha3fips.sol'
```

## ECRecoverPublicKey


## Storage Cleaner
