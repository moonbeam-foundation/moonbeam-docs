---
title: Verify Smart Contracts with Plugins
description: Learn how to verify smart contracts on Moonbeam networks using built-in tools from Hardhat and Foundry that support Moonscan’s API.
categories: Ethereum Toolkit
---

# Verify Smart Contracts with Etherscan Plugins

## Introduction {: #introduction }

Verifying smart contracts is a great way of improving the transparency and security of contracts deployed on Moonbeam. Hardhat and Foundry integrate with Etherscan's contract verification service to automate the process of verifying contracts by locally detecting which contracts to verify and which Solidity libraries are required, if any.

The Hardhat plugin integrates seamlessly into your [Hardhat](https://hardhat.org){target=\_blank} project. [Foundry](https://github.com/foundry-rs/foundry){target=\_blank} also has Etherscan capabilities, but they are built into its Forge tool instead of being included in a separate plugin.

This guide will show you how to use both plugins to verify smart contracts deployed on Moonbase Alpha. This guide can also be adapted for Moonbeam and Moonriver.

## Checking Prerequisites {: #checking-prerequisites }

To follow along with this tutorial, you will need to have:

- [MetaMask installed and connected to the Moonbase Alpha](/tokens/connect/metamask/){target=\_blank} TestNet
- An account funded with `DEV` tokens.
 --8<-- 'text/_common/faucet/faucet-list-item.md'
- An Etherscan API key
- Git installed and configured

## Generating an Etherscan API Key {: generating-an-etherscan-api-key }

To verify contracts on Moonscan for any Moonbeam network, you’ll need an [Etherscan API key](https://docs.etherscan.io/etherscan-v2/getting-an-api-key){target=\_blank}. Because Moonscan is part of Etherscan’s ecosystem, a single key works across all supported networks.

To create an [Etherscan account](https://etherscan.io/){target=\_blank} and generate your key, follow these steps:

1. Click **Sign In**
2. Select **Click to sign up** and then register your new account

![Sign up for Moonscan](/images/builders/ethereum/verify-contracts/etherscan-plugins/plugins-1.webp)

Once you have an account and are signed in, you will then be able to create an API key.

1. Select **API Dashboard** from the left side menu
2. To add a new key, click the **+ Add** button

![Add an API key](/images/builders/ethereum/verify-contracts/etherscan-plugins/plugins-2.webp)

You will then be prompted to enter in an **AppName** for your API key and once you enter a name and click **Continue** it will appear in your list of API keys.

## Using the Hardhat Etherscan Plugin {: #using-the-hardhat-verify-plugin }

The example in this section of the guide will be based off of the `Box.sol` contract that was created in the [Using Hardhat to Deploy To Moonbeam](/builders/ethereum/dev-env/hardhat/){target=\_blank} guide.

To get started with the Hardhat Etherscan plugin, you will need to first install the plugin library:

```bash
npm install --save-dev @nomicfoundation/hardhat-verify
```

You can add your Etherscan API key to the `hardhat.config.js` file.

From within your Hardhat project, open your `hardhat.config.js` file. You'll need to import the `hardhat-verify` plugin, your Etherscan API key, and add the config for Etherscan:

```js
require('@nomicfoundation/hardhat-verify');

module.exports = {
  networks: {
    moonbeam: { ... },
    moonriver: { ... },
    moonbaseAlpha: { ... }
  },
  etherscan: {
    apiKey: {
      moonbeam: 'INSERT_ETHERSCAN_API_KEY',
      moonriver: 'INSERT_ETHERSCAN_API_KEY',
      moonbaseAlpha: 'INSERT_ETHERSCAN_API_KEY', 
    },
  },
};
```

To verify the contract, you will run the `verify` command and pass in the address of the deployed contract and the network where it's deployed:

```bash
npx hardhat verify --network moonbase INSERT_CONTRACT_ADDRESS
```

In your terminal you should see the source code for your contract was successfully submitted for verification. If the verification was successful, you should see **Successfully verified contract** and there will be a link to the contract code on [Moonscan for Moonbase Alpha](https://moonbase.moonscan.io){target=\_blank}.

--8<-- 'code/builders/ethereum/verify-contracts/etherscan-plugins/terminal/hardhat-verify.md'

If you're verifying a contract that has constructor arguments, you'll need to run the above command and add the constructor arguments used to deploy the contract at the end of the command. For example:

```bash
npx hardhat verify --network moonbase INSERT_CONTRACT_ADDRESS INSERT_CONSTRUCTOR_ARGS
```

Please refer to the [Hardhat Verify documentation](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify){target=\_blank} for help with additional use cases such as:

- [complex arguments](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#complex-arguments){target=\_blank}
- [libraries with undetectable addresses](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#libraries-with-undetectable-addresses){target=\_blank}
- using [multiple API keys](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#multiple-api-keys-and-alternative-block-explorers){target=\_blank}
- using the [`verify` command programmatically](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#using-programmatically){target=\_blank}
- [determining the correct constructor arguments](https://info.etherscan.com/determine-correct-constructor-argument-during-source-code-verification-on-etherscan/){target=\_blank}

## Using Foundry to Verify {: #using-foundry-to-verify }

The example in this section of the guide will use the `MyToken.sol` contract that was created in the [Using Foundry to Deploy to Moonbeam](/builders/ethereum/dev-env/foundry/){target=\_blank} guide. 

In addition to the Foundry project, you will need an [Etherscan API key](https://etherscan.io/){target=\_blank} to verify your contract. 

If you have already deployed the example contract, you can verify it with the `verify-contract` command. Before you can verify the contract, you will need to ABI-encode the constructor arguments. To do so for the example contract, you can run the following command:

```bash
cast abi-encode "constructor(uint256)" 100
```

The result should be `0x0000000000000000000000000000000000000000000000000000000000000064`. You can then verify the contract using the following command:

=== "Moonbeam"

    ```bash
    forge verify-contract --chain-id {{ networks.moonbeam.chain_id }} \
    YOUR_CONTRACT_ADDRESS \
    --constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
    src/MyToken.sol:MyToken \
    --etherscan-api-key INSERT_YOUR_ETHERSCAN_API_KEY
    ```

=== "Moonriver"

    ```bash
    forge verify-contract --chain-id {{ networks.moonriver.chain_id }} \
    YOUR_CONTRACT_ADDRESS \
    --constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
    src/MyToken.sol:MyToken \
    --etherscan-api-key INSERT_YOUR_ETHERSCAN_API_KEY
    ```

=== "Moonbase Alpha"

    ```bash
    forge verify-contract --chain-id {{ networks.moonbase.chain_id }} \
    YOUR_CONTRACT_ADDRESS \
    --constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
    src/MyToken.sol:MyToken \
    --etherscan-api-key INSERT_YOUR_ETHERSCAN_API_KEY
    ```

--8<-- 'code/builders/ethereum/verify-contracts/etherscan-plugins/terminal/forge-verify.md'

If you wanted to deploy the example contract and verify at the same time, then you would use the following command:

=== "Moonbeam"

    ```bash
    forge create --rpc-url {{ networks.moonbeam.rpc_url }} \
    --constructor-args 100 \
    --etherscan-api-key INSERT_YOUR_ETHERSCAN_API_KEY \
    --verify --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken
    ```

=== "Moonriver"

    ```bash
    forge create --rpc-url {{ networks.moonriver.rpc_url }} \
    --constructor-args 100 \
    --etherscan-api-key INSERT_YOUR_ETHERSCAN_API_KEY \
    --verify --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken
    ```

=== "Moonbase Alpha"

    ```bash
    forge create --rpc-url {{ networks.moonbase.rpc_url }} \
    --constructor-args 100 \
    --etherscan-api-key INSERT_YOUR_ETHERSCAN_API_KEY \
    --verify --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken
    ```

--8<-- 'code/builders/ethereum/verify-contracts/etherscan-plugins/terminal/forge-create-verify.md'
