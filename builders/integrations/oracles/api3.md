---
title: API3
description: 
---

# API3

![Band Protocol Moonbeam Diagram](/images/builders/integrations/oracles/api3/api3-banner.png)

## Introduction {: #introduction } 
Developers can use [Airnode]() to request off-chain data inside their Smart Contracts on the Moonbeam Network. An Airnode is a first-party oracle that pushes off-chain API data to your on-chain contract. Airnode lets API providers easily run their own first-party oracle nodes. That way, they can provide data to any on-chain dApp that's interested in their services, all without an intermediary.

An on-chain smart contract makes a request in the [RRP (Request Response Protocol)]() contract (`AirnodeRrpV0.sol`) that adds the request to the event logs. The Airnode then accesses the event logs, fetches the API data and performs a callback to the requester with the requested data.

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

The `_rrpAddress` is the main `airnodeRrpAddress`. The RRP Contracts have already been deployed on-chain. You can check the address for Moonbeam and Moonbase Alpha [here](https://docs.api3.org/airnode/v0.9/reference/airnode-addresses.html). You can also try [deploying it on Remix](https://remix.ethereum.org/#url=https://github.com/vanshwassan/RemixContracts/blob/master/contracts/Requester.sol&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.9+commit.e5eed63a.js)

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

!!! note
    Sponsors should not fund a `sponsorWallet` with more then they can trust the Airnode with, as the Airnode controls the private key to the `sponsorWallet`. The deployer of such Airnode undertakes no custody obligations, and the risk of loss or misuse of any excess funds sent to the `sponsorWallet` remains with the sponsor.


## dAPIs {: #dapis}

[dAPIs]() are continuously updated streams of off-chain data, such as the latest cryptocurrency, stock and commodity prices.

dAPIs are composed of [**Beacons**](), which are first-party data feeds. A Beacon is directly powered by the owner of the data, the API provider. Compared to third-party oracle solutions, which involve middlemen node operators, this approach is secure, transparent, cost-efficient and scalable.

![API3 Remix deploy](/images/builders/integrations/oracles/api3/SS4.png)


Developers use the [DapiServer.sol➚]() contract to access dAPIs. `DapiServer.sol` reads directly from its data store of Beacons, which are powered by API provider-owned and operated [Airnodes]().

## Calling a dAPI

Developers can call a dAPI by importing the `DapiServer.sol` Contract. Head over to [API3 Market](https://market.api3.org/dapis), select the dAPI you want to use, enter the address of the contract that uses the dAPI and get access to it.

Here's an example of a contract using a dAPI on Moonbase Alpha

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

        // Call the DapiServer contract for the value and timestamp of AVAX/USD on Moonbase Alpha(testnet).
        // _dapiServerContractAddress: 0xCC5005Bd08b8882c9A132C0067E7D3f79796C251
        // _dapi: AVAX/USD - 0x415641582f555344000000000000000000000000000000000000000000000000
        (value, timestamp) =
            IDapiServer(_dapiServerContractAddress).readDataFeedWithDapiName(_dapi);
    }
}

```

### Calling a dAPI using Remix on Moonbase Alpha

To call a dAPI using Remix IDE, [Click Here]().

This smart contract imports `DapiServer.sol` and uses the function `readDataFeedWithDapiName(_dapi)` which populates the contract variables value and timestamp. This function is one of four functions available to call a dAPI.

Select the **SOLIDITY COMPILER** pane and compile `MyContract.sol`.

![API3 Remix deploy](/images/builders/integrations/oracles/api3/SS1.png)

As we are going to deploy the Contract on Moonbase Alpha, make sure you have enough funds in your wallet to deploy the Contract.

Head to **Deploy and run Transactions** and select **Injected Provider — MetaMask** option under Environment. Connect your MetaMask. Make sure you’re on the right network.
Deploy the contract and follow through with Metamask to confirm the transaction.

![API3 Remix deploy](/images/builders/integrations/oracles/api3/SS2.png)

Because you are calling a dAPI on a testnet, a subscription for the dAPI AVAX/USD on Moonbase Alpha is not needed. However you will need to get permission for your smart contract to call the dAPI.

Copy the address of the contract. Select copy icon to the right of the contract name, `MyContract.sol`.

Go to the API3 Market page for [AVAX/USD on Moonbase Alpha➚](). Enter the contract address into the permissions widget to the right side of the page.

Connect your wallet, click on Get Access and follow through Metamask to approve the transaction to grant permission to call the AVAX/USD dAPI for your Contract.

Go back to Remix and call the `callDapi()` function. It will require two parameters:
- `_dapiServerContractAddress` - The contract address for the `DapiServer.sol` contract on Moonbase Alpha. Other network addresses for `DapiServer.sol` can be found below.

- `_dapi` - A `bytes32` representation of AVAX/USD. Use `utils.formatBytes32String("AVAX/USD");` to get this encoded value. Try it in the [ethers playground➚]().

After adding the parameters, click on `transact` and confirm the transaction on Metmamask.

![API3 Remix deploy](/images/builders/integrations/oracles/api3/SS3.png)


After the call to `callDapi()` is complete, the `timestamp` and `value` contract variables hold the results until the function is called again in which case these variables would be updated.

<img>

### Contract Addresses

=== "Moonbeam"
    | Contract  |          Addresses         |
    |:-----------:|:-----------------------------------------------------:|
    | AirnodeRrpV0 | {{ networks.moonbeam.api3.rrp }} |
    | DapiServer | {{ networks.moonbeam.api3.rrp }} |
    | AVAX/USD Price Feed | {{ networks.moonbeam.api3.rrp }} |


=== "Moonriver"
    |  Contract  |           Addresses          |
    |:------------:|:----------------------------------------------------:|
    | AirnodeRrpV0 | {{ networks.moonriver.api3.rrp }}  |
    | DapiServer | {{ networks.moonriver.api3.rrp }}  |
    | AVAX/USD Price Feed | {{ networks.moonriver.api3.rrp }} |



=== "Moonbase Alpha"
    |  Contract  |          Addresses           |
    |:------------:|:-----------------------------------------------------:|
    | AirnodeRrpV0  | {{ networks.moonbase.api3.rrp }}  |
    | DapiServer  | {{ networks.moonbase.api3.rrp }}  |
    | AVAX/USD Price Feed | {{ networks.moonbase.api3.rrp }} |

## API3 QRNG

[API3 QRNG]() is a public utility we provide with the courtesy of Australian National University (ANU). It is powered by an Airnode hosted by ANU Quantum Random Numbers, meaning that it is a first-party service. It is served as a public good and is free of charge (apart from the gas costs), and it provides ‘true’ quantum randomness via an easy-to-use solution when requiring RNG on-chain.

To request randomness on-chain, the requester submits a request for a random number to AirnodeRrpV0. The ANU Airnode gathers the request from the AirnodeRrpV0 protocol contract, retrieves the random number off-chain, and sends it back to AirnodeRrpV0. Once received, it performs a callback to the requester with the random number.

You can try QRNG on the networks listed below:

=== "Moonbeam"
    | Contract  |          Addresses         |
    |:-----------:|:-----------------------------------------------------:|
    | ANU QRNG Airnode Address | {{ networks.moonbeam.api3.qrngairnode }} |
    | ANU QRNG Airnode xpub | {{ networks.moonbeam.api3.qrngxpub }} |
    |  endpointIdUint256 | {{ networks.moonbeam.api3.qrnguint256 }} |
    |  endpointIdUint256Array | {{ networks.moonbeam.api3.qrnguint256array }} |


=== "Moonriver"
    |  Contract  |           Addresses          |
    |:------------:|:----------------------------------------------------:|
    | ANU QRNG Airnode Address | {{ networks.moonriver.api3.qrngairnode }} |
    | ANU QRNG Airnode xpub | {{ networks.moonriver.api3.qrngxpub }} |
    |  endpointIdUint256 | {{ networks.moonriver.api3.qrnguint256 }} |
    |  endpointIdUint256Array | {{ networks.moonriver.api3.qrnguint256array }} |

