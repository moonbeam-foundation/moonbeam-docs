---
title: Using Truffle
description: Moonbeam makes it incredibly easy to deploy a Solidity-based smart contract to a Moonbeam node using Truffle. Learn how in this tutorial.
---

# Interacting with Moonbeam Using Truffle
<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed//RD5MefSPNeo' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style><div class='caption'>You can find all of the relevant code for this tutorial on the [code snippets page](/resources/code-snippets/)</div>

## Introduction
This guide walks through the process of deploying a Solidity-based smart contract to a Moonbeam node using [Truffle](https://www.trufflesuite.com/), a commonly used development tool for smart contracts on Ethereum. Given Moonbeam’s Ethereum compatibility features, Truffle can be used directly with a Moonbeam node.

!!! note
     This tutorial was created using the v3 release of [Moonbase Alpha](https://github.com/PureStake/moonbeam/releases/tag/v0.3.0). The Moonbeam platform and the [Frontier](https://github.com/paritytech/frontier) components it relies on for Substrate-based Ethereum compatibility are still under very active development. The examples in this guide assume you have an Ubuntu 18.04-based environment and will need to be adapted accordingly for MacOS or Windows.

For this guide, you will need to have a  standalone Moonbeam node running in `--dev` mode. This can be done by either following the steps detailed [here](/getting-started/local-node/setting-up-a-node/) or by using the [Moonbeam Truffle plugin](/integrations/trufflebox/#the-moonbeam-truffle-plugin), which we'll use in this tutorial's examples.

## Checking Prerequisites
First, we need to install Node.js (we'll use v15.x) and the npm package manager. You can do this by running in your terminal:

```
curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
```

```
sudo apt install -y nodejs
```

We can verify that everything is installed correctly by querying the version for each package:

```
node -v
```

```
npm -v
```

In addition, you can globally install Truffle by running:

```
npm install -g truffle
```

As of this guide's publish date, the versions used were 15.2.1, 7.0.8, and 5.1.52 respectively.

!!! note
     For the following examples, you don't need to have Truffle globally installed, as it is included as a dependency on the Moonbeam Truffle box. If you prefer, you can run `npx truffle` or `./node_modules/.bin/truffle` instead of `truffle`.

## Getting Started with Truffle
To ease the process of getting started with Truffle, we have [released the Moonbeam Truffle box](https://www.purestake.com/news/moonbeam-truffle-box-now-available-for-solidity-developers). This provides a boilerplate setup to speed up the rampup process to deploy contracts on Moonbeam. To read more about the box, you can visit [this link](/integrations/trufflebox/).

To download the Moonbeam Truffle box, follow [these instructions](/integrations/trufflebox/#downloading-and-setting-up-the-truffle-box). Once inside the directoy, let's take a look at the `truffle-config.js` file (for the purpuse of this guide, some information was removed):

```js
const PrivateKeyProvider = require('./private-provider');
// Standalone Development Node Private Key
const privateKeyDev =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';
//...
module.exports = {
   networks: {
      dev: {
         provider: () => {
            ...
            return new PrivateKeyProvider(privateKeyDev, 'http://localhost:9933/', 1281)
         },
         network_id: 1281,
      },
      //...
   },
   plugins: ['moonbeam-truffle-plugin']
};
```

Note that we defined a `dev` network that points to the standalone node provider URL, and the private key of the development account, which holds all funds in the standalone node, is included.

!!! note
     We are using a `PrivateKeyProvider` as our Web3 provider (instantiation included in `private-provider.js`). Currently, we are still experiencing some issues when using other Web3 providers, such as `HDWalletProvider`, due to our custom chain ID.

## Running an Standalone TestNet

To set up a standalone Moonbeam node, you can follow [this tutorial](/getting-started/local-node/setting-up-a-node/). The process takes around 40 minutes in total, and you need to install Substrate and all its dependencies. The Moonbeam Truffle plugin provides a way to get started with a standalone node much quicker, and the only requirement is to have Docker installed (at time of writing the Docker version used was 19.03.6).

To start a standalone Moonbeam node in your local environment, we need to first download the corresponding Docker image:

```
truffle run moonbeam install
```

![Docker image download](/images/truffle/using-truffle-1.png)

Once downloaded, we can proceed to start the local node with the following command:

```
truffle run moonbeam start
```

You will see a message indicating that the node has started, followed by both of the endpoinds available.

![Moonbeam local node started](/images/truffle/using-truffle-2.png)

Once you are finished using your standalone Moonbeam node, you can run the following lines to stop it and remove the Docker image if that is the case:

```
truffle run moonbeam stop && \
truffle run moonbeam remove
```

![Moonbeam local node stoped and image removed](/images/truffle/using-truffle-3.png)

## The Contract File
There is also a ERC-20 token contract included with the Truffle box:

```solidity
pragma solidity ^0.7.5;

// Import OpenZeppelin Contract
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// This ERC-20 contract mints the specified amount of tokens to the contract creator.
contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyToken", "MYTOK")
    {
        _mint(msg.sender, initialSupply);
    }
}
```

This is a simple ERC-20 contract based on the OpenZepplin ERC-20 contract. It creates "MyToken" with "MYTOK" symbol and the standard 18 decimal places. Furthermore, it assigns the created initial token supply to the contract creator.

If we take a look at the Truffle contract migration script under `migrations/2_deploy_contracts.js`, it contains the following:

```javascript
var MyToken = artifacts.require('MyToken');

module.exports = function (deployer) {
   deployer.deploy(MyToken, '8000000000000000000000000');
};
```

"8000000000000000000000000" is the number of tokens to initially mint with the contract, i.e., 8 million with 18 decimal places.

## Deploying a Contract to Moonbeam Using Truffle
Before we can deploy our contracts, we must compile them. (We say "contracts" because normal Truffle deployments include the `Migrations.sol` contract.) You can do this with the following command:

```
truffle compile
```

If successful, you should see output like the following:

![Truffle compile success message](/images/truffle/using-truffle-4.png)

Now we are ready to deploy the compiled contracts. You can do this with the following command:

```
truffle migrate --network dev
```

If successful, you will see deployment actions, including the address of the deployed contract:

![Successful contract deployment actions](/images/truffle/using-truffle-5.png)

Once you have followed the [MetaMask guide](/getting-started/local-node/using-metamask/) and [Remix guide](/getting-started/local-node/using-remix/), you will be able to take the deployed contract address that is returned and load it into MetaMask or Remix.

## We Want to Hear From You
This is obviously a simple example, but it provides context for how you can start working with Moonbeam and how you can try out its Ethereum compatibility features. We are interested in hearing about your experience following the steps in this guide or trying other Ethereum-based tools with Moonbeam. Feel free to join us in the [Moonbeam Discord](https://discord.gg/PfpUATX). We would love to hear your feedback on Moonbeam and answer any questions that you have.
