---
title: Razor Network Oracle
description: How to request data from a Razor Network Oracle in your Moonbeam Ethereum DApp using smart contracts.
---

# Razor Network Oracle

## Introduction {: #introduction }

Developers can now fetch prices from Razor Network’s oracle using a Bridge contract deployed on the Moonbase Alpha TestNet. This Bridge acts as middleware, and events emitted by it are fetched by the Razor Network's oracle infrastructure, sending prices to the Bridge contract.

To access these price feeds, you need to interact with the Bridge contract address, which can be found in the following table:

|    Network     |              Contract Address              |
|:--------------:|:------------------------------------------:|
| Moonbase Alpha | 0x53f7660Ea48289B5DA42f1d79Eb9d4F5eB83D3BE |

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Jobs {: #jobs }

Each data-feed has a Job ID attached to it. For example:

| Job ID | Underlying Price [USD] |
|:------:|:----------------------:|
|   1    |          ETH           |
|   2    |          BTC           |
|   3    |    Microsoft Stocks    |

You can check Job IDs for each data-feed on the [Razor Network Explorer](https://razorscan.io/#/custom){target=_blank}. Price feeds are updated every 5 minutes. More information can be found in [Razor's documentation website](https://docs.razor.network/){target=_blank}.

## Get Data From Bridge Contract {: #get-data-from-bridge-contract }

Contracts can query on-chain data such as token prices, from Razor Network's oracle by implementing the interface of the Bridge contract, which exposes the `getResult` and `getJob` functions.

```solidity
pragma solidity 0.6.11;

interface Razor {
    
    function getResult(uint256 id) external view returns (uint256);
    
    function getJob(uint256 id) external view returns(string memory url, string memory selector, string memory name, bool repeat, uint256 result);
}
```

The first function, `getResult`, takes the Job ID associated with the data-feed and fetches the price. For example, if you pass in `1`, you will receive the price of the data-feed related to the Job ID.

The second function, `getJob`, takes the Job ID associated with the data-feed and fetches the general information regarding the data-feed, such as the name of the data-feed, the price, and the URL being used to fetch the prices.

### Example Contract {: #example-contract }

There is a predeployed bridge contract in the Moonbase Alpha TestNet (at address `{{ networks.moonbase.razor.bridge_address }}`) so you can quickly check the information fed from Razor Network's oracle.

The only requirement is the Bridge interface, which defines `getResult` structure and makes the functions available to the contract for queries.

You can use the following `Demo` contract. It provides various functions:

 - **fetchPrice** - a _view_ function that queries a single Job ID. For example, to fetch the price of `ETH` in `USD`, you will need to send the Job ID `1`
 - **fetchMultiPrices** - a _view_ function that queries multiple Job IDs. For example, to fetch the price of `ETH` and `BTC` in `USD`, you will need to send the Job IDs `[1,2]`
 - **savePrice** - a _public_ function that queries a single Job ID. This sends a transaction and modifies the `price` variable stored in the contract.
 - **saveMultiPrices** - a _public_ function that queries multiple Job IDs. For example, to fetch the price of `ETH` and `BTC` in `USD`, you will need to send the Job IDs `[1,2]`. This sends a transaction and modifies the `pricesArr` array stored in the contract, which will hold the price of each pair in the same order as specified in the input

```solidity
pragma solidity 0.6.11;

interface Razor {
    function getResult(uint256 id) external view returns (uint256);
    function getJob(uint256 id) external view returns(string memory url, string memory selector, string memory name, bool repeat, uint256 result);
}

contract Demo {
    // Interface
    Razor internal razor;
    
    // Variables
    uint256 public price;
    uint256[] public pricesArr;

    constructor(address _bridgeAddress) public {
        razor = Razor(_bridgeAddress); // Bridge Contract Address
                                       // Moonbase Alpha {{ networks.moonbase.razor.bridge_address }}
    }

    function fetchPrice(uint256 _jobID) public view returns (uint256){
        return razor.getResult(_jobID);
    }
    
    function fetchMultiPrices(uint256[] memory jobs) external view returns(uint256[] memory){
        uint256[] memory prices = new uint256[](jobs.length);
        for(uint256 i=0;i<jobs.length;i++){
            prices[i] = razor.getResult(jobs[i]);
        }
        return prices;
    }
    
    function savePrice(uint _jobID) public {
        price = razor.getResult(_jobID);
    }

    function saveMultiPrices(uint[] calldata _jobIDs) public {
        delete pricesArr;
        
        for (uint256 i = 0; i < _jobIDs.length; i++) {
            pricesArr.push(razor.getResult(_jobIDs[i]));
        }

    }
}
```

### Try it on Moonbase Alpha {: #try-it-on-moonbase-alpha }

The easiest way to try their Oracle implementation is by pointing the interface to the Bridge contract deployed at address `{{ networks.moonbase.razor.bridge_address }}`:

```solidity
pragma solidity 0.6.11;

interface Razor {
    function getResult(uint256 id) external view returns (uint256);
    function getJob(uint256 id) external view returns(string memory url, string memory selector, string memory name, bool repeat, uint256 result);
}
```

With it, you will have two view functions available, very similar to the previous examples:

 - **getPrice** - provides the price feed for a single job ID given as input to the function. For example, to fetch the price of `ETH` in `USD`, you will need to send the Job ID `1`
 - **getMultiPrices** - provides the price feed for multiple Job IDs given as an array input to the function. For example, to fetch the price of `ETH` and `BTC` in `USD`, you will need to send the job IDs `[1,2]`

You can use [Remix](/builders/build/eth-api/dev-env/remix/){target=_blank} to fetch the `BTC` price in `USD`.

After creating the file and compiling the contract, head to the **Deploy and Run Transactions** tab, enter the contract address (`{{ networks.moonbase.razor.bridge_address }}`), and click on **At Address**. Make sure you have set the **ENVIRONMENT** to **Injected Web3** so that you are connected to Moonbase Alpha (through the Web3 provider of the wallet).

![Razor Remix deploy](/images/builders/integrations/oracles/razor/razor-demo-1.webp)

This will create an instance of the demo contract that you can interact with. Use the functions `getPrice()` and `getMultiPrices()` to query the data of the corresponding pair.

![Razor check price](/images/builders/integrations/oracles/razor/razor-demo-2.webp)

--8<-- 'text/_disclaimers/third-party-content.md'