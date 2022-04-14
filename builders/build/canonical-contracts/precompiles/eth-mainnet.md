---
title: Ethereum MainNet Precompiles
description: Learn how to use the standard precompiled contracts availble on Ethereum such as ECRECOVER, SHA256, and more on Moonbeam.
keywords: ethereum, moonbeam, ecrecover, sha256, sha3FIPS256, ripemd-160, Bn128Add, Bn128Mul, Bn128Pairing
---

# Ethereum MainNet Precompiled Contracts on Moonbase Alpha

![Precomiled Contracts Banner](/images/builders/build/canonical-contracts/precompiles/eth-mainnet/eth-mainnet-banner.png)

## Introduction {: #introduction } 

Another feature added with the [release of Moonbase Alpha v2](https://moonbeam.network/blog/moonbase-alpha-v2-contract-events-pub-sub-capabilities/) is the inclusion of some [precompiled contracts](https://docs.klaytn.com/smart-contract/precompiled-contracts) that are natively available on Ethereum. 

The following precompiles are currently included: ecrecover, sha256, sha3FIPS256, ripemd-160, Bn128Add, Bn128Mul, Bn128Pairing, the identity function, and modular exponentiation.

In this guide, we will explain how to use and/or verify these precompiles.

## Checking Prerequisites {: #checking-prerequisites } 

--8<-- 'text/common/install-nodejs.md'

As of writing this guide, the versions used were 15.2.1 and 7.0.8, respectively. We will also need to install the Web3 package by executing:

```
npm install --save web3
```

To verify the installed version of Web3, you can use the `ls` command:

```
npm ls web3
```
As of writing this guide, the version used was 1.3.0. We will be also using [Remix](/builders/tools/remix/), connecting it to the Moonbase Alpha TestNet via [MetaMask](/tokens/connect/metamask/).

--8<-- 'text/common/endpoint-examples.md'

## Verify Signatures with ECRECOVER {: #verify-signatures-with-ecrecover } 

The main function of this precompile is to verify the signature of a message. In general terms, you feed `ecrecover` the transaction's signature values and it returns an address. The signature is verified if the address returned is the same as the public address that sent the transaction.

Let's jump into a small example to showcase how to leverage this precompiled function. To do so we need to retrieve the transaction's signature values (v, r, s). Therefore, we'll sign and retrieve the signed message where these values are:

--8<-- 'code/precompiles/ecrecover.md'

This code will return the following object in the terminal:

--8<-- 'code/precompiles/ecrecoverresult.md'

With the necessary values, we can go to Remix to test the precompiled contract. Note that this can also be verified with the Web3 JS library, but in our case, we'll go to Remix to be sure that it is using the precompiled contract on the blockchain. The Solidity code we can use to verify the signature is the following:

--8<-- 'code/precompiles/ecrecoverremix.md'

Using the [Remix compiler and deployment](/builders/interact/remix/) and with [MetaMask pointing to Moonbase Alpha](/tokens/connect/metamask/), we can deploy the contract and call the `verify()` method that returns _true_ if the address returned by `ecrecover` is equal to the address used to sign the message (related to the private key and needs to be manually set in the contract).

## Hashing with SHA256 {: #hashing-with-sha256 } 

This hashing function returns the SHA256 hash from the given data. To test this precompile, you can use this [online tool](https://md5calc.com/hash/sha256) to calculate the SHA256 hash of any string you want. In our case, we'll do so with `Hello World!`. We can head directly to Remix and deploy the following code, where the calculated hash is set for the `expectedHash` variable:

--8<-- 'code/precompiles/sha256.md'

Once the contract is deployed, we can call the `checkHash()` method that returns _true_ if the hash returned by `calculateHash()` is equal to the hash provided.

## Hashing with SHA3FIPS256 {: #hashing-with-sha3fips256 }

SHA3-256 is part of the SHA-3 family of cryptographic hashes codified in [FIPS202](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf) that produces an output 256 bits in length. Although the name is similar to SHA256, the SHA-3 family is built with an entirely different algorithm and accordingly produces a different hash output than SHA256 for the same input. You can verify this yourself using this [online tool](https://md5calc.com/hash/sha3-256). After calculating the SHA3-256 output, change the algorithm in the drop-down selector to SHA256 and take note of the resulting output.

Currently there is no SHA3-256 support in Solidity, so it needs to be called with inline assembly. The following sample code can be used to call this precompile.

--8<-- 'code/precompiles/sha3fips.md'

Using the [Remix compiler and deployment](/builders/interact/remix/) and with [MetaMask pointing to Moonbase Alpha](/tokens/connect/metamask/), we can deploy the contract and call the `sha3fips(bytes memory data)` method to return the encoded string of the data parameter.

## Hashing with RIPEMD-160 {: #hashing-with-ripemd-160 } 

This hashing function returns a RIPEMD-160 hash from the given data. To test this precompile, you can use this [online tool](https://md5calc.com/hash/ripemd160) to calculate the RIPEMD-160 hash of any string. In our case, we'll do so again with `Hello World!`. We'll reuse the same code as before, but use the `ripemd160` function. Note that it returns a `bytes20` type variable:

--8<-- 'code/precompiles/ripemd160.md'

With the contract deployed, we can call the `checkHash()` method that returns _true_ if the hash returned by `calculateHash()` is equal to the hash provided.

## BN128Add {: #bn128add }

The BN128Add precompile implements a native elliptic curve point addition. It returns an elliptic curve point representing `(ax, ay) + (bx, by)` such that `(ax, ay)` and `(bx, by)` are valid points on the curve BN256. 

Currently there is no BN128Add support in Solidity, so it needs to be called with inline assembly. The following sample code can be used to call this precompile.

--8<-- 'code/precompiles/bn128add.md'

Using the [Remix compiler and deployment](/builders/interact/remix/) and with [MetaMask pointing to Moonbase Alpha](/tokens/connect/metamask/), we can deploy the contract and call the `callBn256Add(bytes32 ax, bytes32 ay, bytes32 bx, bytes32 by)` method to return the result of the operation.

## BN128Mul {: #bn128mul }

The BN128Mul precompile implements a native elliptic curve multiplication with a scalar value. It returns an elliptic curve point representing `scalar * (x, y)` such that `(x, y)` is a valid curve point on the curve BN256. 

Currently there is no BN128Mul support in Solidity, so it needs to be called with inline assembly. The following sample code can be used to call this precompile.

--8<-- 'code/precompiles/bn128mul.md'

Using the [Remix compiler and deployment](/builders/interact/remix/) and with [MetaMask pointing to Moonbase Alpha](/tokens/connect/metamask/), we can deploy the contract and call the `callBn256ScalarMul(bytes32 x, bytes32 y, bytes32 scalar)` method to return the result of the operation.

## BN128Pairing {: #bn128pairing }

The BN128Pairing precompile implements elliptic curve paring operation to perform zkSNARK verification. For more information, see [EIP-197](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-197.md). 

Currently there is no BN128Pairing support in Solidity, so it needs to be called with inline assembly. The following sample code can be used to call this precompile.

--8<-- 'code/precompiles/bn128pairing.md'

Using the [Remix compiler and deployment](/builders/interact/remix/) and with [MetaMask pointing to Moonbase Alpha](/tokens/connect/metamask/), we can deploy the contract and call the `function callBn256Pairing(bytes memory input)` method to return the result of the operation.

## The Identity Function {: #the-identity-function } 

Also known as datacopy, this function serves as a cheaper way to copy data in memory. 

Currently there is no Identity Function support in Solidity, so it needs to be called with inline assembly. The [following sample code](https://docs.klaytn.com/smart-contract/precompiled-contracts#address-0x-04-datacopy-data) (adapted to Solidity), can be used to call this precompiled contract. You can use this [online tool](https://web3-type-converter.onbrn.com/) to get bytes from any string, as this is the input of the method `callDataCopy()`.

--8<-- 'code/precompiles/identity.md'

With the contract deployed, we can call the `callDataCopy()` method and verify if `memoryStored` matches the bytes that you pass in as an input of the function.

## Modular Exponentiation {: #modular-exponentiation } 

This precompile calculates the remainder when an integer _b_ (base) is raised to the _e_-th power (the exponent), and is divided by a positive integer _m_ (the modulus).

The Solidity compiler does not support it, so it needs to be called with inline assembly. The [following code](https://docs.klaytn.com/smart-contract/precompiled-contracts#address-0x05-bigmodexp-base-exp-mod) was simplified to show the functionality of this precompile. 

--8<-- 'code/precompiles/modularexp.md'

You can try this in [Remix](/builders/tools/remix/). Use the function `verify()`, passing the base, exponent, and modulus. The function will store the value in the `checkResult` variable. 

