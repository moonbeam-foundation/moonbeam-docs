---
title: Contracts & Libraries
description:  Learn how to deploy the most common OpenZeppelin contracts on Moonbeam thanks to its Ethereum compatibility features
---

# OpenZeppelin Contracts & Libraries

![OpenZeppelin Contracts Banner](/images/openzeppelin/ozcontracts-banner.png)

## Introduction

OpenZeppelin contracts and libraries have become a standard in the industry. They help developers minimize risk, as their open-source code templates are battle-tested for Ethereum and other blockchains. It includes the most used implementations of ERC standards and add-ons, and often appear in guides and tutorials around the community.

This guide is divided into two sections. The first part outlines a conceptual introduction to the most common OpenZeppelin libraries and ERC token standards. The second section provides a step-by-step guide on how you can deploy these contracts on Moonbeam. 

## Introduction to OpenZeppelin's Contracts & Libraries

This section outlines some of the most commonly used contracts/libraries from OpenZeppelin. Each contract might have variants to expand its functionalities

### ERC20 Token Contract

Is a fungible token contract that follows the [ERC20 Token Standard](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/). Fungible means that all tokens are equivalent and interchangeable, that is, of equal value. One common example of a fungible tokens are fiat currencies, where each equal-denomination bill has the same value.

One way of looking at ERC20 token contracts is as a table where each row represents an address and each column a different property. For example, three basic properties are the balance of the address, spenders, and allowances. The owner of that balance can approve other addresses to make transfers on their behalf. Each spender has an allowance, or a balance they are allowed to transfer.

The basic interface of the ERC20 token standard is covered in the [EIP-20](https://eips.ethereum.org/EIPS/eip-20). Tokens can have (but are not obliged to) have a name, symbol and custom decimal structure.

OpenZeppelin provides a set of core contracts that implement the behavior specified in the EIP.

 - [**IERC20**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#IERC20) — basic interface that all ERC20 tokens must have
 - [**IERC20Metadata**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#IERC20Metadata) — extended interface to include the three optional functions: name, symbol and decimals
 - [**ERC20**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20) — implementation of the ERC20 interface, including the three optional functions. In addition, it includes a supply mechanism with a minting function

Some of the extensions available are:

 - [**ERC20Burnable**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Burnable) — allows for tokens to be destroy, meaning that the total supply contracts
 - [**ERC20Capped**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Capped) — adds a cap to the supply of tokens
 - [**ERC20Pausable**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Pausable) — allows to pause toek transfers, minting and burning
 - [**ERC20Snapshot**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Snapshot) — allows for balances and total supply to be recorded when a snapshot is created

You can find more information regarding draft EIPs, presents and utilities in their [ERC20 documentation site](https://docs.openzeppelin.com/contracts/4.x/erc20).

All the code related to the contracts mentioned before can be found in [OpenZeppelins ERC20 token repo](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/release-v4.1/contracts/token/ERC20).

### ERC721 Token Contract

Is a non-fungible token contract that follows the [ERC721 Token Standard](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/). Non-fungible means that each token is different, and therefore, unique. An ERC721 token can represent ownership of that unique item, wheter it is a collectibe, item in a game, real state, and so on. 

The basic interface of the ERC721 token standard is covered in the [EIP-721](https://eips.ethereum.org/EIPS/eip-721). OpenZeppelin provides a set of core contracts that implement the behavior specified in the EIP.

 - [**IERC721**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#IERC721) — required interface that is ERC721 compliant
 - [**IERC721Metadata**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#IERC721Metadata) — extended interface to include the token name, symbol and token URI (Uniform Resource Identifier), which represents the token metadata
 - [**IERC721Enumerable**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#IERC721Enumerable) — extended interface to enumerate tokens in the contracts, making them discoverable though some added functions
 - [**ERC721**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721) — implementation of the ERC721 interface, including the Metadata extension
 - [**ERC721Enumerable**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721Enumerable) — implementation of the ERC721 interface, including the Metadata and Enumerable extensions

Some of the extensions available are:

 - [**ERC20Burnable**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Burnable) — allows for tokens to be destroy, meaning that the total supply contracts
 - [**ERC20Capped**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Capped) — adds a cap to the supply of tokens
 - [**ERC20Pausable**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Pausable) — allows to pause toek transfers, minting and burning
 - [**ERC20Snapshot**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Snapshot) — allows for balances and total supply to be recorded when a snapshot is created

You can find more information regarding draft EIPs, presents and utilities in their [ERC20 documentation site](https://docs.openzeppelin.com/contracts/4.x/erc20).

All the code related to the contracts mentioned before can be found in [OpenZeppelins ERC20 token repo](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/release-v4.1/contracts/token/ERC20).






## Deploying OpenZeppelin Contracts on Moonbeam

This section goes through the steps when deploying OpenZeppelin contracts on Moonbeam. Currently, it covers the following contracts:

 - ERC20 (fungible tokens)
 - ERC721 (non-fungible tokens)
 - ERC1155 (multi-token standard)

### Checking Prerequisites