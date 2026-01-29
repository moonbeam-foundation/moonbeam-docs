---
title: Deploy Contracts with Hardhat
description: Learn how to use Hardhat, an Ethereum development environment, to compile, deploy, and debug Solidity smart contracts on Moonbeam.
categories: Dev Environments, Ethereum Toolkit
---

# Using Hardhat to Deploy To Moonbeam

## Introduction {: #introduction }

[Hardhat](https://hardhat.org){target=\_blank} is a flexible and extensible Ethereum development environment that streamlines the smart contract development process. Since Moonbeam is Ethereum-compatible, you can use Hardhat to develop and deploy smart contracts on Moonbeam.

Hardhat takes a task-based approach to development, where you can define and execute [tasks](https://hardhat.org/hardhat-runner/docs/advanced/create-task){target=\_blank} that perform specific actions. These actions include compiling and deploying contracts, running tests, and more. Tasks are highly configurable, so you can create, customize, and execute tasks that are tailored to meet your needs.

You can also extend Hardhat's functionality through the use of [plugins](https://hardhat.org/hardhat-runner/plugins){target=\_blank}. Plugins are external extensions that integrate with Hardhat to provide additional features and tools for your workflow. For example, there are plugins for common Ethereum libraries, like [Ethers.js](/builders/ethereum/libraries/ethersjs/){target=\_blank} and [viem](/builders/ethereum/libraries/viem/){target=\_blank}, a plugin that extends the Chai assertion library to include Ethereum-specific functionality, and more. All of these plugins can be used to extend your Hardhat project on Moonbeam.

This guide will provide a brief introduction to Hardhat and show you how to use Hardhat to compile, deploy, and debug Ethereum smart contracts on the Moonbase Alpha TestNet. This guide can also be adapted for Moonbeam, Moonriver, or a Moonbeam development node. The content below targets Hardhat 3 (current release: 3.0.17).

Please note that although Hardhat comes with a [Hardhat Network](https://hardhat.org/docs#hardhat-network){target=\_blank} component, which provides a local development environment, you should use a [local Moonbeam development node](/builders/get-started/networks/moonbeam-dev/){target=\_blank} instead. You can connect a Moonbeam development node to Hardhat just like you would with any other network.

## Checking Prerequisites {: #checking-prerequisites }

To get started, you will need the following:

- Have Node.js 22.10.0 or later (Hardhat 3 only supports even-numbered LTS versions) and npm
- Have [MetaMask installed](/tokens/connect/metamask/#install-the-metamask-extension){target=\_blank} and [connected to Moonbase Alpha](/tokens/connect/metamask/#connect-metamask-to-moonbeam){target=\_blank}.
- Have an account with funds.
  --8<-- 'text/_common/faucet/faucet-list-item.md'
- 
  --8<-- 'text/_common/endpoint-examples-list-item.md'

## Create a Hardhat Project {: #creating-a-hardhat-project }

You will need to create a Hardhat project if you don't already have one. You can create one by completing the following steps:

1. Create a directory for your project.

    ```sh
    --8<-- 'code/builders/ethereum/dev-env/hardhat/1.sh'
    ```

2. Initialize the project, which will create a `package.json` file.

    ```sh
    --8<-- 'code/builders/ethereum/dev-env/hardhat/2.sh'
    ```

3. Install Hardhat.

    ```sh
    --8<-- 'code/builders/ethereum/dev-env/hardhat/3.sh'
    ```

4. Create a Hardhat project.

    ```sh
    --8<-- 'code/builders/ethereum/dev-env/hardhat/4.sh'
    ```

    !!! note
        `npx` is used to run executables installed locally in your project. Although Hardhat can be installed globally, installing it locally in each project is recommended so you can control the version on a project-by-project basis.


5. You'll be prompted with a series of questions to set up your project:

    - Choose **Hardhat 3 Beta (recommended for new projects)** rather than Hardhat 2.
    - Choose where to initialize the project (default is current directory).
    - Confirm converting to ESM (required for Hardhat v3).
    - Select the type of project to initialize:
        - A TypeScript Hardhat project using Node Test Runner and viem
        - A TypeScript Hardhat project using Mocha and Ethers.js

    For this example, you can choose either option based on your preference. If you choose the Mocha and Ethers.js option, you'll get a project structure with:
    
    - A sample contract in `contracts/Counter.sol`
    - A test file in `test/Counter.ts`
    - TypeScript configuration
    - Mocha and Ethers.js dependencies

    The project will be set up with all necessary dependencies and configurations for you to start developing.

--8<-- 'code/builders/ethereum/dev-env/hardhat/terminal/hardhat-create.md'

## Hardhat Configuration File {: #hardhat-configuration-file }

The Hardhat configuration file is the entry point into your Hardhat project. It defines various settings and options for your Hardhat project, such as the Solidity compiler version to use and the networks you can deploy your contracts to.

If you are using JavaScript, keep `"type": "module"` in your `package.json`. A minimal `hardhat.config.js` looks like:

```js
--8<-- 'code/builders/ethereum/dev-env/hardhat/5.js'
```

If you chose a TypeScript template, the file will be `hardhat.config.ts`, and the config content will be the same. For this example, you can keep the Solidity compiler version at `0.8.28`; however, if you are using a contract that requires a newer version, don't forget to update it here.

Install the plugins and libraries used in this guide if your project template did not add them:

```bash
--8<-- 'code/builders/ethereum/dev-env/hardhat/6.sh'
```

Next, you'll need to modify your configuration file to add the network configurations for the network you want to deploy your contract to. For Moonbeam networks, you'll need to specify the following:

- **`url`**: The [RPC endpoint](/builders/get-started/endpoints/){target=\_blank} of the node.
- **`chainId`**: The chain ID, which is used to validate the network.
- **`accounts`**: The accounts that can be used to deploy and interact with contracts. You can either enter an array of the private keys for your accounts or use an [HD Wallet](https://github.com/ethereumbook/ethereumbook/blob/develop/src/chapter_5.md#hierarchical-deterministic-wallets-bip-32bip-44){target=\_blank}.
- **`type`**: For external RPC networks on Moonbeam, set `type: 'http'`.
- **`chainType`**: For Moonbeam networks, set `chainType: 'l1'`.

Hardhat includes an encrypted secrets manager via the `@nomicfoundation/hardhat-keystore` plugin, which keeps sensitive data out of source control. After installing and importing the plugin, set your secrets with the keystore:

=== "Moonbeam"

    ```bash
    --8<-- 'code/builders/ethereum/dev-env/hardhat/7.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/builders/ethereum/dev-env/hardhat/8.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/builders/ethereum/dev-env/hardhat/9.sh'
    ```

=== "Moonbeam Dev Node"

    ```bash
    --8<-- 'code/builders/ethereum/dev-env/hardhat/10.sh'
    ```

!!! warning
    The Hardhat console task does not currently prompt for keystore secrets. Use environment variables for your config variables before running `npx hardhat console`, or interact through scripts/tasks instead of the console when using the keystore.

Then, update your configuration file to use the encrypted secrets and ESM syntax:

=== "Moonbeam"

    ```js
    --8<-- 'code/builders/ethereum/dev-env/hardhat/11.js'
    ```

=== "Moonriver"

    ```js
    --8<-- 'code/builders/ethereum/dev-env/hardhat/12.js'
    ```

=== "Moonbase Alpha"

    ```js
    --8<-- 'code/builders/ethereum/dev-env/hardhat/13.js'
    ```

=== "Moonbeam Dev Node"

    ```js
    --8<-- 'code/builders/ethereum/dev-env/hardhat/14.js'
    ```

When you run tasks that require these secrets, Hardhat will prompt you for the password to decrypt them. The secrets are only decrypted when needed, meaning you only need to enter the password if a Hardhat task uses a secret.

If you are planning on using any plugins with your project, you'll need to install the plugin and import it into your Hardhat config file (`hardhat.config.ts` or `hardhat.config.js`). Once a plugin has been imported, it becomes part of the [Hardhat Runtime Environment](https://hardhat.org/hardhat-runner/docs/advanced/hardhat-runtime-environment){target=\_blank}, and you can leverage the plugin's functionality within tasks, scripts, and more.

For more information on the available configuration options, please refer to Hardhat's documentation on [Configuration](https://hardhat.org/hardhat-runner/docs/config#networks-configuration){target=\_blank}.

## The Contract File {: #the-contract-file }

Now that you've configured your project, you can begin the development process by creating your smart contract. The contract will be a simple one that will let you store a value that can be retrieved later, called `Box`.

To add the contract, you'll take the following steps:

1. Change into the `contracts` directory.

    ```sh
    --8<-- 'code/builders/ethereum/dev-env/hardhat/15.sh'
    ```

2. Create a `Box.sol` file.

    ```sh
    --8<-- 'code/builders/ethereum/dev-env/hardhat/16.sh'
    ```

3. Open the file and add the following contract to it:

    ```solidity
    --8<-- 'code/builders/ethereum/dev-env/hardhat/17.sol'
    ```

## Compile the Contract {: #compiling-solidity }

The next step is to compile the `Box.sol` smart contract. For this, you can use the built-in `compile` task, which will look for Solidity files in the `contracts` directory and compile them using the version and compiler settings defined in your Hardhat config file.

To use the `compile` task, all you have to do is run:

```sh
--8<-- 'code/builders/ethereum/dev-env/hardhat/18.sh'
```

--8<-- 'code/builders/ethereum/dev-env/hardhat/terminal/compile.md'

After compilation, an `artifacts` directory is created that holds the bytecode and metadata of the contract, which are `.json` files. It's a good idea to add this directory to a `.gitignore` file.

If you make changes to the contract after you've compiled it, you can compile it again using the same command. Hardhat will look for any changes and recompile the contract. If no changes are found, nothing will be compiled. If needed, you can force a compilation using the `clean` task, which will clear the cache and delete the old artifacts.

## Deploy the Contract {: #deploying-the-contract }

To deploy the contract, you'll use Hardhat Ignition, a declarative framework for deploying smart contracts. Hardhat Ignition is designed to make it easy to manage recurring tasks surrounding smart contract deployment and testing. For more information, be sure to check out the [Hardhat Ignition docs](https://hardhat.org/ignition/docs/getting-started#overview){target=\_blank}. 

To set up the proper file structure for your Ignition module, create a folder named `ignition` and a subdirectory called `modules`. Then add a new file to it called `Box.js`. You can take all three of these steps with the following command:

```sh
--8<-- 'code/builders/ethereum/dev-env/hardhat/19.sh'
```

Next, you can write your Hardhat Ignition module. To get started, take the following steps:

1. Import the `buildModule` function from the Hardhat Ignition module.
2. Export a module using `buildModule`.
3. Use the `getAccount` method to select the deployer account.
4. Deploy the `Box` contract.
5. Return an object from the module. This makes the `Box` contract accessible for interaction in Hardhat tests and scripts.

```js
--8<-- 'code/builders/ethereum/dev-env/hardhat/20.js'
```

To run the script and deploy the `Box.sol` contract, use the following command, which requires you to specify the network name as defined in your Hardhat config file. If you don't specify a network, hardhat will deploy the contract to a local Hardhat network by default. 

```sh
--8<-- 'code/builders/ethereum/dev-env/hardhat/21.sh'
```

!!! note
    If you're using another Moonbeam network, make sure that you specify the correct network. The network name needs to match the one defined in your Hardhat config file.

You'll be prompted to enter your password for the Hardhat secrets manager. Next, you'll be prompted to confirm the network you wish to deploy to. A few seconds after you confirm, the contract is deployed, and you'll see the contract address in the terminal.

--8<-- 'code/builders/ethereum/dev-env/hardhat/terminal/deploy-moonbase.md'

Congratulations, your contract is live! Save the address, as you will use it to interact with this contract instance in the next step.

## Interact with the Contract {: #interacting-with-the-contract }

You can interact with your newly deployed contract using Hardhat in two ways: run console-style commands from a helper script (recommended for Hardhat 3), or reuse that script to automate interactions via the `run` task.

### Console-Style Interaction {: #hardhat-console }

Similarly to the deployment script, you can create a lightweight helper that mirrors the console workflow, save it under `scripts`, and run it with the built-in `run` task. This approach works even when your credentials are stored in the Hardhat keystore because `network.connect()` is executed inside a normal Hardhat task (which can unlock the keystore) instead of the console, which does not have access to the Hardhat keystore.

To get started, create a `box-console.ts` file in the `scripts` directory:

```sh
--8<-- 'code/builders/ethereum/dev-env/hardhat/22.sh'
```

Update the script with your deployed contract address before running it. The full helper looks like this:

??? code "View the complete script"

    ```ts
    --8<-- 'code/builders/ethereum/dev-env/hardhat/scripts/box-console.ts'
    ```

Replace `INSERT_CONTRACT_ADDRESS` with the address printed by Hardhat Ignition and adjust `VALUE_TO_STORE` if you want to store a different value.

### Run the Script {: #run-the-script }

Use the `run` task to execute the helper script against your deployed `Box` contract so you can verify the keystore unlock flow works and confirm the contract stores the new value on Moonbase Alpha.

```sh
--8<-- 'code/builders/ethereum/dev-env/hardhat/23.sh'
```

You'll be prompted for the Hardhat keystore password (if you're using encrypted secrets), after which the script connects to Moonbase Alpha, attaches to your deployed `Box` contract, and logs the values stored before and after calling `store(5n)`. Upon running it, you should see output similar to:

--8<-- 'code/builders/ethereum/dev-env/hardhat/terminal/interact.md'

The script prints the signer being used, the value stored before the transaction, the submitted transaction hash, and the updated value after calling `store(5n)`.

## Hardhat Forking {: #hardhat-forking }

You can [fork](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks){target=\_blank} any EVM-compatible chain using Hardhat, including Moonbeam. Forking simulates the live Moonbeam network locally, enabling you to interact with deployed contracts on Moonbeam in a local test environment. Since Hardhat forking is based on an EVM implementation, you can interact with the fork using standard [Ethereum JSON-RPC methods supported by Moonbeam](/builders/ethereum/json-rpc/eth-rpc/){target=\_blank} and [Hardhat](https://hardhat.org/hardhat-network/docs/reference#json-rpc-methods-support){target=\_blank}.

There are some limitations to be aware of when using Hardhat forking. You cannot interact with any of the Moonbeam precompiled contracts or their functions. Precompiles are a part of the Substrate implementation and therefore cannot be replicated in the simulated EVM environment. This prohibits you from interacting with cross-chain assets on Moonbeam and Substrate-based functionality such as staking and governance.


### Forking Moonbeam {: #forking-moonbeam }

You can fork Moonbeam from the command line or configure your Hardhat project to always run the fork from your Hardhat config file. To fork Moonbeam or Moonriver, you will need to have your own endpoint and API key, which you can get from one of the supported [Endpoint Providers](/builders/get-started/endpoints/){target=\_blank}.

To fork Moonbeam from the command line, you can run the following command from within your Hardhat project directory:

=== "Moonbeam"

    ```sh
    --8<-- 'code/builders/ethereum/dev-env/hardhat/24.sh'
    ```

=== "Moonriver"

    ```sh
    --8<-- 'code/builders/ethereum/dev-env/hardhat/25.sh'
    ```

=== "Moonbase Alpha"

    ```sh
    --8<-- 'code/builders/ethereum/dev-env/hardhat/26.sh'
    ```

If you prefer to configure your Hardhat project, you can update your Hardhat config file with the following configurations:

=== "Moonbeam"

    ```js
    --8<-- 'code/builders/ethereum/dev-env/hardhat/27.js'
    ```

=== "Moonriver"

    ```js
    --8<-- 'code/builders/ethereum/dev-env/hardhat/28.js'
    ```

=== "Moonbase Alpha"

    ```js
    --8<-- 'code/builders/ethereum/dev-env/hardhat/29.js'
    ```

When you spin up the Hardhat fork, you'll have 20 development accounts that are pre-funded with 10,000 test tokens. The forked instance is available at `http://127.0.0.1:8545/`. The output in your terminal should resemble the following:

--8<-- 'code/builders/ethereum/dev-env/hardhat/terminal/private-keys.md'

To verify you have forked the network, you can query the latest block number:

```sh
--8<-- 'code/builders/ethereum/dev-env/hardhat/30.sh'
```

If you convert the `result` from [hex to decimal](https://www.rapidtables.com/convert/number/hex-to-decimal.html){target=\_blank}, you should get the latest block number from the time you forked the network. You can cross-reference the block number using a [block explorer](/builders/get-started/explorers/){target=\_blank}.

From here, you can deploy new contracts to your forked instance of Moonbeam or interact with contracts already deployed by creating a local instance of the deployed contract.

To interact with an already deployed contract, you can create a new script in the `scripts` directory using `ethers`. Because you'll be running it with Hardhat, you can import `ethers` directly from the Hardhat runtime without extra setup. Inside the script, you can access a live contract on the network using the following snippet:

```js
--8<-- 'code/builders/ethereum/dev-env/hardhat/31.js'
```

--8<-- 'text/_disclaimers/third-party-content.md'
