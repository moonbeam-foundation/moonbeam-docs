---
title: Etherscan Plugins
description: Learn about how to verify smart contracts on Moonbeam networks using the Etherscan plugins made available by Hardhat and Truffle
---

# Verify Smart Contracts with Etherscan Plugins

![Etherscan Plugins Banner](/images/builders/interact/verify-contracts/etherscan-plugins/plugins-banner.png)

## Introduction {: #introduction } 

Verifying smart contracts is a great way of improving the transparency and security of contracts deployed on Moonbeam. There are a couple of plugins that integrate with Etherscan's contract verification service, including the [`hardhat-etherscan` plugin](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html){target=blank} and the [`truffle-plugin-verify` plugin](https://github.com/rkalis/truffle-plugin-verify){target=blank}. Both plugins can be used to automate the process of verifying contracts by locally detecting which contracts to verify and which Solidity libraries are required, if any.

The Hardhat plugin integrates seamlessly into your Hardhat project, and likewise the Truffle plugin integrates into your Truffle project.

This guide will show you how to use both plugins to verify smart contracts deployed on Moonbase Alpha. This guide can also be adapted for Moonbeam and Moonriver.

## Checking Prerequisites {: #checking-prerequisites }

To follow along with this tutorial, you will need to have:

- [MetaMask installed and connected to the Moonbase Alpha](/tokens/connect/metamask/){target=blank} TestNet
- An account funded with `DEV` tokens. You can obtain tokens for testing purposes from the Moonbase Alpha [faucet](/builders/get-started/moonbase/#get-tokens/){target=blank}
- A [Moonscan API key](#generating-a-moonscan-api-key)

## Generating a Moonscan API Key {: generating-a-moonscan-api-key }

To generate a Moonscan API Key, you will need to sign up for an account. You can get started by navigating to [Moonscan](https://moonscan.io/){target=blank}, and to sign up for an account, you can take the following steps:

1. Click **Sign In**
2. Select **Click to sign up** and then register your new account

![Sign up for Moonscan](/images/builders/interact/verify-contracts/etherscan-plugins/plugins-1.png)


Once you have an account and are signed in, you will then be able to create an API key. 

1. Select **API-KEYs** from the left side menu
2. To add a new key, click the **+ Add** button

![Add an API key](/images/builders/interact/verify-contracts/etherscan-plugins/plugins-2.png)

You will then be prompted to enter in an **AppName** for your API key and once you enter a name and click **Continue** it will appear in your list of API keys. 

## Using the Hardhat Etherscan Plugin {: #using-the-hardhat-etherscan-plugin }

The example in this section of the guide will be based off of the `Box.sol` contract that was created in the [Using Hardhat to Deploy To Moonbeam](/builders/interact/hardhat/){target=blank} guide. 

To get started with the Hardhat Etherscan plugin, you will need to first install the plugin library:

```
npm install --save-dev @nomiclabs/hardhat-etherscan
```

You can add your Moonscan API key to the `secrets.json` file alongside your private key.

From within your Hardhat project, open your `hardhat.config.js` file. You'll need to import the `hardhat-etherscan` plugin, your Moonscan API key, and add the config for Etherscan:

```js
require("@nomiclabs/hardhat-etherscan");

const { privateKey, moonscanApiKey } = require('./secrets.json');

module.exports = {
  networks: {
    moonbase: { ... }
  },
  etherscan: {
    apiKey: moonscanApiKey
  }
};
```

To verify the contract, you will run the `verify` command and pass in the address of the deployed contract and the network where it's deployed:

```
npx hardhat verify --network moonbase <CONTRACT-ADDRESS>
```

In your terminal you should see the source code for your contract was successfully submitted for verification. If the verification was successful, you should see **Successfully verified contract** and there will be a link to the contract code on [Moonscan for Moonbase Alpha](https://moonbase.moonscan.io/){target=blank}.

If you're verifying a contract that has constructor arguments, you'll need to run the above command and add the constructor arguments used to deploy the contract at the end of the command. For example:

```
npx hardhat verify --network moonbase <CONTRACT-ADDRESS> "<constructor argument>"
```

Please refer to the [Hardhat Etherscan documentation](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html){target=blank} if you're trying to verify a contract with [complex arguments](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html#complex-arguments){target=blank} or [libraries with undetectable addresses](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html#libraries-with-undetectable-addresses){target=blank}. Or if you want to use [multiple API keys](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html#multiple-api-keys-and-alternative-block-explorers){target=blank} or use the [`verify` command programmatically](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html#using-programmatically){target=blank}. 

## Using the Truffle Verify Plugin {: #using-the-truffle-verify-plugin }

The example in this section of the guide will use the `MyToken.sol` contract that was created in the [Using Truffle to Deploy to Moonbeam](/builders/interact/truffle/){target=blank} guide.

To get started with `truffle-plugin-verify`, open your Truffle project and install the plugin:

```
npm install --save-dev truffle-plugin-verify
```

Next you'll need to add the plugin to your `truffle-config.js` file and add the Etherscan config:

```js
module.exports = {
  networks: { ... },
  compilers: { ... },
  plugins: ['moonbeam-truffle-plugin', 'truffle-plugin-verify'],
  api_keys: {
    moonscan: 'INSERT-YOUR-MOONSCAN-API-KEY'
  }
}
```

To verify the contract, you will run the `run verify` command and pass in the deployed contract name and the network where it's deployed:

```
truffle run verify MyToken --network moonbase
```

If the contract verification was successful, in your terminal, you should see **Pass - Verified** with a link to the contract code on [Moonscan for Moonbase Alpha](https://moonbase.moonscan.io/){target=blank}.

For further information on the plugin, please refer to the [README.md file](https://github.com/rkalis/truffle-plugin-verify#readme){target=blank} of the `truffle-plugin-verify` GitHub repository.