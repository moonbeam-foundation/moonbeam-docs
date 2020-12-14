---
title: ChainBridge
description: How to use ChainBridge to connect assets between Ethereum and Moonbeam using smart contracts
---
# ChainBridge's Ethereum Moonbeam Bridge

![ChainBridge Moonbeam banner](/images/chainbridge/chainbridge-banner.png)

## Introduction

A bridge allows two economically sovereign, and technologically different chains to communicate with each other. They can range from centralized and trusted, to decentralized and trustless. One of the currently available solutions is [ChainBridge](https://github.com/ChainSafe/ChainBridge#installation), a modular multi-directional blockchain bridge built by [ChainSafe](https://chainsafe.io/).

ChainBridge is, at its core, a message passing protocol. Events on a source chain are used to send a message that is routed to the destination chain. There are three main roles:

 - Listener: extract events from a source chain and construct a message
 - Router: passes the message from the Listener to the Writer
 - Writer: interpret messages and submit transactions to the destination chain
 
 
This rendition of ChainBridge relies on trusted relayers, but features a mechanism that prevents any relayer to abuse their power and incorrectly redirect funds. At a high-level, relayers create proposals that are only executed on the destination chain once it is voted on, and only after it surpasses a certain threshold. 

On both sides of the bridge, there are a set of smart contracts, where each has a very specific function:

 - Bridge contract: users and relayers interact with this contract. Delegates calls to the hanlder contracts for deposits, to start a transaction on the source chain, and for executions of the proposals on the target chain.
 - Handler contracts: validate the parameters provided by the user, creating a deposit record.

https://github.com/ChainSafe/ChainBridge

## Contact Us
If you have any feedback regarding implementing ChainBridge on your project, or any other Moonbeam related topic, feel free to reach out through our official development [Discord server](https://discord.com/invite/PfpUATX).
