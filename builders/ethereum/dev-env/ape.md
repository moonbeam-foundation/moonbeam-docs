---
title: Deploy Contracts with Ape
description: Use Ape, a Python framework, to compile, deploy, and debug smart contracts using Python on Moonbeam, thanks to its Ethereum compatibility.
---

# Using Ape to Deploy To Moonbeam

## Introduction {: #introduction }

[Ape](https://docs.apeworx.io/ape/stable){target=\_blank} is an Ethereum development environment that helps Python developers manage and automate the recurring tasks inherent to building smart contracts and DApps. Ape can directly interact with Moonbeam's Ethereum API, so you can also use Ape to deploy smart contracts on Moonbeam.

This guide will walk you through using Ape to compile, deploy, and interact with Ethereum smart contracts on the Moonbase Alpha TestNet. You can adapt this guide for Moonbeam, Moonriver, or a Moonbeam development node.

## Checking Prerequisites {: #checking-prerequisites }

To get started, ensure you have the following:

 - MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
 - An account with funds.
  --8<-- 'text/_common/faucet/faucet-list-item.md'
 - 
--8<-- 'text/_common/endpoint-examples-list-item.md'

## Creating an Ape Project {: #creating-an-ape-project }

If you don't already have an Ape project, you must install Ape and create a new one. You can follow the steps below to get started and create an empty project:

1. Create a directory for your project

    ```bash
    mkdir ape && cd ape
    ```

2. If you don't have `pipx` installed, install it

    ```bash
    python3 -m pip install --user pipx
    python3 -m pipx ensurepath
    ```

3. [Install Ape using `pipx`](https://ape.readthedocs.io/en/stable/install.html){target=\_blank}

    ```bash
    pipx install eth-ape
    ```

4. Create a project

    ```bash
    ape init
    ```

5. Enter a name for your project

    --8<-- 'code/builders/ethereum/dev-env/ape/terminal/init.md'

Your Ape project contains a bare-bones `ape-config.yaml` file for customizing specific settings and the following empty directories:

- `contracts` - an empty directory for storing smart contracts
- `scripts` - an empty directory for storing Python scripts, such as deployment scripts and scripts to interact with your deployed contracts
- `tests` - an empty directory for pytest testing scripts

## Configure Accounts {: #configure-accounts }

You'll need to import an account before you can deploy smart contracts or interact with previously deployed contracts from your Ape project. You can run the following command, which will import your account and give it a name:

```bash
ape accounts import INSERT_ACCOUNT_NAME
```

You'll then be prompted to enter your private key and add a password to encrypt your account.

--8<-- 'code/builders/ethereum/dev-env/ape/terminal/new-account.md'

!!! note
    If you wish to use a mnemonic instead, you can append the `--use-mnemonic` option to the import command.

## Create Smart Contracts {: #the-contract-file }

Now that you have set up your account, you can start writing smart contracts. As a basic example, you can use the following `Box` contract to store a value you can retrieve later.

Start by creating a file named `Box.sol` inside the contracts directory:

```bash
touch contracts/Box.sol
```

Open the file and add the following contract to it:

```solidity
--8<-- 'code/builders/ethereum/dev-env/ape/Box.sol'
```

You can store any additional contracts in the `contracts` directory.

## Compile the Solidity Contract {: #compiling-solidity }

Before compiling the Solidity, you must install the Solidity compiler plugin. Running the following command will install the latest version of the plugin:

```bash
ape plugins install solidity
```

To use a specific version of Solidity or a specific EVM version, you can modify your `ape-config.yaml` file as follows:

```yaml
solidity:
  version: INSERT_VERSION
  evm_version: INSERT_VERSION
```

For more information on the Solidity plugin, please refer to the [README of the `ape-solidity` repository on GitHub](https://github.com/ApeWorX/ape-solidity/blob/main/README.md){target=_blank}.

With the Solidity plugin installed, the next step is to compile the smart contract:

```bash
ape compile
```

--8<-- 'code/builders/ethereum/dev-env/ape/terminal/compile.md'

After compilation, you can find the bytecode and ABI for your contracts in the `.build` directory.

## Test the Contract {: #test-the-contract }

Before you deploy your contract, you can test it out directly inside your Ape project using the [pytest framework](https://docs.pytest.org/en/latest){target=\_blank} to make sure it works as you expect.

You should already have a `tests` directory where you'll create your tests, but if not, please create one, as all tests must be located in a directory named `tests`. Additionally, each test file name must start with `test_` and end with `.py`. So, first, you can create a test file for the `Box.sol` contract:

```bash
touch tests/test_box.py
```

In addition to the test file, you can create a `conftest.py` file that will define a couple of essential [fixtures](https://docs.pytest.org/en/stable/explanation/fixtures.html){target=\_blank}. Fixtures allow you to define functions that set up the necessary environment or resources to run your tests. Note that while the `Box.sol` contract is simple, incorporating fixtures into your testing process is good practice.

To create the file, you can run the following command:

```bash
touch tests/conftest.py
```

Since your tests will rely on the injection of the fixtures, you must define the fixtures first. When defining fixtures, you need to apply the `pytest.fixture` decorator above each function. For this example, you'll create two fixtures: one that defines the owner of the contract and one that deploys the contract from the owner's account.

The `owner` fixture will use the built-in `accounts` fixture to take the first account in the list of test accounts provided by Ape and return it. The `box` fixture will deploy the `Box` contract type using the built-in `project` fixture, you simply have to provide the name of the contract and use the `owner` fixture to deploy it.

```python title="tests/conftest.py"
--8<-- 'code/builders/ethereum/dev-env/ape/conftest.py'
```

Now that you've created the fixtures, you can start creating your tests. Each test function name must start with `test_` and describe what the test does. For this example, you can use `test_store_value`, as you'll create a test for the `store` function. The test will store a value and then retrieve it, asserting that the retrieved value is equal to the value passed into the `store` function.

To use the `owner` and `box` fixtures, you must pass them into your test function, which will inject the fixtures automatically for you to use. The `owner` account will be used to call the `store` function of the `box` contract instance.

```py title="tests/test_box.py"
--8<-- 'code/builders/ethereum/dev-env/ape/test_box.py'
```

And that's it! That's all you'll need inside your test file. You can use the following command to run the test:

```bash
ape test
```

The results of running the test will be printed to the terminal.

--8<-- 'code/builders/ethereum/dev-env/ape/terminal/test.md'

Now that you have confidence in your contract, the next step is to deploy it.

## Deploy the Contract {: #deploy-the-contract }

To deploy your contracts, create a deployment script named `deploy.py` inside of the `scripts` directory:

```bash
touch scripts/deploy.py
```

Next, you'll need to write the deployment script. You'll need to load the account you will use to deploy the contract and access it by its name using the project manager.

```python title="scripts/deploy.py"
--8<-- 'code/builders/ethereum/dev-env/ape/deploy.py'
```

Now you're ready to deploy the `Box` contract!
--8<-- 'text/_common/endpoint-setup.md'

Take the following steps to initiate and send the deployment transaction. Note that there are some nuances associated with [using Ape with a local Moonbeam node](#using-ape-with-a-local-node).

1. Run the deployment script using the `ape run deploy` command

    === "Moonbeam"

        ```bash
        ape run deploy --network moonbeam:mainnet
        ```

    === "Moonriver"

        ```bash
        ape run deploy --network moonbeam:moonriver
        ```

    === "Moonbase Alpha"

        ```bash
        ape run deploy --network moonbeam:moonbase
        ```

    === "Moonbeam Dev Node"

        ```bash
        ape run deploy --network ethereum:local_moonbeam:http://127.0.0.1:9944
        ``` 

    !!! note
        For the `ape run deploy` command to work as intended, the deployment script must be named `deploy.py` and stored in the `scripts` directory, and the script must define a `main()` method.

2. Review the transaction details and enter **y** to sign the transaction
3. Enter your passphrase for your account
4. Enter **y** to leave your account unlocked or **n** to lock it

After you follow the prompts and submit the transaction, the transaction hash, total fees paid, and contract address will be displayed in the terminal.

--8<-- 'code/builders/ethereum/dev-env/ape/terminal/deploy.md'

Congratulations! Your contract is live! Save the address to interact with your contract in the following section.

## Interact with the Contract {: #interact-with-the-contract }

You can interact with contracts using the Ape console for quick debugging and testing, or write a script.

### Using The Ape Console {: #using-ape-console }

To interact with your newly deployed contract, you can launch the Ape console by running:

=== "Moonbeam"

    ```bash
    ape console --network moonbeam:mainnet
    ```

=== "Moonriver"

    ```bash
    ape console --network moonbeam:moonriver
    ```

=== "Moonbase Alpha"

    ```bash
    ape console --network moonbeam:moonbase
    ```

=== "Moonbeam Dev Node"

    ```bash
    ape console --network ethereum:local_moonbeam:http://127.0.0.1:9944
    ``` 

Next, you'll need to create a contract instance using the contract's address:

```bash
box = Contract("INSERT_CONTRACT_ADDRESS")
```

--8<-- 'code/builders/ethereum/dev-env/ape/terminal/load.md'

Now, you can interact with your contract instance! For example, you can set the variable to be stored in the `Box` contract using the following commands:

1. Call the `store` method by passing in a value to store and the account you want to use to send the transaction:

    ```bash
    box.store(5, sender=alice)
    ```

2. Review the transaction details and enter **y** to sign the transaction
3. If you previously locked your account, you must enter your passphrase to unlock it. Otherwise, Ape will use the cached key for your account
4. If you unlocked your account in the previous step, you'll be asked if you want to leave your account unlocked. You can enter **y** to leave it unlocked or **n** to lock it

After you follow the prompts and submit the transaction, the transaction hash and total fees paid will be displayed in the terminal.

--8<-- 'code/builders/ethereum/dev-env/ape/terminal/store.md'

Then, you can retrieve the stored value by calling the `retrieve` method:

```bash
box.retrieve()
```

The number you just stored in the previous steps will be printed to the console.

--8<-- 'code/builders/ethereum/dev-env/ape/terminal/retrieve.md'

### Using a Script {: #using-a-script }

You can also write a script to interact with your newly deployed contract. To get started, you can create a new file in the `scripts` directory:

```bash
touch scripts/store-and-retrieve.py
```

Next, you can write a script that stores and retrieves a value. Note that when creating a contract instance to interact with, you must pass in the address of the deployed contract.

```python title="scripts/store-and-retrieve.py"
--8<-- 'code/builders/ethereum/dev-env/ape/store-and-retrieve.py'
```

Now, you can run the script to set the stored value and retrieve it:

1. Run the script

    === "Moonbeam"

        ```bash
        ape run store-and-retrieve --network moonbeam:mainnet
        ```

    === "Moonriver"

        ```bash
        ape run store-and-retrieve --network moonbeam:moonriver
        ```

    === "Moonbase Alpha"

        ```bash
        ape run store-and-retrieve --network moonbeam:moonbase
        ```

    === "Moonbeam Dev Node"

        ```bash
        ape run store-and-retrieve --network ethereum:local_moonbeam:http://127.0.0.1:9944
        ```

2. Review the transaction details and enter **y** to sign the transaction
3. If you previously locked your account, you must enter your passphrase to unlock it. Otherwise, Ape will use the cached key for your account
4. If you unlocked your account in the previous step, you'll be asked if you want to leave your account unlocked. You can enter **y** to leave it unlocked or **n** to lock it

Once completed, you should see a transaction hash and a value of `5` printed to the console.

--8<-- 'code/builders/ethereum/dev-env/ape/terminal/store-and-retrieve.md'

Congratulations! You have successfully deployed and interacted with a contract using Ape!

## Using Ape with a Local Node {: #using-ape-with-a-local-node }

There are some nuances associated with using Ape with a local Moonbeam node. As a Moonbeam local node is not included as a preset network with Ape, you'll need to customize your `ape-config.yaml` before using Ape with a local Moonbeam node. Adjust your `ape-config.yaml` as follows: 

```bash
--8<-- 'code/builders/ethereum/dev-env/ape/ape-config.yaml'
```

After configuring your `ape-config.yaml`, you can target your local Moonbeam node by appending the following network configuration flag to your Ape command:

```bash
--network ethereum:local_moonbeam:http://127.0.0.1:9944
```

Additionally, when deploying or interacting with contracts on a local Moonbeam node using Ape, the CLI will, by default, wait for two block confirmations before allowing you to proceed. However, because a local Moonbeam node employs instant sealing, only producing blocks when new transactions occur, this can lead to a stalemate situation that may lead you to think something is wrong. To circumvent this, you can run your local Moonbeam node with a sealing flag to produce blocks at a set interval, such as every `6` seconds, with the command: `--sealing 6000`. Alternatively, you can submit dummy transactions to your local Moonbeam node to force new blocks to be authored. 

--8<-- 'text/_disclaimers/third-party-content.md'