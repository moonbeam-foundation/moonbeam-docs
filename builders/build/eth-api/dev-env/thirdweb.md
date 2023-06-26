---
title: How to use thirdweb
description: Learn how to use thirdweb to create a contract, deploy it, and interact with it in a dapp.
---

## Create Contract

To create a new smart contract using thirdweb CLI, follow these steps:

1. In your CLI run the following command:

   ```
   npx thirdweb create contract
   ```

2. Input your preferences for the command line prompts:
   1. Give your project a name
   2. Choose your preferred framework: Hardhat or Foundry
   3. Name your smart contract
   4. Choose the type of base contract: Empty, [ERC20](https://portal.thirdweb.com/solidity/base-contracts/erc20base), [ERC721](https://portal.thirdweb.com/solidity/base-contracts/erc721base), or [ERC1155](https://portal.thirdweb.com/solidity/base-contracts/erc1155base)
   5. Add any desired [extensions](https://portal.thirdweb.com/solidity/extensions)
3. Once created, navigate to your project’s directory and open in your preferred code editor.
4. If you open the `contracts` folder, you will find your smart contract; this is your smart contract written in Solidity.

   The following is code for an ERC721Base contract without specified extensions. It implements all of the logic inside the [`ERC721Base.sol`](https://github.com/thirdweb-dev/contracts/blob/main/contracts/base/ERC721Base.sol) contract; which implements the [`ERC721A`](https://github.com/thirdweb-dev/contracts/blob/main/contracts/eip/ERC721A.sol) standard.

   ```bash
   // SPDX-License-Identifier: MIT
   pragma solidity ^0.8.0;

   import "@thirdweb-dev/contracts/base/ERC721Base.sol";

   contract Contract is ERC721Base {
       constructor(
           string memory _name,
           string memory _symbol,
           address _royaltyRecipient,
           uint128 _royaltyBps
       ) ERC721Base(_name, _symbol, _royaltyRecipient, _royaltyBps) {}
   }
   ```

   This contract inherits the functionality of ERC721Base through the following steps:

   - Importing the ERC721Base contract
   - Inheriting the contract by declaring that our contract is an ERC721Base contract
   - Implementing any required methods, such as the constructor.

5. After modifying your contract with your desired custom logic, you can deploy it to Moonbeam using [Deploy](https://portal.thirdweb.com/deploy). We will be covering that in the section!

---

Alternatively, you can deploy a prebuilt contract for NFTs, tokens, or marketplace directly from the thirdweb Explore page:

1. Go to the thirdweb Explore page: https://thirdweb.com/explore

![thirdweb Explore](/images/builders/build/eth-api/dev-env/thirdweb/explore.png)

2. Choose the type of contract you want to deploy from the available options: NFTs, tokens, marketplace, and more.
3. Follow the on-screen prompts to configure and deploy your contract.

> For more information on different contracts available on Explore, check out [thirdweb’s documentation.](https://portal.thirdweb.com/pre-built-contracts)

## Deploy Contract

Deploy allows you to deploy a smart contract to any EVM compatible network without configuring RPC URLs, exposing your private keys, writing scripts, and other additional setup such as verifying your contract.

1. To deploy your smart contract using deploy, navigate to the root directory of your project and execute the following command:

   ```bash
   npx thirdweb deploy
   ```

   Executing this command will trigger the following actions:

   - Compiling all the contracts in the current directory.
   - Providing the option to select which contract(s) you wish to deploy.
   - Uploading your contract source code (ABI) to IPFS.

2. When it is completed, it will open a dashboard interface to finish filling out the parameters.
   - `_name`: contract name
   - `_symbol`: symbol or "ticker"
   - `_royaltyRecipient`: wallet address to receive royalties from secondary sales
   - `_royaltyBps`: basis points (bps) that will be given to the royalty recipient for each secondary sale, e.g. 500 = 5%
3. Select Moonbeam as the network
4. Manage additional settings on your contract’s dashboard as needed such as uploading NFTs, configuring permissions, and more.

For additional information on Deploy, please reference [thirdweb’s documentation](https://portal.thirdweb.com/deploy).

## Create Application

Thirdweb offers SDKs for a range of programming languages, such as React, React Native, TypeScript, Python, Go, and Unity.

1. In your CLI run the following command:

   ```bash
   npx thirdweb create --app
   ```

2. Input your preferences for the command line prompts:
   1. Give your project a name
   2. Choose your network: We will choose EVM for Moonbeam
   3. Choose your preferred framework: Next.js, CRA, Vite, React Native, Node.js, or Express
   4. Choose your preferred language: JavaScript or TypeScript
3. Use the React or TypeScript SDK to interact with your application’s functions. See section on “interact with your contract”

## Interact With a Contract

thirdweb provides several SDKs to allow you to interact with your contract including: [React](https://portal.thirdweb.com/react), [React Native](https://portal.thirdweb.com/react-native), [TypeScript](https://portal.thirdweb.com/typescript), [Python](https://portal.thirdweb.com/python), [Go](https://portal.thirdweb.com/go), and [Unity](https://portal.thirdweb.com/unity).

This document will show you how to interact with your contract deployed to Moonbeam using React

> View the [full React SDK reference](https://portal.thirdweb.com/react) in thirdweb’s documentation.

To create a new application pre-configured with thirdweb’s SDKs run and choose your preferred configurations:

```jsx
npx thirdweb create app --evm
```

or install it into your existing project by running:

```jsx
npx thirdweb install
```

### Initialize SDK On Moonbeam

Wrap your application in the `ThirdwebProvider` component and change the `activeChain` to Moonbeam

```jsx
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Moonbeam } from "@thirdweb-dev/chains";

const App = () => {
  return (
    <ThirdwebProvider activeChain={Moonbeam}>
      <YourApp />
    </ThirdwebProvider>
  );
};
```

### Get Contract

To connect to your contract, use the SDK’s [`getContract`](https://portal.thirdweb.com/typescript/sdk.thirdwebsdk.getcontract) method.

```jsx
import { useContract } from "@thirdweb-dev/react";

function App() {
  const { contract, isLoading, error } = useContract("{{contract_address}}");
}
```

### Calling Contract Functions

- For extension based functions, use the built-in supported hooks. The following is an example using the NFTs extension to access a list of NFTs owned by an address- `useOwnedNFTs`

  ```jsx
  import { useOwnedNFTs, useContract, useAddress } from "@thirdweb-dev/react";

  // Your smart contract address
  const contractAddress = "{{contract_address}}";

  function App() {
    const address = useAddress();
    const { contract } = useContract(contractAddress);
    const { data, isLoading, error } = useOwnedNFTs(contract, address);
  }
  ```

  Full reference: https://portal.thirdweb.com/react/react.usenft

- Use the `useContractRead` hook to call any read functions on your contract by passing in the name of the function you want to use.

  ```jsx
  import { useContractRead, useContract } from "@thirdweb-dev/react";

  // Your smart contract address
  const contractAddress = "{{contract_address}}";

  function App() {
    const { contract } = useContract(contractAddress);
    const { data, isLoading, error } = useContractRead(contract, "getName");
  }
  ```

  Full reference: https://portal.thirdweb.com/react/react.usecontractread

- Use the `useContractWrite` hook to call any write functions on your contract by passing in the name of the function you want to use.

  ```jsx
  import {
    useContractWrite,
    useContract,
    Web3Button,
  } from "@thirdweb-dev/react";

  // Your smart contract address
  const contractAddress = "{{contract_address}}";

  function App() {
    const { contract } = useContract(contractAddress);
    const { mutateAsync, isLoading, error } = useContractWrite(
      contract,
      "setName"
    );

    return (
      <Web3Button
        contractAddress={contractAddress}
        // Calls the "setName" function on your smart contract with "My Name" as the first argument
        action={() => mutateAsync({ args: ["My Name"] })}
      >
        Send Transaction
      </Web3Button>
    );
  }
  ```

  Full reference: https://portal.thirdweb.com/react/react.usecontractwrite

### Connect Wallet

Create a custom connect wallet experience by declaring supported wallets passed to your provider.

```jsx
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnectV1,
  walletConnect,
  safeWallet,
  paperWallet,
} from "@thirdweb-dev/react";

function MyApp() {
  return (
    <ThirdwebProvider
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect({
          projectId: "YOUR_PROJECT_ID", // optional
        }),
        walletConnectV1(),
        safeWallet(),
        paperWallet({
          clientId: "YOUR_CLIENT_ID", // required
        }),
      ]}
      activeChain={Moonbeam}
    >
      <App />
    </ThirdwebProvider>
  );
}
```

Add in a connect wallet button to prompt end-users to login with any of the above supported wallets.

```jsx
import { ConnectWallet } from "@thirdweb-dev/react";

function App() {
  return <ConnectWallet />;
}
```

Full reference: https://portal.thirdweb.com/react/connecting-wallets

## Deploy Application

To host your static web application on decentralized storage, run:

```jsx
npx thirdweb deploy --app
```

By running this command, your application is built for production and stored using Storage. The built application is uploaded to IPFS, a decentralized storage network, and a unique URL is generated for your application.

This URL serves as a permanent hosting location for your application on the web.

If you have any further questions or encounter any issues during the process, please reach out to thirdweb support at [support.thirdweb.com](http://support.thirdweb.com/).
