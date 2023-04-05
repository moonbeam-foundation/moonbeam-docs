---
title: Complete DApp Architecture
description: Learn about the frontend, smart contracts, and storage system of Decentralized Applications (DApp) by dissecting an entire example project.
---

# Complete DApp Architecture

![Learn about the entire architecture of DApps.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-banner.png)
_April 15, 2023 | by Jeremy Boetticher_

Decentralized applications, or DApps, have redefined how applications are built, managed, and interacted with in Web3. By leveraging blockchain technology, DApps provide a secure, transparent, and trustless system that enables peer-to-peer interactions without any central authority. At the core of a DApp's architecture are several main components that work in tandem to create a robust, decentralized ecosystem. These components include smart contracts, nodes, frontend user interfaces, and decentralized storage solutions.  

**put an image here that shows the relationships between all of the different components**

In this tutorial, you'll come face-to-face with each major component by writing a full DApp that mints tokens. We'll also explore additional optional components of DApps that can enhance user experience for your future projects.  

**put an image here that shows off the DApp**

## Checking Prerequisites {: #checking-prerequisites } 

To get started, you will need the following:

 - A Moonbase Alpha account funded with DEV. 
  --8<-- 'text/faucet/faucet-list-item.md'
 - [Node.js](https://nodejs.org/en/download/){target=_blank} version 16 or newer installed
 - 
--8<-- 'text/common/endpoint-examples.md'

## Smart Contracts {: #smart-contracts }

Smart contracts are self-executing contracts with the terms of the agreement directly written into code. They serve as the backbone of any DApp, automating and enforcing the business logic within the decentralized system. By leveraging the immutability and security of the blockchain, smart contracts ensure that the agreed-upon rules are executed in a transparent and tamper-proof manner.  

When you deploy a smart contract onto Moonbeam, you upload a series of instructions that can be understood by the EVM, or the Ethereum Virtual Machine. Whenever someone interacts with a smart contract, these series of instructions are executed by the EVM to change the blockchain's state. Writing the instructions in a smart contract properly is very important since the blockchain's state defines the most crucial information about your DApp, such as who has what amount of money.  

Since the instructions are difficult to write and make sense of at a low (assembly) level, we have smart contract languages such as Solidity to make it easier to write them. To help write, debug, test, and compile these smart contract languages, developers in the Ethereum community have created developer environments such as [HardHat](/tutorials/eth-api/hardhat-start-to-end.md){target=_blank} and [Foundry](/tutorials/eth-api/foundry-start-to-end.md){target=_blank}.  

This tutorial will use HardHat, which requires Node.

### Writing Smart Contracts {: #writing-smart-contracts }

### Testing Smart Contracts {: #testing-smart-contracts }

### Deploying Smart Contracts {: #deploying-smart-contracts }

## Nodes and JSON-RPC Endpoints {: #nodes-and-json-rpc-endpoints }

JSON-RPC is a remote procedure call (RPC) protocol that utilizes JSON to encode data, allowing for seamless communication between the frontend and the blockchain. DApp developers use JSON-RPC to send requests and receive responses from the blockchain node, making it a crucial element in the interaction with smart contracts. JSON-RPC requests include specific methods for reading and writing data, such as 'eth_call' for executing a smart contract function in a read-only manner or 'eth_sendRawTransaction' for submitting signed transactions to the network. By using JSON-RPC, the frontend user interface can seamlessly interact with the smart contracts and provide users with real-time feedback on their actions.

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