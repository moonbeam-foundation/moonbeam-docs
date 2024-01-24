---
title: How to use OpenZeppelin Defender
description:  Learn how to use OpenZeppelin Defender to manage smart contracts securely on Moonbeam, thanks to its Ethereum compatibility features
---

# OpenZeppelin Defender

## Introduction {: #introduction }

[OpenZeppelin Defender](https://docs.openzeppelin.com/defender/){target=_blank} is a web-based application that allows developers to perform and automate smart contract operations in a secure way. Defender V2 offers the following components:

 - [**Code Inspector**](https://defender.openzeppelin.com/v2/#/code){target=_blank} — Automatic code analysis powered by AI models and tools developed by OpenZeppelin engineers
 - [**Audit**](https://defender.openzeppelin.com/v2/#/audit){target=_blank} — Manage the smart contract audit process and track issues and resolutions
 - [**Deploy**](https://defender.openzeppelin.com/v2/#/deploy){target=_blank} — Manage deployments and upgrades to ensure secure releases
 - [**Monitor**](https://defender.openzeppelin.com/v2/#/monitor){target=_blank} — to monitor your smart contract's events, functions, and transactions, and receive notifications via email
 - [**Incident Response**](https://defender.openzeppelin.com/v2/#/incident-response){target=_blank} — Configure predefined incident response scenarios triggered automatically by monitors or on-demand
 - [**Actions**](https://defender.openzeppelin.com/v2/#/actions/automatic){target=_blank} — Create automated actions to perform on-chain and off-chain operations
 - [**Access Control**](https://defender.openzeppelin.com/v2/#/access-control/contracts){target=_blank} — Manage smart contract accounts, roles, and permissions easily


OpenZeppelin Defender can be used on Moonbeam, Moonriver, and the Moonbase Alpha TestNet. This guide will show you how to get started with Defender and demonstrate using OpenZeppelin Actions and Access Control to pause a smart contract on Moonbase Alpha. This guide can be adapted for Moonbeam and Moonriver.

## Getting Started with Defender {: #getting-started-with-defender }

This section goes through the steps for getting started with OpenZeppelin Defender on Moonbase Alpha.

### Checking Prerequisites {: #checking-prerequisites }

The steps described in this section assume you have [MetaMask](https://metamask.io/){target=_blank} installed and connected to the Moonbase Alpha TestNet. If you haven't connected MetaMask to the TestNet, check out our [MetaMask integration guide](/tokens/connect/metamask/){target=_blank}.

In addition, you need to sign up for a free OpenZeppelin Defender account, which you can do on the main [Defender website](https://defender.openzeppelin.com/v2/#/overview){target=_blank}.

### Deploying the Pausable Box Contract {: #deploying-the-pauseable-box-contract }

The contract used in this guide is an extension of the `Box.sol` contract used in the [upgrading smart contracts guide](https://docs.openzeppelin.com/learn/upgrading-smart-contracts){target=_blank} from the OpenZeppelin documentation. Also, the contract was made upgradable and [pausable](https://docs.openzeppelin.com/contracts/4.x/api/security#Pausable){target=_blank} to take full advantage of the Admin component. You can deploy your contract using the following code and following the [upgrading smart contracts guide](https://docs.openzeppelin.com/learn/upgrading-smart-contracts){target=_blank}:

```solidity
--8<-- 'code/builders/build/eth-api/dev-env/openzeppelin/PausableBox.sol'
```

!!! note
    After deploying the above contract using Remix or another tool such as Hardhat, you'll need to call the `initialize` function to properly set the owner of the upgradeable contract. If you don't call this function, the owner will be set to the zero address, and you will be unable to proceed with the remainder of this tutorial.


## Using the Access Control Component {: #using-the-access-control-component }

This section goes through the steps for getting started with the [OpenZeppelin Defender Access Control component](https://defender.openzeppelin.com/v2/#/access-control/contracts){target=_blank} to manage smart contracts on Moonbase Alpha.

### Importing Your Contract {: #importing-your-contract }

The first step to using Defender Access Control is to add the contract you want to manage. To do so, take the following steps:

 1. Click on the **Access Control** menu item 
 2. Click **Add Contract**
 3. Add a name for your contract
 4. Select the **Network** on which the contract is deployed. For the demo, Moonbase Alpha is selected
 5. Paste the contract address
 6. If you have verified your contract, the ABI will be automatically imported. Otherwise, paste the contract ABI. This can be obtained either in [Remix](https://remix.ethereum.org/){target=_blank} or in the `.json` file generally created after the compilation process (for example, in Hardhat)
 7. Once you've checked all the information, click on the **Create** button

![OpenZeppelin Defender Access Control Add Contract](/images/builders/build/eth-api/dev-env/openzeppelin/defender/new/oz-defender-1.webp)

If everything was successfully imported, you should see your contract on the **Access Control Contracts** main screen. You should see the address that you used to deploy the Pausable Box contract in the **Owner** field. If you see `0x0000000000000000000000000000000000000000`, this means that you didn't call the `initialize` function after deploying the Pausable Box contract. To simplify a later step, take a moment to add your address to your Defender Address Book by hovering over the address in the **Owner** field and clicking **Import into Defender 2.0**.  

![OpenZeppelin Defender Access Control Contract Added](/images/builders/build/eth-api/dev-env/openzeppelin/defender/new/oz-defender-2.webp)

Then, you can add your address to the Defender Address Book as follows: 

1. Enter a name for your address
2. Select the relevant network that the address pertains to
3. Paste the address
4. Review all the information and press **Create**

![OpenZeppelin Defender Manage Address Book](/images/builders/build/eth-api/dev-env/openzeppelin/defender/new/oz-defender-3.webp)

### Create a Contract Proposal {: #create-a-contract-proposal }

Proposals are actions to be carried out in the contract. You can propose any function of the contract to be enacted, including but not limited to:

- **Pause** — available if the pause feature is detected. Pauses token transfers, minting, and burning
- **Upgrade** — available if the upgrade feature is detected. Allows for a contract to be [upgraded via a proxy contract](https://docs.openzeppelin.com/learn/upgrading-smart-contracts){target=_blank}
- **Admin action** — call to any function in the managed contract

In this case, a new proposal is created to pause the contract. To do so, take the following steps:

 1. Click on the **Actions** menu item 
 2. Click **Transaction Proposals**
 3. Enter a name for the proposal
 4. Optionally, you may enter a description of the proposal
 5. Select the target contract from the dropdown of [imported contracts](#importing-your-contract)
 6. Select the function to be carried out as part of the proposal
 7. Select the desired approval process. For demo purposes, a simple approval process consisting of only the owner will be created in the following step 

![OpenZeppelin Defender Actions New Pause Proposal](/images/builders/build/eth-api/dev-env/openzeppelin/defender/new/oz-defender-4.webp)

To create a simple new approval process consisting of only the contract owner, take the following steps:

 1. Enter a name for the approval process
 2. Select **EOA**
 3. Select the owner of the Pausable Box contract
 4. Review all information and press **Save Changes**

![OpenZeppelin Defender Actions Create Approval Process](/images/builders/build/eth-api/dev-env/openzeppelin/defender/new/oz-defender-5.webp)

The last step remaining is to submit the transaction proposal. To do so, take the following steps:

1. Press **Connect Wallet** and connect your EVM account to Defender
2. Press **Submit Transaction Proposal**

![OpenZeppelin Defender Actions Contract Submit Proposal](/images/builders/build/eth-api/dev-env/openzeppelin/defender/new/oz-defender-6.webp)


### Approve a Contract Proposal {: #approve-a-contract-proposal }

Press **Continue**, and you'll be taken to the proposal status page. Here, you'll be able to execute the proposal. Press **Approve and Execute**, and confirm the transaction in your EVM wallet. Once the transaction is processed, the status should show **Executed**.

![OpenZeppelin Defender Actions Contract Proposal Pause Approve and Execute](/images/builders/build/eth-api/dev-env/openzeppelin/defender/new/oz-defender-7.webp)

If all went smoothly, your Pausable Box Contract is now paused. If you'd like to try out additional scenarios, you can try creating a proposal to unpause your contract. And that's it! You're now well on your way to mastering OpenZeppelin Defender to manage your smart contracts on Moonbeam. For more information, be sure to check out the [OpenZeppelin Defender Docs](https://docs.openzeppelin.com/defender/v2/){target=_blank}. 

--8<-- 'text/_disclaimers/third-party-content.md'