---
title: Gasless Transactions with 0xGasless
description: Learn how to implement gasless transactions on Moonbeam using 0xGasless, enabling users to interact with smart contracts without holding native tokens.
---

# Enabling Gasless Transactions with 0xGasless

## Why Gasless Transactions?

One of the primary challenges in blockchain development has been the requirement for users to hold native tokens (like ETH or GLMR) to pay transaction fees. This traditional EOA-based model creates unnecessary friction, particularly when onboarding users who expect Web2-like experiences.

Gasless transactions can help solve this through Account Abstraction ([ERC-4337](https://eips.ethereum.org/EIPS/eip-4337){target=\_blank}), implementing meta-transactions that separate user actions from fee payment. This architecture allows dApps or third-party paymasters to cover gas costs on behalf of users while smart contract wallets handle the transaction execution. [0xGasless](https://0xgasless.com/index.html){target=\_blank} leverages these principles in its SDK, enabling Moonbeam developers to implement sophisticated features like social logins, transaction batching, and custom wallet controls – all while abstracting away the complexity of gas management from end users.

In the following tutorial, we'll go through the end-to-end steps of setting up a paymaster on 0xGasless and dispatching a gasless transaction to modify the state of a smart contract on Moonbeam.

## Create and Fund a Paymaster

First, you'll need to [register for an account on 0xGasless](https://dashboard.0xgasless.com/auth/sign-in){target=\_blank}. Then, [create a Paymaster](https://dashboard.0xgasless.com/paymaster){target=\_blank} for the Moonbeam Network by pressing **Create Paymaster** and then taking the following steps:

1. Enter a name for your paymaster
2. Select **Moonbeam** as the chain
3. Press **Create**

![Create Paymaster](/images/tutorials/integrations/0xgasless/0xgasless-1.webp)

Your paymaster needs funds to cover gas fees for sponsored transactions. To deposit GLMR into your paymaster, take the following steps:

1. Enter the amount you would like to deposit
2. Press **Deposit** and confirm the transaction in your wallet

![Fund Paymaster](/images/tutorials/integrations/0xgasless/0xgasless-2.webp)

Your deposited funds remain flexible - use them to sponsor gasless transactions or withdraw them whenever needed.

## Dispatching a Gasless Transaction

In the following section, we'll create a script demonstrating how to dispatch a gasless transaction. 

### Prerequisites

Create a `.env` file in your project's root directory with the following:

```bash
PRIVATE_KEY=INSERT_PRIVATE_KEY
RPC_URL=https://rpc.api.moonbeam.network
```

Why are we specifying a private key in the `.env`? While this transaction will be gasless, you still need a private key to sign the transaction. The account associated with this private key:

- Does not need any GLMR tokens
- Will not pay for gas fees
- Is only used for transaction signing

!!! note 

	Never commit your .env file or share your private key. Add .env to your .gitignore file.

Also, make sure you have installed the 0xGasless SDK and supporting `ethers` and `dotenv` packages:

```bash
npm install ethers dotenv @0xgasless/smart-account
```

First, we'll import the required packages as follows:

```js
require('dotenv').config();
const ethers = require('ethers');
const {
  PaymasterMode,
  createSmartAccountClient,
} = require('@0xgasless/smart-account');
```

Next, we'll set the critical constants. We must define the `CHAIN_ID`, `BUNDLER_URL`, and `PAYMASTER_URL`. You can get your unique paymaster URL from the paymaster on your [0xGasless Dashboard](https://dashboard.0xgasless.com/paymaster){target=\_blank}.

The contract address we've defined here is the address of an [Incrementer contract](https://moonscan.io/address/0x3ae26f2c909eb4f1edf97bf60b36529744b09213) on Moonbeam, on which we'll call the increment function specified by the function selector. This simple contract will allow us to easily see if the gasless transaction has been dispatched successfully. 

```js
const CHAIN_ID = 1284; // Moonbeam mainnet
const BUNDLER_URL = `https://bundler.0xgasless.com/${CHAIN_ID}`;
const PAYMASTER_URL =
  'https://paymaster.0xgasless.com/v1/1284/rpc/INSERT_API_KEY';
const CONTRACT_ADDRESS = '0x3aE26f2c909EB4F1EdF97bf60B36529744b09213';
const FUNCTION_SELECTOR = '0xd09de08a';
```

#### Paymaster URL Formatting Note

The Paymaster URL format has recently changed. Use:

```
https://paymaster.0xgasless.com/v1/1284/rpc/INSERT_API_KEY
```

Do not use the deprecated format:

```
https://paymaster.0xgasless.com/api/v1/1284/rpc/INSERT_API_KEY
```

The difference is that `/api` has been removed from the path. Make sure your code uses the current format.

### Sending the Transaction

To send a gasless transaction using the 0xGasless smart account, you can call `smartWallet.sendTransaction()` with two parameters:

   - The `transaction` object containing the contract interaction details
   - A configuration object specifying `paymasterServiceData` with `SPONSORED` mode. This indicates that the 0xGasless paymaster will use the gas tank to pay for the gas. 

The function returns a UserOperation response containing a hash. Wait for the transaction receipt using the `waitForUserOpReceipt()` helper function, which polls for completion with a configurable timeout (default 60 seconds).

```javascript
const userOpResponse = await smartWallet.sendTransaction(transaction, {
  paymasterServiceData: { mode: PaymasterMode.SPONSORED },
});

const receipt = await waitForUserOpReceipt(userOpResponse, 60000);
```

Putting it all together and adding plenty of logging and error handling for easy debugging, the full script is as follows:

??? code "Dispatch a gasless transaction"
    ```javascript
    --8<-- 'code/tutorials/integrations/0xgasless/dispatch.js'
    ```

### Verifying Completion

Upon running the script, you'll see output that looks like the following: 

--8<-- 'code/tutorials/integrations/0xgasless/output.md'

Since the gasless transaction we initiated interacts with an [Incrementer](https://moonscan.io/address/0x3ae26f2c909eb4f1edf97bf60b36529744b09213#readContract){target=\_blank} smart contract on Moonbeam, it's easy to check to see if the transaction was initiated successfully. You can return to [Read Contract section of the Incrementer contract on Moonscan](https://moonscan.io/address/0x3ae26f2c909eb4f1edf97bf60b36529744b09213#readContract) and check the number stored in the contract. Alternatively, you can head to the **Internal Transactions** tab and toggle advanced mode **ON** to see the contract call incrementing the contract. 

For more information about integrating support for gasless transactions into your dApp, be sure to check out the [0xGasless docs](https://gitbook.0xgasless.com/){target=\_blank}.


--8<-- 'text/_disclaimers/educational-tutorial.md'

--8<-- 'text/_disclaimers/third-party-content.md'
