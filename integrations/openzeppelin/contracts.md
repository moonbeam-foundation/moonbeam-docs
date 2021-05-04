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
 - [**ERC20**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20) — implementation of the ERC20 interface, including the three optional functions. In addition, it includes a 

Some of the extensions available are:

 - [**ERC20Burnable**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Burnable) — allows for tokens to be destroy, meaning that the total supply contracts
 - [**ERC20Capped**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Capped) — allows for tokens to be destroy, meaning that the total supply contracts
 - [**ERC20Burnable**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Burnable) — allows for tokens to be destroy, meaning that the total supply contracts
 - [**ERC20Burnable**](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Burnable) — allows for tokens to be destroy, meaning that the total supply contracts




All the code related to the contracts mentioned before can be found in [OpenZeppelins ERC20 token repo](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/release-v4.1/contracts/token/ERC20).

---

 - **totalSupply** — a view function, no inputs. Returns the amount of tokens in existence
 - **balanceOf** — a view function, one input: address of account to query. Returns the amount of tokens owned by the address
 - **transfer** — two inputs: address of recipient and amount to transfer. Function that initiates a transaction to move the specified amount of tokens to a provided address. Emits a transfer event
 - **allowance** — a view function, two inputs: address of the owner and address of the spender. Returns the remaining number of tokens that the spender can transfer on behalf of the owner. By default this is set to zero
 - **approve** — two inputs: address of the spender and allowance amount. Function that initiates a transaction to set the amount of tokens the spender can transfer on behalf of the owner. Emits an approval event
 - **transferFrom** — three inputs: address of the owner, address of recipient and amount. Function that initiates a transaction to transfer an amount of tokens from the owner's address to a recipient. Used by approved addresses if the amount is lower than the allowance

The EIP also defines two events:

 - **Transfer** — three fields: from address, to address and amount. Event that provides information when an amount of tokens are moved from an account to another
 - **Emitted** — three fields: address of the owner, address of the spender and amount. Event that provides information when an allowance is set by the `approve` function

Three additional functions are defined by the EIP





## Deploying OpenZeppelin Contracts on Moonbeam

This section goes through the steps when deploying OpenZeppelin contracts on Moonbeam. Currently, it covers the following contracts:

 - ERC20 (fungible tokens)
 - ERC721 (non-fungible tokens)
 - ERC1155 (multi-token standard)

### Checking Prerequisites