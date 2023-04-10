---
title: Complete DApp Architecture
description: Learn about the frontend, smart contracts, and storage system of Decentralized Applications (DApp) by dissecting an entire example project.
---

# Complete DApp Architecture

![Learn about the entire architecture of DApps.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-banner.png)
_April 15, 2023 | by Jeremy Boetticher_

Decentralized applications, or DApps, have redefined how applications are built, managed, and interacted with in Web3. By leveraging blockchain technology, DApps provide a secure, transparent, and trustless system that enables peer-to-peer interactions without any central authority. At the core of a DApp's architecture are several main components that work in tandem to create a robust, decentralized ecosystem. These components include smart contracts, nodes, frontend user interfaces, and decentralized storage solutions.  

**put an image here that shows the relationships between all of the different components**

In this tutorial, you'll come face-to-face with each major component by writing a full DApp that mints tokens. We'll also explore additional optional components of DApps that can enhance user experience for your future projects. You can view the complete project in its [monorepo on GitHub](https://github.com/jboetticher/complete-example-dapp){target=_blank}.  

![DApp End Result](/images/tutorials/eth-api/complete-dapp/complete-dapp-2.png)

## Checking Prerequisites {: #checking-prerequisites } 

To get started, you will need the following:

 - A Moonbase Alpha account funded with DEV. 
  --8<-- 'text/faucet/faucet-list-item.md'
 - [Node.js](https://nodejs.org/en/download/){target=_blank} version 16 or newer installed
 - [VS Code](https://code.visualstudio.com/){target=_blank} with Juan Blanco's [Solidity extension](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity){target=_blank} is a recommended IDE
 - Understanding of JavaScript and React
 - Novice familiarity with Solidity. If you are not familiar with writing Solidity, there are many resources out there, including [Solidity by Example](https://solidity-by-example.org/){target=_blank}. A 15 minute skim should suffice for this tutorial
 - Have a wallet like [MetaMask installed](/tokens/connect/metamask){target=_blank}

## Nodes and JSON-RPC Endpoints {: #nodes-and-json-rpc-endpoints }

Generally speaking, a JSON-RPC is a remote procedure call (RPC) protocol that utilizes JSON to encode data. For Web3, they refer to the specific JSON-RPCs that DApp developers use to send requests and receive responses from blockchain nodes, making it a crucial element in interactions with smart contracts. They allow frontend user interfaces to seamlessly interact with the smart contracts and provide users with real-time feedback on their actions. They also allow developers to deploy their smart contracts in the first place!  

To get a JSON-RPC to communicate with a Moonbeam blockchain, you need to run a node. But that can be expensive, complicated, and a hassle. Fortunately, as long as you have *access* to a node, you can interact with the blockchain. Moonbase Alpha has a [handful of free and paid node options](/learn/platform/networks/moonbase/#network-endpoints){target=_blank}. For this tutorial, we will be using the Moonbeam Foundation's public node for Moonbase Alpha: `https://rpc.api.moonbase.moonbeam.network`, but you are encouraged to get your own private endpoint.  

So now you have a URL. How do you use it? Over `HTTPS`, JSON-RPC requests are `POST` requests that include specific methods for reading and writing data, such as `eth_call` for executing a smart contract function in a read-only manner or `eth_sendRawTransaction` for submitting signed transactions to the network (calls that change the blockchain state). The entire JSON request structure will always have a structure similar to the following:  

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_getBalance",
  "params": ["0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac", "latest"]
}
```

This example is getting the balance (in DEV on Moonbase Alpha) of the `0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac` account. Let's break down the elements:  

- `jsonrpc` — the API version of the JSON-RPC, usually "2.0"
- `id` — an integer value that helps with identifying a response to a request. Can usually just keep it as `
- `method` — the specific method to read/write data from/to the blockchain. You can see many of the [methods on our docs site](/builders/get-started/eth-compare/rpc-support){target=_blank}
- `params` — an array of the input parameters expected by the specific `method`  

There are also additional elements that can be added to JSON-RPC requests, but those four will be seen the most often.  

Now, these JSON-RPC requests are pretty useful, but when writing code it can be a hassle to create a JSON object over and over again. That's why there exist libraries that help abstract and facilitate the usage of these requests. Moonbeam provides [documentation on many libraries](/builders/build/eth-api/libraries){target=_blank}, and the one that we will be using in this tutorial is [Ethers.js](/builders/build/eth-api/libraries/ethersjs){target=_blank}. Just understand that whenever we interact with the blockchain through the Ethers.js package, we're really using the JSON-RPC!  

## Smart Contracts {: #smart-contracts }

Smart contracts are self-executing contracts with the terms of the agreement directly written into code. They serve as the decentralized backend of any DApp, automating and enforcing the business logic within the system.  

If coming from traditional web development, smart contracts are meant to replace the backend with important cavieats: the user must have the gas currency (GLMR, MOVR, DEV, etc) to make state-changing requests, storing information can be expensive, and **no information stored is private**.  

When you deploy a smart contract onto Moonbeam, you upload a series of instructions that can be understood by the EVM, or the Ethereum Virtual Machine. Whenever someone interacts with a smart contract, these transparent, tamper-proof, and immutable instructions are executed by the EVM to change the blockchain's state. Writing the instructions in a smart contract properly is very important since the blockchain's state defines the most crucial information about your DApp, such as who has what amount of money.  

Since the instructions are difficult to write and make sense of at a low (assembly) level, we have smart contract languages such as Solidity to make it easier to write them. To help write, debug, test, and compile these smart contract languages, developers in the Ethereum community have created developer environments such as [HardHat](/tutorials/eth-api/hardhat-start-to-end){target=_blank} and [Foundry](/tutorials/eth-api/foundry-start-to-end){target=_blank}. Moonbeam's developer site provides information on a [plethora of developer environments](/builders/build/eth-api/dev-env){target=_blank}.    

This tutorial will use HardHat for managing smart contracts. You can initialize a project with HardHat using the following command:  

```bash
npx hardhat init
```

Before we start writing the smart contract, let's add a JSON-RPC URL to the config. Set the `hardhat.config.js` file with the following code, and replace `YOUR_PRIVATE_KEY` with your funded account's private key. This is for testing purposes, **never store your private key in plain text with real funds**.  

```javascript
require("@nomicfoundation/hardhat-toolbox");
module.exports = {
  solidity: "0.8.17",
  networks: {
    moonbase: {
      url: 'https://rpc.api.moonbase.moonbeam.network',
      chainId: 1287, // 0x507 in hex,
      accounts: ["YOUR_PRIVATE_KEY"]
    }
  }
};
```

### Writing Smart Contracts {: #writing-smart-contracts }

Recall that we're making a DApp that allows you to mint a token for a price. Let's write a smart contract that reflects this functionality!  

Once you've initialized a HardHat project, you'll be able to write smart contracts in its `contracts` folder. This folder will have an initial smart contract, likely called `Lock.sol`, but you should delete it and add a new smart file called `MintableERC20.sol`.  

The standard for tokens is called `ERC-20`, where ERC stands for "*Ethereum Request for Comment*". A long time ago this standard was defined, and now most smart contracts that work with tokens expect tokens to have all of the functionality defined by `ERC-20`. Fortunately, you don't have to know it from memory since the OpenZeppelin smart contract team provides us with smart contract bases to use.  

Install OpenZeppelin smart contracts:  

```bash
npm install @openzeppelin/contracts
```

Now, in your `MintableERC20.sol`, add the following code:  

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintableERC20 is ERC20, Ownable {
    constructor() ERC20("Mintable ERC 20", "MERC") {}
}
```

When writing smart contracts, you're going to have to compile eventually. Every developer environment for smart contracts will have this functionality. In HardHat, you can compile with:  

```bash
npx hardhat compile
```

Everything should compile well, so let's continue by adding functionality. Add the following constants, errors, event, and function to your solidity file:  

```solidity
    uint256 public constant MAX_TO_MINT = 1000 ether;
    uint256 public constant NATIVE_TO_TOKEN = 1 ether;

    event PurchaseOccurred(address minter, uint256 amount);
    error MustMintOverZero();
    error MintRequestOverMax();
    error FailedToSendEtherToOwner();

    /**Purchases some of the token with native gas currency. */
    function purchaseMint() payable external {
        // Calculate amount to mint
        uint256 amountToMint = msg.value / NATIVE_TO_TOKEN;

        // Check for no errors
        if(amountToMint == 0) revert MustMintOverZero();
        if(amountToMint + totalSupply() > MAX_TO_MINT) revert MintRequestOverMax();

        // Send to owner
        (bool success, ) = owner().call{value: msg.value}("");
        if(!success) revert FailedToSendEtherToOwner();

        // Mint to user
        _mint(msg.sender, amountToMint);
        emit PurchaseOccurred(msg.sender, amountToMint);
    }
```

This function will allow a user to send gas currency (like GLMR, MOVR, or DEV) because it is a payable function. Let's break down the function section by section.  

1. It will then figure out how much of the token to mint based on how much gas currency was sent
2. Then it will check to see if the amount minted is 0 or if the total amount minted is over the `MAX_TO_MINT`, giving a descriptive error in both cases
3. The contract will then forward the gas currency included with the function call to the owner of the contract (by default, the address that deployed the contract, which will be you)
4. Finally, tokens will be minted to the user and an event will be emitted to pick up on later  

To make sure that this works, let's use HardHat again:  

```
npx hardhat compile
```

You've now written the smart contract for your DApp! If this were a production app, we would write tests for it, but that is out of the scope of this tutorial. Let's deploy it next.  

### Deploying Smart Contracts {: #deploying-smart-contracts }

Under the hood, HardHat is a Node project that uses the Ethers.js library to interact with the blockchain. You can also use Ethers.js in conjunction with HardHat's tool to create scripts to do things like deploying contracts.  

Your HardHat project should already come with a script in the `scripts` folder, called `deploy.js`. Let's replace it with a similar, albeit simpler script.

```javascript
const hre = require("hardhat");

async function main() {
  const MintableERC20 = await hre.ethers.getContractFactory("MintableERC20");
  const token = await MintableERC20.deploy();
  await token.deployed();

  console.log(`Deployed to ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

This script uses HardHat's instance of the the ethers library to get a contract factory of the MintableERC20.sol smart contract that we wrote earlier. It then deploys it and prints the resultant smart contract's address. Very simple to do with HardHat and the Ethers.js library, but significantly more difficult using just JSON-RPC!  

Let's run the contract on Moonbase Alpha (whose JSON-RPC endpoint we defined in the `hardhat.config.js` script earlier):  

```bash
npx hardhat run scripts/deploy.js --network moonbase
```

You should see an output that displays the token address. Make sure to **save it for use later**! 

!!! challenge
    HardHat has a poor built-in solution for deploying smart contracts. It doesn't automatically save the transactions and addresses related to the deployment! This is why the [hardhat-deploy](https://www.npmjs.com/package/hardhat-deploy#1-hardhat-deploy){target=_blank} package was created. Can you implement it yourself? Or can you switch to a different developer environment like [Foundry](https://github.com/foundry-rs/foundry){target=_blank}?

## DApp Frontends {: #dapp-frontends }

Frontends provide an interface for users to interact with blockchain-based applications. React, a popular JavaScript library for building user interfaces, is often used for developing DApp frontends due to its component-based architecture, which promotes reusable code and efficient rendering. useDApp, an Ethers.js based React framework, further simplifies the process of building DApp frontends by providing a comprehensive set of hooks and components that streamline the integration of Ethereum blockchain functionality.  

!!! note
    Typically a larger project will create separate GitHub repositories for their frontend and smart contracts, but this is a small enough of a project to create a monorepo.

Let's set up a new React project and install dependencies, which we can create within our HardHat project's folder without much issue:

```bash
npx create-react-app frontend
cd frontend
npm install ethers@5.6.9 @usedapp/core @mui/material @mui/system
```

If you remember, Ethers.js is a library that assists with JSON-RPC communication. useDApp is a similar library that uses Ethers.js and formats them into React hooks so that they work better in frontend projects. We've also added two MUI packages for styling and components.  

Let's also move a file from the artifacts folder into the frontend folder, `MintableERC20.json`. This file is generated during compilation of the smart contracts. It contains the ABI, which defines the structure of the smart contract, allowing libraries to understand what functions the smart contract has. Every time you change and recompile the smart contract, you'll have to update the ABI in the frontend as well. Some projects will have setups that automatically pull ABIs from the same source, but in this case we will just copy it over:  

```JSON
|--artifacts
    |--@openzeppelin
    |--build-info
    |--contracts
        |--MintableERC20.sol
            |--MintableERC20.json // This is the file you're looking for!
            ...
|--cache
|--contracts
|--frontend
    |--public
    |--src
        |--MintableERC20.json // Copy the file to here!
        ...
    ...
...
```

Let's set up the `App.js` file to add some visual structure:  

```javascript
import { useEthers } from '@usedapp/core';
import { Button, Grid, Card } from '@mui/material';
import { Box } from '@mui/system';
import MintableERC20 from './MintableERC20.json';

const styles = {
  box: { minHeight: '100vh', backgroundColor: '#1b3864' },
  vh100: { minHeight: '100vh' }
}

function App() {
  return(
    <Box sx={styles.box}>
      <Grid container direction="column" alignItems="center" justifyContent="center" style={stylesvh100}>
        {/* This is where we'll be putting our functional components! */}
      </Grid>
    </Box>
  );
}
```

At this point, our frontend project is set up well enough to start working on the functional code!  

### Providers, Signers, and Wallets {: #providers-signers-and-wallets }

The frontend communicates with the blockchain using JSON-RPC, but we will be using Ethers.js. When using the JSON-RPC, Ethers.js likes to abstract degrees of interaction with the blockchain into objects, such as: providers, signers, and wallets.  

Providers are the bridge between the frontend user interface and the blockchain network, facilitating communication and data exchange. They abstract the complexities of interacting with the blockchain, offering a simple API for the frontend to use. They are responsible for connecting the DApp to a specific blockchain node, allowing it to read data from the blockchain, and essentially contain the JSON-RPC URL.  

Signers are a type of provider that contain a secret that can be used to sign transactions with. This allows the frontend to create transactions, sign them, and then send them with `eth_sendRawTransaction`. There are multiple types of signers, but we're most interested in wallet objects, which securely store and manage users' private keys and digital assets. Wallets such as MetaMask facilitate transaction signing with a universal and user-friendly process. They act as a user's representation within the DApp, ensuring that only authorized transactions are executed. The Ethers.js wallet object represents this interface within our frontend code.  

Typically, a frontend using Ethers.js will require you to create a provider, connect to the user's wallet if applicable, and create a wallet object. This process can become unwieldy in larger projects, especially with the number of wallets that exist other than MetaMask:  

```javascript
// Detect if the browser has MetaMask installed
let provider, signer;
if (typeof window.ethereum !== 'undefined') {
  // Create a provider using MetaMask
  provider = new ethers.providers.Web3Provider(window.ethereum);

  // Connect to MetaMask
  async function connectToMetaMask() {
    try {
      // Request access to the user's MetaMask account
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create a signer (wallet) using the provider
      signer = provider.getSigner(accounts[0]);
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  }

  // Call the function to connect to MetaMask
  connectToMetaMask();
} else {
  console.log('MetaMask is not installed');
}

// ... also the code for disconnecting from the site
// ... also the code that handles other wallets
```

Fortunately, we have installed the useDApp package, which simplifies many of the processes for us. This simultaneously abstracts what Ethers is doing as well, which is why we took a bit of time to explain them here.  

Let's do a bit of setup with the useDApp package. First, in your React frontend's `index.js` file, add a `DAppProvider` object and its config. This essentially acts as the Ethers.js provider object, but can be used throughout your entire project by useDApp hooks:  

```javascript
// ... other imports go here
import { DAppProvider, MoonbaseAlpha } from '@usedapp/core';
import { getDefaultProvider } from 'ethers';

const config = {
  readOnlyChainId: MoonbaseAlpha.chainId,
  readOnlyUrls: {
    [MoonbaseAlpha.chainId]: getDefaultProvider("https://rpc.api.moonbase.moonbeam.network"),
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>
);
```

Now in your `App.js` file, let's add a button that allows us to connect to MetaMask. We don't have to write any code that's wallet specific, fortunately, since useDApp does it for us:  

```javascript
function App() {
  const { activateBrowserWallet, deactivate, account } = useEthers();
  
  // Handle the wallet toggle
  const handleWalletConnection = () => {
    if (account) deactivate();
    else activateBrowserWallet();
  };

  // ... 

  return(
    {/* Wrapper Components */}
      <Box position="absolute" top={8} right={16}>
          <Button variant="contained" onClick={handleWalletConnection}>
            {account ? `Disconnect ${account.substring(0, 5) + '...'}` : 'Connect Wallet'}
          </Button>
      </Box>
    {/* Wrapper Components */}
  )
}
```

Now there should be a button in the top right of your screen that connects your wallet to your frontend! Next, let's find out how we can read data from our smart contract.  

### Reading from Contracts {: #reading-from-contracts }

Reading from contracts is quite easy, as long as we know what we want to read. For our application, we will be reading the maximum amount of tokens that can be minted, and the number of tokens that have been minted. This way, we can display to our users how many tokens can still be minted, and hopefully invoke some FOMO...  

If you were just using the JSON-RPC, you would use `eth_call` to get this data, but it's quite difficult to do this since you have to [encode your requests](https://docs.soliditylang.org/en/latest/abi-spec.html){target=_blank} in a non-straightforward method called ABI encoding. Fortunately, Ethers.js allows us to easily create objects that represent contracts in a human-readable way so long as we have the ABI of the contract. And we have the ABI of the `MintableERC20.sol` contract within `MintableERC20.json`!  

Let's import the JSON file, the `Contract` objec within `App.js`. We can create a contract object instance with an address and ABI, so replace `YOUR_CONTRACT_ADDRESS_HERE` with the address of the contract that you copied [back when you deployed it](#deploying-smart-contracts):  

```javascript
import { Contract } from 'ethers';
import MintableERC20 from './MintableERC20.json'; 
// ... other imports

const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';

function App() {
  // ...
  const contract = new Contract(contractAddress, MintableERC20.abi);
  // ...
}
```

Now we can spice up our frontend and call the read-only functions in the contract. Add the following structure and styling to your frontend so that we have a place to display our text:    

```javascript
function App() {
  // ...

  const styles = {
    // ...
    card: { borderRadius: 4, padding: 4, maxWidth: '550px', width: '100%' },
    alignCenter: { textAlign: 'center' }
  }

  return (
    {/* Wrapper Components */}
      {/* Button Component */}
      <Card sx={styles.card}>
        <h1 style={styles.alignCenter}>Mint Your Token!</h1>
      </Card>
    {/* Wrapper Components */}
  )
}
```

And let's create a new `SupplyComponent` within a new `SupplyComponent.js` file:  

```javascript
import { useCall } from "@usedapp/core";
import { utils } from "ethers";
import { Grid } from "@mui/material";

export default function SupplyComponent({ contract }) {
  const totalSupply = useCall({ contract, method: 'totalSupply', args: [] });
  const maxSupply = useCall({ contract, method: 'MAX_TO_MINT', args: [] });
  const totalSupplyFormatted = totalSupply ? utils.formatEther(totalSupply.value.toString()) : '...';
  const maxSupplyFormatted = maxSupply ? utils.formatEther(maxSupply.value.toString()) : '...';

  const centeredText = { textAlign: 'center' };

  return (
    <Grid item xs={12}>
      <h3 style={centeredText}>
        Total Supply: {totalSupplyFormatted} / {maxSupplyFormatted}
      </h3>
    </Grid>
  );
}
```

Notice that this component uses the `useCall` hook provided by the useDApp package. This call takes in the contract object we created earlier, a string method, and any relevant arguments for the read-only call and returns the output. While it required some setup, this one-liner is a lot simpler than the the entire `use_call` RPC call that we would have had to done if we weren't using Ethers.js and useDApp.  

Also note that we're using a utility format called `formatEther` to format the output values instead of displaying them directly. This is because our token, like gas currencies, are stored as an unsigned integer with a fixed decimal point of 18 figures. The utility function helps format this value into a way that we as humans expect.  

Now import it into our `App.js` file:  

```javascript
// ... other imports
function App() {
  // ...

  return (
    {/* Wrapper Components */}
      {/* Button Component */}
      <Card sx={styles.card}>
        <h1 style={styles.alignCenter}>Mint Your Token!</h1>
        <SupplyComponent contract={contract} />
      </Card>
    {/* Wrapper Components */}
  )
}
```

Our frontend should now display the correct data!  

![Displaying data](/images/tutorials/eth-api/complete-dapp/complete-dapp-3.png)

!!! challenge
    There's additonal information that could be helpful to display, such as the amount of tokens that the connected account currently has: `balanceOf(address)`. Can you add that to the frontend yourself?

### Sending Transactions {: #sending-transactions }

Now for the most important part of all DApps: the state-changing transactions. This is where money moves, where tokens are minted, and value passes.  

If you recall from our smart contract, we want to mint some tokens by calling the `purchaseMint` function with some native gas currency. So we're going to need:  

1. A text input that lets the user specify how much value to enter  
2. A button that lets the user initiate the transaction signature  

Let's create a new component called `MintingComponent` in a new file `MintingComponent.js` that takes in our contract as a prop, similar to the `SupplyComponent.js` file. Let's also add two Grid components to it to represent both the text input and the button that we thought of:  

```javascript
import { useState } from "react";
import { useContractFunction, useEthers } from "@usedapp/core";
import { Button, CircularProgress, TextField, Grid } from "@mui/material";
import { utils } from "ethers";

export default function MintingComponent({ contract }) {
  return (
    <>
      <Grid item xs={12}>
        <TextField />
      </Grid>
      <Grid item xs={12}>
        <Button>
        </Button>
      </Grid>
    </>
  );
}
  
```

The text field is easy to build if you're familiar with React, since all it does is store a numeric value, which we can do with the `useState` hook:  

```javascript
export default function MintingComponent({ contract }) {
  const [value, setValue] = useState(0);
  const textFieldStyle = { marginBottom: '16px' };

  return (
    <>
      <Grid item xs={12}>
        <TextField 
          type="number"
          onChange={(e) => setValue(e.target.value)}
          label="Enter value in DEV"
          variant="outlined"
          fullWidth
          style={textFieldStyle} 
        />
      </Grid>
      {/* ... */}
    </>
  );
}
```

Interacting with the contract will be a bit more difficult since you're likely not as familiar with it. We've already done a lot of setup in the previous sections, so it doesn't actually take too much code:  

```javascript
export default function MintingComponent({ contract }) {
  // ...

  // Mint transaction
  const { account } = useEthers();
  const { state, send } = useContractFunction(contract, 'purchaseMint');
  const handlePurchaseMint = () => send({ value: utils.parseEther(value.toString()) });
  const isMining = state?.status === 'Mining';

  return (
    <>
      {/* ... */}
      <Grid item xs={12}>
        <Button
          variant="contained" color="primary" fullWidth
          onClick={handlePurchaseMint}
          disabled={state.status === 'Mining' || account == null}
        >
          {isMining? <CircularProgress size={24} /> : 'Purchase Mint'}
        </Button>
      </Grid>
    </>
  );
}
```

Let's break down the non-JSX code a bit:  

1. The user's account information is being retrieved via `useEthers`, which can be done because useDApp provides this information throughout the entire project 
2. useDApp's `useContractFunction` hook is used to create a function, `send`, that will sign and send a transaction that calls the `purchaseMint` function on the contract defined by the `contract` object
3. Another function `handlePurchaseMint` is defined to help inject the native gas value defined by the `TextField` component into the `send` function
4. A helper constant will determine whether or not the transaction is still in the `Mining` phase, that is, it hasn't finished

Now let's look at the visual component. The button will call the `handlePurchaseMint` on press, which makes sense. The button will also be disabled while the transaction happens, and if the user hasn't connected to the DApp with their wallet (when the account value isn't defined).  

This code essentially boiled down to using the `useContractFunction` hook in conjunction with the `contract` object, which is a lot simpler to what it does under the hood! Let's add this component to the main `App.js` file:  

```javascript
import { MintingComponent } from './MintingComponent.js';
// ... other imports

function App() {
  // ...

  return (
    {/* Wrapper Components */}
      {/* Button Component */}
      <Card sx={styles.card}>
        <h1 style={styles.alignCenter}>Mint Your Token!</h1>
        <SupplyComponent contract={contract} />
        <MintingComponent contract={contract} />
      </Card>
    {/* Wrapper Components */}
  )
}
```

![DApp with the Minting section](/images/tutorials/eth-api/complete-dapp/complete-dapp-4.png)  

If you try entering a value like `0.1` and press the button, a MetaMask prompt should occur. Try it out!  

### Reading Events from Contracts {: #reading-events-from-contracts }

A common way of listening to what happened in a transaction is through events, also known as logs. These logs are emitted by the smart contract through the `emit` and `event` keywords, and can be very important in a responsive frontend. Often DApps will use toast elements to represent events in real-time, but for this DApp we will use a simple table.  

We created an event in our smart contract: `event PurchaseOccurred(address minter, uint256 amount)`, so let's figure out how to display its information in the frontend.  

Let's create a new component `PurchaseOccurredEvents` within a new file `PurchaseOccurredEvents.js` that reads the last 5 logs and displays them in a table:  

```javascript
import { useLogs, useBlockNumber } from '@usedapp/core';
import { utils } from 'ethers';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function PurchaseOccurredEvents({ contract }) {
  return (
    <Grid item xs={12} marginTop={5}>
      <TableContainer >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Minter</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* This is where we have to inject data from our logs! */}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
```

This component so far creates an empty table, so let's use 2 new hooks to read those logs:  

```javascript
export default function PurchaseOccurredEvents({ contract }) {
  // Get block number to ensure that the useLogs doesn't search from 0, otherwise it will time out
  const blockNumber = useBlockNumber();

  // Create a filter & get the logs
  const filter = { args: [null, null], contract, event: "PurchaseOccurred" };
  const logs = useLogs(filter, { fromBlock: blockNumber - 10000 });
  const parsedLogs = logs?.value.slice(-5).map(log => log.data);

  // ... 
}
```

Here's what happens in this code:  

1. The block number is received from the `useBlockNumber` hook, similar to using `eth_blockNumber` in the JSON-RPC
2. A filter is created to filter for all events with any arguments on the contract injected into the component with the event name `PurchaseOccurred`
3. Logs are queried for via the `useLogs` hook, similar to using `eth_getLogs` in the JSON-RPC. Note that we're only querying the last 10000 blocks, because otherwise the entire history of the blockchain would be queried and the RPC would time-out
4. The resultant logs are parsed and the most recent 5 are selected

If we want to display them, we can do it like so:  

```javascript
export default function PurchaseOccurredEvents({ contract }) {
  // ...
  return (
    <Grid item xs={12} marginTop={5}>
      <TableContainer >
        <Table>
          {/* TableHead Component */}
          <TableBody>
            {parsedLogs?.reverse().map((log, index) => (
              <TableRow key={index}>
                <TableCell>{log.minter}</TableCell>
                <TableCell align="right">{utils.formatEther(log.amount)} tokens</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
```

Which can be added to `App.js`:  

```javascript
import { MintingComponent } from './MintingComponent.js';
// ... other imports

function App() {
  // ...

  return (
    {/* Wrapper Components */}
      {/* Button Component */}
      <Card sx={styles.card}>
        <h1 style={styles.alignCenter}>Mint Your Token!</h1>
        <SupplyComponent contract={contract} />
        <MintingComponent contract={contract} />
        <PurchaseOccurredEvents contract={contract} />
      </Card>
    {/* Wrapper Components */}
  )
}
```

And, if you've done any transactions, you'll see that they'll pop up!  

![Finished DApp](/images/tutorials/eth-api/complete-dapp/complete-dapp-5.png)

Now you've implemented 3 main components of DApp frontends: reading from storage, sending transactions, and reading logs. With these building blocks as well as the knowledge you learned with smart contracts and nodes you should be able to cover 80% of DApps. Of course, there are more advanced (but optional) components of DApps that have popped up over time, some of which are listed in the next section.  

## Additional Options {: #additional-options }

### Decentralized Storage Systems {: #decentralized-storage-systems }

Decentralized storage solutions provide a distributed and fault-tolerant way to store and access data within a DApp. Unlike traditional centralized storage systems, decentralized storage distributes data across multiple nodes, ensuring that the information is secure, accessible, and resilient to failures. Popular decentralized storage solutions such as the [Arweave](https://www.arweave.org/){target=_blank} and [Filecoin/IPFS](https://filecoin.io/){target=_blank} leverage blockchain technology to create a global, peer-to-peer storage network, eliminating single points of failure and improving data privacy.  

Generally speaking, decentralized storage systems are separated from smart contract platforms such as Moonbeam. Moonbeam does not provide a decentralized storage system itself, but the Polkadot ecosystem has solutions such as [Crust](https://crust.network/){target=_blank}.  

These systems can be very important for NFT projects, who need a place to store their media and documents. In our project, the most applicable use of a decentralized storage system would be decentralized frontend hosting. This would be the final step to completely decentralize a DApp, since you can publish your site on one of these decentralized storage systems instead of only hosting your frontend on a centralized server.  

### Oracles {: #oracles }

Oracles are third-party services that provide external data to smart contracts within a blockchain. Since smart contracts are unable to access information outside of the blockchain, oracles play a crucial role in supplying real-world data to DApps. This data can include asset prices, global sentiment, or any other data relevant to the DApp's use case. Oracles can be centralized or decentralized, with decentralized oracles offering a higher degree of trust and security.  

Examples of popular oracle solutions include [Chainlink](/builders/integrations/oracles/chainlink){target=_blank}, [Band Protocol](/builders/integrations/oracles/band-protocol), and [Razor Network](/builders/integrations/oracles/razor-network), which enable the integration of off-chain data into smart contracts in a secure and reliable manner. Plus, good news: Moonbeam networks support these oracle solutions!  

In our project, an oracle could update the token smart contract's minting price dynamically to reflect real-time prices instead of relying on a constant value.  

### Indexing Protocols {: #indexing-protocols }

Indexing protocols can play a crucial role in the efficient functioning of DApp frontends by providing a scalable and reliable solution for querying on-chain data. Indexing protocols work as middleware that continuously processes and organizes blockchain data, which helps overcome the limitations of querying data directly from blockchain nodes, which can be slow and computationally expensive. By utilizing indexing protocols, DApps can quickly retrieve and display relevant information to users, enhancing their overall experience and performance.  

Some popular indexing protocols on Moonbeam include [The Graph](/builders/integrations/indexers/thegraph){target=_blank} and [Subsquid](/builders/integrations/indexers/subsquid){target=_blank}.  

In our project, an indexing protocol could take the place of querying logs from the node. Instead, we could query an indexing protocol that already has this data stored and available for our frontend to use; plus we could query data from the entire blockchain instead of from just 10000 blocks in the past.  

### Centralized Backends {: #centralized-backends }

While decentralized applications primarily rely on blockchain technology and its associated components, there are occasions when centralized backends are utilized to support specific functions or requirements. Centralized backends may be employed to handle tasks that are resource-intensive, time-sensitive, or challenging to implement within the constraints of the blockchain. For example, DApps may use centralized servers to host game servers, manage user authentication, store non-sensitive data to reduce costs, or comply with regulations. However, it is essential to strike a balance between decentralization and the use of centralized backends, ensuring that the core principles of trustlessness, security, and transparency are upheld.  

In our project, a use of a centralized backend could be server-side rendering to increase the speed of the page. But since this is a really small DApp, it's not too important.  

## Conclusion

In this tutorial, we covered a wide range of topics and tools essential for successful DApp development. We started with HardHat, a powerful development environment that simplifies the process of writing, testing, and deploying smart contracts. Ethers.js, a popular library for interacting with Ethereum nodes, was introduced for managing wallets and transactions.  

We delved into the process of writing smart contracts, highlighting best practices and key considerations when developing on-chain logic. The guide then explored useDApp, a React-based framework, for creating a user-friendly frontend. We discussed techniques for reading data from contracts, executing transactions, and working with logs to ensure a seamless user experience.

Finally, we touched upon additional components vital to DApps, such as indexing protocols for efficient data retrieval and oracles for accessing off-chain data.  

Hopefully by reading this guide, you'll be well on your way to create novel DApps on Moonbeam!