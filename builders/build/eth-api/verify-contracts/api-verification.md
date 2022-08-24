---
title: Verify Smart Contracts through APIs
description: Learn how to verify smart contracts on Moonbeam-based networks using one of the available API-based verification methods. 
---

# API-based Contract Verification

![API Verification Banner](/images/builders/build/eth-api/verify-contracts/api-verification/api-verification-banner.png)

## Introduction {: #introduction } 

Verifying smart contracts greatly improves their transparency and security.  Smart contracts deployed on Moonbeam networks can be verified through API-based tools, including Moonscan API and Sourcify. 

This page will outline the steps for using these API-based tools for verifying smart contracts, or retrieving verification status and metadata of smart contracts on Moonbeam networks.

## Using Moonscan API {: #using-moonscan-api } 

[Moonscan](https://moonscan.io/){target=_blank} is an official fork of Etherscan that can be used to view and search on-chain data, and comes with a suite of developer tools and analytics to interact with data on Moonbeam networks. 

Moonscan exposes a set of REST API endpoints similar to the [Etherscan API](https://docs.etherscan.io/){target=_blank} endpoints that can be used to verify smart contracts, retrieve verified contract ABI and source code, or otherwise interact with verified contracts on Moonbeam networks. 

### Generating a Moonscan API Key {: #generating-a-moonscan-api-key }

Before using the Moonscan API, you need to generate a Moonscan API key. Please follow the instructions in [the key generation section](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank} of the Etherscan plug-in verification page, as the API keys generated are used for both.

### Moonscan Public API URL {: #moonscan-public-api-url }

The Moonscan API URL for Moonbeam networks is as follows:

=== "Moonbeam"
    ```
    https://api-moonbeam.moonscan.io/api
    ```

=== "Moonriver"
    ```
    https://api-moonriver.moonscan.io/api
    ```

=== "Moonbase Alpha"
    ```
    https://api-moonbase.moonscan.io/api
    ```

### Verify Source Code {: #verify-source-code }

To verify a deployed contract's source code using the Moonscan API, you must form a POST request containing all the relevant contract creation information, and send the request to Moonscan's REST API. The following is sample code using JavaScript and [Axios](https://axios-http.com/docs/intro){target=_blank}, an HTTP client:

=== "Moonbeam"
    ```javascript
    // Submit Source Code for Verification
    const response = await axios.post("https://api-moonbeam.moonscan.io/api", {
        apikey: "INSERT-API-KEY-HERE",
        module: "contract",
        action: "verifysourcecode",
        contractAddress: "INSERT-CONTRACT-ADDRESS-HERE",
        sourceCode: "INSERT-SOURCE-CODE-HERE", // flattened if necessary
        codeformat: "solidity-single-file" // or you can use "solidity-standard-json-input"
        contractname: "INSERT-CONTRACT-NAME-HERE", // if codeformat = solidity-standard-json-input, then enter contractname as ex: erc20.sol:erc20
        compilerversion: "INSERT-COMPILER-VERSION-HERE" // see https://etherscan.io/solcversions for list of support versions
        optimizationUsed: 0 // 0 = no optimization, 1 = optimization was used (applicable when codeformat=solidity-single-file)
        runs: 200 // set to 200 as default unless otherwise (applicable when codeformat=solidity-single-file) 
        constructorArguements: "INSERT-CONSTRUCTOR-ARGUMENTS-HERE" // if applicable
        evmversion: "INSERT-EVM-VERSION-HERE", // options: homestead, tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, istanbul (applicable when codeformat=solidity-single-file)
        licenseType: 1, // valid codes 1-14 where 1=No License ... 14=Business Source License 1.1, see https://etherscan.io/contract-license-types
        libraryname1: "INSERT-LIBRARY-NAME-HERE" // if applicable, enter the name of the first library used, i.e. SafeMath (up to 10 libraries can be used)
        libraryaddress1: "INSERT-LIBRARY-ADDRESS-HERE" // if applicable, enter the address of the first library used
        libraryname2: "INSERT-LIBRARY-NAME-HERE", // if applicable, enter the name of the second library used
        libraryaddress2: "INSERT-LIBRARY-ADDRESS-HERE", // if applicable, enter the address of the second library used
        // ...
    }, headers: { "Content-Type": "application/x-www-form-urlencoded" })

    if (response.data.status == "1") {
        // 1 = submission success, use the guid returned (response.data.response.data) to check the status of your submission
        // average time of processing is 30-60 seconds
        console.log(response.data.status + "; " + response.data.message + "; " + response.data.result)
        // response.data.response.data is the GUID receipt for the submission, you can use this guid for checking the verification status
    } else {
        // 0 = error
        console.log(response.data.status + "; " + response.data.message + "; " + response.data.result)
    }
    ```

=== "Moonriver"
    ```javascript
    // Submit Source Code for Verification
    const response = await axios.post("https://api-moonriver.moonscan.io/api", {
        apikey: "INSERT-API-KEY-HERE",
        module: "contract",
        action: "verifysourcecode",
        contractAddress: "INSERT-CONTRACT-ADDRESS-HERE",
        sourceCode: "INSERT-SOURCE-CODE-HERE", // flattened if necessary
        codeformat: "solidity-single-file" // or you can use "solidity-standard-json-input"
        contractname: "INSERT-CONTRACT-NAME-HERE", // if codeformat = solidity-standard-json-input, then enter contractname as ex: erc20.sol:erc20
        compilerversion: "INSERT-COMPILER-VERSION-HERE" // see https://etherscan.io/solcversions for list of support versions
        optimizationUsed: 0 // 0 = no optimization, 1 = optimization was used (applicable when codeformat=solidity-single-file)
        runs: 200 // set to 200 as default unless otherwise (applicable when codeformat=solidity-single-file) 
        constructorArguements: "INSERT-CONSTRUCTOR-ARGUMENTS-HERE" // if applicable
        evmversion: "INSERT-EVM-VERSION-HERE", // options: homestead, tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, istanbul (applicable when codeformat=solidity-single-file)
        licenseType: 1, // valid codes 1-14 where 1=No License ... 14=Business Source License 1.1, see https://etherscan.io/contract-license-types
        libraryname1: "INSERT-LIBRARY-NAME-HERE" // if applicable, enter the name of the first library used, i.e. SafeMath (up to 10 libraries can be used)
        libraryaddress1: "INSERT-LIBRARY-ADDRESS-HERE" // if applicable, enter the address of the first library used
        libraryname2: "INSERT-LIBRARY-NAME-HERE", // if applicable, enter the name of the second library used
        libraryaddress2: "INSERT-LIBRARY-ADDRESS-HERE", // if applicable, enter the address of the second library used
        // ...
    }, headers: { "Content-Type": "application/x-www-form-urlencoded" })

    if (response.data.status == "1") {
        // 1 = submission success, use the guid returned (response.data.response.data) to check the status of your submission
        // average time of processing is 30-60 seconds
        console.log(response.data.status + "; " + response.data.message + "; " + response.data.result)
        // response.data.response.data is the GUID receipt for the submission, you can use this guid for checking the verification status
    } else {
        // 0 = error
        console.log(response.data.status + "; " + response.data.message + "; " + response.data.result)
    }
    ```
    
=== "Moonbase"
    ```javascript
    // Submit Source Code for Verification
    const response = await axios.post("https://api-moonbase.moonscan.io/api", {
        apikey: "INSERT-API-KEY-HERE",
        module: "contract",
        action: "verifysourcecode",
        contractAddress: "INSERT-CONTRACT-ADDRESS-HERE",
        sourceCode: "INSERT-SOURCE-CODE-HERE", // flattened if necessary
        codeformat: "solidity-single-file" // or you can use "solidity-standard-json-input"
        contractname: "INSERT-CONTRACT-NAME-HERE", // if codeformat = solidity-standard-json-input, then enter contractname as ex: erc20.sol:erc20
        compilerversion: "INSERT-COMPILER-VERSION-HERE" // see https://etherscan.io/solcversions for list of support versions
        optimizationUsed: 0 // 0 = no optimization, 1 = optimization was used (applicable when codeformat=solidity-single-file)
        runs: 200 // set to 200 as default unless otherwise (applicable when codeformat=solidity-single-file) 
        constructorArguements: "INSERT-CONSTRUCTOR-ARGUMENTS-HERE" // if applicable
        evmversion: "INSERT-EVM-VERSION-HERE", // options: homestead, tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, istanbul (applicable when codeformat=solidity-single-file)
        licenseType: 1, // valid codes 1-14 where 1=No License ... 14=Business Source License 1.1, see https://etherscan.io/contract-license-types
        libraryname1: "INSERT-LIBRARY-NAME-HERE" // if applicable, enter the name of the first library used, i.e. SafeMath (up to 10 libraries can be used)
        libraryaddress1: "INSERT-LIBRARY-ADDRESS-HERE" // if applicable, enter the address of the first library used
        libraryname2: "INSERT-LIBRARY-NAME-HERE", // if applicable, enter the name of the second library used
        libraryaddress2: "INSERT-LIBRARY-ADDRESS-HERE", // if applicable, enter the address of the second library used
        // ...
    }, headers: { "Content-Type": "application/x-www-form-urlencoded" })

    if (response.data.status == "1") {
        // 1 = submission success, use the guid returned (response.data.response.data) to check the status of your submission
        // average time of processing is 30-60 seconds
        console.log(response.data.status + "; " + response.data.message + "; " + response.data.result)
        // response.data.response.data is the GUID receipt for the submission, you can use this guid for checking the verification status
    } else {
        // 0 = error
        console.log(response.data.status + "; " + response.data.message + "; " + response.data.result)
    }
    ```

Upon successful submission, a GUID will be returned as a part of the result. This GUID can be used to check for the submission status. 

=== "Moonbeam"
    ```bash
    curl https://api-moonbeam.moonscan.io/api
            ?module=contract
            &action=checkverifystatus
            &guid=INSERT-GUID-FROM-RESPONSE-HERE
            &apikey=INSERT-API-KEY-TOKEN-HERE
    ```

=== "Moonriver"
    ```bash
    curl https://api-moonriver.moonscan.io/api
            ?module=contract
            &action=checkverifystatus
            &guid=INSERT-GUID-FROM-RESPONSE-HERE
            &apikey=INSERT-API-KEY-TOKEN-HERE
    ```

=== "Moonbase Alpha"
    ```bash
    curl https://api-moonbase.moonscan.io/api
            ?module=contract
            &action=checkverifystatus
            &guid=INSERT-GUID-FROM-RESPONSE-HERE
            &apikey=INSERT-API-KEY-TOKEN-HERE
    ```

### Retrieve Contract ABI for Verified Contracts {: #retrieve-contract-abi-for-verified-contracts }

Once your contract is verified on Moonscan, you can use the following endpoint to retrieve the contract ABI:

=== "Moonbeam"
    ```bash
    curl https://api-moonbeam.moonscan.io/api
            ?module=contract
            &action=getabi
            &address=INSERT-CONTRACT-ADDRESS-HERE
            &apikey=INSERT-API-KEY-TOKEN-HERE
    ```

=== "Moonriver"
    ```bash
    curl https://api-moonriver.moonscan.io/api
            ?module=contract
            &action=getabi
            &address=INSERT-CONTRACT-ADDRESS-HERE
            &apikey=INSERT-API-KEY-TOKEN-HERE
    ```

=== "Moonbase Alpha"
    ```bash
    curl https://api-moonbase.moonscan.io/api
            ?module=contract
            &action=getabi
            &address=INSERT-CONTRACT-ADDRESS-HERE
            &apikey=INSERT-API-KEY-TOKEN-HERE
    ```

### Retrieve Contract Source Code for Verified Contracts {: #retrieve-contract-source-code-for-verified-contracts }

Once your contract is verified on Moonscan, you can use the following endpoint to retrieve the contract source code:

=== "Moonbeam"
    ```bash
    curl https://api-moonbeam.moonscan.io/api
            ?module=contract
            &action=getsourcecode
            &address=INSERT-CONTRACT-ADDRESS-HERE
            &apikey=INSERT-API-KEY-TOKEN-HERE
    ```

=== "Moonriver"
    ```bash
    curl https://api-moonriver.moonscan.io/api
            ?module=contract
            &action=getsourcecode
            &address=INSERT-CONTRACT-ADDRESS-HERE
            &apikey=INSERT-API-KEY-TOKEN-HERE
    ```

=== "Moonbase Alpha"
    ```bash
    curl https://api-moonbase.moonscan.io/api
            ?module=contract
            &action=getsourcecode
            &address=INSERT-CONTRACT-ADDRESS-HERE
            &apikey=INSERT-API-KEY-TOKEN-HERE
    ```

## Using Sourcify API {: #using-sourcify-api }

[Sourcify](https://sourcify.dev/){target=_blank} is a multi-chain decentralized automated contract verification service, and maintains a public repository of contract metadata. Sourcify also provides a public server API for verification, and checking if a contract is verified, and a repository API for retrieving metadata files.

### Sourcify Public Server URL {: #sourcify-public-server-url }

Soucify API endpoints can be accessed through the following public servers: 

=== "Production"
    ```bash
    https://sourcify.dev/server
    ```

=== "Staging"
    ```bash
    https://staging.sourcify.dev/server
    ```

### Moonbeam Network Chain ID's {: #moonbeam-network-chain-ids }

Sourcify uses chain ID's to identify the target network(s) for the request. The chain ID's of Moonbeam networks are as follows:

=== "Moonbeam"
    ```bash
    {{ networks.moonbeam.chain_id }}
    ```

=== "Moonriver"
    ```bash
    {{ networks.moonriver.chain_id }}
    ```

=== "Moonbase"
    ```bash
    {{ networks.moonbase.chain_id }}
    ```

### Perfect vs. Partial Match {: #full-vs-partial-match }

Sourcify supports two types of verification match results. 

Full matches (sometimes referred as perfect matches) refer to the cases when the bytecode of the deployed contract is byte-by-byte the same as compilation output of the given source code files under the compilation settings defined in the metadata file.

Partial matches refer to cases when the deployed bytecode of the onchain contract match the bytecode resulting from the recompilation with the metadata and the source files except the metadata hash. For partial matches, the deployed contract and the given source code and metadata are functionally the same, but there are differences in source code comments, variable names, or other metadata fields such as source paths.

### Verify Contract {: #verify-contract }

A POST request is used to verify a contract on Sourcify. The following is sample code using JavaScript:

=== "Moonbeam"
    ```javascript
    // Submit Contract Source Code and Metadata for Verification
    const response = await axios.post("https://sourcify.dev/server/verify", {
        "address": "INSERT-CONTRACT-ADDRESS-HERE"
        "chain": {{ networks.moonbeam.chain_id }}, // chain ID of Moonbeam
        "files": {
            "metadata-1.json": "INSERT-JSON-FILE-HERE", // metadata file for contract file 1
            "metadata-2.json": "INSERT-JSON-FILE-HERE", // metadata file for contract file 2
            "file1-name.sol": "INSERT-SOL-FILE-HERE", // contract source file 1
            "file2-name.sol": "INSERT-SOL-FILE-HERE" // contract source file 2
            //...
        },
        "chosenContract": 1 // (optional) index of the contract, if the provided files contain multiple metadata files          
    })

    if (result.status == "perfect") {
        // perfect match
        console.log(result.status + ";" + result.address);
    } elseif (result.status == "partial") {
        // partial match
        console.log(result.status + ";" + result.address);
    } else {
        // non-matching
        console.log(result.status + ";" + result.address);
    }
    ```

=== "Moonriver"
    ```javascript
    // Submit Contract Source Code and Metadata for Verification
    const response = await axios.post("https://sourcify.dev/server/verify", {
        "address": "INSERT-CONTRACT-ADDRESS-HERE"
        "chain": {{ networks.moonriver.chain_id }}, // chain ID of Moonriver
        "files": {
            "metadata-1.json": "INSERT-JSON-FILE-HERE", // metadata file for contract file 1
            "metadata-2.json": "INSERT-JSON-FILE-HERE", // metadata file for contract file 2
            "file1-name.sol": "INSERT-SOL-FILE-HERE", // contract source file 1
            "file2-name.sol": "INSERT-SOL-FILE-HERE" // contract source file 2
            //...
        },
        "chosenContract": 1 // (optional) index of the contract, if the provided files contain multiple metadata files          
    })

    if (result.status == "perfect") {
        // perfect match
        console.log(result.status + ";" + result.address);
    } elseif (result.status == "partial") {
        // partial match
        console.log(result.status + ";" + result.address);
    } else {
        // non-matching
        console.log(result.status + ";" + result.address);
    }
    ```

=== "Moonbase"
    ```javascript
    // Submit Contract Source Code and Metadata for Verification
    const response = await axios.post("https://sourcify.dev/server/verify", {
        "address": "INSERT-CONTRACT-ADDRESS-HERE"
        "chain": {{ networks.moonbase.chain_id }}, // chain ID of Moonbase Alpha
        "files": {
            "metadata-1.json": "INSERT-JSON-FILE-HERE", // metadata file for contract file 1
            "metadata-2.json": "INSERT-JSON-FILE-HERE", // metadata file for contract file 2
            "file1-name.sol": "INSERT-SOL-FILE-HERE", // contract source file 1
            "file2-name.sol": "INSERT-SOL-FILE-HERE" // contract source file 2
            //...
        },
        "chosenContract": 1 // (optional) index of the contract, if the provided files contain multiple metadata files          
    })

    if (result.status == "perfect") {
        // perfect match
        console.log(result.status + ";" + result.address);
    } elseif (result.status == "partial") {
        // partial match
        console.log(result.status + ";" + result.address);
    } else {
        // non-matching
        console.log(result.status + ";" + result.address);
    }
    ```

Alternatively, you can also use [the Sourcify hosted GUI](https://sourcify.dev/#/verifier){target=_blank} to submit a contract for verification.  

### Check Verification Status by Address and Chain ID {: check-verification-status-by-address-and-chain-id }

Sourcify provides endpoints for checking the verification status of contracts on multiple EVM chains at once. This can be done through URL parameters, by specifying the contract addresses and the chain ID's of the networks.  

There are two variations of this endpoint, one for perfect matching and one for partial matching:

=== "Perfect Match"
    ```bash
    curl https://sourcify.dev/server/check-by-addresses
            ?addresses={INSERT-ADDRESS-1-HERE, INSERT-ADDRESS-2-HERE, ...}
            &chainIds={INSERT-CHAIN-ID-1, INSERT-CHAIN-ID-2, ...}
    ```
=== "Partial Match"
    ```bash
    curl https://sourcify.dev/server/check-all-by-addresses
            ?addresses={INSERT-ADDRESS-1-HERE, INSERT-ADDRESS-2-HERE, ...}
            &chainIds={INSERT-CHAIN-ID-1, INSERT-CHAIN-ID-2, ...}
    ```

An example response will be a JSON object of the following structure:

```json
[
  {
    "address": "address1",
    "status": "perfect",
    "chainIds": [
      "chainId1",
      "chaindId2"
    ]
  },
  {
    "address": "address2",
    "status": "partial",
    "chainIds": [
      "chaindId2"
    ]
  }
]
```

### Retrieve Contract Source Files for Verified Contracts {: get-contract-source-files-for-verified-contracts }

You can also retrieve the source files of verified contracts from the Sourcify repository. 

There are two variations of this endpoint, one for the source files of perfect matches: 

=== "Moonbeam"
    ```bash
    curl https://sourcify.dev/server/files/{{ networks.moonbeam.chain_id }}/INSERT-YOUR-CONTRACT-ADDRESS-HERE
    ```
=== "Moonriver"
    ```bash
    curl https://sourcify.dev/server/files/{{ networks.moonriver.chain_id }}/INSERT-YOUR-CONTRACT-ADDRESS-HERE
    ```
=== "Moonbase"
    ```bash
    curl https://sourcify.dev/server/files/{{ networks.moonbase.chain_id }}/INSERT-YOUR-CONTRACT-ADDRESS-HERE
    ```

And one for the source files of both perfect and partial matches:

=== "Moonbeam"
    ```bash
    curl https://sourcify.dev/server/files/any/{{ networks.moonbeam.chain_id }}/INSERT-YOUR-CONTRACT-ADDRESS-HERE
    ```
=== "Moonriver"
    ```bash
    curl https://sourcify.dev/server/files/any/{{ networks.moonriver.chain_id }}/INSERT-YOUR-CONTRACT-ADDRESS-HERE
    ```
=== "Moonbase"
    ```bash
    curl https://sourcify.dev/server/files/any/{{ networks.moonbase.chain_id }}/INSERT-YOUR-CONTRACT-ADDRESS-HERE
    ```

### Using Sourcify with Foundry

Foundry's Forge tool has built-in support for Sourcify verification similar to how it has [built-in support for Etherscan](/builders/build/eth-api/verify-contracts/etherscan-plugins#using-foundry-to-verify){target=_blank}. The example in this section of the guide will use the `MyToken.sol` contract that was created in the [Using Foundry to Deploy to Moonbeam](/builders/build/eth-api/dev-env/foundry/){target=_blank} guide.

A Foundry project that uses Sourcify must have their compiler emit metadata files. This can be configured in the `foundry.toml` file:

```
[profile.default]
# Input your custom or default config options here
extra_output_files = ["metadata"]
```

If you have already deployed the example contract, you can verify it with the `verify-contract` command. Before you can verify the contract, you will need to ABI-encode the constructor arguments. To do so for the example contract, you can run the following command:

```
cast abi-encode "constructor(uint256)" 100
```

The result should be `0x0000000000000000000000000000000000000000000000000000000000000064`. You can then verify the contract using the following command:

=== "Moonbeam"
    ```
    forge verify-contract --chain-id {{ networks.moonbeam.chain_id }} \
    --constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
    --verifier sourcify YOUR_CONTRACT_ADDRESS src/MyToken.sol:MyToken 
    ```

=== "Moonriver"
    ```
    forge verify-contract --chain-id {{ networks.moonriver.chain_id }} \
    --constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
    --verifier sourcify YOUR_CONTRACT_ADDRESS src/MyToken.sol:MyToken 
    ```

=== "Moonbase Alpha"
    ```
    forge verify-contract --chain-id {{ networks.moonbase.chain_id }} \
    --constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
    --verifier sourcify YOUR_CONTRACT_ADDRESS src/MyToken.sol:MyToken 
    ```

![Foundry Verify](/images/builders/build/eth-api/verify-contracts/etherscan-plugins/plugins-5.png)

If you wanted to deploy the example contract and verify at the same time, then you would use the following command:

=== "Moonbeam"
    ```
    forge create --rpc-url {{ networks.moonbeam.rpc_url }} \
    --constructor-args 100 \
    --verify --verifier sourcify \
    --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken  
    ```

=== "Moonriver"
    ```
    forge create --rpc-url {{ networks.moonriver.rpc_url }} \
    --constructor-args 100 \
    --verify --verifier sourcify \
    --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken  
    ```

=== "Moonbase Alpha"
    ```
    forge create --rpc-url {{ networks.moonbase.rpc_url }} \
    --constructor-args 100 \
    --verify --verifier sourcify \
    --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken    
    ```

![Foundry Contract Deploy and Verify](/images/builders/build/eth-api/verify-contracts/etherscan-plugins/plugins-6.png)

