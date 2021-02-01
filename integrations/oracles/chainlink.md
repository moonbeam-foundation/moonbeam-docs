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

A custom Client contract on Moonbase Alpha that makes all requests to our Oracle contract, with a 0 LINK token payment, is available. These requests are fulfilled by an Oracle node we are running as well. You can try out with the following interface contract, with the custom Client contract deployed at `{{ networks.moonbase.chainlink.client_contract }}`:

```solidity
--8<-- 'chainlink/Interface.sol'
```

This provides two functions. `requestPrice()` only needs the job ID of the data you want to query. This function starts the chain of events explained before. `currentPrice()` is a view function that returns the latest price stored in the contract.

Currently, the Oracle node has a set of Job IDs for different price datas for the following pairs:

|  Base/Quote    |   |                Job ID Reference                 |
|:--------------:|---|:-----------------------------------------------:|
| BTC to USD     |   | {{ networks.moonbase.chainlink.basic.btc_usd }} |
| ETH to USD     |   | {{ networks.moonbase.chainlink.basic.eth_usd }} |
| DOT to USD     |   | {{ networks.moonbase.chainlink.basic.dot_usd }} |
| KSM to USD     |   | {{ networks.moonbase.chainlink.basic.ksm_usd }} |
| AAVE to USD    |   | {{ networks.moonbase.chainlink.basic.aave_usd }}|
| ALGO to USD    |   | {{ networks.moonbase.chainlink.basic.algo_usd }}|
| BAND to USD    |   | {{ networks.moonbase.chainlink.basic.band_usd }}|
| LINK to USD    |   | {{ networks.moonbase.chainlink.basic.link_usd }}|
| SUSHI to USD   |   |{{ networks.moonbase.chainlink.basic.sushi_usd }}|
| UNI to USD     |   | {{ networks.moonbase.chainlink.basic.uni_usd }} |

Let' go ahead and use the interface contract with the `BTC to USD` Job ID in [Remix](/integrations/remix/). 

After creating the file and compiling the contract, head to the "Deploy and Run Transactions" tab, enter the Client contract address and click on "At Address". Make sure you have set the "Environment" to "Injected Web3" so you are connected to Moonbase Alpha. This will create an instance of the Client contract that you can interact with. Use the function `requestPrice()` to query the data of the corresponding Job ID. Once the transaction is confirmed, we have to wait until the whole process we explained before happens. We can check the price using the view function `currentPrice()`.

![Chainlink on Moonbase Alpha](/images/chainlink/chainlink-image1.png)

If there is any specific pair you want us to include, feel free to reach out to us through our [Discord server](https://discord.com/invite/PfpUATX).

### Run your Client Contract

In case you want to run your Client contract, but use our Oracle node, you can do so with the following information:

|  Contract Type      |   |                    Address                      |
|:-------------------:|---|:-----------------------------------------------:|
| Oracle Contract     |   |{{ networks.moonbase.chainlink.oracle_contract }}|
| LINK Token          |   | {{ networks.moonbase.chainlink.link_contract }} |

Remember that the LINK token payment is set to zero.

## Other Requests

Chainlink's Oracles can tentatively provide many different types of data feeds with the use of external adapters. However, for simplicity, our Oracle node is configured to deliver only price feeds. 

If you are interested in running your own Oracle node in Moonbeam, please visit [this guide](/node-operators/oracles/node-chainlink/). Also, we recommend going through [Chainlink's documentation site](https://docs.chain.link/docs).

## Contact Us
If you have any feedback regarding implementing Chainlink on your project or any other Moonbeam related topic, feel free to reach out through our official development [Discord server](https://discord.com/invite/PfpUATX).