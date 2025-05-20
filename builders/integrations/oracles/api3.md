---
title: Request Off-Chain Data with API3
description: Learn how to use API3 to request and receive off-chain data from within your smart contracts using API3 Airnodes and dAPIs (data feeds) on Moonbeam networks.
---

# Use API3 To Request Off-Chain Data on Moonbeam

## Introduction {: #introduction }

API3 is a decentralized solution for delivering traditional API services to smart contract platforms in an easily accessible and scalable way. It is governed by a Decentralized Autonomous Organization (DAO), the API3 DAO. API3 enables developers to access off-chain resources from within their smart contracts without worrying about security implications. API3 makes this possible through Airnodes, which are first-party oracles, and on-chain data feeds sourced from these oracles.

Developers can use [Airnode](https://airnode-docs.api3.org/reference/airnode/latest/understand/){target=\_blank} to request off-chain data inside their smart contracts on Moonbeam networks. An Airnode is a first-party oracle that pushes off-chain API data to your on-chain contract. Airnode lets API providers easily run their own first-party oracle nodes. That way, they can provide data to any on-chain dApp interested in their services, all without an intermediary.

An on-chain smart contract requests the [RRP (Request Response Protocol)](https://airnode-docs.api3.org/reference/airnode/latest/developers/){target=\_blank} contract ([`AirnodeRrpV0.sol`](https://github.com/api3dao/airnode/blob/v0.11/packages/airnode-protocol/contracts/rrp/AirnodeRrpV0.sol){target=\_blank}) that adds the request to the event logs. The Airnode then accesses the event logs, fetches the API data, and performs a callback to the requester with the requested data.

![A diagram detailing the Airnode flow.](/images/builders/integrations/oracles/api3/api3-1.webp)

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Request Off-Chain Data From an Airnode {: #calling-an-airnode }

Requesting off-chain data essentially involves triggering an Airnode and getting its response through your smart contract. The smart contract in this case would be the requester contract, which will make a request to the desired off-chain Airnode and then capture its response.

The requester calling an Airnode primarily focuses on two tasks:

- Making the request
- Accepting and decoding the response

![A diagram detailing the process of requesting off-chain data from an Airnode.](/images/builders/integrations/oracles/api3/api3-2.webp)

Here is an example of a basic requester contract to request data from an Airnode:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";
import "@openzeppelin/contracts@4.9.5/access/Ownable.sol";

// A Requester that will return the requested data by calling the specified Airnode.
contract Requester is RrpRequesterV0, Ownable {
    mapping(bytes32 => bool) public incomingFulfillments;
    mapping(bytes32 => int256) public fulfilledData;

    // Make sure you specify the right _rrpAddress for your chain while deploying the contract.
    constructor(address _rrpAddress) RrpRequesterV0(_rrpAddress) {}

    // To receive funds from the sponsor wallet and send them to the owner.
    receive() external payable {
        payable(owner()).transfer(address(this).balance);
    }

    // The main makeRequest function that will trigger the Airnode request.
    function makeRequest(
        address airnode,
        bytes32 endpointId,
        address sponsor,
        address sponsorWallet,
        bytes calldata parameters

    ) external {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,                        // airnode address
            endpointId,                     // endpointId
            sponsor,                        // sponsor's address
            sponsorWallet,                  // sponsorWallet
            address(this),                  // fulfillAddress
            this.fulfill.selector,          // fulfillFunctionId
            parameters                      // encoded API parameters
        );
        incomingFulfillments[requestId] = true;
    }
    
    function fulfill(bytes32 requestId, bytes calldata data)
        external
        onlyAirnodeRrp
    {
        require(incomingFulfillments[requestId], "No such request made");
        delete incomingFulfillments[requestId];
        int256 decodedData = abi.decode(data, (int256));
        fulfilledData[requestId] = decodedData;
    }

    // To withdraw funds from the sponsor wallet to the contract.
    function withdraw(address airnode, address sponsorWallet) external onlyOwner {
        airnodeRrp.requestWithdrawal(
        airnode,
        sponsorWallet
        );
    }
}
```

You can also try [deploying the example contract on Remix](https://remix.ethereum.org/#url=https://github.com/api3-ecosystem/remix-contracts/blob/master/contracts/RequesterWithWithdrawal.sol&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.9+commit.e5eed63a.js){target=\_blank}.

### Contract Addresses {: #contract-addresses }

The `_rrpAddress` is the main `airnodeRrpAddress`. The RRP contracts have already been deployed on-chain. The [addresses for the `_rrpAddress`](https://airnode-docs.api3.org/reference/airnode/latest/){target=\_blank} on Moonbeam networks are as follows:

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

- [**`airnode`**](https://docs.api3.org/reference/airnode/latest/concepts/airnode.html){target=\_blank} - specifies the Airnode address
- [**`endpointId`**](https://docs.api3.org/reference/airnode/latest/concepts/endpoint.html){target=\_blank} - specifies which endpoint to be used
- [**`sponsor`**](https://docs.api3.org/reference/airnode/latest/concepts/sponsor.html){target=\_blank} and [**`sponsorWallet`**](https://docs.api3.org/reference/airnode/latest/concepts/sponsor.html#sponsorwallet){target=\_blank} - specifies which wallet will be used to fulfill the request
- [**`parameters`**](https://docs.api3.org/reference/ois/latest/reserved-parameters.html){target=\_blank} - specifies the API and Reserved Parameters (see [Airnode ABI specifications](https://docs.api3.org/oev-searchers/glossary.html#airnode-abi){target=\_blank} for how these are encoded). Parameters can be encoded off-chain using the `@airnode-abi` library

### Response Parameters {: #response-params }

The callback to the requester contract contains two parameters:

- [**`requestId`**](https://docs.api3.org/reference/airnode/latest/concepts/request.html#requestid){target=\_blank} - first acquired when making the request and passed here as a reference to identify the request for which the response is intended
- **`data`** - in case of a successful response, this is the requested data encoded and contains a timestamp in addition to other response data. Decode it using the `decode()` function from the `abi` object

!!! note
    Sponsors should not fund a `sponsorWallet` with more than they can trust the Airnode with, as the Airnode controls the private key to the `sponsorWallet`. The deployer of such Airnode undertakes no custody obligations, and the risk of loss or misuse of any excess funds sent to the `sponsorWallet` remains with the sponsor.

## dAPIs: API3 Data Feeds {: #dapis }

[dAPIs](https://docs.api3.org/oev-searchers/in-depth/dapis/#dapis){target=\_blank} are continuously updated streams of off-chain data, such as the latest cryptocurrency, stock, and commodity prices. They can power decentralized applications such as DeFi lending, synthetic assets, stablecoins, derivatives, NFTs, and more.

The data feeds are continuously updated by [first-party oracles](https://docs.api3.org/oev-searchers/glossary.html#first-party-oracles){target=\_blank} using signed data. DApp owners can read the on-chain value of any dAPI in real-time.

Because they are composed of first-party data feeds, dAPIs offer security, transparency, cost-efficiency, and scalability in a turnkey package.

![The API3 Market dashboard.](/images/builders/integrations/oracles/api3/api3-3.webp)

To learn more about how dAPIs work, please refer to [API3's documentation](https://docs.api3.org/oev-searchers/in-depth/dapis/#dapis){target=\_blank}.

### Subscribe to dAPIs {: #subscribing-to-dapis }

The [API3 Market](https://market.api3.org/){target=\_blank} lets users access dAPIs on [Moonbeam](https://market.api3.org/moonbeam){target=\_blank}, [Moonriver](https://market.api3.org/moonriver){target=\_blank}, and the [Moonbase Alpha TestNet](https://market.api3.org/moonbeam-testnet){target=\_blank} (currently labeled as the Moonbeam TestNet).

From the [API3 Market home page](https://market.api3.org/){target=\_blank}, you can search for a given chain. After selecting the chain, you can view the list of available dAPIs and click on one for more information. For example, you can click on the `USDT/USD` pair available for Moonbeam to view the parameters of the dAPI, including the deviation and the heartbeat.

The supported parameters for dAPIs are:

| Deviation | Heartbeat |
|-----------|-----------|
| 0.25%     | 24 hours  |
| 0.5%      | 24 hours  |
| 1%        | 24 hours  |
| 5%        | 24 hours  |

![The USDT/USD dAPI detail page.](/images/builders/integrations/oracles/api3/api3-4.webp)

### Configure and Activate a dAPI {: #select-a-dapi }

Once you've selected a dAPI to interact with, check the expiration date and update the parameters as needed. You can update the parameters and extend the subscription by purchasing a new configuration. If the dAPI has been activated and the configurations listed will work for you, you can skip ahead to the next section to learn how to [interact with the dAPI](#get-data).

To purchase a plan with new configurations, click on **Purchase new plan** and take the following steps:

1. Select your parameters
2. Click on **Connect Wallet**

![The activate data feed page.](/images/builders/integrations/oracles/api3/api3-5.webp)

Once connected, you'll be able to purchase your new plan. Click on **Purchase** and sign the transaction. After the transaction has been confirmed, you will be able to see the updated configuration for the dAPI.

### Get Data from a dAPI {: #get-data}

To interact with a dAPI, you'll need to get the proxy address for it. Click on the **Integrate** button from the dAPI details page. Then, on the integration page, copy the proxy address.

![The integrate data feed page.](/images/builders/integrations/oracles/api3/api3-6.webp)

With the proxy address in hand, you'll be able to integrate the dAPI into a smart contract. Here's an example of a basic contract that reads from a dAPI:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts@4.9.5/access/Ownable.sol";
import "@api3/contracts/api3-server-v1/proxies/interfaces/IProxy.sol";

contract DataFeedReaderExample is Ownable {
    // The proxy contract address obtained from the API3 Market UI
    address public proxyAddress;

    // Updating the proxy contract address is a security-critical
    // action. In this example, only the owner is allowed to do so
    function setProxyAddress(address _proxyAddress) public onlyOwner {
        proxyAddress = _proxyAddress;
    }

    function readDataFeed()
        external
        view
        returns (int224 value, uint256 timestamp)
    {
        // Use the IProxy interface to read a dAPI via its
        // proxy contract
        (value, timestamp) = IProxy(proxyAddress).read();
        // If you have any assumptions about `value` and `timestamp`,
        // make sure to validate them after reading from the proxy
    }
}
```

The example contract contains two functions:

- `setProxyAddress()` - used to set the address of the dAPI proxy contract
- `readDataFeed()` - a `view` function that returns the latest price of the set dAPI

[Try deploying it on Remix](https://remix.ethereum.org/#url=https://github.com/api3-ecosystem/remix-contracts/blob/master/contracts/DapiReader.sol&lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.18+commit.87f61d96.js){target=\_blank}!

## API3 QRNG {: #api3-qrng }

[API3 QRNG](https://docs.api3.org/explore/qrng){target=\_blank} is a public utility provided with the courtesy of Australian National University (ANU), Quintessence Labs and Quantum Blockchains. It is powered by an Airnode deployed by the QRNG Providers, meaning that it is a first-party service. It is served as a public good and is free of charge (apart from the gas costs), and it provides ‘true’ quantum randomness via an easy-to-use solution when requiring RNG on-chain.

To request randomness on-chain, the requester submits a request for a random number to `AirnodeRrpV0`. The QRNG Airnode gathers the request from the `AirnodeRrpV0` protocol contract, retrieves the random number off-chain, and sends it back to `AirnodeRrpV0`. Once received, it performs a callback to the requester with the random number.

Click here to check out the [`AirnodeRrpV0`](https://github.com/api3dao/airnode/blob/v0.11/packages/airnode-protocol/contracts/rrp/AirnodeRrpV0.sol){target=\_blank} and available [QRNG Providers](https://docs.api3.org/reference/qrng/providers.html){target=\_blank} on Moonbeam.

Here is an example of a basic `QrngRequester` that requests a random number:

```solidity
//SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";
import "@openzeppelin/contracts@4.9.5/access/Ownable.sol";

/// @title Example contract that uses Airnode RRP to access QRNG services
contract QrngExample is RrpRequesterV0, Ownable {
    event RequestedUint256(bytes32 indexed requestId);
    event ReceivedUint256(bytes32 indexed requestId, uint256 response);
    event RequestedUint256Array(bytes32 indexed requestId, uint256 size);
    event ReceivedUint256Array(bytes32 indexed requestId, uint256[] response);
    event WithdrawalRequested(address indexed airnode, address indexed sponsorWallet);

    address public airnode;                 /// The address of the QRNG Airnode
    bytes32 public endpointIdUint256;       /// The endpoint ID for requesting a single random number
    bytes32 public endpointIdUint256Array;  /// The endpoint ID for requesting an array of random numbers
    address public sponsorWallet;           /// The wallet that will cover the gas costs of the request
    uint256 public _qrngUint256;            /// The random number returned by the QRNG Airnode
    uint256[] public _qrngUint256Array;     /// The array of random numbers returned by the QRNG Airnode

    mapping(bytes32 => bool) public expectingRequestWithIdToBeFulfilled;

    constructor(address _airnodeRrp) RrpRequesterV0(_airnodeRrp) {}

    /// @notice Sets the parameters for making requests
    function setRequestParameters(
        address _airnode,
        bytes32 _endpointIdUint256,
        bytes32 _endpointIdUint256Array,
        address _sponsorWallet
    ) external {
        airnode = _airnode;
        endpointIdUint256 = _endpointIdUint256;
        endpointIdUint256Array = _endpointIdUint256Array;
        sponsorWallet = _sponsorWallet;
    }

    /// @notice To receive funds from the sponsor wallet and send them to the owner.
    receive() external payable {
        payable(owner()).transfer(msg.value);
        emit WithdrawalRequested(airnode, sponsorWallet);
    }

    /// @notice Requests a `uint256`
    /// @dev This request will be fulfilled by the contract's sponsor wallet,
    /// which means spamming it may drain the sponsor wallet.
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
        expectingRequestWithIdToBeFulfilled[requestId] = true;
        emit RequestedUint256(requestId);
    }

    /// @notice Called by the Airnode through the AirnodeRrp contract to
    /// fulfill the request
    function fulfillUint256(bytes32 requestId, bytes calldata data)
        external
        onlyAirnodeRrp
    {
        require(
            expectingRequestWithIdToBeFulfilled[requestId],
            "Request ID not known"
        );
        expectingRequestWithIdToBeFulfilled[requestId] = false;
        uint256 qrngUint256 = abi.decode(data, (uint256));
        _qrngUint256 = qrngUint256;
        // Do what you want with `qrngUint256` here...
        emit ReceivedUint256(requestId, qrngUint256);
    }

    /// @notice Requests a `uint256[]`
    /// @param size Size of the requested array
    function makeRequestUint256Array(uint256 size) external {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,
            endpointIdUint256Array,
            address(this),
            sponsorWallet,
            address(this),
            this.fulfillUint256Array.selector,
            // Using Airnode ABI to encode the parameters
            abi.encode(bytes32("1u"), bytes32("size"), size)
        );
        expectingRequestWithIdToBeFulfilled[requestId] = true;
        emit RequestedUint256Array(requestId, size);
    }

    /// @notice Called by the Airnode through the AirnodeRrp contract to
    /// fulfill the request
    function fulfillUint256Array(bytes32 requestId, bytes calldata data)
        external
        onlyAirnodeRrp
    {
        require(
            expectingRequestWithIdToBeFulfilled[requestId],
            "Request ID not known"
        );
        expectingRequestWithIdToBeFulfilled[requestId] = false;
        uint256[] memory qrngUint256Array = abi.decode(data, (uint256[]));
        // Do what you want with `qrngUint256Array` here...
        _qrngUint256Array = qrngUint256Array;
        emit ReceivedUint256Array(requestId, qrngUint256Array);
    }

    /// @notice Getter functions to check the returned value.
    function getRandomNumber() public view returns (uint256) {
        return _qrngUint256;
    }

    function getRandomNumberArray() public view returns(uint256[] memory) {
        return _qrngUint256Array;
    }

    /// @notice To withdraw funds from the sponsor wallet to the contract.
    function withdraw() external onlyOwner {
        airnodeRrp.requestWithdrawal(
        airnode,
        sponsorWallet
        );
    }
}
```

The example contract contains these functions:

- `setRequestParameters` - accepts and sets the following three request parameters:
    - `airnode` - address of an Airnode that will be called to retrieve QRNG data
    - `endpointIdUint256` - the endpoint ID of the Airnode
    - `sponsorWallet` - the address of the sponsor wallet
- `makeRequestUint256` and `makeRequestUint256Array` - calls the `airnodeRrp.makeFullRequest()` function of the `AirnodeRrpV0.sol` protocol contract which adds the request to its storage and returns a `requestId`
- `fulfillUint256` and `fulfillUint256Array` - accepts and decodes the requested random number
- `getRandomNumber` and `getRandomNumberArray` - returns the requested random number and array after the request is fulfilled
- `withdraw` - allows the owner to withdraw funds from the sponsor wallet

!!! note
    You can get the `airnode` address and `endpointIdUint256` from the [QRNG Providers](#qrng-providers) section below.

[Try deploying it on Remix](https://remix.ethereum.org/#url=https://github.com/api3-ecosystem/remix-contracts/blob/master/contracts/QrngRequesterUpdated.sol&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.9+commit.e5eed63a.js&lang=en){target=\_blank}!

### QRNG Airnode and Endpoint Providers {: #qrng-providers }

You can try QRNG using the following Airnodes and endpoints:

=== "Moonbeam"

    |                  Variable                   |                             Value                             |
    |:-------------------------------------------:|:-------------------------------------------------------------:|
    |          ANU QRNG Airnode Address           |         `{{ networks.moonbeam.api3.anuqrngairnode }}`         |
    |            ANU QRNG Airnode xpub            |          `{{ networks.moonbeam.api3.anuqrngxpub }}`           |
    |          ANU Endpoint ID (uint256)          |         `{{ networks.moonbeam.api3.anuqrnguint256 }}`         |
    |         ANU Endpoint ID (uint256[])         |      `{{ networks.moonbeam.api3.anuqrnguint256array }}`       |
    |      Quintessence QRNG Airnode Address      |      `{{ networks.moonbeam.api3.quintessenceairnode }}`       |
    |       Quintessence QRNG Airnode xpub        |        `{{ networks.moonbeam.api3.quintessencexpub }}`        |
    |     Quintessence Endpoint ID (uint256)      |      `{{ networks.moonbeam.api3.quintessenceuint256 }}`       |
    |    Quintessence Endpoint ID (uint256[])     |    `{{ networks.moonbeam.api3.quintessenceuint256array }}`    |
    |  Quantum Blockchains QRNG Airnode Address   |   `{{ networks.moonbeam.api3.quantumblockchainsairnode }}`    |
    |    Quantum Blockchains QRNG Airnode xpub    |     `{{ networks.moonbeam.api3.quantumblockchainsxpub }}`     |
    |  Quantum Blockchains Endpoint ID (uint256)  |   `{{ networks.moonbeam.api3.quantumblockchainsuint256 }}`    |
    | Quantum Blockchains Endpoint ID (uint256[]) | `{{ networks.moonbeam.api3.quantumblockchainsuint256array }}` |

=== "Moonriver"

    |                  Variable                   |                             Value                              |
    |:-------------------------------------------:|:--------------------------------------------------------------:|
    |          ANU QRNG Airnode Address           |         `{{ networks.moonriver.api3.anuqrngairnode }}`         |
    |            ANU QRNG Airnode xpub            |          `{{ networks.moonriver.api3.anuqrngxpub }}`           |
    |          ANU Endpoint ID (uint256)          |         `{{ networks.moonriver.api3.anuqrnguint256 }}`         |
    |         ANU Endpoint ID (uint256[])         |      `{{ networks.moonriver.api3.anuqrnguint256array }}`       |
    |      Quintessence QRNG Airnode Address      |      `{{ networks.moonriver.api3.quintessenceairnode }}`       |
    |       Quintessence QRNG Airnode xpub        |        `{{ networks.moonriver.api3.quintessencexpub }}`        |
    |     Quintessence Endpoint ID (uint256)      |      `{{ networks.moonriver.api3.quintessenceuint256 }}`       |
    |    Quintessence Endpoint ID (uint256[])     |    `{{ networks.moonriver.api3.quintessenceuint256array }}`    |
    |  Quantum Blockchains QRNG Airnode Address   |   `{{ networks.moonriver.api3.quantumblockchainsairnode }}`    |
    |    Quantum Blockchains QRNG Airnode xpub    |     `{{ networks.moonriver.api3.quantumblockchainsxpub }}`     |
    |  Quantum Blockchains Endpoint ID (uint256)  |   `{{ networks.moonriver.api3.quantumblockchainsuint256 }}`    |
    | Quantum Blockchains Endpoint ID (uint256[]) | `{{ networks.moonriver.api3.quantumblockchainsuint256array }}` |

=== "Moonbase Alpha"

    |               Variable               |                         Value                          |
    |:------------------------------------:|:------------------------------------------------------:|
    |     TestNet QRNG Airnode Address     |   `{{ networks.moonbase.api3.testnetqrngairnode }}`    |
    |      TestNet QRNG Airnode xpub       |     `{{ networks.moonbase.api3.testnetqrngxpub }}`     |
    |  TestNet QRNG Endpoint ID (uint256)  |   `{{ networks.moonbase.api3.testnetqrnguint256 }}`    |
    | TestNet QRNG Endpoint ID (uint256[]) | `{{ networks.moonbase.api3.testnetqrnguint256array }}` |

For a complete list of all the QRNG Providers, please refer to [API3's documentation](https://airnode-docs.api3.org/reference/airnode/latest/understand/){target=\_blank}.

## Additional Resources {: #additional-resources }

Here are some additional developer resources:

- [API3 Market](https://market.api3.org/moonbeam){target=\_blank}
- [API3 Docs](https://docs.api3.org){target=\_blank}
    - [Getting started with dAPIs](https://docs.api3.org/oev-searchers/glossary.html#dapi){target=\_blank}
    - [Getting started with QRNG](https://airnode-docs.api3.org/reference/airnode/latest/understand/){target=\_blank}
- [API3 DAO GitHub](https://github.com/api3dao){target=\_blank}
- [API3 Medium](https://medium.com/api3){target=\_blank}
- [API3 YouTube](https://www.youtube.com/API3DAO){target=\_blank}

--8<-- 'text/_disclaimers/third-party-content.md'
