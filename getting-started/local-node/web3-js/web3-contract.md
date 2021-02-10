---
title: Deploy a Contract
description: Learn how to deploy unmodified and unchanged Solidity-based smart contracts to a Moonbeam node with a simple script using Web3.js.
---

# Using Web3.js to Deploy Smart Contracts on Moonbeam

## Introduction  
This guide walks through the process of using the Solidity compiler and [web3.js](https://web3js.readthedocs.io/) to deploy and interact with a Solidity-based smart contract on a Moonbeam standalone node. Given Moonbeam’s Ethereum compatibility features, the web3.js library can be used directly with a Moonbeam node.

This guide assumes that you have a local Moonbeam node running in `--dev` mode. You can find instructions to set up a local Moonbeam node [here](/getting-started/local-node/setting-up-a-node/).

!!! note
    This tutorial was created using the v3 release of [Moonbase Alpha](https://github.com/PureStake/moonbeam/releases/tag/v0.3.0). The Moonbeam platform and the [Frontier](https://github.com/paritytech/frontier) components it relies on for Substrate-based Ethereum compatibility are still under very active development. The examples in this guide assume you have an Ubuntu 18.04-based environment and will need to be adapted accordingly for MacOS or Windows.

## Checking Prerequisites
If you followed the ["Setting Up a Node" tutorial](/getting-started/local-node/setting-up-a-node/), you should have a local Moonbeam node producing blocks that looks like this:

![Moonbeam local node](/images/web3contract/web3-contract-1.png)

Additionally, we need to install Node.js (we'll use v15.x) and the npm package manager for this tutorial. You can do this by running in your terminal:

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

The versions used when publishing this guide were 15.2.1 and 7.0.8, respectively.

Next, we can create a directory to store all of our relevant files (in a separate path from the local Moonbeam node files) by running:

```
mkdir incrementer && cd incrementer/
```

And create a simple package.json file:

```
npm init --yes
```

With the package.json file created, we can then install both the web3.js and the Solidity compiler (fixed at version v0.7.4) packages by executing:

```
npm install web3
```

```pypy
npm install solc@0.7.4
```

To verify the installed version of web3.js or the Solidity compiler, you can use the `ls` command:

```
npm ls web3
```

```
npm ls solc
```

The versions used when publishing this guide were 1.3.0 and 0.7.4 (as mentioned before), respectively.

Our setup for this example will be relatively simple. We will have the following files:

-  _Incrementer.sol_: the file with our Solidity code
-  _compile.js_: it will compile the contract with the Solidity compiler
-  _deploy.js_: it will handle the deployment to our local Moonbeam node
-  _get.js_: it will make a call to the node to get the current value of the number
-  _increment.js_: it will make a transaction to increment the number stored on the Moonbeam node
-  _reset.js_: the function to call that will reset the number stored to zero

## The Contract File and Compile Script
<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed//pBp8VU9mnPs' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style><div class='caption'>You can find all of the relevant code for this tutorial on the [code snippets page](/resources/code-snippets/)</div>

### The Contract File
The contract we will use is a very simple incrementer arbitrarily named _Incrementer.sol_, which you can find [here](/code-snippets/web3-contract-local/Incrementer.sol). The Solidity code is the following:

```solidity
--8<-- 'web3-contract-local/Incrementer.sol'
```

Our `constructor` function, that runs when the contract is deployed, sets the initial value of the number variable that is stored in the Moonbeam node (default is 0). The `increment` function adds `_value` provided to the current number, but a transaction needs to be sent, as this modifies the stored data. Lastly, the `reset` function resets the stored value to zero.

!!! note
    This contract is a simple example for illustration purposes only and does not handle values wrapping around.

### The Compile File
The only purpose of the _compile.js_ file (arbitrarily named and can be found [here](/code-snippets/web3-contract-local/compile.js)), is to use the Solidity compiler to output the bytecode and interface our contract.

First, we need to load the different modules needed for this process. The _path_ and _fs_ modules are included by default in Node.js (which is why we didn't need to install it before).

Next, we need to read the content of the Solidity file (in UTF8 encoding).

Then, we build the input object for the Solidity compiler.

Finally, we run the compiler and extract the data related to our incrementer contract, as that is all we need for this simple example.

```javascript
--8<-- 'web3-contract-local/compile.js'
```

## The Deploy Script and Interacting with our Contract
<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed//CRYfejvqNzg' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style><div class='caption'>You can find all relevant code for this tutorial on the [code snippets page](/resources/code-snippets/)</div>

### The Deploy File
The deployment file (found [here](/code-snippets/web3-contract-local/deploy.js)) is divided into two subsections: the initialization and the deploy contract.

First, we need to load our web3.js module and the export of the _compile.js_ file, from which we will extract the `bytecode` and `abi`.

Next, define the `privKey` variable as the private key of our genesis account, which is where all the funds are stored when deploying your local Moonbeam node and what is also used to sign the transactions. The address is needed to specify the form value of the transaction.

Lastly, we will create a local Web3 instance, and set the provider to connect to our local Moonbeam node.

To deploy the contract, we will create an asynchronous function to handle the transaction promises. First, we need to create a local instance of our contract using the `web3.eth.Contract(abi)`, from which we will call the deploy function. For this function, provide the `bytecode` and the arguments input of the constructor function. In our case, this was just one that was arbitrarily set to five.

Then, to create the transaction, we use the `web3.eth.accounts.signTransaction(tx, privKey)` command, where we must define the tx object with some parameters, such as: from address, the encoded abi from the previous step, and the gas limit. The private key must also be provided to sign the transaction.

```javascript
--8<-- 'web3-contract-local/deploy.js'
```

To get the estimated gas to deploy this contract, we can use the `estimateGas` method. This can differ from the actual gas consumed at the moment of execution but can provide a reference value.

With the transaction message created and signed (you can `console.log(createTransaction)` to see the v-r-s values), we can now deploy it by using the `web3.eth.sendSignedTransaction(signedTx)` and providing the `rawTransaction` from the createTransaction object. Lastly, we run our deploy function.

!!! note
    The _deploy.js_ script provides the contract address as an output. This comes handy, as it is used for the contract interaction files.

### Files to Interact With the Contract
In this section, we will quickly go over the files that interact with our contract, either by making calls or sending transactions to it.

First, let's overview the _get.js_ file (the simplest of them all, which you can find [here](/code-snippets/web3-contract-local/get.js)), that fetches the current value stored in the Moonbeam node. We need to load our Web3 module and the export of the _compile.js_ file, from which we will extract the `abi`.

Next, we create a local Web3 instance. Lastly, we need to provide the contract address (which is a log in the console by the _deploy.js_ file).

The following step is to create a local instance of the contract by using the `web3.eth.Contract(abi, contractAddress)` command. Then, wrapped in an async function, we can write the contract call by running `contractInstance.methods.myMethods()`, where we set the method or function that we want to call and provide the inputs for this call. This promise returns the data that we can log in the console. Lastly, we run our `get` function.

```javascript
--8<-- 'web3-contract-local/get.js'
```

Let's now define the file to send a transaction that will add the value provided to our number. The _increment.js_ file (found [here](/code-snippets/web3-contract-local/increment.js)) is somewhat different to the previous example. That is because we are modifying the stored data, and for this, we need to send a transaction that pays gas. However, the initialization part of the file is similar. The only differences are that the private key must be defined for signing and that we've defined a `_value` that corresponds to the value to be added to our number.

As before, the contract transaction starts by creating a local instance of the contract, but when we call the corresponding `incrementer(_value)` method, where we pass in `_value`.

Then, as we did when deploying the contract, we need to create the transaction with the corresponding data (wrapped in an async function), sign it with the private key, and send it. Note that we are calculating the gas using the `estimateGas` method as before. Lastly, we run our incrementer function.

```javascript
--8<-- 'web3-contract-local/increment.js'
```

The _reset.js_ file (which you can find [here](/code-snippets/web3-contract-local/reset.js)), is almost identical to the previous example. The only difference is that we need to call the `reset()` method, which takes no input. In this case, we are manually setting the gas limit of the transaction to `40000`, as the `estimatedGas()` method returns an invalid value (something we are working on).

```javascript
--8<-- 'web3-contract-local/reset.js'
```

## Interacting with the Contract
With all the files ready, we can proceed to deploy our contract to the local Moonbeam node. To do this, we will execute the following command in the directory where all the files are:

```
node deploy.js
```

After a successful deployment, you should get the following output:

![Moonbeam local node](/images/web3contract/web3-contract-2.png)

First, let's check and confirm that the value stored is equal to the one we passed in as the input of the constructor function (that was 5). We do this by running:

```
node get.js
```

With the following output:

![Moonbeam local node](/images/web3contract/web3-contract-3.png)

Then, we can use our incrementer file (remember that `_value = 3`.) We can immediately use our getter file to prompt the value after the transaction:

```
node incrementer.js
```

```
node get.js
```

With the following output:

![Moonbeam local node](/images/web3contract/web3-contract-4.png)

Lastly, we can reset our number by using the reset file:

```
node reset.js
```

```
node get.js
```

With the following output:

![Moonbeam local node](/images/web3contract/web3-contract-5.png)

## We Want to Hear From You
This example provides context on how you can start working with Moonbeam and trying out its Ethereum compatibility features, such as the web3.js library. We are interested in hearing about your experience following the steps in this guide or trying other Ethereum-based tools with Moonbeam. Feel free to join us in the [Moonbeam Discord](https://discord.gg/PfpUATX). We would love to hear your feedback on Moonbeam and answer any questions that you have.
