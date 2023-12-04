---
title: How to use OpenZeppelin Defender
description:  Learn how to use OpenZeppelin Defender to manage smart contracts securely on Moonbeam, thanks to its Ethereum compatibility features
---

# OpenZeppelin Defender

## Introduction {: #introduction }

[OpenZeppelin Defender](https://docs.openzeppelin.com/defender/){target=_blank} is a web-based application that allows developers to perform and automate smart contract operations in a secure way. Defender offers different components:

 - [**Admin**](https://docs.openzeppelin.com/defender/v1/admin){target=_blank} — to automate and secure all your smart contract operations such as access controls, upgrades, and pausing
 - [**Relay**](https://docs.openzeppelin.com/defender/v1/relay){target=_blank} — to build with a private and secure transaction infrastructure with the implementation of private relayers
 - [**Autotasks**](https://docs.openzeppelin.com/defender/v1/autotasks){target=_blank} — to create automated scripts to interact with your smart contracts
 - [**Monitor**](https://docs.openzeppelin.com/defender/v1/sentinel){target=_blank} — to monitor your smart contract's events, functions, and transactions, and receive notifications via email

OpenZeppelin Defender can now be used on Moonbeam, Moonriver, and the Moonbase Alpha TestNet. This guide will show you how to get started with Defender and demo the Admin component to pause a smart contract on Moonbase Alpha. This guide can be adapted for Moonbeam and Moonriver.

## Getting Started with Defender {: #getting-started-with-defender }

This section goes through the steps for getting started with OpenZeppelin Defender on Moonbase Alpha.

### Checking Prerequisites {: #checking-prerequisites }

The steps described in this section assume you have [MetaMask](https://metamask.io/){target=_blank} installed and connected to the Moonbase Alpha TestNet. If you haven't connected MetaMask to the TestNet, check out our [MetaMask integration guide](/tokens/connect/metamask/){target=_blank}.

In addition, you need to sign up for a free OpenZeppelin Defender account, which you can do on the main [Defender website](https://defender.openzeppelin.com/){target=_blank}.

The contract used in this guide is an extension of the `Box.sol` contract used in the [upgrading smart contracts guide](https://docs.openzeppelin.com/learn/upgrading-smart-contracts){target=_blank}, from the OpenZeppelin documentation. Also, the contract was made upgradable and [pausable](https://docs.openzeppelin.com/contracts/4.x/api/security#Pausable){target=_blank} to take full advantage of the Admin component. You can deploy your contract using the following code and following the [upgrading smart contracts guide](https://docs.openzeppelin.com/learn/upgrading-smart-contracts){target=_blank}:

```solidity
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

### Connecting Defender {: #connecting-defender }

Once you have an OpenZeppelin Defender account, log into the [Defender App](https://defender.openzeppelin.com/){target=_blank}. In the main screen, with MetaMask [connected to Moonbase Alpha](/tokens/connect/metamask/){target=_blank} click on the top right corner **Connect wallet** button:

![OpenZeppelin Defender Connect](/images/builders/build/eth-api/dev-env/openzeppelin/defender/oz-defender-1.png)

If successful, you should see your address and a text stating **Connected to Moonbase Alpha**.

## Using the Admin Component {: #using-the-admin-component }

This section goes through the steps for getting started with OpenZeppelin Defender Admin component to manage smart contracts on Moonbase Alpha.

### Importing your Contract {: #importing-your-contract }

The first step to using Defender Admin is to add the contract you want to manage. To do so, click on the **Add contract** button near the top right corner. This will take you to the **import contract** screen, where you need to:

 1. Set a contract name. This is only for display purposes
 2. Select the network where the contract that you want to manage is deployed. This is particularly useful when a contract is deployed with the same address to multiple networks. For this example, enter `Moonbase Alpha`
 3. Enter the contract address
 4. Paste the contract ABI. This can be obtained either in [Remix](/builders/build/eth-api/dev-env/remix/){target=_blank} or in the `.json` file generally created after the compilation process (for example, in Hardhat)
 5. Check that the contract features were detected correctly
 6. Once you've checked all the information, click on the **Add** button

![OpenZeppelin Defender Admin Add Contract](/images/builders/build/eth-api/dev-env/openzeppelin/defender/oz-defender-2.png)

If everything was successfully imported, you should see your contract in the Admin component main screen:

![OpenZeppelin Defender Admin Contract Added](/images/builders/build/eth-api/dev-env/openzeppelin/defender/oz-defender-3.png)

### Create a Contract Proposal {: #create-a-contract-proposal }

Proposals are actions to be carried out in the contract. At the time of writing, there are three main proposals/actions that can take place:

- **Pause** — available if the pause feature is detected. Pauses token transfers, minting and burning
- **Upgrade** — available if the upgrade feature is detected. Allows for a contract to be [upgraded via a proxy contract](https://docs.openzeppelin.com/learn/upgrading-smart-contracts){target=_blank}
- **Admin action** — call to any function in the managed contract

In this case, a new proposal is created to pause the contract. To do so, take the following steps:

 1. Click on the **New proposal** button to see all the available options
 2. Click on **Pause**

![OpenZeppelin Defender Admin Contract New Pause Proposal](/images/builders/build/eth-api/dev-env/openzeppelin/defender/oz-defender-4.png)

This will open the proposal page, where all the details regarding the proposal need to be filled in. In this example, you need to provide the following information:

 1. Admin account address. You can also leave this field empty if you want to run the action from your current wallet (if it has all the necessary permissions)
 2. Title of the proposal
 3. Description of the proposal. In here, you should provide as much detail as possible for other members/managers of the contract (if using a MultiSig wallet)
 4. Click on **Create pause proposal**

![OpenZeppelin Defender Admin Contract Pause Proposal Details](/images/builders/build/eth-api/dev-env/openzeppelin/defender/oz-defender-5.png)

Once the proposal is successfully created, it should be listed in the contract's admin dashboard.

![OpenZeppelin Defender Admin Contract Proposal List](/images/builders/build/eth-api/dev-env/openzeppelin/defender/oz-defender-6.png)

### Approve a Contract Proposal {: #approve-a-contract-proposal }

With the contract proposal created, the next step is to approve and execute it. To do so, go to the proposal and click on **Approve and Execute**.

![OpenZeppelin Defender Admin Contract Proposal Pause Approve](/images/builders/build/eth-api/dev-env/openzeppelin/defender/oz-defender-7.png)

This will initiate a transaction that needs to be signed using MetaMask, after which the proposal state should change to **Executed (confirmation pending)**. Once the transaction is processed, the status should show **Executed**.

![OpenZeppelin Defender Admin Contract Proposal Pause Executed](/images/builders/build/eth-api/dev-env/openzeppelin/defender/oz-defender-8.png)

You can also see that the contract's status has changed from **Running** to **Paused**. Great! You now know how to use the Admin component to manage your smart contracts.

--8<-- 'text/_disclaimers/third-party-content.md'