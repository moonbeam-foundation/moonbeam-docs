---
title: Chainlink
description: How to use request data from a Chainlink Oracle in your Moonbeam Ethereum Dapp using smart contracts or javascript
---
# Chainlink Oracle

![Chainlink Moonbeam Banner](/images/chainlink/chainlink-banner.png)

## Introduction

Developers can use now [Chainlink's decentralized Oracle network](https://chain.link/) to fetch data in the Moonbase Alpha TestNet. In this tutorial, we will show only the [Basic Request Model](https://docs.chain.link/docs/architecture-request-model), where the end-user sends a request to an Oracle provider, which fetches the data through an API, and fulfils the request storing this data on-chain.

## Basic Request Model

Before we go into fetching the data itself, it is important to understand the basics of the "basic request model". 

--8<-- 'chainlink/chainlink-brm.md'

## The Client Contract

The Client contract is the element that starts the communication with the Oracle by sending a request. As we saw on the diagram, it calls the _transferAndCall_ method from the LINK token contract, but there is more processing that is needed to track the request to the Oracle. For this example, you can use the code in [this file](/code-snippets/chainlink/Client.sol), and this deploy it on [Remix](/integrations/remix/) to try it out. Let's look at the core functions of the contract:

 - _constructor_: runs when the contract is deployed. Sets the address of the LINK token and the owner of the contract
 - _requestPrice_: it needs the Oracle contract address, the job ID, and the payment (in LINK) tokens to the fulfiller of the request. Builds the new request that is sent using the _sendChainlinkRequestTo_ function from the _ChainlinkClient.sol_ import
 - _fulfill_: callback used by the Oracle node to fulfill the request, by storing the queried information in the contract

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

If you want to skip the hurdles of deploying all the contracts, setting up your Oracle node, creating job IDs, and so on, we've got you covered. 

A custom Client contract on Moonbase Alpha that makes all requests to our Oracle contract, with a 0 LINK token payment, is available. These requests are fulfilled by an Oracle node we are running as well. You can try out with the following interface contract, with the custom Client contract deployed at `0x81f191eF90Fed48645FB846DFd7a6B8893fF5d56`:

```solidity
--8<-- 'chainlink/Interface.sol'
```

This provides two functions. `requestPrice()` only needs the job ID of the data you want to query. This function starts the chain of events explained before. `currentPrice()` is a view function that returns the latest price stored in the contract.

Currently, the Oracle node has a set of Job IDs for different price datas for the following pairs:

|  Base/Quote    |   |         Job ID Reference           |
|:--------------:|---|:----------------------------------:|
| BTC to USD     |   | 82f0d8b4be2143d49d6df4ff2edca4ac   |
| ETH to USD     |   | a75d59e194fd478fa36610f158f51825   |
| DOT to USD     |   | d2630d576c5c46f6a43160b439dc6ca1   |
| KSM to USD     |   | 54248318766e437c805c0ead4b6a9e38   |
| AAVE to USD    |   | f68bd048576d49c78104aad8ae9aac3b   |
| ALGO to USD    |   | 740f7dc8c10e44e4bc990bcf6302ebe4   |
| BAND to USD    |   | 390daa166024415a8ec4fc259f19bdf1   |
| LINK to USD    |   | 666722e8caff4ca1bcd61e312a3b4e6a   |
| SUSHI to USD   |   | 5be855d1f44542b89f8dd14321c4612d   |
| UNI to USD     |   | 8c490fd77c5742e4b6e4d6273800fa50   |

Let' go ahead and use the interface contract with the `BTC to USD` Job ID in [Remix](/integrations/remix/). 

After creating the file and compiling the contract, head to the "Deploy and Run Transactions" tab, enter the Client contract address and click on "At Address". Make sure you have set the "Environment" to "Injected Web3" so you are connected to Moonbase Alpha. This will create an instance of the Client contract that you can interact with. Use the function `requestPrice()` to query the data of the corresponding Job ID. Once the transaction is confirmed, we have to wait until the whole process we explained before happens. We can check the price using the view function `currentPrice()`.

![Chainlink on Moonbase Alpha](/images/chainlink/chainlink-image1.png)

If there is any specific pair you want us to include, feel free to reach out to us through our [Discord server](https://discord.com/invite/PfpUATX).

### Run your Client Contract

In case you want to run your Client contract, but use our Oracle node, you can do so with the following information:

|  Contract Type      |   |                     Address                  |
|:-------------------:|---|:--------------------------------------------:|
| Oracle Contract     |   | 0xCdF0FC59EE7d7901a10A56Ae6C8a8486CB4D70A5   |
| LINK Token          |   | 0xa36085F69e2889c224210F603D836748e7dC0088   |

Remember that the LINK token payment is set to zero.

## Other Requests

Chainlink's Oracles can tentatively provide many different types of data feeds with the use of external adapters. However, for simplicity, our Oracle node is configured to deliver only price feeds. 

If you are interested in running your own Oracle node in Moonbeam, please visit [this guide](/node-operators/oracles/node-chainlink/). Also, we recommend going through [Chainlink's documentation site](https://docs.chain.link/docs).

## We Want to Hear From You

If you have any feedback regarding implementing Chainlink on your project or any other Moonbeam related topic, feel free to reach out through our official development [Discord server](https://discord.com/invite/PfpUATX).