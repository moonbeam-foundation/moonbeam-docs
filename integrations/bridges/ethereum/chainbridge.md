---
title: ChainBridge
description: How to use ChainBridge to connect assets between Ethereum and Moonbeam using smart contracts
---
# ChainBridge's Ethereum Moonbeam Bridge

![ChainBridge Moonbeam banner](/images/chainbridge/chainbridge-banner.png)

## Introduction

A bridge allows two economically sovereign, and technologically different chains to communicate with each other. They can range from centralized and trusted, to decentralized and trustless. One of the currently available solutions is [ChainBridge](https://github.com/ChainSafe/ChainBridge#installation), a modular multi-directional blockchain bridge built by [ChainSafe](https://chainsafe.io/).

## How the Bridge Works

ChainBridge is, at its core, a message passing protocol. Events on a source chain are used to send a message that is routed to the destination chain. There are three main roles:

 - Listener: extract events from a source chain and construct a message
 - Router: passes the message from the Listener to the Writer
 - Writer: interpret messages and submit transactions to the destination chain
 
This rendition of ChainBridge relies on trusted relayers, but features a mechanism that prevents any relayer to abuse their power and incorrectly redirect funds. At a high-level, relayers create proposals that are only executed on the destination chain once it is voted on, and only after it surpasses a certain threshold. 

On both sides of the bridge, there are a set of smart contracts, where each has a very specific function:

 - Bridge contract: users and relayers interact with this contract. Delegates calls to the handler contracts for deposits, to start a transaction on the source chain, and for executions of the proposals on the target chain
 - Handler contracts: validate the parameters provided by the user, creating a deposit/execution record
 - Target contract: as the name suggest, is the contract we are going to interact with on each side of the bridge

The general workflow is the following (from Chain A to Chain B):
 
  - A user initiates a transaction with the _deposit()_ function in the bridge contract of Chain A. Here, the user needs to input the function to be executed, the resource ID, and the _calldata_ (definitions after the diagram). After a few checks, the _deposit()_  function of the handler contract is called, which executes the function call of the target contract
  - After the function of the target contract in Chain A is executed, an _Deposit_ event is emmited by the bridge contract with all the necessary data to be executed on Chain B, this can be called a proposal. Each proposal can have 5 status (inactive, active, passed, executed and cancelled) 
  - Relayers are always listening on both sides of the chain. Once the event is picked up by a relayer, he initiates a voting on the proposal, which happens on the bridge contract on Chain B. This sets the state of the proposal from inactive to active
  - Relayers must vote on the proposal. Everytime a relayer votes, an event is emmited by the bridge contract that updates its status. Once a threshold is met, the status changes from active to passed. A relayer then executes the proposal on Chain B via the bridge contract.
  - After a few checks, the bridge calls executes the proposal of the target contract via the handler contract on Chain B. Another event is emitted which updates the proposal sstatus from passed to executed.

This workflow is summarized in the following diagram:

![ChainBridge Moonbeam diagram](/images/chainbridge/chainbridge-diagram.png)

### General Definitions

Here we have put together a list of concepts applicable to the ChainBridge implementation (from Chain A to Chain B):

 - Chain ID: this is not to be confused with the chain ID of the network. Its a unique network identifier used by the protocol for each chain. It can be different to the actual chain ID of the network itself. For example, for Moonbase Alpha and Kovan, we've set the ChainBridge chain ID to 43 and 42 respectively
 - Resource ID: is a 32 bytes word that is intended to uniquely identify an asset in a cross-chain environment. For that matter, the least significant byte is reserved for the chainId, so we would have 31 bytes in total to represent an asset of a chain in our bridge
 - Calldata: is the parameters required for the handler that includes the information necessary to execute the proposal on Chain B. The exact serialization is defined for each handler. You can find more information [here](https://chainsafe.github.io/ChainBridge/chains/ethereum/#erc20-handler)

## Try it on Moonbase Alpha

Currently we have setup a relayer with ChainBridge implementation that connects Kovan and Moonbase Alpha.

ChainSafe has [pre-programmed handlers](https://github.com/ChainSafe/chainbridge-solidity/tree/master/contracts/handlers) which are specific to ERC-20 and ERC-721 interfaces, and are used to transfer these token between chains. In general terms, this is just narrowing down the general purpose diagram that we've described before, so the handler works only with the specific token functions such as _lock/burn_ and _mint/unlock_. 

In this section, we'll go over two different examples on using the bridge to move ERC-20 and ERC-721 tokens between chains. We've also included a very simple example on using the generic functionality of the bridge. The information you will need is the following:

TODO -> Add information such as contract addresses etc.s

### ERC-20 Token Transfer

To perform an ERC-20 token transfer through the bridge, the asset needs to be registered in the relayers. Therefore, we've deployed an ERC-20 token where any user can mint 5 tokens to test the bridge out:

 - Custom ERC-20 Token: `TODO->ADDRESS`

The following interface can be used to interact with this contract and mint the tokens:

```solidity
pragma solidity ^0.6.0;

/**
    Interface for the Custom ERC20 Token contract for ChainBridge implementation
    ERC-20 Address: TODO
**/

interface CustomERC20 {

    function mintTokens() external;
}
```

Note that the mint function of the ERC-20 token contract was modified to also approve the corresponding handler contract as an spender when minting tokens.

### ERC-721 Token Transfer


### Generic 

## Contact Us
If you have any feedback regarding implementing ChainBridge on your project, or any other Moonbeam related topic, feel free to reach out through our official development [Discord server](https://discord.com/invite/PfpUATX).
