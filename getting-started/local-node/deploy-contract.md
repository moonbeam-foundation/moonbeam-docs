---
title: Deploy a Contract
description: Learn how to deploy unmodified and unchanged Solidity-based smart contracts to a Moonbeam node with a simple script using Web3.js, Ethers.js, or Web3.py.
---

# Using Ethereum Libraries to Deploy Smart Contracts on Moonbeam

![Ethereum Libraries Integrations Moonbeam](/images/sendtx/web3-libraries-banner.png)

## Introduction

This guide walks through using the Solidity compiler and three different Ethereum libraries to sign and send a transaction on Moonbeam manually. The three libraries covered by this tutorial are:

 - [Web3.js](https://web3js.readthedocs.io/)
 - [Ethers.js](https://docs.ethers.io/)
 - [Web3.py](https://web3py.readthedocs.io/)

Besides, two other libraries will be used to compile the smart contract:

 - [Solc-js](https://www.npmjs.com/package/solc) to compile Solidity smart contracts using JavaScript
 - [Py-solc-x](https://pypi.org/project/py-solc-x/) to compile Solidity smart contracts using Python

!!! note
    --8<-- 'text/common/assumes-mac-or-ubuntu-env.md'

## Checking Prerequisites

The examples using both web3.js and ethers.js need you to install Node.js and NPM previously. For the web3.py, you need Python and PIP. As of the writing of this guide, the versions used were:

 - Node.js v15.10.0
 - NPM v7.5.3
 - Python v3.6.9 (web3 requires Python >= 3.5.3 and < 4)
 - PIP3 v9.0.1

Next, create a directory to store all of the relevant files:

```
mkdir incrementer && cd incrementer/
```

For the JavaScript libraries, first, you can create a simple `package.json` file (not required):

```
npm init --yes
```

In the directory, install the corresponding library and the Solidity compiler (_web3.py_ and _py-solc-x_ are installed in the default directory of PIP3):

=== "Web3.js"
    ```
    npm i web3 npm i solc@0.8.0
    ```

=== "Ethers.js"
    ```
    npm i ethers npm i solc@0.8.0
    ```

=== "Web3.py"
    ```
    pip3 install web3 pip3 install py-solc-x
    ```

The versions used when this guide was published were

 - Web3.js v1.33 (`npm ls web3`)
 - Ethers.js v5.0.31 (`npm ls ethers`)
 - Solc (JS) v0.8.0 (`npm ls solc`)
 - Web3.py v5.17.0 (`pip3 show web3`)
 - Py-solc-x v1.1.0 (`pip3 show py-solc-x`)

The setup for this example will be relatively simple, and it'll contain the following files:

 - **_Incrementer.sol_** — the file with our Solidity code
 - **_compile.\*_** — compiles the contract with the Solidity compiler
 - **_deploy.\*_**: it will handle the deployment to our local Moonbeam node
 - **_get.\*_** — it will make a call to the node to get the current value of the number
 - **_increment.\*_** — it will make a transaction to increment the number stored on the Moonbeam node
 - **_reset.\*_** — the function to call that will reset the number stored to zero

## The Contract File

The contract used is a simple incrementer, arbitrarily named _Incrementer.sol_, which you can find [here](/snippets/code/web3-contract-local/Incrementer.sol). The Solidity code is the following:

```solidity
--8<-- 'code/web3-contract-local/Incrementer.sol'
```

The `constructor` function, which runs when the contract is deployed, sets the initial value of the number variable stored on-chain (default is 0). The `increment` function adds the `_value` provided to the current number, but a transaction needs to be sent, which modifies the stored data. Lastly, the `reset` function resets the stored value to zero.

!!! note
    This contract is a simple example for illustration purposes only and does not handle values wrapping around.

## Compiling the Contract

The only purpose of the compile file is to use the Solidity compiler to output the bytecode and interface (ABI) our contract. You can find the code snippet for each library here (they were arbitrarily named `compile.*`):

 - Web3.js: [_compile.js_](/snippets/code/web3-contract-local/compile.js)
 - Ethers.js: [_compile.js_](/snippets/code/web3-contract-local/compile.js)
 - Web3.py: [_compile.py_](/snippets/code/web3py-contract/compile.py)

!!! note
    The compile file for both JavaScript libraries is the same as they share the JavaScript bindings for the Solidity compiler (same package)

=== "Web3.js"
    ```
    --8<-- 'code/web3-contract-local/compile.js'
    ```

=== "Ethers.js"
    ```
    --8<-- 'code/web3-contract-local/compile.js'
    ```

=== "Web3.py"
    ```
    --8<-- 'code/web3py-contract/compile.py'
    ```

### Web3.js and Ethers.js

In the first part of [the script](/snippets/code/web3-contract-local/compile.js), the contract's path is fetched, and its content read.

Next, the Solidity compiler's input object is built, and it is passed as input to the `solc.compile` function.

Lastly, extract the data of the `Incrementer` contract of the `Incrementer.sol` file, and export it so that the deployment script can use it.

### Web3.py

In the first part of [the script](/snippets/code/web3py-contract/compile.py), the contract file is compiled using the `solcx.compile_files` function. Note that the contract file is in the same directory as the compile script.

!!! note
    When running the `compile.py` you might be get an error stating that `Solc` needs to be installed. If so, uncomment the line in the file that executes `solcx.install_solc()` and rerun the compile file again with `python3 compile.py`. More information can be found in [this link](https://pypi.org/project/py-solc-x/).

Next, and wrapping up the script, the contract data is exported. In this example, only the interface (ABI) and bytecode were defined.

## Deploying the Contract

Regardless of the library, the strategy to deploy the compiled smart contract is somewhat similar. A contract instance is created using its interface (ABI) and bytecode. From this instance, a deployment function is used to send a signed transaction that deploys the contract. You can find the code snippet for each library here (they were arbitrarily named `deploy.*`):

 - Web3.js: [_deploy.js_](/snippets/code/web3-contract-local/deploy.js)
 - Ethers.js: [_deploy.js_](/snippets/code/ethers-contract-local/deploy.js)
 - Web3.py: [_deploy.py_](/snippets/code/web3py-contract/deploy.py)

For simplicity, the deploy file is composed of two sections. In the first section ("Define Provider & Variables"), the library to use and the ABI and bytecode of the contract are imported. Also, the provider and account from (with the private key) are defined. Note that `providerRPC` has both the standard development node RPC endpoint and the one for [Moonbase Alpha](/networks/moonbase/).

The second section ("Deploy Contract") outlines the actual contract deployment part. Note that for this example, the initial value of the `number` variable was set to 5. Some of the key takeaways are discussed next.

=== "Web3.js"
    ```
    --8<-- 'code/web3-contract-local/deploy.js'
    ```

=== "Ethers.js"
    ```
    --8<-- 'code/ethers-contract-local/deploy.js'
    ```

=== "Web3.py"
    ```
    --8<-- 'code/web3py-contract/deploy.py'
    ```

!!! note
    The _deploy.\*_ script provides the contract address as an output. This comes in handy, as it is used for the contract interaction files.

### Web3.js

In the first part of [the script](/snippets/code/web3-contract-local/deploy.js), the `web3` instance (or provider) is created using the `Web3` constructor with the provider RPC. By changing the provider RPC given to the constructor, you can choose which network you want to send the transaction to.

The private key, and the public address associated with it, are defined for signing the transaction and logging purposes. Only the private key is required. Also, the contract's bytecode and interface (ABI) are fetched from the compile's export.

In the second section, a contract instance is created by providing the ABI. Next, the `deploy` function is used, which needs the bytecode and arguments of the constructor function. This will generate the constructor transaction object.

Afterwards, the constructor transaction can be signed using the `web3.eth.accounts.signTransaction()` method. The data field corresponds to the bytecode, and the constructor input arguments are encoded together. Note that the value of gas is obtained using `estimateGas()` option inside the constructor transaction.

Lastly, the signed transaction is sent, and the contract's address is displayed in the terminal.

### Ethers.js

In the first part of [the script](/snippets/code/ethers-contract-local/deploy.js), different networks can be specified with a name, RPC URL (required), and chain ID. The provider (similar to the `web3` instance) is created with the `ethers.providers.StaticJsonRpcProvider` method. An alternative is to use the `ethers.providers.JsonRpcProvide(providerRPC)` method, which only requires the provider RPC endpoint address. But this might created compatibility issues with individual project specifications.

The private key is defined to create a wallet instance, which also requires the provider from the previous step. The wallet instance is used to sign transactions. Also, the contract's bytecode and interface (ABI) are fetched from the compile's export.

In the second section, a contract instance is created with `ethers.ContractFactory()`, providing the ABI, bytecode, and wallet. Thus, the contract instance already has a signer. Next, the `deploy` function is used, which needs the constructor input arguments. This will send the transaction for contract deployment. To wait for a transaction receipt you can use the `deployed()` method of the contract deployment transaction.

Lastly, the contract's address is displayed in the terminal.

### Web3.py

In the first part of [the script](/snippets/code/web3py-contract/deploy.py), the `web3` instance (or provider) is created using the `Web3(Web3.HTTPProvider(provider_rpc))` method with the provider RPC. By changing the provider RPC, you can choose which network you want to send the transaction to.

The private key and the public address associated with it are defined for signing the transaction and establishing the from address.

In the second section, a contract instance is created with `web3.eth.contract()`, providing the ABI and bytecode imported from the compile file. Next, the constructor transaction can be built using the `constructor().buildTransaction()` method of the contract instance. Note that inside the `constructor()`, you need to specify the constructor input arguments. The `from` account needs to be outlined as well. Make sure to use the one associated with the private key. Also, the transaction count can be obtained with the `web3.eth.getTransactionCount(address)` method.

The constructor transaction can be signed using `web3.eth.account.signTransaction()`, passing the constructor transaction and the private key.

Lastly, the signed transaction is sent, and the contract's address is displayed in the terminal.

## Reading from the Contract (Call Methods)

Call methods are the type of interaction that don't modify the contract's storage (change variables), meaning no transaction needs to be sent.

Let's overview the _get.\*_ file (the simplest of them all), which fetches the current value stored in the contract. You can find the code snippet for each library here (they were arbitrarily named `get.*`):

 - Web3.js: [_get.js_](/snippets/code/web3-contract-local/get.js)
 - Ethers.js: [_get.js_](/snippets/code/ethers-contract-local/get.js)
 - Web3.py: [_get.py_](/snippets/code/web3py-contract/get.py)

For simplicity, the get file is composed of two sections. In the first section ("Define Provider & Variables"), the library to use and the ABI of the contract are imported. Also, the provider and the contract's address are defined. Note that `providerRPC` has both the standard development node RPC endpoint and the one for [Moonbase Alpha](/networks/moonbase/).

The second section ("Call Function") outlines the actual call to the contract. Regardless of the library, a contract instance is created (linked to the contract's address), from which the call method is queried. Some of the key takeaways are discussed next.

=== "Web3.js"
    ```
    --8<-- 'code/web3-contract-local/get.js'
    ```

=== "Ethers.js"
    ```
    --8<-- 'code/ethers-contract-local/get.js'
    ```

=== "Web3.py"
    ```
    --8<-- 'code/web3py-contract/get.py'
    ```

### Web3.js

In the first part of [the script](/snippets/code/web3-contract-local/get.js), the `web3` instance (or provider) is created using the `Web3` constructor with the provider RPC. By changing the provider RPC given to the constructor, you can choose which network you want to send the transaction to.

The contract's interface (ABI) and address are needed as well to interact with it.

In the second section, a contract instance is created with `web3.eth.Contract()` by providing the ABI and address. Next, the method to call can be queried with the `contract.methods.methodName(_input).call()` function, replacing `contract`, `methodName` and `_input` with the contract instance, function to call, and input of the function (if necessary). This promise, when resolved, will return the value requested.

Lastly, the value is displayed in the terminal.

### Ethers.js

In the first part of [the script](/snippets/code/ethers-contract-local/get.js), different networks can be specified with a name, RPC URL (required), and chain ID. The provider (similar to the `web3` instance) is created with the `ethers.providers.StaticJsonRpcProvider` method. An alternative is to use the `ethers.providers.JsonRpcProvide(providerRPC)` method, which only requires the provider RPC endpoint address. But this might created compatibility issues with individual project specifications.

The contract's interface (ABI) and address are needed as well to interact with it.

In the second section, a contract instance is created with `ethers.Contract()`, providing its address, ABI, and the provider. Next, the method to call can be queried with the `contract.methodName(_input)` function, replacing `contract` `methodName`, and `_input` with the contract instance, function to call, and input of the function (if necessary). This promise, when resolved, will return the value requested.

Lastly, the value is displayed in the terminal.

### Web3.py

In the first part of [the script](/snippets/code/web3py-contract/get.py), the `web3` instance (or provider) is created using the `Web3(Web3.HTTPProvider(provider_rpc))` method with the provider RPC. By changing the provider RPC, you can choose which network you want to send the transaction to.

The contract's interface (ABI) and address are needed as well to interact with it.

In the second section, a contract instance is created with `web3.eth.contract()` by providing the ABI and address. Next, the method to call can be queried with the `contract.functions.method_name(input).call()` function, replacing `contract`, `method_name` and `input` with the contract instance, function to call, and input of the function (if necessary). This returns the value requested.

Lastly, the value is displayed in the terminal.

## Interacting with the Contract (Send Methods)

Send methods are the type of interaction that modify the contract's storage (change variables), meaning a transaction needs to be signed and sent.

First, let's overview the _increment.\*_ file, which increments the current number stored in the contract by a given value. You can find the code snippet for each library here (they were arbitrarily named `increment.*`):

 - Web3.js: [_increment.js_](/snippets/code/web3-contract-local/increment.js)
 - Ethers.js: [_increment.js_](/snippets/code/ethers-contract-local/increment.js)
 - Web3.py: [_increment.py_](/snippets/code/web3py-contract/increment.py)

For simplicity, the increment file is composed of two sections. In the first section ("Define Provider & Variables"), the library to use and the ABI of the contract are imported. The provider, the contract's address, and the value of the `increment` function are also defined. Note that `providerRPC` has both the standard development node RPC endpoint and the one for [Moonbase Alpha](/networks/moonbase/).

The second section ("Send Function") outlines the actual function to be called with the transaction. Regardless of the library, a contract instance is created (linked to the contract's address), from which the function to be used is queried.

=== "Web3.js"
    ```
    --8<-- 'code/web3-contract-local/increment.js'
    ```

=== "Ethers.js"
    ```
    --8<-- 'code/ethers-contract-local/increment.js'
    ```

=== "Web3.py"
    ```
    --8<-- 'code/web3py-contract/increment.py'
    ```

The second file to interact with the contract is the _reset.\*_ file, which resets the number stored in the contract to zero. You can find the code snippet for each library here (they were arbitrarily named `reset.*`):

 - Web3.js: [_reset.js_](/snippets/code/web3-contract-local/reset.js)
 - Ethers.js: [_reset.js_](/snippets/code/ethers-contract-local/reset.js)
 - Web3.py: [_reset.py_](/snippets/code/web3py-contract/reset.py)

Each file's structure is very similar to his _increment.\*_ counterpart for each library. The main difference is the method being called.

=== "Web3.js"
    ```
    --8<-- 'code/web3-contract-local/reset.js'
    ```

=== "Ethers.js"
    ```
    --8<-- 'code/ethers-contract-local/reset.js'
    ```

=== "Web3.py"
    ```
    --8<-- 'code/web3py-contract/reset.py'
    ```

### Web3.js

In the first part of the script ([increment](/snippets/code/web3-contract-local/increment.js) or [reset](/snippets/code/web3-contract-local/reset.js) files), the `web3` instance (or provider) is created using the `Web3` constructor with the provider RPC. By changing the provider RPC given to the constructor, you can choose which network you want to send the transaction to.

The private key, and the public address associated with it, are defined for signing the transaction and logging purposes. Only the private key is required. Also, the contract's interface (ABI) and address are needed to interact with it. If necessary, you can define any variable required as input to the function you are going to interact with.

In the second section, a contract instance is created with `web3.eth.Contract()` by providing the ABI and address. Next, you can build the transaction object with the `contract.methods.methodName(_input)` function, replacing `contract`, `methodName` and `_input` with the contract instance, function to call, and input of the function (if necessary).

Afterwards, the transaction can be signed using the `web3.eth.accounts.signTransaction()` method. The data field corresponds to the transaction object from the previous step. Note that the value of gas is obtained using `estimateGas()` option inside the transaction object.

Lastly, the signed transaction is sent, and the transaction hash is displayed in the terminal.

### Ethers.js

In the first part of the script ([increment](/snippets/code/ethers-contract-local/increment.js) or [reset](/snippets/code/ethers-contract-local/reset.js) files), different networks can be specified with a name, RPC URL (required), and chain ID. The provider (similar to the `web3` instance) is created with the `ethers.providers.StaticJsonRpcProvider` method. An alternative is to use the `ethers.providers.JsonRpcProvide(providerRPC)` method, which only requires the provider RPC endpoint address. But this might created compatibility issues with individual project specifications.

The private key is defined to create a wallet instance, which also requires the provider from the previous step. The wallet instance is used to sign transactions. Also, the contract's interface (ABI) and address are needed to interact with it. If necessary, you can define any variable required as input to the function you are going to interact with.

In the second section, a contract instance is created with `ethers.Contract()`, providing its address, ABI, and wallet. Thus, the contract instance already has a signer. Next, transaction corresponding to a specific function can be send with the `contract.methodName(_input)` function, replacing `contract`, `methodName` and `_input` with the contract instance, function to call, and input of the function (if necessary). To wait for a transaction receipt, you can use the `wait()` method of the contract deployment transaction.

Lastly, the transaction hash is displayed in the terminal.

### Web3.py

In the first part of the script ([increment](/snippets/code/web3py-contract/increment.py) or [reset](/snippets/code/web3py-contract/reset.py) files), the `web3` instance (or provider) is created using the `Web3(Web3.HTTPProvider(provider_rpc))` method with the provider RPC. By changing the provider RPC, you can choose which network you want to send the transaction to.

The private key and the public address associated with it are defined for signing the transaction and establishing the from address. Also, the contract's interface (ABI) and address are needed as well to interact with it.

In the second section, a contract instance is created with `web3.eth.contract()` by providing the ABI and address. Next, you can build the transaction object with the `contract.functions.methodName(_input).buildTransaction` function, replacing `contract`, `methodName` and `_input` with the contract instance, function to call, and input of the function (if necessary). Inside `buildTransaction()`, the `from` account needs to be outlined. Make sure to use the one associated with the private key. Also, the transaction count can be obtained with the `web3.eth.getTransactionCount(address)` method.

The transaction can be signed using `web3.eth.account.signTransaction()`, passing the transaction object of the previous step and the private key.

Lastly, the transaction hash is displayed in the terminal.

## Running the Scripts

For this section, the code shown before was adapted to target a development node, which you can run by following [this tutorial](/getting-started/local-node/setting-up-a-node/). Also, each transaction was sent from the pre-funded account that comes with the node:

--8<-- 'text/metamask-local/dev-account.md'

First, deploy the contract by running (note that the directory was renamed for each library):

=== "Web3.js"
    ```
    node deploy.js
    ```

=== "Ethers.js"
    ```
    node deploy.js
    ```

=== "Web3.py"
    ```
    python3 deploy.py
    ```

This will deploy the contract and return the address:

=== "Web3.js"
    ![Deploy Contract Web3js](/images/deploycontract/contract-deploy-web3js.png)

=== "Ethers.js"
    ![Deploy Contract Etherjs](/images/deploycontract/contract-deploy-ethers.png)

=== "Web3.py"
    ![Deploy Contract Web3py](/images/deploycontract/contract-deploy-web3py.png)

Next, run the increment file. You can use the get file to verify the value of the number stored in the contract before and after increment it:

=== "Web3.js"
    ```
    # Get value
    node get.js 
    # Increment value
    increment.js
    # Get value
    node get.js
    ```

=== "Ethers.js"
    ```
    # Get value
    node get.js 
    # Increment value
    increment.js
    # Get value
    node get.js
    ```

=== "Web3.py"
    ```
    # Get value
    python3 get.py 
    # Increment value
    python3 increment.py
    # Get value
    python3 get.py
    ```

This will display the value before the increment transaction, the hash of the transaction, and the value after:

=== "Web3.js"
    ![Increment Contract Web3js](/images/deploycontract/contract-increment-web3js.png)

=== "Ethers.js"
    ![Increment Contract Etherjs](/images/deploycontract/contract-increment-ethers.png)

=== "Web3.py"
    ![Increment Contract Web3py](/images/deploycontract/contract-increment-web3py.png)

Lastly, run the reset file. Once again, you can use the get file to verify the value of the number stored in the contract before and after resetting it:

=== "Web3.js"
    ```
    # Get value
    node get.js 
    # Reset value
    node reset.js 
    # Get value
    node get.js
    ```

=== "Ethers.js"
    ```
    # Get value
    node get.js 
    # Reset value
    node reset.js 
    # Get value
    node get.js
    ```

=== "Web3.py"
    ```
    # Get value
    python3 get.py 
    # Reset value
    python3 reset.py
    # Get value
    python3 get.py
    ```

This will display the value before the reset transaction, the hash of the transaction, and the value after:

=== "Web3.js"
    ![Reset Contract Web3js](/images/deploycontract/contract-reset-web3js.png)

=== "Ethers.js"
    ![Reset Contract Etherjs](/images/deploycontract/contract-reset-ethers.png)

=== "Web3.py"
    ![Reset Contract Web3py](/images/deploycontract/contract-reset-web3py.png)

