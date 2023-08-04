---
title: Hardhat Developer Workflow
description: Learn how to develop, test, and deploy smart contracts with Hardhat and how to take your contracts from a local development node to Moonbeam MainNet.
---

# Hardhat Developer Workflow

![Learn about the typical Hardhat Ethereum Developer workflow from start to finish.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-banner.png)

_by Kevin Neilson & Erin Shaben_

## Introduction {: #introduction }

In this tutorial, we'll walk through the [Hardhat development environment](https://hardhat.org/){target=_blank} in the context of launching a [pooled staking DAO contract](https://github.com/moonbeam-foundation/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank}. We'll walk through the typical developer workflow in detail from start to finish.

We'll assemble the components of the staking DAO and compile the necessary contracts. Then, we'll build a test suite with a variety of test cases relevant to our staking DAO, and run it against a local development node. Finally, we'll deploy the staking DAO to both Moonbase Alpha and Moonbeam and verify the contracts via the [Hardhat Etherscan plugin](/builders/build/eth-api/verify-contracts/etherscan-plugins/#using-the-hardhat-etherscan-plugin){target=_blank}. If this is your first time exploring Hardhat, you may wish to start with [the introduction to Hardhat guide](/builders/build/eth-api/dev-env/hardhat/){target=_blank}.

_The information presented herein is for informational purposes only and has been provided by third parties. Moonbeam does not endorse any project listed and described on the Moonbeam docs website (https://docs.moonbeam.network/)._

## Checking Prerequisites {: #checking-prerequisites }

To get started, you will need the following:

 - A Moonbase Alpha account funded with DEV.
  --8<-- 'text/faucet/faucet-list-item.md'
 - A [Moonscan API Key](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}
 - For the [Testing section](#running-your-tests) you'll need to have [a local Moonbeam node up and running](/builders/get-started/networks/moonbeam-dev/){target=_blank}
  -
--8<-- 'text/common/endpoint-examples.md'

## Creating a Hardhat Project {: #creating-a-hardhat-project }

You will need to create a Hardhat project if you don't already have one. You can create one by completing the following steps:

1. Create a directory for your project

    ```bash
    mkdir stakingDAO && cd stakingDAO
    ```

2. Initialize the project which will create a `package.json` file

    ```bash
    npm init -y
    ```

3. Install Hardhat

    ```bash
    npm install hardhat
    ```

4. Create a project

    ```bash
    npx hardhat
    ```

    !!! note
        `npx` is used to run executables installed locally in your project. Although Hardhat can be installed globally, it is recommended to install it locally in each project so that you can control the version on a project by project basis.

5. A menu will appear which will allow you to create a new project or use a sample project. For this example, you can choose **Create an empty hardhat.config.js**

![Create an empty Hardhat project.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-1.png)

This will create a Hardhat config file (`hardhat.config.js`) in your project directory.

## Add Smart Contracts {: #add-smart-contracts }

The smart contract featured in this tutorial is more complex than the one in the [Introduction to Hardhat](/builders/build/eth-api/dev-env/hardhat/){target=_blank} but the nature of the contract means it's perfect to demonstrate some of the advanced capabilities of Hardhat. [`DelegationDAO.sol`](https://github.com/moonbeam-foundation/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank} is a pooled staking DAO that uses [`StakingInterface.sol`](/builders/pallets-precompiles/precompiles/staking/){target=_blank} to autonomously delegate to a [collator](/learn/platform/glossary/#collators){target=_blank} when it reaches a determined threshold. Pooled staking contracts such as [`DelegationDAO.sol`](https://github.com/moonbeam-foundation/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank} allow delegators with less than the protocol minimum bond to join together to delegate their pooled funds and earn a share of staking rewards.

!!! note
    `DelegationDAO.sol` is unreviewed and unaudited. It is designed only for demonstration purposes and not intended for production use. It may contain bugs or logic errors that could result in loss of funds.

To get started, take the following steps:

1. Create a `contracts` directory to hold your project's smart contracts

    ```bash
    mkdir contracts
    ```

2. Create a new file called `DelegationDAO.sol`

    ```bash
    touch contracts/DelegationDAO.sol
    ```

3. Copy and paste the contents of [DelegationDAO.sol](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam-intro-course-resources/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank} into `DelegationDAO.sol`
4. Create a new file called `StakingInterface.sol` in the `contracts` directory

    ```bash
    touch contracts/StakingInterface.sol
    ```

5. Copy and paste the contents of [StakingInterface.sol](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam/master/precompiles/parachain-staking/StakingInterface.sol){target=_blank} into `StakingInterface.sol`
6. `DelegationDAO.sol` relies on a couple of standard [OpenZeppelin](https://www.openzeppelin.com/){target=_blank} contracts. Add the library with the following command:

    ```bash
    npm install @openzeppelin/contracts
    ```

## Hardhat Configuration File {: #hardhat-configuration-file }

Before you can deploy the contract to Moonbase Alpha, you'll need to modify the Hardhat configuration file and create a secure file to store your private keys and your [Moonscan API key](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank} in.

You can create a `secrets.json` file to store your private keys by running:

```bash
touch secrets.json
```

Then add your private keys for your two accounts on Moonbase Alpha. Since some of the testing will be done on a development node, you'll also need to add the private keys of two of the prefunded development node accounts, which for this example, we can use Alice and Bob. In addition, you'll add your Moonscan API key, which can be used for both Moonbase Alpha and Moonbeam.

!!! note
    Any real funds sent to the Alice and Bob development accounts will be lost immediately. Take precautions to never send MainNet funds to exposed development accounts.

```json
{
    "privateKey": "YOUR-PRIVATE-KEY-HERE",
    "privateKey2": "YOUR-SECOND-PRIVATE-KEY-HERE",
    "alicePrivateKey": "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133",
    "bobPrivateKey": "0x8075991ce870b93a8870eca0c0f91913d12f47948ca0fd25b49c6fa7cdbeee8b",
    "moonbeamMoonscanAPIKey": "YOUR-MOONSCAN-API-KEY-HERE"
}
```

If you have separate accounts for Moonbeam MainNet, you can add them as separate variables or update the `privateKey` and `privateKey2` variables once you're ready to deploy to MainNet.

Your `secrets.json` should resemble the following:

![Add Moonscan API Key to secrets.json.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-2.png)

Make sure to add the file to your project's `.gitignore`, and to never reveal your private key.

!!! remember
    Please always manage your private keys with a designated secret manager or similar service. Never save or commit your private keys inside your repositories.

When setting up the `hardhat.config.js` file, we'll need to import a few plugins that we'll use throughout this guide. So to get started, we'll need the [Hardhat Toolbox plugin](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-toolbox){target=_blank}, which conveniently bundles together the packages that we'll need later on for testing. We'll also need the [Hardhat Etherscan plugin](/builders/build/eth-api/verify-contracts/etherscan-plugins/#using-the-hardhat-etherscan-plugin){target=_blank}, which we'll use to verify our contracts. Both of these plugins can be installed with the following command:

```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox @nomiclabs/hardhat-etherscan
```

If you're curious about additional Hardhat plugins, here is [a complete list of official Hardhat plugins](https://hardhat.org/hardhat-runner/plugins){target=_blank}.

--8<-- 'text/hardhat/hardhat-configuration-file.md'
5. Import your [Moonscan API key](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}, which is required for the verification steps we'll be taking later in this tutorial

```js
// 1. Import the Ethers, Hardhat Toolbox, and Etherscan plugins 
// required to interact with our contracts
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require('@nomiclabs/hardhat-ethers');

// 2. Import your private key from your pre-funded Moonbase Alpha testing 
// account and your Moonscan API key
const { privateKey, privateKey2, moonbeamMoonscanAPIKey, alicePrivateKey, bobPrivateKey } = require('./secrets.json');

module.exports = {
  // 3. Specify the Solidity version
  solidity: "0.8.17",

  networks: {
    // 4. Add the Moonbase Alpha network specification
    moonbase: {
      url: '{{ networks.moonbase.rpc_url }}',
      chainId: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }} in hex
      accounts: [privateKey, privateKey2]
    },
    dev: {
      url: 'http://127.0.0.1:9933',
      chainId: 1281, // {{ networks.development.hex_chain_id }} in hex
      accounts: [alicePrivateKey, bobPrivateKey]
    },
    moonbeam: {
      url: '{{ networks.moonbeam.public_rpc_url }}', // Or insert your own RPC URL here
      chainId: 1284, // {{ networks.moonbeam.hex_chain_id }} in hex
      accounts: [privateKey, privateKey2]
    },
  },
  // 5. Set up your Moonscan API key for contract verification
  // Moonbeam and Moonbase Alpha Moonscan use the same API key
  etherscan: {
    apiKey: {
      moonbaseAlpha: moonbeamMoonscanAPIKey, // Moonbase Moonscan API Key
      moonbeam: moonbeamMoonscanAPIKey, // Moonbeam Moonscan API Key    
    }
  }
};
```

!!! note
    With the release of [Solidity v0.8.20](https://github.com/ethereum/solidity/releases/tag/v0.8.20){target=_blank}, support for the Shanghai hard fork has been introduced, which includes `PUSH0` opcodes in the generated bytecode. Support for the `PUSH0` opcode on Moonbeam hasn't been rolled out yet. As such, if you'd like to use Solidity v0.8.20, you'll need to update the `solidity` config to use the London compiler:

    ```js
    solidity: {
      version: '0.8.20',
      settings: {
        evmVersion: 'london',
      },
    },
    ```

    If you attempt to use the default compiler of Solidity v0.8.20, you will see the following error:

    ```
    ProviderError: evm error: InvalidCode(Opcode(95))
    ```

You can modify the `hardhat.config.js` file to use any of the Moonbeam networks:

=== "Moonbeam"

    ```js
    moonbeam: {
        url: '{{ networks.moonbeam.rpc_url }}', // Insert your RPC URL here
        chainId: {{ networks.moonbeam.chain_id }}, // (hex: {{ networks.moonbeam.hex_chain_id }})
        accounts: [privateKey]
      },
    ```

=== "Moonriver"

    ```js
    moonriver: {
        url: '{{ networks.moonriver.rpc_url }}', // Insert your RPC URL here
        chainId: {{ networks.moonriver.chain_id }}, // (hex: {{ networks.moonriver.hex_chain_id }})
        accounts: [privateKey]
      },
    ```

=== "Moonbase Alpha"

    ```js
    moonbase: {
        url: '{{ networks.moonbase.rpc_url }}',
        chainId: {{ networks.moonbase.chain_id }}, // (hex: {{ networks.moonbase.hex_chain_id }})
        accounts: [privateKey]
      },
    ```

=== "Moonbeam Dev Node"

    ```js
    dev: {
        url: '{{ networks.development.rpc_url }}',
        chainId: {{ networks.development.chain_id }}, // (hex: {{ networks.development.hex_chain_id }})
        accounts: [privateKey]
      },
    ```

You're now ready to move on to compilation and testing.

## Compiling the Contract {: #compiling-the-contract }

To compile the contract you can simply run:

```bash
npx hardhat compile
```

![Learn how to compile your Solidity contracts with Hardhat.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-3.png)

After compilation, an `artifacts` directory is created: it holds the bytecode and metadata of the contract, which are `.json` files. It’s a good idea to add this directory to your `.gitignore`.

## Testing {: #testing }

A robust smart contract development workflow is incomplete without a testing suite. Hardhat has a number of tools that make it easy to write and run tests. In this section, you'll learn the basics of testing your smart contracts and some more advanced techniques.

Hardhat tests are typically written with Mocha and Chai. [Mocha](https://mochajs.org/){target=_blank} is a JavaScript testing framework and [Chai](https://www.chaijs.com/){target=_blank} is a BDD/TDD JavaScript assertion library. BDD/TDD stands for behavior and test driven development respectively. Effective BDD/TDD necessitates writing your tests *before* writing your smart contract code. The structure of this tutorial doesn't strictly follow these guidelines, but you may wish to adopt these principles in your development workflow. Hardhat recommends using [Hardhat Toolbox](https://hardhat.org/hardhat-runner/docs/guides/migrating-from-hardhat-waffle){target=_blank}, a plugin that bundles everything you need to get started with Hardhat, including Mocha and Chai.

Because we will initially be running our tests on a local Moonbeam node, we need to specify Alice's address as the address of our target collator (Alice's account is the only collator for a local development node):

```
0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
```

If instead you prefer to run your tests against Moonbase Alpha, you can choose the below collator, or [any other collator on Moonbase Alpha](https://apps.moonbeam.network/moonbase-alpha/staking){target=_blank} you would like the DAO to delegate to:

```
{{ networks.moonbase.staking.candidates.address1 }}
```

### Configuring the Test File {: #configuring-the-test-file }

To set up your test file, take the following steps:

1. Create a `tests` directory

    ```bash
    mkdir tests
    ```

2. Create a new file called `Dao.js`

    ```bash
    touch tests/Dao.js
    ```

3. Then copy and paste the contents below to set up the initial structure of your test file. Be sure to read the comments as they can clarify the purpose of each line

    ``` javascript
    // Import Hardhat and Hardhat Toolbox
    const { ethers } = require("hardhat");
    require("@nomicfoundation/hardhat-toolbox");

    // Import Chai to use its assertion functions here
    const { expect } = require("chai");

    // Indicate Alice's address as the target collator on local development node
    const targetCollator = "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac";
    ```

### Deploying a Staking DAO for Testing {: #deploying-a-staking-dao-for-testing }

Before we can run any test cases we'll need to launch a staking DAO with an initial configuration. Our setup here is relatively simple - we'll be deploying a staking DAO with a single administrator (the deployer) and then adding a new member to the DAO. This simple setup is perfect for demonstration purposes, but it's easy to imagine more complex configurations you'd like to test, such as a scenario with 100 DAO members or one with multiple admins of the DAO.

Mocha's `describe` function enables you to organize your tests. Multiple `describe` functions can be nested together. It's entirely optional but can be useful especially in complex projects with a large number of test cases. You can read more about constructing tests and [getting started with Mocha](https://mochajs.org/#getting-started){target=_blank} on the Mocha docs site.

We'll define a function called `deployDao` that will contain the setup steps for our staking DAO. To configure your test file, add the following snippet:

```javascript
// The describe function receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function
describe("Dao contract", function () {
  async function deployDao() {
    // Get the contract factory and signers here
    const [deployer, member1] = await ethers.getSigners();
    const delegationDao = await ethers.getContractFactory("DelegationDAO");
    
    // Deploy the staking DAO and wait for the deployment transaction to be confirmed
    const deployedDao = await delegationDao.deploy(targetCollator, deployer.address);
    await deployedDao.deployed();

    // Add a new member to the DAO
    await deployedDao.grant_member(member1.address);

    // Return the deployed DAO to allow the tests to access and interact with it
    return { deployedDao };
  }

  // The test cases should be added here

});
```

### Writing your First Test Cases {: #writing-your-first-test-cases }

First, you'll create a subsection called `Deployment` to keep the test file organized. This will be nested within the `Dao contract` describe function. Next you'll define your first test case by using the `it` Mocha function. This first test is simply checking to see that the staking DAO is correctly storing the address of the target collator.

Go ahead and add the below snippet to the end of your `Dao contract` function.

```javascript
// You can nest calls to create subsections
describe("Deployment", function () {
  // Mocha's it function is used to define each of your tests.
  // It receives the test name, and a callback function.
  // If the callback function is async, Mocha will await it
  it("should store the correct target collator in the DAO", async function () {
    
    // Set up our test environment by calling deployDao
    const { deployedDao } = await deployDao();

    // The expect function receives a value and wraps it in an assertion object.
    // This test will pass if the DAO stored the correct target collator
    expect(await deployedDao.target()).to.equal(targetCollator);
  });

  // The following test cases should be added here
});
```

Now, add another test case. When a staking DAO is launched, it shouldn't have any funds. This test verifies that is indeed the case. Go ahead and add the following test case to your `Dao.js` file:

```javascript
it("should initially have 0 funds in the DAO", async function () {
  const { deployedDao } = await deployDao();

  // This test will pass if the DAO has no funds as expected before any contributions
  expect(await deployedDao.totalStake()).to.equal(0);
});
```

### Function Reverts {: #function-reverts }

Now, you'll implement a more complex test case with a slightly different architecture. In prior examples, you've verified that a function returns an expected value. In this one, you'll be verifying that a function reverts. You'll also change the address of the caller to test an admin-only function.

In the [staking DAO contract](https://github.com/moonbeam-foundation/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=_blank}, only admins are authorized to add new members to the DAO. One could write a test that checks to see if the admin is authorized to add new members but perhaps a more important test is to ensure that *non-admins* can't add new members. To run this test case under a different account, you're going to ask for another address when you call `ethers.getSigners()` and specify the caller in the assertion with `connect(member1)`. Finally, after the function call you'll append `.to.be.reverted` to indicate that the test case is successful if the function reverts. And if it doesn't revert it's a failed test!

```javascript
it("should not allow non-admins to grant membership", async function () {
  const { deployedDao } = await deployDao();

  // We ask ethers for two accounts back this time
  const [deployer, member1] = await ethers.getSigners();

  // We use connect to call grant_member from member1's account instead of admin.
  // This test will succeed if the function call reverts and fails if the call succeeds
  await expect(deployedDao.connect(member1).grant_member("0x0000000000000000000000000000000000000000")).to.be.reverted;
});
```

### Signing Transactions from Other Accounts {: #signing-transactions-from-other-accounts }

For this example, you'll check to verify whether the newly added DAO member can call the `check_free_balance()` function of staking DAO, which has an access modifier such that only members can access it.

```javascript
it("should only allow members to access member-only functions", async function () {
  const { deployedDao } = await deployDao();

  // We ask ethers for two accounts back this time
  const [deployer, member1] = await ethers.getSigners();

  // This test will succeed if the DAO member can call the member-only function.
  // We use connect here to call the function from the account of the new member
  expect(await deployedDao.connect(member1).check_free_balance()).to.equal(0);
});
```

And that's it! You're now ready to run your tests!

### Running your Tests {: #running-your-tests }

If you've followed all of the prior sections, your [`Dao.js`](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam-intro-course-resources/main/delegation-dao-lesson-one/Dao.js){target=_blank} test file should be all set to go. Otherwise, you can copy the [complete snippet from GitHub](https://github.com/moonbeam-foundation/moonbeam-docs/blob/master/.snippets/code/hardhat/dao-js-test-file.js){target=_blank} into your `Dao.js` test file.

Since our test cases encompass mostly configuration and setup of the staking DAO and don't involve actual delegation actions, we'll be running our tests on a Moonbeam development node (local node). Remember that Alice (`0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`) is the only collator on a local development node. You can use the flag `--network moonbase` to run the tests using Moonbase Alpha. In that case, be sure that your deployer address is sufficiently funded with DEV tokens.

!!! challenge
    Try to create an additional test case that verifies the staking DAO successfully delegates to a collator once `minDelegationStk` is met. You'll need to test this on Moonbase Alpha rather than a local development node.

First, make sure that your local Moonbeam node is running by following the [instructions for launching a local development node](/builders/get-started/networks/moonbeam-dev/){target=_blank}. Take precautions if you import the Alice and Bob private keys into your `secrets.json` file because you could inadvertently send real funds to those accounts, which would result in a loss of those funds.  

You can run your tests with the following command:

```bash
npx hardhat test --network dev tests/Dao.js
```

If everything was set up correctly, you should see output like the following:

![Run your test suite of test cases with Hardhat.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-4.png)

## Deploying to Moonbase Alpha {: #deploying-to-moonbase-alpha }

In the following steps, we'll be deploying the `DelegationDAO` to the Moonbase Alpha TestNet. Before deploying to Moonbase Alpha or Moonbeam, double check you're not using the Alice and Bob accounts, which should only be used on a local development node.

As a side note, `DelegationDAO` relies on [`StakingInterface.sol`](/builders/pallets-precompiles/precompiles/staking/){target=_blank}, which is a Substrate-based offering unique to Moonbeam networks. The Hardhat Network and forked networks are simulated EVM environments which do not include the Substrate-based precompiles like `StakingInterface.sol`. Therefore, `DelegationDAO` will not work properly if deployed to the local default Hardhat Network or a [forked network](/builders/build/eth-api/dev-env/hardhat/#forking-moonbeam){target=_blank}.

To deploy `DelegationDAO.sol`, you can write a simple script. You can create a new directory for the script and name it `scripts`:

```bash
mkdir scripts
```

Then add a new file to it called `deploy.js`:

```bash
touch scripts/deploy.js
```

Next, you need to write your deployment script which can be done using `ethers`. Because you'll be running it with Hardhat, you don't need to import any libraries.

To get started, take the following steps:

1. Specify the address of the active collator the DAO intends to delegate to. In this case, we've specified the address of the PS-1 Collator (note: this is different from the address of the Alice collator on a local development node)
2. Specify the deployer address as the admin of the DAO. It's important that the deployer be the admin of the DAO to ensure later tests work as expected
3. Create a local instance of the contract with the `getContractFactory` method
4. Use the `deploy` method that exists within this instance to instantiate the smart contract
5. Once deployed, you can fetch the address of the contract using the contract instance

When all is said and done your deployment script should look similar to the following:

```javascript
// 1. The PS-1 collator on Moonbase Alpha is chosen as the DAO's target
const targetCollator = "{{ networks.moonbase.staking.candidates.address1 }}"

async function main() {
  // 2. Get the address of the deployer to later be set as the admin of the DAO
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // 3. Get an instance of DelegationDAO
  const delegationDao = await ethers.getContractFactory("DelegationDAO");
  
  // 4. Deploy the contract specifying two params: the desired collator to
  // delegate to and the address of the deployer (the initial DAO admin)
  const deployedDao = await delegationDao.deploy(targetCollator, deployer.address);
  
  // 5. Print out the address of the deployed staking DAO contract
  console.log("DAO address:", deployedDao.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Make sure you've funded your accounts with Moonbase Alpha DEV tokens. You can now deploy `DelegationDAO.sol` using the `run` command and specifying `moonbase` as the network (as configured in the `hardhat.config.js` file):

```
npx hardhat run --network moonbase scripts/deploy.js
```

After a few seconds, the contract is deployed, and you should see the address in the terminal.

![Deploy a Contract to Moonbase Alpha with Hardhat.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-5.png)

Congratulations, your contract is live on Moonbase Alpha! Save the address, as you will use it to interact with this contract instance in the next step.

## Verifying Contracts on Moonbase Alpha {: #verifying-contracts-on-moonbase-alpha }

Contract verification is an essential step of any developer's workflow, particularly in the theoretical example of this staking DAO. Potential participants in the DAO need to be assured that the smart contract works as intended - and verifying the contract allows anyone to observe and analyze the deployed smart contract.

While it's possible to verify smart contracts on the [Moonscan website](https://moonscan.io/verifyContract){target=_blank}, the Hardhat Etherscan plugin enables us to verify our staking DAO in a faster and easier manner. It's not an exaggeration to say that the plugin dramatically simplifies the contract verification process, especially for projects that include multiple Solidity files or libraries.

Before beginning the contract verification process, you'll need to [acquire a Moonscan API Key](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}. Note that Moonbeam and Moonbase Alpha use the same [Moonbeam Moonscan](https://moonscan.io/){target=_blank} API key, whereas you'll need a distinct API key for [Moonriver](https://moonriver.moonscan.io/){target=_blank}.

Double check that your `secrets.json` file includes your API key for [Moonbeam Moonscan](https://moonscan.io/){target=_blank}.

![Add Moonscan API Key to Secret.json.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-2.png)

To verify the contract, you will run the `verify` command and pass in the network where the `DelegationDao` contract is deployed, the address of the contract, and the two constructor arguments that you specified in your `deploy.js` file, namely, the address of the target collator and the address you deployed the smart contract with (sourced from your `secrets.json` file).

```bash
npx hardhat verify --network moonbase <CONTRACT-ADDRESS> "{{ networks.moonbase.staking.candidates.address1 }}" "DEPLOYER-ADDRESS"
```

!!! note
    If you're deploying `DelegationDAO.sol` verbatim without any changes, you may get an `Already Verified` error because Moonscan automatically recognizes and verifies smart contracts that have matching bytecode. Your contract will still show as verified, so there is nothing else you need to do. However, if you'd prefer to verify your own `DelegationDAO.sol`, you can make a small change to the contract (such as changing a comment) and repeating the compilation, deployment and verification steps.

In your terminal you should see the source code for your contract was successfully submitted for verification. If the verification was successful, you should see **Successfully verified contract** and there will be a link to the contract code on [Moonscan for Moonbase Alpha](https://moonbase.moonscan.io/){target=_blank}. If the plugin returns an error, double check that your API key is configured correctly and that you have specified all necessary parameters in the verification command. You can refer to the [guide to the Hardhat Etherscan plugin](/builders/build/eth-api/verify-contracts/etherscan-plugins/){target=_blank} for more information.

![Verify contracts on Moonbase Alpha using the Hardhat Etherscan plugin.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-6.png)

## Deploying to Production on Moonbeam Mainnet {: #deploying-to-production-on-moonbeam-mainnet }

!!! note
    `DelegationDAO.sol` is unreviewed and unaudited. It is designed only for demonstration purposes and not intended for production use. It may contain bugs or logic errors that could result in loss of funds.

In the following steps, we'll be deploying the `DelegationDAO` contract to the Moonbeam MainNet network. Remember to add the Moonbeam network to your [`hardhat.config.js`](#hardhat-configuration-file) and update your `secrets.json` file with the private keys of your accounts on Moonbeam if you haven't done so already. Before deploying `DelegationDAO` to Moonbeam, we need to change the address of the target collator, since our target collator on Moonbase Alpha does not exist on Moonbeam. Head to your deploy script and change the target collator to `0x1C86E56007FCBF759348dcF0479596a9857Ba105` or [another Moonbeam collator](https://apps.moonbeam.network/moonbeam/staking){target=_blank} of your choice. Your `deploy.js` script should thus look like the following:

```javascript
// 1. The moonbeam-foundation-03 collator on Moonbeam is chosen as the DAO's target
const targetCollator = "0x1C86E56007FCBF759348dcF0479596a9857Ba105"

async function main() {
  // 2. Get the address of the deployer to later be set as the admin of the DAO
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

```bash
npx hardhat run --network moonbeam scripts/deploy.js
```

If you're using another Moonbeam network, make sure that you specify the correct network. The network name needs to match how it's defined in the `hardhat.config.js`.

After a few seconds, the contract is deployed, and you should see the address in the terminal.

![Deploy a Contract to Moonbeam with Hardhat.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-7.png)

Congratulations, your contract is live on Moonbeam! Save the address, as you will use it to interact with this contract instance in the next step.

## Verifying Contracts on Moonbeam {: #verifying-contracts-on-moonbeam }

In this section, we'll be verifying the contract that was just deployed on Moonbeam. Before beginning the contract verification process, you'll need to [acquire a Moonscan API Key](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank}. Note that Moonbeam and Moonbase Alpha use the same [Moonbeam Moonscan](https://moonscan.io/){target=_blank} API key, whereas you'll need a distinct API key for [Moonriver](https://moonriver.moonscan.io/){target=_blank}.

Double check that your `secrets.json` file includes your API key for [Moonbeam Moonscan](https://moonscan.io/){target=_blank}.

![Add Moonscan API Key to Secret.json.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-2.png)

To verify the contract, you will run the `verify` command and pass in the network where the `DelegationDao` contract is deployed, the address of the contract, and the two constructor arguments that you specified in your `deploy.js` file, namely, the address of the target collator and the address you deployed the smart contract with (sourced from your `secrets.json` file). Remember that the target collator of the staking DAO on Moonbeam is different from the target collator of the staking DAO on Moonbase Alpha.

```bash
npx hardhat verify --network moonbeam <CONTRACT-ADDRESS> "0x1C86E56007FCBF759348dcF0479596a9857Ba105" "DEPLOYER-ADDRESS"
```

!!! note
    If you're deploying `DelegationDAO.sol` verbatim without any changes, you may get an `Already Verified` error because Moonscan automatically recognizes and verifies smart contracts that have matching bytecode. Your contract will still show as verified, so there is nothing else you need to do. However, if you'd prefer to verify your own `DelegationDAO.sol`, you can make a small change to the contract (such as changing a comment) and repeating the compilation, deployment, and verification steps.

In your terminal you should see the source code for your contract was successfully submitted for verification. If the verification was successful, you should see **Successfully verified contract** and there will be a link to the contract code on [Moonbeam Moonscan](https://moonscan.io/){target=_blank}. If the plugin returns an error, double check that your API key is configured correctly and that you have specified all necessary parameters in the verification command. You can refer to the [guide to the Hardhat Etherscan plugin](/builders/build/eth-api/verify-contracts/etherscan-plugins/){target=_blank} for more information.

![Verify contracts on Moonbeam using Hardhat Etherscan plugin.](/images/tutorials/eth-api/hardhat-start-to-end/hardhat-8.png)

And that's it! We covered a lot of ground in this tutorial but there's more resources available if you'd like to go deeper, including the following:

- [Hardhat guide to Testing Contracts](https://hardhat.org/hardhat-runner/docs/guides/test-contracts){target=_blank}
- [Writing tasks and scripts](https://hardhat.org/hardhat-runner/docs/guides/tasks-and-scripts){target=_blank}

--8<-- 'text/disclaimers/educational-tutorial.md'

--8<-- 'text/disclaimers/third-party-content.md'
