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

## Getting ready for deployment

After compilation an `artifacts` directory was created: it holds the bytecode and metadata of the contract, which are .json files. It’s a good idea to add this directory to your `.gitignore`.

If you have not dones so yet, go ahead and [create a MetaMask Account, connect to Moonbase Alpha](/getting-started/testnet/metamask/), and fund it through [Mission Control](/getting-started/testnet/faucet/).

We will use the private key of the account you created to deploy the contract. Next, let's configure the network in `hardhat.config.js`:

```js
// ethers plugin required to interact with the contract
require('@nomiclabs/hardhat-ethers');

// private key from the pre-funded Moonbase Alpha testing account
const { privateKey } = require('./secrets.json');

module.exports = {
  // latest Solidity version
  solidity: "0.8.1",

  networks: {
    // Moonbase Alpha network specification
    moonbase: {
      url: `https://rpc.testnet.moonbeam.network`,
      chainId: 1287,
      accounts: [privateKey]   
    }
  }
};
```
Take a look at the config file. It requires a `hardhat-ethers` plugin to interact with the Box contract once it's deployed. Install `ethers` plugin by running: 

```
npm install --save-dev @nomiclabs/hardhat-ethers ethers 
```
Next, let's create a `secrets.json`, in the directory root, where we will be storing the private key mentioned before: 

![Secrets.json Root Directory](/images/hardhat/hardhat-secrets.png)

To copy the private key, open Metamask and navigate to `Account Details`:

![MetaMask Account Details](/images/hardhat/hardhat-account-details.png)

Copy the private key:

![Metamask Account Key](/images/hardhat/hardhat-key.png)

Then paste the private key into `secrets.json`:
```js
{
    "privateKey": "0af804f7a49a87e5f65ee8db9295aef7cabd51cd11b4be4"
}
```

!!! note
      Please, always manage your private keys with a designated secret manager or a similar service. Never save or commit your private keys inside your repositories.

Congratulations!👏🏼  We are ready for deployment!🚀🌖


## Deploying the contract

In order to deploy the Box smart contract, we will need to write a simple `deployment script`. Create a new directory - `scripts`. Inside the newly created directory add a new file `deploy.js` and copy / paste the following deployment sequence:

```js
// scripts/deploy.js
async function main() {
  // We get the contract to deploy
  const Box = await ethers.getContractFactory("Box");
  console.log("Deploying Box...");

  // Instantiating a new Box smart contract
  const box = await Box.deploy();

  // Waiting for the deployment to resolve
  await box.deployed();
  console.log("Box deployed to:", box.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

Using the `run` command, we can now deploy the `Box` contract to `Moonbase Alpha`: 

```
  npx hardhat run --network moonbase scripts/deploy.js
```
You should see a similar output:

```
Deploying Box...
Box deployed to: 0xaEd14503e00C59A027D81891238246d62669a92A
```

Congratulations, your contract is live! Save the address. We will use it to interact with this contract instance.

To interact with the contract, launch `hardhat console` by running:

```
npx hardhat console --network localhost
```
Then add the following lines of code, a line at a time. Don't worry about the `undefined` output you will get after each line is executed: 

```js
const Box = await ethers.getContractFactory("Box") 
```
```js
const box = await Box.attach("0xaEd14503e00C59A027D81891238246d62669a92A")
```
Notice how we are using the address we got during the deployment to `attach` to the contract. 

## Sending transactions

After attaching to the contract we are ready to interact with it. While the console is still in session, let's call the `store` method and store a simple value: 

```
await box.store(777)
```
Hit `Enter`. The transaction will be signed by your Moonbase account and broadcasted to the network. The output should look similar to:

![Transaction output](/images/hardhat/hardhat-store.png)

Notice your address labeled as `from`, as well as the address of the contract, and the `data` that is being passed.

Now let's retreive the value by running: 

```
(await box.retrieve()).toNumber() 
```
We should see `777` or the value you have stored initially. 

Congratulations, you have completed the Hardhat tutorial! 🤯 🎉

For more information on Hardhat, hardhat plugins, and other exciting functionality, please visit [hardhat.org](https://hardhat.org/).


## We Want to Hear From You
If you have any feedback regarding Moonbase Alpha, using hardhat to deploy smart contracts, or any other Moonbeam related topic, feel free to reach out through our official development [Discord channel](https://discord.gg/PfpUATX).