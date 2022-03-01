---
title: Web3.js
description: Follow this tutorial to learn how to use the Ethereum Web3 JavaScript Library to deploy Solidity smart contracts to Moonbeam.
---
# Web3.js JavaScript Library

![Intro diagram](/images/builders/build/eth-api/libraries/web3js/web3js-banner.png)

## Introduction {: #introduction } 

[Web3.js](https://web3js.readthedocs.io/){target=blank} is a set of libraries that allow developers to interact with Ethereum nodes using HTTP, IPC, or WebSocket protocols with JavaScript. Moonbeam has an Ethereum-like API available that is fully compatible with Ethereum-style JSON RPC invocations. Therefore, developers can leverage this compatibility and use the web3.js library to interact with a Moonbeam node as if they were doing so on Ethereum.

In this guide, you'll learn how to use the web3.js library to send a transaction and deploy a contract on Moonbase Alpha. This guide can be adapted for [Moonbeam](builders/get-started/networks/moonbeam/){target=blank}, [Moonriver](builders/get-started/networks/moonriver/){target=blank}, or a [Moonbeam development node](builders/get-started/networks/moonbeam-dev/){target=blank}.

## Checking Prerequisites {: #checking-prerequisites } 

To get started, you can create a directory to store all of the files you'll be creating throughout this guide:

```
mkdir web3-examples && cd web3-examples
```

For this guide, you'll need to install the web3.js library and the Solidity compiler. To install both NPM packages, you can run the following command:

```
npm install web3 solc@0.8.0
```

You will also need to have an account with funds, which you can get from [Mission Control](/builders/get-started/moonbase/#get-tokens/)

!!! note
    --8<-- 'text/common/assumes-mac-or-ubuntu-env.md'

## Setup Web3.js with Moonbeam {: #setup-web3-with-moonbeam } 

The simplest setup to start using the library and its methods is the following:

```js
const Web3 = require('web3');

// Create web3 instance
const web3 = new Web3('{{ networks.moonbase.rpc_url }}');
```

Depending on which network you want to connect to, you can update the `RPC_URL` as needed:

=== "Moonbeam"
    ```
    {{ networks.moonbeam.rpc_url }}
    ```

=== "Moonriver"
    ```
    {{ networks.moonriver.rpc_url }}
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.rpc_url }}
    ```

=== "Moonbeam Dev Node"
    ```
    {{ networks.development.rpc_url }}
    ```

## Send a Transaction {: #send-a-transaction }

During this section, you'll be creating a couple of scripts. The first one will be to check the balances of your accounts before trying to send a transaction. The second script will actually send the transaction. 

You can also use the balance script to check the account balances after the transaction has been sent.

### Check Balances Script {: #check-balances-script }

You'll only need one file to check the balances of both addresses before and after the transaction is sent.  To get started, you can create a `balances.js` file by running:

```
touch balances.js
```

Next, you will create the script for this file and complete the following steps:

1. [Set up the Web3 provider](#setup-web3-with-moonbeam)
2. Define the `addressFrom` and `addressTo` variables
3. Create the asynchronous `balances` function which wraps the `web3.eth.getBalance` method
4. Use the `web3.eth.getBalance` function to fetch the balances for the `addressFrom` and `addressTo` addresses. You can also leverage the `web3.utils.fromWei` function to transform the balance into a more readable number in ETH
5. Lastly, run the `balances` function

```js
--8<-- 'code/web3-tx-local/balances.js'
```

To run the script and fetch the account balances, you can run the following command:

```
node balances.js
```

If successful, the balances for the origin and receiving address will be displayed in your terminal in ETH.

### Send Transaction Script {: #send-transaction-script }

You'll only need one file for executing a transaction between accounts. For this example, you'll be transferring 1 DEV token from an origin address (from which you hold the private key) to another address. To get started, you can create a `transaction.js` file by running:

```
touch transaction.js
```

Next, you will create the script for this file and complete the following steps:

1. [Set up the Web3 provider](#setup-web3-with-moonbeam)
2. Define the `addressFrom`, including the `privateKey`, and the `addressTo` variables. The private key is required to create a wallet instance. **Note: This is for example purposes only. Never store your private keys in a JavaScript file**
3. Create the asynchronous `send` function which wraps the transaction object and the sign and send transaction functions
4. Create and sign the transaction using the `web3.eth.accounts.signTransaction` function. Pass in the `gas`, `addressTo`, and `value` for the transaction along with the sender's `privateKey`
5. Send the signed transaction using the `web3.eth.sendSignedTransaction` method and pass in the raw transaction. Then use `await` to wait until the transaction is processed and the transaction receipt is returned
6. Lastly, run the `send` function

```js
--8<-- 'code/web3-tx-local/transaction.js'
```

To run the script, you can run the following command in your terminal:

```
node transaction.js
```

If the transaction was succesful, in your terminal you'll see the transaction hash has been printed out.

You can also use the `balances.js` script to check that the balances for the origin and receiving accounts have changed. The entire workflow would look like this:

![Send Tx Web3js](/images/builders/build/eth-api/libraries/web3js/web3js-1.png)

## Deploy a Contract {: #deploy-a-contract }

The contract you'll be compiling and deploying in the next couple of sections is a simple incrementer contract, arbitrarily named _Incrementer.sol_. You can get started by creating a file for the contract:

```
touch Incrementer.sol
```

Next you can add the Solidity code to the file:

```solidity
--8<-- 'code/web3-contract-local/Incrementer.sol'
```

The `constructor` function, which runs when the contract is deployed, sets the initial value of the number variable stored on-chain (default is 0). The `increment` function adds the `_value` provided to the current number, but a transaction needs to be sent, which modifies the stored data. Lastly, the `reset` function resets the stored value to zero.

!!! note
    This contract is a simple example for illustration purposes only and does not handle values wrapping around.

### Compile Contract Script {: #compile-contract-script }  /// TODO: create snippet

In this section, you'll create a script that uses the Solidity compiler to output the bytecode and interface (ABI) for the `Incrementer.sol` contract. To get started, you can create a `compile.js` file by running:

```
touch compile.js
```

Next, you will create the script for this file and complete the following steps:

1. Import the `fs` and `solc` packages
2. Using the `fs.readFileSync` function, you'll read and save the file contents of `Incrementer.sol` to `source`
3. Build the `input` object for the Solidity compiler by specifying the `language`, `sources`, and `settings` to be used
4. Using the `input` object, you can compile the contract using `solc.compile`
5. Extract the compiled contract file and export it to be used in the deployment script

```js
--8<-- 'code/web3-contract-local/compile.js'
```

### Deploy Contract Script {: #deploy-contract-script }

With the script for compiling the `Incrementer.sol` contract in place, you can then use the results to send a signed transaction that deploys it. To do so, you can create a file for the deployment script called `deploy.js`:

```
touch deploy.js
```

Next, you will create the script for this file and complete the following steps:

1. Import the contract file from `compile.js`
2. [Set up the Web3 provider](#setup-web3-with-moonbeam)
3. Define the `addressFrom`, including the `privateKey`, and the `addressTo` variables. The private key is required to create a wallet instance. **Note: This is for example purposes only. Never store your private keys in a JavaScript file**
4. Save the `bytecode` and `abi` for the compiled contract
5. Create the asynchronous `deploy` function that will be used to deploy the contract
6. Create the contract instance using the `web3.eth.Contract` function
7. Create the constructor and pass in the `bytecode` and the initial value for the incrementer. For this example, you can se the initial value to `5`
8. Create and sign the transaction using the `web3.eth.accounts.signTransaction` function. Pass in the `data` and the `gas` for the transaction along with the sender's `privateKey`
9. Send the signed transaction using the `web3.eth.sendSignedTransaction` method and pass in the raw transaction. Then use `await` to wait until the transaction is processed and the transaction receipt is returned
10. Lastly, run the `deploy` function

```js
--8<-- 'code/web3-contract-local/deploy.js'
```

To run the script, you can enter the following command into your terminal:

```
node deploy.js
```

If successful, the contract's address will be displayed in the terminal.

![Deploy Contract Web3js](/images/builders/build/eth-api/libraries/web3js/web3js-2.png)

### Read Contract Data (Call Methods) {: #read-contract-data }

Call methods are the type of interaction that don't modify the contract's storage (change variables), meaning no transaction needs to be sent. They simply read various storage variables of the deployed contract.

To get started, you can create a file and name it `get.js`:

```
touch get.js
```

Then you can take the following steps to create the script:

1. Import the `abi` from the `compile.js` file
2. [Set up the Web3 provider](#setup-web3-with-moonbeam)
3. Create the `contractAddress` variable using the address of the deployed contract
4. Create an instance of the contract using the `web3.eth.Contract` function and passing in the `abi` and  `contractAddress`
5. Create the asynchronous `get` function
6. Use the contract instance to call one of the contract's methods and pass in any inputs if necessary. For this example, you will call the `number` method which doesn't require any inputs. You can use `await` which will return the value requested once the request promise resolves
7. Lastly, call the `get` function

```js
--8<-- 'code/web3-contract-local/get.js'
```

To run the script, you can enter the following command in your terminal:

```
node get.js
```

If successful, the value will be displayed in the terminal.

### Interact with Contract (Send Methods) {: #interact-with-contract }

Send methods are the type of interaction that modify the contract's storage (change variables), meaning a transaction needs to be signed and sent. In this section, you'll create two scripts: one to increment and one to reset the incrementer. To get started, you can create a file for each script and name them `increment.js` and `reset.js`:

```
touch increment.js reset.js
```

Open the `increment.js` file and take the following steps to create the script:

1. Import the `abi` from the `compile.js` file
2. [Set up the Web3 provider](#setup-web3-with-moonbeam)
3. Define the `privateKey` for the origin account, the `contractAddress` of the deployed contract, and the `_value` to increment by. The private key is required to create a wallet instance. **Note: This is for example purposes only. Never store your private keys in a JavaScript file**
4. Create an instance of the contract using the `web3.eth.Contract` function and passing in the `abi` and  `contractAddress`
5. Use the contract instance to build the increment transaction using the `methods.increment` function and passing in the `_value` as an input
6. Create the asynchronous `increment` function
7. Use the contract instance and the increment transaction you previously created to sign the transaction with the sender's private key. You'll use the `web3.eth.accounts.signTransaction` function and specify the `to` address, the `data`, and the `gas` for the transaction
8. Send the signed transaction using the `web3.eth.sendSignedTransaction` method and pass in the raw transaction. Then use `await` to wait until the transaction is processed and the transaction receipt is returned
9. Lastly, call the `increment` function

```js
--8<-- 'code/web3-contract-local/increment.js'
```

To run the script, you can enter the following command in your terminal:

```
node increment.js
```

If successful, the transaction hash will be displayed in the terminal. You can use the `get.js` script alongside the `increment.js` script to make sure that value is changing as expected:

![Increment Contract Web3js](/images/builders/build/eth-api/libraries/web3js/web3js-3.png)

Next you can open the `reset.js` file and take the following steps to create the script:

1. Import the `abi` from the `compile.js` file
2. [Set up the Web3 provider](#setup-web3-with-moonbeam)
3. Define the `privateKey` for the origin account and the `contractAddress` of the deployed contract. The private key is required to create a wallet instance. **Note: This is for example purposes only. Never store your private keys in a JavaScript file**
4. Create an instance of the contract using the `web3.eth.Contract` function and passing in the `abi` and  `contractAddress`
5. Use the contract instance to build the reset transaction using the `methods.reset` function
6. Create the asynchronous `reset` function
7. Use the contract instance and the reset transaction you previously created to sign the transaction with the sender's private key. You'll use the `web3.eth.accounts.signTransaction` function and specify the `to` address, the `data`, and the `gas` for the transaction
8. Send the signed transaction using the `web3.eth.sendSignedTransaction` method and pass in the raw transaction. Then use `await` to wait until the transaction is processed and the transaction receipt is returned
9. Lastly, call the `reset` function

```js
--8<-- 'code/web3-contract-local/increment.js'
```

To run the script, you can enter the following command in your terminal:

```
node reset.js
```

If successful, the transaction hash will be displayed in the terminal. You can use the `get.js` script alongside the `reset.js` script to make sure that value is changing as expected:

![Reset Contract Web3js](/images/builders/build/eth-api/libraries/web3js/web3js-4.png)

--8<-- 'text/disclaimers/third-party-content.md'