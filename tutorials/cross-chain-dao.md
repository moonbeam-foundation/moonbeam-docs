---
title: Cross-Chain DAO
description: Go over the elements of how a cross-chain DAO could be implemented on Moonbeam in this tutorial.
---

# Thinking About a Cross-Chain DAO

![Banner Image](/images/tutorials/foundry-start-to-end/foundry-banner.png)

_February 12th, 2022 | by Jeremy Boetticher_

## Introduction {: #introduction } 

Moonbeam works hard to support interoperability and cross-chain logic. Its connected contracts initiative requires an updating of previously understood smart contract concepts so that they fit a cross-chain world. While some cross-chain primitives have been in the works for years, such as cross-chain tokens, others are only starting to be worked on: such as cross-chain swaps, AMMs, and in of particular interest for this tutorial: DAOs.  

In this tutorial, we will work through a thought process of writing smart contracts for a cross-chain DAO. The smart contracts in this example will be based off of OpenZeppelin's Governance smart contracts to demonstrate an evolution from single-chain to cross-chain and to highlight some incompatibilities that one might face when converting a dApp concept from single-chain to cross-chain. The cross-chain protocol used in this example will be [LayerZero](/builders/interoperability/protocols/layerzero){target=_blank}, but you are encouraged to adapt its concepts to any other protocol that you see fit, since cross-chain concepts often overlap between the protocols that Moonbeam hosts.  

## Checking Prerequisites {: #checking-prerequisites } 

Before we get to any theorizing, you will need the following:

 - Have an account with funds. 
  --8<-- 'text/faucet/faucet-list-item.md'
 - 
--8<-- 'text/common/endpoint-examples.md'
 - Have [Foundry installed](https://book.getfoundry.sh/getting-started/installation){target=_blank}
 - Have a [Moonscan API Key](/builders/build/eth-api/verify-contracts/api-verification/#generating-a-moonscan-api-key){target=_blank}

The example project for this Tutorial will use Hardhat, prerequisite knowledge of which will be helpful for this tutorial, which is slightly advanced.  

## Intuition And Planning {: #intuition-and-planning }

A logical starting point for thinking about a cross-chain DAO is its predecessor: a single-chain DAO. There are many different implementations that exist, but since OpenZeppelin hosts an already popular smart contract repository, we will use their DAO. Their Governance

--8<-- 'text/disclaimers/general.md'
