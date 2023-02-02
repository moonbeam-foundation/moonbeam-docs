---
title: Deploy Contracts with Foundry
description: Learn how to use Foundry, an Ethereum development environment, to compile, deploy, and debug Solidity smart contracts on Moonbeam.
---

# Using Foundry to Deploy To Moonbeam

![Foundry Create Project](/images/builders/build/eth-api/dev-env/foundry/foundry-banner.png)

## Introduction {: #introduction } 

[Foundry](https://github.com/foundry-rs/foundry){target=_blank} is an Ethereum development environment written in Rust that helps developers manage dependencies, compile projects, run tests, deploy contracts, and interact with blockchains from the command line. Foundry can directly interact with Moonbeam's Ethereum API so it can be used to deploy smart contracts into Moonbeam.

There are four tools that make up Foundry:  

- **[Forge](https://book.getfoundry.sh/forge/){target=_blank}** - compiles, tests, and deploys contracts
- **[Cast](https://book.getfoundry.sh/cast/){target=_blank}** - a command line interface for interacting with contracts
- **[Anvil](https://book.getfoundry.sh/anvil/){target=_blank}** - a local TestNet node for development purposes that can fork preexisting networks
- **[Chisel](https://book.getfoundry.sh/chisel/){target=_blank}** - a Solidity REPL for quickly testing Solidity snippets

This guide will cover how to use Foundry to compile, deploy, and debug Ethereum smart contracts on the Moonbase Alpha TestNet. This guide can also be adapted for Moonbeam, Moonriver, or a Moonbeam development node.

## Checking Prerequisites {: #checking-prerequisites } 

To get started, you will need the following:

 - Have an account with funds. 
  --8<-- 'text/faucet/faucet-list-item.md'
 - 
--8<-- 'text/common/endpoint-examples.md'
 - Have [Foundry installed](https://book.getfoundry.sh/getting-started/installation){target=_blank}

## Creating a Foundry Project {: #creating-a-foundry-project }

You will need to create a Foundry project if you don't already have one. You can create one by completing the following steps:

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

- `lib` - all of the project's dependencies in the form of git submodules
- `src` - where to put your smart contracts (with functionality)
- `test` - where to put the forge tests for your project, which are written in Solidity

In addition to these three folders, a git project will also be created along with a prewritten `.gitignore` file with relevant file types and folders ignored.

## The Source Folder {: #the-src-folder } 

The `src` folder may already contain `Contract.sol`, a minimal Solidity contract. Feel free to delete it. Instead, you will be deploying an ERC-20 contract. In the contracts directory, you can create the `MyToken.sol` file:

```
cd src
touch MyToken.sol
```

Open the file and add the following contract to it:

```solidity
pragma solidity ^0.8.0;

// Import OpenZeppelin Contract
import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

// This ERC-20 contract mints the specified amount of tokens to the contract creator
contract MyToken is ERC20 {
  constructor(uint256 initialSupply) ERC20("MyToken", "MYTOK") {
    _mint(msg.sender, initialSupply);
  }
}
```

Before you attempt to compile, install OpenZeppelin contracts as a dependency. You may have to commit previous changes to git beforehand. By default, Foundry uses git submodules instead of npm packages, so the traditional npm import path and command are not used. Instead, use the name of OpenZeppelin's Github repository:

```
forge install OpenZeppelin/openzeppelin-contracts
```

## Compiling Solidity {: #compiling-solidity } 

Once all dependencies have been installed, you can compile the contract:

```
forge build
```

![Foundry Contract Compile](/images/builders/build/eth-api/dev-env/foundry/foundry-1.png)

After compilation, two folders will be created: `out` and `cache`. The ABI and bytecode for your contracts will be contained within the `out` folder. These two folders are already ignored by the `.gitignore` included in the default Foundry project initialization.

## Deploying the Contract {: #deploying-the-contract } 

Deploying the contract with Forge takes a single command, but you will need to include an RPC endpoint, a funded private key, and constructor arguments. `MyToken.sol` asks for an initial supply of tokens in its constructor, so each of the following commands include 100 as a constructor argument. You can deploy the `MyToken.sol` contract using the command for the correct network:

=== "Moonbeam"
    ```
    forge create --rpc-url {{ networks.moonbeam.rpc_url }} \
    --constructor-args 100 \
    --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken 
    ```

=== "Moonriver"
    ```
    forge create --rpc-url {{ networks.moonriver.rpc_url }} \
    --constructor-args 100 \
    --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken 
    ```

=== "Moonbase Alpha"
    ```
    forge create --rpc-url {{ networks.moonbase.rpc_url }} \
    --constructor-args 100 \
    --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken 
    ```

=== "Moonbeam Dev Node"
    ```      
    forge create --rpc-url {{ networks.development.rpc_url }} \
    --constructor-args 100 \
    --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken 
    ```

After a few seconds, the contract is deployed, and you should see the address in the terminal.

![Foundry Contract Deploy](/images/builders/build/eth-api/dev-env/foundry/foundry-2.png)

Congratulations, your contract is live! Save the address, as you will use it to interact with this contract instance in the next step.

## Interacting with the Contract {: #interacting-with-the-contract } 

Foundry includes cast, a CLI for performing Ethereum RPC calls. 

Try to retreive your token's name using cast, where `YOUR_CONTRACT_ADDRESS` is the address of the contract that you deployed in the previous section:

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

This is far from readable, but you can use cast to convert it into your desired format. In this case, the data is text, so you can convert it into ascii characters to see "My Token":

![Foundry Contract View](/images/builders/build/eth-api/dev-env/foundry/foundry-3.png)

```
cast --to-ascii 0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000074d79546f6b656e00000000000000000000000000000000000000000000000000
```

You can also mutate data with cast as well. Try burning tokens by sending them to the zero address.

=== "Moonbeam"
    ```
    cast send --private-key YOUR_PRIVATE_KEY \
    --rpc-url {{ networks.moonbeam.rpc_url }} \
    --chain {{ networks.moonbeam.chain_id }} \
    YOUR_CONTRACT_ADDRESS \
    "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

=== "Moonriver"
    ```
    cast send --private-key YOUR_PRIVATE_KEY \
    --rpc-url {{ networks.moonriver.rpc_url }} \
    --chain {{ networks.moonriver.chain_id }} \
    YOUR_CONTRACT_ADDRESS \
    "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

=== "Moonbase Alpha"
    ```
    cast send --private-key YOUR_PRIVATE_KEY \
    --rpc-url {{ networks.moonbase.rpc_url }} \
    --chain {{ networks.moonbase.chain_id }} \
    YOUR_CONTRACT_ADDRESS \
    "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

=== "Moonbeam Dev Node"
    ```      
    cast send --private-key YOUR_PRIVATE_KEY \
    --rpc-url {{ networks.development.rpc_url }} \
    --chain {{ networks.development.chain_id }} \
    YOUR_CONTRACT_ADDRESS \
    "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

The transaction will be signed by your Moonbase account and be broadcasted to the network. The output should look similar to:

![Foundry Contract Interaction](/images/builders/build/eth-api/dev-env/foundry/foundry-4.png)

Congratulations, you have successfully deployed and interacted with a contract using Foundry!

## Forking with Anvil {: #forking-with-cast-anvil }

As previously mentioned, [Anvil](https://book.getfoundry.sh/anvil/){target=_blank} is a local TestNet node for development purposes that can fork preexisting networks. Forking Moonbeam allows you to interact with live contracts deployed on the network.

There are some limitations to be aware of when forking with Anvil. Since Anvil is based on an EVM implementation, you cannot interact with any of the Moonbeam precompiled contracts and their functions. Precompiles are a part of the Substrate implementation and therefore cannot be replicated in the simulated EVM environment. This prohibits you from interacting with cross-chain assets on Moonbeam and Substrate-based functionality such as staking and governance.

To fork Moonbeam or Moonriver, you will need to have your own endpoint and API key which you can get from one of the supported [Endpoint Providers](/builders/get-started/endpoints/){target=_blank}.

To fork Moonbeam from the command line, you can run the following command from within your Foundry project directory:

=== "Moonbeam"

    ```sh
    anvil --fork-url {{ networks.moonbeam.rpc_url }}
    ```

=== "Moonriver"

    ```sh
    anvil --fork-url {{ networks.moonriver.rpc_url }}
    ```

=== "Moonbase Alpha"

    ```sh
    anvil --fork-url {{ networks.moonbase.rpc_url }}
    ```

Your forked instance will have 10 development accounts that are pre-funded with 10,000 test tokens. The forked instance is available at `http://127.0.0.1:8545/`. The output in your terminal should resemble the following:

![Forking terminal screen](/images/builders/build/eth-api/dev-env/foundry/foundry-5.png)

To verify you have forked the network, you can query the latest block number:

```
curl --data '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8545 
```

If you convert the `result` from [hex to decimal](https://www.rapidtables.com/convert/number/hex-to-decimal.html){target=_blank}, you should get the latest block number from the time you forked the network. You can cross reference the block number using a [block explorer](/builders/get-started/explorers){target=_blank}.

From here you can deploy new contracts to your forked instance of Moonbeam or interact with contracts already deployed. Building off of the previous example in this guide, you can make a call using Cast to check the balance of the minted MYTOK tokens in the account you deployed the contract with:

```
cast call INSERT-CONTRACT-ADDRESS  "balanceOf(address)(uint256)" INSERT-YOUR-ADDRESS --rpc-url http://localhost:8545
```

## Using Chisel {: #using-chisel }

One of Foundry's newer tools, Chisel is a Solidity REPL, or shell. It allows a developer to write solidity directly in the console for testing small snippets of Solidity code, letting developers skip the project setup and contract deployment steps for what should be a quick process.  

Since Chisel is mainly useful for quick testing, it can be used outside of a Foundry project. But, if executed within a Foundry project, it will keep the configurations within `foundry.toml` when running.  

To get started using Chisel, run `chisel` in the command line.  


--8<-- 'text/disclaimers/third-party-content.md'