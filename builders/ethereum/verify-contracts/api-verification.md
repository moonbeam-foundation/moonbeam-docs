---
title: Verify Smart Contracts through APIs
description: Learn how to verify smart contracts on Moonbeam-based networks using one of the available API-based verification methods.
categories: Ethereum Toolkit
---

# API-based Contract Verification

## Introduction {: #introduction }

Verifying smart contracts greatly improves their transparency and security.  Smart contracts deployed on Moonbeam networks can be verified through API-based tools, including Moonscan API and Sourcify.

This page will outline the steps for using these API-based tools for verifying smart contracts, or retrieving verification status and metadata of smart contracts on Moonbeam networks.

## Using Moonscan API {: #using-moonscan-api }

[Moonscan](https://moonscan.io){target=\_blank} is an official fork of Etherscan that can be used to view and search on-chain data, and comes with a suite of developer tools and analytics to interact with data on Moonbeam networks.

The [Etherscan API](https://docs.etherscan.io){target=\_blank} provides a variety of endpoints for verifying smart contracts, retrieving verified contract ABI and source code, and interacting with verified contracts on Moonbeam networks.

### Generating an Etherscan API Key {: #generating-an-etherscan-api-key }

Before using the Moonscan API, you need to generate an Etherscan API key. Please follow the instructions in [the key generation section](/builders/ethereum/verify-contracts/etherscan-plugins/#generating-an-etherscan-api-key){target=\_blank} of the Etherscan plug-in verification page, as the API keys generated are used for both.

### Moonscan Public API URL {: #moonscan-public-api-url }

The Moonscan API URL for Moonbeam networks is as follows:

=== "Moonbeam"

    ```text
    https://api-moonbeam.moonscan.io/api
    ```

=== "Moonriver"

    ```text
    https://api-moonriver.moonscan.io/api
    ```

=== "Moonbase Alpha"

    ```text
    https://api-moonbase.moonscan.io/api
    ```

### Verify Source Code {: #verify-source-code }

To verify a deployed contract's source code using the Moonscan API, you must form a POST request containing all the relevant contract creation information, and send the request to Moonscan's REST API. The following is sample code using JavaScript and [Axios](https://axios-http.com/docs/intro){target=\_blank}, an HTTP client:

=== "Moonbeam"

    ```javascript
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/1.js'
    ```

=== "Moonriver"

    ```javascript
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/2.js'
    ```

=== "Moonbase Alpha"

    ```javascript
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/3.js'
    ```

Upon successful submission, a GUID will be returned as a part of the result. This GUID can be used to check for the submission status.

=== "Moonbeam"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/4.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/5.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/6.sh'
    ```

### Retrieve Contract ABI for Verified Contracts {: #retrieve-contract-abi-for-verified-contracts }

Once your contract is verified on Moonscan, you can use the following endpoint to retrieve the contract ABI:

=== "Moonbeam"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/7.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/8.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/9.sh'
    ```

### Retrieve Contract Source Code for Verified Contracts {: #retrieve-contract-source-code-for-verified-contracts }

Once your contract is verified on Moonscan, you can use the following endpoint to retrieve the contract source code:

=== "Moonbeam"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/10.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/11.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/12.sh'
    ```

## Using Sourcify API {: #using-sourcify-api }

[Sourcify](https://sourcify.dev){target=\_blank} is a multi-chain decentralized automated contract verification service, and maintains a public repository of contract metadata. Sourcify also provides a public server API for verification, and checking if a contract is verified, and a repository API for retrieving metadata files.

### Sourcify Public Server URL {: #sourcify-public-server-url }

Soucify API endpoints can be accessed through the following public servers:

=== "Production"

    ```text
    https://sourcify.dev/server
    ```

=== "Staging"

    ```text
    https://staging.sourcify.dev/server
    ```

### Moonbeam Network Chain ID's {: #moonbeam-network-chain-ids }

Sourcify uses chain ID's to identify the target network(s) for the request. The chain ID's of Moonbeam networks are as follows:

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.chain_id }}
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.chain_id }}
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/13.sh'
    ```

### Perfect vs. Partial Match {: #full-vs-partial-match }

Sourcify supports two types of verification match results.

Full matches (sometimes referred as perfect matches) refer to the cases when the bytecode of the deployed contract is byte-by-byte the same as compilation output of the given source code files under the compilation settings defined in the metadata file.

Partial matches refer to cases when the deployed bytecode of the onchain contract match the bytecode resulting from the recompilation with the metadata and the source files except the metadata hash. For partial matches, the deployed contract and the given source code and metadata are functionally the same, but there are differences in source code comments, variable names, or other metadata fields such as source paths.

### Verify Contract {: #verify-contract }

A POST request is used to verify a contract on Sourcify. The following is sample code using JavaScript:

=== "Moonbeam"

    ```javascript
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/14.js'
    ```

=== "Moonriver"

    ```javascript
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/15.js'
    ```

=== "Moonbase Alpha"

    ```javascript
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/16.js'
    ```

Alternatively, you can also use [the Sourcify hosted GUI](https://sourcify.dev/#/verifier){target=\_blank} to submit a contract for verification.  

### Check Verification Status by Address and Chain ID {: check-verification-status-by-address-and-chain-id }

Sourcify provides endpoints for checking the verification status of contracts on multiple EVM chains at once. This can be done through URL parameters, by specifying the contract addresses and the chain ID's of the networks.  

There are two variations of this endpoint, one for perfect matching and one for partial matching:

=== "Perfect Match"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/17.sh'
    ```

=== "Partial Match"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/18.sh'
    ```

An example response will be a JSON object of the following structure:

```json
--8<-- 'code/builders/ethereum/verify-contracts/api-verification/19.json'
```

### Retrieve Contract Source Files for Verified Contracts {: get-contract-source-files-for-verified-contracts }

You can also retrieve the source files of verified contracts from the Sourcify repository.

There are two variations of this endpoint, one for the source files of perfect matches:

=== "Moonbeam"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/20.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/21.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/22.sh'
    ```

And one for the source files of both perfect and partial matches:

=== "Moonbeam"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/23.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/24.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/25.sh'
    ```

### Using Sourcify with Foundry {: #using-sourcify-with-foundry }

Foundry's Forge tool has built-in support for Sourcify verification similar to how it has [built-in support for Etherscan](/builders/ethereum/verify-contracts/etherscan-plugins/#using-foundry-to-verify){target=\_blank}. The example in this section of the guide will use the `MyToken.sol` contract that was created in the [Using Foundry to Deploy to Moonbeam](/builders/ethereum/dev-env/foundry/){target=\_blank} guide.

A Foundry project that uses Sourcify must have their compiler emit metadata files. This can be configured in the `foundry.toml` file:

```toml
--8<-- 'code/builders/ethereum/verify-contracts/api-verification/26.toml'
```

If you have already deployed the example contract, you can verify it with the `verify-contract` command. Before you can verify the contract, you will need to ABI-encode the constructor arguments. To do so for the example contract, you can run the following command:

```bash
--8<-- 'code/builders/ethereum/verify-contracts/api-verification/27.sh'
```

The result should be `0x0000000000000000000000000000000000000000000000000000000000000064`. You can then verify the contract using the following command:

=== "Moonbeam"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/28.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/29.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/30.sh'
    ```

--8<-- 'code/builders/ethereum/verify-contracts/api/terminal/verify-original.md'

If you wanted to deploy the example contract and verify at the same time, then you would use the following command:

=== "Moonbeam"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/31.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/32.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/builders/ethereum/verify-contracts/api-verification/33.sh'
    ```

--8<-- 'code/builders/ethereum/verify-contracts/api/terminal/create.md'
