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

you press a button

## DApp Frontends {: #dapp-frontends }

To facilitate seamless communication between the frontend user interface and the smart contracts, various components work in harmony, including signers, providers, wallets, and JSON-RPC. This section delves into the mechanics of these elements and how they interact to establish a robust connection between the user interface and the underlying smart contracts.

### Providers {: #providers }

Providers are the bridge between the frontend user interface and the blockchain network, facilitating communication and data exchange. They are responsible for connecting the DApp to a specific blockchain node, allowing it to read data from the blockchain and submit signed transactions. Providers abstract the complexities of interacting with the blockchain, offering a simple API for the frontend to interact with the smart contracts. Popular providers like Web3.js and Ethers.js come with built-in support for multiple blockchain networks and offer a robust set of features to simplify the development process.

### Signers and Wallets {: #signers-and-wallets }

Wallets play a critical role in the DApp ecosystem, as they securely store and manage users' private keys and digital assets. In addition to providing secure storage, wallets also function as signers, which are responsible for signing and authorizing transactions before they are sent to the blockchain.  

By integrating the signer functionality, wallets facilitate transaction signing and authorization using the user's private key. This process generates a unique digital signature for each transaction, adding an essential layer of security. Wallets, therefore, act as a user's representation within the DApp, ensuring that only authorized transactions are executed.  

Wallets can be browser extensions, such as MetaMask, or mobile applications like Trust Wallet. By providing a user-friendly interface, secure storage, and transaction signing capabilities, wallets enable users to access the DApp and interact with the underlying smart contracts with ease and confidence.  

## Additional Options {: #additional-options }

### Decentralized Storage Systems {: #decentralized-storage-systems }

Decentralized storage solutions provide a distributed and fault-tolerant way to store and access data within a DApp. Unlike traditional centralized storage systems, decentralized storage distributes data across multiple nodes, ensuring that the information is secure, accessible, and resilient to failures. Popular decentralized storage solutions such as the InterPlanetary File System (IPFS) and Filecoin leverage blockchain technology to create a global, peer-to-peer storage network, eliminating single points of failure and improving data privacy.

### Oracles {: #oracles }

Oracles are third-party services that provide external data to smart contracts within a blockchain. Since smart contracts are unable to access information outside of the blockchain, oracles play a crucial role in supplying real-world data to DApps. This data can include asset prices, weather information, or any other data relevant to the DApp's use case. Oracles can be centralized or decentralized, with decentralized oracles offering a higher degree of trust and security. Examples of popular oracle solutions include Chainlink, Band Protocol, and API3, which enable the integration of off-chain data into smart contracts in a secure and reliable manner.  

### Indexing Protocols {: #indexing-protocols }

Indexing protocols, such as The Graph or Subsquid, serve to enhance the performance and accessibility of data within the decentralized ecosystem. The Graph is a decentralized protocol designed for indexing and querying blockchain data, enabling developers to access on-chain data more efficiently. By leveraging a global network of nodes referred to as "subgraphs," The Graph organizes and indexes data from smart contracts, making it easily available for DApps via GraphQL APIs. The indexing and querying process facilitated by The Graph allows DApps to retrieve complex data sets more efficiently, ultimately improving the overall user experience and reducing the burden on the blockchain network.

### Centralized Backends {: #centralized-backends }

While decentralized applications primarily rely on blockchain technology and its associated components, there are occasions when centralized backends are utilized to support specific functions or requirements. Centralized backends may be employed to handle tasks that are resource-intensive, time-sensitive, or challenging to implement within the constraints of the blockchain. For example, DApps may use centralized servers to manage user authentication or store non-sensitive data to reduce costs or comply with regulations. However, it is essential to strike a balance between decentralization and the use of centralized backends, ensuring that the core principles of trustlessness, security, and transparency are upheld.  

## Conclusion

more transactions on moonbeam please