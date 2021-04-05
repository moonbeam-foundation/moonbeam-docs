---
title: Chainlink
description: How to use request data from a Chainlink Oracle in your Moonbeam Ethereum Dapp using smart contracts or Javascript
---

# Chainlink Oracle

![Chainlink Moonbeam Banner](/images/chainlink/chainlink-banner.png)

## Introduction

Developers can now use [Chainlink's decentralized Oracle network](https://chain.link/) to fetch data in the Moonbase Alpha TestNet. This tutorial goes through two different ways of using Chainlink Oracles:

 - [Basic Request Model](https://docs.chain.link/docs/architecture-request-model), where the end-user sends a request to an Oracle provider, which fetches the data through an API, and fulfils the request storing this data on-chain
 - [Price Feeds](https://docs.chain.link/docs/architecture-decentralized-model), where data is continuously updated by Oracle operators in a smart contract so that other smart contracts can fetch it

## Basic Request Model

Before we go into fetching the data itself, it is important to understand the basics of the "basic request model."

--8<-- 'text/chainlink/chainlink-brm.md'

### The Client Contract

The Client contract is the element that starts the communication with the Oracle by sending a request. As shown in the diagram, it calls the _transferAndCall_ method from the LINK token contract, but there is more processing that is needed to track the request to the Oracle. For this example, you can use the code in [this file](/snippets/code/chainlink/Client.sol), and deploy it on [Remix](/integrations/remix/) to try it out. Let's look at the core functions of the contract:

 - _constructor_: runs when the contract is deployed. It sets the address of the LINK token and the owner of the contract
 - _requestPrice_: needs the Oracle contract address, the job ID, and the payment (in LINK) tokens to the fulfiller of the request. Builds the new request that is sent using the _sendChainlinkRequestTo_ function from the _ChainlinkClient.sol_ import
 - _fulfill_: callback used by the Oracle node to fulfill the request by storing the queried information in the contract

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

  //... there is more code here
}
```

Note that the Client contract must have a LINK tokens balance to be able to pay for this request. However, if you deploy your setup, you can set the LINK value to 0 in your `ChainlinkClient.sol` contract, but you still need to have the LINK token contract deployed.

### Try it on Moonbase Alpha

If you want to skip the hurdles of deploying all contracts, setting up your Oracle node, creating job IDs, and so on, we've got you covered.

A custom Client contract on Moonbase Alpha that makes all requests to our Oracle contract, with a 0 LINK token payment, is available. These requests are fulfilled by an Oracle node that we are running. You can try it out with the following interface contract and the custom Client contract deployed at `{{ networks.moonbase.chainlink.client_contract }}`:

```solidity
pragma solidity ^0.6.6;

/**
 * @title Simple Interface to interact with Universal Client Contract
 * @notice Client Address {{ networks.moonbase.chainlink.client_contract }}
 */
interface ChainlinkInterface {

  /**
   * @notice Creates a Chainlink request with the job specification ID,
   * @notice and sends it to the Oracle.
   * @notice _oracle The address of the Oracle contract fixed top
   * @notice _payment For this example the PAYMENT is set to zero
   * @param _jobId The job spec ID that we want to call in string format
   */
    function requestPrice(string calldata _jobId) external;

    function currentPrice() external view returns (uint);

}
```

This provides two functions. `requestPrice()` only needs the job ID of the data you want to query. This function starts the chain of events explained before. `currentPrice()` is a view function that returns the latest price stored in the contract.

Currently, the Oracle node has a set of Job IDs for different price datas for the following pairs:

|  Base/Quote  |     |                 Job ID Reference                  |
| :----------: | --- | :-----------------------------------------------: |
|  BTC to USD  |     |  {{ networks.moonbase.chainlink.basic.btc_usd }}  |
|  ETH to USD  |     |  {{ networks.moonbase.chainlink.basic.eth_usd }}  |
|  DOT to USD  |     |  {{ networks.moonbase.chainlink.basic.dot_usd }}  |
|  KSM to USD  |     |  {{ networks.moonbase.chainlink.basic.ksm_usd }}  |
| AAVE to USD  |     | {{ networks.moonbase.chainlink.basic.aave_usd }}  |
| ALGO to USD  |     | {{ networks.moonbase.chainlink.basic.algo_usd }}  |
| BAND to USD  |     | {{ networks.moonbase.chainlink.basic.band_usd }}  |
| LINK to USD  |     | {{ networks.moonbase.chainlink.basic.link_usd }}  |
| SUSHI to USD |     | {{ networks.moonbase.chainlink.basic.sushi_usd }} |
|  UNI to USD  |     |  {{ networks.moonbase.chainlink.basic.uni_usd }}  |

Let's go ahead and use the interface contract with the `BTC to USD` Job ID in [Remix](/integrations/remix/).

After creating the file and compiling the contract, head to the "Deploy and Run Transactions" tab, enter the Client contract address, and click on "At Address." Make sure you have set the "Environment" to "Injected Web3" so you are connected to Moonbase Alpha. This will create an instance of the Client contract that you can interact with. Use the function `requestPrice()` to query the data of the corresponding Job ID. Once the transaction is confirmed, we have to wait until the whole process explained before occurs. We can check the price using the view function `currentPrice()`.

![Chainlink Basic Request on Moonbase Alpha](/images/chainlink/chainlink-image1.png)

If there is any specific pair you want us to include, feel free to reach out to us through our [Discord server](https://discord.com/invite/PfpUATX).

### Run your Client Contract

If you want to run your Client contract but use our Oracle node, you can do so with the following information:

|  Contract Type  |     |                      Address                      |
| :-------------: | --- | :-----------------------------------------------: |
| Oracle Contract |     | {{ networks.moonbase.chainlink.oracle_contract }} |
|   LINK Token    |     |  {{ networks.moonbase.chainlink.link_contract }}  |

Remember that the LINK token payment is set to zero.

### Other Requests

Chainlink's Oracles can tentatively provide many different types of data feeds with the use of external adapters. However, for simplicity, our Oracle node is configured to deliver only price feeds.

If you are interested in running your own Oracle node in Moonbeam, please visit [this guide](/node-operators/oracles/node-chainlink/). Also, we recommend going through [Chainlink's documentation site](https://docs.chain.link/docs).

## Price Feeds

Before we go into fetching the data itself, it is important to understand the basics of price feeds.

In a standard configuration, each price feed is updated by a decentralized Oracle network. Each Oracle node is rewarded for publishing the price data to the Aggregator contract. However, the information is only updated if a minimum number of responses from Oracle nodes are received (during an aggregation round).

The end-user can retrieve price feeds with read-only operations via a Consumer contract, referencing the correct Aggregator interface (Proxy contract). The Proxy acts as a middleware to provide the Consumer with the most up-to-date Aggregator for a particular price feed.

![Price Feed Diagram](/images/chainlink/chainlink-pricefeed.png)

### Try it on Moonbase Alpha

If you want to skip the hurdles of deploying all the contracts, setting up your Oracle node, creating job IDs, and so on, we've got you covered.

We've deployed all the necessary contracts on Moonbase Alpha to simplify the process of requesting price feeds. In our current configuration, we are running only one Oracle node that fetches the price from a single API source. Price data is checked every minute and updated in the smart contracts every hour unless there is a price deviation of 1 %.

The data lives in a series of smart contracts (one per price feed) and can be fetched with the following interface:

```solidity
pragma solidity ^0.6.6;

interface ConsumerV3Interface {
    /**
     * Returns the latest price
     */
    function getLatestPrice() external view returns (int);

    /**
     * Returns the decimals to offset on the getLatestPrice call
     */
    function decimals() external view returns (uint8);

    /**
     * Returns the description of the underlying price feed aggregator
     */
    function description() external view returns (string memory);
}
```

This provides three functions. `getLatestPrice()` will read the latest price data available in the Aggregator contract via the Proxy. We've added the `decimals()` function, which returns the number of decimals of the data and the `description()` function, which returns a brief description of the price feed available in the Aggregator contract being queried.

Currently, there is an Consumer contract for the the following price pairs:

|  Base/Quote  |     |                     Consumer Contract                     |
| :----------: | --- | :-------------------------------------------------------: |
|  BTC to USD  |     |  {{ networks.moonbase.chainlink.feed.consumer.btc_usd }}  |
|  ETH to USD  |     |  {{ networks.moonbase.chainlink.feed.consumer.eth_usd }}  |
|  DOT to USD  |     |  {{ networks.moonbase.chainlink.feed.consumer.dot_usd }}  |
|  KSM to USD  |     |  {{ networks.moonbase.chainlink.feed.consumer.ksm_usd }}  |
| AAVE to USD  |     | {{ networks.moonbase.chainlink.feed.consumer.aave_usd }}  |
| ALGO to USD  |     | {{ networks.moonbase.chainlink.feed.consumer.algo_usd }}  |
| BAND to USD  |     | {{ networks.moonbase.chainlink.feed.consumer.band_usd }}  |
| LINK to USD  |     | {{ networks.moonbase.chainlink.feed.consumer.link_usd }}  |
| SUSHI to USD |     | {{ networks.moonbase.chainlink.feed.consumer.sushi_usd }} |
|  UNI to USD  |     |  {{ networks.moonbase.chainlink.feed.consumer.uni_usd }}  |

Let's go ahead and use the interface contract to fetch the price feed of `BTC to USD` using [Remix](/integrations/remix/).

After creating the file and compiling the contract, head to the "Deploy and Run Transactions" tab, enter the Consumer contract address corresponding to `BTC to USD`, and click on "At Address." Make sure you have set the "Environment" to "Injected Web3" so you are connected to Moonbase Alpha.

This will create an instance of the Consumer contract that you can interact with. Use the function `getLatestPrice()` to query the data of the corresponding price feed.

![Chainlink Price Feeds on Moonbase Alpha](/images/chainlink/chainlink-image2.png)

Note that to obtain the real price, you must account for the decimals of the price feed, available with the `decimals()` method.

If there is any specific pair you want us to include, feel free to reach out to us through our [Discord server](https://discord.com/invite/PfpUATX).

## We Want to Hear From You

If you have any feedback regarding implementing Chainlink on your project or any other Moonbeam-related topic, feel free to reach out through our official development [Discord server](https://discord.com/invite/PfpUATX).
