---
title: Using Web3 for Transactions
description: Learn how to send transactions on Moonbeam with a simple script using Web3.
---

#Using Web3 to Sign Moonbeam Transactions
<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed//OEphJq-MWgU' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style><div class='caption'>You can find all of the relevant code for this tutorial on the [code snippets page](/resources/code-snippets/)</div>

##Introduction  
This guide walks through the process of using Web3 to manually sign and send a transaction to a Moonbeam dev node. For this example, we will use Node.js and straightforward JavaScript code.

The examples in this guide are based on a Ubuntu 18.04 environment and assume that you have a local Moonbeam node running in --dev mode. You can find instructions to setup a local Moonbeam node [here](/getting-started/setting-up-a-node/).

!!! note
    This tutorial was created using the pre-alpha release of [Moonbeam](https://github.com/PureStake/moonbeam/tree/moonbeam-tutorials).  The Moonbeam platform, and the [Frontier](https://github.com/paritytech/frontier) components it relies on for Substrate-based Ethereum compatibility, are still under very active development.  We have created this tutorial so you can test out Moonbeam’s Ethereum compatibility features.  Even though we are still in development, we believe it’s important that interested community members and developers have the opportunity to start to try things with Moonbeam and provide feedback.

##Checking Prerequisites
If you followed the [tutorial](/getting-started/setting-up-a-node/), you should have a local Moonbeam node producing blocks that looks like this:

![Moonbeam local node](/images/web3-transaction-1.png)

In addition, for this tutorial, we need to install Node.js (we'll go for v14.x) and the npm package manager. You can do this by running in your terminal:

```
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install -y nodejs
```

We can verify that everything installed correctly by querying the version for each package:

```
node -v
npm -v
```

As of the writing of this guide, versions used were 14.6.0 and 6.14.6, respectively.

Next, we can create a directory to store all our relevant files (in a separate path from the local Moonbeam node files), and create a simple package.json file by running:

```
mkdir transaction
cd transaction/
npm init --yes
```

With the package.json file created, we can then install the Web3 package by executing:

```
npm install --save web3
```

To verify the installed version of Web3, you can use the `ls` command:

```
npm ls web3
```

As of the writing of this guide, the version used was 1.2.9. 

##The Transaction File
For our example, we only need a single JavaScript file (arbitrarily named _transaction.js_, which you can find [here](/code-snippets/transaction.js)) to create the transaction, which we will run using the `node` command in the terminal. The script will transfer 100 ETH from the genesis account to another address. For simplicity, the file is divided into three sections: variable definition, create transaction, and deploy transaction.

We need to set a couple of values in the variable definitions:

1. Create our Web3 constructor (`Web3`).
2. Define the `privKey` variable as the private key of our genesis account, which is where all the funds are stored when deploying your local Moonbeam node, and what is used to sign the transactions.
3. Set the "from" and "to" addresses, making sure to set the value of `toAddress` to a different address than your local MetaMask account.
4. Create a local Web3 instance and set the provider to connect to our local Moonbeam node.

!!! note 
    Remember to change the _addressTo_ variable to another address provided by your MetaMask wallet.

```js
const Web3 = require('web3');

// Variables definition
const privKey =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';
const addressFrom = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
const addressTo = '0xB90168C8CBcd351D069ffFdA7B71cd846924d551';
const web3 = new Web3('http://localhost:9933');
```

Both "create transaction" and "deploy transaction" are wrapped in an asynchronous function that handles the promises from our Web3 instance. To create the transaction, we use the `web3.eth.accounts.signTransaction(tx, privKey)` command, where we have to define the tx object with some parameters such as: `addressFrom`, `addressTo`, number of tokens to send, and the gas limit.

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
         gas: '4294967295',
      },
      privKey
   );
```

!!! note 
    Currently, the value "4294967295" for gas (referred to as the gas limit) needs to be manually set. As of the writing of this guide, we are working through some issues related to gas estimation in Moonbeam. Once these are fixed, this manual setting of the gas limit shouldn’t be necessary.

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
const Web3 = require('web3');

// Variables definition
const privKey =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342'; // Genesis private key
const addressFrom = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
const addressTo = '0xB90168C8CBcd351D069ffFdA7B71cd846924d551'; // Enter your  Address here
const web3 = new Web3('http://localhost:9933');

// Create transaction
const deploy = async () => {
   console.log(
      `Attempting to make transaction from ${addressFrom} to ${addressTo}`
   );

   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         from: addressFrom,
         to: addressTo,
         value: web3.utils.toWei('100', 'ether'),
         gas: '4294967295',
      },
      privKey
   );

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

## The Balance File
Before running the script, we need another file to check the balances of both addresses before and after the transaction is executed. We can easily do this by leveraging the Ethereum compatibility features of Moonbeam.

For simplicity, the balance file (named arbitrarily _balances.js_, which you can find [here](/code-snippets/balances.js)), is composed of two sections: the variables definition and the balance call.  The variables definition is nearly the same as for the previous transaction file; the only difference is that we do not need the private key, as this is only a call function (reading data from the local Moonbeam node).

To get the balances of our addresses, we need to make an asynchronous function that uses the `web3.eth.getBalance(address)` command. We can take advantage of the `web3.utils.fromWei()` function to transform the balance into a more readable number in ETH. 

So basically, our _balances.js_ script looks like this:

```js
const Web3 = require('web3');

// Variables definition
const addressFrom = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
const addressTo = '0xB90168C8CBcd351D069ffFdA7B71cd846924d551'; // Enter your  Address here
const web3 = new Web3('http://localhost:9933');

// Balance call
const balances = async () => {
   const balanceFrom = web3.utils.fromWei(
      await web3.eth.getBalance(addressFrom),
      'ether'
   );
   const balanceTo = await web3.utils.fromWei(
      await web3.eth.getBalance(addressTo),
      'ether'
   );

   console.log(`The balance of ${addressFrom} is: ${balanceFrom} ETH.`);
   console.log(`The balance of ${addressTo} is: ${balanceTo} ETH.`);
};

balances();
```

## Running the Scripts
First, let's check the balances of both of our addresses before the transaction by running:

```
node balances.js
```

The output of the execution is the following:

![Balances before transaction](/images/web3-transaction-2.png)

We can run our _transaction.js_ script from the terminal window:

```
node transaction.js
```

The output of the execution is the following:

![Balances before transaction](/images/web3-transaction-3.png)

And we can check the new balances:

![Balances before transaction](/images/web3-transaction-4.png)

##We Want to Hear From You
This is a fairly simple example, but it provides context for how you can start working with Moonbeam and how you can try out its Ethereum compatibility features. We are interested in hearing about your experience following the steps in this guide or your experience trying other Ethereum-based tools with Moonbeam. Feel free to join us in the [Moonbeam Riot room here](https://matrix.to/#/!dzULkAiPePEaverEEP:matrix.org?via=matrix.org&via=web3.foundation). We would love to hear your feedback on Moonbeam and answer any questions that you have.
