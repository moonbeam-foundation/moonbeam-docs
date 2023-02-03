---
title: Hardhat Developer Workflow
description: In this guide, we'll compile, test, deploy, and verify a staking DAO smart contract on Moonbeam, demonstrating the features of the Hardhat Development environment.
---

# Hardhat Developer Workflow

![Banner Image](/images/tutorials/hardhat/hardhat-banner.png)
_January 16, 2023 | by Kevin Neilson & Erin Shaben_


## Introduction {: #introduction } 

In this tutorial, we'll walk through the [Hardhat development environment](https://hardhat.org/){target=_blank} in the context of launching a [pooled staking DAO contract](https://github.com/PureStake/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank}. We'll walk through the typical developer workflow in detail. We'll assemble the components of the staking DAO and compile the necessary contracts. Then, we'll deploy the staking DAO to Moonbase Alpha and verify it programmatically. We'll build a test suite and wrap up by deploying the staking DAO to Moonbeam. If this is your first time exploring Hardhat, you may wish to start with [the introduction to Hardhat guide](/builders/build/eth-api/dev-env/hardhat/){target=_blank}. 

_The information presented herein is for informational purposes only and has been provided by third parties. Moonbeam does not endorse any project listed and described on the Moonbeam docs website (https://docs.moonbeam.network/)._

## Checking Prerequisites {: #checking-prerequisites } 

To get started, you will need the following:

 - A Moonbase Alpha account funded with DEV. 
  --8<-- 'text/faucet/faucet-list-item.md'
 - A [Moonscan API Key](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}
  - 
--8<-- 'text/common/endpoint-examples.md'


--8<-- 'text/common/install-nodejs.md'

## Creating a Hardhat Project {: #creating-a-hardhat-project }

You will need to create a Hardhat project if you don't already have one. You can create one by completing the following steps:

1. Create a directory for your project
    ```
    mkdir stakingDAO && cd stakingDAO
    ```
2. Initialize the project which will create a `package.json` file
    ```
    npm init -y
    ```
3. Install Hardhat
    ```
    npm install hardhat
    ```
4. Create a project
    ```
    npx hardhat
    ```

    !!! note
        `npx` is used to run executables installed locally in your project. Although Hardhat can be installed globally, it is recommended to install it locally in each project so that you can control the version on a project by project basis.
            
5. A menu will appear which will allow you to create a new project or use a sample project. For this example, you can choose **Create an empty hardhat.config.js**

![Hardhat Create Project](/images/tutorials/hardhat/create-empty-hardhat-config.png)

This will create a Hardhat config file (`hardhat.config.js`) in your project directory.

You'll also need the [Hardhat Toolbox plugin](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-toolbox){target=_blank}, which conveniently bundles together the packages that we'll need later on for testing. It can be installed with the following command:

```
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

Then add the line `require("@nomicfoundation/hardhat-toolbox");` to your `hardhat.config.js` such that it resembles the following: 
 
```javascript
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.3",
};
```

If you're curious about additional Hardhat plugins, here is [a complete list of official Hardhat plugins](https://hardhat.org/hardhat-runner/plugins){target=_blank}.

## Add Smart Contracts {: #add-smart-contracts }

The smart contract featured in this tutorial is more complex than the one in the [Introduction to Hardhat](/builders/build/eth-api/dev-env/hardhat/){target=_blank} but the nature of the contract means it's perfect to demonstrate some of the advanced capabilities of Hardhat. [`DelegationDAO.sol`](https://github.com/PureStake/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank} is a pooled staking DAO that uses [`StakingInterface.sol`](/builders/pallets-precompiles/precompiles/staking/){target=_blank} to autonomously delegate to a [collator](/learn/platform/glossary/#collators){target=_blank} when it reaches a determined threshold. Pooled staking contracts such as [`DelegationDAO.sol`](https://github.com/PureStake/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank} allow delegators with less than the protocol minimum bond to join together to delegate their pooled funds and earn a share of staking rewards. 

!!! note
    `DelegationDAO.sol` is unreviewed and unaudited. It is designed only for demonstration purposes and not intended for production use. It may contain bugs or logic errors that could result in loss of funds. 

To get started, take the following steps:

1. Create a ```contracts``` directory to hold your project's smart contracts
    ```
    mkdir contracts
    ```
2. Create a new file called `DelegationDAO.sol`
    ```
    touch contracts/DelegationDAO.sol
    ```
3. Copy and paste the contents of [`DelegationDAO.sol`](https://github.com/PureStake/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank} into `DelegationDAO.sol` 
4. Create a new file called `StakingInterface.sol` in the ```contracts``` directory
    ```
    touch contracts/StakingInterface.sol
    ```
5. Copy and paste the contents of [`StakingInterface.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=_blank} into `StakingInterface.sol`
6. `DelegationDAO.sol` relies on a couple of standard [OpenZeppelin](https://www.openzeppelin.com/){target=_blank} contracts. Add the library with the following command: 
    ```
    npm install @openzeppelin/contracts
    ```

## Hardhat Configuration File {: #hardhat-configuration-file } 

--8<-- 'text/hardhat/hardhat-configuration-file.md'

```js
// 1. Import the Ethers plugin required to interact with the contract
require('@nomiclabs/hardhat-ethers');

// 2. Import your private key from your pre-funded Moonbase Alpha testing account
const { privateKey } = require('./secrets.json');

module.exports = {
  // 3. Specify the Solidity version
  solidity: "0.8.1",

  networks: {
    // 4. Add the Moonbase Alpha network specification
    moonbase: {
      url: '{{ networks.moonbase.rpc_url }}',
      chainId: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }} in hex,
      accounts: [privateKey]
    }
  }
};
```

You can modify the `hardhat.config.js` file to use any of the Moonbeam networks:

=== "Moonbeam"
    ```
    moonbeam: {
        url: '{{ networks.moonbeam.rpc_url }}', // Insert your RPC URL here
        chainId: {{ networks.moonbeam.chain_id }}, // (hex: {{ networks.moonbeam.hex_chain_id }}),
        accounts: [privateKey]
      },
    ```

=== "Moonriver"
    ```
    moonriver: {
        url: '{{ networks.moonriver.rpc_url }}', // Insert your RPC URL here
        chainId: {{ networks.moonriver.chain_id }}, // (hex: {{ networks.moonriver.hex_chain_id }}),
        accounts: [privateKey]
      },
    ```

=== "Moonbase Alpha"
    ```
    moonbase: {
        url: '{{ networks.moonbase.rpc_url }}',
        chainId: {{ networks.moonbase.chain_id }}, // (hex: {{ networks.moonbase.hex_chain_id }}),
        accounts: [privateKey]
      },
    ```

=== "Moonbeam Dev Node"
    ```      
    dev: {
        url: '{{ networks.development.rpc_url }}',
        chainId: {{ networks.development.chain_id }}, // (hex: {{ networks.development.hex_chain_id }}),
        accounts: [privateKey]
      },
    ```

It's also a sensible time to get set up with and import our [Moonscan API key](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank} which is required for the verification steps we'll be taking later in this tutorial. To get started with the Hardhat Etherscan plugin, you will need to first install the plugin library:

```
npm install --save-dev @nomiclabs/hardhat-etherscan
```

You can add your Moonscan API key to the `secrets.json` file alongside your private key. Both Moonbeam and Moonbase Alpha utilize the same [Moonbeam Moonscan](https://moonscan.io/){target=_blank} API key. If you want to verify a contract on Moonriver, you'll need a [Moonriver Moonscan](https://moonriver.moonscan.io/){target=_blank} API key.

After doing so, your `secrets.json` should resemble the following: 

![Add Moonscan API Key to Secret.json](/images/tutorials/hardhat/secrets-json.png)

From within your Hardhat project, open your `hardhat.config.js` file. You'll need to import the `hardhat-etherscan` plugin, your Moonscan API key, and add the config for Etherscan. After those steps, your `hardhat.config.js` should resemble the following: 

```js
require("@nomicfoundation/hardhat-toolbox");
// 1. Import the Ethers plugin required to interact with the contract
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");

// 2. Import your private key from your pre-funded Moonbase Alpha testing account
const { privateKey, moonbeamMoonscanAPIKey } = require('./secrets.json');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    // 4. Add the Moonbase Alpha network specification
    moonbase: {
      url: 'https://rpc.api.moonbase.moonbeam.network',
      chainId: 1287,
      accounts: [privateKey]
    },
    moonbeam: {
      url: 'RPC-API-ENDPOINT-HERE', // Insert your RPC URL here
      chainId: 1284, 
      accounts: [privateKey]
    },
  },
    etherscan: {
    apiKey: {
      moonbeam: moonbeamMoonscanAPIKey, // Moonbeam Moonscan API Key
      moonbaseAlpha: moonbeamMoonscanAPIKey, // Moonbeam Moonscan API Key    
    }
  }
};
```

You're now ready to move on to compilation and testing.

## Compiling the Contract {: #compiling-the-contract } 

To compile the contract you can simply run:

```
npx hardhat compile
```

![How to compile your solidity contracts with Hardhat](/images/tutorials/hardhat/compile-your-solidity-contracts.png)

After compilation, an `artifacts` directory is created: it holds the bytecode and metadata of the contract, which are `.json` files. It’s a good idea to add this directory to your `.gitignore`.

## Testing {: #testing }

A robust smart contract development workflow is incomplete without a testing suite. Hardhat has a number of tools that make it easy to write and run tests. In this section, you'll learn the basics of testing your smart contracts and some more advanced techniques. 

Hardhat tests are typically written with Mocha and Chai. [Mocha](https://mochajs.org/){target=_blank} is a JavaScript testing framework and [Chai](https://www.chaijs.com/){target=_blank} is a BDD/TDD JavaScript assertion library. BDD/TDD stands for behavior and test driven development respectively. Effective BDD/TDD necessitates writing your tests *before* writing your smart contract code. The structure of this tutorial doesn't strictly follow these guidelines, but you may wish to adopt these principles in your development workflow. Hardhat recommends using [Hardhat Toolbox](https://hardhat.org/hardhat-runner/docs/guides/migrating-from-hardhat-waffle){target=_blank}, a plugin that bundles everything you need to get started with Hardhat, including Mocha and Chai. 

### Configuring the Test File {: #configuring-the-test-file }

To set up your test file, take the following steps:

1. Create a ```tests``` directory 
    ```
    mkdir tests
    ```
2. Create a new file called `Dao.js`
    ```
    touch tests/Dao.js
    ```
3. Then copy and paste the contents below to set up the initial structure of your test file. Be sure to read the comments as they can clarify the purpose of each line 

``` javascript
//Import hardhat and hardhat toolbox
const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-toolbox");

// Import Chai to use its assertion functions here
const { expect } = require("chai");

// Indicate the collator the DAO wants to delegate to
const targetCollator = "{{ networks.moonbase.staking.candidates.address1 }}";
```

### Deploying a Staking DAO for Testing {: #deploying-a-staking-dao-for-testing }

Before we can run any test cases we'll need to launch a staking DAO with an initial configuration. Our setup here is relatively simple - we'll be deploying a stakingDAO with a single administrator (the deployer) and then adding a new member to the DAO. This simple setup is perfect for demonstration purposes, but it's easy to imagine more complex configurations you'd like to test, such as a scenario with 100 DAO members or one with multiple admins of the DAO. 

`Describe` is a Mocha function that that enables you to organize your tests. Multiple describe functions can be nested together. It's entirely optional but can be useful especially in a complex projects with large number of test cases. You can read more about constructing tests with Mocha on the [Mocha docs site](https://mochajs.org/#asynchronous-code){target=_blank}.

We'll define a function called `deployDao` that will contain the setup steps for our staking DAO. To configure your test file, add the following snippet:

``` javascript
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function
describe("Dao contract", function () {
  async function deployDao() {

    // Get the ContractFactory and Signers here
    const [deployer] = await ethers.getSigners();
    const delegationDao = await ethers.getContractFactory("DelegationDAO");
    
    // Deploy the staking DAO and wait for the deployment transaction to be confirmed
    const deployedDao = await delegationDao.deploy(targetCollator, deployer.address);
    await deployedDao.deployed();

    //Add a new member to the DAO
    await deployedDao.grant_member(member1.address);

    // Return the deployed DAO to allow the tests to access and interact with it
    return { deployedDao };
  }

  // The test cases should be added here.

});
```

### Writing your First Test Cases {: #writing-your-first-test-cases }

This tutorial deviates from the [test driven development philosophy](https://en.wikipedia.org/wiki/Test-driven_development){target=_blank} of writing your tests prior to your code. A few test cases will be cherry picked for demonstration purposes. 

First, you'll create a subsection called `Deployment` to keep the test file organized. This will be nested within the `Dao contract` function. This isn't required but may be helpful for organizational purposes. Next you'll define your first test case by using the `it` Mocha function. A description that clearly indicates what the test is doing is provided as well as indication that the function is async. This first test is simply checking to see that the staking DAO is correctly storing the address of the target collator.

Go ahead and add the below snippet to the end of your `Dao contract` function. 

```javascript
// You can nest calls to create subsections
describe("Deployment", function () {
    // `it` is another Mocha function This is the one you use to define each
    // of your tests. It receives the test name, and a callback function
    //
    // If the callback function is async, Mocha will `await` it
    it("The DAO should store the correct target collator", async function () {
      
      //Set up our test environment by calling deployDao.
      const { deployedDao } = await deployDao();

      // `expect` receives a value and wraps it in an assertion object.
      // This test will pass if the DAO stored the correct target collator
      expect(await deployedDao.target()).to.equal(targetCollator);
    });

    // The following test cases should be added here.
});
```

Now, add another test case. When a staking DAO is launched, it shouldn't have any funds. This test verifies that is indeed the case. Go ahead and add the following test case to your `Dao.js` file:

```javascript
it("The DAO should initially have 0 funds in it", async function () {
      const { deployedDao } = await deployDao();

      //This test will pass if the DAO has no funds as expected before any contributions.
      expect(await deployedDao.totalStake()).to.equal(0);
});
```

### Function Reverts {: #function-reverts }

To this point, the two cases implemented have been simple but important. Now, you'll implement a more complex test case that differs in its architecture. In prior examples, you've verified that a function returns an expected value. In this one, you'll be verifying that a function reverts. You'll also change the address of the caller to test an admin-only function. 

In the [staking DAO contract](https://github.com/PureStake/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank}, only admins are authorized to add new members to the DAO. One could write a test that checks to see if the admin is authorized to add new members but perhaps a more important test is to ensure that *non-admins* can't add new members. To run this test case under a different account, you're going to ask for another address when you call `ethers.getSigners()` and specify the caller in the assertion with `connect(member1)`. Finally, after the function call to be tested you'll append `.to.be.reverted;` to indicate that the test case is successful if the function reverts. And if it doesn't revert it's a failed test! 

```javascript
it("Non-admins should not be able to grant membership", async function () {
      const { deployedDao } = await deployDao();

      // We ask ethers for two accounts back this time.
      const [deployer, member1] = await ethers.getSigners();

      // We use connect to call grant_member from member1's account instead of admin.
      // This test will succeed if the function call reverts and fails if the call succeeds.
      await expect(deployedDao.connect(member1).grant_member("0x0000000000000000000000000000000000000000")).to.be.reverted;
});
```

### Signing Transactions from Other Accounts {: #signing-transactions-from-other-accounts }

For this example, you'll check to verify whether the newly added DAO member can call the `check_free_balance()` function of staking DAO, which has an access modifier such that only members can access it. 

```javascript
it("DAO members should be able to access member only functions", async function () {
      const { deployedDao } = await deployDao();

      // We ask ethers for two accounts back this time.
      const [deployer, member1] = await ethers.getSigners();

      // This test will succeed if the DAO member can call the member only function.
      // We use connect here to call the function from the account of the new member.
      expect(await deployedDao.connect(member1).check_free_balance()).to.equal(0);
});
```
And that's it! You're now ready to run your tests!

### Running your Tests {: #running-your-tests }

If you've followed all of the prior sections, your [`Dao.js`](https://raw.githubusercontent.com/PureStake/moonbeam-intro-course-resources/main/delegation-dao-lesson-one/Dao.js){target=_blank} test file should be all set to go. Otherwise, you can copy the complete snippet below into your [`Dao.js`](https://raw.githubusercontent.com/PureStake/moonbeam-intro-course-resources/main/delegation-dao-lesson-one/Dao.js){target=_blank}  test file. Comments have been removed for code readability, but you can refer to the prior sections 
for details on each step including comments.

--8<-- 'code/hardhat/dao-js-test-file.md'

You can run your tests with the following command: 

```
npx hardhat test tests/Dao.js
```

If everything was set up correctly, you should see output like the following: 

![Hardhat Run Tests](/images/tutorials/hardhat/hardhat4.png)


## Deploying to Moonbase Alpha {: #deploying-to-moonbase-alpha } 

In the following steps, we'll be deploying the DelegationDAO to the Moonbase Alpha testnet. Note, DelegationDAO relies on [`StakingInterface.sol`](/builders/pallets-precompiles/precompiles/staking/){target=_blank}, which is a substrate-based offering unique to Moonbeam Networks. The hardhat network and forked networks are simulated EVM environments which do not include the substrate-based precompiles like `StakingInterface.sol`. Therefore, DelegationDAO will not work properly if deployed to the local default Hardhat Network or a [forked network](/builders/build/eth-api/dev-env/hardhat/#forking-moonbeam){target=_blank}.

To deploy `DelegationDAO.sol`, you can write a simple script. You can create a new directory for the script and name it `scripts` and add a new file to it called `deploy.js`:

```
mkdir scripts
touch scripts/deploy.js
```

Next, you need to write your deployment script which can be done using `ethers`. Because you'll be running it with Hardhat, you don't need to import any libraries.

To get started, take the following steps:

1. Specify the address of the active collator the DAO intends to delegate to. In this case, we've specified the address of the PS-1 Collator
2. Specify the deployer address as the admin of the DAO. It's important that the deployer be the admin of the DAO to ensure later tests work as expected
3. Create a local instance of the contract with the `getContractFactory` method
4. Use the `deploy` method that exists within this instance to instantiate the smart contract
5. Once deployed, you can fetch the address of the contract using the contract instance


When all is said and done your deployment script should look similar to the following: 

```javascript
// scripts/deploy.js
//1. The PS-1 collator on Moonbase Alpha is chosen as the DAO's target
const targetCollator = "{{ networks.moonbase.staking.candidates.address1 }}"

async function main() {

   // 2. Get the address of the deployer to later be set as the admin of the DAO.
   const [deployer] = await ethers.getSigners();
   console.log("Deploying contracts with the account:", deployer.address);
   
   // 3. Get an instance of DelegationDAO
   const delegationDao = await ethers.getContractFactory("DelegationDAO");
   
   // 4. Deploy the contract specifying two params: the desired collator to delegate
   // to and the address of the deployer (synonymous with initial DAO admin)
   const deployedDao = await delegationDao.deploy(targetCollator, deployer.address);
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

![How to Deploy a Contract with HardHat Deployment script](/images/tutorials/hardhat/deploy-the-staking-dao-using-hardhat.png)

Congratulations, your contract is live on Moonbase Alpha! Save the address, as you will use it to interact with this contract instance in the next step.

## Verifying Contracts on Moonbase Alpha {: #verifying-contracts-on-moonbase-alpha }

Contract verification is an essential step of any developer's workflow, particularly in the theoretical example of this staking DAO. Potential participants in the DAO need to be assured that the smart contract works as intended - and verifying the contract allows anyone to observe and analyze the deployed smart contract. 

While it's possible to verify smart contracts on the [Moonscan website](https://moonscan.io/verifyContract){target=_blank}, the Hardhat Etherscan plugin enables us to verify our staking DAO in a faster and easier manner. It's not an exaggeration to say that the plugin dramatically simplifies the contract verification process, especially for projects that includes multiple solidity files or libraries. 

Before beginning the contract verification process, you'll need to [acquire a Moonscan API Key](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}. Note that Moonbeam and Moonbase Alpha use the same [Moonbeam Moonscan](https://moonscan.io/){target=_blank} API key, whereas you'll need a distinct API key for [Moonriver](https://moonriver.moonscan.io/){target=_blank}. 

Double check that your `secrets.json` file includes your API key for [Moonbeam Moonscan](https://moonscan.io/){target=_blank}. 

![Add Moonscan API Key to Secret.json](/images/tutorials/hardhat/secrets-json.png)

To verify the contract, you will run the `verify` command and pass in the network where the `DelegationDao` contract is deployed, the address of the contract, and the two constructor arguments that you specified in your `deploy.js` file, namely, the address of the target collator and the address you deployed the smart contract with (sourced from your `secrets.json` file).

```
npx hardhat verify --network moonbase <CONTRACT-ADDRESS> "{{ networks.moonbase.staking.candidates.address1 }}" "DEPLOYER-ADDRESS"
```

In your terminal you should see the source code for your contract was successfully submitted for verification. If the verification was successful, you should see **Successfully verified contract** and there will be a link to the contract code on [Moonscan for Moonbase Alpha](https://moonbase.moonscan.io/){target=_blank}. If the plugin returns an error, double check that your API key is configured correctly and that you have specified all necessary parameters in the verification command. You can refer to the [guide to the Hardhat Etherscan plugin](/builders/build/eth-api/verify-contracts/etherscan-plugins/){target=_blank} for more information.

![Successful verification using hardhat-etherscan plugin](/images/tutorials/hardhat/verify-contract-on-moonbase-alpha-with-etherscan-plugin.png)

## Deploying to Production on Moonbeam Mainnet {: #deploying-to-production-on-moonbeam-mainnet }

!!! note
    `DelegationDAO.sol` is unreviewed and unaudited. It is designed only for demonstration purposes and not intended for production use. It may contain bugs or logic errors that could result in loss of funds. 

In the following steps, we'll be deploying the DelegationDAO to the Moonbeam mainnet network. Before deploying DelegationDAO to Moonbeam, we need to change the address of the target collator, since our target collator on Moonbase Alpha does not exist on Moonbeam. Head to your deploy script and change the target collator to `0x1C86E56007FCBF759348dcF0479596a9857Ba105` or [another Moonbeam collator](https://apps.moonbeam.network/moonbeam/staking){target=_blank} of your choice. Your `deploy.js` script should thus look like the following: 

```javascript
// scripts/deploy.js
//1. The PureStake-03 collator on Moonbeam is chosen as the DAO's target
const targetCollator = "0x1C86E56007FCBF759348dcF0479596a9857Ba105"

async function main() {

   // 2. Get the address of the deployer to later be set as the admin of the DAO.
   const [deployer] = await ethers.getSigners();
   console.log("Deploying contracts with the account:", deployer.address);
   
   // 3. Get an instance of DelegationDAO
   const delegationDao = await ethers.getContractFactory("DelegationDAO");
   
   // 4. Deploy the contract specifying two params: the desired collator to delegate
   // to and the address of the deployer (synonymous with initial DAO admin)
   const deployedDao = await delegationDao.deploy(targetCollator, deployer.address);
   console.log("DAO address:", deployedDao.address);
   
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
```

You can now deploy `DelegationDAO.sol` using the `run` command and specifying `moonbeam` as the network:

```
npx hardhat run --network moonbeam scripts/deploy.js
```

If you're using another Moonbeam network, make sure that you specify the correct network. The network name needs to match how it's defined in the `hardhat.config.js`.

After a few seconds, the contract is deployed, and you should see the address in the terminal.

![How to Deploy a Contract with HardHat Deployment script](/images/tutorials/hardhat/deploy-staking-dao-to-moonbeam-new.png)

Congratulations, your contract is live on Moonbeam! Save the address, as you will use it to interact with this contract instance in the next step.

## Verifying Contracts on Moonbeam {: #verifying-contracts-on-moonbeam }

In this section, we'll be verifying the contract that was just deployed on Moonbeam. Before beginning the contract verification process, you'll need to [acquire a Moonscan API Key](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}. Note that Moonbeam and Moonbase Alpha use the same [Moonbeam Moonscan](https://moonscan.io/){target=_blank} API key, whereas you'll need a distinct API key for [Moonriver](https://moonriver.moonscan.io/){target=_blank}. 

Double check that your `secrets.json` file includes your API key for [Moonbeam Moonscan](https://moonscan.io/){target=_blank}. 

![Add Moonscan API Key to Secret.json](/images/tutorials/hardhat/secrets-json.png)

To verify the contract, you will run the `verify` command and pass in the network where the `DelegationDao` contract is deployed, the address of the contract, and the two constructor arguments that you specified in your `deploy.js` file, namely, the address of the target collator and the address you deployed the smart contract with (sourced from your `secrets.json` file). Remember that the target collator of the stakingDAO on Moonbeam is different from the target collator of the stakingDAO on Moonbase Alpha. 

```
npx hardhat verify --network moonbeam <CONTRACT-ADDRESS> "0x1C86E56007FCBF759348dcF0479596a9857Ba105" "DEPLOYER-ADDRESS"
```

In your terminal you should see the source code for your contract was successfully submitted for verification. If the verification was successful, you should see **Successfully verified contract** and there will be a link to the contract code on [Moonbeam Moonscan](https://moonscan.io/){target=_blank}. If the plugin returns an error, double check that your API key is configured correctly and that you have specified all necessary parameters in the verification command. You can refer to the [guide to the Hardhat Etherscan plugin](/builders/build/eth-api/verify-contracts/etherscan-plugins/){target=_blank} for more information.

![Successful verification using hardhat-etherscan plugin](/images/tutorials/hardhat/verify-staking-dao-on-moonbeam.png)

And that's it! We covered a lot of ground in this tutorial but there's more resources available if you'd like to go deeper, including the following:

- [Hardhat guide to Testing Contracts](https://hardhat.org/hardhat-runner/docs/guides/test-contracts){target=_blank}
- [Writing tasks and scripts](https://hardhat.org/hardhat-runner/docs/guides/tasks-and-scripts){target=_blank}