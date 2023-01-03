---
title: API3
description: 
---

# API3

![Band Protocol Moonbeam Diagram](/images/builders/integrations/oracles/api3/api3-banner.png)

## Introduction {: #introduction } 
Developers can use Airnode to request off-chain data inside their Smart Contracts on the Moonbeam Network. An Airnode is a first-party oracle that pushes off-chain API data to your on-chain contract. Airnode lets API providers easily run their own first-party oracle nodes. That way, they can provide data to any on-chain dApp that's interested in their services, all without an intermediary.

An on-chain smart contract makes a request in the RRP (Request Response Protocol) contract (AirnodeRrpV0.sol) that adds the request to the event logs. The Airnode then accesses the event logs, fetches the API data and performs a callback to the requester with the requested data.

--8<-- 'text/disclaimers/third-party-content-intro.md'

## Requesting off-chain data by calling an Airnode {: #calling-an-airnode }
Requesting off-chain data essentially involves triggering an Airnode and getting its response through your smart contract. The smart contract in this case would be the requester contract which will make a request to the desired off-chain Airnode and then capture its response.

The requester calling an Airnode primarily focuses on two tasks:

- Make the request
- Accept and decode the response

Here is an example of a basic requester contract to request data from an Airnode:

```solidity
pragma solidity 0.8.9;

import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";

// A Requester that will return the requested data by calling the specified airnode.
// Make sure you specify the right _rrpAddress for your chain.

contract Requester is RrpRequesterV0 {
    mapping(bytes32 => bool) public incomingFulfillments;
    mapping(bytes32 => int256) public fulfilledData;

    constructor(address _rrpAddress) RrpRequesterV0(_rrpAddress) {}

    /**
     * The main makeRequest function that will trigger the Airnode request
     * airnode: Airnode address
     * endpointId: The endpoint ID for the specific endpoint
     * sponsor: The requester contract itself (in this case)
     * sponsorWallet: The wallet that will make the actual request (needs to be funded)
     * parameters: encoded API parameters
     */
    function makeRequest(
        address airnode,
        bytes32 endpointId,
        address sponsor,
        address sponsorWallet,
        bytes calldata parameters
        
    ) external {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,
            endpointId,
            sponsor,
            sponsorWallet,
            address(this),
            this.fulfill.selector,
            parameters
        );
        incomingFulfillments[requestId] = true;
    }

    // The callback function with the requested data
    function fulfill(bytes32 requestId, bytes calldata data)
        external
        onlyAirnodeRrp
    {
        require(incomingFulfillments[requestId], "No such request made");
        delete incomingFulfillments[requestId];
        int256 decodedData = abi.decode(data, (int256));
        fulfilledData[requestId] = decodedData;
    }
}
```

The `_rrpAddress` is the main `airnodeRrpAddress`. The RRP Contracts have already been deployed on-chain. You can check the address for Moonbeam [here](https://docs.api3.org/airnode/v0.9/reference/airnode-addresses.html). You can also try [deploying it on Remix](https://remix.ethereum.org/#url=https://github.com/vanshwassan/RemixContracts/blob/master/contracts/Requester.sol&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.9+commit.e5eed63a.js)

### Request parameters {: #request-params}

The `makeRequest()` function expects the following parameters to make a valid request.

- [**`airnode`**](): Specifies the Airnode Address.
- [**`endpointId`**](): Specifies which endpoint to be used.
- [**`sponsor`**]() and [**`sponsorWallet`**](): Specifies which wallet will be used to fulfill the request.
- [**`parameters`**](): Specifies the API and Reserved Parameters (see [Airnode ABI specifications]() for how these are encoded). Parameters can be encoded off-chain using [`@airnode-abi`]() library.

### Response parameters {: #response-params}

The callback to the Requester contains two parameters:

- [**`requestId`**](): First acquired when making the request and passed here as a reference to identify the request for which the response is intended.
- [**`data`**](): In case of a successful response, this is the requested data which has been encoded and contains a timestamp in addition to other response data. Decode it using the `decode()` function from the `abi` object.

## dAPIs {: #dapis}

dAPIs are continuously updated streams of off-chain data, such as the latest cryptocurrency, stock and commodity prices.

dAPIs are composed of **Beacons**, which are first-party data feeds. A Beacon is directly powered by the owner of the data, the API provider. Compared to third-party oracle solutions, which involve middlemen node operators, this approach is secure, transparent, cost-efficient and scalable.

## Calling a dAPI

Developers can call a dAPI by importing the `DapiServer.sol` Contract. Head over to [API3 Market](https://market.api3.org/dapis), select the dAPI you want to use, enter the address of the contract that uses the dAPI and get access to it.

Here's an example of a contract using a dAPI on Moonbeam

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@api3/airnode-protocol-v1/contracts/dapis/interfaces/IDapiServer.sol";
contract MyContract {

int224 public value;
uint32 public timestamp;

    function callDapi(
        address _dapiServerContractAddress,
        bytes32 _dapi
    )  external {

        // Call the DapiServer contract for the value and timestamp of AVAX/USD on Moonbeam.
        // _dapiServerContractAddress: 0x71Da7A936fCaEd1Ee364Df106B12deF6D1Bf1f14
        // _dapi: AVAX/USD - 0x415641582f555344000000000000000000000000000000000000000000000000
        (value, timestamp) =
            IDapiServer(_dapiServerContractAddress).readDataFeedWithDapiName(_dapi);
    }
}

```

=== "Moonbeam"
    | Contract  |          Addresses         |
    |:-----------:|:-----------------------------------------------------:|
    | AirnodeRrpV0 | {{ networks.moonbeam.api3.rrp }} |

=== "Moonriver"
    |  Contract  |           Addresses          |
    |:------------:|:-------------------------------------------------------:|
    | AirnodeRrpV0 | {{ networks.moonriver.api3.rrp }}  |


=== "Moonbase Alpha"
    |  Contract  |          Addresses           |
    |:------------:|:------------------------------------------------------:|
    | AirnodeRrpV0  | {{ networks.moonbase.api3.rrp }}  |