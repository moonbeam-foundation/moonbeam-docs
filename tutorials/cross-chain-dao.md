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

DAO stands for "Decentralized Autonomous Organization". In order for a smart contract to be a DAO, it must be:  

- **Decentralized** — control is separated and distributed among many actors
- **Autonomous** — much of the execution must occur without the reliance on a single person or team
- **Organized** — there must be a way for actions to be taken

One of the best single-chain DAOs is [Compound Finance's DAO](https://compound.finance/governance){target=_blank}. This DAO is a smart contract that allows proposals for on-chain transactions to be sent by the DAO, hence it is an organization that can take actions. It is decentralized because proposals are voted on by holders of the Compound Finance token. It is autonomous, because execution of the proposals are permissionless, and thus do not rely any specific person or team.  

Let's take a look at the phases that a proposal in a DAO takes:  

![Typical DAO](/images/tutorials/cross-chain-dao/cross-chain-dao-1.png)

1. **Proposal** — a user proposes that the DAO should execute one or more transactions
2. **Voting** — after a voting delay time period, a voting period opens, which allows users to vote with their voting weight. The voting weight is determined by a token balances snapshot typically taken sometime between the proposal start and the end of the voting delay period  
3. **Timelock** — an optional period that allows users to exit the ecosystem (sell their tokens) before the proposal can be executed
4. **Execution** — if the vote is successful, any user can execute it trustlessly

But what about a cross-chain DAO? In a cross chain DAO, the actions that you would typically should also be available cross-chain: proposals, votes, executions, cancellations, etc. This requires a more complex architecture, since a lot of information has to be replicated across-chains.  

![Cross Chain DAO](/images/tutorials/cross-chain-dao/cross-chain-dao-2.png)

*insert explanation of image and the architecture we're going with*

## Writing the Cross-Chain DAO {: #writing-the-cross-chain-dao }

A logical starting point for thinking about writing a cross-chain DAO is its predecessor: a single-chain DAO. There are many different implementations that exist, but since [OpenZeppelin](https://www.openzeppelin.com/contracts){target=_blank} hosts an already popular smart contract repository, we will use their Governance smart contracts. A second reason why we're using OpenZeppelin's smart contracts is because they're based off of Compound Finance's DAO, which we've already investigated in the [previous section](#intuition-and-planning).  

A good way to play with the configurations of the Governance smart contract is to use the OpenZeppelin smart contract wizard. By going to the [OpenZeppelin website's contract page](https://www.openzeppelin.com/contracts){target=_blank}, scrolling down, and clicking on the Governance tab, you can view the different ways that you can configure the Governance smart contract. Open it up and play around with it to figure out a simple base for our cross-chain DAO.  

![OpenZeppelin Contract Wizard](/images/tutorials/cross-chain-dao/cross-chain-dao-3.png)

We're going to try to keep this base smart contract as simple as possible for demonstration purposes. Be sure to disable Timelock, 


## Deploying and Testing {: #deploying-and-testing }

## Caveats and Other Designs {: #caveats-and-other-designs }

--8<-- 'text/disclaimers/general.md'
