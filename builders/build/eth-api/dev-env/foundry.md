---
title: Deploy Contracts with Foundry
description: Learn how to use Foundry, an Ethereum development environment, to compile, deploy, and debug Solidity smart contracts on Moonbeam.
---

# Using Foundry to Deploy To Moonbeam

![Foundry Create Project](/images/builders/build/eth-api/dev-env/foundry/foundry-banner.png)

## Introduction {: #introduction } 

[Foundry](https://github.com/foundry-rs/foundry){target=_blank} is an Ethereum development environment written in Rust that helps developers manage dependencies, compile projects, run tests, deploy contracts, and interact with blockchains from the command line. Foundry can directly interact with Moonbeam's Ethereum API so it can be used to deploy smart contracts into Moonbeam.

There are three tools that make up Foundry:
- Forge: compiles, tests, and deploys contracts
- Cast: a command line interface for interacting with contracts
- Anvil: a local testnet node for development purposes that can fork preexisting networks

This guide will cover how to use Foundry to compile, deploy, and debug Ethereum smart contracts on the Moonbase Alpha TestNet. This guide can also be adapted for Moonbeam, Moonriver, or Moonbeam development node.

## Checking Prerequisites {: #checking-prerequisites } 

To get started, you will need the following:

 - Have an account with funds. 
  --8<-- 'text/faucet/faucet-list-item.md'
 - 
--8<-- 'text/common/endpoint-examples.md'
 - Have [Foundry installed](https://book.getfoundry.sh/getting-started/installation){target=_blank}

## Creating a Foundry Project {: #creating-a-foundry-project }

You will need to create a Hardhat project if you don't already have one. You can create one by completing the following steps:

1. Install Foundry if you haven't already. If on Linux or MacOS, you can run these commands:
  
    ```
    curl -L https://foundry.paradigm.xyz | bash
    foundryup
    ```

    If on Windows, you'll have to install Rust & then build Foundry from source:

    ```
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs/ | sh
    cargo install --git https://github.com/foundry-rs/foundry foundry-cli anvil --bins --locked
    ```

2. Create the project, which will create a folder with three folders within it:
    ```
    forge init foundry
    ```

With the default project created, you should see three folders. 
- `lib`: all of the project's dependencies in the form of git submodules
- `src`: where to put your smart contracts (with functionality)
- `test`: where to put the forge tests for your project, which are written in solidity

In addition to these three folders, a git project will also be created along with a prewritten `.gitignore` file with relevant file types and folders ignored.

## The Source Folder {: #the-src-folder } 

The `src` folder may already contain `Contract.sol`, a minimal solidity contract. Feel free to delete it. Instead, you will be deploying an ERC-20 contract. In the contracts directory, you can create the `MyToken.sol` file:

```
cd src
touch MyToken.sol
```

Open the file and add the following contract to it:

```solidity
pragma solidity ^0.8.0;

// Import OpenZeppelin Contract
import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

// This ERC-20 contract mints the specified amount of tokens to the contract creator.
contract MyToken is ERC20 {
  constructor(uint256 initialSupply) ERC20("MyToken", "MYTOK") {
    _mint(msg.sender, initialSupply);
  }
}
```

Before you attempt to compile, install OpenZeppelin contracts as a dependency. By default, Foundry uses git submodules instead of npm packages, so the traditional npm import path & command are not used. Instead, use the name of OpenZeppelin's Github repository:

```
forge install OpenZeppelin/openzeppelin-contracts
```

## Compiling Solidity {: #compiling-solidity } 

Once all dependencies have been installed, you can compile the contract:

```
forge build
```

![Foundry Contract Compile](/images/builders/build/eth-api/dev-env/foundry/foundry-1.png)

After compilation, two folders will be created: `out` and `cache`. The abi and bytecode for your contracts will be contained within the `out` folder. These two folders are already ignored by the `.gitignore` included in the default Foundry project initialization.

## Deploying the Contract {: #deploying-the-contract } 

Deploying the contract with Forge takes a single command, but you will need to include an rpc endpoint, a funded private key, and constructor arguments. `MyToken.sol` asks for an initial supply of tokens in its constructor, so each of the following commands include 100 as a constructor argument. You can deploy the `MyToken.sol` contract using the command for the correct network:

=== "Moonbeam"
    ```
    forge create --rpc-url {{ networks.moonbeam.rpc_url }} --constructor-args 100 --private-key YOUR_PRIVATE_KEY src/MyToken.sol:MyToken 
    ```

=== "Moonriver"
    ```
    forge create --rpc-url {{ networks.moonriver.rpc_url }} --constructor-args 100 --private-key YOUR_PRIVATE_KEY src/MyToken.sol:MyToken 
    ```

=== "Moonbase Alpha"
    ```
    forge create --rpc-url {{ networks.moonbase.rpc_url }} --constructor-args 100 --private-key YOUR_PRIVATE_KEY src/MyToken.sol:MyToken 
    ```

=== "Moonbeam Dev Node"
    ```      
    forge create --rpc-url {{ networks.development.rpc_url }} --constructor-args 100 --private-key YOUR_PRIVATE_KEY src/MyToken.sol:MyToken 
    ```

After a few seconds, the contract is deployed, and you should see the address in the terminal.

![Foundry Contract Deploy](/images/builders/build/eth-api/dev-env/foundry/foundry-2.png)

Congratulations, your contract is live! Save the address, as you will use it to interact with this contract instance in the next step.

## Interacting with the Contract {: #interacting-with-the-contract } 

Foundry includes cast, a CLI for performing Ethereum RPC calls. 

Try to retreive your token's name using cast, where YOUR_CONTRACT_ADDRESS is the address of the contract that you deployed in the previous section:

=== "Moonbeam"
    ```
    cast call YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonbeam.rpc_url }}
    ```

=== "Moonriver"
    ```
    cast call YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonriver.rpc_url }}
    ```

=== "Moonbase Alpha"
    ```
    cast call YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonbase.rpc_url }}
    ```

=== "Moonbeam Dev Node"
    ```      
    cast call YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.development.rpc_url }}
    ```

You should get this data in hexidecimal format:
```
0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000074d79546f6b656e00000000000000000000000000000000000000000000000000
```

This is far from readable, but you can use cast to convert it into your desired format. In this case, we're expecting the data to be text, so we will convert it into ascii characters to see "My Token":

```
cast --to-ascii 0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000074d79546f6b656e00000000000000000000000000000000000000000000000000
```

![Foundry Contract Interaction](/images/builders/build/eth-api/dev-env/foundry/foundry-3.png)

You can also mutate data with cast as well. Try burning tokens by sending them to the zero address.

=== "Moonbeam"
    ```
    cast call YOUR_CONTRACT_ADDRESS "transfer(address,uint256)" --rpc-url {{ networks.moonbeam.rpc_url }}
    ```

=== "Moonriver"
    ```
    cast call YOUR_CONTRACT_ADDRESS "transfer(address,uint256)" --rpc-url {{ networks.moonriver.rpc_url }}
    ```

=== "Moonbase Alpha"
    ```
    cast call YOUR_CONTRACT_ADDRESS "transfer(address,uint256)" --rpc-url {{ networks.moonbase.rpc_url }}
    ```

=== "Moonbeam Dev Node"
    ```      
    cast call YOUR_CONTRACT_ADDRESS "transfer(address,uint256)" --rpc-url {{ networks.development.rpc_url }}
    ```

The transaction will be signed by your Moonbase account and be broadcasted to the network. The output should look similar to:

(INSERT IMAGE HERE)

Congratulations, you have successfully deployed and interacted with a contract using Foundry!

--8<-- 'text/disclaimers/third-party-content.md'