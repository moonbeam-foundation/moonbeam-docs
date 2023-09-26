---
title: Verify Smart Contracts with Plugins
description: Learn about how to verify smart contracts on Moonbeam networks using the Etherscan plugins made available by Hardhat, Truffle, and Foundry.
---

# Verify Smart Contracts with Etherscan Plugins

## Introduction {: #introduction }

Verifying smart contracts is a great way of improving the transparency and security of contracts deployed on Moonbeam. There are a couple of plugins that integrate with Etherscan's contract verification service, including the [`hardhat-verify` plugin](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify){target=_blank} and the [`truffle-plugin-verify` plugin](https://github.com/rkalis/truffle-plugin-verify){target=_blank}. Both plugins can be used to automate the process of verifying contracts by locally detecting which contracts to verify and which Solidity libraries are required, if any.

The Hardhat plugin integrates seamlessly into your [Hardhat](https://hardhat.org/){target=_blank} project, and likewise the Truffle plugin integrates into your [Truffle](https://trufflesuite.com/){target=_blank} project. [Foundry](https://github.com/foundry-rs/foundry){target=_blank} also has Etherscan capabilities, but they are built into its Forge tool instead of being included in a separate plugin.

This guide will show you how to use both plugins to verify smart contracts deployed on Moonbase Alpha. This guide can also be adapted for Moonbeam and Moonriver.

## Checking Prerequisites {: #checking-prerequisites }

To follow along with this tutorial, you will need to have:

- [MetaMask installed and connected to the Moonbase Alpha](/tokens/connect/metamask/){target=_blank} TestNet
- An account funded with `DEV` tokens.
 --8<-- 'text/faucet/faucet-list-item.md'
- A Moonscan API key for the network you're trying to verify a contract on. For Moonbeam and Moonbase Alpha, you'll need a [Moonbeam Moonscan](https://moonscan.io/){target=_blank} API key. For Moonriver, you'll need a [Moonriver Moonscan](https://moonriver.moonscan.io/){target=_blank} API key
- Git installed and configured

## Generating a Moonscan API Key {: generating-a-moonscan-api-key }

To generate a Moonscan API Key, you will need to sign up for an account. Depending on which network you want to verify a contract on, you'll have to make sure you create an API key from the correct network on Moonscan. For Moonbeam or Moonbase Alpha, you can navigate to the [Moonbeam Moonscan](https://moonscan.io/){target=_blank}. For Moonriver, you can head to the [Moonriver Moonscan](https://moonriver.moonscan.io/){target=_blank}. To sign up for an account, you can take the following steps:

1. Click **Sign In**
2. Select **Click to sign up** and then register your new account

![Sign up for Moonscan](/images/builders/build/eth-api/verify-contracts/etherscan-plugins/plugins-1.png)

Once you have an account and are signed in, you will then be able to create an API key.

1. Select **API-KEYs** from the left side menu
2. To add a new key, click the **+ Add** button

![Add an API key](/images/builders/build/eth-api/verify-contracts/etherscan-plugins/plugins-2.png)

You will then be prompted to enter in an **AppName** for your API key and once you enter a name and click **Continue** it will appear in your list of API keys.

## Using the Hardhat Etherscan Plugin {: #using-the-hardhat-verify-plugin }

The example in this section of the guide will be based off of the `Box.sol` contract that was created in the [Using Hardhat to Deploy To Moonbeam](/builders/build/eth-api/dev-env/hardhat/){target=_blank} guide.

To get started with the Hardhat Etherscan plugin, you will need to first install the plugin library:

```bash
npm install --save-dev @nomicfoundation/hardhat-verify
```

!!! note
    Support for Moonbeam-based networks was added in version 3.0.1 of `@nomicfoundation/hardhat-verify`. You can double check what version you're using by looking under the `devDependencies` section of your `package.json` and updating to version 3.0.1 or greater if needed.

You can add your Moonscan API key to the `hardhat.config.js` file. For this example, you'll need a [Moonbeam Moonscan](https://moonscan.io/){target=_blank} API key. If you want to verify a contract on Moonriver, you'll need a [Moonriver Moonscan](https://moonriver.moonscan.io/){target=_blank} API key.

From within your Hardhat project, open your `hardhat.config.js` file. You'll need to import the `hardhat-verify` plugin, your Moonscan API key, and add the config for Etherscan:

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
      moonbeam: 'INSERT_MOONSCAN_API_KEY', // Moonbeam Moonscan API Key
      moonriver: 'INSERT_MOONSCAN_API_KEY', // Moonriver Moonscan API Key
      moonbaseAlpha: 'INSERT_MOONSCAN_API_KEY', // Moonbeam Moonscan API Key    
    }
  }
};
```

To verify the contract, you will run the `verify` command and pass in the address of the deployed contract and the network where it's deployed:

```bash
npx hardhat verify --network moonbase INSERT_CONTRACT_ADDRESS
```

In your terminal you should see the source code for your contract was successfully submitted for verification. If the verification was successful, you should see **Successfully verified contract** and there will be a link to the contract code on [Moonscan for Moonbase Alpha](https://moonbase.moonscan.io/){target=_blank}.

![Successful verification using hardhat-verify plugin](/images/builders/build/eth-api/verify-contracts/etherscan-plugins/plugins-3.png)

If you're verifying a contract that has constructor arguments, you'll need to run the above command and add the constructor arguments used to deploy the contract at the end of the command. For example:

```bash
npx hardhat verify --network moonbase INSERT_CONTRACT_ADDRESS INSERT_CONSTRUCTOR_ARGS
```

Please refer to the [Hardhat Verify documentation](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify){target=_blank} for help with additional use cases such as:

- [complex arguments](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#complex-arguments){target=_blank}
- [libraries with undetectable addresses](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#libraries-with-undetectable-addresses){target=_blank}
- using [multiple API keys](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#multiple-api-keys-and-alternative-block-explorers){target=_blank}
- using the [`verify` command programmatically](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#using-programmatically){target=_blank}
- [determining the correct constructor arguments](https://info.etherscan.com/determine-correct-constructor-argument-during-source-code-verification-on-etherscan/){target=_blank}

## Using the Truffle Verify Plugin {: #using-the-truffle-verify-plugin }

The example in this section of the guide will use the `MyToken.sol` contract that was created in the [Using Truffle to Deploy to Moonbeam](/builders/build/eth-api/dev-env/truffle/){target=_blank} guide.

To get started with `truffle-plugin-verify`, open your Truffle project and install the plugin:

```bash
npm install --save-dev truffle-plugin-verify
```

Next you'll need to add the plugin to your `truffle-config.js` file and add the Etherscan config. For this example, you'll need a [Moonbeam Moonscan](https://moonscan.io/){target=_blank} API key. If you want to verify a contract on Moonriver, you'll need a [Moonriver Moonscan](https://moonriver.moonscan.io/){target=_blank} API key. The Truffle config should resemble the following:

```js
module.exports = {
  networks: { ... },
  compilers: { ... },
  plugins: ['moonbeam-truffle-plugin', 'truffle-plugin-verify'],
  api_keys: {
    moonscan: 'INSERT_YOUR_MOONSCAN_API_KEY'
  }
}
```

To verify the contract, you will run the `run verify` command and pass in the deployed contract name and the network where it's deployed:

```bash
truffle run verify MyToken --network moonbase
```

If the contract verification was successful, in your terminal, you should see **Pass - Verified** with a link to the contract code on [Moonscan for Moonbase Alpha](https://moonbase.moonscan.io/){target=_blank}.

![Successful verification using truffle-verify-plugin](/images/builders/build/eth-api/verify-contracts/etherscan-plugins/plugins-4.png)

For further information on the plugin, please refer to the [README.md file](https://github.com/rkalis/truffle-plugin-verify#readme){target=_blank} of the `truffle-plugin-verify` GitHub repository.

## Using Foundry to Verify {: #using-foundry-to-verify }

The example in this section of the guide will use the `MyToken.sol` contract that was created in the [Using Foundry to Deploy to Moonbeam](/builders/build/eth-api/dev-env/foundry/){target=_blank} guide.

In addition to the Foundry project, you will need a [Moonbeam Moonscan](https://moonscan.io/){target=_blank} API key. This API key can be used for both the Moonbeam and Moonbase Alpha networks. If you want to verify a contract on Moonriver, you'll need a [Moonriver Moonscan](https://moonriver.moonscan.io/){target=_blank} API key.

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
    --etherscan-api-key INSERT_YOUR_MOONSCAN_API_KEY
    ```

=== "Moonriver"

    ```bash
    forge verify-contract --chain-id {{ networks.moonriver.chain_id }} \
    YOUR_CONTRACT_ADDRESS \
    --constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
    src/MyToken.sol:MyToken \
    --etherscan-api-key INSERT_YOUR_MOONSCAN_API_KEY
    ```

=== "Moonbase Alpha"

    ```bash
    forge verify-contract --chain-id {{ networks.moonbase.chain_id }} \
    YOUR_CONTRACT_ADDRESS \
    --constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
    src/MyToken.sol:MyToken \
    --etherscan-api-key INSERT_YOUR_MOONSCAN_API_KEY
    ```

![Foundry Verify](/images/builders/build/eth-api/verify-contracts/etherscan-plugins/plugins-5.png)

If you wanted to deploy the example contract and verify at the same time, then you would use the following command:

=== "Moonbeam"

    ```bash
    forge create --rpc-url {{ networks.moonbeam.rpc_url }} \
    --constructor-args 100 \
    --etherscan-api-key INSERT_YOUR_MOONSCAN_API_KEY \
    --verify --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken
    ```

=== "Moonriver"

    ```bash
    forge create --rpc-url {{ networks.moonriver.rpc_url }} \
    --constructor-args 100 \
    --etherscan-api-key INSERT_YOUR_MOONSCAN_API_KEY \
    --verify --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken
    ```

=== "Moonbase Alpha"

    ```bash
    forge create --rpc-url {{ networks.moonbase.rpc_url }} \
    --constructor-args 100 \
    --etherscan-api-key INSERT_YOUR_MOONSCAN_API_KEY \
    --verify --private-key YOUR_PRIVATE_KEY \
    src/MyToken.sol:MyToken
    ```

![Foundry Contract Deploy and Verify](/images/builders/build/eth-api/verify-contracts/etherscan-plugins/plugins-6.png)
