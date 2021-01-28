---
title: Hardhat
description: Use Hardhat to compile, deploy, debug Ethereum smart contracts on Moonbeam.
---

# Building with Hardhat on Moonbase Alpha

## Introduction
In this guide, we will cover how to use Hardhat to compile, deploy and debug Ethereum smart contracts on Moonbase Alpha.

## Checking Prerequisites
As always, check that Node.js has been installed on your machine (we'll go for v14.x) and npm. You can do this by running in your terminal:

=== "Ubuntu"

    ```
    curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
    ```

    ```
    sudo apt install -y nodejs
    ```

=== "Mac OS"

      If you don’t have `Homebrew` installed yet, follow the instructions on their [website](https://docs.brew.sh/Installation). After installing Homebrew, open terminal and type:

    ```
    brew install node
    ```

    Homebrew will run through the installation process. Once finished, you should have both Node.js and `Node Package Manager (npm)` installed.

=== "Windows"

      Download the Node.js `Windows Installer` from the Node.js official [Download Page](https://nodejs.org/en/download/). 

      Open the Windows Installer file and run through the installation process. Once finished, you should have both Node.js and `Node Package Manager (npm)` installed.

We can verify that everything installed correctly by querying the version for each package:

```
node -v
```
```
npm -v
```

As of the writing of this guide, versions used were 14.6.0 and 6.14.6, respectively. 

Also, you will need the following:

-  Have MetaMask installed and [connected to Moonbase](/getting-started/testnet/metamask/)
-  Have an account with funds, which you can get from [Mission Control](/getting-started/testnet/faucet/)

Once all requirements have been met, you are ready to build with Hardhat.

## Starting a Hardhat Project

To start a new project, create a directory for it:
```
mkdir tutorial && cd tutorial
```
Then, initialize the project by running:
```
npm init -y
```
You will notice a newly created `package.json`, which will continue to grow as you install project dependencies through `npm install`.

To get started with Hardhat we will install it in our newly created project directory:
```
npm install --save-dev hardhat
```
Once installed, run:
```
npx hardhat
```
This will create create a Hardhat config file (`hardhat.config.js`) in our project directory.

!!! note
      `npx` is used to run executables installed locally in your project. Although Hardhat can be installed globally we recommend installing locally in each project so that you can control the version on a project by project basis.
    
After running the command, go ahead and choose `Create an empty hardhat.config.js`:

```text
888    888                      888 888               888
888    888                      888 888               888
888    888                      888 888               888
8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
888    888 .d888888 888    888  888 888  888 .d888888 888
888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888

👷 Welcome to Hardhat v2.0.8 👷‍

? What do you want to do? …
❯ Create an empty hardhat.config.js
  Quit
```

## Writing the Smart Contract

We are going to store our contract in the `contracts` directory. Go ahead and create it:

```
mkdir contracts && cd contracts
```

Our simple smart contract will be called Box: it will let people store a value that can be later retrieved. 

We will save this file as `contracts/Box.sol`: 

```solidity
// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract Box {
    uint256 private value;

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    // Stores a new value in the contract
    function store(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }
}
```

## Compiling Solidity

Our contract, `Box.sol`, uses Solidity 0.8.1. We need to configure hardhat to use the appropriate version of `solc` inside `hardhat.config.js`: 

```js
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.1",
};
```
After saving the file, we are ready to compile:

```
npx hardhat compile

Downloading compiler 0.8.1
Compiling 1 file with 0.8.1
Compilation finished successfully
```

## Deploying the contract to Moonbase Alpha

After compilation an `artifacts` directory was created: it holds the bytecode and metadata of the contract, which are .json files. It’s a good idea to add this directory to your `.gitignore`.

_Next Sections WIP_

- Create and fund a Moonbase account (will refer to existing tutorial)
- Updating hardhat config to connect to Moonbase Alpha
- Deploy the contract to Moonbase Alpha
- Interact with the contract through hardhat console
- Closing remarks and a segway into OpenZeppelin Contracts + Hardhat

## We Want to Hear From You
If you have any feedback regarding Moonbase Alpha, event subscription, or any other Moonbeam related topic, feel free to reach out through our official development [Discord channel](https://discord.gg/PfpUATX).


