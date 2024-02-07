---
title: Deploy Contracts with Ape
description: Use Ape, a Python framework, to compile, deploy, and debug smart contracts using Python on Moonbeam, thanks to its Ethereum compatibility.
---

# Using Ape to Deploy To Moonbeam

## Introduction {: #introduction }

[Ape](https://docs.apeworx.io/ape/stable/){target=\_blank} is an Ethereum development environment that helps Python developers manage and automate the recurring tasks inherent to building smart contracts and DApps. Ape can directly interact with Moonbeam's Ethereum API, so you can also use Ape to deploy smart contracts on Moonbeam.

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

    --8<-- 'code/builders/build/eth-api/dev-env/ape/terminal/init.md'

Your Ape project contains a bare-bones `ape-config.yaml` file for customizing specific settings and the following empty directories:

- `contracts` - an empty directory for storing smart contracts
- `scripts` - an empty directory for storing Python scripts, such as deployment scripts and scripts to interact with your deployed contracts
- `tests` - an empty directory for `pytest` testing scripts

## Configure Accounts {: #configure-accounts }

You'll need to import an account before you can deploy smart contracts or interact with previously deployed contracts from your Ape project. You can run the following command, which will import your account and give it a name:

```bash
ape accounts import INSERT_ACCOUNT_NAME
```

You'll then be prompted to enter your private key and add a password to encrypt your account.

--8<-- 'code/builders/build/eth-api/dev-env/ape/terminal/new-account.md'

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
--8<-- 'code/builders/build/eth-api/dev-env/ape/Box.sol'
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

--8<-- 'code/builders/build/eth-api/dev-env/ape/terminal/compile.md'

After compilation, you can find the bytecode and ABI for your contracts in the `.build` directory.

## Deploy the Contract {: #deploy-the-contract }

To deploy your contracts, create a deployment script named `deploy.py` inside of the `scripts` directory:

```bash
touch scripts/deploy.py
```

Next, you'll need to write the deployment script. You'll need to load the account you will use to deploy the contract and access it by its name using the project manager.

```python
--8<-- 'code/builders/build/eth-api/dev-env/ape/deploy.py'
```

Now you're ready to deploy the `Box` contract!
--8<-- 'text/_common/endpoint-setup.md'

Take the following steps to initiate and send the deployment transaction:

1. Run the deployment script using the `ape run deploy` command

    === "Moonbeam"

        ```bash
        ape run deploy --network {{ networks.moonbeam.rpc_url }}
        ```

    === "Moonriver"

        ```bash
        ape run deploy --network {{ networks.moonriver.rpc_url }}
        ```

    === "Moonbase Alpha"

        ```bash
        ape run deploy --network {{ networks.moonbase.rpc_url }}
        ```

    === "Moonbeam Dev Node"

        ```bash
        ape run deploy --network {{ networks.development.rpc_url }}
        ``` 

    !!! note
        For the `ape run deploy` command to work as intended, the deployment script must be named `deploy.py` and stored in the `scripts` directory, and the script must define a `main()` method.

2. Review the transaction details and enter **y** to sign the transaction
3. Enter your passphrase for your account
4. Enter **y** to leave your account unlocked or **n** to lock it

After you follow the prompts and submit the transaction, the transaction hash, total fees paid, and contract address will be displayed in the terminal.

--8<-- 'code/builders/build/eth-api/dev-env/ape/terminal/deploy.md'

Congratulations! Your contract is live! Save the address to interact with your contract in the following section.

## Interact with the Contract {: #interact-with-the-contract }

You can interact with contracts using the Ape console for quick debugging and testing, or write a script.

### Using The Ape Console {: #using-ape-console }

To interact with your newly deployed contract, you can launch the Ape console by running:

=== "Moonbeam"

    ```bash
    ape console --network {{ networks.moonbeam.rpc_url }}
    ```

=== "Moonriver"

    ```bash
    ape console --network {{ networks.moonriver.rpc_url }}
    ```

=== "Moonbase Alpha"

    ```bash
    ape console --network {{ networks.moonbase.rpc_url }}
    ```

=== "Moonbeam Dev Node"

    ```bash
    ape console --network {{ networks.development.rpc_url }}
    ``` 

Next, you'll need to create a contract instance using the contract's address:

```bash
box = Contract("INSERT_CONTRACT_ADDRESS")
```

--8<-- 'code/builders/build/eth-api/dev-env/ape/terminal/load.md'

Now, you can interact with your contract instance! For example, you can set the variable to be stored in the `Box` contract using the following commands:

1. Call the `store` method by passing in a value to store and the account you want to use to send the transaction:

    ```bash
    box.store(4, sender=alice)
    ```

2. Review the transaction details and enter **y** to sign the transaction
3. If you previously locked your account, you must enter your passphrase to unlock it. Otherwise, Ape will use the cached key for your account
4. If you unlocked your account in the previous step, you'll be asked if you want to leave your account unlocked. You can enter **y** to leave it unlocked or **n** to lock it

After you follow the prompts and submit the transaction, the transaction hash and total fees paid will be displayed in the terminal.

--8<-- 'code/builders/build/eth-api/dev-env/ape/terminal/store.md'

Then, you can retrieve the stored value by calling the `retrieve` method:

```bash
box.retrieve()
```

The number you just stored in the previous steps will be printed to the console.

--8<-- 'code/builders/build/eth-api/dev-env/ape/terminal/retrieve.md'

## Using a Script {: #using-a-script }

You can also write a script to interact with your newly deployed contract. To get started, you can create a new file in the `scripts` directory:

```bash
touch scripts/store-and-retrieve.py
```

Next, you can write a script that stores and retrieves a value. To get started, take the following steps:

```python
--8<-- 'code/builders/build/eth-api/dev-env/ape/deploy.py'
```

Now, you can run the script to set the stored value and retrieve it:

1. Run the script

    === "Moonbeam"

        ```bash
        ape run store-and-retrieve --network {{ networks.moonbeam.rpc_url }}
        ```

    === "Moonriver"

        ```bash
        ape run store-and-retrieve --network {{ networks.moonriver.rpc_url }}
        ```

    === "Moonbase Alpha"

        ```bash
        ape run store-and-retrieve --network {{ networks.moonbase.rpc_url }}
        ```

    === "Moonbeam Dev Node"

        ```bash
        ape run store-and-retrieve --network {{ networks.development.rpc_url }}
        ```

2. Review the transaction details and enter **y** to sign the transaction
3. If you previously locked your account, you must enter your passphrase to unlock it. Otherwise, Ape will use the cached key for your account
4. If you unlocked your account in the previous step, you'll be asked if you want to leave your account unlocked. You can enter **y** to leave it unlocked or **n** to lock it

Once completed, you should see a transaction hash and a value of `4` printed to the console.

--8<-- 'code/builders/build/eth-api/dev-env/ape/terminal/store-and-retrieve.md'

Congratulations! You have successfully deployed and interacted with a contract using Ape!

--8<-- 'text/_disclaimers/third-party-content.md'
