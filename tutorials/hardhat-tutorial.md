---
title: Getting Started with Hardhat
description: In this guide, we'll be doing a comprehensive, intermediate-level introduction to the Hardhat development environment.
---

# Hardhat Developer Workflow

![Banner Image](/images/tutorials/remote-staking-via-xcm/remote-staking-via-xcm-banner.png)
_January 16, 2023 | by Kevin Neilson & Erin Shaben_


## Introduction {: #introduction } 

In this tutorial, we'll walk through the [Hardhat development environment](https://hardhat.org/){target=_blank} in the context of launching a [pooled StakingDAO contract](https://github.com/hyd628/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank}. We'll walk through each of the steps in detail, including compilation, deployment, verification, and more. This tutorial assumes that you already have Hardhat installed and have used it before. If you don't yet have Hardhat installed on your machine or this is your first time exploring Hardhat, it's recommended that you start with [this introduction to Hardhat](/builders/build/eth-api/dev-env/hardhat/){target=_blank}. 

## Creating a Hardhat Project {: #creating-a-hardhat-project }

--8<-- 'text/hardhat/creating-a-hardhat-project.md'

## Plugins

Plugins are an essential component of Hardhat's flexibility and capability. On Hardhat's website you'll find [a complete list of official Hardhat plugins](https://hardhat.org/hardhat-runner/plugins){target=_blank}. You'll need the Hardhat Toolbox plugin later in this tutorial. It can be installed with the following command:

```
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

Then add the line `require("@nomicfoundation/hardhat-toolbox");` to your `hardhat.config.js` such that it resembles the following: 
 
```javascript
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
};
```

## Writing and Compiling Smart Contracts {: #writing-and-compiling-smart-contracts }

The smart contract featured in this tutorial is more complex than the one in the [Introduction to Hardhat](/builders/build/eth-api/dev-env/hardhat/){target=_blank} but the nature of the contract means it's perfect to demonstrate some of the advanced capabilities of Hardhat. [DelegationDAO.sol](https://github.com/hyd628/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank} is a pooled staking DAO that uses the [Staking Precompile](/builders/pallets-precompiles/precompiles/staking/){target=_blank} autonomously delegate to a collator when it reaches a determined threshold. Pooled staking contracts such as [DelegationDAO.sol](https://github.com/hyd628/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank} allow delegators with less than the protocol minimum bond to join together to delegate their pooled funds and earn a share of staking rewards. 

!!! note
    `DelegationDAO.sol` is unreviewed and unaudited. It is designed only for demonstration purposes and not intended for production use. It may contain bugs or logic errors that could result in loss of funds. 

To get started, create a contracts directory to hold your project's smart contracts by running the following command:

```
mkdir contracts && cd contracts
```

Create a new file called `DelegationDAO.sol`:

```
touch DelegationDAO.sol
```

To set up the necessary contracts, take the following steps: 

1. Copy and paste the contents of [DelegationDAO.sol](https://github.com/hyd628/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank} into `DelegationDAO.sol` 
2. You'll also need to fetch a copy of [StakingInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=_blank} and copy and paste it into a file named `StakingInterface.sol` also within the same `contracts` directory 
3. DelegationDAO.sol relies on a couple of standard OpenZeppelin contracts. Add the library by running ```npm install @openzeppelin/contracts```

## Hardhat Configuration File {: #hardhat-configuration-file } 

--8<-- 'text/hardhat/hardhat-configuration-file.md'

## Compiling the Contract {: #compiling-the-contract } 

To compile the contract you can simply run:

```
npx hardhat compile
```

![Hardhat Contract Compile](/images/tutorials/hardhat/hardhat1.png)

After compilation, an `artifacts` directory is created: it holds the bytecode and metadata of the contract, which are `.json` files. It’s a good idea to add this directory to your `.gitignore`.


## Deploying the Contract {: #deploying-the-contract } 

In the following steps, you'll be deploying the DelegationDAO to Moonbase Alpha. Note, because DelegationDAO relies on the [StakingPrecompile](/builders/pallets-precompiles/precompiles/staking/){target=_blank}, which is a substrate-based offering unique to Moonbeam Networks, DelegationDAO will not work properly if deployed to the local default Hardhat Network or a [forked network](builders/build/eth-api/dev-env/hardhat/#hardhat-forking){target=_blank}.

To deploy `DelegationDAO.sol`, you can write a simple script. You can create a new directory for the script and name it `scripts` and add a new file to it called `deploy.js`:

```
mkdir scripts && cd scripts
touch deploy.js
```

Next, you need to write your deployment script which can be done using `ethers`. Because you'll be running it with Hardhat, you don't need to import any libraries.

To get started, take the following steps:

1. Specify the address of the active collator the DAO intends to delegate to. In this case, we've specified the address of the PS-1 Collator
2. Specify the deployer address set in your `secrets.json` as the admin of the DAO. It's important that this address be set to the address you use to deploy the contract to ensure the following steps in the tutorial work properly
3. Create a local instance of the contract with the `getContractFactory` method
4. Use the `deploy` method that exists within this instance to instantiate the smart contract
5. Once deployed, you can fetch the address of the contract using the contract instance


When all is said and done your deployment script should look similar to the following: 

```javascript
// scripts/deploy.js

const targetCollator = "{{ networks.moonbase.staking.candidates.address1 }}"
const admin = "YOUR ADDRESS HERE";

async function main() {

   const [deployer] = await ethers.getSigners();
   console.log("Deploying contracts with the account:", deployer.address);

   const delegationDao = await ethers.getContractFactory("DelegationDAO");
   const deployedDao = await delegationDao.deploy(targetCollator, admin);

   console.log("DAO address:", deployedDao.address);
   
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
```

You can now deploy `DelegationDAO.sol` using the `run` command and specifying `moonbase` as the network:

```
npx hardhat run --network moonbase scripts/deploy.js
```

If you're using another Moonbeam network, make sure that you specify the correct network. The network name needs to match how it's defined in the `hardhat.config.js`.

After a few seconds, the contract is deployed, and you should see the address in the terminal.

![Hardhat DelegationDAO Deploy](/images/tutorials/hardhat/hardhat2.png)

Congratulations, your contract is live! Save the address, as you will use it to interact with this contract instance in the next step.

## Contract Verification {: #contract-verification }

Contract verification is an essential step of any developer's workflow, particularly in the theoretical example of this StakingDAO. Potential participants in the DAO need to be assured that the smart contract works as intended - and verifying the contract allows anyone to observe and analyze the deployed smart contract. 

Before beginning the contract verification process, you'll need to [acquire a Moonscan API Key](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}. Note that Moonbeam and Moonbase Alpha use the same [Moonbeam Moonscan](https://moonscan.io/){target=_blank} API key, whereas you'll need a distinct API key for [Moonriver](https://moonriver.moonscan.io/){target=_blank}. 

--8<-- 'text/hardhat/using-the-hardhat-etherscan-plugin.md'

To verify the contract, you will run the `verify` command and pass in the address of the deployed contract, the network where it's deployed, and the two constructor arguments that you specified in your `deploy.js`, namely, the address of the target collator, and the address of the dao admin.

```
npx hardhat verify --network moonbase <CONTRACT-ADDRESS> "COLLATOR-TARGET" "ADMIN-ADDRESS"
```

In your terminal you should see the source code for your contract was successfully submitted for verification. If the verification was successful, you should see **Successfully verified contract** and there will be a link to the contract code on [Moonscan for Moonbase Alpha](https://moonbase.moonscan.io/){target=_blank}. If the plugin returns an error, double check that your [API key is configured correctly and that you have specified all necessary parameters in the verification command](/builders/build/eth-api/verify-contracts/etherscan-plugins/){target=_blank}.

![Successful verification using hardhat-etherscan plugin](/images/tutorials/hardhat/hardhat3.png)
