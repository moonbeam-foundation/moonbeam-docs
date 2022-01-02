---
title: Verify Smart Contracts
description: Learn about how to verify smart contracts on Moonbeam networks using one of the available block explorers. 

---
# Verify Smart Contracts

![Explorer Banner](/images/builders/tools/explorers/explorers-banner.png)

## Introduction {: #introduction } 

Verifying smart contracts on a block explorer is great way of improving the transparency and security of deployed smart smarts on Moonbeam. Users can directly view the source code on verified smart contracts on the block explorer, and can also directly interact with the contract's public methods through the block explorer's interface. 

This page will outline the steps for verifying smart contracts on Moonbeam networks.

## Deploying The Contract {: #deploying-the-contract }

In order to verify a smart contract on a block explorer, the contract must be first deployed on the target network first. For this tutorial, we will be deploying the smart contract to Moonbase Alpha testnet. 

You can check this page for a tutorial on [deploying smart contracts](/builders/interact/eth-libraries/deploy-contract/) using Ethereum libraries on Moonbeam. You may also use a developer tool such as [Remix](/builders/interact/remix/#deploying-a-contract-to-moonbeam-using-remix), [Truffle](/builders/interact/truffle/#deploying-a-contract-to-moonbeam-using-truffle), or another tool if preferred, to deploy the smart contract to Moonbeam. 

We will use the same contract as the above deployment tutorial for our contract verification example. 

The contract used is a simple incrementer, arbitrarily named _Incrementer.sol_, which you can find [here](/snippets/code/web3-contract-local/Incrementer.sol). The Solidity code is the following:

```solidity
--8<-- 'code/web3-contract-local/Incrementer.sol'
```
### Compiling and Deployment Information

There are certain compiling and deployment information that must be collected in order to verify a smart contract. 

!!! note
    You will need the deployed contract address of the smart contract in order to verify the contract later. Depending on how you deployed the contract, the address of the contract can be found either in the console output if using a commandline based tool such as Truffle, Hardhat, or an Ethereum library, or it can be copied from the GUI in tools such as Remix IDE. 




## Verify the Contract  {: #verifying-the-contract }

The next step will be verifying the smart contract in an EVM compatible explorer for the Moonbeam network that you deployed to. 

### Using Moonscan {: #using-moonscan }

1. Start by going to the [Verify & Publish Contract Source Code](https://moonbase.moonscan.io/verifyContract) page of Moonscan. 

2. Fill in the fields with the information saved during deployment from the previous section: 

The contract address, compiler version, 

### Using Blockscout 

### Multi-Part Smart Contracts

## Smart Contract Flattening

There are cases where multi-part smart contracts require pre-processing before they can be verified successfully on block explorers. This pre-processing is usually referred to as smart contract flattening, which is essentially combining all dependencies of the target smart contract into a single Solidity file. 

There are a number of tools that can be used to flatten a multi-part smart contract into a single Solidity file, such as [Truffle Flattener](https://www.npmjs.com/package/truffle-flattener). Please refer to the respective flattening tool's documentation for more detailed instructions on usage. 

After flattening the multi-part smart contract, it can be verified using the new flattened Solidity file the same way that a single-file smart contract is verified. 

