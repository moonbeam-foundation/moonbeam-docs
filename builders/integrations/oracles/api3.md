---
title: Request Off-Chain Data with API3
description: Learn how to use API3 to request and receive off-chain data from within your smart contracts using API3 Airnodes and dAPIs (data feeds) on Moonbeam networks.
---

# Use API3 To Request Off-Chain Data on Moonbeam

## Introduction {: #introduction }

API3 is a decentralized solution for delivering traditional API services to smart contract platforms in an easily accessible and scalable way. It is governed by a Decentralized Autonomous Organization (DAO), known as the API3 DAO. API3 enables developers to access off-chain resources from within their smart contracts without worrying about security implications. API3 makes this possible through Airnodes, which are first-party oracles, and on-chain data feeds sourced from these oracles.

Developers can use [Airnode](https://docs.api3.org/explore/airnode/what-is-airnode.html){target=\_blank} to request off-chain data inside their smart contracts on Moonbeam networks. An Airnode is a first-party oracle that pushes off-chain API data to your on-chain contract. Airnode lets API providers easily run their own first-party oracle nodes. That way, they can provide data to any on-chain dApp that's interested in their services, all without an intermediary.

An on-chain smart contract makes a request in the [RRP (Request Response Protocol)](https://docs.api3.org/reference/airnode/latest/concepts){target=\_blank} contract ([`AirnodeRrpV0.sol`](https://github.com/api3dao/airnode/blob/v0.11/packages/airnode-protocol/contracts/rrp/AirnodeRrpV0.sol){target=\_blank}) that adds the request to the event logs. The Airnode then accesses the event logs, fetches the API data and performs a callback to the requester with the requested data.

![API3 Airnode](/images/builders/integrations/oracles/api3/api3-1.webp)

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Request Off-Chain Data From an Airnode {: #calling-an-airnode }

Requesting off-chain data essentially involves triggering an Airnode and getting its response through your smart contract. The smart contract in this case would be the requester contract, which will make a request to the desired off-chain Airnode and then capture its response.

The requester calling an Airnode primarily focuses on two tasks:

- Make the request
- Accept and decode the response

![API3 Airnode](/images/builders/integrations/oracles/api3/api3-2.webp)

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

You can also try [deploying the example contract on Remix](https://remix.ethereum.org/#url=https://github.com/api3-ecosystem/remix-contracts/blob/master/contracts/Requester.sol&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.9+commit.e5eed63a.js){target=\_blank}.

### Contract Addresses {: #contract-addresses }

The `_rrpAddress` is the main `airnodeRrpAddress`. The RRP Contracts have already been deployed on-chain. The [addresses for the `_rrpcAddress`](https://docs.api3.org/reference/airnode/latest){target=\_blank} on Moonbeam networks are as follows:

=== "Moonbeam"

    |   Contract   |             Addresses              |
    |:------------:|:----------------------------------:|
    | AirnodeRrpV0 | `{{ networks.moonbeam.api3.rrp }}` |

=== "Moonriver"

    |   Contract   |              Addresses              |
    |:------------:|:-----------------------------------:|
    | AirnodeRrpV0 | `{{ networks.moonriver.api3.rrp }}` |

=== "Moonbase Alpha"

    |   Contract   |             Addresses              |
    |:------------:|:----------------------------------:|
    | AirnodeRrpV0 | `{{ networks.moonbase.api3.rrp }}` |

### Request Parameters {: #request-params }

The `makeRequest()` function expects the following parameters to make a valid request:

- [**`airnode`**](https://docs.api3.org/reference/airnode/latest/concepts/airnode.html){target=\_blank} - specifies the Airnode Address
- [**`endpointId`**](https://docs.api3.org/reference/airnode/latest/concepts/endpoint.html){target=\_blank} - specifies which endpoint to be used
- [**`sponsor`**](https://docs.api3.org/reference/airnode/latest/concepts/sponsor.html){target=\_blank} and [**`sponsorWallet`**](https://docs.api3.org/reference/airnode/latest/concepts/sponsor.html#sponsorwallet){target=\_blank} - specifies which wallet will be used to fulfill the request
- [**`parameters`**](https://docs.api3.org/reference/ois/latest/reserved-parameters.html){target=\_blank} - specifies the API and Reserved Parameters (see [Airnode ABI specifications](https://docs.api3.org/reference/airnode/latest/specifications/airnode-abi.html){target=\_blank} for how these are encoded). Parameters can be encoded off-chain using `@airnode-abi` library

### Response Parameters {: #response-params }

The callback to the requester contract contains two parameters:

- [**`requestId`**](https://docs.api3.org/reference/airnode/latest/concepts/request.html#requestid){target=\_blank} - first acquired when making the request and passed here as a reference to identify the request for which the response is intended.
- **`data`** - in case of a successful response, this is the requested data which has been encoded and contains a timestamp in addition to other response data. Decode it using the `decode()` function from the `abi` object

!!! note
    Sponsors should not fund a `sponsorWallet` with more then they can trust the Airnode with, as the Airnode controls the private key to the `sponsorWallet`. The deployer of such Airnode undertakes no custody obligations, and the risk of loss or misuse of any excess funds sent to the `sponsorWallet` remains with the sponsor.

## Using dAPIs - API3 Datafeeds {: #dapis }

[dAPIs](https://docs.api3.org/explore/dapis/what-are-dapis.html){target=\_blank} are continuously updated streams of off-chain data, such as the latest cryptocurrency, stock, and commodity prices. They can power various decentralized applications such as DeFi lending, synthetic assets, stablecoins, derivatives, NFTs, and more.

The data feeds are continuously updated by [first-party oracles](https://docs.api3.org/explore/introduction/first-party.html){target=\_blank} using signed data. DApp owners can read the on-chain value of any dAPI in realtime.

Due to being composed of first-party data feeds, dAPIs offer security, transparency, cost-efficiency, and scalability in a turn-key package.

![API3 Remix deploy](/images/builders/integrations/oracles/api3/api3-3.webp)

*To learn more about how dAPIs work, please refer to [API3's documentation*](https://docs.api3.org/explore/dapis/what-are-dapis.html){target=\_blank}*.

### Types of dAPIs {: #types-of-dapis }

There are two types of dAPIs: [self-funded](https://docs.api3.org/reference/dapis/understand/self-funded.html){target=\_blank} and [managed](https://docs.api3.org/reference/dapis/understand/managed.html){target=\_blank}. Managed dAPIs are only available on MainNets, and self-funded dAPIs are available on both MainNets and TestNets. The process to read from a dAPI proxy remains the same for both self-funded and managed dAPIs.

#### Self-funded dAPIs {: #self-funded-dapis }

[Self-funded dAPIs](https://docs.api3.org/reference/dapis/understand/self-funded.html){target=\_blank} are single-source data feeds that are funded by the users with their own funds. They offer developers the opportunity to experience data feeds with minimal up-front commitment, providing a low-risk option prior to using managed dAPIs.

With self-funded dAPIs, you can fund the dAPI with your own funds. The amount of gas you supply will determine how long your dAPI will be available for use. If you run out of gas, you can fund the dAPI again to keep it available for use.

You can read more about [self-funded dAPIs on API3's documentation site](https://docs.api3.org/guides/dapis/subscribing-self-funded-dapis){target=\_blank}.

#### Managed dAPIs {: #managed-dapis }

[Managed dAPIs](https://docs.api3.org/reference/dapis/understand/managed.html) are sourced directly from multiple [first-party](https://docs.api3.org/explore/airnode/why-first-party-oracles.html){target=\_blank} data providers running an Airnode and aggregated using Airnode's signed data using a median function. The gas costs and availability of managed dAPIs are managed by the [API3 DAO](https://docs.api3.org/explore/dao-members){target=\_blank}.

You can read more about [managed dAPIs on API3's documentation site](https://docs.api3.org/reference/dapis/understand/managed.html){target=\_blank}.

### Access Self-Funded dAPIs {: #access-self-funded-dapis }

The process for accessing self-funded data feeds is as follows:

1. Explore the API3 Market and select a dAPI
2. Fund a sponsor wallet
3. Deploy a proxy contract to acess the data feed
4. Read data from the dAPI

![API3 Remix deploy](/images/builders/integrations/oracles/api3/api3-4.webp)

#### Select a dAPI From the API3 Market {: #select-a-dapi }

The [API3 Market](https://market.api3.org/dapis){target=\_blank} enables users to connect to a dAPI and access the associated data feed services. It provides a list of all of the dAPIs available across multiple chains including testnets. You can filter the list by chains and data providers. You can also search for a specific dAPI by name. You can click on a dAPI to land on the details page where you can find more information about the dAPI.

You can then decide if you want to use self-funded or managed dAPIs.

![API3 Dapi Page](/images/builders/integrations/oracles/api3/api3-5.webp)

#### Fund a Sponsor Wallet {: #fund-sponsor-wallet }

Once you have selected your dAPI, you can activate it by using the [API3 Market](https://market.api3.org){target=\_blank} to send funds (DEV, MOVR, or GLMR) to the `sponsorWallet`. Make sure your:

- Wallet is connected to the Market and is the same network as the dAPI you are funding
- The balance of your wallet should be greater than the amount you are sending to the `sponsorWallet`

To fund the dAPI, you need to click on the **Fund Gas** button. Depending upon if a proxy contract is already deployed, you will see a different UI.

![API3 Remix deploy](/images/builders/integrations/oracles/api3/api3-6.webp)

Use the gas estimator to select how much gas is needed by the dAPI. Click on **Send DEV** to send the entered amount to the sponsor wallet of the respective dAPI.

![API3 Remix deploy](/images/builders/integrations/oracles/api3/api3-7.webp)

Once the transaction is broadcasted & confirmed on the blockchain a transaction confirmation screen will appear.

#### Deploy a Proxy Contract to Access The dAPI {: #deploy-proxy }

Smart contracts can interact and read values from contracts that are already deployed on the blockchain. By deploying a proxy contract via the API3 Market, a dApp can interact and read values from a dAPI like ETH/USD.

!!! note
    If a proxy is already deployed for a self-funded dAPI, the dApp can read the dAPI without having to deploy a proxy contract. They do this by using the address of the already deployed proxy contract which will be visible on the API3 Market.

If you are deploying a proxy contract during the funding process, clicking on the **Get proxy** button will initiate a transaction to your wallet that will deploy a proxy contract.

![API3 Remix deploy](/images/builders/integrations/oracles/api3/api3-8.webp)

Once the transaction is broadcasted & confirmed on the blockchain, the proxy contract address will be shown on the UI.

### Access Managed dAPIs {: #access-managed-dapis }

If you are trying to access managed dAPIs, once you have selected your dAPI, you will then be presented with the option to choose from either **Managed** or **Self-funded**. Select **Managed dAPIs**.

Managed dAPIs give you the option to configure the dAPI's [devation threshold](https://docs.api3.org/reference/dapis/understand/deviations.html){target=\_blank} and [heartbeat](https://docs.api3.org/reference/dapis/understand/deviations.html#heartbeat){target=\_blank}. For managed dAPIs, you will have the following options to choose from:

| Deviation | Heartbeat |
|-----------|-----------|
| 0.25%     | 2 minutes |
| 0.25%     | 24 hours  |
| 0.5%      | 24 hours  |
| 1%        | 24 hours  |

!!! note
    Not all dAPIs support all the configurations. It depends on the asset and chain. Check the [API3 Market](https://market.api3.org){target=\_blank} for more information.

After selecting the required deviation threshold and heartbeat, check the final price, and select **Add to Cart**. You can add more dAPIs on the same network to your cart. Once you are done, click on **Checkout**. Make sure you check the order details and the final price on the payment page. Once you are ready, connect your wallet and pay for the order.

After placing the order, you will have to wait for the dAPI to get updated. It usually takes five business days for the dAPI team to update the dAPI for the requested configuration. Once the dAPI is updated, you can start using it in your dApp.

#### Read From a dAPI {: #read-dapis }

Here's an example of a basic contract that reads from a dAPI:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@api3/contracts/v0.8/interfaces/IProxy.sol";

contract DataFeedReaderExample is Ownable {
    // This contract reads from a single proxy. Your contract can read from multiple proxies.
    address public proxy;

    // Updating the proxy address is a security-critical action. In this example, only
    // the owner is allowed to do so.
    function setProxy(address _proxy) public onlyOwner {
        proxy = _proxy;
    }

    function readDataFeed()
        external
        view
        returns (int224 value, uint256 timestamp)
    {
        (value, timestamp) = IProxy(proxy).read();
        // If you have any assumptions about `value` and `timestamp`, make sure
        // to validate them right after reading from the proxy.
    }
}
```

The example contract contains two functions:

- `setProxy()` - used to set the address of the dAPI Proxy Contract
- `readDataFeed()` - a `view` function that returns the latest price of the set dAPI

[Try deploying it on Remix!](https://remix.ethereum.org/#url=https://github.com/api3-ecosystem/remix-contracts/blob/master/contracts/DataFeedReader.sol&lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.18+commit.87f61d96.js){target=\_blank}

You can read more about dAPIs on [API3's documentation site](https://docs.api3.org/guides/dapis/subscribing-managed-dapis){target=\_blank}.

## API3 QRNG {: #api3-qrng }

[API3 QRNG](https://docs.api3.org/explore/qrng){target=\_blank} is a public utility we provide with the courtesy of Australian National University (ANU). It is powered by an Airnode hosted by ANU Quantum Random Numbers, meaning that it is a first-party service. It is served as a public good and is free of charge (apart from the gas costs), and it provides ‘true’ quantum randomness via an easy-to-use solution when requiring RNG on-chain.

To request randomness on-chain, the requester submits a request for a random number to AirnodeRrpV0. The ANU Airnode gathers the request from the AirnodeRrpV0 protocol contract, retrieves the random number off-chain, and sends it back to AirnodeRrpV0. Once received, it performs a callback to the requester with the random number.

Here is an example of a basic `QrngRequester` that requests a random number:

```solidity
//SPDX-License-Identifier: MIT
pragma solidity 0.8.9;
import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";

contract RemixQrngExample is RrpRequesterV0 {
    event RequestedUint256(bytes32 indexed requestId);
    event ReceivedUint256(bytes32 indexed requestId, uint256 response);

    address public airnode;
    bytes32 public endpointIdUint256;
    address public sponsorWallet;
    mapping(bytes32 => bool) public waitingFulfillment;

    // These are for Remix demonstration purposes, their use is not practical.
    struct LatestRequest { 
      bytes32 requestId;
      uint256 randomNumber;
    }
    LatestRequest public latestRequest;

    constructor(address _airnodeRrp) RrpRequesterV0(_airnodeRrp) {}

    // Normally, this function should be protected, as in:
    // require(msg.sender == owner, "Sender not owner");
    function setRequestParameters(
        address _airnode,
        bytes32 _endpointIdUint256,
        address _sponsorWallet
    ) external {
        airnode = _airnode;
        endpointIdUint256 = _endpointIdUint256;
        sponsorWallet = _sponsorWallet;
    }

    function makeRequestUint256() external {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,
            endpointIdUint256,
            address(this),
            sponsorWallet,
            address(this),
            this.fulfillUint256.selector,
            ""
        );
        waitingFulfillment[requestId] = true;
        latestRequest.requestId = requestId;
        latestRequest.randomNumber = 0;
        emit RequestedUint256(requestId);
    }

    function fulfillUint256(bytes32 requestId, bytes calldata data)
        external
        onlyAirnodeRrp
    {
        require(
            waitingFulfillment[requestId],
            "Request ID not known"
        );
        waitingFulfillment[requestId] = false;
        uint256 qrngUint256 = abi.decode(data, (uint256));
        // Do what you want with `qrngUint256` here...
        latestRequest.randomNumber = qrngUint256;
        emit ReceivedUint256(requestId, qrngUint256);
    }
}
```

The example contract contains these three functions:

- `setRequestParameters` - accepts and sets the following three request parameters:
    - `airnode` - address of an Airnode that will be called to retrieve QRNG data
    - `endpointIdUint256` - the endpoint ID of the Airnode
    - `sponsorWallet` - the address of the sponsor wallet
- `makeRequestUint256` - calls the `airnodeRrp.makeFullRequest()` function of the `AirnodeRrpV0.sol` protocol contract which adds the request to its storage and returns a `requestId`
- `fulfillUint256` - accepts and decodes the requested random number

!!! note
    You can get the `airnode` address and `endpointIdUint256` from the [QRNG Providers](#qrng-providers) section below.

[Try deploying it on Remix!](https://remix.ethereum.org/#url=https://github.com/api3-ecosystem/remix-contracts/blob/master/contracts/QrngRequesterUpdated.sol&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.9+commit.e5eed63a.js&lang=en){target=\_blank}

### QRNG Airnode and Endpoint Providers {: #qrng-providers }

You can try QRNG using the following Airnodes and endpoints:

=== "Moonbeam"

    |          Variable           |                       Value                        |
    |:---------------------------:|:--------------------------------------------------:|
    |  ANU QRNG Airnode Address   |   `{{ networks.moonbeam.api3.anuqrngairnode }}`    |
    |    ANU QRNG Airnode xpub    |     `{{ networks.moonbeam.api3.anuqrngxpub }}`     |
    |  ANU Endpoint ID (uint256)  |   `{{ networks.moonbeam.api3.anuqrnguint256 }}`    |
    | ANU Endpoint ID (uint256[]) | `{{ networks.moonbeam.api3.anuqrnguint256array }}` |

=== "Moonriver"

    |          Variable           |                        Value                        |
    |:---------------------------:|:---------------------------------------------------:|
    |  ANU QRNG Airnode Address   |   `{{ networks.moonriver.api3.anuqrngairnode }}`    |
    |    ANU QRNG Airnode xpub    |     `{{ networks.moonriver.api3.anuqrngxpub }}`     |
    |  ANU Endpoint ID (uint256)  |   `{{ networks.moonriver.api3.anuqrnguint256 }}`    |
    | ANU Endpoint ID (uint256[]) | `{{ networks.moonriver.api3.anuqrnguint256array }}` |

=== "Moonbase Alpha"

    |            Variable            |                         Value                         |
    |:------------------------------:|:-----------------------------------------------------:|
    |  Nodary QRNG Airnode Address   |   `{{ networks.moonbase.api3.nodaryqrngairnode }}`    |
    |    Nodary QRNG Airnode xpub    |     `{{ networks.moonbase.api3.nodaryqrngxpub }}`     |
    |  Nodary Endpoint ID (uint256)  |   `{{ networks.moonbase.api3.nodaryqrnguint256 }}`    |
    | Nodary Endpoint ID (uint256[]) | `{{ networks.moonbase.api3.nodaryqrnguint256array }}` |

*For a complete list of all the QRNG Providers, please refer to [API3's documentation](https://docs.api3.org/reference/qrng/providers.html){target=\_blank}.*
## Additional Resources {: #additional-resources }

Here are some additional developer resources:

- [API3 Docs](https://docs.api3.org){target=\_blank}
    - [dAPI Docs](https://docs.api3.org/explore/dapis/what-are-dapis.html){target=\_blank}
    - [QRNG Docs](https://docs.api3.org/explore/qrng){target=\_blank}
- [API3 DAO GitHub](https://github.com/api3dao){target=\_blank}
- [API3 Medium](https://medium.com/api3){target=\_blank}
- [API3 YouTube](https://www.youtube.com/API3DAO){target=\_blank}

--8<-- 'text/_disclaimers/third-party-content.md'
