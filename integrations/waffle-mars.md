---
title: Waffle & Mars
description: Learn how to use Waffle and Mars to write, compile, and deploy Ethereum smart contracts on Moonbeam.
---

# Using Waffle & Mars on Moonbeam

![Waffle and Mars on Moonbeam](/images/waffle-mars/waffle-mars-banner.png)

## Introduction

[Waffle](waffle.io) and [Mars](https://ethereum-mars.readthedocs.io/en/latest/index.html) are two tools developers can use together to write, test, and deploy smart contracts onto Moonbeam. Waffle provides a lightweight JavaScript framework, that is TypeScript compatible, for writing and testing smart contracts. While Mars is a deployment manager that makes it easier to write and execute deployment configurations so you don't have to worry about your deployments.

For the purposes of this guide, Waffle is used to compile your contracts to JSON that the EVM can understand. After compilation, Mars takes the JSON output and uses it to generate artifacts which are then used to deploy contracts to Moonbeam.

In this guide, you'll be creating a TypeScript project to write and compile a smart contract using Waffle, then deploy it on to Moonbeam using Mars.

## Checking Prerequisites

--8<-- 'text/common/install-nodejs.md'

As of writing of this guide, the versions used were 15.12.0 and 7.6.3, respectively.

Waffle and Mars can be used on the Moonbase Alpha TestNet, but for the purposes of this guide, you will be deploying to a local Moonbeam development node. Check out the [Setting Up a Node](/getting-started/local-node/setting-up-a-node) documentation to learn how to spin up your own Moonbeam development node.

## Create a TypeScript Project with Waffle & Mars

To get started, you'll need to create a TypeScript project and install and configure a few dependencies such as TypeScript, Waffle, and Mars. You will also need to install Open Zeppelin Contracts as the contract you will be creating will use their ERC20 base implementation. The other library you'll need is TS Node, which will be used to execute the deployment script you'll create later in the guide. 

1. Create the directory and change to it
```
mkdir waffle-mars && cd waffle-mars
```

2. Initialize the project which will create a `package.json` in the directory
```
npm init -y
```

3. Install Waffle, Mars, Ethers, OpenZeppelin Contracts, TypeScript, and TS Node
```
npm install --save-dev ethereum-waffle ethereum-mars \
typescript @openzeppelin/contracts ts-node
```

4. Create a TypeScript configuration file
```
touch tsconfig.json
```

5. Add a basic TypeScript configuration
```
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2019",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "module": "CommonJS",
    "composite": true,
    "sourceMap": true,
    "declaration": true,
    "noEmit": true
  }
}
```

Now, you should have a basic TypeScript project with the necessary dependencies to get started building with Waffle and Mars.

## Write Contract

For this guide, you will create an ERC-20 contract that mints a specified amount of tokens to the contract creator. It's based on the Open Zeppelin ERC-20 template.

1. Create a directory to store your contracts and a file for the smart contract
```
mkdir contracts && cd contracts && touch MyToken.sol
```

2. Add the following contract to MyToken.sol
```
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyToken", "MYTOK") {
      _mint(msg.sender, initialSupply);
    }
}
```

In this contract, you are creating an ERC20 token called MyToken with the symbol MYTOK, that allows you, as the contract creator, to mint as many MYTOKs as desired.

## Compile Contract

Now that you have written a smart contract, the next step is to use Waffle to compile it. Before diving into compiling your contract, you will need to configure Waffle.

1. Go back to the root project directory and create a `waffle.json` file to configure Waffle
```
cd .. && touch waffle.json
```

2. Edit the `waffle.json` to specify compiler configurations and the directory containing your contracts. For this example, we'll use `solcjs` and the Solidity version you used for the contract, which is `0.8.0`
```json
{
  "compilerType": "solcjs",
  "compilerVersion": "0.8.0",
  "compilerOptions": {
    "optimizer": {
      "enabled": true,
      "runs": 20000
    }
  },
  "sourceDirectory": "./contracts"
}
```

3. Add a script to run Waffle in the `package.json`
```json
"scripts": {
  "build": "waffle"
},
```

That is all you need to do to configure Waffle, now you're all set to compile the `MyToken` contract using the `build` script:

```
npm run build
```

<SHOW COMPILER OUTPUT>

After compiling your contracts, Waffle stores the JSON output in the `build` directory. The contract in this guide is based on Open Zeppelin's ERC-20 template, so relevant ERC-20 JSON files will appear in the `build` directory too. 

## Deploy Contract

After you compile your contracts and before deployment, you will have to generate contract artifacts for Mars. Then you'll need to create a deployment script, configure Mars, and deploy the `MyToken` smart contract.

Remember, you will be deploying to a locally running Moonbeam development node and will need to use the development node RPC URL: `http://127.0.0.1:9933`. You can use Gerald's development account for this guide:

--8<-- 'text/metamask-local/dev-account.md'

The deployment will be broken up into three sections: [generating artifacts](#generating-artifacts), [creating a deployment script](#creating-a-deployment-script), and [deploying to Moonbeam](#deploying-to-moonbeam). 

### Generating Artifacts

1. Update existing script to run Waffle in the `package.json` to include Mars:
```json
"scripts": {
  "build": "waffle && mars"
},
```

2. Generate the artifacts and create the `artifacts.ts` file needed for deployments
```
npm run build
```


If you open the `build` directory, you should now see an `artifacts.ts` file containing the artifact data needed for deployments. To continue on and create a deployment, you'll need to start with writing a deployment script.

### Creating a Deployment Script

1. Create a `src` directory to contain your deployment scripts and create the script to deploy the `MyToken` contract
```
mkdir src && cd src && touch deploy.ts
```

2. In `deploy.ts`, use Mars' `deploy` function to create a script to deploy to your Moonbeam development node using Gerald's private key
```javascript
import { deploy } from 'ethereum-mars'

const privateKey = "0x99b3c12287537e38c90a9219d4cb074a89a16e9cdb20bf85728ebd97c343e342"

deploy({network: 'http://127.0.0.1:9933', privateKey},(deployer) => {
  // Deployment logic will go here
});
```

3. Set up the `deploy` function to deploy the `MyToken` contract created in the previous steps
```javascript
import { deploy, contract } from 'ethereum-mars'
import { MyToken } from '../build/artifacts'

const privateKey = "0x99b3c12287537e38c90a9219d4cb074a89a16e9cdb20bf85728ebd97c343e342"
deploy({network: 'http://127.0.0.1:9933', privateKey}, () => {
  contract('myToken', MyToken, [20_000])
});
```

4. Add a deploy script to the `scripts` object in the `package.json`

```json
  "scripts": {
    "build": "waffle && mars",
    "deploy": "ts-node src/deploy.ts"
  },
```

### Deploying to Moonbeam

1. Deploy the contract
```
npm run deploy
```
1. In your Terminal, Mars will prompt you to press `ENTER` to send your transaction. 

2. In your Terminal, Mars will prompt you to press `ENTER` to send your transaction. 
<SHOW MARS PRESS ENTER>

If successful, you should see details about your transaction including it's hash, the block it was included in, and it's address. If you go to the terminal running your Moonbeam development node, you will also see that a block has been created. 

<SHOW MARS TX DETAILS>
