---
title: Verify Smart Contracts through APIs
description: Learn how to verify smart contracts on Moonbeam-based networks using one of the available API-based verification methods. 
---

# API-based Contract Verification

![Explorer Banner](/images/builders/build/eth-api/verify-contracts/block-explorers/verify-contract-banner.png)

## Introduction {: #introduction } 

Verifying smart contracts greatly improves their transparency and security.  Smart contracts deployed on Moonbeam networks can be verified through API-based tools, including Moonscan API and Sourcify. 

This page will outline the steps for using these API-based tools for verifying smart contracts, or retrieving verification status and metadata of smart contracts on Moonbeam networks.

## Using Moonscan API {: #using-moonscan-api } 

[Moonscan](https://moonscan.io/){target=_blank} is an official fork of Etherscan that can be used to view and search on-chain data, and comes with a suite of developer tools and analytics to interact with data on Moonbeam networks. 

Moonscan exposes a set of REST API endpoints similar to the [Etherscan API](https://docs.etherscan.io/){target=_blank} endpoints that can be used to verify smart contracts, retrieve verified contract ABI and source code, or otherwise interact with verified contracts on Moonbeam networks. 

### Generating a Moonscan API Key {: #generating-a-moonscan-api-key }

Before using the Moonscan API, you need to generate a Moonscan API key. Please follow the instructions in [the key generation section](builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank} of the Etherscan plug-in verification page, as the API keys generated are used for both.

### Moonscan Public API URL {: #moonscan-public-api-url }

The Moonscan API URL for Moonbeam networks is as follows:

=== "Moonbeam"
    ```
    https://api-moonbeam.moonscan.io/
    ```

=== "Moonriver"
    ```
    https://api-moonriver.moonscan.io/
    ```

=== "Moonbase Alpha"
    ```
    https://api-moonbase.moonscan.io/
    ```

### Verify Contract {: #verify-contract }

To verify a deployed contract's source code using the Moonscan API, you must form a POST request containing all the relevant contract creation information, and send the request to Moonscan's REST API. The following is sample code using Javascript:

=== "Moonbeam"
    ```javascript
    //Submit Source Code for Verification
    $.ajax({
        type: "POST", //Only POST supported  
        url: "//api-moonbeam.moonscan.io/api", //for Moonbeam network
        data: {
            apikey: $('#apikey').val(),                     //A valid API-Key is required        
            module: 'contract',                             //Do not change
            action: 'verifysourcecode',                     //Do not change
            contractaddress: $('#contractaddress').val(),   //Contract Address starts with 0x...     
            sourceCode: $('#sourceCode').val(),             //Contract Source Code (Flattened if necessary)
            codeformat: $('#codeformat').val(),             //solidity-single-file (default) or solidity-standard-json-input (for std-input-json-format support
            contractname: $('#contractname').val(),         //ContractName (if codeformat=solidity-standard-json-input, then enter contractname as ex: erc20.sol:erc20)
            compilerversion: $('#compilerversion').val(),   // see https://etherscan.io/solcversions for list of support versions
            optimizationUsed: $('#optimizationUsed').val(), //0 = No Optimization, 1 = Optimization used (applicable when codeformat=solidity-single-file)
            runs: 200,                                      //set to 200 as default unless otherwise  (applicable when codeformat=solidity-single-file)        
            constructorArguements: $('#constructorArguements').val(),   //if applicable
            evmversion: $('#evmVersion').val(),             //leave blank for compiler default, homestead, tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, istanbul (applicable when codeformat=solidity-single-file)
            licenseType: $('#licenseType').val(),           //Valid codes 1-14 where 1=No License .. 14=Business Source License 1.1, see https://etherscan.io/contract-license-types
            libraryname1: $('#libraryname1').val(),         //if applicable, a matching pair with libraryaddress1 required, can include up to 10 external libraries
            libraryaddress1: $('#libraryaddress1').val()    //if applicable, a matching pair with libraryname1 required, can include up to 10 external libraries
            libraryname2: $('#libraryname2').val(),         //if applicable, matching pair required
            libraryaddress2: $('#libraryaddress2').val(),   //if applicable, matching pair required
            //...
        },
        success: function (result) {
            console.log(result);
            if (result.status == "1") {
                //1 = submission success, use the guid returned (result.result) to check the status of your submission.
                // Average time of processing is 30-60 seconds
                document.getElementById("postresult").innerHTML = result.status + ";" + result.message + ";" + result.result;
                // result.result is the GUID receipt for the submission, you can use this guid for checking the verification status
            } else {
                //0 = error
                document.getElementById("postresult").innerHTML = result.status + ";" + result.message + ";" + result.result;
            }
            console.log("status : " + result.status);
            console.log("result : " + result.result);
        },
        error: function (result) {
            console.log("error!");
            document.getElementById("postresult").innerHTML = "Unexpected Error"
        }
    });
    ```

=== "Moonriver"
    ```javascript
    //Submit Source Code for Verification
    $.ajax({
        type: "POST", //Only POST supported  
        url: "//api-moonriver.moonscan.io/api", //for Moonriver network
        data: {
            apikey: $('#apikey').val(),                     //A valid API-Key is required        
            module: 'contract',                             //Do not change
            action: 'verifysourcecode',                     //Do not change
            contractaddress: $('#contractaddress').val(),   //Contract Address starts with 0x...     
            sourceCode: $('#sourceCode').val(),             //Contract Source Code (Flattened if necessary)
            codeformat: $('#codeformat').val(),             //solidity-single-file (default) or solidity-standard-json-input (for std-input-json-format support
            contractname: $('#contractname').val(),         //ContractName (if codeformat=solidity-standard-json-input, then enter contractname as ex: erc20.sol:erc20)
            compilerversion: $('#compilerversion').val(),   // see https://etherscan.io/solcversions for list of support versions
            optimizationUsed: $('#optimizationUsed').val(), //0 = No Optimization, 1 = Optimization used (applicable when codeformat=solidity-single-file)
            runs: 200,                                      //set to 200 as default unless otherwise  (applicable when codeformat=solidity-single-file)        
            constructorArguements: $('#constructorArguements').val(),   //if applicable
            evmversion: $('#evmVersion').val(),             //leave blank for compiler default, homestead, tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, istanbul (applicable when codeformat=solidity-single-file)
            licenseType: $('#licenseType').val(),           //Valid codes 1-14 where 1=No License .. 14=Business Source License 1.1, see https://etherscan.io/contract-license-types
            libraryname1: $('#libraryname1').val(),         //if applicable, a matching pair with libraryaddress1 required, can include up to 10 external libraries
            libraryaddress1: $('#libraryaddress1').val()    //if applicable, a matching pair with libraryname1 required, can include up to 10 external libraries
            libraryname2: $('#libraryname2').val(),         //if applicable, matching pair required
            libraryaddress2: $('#libraryaddress2').val()   //if applicable, matching pair required
            //...
        },
        success: function (result) {
            console.log(result);
            if (result.status == "1") {
                //1 = submission success, use the guid returned (result.result) to check the status of your submission.
                // Average time of processing is 30-60 seconds
                document.getElementById("postresult").innerHTML = result.status + ";" + result.message + ";" + result.result;
                // result.result is the GUID receipt for the submission, you can use this guid for checking the verification status
            } else {
                //0 = error
                document.getElementById("postresult").innerHTML = result.status + ";" + result.message + ";" + result.result;
            }
            console.log("status : " + result.status);
            console.log("result : " + result.result);
        },
        error: function (result) {
            console.log("error!");
            document.getElementById("postresult").innerHTML = "Unexpected Error"
        }
    });
    ```
    
=== "Moonbase"
    ```javascript
    //Submit Source Code for Verification
    $.ajax({
        type: "POST", //Only POST supported  
        url: "//api-moonbase.moonscan.io/api", //for Moonbase Alpha network
        data: {
            apikey: $('#apikey').val(),                     //A valid API-Key is required        
            module: 'contract',                             //Do not change
            action: 'verifysourcecode',                     //Do not change
            contractaddress: $('#contractaddress').val(),   //Contract Address starts with 0x...     
            sourceCode: $('#sourceCode').val(),             //Contract Source Code (Flattened if necessary)
            codeformat: $('#codeformat').val(),             //solidity-single-file (default) or solidity-standard-json-input (for std-input-json-format support
            contractname: $('#contractname').val(),         //ContractName (if codeformat=solidity-standard-json-input, then enter contractname as ex: erc20.sol:erc20)
            compilerversion: $('#compilerversion').val(),   // see https://etherscan.io/solcversions for list of support versions
            optimizationUsed: $('#optimizationUsed').val(), //0 = No Optimization, 1 = Optimization used (applicable when codeformat=solidity-single-file)
            runs: 200,                                      //set to 200 as default unless otherwise  (applicable when codeformat=solidity-single-file)        
            constructorArguements: $('#constructorArguements').val(),   //if applicable
            evmversion: $('#evmVersion').val(),             //leave blank for compiler default, homestead, tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, istanbul (applicable when codeformat=solidity-single-file)
            licenseType: $('#licenseType').val(),           //Valid codes 1-14 where 1=No License .. 14=Business Source License 1.1, see https://etherscan.io/contract-license-types
            libraryname1: $('#libraryname1').val(),         //if applicable, a matching pair with libraryaddress1 required, can include up to 10 external libraries
            libraryaddress1: $('#libraryaddress1').val()    //if applicable, a matching pair with libraryname1 required, can include up to 10 external libraries
            libraryname2: $('#libraryname2').val(),         //if applicable, matching pair required
            libraryaddress2: $('#libraryaddress2').val(),   //if applicable, matching pair required
            //...
        },
        success: function (result) {
            console.log(result);
            if (result.status == "1") {
                //1 = submission success, use the guid returned (result.result) to check the status of your submission.
                // Average time of processing is 30-60 seconds
                document.getElementById("postresult").innerHTML = result.status + ";" + result.message + ";" + result.result;
                // result.result is the GUID receipt for the submission, you can use this guid for checking the verification status
            } else {
                //0 = error
                document.getElementById("postresult").innerHTML = result.status + ";" + result.message + ";" + result.result;
            }
            console.log("status : " + result.status);
            console.log("result : " + result.result);
        },
        error: function (result) {
            console.log("error!");
            document.getElementById("postresult").innerHTML = "Unexpected Error"
        }
    });
    ```

Upon successful submission, a GUID will be returned as a part of the result. This GUID can be used to check for the submission status. 

```javascript
//Check Source Code Verification Status
$.ajax({
    type: "GET",
    url: "//api.etherscan.io/api",
    data: {
        apikey: $('#apikey').val(), 
        guid: 'ezq878u486pzijkvvmerl6a9mzwhv6sefgvqi5tkwceejc7tvn', //Replace with your Source Code GUID receipt above
        module: "contract",
        action: "checkverifystatus"
    },
    success: function (result) {
        console.log("status : " + result.status);   //0=Error, 1=Pass 
        console.log("message : " + result.message); //OK, NOTOK
        console.log("result : " + result.result);   //result explanation
        $('#guidstatus').html(">> " + result.result);
    },
    error: function (result) {
        alert('error');
    }
});
```
### Retrieve Contract ABI for Verified Contracts {: #retrieve-contract-abi-for-verified-contracts }

Once your contract is verified on Moonscan, you can use the following endpoint to retrieve the contract ABI:

=== "Moonbeam"
    ```html
    curl https://api-moonbeam.moonscan.io/
            ?module=contract
            &action=getabi
            &address=YourContractAddress
            &apikey=YourApiKeyToken
    ```

=== "Moonriver"
    ```html
    curl https://api-moonriver.moonscan.io/
            ?module=contract
            &action=getabi
            &address=YourContractAddress
            &apikey=YourApiKeyToken
    ```

=== "Moonbase Alpha"
    ```html
    curl https://api-moonbase.moonscan.io/
            ?module=contract
            &action=getabi
            &address=YourContractAddress
            &apikey=YourApiKeyToken
    ```

### Retrieve Contract Source Code for Verified Contracts {: #retrieve-contract-source-code-for-verified-contracts }

Once your contract is verified on Moonscan, you can use the following endpoint to retrieve the contract source code:

=== "Moonbeam"
    ```html
    curl https://api-moonbeam.moonscan.io/
            ?module=contract
            &action=getsourcecode
            &address=YourContractAddress
            &apikey=YourApiKeyToken
    ```

=== "Moonriver"
    ```html
    curl https://api-moonriver.moonscan.io/
            ?module=contract
            &action=getsourcecode
            &address=YourContractAddress
            &apikey=YourApiKeyToken
    ```

=== "Moonbase Alpha"
    ```html
    curl https://api-moonbase.moonscan.io/
            ?module=contract
            &action=getsourcecode
            &address=YourContractAddress
            &apikey=YourApiKeyToken
    ```

## Using Sourcify API {: #using-sourcify-api }

[Sourcify](https://sourcify.dev/){target=_blank} is a multi-chain decentralized automated contract verification service, and maintains a public repository of contract metadata. Sourcify also provides a public server API for verification, and checking if a contract is verified, and a repository API for retrieving metadata files.

### Sourcify Public Server URL {: #sourcify-public-server-url }

Soucify API endpoints can be accessed through the following public servers: 

=== "Production"
    ```html
    https://sourcify.dev/server
    ```

=== "Staging"
    ```html
    https://staging.sourcify.dev/server
    ```

### Moonbeam Network Chain ID's

Sourcify uses Chain ID's to identify the target network(s) for the request. The chain ID's of Moonbeam networks are as follows:

=== "Moonbeam"
    ```html
    1284
    ```

=== "Moonriver"
    ```html
    1285
    ```

=== "Moonbase"
    ```html
    1287
    ```

### Perfect vs. Partial Match {: #full-vs-partial-match }

Sourcify supports two types of verification match results. 

Full matches (sometimes referred as perfect matches) refer to the cases when the bytecode of the deployed contract is byte-by-byte the same as compilation output of the given source code files under the compilation settings defined in the metadata file.

Partial matches refer to cases when the deployed bytecode of the onchain contract match the bytecode resulting from the recompilation with the metadata and the source files except the metadata hash. For partial matches, the deployed contract and the given source code and metadata are functionally the same, but there are differences in source code comments, variable names, or other metadata fields such as source paths.

### Verify Contract {: #verify-contract }

A POST request is used to verify a contract on Sourcify. The following is sample code using Javascript.

=== "Moonbeam"
    ```javascript
    //Submit Contract Source Code and Metadata for Verification
    $.ajax({
        type: "POST", //Only POST supported  
        url: "//sourcify.dev/server/verify",
        data: {
            "address": $('#contractaddress').val(), //Contract Address starts with 0x... 
            "chain": 1284, // Chain ID of Moonbeam
            "files": {
                "metadata-1.json": $('#metadata_1').val(), // Metadata file for contract file 1
                "metadata-2.json": $('#metadata_2').val(), // Metadata file for contract file 2
                "file1-name.sol": $('#file_1').val(), // Contract source file 1
                "file2-name.sol": $('#file_2').val() // Contract source file 2
                //...
            },
            "chosenContract": 1 // Optional. Index of the contract, if the provided files contain multiple metadata files  
        },
        success: function (result) {
            console.log(result);
            if (result.status == "perfect") {
                // Perfect Match
                document.getElementById("postresult").innerHTML = result.status + ";" + result.address;
            } 
            elseif (result.status == "partial") {
                // Partial Match
                document.getElementById("postresult").innerHTML = result.status + ";" + result.address;
            }
            else {
                // Non matching
                document.getElementById("postresult").innerHTML = result.error + result.message;
            }
            console.log("status : " + result.status);
            console.log("result : " + result.result);
        },
        error: function (result) {
            console.log("error!");
            document.getElementById("postresult").innerHTML = "Unexpected Error"
        }
    });
    ```

=== "Moonriver"
    ```javascript
    //Submit Contract Source Code and Metadata for Verification
    $.ajax({
        type: "POST", //Only POST supported  
        url: "//sourcify.dev/server/verify",
        data: {
            "address": $('#contractaddress').val(), //Contract Address starts with 0x... 
            "chain": 1285, // Chain ID of Moonriver
            "files": {
                "metadata-1.json": $('#metadata_1').val(), // Metadata file for contract file 1
                "metadata-2.json": $('#metadata_2').val(), // Metadata file for contract file 2
                "file1-name.sol": $('#file_1').val(), // Contract source file 1
                "file2-name.sol": $('#file_2').val() // Contract source file 2
                //...
            },
            "chosenContract": 1 // Optional. Index of the contract, if the provided files contain multiple metadata files  
        },
        success: function (result) {
            console.log(result);
            if (result.status == "perfect") {
                // Perfect Match
                document.getElementById("postresult").innerHTML = result.status + ";" + result.address;
            } 
            elseif (result.status == "partial") {
                // Partial Match
                document.getElementById("postresult").innerHTML = result.status + ";" + result.address;
            }
            else {
                // Non matching
                document.getElementById("postresult").innerHTML = result.error + result.message;
            }
            console.log("status : " + result.status);
            console.log("result : " + result.result);
        },
        error: function (result) {
            console.log("error!");
            document.getElementById("postresult").innerHTML = "Unexpected Error"
        }
    });
    ```

=== "Moonbase"
    ```javascript
    //Submit Contract Source Code and Metadata for Verification
    $.ajax({
        type: "POST", //Only POST supported  
        url: "//sourcify.dev/server/verify",
        data: {
            "address": $('#contractaddress').val(), //Contract Address starts with 0x... 
            "chain": 1287, // Chain ID of Moonbase Alpha
            "files": {
                "metadata-1.json": $('#metadata_1').val(), // Metadata file for contract file 1
                "metadata-2.json": $('#metadata_2').val(), // Metadata file for contract file 2
                "file1-name.sol": $('#file_1').val(), // Contract source file 1
                "file2-name.sol": $('#file_2').val() // Contract source file 2
                //...
            },
            "chosenContract": 1 // Optional. Index of the contract, if the provided files contain multiple metadata files  
        },
        success: function (result) {
            console.log(result);
            if (result.status == "perfect") {
                // Perfect Match
                document.getElementById("postresult").innerHTML = result.status + ";" + result.address;
            } 
            elseif (result.status == "partial") {
                // Partial Match
                document.getElementById("postresult").innerHTML = result.status + ";" + result.address;
            }
            else {
                // Non matching
                document.getElementById("postresult").innerHTML = result.error + result.message;
            }
            console.log("status : " + result.status);
            console.log("result : " + result.result);
        },
        error: function (result) {
            console.log("error!");
            document.getElementById("postresult").innerHTML = "Unexpected Error"
        }
    });
    ```

Alternatively, you can also use [the Sourcify hosted GUI](https://sourcify.dev/#/verifier){target=_blank} to submit a contract for verification.  

### Check Verification Status by Address and Chain ID {: check-verification-status-by-address-and-chain-id }

Sourcify provides endpoints for checking the verification status of contracts on multiple EVM chains at once. This can be done through URL parameters, by specifying the contract addresses and the chain ID's of the networks.  

There are two variations of this endpoint, one for perfect matching and one for partial matching:

=== "Perfect Match"
    ```html
    curl https://sourcify.dev/server/check-by-addresses
            ?addresses={address1, address2, ...}
            &chainIds={chainId1, chainId2, ...}
    ```
=== "Partial Match"
    ```html
    curl https://sourcify.dev/server/check-all-by-addresses
            ?addresses={address1, address2, ...}
            &chainIds={chainId1, chainId2, ...}
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
    "status": "perfect",
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
    ```html
    curl https://sourcify.dev/server/files/1284/your_contract_address
    ```
=== "Moonriver"
    ```html
    curl https://sourcify.dev/server/files/1285/your_contract_address
    ```
=== "Moonbase"
    ```html
    curl https://sourcify.dev/server/files/1287/your_contract_address
    ```

And one for the source files of both perfect and partial matches:

=== "Moonbeam"
    ```html
    curl https://sourcify.dev/server/files/any/1284/your_contract_address
    ```
=== "Moonriver"
    ```html
    curl https://sourcify.dev/server/files/any/1285/your_contract_address
    ```
=== "Moonbase"
    ```html
    curl https://sourcify.dev/server/files/any/1287/your_contract_address
    ```
