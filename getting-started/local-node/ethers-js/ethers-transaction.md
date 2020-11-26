---
title: Send a Transaction
description: Learn how to create and send transactions on Moonbeam’s Ethereum-compatible network with a simple script using Ethers.js.
---

# Using Ethers.js to Send Transactions on Moonbeam

## Introduction
This guide walks through the process of using [ethers.js](https://docs.ethers.io/) to manually sign and send a transaction to a Moonbeam standalone node. For this example, we will use Node.js and straightforward JavaScript code.

The guide assumes that you have a local Moonbeam node running in `--dev` mode. You can find instructions to set up a local Moonbeam node [here](/getting-started/local-node/setting-up-a-node/).

!!! note
    This tutorial was created using the v3 release of [Moonbase Alpha](https://github.com/PureStake/moonbeam/releases/tag/v0.3.0). The Moonbeam platform, and the [Frontier](https://github.com/paritytech/frontier) components it relies on for Substrate-based Ethereum compatibility, are still under very active development. The examples in this guide assume an Ubuntu 18.04-based environment and will need to be adapted accordingly for MacOS or Windows.

## Checking Prerequisites
If you followed this [tutorial](/getting-started/local-node/setting-up-a-node/), you should have a standalone Moonbeam node producing blocks in your local environment, that looks like this:

![Moonbeam local node](/images/etherstx/ethers-transaction-1.png)

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

With the package.json file created, we can then install the ethers.js library by executing:

```
npm install ethers
```

To verify the installed version of ethers.js, you can use the `ls` command:

```
npm ls ethers
```

As of the writing of this guide, the version used was 5.0.22.

## The Transaction File
Similarly to our web3.js transaction tutorial, we only need a single JavaScript file (arbitrarily named _transaction.js_, which you can find [here](/code-snippets/ethers-tx-local/transaction.js)) to create and send the transaction, which we will run using the `node` command in the terminal. The script will transfer 100 ETH from the genesis account to another address. For simplicity, the file is divided into two sections: variable definition and deploy transaction.

In the first section we need to:

1. Define the `privKey` variable as the private key of our genesis account, which is where all the funds are stored when initiating your local Moonbeam node, and what is used to sign the transactions. In ethers.js we need to set the prefix `0x`
2. Define the `addressTo`, for example to one created by MetaMask when setting up a local wallet
3. Define our provider by passing in the RPC URL of our standalone Moonbeam node: `http://localhost:9933`
4. Define our wallet by passing in the `privKey` and the provider. The wallet has the methods necessary to send the transaction

!!! note
    Remember to change the _addressTo_ variable to another address provided by your MetaMask wallet.

```js
const ethers = require('ethers');

// Variables definition
const privKey =
   '0x99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';
const addressTo = 'ADDRESSTO';
const providerURL = 'http://localhost:9933';
// Define Provider
let provider = new ethers.providers.JsonRpcProvider(providerURL);
// Create Wallet
let wallet = new ethers.Wallet(privKey, provider);
```

Next, we need an asynchronous function that wraps the `wallet.sendTransaction(txObject)` method. The transaction object is quite simple, it only requires the address to where we want to send the tokens and the amount to send. Note that we use the `ethers.utils.parseEther()` which handles the necessary unit conversions from Ether to Wei, this is similar to using `ethers.utils.parseUnits(value,'ether')`.

```js
// Deploy Transaction
const send = async () => {
   console.log(
      `Attempting to send transaction from ${wallet.address} to ${addressTo}`
   );

   // Create Tx Object
   const tx = {
      to: addressTo,
      value: ethers.utils.parseEther('100'),
   };

   const createReceipt = await wallet.sendTransaction(tx);
   console.log(`Transaction successful with hash: ${createReceipt.hash}`);
};
```

To wrap up, our completes _transaction.js_ script looks like this:

```js
--8<-- 'ethers-tx-local/transaction.js'
```

## The Balance File
As done in previous examples, we need another file to check the balances of both addresses before and after the transaction is executed. We can easily do this by leveraging the Ethereum compatibility features of Moonbeam.

For simplicity, the balance file (named arbitrarily _balances.js_, which you can find [here](/code-snippets/ethers-tx-local/balances.js)), is composed of two sections: the variables definition and the balance call. The variables definition is nearly the same as for the previous transaction file; the only difference is that we do not need to define a wallet, as this is only a call function (reading data from the local Moonbeam node).

To get the balances of our addresses, we need to make an asynchronous function that uses the `provider.getBalance(address)` command. We can take advantage of the `ethers.utils.formatEther()` function to transform the balance into a more readable number in ETH, as we did before.

So basically, our _balances.js_ script looks like this:

```js
--8<-- 'ethers-tx-local/balances.js'
```
## Running the Scripts
First, let's check the balances of both of our addresses before the transaction by running:

```
node balances.js
```

The output of the execution is the following:

![Balances before transaction](/images/etherstx/ethers-transaction-2.png)

We can run our _transaction.js_ script from the terminal window:

```
node transaction.js
```

The output of the execution is the following:

![Deploy transaction](/images/etherstx/ethers-transaction-3.png)

And we can check the new balances:

![Balances after transaction](/images/etherstx/ethers-transaction-4.png)

## We Want to Hear From You
This is a fairly simple example, but it provides context for how you can start working with Moonbeam and how you can try out its Ethereum compatibility features. We are interested in hearing about your experience following the steps in this guide or your experience trying other Ethereum-based tools with Moonbeam. Feel free to join us in the [Moonbeam Discord here](https://discord.gg/PfpUATX). We would love to hear your feedback on Moonbeam and answer any questions that you have.