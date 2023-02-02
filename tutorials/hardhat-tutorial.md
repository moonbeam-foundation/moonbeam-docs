---
title: Hardhat Developer Workflow
description: In this guide, we'll be doing a comprehensive, intermediate-level introduction to the Hardhat development environment.
---

# Hardhat Developer Workflow

![Banner Image](/images/tutorials/hardhat/hardhat-banner.png)
_January 16, 2023 | by Kevin Neilson & Erin Shaben_


## Introduction {: #introduction } 

In this tutorial, we'll walk through the [Hardhat development environment](https://hardhat.org/){target=_blank} in the context of launching a [pooled StakingDAO contract](https://github.com/PureStake/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank}. We'll walk through the typical developer workflow in detail, including compilation, deployment, verification, and more. If this is your first time exploring Hardhat, you may wish to start with [this introduction to Hardhat](/builders/build/eth-api/dev-env/hardhat/){target=_blank}. 

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

The smart contract featured in this tutorial is more complex than the one in the [Introduction to Hardhat](/builders/build/eth-api/dev-env/hardhat/){target=_blank} but the nature of the contract means it's perfect to demonstrate some of the advanced capabilities of Hardhat. [DelegationDAO.sol](https://github.com/PureStake/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank} is a pooled staking DAO that uses the [Staking Precompile](/builders/pallets-precompiles/precompiles/staking/){target=_blank} autonomously delegate to a collator when it reaches a determined threshold. Pooled staking contracts such as [DelegationDAO.sol](https://github.com/PureStake/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank} allow delegators with less than the protocol minimum bond to join together to delegate their pooled funds and earn a share of staking rewards. 

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

1. Copy and paste the contents of [DelegationDAO.sol](https://github.com/PureStake/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank} into `DelegationDAO.sol` 
2. You'll also need to fetch a copy of [StakingInterface.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/parachain-staking/StakingInterface.sol){target=_blank} and copy and paste it into a file named `StakingInterface.sol` also within the same `contracts` directory 
3. DelegationDAO.sol relies on a couple of standard OpenZeppelin contracts. Add the library by running ```npm install @openzeppelin/contracts```

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

Congratulations! You are now ready for deployment!

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
2. Specify the deployer address as the admin of the DAO. It's important that the deployer be the admin of the DAO to ensure later tests work as expected
3. Create a local instance of the contract with the `getContractFactory` method
4. Use the `deploy` method that exists within this instance to instantiate the smart contract
5. Once deployed, you can fetch the address of the contract using the contract instance


When all is said and done your deployment script should look similar to the following: 

```javascript
// scripts/deploy.js

const targetCollator = "{{ networks.moonbase.staking.candidates.address1 }}"

async function main() {

   const [deployer] = await ethers.getSigners();
   console.log("Deploying contracts with the account:", deployer.address);

   const delegationDao = await ethers.getContractFactory("DelegationDAO");
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
npx hardhat run --network moonbaseAlpha scripts/deploy.js
```

If you're using another Moonbeam network, make sure that you specify the correct network. The network name needs to match how it's defined in the `hardhat.config.js`.

After a few seconds, the contract is deployed, and you should see the address in the terminal.

![Hardhat DelegationDAO Deploy](/images/tutorials/hardhat/hardhat2.png)

Congratulations, your contract is live! Save the address, as you will use it to interact with this contract instance in the next step.

## Contract Verification {: #contract-verification }

Contract verification is an essential step of any developer's workflow, particularly in the theoretical example of this staking DAO. Potential participants in the DAO need to be assured that the smart contract works as intended - and verifying the contract allows anyone to observe and analyze the deployed smart contract. 

Before beginning the contract verification process, you'll need to [acquire a Moonscan API Key](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}. Note that Moonbeam and Moonbase Alpha use the same [Moonbeam Moonscan](https://moonscan.io/){target=_blank} API key, whereas you'll need a distinct API key for [Moonriver](https://moonriver.moonscan.io/){target=_blank}. 

--8<-- 'text/hardhat/using-the-hardhat-etherscan-plugin.md'

To verify the contract, you will run the `verify` command and pass in the network where the `DelegationDao` contract is deployed, the address of the contract, and the two constructor arguments that you specified in your `deploy.js` file, namely, the address of the target collator and the address you deployed the smart contract with (sourced from your `secrets.json` file).

```
npx hardhat verify --network moonbaseAlpha <CONTRACT-ADDRESS> "{{ networks.moonbase.staking.candidates.address1 }}" "DEPLOYER-ADDRESS"
```

In your terminal you should see the source code for your contract was successfully submitted for verification. If the verification was successful, you should see **Successfully verified contract** and there will be a link to the contract code on [Moonscan for Moonbase Alpha](https://moonbase.moonscan.io/){target=_blank}. If the plugin returns an error, double check that your [API key is configured correctly and that you have specified all necessary parameters in the verification command](/builders/build/eth-api/verify-contracts/etherscan-plugins/){target=_blank}.

![Successful verification using hardhat-etherscan plugin](/images/tutorials/hardhat/hardhat3.png)

## Testing {: #testing }

A robust smart contract development workflow is incomplete without a testing suite. Hardhat has a number of tools that make it easy to write and run tests. In this section, you'll learn the basics of testing your smart contracts and some more advanced techniques such as using fixtures. 

Hardhat tests are typically written with Mocha and Chai. [Mocha](https://mochajs.org/){target=_blank} is a Javascript testing framework and [Chai](https://www.chaijs.com/){target=_blank} is a BDD/TDD Javascript assertion library. BDD / TDD stands for behavior and test driven development respectively. Effective BDD / TDD necessitates writing your tests *before* writing your smart contract code. The structure of this tutorial doesn't strictly follow these guidelines, but you may wish to adopt these principles in your development workflow. Hardhat previously recommended the Hardhat Waffle plugin but has since [advised migrating to the Hardhat Toolbox](https://hardhat.org/hardhat-runner/docs/guides/migrating-from-hardhat-waffle){target=_blank}.

### Configuring the Test File {: #configuring-the-test-file }

To get started, create a folder called `tests` and a file named `Dao.js`. Then copy and paste the contents below to set up the initial structure of your test file. Be sure to read the comments as they can clarify the purpose of each line. 

``` javascript
const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-toolbox");

// Import Chai to use its assertion functions here
const { expect } = require("chai");

// Use `loadFixture` to share common setups (or fixtures) between tests
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

// Indicate the collator the DAO wants to delegate to
const targetCollator = "{{ networks.moonbase.staking.candidates.address1 }}";
```

### Using Fixtures {: #using-fixtures }

A fixture is a function that configures the blockchain to a desired state. For example, our initial tests for the staking DAO will be run after the staking DAO has been deployed but before any contributions have been made. When a fixture is loaded for the first time, it is executed as normal to properly configure the state of the chain. When called a second time, the fixture is not executed again but rather the state of the network is reset to the point in time immediately after the fixture was initially executed. In other words, this resets state changes prior to the initial execution of the fixture and saves time.

The first fixture in the test file represents an "empty" stakingDAO but the second fixture will have one member (besides the DAO admin). Fixtures allow you to quickly switch between different states, simplifying and speeding up the testing process. In this tutorial only two fixtures are specified but it's easy to imagine other states you'd like to test, such as a scenario with 100 DAO members or one with multiple admins of the DAO. 

To define the two fixtures, add the following snippet to your test file:

``` javascript
// `describe` is a Mocha function that allows you to organize your tests. All Mocha
// functions are available in the global scope.
//
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.
describe("Dao contract", function () {
  async function deployDaoFixture() {

    // Get the ContractFactory and Signers here.
    const [deployer] = await ethers.getSigners();
    const delegationDao = await ethers.getContractFactory("DelegationDAO");
    
    // To deploy our StakingDao, you need to call delegationDao.deploy() and await
    // its deployed() method, which happens once its transaction has been mined.
    const deployedDao = await delegationDao.deploy(targetCollator, deployer.address);

    await deployedDao.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { deployedDao };
  }

    async function deployDaoFixtureWithMembers() {
    const [deployer, member1] = await ethers.getSigners();

    const delegationDao = await ethers.getContractFactory("DelegationDAO");
    const deployedDao = await delegationDao.deploy(targetCollator, deployer.address);

    await deployedDao.deployed();
    await deployedDao.grant_member(member1.address);

    return { deployedDao};
  }
```

### Writing your First Test Cases {: #writing-your-first-test-cases }

This tutorial deviates from the [test driven development philosophy](https://en.wikipedia.org/wiki/Test-driven_development){target=_blank} of writing your tests prior to your code. A few test cases will be cherry picked for demonstration purposes. 

First, you'll create a subsection called `deployment` to keep the test file organized. This isn't required but may be helpful for organization purposes. Next you'll define your first test case by using the `it` mocha function. A description that clearly indicates what the test is doing is provided as well as indication that the function is async. This first test is simply checking to see that the StakingDAO is correctly storing the address of the target collator.

Next, a fixture is loaded - in this case, the "empty" stakingDAO fixture. Fixtures are easily interchangeable within your test cases. 

```javascript
// You can nest describe calls to create subsections.
describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define each
    // of your tests. It receives the test name, and a callback function.
    //
    // If the callback function is async, Mocha will `await` it.
    it("Should have correct target collator", async function () {
      // We use loadFixture to setup our environment, and then assert that
      // things went well
      const { deployedDao, deployer } = await loadFixture(deployDaoFixture);

      // `expect` receives a value and wraps it in an assertion object. These
      // objects have a lot of utility methods to assert values.
      expect(await deployedDao.target()).to.equal(targetCollator);
});
```

Let's add another test case. When a StakingDAO is launched, it shouldn't have any funds. This test verifies that is indeed the case. Go ahead and add the following test case to your `Dao.js` file:

```javascript
it("should initially have 0 funds in the DAO", async function () {
	const { deployedDao, deployer } = await loadFixture(deployDaoFixture);
	expect(await deployedDao.totalStake()).to.equal(0);
});
```

### Function Reverts {: #function-reverts }

To this point, the two cases implemented have been simple but important. Now, you'll implement a more complex test case that differs in its architecture. In prior examples, you've verified that a function returns an expected value. In this one, you'll be verifying that a function reverts. You'll also change the address of the caller to test an admin-only function. 

In the [StakingDAO contract](https://github.com/PureStake/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank}, only admins are authorized to add new members to the DAO. One could write a test that checks to see if the admin is authorized to add new members but perhaps a more important test is to ensure that *non-admins* can't add new members. To run this test case under a different account, you're going to ask for another address when you call `ethers.getSigners()` and specify the caller in the assertion with `connect(otherAddress)`. Finally, after the function call to be tested you'll append `.to.be.reverted;` to indicate that the test case is successful if the function reverts. And if it doesn't revert it's a failed test! 

```javascript
it("Non-admins should not be able to grant membership", async function () {
	const { deployedDao, deployer } = await loadFixture(deployDaoFixture);
	const [account1, otherAddress] = await ethers.getSigners();
	await expect(deployedDao.connect(otherAddress).grant_member("0x0000000000000000000000000000000000000000")).to.be.reverted;
});
```

### Swapping Fixtures {: #swapping-fixtures }

For this example, you'll load another fixture - the one that has a DAO deployed with a member. Then, you'll check to verify whether that member can call the `check_free_balance()` function of StakingDAO, which has an access modifier such that only members can access it. 

```javascript
it("DAO members should be able to access member only functions", async function () {
	const { deployedDao, deployer } = await loadFixture(deployDaoFixtureWithMembers);
    const [account1, member1] = await ethers.getSigners();
    expect(await deployedDao.connect(member1).check_free_balance()).to.equal(0);
	});
  });
});
```
And that's it! You're now ready to run your tests! Since this is the last test case completing the test file, a series of closing brackets are added to the prior code snippet.  
### Running your Tests {: #running-your-tests }

If you've followed all of the prior sections, your `Dao.js` test file should be all set to go. Otherwise, you can copy the complete snippet below into your `Dao.js` test file. Comments have been removed for code readability, but you can refer to the prior sections for details on each step including comments.

```javascript
const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-toolbox");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const targetCollator = "{{ networks.moonbase.staking.candidates.address1 }}"

describe("Dao contract", function () {
  async function deployDaoFixture() {

    const [deployer] = await ethers.getSigners();
    const delegationDao = await ethers.getContractFactory("DelegationDAO");
    
    const deployedDao = await delegationDao.deploy(targetCollator, deployer.address);
    await deployedDao.deployed();
    return { deployedDao };
  }

  async function deployDaoFixtureWithMembers() {
    const [deployer, member1] = await ethers.getSigners();

    const delegationDao = await ethers.getContractFactory("DelegationDAO");
    const deployedDao = await delegationDao.deploy(targetCollator, deployer.address);

    await deployedDao.deployed();
    await deployedDao.grant_member(member1.address);
    return { deployedDao};
  }

describe("Deployment", function () {
    it("Should have correct target collator", async function () {
      const { deployedDao, deployer } = await loadFixture(deployDaoFixture);
      expect(await deployedDao.target()).to.equal(targetCollator);
});

    it("The DAO should initially have 0 funds in it", async function () {
  	  const { deployedDao, deployer } = await loadFixture(deployDaoFixture);
  	  expect(await deployedDao.totalStake()).to.equal(0);
});

    it("Non-admins should not be able to grant membership", async function () {
  	  const { deployedDao, deployer } = await loadFixture(deployDaoFixture);
  	  const [account1, otherAddress] = await ethers.getSigners();
 	  await expect(deployedDao.connect(otherAddress).grant_member("0x0000000000000000000000000000000000000000")).to.be.reverted;
});

    it("DAO members should be able to access member only functions", async function () {
      const { deployedDao, deployer } = await loadFixture(deployDaoFixtureWithMembers);
      const [account1, member1] = await ethers.getSigners();
      expect(await deployedDao.connect(member1).check_free_balance()).to.equal(0);
    });
  });
});
```

You can run your tests with the following command: 
```npx hardhat test tests/Dao.js```

If everything was set up correctly, you should see output like the following: 

![Hardhat Run Tests](/images/tutorials/hardhat/hardhat4.png)

And that's it! We covered a lot of ground in this tutorial but there's more resources available if you'd like to go deeper, including the following:

- [Hardhat guide to Testing Contracts](https://hardhat.org/hardhat-runner/docs/guides/test-contracts){target=_blank}
- [Writing tasks and scripts](https://hardhat.org/hardhat-runner/docs/guides/tasks-and-scripts){target=_blank}