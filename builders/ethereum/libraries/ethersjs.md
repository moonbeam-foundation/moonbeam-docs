---
title: How to use Ethers.js Ethereum Library
description: Follow this tutorial to learn how to use the Ethereum Ethers.js Library to send transactions and deploy Solidity smart contracts to Moonbeam.
categories: Libraries and SDKs, Ethereum Toolkit
---


# Ethers.js JavaScript Library

## Introduction {: #introduction }

The [Ethers.js](https://docs.ethers.org/v6){target=\_blank} library provides a set of tools to interact with Ethereum Nodes with JavaScript, similar to Web3.js. Moonbeam has an Ethereum-like API available that is fully compatible with Ethereum-style JSON-RPC invocations. Therefore, developers can leverage this compatibility and use the Ethers.js library to interact with a Moonbeam node as if they were doing so on Ethereum. For more information on Ethers.js, check their [documentation site](https://docs.ethers.org/v6){target=\_blank}.

In this guide, you'll learn how to use the Ethers.js library to send a transaction and deploy a contract on Moonbase Alpha. This guide can be adapted for [Moonbeam](/builders/get-started/networks/moonbeam/){target=\_blank}, [Moonriver](/builders/get-started/networks/moonriver/){target=\_blank}, or a [Moonbeam development node](/builders/get-started/networks/moonbeam-dev/){target=\_blank}.

## Checking Prerequisites {: #checking-prerequisites }

For the examples in this guide, you will need to have the following:

- An account with funds.
    --8<-- 'text/_common/faucet/faucet-list-item.md'
    --8<-- 'text/_common/endpoint-examples-list-item.md'

!!! note

    --8<-- 'text/_common/assumes-mac-or-ubuntu-env.md'

## Installing Ethers.js {: #install-ethersjs }

To get started, you'll need to start a basic JavaScript project. First, create a directory to store all of the files you'll be creating throughout this guide and initialize the project with the following command:

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/1.sh'
```

For this guide, you'll need to install the Ethers.js library and the Solidity compiler. To install both NPM packages, you can run the following command:

=== "npm"

    ```bash
    --8<-- 'code/builders/ethereum/libraries/ethersjs/2.sh'
    ```

=== "yarn"

    ```bash
    --8<-- 'code/builders/ethereum/libraries/ethersjs/3.sh'
    ```

## Setting up the Ethers Provider {: #setting-up-the-ethers-provider }

Throughout this guide, you'll be creating a bunch of scripts that provide different functionality such as sending a transaction, deploying a contract, and interacting with a deployed contract. In most of these scripts you'll need to create an [Ethers provider](https://docs.ethers.org/v6/api/providers/){target=\_blank} to interact with the network.

--8<-- 'text/_common/endpoint-setup.md'

To create a provider, you can take the following steps:

1. Import the `ethers` library
1. Define the `providerRPC` object, which can include the network configurations for any of the networks you want to send a transaction on. You'll include the `name`, `rpc`, and `chainId` for each network
1. Create the `provider` using the `ethers.JsonRpcProvider` method

=== "Moonbeam"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethersjs/4.js'
    ```

=== "Moonriver"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethersjs/5.js'
    ```

=== "Moonbase Alpha"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethersjs/6.js'
    ```

=== "Moonbeam Dev Node"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethersjs/7.js'
    ```

Save this code snippet as you'll need it for the scripts that are used in the following sections.

## Send a Transaction {: #send-a-transaction }

During this section, you'll be creating a couple of scripts. The first one will be to check the balances of your accounts before trying to send a transaction. The second script will actually send the transaction.

You can also use the balance script to check the account balances after the transaction has been sent.

### Check Balances Script {: #check-balances-script }

You'll only need one file to check the balances of both addresses before and after the transaction is sent. To get started, you can create a `balances.js` file by running:

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/8.sh'
```

Next, you will create the script for this file and complete the following steps:

1. [Set up the Ethers provider](#setting-up-the-ethers-provider)
1. Define the `addressFrom` and `addressTo` variables
1. Create the asynchronous `balances` function which wraps the `provider.getBalance` method
1. Use the `provider.getBalance` function to fetch the balances for the `addressFrom` and `addressTo` addresses. You can also leverage the `ethers.formatEther` function to transform the balance into a more readable number in ETH
1. Lastly, run the `balances` function

```js
--8<-- 'code/builders/ethereum/libraries/ethersjs/9.js'
```

??? code "View the complete script"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethers-js/balances.js'
    ```

To run the script and fetch the account balances, you can run the following command:

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/10.sh'
```

If successful, the balances for the origin and receiving address will be displayed in your terminal in DEV.

### Send Transaction Script {: #send-transaction-script }

You'll only need one file for executing a transaction between accounts. For this example, you'll be transferring 1 DEV token from an origin address (from which you hold the private key) to another address. To get started, you can create a `transaction.js` file by running:

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/11.sh'
```

Next, you will create the script for this file and complete the following steps:

1. [Set up the Ethers provider](#setting-up-the-ethers-provider)
1. Define the `privateKey` and the `addressTo` variables. The private key is required to create a wallet instance. **Note: This is for example purposes only. Never store your private keys in a JavaScript file**
1. Create a wallet using the `privateKey` and `provider` from the previous steps. The wallet instance is used to sign transactions
1. Create the asynchronous `send` function which wraps the transaction object and the `wallet.sendTransaction` method
1. Create the transaction object which only requires the recipient's address and the amount to send. Note that `ethers.parseEther` can be used, which handles the necessary unit conversions from Ether to Wei - similar to using `ethers.parseUnits(value, 'ether')`
1. Send the transaction using the `wallet.sendTransaction` method and then use `await` to wait until the transaction is processed and the transaction receipt is returned
1. Lastly, run the `send` function

```js
--8<-- 'code/builders/ethereum/libraries/ethersjs/12.js'
```

??? code "View the complete script"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethers-js/transaction.js'
    ```

To run the script, you can run the following command in your terminal:

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/13.sh'
```

If the transaction was successful, in your terminal you'll see the transaction hash has been printed out.

You can also use the `balances.js` script to check that the balances for the origin and receiving accounts have changed. The entire workflow would look like this:

--8<-- 'code/builders/ethereum/libraries/ethers-js/terminal/transaction.md'

## Deploy a Contract {: #deploy-a-contract }

--8<-- 'text/builders/ethereum/libraries/contract.md'

### Compile Contract Script {: #compile-contract-script }

--8<-- 'text/builders/ethereum/libraries/compile-js.md'

--8<-- 'text/builders/ethereum/libraries/compile.md'

```js
--8<-- 'code/builders/ethereum/libraries/compile.js'
```

### Deploy Contract Script {: #deploy-contract-script }

With the script for compiling the `Incrementer.sol` contract in place, you can then use the results to send a signed transaction that deploys it. To do so, you can create a file for the deployment script called `deploy.js`:

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/14.sh'
```

Next, you will create the script for this file and complete the following steps:

1. Import the contract file from `compile.js`
1. [Set up the Ethers provider](#setting-up-the-ethers-provider)
1. Define the `privateKey` for the origin account. The private key is required to create a wallet instance. **Note: This is for example purposes only. Never store your private keys in a JavaScript file**
1. Create a wallet using the `privateKey` and `provider` from the previous steps. The wallet instance is used to sign transactions
1. Load the contract `bytecode` and `abi` for the compiled contract
1. Create a contract instance with signer using the `ethers.ContractFactory` function, providing the `abi`, `bytecode`, and `wallet` as parameters
1. Create the asynchronous `deploy` function that will be used to deploy the contract
1. Within the `deploy` function, use the `incrementer` contract instance to call `deploy` and pass in the initial value. For this example, you can set the initial value to `5`. This will send the transaction for contract deployment. To wait for a transaction receipt you can use the `deployed` method of the contract deployment transaction
1. Lastly, run the `deploy` function

```js
--8<-- 'code/builders/ethereum/libraries/ethersjs/15.js'
```

??? code "View the complete script"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethers-js/deploy.js'
    ```

To run the script, you can enter the following command into your terminal:

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/16.sh'
```

If successful, the contract's address will be displayed in the terminal.

--8<-- 'code/builders/ethereum/libraries/ethers-js/terminal/deploy.md'

### Read Contract Data (Call Methods) {: #read-contract-data }

Call methods are the type of interaction that don't modify the contract's storage (change variables), meaning no transaction needs to be sent. They simply read various storage variables of the deployed contract.

To get started, you can create a file and name it `get.js`:

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/17.sh'
```

Then you can take the following steps to create the script:

1. Import the `abi` from the `compile.js` file
1. [Set up the Ethers provider](#setting-up-the-ethers-provider)
1. Create the `contractAddress` variable using the address of the deployed contract
1. Create an instance of the contract using the `ethers.Contract` function and passing in the `contractAddress`, `abi`, and `provider`
1. Create the asynchronous `get` function
1. Use the contract instance to call one of the contract's methods and pass in any inputs if necessary. For this example, you will call the `number` method which doesn't require any inputs. You can use `await` which will return the value requested once the request promise resolves
1. Lastly, call the `get` function

```js
--8<-- 'code/builders/ethereum/libraries/ethersjs/18.js'
```

??? code "View the complete script"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethers-js/get.js'
    ```

To run the script, you can enter the following command in your terminal:

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/19.sh'
```

If successful, the value will be displayed in the terminal.

### Interact with Contract (Send Methods) {: #interact-with-contract }

Send methods are the type of interaction that modify the contract's storage (change variables), meaning a transaction needs to be signed and sent. In this section, you'll create two scripts: one to increment and one to reset the incrementer. To get started, you can create a file for each script and name them `increment.js` and `reset.js`:

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/20.sh'
```

Open the `increment.js` file and take the following steps to create the script:

1. Import the `abi` from the `compile.js` file
1. [Set up the Ethers provider](#setting-up-the-ethers-provider)
1. Define the `privateKey` for the origin account, the `contractAddress` of the deployed contract, and the `_value` to increment by. The private key is required to create a wallet instance. **Note: This is for example purposes only. Never store your private keys in a JavaScript file**
1. Create a wallet using the `privateKey` and `provider` from the previous steps. The wallet instance is used to sign transactions
1. Create an instance of the contract using the `ethers.Contract` function and passing in the `contractAddress`, `abi`, and `provider`
1. Create the asynchronous `increment` function
1. Use the contract instance to call one of the contract's methods and pass in any inputs if necessary. For this example, you will call the `increment` method which requires the value to increment by as an input. You can use `await` which will return the value requested once the request promise resolves
1. Lastly, call the `increment` function

```js
--8<-- 'code/builders/ethereum/libraries/ethersjs/21.js'
```

??? code "View the complete script"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethers-js/increment.js'
    ```

To run the script, you can enter the following command in your terminal:

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/22.sh'
```

If successful, the transaction hash will be displayed in the terminal. You can use the `get.js` script alongside the `increment.js` script to make sure that value is changing as expected:

--8<-- 'code/builders/ethereum/libraries/ethers-js/terminal/increment.md'

Next you can open the `reset.js` file and take the following steps to create the script:

1. Import the `abi` from the `compile.js` file
1. [Set up the Ethers provider](#setting-up-the-ethers-provider)
1. Define the `privateKey` for the origin account and the `contractAddress` of the deployed contract. The private key is required to create a wallet instance. **Note: This is for example purposes only. Never store your private keys in a JavaScript file**
1. Create a wallet using the `privateKey` and `provider` from the previous steps. The wallet instance is used to sign transactions
1. Create an instance of the contract using the `ethers.Contract` function and passing in the `contractAddress`, `abi`, and `provider`
1. Create the asynchronous `reset` function
1. Use the contract instance to call one of the contract's methods and pass in any inputs if necessary. For this example, you will call the `reset` method which doesn't require any inputs. You can use `await` which will return the value requested once the request promise resolves
1. Lastly, call the `reset` function

```js
--8<-- 'code/builders/ethereum/libraries/ethersjs/23.js'
```

??? code "View the complete script"

    ```js
    --8<-- 'code/builders/ethereum/libraries/ethers-js/reset.js'
    ```

To run the script, you can enter the following command in your terminal:

```bash
--8<-- 'code/builders/ethereum/libraries/ethersjs/24.sh'
```

If successful, the transaction hash will be displayed in the terminal. You can use the `get.js` script alongside the `reset.js` script to make sure that value is changing as expected:

--8<-- 'code/builders/ethereum/libraries/ethers-js/terminal/reset.md'

--8<-- 'text/_disclaimers/third-party-content.md'
