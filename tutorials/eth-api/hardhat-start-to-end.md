---
title: Hardhat Developer Workflow
description: Learn how to develop, test, and deploy smart contracts with Hardhat and how to take your contracts from a local development node to Moonbeam MainNet.
categories: Tutorials, Dev Environments
---

# Hardhat Developer Workflow

_by Kevin Neilson & Erin Shaben_

## Introduction {: #introduction }

In this tutorial, we'll walk through the [Hardhat development environment](https://hardhat.org){target=\_blank} in the context of launching a [pooled staking DAO contract](https://github.com/moonbeam-foundation/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=\_blank}. We'll walk through the typical developer workflow in detail from start to finish.

We'll assemble the components of the staking DAO and compile the necessary contracts. Then, we'll build a test suite with a variety of test cases relevant to our staking DAO, and run it against a local development node. Finally, we'll deploy the staking DAO to both Moonbase Alpha and Moonbeam and verify the contracts via the [Hardhat Etherscan plugin](/builders/ethereum/verify-contracts/etherscan-plugins/#using-the-hardhat-etherscan-plugin){target=\_blank}. If this is your first time exploring Hardhat, you may wish to start with [the introduction to Hardhat guide](/builders/ethereum/dev-env/hardhat/){target=\_blank}.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Checking Prerequisites {: #checking-prerequisites }

To get started, you will need the following:

 - A Moonbase Alpha account funded with DEV.
  --8<-- 'text/_common/faucet/faucet-list-item.md'
 - An [Etherscan API Key](/builders/ethereum/verify-contracts/etherscan-plugins/#generating-an-etherscan-api-key){target=\_blank}
 - For the [Testing section](#running-your-tests), you'll need to have [a local Moonbeam node up and running](/builders/get-started/networks/moonbeam-dev/){target=\_blank}
 - 
  --8<-- 'text/_common/endpoint-examples-list-item.md'

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
    npx hardhat --init
    ```

    !!! note
        `npx` is used to run executables installed locally in your project. Although Hardhat can be installed globally, installing it locally in each project is recommended so that you can control the version on a project-by-project basis.

5. You'll be prompted with a series of questions to set up your project:

    - Choose **Hardhat 3 Beta (recommended for new projects)** rather than Hardhat 2
    - Choose where to initialize the project (default is current directory)
    - Confirm converting to ESM (required for Hardhat v3)
    - Select the type of project to initialize:
        - A TypeScript Hardhat project using Node Test Runner and Viem
        - A TypeScript Hardhat project using Mocha and Ethers.js

    For this example, you can choose either option based on your preference. If you choose the Mocha and Ethers.js option, you'll get a project structure with:
    
    - A sample contract in `contracts/Counter.sol`
    - A test file in `test/Counter.ts`
    - TypeScript configuration
    - Mocha and Ethers.js dependencies

    The project will be set up with all necessary dependencies and configurations for you to start developing.

--8<-- 'code/tutorials/eth-api/hardhat-start-to-end/terminal/hardhat-create.md'


## Add Smart Contracts {: #add-smart-contracts }

The smart contract featured in this tutorial is more complex than the one in the [Introduction to Hardhat](/builders/ethereum/dev-env/hardhat/){target=\_blank} but the nature of the contract makes it well-suited to demonstrate some of the advanced capabilities of Hardhat. [`DelegationDAO.sol`](https://github.com/moonbeam-foundation/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=\_blank} is a pooled staking DAO that uses [`StakingInterface.sol`](/builders/ethereum/precompiles/features/staking/){target=\_blank} to autonomously delegate to a collator when it reaches a determined threshold. Pooled staking contracts such as [`DelegationDAO.sol`](https://github.com/moonbeam-foundation/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=\_blank} allow delegators with less than the protocol minimum bond to join together to delegate their pooled funds and earn a share of staking rewards.

!!! note
    `DelegationDAO.sol` is unreviewed and unaudited. It is designed only for demonstration purposes and not intended for production use. It may contain bugs or logic errors that could result in loss of funds.

To get started, take the following steps:

1. Change to the contracts directory

    ```bash
    cd contracts
    ```

2. Create a new file called `DelegationDAO.sol`

    ```bash
    touch DelegationDAO.sol
    ```

3. Copy and paste the contents of [DelegationDAO.sol](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam-intro-course-resources/main/delegation-dao-lesson-one/DelegationDAO.sol){target=\_blank} into `DelegationDAO.sol`

    ??? code "DelegationDAO.sol"
        ```solidity
        --8<-- 'code/tutorials/eth-api/hardhat-start-to-end/DelegationDAO.sol'
        ```

4. Create a new file called `StakingInterface.sol` in the `contracts` directory

    ```bash
    touch StakingInterface.sol
    ```

5. Copy and paste the contents of [StakingInterface.sol](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam/master/precompiles/parachain-staking/StakingInterface.sol){target=\_blank} into `StakingInterface.sol`

    ??? code "StakingInterface.sol"

        ```solidity
        --8<-- 'code/builders/ethereum/precompiles/features/staking/StakingInterface.sol'
        ```

6. `DelegationDAO.sol` relies on a couple of standard [OpenZeppelin](https://www.openzeppelin.com){target=\_blank} contracts. Add the library with the following command:

    ```bash
    npm install @openzeppelin/contracts
    ```

## Hardhat Configuration File {: #hardhat-configuration-file }

When setting up the `hardhat.config.js` file, we'll need to import a few plugins that we'll use throughout this guide. So to get started, we'll need the [Hardhat Toolbox plugin](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-toolbox){target=\_blank}, which conveniently bundles together Hardhat plugins that can be used to deploy and interact with contracts using Ethers, test contracts with Mocha and Chai, verify contracts with Etherscan, and more. You can run the following command to install the plugin:

```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox 
```

If you're curious about additional Hardhat plugins, here is [a complete list of official Hardhat plugins](https://hardhat.org/hardhat-runner/plugins){target=\_blank}.

Hardhat 3 includes an encrypted secrets manager that makes handling sensitive information like private keys and API keys easier. This ensures you don't have to hardcode secrets in your source code or store them in plain text.

!!! note
    The encrypted secrets manager is only available in Hardhat 3 or higher. You can install the latest version with:

    ```bash
    npm install hardhat
    ```

    For the latest releases and updates, check the [Hardhat releases page](https://github.com/NomicFoundation/hardhat/releases/).

To use encrypted secrets, you'll need to:

1. Install Hardhat (latest version):
```bash
npm install hardhat
```

2. Set up your secrets using the keystore:

=== "Moonbeam"

    ```bash
    npx hardhat keystore set MOONBEAM_RPC_URL
    npx hardhat keystore set MOONBEAM_PRIVATE_KEY
    ```

=== "Moonriver"

    ```bash
    npx hardhat keystore set MOONRIVER_RPC_URL
    npx hardhat keystore set MOONRIVER_PRIVATE_KEY
    ```

=== "Moonbase Alpha"

    ```bash
    npx hardhat keystore set MOONBASE_RPC_URL
    npx hardhat keystore set MOONBASE_PRIVATE_KEY
    ```

=== "Moonbeam Dev Node"

    ```bash
    npx hardhat keystore set DEV_RPC_URL
    npx hardhat keystore set DEV_PRIVATE_KEY
    npx hardhat keystore set ALICE_PRIVATE_KEY
    npx hardhat keystore set BOB_PRIVATE_KEY
    ```

Then, update your configuration file to use the encrypted secrets:

=== "Moonbeam"

    ```js
    module.exports = {
      solidity: '0.8.20',
      networks: {
        moonbeam: {
          type: "http",
          chainType: "generic",
          url: configVariable("MOONBEAM_RPC_URL"),
          chainId: {{ networks.moonbeam.chain_id }}, // (hex: {{ networks.moonbeam.hex_chain_id }}),
          accounts: [configVariable("MOONBEAM_PRIVATE_KEY")],
        },
      },
    };
    ```

=== "Moonriver"

    ```js
    module.exports = {
      solidity: '0.8.20',
      networks: {
        moonriver: {
          type: "http",
          chainType: "generic",
          url: configVariable("MOONRIVER_RPC_URL"),
          chainId: {{ networks.moonriver.chain_id }}, // (hex: {{ networks.moonriver.hex_chain_id }}),
          accounts: [configVariable("MOONRIVER_PRIVATE_KEY")],
        },
      },
    };
    ```

=== "Moonbase Alpha"

    ```js
    module.exports = {
      solidity: '0.8.20',
      networks: {
        moonbase: {
          type: "http",
          chainType: "generic",
          url: configVariable("MOONBASE_RPC_URL"),
          chainId: {{ networks.moonbase.chain_id }}, // (hex: {{ networks.moonbase.hex_chain_id }}),
          accounts: [configVariable("MOONBASE_PRIVATE_KEY")],
        },
      },
    };
    ```

=== "Moonbeam Dev Node"

    ```js
    module.exports = {
      solidity: '0.8.20',
      networks: {
        dev: {
          type: "http",
          chainType: "generic",
          url: configVariable("DEV_RPC_URL"),
          chainId: 1281, // 0x501 in hex
          accounts: [
            configVariable("DEV_PRIVATE_KEY"),
            configVariable("ALICE_PRIVATE_KEY"), // Alice (Alith) account
            configVariable("BOB_PRIVATE_KEY")    // Bob (Baltathar) account
          ],
        },
      },
    };
    ```

For this example, you'll need to add your private keys for your two accounts on Moonbase Alpha. Since some of the testing will be done on a development node, you'll also need to add the private keys of two of the pre-funded development node accounts, which, for this example, we can use Alice and Bob. In addition, you'll add your Etherscan API key, which can be used for both Moonbase Alpha and Moonbeam.

```js
// 1. Import the Hardhat Toolbox plugin
require('@nomicfoundation/hardhat-toolbox');
require('@nomicfoundation/hardhat-ignition-ethers');

module.exports = {
  // 2. Specify the Solidity version
  solidity: '0.8.20',
  networks: {
    // 3. Add the Moonbase Alpha network specification
    moonbase: {
      type: "http",
      chainType: "generic",
      url: configVariable("MOONBASE_RPC_URL"),
      chainId: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }} in hex
      accounts: [configVariable("MOONBASE_PRIVATE_KEY")],
    },
    dev: {
      type: "http",
      chainType: "generic",
      url: configVariable("DEV_RPC_URL"),
      chainId: 1281, // 0x501 in hex
      accounts: [
        configVariable("DEV_PRIVATE_KEY"),
        configVariable("ALICE_PRIVATE_KEY"), // Alice (Alith) account
        configVariable("BOB_PRIVATE_KEY")    // Bob (Baltathar) account
      ],
    },
    moonbeam: {
      type: "http",
      chainType: "generic",
      url: configVariable("MOONBEAM_RPC_URL"),
      chainId: {{ networks.moonbeam.chain_id }}, // {{ networks.moonbeam.hex_chain_id }} in hex
      accounts: [configVariable("MOONBEAM_PRIVATE_KEY")],
    },
  },
  // 4. Set up your Etherscan API key for contract verification
  // Moonbeam and Moonbase Alpha use the same Etherscan API key
  etherscan: {
    apiKey: {
      moonbaseAlpha: configVariable("ETHERSCAN_API_KEY"),
      moonbeam: configVariable("ETHERSCAN_API_KEY"),
    },
  },
};
```

!!! note
    Any real funds sent to the Alice and Bob development accounts will be lost immediately.Take precautions never to send MainNet funds to exposed development accounts. The private keys for these accounts are:
    
    - Alice (Alith): `0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133`
    - Bob (Baltathar): `0x8075991ce870b93a8870eca0c0f91913d12f47948ca0fd25b49c6fa7cdbeee8b`
    
    These accounts should only be used on the local development node and never on Moonbeam MainNet or Moonbase Alpha.

You're now ready to move on to compilation and testing.

## Compiling the Contract {: #compiling-the-contract }

Now that you have your Hardhat project set up with the encrypted secrets manager, you can proceed with compilation and testing. The project comes with a sample contract and test file that you can use to verify your setup.

### Compiling the Contract {: #compiling-the-contract }

To compile the sample contract, run:

```bash
npx hardhat compile
```

--8<-- 'code/tutorials/eth-api/hardhat-start-to-end/terminal/compile.md'

After compilation, an `artifacts` directory is created: it holds the bytecode and metadata of the contract, which are `.json` files. Adding this directory to your `.gitignore` is a good idea.

## Testing {: #testing }

A robust smart contract development workflow is complete with a testing suite. Hardhat has a number of tools that make it easy to write and run tests. In this section, you'll learn the basics of testing your smart contracts and some more advanced techniques.

Hardhat tests are typically written with Mocha and Chai. [Mocha](https://mochajs.org){target=\_blank} is a JavaScript testing framework and [Chai](https://www.chaijs.com){target=\_blank} is a BDD/TDD JavaScript assertion library. BDD/TDD stands for behavior and test-driven development respectively. Effective BDD/TDD necessitates writing your tests *before* writing your smart contract code. The structure of this tutorial doesn't strictly follow these guidelines, but you may wish to adopt these principles in your development workflow. Hardhat recommends using [Hardhat Toolbox](https://hardhat.org/hardhat-runner/docs/advanced/migrating-from-hardhat-waffle){target=\_blank}, a plugin that bundles everything you need to get started with Hardhat, including Mocha and Chai.

Because we will initially be running our tests on a local Moonbeam node, we need to specify Alice's address as the address of our target collator (Alice's account is the only collator for a local development node):

```text
0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
```

If instead you prefer to run your tests against Moonbase Alpha, you can choose the below collator, or [any other collator on Moonbase Alpha](https://apps.moonbeam.network/moonbase-alpha/staking){target=\_blank} you would like the DAO to delegate to:

```text
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

3. Then copy and paste the contents below to set up the initial structure of your test file. Be sure to read the comments, as they can clarify the purpose of each line

    ```javascript
    // Import Ethers
    const { ethers } = require('hardhat');

    // Import Chai to use its assertion functions here
    const { expect } = require('chai');

    // Indicate Alice's address as the target collator on local development node
    const targetCollator = '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac';
    ```

### Deploying a Staking DAO for Testing {: #deploying-a-staking-dao-for-testing }

Before we can run any test cases we'll need to launch a staking DAO with an initial configuration. Our setup here is relatively simple - we'll be deploying a staking DAO with a single administrator (the deployer) and then adding a new member to the DAO. This simple setup is perfect for demonstration purposes, but it's easy to imagine more complex configurations you'd like to test, such as a scenario with 100 DAO members or one with multiple admins of the DAO.

Mocha's `describe` function enables you to organize your tests. Multiple `describe` functions can be nested together. It's entirely optional but can be useful, especially in complex projects with many test cases. You can read more about constructing tests and [getting started with Mocha](https://mochajs.org/#getting-started){target=\_blank} on the Mocha docs site.

We'll define a function called `deployDao` containing the setup steps for our staking DAO. To configure your test file, add the following snippet:

```javascript
// The describe function receives the name of a section of your test suite, and a callback. The callback must define the tests of that section. This callback can't be an async function
describe('Dao contract', function () {
  let wallet1, wallet2;

  before(async function () {
    // Get signers we defined in Hardhat config
    const signers = await ethers.getSigners();
    wallet1 = signers[0];
    wallet2 = signers[1];
  });

  async function deployDao() {
    const delegationDaoFactory = await ethers.getContractFactory(
      'DelegationDAO',
      wallet2
    );

    // Deploy the staking DAO and wait for the deployment transaction to be confirmed
    try {
      const deployedDao = await delegationDaoFactory.deploy(
        targetCollator,
        wallet2.address
      );
      await deployedDao.waitForDeployment(); // Wait for the transaction to be mined
      return { deployedDao };
    } catch (error) {
      console.error('Failed to deploy contract:', error);
      return null; // Return null to indicate failure
    }
  }
  // Insert additional tests here
}); 
```

### Writing your First Test Cases {: #writing-your-first-test-cases }

First, you'll create a subsection called `Deployment` to keep the test file organized. This will be nested within the `Dao contract` describe function. Next, you'll define your first test case by using the `it` Mocha function. This first test checks to see that the staking DAO correctly stores the address of the target collator.

Add the snippet below to the end of your `Dao contract` function.

```javascript
// You can nest calls to create subsections
describe('Deployment', function () {
  // Mocha's it function is used to define each of your tests. It receives the test name, and a callback function. If the callback function is async, Mocha will await it. Test case to check that the correct target collator is stored
  it('should store the correct target collator in the DAO', async function () {
    const deployment = await deployDao();
    if (!deployment || !deployment.deployedDao) {
      throw new Error('Deployment failed; DAO contract was not deployed.');
    }
    const { deployedDao } = deployment;

    // The expect function receives a value and wraps it in an assertion object.
    // This test will pass if the DAO stored the correct target collator
    expect(await deployedDao.getTarget()).to.equal(
      '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac'
    );
  });
  // The following test cases should be added here
});
```

Now, add another test case. When a staking DAO is launched, it shouldn't have any funds. This test verifies that is indeed the case. Go ahead and add the following test case to your `Dao.js` file:

```javascript
// Test case to check that the DAO has 0 funds at inception
it('should initially have 0 funds in the DAO', async function () {
  const { deployedDao } = await deployDao();
  // This test will pass if the DAO has no funds as expected before any contributions
  expect(await deployedDao.totalStake()).to.equal(0);
});
```

### Function Reverts {: #function-reverts }

Now, you'll implement a more complex test case with a slightly different architecture. In prior examples, you've verified that a function returns an expected value. In this one, you'll be verifying that a function reverts. You'll also change the caller's address to test an admin-only function.

In the [staking DAO contract](https://github.com/moonbeam-foundation/moonbeam-intro-course-resources/blob/main/delegation-dao-lesson-one/DelegationDAO.sol){target=\_blank}, only admins are authorized to add new members to the DAO. One could write a test that checks to see if the admin is authorized to add new members but a more important test is to ensure that *non-admins* can't add new members. To run this test case under a different account, you will ask for another address when you call `ethers.getSigners()` and specify the caller in the assertion with `connect(member1)`. Finally, after the function call you'll append `.to.be.reverted` to indicate that the test case is successful if the function reverts. And if it doesn't revert, it's a failed test!

```javascript
// Test case to check that non-admins cannot grant membership
it('should not allow non-admins to grant membership', async function () {
  const { deployedDao } = await deployDao();
  // Connect the non-admin wallet to the deployed contract
  const deployedDaoConnected = deployedDao.connect(wallet1);
  const tx = deployedDaoConnected.grant_member(
    '0x0000000000000000000000000000000000000000'
  );

  // Check that the transaction reverts, not specifying any particular reason
  await expect(tx).to.be.reverted;
});
```

### Signing Transactions from Other Accounts {: #signing-transactions-from-other-accounts }

For this example, you'll verify whether the newly added DAO member can call the `check_free_balance()` function of staking DAO, which has an access modifier such that only members can access it.

```javascript
// Test case to check that members can access member only functions
it('should only allow members to access member-only functions', async function () {
  const { deployedDao } = await deployDao();

  // Connect the wallet1 to the deployed contract and grant membership
  const deployedDaoConnected = deployedDao.connect(wallet2);
  const grantTx = await deployedDaoConnected.grant_member(wallet1.address);
  await grantTx.wait();

  // Check the free balance using the member's credentials
  const checkTx = deployedDaoConnected.check_free_balance();

  // Since check_free_balance() does not modify state, we expect it not to be reverted and check the balance
  await expect(checkTx).to.not.be.reverted;
  expect(await checkTx).to.equal(0);
});
```

And that's it! You're now ready to run your tests!

### Running your Tests {: #running-your-tests }

If you've followed all of the prior sections, your [`Dao.js`](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam-intro-course-resources/main/delegation-dao-lesson-one/Dao.js){target=\_blank} test file should be all set to go.

??? code "Dao.js"

    ```js
    --8<-- 'code/tutorials/eth-api/hardhat-start-to-end/dao-js-test-file.js'
    ```

Since our test cases encompass mostly configuration and setup of the staking DAO and don't involve actual delegation actions, we'll be running our tests on a Moonbeam development node (local node). Remember that Alice (`0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`) is the only collator on a local development node. You can use the flag `--network moonbase` to run the tests using Moonbase Alpha. In that case, ensure your deployer address is sufficiently funded with DEV tokens.

!!! challenge
    Try to create an additional test case that verifies the staking DAO successfully delegates to a collator once `minDelegationStk` is met. You must test this on Moonbase Alpha rather than a local development node.

First, make sure that your local Moonbeam node is running by following the [instructions for launching a local development node](/builders/get-started/networks/moonbeam-dev/){target=\_blank}. Take precautions because you could inadvertently send real funds to the Alice and Bob development accounts, resulting in a loss of those funds.  

You can run your tests with the following command:

```bash
npx hardhat test --network dev tests/Dao.js
```

If everything was set up correctly, you should see output like the following:

--8<-- 'code/tutorials/eth-api/hardhat-start-to-end/terminal/test.md'

## Deploying to Moonbase Alpha {: #deploying-to-moonbase-alpha }

In the following steps, we'll deploy the `DelegationDAO` to the Moonbase Alpha TestNet. Before deploying to Moonbase Alpha or Moonbeam, double-check that you're not using the Alice and Bob accounts, which should only be used on a local development node.

As a side note, `DelegationDAO` relies on [`StakingInterface.sol`](/builders/ethereum/precompiles/features/staking/){target=\_blank}, which is a Substrate-based offering unique to Moonbeam networks. The Hardhat Network and forked networks are simulated EVM environments which do not include the Substrate-based precompiles like `StakingInterface.sol`. Therefore, `DelegationDAO` will not work properly if deployed to the local default Hardhat Network or a [forked network](/builders/ethereum/dev-env/hardhat/#forking-moonbeam){target=\_blank}.

To deploy `DelegationDAO`, you'll use Hardhat Ignition, a declarative framework for deploying smart contracts. Hardhat Ignition is designed to make managing recurring tasks surrounding smart contract deployment and testing easy. For more information about Hardhat Ignition and its architecture, be sure to check out the [Hardhat Ignition docs](https://hardhat.org/ignition/docs/getting-started#overview){target=\_blank}.

To set up the proper file structure for your Ignition module, change to the ignition directory and create the DelegationDao.js file:

```sh
cd ignition/modules && touch DelegationDao.js
```

Next, you can write your Hardhat Ignition module. To get started, take the following steps:

1. Import the `buildModule` function from the Hardhat Ignition module
2. Export a module using `buildModule`
3. Specify the target collator candidate for the DAO to delegate to
4. Use the `getAccount` method to select the deployer account
5. Deploy `DelegationDAO.sol`
6. Return an object from the module. This makes the `DelegationDao` contract accessible for interaction in Hardhat tests and scripts

When all is said and done your deployment script should look similar to the following:

```javascript
// 1. Import the required function from the Hardhat Ignition module
import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

// 2. Define and export your deployment module using `buildModule`
const DelegationDAOModule = buildModule('DelegationDAOModule', (m) => {
  // 3. Specify the target collator address for the DAO
  const targetCollator = '0x12E7BCCA9b1B15f33585b5fc898B967149BDb9a5';
  
  // 4. Use the `getAccount` method to select the deployer account
  const deployer = m.getAccount(0);
  
  // 5. Deploy the `DelegationDAO` contract
  const delegationDao = m.contract(
    'DelegationDAO',
    [targetCollator, deployer],
    {
      from: deployer,
    }
  );
  
  // 6. Return an object from the module including references to deployed contracts, allowing the contract to be accessible for interaction in Hardhat tests and scripts
  return { delegationDao };
});

// Export the module as default
export default DelegationDAOModule;
```

To run the script and deploy the `DelegationDAO.sol` contract, use the following command, which requires you to specify the network name as defined in your `hardhat.config.js`. If you don't specify a network, Hardhat will deploy the contract to a local Hardhat network by default. 

```sh
npx hardhat ignition deploy ./DelegationDao.js --network moonbase --deployment-id INSERT_YOUR_NAME
```

You'll be prompted to confirm the network you wish to deploy to. After a few seconds after you confirm, the contract is deployed, and you'll see the contract address in the terminal.

--8<-- 'code/tutorials/eth-api/hardhat-start-to-end/terminal/deploy-moonbase.md'

Congratulations, your contract is live on Moonbase Alpha! Save the address, as you will use it to interact with this contract instance in the next step.

## Verifying Contracts on Moonbase Alpha {: #verifying-contracts-on-moonbase-alpha }

Contract verification is an essential step of any developer's workflow, particularly in the theoretical example of this staking DAO. Potential participants in the DAO need to be assured that the smart contract works as intended - and verifying the contract allows anyone to observe and analyze the deployed smart contract.

While it's possible to verify smart contracts on the [Moonscan website](https://moonscan.io/verifyContract){target=\_blank}, the Hardhat Etherscan plugin enables us to verify our staking DAO in a faster and easier manner. It's not an exaggeration to say that the plugin dramatically simplifies the contract verification process, especially for projects that include multiple Solidity files or libraries.

Before beginning the contract verification process, you'll need to [acquire an Etherscan API Key](/builders/ethereum/verify-contracts/etherscan-plugins/#generating-an-etherscan-api-key){target=\_blank}. Note that Moonbeam, Moonriver, and Moonbase Alpha all use the same unified [Etherscan](https://etherscan.io){target=\_blank} API key.

To verify the contract, you will run the `ignition verify` command and pass the name of your deployment you set in the prior step.

```bash
npx hardhat ignition verify INSERT_YOUR_NAME
```

!!! note
    If you're deploying `DelegationDAO.sol` verbatim without any changes, you may get an `Already Verified` error because Moonscan automatically recognizes and verifies smart contracts that have matching bytecode. Your contract will still show as verified, so there is nothing else you need to do. However, if you'd prefer to verify your own `DelegationDAO.sol`, you can make a small change to the contract (such as changing a comment) and repeating the compilation, deployment and verification steps.

In your terminal, you should see the source code for your contract was successfully submitted for verification. If the verification was successful, you should see **Successfully verified contract** and there will be a link to the contract code on [Moonscan for Moonbase Alpha](https://moonbase.moonscan.io){target=\_blank}. If the plugin returns an error, double check that your API key is configured correctly and that you have specified all necessary parameters in the verification command. You can refer to the [guide to the Hardhat Etherscan plugin](/builders/ethereum/verify-contracts/etherscan-plugins/){target=\_blank} for more information.

--8<-- 'code/tutorials/eth-api/hardhat-start-to-end/terminal/verify-moonbase.md'


## Deploying to Production on Moonbeam Mainnet {: #deploying-to-production-on-moonbeam-mainnet }

!!! note
    `DelegationDAO.sol` is unreviewed and unaudited. It is designed only for demonstration purposes and not intended for production use. It may contain bugs or logic errors that could result in loss of funds.

In the following steps, we'll be deploying the `DelegationDAO` contract to the Moonbeam MainNet network. Remember to add the Moonbeam network to your [`hardhat.config.js`](#hardhat-configuration-file) and update the private keys of your accounts on Moonbeam if you haven't done so already. Before deploying `DelegationDAO` to Moonbeam, we need to change the address of the target collator, since our target collator on Moonbase Alpha does not exist on Moonbeam. Head to your deploy script and change the target collator to `{{ networks.moonbeam.staking.candidates.address1 }}` or [another Moonbeam collator](https://apps.moonbeam.network/moonbeam/staking){target=\_blank} of your choice. Your deployment script, named `DelegationDao.js`, should thus look like the following:

```javascript
// 1. Import the required function from the Hardhat Ignition module
import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

// 2. Define and export your deployment module using `buildModule`
const DelegationDAOModule = buildModule('DelegationDAOModule', (m) => {
  // 3. Specify the target collator address for the DAO
  const targetCollator = '0x1C86E56007FCBF759348dcF0479596a9857Ba105';
  
  // 4. Use the `getAccount` method to select the deployer account
  const deployer = m.getAccount(0);
  
  // 5. Deploy the `DelegationDAO` contract
  const delegationDao = m.contract(
    'DelegationDAO',
    [targetCollator, deployer],
    {
      from: deployer,
    }
  );
  
  // 6. Return an object from the module including references to deployed contracts, allowing the contract to be accessible for interaction in Hardhat tests and scripts
  return { delegationDao };
});

// Export the module as default
export default DelegationDAOModule;

```

To run the script and deploy the `DelegationDAO.sol` contract, use the following command, which requires you to specify the network name as defined in your `hardhat.config.js`. If you don't specify a network, Hardhat will deploy the contract to a local Hardhat network by default. 

```sh
npx hardhat ignition deploy ./ignition/modules/DelegationDao.js --network moonbeam --deployment-id INSERT_YOUR_NAME
```

You'll be prompted to confirm the network you wish to deploy to. After a few seconds after you confirm, the contract is deployed, and you'll see the contract address in the terminal.

--8<-- 'code/tutorials/eth-api/hardhat-start-to-end/terminal/deploy-moonbeam.md'

Congratulations, your contract is live on Moonbeam! Save the address, as you will use it to interact with this contract instance in the next step.

## Verifying Contracts on Moonbeam {: #verifying-contracts-on-moonbeam }

In this section, we'll be verifying the contract that was just deployed on Moonbeam. Before beginning the contract verification process, you'll need to [acquire an Etherscan API Key](/builders/ethereum/verify-contracts/etherscan-plugins/#generating-an-etherscan-api-key){target=\_blank}. Note that Moonbeam, Moonriver, and Moonbase Alpha all use the same unified [Etherscan](https://etherscan.io){target=\_blank} API key.

To verify the contract, you will run the `ignition verify` command and pass the name of your deployment you set in the prior step.

```bash
npx hardhat ignition verify INSERT_YOUR_NAME
```

!!! note
    If you're deploying `DelegationDAO.sol` verbatim without any changes, you may get an `Already Verified` error because Moonscan automatically recognizes and verifies smart contracts that have matching bytecode. Your contract will still show as verified, so there is nothing else you need to do. However, if you'd prefer to verify your own `DelegationDAO.sol`, you can make a small change to the contract (such as changing a comment) and repeating the compilation, deployment, and verification steps.

In your terminal you should see the source code for your contract was successfully submitted for verification. If the verification was successful, you should see **Successfully verified contract** and there will be a link to the contract code on [Moonbeam Moonscan](https://moonscan.io){target=\_blank}. If the plugin returns an error, double check that your API key is configured correctly and that you have specified all necessary parameters in the verification command. You can refer to the [guide to the Hardhat Etherscan plugin](/builders/ethereum/verify-contracts/etherscan-plugins/){target=\_blank} for more information.

--8<-- 'code/tutorials/eth-api/hardhat-start-to-end/terminal/verify-moonbeam.md'

And that's it! We covered a lot of ground in this tutorial, but there's more resources available if you'd like to go deeper, including the following:

- [Hardhat guide to Testing Contracts](https://hardhat.org/hardhat-runner/docs/guides/test-contracts){target=\_blank}
- [Writing tasks and scripts](https://hardhat.org/hardhat-runner/docs/guides/tasks){target=\_blank}

--8<-- 'text/_disclaimers/educational-tutorial.md'

--8<-- 'text/_disclaimers/third-party-content.md'
