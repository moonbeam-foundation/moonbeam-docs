---
title: Defender
description:  Learn how to use OpenZeppelin Defender to manage smart contracts in a secure way on Moonbeam thanks to its Ethereum compatibility features
---

# OpenZeppelin Defender

![OpenZeppelin Defender Banner](/images/openzeppelin/ozdefender-banner.png)

## Introduction

OpenZeppelin Defender is a web-based application that allows developers to perform and automate smart contracts operations in a secure way. Defender offers different components:

 - [**Admin**](https://docs.openzeppelin.com/defender/admin) — to automate and secure all your smart contract operations such as access controls, upgrades and pausing
 - [**Relay**](https://docs.openzeppelin.com/defender/relay) — to build with a private and secure transaction infrastructure with the implementation of private relayers
 - [**Autotasks**](https://docs.openzeppelin.com/defender/autotasks) — to create automated scripts to interact with your smart contracts
 - [**Sentinel**](https://docs.openzeppelin.com/defender/sentinel) — to monitor your smart contract's events, functions, and transactions, and receive notifications via email
 - [**Advisor**](https://docs.openzeppelin.com/defender/advisor) — to learn and implement best practices around development, testing, monitoring and operations

OpenZeppelin Defender can now be used on the Moonbase Alpha TestNet. This guide will show you how to get started with Defender, and demo Admin component to pause a smart contract. You can find more information in regards to the other components in the links mentioned above.

For more information, the OpenZeppelin team has written a great [documentation site](https://docs.openzeppelin.com/defender/) for Defender.

## Getting Started with Defender on Moonbase Alpha

This section goes through the steps for getting started with OpenZeppelin Defender on Moonbase Alpha
 
### Checking Prerequisites

The steps described in this section assumes you have [MetaMask](https://metamask.io/) installed and connected to the Moonbase Alpha TestNet. If you haven't connected MetaMask to the TestNet, check out our [MetaMask integration guide](/integrations/wallets/metamask/).

In addition, you need to sign up for a free OpenZeppelin Defender account, which you can do in the main [Defender website](https://defender.openzeppelin.com/).

The contract used in this guide is an extension of the `Box.sol` contract used in the [upgrading smart contracts guide](https://docs.openzeppelin.com/learn/upgrading-smart-contracts), from the OpenZeppelin documentation. To take full advantage of the Admin component, the contract was made upgradable and the [Pausable module](https://docs.openzeppelin.com/contracts/4.x/api/security#Pausable) was added. You can deploy your own contract using the following code, and following the [upgrading smart contracts guide](https://docs.openzeppelin.com/learn/upgrading-smart-contracts):

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract PausableBox is Initializable, PausableUpgradeable, OwnableUpgradeable {
    uint256 private value;
 
    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    // Initialize
    function initialize() initializer public {
        __Ownable_init();
        __Pausable_init_unchained();
    }
 
    // Stores a new value in the contract
    function store(uint256 newValue) whenNotPaused public {
        value = newValue;
        emit ValueChanged(newValue);
    }
 
    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }
    
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
```

### Connecting Defender to Moonbase Alpha

Once you have an OpenZeppelin Defender account, log into the [Defender App](https://defender.openzeppelin.com/). In the main screen, with MetaMask [connected to Moonbase Alpha](/getting-started/testnet/metamask/)click on the top right corner "Connect wallet" button:

![OpenZeppelin Defender Connect](/images/openzeppelin/ozdefender-images1.png)

If successful, you should see your address and a text stating "Connected to Moonbase Alpha".

## Using the Admin Component

This section goes through the steps for getting started with OpenZeppelin Defender Admin component to manage smart contracts on Moonbase Alpha

### Importing you Contract

The first step to use Defender Admin is to add the contract you want to manage. To do so, click on the "Add contract" button near the top right corner. This will take you to the "import contract" screen, where you need to:

 1. Set a contract name, this is only for display purposes
 2. Select the network where the contract that you want to manage is deployed. This is particularly useful when a contract is deployed with the same address to multiple networks. For this example, enter `Moonbase Alpha`
 3. Enter the contract address
 4. Paste the contract ABI. This can be obtained either in [Remix](/integrations/remix/), or in the `.json` file normally created after the compilation process (for example, in Truffle or HardHat)
 5. Check that the contract features were detected correctly
 6. Once you've check all the information, click on the "Add" button

![OpenZeppelin Defender Admin Add Contract](/images/openzeppelin/ozdefender-images2.png)

If everything was successfully imported, you should see your contract in the Admin component main screen:

![OpenZeppelin Defender Admin Contract Added](/images/openzeppelin/ozdefender-images3.png)

### Create a Contract Proposal

Proposal are actions to be carried out in the contract. At the time of writing there are three main proposals/actions that can take place:

- **Pause** — available if the pause feature is detected. Pauses token transfers, minting and burning
- **Upgrade** — available if the upgrade feature is detected. Allows for a contract to be upgraded via 
