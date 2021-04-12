---
title: The Graph
description: Build APIs using The Graph indexing protocol on Moonbeam
---

# Using The Graph on Moonbeam

![The Graph on Moonbeam](/images/thegraph/thegraph-banner.png)

## Introduction

Indexing protocols organize information in a way that applications can access it more efficiently. For example, Google indexes the entire internet in such a way that when you search for a word it can efficiently provide a response in a timely matter.

The Graph is a decentralized and open-source indexing protocol for querying networks like Ethereum. In short, it provides a way to efficiently store data emitted by events from smart contracts, so that it can be accessed by other projects or dApps in an easy way.

Developers can build APIs, called subgraphs, that can be used by users or other developers to query data specific to a set of smart contracts. Data is fetched with a standard GraphQL API.You can read more about The Graph protocol on [this link](https://thegraph.com/docs/introduction#what-the-graph-is).

With the introduction of Ethereum tracing modules in [Moonbase Alpha v7](https://github.com/PureStake/moonbeam/releases/tag/v0.7.0), The Graph is capable of indexing blockchain data in Moonbeam.

This guide takes you through the creation of a simple subgraph for a Lottery contract.

## The Lottery Contract

For this example, a simple Lottery contract will be used. You can find the Solidity file on [this link](https://github.com/PureStake/moonlotto-subgraph/blob/main/contracts/MoonLotto.sol). 

The contract hosts a lottery where a player can either buy a ticket for himself, or gift one to another user. When 1 hour has passed, if there are 10 participants, the next player that joins the lottery will execute a function that picks the winner. All the funds stored in the contract are sent to the winner, afterwhich, a new round starts.

The main functions of the contract are the following:

 - **joinLottery** — no inputs. Function to enter the lottery's current round, the value (amount of tokens) sent to the contract need to be equal to the ticket price
 - **giftTicket** —  one input: ticket's recipient address. Similar to `joinLottery` but the ticket's owner can be set to a different address
 - **enterLottery** — one input: ticket's owner address. Internal function that handles the loterry's tickets logic. It emmits an event with information of the latest player that joined. If an hour has passed and there are at least 10 participants, it calls the `pickWinner` function
 - **pickWinner** — no inputs. Internal function that selects the lottery winner with a pseudo random number generator (not safe, only for demostration purposes). It handles the logic of transfering funds and resetting variable for the next lottery round