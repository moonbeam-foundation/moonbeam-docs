---
title: Moonbeam Truffle Box
description: Start using the Moonbeam Truffle Box for a quick, preconfigured way to deploy your Solidity smart contracts on Moonbeam using Truffle.
---
# Moonbeam Truffle Box

![Intro diagram](/images/integrations/integrations-trufflebox-banner.png)

##Introduction
As part of an ongoing effort to help developers that want to start working on Moonbeam, we have [launched the Moonbeam Truffle box](https://moonbeam.network/announcements/moonbeam-truffle-box-available-solidity-developers/). With it, developers will find a boilerplate setup to get started deploying smart contracts on Moonbeam quickly. With the Moonbeam Truffle box, we have also incorporated the Moonbeam Truffle plugin, which introduces some commands to run a development node in your local environment as a Docker image. This removes the process of setting up a local node (which can take up to 40 minutes when building its binary) and is a quick and easy solution to get started developing in your local environment.

This tutorial will guide you through the process of setting up the box, using the Moonbeam Truffle plugin, and deploying contracts to both a development Moonbeam node and Moonbase Alpha using Truffle with the box base configuration.

!!! note
    This guide is based on an Ubuntu 18.04 installation. At the time of writing, Node.js and npm versions used were 15.2.1 and 7.0.8 respectively. Node.js versions higher than 10.23.0 are required. We also noticed an error while installing the packages with npm version 7.0.15. You can downgrade npm by running `npm install -g npm@version`, setting the version to the one desired.

## Checking Prerequisites

--8<-- 'text/common/install-nodejs.md'

As of the writing of this guide, the versions used were 15.2.1 and 7.0.8, respectively. Next, we can optionally install Truffle globally. To do so you can execute:


```
npm install -g truffle
```

As of the writing of this guide, the version used was 5.1.51. 

## Downloading and Setting Up the Truffle Box

To get started with the Moonbeam Truffle box, if you have Truffle installed globally, you can execute:

```
mkdir moonbeam-truffle-box && cd moonbeam-truffle-box
truffle unbox PureStake/moonbeam-truffle-box
```

![Unbox Moonbeam Truffle box](/images/trufflebox/trufflebox-07.png)

Nevertheless, the box also has Truffle as a dependency in case you do not want to have it installed globally. In such a case, you can directly clone the following repository:

```
git clone https://github.com/PureStake/moonbeam-truffle-box
cd moonbeam-truffle-box
``` 

With the files in your local system, the next step is to install all dependencies by running:

```
npm install
```

!!! note
    We noticed an error while installing the packages with npm version 7.0.15. You can downgrade npm by running `npm install -g npm@version` and setting the version to the one desired. For example, 7.0.8 or 6.14.9.

That concludes all prerequisites you need to use the Moonbeam Truffle box.

## Basic Functionalities

The box is pre-configured with two networks: `dev` (for a development node) and `moonbase` (Moonbeam TestNet). Also included, as an example, is an ERC20 token contract and a simple test script. The Solidity compiler set by default is `^0.7.0`, but this can be changed as required. If you are experienced with Truffle, this setup will feel familiar.

```js
const HDWalletProvider = require('@truffle/hdwallet-provider');
// Moonbeam Development Node Private Key
const privateKeyDev =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';
// Moonbase Alpha Private Key --> Please change this to your own Private Key with funds
// NOTE: Do not store your private key in plaintext files
//       this is only for demostration purposes only
const privateKeyMoonbase =
   'YOUR_PRIVATE_KEY_HERE_ONLY_FOR_DEMOSTRATION_PURPOSES';

module.exports = {
   networks: {
      // Standalode Network
      dev: {
         provider: () => {
            //...
            return new HDWalletProvider(
               privateKeyDev,
               'http://localhost:9933/'
            );
         },
         network_id: 1281,
      },
      // Moonbase Alpha TestNet
      moonbase: {
         provider: () => {
            //...
            return new HDWalletProvider(
               privateKeyMoonbase,
               'https://rpc.testnet.moonbeam.network'
            );
         },
         network_id: 1287,
      },
   },
   // Solidity 0.7.0 Compiler
   compilers: {
      solc: {
         version: '^0.7.0',
      },
   },
   // Moonbeam Truffle Plugin
   plugins: ['moonbeam-truffle-plugin'],
};
```

The `truffle-config.js` file also includes the private key of the genesis account for the development node. The address associated with this key holds all the tokens in this development environment. For deployments in the Moonbase Alpha TestNet, you need to provide the private key of an address that holds funds. To do so, you can create an account in MetaMask, fund it using the [TestNet faucet](https://docs.moonbeam.network/getting-started/testnet/faucet/), and export its private key.

As with using Truffle in any Ethereum network, you can run the normal commands to compile, test, and deploy smart contracts in Moonbeam. For example, you can try the following commands using the included ERC20 token contract:

```
truffle compile # compiles the contract
truffle test #run the tests included in the test folder
truffle migrate --network network_name  #deploys to the specified network
```

Depending on the network you want to deploy the contracts to, you need to substitute network_name for either dev (to target the development node) or moonbase (to target the TestNet).

!!! note
    If you don't have Truffle installed globally, you can use `npx truffle` or `./node_modules/.bin/truffle` instead of `truffle` instead.

## The Moonbeam Truffle Plugin

To set up a Moonbeam development node, you can currently follow [this tutorial](/getting-started/local-node/setting-up-a-node/). The process takes around 40 minutes in total, and you need to install Substrate and all its dependencies. The Moonbeam Truffle plugin provides a way to get started with a development node much quicker, and the only requirement is to have Docker installed (at the time of writing the Docker version used was 19.03.6). For more information on installing Docker, please visit [this page](https://docs.docker.com/get-docker/). To download the Docker image, run the following line:

```
truffle run moonbeam install
``` 

![Install Moonbeam Truffle box](/images/trufflebox/trufflebox-01.png)

 
Then, you have a set of commands available to control the node included in the Docker image:
 
```
truffle run moonbeam start
truffle run moonbeam status
truffle run moonbeam pause
truffle run moonbeam unpause
truffle run moonbeam stop
truffle run moonbeam remove
```

Each of the commands shown before does the following action:

-  Start: Starts a Moonbeam development node. This provides two RPC endpoints: 
      - HTTP: `http://127.0.0.1:9933` 
      - WS: `ws://127.0.0.1:9944`
-  Status: Tells the user if there is a Moonbeam development node running
-  Pause: Pauses the development node if it’s running
-  Unpause: Unpauses the development node if it’s paused
-  Stop: Stops the development node if it’s running. This also removes the Docker container
-  Remove: Deletes the purestake/moonbase Docker image

You can see the output of these commands in the following image:

![Install Moonbeam Truffle box](/images/trufflebox/trufflebox-02.png)

If you are familiar with Docker, you can skip the plugin commands and interact with the Docker image directly.

## Testing the Moonbeam Truffle Box

The box has the minimum requirements to help you get started. Lets first compile the contracts by running:

```
truffle compile
``` 
![Compile Contracts](/images/trufflebox/trufflebox-03.png)

Remember that if you have Truffle installed globally, you can skip the ./node_modules/.bin/ part in the commands. With the contract compiled, we can run the basic test included in the box (note that Ganache is used for these tests and not the Moonbeam development node):

```
truffle test
```

![Test Contract Moonbeam Truffle box](/images/trufflebox/trufflebox-04.png)

After running the plugin install command, which downloads the Moonbeam development node Docker image, let's start the local node and deploy the token contract to our local environment:

```
truffle run moonbeam start
truffle migrate --network dev
```

![Deploy on Dev Moonbeam Truffle box](/images/trufflebox/trufflebox-05.png)

Lastly, we can deploy our token contract to Moonbase Alpha, but first, make sure you set a private key with funds in the truffle-config.js file. Once the private key is set, we can execute the migrate command pointing to the TestNet.

```
truffle migrate --network moonbase
```

![Deploy on Moonbase Moonbeam Truffle box](/images/trufflebox/trufflebox-06.png)

And that is it, you’ve used the Moonbeam Truffle box to deploy a simple ERC20 token contract in both your Moonbeam development node and Moonbase Alpha.
 
## We Want to Hear From You

If you have any feedback regarding the Moonbeam Truffle box or other Moonbeam-related topics, feel free to reach out through our official development [Discord server](https://discord.gg/PfpUATX).
