---
title: Send a Transaction
description: Learn how to create and send transactions on Moonbeam’s Ethereum-compatible network with a simple script using web3.js, ethers.js, or web3.py.
---

# Using Ethereum Libraries to Send Transactions on Moonbeam

![Ethereum Libraries Integrations Moonbeam](/images/sendtx/web3-libraries-banner.png)

## Introduction

This guide walks through using three different Ethereum libraries to manually sign and send a transaction on Moonbeam. The three libraries covered in this tutorial are:

 - [Web3.js](https://web3js.readthedocs.io/)
 - [Ethers.js](https://docs.ethers.io/)
 - [Web3.py](https://web3py.readthedocs.io/)

!!! note
    --8<-- 'text/common/assumes-mac-or-ubuntu-env.md'

## Checking Prerequisites

The examples using both web3.js and ethers.js require previous installation of Node.js and NPM. The example using web3.py requires Python and PIP. As of the writing of this guide, the versions used were:

 - Node.js v15.10.0
 - NPM v7.5.3
 - Python v3.6.9 (web3 requires Python >= 3.5.3 and < 4)
 - PIP3 v9.0.1

Next, create a directory to store all of the relevant files:

```
mkdir transaction && cd transaction/
```

For the JavaScript libraries, you can first create a simple `package.json` file (not required):

```
npm init --yes
```

In the directory, install the library to be used (web3.py is installed in the default directory of PIP3):

=== "Web3.js"
    ```
    npm i web3
    ```

=== "Ethers.js"
    ```
    npm i ethers
    ```

=== "Web3.py"
    ```
    pip3 install web3
    ```

The versions used as of publishing this guide were:

 - Web3.js v1.33 (`npm ls web3`)
 - Ethers.js v5.0.31 (`npm ls ethers`)
 - Web3.py v5.17.0 (`pip3 show web3`)

## The Transaction File

Only one file is needed to execute a transaction between accounts. The script shown in this section will transfer 1 Token from an origin address (from which you hold the private key), to another address. You can find the code snippet for each library here (they were arbitrarily named `transaction.*`):

 - Web3.js: [_transaction.js_](/snippets/code/web3-tx-local/transaction.js)
 - Ethers.js: [_transaction.js_](/snippets/code/ethers-tx-local/transaction.js)
 - Web3.py: [_transaction.py_](/snippets/code/web3py-tx/transaction.py)

Each of the files, regardless of the library used, has been divided into three sections. In the first section ("Define Provider & Variables"), the library to use is imported, and the provider and other variables are defined (variables depend on the library). Note that `providerRPC` has both the standard development node RPC endpoint and the one for [Moonbase Alpha](/networks/moonbase/).

The second section ("Create and Deploy Transaction") outlines the functions needed to send the transaction itself. Some of the key takeaways are discussed next.

=== "Web3.js"
    ```
    --8<-- 'code/web3-tx-local/transaction.js'
    ```

=== "Ethers.js"
    ```
    --8<-- 'code/ethers-tx-local/transaction.js'
    ```

=== "Web3.py"
    ```
    --8<-- 'code/web3py-tx/transaction.py'
    ```

### Web3.js

In the first section of [the script](/snippets/code/web3-tx-local/transaction.js), the `web3` instance (or provider) is created using the `Web3` constructor with the provider RPC. By changing the provider RPC given to the constructor, you can choose which network you want to send the transaction to.

The private key, and the public address associated with it, are defined for signing the transaction and logging purposes, respectively. Only the private key is required.

The `addressTo`, where the transaction will be sent, is also defined here, and it is required.

In the second section, the transaction object is created with the `to`, `value`, and `gas` fields. These describe the recipient, the amount to send, and the gas consumed by the transaction (21000 in this case). You can use the `web3.utils.toWei()` function to input the value in ETH (for example) and get the output in WEI. The transaction is signed with the private key using the `web3.eth.accounts.signTransaction()` method. Note that this returns a promise that needs to be resolved.

Next, with the transaction signed (you can `console.log(createTransaction)` to see the v-r-s values), you can send it using the `web3.eth.sendSignedTransaction()` method, providing the signed transaction located in `createTransaction.rawTransaction`.

Lastly, run the asynchronous deploy function.

### Ethers.js

In the first section of [the script](/snippets/code/ethers-tx-local/transaction.js), different networks can be specified with a name, RPC URL (required), and chain ID. The provider (similar to the `web3` instance) is created with the `ethers.providers.StaticJsonRpcProvider` method. An alternative is to use the `ethers.providers.JsonRpcProvide(providerRPC)` method, which only requires the provider RPC endpoint address. But this might created compatibility issues with individual project specifications.

The private key is defined to create a wallet instance, which also requires the provider from the previous step. The wallet instance is used to sign transactions.

The `addressTo`, where the transaction will be sent, is also defined here, and it is required.

In the second section, an asynchronous function wraps the `wallet.sendTransaction(txObject)` method. The transaction object is quite simple. It only requires the recipient's address and the amount to send. Note that `ethers.utils.parseEther()` can be used, which handles the necessary unit conversions from ETH to WEI - similar to using `ethers.utils.parseUnits(value,'ether')`.

Once the transaction is sent, you can get the transaction response (named `createReceipt` in this example), which has a few properties. For instance, you can call the `createReceipt.wait()` method to wait until the transaction is processed (receipt status is OK).

Lastly, run the asynchronous deploy function.

### Web3.py

In the first section of [the script](/snippets/code/web3py-tx/transaction.py), the `web3` instance (or provider) is created using the `Web3(Web3.HTTPProvider(provider_rpc))` method with the provider RPC. By changing the provider RPC, you can choose which network you want to send the transaction to.

The private key and the public address associated with it are defined for signing the transaction and logging purposes. The public address is not required.

The `addressTo`, where the transaction will be sent, is also defined here, and it is required.

In the second section, the transaction object is created with the `nonce`, `gasPrice`, `gas`, `to`, and `value` fields. These describe the transaction count, gas price (0 for development and Moonbase Alpha), gas (21000 in this case), the recipient, and the amount to send. Note that the transaction count can be obtained with the `web3.eth.getTransactionCount(address)` method. Also, you can use the `web3.toWei()` function to input the value in ETH (for example) and get the output in WEI. The transaction is signed with the private key using the `web3.eth.account.signTransaction()` method.

Next, with the transaction signed, you can send it by using the `web3.eth.sendSignedTransaction()` method, providing the signed transaction located in `createTransaction.rawTransaction`.

## The Balance File

Before running the script, another file checks the balances of both addresses before and after the transaction is needed. This can be easily done by a simple query of an account balance.

You can find the code snippet for each library here (files were arbitrarily named `balances.*`):

 - Web3.js: [_balances.js_](/snippets/code/web3-tx-local/balances.js)
 - Ethers.js: [_balances.js_](/snippets/code/ethers-tx-local/balances.js)
 - Web3.py: [_balances.py_](/snippets/code/web3py-tx/balances.py)

For simplicity, the balance file is composed of two sections. As before, in the first section ("Define Provider & Variables"), the library to use is imported, and the provider and address from/to (to check the balances) are defined.

The second section ("Balance Call Function") outlines the functions needed to fetch the balances of the accounts previously defined. Note that `providerRPC` has both the standard development node RPC endpoint and the one for [Moonbase Alpha](/networks/moonbase/). Some of the key takeaways are discussed next.

=== "Web3.js"
    ```
    --8<-- 'code/web3-tx-local/balances.js'
    ```

=== "Ethers.js"
    ```
    --8<-- 'code/ethers-tx-local/balances.js'
    ```

=== "Web3.py"
    ```
    --8<-- 'code/web3py-tx/balances.py'
    ```

### Web3.js

The first section of [the script](/snippets/code/web3-tx-local/balances.js) is very similar to the one in [transaction file](/getting-started/local-node/send-transaction/#web3js). The main difference is that no private key is needed because there is no need to send a transaction.

In the second section, an asynchronous function wraps the web3 method used to fetch the balance of an address, `web3.eth.getBalance(address)`. Once again, you can leverage the `web3.utils.fromWei()` function to transform the balance into a more readable number in ETH.

### Ethers.js

The first section of [the script](/snippets/code/ethers-tx-local/balances.js) is very similar to the one in [transaction file](/getting-started/local-node/send-transaction/#ethersjs). The main difference is that no private key is needed because there is no need to send a transaction. On the contrary, the `addressFrom` needs to be defined.

In the second section, an asynchronous function wraps the provider method used to fetch the balance of an address, which is `provider.getBalance(address)`. Once again, you can leverage the `ethers.utils.formatEther()` function to transform the balance into a more readable number in ETH.

### Web3.py

The first section of [the script](/snippets/code/web3py-tx/balances.py) is very similar to the one in [transaction file](/getting-started/local-node/send-transaction/#web3py). The main difference is that no private key is needed because there is no need to send a transaction.

In the second section, the `web3.eth.getBalance(address)` method is used to fetch a target address's balance. Once again, you can leverage the `eb3.fromWei()` function to transform the balance into a more readable number in ETH.

## Running the Scripts

For this section, the code shown before was adapted to target a development node, which you can run by following [this tutorial](/getting-started/local-node/setting-up-a-node/). Also, each transaction was sent from the pre-funded account that comes with the node:

--8<-- 'text/metamask-local/dev-account.md'

First, check the balances of both of the addresses before the transaction by running (note that the directory was renamed for each library):

=== "Web3.js"
    ```
    node balances.js
    ```

=== "Ethers.js"
    ```
    node balances.js
    ```

=== "Web3.py"
    ```
    python3 balances.py
    ```

Next, run the _transaction.\*_ script to execute the transaction:

=== "Web3.js"
    ```
    node transaction.js
    ```

=== "Ethers.js"
    ```
    node transaction.js
    ```

=== "Web3.py"
    ```
    python3 transaction.py
    ```

And lastly, recheck the balance to make sure the transfer was successful. The entire execution should look like this:

=== "Web3.js"
    ![Send Tx Web3js](/images/sendtx/sendtx-web3js.png)

=== "Ethers.js"
    ![Send Tx Etherjs](/images/sendtx/sendtx-ethers.png)

=== "Web3.py"
    ![Send Tx Web3py](/images/sendtx/sendtx-web3py.png)

