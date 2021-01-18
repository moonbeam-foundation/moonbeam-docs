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
| Moonbase Alpha | | 0xD1843DE116930b5652c8371EfB3Ae72B629C10ab |

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

We've deployed the bridge contract available in the Moonbase Alpha TestNet (at address `0xD1843DE116930b5652c8371EfB3Ae72B629C10ab`), so you can easily check the information fed from Razor Network's oracle. You would require The Bridge interface which defines `getResult` structure and makes the functions available to the contract for queries.

```
pragma solidity 0.6.11;

interface Razor {
    function getResult(uint256 id) external view returns (uint256);
    function getJob(uint256 id) external view returns(string memory url, string memory selector, string memory name, bool repeat, uint256 result);
}
```

 As an example, we will create a contract in which we will need to send in the job IDs to the function `addFeed()` and then, the function `findKing()` will find out which job ID has the highest price out of the job IDs sent to the contract

```sol
pragma solidity 0.6.11;
pragma experimental ABIEncoderV2;

interface Razor {
    function getResult(uint256 id) external view returns (uint256);
    function getJob(uint256 id) external view returns(string memory url, string memory selector, string memory name, bool repeat, uint256 result);
}

contract King {
    Razor public razor;
    uint256[] public jobs;
    uint256 public numJobs = 0;
    uint256 public king = 0;
    uint256[] public lastResults;

    constructor() public {
        razor = Razor(0xD1843DE116930b5652c8371EfB3Ae72B629C10ab);
                //Moonbase Alpha 0xD1843DE116930b5652c8371EfB3Ae72B629C10ab
    }

    function addFeed(uint256 jobId) public {
        jobs.push(jobId);
        numJobs = numJobs + 1;
        lastResults.push(0);
    }

    function findKing() public {
        uint256 highestGain = 0;
        uint256 highestGainer = 0;
        uint256 leastLoss = 0;
        uint256 leastLoser = 0;
        for(uint256 i = 0; i < jobs.length; i++) {

            uint256 price = razor.getResult(jobs[i]); //fetching the prices of each job ID from the bridge contract deployed on Moonbase Alpha

            if(price > lastResults[i]) {
                if(price - lastResults[i] > highestGain) {
                    highestGain = price - lastResults[i];
                    highestGainer = jobs[i];
                }
            } else if(price < lastResults[i]) {
                    if(lastResults[i] - price < leastLoss) {
                        leastLoss = lastResults[i] - price;
                        leastLoser = jobs[i];
                    }
                }

            lastResults[i] = price;
        }
        if (highestGain > 0) {
            king = highestGainer;
        } else if (leastLoss > 0) {
            king = leastLoser;
        }
    }
}
```

Make sure to set the Razor address to `0xD1843DE116930b5652c8371EfB3Ae72B629C10ab`

For example, to deploy using Truffle, set up the migration by creating a new file called 2_deploy.js in the migrations director and paste the following code. This will tell truffle how to deploy the contract on the network. 

```
var King = artifacts.require('./King.sol')
module.exports = async function (deployer) {

deployer.then(async () => {
  await deployer.deploy(King)
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
