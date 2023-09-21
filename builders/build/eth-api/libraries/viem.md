---
title: How to use viem Ethereum Library
description: Learn how to use the viem TypeScript interface for Ethereum to send transactions and deploy Solidity smart contracts to Moonbeam in this tutorial.
---

# viem TypeScript Ethereum Library

## Introduction {: #introduction }

viem is...

## Checking Prerequisites {: #checking-prerequisites }

For the examples in this guide, you will need to have the following:

 - An account with funds.
  --8<-- 'text/faucet/faucet-list-item.md'
 -
--8<-- 'text/common/endpoint-examples.md'

!!! note
    --8<-- 'text/common/assumes-mac-or-ubuntu-env.md'

## Installing viem {: #installing-viem }

To get started, you'll need to create a basic TypeScript project. First, create a directory to store all of the files you'll be creating throughout this guide, and initialize the project with the following command:

```bash
mkdir viem-examples && cd viem-examples && npm init --y
```

For this guide, you'll need to install the viem library and the Solidity compiler. To install both packages, you can run the following command:

=== "npm"

    ```bash
    npm install viem solc@0.8.0
    ```

=== "yarn"

    ```bash
    yarn add viem solc@0.8.0
    ```

## Set Up a viem Client (Provider) {: #setting-up-a-viem-provider }

Throughout this guide, you'll be creating a bunch of scripts that provide different functionality such as sending a transaction, deploying a contract, and interacting with a deployed contract. In most of these scripts you'll need to create a [viem client](https://docs.ethers.org/v6/api/providers/){target=_blank} to interact with the network.

--8<-- 'text/common/endpoint-setup.md'

You can create a viem client for reading chain data using the `createPublicClient` function from viem or you can create a viem client for sending transactions using the `createWalletClient` function.

### For Reading Chain Data {: #for-reading-chain-data }

To create a client for reading chain data, you can take the following steps:

1. Import the `createPublicClient` and `http` functions from `viem` and the network you want to interact with from `viem/chains`. The chain can be any of the following: `moonbeam`, `moonriver`, or `moonbaseAlpha`
2. Create the `client` using the `createPublicClient` function and pass in the network and the HTTP RPC endpoint

=== "Moonbeam"

    ```ts
    import { createPublicClient, http } from 'viem';
    import { moonbeam } from 'viem/chains';

    const client = createPublicClient({
      chain: moonbeam,
      transport: http('{{ networks.moonbeam.rpc_url }}'),
    });
    ```

=== "Moonriver"

    ```ts
    import { createPublicClient, http } from 'viem';
    import { moonriver } from 'viem/chains';

    const client = createPublicClient({
      chain: moonriver,
      transport: http('{{ networks.moonriver.rpc_url }}'),
    });
    ```

=== "Moonbase Alpha"

    ```ts
    import { createPublicClient, http } from 'viem';
    import { moonbaseAlpha } from 'viem/chains';

    const client = createPublicClient({
      chain: moonbaseAlpha,
      transport: http('{{ networks.moonbase.rpc_url }}');
    })
    ```

### For Writing Chain Data {: #for-writing-chain-data }

To create a client for reading chain data, you can take the following steps:

1. Import the `createWalletClient` and `http` functions from `viem`, the `privateKeyToAccount` function for loading your accounts via their private keys, and the network you want to interact with from `viem/chains`. The chain can be any of the following: `moonbeam`, `moonriver`, or `moonbaseAlpha`
2. Create your account using the `privateKeyToAccount` function
3. Create the `client` using the `createWalletClient` function and pass in the account, network, and the HTTP RPC endpoint

!!! remember
    This is for demo purposes only. Never store your private key in a TypeScript file.

=== "Moonbeam"

    ```ts
    import { createWalletClient, http } from 'viem';
    import { privateKeyToAccount } from 'viem/accounts';
    import { moonbeam } from 'viem/chains';

    const account = privateKeyToAccount('INSERT_PRIVATE_KEY');

    const client = createWalletClient({
      account,
      chain: moonbeam,
      transport: http('{{ networks.moonbeam.rpc_url }}'),
    });
    ```

=== "Moonriver"

    ```ts
    import { createWalletClient, http } from 'viem';
    import { moonriver } from 'viem/chains';

    const account = privateKeyToAccount('INSERT_PRIVATE_KEY');

    const client = createWalletClient({
      account,
      chain: moonriver,
      transport: http('{{ networks.moonriver.rpc_url }}'),
    });
    ```

=== "Moonbase Alpha"

    ```ts
    import { createWalletClient, http } from 'viem';
    import { moonbaseAlpha } from 'viem/chains';

    const account = privateKeyToAccount('INSERT_PRIVATE_KEY');

    const client = createWalletClient({
      account,
      chain: moonbaseAlpha,
      transport: http('{{ networks.moonbase.rpc_url }}'),
    });
    ```

!!! note
    To interact with browser-based wallets, you can use the following code to create an account:

    ```ts
    const [account] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    const client = createWalletClient({
      account,
      chain: moonbeam,
      transport: custom(window.ethereum),
    });
    ```

## Send a Transaction {: #send-transaction }

During this section, you'll be creating a couple of scripts. The first one will be to check the balances of your accounts before trying to send a transaction. The second script will actually send the transaction.

You can also use the balance script to check the account balances after the transaction has been sent.

### Check Balances Script {: #check-balances-script }

You'll only need one file to check the balances of both addresses before and after the transaction is sent. To get started, you can create a `balances.ts` file by running:

```bash
touch balances.ts
```

Next, you will create the script for this file and complete the following steps:

1. Add the `formatEther` function to your `viem` import
2. [Set up the viem client for reading chain data](#for-reading-chain-data)
3. Define the `addressFrom` and `addressTo` variables
4. Create the asynchronous `balances` function which wraps the `client.getBalance` method
5. Use the `client.getBalance` function to fetch the balances for the `addressFrom` and `addressTo` addresses. You can also leverage the `formatEther` function to transform the balance into a more readable number in ETH
6. Lastly, run the `balances` function

```js
// 1. Update imports
import { createPublicClient, http, formatEther} from 'viem'
import { moonbeam } from 'viem/chains'

// 2. Add the viem client logic for reading chain data
// {...}

// 3. Create address variables
const addressFrom = 'INSERT_FROM_ADDRESS';
const addressTo = 'INSERT_TO_ADDRESS';

// 4. Create balances function
const balances = async () => {
  // 5. Fetch balances
  const balanceFrom = formatEther(
    await client.getBalance({ address: addressFrom })
  );
  const balanceTo = formatEther(
    await client.getBalance({ address: addressTo })
  );

  console.log(`The balance of ${addressFrom} is: ${balanceFrom} DEV`);
  console.log(`The balance of ${addressTo} is: ${balanceTo} DEV`);
};

// 6. Call the balances function
balances();
```

??? code "View the complete script"

    ```ts
    --8<-- 'code/libraries/viem/balances.ts'
    ```

To run the script and fetch the account balances, you can run the following command:

```bash
npx ts-node balances.ts
```

If successful, the balances for the origin and receiving address will be displayed in your terminal in DEV.

### Send Transaction Script {: #send-transaction-script }

You'll only need one file for executing a transaction between accounts. For this example, you'll be transferring 1 DEV token from an origin address (from which you hold the private key) to another address. To get started, you can create a `transaction.ts` file by running:

```bash
touch transaction.ts
```

Next, you will create the script for this file and complete the following steps:

1. Add the `parseEther` function to your `viem` import
2. [Set up the viem client for writing chain data](#for-writing-chain-data) by creating a wallet client using your private key. **Note: This is for example purposes only. Never store your private keys in a TypeScript file**
3. Define the `addressTo` variable
4. Create the asynchronous `send` function which wraps the transaction object and the `client.sendTransaction` method
5. Use the `sendTransaction` function to sign and send the transaction. You'll need to pass in the transaction object, which only requires the recipient's address and the amount to send. Note that `parseEther` can be used, which handles the necessary unit conversions from Ether to Wei, similar to using `parseUnits(value, decimals)`. Use `await` to wait until the transaction is processed and the transaction receipt is returned
6. Lastly, run the `send` function

```js
// 1. Update imports
import { createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { moonbaseAlpha } from 'viem/chains';

// 2. Add the viem client logic for writing chain data
// {...}

// 3. Create address to variable
const addressTo = 'INSERT_TO_ADDRESS';

// 4. Create send function
const send = async () => {
  console.log(
    `Attempting to send transaction from ${account.address} to ${addressTo}`
  );

  // 5. Sign and send tx
  const hash = await client.sendTransaction({
    to: addressTo,
    value: parseEther('1'),
  });
  console.log(`Transaction successful with hash: ${hash}`);
};

// 6. Call the send function
send();
```

??? code "View the complete script"

    ```ts
    --8<-- 'code/libraries/viem/transaction.ts'
    ```

To run the script, you can run the following command in your terminal:

```bash
npx ts-node transaction.js
```

If the transaction was succesful, in your terminal you'll see the transaction hash has been printed out.

You can also use the `balances.ts` script to check that the balances for the origin and receiving accounts have changed. The entire workflow would look like this:

TODO: update image 
![Send Tx Etherjs](/images/builders/build/eth-api/libraries/ethers/ethers-1.png)

## Deploy a Contract {: #deploy-contract }

### Compile Contract Script {: #compile-contract-script }

### Deploy Contract Script {: #deploy-contract-script }

### Read Contract Data (Call Methods) {: #read-contract-data }

### Interact with Contract (Send Methods) {: #interact-with-contract }
