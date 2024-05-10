---
title: Brownie
description: Use Brownie, an Ethereum development environment, to compile, deploy, and debug smart contracts using Python on Moonbeam, thanks to its Ethereum compatibility.
---

# Using Brownie to Deploy To Moonbeam

## Introduction {: #introduction }

[Brownie](https://eth-brownie.readthedocs.io){target=\_blank} is an Ethereum development environment that helps Python developers manage and automate the recurring tasks inherent to building smart contracts and DApps. Brownie can directly interact with Moonbeam's Ethereum API so it can also be used to deploy smart contracts on Moonbeam.

This guide will cover how to use Brownie to compile, deploy, and interact with Ethereum smart contracts on the Moonbase Alpha TestNet. This guide can also be adapted for Moonbeam, Moonriver, or Moonbeam development node.

**Please note that Brownie is no longer actively maintained.** You can check out [Ape](https://docs.apeworx.io/ape/stable){target=\_blank} as an alternative Python Ethereum development environment.

## Checking Prerequisites {: #checking-prerequisites }

To get started, you will need the following:

 - Have MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask){target=\_blank}
 - Have an account with funds.
  --8<-- 'text/_common/faucet/faucet-list-item.md'
 - 
--8<-- 'text/_common/endpoint-examples-list-item.md'

For this guide, Python version 3.9.10, pip version 22.0.3, and pipx version 1.0.0 were used.

## Creating a Brownie Project {: #creating-a-brownie-project }

You will need to install Brownie and create a Brownie project if you don't already have one. You can choose to either create an empty project or use a [Brownie mix](https://eth-brownie.readthedocs.io/en/stable/init.html?highlight=brownie%20mix#creating-a-project-from-a-template){target=\_blank}, which is essentially a template to build your project on. For this example, you can create an empty project. You can get started by completing the following steps:

1. Create a directory for your project

    ```bash
    mkdir brownie && cd brownie
    ```

2. If you don't already have `pipx` installed, go ahead and install it

    ```bash
    python3 -m pip install --user pipx
    python3 -m pipx ensurepath
    ```

3. [Install Brownie using `pipx`](https://eth-brownie.readthedocs.io/en/stable/install.html){target=\_blank}, which is used to run executables installed locally in your project. Brownie will be installed into a virtual environment and be available directly from the command line

    ```bash
    pipx install eth-brownie
    ```

    !!! note
        A common error while installing Brownie on Ubuntu is:

        ```text
        pip seemed to fail to build package:
            pyyaml==5.4.1

        Some possibly relevant errors from pip install:
            error: subprocess-exited-with-error
            AttributeError: cython_sources

        Error installing eth-brownie.
        ```

        This can be resolved by using the following command:

        ```bash
        pip3 install wheel && \
        pip3 install --no-build-isolation "Cython<3" "pyyaml==5.4.1" && \
        pip3 install --upgrade --no-cache-dir eth-brownie
        ```

4. Create a project

    ```bash
    brownie init
    ```

    --8<-- 'code/builders/build/eth-api/dev-env/brownie/terminal/init.md'

Your Brownie project should contain the following empty directories:

- **build** - for project data such as contract artifacts from compilation
- **contracts** - to store the smart contract files
- **interfaces** - for smart contract interfaces that are required for your project
- **reports** - for JSON report files for use in the [Brownie GUI](https://eth-brownie.readthedocs.io/en/stable/gui.html){target=\_blank}
- **scripts** - where Python scripts used for deploying contracts or other automated tasks will live
- **tests** - to store Python scripts for testing your project. Brownie uses the `pytest` framework for unit testing

Another important file to note that is not included in an empty project is the `brownie-config.yaml` configuration file. The configuration file is optional and comes in handy when customizing specific settings such as a default network, compiler version and settings, and more.

## Network Configuration  {: #network-configuration }

To deploy to a Moonbeam-based network, you'll need to add and configure the network. Network configurations in Brownie are added from the command line. Brownie can be used with both development and live environments.

Moonbeam, Moonriver, and Moonbase Alpha are supported out of the box with Brownie as of version 1.19.3. To view the complete list of supported networks, you can run the following command:

```bash
brownie networks list
```

--8<-- 'code/builders/build/eth-api/dev-env/brownie/terminal/list-networks.md'

If you're looking to deploy a contract to a Moonbeam development node you'll need to add the network configurations. Under the hood, Brownie uses Ganache for development environments. However, since a Moonbeam development node acts as your own personal development environment, Ganache isn't needed. Therefore, you can configure a development node as a "live" network.

To add Moonbeam development node configurations, you can run the following command:

```bash
brownie networks add Moonbeam moonbeam-dev host={{ networks.development.rpc_url }} name=Development chainid={{ networks.development.chain_id }}
```

If you successfully added the network, you'll see a success message along with the network details in the terminal.

To deploy to a Moonbeam network, or run tests on a specific network, you can specify the network by appending the following to the given command:

=== "Moonbeam"

    ```bash
    --network moonbeam-main
    ```

=== "Moonriver"

    ```bash
    --network moonriver-main
    ```

=== "Moonbase Alpha"

    ```bash
    --network moonbeam-test
    ```

=== "Moonbeam Dev Node"

    ```bash
    --network moonbeam-dev
    ```

If you would like to set a default network, you can do so by adding the following snippet to the `brownie-config.yaml` configuration file:

=== "Moonbeam"

    ```yaml
    networks:
        default: moonbeam-main
    ```

=== "Moonriver"

    ```yaml
    networks:
        default: moonriver-main
    ```

=== "Moonbase Alpha"

    ```yaml
    networks:
        default: moonbeam-test
    ```

=== "Moonbeam Dev Node"

    ```yaml
    networks:
        default: moonbeam-dev
    ```

!!! note
    Keep in mind that the `brownie-config.yaml` file isn't automatically created, you can optionally create it yourself.

### Setting your Networks RPC URLs

It is recommended that you override the default Brownie RPC URLs to [your own RPC endpoint](/builders/get-started/endpoints/#rpc-endpoint-providers){target=\_blank} or the public Moonbeam network endpoints. You can override the default Brownie RPC URL for each network as follows:

=== "Moonbeam"

    ```bash
    brownie networks modify moonbeam-main host={{ networks.moonbeam.rpc_url }}
    ```

=== "Moonriver"

    ```bash
    brownie networks modify moonriver-main host={{ networks.moonriver.rpc_url }}
    ```

=== "Moonbase Alpha"

    ```bash
    brownie networks modify moonbeam-test host={{ networks.moonbase.rpc_url }}
    ```

--8<-- 'code/builders/build/eth-api/dev-env/brownie/terminal/modify-networks.md'

## Account Configuration {: #account-configuration }

Before you can deploy a contract, you'll need to configure your account, which is also done from the command line. To add a new account you can run:

```bash
brownie accounts new INSERT_ACCOUNT_NAME
```

Make sure to replace `INSERT_ACCOUNT_NAME` with your name of choice. For this example, `alice` will be used as the account name.

You'll be prompted to enter in your private key and a password to encrypt the account with. If the account was successfully configured, you'll see your account address printed to the terminal.

--8<-- 'code/builders/build/eth-api/dev-env/brownie/terminal/new-account.md'

## The Contract File {: #the-contract-file }

Next you can create a contract inside of the `contracts` directory. The smart contract that you'll deploy as an example will be called `Box`, it will let you store a value that can be retrieved later. You can create a `Box.sol` contract by running the following command:

```bash
cd contracts && touch Box.sol
```

Open the file and add the following contract to it:

```solidity
// contracts/Box.sol
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

## Compiling Solidity {: #compiling-solidity }

To compile the contract you can simply run:

```bash
brownie compile
```

--8<-- 'code/builders/build/eth-api/dev-env/brownie/terminal/compile.md'

!!! note
    The first time you compile your contracts it may take longer than usual while the `solc` binary is installed.

After compilation, you'll find the build artifacts in the `build/contracts` directory. The artifacts contain the bytecode and metadata of the contract, which are `.json` files. The `build` directory should already be in the `.gitignore` file but if it's not, it’s a good idea to add it there.

If you want to specify the compiler version or compilation settings, you can do so in the `brownie-config.yaml` file. Please note that if you haven't already created this file, you will need to do so. Then you can specify the compiler like so:

```yaml
compiler:
  evm_version: null
  solc:
    version: 0.8.13
    optimizer:
      enabled: true
      runs: 200
```

!!! note
    You can view the list of [EVM versions supported by Brownie](https://github.com/eth-brownie/brownie/blob/master/docs/compile.rst#the-evm-version){target=\_blank} in their documentation.

Your contracts will only be compiled again if Brownie notices that a change has been made. To force a new compilation, you can run:

```bash
brownie compile --all
```

## Deploying the Contract {: #deploying-the-contract }

In order to deploy the `Box.sol` smart contract, you will need to write a simple deployment script. You can create a new file under the `scripts` directory and name it `deploy.py`:

```bash
cd scripts && touch deploy.py
```

Next, you need to write your deployment script. To get started start, take the following steps:

1. Import the `Box` contract and the `accounts` module from `brownie`
2. Load your account using `accounts.load()` which decrypts a keystore file and returns the account information for the given account name
3. Use the `deploy` method that exists within this instance to instantiate the smart contract specifying the `from` account and the `gas_limit`

```py
# scripts/deploy.py
from brownie import Box, accounts


def main():
    account = accounts.load("alice")
    return Box.deploy({"from": account, "gas_limit": "200000"})
```

You can now deploy the `Box.sol` contract using the `run` command and specifying the network:

=== "Moonbeam"

    ```bash
    brownie run scripts/deploy.py --network moonbeam-main
    ```

=== "Moonriver"

    ```bash
    brownie run scripts/deploy.py --network moonriver-main
    ```

=== "Moonbase Alpha"

    ```bash
    brownie run scripts/deploy.py --network moonbeam-test
    ```

=== "Moonbeam Dev Node"

    ```bash
    brownie run scripts/deploy.py --network moonbeam-dev
    ```

After a few seconds, the contract is deployed, and you should see the address in the terminal.

--8<-- 'code/builders/build/eth-api/dev-env/brownie/terminal/deploy.md'

Congratulations, your contract is live! Save the address, as you will use it to interact with this contract instance in the next step.

## Interacting with the Contract {: #interacting-with-the-contract }

You can interact with contracts using the Brownie console for quick debugging and testing or you can also write a script to interact.

### Using Brownie Console {: #using-brownie-console }

To interact with your newly deployed contract, you can launch the Brownie `console` by running:

=== "Moonbeam"

    ```bash
    brownie console --network moonbeam-main
    ```

=== "Moonriver"

    ```bash
    brownie console --network moonriver-main
    ```

=== "Moonbase Alpha"

    ```bash
    brownie console --network moonbeam-test
    ```

=== "Moonbeam Dev Node"

    ```bash
    brownie console --network moonbeam-dev
    ```

The contract instance will automatically be accessible from the console. It will be wrapped in a `ContractContainer` which also enables you to deploy new contract instances. To access the deployed contract you can use `Box[0]`. To call the `store` method and set the value to `5`, you can take the following steps:

1. Create a variable for the contract
    ```bash
    box = Box[0]
    ```
2. Call the `store` method using your account and set the value to `5`
    ```bash
    box.store(5, {'from': accounts.load('alice'), 'gas_limit': '50000'})
    ```
3. Enter the password for your account

The transaction will be signed by your account and broadcasted to the network. Now, you can retrieve the value by taking these steps:

1. Call the `retrieve` method
    ```bash
    box.retrieve({'from': accounts.load('alice')})
    ```
2. Enter your password

You should see `5` or the value you have stored initially.

--8<-- 'code/builders/build/eth-api/dev-env/brownie/terminal/interact.md'

### Using a Script {: #using-a-script }

You can also write a script to interact with your newly deployed contract. To get started, you can create a new file in the `scripts` directory:

```bash
cd scripts && touch store-and-retrieve.py
```

Next, you need to write your script that will store and then retrieve a value. To get started, take the following steps:

1. Import the `Box` contract and the `accounts` module from `brownie`
2. Load your account using `accounts.load()` which decrypts a keystore file and returns the account information for the given account name
3. Create a variable for the `Box` contract
4. Use the `store` and `retrieve` functions to store a value and then retrieve it and print it to the console

```py
# scripts/store-and-retrieve.py
from brownie import Box, accounts


def main():
    account = accounts.load("alice")
    box = Box[0]
    store = box.store(5, {"from": accounts.load("alice"), "gas_limit": "50000"})
    retrieve = box.retrieve({"from": accounts.load("alice")})

    print("Transaction hash for updating the stored value: " + store)
    print("Stored value: " + retrieve)
```

To run the script, you can use the following command:

=== "Moonbeam"

    ```bash
    brownie run scripts/store-and-retrieve.py --network moonbeam-main
    ```

=== "Moonriver"

    ```bash
    brownie run scripts/store-and-retrieve.py --network moonriver-main
    ```

=== "Moonbase Alpha"

    ```bash
    brownie run scripts/store-and-retrieve.py --network moonbeam-test
    ```

=== "Moonbeam Dev Node"

    ```bash
    brownie run scripts/store-and-retrieve.py --network moonbeam-dev
    ```

You'll need to enter the password for Alice to send the transaction to update the stored value. Once the transaction goes through, you should see a transaction hash and a value of `5` printed to the console.

Congratulations, you have successfully deployed and interacted with a contract using Brownie!

--8<-- 'text/_disclaimers/third-party-content.md'
