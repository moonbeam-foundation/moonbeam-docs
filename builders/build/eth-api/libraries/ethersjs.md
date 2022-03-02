---
title: Ethers.js
description: Follow this tutorial to learn how to use the Ethereum EtherJS Library to deploy Solidity smart contracts to Moonbeam.
---

# Ethers.js JavaScript Library

![Intro diagram](/images/builders/build/eth-api/libraries/ethers/ethersjs-banner.png)

## Introduction {: #introduction } 

The [ethers.js](https://docs.ethers.io/){target=blank} library provides a set of tools to interact with Ethereum Nodes with JavaScript, similar to web3.js. Moonbeam has an Ethereum-like API available that is fully compatible with Ethereum-style JSON RPC invocations. Therefore, developers can leverage this compatibility and use the ethers.js library to interact with a Moonbeam node as if they were doing so on Ethereum. You can read more about ethers.js on this [blog post](https://medium.com/l4-media/announcing-ethers-js-a-web3-alternative-6f134fdd06f3){target=blank}.

In this guide, you'll learn how to use the ethers.js library to send a transaction and deploy a contract on Moonbase Alpha. This guide can be adapted for [Moonbeam](builders/get-started/networks/moonbeam/){target=blank}, [Moonriver](builders/get-started/networks/moonriver/){target=blank}, or a [Moonbeam development node](builders/get-started/networks/moonbeam-dev/){target=blank}.

## Checking Prerequisites {: #checking-prerequisites } 

For the examples in this guide, you will need to have the following:

 - An account with funds. For Moonbase Alpha, you can get DEV tokens for testing purposes from [Mission Control](/builders/get-started/moonbase/#get-tokens/)
 - 
--8<-- 'text/common/endpoint-examples.md'

!!! note
    --8<-- 'text/common/assumes-mac-or-ubuntu-env.md'

## Create a JavaScript Project {: #create-a-javascript-project }

To get started, you can create a directory to store all of the files you'll be creating throughout this guide:

```
mkdir ethers-examples && cd ethers-examples
```

For this guide, you'll need to install the ethers.js library and the Solidity compiler. To install both NPM packages, you can run the following command:

```
npm install ethers solc@0.8.0
```

## Setting up the Ethers Provider {: #setting-up-the-ethers-provider }

Throughout this guide, you'll be creating a bunch of scripts that provide different functionality such as sending a transaction, deploying a contract, and interacting with a deployed contract. In most of these scripts you'll need to create an [Ethers provider](https://docs.ethers.io/v5/api/providers/){target=blank} to interact with the network.

--8<-- 'text/common/endpoint-setup.md'

To create a provider, you can take the following steps:

1. Import the `ethers` library
2. Define the `providerRPC` object, which can include the network configurations for any of the networks you want to send a transaction on. You'll include the `name`, `rpc`, and `chainId` for each network
3. Create the `provider` using the `ethers.providers.StaticJsonRpcProvider` method. An alternative is to use the `ethers.providers.JsonRpcProvide(providerRPC)` method, which only requires the provider RPC endpoint address. This might create compatibility issues with individual project specifications

=== "Moonbeam"

    ```js
    // 1. Import ethers
    const ethers = require('ethers');

    // 2. Define network configurations
    const providerRPC = {
      moonbeam: {
        name: 'moonbeam',
        rpc: '{{ networks.moonbeam.rpc_url }}', // Insert your RPC URL here
        chainId: '{{ networks.moonbeam.chain_id }}', // {{ networks.moonbeam.hex_chain_id }} in hex,
      },
    };
    // 3. Create ethers provider
    const provider = new ethers.providers.StaticJsonRpcProvider(
      providerRPC.moonbeam.rpc, 
      {
        chainId: providerRPC.moonbeam.chainId,
        name: providerRPC.moonbeam.name,
      }
    );
    ```

=== "Moonriver"

    ```js
    // 1. Import ethers
    const ethers = require('ethers');

    // 2. Define network configurations
    const providerRPC = {
      moonriver: {
        name: 'moonriver',
        rpc: '{{ networks.moonriver.rpc_url }}', // Insert your RPC URL here
        chainId: '{{ networks.moonriver.chain_id }}', // {{ networks.moonriver.hex_chain_id }} in hex,
      },
    };
    // 3. Create ethers provider
    const provider = new ethers.providers.StaticJsonRpcProvider(
      providerRPC.moonriver.rpc, 
      {
        chainId: providerRPC.moonriver.chainId,
        name: providerRPC.moonriver.name,
      }
    );
    ```

=== "Moonbase Alpha"

    ```js
    // 1. Import ethers
    const ethers = require('ethers');

    // 2. Define network configurations
    const providerRPC = {
      moonbase: {
        name: 'moonbase-alpha',
        rpc: '{{ networks.moonbase.rpc_url }}',
        chainId: '{{ networks.moonbase.chain_id }}', // {{ networks.moonbase.hex_chain_id }} in hex,
      },
    };
    // 3. Create ethers provider
    const provider = new ethers.providers.StaticJsonRpcProvider(
      providerRPC.moonbase.rpc, 
      {
        chainId: providerRPC.moonbase.chainId,
        name: providerRPC.moonbase.name,
      }
    );
    ```

=== "Moonbeam Dev Node"

    ```js
    // 1. Import ethers
    const ethers = require('ethers');

    // 2. Define network configurations
    const providerRPC = {
      dev: {
        name: 'moonbeam-development',
        rpc: '{{ networks.development.rpc_url }}',
        chainId: '{{ networks.development.chain_id }}', // {{ networks.development.hex_chain_id }} in hex,
      },
    };
    // 3. Create ethers provider
    const provider = new ethers.providers.StaticJsonRpcProvider(
      providerRPC.dev.rpc, 
      {
        chainId: providerRPC.dev.chainId,
        name: providerRPC.dev.name,
      }
    );
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

1. [Set up the Ethers provider](#setting-up-the-ethers-provider)
2. Define the `addressFrom` and `addressTo` variables
3. Create the asynchronous `balances` function which wraps the `provider.getBalance` method
4. Use the `provider.getBalance` function to fetch the balances for the `addressFrom` and `addressTo` addresses. You can also leverage the `eths.utils.formatEther` function to transform the balance into a more readable number in ETH
5. Lastly, run the `balances` function

```js
--8<-- 'code/ethers-tx-local/balances.js'
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

1. [Set up the Ethers provider](#setting-up-the-ethers-provider)
2. Define the `privateKey` and the `addressTo` variables. The private key is required to create a wallet instance. **Note: This is for example purposes only. Never store your private keys in a JavaScript file**
3. Create a wallet using the `privateKey` and `provider` from the previous steps. The wallet instance is used to sign transactions
4. Create the asynchronous `send` function which wraps the transaction object and the `wallet.sendTransaction` method
5. Create the transaction object which only requires the recipient's address and the amount to send. Note that `ethers.utils.parseEther` can be used, which handles the necessary unit conversions from Ether to Wei - similar to using `ethers.utils.parseUnits(value, 'ether')`
6. Send the transaction using the `wallet.sendTransaction` method and then use `await` to wait until the transaction is processed and the transaction receipt is returned
7. Lastly, run the `send` function

```js
--8<-- 'code/ethers-tx-local/transaction.js'
```

To run the script, you can run the following command in your terminal:

```
node transaction.js
```

If the transaction was succesful, in your terminal you'll see the transaction hash has been printed out.

You can also use the `balances.js` script to check that the balances for the origin and receiving accounts have changed. The entire workflow would look like this:

![Send Tx Etherjs](/images/builders/build/eth-api/libraries/ethers/ethers-1.png)

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

### Compile Contract Script {: #compile-contract-script }

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
2. [Set up the Ethers provider](#setting-up-the-ethers-provider)
3. Define the `privateKey` for the origin account. The private key is required to create a wallet instance. **Note: This is for example purposes only. Never store your private keys in a JavaScript file**
4. Save the `bytecode` and `abi` for the compiled contract
5. Create a wallet using the `privateKey` and `provider` from the previous steps. The wallet instance is used to sign transactions
6. Create a contract instance with signer using the `ethers.ContractFactory` function, providing the `abi`, `bytecode`, and `wallet` as parameters
7. Create the asynchronous `deploy` function that will be used to deploy the contract
8. Within the `deploy` function, use the `incrementer` contract instance to call `deploy` and pass in the initial value. For this example, you can set the initial value to `5`. This will send the transaction for contract deployment. To wait for a transaction receipt you can use the `deployed` method of the contract deployment transaction
9. Lastly, run the `deploy` function

```js
--8<-- 'code/ethers-contract-local/deploy.js'
```

To run the script, you can enter the following command into your terminal:

```
node deploy.js
```

If successful, the contract's address will be displayed in the terminal.

![Deploy Contract Etherjs](/images/builders/build/eth-api/libraries/ethers/ethers-2.png)

### Read Contract Data (Call Methods) {: #read-contract-data }

Call methods are the type of interaction that don't modify the contract's storage (change variables), meaning no transaction needs to be sent. They simply read various storage variables of the deployed contract.

To get started, you can create a file and name it `get.js`:

```
touch get.js
```

Then you can take the following steps to create the script:

1. Import the `abi` from the `compile.js` file
2. [Set up the Ethers provider](#setting-up-the-ethers-provider)
3. Create the `contractAddress` variable using the address of the deployed contract
4. Create an instance of the contract using the `ethers.Contract` function and passing in the `contractAddress`, `abi`, and `provider`
5. Create the asynchronous `get` function
6. Use the contract instance to call one of the contract's methods and pass in any inputs if necessary. For this example, you will call the `number` method which doesn't require any inputs. You can use `await` which will return the value requested once the request promise resolves
7. Lastly, call the `get` function

```js
--8<-- 'code/ethers-contract-local/get.js'
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
2. [Set up the Ethers provider](#setting-up-the-ethers-provider)
3. Define the `privateKey` for the origin account, the `contractAddress` of the deployed contract, and the `_value` to increment by. The private key is required to create a wallet instance. **Note: This is for example purposes only. Never store your private keys in a JavaScript file**
4. Create a wallet using the `privateKey` and `provider` from the previous steps. The wallet instance is used to sign transactions
5. Create an instance of the contract using the `ethers.Contract` function and passing in the `contractAddress`, `abi`, and `provider`
6. Create the asynchronous `increment` function
7. Use the contract instance to call one of the contract's methods and pass in any inputs if necessary. For this example, you will call the `increment` method which requires the value to increment by as an input. You can use `await` which will return the value requested once the request promise resolves
8. Lastly, call the `increment` function

```js
--8<-- 'code/ethers-contract-local/increment.js'
```

To run the script, you can enter the following command in your terminal:

```
node increment.js
```

If successful, the transaction hash will be displayed in the terminal. You can use the `get.js` script alongside the `increment.js` script to make sure that value is changing as expected:

![Increment Contract Ethers](/images/builders/build/eth-api/libraries/ethers/ethers-3.png)

Next you can open the `reset.js` file and take the following steps to create the script:

1. Import the `abi` from the `compile.js` file
2. [Set up the Ethers provider](#setting-up-the-ethers-provider)
3. Define the `privateKey` for the origin account and the `contractAddress` of the deployed contract. The private key is required to create a wallet instance. **Note: This is for example purposes only. Never store your private keys in a JavaScript file**
4. Create a wallet using the `privateKey` and `provider` from the previous steps. The wallet instance is used to sign transactions
5. Create an instance of the contract using the `ethers.Contract` function and passing in the `contractAddress`, `abi`, and `provider`
6. Create the asynchronous `reset` function
7. Use the contract instance to call one of the contract's methods and pass in any inputs if necessary. For this example, you will call the `reset` method which doesn't require any inputs. You can use `await` which will return the value requested once the request promise resolves
8. Lastly, call the `reset` function

```js
--8<-- 'code/ethers-contract-local/reset.js'
```

To run the script, you can enter the following command in your terminal:

```
node increment.js
```

If successful, the transaction hash will be displayed in the terminal. You can use the `get.js` script alongside the `reset.js` script to make sure that value is changing as expected:

![Reset Contract Ethers](/images/builders/build/eth-api/libraries/ethers/ethers-4.png)

--8<-- 'text/disclaimers/third-party-content.md'