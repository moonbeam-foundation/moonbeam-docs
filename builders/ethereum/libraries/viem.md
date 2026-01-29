---
title: How to use viem Ethereum Library
description: Check out this tutorial to learn how to use the viem TypeScript interface for Ethereum to send transactions and deploy Solidity smart contracts to Moonbeam.
categories: Libraries and SDKs, Ethereum Toolkit
---


# viem TypeScript Ethereum Library

## Introduction {: #introduction }

[viem](https://viem.sh){target=\_blank} is a modular TypeScript library that allows developers to interact with abstractions over the JSON-RPC API, making it easy to interact with Ethereum nodes. Since Moonbeam has an Ethereum-like API available that is fully compatible with Ethereum-style JSON RPC invocations, developers can leverage this compatibility to interact with Moonbeam nodes. For more information on viem, check out their [documentation site](https://viem.sh/docs/getting-started){target=\_blank}.

In this guide, you'll learn how to use viem to send a transaction and deploy a contract on the Moonbase Alpha TestNet. This guide can be adapted for [Moonbeam](/builders/get-started/networks/moonbeam/){target=\_blank}, [Moonriver](/builders/get-started/networks/moonriver/){target=\_blank}, or a [Moonbeam development node](/builders/get-started/networks/moonbeam-dev/){target=\_blank}.

## Checking Prerequisites {: #checking-prerequisites }

For the examples in this guide, you will need to have the following:

- An account with funds.
    --8<-- 'text/_common/faucet/faucet-list-item.md'
- --8<-- 'text/_common/endpoint-examples-list-item.md'

!!! note

    --8<-- 'text/_common/assumes-mac-or-ubuntu-env.md'

## Installing viem {: #installing-viem }

To get started, you'll need to create a basic TypeScript project. First, create a directory to store all of the files you'll be creating throughout this guide, and initialize the project with the following command:

```bash
--8<-- 'code/builders/ethereum/libraries/viem/1.sh'
```

For this guide, you'll need to install the viem library and the Solidity compiler. To install both packages, you can run the following command:

=== "npm"

    ```bash
    --8<-- 'code/builders/ethereum/libraries/viem/2.sh'
    ```

=== "yarn"

    ```bash
    --8<-- 'code/builders/ethereum/libraries/viem/3.sh'
    ```

You can create a TypeScript configuration file by running:

```bash
--8<-- 'code/builders/ethereum/libraries/viem/4.sh'
```

!!! note

    This tutorial was created using Node.js v18.18.0.

## Set Up a viem Client (Provider) {: #setting-up-a-viem-provider }

Throughout this guide, you'll be creating a bunch of scripts that provide different functionality, such as sending a transaction, deploying a contract, and interacting with a deployed contract. In most of these scripts, you'll need to create a [viem client](https://docs.ethers.org/v6/api/providers/){target=\_blank} to interact with the network.

--8<-- 'text/_common/endpoint-setup.md'

You can create a viem client for reading chain data, like balances or contract data, using the `createPublicClient` function, or you can create a viem client for writing chain data, like sending transactions, using the `createWalletClient` function.

### For Reading Chain Data {: #for-reading-chain-data }

To create a client for reading chain data, you can take the following steps:

1. Import the `createPublicClient` and `http` functions from `viem` and the network you want to interact with from `viem/chains`. The chain can be any of the following: `moonbeam`, `moonriver`, or `moonbaseAlpha`
1. Create the `client` using the `createPublicClient` function and pass in the network and the HTTP RPC endpoint

=== "Moonbeam"

    ```ts
    --8<-- 'code/builders/ethereum/libraries/viem/5.ts'
    ```

=== "Moonriver"

    ```ts
    --8<-- 'code/builders/ethereum/libraries/viem/6.ts'
    ```

=== "Moonbase Alpha"

    ```ts
    --8<-- 'code/builders/ethereum/libraries/viem/7.ts'
    ```

=== "Moonbeam Dev Node"

    ```ts
    --8<-- 'code/builders/ethereum/libraries/viem/8.ts'
    ```

### For Writing Chain Data {: #for-writing-chain-data }

To create a client for writing chain data, you can take the following steps:

1. Import the `createWalletClient` and `http` functions from `viem`, the `privateKeyToAccount` function for loading your accounts via their private keys, and the network you want to interact with from `viem/chains`. The chain can be any of the following: `moonbeam`, `moonriver`, or `moonbaseAlpha`
1. Create your account using the `privateKeyToAccount` function
1. Create the `client` using the `createWalletClient` function and pass in the account, network, and the HTTP RPC endpoint

!!! remember

    This is for demo purposes only. Never store your private key in a TypeScript file.

=== "Moonbeam"

    ```ts
    --8<-- 'code/builders/ethereum/libraries/viem/9.ts'
    ```

=== "Moonriver"

    ```ts
    --8<-- 'code/builders/ethereum/libraries/viem/10.ts'
    ```

=== "Moonbase Alpha"

    ```ts
    --8<-- 'code/builders/ethereum/libraries/viem/11.ts'
    ```

=== "Moonbeam Dev Node"

    ```ts
    --8<-- 'code/builders/ethereum/libraries/viem/12.ts'
    ```

!!! note

    To interact with browser-based wallets, you can use the following code to create an account:

    ```ts
    --8<-- 'code/builders/ethereum/libraries/viem/13.ts'
    ```

## Send a Transaction {: #send-transaction }

During this section, you'll be creating a couple of scripts. The first one will be to check the balances of your accounts before trying to send a transaction. The second script will actually send the transaction.

You can also use the balance script to check the account balances after the transaction has been sent.

### Check Balances Script {: #check-balances-script }

You'll only need one file to check the balances of both addresses before and after the transaction is sent. To get started, you can create a `balances.ts` file by running:

```bash
--8<-- 'code/builders/ethereum/libraries/viem/14.sh'
```

Next, you will create the script for this file and complete the following steps:

1. Update your imports to include the `createPublicClient`, `http`, and `formatEther` functions from `viem` and the network you want to interact with from `viem/chains`
1. [Set up a public viem client](#for-reading-chain-data), which can be used for reading chain data, such as account balances
1. Define the `addressFrom` and `addressTo` variables
1. Create the asynchronous `balances` function that wraps the `publicClient.getBalance` method
1. Use the `publicClient.getBalance` function to fetch the balances for the `addressFrom` and `addressTo` addresses. You can also leverage the `formatEther` function to transform the balance into a more readable number (in GLMR, MOVR, or DEV)
1. Lastly, run the `balances` function

```ts
--8<-- 'code/builders/ethereum/libraries/viem/balances.ts'
```

To run the script and fetch the account balances, you can run the following command:

```bash
--8<-- 'code/builders/ethereum/libraries/viem/15.sh'
```

If successful, the balances for the origin and receiving address will be displayed in your terminal in DEV.

--8<-- 'code/builders/ethereum/libraries/viem/terminal/balances.md'

### Send Transaction Script {: #send-transaction-script }

You'll only need one file to execute a transaction between accounts. For this example, you'll be transferring 1 DEV token from an origin address (from which you hold the private key) to another address. To get started, you can create a `transaction.ts` file by running:

```bash
--8<-- 'code/builders/ethereum/libraries/viem/16.sh'
```

Next, you will create the script for this file and complete the following steps:

1. Update your imports to include the `createWalletClient`, `http`, and `parseEther` functions from `viem`, the `privateKeyToAccount` function from `viem/accounts`, and the network you want to interact with from `viem/chains`
1. [Set up a viem wallet client](#for-writing-chain-data) for writing chain data, which can be used along with your private key to send transactions. **Note: This is for example purposes only. Never store your private keys in a TypeScript file**
1. [Set up a public viem client](#for-reading-chain-data) for reading chain data, which will be used to wait for the transaction receipt
1. Define the `addressTo` variable
1. Create the asynchronous `send` function, which wraps the transaction object and the `walletClient.sendTransaction` method
1. Use the `walletClient.sendTransaction` function to sign and send the transaction. You'll need to pass in the transaction object, which only requires the recipient's address and the amount to send. Note that `parseEther` can be used, which handles the necessary unit conversions from Ether to Wei, similar to using `parseUnits(value, decimals)`. Use `await` to wait until the transaction is processed and the transaction hash is returned
1. Use the `publicClient.waitForTransactionReceipt` function to wait for the transaction receipt, signaling that the transaction has been completed. This is particularly helpful if you need the transaction receipt or if you're running the `balances.ts` script directly after this one to check if the balances have been updated as expected
1. Lastly, run the `send` function

```ts
--8<-- 'code/builders/ethereum/libraries/viem/transaction.ts'
```

To run the script, you can run the following command in your terminal:

```bash
--8<-- 'code/builders/ethereum/libraries/viem/17.sh'
```

If the transaction was successful, in your terminal you'll see the transaction hash has been printed out.

!!! note

    Viem requires that you prepend your private key with `0x`. Many wallets omit this `0x`, so verify you've included it as you replace `INSERT_PRIVATE_KEY`.

You can also use the `balances.ts` script to check that the balances for the origin and receiving accounts have changed. The entire workflow would look like this:

--8<-- 'code/builders/ethereum/libraries/viem/terminal/transaction.md'

## Deploy a Contract {: #deploy-contract }

--8<-- 'text/builders/ethereum/libraries/contract.md'

### Compile Contract Script {: #compile-contract-script }

--8<-- 'text/builders/ethereum/libraries/compile-ts.md'

--8<-- 'text/builders/ethereum/libraries/compile.md'

```js
--8<-- 'code/builders/ethereum/libraries/compile.ts'
```

### Deploy Contract Script {: #deploy-contract-script }

With the script for compiling the `Incrementer.sol` contract in place, you can then use the results to send a signed transaction that deploys it. To do so, you can create a file for the deployment script called `deploy.ts`:

```bash
--8<-- 'code/builders/ethereum/libraries/viem/18.sh'
```

Next, you will create the script for this file and complete the following steps:

1. Update your imports to include the `createPublicClient`, `createWalletClient`, and `http` functions from `viem`, the `privateKeyToAccount` function from `viem/accounts`, the network you want to interact with from `viem/chains`, and the `contractFile` from the `compile.ts` file you created in the [Compile Contract Script](#compile-contract-script) section
1. [Set up a viem wallet client](#for-writing-chain-data) for writing chain data, which will be used along with your private key to deploy the `Incrementer` contract. **Note: This is for example purposes only. Never store your private keys in a TypeScript file**
1. [Set up a public viem client](#for-reading-chain-data) for reading chain data, which will be used to read the transaction receipt for the deployment
1. Load the contract `bytecode` and `abi` for the compiled contract
1. Create the asynchronous `deploy` function that will be used to deploy the contract via the `walletClient.deployContract` method
1. Use the `walletClient.deployContract` function to sign and send the transaction. You'll need to pass in the contract's ABI and bytecode, the account to deploy the transaction from, and the initial value for the incrementer. Use `await` to wait until the transaction is processed and the transaction hash is returned
1. Use the `publicClient.readContract` function to get the transaction receipt for the deployment. Use `await` to wait until the transaction is processed and the contract address is returned
1. Lastly, run the `deploy` function

```ts
--8<-- 'code/builders/ethereum/libraries/viem/deploy.ts'
```

To run the script, you can enter the following command into your terminal:

```bash
--8<-- 'code/builders/ethereum/libraries/viem/19.sh'
```

If successful, the contract's address will be displayed in the terminal.

--8<-- 'code/builders/ethereum/libraries/viem/terminal/deploy.md'

### Read Contract Data (Call Methods) {: #read-contract-data }

Call methods are the type of interaction that doesn't modify the contract's storage (change variables), meaning no transaction needs to be sent. They simply read various storage variables of the deployed contract.

To get started, you can create a file and name it `get.ts`:

```bash
--8<-- 'code/builders/ethereum/libraries/viem/20.sh'
```

Then you can take the following steps to create the script:

1. Update your imports to include the `createPublicClient` and `http` functions from `viem`, the network you want to interact with from `viem/chains`, and the `contractFile` from the `compile.ts` file you created in the [Compile Contract Script](#compile-contract-script) section
1. [Set up a public viem client](#for-reading-chain-data) for reading chain data, which will be used to read the current number of the `Incrementer` contract
1. Create the `contractAddress` variable using the address of the deployed contract and the `abi` variable using the `contractFile` from the `compile.ts` file
1. Create the asynchronous `get` function
1. Call the contract using the `publicClient.readContract` function, passing in the `abi`, the name of the function, the `contractAddress`, and any arguments (if needed). You can use `await`, which will return the value requested once the request promise resolves
1. Lastly, call the `get` function

```ts
--8<-- 'code/builders/ethereum/libraries/viem/get.ts'
```

To run the script, you can enter the following command in your terminal:

```bash
--8<-- 'code/builders/ethereum/libraries/viem/21.sh'
```

If successful, the value will be displayed in the terminal.

--8<-- 'code/builders/ethereum/libraries/viem/terminal/get.md'

### Interact with Contract (Send Methods) {: #interact-with-contract }

Send methods are the type of interactions that modify the contract's storage (change variables), meaning a transaction needs to be signed and sent. In this section, you'll create two scripts: one to increment and one to reset the incrementer. To get started, you can create a file for each script and name them `increment.ts` and `reset.ts`:

```bash
--8<-- 'code/builders/ethereum/libraries/viem/22.sh'
```

Open the `increment.ts` file and take the following steps to create the script:

1. Update your imports to include the `createWalletClient` and `http` functions from `viem`, the network you want to interact with from `viem/chains`, and the `contractFile` from the `compile.ts` file you created in the [Compile Contract Script](#compile-contract-script) section
1. [Set up a viem wallet client](#for-writing-chain-data) for writing chain data, which will be used along with your private key to send a transaction. **Note: This is for example purposes only. Never store your private keys in a TypeScript file**
1. [Set up a public viem client](#for-reading-chain-data) for reading chain data, which will be used to wait for the transaction receipt
1. Create the `contractAddress` variable using the address of the deployed contract, the `abi` variable using the `contractFile` from the `compile.ts` file, and the `_value` to increment the contract by
1. Create the asynchronous `increment` function
1. Call the contract using the `walletClient.writeContract` function, passing in the `abi`, the name of the function, the `contractAddress`, and the `_value`. You can use `await`, which will return the transaction hash once the request promise resolves
1. Use the `publicClient.waitForTransactionReceipt` function to wait for the transaction receipt, signaling that the transaction has been completed. This is particularly helpful if you need the transaction receipt or if you're running the `get.ts` script directly after this one to check that the current number has been updated as expected
1. Lastly, call the `increment` function

```js
--8<-- 'code/builders/ethereum/libraries/viem/increment.ts'
```

To run the script, you can enter the following command in your terminal:

```bash
--8<-- 'code/builders/ethereum/libraries/viem/23.sh'
```

If successful, the transaction hash will be displayed in the terminal. You can use the `get.ts` script alongside the `increment.ts` script to make sure that value is changing as expected.

--8<-- 'code/builders/ethereum/libraries/viem/terminal/increment.md'

Next, you can open the `reset.ts` file and take the following steps to create the script:

1. Update your imports to include the `createWalletClient` and `http` functions from `viem`, the network you want to interact with from `viem/chains`, and the `contractFile` from the `compile.ts` file you created in the [Compile Contract Script](#compile-contract-script) section
1. [Set up a viem wallet client](#for-writing-chain-data) for writing chain data, which will be used along with your private key to send a transaction. **Note: This is for example purposes only. Never store your private keys in a TypeScript file**
1. [Set up a public viem client](#for-reading-chain-data) for reading chain data, which will be used to wait for the transaction receipt
1. Create the `contractAddress` variable using the address of the deployed contract and the `abi` variable using the `contractFile` from the `compile.ts` file to increment the contract by
1. Create the asynchronous `reset` function
1. Call the contract using the `walletClient.writeContract` function, passing in the `abi`, the name of the function, the `contractAddress`, and an empty array for the arguments. You can use `await`, which will return the transaction hash once the request promise resolves
1. Use the `publicClient.waitForTransactionReceipt` function to wait for the transaction receipt, signaling that the transaction has been completed. This is particularly helpful if you need the transaction receipt or if you're running the `get.ts` script directly after this one to check that the current number has been reset to `0`
1. Lastly, call the `reset` function

```ts
--8<-- 'code/builders/ethereum/libraries/viem/reset.ts'
```

To run the script, you can enter the following command in your terminal:

```bash
--8<-- 'code/builders/ethereum/libraries/viem/24.sh'
```

If successful, the transaction hash will be displayed in the terminal. You can use the `get.ts` script alongside the `reset.ts` script to make sure that value is changing as expected.

--8<-- 'code/builders/ethereum/libraries/viem/terminal/reset.md'

--8<-- 'text/_disclaimers/third-party-content.md'
