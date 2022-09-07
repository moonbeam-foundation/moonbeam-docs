---
title:  Dispatch Precompile Contract
description:  Learn how to dispatch any hex encoded calldata through the Ethereum API with Moonbeam's precompiled dispatch contract.
keywords: ethereum, dispatch, calldata, moonbeam, substrate, precompiled, contracts
---

# Interacting with the Dispatch Precompile

![Precomiled Contracts Banner](/images/builders/pallets-precompiles/precompiles/dispatch/dispatch-banner.png)

## Introduction {: #introduction }

The dispatch precompiled contract on Moonbeam enables dispatching of any hex encoded calldata using the Ethereum API. This allows developers to interact with extrinsics from any of the [Substrate-based pallets on Moonbeam](/builders/pallets-precompiles/pallets/){target=_blank}, using familiar [Ethereum libraries](/builders/build/eth-api/libraries/){target=_blanl} such as [Ethers](/builders/build/eth-api/libraries/ethersjs){target=_blank} or [Web3](/builders/build/eth-api/libraries/web3js).

At a high level, the dispatch precompile works by sending a transaction as you normally would with an Ethereum library, except you'll pass in the hex encoded calldata in the `data` field and the dispatch precompile address in the `to` field.

The dispatch precompile is located at the following address:

```
0x0000000000000000000000000000000000000401
```

This guide will show you how to generate the hex encoded calldata with the Polkadot.js API and how to send the transaction with Ethers and Web3.

## Interact with the Dispatch Precompile {: #interact-with-dispatch-precompile }

### Checking Prerequisites {: #checking-prerequisites }

For the examples in this guide, you will need to have the following:

 - Have MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - Have an account with funds.
  --8<-- 'text/faucet/faucet-list-item.md'
--8<-- 'text/common/endpoint-examples.md'

Once you've created an account you'll need to export the private key to be used in this guide.

### Create a JavaScript Project {: #create-a-javascript-project }

To get started, you'll need to create a project directory, create a JavaScript file, and install the necessary dependencies. To do so, you can take the following steps:

1. Create a directory
    ```
    mkdir dispatch-example && cd dispatch-example
    ```

2. Create a JavaScript file
    ```
    touch dispatch.js
    ```

3. Initialize your project
    ```
    npm init -y
    ```

4. Install the Ethereum library of your choice
    === "Ethers.js"
        ```
        npm install ethers
        ```

    === "Web3.js"
        ```
        npm install web3
        ```

5. Install the Polkdot.js API, which will be used to generate the hex encoded calldata
    ```
    npm i @polkadot/api
    ```

![Create your project](/images/builders/pallets-precompiles/precompiles/dispatch/dispatch-1.png)

Now that you have created your project and installed the dependencies, you'll just need to make one minor update to the `package.json` file. At the bottom of the file, you can add `"type": "module"`, which will allow you to use `import` syntax.

Your `package.json` should resemble the following:

```json
{
  "name": "dispatch-example",
  "version": "1.0.0",
  "description": "",
  "main": "dispatch.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@polkadot/api": "^9.3.3",
    "ethers": "^5.7.0"
  },
  "type": "module"
}
```

### Configure API Providers {: #configure-providers }

The example in this guide is demonstrated on Moonbase Alpha, however, similar steps can be taken for Moonbeam and Moonriver.

As previously mentioned, you'll need to use the Polkadot.js API to generate the hex encoded calldata and then an Ethereum library of your choice to send the transaction.

To configure the API providers, you can copy the following snippet and paste it in your `dispatch.js` file:

=== "Ethers.js"

    ```js
    import ethers from 'ethers';
    import { ApiPromise, WsProvider } from '@polkadot/api';

    // Configure Ethers provider
    const providerRPC = {
      moonbase: {
        name: 'moonbase-alpha',
        rpc: '{{ networks.moonbase.rpc_url }}',
        chainId: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }} in hex,
      },
    };
    const provider = new ethers.providers.StaticJsonRpcProvider(
      providerRPC.moonbase.rpc, 
      {
        chainId: providerRPC.moonbase.chainId,
        name: providerRPC.moonbase.name,
      }
    );

    // Configure Polkadot.js API provider
    const wsProvider = new WsProvider('{{ networks.moonbase.wss_url }}');
    const polkadotApi = await ApiPromise.create({ provider: wsProvider });
    ```

=== "Web3.js"

    ```js
    import Web3 from 'web3';
    import { ApiPromise, WsProvider } from '@polkadot/api';

    // Configure Web3 provider
    const web3 = new Web3('{{ networks.moonbase.rpc_url }}');

    // Configure Polkadot.js API provider
    const wsProvider = new WsProvider('{{ networks.moonbase.wss_url }}');
    const polkadotApi = await ApiPromise.create({ provider: wsProvider });
    ```

### Get Hex-Encoded Calldata {: #get-hex encoded-calldata }

With the Polkadot.js API configured, you can start to assemble the call you want to make. You can interact with an extrinsic from any of the Substrate-based pallets on Moonbeam. For the purposes of this guide, you'll call the `transfer(dest, value)` method of the balances pallet. 

To get the hex encoded calldata, you can take the following steps:

1. Configure the transaction arguments. For the `transfer` method, you'll need to specify a value for each of the required arguments. In this case, the destination address and the value to send. For this example, you can update the `toAddress` variable with the address you want to send tokens to, and for the `amount`, you can send 1 DEV token, which is `1000000000000000000` in Wei
2. Assemble the transaction using the arguments using the Polkadot.js API
3. Get the encoded calldata of the transaction using the Polkadot.js API `toHex()` method, which returns a hex-base representation of the call

```js
// Specify the arguments
const toAddress = 'INSERT-TO-ADDRESS';
const amount = '1000000000000000000';

// Assemble the transaction
const balancesCall = await polkadotApi.tx.balances.transfer(toAddress, amount);

// Get the encoded calldata
const encodedCallData = balancesCall.method.toHex();
```

### Send Transaction Using Ethereum Library {: #send-tx-using-eth-lib }

Now that you have the hex encoded calldata, the next step is to send the transaction using the Ethereum API. 

First you can assemble the transaction object, passing in the dispatch precompile address in the `to` field and the hex encoded calldata in the `data` field.

```js
const tx = {
    to: '0x0000000000000000000000000000000000000401',
    data: encodedCallData   
}
```

The last piece is to sign and send the transaction using your account's private key.

!!! note
    Never store your private keys in a JavaScript file. The following example is for demo purposes only.

=== "Ethers.js"

    ```js
    const send = async () => {
        const wallet = new ethers.Wallet('INSERT-YOUR-PRIVATE-KEY', provider);

        const createReceipt = await wallet.sendTransaction(tx);
        await createReceipt.wait();
        console.log('Transaction Receipt: ', createReceipt)
    }

    send()
    ```

=== "Web3.js"

    ```js
    const send = async () => {
        const createTransaction = await web3.eth.accounts.signTransaction(
            tx,
            'INSERT-YOUR-PRIVATE-KEY'
        );

        const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
        console.log('Transaction Receipt: ', createReceipt)
    }

    send();
    ```

Altogether, your `dispatch.js` script should resemble the following:

=== "Ethers.js"

    ```js
    import ethers from 'ethers';
    import { ApiPromise, WsProvider } from '@polkadot/api';

    const providerRPC = {
      moonbase: {
        name: 'moonbase-alpha',
        rpc: '{{ networks.moonbase.rpc_url }}',
        chainId: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }} in hex,
      },
    };
    const provider = new ethers.providers.StaticJsonRpcProvider(
      providerRPC.moonbase.rpc, 
      {
        chainId: providerRPC.moonbase.chainId,
        name: providerRPC.moonbase.name,
      }
    );

    const wsProvider = new WsProvider('{{ networks.moonbase.wss_url }}');
    const polkadotApi = await ApiPromise.create({ provider: wsProvider });

    const toAddress = 'INSERT-TO-ADDRESS';
    const amount = '1000000000000000000';
    const balancesCall = await polkadotApi.tx.balances.transfer(toAddress, amount);
    const encodedCallData = balancesCall.method.toHex();

    const send = async () => {
        const wallet = new ethers.Wallet('INSERT-YOUR-PRIVATE-KEY', provider);

        const createReceipt = await wallet.sendTransaction(tx);
        await createReceipt.wait();
        console.log('Transaction Receipt: ', createReceipt)
    }

    send()
    ```

=== "Web3.js"

    ```js
    import Web3 from 'web3';
    import { ApiPromise, WsProvider } from '@polkadot/api';

    const web3 = new Web3('{{ networks.moonbase.rpc_url }}');

    const wsProvider = new WsProvider('{{ networks.moonbase.wss_url }}');
    const polkadotApi = await ApiPromise.create({ provider: wsProvider });

    const toAddress = 'INSERT-TO-ADDRESS';
    const amount = '1000000000000000000';
    const balancesCall = await polkadotApi.tx.balances.transfer(toAddress, amount);
    const encodedCallData = balancesCall.method.toHex();

    const send = async () => {
        const createTransaction = await web3.eth.accounts.signTransaction(
            tx,
            'INSERT-YOUR-PRIVATE-KEY'
        );

        const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
        console.log('Transaction Receipt: ', createReceipt)
    }

    send();
    ```

With all of the code in place, you can run the script from your terminal:

```
node dispatch.js
```

![Call node dispatch.js](/images/builders/pallets-precompiles/precompiles/dispatch/dispatch-2.png)

You should see the receipt of the transaction in your terminal. You can also check to make sure the balance of your sending account has decreased and the balance of the receiving account has increased.