---
title: Using Web3
description: Learn how send Moonbeam transactions with a simple script using web3.
---

#Setting Using Web3 to sign Moonbeam transactions
##Introduction  
This guide walks through the process of using Web3 to manually sign and send a transaction to a Moonbeam dev node. For this example, we will use Node.js and straightforward Javascript code.

The examples on this guide are based on a Ubuntu 18.04 environment and assumes that you have a local Moonbeam node running in --dev mode, you can find instructions to setup a local Moonbeam node [here](/getting-started/setting-up-a-node/).

!!! note
    This tutorial was created using the pre-alpha release of [Moonbeam](https://github.com/PureStake/moonbeam/tree/moonbeam-tutorials).  The Moonbeam platform, and the [Frontier](https://github.com/paritytech/frontier) components it relies on for Substrate-based Ethereum compatibility, are still under very active development.  We have created this tutorial so you can test out Moonbeam’s Ethereum compatibility features.  Even though we are still in development, we believe it’s important that interested community members and developers have the opportunity to start to try things with Moonbeam and provide feedback.

##Checking Prerequisites
If you followed setting up a local Moonbeam node tutorial, you should have a local Moonbeam node producing blocks that looks like this:

![Moonbeam local node](/images/web3-transaction-1.png)

In addition, for this tutorial, we need to install Node.js and the npm package manager. You can do this by running in your terminal:

```
sudo apt install nodejs
sudo apt install npm
```

We can verify everything installed correctly by querying the version for each package:

```
node -v
npm -v
```

As of the writing of this guide, versions used were 8.10.0 and 3.5.2, respectively. Next, we can create a directory to store all our relevant files (in a separate path from the local Moonbeam node files), and create a simple package.json file by running:

```
mkdir transaction
cd transaction/
npm init --yes
```

With the package.json file created, we can then install the Web3 package, by executing:

```
npm install --save web3
```

To verify the installed version of Web3 you can use the ls command:

```
npm ls web3
```

As of the writing of this guide, the version used was 1.2.9. 

##The Transaction File
For our example, we only need a single Javascript file (named arbitrarily _transaction.js_, which you can find [here](/getting-started/transaction.js)) to make the transaction, which we will run using the `node` command in the terminal. The script will transfer 100 ETH from the genesis account to another address. For simplicity, the file is divided into three sections: variable definition, create transaction and deploy transaction.

In the variable definitions, first, create our web3 constructor (`Web3`). Define the `privKey` variable as the private key of our genesis account, where all the funds are stored when deploying your local Moonbeam node, and this is also used to sign the transactions. Then, set the from and to addresses, make sure to use another address from your local Metamask account as the value of `toAddress`. And lastly, create a local web3 instance, where we set the provider to connect to our local Moonbeam node.

!!! note 
    Remember to change the _addressTo_ variable to another address provided by your Metamask wallet.

```
const Web3 = require('web3');

// Variables definition
const privKey =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';
const addressFrom = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
const addressTo = '0xB90168C8CBcd351D069ffFdA7B71cd846924d551';
const web3 = new Web3('http://localhost:9933');
```

Both "create transaction" and "deploy transaction" are wrapped in an asynchronous function that handles the promises from our web3 instance. To create the transaction, we use the `web3.eth.accounts.signTransaction(tx, privKey)` command, where we have to define the tx object with some parameters such as: `addressFrom`, `addressTo`, amount of tokens to send and the gas limit. Note that the number of tokens need to be given in Wei, but we can use the web3 toWei utility to convert units. The private key must be provided as well to sign the transaction.

```
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

Note that the value "4294967295" for gas (referred to as the gas limit) needs to be manually set. As of the writing of this guide, we are working through some issues related to gas estimation in Moonbeam. Once these are fixed, this manual setting of the gas limit shouldn’t be necessary.

With the transaction message created and signed (you can `console.log(createTransaction)` to see the v-r-s values), we can now deploy it using the `web3.eth.sendSignedTransaction(signedTx)` by providing the `rawTransaction` from the `createTransaction` object. Lastly, we run our deploy function.

```
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
So basically, our complete _transaction.js_ script looks like this:

```
const Web3 = require('web3');

// Variables definition
const privKey =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342'; // Genesis private key
const addressFrom = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
const addressTo = '0xB90168C8CBcd351D069ffFdA7B71cd846924d551';
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
Before running the script, we need another file to check the balances of both addresses before and after the transaction is executed. We can easily do this by leveraging the Ethereum compatibility features of Moonbeam. For simplicity, the balance file (named arbitrarily _balances.js_, which you can find [here](/getting-started/balances.js)) is composed of two sections: the variables definition and the balance call.

The variable definition is the same as for the previous transaction file, the only difference is that we do not need the private key as this is only a call function (reading data from the local Moonbeam node).

To get the balances of our addresses we need to make an asynchronous function that uses the `web3.eth.getBalance(address)` command. We can take advantage of the `web3.utils.fromWei()` function to transform the balance into a more readable number in ETH. 

So basically, our _balances.js_ script looks like this:

```
const Web3 = require('web3');

// Variables definition
const addressFrom = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
const addressTo = '0xB90168C8CBcd351D069ffFdA7B71cd846924d551';
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


