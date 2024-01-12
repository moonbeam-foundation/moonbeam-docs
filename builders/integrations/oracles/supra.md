---
title: Supra Oracle
description: Supra's Pull Oracle provides low latency, on-demand price feed updates for a variety of use cases. Learn how to integrate Supra's oracle on the Moonbeam Network.
---

# Supra 

[Supra](https://supraoracles.com) is a novel, high-throughput Oracle & IntraLayer: A vertically integrated toolkit of cross-chain solutions (data oracles, asset bridges, automation network, and more) that interlink all blockchains, public (L1s and L2s) or private (enterprises).

## Introduction {: #introduction }

Supra provides decentralized oracle price feeds that can be used for on-chain and off-chain use-cases such as spot and perpetual DEXes, lending protocols, and payments protocols. Supra’s oracle chain and consensus algorithm makes it one of the fastest-to-finality oracle provider, with layer-1 security guarantees. The pull oracle has a sub-second response time. Aside from speed and security, Supra’s rotating node architecture gathers data from 40+ data sources and applies a robust calculation methodology to get the most accurate value. The node provenance on the data dashboard also provides a fully transparent historical audit trail. Supra’s Distributed Oracle Agreement (DORA) paper was accepted into ICDCS 2023, the oldest distributed systems conference.

Check out our developer docs [here](https://supraoracles.com/docs/overview/).


## Price Feeds {: #price-feeds }

Our Pull model uses a combination of Web2 and Web3 methods to achieve ultra-low latency when sending data from Supra to the destination chain.  Web2 methods are used to retrieve data from Supra, while Web3 smart contracts are utilized for cryptographic verification.  
Please refer to the below resources for a better understanding of our price feeds.
[Data Feeds](https://supraoracles.com/docs/price-feeds/) - This explains how Supra calculates the S-Value for data feeds. 
[Data Feeds Catalog](https://supraoracles.com/docs/price-feeds/data-feeds-index/) - This provides a list of data feeds currently offered by Supra.
[Available Networks](https://supraoracles.com/docs/price-feeds/pull-model/networks/) - Available networks and Supra contract addresses.

### Example Implementation

## Step 1: 

Create The S-Value Pull Interface to verify the price data received.
Add the following code to the solidity smart contract that you wish to retrieve an S-Value.

```
// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

interface ISupraOraclePull {

    //Verified price data
    struct PriceData {
        // List of pairs
        uint256[] pairs;
        // List of prices
        // prices[i] is the price of pairs[i]
        uint256[] prices;
        // List of decimals
        // decimals[i] is the decimals of pairs[i]
        uint256[] decimals;
    }


function verifyOracleProof(bytes calldata _bytesproof) 
    external 
    returns (PriceData memory);
}
```  
This creates the interface that you will later apply in order to verify and fetch S-Values from Supra's Pull Contract.

## Step 2: 

Configure The S-Value Feed Address

To verify and fetch the S-Value from a Supra Pull smart contract, first find the S-Value Pull Contract address for the Moonbeam Network. When you have the address, create an instance of the ISupraOraclePull using the interface we previously defined:

```
// Mock contract which can consume oracle pull data
contract MockOracleClient {
    // The oracle contract
    ISupraOraclePull internal oracle;

    // Event emitted when a pair price is received
    event PairPrice(uint256 pair, uint256 price, uint256 decimals);

    constructor(address oracle_) {
        oracle = ISupraOraclePull(oracle_);
    }
}
```

## Step 3: 

Receive and Verify the S-Value

Next, copy the following code to the smart contract to verify the price data received: 

```
// Get the price of a pair from oracle data received from supra pull model
  
    function GetPairPrice(bytes calldata _bytesProof, uint256 pair) external                 
    returns(uint256){
        ISupraOraclePull.PriceData memory prices = 
        oracle.verifyOracleProof(_bytesProof);
        uint256 price = 0;
        uint256 decimals = 0;
        for (uint256 i = 0; i < prices.pairs.length; i++) {
            if (prices.pairs[i] == pair) {
                price = prices.prices[i];
                decimals = prices.decimals[i];
                break;
            }
        }
        require(price != 0, "Pair not found");
        return price;
    }
```

Thats it. Done! 

Now you are ready to consume fast, low latency, and highly accurate data from Supra's Pull oracle.

## Recommended Best Practices

Create a function with access control that updates the oracle using the function: updatePullAddress()

This will allow you to update the address of the Supra Pull contract after deployment, allowing you to future proof your contract. Access control is mandatory to prevent the undesired modification of the address.

```
function updatePullAddress(SupraOraclePull oracle_) 
    external 
    onlyOwner {
        oracle = oracle_;
    }
```

## Connect with us!

Still looking for answers? We got them! Check out all the ways you can reach us:

* Visit us at [supraoracles.com](https://supraoracles.com)
* Read our [Docs](https://supraoracles.com/docs/overview)
* Chat with us on [Telegram](https://t.me/SupraOracles)
* Follow us on [Twitter](https://twitter.com/SupraOracles)
* Join our [Discord](https://discord.gg/supraoracles)
* Check us out on [Youtube](https://www.youtube.com/SupraOfficial)


## Example Implementation

Here's an example of what your implementation should look like:

```
// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ISupraOraclePull {
    
    //Verified price data
    struct PriceData {
        // List of pairs
        uint256[] pairs;
        // List of prices
        // prices[i] is the price of pairs[i]
        uint256[] prices;
        // List of decimals
        // decimals[i] is the decimals of pairs[i]
        uint256[] decimals;
    }

    function verifyOracleProof(bytes calldata _bytesProof) 
    external 
    returns (PriceData memory);
}


// Mock contract which can consume oracle pull data
contract MockOracleClient is Ownable {
    //The oracle contract
    ISupraOraclePull public oracle;

    //Event emitted when a pair price is received
    event PairPrice(uint256 pair, uint256 price, uint256 decimals);

    constructor(ISupraOraclePull oracle_) {
        oracle = oracle_;
 }

// Get the price of a pair from oracle data
    function GetPairPrice(bytes calldata _bytesProof, uint256 pair) external                 
    returns(uint256){
        ISupraOraclePull.PriceData memory prices = 
        oracle.verifyOracleProof(_bytesProof);
        uint256 price = 0;
        uint256 decimals = 0;
        for (uint256 i = 0; i < prices.pairs.length; i++) {
            if (prices.pairs[i] == pair) {
                price = prices.prices[i];
                decimals = prices.decimals[i];
                break;
            }
        }
        require(price != 0, "Pair not found");
        return price;
    }

    function updatePullAddress(ISupraOraclePull oracle_) 
    external 
    onlyOwner {
        oracle = oracle_;
    }
}
```