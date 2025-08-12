---
title: Band Protocol Oracle
description: How to request data from a Band Protocol Oracle in your Moonbeam Ethereum DApp using smart contracts or JavaScript.
categories: Oracle Nodes
---

# Band Protocol Oracle

## Introduction {: #introduction } 
Developers have two ways to fetch prices from Band’s oracle infrastructure. On one hand, they can use Band’s smart contracts on Moonbeam. Doing so, they access data that is on-chain and is updated either at regular intervals or when price slippage is more than a target amount (different for each token). On the other hand, devs can use the JavaScript helper library, which uses an API endpoint to fetch the data using similar functions as those from the smart contracts, but this implementation bypasses the blockchain entirely.  This can be useful if your DApp front-end needs direct access to the data.

The Aggregator Contract address can be found in the following table:

|     Network    | |         Aggregator Contract Address        |
|:--------------:|-|:------------------------------------------:|
| Moonbase Alpha | | 0xDA7a001b254CD22e46d3eAB04d937489c93174C3 |

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Supported Token {: #supported-token } 
Price queries with any denomination are available as long as the base and quote symbols are supported (_base_/_quote_). For example:

 - `BTC/USD`
 - `BTC/ETH`
 - `ETH/EUR`

At the time of writing, the list of supported symbols can be found on the [Band Standard Dataset](https://data.bandprotocol.com){target=\_blank} page of the Band website. There are more than 146 price pairs available to query.

## Querying Prices {: #querying-prices } 
As stated before, developers can leverage two methods to query prices from Band's oracle: 

 - Band's smart contract on Moonbeam (deployed to Moonbase Alpha TestNet for now)
 - JavaScript helper library

## Get Data Using Smart Contracts {: #get-data-using-smart-contracts } 
Contracts can query on-chain data, such as token prices, from Band's oracle by implementing the interface of the `StdReference` contract, which exposes the `getReferenceData` and `getReferenceDataBulk` functions.

The first function, `getReferenceData`, takes two strings (the base and the quote symbol) as the inputs. The function queries the `StdReference` contract for the latest rates available for those two tokens. It returns a `ReferenceData` struct.

The `ReferenceData` struct has the following elements:

 - Rate: the exchange rate in terms of _base/quote_. The value returned is multiplied by 10<sup>18</sup>
 - Last updated base: the last time when the base price was updated (since UNIX epoch)
 - Last updated quote: the last time when the quoted price was updated (since UNIX epoch)
 
```js
struct ReferenceData {
  uint256 rate; 
  uint256 lastUpdatedBase; 
  uint256 lastUpdatedQuote;
}
```

The second function, `getReferenceDataBulk`, takes information as data arrays. For example, if you pass in `['BTC','BTC','ETH']` as base and `['USD','ETH','EUR']` as quote, the `ReferenceData`returned array contains the information regarding the following pairs:

 - `BTC/USD`
 - `BTC/ETH`
 - `ETH/EUR`

### Example Contract {: #example-contract } 

The following smart contract code provides some simple examples of the `StdReference` contract and the `getReferenceData` function - these are not meant for production. The `IStdReference.sol` interface defines ReferenceData structure and the functions available to make the queries.

```solidity
pragma solidity 0.6.11;
pragma experimental ABIEncoderV2;

interface IStdReference {
    /// A structure returned whenever someone requests for standard reference data.
    struct ReferenceData {
        uint256 rate; // base/quote exchange rate, multiplied by 1e18.
        uint256 lastUpdatedBase; // UNIX epoch of the last time when base price gets updated.
        uint256 lastUpdatedQuote; // UNIX epoch of the last time when quote price gets updated.
    }

    /// Returns the price data for the given base/quote pair. Revert if not available.
    function getReferenceData(string memory _base, string memory _quote)
        external
        view
        returns (ReferenceData memory);

    /// Similar to getReferenceData, but with multiple base/quote pairs at once.
    function getReferenceDataBulk(string[] memory _bases, string[] memory _quotes)
        external
        view
        returns (ReferenceData[] memory);
}
```

Next, you can use the following `DemoOracle` script. It provides four functions:

 - **getPrice**(*string[]* base, *string[]* quotes) - a _view_ function that queries a single base. In this example, the price of `BTC` quoted in `USD`
 - **getMultiPrices**(*string[]* bases, *string[]* quotes) - a _view_ function that queries multiple bases. In this example, the price of `BTC` and `ETH`, both quoted in `USD`
 - **savePrice**(*string* base, *string* quote) - a _public_ function that queries the _base/quote_ pair. Each element is provided as separate strings, for example `_base = "BTC", _quotes = "USD"`. This sends a transaction and modifies the `price` variable stored in the contract
 - **saveMultiPrices**(*string[]* bases, *string[]* quotes) - a _public_  function that queries each _base/quote_ pair. Each element is provided as a string array. For example, `_bases = ["BTC","ETH"], _quotes = ["USD","USD"]`. This sends a transaction and modifies the `prices` array stored in the contract, which will hold the price of each pair in the same order as specified in the input

 When deployed, the constructor function needs the Aggregator Contract address for the target network.

```solidity
pragma solidity 0.6.11;
pragma experimental ABIEncoderV2;

import "./IStdReference.sol";

contract DemoOracle {
    IStdReference ref;
    
    uint256 public price;
    uint256[] public pricesArr;

    constructor(IStdReference _ref) public {
        ref = _ref; // Aggregator Contract Address
                    // Moonbase Alpha 0xDA7a001b254CD22e46d3eAB04d937489c93174C3

    }

    function getPrice(string memory _base, string memory _quote) external view returns (uint256){
        IStdReference.ReferenceData memory data = ref.getReferenceData(_base,_quote);
        return data.rate;
    }

    function getMultiPrices(string[] memory _bases, string[] memory _quotes) external view returns (uint256[] memory){
        IStdReference.ReferenceData[] memory data = ref.getReferenceDataBulk(_bases,_quotes);

        uint256 len = _bases.length;
        uint256[] memory prices = new uint256[](len);
        for (uint256 i = 0; i < len; i++) {
            prices[i] = data[i].rate;
        }

        return prices;
    }
    
    function savePrice(string memory _base, string memory _quote) external {
        IStdReference.ReferenceData memory data = ref.getReferenceData(_base,_quote);
        price = data.rate;
    }
    
    function saveMultiPrices(
        string[] memory _bases,
        string[] memory _quotes
    ) public {
        require(_bases.length == _quotes.length, "BAD_INPUT_LENGTH");
        uint256 len = _bases.length;
        IStdReference.ReferenceData[] memory data = ref.getReferenceDataBulk(_bases,_quotes);
        delete pricesArr;
        for (uint256 i = 0; i < len; i++) {
            pricesArr.push(data[i].rate);
        }
        
    }
}
```

### Try it in Moonbase Alpha {: #try-it-in-moonbase alpha } 

There is predeployed contract available in the Moonbase Alpha TestNet (at address `0xf15c870344c1c02f5939a5C4926b7cDb90dEc655`) so you can easily check the information fed from Band Protocol's oracle. To do so, you need the following interface contract:

```solidity
pragma solidity 0.6.11;
pragma experimental ABIEncoderV2;

interface TestInterface {
    function getPrice(string memory _base, string memory _quote) external view returns (uint256);

    function getMultiPrices(string[] memory _bases, string[] memory _quotes) external view returns (uint256[] memory);
}
```

With it, you will have two view functions available - very similar to the previous examples:

 - **getPrice**(*string* base, *string* quote) - provides the price feed for a single base/quote pair that is given as input to the function, that is, "BTC", "USD"
 - **getMultiPrices**(*string[]* bases, *string[]* quotes) - provides the price feed for a multiple base/quote pairs that are given as input to the function, that is, ["BTC", "ETH", "ETH"], ["USD", "USD", "EUR"]

For example, using [Remix](/builders/ethereum/dev-env/remix/){target=\_blank}, you can easily query the `BTC/USD` price pair using this interface.

After creating the file and compiling the contract, head to the **Deploy and Run Transactions** tab, enter the contract address (`0xf15c870344c1c02f5939a5C4926b7cDb90dEc655`) and click on **At Address**. Make sure you have set the **ENVIRONMENT** to **Injected Web3** so you are connected to Moonbase Alpha. 

![Band Protocol Remix deploy](/images/builders/integrations/oracles/band/band-demo-1.webp)

This will create an instance of the demo contract that you can interact with. Use the functions `getPrice()` and `getMultiPrices()` to query the data of the corresponding pair.

![Band Protocol Remix check price](/images/builders/integrations/oracles/band/band-demo-2.webp)

## BandChain.js JavaScript Helper Library {: #bandchainjs-javascript-helper-library } 

The helper library also supports a similar `getReferenceData` function. To get started, the library needs to be installed:

```bash
npm install @bandprotocol/bandchain.js
```

The library provides a constructor function that requires an endpoint to point to. This returns an instance that then enables all the necessary methods, such as the `getReferenceData` function.  When querying for information, the function accepts an array where each element is the _base/quote_ pair needed. For example:

```text
getReferenceData(['BTC/USD', 'BTC/ETH', 'ETH/EUR'])
```

Then, it returns an array object with the following structure:

```js
[
  {
    pair: 'BTC/USD',
    rate: rate,
    updated: { base: lastUpdatedBase, quote: lastUpdatedQuote}
  },
  {
    pair: 'BTC/ETH',
    rate: rate,
    updated: { base: lastUpdatedBase, quote: lastUpdatedQuote}
  },
  {
    pair: 'ETH/EUR',
    rate: rate,
    updated: { base: lastUpdatedBase, quote: lastUpdatedQuote}
  },
]
```

Where `lastUpdatedBase` and `lastUpdatedQuote` are the last time when the base and quote prices were updated respectively (since UNIX epoch).

### Example Usage {: #example-usage } 

The following JavaScript script provides a simple example of the `getReferenceData` function.

```js
const BandChain = require('@bandprotocol/bandchain.js');

const queryData = async () => {
  const endpoint = 'https://poa-api.bandchain.org';

  const bandchain = new BandChain(endpoint);
  const dataQuery = await bandchain.getReferenceData([
    'BTC/USD',
    'BTC/ETH',
    'ETH/EUR',
  ]);
  console.log(dataQuery);
};

queryData();
```

You can execute this code with a node, and the following `dataQuery` output should look like this:

--8<-- 'code/builders/integrations/oracles/band/terminal/get-data.md'

Note that compared to the request done via smart contracts, the result is given directly in the correct units.

--8<-- 'text/_disclaimers/third-party-content.md'
