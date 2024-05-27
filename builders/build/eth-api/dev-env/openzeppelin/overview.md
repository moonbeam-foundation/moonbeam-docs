---
title: An Overview of OpenZeppelin on Moonbeam
description: Learn how to use OpenZeppelin products for creating and managing Solidity smart contracts on Moonbeam, thanks to its Ethereum compatibility features.
---

# OpenZeppelin

## Introduction {: #introduction } 

[OpenZeppelin](https://openzeppelin.com){target=\_blank} is well known in the Ethereum developer community as their set of audited smart contracts and libraries are a standard in the industry. For example, most of the tutorials that show developers how to deploy an ERC-20 token use OpenZeppelin contracts.

You can find more information about OpenZeppelin on their [documentation site](https://docs.openzeppelin.com/openzeppelin){target=\_blank}.

As part of its Ethereum compatibility features, OpenZeppelin products can be seamlessly used on Moonbeam. This page will provide information on different OpenZeppelin solutions that you can test.

## OpenZeppelin on Moonbeam {: #openzeppelin-on-moonbeam } 

Currently, the following OpenZeppelin products/solutions work on the different networks available on Moonbeam:

|      **Product**      | **Moonbeam** | **Moonriver** | **Moonbase Alpha** | **Moonbase Dev Node** |
|:---------------------:|:------------:|:-------------:|:------------------:|:---------------------:|
| Contracts & libraries |      ✓       |       ✓       |         ✓          |           ✓           |
|   Contracts Wizard    |      ✓       |       ✓       |         ✓          |           ✓           |
|       Defender        |      ✓       |       ✓       |         ✓          |           X           |

You will find a corresponding tutorial for each product in the following links:

 - [**Contracts Wizard**](/builders/build/eth-api/dev-env/openzeppelin/contracts/#openzeppelin-contract-wizard) — where you'll find a guide on how to use OpenZeppelin web-based wizard to create different token contracts with different functionalities
 - [**Contracts & libraries**](/builders/build/eth-api/dev-env/openzeppelin/contracts/#deploying-openzeppelin-contracts-on-moonbeam) — where you'll find tutorials to deploy the most common token contracts using OpenZeppelin's templates: ERC-20, ERC-721 and ERC-1155
 - [**Defender**](/builders/build/eth-api/dev-env/openzeppelin/defender/) — where you'll find a guide on how to use OpenZeppelin Defender to manage your smart contracts in the Moonbase Alpha TestNet. This guide can also be adapted for Moonbeam and Moonriver

--8<-- 'text/_disclaimers/third-party-content.md'