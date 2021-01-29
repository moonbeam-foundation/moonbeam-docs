---
title: Razor Network
description: How to use request data from a Razor Network Oracle in your Moonbeam Ethereum Dapp using smart contracts or javascript
---
# Razor Network Oracle

![Razor Network Moonbeam Diagram]

## Introduction
Developers can fetch prices from Razor Network’s oracle using a Bridge contract deployed on Moonbase Alpha Network. This Bridge is connected to Razor Network's oracle infrustructure, which sends prices to bridge contract.

The Bridge Contract address can be found in the following table:

|     Network    | |         Aggregator Contract Address        |
|:--------------:|-|:------------------------------------------:|
| Moonbase Alpha | | 0xC6F33c0F15FE5e3A51A019524ac43574cFF29EFB |

## Jobs
Each datafeed has a Job ID attached to it. For example:

 -  `Job ID 1: ETH`
 -  `Job ID 2: BTC`
 -  `Job ID 3: MSFT`

You can check job IDs for each datafeed at the following [link](https://razorscan.io/#/custom)

## Get Data From Bridge Contract
Contracts can query on-chain data such as token prices from Razor Network's oracle by implementing the interface of the `Bridge` contract, which exposes the `getResult` and `getJob` functions.

```
pragma solidity 0.6.11;

interface Razor {
    function getResult(uint256 id) external view returns (uint256);
    function getJob(uint256 id) external view returns(string memory url, string memory selector, string memory name, bool repeat, uint256 result);
}
```

The first function, `getResult`, takes the job ID associated with the datafeed and fetches it's price. For example, if we pass in `1` , we will receive the price of the datafeed associated with the job ID.


The second function, `getJob`, takes the job ID associated with the datafeed and fetches the overall information regarding the datafeed such as the name of the datafeed, price of the datafeed and the url being used to fetch the prices.

### Deploying on Moonbase Alpha

We've deployed the bridge contract available in the Moonbase Alpha TestNet (at address `0xC6F33c0F15FE5e3A51A019524ac43574cFF29EFB`), so you can easily check the information fed from Razor Network's oracle. You would require The Bridge interface which defines `getResult` structure and makes the functions available to the contract for queries.

```
pragma solidity 0.6.11;

interface Razor {
    function getResult(uint256 id) external view returns (uint256);
    function getJob(uint256 id) external view returns(string memory url, string memory selector, string memory name, bool repeat, uint256 result);
}
```

We can use the following `Demo` script. It provides two functions:

 -  fetchPrice: a _view_ function that queries a single job ID. For example, to fetch the price of `ETH` in `USD`, we will need to send in the job ID `1`
 -  fetchMultiPrices: a _view_ function that queries multiple job IDs. For example, to fetch the price of `ETH` and `BTC` in `USD`, we will need to send in the job IDs `[1,2]`

```sol
pragma solidity 0.6.11;
pragma experimental ABIEncoderV2;

interface Razor {
    function getResult(uint256 id) external view returns (uint256);
    function getJob(uint256 id) external view returns(string memory url, string memory selector, string memory name, bool repeat, uint256 result);
}

contract Demo {
    Razor public razor;

    constructor() public {
        razor = Razor(0xC6F33c0F15FE5e3A51A019524ac43574cFF29EFB);
                //Moonbase Alpha 0xC6F33c0F15FE5e3A51A019524ac43574cFF29EFB
    }

    function fetchPrice(uint256 jobID) external view returns (uint256){
        return razor.getResult(jobID);
    }

    function fetchMultiPrices(uint256[] memory jobs) external view returns(uint256[] memory){
        uint256[] memory prices = new uint256[](jobs.length);
        for(uint256 i=0;i<jobs.length;i++){
            prices.push(razor.getResult(jobs[i]));
        }
        return prices;
    } 
}
```

Make sure to set the Razor address to `0xC6F33c0F15FE5e3A51A019524ac43574cFF29EFB`

For example, to deploy using Truffle, set up the migration by creating a new file called 2_deploy.js in the migrations director and paste the following code. This will tell truffle how to deploy the contract on the network. 

```
var King = artifacts.require('./Demo.sol')
module.exports = async function (deployer) {

deployer.then(async () => {
  await deployer.deploy(Demo)
})
}
```

Set up the truffle configuration used for moonbase alpha, for example

```
moonbase: {
            provider: () => new HDWalletProvider(mnemonic, 'https://rpc.testnet.moonbeam.network'),
            network_id: 1287,
            gas: 8000000,
            gasPrice: 0
        }
```

Type the following command to deploy the contracts on Moonbase Alpha.

```
truffle migrate --network moonbase
```

## Contact Us
If you have any feedback regarding implementing Razor Network Oracle on your project, or any other Moonbeam related topic, feel free to reach out through our official development [Discord server](https://discord.com/invite/PfpUATX).
