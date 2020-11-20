---
title: Moonbeam Truffle Box
description: Start using the Moonbeam Truffle Box for a quick, preconfigured way to deploy your Solidity smart contracts on Moonbeam using Truffle.
---
# Moonbeam Truffle Box

##Introduction
As part of an ongoing effort to help developers that want to start working on Moonbeam, we have [launched the Moonbeam Truffle box](https://www.purestake.com/news/moonbeam-truffle-box-now-available-for-solidity-developers). With it, developers will find a boilerplate setup to get started deploying smart contracts on Moonbeam quickly. With the Moonbeam Truffle box, we have also incorporated the Moonbeam Truffle plugin, that introduces some commands to run a standalone node in your local environment as a Docker image. This removes the process of setting up a local node which can take up to 40 minutes when building its binary, and is a quick and easy solution to get started developing in your local environment.

This tutorial will guide you through the process of setting up the box, using the Moonbeam Truffle plugin, and deploy contracts to both a standalone Moonbeam node and Moonbase Alpha using Truffle with the box base configuration.

!!! note
    This guide is based on an Ubuntu 18.04 installation. At the time of writing, Node.js and npm versions used were 15.2.1 and 7.0.8 respectively. Node.js versions higher than 10.23.0 are required.

## Checking Prerequisites

For this tutorial, we need to install Node.js (we'll go for v15.x) and the npm package manager. You can do this by running in your terminal:

```
curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
```
```
sudo apt install -y nodejs
```

We can verify that everything installed correctly by querying the version for each package:

```
node -v
```
```
npm -v
```

As of the writing of this guide, versions used were 15.2.1 and 7.0.8, respectively. Next, we can optionally install Truffle globally, to do so you can execute:


```
npm install -g truffle
```

As of the writing of this guide, version used was 5.1.51. 

## Downloading and Setting Up the Truffle Box

To get started with the Moonbeam Truffle box, if you have Truffle installed globally, you can execute:

```
mkdir moonbeam-truffle-box && cd moonbeam-truffle-box
truffle unbox PureStake/moonbeam-truffle-box
```

![Unbox Moonbeam Truffle box](/images/trufflebox/trufflebox-07.png)

Nevertheless, the box has also Truffle as a dependency in case you do not want to have it installed globally. In such a case, you can directly clone the following repository:

```
git clone https://github.com/PureStake/moonbeam-truffle-box
cd moonbeam-truffle-box
``` 

With the files in your local system, the next step is to install all dependencies by running:

```
npm install
```

And that is all the prerequisites you need to use the Moonbeam Truffle box.

## Basic Functionalities

The box is pre-configured with two networks: `dev` (for a standalone node) and `moonbase` (Moonbeam TestNet). Included as well, as an example, is an ERC20 token contract, and a simple test script. If you are experienced with Truffle, this setup will feel familiar.

```js
const PrivateKeyProvider = require('./private-provider');
// Standalone Development Node Private Key
const privateKeyDev =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';
// Moonbase Alpha Private Key --> Please change this to your own Private Key with funds
const privateKeyMoonbase = '';
module.exports = {
   networks: {
      dev: {
         provider: () => {
            ...
            return new PrivateKeyProvider(privateKeyDev, 'http://localhost:9933/', 1281)
         },
         network_id: 1281,
      },
      moonbase: {
         provider: () => {
            ...
            return new PrivateKeyProvider(privateKeyMoonbase, 'https://rpc.testnet.moonbeam.network', 1287)
         },
         network_id: 1287,
      },
   },
   plugins: ['moonbeam-truffle-plugin']
};
```

The `truffle-config.js` file also includes the private key of the genesis account for the standalone node is included as well, the address associated with this key holds all the tokens in this development environment. For deployments in the Moonbase Alpha TestNet, you need to provide the private key of an address that holds funds. To do so, you can create an account in MetaMask, fund it using the [TestNet faucet](https://docs.moonbeam.network/getting-started/testnet/faucet/), and export its private key.

As with using Truffle in any Ethereum network, you can run the normal commands to compile, test and deploy smart contracts in Moonbeam. For example, using the included ERC20 token contract, you can try the following commands:

```
./node_modules/.bin/truffle compile # compiles the contract
./node_modules/.bin/truffle test #run the tests included in the test folder
./node_modules/.bin/truffle migrate --network network_name  #deploys to the specified network
```

If you have Truffle installed globally, you can remove `./node_modules/.bin/` from the commands. Depending on the network you want to deploy the contracts too, you need to substitute network_name for either dev (to target the standalone node) or moonbase (to target the TestNet).

## The Moonbeam Truffle Plugin

Currently, to set up a standalone Moonbeam node, you can follow [this tutorial](/getting-started/local-node/setting-up-a-node). The process takes around 40 minutes in total, and you need to install Substrate and all its dependencies. The Moonbeam Truffle plugin provides a way to get started with a standalone node much quicker, and the only requirement is to have Docker installed (at the time of writing the Docker version used was 19.03.6). For more information on installing Docker, please visit [this page](https://docs.docker.com/get-docker/). To download the Docker image, run the following line:

```
./node_modules/.bin/truffle run moonbeam install
``` 

![Install Moonbeam Truffle box](/images/trufflebox/trufflebox-01.png)

 
Then, you have available a set of commands to control the node included in the Docker image:
 
```
./node_modules/.bin/truffle run moonbeam start
./node_modules/.bin/truffle run moonbeam status
./node_modules/.bin/truffle run moonbeam pause
./node_modules/.bin/truffle run moonbeam unpause
./node_modules/.bin/truffle run moonbeam stop
./node_modules/.bin/truffle run moonbeam remove
```

Each of the commands shown before does the following action:

-  Start: starts a Moonbeam standalone node, this provides two RPC endpoints: - HTTP: `http://127.0.0.1:9933` - WS: `ws://127.0.0.1:9944`
-  Status: tells the user if there is a Moonbeam standalone node running
-  Pause: pauses the standalone node if it’s running
-  Unpause: unpauses the standalone node if it’s paused
-  Stop: stops the standalone node if it’s running, this also removes the Docker container
-  Remove: deletes the purestake/moonbase Docker image

You can see the output of these commands in the following image:

![Install Moonbeam Truffle box](/images/trufflebox/trufflebox-02.png)

If you are familiar with Docker, you can skip the plugin commands and interact with the Docker image directly.

## Testing the Moonbeam Truffle Box
The box has the minimum requirements to help you get started. Lets first compile the contracts by running:

```
./node_modules/.bin/truffle compile
``` 
![Compile Contracts](/images/trufflebox/trufflebox-03.png)

Remember that if you have Truffle installed globally, you can skip the ./node_modules/.bin/ part in the commands. With the contract compiled, we can run the basic test included in the box (note that for these tests Ganache is used, and not the Moonbeam standalone node):

```
./node_modules/.bin/truffle test
```

![Test Contract Moonbeam Truffle box](/images/trufflebox/trufflebox-04.png)


After running the plugin install command, which downloads the Moonbeam standalone node Docker image, let's start the local node and deploy the token contract to our local environment:

```
./node_modules/.bin/truffle run moonbeam start
./node_modules/.bin/truffle migrate --network dev
```

![Deploy on Dev Moonbeam Truffle box](/images/trufflebox/trufflebox-05.png)

And lastly, we can deploy our token contract to Moonbase Alpha, but first, make sure you set a private key with funds in the truffle-config.js file. Once the private key is set, we can execute the migrate command pointing to the TestNet.

<code>
./node_modules/.bin/truffle migrate --network moonbase
</code>

![Deploy on Moonbase Moonbeam Truffle box](/images/trufflebox/trufflebox-06.png)

And that is it, you’ve used the Moonbeam Truffle box to deploy a simple ERC20 token contract in both your standalone Moonbeam node and Moonbase Alpha.
 
## Limitations

If you are familiar with Truffle, you might have noticed that we are using a custom provider programmed by ourselves, instead of the most common ones such as [hdwallet-provider](https://github.com/trufflesuite/truffle/tree/develop/packages/hdwallet-provider). This custom provider still uses standard libraries such as the web3-provider-engine and ethereumjs-wallet. The reason behind this is because our custom chain ID was not being included by the library used to sign the transactions. Therefore, the signature is invalid because the chain ID in the transaction blob is missing, and the transaction is rejected. Currently we are reviewing this and we expect to support other providers in future releases.

## Contact Us
 
If you have any feedback regarding the Moonbeam Truffle box or any other Moonbeam related topic, feel free to reach out through our official development [Discord server](https://discord.gg/PfpUATX).
