---
title: How to use thirdweb
description: This guide will show you some of thirdweb's features, including building, testing, and deploying smart contract templates to launch dApps on Moonbeam.
---

# Using thirdweb on Moonbeam

## Introduction {: #introduction }

[thirdweb](https://thirdweb.com){target=\_blank} is a complete Web3 development framework that provides everything you need to develop smart contracts, build DApps, and more.

With thirdweb, you can access tools to help you through every phase of the DApp development cycle. You can create your own custom smart contracts or use any of thirdweb's prebuilt contracts to get started quickly. From there, you can use thirdweb's CLI to deploy your smart contracts. Then you can interact with your smart contracts by creating a Web3 application using the language of your choice, including but not limited to React, TypeScript, and Python.

This guide will show you some of the thirdweb features you can use to develop smart contracts and DApps on Moonbeam. To check out all of the features thirdweb has to offer, please refer to the [thirdweb documentation site](https://portal.thirdweb.com){target=\_blank}.

## Create Contract {: #create-contract }

To create a new smart contract using the thirdweb CLI, follow these steps:

1. In your CLI, run the following command:

    ```bash
    npx thirdweb create contract
    ```

2. Input your preferences for the command line prompts:
    1. Give your project a name
    2. Choose your preferred framework: **Hardhat** or **Foundry**
    3. Name your smart contract
    4. Choose the type of base contract: **Empty**, [**ERC20**](https://portal.thirdweb.com/solidity/base-contracts/erc20base){target=\_blank}, [**ERC721**](https://portal.thirdweb.com/solidity/base-contracts/erc721base){target=\_blank}, or [**ERC1155**](https://portal.thirdweb.com/solidity/base-contracts/erc1155base){target=\_blank}
    5. Add any desired [extensions](https://portal.thirdweb.com/solidity/extensions){target=\_blank}
3. Once created, navigate to your project’s directory and open in your preferred code editor
4. If you open the `contracts` folder, you will find your smart contract; this is your smart contract written in Solidity

    The following is code for an `ERC721Base` contract without specified extensions. It implements all of the logic inside the [`ERC721Base.sol`](https://github.com/thirdweb-dev/contracts/blob/main/contracts/base/ERC721Base.sol){target=\_blank} contract; which implements the [`ERC721A`](https://github.com/thirdweb-dev/contracts/blob/main/contracts/eip/ERC721A.sol){target=\_blank} standard.

    ```solidity
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    import '@thirdweb-dev/contracts/base/ERC721Base.sol';

    contract Contract is ERC721Base {
        constructor(
            string memory _name,
            string memory _symbol,
            address _royaltyRecipient,
            uint128 _royaltyBps
        ) ERC721Base(_name, _symbol, _royaltyRecipient, _royaltyBps) {}
    }
    ```

    This contract inherits the functionality of `ERC721Base` through the following steps:

    - Importing the `ERC721Base` contract
    - Inheriting the contract by declaring that your contract is an `ERC721Base` contract
    - Implementing any required methods, such as the constructor

5. After modifying your contract with your desired custom logic, you can deploy it to Moonbeam using [Deploy](https://portal.thirdweb.com/contracts/deploy/overview){target=\_blank}. That will be covered in the next section!

Alternatively, you can deploy a prebuilt contract for NFTs, tokens, or marketplace directly from the thirdweb Explore page:

1. Go to the [thirdweb Explore page](https://thirdweb.com/explore){target=\_blank}

    ![thirdweb Explore](/images/builders/ethereum/dev-env/thirdweb/thirdweb-1.webp)

2. Choose the type of contract you want to deploy from the available options: NFTs, tokens, marketplace, and more
3. Follow the on-screen prompts to configure and deploy your contract

For more information on different contracts available on Explore, check out [thirdweb’s documentation on prebuilt contracts](https://portal.thirdweb.com/contracts){target=\_blank}.

## Deploy Contract {: #deploy-contract }

[Deploy](https://portal.thirdweb.com/contracts/deploy/overview){target=\_blank} is thirdweb's tool that allows you to easily deploy a smart contract to any EVM compatible network without configuring RPC URLs, exposing your private keys, writing scripts, and other additional setup such as verifying your contract.

1. To deploy your smart contract using deploy, navigate to the root directory of your project and execute the following command:

    ```bash
    npx thirdweb deploy
    ```

    Executing this command will trigger the following actions:

    - Compiling all the contracts in the current directory
    - Providing the option to select which contract(s) you wish to deploy
    - Uploading your contract source code (ABI) to IPFS

2. When it is completed, it will open a dashboard interface to finish filling out the parameters

    - `_name` - contract name
    - `_symbol` - symbol or "ticker"
    - `_royaltyRecipient` - wallet address to receive royalties from secondary sales
    - `_royaltyBps` - basis points (bps) that will be given to the royalty recipient for each secondary sale, e.g. 500 = 5%

3. Select the desired Moonbeam network, e.g., Moonbeam, Moonriver, or Moonbase Alpha
4. Manage additional settings on your contract’s dashboard as needed such as uploading NFTs, configuring permissions, and more

    ![thirdweb deploy](/images/builders/ethereum/dev-env/thirdweb/thirdweb-2.webp)

For additional information on Deploy, please reference [thirdweb’s documentation](https://portal.thirdweb.com/contracts/deploy/overview){target=\_blank}.

## Create Application {: #create-application }

thirdweb offers SDKs for a range of programming languages, such as React, React Native, TypeScript, Python, Go, and Unity. You'll start off by creating an application and then you can choose which SDK to use:

1. In your CLI run the following command:

    ```bash
    npx thirdweb create --app
    ```

2. Input your preferences for the command line prompts:

    1. Give your project a name
    2. Choose your preferred framework: **Next.js**, **Vite**, or **React Native**. For this example, select **Vite**

3. Use the React or TypeScript SDK to interact with your application’s functions. This will be covered in the following section on interacting with a contract

### Specify Client ID {: #specify-client-id }

Before you launch your dApp (locally or publicly deployed), you must have a thirdweb Client ID associated with your project. A thirdweb Client ID is synonymous with an API key. You can create a free API key by [signing into your thirdweb Account and navigating to **Settings** then click on **API Keys**](https://thirdweb.com/create-api-key){target=\_blank}.

Press **Create API Key** then take the following steps:

1. Give your API key a name
2. Enter the allowed domains that the API key should accept requests from. It's recommended that you allow only necessary domains, but for development purposes, you can select **Allow all domains**
3. Press **Next** and confirm the prompt on the next page

Finally, specify your Client ID (API Key) in your `.env` file. If using Vite, thirdweb references it in the `client.ts` and assumes the API key will be in your `.env` file named `VITE_TEMPLATE_CLIENT_ID`. If you don't set this value correctly, you'll get a blank screen when trying to build the web app.

!!! note
    The respective name for your Client ID variable will vary with the framework you've chosen, e.g., Vite will be `VITE_TEMPLATE_CLIENT_ID`, Next.js will be `NEXT_PUBLIC_TEMPLATE_CLIENT_ID`, and React Native will be `EXPO_PUBLIC_THIRDWEB_CLIENT_ID`.

![thirdweb create API key](/images/builders/ethereum/dev-env/thirdweb/thirdweb-3.webp)

## Interact With a Contract {: #interact-with-a-contract }

thirdweb provides several SDKs to allow you to interact with your contract including: [React](https://portal.thirdweb.com/typescript/v5/react){target=\_blank}, [React Native](https://portal.thirdweb.com/typescript/v5/react-native){target=\_blank}, [TypeScript](https://portal.thirdweb.com/typescript/v5){target=\_blank}, and [Unity](https://portal.thirdweb.com/unity){target=\_blank}.

This document will show you how to interact with your contract deployed to Moonbeam using React. You can view the [full React SDK reference](https://portal.thirdweb.com/typescript/v5/react){target=\_blank} in thirdweb’s documentation.

### Run Locally {: #run-locally }

To run your dApp locally for testing and debugging purposes, use the command: 

```bash
yarn dev
```

The app will compile and specify the localhost and port number for you to visit in your browser.

![thirdweb run locally](/images/builders/ethereum/dev-env/thirdweb/thirdweb-4.webp)

### Create Client ID {: #create-client-id }

If you generated your thirdweb app with Vite, you'll have a `client.ts` file that looks like the below. As long you've created a `.env` file with your thirdweb API Key (Client ID) defined in `VITE_TEMPLATE_CLIENT_ID`, you can leave the `client.ts` as is and proceed to the next section.

```typescript title="client.ts"
import { createThirdwebClient } from "thirdweb";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = import.meta.env.VITE_TEMPLATE_CLIENT_ID;

export const client = createThirdwebClient({
  clientId: clientId,
});

```

### Configure Chain {: #configure-chain }

thirdweb offers a small number of chains from `@thirdweb/chains` and does not include Moonbeam networks in that list, so you'll need to specify the network details including chain ID and RPC URL. You can create a custom chain with [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain){target=\_blank} as follows:

```typescript title="App.tsx"
import { defineChain } from "thirdweb";

  const moonbase = defineChain({
  id: BigInt(1287),
  rpc: "https://moonbase-rpc.dwellir.com",
})
```

### Get Contract {: #get-contract }

To connect to your contract, use the SDK’s [`getContract`](https://portal.thirdweb.com/references/typescript/v5/getContract){target=\_blank} method.  As an example, let's fetch data from an [Incrementer contract on Moonbase Alpha](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8){target=\_blank}.

```typescript title="App.tsx"
import { getContract } from "thirdweb";
import { client } from "./client";

const myContract = getContract({
  client,             
  chain: moonbase,       
  address: INSERT_CONTRACT_ADDRESS,   
  abi: INSERT_ABI               
});
```

### Calling Contract Functions {: #calling-contract-functions }

To call a contract in the latest version of the SDK, you can use [`prepareContractCall`](https://portal.thirdweb.com/typescript/v5/transactions/prepare){target=\_blank}.

```typescript title="App.tsx"
import { prepareContractCall } from "thirdweb";

const tx = prepareContractCall({
          contract,
          method: "increment",
          params: [],
        });
```

We can trigger this contract call from a ThirdWeb [Transaction button](https://portal.thirdweb.com/typescript/v5/react/components/TransactionButton){target=\_blank}, which has some neat features built in. For example, if you're on the incorrect network, the button will prompt you to switch networks. In the below snippet we'll also add some error handling as a good practice. 

```typescript title="App.tsx"
import { TransactionButton } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";

function IncrementButton({ contract }) {
  return (
    <TransactionButton
      transaction={() => {
        console.log("Preparing to call increment...");
        // Verify that 'contract' is not undefined
        if (!contract) {
          console.error("Contract is undefined.");
          return;
        }
        const tx = prepareContractCall({
          contract,
          method: "increment",
          params: [],
        });
        return tx;
      }}
      onTransactionSent={(result) => {
        console.log("Transaction submitted", result.transactionHash);
      }}
      onTransactionConfirmed={(receipt) => {
        console.log("Transaction confirmed", receipt.transactionHash);
      }}
      onError={(error) => {
        console.error("Transaction error", error);
      }}
    >
      Increment Counter
    </TransactionButton>
  );
}
```

### Reading Contract State {: #read-contract-state }

- Use the [`readContract` function](https://portal.thirdweb.com/typescript/v5/transactions/read){target=\_blank} to call any read functions on your contract by passing in the Solidity method signature and the params.

```typescript title="App.tsx"
import { readContract } from "thirdweb";

const number = await readContract({
      contract: contract,
      method: "number",
      params: [],
    });
```

### Connect Wallet {: #connect-wallet }

Next, let's customize the [Connect Button](https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton){target=\_blank} to tailor it our desired wallets. You can add or remove wallets from the wallets array to change the options available to users. ThirdWeb also offers a [ConnectButton Playground](https://thirdweb.com/dashboard/connect/playground) to customize and view changes in real-time given the high degree of flexibility offered by the button. 

```typescript title="App.tsx"
import { ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
 
const wallets = [
  inAppWallet(),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
];
 
function Example() {
  return (
    <div>
      <ConnectButton client={client} wallets={wallets} />
    </div>
  );
}
```

## Deploy Application {: #deploy-application }

Putting it all together, you can view the full code for the App.tsx file below:

??? code "View the complete App.tsx script"
    ```typescript
    --8<-- 'code/builders/ethereum/dev-env/thirdweb/App.tsx'
    ```


And that's it! As a reminder, you can run your app locally with the following command:
 
```bash
yarn dev
```

![Locally built dApp](/images/builders/ethereum/dev-env/thirdweb/thirdweb-5.webp)

To host your static web application on decentralized storage, run:

```bash
npx thirdweb deploy --app
```

By running this command, your application is built for production and stored using [Storage](https://portal.thirdweb.com/infrastructure/storage/overview){target=\_blank}, thirdweb's decentralized file management solution. The built application is uploaded to IPFS, a decentralized storage network, and a unique URL is generated for your application. This URL serves as a permanent hosting location for your application on the web.

If you have any further questions or encounter any issues during the process, please reach out to thirdweb support at [support.thirdweb.com](http://support.thirdweb.com){target=\_blank}.

--8<-- 'text/_disclaimers/third-party-content.md'