---
title: How to use thirdweb
description: This guide will show you some of thirdweb's features to take advantage of to develop and deploy smart contracts and interact with them in DApps on Moonbeam.
---

# Using thirdweb on Moonbeam

## Introduction {: #introduction }

[thirdweb](https://thirdweb.com/){target=\_blank} is a complete Web3 development framework that provides everything you need to develop smart contracts, build DApps, and more.

With thirdweb, you can access tools to help you through every phase of the DApp development cycle. You can create your own custom smart contracts or use any of thirdweb's prebuilt contracts to quickly get started. From there, you can use thirdweb's CLI to deploy your smart contracts. Then you can interact with your smart contracts by creating a Web3 application using the language of your choice, including but not limited to React, TypeScript, and Python.

This guide will show you some of the thirdweb features you can take advantage of to develop smart contracts and DApps on Moonbeam. To check out all of the features thirdweb has to offer, please refer to the [thirdweb documentation site](https://portal.thirdweb.com/){target=\_blank}.

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

5. After modifying your contract with your desired custom logic, you can deploy it to Moonbeam using [Deploy](https://portal.thirdweb.com/deploy){target=\_blank}. That will be covered in the next section!

Alternatively, you can deploy a prebuilt contract for NFTs, tokens, or marketplace directly from the thirdweb Explore page:

1. Go to the [thirdweb Explore page](https://thirdweb.com/explore){target=\_blank}

    ![thirdweb Explore](/images/builders/build/eth-api/dev-env/thirdweb/thirdweb-1.webp)

2. Choose the type of contract you want to deploy from the available options: NFTs, tokens, marketplace, and more
3. Follow the on-screen prompts to configure and deploy your contract

For more information on different contracts available on Explore, check out [thirdweb’s documentation on prebuilt contracts](https://portal.thirdweb.com/pre-built-contracts){target=\_blank}.

## Deploy Contract {: #deploy-contract }

[Deploy](https://portal.thirdweb.com/deploy){target=\_blank} is thirdweb's tool that allows you to easily deploy a smart contract to any EVM compatible network without configuring RPC URLs, exposing your private keys, writing scripts, and other additional setup such as verifying your contract.

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

3. Select Moonbeam as the network
4. Manage additional settings on your contract’s dashboard as needed such as uploading NFTs, configuring permissions, and more

For additional information on Deploy, please reference [thirdweb’s documentation](https://portal.thirdweb.com/deploy){target=\_blank}.

## Create Application {: #create-application }

thirdweb offers SDKs for a range of programming languages, such as React, React Native, TypeScript, Python, Go, and Unity. You'll start off by creating an application and then you can choose which SDK to use:

1. In your CLI run the following command:

    ```bash
    npx thirdweb create --app
    ```

2. Input your preferences for the command line prompts:

    1. Give your project a name
    2. Choose your network. You can choose **EVM** for Moonbeam
    3. Choose your preferred framework: **Next.js**, **Create React App**, **Vite**, **React Native**, **Node.js**, or **Express**. For this example, you can select **Create React App**
    4. Choose your preferred language: **JavaScript** or **TypeScript**

3. Use the React or TypeScript SDK to interact with your application’s functions. This will be covered in the following section on interacting with a contract

## Interact With a Contract {: #interact-with-a-contract }

thirdweb provides several SDKs to allow you to interact with your contract including: [React](https://portal.thirdweb.com/react){target=\_blank}, [React Native](https://portal.thirdweb.com/react-native){target=\_blank}, [TypeScript](https://portal.thirdweb.com/typescript){target=\_blank}, [Python](https://portal.thirdweb.com/python){target=\_blank}, [Go](https://portal.thirdweb.com/go){target=\_blank}, and [Unity](https://portal.thirdweb.com/unity){target=\_blank}.

This document will show you how to interact with your contract deployed to Moonbeam using React. You can view the [full React SDK reference](https://portal.thirdweb.com/react){target=\_blank} in thirdweb’s documentation.

To create a new application pre-configured with thirdweb’s SDKs run and choose your preferred configurations:

```bash
npx thirdweb create app --evm
```

Or install it into your existing project by running:

```bash
npx thirdweb install
```

### Initialize SDK On Moonbeam {: #initialize-sdk-on-moonbeam }

Wrap your application in the `ThirdwebProvider` component and change the `activeChain` to Moonbeam.

```javascript
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { Moonbeam } from '@thirdweb-dev/chains';

const App = () => {
  return (
    <ThirdwebProvider activeChain={Moonbeam}>
      <YourApp />
    </ThirdwebProvider>
  );
};
```

### Get Contract {: #get-contract }

To connect to your contract, use the SDK’s [`getContract`](https://portal.thirdweb.com/typescript/sdk.thirdwebsdk.getcontract){target=\_blank} method.

```javascript
import { useContract } from '@thirdweb-dev/react';

function App() {
  const { contract, isLoading, error } = useContract('INSERT_CONTRACT_ADDRESS');
}
```

### Calling Contract Functions {: #calling-contract-functions }

For extension based functions, use the built-in supported hooks. There are several hooks available for you to use, the following are a few examples:

- Use the NFTs extension to access a list of NFTs owned by an address via the [`useOwnedNFTs` hook](https://portal.thirdweb.com/react/react.useownednfts){target=\_blank}:

    ```javascript
    import { useOwnedNFTs, useContract, useAddress } from '@thirdweb-dev/react';

    // Your smart contract address
    const contractAddress = 'INSERT_CONTRACT_ADDRESS';

    function App() {
      const address = useAddress();
      const { contract } = useContract(contractAddress);
      const { data, isLoading, error } = useOwnedNFTs(contract, address);
    }
    ```

- Use the [`useContractRead` hook](https://portal.thirdweb.com/react/react.usecontractread){target=\_blank} to call any read functions on your contract by passing in the name of the function you want to use:

    ```javascript
    import { useContractRead, useContract } from '@thirdweb-dev/react';

    // Your smart contract address
    const contractAddress = 'INSERT_CONTRACT_ADDRESS';

    function App() {
      const { contract } = useContract(contractAddress);
      // Read data from your smart contract using the function or variables name
      const { data, isLoading, error } = useContractRead(contract, 'INSERT_NAME');
    }
    ```

- Use the [`useContractWrite` hook](https://portal.thirdweb.com/react/react.usecontractwrite){target=\_blank} to call any write functions on your contract by passing in the name of the function you want to use:

    ```javascript
    import {
      useContractWrite,
      useContract,
      Web3Button,
    } from '@thirdweb-dev/react';

    // Your smart contract address
    const contractAddress = 'INSERT_CONTRACT_ADDRESS';

    function App() {
      const { contract } = useContract(contractAddress);
      const { mutateAsync, isLoading, error } = useContractWrite(
        contract,
        'INSERT_NAME'
      );

      return (
        <Web3Button
          contractAddress={contractAddress}
          // Calls the 'INSERT_NAME' function on your smart contract
          // with 'INSERT_ARGUMENT' as the first argument
          action={() => mutateAsync({ args: ['INSERT_ARGUMENT'] })}
        >
          Send Transaction
        </Web3Button>
      );
    }
    ```

### Connect Wallet {: #connect-wallet }

There are a couple of ways that you can create a custom [connect wallet](https://portal.thirdweb.com/react/connecting-wallets){target=\_blank} experience. You can use the [`ConnectWallet` component](https://portal.thirdweb.com/react/connecting-wallets#using-the-connect-wallet-button){target=\_blank} or, for a more customizable approach, you can use the [`useConnect` hook](https://portal.thirdweb.com/react/connecting-wallets#using-hooks){target=\_blank}.

The following example will show you how to use the `ConnectWallet` component. To go this route, you will need to specify the supported wallets and pass them to your provider.

```javascript
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnectV1,
  walletConnect,
  safeWallet,
  paperWallet,
} from '@thirdweb-dev/react';

function MyApp() {
  return (
    <ThirdwebProvider
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect({
          projectId: 'INSERT_YOUR_PROJECT_ID', // optional
        }),
        walletConnectV1(),
        safeWallet(),
        paperWallet({
          clientId: 'INSERT_YOUR_CLIENT_ID', // required
        }),
      ]}
      activeChain={Moonbeam}
    >
      <App />
    </ThirdwebProvider>
  );
}
```

Next, you'll need to add in a connect wallet button to prompt end-users to login with any of the above supported wallets.

```javascript
import { ConnectWallet } from '@thirdweb-dev/react';

function App() {
  return <ConnectWallet />;
}
```

## Deploy Application {: #deploy-application }

To host your static web application on decentralized storage, run:

```bash
npx thirdweb deploy --app
```

By running this command, your application is built for production and stored using [Storage](https://portal.thirdweb.com/storage){target=\_blank}, thirdweb's decentralized file management solution. The built application is uploaded to IPFS, a decentralized storage network, and a unique URL is generated for your application. This URL serves as a permanent hosting location for your application on the web.

If you have any further questions or encounter any issues during the process, please reach out to thirdweb support at [support.thirdweb.com](http://support.thirdweb.com/){target=\_blank}.

--8<-- 'text/_disclaimers/third-party-content.md'