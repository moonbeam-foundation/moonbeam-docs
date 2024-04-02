---
title: Chainlink Oracle
description: Review price feed contracts for Moonbeam-based networks and learn how to request data from a Chainlink Oracle in your DApp using smart contracts or JavaScript. 
---

# Chainlink Oracle

## Introduction {: #introduction }

Developers can now use [Chainlink's decentralized Oracle network](https://chain.link/){target=\_blank} to fetch data from a Moonbeam-based network. There are two main architectures: [Price Feeds](https://docs.chain.link/docs/architecture-decentralized-model){target=\_blank} and [Basic Request Model](https://docs.chain.link/architecture-overview/architecture-request-model?parent=gettingStarted){target=\_blank}. Price Feeds contain real-time price data that is continuously updated by Oracle operators in a smart contract so that other smart contracts can fetch and consume it. The Basic Request Model describes an on-chain architecture for requesting data from a single oracle source. This guide will show you how to fetch the latest price data using both architectures.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Price Feeds {: #price-feeds }

Before going into fetching the data itself, it is important to understand the basics of price feeds.

In a standard configuration, each price feed is updated by a decentralized oracle network. Each oracle node is rewarded for publishing the price data to the [aggregator contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol){target=\_blank}. The aggregator contract receives periodic data updates from the network of oracles and aggregates and stores the data on-chain so that consumers can easily fetch it. However, the information is only updated if a minimum number of responses from oracle nodes are received (during an aggregation round).

The end-user can retrieve price feeds with read-only operations via an aggregator interface, or via a Consumer interface through the Proxy.

![Price Feed Diagram](/images/builders/integrations/oracles/chainlink/chainlink-price-feed.webp)

### Fetch Price Data {: #fetch-price-data }

There are data feed contracts available for Moonbeam-based networks to help simplify the process of requesting price feeds. In the current configuration for Moonbase Alpha, the Moonbeam team is running only one oracle node that fetches the price from a single API source. Price data is checked and updated in the smart contracts every 12 hours. As such, the price feeds on Moonbase Alpha are not authoritative and are for testing purposes only. The Moonbeam and Moonriver data feed contracts are updated by multiple Chainlink nodes on a regular basis.

The data lives in a series of smart contracts (one per price feed) and can be fetched with the aggregator interface:

```solidity
// SPDX-License-Identifier: MIT
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

As seen above in the interface, there are five functions for fetching data: `decimals`, `description`, `version`, `getRoundData`, and `latestRoundData`.

Currently, there are data feed contracts for [Moonbeam](https://docs.chain.link/docs/data-feeds-moonbeam/){target=\_blank}, [Moonriver](https://docs.chain.link/docs/data-feeds-moonriver/){target=\_blank}, and Moonbase Alpha for the following price pairs (proxy addresses):

=== "Moonbeam"
    | Base/Quote  |          Data Feed Contract  (Proxy Address)          |
    |:-----------:|:-----------------------------------------------------:|
    | ATOM to USD | {{ networks.moonbeam.chainlink.feed.proxy.atom_usd }} |
    | BNB to USD  | {{ networks.moonbeam.chainlink.feed.proxy.bnb_usd }}  |
    | BTC to USD  | {{ networks.moonbeam.chainlink.feed.proxy.btc_usd }}  |
    | DOT to USD  | {{ networks.moonbeam.chainlink.feed.proxy.dot_usd }}  |
    | ETH to USD  | {{ networks.moonbeam.chainlink.feed.proxy.eth_usd }}  |
    | FRAX to USD | {{ networks.moonbeam.chainlink.feed.proxy.frax_usd }} |
    | GLMR to USD | {{ networks.moonbeam.chainlink.feed.proxy.glmr_usd }} |
    | LINK to USD | {{ networks.moonbeam.chainlink.feed.proxy.link_usd }} |
    | USDC to USD | {{ networks.moonbeam.chainlink.feed.proxy.usdc_usd }} |

=== "Moonriver"
    |  Base/Quote  |           Data Feed Contract  (Proxy Address)           |
    |:------------:|:-------------------------------------------------------:|
    | 1INCH to USD | {{ networks.moonriver.chainlink.feed.proxy.inch_usd }}  |
    | AAVE to USD  | {{ networks.moonriver.chainlink.feed.proxy.aave_usd }}  |
    | ANKR to USD  | {{ networks.moonriver.chainlink.feed.proxy.ankr_usd }}  |
    | AVAX to USD  | {{ networks.moonriver.chainlink.feed.proxy.avax_usd }}  |
    |  AXS to USD  |  {{ networks.moonriver.chainlink.feed.proxy.axs_usd }}  |
    |  BNB to USD  |  {{ networks.moonriver.chainlink.feed.proxy.bnb_usd }}  |
    |  BTC to USD  |  {{ networks.moonriver.chainlink.feed.proxy.btc_usd }}  |
    | BUSD to USD  | {{ networks.moonriver.chainlink.feed.proxy.busd_usd }}  |
    | CAKE to USD  | {{ networks.moonriver.chainlink.feed.proxy.cake_usd }}  |
    | COMP to USD  | {{ networks.moonriver.chainlink.feed.proxy.comp_usd }}  |
    |  CRV to USD  |  {{ networks.moonriver.chainlink.feed.proxy.crv_usd }}  |
    |  DAI to USD  |  {{ networks.moonriver.chainlink.feed.proxy.dai_usd }}  |
    |  DOT to USD  |  {{ networks.moonriver.chainlink.feed.proxy.dot_usd }}  |
    |  ETH to USD  |  {{ networks.moonriver.chainlink.feed.proxy.eth_usd }}  |
    |  EUR to USD  |  {{ networks.moonriver.chainlink.feed.proxy.eur_usd }}  |
    | FRAX to USD  | {{ networks.moonriver.chainlink.feed.proxy.frax_usd }}  |
    |  FTM to USD  |  {{ networks.moonriver.chainlink.feed.proxy.ftm_usd }}  |
    |  FXS to USD  |  {{ networks.moonriver.chainlink.feed.proxy.fxs_usd }}  |
    |  KSM to USD  |  {{ networks.moonriver.chainlink.feed.proxy.ksm_usd }}  |
    | LINK to USD  | {{ networks.moonriver.chainlink.feed.proxy.link_usd }}  |
    | LUNA to USD  | {{ networks.moonriver.chainlink.feed.proxy.luna_usd }}  |
    | MANA to USD  | {{ networks.moonriver.chainlink.feed.proxy.mana_usd }}  |
    |  MIM to USD  |  {{ networks.moonriver.chainlink.feed.proxy.mim_usd }}  |
    |  MKR to USD  |  {{ networks.moonriver.chainlink.feed.proxy.mkr_usd }}  |
    | MOVR to USD  | {{ networks.moonriver.chainlink.feed.proxy.movr_usd }}  |
    | SAND to USD  | {{ networks.moonriver.chainlink.feed.proxy.sand_usd }}  |
    |  SNX to USD  |  {{ networks.moonriver.chainlink.feed.proxy.snx_usd }}  |
    | SUSHI to USD | {{ networks.moonriver.chainlink.feed.proxy.sushi_usd }} |
    | THETA to USD | {{ networks.moonriver.chainlink.feed.proxy.theta_usd }} |
    |  UNI to USD  |  {{ networks.moonriver.chainlink.feed.proxy.uni_usd }}  |
    | USDC to USD  | {{ networks.moonriver.chainlink.feed.proxy.usdc_usd }}  |
    | USDT to USD  | {{ networks.moonriver.chainlink.feed.proxy.usdt_usd }}  |
    |  XRP to USD  |  {{ networks.moonriver.chainlink.feed.proxy.xrp_usd }}  |
    |  YFI to USD  |  {{ networks.moonriver.chainlink.feed.proxy.yfi_usd }}  |

=== "Moonbase Alpha"
    |  Base/Quote  |          Data Feed Contract  (Proxy Address)           |
    |:------------:|:------------------------------------------------------:|
    | AAVE to USD  | {{ networks.moonbase.chainlink.feed.proxy.aave_usd }}  |
    | ALGO to USD  | {{ networks.moonbase.chainlink.feed.proxy.algo_usd }}  |
    | AVAX to USD  | {{ networks.moonbase.chainlink.feed.proxy.avax_usd }}  |
    | BAND to USD  | {{ networks.moonbase.chainlink.feed.proxy.band_usd }}  |
    |  BNB to USD  |  {{ networks.moonbase.chainlink.feed.proxy.bnb_usd }}  |
    |  BTC to USD  |  {{ networks.moonbase.chainlink.feed.proxy.btc_usd }}  |
    | COMP to USD  | {{ networks.moonbase.chainlink.feed.proxy.comp_usd }}  |
    |  CRV to USD  |  {{ networks.moonbase.chainlink.feed.proxy.crv_usd }}  |
    |  CVX to USD  |  {{ networks.moonbase.chainlink.feed.proxy.cvx_usd }}  |
    |  DAI to USD  |  {{ networks.moonbase.chainlink.feed.proxy.dai_usd }}  |
    |  DOT to USD  |  {{ networks.moonbase.chainlink.feed.proxy.dot_usd }}  |
    |  ETH to USD  |  {{ networks.moonbase.chainlink.feed.proxy.eth_usd }}  |
    | FRAX to USD  | {{ networks.moonbase.chainlink.feed.proxy.frax_usd }}  |
    |  FTM to USD  |  {{ networks.moonbase.chainlink.feed.proxy.ftm_usd }}  |
    | GLMR to USD  | {{ networks.moonbase.chainlink.feed.proxy.glmr_usd }}  |
    |  KSM to USD  |  {{ networks.moonbase.chainlink.feed.proxy.ksm_usd }}  |
    | LINK to USD  | {{ networks.moonbase.chainlink.feed.proxy.link_usd }}  |
    |  MKR to USD  |  {{ networks.moonbase.chainlink.feed.proxy.mkr_usd }}  |
    |  OP to USD   |  {{ networks.moonbase.chainlink.feed.proxy.op_usd }}   |
    | stETH to USD | {{ networks.moonbase.chainlink.feed.proxy.steth_usd }} |
    | SUSHI to USD | {{ networks.moonbase.chainlink.feed.proxy.sushi_usd }} |
    |  UNI to USD  |  {{ networks.moonbase.chainlink.feed.proxy.uni_usd }}  |
    | USDC to USD  | {{ networks.moonbase.chainlink.feed.proxy.usdc_usd }}  |
    | USDT to USD  | {{ networks.moonbase.chainlink.feed.proxy.usdt_usd }}  |
    |  YFI to USD  |  {{ networks.moonbase.chainlink.feed.proxy.yfi_usd }}  |

For example, you can use the aggregator interface to fetch the price feed of `BTC to USD` using [Remix](https://remix.ethereum.org/){target=\_blank}. If you need help loading a contract into Remix, check out the [Using Remix](/builders/build/eth-api/dev-env/remix/){target=\_blank} page of the documentation site.

You will need to connect your MetaMask account to Remix, so make sure you have MetaMask installed and are connected to the correct network. To get help setting up MetaMask, check out the [Interacting with Moonbeam Using MetaMask](/tokens/connect/metamask/#install-the-metamask-extension){target=\_blank} guide.

After creating the file and compiling the contract, you will need to follow these steps:

1. Head to the **Deploy and Run Transactions** tab
2. Set the **ENVIRONMENT** to **Injected Web3**
3. If your MetaMask is already connected it will appear in the **ACCOUNT** selector. Otherwise, you will be prompted by MetaMask to select and connect your account(s)
4. Select the `AggregatorV3Interface` contract from the **CONTRACT** dropdown
5. Enter the Data Feed contract address corresponding to `BTC to USD` in the **At Address** field and click the **At Address** button:

    === "Moonbeam"

        ```text
        {{ networks.moonbeam.chainlink.feed.proxy.btc_usd }}
        ```

    === "Moonriver"

        ```text
        {{ networks.moonriver.chainlink.feed.proxy.btc_usd }}
        ```

    === "Moonbase Alpha"

        ```text
        {{ networks.moonbase.chainlink.feed.proxy.btc_usd }}
        ```

![Load the Chainlink Price Feed Aggregator Interface on Moonriver](/images/builders/integrations/oracles/chainlink/chainlink-2.webp)

This will create an instance of the aggregator interface that you can interact with and it will appear under the **Deployed Contracts** section in Remix. To get the latest price data you can follow these steps:

1. Expand the `AggregatorV3Interface` contract to reveal the available functions
2. Click `latestRoundData()` to query the data of the corresponding price feed, in this case BTC to USD

![Interact with the Chainlink Price Feed Aggregator Interface on Moonriver](/images/builders/integrations/oracles/chainlink/chainlink-3.webp)

Note that to obtain the real price, you must account for the decimals of the price feed, available with the `decimals()` method.

If there is any specific pair you want to be included, feel free to reach out through [Discord](https://discord.com/invite/PfpUATX){target=\_blank}.

## Basic Request Model {: #basic-request-model }

--8<-- 'text/builders/integrations/oracles/chainlink/brm.md'

### Fetching Data {: #fetching-data }

There are a few ways you can get started fetching data from an oracle on Moonbeam:

- You can use the pre-deployed client contract, LINK token contract, and oracle contract that rely on the oracle node being run by Moonbeam
- You can create your own custom client contract instead of the pre-deployed client contract to be used with the Moonbeam oracle node
- You can create your own custom contracts and run your own oracle node

The pre-deployed contracts and oracle node run by Moonbeam support a limited set of job IDs that can be used to fetch price data for various asset pairs. If you need additional data, please refer to the [Create Custom Contracts using your own Oracle Node](#create-custom-contracts-using-your-own-oracle-node) section below to learn how to get started.

It's also important to note that the client contract must have a LINK tokens balance to be able to pay for requests. For the pre-deployed setup, the LINK value has been set to zero. If you deploy your own setup, you can also set the LINK value to zero in your `ChainlinkClient.sol` contract, and you can choose to deploy your own LINK token contract or use the pre-deployed one.

### Use Pre-deployed Contracts {: #use-pre-deployed-contracts }

If you want to skip the hurdles of deploying all contracts, setting up your oracle node, creating job IDs, and so on, you can use a custom client contract that has already been deployed to Moonbase Alpha. The contract makes all requests to an oracle contract that has also already been deployed, with a zero LINK token payment. These requests are fulfilled by an oracle node that is run by the Moonbeam team.

The client contract deployed on Moonbase Alpha is as follows:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.6/ChainlinkClient.sol";

/**
 * @title Client based in ChainlinkClient
 * @notice End users can deploy this contract to request the Prices from an Oracle
 */
contract Client is ChainlinkClient {
  // Stores the answer from the Chainlink oracle
  uint256 public currentPrice;
  address public owner;

  // Deploy with the address of the LINK token
  constructor(address _link) public {
    // Set the address for the LINK token for the network
    setChainlinkToken(_link);
    owner = msg.sender;
  }

  // Creates Chainlink Request
  function requestPrice(address _oracle, string memory _jobId, uint256 _payment) 
    public
    onlyOwner
  {
    // newRequest takes a JobID, a callback address, and callback function as input
    Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfill.selector);
    // Sends the request with the amount of payment specified to the oracle
    sendChainlinkRequestTo(_oracle, req, _payment);
  }

  // Callback function called by the Oracle when it has resolved the request
  function fulfill(bytes32 _requestId, uint256 _price)
    public
    recordChainlinkFulfillment(_requestId)
  {
    currentPrice = _price;
  }

  // Allows the owner to cancel an unfulfilled request
  function cancelRequest(
    bytes32 _requestId,
    uint256 _payment,
    bytes4 _callbackFunctionId,
    uint256 _expiration
  )
    public
  {
    cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
  }

  // Allows the owner to withdraw the LINK tokens in the contract to the address calling this function
  function withdrawLink()
    public
    onlyOwner
  {
    LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
    require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
  }

  // Decodes an input string in a bytes32 word
  function stringToBytes32(string memory _source)
    private
    pure
    returns (bytes32 result) 
  {
    bytes memory emptyStringTest = bytes(_source);
    if (emptyStringTest.length == 0) {
      return 0x0;
    }

    assembly { // solhint-disable-line no-inline-assembly
      result := mload(add(_source, 32))
    }

    return result;
  }

  // Reverts if the sender is not the owner of the contract
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
}
```

The core functions of the contract are as follows:

 - **`constructor`** -  runs when the contract is deployed. It sets the address of the LINK token and the owner of the contract
 - **`requestPrice`** - needs the oracle contract address, the job ID, and the payment (in LINK) tokens to the fulfiller of the request. Builds the new request that is sent using the `sendChainlinkRequestTo` function from the `ChainlinkClient.sol` import
 - **`fulfill`** - callback used by the oracle node to fulfill the request by storing the queried information in the contract

Note that the client contract must have a LINK tokens balance to be able to pay for this request. However, in this instance, the LINK value has been set to zero.

The client contract is deployed at `{{ networks.moonbase.chainlink.client_contract }}`. You can try interacting with the client contract by using following interface contract:


```solidity
// SPDX-License-Identifier: MIT
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

This provides two functions:

 - `requestPrice()` -  only needs the job ID of the data you want to query. This function starts the chain of events explained before.
 - `currentPrice()` is a view function that returns the latest price stored in the contract

Currently, the oracle node has a set of Job IDs for different price data for the following pairs:

|  Base/Quote  |                 Job ID Reference                  |
|:------------:|:-------------------------------------------------:|
| AAVE to USD  | {{ networks.moonbase.chainlink.basic.aave_usd }}  |
| ALGO to USD  | {{ networks.moonbase.chainlink.basic.algo_usd }}  |
| AVAX to USD  | {{ networks.moonbase.chainlink.basic.avax_usd }}  |
| BAND to USD  | {{ networks.moonbase.chainlink.basic.band_usd }}  |
|  BNB to USD  |  {{ networks.moonbase.chainlink.basic.bnb_usd }}  |
|  BTC to USD  |  {{ networks.moonbase.chainlink.basic.btc_usd }}  |
| COMP to USD  | {{ networks.moonbase.chainlink.basic.comp_usd }}  |
|  CRV to USD  |  {{ networks.moonbase.chainlink.basic.crv_usd }}  |
|  CVX to USD  |  {{ networks.moonbase.chainlink.basic.cvx_usd }}  |
|  DAI to USD  |  {{ networks.moonbase.chainlink.basic.dai_usd }}  |
|  DOT to USD  |  {{ networks.moonbase.chainlink.basic.dot_usd }}  |
|  ETH to USD  |  {{ networks.moonbase.chainlink.basic.eth_usd }}  |
| FRAX to USD  | {{ networks.moonbase.chainlink.basic.frax_usd }}  |
|  FTM to USD  |  {{ networks.moonbase.chainlink.basic.ftm_usd }}  |
|  KSM to USD  |  {{ networks.moonbase.chainlink.basic.ksm_usd }}  |
| LINK to USD  | {{ networks.moonbase.chainlink.basic.link_usd }}  |
|  MKR to USD  |  {{ networks.moonbase.chainlink.basic.mkr_usd }}  |
|  OP to USD   |  {{ networks.moonbase.chainlink.basic.op_usd }}   |
| stETH to USD | {{ networks.moonbase.chainlink.basic.steth_usd }} |
| SUSHI to USD | {{ networks.moonbase.chainlink.basic.sushi_usd }} |
|  UNI to USD  |  {{ networks.moonbase.chainlink.basic.uni_usd }}  |
| USDC to USD  | {{ networks.moonbase.chainlink.basic.usdc_usd }}  |
| USDT to USD  | {{ networks.moonbase.chainlink.basic.usdt_usd }}  |
|  YFI to USD  |  {{ networks.moonbase.chainlink.basic.yfi_usd }}  |

For this example, you can go ahead and use the interface contract with the `BTC to USD` job ID in [Remix](/builders/build/eth-api/dev-env/remix/){target=\_blank}. After creating the file and compiling the contract, you can take the following steps:

1. Head to the **Deploy and Run Transactions** tab
2. Make sure you have set the **ENVIRONMENT** to **Injected Web3**, and you have your MetaMask connected to Moonbase Alpha
3. Enter the client contract address, `{{ networks.moonbase.chainlink.client_contract }}`, and click on **At Address**. This will create an instance of the client contract that you can interact with
4. Under the **Deployed Contracts** section, use the `requestPrice()` function to query the data of the corresponding job ID
5. Confirm the transaction. You will have to wait until the whole request process that was previously explained occurs
6. You can then check the price using the view function, `currentPrice()`

![Chainlink Basic Request on Moonbase Alpha](/images/builders/integrations/oracles/chainlink/chainlink-1.webp)

If there is any specific pair you want to be included, feel free to reach out to the Moonbeam team through [Discord](https://discord.com/invite/PfpUATX){target=\_blank}.

### Create a Custom Client Contract {: #create-a-custom-client-contract }

If you want to run your own custom client contract but use the oracle node being run by Moonbeam, you can do so with the following information:

|  Contract Type  |                      Address                      |
|:---------------:|:-------------------------------------------------:|
| Oracle Contract | {{ networks.moonbase.chainlink.oracle_contract }} |
|   LINK Token    |  {{ networks.moonbase.chainlink.link_contract }}  |

If you decide to go this route, please keep in mind that the oracle node only supports the job IDs listed in the previous section. You'll only be able to access the pricing data for the supported pairs. If you need more functionality or want to use another API, please check out the [Create Custom Contracts using your own Oracle Node](#create-custom-contracts-using-your-own-oracle-node) section.

To build your own client contract using the `ChainlinkClient`, you'll need to start by importing the contract:

```solidity
import "https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.6/ChainlinkClient.sol";
```

You can checkout out the [Chainlink documentation on ChainlinkClient API Reference](https://docs.chain.link/docs/chainlink-framework/){target=\_blank} for more information.

Keep in mind that the LINK token payment is set to zero.

### Create Custom Contracts using your own Oracle Node {: #create-custom-contracts-using-your-own-oracle-node }

To get started with your own setup, including your own client contract, oracle contract, and oracle node, you'll need to start off running an oracle node. You can follow the [Run a Chainlink Oracle Node on Moonbeam](/node-operators/oracle-nodes/node-chainlink/){target=\_blank} guide to spin up your own oracle node. You'll also learn how to setup your oracle contract and create jobs.

If you [created a job to be used with any API](/node-operators/oracle-nodes/node-chainlink/#using-any-api){target=\_blank}, you can then create a client contract that sets the API endpoint URL to perform the GET request on.

Note that the client contract must have a LINK tokens balance to be able to pay for requests. Therefore, you will need to set the LINK value to zero in your `ChainlinkClient.sol` contract. You'll also need to make sure that your oracle node has a `MINIMUM_CONTRACT_PAYMENT` of `0`. You can verify that it has been set to zero by checking out the [**Configuration** section of your node](http://localhost:6688/config){target=\_blank}.

The following client contract is an example of how to use any API from within your client contract:

```solidity
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract Client is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    uint256 public volume;

    /**
    This example uses the LINK token address on Moonbase Alpha.
    Make sure to update the oracle and jobId.
    */
    constructor() {
        setChainlinkToken(address(0xa36085F69e2889c224210F603D836748e7dC0088));
        oracle = INSERT_YOUR_ORACLE_NODE_ADDRESS;
        jobId = "INSERT_YOUR_JOB_ID";
        fee = 0;
    }

    /**
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     */
    function requestVolumeData() public returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);

        // Set the URL to perform the GET request on
        request.add("get", "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD");

        // Set the path to find the desired data in the API response, where the response format is:
        // {"RAW":
        //   {"ETH":
        //    {"USD":
        //     {
        //      "VOLUME24HOUR": xxx.xxx,
        //     }
        //    }
        //   }
        //  }
        request.add("path", "RAW.ETH.USD.VOLUME24HOUR");

        // Multiply the result by 1000000000000000000 to remove decimals
        int timesAmount = 10**18;
        request.addInt("times", timesAmount);

        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    /**
     * Receive the response in the form of uint256
     */ 
    function fulfill(bytes32 _requestId, uint256 _volume) public recordChainlinkFulfillment(_requestId)
    {
        volume = _volume;
    }
}
```

!!! note
    The above example uses the pre-deployed LINK token contract address. You also have the option of deploying your own LINK token contract and using that instead.

Once you've deployed the contract on Remix, you can begin to request the volume data. After you make a request, you can check the status of the job by going to the [**Jobs** section of your node](http://localhost:6688/jobs){target=\_blank}.

--8<-- 'text/_disclaimers/third-party-content.md'
