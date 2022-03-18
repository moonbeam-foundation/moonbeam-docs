---
title: Truffle
description: Moonbeam makes it incredibly easy to deploy a Solidity-based smart contract to a Moonbeam node using Truffle. Learn how in this tutorial.
---

# Using Truffle to Deploy to Moonbeam

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/RD5MefSPNeo' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## Introduction {: #introduction } 

This guide walks through the process of deploying a Solidity-based smart contract to a Moonbeam node using [Truffle](https://www.trufflesuite.com/){target=blnk}, a commonly used development tool for smart contracts on Ethereum. Given Moonbeam’s Ethereum compatibility features, Truffle can be used directly with any of the Moonbeam networks.

To ease the process of getting started with Truffle, you can use the [Moonbeam Truffle box](https://github.com/PureStake/moonbeam-truffle-box){target=_blank}. This provides a boilerplate setup to speed up the process to deploy contracts on Moonbeam. The Moonbeam Truffle box comes with the [Moonbeam Truffle plugin](https://github.com/purestake/moonbeam-truffle-plugin){target=_blank}, which enables you to get started with a [Moonbeam development node](/builders/get-started/moonbeam-dev/){target=_blank} quickly.

This guide will show you how to deploy a contract and interact with it using the Moonbeam Truffle box and the Moonbeam Truffle plugin on a locally running development node. You can adapt the instructions in this guide for Moonbeam, Moonriver, or the Moonbase Alpha TestNet.

## Checking Prerequisites {: #checking-prerequisites } 

As this guide will use the Moonbeam Truffle box and the Moonbeam Truffle plugin, you don't have to worry about creating an account and funding it. The Moonbeam development node comes with 10 pre-funded accounts. However, if you're adapting this guide for Moonbeam, Moonriver, or Moonbase Alpha you will need to have an account with funds. For Moonbase Alpha, you can get tokens for testing purposes from [Mission Control](/builders/get-started/moonbase/#get-tokens/){target=_blank}.

--8<-- 'text/common/endpoint-examples.md'

To use the Moonbeam Truffle plugin, you will need to have [Docker](https://docs.docker.com/get-docker/){target=_blank} installed.

For the following examples, you don't need to have Truffle globally installed, as it is included as a dependency in the Moonbeam Truffle box. However, if you want to use the `truffle` commands directly instead of running `npx truffle` or `./node_modules/.bin/truffle`, you can globally install it by running: 

```
npm install -g truffle
```

## Creating a Project using the Moonbeam Truffle Box {: #creating-a-project-using-the-moonbeam-truffle-box } 

To get started with the Moonbeam Truffle box, you can take the following steps:

1. If you have Truffle installed globally, you can execute:

    ```
    mkdir moonbeam-truffle-box && cd moonbeam-truffle-box
    truffle unbox PureStake/moonbeam-truffle-box
    ```

    ![Unbox Moonbeam Truffle box](/images/builders/build/eth-api/dev-env/truffle/truffle-1.png)

    Otherwise, you can directly clone the following repository:

    ```
    git clone https://github.com/PureStake/moonbeam-truffle-box
    cd moonbeam-truffle-box
    ``` 

2. With the files in your local system, you can install all dependencies by running:

    ```
    npm install
    ```

If you look inside of the `moonbeam-truffle-box` directory, you'll find the following notable directories and files:

- **`contracts`** - a directory that is meant to store any Solidity contracts you create including the following ones that come in the Moonbeam Truffle box:
    - **`Migrations.sol`** - required contract to use Truffle's [migration](https://trufflesuite.com/docs/truffle/getting-started/running-migrations.html){target=_blank} feature
    - **`MyToken.sol`** - example contract
- **`migrations`** - contains the JavaScript files that help you deploy contracts to the network. It comes with the following scripts:
    - **`1_initial_migration.js`** - script that deploys the `Migrations.sol` contract. Since this contract would need to be deployed first to use migrations, it begins with `1` and from there you can create new migrations with increasing numbered prefixes
    - **`2_deploy_contracts.js`** - script that deploys the example `MyToken.sol` contract
- **`truffle-config.js`** - the [configuration file](https://trufflesuite.com/docs/truffle/reference/configuration){target=_blank} for your project where you can define the networks your project can be deployed to, the compiler to use when compiling your contracts, and more

## Using the Moonbeam Truffle Plugin to Run a Node {: #using-the-moonbeam-truffle-plugin-to-run-a-node } 

Now that you have created a simple Truffle project, you can spin up a local Moonbeam development node to deploy the contract to. The Moonbeam Truffle plugin provides a way to get started with a development node quickly by using [Docker](https://www.docker.com/){target=_blank} under the hood.

To start a Moonbeam development node in your local environment, you need to:

1. Download the corresponding Docker image:

    ```
    truffle run moonbeam install
    ```

    ![Docker image download](/images/builders/build/eth-api/dev-env/truffle/truffle-2.png)

2. Once downloaded, you can proceed to start the local node with the following command:

    ```
    truffle run moonbeam start
    ```

    You will see a message indicating that the node has started, followed by both of the endpoinds available

    ![Moonbeam local node started](/images/builders/build/eth-api/dev-env/truffle/truffle-3.png)

Once you are finished using your Moonbeam development node, you can run the following lines to stop it and remove the Docker image if that is the case:

```
truffle run moonbeam stop && \
truffle run moonbeam remove
```

![Moonbeam local node stoped and image removed](/images/builders/build/eth-api/dev-env/truffle/truffle-4.png)

You also have the option to pause and unpause your Moonbeam development node:

```
truffle run moonbeam pause
truffle run moonbeam unpause
```

You can see the output of these commands in the following image:

![Install Moonbeam Truffle box](/images/builders/build/eth-api/dev-env/truffle/truffle-5.png)

!!! note
    If you are familiar with Docker, you can skip the plugin commands and interact with the Docker image directly.

## The Truffle Configuration File {: #the-truffle-configuration-file } 

The Truffle configuration file already includes everything you need to get started and deploy a contract to your local Moonbeam development node. Open the `truffle-config.js` file and review the following details:

1. The `HDWalletProvider` package from Truffle has been imported and is used as the hierarchical deterministic wallet
2. The `privateKeyDev` variable corresponds to the private key of one of your development accounts, which should hold some development funds. Your development node comes with 10 pre-funded accounts
3. Under the `networks` object, you'll see the `dev` network configuration which is configured to use the port your local development node is running on along with the private key of your development account. Both of which are needed to deploy a contract to your local development node
4. Under `compilers`, the solc version listed should be set to support the version of any contracts you wish to deploy. For this example it's set to support version `0.7.0` and up
5. Under the `plugins` object, you'll see the `moonbeam-truffle-plugin` which enables you to quickly spin up a local Moonbeam development node. You'll also find the `truffle-plugin-verify` plugin which automates the contract verification process for you. Please check out the [Verify Smart Contracts with Etherscan Plugins](/builders/build/eth-api/verify-contracts/etherscan-plugins/){target=_blank} for more information on how to use the plugin

```js
// 1. Import HDWalletProvider
const HDWalletProvider = require('@truffle/hdwallet-provider');

// 2. Moonbeam development node private key
const privateKeyDev =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';

module.exports = {
  networks: {
    // 3. Configure networks
    dev: {
      provider: () => {
        ...
        return new HDWalletProvider(privateKeyDev, '{{ networks.development.rpc_url }}')
      },
      network_id: {{ networks.development.chain_id }},  // {{ networks.development.hex_chain_id }} in hex,
    },
  },
   // 4. Configure compiler & version
  compilers: {
    solc: {
      version: '^0.7.0',
    },  
  },
  // 5. Plugin configuration
  plugins: ['moonbeam-truffle-plugin', 'truffle-plugin-verify'],
};
```

!!! note
    For the purpose of this guide, some of the configuration file was removed from the above example.

If you're adapting this guide for Moonbeam, Moonriver, or Moonbase Alpha, you will need to update the configuration file with the appropriate network.
--8<-- 'text/common/endpoint-setup.md'
You'll also need to update the private key to one that has funds on that network:

=== "Moonbeam"
    ```
    moonbeam: {
      provider: () => {
        ...
        return new HDWalletProvider(
          'PRIVATE-KEY-HERE',  // Insert your private key here
          '{{ networks.moonbeam.rpc_url }}' // Insert your RPC URL here
        )
      },
      network_id: {{ networks.moonbeam.chain_id }} (hex: {{ networks.moonbeam.hex_chain_id }}),
    },
    ```

=== "Moonriver"
    ```
    moonriver: {
      provider: () => {
        ...
        return new HDWalletProvider(
          'PRIVATE-KEY-HERE',  // Insert your private key here
          '{{ networks.moonriver.rpc_url }}' // Insert your RPC URL here
        )
      },
      network_id: {{ networks.moonriver.chain_id }} (hex: {{ networks.moonriver.hex_chain_id }}),
    },
    ```

=== "Moonbase Alpha"
    ```
    moonbase: {
      provider: () => {
        ...
        return new HDWalletProvider(
          'PRIVATE-KEY-HERE',  // Insert your private key here
          '{{ networks.moonbase.rpc_url }}' // Insert your RPC URL here
        )
      },
      network_id: {{ networks.moonbase.chain_id }} (hex: {{ networks.moonbase.hex_chain_id }}),
    },
    ```

## The Contract File {: #the-contract-file }

Under the `contracts` directory, you'll find an ERC-20 token contract, called `MyToken`, that mints a given amount of tokens to the contract owner:

```solidity
pragma solidity ^0.7.5;

// Import OpenZeppelin Contract
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// This ERC-20 contract mints the specified amount of tokens to the contract creator.
contract MyToken is ERC20 {
  constructor(uint256 initialSupply) ERC20("MyToken", "MYTOK") {
    _mint(msg.sender, initialSupply);
  }
}
```

This is a simple ERC-20 contract based on the [OpenZepplin](/builders/build/eth-api/dev-env/openzeppelin/overview/){target=_blank} ERC-20 contract template. It creates `MyToken` which has `MYTOK` as the symbol and the standard 18 decimal places. Furthermore, it assigns the created initial token supply to the contract creator.

## The Migration Script {: #the-migration-script }

Truffle uses a concept called migrations. Migrations are JavaScript files that help you deploy contracts to the network.

If you take a look at the migration scripts in the `migrations` directory, you'll see there are two files. As previously mentioned, the `1_initial_migration.js` script needs to be deployed first and is required to enable Truffle's migration feature. If you take a look at the migration script under `migrations/2_deploy_contracts.js`, it contains the following:

```javascript
var MyToken = artifacts.require('MyToken');

module.exports = function (deployer) {
   deployer.deploy(MyToken, '8000000000000000000000000');
};
```

This script imports the `MyToken` contract artifact which is created when you compile the contract. It is then used to deploy the contract with any initial constructor values.

For this example, `8000000000000000000000000` is the number of tokens to initially mint with the contract, i.e., 8 million with 18 decimal places.

## Deploying a Contract to Moonbeam Using Truffle {: #deploying-a-contract-to-moonbeam-using-truffle } 

Before you can deploy your contracts, you must compile them. As a reminder, you will be deploying the `Migrations.sol` contract first using the `migrations/1_initial_migration.js` script. This will enable you to use Truffle's migration feature. You can take the following steps to compile and deploy your contract:

1. Compile the contracts:

    ```
    truffle compile
    ```

    If successful, you should see output like the following:

    ![Truffle compile success message](/images/builders/build/eth-api/dev-env/truffle/truffle-6.png)

2. Deploy the compiled contracts:

    === "Moonbeam"
        ```
        truffle migrate --network moonbeam
        ```

    === "Moonriver"
        ```
        truffle migrate --network moonriver
        ```

    === "Moonbase Alpha"
        ```
        truffle migrate --network moonbase
        ```

    === "Moonbeam Dev Node"
        ```
        truffle migrate --network dev
        ```

    If successful, you will see deployment actions, including the address of the deployed contract:

    ![Successful contract deployment actions](/images/builders/build/eth-api/dev-env/truffle/truffle-7.png)

--8<-- 'text/disclaimers/third-party-content.md'