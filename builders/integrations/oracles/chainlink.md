---
title: Chainlink
description: How to use request data from a Chainlink Oracle in your Moonbeam Ethereum Dapp using smart contracts or JavaScript
---

# Chainlink Oracle

![Chainlink Moonbeam Banner](/images/builders/integrations/oracles/chainlink/chainlink-banner.png)

## Introduction {: #introduction } 

Developers can now use [Chainlink's decentralized Oracle network](https://chain.link/) to fetch data in the Moonbase Alpha TestNet and Moonriver. [Price Feeds](https://docs.chain.link/docs/architecture-decentralized-model) contain real-time price data that is continuously updated by Oracle operators in a smart contract so that other smart contracts can fetch and consume it. This guide will cover the available price feeds and how to fetch the latest price data on Moonriver. 

## Price Feeds {: #price-feeds } 

Before we go into fetching the data itself, it is important to understand the basics of price feeds.

In a standard configuration, each price feed is updated by a decentralized Oracle network. Each Oracle node is rewarded for publishing the price data to the Aggregator contract. The Aggregator contract receives periodic data updates from the network of oracles and aggregates and stores the data on-chain so that consumers can easily fetch it. However, the information is only updated if a minimum number of responses from Oracle nodes are received (during an aggregation round).

The end-user can retrieve price feeds with read-only operations via an Aggregator interface, or via a Consumer interface through the Proxy.

![Price Feed Diagram](/images/builders/integrations/oracles/chainlink/chainlink-price-feed.png)

## Fetch Price Data {: #fetch-price-data } 

There are Data Feed contracts available for both Moonbase Alpha and Moonriver to help simplify the process of requesting price feeds. In our current configuration for Moonbase Alpha, we are running only one Oracle node that fetches the price from a single API source. Price data is checked every minute and updated in the smart contracts every hour unless there is a price deviation of 1 %. The Moonriver Data Feed contracts are updated by multiple Chainlink nodes on a regular basis.

The data lives in a series of smart contracts (one per price feed) and can be fetched with the Aggregator interface:

```
pragma solidity ^0.8.0;

interface AggregatorV3Interface {
    /**
     * Returns the decimals to offset on the getLatestPrice call
     */
    function decimals() external view returns (uint8);

    /**
     * Returns the description of the underlying price feed aggregator
     */
    function description() external view returns (string memory);

    /**
     * Returns the version number representing the type of aggregator the proxy points to
     */
    function version() external view returns (uint256);

    /**
     * Returns price data about a specific round
     */
    function getRoundData(uint80 _roundId) external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);

    /**
     * Returns price data from the latest round
     */
    function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
}
```  

As seen above in the interface, there are five functions for fetching data: `decimal`, `description`, `version`, `getRoundData`, and `latestRoundData`.

Currently, there are Data Feed contracts for the the following price pairs:


=== "Moonriver"
    |  Base/Quote  |                      Data Feed Contract                      |
    |:------------:|:------------------------------------------------------------:|
    | 1INCH to USD | {{ networks.moonriver.chainlink.feed.aggregator.inch_usd }}  |
    | AAVE to USD  | {{ networks.moonriver.chainlink.feed.aggregator.aave_usd }}  |
    | ANKR to USD  | {{ networks.moonriver.chainlink.feed.aggregator.ankr_usd }}  |
    | AVAX to USD  | {{ networks.moonriver.chainlink.feed.aggregator.avax_usd }}  |
    |  AXS to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.axs_usd }}  |
    |  BNB to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.bnb_usd }}  |
    |  BTC to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.btc_usd }}  |
    | CAKE to USD  | {{ networks.moonriver.chainlink.feed.aggregator.cake_usd }}  |
    | COMP to USD  | {{ networks.moonriver.chainlink.feed.aggregator.comp_usd }}  |
    |  CRV to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.crv_usd }}  |
    |  DAI to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.dai_usd }}  |
    |  DOT to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.dot_usd }}  |
    |  ETH to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.eth_usd }}  |
    |  EUR to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.eur_usd }}  |
    | FRAX to USD  | {{ networks.moonriver.chainlink.feed.aggregator.frax_usd }}  |
    |  FTM to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.ftm_usd }}  |
    |  FXS to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.fxs_usd }}  |
    |  KSM to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.ksm_usd }}  |
    | LINK to USD  | {{ networks.moonriver.chainlink.feed.aggregator.link_usd }}  |
    | LUNA to USD  | {{ networks.moonriver.chainlink.feed.aggregator.luna_usd }}  |
    | MANA to USD  | {{ networks.moonriver.chainlink.feed.aggregator.mana_usd }}  |
    |  MIM to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.mim_usd }}  |
    |  MKR to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.mkr_usd }}  |
    | MOVR to USD  | {{ networks.moonriver.chainlink.feed.aggregator.movr_usd }}  |
    | SAND to USD  | {{ networks.moonriver.chainlink.feed.aggregator.sand_usd }}  |
    |  SNX to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.snx_usd }}  |
    | SUSHI to USD | {{ networks.moonriver.chainlink.feed.aggregator.sushi_usd }} |
    | THETA to USD | {{ networks.moonriver.chainlink.feed.aggregator.theta_usd }} |
    |  UNI to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.uni_usd }}  |
    | USDC to USD  | {{ networks.moonriver.chainlink.feed.aggregator.usdc_usd }}  |
    | USDT to USD  | {{ networks.moonriver.chainlink.feed.aggregator.usdt_usd }}  |
    |  XRP to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.xrp_usd }}  |
    |  YFI to USD  |  {{ networks.moonriver.chainlink.feed.aggregator.yfi_usd }}  |

=== "Moonbase Alpha"
    |  Base/Quote  |                     Data Feed Contract                      |
    |:------------:|:-----------------------------------------------------------:|
    |  BTC to USD  |  {{ networks.moonbase.chainlink.feed.aggregator.btc_usd }}  |
    |  ETH to USD  |  {{ networks.moonbase.chainlink.feed.aggregator.eth_usd }}  |
    |  DOT to USD  |  {{ networks.moonbase.chainlink.feed.aggregator.dot_usd }}  |
    |  KSM to USD  |  {{ networks.moonbase.chainlink.feed.aggregator.ksm_usd }}  |
    | AAVE to USD  | {{ networks.moonbase.chainlink.feed.aggregator.aave_usd }}  |
    | ALGO to USD  | {{ networks.moonbase.chainlink.feed.aggregator.algo_usd }}  |
    | BAND to USD  | {{ networks.moonbase.chainlink.feed.aggregator.band_usd }}  |
    | LINK to USD  | {{ networks.moonbase.chainlink.feed.aggregator.link_usd }}  |
    | SUSHI to USD | {{ networks.moonbase.chainlink.feed.aggregator.sushi_usd }} |
    |  UNI to USD  |  {{ networks.moonbase.chainlink.feed.aggregator.uni_usd }}  |

For example, you can use the Aggregator interface to fetch the price feed of `BTC to USD` using [Remix](https://remix.ethereum.org/). If you need help loading a contract into Remix, check out the [Using Remix](/builders/interact/remix/) page of the documentation site.

You will need to connect your MetaMask account to Remix, so make sure you have MetaMask installed and are connected to the Moonbase Alpha TestNet or Moonriver. To get help setting up MetaMask, check out the [Interacting with Moonbeam Using MetaMask](/tokens/connect/metamask/#install-the-metamask-extension) guide.

After creating the file and compiling the contract, you will need to follow these steps:

1. Head to the **Deploy and Run Transactions** tab
2. Set the **Environment** to **Injected Web3**
3. If your MetaMask is already connected it will appear in the **Account** selector. Otherwise, you will be prompted by MetaMask to select and connect your account(s)
4. Select the `AggregatorV3Interface` contract from the **Contract** dropdown
5. Enter the Data Feed contract address corresponding to `BTC to USD` in the **At Address** field and click the **At Address** button:

    === "Moonriver"
        ```
        {{ networks.moonriver.chainlink.feed.aggregator.btc_usd }}
        ```

    === "Moonbase Alpha"
        ```
        {{ networks.moonbase.chainlink.feed.aggregator.btc_usd }}
        ```

![Load the Chainlink Price Feed Aggregator Interface on Moonriver](/images/builders/integrations/oracles/chainlink/chainlink-1.png)

This will create an instance of the Aggregator interface that you can interact with and it will appear under the **Deployed Contracts** section in Remix. To get the latest price data you can follow these steps:

1. Expand the `AggregatorV3Interface` contract to reveal the available functions
2. Click `latestRoundData()` to query the data of the corresponding price feed, in this case BTC to USD

![Interact with the Chainlink Price Feed Aggregator Interface on Moonriver](/images/builders/integrations/oracles/chainlink/chainlink-2.png)

Note that to obtain the real price, you must account for the decimals of the price feed, available with the `decimals()` method.

If there is any specific pair you want us to include, feel free to reach out to us through our [Discord server](https://discord.com/invite/PfpUATX).

--8<-- 'text/disclaimers/third-party-content.md'