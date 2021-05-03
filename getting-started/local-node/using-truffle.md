---
title: Using Truffle
description: Moonbeam makes it incredibly easy to deploy a Solidity-based smart contract to a Moonbeam node using Truffle. Learn how in this tutorial.
---

# Interacting with Moonbeam Using Truffle

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed//RD5MefSPNeo' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style><div class='caption'>You can find all of the relevant code for this tutorial on the <a href="{{ config.site_url }}resources/code-snippets/">code snippets page</a></div>

## Introduction

This guide walks through the process of deploying a Solidity-based smart contract to a Moonbeam node using [Truffle](https://www.trufflesuite.com/), a commonly used development tool for smart contracts on Ethereum. Given Moonbeam’s Ethereum compatibility features, Truffle can be used directly with a Moonbeam node.

!!! note
    This tutorial was created using the {{ networks.development.build_tag}} tag which is based on the {{ networks.moonbase.version }} release of [Moonbase Alpha](https://github.com/PureStake/moonbeam/releases/tag/{{ networks.moonbase.version }}). The Moonbeam platform and the [Frontier](https://github.com/paritytech/frontier) components it relies on for Substrate-based Ethereum compatibility are still under very active development.
    --8<-- 'text/common/assumes-mac-or-ubuntu-env.md'

For this guide, you will need to have a Moonbeam development node running in `--dev` mode. This can be done by either following the steps detailed [here](/getting-started/local-node/setting-up-a-node/) or by using the [Moonbeam Truffle plugin](/integrations/trufflebox/#the-moonbeam-truffle-plugin), which we'll use in this tutorial's examples.

## Checking Prerequisites

--8<-- 'text/common/install-nodejs.md'


In addition, you can globally install Truffle by running:

```
npm install -g truffle
```

As of this guide's publish date, the versions used were 15.12.0, 7.6.3, and 5.2.4 respectively.

!!! note
    For the following examples, you don't need to have Truffle globally installed, as it is included as a dependency on the Moonbeam Truffle box. If you prefer, you can run `npx truffle` or `./node_modules/.bin/truffle` instead of `truffle`.

## Getting Started with Truffle

To ease the process of getting started with Truffle, we have [released the Moonbeam Truffle box](https://moonbeam.network/announcements/moonbeam-truffle-box-available-solidity-developers/). This provides a boilerplate setup to speed up the rampup process to deploy contracts on Moonbeam. To read more about the box, you can visit [this link](/integrations/trufflebox/).

To download the Moonbeam Truffle box, follow [these instructions](/integrations/trufflebox/#downloading-and-setting-up-the-truffle-box). Once inside the directoy, let's take a look at the `truffle-config.js` file (for the purpuse of this guide, some information was removed):

```js
const HDWalletProvider = require('@truffle/hdwallet-provider');
// Moonbeam Development Node Private Key
const privateKeyDev =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';
//...
module.exports = {
   networks: {
      dev: {
         provider: () => {
            ...
            return new HDWalletProvider(privateKeyDev, 'http://localhost:9933/')
         },
         network_id: 1281,
      },
      //...
   },
   plugins: ['moonbeam-truffle-plugin']
};
```

Note that we are using `HD-Wallet-Provider` from Truffle as the Hierarchical Deterministic wallet. Also, we've defined a `dev` network that points to the development node provider URL, and the private key of the development account, which holds all funds in the development node, is included.

## Running a Development Node

To set up a Moonbeam development node, you can follow [this tutorial](/getting-started/local-node/setting-up-a-node/). The process takes around 40 minutes in total, and you need to install Substrate and all its dependencies. The Moonbeam Truffle plugin provides a way to get started with a development node much quicker, and the only requirement is to have Docker installed (at time of writing the Docker version used was 19.03.6).

To start a Moonbeam development node in your local environment, we need to first download the corresponding Docker image:

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

Once you are finished using your Moonbeam development node, you can run the following lines to stop it and remove the Docker image if that is the case:

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

