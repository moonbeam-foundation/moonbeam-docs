---
title: Chainlink
description: How to use request data from a Chainlink Oracle in your Moonbeam Ethereum Dapp using smart contracts or javascript
---
# Chainlink Oracle

![Chainlink Moonbeam Banner](/images/chainlink/chainlink-diagram.png)

## Introduction

Developers can use now [Chainlink's decentralized Oracle network](https://chain.link/) to fetch data in the Moonbase Alpha TestNet. In this tutorial, we will show only the [Basic Request Model](https://docs.chain.link/docs/architecture-request-model), where the end-user sends a request to an oracle provider, which fetches the data through an API, and fulfils the request storing this data on-chain.

## Basic Request Model

Before we go into fetching the data itself, it is important to understand the basics of the "basic request model". An oracle node has a set of job IDs, where each corresponds to a task that can be requested by a user, for example, fetch a price feed. To do so, the user needs to send a request through a contract, we'll name it the _Client_ contract, passing in the following information:

 - Oracle address: address of the contract deployed by the oracle node
 - Job ID: task to be executed
 - Payment: payment in LINK tokens that the oracle will receive for fulfiling the request

This request actually sends a _transferAndCall_ to the LINK token contract, which handles the payment and relays the request to the oracle contract. Here, an event is emited with the request, which is picked up by the oracle node. Next, the node fetches the necessary data and executes the _fulfilOracleRequest_ function, which executes a callback that stores the requested information in the Client contract. The following diagram explains this workflow.

![Basic Request Diagram](/images/chainlink/chainlink-basicrequest.png)

## The Client Contract

The Client contract is the element that starts the communication with the Oracle by sending a request. As we saw on the diagram, it calls the _transferAndCall_ method from the LINK token contract, but there is more processing that is needed to track the request to the Oracle. For this example, you can use the code in [this file](/code-snippets/chainlink/Client.sol), and this deploy it on [Remix](/integrations/remix/) to try it out. Let's look at the core functions of the contract:

 - _constructor_: runs when the contract is deployed. Sets the address of the LINK token and the owner of the contract
 - _requestPrice_: it needs the oracle contract address, the job ID, and the payment (in LINK) tokens to the fulfiller of the request. Builds the new request that is sent using the _sendChainlinkRequestTo_ function from the _ChainlinkClient.sol_ import
 - _fulfill_: callback used by the oracle node to fulfill the request, by storing the queried information in the contract

```solidity
pragma solidity ^0.6.6;

import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.6/ChainlinkClient.sol";

contract Client is ChainlinkClient {
  //... there is mode code here
  
  constructor(address _link) public {
    // Set the address for the LINK token for the network
    setChainlinkToken(_link);
    owner = msg.sender;
  }

  function requestPrice(address _oracle, string memory _jobId, uint256 _payment) 
    public
    onlyOwner
  {
    // newRequest takes a JobID, a callback address, and callback function as input
    Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfill.selector);
    // Sends the request with the amount of payment specified to the oracle
    sendChainlinkRequestTo(_oracle, req, _payment);
  }

  function fulfill(bytes32 _requestId, uint256 _price)
    public
    recordChainlinkFulfillment(_requestId)
  {
    currentPrice = _price;
  }

  //... there is mode code here
}
```

Note that the Client contract must have LINK tokens balance to be able to pay for this request. However, if you deploy your setup, you can set the LINK value to 0 in your `ChainlinkClient.sol` contract, but you still need to have the LINK token contract deployed.

## Try it on Moonbase Alpha

If you want to skip the hurdles of deploying all the contracts, setting up your oracle node, creating job IDs, and so on, we've got you covered. 

A custom Client contract on Moonbase Alpha that makes all requests to our oracle contract, with a 0 LINK token payment, is available. These requests are fulfilled by an oracle node we are running as well. You can try out with the following interface contract, with the custom Client contract deployed at `0xbaCbF0EFeDB9fBC2736bfb1B2AC936557dd33A8B`:

```solidity
--8<-- 'chainlink/Interface.sol'
```

This provides two functions. `requestPrice()` only needs the job ID of the data you want to query. This function starts the chain of events explained before. `currentPrice()` is a view function that returns the latest price stored in the contract.

Currently, the oracle node has a set of job IDs for different price datas for the following pairs:

|  Base/Quote    |   |         Job ID Reference           |
|:--------------:|---|:----------------------------------:|
| BTC to USD     |   | fcf5bbf903a24db4995412a0034e355e   |
| ETH to USD     |   | c5b3864c5fa74c199d82aeafbd6990e9   |
| DOT to USD     |   | b08c567a990a499fb2a76b580d51f481   |
| KSM to USD     |   | 5ea60c08ece248d6bc4bb04e9c723a9b   |
| Aave to USD    |   | 1aa6d16fe267469ebc354522e9efc07d   |
| ALGO to USD    |   | bcee95ed927d4bd081db4873dbc52b91   |
| BAND to USD    |   | c86806a16c8040bab941fa4bd7118674   |
| LINK to USD    |   | d5668f1900d74b2489a406eb77f8ba25   |
| SUSHI to USD   |   | 4869fcd0c69649a8ad93414dbb0c8789   |
| UNI to USD     |   | 3e12c3a8513541c69ef615313a116a8e   |

If there is any specific pair you want us to include, feel free to reach out to us through our [Discord server](https://discord.com/invite/PfpUATX).

### Run your Client Contract

In case you want to run your own Client contract, but use our oracle node, you can do so with the following information:

|  Contract Type      |   |                     Address                  |
|:-------------------:|---|:--------------------------------------------:|
| Oracle Contract     |   | 0xe30570257Af0F35F66d6798F75F34DD56dFa4EFC   |
| LINK Token          |   | 0x2B13000735C0fC878673732Ee9bF8Ba5d76F7EC9   |

Remember that the LINK token payment is set to zero.


## Other Requests

Chainlink's oracles can tentatively provide many different types of data feeds with the use of external adapters. However, for simplicity, our oracle node is configured to deliver only price feeds. 

If you are interested in running you own oracle node in Moonbeam, please visit [this guide TODO](). Also, we recommend going through [Chainlink's documentation site](https://docs.chain.link/docs).

## Contact Us
If you have any feedback regarding implementing Chainlink on your project, or any other Moonbeam related topic, feel free to reach out through our official development [Discord server](https://discord.com/invite/PfpUATX).