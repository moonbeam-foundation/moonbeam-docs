---
title: Send a Transaction
description: Learn how to create and send transactions on Moonbeam’s Ethereum-compatible network with a simple script using Web3.js.
---

# Using Web3.js to Send Transactions on Moonbeam
<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed//OEphJq-MWgU' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style><div class='caption'>You can find all of the relevant code for this tutorial on the [code snippets page](/resources/code-snippets/)</div>

## Introduction  
This guide walks through the process of using [web3.js](https://web3js.readthedocs.io/) to manually sign and send a transaction to a Moonbeam standalone node. For this example, we will use Node.js and straightforward JavaScript code.

The guide assumes that you have a local Moonbeam node running in `--dev` mode. You can find instructions to set up a local Moonbeam node [here](/getting-started/setting-up-a-node/).

!!! note
    This tutorial was created using the v3 release of [Moonbase Alpha](https://github.com/PureStake/moonbeam/releases/tag/v0.3.0). The Moonbeam platform, and the [Frontier](https://github.com/paritytech/frontier) components it relies on for Substrate-based Ethereum compatibility, are still under very active development. The examples in this guide assume an Ubuntu 18.04-based environment and will need to be adapted accordingly for MacOS or Windows.

## Checking Prerequisites
If you followed this [tutorial](/getting-started/setting-up-a-node/), you should have a standalone Moonbeam node producing blocks in your local environment, that looks like this:

![Moonbeam local node](/images/web3tx/web3-transaction-1.png)

In addition, we need to install Node.js (we'll go for v15.x) and the npm package manager. You can do this by running in your terminal:

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

As of the writing of this guide, versions used were 15.2.1 and 7.0.8, respectively.

Next, we can create a directory to store all our relevant files (in a separate path from the local Moonbeam node files) by running:

```
mkdir transaction && cd transaction/
```

And create a simple package.json file:

```
npm init --yes
```

With the package.json file created, we can then install the web3.js package by executing:

```
npm install web3
```

To verify the installed version of web3.js, you can use the `ls` command:

```
npm ls web3
```

As of the writing of this guide, the version used was 1.3.0.

## The Transaction File
For our example, we only need a single JavaScript file (arbitrarily named _transaction.js_, which you can find [here](/code-snippets/web3-tx-local/transaction.js)) to create and send the transaction, which we will run using the `node` command in the terminal. The script will transfer 100 ETH from the genesis account to another address. For simplicity, the file is divided into three sections: variable definition, create transaction, and deploy transaction.

We need to set a couple of values in the variable definitions:

1. Create our Web3 constructor (`Web3`).
2. Define the `privKey` variable as the private key of our genesis account, which is where all the funds are stored when deploying your local Moonbeam node, and what is used to sign the transactions.
3. Set the "from" and "to" addresses, making sure to set the value of `addressTo` to a different address, for example the one created by MetaMask when setting up a local wallet.
4. Create a local Web3 instance and set the provider to connect to our local Moonbeam node.

!!! note
    Remember to change the _addressTo_ variable to another address provided by your MetaMask wallet.

```js
const Web3 = require('web3');

// Variables definition
const privKey =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';
const addressFrom = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
const addressTo = '0x44236223aB4291b93EEd10E4B511B37a398DEE55';
const web3 = new Web3('http://localhost:9933');
```

Both the "create transaction" and "deploy transaction" sections are wrapped in an asynchronous function that handles the promises from our Web3 instance. To create the transaction, we use the `web3.eth.accounts.signTransaction(tx, privKey)` command, where we have to define the tx object with some parameters such as: `addressFrom`, `addressTo`, number of tokens to send, and the gas limit.

!!! note
    Note that the number of tokens needs to be given in Wei, but we can use the Web3 toWei utility to convert units. The private key must be provided as well to sign the transaction.

```js
// Create transaction
const deploy = async () => {
   console.log(
      `Attempting to send transaction from ${addressFrom} to ${addressTo}`
   );

   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         from: addressFrom,
         to: addressTo,
         value: web3.utils.toWei('100', 'ether'),
         gas: 21000,
      },
      privKey
   );
```

Since the transaction message has been created and signed (you can `console.log(createTransaction)` to see the v-r-s values), we can now deploy it using the `web3.eth.sendSignedTransaction(signedTx)` by providing the `rawTransaction` from the `createTransaction` object.

Lastly, we run our deploy function.

```js
// Deploy transaction
   const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
   );
   console.log(
      `Transaction successful with hash: ${createReceipt.transactionHash}`
   );
};

deploy();
```

So our completes _transaction.js_ script looks like this:

```js
--8<-- 'web3-tx-local/transaction.js'
```

## The Balance File
Before running the script, we need another file to check the balances of both addresses before and after the transaction is executed. We can easily do this by leveraging the Ethereum compatibility features of Moonbeam.

For simplicity, the balance file (named arbitrarily _balances.js_, which you can find [here](/code-snippets/web3-tx-local/balances.js)), is composed of two sections: the variables definition and the balance call. The variables definition is nearly the same as for the previous transaction file; the only difference is that we do not need the private key, as this is only a call function (reading data from the local Moonbeam node).

To get the balances of our addresses, we need to make an asynchronous function that uses the `web3.eth.getBalance(address)` command. We can take advantage of the `web3.utils.fromWei()` function to transform the balance into a more readable number in ETH.

So basically, our _balances.js_ script looks like this:

```js
--8<-- 'web3-tx-local/balances.js'
```

## Running the Scripts
First, let's check the balances of both of our addresses before the transaction by running:

```
node balances.js
```

The output of the execution is the following:

![Balances before transaction](/images/web3tx/web3-transaction-2.png)

We can run our _transaction.js_ script from the terminal window:

```
node transaction.js
```

The output of the execution is the following:

![Deploy transaction](/images/web3tx/web3-transaction-3.png)

And we can check the new balances:

![Balances after transaction](/images/web3tx/web3-transaction-4.png)

## We Want to Hear From You
This is a fairly simple example, but it provides context for how you can start working with Moonbeam and how you can try out its Ethereum compatibility features. We are interested in hearing about your experience following the steps in this guide or your experience trying other Ethereum-based tools with Moonbeam. Feel free to join us in the [Moonbeam Discord here](https://discord.gg/PfpUATX). We would love to hear your feedback on Moonbeam and answer any questions that you have.
